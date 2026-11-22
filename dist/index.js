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
function te(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var C = {}, ne = [], re = () => {}, ie = () => !1, ae = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), oe = (e) => e.startsWith("onUpdate:"), w = Object.assign, se = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ce = Object.prototype.hasOwnProperty, T = (e, t) => ce.call(e, t), E = Array.isArray, le = (e) => _e(e) === "[object Map]", ue = (e) => _e(e) === "[object Set]", de = (e) => _e(e) === "[object Date]", fe = (e) => _e(e) === "[object RegExp]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", pe = (e) => typeof e == "symbol", me = (e) => typeof e == "object" && !!e, he = (e) => (me(e) || D(e)) && D(e.then) && D(e.catch), ge = Object.prototype.toString, _e = (e) => ge.call(e), ve = (e) => _e(e).slice(8, -1), ye = (e) => _e(e) === "[object Object]", be = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, xe = /* @__PURE__ */ te(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), Se = (e) => {
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
var Ve = /* @__PURE__ */ te("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
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
var Ht = /* @__PURE__ */ te("__proto__,__v_isRef,__isVue"), Ut = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(pe));
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
		return !t && kt(a, "iterate", c ? Dt : Et), w(Object.create(l), { next() {
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
	return w(n, e ? {
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
function Ln(e, t, n = C) {
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
	} : re, t && i) {
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
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || C;
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
function ur(e, t) {
	if (sr === null) return e;
	let n = Wa(sr), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = C] = t[e];
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
function dr(e, t, n, r) {
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
function fr(e, t, n = !1) {
	let r = ja();
	if (r || mi) {
		let i = mi ? mi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
var pr = /* @__PURE__ */ Symbol.for("v-scx"), mr = () => fr(pr);
function hr(e, t) {
	return _r(e, null, t);
}
function gr(e, t) {
	return _r(e, null, { flush: "sync" });
}
function P(e, t, n) {
	return _r(e, t, n);
}
function _r(e, t, n = C) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = w({}, n), c = t && r || !t && a !== "post", l;
	if (La) {
		if (a === "sync") {
			let e = mr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = re, e.resume = re, e.pause = re, e;
		}
	}
	let u = Aa;
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
	return La && (l ? l.push(f) : c && f()), f;
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
		let n = ja(), r = Sr();
		return () => {
			let i = t.default && Nr(t.default(), !0), a = i && i.length ? Er(i) : n.subTree ? U() : void 0;
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
	}, te = {
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
				s || (s = !0, S(e ? o : i, [t]), te.delayedLeave && te.delayedLeave(), t[xr] = void 0);
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
	return te;
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
	return D(e) ? /* @__PURE__ */ w({ name: e.name }, t, { setup: e }) : e;
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
	let a = r.shapeFlag & 4 ? Wa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === C ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ bn(d), p = d === C ? ie : (e) => !Ir(u, e) && T(f, e), m = (e, t) => !(t && Ir(u, t));
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
		let n = ja(), r = n.ctx;
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
				t && Ta(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			ea(t.m), ea(t.a), l(e, f, null, 1, s), Gi(() => {
				t.da && Ae(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && Ta(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Wr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ga(Br(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !ma(t, o)) ? p(t) : o && (Wr(o), t && Wr(t)), i.delete(e), a.delete(e);
		}
		P(() => [e.include, e.exclude], ([e, t]) => {
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
			let c = s.type, l = Ga(Br(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
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
function Kr(e, t, n = Aa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			vt();
			let i = Pa(n), a = Bn(t, n, e, r);
			return i(), yt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var qr = (e) => (t, n = Aa) => {
	(!La || e === "sp") && Kr(e, (...e) => t(...e), n);
}, Jr = qr("m"), Yr = qr("u"), Xr = qr("bum"), Zr = "components", Qr = /* @__PURE__ */ Symbol.for("v-ndc");
function $r(e) {
	return O(e) ? ei(Zr, e, !1) || e : e || Qr;
}
function ei(e, t, n = !0, r = !1) {
	let i = sr || Aa;
	if (i) {
		let n = i.type;
		if (e === Zr) {
			let e = Ga(n, !1);
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
		let e = a != null && n.key == null ? w({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
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
var ai = (e) => e ? Ia(e) ? Wa(e) : ai(e.parent) : null, oi = /* @__PURE__ */ w(/* @__PURE__ */ Object.create(null), {
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
	$watch: (e) => re
}), si = (e, t) => e !== C && !e.__isScriptSetup && T(e, t), ci = {
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
			else if (n !== C && T(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = oi[t], u, d;
		if (l) return t === "$attrs" && kt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== C && T(n, t)) return o[t] = 4, n[t];
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
	return !e || !t ? e || t : E(e) && E(t) ? e.concat(t) : w({}, li(e), li(t));
}
function di() {
	return {
		app: null,
		config: {
			isNativeTag: ie,
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
		D(n) || (n = w({}, n)), r != null && !me(r) && (r = null);
		let i = di(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: fi++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ja,
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Wa(u.component);
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
function hi(e, t, n = C) {
	let r = ja(), i = we(t), a = Ee(t), o = gi(e, i), s = An((o, s) => {
		let c, l = C, u;
		return gr(() => {
			let t = e[i];
			ke(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!ke(o, c) && !(l !== C && ke(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), ke(e, l) && (ke(e, o) && !ke(o, u) || f && l !== C && !ke(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || C : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var gi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${we(t)}Modifiers`] || e[`${Ee(t)}Modifiers`];
function _i(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || C, i = n, a = t.startsWith("update:"), o = a && gi(r, t.slice(7));
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
	return a ? (E(a) ? a.forEach((e) => o[e] = null) : w(o, a), me(e) && r.set(e, o), o) : (me(e) && r.set(e, null), null);
}
function yi(e, t) {
	return !e || !ae(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), T(e, t[0].toLowerCase() + t.slice(1)) || T(e, Ee(t)) || T(e, t));
}
function bi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = lr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = xa(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = xa(e.length > 1 ? e(d, {
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
		e.length && t & 7 && (a && e.some(oe) && (v = Ci(v, a)), y = ya(y, v, !1, !0));
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
	for (let n in e) (n === "class" || n === "style" || ae(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Ci = (e, t) => {
	let n = {};
	for (let r in e) (!oe(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
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
		let t = /* @__PURE__ */ bn(n), r = s || C;
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
					let o = Pa(i);
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
	if (!a) return me(e) && r.set(e, ne), ne;
	if (E(a)) for (let e = 0; e < a.length; e++) {
		let t = we(a[e]);
		Ii(t) && (o[t] = C);
	}
	else if (a) for (let e in a) {
		let t = we(e);
		if (Ii(t)) {
			let n = a[e], r = o[t] = E(n) || D(n) ? { type: n } : w({}, n), i = r.type, c = !1, l = !0;
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
var Li = (e) => e === "_" || e === "_ctx" || e === "$stable", Ri = (e) => E(e) ? e.map(xa) : [xa(e)], zi = (e, t, n) => {
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
	let { vnode: r, slots: i } = e, a = !0, o = C;
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
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = re, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ma(e, t) && (r = _e(e), O(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === ne && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
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
				w(e, t, n, r, i, a, o, s, c);
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
				n && n._beginPatch(), ie(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && te(e.children, f, null, i, s, Ji(e, c), l, d), _ && dr(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !xe(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Ta(p, i, e);
		}
		_ && dr(e, null, i, "beforeMount");
		let v = Xi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Gi(() => {
			try {
				p && Ta(p, i, e), v && g.enter(f), _ && dr(e, null, i, "mounted");
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
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Sa(e[l]) : xa(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, ie = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || C, m = t.props || C, h;
		if (n && Yi(n, !1), (h = m.onVnodeBeforeUpdate) && Ta(h, n, t, e), f && dr(t, e, n, "beforeUpdate"), n && Yi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ae(e.dynamicChildren, d, c, n, r, Ji(t, i), o) : s || ue(e, t, c, null, n, r, Ji(t, i), o, !1), l > 0) {
			if (l & 16) oe(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && oe(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Gi(() => {
			h && Ta(h, n, t, e), f && dr(t, e, n, "updated");
		}, r);
	}, ae = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ta(c), f = u && (c.type === L || !ma(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, oe = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== C) for (let o in t) !xe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (xe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, w = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), te(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ae(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Zi(e, t, !0)) : ue(e, t, n, f, a, o, c, l, u);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ce(t, n, r, i, a, o, c) : T(e, t, c);
	}, ce = (e, t, n, r, i, a, o) => {
		let s = e.component = ka(e, r, i);
		if (Vr(e) && (s.ctx.renderer = ye), Ra(s, !1, o), s.asyncDep) {
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
				Yi(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && Ae(n), (f = t.props && t.props.onVnodeBeforeUpdate) && Ta(f, s, t, c), Yi(e, !0);
				let p = bi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), _e(m), e, i, a), t.el = p.el, u === null && Di(e, p.el), r && Gi(r, i), (f = t.props && t.props.onVnodeUpdated) && Gi(() => Ta(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Br(t);
				if (Yi(e, !1), l && Ae(l), !m && (o = c && c.onVnodeBeforeMount) && Ta(o, d, t), Yi(e, !0), s && Se) {
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
					Gi(() => Ta(o, d, e), i);
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
		m & 8 ? (d & 16 && ge(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? fe(l, f, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && te(f, n, r, i, a, o, s, c));
	}, de = (e, t, n, r, i, a, o, s, c) => {
		e ||= ne, t ||= ne;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? Sa(t[f]) : xa(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? ge(e, i, a, !0, !1, d) : te(t, n, r, i, a, o, s, c, d);
	}, fe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? Sa(t[l]) : xa(t[l]);
			if (ma(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? Sa(t[f]) : xa(t[f]);
			if (ma(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? Sa(t[l]) : xa(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) O(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? Sa(t[l]) : xa(t[l]);
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
			let ee = b ? Qi(S) : ne;
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
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ta(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && dr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ye, r) : l && !l.hasOnce && (a !== L || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === L && d & 384 || !i && u & 16) && ge(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Gi(() => {
			_ && Ta(_, t, e), h && dr(e, null, t, "unmounted"), v && (e.el = null);
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
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oa());
	}, ye = {
		p: h,
		um: O,
		m: D,
		r: pe,
		mt: ce,
		mc: te,
		pc: ue,
		pbc: ae,
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
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Sa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Zi(t, a)), a.type === ia && (a.patchFlag === -1 && (a = i[e] = Sa(a)), a.el = t.el), a.type === aa && !a.el && (a.el = t.el);
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
	return e.dynamicChildren = ua > 0 ? ca || ne : null, la(), ua > 0 && ca && ca.push(e), e;
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
	return s ? (Ca(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), ua > 0 && !o && ca && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ca.push(c), c;
}
var H = _a;
function _a(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Qr) && (e = aa), pa(e)) {
		let r = ya(e, t, !0);
		return n && Ca(r, n), ua > 0 && !a && ca && (r.shapeFlag & 6 ? ca[ca.indexOf(e)] = r : ca.push(r)), r.patchFlag = -2, r;
	}
	if (Ka(e) && (e = e.__vccOpts), t) {
		t = va(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = k(e)), me(n) && (/* @__PURE__ */ yn(n) && !E(n) && (n = w({}, n)), t.style = Ie(n));
	}
	let o = O(e) ? 1 : na(e) ? 128 : yr(e) ? 64 : me(e) ? 4 : D(e) ? 2 : 0;
	return V(e, t, n, r, i, o, a, !0);
}
function va(e) {
	return e ? /* @__PURE__ */ yn(e) || Ai(e) ? w({}, e) : e : null;
}
function ya(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wa(i || {}, t) : i, u = {
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
function ba(e = " ", t = 0) {
	return H(ia, null, e, t);
}
function U(e = "", t = !1) {
	return t ? (R(), B(aa, null, e)) : H(aa, null, e);
}
function xa(e) {
	return e == null || typeof e == "boolean" ? H(aa) : E(e) ? H(L, null, e.slice()) : pa(e) ? Sa(e) : H(ia, null, String(e));
}
function Sa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ya(e);
}
function Ca(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (E(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ca(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ai(t) ? t._ctx = sr : r === 3 && sr && (sr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (D(t)) {
		if (r & 65) {
			Ca(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: sr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ba(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wa(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = Ie([t.style, r.style]);
		else if (ae(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(E(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !oe(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ta(e, t, n, r = null) {
	Bn(e, t, 7, [n, r]);
}
var Ea = di(), Da = 0;
function Oa() {
	return Da;
}
function ka(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Ea, a = {
		uid: Da++,
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
		propsDefaults: C,
		inheritAttrs: r.inheritAttrs,
		ctx: C,
		data: C,
		props: C,
		attrs: C,
		slots: C,
		refs: C,
		setupState: C,
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
var Aa = null, ja = () => Aa || sr, Ma, Na;
{
	let e = Fe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ma = t("__VUE_INSTANCE_SETTERS__", (e) => Aa = e), Na = t("__VUE_SSR_SETTERS__", (e) => La = e);
}
var Pa = (e) => {
	let t = Aa;
	return Ma(e), e.scope.on(), () => {
		e.scope.off(), Ma(t);
	};
}, Fa = () => {
	Aa && Aa.scope.off(), Ma(null);
};
function Ia(e) {
	return e.vnode.shapeFlag & 4;
}
var La = !1;
function Ra(e, t = !1, n = !1) {
	t && Na(t);
	let { props: r, children: i } = e.vnode, a = Ia(e);
	ji(e, r, a, t), Ui(e, i, n || t);
	let o = a ? za(e, t) : void 0;
	return t && Na(!1), o;
}
function za(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ci);
	let { setup: r } = n;
	if (r) {
		vt();
		let n = e.setupContext = r.length > 1 ? Ua(e) : null, i = Pa(e), a = zn(r, e, 0, [e.props, n]), o = he(a);
		if (yt(), i(), (o || e.sp) && !Br(e) && Fr(e), o) {
			if (a.then(Fa, Fa), t) return a.then((n) => {
				Na(!0);
				try {
					Ba(e, n, t);
				} finally {
					Na(!1);
				}
			}).catch((t) => {
				Vn(t, e, 0);
			});
			e.asyncDep = a;
		} else Ba(e, a, t);
	} else Va(e, t);
}
function Ba(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : me(t) && (e.setupState = On(t)), Va(e, n);
}
function Va(e, t, n) {
	let r = e.type;
	e.render ||= r.render || re;
}
var Ha = { get(e, t) {
	return kt(e, "get", ""), e[t];
} };
function Ua(e) {
	return {
		attrs: new Proxy(e.attrs, Ha),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Wa(e) {
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
function Ga(e, t = !0) {
	return D(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ka(e) {
	return D(e) && "__vccOpts" in e;
}
var W = (e, t) => /* @__PURE__ */ Mn(e, t, La);
function qa(e, t, n) {
	try {
		da(-1);
		let r = arguments.length;
		return r === 2 ? me(t) && !E(t) ? pa(t) ? H(e, null, [t]) : H(e, t) : H(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && pa(n) && (n = [n]), H(e, t, n));
	} finally {
		da(1);
	}
}
var Ja = "3.5.44", Ya = void 0, Xa = typeof window < "u" && window.trustedTypes;
if (Xa) try {
	Ya = /* @__PURE__ */ Xa.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Za = Ya ? (e) => Ya.createHTML(e) : (e) => e, Qa = "http://www.w3.org/2000/svg", $a = "http://www.w3.org/1998/Math/MathML", eo = typeof document < "u" ? document : null, to = eo && /* @__PURE__ */ eo.createElement("template"), no = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? eo.createElementNS(Qa, e) : t === "mathml" ? eo.createElementNS($a, e) : n ? eo.createElement(e, { is: n }) : eo.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => eo.createTextNode(e),
	createComment: (e) => eo.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => eo.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			to.innerHTML = Za(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = to.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, ro = "transition", io = "animation", ao = /* @__PURE__ */ Symbol("_vtc"), oo = {
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
}, so = /* @__PURE__ */ w({}, wr, oo), co = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = so, e))((e, { slots: t }) => qa(Dr, fo(e), t)), lo = (e, t = []) => {
	E(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, uo = (e) => e ? E(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function fo(e) {
	let t = {};
	for (let n in e) n in oo || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = po(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: te = y } = t, C = (e, t, n, r) => {
		e._enterCancelled = r, go(e, t ? u : s), go(e, t ? l : o), n && n();
	}, ne = (e, t) => {
		e._isLeaving = !1, go(e, d), go(e, p), go(e, f), t && t();
	}, re = (e) => (t, n) => {
		let i = e ? ee : v, o = () => C(t, e, n);
		lo(i, [t, o]), _o(() => {
			go(t, e ? c : a), ho(t, e ? u : s), uo(i) || yo(t, r, h, o);
		});
	};
	return w(t, {
		onBeforeEnter(e) {
			lo(_, [e]), ho(e, a), ho(e, o);
		},
		onBeforeAppear(e) {
			lo(S, [e]), ho(e, c), ho(e, l);
		},
		onEnter: re(!1),
		onAppear: re(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => ne(e, t);
			ho(e, d), e._enterCancelled ? (ho(e, f), Co(e)) : (Co(e), ho(e, f)), _o(() => {
				e._isLeaving && (go(e, d), ho(e, p), uo(b) || yo(e, r, g, n));
			}), lo(b, [e, n]);
		},
		onEnterCancelled(e) {
			C(e, !1, void 0, !0), lo(y, [e]);
		},
		onAppearCancelled(e) {
			C(e, !0, void 0, !0), lo(te, [e]);
		},
		onLeaveCancelled(e) {
			ne(e), lo(x, [e]);
		}
	});
}
function po(e) {
	if (e == null) return null;
	if (me(e)) return [mo(e.enter), mo(e.leave)];
	{
		let t = mo(e);
		return [t, t];
	}
}
function mo(e) {
	return Ne(e);
}
function ho(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[ao] || (e[ao] = /* @__PURE__ */ new Set())).add(t);
}
function go(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[ao];
	n && (n.delete(t), n.size || (e[ao] = void 0));
}
function _o(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var vo = 0;
function yo(e, t, n, r) {
	let i = e._endId = ++vo, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = bo(e, t);
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
function bo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${ro}Delay`), a = r(`${ro}Duration`), o = xo(i, a), s = r(`${io}Delay`), c = r(`${io}Duration`), l = xo(s, c), u = null, d = 0, f = 0;
	t === ro ? o > 0 && (u = ro, d = o, f = a.length) : t === io ? l > 0 && (u = io, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? ro : io : null, f = u ? u === ro ? a.length : c.length : 0);
	let p = u === ro && /\b(?:transform|all)(?:,|$)/.test(r(`${ro}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function xo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => So(t) + So(e[n])));
}
function So(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Co(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function wo(e, t, n) {
	let r = e[ao];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var To = /* @__PURE__ */ Symbol("_vod"), Eo = /* @__PURE__ */ Symbol("_vsh"), Do = /* @__PURE__ */ Symbol(""), Oo = /(?:^|;)\s*display\s*:/;
function ko(e, t, n) {
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) {
			if (O(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? jo(r, t, "");
			}
			else for (let e in t) n[e] ?? jo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? jo(r, i, "") : Fo(e, i, !O(t) && t ? t[i] : void 0, o) || jo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Do];
			e && (n += ";" + e), r.cssText = n, a = Oo.test(n);
		}
	} else t && e.removeAttribute("style");
	To in e && ((!i || t !== n) && (e[To] = a ? r.display : ""), e[Eo] && (r.display = "none"));
}
var Ao = /\s*!important$/;
function jo(e, t, n) {
	if (E(n)) n.forEach((n) => jo(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ao.test(n) ? e.setProperty(t, n.replace(Ao, ""), "important") : e.setProperty(t, n);
	else {
		let r = Po(e, t);
		Ao.test(n) ? e.setProperty(Ee(r), n.replace(Ao, ""), "important") : e[r] = n;
	}
}
var Mo = [
	"Webkit",
	"Moz",
	"ms"
], No = {};
function Po(e, t) {
	let n = No[t];
	if (n) return n;
	let r = we(t);
	if (r !== "filter" && r in e) return No[t] = r;
	r = De(r);
	for (let n = 0; n < Mo.length; n++) {
		let i = Mo[n] + r;
		if (i in e) return No[t] = i;
	}
	return t;
}
function Fo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var Io = "http://www.w3.org/1999/xlink";
function Lo(e, t, n, r, i, a = Ve(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Io, t.slice(6, t.length)) : e.setAttributeNS(Io, t, n) : n == null || a && !He(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : pe(n) ? String(n) : n);
}
function Ro(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Za(n) : n);
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
function zo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Bo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Vo = /* @__PURE__ */ Symbol("_vei");
function Ho(e, t, n, r, i = null) {
	let a = e[Vo] || (e[Vo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Go(t);
		r ? zo(e, n, a[t] = Yo(r, i), s) : o && (Bo(e, n, o, s), a[t] = void 0);
	}
}
var Uo = /(Once|Passive|Capture)$/, Wo = /^on:?(?:Once|Passive|Capture)$/;
function Go(e) {
	let t, n;
	for (; (n = e.match(Uo)) && !Wo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : Ee(e.slice(2)), t];
}
var Ko = 0, qo = /* @__PURE__ */ Promise.resolve(), Jo = () => Ko ||= (qo.then(() => Ko = 0), Date.now());
function Yo(e, t) {
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
	return n.value = e, n.attached = Jo(), n;
}
var Xo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Zo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? wo(e, r, o) : t === "style" ? ko(e, n, r) : ae(t) ? oe(t) || Ho(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Qo(e, t, r, o)) ? (Ro(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Lo(e, t, r, o, a, t !== "value")) : e._isVueCE && ($o(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? Ro(e, we(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Lo(e, t, r, o));
};
function Qo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Xo(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Xo(t) && O(n) ? !1 : t in e;
}
function $o(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = we(t);
	return Array.isArray(n) ? n.some((e) => we(e) === r) : Object.keys(n).some((e) => we(e) === r);
}
var es = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return E(t) ? (e) => Ae(t, e) : t;
};
function ts(e) {
	e.target.composing = !0;
}
function ns(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var rs = /* @__PURE__ */ Symbol("_assign"), is = /* @__PURE__ */ Symbol("_initialValue");
function as(e, t, n) {
	return t && (e = e.trim()), n && (e = Me(e)), e;
}
var os = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[is] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[is] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[rs] = es(i);
		let a = r || i.props && i.props.type === "number";
		zo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[rs](as(e.value, n, a));
		}), (n || a) && zo(e, "change", () => {
			e.value = as(e.value, n, a);
		}), t || (zo(e, "compositionstart", ts), zo(e, "compositionend", ns), zo(e, "change", ns));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[is];
		delete e[is], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[rs](as(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[rs] = es(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Me(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ss = {
	deep: !0,
	created(e, t, n) {
		e[rs] = es(n), zo(e, "change", () => {
			let t = e._modelValue, n = fs(e), r = e.checked, i = e[rs];
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
			} else i(ps(e, r));
		});
	},
	mounted: cs,
	beforeUpdate(e, t, n) {
		e[rs] = es(n), cs(e, t, n);
	}
};
function cs(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (E(t)) i = Je(t, r.props.value) > -1;
	else if (ue(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = qe(t, ps(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var ls = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, zo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Me(fs(e)) : fs(e)), r = e.multiple, i = r ? ue(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? E(i) ? t.slice() : t : i];
			try {
				e[rs](i);
			} finally {
				Xn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[rs] = es(r);
	},
	mounted(e, { value: t }) {
		ds(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[rs] = es(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !us(t, n[1], n[0])) && ds(e, t);
	}
};
function us(e, t, n) {
	if (!n || E(e)) return qe(e, t);
	if (ue(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ds(e, t) {
	let n = e.multiple, r = E(t);
	if (!n || r || ue(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = fs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Je(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (qe(fs(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function fs(e) {
	return "_value" in e ? e._value : e.value;
}
function ps(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ms = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], hs = {
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
	exact: (e, t) => ms.some((n) => e[`${n}Key`] && !t.includes(n))
}, gs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = hs[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, _s = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, vs = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = Ee(n.key);
		if (t.some((e) => e === r || _s[e] === r)) return e(n);
	}));
}, ys = /* @__PURE__ */ w({ patchProp: Zo }, no), bs;
function xs() {
	return bs ||= Ki(ys);
}
var Ss = ((...e) => {
	let t = xs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ws(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Cs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Cs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ws(e) {
	return O(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var Ts = () => ({
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
}), Es = null;
function G() {
	if (Es) return Es;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = Ts();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return Es = /* @__PURE__ */ fn(n), Es;
}
var K = () => e().saveSettingsDebounced(), Ds = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], Os = [
	"auto",
	"on",
	"off"
], ks = [
	"off",
	"vertex",
	"aistudio"
], As = ["annotations", "speech"], js = (e) => As.includes(e.kind), Ms = [
	"keep",
	"truncate",
	"remove"
], Ns = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Ps = [
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
function Fs(e) {
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
			if (i >= e.length) throw new Ns("Unterminated string", e, n);
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
		let i = Ps.find((t) => e.startsWith(t, n));
		if (!i) throw new Ns(`Unexpected character '${r}'`, e, n);
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
var Is = {
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
function Ls(e) {
	let t = Fs(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Ns(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Is ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new Ns(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Ns("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Is[n];
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
	if (u.k !== "end") throw new Ns("Unexpected token", e, u.pos);
	return l;
}
function Rs(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function zs(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function Bs(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => Bs(e, t));
		case "var": return t(e.path);
		case "not": return !zs(Bs(e.e, t));
		case "bin": {
			if (e.op === "&&") return zs(Bs(e.l, t)) && zs(Bs(e.r, t));
			if (e.op === "||") return zs(Bs(e.l, t)) || zs(Bs(e.r, t));
			let n = Bs(e.l, t), r = Bs(e.r, t);
			switch (e.op) {
				case "==": return Rs(n, r);
				case "!=": return !Rs(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Rs(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function Vs(e, t) {
	return !e || zs(Bs(e, t));
}
function Hs(...e) {
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
var Us = /\{\{ap::([^{}]*?)\}\}/g;
function Ws(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Us, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Ws(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Gs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ks(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function qs(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Ks(n[3] ?? n[4] ?? "");
	return t;
}
function Js(e, t) {
	let n = [], r = RegExp(`<${Gs(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: qs(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: qs(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Ys(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Xs(e, t) {
	let n = Js(e, t)[0];
	return n ? Ks(n.inner).trim() : void 0;
}
function Zs(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Qs(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
var $s = "{==", ec = "==}", tc = "{>>", nc = "<<}", rc = /\n[ \t]*\n/g;
function ic(e, t) {
	rc.lastIndex = t;
	let n = rc.exec(e);
	return n ? n.index : Infinity;
}
function ac(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function oc(e, t, n, r) {
	let i = ic(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function sc(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith($s, o)) {
		let t = o + 3, s = oc(e, t, ec, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - ac(n, [ec]));
			break;
		}
		if (s < 0) {
			let n = Math.min(ic(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || tc.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(tc, l)) {
			let t = l + 3, s = oc(e, t, nc, n);
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
	} else if (e.startsWith(tc, o)) {
		let t = o + 3, i = oc(e, t, nc, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += tc, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && ($s.startsWith(t) || tc.startsWith(t))) break scan;
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
function cc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function lc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function uc(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = cc(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + lc(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function dc(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = uc(e, t);
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
function fc(e, t) {
	let n = dc(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${$s}${t.quote}${ec}${tc}${t.comment}${nc}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/media.ts
var pc = [
	"openai",
	"gemini",
	"novelai",
	"openrouter"
], mc = [
	"tags",
	"description",
	"instruction"
], hc = (e) => e === "novelai" ? "tags" : "instruction", gc = [
	"fish",
	"elevenlabs",
	"minimax",
	"gemini",
	"openai",
	"deepseek",
	"openrouter"
], _c = {
	on: !1,
	auto: !1,
	api: "",
	prompt: "",
	style: !1,
	sfw: !1,
	refs: !1
}, vc = {
	on: !1,
	auto: !1,
	api: "",
	narrator: !1,
	characters: !1
}, yc = (e) => (e ?? []).map((e) => `- ${e.id}: ${e.description}`.trimEnd()).join("\n"), bc = [
	"1:1",
	"3:4",
	"4:3",
	"9:16",
	"16:9"
], xc = [
	"prompt",
	"refs",
	"ratio",
	"caption"
], Sc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Cc(e) {
	let t = Array.isArray(e) ? e.map(Sc) : typeof e == "string" ? e.split(/[,，、\n]/) : [];
	return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function wc(e) {
	let t = Sc(e).trim().replace(/[：xX×/]/g, ":").replace(/\s+/g, "");
	return bc.includes(t) ? t : void 0;
}
function Tc(e) {
	let t = Sc(e.prompt ?? e.description ?? e.text).trim();
	if (!t) return;
	let n = { prompt: t }, r = Cc(e.refs ?? e.references);
	r.length && (n.refs = r);
	let i = wc(e.ratio ?? e.aspect_ratio ?? e.aspectRatio);
	i && (n.ratio = i);
	let a = Sc(e.caption ?? e.title).trim();
	return a && (n.caption = a), n;
}
function Ec(e, t) {
	if (typeof e == "string") {
		let t = e.trim();
		if (t.startsWith("[") || t.startsWith("{")) try {
			e = JSON.parse(t);
		} catch {}
		typeof e == "string" && (e = t ? [{ prompt: t }] : []);
	}
	e && typeof e == "object" && !Array.isArray(e) && Array.isArray(e.images) && (e = e.images);
	let n = (Array.isArray(e) ? e : e && typeof e == "object" ? [e] : []).map((e) => Tc(e && typeof e == "object" ? e : { prompt: e })).filter((e) => !!e), r = t && t > 0 ? n.slice(0, t) : n;
	return r.length ? { images: r } : void 0;
}
var Dc = "speech", Oc = "character", kc = (e) => e.text ?? e.quote, Ac = /<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>|\[[^\[\]\n]{1,40}\]/g;
function jc(e, t = Ac) {
	if (typeof t == "function") return t(e);
	let n = t.global ? t : new RegExp(t.source, `${t.flags}g`);
	n.lastIndex = 0;
	let r = e.replace(n, "");
	if (r === e) return e;
	let i = r.replace(/([ \t])[ \t]+/g, "$1");
	return /^\s/.test(e) || (i = i.replace(/^\s+/, "")), /\s$/.test(e) || (i = i.replace(/\s+$/, "")), i;
}
function Mc(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function Nc(e) {
	let t = e.lastIndexOf("<"), n = e.lastIndexOf("["), r = e.length;
	return t >= 0 && !e.includes(">", t) && (r = Math.min(r, t)), n >= 0 && !e.includes("]", n) && e.length - n <= 41 && (r = Math.min(r, n)), e.slice(0, r);
}
function Pc(e, t = {}) {
	let n = t.tag || "speech", r = t.final ?? !0, i = t.cleaner ?? Ac, a = [], o = RegExp(`<${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s[^<>]*)?>`, "g"), s = `</${n}>`, c = `<${n}`, l = [], u = [], d = [], f = "", p = 0, m = (t, n) => {
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
				t -= Mc(e.slice(p), [c, s]);
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
		let h = t[1] ?? "", g = Ks(/\bcharacter\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(h)?.slice(1).find((e) => e !== void 0) ?? "").trim(), _ = t.index + t[0].length, v = e.indexOf(s, _);
		o.lastIndex = _;
		let y = o.exec(e);
		if (v < 0) {
			let t = e.slice(_);
			if (!r) {
				let e = jc(Nc(t.slice(0, t.length - Mc(t, [s]))), i);
				f += e;
				break;
			}
			a.push(`speech: unterminated <${n}> dropped`), p = _;
			continue;
		}
		let b = e.slice(_, v);
		y && y.index < v && (a.push(`speech: nested <${n}> dropped`), b = b.replace(new RegExp(o.source, "g"), ""));
		let x = jc(b, i), S = f.length;
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
function Fc(e, t) {
	let n = !1;
	return {
		spans: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = uc(e, t);
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
var Ic = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function Lc(e, t, n = Dc) {
	let r = Fc(e, t).spans.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), i = "", a = 0;
	for (let t of r) t.start < a || (i += `${e.slice(a, t.start)}<${n} ${Oc}="${Ic(t.character)}">${kc(t)}</${n}>`, a = t.end);
	return i + e.slice(a);
}
function Rc(e, t, n, r) {
	return t.map((t) => {
		let i = n.map(t.start);
		for (let n of r) {
			let r = n(t.quote), a = r ? uc(e, {
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
function zc(e, t, n = {}) {
	let r = Pc(e, n);
	if (!t?.length) return {
		text: r.text,
		spans: r.spans,
		anchors: t,
		warnings: r.warnings
	};
	let i = (e) => Pc(e, n).text;
	return {
		text: r.text,
		spans: r.spans,
		anchors: Rc(r.text, t, r, [i, (e) => jc(i(e), n.cleaner)]),
		warnings: r.warnings
	};
}
//#endregion
//#region packages/protocol/src/structures.ts
var Bc = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Vc = {
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
}, Hc = ["name", "previous_main"], Uc = {
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
}, Wc = {
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
	status: Bc,
	storyline: Hc,
	custom: [],
	annotations: [],
	image: xc,
	speech: []
};
function Gc(e, t = (e) => e) {
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
			properties: Object.fromEntries(Bc.map((e) => [e, i(e)])),
			required: [...Bc],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? Hc).filter((e) => Hc.includes(e));
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
			let t = xc.filter((t) => !e.requested || e.requested.includes(t)), n = {
				prompt: { type: "string" },
				refs: {
					type: "array",
					items: { type: "string" }
				},
				ratio: {
					type: "string",
					enum: [...bc]
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
function Kc(e) {
	return e === "memory" || e === "recap";
}
function qc(e) {
	let t = {};
	for (let n of Bc) t[n] = Xc(Vc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Jc(e) {
	let t = {};
	for (let n of Hc) t[n] = Xc(Uc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Yc(e) {
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
var Xc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Zc(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations":
		case "speech": return;
		case "image": return Ec(t, n?.count ?? 1);
		case "reply":
		case "impersonate": return Xc(t).trim() || void 0;
		case "recap": return t === null ? null : Xc(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Xc(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Xc(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Xc(e.time),
				location: Xc(e.location),
				event: Xc(e.event),
				summary: Xc(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : qc((e) => t[e]);
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
			let e = Jc((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Xc(e.label ?? e.title).trim(),
			content: Xc(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Xc(t)]));
			}
			return Xc(t).trim() || void 0;
	}
}
function Qc(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations":
		case "speech": return;
		case "image": return Ec(t.filter((e) => !e.open).map((e) => /<[A-Za-z_]/.test(e.inner) ? {
			prompt: Xs(e.inner, "prompt"),
			refs: Xs(e.inner, "refs"),
			ratio: Xs(e.inner, "ratio"),
			caption: Xs(e.inner, "caption")
		} : Ks(e.inner).trim()), e.count ?? 1);
		case "reply":
		case "impersonate": return Zc(e.kind, Ks(n.inner));
		case "recap": return Zc("recap", Ks(n.inner));
		case "memory": return Zc("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Xs(e.inner, "scope"),
			operation: Xs(e.inner, "operation"),
			key: Xs(e.inner, "key"),
			content: Xs(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Xs(n.inner, "time") ?? "",
			location: Xs(n.inner, "location") ?? "",
			event: Xs(n.inner, "event") ?? "",
			summary: Xs(n.inner, "summary") ?? ""
		};
		case "status": return qc((e) => Xs(n.inner, e));
		case "storyline": {
			let e = Jc((e) => Xs(n.inner, e));
			return !e.name && !e.previous_main && !/<[A-Za-z_]/.test(n.inner) && (e.name = Ks(n.inner).trim()), e.name || e.previous_main ? e : void 0;
		}
		case "options": return Js(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Ks(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Ks(t[2]).trim();
				return e;
			}
			return Zc("custom", Ks(n.inner), e);
	}
}
function $c(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (js(a)) continue;
		let t = Js(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Qc(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Ys(e, i),
		values: n,
		open: r
	};
}
function el(e) {
	return Ks(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var tl = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function nl(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function rl(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function il(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function al(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return tl(e, { n: String(t).padStart(i, "0") }) + r;
}
function ol(e, t, n, r, i) {
	let a = n.filter((e) => !js(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: nl(e, t)
		},
		rank: 0,
		index: n
	})), s = il(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = rl(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? al(u, t + 1, d, n) : n;
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
			return u && n && g(e).length ? al(u, n.position, d, t) : t;
		}
	};
}
function sl(e, t) {
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
var cl = {
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
}, ll = (e) => e;
function ul(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function dl(e, t) {
	return e.stages.filter((e) => Vs(e.when, t));
}
function fl(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function pl(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function ml(e, t, n = cl) {
	return ul(t.field?.name ?? n.turn.field, pl(e, t));
}
function hl(e, t, n = cl) {
	return ul(t.tool?.name ?? n.stage.name, pl(e, t));
}
function gl(e, t = cl) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var _l = (e, t) => t ? {
	...e,
	description: t
} : e;
function vl(e = cl, t = ll, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return _l({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: _l({ type: "string" }, i(r.old)),
				new_string: _l({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function yl(e, t, n = cl, r = ll) {
	return e.kind === "patch" ? vl(n, r, t) : _l({ type: "string" }, t);
}
function bl(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function xl(e, t, n, r, i = ll) {
	let a = r.filter((e) => !js(e)), o = (e, t) => {
		if (e) return i(t ? ul(e, pl(n, t)) : e).trim() || void 0;
	}, s = ol(t, n, a, e, (t) => ml(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => hl(n, t, e), d = (t) => s.stageParam(t, gl(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = Gc(sl(n, r), i), Kc(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = yl(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = gl(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = yl(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), bl(u(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => bl(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: _l({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: _l(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function Sl(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function Cl(e) {
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
function wl(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = Cl(e);
		return t ? [t] : [];
	});
}
function Tl(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function El(e) {
	let t = wl(e);
	return t.length ? Tl(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function Dl(e) {
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
function Ol(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Zs(t.content)).trimEnd());
}
function kl(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Al(e) {
	return e.map((e) => ({
		old_string: Xs(e, "old_string") ?? "",
		new_string: Xs(e, "new_string") ?? ""
	}));
}
function jl(e, t) {
	let n = Dl(t.stages), r = Qs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Gs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = $c(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Js(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Al(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Ks(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Ys(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = fl(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Gs(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Ol(t.stages, n, t.final), kl(t.stages, n, t.final), n;
}
function Ml(e, t) {
	let n = Dl(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => ml(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Nl(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (js(e)) continue;
		let r = c(e), i = Zc(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = fl(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Ol(t.stages, n, t.final), kl(t.stages, n, t.final), n;
}
function Nl(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Pl(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Fl(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Pl(e, n);
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
	let i = n.trim().split(/\s+/).map(Gs), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function Il(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Fl(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Ll(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Gs(t), "gi"), a = [], o;
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
var Rl = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, zl = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Bl = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Vl(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Hl[e]);
}
var Hl = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Ul(e) {
	return e.split(zl).filter((e) => e !== "");
}
var Wl = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Gl(e) {
	let t = Ul(Wl(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Bl.has(n)) throw new Rl(`Could not find matching close tag for "${e}".`, a);
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
var Kl = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, ql = (e, t) => {
	throw new Rl(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Jl = /* @__PURE__ */ new Map(), Yl = 500;
function Xl(e) {
	let t = Jl.get(e);
	if (t) return t;
	let n = Gl(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Rl(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Vl, Kl, ql);
	return Jl.size >= Yl && Jl.clear(), Jl.set(e, i), i;
}
function Zl(e, t) {
	return Xl(e)(t);
}
function Ql(e) {
	try {
		return Xl(e), null;
	} catch (e) {
		return e instanceof Rl ? e : new Rl(String(e));
	}
}
function $l(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) $l(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var eu = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, tu = /^\s*(```|~~~)/;
function nu(e) {
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
var ru = /<!--[ \t]*#/g, iu = /<!--|-->/g;
function au(e, t, n) {
	iu.lastIndex = t;
	for (let t = iu.exec(e); t; t = iu.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function ou(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(eu)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(eu, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...nu(o),
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
			let t = au(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? su(e, t) : t;
		} else if (tu.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		ru.lastIndex = u;
		for (let t = ru.exec(e); t; t = ru.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = au(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? su(e, r) : r, ru.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function su(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var cu = [
	"system",
	"user",
	"assistant"
], lu = ["dialogue", "imperative"];
function uu(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Hs(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = Ql(e.text);
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
				cu.includes(n) || t(`@as expects one of ${cu.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: cu.includes(n) ? n : void 0,
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
				if (!n || !lu.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: Ls(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = Ls(e.raw);
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
function du(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = ou(e, [], 1, r), a = uu(i.tokens, r);
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
function fu(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => Vs(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var pu = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function mu(e) {
	let t = e.entries.flatMap((e) => pu(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => pu(e));
		t.push(...pu(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...pu(du(n.text, n.role).content));
	return t;
}
//#endregion
//#region packages/protocol/src/clone.ts
function q(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => q(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = q(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function hu(e) {
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
function gu(e, t) {
	let n = hu(e), r = hu(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function _u(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = hu(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = gu(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var vu = (e) => !!e && typeof e == "object" && !Array.isArray(e), yu = {
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
function bu(e) {
	let t = e.sendThoughtSignature;
	return t === !0 ? "vertex" : typeof t == "string" && ks.includes(t) ? t : "off";
}
function xu(e, t) {
	let n = e.thoughtSignature;
	if (t !== "off" && n) return typeof n == "string" ? t === "vertex" ? n : void 0 : n[t] || void 0;
}
var Su = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function Cu(e, ...t) {
	let n = q(e);
	for (let e of t) n = wu(n, e);
	return n;
}
function wu(e, t) {
	if (t === void 0) return e;
	if (!vu(e) || !vu(t)) return q(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = wu(e[r], i);
	return n;
}
function Tu(e, t) {
	if (vu(e) && vu(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Tu(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : q(e);
}
function Eu(e, t, n = "", r = [], i = Du) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? vu(e[a]) && vu(t[a]) && (Eu(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var Du = /* @__PURE__ */ new Set(["sampling"]);
function Ou(e, t, n) {
	let r = q(e);
	for (let e of t) if (_u(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && vu(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function ku(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
function Au(e, t, n) {
	return Cu(e.configurationDefaults, ku(e, t)?.diff, n);
}
//#endregion
//#region packages/protocol/src/params.ts
function ju(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function Mu(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function Nu(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? ju(n) : Array.isArray(e.default) ? ju(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function Pu(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Fu(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, Nu(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Iu(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Lu(e, t, n) {
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
function Ru(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Iu(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Lu(r[t.var], t, e));
	}
	return r;
}
var zu = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Bu(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !zu.test(e);
}
function Vu(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Bu(e) ? e : JSON.stringify(e);
}
var Hu = (e) => !e.includes("\n") && Bu(e) ? e : JSON.stringify(e);
function Uu(e) {
	return e.map((e) => `- ${Vu(e, "  ")}`).join("\n");
}
function Wu(e) {
	return [...e].map(([e, t]) => `${Hu(e)}: ${Vu(t, "  ")}`).join("\n");
}
function Gu(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Uu(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Wu(e) : t === "keys" ? Uu([...e.keys()]) : t === "values" ? Uu([...e.values()]) : e.get(t) ?? "";
}
function Ku(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var qu = [
	"all",
	"if",
	"off"
], Ju = {
	enabled: !0,
	freezeVariables: "all"
}, Yu = (e) => qu.includes(e?.freezeVariables) ? e.freezeVariables : Ju.freezeVariables, Xu = (e, t) => e === "all" ? !t.main : e === "if" && t.if, Zu = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1,
	frozen: !1
}, Qu = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u, $u = (e) => /^[^\s#!?@][^\s#]*$/u.test(e) && !/^if\?$/iu.test(e) && [...e].length <= 64;
function ed(e) {
	let t = Qu.exec(e);
	if (!t) return null;
	let n = t[2], r = /^if\?$/iu.test(n), i = n === "" ? "recent" : n === "?" || r ? "new" : "name";
	if (i === "name" && !$u(n)) return null;
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
function td(e) {
	return ed(e)?.text ?? e;
}
function nd(e, t, n = !1) {
	let r = td(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function rd(e, t, n) {
	return n ? `${e.slice(0, t.at)}#${t.switchMain ? "!" : t.hide ? "@" : ""}${n}` : t.text;
}
function id(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?@\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return $u(n) ? n : "";
}
function ad(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function od(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var sd = (e) => /^if/i.test(e);
function cd(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function ld(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function ud(e, t) {
	return !!e.groups[t]?.allowNone;
}
function dd(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || ud(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Vs(e.when, n)) : i;
}
function fd(e, t) {
	let n = new Set(dd(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function pd(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = od(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => {
		switch (e.kind) {
			case "storyline": return i.length ? [{
				...e,
				requested: i
			}] : [];
			case "image": return n?.image?.on ? [{
				...e,
				requested: xc.filter((e) => e !== "refs" || n.image.refs)
			}] : [];
			case "speech": return n?.speech?.on ? [e] : [];
			default: return [e];
		}
	});
}
function md(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function hd(e, t, n, r) {
	return t && e.tools ? ol(t, n, r, e.tools, (t) => ml(n, t, e.tools)) : void 0;
}
function gd(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? hd(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = Nu(n, o.params[e]);
		if (Pu(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Ws(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return Gu(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return md(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${md(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : Sl(t, (e) => md(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			case "storyline": return i === "main" ? c.storyline?.main ?? "" : c.storyline?.name ?? s.storyline?.name ?? "";
			case "image": return i === "refs" && s.image?.on ? yc(c.image?.refs) : "";
			case "speech": return s.speech?.on ? i === "format" ? c.speech?.format ?? "" : i === "characters" ? (c.speech?.characters ?? []).join(", ") : "" : "";
			default: return;
		}
	};
	return g;
}
function _d(e, t, n, r, i) {
	return $l({
		...q(e),
		vars: q(Ku(t)),
		sampling: q(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function vd(e, t, n) {
	return (r) => {
		try {
			return Zl(r.text, e());
		} catch (e) {
			let i = e instanceof Rl ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function yd(e, t) {
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
function bd(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? hd(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? hl(n, t, e.tools) : c?.stageField(t) ?? ml(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", md(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function xd(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = ld(i), s = a ? dl(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = ld(i), l = dd(n, r, c), u = pd(n, l, i), d = Ru(n.vars, l), f = gd({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Ws(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= _d(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Vs(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...fu(e.content, c, p, vd(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = bd(n, a, s, i.style, i.transport, r, u);
		for (let n of fu(t, c, p, vd(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = yd(e, v.get(e.id) ?? []));
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
function Sd(e, t, n = {}) {
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
		modules: fd(e, t),
		params: Fu(e, t),
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
		storyline: { ...Zu },
		image: { ..._c },
		speech: { ...vc },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var Cd = /* @__PURE__ */ new Set([
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
]), wd = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Td = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Ed = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Dd(e, t = {}) {
	let n = (e) => Dd(e, t);
	if (!Ed(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Ed(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => wd.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Ed), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Od({
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
		return Od({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Cd.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Ed(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Td[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Ed(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Od({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Od(i, a);
}
function Od(e, t) {
	return t && (e.nullable = !0), e;
}
function kd(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Ed(n)) return e;
		let r = Ed(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Dd(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/tavern-helper.ts
var Ad = "tavern_helper";
function jd(e) {
	return e.flatMap((e) => e.type === "folder" ? [e.id, ...e.scripts.map((e) => e.id)] : [e.id]);
}
//#endregion
//#region packages/protocol/src/preset-file.ts
var Md = "1.10.0", Nd = "advanced_preset_file", Pd = [
	"https://github.com/mirrorange/advanced-preset",
	"https://gitlab.com/mirrorange/advanced-preset",
	"https://codeberg.org/mirrorange/advanced-preset"
], Fd = (e) => typeof e == "string" && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(e.trim()), Id = "ap_install_notice", Ld = "⟦ap:install-notice⟧", Rd = "6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3", zd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Bd(e) {
	let t = zd(e) && zd(e.extensions) ? e.extensions[Nd] : void 0;
	return zd(t) && zd(t.artifact) ? {
		format: t.format,
		artifact: t.artifact
	} : void 0;
}
function Vd(e) {
	return Bd(e)?.artifact ?? e;
}
function Hd(e) {
	let t = e.minAdvancedPreset;
	return t && gu(t, "1.10.0") > 0 ? t : Md;
}
var Ud = (e) => typeof e == "string" && e.includes("⟦ap:region:");
function Wd(e) {
	return `${Ld}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${e.name}" ${e.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${Pd.map((e) => `   - ${e}`).join("\n")}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}
function Gd(e) {
	return {
		type: "script",
		enabled: !0,
		name: "Advanced Preset Installer",
		id: Rd,
		content: qd(e.name, Hd(e)),
		info: `This preset ("${e.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${Pd.join("\n")}\nIt does nothing once Advanced Preset ${Hd(e)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${Hd(e)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
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
function Kd(e, t = {}) {
	let n = e.carrier.prompts.map((e) => ({ ...e })), r = new Set(n.filter((e) => Ud(e.content)).map((e) => e.identifier));
	n.push({
		identifier: Id,
		name: "Advanced Preset · install notice",
		role: "system",
		content: Wd(e),
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
		identifier: Id,
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
			...t.installer === !1 ? {} : { [Ad]: {
				scripts: [Gd(e)],
				variables: {}
			} },
			[Nd]: a
		}
	};
}
function qd(e, t) {
	let n = (e) => JSON.stringify(e).replace(/</g, "\\u003c");
	return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${t} or newer is running.
const PRESET = ${n(e)};
const REQUIRED = ${n(t)};
const MIRRORS = ${n(Pd)};
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
var Jd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Yd(e) {
	let t = e.configurationDefaults?.connection;
	return !Jd(t) || Object.keys(yu).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...yu,
				...t
			}
		}
	};
}
function Xd(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!Jd(t) || "userInput" in t) && (!Jd(n) || "userInput" in n)) return e;
	let r = Jd(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: Jd(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: Jd(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function Zd(e) {
	let t = e.configurationDefaults;
	if (!Jd(t)) return e;
	let n = t.cache;
	return Jd(n) && Object.keys(Su).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...Su,
				...Jd(n) ? n : {}
			}
		}
	};
}
function Qd(e) {
	let t = e.configurationDefaults;
	if (!Jd(t)) return e;
	let n = t.meta;
	return Jd(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...Jd(n) ? n : {}
			}
		}
	};
}
function $d(e) {
	let t = e.configurationDefaults;
	if (!Jd(e.storylines) || !Jd(t)) return e;
	let n = t.storylines;
	return Jd(n) && Object.keys(Ju).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...Ju,
				...Jd(n) ? n : {}
			}
		}
	};
}
function ef(e) {
	let t = $d(Qd(Zd(Xd(Yd(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function tf(e) {
	let t = Vd(e);
	return !Jd(t) || typeof t.id != "string" || !Array.isArray(t.entries) ? null : t.formatVersion === 3 ? ef(t) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var nf = (e) => typeof e == "string" || e.enabled !== !1, rf = (e) => typeof e == "string" ? e : e.text;
function af(e, t) {
	t ? delete e.enabled : e.enabled = !1;
}
function of(e, t) {
	return t ? e : {
		text: e,
		enabled: !1
	};
}
var sf = "user-", cf = "advanced-preset.user-modules", lf = (e) => `${sf}${e}`;
function uf() {
	return {
		match: "all",
		rules: []
	};
}
var df = ["on", "off"];
function ff(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? df.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function pf(e) {
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
function mf(e, t) {
	let n = pf(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var hf = (e) => ({
	t: "lit",
	v: e
});
function gf(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(hf)
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
			r: hf(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function _f(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(ff).map((e) => {
		if (e.kind === "keyword") return hf(mf(e, t));
		if (e.kind === "var") return gf(e);
		try {
			return Ls(e.source);
		} catch {
			return hf(!1);
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
function vf(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return Ls(e.source), null;
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
function yf(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = t.filter((e) => e.id && !n.has(e.id) && n.add(e.id)), i = new Map(r.map((e, t) => [e.id, t])), a = [[], ...r.map(() => [])];
	for (let t of e) {
		let e = t.group === void 0 ? void 0 : i.get(t.group);
		if (e === void 0) {
			if (t.group === void 0) a[0].push(t);
			else {
				let { group: e, ...n } = t;
				a[0].push(n);
			}
			continue;
		}
		let n = a[e + 1], o = r[e].mode === "single" && t.enabled && n.some((e) => e.enabled);
		n.push(o ? {
			...t,
			enabled: !1
		} : t);
	}
	return {
		modules: a.flat(),
		groups: r
	};
}
function bf(e, t) {
	return e.filter((e) => (e.group ?? null) === t);
}
function xf(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function Sf(e, t) {
	return t.entries.filter((t) => !xf(e, t.point));
}
function Cf(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function wf(e, t) {
	return (t.vars ?? []).filter((t) => Cf(e, t.var)?.type !== t.type);
}
function Tf(e, t) {
	return [.../* @__PURE__ */ new Set([...Sf(e, t).map((e) => e.point), ...wf(e, t).map((e) => e.var)])];
}
function Ef(e) {
	if (!nf(e)) return null;
	switch (e.type) {
		case "string": return e.text.trim() ? {
			var: e.var,
			type: "string",
			text: e.text
		} : null;
		case "list": {
			let t = e.items.filter(nf).map(rf).filter((e) => e.trim());
			return t.length ? {
				var: e.var,
				type: "list",
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => nf(e) && e.key.trim()).map((e) => ({
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
function Df(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Of(e, t, n) {
	let r = t.filter((e) => e.enabled).map((e) => ({
		...e,
		entries: e.entries.filter(nf),
		vars: (e.vars ?? []).filter(nf)
	})).filter((e) => e.entries.length || e.vars.length);
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = lf(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: _f(t.trigger, n),
			structures: [],
			vars: t.vars.filter((t) => Cf(e, t.var)?.type === t.type).map(Ef).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = xf(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Df(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: du(n.text, n.role).content
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
function kf(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => pu(du(e.text, e.role).content)));
}
function Af(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function jf(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Mf(e, t, n) {
	let r = t.filter((e) => _u(n, e.from));
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
				path: Af(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: jf(t.source, e)
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
var Nf = (e) => !!e && typeof e == "object" && !Array.isArray(e), Pf = (e, t = "") => typeof e == "string" ? e : t, Ff = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), If = [
	"system",
	"user",
	"assistant"
], Lf = [
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
function Rf(e) {
	if (!Nf(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Pf(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Lf.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Ff) : Ff(e.value) && (t.value = e.value), t;
	}
	return null;
}
var zf = (e) => e.enabled === !1 ? { enabled: !1 } : {};
function Bf(e) {
	return typeof e == "string" ? [e] : Nf(e) && typeof e.text == "string" ? [e.enabled === !1 ? {
		text: e.text,
		enabled: !1
	} : e.text] : [];
}
function Vf(e) {
	if (!Nf(e) || typeof e.var != "string") return [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Pf(e.text),
		...zf(e)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: Array.isArray(e.items) ? e.items.flatMap(Bf) : [],
		...zf(e)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Nf).map((e) => ({
			key: Pf(e.key),
			value: typeof e.value == "string" ? e.value : null,
			...zf(e)
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t,
			...zf(e)
		}];
	}
	return [];
}
function Hf(e) {
	if (!Nf(e) || !Array.isArray(e.entries)) return null;
	let t = Nf(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Nf(e)) return [];
		let n = {
			id: Pf(e.id) || `e${t + 1}`,
			point: Pf(e.point),
			text: Pf(e.text)
		};
		return If.includes(e.role) && (n.role = e.role), e.enabled === !1 && (n.enabled = !1), [n];
	}), r = {
		id: Pf(e.id),
		name: Pf(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Vf) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Rf).filter((e) => !!e) : []
		}
	};
	return typeof e.group == "string" && e.group && (r.group = e.group), r;
}
function Uf(e) {
	if (!Nf(e) || typeof e.id != "string" || !e.id) return null;
	let t = {
		id: e.id,
		name: Pf(e.name),
		mode: e.mode === "single" ? "single" : "multi"
	};
	return e.collapsed === !0 && (t.collapsed = !0), t;
}
function Wf(e, t, n = []) {
	let r = n.filter((t) => e.some((e) => e.group === t.id));
	return {
		format: cf,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e,
		...r.length ? { groups: r } : {}
	};
}
function Gf(e) {
	if (Nf(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Hf).filter((e) => !!e), n = /* @__PURE__ */ new Set(), r = (Array.isArray(e.groups) ? e.groups : []).map(Uf).filter((e) => !!e && !n.has(e.id) && !!n.add(e.id));
		for (let e of t) e.group !== void 0 && !n.has(e.group) && delete e.group;
		return {
			preset: Nf(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Pf(e.preset.version)
			} : void 0,
			modules: t,
			groups: r
		};
	}
	let t = Hf(e);
	if (t) return delete t.group, {
		modules: [t],
		groups: []
	};
	throw Error("not a user module file");
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function Kf(e) {
	return Array.isArray(e.userModuleGroups) ? e.userModuleGroups : [];
}
function qf(e, t) {
	return typeof t?.name == "string" && t.name ? {
		...q(e),
		name: t.name
	} : q(e);
}
function Jf(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function Yf(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function Xf(e, t, n) {
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
function Zf(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...q(e)
		})),
		vars: q(e.vars ?? []),
		trigger: e.trigger ? q(e.trigger) : uf(),
		...n.group ? { group: n.group } : {}
	};
}
function Qf(e) {
	return {
		id: e.id,
		name: e.name,
		...e.enabled ? {} : { enabled: !1 },
		...e.group === void 0 ? {} : { group: e.group },
		entries: e.entries.map(({ point: e, role: t, text: n, enabled: r }) => ({
			point: e,
			...t ? { role: t } : {},
			text: n,
			...r === !1 ? { enabled: r } : {}
		})),
		vars: q(e.vars ?? []),
		trigger: q(e.trigger)
	};
}
function $f(e) {
	if (Array.isArray(e)) return e.map($f);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = $f(e[n]));
		return t;
	}
	return e;
}
function ep(e) {
	return JSON.stringify($f({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text,
			...e.enabled === !1 ? { enabled: !1 } : {}
		})),
		vars: (e.vars ?? []).flatMap(Vf),
		trigger: e.trigger ?? uf()
	}));
}
function tp(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, ep(e.locales[t])]);
	return JSON.stringify([
		ep(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function np(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var rp = "[{{time}} · {{location}}] {{event}}: {{summary}}", ip = (e) => e === "synopsis" ? rp : "{{value}}", ap = "{{content}}";
function op(e) {
	let t = e.indexOf(ap);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(ap, "");
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
function sp(e) {
	let t = e.history;
	if (t === void 0 || js(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: op(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? ip(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var cp = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, lp = (e) => e.kind === "speech" && typeof e.history == "number" ? e.history : 0, up = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function dp(e) {
	let t = e?.stages ?? [], n = up(t);
	return n >= 0 ? nl(e, t[n]) : 0;
}
function fp(e, t, n) {
	let r = e?.stages ?? [], i = (t) => nl(e, t), a = up(r), o = dp(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = rl(e, t);
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
var pp = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function mp(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => pp(e).trim() !== "");
}
function hp(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return gp(rp, e, t, !1);
		case "status": return Yc(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : pp(t);
		case "image": {
			let e = t?.images;
			return Array.isArray(e) ? e.map((e) => `- ${e?.caption ? `${e.caption}: ` : ""}${e?.prompt ?? ""}`).join("\n") : pp(t);
		}
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${pp(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function gp(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Wc[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? hp(t, n) : i && (a.has(o) || t === "custom" && o in i) ? pp(i[o]) : a.has(o) ? "" : e);
}
var _p = (e, t) => gp(e, "synopsis", t, !1);
function vp(e, t, n) {
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
var yp = [
	"executeOnStartup",
	"executeOnUser",
	"executeOnAi",
	"executeOnChatChange",
	"executeOnGroupMemberDraft",
	"executeOnNewChat",
	"executeBeforeGeneration"
], bp = [
	"label",
	"title",
	"message"
];
function xp(e, t, n) {
	let r = (e) => Ws(e, (e) => e[0] === "name" && e.length === 2 ? t(e[1]) : void 0), i = e.qrList.map(({ id: e, ...t }, i) => {
		let a = n?.qrList?.[e], o = {
			...t,
			contextList: t.contextList.map((e) => ({ ...e })),
			id: i + 1
		};
		for (let e of bp) {
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
var Sp = (e) => yp.some((t) => e[t]) || !!e.automationId;
function Cp(e) {
	return (e.quickReplySets ?? []).flatMap((e) => e.qrList.filter(Sp).map((t) => `${e.name} · ${t.label || t.id}: ${t.message}`));
}
//#endregion
//#region src/store/presets.ts
var wp = /* @__PURE__ */ fn(/* @__PURE__ */ new Map()), Tp = /* @__PURE__ */ fn(/* @__PURE__ */ new Map());
async function Ep() {
	try {
		let e = `${d()}dist/presets/`, t = await (await S(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = tf(await (await S(e + n, { cache: "no-cache" })).json());
			t && wp.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var Dp = (e) => tf(e);
function Op() {
	return [.../* @__PURE__ */ new Set([
		...wp.keys(),
		...Object.keys(G().installed),
		...Tp.keys()
	])].map((e) => kp(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function kp(e) {
	let t = Tp.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = jp(e), r = wp.get(e);
	if (n && (!r || gu(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Ap = /* @__PURE__ */ new WeakMap();
function jp(e) {
	let t = G().installed[e];
	if (t) return Ap.has(t) || Ap.set(t, tf(t)), Ap.get(t) ?? void 0;
}
var Mp = (e) => kp(e)?.preset;
function Np(e) {
	G().installed[e.id] = e, K();
}
function Pp(e) {
	delete G().installed[e], K();
}
function Fp(e, t) {
	e ? Tp.set(e.id, e) : t ? Tp.delete(t) : Tp.clear();
}
var Ip = (e) => wp.has(e), Lp = (e) => wp.get(e), Rp = {
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
	"um.grp.new": "New group",
	"um.grp.newName": "Group {n}",
	"um.grp.untitled": "Untitled group",
	"um.grp.name": "Group name",
	"um.grp.reorder": "Drag to reorder groups",
	"um.grp.collapse": "Collapse",
	"um.grp.expand": "Expand",
	"um.grp.count": "{n} module(s)",
	"um.grp.single": "Single choice: at most one module on (click for multiple)",
	"um.grp.multi": "Multiple choice: any modules on (click for single)",
	"um.grp.radioOn": "Use this one",
	"um.grp.radioOff": "Switch off",
	"um.grp.addModule": "New module in this group",
	"um.grp.export": "Export group",
	"um.grp.delete": "Delete group",
	"um.grp.deleteAsk": "Delete this group and its {n} module(s)?",
	"um.grp.keepModules": "Keep modules",
	"um.grp.deleteModules": "Delete modules too",
	"um.grp.empty": "Drag modules here",
	"um.grp.dropOut": "Drop here to take it out of its group",
	"um.grp.none": "No group",
	"um.grp.moveTo": "Move to group",
	"um.noEntries": "No content",
	"um.name": "Module name",
	"um.imported": "Imported {n} module(s).",
	"um.importedGroups": "Imported {n} module(s) in {groups} group(s).",
	"um.importedMissing": "{missing} of them refer to insertion points or variables that no longer exist.",
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
	"media.api.openrouter": "OpenRouter",
	"media.speech.openrouterModel": "What the model can do (inline tags, voice cloning, default voices) follows the provider in its id, e.g. elevenlabs/eleven-v3 or fish-audio/s2.1-pro. Voices are listed per model.",
	"media.image": "Image generation",
	"media.image.auto.hint": "Off: images are generated when you click Generate.",
	"media.image.promptType": "Prompt type",
	"media.image.promptType.tags": "Tags",
	"media.image.promptType.tags.hint": "Comma-separated Danbooru-style tags (NovelAI and similar)",
	"media.image.promptType.description": "Description",
	"media.image.promptType.description.hint": "One paragraph describing the image in English (SD, Midjourney and similar)",
	"media.image.promptType.instruction": "Instruction",
	"media.image.promptType.instruction.hint": "Direct requirements in natural language, any language (multimodal models such as GPT Image, Nano Banana)",
	"media.image.refs.global": "Global",
	"media.image.style": "Style prompt",
	"media.image.style.hint": "Appended to every image prompt. The preset is told a style is set, so the AI leaves style out.",
	"media.image.style.nl": "e.g. Soft watercolor illustration, muted palette",
	"media.image.style.tags": "e.g. watercolor, pastel colors, soft lighting",
	"media.image.negative": "Negative prompt",
	"media.image.negative.placeholder": "e.g. lowres, bad anatomy, watermark",
	"media.image.nsfwBlock": "Block NSFW",
	"media.image.nsfwBlock.hint": "The AI writes no image prompts for NSFW scenes.",
	"media.image.refs": "Reference images",
	"media.image.refs.hint": "The AI can pick these by id to keep characters and style consistent. Images of a character card are only used in its chats.",
	"media.image.refs.description": "What it shows",
	"media.image.refs.add": "Add images",
	"media.image.geminiEndpoint": "API",
	"media.scope.toggle": "{current} · click: {next}",
	"media.speech": "Speech synthesis",
	"media.speech.narrator": "Voice narration",
	"media.speech.narrator.hint": "Text outside character lines is read by the narrator voice.",
	"media.speech.auto.hint": "Off: audio is generated when you play it.",
	"media.speech.api": "API",
	"media.speech.narratorVoice": "Narrator voice",
	"media.speech.bindings": "Character voices",
	"media.speech.bindings.hint": "Story characters and their voices, for every chat or for one character card. The AI is given the names that apply to the current chat; a character without a voice asks for one before speaking.",
	"media.speech.character": "Character",
	"media.speech.addBinding": "Add character",
	"media.speech.providerDefault": "Provider default",
	"media.speech.global": "Global",
	"media.speech.scope": "Applies to",
	"media.speech.ask": "Voice for {name}",
	"media.speech.voiceId": "Voice ID",
	"media.speech.voiceSearch": "Voice ID or search",
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
	"media.speech.regenerateLine": "Regenerate this line",
	"media.speech.deleteLine": "Delete this line's audio",
	"media.speech.regenerateAll": "Regenerate all",
	"media.speech.deleteAll": "Delete audio",
	"media.speech.panel.open": "Speech panel",
	"media.speech.panel.title": "Speech",
	"media.speech.panel.off": "Speech synthesis is off.",
	"media.speech.panel.empty": "This message has nothing to speak.",
	"media.speech.panel.playAll": "Play all",
	"media.speech.panel.count": "{n} segments",
	"media.speech.panel.tags": "Inline tags this service understands",
	"media.speech.panel.voice": "Voice",
	"media.speech.panel.noVoice": "No voice yet (asked when played)",
	"media.speech.panel.text": "Text spoken for {who}",
	"media.speech.panel.edited": "Edited",
	"media.speech.panel.save": "Save",
	"media.speech.panel.revert": "Revert to the model's text",
	"media.speech.panel.generate": "Generate",
	"media.speech.state.none": "Not generated",
	"media.speech.state.loading": "Generating",
	"media.speech.state.ready": "Generated",
	"media.speech.state.error": "Failed",
	"media.speech.state.playing": "Playing",
	"media.image.view": "View full size",
	"media.image.generating": "Generating…",
	"media.image.previous": "Previous",
	"media.image.next": "Next",
	"media.image.prompt": "Image prompt",
	"media.image.generate": "Generate",
	"media.image.retry": "Retry",
	"media.image.regenerate": "Regenerate",
	"media.image.openPanel": "Edit in the image panel",
	"media.image.panel": "Image",
	"media.image.which": "Image prompt of this message",
	"media.image.nth": "Image {n}",
	"media.image.ratio": "Aspect ratio",
	"media.image.ratio.auto": "Auto",
	"media.image.caption": "Caption",
	"media.image.refs.unsupported": "The current image connection does not use reference images.",
	"media.image.refs.empty": "No reference images in this chat (add them in the Media tab).",
	"media.image.refs.unavailable": "Not available in this chat",
	"media.image.versions": "Versions",
	"media.image.versions.empty": "No images yet.",
	"media.image.show": "Show version {n}",
	"media.image.restore": "Restore the AI's prompt",
	"media.image.saveGenerate": "Save and generate",
	"media.image.gone": "This image prompt is no longer in the message (it was swiped or regenerated).",
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
}, zp = {
	en: Rp,
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
		"um.grp.new": "新建组",
		"um.grp.newName": "分组 {n}",
		"um.grp.untitled": "未命名分组",
		"um.grp.name": "组名",
		"um.grp.reorder": "拖动排序分组",
		"um.grp.collapse": "折叠",
		"um.grp.expand": "展开",
		"um.grp.count": "{n} 个模组",
		"um.grp.single": "单选：组内最多开启一个（点击改为多选）",
		"um.grp.multi": "多选：组内可同时开启多个（点击改为单选）",
		"um.grp.radioOn": "选用此项",
		"um.grp.radioOff": "关闭",
		"um.grp.addModule": "在此组中新建模组",
		"um.grp.export": "导出组",
		"um.grp.delete": "删除组",
		"um.grp.deleteAsk": "删除此组及其中的 {n} 个模组？",
		"um.grp.keepModules": "保留模组",
		"um.grp.deleteModules": "连同模组删除",
		"um.grp.empty": "将模组拖到这里",
		"um.grp.dropOut": "拖到这里移出分组",
		"um.grp.none": "未分组",
		"um.grp.moveTo": "移到分组",
		"um.noEntries": "无内容",
		"um.name": "模组名称",
		"um.imported": "已导入 {n} 个模组。",
		"um.importedGroups": "已导入 {groups} 个组中的 {n} 个模组。",
		"um.importedMissing": "其中 {missing} 个引用了失效的插入位置或变量。",
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
		"media.api.openrouter": "OpenRouter",
		"media.speech.openrouterModel": "模型的能力（内联标签、语音克隆、默认声音）按模型 id 中的提供者判断，例如 elevenlabs/eleven-v3、fish-audio/s2.1-pro。声音列表按模型获取。",
		"media.image": "图像生成",
		"media.image.auto.hint": "关闭时，点击“生成”后才生成图像。",
		"media.image.promptType": "提示词类型",
		"media.image.promptType.tags": "标签",
		"media.image.promptType.tags.hint": "逗号分隔的 Danbooru 风格标签（NovelAI 等）",
		"media.image.promptType.description": "描述",
		"media.image.promptType.description.hint": "一整段英文图像描述（SD、Midjourney 等）",
		"media.image.promptType.instruction": "指令",
		"media.image.promptType.instruction.hint": "直接提出图像要求的自然语言，不限语言（GPT Image、Nano Banana 等多模态模型）",
		"media.image.refs.global": "全局",
		"media.image.style": "风格提示词",
		"media.image.style.hint": "附加到每条图像提示词后。预设会知道已设置风格，AI 不再写风格。",
		"media.image.style.nl": "例如：柔和的水彩插画，低饱和配色",
		"media.image.style.tags": "例如：watercolor, pastel colors, soft lighting",
		"media.image.negative": "负面提示词",
		"media.image.negative.placeholder": "例如：lowres, bad anatomy, watermark",
		"media.image.nsfwBlock": "屏蔽 NSFW",
		"media.image.nsfwBlock.hint": "AI 不为 NSFW 场景写图像提示词。",
		"media.image.refs": "参考图",
		"media.image.refs.hint": "AI 可按 id 选用，保持角色与风格一致。角色卡的参考图只在该角色的聊天中使用。",
		"media.image.refs.description": "图中内容",
		"media.image.refs.add": "添加图片",
		"media.image.geminiEndpoint": "API",
		"media.scope.toggle": "{current} · 点击改为{next}",
		"media.speech": "语音合成",
		"media.speech.narrator": "旁白语音",
		"media.speech.narrator.hint": "角色台词以外的文字由旁白声音朗读。",
		"media.speech.auto.hint": "关闭时，播放时才生成语音。",
		"media.speech.api": "接口",
		"media.speech.narratorVoice": "旁白声音",
		"media.speech.bindings": "角色声音",
		"media.speech.bindings.hint": "故事角色与对应的声音，可用于所有聊天或只用于某张角色卡。AI 会得到当前聊天适用的角色名；没有声音的角色会在朗读前请你选择。",
		"media.speech.character": "角色",
		"media.speech.addBinding": "添加角色",
		"media.speech.providerDefault": "提供方默认",
		"media.speech.global": "全局",
		"media.speech.scope": "适用于",
		"media.speech.ask": "为 {name} 选择声音",
		"media.speech.voiceId": "声音 ID",
		"media.speech.voiceSearch": "声音 ID 或搜索",
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
		"media.speech.regenerateLine": "重新生成这一句",
		"media.speech.deleteLine": "删除这一句的语音",
		"media.speech.regenerateAll": "全部重新生成",
		"media.speech.deleteAll": "删除语音",
		"media.speech.panel.open": "语音面板",
		"media.speech.panel.title": "语音",
		"media.speech.panel.off": "语音合成未开启。",
		"media.speech.panel.empty": "这条消息没有可朗读的内容。",
		"media.speech.panel.playAll": "全部播放",
		"media.speech.panel.count": "{n} 个分块",
		"media.speech.panel.tags": "该服务支持的内联标签",
		"media.speech.panel.voice": "声音",
		"media.speech.panel.noVoice": "尚未设置声音（播放时询问）",
		"media.speech.panel.text": "{who} 的语音提示",
		"media.speech.panel.edited": "已修改",
		"media.speech.panel.save": "保存",
		"media.speech.panel.revert": "还原为模型原文",
		"media.speech.panel.generate": "生成",
		"media.speech.state.none": "未生成",
		"media.speech.state.loading": "生成中",
		"media.speech.state.ready": "已生成",
		"media.speech.state.error": "失败",
		"media.speech.state.playing": "播放中",
		"media.image.view": "查看大图",
		"media.image.generating": "生成中…",
		"media.image.previous": "上一张",
		"media.image.next": "下一张",
		"media.image.prompt": "图像提示词",
		"media.image.generate": "生成",
		"media.image.retry": "重试",
		"media.image.regenerate": "重新生成",
		"media.image.openPanel": "在图像面板中编辑",
		"media.image.panel": "图像",
		"media.image.which": "本条消息的图像提示",
		"media.image.nth": "图像 {n}",
		"media.image.ratio": "比例",
		"media.image.ratio.auto": "自动",
		"media.image.caption": "标题",
		"media.image.refs.unsupported": "当前图像连接不使用参考图。",
		"media.image.refs.empty": "本聊天没有可用的参考图（在「多模态」页添加）。",
		"media.image.refs.unavailable": "本聊天中不可用",
		"media.image.versions": "版本",
		"media.image.versions.empty": "还没有图像。",
		"media.image.show": "显示第 {n} 个版本",
		"media.image.restore": "还原为 AI 的提示",
		"media.image.saveGenerate": "保存并生成",
		"media.image.gone": "这条图像提示已不在消息中（消息已切换或重新生成）。",
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
function Bp() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function J(e, t = {}) {
	return ((zp[Bp()] ?? zp[Bp().split("-")[0]])?.[e] ?? Rp[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function Vp(e) {
	return e.locales?.[Bp()] ?? e.locales?.[Bp().split("-")[0]];
}
function Hp(e, t, n, r, i) {
	let a = Vp(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Up(e) {
	let t = Vp(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function Wp(e) {
	let t = Vp(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Gp(e, t, n) {
	return Xf(t, Bp(), Vp(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/core/storylines.ts
var Kp = "advanced_preset_storyline", qp = "advanced_preset_storyline_switched", Jp = "?new", Yp = (e) => e.startsWith("?"), Xp = (e) => {
	let t = e && !e.is_user ? e.extra?.[Kp] : void 0;
	return typeof t == "string" ? t : void 0;
};
function Zp(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = ed(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : Xp(e[o + 1]) ?? "?" : "";
		} else {
			let e = Xp(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !Yp(s) && (i = s);
	}), n;
}
var Qp = (e, t) => e === "" || e === t.main ? "" : e;
function $p(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? sd(e);
}
function em(e, t) {
	return e === "" ? !1 : t.hidden?.[e] ?? $p(e, t);
}
var tm = (e, t) => e === "" ? t.main ?? "" : Yp(e) ? "" : e;
function nm(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !em(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: tm(e, n),
		main: e === "",
		if: $p(e, n),
		hidden: em(e, n)
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
var rm = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function im(e, t, n, r = !1, i = rm, a = "off") {
	let o = {
		main: e === "",
		if: $p(e, t)
	};
	return {
		name: i.naming ? "" : tm(e, t),
		...o,
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching,
		frozen: Xu(a, o)
	};
}
function am(e, t, n) {
	let r = Zp(e, n).map((e) => Qp(e, n)), i = (e, i = n) => ({
		keys: r,
		meta: i,
		current: e,
		input: t,
		...rm
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? ed(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !Yp(r[n]) && (e = r[n]);
		if (c = rd(a.mes, o, e), l = !e, s(e), !e) return {
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
		if (o.form === "new") return s(Jp), o.ifLine ? {
			...i(Jp, {
				...n,
				if: {
					...n.if ?? {},
					[Jp]: !0
				}
			}),
			naming: !0,
			ifLine: !0,
			...e
		} : {
			...i(Jp),
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
	if (o.form === "name" && Qp(o.name, n) === "") return s(""), {
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
var om = (e) => e.is_user ? td(e.mes) : e.mes, sm = 983296, cm = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, lm = (e) => `⟦${String.fromCodePoint(sm + Math.min(e, 255))}⟧`;
function um(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(cm, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function dm(e, t, n, r) {
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
function fm(e, t, n, r, i = "off") {
	let { meta: a, current: o } = n, s = Zp(e, a).map((e) => Qp(e, a)), c = nm(e.map((e, i) => {
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
		let n = e[t], r = om(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), d = {
		current: o,
		naming: l,
		input: n.input,
		view: nm(n.keys, o, a).order,
		vars: im(o, a, c.isNew, c.grouped, l, i),
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
var pm = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function mm(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = um(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = um(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var hm = "advanced_preset";
function gm(e) {
	let t = e?.extra?.[hm];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function _m(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: q(n)
		}
	};
}
function vm(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[hm] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[hm] = q(n));
}
function ym(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[Kp], !n.extra.advanced_preset) ? !1 : (delete n.extra[hm], !0);
}
//#endregion
//#region src/store/eventlog.ts
function bm() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var xm = (e) => `legacy-${e}`;
function Sm(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = xm(n), t = !0);
	}), t;
}
function Cm(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? xm(e.index) : void 0);
}
var wm = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), Tm = "advanced_preset";
function Em() {
	return e().chatMetadata?.[Tm]?.seedEvents ?? [];
}
function Dm(t = Infinity, n) {
	let r = Em().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of gm(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function Om(e = Infinity, t) {
	let n = {};
	for (let { event: r } of Dm(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function km(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of Dm(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function Am(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = gm(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[Tm] && (e.extra[Tm].events = q(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[Tm] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function jm(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function Mm(e, t, n, r, i, a = bm()) {
	let o = e.globalMemory;
	Sm(o.log);
	let s = jm(e)[n] ?? null;
	return o.log.splice(o.cursor), o.log.push({
		id: a,
		op: t,
		key: n,
		content: r,
		prev: s,
		source: i,
		at: Date.now()
	}), o.cursor = o.log.length, K(), o.cursor - 1;
}
var Nm = (e) => e.globalMemory.cursor > 0, Pm = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Fm(e) {
	Nm(e) && (e.globalMemory.cursor--, K());
}
function Im(e) {
	Pm(e) && (e.globalMemory.cursor++, K());
}
function Lm(e, t) {
	let n = e.globalMemory.log[wm(e, t)];
	n && (n.prev === null ? Mm(e, "delete", n.key, void 0, "undo") : Mm(e, "replace", n.key, n.prev, "undo"));
}
function Rm(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = bm();
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
function zm(e, t) {
	for (let n of t) wm(e, n.id) < 0 && Mm(e, n.op, n.key, n.content, "model", n.id);
}
function Bm(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[wm(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function Vm(e) {
	let t = G().presets, n = t[e.id];
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
	}, K()), Sm(n.globalMemory.log) && K(), n;
}
function Hm(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : ku(e, n.id)?.diff;
}
function Um(e, t = Vm(e).active.ref) {
	return Cu(e.configurationDefaults, Hm(e, Vm(e), t));
}
function Wm(e) {
	let t = Vm(e);
	return Cu(Um(e, t.active.ref), t.active.diff);
}
function Gm(e, t) {
	let n = Vm(e);
	n.active.diff = Tu(t, Um(e, n.active.ref)) ?? {}, K();
}
function Km(e, t) {
	let n = Wm(e);
	return t(n), Gm(e, n), n;
}
function qm(e, t) {
	let n = Vm(e);
	n.active = {
		ref: t,
		diff: {}
	}, K();
}
var Jm = (e) => Object.keys(Vm(e).active.diff ?? {}).length > 0;
function Ym(e) {
	Vm(e).active.diff = {}, K();
}
function Xm(e, t) {
	let n = Vm(e), r = Wm(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Tu(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, K(), i;
}
function Zm(e, t) {
	let n = Vm(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Tu(Wm(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), K());
}
function Qm(e, t, n) {
	let r = Vm(e).saved.find((e) => e.id === t);
	r && (r.name = n, K());
}
function $m(e, t) {
	let n = Vm(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), K();
}
function eh(e) {
	let t = Vm(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = gu(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Ou(t, e.migrations, n) : q(t);
		i.push(...Eu(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !Mu(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Mf(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && Tf(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, K(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && x("warning", J("um.lostAfterUpdate", { names: s.join(", ") }), Up(e)), i;
}
//#endregion
//#region src/store/tavern-helper.ts
var th = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function nh(e, t, n = []) {
	let r = th(t) ? t : {}, i = (e) => e.id !== Rd, a = (Array.isArray(r.scripts) ? r.scripts : []).filter(th).filter(i).map((e) => Array.isArray(e.scripts) ? {
		...e,
		scripts: e.scripts.filter((e) => !th(e) || i(e))
	} : e), o = q(e ?? []), s = jd(o), c = /* @__PURE__ */ new Set([...s, ...n]), l = (e) => typeof e.id != "string" || !c.has(e.id), u = /* @__PURE__ */ new Map();
	for (let e of a) {
		typeof e.id == "string" && u.set(e.id, e);
		for (let t of Array.isArray(e.scripts) ? e.scripts.filter(th) : []) typeof t.id == "string" && u.set(t.id, t);
	}
	let d = (e) => {
		let t = u.get(e.id);
		t && t.type === e.type && (typeof t.enabled == "boolean" && (e.enabled = t.enabled), e.data && th(t.data) && (e.data = {
			...e.data,
			...q(t.data)
		}));
	};
	for (let e of o) {
		if (d(e), e.type !== "folder") continue;
		for (let t of e.scripts) d(t);
		let t = u.get(e.id), n = th(t) && Array.isArray(t.scripts) ? t.scripts.filter(th).filter(l) : [];
		e.scripts.push(...q(n));
	}
	let f = [...o, ...q(a.filter(l))], p = th(r.variables) ? q(r.variables) : {}, m = Object.keys(r).some((e) => e !== "scripts" && e !== "variables");
	return !f.length && !Object.keys(p).length && !m ? { owned: s } : {
		data: {
			...q(r),
			scripts: f,
			variables: p
		},
		owned: s
	};
}
function rh(e, t) {
	let n = (e) => JSON.stringify(th(e) && Array.isArray(e.scripts) ? e.scripts.map((e) => th(e) ? {
		...e,
		data: void 0,
		scripts: Array.isArray(e.scripts) ? e.scripts.map((e) => th(e) ? {
			...e,
			data: void 0
		} : e) : void 0
	} : e) : []);
	return n(e) !== n(t);
}
function ih(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of th(e) && Array.isArray(e.scripts) ? e.scripts.filter(th) : []) {
		n.set(String(t.id), t.content ?? null);
		for (let e of Array.isArray(t.scripts) ? t.scripts.filter(th) : []) n.set(String(e.id), e.content ?? null);
	}
	let r = JSON.stringify(t.map((e) => n.get(e) ?? null)), i = 2166136261;
	for (let e = 0; e < r.length; e++) i = Math.imul(i ^ r.charCodeAt(e), 16777619) >>> 0;
	return i.toString(16);
}
//#endregion
//#region src/store/carrier.ts
var ah = "advanced_preset";
function oh(e) {
	let t = e?.extensions?.[ah];
	if (!t?.tavernHelperPrevious || !t.tavernHelperScripts) return !1;
	let n = ih(e.extensions[Ad], t.tavernHelperScripts);
	return n === t.tavernHelperPrevious && n !== t.tavernHelperCode;
}
var sh = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, ch = (e) => sh[e] ?? e, lh = () => e().getPresetManager("openai"), uh = (e) => `AP · ${e.name}`;
function dh() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function fh(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function ph(e, t, n) {
	let r = e.carrier.prompt_order.map((e) => ({ ...e })), i = n?.extensions?.[ah], a = nh(e.tavernHelperScripts, n?.extensions?.[Ad], i?.presetId === e.id ? i.tavernHelperScripts : void 0), o = {
		presetId: e.id,
		version: e.version,
		hash: e.hash
	};
	if (a.owned.length) {
		let t = ih(a.data, a.owned), n = i?.presetId === e.id ? i : void 0, r = n?.tavernHelperCode !== void 0 && n.tavernHelperCode !== t ? n.tavernHelperCode : n?.tavernHelperPrevious;
		Object.assign(o, {
			tavernHelperScripts: a.owned,
			tavernHelperCode: t
		}, r ? { tavernHelperPrevious: r } : {});
	}
	return {
		...q(t.sampling),
		prompts: q(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: q(r)
		})),
		extensions: {
			[ah]: o,
			...e.regexScripts?.length ? { regex_scripts: q(e.regexScripts) } : {},
			...a.data ? { [Ad]: a.data } : {}
		}
	};
}
function mh(e) {
	let t = lh();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function hh(e, t, n) {
	let r = lh();
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
async function gh(e, t = {}) {
	let n = lh(), r = Vm(e), i = mh(e.id), a = i ?? uh(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[ah], c = !o || t.force || s?.hash !== e.hash || oh(o), l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && fh(o) !== r.carrierHash && x("info", J("carrier.reset", { name: a }));
		let n = ph(e, Wm(e), o);
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = fh(n), K(), await hh(a, n, !!t.select || l);
		let i = n.extensions[Ad];
		l && rh(o?.extensions?.tavern_helper, i) && vh(a);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
var _h = !1;
function vh(e) {
	"TavernHelper" in globalThis && !_h && (_h = !0, y(`<p>${v(J("carrier.tavernHelper.reload", { name: e }))}</p>`, J("carrier.tavernHelper.reloadNow"), J("common.later")).then((e) => {
		_h = !1, e && location.reload();
	}));
}
async function yh(e) {
	await gh(e, { select: !0 });
}
async function bh(e) {
	let t = mh(e.id);
	if (!t) return;
	let n = lh(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Wm(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...q(i)
	}, o = n.getSelectedPresetName() === t;
	xh = !0;
	try {
		await hh(t, a, o);
	} finally {
		xh = !1;
	}
}
var xh = !1;
function Sh(t) {
	if (xh || dh() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Wm(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[ch(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = q(r));
	}
	return Object.keys(i).length ? (Km(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var Ch = null, wh = (e) => {
	Ch = e;
}, Th = () => {
	let e = Ch;
	return Ch = null, e;
}, Eh = (e) => e.meta?.enabled !== !1;
function Dh(t, n) {
	if (!Eh(n)) return "";
	let r = Ws(t.meta.trigger, (e) => e[0] === "name" ? md(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Oh(e, t, n, r, i, a = [], o = !0) {
	let s = Ll(n, Dh(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = ld(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && Vs(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && Vs(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && Vs(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? Th() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function kh(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Ah = 0, jh = () => `ap-${Date.now().toString(36)}-${(++Ah).toString(36)}`, Mh = /* @__PURE__ */ new Map(), Nh = null, Ph = null, Fh = {
	setPending(e) {
		Nh = e;
	},
	takePending() {
		let e = Nh;
		return Nh = null, e;
	},
	peekPending: () => Nh,
	arm(e) {
		Ph = e, Mh.set(e.id, e);
	},
	takeArmed() {
		let e = Ph;
		return Ph = null, e;
	},
	get: (e) => Mh.get(e),
	release(e) {
		Mh.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of Mh) t - r.createdAt > e && Mh.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function Ih(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.speech ? "v" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function Lh(e, t) {
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
var Rh = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, zh = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), Bh = (e, t) => _p(e, t), Vh = (e, t) => t ? Rh(e)?.structures?.[t] : void 0, Hh = (e, t) => Rh(e)?.structures?.[t];
function Uh(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = Rh(e);
		if (a && zh.has(a.turn)) {
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
		let n = Ll(e.item.mes, t.trigger, t.wrap);
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
				} else Vh(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && Rh(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of a(t.speech?.depth ?? 0)) e.fresh.body === "full" && e.index !== t.continuing && Rh(e.item)?.speech?.length && (e.fresh.speech = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && mp(Hh(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function Wh(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : Vh(r, n.synopsisId);
			return e ? Bh(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? Rh(r)?.annotations : void 0, a = t.speech ? Rh(r)?.speech : void 0;
			return a?.length && (e = Lc(e, a, n.speech?.tag)), i?.length && (e = fc(e, i)), t.echo?.length && n.echoes && (e = Gh(e, r, t.echo, n.echoes)), e;
		}
	}
}
function Gh(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = Hh(t, e.id);
		mp(a) && e.pieces.forEach((t, n) => i.push({
			text: gp(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? vp(e, r.contentKey, i) : e;
}
function Kh(e, t) {
	let n = [];
	for (let r of Uh(e, t)) {
		let e = Wh(r, r.fresh, t);
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
function qh(e, t) {
	return Kh(e, t).map((e) => e.item);
}
function Jh(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? cp(n) : 0;
	if (r) return dd(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function Yh(e, t, n) {
	let r = Object.values(e.structures).find((e) => e.kind === "speech"), i = r ? lp(r) : 0;
	if (i && e.speech && n?.speech?.on) return dd(e, t).some((e) => e.structures.includes(r.id)) ? {
		depth: i,
		tag: r.tag
	} : void 0;
}
function Xh(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function Zh(e, t, n, r) {
	let i = new Set(dd(e, t).flatMap((e) => e.structures)), a = n ? ld(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = sp(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? Vs(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...fp(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: dp(r)
	} : void 0;
}
var Qh = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function $h(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function eg(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = $h(e), r = $h(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function tg(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Qh(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Qh(l.text);
			if (c === u || c.includes(u) || eg(c, u) >= n) {
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
var ng = 50;
function rg(e, t) {
	let n = yf(e, t);
	return n.groups.length === t.length && n.modules.every((t, n) => t === e[n]);
}
function ig(e) {
	let t = Vm(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	let r = t.userModuleGroups ?? [];
	return rg(n, r) ? n : (og(e, n, r), t.userModules);
}
function ag(e) {
	return ig(e), Vm(e).userModuleGroups ??= [];
}
function og(e, t, n) {
	let r = Vm(e), i = yf(t, n);
	r.userModules = i.modules, r.userModuleGroups = i.groups, K();
}
var sg = (e, t) => ig(e).find((e) => e.id === t), cg = (e, t) => t ? ag(e).find((e) => e.id === t) : void 0;
function lg(e, t, n) {
	return cg(e, t)?.mode === "single" && ig(e).some((e) => e.group === t && e.id !== n && e.enabled);
}
var ug = () => Math.random().toString(36).slice(2, 8);
function dg(e) {
	let t = new Set(e), n = ug();
	for (; t.has(n);) n = ug();
	return n;
}
function fg(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: dg(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function pg(e, t, n) {
	return cg(e, n) && (t.group = n, lg(e, n) && (t.enabled = !1)), og(e, [...ig(e), t], ag(e)), sg(e, t.id);
}
function mg(e, t, n) {
	let r = {
		id: dg(ig(e).map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: uf()
	};
	return e.insertionPoints.length && r.entries.push(fg(e, r)), pg(e, r, n);
}
function hg(e, t, n) {
	let r = ig(e), i = new Set(r.map((e) => e.name)), a = t.name;
	for (let e = 2; i.has(a); e++) a = `${t.name} ${e}`;
	return pg(e, Zf(t, dg(r.map((e) => e.id)), { name: a }), n);
}
function gg(e, t, n) {
	let r = ig(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...q(r[i]),
		id: dg(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return lg(e, a.group) && (a.enabled = !1), og(e, [
		...r.slice(0, i + 1),
		a,
		...r.slice(i + 1)
	], ag(e)), sg(e, a.id);
}
function _g(e, t) {
	og(e, ig(e).filter((e) => e.id !== t), ag(e));
}
function vg(e, t, n) {
	let r = sg(e, t);
	if (r) {
		if (n && cg(e, r.group)?.mode === "single") for (let t of ig(e)) t.group === r.group && t !== r && (t.enabled = !1);
		r.enabled = n, K();
	}
}
function yg(e, t, n, r) {
	let i = ig(e), a = i.find((e) => e.id === t);
	if (!a) return;
	let o = n === null ? void 0 : cg(e, n)?.id;
	if (n !== null && !o) return;
	let s = i.filter((e) => e !== a), c = bf(s, o ?? null)[Math.max(0, r)], l = { ...a };
	o ? l.group = o : delete l.group, o !== a.group && l.enabled && lg(e, o, a.id) && (l.enabled = !1);
	let u = c ? s.indexOf(c) : s.length, d = [
		...s.slice(0, u),
		l,
		...s.slice(u)
	];
	d.every((e, t) => e.id === i[t].id) && l.group === a.group && l.enabled === a.enabled || og(e, d, ag(e));
}
function bg(e, t, n = "multi") {
	let r = ag(e), i = {
		id: dg(r.map((e) => e.id)),
		name: t,
		mode: n
	};
	return og(e, ig(e), [...r, i]), cg(e, i.id);
}
function xg(e, t, n) {
	let r = cg(e, t);
	r && (r.name = n, K());
}
function Sg(e, t, n) {
	let r = cg(e, t);
	r && r.mode !== n && (r.mode = n, og(e, ig(e), ag(e)));
}
function Cg(e, t, n) {
	let r = cg(e, t);
	r && (n ? r.collapsed = !0 : delete r.collapsed, K());
}
function wg(e, t, n) {
	let r = ag(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let a = [...r], [o] = a.splice(i, 1);
	a.splice(n, 0, o), og(e, ig(e), a);
}
function Tg(e, t, n) {
	let r = ag(e);
	if (!r.some((e) => e.id === t)) return;
	let i = ig(e);
	og(e, n.withModules ? i.filter((e) => e.group !== t) : i.map((e) => e.group === t ? (({ group: e, ...t }) => t)(e) : e), r.filter((e) => e.id !== t));
}
function Eg(e, t) {
	return Wf(q(ig(e).filter((e) => !t || t.includes(e.id))), e, q(ag(e)));
}
function Dg(e, t) {
	let n = cg(e, t);
	return n ? {
		...Wf(q(bf(ig(e), t)), e),
		groups: [q(n)]
	} : Wf([], e);
}
function Og(e, t) {
	let n = Gf(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && gu(n.preset.version, e.version) < 0 && (r = Mf(r, e.migrations, n.preset.version));
	let i = ag(e).map((e) => e.id), a = /* @__PURE__ */ new Map(), o = n.groups.map((e) => {
		let t = dg(i);
		return i.push(t), a.set(e.id, t), {
			...e,
			id: t
		};
	}), s = ig(e).map((e) => e.id), c = r.map((e) => {
		let t = dg(s);
		s.push(t);
		let n = {
			...e,
			id: t
		};
		return e.group !== void 0 && (n.group = a.get(e.group)), n;
	});
	og(e, [...ig(e), ...c], [...ag(e), ...o]);
	let l = c.map((t) => sg(e, t.id));
	return {
		added: l,
		groups: o.map((t) => cg(e, t.id)),
		missing: l.filter((t) => Tf(e, t).length).length
	};
}
function kg(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < ng; t--) {
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
var Ag = /* @__PURE__ */ fn({
	log: [],
	requests: []
}), jg = 50;
function Mg(e, t) {
	Ag.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Ag.log.length > jg && (Ag.log.length = jg);
}
function Ng(e) {
	return Ag.requests.unshift(e), Ag.requests.length > jg && (Ag.requests.length = jg), Ag.requests[0];
}
//#endregion
//#region src/core/cache.ts
function Pg(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Fg(e, t) {
	return e.send_date ? Pg(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var Ig = 57344, Lg = /⟦([\uE000-\uF8FF])⟧/g, Rg = (e) => `⟦${String.fromCharCode(Ig + e)}⟧`;
function zg(e) {
	let t = [];
	return {
		text: e.replace(Lg, (e, n) => (t.push(n.charCodeAt(0) - Ig), "")),
		marks: t
	};
}
function Bg(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of Uh(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : Lh(n?.[e], t.synopsisId), l = c ?? s.fresh, u = Wh(s, s.fresh, t), d = c ? Wh(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = Ih(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: Ih(l),
			freshMode: Ih(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function Vg(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function Hg(e, t, n, r, i, a = {}) {
	let o = Vg(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && Pg(i) === n[r]) r++;
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
		r !== null && f.push(Pg(r));
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
function Ug(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var Wg = "advanced-preset.cache.v1", Gg = 864e5, Kg = 30, qg = null;
function Jg() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function Yg() {
	if (qg) return qg;
	try {
		let e = Jg()?.getItem(Wg), t = e ? JSON.parse(e) : {};
		qg = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		qg = {};
	}
	return qg;
}
function Xg(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= Gg).sort((e, t) => t[1].at - e[1].at).slice(0, Kg);
	qg = Object.fromEntries(n);
	try {
		Jg()?.setItem(Wg, JSON.stringify(qg));
	} catch {}
}
function Zg() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var Qg = (e, t) => t ? `${e}\u0001${t}` : e;
function $g(e) {
	return Yg()[e];
}
function e_(e, t) {
	Xg({
		...Yg(),
		[e]: t
	}, t.at);
}
function t_(e, t) {
	let n = Yg()[e];
	n && e_(e, {
		...n,
		at: t
	});
}
function n_(e, t) {
	let n = Yg(), r = (t) => Qg(e, t);
	if (!t.some(([e, t]) => r(e) in n || r(t) in n)) return;
	let i = { ...n };
	for (let [e, n] of t) delete i[r(e)], delete i[r(n)];
	for (let [e, a] of t) n[r(e)] && (i[r(a)] = n[r(e)]);
	Xg(i, Date.now());
}
//#endregion
//#region src/core/input-shaping.ts
var r_ = "⟦󰀀⟧", i_ = "⟦󰀁⟧", a_ = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function o_(e) {
	let t = e.match(a_)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + r_ + t;
}
var s_ = (e) => e.replaceAll(r_, "");
function c_(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = s_(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = s_(e.text));
}
function l_(e, t, n, r) {
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
			let n = t.lastIndexOf(r_);
			if (n < 0) continue;
			let a = s_(t.slice(0, n)).replace(a_, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: s_(t.slice(n + 4))
			};
		}
	}
	return null;
}
var u_ = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function d_(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? np(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && u_(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (u_(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var f_ = "stream_function_call_arguments";
function p_(e, t, n) {
	if (e === "off" || t !== "gemini") return !1;
	if (e === "on") return !0;
	let r = String(n.chat_completion_source ?? "");
	return r === "vertexai" || r === "custom" || r === "makersuite" && !!String(n.reverse_proxy ?? "").trim();
}
function m_(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function h_(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[f_] = !0, t() && g_(e));
}
function g_(e) {
	let t = __(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...m_(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function __(e) {
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
var v_ = "google-gemini-v1", y_ = /* @__PURE__ */ new WeakSet(), b_ = /* @__PURE__ */ new WeakSet();
function x_(e) {
	return y_.add(e), e;
}
function S_(e, t) {
	if (t !== "gemini" && !(t === "openai" && e.config.connection.openAiSignatures)) return;
	let n = e.config.connection.syntheticTurn, r = n ? e.preset.syntheticTurns.find((e) => e.id === n) : void 0;
	return r ? xu(r, bu(e.config.connection)) : void 0;
}
function C_(e) {
	return b_.add(e), e;
}
function w_(e, t) {
	return !e.signatureFallback && (e.transport === "tool-single" || e.transport === "tool-multi") && !!S_(e, t);
}
function T_(e) {
	let { message: t = "", body: n = "" } = e ?? {};
	return /thought[\s_-]?signature/i.test(`${t}\n${n}`);
}
function E_(e, t, n = {}) {
	return t !== "gemini" && !(t === "openai" && n.openAi) ? e : e.map((e) => e.role !== "assistant" || !Array.isArray(e.tool_calls) || !e.tool_calls.length ? e : t === "gemini" ? O_(e, !!n.fallback) : y_.has(e) ? k_(e, !!n.fallback, n.source === "openrouter") : e);
}
var D_ = (e, t) => t && b_.has(e) || typeof e.signature != "string" || !e.signature ? void 0 : e.signature;
function O_(e, t) {
	let n = e.tool_calls;
	return n.every((e) => D_(e, t)) ? e : {
		...e,
		tool_calls: n.map((e) => ({
			...e,
			signature: D_(e, t) ?? "skip_thought_signature_validator"
		}))
	};
}
function k_(e, t, n) {
	let r = Array.isArray(e.reasoning_details) ? [...e.reasoning_details] : [], i = e.tool_calls.map((e) => {
		let i = D_(e, t), { signature: a, ...o } = e;
		return i ? (r.push({
			type: "reasoning.encrypted",
			data: i,
			id: e.id,
			format: v_,
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
function A_(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of xl(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function j_(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function M_(e) {
	return xl(e.preset.tools, e.workflow, e.stages, e.structures, j_(e));
}
function N_(e) {
	let t = e.preset.tools.envelope.when;
	return !t || !e.assembly || Vs(t, e.assembly.resolve);
}
function P_(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${md(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function F_(e, t, n) {
	let r = ul(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return j_(e)(r);
}
function I_(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = S_(r, i), l = {
		id: s,
		type: "function",
		function: {
			name: o.tool.name,
			arguments: "{}"
		},
		...c ? { signature: c } : {}
	};
	c && C_(l);
	let u = j_(r), d = u(o.tool.description);
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
			x_({
				role: "assistant",
				content: "",
				tool_calls: [l]
			}),
			{
				role: "tool",
				tool_call_id: s,
				content: F_(r, o.response[t], { first: n })
			}
		]
	};
}
function L_(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t);
	let r = String(n.chat_completion_source ?? "");
	return Array.isArray(n.messages) && (n.messages = E_(n.messages, e.family, {
		fallback: e.ctx.signatureFallback,
		source: r,
		openAi: e.ctx.config.connection.openAiSignatures
	})), e.family === "gemini" && R_(n, e.ctx.preset.tools.jsonStringHint), p_(e.ctx.config.connection.streamToolArguments, e.family, n) && h_(n), n;
}
function R_(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = kd(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Dd(e.json_schema.value, n)
	});
}
function z_(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var B_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", V_ = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(r_, ""), H_ = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(Lg.source).test(e);
function U_(e) {
	for (let t of e) if (typeof t.content == "string") H_(t.content) && (t.content = zg(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && H_(e.text) && (e.text = zg(e.text).text);
}
function W_(e) {
	if (typeof e.content == "string") {
		if (!H_(e.content)) return null;
		let { text: t, marks: n } = zg(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => Ug(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !H_(e.text)) return;
		let i = zg(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = Ug(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function G_(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = M_(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return Pg(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function K_(e) {
	return Pg(e.map((e) => `${e.role}\u0000${B_(e.content)}`).join(""));
}
function q_(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return U_(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = W_(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = V_(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = V_(i.content);
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
			sticky: V_(f),
			fresh: V_(p),
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
		tools: G_(e),
		prompt: K_(t.slice(0, n))
	}, p = Hg(l, $g(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function J_(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? t_(n.chat, t) : e_(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var Y_ = "advanced_preset", X_ = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function Z_() {
	let t = e().chatMetadata?.[Y_]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function Q_(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[Y_] ??= {};
	r.storylines = t;
}
function $_(t = e().chat, n = Z_()) {
	return Zp(t, n).map((e) => Qp(e, n));
}
function ev(t = e().chat, n = Z_()) {
	let r = new Set($_(t, n).filter((e) => e !== "" && !Yp(e)));
	n.main && r.add(n.main);
	for (let e of [...Object.keys(n.if ?? {}), ...Object.keys(n.hidden ?? {})]) r.add(e);
	return r;
}
function tv(t, n = e().chat, r = Z_()) {
	let i = $_(n, r);
	return nm(i, t ?? i.at(-1) ?? "", r).order;
}
function nv(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function rv(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[Kp] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[Kp] = n);
}
async function iv(t, n) {
	if (!t) return;
	let r = Z_();
	Q_({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function av(t) {
	let n = Z_();
	return !$u(t) || $_(e().chat, n).includes(t) ? !1 : (Q_({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
async function ov(t, n) {
	if (!t) return await av(n) ? "renamed" : $u(n) ? "taken" : "invalid";
	if (!$u(n)) return "invalid";
	if (n === t) return "unchanged";
	let r = Z_();
	if (n === r.main || $_(e().chat, r).includes(n)) return "taken";
	let i = e().chat, a = [];
	i.forEach((e, r) => {
		if (e.is_user) {
			let i = ed(e.mes);
			if (i?.form !== "name" || i.name !== t) return;
			e.mes = rd(e.mes, i, n), a.push(r);
		} else e.swipe_info?.forEach((e) => {
			e?.extra?.advanced_preset_storyline === t && (e.extra[Kp] = n);
		}), e.extra?.advanced_preset_storyline === t && (e.extra[Kp] = n);
	});
	let o = $p(t, r), s = em(t, r), c = { ...r.if ?? {} }, l = { ...r.hidden ?? {} };
	delete c[t], delete l[t], o === sd(n) ? delete c[n] : c[n] = o, s === o ? delete l[n] : l[n] = s;
	let u = {
		...r,
		if: c,
		hidden: l
	};
	Object.keys(c).length || delete u.if, Object.keys(l).length || delete u.hidden, Q_(u), n_(Zg(), [[t, n]]);
	for (let t of a) e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "renamed";
}
async function sv(t, n) {
	if (!t) return;
	let r = Z_();
	Q_({
		...r,
		hidden: {
			...r.hidden ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
function cv(e, t) {
	if (!e) return;
	let n = Z_(), r = { ...n };
	t.ifLine !== void 0 && (t.ifLine || sd(e)) && (r.if = {
		...n.if ?? {},
		[e]: t.ifLine
	}), t.hide && (r.hidden = {
		...n.hidden ?? {},
		[e]: !0
	}), Q_(r);
}
function lv(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[qp] = !0);
}
async function uv(t, n) {
	let r = Z_();
	if (!$u(t)) return "invalid";
	if (Qp(t, r) === "") return "unchanged";
	let i = e().chat, a = Zp(i, r).map((e) => Qp(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!$u(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = nd(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? Qp(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Kp] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Kp] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && $p(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t];
	let l = { ...r.hidden ?? {} };
	o && delete l[o], delete l[t], Q_({
		...r,
		main: t,
		if: c,
		...Object.keys(l).length || r.hidden ? { hidden: l } : {}
	}), n_(Zg(), o ? [["", o], [t, ""]] : [[t, ""]]);
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/media-vars.ts
var dv = {
	image: () => ({
		vars: { ..._c },
		refs: []
	}),
	speech: () => ({
		vars: { ...vc },
		format: "",
		characters: []
	})
}, fv = {};
function pv(e) {
	fv = {
		...fv,
		...e
	};
}
function mv() {
	return {
		image: fv.image ?? dv.image,
		speech: fv.speech ?? dv.speech
	};
}
var hv = (e, t, n) => {
	try {
		return e();
	} catch (e) {
		return console.error(`[AP] ${n} runtime failed`, e), t();
	}
};
function gv(e) {
	if (!e.image) return dv.image();
	let t = hv(() => mv().image(), dv.image, "image");
	if (!t.vars.on) return {
		vars: { ..._c },
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
function _v(e) {
	if (!e.speech) return dv.speech();
	let t = hv(() => mv().speech(), dv.speech, "speech");
	if (!t.vars.on) return {
		vars: { ...vc },
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
var vv = /⟦ap:region:([\w.-]+)⟧/g, yv = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function bv(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(vv)) {
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
function xv(t, n, r) {
	if (!Eh(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = md(t, n, t.user), s = md(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = gm(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? el(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function Sv(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = gm(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : Yc(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var Cv = (e) => e?.view;
function wv(t, n) {
	let { preset: r, config: i } = t, a = Cv(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = Sv(r, s), l = Om(Infinity, a), u = jm(Vm(r)), d = km(Infinity, a), f = xv(r, i, s), p = X_(r, i) ? Z_().main ?? "" : "", m = t.transport, h = t.origin === "story", g = gv(h ? r : {}), _ = _v(h ? r : {});
	return {
		vars: Sd(r, i, {
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
				...Zu,
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
			inputText: t.inputShaped ? i_ : "",
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
function Tv(t, n, r) {
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
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = tg(c.map(({ m: e }) => ({
		role: e.role,
		text: yv(e.content)
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
			mes: yv(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (X_(i, a)) {
		let e = fm(p, m, am(l, -1, Z_()), -1, Yu(a.storylines));
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = wv(t, kh(i, a, t.origin)).vars, v = {
		trigger: Dh(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...Xh(i),
		echoes: Zh(i, a, _, kh(i, a, "story")),
		recap: km(Infinity, Cv(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: Jh(i, a),
		speech: Yh(i, a, _),
		...g ? { background: (e) => pm(g, h[e]) } : {}
	}, y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = Qg(Zg(), g?.current), n = Bg(p, v, $g(e)?.modes, (e) => Fg(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			y.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + Rg(e.entry));
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
	} else for (let e of qh(p, v)) y.set(e.__h, e.mes), b.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = b.get(e);
		e >= 0 && y.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (y.set(e, o_(y.get(e))), t.input = { texts: n });
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
function Ev(t, n) {
	let r = n ? null : Fh.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Wm(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = Oh(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: jh(),
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
		keywords: kg(a, n ? o : -1)
	};
}
var Dv = Symbol("ap-region");
function Ov(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function kv(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? l_(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (c_(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(i_) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		d_(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(i_, () => c) : e;
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
function Av(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return dm(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = cd(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, Dv, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && yv(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function jv(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => yv(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${md(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = yv(t.content);
		if (t[Dv] || t.role === "system") return n;
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
var Mv = /* @__PURE__ */ new Set();
function Nv(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !Mv.has(n) && (Mv.add(n), x("warning", J("warn.template", { error: n }), J("app.name")));
}
function Pv(e) {
	let t = (e) => (typeof e.content == "string" ? e.content : JSON.stringify(e.content ?? "")).includes(Ld);
	for (let n = e.length - 1; n >= 0; n--) t(e[n]) && e.splice(n, 1);
}
async function Fv(t) {
	let { chat: n, dryRun: r } = t;
	if (Pv(n), !G().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		U_(n), c_(n), mm(n), r || (Fh.setPending(null), Fh.takeArmed());
		return;
	}
	let i = dh(), a = i ? Mp(i) : void 0;
	if (!a) {
		let e = bv(n).filter((e) => !e.__anchor);
		U_(e), c_(e), mm(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = Ev(a, r), s = bv(n), c = mm(s);
	!o.interceptorRan && !r && Tv(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : kh(a, o.config, o.origin), d = a.inputShaping, f = Ov(a, s), p = d && o.input ? l_(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = wv(o, u), g = Of(a, ig(a), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = xd({
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, u);
	_.warnings.length && Nv(_.warnings, o.warnings), o.workflow = u, o.assembly = _, o.stages = _.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : _.structures;
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
			text: Gu(t)
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
			return Object.defineProperty(t, Dv, { value: !0 }), t;
		}).filter((e) => yv(e.content).trim());
		S.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: yv(e.content).length,
				content: yv(e.content)
			}))
		}), y.push(...n), t === a.anchors.historyStart && (b = y.length);
	}
	let ee = new Set(s.map((e) => e.__anchor).filter(Boolean));
	for (let [e, t] of Object.entries(_.regions)) !ee.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	let te = x < 0 ? y.length : x, C = o.storylines;
	C && (S.storyline = {
		...C.vars,
		groups: C.groups.map((e) => e.main ? `(main) ${e.name}` : `${e.if ? "(if) " : ""}${e.hidden ? "(hidden) " : ""}${e.name || "?"}`),
		hidden: C.hidden,
		grouped: C.grouped
	}, C.grouped && b >= 0 && (te = Av(o, C, y, b, te))), S.cache = q_(o, y, b, te), S.input = kv(o, y, b, te, S);
	let ne = o.transport === "prefill" && !l && b >= 0 ? jv(o, y, b) : y;
	n.splice(0, n.length, ...ne.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), Mg("assembly", S), !r && !l && u && Fh.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var Iv = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, Lv = (e) => typeof e == "object" && !!e && !Array.isArray(e), Rv = (e, t) => X_(e, t) ? Yu(t?.storylines) : "off";
function zv() {
	let e = dh(), t = e ? Mp(e) : void 0;
	return t ? Rv(t, Wm(t)) : "off";
}
function Bv(e, t) {
	if (typeof e != "string" || !e) return -1;
	for (let n = t.length - 1; n >= 0; n--) if (t[n].mes === e) return n;
	if (e.length >= 40) {
		for (let n = t.length - 1; n >= 0; n--) if (t[n].mes.includes(e)) return n;
	}
	return -1;
}
var Vv = (e) => !!(qv?.open && e >= qv.from);
function Hv(t, n = e().chat) {
	let r = Bv(t, n);
	return r < 0 ? null : Vv(r) ? qv.line : $_(n)[r];
}
function Uv(t, n, r = e().chat) {
	if (n === "off") return !1;
	let i = Bv(t, r);
	if (i < 0 || Vv(i)) return !!(qv?.open && qv.frozen);
	let a = $_(r)[i];
	return Xu(n, {
		main: a === "",
		if: $p(a, Z_())
	});
}
var Wv = /* @__PURE__ */ new WeakSet();
function Gv(e, t, n) {
	Lv(e) && Array.isArray(t) && Uv(n, zv()) && (t.length && Mg("variables", {
		frozen: "mvu",
		storyline: Hv(n) ?? qv?.line,
		commands: t.length
	}), t.splice(0, t.length), Wv.add(e));
}
function Kv(e, t) {
	Lv(e) && Wv.has(e) && (Wv.delete(e), Lv(t) && "stat_data" in t && (e.stat_data = q(t.stat_data)), e.delta_data = {});
}
var qv = null;
function Jv(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return Lv(n) ? n : void 0;
}
var Yv = /* @__PURE__ */ new Set(["display_data", "delta_data"]), Xv = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !Yv.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function Zv(t) {
	qv = null, t.line !== void 0 && (qv = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		frozen: t.frozen,
		from: Math.max(0, t.from),
		chatVars: t.frozen ? q(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function Qv() {
	let t = qv;
	if (!t?.frozen) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return qv = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = q(t.chatVars), r = !0);
	let o = n.chat, s = $_(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = Jv(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = Jv(o[t]);
		Xv(n, r) || (t.variables[t.swipe_id ?? 0] = r ? q(r) : {}, i = !0);
	}
	return (r || i) && Mg("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var $v = () => {
	qv = null;
};
function ey() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(Iv.commandParsed, (e, t, n) => Gv(e, t, n)), r(Iv.updateEnded, (e, t) => Kv(e, t));
	let i = (e) => () => {
		qv && (e && (qv.open = !1), setTimeout(() => void Qv().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || $v();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, $v);
}
//#endregion
//#region src/core/interceptor.ts
async function ty(t, n, r, i) {
	if (Fh.setPending(null), !G().enabled) return;
	let a = dh(), o = a ? Mp(a) : void 0;
	if (!o) return;
	let s = Wm(o), c = i || "normal";
	c === "swipe" && ym(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (X_(o, s)) {
		let e = Z_(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = am(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || nv(n, i.rewrite), i.noRecent && x("info", J("storylines.noRecent"), J("app.name")));
		let a = fm(t, r ? t.map((e, t) => t) : f, i, u, Yu(s.storylines));
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", g = t.slice(-6).map((e) => e.mes), _ = kg(t, u), { meta: v, flags: y, origin: b } = Oh(o, s, h, c, !0, g), S = s.connection.transport, { vars: ee } = wv({
		preset: o,
		config: s,
		transport: S,
		origin: b,
		stType: c,
		meta: v,
		flags: y,
		storylines: p
	}, kh(o, s, b)), te = {
		trigger: Dh(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Xh(o),
		echoes: Zh(o, s, ee, kh(o, s, "story")),
		recap: km(Infinity, Cv(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: Jh(o, s),
		speech: Yh(o, s, ee),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => pm(p, m[e]) } : {}
	}, C = (e, t) => p?.grouped && m[e] !== void 0 ? lm(m[e]) + t : t, ne, re, ie = -1, ae = [];
	if (s.cache?.enabled) {
		let e = Qg(Zg(), p?.current), n = Bg(t, te, $g(e)?.modes, (e) => Fg(t[e], f[e] ?? e));
		if (re = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: C(n, t === void 0 ? e.mes : e.mes + Rg(t))
		})), ie = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, ie >= 0) {
			let e = n.out[ie], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			ae = t ? [
				t.given,
				t.sticky,
				t.fresh
			].filter((e) => typeof e == "string") : [e.item.mes];
		}
		ne = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else {
		let e = Kh(t, te);
		re = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: C(t, e.mes)
		} : e), ie = u >= 0 ? e.findIndex((e) => e.index === u) : -1, ie >= 0 && (ae = [e[ie].item.mes]);
	}
	let oe;
	o.inputShaping && ie >= 0 && ae.some((e) => e.trim()) && (re[ie] = {
		...re[ie],
		mes: o_(re[ie].mes)
	}, oe = { texts: ae }), t.splice(0, t.length, ...re);
	let w = {
		id: jh(),
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
		sticky: ne,
		input: oe,
		storylines: p,
		createdAt: Date.now(),
		warnings: []
	};
	Zv({
		line: p?.current,
		frozen: !!p?.vars.frozen,
		from: w.inputIndex >= 0 ? w.inputIndex : d.length - 1
	}), Fh.setPending(w);
}
//#endregion
//#region src/core/transports/text.ts
function ny(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = P_(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => jl(e, {
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
			content: ul(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), L_({
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
			let n = z_(t, e.caller);
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
var ry = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, iy = 32, ay = 10, oy = 9, sy = 13, cy = 160, ly = 6158, uy = 8192, dy = 8203, fy = 8239, py = 8287, my = 12288, hy = 65279;
function gy(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function _y(e) {
	return e >= "0" && e <= "9";
}
function vy(e) {
	return e >= " ";
}
function yy(e) {
	return ",:[]/{}()\n+".includes(e);
}
function by(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function xy(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Sy = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Cy = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function wy(e) {
	return ",[]/{}\n+".includes(e);
}
function Ty(e) {
	return jy(e) || Ey.test(e);
}
var Ey = /^[[{\w-]$/;
function Dy(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function Oy(e, t) {
	let n = e.charCodeAt(t);
	return n === iy || n === ay || n === oy || n === sy;
}
function ky(e, t) {
	let n = e.charCodeAt(t);
	return n === iy || n === oy || n === sy;
}
function Ay(e, t) {
	let n = e.charCodeAt(t);
	return n === cy || n === ly || n >= uy && n <= dy || n === fy || n === py || n === my || n === hy;
}
function jy(e) {
	return My(e) || Py(e);
}
function My(e) {
	return e === "\"" || e === "“" || e === "”";
}
function Ny(e) {
	return e === "\"";
}
function Py(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function Fy(e) {
	return e === "'";
}
function Iy(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function Ly(e, t) {
	let n = e.length;
	if (!Oy(e, n - 1)) return e + t;
	for (; Oy(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function Ry(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function zy(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var By = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function Vy(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = By[n];
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
function Hy(e) {
	return e !== null && e.char === "\"";
}
function Uy(e) {
	return e !== null && e.char === "'";
}
function Wy(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function Gy(e, t) {
	switch (t) {
		case ")": return Wy(e, "(") > Wy(e, ")");
		case "]": return Wy(e, "[") > Wy(e, "]");
		case "}": return Wy(e, "{") > Wy(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Ky = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, qy = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Jy(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || ae(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), Ty(e[t]) && zy(n) ? (r || (n = Ly(n, ",")), g()) : r && (n = Iy(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	ie();
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
		let i = r ? Oy : ky, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (Ay(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Yy(e, t);) t++;
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
			if (by(e[t])) for (; t < e.length && xy(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = Ly(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = Iy(n, ",")) : oe();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (Ty(e[t]) || c ? n = Ly(n, ":") : w()), i() || (s || c ? n += "null" : w()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = Ly(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = Ly(n, ",")), p(), !i()) {
					r || (n = Iy(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = Ly(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = Ly(n, ",")), t = i();
		t || (n = Iy(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, jy(e[t]) || ie());
		let s = e[t] === "&" ? Vy(e.slice(t, t + 12)) : null, c = Hy(s) || Uy(s);
		if (jy(e[t]) || c) {
			let l = Ny(e[t]) ? Ny : Fy(e[t]) ? Fy : Py(e[t]) ? Py : My, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = te(t - 1);
					return !r && yy(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = Ly(p, "\""), n += p, !0);
				}
				if (t === i) return p = Ly(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? Vy(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || yy(e[t]) && !Gy(p, e[t]) || jy(e[t]) && !C(t) || _y(e[t])) return v(), !0;
					e[t] === "\\" && ie();
					let s = te(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (yy(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && wy(e[t])) {
					if (e[t - 1] === ":" && Sy.test(e.substring(u + 1, t + 2))) for (; t < e.length && Cy.test(e[t]);) p += e[t], t++;
					return p = Ly(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : Dy(e) ? p += Ky[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (qy[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && gy(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : se();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : Dy(n) ? (p += Ky[n], t++) : (vy(n) || re(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = Iy(n, "\"", !0);
			let e = n.length;
			n = _() ? Ry(n, e, 1) : Ly(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !_y(e[t]) && ne() && (i += "0")), e[t] === "0" && _y(e[t + 1]) && (a = !0); _y(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, _y(e[t]) || (i += "0"); _y(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), _y(e[t]) || (i += "0"); _y(e[t]);) i += e[t], t++;
			return ne() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !xy(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (by(e[t])) {
			for (; t < e.length && xy(e[t]);) t++;
			let n = t;
			for (; Oy(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !wy(e[t]) && !jy(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Sy.test(e.substring(a, t + 2))) for (; t < e.length && Cy.test(e[t]);) t++;
		if (t > a) {
			for (; Oy(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && Oy(e, n);) n--;
		return n;
	}
	function C(t) {
		let n = t + 1;
		for (; n < e.length && Oy(e, n);) n++;
		return n >= e.length || yy(e[n]);
	}
	function ne() {
		return t >= e.length || yy(e[t]) || Oy(e, t);
	}
	function re(e) {
		throw new ry(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ie() {
		throw new ry(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function ae() {
		throw new ry("Unexpected end of json string", e.length);
	}
	function oe() {
		throw new ry("Object key expected", t);
	}
	function w() {
		throw new ry("Colon expected", t);
	}
	function se() {
		throw new ry(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Yy(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Xy(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Zy(e, t) {
	let n = Xy(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Jy(n));
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
function Qy(e, t, n, r, i = !0) {
	let a = Dl(e.stages), o = e.stages.find((e) => e.kind === "text"), s = i ? n?.[t.envelopeKeys.thinking] : void 0;
	o && typeof s == "string" && (a.stages[o.id] = {
		text: s,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && a.stages[t.id].status !== "done" && (a.stages[t.id].status = t.optional ? "pending" : "missing");
	return a.current = r ? null : o?.id ?? null, a;
}
function $y(e) {
	let { ctx: t, caller: n } = e, r = M_(t), i = r.schema(), a = N_(t), o = n.schema ? a ? r.envelope(n.schema.value) : n.schema.value : i.value, s = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, c = null, l = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", u = (e, i) => {
		let o = Zy(l(e), i);
		return c = o.value, n.schema ? Qy(t, r, o.value, i, a) : Ml(o.value, {
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
		body: () => L_(e, { json_schema: d }),
		progress: (e, t) => (s = e, u(e, t)),
		complete: () => ({ done: !0 }),
		result: () => u(s, !0),
		rawText: () => s.text,
		callerResult: () => a ? c?.[r.envelopeKeys.result] : c ?? void 0
	};
}
//#endregion
//#region src/core/transports/tools.ts
var eb = (e, t) => x_({
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
function tb(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function nb(e) {
	let { ctx: t, caller: n } = e, r = M_(t), i = N_(t), a = r.submitTool(n.schema ? i ? r.envelope(n.schema.value) : n.schema.value : void 0), o = a.function.name, s = I_(e, "single", o), c = [
		...s ? [s.tool] : [],
		a,
		...n.tools
	], l = [...e.messages, ...s?.messages ?? []], u = t.config.connection.forceTool && !n.tools.length, d = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, f = null, p = (e, a) => {
		let s = Zy((e.toolCalls.find((e) => e.name === o) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", a);
		return f = s.value, n.schema ? Qy(t, r, s.value, a, i) : Ml(s.value, {
			stages: t.stages,
			structures: t.structures,
			final: a,
			openKey: s.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => L_(e, {
			messages: l,
			tools: c,
			tool_choice: u ? {
				type: "function",
				function: { name: o }
			} : "auto"
		}),
		progress: (e, t) => (d = e, p(e, t)),
		complete: (e) => {
			let t = z_(e, n);
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
function rb(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = M_(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = I_(e, o ? "parallel" : "multi", l), d = [
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
		let i = Zy(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? Qy(t, s, e, a) : Ml(e, {
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
			return L_({
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
			let i = tb(e.toolCalls.filter((e) => e.name), r), o = z_(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(eb(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = F_(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: F_(t, a.tools.results.nudge, {
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
function ib(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return ny(e);
		case "structured": return $y(e);
		case "tool-single": return nb(e);
		case "tool-multi": return rb(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function ab(e, t) {
	let n = t ? f({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? g(n) : m(n);
}
var ob = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function sb(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, ob({
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
			})), a = () => n === null ? "" : (n = null, ob({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + ob({
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
				text: (e) => e ? o("text") + ob({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + ob({
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
					for (let i of e) t++, r = !0, n += ob({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + ob({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + ob({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => ob({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + ob({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + ob({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? ob({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? ob({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? ob({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: lb(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => ob({ error: { message: e } }),
			end: (e) => e ? ob({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? ob({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => ob({
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
			error: (e) => ob({ error: { message: e } }),
			end: (e) => ob({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? ob({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? ob({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? ob({ choices: [{
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
					...cb(e)
				}
			}] }) : "",
			error: (e) => ob({ error: { message: e } }),
			end: (e) => (e ? ob({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + ob("[DONE]")
		};
	}
}
function cb(e) {
	let t = e.filter((e) => e.signature).map((e, t) => ({
		type: "reasoning.encrypted",
		data: e.signature,
		id: e.id,
		format: "google-gemini-v1",
		index: t
	}));
	return t.length ? { reasoning_details: t } : {};
}
function lb(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function ub(e, t) {
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
				...cb(t.toolCalls)
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
			input: lb(e.arguments)
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
					args: lb(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function db(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function fb(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function pb(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var mb = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = fb(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = pb(t);
			if (r) {
				let t = this.open.has(e) ? hb(this.value, n) : void 0;
				gb(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function hb(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function gb(e, t, n) {
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
var _b = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function vb(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return _b(t) ? t : void 0;
}
function yb(e, t) {
	if (!_b(t)) return _b(e) ? e : void 0;
	if (!_b(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = _b(r) && _b(n[e]) ? yb(n[e], r) : r);
	return n;
}
function bb(e, t) {
	if (!_b(t)) return _b(e) ? e : void 0;
	if (!_b(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : _b(r) && _b(t) ? n[e] = bb(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var xb = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Sb(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Cb = class {
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
				let i = wb(n);
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
				args: new mb()
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
			let i = typeof e.signature == "string" && e.signature ? e.signature : wb(e);
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
function wb(e) {
	let t = e?.extra_content?.google?.thought_signature ?? e?.function?.extra_content?.google?.thought_signature;
	return typeof t == "string" && t ? t : void 0;
}
function Tb(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function Eb(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* Db(e, t) {
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
async function* Ob(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Sb(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new xb(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Cb();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Sb(t);
		if (n) throw new xb(n);
		i.text = Tb(t), i.reasoning = Eb(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = vb(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of Db(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Sb(e);
		if (r) throw new xb(r);
		i.text += p(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = vb(e);
		c && (i.usage = yb(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var kb = /* @__PURE__ */ fn({ current: null });
function Ab(e, t) {
	return kb.current = {
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
	}, kb.current;
}
function jb(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
function Mb(t, n) {
	t.mesId = n, t.swipeId = e().chat[n]?.swipe_id ?? 0;
}
function Nb(t, n = e().chat[t]) {
	let r = kb.current;
	return !r || r.mesId !== t || r.swipeId !== null && (n?.swipe_id ?? 0) !== r.swipeId ? null : r;
}
//#endregion
//#region src/core/orchestrator.ts
function Pb(e) {
	let t = e.structures.find((e) => e.kind === "speech");
	if (t) return e.speechCleaner ??= _v(e.preset).cleaner ?? null, {
		tag: t.tag,
		...e.speechCleaner ? { cleaner: e.speechCleaner } : {}
	};
}
var Fb = "/api/backends/chat-completions/generate", Ib = { pending: null }, Lb = (e) => e?.name === "AbortError";
function Rb(e) {
	if (e.transport !== "tool-single" && e.transport !== "tool-multi") return null;
	let t = c(e.config.connection.assumeToolSupport);
	if (!t) return null;
	switch (t.reason) {
		case "postProcessing": return J("error.toolsUnsupported.postProcessing", { value: t.label });
		case "model": return J("error.toolsUnsupported.model", { target: t.model ? `${t.source} / ${t.model}` : t.source });
		default: return J(`error.toolsUnsupported.${t.reason}`);
	}
}
async function zb(e, t, n) {
	let r = ab(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = Rb(e);
	if (a) return x("error", a, "Advanced Preset"), db(a, 400);
	let o = e.origin === "task" ? A_(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = Ab(e, i);
	if (!i) {
		let i;
		try {
			i = await Hb(e, t, s, c, n ?? void 0, () => void 0);
		} catch (e) {
			return Vb(c, e);
		}
		if (n?.aborted) throw Ib.pending?.ctx === e && (Ib.pending = null), n.reason;
		return new Response(JSON.stringify(ub(r, i)), { headers: { "Content-Type": "application/json" } });
	}
	let l = sb(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await Hb(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			Lb(e) || (await p(l.error(Bb(e))), Vb(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var Bb = (e) => e instanceof Error ? e.message : String(e);
function Vb(e, t) {
	return e.status = Lb(t) ? "aborted" : "error", e.error = Bb(t), t instanceof xb ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : db(Bb(t));
}
async function Hb(t, n, r, i, a, o) {
	let s = ab(String(n.chat_completion_source ?? ""), n), c = ib({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: s
	}), l = fl(t.stages), u = l >= 0 ? t.stages[l].id : null, d = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !d && u !== null, m = t.structures.some((e) => e.kind === "annotations"), h = Pb(t), g = m ? (e) => sc(e, { final: !1 }).text : (e) => e, _ = h ? (e) => Pc(g(e), {
		...h,
		final: !1
	}).text : g, v = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, y = Date.now(), b = "", ee, te = 0, C = !1, ne, re;
	for (let n = 0; n < v; n++) {
		i.step = n;
		let r = c.body(n), l = Ng({
			genId: t.id,
			step: n,
			at: Date.now(),
			request: r
		});
		te++;
		let d = {
			text: "",
			reasoning: "",
			toolCalls: []
		};
		try {
			let n = await S(Fb, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), s = 0;
			for await (let e of Ob(n, f(r), !!r.stream, a)) {
				d = e;
				let t = Date.now();
				if (t - s < 50) continue;
				s = t;
				let n = c.progress(e, !1);
				if (jb(i, n, b + e.reasoning), p && u) {
					let e = n.stages[u]?.text ?? "";
					e && o(_(e.slice(0, e.length - Zs(e))).trimEnd());
				}
			}
			J_(t), l.response = d.text || JSON.stringify(d.toolCalls), l.durationMs = Date.now() - l.at, l.usage = d.usage;
		} catch (e) {
			if (l.error = Bb(e), Lb(e) || a?.aborted) {
				(d.text || d.reasoning || d.toolCalls.length) && J_(t), ee = bb(ee, d.usage), C = !0, re = c.progress(d, !1);
				break;
			}
			if (!d.text && !d.toolCalls.length && T_(e) && w_(t, s)) {
				t.signatureFallback = !0, t.warnings.push("thought signature rejected: retried without the built-in signature"), x("warning", J("error.signatureFallback"), J("app.name")), n--;
				continue;
			}
			throw e;
		}
		b += d.reasoning, ee = bb(ee, d.usage), c.progress(d, !0);
		let m = c.complete(d, n);
		if (m.callerToolCalls) {
			ne = m.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (m.done) break;
	}
	let ie = re ?? c.result();
	if (C) for (let e of Object.values(ie.stages)) e.status === "streaming" && (e.status = "interrupted");
	jb(i, ie, b);
	let ae = Ub(t, ie, c.rawText(), c.callerResult?.(), b, {
		usage: ee,
		requests: te,
		durationMs: Date.now() - y,
		interrupted: C
	});
	return ae.toolCalls = ne, ae.usage = ee, ne && (ae.content = ""), i.status = C ? "aborted" : "done", ae;
}
function Ub(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Il(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Qs(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = sc(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = sc(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v, y, b = Pb(t);
	if (b) {
		if (u) {
			let e = zc(u, g, b);
			l.push(...e.warnings), u = e.text, v = e.spans, g = e.anchors;
		}
		if (d !== void 0 && f !== void 0) {
			let e = zc(d, _?.draft, b);
			d = e.text, f = u, y = {
				draft: e.spans,
				patched: v ?? []
			}, _ &&= {
				draft: e.anchors ?? [],
				patched: g ?? []
			};
		}
	}
	let x = (e) => Object.values(s.structures).find((t) => t.kind === e), S = x("reply"), ee = S ? n.structures[S.id] : void 0, te = x("impersonate"), C = x("recap"), ne = x("memory"), re = t.meta.mixed ? "meta-mixed" : "story", ie = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? ie = i === void 0 ? u || Qs(r).trim() : JSON.stringify(i) : u || (re = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", ie = ee ? el(ee) : "", !ie && te && typeof n.structures[te.id] == "string" && (ie = "…"), !ie && C && n.structures[C.id] && (ie = "…"))), !ie && !o.interrupted) throw Error(J("error.emptyTurn"));
	let ae = [], oe = [], w = t.interceptorRan && t.stType !== "quiet";
	if (w && ne && Array.isArray(n.structures[ne.id])) {
		let e = Rm(n.structures[ne.id]);
		ae.push(...e.events), oe = e.global;
	}
	if (w && C && typeof n.structures[C.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ae.push({
			type: "recap.set",
			text: n.structures[C.id],
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
		turn: re,
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
		events: ae,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, T = {
		content: ie,
		reasoning: a,
		sidecar: ce,
		...oe.length ? { global: oe } : {}
	};
	return w ? Ib.pending = {
		ctx: t,
		outcome: T,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ce
	}), kb.current?.genId === t.id && (kb.current.structures = n.structures), T;
}
//#endregion
//#region src/app/updater.ts
var Wb = "advancedPreset.reloadedFor";
async function Gb() {
	try {
		let e = await S(`${d()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Kb(e) {
	sessionStorage.setItem(Wb, e), x("info", J("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function qb() {
	let e = await Gb();
	e && e !== "da4a0bbe1d82621b" && sessionStorage.getItem(Wb) !== e && Kb(e);
}
async function Jb() {
	await qb();
}
var Yb = "/api/extensions/switch", Xb = (e) => e.replace(/^third-party/, "").replace(/^\/+|\/+$/g, "");
function Zb(e, t, n) {
	if (!n.ok || typeof t.body != "string") return;
	let r;
	try {
		if (new URL(e, location.href).pathname !== Yb) return;
		r = JSON.parse(t.body).extensionName;
	} catch {
		return;
	}
	typeof r == "string" && Xb(r) === Xb(u()) && qb();
}
async function Qb() {
	let e = u().replace(/^third-party\//, ""), t = await nx(e, !1);
	if (t.status === 404 && (t = await nx(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Gb();
	return r && r !== "da4a0bbe1d82621b" ? (Kb(r), {
		upToDate: !1,
		reloading: !0
	}) : {
		upToDate: !!n.isUpToDate,
		reloading: !1
	};
}
async function $b() {
	let e = await Qb();
	return e.reloading || !e.upToDate ? "updated" : "current";
}
var ex = "advancedPreset.selfUpdateFor";
async function tx(e, t) {
	let n = `1.12.0>${e}`;
	if (sessionStorage.getItem(ex) === n) return !1;
	sessionStorage.setItem(ex, n), x("info", J("update.forPreset", {
		name: t,
		version: e
	}));
	try {
		return (await Qb()).reloading;
	} catch (e) {
		return console.warn("[AP] self-update failed", e), !1;
	}
}
var nx = (t, n) => S("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), rx = "__ap_gen_id";
function ix(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function ax() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	ee(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(ix(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[rx], r = typeof t == "string" ? Fh.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[rx], r.claimed = !0;
				try {
					return n.signal?.throwIfAborted(), await zb(r, e, n.signal);
				} finally {
					Fh.release(t);
				}
			}
			e && (delete e[rx], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		let r = await e.call(globalThis, t, n);
		return n?.method === "POST" && Zb(ix(t), n, r), r;
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function ox(e) {
	let t = Fh.takeArmed();
	t && (e[rx] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function sx(e) {
	let t = await uv(e);
	if (t === "invalid") return x("warning", J("storylines.invalidName"), J("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && x("warning", J("storylines.nameTaken", { name: n }), J("app.name")), t === "invalid" && x("warning", J("storylines.invalidName"), J("app.name"));
		let r = await b(`<h3>${v(J("storylines.switchTitle", { name: e }))}</h3><p>${v(J("storylines.askOldMain"))}</p>`, n, J("storylines.switch"), J("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = $u(n) ? await uv(e, n) : "invalid";
	}
	return t === "switched" && x("success", J("storylines.switched", { name: e }), J("app.name")), !0;
}
async function cx(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) {
		rv(t, n.current), i.hide && (cv(n.current, { hide: !0 }), await e().saveMetadata());
		return;
	}
	let a = r && typeof r == "object" ? r : {}, o = ev(), s = (e, t) => {
		let n = ad(id(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(Z_().main ?? "");
		let e = s(a.name, J("storylines.fallback.side"));
		return e !== Z_().main && !await av(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), rv(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, J(i.ifLine ? "storylines.fallback.if" : "storylines.fallback.side"));
		cv(n, {
			ifLine: !!i.ifLine,
			hide: i.hide
		}), rv(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, J("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, J("storylines.fallback.main")) : void 0), u = await uv(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), x("warning", J("storylines.switchFailed", { name: c }), J("app.name")), rv(t, c);
	i.naming && n.input >= 0 && lv(n.input), rv(t, ""), u === "switched" && x("success", J("storylines.switched", { name: c }), J("app.name"));
}
function lx(e, t) {
	if (!G().enabled) return e;
	let n = dh(), r = n ? Mp(n) : void 0;
	if (!r || !X_(r, Wm(r)) || ed(e)) return e;
	let i = $_(), a = i[t ?? i.length - 1];
	return !a || Yp(a) ? e : nd(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var ux = "\0";
function dx(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = Cm(e);
		r && t.add(`${n.presetId}${ux}${r}`);
	}
}
function fx(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && dx(r.extra?.[hm], t), r.swipe_info?.forEach((e, t) => {
			t !== i && dx(e?.extra?.[hm], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var px = null;
function mx(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = fx(n.chat ?? []), o = new Set(a);
	if (px && !t.reload && px.chatId === r) for (let e of px.active) i.has(e) || o.add(e);
	px = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(ux), i = s.get(n);
		i || s.set(n, i = {
			on: [],
			off: []
		}), (t ? i.on : i.off).push(r);
	};
	for (let e of o) c(e, !1);
	for (let e of i) c(e, !0);
	let l = !1, u = G().presets;
	for (let [e, t] of s) {
		let n = u[e];
		n?.globalMemory && (Sm(n.globalMemory.log) && (l = !0), Bm(n, t.off, !1) && (l = !0), Bm(n, t.on, !0) && (l = !0));
	}
	return l && K(), l;
}
function hx(e) {
	ym(e), mx();
}
function gx() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => hx(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => mx());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => mx({ reload: !0 }));
}
//#endregion
//#region src/store/media.ts
var _x = {
	openai: {
		baseUrl: "https://api.openai.com/v1",
		model: "gpt-image-2.6-flare",
		nsfwBlock: !0,
		promptType: hc("openai")
	},
	gemini: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-nano-banana-2.1",
		nsfwBlock: !0,
		promptType: hc("gemini")
	},
	novelai: {
		baseUrl: "https://image.novelai.net",
		model: "nai-diffusion-4-5-full",
		nsfwBlock: !1,
		promptType: hc("novelai")
	},
	openrouter: {
		baseUrl: "https://openrouter.ai/api/v1",
		model: "google/gemini-nano-banana-2.1",
		nsfwBlock: !0,
		promptType: hc("openrouter")
	}
}, vx = (e) => e !== "novelai", yx = () => ({
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
function bx() {
	let e = G(), t = yx();
	(!e.media || typeof e.media != "object") && (e.media = t);
	let n = e.media;
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		if (!t || typeof t != "object" || Array.isArray(t)) n[e] = r;
		else for (let [e, n] of Object.entries(r)) e in t || (t[e] = n);
	}
	for (let t of e.media.image.connections) t.promptType ||= hc(t.api);
	return e.media;
}
var xx = K, Sx = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
function Cx(e, t) {
	let n = _x[e];
	return {
		id: Sx(),
		name: t,
		api: e,
		baseUrl: n.baseUrl,
		apiKey: "",
		model: n.model,
		headers: {},
		body: "",
		promptType: n.promptType,
		style: "",
		negative: "",
		nsfwBlock: n.nsfwBlock,
		refs: []
	};
}
function wx(e, t) {
	if (e.api === t) return;
	let n = _x[e.api], r = _x[t];
	(!e.baseUrl || e.baseUrl === n.baseUrl) && (e.baseUrl = r.baseUrl), (!e.model || e.model === n.model) && (e.model = r.model), e.nsfwBlock === n.nsfwBlock && (e.nsfwBlock = r.nsfwBlock), e.promptType === n.promptType && (e.promptType = r.promptType), e.api = t;
}
function Tx(e) {
	return e.connections.find((t) => t.id === e.active) ?? e.connections[0];
}
function Ex(e, t) {
	return {
		...JSON.parse(JSON.stringify(e)),
		id: Sx(),
		name: t
	};
}
//#endregion
//#region src/store/media-db.ts
var Dx = "advanced-preset-media", Ox = "blobs", kx = null;
function Ax() {
	return kx || (kx = new Promise((e, t) => {
		let n = indexedDB.open(Dx, 1);
		n.onupgradeneeded = () => {
			n.result.objectStoreNames.contains(Ox) || n.result.createObjectStore(Ox);
		}, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
	}), kx.catch(() => {
		kx = null;
	}), kx);
}
function jx(e, t) {
	return Ax().then((n) => new Promise((r, i) => {
		let a = n.transaction(Ox, e), o = t(a.objectStore(Ox));
		a.oncomplete = () => r(o ? o.result : void 0), a.onerror = () => i(a.error), a.onabort = () => i(a.error);
	}));
}
async function Mx(e, t = {}) {
	let n = t.key ?? `${t.prefix ?? ""}${Sx()}`;
	return await jx("readwrite", (t) => t.put({
		blob: e,
		at: Date.now()
	}, n)), n;
}
async function Nx(e) {
	return (await jx("readonly", (t) => t.get(e)))?.blob;
}
async function Px(e) {
	return !!await jx("readonly", (t) => t.count(e));
}
async function Fx(e) {
	Bx(e), await jx("readwrite", (t) => t.delete(e));
}
async function Ix(e = "") {
	let t = e ? IDBKeyRange.bound(e, `${e}\uffff`) : void 0;
	return (await jx("readonly", (e) => e.getAllKeys(t)) ?? []).map(String);
}
async function Lx(e, t, n = 0) {
	let r = Date.now() - n, i = 0;
	for (let a of await Ix(e)) if (!t.has(a)) {
		if (n) {
			let e = await jx("readonly", (e) => e.get(a));
			if (e && e.at > r) continue;
		}
		await Fx(a), i++;
	}
	return i;
}
var Rx = /* @__PURE__ */ new Map();
async function zx(e) {
	let t = Rx.get(e);
	if (t) return t;
	let n = await Nx(e);
	if (!n) return;
	let r = URL.createObjectURL(n);
	return Rx.set(e, r), r;
}
function Bx(e) {
	let t = Rx.get(e);
	t && (URL.revokeObjectURL(t), Rx.delete(e));
}
async function Vx(e) {
	let t = new Uint8Array(await e.arrayBuffer()), n = "";
	for (let e = 0; e < t.length; e += 32768) n += String.fromCharCode(...t.subarray(e, e + 32768));
	return btoa(n);
}
function Hx(e, t) {
	let n = atob(e), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return new Blob([r], { type: t });
}
//#endregion
//#region src/media/net.ts
var Ux = class extends Error {
	issue;
	constructor(e, t = `CORS proxy: ${e}`) {
		super(t), this.issue = e, this.name = "ProxyError";
	}
}, Wx = class extends Error {
	status;
	body;
	constructor(e, t, n = "") {
		super(t), this.status = e, this.body = n, this.name = "MediaHttpError";
	}
}, Gx = /* @__PURE__ */ new Set(), Kx = (e) => {
	try {
		return new URL(e).origin;
	} catch {
		return e;
	}
};
function qx(e, t) {
	if (t.proxy === "custom") {
		let n = t.customUrl.trim();
		if (!n) throw new Ux("noCustomUrl");
		return n.includes("{url}") ? n.replace("{url}", encodeURIComponent(e)) : n + e;
	}
	return `/proxy/${encodeURIComponent(e)}`;
}
function Jx(e = bx().cors) {
	return { multipart: e.proxy === "custom" || t() };
}
var Yx = (e) => e == null || typeof e == "string";
async function Xx(n, r, i) {
	let a = qx(n, i);
	if (i.proxy === "custom") return S(a, r);
	let o = t();
	if (!Jx(i).multipart && !Yx(r.body)) throw new Ux("body");
	let s = new Headers(r.headers), c = e().getRequestHeaders?.()["X-CSRF-Token"];
	c && !s.has("X-CSRF-Token") && s.set("X-CSRF-Token", c);
	let l = await S(a, {
		...r,
		headers: s
	});
	if (l.status === 404) {
		let e = l.headers.get("content-type") ?? "", t = e.includes("json") ? "" : await l.clone().text().catch(() => "");
		if (/CORS proxy is disabled/i.test(t)) throw new Ux("disabled");
		if (o && (e.includes("html") || !t)) throw new Ux("unsupported");
	}
	return l;
}
var Zx = (e) => e instanceof DOMException && e.name === "AbortError";
async function Qx(e, t = {}, n = bx().cors) {
	if (n.mode === "on") return Xx(e, t, n);
	if (n.mode === "off") return S(e, t);
	let r = Kx(e);
	if (Gx.has(r)) return Xx(e, t, n);
	try {
		return await S(e, t);
	} catch (i) {
		if (Zx(i) || !(i instanceof TypeError)) throw i;
		Gx.add(r);
		try {
			return await Xx(e, t, n);
		} catch (e) {
			throw e instanceof Ux && Gx.delete(r), e;
		}
	}
}
function $x(e, t) {
	let n = "";
	try {
		let e = JSON.parse(t), r = e?.error ?? e;
		n = typeof r == "string" ? r : String(r?.message ?? e?.message ?? e?.detail?.message ?? e?.detail ?? "");
	} catch {
		n = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
	}
	return n ? `HTTP ${e}: ${n}` : `HTTP ${e}`;
}
async function eS(e) {
	if (e.ok) return e;
	let t = await e.text().catch(() => "");
	throw new Wx(e.status, $x(e.status, t), t);
}
//#endregion
//#region src/media/request.ts
var tS = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function nS(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r === null ? delete n[e] : n[e] = tS(r) && tS(n[e]) ? nS(n[e], r) : r;
	return n;
}
var rS = class extends Error {
	constructor(e) {
		super(e), this.name = "BodyOverrideError";
	}
};
function iS(e) {
	let t = e.body.trim();
	if (!t) return {};
	let n;
	try {
		n = JSON.parse(t);
	} catch (e) {
		throw new rS(e instanceof Error ? e.message : String(e));
	}
	if (!tS(n)) throw new rS("Not a JSON object");
	return n;
}
function aS(e) {
	try {
		return iS({ body: e }), "";
	} catch (e) {
		return e instanceof Error ? e.message : String(e);
	}
}
function oS(e, t) {
	let n = new Headers(e);
	for (let [e, r] of Object.entries(t.headers ?? {})) e.trim() && (r === "" ? n.delete(e) : n.set(e, r));
	return n;
}
var sS = (e, t) => `${e.replace(/\/+$/, "")}/${t.replace(/^\/+/, "")}`, cS = (e, t) => e.getUint16(t, !0), lS = (e, t) => e.getUint32(t, !0);
async function uS(e) {
	let t = new Blob([e]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
async function dS(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = -1;
	for (let r = e.length - 22; r >= Math.max(0, e.length - 22 - 65535); r--) if (lS(t, r) === 101010256) {
		n = r;
		break;
	}
	if (n < 0) throw Error("Not a ZIP archive");
	let r = cS(t, n + 10), i = lS(t, n + 16), a = [], o = new TextDecoder();
	for (let n = 0; n < r; n++) {
		if (lS(t, i) !== 33639248) throw Error("Broken ZIP directory");
		let n = cS(t, i + 10), r = lS(t, i + 20), s = cS(t, i + 28), c = cS(t, i + 30), l = cS(t, i + 32), u = lS(t, i + 42), d = o.decode(e.subarray(i + 46, i + 46 + s));
		if (i += 46 + s + c + l, d.endsWith("/")) continue;
		let f = u + 30 + cS(t, u + 26) + cS(t, u + 28), p = e.subarray(f, f + r);
		if (n === 0) a.push({
			name: d,
			data: p
		});
		else if (n === 8) a.push({
			name: d,
			data: await uS(p)
		});
		else throw Error(`Unsupported ZIP compression ${n}`);
	}
	return a;
}
function fS(e) {
	if (e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71) return "image/png";
	if (e[0] === 255 && e[1] === 216 && e[2] === 255) return "image/jpeg";
	if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 87 && e[9] === 69 && e[10] === 66 && e[11] === 80) return "image/webp";
	if (e[0] === 71 && e[1] === 73 && e[2] === 70) return "image/gif";
	let t = new TextDecoder().decode(e.subarray(0, 256)).trimStart();
	if (t.startsWith("<svg") || t.startsWith("<?xml") && t.includes("<svg")) return "image/svg+xml";
}
//#endregion
//#region src/media/image/providers.ts
function pS(e, t) {
	let n = t.trim(), r = e.style.trim();
	return r ? e.promptType === "tags" ? `${n.replace(/[,\s]+$/, "")}, ${r.replace(/^[,\s]+/, "")}` : `${n}\n\n${r}` : n;
}
var mS = {
	"1:1": "1024x1024",
	"3:4": "1024x1536",
	"9:16": "1024x1536",
	"4:3": "1536x1024",
	"16:9": "1536x1024"
}, hS = {
	"1:1": [1024, 1024],
	"3:4": [832, 1216],
	"9:16": [832, 1216],
	"4:3": [1216, 832],
	"16:9": [1216, 832]
}, gS = async (e) => `data:${e.type || "image/png"};base64,${await Vx(e)}`, _S = (e) => e.baseUrl.trim() || _x[e.api].baseUrl, vS = (e) => e.model.trim() || _x[e.api].model, yS = (e, t) => ({
	method: "POST",
	headers: e,
	body: JSON.stringify(t)
});
async function bS(e, t) {
	let n = pS(e, t.prompt), r = {
		model: vS(e),
		prompt: n,
		n: 1,
		size: t.ratio ? mS[t.ratio] : "auto"
	};
	t.refs.length && (r.images = await Promise.all(t.refs.map(async (e) => ({ image_url: await gS(e.blob) }))));
	let i = oS({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e);
	return {
		url: sS(_S(e), t.refs.length ? "images/edits" : "images/generations"),
		init: yS(i, nS(r, iS(e)))
	};
}
var xS = (e) => e.description ? `Reference image ${e.id}: ${e.description}` : `Reference image ${e.id}`;
async function SS(e, t) {
	let n = pS(e, t.prompt), r = await Promise.all(t.refs.map(async (e) => ({
		ref: e,
		mime: e.blob.type || "image/png",
		data: await Vx(e.blob)
	}))), i = e.apiKey ? { "x-goog-api-key": e.apiKey } : {};
	if (e.endpoint === "generateContent") {
		let a = [];
		for (let e of r) a.push({ text: xS(e.ref) }, { inline_data: {
			mime_type: e.mime,
			data: e.data
		} });
		a.push({ text: n });
		let o = { responseModalities: ["IMAGE"] };
		t.ratio && (o.imageConfig = { aspectRatio: t.ratio });
		let s = oS({
			"Content-Type": "application/json",
			...i
		}, e), c = nS({
			contents: [{
				role: "user",
				parts: a
			}],
			generationConfig: o
		}, iS(e));
		return {
			url: sS(_S(e), `models/${encodeURIComponent(vS(e))}:generateContent`),
			init: yS(s, c)
		};
	}
	let a = [];
	for (let e of r) a.push({
		type: "text",
		text: xS(e.ref)
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
	let s = oS({
		"Content-Type": "application/json",
		"Api-Revision": "2026-05-20",
		...i
	}, e), c = nS({
		model: vS(e),
		input: a,
		response_format: o
	}, iS(e));
	return {
		url: sS(_S(e), "interactions"),
		init: yS(s, c)
	};
}
async function CS(e, t) {
	let n = pS(e, t.prompt), r = t.refs.length ? `${t.refs.map((e, t) => `Reference image ${t + 1} (${e.id})${e.description ? `: ${e.description}` : ""}`).join("\n")}\n\n${n}` : n, i = {
		model: vS(e),
		prompt: r,
		n: 1,
		aspect_ratio: t.ratio ?? "auto"
	};
	t.refs.length && (i.input_references = await Promise.all(t.refs.map(async (e) => ({
		type: "image_url",
		image_url: { url: await gS(e.blob) }
	}))));
	let a = oS({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e);
	return {
		url: sS(_S(e), "images"),
		init: yS(a, nS(i, iS(e)))
	};
}
function wS(e, t) {
	let n = pS(e, t.prompt), r = (e.negative ?? "").trim(), [i, a] = hS[t.ratio ?? "3:4"], o = {
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
	}, s = oS({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e), c = nS({
		input: n,
		model: vS(e),
		action: "generate",
		parameters: o
	}, iS(e));
	return {
		url: sS(_S(e), "ai/generate-image"),
		init: yS(s, c)
	};
}
async function TS(e, t) {
	switch (e.api) {
		case "openai": return bS(e, t);
		case "gemini": return SS(e, t);
		case "novelai": return wS(e, {
			...t,
			refs: []
		});
		case "openrouter": return CS(e, t);
	}
}
function ES(e) {
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
function DS(e) {
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
var OS = (e, t = "image/png") => new Blob([e], { type: fS(e) ?? t });
async function kS(e, t, n) {
	if (e.api === "novelai") {
		let e = new Uint8Array(await t.arrayBuffer());
		return fS(e) ? [OS(e)] : (await dS(e)).filter((e) => fS(e.data)).map((e) => OS(e.data));
	}
	let r = await t.json();
	if (e.api === "gemini") {
		let e = ES(r).map((e) => Hx(e.data, e.mime));
		if (!e.length) throw Error(DS(r) || "No image in the response");
		return e;
	}
	let i = r?.data ?? [], a = [];
	for (let e of i) {
		let t = e.media_type || "image/png";
		if (e.b64_json) {
			let n = Hx(e.b64_json, t);
			a.push(OS(new Uint8Array(await n.arrayBuffer()), t));
		} else e.url && a.push(await (await eS(await Qx(e.url, { signal: n }))).blob());
	}
	if (!a.length) throw Error("No image in the response");
	return a;
}
async function AS(e, t, n) {
	let { url: r, init: i } = await TS(e, t);
	return kS(e, await eS(await Qx(r, {
		...i,
		signal: n
	})), n);
}
//#endregion
//#region src/st/cards.ts
function jS() {
	let t = e(), n = t.characters ?? [], r = (e) => e ? {
		key: e,
		name: n.find((t) => t.avatar === e)?.name || e.replace(/\.[^.]+$/, "")
	} : null, i = [];
	return t.groupId ? i = (t.groups?.find((e) => e.id === t.groupId)?.members ?? []).map(r) : t.characterId !== void 0 && t.characterId !== null && t.characterId !== "" && (i = [r(n[Number(t.characterId)]?.avatar)]), i.filter((e) => !!e);
}
function MS(e, t = jS()) {
	return !e || t.some((t) => t.key === e);
}
//#endregion
//#region src/media/image/refs.ts
function NS(e) {
	let t = new Set(e.map((e) => e.id)), n = 1;
	for (; t.has(`ref${n}`);) n++;
	return `ref${n}`;
}
async function PS() {
	await Lx("ref:", new Set(bx().image.connections.flatMap((e) => e.refs.map((e) => e.blob)))).catch((e) => console.warn("[AP] media gc failed", e));
}
function FS(e, t = jS()) {
	return e.refs.filter((e) => MS(e.card, t));
}
//#endregion
//#region src/ui/state.ts
var Y = /* @__PURE__ */ fn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), IS = () => {
	Y.chatRev++;
}, LS = () => {
	Y.presetId = dh();
}, RS = W(() => Y.presetId ? Mp(Y.presetId) : void 0), zS = W(() => {
	let e = RS.value;
	if (!e) return { config: "" };
	let t = Vm(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Hp(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function BS(t) {
	return Y.chatRev, e().chat[t];
}
function VS(e) {
	return gm(BS(e));
}
function HS(e) {
	Y.storylineFocus = e, US("storylines");
}
function US(e) {
	e && (Y.tab = e), Y.panelOpen = !0;
}
//#endregion
//#region src/app/images.ts
var WS = /* @__PURE__ */ fn(/* @__PURE__ */ new Map()), GS = (e, t, n) => `${e}:${t}:${n}`;
function KS() {
	let e = bx().image;
	return e.enabled ? Tx(e) : void 0;
}
function qS() {
	let e = bx().image, t = KS();
	if (!t) return {
		vars: { ..._c },
		refs: []
	};
	let n = vx(t.api) ? FS(t).map((e) => ({
		id: e.id,
		description: e.description
	})) : [];
	return {
		vars: {
			on: !0,
			auto: e.auto,
			api: t.api,
			prompt: t.promptType,
			style: !!t.style.trim(),
			sfw: t.nsfwBlock,
			refs: n.length > 0
		},
		refs: n
	};
}
var JS = (e) => e?.image ? Object.values(e.structures).filter((e) => e.kind === "image") : [], YS = (e, t) => Ec(e?.structures?.[t])?.images ?? [], XS = [
	"prompt",
	"refs",
	"ratio",
	"caption"
];
function ZS(e, t, n) {
	let r = YS(e, t)[n];
	if (!r) return;
	let i = e?.images?.[t]?.[n], a = {
		prompt: i?.prompt ?? r.prompt,
		refs: i?.refs ?? r.refs,
		ratio: i?.ratio ?? r.ratio,
		caption: i?.caption ?? r.caption
	};
	return a.refs?.length || delete a.refs, a.ratio || delete a.ratio, a.caption || delete a.caption, a;
}
var QS = (e, t, n) => XS.some((r) => e?.images?.[t]?.[n]?.[r] !== void 0);
function $S(t, n) {
	let r = e().chat, i = (e) => {
		let n = r[e];
		if (!n || n.is_user) return null;
		if (gm(n)?.genId === t) return {
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
async function eC(t, n, r) {
	let i = $S(t, n);
	if (!i) return !1;
	let a = e().chat[i.mesId];
	if (i.swipe === null) {
		let e = gm(a), t = structuredClone(e.images ?? {});
		r(t), vm(i.mesId, {
			...e,
			images: t
		});
	} else {
		let e = a.swipe_info[i.swipe].extra[hm], t = structuredClone(e.images ?? {});
		r(t), e.images = t;
	}
	return IS(), await e().saveChat(), !0;
}
var tC = (e, t, n) => {
	let r = e[t] ??= [];
	for (let e = r.length; e <= n; e++) r[e] = { keys: [] };
	return r[n];
};
async function nC(e, t) {
	if (!vx(e.api) || !t?.length) return [];
	let n = FS(e), r = [];
	for (let e of t) {
		let t = n.find((t) => t.id === e), i = t && await Nx(t.blob);
		t && i && r.push({
			id: t.id,
			description: t.description,
			blob: i
		});
	}
	return r;
}
var rC = class extends Error {
	constructor() {
		super("No image connection"), this.name = "NoImageConnection";
	}
};
async function iC(t, n, r) {
	let i = gm(e().chat[t]);
	if (!i) return;
	let a = GS(i.genId, n, r);
	if (WS.get(a)?.status === "running") return;
	let o = new AbortController();
	WS.set(a, {
		status: "running",
		abort: o
	});
	try {
		let e = KS();
		if (!e) throw new rC();
		let s = ZS(i, n, r);
		if (!s?.prompt.trim()) return;
		let c = await AS(e, {
			prompt: s.prompt,
			ratio: s.ratio,
			refs: await nC(e, s.refs)
		}, o.signal), l = [];
		for (let e of c) l.push(await Mx(e, { prefix: "img:" }));
		if (!await eC(i.genId, t, (e) => {
			let t = tC(e, n, r);
			t.keys.push(...l), t.shown = t.keys.length - 1;
		})) for (let e of l) Fx(e);
		WS.delete(a);
	} catch (e) {
		o.signal.aborted ? WS.delete(a) : (WS.set(a, {
			status: "error",
			error: e
		}), console.warn("[AP] image generation failed", e));
	} finally {
		WS.get(a)?.status === "running" && WS.delete(a);
	}
}
function aC(e, t, n) {
	let r = WS.get(GS(e, t, n));
	r?.status === "running" ? r.abort.abort() : WS.delete(GS(e, t, n));
}
var oC = (e, t) => {
	let n = e ?? [], r = t ?? [];
	return n.length === r.length && n.every((e) => r.includes(e));
};
async function sC(t, n, r, i) {
	let a = gm(e().chat[t]);
	if (!a) return;
	let o = YS(a, n)[r];
	o && await eC(a.genId, t, (e) => {
		let t = tC(e, n, r);
		for (let e of XS) delete t[e];
		i && (i.prompt !== void 0 && i.prompt.trim() && i.prompt.trim() !== o.prompt.trim() && (t.prompt = i.prompt.trim()), i.refs !== void 0 && !oC(i.refs, o.refs) && (t.refs = [...i.refs]), i.ratio !== void 0 && i.ratio !== o.ratio && (t.ratio = i.ratio), i.caption !== void 0 && i.caption.trim() !== (o.caption ?? "").trim() && (t.caption = i.caption.trim()));
	});
}
async function cC(t, n, r, i) {
	let a = gm(e().chat[t]);
	a && await eC(a.genId, t, (e) => {
		tC(e, n, r).shown = i;
	});
}
async function lC(t, n, r, i) {
	let a = gm(e().chat[t]);
	a && (await eC(a.genId, t, (e) => {
		let t = tC(e, n, r), a = t.keys.indexOf(i);
		a < 0 || (t.keys.splice(a, 1), t.shown !== void 0 && t.shown >= a && (t.shown = Math.max(0, t.shown - 1)));
	}), await Fx(i));
}
async function uC(t) {
	let n = bx().image;
	if (!n.enabled || !n.auto || !KS()) return;
	let r = gm(e().chat[t]);
	if (r && r.origin === "story") for (let e of JS(Mp(r.presetId))) {
		let n = YS(r, e.id);
		for (let i = 0; i < n.length; i++) {
			if (r.images?.[e.id]?.[i]?.keys.length) continue;
			let n = $S(r.genId, t);
			if (!n || n.swipe !== null) return;
			await iC(n.mesId, e.id, i);
		}
	}
}
function dC() {
	pv({ image: qS });
}
//#endregion
//#region src/app/receive.ts
var fC = 6e5, pC = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function mC(t, n) {
	let r = Ib.pending;
	if (!r || Date.now() - r.at > fC || pC.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	Ib.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), vm(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await cx(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && zm(Vm(r.ctx.preset), a.global), mx(), kb.current?.genId === r.ctx.id && Mb(kb.current, t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t), uC(t);
}
//#endregion
//#region src/app/annotations.ts
var hC = /* @__PURE__ */ new Set();
function gC(e) {
	for (let t of hC) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function _C(t) {
	let n = e().chat[t], r = gm(n)?.annotations;
	return !n || !r?.length ? [] : dc(n.mes, r).annotations;
}
function vC(t) {
	let n = e().chat[t], r = gm(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = dc(n.mes, r.annotations);
	return i.changed ? (vm(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function yC() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (vC(n) && e().saveChat(), gC(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => gC(Number(e)));
}
var bC = {
	get: (e) => _C(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return hC.add(t), () => hC.delete(t);
	}
}, xC = /* @__PURE__ */ new Set();
function SC(e) {
	for (let t of xC) try {
		t(e);
	} catch (e) {
		console.error("[AP] speech listener failed", e);
	}
}
function CC(t) {
	let n = e().chat[t], r = gm(n)?.speech;
	return !n || !r?.length ? [] : Fc(n.mes, r).spans;
}
function wC(t) {
	let n = e().chat[t], r = gm(n);
	if (!n || !r?.speech?.length) return !1;
	let i = Fc(n.mes, r.speech);
	return i.changed ? (vm(t, {
		...r,
		speech: i.spans
	}), !0) : !1;
}
function TC() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (wC(n) && e().saveChat(), SC(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => SC(Number(e)));
}
var EC = {
	get: (e) => CC(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return xC.add(t), () => xC.delete(t);
	}
}, DC = (e) => !!e?.image, OC = (e) => !!e?.speech, kC = (e) => DC(e) || OC(e);
//#endregion
//#region src/ui/media/errors.ts
function AC(e) {
	return e instanceof Ux ? J(`media.error.proxy.${e.issue}`) : e instanceof Wx ? e.message : e instanceof Error && e.name === "NoImageConnection" ? J("media.error.noConnection") : e instanceof TypeError ? J("media.error.network") : e instanceof rS ? J("media.error.body", { error: e.message }) : e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/media/speech/clip.ts
var jC = class e {
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
}, MC = null;
function NC() {
	return (!MC || MC.state === "closed") && (MC = new AudioContext()), MC;
}
var PC = class {
	carry = null;
	push(e) {
		let t = this.carry === null ? 0 : 1, n = e.length + t >> 1, r = new Float32Array(n), i = 0, a = 0;
		for (this.carry !== null && e.length && (r[a++] = FC(this.carry | e[0] << 8), i = 1, this.carry = null); i + 1 < e.length; i += 2) r[a++] = FC(e[i] | e[i + 1] << 8);
		return i < e.length && (this.carry = e[i]), a === n ? r : r.subarray(0, a);
	}
}, FC = (e) => (e & 32768 ? e - 65536 : e) / 32768, IC = .15, LC = 1.2, RC = class {
	clip;
	sources = /* @__PURE__ */ new Set();
	stopped = !1;
	scheduled = 0;
	constructor(e) {
		this.clip = e;
	}
	async run() {
		let e = NC();
		e.state === "suspended" && await e.resume().catch(() => void 0);
		let t = this.clip.sampleRate, n = new PC(), r = [], i = 0, a = 0, o = IC, s = !1, c = null, l = () => {
			if (!i || this.stopped) return;
			let n = e.createBuffer(1, i, t), l = n.getChannelData(0), u = 0;
			for (let e of r) l.set(e, u), u += e.length;
			r = [], i = 0;
			let d = e.createBufferSource();
			d.buffer = n, d.connect(e.destination), s && a < e.currentTime && (o = Math.min(o * 2, LC)), s = !0, a = Math.max(a, e.currentTime + .05), d.start(a), a += n.duration, this.scheduled += n.duration, this.sources.add(d), d.onended = () => this.sources.delete(d), c = d;
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
async function zC() {
	MC?.state === "running" && await MC.suspend();
}
async function BC() {
	MC?.state === "suspended" && await MC.resume();
}
//#endregion
//#region src/media/speech/util.ts
var VC = class extends Error {
	status;
	constructor(e, t) {
		super(e), this.status = t, this.name = "SpeechError";
	}
}, HC = (e, t) => e.baseUrl.trim() || t, UC = (e, t) => nS(t, iS(e));
function WC(e, t) {
	let n = {}, r = (e, t) => {
		for (let t of Object.keys(n)) t.toLowerCase() === e.toLowerCase() && delete n[t];
		t !== "" && (n[e] = t);
	};
	for (let [e, n] of Object.entries(t)) r(e, n);
	for (let [t, n] of Object.entries(e.headers ?? {})) t.trim() && r(t.trim(), n);
	return n;
}
async function* GC(e, t) {
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
function KC(e, t) {
	if (!e.body) throw new VC("Empty response.");
	return Db(e.body, t);
}
function qC(e) {
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
function JC(e) {
	let t = e.length >> 1, n = new Uint8Array(t);
	for (let r = 0; r < t; r++) n[r] = parseInt(e.substr(r * 2, 2), 16);
	return n;
}
async function* YC(e) {
	let t = /* @__PURE__ */ new Uint8Array(), n = !1;
	for await (let r of e) {
		if (n) {
			yield r;
			continue;
		}
		let e = new Uint8Array(t.length + r.length);
		if (e.set(t), e.set(r, t.length), t = e, t.length < 12) continue;
		let i = String.fromCharCode(...t.subarray(0, 4)) + String.fromCharCode(...t.subarray(8, 12)) === "RIFFWAVE" ? XC(t) : 0;
		i < 0 || (n = !0, t.length > i && (yield t.subarray(i)));
	}
	!n && t.length && (yield t);
}
function XC(e) {
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
var ZC = {
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
		if (r?.kind === "clone") throw new VC("DeepSeek does not support voice cloning.");
		let a = UC(t, {
			text: n,
			voice_id: r?.id ?? this.voices[0].id,
			format: "pcm"
		});
		return {
			sampleRate: 24e3,
			chunks: YC(GC(await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "tools/tts"), {
				method: "POST",
				headers: WC(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(a),
				signal: i
			})), i))
		};
	}
}, QC = 24e3, $C = [
	["JBFqnCBsd6RMkjVDRZzb", "George"],
	["21m00Tcm4TlvDq8ikWAM", "Rachel"],
	["EXAVITQu4vr4xnSDxMaL", "Sarah"],
	["pNInz6obpgDQGcFmaJgB", "Adam"],
	["nPczCjzI2devNBz1zQrb", "Brian"],
	["pFZP5JQG7iQjIQuC4Bku", "Lily"],
	["IKne3meq5aSn9XLyUdCD", "Charlie"],
	["XB0fDUnXU5powFXDhCwa", "Charlotte"]
], ew = (e) => ({ "xi-api-key": e }), tw = {
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
	voices: $C.map(([e, t]) => ({
		id: e,
		name: t
	})),
	format: "Inside a speech tag you may add ElevenLabs audio tags in square brackets right before the words they affect: emotions such as [excited] [sad] [angry] [nervous] [sarcastic] [curious], delivery such as [whispers] [shouts] [softly], and sounds such as [laughs] [sighs] [gasps] [crying] [clears throat]; use [pause] or an ellipsis for a pause. Example: <speech character=\"Mia\">[whispers] Don't move. [pause] Something is out there.</speech>",
	tags: /\[[^[\]\n]{1,60}\]/g,
	clone: { text: "none" },
	async search(e, t, n, r) {
		let i = HC(t, this.defaults.baseUrl), a = WC(t, ew(t.apiKey)), o = n.trim(), s = new URL(sS(i, "v2/voices"));
		s.searchParams.set("page_size", "30"), o && s.searchParams.set("search", o);
		let c = new URL(sS(i, "v1/shared-voices"));
		c.searchParams.set("page_size", "30"), o && c.searchParams.set("search", o);
		let l = async (t) => (await (await eS(await e.fetch(t.toString(), {
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
		let i = sS(HC(t, this.defaults.baseUrl), `v1/voices/add/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.id)}`), a = await e.fetch(i, {
			method: "POST",
			headers: WC(t, {
				...ew(t.apiKey),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ new_name: n.name }),
			signal: r
		});
		return a.status === 400 || a.status === 409 ? n.id : (await (await eS(a)).json()).voice_id || n.id;
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new VC("Reference audio is missing.");
		let a = new FormData();
		a.append("name", `AP ${n.audio.slice(-8)}`), a.append("files", i, "reference");
		let o = (await (await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "v1/voices/add"), {
			method: "POST",
			headers: WC(t, ew(t.apiKey)),
			body: a,
			signal: r
		}))).json()).voice_id;
		if (!o) throw new VC("No voice id returned.");
		return o;
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = r?.kind === "voice" ? r.id : r?.id;
		if (r?.kind === "clone" && !a) throw new VC("The cloned voice has not been created.");
		let o = new URL(sS(HC(t, this.defaults.baseUrl), `v1/text-to-speech/${encodeURIComponent(a || $C[0][0])}/stream`));
		o.searchParams.set("output_format", `pcm_${QC}`);
		let s = UC(t, {
			text: n,
			model_id: t.model || this.defaults.model
		});
		return {
			sampleRate: QC,
			chunks: GC(await eS(await e.fetch(o.toString(), {
				method: "POST",
				headers: WC(t, {
					...ew(t.apiKey),
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
function nw(e) {
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
var rw = 24e3, iw = {
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
		let i = new URL(sS(HC(t, this.defaults.baseUrl), "model"));
		return i.searchParams.set("page_size", "20"), n.trim() && i.searchParams.set("title", n.trim()), ((await (await eS(await e.fetch(i.toString(), {
			headers: WC(t, t.apiKey ? { Authorization: `Bearer ${t.apiKey}` } : {}),
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
			sample_rate: rw,
			latency: "balanced"
		};
		r?.kind === "voice" && (a.reference_id = r.id);
		let o = UC(t, a), s = {
			Authorization: `Bearer ${t.apiKey}`,
			model: t.model || this.defaults.model
		}, c;
		if (r?.kind === "clone") {
			let t = await e.blob(r.audio);
			if (!t) throw new VC("Reference audio is missing.");
			let n = {
				audio: new Uint8Array(await t.arrayBuffer()),
				text: r.text ?? ""
			};
			c = nw({
				...o,
				references: [n]
			}), s["Content-Type"] = "application/msgpack";
		} else c = JSON.stringify(o), s["Content-Type"] = "application/json";
		let l = await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "v1/tts"), {
			method: "POST",
			headers: WC(t, s),
			body: c,
			signal: i
		}));
		return {
			sampleRate: Number(o.sample_rate) || rw,
			chunks: GC(l, i)
		};
	}
}, aw = [
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
], ow = /* @__PURE__ */ "argh.breath.heavy breath.exhales.cackle.cheer.chuckle.chuckles.cough.cry.gasp.giggle.groan.growl.grunt.grr.hiss.laugh.laughter.moan.pant.pff.phew.scream.shout.shriek.sigh.sighs.sneeze.snicker.snort.sob.throat-clearing.tsk.whimper.whispers.whispering.yawn.short pause.long pause".split("."), sw = (e) => WC(e, {
	"Content-Type": "application/json",
	"x-goog-api-key": e.apiKey
});
function cw(e) {
	if (!e) return aw[0][0];
	if (e.kind === "voice" || e.id) return e.id;
	throw new VC("The replicated voice has not been created yet.");
}
var lw = {
	api: "gemini",
	defaults: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-3.8-flash-tts"
	},
	models: ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"],
	voices: aw.map(([e, t]) => ({
		id: e,
		name: e,
		description: t
	})),
	format: "Inside a speech tag you may add vocal sounds and pauses in angle brackets exactly where they happen: <sigh> <laugh> <chuckle> <giggle> <gasp> <cough> <breath> <sob> <yawn> <whispering> <short pause> <long pause>. Use these English tags in any language. Example: Wait... <short pause> did you hear that? <gasp>",
	tags: RegExp(`<(?:${ow.join("|")})>`, "gi"),
	clone: {
		text: "none",
		consent: !0
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = UC(t, {
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
			generation_config: { speech_config: [{ voice: cw(r) }] },
			stream: !0
		}), o = await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "interactions"), {
			method: "POST",
			headers: sw(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.response_format?.sample_rate) || 24e3,
			chunks: YC(uw(o, i))
		};
	},
	async createClone(e, t, n, r) {
		let [i, a] = await Promise.all([e.blob(n.audio), n.consent ? e.blob(n.consent) : void 0]);
		if (!i) throw new VC("Reference audio not found.");
		if (!a) throw new VC("Gemini voice replication needs a consent recording.");
		let o = async (e) => ({
			mime_type: e.type.split(";")[0].trim() || "audio/wav",
			data: await Vx(e)
		}), s = await (await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "voices"), {
			method: "POST",
			headers: sw(t),
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
		if (!c) throw new VC("Gemini did not return a voice id.");
		return c;
	},
	async search(e, t, n, r) {
		let i = new URL(sS(HC(t, this.defaults.baseUrl), "voices"));
		return n.trim() && i.searchParams.set("search", n.trim()), i.searchParams.set("page_size", "100"), ((await (await eS(await e.fetch(i.toString(), {
			method: "GET",
			headers: WC(t, { "x-goog-api-key": t.apiKey }),
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
async function* uw(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = ((await e.json()).steps ?? []).flatMap((e) => e.content ?? []).filter((e) => e.type === "audio" && e.data);
		if (!t.length) throw new VC("Gemini returned no audio.");
		yield qC(t[t.length - 1].data);
		return;
	}
	let n = !1;
	for await (let r of KC(e, t)) {
		if (r === "[DONE]") break;
		let e = JSON.parse(r);
		if (e.event_type === "error" || e.error) throw new VC(`Gemini: ${e.error?.message ?? "stream error"}`);
		e.event_type === "step.delta" && e.delta?.type === "audio" && e.delta.data && (n = !0, yield qC(e.delta.data));
	}
	if (!n) throw new VC("Gemini returned no audio.");
}
//#endregion
//#region src/media/speech/providers/minimax.ts
var dw = [
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
], fw = [
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
function pw(e) {
	let t = e?.base_resp?.status_code;
	if (t) throw new VC(`MiniMax ${t}: ${e.base_resp?.status_msg || "error"}`);
	return e;
}
var mw = (e, t = !0) => WC(e, {
	...t ? { "Content-Type": "application/json" } : {},
	Authorization: `Bearer ${e.apiKey}`
});
function hw(e) {
	if (!e) return fw[0].id;
	if (e.kind === "voice" || e.id) return e.id;
	throw new VC("The cloned voice has not been created yet.");
}
function gw() {
	return `AP${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
var _w = {
	"audio/mpeg": "mp3",
	"audio/mp3": "mp3",
	"audio/mp4": "m4a",
	"audio/x-m4a": "m4a",
	"audio/m4a": "m4a",
	"audio/wav": "wav",
	"audio/x-wav": "wav",
	"audio/wave": "wav"
}, vw = {
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
	voices: fw,
	format: `Inside a speech tag you may add MiniMax voice tags: a pause as <#seconds#> between words (e.g. <#0.5#>), and interjections in parentheses: ${dw.map((e) => `(${e})`).join(" ")}. Example: (sighs) Fine.<#0.4#> Let's go.`,
	tags: RegExp(`<#\\d+(?:\\.\\d+)?#>|\\((?:${dw.join("|")})\\)`, "g"),
	clone: { text: "none" },
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = UC(t, {
			model: t.model || this.defaults.model,
			text: n,
			stream: !0,
			stream_options: { exclude_aggregated_audio: !0 },
			language_boost: "auto",
			voice_setting: { voice_id: hw(r) },
			audio_setting: {
				format: "pcm",
				sample_rate: 24e3,
				channel: 1
			}
		}), o = await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "t2a_v2"), {
			method: "POST",
			headers: mw(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.audio_setting?.sample_rate) || 24e3,
			chunks: yw(o, i)
		};
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new VC("Reference audio not found.");
		let a = HC(t, this.defaults.baseUrl), o = new FormData();
		o.append("purpose", "voice_clone"), o.append("file", i, `reference.${_w[i.type.split(";")[0].trim()] ?? "wav"}`);
		let s = await (await eS(await e.fetch(sS(a, "files/upload"), {
			method: "POST",
			headers: mw(t, !1),
			body: o,
			signal: r
		}))).text();
		pw(JSON.parse(s));
		let c = /"file_id"\s*:\s*"?(\d+)/.exec(s)?.[1];
		if (!c) throw new VC("MiniMax did not return a file id.");
		let l = gw(), u = JSON.stringify({
			file_id: 0,
			voice_id: l
		}).replace("\"file_id\":0", `"file_id":${c}`);
		return pw(await (await eS(await e.fetch(sS(a, "voice_clone"), {
			method: "POST",
			headers: mw(t),
			body: u,
			signal: r
		}))).json()), l;
	},
	async search(e, t, n, r) {
		let i = pw(await (await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "get_voice"), {
			method: "POST",
			headers: mw(t),
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
async function* yw(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = pw(await e.json());
		t.data?.audio && (yield JC(t.data.audio));
		return;
	}
	let n = !1;
	for await (let r of KC(e, t)) {
		let e = pw(JSON.parse(r)), t = e.data?.audio;
		t && (e.data?.status === 2 && n || (n = !0, yield JC(t)));
	}
}
//#endregion
//#region src/media/speech/providers/openai.ts
var bw = [
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
], xw = {
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
	voices: bw.map((e) => ({
		id: e,
		name: e[0].toUpperCase() + e.slice(1)
	})),
	format: "",
	tags: null,
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = r?.kind === "voice" ? r.id : bw[0], o = UC(t, {
			model: t.model || this.defaults.model,
			input: n,
			voice: a.startsWith("voice_") ? { id: a } : a,
			response_format: "pcm"
		});
		return {
			sampleRate: 24e3,
			chunks: GC(await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "audio/speech"), {
				method: "POST",
				headers: WC(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(o),
				signal: i
			})), i)
		};
	}
};
//#endregion
//#region src/media/speech/decode.ts
async function Sw(e, t) {
	let n = await new OfflineAudioContext(1, 1, t).decodeAudioData(e.slice().buffer), r = n.length, i = new Float32Array(r);
	for (let e = 0; e < n.numberOfChannels; e++) {
		let t = n.getChannelData(e);
		for (let e = 0; e < r; e++) i[e] += t[e] / n.numberOfChannels;
	}
	let a = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(r * 2));
	for (let e = 0; e < r; e++) {
		let t = Math.max(-1, Math.min(1, i[e]));
		a.setInt16(e * 2, t < 0 ? t * 32768 : t * 32767, !0);
	}
	return {
		sampleRate: n.sampleRate,
		pcm: new Uint8Array(a.buffer)
	};
}
//#endregion
//#region src/media/speech/providers/openrouter.ts
var Cw = (e) => e.map((e) => ({
	id: e,
	name: e[0].toUpperCase() + e.slice(1)
})), ww = {
	elevenlabs: {
		format: tw.format,
		tags: tw.tags,
		voices: Cw([
			"george",
			"sarah",
			"adam",
			"alice",
			"bella",
			"brian",
			"charlie",
			"daniel",
			"jessica",
			"laura",
			"liam",
			"lily",
			"matilda",
			"river",
			"roger",
			"will"
		])
	},
	"fish-audio": {
		format: iw.format,
		tags: iw.tags,
		clone: { text: "optional" }
	},
	minimax: {
		format: vw.format,
		tags: vw.tags
	},
	google: {
		format: lw.format,
		tags: lw.tags,
		voices: lw.voices,
		pcm: 24e3
	},
	heygen: {
		format: `Inside a speech tag you may add HeyGen audio tags in square brackets, in lower-case English, right before the words they affect: ${[
			"sad",
			"happy",
			"excited",
			"angry",
			"whispers",
			"shouts",
			"slowly",
			"quickly",
			"laughs",
			"sighs",
			"gasps",
			"clears throat"
		].map((e) => `[${e}]`).join(" ")}. A delivery tag lasts for a sentence or two; a sound tag plays once. Example: <speech character="Mia">[sad] I walked past our old house today. [sighs] The garden is gone.</speech>`,
		tags: iw.tags,
		clone: { text: "none" },
		voices: Cw([
			"nadine",
			"tabitha",
			"bram",
			"gareth",
			"noelle",
			"meredith",
			"sabrina",
			"lucian",
			"weston",
			"vincent"
		]),
		pcm: 44100
	},
	"bytedance-seed": { clone: { text: "none" } }
}, Tw = (e) => e.trim().split("/")[0].toLowerCase(), Ew = {
	format: "",
	tags: null,
	voices: []
}, Dw = (e) => ({
	...Ew,
	...ww[Tw(e)]
}), Ow = 24e3, kw = "elevenlabs/eleven-v3", Aw = (e) => e.trim() || kw, jw = /* @__PURE__ */ new Map();
function Mw(e, t) {
	let n = /rate=(\d+)/i.exec(e);
	return n && Number(n[1]) || Dw(t).pcm || Ow;
}
//#endregion
//#region src/media/speech/providers/index.ts
var Nw = {
	fish: iw,
	elevenlabs: tw,
	minimax: vw,
	gemini: lw,
	openai: xw,
	deepseek: ZC,
	openrouter: {
		api: "openrouter",
		defaults: {
			baseUrl: "https://openrouter.ai/api/v1",
			model: kw
		},
		models: [
			"elevenlabs/eleven-v3",
			"elevenlabs/eleven-v4",
			"elevenlabs/eleven-flash-v2.5",
			"google/gemini-3.8-flash-tts",
			"google/gemini-2.5-pro-tts",
			"fish-audio/s2.1-pro",
			"heygen/heygen-voice-1",
			"bytedance-seed/seed-audio-1-0",
			"microsoft/mai-voice-2.1",
			"mistralai/voxtral-mini-tts-2603",
			"qwen/qwen3-tts-1.7b",
			"x-ai/grok-voice-tts-1.0",
			"deepgram/aura-2",
			"hexgrad/kokoro-82m"
		],
		...Ew,
		forModel(e) {
			let { pcm: t, ...n } = Dw(Aw(e));
			return {
				clone: void 0,
				...n
			};
		},
		async search(e, t, n, r) {
			let i = Aw(t.model), a = HC(t, this.defaults.baseUrl), o = `${a}|${i}`, s = jw.get(o);
			if (!s) {
				let n = sS(a, `audio/speech/models/${i.split("/").map(encodeURIComponent).join("/")}`);
				s = e.fetch(n, {
					headers: WC(t, t.apiKey ? { Authorization: `Bearer ${t.apiKey}` } : {}),
					signal: r
				}).then(eS).then(async (e) => {
					let t = await e.json(), n = ((t.data && typeof t.data == "object" ? t.data : t).output_modalities ?? []).flatMap((e) => Array.isArray(e.supported_parameters?.voice?.values) ? e.supported_parameters.voice.values : []);
					return [...new Set(n.filter((e) => typeof e == "string"))].map((e) => ({
						id: e,
						name: e
					}));
				}), jw.set(o, s), s.catch(() => jw.delete(o));
			}
			let c = n.trim().toLowerCase();
			return (await s).filter((e) => !c || e.id.toLowerCase().includes(c));
		},
		async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
			let a = Aw(t.model), o = Dw(a), s = {
				model: a,
				input: n,
				response_format: o.pcm ? "pcm" : "mp3"
			};
			if (r?.kind === "clone") {
				let t = await e.blob(r.audio);
				if (!t) throw new VC("Reference audio is missing.");
				s.input_references = [{
					type: "input_audio",
					input_audio: { data: `data:${t.type || "audio/wav"};base64,${await Vx(t)}` }
				}, ...r.text?.trim() ? [{
					type: "text",
					text: r.text.trim()
				}] : []];
			} else {
				let e = r?.id ?? o.voices[0]?.id;
				e && (s.voice = e);
			}
			let c = await eS(await e.fetch(sS(HC(t, this.defaults.baseUrl), "audio/speech"), {
				method: "POST",
				headers: WC(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(UC(t, s)),
				signal: i
			})), l = c.headers.get("content-type") ?? "";
			if (/pcm|l16/i.test(l) || !l && o.pcm) return {
				sampleRate: Mw(l, a),
				chunks: GC(c, i)
			};
			let u = await Sw(new Uint8Array(await c.arrayBuffer()), Ow);
			return {
				sampleRate: u.sampleRate,
				chunks: (async function* () {
					yield u.pcm;
				})()
			};
		}
	}
};
function Pw(e) {
	return Nw[e];
}
function Fw(e) {
	let t = Nw[e.api];
	return t?.forModel ? {
		...t,
		...t.forModel(e.model || t.defaults.model)
	} : t;
}
var Iw = (e) => e && Fw(e)?.format || "", Lw = (e) => e && Fw(e)?.tags || null, Rw = (e) => e.global ? e : new RegExp(e.source, `${e.flags}g`);
function zw(e, t, n) {
	let r = Lw(e);
	if (!r || t === n) return r ? t : n;
	let i = RegExp(`^(?:${r.source})$`, r.flags.replace("g", "")), a = t;
	for (let e of [Ac, ...Object.values(Nw).map((e) => e.tags)]) e && e !== r && (a = a.replace(Rw(e), (e) => i.test(e) ? e : ""));
	return a === t ? t : a.replace(/[ \t]{2,}/g, " ").trim();
}
//#endregion
//#region src/media/speech/segments.ts
function Bw(e) {
	let t = e.replace(/<[^>]*>/g, " ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_~`#>|]+/g, "").replace(/\s+/g, " ").trim();
	return /[\p{L}\p{N}]/u.test(t) ? t : "";
}
function Vw(e, t, n, r = (e) => e, i = {}) {
	let a = t.filter((e) => !e.orphan && e.end > e.start).sort((e, t) => e.start - t.start), o = [], s = 0, c = (t, r) => {
		if (!n || r <= t) return;
		let i = t;
		for (let n of e.slice(t, r).split(/(\n\s*\n)/)) {
			let e = Bw(n);
			e && o.push({
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
	for (let e of a) {
		if (e.start < s) continue;
		c(s, e.start);
		let t = r(e.text ?? e.quote, e.quote).trim();
		t && o.push({
			id: e.id,
			kind: "speech",
			character: e.character,
			text: t,
			display: e.quote,
			start: e.start,
			end: e.end
		}), s = e.end;
	}
	c(s, e.length);
	for (let e of o) {
		let t = i[e.id]?.trim();
		t && t !== e.text && (e.original = e.text, e.text = t);
	}
	return o;
}
var Hw = (e) => e.normalize("NFKC").trim().toLowerCase();
function Uw(e, t) {
	return e.bindings.filter((e) => !e.card || t.includes(e.card));
}
function Ww(e, t) {
	let n = Hw(t), r = e.filter((e) => e.voice && Hw(e.character) === n);
	return r.find((e) => e.card) ?? r[0];
}
function Gw(e, t, n) {
	return t.kind === "narration" || !t.character.trim() ? e.narrator : Ww(Uw(e, n), t.character)?.voice ?? void 0;
}
function Kw(e) {
	return e ? e.kind === "voice" ? `v:${e.id}` : `c:${e.audio}:${e.text ?? ""}` : "-";
}
function qw(e) {
	let t = 14695981039346656037n, n = new TextEncoder().encode(e);
	for (let e of n) t = BigInt.asUintN(64, (t ^ BigInt(e)) * 1099511628211n);
	return t.toString(16).padStart(16, "0");
}
function Jw(e, t, n) {
	return `tts:${qw(JSON.stringify([
		e.api,
		e.baseUrl.trim(),
		e.model,
		e.body.trim(),
		Kw(t),
		n
	]))}`;
}
//#endregion
//#region src/media/speech/wav.ts
function Yw(e, t) {
	let n = e.length & -2, r = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(44)), i = (e, t) => {
		for (let n = 0; n < t.length; n++) r.setUint8(e + n, t.charCodeAt(n));
	};
	return i(0, "RIFF"), r.setUint32(4, 36 + n, !0), i(8, "WAVE"), i(12, "fmt "), r.setUint32(16, 16, !0), r.setUint16(20, 1, !0), r.setUint16(22, 1, !0), r.setUint32(24, t, !0), r.setUint32(28, t * 2, !0), r.setUint16(32, 2, !0), r.setUint16(34, 16, !0), i(36, "data"), r.setUint32(40, n, !0), new Blob([r.buffer, e.slice(0, n)], { type: "audio/wav" });
}
function Xw(e) {
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
var Zw = {
	fetch: (e, t) => Qx(e, t),
	blob: Nx
}, X = /* @__PURE__ */ fn({
	clips: {},
	playing: null,
	paused: !1,
	generating: {}
});
function Qw() {
	let e = bx().speech;
	return e.enabled ? Tx(e) : void 0;
}
function $w(t) {
	let n = e().chat[t], r = Qw();
	if (!n || n.is_user || !r) return [];
	let i = gm(n);
	return !i || !OC(Mp(i.presetId)) ? [] : Vw(n.mes, CC(t), bx().speech.narrator, (e, t) => zw(r, e, t), i.speechText);
}
async function eT(t, n, r) {
	let i = $w(t).find((e) => e.id === n), a = gm(e().chat[t]);
	if (!i || !a) return;
	let o = r.trim();
	if (o === i.text) return;
	await PT(t, [n]);
	let s = { ...a.speechText };
	!o || o === (i.original ?? i.text) ? delete s[n] : s[n] = o;
	let { speechText: c, ...l } = a;
	vm(t, Object.keys(s).length ? {
		...l,
		speechText: s
	} : l), IS(), await e().saveChat();
}
var tT = /* @__PURE__ */ new Map();
async function nT(e, t, n) {
	if (t?.kind !== "clone" || t.id) return t;
	let r = Fw(e);
	if (!r?.createClone) return t;
	let i = `${e.id}:${t.audio}:${t.consent ?? ""}`, a = tT.get(i);
	return a || (a = r.createClone(Zw, e, t, n), tT.set(i, a), a.catch(() => tT.delete(i))), t.id = await a, xx(), t;
}
var rT = async () => null, iT = (e) => {
	rT = e;
}, aT = () => jS().map((e) => e.key), oT = /* @__PURE__ */ new Map(), sT = Promise.resolve();
function cT(e, t) {
	let n = `${e.id}\n${Hw(t)}`, r = oT.get(n);
	return r || (r = sT.then(async () => {
		if (Gw(e, {
			kind: "speech",
			character: t
		}, aT()) !== void 0) return !0;
		let n = jS(), r = await rT(e, t, n);
		if (!r) return !1;
		let i = e.bindings.find((e) => Hw(e.character) === Hw(t) && (e.card ?? "") === (r.card ?? ""));
		return i ? i.voice = r.voice : e.bindings.push({
			character: t,
			voice: r.voice,
			...r.card ? { card: r.card } : {}
		}), xx(), !0;
	}).finally(() => oT.delete(n)), sT = r.catch(() => void 0), oT.set(n, r), r);
}
async function lT(e, t) {
	let n = aT(), r = /* @__PURE__ */ new Map();
	for (let i of t) Gw(e, i, n) === void 0 && r.set(Hw(i.character), i.character);
	for (let t of r.values()) await cT(e, t);
	let i = aT();
	return t.filter((t) => Gw(e, t, i) !== void 0);
}
var uT = 48, dT = /* @__PURE__ */ new Map();
function fT(e, t) {
	dT.delete(e), dT.set(e, t);
	for (let e of dT.keys()) {
		if (dT.size <= uT) break;
		if (dT.get(e).state !== "loading") dT.delete(e);
		else break;
	}
	return t;
}
function pT(e, t) {
	let n = Gw(e, t, aT());
	return n === void 0 ? void 0 : Jw(e, n, t.text);
}
function mT(e, t) {
	let n = Gw(e, t, aT());
	return n === void 0 ? Promise.reject(/* @__PURE__ */ Error(`No voice for ${t.character}`)) : gT(e, n, t.text);
}
var hT = /* @__PURE__ */ new Map();
function gT(e, t, n) {
	let r = Jw(e, t, n), i = dT.get(r);
	if (i && i.state !== "error") return Promise.resolve(fT(r, i));
	let a = hT.get(r);
	return a || (a = _T(e, t, n, r).finally(() => hT.delete(r)), hT.set(r, a)), a;
}
async function _T(e, t, n, r) {
	let i = await Nx(r).catch(() => void 0), a = i ? Xw(await i.arrayBuffer()) : null;
	if (a) return X.clips[r] = "ready", fT(r, jC.of(a.pcm, a.sampleRate));
	let o = Fw(e);
	if (!o) throw Error(`Unknown speech API ${e.api}`);
	return X.clips[r] = "loading", fT(r, new jC(async (r) => {
		let i = await nT(e, t, r);
		return o.synthesize(Zw, {
			conn: e,
			text: n,
			voice: i,
			signal: r
		});
	}, (e) => {
		dT.get(r) === e && (X.clips[r] = e.state, e.state === "ready" && Mx(Yw(e.pcm(), e.sampleRate), { key: r }).catch((e) => console.warn("[AP] speech cache write failed", e)));
	}));
}
function vT(e) {
	let t = Qw(), n = t && pT(t, e);
	return n ? X.clips[n] : void 0;
}
async function yT(e) {
	let t = Qw();
	if (t) for (let n of e) {
		let e = pT(t, n);
		e && !X.clips[e] && await Px(e).catch(() => !1) && (X.clips[e] ??= "ready");
	}
}
function bT(e) {
	e instanceof DOMException && e.name === "AbortError" || (console.error("[AP] speech synthesis failed", e), x("error", AC(e), J("media.speech")));
}
var xT = null;
function ST() {
	xT && (xT.cancelled = !0, xT.playback?.stop()), xT = null, X.playing = null, X.paused = !1, BC();
}
async function CT() {
	X.playing && (X.paused ? (await BC(), X.paused = !1) : (await zC(), X.paused = !0));
}
async function wT(e, t, n, r) {
	ST();
	let i = Qw();
	if (!i || !t[n]) return;
	let a = {
		playback: null,
		cancelled: !1
	};
	xT = a;
	try {
		let o = await lT(i, r ? t.slice(n) : [t[n]]);
		if (a.cancelled || !o.length) return;
		let s = o.length - 1, c = mT(i, o[0]);
		for (let t = 0; t <= s && !a.cancelled; t++) {
			let n = await c;
			if (c = t < s ? mT(i, o[t + 1]) : null, a.cancelled) break;
			X.playing = {
				mesId: e,
				segId: o[t].id,
				all: r
			}, a.playback = new RC(n), await a.playback.run();
		}
	} catch (e) {
		a.cancelled || bT(e);
	} finally {
		xT === a && (xT = null, X.playing = null, X.paused = !1);
	}
}
function TT(e, t) {
	let n = X.playing;
	if (n && n.mesId === e && n.segId === t) {
		CT();
		return;
	}
	let r = $w(e), i = r.findIndex((e) => e.id === t);
	i >= 0 && wT(e, r, i, !1);
}
function ET(e, t) {
	let n = $w(e);
	wT(e, n, t ? Math.max(0, n.findIndex((e) => e.id === t)) : 0, !0);
}
async function DT(e, t) {
	ST();
	let n = {
		playback: null,
		cancelled: !1
	};
	xT = n;
	try {
		let r = await gT(e, t, J("media.speech.sample"));
		if (n.cancelled) return;
		n.playback = new RC(r), await n.playback.run();
	} catch (e) {
		n.cancelled || bT(e);
	} finally {
		xT === n && (xT = null);
	}
}
var OT = /* @__PURE__ */ new Set();
function kT(e) {
	return OT.add(e), () => {
		OT.delete(e);
	};
}
async function AT() {
	let e = /* @__PURE__ */ new Set();
	for (let t of bx().speech.connections) for (let n of [
		t.narrator,
		...t.bindings.map((e) => e.voice),
		...[...OT].flatMap((e) => e())
	]) n?.kind === "clone" && (e.add(n.audio), n.consent && e.add(n.consent));
	await Lx("voice:", e).catch(() => void 0);
}
async function jT(e) {
	let t = Qw();
	if (t && !X.generating[e] && $w(e).length) {
		X.generating[e] = !0;
		try {
			let n = await lT(t, $w(e));
			for (let e of n) {
				let n = await mT(t, e);
				if (await n.done, n.state === "error") throw n.error;
			}
		} catch (e) {
			bT(e);
		} finally {
			delete X.generating[e];
		}
	}
}
async function MT(e, t) {
	let n = Qw(), r = $w(e).find((e) => e.id === t);
	if (n && r) try {
		let [e] = await lT(n, [r]);
		if (!e) return;
		let t = await mT(n, e);
		if (await t.done, t.state === "error") throw t.error;
	} catch (e) {
		bT(e);
	}
}
async function NT(e) {
	let t = Qw();
	if (!t) return null;
	let n = [], r = 0;
	for (let i of await lT(t, $w(e))) {
		let e = await mT(t, i);
		await e.done, e.state === "ready" && (r && e.sampleRate !== r || (r = e.sampleRate, n.push(e.pcm())));
	}
	if (!r) return null;
	let i = new Uint8Array(n.reduce((e, t) => e + t.length, 0)), a = 0;
	for (let e of n) i.set(e, a), a += e.length;
	return Yw(i, r);
}
async function PT(e, t) {
	let n = Qw();
	if (!n) return;
	let r = X.playing;
	r && r.mesId === e && (!t || t.includes(r.segId)) && ST();
	for (let r of $w(e)) {
		if (t && !t.includes(r.id)) continue;
		let e = pT(n, r);
		e && (dT.get(e)?.abort(), dT.delete(e), delete X.clips[e], await Fx(e).catch(() => void 0));
	}
}
async function FT(e, t) {
	await PT(e, t ? [t] : void 0), t ? TT(e, t) : await jT(e);
}
function IT(e) {
	let t = Uw(e, aT()), n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let r = Hw(e.character);
		if (!e.character.trim() || n.has(r)) continue;
		let i = Ww(t, e.character);
		i && n.set(r, i.character);
	}
	return [...n.values()];
}
function LT() {
	let e = bx().speech, t = Qw(), n = t?.api ?? "", r = Lw(t);
	return {
		vars: {
			on: !!t,
			auto: e.auto,
			api: n,
			narrator: e.narrator,
			characters: !1
		},
		format: Iw(t),
		characters: t ? IT(t) : [],
		...r ? { cleaner: r } : {}
	};
}
var RT = 30;
function zT() {
	pv({ speech: LT }), Lx("tts:", /* @__PURE__ */ new Set(), RT * 864e5).catch(() => void 0);
	let { eventSource: t, eventTypes: n } = e();
	t.on("advanced_preset_message_updated", (e) => {
		let t = Number(e);
		!Number.isNaN(t) && bx().speech.auto && jT(t);
	});
	for (let e of [n.CHAT_CHANGED]) e && t.on(e, ST);
}
//#endregion
//#region src/store/bundled-modules.ts
function BT(e, t, n, r) {
	return Hf({
		...q(Xf(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
var VT = (e, t, n) => (t ? e.locales?.[t] ?? e.locales?.[t.split("-")[0]] : void 0)?.userModuleGroups?.[n];
function HT(e, t, n, r, i = { list: [] }) {
	let a = {
		add: [],
		groups: [],
		groupRecords: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	};
	for (let t of Kf(e)) t && typeof t.id == "string" && t.id && !a.groupRecords.includes(t.id) && (a.groupRecords.push(t.id), !(i.list.some((e) => e.id === t.id) || i.records?.includes(t.id)) && a.groups.push(qf({
		id: t.id,
		name: t.name,
		mode: t.mode === "single" ? "single" : "multi",
		...t.collapsed ? { collapsed: !0 } : {}
	}, VT(e, r, t.id))));
	let o = new Set([...i.list, ...a.groups].map((e) => e.id)), s = /* @__PURE__ */ new Set();
	for (let i of Jf(e)) {
		if (!i || typeof i.id != "string" || !i.id || s.has(i.id)) continue;
		s.add(i.id);
		let c = t.find((e) => e.id === i.id), l = BT(e, i, r, c?.enabled ?? i.enabled !== !1);
		if (!l) continue;
		let u = tp(i), d = ep(l), f = n?.[i.id];
		if (f?.source === u) {
			a.records[i.id] = f;
			continue;
		}
		if (!c) {
			f ? a.records[i.id] = {
				source: u,
				copy: f.copy
			} : (a.add.push(typeof i.group == "string" && o.has(i.group) ? {
				...l,
				group: i.group
			} : l), a.records[i.id] = {
				source: u,
				copy: d
			});
			continue;
		}
		let p = ep(c);
		p === d ? a.records[i.id] = {
			source: u,
			copy: d
		} : (a.conflicts.push({
			id: i.id,
			incoming: l,
			installed: c,
			modified: !f || p !== f.copy
		}), a.records[i.id] = {
			source: u,
			copy: f?.copy ?? ""
		}, a.incomingCopy[i.id] = d);
	}
	return a;
}
function UT(e, t, n = []) {
	if (e.add.length || e.groups.length || e.conflicts.length || e.groupRecords.length !== n.length || e.groupRecords.some((e) => !n.includes(e))) return !1;
	let r = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(r), ...Object.keys(e.records)])].every((t) => r[t]?.source === e.records[t]?.source && r[t]?.copy === e.records[t]?.copy);
}
function WT(e, t, n = []) {
	let r = Vm(e), i = ig(e), a = { ...t.records }, o = [...i];
	for (let e of n) {
		let n = t.conflicts.find((t) => t.id === e), r = o.findIndex((t) => t.id === e);
		if (!n || r < 0) continue;
		let { enabled: i, group: s } = o[r];
		o.splice(r, 1, {
			...n.incoming,
			enabled: i,
			...s === void 0 ? {} : { group: s }
		}), a[e] = {
			source: a[e].source,
			copy: t.incomingCopy[e]
		};
	}
	let s = yf([...o, ...t.add], [...r.userModuleGroups ?? [], ...t.groups]);
	r.userModules = s.modules, r.userModuleGroups = s.groups, r.bundledModules = a, t.groupRecords.length ? r.bundledGroups = t.groupRecords : delete r.bundledGroups, K();
}
function GT(e, t, n, r = []) {
	let i = Jf(e), a = t.map((t) => {
		let r = i.find((e) => e.id === t.id), a = r && BT(e, r, n, t.enabled);
		if (r && a && ep(a) === ep(t)) {
			let { enabled: e, group: n, ...i } = q(r);
			return {
				...i,
				...t.enabled ? {} : { enabled: !1 },
				...t.group === void 0 ? {} : { group: t.group }
			};
		}
		return Qf(t);
	}), o = Kf(e), s = q(e.locales ?? {}), c = r.filter((e) => t.some((t) => t.group === e.id)).map((t) => {
		let r = o.find((e) => e.id === t.id);
		if (r && ((e, t) => e.name === t.name && e.mode === t.mode && !!e.collapsed == !!t.collapsed)(qf(r, VT(e, n, r.id)), t)) return q(r);
		for (let e of Object.values(s)) e?.userModuleGroups && delete e.userModuleGroups[t.id];
		return {
			id: t.id,
			name: t.name,
			mode: t.mode,
			...t.collapsed ? { collapsed: !0 } : {}
		};
	}), { userModuleGroups: l, ...u } = e;
	return {
		...u,
		locales: s,
		userModules: a,
		...c.length ? { userModuleGroups: c } : {}
	};
}
//#endregion
//#region src/ui/download.ts
function KT(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function qT(e, t) {
	let n = URL.createObjectURL(e), r = document.createElement("a");
	r.href = n, r.download = t, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var JT = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
function YT(e, t) {
	let n = URL.createObjectURL(t), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
//#endregion
//#region src/app/bundled-modules.ts
function XT(e, t, n) {
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
async function ZT(e, t) {
	let { root: n, checked: r } = XT(J("um.bundled.conflictTitle"), J("um.bundled.conflictBody", { name: Up(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: J(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await y(n, J("um.bundled.apply"), J("um.bundled.keepAll")) ? r() : [];
}
async function QT(e, t) {
	let n = Vm(e), r = HT(e, ig(e), n.bundledModules, Bp(), {
		list: ag(e),
		records: n.bundledGroups
	});
	if (UT(r, n.bundledModules, n.bundledGroups)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await ZT(e, a)), WT(e, r, i), r.add.length && x("info", J("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), Up(e));
}
var $T = /* @__PURE__ */ new Map();
function eE(e, t = {}) {
	let n = e.id, r = ($T.get(n) ?? Promise.resolve()).then(() => QT(Mp(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return $T.set(n, r), r;
}
function tE(e, t, n) {
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
async function nE(e) {
	let t = ig(e), n = tE(J("presetFile.installer"), J("presetFile.installerHint"), !0), r, i = () => [];
	if (t.length) {
		let a = XT(J("um.bundled.exportTitle", { name: Up(e) }), J("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || J("um.untitled"),
			...e.enabled ? {} : { note: J("um.bundled.disabled") },
			checked: !0
		})));
		a.root.append(n.root), r = a.root, i = a.checked;
	} else {
		r = document.createElement("div"), r.style.textAlign = "start";
		let t = document.createElement("h3");
		t.textContent = J("um.bundled.exportTitle", { name: Up(e) }), r.append(t, n.root);
	}
	if (!await y(r, J("um.bundled.export"), J("common.cancel"))) return !1;
	let a = i(), o = GT(e, t.filter((e) => a.includes(e.id)), Bp(), ag(e)), s = Au(o, o.defaultConfiguration, void 0).sampling;
	return KT(`${JT(e.id)}.apreset.json`, Kd(o, {
		installer: n.box.checked,
		sampling: s
	})), !0;
}
//#endregion
//#region src/app/dev-source.ts
var rE = /* @__PURE__ */ fn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), iE = 1500, aE = null;
async function oE() {
	let { url: e, enabled: t } = G().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await S(`${n}/`, { cache: "no-store" })).json();
		if (rE.status = "online", rE.error = e.ok === !1 ? "build failed" : "", rE.at = Date.now(), !e.hash || e.hash === rE.hash) return;
		let t = Dp(await (await S(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		rE.presetId && rE.presetId !== t.id && Fp(null, rE.presetId), Fp(t), rE.presetId = t.id, rE.hash = t.hash, eh(t), await gh(t), eE(t, { auto: !0 }), Mg("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		rE.status = "error", rE.error = e instanceof Error ? e.message : String(e);
	}
}
function sE() {
	if (aE && clearTimeout(aE), aE = null, !G().dev.enabled) return rE.presetId && Fp(null, rE.presetId), Object.assign(rE, {
		status: "off",
		presetId: "",
		hash: "",
		error: ""
	}), Promise.resolve();
	rE.status === "off" && (rE.status = "connecting");
	let e = async () => {
		await oE(), G().dev.enabled && (aE = setTimeout(e, iE));
	};
	return e();
}
function cE() {
	let e = Promise.resolve();
	return P(() => [G().dev.enabled, G().dev.url], () => {
		rE.hash = "", e = sE();
	}, { immediate: !0 }), e;
}
//#endregion
//#region src/app/impersonate.ts
var lE = "#option_impersonate, #mes_impersonate", uE = () => document.querySelector("#send_textarea");
function dE(e, t = !1, n) {
	let r = uE();
	r && (r.value = n === void 0 ? e : lx(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function fE() {
	if (!G().enabled) return null;
	let t = dh(), n = t ? Mp(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Wm(n);
	if (!Eh(r)) return null;
	let i = Ws(n.meta.impersonatePrompt, (e) => e[0] === "name" ? md(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function pE(e) {
	if (!e.target?.closest?.(lE)) return;
	let t = fE();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = uE()?.value.trim();
	dE(lx(n ? `${t}\n${n}` : t), !0);
}
function mE() {
	window.addEventListener("click", pE, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function hE(e) {
	let t = El(e);
	if (!t) return !1;
	let n = G().presets[e.id]?.customUi, r = kp(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function gE(e) {
	let t = G().presets[e.id]?.customUi;
	return !!(t && t.hash === El(e));
}
function _E(e, t) {
	Vm(e).customUi = {
		enabled: t,
		hash: El(e)
	}, K();
}
//#endregion
//#region src/app/trust.ts
var vE = class extends Error {
	constructor() {
		super(J("trust.declined")), this.name = "TrustDeclined";
	}
}, yE = (e) => e instanceof vE, bE = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function xE(e, t, n, r) {
	return [
		`<h3>${v(e)}</h3>`,
		`<p>${v(J("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${v(J("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(r)}</pre>`
	].join("");
}
var SE = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function CE(e, t) {
	let n = mu(e);
	if (!n.length || t && bE(n, mu(t))) return;
	let r = Up(e);
	if (!await y(xE(J("trust.presetTitle"), J("trust.preset", { name: r }), n.length, SE(n)), J("trust.install"), J("common.cancel"))) throw new vE();
}
async function wE(e, t) {
	let n = Cp(e);
	if (!(!n.length || t && bE(n, Cp(t))) && !await y([
		`<h3>${v(J("trust.qrTitle"))}</h3>`,
		`<p>${v(J("trust.qrBody", {
			name: Up(e),
			n: n.length
		}))}</p>`,
		`<p>${v(J("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(SE(n))}</pre>`
	].join(""), J("trust.install"), J("common.cancel"))) throw new vE();
}
async function TE(e) {
	let t = kf(e);
	if (t.length && !await y(xE(J("trust.modulesTitle"), J("trust.modules", { n: e.length }), t.length, SE(t)), J("trust.import"), J("common.cancel"))) throw new vE();
}
async function EE(e) {
	let t = wl(e);
	if (!t.length) return !1;
	let n = t.map((t) => Hp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(J("common.listSeparator")), r = await y([
		`<h3>${v(J("trust.uiTitle"))}</h3>`,
		`<p>${v(J("trust.uiBody", {
			name: Up(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${v(J("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(SE(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), J("trust.enableUi"), J("trust.notNow"));
	return _E(e, r), r;
}
async function DE(e) {
	wl(e).length && !gE(e) && await EE(e);
}
//#endregion
//#region src/app/install.ts
var OE = class extends Error {
	constructor(e) {
		super(J("presets.apUpdating", { name: Up(e) })), this.name = "ApUpdating";
	}
}, kE = (e) => e instanceof OE;
function AE(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
var jE = "advancedPreset.pendingInstall";
function ME(e, t) {
	try {
		sessionStorage.setItem(jE, JSON.stringify({
			artifact: e,
			...t ? { source: t } : {}
		}));
	} catch (e) {
		console.warn("[AP] could not keep the preset for after the update", e);
	}
}
async function NE(e, t) {
	let n = Dp(e);
	if (!n) throw Error(J("presets.invalid"));
	if (n.minAdvancedPreset && gu("1.12.0", n.minAdvancedPreset) < 0) throw await tx(n.minAdvancedPreset, Up(n)) ? (ME(n, t), new OE(n)) : Error(J("presets.tooNew", { version: n.minAdvancedPreset }));
	await CE(n, Mp(n.id)), await wE(n, Mp(n.id)), Np(n), t && (G().sources[n.id] = t), G().declinedUpdates?.[n.id] && delete G().declinedUpdates[n.id], K();
	let r = Mp(n.id) ?? n;
	return eh(r), kp(r.id)?.source === "installed" && await DE(r), await gh(r), await eE(r), r;
}
async function PE(e) {
	let t = await S(AE(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return t.json();
}
async function FE(e, t = !0) {
	return NE(await PE(e), t ? e.trim() : void 0);
}
async function IE(e) {
	return NE(JSON.parse(await e.text()));
}
function LE(e) {
	if (kp(e)?.source !== "installed") return;
	let t = G().sources[e];
	if (t) return {
		url: t,
		remembered: !0
	};
	let n = Mp(e)?.updateUrl;
	return Fd(n) ? {
		url: n.trim(),
		remembered: !1
	} : void 0;
}
async function RE(e) {
	let t = LE(e);
	if (!t) throw Error(J("presets.noSource"));
	return FE(t.url, t.remembered);
}
async function zE() {
	for (let { preset: e } of Op()) {
		let t = LE(e.id);
		if (!t) continue;
		let n;
		try {
			n = Dp(await PE(t.url));
		} catch (n) {
			console.warn("[AP] preset update check failed", e.id, t.url, n);
			continue;
		}
		if (!n || n.id !== e.id) console.warn("[AP] the update source does not hold this preset", e.id, t.url);
		else if (!(gu(n.version, e.version) <= 0 || G().declinedUpdates?.[n.id] === n.hash)) try {
			let e = await NE(n, t.remembered ? t.url : void 0);
			x("success", J("presets.autoUpdated", { version: e.version }), Up(e));
		} catch (t) {
			if (kE(t)) return;
			yE(t) ? (G().declinedUpdates = {
				...G().declinedUpdates,
				[n.id]: n.hash
			}, K(), x("info", t.message, Up(n))) : console.warn("[AP] preset update failed", e.id, t);
		}
	}
}
async function BE() {
	let e = sessionStorage.getItem(jE);
	if (!e) return;
	sessionStorage.removeItem(jE);
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	try {
		let e = await NE(t.artifact, t.source);
		x("success", J("presets.installed"), Up(e));
	} catch (e) {
		if (kE(e)) return;
		yE(e) ? x("info", e.message, J("app.name")) : x("error", e instanceof Error ? e.message : String(e), J("app.name"));
	}
}
function VE() {
	let e = [];
	for (let [t, n] of Object.entries(G().installed)) {
		let r = Lp(t), i = Dp(n);
		!r || !i || gu(r.version, i.version) <= 0 || (Pp(t), delete G().sources[t], G().declinedUpdates?.[t] && delete G().declinedUpdates[t], e.push(r));
	}
	return e;
}
async function HE(t) {
	if (Pp(t), delete G().sources[t], G().declinedUpdates?.[t] && delete G().declinedUpdates[t], K(), Ip(t)) {
		let e = Mp(t);
		e && (eh(e), await gh(e), await eE(e));
		return;
	}
	let n = mh(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/app/st-preset-io.ts
var UE = "openai_preset_import_file", WE = "export_oai_preset";
function GE(e) {
	let t = Vd(e);
	return typeof t == "object" && !!t && typeof t.id == "string" && Array.isArray(t.entries);
}
var KE = /* @__PURE__ */ new WeakSet();
async function qE(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (GE(n)) {
		e.value = "";
		try {
			let e = await NE(n);
			await yh(e), LS(), x("success", J("presets.installed"), Up(e)), US("presets");
		} catch (e) {
			yE(e) || kE(e) ? x("info", e.message, J("app.name")) : x("error", e instanceof Error ? e.message : String(e), J("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		KE.add(t), e.dispatchEvent(t);
	}
}
function JE() {
	let e = dh(), t = e ? Mp(e) : void 0;
	return t ? (nE(t).catch((e) => x("error", e instanceof Error ? e.message : String(e), J("app.name"))), !0) : !1;
}
function YE() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== UE || KE.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), qE(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${WE}`) && JE() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/app/preset-files.ts
var XE = () => e().getPresetManager("openai");
function ZE() {
	let e = XE()?.getPresetList();
	return e ? Object.entries(e.preset_names).flatMap(([t, n]) => {
		let r = Bd(e.presets[n]);
		return r ? [{
			name: t,
			artifact: r.artifact
		}] : [];
	}) : [];
}
async function QE(e, t) {
	let n = tf(t);
	if (!n) {
		console.warn("[AP] preset file in an unsupported format", e);
		return;
	}
	if (n.minAdvancedPreset && gu("1.12.0", n.minAdvancedPreset) < 0) {
		await tx(n.minAdvancedPreset, Up(n)) || console.warn("[AP] preset file needs a newer Advanced Preset", e, n.minAdvancedPreset);
		return;
	}
	let r = G().declinedPresetFiles ?? {};
	if (r[e] === n.hash) return;
	let i = Mp(n.id);
	if (!i || i.hash !== n.hash && gu(n.version, i.version) >= 0) try {
		await NE(n);
	} catch (t) {
		yE(t) ? (G().declinedPresetFiles = {
			...r,
			[e]: n.hash
		}, K(), x("info", t.message, Up(n))) : x("error", t instanceof Error ? t.message : String(t), e);
		return;
	}
	let a = Mp(n.id), o = XE();
	if (!a || !o) return;
	let s = await gh(a, { select: o.getSelectedPresetName() === e });
	if (s !== e && await o.deletePreset(e), r[e]) {
		let { [e]: t, ...n } = r;
		G().declinedPresetFiles = n, K();
	}
	LS(), x("success", J("presetFile.adopted", {
		file: e,
		carrier: s
	}), Up(a));
}
var $E = Promise.resolve();
function eD(e) {
	return $E = $E.then(async () => {
		for (let { name: t, artifact: n } of ZE()) if (e === void 0 || t === e) try {
			await QE(t, n);
		} catch (e) {
			console.error("[AP] preset file adoption failed", t, e);
		}
	}), $E;
}
function tD() {
	let e = XE()?.getSelectedPresetName();
	e && ZE().some((t) => t.name === e) && eD(e);
}
//#endregion
//#region src/app/quick-replies.ts
function nD(e) {
	let t = Wm(e), n = (n) => e.actors[n] ? md(e, t, n) : void 0, r = Vp(e)?.quickReplySets;
	return (e.quickReplySets ?? []).map((e) => ({
		decl: e,
		st: xp(e, n, r?.[e.id])
	}));
}
function rD(e) {
	let t = JSON.stringify(e), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function iD(e, t) {
	let n = e.getSetByName(t.name);
	if (n) {
		n.disableSend = t.disableSend, n.placeBeforeInput = t.placeBeforeInput, n.injectInput = t.injectInput, n.color = t.color, n.onlyBorderColor = t.onlyBorderColor;
		for (let e of n.qrList) e.unrender?.(), e.unrenderSettings?.();
		n.qrList.splice(0);
		for (let e of t.qrList) n.addQuickReply(q(e));
		n.updateColor?.(), n.rerender?.(), n.save();
	}
}
var aD = /* @__PURE__ */ new Set();
async function oD(e, t, n) {
	let r = G().quickReplies ??= {}, i = (t) => e.listGlobalSets().includes(t), a = (t) => {
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
		let n = t.sets.filter(({ st: t }) => !e.getSetByName(t.name) || r[t.name] ? !0 : (aD.has(t.name) || (aD.add(t.name), x("warning", J("quickReplies.conflict", { name: t.name }), J("app.name"))), !1)), a = /* @__PURE__ */ new Set();
		for (let { st: t } of n) e.getSetByName(t.name) || (await e.createSet(t.name, {
			disableSend: t.disableSend,
			placeBeforeInput: t.placeBeforeInput,
			injectInput: t.injectInput
		}), a.add(t.name));
		for (let { st: i } of n) {
			let n = rD(i);
			(a.has(i.name) || r[i.name]?.hash !== n) && (iD(e, i), r[i.name] = {
				presetId: t.presetId,
				hash: n
			}, o = !0);
		}
		for (let { decl: t, st: r } of n) t.global && !i(r.name) && e.addGlobalSet(r.name, t.visible);
	}
	o && K();
}
function sD() {
	let e = W(() => {
		let e = G().enabled ? RS.value : void 0, t = e ? nD(e) : [], n = Op().map((e) => e.preset);
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
	P(() => e.value.key, () => {
		let n = _();
		if (!n) return;
		let { active: r, known: i } = e.value;
		t = t.then(() => oD(n, r, i)).catch((e) => console.error("[AP] Quick Reply sync failed", e));
	}, { immediate: !0 });
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var cD = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b / 1)}}", lD = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.switch.sm{width:1.8em;height:1.05em}.switch.sm .thumb{width:.75em;height:.75em;top:.15em;left:.15em}.switch.sm input:checked~.thumb{transform:translate(.75em)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", uD = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}.storyline-badge svg.lucide.storyline-hidden{color:var(--ap-muted)}", dD = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.tab span{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-groups{gap:var(--ap-space-2);flex-direction:column;display:flex}.um-groups.um-dragging,.um-groups.um-dragging *{cursor:grabbing;-webkit-user-select:none;user-select:none}.um-group{padding:2px var(--ap-space-2) 4px;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:background .15s,border-color .15s;display:flex}.um-group.collapsed{padding-bottom:2px}.um-group.dragging{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.um-group-head{align-items:center;gap:2px;min-height:2.2em;margin-left:-4px;display:flex}.um-group-head>.um-grip{margin-left:0}.um-chevron svg.lucide{transition:transform .15s}.um-chevron.open svg.lucide{transform:rotate(90deg)}.um-group-name{text-overflow:ellipsis;flex:6em;font-weight:600}.um-group-count{background:var(--ap-surface-2);text-align:center;border-radius:999px;flex:none;min-width:1.6em;padding:0 .4em;line-height:1.6}.um-group-confirm{align-items:center;gap:2px var(--ap-space-2);padding:4px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 8%, transparent);flex-wrap:wrap;display:flex}.um-group-confirm>span{flex:100%}.um-group-confirm .btn.danger{color:var(--ap-danger)}.um-group .um-list{margin:0 calc(-1 * var(--ap-space-2) + 1px)}.um-group .um-picker{margin:2px 0 4px}.um-drop{min-height:2.4em;margin:0 var(--ap-space-2);border:1px dashed var(--ap-border);border-radius:var(--ap-radius-sm);justify-content:center;align-items:center;display:flex}.um-radio{cursor:pointer;background:0 0;border:0;place-items:center;width:2.2em;height:1.6em;padding:0;display:inline-grid}.um-radio .radio{border:1.5px solid var(--ap-faint);border-radius:50%;place-items:center;width:1.05em;height:1.05em;transition:border-color .15s;display:grid}.um-radio:hover .radio,.um-radio.on .radio{border-color:var(--ap-primary)}.um-radio.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.52em;height:.52em}.um-move{max-width:12em;position:relative;overflow:hidden}.um-move select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry>*,.um-entry-head>*{transition:opacity .15s}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>.switch{margin-right:6px}.um-entry.off .um-entry-head>:not(.switch),.um-entry.off>:not(.um-entry-head){opacity:.55}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text,.um-var-key,.um-var-value{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-text{field-sizing:content;min-height:5.5em;max-height:24em}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:auto 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row>.switch{margin:calc(.375em + 1px) 4px 0 0}.um-var-pair{padding:2px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:2px;display:flex}.um-var-pair-head{align-items:center;gap:2px;margin-right:-6px;display:flex}.um-var-key{text-overflow:ellipsis;flex:auto;min-width:0;font-weight:600}.um-var-row>*,.um-var-pair>*,.um-var-pair-head>*{transition:opacity .15s}.um-var-row.off>:not(.switch),.um-var-pair.off>:not(.um-var-pair-head),.um-var-pair.off .um-var-pair-head>:not(.switch){opacity:.55}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=420px){.tabs.many .tab span{display:none}.tabs.many .tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tabs.many .tab svg.lucide{width:1.35em;height:1.35em}}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:calc(2.51429em + 8px)}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storylines-head{gap:var(--ap-space-2);min-height:1.6em;padding:0 var(--ap-space-1) 0 var(--ap-space-3)}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-card.hidden .card-title{color:var(--ap-muted)}.storyline-dot{background:var(--ap-primary);border-radius:50%;flex:none;width:.5em;height:.5em}.storyline-flag{width:1.05em;height:1.05em;color:var(--ap-faint);flex:none}.storyline-toolbar{margin-bottom:var(--ap-space-1);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);align-self:flex-start;align-items:center;gap:2px;padding:2px;display:flex}.storyline-toolbar .icon-btn[aria-pressed=true]{background:var(--ap-tint)}.storyline-toolbar.solo{padding:0}.storyline-toolbar.solo .icon-btn.sm{width:calc(1.6em - 2px);height:calc(1.6em - 2px)}.storyline-toolbar-sep{background:var(--ap-border);align-self:stretch;width:1px;margin:3px 2px}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", fD = ".media-conn{gap:var(--ap-space-3)}.media-advanced{gap:var(--ap-space-3);flex-direction:column;display:flex}.media-advanced-toggle{color:var(--ap-muted);align-self:flex-start;gap:4px}.media-refs{gap:var(--ap-space-2)}.media-ref{align-items:center;gap:var(--ap-space-2);min-width:0;display:flex}.media-ref-group{gap:var(--ap-space-2)}.media-ref-group-title{color:var(--ap-muted);font-size:.85em;font-weight:600}.media-ref-thumb{object-fit:cover;border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);flex:none;width:2.6em;height:2.6em}.blob-placeholder{background:var(--ap-surface-2);display:inline-block}.image-card{gap:var(--ap-space-2);display:grid}.image-card.multi{grid-template-columns:repeat(auto-fill,minmax(min(100%,14em),1fr))}.image-figure{flex-direction:column;gap:4px;min-width:0;margin:0;display:flex}.image-frame{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);position:relative;overflow:hidden}.image-frame.empty{border:1px dashed var(--ap-border);background:0 0;max-height:22em}.image-open{cursor:zoom-in;background:0 0;border:0;width:100%;padding:0;display:block}.image-open img{object-fit:contain;width:100%;height:auto;max-height:70vh;display:block}.image-empty{justify-content:center;align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3);text-align:center;flex-direction:column;display:flex;position:absolute;inset:0}.image-empty>svg.lucide{width:1.6em;height:1.6em}.image-prompt{-webkit-line-clamp:6;white-space:pre-wrap;-webkit-box-orient:vertical;max-height:100%;margin:0;display:-webkit-box;overflow:hidden}.image-busy{justify-content:center;align-items:center;gap:var(--ap-space-2);color:var(--ap-text);background:color-mix(in srgb, var(--ap-panel-bg-solid) 70%, transparent);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:flex;position:absolute;inset:0}.image-pager{border-radius:var(--ap-radius-pill);color:#fff;background:#00000073;align-items:center;gap:2px;padding:0 4px;display:flex;position:absolute;bottom:6px;right:6px}.image-pager .icon-btn{color:inherit}.image-foot{align-items:center;gap:var(--ap-space-2);min-height:1.9em;display:flex}.image-error{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.image-tools{flex:none}.image-panel{gap:var(--ap-space-3)}.image-panel-prompt{resize:vertical;min-height:6em}.image-panel-ref{cursor:pointer}.image-panel-row{align-items:flex-start;gap:var(--ap-space-3);flex-wrap:wrap}.image-panel-row>.field:first-child{flex:none}.image-panel-row>.field.grow{flex:12em;min-width:0}.image-versions{gap:var(--ap-space-2);grid-template-columns:repeat(auto-fill,minmax(7em,1fr));display:grid}.image-version{flex-direction:column;gap:2px;min-width:0;display:flex}.image-version-pick{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);cursor:pointer;aspect-ratio:1;border:2px solid #0000;padding:0;display:block;overflow:hidden}.image-version-pick img,.image-version-pick .blob-placeholder{object-fit:cover;width:100%;height:100%;display:block}.image-version.on .image-version-pick{border-color:var(--ap-primary)}.image-version-tools{justify-content:space-between;display:flex}.image-panel-status{align-items:center}.image-panel-actions{flex-wrap:wrap}.image-panel-restore{margin-inline-end:auto}.image-viewer{color:#fff;background:0 0;border:0;flex-direction:column;justify-content:center;align-items:center;width:100vw;max-width:100vw;height:100vh;max-height:100vh;margin:0;padding:0;display:flex}.image-viewer:not([open]){display:none}.image-viewer::backdrop{background:#000000d1}.image-viewer-img{object-fit:contain;-webkit-user-select:none;user-select:none;max-width:96vw;max-height:calc(100vh - 4.5em)}.image-viewer-bar{align-items:center;gap:var(--ap-space-2);width:min(96vw,60em);padding:var(--ap-space-2);display:flex}.image-viewer-bar .icon-btn{color:#fff}.image-viewer-caption{opacity:.85}.media-dialog{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);width:min(44em,100vw - 2em);max-height:calc(100dvh - 2em);color:var(--ap-text);background:var(--ap-panel-bg-solid);box-shadow:var(--ap-shadow);padding:0;overflow:hidden}.media-dialog:not([open]){display:none}.media-dialog::backdrop{background:#00000073}.media-dialog-box{max-height:inherit;flex-direction:column;display:flex}.media-dialog-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-2) var(--ap-space-2) var(--ap-space-2) var(--ap-space-3);border-bottom:1px solid var(--ap-border);display:flex}.media-dialog-body{min-height:0;padding:var(--ap-space-3);flex:auto;overflow:auto}@media (max-width:600px){.media-dialog{border:0;border-radius:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;margin:0}.media-dialog-box{height:100%}}.speech-card{align-items:center;gap:var(--ap-space-2);min-height:2em;padding:0 var(--ap-space-1,4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--ap-primary) 5%, transparent);display:flex}.speech-track{flex:auto;align-items:center;gap:2px;min-width:3em;height:1.4em;display:flex}.speech-seg{background:var(--ap-border);cursor:pointer;border:0;border-radius:2px;flex:1 1 0;min-width:3px;height:4px;padding:0;transition:height .12s,background .12s}.speech-seg.narration{opacity:.6}.speech-seg.ready{background:color-mix(in srgb, var(--ap-primary) 45%, transparent)}.speech-seg.loading{background:color-mix(in srgb, var(--ap-primary) 30%, transparent);animation:1.2s ease-in-out infinite ap-pulse}.speech-seg.error{background:var(--ap-danger)}.speech-seg.on{background:var(--ap-primary);opacity:1;height:8px}.speech-seg:hover{height:8px}.speech-who{flex:0 auto;max-width:8em}.speech-panel{gap:var(--ap-space-2);flex-direction:column;display:flex}.speech-panel-bar{flex-wrap:wrap;align-items:center;gap:4px;display:flex}.speech-panel-bar>.btn{margin-right:4px}.speech-panel-format{align-items:center;gap:4px;margin:0;display:flex}.speech-panel-list{gap:var(--ap-space-2);flex-direction:column;margin:0;padding:0;list-style:none;display:flex}.speech-panel-seg{padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);flex-direction:column;gap:4px;transition:border-color .15s,background .15s;display:flex}.speech-panel-seg.narration{background:var(--ap-surface-2)}.speech-panel-seg.playing{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.speech-panel-seg.error{border-color:color-mix(in srgb, var(--ap-danger) 45%, transparent)}.speech-panel-head{align-items:center;gap:var(--ap-space-2);min-width:0;margin-left:-4px;display:flex}.speech-panel-who{flex:0 auto;max-width:12em}.speech-panel-state{flex:none}.speech-panel-display{white-space:pre-wrap;margin:0}.speech-panel-text{field-sizing:content;min-height:2.6em;max-height:14em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.speech-panel-seg.edited .speech-panel-text{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.speech-panel-actions{align-items:center;gap:4px;min-height:1.9em;margin-right:-4px;display:flex}.speech-panel-actions .btn{min-height:1.9em;font-size:var(--ap-font-size-sm);padding:0 .8em}.voice-ask{width:min(26em,100vw - 2em);padding:var(--ap-space-3);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);color:var(--ap-text);background:var(--ap-panel-bg-solid);box-shadow:var(--ap-shadow)}.voice-ask::backdrop{background:#0006}.speech-binding{align-items:flex-start;gap:var(--ap-space-2);min-width:0;display:flex}.speech-binding>.input:first-child{flex:0 9em;min-width:5em}.speech-voice{flex:auto;align-items:center;gap:4px;min-width:0;display:flex}.speech-voice>.input{flex:auto;min-width:0}.voice-menu{z-index:2147482000;border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-panel-bg-solid);max-height:min(16em,50vh);color:var(--ap-text);box-shadow:var(--ap-shadow);margin:0;padding:4px;position:fixed;inset:0 auto auto 0;overflow:auto}.voice-option{align-items:center;gap:var(--ap-space-2);min-height:2em;padding:2px var(--ap-space-2);border-radius:var(--ap-radius-sm);cursor:pointer;display:flex}.voice-option.on{background:var(--ap-surface-2)}.voice-option .col{gap:0;line-height:1.3}.voice-menu-note{padding:4px var(--ap-space-2);align-items:center;display:flex}.image-open .blob-placeholder{width:100%;min-height:8em;display:block}", pD = /* @__PURE__ */ fn({ mode: "light" }), mD = new CSSStyleSheet();
mD.replaceSync([
	cD,
	lD,
	uD,
	dD,
	fD
].join("\n"));
var hD = new CSSStyleSheet(), gD = [mD, hD], _D = [
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
function vD(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of _D) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function yD(e) {
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
function bD() {
	let e = yD(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var xD = /* @__PURE__ */ new Set();
function SD(e) {
	return xD.add(e), e.dataset.apTheme = pD.mode, () => xD.delete(e);
}
function CD() {
	let e = bD();
	if (e !== pD.mode) {
		pD.mode = e;
		for (let t of xD) t.dataset.apTheme = e;
	}
}
function wD() {
	pD.mode = bD();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(CD);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), hr(() => {
		let e = RS.value?.theme?.[pD.mode] ?? {}, t = G().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(vD(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(vD("primary", t.primary)), t.accent && n.push(vD("accent", t.accent)), hD.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function TD(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function ED(e, t, n = []) {
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
			e.adoptedStyleSheets = gD, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = SD(this), this.app = Ss(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/annotations/match.ts
var DD = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, OD = /\s/, kD = /[“”„‟〝〞＂「」]/, AD = /[‘’‚‛『』＇]/;
function jD(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!DD.test(i)) {
			if (OD.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else kD.test(i) ? i = "\"" : AD.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var MD = (e) => jD(e).text;
function ND(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function PD(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function FD(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function ID(e, t, n, r = jD(e)) {
	let i = MD(n.quote).trim();
	if (!i) return null;
	let a = ND(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = MD(n.prefix), s = MD(n.suffix), c = 0, l = a.map((t) => {
			let n = PD(e, r.text.slice(Math.max(0, t - e.length), t)) + FD(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = ND(MD(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function LD(e, t, n = !1) {
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
var RD = /* @__PURE__ */ new Set([
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
function zD(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (RD.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = zD(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function BD(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? RD.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && zD(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function VD(e, t, n, r = BD(e)) {
	let i = r.map((e) => e.data), a = i.join(""), o = jD(a), s = [];
	for (let e of n) {
		let n = ID(a, t, e, o);
		n && s.push({
			item: e,
			start: LD(i, n[0]),
			end: LD(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function HD(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var UD = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function WD(e, t, n) {
	let r = [...e.located].sort((e, t) => UD(e.start, t.start) ? 1 : UD(t.start, e.start) ? -1 : 0), i = null;
	for (let a of r) if (!(i && UD(i, a.end))) {
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
function GD(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/layer.ts
var KD = 0;
function qD(e, t) {
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
var JD = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function YD(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
var XD = class {
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
				let i = [...r.getClientRects()].find((e) => JD(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
				return {
					key: n.key,
					mesId: n.mesId,
					item: n.item,
					rect: qD(i, e.doc),
					doc: e.doc
				};
			}
		}
		for (let r of e.owners.values()) for (let i of r) {
			let r = i.range;
			if (r && !r.collapsed && r.intersectsNode(n)) {
				for (let n of r.getClientRects()) if (JD(n, t.clientX, t.clientY)) return {
					key: i.key,
					mesId: i.mesId,
					item: i.item,
					rect: qD(n, e.doc),
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
			serial: ++KD,
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
				let t = HD(o, e);
				r.highlight.add(t), c.push({
					key: s(e.item),
					mesId: n,
					item: e.item,
					range: t
				});
			}
			else if (i) {
				let e = /* @__PURE__ */ new Map();
				WD(o, this.spec.name, (t, i) => {
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
				for (let e of t) r.add(e.key), e.range && (i.highlight?.delete(e.range), i.on?.delete(e.range)), e.wraps && GD(e.wraps);
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
}, ZD = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), QD = /* @__PURE__ */ new Set([
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
]), $D = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function eO(e) {
	return $D(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function tO(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${eO(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${eO(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${eO(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function nO(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = nO(e, t);
			n && i.appendChild(n);
		}
	};
	if (!ZD.has(r) && !QD.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = nO(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function rO(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return tO(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", tO(e.textContent));
			continue;
		}
		let t = nO(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function iO(e, t, n, r) {
	return e && Vp(e)?.workflows?.[t]?.stages?.[n] || r;
}
function aO(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return TD(e?.actors[t]?.color, n);
}
function oO(e) {
	return W(() => {
		let t = e(), n = VS(t), r = Nb(t, BS(t));
		if (r && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Mp(r.presetId);
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
					label: iO(e, r.workflow, t.id, t.label),
					color: aO(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = Mp(n.presetId);
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
				label: iO(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: aO(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var sO = /* @__PURE__ */ fn({
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
}), cO, lO, uO = null;
function dO(t) {
	let n = Mp(gm(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = md(n, Wm(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: aO(n, n.narrator)
	};
}
function fO(e, t) {
	clearTimeout(cO), clearTimeout(lO), lO = void 0, uO = null, sO.key !== e.key && Object.assign(sO, dO(e.mesId), { html: rO(e.ann.comment) }), Object.assign(sO, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), sO.rev++;
}
function pO() {
	clearTimeout(cO), clearTimeout(lO), lO = void 0, uO = null, sO.open && (sO.open = !1, sO.pinned = !1, sO.key = null);
}
function mO(e) {
	if (!sO.pinned) {
		if (e) {
			if (sO.open && sO.key === e.key) {
				clearTimeout(lO), lO = void 0;
				return;
			}
			if (uO === e.key) return;
			clearTimeout(cO), uO = e.key, cO = setTimeout(() => fO(e, !1), 150);
		} else clearTimeout(cO), uO = null, _O();
	}
}
function hO(e) {
	e && !(sO.open && sO.key === e.key) ? fO(e, !0) : pO();
}
function gO() {
	clearTimeout(lO), lO = void 0;
}
function _O() {
	!sO.open || sO.pinned || lO || (lO = setTimeout(pO, 200));
}
function vO(e) {
	sO.key && e.has(sO.key) && pO(), uO && e.has(uO) && (clearTimeout(cO), uO = null);
}
//#endregion
//#region src/ui/annotations/paint.ts
var yO = "#a855f7", bO = () => null;
function xO(e) {
	bO = e;
}
function SO(e) {
	let t = bO();
	return !!(t && e.composedPath().includes(t));
}
var CO = "ap-anno", wO = new XD({
	name: CO,
	priority: 1,
	css() {
		let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
		return `:root { --ap-anno-color: ${yO}; }
::highlight(${CO}) { ${e} }
${CO} { ${e} text-decoration-skip-ink: none; cursor: help; }`;
	},
	id: (e) => e.id,
	move: (e) => mO(e && {
		key: e.key,
		mesId: e.mesId,
		ann: e.item,
		rect: e.rect
	}),
	click(e, t) {
		t === "mouse" ? e || pO() : hO(e && {
			key: e.key,
			mesId: e.mesId,
			ann: e.item,
			rect: e.rect
		});
	},
	scroll: pO,
	leave: () => mO(null),
	ignore: SO,
	forget: vO
});
function TO(e) {
	e !== yO && (yO = e, wO.restyle());
}
var EO = () => yO, DO = (e) => wO.watch(e), OO = "ap-speech", kO = "data-ap-speech-hover", AO = new XD({
	name: OO,
	priority: 0,
	css() {
		let e = EO(), t = `text-decoration-line: underline; text-decoration-style: solid; text-decoration-color: color-mix(in srgb, ${e} 60%, transparent); text-decoration-thickness: max(1px, 0.07em); text-underline-offset: 0.3em;`, n = `background-color: color-mix(in srgb, ${e} 16%, transparent);`;
		return `::highlight(${OO}) { ${t} }
::highlight(${OO}-on) { ${n} }
${OO} { ${t} text-decoration-skip-ink: none; cursor: pointer; }
${OO}[data-on] { ${n} }
html[${kO}], html[${kO}] * { cursor: pointer !important; }`;
	},
	id: (e) => e.id,
	move(e, t) {
		t.documentElement.toggleAttribute(kO, !!e);
	},
	leave() {
		document.documentElement.removeAttribute(kO);
	},
	click(e, t, n) {
		e && (e.doc.getSelection()?.toString() || (n.preventDefault(), TT(e.mesId, e.item.id)));
	}
}), jO = 6, MO = 8;
function NO(e, t, n, r = "center", i = !1) {
	let a = e.top - jO - t.height >= MO, o = e.bottom + jO + t.height <= n.height - MO, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - jO - t.height : e.bottom + jO;
	c = Math.max(MO, Math.min(c, n.height - MO - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(MO, Math.min(l, n.width - MO - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function PO(e, t) {
	let n = /* @__PURE__ */ j(!1), r = /* @__PURE__ */ j(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = NO(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return P(n, async (e) => {
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
var FO = {
	key: 0,
	class: "anno-author"
}, IO = ["innerHTML"], LO = /* @__PURE__ */ F({
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
			let r = e.getBoundingClientRect(), i = sO.rect, a = NO(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return P(() => sO.open && sO.rev, async (e) => {
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
			sO.open = !1;
		}), (e, n) => M(sO).open ? (R(), z("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Ie({ "--actor": M(sO).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => M(gO) && M(gO)(...e),
			onMouseleave: n[1] ||= (...e) => M(_O) && M(_O)(...e)
		}, [M(sO).author ? (R(), z("div", FO, A(M(sO).author), 1)) : U("", !0), V("div", {
			class: "rich anno-text",
			innerHTML: M(sO).html
		}, null, 8, IO)], 36)) : U("", !0);
	}
}), RO = /* @__PURE__ */ new Set();
function zO(e) {
	return $w(e).length ? CC(e).filter((e) => !e.orphan) : [];
}
function BO(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var VO = () => G().ui.annotations?.show !== !1, HO = class {
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
		}), RO.add(this), this.schedule(0);
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
		wO.clear(this, e), AO.clear(this, e);
	}
	refresh() {
		if (this.disposed) return;
		if (!this.el.isConnected) {
			this.clear();
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = kb.current, i = r?.status === "running" && r.mesId === t, a = !(!n || n.is_user || i), o = a && VO() ? _C(t).filter((e) => !e.orphan) : [], s = a ? zO(t) : [], c = n?.mes ?? "", l = (e, n, r, i, a) => e.paint(this, r, t, n.length ? () => VD(i, c, n) : null, a);
		l(wO, o, document, this.el, !YD(document)), l(AO, s, document, this.el, !YD(document));
		for (let e of this.frames.values()) {
			let t = e.doc;
			if (!t?.body || !t.defaultView) continue;
			let n = BO(t);
			l(wO, n ? [] : o, t, t.body, !1), l(AO, n ? [] : s, t, t.body, !1), e.observer?.takeRecords();
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), this.clear(), RO.delete(this);
		}
	}
};
function UO(e, t) {
	for (let n of RO) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function WO() {
	for (let e of RO) e.hasFrames && e.schedule(0);
}
function GO() {
	for (let e of RO) e.el.isConnected || e.dispose();
}
var KO = /* @__PURE__ */ new WeakMap();
function qO(e) {
	let t = KO.get(e);
	(!t || t.disposed) && KO.set(e, new HO(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var JO = () => window.__TAURITAVERN__?.api?.chatSurface, YO = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return JO()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), XO = !1;
function ZO() {
	let t = JO();
	!XO && t && YO() && (t.protocolVersion === 1 ? (XO = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new HO(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function QO(e, t) {
	t && !YO() && qO(e);
}
var $O = null;
function ek() {
	return (!$O || !$O.isConnected) && ($O = document.createElement("ap-anno-bubble"), document.body.append($O)), $O;
}
function tk() {
	ED("ap-anno-bubble", LO), ek(), xO(() => $O), DO(document), hr(() => {
		let e = G().ui, t = RS.value?.theme?.[pD.mode]?.accent;
		TO(e.annotations?.color || e.accent || t || (pD.mode === "dark" ? "#c084fc" : "#9333ea")), AO.restyle();
	}), P(() => {
		let e = bx().speech;
		return [
			e.enabled,
			e.active,
			e.narrator,
			e.connections.length
		];
	}, () => UO(void 0, 0)), P(() => X.playing && `${X.playing.mesId}:${X.playing.segId}`, () => {
		let e = X.playing;
		AO.mark(e ? (t, n) => t === e.mesId && n.id === e.segId : null);
	}), EC.on("change", (e) => UO(e)), P(VO, () => {
		pO(), UO(void 0, 0);
	}), P(() => kb.current?.status, () => UO()), bC.on("change", (e) => UO(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		pO(), GO();
	});
	t.on("message_iframe_render_ended", () => WO()), addEventListener("resize", () => pO());
}
//#endregion
//#region src/ui/storylines.ts
var nk = W(() => {
	Y.chatRev;
	let e = RS.value;
	return !!(e && X_(e, Wm(e)));
}), rk = null;
function ik() {
	let t = e().chat ?? [];
	return (!rk || rk.rev !== Y.chatRev || rk.chat !== t || rk.len !== t.length) && (rk = {
		rev: Y.chatRev,
		chat: t,
		len: t.length,
		keys: $_(t)
	}), rk.keys;
}
var ak = () => {
	rk = null;
}, ok = 60, sk = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > ok ? `${t.slice(0, ok)}…` : t;
};
function ck(t) {
	Y.chatRev;
	let n = e().chat ?? [], r = ik(), i = Z_(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? gm(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: sk(s?.event || om(o))
			});
		}), {
			key: e,
			name: tm(e, i),
			main: e === "",
			if: $p(e, i),
			hidden: em(e, i),
			pending: Yp(e),
			current: e === o,
			floors: a
		};
	}).filter((e) => e.main || e.floors.length);
}
async function lk(t) {
	let n = e(), r = document.querySelector(`#chat > .mes[mesid="${t}"]`);
	r ? r.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}) : n.executeSlashCommandsWithOptions && await n.executeSlashCommandsWithOptions(`/chat-jump ${t}`, { handleExecutionErrors: !0 });
}
//#endregion
//#region src/ui/storyline-tag.ts
var uk = "data-ap-storyline-tag", dk = "ap-storyline-tag-hidden";
function fk(e, t, n) {
	let r = e.querySelectorAll(`[${uk}]`);
	if (r.length) {
		for (let e of r) e.classList.toggle(dk, n);
		return;
	}
	if (!n || !t?.is_user) return;
	let i = ed(t.mes);
	if (!i) return;
	let a = t.mes.slice(i.at).trim(), o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = null;
	for (; o.nextNode();) o.currentNode.textContent?.trim() && (s = o.currentNode);
	if (!s) return;
	let c = s.parentElement, l = s.textContent ?? "", u = a.slice(1);
	if (c && c !== e && /^H[1-6]$/.test(c.tagName) && c.textContent?.trim() === u) {
		c.setAttribute(uk, ""), c.classList.add(dk);
		return;
	}
	let d = l.trimEnd();
	if (!d.endsWith(a)) return;
	let f = d.length - a.length, p = s.splitText(f), m = document.createElement("span");
	m.setAttribute(uk, ""), m.className = dk, p.replaceWith(m), m.append(p);
}
//#endregion
//#region src/ui/mounts.ts
var pk = "ap-hidden", mk = [
	"meta-pure",
	"impersonate",
	"summary"
];
function hk(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function gk(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = gm(a), s = !!Nb(n, a);
	a && !a.is_user && QO(i, !!(o?.annotations?.length || o?.speech?.length || s));
	let c = nk.value;
	fk(i, a, c);
	let l = !(!a || a.is_user || !o && !s), u = r.querySelector(":scope > ap-stages"), d = r.querySelector(":scope > ap-top-cards"), f = r.querySelector(":scope > ap-cards");
	l ? ((!d || d.nextElementSibling !== i) && (d?.remove(), d = hk("ap-top-cards", n), d.setAttribute("position", "top"), i.before(d)), (!u || u.nextElementSibling !== d) && (u?.remove(), u = hk("ap-stages", n), d.before(u)), (!f || f.previousElementSibling !== i) && (f?.remove(), f = hk("ap-cards", n), i.after(f)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), f.getAttribute("mesid") !== String(n) && f.setAttribute("mesid", String(n)), i.classList.toggle(pk, !!(!s && o && mk.includes(o.turn))), _k(r, i, n, c)) : (u?.remove(), d?.remove(), f?.remove(), i.classList.remove(pk), _k(r, i, n, c));
}
function _k(e, t, n, r) {
	let i = e.querySelector(":scope > ap-storyline");
	if (!r || !ik()[n]) {
		i?.remove();
		return;
	}
	let a = e.querySelector(":scope > ap-stages") ?? e.querySelector(":scope > ap-top-cards") ?? t;
	i ||= hk("ap-storyline", n), i.nextElementSibling !== a && a.before(i), i.getAttribute("mesid") !== String(n) && i.setAttribute("mesid", String(n));
}
function vk(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) gk(t);
}
function yk() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var bk = 0, xk = /* @__PURE__ */ new Set(), Sk = !1;
function Ck(e) {
	e ? xk.add(e) : Sk = !0, !bk && (bk = requestAnimationFrame(() => {
		if (bk = 0, ak(), Sk) vk();
		else for (let e of xk) e.isConnected && gk(e);
		xk.clear(), Sk = !1, yk(), GO();
	}));
}
function wk() {
	IS(), Ck();
}
function Tk() {
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.CHAT_CHANGED,
		n.GROUP_UPDATED,
		n.MORE_MESSAGES_LOADED,
		n.MESSAGE_UPDATED,
		n.MESSAGE_EDITED,
		n.MESSAGE_SWIPED,
		n.MESSAGE_DELETED,
		n.CHARACTER_MESSAGE_RENDERED,
		n.USER_MESSAGE_RENDERED,
		"advanced_preset_message_updated"
	]) e && t.on(e, wk);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Ck(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Ck(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Ck();
	};
	r(), P(() => nk.value, () => wk());
	let i;
	P(() => kb.current && kb.current.status === "running" && kb.current.streaming && kb.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = kb.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (Mb(t, n), clearInterval(i), wk());
		}, 100));
	}), P(() => kb.current?.status, () => Ck());
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var Ek = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Dk = (e) => e === "", Ok = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), kk = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Ak = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), jk = (e) => {
	let t = Ak(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Mk = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, Nk = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = Mk.width, color: s = Mk.stroke, ...c }, { slots: l }) => qa("svg", {
	...Mk,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Dk(n) || Dk(r) || n === !0 || r === !0 ? Number(i || a || Mk["stroke-width"]) * 24 / Number(o) : i || a || Mk["stroke-width"],
	class: Ok("lucide", c.class, ...e ? [`lucide-${kk(jk(e))}-icon`, `lucide-${kk(e)}`] : ["lucide-icon"]),
	...!l.default && !Ek(c) && { "aria-hidden": "true" }
}, [...t.map((e) => qa(...e)), ...l.default ? [l.default()] : []]), Z = (e, t) => (n, { slots: r, attrs: i }) => qa(Nk, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), Pk = Z("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), Fk = Z("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), Ik = Z("audio-lines", [
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
]), Lk = Z("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), Rk = Z("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), zk = Z("brain", [
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
]), Bk = Z("bug", [
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
]), Vk = Z("cable", [
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
]), Hk = Z("calendar-days", [
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
]), Uk = Z("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Wk = Z("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), Gk = Z("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]), Kk = Z("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), qk = Z("circle-dashed", [
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
]), Jk = Z("circle-dot", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "1",
	key: "41hilf"
}]]), Yk = Z("circle-question-mark", [
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
]), Xk = Z("circle-slash", [["circle", {
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
}]]), Zk = Z("clapperboard", [
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
]), Qk = Z("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), $k = Z("cloud-fog", [
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
]), eA = Z("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), tA = Z("cloud-rain", [
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
]), nA = Z("cloud-sun", [
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
]), rA = Z("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), iA = Z("code-xml", [
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
]), aA = Z("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), oA = Z("coins", [
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
]), sA = Z("copy-plus", [
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
]), cA = Z("copy", [["rect", {
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
}]]), lA = Z("crown", [["path", {
	d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
	key: "1vdc57"
}], ["path", {
	d: "M5 21h14",
	key: "11awu3"
}]]), uA = Z("database-zap", [
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
]), dA = Z("download", [
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
]), fA = Z("drama", [
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
]), pA = Z("eye-off", [
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
]), mA = Z("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), hA = Z("feather", [
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
]), gA = Z("file-down", [
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
]), _A = Z("file-headphone", [
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
]), vA = Z("file-plus", [
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
]), yA = Z("file-stack", [
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
]), bA = Z("folder-plus", [
	["path", {
		d: "M12 10v6",
		key: "1bos4e"
	}],
	["path", {
		d: "M9 13h6",
		key: "1uhe8q"
	}],
	["path", {
		d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
		key: "1kt360"
	}]
]), xA = Z("folder", [["path", {
	d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
	key: "1kt360"
}]]), SA = Z("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), CA = Z("git-branch", [
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
]), wA = Z("git-compare-arrows", [
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
]), TA = Z("globe", [
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
]), EA = Z("grip-vertical", [
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
]), DA = Z("hard-drive", [
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
]), OA = Z("image-off", [
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
]), kA = Z("image-plus", [
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
]), AA = Z("images", [
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
]), jA = Z("info", [
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
]), MA = Z("layers", [
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
]), NA = Z("layout-template", [
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
]), PA = Z("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), FA = Z("list-music", [
	["path", {
		d: "M16 5H3",
		key: "m91uny"
	}],
	["path", {
		d: "M11 12H3",
		key: "51ecnj"
	}],
	["path", {
		d: "M11 19H3",
		key: "zflm78"
	}],
	["path", {
		d: "M21 16V5",
		key: "yxg4q8"
	}],
	["circle", {
		cx: "18",
		cy: "16",
		r: "3",
		key: "1hluhg"
	}]
]), IA = Z("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), LA = Z("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), RA = Z("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), zA = Z("message-square-dashed", [
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
]), BA = Z("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), VA = Z("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), HA = Z("network", [
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
]), UA = Z("notebook-pen", [
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
]), WA = Z("package", [
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
]), GA = Z("palette", [
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
]), KA = Z("pause", [["rect", {
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
}]]), qA = Z("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), JA = Z("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), YA = Z("play", [["path", {
	d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
	key: "10ikf1"
}]]), XA = Z("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), ZA = Z("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), QA = Z("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), $A = Z("refresh-cw", [
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
]), ej = Z("regex", [
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
]), tj = Z("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), nj = Z("save", [
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
]), rj = Z("scroll-text", [
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
]), ij = Z("server", [
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
]), aj = Z("shapes", [
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
]), oj = Z("sliders-horizontal", [
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
]), sj = Z("sliders-vertical", [
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
]), cj = Z("snowflake", [
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
]), lj = Z("sparkles", [
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
]), uj = Z("split", [
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
]), dj = Z("square", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}]]), fj = Z("sun", [
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
]), pj = Z("text-cursor-input", [
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
]), mj = Z("trash-2", [
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
]), hj = Z("triangle-alert", [
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
]), gj = Z("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), _j = Z("upload", [
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
]), vj = Z("user-pen", [
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
]), yj = Z("user-round", [["circle", {
	cx: "12",
	cy: "8",
	r: "5",
	key: "1hypcn"
}], ["path", {
	d: "M20 21a8 8 0 0 0-16 0",
	key: "rfgkzh"
}]]), bj = Z("volume-2", [
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
]), xj = Z("wand-sparkles", [
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
]), Sj = Z("wind", [
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
]), Cj = Z("workflow", [
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
]), wj = Z("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Tj = Z("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), Ej = /* @__PURE__ */ F({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(null), { open: r, bubble: i } = PO(n, () => t);
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
		}, A(e.text), 513)) : U("", !0)], 544));
	}
}), Dj = [
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
		return (t, n) => (R(), B(Ej, {
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
			}, [(R(), B($r(e.icon)))], 10, Dj)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), Oj = { class: "col tight" }, kj = { class: "speech-voice" }, Aj = ["title"], jj = { class: "ellipsis" }, Mj = [
	"value",
	"aria-label",
	"aria-expanded",
	"aria-activedescendant",
	"placeholder"
], Nj = ["aria-label"], Pj = [
	"id",
	"aria-selected",
	"onMouseenter",
	"onClick"
], Fj = { class: "col grow" }, Ij = { class: "ellipsis" }, Lj = {
	key: 0,
	class: "xs faint ellipsis"
}, Rj = {
	key: 0,
	class: "voice-menu-note faint"
}, zj = {
	key: 1,
	class: "voice-menu-note xs text-danger"
}, Bj = {
	key: 2,
	class: "voice-menu-note faint small"
}, Vj = ["value", "placeholder"], Hj = {
	key: 1,
	class: "speech-voice"
}, Uj = 0, Wj = /* @__PURE__ */ F({
	__name: "VoicePicker",
	props: {
		connection: {},
		modelValue: {},
		placeholder: {},
		label: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => Fw(n.connection)), a = W(() => n.modelValue), o = W(() => a.value?.kind === "voice" ? a.value.name || i.value?.voices.find((e) => e.id === a.value.id)?.name || a.value.id : "");
		function s(e) {
			let t = e.trim();
			if (!t) return r("update:modelValue", null);
			let n = i.value?.voices.find((e) => e.id === t || e.name.toLowerCase() === t.toLowerCase());
			(a.value?.kind !== "voice" || t !== o.value) && r("update:modelValue", {
				kind: "voice",
				id: n?.id ?? t
			});
		}
		let c = `ap-voice-menu-${++Uj}`, l = /* @__PURE__ */ j(null), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ j(!1), f = /* @__PURE__ */ j(null), p = /* @__PURE__ */ j(-1), m = W(() => (f.value ?? "").trim()), h = /* @__PURE__ */ j(!1), g = /* @__PURE__ */ j(null), _ = /* @__PURE__ */ j(""), v = null, y = null, b;
		async function x(e) {
			let t = i.value;
			if (!t?.search || e === v) return;
			y?.abort();
			let r = y = new AbortController();
			v = e, h.value = !0, _.value = "";
			try {
				g.value = await t.search(Zw, n.connection, e, r.signal);
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				v = null, _.value = AC(e);
			} finally {
				y === r && (h.value = !1);
			}
		}
		function S() {
			clearTimeout(b), b = setTimeout(() => void x(m.value), 300);
		}
		P(() => [
			n.connection.api,
			n.connection.model,
			n.connection.baseUrl,
			n.connection.apiKey
		], () => {
			y?.abort(), v = null, g.value = null, _.value = "", h.value = !1;
		});
		let ee = W(() => {
			let e = m.value.toLowerCase(), t = (i.value?.voices ?? []).filter((t) => !e || `${t.id} ${t.name} ${t.description ?? ""}`.toLowerCase().includes(e)), n = g.value ?? [], r = new Set(n.map((e) => e.id));
			return [...n, ...t.filter((e) => !r.has(e.id))];
		}), te = W(() => !!i.value?.search), C = W(() => d.value && (ee.value.length > 0 || te.value));
		P(ee, () => {
			p.value = -1;
		});
		function ne() {
			d.value = !0, x(m.value);
		}
		function re(e) {
			f.value = e.target.value, d.value = !0, S();
		}
		function ie() {
			if (f.value === null) return;
			let e = f.value;
			f.value = null, s(e);
		}
		function ae() {
			d.value = !1, clearTimeout(b);
		}
		function oe() {
			ae(), ie();
		}
		function w(e) {
			let t = ee.value.length;
			t && (d.value = !0, p.value = (p.value + 1 + e + t + 1) % (t + 1) - 1, Xn(() => u.value?.querySelector(".voice-option.on")?.scrollIntoView({ block: "nearest" })));
		}
		function se(e) {
			if (!e.isComposing) {
				if (e.key === "ArrowDown") e.preventDefault(), w(1);
				else if (e.key === "ArrowUp") e.preventDefault(), w(-1);
				else if (e.key === "Enter") {
					e.preventDefault();
					let t = C.value ? ee.value[p.value] : void 0;
					t ? ce(t) : (ae(), ie());
				} else e.key === "Escape" && (d.value || f.value !== null) && (e.preventDefault(), e.stopPropagation(), d.value ? ae() : f.value = null);
			}
		}
		async function ce(e) {
			let t = e.id, a = i.value;
			if (f.value = null, e.owner && a?.adopt) {
				h.value = !0;
				try {
					t = await a.adopt(Zw, n.connection, e);
				} catch (e) {
					_.value = AC(e);
					return;
				} finally {
					h.value = !1;
				}
			}
			ae(), r("update:modelValue", {
				kind: "voice",
				id: t,
				name: e.name
			});
		}
		let T = null;
		function E(e) {
			T?.pause(), e.preview && (T = new Audio(e.preview), T.play().catch(() => void 0));
		}
		function le() {
			let e = l.value, t = u.value;
			if (!e || !t) return;
			let n = e.getBoundingClientRect(), r = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			t.style.width = `${Math.min(Math.max(n.width, 240), r.width - 16)}px`, t.style.left = "0px", t.style.top = "0px";
			let i = t.getBoundingClientRect(), a = NO(n, i, r, "start", !0);
			t.style.left = `${a.left - i.left}px`, t.style.top = `${a.top - i.top}px`;
		}
		let ue = (e) => {
			u.value?.contains(e.target) || le();
		};
		function de() {
			removeEventListener("scroll", ue, !0), removeEventListener("resize", ue);
		}
		P(C, async (e) => {
			if (!e) return de();
			await Xn();
			try {
				u.value && !u.value.matches(":popover-open") && u.value.showPopover?.();
			} catch {}
			le(), addEventListener("scroll", ue, !0), addEventListener("resize", ue);
		}), P([
			ee,
			h,
			_
		], () => {
			C.value && Xn(le);
		}), Xr(() => {
			de(), clearTimeout(b), y?.abort(), T?.pause();
		});
		let fe = /* @__PURE__ */ j(null), D = /* @__PURE__ */ j(null);
		async function O(e, t) {
			let n = e.target, i = n.files?.[0];
			if (n.value = "", !i) return;
			let o = await Mx(i, { prefix: "voice:" }), s = a.value?.kind === "clone" ? a.value : null;
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
			r("update:modelValue", c), AT();
		}
		function pe(e) {
			if (a.value?.kind !== "clone") return;
			let { id: t, ...n } = a.value;
			r("update:modelValue", {
				...n,
				text: e.trim() || void 0
			});
		}
		function me() {
			r("update:modelValue", null), AT();
		}
		return (t, n) => (R(), z("div", Oj, [V("div", kj, [
			a.value?.kind === "clone" ? (R(), z(L, { key: 0 }, [V("span", {
				class: "chip grow",
				title: a.value.audio
			}, [H(M(_A), { class: "faint" }), V("span", jj, A(a.value.name || M(J)("media.speech.clone")), 1)], 8, Aj), H(Q, {
				icon: M(wj),
				label: M(J)("common.delete"),
				small: "",
				onClick: me
			}, null, 8, ["icon", "label"])], 64)) : (R(), z(L, { key: 1 }, [V("input", {
				ref_key: "input",
				ref: l,
				class: "input",
				role: "combobox",
				autocomplete: "off",
				spellcheck: "false",
				value: f.value ?? o.value,
				"aria-label": e.label,
				"aria-expanded": C.value,
				"aria-controls": c,
				"aria-activedescendant": C.value && p.value >= 0 ? `${c}-${p.value}` : void 0,
				placeholder: e.placeholder ?? (i.value?.voices[0]?.name || M(J)(te.value ? "media.speech.voiceSearch" : "media.speech.voiceId")),
				onFocus: ne,
				onBlur: oe,
				onInput: re,
				onChange: ie,
				onKeydown: se
			}, null, 40, Mj), C.value ? (R(), z("div", {
				key: 0,
				id: c,
				ref_key: "menu",
				ref: u,
				class: "voice-menu",
				popover: "manual",
				role: "listbox",
				"aria-label": e.label,
				onMousedown: n[0] ||= gs(() => {}, ["prevent"])
			}, [(R(!0), z(L, null, I(ee.value, (e, t) => (R(), z("div", {
				id: `${c}-${t}`,
				key: e.id,
				class: k(["voice-option", { on: t === p.value }]),
				role: "option",
				"aria-selected": t === p.value,
				onMouseenter: (e) => p.value = t,
				onClick: (t) => ce(e)
			}, [V("span", Fj, [V("span", Ij, A(e.name), 1), e.description ? (R(), z("span", Lj, A(e.description), 1)) : U("", !0)]), e.preview ? (R(), B(Q, {
				key: 0,
				icon: M(bj),
				label: M(J)("media.speech.test"),
				small: "",
				align: "end",
				onClick: gs((t) => E(e), ["stop"])
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			])) : U("", !0)], 42, Pj))), 128)), h.value ? (R(), z("div", Rj, [H(M(IA), { class: "spin" })])) : _.value ? (R(), z("div", zj, A(_.value), 1)) : ee.value.length ? U("", !0) : (R(), z("div", Bj, A(M(J)("media.speech.search.none")), 1))], 40, Nj)) : U("", !0)], 64)),
			i.value?.clone && a.value?.kind !== "clone" ? (R(), B(Q, {
				key: 2,
				icon: M(Ik),
				label: M(J)("media.speech.clone"),
				small: "",
				onClick: n[1] ||= (e) => fe.value?.click()
			}, null, 8, ["icon", "label"])) : U("", !0),
			H(Q, {
				icon: M(bj),
				label: M(J)("media.speech.test"),
				small: "",
				align: "end",
				onClick: n[2] ||= (t) => M(DT)(e.connection, e.modelValue)
			}, null, 8, ["icon", "label"]),
			ri(t.$slots, "default"),
			V("input", {
				ref_key: "audioInput",
				ref: fe,
				type: "file",
				accept: "audio/*",
				hidden: "",
				onChange: n[3] ||= (e) => O(e, "audio")
			}, null, 544)
		]), a.value?.kind === "clone" ? (R(), z(L, { key: 0 }, [i.value?.clone?.text === "none" ? U("", !0) : (R(), z("input", {
			key: 0,
			class: "input",
			value: a.value.text ?? "",
			placeholder: M(J)("media.speech.clone.text"),
			onChange: n[4] ||= (e) => pe(e.target.value)
		}, null, 40, Vj)), i.value?.clone?.consent ? (R(), z("div", Hj, [V("button", {
			type: "button",
			class: "btn ghost sm-btn",
			onClick: n[5] ||= (e) => D.value?.click()
		}, [H(M(_A)), ba(A(a.value.consent ? M(J)("media.speech.clone.consentSet") : M(J)("media.speech.clone.consent")), 1)]), V("input", {
			ref_key: "consentInput",
			ref: D,
			type: "file",
			accept: "audio/*",
			hidden: "",
			onChange: n[6] ||= (e) => O(e, "consent")
		}, null, 544)])) : U("", !0)], 64)) : U("", !0)]));
	}
}), Gj = ["aria-label"], Kj = { class: "col" }, qj = ["aria-label"], Jj = ["value"], Yj = { value: "" }, Xj = { class: "row end" }, Zj = ["disabled"], Qj = /* @__PURE__ */ F({
	__name: "VoiceAsk",
	setup(e) {
		let t = /* @__PURE__ */ j(), n = /* @__PURE__ */ j(null), r = /* @__PURE__ */ j("");
		P(() => $j.request, async (e) => {
			n.value = null, r.value = (e?.cards.find((t) => Hw(t.name) === Hw(e.character)) ?? e?.cards[0])?.key ?? "", e && (await Xn(), t.value?.open || t.value?.showModal());
		}, { immediate: !0 }), Xr(kT(() => [n.value]));
		function i(e) {
			let i = $j.request;
			if (!i) return;
			t.value?.close();
			let a = n.value ? /* @__PURE__ */ bn(n.value) : null;
			i.done(e && a ? {
				voice: a,
				...r.value ? { card: r.value } : {}
			} : null);
		}
		return (e, a) => M($j).request ? (R(), z("dialog", {
			key: 0,
			ref_key: "dialog",
			ref: t,
			class: "voice-ask",
			"aria-label": M(J)("media.speech.ask", { name: M($j).request.character }),
			onCancel: a[4] ||= gs((e) => i(!1), ["prevent"]),
			onKeydown: a[5] ||= gs(() => {}, ["stop"])
		}, [V("div", Kj, [
			V("strong", null, A(M(J)("media.speech.ask", { name: M($j).request.character })), 1),
			H(Wj, {
				connection: M($j).request.conn,
				"model-value": n.value,
				label: M($j).request.character,
				"onUpdate:modelValue": a[0] ||= (e) => n.value = e
			}, null, 8, [
				"connection",
				"model-value",
				"label"
			]),
			M($j).request.cards.length ? ur((R(), z("select", {
				key: 0,
				"onUpdate:modelValue": a[1] ||= (e) => r.value = e,
				class: "input",
				"aria-label": M(J)("media.speech.scope")
			}, [(R(!0), z(L, null, I(M($j).request.cards, (e) => (R(), z("option", {
				key: e.key,
				value: e.key
			}, A(e.name), 9, Jj))), 128)), V("option", Yj, A(M(J)("media.speech.global")), 1)], 8, qj)), [[ls, r.value]]) : U("", !0),
			V("div", Xj, [V("button", {
				type: "button",
				class: "btn",
				onClick: a[2] ||= (e) => i(!1)
			}, A(M(J)("common.cancel")), 1), V("button", {
				type: "button",
				class: "btn primary",
				disabled: !n.value,
				onClick: a[3] ||= (e) => i(!0)
			}, A(M(J)("common.save")), 9, Zj)])
		])], 40, Gj)) : U("", !0);
	}
}), $j = /* @__PURE__ */ fn({ request: null }), eM = (e, t, n) => (document.querySelector("ap-voice-ask") || document.body.append(document.createElement("ap-voice-ask")), new Promise((r) => {
	$j.request = {
		conn: e,
		character: t,
		cards: n,
		done: (e) => {
			$j.request = null, r(e);
		}
	};
}));
function tM() {
	ED("ap-voice-ask", Qj), iT(eM);
}
//#endregion
//#region src/ui/media/MediaDialog.vue?vue&type=script&setup=true&lang.ts
var nM = ["aria-label"], rM = { class: "media-dialog-box" }, iM = { class: "media-dialog-head" }, aM = { class: "grow ellipsis" }, oM = { class: "media-dialog-body" }, sM = /* @__PURE__ */ F({
	__name: "MediaDialog",
	setup(e) {
		let t = /* @__PURE__ */ j();
		P(() => cM.current?.id, async (e) => {
			e === void 0 ? t.value?.close() : (await Xn(), t.value?.open || t.value?.showModal());
		}, { immediate: !0 });
		let n = !1, r = (e) => {
			n = e.target === t.value;
		}, i = (e) => {
			n && e.target === t.value && pM(), n = !1;
		};
		return (e, n) => M(cM).current ? (R(), z("dialog", {
			key: 0,
			ref_key: "dialog",
			ref: t,
			class: "media-dialog",
			"aria-label": M(cM).current.title,
			onCancel: n[0] ||= gs((...e) => M(pM) && M(pM)(...e), ["prevent"]),
			onKeydown: n[1] ||= gs(() => {}, ["stop"]),
			onKeyup: n[2] ||= gs(() => {}, ["stop"]),
			onPointerdown: r,
			onClick: i
		}, [V("div", rM, [V("header", iM, [V("strong", aM, A(M(cM).current.title), 1), H(Q, {
			icon: M(wj),
			label: M(J)("common.close"),
			align: "end",
			onClick: M(pM)
		}, null, 8, [
			"icon",
			"label",
			"onClick"
		])]), V("div", oM, [(R(), B($r(M(cM).current.component), wa({ key: M(cM).current.id }, M(cM).current.props ?? {}, { onClose: M(pM) }), null, 16, ["onClose"]))])])], 40, nM)) : U("", !0);
	}
}), cM = /* @__PURE__ */ fn({ current: null }), lM = 0, uM = null;
function dM() {
	let e = document.activeElement;
	for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
	return e instanceof HTMLElement ? e : null;
}
function fM(e) {
	document.querySelector("ap-media-dialog") || document.body.append(document.createElement("ap-media-dialog")), cM.current || (uM = dM()), cM.current = {
		...e,
		component: xn(e.component),
		id: ++lM
	};
}
function pM() {
	if (!cM.current) return;
	cM.current = null;
	let e = uM;
	uM = null, e?.isConnected && e.focus({ preventScroll: !0 });
}
function mM() {
	ED("ap-media-dialog", sM);
}
//#endregion
//#region src/ui/entry.ts
var hM = "left-nav-panel", gM = "ap-preset-banner";
function _M() {
	return document.getElementById(hM);
}
function vM() {
	let e = _M();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function yM() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== gM && e.after(document.createElement(gM));
}
var bM = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function xM() {
	P(() => Y.presetId, (e) => {
		for (let t of document.querySelectorAll(bM.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function SM(e) {
	let t = _M();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function CM() {
	let e = _M();
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
function wM() {
	yM(), xM(), CM(), P(() => Y.panelOpen, (e) => {
		e && vM();
	});
	let e = _M();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Y.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region src/ui/message/StageBody.vue?vue&type=script&setup=true&lang.ts
var TM = {
	key: 0,
	class: "patches"
}, EM = { class: "patch-old pre" }, DM = { class: "patch-new pre" }, OM = {
	key: 0,
	class: "patch-status xs"
}, kM = {
	key: 2,
	class: "faint small stage-empty"
}, AM = /* @__PURE__ */ F({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(null);
		P(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Xn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (R(), z("div", {
			class: "stage-body",
			style: Ie({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (R(), z("div", TM, [(R(!0), z(L, null, I(e.stage.patches, (e, t) => (R(), z("div", {
			key: t,
			class: k(["patch", { failed: r(e.status) }])
		}, [
			V("div", EM, A(e.old_string), 1),
			H(M(Pk), { class: "patch-arrow" }),
			V("div", DM, A(e.new_string), 1),
			r(e.status) ? (R(), z("div", OM, [H(M(Lk)), ba(A(M(J)(`patch.${e.status}`)), 1)])) : U("", !0)
		], 2))), 128))])) : e.stage.text ? (R(), z("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, A(e.stage.text), 513)) : (R(), z("div", kM, A(M(J)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function jM(t) {
	let n = e().chat[t], r = gm(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), r.speechVersions && (a.speech = i ? r.speechVersions.patched : r.speechVersions.draft), vm(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), IS();
}
async function MM(t, n, r) {
	let i = e().chat[t], a = gm(i);
	return !i || !a ? !1 : (vm(t, _m(a, n, r)), IS(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var NM = { class: "stage-bar" }, PM = ["onClick"], FM = { class: "ellipsis" }, IM = {
	key: 0,
	class: "chip stage-chip error"
}, LM = { class: "ellipsis" }, RM = { class: "badge warn" }, zM = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, BM = /* @__PURE__ */ F({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = oO(() => t.mesid), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ j(!1), a = W(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = W(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = W(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = W(() => o.value.find((e) => e.id === s.value) ?? null);
		P(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = G().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: UA,
			content: hA,
			patch: wA
		}, d = (e) => e.status === "streaming" ? IA : e.status === "interrupted" ? Xk : e.status === "missing" ? qk : u[e.kind], f = W(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = W(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = W(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${J(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(J("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => M(n) && (o.value.length || M(n).error) ? (R(), z("div", {
			key: 0,
			class: k(["stages", { live: M(n).running }])
		}, [V("div", NM, [
			(R(!0), z(L, null, I(o.value, (e) => (R(), z("button", {
				key: e.id,
				type: "button",
				class: k(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ie({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(R(), B($r(d(e)), { class: k({ spin: e.status === "streaming" }) }, null, 8, ["class"])), V("span", FM, A(e.label), 1)], 14, PM))), 128)),
			M(n).error ? (R(), z("span", IM, [H(M(hj)), V("span", LM, A(M(n).error), 1)])) : U("", !0),
			r[1] ||= V("span", { class: "grow" }, null, -1),
			f.value.length ? (R(), B(Ej, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: N(() => [V("span", RM, [H(M(hj)), ba(A(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			p.value ? (R(), B(Q, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? M(gj) : M(QA),
				label: p.value.patchesApplied ? M(J)("stages.revertDraft") : M(J)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => M(jM)(e.mesid)
			}, null, 8, ["icon", "label"])) : U("", !0),
			M(n).running ? U("", !0) : (R(), B(Ej, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: N(() => [V("span", zM, [H(M(jA))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (R(), B(AM, {
			key: c.value.id,
			stage: c.value,
			follow: M(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : U("", !0)], 2)) : U("", !0);
	}
}), VM = {
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
function HM(e) {
	let t = VM[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function UM(e, t) {
	return e.flatMap((e, n) => {
		let r = HM(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var WM = { class: "reply-name xs" }, GM = ["innerHTML"], KM = /* @__PURE__ */ F({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = W(() => rO(t.text));
		return (t, r) => (R(), z("div", {
			class: "reply-card",
			style: Ie({ "--actor": e.color })
		}, [V("div", WM, A(e.name), 1), V("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, GM)], 4));
	}
}), qM = { class: "card mini-card" }, JM = { class: "card-head" }, YM = { class: "card-title" }, XM = { class: "card-body pre" }, ZM = /* @__PURE__ */ F({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (R(), z("div", qM, [V("header", JM, [
			H(M(vj), { class: "section-icon" }),
			V("span", YM, A(M(J)("cards.impersonate")), 1),
			V("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => M(dE)(e.text, !1, e.mesid)
			}, [H(M(pj)), ba(A(M(J)("cards.fillInput")), 1)])
		]), V("div", XM, A(e.text), 1)]));
	}
}), QM = ["aria-label"], $M = ["title", "onClick"], eN = { class: "option-label" }, tN = { class: "option-content small muted" }, nN = /* @__PURE__ */ F({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => dE(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
		return (t, r) => (R(), z("div", {
			class: "options-grid",
			role: "list",
			"aria-label": M(J)("cards.options")
		}, [(R(!0), z(L, null, I(e.options, (e, t) => (R(), z("button", {
			key: t,
			type: "button",
			role: "listitem",
			class: "option",
			title: M(J)("cards.optionHint"),
			onClick: (t) => n(e, t)
		}, [V("span", eN, A(e.label), 1), V("span", tN, A(e.content), 1)], 8, $M))), 128))], 8, QM));
	}
}), rN = {
	key: 0,
	class: "memory-ops"
}, iN = { class: "ellipsis" }, aN = ["aria-label", "onClick"], oN = /* @__PURE__ */ F({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = W(() => {
			let e = Vm(t.preset), n = e.globalMemory.log;
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
					let r = Cm(t), i = r ? wm(e, r) : -1, a = n[i];
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
			e.id !== void 0 && Lm(Vm(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (R(), z("div", rN, [(R(!0), z(L, null, I(n.value, (e, t) => (R(), B(Ej, {
			key: t,
			text: e.op === "delete" ? M(J)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: N(() => [V("span", { class: k(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(R(), B($r(e.scope === "global" ? M(TA) : M(RA)), { class: "faint" })),
				V("span", iN, A(e.key), 1),
				(R(), B($r(e.op === "delete" ? M(mj) : M(JA)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": M(J)("common.undo"),
					onClick: (t) => r(e)
				}, [H(M(gj))], 8, aN)) : U("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : U("", !0);
	}
}), sN = ["aria-label"], cN = /* @__PURE__ */ F({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(null), { open: r, bubble: i } = PO(n, () => t);
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
			onClick: a[0] ||= gs((e) => r.value = !M(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [H(M(Yk))], 40, sN), M(r) ? (R(), z("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : U("", !0)], 544)) : U("", !0);
	}
}), lN = { class: "card-title" }, uN = {
	key: 0,
	class: "card-body"
}, dN = /* @__PURE__ */ F({
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
			})) : U("", !0),
			V("span", lN, A(e.title), 1),
			H(cN, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			V("span", {
				class: "row",
				onClick: r[0] ||= gs(() => {}, ["stop"])
			}, [ri(n.$slots, "actions")]),
			e.collapsible ? (R(), B(M(Wk), {
				key: 1,
				class: k(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : U("", !0)
		], 2), !e.collapsible || t.value ? (R(), z("div", uN, [ri(n.$slots, "default")])) : U("", !0)], 2));
	}
}), fN = {
	key: 0,
	class: "badge neutral"
}, pN = { class: "pre small" }, mN = /* @__PURE__ */ F({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (R(), B(dN, {
			title: M(J)("cards.recap"),
			icon: M(rj),
			collapsible: "",
			open: !1
		}, {
			actions: N(() => [e.coversUpTo === void 0 ? U("", !0) : (R(), z("span", fN, "#0–" + A(e.coversUpTo), 1))]),
			default: N(() => [V("div", pN, A(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), hN = { class: "synopsis-fields" }, gN = { class: "synopsis-field" }, _N = ["placeholder", "aria-label"], vN = { class: "synopsis-field" }, yN = ["placeholder", "aria-label"], bN = ["placeholder", "aria-label"], xN = ["placeholder", "aria-label"], SN = { class: "synopsis-actions" }, CN = { class: "xs faint grow synopsis-keys" }, wN = {
	type: "submit",
	class: "btn primary sm-btn"
}, TN = { class: "synopsis-head" }, EN = { class: "synopsis-line small" }, DN = {
	key: 0,
	class: "row tight"
}, ON = {
	key: 1,
	class: "row tight"
}, kN = { class: "synopsis-event ellipsis" }, AN = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, jN = /* @__PURE__ */ F({
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
		}), d = W(() => l.some((e) => u()[e] !== (n.synopsis[e] ?? "")));
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
			onSubmit: gs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= gs(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= gs(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= gs(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= gs(() => {}, ["stop"])
		}, [
			V("div", hN, [V("label", gN, [H(M(Qk), { class: "faint" }), ur(V("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: M(J)("cards.synopsis.time"),
				"aria-label": M(J)("cards.synopsis.time")
			}, null, 8, _N), [[os, o.time]])]), V("label", vN, [H(M(LA), { class: "faint" }), ur(V("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: M(J)("cards.synopsis.location"),
				"aria-label": M(J)("cards.synopsis.location")
			}, null, 8, yN), [[os, o.location]])])]),
			ur(V("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: M(J)("cards.synopsis.event"),
				"aria-label": M(J)("cards.synopsis.event")
			}, null, 8, bN), [[os, o.event]]),
			ur(V("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: M(J)("cards.synopsis.summary"),
				"aria-label": M(J)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, xN), [[os, o.summary]]),
			V("div", SN, [
				V("span", CN, A(M(J)("cards.synopsis.keys")), 1),
				V("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, A(M(J)("common.cancel")), 1),
				V("button", wN, [H(M(Uk)), ba(A(M(J)("common.save")), 1)])
			])
		], 32)) : (R(), z("div", {
			key: 1,
			class: k(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [V("div", TN, [V("div", EN, [
			e.synopsis.time ? (R(), z("span", DN, [H(M(Qk), { class: "faint" }), ba(A(e.synopsis.time), 1)])) : U("", !0),
			e.synopsis.location ? (R(), z("span", ON, [H(M(LA), { class: "faint" }), ba(A(e.synopsis.location), 1)])) : U("", !0),
			V("span", kN, A(e.synopsis.event), 1)
		]), e.editable ? (R(), z("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= gs(() => {}, ["stop"])
		}, [H(Q, {
			icon: M(JA),
			label: M(J)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : U("", !0)]), i.value && e.synopsis.summary ? (R(), z("div", AN, A(e.synopsis.summary), 1)) : U("", !0)], 2));
	}
}), MN = { class: "status-fields" }, NN = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], PN = { class: "synopsis-actions" }, FN = { class: "xs faint grow synopsis-keys" }, IN = {
	type: "submit",
	class: "btn primary sm-btn"
}, LN = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, RN = { class: "status-line" }, zN = {
	key: 0,
	class: "row tight"
}, BN = {
	key: 1,
	class: "row tight"
}, VN = {
	key: 2,
	class: "row tight status-location"
}, HN = { class: "ellipsis" }, UN = {
	key: 3,
	class: "row tight"
}, WN = /* @__PURE__ */ F({
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
		}), o = /* @__PURE__ */ j(), s = (e) => (n.status[e] ?? "").trim(), c = W(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, eA],
			[/雪|snow|sleet|blizzard/i, cj],
			[/雨|rain|drizzle|shower/i, tA],
			[/雾|霾|fog|mist|haze|smog/i, $k],
			[/风|wind|gale|breez/i, Sj],
			[/阴|云|cloud|overcast/i, rA],
			[/夜|月|night|moon/i, VA],
			[/晴|sun|clear|fair/i, fj]
		], u = W(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? nA), d = () => Object.fromEntries(Bc.map((e) => [e, a[e].trim()])), f = W(() => Bc.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of Bc) a[e] = n.status[e] ?? "";
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
			date: Hk,
			weekday: Hk,
			time: Qk,
			location: LA,
			weather: nA
		};
		return (t, n) => i.value ? (R(), z("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: gs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= gs(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= gs(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= gs(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= gs(() => {}, ["stop"])
		}, [V("div", MN, [(R(!0), z(L, null, I(M(Bc), (e) => (R(), z("label", {
			key: e,
			class: "synopsis-field"
		}, [(R(), B($r(_[e]), { class: "faint" })), ur(V("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: M(J)(`cards.status.${e}`),
			"aria-label": M(J)(`cards.status.${e}`)
		}, null, 8, NN), [[os, a[e]]])]))), 128))]), V("div", PN, [
			V("span", FN, A(M(J)("cards.status.keys")), 1),
			V("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, A(M(J)("common.cancel")), 1),
			V("button", IN, [H(M(Uk)), ba(A(M(J)("common.save")), 1)])
		])], 544)) : (R(), z("div", LN, [V("div", RN, [
			c.value ? (R(), z("span", zN, [H(M(Hk), { class: "faint" }), ba(A(c.value), 1)])) : U("", !0),
			s("time") ? (R(), z("span", BN, [H(M(Qk), { class: "faint" }), ba(A(s("time")), 1)])) : U("", !0),
			s("location") ? (R(), z("span", VN, [H(M(LA), { class: "faint" }), V("span", HN, A(s("location")), 1)])) : U("", !0),
			s("weather") ? (R(), z("span", UN, [(R(), B($r(u.value), { class: "faint" })), ba(A(s("weather")), 1)])) : U("", !0)
		]), e.editable ? (R(), z("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= gs(() => {}, ["stop"])
		}, [H(Q, {
			icon: M(JA),
			label: M(J)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : U("", !0)]));
	}
}), GN = ["innerHTML"], KN = {
	key: 1,
	class: "kv-list small"
}, qN = { class: "pre" }, JN = /* @__PURE__ */ F({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = W(() => typeof t.value == "string" ? rO(t.value) : "");
		return (t, r) => (R(), B(dN, {
			title: e.title,
			icon: M(aj),
			collapsible: "",
			open: !1
		}, {
			default: N(() => [typeof e.value == "string" ? (R(), z("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, GN)) : (R(), z("dl", KN, [(R(!0), z(L, null, I(e.value, (e, t) => (R(), z(L, { key: t }, [V("dt", null, A(t), 1), V("dd", qN, A(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), YN = /* @__PURE__ */ new Map();
function XN(e) {
	let t = YN.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => YN.delete(e)), YN.set(e, t);
	}
	return t;
}
function ZN(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function QN(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var $N = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function eP(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = Zl(e.code, $N(r));
			t.replaceChildren(...[QN(e.style)].filter((e) => !!e));
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
	let i = ZN(await XN(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[QN(e.style)].filter((e) => !!e)), a = await i(t, r);
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
var tP = { class: "structure-component" }, nP = ["data-structure"], rP = {
	key: 0,
	class: "xs"
}, iP = /* @__PURE__ */ F({
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
				i = await eP(t.component, r, t.context);
			});
		}), P(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), P(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await eP(e, r, t.context));
		})), Xr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (R(), z("div", tP, [V("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, nP), r.value ? (R(), z("div", rP, A(M(J)("cards.custom.error", { error: r.value })), 1)) : U("", !0)]));
	}
}), aP = { class: "speech-panel" }, oP = {
	key: 0,
	class: "muted small"
}, sP = {
	key: 1,
	class: "muted small"
}, cP = { class: "speech-panel-bar" }, lP = { class: "grow xs muted ellipsis" }, uP = {
	key: 0,
	class: "speech-panel-format xs muted"
}, dP = { class: "speech-panel-list" }, fP = ["data-seg"], pP = { class: "speech-panel-head" }, mP = { class: "speech-panel-who ellipsis" }, hP = ["title"], gP = {
	key: 0,
	class: "speech-panel-display small muted"
}, _P = [
	"value",
	"aria-label",
	"onInput",
	"onKeydown"
], vP = { class: "speech-panel-actions" }, yP = {
	key: 0,
	class: "xs muted grow"
}, bP = {
	key: 1,
	class: "grow"
}, xP = ["onClick"], SP = ["onClick"], CP = /* @__PURE__ */ F({
	__name: "SpeechPanel",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = W(() => Qw()), r = W(() => (Y.chatRev, $w(t.mesid))), i = W(() => n.value ? Fw(n.value) : void 0), a = W(() => i.value?.format ?? "");
		P(() => r.value.map((e) => e.id + e.text).join("\n"), () => {
			yT(r.value);
		}, { immediate: !0 });
		let o = W(() => r.value.map((e) => vT(e))), s = W(() => !!X.generating[t.mesid]), c = W(() => o.value.length > 0 && o.value.every((e) => e === "ready")), l = W(() => o.value.some((e) => e === "ready" || e === "error")), u = W(() => X.playing?.mesId === t.mesid ? X.playing : null), d = W(() => !!u.value?.all), f = (e) => u.value?.segId === e.id, p = (e, t) => f(e) ? "playing" : o.value[t] ?? "none";
		function m(e) {
			return e === void 0 ? J("media.speech.panel.noVoice") : e === null ? i.value?.voices[0]?.name ?? J("media.speech.providerDefault") : e.kind === "voice" ? e.name || i.value?.voices.find((t) => t.id === e.id)?.name || e.id : e.name || J("media.speech.clone");
		}
		let h = (e) => n.value ? m(Gw(n.value, e, jS().map((e) => e.key))) : "", g = (e) => e.character || J("media.speech.narration"), _ = /* @__PURE__ */ fn({});
		P(() => r.value.map((e) => e.id), (e) => {
			for (let t of Object.keys(_)) e.includes(t) || delete _[t];
		});
		let v = (e) => _[e.id] ?? e.text, y = (e) => e.id in _ && _[e.id].trim() !== e.text;
		function b(e, t) {
			_[e.id] = t.target.value;
		}
		async function x(e) {
			let n = _[e.id];
			delete _[e.id], n !== void 0 && await eT(t.mesid, e.id, n);
		}
		let S = (e) => {
			delete _[e.id];
		};
		async function ee(e) {
			delete _[e.id], await eT(t.mesid, e.id, "");
		}
		async function te(e) {
			await PT(t.mesid, [e.id]), await MT(t.mesid, e.id);
		}
		function C(e, t) {
			t.key === "Enter" && (t.ctrlKey || t.metaKey) ? (t.preventDefault(), x(e)) : t.key === "Escape" && y(e) && (t.preventDefault(), t.stopPropagation(), S(e));
		}
		function ne() {
			d.value ? CT() : ET(t.mesid);
		}
		async function re() {
			let e = await NT(t.mesid);
			e && qT(e, `speech-${t.mesid}.wav`);
		}
		return (t, i) => (R(), z("div", aP, [n.value ? r.value.length ? (R(), z(L, { key: 2 }, [
			V("div", cP, [
				V("button", {
					type: "button",
					class: k(["btn", { primary: !d.value }]),
					onClick: ne
				}, [(R(), B($r(d.value && !M(X).paused ? M(KA) : M(YA)))), V("span", null, A(d.value && !M(X).paused ? M(J)("media.speech.pause") : M(J)("media.speech.panel.playAll")), 1)], 2),
				u.value ? (R(), B(Q, {
					key: 0,
					icon: M(dj),
					label: M(J)("media.speech.stop"),
					small: "",
					onClick: i[0] ||= (e) => M(ST)()
				}, null, 8, ["icon", "label"])) : U("", !0),
				V("span", lP, A(n.value.name) + " · " + A(M(J)("media.speech.panel.count", { n: r.value.length })), 1),
				c.value ? U("", !0) : (R(), B(Q, {
					key: 1,
					icon: s.value ? M(IA) : M(lj),
					class: k({ spin: s.value }),
					label: M(J)("media.speech.generateAll"),
					disabled: s.value,
					small: "",
					onClick: i[1] ||= (t) => M(jT)(e.mesid)
				}, null, 8, [
					"icon",
					"class",
					"label",
					"disabled"
				])),
				l.value ? (R(), B(Q, {
					key: 2,
					icon: M(tj),
					label: M(J)("media.speech.regenerateAll"),
					disabled: s.value,
					small: "",
					onClick: i[2] ||= (t) => M(FT)(e.mesid)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : U("", !0),
				l.value ? (R(), B(Q, {
					key: 3,
					icon: M(mj),
					label: M(J)("media.speech.deleteAll"),
					disabled: s.value,
					danger: "",
					small: "",
					onClick: i[3] ||= (t) => M(PT)(e.mesid)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : U("", !0),
				H(Q, {
					icon: M(dA),
					label: M(J)("media.speech.download"),
					disabled: s.value,
					small: "",
					align: "end",
					onClick: re
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])
			]),
			a.value ? (R(), z("p", uP, [V("span", null, A(M(J)("media.speech.panel.tags")), 1), H(cN, {
				text: a.value,
				align: "start"
			}, null, 8, ["text"])])) : U("", !0),
			V("ol", dP, [(R(!0), z(L, null, I(r.value, (t, n) => (R(), z("li", {
				key: t.id,
				class: k(["speech-panel-seg", [
					t.kind,
					p(t, n),
					{ edited: t.original !== void 0 }
				]]),
				"data-seg": t.id
			}, [
				V("div", pP, [
					H(Q, {
						icon: f(t) && !M(X).paused ? M(KA) : p(t, n) === "loading" ? M(IA) : M(YA),
						class: k([{ spin: p(t, n) === "loading" && !f(t) }, "speech-panel-play"]),
						label: f(t) && !M(X).paused ? M(J)("media.speech.pause") : M(J)("media.speech.play"),
						active: f(t),
						small: "",
						align: "start",
						onClick: (n) => M(TT)(e.mesid, t.id)
					}, null, 8, [
						"icon",
						"class",
						"label",
						"active",
						"onClick"
					]),
					V("strong", mP, A(g(t)), 1),
					V("span", {
						class: "xs muted ellipsis grow",
						title: M(J)("media.speech.panel.voice")
					}, A(h(t)), 9, hP),
					V("span", { class: k(["badge speech-panel-state", {
						neutral: p(t, n) === "none" || p(t, n) === "loading",
						warn: p(t, n) === "error"
					}]) }, A(M(J)(`media.speech.state.${p(t, n)}`)), 3)
				]),
				t.kind === "speech" && t.display !== v(t) ? (R(), z("p", gP, A(t.display), 1)) : U("", !0),
				V("textarea", {
					class: "input small speech-panel-text",
					rows: "2",
					value: v(t),
					"aria-label": M(J)("media.speech.panel.text", { who: g(t) }),
					spellcheck: "false",
					onInput: (e) => b(t, e),
					onKeydown: (e) => C(t, e)
				}, null, 40, _P),
				V("div", vP, [t.original !== void 0 && !y(t) ? (R(), z("span", yP, A(M(J)("media.speech.panel.edited")), 1)) : (R(), z("span", bP)), y(t) ? (R(), z(L, { key: 2 }, [V("button", {
					type: "button",
					class: "btn ghost",
					onClick: (e) => S(t)
				}, A(M(J)("common.cancel")), 9, xP), V("button", {
					type: "button",
					class: "btn primary speech-panel-save",
					onClick: (e) => x(t)
				}, A(M(J)("media.speech.panel.save")), 9, SP)], 64)) : (R(), z(L, { key: 3 }, [
					t.original === void 0 ? U("", !0) : (R(), B(Q, {
						key: 0,
						icon: M(gj),
						label: M(J)("media.speech.panel.revert"),
						small: "",
						class: "speech-panel-revert",
						onClick: (e) => ee(t)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])),
					H(Q, {
						icon: o.value[n] ? M(tj) : M(lj),
						label: o.value[n] ? M(J)("media.speech.regenerateLine") : M(J)("media.speech.panel.generate"),
						disabled: p(t, n) === "loading",
						small: "",
						class: "speech-panel-regen",
						onClick: (r) => o.value[n] ? te(t) : M(MT)(e.mesid, t.id)
					}, null, 8, [
						"icon",
						"label",
						"disabled",
						"onClick"
					]),
					o.value[n] === "ready" || o.value[n] === "error" ? (R(), B(Q, {
						key: 1,
						icon: M(mj),
						label: M(J)("media.speech.deleteLine"),
						danger: "",
						small: "",
						align: "end",
						class: "speech-panel-delete",
						onClick: (n) => M(PT)(e.mesid, [t.id])
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : U("", !0)
				], 64))])
			], 10, fP))), 128))])
		], 64)) : (R(), z("div", sP, A(M(J)("media.speech.panel.empty")), 1)) : (R(), z("div", oP, A(M(J)("media.speech.panel.off")), 1))]));
	}
}), wP = { class: "speech-card" }, TP = ["aria-label"], EP = [
	"aria-label",
	"title",
	"onClick"
], DP = {
	key: 0,
	class: "speech-who xs muted ellipsis"
}, OP = /* @__PURE__ */ F({
	__name: "SpeechCard",
	props: {
		mesid: {},
		segments: {}
	},
	setup(e) {
		let t = e, n = W(() => X.playing?.mesId === t.mesid && X.playing.all ? X.playing : null), r = W(() => X.playing?.mesId === t.mesid ? X.playing.segId : null), i = W(() => t.segments.map((e) => vT(e))), a = W(() => i.value.every((e) => e === "ready")), o = W(() => !!X.generating[t.mesid]), s = W(() => i.value.some((e) => e === "ready" || e === "error")), c = W(() => t.segments.find((e) => e.id === r.value)), l = W(() => c.value ? c.value.character || J("media.speech.narration") : "");
		P(() => t.segments.map((e) => e.id + e.text).join("\n"), () => {
			yT(t.segments);
		}, { immediate: !0 });
		function u() {
			n.value ? CT() : ET(t.mesid);
		}
		let d = () => fM({
			component: CP,
			props: { mesid: t.mesid },
			title: J("media.speech.panel.title")
		});
		async function f() {
			let e = await NT(t.mesid);
			e && qT(e, `speech-${t.mesid}.wav`);
		}
		return (t, p) => (R(), z("div", wP, [
			H(Q, {
				icon: n.value && !M(X).paused ? M(KA) : M(YA),
				label: n.value && !M(X).paused ? M(J)("media.speech.pause") : M(J)("media.speech.play"),
				active: !!n.value,
				onClick: u
			}, null, 8, [
				"icon",
				"label",
				"active"
			]),
			V("div", {
				class: "speech-track",
				role: "group",
				"aria-label": M(J)("media.speech.lines")
			}, [(R(!0), z(L, null, I(e.segments, (t, n) => (R(), z("button", {
				key: t.id,
				type: "button",
				class: k(["speech-seg", [
					i.value[n],
					t.kind,
					{ on: t.id === r.value }
				]]),
				style: Ie({ flexGrow: Math.max(4, Math.min(t.display.length, 160)) }),
				"aria-label": `${t.character || M(J)("media.speech.narration")}: ${t.display}`,
				title: `${t.character || M(J)("media.speech.narration")}: ${t.display}`,
				onClick: (n) => M(ET)(e.mesid, t.id)
			}, null, 14, EP))), 128))], 8, TP),
			l.value ? (R(), z("span", DP, A(l.value), 1)) : U("", !0),
			c.value && !o.value ? (R(), z(L, { key: 1 }, [H(Q, {
				icon: M(tj),
				label: M(J)("media.speech.regenerateLine"),
				small: "",
				onClick: p[0] ||= (t) => M(FT)(e.mesid, c.value.id)
			}, null, 8, ["icon", "label"]), H(Q, {
				icon: M(mj),
				label: M(J)("media.speech.deleteLine"),
				small: "",
				danger: "",
				onClick: p[1] ||= (t) => M(PT)(e.mesid, [c.value.id])
			}, null, 8, ["icon", "label"])], 64)) : U("", !0),
			M(X).playing?.mesId === e.mesid ? (R(), B(Q, {
				key: 2,
				icon: M(dj),
				label: M(J)("media.speech.stop"),
				small: "",
				onClick: p[2] ||= (e) => M(ST)()
			}, null, 8, ["icon", "label"])) : (R(), z(L, { key: 3 }, [a.value ? (R(), B(Q, {
				key: 1,
				icon: M(dA),
				label: M(J)("media.speech.download"),
				small: "",
				onClick: f
			}, null, 8, ["icon", "label"])) : (R(), B(Q, {
				key: 0,
				icon: o.value ? M(IA) : M(lj),
				class: k({ spin: o.value }),
				label: M(J)("media.speech.generateAll"),
				disabled: o.value,
				small: "",
				onClick: p[3] ||= (t) => M(jT)(e.mesid)
			}, null, 8, [
				"icon",
				"class",
				"label",
				"disabled"
			])), s.value && !o.value ? (R(), z(L, { key: 2 }, [H(Q, {
				icon: M(tj),
				label: M(J)("media.speech.regenerateAll"),
				small: "",
				onClick: p[4] ||= (t) => M(FT)(e.mesid)
			}, null, 8, ["icon", "label"]), H(Q, {
				icon: M(mj),
				label: M(J)("media.speech.deleteAll"),
				small: "",
				danger: "",
				align: "end",
				onClick: p[5] ||= (t) => M(PT)(e.mesid)
			}, null, 8, ["icon", "label"])], 64)) : U("", !0)], 64)),
			H(Q, {
				icon: M(FA),
				label: M(J)("media.speech.panel.open"),
				small: "",
				align: "end",
				class: "speech-open",
				onClick: d
			}, null, 8, ["icon", "label"])
		]));
	}
}), kP = { class: "field-label" }, AP = { class: "ellipsis" }, jP = {
	key: 0,
	class: "dot modified"
}, MP = { class: "field-control" }, $ = /* @__PURE__ */ F({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (R(), z("div", { class: k(["field", { inline: e.inline }]) }, [V("div", kP, [
			V("span", AP, A(e.label), 1),
			e.modified ? (R(), z("span", jP)) : U("", !0),
			H(cN, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), V("div", MP, [ri(t.$slots, "default")])], 2));
	}
}), NP = ["src", "alt"], PP = {
	key: 1,
	class: "blob-placeholder",
	"aria-hidden": "true"
}, FP = /* @__PURE__ */ F({
	__name: "BlobImage",
	props: {
		blobKey: {},
		alt: {}
	},
	emits: ["missing"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j();
		return P(() => n.blobKey, async (e) => {
			i.value = void 0;
			let t = await zx(e).catch(() => void 0);
			e === n.blobKey && (i.value = t, t || r("missing"));
		}, { immediate: !0 }), (t, n) => i.value ? (R(), z("img", {
			key: 0,
			src: i.value,
			alt: e.alt ?? "",
			draggable: "false"
		}, null, 8, NP)) : (R(), z("span", PP));
	}
}), IP = ["aria-label"], LP = { class: "image-viewer-bar" }, RP = { class: "small" }, zP = {
	key: 1,
	class: "small grow ellipsis image-viewer-caption"
}, BP = /* @__PURE__ */ F({
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
			onClick: n[4] ||= gs((e) => i.value?.close(), ["self"]),
			onKeydown: s,
			onTouchstartPassive: n[5] ||= (e) => /* @__PURE__ */ wn(c) ? c.value = e.touches[0]?.clientX ?? null : c = e.touches[0]?.clientX ?? null,
			onTouchend: l
		}, [H(FP, {
			"blob-key": e.keys[a.value],
			alt: e.caption,
			class: "image-viewer-img"
		}, null, 8, ["blob-key", "alt"]), V("div", LP, [
			e.keys.length > 1 ? (R(), z(L, { key: 0 }, [
				H(Q, {
					icon: M(Gk),
					label: M(J)("media.image.previous"),
					onClick: n[0] ||= (e) => o(-1)
				}, null, 8, ["icon", "label"]),
				V("span", RP, A(a.value + 1) + " / " + A(e.keys.length), 1),
				H(Q, {
					icon: M(Kk),
					label: M(J)("media.image.next"),
					onClick: n[1] ||= (e) => o(1)
				}, null, 8, ["icon", "label"])
			], 64)) : U("", !0),
			e.caption ? (R(), z("span", zP, A(e.caption), 1)) : U("", !0),
			H(Q, {
				icon: M(wj),
				label: M(J)("common.close"),
				align: "end",
				onClick: n[2] ||= (e) => i.value?.close()
			}, null, 8, ["icon", "label"])
		])], 40, IP));
	}
}), VP = {
	key: 0,
	class: "image-panel muted small"
}, HP = [
	"value",
	"aria-label",
	"disabled"
], UP = ["value"], WP = {
	key: 0,
	class: "xs muted"
}, GP = {
	key: 1,
	class: "col media-refs"
}, KP = {
	key: 0,
	class: "xs muted"
}, qP = ["data-ref"], JP = ["checked", "onChange"], YP = { class: "badge neutral mono" }, XP = { class: "small grow ellipsis" }, ZP = ["data-ref"], QP = ["onChange"], $P = { class: "badge neutral mono" }, eF = { class: "xs muted grow" }, tF = { class: "row image-panel-row" }, nF = ["value"], rF = {
	key: 0,
	class: "xs muted"
}, iF = {
	key: 1,
	class: "image-versions"
}, aF = [
	"aria-label",
	"aria-pressed",
	"onClick"
], oF = { class: "image-version-tools" }, sF = {
	key: 1,
	class: "row tight image-panel-status",
	role: "status"
}, cF = { class: "small grow" }, lF = {
	key: 2,
	class: "xs text-danger image-panel-status"
}, uF = { class: "row end tight image-panel-actions" }, dF = ["disabled"], fF = ["disabled"], pF = ["disabled"], mF = /* @__PURE__ */ F({
	__name: "ImagePanel",
	props: {
		mesid: {},
		structure: {},
		index: {}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => VS(n.mesid)), a = i.value?.genId, o = W(() => i.value && i.value.genId === a ? i.value : void 0), s = W(() => {
			let e = o.value;
			return e ? JS(Mp(e.presetId)).flatMap((t) => YS(e, t.id).map((e, n) => ({
				structure: t.id,
				index: n
			}))) : [];
		}), c = /* @__PURE__ */ j({
			structure: n.structure,
			index: n.index
		}), l = W(() => `${c.value.structure}:${c.value.index}`), u = (e) => {
			let t = s.value.find((t) => `${t.structure}:${t.index}` === e);
			t && (c.value = t);
		}, d = W(() => YS(o.value, c.value.structure)[c.value.index]), f = W(() => ZS(o.value, c.value.structure, c.value.index)), p = W(() => o.value?.images?.[c.value.structure]?.[c.value.index]), m = W(() => QS(o.value, c.value.structure, c.value.index)), h = /* @__PURE__ */ fn({
			prompt: "",
			refs: [],
			ratio: "",
			caption: ""
		}), g = (e) => {
			h.prompt = e?.prompt ?? "", h.refs = [...e?.refs ?? []], h.ratio = e?.ratio ?? "", h.caption = e?.caption ?? "";
		};
		P(l, () => g(f.value), { immediate: !0 });
		let _ = W(() => {
			let e = f.value;
			if (!e) return !1;
			let t = e.refs ?? [];
			return h.prompt.trim() !== e.prompt.trim() || h.ratio !== (e.ratio ?? "") || h.caption.trim() !== (e.caption ?? "").trim() || h.refs.length !== t.length || h.refs.some((e) => !t.includes(e));
		}), v = W(() => {
			let e = d.value;
			if (!e) return !1;
			let t = e.refs ?? [];
			return h.prompt.trim() !== e.prompt.trim() || h.ratio !== (e.ratio ?? "") || h.caption.trim() !== (e.caption ?? "").trim() || h.refs.length !== t.length || h.refs.some((e) => !t.includes(e));
		}), y = () => g(d.value), b = W(() => KS()), x = W(() => !!(b.value && vx(b.value.api))), S = W(() => b.value && x.value ? FS(b.value) : []), ee = W(() => h.refs.filter((e) => !S.value.some((t) => t.id === e))), te = (e, t) => {
			h.refs = t ? [...h.refs, e] : h.refs.filter((t) => t !== e);
		}, C = W(() => d.value?.ratio ? [...bc] : ["", ...bc]), ne = /* @__PURE__ */ fn(/* @__PURE__ */ new Set()), re = W(() => (p.value?.keys ?? []).filter((e) => !ne.has(e))), ie = W(() => {
			let e = (p.value?.keys ?? [])[p.value?.shown ?? -1];
			return e && !ne.has(e) ? e : re.value.at(-1);
		}), ae = (e) => void cC(n.mesid, c.value.structure, c.value.index, (p.value?.keys ?? []).indexOf(e)), oe = (e) => void lC(n.mesid, c.value.structure, c.value.index, e), w = /* @__PURE__ */ j(null), se = W(() => a ? WS.get(GS(a, c.value.structure, c.value.index)) : void 0), ce = W(() => se.value?.status === "running"), T = W(() => se.value?.status === "error" ? AC(se.value.error) : "");
		async function E() {
			_.value && (await sC(n.mesid, c.value.structure, c.value.index, {
				prompt: h.prompt,
				refs: h.refs,
				ratio: h.ratio || void 0,
				caption: h.caption
			}), g(f.value));
		}
		async function le() {
			await E(), r("close");
		}
		async function ue() {
			await E(), iC(n.mesid, c.value.structure, c.value.index);
		}
		let de = () => {
			a && aC(a, c.value.structure, c.value.index);
		};
		function fe(e) {
			e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.isComposing && (e.preventDefault(), ue());
		}
		return (e, t) => !o.value || !d.value ? (R(), z("div", VP, A(M(J)("media.image.gone")), 1)) : (R(), z("form", {
			key: 1,
			class: "image-panel col",
			onSubmit: gs(le, ["prevent"]),
			onKeydown: fe
		}, [
			s.value.length > 1 ? (R(), z("select", {
				key: 0,
				class: "input",
				value: l.value,
				"aria-label": M(J)("media.image.which"),
				disabled: _.value,
				onChange: t[0] ||= (e) => u(e.target.value)
			}, [(R(!0), z(L, null, I(s.value, (e, t) => (R(), z("option", {
				key: `${e.structure}:${e.index}`,
				value: `${e.structure}:${e.index}`
			}, A(M(J)("media.image.nth", { n: t + 1 })) + A(M(YS)(o.value, e.structure)[e.index]?.caption ? ` · ${M(YS)(o.value, e.structure)[e.index].caption}` : ""), 9, UP))), 128))], 40, HP)) : U("", !0),
			H($, {
				label: M(J)("media.image.prompt"),
				modified: m.value
			}, {
				default: N(() => [ur(V("textarea", {
					"onUpdate:modelValue": t[1] ||= (e) => h.prompt = e,
					class: "input image-panel-prompt",
					rows: "6"
				}, null, 512), [[os, h.prompt]])]),
				_: 1
			}, 8, ["label", "modified"]),
			H($, { label: M(J)("media.image.refs") }, {
				default: N(() => [x.value ? (R(), z("div", GP, [
					!S.value.length && !ee.value.length ? (R(), z("p", KP, A(M(J)("media.image.refs.empty")), 1)) : U("", !0),
					(R(!0), z(L, null, I(S.value, (e) => (R(), z("label", {
						key: e.id,
						class: "media-ref image-panel-ref",
						"data-ref": e.id
					}, [
						V("input", {
							type: "checkbox",
							checked: h.refs.includes(e.id),
							onChange: (t) => te(e.id, t.target.checked)
						}, null, 40, JP),
						H(FP, {
							"blob-key": e.blob,
							class: "media-ref-thumb",
							alt: e.description
						}, null, 8, ["blob-key", "alt"]),
						V("span", YP, A(e.id), 1),
						V("span", XP, A(e.description), 1)
					], 8, qP))), 128)),
					(R(!0), z(L, null, I(ee.value, (e) => (R(), z("label", {
						key: e,
						class: "media-ref image-panel-ref",
						"data-ref": e
					}, [
						V("input", {
							type: "checkbox",
							checked: "",
							onChange: (t) => te(e, !1)
						}, null, 40, QP),
						V("span", $P, A(e), 1),
						V("span", eF, A(M(J)("media.image.refs.unavailable")), 1)
					], 8, ZP))), 128))
				])) : (R(), z("p", WP, A(M(J)("media.image.refs.unsupported")), 1))]),
				_: 1
			}, 8, ["label"]),
			V("div", tF, [H($, { label: M(J)("media.image.ratio") }, {
				default: N(() => [ur(V("select", {
					"onUpdate:modelValue": t[2] ||= (e) => h.ratio = e,
					class: "input"
				}, [(R(!0), z(L, null, I(C.value, (e) => (R(), z("option", {
					key: e,
					value: e
				}, A(e || M(J)("media.image.ratio.auto")), 9, nF))), 128))], 512), [[ls, h.ratio]])]),
				_: 1
			}, 8, ["label"]), H($, {
				label: M(J)("media.image.caption"),
				class: "grow"
			}, {
				default: N(() => [ur(V("input", {
					"onUpdate:modelValue": t[3] ||= (e) => h.caption = e,
					class: "input"
				}, null, 512), [[os, h.caption]])]),
				_: 1
			}, 8, ["label"])]),
			H($, { label: M(J)("media.image.versions") }, {
				default: N(() => [re.value.length ? (R(), z("div", iF, [(R(!0), z(L, null, I(re.value, (e, t) => (R(), z("div", {
					key: e,
					class: k(["image-version", { on: e === ie.value }])
				}, [V("button", {
					type: "button",
					class: "image-version-pick",
					"aria-label": M(J)("media.image.show", { n: t + 1 }),
					"aria-pressed": e === ie.value,
					onClick: (t) => ae(e)
				}, [H(FP, {
					"blob-key": e,
					alt: M(J)("media.image.show", { n: t + 1 }),
					onMissing: (t) => ne.add(e)
				}, null, 8, [
					"blob-key",
					"alt",
					"onMissing"
				])], 8, aF), V("div", oF, [H(Q, {
					icon: M(mA),
					label: M(J)("media.image.view"),
					small: "",
					onClick: (e) => w.value = t
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), H(Q, {
					icon: M(mj),
					label: M(J)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: (t) => oe(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])])], 2))), 128))])) : (R(), z("p", rF, A(M(J)("media.image.versions.empty")), 1))]),
				_: 1
			}, 8, ["label"]),
			ce.value ? (R(), z("div", sF, [
				H(M(IA), {
					class: "spin",
					"aria-hidden": "true"
				}),
				V("span", cF, A(M(J)("media.image.generating")), 1),
				H(Q, {
					icon: M(wj),
					label: M(J)("common.cancel"),
					small: "",
					onClick: de
				}, null, 8, ["icon", "label"])
			])) : T.value ? (R(), z("p", lF, A(T.value), 1)) : U("", !0),
			V("div", uF, [
				V("button", {
					type: "button",
					class: "btn ghost sm-btn image-panel-restore",
					disabled: !v.value,
					onClick: y
				}, [H(M(tj)), ba(A(M(J)("media.image.restore")), 1)], 8, dF),
				V("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: t[4] ||= (e) => r("close")
				}, A(M(J)("common.cancel")), 1),
				V("button", {
					type: "submit",
					class: "btn sm-btn",
					disabled: !_.value
				}, A(M(J)("common.save")), 9, fF),
				V("button", {
					type: "button",
					class: "btn primary sm-btn",
					disabled: ce.value || !h.prompt.trim(),
					onClick: ue
				}, [H(M(xj)), ba(A(M(J)("media.image.saveGenerate")), 1)], 8, pF)
			]),
			w.value !== null && re.value.length ? (R(), B(BP, {
				key: 3,
				keys: re.value,
				start: Math.min(w.value, re.value.length - 1),
				caption: f.value?.caption ?? f.value?.prompt,
				onClose: t[5] ||= (e) => w.value = null
			}, null, 8, [
				"keys",
				"start",
				"caption"
			])) : U("", !0)
		], 32));
	}
});
//#endregion
//#region src/ui/media/image-panel.ts
function hF(e, t, n) {
	fM({
		component: mF,
		props: {
			mesid: e,
			structure: t,
			index: n
		},
		title: J("media.image.panel")
	});
}
//#endregion
//#region src/ui/message/cards/ImageFigure.vue?vue&type=script&setup=true&lang.ts
var gF = { class: "image-figure" }, _F = ["aria-label"], vF = {
	key: 1,
	class: "image-empty"
}, yF = {
	key: 1,
	class: "xs faint"
}, bF = { class: "image-prompt small muted" }, xF = {
	key: 2,
	class: "image-busy",
	role: "status"
}, SF = { class: "small" }, CF = {
	key: 3,
	class: "image-pager"
}, wF = { class: "xs" }, TF = { class: "image-foot" }, EF = ["title"], DF = {
	key: 1,
	class: "xs muted grow ellipsis"
}, OF = { class: "row tight image-tools" }, kF = /* @__PURE__ */ F({
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
		let t = e, n = W(() => t.record?.keys ?? []), r = /* @__PURE__ */ fn(/* @__PURE__ */ new Set());
		P(n, async (e) => {
			for (let t of e) !r.has(t) && !await Px(t).catch(() => !0) && r.add(t);
		}, { immediate: !0 });
		let i = W(() => n.value.filter((e) => !r.has(e))), a = W(() => {
			let e = n.value[t.record?.shown ?? -1], r = e ? i.value.indexOf(e) : -1;
			return r >= 0 ? r : i.value.length - 1;
		}), o = W(() => i.value[a.value]), s = W(() => !i.value.length && n.value.length > 0), c = W(() => t.record?.prompt ?? t.prompt.prompt), l = W(() => t.record?.caption ?? t.prompt.caption ?? ""), u = W(() => WS.get(GS(t.genId, t.structure, t.index))), d = W(() => u.value?.status === "running"), f = W(() => u.value?.status === "error" ? AC(u.value.error) : ""), p = W(() => (t.record?.ratio ?? t.prompt.ratio ?? "3:4").replace(":", " / ")), m = () => iC(t.mesid, t.structure, t.index), h = () => aC(t.genId, t.structure, t.index), g = (e) => {
			let r = i.value.length;
			r > 1 && cC(t.mesid, t.structure, t.index, n.value.indexOf(i.value[(a.value + e + r) % r]));
		}, _ = () => {
			o.value && lC(t.mesid, t.structure, t.index, o.value);
		};
		async function v() {
			let e = o.value, n = e ? await Nx(e) : void 0;
			if (!n) return;
			let r = (n.type.split("/")[1] ?? "png").replace("jpeg", "jpg").replace("svg+xml", "svg");
			YT(`image-${t.mesid}-${t.index + 1}-${a.value + 1}.${r}`, n);
		}
		let y = () => hF(t.mesid, t.structure, t.index), b = /* @__PURE__ */ j(!1);
		return (t, n) => (R(), z("figure", gF, [
			V("div", {
				class: k(["image-frame", { empty: !o.value }]),
				style: Ie(o.value ? void 0 : { aspectRatio: p.value })
			}, [
				o.value ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "image-open",
					"aria-label": M(J)("media.image.view"),
					onClick: n[1] ||= (e) => b.value = !0
				}, [H(FP, {
					"blob-key": o.value,
					alt: l.value || c.value,
					onMissing: n[0] ||= (e) => r.add(o.value)
				}, null, 8, ["blob-key", "alt"])], 8, _F)) : (R(), z("div", vF, [
					!d.value && !f.value ? (R(), B(M(OA), {
						key: 0,
						class: "faint",
						"aria-hidden": "true"
					})) : U("", !0),
					s.value && !d.value ? (R(), z("span", yF, A(M(J)("media.image.missing")), 1)) : U("", !0),
					V("p", bF, A(c.value), 1)
				])),
				d.value ? (R(), z("div", xF, [
					H(M(IA), {
						class: "spin",
						"aria-hidden": "true"
					}),
					V("span", SF, A(M(J)("media.image.generating")), 1),
					H(Q, {
						icon: M(wj),
						label: M(J)("common.cancel"),
						small: "",
						onClick: h
					}, null, 8, ["icon", "label"])
				])) : U("", !0),
				o.value && i.value.length > 1 && !d.value ? (R(), z("div", CF, [
					H(Q, {
						icon: M(Gk),
						label: M(J)("media.image.previous"),
						small: "",
						onClick: n[2] ||= (e) => g(-1)
					}, null, 8, ["icon", "label"]),
					V("span", wF, A(a.value + 1) + " / " + A(i.value.length), 1),
					H(Q, {
						icon: M(Kk),
						label: M(J)("media.image.next"),
						small: "",
						onClick: n[3] ||= (e) => g(1)
					}, null, 8, ["icon", "label"])
				])) : U("", !0)
			], 6),
			V("figcaption", TF, [f.value ? (R(), z("span", {
				key: 0,
				class: "xs text-danger grow image-error",
				title: f.value
			}, A(f.value), 9, EF)) : (R(), z("span", DF, A(l.value), 1)), V("div", OF, [
				!o.value && !d.value ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "btn sm-btn",
					onClick: m
				}, [H(M(xj)), ba(A(M(J)(f.value ? "media.image.retry" : "media.image.generate")), 1)])) : U("", !0),
				o.value && !d.value ? (R(), B(Q, {
					key: 1,
					icon: M($A),
					label: M(J)("media.image.regenerate"),
					small: "",
					onClick: m
				}, null, 8, ["icon", "label"])) : U("", !0),
				e.editable ? (R(), B(Q, {
					key: 2,
					icon: M(JA),
					label: M(J)("media.image.openPanel"),
					small: "",
					onClick: y
				}, null, 8, ["icon", "label"])) : U("", !0),
				o.value ? (R(), B(Q, {
					key: 3,
					icon: M(dA),
					label: M(J)("media.image.download"),
					small: "",
					onClick: v
				}, null, 8, ["icon", "label"])) : U("", !0),
				o.value && e.editable && !d.value ? (R(), B(Q, {
					key: 4,
					icon: M(mj),
					label: M(J)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: _
				}, null, 8, ["icon", "label"])) : U("", !0)
			])]),
			b.value && o.value ? (R(), B(BP, {
				key: 0,
				keys: i.value,
				start: a.value,
				caption: l.value || c.value,
				onClose: n[4] ||= (e) => b.value = !1
			}, null, 8, [
				"keys",
				"start",
				"caption"
			])) : U("", !0)
		]));
	}
}), AF = /* @__PURE__ */ F({
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
		return (t, n) => (R(), z("div", { class: k(["image-card", { multi: e.prompts.length > 1 }]) }, [(R(!0), z(L, null, I(e.prompts, (t, n) => (R(), B(kF, {
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
}), jF = /* @__PURE__ */ F({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = oO(() => t.mesid), r = W(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && kb.current?.genId === e.genId ? kb.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = hE(r), u = !(!i || e.live), d = q(o);
			for (let { decl: n } of UM(s, t.position)) {
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
						let t = i && !e.live && r.image ? Ec(a)?.images : void 0;
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
						let i = Hp(r, "structures", n.id, "title", n.title || n.id), o = Cl(n);
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
									name: Up(r),
									version: r.version
								},
								lang: Bp(),
								setValue: async (e) => u ? MM(f, s, e) : !1,
								fillInput: (e, t) => dE(String(e ?? ""), !!t, f)
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
				narrator: md(r, Wm(r), r.narrator),
				color: aO(r, r.narrator),
				items: c
			};
		}), i = W(() => t.position === "top" && n.value && !n.value.live ? $w(t.mesid) : []);
		return (t, n) => r.value?.items.length || i.value.length ? (R(), z("div", {
			key: 0,
			class: k(["cards", `cards-${e.position}`])
		}, [i.value.length ? (R(), B(OP, {
			key: 0,
			mesid: e.mesid,
			segments: i.value
		}, null, 8, ["mesid", "segments"])) : U("", !0), (R(!0), z(L, null, I(r.value ? r.value.items : [], (t) => (R(), z(L, { key: t.id }, [t.type === "reply" ? (R(), B(KM, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (R(), B(ZM, {
			key: 1,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (R(), B(nN, {
			key: 2,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (R(), B(jN, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => M(MM)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (R(), B(WN, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => M(MM)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (R(), B(oN, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (R(), B(mN, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (R(), B(JN, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (R(), B(iP, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : t.type === "image" ? (R(), B(AF, {
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
		])) : U("", !0)], 64))), 128))], 2)) : U("", !0);
	}
}), MF = {
	key: 0,
	class: "dock stages live"
}, NF = { class: "stage-bar" }, PF = { class: "ellipsis" }, FF = {
	key: 0,
	class: "small muted"
}, IF = /* @__PURE__ */ F({
	__name: "Dock",
	setup(e) {
		let t = W(() => kb.current && !kb.current.streaming && kb.current.status === "running" ? kb.current : null), n = W(() => {
			let e = t.value;
			if (!e) return [];
			let n = Mp(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: iO(n, e.workflow, t.id, t.label),
				color: aO(n, t.actor)
			}));
		}), r = W(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (R(), z("div", MF, [V("div", NF, [
			H(M(IA), { class: "spin faint" }),
			(R(!0), z(L, null, I(n.value, (e) => (R(), z("span", {
				key: e.id,
				class: k(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ie({ "--actor": e.color })
			}, [V("span", PF, A(e.label), 1)], 6))), 128)),
			n.value.length ? U("", !0) : (R(), z("span", FF, A(M(J)("stages.waiting")), 1))
		]), r.value ? (R(), B(AM, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : U("", !0)])) : U("", !0);
	}
}), LF = ["title"], RF = { class: "storyline-name" }, zF = {
	key: 0,
	class: "storyline-if"
}, BF = /* @__PURE__ */ F({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = W(() => {
			if (Y.chatRev, !nk.value) return null;
			let e = ik()[t.mesid];
			if (!e) return null;
			let n = Z_();
			return {
				key: e,
				name: tm(e, n) || J("storylines.unnamed"),
				if: $p(e, n),
				hidden: em(e, n)
			};
		});
		return (e, t) => n.value ? (R(), z("button", {
			key: 0,
			type: "button",
			class: k(["storyline-badge", { "if-line": n.value.if }]),
			title: M(J)("storylines.openTab"),
			onClick: t[0] ||= (e) => M(HS)(n.value.key)
		}, [
			H(M(CA), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			V("span", RF, A(n.value.name), 1),
			n.value.if ? (R(), z("span", zF, A(M(J)("storylines.ifLine")), 1)) : U("", !0),
			n.value.hidden ? (R(), B(M(pA), {
				key: 1,
				class: "lucide storyline-hidden",
				"aria-label": M(J)("storylines.hidden")
			}, null, 8, ["aria-label"])) : U("", !0)
		], 10, LF)) : U("", !0);
	}
}), VF = ["aria-label"], HF = ["disabled"], UF = /* @__PURE__ */ F({
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
			ur(V("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, HF), [[ss, t.value]]),
			r[1] ||= V("span", { class: "track" }, null, -1),
			r[2] ||= V("span", { class: "thumb" }, null, -1)
		], 10, VF));
	}
}), WF = { class: "swatches" }, GF = ["title"], KF = ["title"], qF = { class: "swatches" }, JF = ["title"], YF = /* @__PURE__ */ F({
	__name: "Appearance",
	setup(e) {
		let t = G().ui, n = (e) => W({
			get: () => t[e] ?? "",
			set: (n) => {
				t[e] = n || void 0, K();
			}
		}), r = n("primary"), i = n("accent"), a = W({
			get: () => t.collapseStages,
			set: (e) => {
				t.collapseStages = e, K();
			}
		}), o = () => {
			t.primary = void 0, t.accent = void 0, K();
		}, s = () => t.annotations ??= { show: !0 }, c = W({
			get: () => t.annotations?.show !== !1,
			set: (e) => {
				s().show = e, K();
			}
		}), l = W({
			get: () => t.annotations?.color ?? "",
			set: (e) => {
				s().color = e || void 0, K();
			}
		});
		return (e, t) => (R(), B(dN, {
			title: M(J)("appearance.title"),
			icon: M(GA),
			collapsible: "",
			open: !1
		}, {
			default: N(() => [
				H($, {
					label: M(J)("appearance.colors"),
					help: M(J)("appearance.colors.hint"),
					inline: ""
				}, {
					default: N(() => [V("div", WF, [
						V("label", {
							class: "swatch",
							style: Ie({ background: M(r) || "var(--ap-primary-500)" }),
							title: M(J)("appearance.primary")
						}, [ur(V("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ wn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							os,
							M(r),
							void 0,
							{ lazy: !0 }
						]])], 12, GF),
						V("label", {
							class: "swatch",
							style: Ie({ background: M(i) || "var(--ap-accent-500)" }),
							title: M(J)("appearance.accent")
						}, [ur(V("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ wn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							os,
							M(i),
							void 0,
							{ lazy: !0 }
						]])], 12, KF),
						H(Q, {
							icon: M(tj),
							label: M(J)("common.reset"),
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
					label: M(J)("appearance.collapseStages"),
					inline: ""
				}, {
					default: N(() => [H(UF, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				H($, {
					label: M(J)("appearance.annotations"),
					help: M(J)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: N(() => [H(UF, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (R(), B($, {
					key: 0,
					label: M(J)("appearance.annotationColor"),
					inline: ""
				}, {
					default: N(() => [V("div", qF, [V("label", {
						class: "swatch",
						style: Ie({ background: l.value || "var(--ap-accent)" }),
						title: M(J)("appearance.annotationColor")
					}, [ur(V("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						os,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, JF), H(Q, {
						icon: M(tj),
						label: M(J)("common.reset"),
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
				}, 8, ["label"])) : U("", !0)
			]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), XF = { class: "toolbar" }, ZF = ["disabled"], QF = ["disabled"], $F = { class: "preset-list" }, eI = ["onClick", "onKeydown"], tI = { class: "preset-mark" }, nI = { class: "grow col preset-info" }, rI = { class: "row wrap preset-head" }, iI = { class: "preset-name" }, aI = { class: "badge neutral" }, oI = { class: "badge neutral icon-badge" }, sI = {
	key: 0,
	class: "xs muted"
}, cI = {
	key: 1,
	class: "small muted preset-desc"
}, lI = {
	key: 0,
	class: "empty"
}, uI = /* @__PURE__ */ F({
	__name: "PresetsTab",
	setup(e) {
		let t = W(() => Op()), n = (e) => mu(e.preset).length > 0, r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(""), o = /* @__PURE__ */ j(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && x("success", n);
			} catch (e) {
				yE(e) || kE(e) ? x("info", e.message) : x("error", e instanceof Error ? e.message : String(e), J("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await yh(e.preset), LS();
		}), l = () => s("url", async () => {
			let e = await FE(a.value);
			return a.value = "", i.value = !1, e;
		}, J("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => IE(t), J("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => RE(e.preset.id), J("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => nE(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => HE(e.preset.id)), m = () => s("ext", async () => x("info", await $b() === "current" ? J("update.none") : J("update.reloading")));
		return (e, s) => (R(), z(L, null, [
			V("div", XF, [
				V("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [H(M(_j)), ba(A(M(J)("presets.importFile")), 1)], 8, ZF),
				V("button", {
					type: "button",
					class: k(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [H(M(PA)), ba(A(M(J)("presets.importUrl")), 1)], 2),
				s[4] ||= V("span", { class: "grow" }, null, -1),
				H(Q, {
					icon: r.value === "ext" ? M(IA) : M($A),
					label: M(J)("presets.checkUpdates"),
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
				onSubmit: gs(l, ["prevent"])
			}, [ur(V("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[os, a.value]]), V("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (R(), B(M(IA), {
				key: 0,
				class: "spin"
			})) : (R(), B(M(dA), { key: 1 })), ba(A(M(J)("common.install")), 1)], 8, QF)], 32)) : U("", !0),
			V("div", $F, [(R(!0), z(L, null, I(t.value, (e) => (R(), z("div", {
				key: e.preset.id,
				class: k(["preset-item", { on: M(RS)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: vs((t) => c(e), ["enter"])
			}, [
				V("span", tI, [r.value === `select:${e.preset.id}` ? (R(), B(M(IA), {
					key: 0,
					class: "spin"
				})) : M(RS)?.id === e.preset.id ? (R(), B(M(Uk), { key: 1 })) : U("", !0)]),
				V("div", nI, [
					V("div", rI, [
						V("span", iI, A(M(Up)(e.preset)), 1),
						V("span", aI, "v" + A(e.preset.version), 1),
						e.source === "builtin" ? U("", !0) : (R(), z("span", {
							key: 0,
							class: k(["badge", { warn: e.source === "dev" }])
						}, A(M(J)(`presets.source.${e.source}`)), 3)),
						n(e) ? (R(), B(Ej, {
							key: 1,
							text: M(J)("presets.templates.help")
						}, {
							default: N(() => [V("span", oI, [H(M(iA)), ba(A(M(J)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : U("", !0)
					]),
					e.preset.author ? (R(), z("span", sI, A(e.preset.author), 1)) : U("", !0),
					M(Wp)(e.preset) ? (R(), z("span", cI, A(M(Wp)(e.preset)), 1)) : U("", !0)
				]),
				V("div", {
					class: "row preset-actions",
					onClick: s[3] ||= gs(() => {}, ["stop"])
				}, [
					H(Q, {
						icon: M(gA),
						label: M(J)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					M(LE)(e.preset.id) ? (R(), B(Q, {
						key: 0,
						icon: M($A),
						label: M(J)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : U("", !0),
					e.source === "installed" ? (R(), B(Q, {
						key: 1,
						icon: M(mj),
						label: M(J)("common.delete"),
						align: "end",
						small: "",
						danger: "",
						onClick: (t) => p(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : U("", !0)
				])
			], 42, eI))), 128)), t.value.length ? U("", !0) : (R(), z("div", lI, A(M(J)("presets.none")), 1))]),
			H(YF)
		], 64));
	}
}), dI;
function fI() {
	let e = RS, t = W(() => e.value ? Wm(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (Km(r, t), n.sampling && (clearTimeout(dI), dI = setTimeout(() => void bh(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var pI = { class: "empty" }, mI = /* @__PURE__ */ F({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (R(), z("div", pI, [
			H(M(WA)),
			V("span", null, A(M(J)("panel.noPreset")), 1),
			V("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => M(Y).tab = "presets"
			}, A(M(J)("panel.choosePreset")), 1)
		]));
	}
}), hI = [
	"aria-checked",
	"title",
	"onClick"
], gI = { class: "ellipsis" }, _I = /* @__PURE__ */ F({
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
		}, [e.icon ? (R(), B($r(e.icon), { key: 0 })) : U("", !0), V("span", gI, A(e.label), 1)], 10, hI))), 128))], 2));
	}
}), vI = { class: "col" }, yI = { class: "row" }, bI = ["aria-label"], xI = ["label"], SI = ["value"], CI = ["label"], wI = ["value"], TI = ["placeholder"], EI = {
	key: 1,
	class: "xs muted row tight"
}, DI = { value: "" }, OI = ["value"], kI = ["value"], AI = ["value"], jI = ["value"], MI = [
	"value",
	"placeholder",
	"onChange"
], NI = [
	"value",
	"placeholder",
	"onChange"
], PI = ["value"], FI = ["value"], II = ["value"], LI = ["value"], RI = ["value"], zI = {
	key: 0,
	class: "xs muted"
}, BI = { class: "custom-ui-list small" }, VI = { class: "grow ellipsis" }, HI = { class: "xs faint" }, UI = { class: "slider" }, WI = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], GI = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], KI = { class: "field-grid" }, qI = ["value", "onChange"], JI = ["value"], YI = ["value"], XI = /* @__PURE__ */ F({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = fI(), i = W(() => t.value ? Vm(t.value) : null), a = W({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				qm(n, {
					kind: r,
					id: i.join(":")
				}), bh(n);
			}
		}), o = W(() => {
			let e = t.value;
			return e ? wl(e).map((t) => ({
				id: t.id,
				title: Hp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = W({
			get: () => t.value ? hE(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = kp(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? _E(n, e) : EE(n);
			}
		}), c = W(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== El(t.value));
		}), l = W(() => t.value ? Jm(t.value) : !1), u = W(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ j(null), f = /* @__PURE__ */ j("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? Xm(e, n) : u.value && Qm(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Ym(t.value), bh(t.value));
		}, g = () => {
			t.value && u.value && ($m(t.value, u.value), bh(t.value));
		}, _ = () => {
			t.value && u.value && Zm(t.value, u.value);
		}, v = W(() => Ds.map((e) => ({
			value: e,
			label: J(`transport.${e}`),
			hint: J(`transport.${e}.hint`)
		}))), y = W({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), b = W(() => y.value === "tool-single" || y.value === "tool-multi"), x = W(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), S = W(() => x.value.map((e) => ({
			value: e.id,
			label: Hp(t.value, "workflows", e.id, "name", e.name),
			hint: Hp(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), ee = W({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), te = W(() => S.value.find((e) => e.value === ee.value)?.hint);
		function C(e) {
			return W({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let ne = C("forceTool"), re = C("parallelTools"), ie = W({
			get: () => n.value ? bu(n.value.connection) : "off",
			set: (e) => r((t) => {
				t.connection.sendThoughtSignature = e !== "off" && e;
			})
		}), ae = C("openAiSignatures"), oe = C("streamToolArguments"), w = C("finalFallback"), se = C("maxSteps"), ce = C("assumeToolSupport"), T = W({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), E = W(() => Object.entries(t.value?.actors ?? {})), le = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), ue = W({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), de = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), fe = W(() => Ms.map((e) => ({
			value: e,
			label: J(`writing.userInput.${e}`),
			hint: J(`writing.userInput.${e}.hint`)
		}))), D = W({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), O = W({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), pe = W({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...Ju,
					...t.storylines,
					enabled: e
				};
			})
		}), me = W(() => qu.map((e) => ({
			value: e,
			label: J(`storylines.freeze.${e}`),
			hint: J(`storylines.freeze.${e}.hint`)
		}))), he = W({
			get: () => Yu(n.value?.storylines),
			set: (e) => r((t) => {
				t.storylines = {
					...Ju,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), ge = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), _e = W({
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
		], Ce = W(() => n.value?.sampling ?? {}), we = (e) => e in Ce.value, Te = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), Ee = (e) => Number(e.target.value);
		return (e, r) => !M(t) || !M(n) || !i.value ? (R(), B(mI, { key: 0 })) : (R(), z(L, { key: 1 }, [
			V("div", vI, [
				V("div", yI, [
					ur(V("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": M(J)("config.configuration")
					}, [V("optgroup", { label: M(J)("config.recommended") }, [(R(!0), z(L, null, I(M(t).configurations, (e) => (R(), z("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, A(M(Hp)(M(t), "configurations", e.id, "name", e.name)), 9, SI))), 128))], 8, xI), i.value.saved.length ? (R(), z("optgroup", {
						key: 0,
						label: M(J)("config.saved")
					}, [(R(!0), z(L, null, I(i.value.saved, (e) => (R(), z("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, A(e.name), 9, wI))), 128))], 8, CI)) : U("", !0)], 8, bI), [[ls, a.value]]),
					u.value && l.value ? (R(), B(Q, {
						key: 0,
						icon: M(nj),
						label: M(J)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : U("", !0),
					H(Q, {
						icon: M(XA),
						label: M(J)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (R(), B(Q, {
						key: 1,
						icon: M(JA),
						label: M(J)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : U("", !0),
					u.value ? (R(), B(Q, {
						key: 2,
						icon: M(mj),
						label: M(J)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : U("", !0),
					H(Q, {
						icon: M(tj),
						label: M(J)("config.reset"),
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
					onSubmit: gs(m, ["prevent"])
				}, [
					ur(V("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: M(J)("config.name"),
						autofocus: ""
					}, null, 8, TI), [[os, f.value]]),
					H(Q, {
						icon: M(wj),
						label: M(J)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					H(Q, {
						icon: M(Uk),
						label: M(J)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : U("", !0),
				l.value ? (R(), z("span", EI, [r[29] ||= V("span", { class: "dot modified" }, null, -1), ba(A(M(J)("config.modified")), 1)])) : U("", !0)
			]),
			H(dN, {
				title: M(J)("config.connection"),
				icon: M(Vk)
			}, {
				default: N(() => [
					H($, {
						label: M(J)("config.transport"),
						help: M(J)(`transport.${y.value}.hint`)
					}, {
						default: N(() => [H(_I, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (R(), z(L, { key: 0 }, [
						H($, {
							label: M(J)("config.forceTool"),
							help: M(J)("config.forceTool.hint"),
							inline: ""
						}, {
							default: N(() => [H(UF, {
								modelValue: M(ne),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ wn(ne) ? ne.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(J)("config.parallelTools"),
							help: M(J)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: N(() => [H(UF, {
								modelValue: M(re),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ wn(re) ? re.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(J)("config.syntheticTurn"),
							help: M(J)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: N(() => [ur(V("select", {
								"onUpdate:modelValue": r[8] ||= (e) => T.value = e,
								class: "input"
							}, [V("option", DI, A(M(J)("common.none")), 1), (R(!0), z(L, null, I(M(t).syntheticTurns, (e) => (R(), z("option", {
								key: e.id,
								value: e.id
							}, A(e.label), 9, OI))), 128))], 512), [[ls, T.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(J)("config.thoughtSignature"),
							help: M(J)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: N(() => [ur(V("select", {
								"onUpdate:modelValue": r[9] ||= (e) => ie.value = e,
								class: "input"
							}, [(R(!0), z(L, null, I(M(ks), (e) => (R(), z("option", {
								key: e,
								value: e
							}, A(M(J)(`config.thoughtSignature.${e}`)), 9, kI))), 128))], 512), [[ls, ie.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(J)("config.openAiSignatures"),
							help: M(J)("config.openAiSignatures.hint"),
							inline: ""
						}, {
							default: N(() => [H(UF, {
								modelValue: M(ae),
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ wn(ae) ? ae.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(J)("config.streamToolArguments"),
							help: M(J)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: N(() => [ur(V("select", {
								"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ wn(oe) ? oe.value = e : null,
								class: "input"
							}, [(R(!0), z(L, null, I(M(Os), (e) => (R(), z("option", {
								key: e,
								value: e
							}, A(M(J)(`config.streamToolArguments.${e}`)), 9, AI))), 128))], 512), [[ls, M(oe)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (R(), B($, {
							key: 0,
							label: M(J)("config.maxSteps"),
							inline: ""
						}, {
							default: N(() => [V("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: M(se),
								onChange: r[12] ||= (e) => se.value = Ee(e)
							}, null, 40, jI)]),
							_: 1
						}, 8, ["label"])) : U("", !0),
						H($, {
							label: M(J)("config.assumeToolSupport"),
							help: M(J)("config.assumeToolSupport.hint"),
							inline: ""
						}, {
							default: N(() => [H(UF, {
								modelValue: M(ce),
								"onUpdate:modelValue": r[13] ||= (e) => /* @__PURE__ */ wn(ce) ? ce.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"])
					], 64)) : U("", !0),
					H($, {
						label: M(J)("config.finalFallback"),
						help: M(J)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: N(() => [H(UF, {
							modelValue: M(w),
							"onUpdate:modelValue": r[14] ||= (e) => /* @__PURE__ */ wn(w) ? w.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			S.value.length > 1 ? (R(), B(dN, {
				key: 0,
				title: M(J)("config.workflow"),
				icon: M(Cj),
				help: te.value
			}, {
				default: N(() => [H(_I, {
					modelValue: ee.value,
					"onUpdate:modelValue": r[15] ||= (e) => ee.value = e,
					options: S.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(dN, {
				title: M(J)("writing.actors"),
				icon: M(fA),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [(R(!0), z(L, null, I(E.value, ([e, t]) => (R(), z("div", {
					key: e,
					class: "field-grid"
				}, [H($, { label: M(J)("writing.actorName", { actor: e }) }, {
					default: N(() => [V("input", {
						class: "input",
						value: M(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => le("names", e, t.target.value)
					}, null, 40, MI)]),
					_: 2
				}, 1032, ["label"]), H($, { label: M(J)("writing.actorPrefix") }, {
					default: N(() => [V("input", {
						class: "input",
						value: M(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => le("prefixes", e, t.target.value)
					}, null, 40, NI)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(dN, {
				title: M(J)("writing.meta"),
				icon: M(BA),
				help: M(J)("writing.meta.hint")
			}, {
				actions: N(() => [H(UF, {
					modelValue: O.value,
					"onUpdate:modelValue": r[16] ||= (e) => O.value = e,
					label: M(J)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [O.value ? (R(), B($, {
					key: 0,
					label: M(J)("writing.recentCount"),
					help: M(J)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: N(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: M(n).meta.recentCount,
						onChange: r[17] ||= (e) => ge(e.target.value)
					}, null, 40, PI)]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			M(t).storylines ? (R(), B(dN, {
				key: 1,
				title: M(J)("storylines.enabled"),
				icon: M(CA),
				help: M(J)("storylines.config.hint")
			}, {
				actions: N(() => [H(UF, {
					modelValue: pe.value,
					"onUpdate:modelValue": r[18] ||= (e) => pe.value = e,
					label: M(J)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [pe.value ? (R(), B($, {
					key: 0,
					label: M(J)("storylines.freezeVariables"),
					help: M(J)("storylines.freezeVariables.hint")
				}, {
					default: N(() => [H(_I, {
						modelValue: he.value,
						"onUpdate:modelValue": r[19] ||= (e) => he.value = e,
						options: me.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(dN, {
				title: M(J)("writing.tokenSaving"),
				icon: M(oA),
				help: M(J)("writing.tokenSaving.hint")
			}, {
				actions: N(() => [H(UF, {
					modelValue: ue.value,
					"onUpdate:modelValue": r[20] ||= (e) => ue.value = e,
					label: M(J)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [ue.value ? (R(), z(L, { key: 0 }, [
					H($, {
						label: M(J)("writing.keepFullTurns"),
						help: M(J)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: N(() => [V("input", {
							class: "input",
							type: "number",
							min: "0",
							value: M(n).tokenSaving.keepFullTurns,
							onChange: r[21] ||= (e) => de("keepFullTurns", e.target.value)
						}, null, 40, FI)]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: M(J)("writing.userInput"),
						help: M(J)("writing.userInput.hint")
					}, {
						default: N(() => [H(_I, {
							modelValue: D.value,
							"onUpdate:modelValue": r[22] ||= (e) => D.value = e,
							options: fe.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					D.value === "truncate" ? (R(), B($, {
						key: 0,
						label: M(J)("writing.truncateUserAfter"),
						help: M(J)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: N(() => [V("input", {
							class: "input",
							type: "number",
							min: "0",
							value: M(n).tokenSaving.truncateUserAfter,
							onChange: r[23] ||= (e) => de("truncateUserAfter", e.target.value)
						}, null, 40, II)]),
						_: 1
					}, 8, ["label", "help"])) : U("", !0)
				], 64)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dN, {
				title: M(J)("writing.cache"),
				icon: M(uA),
				help: M(J)("writing.cache.hint")
			}, {
				actions: N(() => [H(UF, {
					modelValue: _e.value,
					"onUpdate:modelValue": r[24] ||= (e) => _e.value = e,
					label: M(J)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [_e.value ? (R(), z(L, { key: 0 }, [H($, {
					label: M(J)("writing.cacheTtl"),
					help: M(J)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: N(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						value: M(n).cache.ttlMinutes,
						onChange: r[25] ||= (e) => ve("ttlMinutes", e.target.value)
					}, null, 40, LI)]),
					_: 1
				}, 8, ["label", "help"]), H($, {
					label: M(J)("writing.cacheMaxDeferred"),
					help: M(J)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: N(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						value: M(n).cache.maxDeferredTurns,
						onChange: r[26] ||= (e) => ve("maxDeferredTurns", e.target.value)
					}, null, 40, RI)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (R(), B(dN, {
				key: 2,
				title: M(J)("config.customUi"),
				icon: M(ZA),
				help: M(J)("config.customUi.hint")
			}, {
				actions: N(() => [H(UF, {
					modelValue: s.value,
					"onUpdate:modelValue": r[27] ||= (e) => s.value = e,
					label: M(J)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [c.value && !s.value ? (R(), z("p", zI, A(M(J)("config.customUi.changed")), 1)) : U("", !0), V("ul", BI, [(R(!0), z(L, null, I(o.value, (e) => (R(), z("li", {
					key: e.id,
					class: "row tight"
				}, [V("span", VI, A(e.title), 1), V("span", HI, A(M(J)(`config.customUi.${e.mode}`)) + " · " + A(M(J)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(dN, {
				title: M(J)("config.sampling"),
				icon: M(SA),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [
					(R(), z(L, null, I(ye, (e) => (R(), z(L, { key: e.key }, [we(e.key) ? (R(), B($, {
						key: 0,
						label: M(J)(`sampling.${e.key}`)
					}, {
						default: N(() => [V("div", UI, [V("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: Ce.value[e.key],
							onInput: (t) => Te(e.key, Ee(t))
						}, null, 40, WI), V("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: Ce.value[e.key],
							onChange: (t) => Te(e.key, Ee(t))
						}, null, 40, GI)])]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64)),
					V("div", KI, [(R(), z(L, null, I(be, (e) => (R(), z(L, { key: e }, [we(e) ? (R(), B($, {
						key: 0,
						label: M(J)(`sampling.${e}`)
					}, {
						default: N(() => [V("input", {
							class: "input",
							type: "number",
							value: Ce.value[e],
							onChange: (t) => Te(e, Ee(t))
						}, null, 40, qI)]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64)), we("reasoning_effort") ? (R(), B($, {
						key: 0,
						label: M(J)("sampling.reasoning_effort")
					}, {
						default: N(() => [V("select", {
							class: "input",
							value: Ce.value.reasoning_effort,
							onChange: r[28] ||= (e) => Te("reasoning_effort", e.target.value)
						}, [(R(), z(L, null, I(Se, (e) => V("option", {
							key: e,
							value: e
						}, A(M(J)(`effort.${e}`)), 9, YI)), 64))], 40, JI)]),
						_: 1
					}, 8, ["label"])) : U("", !0)]),
					(R(), z(L, null, I(xe, (e) => (R(), z(L, { key: e }, [we(e) ? (R(), B($, {
						key: 0,
						label: M(J)(`sampling.${e}`),
						inline: ""
					}, {
						default: N(() => [H(UF, {
							"model-value": !!Ce.value[e],
							"onUpdate:modelValue": (t) => Te(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), ZI = ["aria-label"], QI = { class: "um-picker-head" }, $I = { class: "small muted" }, eL = { class: "um-choice-text" }, tL = { class: "xs muted" }, nL = ["data-template", "onClick"], rL = { class: "um-choice-text" }, iL = {
	key: 0,
	class: "xs muted um-choice-desc"
}, aL = /* @__PURE__ */ F({
	__name: "UserModulePicker",
	props: { templates: {} },
	emits: [
		"blank",
		"template",
		"cancel"
	],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ j(null);
		return Jr(() => void Xn(() => r.value?.querySelector(".um-choice")?.focus())), (t, i) => (R(), z("div", {
			ref_key: "el",
			ref: r,
			class: "um-picker",
			role: "group",
			"aria-label": M(J)("um.startFrom"),
			onKeydown: i[2] ||= vs(gs((e) => n("cancel"), ["stop"]), ["esc"])
		}, [
			V("div", QI, [V("span", $I, A(M(J)("um.startFrom")), 1), H(Q, {
				icon: M(wj),
				label: M(J)("common.cancel"),
				small: "",
				align: "end",
				onClick: i[0] ||= (e) => n("cancel")
			}, null, 8, ["icon", "label"])]),
			V("button", {
				type: "button",
				class: "um-choice",
				onClick: i[1] ||= (e) => n("blank")
			}, [H(M(vA)), V("span", eL, [V("span", null, A(M(J)("um.blank")), 1), V("span", tL, A(M(J)("um.blank.desc")), 1)])]),
			(R(!0), z(L, null, I(e.templates, (e) => (R(), z("button", {
				key: e.tpl.id,
				type: "button",
				class: "um-choice",
				"data-template": e.tpl.id,
				onClick: (t) => n("template", e.tpl)
			}, [H(M(NA)), V("span", rL, [V("span", null, A(e.body.name), 1), e.body.description ? (R(), z("span", iL, A(e.body.description), 1)) : U("", !0)])], 8, nL))), 128))
		], 40, ZI));
	}
}), oL = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function sL(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: J("config.transport"),
			options: t([...Ds], (e) => J(`transport.${e}`))
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
				label: Hp(e, "workflows", t.id, "name", t.name)
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
			options: t(oL, (e) => J(`um.genType.${e}`))
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
		},
		...e.inputShaping ? { "input.shaped": {
			kind: "bool",
			label: J("um.var.inputShaped")
		} } : {},
		...e.image ? { "image.on": {
			kind: "bool",
			label: J("um.var.imageOn")
		} } : {},
		...e.speech ? { "speech.on": {
			kind: "bool",
			label: J("um.var.speechOn")
		} } : {}
	};
}
var cL = (e) => e.modules.filter((e) => e.toggle === "user");
function lL(e) {
	let t = sL(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return cL(e).length && r.push({
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
				"meta.pure",
				"input.shaped",
				"image.on",
				"speech.on"
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
function uL(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function dL(e, t) {
	return t === "module" ? cL(e).map((t) => ({
		value: t.id,
		label: Hp(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Hp(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function fL(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: dL(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Hp(e, "params", t.id, "label", t.label) : r;
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
			label: pL(e, t.id, n.value, n.label)
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
	return sL(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var pL = (e, t, n, r) => Vp(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), mL = {
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
function hL(e, t) {
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
		let n = String(dL(e, t)[0]?.value ?? "");
		return gL(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return gL(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function gL(e, t, n) {
	let r = fL(e, n);
	return t.path && fL(e, t.path).kind === r.kind && mL[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function _L(e, t, n = "") {
	return e === "bool" ? J(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? J(`um.op.list.${t}`) : e === "enum" ? J(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var vL = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(J("um.or")) : t === void 0 ? "" : n(t);
};
function yL(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? J("um.kw.input") : J("um.kw.recentN", { n: t.depth ?? 3 })} ${J(`um.kw.${t.op}`)} ${t.words.join(J("um.or"))}`;
	let n = fL(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? J("um.boolDesc", {
		label: n.label,
		value: _L(n.kind, t.op, t.path)
	}) : `${n.label} ${_L(n.kind, t.op)} ${vL(n, t.value)}`;
}
function bL(e, t) {
	let n = t.rules.filter(ff);
	return n.length ? n.map((t) => yL(e, t)).join(t.match === "any" ? `\n${J("um.match.anyJoin")} ` : `\n${J("um.match.allJoin")} `) : J("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModuleRow.vue?vue&type=script&setup=true&lang.ts
var xL = ["data-id"], SL = ["aria-label"], CL = { class: "um-row-name ellipsis" }, wL = { class: "um-row-meta xs muted ellipsis" }, TL = [
	"aria-checked",
	"aria-label",
	"title"
], EL = /* @__PURE__ */ F({
	__name: "UserModuleRow",
	props: {
		preset: {},
		module: {},
		single: { type: Boolean },
		grip: { type: Boolean },
		dragging: { type: Boolean }
	},
	emits: [
		"open",
		"toggle",
		"grab"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Hp(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, a = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Hp(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, o = (e) => [...new Set(e.entries.filter(nf).map((e) => e.point))].map(i).concat(e.vars.filter(nf).map((e) => a(e.var))).join(" · "), s = (e) => Tf(n.preset, e), c = (e) => e.trigger.rules.some(ff);
		return (t, n) => (R(), z("div", {
			class: k(["um-row", {
				off: !e.module.enabled,
				dragging: e.dragging
			}]),
			"data-id": e.module.id
		}, [
			e.grip ? (R(), z("span", {
				key: 0,
				class: "um-grip",
				"aria-label": M(J)("um.reorder"),
				onPointerdown: n[0] ||= (e) => r("grab", e)
			}, [H(M(EA))], 40, SL)) : U("", !0),
			V("button", {
				type: "button",
				class: "um-open",
				onClick: n[1] ||= (e) => r("open")
			}, [V("span", CL, A(e.module.name || M(J)("um.untitled")), 1), V("span", wL, A(o(e.module) || M(J)("um.noEntries")), 1)]),
			s(e.module).length ? (R(), B(Ej, {
				key: 1,
				text: M(J)("um.lostHint", { points: s(e.module).join(", ") }),
				align: "end"
			}, {
				default: N(() => [H(M(hj), {
					class: "text-warning um-flag",
					tabindex: "0"
				})]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			c(e.module) ? (R(), B(Ej, {
				key: 2,
				text: M(bL)(e.preset, e.module.trigger),
				align: "end"
			}, {
				default: N(() => [H(M(Tj), {
					class: "um-flag um-zap",
					tabindex: "0"
				})]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			e.single ? (R(), z("button", {
				key: 3,
				type: "button",
				role: "radio",
				class: k(["um-radio", { on: e.module.enabled }]),
				"aria-checked": e.module.enabled,
				"aria-label": e.module.name,
				title: M(J)(e.module.enabled ? "um.grp.radioOff" : "um.grp.radioOn"),
				onClick: n[2] ||= (t) => r("toggle", !e.module.enabled)
			}, [...n[4] ||= [V("span", { class: "radio" }, null, -1)]], 10, TL)) : (R(), B(UF, {
				key: 4,
				"model-value": e.module.enabled,
				label: e.module.name,
				"onUpdate:modelValue": n[3] ||= (e) => r("toggle", e)
			}, null, 8, ["model-value", "label"]))
		], 10, xL));
	}
}), DL = {
	key: 0,
	class: "um-list",
	"data-zone": ""
}, OL = {
	key: 0,
	class: "um-drop xs muted"
}, kL = [
	"data-group",
	"data-zone",
	"data-collapsed"
], AL = { class: "um-group-head" }, jL = ["aria-label", "onPointerdown"], ML = [
	"value",
	"placeholder",
	"aria-label",
	"onInput"
], NL = ["title"], PL = ["aria-label"], FL = { class: "small grow" }, IL = ["onClick"], LL = ["onClick"], RL = ["role", "aria-label"], zL = {
	key: 0,
	class: "um-drop xs muted"
}, BL = {
	key: 3,
	class: "faint small"
}, VL = /* @__PURE__ */ F({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => ig(n.preset)), a = W(() => ag(n.preset).map((e) => ({
			g: e,
			members: bf(i.value, e.id)
		}))), o = W(() => bf(i.value, null)), s = W(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), c = W(() => !i.value.length && !a.value.length), l = W(() => i.value.length > 1 || a.value.length > 0), u = (e, t) => vg(n.preset, e, t), d = W(() => Yf(n.preset).map((e) => ({
			tpl: e,
			body: Gp(n.preset, e, "userModuleTemplates")
		}))), f = /* @__PURE__ */ j(void 0), p = (e) => e ?? void 0;
		function m(e) {
			f.value = void 0, r("open", mg(n.preset, J("um.newName", { n: i.value.length + 1 }), p(e)).id);
		}
		function h(e, t) {
			f.value = void 0, r("open", hg(n.preset, Gp(n.preset, t, "userModuleTemplates"), p(e) ?? t.group).id);
		}
		function g(e) {
			if (e && Cg(n.preset, e, !1), !d.value.length) return m(e);
			f.value = f.value === e ? void 0 : e;
		}
		let _ = /* @__PURE__ */ j(null), v = (e) => _.value?.querySelector(`.um-group[data-group="${CSS.escape(e)}"] .um-group-name`);
		async function y() {
			let e = bg(n.preset, J("um.grp.newName", { n: a.value.length + 1 }));
			await Xn(), v(e.id)?.select();
		}
		let b = (e, t) => xg(n.preset, e.id, t.target.value), S = (e) => Sg(n.preset, e.id, e.mode === "single" ? "multi" : "single"), ee = (e) => Cg(n.preset, e.id, !e.collapsed), te = (e) => KT(`${n.preset.id}.${JT(e.name)}.ap-modules.json`, Dg(n.preset, e.id)), C = /* @__PURE__ */ j(null);
		function ne(e, t) {
			t ? C.value = C.value === e.id ? null : e.id : Tg(n.preset, e.id, { withModules: !1 });
		}
		function re(e, t) {
			C.value = null, Tg(n.preset, e.id, { withModules: t });
		}
		let ie = /* @__PURE__ */ j(null);
		async function ae(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await TE(Gf(e).modules);
				let { added: t, groups: i, missing: a } = Og(n.preset, e), o = i.length ? J("um.importedGroups", {
					n: t.length,
					groups: i.length
				}) : J("um.imported", { n: t.length });
				x(a ? "warning" : "success", a ? `${o} ${J("um.importedMissing", { missing: a })}` : o);
			} catch (e) {
				yE(e) ? x("info", e.message) : x("error", J("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let oe = () => KT(`${n.preset.id}.ap-modules.json`, Eg(n.preset)), w = /* @__PURE__ */ j(null);
		function se(e, t, n) {
			e.button === 0 && (e.preventDefault(), w.value = {
				kind: t,
				id: n
			}, window.addEventListener("pointermove", E), window.addEventListener("pointerup", le), window.addEventListener("pointercancel", le));
		}
		function ce(e) {
			let t, n = Infinity;
			for (let r of _.value?.querySelectorAll("[data-zone]") ?? []) {
				let i = r.getBoundingClientRect(), a = e < i.top ? i.top - e : e > i.bottom ? e - i.bottom : 0;
				a < n && (t = r, n = a);
			}
			return t;
		}
		let T = (e, t) => e.filter((e) => {
			let n = e.getBoundingClientRect();
			return n.top + n.height / 2 < t;
		}).length;
		function E(e) {
			let t = w.value;
			if (!t) return;
			if (t.kind === "group") {
				let r = [..._.value?.querySelectorAll(".um-group") ?? []].filter((e) => e.dataset.group !== t.id);
				wg(n.preset, t.id, T(r, e.clientY));
				return;
			}
			let r = ce(e.clientY);
			if (!r) return;
			let i = r.dataset.zone || null, a = [...r.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t.id);
			yg(n.preset, t.id, i, r.dataset.collapsed === void 0 ? T(a, e.clientY) : Infinity);
		}
		function le() {
			w.value = null, window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", le), window.removeEventListener("pointercancel", le);
		}
		Xr(le);
		let ue = (e) => w.value?.kind === "module" && w.value.id === e;
		return (t, n) => (R(), B(dN, {
			title: M(J)("um.title"),
			help: M(J)("um.help")
		}, {
			actions: N(() => [
				s.value ? (R(), B(Q, {
					key: 0,
					icon: M(_j),
					label: M(J)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => ie.value?.click()
				}, null, 8, ["icon", "label"])) : U("", !0),
				c.value ? U("", !0) : (R(), B(Q, {
					key: 1,
					icon: M(dA),
					label: M(J)("um.exportAll"),
					small: "",
					align: "end",
					onClick: oe
				}, null, 8, ["icon", "label"])),
				s.value ? (R(), B(Q, {
					key: 2,
					icon: M(bA),
					label: M(J)("um.grp.new"),
					small: "",
					align: "end",
					onClick: y
				}, null, 8, ["icon", "label"])) : U("", !0),
				s.value && !c.value ? (R(), B(Q, {
					key: 3,
					icon: M(XA),
					label: M(J)("um.new"),
					active: f.value === null,
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => g(null)
				}, null, 8, [
					"icon",
					"label",
					"active"
				])) : U("", !0)
			]),
			default: N(() => [
				f.value === null ? (R(), B(aL, {
					key: 0,
					templates: d.value,
					onBlank: n[2] ||= (e) => m(null),
					onTemplate: n[3] ||= (e) => h(null, e),
					onCancel: n[4] ||= (e) => f.value = void 0
				}, null, 8, ["templates"])) : U("", !0),
				c.value ? s.value && f.value === void 0 ? (R(), z("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: n[8] ||= (e) => g(null)
				}, [H(M(XA)), ba(A(M(J)("um.new")), 1)])) : s.value ? U("", !0) : (R(), z("div", BL, A(M(J)("um.noPoints")), 1)) : (R(), z("div", {
					key: 1,
					ref_key: "root",
					ref: _,
					class: k(["um-groups", { "um-dragging": w.value }])
				}, [o.value.length || a.value.length && w.value?.kind === "module" ? (R(), z("div", DL, [(R(!0), z(L, null, I(o.value, (t) => (R(), B(EL, {
					key: t.id,
					preset: e.preset,
					module: t,
					grip: l.value,
					dragging: ue(t.id),
					onOpen: (e) => r("open", t.id),
					onToggle: (e) => u(t.id, e),
					onGrab: (e) => se(e, "module", t.id)
				}, null, 8, [
					"preset",
					"module",
					"grip",
					"dragging",
					"onOpen",
					"onToggle",
					"onGrab"
				]))), 128)), o.value.length ? U("", !0) : (R(), z("div", OL, A(M(J)("um.grp.dropOut")), 1))])) : U("", !0), (R(!0), z(L, null, I(a.value, ({ g: t, members: i }) => (R(), z("section", {
					key: t.id,
					class: k(["um-group", {
						collapsed: t.collapsed,
						dragging: w.value?.kind === "group" && w.value.id === t.id
					}]),
					"data-group": t.id,
					"data-zone": t.id,
					"data-collapsed": t.collapsed ? "" : void 0
				}, [
					V("header", AL, [
						a.value.length > 1 ? (R(), z("span", {
							key: 0,
							class: "um-grip",
							"aria-label": M(J)("um.grp.reorder"),
							onPointerdown: (e) => se(e, "group", t.id)
						}, [H(M(EA))], 40, jL)) : U("", !0),
						H(Q, {
							icon: M(Kk),
							label: M(J)(t.collapsed ? "um.grp.expand" : "um.grp.collapse"),
							class: k(["um-chevron", { open: !t.collapsed }]),
							small: "",
							align: "start",
							onClick: (e) => ee(t)
						}, null, 8, [
							"icon",
							"label",
							"class",
							"onClick"
						]),
						V("input", {
							class: "input bare um-group-name grow",
							value: t.name,
							placeholder: M(J)("um.grp.untitled"),
							"aria-label": M(J)("um.grp.name"),
							onInput: (e) => b(t, e)
						}, null, 40, ML),
						V("span", {
							class: "um-group-count xs muted",
							title: M(J)("um.grp.count", { n: i.length })
						}, A(i.length), 9, NL),
						H(Q, {
							icon: M(Jk),
							label: M(J)(t.mode === "single" ? "um.grp.single" : "um.grp.multi"),
							pressed: t.mode === "single",
							small: "",
							align: "end",
							class: "um-group-mode",
							onClick: (e) => S(t)
						}, null, 8, [
							"icon",
							"label",
							"pressed",
							"onClick"
						]),
						s.value ? (R(), B(Q, {
							key: 1,
							icon: M(XA),
							label: M(J)("um.grp.addModule"),
							active: f.value === t.id,
							small: "",
							align: "end",
							class: "um-group-add",
							onClick: (e) => g(t.id)
						}, null, 8, [
							"icon",
							"label",
							"active",
							"onClick"
						])) : U("", !0),
						H(Q, {
							icon: M(dA),
							label: M(J)("um.grp.export"),
							small: "",
							align: "end",
							class: "um-group-export",
							onClick: (e) => te(t)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						]),
						H(Q, {
							icon: M(mj),
							label: M(J)("um.grp.delete"),
							active: C.value === t.id,
							danger: "",
							small: "",
							align: "end",
							class: "um-group-delete",
							onClick: (e) => ne(t, i.length)
						}, null, 8, [
							"icon",
							"label",
							"active",
							"onClick"
						])
					]),
					C.value === t.id ? (R(), z("div", {
						key: 0,
						class: "um-group-confirm",
						role: "group",
						"aria-label": M(J)("um.grp.delete"),
						onKeydown: n[6] ||= vs(gs((e) => C.value = null, ["stop"]), ["esc"])
					}, [
						V("span", FL, A(M(J)("um.grp.deleteAsk", { n: i.length })), 1),
						V("button", {
							type: "button",
							class: "btn ghost um-keep",
							onClick: (e) => re(t, !1)
						}, A(M(J)("um.grp.keepModules")), 9, IL),
						V("button", {
							type: "button",
							class: "btn ghost danger um-delete-all",
							onClick: (e) => re(t, !0)
						}, A(M(J)("um.grp.deleteModules")), 9, LL),
						V("button", {
							type: "button",
							class: "btn ghost",
							onClick: n[5] ||= (e) => C.value = null
						}, A(M(J)("common.cancel")), 1)
					], 40, PL)) : U("", !0),
					f.value === t.id ? (R(), B(aL, {
						key: 1,
						templates: d.value,
						onBlank: (e) => m(t.id),
						onTemplate: (e) => h(t.id, e),
						onCancel: n[7] ||= (e) => f.value = void 0
					}, null, 8, [
						"templates",
						"onBlank",
						"onTemplate"
					])) : U("", !0),
					t.collapsed ? U("", !0) : (R(), z("div", {
						key: 2,
						class: "um-list",
						role: t.mode === "single" ? "radiogroup" : void 0,
						"aria-label": t.name
					}, [(R(!0), z(L, null, I(i, (n) => (R(), B(EL, {
						key: n.id,
						preset: e.preset,
						module: n,
						single: t.mode === "single",
						grip: l.value,
						dragging: ue(n.id),
						onOpen: (e) => r("open", n.id),
						onToggle: (e) => u(n.id, e),
						onGrab: (e) => se(e, "module", n.id)
					}, null, 8, [
						"preset",
						"module",
						"single",
						"grip",
						"dragging",
						"onOpen",
						"onToggle",
						"onGrab"
					]))), 128)), i.length ? U("", !0) : (R(), z("div", zL, A(M(J)("um.grp.empty")), 1))], 8, RL))
				], 10, kL))), 128))], 2)),
				V("input", {
					ref_key: "fileInput",
					ref: ie,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: ae
				}, null, 544)
			]),
			_: 1
		}, 8, ["title", "help"]));
	}
}), HL = ["title"], UL = ["aria-label", "onClick"], WL = ["placeholder"], GL = /* @__PURE__ */ F({
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
		}, A(t), 9, HL), V("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: gs((e) => c(n), ["stop"])
		}, [H(M(wj))], 8, UL)], 2))), 128)), ur(V("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: k(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, WL), [[os, r.value]])]));
	}
}), KL = { class: "rule" }, qL = { class: "rule-head" }, JL = ["value", "aria-label"], YL = ["label"], XL = ["value"], ZL = ["value"], QL = ["value"], $L = ["value"], eR = ["value"], tR = {
	key: 1,
	class: "grow"
}, nR = {
	key: 0,
	class: "rule-body"
}, rR = { class: "row wrap" }, iR = {
	key: 0,
	class: "unit small muted"
}, aR = ["value"], oR = ["value"], sR = { value: "any" }, cR = { value: "none" }, lR = { class: "row kw-words" }, uR = {
	key: 1,
	class: "rule-body"
}, dR = ["value"], fR = {
	key: 2,
	class: "rule-body"
}, pR = ["value"], mR = ["value"], hR = { class: "row wrap option-chips" }, gR = ["aria-pressed", "onClick"], _R = {
	key: 2,
	class: "row"
}, vR = ["value"], yR = ["value"], bR = ["value"], xR = ["list", "value"], SR = ["value"], CR = {
	key: 3,
	class: "rule-error xs"
}, wR = /* @__PURE__ */ F({
	__name: "RuleRow",
	props: /*@__PURE__*/ ui({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ui(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = hi(e, "modelValue"), r = W(() => lL(t.preset)), i = W(() => uL(n.value)), a = W(() => dL(t.preset, i.value)), o = W(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = W(() => n.value.kind === "var" ? fL(t.preset, n.value.path) : null), c = W(() => vf(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = hL(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = gL(t.preset, r, `${i}.${e}`);
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
		}, m = W(() => {
			let e = n.value.value;
			return (Array.isArray(e) ? e : []).map(String);
		});
		function h(e) {
			let t = n.value.value, r = Array.isArray(t) ? [...t] : [], i = r.findIndex((t) => String(t) === String(e));
			i >= 0 ? r.splice(i, 1) : r.push(e), f({ value: r });
		}
		let g = W(() => s.value?.kind === "list" ? "list" : "bool"), _ = W(() => mL[g.value].map((e) => ({
			value: e,
			label: _L(g.value, e, n.value.path)
		}))), v = W(() => (s.value ? mL[s.value.kind] : []).map((e) => ({
			value: e,
			label: _L(s.value.kind, e)
		}))), y = W({
			get: () => n.value.target,
			set: (e) => p(e === "recent" ? {
				target: e,
				depth: n.value.depth ?? 3
			} : {
				target: e,
				depth: void 0
			})
		}), b = W(() => [{
			value: "input",
			label: J("um.kw.input")
		}, {
			value: "recent",
			label: J("um.kw.recent")
		}]);
		return (e, t) => (R(), z("div", KL, [
			V("div", qL, [
				V("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": M(J)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(R(!0), z(L, null, I(r.value, (e) => (R(), z("optgroup", {
					key: e.label,
					label: e.label
				}, [(R(!0), z(L, null, I(e.subjects, (e) => (R(), z("option", {
					key: e.id,
					value: e.id
				}, A(e.label), 9, XL))), 128))], 8, YL))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (R(), z("option", {
					key: 0,
					value: i.value
				}, A(n.value.path), 9, ZL)) : U("", !0)], 40, JL),
				a.value.length ? (R(), z("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
					key: String(e.value),
					value: e.value
				}, A(e.label), 9, $L))), 128)), a.value.some((e) => String(e.value) === o.value) ? U("", !0) : (R(), z("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, A(o.value), 9, eR))], 40, QL)) : (R(), z("span", tR)),
				H(Q, {
					icon: M(wj),
					label: M(J)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (R(), z("div", nR, [V("div", rR, [
				H(_I, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (R(), z("label", iR, [V("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? M(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, aR), ba(" " + A(M(J)("um.kw.messages")), 1)])) : U("", !0),
				V("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [V("option", sR, A(M(J)("um.kw.any")), 1), V("option", cR, A(M(J)("um.kw.none")), 1)], 40, oR)
			]), V("div", lR, [H(GL, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": M(J)("common.delete"),
				placeholder: n.value.regex ? M(J)("um.kw.regexPlaceholder") : M(J)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), H(Q, {
				icon: M(ej),
				label: M(J)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (R(), z("div", uR, [V("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, dR)])) : s.value ? (R(), z("div", fR, [s.value.kind === "bool" || s.value.kind === "list" ? (R(), B(_I, {
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
			}, A(e.label), 9, mR))), 128))], 40, pR), V("div", hR, [(R(!0), z(L, null, I(s.value.options, (e) => (R(), z("button", {
				key: String(e.value),
				type: "button",
				class: k(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, A(e.label), 11, gR))), 128))])], 64)) : (R(), z("div", _R, [V("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(R(!0), z(L, null, I(v.value, (e) => (R(), z("option", {
				key: e.value,
				value: e.value
			}, A(e.label), 9, yR))), 128))], 40, vR), s.value.kind === "number" ? (R(), z("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, bR)) : (R(), z(L, { key: 1 }, [V("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, xR), s.value.suggestions?.length ? (R(), z("datalist", {
				key: 0,
				id: l
			}, [(R(!0), z(L, null, I(s.value.suggestions, (e) => (R(), z("option", {
				key: e,
				value: e
			}, null, 8, SR))), 128))])) : U("", !0)], 64))]))])) : U("", !0),
			c.value ? (R(), z("div", CR, A(c.value), 1)) : U("", !0)
		]));
	}
}), TR = { class: "trigger" }, ER = {
	key: 1,
	class: "always faint small"
}, DR = {
	key: 0,
	class: "rule-join xs faint"
}, OR = { class: "btn ghost add picker" }, kR = ["aria-label"], AR = ["label"], jR = ["value"], MR = /* @__PURE__ */ F({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ui({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = hi(e, "modelValue"), r = W(() => lL(t.preset)), i = /* @__PURE__ */ j(null), a = W(() => [{
			value: "all",
			label: J("um.match.all")
		}, {
			value: "any",
			label: J("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(hL(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (R(), z("div", TR, [
			n.value.rules.length > 1 ? (R(), B(_I, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : U("", !0),
			n.value.rules.length ? U("", !0) : (R(), z("div", ER, A(M(J)("um.always")), 1)),
			(R(!0), z(L, null, I(n.value.rules, (t, r) => (R(), z(L, { key: r }, [r > 0 ? (R(), z("div", DR, A(n.value.match === "any" ? M(J)("um.match.anyJoin") : M(J)("um.match.allJoin")), 1)) : U("", !0), H(wR, {
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
			V("label", OR, [
				H(M(XA)),
				ba(A(M(J)("um.addRule")) + " ", 1),
				V("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": M(J)("um.addRule"),
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
				}, A(e.label), 9, jR))), 128))], 8, AR))), 128))], 40, kR)
			])
		]));
	}
}), NR = { class: "um-entry-head" }, PR = { class: "um-var-label grow ellipsis" }, FR = {
	key: 0,
	class: "um-warn xs"
}, IR = ["placeholder"], LR = [
	"value",
	"placeholder",
	"onInput"
], RR = { class: "um-var-pair-head" }, zR = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], BR = [
	"value",
	"placeholder",
	"onInput"
], VR = ["id"], HR = ["value"], UR = /* @__PURE__ */ F({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => Cf(n.preset, n.update.var)), a = W(() => i.value?.type !== n.update.type), o = W(() => i.value ? Hp(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = W(() => i.value && Hp(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = W(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = W(() => `ap-bv-${n.update.var}`);
		function u(e) {
			e.key = e.key.trim();
			let t = c.value.get(e.key);
			t !== void 0 && !e.value && (e.value = t);
		}
		function d(e, t, r) {
			n.update.type === "list" && (n.update.items[e] = of(t, r));
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
			off: !M(nf)(e.update)
		}]) }, [
			V("div", NR, [
				H(UF, {
					"model-value": M(nf)(e.update),
					label: M(J)("panel.enabled"),
					"onUpdate:modelValue": n[0] ||= (t) => M(af)(e.update, t)
				}, null, 8, ["model-value", "label"]),
				V("span", PR, A(o.value), 1),
				H(cN, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				H(Q, {
					icon: M(wj),
					label: M(J)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (R(), z("div", FR, [H(M(hj)), ba(A(M(J)("um.bv.lost")), 1)])) : U("", !0),
			e.update.type === "string" ? ur((R(), z("textarea", {
				key: 1,
				"onUpdate:modelValue": n[2] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: M(J)("um.bv.append")
			}, null, 8, IR)), [[os, e.update.text]]) : e.update.type === "list" ? (R(!0), z(L, { key: 2 }, I(e.update.items, (t, n) => (R(), z("div", {
				key: n,
				class: k(["um-var-row", { off: !M(nf)(t) }])
			}, [
				H(UF, {
					"model-value": M(nf)(t),
					label: M(J)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => d(n, M(rf)(t), e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				V("textarea", {
					value: M(rf)(t),
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: M(J)("um.bv.item"),
					onInput: (e) => d(n, e.target.value, M(nf)(t))
				}, null, 40, LR),
				H(Q, {
					icon: M(wj),
					label: M(J)("um.removeEntry"),
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
				class: k(["um-var-pair", { off: !M(nf)(t) }])
			}, [V("div", RR, [
				H(UF, {
					"model-value": M(nf)(t),
					label: M(J)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => M(af)(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				ur(V("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input bare um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: M(J)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, zR), [[os, t.key]]),
				H(Q, {
					icon: M(wj),
					label: M(J)("um.removeEntry"),
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
				placeholder: c.value.has(t.key.trim()) ? M(J)("um.bv.removes") : M(J)("um.bv.value"),
				onInput: (e) => t.value = e.target.value
			}, null, 40, BR)], 2))), 128)), V("datalist", { id: l.value }, [(R(!0), z(L, null, I(c.value, ([e]) => (R(), z("option", {
				key: e,
				value: e
			}, null, 8, HR))), 128))], 8, VR)], 64)),
			e.update.type === "string" ? U("", !0) : (R(), z("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: f
			}, [H(M(XA)), ba(A(e.update.type === "dict" ? M(J)("um.bv.addKey") : M(J)("um.bv.addItem")), 1)]))
		], 2));
	}
}), WR = { class: "um-editor" }, GR = { class: "um-head" }, KR = ["placeholder", "aria-label"], qR = { class: "um-entry-head" }, JR = ["onUpdate:modelValue", "aria-label"], YR = ["value"], XR = ["value"], ZR = [
	"value",
	"aria-label",
	"onChange"
], QR = ["value"], $R = {
	key: 0,
	class: "um-warn xs"
}, ez = ["onUpdate:modelValue", "placeholder"], tz = {
	key: 1,
	class: "rule-error xs pre"
}, nz = {
	key: 0,
	class: "btn ghost add picker"
}, rz = ["aria-label"], iz = ["value"], az = { class: "um-foot" }, oz = ["title"], sz = ["title"], cz = ["title"], lz = { class: "ellipsis" }, uz = ["value", "aria-label"], dz = { value: "" }, fz = ["value"], pz = ["title"], mz = /* @__PURE__ */ F({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		P(() => n.module, K, { deep: !0 });
		let i = /* @__PURE__ */ j(null);
		Jr(() => {
			n.module.entries.some((e) => e.text) || Xn(() => i.value?.select());
		});
		let a = W(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Hp(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Hp(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !xf(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => du(e.text).errors, d = (e) => u(e).map((e) => e.line ? J("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = fg(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = W(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Hp(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = W(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ j(null);
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
			v.value ? (_g(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = gg(n.preset, n.module.id, (e) => J("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = W(() => ag(n.preset)), S = (e) => yg(n.preset, n.module.id, e || null, Infinity), ee = () => KT(`${n.preset.id}.${JT(n.module.name)}.ap-modules.json`, Eg(n.preset, [n.module.id]));
		return (t, n) => (R(), z("div", WR, [
			V("header", GR, [
				H(Q, {
					icon: M(Fk),
					label: M(J)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				ur(V("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: M(J)("um.untitled"),
					"aria-label": M(J)("um.name")
				}, null, 8, KR), [[os, e.module.name]]),
				H(UF, {
					"model-value": e.module.enabled,
					label: M(J)("panel.enabled"),
					"onUpdate:modelValue": n[2] ||= (t) => M(vg)(e.preset, e.module.id, t)
				}, null, 8, ["model-value", "label"])
			]),
			H(dN, {
				title: M(J)("um.content"),
				help: M(J)("um.content.help")
			}, {
				default: N(() => [(R(!0), z(L, null, I(e.module.entries, (t, n) => (R(), z("div", {
					key: t.id,
					class: k(["um-entry", {
						lost: s(t),
						off: !M(nf)(t)
					}])
				}, [
					V("div", qR, [
						H(UF, {
							"model-value": M(nf)(t),
							label: M(J)("panel.enabled"),
							"onUpdate:modelValue": (e) => M(af)(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						]),
						ur(V("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": M(J)("um.point")
						}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
							key: e.id,
							value: e.id
						}, A(e.label), 9, YR))), 128)), s(t) ? (R(), z("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, A(M(J)("um.pointMissing", { id: t.point })), 9, XR)) : U("", !0)], 8, JR), [[ls, t.point]]),
						H(cN, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						V("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": M(J)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(R(), z(L, null, I(c, (e) => V("option", {
							key: e,
							value: e
						}, A(M(J)(`um.role.${e || "merge"}`)), 9, QR)), 64))], 40, ZR),
						e.module.entries.length > 1 || e.module.vars.length ? (R(), B(Q, {
							key: 0,
							icon: M(wj),
							label: M(J)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : U("", !0)
					]),
					s(t) ? (R(), z("div", $R, [H(M(hj)), ba(A(M(J)("um.pointLost")), 1)])) : U("", !0),
					ur(V("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: M(J)("um.text.placeholder")
					}, null, 8, ez), [[os, t.text]]),
					u(t).length ? (R(), z("div", tz, A(d(t)), 1)) : U("", !0)
				], 2))), 128)), a.value.length ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [H(M(XA)), ba(A(M(J)("um.addEntry")), 1)])) : U("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (R(), B(dN, {
				key: 0,
				title: M(J)("um.bv"),
				help: M(J)("um.bv.help")
			}, {
				default: N(() => [(R(!0), z(L, null, I(e.module.vars, (t, n) => (R(), B(UR, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (R(), z("label", nz, [
					H(M(XA)),
					ba(A(M(J)("um.bv.add")) + " ", 1),
					V("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": M(J)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[6] ||= V("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (R(!0), z(L, null, I(h.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, A(e.label), 9, iz))), 128))], 40, rz)
				])) : U("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : U("", !0),
			H(dN, {
				title: M(J)("um.trigger"),
				help: M(J)("um.trigger.help")
			}, {
				default: N(() => [H(MR, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			V("footer", az, [
				V("button", {
					type: "button",
					class: "btn ghost",
					title: M(J)("um.export"),
					onClick: ee
				}, [H(M(dA)), V("span", null, A(M(J)("um.export")), 1)], 8, oz),
				V("button", {
					type: "button",
					class: "btn ghost",
					title: M(J)("um.duplicate"),
					onClick: b
				}, [H(M(sA)), V("span", null, A(M(J)("um.duplicate")), 1)], 8, sz),
				x.value.length ? (R(), z("label", {
					key: 0,
					class: "btn ghost picker um-move",
					title: M(J)("um.grp.moveTo")
				}, [
					H(M(xA)),
					V("span", lz, A(x.value.find((t) => t.id === e.module.group)?.name || M(J)("um.grp.none")), 1),
					V("select", {
						value: e.module.group ?? "",
						"aria-label": M(J)("um.grp.moveTo"),
						onChange: n[5] ||= (e) => S(e.target.value)
					}, [V("option", dz, A(M(J)("um.grp.none")), 1), (R(!0), z(L, null, I(x.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, A(e.name || M(J)("um.grp.untitled")), 9, fz))), 128))], 40, uz)
				], 8, cz)) : U("", !0),
				n[7] ||= V("span", { class: "grow" }, null, -1),
				V("button", {
					type: "button",
					class: k(["btn ghost danger", { armed: v.value }]),
					title: M(J)("common.delete"),
					onClick: y
				}, [H(M(mj)), V("span", null, A(v.value ? M(J)("um.confirmDelete") : M(J)("common.delete")), 1)], 10, pz)
			])
		]));
	}
}), hz = {
	key: 0,
	class: "module-row"
}, gz = { class: "grow" }, _z = { class: "ellipsis" }, vz = ["aria-label"], yz = ["aria-checked", "onClick"], bz = { class: "grow" }, xz = { class: "grow" }, Sz = { class: "ellipsis" }, Cz = {
	key: 0,
	class: "empty"
}, wz = /* @__PURE__ */ F({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = fI(), i = W(() => t.value && n.value ? fd(t.value, n.value) : {}), a = W(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = ud(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Hp(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Hp(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Hp(e, "groups", t, "label", r?.label ?? t) : J("modules.other"),
					help: t && Hp(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Hp(t.value, "modules", e.id, "name", e.name), s = (e) => Hp(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ j(null), g = /* @__PURE__ */ j(null), _ = W(() => t.value && h.value ? ig(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Xn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Xn(() => y()?.scrollTo({ top: v }));
		}
		return P(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !M(t) || !M(n) ? (R(), B(mI, { key: 0 })) : _.value ? (R(), z("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(R(), B(mz, {
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
			H(VL, {
				preset: M(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(R(!0), z(L, null, I(a.value, (e) => (R(), B(dN, {
				key: e.id,
				title: e.label,
				help: e.help
			}, ni({
				default: N(() => [(R(!0), z(L, null, I(e.sets, (t) => (R(), z(L, { key: t.key }, [t.label ? (R(), z("div", hz, [V("span", gz, [V("span", _z, A(t.label), 1), H(cN, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (R(), B(UF, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : U("", !0)])) : U("", !0), !t.optional || c(t) ? (R(), z("div", {
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
					V("span", bz, A(o(e)), 1),
					H(cN, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, yz))), 128))], 10, vz)) : U("", !0)], 64))), 128)), (R(!0), z(L, null, I(e.toggles, (e) => (R(), z("div", {
					key: e.id,
					class: "module-row"
				}, [V("span", xz, [V("span", Sz, A(o(e)), 1), H(cN, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), H(UF, {
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
				fn: N(() => [H(UF, {
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
			a.value.length ? U("", !0) : (R(), z("div", Cz, A(M(J)("modules.none")), 1))
		], 512));
	}
}), Tz = ["value", "onChange"], Ez = ["value"], Dz = {
	key: 2,
	class: "unit"
}, Oz = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], kz = {
	key: 0,
	class: "small muted"
}, Az = [
	"list",
	"value",
	"placeholder",
	"onChange"
], jz = ["id"], Mz = ["value"], Nz = /* @__PURE__ */ F({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = fI(), i = W(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Hp(e, "groups", t, "label", e.groups[t]?.label ?? t) : J("writing.params"),
				help: t && Hp(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Hp(t.value, "params", e.id, "label", e.label), o = (e) => Hp(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => Vp(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => Nu(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !M(t) || !M(n) ? (R(), B(mI, { key: 0 })) : (R(!0), z(L, { key: 1 }, I(i.value, (e) => (R(), B(dN, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: M(sj)
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
				}, A(s(e, t.value, t.label)), 9, Ez))), 128))], 40, Tz)) : e.type === "list" ? (R(), B(GL, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": M(J)("common.delete"),
					placeholder: M(J)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (R(), z("div", Dz, [V("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, Oz), e.unit ? (R(), z("span", kz, A(e.unit), 1)) : U("", !0)])) : (R(), z(L, { key: 3 }, [V("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, Az), e.options?.length ? (R(), z("datalist", {
					key: 0,
					id: f(e)
				}, [(R(!0), z(L, null, I(e.options, (t) => (R(), z("option", {
					key: String(t.value),
					value: t.value
				}, A(s(e, t.value, t.label)), 9, Mz))), 128))], 8, jz)) : U("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), Pz = { class: "kv" }, Fz = {
	key: 0,
	class: "kv-row"
}, Iz = { class: "kv-key ellipsis" }, Lz = { class: "kv-value pre small" }, Rz = {
	key: 0,
	class: "kv-actions"
}, zz = {
	key: 1,
	class: "kv-edit col"
}, Bz = ["placeholder"], Vz = ["placeholder"], Hz = { class: "row end" }, Uz = {
	key: 0,
	class: "kv-edit col"
}, Wz = ["placeholder"], Gz = ["placeholder"], Kz = { class: "row end" }, qz = {
	key: 1,
	class: "faint small kv-empty"
}, Jz = /* @__PURE__ */ F({
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
		return (t, n) => (R(), z("div", Pz, [
			(R(!0), z(L, null, I(e.entries, (t, l) => (R(), z(L, { key: l }, [i.value === l ? (R(), z("div", zz, [
				ur(V("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? M(J)("memory.key")
				}, null, 8, Bz), [[os, a.value]]),
				ur(V("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? M(J)("memory.content")
				}, null, 8, Vz), [[os, o.value]]),
				V("div", Hz, [H(Q, {
					icon: M(wj),
					label: M(J)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), H(Q, {
					icon: M(Uk),
					label: M(J)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (R(), z("div", Fz, [
				V("div", Iz, A(l), 1),
				V("div", Lz, A(t), 1),
				e.readonly ? U("", !0) : (R(), z("div", Rz, [H(Q, {
					icon: M(JA),
					label: M(J)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), H(Q, {
					icon: M(mj),
					label: M(J)("common.delete"),
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
			i.value === "" ? (R(), z("div", Uz, [
				ur(V("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? M(J)("memory.key")
				}, null, 8, Wz), [[os, a.value]]),
				ur(V("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? M(J)("memory.content")
				}, null, 8, Gz), [[os, o.value]]),
				V("div", Kz, [H(Q, {
					icon: M(wj),
					label: M(J)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), H(Q, {
					icon: M(Uk),
					label: M(J)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : U("", !0),
			!Object.keys(e.entries).length && i.value === null ? (R(), z("div", qz, A(M(J)("memory.empty")), 1)) : U("", !0),
			!e.readonly && i.value === null ? (R(), z("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [H(M(XA)), ba(A(M(J)("common.add")), 1)])) : U("", !0)
		]));
	}
}), Yz = {
	key: 1,
	class: "faint small"
}, Xz = {
	key: 0,
	class: "badge neutral"
}, Zz = ["placeholder"], Qz = {
	key: 1,
	class: "faint small"
}, $z = /* @__PURE__ */ F({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = fI(), r = W(() => n.value ? Vm(n.value) : null), i = W(() => (Y.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => nk.value ? tv() : void 0, o = W(() => (Y.chatRev, i.value ? Om(Infinity, a()) : {})), s = W(() => r.value ? jm(r.value) : {}), c = W(() => (Y.chatRev, i.value ? km(Infinity, a()) : null));
		async function l(e, t) {
			await Am({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), IS();
		}
		async function u(e) {
			await Am({
				type: "memory.delete",
				key: e,
				source: "user"
			}), IS();
		}
		let d = (e, t) => r.value && Mm(r.value, "replace", e, t, "user"), f = (e) => r.value && Mm(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ j("");
		P(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = W(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await Am({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), IS();
		}
		return (e, t) => !M(n) || !r.value ? (R(), B(mI, { key: 0 })) : (R(), z(L, { key: 1 }, [
			H(dN, {
				title: M(J)("memory.chat"),
				icon: M(RA),
				help: M(J)("memory.chat.hint")
			}, {
				default: N(() => [i.value ? (R(), B(Jz, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (R(), z("div", Yz, A(M(J)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dN, {
				title: M(J)("memory.global"),
				icon: M(TA),
				help: M(J)("memory.global.hint")
			}, {
				actions: N(() => [H(Q, {
					icon: M(gj),
					label: M(J)("common.undo"),
					small: "",
					align: "end",
					disabled: !M(Nm)(r.value),
					onClick: t[0] ||= (e) => M(Fm)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), H(Q, {
					icon: M(QA),
					label: M(J)("common.redo"),
					small: "",
					align: "end",
					disabled: !M(Pm)(r.value),
					onClick: t[1] ||= (e) => M(Im)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: N(() => [H(Jz, {
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
			H(dN, {
				title: M(J)("memory.recap"),
				icon: M(rj),
				help: M(J)("memory.recap.hint")
			}, {
				actions: N(() => [c.value ? (R(), z("span", Xz, "#0–" + A(c.value.coversUpTo), 1)) : U("", !0), i.value ? (R(), B(Q, {
					key: 1,
					icon: M(Uk),
					label: M(J)("common.save"),
					small: "",
					align: "end",
					disabled: !m.value,
					active: "",
					onClick: h
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : U("", !0)]),
				default: N(() => [i.value ? ur((R(), z("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: M(J)("memory.recap.empty")
				}, null, 8, Zz)), [[os, p.value]]) : (R(), z("div", Qz, A(M(J)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), eB = /img:[A-Za-z0-9-]+/g, tB = 6e5;
async function nB(t, n) {
	let r = await S(t, {
		method: "POST",
		headers: e().getRequestHeaders(),
		body: JSON.stringify(n)
	});
	if (!r.ok) throw Error(`${t}: HTTP ${r.status}`);
	return r.text();
}
var rB = (e, t) => {
	for (let n of e.matchAll(eB)) t.add(n[0]);
};
function iB(e, t) {
	let n = JSON.parse(e);
	if (!Array.isArray(n)) throw Error(`${t}: unreadable chat`);
	return e;
}
async function aB(t) {
	let n = /* @__PURE__ */ new Set();
	rB(JSON.stringify(e().chat ?? []), n);
	let r = [], i = JSON.parse(await nB("/api/characters/all", {}));
	for (let e of i) {
		if (!e.avatar) continue;
		let t = JSON.parse(await nB("/api/characters/chats", {
			avatar_url: e.avatar,
			simple: !0
		}));
		if (Array.isArray(t)) for (let i of t) {
			let t = String(i.file_name ?? "").replace(/\.jsonl$/, "");
			t && r.push(async () => rB(iB(await nB("/api/chats/get", {
				ch_name: e.name,
				file_name: t,
				avatar_url: e.avatar
			}), t), n));
		}
	}
	let a = JSON.parse(await nB("/api/groups/all", {}));
	for (let e of a) for (let t of e.chats ?? []) r.push(async () => rB(iB(await nB("/api/chats/group/get", { id: t }), t), n));
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
async function oB(e) {
	let t = await aB(e), n = (await Ix("img:")).length, r = await Lx("img:", t, tB);
	return {
		removed: r,
		kept: n - r
	};
}
//#endregion
//#region src/ui/panel/tabs/DebugTab.vue?vue&type=script&setup=true&lang.ts
var sB = { class: "row tight xs muted" }, cB = { class: "row" }, lB = {
	key: 0,
	class: "xs text-danger"
}, uB = { class: "row wrap xs muted" }, dB = { class: "badge neutral" }, fB = {
	key: 0,
	class: "badge neutral"
}, pB = { class: "badge neutral" }, mB = {
	key: 1,
	class: "badge warn"
}, hB = ["title"], gB = ["title"], _B = {
	key: 0,
	class: "row wrap xs muted"
}, vB = { class: "grow" }, yB = { key: 0 }, bB = ["onClick"], xB = { class: "grow mono" }, SB = { class: "xs muted" }, CB = { class: "row xs muted" }, wB = { class: "badge neutral" }, TB = { class: "pre mono scroll" }, EB = {
	key: 0,
	class: "xs faint region-msg"
}, DB = { key: 1 }, OB = ["onClick"], kB = { class: "grow mono" }, AB = { class: "xs muted" }, jB = {
	key: 0,
	class: "region-msg"
}, MB = { class: "pre mono scroll" }, NB = {
	key: 0,
	class: "xs faint"
}, PB = {
	key: 2,
	class: "xs text-warning"
}, FB = {
	key: 1,
	class: "faint small"
}, IB = ["onClick"], LB = { class: "mono grow ellipsis" }, RB = {
	key: 0,
	class: "badge warn"
}, zB = { class: "xs muted" }, BB = { class: "xs muted" }, VB = { class: "row xs muted" }, HB = { class: "grow" }, UB = { class: "mono scroll" }, WB = { class: "row xs muted" }, GB = { class: "grow" }, KB = { class: "mono scroll" }, qB = {
	key: 0,
	class: "faint small"
}, JB = { class: "row xs" }, YB = { class: "badge neutral" }, XB = { class: "muted" }, ZB = { class: "mono scroll" }, QB = {
	key: 0,
	class: "faint small"
}, $B = { class: "row" }, eV = ["disabled"], tV = {
	key: 0,
	class: "xs muted"
}, nV = {
	key: 1,
	class: "xs muted"
}, rV = {
	key: 2,
	class: "xs text-danger"
}, iV = { class: "row xs" }, aV = { class: "badge neutral" }, oV = {
	key: 0,
	class: "badge neutral"
}, sV = { class: "grow muted" }, cV = { class: "small" }, lV = {
	key: 0,
	class: "faint small"
}, uV = { class: "xs faint mono build" }, dV = /* @__PURE__ */ F({
	__name: "DebugTab",
	setup(t) {
		let n = W(() => Ag.log.find((e) => e.kind === "assembly")?.data), r = W(() => Ag.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ fn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ fn({});
		P(n, async (t) => {
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
			return `${n ?? "?"} → ${r ?? "?"}` + (i ? ` · ${J("debug.cached", { n: i })}` : "");
		}, p = (e) => [
			J("debug.cache.stats", {
				sticky: e.sticky,
				fresh: e.fresh
			}),
			e.postponed ? J("debug.cache.postponed", {
				n: e.postponed,
				d: e.deferred,
				max: e.maxDeferredTurns || "∞"
			}) : "",
			e.unmatched ? J("debug.cache.unmatched", { n: e.unmatched }) : ""
		].filter(Boolean).join(" · "), m = W({
			get: () => G().dev.enabled,
			set: (e) => {
				G().dev.enabled = e, K();
			}
		}), h = W({
			get: () => G().dev.url,
			set: (e) => {
				G().dev.url = e.trim(), K();
			}
		}), g = W(() => Ag.log.filter((e) => e.kind !== "assembly")), _ = W(() => {
			Y.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) {
				for (let n of _C(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.comment
				});
				for (let n of CC(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.character,
					speech: !0
				});
			}
			return t;
		}), b = W(() => !!(RS.value?.image || bx().image.connections.length)), x = /* @__PURE__ */ j({ running: !1 });
		async function S() {
			if (!x.value.running && await y(`<p>${v(J("debug.images.confirm"))}</p>`, J("common.delete"), J("common.cancel"))) {
				x.value = { running: !0 };
				try {
					let e = await oB((e) => {
						x.value = {
							running: !0,
							progress: e
						};
					});
					x.value = {
						running: !1,
						result: J("debug.images.done", {
							removed: e.removed,
							kept: e.kept
						})
					};
				} catch (e) {
					x.value = {
						running: !1,
						error: J("debug.images.failed", { error: e instanceof Error ? e.message : String(e) })
					};
				}
			}
		}
		return (e, t) => (R(), z(L, null, [
			H(dN, {
				title: M(J)("debug.dev"),
				icon: M(ij),
				help: M(J)("debug.dev.hint")
			}, {
				actions: N(() => [V("span", sB, [V("span", { class: k(["dot status-dot", M(rE).status]) }, null, 2), ba(A(M(J)(`debug.dev.${M(rE).status}`)), 1)])]),
				default: N(() => [H($, { label: M(J)("debug.dev.url") }, {
					default: N(() => [V("div", cB, [ur(V("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						os,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), H(UF, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: M(J)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), M(rE).error ? (R(), z("span", lB, A(M(rE).error), 1)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dN, {
				title: M(J)("debug.assembly"),
				icon: M(yA),
				collapsible: ""
			}, {
				default: N(() => [n.value ? (R(), z(L, { key: 0 }, [
					V("div", uB, [
						V("span", dB, A(M(J)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (R(), z("span", fB, A(n.value.workflow), 1)) : U("", !0),
						V("span", pB, A(n.value.origin), 1),
						n.value.dryRun ? (R(), z("span", mB, "dry run")) : U("", !0),
						n.value.input ? (R(), z("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, A(M(J)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, hB)) : U("", !0),
						n.value.storyline ? (R(), z("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, A(n.value.storyline.main ? M(J)("storylines.main") : n.value.storyline.name) + A(n.value.storyline.if ? " · if" : "") + A(n.value.storyline.new ? " · new" : "") + A(n.value.storyline.frozen ? " · frozen" : ""), 9, gB)) : U("", !0),
						t[3] ||= V("span", { class: "grow" }, null, -1),
						ba(A(u(n.value.at)), 1)
					]),
					r.value ? (R(), z("div", _B, [
						V("span", { class: k(["badge", r.value.reason ? "warn" : "neutral"]) }, A(r.value.reason ? M(J)(`debug.cache.flush.${r.value.reason}`) : M(J)("debug.cache.kept")), 3),
						V("span", vB, A(p(r.value)), 1),
						r.value === n.value.cache ? U("", !0) : (R(), z("span", yB, A(u(r.value.at)), 1))
					])) : U("", !0),
					V("div", null, [(R(!0), z(L, null, I(n.value.regions, (e) => (R(), z("div", {
						key: e.id,
						class: "region"
					}, [V("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						H(M(Kk), { class: k(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						V("span", xB, A(e.id), 1),
						V("span", SB, A(e.messages.length) + " · " + A(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + A(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, bB), i.has(e.id) ? (R(), z(L, { key: 0 }, [(R(!0), z(L, null, I(e.messages, (e, t) => (R(), z("div", {
						key: t,
						class: "region-msg"
					}, [V("div", CB, [V("span", wB, A(e.role), 1), ba(A(e.chars) + " ch", 1)]), V("div", TB, A(e.content), 1)]))), 128)), e.messages.length ? U("", !0) : (R(), z("div", EB, A(M(J)("debug.emptyRegion")), 1))], 64)) : U("", !0)]))), 128))]),
					n.value.vars?.length ? (R(), z("div", DB, [(R(!0), z(L, null, I(n.value.vars, (e) => (R(), z("div", {
						key: e.id,
						class: "region"
					}, [V("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						H(M(Kk), { class: k(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						V("span", kB, A(e.id), 1),
						V("span", AB, A(e.text.length) + " ch", 1)
					], 8, OB), i.has(`var:${e.id}`) ? (R(), z("div", jB, [V("div", MB, A(e.text), 1), e.text ? U("", !0) : (R(), z("div", NB, A(M(J)("debug.emptyRegion")), 1))])) : U("", !0)]))), 128))])) : U("", !0),
					n.value.warnings.length ? (R(), z("div", PB, A(n.value.warnings.join(" · ")), 1)) : U("", !0)
				], 64)) : (R(), z("div", FB, A(M(J)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(dN, {
				title: M(J)("debug.requests"),
				icon: M(aA),
				collapsible: ""
			}, {
				default: N(() => [(R(!0), z(L, null, I(M(Ag).requests, (e, t) => (R(), z("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [V("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					V("span", LB, A(e.genId) + " · #" + A(e.step), 1),
					e.error ? (R(), z("span", RB, A(M(J)("debug.error")), 1)) : U("", !0),
					V("span", zB, A(f(e.usage)), 1),
					V("span", BB, A(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, IB), s.value === t ? (R(), z(L, { key: 0 }, [
					V("div", VB, [V("span", HB, A(M(J)("debug.request")), 1), H(Q, {
						icon: M(cA),
						label: M(J)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					V("pre", UB, A(c(e.request)), 1),
					V("div", WB, [V("span", GB, A(M(J)("debug.response")), 1), H(Q, {
						icon: M(cA),
						label: M(J)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					V("pre", KB, A(e.error ?? c(e.response ?? "")), 1)
				], 64)) : U("", !0)]))), 128)), M(Ag).requests.length ? U("", !0) : (R(), z("div", qB, A(M(J)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(dN, {
				title: M(J)("debug.log"),
				icon: M(rj),
				collapsible: "",
				open: !1
			}, {
				actions: N(() => [H(Q, {
					icon: M(mj),
					label: M(J)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => M(Ag).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: N(() => [(R(!0), z(L, null, I(g.value, (e, n) => (R(), z("div", {
					key: n,
					class: "req"
				}, [V("div", JB, [
					V("span", YB, A(e.kind), 1),
					t[4] ||= V("span", { class: "grow" }, null, -1),
					V("span", XB, A(u(e.at)), 1)
				]), V("pre", ZB, A(c(e.data)), 1)]))), 128)), g.value.length ? U("", !0) : (R(), z("div", QB, A(M(J)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			b.value ? (R(), B(dN, {
				key: 0,
				title: M(J)("debug.images"),
				icon: M(DA),
				help: M(J)("debug.images.hint"),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [V("div", $B, [V("button", {
					type: "button",
					class: "btn",
					disabled: x.value.running,
					onClick: S
				}, [H(M(mj)), ba(A(M(J)("debug.images.clean")), 1)], 8, eV), x.value.running ? (R(), z("span", tV, A(x.value.progress ? M(J)("debug.images.scanning", {
					done: x.value.progress.done,
					total: x.value.progress.total
				}) : "…"), 1)) : x.value.result ? (R(), z("span", nV, A(x.value.result), 1)) : x.value.error ? (R(), z("span", rV, A(x.value.error), 1)) : U("", !0)])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(dN, {
				title: M(J)("debug.annotations"),
				icon: M(zA),
				help: M(J)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [(R(!0), z(L, null, I(_.value, (e, t) => (R(), z("div", {
					key: t,
					class: "req"
				}, [V("div", iV, [
					V("span", aV, "#" + A(e.mesId), 1),
					e.speech ? (R(), z("span", oV, A(M(J)("debug.orphanSpeech")), 1)) : U("", !0),
					V("span", sV, "“" + A(e.quote) + "”", 1)
				]), V("div", cV, A(e.comment), 1)]))), 128)), _.value.length ? U("", !0) : (R(), z("div", lV, A(M(J)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			V("div", uV, "Advanced Preset " + A(M("1.12.0")) + " · " + A(M("da4a0bbe1d82621b")), 1)
		], 64));
	}
}), fV = {
	key: 1,
	class: "empty"
}, pV = { class: "row storylines-head" }, mV = { class: "xs muted grow" }, hV = ["aria-expanded", "onClick"], gV = { class: "card-title grow ellipsis" }, _V = ["title", "aria-label"], vV = {
	key: 1,
	class: "badge warn"
}, yV = { class: "xs faint" }, bV = {
	key: 0,
	class: "card-body col"
}, xV = ["aria-label"], SV = {
	key: 1,
	class: "faint small"
}, CV = {
	key: 2,
	class: "storyline-floors"
}, wV = ["title", "onClick"], TV = { class: "badge neutral mono" }, EV = { class: "xs muted" }, DV = { class: "grow ellipsis" }, OV = /* @__PURE__ */ F({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n } = fI(), r = W(() => (Y.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), i = W(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), a = W(() => r.value && n.value?.storylines ? ck(i.value) : []), o = /* @__PURE__ */ j(/* @__PURE__ */ new Set()), s = (e) => {
			let t = new Set(o.value);
			t.has(e) ? t.delete(e) : t.add(e), o.value = t;
		};
		P(() => Y.storylineFocus, (e) => {
			e !== null && (o.value = /* @__PURE__ */ new Set([...o.value, e]), Y.storylineFocus = null);
		}, { immediate: !0 });
		let c = (e) => e.main ? e.name ? J("storylines.mainNamed", { name: e.name }) : J("storylines.main") : e.name || J("storylines.unnamed"), l = () => {
			IS(), wk();
		};
		async function u(e) {
			await iv(e.key, !e.if), l();
		}
		async function d(e) {
			await sv(e.key, !e.hidden), l();
		}
		async function f(e) {
			await sx(e.key) && l();
		}
		async function p(e) {
			let t = await b(`<h3>${v(e.main && !e.name ? J("storylines.nameMain") : J("storylines.renameTitle", { name: c(e) }))}</h3>${e.main ? `<p>${v(J("storylines.nameMain.hint"))}</p>` : ""}`, e.name, J("common.save"), J("common.cancel"));
			if (t === null) return;
			let n = t.trim();
			if (!$u(n)) return x("warning", J("storylines.invalidName"), J("app.name"));
			let r = await ov(e.key, n);
			if (r === "taken") return x("warning", J("storylines.nameTaken", { name: n }), J("app.name"));
			if (r === "invalid") return x("warning", J("storylines.invalidName"), J("app.name"));
			r !== "unchanged" && (!e.main && o.value.has(e.key) && (o.value = new Set([...o.value].map((t) => t === e.key ? n : t))), l());
		}
		return (e, t) => M(n) ? r.value ? (R(), z(L, { key: 2 }, [V("div", pV, [V("span", mV, A(M(J)("storylines.count", { n: a.value.length })), 1), H(cN, {
			text: M(J)("storylines.help"),
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
			(R(), B($r(e.main ? M(lA) : e.if ? M(uj) : M(CA)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			V("span", gV, A(c(e)), 1),
			e.current ? (R(), z("span", {
				key: 0,
				class: "storyline-dot",
				title: M(J)("storylines.current"),
				"aria-label": M(J)("storylines.current")
			}, null, 8, _V)) : U("", !0),
			e.if ? (R(), z("span", vV, "if")) : U("", !0),
			e.hidden ? (R(), B(M(pA), {
				key: 2,
				class: "storyline-flag",
				"aria-label": M(J)("storylines.hidden")
			}, null, 8, ["aria-label"])) : U("", !0),
			V("span", yV, A(M(J)("storylines.floors", { n: e.floors.length })), 1),
			H(M(Wk), {
				class: k(["chevron", { flipped: o.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, hV), o.value.has(e.key) ? (R(), z("div", bV, [e.pending ? U("", !0) : (R(), z("div", {
			key: 0,
			class: k(["storyline-toolbar", { solo: e.main }]),
			role: "toolbar",
			"aria-label": c(e)
		}, [
			e.main ? U("", !0) : (R(), z(L, { key: 0 }, [
				H(Q, {
					icon: M(uj),
					label: M(J)("storylines.ifLine.toggle"),
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
					icon: e.hidden ? M(pA) : M(mA),
					label: M(J)("storylines.visible.toggle"),
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
				icon: M(qA),
				label: e.main && !e.name ? M(J)("storylines.nameMain") : M(J)("common.rename"),
				small: "",
				onClick: (t) => p(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]),
			e.main ? U("", !0) : (R(), B(Q, {
				key: 1,
				icon: M(lA),
				label: M(J)("storylines.makeMain"),
				small: "",
				onClick: (t) => f(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]))
		], 10, xV)), e.floors.length ? (R(), z("ul", CV, [(R(!0), z(L, null, I(e.floors, (e) => (R(), z("li", {
			key: e.index,
			class: "row tight small clickable",
			title: M(J)("storylines.jump"),
			onClick: (t) => M(lk)(e.index)
		}, [
			V("span", TV, "#" + A(e.index), 1),
			V("span", EV, A(e.user ? M(J)("storylines.user") : M(J)("storylines.narrator")), 1),
			V("span", DV, A(e.title || "…"), 1)
		], 8, wV))), 128))])) : (R(), z("div", SV, A(M(J)("storylines.empty")), 1))])) : U("", !0)], 2))), 128))], 64)) : (R(), z("div", fV, [H(M(CA), { "aria-hidden": "true" }), V("span", null, A(M(J)("memory.noChat")), 1)])) : (R(), B(mI, { key: 0 }));
	}
}), kV = {
	key: 0,
	class: "row tight"
}, AV = ["aria-label"], jV = {
	key: 1,
	class: "row tight"
}, MV = ["value", "aria-label"], NV = ["label"], PV = ["value"], FV = {
	key: 1,
	class: "grow faint small"
}, IV = /* @__PURE__ */ F({
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
		let n = e, r = t, i = W(() => {
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
		return (t, n) => a.value ? (R(), z("div", kV, [
			ur(V("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.value = e,
				class: "input grow",
				"aria-label": M(J)("common.rename"),
				onKeydown: [vs(c, ["enter"]), n[1] ||= vs((e) => a.value = !1, ["esc"])]
			}, null, 40, AV), [[os, o.value]]),
			H(Q, {
				icon: M(wj),
				label: M(J)("common.cancel"),
				onClick: n[2] ||= (e) => a.value = !1
			}, null, 8, ["icon", "label"]),
			H(Q, {
				icon: M(Uk),
				label: M(J)("common.save"),
				active: "",
				onClick: c
			}, null, 8, ["icon", "label"])
		])) : (R(), z("div", jV, [
			e.connections.length ? (R(), z("select", {
				key: 0,
				class: "input grow",
				value: e.active?.id,
				"aria-label": M(J)("media.connection"),
				onChange: n[3] ||= (e) => r("select", e.target.value)
			}, [(R(!0), z(L, null, I(i.value, (t) => (R(), z("optgroup", {
				key: t.api,
				label: e.apiLabel(t.api)
			}, [(R(!0), z(L, null, I(t.items, (e) => (R(), z("option", {
				key: e.id,
				value: e.id
			}, A(e.name), 9, PV))), 128))], 8, NV))), 128))], 40, MV)) : (R(), z("span", FV, A(M(J)("media.noConnection")), 1)),
			H(Q, {
				icon: M(XA),
				label: M(J)("media.addConnection"),
				small: "",
				onClick: n[4] ||= (e) => r("add")
			}, null, 8, ["icon", "label"]),
			e.active ? (R(), z(L, { key: 2 }, [
				H(Q, {
					icon: M(cA),
					label: M(J)("common.copy"),
					small: "",
					onClick: n[5] ||= (t) => r("copy", e.active)
				}, null, 8, ["icon", "label"]),
				H(Q, {
					icon: M(JA),
					label: M(J)("common.rename"),
					small: "",
					onClick: s
				}, null, 8, ["icon", "label"]),
				H(Q, {
					icon: M(mj),
					label: M(J)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: n[6] ||= (t) => r("remove", e.active)
				}, null, 8, ["icon", "label"])
			], 64)) : U("", !0)
		]));
	}
}), LV = /* @__PURE__ */ F({
	__name: "ScopeToggle",
	props: {
		modelValue: {},
		options: {}
	},
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = W(() => Math.max(0, t.options.findIndex((e) => e.value === t.modelValue))), r = W(() => t.options[(n.value + 1) % t.options.length]), i = W(() => J("media.scope.toggle", {
			current: t.options[n.value]?.label ?? "",
			next: r.value?.label ?? ""
		}));
		return (t, n) => (R(), B(Q, {
			class: "scope-toggle",
			icon: e.modelValue ? M(yj) : M(TA),
			active: !!e.modelValue,
			label: i.value,
			small: "",
			align: "end",
			onClick: n[0] ||= (e) => r.value && t.$emit("update:modelValue", r.value.value)
		}, null, 8, [
			"icon",
			"active",
			"label"
		]));
	}
}), RV = { class: "media-advanced" }, zV = ["aria-expanded"], BV = {
	key: 0,
	class: "col"
}, VV = ["placeholder"], HV = {
	key: 0,
	class: "xs text-danger"
}, UV = /* @__PURE__ */ F({
	__name: "AdvancedRequest",
	props: {
		connection: {},
		bodyPlaceholder: {}
	},
	emits: ["changed"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(n.connection.body);
		P(() => n.connection.id, () => {
			a.value = n.connection.body;
		});
		let o = W(() => aS(a.value));
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
		return (t, n) => (R(), z("div", RV, [V("button", {
			type: "button",
			class: "btn ghost sm-btn media-advanced-toggle",
			"aria-expanded": i.value,
			onClick: n[0] ||= (e) => i.value = !i.value
		}, [V("span", null, A(M(J)("media.advanced")), 1), H(M(Wk), { class: k(["chevron", { flipped: i.value }]) }, null, 8, ["class"])], 8, zV), i.value ? (R(), z("div", BV, [
			ri(t.$slots, "default"),
			H($, {
				label: M(J)("media.headers"),
				help: M(J)("media.headers.hint")
			}, {
				default: N(() => [H(Jz, {
					entries: e.connection.headers,
					"key-placeholder": M(J)("media.headers.name"),
					"value-placeholder": M(J)("media.headers.value"),
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
				label: M(J)("media.body"),
				help: M(J)("media.body.hint")
			}, {
				default: N(() => [ur(V("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
					class: "input mono",
					rows: "4",
					spellcheck: "false",
					placeholder: e.bodyPlaceholder ?? "{ }",
					onChange: l
				}, null, 40, VV), [[os, a.value]]), o.value ? (R(), z("span", HV, A(o.value), 1)) : U("", !0)]),
				_: 1
			}, 8, ["label", "help"])
		])) : U("", !0)]));
	}
}), WV = ["value", "placeholder"], GV = ["value"], KV = [
	"list",
	"value",
	"placeholder"
], qV = ["id"], JV = ["value"], YV = ["value", "placeholder"], XV = ["value", "placeholder"], ZV = { class: "col media-refs" }, QV = {
	key: 0,
	class: "media-ref-group-title ellipsis"
}, $V = { class: "badge neutral mono" }, eH = [
	"value",
	"placeholder",
	"onChange"
], tH = ["onClick"], nH = ["value"], rH = /* @__PURE__ */ F({
	__name: "ImageSettings",
	setup(e) {
		let t = W(() => bx().image), n = W(() => Tx(t.value)), r = {
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
			],
			openrouter: [
				"google/gemini-nano-banana-2.1",
				"google/gemini-3.1-flash-image",
				"google/gemini-3-pro-image",
				"openai/gpt-image-2.6-flare",
				"openai/gpt-image-2",
				"bytedance-seed/seedream-5-0-pro",
				"black-forest-labs/flux-3-image",
				"qwen/qwen-image-3-pro",
				"x-ai/grok-imagine-image-2.0"
			]
		}, i = (e) => J(`media.api.${e}`), a = pc.map((e) => ({
			value: e,
			label: i(e)
		})), o = mc.map((e) => ({
			value: e,
			label: J(`media.image.promptType.${e}`),
			hint: J(`media.image.promptType.${e}.hint`)
		})), s = (e, n) => {
			t.value[e] = n, xx();
		};
		function c(e, t) {
			let r = n.value;
			r && (r[e] = t, xx());
		}
		function l() {
			let e = Cx("openai", J("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, xx();
		}
		function u(e) {
			let n = Ex(e, J("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, xx();
		}
		function d(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), xx(), PS();
		}
		let f = (e) => {
			t.value.active = e, xx();
		}, p = (e, t) => {
			e.name = t, xx();
		}, m = (e) => {
			n.value && (wx(n.value, e), xx());
		}, h = W(() => (Y.chatRev, jS())), g = W(() => [{
			key: void 0,
			label: J("media.image.refs.global")
		}, ...h.value.map((e) => ({
			key: e.key,
			label: e.name
		}))]), _ = W(() => g.value.map((e) => ({
			value: e.key ?? "",
			label: e.label
		}))), v = W(() => g.value.map((e) => ({
			...e,
			refs: (n.value?.refs ?? []).filter((t) => t.card === e.key)
		}))), y = /* @__PURE__ */ j(null), b;
		function x(e) {
			b = e, y.value?.click();
		}
		async function S(e) {
			let t = n.value, r = b, i = [...e.target.files ?? []];
			if (e.target.value = "", t) {
				for (let e of i) {
					if (!e.type.startsWith("image/")) continue;
					let n = await Mx(e, { prefix: "ref:" });
					t.refs.push({
						id: NS(t.refs),
						description: e.name.replace(/\.[^.]+$/, ""),
						blob: n,
						...r ? { card: r } : {}
					});
				}
				xx();
			}
		}
		function ee(e, t) {
			t ? e.card = t : delete e.card, xx();
		}
		function te(e) {
			let r = n.value;
			r && (r.refs = r.refs.filter((t) => t !== e), xx(), t.value.connections.some((t) => t.refs.some((t) => t.blob === e.blob)) || Fx(e.blob));
		}
		return (e, h) => (R(), B(dN, {
			title: M(J)("media.image"),
			icon: M(AA)
		}, {
			actions: N(() => [H(UF, {
				"model-value": t.value.enabled,
				label: M(J)("media.image"),
				"onUpdate:modelValue": h[0] ||= (e) => s("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: N(() => [t.value.enabled ? (R(), z(L, { key: 0 }, [
				H($, {
					label: M(J)("media.auto"),
					help: M(J)("media.image.auto.hint"),
					inline: ""
				}, {
					default: N(() => [H(UF, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": h[1] ||= (e) => s("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H(IV, {
					connections: t.value.connections,
					active: n.value,
					"api-label": i,
					onSelect: f,
					onAdd: l,
					onCopy: u,
					onRemove: d,
					onRename: p
				}, null, 8, ["connections", "active"]),
				n.value ? (R(), z("div", {
					key: n.value.id,
					class: "col media-conn"
				}, [
					H(_I, {
						"model-value": n.value.api,
						options: M(a),
						"onUpdate:modelValue": h[2] ||= (e) => m(e)
					}, null, 8, ["model-value", "options"]),
					H($, { label: M(J)("media.baseUrl") }, {
						default: N(() => [V("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: M(_x)[n.value.api].baseUrl,
							spellcheck: "false",
							onChange: h[3] ||= (e) => c("baseUrl", e.target.value.trim())
						}, null, 40, WV)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(J)("media.apiKey") }, {
						default: N(() => [V("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: h[4] ||= (e) => c("apiKey", e.target.value.trim())
						}, null, 40, GV)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(J)("media.model") }, {
						default: N(() => [V("input", {
							class: "input",
							list: `ap-image-models-${n.value.api}`,
							value: n.value.model,
							placeholder: M(_x)[n.value.api].model,
							spellcheck: "false",
							onChange: h[5] ||= (e) => c("model", e.target.value.trim())
						}, null, 40, KV), V("datalist", { id: `ap-image-models-${n.value.api}` }, [(R(!0), z(L, null, I(r[n.value.api], (e) => (R(), z("option", {
							key: e,
							value: e
						}, null, 8, JV))), 128))], 8, qV)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(J)("media.image.promptType") }, {
						default: N(() => [H(_I, {
							"model-value": n.value.promptType,
							options: M(o),
							"onUpdate:modelValue": h[6] ||= (e) => c("promptType", e)
						}, null, 8, ["model-value", "options"])]),
						_: 1
					}, 8, ["label"]),
					H($, {
						label: M(J)("media.image.style"),
						help: M(J)("media.image.style.hint")
					}, {
						default: N(() => [V("textarea", {
							class: "input",
							rows: "2",
							value: n.value.style,
							placeholder: M(J)(n.value.promptType === "tags" ? "media.image.style.tags" : "media.image.style.nl"),
							onChange: h[7] ||= (e) => c("style", e.target.value)
						}, null, 40, YV)]),
						_: 1
					}, 8, ["label", "help"]),
					n.value.api === "novelai" ? (R(), B($, {
						key: 0,
						label: M(J)("media.image.negative")
					}, {
						default: N(() => [V("textarea", {
							class: "input",
							rows: "2",
							value: n.value.negative ?? "",
							placeholder: M(J)("media.image.negative.placeholder"),
							onChange: h[8] ||= (e) => c("negative", e.target.value)
						}, null, 40, XV)]),
						_: 1
					}, 8, ["label"])) : U("", !0),
					H($, {
						label: M(J)("media.image.nsfwBlock"),
						help: M(J)("media.image.nsfwBlock.hint"),
						inline: ""
					}, {
						default: N(() => [H(UF, {
							"model-value": n.value.nsfwBlock,
							"onUpdate:modelValue": h[9] ||= (e) => c("nsfwBlock", e)
						}, null, 8, ["model-value"])]),
						_: 1
					}, 8, ["label", "help"]),
					M(vx)(n.value.api) ? (R(), B($, {
						key: 1,
						label: M(J)("media.image.refs"),
						help: M(J)("media.image.refs.hint")
					}, {
						default: N(() => [V("div", ZV, [(R(!0), z(L, null, I(v.value, (e) => (R(), z("div", {
							key: e.key ?? "",
							class: "col media-ref-group"
						}, [
							v.value.length > 1 ? (R(), z("div", QV, A(e.label), 1)) : U("", !0),
							(R(!0), z(L, null, I(e.refs, (e) => (R(), z("div", {
								key: e.blob,
								class: "media-ref"
							}, [
								H(FP, {
									"blob-key": e.blob,
									class: "media-ref-thumb",
									alt: e.description
								}, null, 8, ["blob-key", "alt"]),
								V("span", $V, A(e.id), 1),
								V("input", {
									class: "input grow",
									value: e.description,
									placeholder: M(J)("media.image.refs.description"),
									onChange: (t) => {
										e.description = t.target.value, M(xx)();
									}
								}, null, 40, eH),
								g.value.length > 1 ? (R(), B(LV, {
									key: 0,
									"model-value": e.card ?? "",
									options: _.value,
									"onUpdate:modelValue": (t) => ee(e, t)
								}, null, 8, [
									"model-value",
									"options",
									"onUpdate:modelValue"
								])) : U("", !0),
								H(Q, {
									icon: M(mj),
									label: M(J)("common.delete"),
									small: "",
									danger: "",
									align: "end",
									onClick: (t) => te(e)
								}, null, 8, [
									"icon",
									"label",
									"onClick"
								])
							]))), 128)),
							V("button", {
								type: "button",
								class: "btn ghost add",
								onClick: (t) => x(e.key)
							}, [H(M(kA)), ba(A(M(J)("media.image.refs.add")), 1)], 8, tH)
						]))), 128)), V("input", {
							ref_key: "fileInput",
							ref: y,
							type: "file",
							accept: "image/*",
							multiple: "",
							hidden: "",
							onChange: S
						}, null, 544)])]),
						_: 1
					}, 8, ["label", "help"])) : U("", !0),
					H(UV, {
						connection: n.value,
						onChanged: h[11] ||= (e) => M(xx)()
					}, {
						default: N(() => [n.value.api === "gemini" ? (R(), B($, {
							key: 0,
							label: M(J)("media.image.geminiEndpoint")
						}, {
							default: N(() => [V("select", {
								class: "input",
								value: n.value.endpoint ?? "interactions",
								onChange: h[10] ||= (e) => c("endpoint", e.target.value)
							}, [...h[12] ||= [V("option", { value: "interactions" }, "Interactions", -1), V("option", { value: "generateContent" }, "generateContent", -1)]], 40, nH)]),
							_: 1
						}, 8, ["label"])) : U("", !0)]),
						_: 1
					}, 8, ["connection"])
				])) : U("", !0)
			], 64)) : U("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
});
//#endregion
//#region src/media/speech/connections.ts
function iH(e, t) {
	let n = Pw(e)?.defaults;
	return {
		id: Sx(),
		name: t,
		api: e,
		baseUrl: n?.baseUrl ?? "",
		apiKey: "",
		model: n?.model ?? "",
		headers: {},
		body: "",
		narrator: null,
		bindings: []
	};
}
function aH(e, t) {
	if (e.api === t) return;
	let n = Pw(e.api)?.defaults, r = Pw(t)?.defaults;
	(!e.baseUrl || e.baseUrl === n?.baseUrl) && (e.baseUrl = r?.baseUrl ?? ""), (!e.model || e.model === n?.model) && (e.model = r?.model ?? ""), e.api = t, e.narrator = null, e.bindings = e.bindings.map((e) => ({
		character: e.character,
		voice: null,
		...e.card ? { card: e.card } : {}
	}));
}
//#endregion
//#region src/ui/panel/media/SpeechSettings.vue?vue&type=script&setup=true&lang.ts
var oH = ["value"], sH = ["value"], cH = ["value", "placeholder"], lH = ["value"], uH = [
	"list",
	"value",
	"placeholder"
], dH = ["id"], fH = ["value"], pH = { class: "col" }, mH = {
	key: 0,
	class: "media-ref-group-title ellipsis"
}, hH = [
	"value",
	"placeholder",
	"onChange"
], gH = ["onClick"], _H = /* @__PURE__ */ F({
	__name: "SpeechSettings",
	setup(e) {
		let t = W(() => bx().speech), n = W(() => Tx(t.value)), r = W(() => n.value ? Fw(n.value) : void 0), i = (e) => J(`media.api.${e}`), a = (e, n) => {
			t.value[e] = n, xx();
		};
		function o(e, t) {
			let r = n.value;
			r && (r[e] = t, xx());
		}
		function s() {
			let e = iH("fish", J("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, xx();
		}
		function c(e) {
			let n = Ex(e, J("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, xx();
		}
		function l(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), xx(), AT();
		}
		let u = (e) => {
			t.value.active = e, xx();
		}, d = (e, t) => {
			e.name = t, xx();
		}, f = (e) => {
			n.value && (aH(n.value, e), xx(), AT());
		}, p = W(() => (Y.chatRev, jS())), m = W(() => {
			let e = n.value;
			return e ? [{
				card: "",
				name: J("media.speech.global")
			}, ...p.value.map((e) => ({
				card: e.key,
				name: e.name
			}))].map((t) => ({
				...t,
				bindings: e.bindings.filter((e) => (e.card ?? "") === t.card)
			})) : [];
		}), h = W(() => m.value.map((e) => ({
			value: e.card,
			label: e.name
		})));
		function g(e) {
			n.value?.bindings.push({
				character: "",
				voice: null,
				...e ? { card: e } : {}
			}), xx();
		}
		function _(e, t) {
			Object.assign(e, t), xx();
		}
		function v(e, t) {
			t ? e.card = t : delete e.card, xx();
		}
		function y(e) {
			let t = n.value;
			t && (t.bindings = t.bindings.filter((t) => t !== e), xx(), AT());
		}
		return (e, p) => (R(), B(dN, {
			title: M(J)("media.speech"),
			icon: M(Ik)
		}, {
			actions: N(() => [H(UF, {
				"model-value": t.value.enabled,
				label: M(J)("media.speech"),
				"onUpdate:modelValue": p[0] ||= (e) => a("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: N(() => [t.value.enabled ? (R(), z(L, { key: 0 }, [
				H($, {
					label: M(J)("media.auto"),
					help: M(J)("media.speech.auto.hint"),
					inline: ""
				}, {
					default: N(() => [H(UF, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": p[1] ||= (e) => a("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: M(J)("media.speech.narrator"),
					help: M(J)("media.speech.narrator.hint"),
					inline: ""
				}, {
					default: N(() => [H(UF, {
						"model-value": t.value.narrator,
						"onUpdate:modelValue": p[2] ||= (e) => a("narrator", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H(IV, {
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
					H($, { label: M(J)("media.speech.api") }, {
						default: N(() => [V("select", {
							class: "input",
							value: n.value.api,
							onChange: p[3] ||= (e) => f(e.target.value)
						}, [(R(!0), z(L, null, I(M(gc), (e) => (R(), z("option", {
							key: e,
							value: e
						}, A(i(e)), 9, sH))), 128))], 40, oH)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(J)("media.baseUrl") }, {
						default: N(() => [V("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: r.value?.defaults.baseUrl,
							spellcheck: "false",
							onChange: p[4] ||= (e) => o("baseUrl", e.target.value.trim())
						}, null, 40, cH)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(J)("media.apiKey") }, {
						default: N(() => [V("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: p[5] ||= (e) => o("apiKey", e.target.value.trim())
						}, null, 40, lH)]),
						_: 1
					}, 8, ["label"]),
					H($, {
						label: M(J)("media.model"),
						help: n.value.api === "openrouter" ? M(J)("media.speech.openrouterModel") : void 0
					}, {
						default: N(() => [V("input", {
							class: "input",
							list: `ap-speech-models-${n.value.api}`,
							value: n.value.model,
							placeholder: r.value?.defaults.model,
							spellcheck: "false",
							onChange: p[6] ||= (e) => o("model", e.target.value.trim())
						}, null, 40, uH), V("datalist", { id: `ap-speech-models-${n.value.api}` }, [(R(!0), z(L, null, I(r.value?.models ?? [], (e) => (R(), z("option", {
							key: e,
							value: e
						}, null, 8, fH))), 128))], 8, dH)]),
						_: 1
					}, 8, ["label", "help"]),
					t.value.narrator ? (R(), B($, {
						key: 0,
						label: M(J)("media.speech.narratorVoice")
					}, {
						default: N(() => [H(Wj, {
							connection: n.value,
							"model-value": n.value.narrator,
							label: M(J)("media.speech.narratorVoice"),
							placeholder: M(J)("media.speech.providerDefault"),
							"onUpdate:modelValue": p[7] ||= (e) => o("narrator", e)
						}, null, 8, [
							"connection",
							"model-value",
							"label",
							"placeholder"
						])]),
						_: 1
					}, 8, ["label"])) : U("", !0),
					H($, {
						label: M(J)("media.speech.bindings"),
						help: M(J)("media.speech.bindings.hint")
					}, {
						default: N(() => [V("div", pH, [(R(!0), z(L, null, I(m.value, (e) => (R(), z("div", {
							key: e.card,
							class: "col tight"
						}, [
							m.value.length > 1 ? (R(), z("div", mH, A(e.name), 1)) : U("", !0),
							(R(!0), z(L, null, I(e.bindings, (t, r) => (R(), z("div", {
								key: r,
								class: "speech-binding"
							}, [V("input", {
								class: "input",
								value: t.character,
								placeholder: M(J)("media.speech.character"),
								onChange: (e) => _(t, { character: e.target.value.trim() })
							}, null, 40, hH), H(Wj, {
								class: "grow",
								connection: n.value,
								"model-value": t.voice,
								label: t.character || M(J)("media.speech.character"),
								"onUpdate:modelValue": (e) => _(t, { voice: e })
							}, {
								default: N(() => [m.value.length > 1 ? (R(), B(LV, {
									key: 0,
									"model-value": e.card,
									options: h.value,
									"onUpdate:modelValue": (e) => v(t, e)
								}, null, 8, [
									"model-value",
									"options",
									"onUpdate:modelValue"
								])) : U("", !0), H(Q, {
									icon: M(mj),
									label: M(J)("common.delete"),
									small: "",
									danger: "",
									align: "end",
									onClick: (e) => y(t)
								}, null, 8, [
									"icon",
									"label",
									"onClick"
								])]),
								_: 2
							}, 1032, [
								"connection",
								"model-value",
								"label",
								"onUpdate:modelValue"
							])]))), 128)),
							V("button", {
								type: "button",
								class: "btn ghost add",
								onClick: (t) => g(e.card)
							}, [H(M(XA)), ba(A(M(J)("media.speech.addBinding")), 1)], 8, gH)
						]))), 128))])]),
						_: 1
					}, 8, ["label", "help"]),
					H(UV, {
						connection: n.value,
						onChanged: p[8] ||= (e) => M(xx)()
					}, null, 8, ["connection"])
				])) : U("", !0)
			], 64)) : U("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), vH = ["value"], yH = /* @__PURE__ */ F({
	__name: "MediaTab",
	setup(e) {
		let { preset: n } = fI(), r = W(() => bx().cors), i = [
			"auto",
			"on",
			"off"
		].map((e) => ({
			value: e,
			label: J(`media.cors.${e}`),
			hint: J(`media.cors.${e}.hint`)
		})), a = W(() => [{
			value: "host",
			label: t() ? "TauriTavern" : "SillyTavern",
			hint: J(t() ? "media.proxy.host.tt" : "media.proxy.host.st")
		}, {
			value: "custom",
			label: J("media.proxy.custom"),
			hint: J("media.proxy.custom.hint")
		}]);
		function o(e, t) {
			r.value[e] = t, xx();
		}
		return (e, t) => M(n) ? (R(), z(L, { key: 1 }, [
			H(dN, {
				title: M(J)("media.cors"),
				icon: M(HA),
				collapsible: "",
				open: r.value.mode !== "auto" || r.value.proxy !== "host"
			}, {
				default: N(() => [H(_I, {
					"model-value": r.value.mode,
					options: M(i),
					"onUpdate:modelValue": t[0] ||= (e) => o("mode", e)
				}, null, 8, ["model-value", "options"]), r.value.mode === "off" ? U("", !0) : (R(), z(L, { key: 0 }, [H($, { label: M(J)("media.proxy") }, {
					default: N(() => [H(_I, {
						"model-value": r.value.proxy,
						options: a.value,
						"onUpdate:modelValue": t[1] ||= (e) => o("proxy", e)
					}, null, 8, ["model-value", "options"])]),
					_: 1
				}, 8, ["label"]), r.value.proxy === "custom" ? (R(), B($, {
					key: 0,
					label: M(J)("media.proxy.url")
				}, {
					default: N(() => [V("input", {
						class: "input mono",
						value: r.value.customUrl,
						placeholder: "https://proxy.example/?url={url}",
						spellcheck: "false",
						onChange: t[2] ||= (e) => o("customUrl", e.target.value.trim())
					}, null, 40, vH)]),
					_: 1
				}, 8, ["label"])) : U("", !0)], 64))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"open"
			]),
			M(DC)(M(n)) ? (R(), B(rH, { key: 0 })) : U("", !0),
			M(OC)(M(n)) ? (R(), B(_H, { key: 1 })) : U("", !0)
		], 64)) : (R(), B(mI, { key: 0 }));
	}
}), bH = ["aria-label"], xH = { class: "panel-head" }, SH = { class: "panel-logo" }, CH = { class: "grow" }, wH = { class: "panel-title ellipsis" }, TH = { class: "panel-sub ellipsis" }, EH = [
	"title",
	"aria-selected",
	"onClick"
], DH = { class: "panel-body scroll" }, OH = /* @__PURE__ */ F({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: WA,
				view: uI
			},
			{
				id: "config",
				icon: oj,
				view: XI
			},
			{
				id: "modules",
				icon: Rk,
				view: wz
			},
			{
				id: "writing",
				icon: qA,
				view: Nz
			},
			{
				id: "memory",
				icon: zk,
				view: $z
			},
			{
				id: "storylines",
				icon: CA,
				view: OV
			},
			{
				id: "media",
				icon: Zk,
				view: yH
			},
			{
				id: "debug",
				icon: Bk,
				view: dV
			}
		], n = W(() => t.filter((e) => (e.id !== "storylines" || nk.value) && (e.id !== "media" || kC(RS.value)))), r = W(() => n.value.find((e) => e.id === Y.tab) ?? n.value[0]), i = W({
			get: () => G().enabled,
			set: (e) => {
				G().enabled = e, K();
			}
		}), a = W(() => {
			let e = RS.value;
			return e ? `v${e.version} · ${zS.value.config}` : J("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && Y.panelOpen && (Y.panelOpen = !1);
		};
		return Jr(() => document.addEventListener("keydown", o)), Xr(() => {
			document.removeEventListener("keydown", o), SM(!1);
		}), P(() => Y.panelOpen, (e) => {
			e && SM(!0);
		}, { immediate: !0 }), (e, t) => (R(), B(co, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => M(SM)(!1)
		}, {
			default: N(() => [M(Y).panelOpen ? (R(), z("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": M(J)("app.name")
			}, [
				V("header", xH, [
					V("div", SH, [H(M(MA))]),
					V("div", CH, [V("div", wH, A(M(RS) ? M(Up)(M(RS)) : M(J)("app.name")), 1), V("div", TH, A(a.value), 1)]),
					H(UF, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: M(J)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					H(Q, {
						icon: M(wj),
						label: M(J)("common.close"),
						align: "end",
						below: "",
						onClick: t[1] ||= (e) => M(Y).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				V("nav", {
					class: k(["tabs", { many: n.value.length > 6 }]),
					role: "tablist"
				}, [(R(!0), z(L, null, I(n.value, (e) => (R(), z("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: k(["tab", { on: e.id === M(Y).tab }]),
					title: M(J)(`tab.${e.id}`),
					"aria-selected": e.id === M(Y).tab,
					onClick: (t) => M(Y).tab = e.id
				}, [(R(), B($r(e.icon))), V("span", null, A(M(J)(`tab.${e.id}`)), 1)], 10, EH))), 128))], 2),
				V("main", DH, [(R(), B(Hr, null, [(R(), B($r(r.value.view), { key: r.value.id }))], 1024))])
			], 8, bH)) : U("", !0)]),
			_: 1
		}));
	}
}), kH = { class: "inline-drawer" }, AH = { class: "inline-drawer-toggle inline-drawer-header" }, jH = { class: "inline-drawer-content" }, MH = { class: "flex-container alignItemsCenter spaceBetween" }, NH = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, PH = { key: 0 }, FH = { class: "text_muted" }, IH = {
	key: 1,
	class: "text_muted"
}, LH = /* @__PURE__ */ F({
	__name: "SettingsDrawer",
	setup(e) {
		let t = W({
			get: () => G().enabled,
			set: (e) => {
				G().enabled = e, K();
			}
		});
		return (e, n) => (R(), z("div", kH, [V("div", AH, [V("b", null, A(M(J)("app.name")), 1), n[3] ||= V("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), V("div", jH, [
			V("div", MH, [V("label", NH, [ur(V("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[ss, t.value]]), V("span", null, A(M(J)("settings.enable")), 1)]), V("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => M(US)(),
				onKeydown: n[2] ||= vs((e) => M(US)(), ["enter"])
			}, [n[4] ||= V("i", { class: "fa-solid fa-layer-group" }, null, -1), V("span", null, A(M(J)("panel.open")), 1)], 32)]),
			n[5] ||= V("hr", null, null, -1),
			V("h4", null, A(M(J)("settings.preset")), 1),
			M(RS) ? (R(), z("div", PH, [ba(A(M(Up)(M(RS))) + " ", 1), V("span", FH, "v" + A(M(RS).version) + " · " + A(M(zS).config), 1)])) : (R(), z("i", IH, A(M(J)("settings.inactive")), 1))
		])]));
	}
}), RH = {
	key: 0,
	class: "preset-banner"
}, zH = { class: "preset-banner-text" }, BH = /* @__PURE__ */ F({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => M(RS) ? (R(), z("div", RH, [
			H(M(MA), { class: "preset-banner-icon" }),
			V("span", zH, A(M(J)("banner.usesAp")), 1),
			V("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => M(US)()
			}, A(M(J)("panel.open")), 1)
		])) : U("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function VH() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), Ss(LH).mount(t);
}
function HH() {
	ED("ap-stages", BM, ["mesid"]), ED("ap-cards", jF, ["mesid"]), ED("ap-top-cards", jF, ["mesid", "position"]), ED("ap-dock", IF), ED("ap-storyline", BF, ["mesid"]), ED("ap-panel", OH), ED("ap-preset-banner", BH), wD(), LS();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, LS);
	wM(), VH(), Tk(), tk(), tM(), mM();
}
//#endregion
//#region src/index.ts
var UH = {
	version: "1.12.0",
	buildId: "da4a0bbe1d82621b",
	nextGeneration: (e) => wh(e),
	listPresets: () => Op().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => dh(),
	update: $b,
	togglePanel: (e) => {
		Y.panelOpen = e ?? !Y.panelOpen;
	},
	annotations: bC,
	speech: EC
};
globalThis.advancedPresetInterceptor = ty, window.AdvancedPreset = UH;
function WH(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function GH() {
	for (let { preset: e } of Op()) try {
		await gh(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function KH() {
	let { eventSource: t, eventTypes: n } = e();
	G(), ax(), mE(), YE(), yC(), TC(), zT(), dC(), await i(), await Ep();
	let r = VE();
	for (let { preset: e } of Op()) {
		let t = eh(e);
		t.length && Mg("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => Fv(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => ox(e)), gx(), ey(), t.on(n.MESSAGE_RECEIVED, (e, t) => mC(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Fh.setPending(null), Fh.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Fh.sweep());
	let a = WH(() => {
		let e = dh(), t = e ? Mp(e) : void 0;
		t && Sh(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, a), t.on(n.OAI_PRESET_CHANGED_AFTER, a), t.on(n.OAI_PRESET_CHANGED_AFTER, tD);
	let o = async () => {
		await Promise.race([cE(), new Promise((e) => setTimeout(e, 3e3))]), await GH();
		for (let e of r) x("info", J("presets.backToBuiltin", { version: e.version }), Up(e));
		(async () => {
			await BE();
			for (let { preset: e } of Op()) await eE(e);
			await eD(), await zE();
		})(), mx({ reload: !0 }), sD(), qb();
	};
	t.on(n.APP_READY, () => void o()), HH(), Mg("init", {
		version: "1.12.0",
		build: "da4a0bbe1d82621b",
		enabled: G().enabled
	});
}
var qH = Jb, JH = ZO;
KH().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { qH as advancedPresetOnUpdate, JH as advancedPresetRegisterChatSurface };

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
var C = {}, ne = [], re = () => {}, w = () => !1, ie = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ae = (e) => e.startsWith("onUpdate:"), oe = Object.assign, se = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ce = Object.prototype.hasOwnProperty, T = (e, t) => ce.call(e, t), E = Array.isArray, le = (e) => ge(e) === "[object Map]", ue = (e) => ge(e) === "[object Set]", de = (e) => ge(e) === "[object Date]", fe = (e) => ge(e) === "[object RegExp]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", pe = (e) => typeof e == "symbol", k = (e) => typeof e == "object" && !!e, me = (e) => (k(e) || D(e)) && D(e.then) && D(e.catch), he = Object.prototype.toString, ge = (e) => he.call(e), _e = (e) => ge(e).slice(8, -1), ve = (e) => ge(e) === "[object Object]", ye = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, be = /* @__PURE__ */ te(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), xe = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, Se = /-\w/g, Ce = xe((e) => e.replace(Se, (e) => e.slice(1).toUpperCase())), we = /\B([A-Z])/g, Te = xe((e) => e.replace(we, "-$1").toLowerCase()), Ee = xe((e) => e.charAt(0).toUpperCase() + e.slice(1)), De = xe((e) => e ? `on${Ee(e)}` : ""), Oe = (e, t) => !Object.is(e, t), ke = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Ae = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, je = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Me = (e) => {
	let t = O(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Ne, Pe = () => Ne ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Fe(e) {
	if (E(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = O(r) ? ze(r) : Fe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (O(e) || k(e)) return e;
}
var Ie = /;(?![^(]*\))/g, Le = /:([^]+)/, Re = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ze(e) {
	let t = {};
	return e.replace(Re, (e) => e.startsWith("/*") ? "" : e).split(Ie).forEach((e) => {
		if (e) {
			let n = e.split(Le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (O(e)) t = e;
	else if (E(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (k(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Be = /* @__PURE__ */ te("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Ve(e) {
	return !!e || e === "";
}
function He(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ke(e[i], t[i], n);
	return r;
}
function Ue(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ke(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function We(e, t, n) {
	let r = le(e), i = le(t);
	if (r || i || (r = ue(e), i = ue(t), r || i)) return r && i ? Ue(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ke(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Ge(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ke(e, t, n) {
	if (e === t) return !0;
	let r = de(e), i = de(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = pe(e), i = pe(t), r || i ? e === t : (r = E(e), i = E(t), r || i ? r && i ? Ge(e, t, n, He) : !1 : (r = k(e), i = k(t), r || i ? !r || !i ? !1 : Ge(e, t, n, We) : String(e) === String(t))));
}
function qe(e, t) {
	return e.findIndex((e) => Ke(e, t));
}
var Je = (e) => !!(e && e.__v_isRef === !0), j = (e) => O(e) ? e : e == null ? "" : E(e) || k(e) && (e.toString === he || !D(e.toString)) ? Je(e) ? j(e.value) : JSON.stringify(e, Ye, 2) : String(e), Ye = (e, t) => Je(t) ? Ye(e, t.value) : le(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Xe(t, r) + " =>"] = n, e), {}) } : ue(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Xe(e)) } : pe(t) ? Xe(t) : k(t) && !E(t) && !ve(t) ? String(t) : t, Xe = (e, t = "") => pe(e) ? `Symbol(${e.description ?? t})` : e, Ze, Qe = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ze && (Ze.active ? (this.parent = Ze, this.index = (Ze.scopes || (Ze.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ze;
			try {
				return Ze = this, e();
			} finally {
				Ze = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ze, Ze = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ze === this) Ze = this.prevScope;
			else {
				let e = Ze;
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
function $e() {
	return Ze;
}
var et, tt = /* @__PURE__ */ new WeakSet(), nt = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ze && (Ze.active ? Ze.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, tt.has(this) && (tt.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ot(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, yt(this), lt(this);
		let e = et, t = ht;
		et = this, ht = !0;
		try {
			return this.fn();
		} finally {
			ut(this), et = e, ht = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) pt(e);
			this.deps = this.depsTail = void 0, yt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? tt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		dt(this) && this.run();
	}
	get dirty() {
		return dt(this);
	}
}, rt = 0, it, at;
function ot(e, t = !1) {
	e.flags |= 8, t ? (e.next = at, at = e) : (e.next = it, it = e);
}
function st() {
	rt++;
}
function ct() {
	if (--rt > 0) return;
	if (at) {
		let e = at;
		for (at = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; it;) {
		let t = it;
		for (it = void 0; t;) {
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
function lt(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ut(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), pt(r), mt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function dt(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ft(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ft(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === bt) || (e.globalVersion = bt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !dt(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = et, r = ht;
	et = e, ht = !0;
	try {
		lt(e);
		let n = e.fn(e._value);
		(t.version === 0 || Oe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		et = n, ht = r, ut(e), e.flags &= -3;
	}
}
function pt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) pt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function mt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ht = !0, gt = [];
function _t() {
	gt.push(ht), ht = !1;
}
function vt() {
	let e = gt.pop();
	ht = e === void 0 || e;
}
function yt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = et;
		et = void 0;
		try {
			t();
		} finally {
			et = e;
		}
	}
}
var bt = 0, xt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, St = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!et || !ht || et === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== et) t = this.activeLink = new xt(et, this), et.deps ? (t.prevDep = et.depsTail, et.depsTail.nextDep = t, et.depsTail = t) : et.deps = et.depsTail = t, Ct(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = et.depsTail, t.nextDep = void 0, et.depsTail.nextDep = t, et.depsTail = t, et.deps === t && (et.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, bt++, this.notify(e);
	}
	notify(e) {
		st();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ct();
		}
	}
};
function Ct(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ct(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var wt = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ Symbol(""), Et = /* @__PURE__ */ Symbol(""), Dt = /* @__PURE__ */ Symbol("");
function Ot(e, t, n) {
	if (ht && et) {
		let t = wt.get(e);
		t || wt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new St()), r.map = t, r.key = n), r.track();
	}
}
function kt(e, t, n, r, i, a) {
	let o = wt.get(e);
	if (!o) {
		bt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (st(), t === "clear") o.forEach(s);
	else {
		let i = E(e), a = i && ye(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Dt || !pe(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Dt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Tt)), le(e) && s(o.get(Et)));
				break;
			case "delete":
				i || (s(o.get(Tt)), le(e) && s(o.get(Et)));
				break;
			case "set": le(e) && s(o.get(Tt));
		}
	}
	ct();
}
function At(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e || (Ot(t, "iterate", Dt), /* @__PURE__ */ _n(e)) ? t : /* @__PURE__ */ gn(e) ? /* @__PURE__ */ hn(e) ? t.map((e) => xn(bn(e))) : t.map(xn) : t.map(bn);
}
function jt(e) {
	return Ot(e = /* @__PURE__ */ M(e), "iterate", Dt), e;
}
function Mt(e, t) {
	return /* @__PURE__ */ gn(e) ? xn(/* @__PURE__ */ hn(e) ? bn(t) : t) : bn(t);
}
var Nt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Pt(this, Symbol.iterator, (e) => Mt(this, e));
	},
	concat(...e) {
		return At(this).concat(...e.map((e) => E(e) ? At(e) : e));
	},
	entries() {
		return Pt(this, "entries", (e) => (e[1] = Mt(this, e[1]), e));
	},
	every(e, t) {
		return Lt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Lt(this, "filter", e, t, (e) => e.map((e) => Mt(this, e)), arguments);
	},
	find(e, t) {
		return Lt(this, "find", e, t, (e) => Mt(this, e), arguments);
	},
	findIndex(e, t) {
		return Lt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Lt(this, "findLast", e, t, (e) => Mt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Lt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Lt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return zt(this, "includes", e);
	},
	indexOf(...e) {
		return zt(this, "indexOf", e);
	},
	join(e) {
		return At(this).join(e);
	},
	lastIndexOf(...e) {
		return zt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Lt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Bt(this, "pop");
	},
	push(...e) {
		return Bt(this, "push", e);
	},
	reduce(e, ...t) {
		return Rt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Rt(this, "reduceRight", e, t);
	},
	shift() {
		return Bt(this, "shift");
	},
	some(e, t) {
		return Lt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Bt(this, "splice", e);
	},
	toReversed() {
		return At(this).toReversed();
	},
	toSorted(e) {
		return At(this).toSorted(e);
	},
	toSpliced(...e) {
		return At(this).toSpliced(...e);
	},
	unshift(...e) {
		return Bt(this, "unshift", e);
	},
	values() {
		return Pt(this, "values", (e) => Mt(this, e));
	}
};
function Pt(e, t, n) {
	let r = jt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ _n(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Ft(a.next(), n), i !== It[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Ft(a._next(), n);
	}
	return a;
}
function Ft(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var It = Array.prototype;
function Lt(e, t, n, r, i, a) {
	let o = jt(e), s = o !== e && !/* @__PURE__ */ _n(e), c = o[t];
	if (c !== It[t]) {
		let t = c.apply(e, a);
		return s ? bn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Mt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Rt(e, t, n, r) {
	let i = jt(e), a = i !== e && !/* @__PURE__ */ _n(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Mt(e, t)), n.call(this, t, Mt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Mt(e, c) : c;
}
function zt(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	Ot(r, "iterate", Dt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ vn(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function Bt(e, t, n = []) {
	_t(), st();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return ct(), vt(), r;
}
var Vt = /* @__PURE__ */ te("__proto__,__v_isRef,__isVue"), Ht = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(pe));
function Ut(e) {
	pe(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return Ot(t, "has", e), t.hasOwnProperty(e);
}
var Wt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? ln : cn : i ? sn : on).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = E(e);
		if (!r) {
			let e;
			if (a && (e = Nt[t])) return e;
			if (t === "hasOwnProperty") return Ut;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Sn(e) ? e : n);
		if ((pe(t) ? Ht.has(t) : Vt(t)) || (r || Ot(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Sn(o)) {
			let e = a && ye(t) ? o : o.value;
			return r && k(e) ? /* @__PURE__ */ pn(e) : e;
		}
		return k(o) ? r ? /* @__PURE__ */ pn(o) : /* @__PURE__ */ dn(o) : o;
	}
}, Gt = class extends Wt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = E(e) && ye(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ gn(i);
			if (!/* @__PURE__ */ _n(n) && !/* @__PURE__ */ gn(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ Sn(i) && !/* @__PURE__ */ Sn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : T(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Sn(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? Oe(n, i) && kt(e, "set", t, n, i) : kt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = T(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && kt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!pe(t) || !Ht.has(t)) && Ot(e, "has", t), n;
	}
	ownKeys(e) {
		return Ot(e, "iterate", E(e) ? "length" : Tt), Reflect.ownKeys(e);
	}
}, Kt = class extends Wt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, qt = /* @__PURE__ */ new Gt(), Jt = /* @__PURE__ */ new Kt(), Yt = /* @__PURE__ */ new Gt(!0), Xt = (e) => e, Zt = (e) => Reflect.getPrototypeOf(e);
function Qt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = le(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Xt : t ? xn : bn;
		return !t && Ot(a, "iterate", c ? Et : Tt), oe(Object.create(l), { next() {
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
function $t(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function en(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (Oe(n, a) && Ot(i, "get", n), Ot(i, "get", a));
			let { has: o } = Zt(i), s = t ? Xt : e ? xn : bn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Ot(/* @__PURE__ */ M(t), "iterate", Tt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (Oe(t, i) && Ot(r, "has", t), Ot(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? Xt : e ? xn : bn;
			return !e && Ot(o, "iterate", Tt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return oe(n, e ? {
		add: $t("add"),
		set: $t("set"),
		delete: $t("delete"),
		clear: $t("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = Zt(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ _n(e) && !/* @__PURE__ */ gn(e) ? i : e;
			return r.has.call(n, a) || Oe(e, a) && r.has.call(n, e) || Oe(i, a) && r.has.call(n, i) || (n.add(a), kt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ _n(n) && !/* @__PURE__ */ gn(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = Zt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Oe(n, s) && kt(r, "set", e, n, s) : kt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = Zt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && kt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && kt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Qt(r, e, t);
	}), n;
}
function tn(e, t) {
	let n = en(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(T(n, i) && i in r ? n : r, i, a);
}
var nn = { get: /* @__PURE__ */ tn(!1, !1) }, rn = { get: /* @__PURE__ */ tn(!1, !0) }, an = { get: /* @__PURE__ */ tn(!0, !1) }, on = /* @__PURE__ */ new WeakMap(), sn = /* @__PURE__ */ new WeakMap(), cn = /* @__PURE__ */ new WeakMap(), ln = /* @__PURE__ */ new WeakMap();
function un(e) {
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
function dn(e) {
	return /* @__PURE__ */ gn(e) ? e : mn(e, !1, qt, nn, on);
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	return mn(e, !1, Yt, rn, sn);
}
// @__NO_SIDE_EFFECTS__
function pn(e) {
	return mn(e, !0, Jt, an, cn);
}
function mn(e, t, n, r, i) {
	if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = un(_e(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function hn(e) {
	return /* @__PURE__ */ gn(e) ? /* @__PURE__ */ hn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function gn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function _n(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function yn(e) {
	return !T(e, "__v_skip") && Object.isExtensible(e) && Ae(e, "__v_skip", !0), e;
}
var bn = (e) => k(e) ? /* @__PURE__ */ dn(e) : e, xn = (e) => k(e) ? /* @__PURE__ */ pn(e) : e;
// @__NO_SIDE_EFFECTS__
function Sn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return Cn(e, !1);
}
function Cn(e, t) {
	return /* @__PURE__ */ Sn(e) ? e : new wn(e, t);
}
var wn = class {
	constructor(e, t) {
		this.dep = new St(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : bn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ _n(e) || /* @__PURE__ */ gn(e);
		e = n ? e : /* @__PURE__ */ M(e), Oe(e, t) && (this._rawValue = e, this._value = n ? e : bn(e), this.dep.trigger());
	}
};
function P(e) {
	return /* @__PURE__ */ Sn(e) ? e.value : e;
}
var Tn = {
	get: (e, t, n) => t === "__v_raw" ? e : P(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Sn(i) && !/* @__PURE__ */ Sn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function En(e) {
	return /* @__PURE__ */ hn(e) ? e : new Proxy(e, Tn);
}
var Dn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new St(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function On(e) {
	return new Dn(e);
}
var kn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new St(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = bt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && et !== this) return ot(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ft(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function An(e, t, n = !1) {
	let r, i;
	return D(e) ? r = e : (r = e.get, i = e.set), new kn(r, i, n);
}
var jn = {}, Mn = /* @__PURE__ */ new WeakMap(), Nn = void 0;
function Pn(e, t = !1, n = Nn) {
	if (n) {
		let t = Mn.get(n);
		t || Mn.set(n, t = []), t.push(e);
	}
}
function Fn(e, t, n = C) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ _n(e) || i === !1 || i === 0 ? In(e, 1) : In(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ Sn(e) ? (d = () => e.value, m = /* @__PURE__ */ _n(e)) : /* @__PURE__ */ hn(e) ? (d = () => l(e), m = !0) : E(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ hn(e) || /* @__PURE__ */ _n(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ Sn(e)) return e.value;
		if (/* @__PURE__ */ hn(e)) return l(e);
		if (D(e)) return c ? c(e, 2) : e();
	})) : d = D(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			_t();
			try {
				f();
			} finally {
				vt();
			}
		}
		let t = Nn;
		Nn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Nn = t;
		}
	} : re, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => In(e(), t);
	}
	let g = $e(), _ = () => {
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
	let v = h ? Array(e.length).fill(jn) : jn, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => Oe(e, v[t])) : Oe(n, v))) {
					let e = Nn;
					_t();
					try {
						f && f(), Nn = u;
						let e = [
							n,
							v === jn ? void 0 : h && v[0] === jn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Nn = e, vt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new nt(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => Pn(e, !1, u), f = u.onStop = () => {
		let e = Mn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Mn.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function In(e, t = Infinity, n) {
	if (t <= 0 || !k(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Sn(e)) In(e.value, t, n);
	else if (E(e)) for (let r = 0; r < e.length; r++) In(e[r], t, n);
	else if (ue(e) || le(e)) e.forEach((e) => {
		In(e, t, n);
	});
	else if (ve(e)) {
		for (let r in e) In(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && In(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Ln(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		zn(e, t, n);
	}
}
function Rn(e, t, n, r) {
	if (D(e)) {
		let i = Ln(e, t, n, r);
		return i && me(i) && i.catch((e) => {
			zn(e, t, n);
		}), i;
	}
	if (E(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Rn(e[a], t, n, r));
		return i;
	}
}
function zn(e, t, n, r = !0) {
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
			_t(), Ln(a, null, 10, [
				e,
				i,
				o
			]), vt();
			return;
		}
	}
	Bn(e, n, i, r, o);
}
function Bn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Vn = [], Hn = -1, Un = [], Wn = null, Gn = 0, Kn = /* @__PURE__ */ Promise.resolve(), qn = null;
function Jn(e) {
	let t = qn || Kn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Yn(e) {
	let t = Hn + 1, n = Vn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Vn[r], a = rr(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Xn(e) {
	if (!(e.flags & 1)) {
		let t = rr(e), n = Vn[Vn.length - 1];
		!n || !(e.flags & 2) && t >= rr(n) ? Vn.push(e) : Vn.splice(Yn(t), 0, e), e.flags |= 1, Zn();
	}
}
function Zn() {
	qn ||= Kn.then(ir);
}
function Qn(e) {
	if (!E(e)) Wn && e.id === -1 ? Wn.splice(Gn + 1, 0, e) : e.flags & 1 || (Un.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Un.push(e[t]);
	Zn();
}
function $n(e, t, n, r = Hn + 1) {
	for (; r < Vn.length; r++) {
		let n = Vn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Vn.splice(r, 1), r = e ? r - 1 : Hn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function er(e, t, n = 0) {
	if (Un.length) {
		let e = Un, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Un.length; i++) {
				let a = Un[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Un[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => rr(e) - rr(t));
		if (Un.length = r, Wn) {
			for (let e = 0; e < i.length; e++) Wn.push(i[e]);
			return;
		}
		for (Wn = i, Gn = 0; Gn < Wn.length; Gn++) {
			let e = Wn[Gn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Wn = null, Gn = 0;
	}
}
var tr = !1;
function nr(e, t) {
	if (tr) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Un);
	e(), tr = !0;
	try {
		$n(void 0, t), er(void 0, n, t);
	} finally {
		tr = !1;
	}
}
var rr = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function ir(e) {
	try {
		for (Hn = 0; Hn < Vn.length; Hn++) {
			let e = Vn[Hn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Ln(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Hn < Vn.length; Hn++) {
			let e = Vn[Hn];
			e && (e.flags &= -2);
		}
		Hn = -1, Vn.length = 0, er(e), qn = null, (Vn.length || Un.length) && ir(e);
	}
}
var ar = null, or = null;
function sr(e) {
	let t = ar;
	return ar = e, or = e && e.type.__scopeId || null, t;
}
function F(e, t = ar, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ua(-1);
		let i = sr(t), a = oa.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = oa.length; e > a; e--) ca();
			sr(i), r._d && ua(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function cr(e, t) {
	if (ar === null) return e;
	let n = Ha(ar), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = C] = t[e];
		i && (D(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && In(a), r.push({
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
function lr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (_t(), Rn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), vt());
	}
}
function ur(e, t, n = !1) {
	let r = ka();
	if (r || pi) {
		let i = pi ? pi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
var dr = /* @__PURE__ */ Symbol.for("v-scx"), fr = () => ur(dr);
function pr(e, t) {
	return gr(e, null, t);
}
function mr(e, t) {
	return gr(e, null, { flush: "sync" });
}
function hr(e, t, n) {
	return gr(e, t, n);
}
function gr(e, t, n = C) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = oe({}, n), c = t && r || !t && a !== "post", l;
	if (Fa) {
		if (a === "sync") {
			let e = fr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = re, e.resume = re, e.pause = re, e;
		}
	}
	let u = Oa;
	s.call = (e, t, n) => Rn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Wi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Xn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Fn(e, t, s);
	return Fa && (l ? l.push(f) : c && f()), f;
}
var _r = /* @__PURE__ */ Symbol("_vte"), vr = (e) => e.__isTeleport, yr = /* @__PURE__ */ Symbol("_leaveCb"), br = /* @__PURE__ */ Symbol("_enterCb");
function xr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return qr(() => {
		e.isMounted = !0;
	}), Yr(() => {
		e.isUnmounting = !0;
	}), e;
}
var Sr = [Function, Array], Cr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: Sr,
	onEnter: Sr,
	onAfterEnter: Sr,
	onEnterCancelled: Sr,
	onBeforeLeave: Sr,
	onLeave: Sr,
	onAfterLeave: Sr,
	onLeaveCancelled: Sr,
	onBeforeAppear: Sr,
	onAppear: Sr,
	onAfterAppear: Sr,
	onAppearCancelled: Sr
}, wr = {
	name: "BaseTransition",
	props: Cr,
	setup(e, { slots: t }) {
		let n = ka(), r = xr();
		return () => {
			let i = t.default && Mr(t.default(), !0), a = i && i.length ? Tr(i) : n.subTree ? G() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ M(e), { mode: s } = o;
			if (r.isLeaving) return kr(a);
			let c = Ar(a);
			if (!c) return kr(a);
			let l = Or(c, o, r, n, (e) => l = e);
			c.type !== ia && jr(c, l);
			let u = n.subTree && Ar(n.subTree);
			if (u && u.type !== ia && !pa(u, c) && Nr(n.subTree)) {
				let e = Or(u, o, r, n);
				if (jr(u, e), s === "out-in" && c.type !== ia) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, kr(a);
				s === "in-out" && c.type !== ia ? e.delayLeave = (e, t, n) => {
					let i = Dr(r, u);
					i[String(u.key)] = u, e[yr] = () => {
						t(), e[yr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Tr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ia) {
			t = n;
			break;
		}
	}
	return t;
}
var Er = wr;
function Dr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function Or(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = Dr(n, e), S = (e, t) => {
		e && Rn(e, r, 9, t);
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
			t[yr] && t[yr](!0);
			let i = x[b];
			if (i && pa(e, i)) {
				let e = i.el[yr];
				if (!e) {
					let t = Nr(i);
					e = t && t.el[yr];
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
			t[br] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), te.delayedLeave && te.delayedLeave(), t[br] = void 0);
			};
			let c = t[br].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[br] && t[br](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[yr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[yr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[yr].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = Or(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return te;
}
function kr(e) {
	if (Br(e)) return e = va(e), e.children = null, e;
}
function Ar(e) {
	if (!Br(e)) return vr(e.type) && e.children ? Tr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && D(n.default)) return n.default();
	}
}
function jr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		jr(vr(n.type) && Ar(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === R && E(e.children)) {
		let n = bi(e.children, !1);
		n && jr(n, t);
	}
}
function Mr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(Mr(o.children, t, s))) : (t || o.type !== ia) && r.push(s == null ? o : va(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Nr(e) {
	if (e.component) return Nr(e.component.subTree);
	if (e.type === R) {
		let t = E(e.children) && bi(e.children, !1);
		return t ? Nr(t) : void 0;
	}
	if (e.type !== ia) return e;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return D(e) ? /* @__PURE__ */ oe({ name: e.name }, t, { setup: e }) : e;
}
function Pr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Fr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Ir = /* @__PURE__ */ new WeakMap();
function Lr(e, t, n, r, i = !1) {
	if (E(e)) {
		e.forEach((e, a) => Lr(e, t && (E(t) ? t[a] : t), n, r, i));
		return;
	}
	if (zr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Lr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ha(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === C ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ M(d), p = d === C ? w : (e) => !Fr(u, e) && T(f, e), m = (e, t) => !(t && Fr(u, t));
	if (l != null && l !== c) {
		if (Rr(t), O(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ Sn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (D(c)) Ln(c, s, 12, [o, u]);
	else {
		let t = O(c), r = /* @__PURE__ */ Sn(c);
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
					s(), Ir.delete(e);
				};
				t.id = -1, Ir.set(e, t), Wi(t, n);
			} else Rr(e), s();
		}
	}
}
function Rr(e) {
	let t = Ir.get(e);
	t && (t.flags |= 8, Ir.delete(e));
}
Pe().requestIdleCallback, Pe().cancelIdleCallback;
var zr = (e) => !!e.type.__asyncLoader, Br = (e) => e.type.__isKeepAlive, Vr = {
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
		let n = ka(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Wi(() => {
				a.isDeactivated = !1, a.a && ke(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && Ca(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			$i(t.m), $i(t.a), l(e, f, null, 1, s), Wi(() => {
				t.da && ke(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && Ca(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Ur(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ua(zr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !pa(t, o)) ? p(t) : o && (Ur(o), t && Ur(t)), i.delete(e), a.delete(e);
		}
		hr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Hr(e, t)), t && m((e) => !Hr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (ta(n.subTree.type) ? Wi(() => {
				let e = Wr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Wr(n.subTree)));
		};
		return qr(_), Jr(_), Yr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Wr(t);
				if (e.type === i.type && e.key === i.key) {
					Ur(i);
					let e = i.component.da;
					e && Wi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!fa(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Wr(r);
			if (s.type === ia) return o = null, s;
			let c = s.type, l = Ua(zr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Hr(u, l)) || d && l && Hr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = va(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && jr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, ta(r.type) ? r : s;
		};
	}
};
function Hr(e, t) {
	return E(e) ? e.some((e) => Hr(e, t)) : O(e) ? e.split(",").includes(t) : fe(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Ur(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Wr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Gr(e, t, n = Oa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			_t();
			let i = Ma(n), a = Rn(t, n, e, r);
			return i(), vt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Kr = (e) => (t, n = Oa) => {
	(!Fa || e === "sp") && Gr(e, (...e) => t(...e), n);
}, qr = Kr("m"), Jr = Kr("u"), Yr = Kr("bum"), Xr = "components", Zr = /* @__PURE__ */ Symbol.for("v-ndc");
function Qr(e) {
	return O(e) ? $r(Xr, e, !1) || e : e || Zr;
}
function $r(e, t, n = !0, r = !1) {
	let i = ar || Oa;
	if (i) {
		let n = i.type;
		if (e === Xr) {
			let e = Ua(n, !1);
			if (e && (e === t || e === Ce(t) || e === Ee(Ce(t)))) return n;
		}
		let a = ei(i[e] || n[e], t) || ei(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function ei(e, t) {
	return e && (e[t] || e[Ce(t)] || e[Ee(Ce(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = E(e);
	if (o || O(e)) {
		let n = o && /* @__PURE__ */ hn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ _n(e), s = /* @__PURE__ */ gn(e), e = jt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? xn(bn(e[n])) : bn(e[n]) : e[n], n, void 0, a && a[n]);
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
function ti(e, t) {
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
function ni(e, t, n, r, i, a) {
	if (n ??= {}, ar.ce || ar.parent && zr(ar.parent) && ar.parent.ce) {
		let e = a != null && n.key == null ? oe({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = oa.length;
	z();
	let c;
	try {
		let i = o && ri(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !pe(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = oa.length; e > s; e--) ca();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ri(e) {
	return e.some((e) => !fa(e) || !(e.type === ia || e.type === R && !ri(e.children))) ? e : null;
}
var ii = (e) => e ? Pa(e) ? Ha(e) : ii(e.parent) : null, ai = /* @__PURE__ */ oe(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ii(e.parent),
	$root: (e) => ii(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Xn(e.update);
	},
	$nextTick: (e) => e.n ||= Jn.bind(e.proxy),
	$watch: (e) => re
}), oi = (e, t) => e !== C && !e.__isScriptSetup && T(e, t), si = {
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
			else if (oi(r, t)) return o[t] = 1, r[t];
			else if (T(a, t)) return o[t] = 3, a[t];
			else if (n !== C && T(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = ai[t], u, d;
		if (l) return t === "$attrs" && Ot(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== C && T(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, T(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return oi(i, t) ? (i[t] = n, !0) : T(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || oi(t, s) || T(a, s) || T(r, s) || T(ai, s) || T(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? T(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ci(e) {
	return E(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function li(e, t) {
	return !e || !t ? e || t : E(e) && E(t) ? e.concat(t) : oe({}, ci(e), ci(t));
}
function ui() {
	return {
		app: null,
		config: {
			isNativeTag: w,
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
var di = 0;
function fi(e, t) {
	return function(n, r = null) {
		D(n) || (n = oe({}, n)), r != null && !k(r) && (r = null);
		let i = ui(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: di++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ka,
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
					let u = c._ceVNode || U(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ha(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Rn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = pi;
				pi = c;
				try {
					return e();
				} finally {
					pi = t;
				}
			}
		};
		return c;
	};
}
var pi = null;
function mi(e, t, n = C) {
	let r = ka(), i = Ce(t), a = Te(t), o = hi(e, i), s = On((o, s) => {
		let c, l = C, u;
		return mr(() => {
			let t = e[i];
			Oe(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!Oe(o, c) && !(l !== C && Oe(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), Oe(e, l) && (Oe(e, o) && !Oe(o, u) || f && l !== C && !Oe(o, c)) && s(), l = e, u = o;
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
var hi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ce(t)}Modifiers`] || e[`${Te(t)}Modifiers`];
function gi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || C, i = n, a = t.startsWith("update:"), o = a && hi(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => O(e) ? e.trim() : e)), o.number && (i = i.map(je)));
	let s, c = r[s = De(t)] || r[s = De(Ce(t))];
	!c && a && (c = r[s = De(Te(t))]), c && Rn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Rn(l, e, 6, i);
	}
}
function _i(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (E(a) ? a.forEach((e) => o[e] = null) : oe(o, a), k(e) && r.set(e, o), o) : (k(e) && r.set(e, null), null);
}
function vi(e, t) {
	return !e || !ie(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), T(e, t[0].toLowerCase() + t.slice(1)) || T(e, Te(t)) || T(e, t));
}
function yi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = sr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = ya(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = ya(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : xi(s);
		}
	} catch (t) {
		oa.length = 0, zn(t, e, 1), _ = U(ia);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(ae) && (v = Si(v, a)), y = va(y, v, !1, !0));
	}
	return n.dirs && (y = va(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && jr(vr(y.type) && Ar(y) || y, n.transition), _ = y, sr(g), _;
}
function bi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (fa(r)) {
			if (r.type !== ia || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var xi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || ie(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Si = (e, t) => {
	let n = {};
	for (let r in e) (!ae(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Ci(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? wi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ti(o, r, n) && !vi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || wi(r, o, l) : !!o;
	return !1;
}
function wi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!T(e, a) || Ti(t, e, a) && !vi(n, a)) return !0;
	}
	return !1;
}
function Ti(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && k(r) && k(i) ? !Ke(r, i) : r !== i;
}
function Ei({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Di = {}, Oi = () => Object.create(Di), ki = (e) => Object.getPrototypeOf(e) === Di;
function Ai(e, t, n, r = !1) {
	let i = {}, a = Oi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Mi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ fn(i) : e.type.props ? i : a, e.attrs = a;
}
function ji(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (vi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (T(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = Ce(o);
						i[t] = Ni(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Mi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !T(t, a) && ((r = Te(a)) === a || !T(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Ni(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !T(t, e)) && (delete a[e], l = !0);
	}
	l && kt(e.attrs, "set", "");
}
function Mi(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (be(c)) continue;
		let l = t[c], u;
		i && T(i, u = Ce(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : vi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ M(n), r = s || C;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Ni(i, t, s, r[s], e, !T(r, s));
		}
	}
	return o;
}
function Ni(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = T(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && D(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ma(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === Te(n)) && (r = !0));
	}
	return r;
}
function Pi(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return k(e) && r.set(e, ne), ne;
	if (E(a)) for (let e = 0; e < a.length; e++) {
		let t = Ce(a[e]);
		Fi(t) && (o[t] = C);
	}
	else if (a) for (let e in a) {
		let t = Ce(e);
		if (Fi(t)) {
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
	return k(e) && r.set(e, c), c;
}
function Fi(e) {
	return e[0] !== "$" && !be(e);
}
var Ii = (e) => e === "_" || e === "_ctx" || e === "$stable", Li = (e) => E(e) ? e.map(ya) : [ya(e)], Ri = (e, t, n) => {
	if (t._n) return t;
	let r = F((...e) => Li(t(...e)), n);
	return r._c = !1, r;
}, zi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ii(n)) continue;
		let i = e[n];
		if (D(i)) t[n] = Ri(n, i, r);
		else if (i != null) {
			let e = Li(i);
			t[n] = () => e;
		}
	}
}, Bi = (e, t) => {
	let n = Li(t);
	e.slots.default = () => n;
}, Vi = (e, t, n) => {
	for (let r in t) (n || !Ii(r)) && (e[r] = t[r]);
}, Hi = (e, t, n) => {
	let r = e.slots = Oi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Vi(r, t, n), n && Ae(r, "_", e, !0)) : zi(t, r);
	} else t && Bi(e, t);
}, Ui = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = C;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Vi(i, t, n) : (a = !t.$stable, zi(t, i)), o = t;
	} else t && (Bi(e, t), o = { default: 1 });
	if (a) for (let e in i) !Ii(e) && o[e] == null && delete i[e];
}, Wi = na;
function Gi(e) {
	return Ki(e);
}
function Ki(e, t) {
	let n = Pe();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = re, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !pa(e, t) && (r = ge(e), O(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === ne && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case ra:
				g(e, t, n, r);
				break;
			case ia:
				_(e, t, n, r);
				break;
			case aa:
				e ?? v(t, n, r, o);
				break;
			case R:
				oe(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? se(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ve);
		}
		u != null && i ? Lr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Lr(e.ref, null, a, e, !0);
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
				n && n._beginPatch(), w(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && te(e.children, f, null, i, s, qi(e, c), l, d), _ && lr(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !be(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Ca(p, i, e);
		}
		_ && lr(e, null, i, "beforeMount");
		let v = Yi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Wi(() => {
			try {
				p && Ca(p, i, e), v && g.enter(f), _ && lr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ta(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ba(e[l]) : ya(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, w = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || C, m = t.props || C, h;
		if (n && Ji(n, !1), (h = m.onVnodeBeforeUpdate) && Ca(h, n, t, e), f && lr(t, e, n, "beforeUpdate"), n && Ji(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ie(e.dynamicChildren, d, c, n, r, qi(t, i), o) : s || ue(e, t, c, null, n, r, qi(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Wi(() => {
			h && Ca(h, n, t, e), f && lr(t, e, n, "updated");
		}, r);
	}, ie = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ea(c), f = u && (c.type === R || !pa(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ae = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== C) for (let o in t) !be(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (be(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, oe = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), te(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ie(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Xi(e, t, !0)) : ue(e, t, n, f, a, o, c, l, u);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ce(t, n, r, i, a, o, c) : T(e, t, c);
	}, ce = (e, t, n, r, i, a, o) => {
		let s = e.component = Da(e, r, i);
		if (Br(e) && (s.ctx.renderer = ve), Ia(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, E, o, a), !e.el) {
				let r = s.subTree = U(ia);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else E(s, e, t, n, i, a, o);
	}, T = (e, t, n) => {
		let r = t.component = e.component;
		if (Ci(e, t, n)) {
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
					let n = Qi(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							Wi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Ji(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && ke(n), (f = t.props && t.props.onVnodeBeforeUpdate) && Ca(f, s, t, c), Ji(e, !0);
				let p = yi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ge(m), e, i, a), t.el = p.el, u === null && Ei(e, p.el), r && Wi(r, i), (f = t.props && t.props.onVnodeUpdated) && Wi(() => Ca(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = zr(t);
				if (Ji(e, !1), l && ke(l), !m && (o = c && c.onVnodeBeforeMount) && Ca(o, d, t), Ji(e, !0), s && xe) {
					let t = () => {
						e.subTree = yi(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = yi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Wi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Wi(() => Ca(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && zr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Wi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new nt(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Xn(u), Ji(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ji(e, t.props, r, n), Ui(e, t.children, n), _t(), $n(e), vt();
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
		m & 8 ? (d & 16 && he(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? fe(l, f, n, r, i, a, o, s, c) : he(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && te(f, n, r, i, a, o, s, c));
	}, de = (e, t, n, r, i, a, o, s, c) => {
		e ||= ne, t ||= ne;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? ba(t[f]) : ya(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? he(e, i, a, !0, !1, d) : te(t, n, r, i, a, o, s, c, d);
	}, fe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? ba(t[l]) : ya(t[l]);
			if (pa(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? ba(t[f]) : ya(t[f]);
			if (pa(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? ba(t[l]) : ya(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) O(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? ba(t[l]) : ya(t[l]);
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
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && pa(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? O(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let ee = b ? Zi(S) : ne;
			for (_ = ee.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || ea(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== ee[_] ? D(d, n, p, 2) : _--);
			}
		}
	}, D = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) D(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ve);
		else if (c === R) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) D(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === aa) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[yr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Wi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[yr];
					s._isLeaving && s[yr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, O = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (_t(), Lr(s, null, n, e, !0), vt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !zr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ca(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && lr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && he(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Wi(() => {
			_ && Ca(_, t, e), h && lr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === R;
		if (o && !a) {
			k(n, r);
			return;
		}
		if (t === aa) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Nr(e) : e, c = () => {
			o ? d(n) && k(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, k = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		$i(c), $i(l), r && ke(r), i.stop(), a ? (a.flags |= 8, O(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, O(o, e, t, n)), s && Wi(s, t), Wi(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) O(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[_r];
		return n ? f(n) : t;
	}, _e = (e, t, n) => {
		nr(() => {
			e == null ? t._vnode && O(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Ea());
	}, ve = {
		p: h,
		um: O,
		m: D,
		r: pe,
		mt: ce,
		mc: te,
		pc: ue,
		pbc: ie,
		n: ge,
		o: e
	}, ye, xe;
	return t && ([ye, xe] = t(ve)), {
		render: _e,
		hydrate: ye,
		createApp: fi(_e, ye)
	};
}
function qi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ji({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Yi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Xi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (E(r) && E(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ba(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Xi(t, a)), a.type === ra && (a.patchFlag === -1 && (a = i[e] = ba(a)), a.el = t.el), a.type === ia && !a.el && (a.el = t.el);
	}
}
function Zi(e) {
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
function Qi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Qi(t);
}
function $i(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ea(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? ea(t.subTree) : null;
}
var ta = (e) => e.__isSuspense;
function na(e, t) {
	t && t.pendingBranch ? E(e) ? t.effects.push(...e) : t.effects.push(e) : Qn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), ra = /* @__PURE__ */ Symbol.for("v-txt"), ia = /* @__PURE__ */ Symbol.for("v-cmt"), aa = /* @__PURE__ */ Symbol.for("v-stc"), oa = [], sa = null;
function z(e = !1) {
	oa.push(sa = e ? null : []);
}
function ca() {
	oa.pop(), sa = oa[oa.length - 1] || null;
}
var la = 1;
function ua(e, t = !1) {
	la += e, e < 0 && sa && t && (sa.hasOnce = !0);
}
function da(e) {
	return e.dynamicChildren = la > 0 ? sa || ne : null, ca(), la > 0 && sa && sa.push(e), e;
}
function B(e, t, n, r, i, a) {
	return da(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return da(U(e, t, n, r, i, !0));
}
function fa(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function pa(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ma = ({ key: e }) => e ?? null, ha = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : O(e) || /* @__PURE__ */ Sn(e) || D(e) ? {
	i: ar,
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
		key: t && ma(t),
		ref: t && ha(t),
		scopeId: or,
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
		ctx: ar
	};
	return s ? (xa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), la > 0 && !o && sa && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && sa.push(c), c;
}
var U = ga;
function ga(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Zr) && (e = ia), fa(e)) {
		let r = va(e, t, !0);
		return n && xa(r, n), la > 0 && !a && sa && (r.shapeFlag & 6 ? sa[sa.indexOf(e)] = r : sa.push(r)), r.patchFlag = -2, r;
	}
	if (Wa(e) && (e = e.__vccOpts), t) {
		t = _a(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = A(e)), k(n) && (/* @__PURE__ */ vn(n) && !E(n) && (n = oe({}, n)), t.style = Fe(n));
	}
	let o = O(e) ? 1 : ta(e) ? 128 : vr(e) ? 64 : k(e) ? 4 : D(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function _a(e) {
	return e ? /* @__PURE__ */ vn(e) || ki(e) ? oe({}, e) : e : null;
}
function va(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Sa(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ma(l),
		ref: t && t.ref ? n && a ? E(a) ? a.concat(ha(t)) : [a, ha(t)] : ha(t) : a,
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
		ssContent: e.ssContent && va(e.ssContent),
		ssFallback: e.ssFallback && va(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && jr(u, c.clone(u)), u;
}
function W(e = " ", t = 0) {
	return U(ra, null, e, t);
}
function G(e = "", t = !1) {
	return t ? (z(), V(ia, null, e)) : U(ia, null, e);
}
function ya(e) {
	return e == null || typeof e == "boolean" ? U(ia) : E(e) ? U(R, null, e.slice()) : fa(e) ? ba(e) : U(ra, null, String(e));
}
function ba(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : va(e);
}
function xa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (E(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), xa(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ki(t) ? t._ctx = ar : r === 3 && ar && (ar.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (D(t)) {
		if (r & 65) {
			xa(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: ar
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [W(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Sa(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = Fe([t.style, r.style]);
		else if (ie(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(E(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !ae(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ca(e, t, n, r = null) {
	Rn(e, t, 7, [n, r]);
}
var wa = ui(), Ta = 0;
function Ea() {
	return Ta;
}
function Da(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || wa, a = {
		uid: Ta++,
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
		scope: new Qe(!0),
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
		propsOptions: Pi(r, i),
		emitsOptions: _i(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = gi.bind(null, a), e.ce && e.ce(a), a;
}
var Oa = null, ka = () => Oa || ar, Aa, ja;
{
	let e = Pe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Aa = t("__VUE_INSTANCE_SETTERS__", (e) => Oa = e), ja = t("__VUE_SSR_SETTERS__", (e) => Fa = e);
}
var Ma = (e) => {
	let t = Oa;
	return Aa(e), e.scope.on(), () => {
		e.scope.off(), Aa(t);
	};
}, Na = () => {
	Oa && Oa.scope.off(), Aa(null);
};
function Pa(e) {
	return e.vnode.shapeFlag & 4;
}
var Fa = !1;
function Ia(e, t = !1, n = !1) {
	t && ja(t);
	let { props: r, children: i } = e.vnode, a = Pa(e);
	Ai(e, r, a, t), Hi(e, i, n || t);
	let o = a ? La(e, t) : void 0;
	return t && ja(!1), o;
}
function La(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, si);
	let { setup: r } = n;
	if (r) {
		_t();
		let n = e.setupContext = r.length > 1 ? Va(e) : null, i = Ma(e), a = Ln(r, e, 0, [e.props, n]), o = me(a);
		if (vt(), i(), (o || e.sp) && !zr(e) && Pr(e), o) {
			if (a.then(Na, Na), t) return a.then((n) => {
				ja(!0);
				try {
					Ra(e, n, t);
				} finally {
					ja(!1);
				}
			}).catch((t) => {
				zn(t, e, 0);
			});
			e.asyncDep = a;
		} else Ra(e, a, t);
	} else za(e, t);
}
function Ra(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = En(t)), za(e, n);
}
function za(e, t, n) {
	let r = e.type;
	e.render ||= r.render || re;
}
var Ba = { get(e, t) {
	return Ot(e, "get", ""), e[t];
} };
function Va(e) {
	return {
		attrs: new Proxy(e.attrs, Ba),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ha(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(En(yn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ai) return ai[n](e);
		},
		has(e, t) {
			return t in e || t in ai;
		}
	}) : e.proxy;
}
function Ua(e, t = !0) {
	return D(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Wa(e) {
	return D(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ An(e, t, Fa);
function Ga(e, t, n) {
	try {
		ua(-1);
		let r = arguments.length;
		return r === 2 ? k(t) && !E(t) ? fa(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && fa(n) && (n = [n]), U(e, t, n));
	} finally {
		ua(1);
	}
}
var Ka = "3.5.44", qa = void 0, Ja = typeof window < "u" && window.trustedTypes;
if (Ja) try {
	qa = /* @__PURE__ */ Ja.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ya = qa ? (e) => qa.createHTML(e) : (e) => e, Xa = "http://www.w3.org/2000/svg", Za = "http://www.w3.org/1998/Math/MathML", Qa = typeof document < "u" ? document : null, $a = Qa && /* @__PURE__ */ Qa.createElement("template"), eo = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Qa.createElementNS(Xa, e) : t === "mathml" ? Qa.createElementNS(Za, e) : n ? Qa.createElement(e, { is: n }) : Qa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Qa.createTextNode(e),
	createComment: (e) => Qa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Qa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			$a.innerHTML = Ya(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = $a.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, to = "transition", no = "animation", ro = /* @__PURE__ */ Symbol("_vtc"), io = {
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
}, ao = /* @__PURE__ */ oe({}, Cr, io), oo = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = ao, e))((e, { slots: t }) => Ga(Er, lo(e), t)), so = (e, t = []) => {
	E(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, co = (e) => e ? E(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function lo(e) {
	let t = {};
	for (let n in e) n in io || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = uo(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: te = y } = t, C = (e, t, n, r) => {
		e._enterCancelled = r, mo(e, t ? u : s), mo(e, t ? l : o), n && n();
	}, ne = (e, t) => {
		e._isLeaving = !1, mo(e, d), mo(e, p), mo(e, f), t && t();
	}, re = (e) => (t, n) => {
		let i = e ? ee : v, o = () => C(t, e, n);
		so(i, [t, o]), ho(() => {
			mo(t, e ? c : a), po(t, e ? u : s), co(i) || _o(t, r, h, o);
		});
	};
	return oe(t, {
		onBeforeEnter(e) {
			so(_, [e]), po(e, a), po(e, o);
		},
		onBeforeAppear(e) {
			so(S, [e]), po(e, c), po(e, l);
		},
		onEnter: re(!1),
		onAppear: re(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => ne(e, t);
			po(e, d), e._enterCancelled ? (po(e, f), xo(e)) : (xo(e), po(e, f)), ho(() => {
				e._isLeaving && (mo(e, d), po(e, p), co(b) || _o(e, r, g, n));
			}), so(b, [e, n]);
		},
		onEnterCancelled(e) {
			C(e, !1, void 0, !0), so(y, [e]);
		},
		onAppearCancelled(e) {
			C(e, !0, void 0, !0), so(te, [e]);
		},
		onLeaveCancelled(e) {
			ne(e), so(x, [e]);
		}
	});
}
function uo(e) {
	if (e == null) return null;
	if (k(e)) return [fo(e.enter), fo(e.leave)];
	{
		let t = fo(e);
		return [t, t];
	}
}
function fo(e) {
	return Me(e);
}
function po(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[ro] || (e[ro] = /* @__PURE__ */ new Set())).add(t);
}
function mo(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[ro];
	n && (n.delete(t), n.size || (e[ro] = void 0));
}
function ho(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var go = 0;
function _o(e, t, n, r) {
	let i = e._endId = ++go, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = vo(e, t);
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
function vo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${to}Delay`), a = r(`${to}Duration`), o = yo(i, a), s = r(`${no}Delay`), c = r(`${no}Duration`), l = yo(s, c), u = null, d = 0, f = 0;
	t === to ? o > 0 && (u = to, d = o, f = a.length) : t === no ? l > 0 && (u = no, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? to : no : null, f = u ? u === to ? a.length : c.length : 0);
	let p = u === to && /\b(?:transform|all)(?:,|$)/.test(r(`${to}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function yo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => bo(t) + bo(e[n])));
}
function bo(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function xo(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function So(e, t, n) {
	let r = e[ro];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Co = /* @__PURE__ */ Symbol("_vod"), wo = /* @__PURE__ */ Symbol("_vsh"), To = /* @__PURE__ */ Symbol(""), Eo = /(?:^|;)\s*display\s*:/;
function Do(e, t, n) {
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) {
			if (O(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ko(r, t, "");
			}
			else for (let e in t) n[e] ?? ko(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ko(r, i, "") : No(e, i, !O(t) && t ? t[i] : void 0, o) || ko(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[To];
			e && (n += ";" + e), r.cssText = n, a = Eo.test(n);
		}
	} else t && e.removeAttribute("style");
	Co in e && ((!i || t !== n) && (e[Co] = a ? r.display : ""), e[wo] && (r.display = "none"));
}
var Oo = /\s*!important$/;
function ko(e, t, n) {
	if (E(n)) n.forEach((n) => ko(e, t, n));
	else if (n ??= "", t.startsWith("--")) Oo.test(n) ? e.setProperty(t, n.replace(Oo, ""), "important") : e.setProperty(t, n);
	else {
		let r = Mo(e, t);
		Oo.test(n) ? e.setProperty(Te(r), n.replace(Oo, ""), "important") : e[r] = n;
	}
}
var Ao = [
	"Webkit",
	"Moz",
	"ms"
], jo = {};
function Mo(e, t) {
	let n = jo[t];
	if (n) return n;
	let r = Ce(t);
	if (r !== "filter" && r in e) return jo[t] = r;
	r = Ee(r);
	for (let n = 0; n < Ao.length; n++) {
		let i = Ao[n] + r;
		if (i in e) return jo[t] = i;
	}
	return t;
}
function No(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var Po = "http://www.w3.org/1999/xlink";
function Fo(e, t, n, r, i, a = Be(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Po, t.slice(6, t.length)) : e.setAttributeNS(Po, t, n) : n == null || a && !Ve(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : pe(n) ? String(n) : n);
}
function Io(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ya(n) : n);
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
		r === "boolean" ? n = Ve(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Lo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ro(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var zo = /* @__PURE__ */ Symbol("_vei");
function Bo(e, t, n, r, i = null) {
	let a = e[zo] || (e[zo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Uo(t);
		r ? Lo(e, n, a[t] = qo(r, i), s) : o && (Ro(e, n, o, s), a[t] = void 0);
	}
}
var Vo = /(Once|Passive|Capture)$/, Ho = /^on:?(?:Once|Passive|Capture)$/;
function Uo(e) {
	let t, n;
	for (; (n = e.match(Vo)) && !Ho.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : Te(e.slice(2)), t];
}
var Wo = 0, Go = /* @__PURE__ */ Promise.resolve(), Ko = () => Wo ||= (Go.then(() => Wo = 0), Date.now());
function qo(e, t) {
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
				e && Rn(e, t, 5, a);
			}
		} else Rn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ko(), n;
}
var Jo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Yo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? So(e, r, o) : t === "style" ? Do(e, n, r) : ie(t) ? ae(t) || Bo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Xo(e, t, r, o)) ? (Io(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Fo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Zo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? Io(e, Ce(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Fo(e, t, r, o));
};
function Xo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Jo(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Jo(t) && O(n) ? !1 : t in e;
}
function Zo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = Ce(t);
	return Array.isArray(n) ? n.some((e) => Ce(e) === r) : Object.keys(n).some((e) => Ce(e) === r);
}
var Qo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return E(t) ? (e) => ke(t, e) : t;
};
function $o(e) {
	e.target.composing = !0;
}
function es(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ts = /* @__PURE__ */ Symbol("_assign"), ns = /* @__PURE__ */ Symbol("_initialValue");
function rs(e, t, n) {
	return t && (e = e.trim()), n && (e = je(e)), e;
}
var is = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[ns] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[ns] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ts] = Qo(i);
		let a = r || i.props && i.props.type === "number";
		Lo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ts](rs(e.value, n, a));
		}), (n || a) && Lo(e, "change", () => {
			e.value = rs(e.value, n, a);
		}), t || (Lo(e, "compositionstart", $o), Lo(e, "compositionend", es), Lo(e, "change", es));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[ns];
		delete e[ns], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ts](rs(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ts] = Qo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? je(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, as = {
	deep: !0,
	created(e, t, n) {
		e[ts] = Qo(n), Lo(e, "change", () => {
			let t = e._modelValue, n = us(e), r = e.checked, i = e[ts];
			if (E(t)) {
				let e = qe(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ue(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(ds(e, r));
		});
	},
	mounted: os,
	beforeUpdate(e, t, n) {
		e[ts] = Qo(n), os(e, t, n);
	}
};
function os(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (E(t)) i = qe(t, r.props.value) > -1;
	else if (ue(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ke(t, ds(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var ss = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Lo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? je(us(e)) : us(e)), r = e.multiple, i = r ? ue(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? E(i) ? t.slice() : t : i];
			try {
				e[ts](i);
			} finally {
				Jn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[ts] = Qo(r);
	},
	mounted(e, { value: t }) {
		ls(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ts] = Qo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !cs(t, n[1], n[0])) && ls(e, t);
	}
};
function cs(e, t, n) {
	if (!n || E(e)) return Ke(e, t);
	if (ue(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ls(e, t) {
	let n = e.multiple, r = E(t);
	if (!n || r || ue(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = us(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : qe(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Ke(us(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function us(e) {
	return "_value" in e ? e._value : e.value;
}
function ds(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var fs = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ps = {
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
	exact: (e, t) => fs.some((n) => e[`${n}Key`] && !t.includes(n))
}, ms = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ps[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, hs = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, gs = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = Te(n.key);
		if (t.some((e) => e === r || hs[e] === r)) return e(n);
	}));
}, _s = /* @__PURE__ */ oe({ patchProp: Yo }, eo), vs;
function ys() {
	return vs ||= Gi(_s);
}
var bs = ((...e) => {
	let t = ys().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ss(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, xs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function xs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ss(e) {
	return O(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var Cs = () => ({
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
}), ws = null;
function q() {
	if (ws) return ws;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = Cs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return ws = /* @__PURE__ */ dn(n), ws;
}
var J = () => e().saveSettingsDebounced(), Ts = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], Es = [
	"auto",
	"on",
	"off"
], Ds = [
	"off",
	"vertex",
	"aistudio"
], Os = ["annotations", "speech"], ks = (e) => Os.includes(e.kind), As = [
	"keep",
	"truncate",
	"remove"
], js = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Ms = [
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
function Ns(e) {
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
			if (i >= e.length) throw new js("Unterminated string", e, n);
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
		let i = Ms.find((t) => e.startsWith(t, n));
		if (!i) throw new js(`Unexpected character '${r}'`, e, n);
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
var Ps = {
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
function Fs(e) {
	let t = Ns(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new js(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Ps ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new js(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new js("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Ps[n];
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
	if (u.k !== "end") throw new js("Unexpected token", e, u.pos);
	return l;
}
function Is(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function Ls(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function Rs(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => Rs(e, t));
		case "var": return t(e.path);
		case "not": return !Ls(Rs(e.e, t));
		case "bin": {
			if (e.op === "&&") return Ls(Rs(e.l, t)) && Ls(Rs(e.r, t));
			if (e.op === "||") return Ls(Rs(e.l, t)) || Ls(Rs(e.r, t));
			let n = Rs(e.l, t), r = Rs(e.r, t);
			switch (e.op) {
				case "==": return Is(n, r);
				case "!=": return !Is(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Is(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function zs(e, t) {
	return !e || Ls(Rs(e, t));
}
function Bs(...e) {
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
var Vs = /\{\{ap::([^{}]*?)\}\}/g;
function Hs(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Vs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Hs(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Us(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ws(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function Gs(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Ws(n[3] ?? n[4] ?? "");
	return t;
}
function Ks(e, t) {
	let n = [], r = RegExp(`<${Us(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: Gs(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: Gs(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function qs(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Js(e, t) {
	let n = Ks(e, t)[0];
	return n ? Ws(n.inner).trim() : void 0;
}
function Ys(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Xs(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
var Zs = "{==", Qs = "==}", $s = "{>>", ec = "<<}", tc = /\n[ \t]*\n/g;
function nc(e, t) {
	tc.lastIndex = t;
	let n = tc.exec(e);
	return n ? n.index : Infinity;
}
function rc(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function ic(e, t, n, r) {
	let i = nc(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function ac(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(Zs, o)) {
		let t = o + 3, s = ic(e, t, Qs, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - rc(n, [Qs]));
			break;
		}
		if (s < 0) {
			let n = Math.min(nc(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || $s.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith($s, l)) {
			let t = l + 3, s = ic(e, t, ec, n);
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
	} else if (e.startsWith($s, o)) {
		let t = o + 3, i = ic(e, t, ec, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += $s, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (Zs.startsWith(t) || $s.startsWith(t))) break scan;
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
function oc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function sc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function cc(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = oc(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + sc(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function lc(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = cc(e, t);
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
function uc(e, t) {
	let n = lc(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${Zs}${t.quote}${Qs}${$s}${t.comment}${ec}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/media.ts
var dc = {
	on: !1,
	auto: !1,
	api: "",
	style: !1,
	sfw: !1,
	refs: !1
}, fc = {
	on: !1,
	auto: !1,
	api: "",
	narrator: !1,
	characters: !1
}, pc = (e) => (e ?? []).map((e) => `- ${e.id}: ${e.description}`.trimEnd()).join("\n"), mc = [
	"1:1",
	"3:4",
	"4:3",
	"9:16",
	"16:9"
], hc = [
	"prompt",
	"refs",
	"ratio",
	"caption"
], gc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function _c(e) {
	let t = Array.isArray(e) ? e.map(gc) : typeof e == "string" ? e.split(/[,，、\n]/) : [];
	return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function vc(e) {
	let t = gc(e).trim().replace(/[：xX×/]/g, ":").replace(/\s+/g, "");
	return mc.includes(t) ? t : void 0;
}
function yc(e) {
	let t = gc(e.prompt ?? e.description ?? e.text).trim();
	if (!t) return;
	let n = { prompt: t }, r = _c(e.refs ?? e.references);
	r.length && (n.refs = r);
	let i = vc(e.ratio ?? e.aspect_ratio ?? e.aspectRatio);
	i && (n.ratio = i);
	let a = gc(e.caption ?? e.title).trim();
	return a && (n.caption = a), n;
}
function bc(e, t) {
	if (typeof e == "string") {
		let t = e.trim();
		if (t.startsWith("[") || t.startsWith("{")) try {
			e = JSON.parse(t);
		} catch {}
		typeof e == "string" && (e = t ? [{ prompt: t }] : []);
	}
	e && typeof e == "object" && !Array.isArray(e) && Array.isArray(e.images) && (e = e.images);
	let n = (Array.isArray(e) ? e : e && typeof e == "object" ? [e] : []).map((e) => yc(e && typeof e == "object" ? e : { prompt: e })).filter((e) => !!e), r = t && t > 0 ? n.slice(0, t) : n;
	return r.length ? { images: r } : void 0;
}
var xc = "speech", Sc = "character", Cc = (e) => e.text ?? e.quote, wc = /<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>|\[[^\[\]\n]{1,40}\]/g;
function Tc(e, t = wc) {
	if (typeof t == "function") return t(e);
	let n = t.global ? t : new RegExp(t.source, `${t.flags}g`);
	n.lastIndex = 0;
	let r = e.replace(n, "");
	if (r === e) return e;
	let i = r.replace(/([ \t])[ \t]+/g, "$1");
	return /^\s/.test(e) || (i = i.replace(/^\s+/, "")), /\s$/.test(e) || (i = i.replace(/\s+$/, "")), i;
}
function Ec(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function Dc(e) {
	let t = e.lastIndexOf("<"), n = e.lastIndexOf("["), r = e.length;
	return t >= 0 && !e.includes(">", t) && (r = Math.min(r, t)), n >= 0 && !e.includes("]", n) && e.length - n <= 41 && (r = Math.min(r, n)), e.slice(0, r);
}
function Oc(e, t = {}) {
	let n = t.tag || "speech", r = t.final ?? !0, i = t.cleaner ?? wc, a = [], o = RegExp(`<${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s[^<>]*)?>`, "g"), s = `</${n}>`, c = `<${n}`, l = [], u = [], d = [], f = "", p = 0, m = (t, n) => {
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
				t -= Ec(e.slice(p), [c, s]);
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
		let h = t[1] ?? "", g = Ws(/\bcharacter\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(h)?.slice(1).find((e) => e !== void 0) ?? "").trim(), _ = t.index + t[0].length, v = e.indexOf(s, _);
		o.lastIndex = _;
		let y = o.exec(e);
		if (v < 0) {
			let t = e.slice(_);
			if (!r) {
				let e = Tc(Dc(t.slice(0, t.length - Ec(t, [s]))), i);
				f += e;
				break;
			}
			a.push(`speech: unterminated <${n}> dropped`), p = _;
			continue;
		}
		let b = e.slice(_, v);
		y && y.index < v && (a.push(`speech: nested <${n}> dropped`), b = b.replace(new RegExp(o.source, "g"), ""));
		let x = Tc(b, i), S = f.length;
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
function kc(e, t) {
	let n = !1;
	return {
		spans: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = cc(e, t);
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
var Ac = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function jc(e, t, n = xc) {
	let r = kc(e, t).spans.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), i = "", a = 0;
	for (let t of r) t.start < a || (i += `${e.slice(a, t.start)}<${n} ${Sc}="${Ac(t.character)}">${Cc(t)}</${n}>`, a = t.end);
	return i + e.slice(a);
}
function Mc(e, t, n, r) {
	return t.map((t) => {
		let i = n.map(t.start);
		for (let n of r) {
			let r = n(t.quote), a = r ? cc(e, {
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
function Nc(e, t, n = {}) {
	let r = Oc(e, n);
	if (!t?.length) return {
		text: r.text,
		spans: r.spans,
		anchors: t,
		warnings: r.warnings
	};
	let i = (e) => Oc(e, n).text;
	return {
		text: r.text,
		spans: r.spans,
		anchors: Mc(r.text, t, r, [i, (e) => Tc(i(e), n.cleaner)]),
		warnings: r.warnings
	};
}
//#endregion
//#region packages/protocol/src/structures.ts
var Pc = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Fc = {
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
}, Ic = ["name", "previous_main"], Lc = {
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
}, Rc = {
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
	status: Pc,
	storyline: Ic,
	custom: [],
	annotations: [],
	image: hc,
	speech: []
};
function zc(e, t = (e) => e) {
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
			properties: Object.fromEntries(Pc.map((e) => [e, i(e)])),
			required: [...Pc],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? Ic).filter((e) => Ic.includes(e));
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
			let t = hc.filter((t) => !e.requested || e.requested.includes(t)), n = {
				prompt: { type: "string" },
				refs: {
					type: "array",
					items: { type: "string" }
				},
				ratio: {
					type: "string",
					enum: [...mc]
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
function Bc(e) {
	return e === "memory" || e === "recap";
}
function Vc(e) {
	let t = {};
	for (let n of Pc) t[n] = Wc(Fc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Hc(e) {
	let t = {};
	for (let n of Ic) t[n] = Wc(Lc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Uc(e) {
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
var Wc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Gc(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations":
		case "speech": return;
		case "image": return bc(t, n?.count ?? 1);
		case "reply":
		case "impersonate": return Wc(t).trim() || void 0;
		case "recap": return t === null ? null : Wc(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Wc(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Wc(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Wc(e.time),
				location: Wc(e.location),
				event: Wc(e.event),
				summary: Wc(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Vc((e) => t[e]);
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
			let e = Hc((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Wc(e.label ?? e.title).trim(),
			content: Wc(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Wc(t)]));
			}
			return Wc(t).trim() || void 0;
	}
}
function Kc(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations":
		case "speech": return;
		case "image": return bc(t.filter((e) => !e.open).map((e) => /<[A-Za-z_]/.test(e.inner) ? {
			prompt: Js(e.inner, "prompt"),
			refs: Js(e.inner, "refs"),
			ratio: Js(e.inner, "ratio"),
			caption: Js(e.inner, "caption")
		} : Ws(e.inner).trim()), e.count ?? 1);
		case "reply":
		case "impersonate": return Gc(e.kind, Ws(n.inner));
		case "recap": return Gc("recap", Ws(n.inner));
		case "memory": return Gc("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Js(e.inner, "scope"),
			operation: Js(e.inner, "operation"),
			key: Js(e.inner, "key"),
			content: Js(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Js(n.inner, "time") ?? "",
			location: Js(n.inner, "location") ?? "",
			event: Js(n.inner, "event") ?? "",
			summary: Js(n.inner, "summary") ?? ""
		};
		case "status": return Vc((e) => Js(n.inner, e));
		case "storyline": {
			let e = Hc((e) => Js(n.inner, e));
			return !e.name && !e.previous_main && !/<[A-Za-z_]/.test(n.inner) && (e.name = Ws(n.inner).trim()), e.name || e.previous_main ? e : void 0;
		}
		case "options": return Ks(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Ws(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Ws(t[2]).trim();
				return e;
			}
			return Gc("custom", Ws(n.inner), e);
	}
}
function qc(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (ks(a)) continue;
		let t = Ks(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Kc(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: qs(e, i),
		values: n,
		open: r
	};
}
function Jc(e) {
	return Ws(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var Yc = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function Xc(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function Zc(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function Qc(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function $c(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return Yc(e, { n: String(t).padStart(i, "0") }) + r;
}
function el(e, t, n, r, i) {
	let a = n.filter((e) => !ks(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: Xc(e, t)
		},
		rank: 0,
		index: n
	})), s = Qc(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = Zc(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? $c(u, t + 1, d, n) : n;
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
			return u && n && g(e).length ? $c(u, n.position, d, t) : t;
		}
	};
}
function tl(e, t) {
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
var nl = {
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
}, rl = (e) => e;
function il(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function al(e, t) {
	return e.stages.filter((e) => zs(e.when, t));
}
function ol(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function sl(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function cl(e, t, n = nl) {
	return il(t.field?.name ?? n.turn.field, sl(e, t));
}
function ll(e, t, n = nl) {
	return il(t.tool?.name ?? n.stage.name, sl(e, t));
}
function ul(e, t = nl) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var dl = (e, t) => t ? {
	...e,
	description: t
} : e;
function fl(e = nl, t = rl, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return dl({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: dl({ type: "string" }, i(r.old)),
				new_string: dl({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function pl(e, t, n = nl, r = rl) {
	return e.kind === "patch" ? fl(n, r, t) : dl({ type: "string" }, t);
}
function ml(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function hl(e, t, n, r, i = rl) {
	let a = r.filter((e) => !ks(e)), o = (e, t) => {
		if (e) return i(t ? il(e, sl(n, t)) : e).trim() || void 0;
	}, s = el(t, n, a, e, (t) => cl(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => ll(n, t, e), d = (t) => s.stageParam(t, ul(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = zc(tl(n, r), i), Bc(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = pl(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = ul(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = pl(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), ml(u(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => ml(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: dl({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: dl(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function gl(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function _l(e) {
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
function vl(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = _l(e);
		return t ? [t] : [];
	});
}
function yl(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function bl(e) {
	let t = vl(e);
	return t.length ? yl(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function xl(e) {
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
function Sl(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Ys(t.content)).trimEnd());
}
function Cl(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function wl(e) {
	return e.map((e) => ({
		old_string: Js(e, "old_string") ?? "",
		new_string: Js(e, "new_string") ?? ""
	}));
}
function Tl(e, t) {
	let n = xl(t.stages), r = Xs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Us(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = qc(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Ks(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = wl(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Ws(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = qs(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = ol(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Us(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Sl(t.stages, n, t.final), Cl(t.stages, n, t.final), n;
}
function El(e, t) {
	let n = xl(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => cl(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Dl(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (ks(e)) continue;
		let r = c(e), i = Gc(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = ol(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Sl(t.stages, n, t.final), Cl(t.stages, n, t.final), n;
}
function Dl(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Ol(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function kl(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Ol(e, n);
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
	let i = n.trim().split(/\s+/).map(Us), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function Al(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = kl(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function jl(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Us(t), "gi"), a = [], o;
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
var Ml = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Nl = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Pl = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Fl(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Il[e]);
}
var Il = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Ll(e) {
	return e.split(Nl).filter((e) => e !== "");
}
var Rl = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function zl(e) {
	let t = Ll(Rl(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Pl.has(n)) throw new Ml(`Could not find matching close tag for "${e}".`, a);
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
var Bl = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, Vl = (e, t) => {
	throw new Ml(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Hl = /* @__PURE__ */ new Map(), Ul = 500;
function Wl(e) {
	let t = Hl.get(e);
	if (t) return t;
	let n = zl(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Ml(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Fl, Bl, Vl);
	return Hl.size >= Ul && Hl.clear(), Hl.set(e, i), i;
}
function Gl(e, t) {
	return Wl(e)(t);
}
function Kl(e) {
	try {
		return Wl(e), null;
	} catch (e) {
		return e instanceof Ml ? e : new Ml(String(e));
	}
}
function ql(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) ql(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var Jl = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, Yl = /^\s*(```|~~~)/;
function Xl(e) {
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
var Zl = /<!--[ \t]*#/g, Ql = /<!--|-->/g;
function $l(e, t, n) {
	Ql.lastIndex = t;
	for (let t = Ql.exec(e); t; t = Ql.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function eu(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(Jl)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(Jl, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...Xl(o),
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
			let t = $l(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? tu(e, t) : t;
		} else if (Yl.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		Zl.lastIndex = u;
		for (let t = Zl.exec(e); t; t = Zl.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = $l(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? tu(e, r) : r, Zl.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function tu(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var nu = [
	"system",
	"user",
	"assistant"
], ru = ["dialogue", "imperative"];
function iu(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Bs(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = Kl(e.text);
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
				nu.includes(n) || t(`@as expects one of ${nu.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: nu.includes(n) ? n : void 0,
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
				if (!n || !ru.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: Fs(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = Fs(e.raw);
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
function au(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = eu(e, [], 1, r), a = iu(i.tokens, r);
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
function ou(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => zs(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var su = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function cu(e) {
	let t = e.entries.flatMap((e) => su(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => su(e));
		t.push(...su(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...su(au(n.text, n.role).content));
	return t;
}
//#endregion
//#region packages/protocol/src/clone.ts
function Y(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => Y(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = Y(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function lu(e) {
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
function uu(e, t) {
	let n = lu(e), r = lu(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function du(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = lu(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = uu(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var fu = (e) => !!e && typeof e == "object" && !Array.isArray(e), pu = {
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
function mu(e) {
	let t = e.sendThoughtSignature;
	return t === !0 ? "vertex" : typeof t == "string" && Ds.includes(t) ? t : "off";
}
function hu(e, t) {
	let n = e.thoughtSignature;
	if (t !== "off" && n) return typeof n == "string" ? t === "vertex" ? n : void 0 : n[t] || void 0;
}
var gu = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function _u(e, ...t) {
	let n = Y(e);
	for (let e of t) n = vu(n, e);
	return n;
}
function vu(e, t) {
	if (t === void 0) return e;
	if (!fu(e) || !fu(t)) return Y(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = vu(e[r], i);
	return n;
}
function yu(e, t) {
	if (fu(e) && fu(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = yu(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : Y(e);
}
function bu(e, t, n = "", r = [], i = xu) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? fu(e[a]) && fu(t[a]) && (bu(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var xu = /* @__PURE__ */ new Set(["sampling"]);
function Su(e, t, n) {
	let r = Y(e);
	for (let e of t) if (du(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && fu(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Cu(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
function wu(e, t, n) {
	return _u(e.configurationDefaults, Cu(e, t)?.diff, n);
}
//#endregion
//#region packages/protocol/src/params.ts
function Tu(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function Eu(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function Du(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? Tu(n) : Array.isArray(e.default) ? Tu(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function Ou(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function ku(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, Du(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Au(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function ju(e, t, n) {
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
function Mu(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Au(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = ju(r[t.var], t, e));
	}
	return r;
}
var Nu = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Pu(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Nu.test(e);
}
function Fu(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Pu(e) ? e : JSON.stringify(e);
}
var Iu = (e) => !e.includes("\n") && Pu(e) ? e : JSON.stringify(e);
function Lu(e) {
	return e.map((e) => `- ${Fu(e, "  ")}`).join("\n");
}
function Ru(e) {
	return [...e].map(([e, t]) => `${Iu(e)}: ${Fu(t, "  ")}`).join("\n");
}
function zu(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Lu(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Ru(e) : t === "keys" ? Lu([...e.keys()]) : t === "values" ? Lu([...e.values()]) : e.get(t) ?? "";
}
function Bu(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var Vu = [
	"all",
	"if",
	"off"
], Hu = {
	enabled: !0,
	freezeVariables: "all"
}, Uu = (e) => Vu.includes(e?.freezeVariables) ? e.freezeVariables : Hu.freezeVariables, Wu = (e, t) => e === "all" ? !t.main : e === "if" && t.if, Gu = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1,
	frozen: !1
}, Ku = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u, qu = (e) => /^[^\s#!?@][^\s#]*$/u.test(e) && !/^if\?$/iu.test(e) && [...e].length <= 64;
function Ju(e) {
	let t = Ku.exec(e);
	if (!t) return null;
	let n = t[2], r = /^if\?$/iu.test(n), i = n === "" ? "recent" : n === "?" || r ? "new" : "name";
	if (i === "name" && !qu(n)) return null;
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
function Yu(e) {
	return Ju(e)?.text ?? e;
}
function Xu(e, t, n = !1) {
	let r = Yu(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function Zu(e, t, n) {
	return n ? `${e.slice(0, t.at)}#${t.switchMain ? "!" : t.hide ? "@" : ""}${n}` : t.text;
}
function Qu(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?@\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return qu(n) ? n : "";
}
function $u(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function ed(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var td = (e) => /^if/i.test(e);
function nd(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function rd(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function id(e, t) {
	return !!e.groups[t]?.allowNone;
}
function ad(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || id(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => zs(e.when, n)) : i;
}
function od(e, t) {
	let n = new Set(ad(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function sd(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = ed(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => {
		switch (e.kind) {
			case "storyline": return i.length ? [{
				...e,
				requested: i
			}] : [];
			case "image": return n?.image?.on ? [{
				...e,
				requested: hc.filter((e) => e !== "refs" || n.image.refs)
			}] : [];
			case "speech": return n?.speech?.on ? [e] : [];
			default: return [e];
		}
	});
}
function cd(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function ld(e, t, n, r) {
	return t && e.tools ? el(t, n, r, e.tools, (t) => cl(n, t, e.tools)) : void 0;
}
function ud(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? ld(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = Du(n, o.params[e]);
		if (Ou(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Hs(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return zu(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return cd(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${cd(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : gl(t, (e) => cd(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			case "storyline": return i === "main" ? c.storyline?.main ?? "" : c.storyline?.name ?? s.storyline?.name ?? "";
			case "image": return i === "refs" && s.image?.on ? pc(c.image?.refs) : "";
			case "speech": return s.speech?.on ? i === "format" ? c.speech?.format ?? "" : i === "characters" ? (c.speech?.characters ?? []).join(", ") : "" : "";
			default: return;
		}
	};
	return g;
}
function dd(e, t, n, r, i) {
	return ql({
		...Y(e),
		vars: Y(Bu(t)),
		sampling: Y(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function fd(e, t, n) {
	return (r) => {
		try {
			return Gl(r.text, e());
		} catch (e) {
			let i = e instanceof Ml ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function pd(e, t) {
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
function md(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? ld(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? ll(n, t, e.tools) : c?.stageField(t) ?? cl(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", cd(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function hd(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = rd(i), s = a ? al(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = rd(i), l = ad(n, r, c), u = sd(n, l, i), d = Mu(n.vars, l), f = ud({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Hs(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= dd(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !zs(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...ou(e.content, c, p, fd(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = md(n, a, s, i.style, i.transport, r, u);
		for (let n of ou(t, c, p, fd(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = pd(e, v.get(e.id) ?? []));
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
function gd(e, t, n = {}) {
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
		modules: od(e, t),
		params: ku(e, t),
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
		storyline: { ...Gu },
		image: { ...dc },
		speech: { ...fc },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var _d = /* @__PURE__ */ new Set([
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
]), vd = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), yd = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, bd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function xd(e, t = {}) {
	let n = (e) => xd(e, t);
	if (!bd(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && bd(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => vd.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(bd), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Sd({
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
		return Sd({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && _d.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			bd(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && yd[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = bd(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Sd({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Sd(i, a);
}
function Sd(e, t) {
	return t && (e.nullable = !0), e;
}
function Cd(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!bd(n)) return e;
		let r = bd(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: xd(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/tavern-helper.ts
var wd = "tavern_helper";
function Td(e) {
	return e.flatMap((e) => e.type === "folder" ? [e.id, ...e.scripts.map((e) => e.id)] : [e.id]);
}
//#endregion
//#region packages/protocol/src/preset-file.ts
var Ed = "1.10.0", Dd = "advanced_preset_file", Od = [
	"https://github.com/mirrorange/advanced-preset",
	"https://gitlab.com/mirrorange/advanced-preset",
	"https://codeberg.org/mirrorange/advanced-preset"
], kd = (e) => typeof e == "string" && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(e.trim()), Ad = "ap_install_notice", jd = "⟦ap:install-notice⟧", Md = "6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3", Nd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Pd(e) {
	let t = Nd(e) && Nd(e.extensions) ? e.extensions[Dd] : void 0;
	return Nd(t) && Nd(t.artifact) ? {
		format: t.format,
		artifact: t.artifact
	} : void 0;
}
function Fd(e) {
	return Pd(e)?.artifact ?? e;
}
function Id(e) {
	let t = e.minAdvancedPreset;
	return t && uu(t, "1.10.0") > 0 ? t : Ed;
}
var Ld = (e) => typeof e == "string" && e.includes("⟦ap:region:");
function Rd(e) {
	return `${jd}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${e.name}" ${e.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${Od.map((e) => `   - ${e}`).join("\n")}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}
function zd(e) {
	return {
		type: "script",
		enabled: !0,
		name: "Advanced Preset Installer",
		id: Md,
		content: Vd(e.name, Id(e)),
		info: `This preset ("${e.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${Od.join("\n")}\nIt does nothing once Advanced Preset ${Id(e)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${Id(e)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
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
function Bd(e, t = {}) {
	let n = e.carrier.prompts.map((e) => ({ ...e })), r = new Set(n.filter((e) => Ld(e.content)).map((e) => e.identifier));
	n.push({
		identifier: Ad,
		name: "Advanced Preset · install notice",
		role: "system",
		content: Rd(e),
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
		identifier: Ad,
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
			...t.installer === !1 ? {} : { [wd]: {
				scripts: [zd(e)],
				variables: {}
			} },
			[Dd]: a
		}
	};
}
function Vd(e, t) {
	let n = (e) => JSON.stringify(e).replace(/</g, "\\u003c");
	return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${t} or newer is running.
const PRESET = ${n(e)};
const REQUIRED = ${n(t)};
const MIRRORS = ${n(Od)};
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
var Hd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Ud(e) {
	let t = e.configurationDefaults?.connection;
	return !Hd(t) || Object.keys(pu).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...pu,
				...t
			}
		}
	};
}
function Wd(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!Hd(t) || "userInput" in t) && (!Hd(n) || "userInput" in n)) return e;
	let r = Hd(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: Hd(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: Hd(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function Gd(e) {
	let t = e.configurationDefaults;
	if (!Hd(t)) return e;
	let n = t.cache;
	return Hd(n) && Object.keys(gu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...gu,
				...Hd(n) ? n : {}
			}
		}
	};
}
function Kd(e) {
	let t = e.configurationDefaults;
	if (!Hd(t)) return e;
	let n = t.meta;
	return Hd(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...Hd(n) ? n : {}
			}
		}
	};
}
function qd(e) {
	let t = e.configurationDefaults;
	if (!Hd(e.storylines) || !Hd(t)) return e;
	let n = t.storylines;
	return Hd(n) && Object.keys(Hu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...Hu,
				...Hd(n) ? n : {}
			}
		}
	};
}
function Jd(e) {
	let t = qd(Kd(Gd(Wd(Ud(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function Yd(e) {
	let t = Fd(e);
	return !Hd(t) || typeof t.id != "string" || !Array.isArray(t.entries) ? null : t.formatVersion === 3 ? Jd(t) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var Xd = (e) => typeof e == "string" || e.enabled !== !1, Zd = (e) => typeof e == "string" ? e : e.text;
function Qd(e, t) {
	t ? delete e.enabled : e.enabled = !1;
}
function $d(e, t) {
	return t ? e : {
		text: e,
		enabled: !1
	};
}
var ef = "user-", tf = "advanced-preset.user-modules", nf = (e) => `${ef}${e}`;
function rf() {
	return {
		match: "all",
		rules: []
	};
}
var af = ["on", "off"];
function of(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? af.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function sf(e) {
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
function cf(e, t) {
	let n = sf(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var lf = (e) => ({
	t: "lit",
	v: e
});
function uf(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(lf)
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
			r: lf(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function df(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(of).map((e) => {
		if (e.kind === "keyword") return lf(cf(e, t));
		if (e.kind === "var") return uf(e);
		try {
			return Fs(e.source);
		} catch {
			return lf(!1);
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
function ff(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return Fs(e.source), null;
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
function pf(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function mf(e, t) {
	return t.entries.filter((t) => !pf(e, t.point));
}
function hf(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function gf(e, t) {
	return (t.vars ?? []).filter((t) => hf(e, t.var)?.type !== t.type);
}
function _f(e, t) {
	return [.../* @__PURE__ */ new Set([...mf(e, t).map((e) => e.point), ...gf(e, t).map((e) => e.var)])];
}
function vf(e) {
	if (!Xd(e)) return null;
	switch (e.type) {
		case "string": return e.text.trim() ? {
			var: e.var,
			type: "string",
			text: e.text
		} : null;
		case "list": {
			let t = e.items.filter(Xd).map(Zd).filter((e) => e.trim());
			return t.length ? {
				var: e.var,
				type: "list",
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => Xd(e) && e.key.trim()).map((e) => ({
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
function yf(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function bf(e, t, n) {
	let r = t.filter((e) => e.enabled).map((e) => ({
		...e,
		entries: e.entries.filter(Xd),
		vars: (e.vars ?? []).filter(Xd)
	})).filter((e) => e.entries.length || e.vars.length);
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = nf(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: df(t.trigger, n),
			structures: [],
			vars: t.vars.filter((t) => hf(e, t.var)?.type === t.type).map(vf).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = pf(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && yf(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: au(n.text, n.role).content
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
function xf(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => su(au(e.text, e.role).content)));
}
function Sf(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Cf(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function wf(e, t, n) {
	let r = t.filter((e) => du(n, e.from));
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
				path: Sf(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Cf(t.source, e)
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
var Tf = (e) => !!e && typeof e == "object" && !Array.isArray(e), Ef = (e, t = "") => typeof e == "string" ? e : t, Df = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Of = [
	"system",
	"user",
	"assistant"
], kf = [
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
function Af(e) {
	if (!Tf(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Ef(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && kf.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Df) : Df(e.value) && (t.value = e.value), t;
	}
	return null;
}
var jf = (e) => e.enabled === !1 ? { enabled: !1 } : {};
function Mf(e) {
	return typeof e == "string" ? [e] : Tf(e) && typeof e.text == "string" ? [e.enabled === !1 ? {
		text: e.text,
		enabled: !1
	} : e.text] : [];
}
function Nf(e) {
	if (!Tf(e) || typeof e.var != "string") return [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Ef(e.text),
		...jf(e)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: Array.isArray(e.items) ? e.items.flatMap(Mf) : [],
		...jf(e)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Tf).map((e) => ({
			key: Ef(e.key),
			value: typeof e.value == "string" ? e.value : null,
			...jf(e)
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t,
			...jf(e)
		}];
	}
	return [];
}
function Pf(e) {
	if (!Tf(e) || !Array.isArray(e.entries)) return null;
	let t = Tf(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Tf(e)) return [];
		let n = {
			id: Ef(e.id) || `e${t + 1}`,
			point: Ef(e.point),
			text: Ef(e.text)
		};
		return Of.includes(e.role) && (n.role = e.role), e.enabled === !1 && (n.enabled = !1), [n];
	});
	return {
		id: Ef(e.id),
		name: Ef(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Nf) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Af).filter((e) => !!e) : []
		}
	};
}
function Ff(e, t) {
	return {
		format: tf,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function If(e) {
	if (Tf(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Pf).filter((e) => !!e);
		return {
			preset: Tf(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Ef(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Pf(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function Lf(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function Rf(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function zf(e, t, n) {
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
function Bf(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...Y(e)
		})),
		vars: Y(e.vars ?? []),
		trigger: e.trigger ? Y(e.trigger) : rf()
	};
}
function Vf(e) {
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
		vars: Y(e.vars ?? []),
		trigger: Y(e.trigger)
	};
}
function Hf(e) {
	if (Array.isArray(e)) return e.map(Hf);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = Hf(e[n]));
		return t;
	}
	return e;
}
function Uf(e) {
	return JSON.stringify(Hf({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text,
			...e.enabled === !1 ? { enabled: !1 } : {}
		})),
		vars: (e.vars ?? []).flatMap(Nf),
		trigger: e.trigger ?? rf()
	}));
}
function Wf(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, Uf(e.locales[t])]);
	return JSON.stringify([
		Uf(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function Gf(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var Kf = "[{{time}} · {{location}}] {{event}}: {{summary}}", qf = (e) => e === "synopsis" ? Kf : "{{value}}", Jf = "{{content}}";
function Yf(e) {
	let t = e.indexOf(Jf);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(Jf, "");
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
function Xf(e) {
	let t = e.history;
	if (t === void 0 || ks(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: Yf(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? qf(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var Zf = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, Qf = (e) => e.kind === "speech" && typeof e.history == "number" ? e.history : 0, $f = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function ep(e) {
	let t = e?.stages ?? [], n = $f(t);
	return n >= 0 ? Xc(e, t[n]) : 0;
}
function tp(e, t, n) {
	let r = e?.stages ?? [], i = (t) => Xc(e, t), a = $f(r), o = ep(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = Zc(e, t);
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
var np = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function rp(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => np(e).trim() !== "");
}
function ip(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return ap(Kf, e, t, !1);
		case "status": return Uc(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : np(t);
		case "image": {
			let e = t?.images;
			return Array.isArray(e) ? e.map((e) => `- ${e?.caption ? `${e.caption}: ` : ""}${e?.prompt ?? ""}`).join("\n") : np(t);
		}
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${np(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function ap(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Rc[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? ip(t, n) : i && (a.has(o) || t === "custom" && o in i) ? np(i[o]) : a.has(o) ? "" : e);
}
var op = (e, t) => ap(e, "synopsis", t, !1);
function sp(e, t, n) {
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
var cp = [
	"executeOnStartup",
	"executeOnUser",
	"executeOnAi",
	"executeOnChatChange",
	"executeOnGroupMemberDraft",
	"executeOnNewChat",
	"executeBeforeGeneration"
], lp = [
	"label",
	"title",
	"message"
];
function up(e, t, n) {
	let r = (e) => Hs(e, (e) => e[0] === "name" && e.length === 2 ? t(e[1]) : void 0), i = e.qrList.map(({ id: e, ...t }, i) => {
		let a = n?.qrList?.[e], o = {
			...t,
			contextList: t.contextList.map((e) => ({ ...e })),
			id: i + 1
		};
		for (let e of lp) {
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
var dp = (e) => cp.some((t) => e[t]) || !!e.automationId;
function fp(e) {
	return (e.quickReplySets ?? []).flatMap((e) => e.qrList.filter(dp).map((t) => `${e.name} · ${t.label || t.id}: ${t.message}`));
}
//#endregion
//#region src/store/presets.ts
var pp = /* @__PURE__ */ dn(/* @__PURE__ */ new Map()), mp = /* @__PURE__ */ dn(/* @__PURE__ */ new Map());
async function hp() {
	try {
		let e = `${d()}dist/presets/`, t = await (await S(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = Yd(await (await S(e + n, { cache: "no-cache" })).json());
			t && pp.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var gp = (e) => Yd(e);
function _p() {
	return [.../* @__PURE__ */ new Set([
		...pp.keys(),
		...Object.keys(q().installed),
		...mp.keys()
	])].map((e) => vp(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function vp(e) {
	let t = mp.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = bp(e), r = pp.get(e);
	if (n && (!r || uu(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var yp = /* @__PURE__ */ new WeakMap();
function bp(e) {
	let t = q().installed[e];
	if (t) return yp.has(t) || yp.set(t, Yd(t)), yp.get(t) ?? void 0;
}
var xp = (e) => vp(e)?.preset;
function Sp(e) {
	q().installed[e.id] = e, J();
}
function Cp(e) {
	delete q().installed[e], J();
}
function wp(e, t) {
	e ? mp.set(e.id, e) : t ? mp.delete(t) : mp.clear();
}
var Tp = (e) => pp.has(e), Ep = (e) => pp.get(e), Dp = {
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
	"presetFile.adopted": "Set up from the imported preset “{file}”: now “{carrier}”."
}, Op = {
	en: Dp,
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
		"presetFile.adopted": "已根据导入的预设「{file}」完成设置，现为「{carrier}」。"
	}
};
function kp() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function X(e, t = {}) {
	return ((Op[kp()] ?? Op[kp().split("-")[0]])?.[e] ?? Dp[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function Ap(e) {
	return e.locales?.[kp()] ?? e.locales?.[kp().split("-")[0]];
}
function jp(e, t, n, r, i) {
	let a = Ap(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Mp(e) {
	let t = Ap(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function Np(e) {
	let t = Ap(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Pp(e, t, n) {
	return zf(t, kp(), Ap(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/core/storylines.ts
var Fp = "advanced_preset_storyline", Ip = "advanced_preset_storyline_switched", Lp = "?new", Rp = (e) => e.startsWith("?"), zp = (e) => {
	let t = e && !e.is_user ? e.extra?.[Fp] : void 0;
	return typeof t == "string" ? t : void 0;
};
function Bp(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = Ju(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : zp(e[o + 1]) ?? "?" : "";
		} else {
			let e = zp(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !Rp(s) && (i = s);
	}), n;
}
var Vp = (e, t) => e === "" || e === t.main ? "" : e;
function Hp(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? td(e);
}
function Up(e, t) {
	return e === "" ? !1 : t.hidden?.[e] ?? Hp(e, t);
}
var Wp = (e, t) => e === "" ? t.main ?? "" : Rp(e) ? "" : e;
function Gp(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !Up(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: Wp(e, n),
		main: e === "",
		if: Hp(e, n),
		hidden: Up(e, n)
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
var Kp = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function qp(e, t, n, r = !1, i = Kp, a = "off") {
	let o = {
		main: e === "",
		if: Hp(e, t)
	};
	return {
		name: i.naming ? "" : Wp(e, t),
		...o,
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching,
		frozen: Wu(a, o)
	};
}
function Jp(e, t, n) {
	let r = Bp(e, n).map((e) => Vp(e, n)), i = (e, i = n) => ({
		keys: r,
		meta: i,
		current: e,
		input: t,
		...Kp
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? Ju(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !Rp(r[n]) && (e = r[n]);
		if (c = Zu(a.mes, o, e), l = !e, s(e), !e) return {
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
		if (o.form === "new") return s(Lp), o.ifLine ? {
			...i(Lp, {
				...n,
				if: {
					...n.if ?? {},
					[Lp]: !0
				}
			}),
			naming: !0,
			ifLine: !0,
			...e
		} : {
			...i(Lp),
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
	if (o.form === "name" && Vp(o.name, n) === "") return s(""), {
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
var Yp = (e) => e.is_user ? Yu(e.mes) : e.mes, Xp = 983296, Zp = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, Qp = (e) => `⟦${String.fromCodePoint(Xp + Math.min(e, 255))}⟧`;
function $p(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(Zp, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function em(e, t, n, r) {
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
function tm(e, t, n, r, i = "off") {
	let { meta: a, current: o } = n, s = Bp(e, a).map((e) => Vp(e, a)), c = Gp(e.map((e, i) => {
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
		let n = e[t], r = Yp(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), d = {
		current: o,
		naming: l,
		input: n.input,
		view: Gp(n.keys, o, a).order,
		vars: qp(o, a, c.isNew, c.grouped, l, i),
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
var nm = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function rm(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = $p(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = $p(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var im = "advanced_preset";
function am(e) {
	let t = e?.extra?.[im];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function om(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: Y(n)
		}
	};
}
function sm(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[im] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[im] = Y(n));
}
function cm(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[Fp], !n.extra.advanced_preset) ? !1 : (delete n.extra[im], !0);
}
//#endregion
//#region src/store/eventlog.ts
function lm() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var um = (e) => `legacy-${e}`;
function dm(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = um(n), t = !0);
	}), t;
}
function fm(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? um(e.index) : void 0);
}
var pm = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), mm = "advanced_preset";
function hm() {
	return e().chatMetadata?.[mm]?.seedEvents ?? [];
}
function gm(t = Infinity, n) {
	let r = hm().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of am(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function _m(e = Infinity, t) {
	let n = {};
	for (let { event: r } of gm(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function vm(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of gm(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function ym(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = am(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[mm] && (e.extra[mm].events = Y(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[mm] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function bm(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function xm(e, t, n, r, i, a = lm()) {
	let o = e.globalMemory;
	dm(o.log);
	let s = bm(e)[n] ?? null;
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
var Sm = (e) => e.globalMemory.cursor > 0, Cm = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function wm(e) {
	Sm(e) && (e.globalMemory.cursor--, J());
}
function Tm(e) {
	Cm(e) && (e.globalMemory.cursor++, J());
}
function Em(e, t) {
	let n = e.globalMemory.log[pm(e, t)];
	n && (n.prev === null ? xm(e, "delete", n.key, void 0, "undo") : xm(e, "replace", n.key, n.prev, "undo"));
}
function Dm(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = lm();
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
function Om(e, t) {
	for (let n of t) pm(e, n.id) < 0 && xm(e, n.op, n.key, n.content, "model", n.id);
}
function km(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[pm(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function Am(e) {
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
	}, J()), dm(n.globalMemory.log) && J(), n;
}
function jm(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Cu(e, n.id)?.diff;
}
function Mm(e, t = Am(e).active.ref) {
	return _u(e.configurationDefaults, jm(e, Am(e), t));
}
function Nm(e) {
	let t = Am(e);
	return _u(Mm(e, t.active.ref), t.active.diff);
}
function Pm(e, t) {
	let n = Am(e);
	n.active.diff = yu(t, Mm(e, n.active.ref)) ?? {}, J();
}
function Fm(e, t) {
	let n = Nm(e);
	return t(n), Pm(e, n), n;
}
function Im(e, t) {
	let n = Am(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var Lm = (e) => Object.keys(Am(e).active.diff ?? {}).length > 0;
function Rm(e) {
	Am(e).active.diff = {}, J();
}
function zm(e, t) {
	let n = Am(e), r = Nm(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: yu(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function Bm(e, t) {
	let n = Am(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = yu(Nm(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function Vm(e, t, n) {
	let r = Am(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function Hm(e, t) {
	let n = Am(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function Um(e) {
	let t = Am(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = uu(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Su(t, e.migrations, n) : Y(t);
		i.push(...bu(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !Eu(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = wf(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && _f(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, J(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && x("warning", X("um.lostAfterUpdate", { names: s.join(", ") }), Mp(e)), i;
}
//#endregion
//#region src/store/tavern-helper.ts
var Wm = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Gm(e, t, n = []) {
	let r = Wm(t) ? t : {}, i = (e) => e.id !== Md, a = (Array.isArray(r.scripts) ? r.scripts : []).filter(Wm).filter(i).map((e) => Array.isArray(e.scripts) ? {
		...e,
		scripts: e.scripts.filter((e) => !Wm(e) || i(e))
	} : e), o = Y(e ?? []), s = Td(o), c = /* @__PURE__ */ new Set([...s, ...n]), l = (e) => typeof e.id != "string" || !c.has(e.id), u = /* @__PURE__ */ new Map();
	for (let e of a) {
		typeof e.id == "string" && u.set(e.id, e);
		for (let t of Array.isArray(e.scripts) ? e.scripts.filter(Wm) : []) typeof t.id == "string" && u.set(t.id, t);
	}
	let d = (e) => {
		let t = u.get(e.id);
		t && t.type === e.type && (typeof t.enabled == "boolean" && (e.enabled = t.enabled), e.data && Wm(t.data) && (e.data = {
			...e.data,
			...Y(t.data)
		}));
	};
	for (let e of o) {
		if (d(e), e.type !== "folder") continue;
		for (let t of e.scripts) d(t);
		let t = u.get(e.id), n = Wm(t) && Array.isArray(t.scripts) ? t.scripts.filter(Wm).filter(l) : [];
		e.scripts.push(...Y(n));
	}
	let f = [...o, ...Y(a.filter(l))], p = Wm(r.variables) ? Y(r.variables) : {}, m = Object.keys(r).some((e) => e !== "scripts" && e !== "variables");
	return !f.length && !Object.keys(p).length && !m ? { owned: s } : {
		data: {
			...Y(r),
			scripts: f,
			variables: p
		},
		owned: s
	};
}
function Km(e, t) {
	let n = (e) => JSON.stringify(Wm(e) && Array.isArray(e.scripts) ? e.scripts.map((e) => Wm(e) ? {
		...e,
		data: void 0,
		scripts: Array.isArray(e.scripts) ? e.scripts.map((e) => Wm(e) ? {
			...e,
			data: void 0
		} : e) : void 0
	} : e) : []);
	return n(e) !== n(t);
}
function qm(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of Wm(e) && Array.isArray(e.scripts) ? e.scripts.filter(Wm) : []) {
		n.set(String(t.id), t.content ?? null);
		for (let e of Array.isArray(t.scripts) ? t.scripts.filter(Wm) : []) n.set(String(e.id), e.content ?? null);
	}
	let r = JSON.stringify(t.map((e) => n.get(e) ?? null)), i = 2166136261;
	for (let e = 0; e < r.length; e++) i = Math.imul(i ^ r.charCodeAt(e), 16777619) >>> 0;
	return i.toString(16);
}
//#endregion
//#region src/store/carrier.ts
var Jm = "advanced_preset";
function Ym(e) {
	let t = e?.extensions?.[Jm];
	if (!t?.tavernHelperPrevious || !t.tavernHelperScripts) return !1;
	let n = qm(e.extensions[wd], t.tavernHelperScripts);
	return n === t.tavernHelperPrevious && n !== t.tavernHelperCode;
}
var Xm = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Zm = (e) => Xm[e] ?? e, Qm = () => e().getPresetManager("openai"), $m = (e) => `AP · ${e.name}`;
function eh() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function th(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function nh(e, t, n) {
	let r = e.carrier.prompt_order.map((e) => ({ ...e })), i = n?.extensions?.[Jm], a = Gm(e.tavernHelperScripts, n?.extensions?.[wd], i?.presetId === e.id ? i.tavernHelperScripts : void 0), o = {
		presetId: e.id,
		version: e.version,
		hash: e.hash
	};
	if (a.owned.length) {
		let t = qm(a.data, a.owned), n = i?.presetId === e.id ? i : void 0, r = n?.tavernHelperCode !== void 0 && n.tavernHelperCode !== t ? n.tavernHelperCode : n?.tavernHelperPrevious;
		Object.assign(o, {
			tavernHelperScripts: a.owned,
			tavernHelperCode: t
		}, r ? { tavernHelperPrevious: r } : {});
	}
	return {
		...Y(t.sampling),
		prompts: Y(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: Y(r)
		})),
		extensions: {
			[Jm]: o,
			...e.regexScripts?.length ? { regex_scripts: Y(e.regexScripts) } : {},
			...a.data ? { [wd]: a.data } : {}
		}
	};
}
function rh(e) {
	let t = Qm();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function ih(e, t, n) {
	let r = Qm();
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
async function ah(e, t = {}) {
	let n = Qm(), r = Am(e), i = rh(e.id), a = i ?? $m(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Jm], c = !o || t.force || s?.hash !== e.hash || Ym(o), l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && th(o) !== r.carrierHash && x("info", X("carrier.reset", { name: a }));
		let n = nh(e, Nm(e), o);
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = th(n), J(), await ih(a, n, !!t.select || l);
		let i = n.extensions[wd];
		l && Km(o?.extensions?.tavern_helper, i) && sh(a);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
var oh = !1;
function sh(e) {
	"TavernHelper" in globalThis && !oh && (oh = !0, y(`<p>${v(X("carrier.tavernHelper.reload", { name: e }))}</p>`, X("carrier.tavernHelper.reloadNow"), X("common.later")).then((e) => {
		oh = !1, e && location.reload();
	}));
}
async function ch(e) {
	await ah(e, { select: !0 });
}
async function lh(e) {
	let t = rh(e.id);
	if (!t) return;
	let n = Qm(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Nm(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...Y(i)
	}, o = n.getSelectedPresetName() === t;
	uh = !0;
	try {
		await ih(t, a, o);
	} finally {
		uh = !1;
	}
}
var uh = !1;
function dh(t) {
	if (uh || eh() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Nm(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Zm(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = Y(r));
	}
	return Object.keys(i).length ? (Fm(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var fh = null, ph = (e) => {
	fh = e;
}, mh = () => {
	let e = fh;
	return fh = null, e;
}, hh = (e) => e.meta?.enabled !== !1;
function gh(t, n) {
	if (!hh(n)) return "";
	let r = Hs(t.meta.trigger, (e) => e[0] === "name" ? cd(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function _h(e, t, n, r, i, a = [], o = !0) {
	let s = jl(n, gh(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = rd(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && zs(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && zs(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && zs(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? mh() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function vh(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var yh = 0, bh = () => `ap-${Date.now().toString(36)}-${(++yh).toString(36)}`, xh = /* @__PURE__ */ new Map(), Sh = null, Ch = null, wh = {
	setPending(e) {
		Sh = e;
	},
	takePending() {
		let e = Sh;
		return Sh = null, e;
	},
	peekPending: () => Sh,
	arm(e) {
		Ch = e, xh.set(e.id, e);
	},
	takeArmed() {
		let e = Ch;
		return Ch = null, e;
	},
	get: (e) => xh.get(e),
	release(e) {
		xh.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of xh) t - r.createdAt > e && xh.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function Th(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.speech ? "v" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function Eh(e, t) {
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
var Dh = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, Oh = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), kh = (e, t) => op(e, t), Ah = (e, t) => t ? Dh(e)?.structures?.[t] : void 0, jh = (e, t) => Dh(e)?.structures?.[t];
function Mh(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = Dh(e);
		if (a && Oh.has(a.turn)) {
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
		let n = jl(e.item.mes, t.trigger, t.wrap);
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
				} else Ah(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && Dh(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of a(t.speech?.depth ?? 0)) e.fresh.body === "full" && e.index !== t.continuing && Dh(e.item)?.speech?.length && (e.fresh.speech = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && rp(jh(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function Nh(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : Ah(r, n.synopsisId);
			return e ? kh(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? Dh(r)?.annotations : void 0, a = t.speech ? Dh(r)?.speech : void 0;
			return a?.length && (e = jc(e, a, n.speech?.tag)), i?.length && (e = uc(e, i)), t.echo?.length && n.echoes && (e = Ph(e, r, t.echo, n.echoes)), e;
		}
	}
}
function Ph(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = jh(t, e.id);
		rp(a) && e.pieces.forEach((t, n) => i.push({
			text: ap(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? sp(e, r.contentKey, i) : e;
}
function Fh(e, t) {
	let n = [];
	for (let r of Mh(e, t)) {
		let e = Nh(r, r.fresh, t);
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
function Ih(e, t) {
	return Fh(e, t).map((e) => e.item);
}
function Lh(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? Zf(n) : 0;
	if (r) return ad(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function Rh(e, t, n) {
	let r = Object.values(e.structures).find((e) => e.kind === "speech"), i = r ? Qf(r) : 0;
	if (i && e.speech && n?.speech?.on) return ad(e, t).some((e) => e.structures.includes(r.id)) ? {
		depth: i,
		tag: r.tag
	} : void 0;
}
function zh(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function Bh(e, t, n, r) {
	let i = new Set(ad(e, t).flatMap((e) => e.structures)), a = n ? rd(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = Xf(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? zs(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...tp(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: ep(r)
	} : void 0;
}
var Vh = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function Hh(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function Uh(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = Hh(e), r = Hh(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function Wh(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Vh(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Vh(l.text);
			if (c === u || c.includes(u) || Uh(c, u) >= n) {
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
var Gh = 50;
function Kh(e) {
	let t = Am(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var qh = () => Math.random().toString(36).slice(2, 8);
function Jh(e) {
	let t = new Set(e), n = qh();
	for (; t.has(n);) n = qh();
	return n;
}
function Yh(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: Jh(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function Xh(e, t) {
	let n = Kh(e), r = {
		id: Jh(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: rf()
	};
	return e.insertionPoints.length && r.entries.push(Yh(e, r)), n.push(r), J(), n[n.length - 1];
}
function Zh(e, t) {
	let n = Kh(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(Bf(t, Jh(n.map((e) => e.id)), { name: i })), J(), n[n.length - 1];
}
function Qh(e, t, n) {
	let r = Kh(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...Y(r[i]),
		id: Jh(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), J(), r[i + 1];
}
function $h(e, t) {
	let n = Am(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), J();
}
function eg(e, t, n) {
	let r = Kh(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), J();
}
function tg(e, t) {
	return Ff(Y(Kh(e).filter((e) => !t || t.includes(e.id))), e);
}
function ng(e, t) {
	let n = If(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && uu(n.preset.version, e.version) < 0 && (r = wf(r, e.migrations, n.preset.version));
	let i = Kh(e), a = r.map((e) => {
		let t = {
			...e,
			id: Jh(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return J(), {
		added: a,
		missing: a.filter((t) => _f(e, t).length).length
	};
}
function rg(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < Gh; t--) {
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
var ig = /* @__PURE__ */ dn({
	log: [],
	requests: []
}), ag = 50;
function og(e, t) {
	ig.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), ig.log.length > ag && (ig.log.length = ag);
}
function sg(e) {
	return ig.requests.unshift(e), ig.requests.length > ag && (ig.requests.length = ag), ig.requests[0];
}
//#endregion
//#region src/core/cache.ts
function cg(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function lg(e, t) {
	return e.send_date ? cg(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var ug = 57344, dg = /⟦([\uE000-\uF8FF])⟧/g, fg = (e) => `⟦${String.fromCharCode(ug + e)}⟧`;
function pg(e) {
	let t = [];
	return {
		text: e.replace(dg, (e, n) => (t.push(n.charCodeAt(0) - ug), "")),
		marks: t
	};
}
function mg(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of Mh(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : Eh(n?.[e], t.synopsisId), l = c ?? s.fresh, u = Nh(s, s.fresh, t), d = c ? Nh(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = Th(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: Th(l),
			freshMode: Th(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function hg(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function gg(e, t, n, r, i, a = {}) {
	let o = hg(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && cg(i) === n[r]) r++;
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
		r !== null && f.push(cg(r));
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
function _g(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var vg = "advanced-preset.cache.v1", yg = 864e5, bg = 30, xg = null;
function Sg() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function Cg() {
	if (xg) return xg;
	try {
		let e = Sg()?.getItem(vg), t = e ? JSON.parse(e) : {};
		xg = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		xg = {};
	}
	return xg;
}
function wg(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= yg).sort((e, t) => t[1].at - e[1].at).slice(0, bg);
	xg = Object.fromEntries(n);
	try {
		Sg()?.setItem(vg, JSON.stringify(xg));
	} catch {}
}
function Tg() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var Eg = (e, t) => t ? `${e}\u0001${t}` : e;
function Dg(e) {
	return Cg()[e];
}
function Og(e, t) {
	wg({
		...Cg(),
		[e]: t
	}, t.at);
}
function kg(e, t) {
	let n = Cg()[e];
	n && Og(e, {
		...n,
		at: t
	});
}
function Ag(e, t) {
	let n = Cg(), r = (t) => Eg(e, t);
	if (!t.some(([e, t]) => r(e) in n || r(t) in n)) return;
	let i = { ...n };
	for (let [e, n] of t) delete i[r(e)], delete i[r(n)];
	for (let [e, a] of t) n[r(e)] && (i[r(a)] = n[r(e)]);
	wg(i, Date.now());
}
//#endregion
//#region src/core/input-shaping.ts
var jg = "⟦󰀀⟧", Mg = "⟦󰀁⟧", Ng = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function Pg(e) {
	let t = e.match(Ng)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + jg + t;
}
var Fg = (e) => e.replaceAll(jg, "");
function Ig(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = Fg(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = Fg(e.text));
}
function Lg(e, t, n, r) {
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
			let n = t.lastIndexOf(jg);
			if (n < 0) continue;
			let a = Fg(t.slice(0, n)).replace(Ng, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: Fg(t.slice(n + 4))
			};
		}
	}
	return null;
}
var Rg = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function zg(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? Gf(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && Rg(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (Rg(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var Bg = "stream_function_call_arguments";
function Vg(e, t, n) {
	if (e === "off" || t !== "gemini") return !1;
	if (e === "on") return !0;
	let r = String(n.chat_completion_source ?? "");
	return r === "vertexai" || r === "custom" || r === "makersuite" && !!String(n.reverse_proxy ?? "").trim();
}
function Hg(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function Ug(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Bg] = !0, t() && Wg(e));
}
function Wg(e) {
	let t = Gg(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Hg(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Gg(e) {
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
var Kg = "google-gemini-v1", qg = /* @__PURE__ */ new WeakSet(), Jg = /* @__PURE__ */ new WeakSet();
function Yg(e) {
	return qg.add(e), e;
}
function Xg(e, t) {
	if (t !== "gemini" && !(t === "openai" && e.config.connection.openAiSignatures)) return;
	let n = e.config.connection.syntheticTurn, r = n ? e.preset.syntheticTurns.find((e) => e.id === n) : void 0;
	return r ? hu(r, mu(e.config.connection)) : void 0;
}
function Zg(e) {
	return Jg.add(e), e;
}
function Qg(e, t) {
	return !e.signatureFallback && (e.transport === "tool-single" || e.transport === "tool-multi") && !!Xg(e, t);
}
function $g(e) {
	let { message: t = "", body: n = "" } = e ?? {};
	return /thought[\s_-]?signature/i.test(`${t}\n${n}`);
}
function e_(e, t, n = {}) {
	return t !== "gemini" && !(t === "openai" && n.openAi) ? e : e.map((e) => e.role !== "assistant" || !Array.isArray(e.tool_calls) || !e.tool_calls.length ? e : t === "gemini" ? n_(e, !!n.fallback) : qg.has(e) ? r_(e, !!n.fallback, n.source === "openrouter") : e);
}
var t_ = (e, t) => t && Jg.has(e) || typeof e.signature != "string" || !e.signature ? void 0 : e.signature;
function n_(e, t) {
	let n = e.tool_calls;
	return n.every((e) => t_(e, t)) ? e : {
		...e,
		tool_calls: n.map((e) => ({
			...e,
			signature: t_(e, t) ?? "skip_thought_signature_validator"
		}))
	};
}
function r_(e, t, n) {
	let r = Array.isArray(e.reasoning_details) ? [...e.reasoning_details] : [], i = e.tool_calls.map((e) => {
		let i = t_(e, t), { signature: a, ...o } = e;
		return i ? (r.push({
			type: "reasoning.encrypted",
			data: i,
			id: e.id,
			format: Kg,
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
function i_(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of hl(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function a_(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function o_(e) {
	return hl(e.preset.tools, e.workflow, e.stages, e.structures, a_(e));
}
function s_(e) {
	let t = e.preset.tools.envelope.when;
	return !t || !e.assembly || zs(t, e.assembly.resolve);
}
function c_(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${cd(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function l_(e, t, n) {
	let r = il(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return a_(e)(r);
}
function u_(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = Xg(r, i), l = {
		id: s,
		type: "function",
		function: {
			name: o.tool.name,
			arguments: "{}"
		},
		...c ? { signature: c } : {}
	};
	c && Zg(l);
	let u = a_(r), d = u(o.tool.description);
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
			Yg({
				role: "assistant",
				content: "",
				tool_calls: [l]
			}),
			{
				role: "tool",
				tool_call_id: s,
				content: l_(r, o.response[t], { first: n })
			}
		]
	};
}
function d_(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t);
	let r = String(n.chat_completion_source ?? "");
	return Array.isArray(n.messages) && (n.messages = e_(n.messages, e.family, {
		fallback: e.ctx.signatureFallback,
		source: r,
		openAi: e.ctx.config.connection.openAiSignatures
	})), e.family === "gemini" && f_(n, e.ctx.preset.tools.jsonStringHint), Vg(e.ctx.config.connection.streamToolArguments, e.family, n) && Ug(n), n;
}
function f_(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Cd(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: xd(e.json_schema.value, n)
	});
}
function p_(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var m_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", h_ = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(jg, ""), g_ = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(dg.source).test(e);
function __(e) {
	for (let t of e) if (typeof t.content == "string") g_(t.content) && (t.content = pg(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && g_(e.text) && (e.text = pg(e.text).text);
}
function v_(e) {
	if (typeof e.content == "string") {
		if (!g_(e.content)) return null;
		let { text: t, marks: n } = pg(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => _g(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !g_(e.text)) return;
		let i = pg(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = _g(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function y_(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = o_(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return cg(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function b_(e) {
	return cg(e.map((e) => `${e.role}\u0000${m_(e.content)}`).join(""));
}
function x_(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return __(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = v_(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = h_(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = h_(i.content);
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
			sticky: h_(f),
			fresh: h_(p),
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
		tools: y_(e),
		prompt: b_(t.slice(0, n))
	}, p = gg(l, Dg(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function S_(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? kg(n.chat, t) : Og(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var C_ = "advanced_preset", w_ = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function T_() {
	let t = e().chatMetadata?.[C_]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function E_(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[C_] ??= {};
	r.storylines = t;
}
function D_(t = e().chat, n = T_()) {
	return Bp(t, n).map((e) => Vp(e, n));
}
function O_(t = e().chat, n = T_()) {
	let r = new Set(D_(t, n).filter((e) => e !== "" && !Rp(e)));
	n.main && r.add(n.main);
	for (let e of [...Object.keys(n.if ?? {}), ...Object.keys(n.hidden ?? {})]) r.add(e);
	return r;
}
function k_(t, n = e().chat, r = T_()) {
	let i = D_(n, r);
	return Gp(i, t ?? i.at(-1) ?? "", r).order;
}
function A_(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function j_(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[Fp] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[Fp] = n);
}
async function M_(t, n) {
	if (!t) return;
	let r = T_();
	E_({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function N_(t) {
	let n = T_();
	return !qu(t) || D_(e().chat, n).includes(t) ? !1 : (E_({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
async function P_(t, n) {
	if (!t) return await N_(n) ? "renamed" : qu(n) ? "taken" : "invalid";
	if (!qu(n)) return "invalid";
	if (n === t) return "unchanged";
	let r = T_();
	if (n === r.main || D_(e().chat, r).includes(n)) return "taken";
	let i = e().chat, a = [];
	i.forEach((e, r) => {
		if (e.is_user) {
			let i = Ju(e.mes);
			if (i?.form !== "name" || i.name !== t) return;
			e.mes = Zu(e.mes, i, n), a.push(r);
		} else e.swipe_info?.forEach((e) => {
			e?.extra?.advanced_preset_storyline === t && (e.extra[Fp] = n);
		}), e.extra?.advanced_preset_storyline === t && (e.extra[Fp] = n);
	});
	let o = Hp(t, r), s = Up(t, r), c = { ...r.if ?? {} }, l = { ...r.hidden ?? {} };
	delete c[t], delete l[t], o === td(n) ? delete c[n] : c[n] = o, s === o ? delete l[n] : l[n] = s;
	let u = {
		...r,
		if: c,
		hidden: l
	};
	Object.keys(c).length || delete u.if, Object.keys(l).length || delete u.hidden, E_(u), Ag(Tg(), [[t, n]]);
	for (let t of a) e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "renamed";
}
async function F_(t, n) {
	if (!t) return;
	let r = T_();
	E_({
		...r,
		hidden: {
			...r.hidden ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
function I_(e, t) {
	if (!e) return;
	let n = T_(), r = { ...n };
	t.ifLine !== void 0 && (t.ifLine || td(e)) && (r.if = {
		...n.if ?? {},
		[e]: t.ifLine
	}), t.hide && (r.hidden = {
		...n.hidden ?? {},
		[e]: !0
	}), E_(r);
}
function L_(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[Ip] = !0);
}
async function R_(t, n) {
	let r = T_();
	if (!qu(t)) return "invalid";
	if (Vp(t, r) === "") return "unchanged";
	let i = e().chat, a = Bp(i, r).map((e) => Vp(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!qu(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = Xu(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? Vp(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Fp] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Fp] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && Hp(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t];
	let l = { ...r.hidden ?? {} };
	o && delete l[o], delete l[t], E_({
		...r,
		main: t,
		if: c,
		...Object.keys(l).length || r.hidden ? { hidden: l } : {}
	}), Ag(Tg(), o ? [["", o], [t, ""]] : [[t, ""]]);
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/media-vars.ts
var z_ = {
	image: () => ({
		vars: { ...dc },
		refs: []
	}),
	speech: () => ({
		vars: { ...fc },
		format: "",
		characters: []
	})
}, B_ = {};
function V_() {
	return {
		image: B_.image ?? z_.image,
		speech: B_.speech ?? z_.speech
	};
}
var H_ = (e, t, n) => {
	try {
		return e();
	} catch (e) {
		return console.error(`[AP] ${n} runtime failed`, e), t();
	}
};
function U_(e) {
	if (!e.image) return z_.image();
	let t = H_(() => V_().image(), z_.image, "image");
	if (!t.vars.on) return {
		vars: { ...dc },
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
function W_(e) {
	if (!e.speech) return z_.speech();
	let t = H_(() => V_().speech(), z_.speech, "speech");
	if (!t.vars.on) return {
		vars: { ...fc },
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
var G_ = /⟦ap:region:([\w.-]+)⟧/g, K_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function q_(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(G_)) {
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
function J_(t, n, r) {
	if (!hh(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = cd(t, n, t.user), s = cd(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = am(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? Jc(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function Y_(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = am(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : Uc(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var X_ = (e) => e?.view;
function Z_(t, n) {
	let { preset: r, config: i } = t, a = X_(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = Y_(r, s), l = _m(Infinity, a), u = bm(Am(r)), d = vm(Infinity, a), f = J_(r, i, s), p = w_(r, i) ? T_().main ?? "" : "", m = t.transport, h = t.origin === "story", g = U_(h ? r : {}), _ = W_(h ? r : {});
	return {
		vars: gd(r, i, {
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
				...Gu,
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
			inputText: t.inputShaped ? Mg : "",
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
function Q_(t, n, r) {
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
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = Wh(c.map(({ m: e }) => ({
		role: e.role,
		text: K_(e.content)
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
			mes: K_(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (w_(i, a)) {
		let e = tm(p, m, Jp(l, -1, T_()), -1, Uu(a.storylines));
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = Z_(t, vh(i, a, t.origin)).vars, v = {
		trigger: gh(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...zh(i),
		echoes: Bh(i, a, _, vh(i, a, "story")),
		recap: vm(Infinity, X_(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: Lh(i, a),
		speech: Rh(i, a, _),
		...g ? { background: (e) => nm(g, h[e]) } : {}
	}, y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = Eg(Tg(), g?.current), n = mg(p, v, Dg(e)?.modes, (e) => lg(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			y.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + fg(e.entry));
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
	} else for (let e of Ih(p, v)) y.set(e.__h, e.mes), b.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = b.get(e);
		e >= 0 && y.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (y.set(e, Pg(y.get(e))), t.input = { texts: n });
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
function $_(t, n) {
	let r = n ? null : wh.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Nm(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = _h(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: bh(),
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
		keywords: rg(a, n ? o : -1)
	};
}
var ev = Symbol("ap-region");
function tv(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function nv(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? Lg(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (Ig(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(Mg) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		zg(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(Mg, () => c) : e;
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
function rv(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return em(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = nd(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, ev, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && K_(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function iv(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => K_(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${cd(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = K_(t.content);
		if (t[ev] || t.role === "system") return n;
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
var av = /* @__PURE__ */ new Set();
function ov(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !av.has(n) && (av.add(n), x("warning", X("warn.template", { error: n }), X("app.name")));
}
function sv(e) {
	let t = (e) => (typeof e.content == "string" ? e.content : JSON.stringify(e.content ?? "")).includes(jd);
	for (let n = e.length - 1; n >= 0; n--) t(e[n]) && e.splice(n, 1);
}
async function cv(t) {
	let { chat: n, dryRun: r } = t;
	if (sv(n), !q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		__(n), Ig(n), rm(n), r || (wh.setPending(null), wh.takeArmed());
		return;
	}
	let i = eh(), a = i ? xp(i) : void 0;
	if (!a) {
		let e = q_(n).filter((e) => !e.__anchor);
		__(e), Ig(e), rm(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = $_(a, r), s = q_(n), c = rm(s);
	!o.interceptorRan && !r && Q_(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : vh(a, o.config, o.origin), d = a.inputShaping, f = tv(a, s), p = d && o.input ? Lg(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = Z_(o, u), g = bf(a, Kh(a), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = hd({
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, u);
	_.warnings.length && ov(_.warnings, o.warnings), o.workflow = u, o.assembly = _, o.stages = _.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : _.structures;
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
			text: zu(t)
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
			return Object.defineProperty(t, ev, { value: !0 }), t;
		}).filter((e) => K_(e.content).trim());
		S.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: K_(e.content).length,
				content: K_(e.content)
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
	}, C.grouped && b >= 0 && (te = rv(o, C, y, b, te))), S.cache = x_(o, y, b, te), S.input = nv(o, y, b, te, S);
	let ne = o.transport === "prefill" && !l && b >= 0 ? iv(o, y, b) : y;
	n.splice(0, n.length, ...ne.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), og("assembly", S), !r && !l && u && wh.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var lv = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, uv = (e) => typeof e == "object" && !!e && !Array.isArray(e), dv = (e, t) => w_(e, t) ? Uu(t?.storylines) : "off";
function fv() {
	let e = eh(), t = e ? xp(e) : void 0;
	return t ? dv(t, Nm(t)) : "off";
}
function pv(e, t) {
	if (typeof e != "string" || !e) return -1;
	for (let n = t.length - 1; n >= 0; n--) if (t[n].mes === e) return n;
	if (e.length >= 40) {
		for (let n = t.length - 1; n >= 0; n--) if (t[n].mes.includes(e)) return n;
	}
	return -1;
}
var mv = (e) => !!(bv?.open && e >= bv.from);
function hv(t, n = e().chat) {
	let r = pv(t, n);
	return r < 0 ? null : mv(r) ? bv.line : D_(n)[r];
}
function gv(t, n, r = e().chat) {
	if (n === "off") return !1;
	let i = pv(t, r);
	if (i < 0 || mv(i)) return !!(bv?.open && bv.frozen);
	let a = D_(r)[i];
	return Wu(n, {
		main: a === "",
		if: Hp(a, T_())
	});
}
var _v = /* @__PURE__ */ new WeakSet();
function vv(e, t, n) {
	uv(e) && Array.isArray(t) && gv(n, fv()) && (t.length && og("variables", {
		frozen: "mvu",
		storyline: hv(n) ?? bv?.line,
		commands: t.length
	}), t.splice(0, t.length), _v.add(e));
}
function yv(e, t) {
	uv(e) && _v.has(e) && (_v.delete(e), uv(t) && "stat_data" in t && (e.stat_data = Y(t.stat_data)), e.delta_data = {});
}
var bv = null;
function xv(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return uv(n) ? n : void 0;
}
var Sv = /* @__PURE__ */ new Set(["display_data", "delta_data"]), Cv = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !Sv.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function wv(t) {
	bv = null, t.line !== void 0 && (bv = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		frozen: t.frozen,
		from: Math.max(0, t.from),
		chatVars: t.frozen ? Y(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function Tv() {
	let t = bv;
	if (!t?.frozen) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return bv = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = Y(t.chatVars), r = !0);
	let o = n.chat, s = D_(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = xv(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = xv(o[t]);
		Cv(n, r) || (t.variables[t.swipe_id ?? 0] = r ? Y(r) : {}, i = !0);
	}
	return (r || i) && og("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var Ev = () => {
	bv = null;
};
function Dv() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(lv.commandParsed, (e, t, n) => vv(e, t, n)), r(lv.updateEnded, (e, t) => yv(e, t));
	let i = (e) => () => {
		bv && (e && (bv.open = !1), setTimeout(() => void Tv().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || Ev();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, Ev);
}
//#endregion
//#region src/core/interceptor.ts
async function Ov(t, n, r, i) {
	if (wh.setPending(null), !q().enabled) return;
	let a = eh(), o = a ? xp(a) : void 0;
	if (!o) return;
	let s = Nm(o), c = i || "normal";
	c === "swipe" && cm(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (w_(o, s)) {
		let e = T_(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = Jp(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || A_(n, i.rewrite), i.noRecent && x("info", X("storylines.noRecent"), X("app.name")));
		let a = tm(t, r ? t.map((e, t) => t) : f, i, u, Uu(s.storylines));
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", g = t.slice(-6).map((e) => e.mes), _ = rg(t, u), { meta: v, flags: y, origin: b } = _h(o, s, h, c, !0, g), S = s.connection.transport, { vars: ee } = Z_({
		preset: o,
		config: s,
		transport: S,
		origin: b,
		stType: c,
		meta: v,
		flags: y,
		storylines: p
	}, vh(o, s, b)), te = {
		trigger: gh(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...zh(o),
		echoes: Bh(o, s, ee, vh(o, s, "story")),
		recap: vm(Infinity, X_(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: Lh(o, s),
		speech: Rh(o, s, ee),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => nm(p, m[e]) } : {}
	}, C = (e, t) => p?.grouped && m[e] !== void 0 ? Qp(m[e]) + t : t, ne, re, w = -1, ie = [];
	if (s.cache?.enabled) {
		let e = Eg(Tg(), p?.current), n = mg(t, te, Dg(e)?.modes, (e) => lg(t[e], f[e] ?? e));
		if (re = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: C(n, t === void 0 ? e.mes : e.mes + fg(t))
		})), w = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, w >= 0) {
			let e = n.out[w], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			ie = t ? [
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
		let e = Fh(t, te);
		re = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: C(t, e.mes)
		} : e), w = u >= 0 ? e.findIndex((e) => e.index === u) : -1, w >= 0 && (ie = [e[w].item.mes]);
	}
	let ae;
	o.inputShaping && w >= 0 && ie.some((e) => e.trim()) && (re[w] = {
		...re[w],
		mes: Pg(re[w].mes)
	}, ae = { texts: ie }), t.splice(0, t.length, ...re);
	let oe = {
		id: bh(),
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
		input: ae,
		storylines: p,
		createdAt: Date.now(),
		warnings: []
	};
	wv({
		line: p?.current,
		frozen: !!p?.vars.frozen,
		from: oe.inputIndex >= 0 ? oe.inputIndex : d.length - 1
	}), wh.setPending(oe);
}
//#endregion
//#region src/core/transports/text.ts
function kv(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = c_(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => Tl(e, {
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
			content: il(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), d_({
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
			let n = p_(t, e.caller);
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
var Av = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, jv = 32, Mv = 10, Nv = 9, Pv = 13, Fv = 160, Iv = 6158, Lv = 8192, Rv = 8203, zv = 8239, Bv = 8287, Vv = 12288, Hv = 65279;
function Uv(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Wv(e) {
	return e >= "0" && e <= "9";
}
function Gv(e) {
	return e >= " ";
}
function Kv(e) {
	return ",:[]/{}()\n+".includes(e);
}
function qv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Jv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Yv = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Xv = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function Zv(e) {
	return ",[]/{}\n+".includes(e);
}
function Qv(e) {
	return iy(e) || $v.test(e);
}
var $v = /^[[{\w-]$/;
function ey(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function ty(e, t) {
	let n = e.charCodeAt(t);
	return n === jv || n === Mv || n === Nv || n === Pv;
}
function ny(e, t) {
	let n = e.charCodeAt(t);
	return n === jv || n === Nv || n === Pv;
}
function ry(e, t) {
	let n = e.charCodeAt(t);
	return n === Fv || n === Iv || n >= Lv && n <= Rv || n === zv || n === Bv || n === Vv || n === Hv;
}
function iy(e) {
	return ay(e) || sy(e);
}
function ay(e) {
	return e === "\"" || e === "“" || e === "”";
}
function oy(e) {
	return e === "\"";
}
function sy(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function cy(e) {
	return e === "'";
}
function ly(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function uy(e, t) {
	let n = e.length;
	if (!ty(e, n - 1)) return e + t;
	for (; ty(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function dy(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function fy(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var py = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function my(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = py[n];
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
function hy(e) {
	return e !== null && e.char === "\"";
}
function gy(e) {
	return e !== null && e.char === "'";
}
function _y(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function vy(e, t) {
	switch (t) {
		case ")": return _y(e, "(") > _y(e, ")");
		case "]": return _y(e, "[") > _y(e, "]");
		case "}": return _y(e, "{") > _y(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var yy = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, by = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function xy(e) {
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
	for (r && a(), Qv(e[t]) && fy(n) ? (r || (n = uy(n, ",")), g()) : r && (n = ly(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	w();
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
		let i = r ? ty : ny, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (ry(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Sy(e, t);) t++;
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
			if (qv(e[t])) for (; t < e.length && Jv(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = uy(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = ly(n, ",")) : ae();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (Qv(e[t]) || c ? n = uy(n, ":") : oe()), i() || (s || c ? n += "null" : oe()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = uy(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = uy(n, ",")), p(), !i()) {
					r || (n = ly(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = uy(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = uy(n, ",")), t = i();
		t || (n = ly(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, iy(e[t]) || w());
		let s = e[t] === "&" ? my(e.slice(t, t + 12)) : null, c = hy(s) || gy(s);
		if (iy(e[t]) || c) {
			let l = oy(e[t]) ? oy : cy(e[t]) ? cy : sy(e[t]) ? sy : ay, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = te(t - 1);
					return !r && Kv(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = uy(p, "\""), n += p, !0);
				}
				if (t === i) return p = uy(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? my(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Kv(e[t]) && !vy(p, e[t]) || iy(e[t]) && !C(t) || Wv(e[t])) return v(), !0;
					e[t] === "\\" && w();
					let s = te(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Kv(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && Zv(e[t])) {
					if (e[t - 1] === ":" && Yv.test(e.substring(u + 1, t + 2))) for (; t < e.length && Xv.test(e[t]);) p += e[t], t++;
					return p = uy(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : ey(e) ? p += yy[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (by[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Uv(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : se();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : ey(n) ? (p += yy[n], t++) : (Gv(n) || re(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = ly(n, "\"", !0);
			let e = n.length;
			n = _() ? dy(n, e, 1) : uy(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Wv(e[t]) && ne() && (i += "0")), e[t] === "0" && Wv(e[t + 1]) && (a = !0); Wv(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Wv(e[t]) || (i += "0"); Wv(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Wv(e[t]) || (i += "0"); Wv(e[t]);) i += e[t], t++;
			return ne() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Jv(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (qv(e[t])) {
			for (; t < e.length && Jv(e[t]);) t++;
			let n = t;
			for (; ty(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !Zv(e[t]) && !iy(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Yv.test(e.substring(a, t + 2))) for (; t < e.length && Xv.test(e[t]);) t++;
		if (t > a) {
			for (; ty(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && ty(e, n);) n--;
		return n;
	}
	function C(t) {
		let n = t + 1;
		for (; n < e.length && ty(e, n);) n++;
		return n >= e.length || Kv(e[n]);
	}
	function ne() {
		return t >= e.length || Kv(e[t]) || ty(e, t);
	}
	function re(e) {
		throw new Av(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function w() {
		throw new Av(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function ie() {
		throw new Av("Unexpected end of json string", e.length);
	}
	function ae() {
		throw new Av("Object key expected", t);
	}
	function oe() {
		throw new Av("Colon expected", t);
	}
	function se() {
		throw new Av(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Sy(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Cy(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function wy(e, t) {
	let n = Cy(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(xy(n));
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
function Ty(e, t, n, r, i = !0) {
	let a = xl(e.stages), o = e.stages.find((e) => e.kind === "text"), s = i ? n?.[t.envelopeKeys.thinking] : void 0;
	o && typeof s == "string" && (a.stages[o.id] = {
		text: s,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && a.stages[t.id].status !== "done" && (a.stages[t.id].status = t.optional ? "pending" : "missing");
	return a.current = r ? null : o?.id ?? null, a;
}
function Ey(e) {
	let { ctx: t, caller: n } = e, r = o_(t), i = r.schema(), a = s_(t), o = n.schema ? a ? r.envelope(n.schema.value) : n.schema.value : i.value, s = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, c = null, l = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", u = (e, i) => {
		let o = wy(l(e), i);
		return c = o.value, n.schema ? Ty(t, r, o.value, i, a) : El(o.value, {
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
		body: () => d_(e, { json_schema: d }),
		progress: (e, t) => (s = e, u(e, t)),
		complete: () => ({ done: !0 }),
		result: () => u(s, !0),
		rawText: () => s.text,
		callerResult: () => a ? c?.[r.envelopeKeys.result] : c ?? void 0
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Dy = (e, t) => Yg({
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
function Oy(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function ky(e) {
	let { ctx: t, caller: n } = e, r = o_(t), i = s_(t), a = r.submitTool(n.schema ? i ? r.envelope(n.schema.value) : n.schema.value : void 0), o = a.function.name, s = u_(e, "single", o), c = [
		...s ? [s.tool] : [],
		a,
		...n.tools
	], l = [...e.messages, ...s?.messages ?? []], u = t.config.connection.forceTool && !n.tools.length, d = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, f = null, p = (e, a) => {
		let s = wy((e.toolCalls.find((e) => e.name === o) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", a);
		return f = s.value, n.schema ? Ty(t, r, s.value, a, i) : El(s.value, {
			stages: t.stages,
			structures: t.structures,
			final: a,
			openKey: s.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => d_(e, {
			messages: l,
			tools: c,
			tool_choice: u ? {
				type: "function",
				function: { name: o }
			} : "auto"
		}),
		progress: (e, t) => (d = e, p(e, t)),
		complete: (e) => {
			let t = p_(e, n);
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
function Ay(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = o_(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = u_(e, o ? "parallel" : "multi", l), d = [
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
		let i = wy(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? Ty(t, s, e, a) : El(e, {
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
			return d_({
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
			let i = Oy(e.toolCalls.filter((e) => e.name), r), o = p_(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(Dy(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = l_(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: l_(t, a.tools.results.nudge, {
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
function jy(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return kv(e);
		case "structured": return Ey(e);
		case "tool-single": return ky(e);
		case "tool-multi": return Ay(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function My(e, t) {
	let n = t ? f({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? g(n) : m(n);
}
var Ny = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Py(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, Ny({
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
			})), a = () => n === null ? "" : (n = null, Ny({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + Ny({
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
				text: (e) => e ? o("text") + Ny({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + Ny({
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
					for (let i of e) t++, r = !0, n += Ny({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + Ny({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + Ny({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => Ny({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + Ny({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + Ny({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Ny({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Ny({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Ny({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: Iy(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Ny({ error: { message: e } }),
			end: (e) => e ? Ny({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? Ny({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Ny({
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
			error: (e) => Ny({ error: { message: e } }),
			end: (e) => Ny({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? Ny({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Ny({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Ny({ choices: [{
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
					...Fy(e)
				}
			}] }) : "",
			error: (e) => Ny({ error: { message: e } }),
			end: (e) => (e ? Ny({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + Ny("[DONE]")
		};
	}
}
function Fy(e) {
	let t = e.filter((e) => e.signature).map((e, t) => ({
		type: "reasoning.encrypted",
		data: e.signature,
		id: e.id,
		format: "google-gemini-v1",
		index: t
	}));
	return t.length ? { reasoning_details: t } : {};
}
function Iy(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Ly(e, t) {
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
				...Fy(t.toolCalls)
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
			input: Iy(e.arguments)
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
					args: Iy(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Ry(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function zy(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function By(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Vy = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = zy(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = By(t);
			if (r) {
				let t = this.open.has(e) ? Hy(this.value, n) : void 0;
				Uy(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Hy(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Uy(e, t, n) {
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
var Wy = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Gy(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Wy(t) ? t : void 0;
}
function Ky(e, t) {
	if (!Wy(t)) return Wy(e) ? e : void 0;
	if (!Wy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Wy(r) && Wy(n[e]) ? Ky(n[e], r) : r);
	return n;
}
function qy(e, t) {
	if (!Wy(t)) return Wy(e) ? e : void 0;
	if (!Wy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Wy(r) && Wy(t) ? n[e] = qy(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var Jy = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Yy(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Xy = class {
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
				let i = Zy(n);
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
				args: new Vy()
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
			let i = typeof e.signature == "string" && e.signature ? e.signature : Zy(e);
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
function Zy(e) {
	let t = e?.extra_content?.google?.thought_signature ?? e?.function?.extra_content?.google?.thought_signature;
	return typeof t == "string" && t ? t : void 0;
}
function Qy(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function $y(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* eb(e, t) {
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
async function* tb(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Yy(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Jy(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Xy();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Yy(t);
		if (n) throw new Jy(n);
		i.text = Qy(t), i.reasoning = $y(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Gy(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of eb(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Yy(e);
		if (r) throw new Jy(r);
		i.text += p(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Gy(e);
		c && (i.usage = Ky(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var nb = /* @__PURE__ */ dn({ current: null });
function rb(e, t) {
	return nb.current = {
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
	}, nb.current;
}
function ib(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
function ab(t, n) {
	t.mesId = n, t.swipeId = e().chat[n]?.swipe_id ?? 0;
}
function ob(t, n = e().chat[t]) {
	let r = nb.current;
	return !r || r.mesId !== t || r.swipeId !== null && (n?.swipe_id ?? 0) !== r.swipeId ? null : r;
}
//#endregion
//#region src/core/orchestrator.ts
function sb(e) {
	let t = e.structures.find((e) => e.kind === "speech");
	if (t) return e.speechCleaner ??= W_(e.preset).cleaner ?? null, {
		tag: t.tag,
		...e.speechCleaner ? { cleaner: e.speechCleaner } : {}
	};
}
var cb = "/api/backends/chat-completions/generate", lb = { pending: null }, ub = (e) => e?.name === "AbortError";
function db(e) {
	if (e.transport !== "tool-single" && e.transport !== "tool-multi") return null;
	let t = c(e.config.connection.assumeToolSupport);
	if (!t) return null;
	switch (t.reason) {
		case "postProcessing": return X("error.toolsUnsupported.postProcessing", { value: t.label });
		case "model": return X("error.toolsUnsupported.model", { target: t.model ? `${t.source} / ${t.model}` : t.source });
		default: return X(`error.toolsUnsupported.${t.reason}`);
	}
}
async function fb(e, t, n) {
	let r = My(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = db(e);
	if (a) return x("error", a, "Advanced Preset"), Ry(a, 400);
	let o = e.origin === "task" ? i_(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = rb(e, i);
	if (!i) {
		let i;
		try {
			i = await hb(e, t, s, c, n ?? void 0, () => void 0);
		} catch (e) {
			return mb(c, e);
		}
		if (n?.aborted) throw lb.pending?.ctx === e && (lb.pending = null), n.reason;
		return new Response(JSON.stringify(Ly(r, i)), { headers: { "Content-Type": "application/json" } });
	}
	let l = Py(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await hb(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			ub(e) || (await p(l.error(pb(e))), mb(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var pb = (e) => e instanceof Error ? e.message : String(e);
function mb(e, t) {
	return e.status = ub(t) ? "aborted" : "error", e.error = pb(t), t instanceof Jy ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Ry(pb(t));
}
async function hb(t, n, r, i, a, o) {
	let s = My(String(n.chat_completion_source ?? ""), n), c = jy({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: s
	}), l = ol(t.stages), u = l >= 0 ? t.stages[l].id : null, d = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !d && u !== null, m = t.structures.some((e) => e.kind === "annotations"), h = sb(t), g = m ? (e) => ac(e, { final: !1 }).text : (e) => e, _ = h ? (e) => Oc(g(e), {
		...h,
		final: !1
	}).text : g, v = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, y = Date.now(), b = "", ee, te = 0, C = !1, ne, re;
	for (let n = 0; n < v; n++) {
		i.step = n;
		let r = c.body(n), l = sg({
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
			let n = await S(cb, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), s = 0;
			for await (let e of tb(n, f(r), !!r.stream, a)) {
				d = e;
				let t = Date.now();
				if (t - s < 50) continue;
				s = t;
				let n = c.progress(e, !1);
				if (ib(i, n, b + e.reasoning), p && u) {
					let e = n.stages[u]?.text ?? "";
					e && o(_(e.slice(0, e.length - Ys(e))).trimEnd());
				}
			}
			S_(t), l.response = d.text || JSON.stringify(d.toolCalls), l.durationMs = Date.now() - l.at, l.usage = d.usage;
		} catch (e) {
			if (l.error = pb(e), ub(e) || a?.aborted) {
				(d.text || d.reasoning || d.toolCalls.length) && S_(t), ee = qy(ee, d.usage), C = !0, re = c.progress(d, !1);
				break;
			}
			if (!d.text && !d.toolCalls.length && $g(e) && Qg(t, s)) {
				t.signatureFallback = !0, t.warnings.push("thought signature rejected: retried without the built-in signature"), x("warning", X("error.signatureFallback"), X("app.name")), n--;
				continue;
			}
			throw e;
		}
		b += d.reasoning, ee = qy(ee, d.usage), c.progress(d, !0);
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
	let w = re ?? c.result();
	if (C) for (let e of Object.values(w.stages)) e.status === "streaming" && (e.status = "interrupted");
	ib(i, w, b);
	let ie = gb(t, w, c.rawText(), c.callerResult?.(), b, {
		usage: ee,
		requests: te,
		durationMs: Date.now() - y,
		interrupted: C
	});
	return ie.toolCalls = ne, ie.usage = ee, ne && (ie.content = ""), i.status = C ? "aborted" : "done", ie;
}
function gb(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Al(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Xs(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = ac(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = ac(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v, y, b = sb(t);
	if (b) {
		if (u) {
			let e = Nc(u, g, b);
			l.push(...e.warnings), u = e.text, v = e.spans, g = e.anchors;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Nc(d, _?.draft, b);
			d = e.text, f = u, y = {
				draft: e.spans,
				patched: v ?? []
			}, _ &&= {
				draft: e.anchors ?? [],
				patched: g ?? []
			};
		}
	}
	let x = (e) => Object.values(s.structures).find((t) => t.kind === e), S = x("reply"), ee = S ? n.structures[S.id] : void 0, te = x("impersonate"), C = x("recap"), ne = x("memory"), re = t.meta.mixed ? "meta-mixed" : "story", w = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? w = i === void 0 ? u || Xs(r).trim() : JSON.stringify(i) : u || (re = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", w = ee ? Jc(ee) : "", !w && te && typeof n.structures[te.id] == "string" && (w = "…"), !w && C && n.structures[C.id] && (w = "…"))), !w && !o.interrupted) throw Error(X("error.emptyTurn"));
	let ie = [], ae = [], oe = t.interceptorRan && t.stType !== "quiet";
	if (oe && ne && Array.isArray(n.structures[ne.id])) {
		let e = Dm(n.structures[ne.id]);
		ie.push(...e.events), ae = e.global;
	}
	if (oe && C && typeof n.structures[C.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ie.push({
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
		content: w,
		reasoning: a,
		sidecar: ce,
		...ae.length ? { global: ae } : {}
	};
	return oe ? lb.pending = {
		ctx: t,
		outcome: T,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ce
	}), nb.current?.genId === t.id && (nb.current.structures = n.structures), T;
}
//#endregion
//#region src/app/updater.ts
var _b = "advancedPreset.reloadedFor";
async function vb() {
	try {
		let e = await S(`${d()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function yb(e) {
	sessionStorage.setItem(_b, e), x("info", X("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function bb() {
	let e = await vb();
	e && e !== "016b78e65eb6c13b" && sessionStorage.getItem(_b) !== e && yb(e);
}
async function xb() {
	await bb();
}
var Sb = "/api/extensions/switch", Cb = (e) => e.replace(/^third-party/, "").replace(/^\/+|\/+$/g, "");
function wb(e, t, n) {
	if (!n.ok || typeof t.body != "string") return;
	let r;
	try {
		if (new URL(e, location.href).pathname !== Sb) return;
		r = JSON.parse(t.body).extensionName;
	} catch {
		return;
	}
	typeof r == "string" && Cb(r) === Cb(u()) && bb();
}
async function Tb() {
	let e = u().replace(/^third-party\//, ""), t = await kb(e, !1);
	if (t.status === 404 && (t = await kb(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await vb();
	return r && r !== "016b78e65eb6c13b" ? (yb(r), {
		upToDate: !1,
		reloading: !0
	}) : {
		upToDate: !!n.isUpToDate,
		reloading: !1
	};
}
async function Eb() {
	let e = await Tb();
	return e.reloading || !e.upToDate ? "updated" : "current";
}
var Db = "advancedPreset.selfUpdateFor";
async function Ob(e, t) {
	let n = `1.11.2>${e}`;
	if (sessionStorage.getItem(Db) === n) return !1;
	sessionStorage.setItem(Db, n), x("info", X("update.forPreset", {
		name: t,
		version: e
	}));
	try {
		return (await Tb()).reloading;
	} catch (e) {
		return console.warn("[AP] self-update failed", e), !1;
	}
}
var kb = (t, n) => S("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Ab = "__ap_gen_id";
function jb(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function Mb() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	ee(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(jb(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[Ab], r = typeof t == "string" ? wh.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[Ab], r.claimed = !0;
				try {
					return n.signal?.throwIfAborted(), await fb(r, e, n.signal);
				} finally {
					wh.release(t);
				}
			}
			e && (delete e[Ab], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		let r = await e.call(globalThis, t, n);
		return n?.method === "POST" && wb(jb(t), n, r), r;
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Nb(e) {
	let t = wh.takeArmed();
	t && (e[Ab] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function Pb(e) {
	let t = await R_(e);
	if (t === "invalid") return x("warning", X("storylines.invalidName"), X("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && x("warning", X("storylines.nameTaken", { name: n }), X("app.name")), t === "invalid" && x("warning", X("storylines.invalidName"), X("app.name"));
		let r = await b(`<h3>${v(X("storylines.switchTitle", { name: e }))}</h3><p>${v(X("storylines.askOldMain"))}</p>`, n, X("storylines.switch"), X("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = qu(n) ? await R_(e, n) : "invalid";
	}
	return t === "switched" && x("success", X("storylines.switched", { name: e }), X("app.name")), !0;
}
async function Fb(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) {
		j_(t, n.current), i.hide && (I_(n.current, { hide: !0 }), await e().saveMetadata());
		return;
	}
	let a = r && typeof r == "object" ? r : {}, o = O_(), s = (e, t) => {
		let n = $u(Qu(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(T_().main ?? "");
		let e = s(a.name, X("storylines.fallback.side"));
		return e !== T_().main && !await N_(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), j_(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, X(i.ifLine ? "storylines.fallback.if" : "storylines.fallback.side"));
		I_(n, {
			ifLine: !!i.ifLine,
			hide: i.hide
		}), j_(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, X("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, X("storylines.fallback.main")) : void 0), u = await R_(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), x("warning", X("storylines.switchFailed", { name: c }), X("app.name")), j_(t, c);
	i.naming && n.input >= 0 && L_(n.input), j_(t, ""), u === "switched" && x("success", X("storylines.switched", { name: c }), X("app.name"));
}
function Ib(e, t) {
	if (!q().enabled) return e;
	let n = eh(), r = n ? xp(n) : void 0;
	if (!r || !w_(r, Nm(r)) || Ju(e)) return e;
	let i = D_(), a = i[t ?? i.length - 1];
	return !a || Rp(a) ? e : Xu(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var Lb = "\0";
function Rb(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = fm(e);
		r && t.add(`${n.presetId}${Lb}${r}`);
	}
}
function zb(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && Rb(r.extra?.[im], t), r.swipe_info?.forEach((e, t) => {
			t !== i && Rb(e?.extra?.[im], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var Bb = null;
function Vb(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = zb(n.chat ?? []), o = new Set(a);
	if (Bb && !t.reload && Bb.chatId === r) for (let e of Bb.active) i.has(e) || o.add(e);
	Bb = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(Lb), i = s.get(n);
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
		n?.globalMemory && (dm(n.globalMemory.log) && (l = !0), km(n, t.off, !1) && (l = !0), km(n, t.on, !0) && (l = !0));
	}
	return l && J(), l;
}
function Hb(e) {
	cm(e), Vb();
}
function Ub() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => Hb(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => Vb());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => Vb({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var Wb = 6e5, Gb = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Kb(t, n) {
	let r = lb.pending;
	if (!r || Date.now() - r.at > Wb || Gb.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	lb.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), sm(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await Fb(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && Om(Am(r.ctx.preset), a.global), Vb(), nb.current?.genId === r.ctx.id && ab(nb.current, t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var qb = /* @__PURE__ */ new Set();
function Jb(e) {
	for (let t of qb) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function Yb(t) {
	let n = e().chat[t], r = am(n)?.annotations;
	return !n || !r?.length ? [] : lc(n.mes, r).annotations;
}
function Xb(t) {
	let n = e().chat[t], r = am(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = lc(n.mes, r.annotations);
	return i.changed ? (sm(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function Zb() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (Xb(n) && e().saveChat(), Jb(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => Jb(Number(e)));
}
var Qb = {
	get: (e) => Yb(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return qb.add(t), () => qb.delete(t);
	}
}, $b = /* @__PURE__ */ new Set();
function ex(e) {
	for (let t of $b) try {
		t(e);
	} catch (e) {
		console.error("[AP] speech listener failed", e);
	}
}
function tx(t) {
	let n = e().chat[t], r = am(n)?.speech;
	return !n || !r?.length ? [] : kc(n.mes, r).spans;
}
function nx(t) {
	let n = e().chat[t], r = am(n);
	if (!n || !r?.speech?.length) return !1;
	let i = kc(n.mes, r.speech);
	return i.changed ? (sm(t, {
		...r,
		speech: i.spans
	}), !0) : !1;
}
function rx() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (nx(n) && e().saveChat(), ex(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => ex(Number(e)));
}
var ix = {
	get: (e) => tx(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return $b.add(t), () => $b.delete(t);
	}
};
//#endregion
//#region src/store/bundled-modules.ts
function ax(e, t, n, r) {
	return Pf({
		...Y(zf(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function ox(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of Lf(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = ax(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = Wf(o), u = Uf(c), d = n?.[o.id];
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
		let f = Uf(s);
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
function sx(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function cx(e, t, n = []) {
	let r = Am(e), i = Kh(e), a = { ...t.records };
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
	i.push(...t.add), r.bundledModules = a, J();
}
function lx(e, t, n) {
	let r = Lf(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && ax(e, i, n, t.enabled);
		if (i && a && Uf(a) === Uf(t)) {
			let { enabled: e, ...n } = Y(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return Vf(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function ux(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var dx = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
//#endregion
//#region src/app/bundled-modules.ts
function fx(e, t, n) {
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
async function px(e, t) {
	let { root: n, checked: r } = fx(X("um.bundled.conflictTitle"), X("um.bundled.conflictBody", { name: Mp(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: X(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await y(n, X("um.bundled.apply"), X("um.bundled.keepAll")) ? r() : [];
}
async function mx(e, t) {
	let n = Am(e), r = ox(e, Kh(e), n.bundledModules, kp());
	if (sx(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await px(e, a)), cx(e, r, i), r.add.length && x("info", X("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), Mp(e));
}
var hx = /* @__PURE__ */ new Map();
function gx(e, t = {}) {
	let n = e.id, r = (hx.get(n) ?? Promise.resolve()).then(() => mx(xp(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return hx.set(n, r), r;
}
function _x(e, t, n) {
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
async function vx(e) {
	let t = Kh(e), n = _x(X("presetFile.installer"), X("presetFile.installerHint"), !0), r, i = () => [];
	if (t.length) {
		let a = fx(X("um.bundled.exportTitle", { name: Mp(e) }), X("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || X("um.untitled"),
			...e.enabled ? {} : { note: X("um.bundled.disabled") },
			checked: !0
		})));
		a.root.append(n.root), r = a.root, i = a.checked;
	} else {
		r = document.createElement("div"), r.style.textAlign = "start";
		let t = document.createElement("h3");
		t.textContent = X("um.bundled.exportTitle", { name: Mp(e) }), r.append(t, n.root);
	}
	if (!await y(r, X("um.bundled.export"), X("common.cancel"))) return !1;
	let a = i(), o = lx(e, t.filter((e) => a.includes(e.id)), kp()), s = wu(o, o.defaultConfiguration, void 0).sampling;
	return ux(`${dx(e.id)}.apreset.json`, Bd(o, {
		installer: n.box.checked,
		sampling: s
	})), !0;
}
//#endregion
//#region src/app/dev-source.ts
var yx = /* @__PURE__ */ dn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), bx = 1500, xx = null;
async function Sx() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await S(`${n}/`, { cache: "no-store" })).json();
		if (yx.status = "online", yx.error = e.ok === !1 ? "build failed" : "", yx.at = Date.now(), !e.hash || e.hash === yx.hash) return;
		let t = gp(await (await S(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		yx.presetId && yx.presetId !== t.id && wp(null, yx.presetId), wp(t), yx.presetId = t.id, yx.hash = t.hash, Um(t), await ah(t), gx(t, { auto: !0 }), og("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		yx.status = "error", yx.error = e instanceof Error ? e.message : String(e);
	}
}
function Cx() {
	if (xx && clearTimeout(xx), xx = null, !q().dev.enabled) return yx.presetId && wp(null, yx.presetId), Object.assign(yx, {
		status: "off",
		presetId: "",
		hash: "",
		error: ""
	}), Promise.resolve();
	yx.status === "off" && (yx.status = "connecting");
	let e = async () => {
		await Sx(), q().dev.enabled && (xx = setTimeout(e, bx));
	};
	return e();
}
function wx() {
	let e = Promise.resolve();
	return hr(() => [q().dev.enabled, q().dev.url], () => {
		yx.hash = "", e = Cx();
	}, { immediate: !0 }), e;
}
//#endregion
//#region src/app/impersonate.ts
var Tx = "#option_impersonate, #mes_impersonate", Ex = () => document.querySelector("#send_textarea");
function Dx(e, t = !1, n) {
	let r = Ex();
	r && (r.value = n === void 0 ? e : Ib(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function Ox() {
	if (!q().enabled) return null;
	let t = eh(), n = t ? xp(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Nm(n);
	if (!hh(r)) return null;
	let i = Hs(n.meta.impersonatePrompt, (e) => e[0] === "name" ? cd(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function kx(e) {
	if (!e.target?.closest?.(Tx)) return;
	let t = Ox();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = Ex()?.value.trim();
	Dx(Ib(n ? `${t}\n${n}` : t), !0);
}
function Ax() {
	window.addEventListener("click", kx, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function jx(e) {
	let t = bl(e);
	if (!t) return !1;
	let n = q().presets[e.id]?.customUi, r = vp(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function Mx(e) {
	let t = q().presets[e.id]?.customUi;
	return !!(t && t.hash === bl(e));
}
function Nx(e, t) {
	Am(e).customUi = {
		enabled: t,
		hash: bl(e)
	}, J();
}
//#endregion
//#region src/app/trust.ts
var Px = class extends Error {
	constructor() {
		super(X("trust.declined")), this.name = "TrustDeclined";
	}
}, Fx = (e) => e instanceof Px, Ix = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function Lx(e, t, n, r) {
	return [
		`<h3>${v(e)}</h3>`,
		`<p>${v(X("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${v(X("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(r)}</pre>`
	].join("");
}
var Rx = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function zx(e, t) {
	let n = cu(e);
	if (!n.length || t && Ix(n, cu(t))) return;
	let r = Mp(e);
	if (!await y(Lx(X("trust.presetTitle"), X("trust.preset", { name: r }), n.length, Rx(n)), X("trust.install"), X("common.cancel"))) throw new Px();
}
async function Bx(e, t) {
	let n = fp(e);
	if (!(!n.length || t && Ix(n, fp(t))) && !await y([
		`<h3>${v(X("trust.qrTitle"))}</h3>`,
		`<p>${v(X("trust.qrBody", {
			name: Mp(e),
			n: n.length
		}))}</p>`,
		`<p>${v(X("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(Rx(n))}</pre>`
	].join(""), X("trust.install"), X("common.cancel"))) throw new Px();
}
async function Vx(e) {
	let t = xf(e);
	if (t.length && !await y(Lx(X("trust.modulesTitle"), X("trust.modules", { n: e.length }), t.length, Rx(t)), X("trust.import"), X("common.cancel"))) throw new Px();
}
async function Hx(e) {
	let t = vl(e);
	if (!t.length) return !1;
	let n = t.map((t) => jp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(X("common.listSeparator")), r = await y([
		`<h3>${v(X("trust.uiTitle"))}</h3>`,
		`<p>${v(X("trust.uiBody", {
			name: Mp(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${v(X("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(Rx(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), X("trust.enableUi"), X("trust.notNow"));
	return Nx(e, r), r;
}
async function Ux(e) {
	vl(e).length && !Mx(e) && await Hx(e);
}
//#endregion
//#region src/app/install.ts
var Wx = class extends Error {
	constructor(e) {
		super(X("presets.apUpdating", { name: Mp(e) })), this.name = "ApUpdating";
	}
}, Gx = (e) => e instanceof Wx;
function Kx(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
var qx = "advancedPreset.pendingInstall";
function Jx(e, t) {
	try {
		sessionStorage.setItem(qx, JSON.stringify({
			artifact: e,
			...t ? { source: t } : {}
		}));
	} catch (e) {
		console.warn("[AP] could not keep the preset for after the update", e);
	}
}
async function Yx(e, t) {
	let n = gp(e);
	if (!n) throw Error(X("presets.invalid"));
	if (n.minAdvancedPreset && uu("1.11.2", n.minAdvancedPreset) < 0) throw await Ob(n.minAdvancedPreset, Mp(n)) ? (Jx(n, t), new Wx(n)) : Error(X("presets.tooNew", { version: n.minAdvancedPreset }));
	await zx(n, xp(n.id)), await Bx(n, xp(n.id)), Sp(n), t && (q().sources[n.id] = t), q().declinedUpdates?.[n.id] && delete q().declinedUpdates[n.id], J();
	let r = xp(n.id) ?? n;
	return Um(r), vp(r.id)?.source === "installed" && await Ux(r), await ah(r), await gx(r), r;
}
async function Xx(e) {
	let t = await S(Kx(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return t.json();
}
async function Zx(e, t = !0) {
	return Yx(await Xx(e), t ? e.trim() : void 0);
}
async function Qx(e) {
	return Yx(JSON.parse(await e.text()));
}
function $x(e) {
	if (vp(e)?.source !== "installed") return;
	let t = q().sources[e];
	if (t) return {
		url: t,
		remembered: !0
	};
	let n = xp(e)?.updateUrl;
	return kd(n) ? {
		url: n.trim(),
		remembered: !1
	} : void 0;
}
async function eS(e) {
	let t = $x(e);
	if (!t) throw Error(X("presets.noSource"));
	return Zx(t.url, t.remembered);
}
async function tS() {
	for (let { preset: e } of _p()) {
		let t = $x(e.id);
		if (!t) continue;
		let n;
		try {
			n = gp(await Xx(t.url));
		} catch (n) {
			console.warn("[AP] preset update check failed", e.id, t.url, n);
			continue;
		}
		if (!n || n.id !== e.id) console.warn("[AP] the update source does not hold this preset", e.id, t.url);
		else if (!(uu(n.version, e.version) <= 0 || q().declinedUpdates?.[n.id] === n.hash)) try {
			let e = await Yx(n, t.remembered ? t.url : void 0);
			x("success", X("presets.autoUpdated", { version: e.version }), Mp(e));
		} catch (t) {
			if (Gx(t)) return;
			Fx(t) ? (q().declinedUpdates = {
				...q().declinedUpdates,
				[n.id]: n.hash
			}, J(), x("info", t.message, Mp(n))) : console.warn("[AP] preset update failed", e.id, t);
		}
	}
}
async function nS() {
	let e = sessionStorage.getItem(qx);
	if (!e) return;
	sessionStorage.removeItem(qx);
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	try {
		let e = await Yx(t.artifact, t.source);
		x("success", X("presets.installed"), Mp(e));
	} catch (e) {
		if (Gx(e)) return;
		Fx(e) ? x("info", e.message, X("app.name")) : x("error", e instanceof Error ? e.message : String(e), X("app.name"));
	}
}
function rS() {
	let e = [];
	for (let [t, n] of Object.entries(q().installed)) {
		let r = Ep(t), i = gp(n);
		!r || !i || uu(r.version, i.version) <= 0 || (Cp(t), delete q().sources[t], q().declinedUpdates?.[t] && delete q().declinedUpdates[t], e.push(r));
	}
	return e;
}
async function iS(t) {
	if (Cp(t), delete q().sources[t], q().declinedUpdates?.[t] && delete q().declinedUpdates[t], J(), Tp(t)) {
		let e = xp(t);
		e && (Um(e), await ah(e), await gx(e));
		return;
	}
	let n = rh(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/state.ts
var Z = /* @__PURE__ */ dn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), aS = () => {
	Z.chatRev++;
}, oS = () => {
	Z.presetId = eh();
}, sS = K(() => Z.presetId ? xp(Z.presetId) : void 0), cS = K(() => {
	let e = sS.value;
	if (!e) return { config: "" };
	let t = Am(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : jp(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function lS(t) {
	return Z.chatRev, e().chat[t];
}
function uS(e) {
	return am(lS(e));
}
function dS(e) {
	Z.storylineFocus = e, fS("storylines");
}
function fS(e) {
	e && (Z.tab = e), Z.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var pS = "openai_preset_import_file", mS = "export_oai_preset";
function hS(e) {
	let t = Fd(e);
	return typeof t == "object" && !!t && typeof t.id == "string" && Array.isArray(t.entries);
}
var gS = /* @__PURE__ */ new WeakSet();
async function _S(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (hS(n)) {
		e.value = "";
		try {
			let e = await Yx(n);
			await ch(e), oS(), x("success", X("presets.installed"), Mp(e)), fS("presets");
		} catch (e) {
			Fx(e) || Gx(e) ? x("info", e.message, X("app.name")) : x("error", e instanceof Error ? e.message : String(e), X("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		gS.add(t), e.dispatchEvent(t);
	}
}
function vS() {
	let e = eh(), t = e ? xp(e) : void 0;
	return t ? (vx(t).catch((e) => x("error", e instanceof Error ? e.message : String(e), X("app.name"))), !0) : !1;
}
function yS() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== pS || gS.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), _S(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${mS}`) && vS() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/app/preset-files.ts
var bS = () => e().getPresetManager("openai");
function xS() {
	let e = bS()?.getPresetList();
	return e ? Object.entries(e.preset_names).flatMap(([t, n]) => {
		let r = Pd(e.presets[n]);
		return r ? [{
			name: t,
			artifact: r.artifact
		}] : [];
	}) : [];
}
async function SS(e, t) {
	let n = Yd(t);
	if (!n) {
		console.warn("[AP] preset file in an unsupported format", e);
		return;
	}
	if (n.minAdvancedPreset && uu("1.11.2", n.minAdvancedPreset) < 0) {
		await Ob(n.minAdvancedPreset, Mp(n)) || console.warn("[AP] preset file needs a newer Advanced Preset", e, n.minAdvancedPreset);
		return;
	}
	let r = q().declinedPresetFiles ?? {};
	if (r[e] === n.hash) return;
	let i = xp(n.id);
	if (!i || i.hash !== n.hash && uu(n.version, i.version) >= 0) try {
		await Yx(n);
	} catch (t) {
		Fx(t) ? (q().declinedPresetFiles = {
			...r,
			[e]: n.hash
		}, J(), x("info", t.message, Mp(n))) : x("error", t instanceof Error ? t.message : String(t), e);
		return;
	}
	let a = xp(n.id), o = bS();
	if (!a || !o) return;
	let s = await ah(a, { select: o.getSelectedPresetName() === e });
	if (s !== e && await o.deletePreset(e), r[e]) {
		let { [e]: t, ...n } = r;
		q().declinedPresetFiles = n, J();
	}
	oS(), x("success", X("presetFile.adopted", {
		file: e,
		carrier: s
	}), Mp(a));
}
var CS = Promise.resolve();
function wS(e) {
	return CS = CS.then(async () => {
		for (let { name: t, artifact: n } of xS()) if (e === void 0 || t === e) try {
			await SS(t, n);
		} catch (e) {
			console.error("[AP] preset file adoption failed", t, e);
		}
	}), CS;
}
function TS() {
	let e = bS()?.getSelectedPresetName();
	e && xS().some((t) => t.name === e) && wS(e);
}
//#endregion
//#region src/app/quick-replies.ts
function ES(e) {
	let t = Nm(e), n = (n) => e.actors[n] ? cd(e, t, n) : void 0, r = Ap(e)?.quickReplySets;
	return (e.quickReplySets ?? []).map((e) => ({
		decl: e,
		st: up(e, n, r?.[e.id])
	}));
}
function DS(e) {
	let t = JSON.stringify(e), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function OS(e, t) {
	let n = e.getSetByName(t.name);
	if (n) {
		n.disableSend = t.disableSend, n.placeBeforeInput = t.placeBeforeInput, n.injectInput = t.injectInput, n.color = t.color, n.onlyBorderColor = t.onlyBorderColor;
		for (let e of n.qrList) e.unrender?.(), e.unrenderSettings?.();
		n.qrList.splice(0);
		for (let e of t.qrList) n.addQuickReply(Y(e));
		n.updateColor?.(), n.rerender?.(), n.save();
	}
}
var kS = /* @__PURE__ */ new Set();
async function AS(e, t, n) {
	let r = q().quickReplies ??= {}, i = (t) => e.listGlobalSets().includes(t), a = (t) => {
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
		let n = t.sets.filter(({ st: t }) => !e.getSetByName(t.name) || r[t.name] ? !0 : (kS.has(t.name) || (kS.add(t.name), x("warning", X("quickReplies.conflict", { name: t.name }), X("app.name"))), !1)), a = /* @__PURE__ */ new Set();
		for (let { st: t } of n) e.getSetByName(t.name) || (await e.createSet(t.name, {
			disableSend: t.disableSend,
			placeBeforeInput: t.placeBeforeInput,
			injectInput: t.injectInput
		}), a.add(t.name));
		for (let { st: i } of n) {
			let n = DS(i);
			(a.has(i.name) || r[i.name]?.hash !== n) && (OS(e, i), r[i.name] = {
				presetId: t.presetId,
				hash: n
			}, o = !0);
		}
		for (let { decl: t, st: r } of n) t.global && !i(r.name) && e.addGlobalSet(r.name, t.visible);
	}
	o && J();
}
function jS() {
	let e = K(() => {
		let e = q().enabled ? sS.value : void 0, t = e ? ES(e) : [], n = _p().map((e) => e.preset);
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
	hr(() => e.value.key, () => {
		let n = _();
		if (!n) return;
		let { active: r, known: i } = e.value;
		t = t.then(() => AS(n, r, i)).catch((e) => console.error("[AP] Quick Reply sync failed", e));
	}, { immediate: !0 });
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var MS = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", NS = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.switch.sm{width:1.8em;height:1.05em}.switch.sm .thumb{width:.75em;height:.75em;top:.15em;left:.15em}.switch.sm input:checked~.thumb{transform:translate(.75em)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", PS = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}.storyline-badge svg.lucide.storyline-hidden{color:var(--ap-muted)}", FS = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.tab span{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry>*,.um-entry-head>*{transition:opacity .15s}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>.switch{margin-right:6px}.um-entry.off .um-entry-head>:not(.switch),.um-entry.off>:not(.um-entry-head){opacity:.55}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text,.um-var-key,.um-var-value{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-text{field-sizing:content;min-height:5.5em;max-height:24em}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:auto 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row>.switch{margin:calc(.375em + 1px) 4px 0 0}.um-var-pair{padding:2px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:2px;display:flex}.um-var-pair-head{align-items:center;gap:2px;margin-right:-6px;display:flex}.um-var-key{text-overflow:ellipsis;flex:auto;min-width:0;font-weight:600}.um-var-row>*,.um-var-pair>*,.um-var-pair-head>*{transition:opacity .15s}.um-var-row.off>:not(.switch),.um-var-pair.off>:not(.um-var-pair-head),.um-var-pair.off .um-var-pair-head>:not(.switch){opacity:.55}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=420px){.tabs.many .tab span{display:none}.tabs.many .tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tabs.many .tab svg.lucide{width:1.35em;height:1.35em}}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:calc(2.51429em + 8px)}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storylines-head{gap:var(--ap-space-2);min-height:1.6em;padding:0 var(--ap-space-1) 0 var(--ap-space-3)}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-card.hidden .card-title{color:var(--ap-muted)}.storyline-dot{background:var(--ap-primary);border-radius:50%;flex:none;width:.5em;height:.5em}.storyline-flag{width:1.05em;height:1.05em;color:var(--ap-faint);flex:none}.storyline-toolbar{margin-bottom:var(--ap-space-1);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);align-self:flex-start;align-items:center;gap:2px;padding:2px;display:flex}.storyline-toolbar .icon-btn[aria-pressed=true]{background:var(--ap-tint)}.storyline-toolbar.solo{padding:0}.storyline-toolbar.solo .icon-btn.sm{width:calc(1.6em - 2px);height:calc(1.6em - 2px)}.storyline-toolbar-sep{background:var(--ap-border);align-self:stretch;width:1px;margin:3px 2px}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", IS = /* @__PURE__ */ dn({ mode: "light" }), LS = new CSSStyleSheet();
LS.replaceSync([
	MS,
	NS,
	PS,
	FS
].join("\n"));
var RS = new CSSStyleSheet(), zS = [LS, RS], BS = [
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
function VS(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of BS) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function HS(e) {
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
function US() {
	let e = HS(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var WS = /* @__PURE__ */ new Set();
function GS(e) {
	return WS.add(e), e.dataset.apTheme = IS.mode, () => WS.delete(e);
}
function KS() {
	let e = US();
	if (e !== IS.mode) {
		IS.mode = e;
		for (let t of WS) t.dataset.apTheme = e;
	}
}
function qS() {
	IS.mode = US();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(KS);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), pr(() => {
		let e = sS.value?.theme?.[IS.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(VS(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(VS("primary", t.primary)), t.accent && n.push(VS("accent", t.accent)), RS.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function JS(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function YS(e, t, n = []) {
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
			e.adoptedStyleSheets = zS, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = GS(this), this.app = bs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var XS = 6, ZS = 8;
function QS(e, t, n, r = "center", i = !1) {
	let a = e.top - XS - t.height >= ZS, o = e.bottom + XS + t.height <= n.height - ZS, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - XS - t.height : e.bottom + XS;
	c = Math.max(ZS, Math.min(c, n.height - ZS - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(ZS, Math.min(l, n.width - ZS - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function $S(e, t) {
	let n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = QS(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return hr(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Jn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Yr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var eC = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), tC = /* @__PURE__ */ new Set([
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
]), nC = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function rC(e) {
	return nC(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function iC(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${rC(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${rC(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${rC(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function aC(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = aC(e, t);
			n && i.appendChild(n);
		}
	};
	if (!eC.has(r) && !tC.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = aC(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function oC(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return iC(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", iC(e.textContent));
			continue;
		}
		let t = aC(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function sC(e, t, n, r) {
	return e && Ap(e)?.workflows?.[t]?.stages?.[n] || r;
}
function cC(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return JS(e?.actors[t]?.color, n);
}
function lC(e) {
	return K(() => {
		let t = e(), n = uS(t), r = ob(t, lS(t));
		if (r && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = xp(r.presetId);
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
					label: sC(e, r.workflow, t.id, t.label),
					color: cC(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = xp(n.presetId);
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
				label: sC(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: cC(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var uC = /* @__PURE__ */ dn({
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
}), dC, fC, pC = null;
function mC(t) {
	let n = xp(am(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = cd(n, Nm(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: cC(n, n.narrator)
	};
}
function hC(e, t) {
	clearTimeout(dC), clearTimeout(fC), fC = void 0, pC = null, uC.key !== e.key && Object.assign(uC, mC(e.mesId), { html: oC(e.ann.comment) }), Object.assign(uC, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), uC.rev++;
}
function gC() {
	clearTimeout(dC), clearTimeout(fC), fC = void 0, pC = null, uC.open && (uC.open = !1, uC.pinned = !1, uC.key = null);
}
function _C(e) {
	if (!uC.pinned) {
		if (e) {
			if (uC.open && uC.key === e.key) {
				clearTimeout(fC), fC = void 0;
				return;
			}
			if (pC === e.key) return;
			clearTimeout(dC), pC = e.key, dC = setTimeout(() => hC(e, !1), 150);
		} else clearTimeout(dC), pC = null, bC();
	}
}
function vC(e) {
	e && !(uC.open && uC.key === e.key) ? hC(e, !0) : gC();
}
function yC() {
	clearTimeout(fC), fC = void 0;
}
function bC() {
	!uC.open || uC.pinned || fC || (fC = setTimeout(gC, 200));
}
function xC(e) {
	uC.key && e.has(uC.key) && gC(), pC && e.has(pC) && (clearTimeout(dC), pC = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var SC = {
	key: 0,
	class: "anno-author"
}, CC = ["innerHTML"], wC = /* @__PURE__ */ I({
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
			let r = e.getBoundingClientRect(), i = uC.rect, a = QS(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return hr(() => uC.open && uC.rev, async (e) => {
			if (!e) return;
			await Jn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Yr(() => {
			uC.open = !1;
		}), (e, n) => P(uC).open ? (z(), B("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Fe({ "--actor": P(uC).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => P(yC) && P(yC)(...e),
			onMouseleave: n[1] ||= (...e) => P(bC) && P(bC)(...e)
		}, [P(uC).author ? (z(), B("div", SC, j(P(uC).author), 1)) : G("", !0), H("div", {
			class: "rich anno-text",
			innerHTML: P(uC).html
		}, null, 8, CC)], 36)) : G("", !0);
	}
}), TC = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, EC = /\s/, DC = /[“”„‟〝〞＂「」]/, OC = /[‘’‚‛『』＇]/;
function kC(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!TC.test(i)) {
			if (EC.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else DC.test(i) ? i = "\"" : OC.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var AC = (e) => kC(e).text;
function jC(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function MC(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function NC(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function PC(e, t, n, r = kC(e)) {
	let i = AC(n.quote).trim();
	if (!i) return null;
	let a = jC(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = AC(n.prefix), s = AC(n.suffix), c = 0, l = a.map((t) => {
			let n = MC(e, r.text.slice(Math.max(0, t - e.length), t)) + NC(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = jC(AC(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function FC(e, t, n = !1) {
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
var IC = /* @__PURE__ */ new Set([
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
function LC(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (IC.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = LC(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function RC(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? IC.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && LC(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function zC(e, t, n) {
	let r = RC(e), i = r.map((e) => e.data), a = i.join(""), o = kC(a), s = [];
	for (let e of n) {
		let n = PC(a, t, e, o);
		n && s.push({
			ann: e,
			start: FC(i, n[0]),
			end: FC(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function BC(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var VC = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function HC(e, t) {
	let n = [...e.located].sort((e, t) => VC(e.start, t.start) ? 1 : VC(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && VC(r, i.end))) {
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
function UC(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var WC = "ap-anno", GC = "ap-anno-style", KC = /* @__PURE__ */ new Map(), qC = 0, JC = "#a855f7", YC = () => null;
function XC(e) {
	YC = e;
}
function ZC() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${JC}; }
::highlight(${WC}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function QC(e) {
	let t = e.getElementById(GC);
	t || (t = e.createElement("style"), t.id = GC, (e.head ?? e.documentElement).append(t)), t.textContent !== ZC() && (t.textContent = ZC());
}
function $C(e) {
	if (e !== JC) {
		JC = e;
		for (let e of ow()) QC(e.doc);
	}
}
function ew(e, t) {
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
var tw = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function nw(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => tw(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: ew(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (tw(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: ew(n, e.doc)
			};
		}
	}
	return null;
}
function rw(e) {
	let t = YC();
	return !!(t && e.composedPath().includes(t));
}
function iw(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !rw(r) && _C(nw(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (rw(t)) return;
		let n = nw(e, t);
		i === "mouse" ? n || gC() : vC(n);
	}, c = (e) => {
		rw(e) || gC();
	}, l = () => _C(null);
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
function aw(e) {
	let t = KC.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(WC) ?? new i(), r.set(WC, a)), QC(e), t = {
		doc: e,
		serial: ++qC,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = iw(t), KC.set(e, t), t;
}
function ow() {
	for (let [e, t] of KC) e.defaultView || (t.detach(), KC.delete(e));
	return [...KC.values()];
}
function sw(e) {
	aw(e);
}
function cw(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function lw(e, t, n, r, i) {
	let a = uw(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = aw(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = BC(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			HC(r, (t, r) => {
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
	a.size && xC(a);
}
function uw(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [KC.get(t)].filter((e) => !!e) : ow()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && UC(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), KC.delete(i.doc));
		}
	}
	return r;
}
function dw(e, t) {
	let n = uw(e, t);
	n.size && xC(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var fw = /* @__PURE__ */ new Set();
function pw(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var mw = () => q().ui.annotations?.show !== !1, hw = class {
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
		}), fw.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && dw(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && dw(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			dw(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = nb.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && mw() ? Yb(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		lw(this, document, t, a.length ? zC(this.el, o, a) : null, !cw(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (lw(this, n, t, a.length && !pw(n) ? zC(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), dw(this), fw.delete(this);
		}
	}
};
function gw(e, t) {
	for (let n of fw) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function _w() {
	for (let e of fw) e.hasFrames && e.schedule(0);
}
function vw() {
	for (let e of fw) e.el.isConnected || e.dispose();
}
var yw = /* @__PURE__ */ new WeakMap();
function bw(e) {
	let t = yw.get(e);
	(!t || t.disposed) && yw.set(e, new hw(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var xw = () => window.__TAURITAVERN__?.api?.chatSurface, Sw = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return xw()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), Cw = !1;
function ww() {
	let t = xw();
	!Cw && t && Sw() && (t.protocolVersion === 1 ? (Cw = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new hw(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function Tw(e, t) {
	t && !Sw() && bw(e);
}
var Ew = null;
function Dw() {
	return (!Ew || !Ew.isConnected) && (Ew = document.createElement("ap-anno-bubble"), document.body.append(Ew)), Ew;
}
function Ow() {
	YS("ap-anno-bubble", wC), Dw(), XC(() => Ew), sw(document), pr(() => {
		let e = q().ui, t = sS.value?.theme?.[IS.mode]?.accent;
		$C(e.annotations?.color || e.accent || t || (IS.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), hr(mw, () => {
		gC(), gw(void 0, 0);
	}), hr(() => nb.current?.status, () => gw()), Qb.on("change", (e) => gw(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		gC(), vw();
	});
	t.on("message_iframe_render_ended", () => _w()), addEventListener("resize", () => gC());
}
//#endregion
//#region src/ui/storylines.ts
var kw = K(() => {
	Z.chatRev;
	let e = sS.value;
	return !!(e && w_(e, Nm(e)));
}), Aw = null;
function jw() {
	let t = e().chat ?? [];
	return (!Aw || Aw.rev !== Z.chatRev || Aw.chat !== t || Aw.len !== t.length) && (Aw = {
		rev: Z.chatRev,
		chat: t,
		len: t.length,
		keys: D_(t)
	}), Aw.keys;
}
var Mw = () => {
	Aw = null;
}, Nw = 60, Pw = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > Nw ? `${t.slice(0, Nw)}…` : t;
};
function Fw(t) {
	Z.chatRev;
	let n = e().chat ?? [], r = jw(), i = T_(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? am(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: Pw(s?.event || Yp(o))
			});
		}), {
			key: e,
			name: Wp(e, i),
			main: e === "",
			if: Hp(e, i),
			hidden: Up(e, i),
			pending: Rp(e),
			current: e === o,
			floors: a
		};
	}).filter((e) => e.main || e.floors.length);
}
async function Iw(t) {
	let n = e(), r = document.querySelector(`#chat > .mes[mesid="${t}"]`);
	r ? r.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}) : n.executeSlashCommandsWithOptions && await n.executeSlashCommandsWithOptions(`/chat-jump ${t}`, { handleExecutionErrors: !0 });
}
//#endregion
//#region src/ui/storyline-tag.ts
var Lw = "data-ap-storyline-tag", Rw = "ap-storyline-tag-hidden";
function zw(e, t, n) {
	let r = e.querySelectorAll(`[${Lw}]`);
	if (r.length) {
		for (let e of r) e.classList.toggle(Rw, n);
		return;
	}
	if (!n || !t?.is_user) return;
	let i = Ju(t.mes);
	if (!i) return;
	let a = t.mes.slice(i.at).trim(), o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = null;
	for (; o.nextNode();) o.currentNode.textContent?.trim() && (s = o.currentNode);
	if (!s) return;
	let c = s.parentElement, l = s.textContent ?? "", u = a.slice(1);
	if (c && c !== e && /^H[1-6]$/.test(c.tagName) && c.textContent?.trim() === u) {
		c.setAttribute(Lw, ""), c.classList.add(Rw);
		return;
	}
	let d = l.trimEnd();
	if (!d.endsWith(a)) return;
	let f = d.length - a.length, p = s.splitText(f), m = document.createElement("span");
	m.setAttribute(Lw, ""), m.className = Rw, p.replaceWith(m), m.append(p);
}
//#endregion
//#region src/ui/mounts.ts
var Bw = "ap-hidden", Vw = [
	"meta-pure",
	"impersonate",
	"summary"
];
function Hw(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function Uw(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = am(a), s = !!ob(n, a);
	a && !a.is_user && Tw(i, !!(o?.annotations?.length || s));
	let c = kw.value;
	zw(i, a, c);
	let l = !(!a || a.is_user || !o && !s), u = r.querySelector(":scope > ap-stages"), d = r.querySelector(":scope > ap-top-cards"), f = r.querySelector(":scope > ap-cards");
	l ? ((!d || d.nextElementSibling !== i) && (d?.remove(), d = Hw("ap-top-cards", n), d.setAttribute("position", "top"), i.before(d)), (!u || u.nextElementSibling !== d) && (u?.remove(), u = Hw("ap-stages", n), d.before(u)), (!f || f.previousElementSibling !== i) && (f?.remove(), f = Hw("ap-cards", n), i.after(f)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), f.getAttribute("mesid") !== String(n) && f.setAttribute("mesid", String(n)), i.classList.toggle(Bw, !!(!s && o && Vw.includes(o.turn))), Ww(r, i, n, c)) : (u?.remove(), d?.remove(), f?.remove(), i.classList.remove(Bw), Ww(r, i, n, c));
}
function Ww(e, t, n, r) {
	let i = e.querySelector(":scope > ap-storyline");
	if (!r || !jw()[n]) {
		i?.remove();
		return;
	}
	let a = e.querySelector(":scope > ap-stages") ?? e.querySelector(":scope > ap-top-cards") ?? t;
	i ||= Hw("ap-storyline", n), i.nextElementSibling !== a && a.before(i), i.getAttribute("mesid") !== String(n) && i.setAttribute("mesid", String(n));
}
function Gw(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) Uw(t);
}
function Kw() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var qw = 0, Jw = /* @__PURE__ */ new Set(), Yw = !1;
function Xw(e) {
	e ? Jw.add(e) : Yw = !0, !qw && (qw = requestAnimationFrame(() => {
		if (qw = 0, Mw(), Yw) Gw();
		else for (let e of Jw) e.isConnected && Uw(e);
		Jw.clear(), Yw = !1, Kw(), vw();
	}));
}
function Zw() {
	aS(), Xw();
}
function Qw() {
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
	]) e && t.on(e, Zw);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Xw(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Xw(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Xw();
	};
	r(), hr(() => kw.value, () => Zw());
	let i;
	hr(() => nb.current && nb.current.status === "running" && nb.current.streaming && nb.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = nb.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (ab(t, n), clearInterval(i), Zw());
		}, 100));
	}), hr(() => nb.current?.status, () => Xw());
}
//#endregion
//#region src/ui/entry.ts
var $w = "left-nav-panel", eT = "ap-preset-banner";
function tT() {
	return document.getElementById($w);
}
function nT() {
	let e = tT();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function rT() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== eT && e.after(document.createElement(eT));
}
var iT = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function aT() {
	hr(() => Z.presetId, (e) => {
		for (let t of document.querySelectorAll(iT.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function oT(e) {
	let t = tT();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function sT() {
	let e = tT();
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
function cT() {
	rT(), aT(), sT(), hr(() => Z.panelOpen, (e) => {
		e && nT();
	});
	let e = tT();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Z.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var lT = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, uT = (e) => e === "", dT = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), fT = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), pT = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), mT = (e) => {
	let t = pT(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, hT = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, gT = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = hT.width, color: s = hT.stroke, ...c }, { slots: l }) => Ga("svg", {
	...hT,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": uT(n) || uT(r) || n === !0 || r === !0 ? Number(i || a || hT["stroke-width"]) * 24 / Number(o) : i || a || hT["stroke-width"],
	class: dT("lucide", c.class, ...e ? [`lucide-${fT(mT(e))}-icon`, `lucide-${fT(e)}`] : ["lucide-icon"]),
	...!l.default && !lT(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Ga(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Ga(gT, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), _T = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), vT = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), yT = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), bT = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), xT = Q("brain", [
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
]), ST = Q("bug", [
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
]), CT = Q("cable", [
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
]), wT = Q("calendar-days", [
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
]), TT = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), ET = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), DT = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), OT = Q("circle-dashed", [
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
]), kT = Q("circle-question-mark", [
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
]), AT = Q("circle-slash", [["circle", {
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
}]]), jT = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), MT = Q("cloud-fog", [
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
]), NT = Q("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), PT = Q("cloud-rain", [
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
]), FT = Q("cloud-sun", [
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
]), IT = Q("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), LT = Q("code-xml", [
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
]), RT = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), zT = Q("coins", [
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
]), BT = Q("copy-plus", [
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
]), VT = Q("copy", [["rect", {
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
}]]), HT = Q("crown", [["path", {
	d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
	key: "1vdc57"
}], ["path", {
	d: "M5 21h14",
	key: "11awu3"
}]]), UT = Q("database-zap", [
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
]), WT = Q("download", [
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
]), GT = Q("drama", [
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
]), KT = Q("eye-off", [
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
]), qT = Q("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), JT = Q("feather", [
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
]), YT = Q("file-down", [
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
]), XT = Q("file-plus", [
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
]), ZT = Q("file-stack", [
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
]), QT = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), $T = Q("git-branch", [
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
]), eE = Q("git-compare-arrows", [
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
]), tE = Q("globe", [
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
]), nE = Q("grip-vertical", [
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
]), rE = Q("info", [
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
]), iE = Q("layers", [
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
]), aE = Q("layout-template", [
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
]), oE = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), sE = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), cE = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), lE = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), uE = Q("message-square-dashed", [
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
]), dE = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), fE = Q("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), pE = Q("notebook-pen", [
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
]), mE = Q("package", [
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
]), hE = Q("palette", [
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
]), gE = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), _E = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), vE = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), yE = Q("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), bE = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), xE = Q("refresh-cw", [
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
]), SE = Q("regex", [
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
]), CE = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), wE = Q("save", [
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
]), TE = Q("scroll-text", [
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
]), EE = Q("server", [
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
]), DE = Q("shapes", [
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
]), OE = Q("sliders-horizontal", [
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
]), kE = Q("sliders-vertical", [
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
]), AE = Q("snowflake", [
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
]), jE = Q("split", [
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
]), ME = Q("sun", [
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
]), NE = Q("text-cursor-input", [
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
]), PE = Q("trash-2", [
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
]), FE = Q("triangle-alert", [
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
]), IE = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), LE = Q("upload", [
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
]), RE = Q("user-pen", [
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
]), zE = Q("wind", [
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
]), BE = Q("workflow", [
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
]), VE = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), HE = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), UE = /* @__PURE__ */ I({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = $S(n, () => t);
		return (t, a) => (z(), B("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [ni(t.$slots, "default"), P(r) && e.text ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544));
	}
}), WE = [
	"disabled",
	"aria-label",
	"aria-pressed"
], $ = /* @__PURE__ */ I({
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
		return (t, n) => (z(), V(UE, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: F(() => [H("button", {
				type: "button",
				class: A(["icon-btn", {
					active: e.active || e.pressed,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				"aria-pressed": e.pressed === void 0 ? void 0 : e.pressed,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(z(), V(Qr(e.icon)))], 10, WE)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), GE = {
	key: 0,
	class: "patches"
}, KE = { class: "patch-old pre" }, qE = { class: "patch-new pre" }, JE = {
	key: 0,
	class: "patch-status xs"
}, YE = {
	key: 2,
	class: "faint small stage-empty"
}, XE = /* @__PURE__ */ I({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null);
		hr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Jn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (z(), B("div", {
			class: "stage-body",
			style: Fe({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (z(), B("div", GE, [(z(!0), B(R, null, L(e.stage.patches, (e, t) => (z(), B("div", {
			key: t,
			class: A(["patch", { failed: r(e.status) }])
		}, [
			H("div", KE, j(e.old_string), 1),
			U(P(_T), { class: "patch-arrow" }),
			H("div", qE, j(e.new_string), 1),
			r(e.status) ? (z(), B("div", JE, [U(P(yT)), W(j(P(X)(`patch.${e.status}`)), 1)])) : G("", !0)
		], 2))), 128))])) : e.stage.text ? (z(), B("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, j(e.stage.text), 513)) : (z(), B("div", YE, j(P(X)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function ZE(t) {
	let n = e().chat[t], r = am(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), r.speechVersions && (a.speech = i ? r.speechVersions.patched : r.speechVersions.draft), sm(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), aS();
}
async function QE(t, n, r) {
	let i = e().chat[t], a = am(i);
	return !i || !a ? !1 : (sm(t, om(a, n, r)), aS(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var $E = { class: "stage-bar" }, eD = ["onClick"], tD = { class: "ellipsis" }, nD = {
	key: 0,
	class: "chip stage-chip error"
}, rD = { class: "ellipsis" }, iD = { class: "badge warn" }, aD = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, oD = /* @__PURE__ */ I({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = lC(() => t.mesid), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = K(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = K(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = K(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = K(() => o.value.find((e) => e.id === s.value) ?? null);
		hr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: pE,
			content: JT,
			patch: eE
		}, d = (e) => e.status === "streaming" ? sE : e.status === "interrupted" ? AT : e.status === "missing" ? OT : u[e.kind], f = K(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = K(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = K(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${X(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(X("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => P(n) && (o.value.length || P(n).error) ? (z(), B("div", {
			key: 0,
			class: A(["stages", { live: P(n).running }])
		}, [H("div", $E, [
			(z(!0), B(R, null, L(o.value, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				class: A(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Fe({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(z(), V(Qr(d(e)), { class: A({ spin: e.status === "streaming" }) }, null, 8, ["class"])), H("span", tD, j(e.label), 1)], 14, eD))), 128)),
			P(n).error ? (z(), B("span", nD, [U(P(FE)), H("span", rD, j(P(n).error), 1)])) : G("", !0),
			r[1] ||= H("span", { class: "grow" }, null, -1),
			f.value.length ? (z(), V(UE, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: F(() => [H("span", iD, [U(P(FE)), W(j(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : G("", !0),
			p.value ? (z(), V($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? P(IE) : P(bE),
				label: p.value.patchesApplied ? P(X)("stages.revertDraft") : P(X)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => P(ZE)(e.mesid)
			}, null, 8, ["icon", "label"])) : G("", !0),
			P(n).running ? G("", !0) : (z(), V(UE, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: F(() => [H("span", aD, [U(P(rE))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (z(), V(XE, {
			key: c.value.id,
			stage: c.value,
			follow: P(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : G("", !0)], 2)) : G("", !0);
	}
}), sD = {
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
function cD(e) {
	let t = sD[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function lD(e, t) {
	return e.flatMap((e, n) => {
		let r = cD(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var uD = { class: "reply-name xs" }, dD = ["innerHTML"], fD = /* @__PURE__ */ I({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = K(() => oC(t.text));
		return (t, r) => (z(), B("div", {
			class: "reply-card",
			style: Fe({ "--actor": e.color })
		}, [H("div", uD, j(e.name), 1), H("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, dD)], 4));
	}
}), pD = { class: "card mini-card" }, mD = { class: "card-head" }, hD = { class: "card-title" }, gD = { class: "card-body pre" }, _D = /* @__PURE__ */ I({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (z(), B("div", pD, [H("header", mD, [
			U(P(RE), { class: "section-icon" }),
			H("span", hD, j(P(X)("cards.impersonate")), 1),
			H("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => P(Dx)(e.text, !1, e.mesid)
			}, [U(P(NE)), W(j(P(X)("cards.fillInput")), 1)])
		]), H("div", gD, j(e.text), 1)]));
	}
}), vD = ["aria-label"], yD = ["title", "onClick"], bD = { class: "option-label" }, xD = { class: "option-content small muted" }, SD = /* @__PURE__ */ I({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => Dx(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
		return (t, r) => (z(), B("div", {
			class: "options-grid",
			role: "list",
			"aria-label": P(X)("cards.options")
		}, [(z(!0), B(R, null, L(e.options, (e, t) => (z(), B("button", {
			key: t,
			type: "button",
			role: "listitem",
			class: "option",
			title: P(X)("cards.optionHint"),
			onClick: (t) => n(e, t)
		}, [H("span", bD, j(e.label), 1), H("span", xD, j(e.content), 1)], 8, yD))), 128))], 8, vD));
	}
}), CD = {
	key: 0,
	class: "memory-ops"
}, wD = { class: "ellipsis" }, TD = ["aria-label", "onClick"], ED = /* @__PURE__ */ I({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = K(() => {
			let e = Am(t.preset), n = e.globalMemory.log;
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
					let r = fm(t), i = r ? pm(e, r) : -1, a = n[i];
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
			e.id !== void 0 && Em(Am(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (z(), B("div", CD, [(z(!0), B(R, null, L(n.value, (e, t) => (z(), V(UE, {
			key: t,
			text: e.op === "delete" ? P(X)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: F(() => [H("span", { class: A(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(z(), V(Qr(e.scope === "global" ? P(tE) : P(lE)), { class: "faint" })),
				H("span", wD, j(e.key), 1),
				(z(), V(Qr(e.op === "delete" ? P(PE) : P(_E)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": P(X)("common.undo"),
					onClick: (t) => r(e)
				}, [U(P(IE))], 8, TD)) : G("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : G("", !0);
	}
}), DD = ["aria-label"], OD = /* @__PURE__ */ I({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = $S(n, () => t);
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
			onClick: a[0] ||= ms((e) => r.value = !P(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [U(P(kT))], 40, DD), P(r) ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544)) : G("", !0);
	}
}), kD = { class: "card-title" }, AD = {
	key: 0,
	class: "card-body"
}, jD = /* @__PURE__ */ I({
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
		return (n, r) => (z(), B("section", { class: A(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [H("header", {
			class: A(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (z(), V(Qr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : G("", !0),
			H("span", kD, j(e.title), 1),
			U(OD, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			H("span", {
				class: "row",
				onClick: r[0] ||= ms(() => {}, ["stop"])
			}, [ni(n.$slots, "actions")]),
			e.collapsible ? (z(), V(P(ET), {
				key: 1,
				class: A(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : G("", !0)
		], 2), !e.collapsible || t.value ? (z(), B("div", AD, [ni(n.$slots, "default")])) : G("", !0)], 2));
	}
}), MD = {
	key: 0,
	class: "badge neutral"
}, ND = { class: "pre small" }, PD = /* @__PURE__ */ I({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (z(), V(jD, {
			title: P(X)("cards.recap"),
			icon: P(TE),
			collapsible: "",
			open: !1
		}, {
			actions: F(() => [e.coversUpTo === void 0 ? G("", !0) : (z(), B("span", MD, "#0–" + j(e.coversUpTo), 1))]),
			default: F(() => [H("div", ND, j(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), FD = { class: "synopsis-fields" }, ID = { class: "synopsis-field" }, LD = ["placeholder", "aria-label"], RD = { class: "synopsis-field" }, zD = ["placeholder", "aria-label"], BD = ["placeholder", "aria-label"], VD = ["placeholder", "aria-label"], HD = { class: "synopsis-actions" }, UD = { class: "xs faint grow synopsis-keys" }, WD = {
	type: "submit",
	class: "btn primary sm-btn"
}, GD = { class: "synopsis-head" }, KD = { class: "synopsis-line small" }, qD = {
	key: 0,
	class: "row tight"
}, JD = {
	key: 1,
	class: "row tight"
}, YD = { class: "synopsis-event ellipsis" }, XD = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, ZD = /* @__PURE__ */ I({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ dn({
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
			a.value = !0, await Jn(), f(), s.value?.focus();
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
			onSubmit: ms(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= ms(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= ms(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= ms(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= ms(() => {}, ["stop"])
		}, [
			H("div", FD, [H("label", ID, [U(P(jT), { class: "faint" }), cr(H("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.time"),
				"aria-label": P(X)("cards.synopsis.time")
			}, null, 8, LD), [[is, o.time]])]), H("label", RD, [U(P(cE), { class: "faint" }), cr(H("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.location"),
				"aria-label": P(X)("cards.synopsis.location")
			}, null, 8, zD), [[is, o.location]])])]),
			cr(H("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: P(X)("cards.synopsis.event"),
				"aria-label": P(X)("cards.synopsis.event")
			}, null, 8, BD), [[is, o.event]]),
			cr(H("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: P(X)("cards.synopsis.summary"),
				"aria-label": P(X)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, VD), [[is, o.summary]]),
			H("div", HD, [
				H("span", UD, j(P(X)("cards.synopsis.keys")), 1),
				H("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, j(P(X)("common.cancel")), 1),
				H("button", WD, [U(P(TT)), W(j(P(X)("common.save")), 1)])
			])
		], 32)) : (z(), B("div", {
			key: 1,
			class: A(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [H("div", GD, [H("div", KD, [
			e.synopsis.time ? (z(), B("span", qD, [U(P(jT), { class: "faint" }), W(j(e.synopsis.time), 1)])) : G("", !0),
			e.synopsis.location ? (z(), B("span", JD, [U(P(cE), { class: "faint" }), W(j(e.synopsis.location), 1)])) : G("", !0),
			H("span", YD, j(e.synopsis.event), 1)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= ms(() => {}, ["stop"])
		}, [U($, {
			icon: P(_E),
			label: P(X)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]), i.value && e.synopsis.summary ? (z(), B("div", XD, j(e.synopsis.summary), 1)) : G("", !0)], 2));
	}
}), QD = { class: "status-fields" }, $D = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], eO = { class: "synopsis-actions" }, tO = { class: "xs faint grow synopsis-keys" }, nO = {
	type: "submit",
	class: "btn primary sm-btn"
}, rO = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, iO = { class: "status-line" }, aO = {
	key: 0,
	class: "row tight"
}, oO = {
	key: 1,
	class: "row tight"
}, sO = {
	key: 2,
	class: "row tight status-location"
}, cO = { class: "ellipsis" }, lO = {
	key: 3,
	class: "row tight"
}, uO = /* @__PURE__ */ I({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ dn({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ N(), s = (e) => (n.status[e] ?? "").trim(), c = K(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, NT],
			[/雪|snow|sleet|blizzard/i, AE],
			[/雨|rain|drizzle|shower/i, PT],
			[/雾|霾|fog|mist|haze|smog/i, MT],
			[/风|wind|gale|breez/i, zE],
			[/阴|云|cloud|overcast/i, IT],
			[/夜|月|night|moon/i, fE],
			[/晴|sun|clear|fair/i, ME]
		], u = K(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? FT), d = () => Object.fromEntries(Pc.map((e) => [e, a[e].trim()])), f = K(() => Pc.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of Pc) a[e] = n.status[e] ?? "";
			i.value = !0, await Jn(), o.value?.querySelector("input")?.focus();
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
			date: wT,
			weekday: wT,
			time: jT,
			location: cE,
			weather: FT
		};
		return (t, n) => i.value ? (z(), B("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: ms(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= ms(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= ms(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= ms(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= ms(() => {}, ["stop"])
		}, [H("div", QD, [(z(!0), B(R, null, L(P(Pc), (e) => (z(), B("label", {
			key: e,
			class: "synopsis-field"
		}, [(z(), V(Qr(_[e]), { class: "faint" })), cr(H("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: P(X)(`cards.status.${e}`),
			"aria-label": P(X)(`cards.status.${e}`)
		}, null, 8, $D), [[is, a[e]]])]))), 128))]), H("div", eO, [
			H("span", tO, j(P(X)("cards.status.keys")), 1),
			H("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, j(P(X)("common.cancel")), 1),
			H("button", nO, [U(P(TT)), W(j(P(X)("common.save")), 1)])
		])], 544)) : (z(), B("div", rO, [H("div", iO, [
			c.value ? (z(), B("span", aO, [U(P(wT), { class: "faint" }), W(j(c.value), 1)])) : G("", !0),
			s("time") ? (z(), B("span", oO, [U(P(jT), { class: "faint" }), W(j(s("time")), 1)])) : G("", !0),
			s("location") ? (z(), B("span", sO, [U(P(cE), { class: "faint" }), H("span", cO, j(s("location")), 1)])) : G("", !0),
			s("weather") ? (z(), B("span", lO, [(z(), V(Qr(u.value), { class: "faint" })), W(j(s("weather")), 1)])) : G("", !0)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= ms(() => {}, ["stop"])
		}, [U($, {
			icon: P(_E),
			label: P(X)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]));
	}
}), dO = ["innerHTML"], fO = {
	key: 1,
	class: "kv-list small"
}, pO = { class: "pre" }, mO = /* @__PURE__ */ I({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = K(() => typeof t.value == "string" ? oC(t.value) : "");
		return (t, r) => (z(), V(jD, {
			title: e.title,
			icon: P(DE),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [typeof e.value == "string" ? (z(), B("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, dO)) : (z(), B("dl", fO, [(z(!0), B(R, null, L(e.value, (e, t) => (z(), B(R, { key: t }, [H("dt", null, j(t), 1), H("dd", pO, j(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), hO = /* @__PURE__ */ new Map();
function gO(e) {
	let t = hO.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => hO.delete(e)), hO.set(e, t);
	}
	return t;
}
function _O(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function vO(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var yO = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function bO(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = Gl(e.code, yO(r));
			t.replaceChildren(...[vO(e.style)].filter((e) => !!e));
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
	let i = _O(await gO(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[vO(e.style)].filter((e) => !!e)), a = await i(t, r);
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
var xO = { class: "structure-component" }, SO = ["data-structure"], CO = {
	key: 0,
	class: "xs"
}, wO = /* @__PURE__ */ I({
	__name: "ComponentCard",
	props: {
		component: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(""), i = null, a = Promise.resolve(), o = !0, s = (e) => {
			a = a.then(async () => {
				if (o) try {
					await e(), r.value = "";
				} catch (e) {
					r.value = e instanceof Error ? e.message : String(e), console.error("[Advanced Preset] structure component", t.component.id, e);
				}
			});
		};
		return qr(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await bO(t.component, r, t.context);
			});
		}), hr(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), hr(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await bO(e, r, t.context));
		})), Yr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (z(), B("div", xO, [H("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, SO), r.value ? (z(), B("div", CO, j(P(X)("cards.custom.error", { error: r.value })), 1)) : G("", !0)]));
	}
}), TO = /* @__PURE__ */ I({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = lC(() => t.mesid), r = K(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && nb.current?.genId === e.genId ? nb.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = jx(r), u = !(!i || e.live), d = Y(o);
			for (let { decl: n } of lD(s, t.position)) {
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
					case "custom": {
						if (n.display === "hidden" || a === void 0) break;
						let i = jp(r, "structures", n.id, "title", n.title || n.id), o = _l(n);
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
									name: Mp(r),
									version: r.version
								},
								lang: kp(),
								setValue: async (e) => u ? QE(f, s, e) : !1,
								fillInput: (e, t) => Dx(String(e ?? ""), !!t, f)
							}
						});
						break;
					}
				}
			}
			return {
				preset: r,
				editable: u,
				narrator: cd(r, Nm(r), r.narrator),
				color: cC(r, r.narrator),
				items: c
			};
		});
		return (t, n) => r.value?.items.length ? (z(), B("div", {
			key: 0,
			class: A(["cards", `cards-${e.position}`])
		}, [(z(!0), B(R, null, L(r.value.items, (t) => (z(), B(R, { key: t.id }, [t.type === "reply" ? (z(), V(fD, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (z(), V(_D, {
			key: 1,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (z(), V(SD, {
			key: 2,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (z(), V(ZD, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => P(QE)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (z(), V(uO, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => P(QE)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (z(), V(ED, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (z(), V(PD, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (z(), V(mO, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (z(), V(wO, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : G("", !0)], 64))), 128))], 2)) : G("", !0);
	}
}), EO = {
	key: 0,
	class: "dock stages live"
}, DO = { class: "stage-bar" }, OO = { class: "ellipsis" }, kO = {
	key: 0,
	class: "small muted"
}, AO = /* @__PURE__ */ I({
	__name: "Dock",
	setup(e) {
		let t = K(() => nb.current && !nb.current.streaming && nb.current.status === "running" ? nb.current : null), n = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = xp(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: sC(n, e.workflow, t.id, t.label),
				color: cC(n, t.actor)
			}));
		}), r = K(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (z(), B("div", EO, [H("div", DO, [
			U(P(sE), { class: "spin faint" }),
			(z(!0), B(R, null, L(n.value, (e) => (z(), B("span", {
				key: e.id,
				class: A(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Fe({ "--actor": e.color })
			}, [H("span", OO, j(e.label), 1)], 6))), 128)),
			n.value.length ? G("", !0) : (z(), B("span", kO, j(P(X)("stages.waiting")), 1))
		]), r.value ? (z(), V(XE, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : G("", !0)])) : G("", !0);
	}
}), jO = ["title"], MO = { class: "storyline-name" }, NO = {
	key: 0,
	class: "storyline-if"
}, PO = /* @__PURE__ */ I({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = K(() => {
			if (Z.chatRev, !kw.value) return null;
			let e = jw()[t.mesid];
			if (!e) return null;
			let n = T_();
			return {
				key: e,
				name: Wp(e, n) || X("storylines.unnamed"),
				if: Hp(e, n),
				hidden: Up(e, n)
			};
		});
		return (e, t) => n.value ? (z(), B("button", {
			key: 0,
			type: "button",
			class: A(["storyline-badge", { "if-line": n.value.if }]),
			title: P(X)("storylines.openTab"),
			onClick: t[0] ||= (e) => P(dS)(n.value.key)
		}, [
			U(P($T), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			H("span", MO, j(n.value.name), 1),
			n.value.if ? (z(), B("span", NO, j(P(X)("storylines.ifLine")), 1)) : G("", !0),
			n.value.hidden ? (z(), V(P(KT), {
				key: 1,
				class: "lucide storyline-hidden",
				"aria-label": P(X)("storylines.hidden")
			}, null, 8, ["aria-label"])) : G("", !0)
		], 10, jO)) : G("", !0);
	}
}), FO = ["aria-label"], IO = ["disabled"], LO = /* @__PURE__ */ I({
	__name: "Switch",
	props: /*@__PURE__*/ li({
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
		let t = mi(e, "modelValue");
		return (n, r) => (z(), B("label", {
			class: A(["switch", { sm: e.small }]),
			"aria-label": e.label
		}, [
			cr(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, IO), [[as, t.value]]),
			r[1] ||= H("span", { class: "track" }, null, -1),
			r[2] ||= H("span", { class: "thumb" }, null, -1)
		], 10, FO));
	}
}), RO = { class: "field-label" }, zO = { class: "ellipsis" }, BO = {
	key: 0,
	class: "dot modified"
}, VO = { class: "field-control" }, HO = /* @__PURE__ */ I({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (z(), B("div", { class: A(["field", { inline: e.inline }]) }, [H("div", RO, [
			H("span", zO, j(e.label), 1),
			e.modified ? (z(), B("span", BO)) : G("", !0),
			U(OD, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), H("div", VO, [ni(t.$slots, "default")])], 2));
	}
}), UO = { class: "swatches" }, WO = ["title"], GO = ["title"], KO = { class: "swatches" }, qO = ["title"], JO = /* @__PURE__ */ I({
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
		return (e, t) => (z(), V(jD, {
			title: P(X)("appearance.title"),
			icon: P(hE),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [
				U(HO, {
					label: P(X)("appearance.colors"),
					help: P(X)("appearance.colors.hint"),
					inline: ""
				}, {
					default: F(() => [H("div", UO, [
						H("label", {
							class: "swatch",
							style: Fe({ background: P(r) || "var(--ap-primary-500)" }),
							title: P(X)("appearance.primary")
						}, [cr(H("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ Sn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							is,
							P(r),
							void 0,
							{ lazy: !0 }
						]])], 12, WO),
						H("label", {
							class: "swatch",
							style: Fe({ background: P(i) || "var(--ap-accent-500)" }),
							title: P(X)("appearance.accent")
						}, [cr(H("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ Sn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							is,
							P(i),
							void 0,
							{ lazy: !0 }
						]])], 12, GO),
						U($, {
							icon: P(CE),
							label: P(X)("common.reset"),
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
				U(HO, {
					label: P(X)("appearance.collapseStages"),
					inline: ""
				}, {
					default: F(() => [U(LO, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				U(HO, {
					label: P(X)("appearance.annotations"),
					help: P(X)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: F(() => [U(LO, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (z(), V(HO, {
					key: 0,
					label: P(X)("appearance.annotationColor"),
					inline: ""
				}, {
					default: F(() => [H("div", KO, [H("label", {
						class: "swatch",
						style: Fe({ background: l.value || "var(--ap-accent)" }),
						title: P(X)("appearance.annotationColor")
					}, [cr(H("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						is,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, qO), U($, {
						icon: P(CE),
						label: P(X)("common.reset"),
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
}), YO = { class: "toolbar" }, XO = ["disabled"], ZO = ["disabled"], QO = { class: "preset-list" }, $O = ["onClick", "onKeydown"], ek = { class: "preset-mark" }, tk = { class: "grow col preset-info" }, nk = { class: "row wrap preset-head" }, rk = { class: "preset-name" }, ik = { class: "badge neutral" }, ak = { class: "badge neutral icon-badge" }, ok = {
	key: 0,
	class: "xs muted"
}, sk = {
	key: 1,
	class: "small muted preset-desc"
}, ck = {
	key: 0,
	class: "empty"
}, lk = /* @__PURE__ */ I({
	__name: "PresetsTab",
	setup(e) {
		let t = K(() => _p()), n = (e) => cu(e.preset).length > 0, r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && x("success", n);
			} catch (e) {
				Fx(e) || Gx(e) ? x("info", e.message) : x("error", e instanceof Error ? e.message : String(e), X("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await ch(e.preset), oS();
		}), l = () => s("url", async () => {
			let e = await Zx(a.value);
			return a.value = "", i.value = !1, e;
		}, X("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => Qx(t), X("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => eS(e.preset.id), X("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => vx(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => iS(e.preset.id)), m = () => s("ext", async () => x("info", await Eb() === "current" ? X("update.none") : X("update.reloading")));
		return (e, s) => (z(), B(R, null, [
			H("div", YO, [
				H("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [U(P(LE)), W(j(P(X)("presets.importFile")), 1)], 8, XO),
				H("button", {
					type: "button",
					class: A(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [U(P(oE)), W(j(P(X)("presets.importUrl")), 1)], 2),
				s[4] ||= H("span", { class: "grow" }, null, -1),
				U($, {
					icon: r.value === "ext" ? P(sE) : P(xE),
					label: P(X)("presets.checkUpdates"),
					align: "end",
					disabled: r.value === "ext",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				H("input", {
					ref_key: "fileInput",
					ref: o,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: u
				}, null, 544)
			]),
			i.value ? (z(), B("form", {
				key: 0,
				class: "row",
				onSubmit: ms(l, ["prevent"])
			}, [cr(H("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[is, a.value]]), H("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (z(), V(P(sE), {
				key: 0,
				class: "spin"
			})) : (z(), V(P(WT), { key: 1 })), W(j(P(X)("common.install")), 1)], 8, ZO)], 32)) : G("", !0),
			H("div", QO, [(z(!0), B(R, null, L(t.value, (e) => (z(), B("div", {
				key: e.preset.id,
				class: A(["preset-item", { on: P(sS)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: gs((t) => c(e), ["enter"])
			}, [
				H("span", ek, [r.value === `select:${e.preset.id}` ? (z(), V(P(sE), {
					key: 0,
					class: "spin"
				})) : P(sS)?.id === e.preset.id ? (z(), V(P(TT), { key: 1 })) : G("", !0)]),
				H("div", tk, [
					H("div", nk, [
						H("span", rk, j(P(Mp)(e.preset)), 1),
						H("span", ik, "v" + j(e.preset.version), 1),
						e.source === "builtin" ? G("", !0) : (z(), B("span", {
							key: 0,
							class: A(["badge", { warn: e.source === "dev" }])
						}, j(P(X)(`presets.source.${e.source}`)), 3)),
						n(e) ? (z(), V(UE, {
							key: 1,
							text: P(X)("presets.templates.help")
						}, {
							default: F(() => [H("span", ak, [U(P(LT)), W(j(P(X)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : G("", !0)
					]),
					e.preset.author ? (z(), B("span", ok, j(e.preset.author), 1)) : G("", !0),
					P(Np)(e.preset) ? (z(), B("span", sk, j(P(Np)(e.preset)), 1)) : G("", !0)
				]),
				H("div", {
					class: "row preset-actions",
					onClick: s[3] ||= ms(() => {}, ["stop"])
				}, [
					U($, {
						icon: P(YT),
						label: P(X)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					P($x)(e.preset.id) ? (z(), V($, {
						key: 0,
						icon: P(xE),
						label: P(X)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : G("", !0),
					e.source === "installed" ? (z(), V($, {
						key: 1,
						icon: P(PE),
						label: P(X)("common.delete"),
						align: "end",
						small: "",
						danger: "",
						onClick: (t) => p(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : G("", !0)
				])
			], 42, $O))), 128)), t.value.length ? G("", !0) : (z(), B("div", ck, j(P(X)("presets.none")), 1))]),
			U(JO)
		], 64));
	}
}), uk;
function dk() {
	let e = sS, t = K(() => e.value ? Nm(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (Fm(r, t), n.sampling && (clearTimeout(uk), uk = setTimeout(() => void lh(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var fk = { class: "empty" }, pk = /* @__PURE__ */ I({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (z(), B("div", fk, [
			U(P(mE)),
			H("span", null, j(P(X)("panel.noPreset")), 1),
			H("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => P(Z).tab = "presets"
			}, j(P(X)("panel.choosePreset")), 1)
		]));
	}
}), mk = [
	"aria-checked",
	"title",
	"onClick"
], hk = { class: "ellipsis" }, gk = /* @__PURE__ */ I({
	__name: "Segmented",
	props: /*@__PURE__*/ li({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = mi(e, "modelValue");
		return (n, r) => (z(), B("div", {
			class: A(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(z(!0), B(R, null, L(e.options, (e) => (z(), B("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: A({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (z(), V(Qr(e.icon), { key: 0 })) : G("", !0), H("span", hk, j(e.label), 1)], 10, mk))), 128))], 2));
	}
}), _k = { class: "col" }, vk = { class: "row" }, yk = ["aria-label"], bk = ["label"], xk = ["value"], Sk = ["label"], Ck = ["value"], wk = ["placeholder"], Tk = {
	key: 1,
	class: "xs muted row tight"
}, Ek = { value: "" }, Dk = ["value"], Ok = ["value"], kk = ["value"], Ak = ["value"], jk = [
	"value",
	"placeholder",
	"onChange"
], Mk = [
	"value",
	"placeholder",
	"onChange"
], Nk = ["value"], Pk = ["value"], Fk = ["value"], Ik = ["value"], Lk = ["value"], Rk = {
	key: 0,
	class: "xs muted"
}, zk = { class: "custom-ui-list small" }, Bk = { class: "grow ellipsis" }, Vk = { class: "xs faint" }, Hk = { class: "slider" }, Uk = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], Wk = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], Gk = { class: "field-grid" }, Kk = ["value", "onChange"], qk = ["value"], Jk = ["value"], Yk = /* @__PURE__ */ I({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = dk(), i = K(() => t.value ? Am(t.value) : null), a = K({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				Im(n, {
					kind: r,
					id: i.join(":")
				}), lh(n);
			}
		}), o = K(() => {
			let e = t.value;
			return e ? vl(e).map((t) => ({
				id: t.id,
				title: jp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = K({
			get: () => t.value ? jx(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = vp(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? Nx(n, e) : Hx(n);
			}
		}), c = K(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== bl(t.value));
		}), l = K(() => t.value ? Lm(t.value) : !1), u = K(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? zm(e, n) : u.value && Vm(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Rm(t.value), lh(t.value));
		}, g = () => {
			t.value && u.value && (Hm(t.value, u.value), lh(t.value));
		}, _ = () => {
			t.value && u.value && Bm(t.value, u.value);
		}, v = K(() => Ts.map((e) => ({
			value: e,
			label: X(`transport.${e}`),
			hint: X(`transport.${e}.hint`)
		}))), y = K({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), b = K(() => y.value === "tool-single" || y.value === "tool-multi"), x = K(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), S = K(() => x.value.map((e) => ({
			value: e.id,
			label: jp(t.value, "workflows", e.id, "name", e.name),
			hint: jp(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), ee = K({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), te = K(() => S.value.find((e) => e.value === ee.value)?.hint);
		function C(e) {
			return K({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let ne = C("forceTool"), re = C("parallelTools"), w = K({
			get: () => n.value ? mu(n.value.connection) : "off",
			set: (e) => r((t) => {
				t.connection.sendThoughtSignature = e !== "off" && e;
			})
		}), ie = C("openAiSignatures"), ae = C("streamToolArguments"), oe = C("finalFallback"), se = C("maxSteps"), ce = C("assumeToolSupport"), T = K({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), E = K(() => Object.entries(t.value?.actors ?? {})), le = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), ue = K({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), de = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), fe = K(() => As.map((e) => ({
			value: e,
			label: X(`writing.userInput.${e}`),
			hint: X(`writing.userInput.${e}.hint`)
		}))), D = K({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), O = K({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), pe = K({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...Hu,
					...t.storylines,
					enabled: e
				};
			})
		}), k = K(() => Vu.map((e) => ({
			value: e,
			label: X(`storylines.freeze.${e}`),
			hint: X(`storylines.freeze.${e}.hint`)
		}))), me = K({
			get: () => Uu(n.value?.storylines),
			set: (e) => r((t) => {
				t.storylines = {
					...Hu,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), he = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), ge = K({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), _e = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), ve = [
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
		], ye = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], be = ["stream_openai", "show_thoughts"], xe = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], Se = K(() => n.value?.sampling ?? {}), Ce = (e) => e in Se.value, we = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), Te = (e) => Number(e.target.value);
		return (e, r) => !P(t) || !P(n) || !i.value ? (z(), V(pk, { key: 0 })) : (z(), B(R, { key: 1 }, [
			H("div", _k, [
				H("div", vk, [
					cr(H("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": P(X)("config.configuration")
					}, [H("optgroup", { label: P(X)("config.recommended") }, [(z(!0), B(R, null, L(P(t).configurations, (e) => (z(), B("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, j(P(jp)(P(t), "configurations", e.id, "name", e.name)), 9, xk))), 128))], 8, bk), i.value.saved.length ? (z(), B("optgroup", {
						key: 0,
						label: P(X)("config.saved")
					}, [(z(!0), B(R, null, L(i.value.saved, (e) => (z(), B("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, j(e.name), 9, Ck))), 128))], 8, Sk)) : G("", !0)], 8, yk), [[ss, a.value]]),
					u.value && l.value ? (z(), V($, {
						key: 0,
						icon: P(wE),
						label: P(X)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : G("", !0),
					U($, {
						icon: P(vE),
						label: P(X)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (z(), V($, {
						key: 1,
						icon: P(_E),
						label: P(X)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : G("", !0),
					u.value ? (z(), V($, {
						key: 2,
						icon: P(PE),
						label: P(X)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : G("", !0),
					U($, {
						icon: P(CE),
						label: P(X)("config.reset"),
						align: "end",
						disabled: !l.value,
						onClick: h
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				d.value ? (z(), B("form", {
					key: 0,
					class: "row",
					onSubmit: ms(m, ["prevent"])
				}, [
					cr(H("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: P(X)("config.name"),
						autofocus: ""
					}, null, 8, wk), [[is, f.value]]),
					U($, {
						icon: P(VE),
						label: P(X)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					U($, {
						icon: P(TT),
						label: P(X)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : G("", !0),
				l.value ? (z(), B("span", Tk, [r[29] ||= H("span", { class: "dot modified" }, null, -1), W(j(P(X)("config.modified")), 1)])) : G("", !0)
			]),
			U(jD, {
				title: P(X)("config.connection"),
				icon: P(CT)
			}, {
				default: F(() => [
					U(HO, {
						label: P(X)("config.transport"),
						help: P(X)(`transport.${y.value}.hint`)
					}, {
						default: F(() => [U(gk, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (z(), B(R, { key: 0 }, [
						U(HO, {
							label: P(X)("config.forceTool"),
							help: P(X)("config.forceTool.hint"),
							inline: ""
						}, {
							default: F(() => [U(LO, {
								modelValue: P(ne),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ Sn(ne) ? ne.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(HO, {
							label: P(X)("config.parallelTools"),
							help: P(X)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: F(() => [U(LO, {
								modelValue: P(re),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ Sn(re) ? re.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(HO, {
							label: P(X)("config.syntheticTurn"),
							help: P(X)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: F(() => [cr(H("select", {
								"onUpdate:modelValue": r[8] ||= (e) => T.value = e,
								class: "input"
							}, [H("option", Ek, j(P(X)("common.none")), 1), (z(!0), B(R, null, L(P(t).syntheticTurns, (e) => (z(), B("option", {
								key: e.id,
								value: e.id
							}, j(e.label), 9, Dk))), 128))], 512), [[ss, T.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(HO, {
							label: P(X)("config.thoughtSignature"),
							help: P(X)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: F(() => [cr(H("select", {
								"onUpdate:modelValue": r[9] ||= (e) => w.value = e,
								class: "input"
							}, [(z(!0), B(R, null, L(P(Ds), (e) => (z(), B("option", {
								key: e,
								value: e
							}, j(P(X)(`config.thoughtSignature.${e}`)), 9, Ok))), 128))], 512), [[ss, w.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(HO, {
							label: P(X)("config.openAiSignatures"),
							help: P(X)("config.openAiSignatures.hint"),
							inline: ""
						}, {
							default: F(() => [U(LO, {
								modelValue: P(ie),
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ Sn(ie) ? ie.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(HO, {
							label: P(X)("config.streamToolArguments"),
							help: P(X)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: F(() => [cr(H("select", {
								"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ Sn(ae) ? ae.value = e : null,
								class: "input"
							}, [(z(!0), B(R, null, L(P(Es), (e) => (z(), B("option", {
								key: e,
								value: e
							}, j(P(X)(`config.streamToolArguments.${e}`)), 9, kk))), 128))], 512), [[ss, P(ae)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (z(), V(HO, {
							key: 0,
							label: P(X)("config.maxSteps"),
							inline: ""
						}, {
							default: F(() => [H("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: P(se),
								onChange: r[12] ||= (e) => se.value = Te(e)
							}, null, 40, Ak)]),
							_: 1
						}, 8, ["label"])) : G("", !0),
						U(HO, {
							label: P(X)("config.assumeToolSupport"),
							help: P(X)("config.assumeToolSupport.hint"),
							inline: ""
						}, {
							default: F(() => [U(LO, {
								modelValue: P(ce),
								"onUpdate:modelValue": r[13] ||= (e) => /* @__PURE__ */ Sn(ce) ? ce.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"])
					], 64)) : G("", !0),
					U(HO, {
						label: P(X)("config.finalFallback"),
						help: P(X)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: F(() => [U(LO, {
							modelValue: P(oe),
							"onUpdate:modelValue": r[14] ||= (e) => /* @__PURE__ */ Sn(oe) ? oe.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			S.value.length > 1 ? (z(), V(jD, {
				key: 0,
				title: P(X)("config.workflow"),
				icon: P(BE),
				help: te.value
			}, {
				default: F(() => [U(gk, {
					modelValue: ee.value,
					"onUpdate:modelValue": r[15] ||= (e) => ee.value = e,
					options: S.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(jD, {
				title: P(X)("writing.actors"),
				icon: P(GT),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(E.value, ([e, t]) => (z(), B("div", {
					key: e,
					class: "field-grid"
				}, [U(HO, { label: P(X)("writing.actorName", { actor: e }) }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => le("names", e, t.target.value)
					}, null, 40, jk)]),
					_: 2
				}, 1032, ["label"]), U(HO, { label: P(X)("writing.actorPrefix") }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => le("prefixes", e, t.target.value)
					}, null, 40, Mk)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(jD, {
				title: P(X)("writing.meta"),
				icon: P(dE),
				help: P(X)("writing.meta.hint")
			}, {
				actions: F(() => [U(LO, {
					modelValue: O.value,
					"onUpdate:modelValue": r[16] ||= (e) => O.value = e,
					label: P(X)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [O.value ? (z(), V(HO, {
					key: 0,
					label: P(X)("writing.recentCount"),
					help: P(X)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: P(n).meta.recentCount,
						onChange: r[17] ||= (e) => he(e.target.value)
					}, null, 40, Nk)]),
					_: 1
				}, 8, ["label", "help"])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			P(t).storylines ? (z(), V(jD, {
				key: 1,
				title: P(X)("storylines.enabled"),
				icon: P($T),
				help: P(X)("storylines.config.hint")
			}, {
				actions: F(() => [U(LO, {
					modelValue: pe.value,
					"onUpdate:modelValue": r[18] ||= (e) => pe.value = e,
					label: P(X)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [pe.value ? (z(), V(HO, {
					key: 0,
					label: P(X)("storylines.freezeVariables"),
					help: P(X)("storylines.freezeVariables.hint")
				}, {
					default: F(() => [U(gk, {
						modelValue: me.value,
						"onUpdate:modelValue": r[19] ||= (e) => me.value = e,
						options: k.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(jD, {
				title: P(X)("writing.tokenSaving"),
				icon: P(zT),
				help: P(X)("writing.tokenSaving.hint")
			}, {
				actions: F(() => [U(LO, {
					modelValue: ue.value,
					"onUpdate:modelValue": r[20] ||= (e) => ue.value = e,
					label: P(X)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [ue.value ? (z(), B(R, { key: 0 }, [
					U(HO, {
						label: P(X)("writing.keepFullTurns"),
						help: P(X)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.keepFullTurns,
							onChange: r[21] ||= (e) => de("keepFullTurns", e.target.value)
						}, null, 40, Pk)]),
						_: 1
					}, 8, ["label", "help"]),
					U(HO, {
						label: P(X)("writing.userInput"),
						help: P(X)("writing.userInput.hint")
					}, {
						default: F(() => [U(gk, {
							modelValue: D.value,
							"onUpdate:modelValue": r[22] ||= (e) => D.value = e,
							options: fe.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					D.value === "truncate" ? (z(), V(HO, {
						key: 0,
						label: P(X)("writing.truncateUserAfter"),
						help: P(X)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.truncateUserAfter,
							onChange: r[23] ||= (e) => de("truncateUserAfter", e.target.value)
						}, null, 40, Fk)]),
						_: 1
					}, 8, ["label", "help"])) : G("", !0)
				], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(jD, {
				title: P(X)("writing.cache"),
				icon: P(UT),
				help: P(X)("writing.cache.hint")
			}, {
				actions: F(() => [U(LO, {
					modelValue: ge.value,
					"onUpdate:modelValue": r[24] ||= (e) => ge.value = e,
					label: P(X)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [ge.value ? (z(), B(R, { key: 0 }, [U(HO, {
					label: P(X)("writing.cacheTtl"),
					help: P(X)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.ttlMinutes,
						onChange: r[25] ||= (e) => _e("ttlMinutes", e.target.value)
					}, null, 40, Ik)]),
					_: 1
				}, 8, ["label", "help"]), U(HO, {
					label: P(X)("writing.cacheMaxDeferred"),
					help: P(X)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.maxDeferredTurns,
						onChange: r[26] ||= (e) => _e("maxDeferredTurns", e.target.value)
					}, null, 40, Lk)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (z(), V(jD, {
				key: 2,
				title: P(X)("config.customUi"),
				icon: P(yE),
				help: P(X)("config.customUi.hint")
			}, {
				actions: F(() => [U(LO, {
					modelValue: s.value,
					"onUpdate:modelValue": r[27] ||= (e) => s.value = e,
					label: P(X)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [c.value && !s.value ? (z(), B("p", Rk, j(P(X)("config.customUi.changed")), 1)) : G("", !0), H("ul", zk, [(z(!0), B(R, null, L(o.value, (e) => (z(), B("li", {
					key: e.id,
					class: "row tight"
				}, [H("span", Bk, j(e.title), 1), H("span", Vk, j(P(X)(`config.customUi.${e.mode}`)) + " · " + j(P(X)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(jD, {
				title: P(X)("config.sampling"),
				icon: P(QT),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [
					(z(), B(R, null, L(ve, (e) => (z(), B(R, { key: e.key }, [Ce(e.key) ? (z(), V(HO, {
						key: 0,
						label: P(X)(`sampling.${e.key}`)
					}, {
						default: F(() => [H("div", Hk, [H("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: Se.value[e.key],
							onInput: (t) => we(e.key, Te(t))
						}, null, 40, Uk), H("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: Se.value[e.key],
							onChange: (t) => we(e.key, Te(t))
						}, null, 40, Wk)])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)),
					H("div", Gk, [(z(), B(R, null, L(ye, (e) => (z(), B(R, { key: e }, [Ce(e) ? (z(), V(HO, {
						key: 0,
						label: P(X)(`sampling.${e}`)
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							value: Se.value[e],
							onChange: (t) => we(e, Te(t))
						}, null, 40, Kk)]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)), Ce("reasoning_effort") ? (z(), V(HO, {
						key: 0,
						label: P(X)("sampling.reasoning_effort")
					}, {
						default: F(() => [H("select", {
							class: "input",
							value: Se.value.reasoning_effort,
							onChange: r[28] ||= (e) => we("reasoning_effort", e.target.value)
						}, [(z(), B(R, null, L(xe, (e) => H("option", {
							key: e,
							value: e
						}, j(P(X)(`effort.${e}`)), 9, Jk)), 64))], 40, qk)]),
						_: 1
					}, 8, ["label"])) : G("", !0)]),
					(z(), B(R, null, L(be, (e) => (z(), B(R, { key: e }, [Ce(e) ? (z(), V(HO, {
						key: 0,
						label: P(X)(`sampling.${e}`),
						inline: ""
					}, {
						default: F(() => [U(LO, {
							"model-value": !!Se.value[e],
							"onUpdate:modelValue": (t) => we(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), Xk = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function Zk(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: X("config.transport"),
			options: t([...Ts], (e) => X(`transport.${e}`))
		},
		style: {
			kind: "enum",
			label: X("um.var.style"),
			options: t(["dialogue", "imperative"], (e) => X(`um.style.${e}`))
		},
		workflow: {
			kind: "enum",
			label: X("config.workflow"),
			options: e.workflows.map((t) => ({
				value: t.id,
				label: jp(e, "workflows", t.id, "name", t.name)
			}))
		},
		"gen.origin": {
			kind: "enum",
			label: X("um.var.origin"),
			options: t(["story", "task"], (e) => X(`um.origin.${e}`))
		},
		"gen.type": {
			kind: "enum",
			label: X("um.var.genType"),
			options: t(Xk, (e) => X(`um.genType.${e}`))
		},
		"meta.present": {
			kind: "bool",
			label: X("um.var.metaPresent")
		},
		"meta.pure": {
			kind: "bool",
			label: X("um.var.metaPure")
		},
		"features.tokenSaving": {
			kind: "bool",
			label: X("writing.tokenSaving")
		},
		"chat.group": {
			kind: "bool",
			label: X("um.var.group")
		},
		"memory.hasChat": {
			kind: "bool",
			label: X("um.var.hasChat")
		},
		"memory.hasGlobal": {
			kind: "bool",
			label: X("um.var.hasGlobal")
		},
		"recap.present": {
			kind: "bool",
			label: X("um.var.recap")
		},
		...e.inputShaping ? { "input.shaped": {
			kind: "bool",
			label: X("um.var.inputShaped")
		} } : {},
		...e.image ? { "image.on": {
			kind: "bool",
			label: X("um.var.imageOn")
		} } : {},
		...e.speech ? { "speech.on": {
			kind: "bool",
			label: X("um.var.speechOn")
		} } : {}
	};
}
var Qk = (e) => e.modules.filter((e) => e.toggle === "user");
function $k(e) {
	let t = Zk(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return Qk(e).length && r.push({
		id: "module",
		label: X("um.var.module")
	}), e.params.length && r.push({
		id: "param",
		label: X("um.var.param")
	}), [
		{
			label: X("um.group.chat"),
			subjects: [{
				id: "keyword",
				label: X("um.keyword")
			}, ...n([
				"chat.group",
				"memory.hasChat",
				"memory.hasGlobal",
				"recap.present"
			])]
		},
		{
			label: X("um.group.generation"),
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
			label: X("um.group.preset"),
			subjects: [...r, ...n([
				"transport",
				"style",
				"workflow",
				"features.tokenSaving"
			])]
		},
		{
			label: X("um.group.advanced"),
			subjects: [...e.regex.length ? [{
				id: "flag",
				label: X("um.var.flag")
			}] : [], {
				id: "expr",
				label: X("um.expr")
			}]
		}
	].filter((e) => e.subjects.length);
}
function eA(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function tA(e, t) {
	return t === "module" ? Qk(e).map((t) => ({
		value: t.id,
		label: jp(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: jp(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function nA(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: tA(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? jp(e, "params", t.id, "label", t.label) : r;
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
			label: rA(e, t.id, n.value, n.label)
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
	return Zk(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var rA = (e, t, n, r) => Ap(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), iA = {
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
function aA(e, t) {
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
		let n = String(tA(e, t)[0]?.value ?? "");
		return oA(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return oA(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function oA(e, t, n) {
	let r = nA(e, n);
	return t.path && nA(e, t.path).kind === r.kind && iA[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function sA(e, t, n = "") {
	return e === "bool" ? X(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? X(`um.op.list.${t}`) : e === "enum" ? X(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var cA = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(X("um.or")) : t === void 0 ? "" : n(t);
};
function lA(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? X("um.kw.input") : X("um.kw.recentN", { n: t.depth ?? 3 })} ${X(`um.kw.${t.op}`)} ${t.words.join(X("um.or"))}`;
	let n = nA(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? X("um.boolDesc", {
		label: n.label,
		value: sA(n.kind, t.op, t.path)
	}) : `${n.label} ${sA(n.kind, t.op)} ${cA(n, t.value)}`;
}
function uA(e, t) {
	let n = t.rules.filter(of);
	return n.length ? n.map((t) => lA(e, t)).join(t.match === "any" ? `\n${X("um.match.anyJoin")} ` : `\n${X("um.match.allJoin")} `) : X("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var dA = ["aria-label"], fA = { class: "um-picker-head" }, pA = { class: "small muted" }, mA = { class: "um-choice-text" }, hA = { class: "xs muted" }, gA = ["data-template", "onClick"], _A = { class: "um-choice-text" }, vA = {
	key: 0,
	class: "xs muted um-choice-desc"
}, yA = ["data-id"], bA = ["aria-label", "onPointerdown"], xA = ["onClick"], SA = { class: "um-row-name ellipsis" }, CA = { class: "um-row-meta xs muted ellipsis" }, wA = {
	key: 3,
	class: "faint small"
}, TA = /* @__PURE__ */ I({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => Kh(n.preset)), a = K(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? jp(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? jp(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.filter(Xd).map((e) => e.point))].map(o).concat(e.vars.filter(Xd).map((e) => s(e.var))).join(" · "), l = (e) => _f(n.preset, e), u = (e) => X("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(of);
		function f(e, t) {
			e.enabled = t, J();
		}
		let p = K(() => Rf(n.preset).map((e) => ({
			tpl: e,
			body: Pp(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ N(!1), h = /* @__PURE__ */ N(null);
		function g() {
			m.value = !1;
			let e = Xh(n.preset, X("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function _(e) {
			m.value = !1;
			let t = Zh(n.preset, Pp(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function v() {
			if (!p.value.length) return g();
			m.value = !m.value, m.value && (await Jn(), h.value?.querySelector(".um-choice")?.focus());
		}
		let y = /* @__PURE__ */ N(null);
		async function b(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await Vx(If(e).modules);
				let { added: t, missing: i } = ng(n.preset, e);
				x(i ? "warning" : "success", i ? X("um.importedMissing", {
					n: t.length,
					missing: i
				}) : X("um.imported", { n: t.length }));
			} catch (e) {
				Fx(e) ? x("info", e.message) : x("error", X("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => ux(`${n.preset.id}.ap-modules.json`, tg(n.preset)), ee = /* @__PURE__ */ N(null), te = /* @__PURE__ */ N(null);
		function C(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), te.value = t;
		}
		function ne(e) {
			let t = te.value;
			if (!t || !ee.value) return;
			let r = [...ee.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && eg(n.preset, t, r);
		}
		let re = () => {
			te.value = null;
		};
		return (t, n) => (z(), V(jD, {
			title: P(X)("um.title"),
			help: P(X)("um.help")
		}, {
			actions: F(() => [
				a.value ? (z(), V($, {
					key: 0,
					icon: P(LE),
					label: P(X)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => y.value?.click()
				}, null, 8, ["icon", "label"])) : G("", !0),
				i.value.length ? (z(), V($, {
					key: 1,
					icon: P(WT),
					label: P(X)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : G("", !0),
				a.value && i.value.length ? (z(), V($, {
					key: 2,
					icon: P(vE),
					label: P(X)("um.new"),
					active: m.value,
					small: "",
					align: "end",
					onClick: v
				}, null, 8, [
					"icon",
					"label",
					"active"
				])) : G("", !0)
			]),
			default: F(() => [
				m.value ? (z(), B("div", {
					key: 0,
					ref_key: "pickerEl",
					ref: h,
					class: "um-picker",
					role: "group",
					"aria-label": P(X)("um.startFrom"),
					onKeydown: n[2] ||= gs(ms((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					H("div", fA, [H("span", pA, j(P(X)("um.startFrom")), 1), U($, {
						icon: P(VE),
						label: P(X)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					H("button", {
						type: "button",
						class: "um-choice",
						onClick: g
					}, [U(P(XT)), H("span", mA, [H("span", null, j(P(X)("um.blank")), 1), H("span", hA, j(P(X)("um.blank.desc")), 1)])]),
					(z(!0), B(R, null, L(p.value, (e) => (z(), B("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => _(e.tpl)
					}, [U(P(aE)), H("span", _A, [H("span", null, j(e.body.name), 1), e.body.description ? (z(), B("span", vA, j(e.body.description), 1)) : G("", !0)])], 8, gA))), 128))
				], 40, dA)) : G("", !0),
				i.value.length ? (z(), B("div", {
					key: 1,
					ref_key: "listEl",
					ref: ee,
					class: "um-list"
				}, [(z(!0), B(R, null, L(i.value, (t) => (z(), B("div", {
					key: t.id,
					class: A(["um-row", {
						off: !t.enabled,
						dragging: te.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (z(), B("span", {
						key: 0,
						class: "um-grip",
						"aria-label": P(X)("um.reorder"),
						onPointerdown: (e) => C(e, t.id),
						onPointermove: ne,
						onPointerup: re,
						onPointercancel: re
					}, [U(P(nE))], 40, bA)) : G("", !0),
					H("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [H("span", SA, j(t.name || P(X)("um.untitled")), 1), H("span", CA, j(c(t) || P(X)("um.noEntries")), 1)], 8, xA),
					l(t).length ? (z(), V(UE, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: F(() => [U(P(FE), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : G("", !0),
					d(t) ? (z(), V(UE, {
						key: 2,
						text: P(uA)(e.preset, t.trigger),
						align: "end"
					}, {
						default: F(() => [U(P(HE), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : G("", !0),
					U(LO, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, yA))), 128))], 512)) : a.value && !m.value ? (z(), B("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: v
				}, [U(P(vE)), W(j(P(X)("um.new")), 1)])) : a.value ? G("", !0) : (z(), B("div", wA, j(P(X)("um.noPoints")), 1)),
				H("input", {
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
}), EA = ["title"], DA = ["aria-label", "onClick"], OA = ["placeholder"], kA = /* @__PURE__ */ I({
	__name: "ChipsInput",
	props: /*@__PURE__*/ li({
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
		let t = mi(e, "modelValue"), n = e, r = /* @__PURE__ */ N(""), i = /* @__PURE__ */ N(null);
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
			class: A(["chip", { mono: e.mono }])
		}, [H("span", {
			class: "ellipsis",
			title: t
		}, j(t), 9, EA), H("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: ms((e) => c(n), ["stop"])
		}, [U(P(VE))], 8, DA)], 2))), 128)), cr(H("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: A(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, OA), [[is, r.value]])]));
	}
}), AA = { class: "rule" }, jA = { class: "rule-head" }, MA = ["value", "aria-label"], NA = ["label"], PA = ["value"], FA = ["value"], IA = ["value"], LA = ["value"], RA = ["value"], zA = {
	key: 1,
	class: "grow"
}, BA = {
	key: 0,
	class: "rule-body"
}, VA = { class: "row wrap" }, HA = {
	key: 0,
	class: "unit small muted"
}, UA = ["value"], WA = ["value"], GA = { value: "any" }, KA = { value: "none" }, qA = { class: "row kw-words" }, JA = {
	key: 1,
	class: "rule-body"
}, YA = ["value"], XA = {
	key: 2,
	class: "rule-body"
}, ZA = ["value"], QA = ["value"], $A = { class: "row wrap option-chips" }, ej = ["aria-pressed", "onClick"], tj = {
	key: 2,
	class: "row"
}, nj = ["value"], rj = ["value"], ij = ["value"], aj = ["list", "value"], oj = ["value"], sj = {
	key: 3,
	class: "rule-error xs"
}, cj = /* @__PURE__ */ I({
	__name: "RuleRow",
	props: /*@__PURE__*/ li({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ li(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = mi(e, "modelValue"), r = K(() => $k(t.preset)), i = K(() => eA(n.value)), a = K(() => tA(t.preset, i.value)), o = K(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = K(() => n.value.kind === "var" ? nA(t.preset, n.value.path) : null), c = K(() => ff(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = aA(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = oA(t.preset, r, `${i}.${e}`);
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
		let g = K(() => s.value?.kind === "list" ? "list" : "bool"), _ = K(() => iA[g.value].map((e) => ({
			value: e,
			label: sA(g.value, e, n.value.path)
		}))), v = K(() => (s.value ? iA[s.value.kind] : []).map((e) => ({
			value: e,
			label: sA(s.value.kind, e)
		}))), y = K({
			get: () => n.value.target,
			set: (e) => p(e === "recent" ? {
				target: e,
				depth: n.value.depth ?? 3
			} : {
				target: e,
				depth: void 0
			})
		}), b = K(() => [{
			value: "input",
			label: X("um.kw.input")
		}, {
			value: "recent",
			label: X("um.kw.recent")
		}]);
		return (e, t) => (z(), B("div", AA, [
			H("div", jA, [
				H("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": P(X)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(z(!0), B(R, null, L(r.value, (e) => (z(), B("optgroup", {
					key: e.label,
					label: e.label
				}, [(z(!0), B(R, null, L(e.subjects, (e) => (z(), B("option", {
					key: e.id,
					value: e.id
				}, j(e.label), 9, PA))), 128))], 8, NA))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (z(), B("option", {
					key: 0,
					value: i.value
				}, j(n.value.path), 9, FA)) : G("", !0)], 40, MA),
				a.value.length ? (z(), B("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
					key: String(e.value),
					value: e.value
				}, j(e.label), 9, LA))), 128)), a.value.some((e) => String(e.value) === o.value) ? G("", !0) : (z(), B("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, j(o.value), 9, RA))], 40, IA)) : (z(), B("span", zA)),
				U($, {
					icon: P(VE),
					label: P(X)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (z(), B("div", BA, [H("div", VA, [
				U(gk, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (z(), B("label", HA, [H("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? P(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, UA), W(" " + j(P(X)("um.kw.messages")), 1)])) : G("", !0),
				H("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [H("option", GA, j(P(X)("um.kw.any")), 1), H("option", KA, j(P(X)("um.kw.none")), 1)], 40, WA)
			]), H("div", qA, [U(kA, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": P(X)("common.delete"),
				placeholder: n.value.regex ? P(X)("um.kw.regexPlaceholder") : P(X)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), U($, {
				icon: P(SE),
				label: P(X)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (z(), B("div", JA, [H("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, YA)])) : s.value ? (z(), B("div", XA, [s.value.kind === "bool" || s.value.kind === "list" ? (z(), V(gk, {
				key: 0,
				"model-value": n.value.op,
				options: _.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (z(), B(R, { key: 1 }, [H("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(v.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, QA))), 128))], 40, ZA), H("div", $A, [(z(!0), B(R, null, L(s.value.options, (e) => (z(), B("button", {
				key: String(e.value),
				type: "button",
				class: A(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, j(e.label), 11, ej))), 128))])], 64)) : (z(), B("div", tj, [H("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(v.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, rj))), 128))], 40, nj), s.value.kind === "number" ? (z(), B("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, ij)) : (z(), B(R, { key: 1 }, [H("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, aj), s.value.suggestions?.length ? (z(), B("datalist", {
				key: 0,
				id: l
			}, [(z(!0), B(R, null, L(s.value.suggestions, (e) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, oj))), 128))])) : G("", !0)], 64))]))])) : G("", !0),
			c.value ? (z(), B("div", sj, j(c.value), 1)) : G("", !0)
		]));
	}
}), lj = { class: "trigger" }, uj = {
	key: 1,
	class: "always faint small"
}, dj = {
	key: 0,
	class: "rule-join xs faint"
}, fj = { class: "btn ghost add picker" }, pj = ["aria-label"], mj = ["label"], hj = ["value"], gj = /* @__PURE__ */ I({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ li({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = mi(e, "modelValue"), r = K(() => $k(t.preset)), i = /* @__PURE__ */ N(null), a = K(() => [{
			value: "all",
			label: X("um.match.all")
		}, {
			value: "any",
			label: X("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(aA(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (z(), B("div", lj, [
			n.value.rules.length > 1 ? (z(), V(gk, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : G("", !0),
			n.value.rules.length ? G("", !0) : (z(), B("div", uj, j(P(X)("um.always")), 1)),
			(z(!0), B(R, null, L(n.value.rules, (t, r) => (z(), B(R, { key: r }, [r > 0 ? (z(), B("div", dj, j(n.value.match === "any" ? P(X)("um.match.anyJoin") : P(X)("um.match.allJoin")), 1)) : G("", !0), U(cj, {
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
			H("label", fj, [
				U(P(vE)),
				W(j(P(X)("um.addRule")) + " ", 1),
				H("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": P(X)("um.addRule"),
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
				}, j(e.label), 9, hj))), 128))], 8, mj))), 128))], 40, pj)
			])
		]));
	}
}), _j = { class: "um-entry-head" }, vj = { class: "um-var-label grow ellipsis" }, yj = {
	key: 0,
	class: "um-warn xs"
}, bj = ["placeholder"], xj = [
	"value",
	"placeholder",
	"onInput"
], Sj = { class: "um-var-pair-head" }, Cj = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], wj = [
	"value",
	"placeholder",
	"onInput"
], Tj = ["id"], Ej = ["value"], Dj = /* @__PURE__ */ I({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => hf(n.preset, n.update.var)), a = K(() => i.value?.type !== n.update.type), o = K(() => i.value ? jp(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = K(() => i.value && jp(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = K(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = K(() => `ap-bv-${n.update.var}`);
		function u(e) {
			e.key = e.key.trim();
			let t = c.value.get(e.key);
			t !== void 0 && !e.value && (e.value = t);
		}
		function d(e, t, r) {
			n.update.type === "list" && (n.update.items[e] = $d(t, r));
		}
		function f() {
			let e = n.update;
			e.type === "list" ? e.items.push("") : e.type === "dict" && e.items.push({
				key: "",
				value: ""
			});
		}
		return (t, n) => (z(), B("div", { class: A(["um-entry", {
			lost: a.value,
			off: !P(Xd)(e.update)
		}]) }, [
			H("div", _j, [
				U(LO, {
					"model-value": P(Xd)(e.update),
					label: P(X)("panel.enabled"),
					"onUpdate:modelValue": n[0] ||= (t) => P(Qd)(e.update, t)
				}, null, 8, ["model-value", "label"]),
				H("span", vj, j(o.value), 1),
				U(OD, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				U($, {
					icon: P(VE),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (z(), B("div", yj, [U(P(FE)), W(j(P(X)("um.bv.lost")), 1)])) : G("", !0),
			e.update.type === "string" ? cr((z(), B("textarea", {
				key: 1,
				"onUpdate:modelValue": n[2] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: P(X)("um.bv.append")
			}, null, 8, bj)), [[is, e.update.text]]) : e.update.type === "list" ? (z(!0), B(R, { key: 2 }, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: A(["um-var-row", { off: !P(Xd)(t) }])
			}, [
				U(LO, {
					"model-value": P(Xd)(t),
					label: P(X)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => d(n, P(Zd)(t), e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				H("textarea", {
					value: P(Zd)(t),
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: P(X)("um.bv.item"),
					onInput: (e) => d(n, e.target.value, P(Xd)(t))
				}, null, 40, xj),
				U($, {
					icon: P(VE),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			], 2))), 128)) : (z(), B(R, { key: 3 }, [(z(!0), B(R, null, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: A(["um-var-pair", { off: !P(Xd)(t) }])
			}, [H("div", Sj, [
				U(LO, {
					"model-value": P(Xd)(t),
					label: P(X)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => P(Qd)(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				cr(H("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input bare um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: P(X)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, Cj), [[is, t.key]]),
				U($, {
					icon: P(VE),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]), H("textarea", {
				value: t.value ?? "",
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: c.value.has(t.key.trim()) ? P(X)("um.bv.removes") : P(X)("um.bv.value"),
				onInput: (e) => t.value = e.target.value
			}, null, 40, wj)], 2))), 128)), H("datalist", { id: l.value }, [(z(!0), B(R, null, L(c.value, ([e]) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, Ej))), 128))], 8, Tj)], 64)),
			e.update.type === "string" ? G("", !0) : (z(), B("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: f
			}, [U(P(vE)), W(j(e.update.type === "dict" ? P(X)("um.bv.addKey") : P(X)("um.bv.addItem")), 1)]))
		], 2));
	}
}), Oj = { class: "um-editor" }, kj = { class: "um-head" }, Aj = ["placeholder", "aria-label"], jj = { class: "um-entry-head" }, Mj = ["onUpdate:modelValue", "aria-label"], Nj = ["value"], Pj = ["value"], Fj = [
	"value",
	"aria-label",
	"onChange"
], Ij = ["value"], Lj = {
	key: 0,
	class: "um-warn xs"
}, Rj = ["onUpdate:modelValue", "placeholder"], zj = {
	key: 1,
	class: "rule-error xs pre"
}, Bj = {
	key: 0,
	class: "btn ghost add picker"
}, Vj = ["aria-label"], Hj = ["value"], Uj = { class: "um-foot" }, Wj = ["title"], Gj = ["title"], Kj = ["title"], qj = /* @__PURE__ */ I({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		hr(() => n.module, J, { deep: !0 });
		let i = /* @__PURE__ */ N(null);
		qr(() => {
			n.module.entries.some((e) => e.text) || Jn(() => i.value?.select());
		});
		let a = K(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: jp(n.preset, "insertionPoints", e.id, "label", e.label),
			description: jp(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !pf(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => au(e.text).errors, d = (e) => u(e).map((e) => e.line ? X("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = Yh(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = K(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: jp(n.preset, "vars", e.id, "label", e.label ?? e.id)
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
			v.value ? ($h(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = Qh(n.preset, n.module.id, (e) => X("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => ux(`${n.preset.id}.${dx(n.module.name)}.ap-modules.json`, tg(n.preset, [n.module.id]));
		return (t, n) => (z(), B("div", Oj, [
			H("header", kj, [
				U($, {
					icon: P(vT),
					label: P(X)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				cr(H("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: P(X)("um.untitled"),
					"aria-label": P(X)("um.name")
				}, null, 8, Aj), [[is, e.module.name]]),
				U(LO, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: P(X)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			U(jD, {
				title: P(X)("um.content"),
				help: P(X)("um.content.help")
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.module.entries, (t, n) => (z(), B("div", {
					key: t.id,
					class: A(["um-entry", {
						lost: s(t),
						off: !P(Xd)(t)
					}])
				}, [
					H("div", jj, [
						U(LO, {
							"model-value": P(Xd)(t),
							label: P(X)("panel.enabled"),
							"onUpdate:modelValue": (e) => P(Qd)(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						]),
						cr(H("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": P(X)("um.point")
						}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
							key: e.id,
							value: e.id
						}, j(e.label), 9, Nj))), 128)), s(t) ? (z(), B("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, j(P(X)("um.pointMissing", { id: t.point })), 9, Pj)) : G("", !0)], 8, Mj), [[ss, t.point]]),
						U(OD, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						H("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": P(X)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(z(), B(R, null, L(c, (e) => H("option", {
							key: e,
							value: e
						}, j(P(X)(`um.role.${e || "merge"}`)), 9, Ij)), 64))], 40, Fj),
						e.module.entries.length > 1 || e.module.vars.length ? (z(), V($, {
							key: 0,
							icon: P(VE),
							label: P(X)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : G("", !0)
					]),
					s(t) ? (z(), B("div", Lj, [U(P(FE)), W(j(P(X)("um.pointLost")), 1)])) : G("", !0),
					cr(H("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: P(X)("um.text.placeholder")
					}, null, 8, Rj), [[is, t.text]]),
					u(t).length ? (z(), B("div", zj, j(d(t)), 1)) : G("", !0)
				], 2))), 128)), a.value.length ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [U(P(vE)), W(j(P(X)("um.addEntry")), 1)])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (z(), V(jD, {
				key: 0,
				title: P(X)("um.bv"),
				help: P(X)("um.bv.help")
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.module.vars, (t, n) => (z(), V(Dj, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (z(), B("label", Bj, [
					U(P(vE)),
					W(j(P(X)("um.bv.add")) + " ", 1),
					H("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": P(X)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= H("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (z(!0), B(R, null, L(h.value, (e) => (z(), B("option", {
						key: e.id,
						value: e.id
					}, j(e.label), 9, Hj))), 128))], 40, Vj)
				])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : G("", !0),
			U(jD, {
				title: P(X)("um.trigger"),
				help: P(X)("um.trigger.help")
			}, {
				default: F(() => [U(gj, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			H("footer", Uj, [
				H("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.export"),
					onClick: x
				}, [U(P(WT)), H("span", null, j(P(X)("um.export")), 1)], 8, Wj),
				H("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.duplicate"),
					onClick: b
				}, [U(P(BT)), H("span", null, j(P(X)("um.duplicate")), 1)], 8, Gj),
				n[6] ||= H("span", { class: "grow" }, null, -1),
				H("button", {
					type: "button",
					class: A(["btn ghost danger", { armed: v.value }]),
					title: P(X)("common.delete"),
					onClick: y
				}, [U(P(PE)), H("span", null, j(v.value ? P(X)("um.confirmDelete") : P(X)("common.delete")), 1)], 10, Kj)
			])
		]));
	}
}), Jj = {
	key: 0,
	class: "module-row"
}, Yj = { class: "grow" }, Xj = { class: "ellipsis" }, Zj = ["aria-label"], Qj = ["aria-checked", "onClick"], $j = { class: "grow" }, eM = { class: "grow" }, tM = { class: "ellipsis" }, nM = {
	key: 0,
	class: "empty"
}, rM = /* @__PURE__ */ I({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = dk(), i = K(() => t.value && n.value ? od(t.value, n.value) : {}), a = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = id(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : jp(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : jp(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? jp(e, "groups", t, "label", r?.label ?? t) : X("modules.other"),
					help: t && jp(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => jp(t.value, "modules", e.id, "name", e.name), s = (e) => jp(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(null), _ = K(() => t.value && h.value ? Kh(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Jn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Jn(() => y()?.scrollTo({ top: v }));
		}
		return hr(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !P(t) || !P(n) ? (z(), V(pk, { key: 0 })) : _.value ? (z(), B("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(z(), V(qj, {
			key: _.value.id,
			preset: P(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (z(), B("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			U(TA, {
				preset: P(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(z(!0), B(R, null, L(a.value, (e) => (z(), V(jD, {
				key: e.id,
				title: e.label,
				help: e.help
			}, ti({
				default: F(() => [(z(!0), B(R, null, L(e.sets, (t) => (z(), B(R, { key: t.key }, [t.label ? (z(), B("div", Jj, [H("span", Yj, [H("span", Xj, j(t.label), 1), U(OD, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (z(), V(LO, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : G("", !0)])) : G("", !0), !t.optional || c(t) ? (z(), B("div", {
					key: 1,
					class: A(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(z(!0), B(R, null, L(t.modules, (e) => (z(), B("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: A(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= H("span", { class: "radio" }, null, -1),
					H("span", $j, j(o(e)), 1),
					U(OD, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, Qj))), 128))], 10, Zj)) : G("", !0)], 64))), 128)), (z(!0), B(R, null, L(e.toggles, (e) => (z(), B("div", {
					key: e.id,
					class: "module-row"
				}, [H("span", eM, [H("span", tM, j(o(e)), 1), U(OD, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), U(LO, {
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
				fn: F(() => [U(LO, {
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
			a.value.length ? G("", !0) : (z(), B("div", nM, j(P(X)("modules.none")), 1))
		], 512));
	}
}), iM = ["value", "onChange"], aM = ["value"], oM = {
	key: 2,
	class: "unit"
}, sM = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], cM = {
	key: 0,
	class: "small muted"
}, lM = [
	"list",
	"value",
	"placeholder",
	"onChange"
], uM = ["id"], dM = ["value"], fM = /* @__PURE__ */ I({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = dk(), i = K(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? jp(e, "groups", t, "label", e.groups[t]?.label ?? t) : X("writing.params"),
				help: t && jp(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => jp(t.value, "params", e.id, "label", e.label), o = (e) => jp(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => Ap(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => Du(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !P(t) || !P(n) ? (z(), V(pk, { key: 0 })) : (z(!0), B(R, { key: 1 }, L(i.value, (e) => (z(), V(jD, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: P(kE)
		}, {
			default: F(() => [(z(!0), B(R, null, L(e.params, (e) => (z(), V(HO, {
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
				}, j(s(e, t.value, t.label)), 9, aM))), 128))], 40, iM)) : e.type === "list" ? (z(), V(kA, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": P(X)("common.delete"),
					placeholder: P(X)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (z(), B("div", oM, [H("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, sM), e.unit ? (z(), B("span", cM, j(e.unit), 1)) : G("", !0)])) : (z(), B(R, { key: 3 }, [H("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, lM), e.options?.length ? (z(), B("datalist", {
					key: 0,
					id: f(e)
				}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
					key: String(t.value),
					value: t.value
				}, j(s(e, t.value, t.label)), 9, dM))), 128))], 8, uM)) : G("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), pM = { class: "kv" }, mM = {
	key: 0,
	class: "kv-row"
}, hM = { class: "kv-key ellipsis" }, gM = { class: "kv-value pre small" }, _M = {
	key: 0,
	class: "kv-actions"
}, vM = {
	key: 1,
	class: "kv-edit col"
}, yM = ["placeholder"], bM = ["placeholder"], xM = { class: "row end" }, SM = {
	key: 0,
	class: "kv-edit col"
}, CM = ["placeholder"], wM = ["placeholder"], TM = { class: "row end" }, EM = {
	key: 1,
	class: "faint small kv-empty"
}, DM = /* @__PURE__ */ I({
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
		return (t, n) => (z(), B("div", pM, [
			(z(!0), B(R, null, L(e.entries, (t, l) => (z(), B(R, { key: l }, [i.value === l ? (z(), B("div", vM, [
				cr(H("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, yM), [[is, a.value]]),
				cr(H("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, bM), [[is, o.value]]),
				H("div", xM, [U($, {
					icon: P(VE),
					label: P(X)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(TT),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (z(), B("div", mM, [
				H("div", hM, j(l), 1),
				H("div", gM, j(t), 1),
				e.readonly ? G("", !0) : (z(), B("div", _M, [U($, {
					icon: P(_E),
					label: P(X)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), U($, {
					icon: P(PE),
					label: P(X)("common.delete"),
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
			i.value === "" ? (z(), B("div", SM, [
				cr(H("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, CM), [[is, a.value]]),
				cr(H("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, wM), [[is, o.value]]),
				H("div", TM, [U($, {
					icon: P(VE),
					label: P(X)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(TT),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : G("", !0),
			!Object.keys(e.entries).length && i.value === null ? (z(), B("div", EM, j(P(X)("memory.empty")), 1)) : G("", !0),
			!e.readonly && i.value === null ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [U(P(vE)), W(j(P(X)("common.add")), 1)])) : G("", !0)
		]));
	}
}), OM = {
	key: 1,
	class: "faint small"
}, kM = {
	key: 0,
	class: "badge neutral"
}, AM = ["placeholder"], jM = {
	key: 1,
	class: "faint small"
}, MM = /* @__PURE__ */ I({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = dk(), r = K(() => n.value ? Am(n.value) : null), i = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => kw.value ? k_() : void 0, o = K(() => (Z.chatRev, i.value ? _m(Infinity, a()) : {})), s = K(() => r.value ? bm(r.value) : {}), c = K(() => (Z.chatRev, i.value ? vm(Infinity, a()) : null));
		async function l(e, t) {
			await ym({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), aS();
		}
		async function u(e) {
			await ym({
				type: "memory.delete",
				key: e,
				source: "user"
			}), aS();
		}
		let d = (e, t) => r.value && xm(r.value, "replace", e, t, "user"), f = (e) => r.value && xm(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ N("");
		hr(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = K(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await ym({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), aS();
		}
		return (e, t) => !P(n) || !r.value ? (z(), V(pk, { key: 0 })) : (z(), B(R, { key: 1 }, [
			U(jD, {
				title: P(X)("memory.chat"),
				icon: P(lE),
				help: P(X)("memory.chat.hint")
			}, {
				default: F(() => [i.value ? (z(), V(DM, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (z(), B("div", OM, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(jD, {
				title: P(X)("memory.global"),
				icon: P(tE),
				help: P(X)("memory.global.hint")
			}, {
				actions: F(() => [U($, {
					icon: P(IE),
					label: P(X)("common.undo"),
					small: "",
					align: "end",
					disabled: !P(Sm)(r.value),
					onClick: t[0] ||= (e) => P(wm)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), U($, {
					icon: P(bE),
					label: P(X)("common.redo"),
					small: "",
					align: "end",
					disabled: !P(Cm)(r.value),
					onClick: t[1] ||= (e) => P(Tm)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: F(() => [U(DM, {
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
			U(jD, {
				title: P(X)("memory.recap"),
				icon: P(TE),
				help: P(X)("memory.recap.hint")
			}, {
				actions: F(() => [c.value ? (z(), B("span", kM, "#0–" + j(c.value.coversUpTo), 1)) : G("", !0), i.value ? (z(), V($, {
					key: 1,
					icon: P(TT),
					label: P(X)("common.save"),
					small: "",
					align: "end",
					disabled: !m.value,
					active: "",
					onClick: h
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : G("", !0)]),
				default: F(() => [i.value ? cr((z(), B("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: P(X)("memory.recap.empty")
				}, null, 8, AM)), [[is, p.value]]) : (z(), B("div", jM, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), NM = { class: "row tight xs muted" }, PM = { class: "row" }, FM = {
	key: 0,
	class: "xs text-danger"
}, IM = { class: "row wrap xs muted" }, LM = { class: "badge neutral" }, RM = {
	key: 0,
	class: "badge neutral"
}, zM = { class: "badge neutral" }, BM = {
	key: 1,
	class: "badge warn"
}, VM = ["title"], HM = ["title"], UM = {
	key: 0,
	class: "row wrap xs muted"
}, WM = { class: "grow" }, GM = { key: 0 }, KM = ["onClick"], qM = { class: "grow mono" }, JM = { class: "xs muted" }, YM = { class: "row xs muted" }, XM = { class: "badge neutral" }, ZM = { class: "pre mono scroll" }, QM = {
	key: 0,
	class: "xs faint region-msg"
}, $M = { key: 1 }, eN = ["onClick"], tN = { class: "grow mono" }, nN = { class: "xs muted" }, rN = {
	key: 0,
	class: "region-msg"
}, iN = { class: "pre mono scroll" }, aN = {
	key: 0,
	class: "xs faint"
}, oN = {
	key: 2,
	class: "xs text-warning"
}, sN = {
	key: 1,
	class: "faint small"
}, cN = ["onClick"], lN = { class: "mono grow ellipsis" }, uN = {
	key: 0,
	class: "badge warn"
}, dN = { class: "xs muted" }, fN = { class: "xs muted" }, pN = { class: "row xs muted" }, mN = { class: "grow" }, hN = { class: "mono scroll" }, gN = { class: "row xs muted" }, _N = { class: "grow" }, vN = { class: "mono scroll" }, yN = {
	key: 0,
	class: "faint small"
}, bN = { class: "row xs" }, xN = { class: "badge neutral" }, SN = { class: "muted" }, CN = { class: "mono scroll" }, wN = {
	key: 0,
	class: "faint small"
}, TN = { class: "row xs" }, EN = { class: "badge neutral" }, DN = { class: "grow muted" }, ON = { class: "small" }, kN = {
	key: 0,
	class: "faint small"
}, AN = { class: "xs faint mono build" }, jN = /* @__PURE__ */ I({
	__name: "DebugTab",
	setup(t) {
		let n = K(() => ig.log.find((e) => e.kind === "assembly")?.data), r = K(() => ig.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ dn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ dn({});
		hr(n, async (t) => {
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
			return `${n ?? "?"} → ${r ?? "?"}` + (i ? ` · ${X("debug.cached", { n: i })}` : "");
		}, p = (e) => [
			X("debug.cache.stats", {
				sticky: e.sticky,
				fresh: e.fresh
			}),
			e.postponed ? X("debug.cache.postponed", {
				n: e.postponed,
				d: e.deferred,
				max: e.maxDeferredTurns || "∞"
			}) : "",
			e.unmatched ? X("debug.cache.unmatched", { n: e.unmatched }) : ""
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
		}), g = K(() => ig.log.filter((e) => e.kind !== "assembly")), _ = K(() => {
			Z.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of Yb(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (z(), B(R, null, [
			U(jD, {
				title: P(X)("debug.dev"),
				icon: P(EE),
				help: P(X)("debug.dev.hint")
			}, {
				actions: F(() => [H("span", NM, [H("span", { class: A(["dot status-dot", P(yx).status]) }, null, 2), W(j(P(X)(`debug.dev.${P(yx).status}`)), 1)])]),
				default: F(() => [U(HO, { label: P(X)("debug.dev.url") }, {
					default: F(() => [H("div", PM, [cr(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						is,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), U(LO, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: P(X)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), P(yx).error ? (z(), B("span", FM, j(P(yx).error), 1)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(jD, {
				title: P(X)("debug.assembly"),
				icon: P(ZT),
				collapsible: ""
			}, {
				default: F(() => [n.value ? (z(), B(R, { key: 0 }, [
					H("div", IM, [
						H("span", LM, j(P(X)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (z(), B("span", RM, j(n.value.workflow), 1)) : G("", !0),
						H("span", zM, j(n.value.origin), 1),
						n.value.dryRun ? (z(), B("span", BM, "dry run")) : G("", !0),
						n.value.input ? (z(), B("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, j(P(X)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, VM)) : G("", !0),
						n.value.storyline ? (z(), B("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, j(n.value.storyline.main ? P(X)("storylines.main") : n.value.storyline.name) + j(n.value.storyline.if ? " · if" : "") + j(n.value.storyline.new ? " · new" : "") + j(n.value.storyline.frozen ? " · frozen" : ""), 9, HM)) : G("", !0),
						t[3] ||= H("span", { class: "grow" }, null, -1),
						W(j(u(n.value.at)), 1)
					]),
					r.value ? (z(), B("div", UM, [
						H("span", { class: A(["badge", r.value.reason ? "warn" : "neutral"]) }, j(r.value.reason ? P(X)(`debug.cache.flush.${r.value.reason}`) : P(X)("debug.cache.kept")), 3),
						H("span", WM, j(p(r.value)), 1),
						r.value === n.value.cache ? G("", !0) : (z(), B("span", GM, j(u(r.value.at)), 1))
					])) : G("", !0),
					H("div", null, [(z(!0), B(R, null, L(n.value.regions, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						U(P(DT), { class: A(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						H("span", qM, j(e.id), 1),
						H("span", JM, j(e.messages.length) + " · " + j(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + j(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, KM), i.has(e.id) ? (z(), B(R, { key: 0 }, [(z(!0), B(R, null, L(e.messages, (e, t) => (z(), B("div", {
						key: t,
						class: "region-msg"
					}, [H("div", YM, [H("span", XM, j(e.role), 1), W(j(e.chars) + " ch", 1)]), H("div", ZM, j(e.content), 1)]))), 128)), e.messages.length ? G("", !0) : (z(), B("div", QM, j(P(X)("debug.emptyRegion")), 1))], 64)) : G("", !0)]))), 128))]),
					n.value.vars?.length ? (z(), B("div", $M, [(z(!0), B(R, null, L(n.value.vars, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						U(P(DT), { class: A(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						H("span", tN, j(e.id), 1),
						H("span", nN, j(e.text.length) + " ch", 1)
					], 8, eN), i.has(`var:${e.id}`) ? (z(), B("div", rN, [H("div", iN, j(e.text), 1), e.text ? G("", !0) : (z(), B("div", aN, j(P(X)("debug.emptyRegion")), 1))])) : G("", !0)]))), 128))])) : G("", !0),
					n.value.warnings.length ? (z(), B("div", oN, j(n.value.warnings.join(" · ")), 1)) : G("", !0)
				], 64)) : (z(), B("div", sN, j(P(X)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(jD, {
				title: P(X)("debug.requests"),
				icon: P(RT),
				collapsible: ""
			}, {
				default: F(() => [(z(!0), B(R, null, L(P(ig).requests, (e, t) => (z(), B("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [H("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					H("span", lN, j(e.genId) + " · #" + j(e.step), 1),
					e.error ? (z(), B("span", uN, j(P(X)("debug.error")), 1)) : G("", !0),
					H("span", dN, j(f(e.usage)), 1),
					H("span", fN, j(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, cN), s.value === t ? (z(), B(R, { key: 0 }, [
					H("div", pN, [H("span", mN, j(P(X)("debug.request")), 1), U($, {
						icon: P(VT),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", hN, j(c(e.request)), 1),
					H("div", gN, [H("span", _N, j(P(X)("debug.response")), 1), U($, {
						icon: P(VT),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", vN, j(e.error ?? c(e.response ?? "")), 1)
				], 64)) : G("", !0)]))), 128)), P(ig).requests.length ? G("", !0) : (z(), B("div", yN, j(P(X)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(jD, {
				title: P(X)("debug.log"),
				icon: P(TE),
				collapsible: "",
				open: !1
			}, {
				actions: F(() => [U($, {
					icon: P(PE),
					label: P(X)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => P(ig).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: F(() => [(z(!0), B(R, null, L(g.value, (e, n) => (z(), B("div", {
					key: n,
					class: "req"
				}, [H("div", bN, [
					H("span", xN, j(e.kind), 1),
					t[4] ||= H("span", { class: "grow" }, null, -1),
					H("span", SN, j(u(e.at)), 1)
				]), H("pre", CN, j(c(e.data)), 1)]))), 128)), g.value.length ? G("", !0) : (z(), B("div", wN, j(P(X)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(jD, {
				title: P(X)("debug.annotations"),
				icon: P(uE),
				help: P(X)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(_.value, (e, t) => (z(), B("div", {
					key: t,
					class: "req"
				}, [H("div", TN, [H("span", EN, "#" + j(e.mesId), 1), H("span", DN, "“" + j(e.quote) + "”", 1)]), H("div", ON, j(e.comment), 1)]))), 128)), _.value.length ? G("", !0) : (z(), B("div", kN, j(P(X)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H("div", AN, "Advanced Preset " + j(P("1.11.2")) + " · " + j(P("016b78e65eb6c13b")), 1)
		], 64));
	}
}), MN = {
	key: 1,
	class: "empty"
}, NN = { class: "row storylines-head" }, PN = { class: "xs muted grow" }, FN = ["aria-expanded", "onClick"], IN = { class: "card-title grow ellipsis" }, LN = ["title", "aria-label"], RN = {
	key: 1,
	class: "badge warn"
}, zN = { class: "xs faint" }, BN = {
	key: 0,
	class: "card-body col"
}, VN = ["aria-label"], HN = {
	key: 1,
	class: "faint small"
}, UN = {
	key: 2,
	class: "storyline-floors"
}, WN = ["title", "onClick"], GN = { class: "badge neutral mono" }, KN = { class: "xs muted" }, qN = { class: "grow ellipsis" }, JN = /* @__PURE__ */ I({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n } = dk(), r = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), i = K(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), a = K(() => r.value && n.value?.storylines ? Fw(i.value) : []), o = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), s = (e) => {
			let t = new Set(o.value);
			t.has(e) ? t.delete(e) : t.add(e), o.value = t;
		};
		hr(() => Z.storylineFocus, (e) => {
			e !== null && (o.value = /* @__PURE__ */ new Set([...o.value, e]), Z.storylineFocus = null);
		}, { immediate: !0 });
		let c = (e) => e.main ? e.name ? X("storylines.mainNamed", { name: e.name }) : X("storylines.main") : e.name || X("storylines.unnamed"), l = () => {
			aS(), Zw();
		};
		async function u(e) {
			await M_(e.key, !e.if), l();
		}
		async function d(e) {
			await F_(e.key, !e.hidden), l();
		}
		async function f(e) {
			await Pb(e.key) && l();
		}
		async function p(e) {
			let t = await b(`<h3>${v(e.main && !e.name ? X("storylines.nameMain") : X("storylines.renameTitle", { name: c(e) }))}</h3>${e.main ? `<p>${v(X("storylines.nameMain.hint"))}</p>` : ""}`, e.name, X("common.save"), X("common.cancel"));
			if (t === null) return;
			let n = t.trim();
			if (!qu(n)) return x("warning", X("storylines.invalidName"), X("app.name"));
			let r = await P_(e.key, n);
			if (r === "taken") return x("warning", X("storylines.nameTaken", { name: n }), X("app.name"));
			if (r === "invalid") return x("warning", X("storylines.invalidName"), X("app.name"));
			r !== "unchanged" && (!e.main && o.value.has(e.key) && (o.value = new Set([...o.value].map((t) => t === e.key ? n : t))), l());
		}
		return (e, t) => P(n) ? r.value ? (z(), B(R, { key: 2 }, [H("div", NN, [H("span", PN, j(P(X)("storylines.count", { n: a.value.length })), 1), U(OD, {
			text: P(X)("storylines.help"),
			align: "end"
		}, null, 8, ["text"])]), (z(!0), B(R, null, L(a.value, (e) => (z(), B("section", {
			key: e.key,
			class: A(["card storyline-card", {
				current: e.current,
				hidden: e.hidden
			}])
		}, [H("header", {
			class: "card-head clickable",
			"aria-expanded": o.value.has(e.key),
			onClick: (t) => s(e.key)
		}, [
			(z(), V(Qr(e.main ? P(HT) : e.if ? P(jE) : P($T)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			H("span", IN, j(c(e)), 1),
			e.current ? (z(), B("span", {
				key: 0,
				class: "storyline-dot",
				title: P(X)("storylines.current"),
				"aria-label": P(X)("storylines.current")
			}, null, 8, LN)) : G("", !0),
			e.if ? (z(), B("span", RN, "if")) : G("", !0),
			e.hidden ? (z(), V(P(KT), {
				key: 2,
				class: "storyline-flag",
				"aria-label": P(X)("storylines.hidden")
			}, null, 8, ["aria-label"])) : G("", !0),
			H("span", zN, j(P(X)("storylines.floors", { n: e.floors.length })), 1),
			U(P(ET), {
				class: A(["chevron", { flipped: o.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, FN), o.value.has(e.key) ? (z(), B("div", BN, [e.pending ? G("", !0) : (z(), B("div", {
			key: 0,
			class: A(["storyline-toolbar", { solo: e.main }]),
			role: "toolbar",
			"aria-label": c(e)
		}, [
			e.main ? G("", !0) : (z(), B(R, { key: 0 }, [
				U($, {
					icon: P(jE),
					label: P(X)("storylines.ifLine.toggle"),
					pressed: e.if,
					small: "",
					onClick: (t) => u(e)
				}, null, 8, [
					"icon",
					"label",
					"pressed",
					"onClick"
				]),
				U($, {
					icon: e.hidden ? P(KT) : P(qT),
					label: P(X)("storylines.visible.toggle"),
					pressed: !e.hidden,
					small: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"pressed",
					"onClick"
				]),
				t[0] ||= H("span", {
					class: "storyline-toolbar-sep",
					"aria-hidden": "true"
				}, null, -1)
			], 64)),
			U($, {
				icon: P(gE),
				label: e.main && !e.name ? P(X)("storylines.nameMain") : P(X)("common.rename"),
				small: "",
				onClick: (t) => p(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]),
			e.main ? G("", !0) : (z(), V($, {
				key: 1,
				icon: P(HT),
				label: P(X)("storylines.makeMain"),
				small: "",
				onClick: (t) => f(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]))
		], 10, VN)), e.floors.length ? (z(), B("ul", UN, [(z(!0), B(R, null, L(e.floors, (e) => (z(), B("li", {
			key: e.index,
			class: "row tight small clickable",
			title: P(X)("storylines.jump"),
			onClick: (t) => P(Iw)(e.index)
		}, [
			H("span", GN, "#" + j(e.index), 1),
			H("span", KN, j(e.user ? P(X)("storylines.user") : P(X)("storylines.narrator")), 1),
			H("span", qN, j(e.title || "…"), 1)
		], 8, WN))), 128))])) : (z(), B("div", HN, j(P(X)("storylines.empty")), 1))])) : G("", !0)], 2))), 128))], 64)) : (z(), B("div", MN, [U(P($T), { "aria-hidden": "true" }), H("span", null, j(P(X)("memory.noChat")), 1)])) : (z(), V(pk, { key: 0 }));
	}
}), YN = ["aria-label"], XN = { class: "panel-head" }, ZN = { class: "panel-logo" }, QN = { class: "grow" }, $N = { class: "panel-title ellipsis" }, eP = { class: "panel-sub ellipsis" }, tP = [
	"title",
	"aria-selected",
	"onClick"
], nP = { class: "panel-body scroll" }, rP = /* @__PURE__ */ I({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: mE,
				view: lk
			},
			{
				id: "config",
				icon: OE,
				view: Yk
			},
			{
				id: "modules",
				icon: bT,
				view: rM
			},
			{
				id: "writing",
				icon: gE,
				view: fM
			},
			{
				id: "memory",
				icon: xT,
				view: MM
			},
			{
				id: "storylines",
				icon: $T,
				view: JN
			},
			{
				id: "debug",
				icon: ST,
				view: jN
			}
		], n = K(() => t.filter((e) => e.id !== "storylines" || kw.value)), r = K(() => n.value.find((e) => e.id === Z.tab) ?? n.value[0]), i = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), a = K(() => {
			let e = sS.value;
			return e ? `v${e.version} · ${cS.value.config}` : X("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && Z.panelOpen && (Z.panelOpen = !1);
		};
		return qr(() => document.addEventListener("keydown", o)), Yr(() => {
			document.removeEventListener("keydown", o), oT(!1);
		}), hr(() => Z.panelOpen, (e) => {
			e && oT(!0);
		}, { immediate: !0 }), (e, t) => (z(), V(oo, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => P(oT)(!1)
		}, {
			default: F(() => [P(Z).panelOpen ? (z(), B("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": P(X)("app.name")
			}, [
				H("header", XN, [
					H("div", ZN, [U(P(iE))]),
					H("div", QN, [H("div", $N, j(P(sS) ? P(Mp)(P(sS)) : P(X)("app.name")), 1), H("div", eP, j(a.value), 1)]),
					U(LO, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: P(X)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					U($, {
						icon: P(VE),
						label: P(X)("common.close"),
						align: "end",
						below: "",
						onClick: t[1] ||= (e) => P(Z).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				H("nav", {
					class: A(["tabs", { many: n.value.length > 6 }]),
					role: "tablist"
				}, [(z(!0), B(R, null, L(n.value, (e) => (z(), B("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: A(["tab", { on: e.id === P(Z).tab }]),
					title: P(X)(`tab.${e.id}`),
					"aria-selected": e.id === P(Z).tab,
					onClick: (t) => P(Z).tab = e.id
				}, [(z(), V(Qr(e.icon))), H("span", null, j(P(X)(`tab.${e.id}`)), 1)], 10, tP))), 128))], 2),
				H("main", nP, [(z(), V(Vr, null, [(z(), V(Qr(r.value.view), { key: r.value.id }))], 1024))])
			], 8, YN)) : G("", !0)]),
			_: 1
		}));
	}
}), iP = { class: "inline-drawer" }, aP = { class: "inline-drawer-toggle inline-drawer-header" }, oP = { class: "inline-drawer-content" }, sP = { class: "flex-container alignItemsCenter spaceBetween" }, cP = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, lP = { key: 0 }, uP = { class: "text_muted" }, dP = {
	key: 1,
	class: "text_muted"
}, fP = /* @__PURE__ */ I({
	__name: "SettingsDrawer",
	setup(e) {
		let t = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (z(), B("div", iP, [H("div", aP, [H("b", null, j(P(X)("app.name")), 1), n[3] ||= H("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), H("div", oP, [
			H("div", sP, [H("label", cP, [cr(H("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[as, t.value]]), H("span", null, j(P(X)("settings.enable")), 1)]), H("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => P(fS)(),
				onKeydown: n[2] ||= gs((e) => P(fS)(), ["enter"])
			}, [n[4] ||= H("i", { class: "fa-solid fa-layer-group" }, null, -1), H("span", null, j(P(X)("panel.open")), 1)], 32)]),
			n[5] ||= H("hr", null, null, -1),
			H("h4", null, j(P(X)("settings.preset")), 1),
			P(sS) ? (z(), B("div", lP, [W(j(P(Mp)(P(sS))) + " ", 1), H("span", uP, "v" + j(P(sS).version) + " · " + j(P(cS).config), 1)])) : (z(), B("i", dP, j(P(X)("settings.inactive")), 1))
		])]));
	}
}), pP = {
	key: 0,
	class: "preset-banner"
}, mP = { class: "preset-banner-text" }, hP = /* @__PURE__ */ I({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => P(sS) ? (z(), B("div", pP, [
			U(P(iE), { class: "preset-banner-icon" }),
			H("span", mP, j(P(X)("banner.usesAp")), 1),
			H("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => P(fS)()
			}, j(P(X)("panel.open")), 1)
		])) : G("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function gP() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), bs(fP).mount(t);
}
function _P() {
	YS("ap-stages", oD, ["mesid"]), YS("ap-cards", TO, ["mesid"]), YS("ap-top-cards", TO, ["mesid", "position"]), YS("ap-dock", AO), YS("ap-storyline", PO, ["mesid"]), YS("ap-panel", rP), YS("ap-preset-banner", hP), qS(), oS();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, oS);
	cT(), gP(), Qw(), Ow();
}
//#endregion
//#region src/index.ts
var vP = {
	version: "1.11.2",
	buildId: "016b78e65eb6c13b",
	nextGeneration: (e) => ph(e),
	listPresets: () => _p().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => eh(),
	update: Eb,
	togglePanel: (e) => {
		Z.panelOpen = e ?? !Z.panelOpen;
	},
	annotations: Qb,
	speech: ix
};
globalThis.advancedPresetInterceptor = Ov, window.AdvancedPreset = vP;
function yP(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function bP() {
	for (let { preset: e } of _p()) try {
		await ah(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function xP() {
	let { eventSource: t, eventTypes: n } = e();
	q(), Mb(), Ax(), yS(), Zb(), rx(), await i(), await hp();
	let r = rS();
	for (let { preset: e } of _p()) {
		let t = Um(e);
		t.length && og("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => cv(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Nb(e)), Ub(), Dv(), t.on(n.MESSAGE_RECEIVED, (e, t) => Kb(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		wh.setPending(null), wh.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => wh.sweep());
	let a = yP(() => {
		let e = eh(), t = e ? xp(e) : void 0;
		t && dh(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, a), t.on(n.OAI_PRESET_CHANGED_AFTER, a), t.on(n.OAI_PRESET_CHANGED_AFTER, TS);
	let o = async () => {
		await Promise.race([wx(), new Promise((e) => setTimeout(e, 3e3))]), await bP();
		for (let e of r) x("info", X("presets.backToBuiltin", { version: e.version }), Mp(e));
		(async () => {
			await nS();
			for (let { preset: e } of _p()) await gx(e);
			await wS(), await tS();
		})(), Vb({ reload: !0 }), jS(), bb();
	};
	t.on(n.APP_READY, () => void o()), _P(), og("init", {
		version: "1.11.2",
		build: "016b78e65eb6c13b",
		enabled: q().enabled
	});
}
var SP = xb, CP = ww;
xP().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { SP as advancedPresetOnUpdate, CP as advancedPresetRegisterChatSurface };

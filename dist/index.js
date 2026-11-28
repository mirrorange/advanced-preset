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
function o(e, t = !1) {
	let r = String(e.chat_completion_source ?? ""), i = "";
	try {
		i = String((t ? n.getChatCompletionModel?.(e) : n.getChatCompletionModel?.()) ?? "");
	} catch {
		i = "";
	}
	if (!i) {
		let t = {
			makersuite: "google_model",
			mistralai: "mistralai_model"
		}[r] ?? `${r}_model`;
		i = String(e[t] ?? "");
	}
	return i;
}
var s = [
	"",
	"merge_tools",
	"semi_tools",
	"strict_tools"
];
function c(t = !1, n) {
	let r = e(), i = r.chatCompletionSettings ?? {}, a = n ? {
		...i,
		chat_completion_source: n.source,
		custom_prompt_post_processing: n.postProcessing
	} : i;
	if (r.mainApi !== "openai") return { reason: "mainApi" };
	let c = String(a.custom_prompt_post_processing ?? "");
	return s.includes(c) ? t || r.isToolCallingSupported({
		...a,
		function_calling: !0
	}, n?.model) ? null : a.function_calling ? {
		reason: "model",
		source: String(a.chat_completion_source ?? ""),
		model: n?.model ?? o(a)
	} : { reason: "functionCalling" } : {
		reason: "postProcessing",
		label: p(c)
	};
}
function l() {
	let t = e();
	if ((t.extensionSettings?.disabledExtensions)?.includes("connection-manager")) return [];
	let n = t.extensionSettings?.connectionManager?.profiles;
	return Array.isArray(n) ? n.filter((e) => !!e && typeof e.id == "string") : [];
}
function u(t) {
	let n = e().CONNECT_API_MAP;
	if (n && typeof n == "object") {
		let e = n[t.toLowerCase()];
		return e && e.selected === "openai" && e.source ? e.source : null;
	}
	return {
		oai: "openai",
		google: "makersuite"
	}[t] ?? t;
}
var d = (e) => n.proxies?.find((t) => t.name === e);
async function f(e, t, r) {
	let i = n.createGenerationParameters;
	return i ? (await i(e, t, r, [])).generate_data : null;
}
function p(e) {
	return typeof document > "u" ? e : Array.from(document.querySelectorAll("#custom_prompt_post_processing option")).find((t) => t.value === e)?.textContent?.trim() || e;
}
function m() {
	let e = /\/scripts\/extensions\/(.+?)\/dist\//.exec(new URL(import.meta.url).pathname);
	return e ? decodeURIComponent(e[1]) : "third-party/advanced-preset";
}
var h = () => r("../");
function g(e) {
	return {
		chatCompletionSource: String(e.chat_completion_source ?? ""),
		model: e.model ?? null,
		customApiFormat: e.custom_api_format ?? null,
		opencodeApiFormat: e.opencode_api_format ?? null
	};
}
function _(e, t, r) {
	let i = typeof r == "string" ? { chatCompletionSource: r } : r;
	if (n.getStreamingReply) return n.getStreamingReply(e, t, {
		...i,
		overrideShowThoughts: !0
	});
	switch (v(i)) {
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
function v(e) {
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
var y = [
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
function b(e) {
	let t = v(e), r = n.getStreamingReply;
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
	return [t, ...y.map(([e]) => e).filter((e) => e !== t)].find((e) => i(y.find(([t]) => t === e)[1])) ?? t;
}
var x = () => globalThis.quickReplyApi ?? void 0, S = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
async function C(t, n, r) {
	let i = e();
	if (i.callGenericPopup && i.POPUP_TYPE && i.POPUP_RESULT) return await i.callGenericPopup(t, i.POPUP_TYPE.CONFIRM, "", {
		okButton: n,
		cancelButton: r,
		allowVerticalScrolling: !0
	}) === i.POPUP_RESULT.AFFIRMATIVE;
	let a = document.createElement("div");
	return typeof t == "string" ? a.innerHTML = t : a.append(t.cloneNode(!0)), window.confirm(a.innerText || a.textContent || "");
}
async function ee(t, n, r, i) {
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
function w(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var T = (...e) => globalThis.fetch(...e), te = (e) => {
	T = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function ne(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var E = {}, re = [], ie = () => {}, ae = () => !1, oe = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), se = (e) => e.startsWith("onUpdate:"), ce = Object.assign, le = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ue = Object.prototype.hasOwnProperty, de = (e, t) => ue.call(e, t), D = Array.isArray, fe = (e) => Se(e) === "[object Map]", pe = (e) => Se(e) === "[object Set]", me = (e) => Se(e) === "[object Date]", he = (e) => Se(e) === "[object RegExp]", ge = (e) => typeof e == "function", _e = (e) => typeof e == "string", ve = (e) => typeof e == "symbol", ye = (e) => typeof e == "object" && !!e, be = (e) => (ye(e) || ge(e)) && ge(e.then) && ge(e.catch), xe = Object.prototype.toString, Se = (e) => xe.call(e), Ce = (e) => Se(e).slice(8, -1), we = (e) => Se(e) === "[object Object]", Te = (e) => _e(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Ee = /* @__PURE__ */ ne(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), De = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, Oe = /-\w/g, ke = De((e) => e.replace(Oe, (e) => e.slice(1).toUpperCase())), Ae = /\B([A-Z])/g, je = De((e) => e.replace(Ae, "-$1").toLowerCase()), Me = De((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ne = De((e) => e ? `on${Me(e)}` : ""), Pe = (e, t) => !Object.is(e, t), Fe = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Ie = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Le = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Re = (e) => {
	let t = _e(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ze, Be = () => ze ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ve(e) {
	if (D(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = _e(r) ? Ge(r) : Ve(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (_e(e) || ye(e)) return e;
}
var He = /;(?![^(]*\))/g, Ue = /:([^]+)/, We = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Ge(e) {
	let t = {};
	return e.replace(We, (e) => e.startsWith("/*") ? "" : e).split(He).forEach((e) => {
		if (e) {
			let n = e.split(Ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function O(e) {
	let t = "";
	if (_e(e)) t = e;
	else if (D(e)) for (let n = 0; n < e.length; n++) {
		let r = O(e[n]);
		r && (t += r + " ");
	}
	else if (ye(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ke = /* @__PURE__ */ ne("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function qe(e) {
	return !!e || e === "";
}
function Je(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Qe(e[i], t[i], n);
	return r;
}
function Ye(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Qe(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Xe(e, t, n) {
	let r = fe(e), i = fe(t);
	if (r || i || (r = pe(e), i = pe(t), r || i)) return r && i ? Ye(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Qe(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Ze(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Qe(e, t, n) {
	if (e === t) return !0;
	let r = me(e), i = me(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = ve(e), i = ve(t), r || i ? e === t : (r = D(e), i = D(t), r || i ? r && i ? Ze(e, t, n, Je) : !1 : (r = ye(e), i = ye(t), r || i ? !r || !i ? !1 : Ze(e, t, n, Xe) : String(e) === String(t))));
}
function $e(e, t) {
	return e.findIndex((e) => Qe(e, t));
}
var et = (e) => !!(e && e.__v_isRef === !0), k = (e) => _e(e) ? e : e == null ? "" : D(e) || ye(e) && (e.toString === xe || !ge(e.toString)) ? et(e) ? k(e.value) : JSON.stringify(e, tt, 2) : String(e), tt = (e, t) => et(t) ? tt(e, t.value) : fe(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[nt(t, r) + " =>"] = n, e), {}) } : pe(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => nt(e)) } : ve(t) ? nt(t) : ye(t) && !D(t) && !we(t) ? String(t) : t, nt = (e, t = "") => ve(e) ? `Symbol(${e.description ?? t})` : e, rt, it = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && rt && (rt.active ? (this.parent = rt, this.index = (rt.scopes || (rt.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = rt;
			try {
				return rt = this, e();
			} finally {
				rt = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = rt, rt = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (rt === this) rt = this.prevScope;
			else {
				let e = rt;
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
function at() {
	return rt;
}
var ot, st = /* @__PURE__ */ new WeakSet(), ct = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, rt && (rt.active ? rt.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, st.has(this) && (st.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ft(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Tt(this), ht(this);
		let e = ot, t = xt;
		ot = this, xt = !0;
		try {
			return this.fn();
		} finally {
			gt(this), ot = e, xt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) yt(e);
			this.deps = this.depsTail = void 0, Tt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? st.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		_t(this) && this.run();
	}
	get dirty() {
		return _t(this);
	}
}, lt = 0, ut, dt;
function ft(e, t = !1) {
	e.flags |= 8, t ? (e.next = dt, dt = e) : (e.next = ut, ut = e);
}
function pt() {
	lt++;
}
function mt() {
	if (--lt > 0) return;
	if (dt) {
		let e = dt;
		for (dt = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ut;) {
		let t = ut;
		for (ut = void 0; t;) {
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
function ht(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function gt(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), yt(r), bt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function _t(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (vt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function vt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Et) || (e.globalVersion = Et, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !_t(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = ot, r = xt;
	ot = e, xt = !0;
	try {
		ht(e);
		let n = e.fn(e._value);
		(t.version === 0 || Pe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		ot = n, xt = r, gt(e), e.flags &= -3;
	}
}
function yt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) yt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function bt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var xt = !0, St = [];
function Ct() {
	St.push(xt), xt = !1;
}
function wt() {
	let e = St.pop();
	xt = e === void 0 || e;
}
function Tt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = ot;
		ot = void 0;
		try {
			t();
		} finally {
			ot = e;
		}
	}
}
var Et = 0, Dt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ot = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!ot || !xt || ot === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== ot) t = this.activeLink = new Dt(ot, this), ot.deps ? (t.prevDep = ot.depsTail, ot.depsTail.nextDep = t, ot.depsTail = t) : ot.deps = ot.depsTail = t, kt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = ot.depsTail, t.nextDep = void 0, ot.depsTail.nextDep = t, ot.depsTail = t, ot.deps === t && (ot.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Et++, this.notify(e);
	}
	notify(e) {
		pt();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			mt();
		}
	}
};
function kt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) kt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ Symbol(""), Mt = /* @__PURE__ */ Symbol(""), Nt = /* @__PURE__ */ Symbol("");
function Pt(e, t, n) {
	if (xt && ot) {
		let t = At.get(e);
		t || At.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ot()), r.map = t, r.key = n), r.track();
	}
}
function Ft(e, t, n, r, i, a) {
	let o = At.get(e);
	if (!o) {
		Et++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (pt(), t === "clear") o.forEach(s);
	else {
		let i = D(e), a = i && Te(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Nt || !ve(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Nt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(jt)), fe(e) && s(o.get(Mt)));
				break;
			case "delete":
				i || (s(o.get(jt)), fe(e) && s(o.get(Mt)));
				break;
			case "set": fe(e) && s(o.get(jt));
		}
	}
	mt();
}
function It(e) {
	let t = /* @__PURE__ */ Tn(e);
	return t === e || (Pt(t, "iterate", Nt), /* @__PURE__ */ Cn(e)) ? t : /* @__PURE__ */ Sn(e) ? /* @__PURE__ */ xn(e) ? t.map((e) => On(Dn(e))) : t.map(On) : t.map(Dn);
}
function Lt(e) {
	return Pt(e = /* @__PURE__ */ Tn(e), "iterate", Nt), e;
}
function Rt(e, t) {
	return /* @__PURE__ */ Sn(e) ? On(/* @__PURE__ */ xn(e) ? Dn(t) : t) : Dn(t);
}
var zt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Bt(this, Symbol.iterator, (e) => Rt(this, e));
	},
	concat(...e) {
		return It(this).concat(...e.map((e) => D(e) ? It(e) : e));
	},
	entries() {
		return Bt(this, "entries", (e) => (e[1] = Rt(this, e[1]), e));
	},
	every(e, t) {
		return Ut(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Ut(this, "filter", e, t, (e) => e.map((e) => Rt(this, e)), arguments);
	},
	find(e, t) {
		return Ut(this, "find", e, t, (e) => Rt(this, e), arguments);
	},
	findIndex(e, t) {
		return Ut(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Ut(this, "findLast", e, t, (e) => Rt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Ut(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Ut(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Gt(this, "includes", e);
	},
	indexOf(...e) {
		return Gt(this, "indexOf", e);
	},
	join(e) {
		return It(this).join(e);
	},
	lastIndexOf(...e) {
		return Gt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Ut(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Kt(this, "pop");
	},
	push(...e) {
		return Kt(this, "push", e);
	},
	reduce(e, ...t) {
		return Wt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Wt(this, "reduceRight", e, t);
	},
	shift() {
		return Kt(this, "shift");
	},
	some(e, t) {
		return Ut(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Kt(this, "splice", e);
	},
	toReversed() {
		return It(this).toReversed();
	},
	toSorted(e) {
		return It(this).toSorted(e);
	},
	toSpliced(...e) {
		return It(this).toSpliced(...e);
	},
	unshift(...e) {
		return Kt(this, "unshift", e);
	},
	values() {
		return Bt(this, "values", (e) => Rt(this, e));
	}
};
function Bt(e, t, n) {
	let r = Lt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Cn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Vt(a.next(), n), i !== Ht[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Vt(a._next(), n);
	}
	return a;
}
function Vt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Ht = Array.prototype;
function Ut(e, t, n, r, i, a) {
	let o = Lt(e), s = o !== e && !/* @__PURE__ */ Cn(e), c = o[t];
	if (c !== Ht[t]) {
		let t = c.apply(e, a);
		return s ? Dn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Rt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Wt(e, t, n, r) {
	let i = Lt(e), a = i !== e && !/* @__PURE__ */ Cn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Rt(e, t)), n.call(this, t, Rt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Rt(e, c) : c;
}
function Gt(e, t, n) {
	let r = /* @__PURE__ */ Tn(e);
	Pt(r, "iterate", Nt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ wn(n[0]) ? (n[0] = /* @__PURE__ */ Tn(n[0]), r[t](...n)) : i;
}
function Kt(e, t, n = []) {
	Ct(), pt();
	let r = (/* @__PURE__ */ Tn(e))[t].apply(e, n);
	return mt(), wt(), r;
}
var qt = /* @__PURE__ */ ne("__proto__,__v_isRef,__isVue"), Jt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ve));
function Yt(e) {
	ve(e) || (e = String(e));
	let t = /* @__PURE__ */ Tn(this);
	return Pt(t, "has", e), t.hasOwnProperty(e);
}
var Xt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? hn : mn : i ? pn : fn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = D(e);
		if (!r) {
			let e;
			if (a && (e = zt[t])) return e;
			if (t === "hasOwnProperty") return Yt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ kn(e) ? e : n);
		if ((ve(t) ? Jt.has(t) : qt(t)) || (r || Pt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ kn(o)) {
			let e = a && Te(t) ? o : o.value;
			return r && ye(e) ? /* @__PURE__ */ yn(e) : e;
		}
		return ye(o) ? r ? /* @__PURE__ */ yn(o) : /* @__PURE__ */ _n(o) : o;
	}
}, Zt = class extends Xt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = D(e) && Te(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Sn(i);
			if (!/* @__PURE__ */ Cn(n) && !/* @__PURE__ */ Sn(n) && (i = /* @__PURE__ */ Tn(i), n = /* @__PURE__ */ Tn(n)), !a && /* @__PURE__ */ kn(i) && !/* @__PURE__ */ kn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : de(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ kn(e) ? e : r);
		return e === /* @__PURE__ */ Tn(r) && s && (o ? Pe(n, i) && Ft(e, "set", t, n, i) : Ft(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = de(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ft(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!ve(t) || !Jt.has(t)) && Pt(e, "has", t), n;
	}
	ownKeys(e) {
		return Pt(e, "iterate", D(e) ? "length" : jt), Reflect.ownKeys(e);
	}
}, Qt = class extends Xt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, $t = /* @__PURE__ */ new Zt(), en = /* @__PURE__ */ new Qt(), tn = /* @__PURE__ */ new Zt(!0), nn = (e) => e, rn = (e) => Reflect.getPrototypeOf(e);
function an(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ Tn(i), o = fe(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? nn : t ? On : Dn;
		return !t && Pt(a, "iterate", c ? Mt : jt), ce(Object.create(l), { next() {
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
function on(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function sn(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ Tn(r), a = /* @__PURE__ */ Tn(n);
			e || (Pe(n, a) && Pt(i, "get", n), Pt(i, "get", a));
			let { has: o } = rn(i), s = t ? nn : e ? On : Dn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Pt(/* @__PURE__ */ Tn(t), "iterate", jt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Tn(n), i = /* @__PURE__ */ Tn(t);
			return e || (Pe(t, i) && Pt(r, "has", t), Pt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Tn(a), s = t ? nn : e ? On : Dn;
			return !e && Pt(o, "iterate", jt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return ce(n, e ? {
		add: on("add"),
		set: on("set"),
		delete: on("delete"),
		clear: on("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ Tn(this), r = rn(n), i = /* @__PURE__ */ Tn(e), a = !t && !/* @__PURE__ */ Cn(e) && !/* @__PURE__ */ Sn(e) ? i : e;
			return r.has.call(n, a) || Pe(e, a) && r.has.call(n, e) || Pe(i, a) && r.has.call(n, i) || (n.add(a), Ft(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Cn(n) && !/* @__PURE__ */ Sn(n) && (n = /* @__PURE__ */ Tn(n));
			let r = /* @__PURE__ */ Tn(this), { has: i, get: a } = rn(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Tn(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Pe(n, s) && Ft(r, "set", e, n, s) : Ft(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Tn(this), { has: n, get: r } = rn(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Tn(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ft(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Tn(this), t = e.size !== 0, n = e.clear();
			return t && Ft(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = an(r, e, t);
	}), n;
}
function cn(e, t) {
	let n = sn(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(de(n, i) && i in r ? n : r, i, a);
}
var ln = { get: /* @__PURE__ */ cn(!1, !1) }, un = { get: /* @__PURE__ */ cn(!1, !0) }, dn = { get: /* @__PURE__ */ cn(!0, !1) }, fn = /* @__PURE__ */ new WeakMap(), pn = /* @__PURE__ */ new WeakMap(), mn = /* @__PURE__ */ new WeakMap(), hn = /* @__PURE__ */ new WeakMap();
function gn(e) {
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
function _n(e) {
	return /* @__PURE__ */ Sn(e) ? e : bn(e, !1, $t, ln, fn);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
	return bn(e, !1, tn, un, pn);
}
// @__NO_SIDE_EFFECTS__
function yn(e) {
	return bn(e, !0, en, dn, mn);
}
function bn(e, t, n, r, i) {
	if (!ye(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = gn(Ce(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function xn(e) {
	return /* @__PURE__ */ Sn(e) ? /* @__PURE__ */ xn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Sn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Cn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function wn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Tn(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Tn(t) : e;
}
function En(e) {
	return !de(e, "__v_skip") && Object.isExtensible(e) && Ie(e, "__v_skip", !0), e;
}
var Dn = (e) => ye(e) ? /* @__PURE__ */ _n(e) : e, On = (e) => ye(e) ? /* @__PURE__ */ yn(e) : e;
// @__NO_SIDE_EFFECTS__
function kn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function A(e) {
	return An(e, !1);
}
function An(e, t) {
	return /* @__PURE__ */ kn(e) ? e : new jn(e, t);
}
var jn = class {
	constructor(e, t) {
		this.dep = new Ot(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Tn(e), this._value = t ? e : Dn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Cn(e) || /* @__PURE__ */ Sn(e);
		e = n ? e : /* @__PURE__ */ Tn(e), Pe(e, t) && (this._rawValue = e, this._value = n ? e : Dn(e), this.dep.trigger());
	}
};
function j(e) {
	return /* @__PURE__ */ kn(e) ? e.value : e;
}
var Mn = {
	get: (e, t, n) => t === "__v_raw" ? e : j(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ kn(i) && !/* @__PURE__ */ kn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Nn(e) {
	return /* @__PURE__ */ xn(e) ? e : new Proxy(e, Mn);
}
var Pn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new Ot(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function Fn(e) {
	return new Pn(e);
}
var In = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ot(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Et - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && ot !== this) return ft(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return vt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Ln(e, t, n = !1) {
	let r, i;
	return ge(e) ? r = e : (r = e.get, i = e.set), new In(r, i, n);
}
var Rn = {}, zn = /* @__PURE__ */ new WeakMap(), Bn = void 0;
function Vn(e, t = !1, n = Bn) {
	if (n) {
		let t = zn.get(n);
		t || zn.set(n, t = []), t.push(e);
	}
}
function Hn(e, t, n = E) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ Cn(e) || i === !1 || i === 0 ? Un(e, 1) : Un(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ kn(e) ? (d = () => e.value, m = /* @__PURE__ */ Cn(e)) : /* @__PURE__ */ xn(e) ? (d = () => l(e), m = !0) : D(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ xn(e) || /* @__PURE__ */ Cn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ kn(e)) return e.value;
		if (/* @__PURE__ */ xn(e)) return l(e);
		if (ge(e)) return c ? c(e, 2) : e();
	})) : d = ge(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			Ct();
			try {
				f();
			} finally {
				wt();
			}
		}
		let t = Bn;
		Bn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Bn = t;
		}
	} : ie, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => Un(e(), t);
	}
	let g = at(), _ = () => {
		u.stop(), g && g.active && le(g.effects, u);
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
	let v = h ? Array(e.length).fill(Rn) : Rn, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => Pe(e, v[t])) : Pe(n, v))) {
					let e = Bn;
					Ct();
					try {
						f && f(), Bn = u;
						let e = [
							n,
							v === Rn ? void 0 : h && v[0] === Rn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Bn = e, wt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new ct(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => Vn(e, !1, u), f = u.onStop = () => {
		let e = zn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			zn.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function Un(e, t = Infinity, n) {
	if (t <= 0 || !ye(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ kn(e)) Un(e.value, t, n);
	else if (D(e)) for (let r = 0; r < e.length; r++) Un(e[r], t, n);
	else if (pe(e) || fe(e)) e.forEach((e) => {
		Un(e, t, n);
	});
	else if (we(e)) {
		for (let r in e) Un(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Un(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Wn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Kn(e, t, n);
	}
}
function Gn(e, t, n, r) {
	if (ge(e)) {
		let i = Wn(e, t, n, r);
		return i && be(i) && i.catch((e) => {
			Kn(e, t, n);
		}), i;
	}
	if (D(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Gn(e[a], t, n, r));
		return i;
	}
}
function Kn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || E;
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
			Ct(), Wn(a, null, 10, [
				e,
				i,
				o
			]), wt();
			return;
		}
	}
	qn(e, n, i, r, o);
}
function qn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Jn = [], Yn = -1, Xn = [], Zn = null, Qn = 0, $n = /* @__PURE__ */ Promise.resolve(), er = null;
function tr(e) {
	let t = er || $n;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function nr(e) {
	let t = Yn + 1, n = Jn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Jn[r], a = ur(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function rr(e) {
	if (!(e.flags & 1)) {
		let t = ur(e), n = Jn[Jn.length - 1];
		!n || !(e.flags & 2) && t >= ur(n) ? Jn.push(e) : Jn.splice(nr(t), 0, e), e.flags |= 1, ir();
	}
}
function ir() {
	er ||= $n.then(dr);
}
function ar(e) {
	if (!D(e)) Zn && e.id === -1 ? Zn.splice(Qn + 1, 0, e) : e.flags & 1 || (Xn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Xn.push(e[t]);
	ir();
}
function or(e, t, n, r = Yn + 1) {
	for (; r < Jn.length; r++) {
		let n = Jn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Jn.splice(r, 1), r = e ? r - 1 : Yn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function sr(e, t, n = 0) {
	if (Xn.length) {
		let e = Xn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Xn.length; i++) {
				let a = Xn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Xn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => ur(e) - ur(t));
		if (Xn.length = r, Zn) {
			for (let e = 0; e < i.length; e++) Zn.push(i[e]);
			return;
		}
		for (Zn = i, Qn = 0; Qn < Zn.length; Qn++) {
			let e = Zn[Qn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Zn = null, Qn = 0;
	}
}
var cr = !1;
function lr(e, t) {
	if (cr) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Xn);
	e(), cr = !0;
	try {
		or(void 0, t), sr(void 0, n, t);
	} finally {
		cr = !1;
	}
}
var ur = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function dr(e) {
	try {
		for (Yn = 0; Yn < Jn.length; Yn++) {
			let e = Jn[Yn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Wn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Yn < Jn.length; Yn++) {
			let e = Jn[Yn];
			e && (e.flags &= -2);
		}
		Yn = -1, Jn.length = 0, sr(e), er = null, (Jn.length || Xn.length) && dr(e);
	}
}
var fr = null, pr = null;
function mr(e) {
	let t = fr;
	return fr = e, pr = e && e.type.__scopeId || null, t;
}
function M(e, t = fr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ha(-1);
		let i = mr(t), a = da.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = da.length; e > a; e--) pa();
			mr(i), r._d && ha(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function N(e, t) {
	if (fr === null) return e;
	let n = Ja(fr), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = E] = t[e];
		i && (ge(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && Un(a), r.push({
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
function hr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ct(), Gn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), wt());
	}
}
function gr(e, t, n = !1) {
	let r = Fa();
	if (r || vi) {
		let i = vi ? vi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && ge(t) ? t.call(r && r.proxy) : t;
	}
}
var _r = /* @__PURE__ */ Symbol.for("v-scx"), vr = () => gr(_r);
function yr(e, t) {
	return xr(e, null, t);
}
function br(e, t) {
	return xr(e, null, { flush: "sync" });
}
function P(e, t, n) {
	return xr(e, t, n);
}
function xr(e, t, n = E) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = ce({}, n), c = t && r || !t && a !== "post", l;
	if (Va) {
		if (a === "sync") {
			let e = vr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = ie, e.resume = ie, e.pause = ie, e;
		}
	}
	let u = Pa;
	s.call = (e, t, n) => Gn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Yi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : rr(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Hn(e, t, s);
	return Va && (l ? l.push(f) : c && f()), f;
}
var Sr = /* @__PURE__ */ Symbol("_vte"), Cr = (e) => e.__isTeleport, wr = /* @__PURE__ */ Symbol("_leaveCb"), Tr = /* @__PURE__ */ Symbol("_enterCb");
function Er() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Qr(() => {
		e.isMounted = !0;
	}), ei(() => {
		e.isUnmounting = !0;
	}), e;
}
var Dr = [Function, Array], Or = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: Dr,
	onEnter: Dr,
	onAfterEnter: Dr,
	onEnterCancelled: Dr,
	onBeforeLeave: Dr,
	onLeave: Dr,
	onAfterLeave: Dr,
	onLeaveCancelled: Dr,
	onBeforeAppear: Dr,
	onAppear: Dr,
	onAfterAppear: Dr,
	onAppearCancelled: Dr
}, kr = {
	name: "BaseTransition",
	props: Or,
	setup(e, { slots: t }) {
		let n = Fa(), r = Er();
		return () => {
			let i = t.default && Lr(t.default(), !0), a = i && i.length ? Ar(i) : n.subTree ? U() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ Tn(e), { mode: s } = o;
			if (r.isLeaving) return Pr(a);
			let c = Fr(a);
			if (!c) return Pr(a);
			let l = Nr(c, o, r, n, (e) => l = e);
			c.type !== la && Ir(c, l);
			let u = n.subTree && Fr(n.subTree);
			if (u && u.type !== la && !va(u, c) && Rr(n.subTree)) {
				let e = Nr(u, o, r, n);
				if (Ir(u, e), s === "out-in" && c.type !== la) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, Pr(a);
				s === "in-out" && c.type !== la ? e.delayLeave = (e, t, n) => {
					let i = Mr(r, u);
					i[String(u.key)] = u, e[wr] = () => {
						t(), e[wr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Ar(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== la) {
			t = n;
			break;
		}
	}
	return t;
}
var jr = kr;
function Mr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function Nr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = Mr(n, e), S = (e, t) => {
		e && Gn(e, r, 9, t);
	}, C = (e, t) => {
		let n = t[1];
		S(e, t), D(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, ee = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[wr] && t[wr](!0);
			let i = x[b];
			if (i && va(e, i)) {
				let e = i.el[wr];
				if (!e) {
					let t = Rr(i);
					e = t && t.el[wr];
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
			t[Tr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), ee.delayedLeave && ee.delayedLeave(), t[Tr] = void 0);
			};
			let c = t[Tr].bind(null, !1);
			r ? C(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[Tr] && t[Tr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[wr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[wr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[wr].bind(null, !1);
			x[i] = e, p ? C(p, [t, o]) : o();
		},
		clone(e) {
			let a = Nr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return ee;
}
function Pr(e) {
	if (Gr(e)) return e = Ca(e), e.children = null, e;
}
function Fr(e) {
	if (!Gr(e)) return Cr(e.type) && e.children ? Ar(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && ge(n.default)) return n.default();
	}
}
function Ir(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Ir(Cr(n.type) && Fr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === L && D(e.children)) {
		let n = Ti(e.children, !1);
		n && Ir(n, t);
	}
}
function Lr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === L ? (o.patchFlag & 128 && i++, r = r.concat(Lr(o.children, t, s))) : (t || o.type !== la) && r.push(s == null ? o : Ca(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Rr(e) {
	if (e.component) return Rr(e.component.subTree);
	if (e.type === L) {
		let t = D(e.children) && Ti(e.children, !1);
		return t ? Rr(t) : void 0;
	}
	if (e.type !== la) return e;
}
// @__NO_SIDE_EFFECTS__
function F(e, t) {
	return ge(e) ? /* @__PURE__ */ ce({ name: e.name }, t, { setup: e }) : e;
}
function zr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Br(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Vr = /* @__PURE__ */ new WeakMap();
function Hr(e, t, n, r, i = !1) {
	if (D(e)) {
		e.forEach((e, a) => Hr(e, t && (D(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Wr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Hr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ja(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === E ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ Tn(d), p = d === E ? ae : (e) => !Br(u, e) && de(f, e), m = (e, t) => !(t && Br(u, t));
	if (l != null && l !== c) {
		if (Ur(t), _e(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ kn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (ge(c)) Wn(c, s, 12, [o, u]);
	else {
		let t = _e(c), r = /* @__PURE__ */ kn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) D(n) && le(n, a);
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
					s(), Vr.delete(e);
				};
				t.id = -1, Vr.set(e, t), Yi(t, n);
			} else Ur(e), s();
		}
	}
}
function Ur(e) {
	let t = Vr.get(e);
	t && (t.flags |= 8, Vr.delete(e));
}
Be().requestIdleCallback, Be().cancelIdleCallback;
var Wr = (e) => !!e.type.__asyncLoader, Gr = (e) => e.type.__isKeepAlive, Kr = {
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
		let n = Fa(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Yi(() => {
				a.isDeactivated = !1, a.a && Fe(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && ka(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			ia(t.m), ia(t.a), l(e, f, null, 1, s), Yi(() => {
				t.da && Fe(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && ka(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Jr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ya(Wr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !va(t, o)) ? p(t) : o && (Jr(o), t && Jr(t)), i.delete(e), a.delete(e);
		}
		P(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => qr(e, t)), t && m((e) => !qr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (oa(n.subTree.type) ? Yi(() => {
				let e = Yr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Yr(n.subTree)));
		};
		return Qr(_), $r(_), ei(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Yr(t);
				if (e.type === i.type && e.key === i.key) {
					Jr(i);
					let e = i.component.da;
					e && Yi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!_a(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Yr(r);
			if (s.type === la) return o = null, s;
			let c = s.type, l = Ya(Wr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !qr(u, l)) || d && l && qr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = Ca(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Ir(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, oa(r.type) ? r : s;
		};
	}
};
function qr(e, t) {
	return D(e) ? e.some((e) => qr(e, t)) : _e(e) ? e.split(",").includes(t) : he(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Jr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Yr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Xr(e, t, n = Pa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ct();
			let i = Ra(n), a = Gn(t, n, e, r);
			return i(), wt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Zr = (e) => (t, n = Pa) => {
	(!Va || e === "sp") && Xr(e, (...e) => t(...e), n);
}, Qr = Zr("m"), $r = Zr("u"), ei = Zr("bum"), ti = "components", ni = /* @__PURE__ */ Symbol.for("v-ndc");
function ri(e) {
	return _e(e) ? ii(ti, e, !1) || e : e || ni;
}
function ii(e, t, n = !0, r = !1) {
	let i = fr || Pa;
	if (i) {
		let n = i.type;
		if (e === ti) {
			let e = Ya(n, !1);
			if (e && (e === t || e === ke(t) || e === Me(ke(t)))) return n;
		}
		let a = ai(i[e] || n[e], t) || ai(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function ai(e, t) {
	return e && (e[t] || e[ke(t)] || e[Me(ke(t))]);
}
function I(e, t, n, r) {
	let i, a = n && n[r], o = D(e);
	if (o || _e(e)) {
		let n = o && /* @__PURE__ */ xn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Cn(e), s = /* @__PURE__ */ Sn(e), e = Lt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? On(Dn(e[n])) : Dn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (ye(e)) {
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
function oi(e, t) {
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
function si(e, t, n, r, i, a) {
	if (n ??= {}, fr.ce || fr.parent && Wr(fr.parent) && fr.parent.ce) {
		let e = a != null && n.key == null ? ce({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), R(), B(L, null, [H("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = da.length;
	R();
	let c;
	try {
		let i = o && ci(o(n)), s = n.key || a || i && i.key;
		c = B(L, { key: (s && !ve(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = da.length; e > s; e--) pa();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ci(e) {
	return e.some((e) => !_a(e) || !(e.type === la || e.type === L && !ci(e.children))) ? e : null;
}
var li = (e) => e ? Ba(e) ? Ja(e) : li(e.parent) : null, ui = /* @__PURE__ */ ce(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => li(e.parent),
	$root: (e) => li(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		rr(e.update);
	},
	$nextTick: (e) => e.n ||= tr.bind(e.proxy),
	$watch: (e) => ie
}), di = (e, t) => e !== E && !e.__isScriptSetup && de(e, t), fi = {
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
			else if (di(r, t)) return o[t] = 1, r[t];
			else if (de(a, t)) return o[t] = 3, a[t];
			else if (n !== E && de(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = ui[t], u, d;
		if (l) return t === "$attrs" && Pt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== E && de(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, de(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return di(i, t) ? (i[t] = n, !0) : de(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || di(t, s) || de(a, s) || de(r, s) || de(ui, s) || de(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? de(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function pi(e) {
	return D(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function mi(e, t) {
	return !e || !t ? e || t : D(e) && D(t) ? e.concat(t) : ce({}, pi(e), pi(t));
}
function hi() {
	return {
		app: null,
		config: {
			isNativeTag: ae,
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
var gi = 0;
function _i(e, t) {
	return function(n, r = null) {
		ge(n) || (n = ce({}, n)), r != null && !ye(r) && (r = null);
		let i = hi(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: gi++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Qa,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && ge(e.install) ? (a.add(e), e.install(c, ...t)) : ge(e) && (a.add(e), e(c, ...t))), c;
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ja(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Gn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = vi;
				vi = c;
				try {
					return e();
				} finally {
					vi = t;
				}
			}
		};
		return c;
	};
}
var vi = null;
function yi(e, t, n = E) {
	let r = Fa(), i = ke(t), a = je(t), o = bi(e, i), s = Fn((o, s) => {
		let c, l = E, u;
		return br(() => {
			let t = e[i];
			Pe(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!Pe(o, c) && !(l !== E && Pe(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), Pe(e, l) && (Pe(e, o) && !Pe(o, u) || f && l !== E && !Pe(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || E : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var bi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ke(t)}Modifiers`] || e[`${je(t)}Modifiers`];
function xi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || E, i = n, a = t.startsWith("update:"), o = a && bi(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => _e(e) ? e.trim() : e)), o.number && (i = i.map(Le)));
	let s, c = r[s = Ne(t)] || r[s = Ne(ke(t))];
	!c && a && (c = r[s = Ne(je(t))]), c && Gn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Gn(l, e, 6, i);
	}
}
function Si(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (D(a) ? a.forEach((e) => o[e] = null) : ce(o, a), ye(e) && r.set(e, o), o) : (ye(e) && r.set(e, null), null);
}
function Ci(e, t) {
	return !e || !oe(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), de(e, t[0].toLowerCase() + t.slice(1)) || de(e, je(t)) || de(e, t));
}
function wi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = mr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = Ta(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = Ta(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : Ei(s);
		}
	} catch (t) {
		da.length = 0, Kn(t, e, 1), _ = H(la);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(se) && (v = Di(v, a)), y = Ca(y, v, !1, !0));
	}
	return n.dirs && (y = Ca(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Ir(Cr(y.type) && Fr(y) || y, n.transition), _ = y, mr(g), _;
}
function Ti(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (_a(r)) {
			if (r.type !== la || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Ei = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || oe(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Di = (e, t) => {
	let n = {};
	for (let r in e) (!se(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Oi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ki(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ai(o, r, n) && !Ci(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ki(r, o, l) : !!o;
	return !1;
}
function ki(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!de(e, a) || Ai(t, e, a) && !Ci(n, a)) return !0;
	}
	return !1;
}
function Ai(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && ye(r) && ye(i) ? !Qe(r, i) : r !== i;
}
function ji({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Mi = {}, Ni = () => Object.create(Mi), Pi = (e) => Object.getPrototypeOf(e) === Mi;
function Fi(e, t, n, r = !1) {
	let i = {}, a = Ni();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Li(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ vn(i) : e.type.props ? i : a, e.attrs = a;
}
function Ii(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Tn(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Ci(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (de(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ke(o);
						i[t] = Ri(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Li(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !de(t, a) && ((r = je(a)) === a || !de(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Ri(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !de(t, e)) && (delete a[e], l = !0);
	}
	l && Ft(e.attrs, "set", "");
}
function Li(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (Ee(c)) continue;
		let l = t[c], u;
		i && de(i, u = ke(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : Ci(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ Tn(n), r = s || E;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Ri(i, t, s, r[s], e, !de(r, s));
		}
	}
	return o;
}
function Ri(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = de(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && ge(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ra(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === je(n)) && (r = !0));
	}
	return r;
}
function zi(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return ye(e) && r.set(e, re), re;
	if (D(a)) for (let e = 0; e < a.length; e++) {
		let t = ke(a[e]);
		Bi(t) && (o[t] = E);
	}
	else if (a) for (let e in a) {
		let t = ke(e);
		if (Bi(t)) {
			let n = a[e], r = o[t] = D(n) || ge(n) ? { type: n } : ce({}, n), i = r.type, c = !1, l = !0;
			if (D(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = ge(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = ge(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || de(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return ye(e) && r.set(e, c), c;
}
function Bi(e) {
	return e[0] !== "$" && !Ee(e);
}
var Vi = (e) => e === "_" || e === "_ctx" || e === "$stable", Hi = (e) => D(e) ? e.map(Ta) : [Ta(e)], Ui = (e, t, n) => {
	if (t._n) return t;
	let r = M((...e) => Hi(t(...e)), n);
	return r._c = !1, r;
}, Wi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Vi(n)) continue;
		let i = e[n];
		if (ge(i)) t[n] = Ui(n, i, r);
		else if (i != null) {
			let e = Hi(i);
			t[n] = () => e;
		}
	}
}, Gi = (e, t) => {
	let n = Hi(t);
	e.slots.default = () => n;
}, Ki = (e, t, n) => {
	for (let r in t) (n || !Vi(r)) && (e[r] = t[r]);
}, qi = (e, t, n) => {
	let r = e.slots = Ni();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ki(r, t, n), n && Ie(r, "_", e, !0)) : Wi(t, r);
	} else t && Gi(e, t);
}, Ji = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = E;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ki(i, t, n) : (a = !t.$stable, Wi(t, i)), o = t;
	} else t && (Gi(e, t), o = { default: 1 });
	if (a) for (let e in i) !Vi(e) && o[e] == null && delete i[e];
}, Yi = sa;
function Xi(e) {
	return Zi(e);
}
function Zi(e, t) {
	let n = Be();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = ie, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !va(e, t) && (r = ve(e), pe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === re && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case ca:
				g(e, t, n, r);
				break;
			case la:
				_(e, t, n, r);
				break;
			case ua:
				e ?? v(t, n, r, o);
				break;
			case L:
				ne(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? ae(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? Hr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Hr(e.ref, null, a, e, !0);
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
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && ee(e.children, f, null, i, s, Qi(e, c), l, d), _ && hr(e, null, i, "created"), C(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !Ee(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && ka(p, i, e);
		}
		_ && hr(e, null, i, "beforeMount");
		let v = ea(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Yi(() => {
			try {
				p && ka(p, i, e), v && g.enter(f), _ && hr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, C = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || oa(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				C(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, ee = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ea(e[l]) : Ta(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, w = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || E, m = t.props || E, h;
		if (n && $i(n, !1), (h = m.onVnodeBeforeUpdate) && ka(h, n, t, e), f && hr(t, e, n, "beforeUpdate"), n && $i(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? T(e.dynamicChildren, d, c, n, r, Qi(t, i), o) : s || ue(e, t, c, null, n, r, Qi(t, i), o, !1), l > 0) {
			if (l & 16) te(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && te(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Yi(() => {
			h && ka(h, n, t, e), f && hr(t, e, n, "updated");
		}, r);
	}, T = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || aa(c), f = u && (c.type === L || !va(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, te = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== E) for (let o in t) !Ee(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (Ee(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ne = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), ee(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (T(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && ta(e, t, !0)) : ue(e, t, n, f, a, o, c, l, u);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : se(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = Na(e, r, i);
		if (Gr(e) && (s.ctx.renderer = be), Ha(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o, a), !e.el) {
				let r = s.subTree = H(la);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (Oi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ra(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							Yi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				$i(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && Fe(n), (f = t.props && t.props.onVnodeBeforeUpdate) && ka(f, s, t, c), $i(e, !0);
				let p = wi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ve(m), e, i, a), t.el = p.el, u === null && ji(e, p.el), r && Yi(r, i), (f = t.props && t.props.onVnodeUpdated) && Yi(() => ka(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Wr(t);
				if ($i(e, !1), l && Fe(l), !m && (o = c && c.onVnodeBeforeMount) && ka(o, d, t), $i(e, !0), s && Se) {
					let t = () => {
						e.subTree = wi(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = wi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Yi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Yi(() => ka(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Wr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Yi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new ct(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => rr(u), $i(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ii(e, t.props, r, n), Ji(e, t.children, n), Ct(), or(e), wt();
	}, ue = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				D(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				de(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && _e(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? D(l, f, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && ee(f, n, r, i, a, o, s, c));
	}, de = (e, t, n, r, i, a, o, s, c) => {
		e ||= re, t ||= re;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? Ea(t[f]) : Ta(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? _e(e, i, a, !0, !1, d) : ee(t, n, r, i, a, o, s, c, d);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? Ea(t[l]) : Ta(t[l]);
			if (va(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? Ea(t[f]) : Ta(t[f]);
			if (va(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? Ea(t[l]) : Ta(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) pe(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? Ea(t[l]) : Ta(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					pe(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && va(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? pe(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = b ? na(S) : re;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || aa(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== C[_] ? fe(d, n, p, 2) : _--);
			}
		}
	}, fe = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) fe(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === L) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) fe(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === ua) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[wr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Yi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[wr];
					s._isLeaving && s[wr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, pe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ct(), Hr(s, null, n, e, !0), wt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Wr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ka(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && hr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== L || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === L && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Yi(() => {
			_ && ka(_, t, e), h && hr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === L;
		if (o && !a) {
			he(n, r);
			return;
		}
		if (t === ua) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Rr(e) : e, c = () => {
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
		ia(c), ia(l), r && Fe(r), i.stop(), a ? (a.flags |= 8, pe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, pe(o, e, t, n)), s && Yi(s, t), Yi(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) pe(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[Sr];
		return n ? f(n) : t;
	}, ye = (e, t, n) => {
		lr(() => {
			e == null ? t._vnode && pe(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Ma());
	}, be = {
		p: h,
		um: pe,
		m: fe,
		r: me,
		mt: oe,
		mc: ee,
		pc: ue,
		pbc: T,
		n: ve,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(be)), {
		render: ye,
		hydrate: xe,
		createApp: _i(ye, xe)
	};
}
function Qi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function $i({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ea(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ta(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (D(r) && D(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ea(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ta(t, a)), a.type === ca && (a.patchFlag === -1 && (a = i[e] = Ea(a)), a.el = t.el), a.type === la && !a.el && (a.el = t.el);
	}
}
function na(e) {
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
function ra(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ra(t);
}
function ia(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function aa(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? aa(t.subTree) : null;
}
var oa = (e) => e.__isSuspense;
function sa(e, t) {
	t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : ar(e);
}
var L = /* @__PURE__ */ Symbol.for("v-fgt"), ca = /* @__PURE__ */ Symbol.for("v-txt"), la = /* @__PURE__ */ Symbol.for("v-cmt"), ua = /* @__PURE__ */ Symbol.for("v-stc"), da = [], fa = null;
function R(e = !1) {
	da.push(fa = e ? null : []);
}
function pa() {
	da.pop(), fa = da[da.length - 1] || null;
}
var ma = 1;
function ha(e, t = !1) {
	ma += e, e < 0 && fa && t && (fa.hasOnce = !0);
}
function ga(e) {
	return e.dynamicChildren = ma > 0 ? fa || re : null, pa(), ma > 0 && fa && fa.push(e), e;
}
function z(e, t, n, r, i, a) {
	return ga(V(e, t, n, r, i, a, !0));
}
function B(e, t, n, r, i) {
	return ga(H(e, t, n, r, i, !0));
}
function _a(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function va(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ya = ({ key: e }) => e ?? null, ba = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : _e(e) || /* @__PURE__ */ kn(e) || ge(e) ? {
	i: fr,
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
		key: t && ya(t),
		ref: t && ba(t),
		scopeId: pr,
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
		ctx: fr
	};
	return s ? (Da(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= _e(n) ? 8 : 16), ma > 0 && !o && fa && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && fa.push(c), c;
}
var H = xa;
function xa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === ni) && (e = la), _a(e)) {
		let r = Ca(e, t, !0);
		return n && Da(r, n), ma > 0 && !a && fa && (r.shapeFlag & 6 ? fa[fa.indexOf(e)] = r : fa.push(r)), r.patchFlag = -2, r;
	}
	if (Xa(e) && (e = e.__vccOpts), t) {
		t = Sa(t);
		let { class: e, style: n } = t;
		e && !_e(e) && (t.class = O(e)), ye(n) && (/* @__PURE__ */ wn(n) && !D(n) && (n = ce({}, n)), t.style = Ve(n));
	}
	let o = _e(e) ? 1 : oa(e) ? 128 : Cr(e) ? 64 : ye(e) ? 4 : ge(e) ? 2 : 0;
	return V(e, t, n, r, i, o, a, !0);
}
function Sa(e) {
	return e ? /* @__PURE__ */ wn(e) || Pi(e) ? ce({}, e) : e : null;
}
function Ca(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Oa(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ya(l),
		ref: t && t.ref ? n && a ? D(a) ? a.concat(ba(t)) : [a, ba(t)] : ba(t) : a,
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
		ssContent: e.ssContent && Ca(e.ssContent),
		ssFallback: e.ssFallback && Ca(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Ir(u, c.clone(u)), u;
}
function wa(e = " ", t = 0) {
	return H(ca, null, e, t);
}
function U(e = "", t = !1) {
	return t ? (R(), B(la, null, e)) : H(la, null, e);
}
function Ta(e) {
	return e == null || typeof e == "boolean" ? H(la) : D(e) ? H(L, null, e.slice()) : _a(e) ? Ea(e) : H(ca, null, String(e));
}
function Ea(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ca(e);
}
function Da(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (D(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Da(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Pi(t) ? t._ctx = fr : r === 3 && fr && (fr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (ge(t)) {
		if (r & 65) {
			Da(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: fr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [wa(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Oa(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = O([t.class, r.class]));
		else if (e === "style") t.style = Ve([t.style, r.style]);
		else if (oe(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(D(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !se(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ka(e, t, n, r = null) {
	Gn(e, t, 7, [n, r]);
}
var Aa = hi(), ja = 0;
function Ma() {
	return ja;
}
function Na(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Aa, a = {
		uid: ja++,
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
		scope: new it(!0),
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
		propsOptions: zi(r, i),
		emitsOptions: Si(r, i),
		emit: null,
		emitted: null,
		propsDefaults: E,
		inheritAttrs: r.inheritAttrs,
		ctx: E,
		data: E,
		props: E,
		attrs: E,
		slots: E,
		refs: E,
		setupState: E,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = xi.bind(null, a), e.ce && e.ce(a), a;
}
var Pa = null, Fa = () => Pa || fr, Ia, La;
{
	let e = Be(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ia = t("__VUE_INSTANCE_SETTERS__", (e) => Pa = e), La = t("__VUE_SSR_SETTERS__", (e) => Va = e);
}
var Ra = (e) => {
	let t = Pa;
	return Ia(e), e.scope.on(), () => {
		e.scope.off(), Ia(t);
	};
}, za = () => {
	Pa && Pa.scope.off(), Ia(null);
};
function Ba(e) {
	return e.vnode.shapeFlag & 4;
}
var Va = !1;
function Ha(e, t = !1, n = !1) {
	t && La(t);
	let { props: r, children: i } = e.vnode, a = Ba(e);
	Fi(e, r, a, t), qi(e, i, n || t);
	let o = a ? Ua(e, t) : void 0;
	return t && La(!1), o;
}
function Ua(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, fi);
	let { setup: r } = n;
	if (r) {
		Ct();
		let n = e.setupContext = r.length > 1 ? qa(e) : null, i = Ra(e), a = Wn(r, e, 0, [e.props, n]), o = be(a);
		if (wt(), i(), (o || e.sp) && !Wr(e) && zr(e), o) {
			if (a.then(za, za), t) return a.then((n) => {
				La(!0);
				try {
					Wa(e, n, t);
				} finally {
					La(!1);
				}
			}).catch((t) => {
				Kn(t, e, 0);
			});
			e.asyncDep = a;
		} else Wa(e, a, t);
	} else Ga(e, t);
}
function Wa(e, t, n) {
	ge(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ye(t) && (e.setupState = Nn(t)), Ga(e, n);
}
function Ga(e, t, n) {
	let r = e.type;
	e.render ||= r.render || ie;
}
var Ka = { get(e, t) {
	return Pt(e, "get", ""), e[t];
} };
function qa(e) {
	return {
		attrs: new Proxy(e.attrs, Ka),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ja(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Nn(En(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ui) return ui[n](e);
		},
		has(e, t) {
			return t in e || t in ui;
		}
	}) : e.proxy;
}
function Ya(e, t = !0) {
	return ge(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Xa(e) {
	return ge(e) && "__vccOpts" in e;
}
var W = (e, t) => /* @__PURE__ */ Ln(e, t, Va);
function Za(e, t, n) {
	try {
		ha(-1);
		let r = arguments.length;
		return r === 2 ? ye(t) && !D(t) ? _a(t) ? H(e, null, [t]) : H(e, t) : H(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && _a(n) && (n = [n]), H(e, t, n));
	} finally {
		ha(1);
	}
}
var Qa = "3.5.44", $a = void 0, eo = typeof window < "u" && window.trustedTypes;
if (eo) try {
	$a = /* @__PURE__ */ eo.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var to = $a ? (e) => $a.createHTML(e) : (e) => e, no = "http://www.w3.org/2000/svg", ro = "http://www.w3.org/1998/Math/MathML", io = typeof document < "u" ? document : null, ao = io && /* @__PURE__ */ io.createElement("template"), oo = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? io.createElementNS(no, e) : t === "mathml" ? io.createElementNS(ro, e) : n ? io.createElement(e, { is: n }) : io.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => io.createTextNode(e),
	createComment: (e) => io.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => io.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			ao.innerHTML = to(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ao.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, so = "transition", co = "animation", lo = /* @__PURE__ */ Symbol("_vtc"), uo = {
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
}, fo = /* @__PURE__ */ ce({}, Or, uo), po = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = fo, e))((e, { slots: t }) => Za(jr, go(e), t)), mo = (e, t = []) => {
	D(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, ho = (e) => e ? D(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function go(e) {
	let t = {};
	for (let n in e) n in uo || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = _o(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: C = v, onAppearCancelled: ee = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, bo(e, t ? u : s), bo(e, t ? l : o), n && n();
	}, T = (e, t) => {
		e._isLeaving = !1, bo(e, d), bo(e, p), bo(e, f), t && t();
	}, te = (e) => (t, n) => {
		let i = e ? C : v, o = () => w(t, e, n);
		mo(i, [t, o]), xo(() => {
			bo(t, e ? c : a), yo(t, e ? u : s), ho(i) || Co(t, r, h, o);
		});
	};
	return ce(t, {
		onBeforeEnter(e) {
			mo(_, [e]), yo(e, a), yo(e, o);
		},
		onBeforeAppear(e) {
			mo(S, [e]), yo(e, c), yo(e, l);
		},
		onEnter: te(!1),
		onAppear: te(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => T(e, t);
			yo(e, d), e._enterCancelled ? (yo(e, f), Do(e)) : (Do(e), yo(e, f)), xo(() => {
				e._isLeaving && (bo(e, d), yo(e, p), ho(b) || Co(e, r, g, n));
			}), mo(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), mo(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), mo(ee, [e]);
		},
		onLeaveCancelled(e) {
			T(e), mo(x, [e]);
		}
	});
}
function _o(e) {
	if (e == null) return null;
	if (ye(e)) return [vo(e.enter), vo(e.leave)];
	{
		let t = vo(e);
		return [t, t];
	}
}
function vo(e) {
	return Re(e);
}
function yo(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[lo] || (e[lo] = /* @__PURE__ */ new Set())).add(t);
}
function bo(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[lo];
	n && (n.delete(t), n.size || (e[lo] = void 0));
}
function xo(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var So = 0;
function Co(e, t, n, r) {
	let i = e._endId = ++So, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = wo(e, t);
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
function wo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${so}Delay`), a = r(`${so}Duration`), o = To(i, a), s = r(`${co}Delay`), c = r(`${co}Duration`), l = To(s, c), u = null, d = 0, f = 0;
	t === so ? o > 0 && (u = so, d = o, f = a.length) : t === co ? l > 0 && (u = co, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? so : co : null, f = u ? u === so ? a.length : c.length : 0);
	let p = u === so && /\b(?:transform|all)(?:,|$)/.test(r(`${so}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function To(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => Eo(t) + Eo(e[n])));
}
function Eo(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Do(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Oo(e, t, n) {
	let r = e[lo];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ko = /* @__PURE__ */ Symbol("_vod"), Ao = /* @__PURE__ */ Symbol("_vsh"), jo = /* @__PURE__ */ Symbol(""), Mo = /(?:^|;)\s*display\s*:/;
function No(e, t, n) {
	let r = e.style, i = _e(n), a = !1;
	if (n && !i) {
		if (t) {
			if (_e(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Fo(r, t, "");
			}
			else for (let e in t) n[e] ?? Fo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Fo(r, i, "") : zo(e, i, !_e(t) && t ? t[i] : void 0, o) || Fo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[jo];
			e && (n += ";" + e), r.cssText = n, a = Mo.test(n);
		}
	} else t && e.removeAttribute("style");
	ko in e && ((!i || t !== n) && (e[ko] = a ? r.display : ""), e[Ao] && (r.display = "none"));
}
var Po = /\s*!important$/;
function Fo(e, t, n) {
	if (D(n)) n.forEach((n) => Fo(e, t, n));
	else if (n ??= "", t.startsWith("--")) Po.test(n) ? e.setProperty(t, n.replace(Po, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ro(e, t);
		Po.test(n) ? e.setProperty(je(r), n.replace(Po, ""), "important") : e[r] = n;
	}
}
var Io = [
	"Webkit",
	"Moz",
	"ms"
], Lo = {};
function Ro(e, t) {
	let n = Lo[t];
	if (n) return n;
	let r = ke(t);
	if (r !== "filter" && r in e) return Lo[t] = r;
	r = Me(r);
	for (let n = 0; n < Io.length; n++) {
		let i = Io[n] + r;
		if (i in e) return Lo[t] = i;
	}
	return t;
}
function zo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && _e(r) && n === r;
}
var Bo = "http://www.w3.org/1999/xlink";
function Vo(e, t, n, r, i, a = Ke(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Bo, t.slice(6, t.length)) : e.setAttributeNS(Bo, t, n) : n == null || a && !qe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : ve(n) ? String(n) : n);
}
function Ho(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? to(n) : n);
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
		r === "boolean" ? n = qe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Uo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Wo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Go = /* @__PURE__ */ Symbol("_vei");
function Ko(e, t, n, r, i = null) {
	let a = e[Go] || (e[Go] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Yo(t);
		r ? Uo(e, n, a[t] = $o(r, i), s) : o && (Wo(e, n, o, s), a[t] = void 0);
	}
}
var qo = /(Once|Passive|Capture)$/, Jo = /^on:?(?:Once|Passive|Capture)$/;
function Yo(e) {
	let t, n;
	for (; (n = e.match(qo)) && !Jo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : je(e.slice(2)), t];
}
var Xo = 0, Zo = /* @__PURE__ */ Promise.resolve(), Qo = () => Xo ||= (Zo.then(() => Xo = 0), Date.now());
function $o(e, t) {
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
				e && Gn(e, t, 5, a);
			}
		} else Gn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Qo(), n;
}
var es = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ts = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Oo(e, r, o) : t === "style" ? No(e, n, r) : oe(t) ? se(t) || Ko(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ns(e, t, r, o)) ? (Ho(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Vo(e, t, r, o, a, t !== "value")) : e._isVueCE && (rs(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !_e(r))) ? Ho(e, ke(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Vo(e, t, r, o));
};
function ns(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && es(t) && ge(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return es(t) && _e(n) ? !1 : t in e;
}
function rs(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ke(t);
	return Array.isArray(n) ? n.some((e) => ke(e) === r) : Object.keys(n).some((e) => ke(e) === r);
}
var is = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return D(t) ? (e) => Fe(t, e) : t;
};
function as(e) {
	e.target.composing = !0;
}
function os(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ss = /* @__PURE__ */ Symbol("_assign"), cs = /* @__PURE__ */ Symbol("_initialValue");
function ls(e, t, n) {
	return t && (e = e.trim()), n && (e = Le(e)), e;
}
var us = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[cs] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[cs] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ss] = is(i);
		let a = r || i.props && i.props.type === "number";
		Uo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ss](ls(e.value, n, a));
		}), (n || a) && Uo(e, "change", () => {
			e.value = ls(e.value, n, a);
		}), t || (Uo(e, "compositionstart", as), Uo(e, "compositionend", os), Uo(e, "change", os));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[cs];
		delete e[cs], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ss](ls(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ss] = is(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Le(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ds = {
	deep: !0,
	created(e, t, n) {
		e[ss] = is(n), Uo(e, "change", () => {
			let t = e._modelValue, n = gs(e), r = e.checked, i = e[ss];
			if (D(t)) {
				let e = $e(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (pe(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(_s(e, r));
		});
	},
	mounted: fs,
	beforeUpdate(e, t, n) {
		e[ss] = is(n), fs(e, t, n);
	}
};
function fs(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (D(t)) i = $e(t, r.props.value) > -1;
	else if (pe(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Qe(t, _s(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var ps = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Uo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Le(gs(e)) : gs(e)), r = e.multiple, i = r ? pe(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? D(i) ? t.slice() : t : i];
			try {
				e[ss](i);
			} finally {
				tr(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[ss] = is(r);
	},
	mounted(e, { value: t }) {
		hs(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ss] = is(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !ms(t, n[1], n[0])) && hs(e, t);
	}
};
function ms(e, t, n) {
	if (!n || D(e)) return Qe(e, t);
	if (pe(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function hs(e, t) {
	let n = e.multiple, r = D(t);
	if (!n || r || pe(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = gs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : $e(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Qe(gs(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function gs(e) {
	return "_value" in e ? e._value : e.value;
}
function _s(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var vs = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ys = {
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
	exact: (e, t) => vs.some((n) => e[`${n}Key`] && !t.includes(n))
}, bs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ys[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, xs = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Ss = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = je(n.key);
		if (t.some((e) => e === r || xs[e] === r)) return e(n);
	}));
}, Cs = /* @__PURE__ */ ce({ patchProp: ts }, oo), ws;
function Ts() {
	return ws ||= Xi(Cs);
}
var Es = ((...e) => {
	let t = Ts().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Os(e);
		if (!r) return;
		let i = t._component;
		!ge(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ds(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ds(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Os(e) {
	return _e(e) ? document.querySelector(e) : e;
}
//#endregion
//#region i18n/en.json
var ks = {
	"app.name": "Advanced Preset",
	"carrier.reset": "The preset was updated; manual edits in “{name}” were reset.",
	"carrier.tavernHelper.reload": "Tavern Helper scripts of “{name}” were updated. Tavern Helper loads them after the page is reloaded; until then it keeps the previous scripts.",
	"carrier.tavernHelper.reloadNow": "Reload now",
	"quickReplies.conflict": "A Quick Reply set named “{name}” already exists and was not made by Advanced Preset, so the preset’s set of that name is not installed. Rename your set to use it.",
	"error.toolsUnsupported.mainApi": "Tool calling needs a Chat Completion API. Switch the API type, or pick a recommended configuration that does not use tool calling.",
	"error.toolsUnsupported.postProcessing": "Prompt post-processing “{value}” removes tool calls from the prompt. In API Connections, set Prompt Post-Processing to None or an option “with tools”, or pick a recommended configuration that does not use tool calling.",
	"error.toolsUnsupported.functionCalling": "This SillyTavern version only allows tool calling with “Enable function calling” on. Turn it on in AI Response Configuration, or pick a recommended configuration that does not use tool calling.",
	"error.toolsUnsupported.model": "SillyTavern reports that {target} does not support tool calling. If the model does support it, turn on “Assume tool support” in the connection settings; otherwise switch the transport or pick a recommended configuration that does not use tool calling.",
	"error.binding.profileMissing": "The connection profile of this binding no longer exists. Pick another profile in the binding, or turn on SillyTavern's Connection Manager extension.",
	"error.binding.textCompletion": "Connection profile “{name}” is not a Chat Completion profile. Advanced Preset only sends Chat Completion requests: pick another profile.",
	"error.binding.customConnection": "Connection profile “{name}” stores its own Custom connection, which Advanced Preset cannot use yet. Bind the model name instead, or use a profile without a stored Custom connection.",
	"error.binding.noModel": "This binding has no model name. Enter one, or bind the current connection.",
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
	"appearance.language": "Interface language",
	"appearance.language.hint": "Language of the AP panel, its cards and the preset’s panel translations. Follows SillyTavern unless you pick one. Prompts sent to the model are not affected.",
	"appearance.language.auto": "Follow SillyTavern",
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
	"config.binding": "Binding",
	"config.binding.hint": "A binding pairs where requests go (SillyTavern's connection, a connection profile or a model name) with the transport settings below. The default binding is the connection as configured before; add bindings to run actors on other models with multi-model, or to switch models quickly.",
	"config.binding.default": "Default",
	"config.binding.add": "Add binding",
	"config.binding.newName": "Binding {n}",
	"config.binding.target": "Sends to",
	"config.binding.target.current": "Current connection",
	"config.binding.target.current.hint": "SillyTavern's current API connection, exactly as without bindings.",
	"config.binding.target.profile": "Connection profile",
	"config.binding.target.profile.hint": "A Chat Completion profile of SillyTavern's Connection Manager: its API, model, server URL, proxy, API key and prompt post-processing are used for these requests, without switching SillyTavern's connection. The profile's completion preset is not applied: sampling and prompts stay as Advanced Preset sets them.",
	"config.binding.target.model": "Model name",
	"config.binding.target.model.hint": "SillyTavern's current API connection with another model name.",
	"config.binding.profile": "Profile",
	"config.binding.profile.hint": "Text Completion profiles are not listed: Advanced Preset only sends Chat Completion requests.",
	"config.binding.profile.missing": "(profile not found)",
	"config.binding.profile.none": "No Chat Completion connection profiles. Create one with SillyTavern's Connection Manager (API Connections → Connection Profile).",
	"config.binding.model": "Model",
	"config.binding.model.hint": "The model id as the API expects it, e.g. what SillyTavern's model list shows for this source.",
	"config.binding.active": "Active binding",
	"config.binding.active.hint": "Binding every request uses.",
	"config.binding.active.multiModel": "Binding of requests outside the multi-model workflow (meta instruction replies, script calls). Story turns use the bindings set for each actor under Multi-model.",
	"multiModel.title": "Multi-model",
	"multiModel.hint": "Run the workflow's stages on the binding of the actor performing them. Consecutive stages of the same actor go out in one request; each request carries the earlier stages of the turn.",
	"multiModel.actor.hint": "Binding this actor's stages run on.",
	"multiModel.noBindings": "Only the default binding exists: add bindings under Connection to give actors their own models.",
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
	"um.grp.switch": "Whole group on / off: {name}",
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
	"media.image.api": "API",
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
	"media.speech.panel.empty": "Nothing to speak.",
	"media.speech.panel.playAll": "Play all",
	"media.speech.panel.count": "{n} segments",
	"media.speech.panel.tags": "Inline tags",
	"media.speech.panel.voice": "Voice",
	"media.speech.panel.noVoice": "No voice",
	"media.speech.panel.text": "Text spoken for {who}",
	"media.speech.panel.edited": "Edited",
	"media.speech.panel.save": "Save",
	"media.speech.panel.revert": "Revert",
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
	"media.image.prompt": "Prompt",
	"media.image.generate": "Generate",
	"media.image.retry": "Retry",
	"media.image.regenerate": "Regenerate",
	"media.image.openPanel": "Edit",
	"media.image.panel": "Image",
	"media.image.which": "Image",
	"media.image.nth": "Image {n}",
	"media.image.ratio": "Aspect ratio",
	"media.image.ratio.auto": "Auto",
	"media.image.caption": "Caption",
	"media.image.refs.unsupported": "This connection has no reference images.",
	"media.image.refs.empty": "No reference images in this chat.",
	"media.image.refs.unavailable": "Unavailable",
	"media.image.versions": "Versions",
	"media.image.versions.empty": "No images yet.",
	"media.image.show": "Show version {n}",
	"media.image.restore": "Revert",
	"media.image.saveGenerate": "Generate",
	"media.image.gone": "This image is no longer in the message.",
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
}, As = {
	"app.name": "Advanced Preset",
	"carrier.reset": "预设已更新，「{name}」中的手动修改已被重置。",
	"carrier.tavernHelper.reload": "「{name}」的酒馆助手脚本已更新。刷新页面后酒馆助手才会载入新脚本，在此之前仍使用旧脚本。",
	"carrier.tavernHelper.reloadNow": "立即刷新",
	"quickReplies.conflict": "已存在名为「{name}」的快速回复集且不是由 Advanced Preset 创建的，因此未安装预设中的同名快速回复集。将你的快速回复集改名后即可使用。",
	"error.toolsUnsupported.mainApi": "工具调用需要使用 Chat Completion API。请切换 API 类型，或选择不使用工具调用的推荐配置。",
	"error.toolsUnsupported.postProcessing": "提示词后处理「{value}」会从提示词中移除工具调用。请在 API 连接设置中把「提示词后处理」改为「未选择」或带「（含工具）」的选项，或选择不使用工具调用的推荐配置。",
	"error.toolsUnsupported.functionCalling": "当前版本的 SillyTavern 只在开启「启用函数调用」时允许工具调用。请在 AI 回复配置中开启它，或选择不使用工具调用的推荐配置。",
	"error.toolsUnsupported.model": "SillyTavern 判断 {target} 不支持工具调用。如果该模型确实支持，请在连接设置中开启「假定支持工具」；否则请切换传输模式，或选择不使用工具调用的推荐配置。",
	"error.binding.profileMissing": "此绑定的连接配置文件已不存在。请在绑定中选择其他连接配置文件，或开启 SillyTavern 的连接配置管理（Connection Manager）扩展。",
	"error.binding.textCompletion": "连接配置文件「{name}」不是 Chat Completion 配置文件。Advanced Preset 只发送 Chat Completion 请求，请选择其他连接配置文件。",
	"error.binding.customConnection": "连接配置文件「{name}」保存了自己的自定义连接，Advanced Preset 暂不支持使用。请改为绑定模型名称，或使用未保存自定义连接的配置文件。",
	"error.binding.noModel": "此绑定没有填写模型名称。请填写模型名称，或改为绑定当前连接。",
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
	"appearance.language": "界面语言",
	"appearance.language.hint": "AP 面板、卡片与预设面板翻译使用的语言，默认跟随 SillyTavern。不影响发给模型的提示词。",
	"appearance.language.auto": "跟随 SillyTavern",
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
	"config.binding": "绑定",
	"config.binding.hint": "绑定把请求的去向（SillyTavern 当前连接、连接配置文件或模型名称）与下方的传输设置组合在一起。默认绑定就是此前配置的连接；添加绑定后，可以在多模型中让各个角色使用不同的模型，或快速切换模型。",
	"config.binding.default": "默认",
	"config.binding.add": "添加绑定",
	"config.binding.newName": "绑定 {n}",
	"config.binding.target": "发送到",
	"config.binding.target.current": "当前连接",
	"config.binding.target.current.hint": "SillyTavern 当前的 API 连接，与不使用绑定时完全相同。",
	"config.binding.target.profile": "连接配置文件",
	"config.binding.target.profile.hint": "SillyTavern 连接配置管理中的 Chat Completion 配置文件：这些请求使用它的 API、模型、服务器地址、代理、API 密钥和提示词后处理，不会切换 SillyTavern 的连接。配置文件中的对话补全预设不会生效：采样参数与提示词仍由 Advanced Preset 决定。",
	"config.binding.target.model": "模型名称",
	"config.binding.target.model.hint": "SillyTavern 当前的 API 连接，但改用另一个模型名称。",
	"config.binding.profile": "配置文件",
	"config.binding.profile.hint": "不列出 Text Completion 配置文件：Advanced Preset 只发送 Chat Completion 请求。",
	"config.binding.profile.missing": "（找不到配置文件）",
	"config.binding.profile.none": "没有 Chat Completion 连接配置文件。请在 SillyTavern 的连接配置管理中创建（API 连接 → 连接配置文件）。",
	"config.binding.model": "模型",
	"config.binding.model.hint": "API 所需的模型 ID，例如 SillyTavern 在该来源的模型列表中显示的名称。",
	"config.binding.active": "当前绑定",
	"config.binding.active.hint": "所有请求使用的绑定。",
	"config.binding.active.multiModel": "多模型工作流之外的请求（元指令的回复、脚本调用）使用的绑定。故事轮次使用「多模型」中为各角色设置的绑定。",
	"multiModel.title": "多模型",
	"multiModel.hint": "工作流的各个步骤由执行它的角色所绑定的模型完成。同一角色的相邻步骤合并为一次请求；每次请求都会带上本轮之前的步骤。",
	"multiModel.actor.hint": "此角色的步骤使用的绑定。",
	"multiModel.noBindings": "目前只有默认绑定：请先在「连接」中添加绑定，再为角色指定各自的模型。",
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
	"um.grp.switch": "整组开关：{name}",
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
	"media.image.api": "接口",
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
	"media.speech.panel.empty": "没有可朗读的内容。",
	"media.speech.panel.playAll": "全部播放",
	"media.speech.panel.count": "{n} 段",
	"media.speech.panel.tags": "可用标签",
	"media.speech.panel.voice": "声音",
	"media.speech.panel.noVoice": "未设置声音",
	"media.speech.panel.text": "{who} 的语音提示",
	"media.speech.panel.edited": "已修改",
	"media.speech.panel.save": "保存",
	"media.speech.panel.revert": "还原",
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
	"media.image.prompt": "提示词",
	"media.image.generate": "生成",
	"media.image.retry": "重试",
	"media.image.regenerate": "重新生成",
	"media.image.openPanel": "编辑",
	"media.image.panel": "图像",
	"media.image.which": "图像",
	"media.image.nth": "图像 {n}",
	"media.image.ratio": "比例",
	"media.image.ratio.auto": "自动",
	"media.image.caption": "标题",
	"media.image.refs.unsupported": "当前连接不支持参考图。",
	"media.image.refs.empty": "本聊天没有参考图。",
	"media.image.refs.unavailable": "不可用",
	"media.image.versions": "版本",
	"media.image.versions.empty": "暂无图像。",
	"media.image.show": "显示第 {n} 个版本",
	"media.image.restore": "还原",
	"media.image.saveGenerate": "生成",
	"media.image.gone": "该图像已不在当前消息中。",
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
}, js = {
	"app.name": "Advanced Preset",
	"carrier.reset": "預設已更新，「{name}」中的手動修改已被重設。",
	"carrier.tavernHelper.reload": "「{name}」的酒館助手腳本已更新。重新整理頁面後酒館助手才會載入新腳本，在此之前仍使用舊腳本。",
	"carrier.tavernHelper.reloadNow": "立即重新整理",
	"quickReplies.conflict": "已存在名為「{name}」的快速回覆集且不是由 Advanced Preset 建立的，因此未安裝預設中的同名快速回覆集。將你的快速回覆集改名後即可使用。",
	"error.toolsUnsupported.mainApi": "工具呼叫需要使用 Chat Completion API。請切換 API 型別，或選擇不使用工具呼叫的推薦配置。",
	"error.toolsUnsupported.postProcessing": "提示詞後處理「{value}」會從提示詞中移除工具呼叫。請在 API 連線設定中把「提示詞後處理」改為「未選擇」或帶「（含工具）」的選項，或選擇不使用工具呼叫的推薦配置。",
	"error.toolsUnsupported.functionCalling": "目前版本的 SillyTavern 只在開啟「啟用函式呼叫」時允許工具呼叫。請在 AI 回覆配置中開啟它，或選擇不使用工具呼叫的推薦配置。",
	"error.toolsUnsupported.model": "SillyTavern 判斷 {target} 不支援工具呼叫。如果該模型確實支援，請在連線設定中開啟「假定支援工具」；否則請切換傳輸模式，或選擇不使用工具呼叫的推薦配置。",
	"error.binding.profileMissing": "此綁定的連線設定檔已不存在。請在綁定中選擇其他連線設定檔，或開啟 SillyTavern 的連線設定檔管理（Connection Manager）擴充功能。",
	"error.binding.textCompletion": "連線設定檔「{name}」不是 Chat Completion 設定檔。Advanced Preset 只傳送 Chat Completion 請求，請選擇其他連線設定檔。",
	"error.binding.customConnection": "連線設定檔「{name}」儲存了自己的自訂連線，Advanced Preset 暫不支援使用。請改為綁定模型名稱，或使用未儲存自訂連線的設定檔。",
	"error.binding.noModel": "此綁定沒有填寫模型名稱。請填寫模型名稱，或改為綁定目前連線。",
	"error.emptyTurn": "模型沒有傳回正文。",
	"error.signatureFallback": "目前通道不支援所選的思維簽名，已改為不傳送思維簽名重試。請在配置中切換思維簽名通道，或關閉思維簽名。",
	"update.reloading": "Advanced Preset 已更新，正在重新載入…",
	"update.none": "已是最新版本。",
	"update.forPreset": "「{name}」需要 Advanced Preset {version} 或更高版本，正在更新 Advanced Preset…",
	"update.failed": "更新失敗：{error}",
	"common.add": "新增",
	"common.later": "稍後",
	"common.cancel": "取消",
	"common.clear": "清空",
	"common.close": "關閉",
	"common.copy": "複製",
	"common.delete": "刪除",
	"common.edit": "編輯",
	"common.install": "安裝",
	"common.none": "無",
	"common.redo": "重做",
	"common.rename": "重新命名",
	"common.reset": "重設",
	"common.save": "儲存",
	"common.undo": "復原",
	"banner.usesAp": "目前預設使用 Advanced Preset",
	"panel.enabled": "啟用",
	"panel.open": "開啟面板",
	"panel.noPreset": "未選擇 Advanced Preset 預設",
	"panel.choosePreset": "選擇預設",
	"settings.enable": "啟用 Advanced Preset",
	"settings.preset": "目前預設",
	"settings.inactive": "未選擇。在對話補全預設中選擇「AP · …」即可啟用。",
	"tab.presets": "預設",
	"tab.config": "配置",
	"tab.modules": "模組",
	"tab.writing": "寫作",
	"tab.memory": "記憶",
	"tab.storylines": "故事線",
	"tab.debug": "除錯",
	"presets.importFile": "檔案",
	"presets.importUrl": "連結",
	"presets.checkUpdates": "檢查擴充功能更新",
	"presets.installed": "預設已安裝。",
	"presets.updated": "預設已更新。",
	"presets.update": "從來源更新",
	"presets.export": "匯出預設",
	"presets.invalid": "不是 Advanced Preset 預設檔案。",
	"presets.tooNew": "該預設需要 Advanced Preset {version} 或更高版本，且 Advanced Preset 未能自動更新到該版本。請在擴充功能面板中更新後重試。",
	"presets.apUpdating": "Advanced Preset 正在為「{name}」更新自身，頁面重新載入後會繼續安裝該預設。",
	"presets.autoUpdated": "已更新到 {version}。",
	"presets.backToBuiltin": "擴充功能內建的此預設已更新到 {version}，比你手動安裝的版本更新，已改用內建版本。",
	"presets.noSource": "此預設沒有更新來源。",
	"presets.none": "暫無預設。",
	"presets.source.builtin": "內建",
	"presets.source.installed": "已安裝",
	"presets.source.dev": "開發",
	"presets.templates": "程式碼",
	"presets.templates.help": "此預設包含範本：每次生成時會在瀏覽器中執行的 JavaScript 程式碼。",
	"appearance.title": "外觀",
	"appearance.colors": "主題色",
	"appearance.colors.hint": "覆蓋預設的主色與輔色。",
	"appearance.primary": "主色",
	"appearance.accent": "輔色",
	"appearance.collapseStages": "生成後摺疊階段",
	"appearance.annotations": "顯示批註",
	"appearance.annotations.hint": "被批註的文字顯示虛線底線；懸停或輕點檢視批註。",
	"appearance.annotationColor": "批註底線顏色",
	"appearance.language": "介面語言",
	"appearance.language.hint": "AP 面板、卡片與預設面板翻譯使用的語言，預設跟隨 SillyTavern。不影響傳送給模型的提示詞。",
	"appearance.language.auto": "跟隨 SillyTavern",
	"config.configuration": "配置",
	"config.recommended": "推薦",
	"config.saved": "已儲存",
	"config.saveAs": "另存為…",
	"config.overwrite": "儲存修改",
	"config.reset": "放棄修改",
	"config.name": "配置名稱",
	"config.modified": "已修改",
	"config.connection": "連線",
	"config.transport": "傳輸模式",
	"config.workflow": "工作流",
	"config.sampling": "取樣",
	"config.forceTool": "強制工具呼叫",
	"config.forceTool.hint": "要求模型必須呼叫工具（tool_choice）。",
	"config.parallelTools": "並行工具呼叫",
	"config.parallelTools.hint": "允許模型在一次回應中呼叫多個階段工具。",
	"config.syntheticTurn": "示範輪次",
	"config.syntheticTurn.hint": "預置一輪虛擬的工具呼叫，向模型示範工具用法。",
	"config.thoughtSignature": "思維簽名",
	"config.thoughtSignature.hint": "Gemini：示範輪次附帶的思維簽名。簽名只在簽發它的後端有效，請按請求實際到達的上游選擇，與 SillyTavern 的 API 連線或反向代理無關。關閉時改為傳送 skip_thought_signature_validator。",
	"config.openAiSignatures": "OR/CPA 簽名",
	"config.openAiSignatures.hint": "在 OpenAI 相容的連線上也傳送思維簽名：OpenRouter 的 reasoning_details 與 CLIProxyAPI（Google 格式）的 extra_content。僅在這類連線確實通向 Gemini 時開啟，其他端點可能拒絕這些額外欄位。",
	"config.thoughtSignature.off": "關閉",
	"config.thoughtSignature.vertex": "Vertex AI",
	"config.thoughtSignature.aistudio": "AI Studio",
	"config.streamToolArguments": "串流工具參數",
	"config.streamToolArguments.hint": "Gemini 的 generateContent 介面預設一次傳回完整的工具呼叫，需要顯式請求才會串流輸出參數；只有 Vertex AI（Gemini 3+）支援該請求，AI Studio 會靜默忽略。自動：在 Vertex AI、自訂 generateContent 端點與使用反向代理的 Gemini API 上請求；開啟：在所有 Gemini 格式的連線上請求。",
	"config.streamToolArguments.auto": "自動",
	"config.streamToolArguments.on": "開啟",
	"config.streamToolArguments.off": "關閉",
	"config.maxSteps": "最大步數",
	"config.assumeToolSupport": "假定支援工具",
	"config.assumeToolSupport.hint": "跳過 SillyTavern 對 API 來源和模型的檢查。該檢查依據模型列表中的後設資料，可能把實際支援工具呼叫的模型判為不支援。僅在確認模型支援時開啟，否則請求會被服務商拒絕。",
	"config.finalFallback": "純文字後備",
	"config.finalFallback.hint": "沒有收到正文階段時，把模型的純文字當作正文。",
	"config.binding": "綁定",
	"config.binding.hint": "綁定把請求的去向（SillyTavern 目前連線、連線設定檔或模型名稱）與下方的傳輸設定組合在一起。預設綁定就是先前設定的連線；新增綁定後，可以在多模型中讓各個角色使用不同的模型，或快速切換模型。",
	"config.binding.default": "預設",
	"config.binding.add": "新增綁定",
	"config.binding.newName": "綁定 {n}",
	"config.binding.target": "傳送到",
	"config.binding.target.current": "目前連線",
	"config.binding.target.current.hint": "SillyTavern 目前的 API 連線，與不使用綁定時完全相同。",
	"config.binding.target.profile": "連線設定檔",
	"config.binding.target.profile.hint": "SillyTavern 連線設定檔管理中的 Chat Completion 設定檔：這些請求使用它的 API、模型、伺服器位址、代理、API 金鑰和提示詞後處理，不會切換 SillyTavern 的連線。設定檔中的對話補全預設不會生效：取樣參數與提示詞仍由 Advanced Preset 決定。",
	"config.binding.target.model": "模型名稱",
	"config.binding.target.model.hint": "SillyTavern 目前的 API 連線，但改用另一個模型名稱。",
	"config.binding.profile": "設定檔",
	"config.binding.profile.hint": "不列出 Text Completion 設定檔：Advanced Preset 只傳送 Chat Completion 請求。",
	"config.binding.profile.missing": "（找不到設定檔）",
	"config.binding.profile.none": "沒有 Chat Completion 連線設定檔。請在 SillyTavern 的連線設定檔管理中建立（API 連線 → 連線設定檔）。",
	"config.binding.model": "模型",
	"config.binding.model.hint": "API 所需的模型 ID，例如 SillyTavern 在該來源的模型清單中顯示的名稱。",
	"config.binding.active": "目前綁定",
	"config.binding.active.hint": "所有請求使用的綁定。",
	"config.binding.active.multiModel": "多模型工作流之外的請求（元指令的回覆、腳本呼叫）使用的綁定。故事輪次使用「多模型」中為各角色設定的綁定。",
	"multiModel.title": "多模型",
	"multiModel.hint": "工作流的各個步驟由執行它的角色所綁定的模型完成。同一角色的相鄰步驟合併為一次請求；每次請求都會帶上本輪之前的步驟。",
	"multiModel.actor.hint": "此角色的步驟使用的綁定。",
	"multiModel.noBindings": "目前只有預設綁定：請先在「連線」中新增綁定，再為角色指定各自的模型。",
	"transport.prefill": "預填充",
	"transport.plaintext": "純文字",
	"transport.structured": "結構化",
	"transport.tool-single": "工具",
	"transport.tool-multi": "多工具",
	"transport.prefill.hint": "整段對話渲染為一條助手預填充，由模型續寫。",
	"transport.plaintext.hint": "各階段以帶標籤的純文字寫在一條回覆中。",
	"transport.structured.hint": "回覆為 JSON 物件（json_schema），每個階段一個欄位。",
	"transport.tool-single.hint": "一次工具呼叫，以參數承載全部階段。",
	"transport.tool-multi.hint": "每個階段一個工具，逐步呼叫。",
	"sampling.temperature": "溫度",
	"sampling.top_p": "Top P",
	"sampling.top_k": "Top K",
	"sampling.min_p": "Min P",
	"sampling.top_a": "Top A",
	"sampling.frequency_penalty": "頻率懲罰",
	"sampling.presence_penalty": "存在懲罰",
	"sampling.repetition_penalty": "重複懲罰",
	"sampling.openai_max_context": "上下文長度",
	"sampling.openai_max_tokens": "最大回覆長度",
	"sampling.seed": "種子",
	"sampling.stream_openai": "串流傳輸",
	"sampling.show_thoughts": "顯示思維鏈",
	"sampling.reasoning_effort": "推理強度",
	"effort.auto": "自動",
	"effort.min": "最低",
	"effort.low": "低",
	"effort.medium": "中",
	"effort.high": "高",
	"effort.max": "最高",
	"modules.other": "其他",
	"modules.none": "該預設沒有可選模組。",
	"writing.params": "參數",
	"writing.listPlaceholder": "輸入一項，按 Enter 新增",
	"writing.actors": "名稱與字首",
	"writing.actorName": "名稱 · {actor}",
	"writing.actorPrefix": "字首",
	"writing.tokenSaving": "節省 Token",
	"writing.tokenSaving.hint": "較早的輪次替換為事件摘要；較早的使用者訊息可保留、截斷或移除。",
	"writing.keepFullTurns": "保留完整輪數",
	"writing.keepFullTurns.hint": "最近若干條助手回覆保持原文。",
	"writing.truncateUserAfter": "使用者訊息截斷",
	"writing.truncateUserAfter.hint": "較早使用者訊息保留的字元數（0 為不截斷）。",
	"writing.userInput": "較早的使用者訊息",
	"writing.userInput.hint": "完整輪次之外的使用者訊息如何處理。擴寫類寫法中，正文（及其事件摘要）已包含使用者輸入，適合移除。",
	"writing.userInput.keep": "保留",
	"writing.userInput.keep.hint": "原樣傳送",
	"writing.userInput.truncate": "截斷",
	"writing.userInput.truncate.hint": "只保留開頭若干字元",
	"writing.userInput.remove": "移除",
	"writing.userInput.remove.hint": "完全不傳送",
	"writing.cache": "快取最佳化",
	"writing.cache.hint": "黏性渲染：提示詞快取還可能命中時，每條歷史訊息保持上一次請求的渲染方式（原文 / 摘要、使用者訊息處理、歷史中附帶的結構、批註），只有新訊息按規則渲染。超過快取有效期、更換模型或來源、工具或 Schema 變化、歷史之前的提示詞變化（如世界書啟用），或推遲輪次超過上限時，一次全部套用。",
	"writing.cacheTtl": "快取有效期（分鐘）",
	"writing.cacheTtl.hint": "從上次成功請求起算，超過後視為快取已失效。與服務商的快取時長一致（如 Claude 預設 5 分鐘、開啟 1 小時快取後為 60）；0 為不限。",
	"writing.cacheMaxDeferred": "最大快取保護輪次",
	"writing.cacheMaxDeferred.hint": "渲染變化最多推遲多少輪請求，超過後一次全部套用。數值越大快取命中越多，但歷史中按舊規則渲染的訊息也越多；0 為不推遲。",
	"writing.meta": "元指令",
	"writing.meta.hint": "以觸發詞（如 @Freesia）開頭、寫給敘述者的故事外指令。關閉後不再識別，按普通故事輸入傳送。",
	"writing.recentCount": "保留近期元指令",
	"writing.recentCount.hint": "模型可見的之前元指令條數。",
	"memory.chat": "聊天記憶",
	"memory.chat.hint": "屬於目前聊天，隨刪除、重新生成與滑動回滾。",
	"memory.global": "全域記憶",
	"memory.global.hint": "使用該預設的所有聊天共享。回覆寫入的條目跟隨該回覆：刪除、重新生成或滑走時撤銷，切回該版本時恢復。",
	"memory.recap": "總結",
	"memory.recap.hint": "替代其覆蓋範圍內歷史的摘要。",
	"memory.recap.empty": "暫無總結",
	"memory.key": "標題",
	"memory.content": "內容",
	"memory.empty": "空",
	"memory.deleted": "已刪除",
	"memory.noChat": "請先開啟一個聊天。",
	"cards.impersonate": "代寫",
	"cards.fillInput": "填入輸入框",
	"cards.options": "選項",
	"cards.optionHint": "點選填入 · Ctrl/⌘ 點選直接傳送",
	"cards.synopsis.edit": "編輯事件摘要",
	"cards.synopsis.time": "時間",
	"cards.synopsis.location": "地點",
	"cards.synopsis.event": "事件",
	"cards.synopsis.summary": "概要",
	"cards.synopsis.keys": "Ctrl+Enter 儲存 · Esc 取消",
	"cards.status.edit": "編輯狀態列",
	"cards.status.date": "日期",
	"cards.status.weekday": "星期",
	"cards.status.time": "時間",
	"cards.status.location": "地點",
	"cards.status.weather": "天氣",
	"cards.status.keys": "Enter 儲存 · Esc 取消",
	"cards.recap": "總結",
	"stages.requests": "{n} 次請求",
	"stages.revertDraft": "還原草稿（補丁前）",
	"stages.reapplyPatches": "重新套用補丁",
	"stages.waiting": "準備中…",
	"stage.pending": "等待中",
	"stage.streaming": "書寫中…",
	"stage.done": "空",
	"stage.missing": "未生成",
	"stage.interrupted": "已中斷",
	"patch.not-found": "未找到",
	"patch.ambiguous": "多處匹配",
	"patch.empty": "空補丁",
	"debug.dev": "開發來源",
	"debug.dev.hint": "在預設倉庫執行 `ap dev` 並填入地址；每次構建後預設自動重新載入。",
	"debug.dev.url": "服務地址",
	"debug.dev.off": "關閉",
	"debug.dev.connecting": "連線中",
	"debug.dev.online": "線上",
	"debug.dev.error": "無法連線",
	"debug.cached": "命中快取 {n}",
	"debug.cache.kept": "快取：沿用上次渲染",
	"debug.cache.flush.first": "快取：首次請求",
	"debug.cache.flush.ttl": "快取：已過期，全部重新整理",
	"debug.cache.flush.model": "快取：模型 / 來源變化，全部重新整理",
	"debug.cache.flush.tools": "快取：工具 / Schema 變化，全部重新整理",
	"debug.cache.flush.prompt": "快取：歷史前提示詞變化，全部重新整理",
	"debug.cache.flush.turns": "快取：推遲輪次達到上限，全部重新整理",
	"debug.cache.stats": "{sticky} 條沿用 · {fresh} 條按規則渲染",
	"debug.cache.postponed": "{n} 條變更推遲（第 {d}/{max} 輪）",
	"debug.cache.unmatched": "{n} 條無法定位",
	"debug.assembly": "最近組裝",
	"debug.noAssembly": "尚未組裝。",
	"debug.emptyRegion": "空",
	"debug.input.wrap": "輸入已包裹",
	"debug.input.extract": "輸入已提取",
	"debug.input.none": "輸入未整形",
	"debug.requests": "請求",
	"debug.noRequests": "暫無請求。",
	"debug.request": "請求",
	"debug.response": "回應",
	"debug.error": "錯誤",
	"debug.log": "日誌",
	"debug.noLog": "空",
	"debug.annotations": "孤立批註與臺詞",
	"debug.annotations.hint": "原文被編輯後已找不到對應文字的批註與臺詞。它們會被保留，但不會顯示。",
	"debug.noOrphans": "目前聊天沒有。",
	"debug.orphanSpeech": "臺詞",
	"um.title": "我的模組",
	"um.help": "在預設開放的插入位置加入你自己的提示詞。它們儲存在本地，預設更新後仍會保留。預設提供範本時，新建模組可以從範本開始。預設也可以自帶模組，它們和你自己的模組一樣可以修改；匯出預設時可以選擇一起匯出哪些模組。",
	"um.noPoints": "此預設沒有開放插入位置。",
	"um.new": "新建模組",
	"um.newName": "我的模組 {n}",
	"um.startFrom": "從哪裡開始",
	"um.blank": "空白模組",
	"um.blank.desc": "從零開始編寫。",
	"um.untitled": "未命名模組",
	"um.copyName": "{name} 副本",
	"um.import": "匯入",
	"um.exportAll": "全部匯出",
	"um.export": "匯出",
	"um.duplicate": "建立副本",
	"um.confirmDelete": "確認刪除",
	"um.back": "返回",
	"um.reorder": "拖曳排序",
	"um.grp.new": "新建組",
	"um.grp.newName": "分組 {n}",
	"um.grp.untitled": "未命名分組",
	"um.grp.name": "組名",
	"um.grp.reorder": "拖曳排序分組",
	"um.grp.collapse": "摺疊",
	"um.grp.expand": "展開",
	"um.grp.count": "{n} 個模組",
	"um.grp.single": "單選：組內最多開啟一個（點選改為多選）",
	"um.grp.multi": "多選：組內可同時開啟多個（點選改為單選）",
	"um.grp.radioOn": "選用此項",
	"um.grp.radioOff": "關閉",
	"um.grp.addModule": "在此組中新建模組",
	"um.grp.export": "匯出組",
	"um.grp.delete": "刪除組",
	"um.grp.deleteAsk": "刪除此組及其中的 {n} 個模組？",
	"um.grp.keepModules": "保留模組",
	"um.grp.deleteModules": "連同模組刪除",
	"um.grp.empty": "將模組拖到這裡",
	"um.grp.dropOut": "拖到這裡移出分組",
	"um.grp.none": "未分組",
	"um.grp.switch": "整組開關：{name}",
	"um.grp.moveTo": "移到分組",
	"um.noEntries": "無內容",
	"um.name": "模組名稱",
	"um.imported": "已匯入 {n} 個模組。",
	"um.importedGroups": "已匯入 {groups} 個組中的 {n} 個模組。",
	"um.importedMissing": "其中 {missing} 個引用了失效的插入位置或變數。",
	"um.importFailed": "匯入失敗：{error}",
	"um.lostHint": "預設中已不存在：{points}。相關內容不會生效。",
	"um.lostAfterUpdate": "預設更新後，以下模組的部分插入位置或變數已失效：{names}",
	"um.bundled.conflictTitle": "預設中的模組有更新",
	"um.bundled.conflictBody": "「{name}」更新了以下隨預設提供的模組，你的副本與新版本不同。勾選的模組將換成預設的新版本（保留開關狀態），未勾選的保留你的版本。",
	"um.bundled.modified": "（你修改過）",
	"um.bundled.unmodified": "（未修改過）",
	"um.bundled.apply": "套用",
	"um.bundled.keepAll": "全部保留我的",
	"um.bundled.added": "已新增預設提供的 {n} 個模組：{names}",
	"um.bundled.exportTitle": "匯出「{name}」",
	"um.bundled.exportBody": "選擇要隨預設一起匯出的自訂模組。對方安裝預設時，這些模組會加入他們的「我的模組」。",
	"um.bundled.disabled": "（已關閉）",
	"um.bundled.export": "匯出",
	"um.content": "插入內容",
	"um.content.help": "選擇預設開放的插入位置並寫入提示詞。支援 {{ap::…}} 巨集，以及 <!-- @if 條件 --> … <!-- @end -->、<!-- @as assistant --> 等指令，以及 <!-- @template --> … <!-- @end --> 範本（EJS 語法的 JavaScript，可讀取 params、gen、vars 等變數）；<!--# … --> 為註解（可跨行），不會發送給 AI。角色預設跟隨插入位置所在的區域。",
	"um.point": "插入位置",
	"um.pointMissing": "{id}（已失效）",
	"um.pointLost": "該插入位置已被預設移除，這段內容不會生效。",
	"um.bv": "構建變數",
	"um.bv.help": "向預設在提示詞中讀取的變數（如規劃要點）新增內容：文字追加到末尾，列表新增項，字典設定鍵。與預設同鍵時以你的為準；值留空即移除預設的該項。",
	"um.bv.add": "更新變數",
	"um.bv.lost": "預設已移除此變數或更改了型別，這項更新不會生效。",
	"um.bv.append": "要追加的內容…",
	"um.bv.item": "項",
	"um.bv.key": "鍵",
	"um.bv.value": "值",
	"um.bv.removes": "留空即移除此項",
	"um.bv.addKey": "新增鍵",
	"um.bv.addItem": "新增項",
	"um.role": "角色",
	"um.role.merge": "跟隨區域",
	"um.role.system": "系統",
	"um.role.user": "使用者",
	"um.role.assistant": "助手",
	"um.removeEntry": "移除",
	"um.addEntry": "新增插入位置",
	"um.text.placeholder": "要插入的提示詞…",
	"um.lineError": "第 {line} 行：{message}",
	"um.trigger": "觸發條件",
	"um.trigger.help": "沒有條件時始終生效。關鍵詞條件檢查本輪輸入或最近的訊息，不區分大小寫，也可以使用正規表示式。",
	"um.always": "始終生效",
	"um.addRule": "新增條件",
	"um.removeRule": "移除條件",
	"um.subject": "條件型別",
	"um.match.all": "滿足全部",
	"um.match.any": "滿足任一",
	"um.match.allJoin": "且",
	"um.match.anyJoin": "或",
	"um.or": "、",
	"um.boolDesc": "{label}：{value}",
	"um.op.on": "是",
	"um.op.off": "否",
	"um.op.module.on": "開啟",
	"um.op.module.off": "關閉",
	"um.op.list.on": "有內容",
	"um.op.list.off": "為空",
	"um.op.in": "是",
	"um.op.notIn": "不是",
	"um.keyword": "關鍵詞",
	"um.expr": "表示式",
	"um.kw.input": "本輪輸入",
	"um.kw.recent": "最近訊息",
	"um.kw.recentN": "最近 {n} 條訊息",
	"um.kw.messages": "條",
	"um.kw.any": "包含任一",
	"um.kw.none": "均不包含",
	"um.kw.placeholder": "輸入關鍵詞，按 Enter 新增",
	"um.kw.regexPlaceholder": "輸入正規表示式，按 Enter 新增",
	"um.kw.regex": "正規表示式",
	"um.group.chat": "聊天",
	"um.group.generation": "本輪生成",
	"um.group.preset": "預設與配置",
	"um.group.advanced": "進階",
	"um.var.style": "提示風格",
	"um.style.dialogue": "對話式",
	"um.style.imperative": "指令式",
	"um.var.origin": "生成來源",
	"um.origin.story": "故事",
	"um.origin.task": "任務",
	"um.var.genType": "生成型別",
	"um.genType.normal": "普通",
	"um.genType.regenerate": "重新生成",
	"um.genType.swipe": "滑動",
	"um.genType.continue": "繼續",
	"um.genType.quiet": "靜默",
	"um.genType.impersonate": "代寫",
	"um.var.metaPresent": "含元指令",
	"um.var.metaPure": "純元指令",
	"um.var.group": "群聊",
	"um.var.hasChat": "有聊天記憶",
	"um.var.hasGlobal": "有全域記憶",
	"um.var.recap": "有總結",
	"um.var.inputShaped": "輸入已整形",
	"um.var.imageOn": "影像生成已開啟",
	"um.var.speechOn": "語音合成已開啟",
	"um.var.module": "模組",
	"um.var.param": "參數",
	"um.var.flag": "正則標記",
	"trust.presetTitle": "此預設包含可執行程式碼",
	"trust.modulesTitle": "這些模組包含可執行程式碼",
	"trust.preset": "「{name}」",
	"trust.modules": "此檔案中的 {n} 個模組",
	"trust.body": "{what}包含 {n} 個範本。範本是 JavaScript 程式碼，每次生成時在瀏覽器中執行，擁有與擴充功能相同的權限（可以存取你的聊天、設定與 API 連線）。",
	"trust.risk": "僅在信任該檔案的來源時繼續。程式碼如下：",
	"trust.install": "信任並安裝",
	"trust.import": "信任並匯入",
	"trust.declined": "已取消：未信任其中的程式碼。",
	"warn.template": "範本執行出錯，已從提示詞中略去：{error}",
	"common.listSeparator": "、",
	"trust.qrTitle": "此預設包含自動執行的快速回覆",
	"trust.qrBody": "「{name}」帶有 {n} 個無需點選即會執行的快速回覆（啟動時、收到訊息時、由世界書觸發……）。其中的命令（STscript）與任何快速回覆一樣，可以傳送訊息、修改你的聊天與設定。",
	"trust.uiTitle": "此預設包含自訂介面元件",
	"trust.uiBody": "「{name}」為 {n} 個結構提供了自己的卡片元件（{list}），會顯示在聊天訊息中。元件是預設附帶的程式碼（EJS 範本或 JavaScript 模組），在瀏覽器中執行，擁有與擴充功能相同的權限（可以存取你的聊天、設定與 API 連線）。",
	"trust.uiRisk": "僅在信任該預設的來源時啟用。不啟用時這些元件不會顯示，之後可在「配置 → 自訂 UI」中開啟。程式碼如下：",
	"trust.enableUi": "信任並啟用",
	"trust.notNow": "暫不啟用",
	"config.customUi": "自訂 UI",
	"config.customUi.hint": "預設為下列結構提供了自己的卡片元件。元件是預設附帶的程式碼，只在啟用後顯示；預設更新改動了元件程式碼時需要重新確認。",
	"config.customUi.enable": "啟用自訂 UI",
	"config.customUi.template": "範本",
	"config.customUi.module": "模組",
	"config.customUi.top": "訊息頂部",
	"config.customUi.bottom": "訊息底部",
	"config.customUi.changed": "元件程式碼已更新，需要重新啟用。",
	"cards.custom.error": "元件出錯：{error}",
	"storylines.help": "#名稱 — 寫支線「名稱」（不加標籤即為主線）\n# — 繼續最近的支線\n#? — 由 AI 命名的新支線\n#if名稱、#if? — if 線，故事的另一種可能（預設對其他線不可見）\n#@名稱、#@、#@? — 讓這條線對其他線不可見\n#!名稱、#!、#!? — 收到回覆後設為主線\n\n# 前可以不加空格（緊跟英文字母或數字時除外）。展開故事線可使用工具列，點選樓層可跳轉。",
	"storylines.count": "{n} 條故事線",
	"storylines.enabled": "故事線",
	"storylines.config.hint": "關閉後 #標籤 按普通文字傳送，歷史按原順序傳送。",
	"storylines.freezeVariables": "阻止支線變數更新",
	"storylines.freezeVariables.hint": "被阻止的輪次中，MVU 不執行變數更新命令；酒館助手的聊天變數與本輪訊息變數恢復為本輪開始時的狀態，支線的狀態不會帶回主線。預設透過 storyline.frozen 讀取，並提示 AI 不要更新狀態。",
	"storylines.freeze.all": "全部",
	"storylines.freeze.all.hint": "主線以外的所有故事線",
	"storylines.freeze.if": "僅 if 線",
	"storylines.freeze.if.hint": "只有 if 線",
	"storylines.freeze.off": "停用",
	"storylines.freeze.off.hint": "所有故事線都正常更新變數",
	"storylines.main": "主線",
	"storylines.mainNamed": "主線 · {name}",
	"storylines.current": "目前",
	"storylines.ifLine": "if 線",
	"storylines.ifLine.toggle": "if 線",
	"storylines.visible.toggle": "對其他故事線可見",
	"storylines.hidden": "不可見",
	"storylines.floors": "{n} 層",
	"storylines.empty": "還沒有訊息。",
	"storylines.jump": "跳轉到這條訊息",
	"storylines.user": "輸入",
	"storylines.narrator": "回覆",
	"storylines.makeMain": "設為主線",
	"storylines.renameTitle": "重新命名「{name}」",
	"storylines.nameMain": "命名主線",
	"storylines.nameMain.hint": "主線的名稱：切換主線後，原主線以這個名稱保留為支線。",
	"storylines.openTab": "開啟故事線面板",
	"storylines.switch": "切換主線",
	"storylines.switchTitle": "將「{name}」設為主線",
	"storylines.askOldMain": "目前主線還沒有名稱。請為它命名，切換後它將以這個名稱保留為一條支線：",
	"storylines.switched": "主線已切換為「{name}」。",
	"storylines.nameTaken": "已有名為「{name}」的故事線。",
	"storylines.invalidName": "故事線名稱不能為空，不能包含空格或 #，不能以 ! 或 ? 開頭，且不超過 64 個字元。",
	"storylines.noRecent": "這條輸入之前沒有其他故事線，按主線繼續。",
	"storylines.fallback.side": "支線",
	"storylines.fallback.if": "if線",
	"storylines.fallback.main": "原主線",
	"storylines.switchFailed": "未能將「{name}」設為主線，這條回覆保留在該故事線上。",
	"storylines.unnamed": "未命名",
	"presetFile.installer": "附帶 Advanced Preset 安裝腳本",
	"presetFile.installerHint": "匯出的檔案可作為普通的酒館預設匯入。未安裝 Advanced Preset 時，安裝腳本會提示安裝擴充功能。",
	"presetFile.adopted": "已根據匯入的預設「{file}」完成設定，現為「{carrier}」。",
	"tab.media": "多模態",
	"media.cors": "CORS 代理",
	"media.cors.auto": "自動",
	"media.cors.auto.hint": "先直連；瀏覽器攔截時改走代理",
	"media.cors.on": "始終",
	"media.cors.on.hint": "所有請求都走代理",
	"media.cors.off": "關閉",
	"media.cors.off.hint": "只直連",
	"media.proxy": "代理",
	"media.proxy.host.st": "SillyTavern 的 /proxy（需在 config.yaml 中設定 enableCorsProxy: true）",
	"media.proxy.host.tt": "TauriTavern 的 /proxy（dev 版本）",
	"media.proxy.custom": "自訂",
	"media.proxy.custom.hint": "相容的公共 CORS 代理",
	"media.proxy.url": "代理地址",
	"media.connection": "連線",
	"media.noConnection": "還沒有連線。",
	"media.addConnection": "新增連線",
	"media.connection.default": "連線 {n}",
	"media.connection.copyName": "{name}（副本）",
	"media.advanced": "進階",
	"media.headers": "請求頭",
	"media.headers.hint": "新增或覆蓋內建請求頭；值留空則刪除該請求頭。",
	"media.headers.name": "名稱",
	"media.headers.value": "值",
	"media.body": "請求體",
	"media.body.hint": "JSON 物件，深度合併進內建請求體；null 刪除欄位。",
	"media.auto": "自動生成",
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
	"media.speech.openrouterModel": "模型的能力（內聯標籤、語音克隆、預設聲音）按模型 id 中的提供者判斷，例如 elevenlabs/eleven-v3、fish-audio/s2.1-pro。聲音列表按模型獲取。",
	"media.image": "影像生成",
	"media.image.auto.hint": "關閉時，點選“生成”後才生成影像。",
	"media.image.api": "介面",
	"media.image.promptType": "提示詞型別",
	"media.image.promptType.tags": "標籤",
	"media.image.promptType.tags.hint": "逗號分隔的 Danbooru 風格標籤（NovelAI 等）",
	"media.image.promptType.description": "描述",
	"media.image.promptType.description.hint": "一整段英文影像描述（SD、Midjourney 等）",
	"media.image.promptType.instruction": "指令",
	"media.image.promptType.instruction.hint": "直接提出影像要求的自然語言，不限語言（GPT Image、Nano Banana 等多模態模型）",
	"media.image.refs.global": "全域",
	"media.image.style": "風格提示詞",
	"media.image.style.hint": "附加到每條影像提示詞後。預設會知道已設定風格，AI 不再寫風格。",
	"media.image.style.nl": "例如：柔和的水彩插畫，低飽和配色",
	"media.image.style.tags": "例如：watercolor, pastel colors, soft lighting",
	"media.image.negative": "負面提示詞",
	"media.image.negative.placeholder": "例如：lowres, bad anatomy, watermark",
	"media.image.nsfwBlock": "遮蔽 NSFW",
	"media.image.nsfwBlock.hint": "AI 不為 NSFW 場景寫影像提示詞。",
	"media.image.refs": "參考圖",
	"media.image.refs.hint": "AI 可按 id 選用，保持角色與風格一致。角色卡的參考圖只在該角色的聊天中使用。",
	"media.image.refs.description": "圖中內容",
	"media.image.refs.add": "新增圖片",
	"media.image.geminiEndpoint": "API",
	"media.scope.toggle": "{current} · 點選改為{next}",
	"media.speech": "語音合成",
	"media.speech.narrator": "旁白語音",
	"media.speech.narrator.hint": "角色臺詞以外的文字由旁白聲音朗讀。",
	"media.speech.auto.hint": "關閉時，播放時才生成語音。",
	"media.speech.api": "介面",
	"media.speech.narratorVoice": "旁白聲音",
	"media.speech.bindings": "角色聲音",
	"media.speech.bindings.hint": "故事角色與對應的聲音，可用於所有聊天或只用於某張角色卡。AI 會得到目前聊天適用的角色名；沒有聲音的角色會在朗讀前請你選擇。",
	"media.speech.character": "角色",
	"media.speech.addBinding": "新增角色",
	"media.speech.providerDefault": "提供者預設",
	"media.speech.global": "全域",
	"media.speech.scope": "適用於",
	"media.speech.ask": "為 {name} 選擇聲音",
	"media.speech.voiceId": "聲音 ID",
	"media.speech.voiceSearch": "聲音 ID 或搜尋",
	"media.speech.search.none": "沒有找到聲音。",
	"media.speech.clone": "參考音訊",
	"media.speech.clone.text": "參考音訊的文字內容",
	"media.speech.clone.consent": "新增授權錄音",
	"media.speech.clone.consentSet": "已新增授權錄音",
	"media.speech.test": "試聽",
	"media.speech.sample": "你好，這是我的聲音。",
	"media.speech.narration": "旁白",
	"media.speech.lines": "臺詞",
	"media.speech.play": "播放",
	"media.speech.pause": "暫停",
	"media.speech.stop": "停止",
	"media.speech.generateAll": "全部生成",
	"media.speech.download": "下載音訊",
	"media.speech.regenerateLine": "重新生成這一句",
	"media.speech.deleteLine": "刪除這一句的語音",
	"media.speech.regenerateAll": "全部重新生成",
	"media.speech.deleteAll": "刪除語音",
	"media.speech.panel.open": "語音面板",
	"media.speech.panel.title": "語音",
	"media.speech.panel.off": "語音合成未開啟。",
	"media.speech.panel.empty": "沒有可朗讀的內容。",
	"media.speech.panel.playAll": "全部播放",
	"media.speech.panel.count": "{n} 段",
	"media.speech.panel.tags": "可用標籤",
	"media.speech.panel.voice": "聲音",
	"media.speech.panel.noVoice": "未設定聲音",
	"media.speech.panel.text": "{who} 的語音提示",
	"media.speech.panel.edited": "已修改",
	"media.speech.panel.save": "儲存",
	"media.speech.panel.revert": "還原",
	"media.speech.panel.generate": "生成",
	"media.speech.state.none": "未生成",
	"media.speech.state.loading": "生成中",
	"media.speech.state.ready": "已生成",
	"media.speech.state.error": "失敗",
	"media.speech.state.playing": "播放中",
	"media.image.view": "檢視大圖",
	"media.image.generating": "生成中…",
	"media.image.previous": "上一張",
	"media.image.next": "下一張",
	"media.image.prompt": "提示詞",
	"media.image.generate": "生成",
	"media.image.retry": "重試",
	"media.image.regenerate": "重新生成",
	"media.image.openPanel": "編輯",
	"media.image.panel": "影像",
	"media.image.which": "影像",
	"media.image.nth": "影像 {n}",
	"media.image.ratio": "比例",
	"media.image.ratio.auto": "自動",
	"media.image.caption": "標題",
	"media.image.refs.unsupported": "目前連線不支援參考圖。",
	"media.image.refs.empty": "本聊天沒有參考圖。",
	"media.image.refs.unavailable": "不可用",
	"media.image.versions": "版本",
	"media.image.versions.empty": "暫無影像。",
	"media.image.show": "顯示第 {n} 個版本",
	"media.image.restore": "還原",
	"media.image.saveGenerate": "生成",
	"media.image.gone": "該影像已不在目前訊息中。",
	"media.image.download": "下載",
	"media.error.proxy.disabled": "SillyTavern 的 CORS 代理未開啟。請在 config.yaml 中設定 enableCorsProxy: true 並重啟，或改用自訂代理。",
	"media.error.proxy.unsupported": "目前 TauriTavern 版本沒有 CORS 代理。請更新 TauriTavern，或改用自訂代理。",
	"media.error.proxy.body": "SillyTavern 的 CORS 代理只轉發 JSON 請求。請對此 API 關閉代理，或改用自訂代理。",
	"media.error.proxy.noCustomUrl": "請在多模態標籤頁填寫自訂代理地址。",
	"media.error.noConnection": "沒有影像連線。請在多模態標籤頁新增。",
	"media.error.network": "請求被攔截或無法連線伺服器。請檢查 Base URL，或把 CORS 代理設為自動 / 始終。",
	"media.error.body": "請求體覆蓋無效：{error}",
	"debug.images": "生成的影像",
	"debug.images.hint": "刪除已沒有任何聊天使用的影像（已刪除的訊息、swipe 或聊天）。會先掃描所有聊天。",
	"debug.images.clean": "清理未使用的影像",
	"debug.images.confirm": "掃描所有聊天，並刪除沒有任何聊天使用的生成影像？此操作無法復原。",
	"debug.images.scanning": "正在掃描聊天 {done} / {total}",
	"debug.images.done": "已刪除 {removed} 張，保留 {kept} 張。",
	"debug.images.failed": "未刪除任何影像：{error}",
	"media.image.missing": "此裝置上找不到該影像"
}, Ms = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], Ns = [
	"auto",
	"on",
	"off"
], Ps = [
	"off",
	"vertex",
	"aistudio"
], Fs = ["annotations", "speech"], Is = (e) => Fs.includes(e.kind), Ls = [
	"keep",
	"truncate",
	"remove"
], Rs = [
	"current",
	"profile",
	"model"
], zs = [
	"transport",
	"forceTool",
	"parallelTools",
	"syntheticTurn",
	"sendThoughtSignature",
	"openAiSignatures",
	"streamToolArguments",
	"maxSteps",
	"assumeToolSupport"
], Bs = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Vs = [
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
function Hs(e) {
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
			if (i >= e.length) throw new Bs("Unterminated string", e, n);
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
		let i = Vs.find((t) => e.startsWith(t, n));
		if (!i) throw new Bs(`Unexpected character '${r}'`, e, n);
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
var Us = {
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
function Ws(e) {
	let t = Hs(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Bs(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Us ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new Bs(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Bs("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Us[n];
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
	if (u.k !== "end") throw new Bs("Unexpected token", e, u.pos);
	return l;
}
function Gs(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function Ks(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function qs(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => qs(e, t));
		case "var": return t(e.path);
		case "not": return !Ks(qs(e.e, t));
		case "bin": {
			if (e.op === "&&") return Ks(qs(e.l, t)) && Ks(qs(e.r, t));
			if (e.op === "||") return Ks(qs(e.l, t)) || Ks(qs(e.r, t));
			let n = qs(e.l, t), r = qs(e.r, t);
			switch (e.op) {
				case "==": return Gs(n, r);
				case "!=": return !Gs(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Gs(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function Js(e, t) {
	return !e || Ks(qs(e, t));
}
function Ys(...e) {
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
var Xs = /\{\{ap::([^{}]*?)\}\}/g;
function Zs(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Xs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Zs(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Qs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function $s(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function ec(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = $s(n[3] ?? n[4] ?? "");
	return t;
}
function tc(e, t) {
	let n = [], r = RegExp(`<${Qs(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: ec(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: ec(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function nc(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function rc(e, t) {
	let n = tc(e, t)[0];
	return n ? $s(n.inner).trim() : void 0;
}
function ic(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function ac(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
var oc = "{==", sc = "==}", cc = "{>>", lc = "<<}", uc = /\n[ \t]*\n/g;
function dc(e, t) {
	uc.lastIndex = t;
	let n = uc.exec(e);
	return n ? n.index : Infinity;
}
function fc(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function pc(e, t, n, r) {
	let i = dc(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function mc(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(oc, o)) {
		let t = o + 3, s = pc(e, t, sc, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - fc(n, [sc]));
			break;
		}
		if (s < 0) {
			let n = Math.min(dc(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || cc.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(cc, l)) {
			let t = l + 3, s = pc(e, t, lc, n);
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
	} else if (e.startsWith(cc, o)) {
		let t = o + 3, i = pc(e, t, lc, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += cc, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (oc.startsWith(t) || cc.startsWith(t))) break scan;
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
function hc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function gc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function _c(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = hc(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + gc(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function vc(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = _c(e, t);
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
function yc(e, t) {
	let n = vc(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${oc}${t.quote}${sc}${cc}${t.comment}${lc}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/media.ts
var bc = [
	"openai",
	"gemini",
	"novelai",
	"openrouter"
], xc = [
	"tags",
	"description",
	"instruction"
], Sc = (e) => e === "novelai" ? "tags" : "instruction", Cc = [
	"fish",
	"elevenlabs",
	"minimax",
	"gemini",
	"openai",
	"deepseek",
	"openrouter"
], wc = {
	on: !1,
	auto: !1,
	api: "",
	prompt: "",
	style: !1,
	sfw: !1,
	refs: !1
}, Tc = {
	on: !1,
	auto: !1,
	api: "",
	narrator: !1,
	characters: !1
}, Ec = (e) => (e ?? []).map((e) => `- ${e.id}: ${e.description}`.trimEnd()).join("\n"), Dc = [
	"1:1",
	"3:4",
	"4:3",
	"9:16",
	"16:9"
], Oc = [
	"prompt",
	"refs",
	"ratio",
	"caption"
], kc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Ac(e) {
	let t = Array.isArray(e) ? e.map(kc) : typeof e == "string" ? e.split(/[,，、\n]/) : [];
	return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function jc(e) {
	let t = kc(e).trim().replace(/[：xX×/]/g, ":").replace(/\s+/g, "");
	return Dc.includes(t) ? t : void 0;
}
function Mc(e) {
	let t = kc(e.prompt ?? e.description ?? e.text).trim();
	if (!t) return;
	let n = { prompt: t }, r = Ac(e.refs ?? e.references);
	r.length && (n.refs = r);
	let i = jc(e.ratio ?? e.aspect_ratio ?? e.aspectRatio);
	i && (n.ratio = i);
	let a = kc(e.caption ?? e.title).trim();
	return a && (n.caption = a), n;
}
function Nc(e, t) {
	if (typeof e == "string") {
		let t = e.trim();
		if (t.startsWith("[") || t.startsWith("{")) try {
			e = JSON.parse(t);
		} catch {}
		typeof e == "string" && (e = t ? [{ prompt: t }] : []);
	}
	e && typeof e == "object" && !Array.isArray(e) && Array.isArray(e.images) && (e = e.images);
	let n = (Array.isArray(e) ? e : e && typeof e == "object" ? [e] : []).map((e) => Mc(e && typeof e == "object" ? e : { prompt: e })).filter((e) => !!e), r = t && t > 0 ? n.slice(0, t) : n;
	return r.length ? { images: r } : void 0;
}
var Pc = "speech", Fc = "character", Ic = (e) => e.text ?? e.quote, Lc = /<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>|\[[^\[\]\n]{1,40}\]/g;
function Rc(e, t = Lc) {
	if (typeof t == "function") return t(e);
	let n = t.global ? t : new RegExp(t.source, `${t.flags}g`);
	n.lastIndex = 0;
	let r = e.replace(n, "");
	if (r === e) return e;
	let i = r.replace(/([ \t])[ \t]+/g, "$1");
	return /^\s/.test(e) || (i = i.replace(/^\s+/, "")), /\s$/.test(e) || (i = i.replace(/\s+$/, "")), i;
}
function zc(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function Bc(e) {
	let t = e.lastIndexOf("<"), n = e.lastIndexOf("["), r = e.length;
	return t >= 0 && !e.includes(">", t) && (r = Math.min(r, t)), n >= 0 && !e.includes("]", n) && e.length - n <= 41 && (r = Math.min(r, n)), e.slice(0, r);
}
function Vc(e, t = {}) {
	let n = t.tag || "speech", r = t.final ?? !0, i = t.cleaner ?? Lc, a = [], o = RegExp(`<${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s[^<>]*)?>`, "g"), s = `</${n}>`, c = `<${n}`, l = [], u = [], d = [], f = "", p = 0, m = (t, n) => {
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
				t -= zc(e.slice(p), [c, s]);
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
		let h = t[1] ?? "", g = $s(/\bcharacter\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(h)?.slice(1).find((e) => e !== void 0) ?? "").trim(), _ = t.index + t[0].length, v = e.indexOf(s, _);
		o.lastIndex = _;
		let y = o.exec(e);
		if (v < 0) {
			let t = e.slice(_);
			if (!r) {
				let e = Rc(Bc(t.slice(0, t.length - zc(t, [s]))), i);
				f += e;
				break;
			}
			a.push(`speech: unterminated <${n}> dropped`), p = _;
			continue;
		}
		let b = e.slice(_, v);
		y && y.index < v && (a.push(`speech: nested <${n}> dropped`), b = b.replace(new RegExp(o.source, "g"), ""));
		let x = Rc(b, i), S = f.length;
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
function Hc(e, t) {
	let n = !1;
	return {
		spans: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = _c(e, t);
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
var Uc = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function Wc(e, t, n = Pc) {
	let r = Hc(e, t).spans.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), i = "", a = 0;
	for (let t of r) t.start < a || (i += `${e.slice(a, t.start)}<${n} ${Fc}="${Uc(t.character)}">${Ic(t)}</${n}>`, a = t.end);
	return i + e.slice(a);
}
function Gc(e, t, n, r) {
	return t.map((t) => {
		let i = n.map(t.start);
		for (let n of r) {
			let r = n(t.quote), a = r ? _c(e, {
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
function Kc(e, t, n = {}) {
	let r = Vc(e, n);
	if (!t?.length) return {
		text: r.text,
		spans: r.spans,
		anchors: t,
		warnings: r.warnings
	};
	let i = (e) => Vc(e, n).text;
	return {
		text: r.text,
		spans: r.spans,
		anchors: Gc(r.text, t, r, [i, (e) => Rc(i(e), n.cleaner)]),
		warnings: r.warnings
	};
}
//#endregion
//#region packages/protocol/src/structures.ts
var qc = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Jc = {
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
}, Yc = ["name", "previous_main"], Xc = {
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
}, Zc = {
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
	status: qc,
	storyline: Yc,
	custom: [],
	annotations: [],
	image: Oc,
	speech: []
};
function Qc(e, t = (e) => e) {
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
			properties: Object.fromEntries(qc.map((e) => [e, i(e)])),
			required: [...qc],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? Yc).filter((e) => Yc.includes(e));
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
			let t = Oc.filter((t) => !e.requested || e.requested.includes(t)), n = {
				prompt: { type: "string" },
				refs: {
					type: "array",
					items: { type: "string" }
				},
				ratio: {
					type: "string",
					enum: [...Dc]
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
function $c(e) {
	return e === "memory" || e === "recap";
}
function el(e) {
	let t = {};
	for (let n of qc) t[n] = rl(Jc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function tl(e) {
	let t = {};
	for (let n of Yc) t[n] = rl(Xc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function nl(e) {
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
var rl = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function il(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations":
		case "speech": return;
		case "image": return Nc(t, n?.count ?? 1);
		case "reply":
		case "impersonate": return rl(t).trim() || void 0;
		case "recap": return t === null ? null : rl(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = rl(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : rl(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: rl(e.time),
				location: rl(e.location),
				event: rl(e.event),
				summary: rl(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : el((e) => t[e]);
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
			let e = tl((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: rl(e.label ?? e.title).trim(),
			content: rl(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, rl(t)]));
			}
			return rl(t).trim() || void 0;
	}
}
function al(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations":
		case "speech": return;
		case "image": return Nc(t.filter((e) => !e.open).map((e) => /<[A-Za-z_]/.test(e.inner) ? {
			prompt: rc(e.inner, "prompt"),
			refs: rc(e.inner, "refs"),
			ratio: rc(e.inner, "ratio"),
			caption: rc(e.inner, "caption")
		} : $s(e.inner).trim()), e.count ?? 1);
		case "reply":
		case "impersonate": return il(e.kind, $s(n.inner));
		case "recap": return il("recap", $s(n.inner));
		case "memory": return il("memory", t.filter((e) => !e.open).map((e) => ({
			scope: rc(e.inner, "scope"),
			operation: rc(e.inner, "operation"),
			key: rc(e.inner, "key"),
			content: rc(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: rc(n.inner, "time") ?? "",
			location: rc(n.inner, "location") ?? "",
			event: rc(n.inner, "event") ?? "",
			summary: rc(n.inner, "summary") ?? ""
		};
		case "status": return el((e) => rc(n.inner, e));
		case "storyline": {
			let e = tl((e) => rc(n.inner, e));
			return !e.name && !e.previous_main && !/<[A-Za-z_]/.test(n.inner) && (e.name = $s(n.inner).trim()), e.name || e.previous_main ? e : void 0;
		}
		case "options": return tc(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: $s(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = $s(t[2]).trim();
				return e;
			}
			return il("custom", $s(n.inner), e);
	}
}
function ol(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (Is(a)) continue;
		let t = tc(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = al(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: nc(e, i),
		values: n,
		open: r
	};
}
function sl(e) {
	return $s(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var cl = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function ll(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function ul(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function dl(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function fl(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return cl(e, { n: String(t).padStart(i, "0") }) + r;
}
function pl(e, t, n, r, i) {
	let a = n.filter((e) => !Is(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: ll(e, t)
		},
		rank: 0,
		index: n
	})), s = dl(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = ul(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? fl(u, t + 1, d, n) : n;
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
		prefix: u,
		stageField: (e) => p.get(e)?.name ?? i(e),
		structureField: (e) => m.get(e.id)?.name ?? e.field,
		hostOf: (e) => h.get(e.id),
		carriedBy: g,
		stageParam: (e, t) => {
			let n = p.get(e);
			return u && n && g(e).length ? fl(u, n.position, d, t) : t;
		}
	};
}
function ml(e, t, n) {
	let r = e.items.findIndex((e) => e.type === "structure" && e.structure.id === n.id);
	if (r < 0) return;
	let i = (n) => {
		let r = e.items[n];
		return r.type === "stage" && t.includes(r.stage) ? r.stage : void 0;
	};
	for (let e = r - 1; e >= 0; e--) {
		let t = i(e);
		if (t) return t;
	}
	for (let t = r + 1; t < e.items.length; t++) {
		let e = i(t);
		if (e) return e;
	}
}
function hl(e, t) {
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
var gl = {
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
}, _l = (e) => e;
function vl(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function yl(e, t) {
	return e.stages.filter((e) => Js(e.when, t));
}
function bl(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function xl(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function Sl(e, t, n = gl) {
	return vl(t.field?.name ?? n.turn.field, xl(e, t));
}
function Cl(e, t, n = gl) {
	return vl(t.tool?.name ?? n.stage.name, xl(e, t));
}
function wl(e, t = gl) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var Tl = (e, t) => t ? {
	...e,
	description: t
} : e;
function El(e = gl, t = _l, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return Tl({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: Tl({ type: "string" }, i(r.old)),
				new_string: Tl({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function Dl(e, t, n = gl, r = _l) {
	return e.kind === "patch" ? El(n, r, t) : Tl({ type: "string" }, t);
}
function Ol(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function kl(e, t, n, r, i = _l, a) {
	let o = r.filter((e) => !Is(e)), s = (e, t) => {
		if (e) return i(t ? vl(e, xl(n, t)) : e).trim() || void 0;
	}, c = a ? Al(pl(t, n, o, e, (t) => Sl(n, t, e)), a) : pl(t, n, o, e, (t) => Sl(n, t, e)), l = a ? new Set(a.stages) : void 0, u = a ? new Set(a.structures.map((e) => e.id)) : void 0, d = (e) => l ? e.type === "stage" ? l.has(e.stage) : u.has(e.structure.id) : !0, f = l ? n.filter((e) => l.has(e)) : n, p = (e) => c.stageField(e), m = (e) => c.structureField(e), h = (t) => Cl(n, t, e), g = (t) => c.stageParam(t, wl(t, e).name), _ = (e, t, n) => {
		let r = m(n);
		e[r] = Qc(hl(n, r), i), $c(n.kind) || t.push(r);
	}, v = () => {
		let t = {}, n = [];
		for (let r of c.items) {
			if (!d(r)) continue;
			if (r.type === "structure") {
				_(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = Dl(a, s(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, y = () => f.map((t) => {
		let n = {}, r = [], a = wl(t, e), o = c.carriedBy(t), l = c.items.find((e) => e.type === "stage" && e.stage === t), u = () => {
			let o = g(t);
			n[o] = Dl(t, s(a.description, t), e, i), r.push(o);
		}, d = !1;
		for (let e of o) {
			let t = c.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!d && t > l.position - 1 && (u(), d = !0), _(n, r, e);
		}
		return d || u(), Ol(h(t), s(t.tool?.description ?? e.stage.description, t), {
			type: "object",
			properties: n,
			required: r,
			additionalProperties: !1
		});
	}), b = {
		thinking: e.envelope.thinking.name,
		result: e.envelope.result.name
	};
	return {
		layout: c,
		fieldOf: p,
		structureFieldOf: m,
		toolOf: h,
		paramOf: g,
		stageOfTool: (e) => n.find((t) => h(t) === e),
		schema: () => {
			let t = s(e.turn.description);
			return {
				name: e.turn.name,
				...t ? { description: t } : {},
				value: v()
			};
		},
		turnSchema: v,
		submitTool: (t) => Ol(e.submit.name, s(e.submit.description), t ?? v()),
		stageTools: y,
		envelope: (t) => ({
			type: "object",
			properties: {
				[b.thinking]: Tl({ type: "string" }, s(e.envelope.thinking.description)),
				[b.result]: Tl(t, s(e.envelope.result.description) ?? t.description)
			},
			required: [b.thinking, b.result],
			additionalProperties: !1
		}),
		envelopeKeys: b,
		toolNames: () => [e.submit.name, ...f.map(h)]
	};
}
function Al(e, t) {
	let { stages: n } = t, r = new Set(t.structures.map((e) => e.id)), i = (t) => e.items.flatMap((i) => i.type === "structure" && r.has(i.structure.id) && ml(e, n, i.structure) === t ? [i.structure] : []);
	return {
		...e,
		hostOf: (t) => r.has(t.id) ? ml(e, n, t) : void 0,
		carriedBy: i,
		stageParam: (t, n) => {
			let r = e.items.find((e) => e.type === "stage" && e.stage === t);
			return e.prefixed && r && i(t).length ? fl(e.prefix, r.position, e.items.length, n) : n;
		}
	};
}
function jl(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function Ml(e) {
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
function Nl(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = Ml(e);
		return t ? [t] : [];
	});
}
function Pl(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Fl(e) {
	let t = Nl(e);
	return t.length ? Pl(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function Il(e) {
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
function Ll(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - ic(t.content)).trimEnd());
}
function Rl(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function zl(e) {
	return e.map((e) => ({
		old_string: rc(e, "old_string") ?? "",
		new_string: rc(e, "new_string") ?? ""
	}));
}
function Bl(e, t) {
	let n = Il(t.stages), r = ac(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Qs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = ol(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = tc(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = zl(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = $s(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = nc(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = bl(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Qs(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Ll(t.stages, n, t.final), Rl(t.stages, n, t.final), n;
}
function Vl(e, t) {
	let n = Il(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => Sl(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Hl(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (Is(e)) continue;
		let r = c(e), i = il(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = bl(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Ll(t.stages, n, t.final), Rl(t.stages, n, t.final), n;
}
function Hl(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Ul(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Wl(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Ul(e, n);
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
	let i = n.trim().split(/\s+/).map(Qs), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function Gl(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Wl(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Kl(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Qs(t), "gi"), a = [], o;
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
var ql = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Jl = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Yl = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Xl(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Zl[e]);
}
var Zl = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Ql(e) {
	return e.split(Jl).filter((e) => e !== "");
}
var $l = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function eu(e) {
	let t = Ql($l(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Yl.has(n)) throw new ql(`Could not find matching close tag for "${e}".`, a);
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
var tu = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, nu = (e, t) => {
	throw new ql(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, ru = /* @__PURE__ */ new Map(), iu = 500;
function au(e) {
	let t = ru.get(e);
	if (t) return t;
	let n = eu(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new ql(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Xl, tu, nu);
	return ru.size >= iu && ru.clear(), ru.set(e, i), i;
}
function ou(e, t) {
	return au(e)(t);
}
function su(e) {
	try {
		return au(e), null;
	} catch (e) {
		return e instanceof ql ? e : new ql(String(e));
	}
}
function cu(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) cu(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var lu = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, uu = /^\s*(```|~~~)/;
function du(e) {
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
var fu = /<!--[ \t]*#/g, pu = /<!--|-->/g;
function mu(e, t, n) {
	pu.lastIndex = t;
	for (let t = pu.exec(e); t; t = pu.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function hu(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(lu)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(lu, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...du(o),
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
			let t = mu(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? gu(e, t) : t;
		} else if (uu.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		fu.lastIndex = u;
		for (let t = fu.exec(e); t; t = fu.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = mu(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? gu(e, r) : r, fu.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function gu(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var _u = [
	"system",
	"user",
	"assistant"
], vu = ["dialogue", "imperative"];
function yu(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Ys(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = su(e.text);
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
				_u.includes(n) || t(`@as expects one of ${_u.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: _u.includes(n) ? n : void 0,
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
				if (!n || !vu.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: Ws(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = Ws(e.raw);
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
function bu(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = hu(e, [], 1, r), a = yu(i.tokens, r);
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
function xu(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => Js(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var Su = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function Cu(e) {
	let t = e.entries.flatMap((e) => Su(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => Su(e));
		t.push(...Su(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...Su(bu(n.text, n.role).content));
	return t;
}
//#endregion
//#region packages/protocol/src/clone.ts
function G(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => G(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = G(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function wu(e) {
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
function Tu(e, t) {
	let n = wu(e), r = wu(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function Eu(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = wu(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = Tu(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var Du = (e) => !!e && typeof e == "object" && !Array.isArray(e), Ou = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	openAiSignatures: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0,
	assumeToolSupport: !1
}, ku = {
	target: { type: "current" },
	bindings: {},
	binding: "default"
}, Au = "default", ju = {
	enabled: !1,
	actors: {}
};
function Mu(e) {
	let t = e.sendThoughtSignature;
	return t === !0 ? "vertex" : typeof t == "string" && Ps.includes(t) ? t : "off";
}
function Nu(e, t) {
	let n = e.thoughtSignature;
	if (t !== "off" && n) return typeof n == "string" ? t === "vertex" ? n : void 0 : n[t] || void 0;
}
var Pu = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function Fu(e, ...t) {
	let n = G(e);
	for (let e of t) n = Iu(n, e);
	return n;
}
function Iu(e, t) {
	if (t === void 0) return e;
	if (!Du(e) || !Du(t)) return G(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = Iu(e[r], i);
	return n;
}
function Lu(e, t) {
	if (Du(e) && Du(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Lu(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : G(e);
}
function Ru(e, t, n = "", r = [], i = zu) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? Du(e[a]) && Du(t[a]) && (Ru(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var zu = /* @__PURE__ */ new Set([
	"sampling",
	"connection.target",
	"connection.bindings",
	"multiModel.actors"
]);
function Bu(e, t, n) {
	let r = G(e);
	for (let e of t) if (Eu(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && Du(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Vu(e) {
	return Fu({ connection: ku }, e.configurationDefaults);
}
function Hu(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
function Uu(e, t, n) {
	return Fu(e.configurationDefaults, Hu(e, t)?.diff, n);
}
//#endregion
//#region packages/protocol/src/params.ts
function Wu(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function Gu(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function Ku(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? Wu(n) : Array.isArray(e.default) ? Wu(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function qu(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Ju(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, Ku(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Yu(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Xu(e, t, n) {
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
function Zu(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Yu(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Xu(r[t.var], t, e));
	}
	return r;
}
var Qu = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function $u(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Qu.test(e);
}
function ed(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return $u(e) ? e : JSON.stringify(e);
}
var td = (e) => !e.includes("\n") && $u(e) ? e : JSON.stringify(e);
function nd(e) {
	return e.map((e) => `- ${ed(e, "  ")}`).join("\n");
}
function rd(e) {
	return [...e].map(([e, t]) => `${td(e)}: ${ed(t, "  ")}`).join("\n");
}
function id(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return nd(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? rd(e) : t === "keys" ? nd([...e.keys()]) : t === "values" ? nd([...e.values()]) : e.get(t) ?? "";
}
function ad(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var od = [
	"all",
	"if",
	"off"
], sd = {
	enabled: !0,
	freezeVariables: "all"
}, cd = (e) => od.includes(e?.freezeVariables) ? e.freezeVariables : sd.freezeVariables, ld = (e, t) => e === "all" ? !t.main : e === "if" && t.if, ud = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1,
	frozen: !1
}, dd = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u, fd = (e) => /^[^\s#!?@][^\s#]*$/u.test(e) && !/^if\?$/iu.test(e) && [...e].length <= 64;
function pd(e) {
	let t = dd.exec(e);
	if (!t) return null;
	let n = t[2], r = /^if\?$/iu.test(n), i = n === "" ? "recent" : n === "?" || r ? "new" : "name";
	if (i === "name" && !fd(n)) return null;
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
function md(e) {
	return pd(e)?.text ?? e;
}
function hd(e, t, n = !1) {
	let r = md(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function gd(e, t, n) {
	return n ? `${e.slice(0, t.at)}#${t.switchMain ? "!" : t.hide ? "@" : ""}${n}` : t.text;
}
function _d(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?@\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return fd(n) ? n : "";
}
function vd(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function yd(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var bd = (e) => /^if/i.test(e);
function xd(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function Sd(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Cd(e, t) {
	return !!e.groups[t]?.allowNone;
}
function wd(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || Cd(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Js(e.when, n)) : i;
}
function Td(e, t) {
	let n = new Set(wd(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Ed(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = yd(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => {
		switch (e.kind) {
			case "storyline": return i.length ? [{
				...e,
				requested: i
			}] : [];
			case "image": return n?.image?.on ? [{
				...e,
				requested: Oc.filter((e) => e !== "refs" || n.image.refs)
			}] : [];
			case "speech": return n?.speech?.on ? [e] : [];
			default: return [e];
		}
	});
}
function Dd(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Od(e, t, n, r) {
	return t && e.tools ? pl(t, n, r, e.tools, (t) => Sl(n, t, e.tools)) : void 0;
}
function kd(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? Od(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = Ku(n, o.params[e]);
		if (qu(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Zs(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return id(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return Dd(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${Dd(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : jl(t, (e) => Dd(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			case "storyline": return i === "main" ? c.storyline?.main ?? "" : c.storyline?.name ?? s.storyline?.name ?? "";
			case "image": return i === "refs" && s.image?.on ? Ec(c.image?.refs) : "";
			case "speech": return s.speech?.on ? i === "format" ? c.speech?.format ?? "" : i === "characters" ? (c.speech?.characters ?? []).join(", ") : "" : "";
			default: return;
		}
	};
	return g;
}
function Ad(e, t, n, r, i) {
	return cu({
		...G(e),
		vars: G(ad(t)),
		sampling: G(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function jd(e, t, n) {
	return (r) => {
		try {
			return ou(r.text, e());
		} catch (e) {
			let i = e instanceof ql ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function Md(e, t) {
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
function Nd(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? Od(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? Cl(n, t, e.tools) : c?.stageField(t) ?? Sl(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Dd(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function Pd(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = Sd(i), s = a ? yl(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0])), i.phase = e.phase ? {
		stages: Object.fromEntries(e.phase.stages.map((e) => [e, !0])),
		index: e.phase.index,
		actor: e.phase.actor
	} : {
		stages: { ...i.stages },
		index: 0,
		actor: ""
	};
	let c = Sd(i), l = wd(n, r, c), u = Ed(n, l, i), d = Zu(n.vars, l), f = kd({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Zs(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= Ad(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Js(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...xu(e.content, c, p, jd(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = Nd(n, a, s, i.style, i.transport, r, u);
		for (let n of xu(t, c, p, jd(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = Md(e, v.get(e.id) ?? []));
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
function Fd(e, t, n = {}) {
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
		modules: Td(e, t),
		params: Ju(e, t),
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
		storyline: { ...ud },
		image: { ...wc },
		speech: { ...Tc },
		multiModel: !1,
		phase: {
			stages: {},
			index: 0,
			actor: ""
		},
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var Id = /* @__PURE__ */ new Set([
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
]), Ld = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Rd = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, zd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Bd(e, t = {}) {
	let n = (e) => Bd(e, t);
	if (!zd(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && zd(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Ld.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(zd), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Vd({
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
		return Vd({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Id.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			zd(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Rd[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = zd(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Vd({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Vd(i, a);
}
function Vd(e, t) {
	return t && (e.nullable = !0), e;
}
function Hd(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!zd(n)) return e;
		let r = zd(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Bd(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/tavern-helper.ts
var Ud = "tavern_helper";
function Wd(e) {
	return e.flatMap((e) => e.type === "folder" ? [e.id, ...e.scripts.map((e) => e.id)] : [e.id]);
}
//#endregion
//#region packages/protocol/src/preset-file.ts
var Gd = "1.10.0", Kd = "advanced_preset_file", qd = [
	"https://github.com/mirrorange/advanced-preset",
	"https://gitlab.com/mirrorange/advanced-preset",
	"https://codeberg.org/mirrorange/advanced-preset"
], Jd = (e) => typeof e == "string" && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(e.trim()), Yd = "ap_install_notice", Xd = "⟦ap:install-notice⟧", Zd = "6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3", Qd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function $d(e) {
	let t = Qd(e) && Qd(e.extensions) ? e.extensions[Kd] : void 0;
	return Qd(t) && Qd(t.artifact) ? {
		format: t.format,
		artifact: t.artifact
	} : void 0;
}
function ef(e) {
	return $d(e)?.artifact ?? e;
}
function tf(e) {
	let t = e.minAdvancedPreset;
	return t && Tu(t, "1.10.0") > 0 ? t : Gd;
}
var nf = (e) => typeof e == "string" && e.includes("⟦ap:region:");
function rf(e) {
	return `${Xd}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${e.name}" ${e.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${qd.map((e) => `   - ${e}`).join("\n")}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}
function af(e) {
	return {
		type: "script",
		enabled: !0,
		name: "Advanced Preset Installer",
		id: Zd,
		content: sf(e.name, tf(e)),
		info: `This preset ("${e.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${qd.join("\n")}\nIt does nothing once Advanced Preset ${tf(e)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${tf(e)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
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
function of(e, t = {}) {
	let n = e.carrier.prompts.map((e) => ({ ...e })), r = new Set(n.filter((e) => nf(e.content)).map((e) => e.identifier));
	n.push({
		identifier: Yd,
		name: "Advanced Preset · install notice",
		role: "system",
		content: rf(e),
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
		identifier: Yd,
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
			...t.installer === !1 ? {} : { [Ud]: {
				scripts: [af(e)],
				variables: {}
			} },
			[Kd]: a
		}
	};
}
function sf(e, t) {
	let n = (e) => JSON.stringify(e).replace(/</g, "\\u003c");
	return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${t} or newer is running.
const PRESET = ${n(e)};
const REQUIRED = ${n(t)};
const MIRRORS = ${n(qd)};
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
var cf = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function lf(e) {
	let t = e.configurationDefaults?.connection;
	return !cf(t) || Object.keys(Ou).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...Ou,
				...t
			}
		}
	};
}
function uf(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!cf(t) || "userInput" in t) && (!cf(n) || "userInput" in n)) return e;
	let r = cf(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: cf(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: cf(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function df(e) {
	let t = e.configurationDefaults;
	if (!cf(t)) return e;
	let n = t.cache;
	return cf(n) && Object.keys(Pu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...Pu,
				...cf(n) ? n : {}
			}
		}
	};
}
function ff(e) {
	let t = e.configurationDefaults;
	if (!cf(t)) return e;
	let n = t.meta;
	return cf(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...cf(n) ? n : {}
			}
		}
	};
}
function pf(e) {
	let t = e.configurationDefaults;
	if (!cf(e.storylines) || !cf(t)) return e;
	let n = t.storylines;
	return cf(n) && Object.keys(sd).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...sd,
				...cf(n) ? n : {}
			}
		}
	};
}
function mf(e) {
	let t = pf(ff(df(uf(lf(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function hf(e) {
	let t = ef(e);
	return !cf(t) || typeof t.id != "string" || !Array.isArray(t.entries) ? null : t.formatVersion === 3 ? mf(t) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var gf = (e) => typeof e == "string" || e.enabled !== !1, _f = (e) => typeof e == "string" ? e : e.text;
function vf(e, t) {
	t ? delete e.enabled : e.enabled = !1;
}
function yf(e, t) {
	return t ? e : {
		text: e,
		enabled: !1
	};
}
var bf = "user-", xf = "advanced-preset.user-modules", Sf = (e) => `${bf}${e}`;
function Cf() {
	return {
		match: "all",
		rules: []
	};
}
var wf = ["on", "off"];
function Tf(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? wf.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function Ef(e) {
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
function Df(e, t) {
	let n = Ef(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var Of = (e) => ({
	t: "lit",
	v: e
});
function kf(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(Of)
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
			r: Of(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function Af(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(Tf).map((e) => {
		if (e.kind === "keyword") return Of(Df(e, t));
		if (e.kind === "var") return kf(e);
		try {
			return Ws(e.source);
		} catch {
			return Of(!1);
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
function jf(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return Ws(e.source), null;
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
function Mf(e, t = []) {
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
function Nf(e, t = []) {
	let n = new Set(t.filter((e) => !gf(e)).map((e) => e.id));
	return n.size ? e.filter((e) => e.group === void 0 || !n.has(e.group)) : e;
}
function Pf(e, t) {
	return e.filter((e) => (e.group ?? null) === t);
}
function Ff(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function If(e, t) {
	return t.entries.filter((t) => !Ff(e, t.point));
}
function Lf(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function Rf(e, t) {
	return (t.vars ?? []).filter((t) => Lf(e, t.var)?.type !== t.type);
}
function zf(e, t) {
	return [.../* @__PURE__ */ new Set([...If(e, t).map((e) => e.point), ...Rf(e, t).map((e) => e.var)])];
}
function Bf(e) {
	if (!gf(e)) return null;
	switch (e.type) {
		case "string": return e.text.trim() ? {
			var: e.var,
			type: "string",
			text: e.text
		} : null;
		case "list": {
			let t = e.items.filter(gf).map(_f).filter((e) => e.trim());
			return t.length ? {
				var: e.var,
				type: "list",
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => gf(e) && e.key.trim()).map((e) => ({
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
function Vf(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Hf(e, t, n) {
	let r = t.filter((e) => e.enabled).map((e) => ({
		...e,
		entries: e.entries.filter(gf),
		vars: (e.vars ?? []).filter(gf)
	})).filter((e) => e.entries.length || e.vars.length);
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = Sf(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: Af(t.trigger, n),
			structures: [],
			vars: t.vars.filter((t) => Lf(e, t.var)?.type === t.type).map(Bf).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = Ff(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Vf(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: bu(n.text, n.role).content
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
function Uf(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => Su(bu(e.text, e.role).content)));
}
function Wf(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Gf(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Kf(e, t, n) {
	let r = t.filter((e) => Eu(n, e.from));
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
				path: Wf(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Gf(t.source, e)
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
var qf = (e) => !!e && typeof e == "object" && !Array.isArray(e), Jf = (e, t = "") => typeof e == "string" ? e : t, Yf = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Xf = [
	"system",
	"user",
	"assistant"
], Zf = [
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
function Qf(e) {
	if (!qf(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Jf(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Zf.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Yf) : Yf(e.value) && (t.value = e.value), t;
	}
	return null;
}
var $f = (e) => e.enabled === !1 ? { enabled: !1 } : {};
function ep(e) {
	return typeof e == "string" ? [e] : qf(e) && typeof e.text == "string" ? [e.enabled === !1 ? {
		text: e.text,
		enabled: !1
	} : e.text] : [];
}
function tp(e) {
	if (!qf(e) || typeof e.var != "string") return [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Jf(e.text),
		...$f(e)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: Array.isArray(e.items) ? e.items.flatMap(ep) : [],
		...$f(e)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(qf).map((e) => ({
			key: Jf(e.key),
			value: typeof e.value == "string" ? e.value : null,
			...$f(e)
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t,
			...$f(e)
		}];
	}
	return [];
}
function np(e) {
	if (!qf(e) || !Array.isArray(e.entries)) return null;
	let t = qf(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!qf(e)) return [];
		let n = {
			id: Jf(e.id) || `e${t + 1}`,
			point: Jf(e.point),
			text: Jf(e.text)
		};
		return Xf.includes(e.role) && (n.role = e.role), e.enabled === !1 && (n.enabled = !1), [n];
	}), r = {
		id: Jf(e.id),
		name: Jf(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(tp) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Qf).filter((e) => !!e) : []
		}
	};
	return typeof e.group == "string" && e.group && (r.group = e.group), r;
}
function rp(e) {
	if (!qf(e) || typeof e.id != "string" || !e.id) return null;
	let t = {
		id: e.id,
		name: Jf(e.name),
		mode: e.mode === "single" ? "single" : "multi"
	};
	return e.collapsed === !0 && (t.collapsed = !0), e.enabled === !1 && (t.enabled = !1), t;
}
function ip(e, t, n = []) {
	let r = n.filter((t) => e.some((e) => e.group === t.id));
	return {
		format: xf,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e,
		...r.length ? { groups: r } : {}
	};
}
function ap(e) {
	if (qf(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(np).filter((e) => !!e), n = /* @__PURE__ */ new Set(), r = (Array.isArray(e.groups) ? e.groups : []).map(rp).filter((e) => !!e && !n.has(e.id) && !!n.add(e.id));
		for (let e of t) e.group !== void 0 && !n.has(e.group) && delete e.group;
		return {
			preset: qf(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Jf(e.preset.version)
			} : void 0,
			modules: t,
			groups: r
		};
	}
	let t = np(e);
	if (t) return delete t.group, {
		modules: [t],
		groups: []
	};
	throw Error("not a user module file");
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function op(e) {
	return Array.isArray(e.userModuleGroups) ? e.userModuleGroups : [];
}
function sp(e, t) {
	return typeof t?.name == "string" && t.name ? {
		...G(e),
		name: t.name
	} : G(e);
}
function cp(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function lp(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function up(e, t, n) {
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
function dp(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...G(e)
		})),
		vars: G(e.vars ?? []),
		trigger: e.trigger ? G(e.trigger) : Cf(),
		...n.group ? { group: n.group } : {}
	};
}
function fp(e) {
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
		vars: G(e.vars ?? []),
		trigger: G(e.trigger)
	};
}
function pp(e) {
	if (Array.isArray(e)) return e.map(pp);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = pp(e[n]));
		return t;
	}
	return e;
}
function mp(e) {
	return JSON.stringify(pp({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text,
			...e.enabled === !1 ? { enabled: !1 } : {}
		})),
		vars: (e.vars ?? []).flatMap(tp),
		trigger: e.trigger ?? Cf()
	}));
}
function hp(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, mp(e.locales[t])]);
	return JSON.stringify([
		mp(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function gp(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var _p = "[{{time}} · {{location}}] {{event}}: {{summary}}", vp = (e) => e === "synopsis" ? _p : "{{value}}", yp = "{{content}}";
function bp(e) {
	let t = e.indexOf(yp);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(yp, "");
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
function xp(e) {
	let t = e.history;
	if (t === void 0 || Is(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: bp(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? vp(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var Sp = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, Cp = (e) => e.kind === "speech" && typeof e.history == "number" ? e.history : 0, wp = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function Tp(e) {
	let t = e?.stages ?? [], n = wp(t);
	return n >= 0 ? ll(e, t[n]) : 0;
}
function Ep(e, t, n) {
	let r = e?.stages ?? [], i = (t) => ll(e, t), a = wp(r), o = Tp(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = ul(e, t);
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
var Dp = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Op(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => Dp(e).trim() !== "");
}
function kp(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return Ap(_p, e, t, !1);
		case "status": return nl(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : Dp(t);
		case "image": {
			let e = t?.images;
			return Array.isArray(e) ? e.map((e) => `- ${e?.caption ? `${e.caption}: ` : ""}${e?.prompt ?? ""}`).join("\n") : Dp(t);
		}
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${Dp(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function Ap(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Zc[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? kp(t, n) : i && (a.has(o) || t === "custom" && o in i) ? Dp(i[o]) : a.has(o) ? "" : e);
}
var jp = (e, t) => Ap(e, "synopsis", t, !1);
function Mp(e, t, n) {
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
var Np = [
	"executeOnStartup",
	"executeOnUser",
	"executeOnAi",
	"executeOnChatChange",
	"executeOnGroupMemberDraft",
	"executeOnNewChat",
	"executeBeforeGeneration"
], Pp = [
	"label",
	"title",
	"message"
];
function Fp(e, t, n) {
	let r = (e) => Zs(e, (e) => e[0] === "name" && e.length === 2 ? t(e[1]) : void 0), i = e.qrList.map(({ id: e, ...t }, i) => {
		let a = n?.qrList?.[e], o = {
			...t,
			contextList: t.contextList.map((e) => ({ ...e })),
			id: i + 1
		};
		for (let e of Pp) {
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
var Ip = (e) => Np.some((t) => e[t]) || !!e.automationId;
function Lp(e) {
	return (e.quickReplySets ?? []).flatMap((e) => e.qrList.filter(Ip).map((t) => `${e.name} · ${t.label || t.id}: ${t.message}`));
}
//#endregion
//#region packages/protocol/src/phases.ts
function Rp(e, t) {
	if (!t || !e.length) return [{
		actor: "",
		stages: e
	}];
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		e && e.actor === t.actor ? e.stages.push(t) : n.push({
			actor: t.actor,
			stages: [t]
		});
	}
	return n;
}
function zp(e, t, n, r) {
	let i = bl(t), a = i >= 0 ? t[i] : void 0, o = (e) => e === "@content" ? a : t.find((t) => t.id === e), s = (e.structuresAfter ? t.find((t) => t.id === e.structuresAfter) : void 0) ?? a ?? t[t.length - 1];
	if (Is(r)) return a ?? s;
	let c = ul(e, r);
	if (typeof c == "number") {
		let e = n ? n.items.findIndex((e) => e.type === "structure" && e.structure.id === r.id) : -1;
		for (let t = e - 1; t >= 0; t--) {
			let e = n.items[t];
			if (e.type === "stage") return e.stage;
		}
		return t[0];
	}
	return ("before" in c ? o(c.before) : o(c.after)) ?? s;
}
function Bp(e, t, n, r, i = {}) {
	let a = Rp(e, r).map((e, t) => ({
		index: t,
		actor: e.actor,
		stages: e.stages,
		structures: []
	}));
	if (a.length === 1) return a[0].structures = [...t], a;
	for (let r of t) {
		let t = zp(i, e, n, r), o = t ? a.findIndex((e) => e.stages.includes(t)) : -1;
		a[o >= 0 ? o : a.length - 1].structures.push(r);
	}
	return a;
}
function Vp(e, t, n) {
	let r = Il(e);
	for (let e of t) {
		for (let t of e.stages) {
			let n = e.turn.stages[t.id];
			n && (r.stages[t.id] = { ...n });
		}
		Object.assign(r.structures, e.turn.structures), r.openStructures.push(...e.turn.openStructures), r.warnings.push(...e.turn.warnings), e.turn.current && (r.current = e.turn.current), e.turn.contentStarted && (r.contentStarted = !0);
	}
	n && (r.current = null);
	for (let t = e.length - 1; t >= 0; t--) {
		let n = e[t];
		if (n.kind !== "content") continue;
		let i = r.stages[n.id]?.text?.trim();
		if (i) {
			r.content = i;
			break;
		}
	}
	return !n && r.content && (r.content = r.content.slice(0, r.content.length - ic(r.content)).trimEnd()), r;
}
function Hp(e, t, n) {
	let r = [];
	for (let i of e) for (let e of i.stages) {
		let a = t.stages[e.id], o = typeof a?.text == "string" && a.text.trim() !== "";
		if (!a || !o && !a.patches) continue;
		let s = n ? i.structures.filter((t) => !Is(t) && ml(n, i.stages, t) === e) : [];
		r.push({
			stage: e,
			...o ? { text: a.text } : {},
			...a.patches ? { patches: a.patches } : {},
			structures: s.filter((e) => t.structures[e.id] !== void 0).map((e) => ({
				decl: e,
				value: t.structures[e.id]
			}))
		});
	}
	return r;
}
var Up = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), Wp = (e) => Array.isArray(e) ? e.map(String).join(", ") : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e), Gp = (e) => Object.entries(e).filter(([, e]) => e != null && e !== "").map(([e, t]) => `<${e}>${Up(Wp(t))}</${e}>`).join("");
function Kp(e, t) {
	let n = e.tag, r = (e) => `<${n}>${e}</${n}>`;
	return typeof t == "string" ? r(t) : e.kind === "options" && Array.isArray(t) ? r(t.map((e) => `<option title="${Up(e.label ?? "").replace(/"/g, "&quot;")}">${e.content ?? ""}</option>`).join("\n")) : Array.isArray(t) ? t.map((e) => r(e && typeof e == "object" ? Gp(e) : Up(Wp(e)))).join("\n") : r(t && typeof t == "object" ? Gp(t) : Up(Wp(t)));
}
function qp(e, t) {
	let n = bl(t.stages), r = n >= 0 ? t.stages[n].id : void 0, i = [];
	for (let n of e) {
		let e = n.stage, a = e.tag ?? (t.format === "tag" || e.kind === "patch" ? e.id : void 0);
		if (n.patches) i.push(n.patches.map((e) => `<${a}><old_string>${Up(e.old_string)}</old_string><new_string>${Up(e.new_string)}</new_string></${a}>`).join("\n"));
		else if (a) i.push(`<${a}>\n${n.text ?? ""}\n</${a}>`);
		else {
			let a = e.id === r && t.contentMarker ? `${t.contentMarker}\n` : "";
			i.push(`${t.prefixes[e.actor] ?? ""}${a}${n.text ?? ""}`);
		}
		for (let e of n.structures) i.push(Kp(e.decl, e.value));
	}
	return i.join("\n\n");
}
function Jp(e, t) {
	let n = {};
	for (let r of e) {
		n[t.fieldOf(r.stage)] = r.patches ?? r.text ?? "";
		for (let e of r.structures) n[t.structureFieldOf(e.decl)] = e.value;
	}
	return n;
}
function Yp(e, t) {
	return e.map((e) => {
		let n = { [t.paramOf(e.stage)]: e.patches ?? e.text ?? "" };
		for (let r of e.structures) n[t.structureFieldOf(r.decl)] = r.value;
		return {
			stage: e.stage,
			name: t.toolOf(e.stage),
			arguments: n
		};
	});
}
//#endregion
//#region src/i18n.ts
var Xp = {
	en: ks,
	"zh-cn": As,
	"zh-tw": js
}, Zp = [
	{
		value: "en",
		label: "English"
	},
	{
		value: "zh-cn",
		label: "简体中文"
	},
	{
		value: "zh-tw",
		label: "繁體中文"
	}
], Qp = /* @__PURE__ */ A("");
function $p(e) {
	Qp.value = e ?? "";
}
function em() {
	if (Qp.value) return Qp.value;
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function K(e, t = {}) {
	return ((Xp[em()] ?? Xp[em().split("-")[0]])?.[e] ?? ks[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function tm(e) {
	return e.locales?.[em()] ?? e.locales?.[em().split("-")[0]];
}
function nm(e, t, n, r, i) {
	let a = tm(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function rm(e) {
	let t = tm(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function im(e) {
	let t = tm(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function am(e, t, n) {
	return up(t, em(), tm(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/store/settings.ts
var om = () => ({
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
}), sm = null;
function q() {
	if (sm) return sm;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = om();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return sm = /* @__PURE__ */ _n(n), $p(sm.ui.language), sm;
}
var J = () => e().saveSettingsDebounced(), cm = /* @__PURE__ */ _n(/* @__PURE__ */ new Map()), lm = /* @__PURE__ */ _n(/* @__PURE__ */ new Map());
async function um() {
	try {
		let e = `${h()}dist/presets/`, t = await (await T(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = hf(await (await T(e + n, { cache: "no-cache" })).json());
			t && cm.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var dm = (e) => hf(e);
function fm() {
	return [.../* @__PURE__ */ new Set([
		...cm.keys(),
		...Object.keys(q().installed),
		...lm.keys()
	])].map((e) => pm(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function pm(e) {
	let t = lm.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = hm(e), r = cm.get(e);
	if (n && (!r || Tu(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var mm = /* @__PURE__ */ new WeakMap();
function hm(e) {
	let t = q().installed[e];
	if (t) return mm.has(t) || mm.set(t, hf(t)), mm.get(t) ?? void 0;
}
var gm = (e) => pm(e)?.preset;
function _m(e) {
	q().installed[e.id] = e, J();
}
function vm(e) {
	delete q().installed[e], J();
}
function ym(e, t) {
	e ? lm.set(e.id, e) : t ? lm.delete(t) : lm.clear();
}
var bm = (e) => cm.has(e), xm = (e) => cm.get(e), Sm = "advanced_preset_storyline", Cm = "advanced_preset_storyline_switched", wm = "?new", Tm = (e) => e.startsWith("?"), Em = (e) => {
	let t = e && !e.is_user ? e.extra?.[Sm] : void 0;
	return typeof t == "string" ? t : void 0;
};
function Dm(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = pd(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : Em(e[o + 1]) ?? "?" : "";
		} else {
			let e = Em(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !Tm(s) && (i = s);
	}), n;
}
var Om = (e, t) => e === "" || e === t.main ? "" : e;
function km(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? bd(e);
}
function Am(e, t) {
	return e === "" ? !1 : t.hidden?.[e] ?? km(e, t);
}
var jm = (e, t) => e === "" ? t.main ?? "" : Tm(e) ? "" : e;
function Mm(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !Am(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: jm(e, n),
		main: e === "",
		if: km(e, n),
		hidden: Am(e, n)
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
var Nm = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function Pm(e, t, n, r = !1, i = Nm, a = "off") {
	let o = {
		main: e === "",
		if: km(e, t)
	};
	return {
		name: i.naming ? "" : jm(e, t),
		...o,
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching,
		frozen: ld(a, o)
	};
}
function Fm(e, t, n) {
	let r = Dm(e, n).map((e) => Om(e, n)), i = (e, i = n) => ({
		keys: r,
		meta: i,
		current: e,
		input: t,
		...Nm
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? pd(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !Tm(r[n]) && (e = r[n]);
		if (c = gd(a.mes, o, e), l = !e, s(e), !e) return {
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
		if (o.form === "new") return s(wm), o.ifLine ? {
			...i(wm, {
				...n,
				if: {
					...n.if ?? {},
					[wm]: !0
				}
			}),
			naming: !0,
			ifLine: !0,
			...e
		} : {
			...i(wm),
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
	if (o.form === "name" && Om(o.name, n) === "") return s(""), {
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
var Im = (e) => e.is_user ? md(e.mes) : e.mes, Lm = 983296, Rm = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, zm = (e) => `⟦${String.fromCodePoint(Lm + Math.min(e, 255))}⟧`;
function Bm(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(Rm, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function Vm(e, t, n, r) {
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
function Hm(e, t, n, r, i = "off") {
	let { meta: a, current: o } = n, s = Dm(e, a).map((e) => Om(e, a)), c = Mm(e.map((e, i) => {
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
		let n = e[t], r = Im(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), d = {
		current: o,
		naming: l,
		input: n.input,
		view: Mm(n.keys, o, a).order,
		vars: Pm(o, a, c.isNew, c.grouped, l, i),
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
var Um = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function Wm(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = Bm(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = Bm(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var Gm = "advanced_preset";
function Km(e) {
	let t = e?.extra?.[Gm];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function qm(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: G(n)
		}
	};
}
function Jm(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Gm] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Gm] = G(n));
}
function Ym(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[Sm], !n.extra.advanced_preset) ? !1 : (delete n.extra[Gm], !0);
}
//#endregion
//#region src/store/eventlog.ts
function Xm() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var Zm = (e) => `legacy-${e}`;
function Qm(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = Zm(n), t = !0);
	}), t;
}
function $m(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? Zm(e.index) : void 0);
}
var eh = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), th = "advanced_preset";
function nh() {
	return e().chatMetadata?.[th]?.seedEvents ?? [];
}
function rh(t = Infinity, n) {
	let r = nh().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of Km(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function ih(e = Infinity, t) {
	let n = {};
	for (let { event: r } of rh(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function ah(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of rh(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function oh(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = Km(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[th] && (e.extra[th].events = G(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[th] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function sh(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function ch(e, t, n, r, i, a = Xm()) {
	let o = e.globalMemory;
	Qm(o.log);
	let s = sh(e)[n] ?? null;
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
var lh = (e) => e.globalMemory.cursor > 0, uh = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function dh(e) {
	lh(e) && (e.globalMemory.cursor--, J());
}
function fh(e) {
	uh(e) && (e.globalMemory.cursor++, J());
}
function ph(e, t) {
	let n = e.globalMemory.log[eh(e, t)];
	n && (n.prev === null ? ch(e, "delete", n.key, void 0, "undo") : ch(e, "replace", n.key, n.prev, "undo"));
}
function mh(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = Xm();
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
function hh(e, t) {
	for (let n of t) eh(e, n.id) < 0 && ch(e, n.op, n.key, n.content, "model", n.id);
}
function gh(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[eh(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function _h(e) {
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
	}, J()), Qm(n.globalMemory.log) && J(), n;
}
function vh(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Hu(e, n.id)?.diff;
}
function yh(e, t = _h(e).active.ref) {
	return Fu(e.configurationDefaults, vh(e, _h(e), t));
}
function bh(e) {
	let t = _h(e);
	return Fu(yh(e, t.active.ref), t.active.diff);
}
function xh(e, t) {
	let n = _h(e);
	n.active.diff = Lu(t, yh(e, n.active.ref)) ?? {}, J();
}
function Sh(e, t) {
	let n = bh(e);
	return t(n), xh(e, n), n;
}
function Ch(e, t) {
	let n = _h(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var wh = (e) => Object.keys(_h(e).active.diff ?? {}).length > 0;
function Th(e) {
	_h(e).active.diff = {}, J();
}
function Eh(e, t) {
	let n = _h(e), r = bh(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Lu(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function Dh(e, t) {
	let n = _h(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Lu(bh(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function Oh(e, t, n) {
	let r = _h(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function kh(e, t) {
	let n = _h(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function Ah(e) {
	let t = _h(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = Tu(n, e.version) < 0, i = [], a = Vu(e), o = (t) => {
		let o = r ? Bu(t, e.migrations, n) : G(t);
		i.push(...Ru(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !Gu(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Kf(t.userModules, e.migrations, n));
	let s = Nf(t.userModules ?? [], t.userModuleGroups).filter((t) => t.enabled && zf(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, J(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && w("warning", K("um.lostAfterUpdate", { names: s.join(", ") }), rm(e)), i;
}
//#endregion
//#region src/store/tavern-helper.ts
var jh = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Mh(e, t, n = []) {
	let r = jh(t) ? t : {}, i = (e) => e.id !== Zd, a = (Array.isArray(r.scripts) ? r.scripts : []).filter(jh).filter(i).map((e) => Array.isArray(e.scripts) ? {
		...e,
		scripts: e.scripts.filter((e) => !jh(e) || i(e))
	} : e), o = G(e ?? []), s = Wd(o), c = /* @__PURE__ */ new Set([...s, ...n]), l = (e) => typeof e.id != "string" || !c.has(e.id), u = /* @__PURE__ */ new Map();
	for (let e of a) {
		typeof e.id == "string" && u.set(e.id, e);
		for (let t of Array.isArray(e.scripts) ? e.scripts.filter(jh) : []) typeof t.id == "string" && u.set(t.id, t);
	}
	let d = (e) => {
		let t = u.get(e.id);
		t && t.type === e.type && (typeof t.enabled == "boolean" && (e.enabled = t.enabled), e.data && jh(t.data) && (e.data = {
			...e.data,
			...G(t.data)
		}));
	};
	for (let e of o) {
		if (d(e), e.type !== "folder") continue;
		for (let t of e.scripts) d(t);
		let t = u.get(e.id), n = jh(t) && Array.isArray(t.scripts) ? t.scripts.filter(jh).filter(l) : [];
		e.scripts.push(...G(n));
	}
	let f = [...o, ...G(a.filter(l))], p = jh(r.variables) ? G(r.variables) : {}, m = Object.keys(r).some((e) => e !== "scripts" && e !== "variables");
	return !f.length && !Object.keys(p).length && !m ? { owned: s } : {
		data: {
			...G(r),
			scripts: f,
			variables: p
		},
		owned: s
	};
}
function Nh(e, t) {
	let n = (e) => JSON.stringify(jh(e) && Array.isArray(e.scripts) ? e.scripts.map((e) => jh(e) ? {
		...e,
		data: void 0,
		scripts: Array.isArray(e.scripts) ? e.scripts.map((e) => jh(e) ? {
			...e,
			data: void 0
		} : e) : void 0
	} : e) : []);
	return n(e) !== n(t);
}
function Ph(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of jh(e) && Array.isArray(e.scripts) ? e.scripts.filter(jh) : []) {
		n.set(String(t.id), t.content ?? null);
		for (let e of Array.isArray(t.scripts) ? t.scripts.filter(jh) : []) n.set(String(e.id), e.content ?? null);
	}
	let r = JSON.stringify(t.map((e) => n.get(e) ?? null)), i = 2166136261;
	for (let e = 0; e < r.length; e++) i = Math.imul(i ^ r.charCodeAt(e), 16777619) >>> 0;
	return i.toString(16);
}
//#endregion
//#region src/store/carrier.ts
var Fh = "advanced_preset";
function Ih(e) {
	let t = e?.extensions?.[Fh];
	if (!t?.tavernHelperPrevious || !t.tavernHelperScripts) return !1;
	let n = Ph(e.extensions[Ud], t.tavernHelperScripts);
	return n === t.tavernHelperPrevious && n !== t.tavernHelperCode;
}
var Lh = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Rh = (e) => Lh[e] ?? e, zh = () => e().getPresetManager("openai"), Bh = (e) => `AP · ${e.name}`;
function Vh() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function Hh(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Uh(e, t, n) {
	let r = e.carrier.prompt_order.map((e) => ({ ...e })), i = n?.extensions?.[Fh], a = Mh(e.tavernHelperScripts, n?.extensions?.[Ud], i?.presetId === e.id ? i.tavernHelperScripts : void 0), o = {
		presetId: e.id,
		version: e.version,
		hash: e.hash
	};
	if (a.owned.length) {
		let t = Ph(a.data, a.owned), n = i?.presetId === e.id ? i : void 0, r = n?.tavernHelperCode !== void 0 && n.tavernHelperCode !== t ? n.tavernHelperCode : n?.tavernHelperPrevious;
		Object.assign(o, {
			tavernHelperScripts: a.owned,
			tavernHelperCode: t
		}, r ? { tavernHelperPrevious: r } : {});
	}
	return {
		...G(t.sampling),
		prompts: G(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: G(r)
		})),
		extensions: {
			[Fh]: o,
			...e.regexScripts?.length ? { regex_scripts: G(e.regexScripts) } : {},
			...a.data ? { [Ud]: a.data } : {}
		}
	};
}
function Wh(e) {
	let t = zh();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Gh(e, t, n) {
	let r = zh();
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
async function Kh(e, t = {}) {
	let n = zh(), r = _h(e), i = Wh(e.id), a = i ?? Bh(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Fh], c = !o || t.force || s?.hash !== e.hash || Ih(o), l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && Hh(o) !== r.carrierHash && w("info", K("carrier.reset", { name: a }));
		let n = Uh(e, bh(e), o);
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = Hh(n), J(), await Gh(a, n, !!t.select || l);
		let i = n.extensions[Ud];
		l && Nh(o?.extensions?.tavern_helper, i) && Jh(a);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
var qh = !1;
function Jh(e) {
	"TavernHelper" in globalThis && !qh && (qh = !0, C(`<p>${S(K("carrier.tavernHelper.reload", { name: e }))}</p>`, K("carrier.tavernHelper.reloadNow"), K("common.later")).then((e) => {
		qh = !1, e && location.reload();
	}));
}
async function Yh(e) {
	await Kh(e, { select: !0 });
}
async function Xh(e) {
	let t = Wh(e.id);
	if (!t) return;
	let n = zh(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = bh(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...G(i)
	}, o = n.getSelectedPresetName() === t;
	Zh = !0;
	try {
		await Gh(t, a, o);
	} finally {
		Zh = !1;
	}
}
var Zh = !1;
function Qh(t) {
	if (Zh || Vh() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = bh(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Rh(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = G(r));
	}
	return Object.keys(i).length ? (Sh(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var $h = null, eg = (e) => {
	$h = e;
}, tg = () => {
	let e = $h;
	return $h = null, e;
}, ng = (e) => e.meta?.enabled !== !1;
function rg(t, n) {
	if (!ng(n)) return "";
	let r = Zs(t.meta.trigger, (e) => e[0] === "name" ? Dd(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function ig(e, t, n, r, i, a = [], o = !0) {
	let s = Kl(n, rg(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = Sd(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && Js(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && Js(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && Js(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? tg() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function ag(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var og = 0, sg = () => `ap-${Date.now().toString(36)}-${(++og).toString(36)}`, cg = /* @__PURE__ */ new Map(), lg = null, ug = null, dg = {
	setPending(e) {
		lg = e;
	},
	takePending() {
		let e = lg;
		return lg = null, e;
	},
	peekPending: () => lg,
	arm(e) {
		ug = e, cg.set(e.id, e);
	},
	takeArmed() {
		let e = ug;
		return ug = null, e;
	},
	get: (e) => cg.get(e),
	release(e) {
		cg.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of cg) t - r.createdAt > e && cg.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function fg(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.speech ? "v" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function pg(e, t) {
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
var mg = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, hg = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), gg = (e, t) => jp(e, t), _g = (e, t) => t ? mg(e)?.structures?.[t] : void 0, vg = (e, t) => mg(e)?.structures?.[t];
function yg(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = mg(e);
		if (a && hg.has(a.turn)) {
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
		let n = Kl(e.item.mes, t.trigger, t.wrap);
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
				} else _g(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && mg(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of a(t.speech?.depth ?? 0)) e.fresh.body === "full" && e.index !== t.continuing && mg(e.item)?.speech?.length && (e.fresh.speech = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && Op(vg(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function bg(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : _g(r, n.synopsisId);
			return e ? gg(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? mg(r)?.annotations : void 0, a = t.speech ? mg(r)?.speech : void 0;
			return a?.length && (e = Wc(e, a, n.speech?.tag)), i?.length && (e = yc(e, i)), t.echo?.length && n.echoes && (e = xg(e, r, t.echo, n.echoes)), e;
		}
	}
}
function xg(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = vg(t, e.id);
		Op(a) && e.pieces.forEach((t, n) => i.push({
			text: Ap(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? Mp(e, r.contentKey, i) : e;
}
function Sg(e, t) {
	let n = [];
	for (let r of yg(e, t)) {
		let e = bg(r, r.fresh, t);
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
function Cg(e, t) {
	return Sg(e, t).map((e) => e.item);
}
function wg(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? Sp(n) : 0;
	if (r) return wd(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function Tg(e, t, n) {
	let r = Object.values(e.structures).find((e) => e.kind === "speech"), i = r ? Cp(r) : 0;
	if (i && e.speech && n?.speech?.on) return wd(e, t).some((e) => e.structures.includes(r.id)) ? {
		depth: i,
		tag: r.tag
	} : void 0;
}
function Eg(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function Dg(e, t, n, r) {
	let i = new Set(wd(e, t).flatMap((e) => e.structures)), a = n ? Sd(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = xp(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? Js(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...Ep(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: Tp(r)
	} : void 0;
}
var Og = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function kg(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function Ag(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = kg(e), r = kg(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function jg(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Og(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Og(l.text);
			if (c === u || c.includes(u) || Ag(c, u) >= n) {
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
//#region src/core/bindings.ts
var Mg = { type: "current" };
function Ng(e, t) {
	let n = {};
	for (let r of zs) n[r] = e[r] === void 0 ? t[r] : e[r];
	return n;
}
function Pg(e) {
	let t = e;
	return t?.type === "profile" && typeof t.profile == "string" ? {
		type: "profile",
		profile: t.profile
	} : t?.type === "model" && typeof t.model == "string" ? {
		type: "model",
		model: t.model
	} : Mg;
}
function Fg(e) {
	return {
		id: Au,
		name: "",
		target: Pg(e.target),
		...Ng(e, e)
	};
}
function Ig(e) {
	let t = Fg(e.connection);
	return [t, ...Object.entries(e.connection.bindings ?? {}).filter(([e, t]) => e !== "default" && t && typeof t == "object").map(([e, n]) => ({
		id: e,
		name: typeof n.name == "string" ? n.name : e,
		target: Pg(n.target),
		...Ng(n, t)
	}))];
}
function Lg(e, t, n) {
	let r = Ig(e);
	if (!t || t === "default") return r[0];
	let i = r.find((e) => e.id === t);
	return i || n?.push(`binding \`${t}\` does not exist: the default binding is used`), i ?? r[0];
}
var Rg = (e, t) => !!e.multiModel && t.multiModel?.enabled === !0;
function zg(e, t, n, r) {
	return Rg(e, t) ? Lg(t, t.multiModel?.actors?.[n], r) : Lg(t, t.connection.binding, r);
}
var Bg = (e, t) => Lg(e, e.connection.binding, t);
function Vg(e, t) {
	return t.id === "default" ? e : {
		...e,
		connection: {
			...e.connection,
			...Ng(t, t)
		}
	};
}
var Hg = class extends Error {
	name = "BindingError";
}, Ug = /* @__PURE__ */ new Set([
	"messages",
	"tools",
	"tool_choice",
	"type",
	"stream",
	"json_schema"
]), Wg = [
	"custom_url",
	"vertexai_region",
	"zai_endpoint",
	"siliconflow_endpoint",
	"minimax_endpoint",
	"pollinations_endpoint"
];
function Gg(e) {
	let t = l().find((t) => t.id === e);
	if (!t) throw new Hg(K("error.binding.profileMissing"));
	let n = t.name || t.id;
	if (t.mode && t.mode !== "cc") throw new Hg(K("error.binding.textCompletion", { name: n }));
	if (Object.hasOwn(t, "custom-connection")) throw new Hg(K("error.binding.customConnection", { name: n }));
	if (t.api && !u(t.api)) throw new Hg(K("error.binding.textCompletion", { name: n }));
	return t;
}
function Kg(e, t) {
	let n = G(e), r = t.api ? u(t.api) : String(n.chat_completion_source ?? "");
	if (r !== n.chat_completion_source && delete n.custom_provider_state, n.chat_completion_source = r, typeof t["api-url"] == "string" && t["api-url"]) for (let e of Wg) n[e] = t["api-url"];
	if (typeof t.proxy == "string" && t.proxy) {
		let e = d(t.proxy);
		n.reverse_proxy = e?.url ?? "", n.proxy_password = e?.password ?? "";
	}
	return typeof t["prompt-post-processing"] == "string" && (n.custom_prompt_post_processing = t["prompt-post-processing"]), {
		settings: n,
		model: typeof t.model == "string" && t.model ? t.model : o(n, !0)
	};
}
function qg(e, t, n) {
	let r = { ...e };
	for (let e of /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(n)])) Ug.has(e) || JSON.stringify(t[e]) === JSON.stringify(n[e]) || (n[e] === void 0 ? delete r[e] : r[e] = G(n[e]));
	return r;
}
function Jg(e, t, n, r) {
	let i = {
		...e,
		chat_completion_source: n.chat_completion_source,
		model: r
	};
	for (let r of Wg) n[r] !== void 0 && (r === "custom_url" || e[r] !== void 0 || t["api-url"]) && (i[r] = n[r]);
	return n.reverse_proxy ? (i.reverse_proxy = n.reverse_proxy, i.proxy_password = n.proxy_password) : (delete i.reverse_proxy, delete i.proxy_password), i.custom_prompt_post_processing = n.custom_prompt_post_processing, i;
}
async function Yg(t, n) {
	if (n.type === "current") return t;
	let r = e().chatCompletionSettings ?? {}, i = String(t.type ?? "normal"), a = String(t.model ?? o(r)), s = r, c, l;
	if (n.type === "model") {
		if (c = n.model.trim(), !c) throw new Hg(K("error.binding.noModel"));
	} else l = Gg(n.profile), {settings: s, model: c} = Kg(r, l);
	let [u, d] = await Promise.all([f(G(r), a, i), f(G(s), c, i)]), p = u && d ? qg(t, u, d) : l ? Jg(t, l, s, c) : { ...t };
	return p.model = c, l?.["secret-id"] && (p.secret_id = l["secret-id"]), p;
}
function Xg(e, t) {
	if (e.transport !== "tool-single" && e.transport !== "tool-multi") return null;
	let n = e.target.type === "current" ? void 0 : {
		source: String(t.chat_completion_source ?? ""),
		model: String(t.model ?? ""),
		postProcessing: String(t.custom_prompt_post_processing ?? "")
	}, r = c(e.assumeToolSupport, n);
	if (!r) return null;
	switch (r.reason) {
		case "postProcessing": return K("error.toolsUnsupported.postProcessing", { value: r.label });
		case "model": return K("error.toolsUnsupported.model", { target: r.model ? `${r.source} / ${r.model}` : r.source });
		default: return K(`error.toolsUnsupported.${r.reason}`);
	}
}
//#endregion
//#region src/store/user-modules.ts
var Zg = 50;
function Qg(e, t) {
	let n = Mf(e, t);
	return n.groups.length === t.length && n.modules.every((t, n) => t === e[n]);
}
function $g(e) {
	let t = _h(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	let r = t.userModuleGroups ?? [];
	return Qg(n, r) ? n : (t_(e, n, r), t.userModules);
}
function e_(e) {
	return $g(e), _h(e).userModuleGroups ??= [];
}
function t_(e, t, n) {
	let r = _h(e), i = Mf(t, n);
	r.userModules = i.modules, r.userModuleGroups = i.groups, J();
}
var n_ = (e, t) => $g(e).find((e) => e.id === t), r_ = (e, t) => t ? e_(e).find((e) => e.id === t) : void 0;
function i_(e, t, n) {
	return r_(e, t)?.mode === "single" && $g(e).some((e) => e.group === t && e.id !== n && e.enabled);
}
var a_ = () => Math.random().toString(36).slice(2, 8);
function o_(e) {
	let t = new Set(e), n = a_();
	for (; t.has(n);) n = a_();
	return n;
}
function s_(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: o_(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function c_(e, t, n) {
	return r_(e, n) && (t.group = n, i_(e, n) && (t.enabled = !1)), t_(e, [...$g(e), t], e_(e)), n_(e, t.id);
}
function l_(e, t, n) {
	let r = {
		id: o_($g(e).map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: Cf()
	};
	return e.insertionPoints.length && r.entries.push(s_(e, r)), c_(e, r, n);
}
function u_(e, t, n) {
	let r = $g(e), i = new Set(r.map((e) => e.name)), a = t.name;
	for (let e = 2; i.has(a); e++) a = `${t.name} ${e}`;
	return c_(e, dp(t, o_(r.map((e) => e.id)), { name: a }), n);
}
function d_(e, t, n) {
	let r = $g(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...G(r[i]),
		id: o_(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return i_(e, a.group) && (a.enabled = !1), t_(e, [
		...r.slice(0, i + 1),
		a,
		...r.slice(i + 1)
	], e_(e)), n_(e, a.id);
}
function f_(e, t) {
	t_(e, $g(e).filter((e) => e.id !== t), e_(e));
}
function p_(e, t, n) {
	let r = n_(e, t);
	if (r) {
		if (n && r_(e, r.group)?.mode === "single") for (let t of $g(e)) t.group === r.group && t !== r && (t.enabled = !1);
		r.enabled = n, J();
	}
}
function m_(e, t, n, r) {
	let i = $g(e), a = i.find((e) => e.id === t);
	if (!a) return;
	let o = n === null ? void 0 : r_(e, n)?.id;
	if (n !== null && !o) return;
	let s = i.filter((e) => e !== a), c = Pf(s, o ?? null)[Math.max(0, r)], l = { ...a };
	o ? l.group = o : delete l.group, o !== a.group && l.enabled && i_(e, o, a.id) && (l.enabled = !1);
	let u = c ? s.indexOf(c) : s.length, d = [
		...s.slice(0, u),
		l,
		...s.slice(u)
	];
	d.every((e, t) => e.id === i[t].id) && l.group === a.group && l.enabled === a.enabled || t_(e, d, e_(e));
}
function h_(e, t, n = "multi") {
	let r = e_(e), i = {
		id: o_(r.map((e) => e.id)),
		name: t,
		mode: n
	};
	return t_(e, $g(e), [...r, i]), r_(e, i.id);
}
function g_(e, t, n) {
	let r = r_(e, t);
	r && (r.name = n, J());
}
function __(e, t, n) {
	let r = r_(e, t);
	r && r.mode !== n && (r.mode = n, t_(e, $g(e), e_(e)));
}
function v_(e, t, n) {
	let r = r_(e, t);
	r && (n ? r.collapsed = !0 : delete r.collapsed, J());
}
function y_(e, t, n) {
	let r = r_(e, t);
	r && (vf(r, n), J());
}
function b_(e, t, n) {
	let r = e_(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let a = [...r], [o] = a.splice(i, 1);
	a.splice(n, 0, o), t_(e, $g(e), a);
}
function x_(e, t, n) {
	let r = e_(e);
	if (!r.some((e) => e.id === t)) return;
	let i = $g(e);
	t_(e, n.withModules ? i.filter((e) => e.group !== t) : i.map((e) => e.group === t ? (({ group: e, ...t }) => t)(e) : e), r.filter((e) => e.id !== t));
}
function S_(e, t) {
	return ip(G($g(e).filter((e) => !t || t.includes(e.id))), e, G(e_(e)));
}
function C_(e, t) {
	let n = r_(e, t);
	return n ? {
		...ip(G(Pf($g(e), t)), e),
		groups: [G(n)]
	} : ip([], e);
}
function w_(e, t) {
	let n = ap(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && Tu(n.preset.version, e.version) < 0 && (r = Kf(r, e.migrations, n.preset.version));
	let i = e_(e).map((e) => e.id), a = /* @__PURE__ */ new Map(), o = n.groups.map((e) => {
		let t = o_(i);
		return i.push(t), a.set(e.id, t), {
			...e,
			id: t
		};
	}), s = $g(e).map((e) => e.id), c = r.map((e) => {
		let t = o_(s);
		s.push(t);
		let n = {
			...e,
			id: t
		};
		return e.group !== void 0 && (n.group = a.get(e.group)), n;
	});
	t_(e, [...$g(e), ...c], [...e_(e), ...o]);
	let l = c.map((t) => n_(e, t.id));
	return {
		added: l,
		groups: o.map((t) => r_(e, t.id)),
		missing: l.filter((t) => zf(e, t).length).length
	};
}
function T_(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < Zg; t--) {
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
var E_ = /* @__PURE__ */ _n({
	log: [],
	requests: []
}), D_ = 50;
function O_(e, t) {
	E_.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), E_.log.length > D_ && (E_.log.length = D_);
}
function k_(e) {
	return E_.requests.unshift(e), E_.requests.length > D_ && (E_.requests.length = D_), E_.requests[0];
}
//#endregion
//#region src/core/cache.ts
function A_(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function j_(e, t) {
	return e.send_date ? A_(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var M_ = 57344, N_ = /⟦([\uE000-\uF8FF])⟧/g, P_ = (e) => `⟦${String.fromCharCode(M_ + e)}⟧`;
function F_(e) {
	let t = [];
	return {
		text: e.replace(N_, (e, n) => (t.push(n.charCodeAt(0) - M_), "")),
		marks: t
	};
}
function I_(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of yg(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : pg(n?.[e], t.synopsisId), l = c ?? s.fresh, u = bg(s, s.fresh, t), d = c ? bg(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = fg(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: fg(l),
			freshMode: fg(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function L_(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function R_(e, t, n, r, i, a = {}) {
	let o = L_(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && A_(i) === n[r]) r++;
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
		r !== null && f.push(A_(r));
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
function z_(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var B_ = "advanced-preset.cache.v1", V_ = 864e5, H_ = 30, U_ = null;
function W_() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function G_() {
	if (U_) return U_;
	try {
		let e = W_()?.getItem(B_), t = e ? JSON.parse(e) : {};
		U_ = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		U_ = {};
	}
	return U_;
}
function K_(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= V_).sort((e, t) => t[1].at - e[1].at).slice(0, H_);
	U_ = Object.fromEntries(n);
	try {
		W_()?.setItem(B_, JSON.stringify(U_));
	} catch {}
}
function q_() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var J_ = (e, t) => t ? `${e}\u0001${t}` : e;
function Y_(e) {
	return G_()[e];
}
function X_(e, t) {
	K_({
		...G_(),
		[e]: t
	}, t.at);
}
function Z_(e, t) {
	let n = G_()[e];
	n && X_(e, {
		...n,
		at: t
	});
}
function Q_(e, t) {
	let n = G_(), r = (t) => J_(e, t);
	if (!t.some(([e, t]) => r(e) in n || r(t) in n)) return;
	let i = { ...n };
	for (let [e, n] of t) delete i[r(e)], delete i[r(n)];
	for (let [e, a] of t) n[r(e)] && (i[r(a)] = n[r(e)]);
	K_(i, Date.now());
}
//#endregion
//#region src/core/input-shaping.ts
var $_ = "⟦󰀀⟧", ev = "⟦󰀁⟧", tv = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function nv(e) {
	let t = e.match(tv)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + $_ + t;
}
var rv = (e) => e.replaceAll($_, "");
function iv(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = rv(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = rv(e.text));
}
function av(e, t, n, r) {
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
			let n = t.lastIndexOf($_);
			if (n < 0) continue;
			let a = rv(t.slice(0, n)).replace(tv, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: rv(t.slice(n + 4))
			};
		}
	}
	return null;
}
var ov = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function sv(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? gp(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && ov(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (ov(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var cv = "stream_function_call_arguments";
function lv(e, t, n) {
	if (e === "off" || t !== "gemini") return !1;
	if (e === "on") return !0;
	let r = String(n.chat_completion_source ?? "");
	return r === "vertexai" || r === "custom" || r === "makersuite" && !!String(n.reverse_proxy ?? "").trim();
}
function uv(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function dv(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[cv] = !0, t() && fv(e));
}
function fv(e) {
	let t = pv(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...uv(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function pv(e) {
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
//#region src/core/transports/signatures.ts
var mv = "skip_thought_signature_validator", hv = "google-gemini-v1", gv = /* @__PURE__ */ new WeakSet(), _v = /* @__PURE__ */ new WeakSet();
function vv(e) {
	return gv.add(e), e;
}
function yv(e, t) {
	if (t !== "gemini" && !(t === "openai" && e.config.connection.openAiSignatures)) return;
	let n = e.config.connection.syntheticTurn, r = n ? e.preset.syntheticTurns.find((e) => e.id === n) : void 0;
	return r ? Nu(r, Mu(e.config.connection)) : void 0;
}
function bv(e) {
	return _v.add(e), e;
}
function xv(e, t) {
	return !e.signatureFallback && (e.transport === "tool-single" || e.transport === "tool-multi") && !!yv(e, t);
}
function Sv(e) {
	let { message: t = "", body: n = "" } = e ?? {};
	return /thought[\s_-]?signature/i.test(`${t}\n${n}`);
}
function Cv(e, t, n = {}) {
	return t !== "gemini" && !(t === "openai" && n.openAi) ? e : e.map((e) => e.role !== "assistant" || !Array.isArray(e.tool_calls) || !e.tool_calls.length ? e : t === "gemini" ? Tv(e, !!n.fallback) : gv.has(e) ? Ev(e, !!n.fallback, n.source === "openrouter") : e);
}
var wv = (e, t) => t && _v.has(e) || typeof e.signature != "string" || !e.signature ? void 0 : e.signature;
function Tv(e, t) {
	let n = e.tool_calls;
	return n.every((e) => wv(e, t)) ? e : {
		...e,
		tool_calls: n.map((e) => ({
			...e,
			signature: wv(e, t) ?? "skip_thought_signature_validator"
		}))
	};
}
function Ev(e, t, n) {
	let r = Array.isArray(e.reasoning_details) ? [...e.reasoning_details] : [], i = e.tool_calls.map((e) => {
		let i = wv(e, t), { signature: a, ...o } = e;
		return i ? (r.push({
			type: "reasoning.encrypted",
			data: i,
			id: e.id,
			format: hv,
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
function Dv(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of kl(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Ov(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function kv(e) {
	return e.turn ? kl(e.preset.tools, e.workflow, e.turn.stages, e.turn.structures, Ov(e), {
		stages: e.stages,
		structures: e.structures
	}) : kl(e.preset.tools, e.workflow, e.stages, e.structures, Ov(e));
}
function Av(e) {
	let t = e.preset.tools.envelope.when;
	return !t || !e.assembly || Js(t, e.assembly.resolve);
}
function jv(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Dd(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Mv(e, t, n) {
	let r = vl(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Ov(e)(r);
}
function Nv(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = yv(r, i), l = {
		id: s,
		type: "function",
		function: {
			name: o.tool.name,
			arguments: "{}"
		},
		...c ? { signature: c } : {}
	};
	c && bv(l);
	let u = Ov(r), d = u(o.tool.description);
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
			vv({
				role: "assistant",
				content: "",
				tool_calls: [l]
			}),
			{
				role: "tool",
				tool_call_id: s,
				content: Mv(r, o.response[t], { first: n })
			}
		]
	};
}
function Pv(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t);
	let r = String(n.chat_completion_source ?? "");
	return Array.isArray(n.messages) && (n.messages = Cv(n.messages, e.family, {
		fallback: e.ctx.signatureFallback,
		source: r,
		openAi: e.ctx.config.connection.openAiSignatures
	})), e.family === "gemini" && Fv(n, e.ctx.preset.tools.jsonStringHint), lv(e.ctx.config.connection.streamToolArguments, e.family, n) && dv(n), n;
}
function Fv(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Hd(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Bd(e.json_schema.value, n)
	});
}
function Iv(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var Lv = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", Rv = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll($_, ""), zv = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(N_.source).test(e);
function Bv(e) {
	for (let t of e) if (typeof t.content == "string") zv(t.content) && (t.content = F_(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && zv(e.text) && (e.text = F_(e.text).text);
}
function Vv(e) {
	if (typeof e.content == "string") {
		if (!zv(e.content)) return null;
		let { text: t, marks: n } = F_(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => z_(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !zv(e.text)) return;
		let i = F_(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = z_(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function Hv(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = kv(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return A_(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function Uv(e) {
	return A_(e.map((e) => `${e.role}\u0000${Lv(e.content)}`).join(""));
}
function Wv(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return Bv(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = Vv(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = Rv(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = Rv(i.content);
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
			sticky: Rv(f),
			fresh: Rv(p),
			stickyMode: s.stickyMode,
			freshMode: s.freshMode
		}), c.push({
			index: e,
			sticky: f,
			fresh: p
		});
	}
	let f = {
		model: e.firstTarget ? `${a()}|${JSON.stringify(e.firstTarget)}` : a(),
		tools: Hv(e),
		prompt: Uv(t.slice(0, n))
	}, p = R_(l, Y_(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function Gv(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? Z_(n.chat, t) : X_(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var Kv = "advanced_preset", qv = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function Jv() {
	let t = e().chatMetadata?.[Kv]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function Yv(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[Kv] ??= {};
	r.storylines = t;
}
function Xv(t = e().chat, n = Jv()) {
	return Dm(t, n).map((e) => Om(e, n));
}
function Zv(t = e().chat, n = Jv()) {
	let r = new Set(Xv(t, n).filter((e) => e !== "" && !Tm(e)));
	n.main && r.add(n.main);
	for (let e of [...Object.keys(n.if ?? {}), ...Object.keys(n.hidden ?? {})]) r.add(e);
	return r;
}
function Qv(t, n = e().chat, r = Jv()) {
	let i = Xv(n, r);
	return Mm(i, t ?? i.at(-1) ?? "", r).order;
}
function $v(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function ey(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[Sm] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[Sm] = n);
}
async function ty(t, n) {
	if (!t) return;
	let r = Jv();
	Yv({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function ny(t) {
	let n = Jv();
	return !fd(t) || Xv(e().chat, n).includes(t) ? !1 : (Yv({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
async function ry(t, n) {
	if (!t) return await ny(n) ? "renamed" : fd(n) ? "taken" : "invalid";
	if (!fd(n)) return "invalid";
	if (n === t) return "unchanged";
	let r = Jv();
	if (n === r.main || Xv(e().chat, r).includes(n)) return "taken";
	let i = e().chat, a = [];
	i.forEach((e, r) => {
		if (e.is_user) {
			let i = pd(e.mes);
			if (i?.form !== "name" || i.name !== t) return;
			e.mes = gd(e.mes, i, n), a.push(r);
		} else e.swipe_info?.forEach((e) => {
			e?.extra?.advanced_preset_storyline === t && (e.extra[Sm] = n);
		}), e.extra?.advanced_preset_storyline === t && (e.extra[Sm] = n);
	});
	let o = km(t, r), s = Am(t, r), c = { ...r.if ?? {} }, l = { ...r.hidden ?? {} };
	delete c[t], delete l[t], o === bd(n) ? delete c[n] : c[n] = o, s === o ? delete l[n] : l[n] = s;
	let u = {
		...r,
		if: c,
		hidden: l
	};
	Object.keys(c).length || delete u.if, Object.keys(l).length || delete u.hidden, Yv(u), Q_(q_(), [[t, n]]);
	for (let t of a) e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "renamed";
}
async function iy(t, n) {
	if (!t) return;
	let r = Jv();
	Yv({
		...r,
		hidden: {
			...r.hidden ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
function ay(e, t) {
	if (!e) return;
	let n = Jv(), r = { ...n };
	t.ifLine !== void 0 && (t.ifLine || bd(e)) && (r.if = {
		...n.if ?? {},
		[e]: t.ifLine
	}), t.hide && (r.hidden = {
		...n.hidden ?? {},
		[e]: !0
	}), Yv(r);
}
function oy(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[Cm] = !0);
}
async function sy(t, n) {
	let r = Jv();
	if (!fd(t)) return "invalid";
	if (Om(t, r) === "") return "unchanged";
	let i = e().chat, a = Dm(i, r).map((e) => Om(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!fd(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = hd(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? Om(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Sm] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Sm] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && km(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t];
	let l = { ...r.hidden ?? {} };
	o && delete l[o], delete l[t], Yv({
		...r,
		main: t,
		if: c,
		...Object.keys(l).length || r.hidden ? { hidden: l } : {}
	}), Q_(q_(), o ? [["", o], [t, ""]] : [[t, ""]]);
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/media-vars.ts
var cy = {
	image: () => ({
		vars: { ...wc },
		refs: []
	}),
	speech: () => ({
		vars: { ...Tc },
		format: "",
		characters: []
	})
}, ly = {};
function uy(e) {
	ly = {
		...ly,
		...e
	};
}
function dy() {
	return {
		image: ly.image ?? cy.image,
		speech: ly.speech ?? cy.speech
	};
}
var fy = (e, t, n) => {
	try {
		return e();
	} catch (e) {
		return console.error(`[AP] ${n} runtime failed`, e), t();
	}
};
function py(e) {
	if (!e.image) return cy.image();
	let t = fy(() => dy().image(), cy.image, "image");
	if (!t.vars.on) return {
		vars: { ...wc },
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
function my(e) {
	if (!e.speech) return cy.speech();
	let t = fy(() => dy().speech(), cy.speech, "speech");
	if (!t.vars.on) return {
		vars: { ...Tc },
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
var hy = /⟦ap:region:([\w.-]+)⟧/g, gy = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function _y(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(hy)) {
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
function vy(t, n, r) {
	if (!ng(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = Dd(t, n, t.user), s = Dd(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Km(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? sl(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function yy(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = Km(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : nl(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var by = (e, t, n) => n === "story" && Rg(e, t);
function xy(e, t) {
	let n = Bg(e.config);
	if (!t) return n;
	let r = ag(e.preset, e.config, e.origin);
	if (!r) return n;
	let { vars: i } = Cy({
		...e,
		transport: n.transport,
		multiModel: t
	}, r), a = yl(r, Sd(i))[0]?.actor;
	return a ? zg(e.preset, e.config, a) : n;
}
var Sy = (e) => e?.view;
function Cy(t, n) {
	let { preset: r, config: i } = t, a = Sy(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = yy(r, s), l = ih(Infinity, a), u = sh(_h(r)), d = ah(Infinity, a), f = vy(r, i, s), p = qv(r, i) ? Jv().main ?? "" : "", m = t.transport, h = t.origin === "story", g = py(h ? r : {}), _ = my(h ? r : {});
	return {
		vars: Fd(r, i, {
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
				...ud,
				name: p
			},
			image: g.vars,
			speech: _.vars,
			multiModel: !!t.multiModel
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
			inputText: t.inputShaped ? ev : "",
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
function wy(t, n, r) {
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
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = jg(c.map(({ m: e }) => ({
		role: e.role,
		text: gy(e.content)
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
			mes: gy(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (qv(i, a)) {
		let e = Hm(p, m, Fm(l, -1, Jv()), -1, cd(a.storylines));
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = Cy(t, ag(i, a, t.origin)).vars, v = {
		trigger: rg(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...Eg(i),
		echoes: Dg(i, a, _, ag(i, a, "story")),
		recap: ah(Infinity, Sy(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: wg(i, a),
		speech: Tg(i, a, _),
		...g ? { background: (e) => Um(g, h[e]) } : {}
	}, y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = J_(q_(), g?.current), n = I_(p, v, Y_(e)?.modes, (e) => j_(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			y.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + P_(e.entry));
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
	} else for (let e of Cg(p, v)) y.set(e.__h, e.mes), b.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = b.get(e);
		e >= 0 && y.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (y.set(e, nv(y.get(e))), t.input = { texts: n });
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
function Ty(t, n) {
	let r = n ? null : dg.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = bh(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = ig(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n), d = n ? "normal" : "script", f = by(t, i, u), p = xy({
		preset: t,
		config: i,
		origin: u,
		stType: d,
		meta: c,
		flags: l
	}, f);
	return {
		id: sg(),
		preset: t,
		config: i,
		origin: u,
		stType: d,
		interceptorRan: !1,
		dryRun: n,
		meta: c,
		flags: l,
		transport: p.transport,
		stages: [],
		structures: [],
		inputIndex: -1,
		createdAt: Date.now(),
		warnings: [],
		keywords: T_(a, n ? o : -1),
		...f ? { multiModel: f } : {},
		...p.target.type === "current" ? {} : { firstTarget: p.target }
	};
}
var Ey = Symbol("ap-region"), Dy = Symbol("ap-region-id");
function Oy(e, t, n) {
	return (e.regions[t] ?? []).map((e) => {
		let r = {
			role: e.role,
			content: n(e.content)
		};
		return Object.defineProperty(r, Ey, { value: !0 }), Object.defineProperty(r, Dy, { value: t }), r;
	}).filter((e) => gy(e.content).trim());
}
function ky(e, t, n, r) {
	let i = [];
	for (let a of n) for (let n of e.preset.regions) n.beforeStage === a.id && i.push(...Oy(t, n.id, r));
	return i;
}
function Ay(e, t, n) {
	if (!t.length) return e;
	let r = e[e.length - 1];
	return n && r?.role === "assistant" ? [
		...e.slice(0, -1),
		...t,
		r
	] : [...e, ...t];
}
function jy(e, t, n, r) {
	let i = t.slice(), a = new Set(i), o = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = null;
		for (let n = e.before.length - 1; n >= 0; n--) if (a.has(e.before[n])) {
			t = e.before[n];
			break;
		}
		o.set(t, [...o.get(t) ?? [], e.id]);
	}
	return (t) => {
		let n = e.fillInput ?? ((e) => e), a = [], s = /* @__PURE__ */ new Set(), c = -1, l = (i) => {
			s.has(i) || (s.add(i), a.push(...Oy(t, i, (e) => n(r(e)))), i === e.preset.anchors.historyStart && (c = a.length));
		};
		for (let e of o.get(null) ?? []) l(e);
		for (let e of i) {
			let t = e[Dy];
			t ? l(t) : a.push(e);
			for (let t of o.get(e) ?? []) l(t);
		}
		return {
			messages: a,
			historyAt: c
		};
	};
}
function My(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function Ny(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? av(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (iv(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(ev) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		sv(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(ev, () => c) : e;
		t.fillInput = e;
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
function Py(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return Vm(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = xd(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, Ey, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && gy(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function Fy(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => gy(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Dd(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = gy(t.content);
		if (t[Ey] || t.role === "system") return n;
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
var Iy = /* @__PURE__ */ new Set();
function Ly(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !Iy.has(n) && (Iy.add(n), w("warning", K("warn.template", { error: n }), K("app.name")));
}
function Ry(e) {
	let t = (e) => (typeof e.content == "string" ? e.content : JSON.stringify(e.content ?? "")).includes(Xd);
	for (let n = e.length - 1; n >= 0; n--) t(e[n]) && e.splice(n, 1);
}
async function zy(t) {
	let { chat: n, dryRun: r } = t;
	if (Ry(n), !q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		Bv(n), iv(n), Wm(n), r || (dg.setPending(null), dg.takeArmed());
		return;
	}
	let i = Vh(), a = i ? gm(i) : void 0;
	if (!a) {
		let e = _y(n).filter((e) => !e.__anchor);
		Bv(e), iv(e), Wm(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = Ty(a, r), s = _y(n), c = Wm(s);
	!o.interceptorRan && !r && wy(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : ag(a, o.config, o.origin), d = a.inputShaping, f = My(a, s), p = d && o.input ? av(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = Cy(o, u), g = Hf(a, Nf($g(a), e_(a)), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = !!(o.multiModel && u), v = _ ? Rp(yl(u, Sd(m)), !0)[0] : void 0, y = {
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, b = Pd({
		...y,
		...v ? { phase: {
			stages: v.stages.map((e) => e.id),
			index: 0,
			actor: v.actor
		} } : {}
	}, u);
	b.warnings.length && Ly(b.warnings, o.warnings), o.workflow = u, o.assembly = b, o.stages = b.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : b.structures, o.phases = Bp(o.stages, o.structures, _ ? Od(a, u, o.stages, o.structures) : void 0, _, u), _ && (o.phaseAssembly = (e, t) => {
		let n = Pd({
			...y,
			vars: {
				...m,
				transport: t,
				style: a.styles[t]
			},
			phase: {
				stages: e.stages.map((e) => e.id),
				index: e.index,
				actor: e.actor
			}
		}, u);
		n.warnings.length && Ly(n.warnings, o.warnings);
		let r = o.fillInput;
		if (r) {
			let e = n.expand;
			n.expand = (t) => r(e(t));
		}
		return n;
	});
	let x = (t) => e().substituteParams(t), S = [], C = -1, ee = -1, w = {
		genId: o.id,
		at: Date.now(),
		dryRun: r,
		origin: o.origin,
		transport: o.transport,
		workflow: u?.id ?? "",
		modules: b.modules.map((e) => e.id),
		regions: [],
		warnings: o.warnings,
		vars: Object.entries(b.buildVars).map(([e, t]) => ({
			id: e,
			text: id(t)
		}))
	}, T = [];
	for (let e of s) {
		if (!e.__anchor) {
			S.push(e);
			continue;
		}
		let t = e.__anchor;
		t === a.anchors.historyEnd && ee < 0 && (ee = S.length);
		let n = Oy(b, t, x);
		w.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: gy(e.content).length,
				content: gy(e.content)
			}))
		}), n.length || T.push({
			id: t,
			before: S.slice()
		}), S.push(...n), t === a.anchors.historyStart && (C = S.length);
	}
	let te = new Set(s.map((e) => e.__anchor).filter(Boolean)), ne = new Set(a.regions.filter((e) => e.beforeStage).map((e) => e.id));
	for (let [e, t] of Object.entries(b.regions)) !te.has(e) && !ne.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	let E = ee < 0 ? S.length : ee, re = o.storylines;
	re && (w.storyline = {
		...re.vars,
		groups: re.groups.map((e) => e.main ? `(main) ${e.name}` : `${e.if ? "(if) " : ""}${e.hidden ? "(hidden) " : ""}${e.name || "?"}`),
		hidden: re.hidden,
		grouped: re.grouped
	}, re.grouped && C >= 0 && (E = Py(o, re, S, C, E))), w.cache = Wv(o, S, C, E), w.input = Ny(o, S, C, E, w), _ && (o.rerender = jy(o, S, T, x));
	let ie = o.transport === "prefill" && !l && C >= 0, ae = ie ? Fy(o, S, C) : S;
	if (!l && u) {
		let e = o.phases[0], t = ky(o, b, e.stages, (e) => o.fillInput ? o.fillInput(x(e)) : x(e));
		for (let n of a.regions) {
			if (!n.beforeStage || !e.stages.some((e) => e.id === n.beforeStage)) continue;
			let r = t.filter((e) => e[Dy] === n.id);
			w.regions.push({
				id: n.id,
				messages: r.map((e) => ({
					role: e.role,
					chars: gy(e.content).length,
					content: gy(e.content)
				}))
			});
		}
		ae = Ay(ae, t, ie);
	}
	n.splice(0, n.length, ...ae.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), O_("assembly", w), !r && !l && u && dg.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var By = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, Vy = (e) => typeof e == "object" && !!e && !Array.isArray(e), Hy = (e, t) => qv(e, t) ? cd(t?.storylines) : "off";
function Uy() {
	let e = Vh(), t = e ? gm(e) : void 0;
	return t ? Hy(t, bh(t)) : "off";
}
function Wy(e, t) {
	if (typeof e != "string" || !e) return -1;
	for (let n = t.length - 1; n >= 0; n--) if (t[n].mes === e) return n;
	if (e.length >= 40) {
		for (let n = t.length - 1; n >= 0; n--) if (t[n].mes.includes(e)) return n;
	}
	return -1;
}
var Gy = (e) => !!(Zy?.open && e >= Zy.from);
function Ky(t, n = e().chat) {
	let r = Wy(t, n);
	return r < 0 ? null : Gy(r) ? Zy.line : Xv(n)[r];
}
function qy(t, n, r = e().chat) {
	if (n === "off") return !1;
	let i = Wy(t, r);
	if (i < 0 || Gy(i)) return !!(Zy?.open && Zy.frozen);
	let a = Xv(r)[i];
	return ld(n, {
		main: a === "",
		if: km(a, Jv())
	});
}
var Jy = /* @__PURE__ */ new WeakSet();
function Yy(e, t, n) {
	Vy(e) && Array.isArray(t) && qy(n, Uy()) && (t.length && O_("variables", {
		frozen: "mvu",
		storyline: Ky(n) ?? Zy?.line,
		commands: t.length
	}), t.splice(0, t.length), Jy.add(e));
}
function Xy(e, t) {
	Vy(e) && Jy.has(e) && (Jy.delete(e), Vy(t) && "stat_data" in t && (e.stat_data = G(t.stat_data)), e.delta_data = {});
}
var Zy = null;
function Qy(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return Vy(n) ? n : void 0;
}
var $y = /* @__PURE__ */ new Set(["display_data", "delta_data"]), eb = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !$y.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function tb(t) {
	Zy = null, t.line !== void 0 && (Zy = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		frozen: t.frozen,
		from: Math.max(0, t.from),
		chatVars: t.frozen ? G(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function nb() {
	let t = Zy;
	if (!t?.frozen) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return Zy = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = G(t.chatVars), r = !0);
	let o = n.chat, s = Xv(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = Qy(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = Qy(o[t]);
		eb(n, r) || (t.variables[t.swipe_id ?? 0] = r ? G(r) : {}, i = !0);
	}
	return (r || i) && O_("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var rb = () => {
	Zy = null;
};
function ib() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(By.commandParsed, (e, t, n) => Yy(e, t, n)), r(By.updateEnded, (e, t) => Xy(e, t));
	let i = (e) => () => {
		Zy && (e && (Zy.open = !1), setTimeout(() => void nb().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || rb();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, rb);
}
//#endregion
//#region src/core/interceptor.ts
async function ab(t, n, r, i) {
	if (dg.setPending(null), !q().enabled) return;
	let a = Vh(), o = a ? gm(a) : void 0;
	if (!o) return;
	let s = bh(o), c = i || "normal";
	c === "swipe" && Ym(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (qv(o, s)) {
		let e = Jv(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = Fm(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || $v(n, i.rewrite), i.noRecent && w("info", K("storylines.noRecent"), K("app.name")));
		let a = Hm(t, r ? t.map((e, t) => t) : f, i, u, cd(s.storylines));
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", g = t.slice(-6).map((e) => e.mes), _ = T_(t, u), { meta: v, flags: y, origin: b } = ig(o, s, h, c, !0, g), x = by(o, s, b), S = xy({
		preset: o,
		config: s,
		origin: b,
		stType: c,
		meta: v,
		flags: y,
		storylines: p
	}, x), C = S.transport, { vars: ee } = Cy({
		preset: o,
		config: s,
		transport: C,
		origin: b,
		stType: c,
		meta: v,
		flags: y,
		storylines: p,
		multiModel: x
	}, ag(o, s, b)), T = {
		trigger: rg(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Eg(o),
		echoes: Dg(o, s, ee, ag(o, s, "story")),
		recap: ah(Infinity, Sy(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: wg(o, s),
		speech: Tg(o, s, ee),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => Um(p, m[e]) } : {}
	}, te = (e, t) => p?.grouped && m[e] !== void 0 ? zm(m[e]) + t : t, ne, E, re = -1, ie = [];
	if (s.cache?.enabled) {
		let e = J_(q_(), p?.current), n = I_(t, T, Y_(e)?.modes, (e) => j_(t[e], f[e] ?? e));
		if (E = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: te(n, t === void 0 ? e.mes : e.mes + P_(t))
		})), re = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, re >= 0) {
			let e = n.out[re], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
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
		let e = Sg(t, T);
		E = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: te(t, e.mes)
		} : e), re = u >= 0 ? e.findIndex((e) => e.index === u) : -1, re >= 0 && (ie = [e[re].item.mes]);
	}
	let ae;
	o.inputShaping && re >= 0 && ie.some((e) => e.trim()) && (E[re] = {
		...E[re],
		mes: nv(E[re].mes)
	}, ae = { texts: ie }), t.splice(0, t.length, ...E);
	let oe = {
		id: sg(),
		preset: o,
		config: s,
		origin: b,
		stType: c,
		interceptorRan: !0,
		dryRun: !1,
		meta: v,
		flags: y,
		transport: C,
		stages: [],
		structures: [],
		inputIndex: u >= 0 ? f[u] ?? d.length - 1 : -1,
		continueFrom: c === "continue" ? t[l]?.mes : void 0,
		keywords: _,
		sticky: ne,
		input: ae,
		storylines: p,
		createdAt: Date.now(),
		warnings: [],
		...x ? { multiModel: x } : {},
		...S.target.type === "current" ? {} : { firstTarget: S.target }
	};
	tb({
		line: p?.current,
		frozen: !!p?.vars.frozen,
		from: oe.inputIndex >= 0 ? oe.inputIndex : d.length - 1
	}), dg.setPending(oe);
}
//#endregion
//#region src/core/transports/text.ts
function ob(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = jv(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => Bl(e, {
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
			content: vl(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Pv({
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
			let n = Iv(t, e.caller);
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
var sb = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, cb = 32, lb = 10, ub = 9, db = 13, fb = 160, pb = 6158, mb = 8192, hb = 8203, gb = 8239, _b = 8287, vb = 12288, yb = 65279;
function bb(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function xb(e) {
	return e >= "0" && e <= "9";
}
function Sb(e) {
	return e >= " ";
}
function Cb(e) {
	return ",:[]/{}()\n+".includes(e);
}
function wb(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Tb(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Eb = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Db = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function Ob(e) {
	return ",[]/{}\n+".includes(e);
}
function kb(e) {
	return Fb(e) || Ab.test(e);
}
var Ab = /^[[{\w-]$/;
function jb(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function Mb(e, t) {
	let n = e.charCodeAt(t);
	return n === cb || n === lb || n === ub || n === db;
}
function Nb(e, t) {
	let n = e.charCodeAt(t);
	return n === cb || n === ub || n === db;
}
function Pb(e, t) {
	let n = e.charCodeAt(t);
	return n === fb || n === pb || n >= mb && n <= hb || n === gb || n === _b || n === vb || n === yb;
}
function Fb(e) {
	return Ib(e) || Rb(e);
}
function Ib(e) {
	return e === "\"" || e === "“" || e === "”";
}
function Lb(e) {
	return e === "\"";
}
function Rb(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function zb(e) {
	return e === "'";
}
function Bb(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function Vb(e, t) {
	let n = e.length;
	if (!Mb(e, n - 1)) return e + t;
	for (; Mb(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function Hb(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function Ub(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var Wb = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function Gb(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = Wb[n];
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
function Kb(e) {
	return e !== null && e.char === "\"";
}
function qb(e) {
	return e !== null && e.char === "'";
}
function Jb(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function Yb(e, t) {
	switch (t) {
		case ")": return Jb(e, "(") > Jb(e, ")");
		case "]": return Jb(e, "[") > Jb(e, "]");
		case "}": return Jb(e, "{") > Jb(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Xb = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Zb = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Qb(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || E(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), kb(e[t]) && Ub(n) ? (r || (n = Vb(n, ",")), g()) : r && (n = Bb(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? Mb : Nb, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (Pb(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !$b(e, t);) t++;
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
			if (wb(e[t])) for (; t < e.length && Tb(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = Vb(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = Bb(n, ",")) : re();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (kb(e[t]) || c ? n = Vb(n, ":") : ie()), i() || (s || c ? n += "null" : ie()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = Vb(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = Vb(n, ",")), p(), !i()) {
					r || (n = Bb(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = Vb(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = Vb(n, ",")), t = i();
		t || (n = Bb(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, Fb(e[t]) || ne());
		let s = e[t] === "&" ? Gb(e.slice(t, t + 12)) : null, c = Kb(s) || qb(s);
		if (Fb(e[t]) || c) {
			let l = Lb(e[t]) ? Lb : zb(e[t]) ? zb : Rb(e[t]) ? Rb : Ib, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = ee(t - 1);
					return !r && Cb(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = Vb(p, "\""), n += p, !0);
				}
				if (t === i) return p = Vb(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? Gb(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Cb(e[t]) && !Yb(p, e[t]) || Fb(e[t]) && !w(t) || xb(e[t])) return v(), !0;
					e[t] === "\\" && ne();
					let s = ee(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Cb(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && Ob(e[t])) {
					if (e[t - 1] === ":" && Eb.test(e.substring(u + 1, t + 2))) for (; t < e.length && Db.test(e[t]);) p += e[t], t++;
					return p = Vb(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : jb(e) ? p += Xb[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Zb[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && bb(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ae();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : jb(n) ? (p += Xb[n], t++) : (Sb(n) || te(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = Bb(n, "\"", !0);
			let e = n.length;
			n = _() ? Hb(n, e, 1) : Vb(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !xb(e[t]) && T() && (i += "0")), e[t] === "0" && xb(e[t + 1]) && (a = !0); xb(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, xb(e[t]) || (i += "0"); xb(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), xb(e[t]) || (i += "0"); xb(e[t]);) i += e[t], t++;
			return T() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Tb(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (wb(e[t])) {
			for (; t < e.length && Tb(e[t]);) t++;
			let n = t;
			for (; Mb(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !Ob(e[t]) && !Fb(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Eb.test(e.substring(a, t + 2))) for (; t < e.length && Db.test(e[t]);) t++;
		if (t > a) {
			for (; Mb(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && Mb(e, n);) n--;
		return n;
	}
	function w(t) {
		let n = t + 1;
		for (; n < e.length && Mb(e, n);) n++;
		return n >= e.length || Cb(e[n]);
	}
	function T() {
		return t >= e.length || Cb(e[t]) || Mb(e, t);
	}
	function te(e) {
		throw new sb(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ne() {
		throw new sb(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function E() {
		throw new sb("Unexpected end of json string", e.length);
	}
	function re() {
		throw new sb("Object key expected", t);
	}
	function ie() {
		throw new sb("Colon expected", t);
	}
	function ae() {
		throw new sb(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function $b(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function ex(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function tx(e, t) {
	let n = ex(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Qb(n));
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
function nx(e, t, n, r, i = !0) {
	let a = Il(e.stages), o = e.stages.find((e) => e.kind === "text"), s = i ? n?.[t.envelopeKeys.thinking] : void 0;
	o && typeof s == "string" && (a.stages[o.id] = {
		text: s,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && a.stages[t.id].status !== "done" && (a.stages[t.id].status = t.optional ? "pending" : "missing");
	return a.current = r ? null : o?.id ?? null, a;
}
function rx(e) {
	let { ctx: t, caller: n } = e, r = kv(t), i = r.schema(), a = Av(t), o = n.schema ? a ? r.envelope(n.schema.value) : n.schema.value : i.value, s = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, c = null, l = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", u = (e, i) => {
		let o = tx(l(e), i);
		return c = o.value, n.schema ? nx(t, r, o.value, i, a) : Vl(o.value, {
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
		body: () => Pv(e, { json_schema: d }),
		progress: (e, t) => (s = e, u(e, t)),
		complete: () => ({ done: !0 }),
		result: () => u(s, !0),
		rawText: () => s.text,
		callerResult: () => a ? c?.[r.envelopeKeys.result] : c ?? void 0
	};
}
//#endregion
//#region src/core/transports/tools.ts
var ix = (e, t) => vv({
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
function ax(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function ox(e) {
	let { ctx: t, caller: n } = e, r = kv(t), i = Av(t), a = r.submitTool(n.schema ? i ? r.envelope(n.schema.value) : n.schema.value : void 0), o = a.function.name, s = Nv(e, "single", o), c = [
		...s ? [s.tool] : [],
		...e.extraTools ?? [],
		a,
		...n.tools
	], l = [...e.messages, ...s?.messages ?? []], u = t.config.connection.forceTool && !n.tools.length, d = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, f = null, p = (e, a) => {
		let s = tx((e.toolCalls.find((e) => e.name === o) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", a);
		return f = s.value, n.schema ? nx(t, r, s.value, a, i) : Vl(s.value, {
			stages: t.stages,
			structures: t.structures,
			final: a,
			openKey: s.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => Pv(e, {
			messages: l,
			tools: c,
			tool_choice: u ? {
				type: "function",
				function: { name: o }
			} : "auto"
		}),
		progress: (e, t) => (d = e, p(e, t)),
		complete: (e) => {
			let t = Iv(e, n);
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
function sx(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = kv(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = Nv(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...e.extraTools ?? [],
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
		let i = tx(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? nx(t, s, e, a) : Vl(e, {
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
			return Pv({
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
			let i = ax(e.toolCalls.filter((e) => e.name), r), o = Iv(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(ix(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = Mv(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: Mv(t, a.tools.results.nudge, {
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
function cx(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return ob(e);
		case "structured": return rx(e);
		case "tool-single": return ox(e);
		case "tool-multi": return sx(e);
	}
}
//#endregion
//#region src/core/phases.ts
function lx(e, t, n) {
	if ((e.phases ?? [t]).length === 1) return n.id === "default" && n.transport === e.transport ? e : {
		...e,
		transport: n.transport,
		config: Vg(e.config, n)
	};
	let r = t.index === 0 && n.transport === e.transport ? e.assembly : e.phaseAssembly?.(t, n.transport) ?? e.assembly;
	return {
		...e,
		transport: n.transport,
		config: Vg(e.config, n),
		stages: t.stages,
		structures: t.structures,
		turn: {
			stages: e.stages,
			structures: e.structures
		},
		assembly: r
	};
}
var ux = (e, t, n) => t.index === 0 && n.transport === e.transport;
function dx(e, t, n) {
	if (!t.length) return {
		messages: [],
		tools: []
	};
	let { preset: r } = e, i = e.turn?.stages ?? e.stages;
	switch (e.transport) {
		case "prefill":
		case "plaintext": {
			let n = qp(t, {
				prefixes: jv(e),
				format: e.transport === "prefill" ? "prefix" : r.plaintextFormat,
				contentMarker: r.contentMarker,
				stages: i
			});
			return e.transport === "prefill" ? {
				messages: [],
				prefill: n,
				tools: []
			} : {
				messages: [vv({
					role: "assistant",
					content: n
				})],
				tools: []
			};
		}
		case "structured": return {
			messages: [vv({
				role: "assistant",
				content: JSON.stringify(Jp(t, kv(e)))
			})],
			tools: []
		};
		case "tool-single":
		case "tool-multi": {
			let a = kl(r.tools, e.workflow, i, e.turn?.structures ?? e.structures, Ov(e), {
				stages: t.map((e) => e.stage),
				structures: t.flatMap((e) => e.structures.map((e) => e.decl))
			}), o = Yp(t, a), s = kv(e), c = e.transport === "tool-multi" ? s.stageTools()[0]?.function.name ?? "" : r.tools.submit.name, l = n === "gemini" || n === "openai" && e.config.connection.openAiSignatures, u = o[0]?.name ?? "", d = [];
			return o.forEach((t, n) => {
				let i = `call_ap_phase_${t.stage.id}`;
				d.push(vv({
					role: "assistant",
					content: "",
					tool_calls: [{
						id: i,
						type: "function",
						function: {
							name: t.name,
							arguments: JSON.stringify(t.arguments)
						},
						...l ? { signature: mv } : {}
					}]
				}));
				let a = o[n + 1]?.name ?? c;
				d.push({
					role: "tool",
					tool_call_id: i,
					content: Mv(e, r.tools.results.next, {
						next: a,
						first: u
					})
				});
			}), {
				messages: d,
				tools: a.stageTools()
			};
		}
	}
}
function fx(t, n, r, i) {
	let a = (n) => {
		let r = e().substituteParams(n);
		return t.fillInput ? t.fillInput(r) : r;
	}, o = t.rerender(t.assembly), s = t.transport === "prefill" && o.historyAt >= 0, c = s ? Fy(t, o.messages, o.historyAt) : o.messages, l = dx(t, r, i);
	if (s && l.prefill) {
		let e = c[c.length - 1], t = typeof e.content == "string" ? e.content : "";
		c = [...c.slice(0, -1), {
			...e,
			content: t ? `${t}\n\n${l.prefill}` : l.prefill
		}];
	} else l.prefill && (c = [...c, vv({
		role: "assistant",
		content: l.prefill
	})]);
	c = [...c, ...l.messages];
	let u = ky(t, t.assembly, n.stages, a);
	return {
		messages: Ay(c, u, s),
		tools: l.tools
	};
}
//#endregion
//#region src/core/encoder.ts
function px(e, t) {
	let n = t ? g({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? b(n) : v(n);
}
var mx = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function hx(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, mx({
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
			})), a = () => n === null ? "" : (n = null, mx({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + mx({
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
				text: (e) => e ? o("text") + mx({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + mx({
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
					for (let i of e) t++, r = !0, n += mx({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + mx({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + mx({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => mx({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + mx({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + mx({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? mx({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? mx({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? mx({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: _x(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => mx({ error: { message: e } }),
			end: (e) => e ? mx({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? mx({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => mx({
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
			error: (e) => mx({ error: { message: e } }),
			end: (e) => mx({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? mx({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? mx({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? mx({ choices: [{
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
					...gx(e)
				}
			}] }) : "",
			error: (e) => mx({ error: { message: e } }),
			end: (e) => (e ? mx({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + mx("[DONE]")
		};
	}
}
function gx(e) {
	let t = e.filter((e) => e.signature).map((e, t) => ({
		type: "reasoning.encrypted",
		data: e.signature,
		id: e.id,
		format: "google-gemini-v1",
		index: t
	}));
	return t.length ? { reasoning_details: t } : {};
}
function _x(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function vx(e, t) {
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
				...gx(t.toolCalls)
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
			input: _x(e.arguments)
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
					args: _x(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function yx(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function bx(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function xx(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Sx = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = bx(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = xx(t);
			if (r) {
				let t = this.open.has(e) ? Cx(this.value, n) : void 0;
				wx(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Cx(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function wx(e, t, n) {
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
var Tx = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Ex(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Tx(t) ? t : void 0;
}
function Dx(e, t) {
	if (!Tx(t)) return Tx(e) ? e : void 0;
	if (!Tx(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Tx(r) && Tx(n[e]) ? Dx(n[e], r) : r);
	return n;
}
function Ox(e, t) {
	if (!Tx(t)) return Tx(e) ? e : void 0;
	if (!Tx(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Tx(r) && Tx(t) ? n[e] = Ox(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var kx = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Ax(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var jx = class {
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
				let i = Mx(n);
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
				args: new Sx()
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
			let i = typeof e.signature == "string" && e.signature ? e.signature : Mx(e);
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
function Mx(e) {
	let t = e?.extra_content?.google?.thought_signature ?? e?.function?.extra_content?.google?.thought_signature;
	return typeof t == "string" && t ? t : void 0;
}
function Nx(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function Px(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* Fx(e, t) {
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
async function* Ix(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Ax(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new kx(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new jx();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Ax(t);
		if (n) throw new kx(n);
		i.text = Nx(t), i.reasoning = Px(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Ex(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of Fx(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Ax(e);
		if (r) throw new kx(r);
		i.text += _(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Ex(e);
		c && (i.usage = Dx(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var Lx = /* @__PURE__ */ _n({ current: null });
function Rx(e, t) {
	return Lx.current = {
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
	}, Lx.current;
}
function zx(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
function Bx(t, n) {
	t.mesId = n, t.swipeId = e().chat[n]?.swipe_id ?? 0;
}
function Vx(t, n = e().chat[t]) {
	let r = Lx.current;
	return !r || r.mesId !== t || r.swipeId !== null && (n?.swipe_id ?? 0) !== r.swipeId ? null : r;
}
//#endregion
//#region src/core/orchestrator.ts
function Hx(e) {
	let t = e.structures.find((e) => e.kind === "speech");
	if (t) return e.speechCleaner ??= my(e.preset).cleaner ?? null, {
		tag: t.tag,
		...e.speechCleaner ? { cleaner: e.speechCleaner } : {}
	};
}
var Ux = "/api/backends/chat-completions/generate", Wx = { pending: null }, Gx = (e) => e?.name === "AbortError";
async function Kx(e, t) {
	let n = e.phases?.length ? e.phases : [{
		index: 0,
		actor: "",
		stages: e.stages,
		structures: e.structures
	}], r = [], i = [];
	for (let a of n) {
		let n = a.actor ? zg(e.preset, e.config, a.actor, r) : Bg(e.config, r), o;
		try {
			o = await Yg(t, n.target);
		} catch (e) {
			if (e instanceof Hg) return e.message;
			throw e;
		}
		let s = Xg(n, o);
		if (s) return s;
		i.push({
			phase: a,
			binding: n,
			base: o
		});
	}
	for (let t of new Set(r)) e.warnings.push(t);
	return i;
}
async function qx(e, t, n) {
	let r = px(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = await Kx(e, t);
	if (typeof a == "string") return w("error", a, "Advanced Preset"), yx(a, 400);
	let o = e.origin === "task" ? Dv(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = Rx(e, i);
	if (!i) {
		let t;
		try {
			t = await Xx(e, a, s, c, n ?? void 0, () => void 0);
		} catch (e) {
			return Yx(c, e);
		}
		if (n?.aborted) throw Wx.pending?.ctx === e && (Wx.pending = null), n.reason;
		return new Response(JSON.stringify(vx(r, t)), { headers: { "Content-Type": "application/json" } });
	}
	let l = hx(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let t = await Xx(e, a, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			t.content.startsWith(m) && await p(l.text(t.content.slice(m.length))), t.reasoning && !(r === "claude" && t.toolCalls?.length) && await p(l.reasoning(t.reasoning)), t.toolCalls?.length && await p(l.toolCalls(t.toolCalls)), await p(l.end(t.usage));
		} catch (e) {
			Gx(e) || (await p(l.error(Jx(e))), Yx(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var Jx = (e) => e instanceof Error ? e.message : String(e);
function Yx(e, t) {
	return e.status = Gx(t) ? "aborted" : "error", e.error = Jx(t), t instanceof kx ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : yx(Jx(t));
}
async function Xx(t, n, r, i, a, o) {
	let s = n.length > 1, c = bl(t.stages), l = c >= 0 ? t.stages[c].id : null, u = t.stages.some((e) => e.kind === "patch"), d = t.origin === "story" && !r.schema && !u && l !== null, f = t.structures.some((e) => e.kind === "annotations"), p = Hx(t), m = f ? (e) => mc(e, { final: !1 }).text : (e) => e, h = p ? (e) => Vc(m(e), {
		...p,
		final: !1
	}).text : m, _ = Date.now(), v = "", y, b = 0, x = 0, S = !1, C, ee, te = [], ne = [], E = [], re, ie = (e, n, r) => s ? Vp(t.stages, [...te, {
		stages: n,
		turn: e
	}], r) : e;
	for (let { phase: c, binding: u, base: f } of n) {
		let p = lx(t, c, u), m = px(String(f.chat_completion_source ?? ""), f), _ = f.messages ?? [], ae;
		if (!ux(t, c, p)) {
			let e = fx(p, c, Hp(n.slice(0, c.index).map((e) => e.phase), Vp(t.stages, te, !0), kv(p).layout), m);
			_ = e.messages, e.tools.length && (ae = e.tools);
		}
		let oe = cx({
			ctx: p,
			base: f,
			messages: _,
			caller: r,
			family: m,
			...ae ? { extraTools: ae } : {}
		});
		re = oe;
		let se = p.transport === "tool-multi" ? Math.max(1, p.config.connection.maxSteps) : 1, ce = b;
		for (let n = 0; n < se; n++) {
			i.step = x;
			let r = oe.body(n), s = k_({
				genId: t.id,
				step: x++,
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
				let n = await T(Ux, {
					method: "POST",
					headers: e().getRequestHeaders(),
					body: JSON.stringify(r),
					signal: a
				}), f = 0;
				for await (let e of Ix(n, g(r), !!r.stream, a)) {
					u = e;
					let t = Date.now();
					if (t - f < 50) continue;
					f = t;
					let n = ie(oe.progress(e, !1), c.stages, !1);
					if (zx(i, n, v + e.reasoning), d && l) {
						let e = n.stages[l]?.text ?? "";
						e && o(h(e.slice(0, e.length - ic(e))).trimEnd());
					}
				}
				c.index === 0 && Gv(t), s.response = u.text || JSON.stringify(u.toolCalls), s.durationMs = Date.now() - s.at, s.usage = u.usage;
			} catch (e) {
				if (s.error = Jx(e), Gx(e) || a?.aborted) {
					c.index === 0 && (u.text || u.reasoning || u.toolCalls.length) && Gv(t), y = Ox(y, u.usage), S = !0, ee = ie(oe.progress(u, !1), c.stages, !1);
					break;
				}
				if (!u.text && !u.toolCalls.length && Sv(e) && xv(p, m)) {
					t.signatureFallback = p.signatureFallback = !0, t.warnings.push("thought signature rejected: retried without the built-in signature"), w("warning", K("error.signatureFallback"), K("app.name")), n--;
					continue;
				}
				throw e;
			}
			v += u.reasoning, y = Ox(y, u.usage), oe.progress(u, !0);
			let f = oe.complete(u, n);
			if (f.callerToolCalls) {
				C = f.callerToolCalls.map((e) => ({
					id: e.id || `call_${n}`,
					name: e.name,
					arguments: e.arguments || "{}",
					signature: e.signature
				}));
				break;
			}
			if (f.done) break;
		}
		if (ne.push(oe.rawText()), s && E.push({
			index: c.index,
			actor: c.actor,
			binding: u.id,
			transport: p.transport,
			stages: c.stages.map((e) => e.id),
			requests: b - ce
		}), S || (te.push({
			stages: c.stages,
			turn: oe.result()
		}), C)) break;
	}
	let ae = ee ?? (s ? Vp(t.stages, te, !0) : te[0]?.turn ?? re.result());
	if (S) for (let e of Object.values(ae.stages)) e.status === "streaming" && (e.status = "interrupted");
	zx(i, ae, v);
	let oe = Zx(t, ae, s ? ne.filter((e) => e.trim()).join("\n\n") : ne[0] ?? "", re?.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - _,
		interrupted: S,
		...s ? { phases: E } : {}
	});
	return oe.toolCalls = C, oe.usage = y, C && (oe.content = ""), i.status = S ? "aborted" : "done", oe;
}
function Zx(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Gl(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = ac(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = mc(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = mc(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v, y, b = Hx(t);
	if (b) {
		if (u) {
			let e = Kc(u, g, b);
			l.push(...e.warnings), u = e.text, v = e.spans, g = e.anchors;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Kc(d, _?.draft, b);
			d = e.text, f = u, y = {
				draft: e.spans,
				patched: v ?? []
			}, _ &&= {
				draft: e.anchors ?? [],
				patched: g ?? []
			};
		}
	}
	let x = (e) => Object.values(s.structures).find((t) => t.kind === e), S = x("reply"), C = S ? n.structures[S.id] : void 0, ee = x("impersonate"), w = x("recap"), T = x("memory"), te = t.meta.mixed ? "meta-mixed" : "story", ne = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? ne = i === void 0 ? u || ac(r).trim() : JSON.stringify(i) : u || (te = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", ne = C ? sl(C) : "", !ne && ee && typeof n.structures[ee.id] == "string" && (ne = "…"), !ne && w && n.structures[w.id] && (ne = "…"))), !ne && !o.interrupted) throw Error(K("error.emptyTurn"));
	let E = [], re = [], ie = t.interceptorRan && t.stType !== "quiet";
	if (ie && T && Array.isArray(n.structures[T.id])) {
		let e = mh(n.structures[T.id]);
		E.push(...e.events), re = e.global;
	}
	if (ie && w && typeof n.structures[w.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		E.push({
			type: "recap.set",
			text: n.structures[w.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let ae = t.stages.map((e) => {
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
	}), oe = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: te,
		stages: ae,
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
		events: E,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs,
			...o.phases ? { phases: o.phases } : {}
		}
	}, se = {
		content: ne,
		reasoning: a,
		sidecar: oe,
		...re.length ? { global: re } : {}
	};
	return ie ? Wx.pending = {
		ctx: t,
		outcome: se,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: oe
	}), Lx.current?.genId === t.id && (Lx.current.structures = n.structures), se;
}
//#endregion
//#region src/app/updater.ts
var Qx = "advancedPreset.reloadedFor";
async function $x() {
	try {
		let e = await T(`${h()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function eS(e) {
	sessionStorage.setItem(Qx, e), w("info", K("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function tS() {
	let e = await $x();
	e && e !== "d7bfae0311cadfdc" && sessionStorage.getItem(Qx) !== e && eS(e);
}
async function nS() {
	await tS();
}
var rS = "/api/extensions/switch", iS = (e) => e.replace(/^third-party/, "").replace(/^\/+|\/+$/g, "");
function aS(e, t, n) {
	if (!n.ok || typeof t.body != "string") return;
	let r;
	try {
		if (new URL(e, location.href).pathname !== rS) return;
		r = JSON.parse(t.body).extensionName;
	} catch {
		return;
	}
	typeof r == "string" && iS(r) === iS(m()) && tS();
}
async function oS() {
	let e = m().replace(/^third-party\//, ""), t = await uS(e, !1);
	if (t.status === 404 && (t = await uS(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await $x();
	return r && r !== "d7bfae0311cadfdc" ? (eS(r), {
		upToDate: !1,
		reloading: !0
	}) : {
		upToDate: !!n.isUpToDate,
		reloading: !1
	};
}
async function sS() {
	let e = await oS();
	return e.reloading || !e.upToDate ? "updated" : "current";
}
var cS = "advancedPreset.selfUpdateFor";
async function lS(e, t) {
	let n = `1.13.0>${e}`;
	if (sessionStorage.getItem(cS) === n) return !1;
	sessionStorage.setItem(cS, n), w("info", K("update.forPreset", {
		name: t,
		version: e
	}));
	try {
		return (await oS()).reloading;
	} catch (e) {
		return console.warn("[AP] self-update failed", e), !1;
	}
}
var uS = (t, n) => T("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), dS = "__ap_gen_id";
function fS(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function pS() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	te(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(fS(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[dS], r = typeof t == "string" ? dg.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[dS], r.claimed = !0;
				try {
					return n.signal?.throwIfAborted(), await qx(r, e, n.signal);
				} finally {
					dg.release(t);
				}
			}
			e && (delete e[dS], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		let r = await e.call(globalThis, t, n);
		return n?.method === "POST" && aS(fS(t), n, r), r;
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function mS(e) {
	let t = dg.takeArmed();
	t && (e[dS] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function hS(e) {
	let t = await sy(e);
	if (t === "invalid") return w("warning", K("storylines.invalidName"), K("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && w("warning", K("storylines.nameTaken", { name: n }), K("app.name")), t === "invalid" && w("warning", K("storylines.invalidName"), K("app.name"));
		let r = await ee(`<h3>${S(K("storylines.switchTitle", { name: e }))}</h3><p>${S(K("storylines.askOldMain"))}</p>`, n, K("storylines.switch"), K("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = fd(n) ? await sy(e, n) : "invalid";
	}
	return t === "switched" && w("success", K("storylines.switched", { name: e }), K("app.name")), !0;
}
async function gS(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) {
		ey(t, n.current), i.hide && (ay(n.current, { hide: !0 }), await e().saveMetadata());
		return;
	}
	let a = r && typeof r == "object" ? r : {}, o = Zv(), s = (e, t) => {
		let n = vd(_d(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(Jv().main ?? "");
		let e = s(a.name, K("storylines.fallback.side"));
		return e !== Jv().main && !await ny(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), ey(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, K(i.ifLine ? "storylines.fallback.if" : "storylines.fallback.side"));
		ay(n, {
			ifLine: !!i.ifLine,
			hide: i.hide
		}), ey(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, K("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, K("storylines.fallback.main")) : void 0), u = await sy(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), w("warning", K("storylines.switchFailed", { name: c }), K("app.name")), ey(t, c);
	i.naming && n.input >= 0 && oy(n.input), ey(t, ""), u === "switched" && w("success", K("storylines.switched", { name: c }), K("app.name"));
}
function _S(e, t) {
	if (!q().enabled) return e;
	let n = Vh(), r = n ? gm(n) : void 0;
	if (!r || !qv(r, bh(r)) || pd(e)) return e;
	let i = Xv(), a = i[t ?? i.length - 1];
	return !a || Tm(a) ? e : hd(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var vS = "\0";
function yS(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = $m(e);
		r && t.add(`${n.presetId}${vS}${r}`);
	}
}
function bS(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && yS(r.extra?.[Gm], t), r.swipe_info?.forEach((e, t) => {
			t !== i && yS(e?.extra?.[Gm], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var xS = null;
function SS(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = bS(n.chat ?? []), o = new Set(a);
	if (xS && !t.reload && xS.chatId === r) for (let e of xS.active) i.has(e) || o.add(e);
	xS = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(vS), i = s.get(n);
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
		n?.globalMemory && (Qm(n.globalMemory.log) && (l = !0), gh(n, t.off, !1) && (l = !0), gh(n, t.on, !0) && (l = !0));
	}
	return l && J(), l;
}
function CS(e) {
	Ym(e), SS();
}
function wS() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => CS(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => SS());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => SS({ reload: !0 }));
}
//#endregion
//#region src/store/media.ts
var TS = {
	openai: {
		baseUrl: "https://api.openai.com/v1",
		model: "gpt-image-2.6-flare",
		nsfwBlock: !0,
		promptType: Sc("openai")
	},
	gemini: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-nano-banana-2.1",
		nsfwBlock: !0,
		promptType: Sc("gemini")
	},
	novelai: {
		baseUrl: "https://image.novelai.net",
		model: "nai-diffusion-4-5-full",
		nsfwBlock: !1,
		promptType: Sc("novelai")
	},
	openrouter: {
		baseUrl: "https://openrouter.ai/api/v1",
		model: "google/gemini-nano-banana-2.1",
		nsfwBlock: !0,
		promptType: Sc("openrouter")
	}
}, ES = (e) => e !== "novelai", DS = () => ({
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
function OS() {
	let e = q(), t = DS();
	(!e.media || typeof e.media != "object") && (e.media = t);
	let n = e.media;
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		if (!t || typeof t != "object" || Array.isArray(t)) n[e] = r;
		else for (let [e, n] of Object.entries(r)) e in t || (t[e] = n);
	}
	for (let t of e.media.image.connections) t.promptType ||= Sc(t.api);
	return e.media;
}
var kS = J, AS = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
function jS(e, t) {
	let n = TS[e];
	return {
		id: AS(),
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
function MS(e, t) {
	if (e.api === t) return;
	let n = TS[e.api], r = TS[t];
	(!e.baseUrl || e.baseUrl === n.baseUrl) && (e.baseUrl = r.baseUrl), (!e.model || e.model === n.model) && (e.model = r.model), e.nsfwBlock === n.nsfwBlock && (e.nsfwBlock = r.nsfwBlock), e.promptType === n.promptType && (e.promptType = r.promptType), e.api = t;
}
function NS(e) {
	return e.connections.find((t) => t.id === e.active) ?? e.connections[0];
}
function PS(e, t) {
	return {
		...JSON.parse(JSON.stringify(e)),
		id: AS(),
		name: t
	};
}
//#endregion
//#region src/store/media-db.ts
var FS = "advanced-preset-media", IS = "blobs", LS = null;
function RS() {
	return LS || (LS = new Promise((e, t) => {
		let n = indexedDB.open(FS, 1);
		n.onupgradeneeded = () => {
			n.result.objectStoreNames.contains(IS) || n.result.createObjectStore(IS);
		}, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
	}), LS.catch(() => {
		LS = null;
	}), LS);
}
function zS(e, t) {
	return RS().then((n) => new Promise((r, i) => {
		let a = n.transaction(IS, e), o = t(a.objectStore(IS));
		a.oncomplete = () => r(o ? o.result : void 0), a.onerror = () => i(a.error), a.onabort = () => i(a.error);
	}));
}
async function BS(e, t = {}) {
	let n = t.key ?? `${t.prefix ?? ""}${AS()}`;
	return await zS("readwrite", (t) => t.put({
		blob: e,
		at: Date.now()
	}, n)), n;
}
async function VS(e) {
	return (await zS("readonly", (t) => t.get(e)))?.blob;
}
async function HS(e) {
	return !!await zS("readonly", (t) => t.count(e));
}
async function US(e) {
	JS(e), await zS("readwrite", (t) => t.delete(e));
}
async function WS(e = "") {
	let t = e ? IDBKeyRange.bound(e, `${e}\uffff`) : void 0;
	return (await zS("readonly", (e) => e.getAllKeys(t)) ?? []).map(String);
}
async function GS(e, t, n = 0) {
	let r = Date.now() - n, i = 0;
	for (let a of await WS(e)) if (!t.has(a)) {
		if (n) {
			let e = await zS("readonly", (e) => e.get(a));
			if (e && e.at > r) continue;
		}
		await US(a), i++;
	}
	return i;
}
var KS = /* @__PURE__ */ new Map();
async function qS(e) {
	let t = KS.get(e);
	if (t) return t;
	let n = await VS(e);
	if (!n) return;
	let r = URL.createObjectURL(n);
	return KS.set(e, r), r;
}
function JS(e) {
	let t = KS.get(e);
	t && (URL.revokeObjectURL(t), KS.delete(e));
}
async function YS(e) {
	let t = new Uint8Array(await e.arrayBuffer()), n = "";
	for (let e = 0; e < t.length; e += 32768) n += String.fromCharCode(...t.subarray(e, e + 32768));
	return btoa(n);
}
function XS(e, t) {
	let n = atob(e), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return new Blob([r], { type: t });
}
//#endregion
//#region src/media/net.ts
var ZS = class extends Error {
	issue;
	constructor(e, t = `CORS proxy: ${e}`) {
		super(t), this.issue = e, this.name = "ProxyError";
	}
}, QS = class extends Error {
	status;
	body;
	constructor(e, t, n = "") {
		super(t), this.status = e, this.body = n, this.name = "MediaHttpError";
	}
}, $S = /* @__PURE__ */ new Set(), eC = (e) => {
	try {
		return new URL(e).origin;
	} catch {
		return e;
	}
};
function tC(e, t) {
	if (t.proxy === "custom") {
		let n = t.customUrl.trim();
		if (!n) throw new ZS("noCustomUrl");
		return n.includes("{url}") ? n.replace("{url}", encodeURIComponent(e)) : n + e;
	}
	return `/proxy/${encodeURIComponent(e)}`;
}
function nC(e = OS().cors) {
	return { multipart: e.proxy === "custom" || t() };
}
var rC = (e) => e == null || typeof e == "string";
async function iC(n, r, i) {
	let a = tC(n, i);
	if (i.proxy === "custom") return T(a, r);
	let o = t();
	if (!nC(i).multipart && !rC(r.body)) throw new ZS("body");
	let s = new Headers(r.headers), c = e().getRequestHeaders?.()["X-CSRF-Token"];
	c && !s.has("X-CSRF-Token") && s.set("X-CSRF-Token", c);
	let l = await T(a, {
		...r,
		headers: s
	});
	if (l.status === 404) {
		let e = l.headers.get("content-type") ?? "", t = e.includes("json") ? "" : await l.clone().text().catch(() => "");
		if (/CORS proxy is disabled/i.test(t)) throw new ZS("disabled");
		if (o && (e.includes("html") || !t)) throw new ZS("unsupported");
	}
	return l;
}
var aC = (e) => e instanceof DOMException && e.name === "AbortError";
async function oC(e, t = {}, n = OS().cors) {
	if (n.mode === "on") return iC(e, t, n);
	if (n.mode === "off") return T(e, t);
	let r = eC(e);
	if ($S.has(r)) return iC(e, t, n);
	try {
		return await T(e, t);
	} catch (i) {
		if (aC(i) || !(i instanceof TypeError)) throw i;
		$S.add(r);
		try {
			return await iC(e, t, n);
		} catch (e) {
			throw e instanceof ZS && $S.delete(r), e;
		}
	}
}
function sC(e, t) {
	let n = "";
	try {
		let e = JSON.parse(t), r = e?.error ?? e;
		n = typeof r == "string" ? r : String(r?.message ?? e?.message ?? e?.detail?.message ?? e?.detail ?? "");
	} catch {
		n = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
	}
	return n ? `HTTP ${e}: ${n}` : `HTTP ${e}`;
}
async function cC(e) {
	if (e.ok) return e;
	let t = await e.text().catch(() => "");
	throw new QS(e.status, sC(e.status, t), t);
}
//#endregion
//#region src/media/request.ts
var lC = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function uC(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r === null ? delete n[e] : n[e] = lC(r) && lC(n[e]) ? uC(n[e], r) : r;
	return n;
}
var dC = class extends Error {
	constructor(e) {
		super(e), this.name = "BodyOverrideError";
	}
};
function fC(e) {
	let t = e.body.trim();
	if (!t) return {};
	let n;
	try {
		n = JSON.parse(t);
	} catch (e) {
		throw new dC(e instanceof Error ? e.message : String(e));
	}
	if (!lC(n)) throw new dC("Not a JSON object");
	return n;
}
function pC(e) {
	try {
		return fC({ body: e }), "";
	} catch (e) {
		return e instanceof Error ? e.message : String(e);
	}
}
function mC(e, t) {
	let n = new Headers(e);
	for (let [e, r] of Object.entries(t.headers ?? {})) e.trim() && (r === "" ? n.delete(e) : n.set(e, r));
	return n;
}
var hC = (e, t) => `${e.replace(/\/+$/, "")}/${t.replace(/^\/+/, "")}`, gC = (e, t) => e.getUint16(t, !0), _C = (e, t) => e.getUint32(t, !0);
async function vC(e) {
	let t = new Blob([e]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
async function yC(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = -1;
	for (let r = e.length - 22; r >= Math.max(0, e.length - 22 - 65535); r--) if (_C(t, r) === 101010256) {
		n = r;
		break;
	}
	if (n < 0) throw Error("Not a ZIP archive");
	let r = gC(t, n + 10), i = _C(t, n + 16), a = [], o = new TextDecoder();
	for (let n = 0; n < r; n++) {
		if (_C(t, i) !== 33639248) throw Error("Broken ZIP directory");
		let n = gC(t, i + 10), r = _C(t, i + 20), s = gC(t, i + 28), c = gC(t, i + 30), l = gC(t, i + 32), u = _C(t, i + 42), d = o.decode(e.subarray(i + 46, i + 46 + s));
		if (i += 46 + s + c + l, d.endsWith("/")) continue;
		let f = u + 30 + gC(t, u + 26) + gC(t, u + 28), p = e.subarray(f, f + r);
		if (n === 0) a.push({
			name: d,
			data: p
		});
		else if (n === 8) a.push({
			name: d,
			data: await vC(p)
		});
		else throw Error(`Unsupported ZIP compression ${n}`);
	}
	return a;
}
function bC(e) {
	if (e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71) return "image/png";
	if (e[0] === 255 && e[1] === 216 && e[2] === 255) return "image/jpeg";
	if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 87 && e[9] === 69 && e[10] === 66 && e[11] === 80) return "image/webp";
	if (e[0] === 71 && e[1] === 73 && e[2] === 70) return "image/gif";
	let t = new TextDecoder().decode(e.subarray(0, 256)).trimStart();
	if (t.startsWith("<svg") || t.startsWith("<?xml") && t.includes("<svg")) return "image/svg+xml";
}
//#endregion
//#region src/media/image/providers.ts
function xC(e, t) {
	let n = t.trim(), r = e.style.trim();
	return r ? e.promptType === "tags" ? `${n.replace(/[,\s]+$/, "")}, ${r.replace(/^[,\s]+/, "")}` : `${n}\n\n${r}` : n;
}
var SC = {
	"1:1": "1024x1024",
	"3:4": "1024x1536",
	"9:16": "1024x1536",
	"4:3": "1536x1024",
	"16:9": "1536x1024"
}, CC = {
	"1:1": [1024, 1024],
	"3:4": [832, 1216],
	"9:16": [832, 1216],
	"4:3": [1216, 832],
	"16:9": [1216, 832]
}, wC = async (e) => `data:${e.type || "image/png"};base64,${await YS(e)}`, TC = (e) => e.baseUrl.trim() || TS[e.api].baseUrl, EC = (e) => e.model.trim() || TS[e.api].model, DC = (e, t) => ({
	method: "POST",
	headers: e,
	body: JSON.stringify(t)
});
async function OC(e, t) {
	let n = xC(e, t.prompt), r = {
		model: EC(e),
		prompt: n,
		n: 1,
		size: t.ratio ? SC[t.ratio] : "auto"
	};
	t.refs.length && (r.images = await Promise.all(t.refs.map(async (e) => ({ image_url: await wC(e.blob) }))));
	let i = mC({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e);
	return {
		url: hC(TC(e), t.refs.length ? "images/edits" : "images/generations"),
		init: DC(i, uC(r, fC(e)))
	};
}
var kC = (e) => e.description ? `Reference image ${e.id}: ${e.description}` : `Reference image ${e.id}`;
async function AC(e, t) {
	let n = xC(e, t.prompt), r = await Promise.all(t.refs.map(async (e) => ({
		ref: e,
		mime: e.blob.type || "image/png",
		data: await YS(e.blob)
	}))), i = e.apiKey ? { "x-goog-api-key": e.apiKey } : {};
	if (e.endpoint === "generateContent") {
		let a = [];
		for (let e of r) a.push({ text: kC(e.ref) }, { inline_data: {
			mime_type: e.mime,
			data: e.data
		} });
		a.push({ text: n });
		let o = { responseModalities: ["IMAGE"] };
		t.ratio && (o.imageConfig = { aspectRatio: t.ratio });
		let s = mC({
			"Content-Type": "application/json",
			...i
		}, e), c = uC({
			contents: [{
				role: "user",
				parts: a
			}],
			generationConfig: o
		}, fC(e));
		return {
			url: hC(TC(e), `models/${encodeURIComponent(EC(e))}:generateContent`),
			init: DC(s, c)
		};
	}
	let a = [];
	for (let e of r) a.push({
		type: "text",
		text: kC(e.ref)
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
	let s = mC({
		"Content-Type": "application/json",
		"Api-Revision": "2026-05-20",
		...i
	}, e), c = uC({
		model: EC(e),
		input: a,
		response_format: o
	}, fC(e));
	return {
		url: hC(TC(e), "interactions"),
		init: DC(s, c)
	};
}
async function jC(e, t) {
	let n = xC(e, t.prompt), r = t.refs.length ? `${t.refs.map((e, t) => `Reference image ${t + 1} (${e.id})${e.description ? `: ${e.description}` : ""}`).join("\n")}\n\n${n}` : n, i = {
		model: EC(e),
		prompt: r,
		n: 1,
		aspect_ratio: t.ratio ?? "auto"
	};
	t.refs.length && (i.input_references = await Promise.all(t.refs.map(async (e) => ({
		type: "image_url",
		image_url: { url: await wC(e.blob) }
	}))));
	let a = mC({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e);
	return {
		url: hC(TC(e), "images"),
		init: DC(a, uC(i, fC(e)))
	};
}
function MC(e, t) {
	let n = xC(e, t.prompt), r = (e.negative ?? "").trim(), [i, a] = CC[t.ratio ?? "3:4"], o = {
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
	}, s = mC({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e), c = uC({
		input: n,
		model: EC(e),
		action: "generate",
		parameters: o
	}, fC(e));
	return {
		url: hC(TC(e), "ai/generate-image"),
		init: DC(s, c)
	};
}
async function NC(e, t) {
	switch (e.api) {
		case "openai": return OC(e, t);
		case "gemini": return AC(e, t);
		case "novelai": return MC(e, {
			...t,
			refs: []
		});
		case "openrouter": return jC(e, t);
	}
}
function PC(e) {
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
function FC(e) {
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
var IC = (e, t = "image/png") => new Blob([e], { type: bC(e) ?? t });
async function LC(e, t, n) {
	if (e.api === "novelai") {
		let e = new Uint8Array(await t.arrayBuffer());
		return bC(e) ? [IC(e)] : (await yC(e)).filter((e) => bC(e.data)).map((e) => IC(e.data));
	}
	let r = await t.json();
	if (e.api === "gemini") {
		let e = PC(r).map((e) => XS(e.data, e.mime));
		if (!e.length) throw Error(FC(r) || "No image in the response");
		return e;
	}
	let i = r?.data ?? [], a = [];
	for (let e of i) {
		let t = e.media_type || "image/png";
		if (e.b64_json) {
			let n = XS(e.b64_json, t);
			a.push(IC(new Uint8Array(await n.arrayBuffer()), t));
		} else e.url && a.push(await (await cC(await oC(e.url, { signal: n }))).blob());
	}
	if (!a.length) throw Error("No image in the response");
	return a;
}
async function RC(e, t, n) {
	let { url: r, init: i } = await NC(e, t);
	return LC(e, await cC(await oC(r, {
		...i,
		signal: n
	})), n);
}
//#endregion
//#region src/st/cards.ts
function zC() {
	let t = e(), n = t.characters ?? [], r = (e) => e ? {
		key: e,
		name: n.find((t) => t.avatar === e)?.name || e.replace(/\.[^.]+$/, "")
	} : null, i = [];
	return t.groupId ? i = (t.groups?.find((e) => e.id === t.groupId)?.members ?? []).map(r) : t.characterId !== void 0 && t.characterId !== null && t.characterId !== "" && (i = [r(n[Number(t.characterId)]?.avatar)]), i.filter((e) => !!e);
}
function BC(e, t = zC()) {
	return !e || t.some((t) => t.key === e);
}
//#endregion
//#region src/media/image/refs.ts
function VC(e) {
	let t = new Set(e.map((e) => e.id)), n = 1;
	for (; t.has(`ref${n}`);) n++;
	return `ref${n}`;
}
async function HC() {
	await GS("ref:", new Set(OS().image.connections.flatMap((e) => e.refs.map((e) => e.blob)))).catch((e) => console.warn("[AP] media gc failed", e));
}
function UC(e, t = zC()) {
	return e.refs.filter((e) => BC(e.card, t));
}
//#endregion
//#region src/ui/state.ts
var Y = /* @__PURE__ */ _n({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), WC = () => {
	Y.chatRev++;
}, GC = () => {
	Y.presetId = Vh();
}, KC = W(() => Y.presetId ? gm(Y.presetId) : void 0), qC = W(() => {
	let e = KC.value;
	if (!e) return { config: "" };
	let t = _h(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : nm(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function JC(t) {
	return Y.chatRev, e().chat[t];
}
function YC(e) {
	return Km(JC(e));
}
function XC(e) {
	Y.storylineFocus = e, ZC("storylines");
}
function ZC(e) {
	e && (Y.tab = e), Y.panelOpen = !0;
}
//#endregion
//#region src/app/images.ts
var QC = /* @__PURE__ */ _n(/* @__PURE__ */ new Map()), $C = (e, t, n) => `${e}:${t}:${n}`;
function ew() {
	let e = OS().image;
	return e.enabled ? NS(e) : void 0;
}
function tw() {
	let e = OS().image, t = ew();
	if (!t) return {
		vars: { ...wc },
		refs: []
	};
	let n = ES(t.api) ? UC(t).map((e) => ({
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
var nw = (e) => e?.image ? Object.values(e.structures).filter((e) => e.kind === "image") : [], rw = (e, t) => Nc(e?.structures?.[t])?.images ?? [], iw = [
	"prompt",
	"refs",
	"ratio",
	"caption"
];
function aw(e, t, n) {
	let r = rw(e, t)[n];
	if (!r) return;
	let i = e?.images?.[t]?.[n], a = {
		prompt: i?.prompt ?? r.prompt,
		refs: i?.refs ?? r.refs,
		ratio: i?.ratio ?? r.ratio,
		caption: i?.caption ?? r.caption
	};
	return a.refs?.length || delete a.refs, a.ratio || delete a.ratio, a.caption || delete a.caption, a;
}
var ow = (e, t, n) => iw.some((r) => e?.images?.[t]?.[n]?.[r] !== void 0);
function sw(t, n) {
	let r = e().chat, i = (e) => {
		let n = r[e];
		if (!n || n.is_user) return null;
		if (Km(n)?.genId === t) return {
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
async function cw(t, n, r) {
	let i = sw(t, n);
	if (!i) return !1;
	let a = e().chat[i.mesId];
	if (i.swipe === null) {
		let e = Km(a), t = structuredClone(e.images ?? {});
		r(t), Jm(i.mesId, {
			...e,
			images: t
		});
	} else {
		let e = a.swipe_info[i.swipe].extra[Gm], t = structuredClone(e.images ?? {});
		r(t), e.images = t;
	}
	return WC(), await e().saveChat(), !0;
}
var lw = (e, t, n) => {
	let r = e[t] ??= [];
	for (let e = r.length; e <= n; e++) r[e] = { keys: [] };
	return r[n];
};
async function uw(e, t) {
	if (!ES(e.api) || !t?.length) return [];
	let n = UC(e), r = [];
	for (let e of t) {
		let t = n.find((t) => t.id === e), i = t && await VS(t.blob);
		t && i && r.push({
			id: t.id,
			description: t.description,
			blob: i
		});
	}
	return r;
}
var dw = class extends Error {
	constructor() {
		super("No image connection"), this.name = "NoImageConnection";
	}
};
async function fw(t, n, r) {
	let i = Km(e().chat[t]);
	if (!i) return;
	let a = $C(i.genId, n, r);
	if (QC.get(a)?.status === "running") return;
	let o = new AbortController();
	QC.set(a, {
		status: "running",
		abort: o
	});
	try {
		let e = ew();
		if (!e) throw new dw();
		let s = aw(i, n, r);
		if (!s?.prompt.trim()) return;
		let c = await RC(e, {
			prompt: s.prompt,
			ratio: s.ratio,
			refs: await uw(e, s.refs)
		}, o.signal), l = [];
		for (let e of c) l.push(await BS(e, { prefix: "img:" }));
		if (!await cw(i.genId, t, (e) => {
			let t = lw(e, n, r);
			t.keys.push(...l), t.shown = t.keys.length - 1;
		})) for (let e of l) US(e);
		QC.delete(a);
	} catch (e) {
		o.signal.aborted ? QC.delete(a) : (QC.set(a, {
			status: "error",
			error: e
		}), console.warn("[AP] image generation failed", e));
	} finally {
		QC.get(a)?.status === "running" && QC.delete(a);
	}
}
function pw(e, t, n) {
	let r = QC.get($C(e, t, n));
	r?.status === "running" ? r.abort.abort() : QC.delete($C(e, t, n));
}
var mw = (e, t) => {
	let n = e ?? [], r = t ?? [];
	return n.length === r.length && n.every((e) => r.includes(e));
};
async function hw(t, n, r, i) {
	let a = Km(e().chat[t]);
	if (!a) return;
	let o = rw(a, n)[r];
	o && await cw(a.genId, t, (e) => {
		let t = lw(e, n, r);
		for (let e of iw) delete t[e];
		i && (i.prompt !== void 0 && i.prompt.trim() && i.prompt.trim() !== o.prompt.trim() && (t.prompt = i.prompt.trim()), i.refs !== void 0 && !mw(i.refs, o.refs) && (t.refs = [...i.refs]), i.ratio !== void 0 && i.ratio !== o.ratio && (t.ratio = i.ratio), i.caption !== void 0 && i.caption.trim() !== (o.caption ?? "").trim() && (t.caption = i.caption.trim()));
	});
}
async function gw(t, n, r, i) {
	let a = Km(e().chat[t]);
	a && await cw(a.genId, t, (e) => {
		lw(e, n, r).shown = i;
	});
}
async function _w(t, n, r, i) {
	let a = Km(e().chat[t]);
	a && (await cw(a.genId, t, (e) => {
		let t = lw(e, n, r), a = t.keys.indexOf(i);
		a < 0 || (t.keys.splice(a, 1), t.shown !== void 0 && t.shown >= a && (t.shown = Math.max(0, t.shown - 1)));
	}), await US(i));
}
async function vw(t) {
	let n = OS().image;
	if (!n.enabled || !n.auto || !ew()) return;
	let r = Km(e().chat[t]);
	if (r && r.origin === "story") for (let e of nw(gm(r.presetId))) {
		let n = rw(r, e.id);
		for (let i = 0; i < n.length; i++) {
			if (r.images?.[e.id]?.[i]?.keys.length) continue;
			let n = sw(r.genId, t);
			if (!n || n.swipe !== null) return;
			await fw(n.mesId, e.id, i);
		}
	}
}
function yw() {
	uy({ image: tw });
}
//#endregion
//#region src/app/receive.ts
var bw = 6e5, xw = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Sw(t, n) {
	let r = Wx.pending;
	if (!r || Date.now() - r.at > bw || xw.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	Wx.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), Jm(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await gS(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && hh(_h(r.ctx.preset), a.global), SS(), Lx.current?.genId === r.ctx.id && Bx(Lx.current, t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t), vw(t);
}
//#endregion
//#region src/app/annotations.ts
var Cw = /* @__PURE__ */ new Set();
function ww(e) {
	for (let t of Cw) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function Tw(t) {
	let n = e().chat[t], r = Km(n)?.annotations;
	return !n || !r?.length ? [] : vc(n.mes, r).annotations;
}
function Ew(t) {
	let n = e().chat[t], r = Km(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = vc(n.mes, r.annotations);
	return i.changed ? (Jm(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function Dw() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (Ew(n) && e().saveChat(), ww(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => ww(Number(e)));
}
var Ow = {
	get: (e) => Tw(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return Cw.add(t), () => Cw.delete(t);
	}
}, kw = /* @__PURE__ */ new Set();
function Aw(e) {
	for (let t of kw) try {
		t(e);
	} catch (e) {
		console.error("[AP] speech listener failed", e);
	}
}
function jw(t) {
	let n = e().chat[t], r = Km(n)?.speech;
	return !n || !r?.length ? [] : Hc(n.mes, r).spans;
}
function Mw(t) {
	let n = e().chat[t], r = Km(n);
	if (!n || !r?.speech?.length) return !1;
	let i = Hc(n.mes, r.speech);
	return i.changed ? (Jm(t, {
		...r,
		speech: i.spans
	}), !0) : !1;
}
function Nw() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (Mw(n) && e().saveChat(), Aw(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => Aw(Number(e)));
}
var Pw = {
	get: (e) => jw(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return kw.add(t), () => kw.delete(t);
	}
}, Fw = (e) => !!e?.image, Iw = (e) => !!e?.speech, Lw = (e) => Fw(e) || Iw(e);
//#endregion
//#region src/ui/media/errors.ts
function Rw(e) {
	return e instanceof ZS ? K(`media.error.proxy.${e.issue}`) : e instanceof QS ? e.message : e instanceof Error && e.name === "NoImageConnection" ? K("media.error.noConnection") : e instanceof TypeError ? K("media.error.network") : e instanceof dC ? K("media.error.body", { error: e.message }) : e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/media/speech/clip.ts
var zw = class e {
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
}, Bw = null;
function Vw() {
	return (!Bw || Bw.state === "closed") && (Bw = new AudioContext()), Bw;
}
var Hw = class {
	carry = null;
	push(e) {
		let t = this.carry === null ? 0 : 1, n = e.length + t >> 1, r = new Float32Array(n), i = 0, a = 0;
		for (this.carry !== null && e.length && (r[a++] = Uw(this.carry | e[0] << 8), i = 1, this.carry = null); i + 1 < e.length; i += 2) r[a++] = Uw(e[i] | e[i + 1] << 8);
		return i < e.length && (this.carry = e[i]), a === n ? r : r.subarray(0, a);
	}
}, Uw = (e) => (e & 32768 ? e - 65536 : e) / 32768, Ww = .15, Gw = 1.2, Kw = class {
	clip;
	sources = /* @__PURE__ */ new Set();
	stopped = !1;
	scheduled = 0;
	constructor(e) {
		this.clip = e;
	}
	async run() {
		let e = Vw();
		e.state === "suspended" && await e.resume().catch(() => void 0);
		let t = this.clip.sampleRate, n = new Hw(), r = [], i = 0, a = 0, o = Ww, s = !1, c = null, l = () => {
			if (!i || this.stopped) return;
			let n = e.createBuffer(1, i, t), l = n.getChannelData(0), u = 0;
			for (let e of r) l.set(e, u), u += e.length;
			r = [], i = 0;
			let d = e.createBufferSource();
			d.buffer = n, d.connect(e.destination), s && a < e.currentTime && (o = Math.min(o * 2, Gw)), s = !0, a = Math.max(a, e.currentTime + .05), d.start(a), a += n.duration, this.scheduled += n.duration, this.sources.add(d), d.onended = () => this.sources.delete(d), c = d;
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
async function qw() {
	Bw?.state === "running" && await Bw.suspend();
}
async function Jw() {
	Bw?.state === "suspended" && await Bw.resume();
}
//#endregion
//#region src/media/speech/util.ts
var Yw = class extends Error {
	status;
	constructor(e, t) {
		super(e), this.status = t, this.name = "SpeechError";
	}
}, Xw = (e, t) => e.baseUrl.trim() || t, Zw = (e, t) => uC(t, fC(e));
function Qw(e, t) {
	let n = {}, r = (e, t) => {
		for (let t of Object.keys(n)) t.toLowerCase() === e.toLowerCase() && delete n[t];
		t !== "" && (n[e] = t);
	};
	for (let [e, n] of Object.entries(t)) r(e, n);
	for (let [t, n] of Object.entries(e.headers ?? {})) t.trim() && r(t.trim(), n);
	return n;
}
async function* $w(e, t) {
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
function eT(e, t) {
	if (!e.body) throw new Yw("Empty response.");
	return Fx(e.body, t);
}
function tT(e) {
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
function nT(e) {
	let t = e.length >> 1, n = new Uint8Array(t);
	for (let r = 0; r < t; r++) n[r] = parseInt(e.substr(r * 2, 2), 16);
	return n;
}
async function* rT(e) {
	let t = /* @__PURE__ */ new Uint8Array(), n = !1;
	for await (let r of e) {
		if (n) {
			yield r;
			continue;
		}
		let e = new Uint8Array(t.length + r.length);
		if (e.set(t), e.set(r, t.length), t = e, t.length < 12) continue;
		let i = String.fromCharCode(...t.subarray(0, 4)) + String.fromCharCode(...t.subarray(8, 12)) === "RIFFWAVE" ? iT(t) : 0;
		i < 0 || (n = !0, t.length > i && (yield t.subarray(i)));
	}
	!n && t.length && (yield t);
}
function iT(e) {
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
var aT = {
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
		if (r?.kind === "clone") throw new Yw("DeepSeek does not support voice cloning.");
		let a = Zw(t, {
			text: n,
			voice_id: r?.id ?? this.voices[0].id,
			format: "pcm"
		});
		return {
			sampleRate: 24e3,
			chunks: rT($w(await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "tools/tts"), {
				method: "POST",
				headers: Qw(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(a),
				signal: i
			})), i))
		};
	}
}, oT = 24e3, sT = [
	["JBFqnCBsd6RMkjVDRZzb", "George"],
	["21m00Tcm4TlvDq8ikWAM", "Rachel"],
	["EXAVITQu4vr4xnSDxMaL", "Sarah"],
	["pNInz6obpgDQGcFmaJgB", "Adam"],
	["nPczCjzI2devNBz1zQrb", "Brian"],
	["pFZP5JQG7iQjIQuC4Bku", "Lily"],
	["IKne3meq5aSn9XLyUdCD", "Charlie"],
	["XB0fDUnXU5powFXDhCwa", "Charlotte"]
], cT = (e) => ({ "xi-api-key": e }), lT = {
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
	voices: sT.map(([e, t]) => ({
		id: e,
		name: t
	})),
	format: "Inside a speech tag you may add ElevenLabs audio tags in square brackets right before the words they affect: emotions such as [excited] [sad] [angry] [nervous] [sarcastic] [curious], delivery such as [whispers] [shouts] [softly], and sounds such as [laughs] [sighs] [gasps] [crying] [clears throat]; use [pause] or an ellipsis for a pause. Example: <speech character=\"Mia\">[whispers] Don't move. [pause] Something is out there.</speech>",
	tags: /\[[^[\]\n]{1,60}\]/g,
	clone: { text: "none" },
	async search(e, t, n, r) {
		let i = Xw(t, this.defaults.baseUrl), a = Qw(t, cT(t.apiKey)), o = n.trim(), s = new URL(hC(i, "v2/voices"));
		s.searchParams.set("page_size", "30"), o && s.searchParams.set("search", o);
		let c = new URL(hC(i, "v1/shared-voices"));
		c.searchParams.set("page_size", "30"), o && c.searchParams.set("search", o);
		let l = async (t) => (await (await cC(await e.fetch(t.toString(), {
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
		let i = hC(Xw(t, this.defaults.baseUrl), `v1/voices/add/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.id)}`), a = await e.fetch(i, {
			method: "POST",
			headers: Qw(t, {
				...cT(t.apiKey),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ new_name: n.name }),
			signal: r
		});
		return a.status === 400 || a.status === 409 ? n.id : (await (await cC(a)).json()).voice_id || n.id;
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new Yw("Reference audio is missing.");
		let a = new FormData();
		a.append("name", `AP ${n.audio.slice(-8)}`), a.append("files", i, "reference");
		let o = (await (await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "v1/voices/add"), {
			method: "POST",
			headers: Qw(t, cT(t.apiKey)),
			body: a,
			signal: r
		}))).json()).voice_id;
		if (!o) throw new Yw("No voice id returned.");
		return o;
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = r?.kind === "voice" ? r.id : r?.id;
		if (r?.kind === "clone" && !a) throw new Yw("The cloned voice has not been created.");
		let o = new URL(hC(Xw(t, this.defaults.baseUrl), `v1/text-to-speech/${encodeURIComponent(a || sT[0][0])}/stream`));
		o.searchParams.set("output_format", `pcm_${oT}`);
		let s = Zw(t, {
			text: n,
			model_id: t.model || this.defaults.model
		});
		return {
			sampleRate: oT,
			chunks: $w(await cC(await e.fetch(o.toString(), {
				method: "POST",
				headers: Qw(t, {
					...cT(t.apiKey),
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
function uT(e) {
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
var dT = 24e3, fT = {
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
		let i = new URL(hC(Xw(t, this.defaults.baseUrl), "model"));
		return i.searchParams.set("page_size", "20"), n.trim() && i.searchParams.set("title", n.trim()), ((await (await cC(await e.fetch(i.toString(), {
			headers: Qw(t, t.apiKey ? { Authorization: `Bearer ${t.apiKey}` } : {}),
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
			sample_rate: dT,
			latency: "balanced"
		};
		r?.kind === "voice" && (a.reference_id = r.id);
		let o = Zw(t, a), s = {
			Authorization: `Bearer ${t.apiKey}`,
			model: t.model || this.defaults.model
		}, c;
		if (r?.kind === "clone") {
			let t = await e.blob(r.audio);
			if (!t) throw new Yw("Reference audio is missing.");
			let n = {
				audio: new Uint8Array(await t.arrayBuffer()),
				text: r.text ?? ""
			};
			c = uT({
				...o,
				references: [n]
			}), s["Content-Type"] = "application/msgpack";
		} else c = JSON.stringify(o), s["Content-Type"] = "application/json";
		let l = await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "v1/tts"), {
			method: "POST",
			headers: Qw(t, s),
			body: c,
			signal: i
		}));
		return {
			sampleRate: Number(o.sample_rate) || dT,
			chunks: $w(l, i)
		};
	}
}, pT = [
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
], mT = /* @__PURE__ */ "argh.breath.heavy breath.exhales.cackle.cheer.chuckle.chuckles.cough.cry.gasp.giggle.groan.growl.grunt.grr.hiss.laugh.laughter.moan.pant.pff.phew.scream.shout.shriek.sigh.sighs.sneeze.snicker.snort.sob.throat-clearing.tsk.whimper.whispers.whispering.yawn.short pause.long pause".split("."), hT = (e) => Qw(e, {
	"Content-Type": "application/json",
	"x-goog-api-key": e.apiKey
});
function gT(e) {
	if (!e) return pT[0][0];
	if (e.kind === "voice" || e.id) return e.id;
	throw new Yw("The replicated voice has not been created yet.");
}
var _T = {
	api: "gemini",
	defaults: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-3.8-flash-tts"
	},
	models: ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"],
	voices: pT.map(([e, t]) => ({
		id: e,
		name: e,
		description: t
	})),
	format: "Inside a speech tag you may add vocal sounds and pauses in angle brackets exactly where they happen: <sigh> <laugh> <chuckle> <giggle> <gasp> <cough> <breath> <sob> <yawn> <whispering> <short pause> <long pause>. Use these English tags in any language. Example: Wait... <short pause> did you hear that? <gasp>",
	tags: RegExp(`<(?:${mT.join("|")})>`, "gi"),
	clone: {
		text: "none",
		consent: !0
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = Zw(t, {
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
			generation_config: { speech_config: [{ voice: gT(r) }] },
			stream: !0
		}), o = await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "interactions"), {
			method: "POST",
			headers: hT(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.response_format?.sample_rate) || 24e3,
			chunks: rT(vT(o, i))
		};
	},
	async createClone(e, t, n, r) {
		let [i, a] = await Promise.all([e.blob(n.audio), n.consent ? e.blob(n.consent) : void 0]);
		if (!i) throw new Yw("Reference audio not found.");
		if (!a) throw new Yw("Gemini voice replication needs a consent recording.");
		let o = async (e) => ({
			mime_type: e.type.split(";")[0].trim() || "audio/wav",
			data: await YS(e)
		}), s = await (await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "voices"), {
			method: "POST",
			headers: hT(t),
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
		if (!c) throw new Yw("Gemini did not return a voice id.");
		return c;
	},
	async search(e, t, n, r) {
		let i = new URL(hC(Xw(t, this.defaults.baseUrl), "voices"));
		return n.trim() && i.searchParams.set("search", n.trim()), i.searchParams.set("page_size", "100"), ((await (await cC(await e.fetch(i.toString(), {
			method: "GET",
			headers: Qw(t, { "x-goog-api-key": t.apiKey }),
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
async function* vT(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = ((await e.json()).steps ?? []).flatMap((e) => e.content ?? []).filter((e) => e.type === "audio" && e.data);
		if (!t.length) throw new Yw("Gemini returned no audio.");
		yield tT(t[t.length - 1].data);
		return;
	}
	let n = !1;
	for await (let r of eT(e, t)) {
		if (r === "[DONE]") break;
		let e = JSON.parse(r);
		if (e.event_type === "error" || e.error) throw new Yw(`Gemini: ${e.error?.message ?? "stream error"}`);
		e.event_type === "step.delta" && e.delta?.type === "audio" && e.delta.data && (n = !0, yield tT(e.delta.data));
	}
	if (!n) throw new Yw("Gemini returned no audio.");
}
//#endregion
//#region src/media/speech/providers/minimax.ts
var yT = [
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
], bT = [
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
function xT(e) {
	let t = e?.base_resp?.status_code;
	if (t) throw new Yw(`MiniMax ${t}: ${e.base_resp?.status_msg || "error"}`);
	return e;
}
var ST = (e, t = !0) => Qw(e, {
	...t ? { "Content-Type": "application/json" } : {},
	Authorization: `Bearer ${e.apiKey}`
});
function CT(e) {
	if (!e) return bT[0].id;
	if (e.kind === "voice" || e.id) return e.id;
	throw new Yw("The cloned voice has not been created yet.");
}
function wT() {
	return `AP${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
var TT = {
	"audio/mpeg": "mp3",
	"audio/mp3": "mp3",
	"audio/mp4": "m4a",
	"audio/x-m4a": "m4a",
	"audio/m4a": "m4a",
	"audio/wav": "wav",
	"audio/x-wav": "wav",
	"audio/wave": "wav"
}, ET = {
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
	voices: bT,
	format: `Inside a speech tag you may add MiniMax voice tags: a pause as <#seconds#> between words (e.g. <#0.5#>), and interjections in parentheses: ${yT.map((e) => `(${e})`).join(" ")}. Example: (sighs) Fine.<#0.4#> Let's go.`,
	tags: RegExp(`<#\\d+(?:\\.\\d+)?#>|\\((?:${yT.join("|")})\\)`, "g"),
	clone: { text: "none" },
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = Zw(t, {
			model: t.model || this.defaults.model,
			text: n,
			stream: !0,
			stream_options: { exclude_aggregated_audio: !0 },
			language_boost: "auto",
			voice_setting: { voice_id: CT(r) },
			audio_setting: {
				format: "pcm",
				sample_rate: 24e3,
				channel: 1
			}
		}), o = await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "t2a_v2"), {
			method: "POST",
			headers: ST(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.audio_setting?.sample_rate) || 24e3,
			chunks: DT(o, i)
		};
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new Yw("Reference audio not found.");
		let a = Xw(t, this.defaults.baseUrl), o = new FormData();
		o.append("purpose", "voice_clone"), o.append("file", i, `reference.${TT[i.type.split(";")[0].trim()] ?? "wav"}`);
		let s = await (await cC(await e.fetch(hC(a, "files/upload"), {
			method: "POST",
			headers: ST(t, !1),
			body: o,
			signal: r
		}))).text();
		xT(JSON.parse(s));
		let c = /"file_id"\s*:\s*"?(\d+)/.exec(s)?.[1];
		if (!c) throw new Yw("MiniMax did not return a file id.");
		let l = wT(), u = JSON.stringify({
			file_id: 0,
			voice_id: l
		}).replace("\"file_id\":0", `"file_id":${c}`);
		return xT(await (await cC(await e.fetch(hC(a, "voice_clone"), {
			method: "POST",
			headers: ST(t),
			body: u,
			signal: r
		}))).json()), l;
	},
	async search(e, t, n, r) {
		let i = xT(await (await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "get_voice"), {
			method: "POST",
			headers: ST(t),
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
async function* DT(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = xT(await e.json());
		t.data?.audio && (yield nT(t.data.audio));
		return;
	}
	let n = !1;
	for await (let r of eT(e, t)) {
		let e = xT(JSON.parse(r)), t = e.data?.audio;
		t && (e.data?.status === 2 && n || (n = !0, yield nT(t)));
	}
}
//#endregion
//#region src/media/speech/providers/openai.ts
var OT = [
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
], kT = {
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
	voices: OT.map((e) => ({
		id: e,
		name: e[0].toUpperCase() + e.slice(1)
	})),
	format: "",
	tags: null,
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = r?.kind === "voice" ? r.id : OT[0], o = Zw(t, {
			model: t.model || this.defaults.model,
			input: n,
			voice: a.startsWith("voice_") ? { id: a } : a,
			response_format: "pcm"
		});
		return {
			sampleRate: 24e3,
			chunks: $w(await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "audio/speech"), {
				method: "POST",
				headers: Qw(t, {
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
async function AT(e, t) {
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
var jT = (e) => e.map((e) => ({
	id: e,
	name: e[0].toUpperCase() + e.slice(1)
})), MT = {
	elevenlabs: {
		format: lT.format,
		tags: lT.tags,
		voices: jT([
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
		format: fT.format,
		tags: fT.tags,
		clone: { text: "optional" }
	},
	minimax: {
		format: ET.format,
		tags: ET.tags
	},
	google: {
		format: _T.format,
		tags: _T.tags,
		voices: _T.voices,
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
		tags: fT.tags,
		clone: { text: "none" },
		voices: jT([
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
}, NT = (e) => e.trim().split("/")[0].toLowerCase(), PT = {
	format: "",
	tags: null,
	voices: []
}, FT = (e) => ({
	...PT,
	...MT[NT(e)]
}), IT = 24e3, LT = "elevenlabs/eleven-v3", RT = (e) => e.trim() || LT, zT = /* @__PURE__ */ new Map();
function BT(e, t) {
	let n = /rate=(\d+)/i.exec(e);
	return n && Number(n[1]) || FT(t).pcm || IT;
}
//#endregion
//#region src/media/speech/providers/index.ts
var VT = {
	fish: fT,
	elevenlabs: lT,
	minimax: ET,
	gemini: _T,
	openai: kT,
	deepseek: aT,
	openrouter: {
		api: "openrouter",
		defaults: {
			baseUrl: "https://openrouter.ai/api/v1",
			model: LT
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
		...PT,
		forModel(e) {
			let { pcm: t, ...n } = FT(RT(e));
			return {
				clone: void 0,
				...n
			};
		},
		async search(e, t, n, r) {
			let i = RT(t.model), a = Xw(t, this.defaults.baseUrl), o = `${a}|${i}`, s = zT.get(o);
			if (!s) {
				let n = hC(a, `audio/speech/models/${i.split("/").map(encodeURIComponent).join("/")}`);
				s = e.fetch(n, {
					headers: Qw(t, t.apiKey ? { Authorization: `Bearer ${t.apiKey}` } : {}),
					signal: r
				}).then(cC).then(async (e) => {
					let t = await e.json(), n = ((t.data && typeof t.data == "object" ? t.data : t).output_modalities ?? []).flatMap((e) => Array.isArray(e.supported_parameters?.voice?.values) ? e.supported_parameters.voice.values : []);
					return [...new Set(n.filter((e) => typeof e == "string"))].map((e) => ({
						id: e,
						name: e
					}));
				}), zT.set(o, s), s.catch(() => zT.delete(o));
			}
			let c = n.trim().toLowerCase();
			return (await s).filter((e) => !c || e.id.toLowerCase().includes(c));
		},
		async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
			let a = RT(t.model), o = FT(a), s = {
				model: a,
				input: n,
				response_format: o.pcm ? "pcm" : "mp3"
			};
			if (r?.kind === "clone") {
				let t = await e.blob(r.audio);
				if (!t) throw new Yw("Reference audio is missing.");
				s.input_references = [{
					type: "input_audio",
					input_audio: { data: `data:${t.type || "audio/wav"};base64,${await YS(t)}` }
				}, ...r.text?.trim() ? [{
					type: "text",
					text: r.text.trim()
				}] : []];
			} else {
				let e = r?.id ?? o.voices[0]?.id;
				e && (s.voice = e);
			}
			let c = await cC(await e.fetch(hC(Xw(t, this.defaults.baseUrl), "audio/speech"), {
				method: "POST",
				headers: Qw(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(Zw(t, s)),
				signal: i
			})), l = c.headers.get("content-type") ?? "";
			if (/pcm|l16/i.test(l) || !l && o.pcm) return {
				sampleRate: BT(l, a),
				chunks: $w(c, i)
			};
			let u = await AT(new Uint8Array(await c.arrayBuffer()), IT);
			return {
				sampleRate: u.sampleRate,
				chunks: (async function* () {
					yield u.pcm;
				})()
			};
		}
	}
};
function HT(e) {
	return VT[e];
}
function UT(e) {
	let t = VT[e.api];
	return t?.forModel ? {
		...t,
		...t.forModel(e.model || t.defaults.model)
	} : t;
}
var WT = (e) => e && UT(e)?.format || "", GT = (e) => e && UT(e)?.tags || null, KT = (e) => e.global ? e : new RegExp(e.source, `${e.flags}g`);
function qT(e, t, n) {
	let r = GT(e);
	if (!r || t === n) return r ? t : n;
	let i = RegExp(`^(?:${r.source})$`, r.flags.replace("g", "")), a = t;
	for (let e of [Lc, ...Object.values(VT).map((e) => e.tags)]) e && e !== r && (a = a.replace(KT(e), (e) => i.test(e) ? e : ""));
	return a === t ? t : a.replace(/[ \t]{2,}/g, " ").trim();
}
//#endregion
//#region src/media/speech/segments.ts
function JT(e) {
	let t = e.replace(/<[^>]*>/g, " ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_~`#>|]+/g, "").replace(/\s+/g, " ").trim();
	return /[\p{L}\p{N}]/u.test(t) ? t : "";
}
function YT(e, t, n, r = (e) => e, i = {}) {
	let a = t.filter((e) => !e.orphan && e.end > e.start).sort((e, t) => e.start - t.start), o = [], s = 0, c = (t, r) => {
		if (!n || r <= t) return;
		let i = t;
		for (let n of e.slice(t, r).split(/(\n\s*\n)/)) {
			let e = JT(n);
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
var XT = (e) => e.normalize("NFKC").trim().toLowerCase();
function ZT(e, t) {
	return e.bindings.filter((e) => !e.card || t.includes(e.card));
}
function QT(e, t) {
	let n = XT(t), r = e.filter((e) => e.voice && XT(e.character) === n);
	return r.find((e) => e.card) ?? r[0];
}
function $T(e, t, n) {
	return t.kind === "narration" || !t.character.trim() ? e.narrator : QT(ZT(e, n), t.character)?.voice ?? void 0;
}
function eE(e) {
	return e ? e.kind === "voice" ? `v:${e.id}` : `c:${e.audio}:${e.text ?? ""}` : "-";
}
function tE(e) {
	let t = 14695981039346656037n, n = new TextEncoder().encode(e);
	for (let e of n) t = BigInt.asUintN(64, (t ^ BigInt(e)) * 1099511628211n);
	return t.toString(16).padStart(16, "0");
}
function nE(e, t, n) {
	return `tts:${tE(JSON.stringify([
		e.api,
		e.baseUrl.trim(),
		e.model,
		e.body.trim(),
		eE(t),
		n
	]))}`;
}
//#endregion
//#region src/media/speech/wav.ts
function rE(e, t) {
	let n = e.length & -2, r = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(44)), i = (e, t) => {
		for (let n = 0; n < t.length; n++) r.setUint8(e + n, t.charCodeAt(n));
	};
	return i(0, "RIFF"), r.setUint32(4, 36 + n, !0), i(8, "WAVE"), i(12, "fmt "), r.setUint32(16, 16, !0), r.setUint16(20, 1, !0), r.setUint16(22, 1, !0), r.setUint32(24, t, !0), r.setUint32(28, t * 2, !0), r.setUint16(32, 2, !0), r.setUint16(34, 16, !0), i(36, "data"), r.setUint32(40, n, !0), new Blob([r.buffer, e.slice(0, n)], { type: "audio/wav" });
}
function iE(e) {
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
var aE = {
	fetch: (e, t) => oC(e, t),
	blob: VS
}, X = /* @__PURE__ */ _n({
	clips: {},
	playing: null,
	paused: !1,
	generating: {}
});
function oE() {
	let e = OS().speech;
	return e.enabled ? NS(e) : void 0;
}
function sE(t) {
	let n = e().chat[t], r = oE();
	if (!n || n.is_user || !r) return [];
	let i = Km(n);
	return !i || !Iw(gm(i.presetId)) ? [] : YT(n.mes, jw(t), OS().speech.narrator, (e, t) => qT(r, e, t), i.speechText);
}
async function cE(t, n, r) {
	let i = sE(t).find((e) => e.id === n), a = Km(e().chat[t]);
	if (!i || !a) return;
	let o = r.trim();
	if (o === i.text) return;
	await HE(t, [n]);
	let s = { ...a.speechText };
	!o || o === (i.original ?? i.text) ? delete s[n] : s[n] = o;
	let { speechText: c, ...l } = a;
	Jm(t, Object.keys(s).length ? {
		...l,
		speechText: s
	} : l), WC(), await e().saveChat();
}
var lE = /* @__PURE__ */ new Map();
async function uE(e, t, n) {
	if (t?.kind !== "clone" || t.id) return t;
	let r = UT(e);
	if (!r?.createClone) return t;
	let i = `${e.id}:${t.audio}:${t.consent ?? ""}`, a = lE.get(i);
	return a || (a = r.createClone(aE, e, t, n), lE.set(i, a), a.catch(() => lE.delete(i))), t.id = await a, kS(), t;
}
var dE = async () => null, fE = (e) => {
	dE = e;
}, pE = () => zC().map((e) => e.key), mE = /* @__PURE__ */ new Map(), hE = Promise.resolve();
function gE(e, t) {
	let n = `${e.id}\n${XT(t)}`, r = mE.get(n);
	return r || (r = hE.then(async () => {
		if ($T(e, {
			kind: "speech",
			character: t
		}, pE()) !== void 0) return !0;
		let n = zC(), r = await dE(e, t, n);
		if (!r) return !1;
		let i = e.bindings.find((e) => XT(e.character) === XT(t) && (e.card ?? "") === (r.card ?? ""));
		return i ? i.voice = r.voice : e.bindings.push({
			character: t,
			voice: r.voice,
			...r.card ? { card: r.card } : {}
		}), kS(), !0;
	}).finally(() => mE.delete(n)), hE = r.catch(() => void 0), mE.set(n, r), r);
}
async function _E(e, t) {
	let n = pE(), r = /* @__PURE__ */ new Map();
	for (let i of t) $T(e, i, n) === void 0 && r.set(XT(i.character), i.character);
	for (let t of r.values()) await gE(e, t);
	let i = pE();
	return t.filter((t) => $T(e, t, i) !== void 0);
}
var vE = 48, yE = /* @__PURE__ */ new Map();
function bE(e, t) {
	yE.delete(e), yE.set(e, t);
	for (let e of yE.keys()) {
		if (yE.size <= vE) break;
		if (yE.get(e).state !== "loading") yE.delete(e);
		else break;
	}
	return t;
}
function xE(e, t) {
	let n = $T(e, t, pE());
	return n === void 0 ? void 0 : nE(e, n, t.text);
}
function SE(e, t) {
	let n = $T(e, t, pE());
	return n === void 0 ? Promise.reject(/* @__PURE__ */ Error(`No voice for ${t.character}`)) : wE(e, n, t.text);
}
var CE = /* @__PURE__ */ new Map();
function wE(e, t, n) {
	let r = nE(e, t, n), i = yE.get(r);
	if (i && i.state !== "error") return Promise.resolve(bE(r, i));
	let a = CE.get(r);
	return a || (a = TE(e, t, n, r).finally(() => CE.delete(r)), CE.set(r, a)), a;
}
async function TE(e, t, n, r) {
	let i = await VS(r).catch(() => void 0), a = i ? iE(await i.arrayBuffer()) : null;
	if (a) return X.clips[r] = "ready", bE(r, zw.of(a.pcm, a.sampleRate));
	let o = UT(e);
	if (!o) throw Error(`Unknown speech API ${e.api}`);
	return X.clips[r] = "loading", bE(r, new zw(async (r) => {
		let i = await uE(e, t, r);
		return o.synthesize(aE, {
			conn: e,
			text: n,
			voice: i,
			signal: r
		});
	}, (e) => {
		yE.get(r) === e && (X.clips[r] = e.state, e.state === "ready" && BS(rE(e.pcm(), e.sampleRate), { key: r }).catch((e) => console.warn("[AP] speech cache write failed", e)));
	}));
}
function EE(e) {
	let t = oE(), n = t && xE(t, e);
	return n ? X.clips[n] : void 0;
}
async function DE(e) {
	let t = oE();
	if (t) for (let n of e) {
		let e = xE(t, n);
		e && !X.clips[e] && await HS(e).catch(() => !1) && (X.clips[e] ??= "ready");
	}
}
function OE(e) {
	e instanceof DOMException && e.name === "AbortError" || (console.error("[AP] speech synthesis failed", e), w("error", Rw(e), K("media.speech")));
}
var kE = null;
function AE() {
	kE && (kE.cancelled = !0, kE.playback?.stop()), kE = null, X.playing = null, X.paused = !1, Jw();
}
async function jE() {
	X.playing && (X.paused ? (await Jw(), X.paused = !1) : (await qw(), X.paused = !0));
}
async function ME(e, t, n, r) {
	AE();
	let i = oE();
	if (!i || !t[n]) return;
	let a = {
		playback: null,
		cancelled: !1
	};
	kE = a;
	try {
		let o = await _E(i, r ? t.slice(n) : [t[n]]);
		if (a.cancelled || !o.length) return;
		let s = o.length - 1, c = SE(i, o[0]);
		for (let t = 0; t <= s && !a.cancelled; t++) {
			let n = await c;
			if (c = t < s ? SE(i, o[t + 1]) : null, a.cancelled) break;
			X.playing = {
				mesId: e,
				segId: o[t].id,
				all: r
			}, a.playback = new Kw(n), await a.playback.run();
		}
	} catch (e) {
		a.cancelled || OE(e);
	} finally {
		kE === a && (kE = null, X.playing = null, X.paused = !1);
	}
}
function NE(e, t) {
	let n = X.playing;
	if (n && n.mesId === e && n.segId === t) {
		jE();
		return;
	}
	let r = sE(e), i = r.findIndex((e) => e.id === t);
	i >= 0 && ME(e, r, i, !1);
}
function PE(e, t) {
	let n = sE(e);
	ME(e, n, t ? Math.max(0, n.findIndex((e) => e.id === t)) : 0, !0);
}
async function FE(e, t) {
	AE();
	let n = {
		playback: null,
		cancelled: !1
	};
	kE = n;
	try {
		let r = await wE(e, t, K("media.speech.sample"));
		if (n.cancelled) return;
		n.playback = new Kw(r), await n.playback.run();
	} catch (e) {
		n.cancelled || OE(e);
	} finally {
		kE === n && (kE = null);
	}
}
var IE = /* @__PURE__ */ new Set();
function LE(e) {
	return IE.add(e), () => {
		IE.delete(e);
	};
}
async function RE() {
	let e = /* @__PURE__ */ new Set();
	for (let t of OS().speech.connections) for (let n of [
		t.narrator,
		...t.bindings.map((e) => e.voice),
		...[...IE].flatMap((e) => e())
	]) n?.kind === "clone" && (e.add(n.audio), n.consent && e.add(n.consent));
	await GS("voice:", e).catch(() => void 0);
}
async function zE(e) {
	let t = oE();
	if (t && !X.generating[e] && sE(e).length) {
		X.generating[e] = !0;
		try {
			let n = await _E(t, sE(e));
			for (let e of n) {
				let n = await SE(t, e);
				if (await n.done, n.state === "error") throw n.error;
			}
		} catch (e) {
			OE(e);
		} finally {
			delete X.generating[e];
		}
	}
}
async function BE(e, t) {
	let n = oE(), r = sE(e).find((e) => e.id === t);
	if (n && r) try {
		let [e] = await _E(n, [r]);
		if (!e) return;
		let t = await SE(n, e);
		if (await t.done, t.state === "error") throw t.error;
	} catch (e) {
		OE(e);
	}
}
async function VE(e) {
	let t = oE();
	if (!t) return null;
	let n = [], r = 0;
	for (let i of await _E(t, sE(e))) {
		let e = await SE(t, i);
		await e.done, e.state === "ready" && (r && e.sampleRate !== r || (r = e.sampleRate, n.push(e.pcm())));
	}
	if (!r) return null;
	let i = new Uint8Array(n.reduce((e, t) => e + t.length, 0)), a = 0;
	for (let e of n) i.set(e, a), a += e.length;
	return rE(i, r);
}
async function HE(e, t) {
	let n = oE();
	if (!n) return;
	let r = X.playing;
	r && r.mesId === e && (!t || t.includes(r.segId)) && AE();
	for (let r of sE(e)) {
		if (t && !t.includes(r.id)) continue;
		let e = xE(n, r);
		e && (yE.get(e)?.abort(), yE.delete(e), delete X.clips[e], await US(e).catch(() => void 0));
	}
}
async function UE(e, t) {
	await HE(e, t ? [t] : void 0), t ? NE(e, t) : await zE(e);
}
function WE(e) {
	let t = ZT(e, pE()), n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let r = XT(e.character);
		if (!e.character.trim() || n.has(r)) continue;
		let i = QT(t, e.character);
		i && n.set(r, i.character);
	}
	return [...n.values()];
}
function GE() {
	let e = OS().speech, t = oE(), n = t?.api ?? "", r = GT(t);
	return {
		vars: {
			on: !!t,
			auto: e.auto,
			api: n,
			narrator: e.narrator,
			characters: !1
		},
		format: WT(t),
		characters: t ? WE(t) : [],
		...r ? { cleaner: r } : {}
	};
}
var KE = 30;
function qE() {
	uy({ speech: GE }), GS("tts:", /* @__PURE__ */ new Set(), KE * 864e5).catch(() => void 0);
	let { eventSource: t, eventTypes: n } = e();
	t.on("advanced_preset_message_updated", (e) => {
		let t = Number(e);
		!Number.isNaN(t) && OS().speech.auto && zE(t);
	});
	for (let e of [n.CHAT_CHANGED]) e && t.on(e, AE);
}
//#endregion
//#region src/store/bundled-modules.ts
function JE(e, t, n, r) {
	return np({
		...G(up(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
var YE = (e, t, n) => (t ? e.locales?.[t] ?? e.locales?.[t.split("-")[0]] : void 0)?.userModuleGroups?.[n];
function XE(e, t, n, r, i = { list: [] }) {
	let a = {
		add: [],
		groups: [],
		groupRecords: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	};
	for (let t of op(e)) {
		if (!t || typeof t.id != "string" || !t.id || a.groupRecords.includes(t.id) || (a.groupRecords.push(t.id), i.list.some((e) => e.id === t.id) || i.records?.includes(t.id))) continue;
		let n = {
			id: t.id,
			name: t.name,
			mode: t.mode === "single" ? "single" : "multi",
			...t.collapsed ? { collapsed: !0 } : {},
			...t.enabled === !1 ? { enabled: !1 } : {}
		};
		a.groups.push(sp(n, YE(e, r, t.id)));
	}
	let o = new Set([...i.list, ...a.groups].map((e) => e.id)), s = /* @__PURE__ */ new Set();
	for (let i of cp(e)) {
		if (!i || typeof i.id != "string" || !i.id || s.has(i.id)) continue;
		s.add(i.id);
		let c = t.find((e) => e.id === i.id), l = JE(e, i, r, c?.enabled ?? i.enabled !== !1);
		if (!l) continue;
		let u = hp(i), d = mp(l), f = n?.[i.id];
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
		let p = mp(c);
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
function ZE(e, t, n = []) {
	if (e.add.length || e.groups.length || e.conflicts.length || e.groupRecords.length !== n.length || e.groupRecords.some((e) => !n.includes(e))) return !1;
	let r = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(r), ...Object.keys(e.records)])].every((t) => r[t]?.source === e.records[t]?.source && r[t]?.copy === e.records[t]?.copy);
}
function QE(e, t, n = []) {
	let r = _h(e), i = $g(e), a = { ...t.records }, o = [...i];
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
	let s = Mf([...o, ...t.add], [...r.userModuleGroups ?? [], ...t.groups]);
	r.userModules = s.modules, r.userModuleGroups = s.groups, r.bundledModules = a, t.groupRecords.length ? r.bundledGroups = t.groupRecords : delete r.bundledGroups, J();
}
function $E(e, t, n, r = []) {
	let i = cp(e), a = t.map((t) => {
		let r = i.find((e) => e.id === t.id), a = r && JE(e, r, n, t.enabled);
		if (r && a && mp(a) === mp(t)) {
			let { enabled: e, group: n, ...i } = G(r);
			return {
				...i,
				...t.enabled ? {} : { enabled: !1 },
				...t.group === void 0 ? {} : { group: t.group }
			};
		}
		return fp(t);
	}), o = op(e), s = G(e.locales ?? {}), c = r.filter((e) => t.some((t) => t.group === e.id)).map((t) => {
		let r = o.find((e) => e.id === t.id), i = (e, t) => e.name === t.name && e.mode === t.mode && !!e.collapsed == !!t.collapsed, a = t.enabled === !1 ? { enabled: !1 } : {};
		if (r && i(sp(r, YE(e, n, r.id)), t)) {
			let { enabled: e, ...t } = G(r);
			return {
				...t,
				...a
			};
		}
		for (let e of Object.values(s)) e?.userModuleGroups && delete e.userModuleGroups[t.id];
		return {
			id: t.id,
			name: t.name,
			mode: t.mode,
			...t.collapsed ? { collapsed: !0 } : {},
			...a
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
function eD(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function tD(e, t) {
	let n = URL.createObjectURL(e), r = document.createElement("a");
	r.href = n, r.download = t, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var nD = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
function rD(e, t) {
	let n = URL.createObjectURL(t), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
//#endregion
//#region src/app/bundled-modules.ts
function iD(e, t, n) {
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
async function aD(e, t) {
	let { root: n, checked: r } = iD(K("um.bundled.conflictTitle"), K("um.bundled.conflictBody", { name: rm(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: K(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await C(n, K("um.bundled.apply"), K("um.bundled.keepAll")) ? r() : [];
}
async function oD(e, t) {
	let n = _h(e), r = XE(e, $g(e), n.bundledModules, em(), {
		list: e_(e),
		records: n.bundledGroups
	});
	if (ZE(r, n.bundledModules, n.bundledGroups)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await aD(e, a)), QE(e, r, i), r.add.length && w("info", K("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), rm(e));
}
var sD = /* @__PURE__ */ new Map();
function cD(e, t = {}) {
	let n = e.id, r = (sD.get(n) ?? Promise.resolve()).then(() => oD(gm(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return sD.set(n, r), r;
}
function lD(e, t, n) {
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
async function uD(e) {
	let t = $g(e), n = lD(K("presetFile.installer"), K("presetFile.installerHint"), !0), r, i = () => [];
	if (t.length) {
		let a = iD(K("um.bundled.exportTitle", { name: rm(e) }), K("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || K("um.untitled"),
			...e.enabled ? {} : { note: K("um.bundled.disabled") },
			checked: !0
		})));
		a.root.append(n.root), r = a.root, i = a.checked;
	} else {
		r = document.createElement("div"), r.style.textAlign = "start";
		let t = document.createElement("h3");
		t.textContent = K("um.bundled.exportTitle", { name: rm(e) }), r.append(t, n.root);
	}
	if (!await C(r, K("um.bundled.export"), K("common.cancel"))) return !1;
	let a = i(), o = $E(e, t.filter((e) => a.includes(e.id)), em(), e_(e)), s = Uu(o, o.defaultConfiguration, void 0).sampling;
	return eD(`${nD(e.id)}.apreset.json`, of(o, {
		installer: n.box.checked,
		sampling: s
	})), !0;
}
//#endregion
//#region src/app/dev-source.ts
var dD = /* @__PURE__ */ _n({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), fD = 1500, pD = null;
async function mD() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await T(`${n}/`, { cache: "no-store" })).json();
		if (dD.status = "online", dD.error = e.ok === !1 ? "build failed" : "", dD.at = Date.now(), !e.hash || e.hash === dD.hash) return;
		let t = dm(await (await T(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		dD.presetId && dD.presetId !== t.id && ym(null, dD.presetId), ym(t), dD.presetId = t.id, dD.hash = t.hash, Ah(t), await Kh(t), cD(t, { auto: !0 }), O_("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		dD.status = "error", dD.error = e instanceof Error ? e.message : String(e);
	}
}
function hD() {
	if (pD && clearTimeout(pD), pD = null, !q().dev.enabled) return dD.presetId && ym(null, dD.presetId), Object.assign(dD, {
		status: "off",
		presetId: "",
		hash: "",
		error: ""
	}), Promise.resolve();
	dD.status === "off" && (dD.status = "connecting");
	let e = async () => {
		await mD(), q().dev.enabled && (pD = setTimeout(e, fD));
	};
	return e();
}
function gD() {
	let e = Promise.resolve();
	return P(() => [q().dev.enabled, q().dev.url], () => {
		dD.hash = "", e = hD();
	}, { immediate: !0 }), e;
}
//#endregion
//#region src/app/impersonate.ts
var _D = "#option_impersonate, #mes_impersonate", vD = () => document.querySelector("#send_textarea");
function yD(e, t = !1, n) {
	let r = vD();
	r && (r.value = n === void 0 ? e : _S(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function bD() {
	if (!q().enabled) return null;
	let t = Vh(), n = t ? gm(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = bh(n);
	if (!ng(r)) return null;
	let i = Zs(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Dd(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function xD(e) {
	if (!e.target?.closest?.(_D)) return;
	let t = bD();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = vD()?.value.trim();
	yD(_S(n ? `${t}\n${n}` : t), !0);
}
function SD() {
	window.addEventListener("click", xD, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function CD(e) {
	let t = Fl(e);
	if (!t) return !1;
	let n = q().presets[e.id]?.customUi, r = pm(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function wD(e) {
	let t = q().presets[e.id]?.customUi;
	return !!(t && t.hash === Fl(e));
}
function TD(e, t) {
	_h(e).customUi = {
		enabled: t,
		hash: Fl(e)
	}, J();
}
//#endregion
//#region src/app/trust.ts
var ED = class extends Error {
	constructor() {
		super(K("trust.declined")), this.name = "TrustDeclined";
	}
}, DD = (e) => e instanceof ED, OD = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function kD(e, t, n, r) {
	return [
		`<h3>${S(e)}</h3>`,
		`<p>${S(K("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${S(K("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${S(r)}</pre>`
	].join("");
}
var AD = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function jD(e, t) {
	let n = Cu(e);
	if (!n.length || t && OD(n, Cu(t))) return;
	let r = rm(e);
	if (!await C(kD(K("trust.presetTitle"), K("trust.preset", { name: r }), n.length, AD(n)), K("trust.install"), K("common.cancel"))) throw new ED();
}
async function MD(e, t) {
	let n = Lp(e);
	if (!(!n.length || t && OD(n, Lp(t))) && !await C([
		`<h3>${S(K("trust.qrTitle"))}</h3>`,
		`<p>${S(K("trust.qrBody", {
			name: rm(e),
			n: n.length
		}))}</p>`,
		`<p>${S(K("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${S(AD(n))}</pre>`
	].join(""), K("trust.install"), K("common.cancel"))) throw new ED();
}
async function ND(e) {
	let t = Uf(e);
	if (t.length && !await C(kD(K("trust.modulesTitle"), K("trust.modules", { n: e.length }), t.length, AD(t)), K("trust.import"), K("common.cancel"))) throw new ED();
}
async function PD(e) {
	let t = Nl(e);
	if (!t.length) return !1;
	let n = t.map((t) => nm(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(K("common.listSeparator")), r = await C([
		`<h3>${S(K("trust.uiTitle"))}</h3>`,
		`<p>${S(K("trust.uiBody", {
			name: rm(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${S(K("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${S(AD(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), K("trust.enableUi"), K("trust.notNow"));
	return TD(e, r), r;
}
async function FD(e) {
	Nl(e).length && !wD(e) && await PD(e);
}
//#endregion
//#region src/app/install.ts
var ID = class extends Error {
	constructor(e) {
		super(K("presets.apUpdating", { name: rm(e) })), this.name = "ApUpdating";
	}
}, LD = (e) => e instanceof ID;
function RD(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
var zD = "advancedPreset.pendingInstall";
function BD(e, t) {
	try {
		sessionStorage.setItem(zD, JSON.stringify({
			artifact: e,
			...t ? { source: t } : {}
		}));
	} catch (e) {
		console.warn("[AP] could not keep the preset for after the update", e);
	}
}
async function VD(e, t) {
	let n = dm(e);
	if (!n) throw Error(K("presets.invalid"));
	if (n.minAdvancedPreset && Tu("1.13.0", n.minAdvancedPreset) < 0) throw await lS(n.minAdvancedPreset, rm(n)) ? (BD(n, t), new ID(n)) : Error(K("presets.tooNew", { version: n.minAdvancedPreset }));
	await jD(n, gm(n.id)), await MD(n, gm(n.id)), _m(n), t && (q().sources[n.id] = t), q().declinedUpdates?.[n.id] && delete q().declinedUpdates[n.id], J();
	let r = gm(n.id) ?? n;
	return Ah(r), pm(r.id)?.source === "installed" && await FD(r), await Kh(r), await cD(r), r;
}
async function HD(e) {
	let t = await T(RD(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return t.json();
}
async function UD(e, t = !0) {
	return VD(await HD(e), t ? e.trim() : void 0);
}
async function WD(e) {
	return VD(JSON.parse(await e.text()));
}
function GD(e) {
	if (pm(e)?.source !== "installed") return;
	let t = q().sources[e];
	if (t) return {
		url: t,
		remembered: !0
	};
	let n = gm(e)?.updateUrl;
	return Jd(n) ? {
		url: n.trim(),
		remembered: !1
	} : void 0;
}
async function KD(e) {
	let t = GD(e);
	if (!t) throw Error(K("presets.noSource"));
	return UD(t.url, t.remembered);
}
async function qD() {
	for (let { preset: e } of fm()) {
		let t = GD(e.id);
		if (!t) continue;
		let n;
		try {
			n = dm(await HD(t.url));
		} catch (n) {
			console.warn("[AP] preset update check failed", e.id, t.url, n);
			continue;
		}
		if (!n || n.id !== e.id) console.warn("[AP] the update source does not hold this preset", e.id, t.url);
		else if (!(Tu(n.version, e.version) <= 0 || q().declinedUpdates?.[n.id] === n.hash)) try {
			let e = await VD(n, t.remembered ? t.url : void 0);
			w("success", K("presets.autoUpdated", { version: e.version }), rm(e));
		} catch (t) {
			if (LD(t)) return;
			DD(t) ? (q().declinedUpdates = {
				...q().declinedUpdates,
				[n.id]: n.hash
			}, J(), w("info", t.message, rm(n))) : console.warn("[AP] preset update failed", e.id, t);
		}
	}
}
async function JD() {
	let e = sessionStorage.getItem(zD);
	if (!e) return;
	sessionStorage.removeItem(zD);
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	try {
		let e = await VD(t.artifact, t.source);
		w("success", K("presets.installed"), rm(e));
	} catch (e) {
		if (LD(e)) return;
		DD(e) ? w("info", e.message, K("app.name")) : w("error", e instanceof Error ? e.message : String(e), K("app.name"));
	}
}
function YD() {
	let e = [];
	for (let [t, n] of Object.entries(q().installed)) {
		let r = xm(t), i = dm(n);
		!r || !i || Tu(r.version, i.version) <= 0 || (vm(t), delete q().sources[t], q().declinedUpdates?.[t] && delete q().declinedUpdates[t], e.push(r));
	}
	return e;
}
async function XD(t) {
	if (vm(t), delete q().sources[t], q().declinedUpdates?.[t] && delete q().declinedUpdates[t], J(), bm(t)) {
		let e = gm(t);
		e && (Ah(e), await Kh(e), await cD(e));
		return;
	}
	let n = Wh(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/app/st-preset-io.ts
var ZD = "openai_preset_import_file", QD = "export_oai_preset";
function $D(e) {
	let t = ef(e);
	return typeof t == "object" && !!t && typeof t.id == "string" && Array.isArray(t.entries);
}
var eO = /* @__PURE__ */ new WeakSet();
async function tO(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if ($D(n)) {
		e.value = "";
		try {
			let e = await VD(n);
			await Yh(e), GC(), w("success", K("presets.installed"), rm(e)), ZC("presets");
		} catch (e) {
			DD(e) || LD(e) ? w("info", e.message, K("app.name")) : w("error", e instanceof Error ? e.message : String(e), K("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		eO.add(t), e.dispatchEvent(t);
	}
}
function nO() {
	let e = Vh(), t = e ? gm(e) : void 0;
	return t ? (uD(t).catch((e) => w("error", e instanceof Error ? e.message : String(e), K("app.name"))), !0) : !1;
}
function rO() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== ZD || eO.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), tO(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${QD}`) && nO() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/app/preset-files.ts
var iO = () => e().getPresetManager("openai");
function aO() {
	let e = iO()?.getPresetList();
	return e ? Object.entries(e.preset_names).flatMap(([t, n]) => {
		let r = $d(e.presets[n]);
		return r ? [{
			name: t,
			artifact: r.artifact
		}] : [];
	}) : [];
}
async function oO(e, t) {
	let n = hf(t);
	if (!n) {
		console.warn("[AP] preset file in an unsupported format", e);
		return;
	}
	if (n.minAdvancedPreset && Tu("1.13.0", n.minAdvancedPreset) < 0) {
		await lS(n.minAdvancedPreset, rm(n)) || console.warn("[AP] preset file needs a newer Advanced Preset", e, n.minAdvancedPreset);
		return;
	}
	let r = q().declinedPresetFiles ?? {};
	if (r[e] === n.hash) return;
	let i = gm(n.id);
	if (!i || i.hash !== n.hash && Tu(n.version, i.version) >= 0) try {
		await VD(n);
	} catch (t) {
		DD(t) ? (q().declinedPresetFiles = {
			...r,
			[e]: n.hash
		}, J(), w("info", t.message, rm(n))) : w("error", t instanceof Error ? t.message : String(t), e);
		return;
	}
	let a = gm(n.id), o = iO();
	if (!a || !o) return;
	let s = await Kh(a, { select: o.getSelectedPresetName() === e });
	if (s !== e && await o.deletePreset(e), r[e]) {
		let { [e]: t, ...n } = r;
		q().declinedPresetFiles = n, J();
	}
	GC(), w("success", K("presetFile.adopted", {
		file: e,
		carrier: s
	}), rm(a));
}
var sO = Promise.resolve();
function cO(e) {
	return sO = sO.then(async () => {
		for (let { name: t, artifact: n } of aO()) if (e === void 0 || t === e) try {
			await oO(t, n);
		} catch (e) {
			console.error("[AP] preset file adoption failed", t, e);
		}
	}), sO;
}
function lO() {
	let e = iO()?.getSelectedPresetName();
	e && aO().some((t) => t.name === e) && cO(e);
}
//#endregion
//#region src/app/quick-replies.ts
function uO(e) {
	let t = bh(e), n = (n) => e.actors[n] ? Dd(e, t, n) : void 0, r = tm(e)?.quickReplySets;
	return (e.quickReplySets ?? []).map((e) => ({
		decl: e,
		st: Fp(e, n, r?.[e.id])
	}));
}
function dO(e) {
	let t = JSON.stringify(e), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function fO(e, t) {
	let n = e.getSetByName(t.name);
	if (n) {
		n.disableSend = t.disableSend, n.placeBeforeInput = t.placeBeforeInput, n.injectInput = t.injectInput, n.color = t.color, n.onlyBorderColor = t.onlyBorderColor;
		for (let e of n.qrList) e.unrender?.(), e.unrenderSettings?.();
		n.qrList.splice(0);
		for (let e of t.qrList) n.addQuickReply(G(e));
		n.updateColor?.(), n.rerender?.(), n.save();
	}
}
var pO = /* @__PURE__ */ new Set();
async function mO(e, t, n) {
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
		let n = t.sets.filter(({ st: t }) => !e.getSetByName(t.name) || r[t.name] ? !0 : (pO.has(t.name) || (pO.add(t.name), w("warning", K("quickReplies.conflict", { name: t.name }), K("app.name"))), !1)), a = /* @__PURE__ */ new Set();
		for (let { st: t } of n) e.getSetByName(t.name) || (await e.createSet(t.name, {
			disableSend: t.disableSend,
			placeBeforeInput: t.placeBeforeInput,
			injectInput: t.injectInput
		}), a.add(t.name));
		for (let { st: i } of n) {
			let n = dO(i);
			(a.has(i.name) || r[i.name]?.hash !== n) && (fO(e, i), r[i.name] = {
				presetId: t.presetId,
				hash: n
			}, o = !0);
		}
		for (let { decl: t, st: r } of n) t.global && !i(r.name) && e.addGlobalSet(r.name, t.visible);
	}
	o && J();
}
function hO() {
	let e = W(() => {
		let e = q().enabled ? KC.value : void 0, t = e ? uO(e) : [], n = fm().map((e) => e.preset);
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
		let n = x();
		if (!n) return;
		let { active: r, known: i } = e.value;
		t = t.then(() => mO(n, r, i)).catch((e) => console.error("[AP] Quick Reply sync failed", e));
	}, { immediate: !0 });
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var gO = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b / 1)}}", _O = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.switch.sm{width:1.8em;height:1.05em}.switch.sm .thumb{width:.75em;height:.75em;top:.15em;left:.15em}.switch.sm input:checked~.thumb{transform:translate(.75em)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", vO = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}.storyline-badge svg.lucide.storyline-hidden{color:var(--ap-muted)}", yO = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.tab span{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-groups{gap:var(--ap-space-2);flex-direction:column;display:flex}.um-groups.um-dragging,.um-groups.um-dragging *{cursor:grabbing;-webkit-user-select:none;user-select:none}.um-group{padding:2px var(--ap-space-2) 4px;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:background .15s,border-color .15s;display:flex}.um-group.collapsed{padding-bottom:2px}.um-group.dragging{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.um-group-head{align-items:center;gap:2px;min-height:2.2em;margin-left:-4px;display:flex}.um-group-head>.um-grip{margin-left:0}.um-chevron svg.lucide{transition:transform .15s}.um-chevron.open svg.lucide{transform:rotate(90deg)}.um-group-name{text-overflow:ellipsis;flex:6em;font-weight:600}.um-group-count{background:var(--ap-surface-2);text-align:center;border-radius:999px;flex:none;min-width:1.6em;padding:0 .4em;line-height:1.6}.um-group-switch{flex:none;margin-left:4px}.um-group.off .um-group-name,.um-group.off .um-group-count,.um-group.off .um-list{opacity:.55}.um-group-confirm{align-items:center;gap:2px var(--ap-space-2);padding:4px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 8%, transparent);flex-wrap:wrap;display:flex}.um-group-confirm>span{flex:100%}.um-group-confirm .btn.danger{color:var(--ap-danger)}.um-group .um-list{margin:0 calc(-1 * var(--ap-space-2) + 1px)}.um-group .um-picker{margin:2px 0 4px}.um-drop{min-height:2.4em;margin:0 var(--ap-space-2);border:1px dashed var(--ap-border);border-radius:var(--ap-radius-sm);justify-content:center;align-items:center;display:flex}.um-radio{cursor:pointer;background:0 0;border:0;place-items:center;width:2.2em;height:1.6em;padding:0;display:inline-grid}.um-radio .radio{border:1.5px solid var(--ap-faint);border-radius:50%;place-items:center;width:1.05em;height:1.05em;transition:border-color .15s;display:grid}.um-radio:hover .radio,.um-radio.on .radio{border-color:var(--ap-primary)}.um-radio.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.52em;height:.52em}.um-move{max-width:12em;position:relative;overflow:hidden}.um-move select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry>*,.um-entry-head>*{transition:opacity .15s}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>.switch{margin-right:6px}.um-entry.off .um-entry-head>:not(.switch),.um-entry.off>:not(.um-entry-head){opacity:.55}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text,.um-var-key,.um-var-value{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-text{field-sizing:content;min-height:5.5em;max-height:24em}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:auto 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row>.switch{margin:calc(.375em + 1px) 4px 0 0}.um-var-pair{padding:2px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:2px;display:flex}.um-var-pair-head{align-items:center;gap:2px;margin-right:-6px;display:flex}.um-var-key{text-overflow:ellipsis;flex:auto;min-width:0;font-weight:600}.um-var-row>*,.um-var-pair>*,.um-var-pair-head>*{transition:opacity .15s}.um-var-row.off>:not(.switch),.um-var-pair.off>:not(.um-var-pair-head),.um-var-pair.off .um-var-pair-head>:not(.switch){opacity:.55}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=420px){.tabs.many .tab span{display:none}.tabs.many .tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tabs.many .tab svg.lucide{width:1.35em;height:1.35em}}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:calc(2.51429em + 8px)}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storylines-head{gap:var(--ap-space-2);min-height:1.6em;padding:0 var(--ap-space-1) 0 var(--ap-space-3)}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-card.hidden .card-title{color:var(--ap-muted)}.storyline-dot{background:var(--ap-primary);border-radius:50%;flex:none;width:.5em;height:.5em}.storyline-flag{width:1.05em;height:1.05em;color:var(--ap-faint);flex:none}.storyline-toolbar{margin-bottom:var(--ap-space-1);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);align-self:flex-start;align-items:center;gap:2px;padding:2px;display:flex}.storyline-toolbar .icon-btn[aria-pressed=true]{background:var(--ap-tint)}.storyline-toolbar.solo{padding:0}.storyline-toolbar.solo .icon-btn.sm{width:calc(1.6em - 2px);height:calc(1.6em - 2px)}.storyline-toolbar-sep{background:var(--ap-border);align-self:stretch;width:1px;margin:3px 2px}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", bO = ".media-conn{gap:var(--ap-space-3)}.media-advanced{gap:var(--ap-space-3);flex-direction:column;display:flex}.media-advanced-toggle{color:var(--ap-muted);align-self:flex-start;gap:4px}.media-refs{gap:var(--ap-space-2)}.media-ref{align-items:center;gap:var(--ap-space-2);min-width:0;display:flex}.media-ref-group{gap:var(--ap-space-2)}.media-ref-group-title{color:var(--ap-muted);font-size:.85em;font-weight:600}.media-ref-thumb{object-fit:cover;border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);flex:none;width:2.6em;height:2.6em}.blob-placeholder{background:var(--ap-surface-2);display:inline-block}.image-card{gap:var(--ap-space-2);display:grid}.image-card.multi{grid-template-columns:repeat(auto-fill,minmax(min(100%,14em),1fr))}.image-figure{flex-direction:column;gap:4px;min-width:0;margin:0;display:flex}.image-frame{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);position:relative;overflow:hidden}.image-frame.empty{border:1px dashed var(--ap-border);background:0 0;max-height:22em}.image-open{cursor:zoom-in;background:0 0;border:0;width:100%;padding:0;display:block}.image-open img{object-fit:contain;width:100%;height:auto;max-height:70vh;display:block}.image-empty{justify-content:center;align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3);text-align:center;flex-direction:column;display:flex;position:absolute;inset:0}.image-empty>svg.lucide{width:1.6em;height:1.6em}.image-prompt{-webkit-line-clamp:6;white-space:pre-wrap;-webkit-box-orient:vertical;max-height:100%;margin:0;display:-webkit-box;overflow:hidden}.image-busy{justify-content:center;align-items:center;gap:var(--ap-space-2);color:var(--ap-text);background:color-mix(in srgb, var(--ap-panel-bg-solid) 70%, transparent);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:flex;position:absolute;inset:0}.image-pager{border-radius:var(--ap-radius-pill);color:#fff;background:#00000073;align-items:center;gap:2px;padding:0 4px;display:flex;position:absolute;bottom:6px;right:6px}.image-pager .icon-btn{color:inherit}.image-foot{align-items:center;gap:var(--ap-space-2);min-height:1.9em;display:flex}.image-error{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.image-tools{flex:none}.image-panel{gap:var(--ap-space-3)}@media (max-width:600px){.image-panel{gap:var(--ap-space-2)}.image-versions{grid-template-columns:repeat(auto-fill,minmax(5.5em,1fr))}}.image-panel-prompt{resize:vertical;field-sizing:content;min-height:5em;max-height:40vh}.image-panel-ref{cursor:pointer}.image-panel-row{align-items:flex-start;gap:var(--ap-space-2);flex-wrap:nowrap}.image-panel-row>.field:first-child{flex:none}.image-panel-row>.field.grow{flex:auto;min-width:0}.image-versions{gap:var(--ap-space-2);grid-template-columns:repeat(auto-fill,minmax(7em,1fr));display:grid}.image-version{flex-direction:column;gap:2px;min-width:0;display:flex}.image-version-pick{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);cursor:pointer;aspect-ratio:1;border:2px solid #0000;padding:0;display:block;overflow:hidden}.image-version-pick img,.image-version-pick .blob-placeholder{object-fit:cover;width:100%;height:100%;display:block}.image-version.on .image-version-pick{border-color:var(--ap-primary)}.image-version-tools{justify-content:space-between;display:flex}.image-panel-status{align-items:center}.image-panel-actions{flex-wrap:nowrap}.image-panel-actions>.btn{white-space:nowrap;flex:none}.image-panel-restore{margin-inline-end:auto}.image-viewer{color:#fff;background:0 0;border:0;flex-direction:column;justify-content:center;align-items:center;width:100vw;max-width:100vw;height:100vh;max-height:100vh;margin:0;padding:0;display:flex}.image-viewer:not([open]){display:none}.image-viewer::backdrop{background:#000000d1}.image-viewer-img{object-fit:contain;-webkit-user-select:none;user-select:none;max-width:96vw;max-height:calc(100vh - 4.5em)}.image-viewer-bar{align-items:center;gap:var(--ap-space-2);width:min(96vw,60em);padding:var(--ap-space-2);display:flex}.image-viewer-bar .icon-btn{color:#fff}.image-viewer-caption{opacity:.85}.media-dialog-layer{top:var(--topBarBlockSize,0px);height:calc(100dvh - var(--topBarBlockSize,0px));z-index:2147481000;overscroll-behavior:contain;background:#00000073;place-items:center;padding:1em;display:grid;position:fixed;left:0;right:0}.media-dialog{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);width:min(44em,100%);max-height:100%;color:var(--ap-text);background:var(--ap-panel-bg-solid);box-shadow:var(--ap-shadow);outline:none;flex-direction:column;display:flex;overflow:hidden}.media-dialog-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-2) var(--ap-space-2) var(--ap-space-2) var(--ap-space-3);border-bottom:1px solid var(--ap-border);display:flex}.media-dialog-body{min-height:0;padding:var(--ap-space-3);flex:auto;overflow:auto}@media (max-width:600px){.media-dialog-layer{padding:0}.media-dialog{border:0;border-top:1px solid var(--ap-border);width:100%;height:100%;box-shadow:none;border-radius:0}}.speech-card{align-items:center;gap:var(--ap-space-2);min-height:2em;padding:0 var(--ap-space-1,4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--ap-primary) 5%, transparent);display:flex}.speech-track{flex:auto;align-items:center;gap:2px;min-width:3em;height:1.4em;display:flex}.speech-seg{background:var(--ap-border);cursor:pointer;border:0;border-radius:2px;flex:1 1 0;min-width:3px;height:4px;padding:0;transition:height .12s,background .12s}.speech-seg.narration{opacity:.6}.speech-seg.ready{background:color-mix(in srgb, var(--ap-primary) 45%, transparent)}.speech-seg.loading{background:color-mix(in srgb, var(--ap-primary) 30%, transparent);animation:1.2s ease-in-out infinite ap-pulse}.speech-seg.error{background:var(--ap-danger)}.speech-seg.on{background:var(--ap-primary);opacity:1;height:8px}.speech-seg:hover{height:8px}.speech-who{flex:0 auto;max-width:8em}.speech-panel{gap:var(--ap-space-2);flex-direction:column;display:flex}.speech-panel-bar{flex-wrap:wrap;align-items:center;gap:4px;display:flex}.speech-panel-bar>.btn{margin-right:4px}.speech-panel-format{align-items:center;gap:4px;margin:0;display:flex}.speech-panel-list{gap:var(--ap-space-2);flex-direction:column;margin:0;padding:0;list-style:none;display:flex}.speech-panel-seg{padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);flex-direction:column;gap:4px;transition:border-color .15s,background .15s;display:flex}.speech-panel-seg.narration{background:var(--ap-surface-2)}.speech-panel-seg.playing{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.speech-panel-seg.error{border-color:color-mix(in srgb, var(--ap-danger) 45%, transparent)}.speech-panel-head{align-items:center;gap:var(--ap-space-2);min-width:0;margin-left:-4px;display:flex}.speech-panel-who{flex:0 auto;max-width:12em}.speech-panel-state{flex:none}.speech-panel-display{white-space:pre-wrap;margin:0}.speech-panel-text{field-sizing:content;min-height:2.6em;max-height:14em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.speech-panel-seg.edited .speech-panel-text{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.speech-panel-actions{justify-content:flex-end;align-items:center;gap:4px;min-height:1.9em;display:flex}.speech-panel-head>.icon-btn:last-child{margin-right:-4px}.speech-panel-edited{background:var(--ap-primary);border-radius:50%;flex:none;width:6px;height:6px}@media (max-width:600px){.speech-panel-voice{display:none}.speech-panel-head>.speech-panel-who{flex:auto;max-width:none}}.speech-panel-actions .btn{min-height:1.9em;font-size:var(--ap-font-size-sm);padding:0 .8em}.voice-ask{width:min(26em,100vw - 2em);padding:var(--ap-space-3);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);color:var(--ap-text);background:var(--ap-panel-bg-solid);box-shadow:var(--ap-shadow)}.voice-ask::backdrop{background:#0006}.speech-binding{align-items:flex-start;gap:var(--ap-space-2);min-width:0;display:flex}.speech-binding>.input:first-child{flex:0 9em;min-width:5em}.speech-voice{flex:auto;align-items:center;gap:4px;min-width:0;display:flex}.speech-voice>.input{flex:auto;min-width:0}.voice-menu{z-index:2147482000;border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-panel-bg-solid);max-height:min(16em,50vh);color:var(--ap-text);box-shadow:var(--ap-shadow);margin:0;padding:4px;position:fixed;inset:0 auto auto 0;overflow:auto}.voice-option{align-items:center;gap:var(--ap-space-2);min-height:2em;padding:2px var(--ap-space-2);border-radius:var(--ap-radius-sm);cursor:pointer;display:flex}.voice-option.on{background:var(--ap-surface-2)}.voice-option .col{gap:0;line-height:1.3}.voice-menu-note{padding:4px var(--ap-space-2);align-items:center;display:flex}.image-open .blob-placeholder{width:100%;min-height:8em;display:block}", xO = /* @__PURE__ */ _n({ mode: "light" }), SO = new CSSStyleSheet();
SO.replaceSync([
	gO,
	_O,
	vO,
	yO,
	bO
].join("\n"));
var CO = new CSSStyleSheet(), wO = [SO, CO], TO = [
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
function EO(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of TO) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function DO(e) {
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
function OO() {
	let e = DO(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var kO = /* @__PURE__ */ new Set();
function AO(e) {
	return kO.add(e), e.dataset.apTheme = xO.mode, () => kO.delete(e);
}
function jO() {
	let e = OO();
	if (e !== xO.mode) {
		xO.mode = e;
		for (let t of kO) t.dataset.apTheme = e;
	}
}
function MO() {
	xO.mode = OO();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(jO);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), yr(() => {
		let e = KC.value?.theme?.[xO.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(EO(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(EO("primary", t.primary)), t.accent && n.push(EO("accent", t.accent)), CO.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function NO(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function PO(e, t, n = []) {
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
			e.adoptedStyleSheets = wO, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = AO(this), this.app = Es(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/annotations/match.ts
var FO = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, IO = /\s/, LO = /[“”„‟〝〞＂「」]/, RO = /[‘’‚‛『』＇]/;
function zO(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!FO.test(i)) {
			if (IO.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else LO.test(i) ? i = "\"" : RO.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var BO = (e) => zO(e).text;
function VO(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function HO(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function UO(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function WO(e, t, n, r = zO(e)) {
	let i = BO(n.quote).trim();
	if (!i) return null;
	let a = VO(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = BO(n.prefix), s = BO(n.suffix), c = 0, l = a.map((t) => {
			let n = HO(e, r.text.slice(Math.max(0, t - e.length), t)) + UO(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = VO(BO(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function GO(e, t, n = !1) {
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
var KO = /* @__PURE__ */ new Set([
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
function qO(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (KO.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = qO(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function JO(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? KO.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && qO(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function YO(e, t, n, r = JO(e)) {
	let i = r.map((e) => e.data), a = i.join(""), o = zO(a), s = [];
	for (let e of n) {
		let n = WO(a, t, e, o);
		n && s.push({
			item: e,
			start: GO(i, n[0]),
			end: GO(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function XO(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var ZO = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function QO(e, t, n) {
	let r = [...e.located].sort((e, t) => ZO(e.start, t.start) ? 1 : ZO(t.start, e.start) ? -1 : 0), i = null;
	for (let a of r) if (!(i && ZO(i, a.end))) {
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
function $O(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/layer.ts
var ek = 0;
function tk(e, t) {
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
var nk = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function rk(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
var ik = class {
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
				let i = [...r.getClientRects()].find((e) => nk(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
				return {
					key: n.key,
					mesId: n.mesId,
					item: n.item,
					rect: tk(i, e.doc),
					doc: e.doc
				};
			}
		}
		for (let r of e.owners.values()) for (let i of r) {
			let r = i.range;
			if (r && !r.collapsed && r.intersectsNode(n)) {
				for (let n of r.getClientRects()) if (nk(n, t.clientX, t.clientY)) return {
					key: i.key,
					mesId: i.mesId,
					item: i.item,
					rect: tk(n, e.doc),
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
			serial: ++ek,
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
				let t = XO(o, e);
				r.highlight.add(t), c.push({
					key: s(e.item),
					mesId: n,
					item: e.item,
					range: t
				});
			}
			else if (i) {
				let e = /* @__PURE__ */ new Map();
				QO(o, this.spec.name, (t, i) => {
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
				for (let e of t) r.add(e.key), e.range && (i.highlight?.delete(e.range), i.on?.delete(e.range)), e.wraps && $O(e.wraps);
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
}, ak = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), ok = /* @__PURE__ */ new Set([
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
]), sk = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function ck(e) {
	return sk(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function lk(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${ck(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${ck(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${ck(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function uk(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = uk(e, t);
			n && i.appendChild(n);
		}
	};
	if (!ak.has(r) && !ok.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = uk(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function dk(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return lk(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", lk(e.textContent));
			continue;
		}
		let t = uk(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function fk(e, t, n, r) {
	return e && tm(e)?.workflows?.[t]?.stages?.[n] || r;
}
function pk(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return NO(e?.actors[t]?.color, n);
}
function mk(e) {
	return W(() => {
		let t = e(), n = YC(t), r = Vx(t, JC(t));
		if (r && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = gm(r.presetId);
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
					label: fk(e, r.workflow, t.id, t.label),
					color: pk(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = gm(n.presetId);
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
				label: fk(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: pk(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var hk = /* @__PURE__ */ _n({
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
}), gk, _k, vk = null;
function yk(t) {
	let n = gm(Km(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = Dd(n, bh(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: pk(n, n.narrator)
	};
}
function bk(e, t) {
	clearTimeout(gk), clearTimeout(_k), _k = void 0, vk = null, hk.key !== e.key && Object.assign(hk, yk(e.mesId), { html: dk(e.ann.comment) }), Object.assign(hk, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), hk.rev++;
}
function xk() {
	clearTimeout(gk), clearTimeout(_k), _k = void 0, vk = null, hk.open && (hk.open = !1, hk.pinned = !1, hk.key = null);
}
function Sk(e) {
	if (!hk.pinned) {
		if (e) {
			if (hk.open && hk.key === e.key) {
				clearTimeout(_k), _k = void 0;
				return;
			}
			if (vk === e.key) return;
			clearTimeout(gk), vk = e.key, gk = setTimeout(() => bk(e, !1), 150);
		} else clearTimeout(gk), vk = null, Tk();
	}
}
function Ck(e) {
	e && !(hk.open && hk.key === e.key) ? bk(e, !0) : xk();
}
function wk() {
	clearTimeout(_k), _k = void 0;
}
function Tk() {
	!hk.open || hk.pinned || _k || (_k = setTimeout(xk, 200));
}
function Ek(e) {
	hk.key && e.has(hk.key) && xk(), vk && e.has(vk) && (clearTimeout(gk), vk = null);
}
//#endregion
//#region src/ui/annotations/paint.ts
var Dk = "#a855f7", Ok = () => null;
function kk(e) {
	Ok = e;
}
function Ak(e) {
	let t = Ok();
	return !!(t && e.composedPath().includes(t));
}
var jk = "ap-anno", Mk = new ik({
	name: jk,
	priority: 1,
	css() {
		let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
		return `:root { --ap-anno-color: ${Dk}; }
::highlight(${jk}) { ${e} }
${jk} { ${e} text-decoration-skip-ink: none; cursor: help; }`;
	},
	id: (e) => e.id,
	move: (e) => Sk(e && {
		key: e.key,
		mesId: e.mesId,
		ann: e.item,
		rect: e.rect
	}),
	click(e, t) {
		t === "mouse" ? e || xk() : Ck(e && {
			key: e.key,
			mesId: e.mesId,
			ann: e.item,
			rect: e.rect
		});
	},
	scroll: xk,
	leave: () => Sk(null),
	ignore: Ak,
	forget: Ek
});
function Nk(e) {
	e !== Dk && (Dk = e, Mk.restyle());
}
var Pk = () => Dk, Fk = (e) => Mk.watch(e), Ik = "ap-speech", Lk = "data-ap-speech-hover", Rk = new ik({
	name: Ik,
	priority: 0,
	css() {
		let e = Pk(), t = `text-decoration-line: underline; text-decoration-style: solid; text-decoration-color: color-mix(in srgb, ${e} 60%, transparent); text-decoration-thickness: max(1px, 0.07em); text-underline-offset: 0.3em;`, n = `background-color: color-mix(in srgb, ${e} 16%, transparent);`;
		return `::highlight(${Ik}) { ${t} }
::highlight(${Ik}-on) { ${n} }
${Ik} { ${t} text-decoration-skip-ink: none; cursor: pointer; }
${Ik}[data-on] { ${n} }
html[${Lk}], html[${Lk}] * { cursor: pointer !important; }`;
	},
	id: (e) => e.id,
	move(e, t) {
		t.documentElement.toggleAttribute(Lk, !!e);
	},
	leave() {
		document.documentElement.removeAttribute(Lk);
	},
	click(e, t, n) {
		e && (e.doc.getSelection()?.toString() || (n.preventDefault(), NE(e.mesId, e.item.id)));
	}
}), zk = 6, Bk = 8;
function Vk(e, t, n, r = "center", i = !1) {
	let a = e.top - zk - t.height >= Bk, o = e.bottom + zk + t.height <= n.height - Bk, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - zk - t.height : e.bottom + zk;
	c = Math.max(Bk, Math.min(c, n.height - Bk - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(Bk, Math.min(l, n.width - Bk - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function Hk(e) {
	let t = !1, n = !1, r = !1, i = () => {
		e.value = t || n || r;
	};
	return {
		onPointerenter: (e) => {
			e.pointerType === "mouse" && (t = !0, i());
		},
		onPointerleave: () => {
			t = !1, i();
		},
		onFocusin: (e) => {
			n = e.target?.matches?.(":focus-visible") === !0, i();
		},
		onFocusout: () => {
			n = !1, r = !1, i();
		},
		toggle: () => {
			r = !e.value, i();
		}
	};
}
function Uk(e, t) {
	let n = /* @__PURE__ */ A(!1), r = /* @__PURE__ */ A(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = Vk(n.getBoundingClientRect(), o, a, t().align, t().below);
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
		await tr();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), ei(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var Wk = {
	key: 0,
	class: "anno-author"
}, Gk = ["innerHTML"], Kk = /* @__PURE__ */ F({
	__name: "AnnoBubble",
	setup(e) {
		let t = /* @__PURE__ */ A(null);
		function n() {
			let e = t.value;
			if (!e) return;
			let n = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			e.style.maxWidth = `${Math.min(320, n.width - 16)}px`, e.style.left = "0px", e.style.top = "0px";
			let r = e.getBoundingClientRect(), i = hk.rect, a = Vk(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return P(() => hk.open && hk.rev, async (e) => {
			if (!e) return;
			await tr();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), ei(() => {
			hk.open = !1;
		}), (e, n) => j(hk).open ? (R(), z("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Ve({ "--actor": j(hk).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => j(wk) && j(wk)(...e),
			onMouseleave: n[1] ||= (...e) => j(Tk) && j(Tk)(...e)
		}, [j(hk).author ? (R(), z("div", Wk, k(j(hk).author), 1)) : U("", !0), V("div", {
			class: "rich anno-text",
			innerHTML: j(hk).html
		}, null, 8, Gk)], 36)) : U("", !0);
	}
}), qk = /* @__PURE__ */ new Set();
function Jk(e) {
	return sE(e).length ? jw(e).filter((e) => !e.orphan) : [];
}
function Yk(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var Xk = () => q().ui.annotations?.show !== !1, Zk = class {
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
		}), qk.add(this), this.schedule(0);
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
		Mk.clear(this, e), Rk.clear(this, e);
	}
	refresh() {
		if (this.disposed) return;
		if (!this.el.isConnected) {
			this.clear();
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = Lx.current, i = r?.status === "running" && r.mesId === t, a = !(!n || n.is_user || i), o = a && Xk() ? Tw(t).filter((e) => !e.orphan) : [], s = a ? Jk(t) : [], c = n?.mes ?? "", l = (e, n, r, i, a) => e.paint(this, r, t, n.length ? () => YO(i, c, n) : null, a);
		l(Mk, o, document, this.el, !rk(document)), l(Rk, s, document, this.el, !rk(document));
		for (let e of this.frames.values()) {
			let t = e.doc;
			if (!t?.body || !t.defaultView) continue;
			let n = Yk(t);
			l(Mk, n ? [] : o, t, t.body, !1), l(Rk, n ? [] : s, t, t.body, !1), e.observer?.takeRecords();
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), this.clear(), qk.delete(this);
		}
	}
};
function Qk(e, t) {
	for (let n of qk) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function $k() {
	for (let e of qk) e.hasFrames && e.schedule(0);
}
function eA() {
	for (let e of qk) e.el.isConnected || e.dispose();
}
var tA = /* @__PURE__ */ new WeakMap();
function nA(e) {
	let t = tA.get(e);
	(!t || t.disposed) && tA.set(e, new Zk(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var rA = () => window.__TAURITAVERN__?.api?.chatSurface, iA = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return rA()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), aA = !1;
function oA() {
	let t = rA();
	!aA && t && iA() && (t.protocolVersion === 1 ? (aA = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new Zk(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function sA(e, t) {
	t && !iA() && nA(e);
}
var cA = null;
function lA() {
	return (!cA || !cA.isConnected) && (cA = document.createElement("ap-anno-bubble"), document.body.append(cA)), cA;
}
function uA() {
	PO("ap-anno-bubble", Kk), lA(), kk(() => cA), Fk(document), yr(() => {
		let e = q().ui, t = KC.value?.theme?.[xO.mode]?.accent;
		Nk(e.annotations?.color || e.accent || t || (xO.mode === "dark" ? "#c084fc" : "#9333ea")), Rk.restyle();
	}), P(() => {
		let e = OS().speech;
		return [
			e.enabled,
			e.active,
			e.narrator,
			e.connections.length
		];
	}, () => Qk(void 0, 0)), P(() => X.playing && `${X.playing.mesId}:${X.playing.segId}`, () => {
		let e = X.playing;
		Rk.mark(e ? (t, n) => t === e.mesId && n.id === e.segId : null);
	}), Pw.on("change", (e) => Qk(e)), P(Xk, () => {
		xk(), Qk(void 0, 0);
	}), P(() => Lx.current?.status, () => Qk()), Ow.on("change", (e) => Qk(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		xk(), eA();
	});
	t.on("message_iframe_render_ended", () => $k()), addEventListener("resize", () => xk());
}
//#endregion
//#region src/ui/storylines.ts
var dA = W(() => {
	Y.chatRev;
	let e = KC.value;
	return !!(e && qv(e, bh(e)));
}), fA = null;
function pA() {
	let t = e().chat ?? [];
	return (!fA || fA.rev !== Y.chatRev || fA.chat !== t || fA.len !== t.length) && (fA = {
		rev: Y.chatRev,
		chat: t,
		len: t.length,
		keys: Xv(t)
	}), fA.keys;
}
var mA = () => {
	fA = null;
}, hA = 60, gA = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > hA ? `${t.slice(0, hA)}…` : t;
};
function _A(t) {
	Y.chatRev;
	let n = e().chat ?? [], r = pA(), i = Jv(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? Km(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: gA(s?.event || Im(o))
			});
		}), {
			key: e,
			name: jm(e, i),
			main: e === "",
			if: km(e, i),
			hidden: Am(e, i),
			pending: Tm(e),
			current: e === o,
			floors: a
		};
	}).filter((e) => e.main || e.floors.length);
}
async function vA(t) {
	let n = e(), r = document.querySelector(`#chat > .mes[mesid="${t}"]`);
	r ? r.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}) : n.executeSlashCommandsWithOptions && await n.executeSlashCommandsWithOptions(`/chat-jump ${t}`, { handleExecutionErrors: !0 });
}
//#endregion
//#region src/ui/storyline-tag.ts
var yA = "data-ap-storyline-tag", bA = "ap-storyline-tag-hidden";
function xA(e, t, n) {
	let r = e.querySelectorAll(`[${yA}]`);
	if (r.length) {
		for (let e of r) e.classList.toggle(bA, n);
		return;
	}
	if (!n || !t?.is_user) return;
	let i = pd(t.mes);
	if (!i) return;
	let a = t.mes.slice(i.at).trim(), o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = null;
	for (; o.nextNode();) o.currentNode.textContent?.trim() && (s = o.currentNode);
	if (!s) return;
	let c = s.parentElement, l = s.textContent ?? "", u = a.slice(1);
	if (c && c !== e && /^H[1-6]$/.test(c.tagName) && c.textContent?.trim() === u) {
		c.setAttribute(yA, ""), c.classList.add(bA);
		return;
	}
	let d = l.trimEnd();
	if (!d.endsWith(a)) return;
	let f = d.length - a.length, p = s.splitText(f), m = document.createElement("span");
	m.setAttribute(yA, ""), m.className = bA, p.replaceWith(m), m.append(p);
}
//#endregion
//#region src/ui/mounts.ts
var SA = "ap-hidden", CA = [
	"meta-pure",
	"impersonate",
	"summary"
];
function wA(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function TA(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Km(a), s = !!Vx(n, a);
	a && !a.is_user && sA(i, !!(o?.annotations?.length || o?.speech?.length || s));
	let c = dA.value;
	xA(i, a, c);
	let l = !(!a || a.is_user || !o && !s), u = r.querySelector(":scope > ap-stages"), d = r.querySelector(":scope > ap-top-cards"), f = r.querySelector(":scope > ap-cards");
	l ? ((!d || d.nextElementSibling !== i) && (d?.remove(), d = wA("ap-top-cards", n), d.setAttribute("position", "top"), i.before(d)), (!u || u.nextElementSibling !== d) && (u?.remove(), u = wA("ap-stages", n), d.before(u)), (!f || f.previousElementSibling !== i) && (f?.remove(), f = wA("ap-cards", n), i.after(f)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), f.getAttribute("mesid") !== String(n) && f.setAttribute("mesid", String(n)), i.classList.toggle(SA, !!(!s && o && CA.includes(o.turn))), EA(r, i, n, c)) : (u?.remove(), d?.remove(), f?.remove(), i.classList.remove(SA), EA(r, i, n, c));
}
function EA(e, t, n, r) {
	let i = e.querySelector(":scope > ap-storyline");
	if (!r || !pA()[n]) {
		i?.remove();
		return;
	}
	let a = e.querySelector(":scope > ap-stages") ?? e.querySelector(":scope > ap-top-cards") ?? t;
	i ||= wA("ap-storyline", n), i.nextElementSibling !== a && a.before(i), i.getAttribute("mesid") !== String(n) && i.setAttribute("mesid", String(n));
}
function DA(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) TA(t);
}
function OA() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var kA = 0, AA = /* @__PURE__ */ new Set(), jA = !1;
function MA(e) {
	e ? AA.add(e) : jA = !0, !kA && (kA = requestAnimationFrame(() => {
		if (kA = 0, mA(), jA) DA();
		else for (let e of AA) e.isConnected && TA(e);
		AA.clear(), jA = !1, OA(), eA();
	}));
}
function NA() {
	WC(), MA();
}
function PA() {
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
	]) e && t.on(e, NA);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && MA(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && MA(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), MA();
	};
	r(), P(() => dA.value, () => NA());
	let i;
	P(() => Lx.current && Lx.current.status === "running" && Lx.current.streaming && Lx.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = Lx.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (Bx(t, n), clearInterval(i), NA());
		}, 100));
	}), P(() => Lx.current?.status, () => MA());
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var FA = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, IA = (e) => e === "", LA = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), RA = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), zA = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), BA = (e) => {
	let t = zA(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, VA = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, HA = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = VA.width, color: s = VA.stroke, ...c }, { slots: l }) => Za("svg", {
	...VA,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": IA(n) || IA(r) || n === !0 || r === !0 ? Number(i || a || VA["stroke-width"]) * 24 / Number(o) : i || a || VA["stroke-width"],
	class: LA("lucide", c.class, ...e ? [`lucide-${RA(BA(e))}-icon`, `lucide-${RA(e)}`] : ["lucide-icon"]),
	...!l.default && !FA(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Za(...e)), ...l.default ? [l.default()] : []]), Z = (e, t) => (n, { slots: r, attrs: i }) => Za(HA, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), UA = Z("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), WA = Z("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), GA = Z("audio-lines", [
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
]), KA = Z("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), qA = Z("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), JA = Z("brain", [
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
]), YA = Z("bug", [
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
]), XA = Z("cable", [
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
]), ZA = Z("calendar-days", [
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
]), QA = Z("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), $A = Z("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), ej = Z("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]), tj = Z("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), nj = Z("circle-dashed", [
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
]), rj = Z("circle-dot", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "1",
	key: "41hilf"
}]]), ij = Z("circle-question-mark", [
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
]), aj = Z("circle-slash", [["circle", {
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
}]]), oj = Z("clapperboard", [
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
]), sj = Z("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), cj = Z("cloud-fog", [
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
]), lj = Z("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), uj = Z("cloud-rain", [
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
]), dj = Z("cloud-sun", [
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
]), fj = Z("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), pj = Z("code-xml", [
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
]), mj = Z("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), hj = Z("coins", [
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
]), gj = Z("copy-plus", [
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
]), _j = Z("copy", [["rect", {
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
}]]), vj = Z("crown", [["path", {
	d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
	key: "1vdc57"
}], ["path", {
	d: "M5 21h14",
	key: "11awu3"
}]]), yj = Z("database-zap", [
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
]), bj = Z("download", [
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
]), xj = Z("drama", [
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
]), Sj = Z("eye-off", [
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
]), Cj = Z("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), wj = Z("feather", [
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
]), Tj = Z("file-down", [
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
]), Ej = Z("file-headphone", [
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
]), Dj = Z("file-plus", [
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
]), Oj = Z("file-stack", [
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
]), kj = Z("folder-plus", [
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
]), Aj = Z("folder", [["path", {
	d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
	key: "1kt360"
}]]), jj = Z("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), Mj = Z("git-branch", [
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
]), Nj = Z("git-compare-arrows", [
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
]), Pj = Z("globe", [
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
]), Fj = Z("grip-vertical", [
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
]), Ij = Z("hard-drive", [
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
]), Lj = Z("image-off", [
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
]), Rj = Z("image-plus", [
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
]), zj = Z("images", [
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
]), Bj = Z("info", [
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
]), Vj = Z("layers", [
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
]), Hj = Z("layout-template", [
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
]), Uj = Z("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), Wj = Z("list-music", [
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
]), Gj = Z("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Kj = Z("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), qj = Z("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Jj = Z("message-square-dashed", [
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
]), Yj = Z("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), Xj = Z("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), Zj = Z("network", [
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
]), Qj = Z("notebook-pen", [
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
]), $j = Z("package", [
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
]), eM = Z("palette", [
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
]), tM = Z("pause", [["rect", {
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
}]]), nM = Z("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), rM = Z("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), iM = Z("play", [["path", {
	d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
	key: "10ikf1"
}]]), aM = Z("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), oM = Z("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), sM = Z("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), cM = Z("refresh-cw", [
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
]), lM = Z("regex", [
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
]), uM = Z("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), dM = Z("save", [
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
]), fM = Z("scroll-text", [
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
]), pM = Z("server", [
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
]), mM = Z("shapes", [
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
]), hM = Z("sliders-horizontal", [
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
]), gM = Z("sliders-vertical", [
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
]), _M = Z("snowflake", [
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
]), vM = Z("sparkles", [
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
]), yM = Z("split", [
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
]), bM = Z("square", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}]]), xM = Z("sun", [
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
]), SM = Z("text-cursor-input", [
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
]), CM = Z("trash-2", [
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
]), wM = Z("triangle-alert", [
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
]), TM = Z("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), EM = Z("upload", [
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
]), DM = Z("user-pen", [
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
]), OM = Z("user-round", [["circle", {
	cx: "12",
	cy: "8",
	r: "5",
	key: "1hypcn"
}], ["path", {
	d: "M20 21a8 8 0 0 0-16 0",
	key: "rfgkzh"
}]]), kM = Z("volume-2", [
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
]), AM = Z("wand-sparkles", [
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
]), jM = Z("wind", [
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
]), MM = Z("workflow", [
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
]), NM = Z("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), PM = Z("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), FM = /* @__PURE__ */ F({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(null), { open: r, bubble: i } = Uk(n, () => t), a = Hk(r);
		return (t, o) => (R(), z("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onPointerenter: o[0] ||= (...e) => j(a).onPointerenter && j(a).onPointerenter(...e),
			onPointerleave: o[1] ||= (...e) => j(a).onPointerleave && j(a).onPointerleave(...e),
			onFocusin: o[2] ||= (...e) => j(a).onFocusin && j(a).onFocusin(...e),
			onFocusout: o[3] ||= (...e) => j(a).onFocusout && j(a).onFocusout(...e)
		}, [si(t.$slots, "default"), j(r) && e.text ? (R(), z("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : U("", !0)], 544));
	}
}), IM = [
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
		return (t, n) => (R(), B(FM, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: M(() => [V("button", {
				type: "button",
				class: O(["icon-btn", {
					active: e.active || e.pressed,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				"aria-pressed": e.pressed === void 0 ? void 0 : e.pressed,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(R(), B(ri(e.icon)))], 10, IM)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), LM = { class: "col tight" }, RM = { class: "speech-voice" }, zM = ["title"], BM = { class: "ellipsis" }, VM = [
	"value",
	"aria-label",
	"aria-expanded",
	"aria-activedescendant",
	"placeholder"
], HM = ["aria-label"], UM = [
	"id",
	"aria-selected",
	"onMouseenter",
	"onClick"
], WM = { class: "col grow" }, GM = { class: "ellipsis" }, KM = {
	key: 0,
	class: "xs faint ellipsis"
}, qM = {
	key: 0,
	class: "voice-menu-note faint"
}, JM = {
	key: 1,
	class: "voice-menu-note xs text-danger"
}, YM = {
	key: 2,
	class: "voice-menu-note faint small"
}, XM = ["value", "placeholder"], ZM = {
	key: 1,
	class: "speech-voice"
}, QM = 0, $M = /* @__PURE__ */ F({
	__name: "VoicePicker",
	props: {
		connection: {},
		modelValue: {},
		placeholder: {},
		label: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => UT(n.connection)), a = W(() => n.modelValue), o = W(() => a.value?.kind === "voice" ? a.value.name || i.value?.voices.find((e) => e.id === a.value.id)?.name || a.value.id : "");
		function s(e) {
			let t = e.trim();
			if (!t) return r("update:modelValue", null);
			let n = i.value?.voices.find((e) => e.id === t || e.name.toLowerCase() === t.toLowerCase());
			(a.value?.kind !== "voice" || t !== o.value) && r("update:modelValue", {
				kind: "voice",
				id: n?.id ?? t
			});
		}
		let c = `ap-voice-menu-${++QM}`, l = /* @__PURE__ */ A(null), u = /* @__PURE__ */ A(null), d = /* @__PURE__ */ A(!1), f = /* @__PURE__ */ A(null), p = /* @__PURE__ */ A(-1), m = W(() => (f.value ?? "").trim()), h = /* @__PURE__ */ A(!1), g = /* @__PURE__ */ A(null), _ = /* @__PURE__ */ A(""), v = null, y = null, b;
		async function x(e) {
			let t = i.value;
			if (!t?.search || e === v) return;
			y?.abort();
			let r = y = new AbortController();
			v = e, h.value = !0, _.value = "";
			try {
				g.value = await t.search(aE, n.connection, e, r.signal);
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				v = null, _.value = Rw(e);
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
		let C = W(() => {
			let e = m.value.toLowerCase(), t = (i.value?.voices ?? []).filter((t) => !e || `${t.id} ${t.name} ${t.description ?? ""}`.toLowerCase().includes(e)), n = g.value ?? [], r = new Set(n.map((e) => e.id));
			return [...n, ...t.filter((e) => !r.has(e.id))];
		}), ee = W(() => !!i.value?.search), w = W(() => d.value && (C.value.length > 0 || ee.value));
		P(C, () => {
			p.value = -1;
		});
		function T() {
			d.value || (d.value = !0, x(m.value));
		}
		function te(e) {
			f.value = e.target.value, d.value = !0, S();
		}
		function ne() {
			if (f.value === null) return;
			let e = f.value;
			f.value = null, s(e);
		}
		function E() {
			d.value = !1, clearTimeout(b);
		}
		function re() {
			E(), ne();
		}
		function ie(e) {
			if (!d.value) {
				T();
				return;
			}
			let t = C.value.length;
			t && (p.value = (p.value + 1 + e + t + 1) % (t + 1) - 1, tr(() => u.value?.querySelector(".voice-option.on")?.scrollIntoView({ block: "nearest" })));
		}
		function ae(e) {
			if (!e.isComposing) {
				if (e.key === "ArrowDown") e.preventDefault(), ie(1);
				else if (e.key === "ArrowUp") e.preventDefault(), ie(-1);
				else if (e.key === "Enter") {
					e.preventDefault();
					let t = w.value ? C.value[p.value] : void 0;
					t ? oe(t) : (E(), ne());
				} else e.key === "Escape" && (d.value || f.value !== null) && (e.preventDefault(), e.stopPropagation(), d.value ? E() : f.value = null);
			}
		}
		async function oe(e) {
			let t = e.id, a = i.value;
			if (f.value = null, e.owner && a?.adopt) {
				h.value = !0;
				try {
					t = await a.adopt(aE, n.connection, e);
				} catch (e) {
					_.value = Rw(e);
					return;
				} finally {
					h.value = !1;
				}
			}
			E(), r("update:modelValue", {
				kind: "voice",
				id: t,
				name: e.name
			});
		}
		let se = null;
		function ce(e) {
			se?.pause(), e.preview && (se = new Audio(e.preview), se.play().catch(() => void 0));
		}
		function le() {
			let e = l.value, t = u.value;
			if (!e || !t) return;
			let n = e.getBoundingClientRect(), r = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			t.style.width = `${Math.min(Math.max(n.width, 240), r.width - 16)}px`, t.style.left = "0px", t.style.top = "0px";
			let i = t.getBoundingClientRect(), a = Vk(n, i, r, "start", !0);
			t.style.left = `${a.left - i.left}px`, t.style.top = `${a.top - i.top}px`;
		}
		let ue = (e) => {
			u.value?.contains(e.target) || le();
		};
		function de() {
			removeEventListener("scroll", ue, !0), removeEventListener("resize", ue);
		}
		P(w, async (e) => {
			if (!e) return de();
			await tr();
			try {
				u.value && !u.value.matches(":popover-open") && u.value.showPopover?.();
			} catch {}
			le(), addEventListener("scroll", ue, !0), addEventListener("resize", ue);
		}), P([
			C,
			h,
			_
		], () => {
			w.value && tr(le);
		}), ei(() => {
			de(), clearTimeout(b), y?.abort(), se?.pause();
		});
		let D = /* @__PURE__ */ A(null), fe = /* @__PURE__ */ A(null);
		async function pe(e, t) {
			let n = e.target, i = n.files?.[0];
			if (n.value = "", !i) return;
			let o = await BS(i, { prefix: "voice:" }), s = a.value?.kind === "clone" ? a.value : null;
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
			r("update:modelValue", c), RE();
		}
		function me(e) {
			if (a.value?.kind !== "clone") return;
			let { id: t, ...n } = a.value;
			r("update:modelValue", {
				...n,
				text: e.trim() || void 0
			});
		}
		function he() {
			r("update:modelValue", null), RE();
		}
		return (t, n) => (R(), z("div", LM, [V("div", RM, [
			a.value?.kind === "clone" ? (R(), z(L, { key: 0 }, [V("span", {
				class: "chip grow",
				title: a.value.audio
			}, [H(j(Ej), { class: "faint" }), V("span", BM, k(a.value.name || j(K)("media.speech.clone")), 1)], 8, zM), H(Q, {
				icon: j(NM),
				label: j(K)("common.delete"),
				small: "",
				onClick: he
			}, null, 8, ["icon", "label"])], 64)) : (R(), z(L, { key: 1 }, [V("input", {
				ref_key: "input",
				ref: l,
				class: "input",
				role: "combobox",
				autocomplete: "off",
				spellcheck: "false",
				value: f.value ?? o.value,
				"aria-label": e.label,
				"aria-expanded": w.value,
				"aria-controls": c,
				"aria-activedescendant": w.value && p.value >= 0 ? `${c}-${p.value}` : void 0,
				placeholder: e.placeholder ?? (i.value?.voices[0]?.name || j(K)(ee.value ? "media.speech.voiceSearch" : "media.speech.voiceId")),
				onClick: T,
				onBlur: re,
				onInput: te,
				onChange: ne,
				onKeydown: ae
			}, null, 40, VM), w.value ? (R(), z("div", {
				key: 0,
				id: c,
				ref_key: "menu",
				ref: u,
				class: "voice-menu",
				popover: "manual",
				role: "listbox",
				"aria-label": e.label,
				onMousedown: n[0] ||= bs(() => {}, ["prevent"])
			}, [(R(!0), z(L, null, I(C.value, (e, t) => (R(), z("div", {
				id: `${c}-${t}`,
				key: e.id,
				class: O(["voice-option", { on: t === p.value }]),
				role: "option",
				"aria-selected": t === p.value,
				onMouseenter: (e) => p.value = t,
				onClick: (t) => oe(e)
			}, [V("span", WM, [V("span", GM, k(e.name), 1), e.description ? (R(), z("span", KM, k(e.description), 1)) : U("", !0)]), e.preview ? (R(), B(Q, {
				key: 0,
				icon: j(kM),
				label: j(K)("media.speech.test"),
				small: "",
				align: "end",
				onClick: bs((t) => ce(e), ["stop"])
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			])) : U("", !0)], 42, UM))), 128)), h.value ? (R(), z("div", qM, [H(j(Gj), { class: "spin" })])) : _.value ? (R(), z("div", JM, k(_.value), 1)) : C.value.length ? U("", !0) : (R(), z("div", YM, k(j(K)("media.speech.search.none")), 1))], 40, HM)) : U("", !0)], 64)),
			i.value?.clone && a.value?.kind !== "clone" ? (R(), B(Q, {
				key: 2,
				icon: j(GA),
				label: j(K)("media.speech.clone"),
				small: "",
				onClick: n[1] ||= (e) => D.value?.click()
			}, null, 8, ["icon", "label"])) : U("", !0),
			H(Q, {
				icon: j(kM),
				label: j(K)("media.speech.test"),
				small: "",
				align: "end",
				onClick: n[2] ||= (t) => j(FE)(e.connection, e.modelValue)
			}, null, 8, ["icon", "label"]),
			si(t.$slots, "default"),
			V("input", {
				ref_key: "audioInput",
				ref: D,
				type: "file",
				accept: "audio/*",
				hidden: "",
				onChange: n[3] ||= (e) => pe(e, "audio")
			}, null, 544)
		]), a.value?.kind === "clone" ? (R(), z(L, { key: 0 }, [i.value?.clone?.text === "none" ? U("", !0) : (R(), z("input", {
			key: 0,
			class: "input",
			value: a.value.text ?? "",
			placeholder: j(K)("media.speech.clone.text"),
			onChange: n[4] ||= (e) => me(e.target.value)
		}, null, 40, XM)), i.value?.clone?.consent ? (R(), z("div", ZM, [V("button", {
			type: "button",
			class: "btn ghost sm-btn",
			onClick: n[5] ||= (e) => fe.value?.click()
		}, [H(j(Ej)), wa(k(a.value.consent ? j(K)("media.speech.clone.consentSet") : j(K)("media.speech.clone.consent")), 1)]), V("input", {
			ref_key: "consentInput",
			ref: fe,
			type: "file",
			accept: "audio/*",
			hidden: "",
			onChange: n[6] ||= (e) => pe(e, "consent")
		}, null, 544)])) : U("", !0)], 64)) : U("", !0)]));
	}
}), eN = ["aria-label"], tN = { class: "col" }, nN = ["aria-label"], rN = ["value"], iN = { value: "" }, aN = { class: "row end" }, oN = ["disabled"], sN = /* @__PURE__ */ F({
	__name: "VoiceAsk",
	setup(e) {
		let t = /* @__PURE__ */ A(), n = /* @__PURE__ */ A(null), r = /* @__PURE__ */ A("");
		P(() => cN.request, async (e) => {
			n.value = null, r.value = (e?.cards.find((t) => XT(t.name) === XT(e.character)) ?? e?.cards[0])?.key ?? "", e && (await tr(), t.value?.open || t.value?.showModal());
		}, { immediate: !0 }), ei(LE(() => [n.value]));
		function i(e) {
			let i = cN.request;
			if (!i) return;
			t.value?.close();
			let a = n.value ? /* @__PURE__ */ Tn(n.value) : null;
			i.done(e && a ? {
				voice: a,
				...r.value ? { card: r.value } : {}
			} : null);
		}
		return (e, a) => j(cN).request ? (R(), z("dialog", {
			key: 0,
			ref_key: "dialog",
			ref: t,
			class: "voice-ask",
			"aria-label": j(K)("media.speech.ask", { name: j(cN).request.character }),
			onCancel: a[4] ||= bs((e) => i(!1), ["prevent"]),
			onKeydown: a[5] ||= bs(() => {}, ["stop"])
		}, [V("div", tN, [
			V("strong", null, k(j(K)("media.speech.ask", { name: j(cN).request.character })), 1),
			H($M, {
				connection: j(cN).request.conn,
				"model-value": n.value,
				label: j(cN).request.character,
				"onUpdate:modelValue": a[0] ||= (e) => n.value = e
			}, null, 8, [
				"connection",
				"model-value",
				"label"
			]),
			j(cN).request.cards.length ? N((R(), z("select", {
				key: 0,
				"onUpdate:modelValue": a[1] ||= (e) => r.value = e,
				class: "input",
				"aria-label": j(K)("media.speech.scope")
			}, [(R(!0), z(L, null, I(j(cN).request.cards, (e) => (R(), z("option", {
				key: e.key,
				value: e.key
			}, k(e.name), 9, rN))), 128)), V("option", iN, k(j(K)("media.speech.global")), 1)], 8, nN)), [[ps, r.value]]) : U("", !0),
			V("div", aN, [V("button", {
				type: "button",
				class: "btn",
				onClick: a[2] ||= (e) => i(!1)
			}, k(j(K)("common.cancel")), 1), V("button", {
				type: "button",
				class: "btn primary",
				disabled: !n.value,
				onClick: a[3] ||= (e) => i(!0)
			}, k(j(K)("common.save")), 9, oN)])
		])], 40, eN)) : U("", !0);
	}
}), cN = /* @__PURE__ */ _n({ request: null }), lN = (e, t, n) => (document.querySelector("ap-voice-ask") || document.body.append(document.createElement("ap-voice-ask")), new Promise((r) => {
	cN.request = {
		conn: e,
		character: t,
		cards: n,
		done: (e) => {
			cN.request = null, r(e);
		}
	};
}));
function uN() {
	PO("ap-voice-ask", sN), fE(lN);
}
//#endregion
//#region src/ui/media/MediaDialog.vue?vue&type=script&setup=true&lang.ts
var dN = ["aria-label"], fN = { class: "media-dialog-head" }, pN = { class: "grow ellipsis" }, mN = { class: "media-dialog-body" }, hN = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])", gN = /* @__PURE__ */ F({
	__name: "MediaDialog",
	setup(e) {
		let t = /* @__PURE__ */ A();
		function n(e) {
			let n = t.value;
			if (!n) return;
			let r = [...n.querySelectorAll(hN)].filter((e) => e.getClientRects().length > 0);
			if (!r.length) {
				e.preventDefault(), n.focus();
				return;
			}
			let i = n.getRootNode().activeElement, a = r[0], o = r[r.length - 1];
			e.shiftKey && (i === a || i === n) ? (e.preventDefault(), o.focus()) : !e.shiftKey && i === o && (e.preventDefault(), a.focus());
		}
		function r(e) {
			e.stopPropagation(), !e.isComposing && (e.key === "Escape" && !e.defaultPrevented ? (e.preventDefault(), SN()) : e.key === "Tab" && n(e));
		}
		function i(e) {
			e.target !== document.body && e.target !== document.documentElement || e.isComposing || (e.stopPropagation(), e.key === "Escape" ? (e.preventDefault(), SN()) : e.key === "Tab" && (e.preventDefault(), t.value?.focus()));
		}
		function a(e) {
			e.composedPath().some((e) => e instanceof Element && (e.localName === "ap-media-dialog" || e.localName === "dialog" || e.id === "toast-container")) || SN(!1);
		}
		function o(e) {
			let t = e ? addEventListener : removeEventListener;
			t("keydown", i, !0), t("click", a, !0);
		}
		P(() => _N.current?.id, async (e) => {
			o(e !== void 0), e !== void 0 && (await tr(), t.value?.focus({ preventScroll: !0 }));
		}, { immediate: !0 }), ei(() => o(!1));
		let s = !1, c = (e) => {
			s = e.target === e.currentTarget;
		}, l = (e) => {
			s && e.target === e.currentTarget && SN(), s = !1;
		};
		return (e, n) => j(_N).current ? (R(), z("div", {
			key: 0,
			class: "media-dialog-layer",
			onPointerdown: c,
			onClick: l
		}, [V("div", {
			ref_key: "box",
			ref: t,
			class: "media-dialog",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": j(_N).current.title,
			tabindex: "-1",
			onKeydown: r,
			onKeyup: n[2] ||= bs(() => {}, ["stop"])
		}, [V("header", fN, [V("strong", pN, k(j(_N).current.title), 1), H(Q, {
			icon: j(NM),
			label: j(K)("common.close"),
			align: "end",
			onClick: n[0] ||= (e) => j(SN)()
		}, null, 8, ["icon", "label"])]), V("div", mN, [(R(), B(ri(j(_N).current.component), Oa({ key: j(_N).current.id }, j(_N).current.props ?? {}, { onClose: n[1] ||= (e) => j(SN)() }), null, 16))])], 40, dN)], 32)) : U("", !0);
	}
}), _N = /* @__PURE__ */ _n({ current: null }), vN = 0, yN = null;
function bN() {
	let e = document.activeElement;
	for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
	return e instanceof HTMLElement ? e : null;
}
function xN(e) {
	document.querySelector("ap-media-dialog") || document.body.append(document.createElement("ap-media-dialog")), _N.current || (yN = bN()), _N.current = {
		...e,
		component: En(e.component),
		id: ++vN
	};
}
function SN(e = !0) {
	if (!_N.current) return;
	_N.current = null;
	let t = yN;
	yN = null, e && t?.isConnected && t.focus({ preventScroll: !0 });
}
function CN() {
	PO("ap-media-dialog", gN);
}
//#endregion
//#region src/ui/entry.ts
var wN = "left-nav-panel", TN = "ap-preset-banner";
function EN() {
	return document.getElementById(wN);
}
function DN() {
	let e = EN();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function ON() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== TN && e.after(document.createElement(TN));
}
var kN = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function AN() {
	P(() => Y.presetId, (e) => {
		for (let t of document.querySelectorAll(kN.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function jN(e) {
	let t = EN();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function MN() {
	let e = EN();
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
function NN() {
	ON(), AN(), MN(), P(() => Y.panelOpen, (e) => {
		e && DN();
	});
	let e = EN();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Y.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region src/ui/message/StageBody.vue?vue&type=script&setup=true&lang.ts
var PN = {
	key: 0,
	class: "patches"
}, FN = { class: "patch-old pre" }, IN = { class: "patch-new pre" }, LN = {
	key: 0,
	class: "patch-status xs"
}, RN = {
	key: 2,
	class: "faint small stage-empty"
}, zN = /* @__PURE__ */ F({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(null);
		P(() => t.stage.text, async () => {
			if (!t.follow) return;
			await tr();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (R(), z("div", {
			class: "stage-body",
			style: Ve({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (R(), z("div", PN, [(R(!0), z(L, null, I(e.stage.patches, (e, t) => (R(), z("div", {
			key: t,
			class: O(["patch", { failed: r(e.status) }])
		}, [
			V("div", FN, k(e.old_string), 1),
			H(j(UA), { class: "patch-arrow" }),
			V("div", IN, k(e.new_string), 1),
			r(e.status) ? (R(), z("div", LN, [H(j(KA)), wa(k(j(K)(`patch.${e.status}`)), 1)])) : U("", !0)
		], 2))), 128))])) : e.stage.text ? (R(), z("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, k(e.stage.text), 513)) : (R(), z("div", RN, k(j(K)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function BN(t) {
	let n = e().chat[t], r = Km(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), r.speechVersions && (a.speech = i ? r.speechVersions.patched : r.speechVersions.draft), Jm(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), WC();
}
async function VN(t, n, r) {
	let i = e().chat[t], a = Km(i);
	return !i || !a ? !1 : (Jm(t, qm(a, n, r)), WC(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var HN = { class: "stage-bar" }, UN = ["onClick"], WN = { class: "ellipsis" }, GN = {
	key: 0,
	class: "chip stage-chip error"
}, KN = { class: "ellipsis" }, qN = { class: "badge warn" }, JN = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, YN = /* @__PURE__ */ F({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = mk(() => t.mesid), r = /* @__PURE__ */ A(null), i = /* @__PURE__ */ A(!1), a = W(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = W(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = W(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = W(() => o.value.find((e) => e.id === s.value) ?? null);
		P(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: Qj,
			content: wj,
			patch: Nj
		}, d = (e) => e.status === "streaming" ? Gj : e.status === "interrupted" ? aj : e.status === "missing" ? nj : u[e.kind], f = W(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = W(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = W(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${K(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(K("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => j(n) && (o.value.length || j(n).error) ? (R(), z("div", {
			key: 0,
			class: O(["stages", { live: j(n).running }])
		}, [V("div", HN, [
			(R(!0), z(L, null, I(o.value, (e) => (R(), z("button", {
				key: e.id,
				type: "button",
				class: O(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ve({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(R(), B(ri(d(e)), { class: O({ spin: e.status === "streaming" }) }, null, 8, ["class"])), V("span", WN, k(e.label), 1)], 14, UN))), 128)),
			j(n).error ? (R(), z("span", GN, [H(j(wM)), V("span", KN, k(j(n).error), 1)])) : U("", !0),
			r[1] ||= V("span", { class: "grow" }, null, -1),
			f.value.length ? (R(), B(FM, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: M(() => [V("span", qN, [H(j(wM)), wa(k(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			p.value ? (R(), B(Q, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? j(TM) : j(sM),
				label: p.value.patchesApplied ? j(K)("stages.revertDraft") : j(K)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => j(BN)(e.mesid)
			}, null, 8, ["icon", "label"])) : U("", !0),
			j(n).running ? U("", !0) : (R(), B(FM, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: M(() => [V("span", JN, [H(j(Bj))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (R(), B(zN, {
			key: c.value.id,
			stage: c.value,
			follow: j(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : U("", !0)], 2)) : U("", !0);
	}
}), XN = {
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
function ZN(e) {
	let t = XN[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function QN(e, t) {
	return e.flatMap((e, n) => {
		let r = ZN(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var $N = { class: "reply-name xs" }, eP = ["innerHTML"], tP = /* @__PURE__ */ F({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = W(() => dk(t.text));
		return (t, r) => (R(), z("div", {
			class: "reply-card",
			style: Ve({ "--actor": e.color })
		}, [V("div", $N, k(e.name), 1), V("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, eP)], 4));
	}
}), nP = { class: "card mini-card" }, rP = { class: "card-head" }, iP = { class: "card-title" }, aP = { class: "card-body pre" }, oP = /* @__PURE__ */ F({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (R(), z("div", nP, [V("header", rP, [
			H(j(DM), { class: "section-icon" }),
			V("span", iP, k(j(K)("cards.impersonate")), 1),
			V("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => j(yD)(e.text, !1, e.mesid)
			}, [H(j(SM)), wa(k(j(K)("cards.fillInput")), 1)])
		]), V("div", aP, k(e.text), 1)]));
	}
}), sP = ["aria-label"], cP = ["title", "onClick"], lP = { class: "option-label" }, uP = { class: "option-content small muted" }, dP = /* @__PURE__ */ F({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => yD(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
		return (t, r) => (R(), z("div", {
			class: "options-grid",
			role: "list",
			"aria-label": j(K)("cards.options")
		}, [(R(!0), z(L, null, I(e.options, (e, t) => (R(), z("button", {
			key: t,
			type: "button",
			role: "listitem",
			class: "option",
			title: j(K)("cards.optionHint"),
			onClick: (t) => n(e, t)
		}, [V("span", lP, k(e.label), 1), V("span", uP, k(e.content), 1)], 8, cP))), 128))], 8, sP));
	}
}), fP = {
	key: 0,
	class: "memory-ops"
}, pP = { class: "ellipsis" }, mP = ["aria-label", "onClick"], hP = /* @__PURE__ */ F({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = W(() => {
			let e = _h(t.preset), n = e.globalMemory.log;
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
					let r = $m(t), i = r ? eh(e, r) : -1, a = n[i];
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
			e.id !== void 0 && ph(_h(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (R(), z("div", fP, [(R(!0), z(L, null, I(n.value, (e, t) => (R(), B(FM, {
			key: t,
			text: e.op === "delete" ? j(K)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: M(() => [V("span", { class: O(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(R(), B(ri(e.scope === "global" ? j(Pj) : j(qj)), { class: "faint" })),
				V("span", pP, k(e.key), 1),
				(R(), B(ri(e.op === "delete" ? j(CM) : j(rM)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": j(K)("common.undo"),
					onClick: (t) => r(e)
				}, [H(j(TM))], 8, mP)) : U("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : U("", !0);
	}
}), gP = ["aria-label"], _P = /* @__PURE__ */ F({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(null), { open: r, bubble: i } = Uk(n, () => t), a = Hk(r);
		return (t, o) => e.text ? (R(), z("span", {
			key: 0,
			ref_key: "anchor",
			ref: n,
			class: "tip help",
			onPointerenter: o[1] ||= (...e) => j(a).onPointerenter && j(a).onPointerenter(...e),
			onPointerleave: o[2] ||= (...e) => j(a).onPointerleave && j(a).onPointerleave(...e),
			onFocusin: o[3] ||= (...e) => j(a).onFocusin && j(a).onFocusin(...e),
			onFocusout: o[4] ||= (...e) => j(a).onFocusout && j(a).onFocusout(...e)
		}, [V("button", {
			type: "button",
			class: "icon-btn sm",
			"aria-label": e.text,
			onClick: o[0] ||= bs((...e) => j(a).toggle && j(a).toggle(...e), ["stop"])
		}, [H(j(ij))], 8, gP), j(r) ? (R(), z("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : U("", !0)], 544)) : U("", !0);
	}
}), vP = { class: "card-title" }, yP = {
	key: 0,
	class: "card-body"
}, bP = /* @__PURE__ */ F({
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
		let t = /* @__PURE__ */ A(e.open ?? !0);
		return (n, r) => (R(), z("section", { class: O(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [V("header", {
			class: O(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (R(), B(ri(e.icon), {
				key: 0,
				class: "section-icon"
			})) : U("", !0),
			V("span", vP, k(e.title), 1),
			H(_P, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			V("span", {
				class: "row",
				onClick: r[0] ||= bs(() => {}, ["stop"])
			}, [si(n.$slots, "actions")]),
			e.collapsible ? (R(), B(j($A), {
				key: 1,
				class: O(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : U("", !0)
		], 2), !e.collapsible || t.value ? (R(), z("div", yP, [si(n.$slots, "default")])) : U("", !0)], 2));
	}
}), xP = {
	key: 0,
	class: "badge neutral"
}, SP = { class: "pre small" }, CP = /* @__PURE__ */ F({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (R(), B(bP, {
			title: j(K)("cards.recap"),
			icon: j(fM),
			collapsible: "",
			open: !1
		}, {
			actions: M(() => [e.coversUpTo === void 0 ? U("", !0) : (R(), z("span", xP, "#0–" + k(e.coversUpTo), 1))]),
			default: M(() => [V("div", SP, k(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), wP = { class: "synopsis-fields" }, TP = { class: "synopsis-field" }, EP = ["placeholder", "aria-label"], DP = { class: "synopsis-field" }, OP = ["placeholder", "aria-label"], kP = ["placeholder", "aria-label"], AP = ["placeholder", "aria-label"], jP = { class: "synopsis-actions" }, MP = { class: "xs faint grow synopsis-keys" }, NP = {
	type: "submit",
	class: "btn primary sm-btn"
}, PP = { class: "synopsis-head" }, FP = { class: "synopsis-line small" }, IP = {
	key: 0,
	class: "row tight"
}, LP = {
	key: 1,
	class: "row tight"
}, RP = { class: "synopsis-event ellipsis" }, zP = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, BP = /* @__PURE__ */ F({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(!1), o = /* @__PURE__ */ _n({
			time: "",
			location: "",
			event: "",
			summary: ""
		}), s = /* @__PURE__ */ A(), c = /* @__PURE__ */ A(), l = [
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
			a.value = !0, await tr(), f(), s.value?.focus();
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
			onSubmit: bs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= bs(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= bs(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= bs(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= bs(() => {}, ["stop"])
		}, [
			V("div", wP, [V("label", TP, [H(j(sj), { class: "faint" }), N(V("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: j(K)("cards.synopsis.time"),
				"aria-label": j(K)("cards.synopsis.time")
			}, null, 8, EP), [[us, o.time]])]), V("label", DP, [H(j(Kj), { class: "faint" }), N(V("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: j(K)("cards.synopsis.location"),
				"aria-label": j(K)("cards.synopsis.location")
			}, null, 8, OP), [[us, o.location]])])]),
			N(V("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: j(K)("cards.synopsis.event"),
				"aria-label": j(K)("cards.synopsis.event")
			}, null, 8, kP), [[us, o.event]]),
			N(V("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: j(K)("cards.synopsis.summary"),
				"aria-label": j(K)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, AP), [[us, o.summary]]),
			V("div", jP, [
				V("span", MP, k(j(K)("cards.synopsis.keys")), 1),
				V("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, k(j(K)("common.cancel")), 1),
				V("button", NP, [H(j(QA)), wa(k(j(K)("common.save")), 1)])
			])
		], 32)) : (R(), z("div", {
			key: 1,
			class: O(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [V("div", PP, [V("div", FP, [
			e.synopsis.time ? (R(), z("span", IP, [H(j(sj), { class: "faint" }), wa(k(e.synopsis.time), 1)])) : U("", !0),
			e.synopsis.location ? (R(), z("span", LP, [H(j(Kj), { class: "faint" }), wa(k(e.synopsis.location), 1)])) : U("", !0),
			V("span", RP, k(e.synopsis.event), 1)
		]), e.editable ? (R(), z("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= bs(() => {}, ["stop"])
		}, [H(Q, {
			icon: j(rM),
			label: j(K)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : U("", !0)]), i.value && e.synopsis.summary ? (R(), z("div", zP, k(e.synopsis.summary), 1)) : U("", !0)], 2));
	}
}), VP = { class: "status-fields" }, HP = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], UP = { class: "synopsis-actions" }, WP = { class: "xs faint grow synopsis-keys" }, GP = {
	type: "submit",
	class: "btn primary sm-btn"
}, KP = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, qP = { class: "status-line" }, JP = {
	key: 0,
	class: "row tight"
}, YP = {
	key: 1,
	class: "row tight"
}, XP = {
	key: 2,
	class: "row tight status-location"
}, ZP = { class: "ellipsis" }, QP = {
	key: 3,
	class: "row tight"
}, $P = /* @__PURE__ */ F({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ _n({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ A(), s = (e) => (n.status[e] ?? "").trim(), c = W(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, lj],
			[/雪|snow|sleet|blizzard/i, _M],
			[/雨|rain|drizzle|shower/i, uj],
			[/雾|霾|fog|mist|haze|smog/i, cj],
			[/风|wind|gale|breez/i, jM],
			[/阴|云|cloud|overcast/i, fj],
			[/夜|月|night|moon/i, Xj],
			[/晴|sun|clear|fair/i, xM]
		], u = W(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? dj), d = () => Object.fromEntries(qc.map((e) => [e, a[e].trim()])), f = W(() => qc.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of qc) a[e] = n.status[e] ?? "";
			i.value = !0, await tr(), o.value?.querySelector("input")?.focus();
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
			date: ZA,
			weekday: ZA,
			time: sj,
			location: Kj,
			weather: dj
		};
		return (t, n) => i.value ? (R(), z("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: bs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= bs(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= bs(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= bs(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= bs(() => {}, ["stop"])
		}, [V("div", VP, [(R(!0), z(L, null, I(j(qc), (e) => (R(), z("label", {
			key: e,
			class: "synopsis-field"
		}, [(R(), B(ri(_[e]), { class: "faint" })), N(V("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: j(K)(`cards.status.${e}`),
			"aria-label": j(K)(`cards.status.${e}`)
		}, null, 8, HP), [[us, a[e]]])]))), 128))]), V("div", UP, [
			V("span", WP, k(j(K)("cards.status.keys")), 1),
			V("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, k(j(K)("common.cancel")), 1),
			V("button", GP, [H(j(QA)), wa(k(j(K)("common.save")), 1)])
		])], 544)) : (R(), z("div", KP, [V("div", qP, [
			c.value ? (R(), z("span", JP, [H(j(ZA), { class: "faint" }), wa(k(c.value), 1)])) : U("", !0),
			s("time") ? (R(), z("span", YP, [H(j(sj), { class: "faint" }), wa(k(s("time")), 1)])) : U("", !0),
			s("location") ? (R(), z("span", XP, [H(j(Kj), { class: "faint" }), V("span", ZP, k(s("location")), 1)])) : U("", !0),
			s("weather") ? (R(), z("span", QP, [(R(), B(ri(u.value), { class: "faint" })), wa(k(s("weather")), 1)])) : U("", !0)
		]), e.editable ? (R(), z("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= bs(() => {}, ["stop"])
		}, [H(Q, {
			icon: j(rM),
			label: j(K)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : U("", !0)]));
	}
}), eF = ["innerHTML"], tF = {
	key: 1,
	class: "kv-list small"
}, nF = { class: "pre" }, rF = /* @__PURE__ */ F({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = W(() => typeof t.value == "string" ? dk(t.value) : "");
		return (t, r) => (R(), B(bP, {
			title: e.title,
			icon: j(mM),
			collapsible: "",
			open: !1
		}, {
			default: M(() => [typeof e.value == "string" ? (R(), z("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, eF)) : (R(), z("dl", tF, [(R(!0), z(L, null, I(e.value, (e, t) => (R(), z(L, { key: t }, [V("dt", null, k(t), 1), V("dd", nF, k(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), iF = /* @__PURE__ */ new Map();
function aF(e) {
	let t = iF.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => iF.delete(e)), iF.set(e, t);
	}
	return t;
}
function oF(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function sF(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var cF = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function lF(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = ou(e.code, cF(r));
			t.replaceChildren(...[sF(e.style)].filter((e) => !!e));
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
	let i = oF(await aF(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[sF(e.style)].filter((e) => !!e)), a = await i(t, r);
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
var uF = { class: "structure-component" }, dF = ["data-structure"], fF = {
	key: 0,
	class: "xs"
}, pF = /* @__PURE__ */ F({
	__name: "ComponentCard",
	props: {
		component: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(), r = /* @__PURE__ */ A(""), i = null, a = Promise.resolve(), o = !0, s = (e) => {
			a = a.then(async () => {
				if (o) try {
					await e(), r.value = "";
				} catch (e) {
					r.value = e instanceof Error ? e.message : String(e), console.error("[Advanced Preset] structure component", t.component.id, e);
				}
			});
		};
		return Qr(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await lF(t.component, r, t.context);
			});
		}), P(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), P(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await lF(e, r, t.context));
		})), ei(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (R(), z("div", uF, [V("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, dF), r.value ? (R(), z("div", fF, k(j(K)("cards.custom.error", { error: r.value })), 1)) : U("", !0)]));
	}
}), mF = { class: "speech-panel" }, hF = {
	key: 0,
	class: "muted small"
}, gF = {
	key: 1,
	class: "muted small"
}, _F = { class: "speech-panel-bar" }, vF = { class: "grow xs muted ellipsis speech-panel-meta" }, yF = {
	key: 0,
	class: "speech-panel-format xs muted"
}, bF = { class: "speech-panel-list" }, xF = ["data-seg"], SF = { class: "speech-panel-head" }, CF = ["title"], wF = ["title", "aria-label"], TF = ["title"], EF = {
	key: 0,
	class: "speech-panel-display small muted"
}, DF = [
	"value",
	"aria-label",
	"onInput",
	"onKeydown"
], OF = {
	key: 1,
	class: "speech-panel-actions"
}, kF = ["onClick"], AF = ["onClick"], jF = /* @__PURE__ */ F({
	__name: "SpeechPanel",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = W(() => oE()), r = W(() => (Y.chatRev, sE(t.mesid))), i = W(() => n.value ? UT(n.value) : void 0), a = W(() => i.value?.format ?? "");
		P(() => r.value.map((e) => e.id + e.text).join("\n"), () => {
			DE(r.value);
		}, { immediate: !0 });
		let o = W(() => r.value.map((e) => EE(e))), s = W(() => !!X.generating[t.mesid]), c = W(() => o.value.length > 0 && o.value.every((e) => e === "ready")), l = W(() => o.value.some((e) => e === "ready" || e === "error")), u = W(() => X.playing?.mesId === t.mesid ? X.playing : null), d = W(() => !!u.value?.all), f = (e) => u.value?.segId === e.id, p = (e, t) => f(e) ? "playing" : o.value[t] ?? "none";
		function m(e) {
			return e === void 0 ? K("media.speech.panel.noVoice") : e === null ? i.value?.voices[0]?.name ?? K("media.speech.providerDefault") : e.kind === "voice" ? e.name || i.value?.voices.find((t) => t.id === e.id)?.name || e.id : e.name || K("media.speech.clone");
		}
		let h = (e) => n.value ? m($T(n.value, e, zC().map((e) => e.key))) : "", g = (e) => e.character || K("media.speech.narration"), _ = /* @__PURE__ */ _n({});
		P(() => r.value.map((e) => e.id), (e) => {
			for (let t of Object.keys(_)) e.includes(t) || delete _[t];
		});
		let v = (e) => _[e.id] ?? e.text, y = (e) => e.id in _ && _[e.id].trim() !== e.text;
		function b(e, t) {
			_[e.id] = t.target.value;
		}
		async function x(e) {
			let n = _[e.id];
			delete _[e.id], n !== void 0 && await cE(t.mesid, e.id, n);
		}
		let S = (e) => {
			delete _[e.id];
		};
		async function C(e) {
			delete _[e.id], await cE(t.mesid, e.id, "");
		}
		async function ee(e) {
			await HE(t.mesid, [e.id]), await BE(t.mesid, e.id);
		}
		function w(e, t) {
			t.key === "Enter" && (t.ctrlKey || t.metaKey) ? (t.preventDefault(), x(e)) : t.key === "Escape" && y(e) && (t.preventDefault(), t.stopPropagation(), S(e));
		}
		function T() {
			d.value ? jE() : PE(t.mesid);
		}
		async function te() {
			let e = await VE(t.mesid);
			e && tD(e, `speech-${t.mesid}.wav`);
		}
		return (t, i) => (R(), z("div", mF, [n.value ? r.value.length ? (R(), z(L, { key: 2 }, [
			V("div", _F, [
				V("button", {
					type: "button",
					class: O(["btn", { primary: !d.value }]),
					onClick: T
				}, [(R(), B(ri(d.value && !j(X).paused ? j(tM) : j(iM)))), V("span", null, k(d.value && !j(X).paused ? j(K)("media.speech.pause") : j(K)("media.speech.panel.playAll")), 1)], 2),
				u.value ? (R(), B(Q, {
					key: 0,
					icon: j(bM),
					label: j(K)("media.speech.stop"),
					small: "",
					onClick: i[0] ||= (e) => j(AE)()
				}, null, 8, ["icon", "label"])) : U("", !0),
				V("span", vF, k(n.value.name) + " · " + k(j(K)("media.speech.panel.count", { n: r.value.length })), 1),
				c.value ? U("", !0) : (R(), B(Q, {
					key: 1,
					icon: s.value ? j(Gj) : j(vM),
					class: O({ spin: s.value }),
					label: j(K)("media.speech.generateAll"),
					disabled: s.value,
					small: "",
					onClick: i[1] ||= (t) => j(zE)(e.mesid)
				}, null, 8, [
					"icon",
					"class",
					"label",
					"disabled"
				])),
				l.value ? (R(), B(Q, {
					key: 2,
					icon: j(uM),
					label: j(K)("media.speech.regenerateAll"),
					disabled: s.value,
					small: "",
					onClick: i[2] ||= (t) => j(UE)(e.mesid)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : U("", !0),
				l.value ? (R(), B(Q, {
					key: 3,
					icon: j(CM),
					label: j(K)("media.speech.deleteAll"),
					disabled: s.value,
					danger: "",
					small: "",
					onClick: i[3] ||= (t) => j(HE)(e.mesid)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : U("", !0),
				H(Q, {
					icon: j(bj),
					label: j(K)("media.speech.download"),
					disabled: s.value,
					small: "",
					align: "end",
					onClick: te
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])
			]),
			a.value ? (R(), z("p", yF, [V("span", null, k(j(K)("media.speech.panel.tags")), 1), H(_P, {
				text: a.value,
				align: "start"
			}, null, 8, ["text"])])) : U("", !0),
			V("ol", bF, [(R(!0), z(L, null, I(r.value, (t, n) => (R(), z("li", {
				key: t.id,
				class: O(["speech-panel-seg", [
					t.kind,
					p(t, n),
					{ edited: t.original !== void 0 }
				]]),
				"data-seg": t.id
			}, [
				V("div", SF, [
					H(Q, {
						icon: f(t) && !j(X).paused ? j(tM) : p(t, n) === "loading" ? j(Gj) : j(iM),
						class: O([{ spin: p(t, n) === "loading" && !f(t) }, "speech-panel-play"]),
						label: f(t) && !j(X).paused ? j(K)("media.speech.pause") : j(K)("media.speech.play"),
						active: f(t),
						small: "",
						align: "start",
						onClick: (n) => j(NE)(e.mesid, t.id)
					}, null, 8, [
						"icon",
						"class",
						"label",
						"active",
						"onClick"
					]),
					V("strong", {
						class: "speech-panel-who ellipsis",
						title: h(t)
					}, k(g(t)), 9, CF),
					t.original === void 0 ? U("", !0) : (R(), z("span", {
						key: 0,
						class: "speech-panel-edited",
						title: j(K)("media.speech.panel.edited"),
						"aria-label": j(K)("media.speech.panel.edited")
					}, null, 8, wF)),
					V("span", {
						class: "xs muted ellipsis grow speech-panel-voice",
						title: j(K)("media.speech.panel.voice")
					}, k(h(t)), 9, TF),
					V("span", { class: O(["badge speech-panel-state", {
						neutral: p(t, n) === "none" || p(t, n) === "loading",
						warn: p(t, n) === "error"
					}]) }, k(j(K)(`media.speech.state.${p(t, n)}`)), 3),
					y(t) ? U("", !0) : (R(), z(L, { key: 1 }, [
						t.original === void 0 ? U("", !0) : (R(), B(Q, {
							key: 0,
							icon: j(TM),
							label: j(K)("media.speech.panel.revert"),
							small: "",
							class: "speech-panel-revert",
							onClick: (e) => C(t)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])),
						H(Q, {
							icon: o.value[n] ? j(uM) : j(vM),
							label: o.value[n] ? j(K)("media.speech.regenerateLine") : j(K)("media.speech.panel.generate"),
							disabled: p(t, n) === "loading",
							small: "",
							class: "speech-panel-regen",
							onClick: (r) => o.value[n] ? ee(t) : j(BE)(e.mesid, t.id)
						}, null, 8, [
							"icon",
							"label",
							"disabled",
							"onClick"
						]),
						o.value[n] === "ready" || o.value[n] === "error" ? (R(), B(Q, {
							key: 1,
							icon: j(CM),
							label: j(K)("media.speech.deleteLine"),
							danger: "",
							small: "",
							align: "end",
							class: "speech-panel-delete",
							onClick: (n) => j(HE)(e.mesid, [t.id])
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : U("", !0)
					], 64))
				]),
				t.kind === "speech" && t.display !== v(t) ? (R(), z("p", EF, k(t.display), 1)) : U("", !0),
				V("textarea", {
					class: "input small speech-panel-text",
					rows: "2",
					value: v(t),
					"aria-label": j(K)("media.speech.panel.text", { who: g(t) }),
					spellcheck: "false",
					onInput: (e) => b(t, e),
					onKeydown: (e) => w(t, e)
				}, null, 40, DF),
				y(t) ? (R(), z("div", OF, [V("button", {
					type: "button",
					class: "btn ghost",
					onClick: (e) => S(t)
				}, k(j(K)("common.cancel")), 9, kF), V("button", {
					type: "button",
					class: "btn primary speech-panel-save",
					onClick: (e) => x(t)
				}, k(j(K)("media.speech.panel.save")), 9, AF)])) : U("", !0)
			], 10, xF))), 128))])
		], 64)) : (R(), z("div", gF, k(j(K)("media.speech.panel.empty")), 1)) : (R(), z("div", hF, k(j(K)("media.speech.panel.off")), 1))]));
	}
}), MF = { class: "speech-card" }, NF = ["aria-label"], PF = [
	"aria-label",
	"title",
	"onClick"
], FF = {
	key: 0,
	class: "speech-who xs muted ellipsis"
}, IF = /* @__PURE__ */ F({
	__name: "SpeechCard",
	props: {
		mesid: {},
		segments: {}
	},
	setup(e) {
		let t = e, n = W(() => X.playing?.mesId === t.mesid && X.playing.all ? X.playing : null), r = W(() => X.playing?.mesId === t.mesid ? X.playing.segId : null), i = W(() => t.segments.map((e) => EE(e))), a = W(() => i.value.every((e) => e === "ready")), o = W(() => !!X.generating[t.mesid]), s = W(() => i.value.some((e) => e === "ready" || e === "error")), c = W(() => t.segments.find((e) => e.id === r.value)), l = W(() => c.value ? c.value.character || K("media.speech.narration") : "");
		P(() => t.segments.map((e) => e.id + e.text).join("\n"), () => {
			DE(t.segments);
		}, { immediate: !0 });
		function u() {
			n.value ? jE() : PE(t.mesid);
		}
		let d = () => xN({
			component: jF,
			props: { mesid: t.mesid },
			title: K("media.speech.panel.title")
		});
		async function f() {
			let e = await VE(t.mesid);
			e && tD(e, `speech-${t.mesid}.wav`);
		}
		return (t, p) => (R(), z("div", MF, [
			H(Q, {
				icon: n.value && !j(X).paused ? j(tM) : j(iM),
				label: n.value && !j(X).paused ? j(K)("media.speech.pause") : j(K)("media.speech.play"),
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
				"aria-label": j(K)("media.speech.lines")
			}, [(R(!0), z(L, null, I(e.segments, (t, n) => (R(), z("button", {
				key: t.id,
				type: "button",
				class: O(["speech-seg", [
					i.value[n],
					t.kind,
					{ on: t.id === r.value }
				]]),
				style: Ve({ flexGrow: Math.max(4, Math.min(t.display.length, 160)) }),
				"aria-label": `${t.character || j(K)("media.speech.narration")}: ${t.display}`,
				title: `${t.character || j(K)("media.speech.narration")}: ${t.display}`,
				onClick: (n) => j(PE)(e.mesid, t.id)
			}, null, 14, PF))), 128))], 8, NF),
			l.value ? (R(), z("span", FF, k(l.value), 1)) : U("", !0),
			c.value && !o.value ? (R(), z(L, { key: 1 }, [H(Q, {
				icon: j(uM),
				label: j(K)("media.speech.regenerateLine"),
				small: "",
				onClick: p[0] ||= (t) => j(UE)(e.mesid, c.value.id)
			}, null, 8, ["icon", "label"]), H(Q, {
				icon: j(CM),
				label: j(K)("media.speech.deleteLine"),
				small: "",
				danger: "",
				onClick: p[1] ||= (t) => j(HE)(e.mesid, [c.value.id])
			}, null, 8, ["icon", "label"])], 64)) : U("", !0),
			j(X).playing?.mesId === e.mesid ? (R(), B(Q, {
				key: 2,
				icon: j(bM),
				label: j(K)("media.speech.stop"),
				small: "",
				onClick: p[2] ||= (e) => j(AE)()
			}, null, 8, ["icon", "label"])) : (R(), z(L, { key: 3 }, [a.value ? (R(), B(Q, {
				key: 1,
				icon: j(bj),
				label: j(K)("media.speech.download"),
				small: "",
				onClick: f
			}, null, 8, ["icon", "label"])) : (R(), B(Q, {
				key: 0,
				icon: o.value ? j(Gj) : j(vM),
				class: O({ spin: o.value }),
				label: j(K)("media.speech.generateAll"),
				disabled: o.value,
				small: "",
				onClick: p[3] ||= (t) => j(zE)(e.mesid)
			}, null, 8, [
				"icon",
				"class",
				"label",
				"disabled"
			])), s.value && !o.value ? (R(), z(L, { key: 2 }, [H(Q, {
				icon: j(uM),
				label: j(K)("media.speech.regenerateAll"),
				small: "",
				onClick: p[4] ||= (t) => j(UE)(e.mesid)
			}, null, 8, ["icon", "label"]), H(Q, {
				icon: j(CM),
				label: j(K)("media.speech.deleteAll"),
				small: "",
				danger: "",
				align: "end",
				onClick: p[5] ||= (t) => j(HE)(e.mesid)
			}, null, 8, ["icon", "label"])], 64)) : U("", !0)], 64)),
			H(Q, {
				icon: j(Wj),
				label: j(K)("media.speech.panel.open"),
				small: "",
				align: "end",
				class: "speech-open",
				onClick: d
			}, null, 8, ["icon", "label"])
		]));
	}
}), LF = { class: "field-label" }, RF = { class: "ellipsis" }, zF = {
	key: 0,
	class: "dot modified"
}, BF = { class: "field-control" }, $ = /* @__PURE__ */ F({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (R(), z("div", { class: O(["field", { inline: e.inline }]) }, [V("div", LF, [
			V("span", RF, k(e.label), 1),
			e.modified ? (R(), z("span", zF)) : U("", !0),
			H(_P, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), V("div", BF, [si(t.$slots, "default")])], 2));
	}
}), VF = ["src", "alt"], HF = {
	key: 1,
	class: "blob-placeholder",
	"aria-hidden": "true"
}, UF = /* @__PURE__ */ F({
	__name: "BlobImage",
	props: {
		blobKey: {},
		alt: {}
	},
	emits: ["missing"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A();
		return P(() => n.blobKey, async (e) => {
			i.value = void 0;
			let t = await qS(e).catch(() => void 0);
			e === n.blobKey && (i.value = t, t || r("missing"));
		}, { immediate: !0 }), (t, n) => i.value ? (R(), z("img", {
			key: 0,
			src: i.value,
			alt: e.alt ?? "",
			draggable: "false"
		}, null, 8, VF)) : (R(), z("span", HF));
	}
}), WF = ["aria-label"], GF = { class: "image-viewer-bar" }, KF = { class: "small" }, qF = {
	key: 1,
	class: "small grow ellipsis image-viewer-caption"
}, JF = /* @__PURE__ */ F({
	__name: "ImageViewer",
	props: {
		keys: {},
		start: {},
		caption: {}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(), a = /* @__PURE__ */ A(n.start), o = (e) => {
			let t = n.keys.length;
			a.value = (a.value + e + t) % t;
		};
		Qr(() => i.value?.showModal());
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
			onClick: n[4] ||= bs((e) => i.value?.close(), ["self"]),
			onKeydown: s,
			onTouchstartPassive: n[5] ||= (e) => /* @__PURE__ */ kn(c) ? c.value = e.touches[0]?.clientX ?? null : c = e.touches[0]?.clientX ?? null,
			onTouchend: l
		}, [H(UF, {
			"blob-key": e.keys[a.value],
			alt: e.caption,
			class: "image-viewer-img"
		}, null, 8, ["blob-key", "alt"]), V("div", GF, [
			e.keys.length > 1 ? (R(), z(L, { key: 0 }, [
				H(Q, {
					icon: j(ej),
					label: j(K)("media.image.previous"),
					onClick: n[0] ||= (e) => o(-1)
				}, null, 8, ["icon", "label"]),
				V("span", KF, k(a.value + 1) + " / " + k(e.keys.length), 1),
				H(Q, {
					icon: j(tj),
					label: j(K)("media.image.next"),
					onClick: n[1] ||= (e) => o(1)
				}, null, 8, ["icon", "label"])
			], 64)) : U("", !0),
			e.caption ? (R(), z("span", qF, k(e.caption), 1)) : U("", !0),
			H(Q, {
				icon: j(NM),
				label: j(K)("common.close"),
				align: "end",
				onClick: n[2] ||= (e) => i.value?.close()
			}, null, 8, ["icon", "label"])
		])], 40, WF));
	}
}), YF = {
	key: 0,
	class: "image-panel muted small"
}, XF = [
	"value",
	"aria-label",
	"disabled"
], ZF = ["value"], QF = {
	key: 0,
	class: "xs muted"
}, $F = {
	key: 1,
	class: "col media-refs"
}, eI = {
	key: 0,
	class: "xs muted"
}, tI = ["data-ref"], nI = ["checked", "onChange"], rI = { class: "badge neutral mono" }, iI = { class: "small grow ellipsis" }, aI = ["data-ref"], oI = ["onChange"], sI = { class: "badge neutral mono" }, cI = { class: "xs muted grow" }, lI = { class: "row image-panel-row" }, uI = ["value"], dI = {
	key: 0,
	class: "xs muted"
}, fI = {
	key: 1,
	class: "image-versions"
}, pI = [
	"aria-label",
	"aria-pressed",
	"onClick"
], mI = { class: "image-version-tools" }, hI = {
	key: 1,
	class: "row tight image-panel-status",
	role: "status"
}, gI = { class: "small grow" }, _I = {
	key: 2,
	class: "xs text-danger image-panel-status"
}, vI = { class: "row end tight image-panel-actions" }, yI = ["disabled"], bI = ["disabled"], xI = ["disabled"], SI = /* @__PURE__ */ F({
	__name: "ImagePanel",
	props: {
		mesid: {},
		structure: {},
		index: {}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => YC(n.mesid)), a = i.value?.genId, o = W(() => i.value && i.value.genId === a ? i.value : void 0), s = W(() => {
			let e = o.value;
			return e ? nw(gm(e.presetId)).flatMap((t) => rw(e, t.id).map((e, n) => ({
				structure: t.id,
				index: n
			}))) : [];
		}), c = /* @__PURE__ */ A({
			structure: n.structure,
			index: n.index
		}), l = W(() => `${c.value.structure}:${c.value.index}`), u = (e) => {
			let t = s.value.find((t) => `${t.structure}:${t.index}` === e);
			t && (c.value = t);
		}, d = W(() => rw(o.value, c.value.structure)[c.value.index]), f = W(() => aw(o.value, c.value.structure, c.value.index)), p = W(() => o.value?.images?.[c.value.structure]?.[c.value.index]), m = W(() => ow(o.value, c.value.structure, c.value.index)), h = /* @__PURE__ */ _n({
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
		}), y = () => g(d.value), b = W(() => ew()), x = W(() => !!(b.value && ES(b.value.api))), S = W(() => b.value && x.value ? UC(b.value) : []), C = W(() => h.refs.filter((e) => !S.value.some((t) => t.id === e))), ee = (e, t) => {
			h.refs = t ? [...h.refs, e] : h.refs.filter((t) => t !== e);
		}, w = W(() => d.value?.ratio ? [...Dc] : ["", ...Dc]), T = /* @__PURE__ */ _n(/* @__PURE__ */ new Set()), te = W(() => (p.value?.keys ?? []).filter((e) => !T.has(e))), ne = W(() => {
			let e = (p.value?.keys ?? [])[p.value?.shown ?? -1];
			return e && !T.has(e) ? e : te.value.at(-1);
		}), E = (e) => void gw(n.mesid, c.value.structure, c.value.index, (p.value?.keys ?? []).indexOf(e)), re = (e) => void _w(n.mesid, c.value.structure, c.value.index, e), ie = /* @__PURE__ */ A(null), ae = W(() => a ? QC.get($C(a, c.value.structure, c.value.index)) : void 0), oe = W(() => ae.value?.status === "running"), se = W(() => ae.value?.status === "error" ? Rw(ae.value.error) : "");
		async function ce() {
			_.value && (await hw(n.mesid, c.value.structure, c.value.index, {
				prompt: h.prompt,
				refs: h.refs,
				ratio: h.ratio || void 0,
				caption: h.caption
			}), g(f.value));
		}
		async function le() {
			await ce(), r("close");
		}
		async function ue() {
			await ce(), fw(n.mesid, c.value.structure, c.value.index);
		}
		let de = () => {
			a && pw(a, c.value.structure, c.value.index);
		};
		function D(e) {
			e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.isComposing && (e.preventDefault(), ue());
		}
		return (e, t) => !o.value || !d.value ? (R(), z("div", YF, k(j(K)("media.image.gone")), 1)) : (R(), z("form", {
			key: 1,
			class: "image-panel col",
			onSubmit: bs(le, ["prevent"]),
			onKeydown: D
		}, [
			s.value.length > 1 ? (R(), z("select", {
				key: 0,
				class: "input",
				value: l.value,
				"aria-label": j(K)("media.image.which"),
				disabled: _.value,
				onChange: t[0] ||= (e) => u(e.target.value)
			}, [(R(!0), z(L, null, I(s.value, (e, t) => (R(), z("option", {
				key: `${e.structure}:${e.index}`,
				value: `${e.structure}:${e.index}`
			}, k(j(K)("media.image.nth", { n: t + 1 })) + k(j(rw)(o.value, e.structure)[e.index]?.caption ? ` · ${j(rw)(o.value, e.structure)[e.index].caption}` : ""), 9, ZF))), 128))], 40, XF)) : U("", !0),
			H($, {
				label: j(K)("media.image.prompt"),
				modified: m.value
			}, {
				default: M(() => [N(V("textarea", {
					"onUpdate:modelValue": t[1] ||= (e) => h.prompt = e,
					class: "input image-panel-prompt",
					rows: "6"
				}, null, 512), [[us, h.prompt]])]),
				_: 1
			}, 8, ["label", "modified"]),
			H($, { label: j(K)("media.image.refs") }, {
				default: M(() => [x.value ? (R(), z("div", $F, [
					!S.value.length && !C.value.length ? (R(), z("p", eI, k(j(K)("media.image.refs.empty")), 1)) : U("", !0),
					(R(!0), z(L, null, I(S.value, (e) => (R(), z("label", {
						key: e.id,
						class: "media-ref image-panel-ref",
						"data-ref": e.id
					}, [
						V("input", {
							type: "checkbox",
							checked: h.refs.includes(e.id),
							onChange: (t) => ee(e.id, t.target.checked)
						}, null, 40, nI),
						H(UF, {
							"blob-key": e.blob,
							class: "media-ref-thumb",
							alt: e.description
						}, null, 8, ["blob-key", "alt"]),
						V("span", rI, k(e.id), 1),
						V("span", iI, k(e.description), 1)
					], 8, tI))), 128)),
					(R(!0), z(L, null, I(C.value, (e) => (R(), z("label", {
						key: e,
						class: "media-ref image-panel-ref",
						"data-ref": e
					}, [
						V("input", {
							type: "checkbox",
							checked: "",
							onChange: (t) => ee(e, !1)
						}, null, 40, oI),
						V("span", sI, k(e), 1),
						V("span", cI, k(j(K)("media.image.refs.unavailable")), 1)
					], 8, aI))), 128))
				])) : (R(), z("p", QF, k(j(K)("media.image.refs.unsupported")), 1))]),
				_: 1
			}, 8, ["label"]),
			V("div", lI, [H($, { label: j(K)("media.image.ratio") }, {
				default: M(() => [N(V("select", {
					"onUpdate:modelValue": t[2] ||= (e) => h.ratio = e,
					class: "input"
				}, [(R(!0), z(L, null, I(w.value, (e) => (R(), z("option", {
					key: e,
					value: e
				}, k(e || j(K)("media.image.ratio.auto")), 9, uI))), 128))], 512), [[ps, h.ratio]])]),
				_: 1
			}, 8, ["label"]), H($, {
				label: j(K)("media.image.caption"),
				class: "grow"
			}, {
				default: M(() => [N(V("input", {
					"onUpdate:modelValue": t[3] ||= (e) => h.caption = e,
					class: "input"
				}, null, 512), [[us, h.caption]])]),
				_: 1
			}, 8, ["label"])]),
			H($, { label: j(K)("media.image.versions") }, {
				default: M(() => [te.value.length ? (R(), z("div", fI, [(R(!0), z(L, null, I(te.value, (e, t) => (R(), z("div", {
					key: e,
					class: O(["image-version", { on: e === ne.value }])
				}, [V("button", {
					type: "button",
					class: "image-version-pick",
					"aria-label": j(K)("media.image.show", { n: t + 1 }),
					"aria-pressed": e === ne.value,
					onClick: (t) => E(e)
				}, [H(UF, {
					"blob-key": e,
					alt: j(K)("media.image.show", { n: t + 1 }),
					onMissing: (t) => T.add(e)
				}, null, 8, [
					"blob-key",
					"alt",
					"onMissing"
				])], 8, pI), V("div", mI, [H(Q, {
					icon: j(Cj),
					label: j(K)("media.image.view"),
					small: "",
					onClick: (e) => ie.value = t
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), H(Q, {
					icon: j(CM),
					label: j(K)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: (t) => re(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])])], 2))), 128))])) : (R(), z("p", dI, k(j(K)("media.image.versions.empty")), 1))]),
				_: 1
			}, 8, ["label"]),
			oe.value ? (R(), z("div", hI, [
				H(j(Gj), {
					class: "spin",
					"aria-hidden": "true"
				}),
				V("span", gI, k(j(K)("media.image.generating")), 1),
				H(Q, {
					icon: j(NM),
					label: j(K)("common.cancel"),
					small: "",
					onClick: de
				}, null, 8, ["icon", "label"])
			])) : se.value ? (R(), z("p", _I, k(se.value), 1)) : U("", !0),
			V("div", vI, [
				V("button", {
					type: "button",
					class: "btn ghost sm-btn image-panel-restore",
					disabled: !v.value,
					onClick: y
				}, [H(j(uM)), wa(k(j(K)("media.image.restore")), 1)], 8, yI),
				V("button", {
					type: "submit",
					class: "btn sm-btn image-panel-save",
					disabled: !_.value
				}, k(j(K)("common.save")), 9, bI),
				V("button", {
					type: "button",
					class: "btn primary sm-btn image-panel-generate",
					disabled: oe.value || !h.prompt.trim(),
					onClick: ue
				}, [H(j(AM)), wa(k(j(K)("media.image.saveGenerate")), 1)], 8, xI)
			]),
			ie.value !== null && te.value.length ? (R(), B(JF, {
				key: 3,
				keys: te.value,
				start: Math.min(ie.value, te.value.length - 1),
				caption: f.value?.caption ?? f.value?.prompt,
				onClose: t[4] ||= (e) => ie.value = null
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
function CI(e, t, n) {
	xN({
		component: SI,
		props: {
			mesid: e,
			structure: t,
			index: n
		},
		title: K("media.image.panel")
	});
}
//#endregion
//#region src/ui/message/cards/ImageFigure.vue?vue&type=script&setup=true&lang.ts
var wI = { class: "image-figure" }, TI = ["aria-label"], EI = {
	key: 1,
	class: "image-empty"
}, DI = {
	key: 1,
	class: "xs faint"
}, OI = { class: "image-prompt small muted" }, kI = {
	key: 2,
	class: "image-busy",
	role: "status"
}, AI = { class: "small" }, jI = {
	key: 3,
	class: "image-pager"
}, MI = { class: "xs" }, NI = { class: "image-foot" }, PI = ["title"], FI = {
	key: 1,
	class: "xs muted grow ellipsis"
}, II = { class: "row tight image-tools" }, LI = /* @__PURE__ */ F({
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
		let t = e, n = W(() => t.record?.keys ?? []), r = /* @__PURE__ */ _n(/* @__PURE__ */ new Set());
		P(n, async (e) => {
			for (let t of e) !r.has(t) && !await HS(t).catch(() => !0) && r.add(t);
		}, { immediate: !0 });
		let i = W(() => n.value.filter((e) => !r.has(e))), a = W(() => {
			let e = n.value[t.record?.shown ?? -1], r = e ? i.value.indexOf(e) : -1;
			return r >= 0 ? r : i.value.length - 1;
		}), o = W(() => i.value[a.value]), s = W(() => !i.value.length && n.value.length > 0), c = W(() => t.record?.prompt ?? t.prompt.prompt), l = W(() => t.record?.caption ?? t.prompt.caption ?? ""), u = W(() => QC.get($C(t.genId, t.structure, t.index))), d = W(() => u.value?.status === "running"), f = W(() => u.value?.status === "error" ? Rw(u.value.error) : ""), p = W(() => (t.record?.ratio ?? t.prompt.ratio ?? "3:4").replace(":", " / ")), m = () => fw(t.mesid, t.structure, t.index), h = () => pw(t.genId, t.structure, t.index), g = (e) => {
			let r = i.value.length;
			r > 1 && gw(t.mesid, t.structure, t.index, n.value.indexOf(i.value[(a.value + e + r) % r]));
		}, _ = () => {
			o.value && _w(t.mesid, t.structure, t.index, o.value);
		};
		async function v() {
			let e = o.value, n = e ? await VS(e) : void 0;
			if (!n) return;
			let r = (n.type.split("/")[1] ?? "png").replace("jpeg", "jpg").replace("svg+xml", "svg");
			rD(`image-${t.mesid}-${t.index + 1}-${a.value + 1}.${r}`, n);
		}
		let y = () => CI(t.mesid, t.structure, t.index), b = /* @__PURE__ */ A(!1);
		return (t, n) => (R(), z("figure", wI, [
			V("div", {
				class: O(["image-frame", { empty: !o.value }]),
				style: Ve(o.value ? void 0 : { aspectRatio: p.value })
			}, [
				o.value ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "image-open",
					"aria-label": j(K)("media.image.view"),
					onClick: n[1] ||= (e) => b.value = !0
				}, [H(UF, {
					"blob-key": o.value,
					alt: l.value || c.value,
					onMissing: n[0] ||= (e) => r.add(o.value)
				}, null, 8, ["blob-key", "alt"])], 8, TI)) : (R(), z("div", EI, [
					!d.value && !f.value ? (R(), B(j(Lj), {
						key: 0,
						class: "faint",
						"aria-hidden": "true"
					})) : U("", !0),
					s.value && !d.value ? (R(), z("span", DI, k(j(K)("media.image.missing")), 1)) : U("", !0),
					V("p", OI, k(c.value), 1)
				])),
				d.value ? (R(), z("div", kI, [
					H(j(Gj), {
						class: "spin",
						"aria-hidden": "true"
					}),
					V("span", AI, k(j(K)("media.image.generating")), 1),
					H(Q, {
						icon: j(NM),
						label: j(K)("common.cancel"),
						small: "",
						onClick: h
					}, null, 8, ["icon", "label"])
				])) : U("", !0),
				o.value && i.value.length > 1 && !d.value ? (R(), z("div", jI, [
					H(Q, {
						icon: j(ej),
						label: j(K)("media.image.previous"),
						small: "",
						onClick: n[2] ||= (e) => g(-1)
					}, null, 8, ["icon", "label"]),
					V("span", MI, k(a.value + 1) + " / " + k(i.value.length), 1),
					H(Q, {
						icon: j(tj),
						label: j(K)("media.image.next"),
						small: "",
						onClick: n[3] ||= (e) => g(1)
					}, null, 8, ["icon", "label"])
				])) : U("", !0)
			], 6),
			V("figcaption", NI, [f.value ? (R(), z("span", {
				key: 0,
				class: "xs text-danger grow image-error",
				title: f.value
			}, k(f.value), 9, PI)) : (R(), z("span", FI, k(l.value), 1)), V("div", II, [
				!o.value && !d.value ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "btn sm-btn",
					onClick: m
				}, [H(j(AM)), wa(k(j(K)(f.value ? "media.image.retry" : "media.image.generate")), 1)])) : U("", !0),
				o.value && !d.value ? (R(), B(Q, {
					key: 1,
					icon: j(cM),
					label: j(K)("media.image.regenerate"),
					small: "",
					onClick: m
				}, null, 8, ["icon", "label"])) : U("", !0),
				e.editable ? (R(), B(Q, {
					key: 2,
					icon: j(rM),
					label: j(K)("media.image.openPanel"),
					small: "",
					onClick: y
				}, null, 8, ["icon", "label"])) : U("", !0),
				o.value ? (R(), B(Q, {
					key: 3,
					icon: j(bj),
					label: j(K)("media.image.download"),
					small: "",
					onClick: v
				}, null, 8, ["icon", "label"])) : U("", !0),
				o.value && e.editable && !d.value ? (R(), B(Q, {
					key: 4,
					icon: j(CM),
					label: j(K)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: _
				}, null, 8, ["icon", "label"])) : U("", !0)
			])]),
			b.value && o.value ? (R(), B(JF, {
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
}), RI = /* @__PURE__ */ F({
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
		return (t, n) => (R(), z("div", { class: O(["image-card", { multi: e.prompts.length > 1 }]) }, [(R(!0), z(L, null, I(e.prompts, (t, n) => (R(), B(LI, {
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
}), zI = /* @__PURE__ */ F({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = mk(() => t.mesid), r = W(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && Lx.current?.genId === e.genId ? Lx.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = CD(r), u = !(!i || e.live), d = G(o);
			for (let { decl: n } of QN(s, t.position)) {
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
						let t = i && !e.live && r.image ? Nc(a)?.images : void 0;
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
						let i = nm(r, "structures", n.id, "title", n.title || n.id), o = Ml(n);
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
									name: rm(r),
									version: r.version
								},
								lang: em(),
								setValue: async (e) => u ? VN(f, s, e) : !1,
								fillInput: (e, t) => yD(String(e ?? ""), !!t, f)
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
				narrator: Dd(r, bh(r), r.narrator),
				color: pk(r, r.narrator),
				items: c
			};
		}), i = W(() => t.position === "top" && n.value && !n.value.live ? sE(t.mesid) : []);
		return (t, n) => r.value?.items.length || i.value.length ? (R(), z("div", {
			key: 0,
			class: O(["cards", `cards-${e.position}`])
		}, [i.value.length ? (R(), B(IF, {
			key: 0,
			mesid: e.mesid,
			segments: i.value
		}, null, 8, ["mesid", "segments"])) : U("", !0), (R(!0), z(L, null, I(r.value ? r.value.items : [], (t) => (R(), z(L, { key: t.id }, [t.type === "reply" ? (R(), B(tP, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (R(), B(oP, {
			key: 1,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (R(), B(dP, {
			key: 2,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (R(), B(BP, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => j(VN)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (R(), B($P, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => j(VN)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (R(), B(hP, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (R(), B(CP, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (R(), B(rF, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (R(), B(pF, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : t.type === "image" ? (R(), B(RI, {
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
}), BI = {
	key: 0,
	class: "dock stages live"
}, VI = { class: "stage-bar" }, HI = { class: "ellipsis" }, UI = {
	key: 0,
	class: "small muted"
}, WI = /* @__PURE__ */ F({
	__name: "Dock",
	setup(e) {
		let t = W(() => Lx.current && !Lx.current.streaming && Lx.current.status === "running" ? Lx.current : null), n = W(() => {
			let e = t.value;
			if (!e) return [];
			let n = gm(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: fk(n, e.workflow, t.id, t.label),
				color: pk(n, t.actor)
			}));
		}), r = W(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (R(), z("div", BI, [V("div", VI, [
			H(j(Gj), { class: "spin faint" }),
			(R(!0), z(L, null, I(n.value, (e) => (R(), z("span", {
				key: e.id,
				class: O(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ve({ "--actor": e.color })
			}, [V("span", HI, k(e.label), 1)], 6))), 128)),
			n.value.length ? U("", !0) : (R(), z("span", UI, k(j(K)("stages.waiting")), 1))
		]), r.value ? (R(), B(zN, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : U("", !0)])) : U("", !0);
	}
}), GI = ["title"], KI = { class: "storyline-name" }, qI = {
	key: 0,
	class: "storyline-if"
}, JI = /* @__PURE__ */ F({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = W(() => {
			if (Y.chatRev, !dA.value) return null;
			let e = pA()[t.mesid];
			if (!e) return null;
			let n = Jv();
			return {
				key: e,
				name: jm(e, n) || K("storylines.unnamed"),
				if: km(e, n),
				hidden: Am(e, n)
			};
		});
		return (e, t) => n.value ? (R(), z("button", {
			key: 0,
			type: "button",
			class: O(["storyline-badge", { "if-line": n.value.if }]),
			title: j(K)("storylines.openTab"),
			onClick: t[0] ||= (e) => j(XC)(n.value.key)
		}, [
			H(j(Mj), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			V("span", KI, k(n.value.name), 1),
			n.value.if ? (R(), z("span", qI, k(j(K)("storylines.ifLine")), 1)) : U("", !0),
			n.value.hidden ? (R(), B(j(Sj), {
				key: 1,
				class: "lucide storyline-hidden",
				"aria-label": j(K)("storylines.hidden")
			}, null, 8, ["aria-label"])) : U("", !0)
		], 10, GI)) : U("", !0);
	}
}), YI = ["aria-label"], XI = ["disabled"], ZI = /* @__PURE__ */ F({
	__name: "Switch",
	props: /*@__PURE__*/ mi({
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
		let t = yi(e, "modelValue");
		return (n, r) => (R(), z("label", {
			class: O(["switch", { sm: e.small }]),
			"aria-label": e.label
		}, [
			N(V("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, XI), [[ds, t.value]]),
			r[1] ||= V("span", { class: "track" }, null, -1),
			r[2] ||= V("span", { class: "thumb" }, null, -1)
		], 10, YI));
	}
}), QI = { value: "" }, $I = ["value"], eL = { class: "swatches" }, tL = ["title"], nL = ["title"], rL = { class: "swatches" }, iL = ["title"], aL = /* @__PURE__ */ F({
	__name: "Appearance",
	setup(e) {
		let t = q().ui, n = W({
			get: () => t.language ?? "",
			set: (e) => {
				t.language = e || void 0, $p(e), J();
			}
		}), r = (e) => W({
			get: () => t[e] ?? "",
			set: (n) => {
				t[e] = n || void 0, J();
			}
		}), i = r("primary"), a = r("accent"), o = W({
			get: () => t.collapseStages,
			set: (e) => {
				t.collapseStages = e, J();
			}
		}), s = () => {
			t.primary = void 0, t.accent = void 0, J();
		}, c = () => t.annotations ??= { show: !0 }, l = W({
			get: () => t.annotations?.show !== !1,
			set: (e) => {
				c().show = e, J();
			}
		}), u = W({
			get: () => t.annotations?.color ?? "",
			set: (e) => {
				c().color = e || void 0, J();
			}
		});
		return (e, t) => (R(), B(bP, {
			title: j(K)("appearance.title"),
			icon: j(eM),
			collapsible: "",
			open: !1
		}, {
			default: M(() => [
				H($, {
					label: j(K)("appearance.language"),
					help: j(K)("appearance.language.hint"),
					inline: ""
				}, {
					default: M(() => [N(V("select", {
						"onUpdate:modelValue": t[0] ||= (e) => n.value = e,
						class: "input"
					}, [V("option", QI, k(j(K)("appearance.language.auto")), 1), (R(!0), z(L, null, I(j(Zp), (e) => (R(), z("option", {
						key: e.value,
						value: e.value
					}, k(e.label), 9, $I))), 128))], 512), [[ps, n.value]])]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: j(K)("appearance.colors"),
					help: j(K)("appearance.colors.hint"),
					inline: ""
				}, {
					default: M(() => [V("div", eL, [
						V("label", {
							class: "swatch",
							style: Ve({ background: j(i) || "var(--ap-primary-500)" }),
							title: j(K)("appearance.primary")
						}, [N(V("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ kn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							us,
							j(i),
							void 0,
							{ lazy: !0 }
						]])], 12, tL),
						V("label", {
							class: "swatch",
							style: Ve({ background: j(a) || "var(--ap-accent-500)" }),
							title: j(K)("appearance.accent")
						}, [N(V("input", {
							"onUpdate:modelValue": t[2] ||= (e) => /* @__PURE__ */ kn(a) ? a.value = e : null,
							type: "color"
						}, null, 512), [[
							us,
							j(a),
							void 0,
							{ lazy: !0 }
						]])], 12, nL),
						H(Q, {
							icon: j(uM),
							label: j(K)("common.reset"),
							small: "",
							align: "end",
							disabled: !j(i) && !j(a),
							onClick: s
						}, null, 8, [
							"icon",
							"label",
							"disabled"
						])
					])]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: j(K)("appearance.collapseStages"),
					inline: ""
				}, {
					default: M(() => [H(ZI, {
						modelValue: o.value,
						"onUpdate:modelValue": t[3] ||= (e) => o.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				H($, {
					label: j(K)("appearance.annotations"),
					help: j(K)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: M(() => [H(ZI, {
						modelValue: l.value,
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				l.value ? (R(), B($, {
					key: 0,
					label: j(K)("appearance.annotationColor"),
					inline: ""
				}, {
					default: M(() => [V("div", rL, [V("label", {
						class: "swatch",
						style: Ve({ background: u.value || "var(--ap-accent)" }),
						title: j(K)("appearance.annotationColor")
					}, [N(V("input", {
						"onUpdate:modelValue": t[5] ||= (e) => u.value = e,
						type: "color"
					}, null, 512), [[
						us,
						u.value,
						void 0,
						{ lazy: !0 }
					]])], 12, iL), H(Q, {
						icon: j(uM),
						label: j(K)("common.reset"),
						small: "",
						align: "end",
						disabled: !u.value,
						onClick: t[6] ||= (e) => u.value = ""
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
}), oL = { class: "toolbar" }, sL = ["disabled"], cL = ["disabled"], lL = { class: "preset-list" }, uL = ["onClick", "onKeydown"], dL = { class: "preset-mark" }, fL = { class: "grow col preset-info" }, pL = { class: "row wrap preset-head" }, mL = { class: "preset-name" }, hL = { class: "badge neutral" }, gL = { class: "badge neutral icon-badge" }, _L = {
	key: 0,
	class: "xs muted"
}, vL = {
	key: 1,
	class: "small muted preset-desc"
}, yL = {
	key: 0,
	class: "empty"
}, bL = /* @__PURE__ */ F({
	__name: "PresetsTab",
	setup(e) {
		let t = W(() => fm()), n = (e) => Cu(e.preset).length > 0, r = /* @__PURE__ */ A(null), i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(""), o = /* @__PURE__ */ A(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && w("success", n);
			} catch (e) {
				DD(e) || LD(e) ? w("info", e.message) : w("error", e instanceof Error ? e.message : String(e), K("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await Yh(e.preset), GC();
		}), l = () => s("url", async () => {
			let e = await UD(a.value);
			return a.value = "", i.value = !1, e;
		}, K("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => WD(t), K("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => KD(e.preset.id), K("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => uD(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => XD(e.preset.id)), m = () => s("ext", async () => w("info", await sS() === "current" ? K("update.none") : K("update.reloading")));
		return (e, s) => (R(), z(L, null, [
			V("div", oL, [
				V("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [H(j(EM)), wa(k(j(K)("presets.importFile")), 1)], 8, sL),
				V("button", {
					type: "button",
					class: O(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [H(j(Uj)), wa(k(j(K)("presets.importUrl")), 1)], 2),
				s[4] ||= V("span", { class: "grow" }, null, -1),
				H(Q, {
					icon: r.value === "ext" ? j(Gj) : j(cM),
					label: j(K)("presets.checkUpdates"),
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
				onSubmit: bs(l, ["prevent"])
			}, [N(V("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[us, a.value]]), V("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (R(), B(j(Gj), {
				key: 0,
				class: "spin"
			})) : (R(), B(j(bj), { key: 1 })), wa(k(j(K)("common.install")), 1)], 8, cL)], 32)) : U("", !0),
			V("div", lL, [(R(!0), z(L, null, I(t.value, (e) => (R(), z("div", {
				key: e.preset.id,
				class: O(["preset-item", { on: j(KC)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: Ss((t) => c(e), ["enter"])
			}, [
				V("span", dL, [r.value === `select:${e.preset.id}` ? (R(), B(j(Gj), {
					key: 0,
					class: "spin"
				})) : j(KC)?.id === e.preset.id ? (R(), B(j(QA), { key: 1 })) : U("", !0)]),
				V("div", fL, [
					V("div", pL, [
						V("span", mL, k(j(rm)(e.preset)), 1),
						V("span", hL, "v" + k(e.preset.version), 1),
						e.source === "builtin" ? U("", !0) : (R(), z("span", {
							key: 0,
							class: O(["badge", { warn: e.source === "dev" }])
						}, k(j(K)(`presets.source.${e.source}`)), 3)),
						n(e) ? (R(), B(FM, {
							key: 1,
							text: j(K)("presets.templates.help")
						}, {
							default: M(() => [V("span", gL, [H(j(pj)), wa(k(j(K)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : U("", !0)
					]),
					e.preset.author ? (R(), z("span", _L, k(e.preset.author), 1)) : U("", !0),
					j(im)(e.preset) ? (R(), z("span", vL, k(j(im)(e.preset)), 1)) : U("", !0)
				]),
				V("div", {
					class: "row preset-actions",
					onClick: s[3] ||= bs(() => {}, ["stop"])
				}, [
					H(Q, {
						icon: j(Tj),
						label: j(K)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					j(GD)(e.preset.id) ? (R(), B(Q, {
						key: 0,
						icon: j(cM),
						label: j(K)("presets.update"),
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
						icon: j(CM),
						label: j(K)("common.delete"),
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
			], 42, uL))), 128)), t.value.length ? U("", !0) : (R(), z("div", yL, k(j(K)("presets.none")), 1))]),
			H(aL)
		], 64));
	}
}), xL;
function SL() {
	let e = KC, t = W(() => e.value ? bh(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (Sh(r, t), n.sampling && (clearTimeout(xL), xL = setTimeout(() => void Xh(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var CL = { class: "empty" }, wL = /* @__PURE__ */ F({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (R(), z("div", CL, [
			H(j($j)),
			V("span", null, k(j(K)("panel.noPreset")), 1),
			V("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => j(Y).tab = "presets"
			}, k(j(K)("panel.choosePreset")), 1)
		]));
	}
}), TL = [
	"aria-checked",
	"title",
	"onClick"
], EL = { class: "ellipsis" }, DL = /* @__PURE__ */ F({
	__name: "Segmented",
	props: /*@__PURE__*/ mi({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = yi(e, "modelValue");
		return (n, r) => (R(), z("div", {
			class: O(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(R(!0), z(L, null, I(e.options, (e) => (R(), z("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: O({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (R(), B(ri(e.icon), { key: 0 })) : U("", !0), V("span", EL, k(e.label), 1)], 10, TL))), 128))], 2));
	}
}), OL = {
	key: 0,
	class: "row tight"
}, kL = ["aria-label"], AL = {
	key: 1,
	class: "row tight"
}, jL = ["aria-label"], ML = ["value"], NL = ["value"], PL = ["value"], FL = {
	key: 1,
	class: "xs muted"
}, IL = ["value", "placeholder"], LL = { value: "" }, RL = ["value"], zL = ["value"], BL = ["value"], VL = ["value"], HL = ["value"], UL = /* @__PURE__ */ F({
	__name: "ConnectionSection",
	setup(t) {
		let { preset: n, config: r, update: i } = SL(), a = W(() => r.value ? Ig(r.value) : []), s = /* @__PURE__ */ A(Au), c = W(() => a.value.find((e) => e.id === s.value) ?? a.value[0]);
		P(a, (e) => {
			e.some((e) => e.id === s.value) || (s.value = Au);
		});
		let u = (e) => e.id === "default" ? K("config.binding.default") : e.name || e.id;
		function d(e) {
			let t = c.value?.id ?? "default";
			i((n) => {
				if (t === "default") return e(n.connection);
				let r = n.connection.bindings?.[t];
				r && e(r);
			});
		}
		function f(e) {
			return W({
				get: () => c.value[e],
				set: (t) => d((n) => {
					n[e] = t;
				})
			});
		}
		let p = () => o(e().chatCompletionSettings ?? {});
		function m(e) {
			let { id: t, name: n, target: r, ...i } = G(e);
			return i;
		}
		function h(e, t, n) {
			let r = new Set(a.value.map((e) => e.id)), o = a.value.length;
			for (; r.has(`b${o}`);) o++;
			let c = `b${o}`;
			i((r) => {
				r.connection.bindings = {
					...r.connection.bindings,
					[c]: {
						name: t,
						target: n,
						...m(e)
					}
				};
			}), s.value = c;
		}
		let g = () => h(a.value[0], K("config.binding.newName", { n: a.value.length }), {
			type: "model",
			model: p()
		}), _ = () => {
			let e = c.value;
			e && h(e, K("media.connection.copyName", { name: u(e) }), G(e.target));
		};
		function v() {
			let e = n.value, t = c.value?.id;
			if (!e || !t || t === "default") return;
			let r = !!yh(e).connection.bindings?.[t];
			i((e) => {
				let n = { ...e.connection.bindings };
				r ? n[t] = null : delete n[t], e.connection.bindings = n, e.connection.binding === t && (e.connection.binding = Au);
				for (let [n, r] of Object.entries(e.multiModel?.actors ?? {})) r === t && (e.multiModel.actors[n] = Au);
			}), s.value = Au;
		}
		let y = /* @__PURE__ */ A(!1), b = /* @__PURE__ */ A("");
		function x() {
			b.value = c.value?.name ?? "", y.value = !0;
		}
		function S() {
			let e = b.value.trim();
			e && d((t) => {
				t.name = e;
			}), y.value = !1;
		}
		let C = W({
			get: () => a.value.some((e) => e.id === r.value?.connection.binding) ? r.value.connection.binding : Au,
			set: (e) => i((t) => {
				t.connection.binding = e;
			})
		}), ee = W(() => !!n.value?.multiModel && r.value?.multiModel?.enabled === !0), w = /* @__PURE__ */ A([]), T = () => {
			w.value = l().filter((e) => !e.mode || e.mode === "cc");
		};
		T();
		let te = W(() => Rs.map((e) => ({
			value: e,
			label: K(`config.binding.target.${e}`),
			hint: K(`config.binding.target.${e}.hint`)
		}))), ne = W({
			get: () => c.value?.target.type ?? "current",
			set: (e) => {
				T();
				let t = e === "profile" ? {
					type: "profile",
					profile: w.value[0]?.id ?? ""
				} : e === "model" ? {
					type: "model",
					model: p()
				} : { type: "current" };
				d((e) => {
					e.target = t;
				});
			}
		}), E = W({
			get: () => c.value?.target.type === "profile" ? c.value.target.profile : "",
			set: (e) => d((t) => {
				t.target = {
					type: "profile",
					profile: e
				};
			})
		}), re = W(() => !!E.value && !w.value.some((e) => e.id === E.value)), ie = W(() => c.value?.target.type === "model" ? c.value.target.model : ""), ae = (e) => d((t) => {
			t.target = {
				type: "model",
				model: e.trim()
			};
		}), oe = W(() => Ms.map((e) => ({
			value: e,
			label: K(`transport.${e}`),
			hint: K(`transport.${e}.hint`)
		}))), se = f("transport"), ce = W(() => c.value?.transport === "tool-single" || c.value?.transport === "tool-multi"), le = f("forceTool"), ue = f("parallelTools"), de = W({
			get: () => c.value ? Mu(c.value) : "off",
			set: (e) => d((t) => {
				t.sendThoughtSignature = e !== "off" && e;
			})
		}), D = f("openAiSignatures"), fe = f("streamToolArguments"), pe = f("maxSteps"), me = f("assumeToolSupport"), he = W({
			get: () => c.value?.syntheticTurn ?? "",
			set: (e) => d((t) => {
				t.syntheticTurn = e || null;
			})
		}), ge = W({
			get: () => r.value?.connection.finalFallback ?? !0,
			set: (e) => i((t) => {
				t.connection.finalFallback = e;
			})
		}), _e = (e) => Number(e.target.value);
		return (e, t) => j(n) && j(r) && c.value ? (R(), B(bP, {
			key: 0,
			title: j(K)("config.connection"),
			icon: j(XA)
		}, {
			default: M(() => [
				H($, {
					label: j(K)("config.binding"),
					help: j(K)("config.binding.hint")
				}, {
					default: M(() => [y.value ? (R(), z("div", OL, [
						N(V("input", {
							"onUpdate:modelValue": t[0] ||= (e) => b.value = e,
							class: "input grow",
							"aria-label": j(K)("common.rename"),
							onKeydown: [Ss(S, ["enter"]), t[1] ||= Ss((e) => y.value = !1, ["esc"])]
						}, null, 40, kL), [[us, b.value]]),
						H(Q, {
							icon: j(NM),
							label: j(K)("common.cancel"),
							small: "",
							onClick: t[2] ||= (e) => y.value = !1
						}, null, 8, ["icon", "label"]),
						H(Q, {
							icon: j(QA),
							label: j(K)("common.save"),
							small: "",
							active: "",
							onClick: S
						}, null, 8, ["icon", "label"])
					])) : (R(), z("div", AL, [
						N(V("select", {
							"onUpdate:modelValue": t[3] ||= (e) => s.value = e,
							class: "input grow",
							"aria-label": j(K)("config.binding")
						}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
							key: e.id,
							value: e.id
						}, k(u(e)), 9, ML))), 128))], 8, jL), [[ps, s.value]]),
						H(Q, {
							icon: j(aM),
							label: j(K)("config.binding.add"),
							small: "",
							onClick: g
						}, null, 8, ["icon", "label"]),
						H(Q, {
							icon: j(_j),
							label: j(K)("common.copy"),
							small: "",
							onClick: _
						}, null, 8, ["icon", "label"]),
						c.value.id === "default" ? U("", !0) : (R(), z(L, { key: 0 }, [H(Q, {
							icon: j(rM),
							label: j(K)("common.rename"),
							small: "",
							onClick: x
						}, null, 8, ["icon", "label"]), H(Q, {
							icon: j(CM),
							label: j(K)("common.delete"),
							small: "",
							danger: "",
							align: "end",
							onClick: v
						}, null, 8, ["icon", "label"])], 64))
					]))]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: j(K)("config.binding.target"),
					help: j(K)(`config.binding.target.${ne.value}.hint`)
				}, {
					default: M(() => [H(DL, {
						modelValue: ne.value,
						"onUpdate:modelValue": t[4] ||= (e) => ne.value = e,
						options: te.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"]),
				ne.value === "profile" ? (R(), B($, {
					key: 0,
					label: j(K)("config.binding.profile"),
					help: j(K)("config.binding.profile.hint")
				}, {
					default: M(() => [w.value.length || re.value ? N((R(), z("select", {
						key: 0,
						"onUpdate:modelValue": t[5] ||= (e) => E.value = e,
						class: "input",
						onFocus: T
					}, [re.value ? (R(), z("option", {
						key: 0,
						value: E.value
					}, k(j(K)("config.binding.profile.missing")), 9, NL)) : U("", !0), (R(!0), z(L, null, I(w.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, k(e.name || e.id), 9, PL))), 128))], 544)), [[ps, E.value]]) : (R(), z("span", FL, k(j(K)("config.binding.profile.none")), 1))]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0),
				ne.value === "model" ? (R(), B($, {
					key: 1,
					label: j(K)("config.binding.model"),
					help: j(K)("config.binding.model.hint")
				}, {
					default: M(() => [V("input", {
						class: "input",
						value: ie.value,
						placeholder: p(),
						onChange: t[6] ||= (e) => ae(e.target.value)
					}, null, 40, IL)]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0),
				H($, {
					label: j(K)("config.transport"),
					help: j(K)(`transport.${j(se)}.hint`)
				}, {
					default: M(() => [H(DL, {
						modelValue: j(se),
						"onUpdate:modelValue": t[7] ||= (e) => /* @__PURE__ */ kn(se) ? se.value = e : null,
						options: oe.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"]),
				ce.value ? (R(), z(L, { key: 2 }, [
					H($, {
						label: j(K)("config.forceTool"),
						help: j(K)("config.forceTool.hint"),
						inline: ""
					}, {
						default: M(() => [H(ZI, {
							modelValue: j(le),
							"onUpdate:modelValue": t[8] ||= (e) => /* @__PURE__ */ kn(le) ? le.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: j(K)("config.parallelTools"),
						help: j(K)("config.parallelTools.hint"),
						inline: ""
					}, {
						default: M(() => [H(ZI, {
							modelValue: j(ue),
							"onUpdate:modelValue": t[9] ||= (e) => /* @__PURE__ */ kn(ue) ? ue.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: j(K)("config.syntheticTurn"),
						help: j(K)("config.syntheticTurn.hint"),
						inline: ""
					}, {
						default: M(() => [N(V("select", {
							"onUpdate:modelValue": t[10] ||= (e) => he.value = e,
							class: "input"
						}, [V("option", LL, k(j(K)("common.none")), 1), (R(!0), z(L, null, I(j(n).syntheticTurns, (e) => (R(), z("option", {
							key: e.id,
							value: e.id
						}, k(e.label), 9, RL))), 128))], 512), [[ps, he.value]])]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: j(K)("config.thoughtSignature"),
						help: j(K)("config.thoughtSignature.hint"),
						inline: ""
					}, {
						default: M(() => [N(V("select", {
							"onUpdate:modelValue": t[11] ||= (e) => de.value = e,
							class: "input"
						}, [(R(!0), z(L, null, I(j(Ps), (e) => (R(), z("option", {
							key: e,
							value: e
						}, k(j(K)(`config.thoughtSignature.${e}`)), 9, zL))), 128))], 512), [[ps, de.value]])]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: j(K)("config.openAiSignatures"),
						help: j(K)("config.openAiSignatures.hint"),
						inline: ""
					}, {
						default: M(() => [H(ZI, {
							modelValue: j(D),
							"onUpdate:modelValue": t[12] ||= (e) => /* @__PURE__ */ kn(D) ? D.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: j(K)("config.streamToolArguments"),
						help: j(K)("config.streamToolArguments.hint"),
						inline: ""
					}, {
						default: M(() => [N(V("select", {
							"onUpdate:modelValue": t[13] ||= (e) => /* @__PURE__ */ kn(fe) ? fe.value = e : null,
							class: "input"
						}, [(R(!0), z(L, null, I(j(Ns), (e) => (R(), z("option", {
							key: e,
							value: e
						}, k(j(K)(`config.streamToolArguments.${e}`)), 9, BL))), 128))], 512), [[ps, j(fe)]])]),
						_: 1
					}, 8, ["label", "help"]),
					c.value.transport === "tool-multi" ? (R(), B($, {
						key: 0,
						label: j(K)("config.maxSteps"),
						inline: ""
					}, {
						default: M(() => [V("input", {
							class: "input",
							type: "number",
							min: "1",
							max: "20",
							value: j(pe),
							onChange: t[14] ||= (e) => pe.value = _e(e)
						}, null, 40, VL)]),
						_: 1
					}, 8, ["label"])) : U("", !0),
					H($, {
						label: j(K)("config.assumeToolSupport"),
						help: j(K)("config.assumeToolSupport.hint"),
						inline: ""
					}, {
						default: M(() => [H(ZI, {
							modelValue: j(me),
							"onUpdate:modelValue": t[15] ||= (e) => /* @__PURE__ */ kn(me) ? me.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				], 64)) : U("", !0),
				a.value.length > 1 ? (R(), B($, {
					key: 3,
					label: j(K)("config.binding.active"),
					help: j(K)(ee.value ? "config.binding.active.multiModel" : "config.binding.active.hint"),
					inline: ""
				}, {
					default: M(() => [N(V("select", {
						"onUpdate:modelValue": t[16] ||= (e) => C.value = e,
						class: "input"
					}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, k(u(e)), 9, HL))), 128))], 512), [[ps, C.value]])]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0),
				H($, {
					label: j(K)("config.finalFallback"),
					help: j(K)("config.finalFallback.hint"),
					inline: ""
				}, {
					default: M(() => [H(ZI, {
						modelValue: ge.value,
						"onUpdate:modelValue": t[17] ||= (e) => ge.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"])
			]),
			_: 1
		}, 8, ["title", "icon"])) : U("", !0);
	}
}), WL = ["value", "onChange"], GL = ["value"], KL = {
	key: 0,
	class: "xs muted"
}, qL = /* @__PURE__ */ F({
	__name: "MultiModelSection",
	setup(e) {
		let { preset: t, config: n, update: r } = SL(), i = W(() => n.value ? Ig(n.value) : []), a = W(() => Object.entries(t.value?.actors ?? {}).filter(([e]) => e !== t.value?.user)), o = W({
			get: () => n.value?.multiModel?.enabled === !0,
			set: (e) => r((t) => {
				t.multiModel = {
					...ju,
					...t.multiModel,
					actors: { ...t.multiModel?.actors },
					enabled: e
				};
			})
		}), s = (e) => {
			let t = n.value?.multiModel?.actors?.[e];
			return t && i.value.some((e) => e.id === t) ? t : Au;
		}, c = (e, t) => r((n) => {
			n.multiModel = {
				...ju,
				...n.multiModel,
				actors: {
					...n.multiModel?.actors,
					[e]: t
				}
			};
		});
		return (e, r) => j(t)?.multiModel && j(n) ? (R(), B(bP, {
			key: 0,
			title: j(K)("multiModel.title"),
			icon: j(Vj),
			help: j(K)("multiModel.hint")
		}, {
			actions: M(() => [H(ZI, {
				modelValue: o.value,
				"onUpdate:modelValue": r[0] ||= (e) => o.value = e,
				label: j(K)("multiModel.title")
			}, null, 8, ["modelValue", "label"])]),
			default: M(() => [o.value ? (R(), z(L, { key: 0 }, [(R(!0), z(L, null, I(a.value, ([e, t]) => (R(), B($, {
				key: e,
				label: j(n).identity.names[e] || t.name || e,
				help: j(K)("multiModel.actor.hint"),
				inline: ""
			}, {
				default: M(() => [V("select", {
					class: "input",
					value: s(e),
					onChange: (t) => c(e, t.target.value)
				}, [(R(!0), z(L, null, I(i.value, (e) => (R(), z("option", {
					key: e.id,
					value: e.id
				}, k(e.id === "default" ? j(K)("config.binding.default") : e.name || e.id), 9, GL))), 128))], 40, WL)]),
				_: 2
			}, 1032, ["label", "help"]))), 128)), i.value.length < 2 ? (R(), z("p", KL, k(j(K)("multiModel.noBindings")), 1)) : U("", !0)], 64)) : U("", !0)]),
			_: 1
		}, 8, [
			"title",
			"icon",
			"help"
		])) : U("", !0);
	}
}), JL = { class: "col" }, YL = { class: "row" }, XL = ["aria-label"], ZL = ["label"], QL = ["value"], $L = ["label"], eR = ["value"], tR = ["placeholder"], nR = {
	key: 1,
	class: "xs muted row tight"
}, rR = [
	"value",
	"placeholder",
	"onChange"
], iR = [
	"value",
	"placeholder",
	"onChange"
], aR = ["value"], oR = ["value"], sR = ["value"], cR = ["value"], lR = ["value"], uR = {
	key: 0,
	class: "xs muted"
}, dR = { class: "custom-ui-list small" }, fR = { class: "grow ellipsis" }, pR = { class: "xs faint" }, mR = { class: "slider" }, hR = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], gR = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], _R = { class: "field-grid" }, vR = ["value", "onChange"], yR = ["value"], bR = ["value"], xR = /* @__PURE__ */ F({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = SL(), i = W(() => t.value ? _h(t.value) : null), a = W({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				Ch(n, {
					kind: r,
					id: i.join(":")
				}), Xh(n);
			}
		}), o = W(() => {
			let e = t.value;
			return e ? Nl(e).map((t) => ({
				id: t.id,
				title: nm(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = W({
			get: () => t.value ? CD(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = pm(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? TD(n, e) : PD(n);
			}
		}), c = W(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== Fl(t.value));
		}), l = W(() => t.value ? wh(t.value) : !1), u = W(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ A(null), f = /* @__PURE__ */ A("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? Eh(e, n) : u.value && Oh(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Th(t.value), Xh(t.value));
		}, g = () => {
			t.value && u.value && (kh(t.value, u.value), Xh(t.value));
		}, _ = () => {
			t.value && u.value && Dh(t.value, u.value);
		}, v = W(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), y = W(() => v.value.map((e) => ({
			value: e.id,
			label: nm(t.value, "workflows", e.id, "name", e.name),
			hint: nm(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), b = W({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), x = W(() => y.value.find((e) => e.value === b.value)?.hint), S = W(() => Object.entries(t.value?.actors ?? {})), C = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), ee = W({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), w = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), T = W(() => Ls.map((e) => ({
			value: e,
			label: K(`writing.userInput.${e}`),
			hint: K(`writing.userInput.${e}.hint`)
		}))), te = W({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), ne = W({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), E = W({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...sd,
					...t.storylines,
					enabled: e
				};
			})
		}), re = W(() => od.map((e) => ({
			value: e,
			label: K(`storylines.freeze.${e}`),
			hint: K(`storylines.freeze.${e}.hint`)
		}))), ie = W({
			get: () => cd(n.value?.storylines),
			set: (e) => r((t) => {
				t.storylines = {
					...sd,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), ae = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), oe = W({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), se = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), ce = [
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
		], le = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], ue = ["stream_openai", "show_thoughts"], de = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], D = W(() => n.value?.sampling ?? {}), fe = (e) => e in D.value, pe = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), me = (e) => Number(e.target.value);
		return (e, r) => !j(t) || !j(n) || !i.value ? (R(), B(wL, { key: 0 })) : (R(), z(L, { key: 1 }, [
			V("div", JL, [
				V("div", YL, [
					N(V("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": j(K)("config.configuration")
					}, [V("optgroup", { label: j(K)("config.recommended") }, [(R(!0), z(L, null, I(j(t).configurations, (e) => (R(), z("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, k(j(nm)(j(t), "configurations", e.id, "name", e.name)), 9, QL))), 128))], 8, ZL), i.value.saved.length ? (R(), z("optgroup", {
						key: 0,
						label: j(K)("config.saved")
					}, [(R(!0), z(L, null, I(i.value.saved, (e) => (R(), z("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, k(e.name), 9, eR))), 128))], 8, $L)) : U("", !0)], 8, XL), [[ps, a.value]]),
					u.value && l.value ? (R(), B(Q, {
						key: 0,
						icon: j(dM),
						label: j(K)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : U("", !0),
					H(Q, {
						icon: j(aM),
						label: j(K)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (R(), B(Q, {
						key: 1,
						icon: j(rM),
						label: j(K)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : U("", !0),
					u.value ? (R(), B(Q, {
						key: 2,
						icon: j(CM),
						label: j(K)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : U("", !0),
					H(Q, {
						icon: j(uM),
						label: j(K)("config.reset"),
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
					onSubmit: bs(m, ["prevent"])
				}, [
					N(V("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: j(K)("config.name"),
						autofocus: ""
					}, null, 8, tR), [[us, f.value]]),
					H(Q, {
						icon: j(NM),
						label: j(K)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					H(Q, {
						icon: j(QA),
						label: j(K)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : U("", !0),
				l.value ? (R(), z("span", nR, [r[19] ||= V("span", { class: "dot modified" }, null, -1), wa(k(j(K)("config.modified")), 1)])) : U("", !0)
			]),
			H(UL),
			H(qL),
			y.value.length > 1 ? (R(), B(bP, {
				key: 0,
				title: j(K)("config.workflow"),
				icon: j(MM),
				help: x.value
			}, {
				default: M(() => [H(DL, {
					modelValue: b.value,
					"onUpdate:modelValue": r[5] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(bP, {
				title: j(K)("writing.actors"),
				icon: j(xj),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [(R(!0), z(L, null, I(S.value, ([e, t]) => (R(), z("div", {
					key: e,
					class: "field-grid"
				}, [H($, { label: j(K)("writing.actorName", { actor: e }) }, {
					default: M(() => [V("input", {
						class: "input",
						value: j(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => C("names", e, t.target.value)
					}, null, 40, rR)]),
					_: 2
				}, 1032, ["label"]), H($, { label: j(K)("writing.actorPrefix") }, {
					default: M(() => [V("input", {
						class: "input",
						value: j(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => C("prefixes", e, t.target.value)
					}, null, 40, iR)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(bP, {
				title: j(K)("writing.meta"),
				icon: j(Yj),
				help: j(K)("writing.meta.hint")
			}, {
				actions: M(() => [H(ZI, {
					modelValue: ne.value,
					"onUpdate:modelValue": r[6] ||= (e) => ne.value = e,
					label: j(K)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [ne.value ? (R(), B($, {
					key: 0,
					label: j(K)("writing.recentCount"),
					help: j(K)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: M(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: j(n).meta.recentCount,
						onChange: r[7] ||= (e) => ae(e.target.value)
					}, null, 40, aR)]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			j(t).storylines ? (R(), B(bP, {
				key: 1,
				title: j(K)("storylines.enabled"),
				icon: j(Mj),
				help: j(K)("storylines.config.hint")
			}, {
				actions: M(() => [H(ZI, {
					modelValue: E.value,
					"onUpdate:modelValue": r[8] ||= (e) => E.value = e,
					label: j(K)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [E.value ? (R(), B($, {
					key: 0,
					label: j(K)("storylines.freezeVariables"),
					help: j(K)("storylines.freezeVariables.hint")
				}, {
					default: M(() => [H(DL, {
						modelValue: ie.value,
						"onUpdate:modelValue": r[9] ||= (e) => ie.value = e,
						options: re.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(bP, {
				title: j(K)("writing.tokenSaving"),
				icon: j(hj),
				help: j(K)("writing.tokenSaving.hint")
			}, {
				actions: M(() => [H(ZI, {
					modelValue: ee.value,
					"onUpdate:modelValue": r[10] ||= (e) => ee.value = e,
					label: j(K)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [ee.value ? (R(), z(L, { key: 0 }, [
					H($, {
						label: j(K)("writing.keepFullTurns"),
						help: j(K)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: M(() => [V("input", {
							class: "input",
							type: "number",
							min: "0",
							value: j(n).tokenSaving.keepFullTurns,
							onChange: r[11] ||= (e) => w("keepFullTurns", e.target.value)
						}, null, 40, oR)]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: j(K)("writing.userInput"),
						help: j(K)("writing.userInput.hint")
					}, {
						default: M(() => [H(DL, {
							modelValue: te.value,
							"onUpdate:modelValue": r[12] ||= (e) => te.value = e,
							options: T.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					te.value === "truncate" ? (R(), B($, {
						key: 0,
						label: j(K)("writing.truncateUserAfter"),
						help: j(K)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: M(() => [V("input", {
							class: "input",
							type: "number",
							min: "0",
							value: j(n).tokenSaving.truncateUserAfter,
							onChange: r[13] ||= (e) => w("truncateUserAfter", e.target.value)
						}, null, 40, sR)]),
						_: 1
					}, 8, ["label", "help"])) : U("", !0)
				], 64)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(bP, {
				title: j(K)("writing.cache"),
				icon: j(yj),
				help: j(K)("writing.cache.hint")
			}, {
				actions: M(() => [H(ZI, {
					modelValue: oe.value,
					"onUpdate:modelValue": r[14] ||= (e) => oe.value = e,
					label: j(K)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [oe.value ? (R(), z(L, { key: 0 }, [H($, {
					label: j(K)("writing.cacheTtl"),
					help: j(K)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: M(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						value: j(n).cache.ttlMinutes,
						onChange: r[15] ||= (e) => se("ttlMinutes", e.target.value)
					}, null, 40, cR)]),
					_: 1
				}, 8, ["label", "help"]), H($, {
					label: j(K)("writing.cacheMaxDeferred"),
					help: j(K)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: M(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						value: j(n).cache.maxDeferredTurns,
						onChange: r[16] ||= (e) => se("maxDeferredTurns", e.target.value)
					}, null, 40, lR)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (R(), B(bP, {
				key: 2,
				title: j(K)("config.customUi"),
				icon: j(oM),
				help: j(K)("config.customUi.hint")
			}, {
				actions: M(() => [H(ZI, {
					modelValue: s.value,
					"onUpdate:modelValue": r[17] ||= (e) => s.value = e,
					label: j(K)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [c.value && !s.value ? (R(), z("p", uR, k(j(K)("config.customUi.changed")), 1)) : U("", !0), V("ul", dR, [(R(!0), z(L, null, I(o.value, (e) => (R(), z("li", {
					key: e.id,
					class: "row tight"
				}, [V("span", fR, k(e.title), 1), V("span", pR, k(j(K)(`config.customUi.${e.mode}`)) + " · " + k(j(K)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(bP, {
				title: j(K)("config.sampling"),
				icon: j(jj),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [
					(R(), z(L, null, I(ce, (e) => (R(), z(L, { key: e.key }, [fe(e.key) ? (R(), B($, {
						key: 0,
						label: j(K)(`sampling.${e.key}`)
					}, {
						default: M(() => [V("div", mR, [V("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: D.value[e.key],
							onInput: (t) => pe(e.key, me(t))
						}, null, 40, hR), V("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: D.value[e.key],
							onChange: (t) => pe(e.key, me(t))
						}, null, 40, gR)])]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64)),
					V("div", _R, [(R(), z(L, null, I(le, (e) => (R(), z(L, { key: e }, [fe(e) ? (R(), B($, {
						key: 0,
						label: j(K)(`sampling.${e}`)
					}, {
						default: M(() => [V("input", {
							class: "input",
							type: "number",
							value: D.value[e],
							onChange: (t) => pe(e, me(t))
						}, null, 40, vR)]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64)), fe("reasoning_effort") ? (R(), B($, {
						key: 0,
						label: j(K)("sampling.reasoning_effort")
					}, {
						default: M(() => [V("select", {
							class: "input",
							value: D.value.reasoning_effort,
							onChange: r[18] ||= (e) => pe("reasoning_effort", e.target.value)
						}, [(R(), z(L, null, I(de, (e) => V("option", {
							key: e,
							value: e
						}, k(j(K)(`effort.${e}`)), 9, bR)), 64))], 40, yR)]),
						_: 1
					}, 8, ["label"])) : U("", !0)]),
					(R(), z(L, null, I(ue, (e) => (R(), z(L, { key: e }, [fe(e) ? (R(), B($, {
						key: 0,
						label: j(K)(`sampling.${e}`),
						inline: ""
					}, {
						default: M(() => [H(ZI, {
							"model-value": !!D.value[e],
							"onUpdate:modelValue": (t) => pe(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), SR = ["aria-label"], CR = { class: "um-picker-head" }, wR = { class: "small muted" }, TR = { class: "um-choice-text" }, ER = { class: "xs muted" }, DR = ["data-template", "onClick"], OR = { class: "um-choice-text" }, kR = {
	key: 0,
	class: "xs muted um-choice-desc"
}, AR = /* @__PURE__ */ F({
	__name: "UserModulePicker",
	props: { templates: {} },
	emits: [
		"blank",
		"template",
		"cancel"
	],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ A(null);
		return Qr(() => void tr(() => r.value?.querySelector(".um-choice")?.focus())), (t, i) => (R(), z("div", {
			ref_key: "el",
			ref: r,
			class: "um-picker",
			role: "group",
			"aria-label": j(K)("um.startFrom"),
			onKeydown: i[2] ||= Ss(bs((e) => n("cancel"), ["stop"]), ["esc"])
		}, [
			V("div", CR, [V("span", wR, k(j(K)("um.startFrom")), 1), H(Q, {
				icon: j(NM),
				label: j(K)("common.cancel"),
				small: "",
				align: "end",
				onClick: i[0] ||= (e) => n("cancel")
			}, null, 8, ["icon", "label"])]),
			V("button", {
				type: "button",
				class: "um-choice",
				onClick: i[1] ||= (e) => n("blank")
			}, [H(j(Dj)), V("span", TR, [V("span", null, k(j(K)("um.blank")), 1), V("span", ER, k(j(K)("um.blank.desc")), 1)])]),
			(R(!0), z(L, null, I(e.templates, (e) => (R(), z("button", {
				key: e.tpl.id,
				type: "button",
				class: "um-choice",
				"data-template": e.tpl.id,
				onClick: (t) => n("template", e.tpl)
			}, [H(j(Hj)), V("span", OR, [V("span", null, k(e.body.name), 1), e.body.description ? (R(), z("span", kR, k(e.body.description), 1)) : U("", !0)])], 8, DR))), 128))
		], 40, SR));
	}
}), jR = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function MR(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: K("config.transport"),
			options: t([...Ms], (e) => K(`transport.${e}`))
		},
		style: {
			kind: "enum",
			label: K("um.var.style"),
			options: t(["dialogue", "imperative"], (e) => K(`um.style.${e}`))
		},
		workflow: {
			kind: "enum",
			label: K("config.workflow"),
			options: e.workflows.map((t) => ({
				value: t.id,
				label: nm(e, "workflows", t.id, "name", t.name)
			}))
		},
		"gen.origin": {
			kind: "enum",
			label: K("um.var.origin"),
			options: t(["story", "task"], (e) => K(`um.origin.${e}`))
		},
		"gen.type": {
			kind: "enum",
			label: K("um.var.genType"),
			options: t(jR, (e) => K(`um.genType.${e}`))
		},
		"meta.present": {
			kind: "bool",
			label: K("um.var.metaPresent")
		},
		"meta.pure": {
			kind: "bool",
			label: K("um.var.metaPure")
		},
		"features.tokenSaving": {
			kind: "bool",
			label: K("writing.tokenSaving")
		},
		"chat.group": {
			kind: "bool",
			label: K("um.var.group")
		},
		"memory.hasChat": {
			kind: "bool",
			label: K("um.var.hasChat")
		},
		"memory.hasGlobal": {
			kind: "bool",
			label: K("um.var.hasGlobal")
		},
		"recap.present": {
			kind: "bool",
			label: K("um.var.recap")
		},
		...e.inputShaping ? { "input.shaped": {
			kind: "bool",
			label: K("um.var.inputShaped")
		} } : {},
		...e.image ? { "image.on": {
			kind: "bool",
			label: K("um.var.imageOn")
		} } : {},
		...e.speech ? { "speech.on": {
			kind: "bool",
			label: K("um.var.speechOn")
		} } : {}
	};
}
var NR = (e) => e.modules.filter((e) => e.toggle === "user");
function PR(e) {
	let t = MR(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return NR(e).length && r.push({
		id: "module",
		label: K("um.var.module")
	}), e.params.length && r.push({
		id: "param",
		label: K("um.var.param")
	}), [
		{
			label: K("um.group.chat"),
			subjects: [{
				id: "keyword",
				label: K("um.keyword")
			}, ...n([
				"chat.group",
				"memory.hasChat",
				"memory.hasGlobal",
				"recap.present"
			])]
		},
		{
			label: K("um.group.generation"),
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
			label: K("um.group.preset"),
			subjects: [...r, ...n([
				"transport",
				"style",
				"workflow",
				"features.tokenSaving"
			])]
		},
		{
			label: K("um.group.advanced"),
			subjects: [...e.regex.length ? [{
				id: "flag",
				label: K("um.var.flag")
			}] : [], {
				id: "expr",
				label: K("um.expr")
			}]
		}
	].filter((e) => e.subjects.length);
}
function FR(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function IR(e, t) {
	return t === "module" ? NR(e).map((t) => ({
		value: t.id,
		label: nm(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: nm(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function LR(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: IR(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? nm(e, "params", t.id, "label", t.label) : r;
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
			label: RR(e, t.id, n.value, n.label)
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
	return MR(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var RR = (e, t, n, r) => tm(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), zR = {
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
function BR(e, t) {
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
		let n = String(IR(e, t)[0]?.value ?? "");
		return VR(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return VR(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function VR(e, t, n) {
	let r = LR(e, n);
	return t.path && LR(e, t.path).kind === r.kind && zR[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function HR(e, t, n = "") {
	return e === "bool" ? K(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? K(`um.op.list.${t}`) : e === "enum" ? K(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var UR = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(K("um.or")) : t === void 0 ? "" : n(t);
};
function WR(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? K("um.kw.input") : K("um.kw.recentN", { n: t.depth ?? 3 })} ${K(`um.kw.${t.op}`)} ${t.words.join(K("um.or"))}`;
	let n = LR(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? K("um.boolDesc", {
		label: n.label,
		value: HR(n.kind, t.op, t.path)
	}) : `${n.label} ${HR(n.kind, t.op)} ${UR(n, t.value)}`;
}
function GR(e, t) {
	let n = t.rules.filter(Tf);
	return n.length ? n.map((t) => WR(e, t)).join(t.match === "any" ? `\n${K("um.match.anyJoin")} ` : `\n${K("um.match.allJoin")} `) : K("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModuleRow.vue?vue&type=script&setup=true&lang.ts
var KR = ["data-id"], qR = ["aria-label"], JR = { class: "um-row-name ellipsis" }, YR = { class: "um-row-meta xs muted ellipsis" }, XR = [
	"aria-checked",
	"aria-label",
	"title"
], ZR = /* @__PURE__ */ F({
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
			return t ? nm(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, a = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? nm(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, o = (e) => [...new Set(e.entries.filter(gf).map((e) => e.point))].map(i).concat(e.vars.filter(gf).map((e) => a(e.var))).join(" · "), s = (e) => zf(n.preset, e), c = (e) => e.trigger.rules.some(Tf);
		return (t, n) => (R(), z("div", {
			class: O(["um-row", {
				off: !e.module.enabled,
				dragging: e.dragging
			}]),
			"data-id": e.module.id
		}, [
			e.grip ? (R(), z("span", {
				key: 0,
				class: "um-grip",
				"aria-label": j(K)("um.reorder"),
				onPointerdown: n[0] ||= (e) => r("grab", e)
			}, [H(j(Fj))], 40, qR)) : U("", !0),
			V("button", {
				type: "button",
				class: "um-open",
				onClick: n[1] ||= (e) => r("open")
			}, [V("span", JR, k(e.module.name || j(K)("um.untitled")), 1), V("span", YR, k(o(e.module) || j(K)("um.noEntries")), 1)]),
			s(e.module).length ? (R(), B(FM, {
				key: 1,
				text: j(K)("um.lostHint", { points: s(e.module).join(", ") }),
				align: "end"
			}, {
				default: M(() => [H(j(wM), {
					class: "text-warning um-flag",
					tabindex: "0"
				})]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			c(e.module) ? (R(), B(FM, {
				key: 2,
				text: j(GR)(e.preset, e.module.trigger),
				align: "end"
			}, {
				default: M(() => [H(j(PM), {
					class: "um-flag um-zap",
					tabindex: "0"
				})]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			e.single ? (R(), z("button", {
				key: 3,
				type: "button",
				role: "radio",
				class: O(["um-radio", { on: e.module.enabled }]),
				"aria-checked": e.module.enabled,
				"aria-label": e.module.name,
				title: j(K)(e.module.enabled ? "um.grp.radioOff" : "um.grp.radioOn"),
				onClick: n[2] ||= (t) => r("toggle", !e.module.enabled)
			}, [...n[4] ||= [V("span", { class: "radio" }, null, -1)]], 10, XR)) : (R(), B(ZI, {
				key: 4,
				"model-value": e.module.enabled,
				label: e.module.name,
				"onUpdate:modelValue": n[3] ||= (e) => r("toggle", e)
			}, null, 8, ["model-value", "label"]))
		], 10, KR));
	}
}), QR = {
	key: 0,
	class: "um-list",
	"data-zone": ""
}, $R = {
	key: 0,
	class: "um-drop xs muted"
}, ez = [
	"data-group",
	"data-zone",
	"data-collapsed"
], tz = { class: "um-group-head" }, nz = ["aria-label", "onPointerdown"], rz = [
	"value",
	"placeholder",
	"aria-label",
	"onInput"
], iz = ["title"], az = ["aria-label"], oz = { class: "small grow" }, sz = ["onClick"], cz = ["onClick"], lz = ["role", "aria-label"], uz = {
	key: 0,
	class: "um-drop xs muted"
}, dz = {
	key: 3,
	class: "faint small"
}, fz = /* @__PURE__ */ F({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => $g(n.preset)), a = W(() => e_(n.preset).map((e) => ({
			g: e,
			members: Pf(i.value, e.id)
		}))), o = W(() => Pf(i.value, null)), s = W(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), c = W(() => !i.value.length && !a.value.length), l = W(() => i.value.length > 1 || a.value.length > 0), u = (e, t) => p_(n.preset, e, t), d = W(() => lp(n.preset).map((e) => ({
			tpl: e,
			body: am(n.preset, e, "userModuleTemplates")
		}))), f = /* @__PURE__ */ A(void 0), p = (e) => e ?? void 0;
		function m(e) {
			f.value = void 0, r("open", l_(n.preset, K("um.newName", { n: i.value.length + 1 }), p(e)).id);
		}
		function h(e, t) {
			f.value = void 0, r("open", u_(n.preset, am(n.preset, t, "userModuleTemplates"), p(e) ?? t.group).id);
		}
		function g(e) {
			if (e && v_(n.preset, e, !1), !d.value.length) return m(e);
			f.value = f.value === e ? void 0 : e;
		}
		let _ = /* @__PURE__ */ A(null), v = (e) => _.value?.querySelector(`.um-group[data-group="${CSS.escape(e)}"] .um-group-name`);
		async function y() {
			let e = h_(n.preset, K("um.grp.newName", { n: a.value.length + 1 }));
			await tr(), v(e.id)?.select();
		}
		let b = (e, t) => g_(n.preset, e.id, t.target.value), x = (e) => __(n.preset, e.id, e.mode === "single" ? "multi" : "single"), S = (e) => {
			e.collapsed || (T.value === e.id && (T.value = null), f.value === e.id && (f.value = void 0)), v_(n.preset, e.id, !e.collapsed);
		}, C = (e, t) => y_(n.preset, e.id, t), ee = (e) => eD(`${n.preset.id}.${nD(e.name)}.ap-modules.json`, C_(n.preset, e.id)), T = /* @__PURE__ */ A(null);
		function te(e, t) {
			t ? T.value = T.value === e.id ? null : e.id : x_(n.preset, e.id, { withModules: !1 });
		}
		function ne(e, t) {
			T.value = null, x_(n.preset, e.id, { withModules: t });
		}
		let E = /* @__PURE__ */ A(null);
		async function re(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await ND(ap(e).modules);
				let { added: t, groups: i, missing: a } = w_(n.preset, e), o = i.length ? K("um.importedGroups", {
					n: t.length,
					groups: i.length
				}) : K("um.imported", { n: t.length });
				w(a ? "warning" : "success", a ? `${o} ${K("um.importedMissing", { missing: a })}` : o);
			} catch (e) {
				DD(e) ? w("info", e.message) : w("error", K("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let ie = () => eD(`${n.preset.id}.ap-modules.json`, S_(n.preset)), ae = /* @__PURE__ */ A(null);
		function oe(e, t, n) {
			e.button === 0 && (e.preventDefault(), ae.value = {
				kind: t,
				id: n
			}, window.addEventListener("pointermove", le), window.addEventListener("pointerup", ue), window.addEventListener("pointercancel", ue));
		}
		function se(e) {
			let t, n = Infinity;
			for (let r of _.value?.querySelectorAll("[data-zone]") ?? []) {
				let i = r.getBoundingClientRect(), a = e < i.top ? i.top - e : e > i.bottom ? e - i.bottom : 0;
				a < n && (t = r, n = a);
			}
			return t;
		}
		let ce = (e, t) => e.filter((e) => {
			let n = e.getBoundingClientRect();
			return n.top + n.height / 2 < t;
		}).length;
		function le(e) {
			let t = ae.value;
			if (!t) return;
			if (t.kind === "group") {
				let r = [..._.value?.querySelectorAll(".um-group") ?? []].filter((e) => e.dataset.group !== t.id);
				b_(n.preset, t.id, ce(r, e.clientY));
				return;
			}
			let r = se(e.clientY);
			if (!r) return;
			let i = r.dataset.zone || null, a = [...r.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t.id);
			m_(n.preset, t.id, i, r.dataset.collapsed === void 0 ? ce(a, e.clientY) : Infinity);
		}
		function ue() {
			ae.value = null, window.removeEventListener("pointermove", le), window.removeEventListener("pointerup", ue), window.removeEventListener("pointercancel", ue);
		}
		ei(ue);
		let de = (e) => ae.value?.kind === "module" && ae.value.id === e;
		return (t, n) => (R(), B(bP, {
			title: j(K)("um.title"),
			help: j(K)("um.help")
		}, {
			actions: M(() => [
				s.value ? (R(), B(Q, {
					key: 0,
					icon: j(EM),
					label: j(K)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => E.value?.click()
				}, null, 8, ["icon", "label"])) : U("", !0),
				c.value ? U("", !0) : (R(), B(Q, {
					key: 1,
					icon: j(bj),
					label: j(K)("um.exportAll"),
					small: "",
					align: "end",
					onClick: ie
				}, null, 8, ["icon", "label"])),
				s.value ? (R(), B(Q, {
					key: 2,
					icon: j(kj),
					label: j(K)("um.grp.new"),
					small: "",
					align: "end",
					onClick: y
				}, null, 8, ["icon", "label"])) : U("", !0),
				s.value && !c.value ? (R(), B(Q, {
					key: 3,
					icon: j(aM),
					label: j(K)("um.new"),
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
			default: M(() => [
				f.value === null ? (R(), B(AR, {
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
				}, [H(j(aM)), wa(k(j(K)("um.new")), 1)])) : s.value ? U("", !0) : (R(), z("div", dz, k(j(K)("um.noPoints")), 1)) : (R(), z("div", {
					key: 1,
					ref_key: "root",
					ref: _,
					class: O(["um-groups", { "um-dragging": ae.value }])
				}, [o.value.length || a.value.length && ae.value?.kind === "module" ? (R(), z("div", QR, [(R(!0), z(L, null, I(o.value, (t) => (R(), B(ZR, {
					key: t.id,
					preset: e.preset,
					module: t,
					grip: l.value,
					dragging: de(t.id),
					onOpen: (e) => r("open", t.id),
					onToggle: (e) => u(t.id, e),
					onGrab: (e) => oe(e, "module", t.id)
				}, null, 8, [
					"preset",
					"module",
					"grip",
					"dragging",
					"onOpen",
					"onToggle",
					"onGrab"
				]))), 128)), o.value.length ? U("", !0) : (R(), z("div", $R, k(j(K)("um.grp.dropOut")), 1))])) : U("", !0), (R(!0), z(L, null, I(a.value, ({ g: t, members: i }) => (R(), z("section", {
					key: t.id,
					class: O(["um-group", {
						collapsed: t.collapsed,
						off: !j(gf)(t),
						dragging: ae.value?.kind === "group" && ae.value.id === t.id
					}]),
					"data-group": t.id,
					"data-zone": t.id,
					"data-collapsed": t.collapsed ? "" : void 0
				}, [
					V("header", tz, [
						a.value.length > 1 ? (R(), z("span", {
							key: 0,
							class: "um-grip",
							"aria-label": j(K)("um.grp.reorder"),
							onPointerdown: (e) => oe(e, "group", t.id)
						}, [H(j(Fj))], 40, nz)) : U("", !0),
						H(Q, {
							icon: j(tj),
							label: j(K)(t.collapsed ? "um.grp.expand" : "um.grp.collapse"),
							class: O(["um-chevron", { open: !t.collapsed }]),
							small: "",
							align: "start",
							onClick: (e) => S(t)
						}, null, 8, [
							"icon",
							"label",
							"class",
							"onClick"
						]),
						V("input", {
							class: "input bare um-group-name grow",
							value: t.name,
							placeholder: j(K)("um.grp.untitled"),
							"aria-label": j(K)("um.grp.name"),
							onInput: (e) => b(t, e)
						}, null, 40, rz),
						V("span", {
							class: "um-group-count xs muted",
							title: j(K)("um.grp.count", { n: i.length })
						}, k(i.length), 9, iz),
						t.collapsed ? U("", !0) : (R(), z(L, { key: 1 }, [
							H(Q, {
								icon: j(rj),
								label: j(K)(t.mode === "single" ? "um.grp.single" : "um.grp.multi"),
								pressed: t.mode === "single",
								small: "",
								align: "end",
								class: "um-group-mode",
								onClick: (e) => x(t)
							}, null, 8, [
								"icon",
								"label",
								"pressed",
								"onClick"
							]),
							s.value ? (R(), B(Q, {
								key: 0,
								icon: j(aM),
								label: j(K)("um.grp.addModule"),
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
								icon: j(bj),
								label: j(K)("um.grp.export"),
								small: "",
								align: "end",
								class: "um-group-export",
								onClick: (e) => ee(t)
							}, null, 8, [
								"icon",
								"label",
								"onClick"
							]),
							H(Q, {
								icon: j(CM),
								label: j(K)("um.grp.delete"),
								active: T.value === t.id,
								danger: "",
								small: "",
								align: "end",
								class: "um-group-delete",
								onClick: (e) => te(t, i.length)
							}, null, 8, [
								"icon",
								"label",
								"active",
								"onClick"
							])
						], 64)),
						H(ZI, {
							"model-value": j(gf)(t),
							label: j(K)("um.grp.switch", { name: t.name || j(K)("um.grp.untitled") }),
							class: "um-group-switch",
							"onUpdate:modelValue": (e) => C(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						])
					]),
					T.value === t.id ? (R(), z("div", {
						key: 0,
						class: "um-group-confirm",
						role: "group",
						"aria-label": j(K)("um.grp.delete"),
						onKeydown: n[6] ||= Ss(bs((e) => T.value = null, ["stop"]), ["esc"])
					}, [
						V("span", oz, k(j(K)("um.grp.deleteAsk", { n: i.length })), 1),
						V("button", {
							type: "button",
							class: "btn ghost um-keep",
							onClick: (e) => ne(t, !1)
						}, k(j(K)("um.grp.keepModules")), 9, sz),
						V("button", {
							type: "button",
							class: "btn ghost danger um-delete-all",
							onClick: (e) => ne(t, !0)
						}, k(j(K)("um.grp.deleteModules")), 9, cz),
						V("button", {
							type: "button",
							class: "btn ghost",
							onClick: n[5] ||= (e) => T.value = null
						}, k(j(K)("common.cancel")), 1)
					], 40, az)) : U("", !0),
					f.value === t.id ? (R(), B(AR, {
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
					}, [(R(!0), z(L, null, I(i, (n) => (R(), B(ZR, {
						key: n.id,
						preset: e.preset,
						module: n,
						single: t.mode === "single",
						grip: l.value,
						dragging: de(n.id),
						onOpen: (e) => r("open", n.id),
						onToggle: (e) => u(n.id, e),
						onGrab: (e) => oe(e, "module", n.id)
					}, null, 8, [
						"preset",
						"module",
						"single",
						"grip",
						"dragging",
						"onOpen",
						"onToggle",
						"onGrab"
					]))), 128)), i.length ? U("", !0) : (R(), z("div", uz, k(j(K)("um.grp.empty")), 1))], 8, lz))
				], 10, ez))), 128))], 2)),
				V("input", {
					ref_key: "fileInput",
					ref: E,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: re
				}, null, 544)
			]),
			_: 1
		}, 8, ["title", "help"]));
	}
}), pz = ["title"], mz = ["aria-label", "onClick"], hz = ["placeholder"], gz = /* @__PURE__ */ F({
	__name: "ChipsInput",
	props: /*@__PURE__*/ mi({
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
		let t = yi(e, "modelValue"), n = e, r = /* @__PURE__ */ A(""), i = /* @__PURE__ */ A(null);
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
			class: O(["chip", { mono: e.mono }])
		}, [V("span", {
			class: "ellipsis",
			title: t
		}, k(t), 9, pz), V("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: bs((e) => c(n), ["stop"])
		}, [H(j(NM))], 8, mz)], 2))), 128)), N(V("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: O(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, hz), [[us, r.value]])]));
	}
}), _z = { class: "rule" }, vz = { class: "rule-head" }, yz = ["value", "aria-label"], bz = ["label"], xz = ["value"], Sz = ["value"], Cz = ["value"], wz = ["value"], Tz = ["value"], Ez = {
	key: 1,
	class: "grow"
}, Dz = {
	key: 0,
	class: "rule-body"
}, Oz = { class: "row wrap" }, kz = {
	key: 0,
	class: "unit small muted"
}, Az = ["value"], jz = ["value"], Mz = { value: "any" }, Nz = { value: "none" }, Pz = { class: "row kw-words" }, Fz = {
	key: 1,
	class: "rule-body"
}, Iz = ["value"], Lz = {
	key: 2,
	class: "rule-body"
}, Rz = ["value"], zz = ["value"], Bz = { class: "row wrap option-chips" }, Vz = ["aria-pressed", "onClick"], Hz = {
	key: 2,
	class: "row"
}, Uz = ["value"], Wz = ["value"], Gz = ["value"], Kz = ["list", "value"], qz = ["value"], Jz = {
	key: 3,
	class: "rule-error xs"
}, Yz = /* @__PURE__ */ F({
	__name: "RuleRow",
	props: /*@__PURE__*/ mi({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ mi(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = yi(e, "modelValue"), r = W(() => PR(t.preset)), i = W(() => FR(n.value)), a = W(() => IR(t.preset, i.value)), o = W(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = W(() => n.value.kind === "var" ? LR(t.preset, n.value.path) : null), c = W(() => jf(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = BR(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = VR(t.preset, r, `${i}.${e}`);
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
		let g = W(() => s.value?.kind === "list" ? "list" : "bool"), _ = W(() => zR[g.value].map((e) => ({
			value: e,
			label: HR(g.value, e, n.value.path)
		}))), v = W(() => (s.value ? zR[s.value.kind] : []).map((e) => ({
			value: e,
			label: HR(s.value.kind, e)
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
			label: K("um.kw.input")
		}, {
			value: "recent",
			label: K("um.kw.recent")
		}]);
		return (e, t) => (R(), z("div", _z, [
			V("div", vz, [
				V("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": j(K)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(R(!0), z(L, null, I(r.value, (e) => (R(), z("optgroup", {
					key: e.label,
					label: e.label
				}, [(R(!0), z(L, null, I(e.subjects, (e) => (R(), z("option", {
					key: e.id,
					value: e.id
				}, k(e.label), 9, xz))), 128))], 8, bz))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (R(), z("option", {
					key: 0,
					value: i.value
				}, k(n.value.path), 9, Sz)) : U("", !0)], 40, yz),
				a.value.length ? (R(), z("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
					key: String(e.value),
					value: e.value
				}, k(e.label), 9, wz))), 128)), a.value.some((e) => String(e.value) === o.value) ? U("", !0) : (R(), z("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, k(o.value), 9, Tz))], 40, Cz)) : (R(), z("span", Ez)),
				H(Q, {
					icon: j(NM),
					label: j(K)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (R(), z("div", Dz, [V("div", Oz, [
				H(DL, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (R(), z("label", kz, [V("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? j(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, Az), wa(" " + k(j(K)("um.kw.messages")), 1)])) : U("", !0),
				V("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [V("option", Mz, k(j(K)("um.kw.any")), 1), V("option", Nz, k(j(K)("um.kw.none")), 1)], 40, jz)
			]), V("div", Pz, [H(gz, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": j(K)("common.delete"),
				placeholder: n.value.regex ? j(K)("um.kw.regexPlaceholder") : j(K)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), H(Q, {
				icon: j(lM),
				label: j(K)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (R(), z("div", Fz, [V("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, Iz)])) : s.value ? (R(), z("div", Lz, [s.value.kind === "bool" || s.value.kind === "list" ? (R(), B(DL, {
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
			}, k(e.label), 9, zz))), 128))], 40, Rz), V("div", Bz, [(R(!0), z(L, null, I(s.value.options, (e) => (R(), z("button", {
				key: String(e.value),
				type: "button",
				class: O(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, k(e.label), 11, Vz))), 128))])], 64)) : (R(), z("div", Hz, [V("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(R(!0), z(L, null, I(v.value, (e) => (R(), z("option", {
				key: e.value,
				value: e.value
			}, k(e.label), 9, Wz))), 128))], 40, Uz), s.value.kind === "number" ? (R(), z("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, Gz)) : (R(), z(L, { key: 1 }, [V("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, Kz), s.value.suggestions?.length ? (R(), z("datalist", {
				key: 0,
				id: l
			}, [(R(!0), z(L, null, I(s.value.suggestions, (e) => (R(), z("option", {
				key: e,
				value: e
			}, null, 8, qz))), 128))])) : U("", !0)], 64))]))])) : U("", !0),
			c.value ? (R(), z("div", Jz, k(c.value), 1)) : U("", !0)
		]));
	}
}), Xz = { class: "trigger" }, Zz = {
	key: 1,
	class: "always faint small"
}, Qz = {
	key: 0,
	class: "rule-join xs faint"
}, $z = { class: "btn ghost add picker" }, eB = ["aria-label"], tB = ["label"], nB = ["value"], rB = /* @__PURE__ */ F({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ mi({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = yi(e, "modelValue"), r = W(() => PR(t.preset)), i = /* @__PURE__ */ A(null), a = W(() => [{
			value: "all",
			label: K("um.match.all")
		}, {
			value: "any",
			label: K("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(BR(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (R(), z("div", Xz, [
			n.value.rules.length > 1 ? (R(), B(DL, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : U("", !0),
			n.value.rules.length ? U("", !0) : (R(), z("div", Zz, k(j(K)("um.always")), 1)),
			(R(!0), z(L, null, I(n.value.rules, (t, r) => (R(), z(L, { key: r }, [r > 0 ? (R(), z("div", Qz, k(n.value.match === "any" ? j(K)("um.match.anyJoin") : j(K)("um.match.allJoin")), 1)) : U("", !0), H(Yz, {
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
			V("label", $z, [
				H(j(aM)),
				wa(k(j(K)("um.addRule")) + " ", 1),
				V("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": j(K)("um.addRule"),
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
				}, k(e.label), 9, nB))), 128))], 8, tB))), 128))], 40, eB)
			])
		]));
	}
}), iB = { class: "um-entry-head" }, aB = { class: "um-var-label grow ellipsis" }, oB = {
	key: 0,
	class: "um-warn xs"
}, sB = ["placeholder"], cB = [
	"value",
	"placeholder",
	"onInput"
], lB = { class: "um-var-pair-head" }, uB = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], dB = [
	"value",
	"placeholder",
	"onInput"
], fB = ["id"], pB = ["value"], mB = /* @__PURE__ */ F({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => Lf(n.preset, n.update.var)), a = W(() => i.value?.type !== n.update.type), o = W(() => i.value ? nm(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = W(() => i.value && nm(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = W(() => {
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
			n.update.type === "list" && (n.update.items[e] = yf(t, r));
		}
		function f() {
			let e = n.update;
			e.type === "list" ? e.items.push("") : e.type === "dict" && e.items.push({
				key: "",
				value: ""
			});
		}
		return (t, n) => (R(), z("div", { class: O(["um-entry", {
			lost: a.value,
			off: !j(gf)(e.update)
		}]) }, [
			V("div", iB, [
				H(ZI, {
					"model-value": j(gf)(e.update),
					label: j(K)("panel.enabled"),
					"onUpdate:modelValue": n[0] ||= (t) => j(vf)(e.update, t)
				}, null, 8, ["model-value", "label"]),
				V("span", aB, k(o.value), 1),
				H(_P, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				H(Q, {
					icon: j(NM),
					label: j(K)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (R(), z("div", oB, [H(j(wM)), wa(k(j(K)("um.bv.lost")), 1)])) : U("", !0),
			e.update.type === "string" ? N((R(), z("textarea", {
				key: 1,
				"onUpdate:modelValue": n[2] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: j(K)("um.bv.append")
			}, null, 8, sB)), [[us, e.update.text]]) : e.update.type === "list" ? (R(!0), z(L, { key: 2 }, I(e.update.items, (t, n) => (R(), z("div", {
				key: n,
				class: O(["um-var-row", { off: !j(gf)(t) }])
			}, [
				H(ZI, {
					"model-value": j(gf)(t),
					label: j(K)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => d(n, j(_f)(t), e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				V("textarea", {
					value: j(_f)(t),
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: j(K)("um.bv.item"),
					onInput: (e) => d(n, e.target.value, j(gf)(t))
				}, null, 40, cB),
				H(Q, {
					icon: j(NM),
					label: j(K)("um.removeEntry"),
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
				class: O(["um-var-pair", { off: !j(gf)(t) }])
			}, [V("div", lB, [
				H(ZI, {
					"model-value": j(gf)(t),
					label: j(K)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => j(vf)(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				N(V("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input bare um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: j(K)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, uB), [[us, t.key]]),
				H(Q, {
					icon: j(NM),
					label: j(K)("um.removeEntry"),
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
				placeholder: c.value.has(t.key.trim()) ? j(K)("um.bv.removes") : j(K)("um.bv.value"),
				onInput: (e) => t.value = e.target.value
			}, null, 40, dB)], 2))), 128)), V("datalist", { id: l.value }, [(R(!0), z(L, null, I(c.value, ([e]) => (R(), z("option", {
				key: e,
				value: e
			}, null, 8, pB))), 128))], 8, fB)], 64)),
			e.update.type === "string" ? U("", !0) : (R(), z("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: f
			}, [H(j(aM)), wa(k(e.update.type === "dict" ? j(K)("um.bv.addKey") : j(K)("um.bv.addItem")), 1)]))
		], 2));
	}
}), hB = { class: "um-editor" }, gB = { class: "um-head" }, _B = ["placeholder", "aria-label"], vB = { class: "um-entry-head" }, yB = ["onUpdate:modelValue", "aria-label"], bB = ["value"], xB = ["value"], SB = [
	"value",
	"aria-label",
	"onChange"
], CB = ["value"], wB = {
	key: 0,
	class: "um-warn xs"
}, TB = ["onUpdate:modelValue", "placeholder"], EB = {
	key: 1,
	class: "rule-error xs pre"
}, DB = {
	key: 0,
	class: "btn ghost add picker"
}, OB = ["aria-label"], kB = ["value"], AB = { class: "um-foot" }, jB = ["title"], MB = ["title"], NB = ["title"], PB = { class: "ellipsis" }, FB = ["value", "aria-label"], IB = { value: "" }, LB = ["value"], RB = ["title"], zB = /* @__PURE__ */ F({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		P(() => n.module, J, { deep: !0 });
		let i = /* @__PURE__ */ A(null);
		Qr(() => {
			n.module.entries.some((e) => e.text) || tr(() => i.value?.select());
		});
		let a = W(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: nm(n.preset, "insertionPoints", e.id, "label", e.label),
			description: nm(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !Ff(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => bu(e.text).errors, d = (e) => u(e).map((e) => e.line ? K("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = s_(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = W(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: nm(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = W(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ A(null);
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
		let v = /* @__PURE__ */ A(!1);
		function y() {
			v.value ? (f_(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = d_(n.preset, n.module.id, (e) => K("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = W(() => e_(n.preset)), S = (e) => m_(n.preset, n.module.id, e || null, Infinity), C = () => eD(`${n.preset.id}.${nD(n.module.name)}.ap-modules.json`, S_(n.preset, [n.module.id]));
		return (t, n) => (R(), z("div", hB, [
			V("header", gB, [
				H(Q, {
					icon: j(WA),
					label: j(K)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				N(V("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: j(K)("um.untitled"),
					"aria-label": j(K)("um.name")
				}, null, 8, _B), [[us, e.module.name]]),
				H(ZI, {
					"model-value": e.module.enabled,
					label: j(K)("panel.enabled"),
					"onUpdate:modelValue": n[2] ||= (t) => j(p_)(e.preset, e.module.id, t)
				}, null, 8, ["model-value", "label"])
			]),
			H(bP, {
				title: j(K)("um.content"),
				help: j(K)("um.content.help")
			}, {
				default: M(() => [(R(!0), z(L, null, I(e.module.entries, (t, n) => (R(), z("div", {
					key: t.id,
					class: O(["um-entry", {
						lost: s(t),
						off: !j(gf)(t)
					}])
				}, [
					V("div", vB, [
						H(ZI, {
							"model-value": j(gf)(t),
							label: j(K)("panel.enabled"),
							"onUpdate:modelValue": (e) => j(vf)(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						]),
						N(V("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": j(K)("um.point")
						}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
							key: e.id,
							value: e.id
						}, k(e.label), 9, bB))), 128)), s(t) ? (R(), z("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, k(j(K)("um.pointMissing", { id: t.point })), 9, xB)) : U("", !0)], 8, yB), [[ps, t.point]]),
						H(_P, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						V("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": j(K)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(R(), z(L, null, I(c, (e) => V("option", {
							key: e,
							value: e
						}, k(j(K)(`um.role.${e || "merge"}`)), 9, CB)), 64))], 40, SB),
						e.module.entries.length > 1 || e.module.vars.length ? (R(), B(Q, {
							key: 0,
							icon: j(NM),
							label: j(K)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : U("", !0)
					]),
					s(t) ? (R(), z("div", wB, [H(j(wM)), wa(k(j(K)("um.pointLost")), 1)])) : U("", !0),
					N(V("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: j(K)("um.text.placeholder")
					}, null, 8, TB), [[us, t.text]]),
					u(t).length ? (R(), z("div", EB, k(d(t)), 1)) : U("", !0)
				], 2))), 128)), a.value.length ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [H(j(aM)), wa(k(j(K)("um.addEntry")), 1)])) : U("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (R(), B(bP, {
				key: 0,
				title: j(K)("um.bv"),
				help: j(K)("um.bv.help")
			}, {
				default: M(() => [(R(!0), z(L, null, I(e.module.vars, (t, n) => (R(), B(mB, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (R(), z("label", DB, [
					H(j(aM)),
					wa(k(j(K)("um.bv.add")) + " ", 1),
					V("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": j(K)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[6] ||= V("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (R(!0), z(L, null, I(h.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, k(e.label), 9, kB))), 128))], 40, OB)
				])) : U("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : U("", !0),
			H(bP, {
				title: j(K)("um.trigger"),
				help: j(K)("um.trigger.help")
			}, {
				default: M(() => [H(rB, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			V("footer", AB, [
				V("button", {
					type: "button",
					class: "btn ghost",
					title: j(K)("um.export"),
					onClick: C
				}, [H(j(bj)), V("span", null, k(j(K)("um.export")), 1)], 8, jB),
				V("button", {
					type: "button",
					class: "btn ghost",
					title: j(K)("um.duplicate"),
					onClick: b
				}, [H(j(gj)), V("span", null, k(j(K)("um.duplicate")), 1)], 8, MB),
				x.value.length ? (R(), z("label", {
					key: 0,
					class: "btn ghost picker um-move",
					title: j(K)("um.grp.moveTo")
				}, [
					H(j(Aj)),
					V("span", PB, k(x.value.find((t) => t.id === e.module.group)?.name || j(K)("um.grp.none")), 1),
					V("select", {
						value: e.module.group ?? "",
						"aria-label": j(K)("um.grp.moveTo"),
						onChange: n[5] ||= (e) => S(e.target.value)
					}, [V("option", IB, k(j(K)("um.grp.none")), 1), (R(!0), z(L, null, I(x.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, k(e.name || j(K)("um.grp.untitled")), 9, LB))), 128))], 40, FB)
				], 8, NB)) : U("", !0),
				n[7] ||= V("span", { class: "grow" }, null, -1),
				V("button", {
					type: "button",
					class: O(["btn ghost danger", { armed: v.value }]),
					title: j(K)("common.delete"),
					onClick: y
				}, [H(j(CM)), V("span", null, k(v.value ? j(K)("um.confirmDelete") : j(K)("common.delete")), 1)], 10, RB)
			])
		]));
	}
}), BB = {
	key: 0,
	class: "module-row"
}, VB = { class: "grow" }, HB = { class: "ellipsis" }, UB = ["aria-label"], WB = ["aria-checked", "onClick"], GB = { class: "grow" }, KB = { class: "grow" }, qB = { class: "ellipsis" }, JB = {
	key: 0,
	class: "empty"
}, YB = /* @__PURE__ */ F({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = SL(), i = W(() => t.value && n.value ? Td(t.value, n.value) : {}), a = W(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = Cd(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : nm(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : nm(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? nm(e, "groups", t, "label", r?.label ?? t) : K("modules.other"),
					help: t && nm(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => nm(t.value, "modules", e.id, "name", e.name), s = (e) => nm(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ A(null), g = /* @__PURE__ */ A(null), _ = W(() => t.value && h.value ? $g(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, tr(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, tr(() => y()?.scrollTo({ top: v }));
		}
		return P(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !j(t) || !j(n) ? (R(), B(wL, { key: 0 })) : _.value ? (R(), z("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(R(), B(zB, {
			key: _.value.id,
			preset: j(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (R(), z("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			H(fz, {
				preset: j(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(R(!0), z(L, null, I(a.value, (e) => (R(), B(bP, {
				key: e.id,
				title: e.label,
				help: e.help
			}, oi({
				default: M(() => [(R(!0), z(L, null, I(e.sets, (t) => (R(), z(L, { key: t.key }, [t.label ? (R(), z("div", BB, [V("span", VB, [V("span", HB, k(t.label), 1), H(_P, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (R(), B(ZI, {
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
					class: O(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(R(!0), z(L, null, I(t.modules, (e) => (R(), z("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: O(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= V("span", { class: "radio" }, null, -1),
					V("span", GB, k(o(e)), 1),
					H(_P, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, WB))), 128))], 10, UB)) : U("", !0)], 64))), 128)), (R(!0), z(L, null, I(e.toggles, (e) => (R(), z("div", {
					key: e.id,
					class: "module-row"
				}, [V("span", KB, [V("span", qB, k(o(e)), 1), H(_P, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), H(ZI, {
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
				fn: M(() => [H(ZI, {
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
			a.value.length ? U("", !0) : (R(), z("div", JB, k(j(K)("modules.none")), 1))
		], 512));
	}
}), XB = ["value", "onChange"], ZB = ["value"], QB = {
	key: 2,
	class: "unit"
}, $B = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], eV = {
	key: 0,
	class: "small muted"
}, tV = [
	"list",
	"value",
	"placeholder",
	"onChange"
], nV = ["id"], rV = ["value"], iV = /* @__PURE__ */ F({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = SL(), i = W(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? nm(e, "groups", t, "label", e.groups[t]?.label ?? t) : K("writing.params"),
				help: t && nm(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => nm(t.value, "params", e.id, "label", e.label), o = (e) => nm(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => tm(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => Ku(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !j(t) || !j(n) ? (R(), B(wL, { key: 0 })) : (R(!0), z(L, { key: 1 }, I(i.value, (e) => (R(), B(bP, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: j(gM)
		}, {
			default: M(() => [(R(!0), z(L, null, I(e.params, (e) => (R(), B($, {
				key: e.id,
				label: a(e),
				help: o(e)
			}, {
				default: M(() => [e.type === "select" ? (R(), z("select", {
					key: 0,
					class: "input",
					value: c(e),
					onChange: (t) => l(e, t.target.value)
				}, [(R(!0), z(L, null, I(e.options, (t) => (R(), z("option", {
					key: String(t.value),
					value: t.value
				}, k(s(e, t.value, t.label)), 9, ZB))), 128))], 40, XB)) : e.type === "list" ? (R(), B(gz, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": j(K)("common.delete"),
					placeholder: j(K)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (R(), z("div", QB, [V("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, $B), e.unit ? (R(), z("span", eV, k(e.unit), 1)) : U("", !0)])) : (R(), z(L, { key: 3 }, [V("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, tV), e.options?.length ? (R(), z("datalist", {
					key: 0,
					id: f(e)
				}, [(R(!0), z(L, null, I(e.options, (t) => (R(), z("option", {
					key: String(t.value),
					value: t.value
				}, k(s(e, t.value, t.label)), 9, rV))), 128))], 8, nV)) : U("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), aV = { class: "kv" }, oV = {
	key: 0,
	class: "kv-row"
}, sV = { class: "kv-key ellipsis" }, cV = { class: "kv-value pre small" }, lV = {
	key: 0,
	class: "kv-actions"
}, uV = {
	key: 1,
	class: "kv-edit col"
}, dV = ["placeholder"], fV = ["placeholder"], pV = { class: "row end" }, mV = {
	key: 0,
	class: "kv-edit col"
}, hV = ["placeholder"], gV = ["placeholder"], _V = { class: "row end" }, vV = {
	key: 1,
	class: "faint small kv-empty"
}, yV = /* @__PURE__ */ F({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean },
		keyPlaceholder: {},
		valuePlaceholder: {}
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(null), a = /* @__PURE__ */ A(""), o = /* @__PURE__ */ A("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (R(), z("div", aV, [
			(R(!0), z(L, null, I(e.entries, (t, l) => (R(), z(L, { key: l }, [i.value === l ? (R(), z("div", uV, [
				N(V("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? j(K)("memory.key")
				}, null, 8, dV), [[us, a.value]]),
				N(V("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? j(K)("memory.content")
				}, null, 8, fV), [[us, o.value]]),
				V("div", pV, [H(Q, {
					icon: j(NM),
					label: j(K)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), H(Q, {
					icon: j(QA),
					label: j(K)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (R(), z("div", oV, [
				V("div", sV, k(l), 1),
				V("div", cV, k(t), 1),
				e.readonly ? U("", !0) : (R(), z("div", lV, [H(Q, {
					icon: j(rM),
					label: j(K)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), H(Q, {
					icon: j(CM),
					label: j(K)("common.delete"),
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
			i.value === "" ? (R(), z("div", mV, [
				N(V("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? j(K)("memory.key")
				}, null, 8, hV), [[us, a.value]]),
				N(V("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? j(K)("memory.content")
				}, null, 8, gV), [[us, o.value]]),
				V("div", _V, [H(Q, {
					icon: j(NM),
					label: j(K)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), H(Q, {
					icon: j(QA),
					label: j(K)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : U("", !0),
			!Object.keys(e.entries).length && i.value === null ? (R(), z("div", vV, k(j(K)("memory.empty")), 1)) : U("", !0),
			!e.readonly && i.value === null ? (R(), z("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [H(j(aM)), wa(k(j(K)("common.add")), 1)])) : U("", !0)
		]));
	}
}), bV = {
	key: 1,
	class: "faint small"
}, xV = {
	key: 0,
	class: "badge neutral"
}, SV = ["placeholder"], CV = {
	key: 1,
	class: "faint small"
}, wV = /* @__PURE__ */ F({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = SL(), r = W(() => n.value ? _h(n.value) : null), i = W(() => (Y.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => dA.value ? Qv() : void 0, o = W(() => (Y.chatRev, i.value ? ih(Infinity, a()) : {})), s = W(() => r.value ? sh(r.value) : {}), c = W(() => (Y.chatRev, i.value ? ah(Infinity, a()) : null));
		async function l(e, t) {
			await oh({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), WC();
		}
		async function u(e) {
			await oh({
				type: "memory.delete",
				key: e,
				source: "user"
			}), WC();
		}
		let d = (e, t) => r.value && ch(r.value, "replace", e, t, "user"), f = (e) => r.value && ch(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ A("");
		P(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = W(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await oh({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), WC();
		}
		return (e, t) => !j(n) || !r.value ? (R(), B(wL, { key: 0 })) : (R(), z(L, { key: 1 }, [
			H(bP, {
				title: j(K)("memory.chat"),
				icon: j(qj),
				help: j(K)("memory.chat.hint")
			}, {
				default: M(() => [i.value ? (R(), B(yV, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (R(), z("div", bV, k(j(K)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(bP, {
				title: j(K)("memory.global"),
				icon: j(Pj),
				help: j(K)("memory.global.hint")
			}, {
				actions: M(() => [H(Q, {
					icon: j(TM),
					label: j(K)("common.undo"),
					small: "",
					align: "end",
					disabled: !j(lh)(r.value),
					onClick: t[0] ||= (e) => j(dh)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), H(Q, {
					icon: j(sM),
					label: j(K)("common.redo"),
					small: "",
					align: "end",
					disabled: !j(uh)(r.value),
					onClick: t[1] ||= (e) => j(fh)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: M(() => [H(yV, {
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
			H(bP, {
				title: j(K)("memory.recap"),
				icon: j(fM),
				help: j(K)("memory.recap.hint")
			}, {
				actions: M(() => [c.value ? (R(), z("span", xV, "#0–" + k(c.value.coversUpTo), 1)) : U("", !0), i.value ? (R(), B(Q, {
					key: 1,
					icon: j(QA),
					label: j(K)("common.save"),
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
				default: M(() => [i.value ? N((R(), z("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: j(K)("memory.recap.empty")
				}, null, 8, SV)), [[us, p.value]]) : (R(), z("div", CV, k(j(K)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), TV = /img:[A-Za-z0-9-]+/g, EV = 6e5;
async function DV(t, n) {
	let r = await T(t, {
		method: "POST",
		headers: e().getRequestHeaders(),
		body: JSON.stringify(n)
	});
	if (!r.ok) throw Error(`${t}: HTTP ${r.status}`);
	return r.text();
}
var OV = (e, t) => {
	for (let n of e.matchAll(TV)) t.add(n[0]);
};
function kV(e, t) {
	let n = JSON.parse(e);
	if (!Array.isArray(n)) throw Error(`${t}: unreadable chat`);
	return e;
}
async function AV(t) {
	let n = /* @__PURE__ */ new Set();
	OV(JSON.stringify(e().chat ?? []), n);
	let r = [], i = JSON.parse(await DV("/api/characters/all", {}));
	for (let e of i) {
		if (!e.avatar) continue;
		let t = JSON.parse(await DV("/api/characters/chats", {
			avatar_url: e.avatar,
			simple: !0
		}));
		if (Array.isArray(t)) for (let i of t) {
			let t = String(i.file_name ?? "").replace(/\.jsonl$/, "");
			t && r.push(async () => OV(kV(await DV("/api/chats/get", {
				ch_name: e.name,
				file_name: t,
				avatar_url: e.avatar
			}), t), n));
		}
	}
	let a = JSON.parse(await DV("/api/groups/all", {}));
	for (let e of a) for (let t of e.chats ?? []) r.push(async () => OV(kV(await DV("/api/chats/group/get", { id: t }), t), n));
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
async function jV(e) {
	let t = await AV(e), n = (await WS("img:")).length, r = await GS("img:", t, EV);
	return {
		removed: r,
		kept: n - r
	};
}
//#endregion
//#region src/ui/panel/tabs/DebugTab.vue?vue&type=script&setup=true&lang.ts
var MV = { class: "row tight xs muted" }, NV = { class: "row" }, PV = {
	key: 0,
	class: "xs text-danger"
}, FV = { class: "row wrap xs muted" }, IV = { class: "badge neutral" }, LV = {
	key: 0,
	class: "badge neutral"
}, RV = { class: "badge neutral" }, zV = {
	key: 1,
	class: "badge warn"
}, BV = ["title"], VV = ["title"], HV = {
	key: 0,
	class: "row wrap xs muted"
}, UV = { class: "grow" }, WV = { key: 0 }, GV = ["onClick"], KV = { class: "grow mono" }, qV = { class: "xs muted" }, JV = { class: "row xs muted" }, YV = { class: "badge neutral" }, XV = { class: "pre mono scroll" }, ZV = {
	key: 0,
	class: "xs faint region-msg"
}, QV = { key: 1 }, $V = ["onClick"], eH = { class: "grow mono" }, tH = { class: "xs muted" }, nH = {
	key: 0,
	class: "region-msg"
}, rH = { class: "pre mono scroll" }, iH = {
	key: 0,
	class: "xs faint"
}, aH = {
	key: 2,
	class: "xs text-warning"
}, oH = {
	key: 1,
	class: "faint small"
}, sH = ["onClick"], cH = { class: "mono grow ellipsis" }, lH = {
	key: 0,
	class: "badge warn"
}, uH = { class: "xs muted" }, dH = { class: "xs muted" }, fH = { class: "row xs muted" }, pH = { class: "grow" }, mH = { class: "mono scroll" }, hH = { class: "row xs muted" }, gH = { class: "grow" }, _H = { class: "mono scroll" }, vH = {
	key: 0,
	class: "faint small"
}, yH = { class: "row xs" }, bH = { class: "badge neutral" }, xH = { class: "muted" }, SH = { class: "mono scroll" }, CH = {
	key: 0,
	class: "faint small"
}, wH = { class: "row" }, TH = ["disabled"], EH = {
	key: 0,
	class: "xs muted"
}, DH = {
	key: 1,
	class: "xs muted"
}, OH = {
	key: 2,
	class: "xs text-danger"
}, kH = { class: "row xs" }, AH = { class: "badge neutral" }, jH = {
	key: 0,
	class: "badge neutral"
}, MH = { class: "grow muted" }, NH = { class: "small" }, PH = {
	key: 0,
	class: "faint small"
}, FH = { class: "xs faint mono build" }, IH = /* @__PURE__ */ F({
	__name: "DebugTab",
	setup(t) {
		let n = W(() => E_.log.find((e) => e.kind === "assembly")?.data), r = W(() => E_.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ _n(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ _n({});
		P(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (o[i] === void 0 && r) try {
					o[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let s = /* @__PURE__ */ A(null), c = (e) => typeof e == "string" ? l(e) : JSON.stringify(e, null, 2);
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
			return `${n ?? "?"} → ${r ?? "?"}` + (i ? ` · ${K("debug.cached", { n: i })}` : "");
		}, p = (e) => [
			K("debug.cache.stats", {
				sticky: e.sticky,
				fresh: e.fresh
			}),
			e.postponed ? K("debug.cache.postponed", {
				n: e.postponed,
				d: e.deferred,
				max: e.maxDeferredTurns || "∞"
			}) : "",
			e.unmatched ? K("debug.cache.unmatched", { n: e.unmatched }) : ""
		].filter(Boolean).join(" · "), m = W({
			get: () => q().dev.enabled,
			set: (e) => {
				q().dev.enabled = e, J();
			}
		}), h = W({
			get: () => q().dev.url,
			set: (e) => {
				q().dev.url = e.trim(), J();
			}
		}), g = W(() => E_.log.filter((e) => e.kind !== "assembly")), _ = W(() => {
			Y.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) {
				for (let n of Tw(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.comment
				});
				for (let n of jw(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.character,
					speech: !0
				});
			}
			return t;
		}), v = W(() => !!(KC.value?.image || OS().image.connections.length)), y = /* @__PURE__ */ A({ running: !1 });
		async function b() {
			if (!y.value.running && await C(`<p>${S(K("debug.images.confirm"))}</p>`, K("common.delete"), K("common.cancel"))) {
				y.value = { running: !0 };
				try {
					let e = await jV((e) => {
						y.value = {
							running: !0,
							progress: e
						};
					});
					y.value = {
						running: !1,
						result: K("debug.images.done", {
							removed: e.removed,
							kept: e.kept
						})
					};
				} catch (e) {
					y.value = {
						running: !1,
						error: K("debug.images.failed", { error: e instanceof Error ? e.message : String(e) })
					};
				}
			}
		}
		return (e, t) => (R(), z(L, null, [
			H(bP, {
				title: j(K)("debug.dev"),
				icon: j(pM),
				help: j(K)("debug.dev.hint")
			}, {
				actions: M(() => [V("span", MV, [V("span", { class: O(["dot status-dot", j(dD).status]) }, null, 2), wa(k(j(K)(`debug.dev.${j(dD).status}`)), 1)])]),
				default: M(() => [H($, { label: j(K)("debug.dev.url") }, {
					default: M(() => [V("div", NV, [N(V("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						us,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), H(ZI, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: j(K)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), j(dD).error ? (R(), z("span", PV, k(j(dD).error), 1)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(bP, {
				title: j(K)("debug.assembly"),
				icon: j(Oj),
				collapsible: ""
			}, {
				default: M(() => [n.value ? (R(), z(L, { key: 0 }, [
					V("div", FV, [
						V("span", IV, k(j(K)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (R(), z("span", LV, k(n.value.workflow), 1)) : U("", !0),
						V("span", RV, k(n.value.origin), 1),
						n.value.dryRun ? (R(), z("span", zV, "dry run")) : U("", !0),
						n.value.input ? (R(), z("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, k(j(K)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, BV)) : U("", !0),
						n.value.storyline ? (R(), z("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, k(n.value.storyline.main ? j(K)("storylines.main") : n.value.storyline.name) + k(n.value.storyline.if ? " · if" : "") + k(n.value.storyline.new ? " · new" : "") + k(n.value.storyline.frozen ? " · frozen" : ""), 9, VV)) : U("", !0),
						t[3] ||= V("span", { class: "grow" }, null, -1),
						wa(k(u(n.value.at)), 1)
					]),
					r.value ? (R(), z("div", HV, [
						V("span", { class: O(["badge", r.value.reason ? "warn" : "neutral"]) }, k(r.value.reason ? j(K)(`debug.cache.flush.${r.value.reason}`) : j(K)("debug.cache.kept")), 3),
						V("span", UV, k(p(r.value)), 1),
						r.value === n.value.cache ? U("", !0) : (R(), z("span", WV, k(u(r.value.at)), 1))
					])) : U("", !0),
					V("div", null, [(R(!0), z(L, null, I(n.value.regions, (e) => (R(), z("div", {
						key: e.id,
						class: "region"
					}, [V("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						H(j(tj), { class: O(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						V("span", KV, k(e.id), 1),
						V("span", qV, k(e.messages.length) + " · " + k(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + k(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, GV), i.has(e.id) ? (R(), z(L, { key: 0 }, [(R(!0), z(L, null, I(e.messages, (e, t) => (R(), z("div", {
						key: t,
						class: "region-msg"
					}, [V("div", JV, [V("span", YV, k(e.role), 1), wa(k(e.chars) + " ch", 1)]), V("div", XV, k(e.content), 1)]))), 128)), e.messages.length ? U("", !0) : (R(), z("div", ZV, k(j(K)("debug.emptyRegion")), 1))], 64)) : U("", !0)]))), 128))]),
					n.value.vars?.length ? (R(), z("div", QV, [(R(!0), z(L, null, I(n.value.vars, (e) => (R(), z("div", {
						key: e.id,
						class: "region"
					}, [V("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						H(j(tj), { class: O(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						V("span", eH, k(e.id), 1),
						V("span", tH, k(e.text.length) + " ch", 1)
					], 8, $V), i.has(`var:${e.id}`) ? (R(), z("div", nH, [V("div", rH, k(e.text), 1), e.text ? U("", !0) : (R(), z("div", iH, k(j(K)("debug.emptyRegion")), 1))])) : U("", !0)]))), 128))])) : U("", !0),
					n.value.warnings.length ? (R(), z("div", aH, k(n.value.warnings.join(" · ")), 1)) : U("", !0)
				], 64)) : (R(), z("div", oH, k(j(K)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(bP, {
				title: j(K)("debug.requests"),
				icon: j(mj),
				collapsible: ""
			}, {
				default: M(() => [(R(!0), z(L, null, I(j(E_).requests, (e, t) => (R(), z("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [V("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					V("span", cH, k(e.genId) + " · #" + k(e.step), 1),
					e.error ? (R(), z("span", lH, k(j(K)("debug.error")), 1)) : U("", !0),
					V("span", uH, k(f(e.usage)), 1),
					V("span", dH, k(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, sH), s.value === t ? (R(), z(L, { key: 0 }, [
					V("div", fH, [V("span", pH, k(j(K)("debug.request")), 1), H(Q, {
						icon: j(_j),
						label: j(K)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					V("pre", mH, k(c(e.request)), 1),
					V("div", hH, [V("span", gH, k(j(K)("debug.response")), 1), H(Q, {
						icon: j(_j),
						label: j(K)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					V("pre", _H, k(e.error ?? c(e.response ?? "")), 1)
				], 64)) : U("", !0)]))), 128)), j(E_).requests.length ? U("", !0) : (R(), z("div", vH, k(j(K)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(bP, {
				title: j(K)("debug.log"),
				icon: j(fM),
				collapsible: "",
				open: !1
			}, {
				actions: M(() => [H(Q, {
					icon: j(CM),
					label: j(K)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => j(E_).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: M(() => [(R(!0), z(L, null, I(g.value, (e, n) => (R(), z("div", {
					key: n,
					class: "req"
				}, [V("div", yH, [
					V("span", bH, k(e.kind), 1),
					t[4] ||= V("span", { class: "grow" }, null, -1),
					V("span", xH, k(u(e.at)), 1)
				]), V("pre", SH, k(c(e.data)), 1)]))), 128)), g.value.length ? U("", !0) : (R(), z("div", CH, k(j(K)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			v.value ? (R(), B(bP, {
				key: 0,
				title: j(K)("debug.images"),
				icon: j(Ij),
				help: j(K)("debug.images.hint"),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [V("div", wH, [V("button", {
					type: "button",
					class: "btn",
					disabled: y.value.running,
					onClick: b
				}, [H(j(CM)), wa(k(j(K)("debug.images.clean")), 1)], 8, TH), y.value.running ? (R(), z("span", EH, k(y.value.progress ? j(K)("debug.images.scanning", {
					done: y.value.progress.done,
					total: y.value.progress.total
				}) : "…"), 1)) : y.value.result ? (R(), z("span", DH, k(y.value.result), 1)) : y.value.error ? (R(), z("span", OH, k(y.value.error), 1)) : U("", !0)])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			H(bP, {
				title: j(K)("debug.annotations"),
				icon: j(Jj),
				help: j(K)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [(R(!0), z(L, null, I(_.value, (e, t) => (R(), z("div", {
					key: t,
					class: "req"
				}, [V("div", kH, [
					V("span", AH, "#" + k(e.mesId), 1),
					e.speech ? (R(), z("span", jH, k(j(K)("debug.orphanSpeech")), 1)) : U("", !0),
					V("span", MH, "“" + k(e.quote) + "”", 1)
				]), V("div", NH, k(e.comment), 1)]))), 128)), _.value.length ? U("", !0) : (R(), z("div", PH, k(j(K)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			V("div", FH, "Advanced Preset " + k(j("1.13.0")) + " · " + k(j("d7bfae0311cadfdc")), 1)
		], 64));
	}
}), LH = {
	key: 1,
	class: "empty"
}, RH = { class: "row storylines-head" }, zH = { class: "xs muted grow" }, BH = ["aria-expanded", "onClick"], VH = { class: "card-title grow ellipsis" }, HH = ["title", "aria-label"], UH = {
	key: 1,
	class: "badge warn"
}, WH = { class: "xs faint" }, GH = {
	key: 0,
	class: "card-body col"
}, KH = ["aria-label"], qH = {
	key: 1,
	class: "faint small"
}, JH = {
	key: 2,
	class: "storyline-floors"
}, YH = ["title", "onClick"], XH = { class: "badge neutral mono" }, ZH = { class: "xs muted" }, QH = { class: "grow ellipsis" }, $H = /* @__PURE__ */ F({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n } = SL(), r = W(() => (Y.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), i = W(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), a = W(() => r.value && n.value?.storylines ? _A(i.value) : []), o = /* @__PURE__ */ A(/* @__PURE__ */ new Set()), s = (e) => {
			let t = new Set(o.value);
			t.has(e) ? t.delete(e) : t.add(e), o.value = t;
		};
		P(() => Y.storylineFocus, (e) => {
			e !== null && (o.value = /* @__PURE__ */ new Set([...o.value, e]), Y.storylineFocus = null);
		}, { immediate: !0 });
		let c = (e) => e.main ? e.name ? K("storylines.mainNamed", { name: e.name }) : K("storylines.main") : e.name || K("storylines.unnamed"), l = () => {
			WC(), NA();
		};
		async function u(e) {
			await ty(e.key, !e.if), l();
		}
		async function d(e) {
			await iy(e.key, !e.hidden), l();
		}
		async function f(e) {
			await hS(e.key) && l();
		}
		async function p(e) {
			let t = await ee(`<h3>${S(e.main && !e.name ? K("storylines.nameMain") : K("storylines.renameTitle", { name: c(e) }))}</h3>${e.main ? `<p>${S(K("storylines.nameMain.hint"))}</p>` : ""}`, e.name, K("common.save"), K("common.cancel"));
			if (t === null) return;
			let n = t.trim();
			if (!fd(n)) return w("warning", K("storylines.invalidName"), K("app.name"));
			let r = await ry(e.key, n);
			if (r === "taken") return w("warning", K("storylines.nameTaken", { name: n }), K("app.name"));
			if (r === "invalid") return w("warning", K("storylines.invalidName"), K("app.name"));
			r !== "unchanged" && (!e.main && o.value.has(e.key) && (o.value = new Set([...o.value].map((t) => t === e.key ? n : t))), l());
		}
		return (e, t) => j(n) ? r.value ? (R(), z(L, { key: 2 }, [V("div", RH, [V("span", zH, k(j(K)("storylines.count", { n: a.value.length })), 1), H(_P, {
			text: j(K)("storylines.help"),
			align: "end"
		}, null, 8, ["text"])]), (R(!0), z(L, null, I(a.value, (e) => (R(), z("section", {
			key: e.key,
			class: O(["card storyline-card", {
				current: e.current,
				hidden: e.hidden
			}])
		}, [V("header", {
			class: "card-head clickable",
			"aria-expanded": o.value.has(e.key),
			onClick: (t) => s(e.key)
		}, [
			(R(), B(ri(e.main ? j(vj) : e.if ? j(yM) : j(Mj)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			V("span", VH, k(c(e)), 1),
			e.current ? (R(), z("span", {
				key: 0,
				class: "storyline-dot",
				title: j(K)("storylines.current"),
				"aria-label": j(K)("storylines.current")
			}, null, 8, HH)) : U("", !0),
			e.if ? (R(), z("span", UH, "if")) : U("", !0),
			e.hidden ? (R(), B(j(Sj), {
				key: 2,
				class: "storyline-flag",
				"aria-label": j(K)("storylines.hidden")
			}, null, 8, ["aria-label"])) : U("", !0),
			V("span", WH, k(j(K)("storylines.floors", { n: e.floors.length })), 1),
			H(j($A), {
				class: O(["chevron", { flipped: o.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, BH), o.value.has(e.key) ? (R(), z("div", GH, [e.pending ? U("", !0) : (R(), z("div", {
			key: 0,
			class: O(["storyline-toolbar", { solo: e.main }]),
			role: "toolbar",
			"aria-label": c(e)
		}, [
			e.main ? U("", !0) : (R(), z(L, { key: 0 }, [
				H(Q, {
					icon: j(yM),
					label: j(K)("storylines.ifLine.toggle"),
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
					icon: e.hidden ? j(Sj) : j(Cj),
					label: j(K)("storylines.visible.toggle"),
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
				icon: j(nM),
				label: e.main && !e.name ? j(K)("storylines.nameMain") : j(K)("common.rename"),
				small: "",
				onClick: (t) => p(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]),
			e.main ? U("", !0) : (R(), B(Q, {
				key: 1,
				icon: j(vj),
				label: j(K)("storylines.makeMain"),
				small: "",
				onClick: (t) => f(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]))
		], 10, KH)), e.floors.length ? (R(), z("ul", JH, [(R(!0), z(L, null, I(e.floors, (e) => (R(), z("li", {
			key: e.index,
			class: "row tight small clickable",
			title: j(K)("storylines.jump"),
			onClick: (t) => j(vA)(e.index)
		}, [
			V("span", XH, "#" + k(e.index), 1),
			V("span", ZH, k(e.user ? j(K)("storylines.user") : j(K)("storylines.narrator")), 1),
			V("span", QH, k(e.title || "…"), 1)
		], 8, YH))), 128))])) : (R(), z("div", qH, k(j(K)("storylines.empty")), 1))])) : U("", !0)], 2))), 128))], 64)) : (R(), z("div", LH, [H(j(Mj), { "aria-hidden": "true" }), V("span", null, k(j(K)("memory.noChat")), 1)])) : (R(), B(wL, { key: 0 }));
	}
}), eU = {
	key: 0,
	class: "row tight"
}, tU = ["aria-label"], nU = {
	key: 1,
	class: "row tight"
}, rU = ["value", "aria-label"], iU = ["label"], aU = ["value"], oU = {
	key: 1,
	class: "grow faint small"
}, sU = /* @__PURE__ */ F({
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
		}), a = /* @__PURE__ */ A(!1), o = /* @__PURE__ */ A("");
		function s() {
			n.active && (o.value = n.active.name, a.value = !0);
		}
		function c() {
			let e = o.value.trim();
			e && n.active && r("rename", n.active, e), a.value = !1;
		}
		return (t, n) => a.value ? (R(), z("div", eU, [
			N(V("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.value = e,
				class: "input grow",
				"aria-label": j(K)("common.rename"),
				onKeydown: [Ss(c, ["enter"]), n[1] ||= Ss((e) => a.value = !1, ["esc"])]
			}, null, 40, tU), [[us, o.value]]),
			H(Q, {
				icon: j(NM),
				label: j(K)("common.cancel"),
				onClick: n[2] ||= (e) => a.value = !1
			}, null, 8, ["icon", "label"]),
			H(Q, {
				icon: j(QA),
				label: j(K)("common.save"),
				active: "",
				onClick: c
			}, null, 8, ["icon", "label"])
		])) : (R(), z("div", nU, [
			e.connections.length ? (R(), z("select", {
				key: 0,
				class: "input grow",
				value: e.active?.id,
				"aria-label": j(K)("media.connection"),
				onChange: n[3] ||= (e) => r("select", e.target.value)
			}, [(R(!0), z(L, null, I(i.value, (t) => (R(), z("optgroup", {
				key: t.api,
				label: e.apiLabel(t.api)
			}, [(R(!0), z(L, null, I(t.items, (e) => (R(), z("option", {
				key: e.id,
				value: e.id
			}, k(e.name), 9, aU))), 128))], 8, iU))), 128))], 40, rU)) : (R(), z("span", oU, k(j(K)("media.noConnection")), 1)),
			H(Q, {
				icon: j(aM),
				label: j(K)("media.addConnection"),
				small: "",
				onClick: n[4] ||= (e) => r("add")
			}, null, 8, ["icon", "label"]),
			e.active ? (R(), z(L, { key: 2 }, [
				H(Q, {
					icon: j(_j),
					label: j(K)("common.copy"),
					small: "",
					onClick: n[5] ||= (t) => r("copy", e.active)
				}, null, 8, ["icon", "label"]),
				H(Q, {
					icon: j(rM),
					label: j(K)("common.rename"),
					small: "",
					onClick: s
				}, null, 8, ["icon", "label"]),
				H(Q, {
					icon: j(CM),
					label: j(K)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: n[6] ||= (t) => r("remove", e.active)
				}, null, 8, ["icon", "label"])
			], 64)) : U("", !0)
		]));
	}
}), cU = /* @__PURE__ */ F({
	__name: "ScopeToggle",
	props: {
		modelValue: {},
		options: {}
	},
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = W(() => Math.max(0, t.options.findIndex((e) => e.value === t.modelValue))), r = W(() => t.options[(n.value + 1) % t.options.length]), i = W(() => K("media.scope.toggle", {
			current: t.options[n.value]?.label ?? "",
			next: r.value?.label ?? ""
		}));
		return (t, n) => (R(), B(Q, {
			class: "scope-toggle",
			icon: e.modelValue ? j(OM) : j(Pj),
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
}), lU = { class: "media-advanced" }, uU = ["aria-expanded"], dU = {
	key: 0,
	class: "col"
}, fU = ["placeholder"], pU = {
	key: 0,
	class: "xs text-danger"
}, mU = /* @__PURE__ */ F({
	__name: "AdvancedRequest",
	props: {
		connection: {},
		bodyPlaceholder: {}
	},
	emits: ["changed"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(n.connection.body);
		P(() => n.connection.id, () => {
			a.value = n.connection.body;
		});
		let o = W(() => pC(a.value));
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
		return (t, n) => (R(), z("div", lU, [V("button", {
			type: "button",
			class: "btn ghost sm-btn media-advanced-toggle",
			"aria-expanded": i.value,
			onClick: n[0] ||= (e) => i.value = !i.value
		}, [V("span", null, k(j(K)("media.advanced")), 1), H(j($A), { class: O(["chevron", { flipped: i.value }]) }, null, 8, ["class"])], 8, uU), i.value ? (R(), z("div", dU, [
			si(t.$slots, "default"),
			H($, {
				label: j(K)("media.headers"),
				help: j(K)("media.headers.hint")
			}, {
				default: M(() => [H(yV, {
					entries: e.connection.headers,
					"key-placeholder": j(K)("media.headers.name"),
					"value-placeholder": j(K)("media.headers.value"),
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
				label: j(K)("media.body"),
				help: j(K)("media.body.hint")
			}, {
				default: M(() => [N(V("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
					class: "input mono",
					rows: "4",
					spellcheck: "false",
					placeholder: e.bodyPlaceholder ?? "{ }",
					onChange: l
				}, null, 40, fU), [[us, a.value]]), o.value ? (R(), z("span", pU, k(o.value), 1)) : U("", !0)]),
				_: 1
			}, 8, ["label", "help"])
		])) : U("", !0)]));
	}
}), hU = ["value"], gU = ["value"], _U = ["value", "placeholder"], vU = ["value"], yU = [
	"list",
	"value",
	"placeholder"
], bU = ["id"], xU = ["value"], SU = ["value", "placeholder"], CU = ["value", "placeholder"], wU = { class: "col media-refs" }, TU = {
	key: 0,
	class: "media-ref-group-title ellipsis"
}, EU = { class: "badge neutral mono" }, DU = [
	"value",
	"placeholder",
	"onChange"
], OU = ["onClick"], kU = ["value"], AU = /* @__PURE__ */ F({
	__name: "ImageSettings",
	setup(e) {
		let t = W(() => OS().image), n = W(() => NS(t.value)), r = {
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
		}, i = (e) => K(`media.api.${e}`), a = xc.map((e) => ({
			value: e,
			label: K(`media.image.promptType.${e}`),
			hint: K(`media.image.promptType.${e}.hint`)
		})), o = (e, n) => {
			t.value[e] = n, kS();
		};
		function s(e, t) {
			let r = n.value;
			r && (r[e] = t, kS());
		}
		function c() {
			let e = jS("openai", K("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, kS();
		}
		function l(e) {
			let n = PS(e, K("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, kS();
		}
		function u(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), kS(), HC();
		}
		let d = (e) => {
			t.value.active = e, kS();
		}, f = (e, t) => {
			e.name = t, kS();
		}, p = (e) => {
			n.value && (MS(n.value, e), kS());
		}, m = W(() => (Y.chatRev, zC())), h = W(() => [{
			key: void 0,
			label: K("media.image.refs.global")
		}, ...m.value.map((e) => ({
			key: e.key,
			label: e.name
		}))]), g = W(() => h.value.map((e) => ({
			value: e.key ?? "",
			label: e.label
		}))), _ = W(() => h.value.map((e) => ({
			...e,
			refs: (n.value?.refs ?? []).filter((t) => t.card === e.key)
		}))), v = /* @__PURE__ */ A(null), y;
		function b(e) {
			y = e, v.value?.click();
		}
		async function x(e) {
			let t = n.value, r = y, i = [...e.target.files ?? []];
			if (e.target.value = "", t) {
				for (let e of i) {
					if (!e.type.startsWith("image/")) continue;
					let n = await BS(e, { prefix: "ref:" });
					t.refs.push({
						id: VC(t.refs),
						description: e.name.replace(/\.[^.]+$/, ""),
						blob: n,
						...r ? { card: r } : {}
					});
				}
				kS();
			}
		}
		function S(e, t) {
			t ? e.card = t : delete e.card, kS();
		}
		function C(e) {
			let r = n.value;
			r && (r.refs = r.refs.filter((t) => t !== e), kS(), t.value.connections.some((t) => t.refs.some((t) => t.blob === e.blob)) || US(e.blob));
		}
		return (e, m) => (R(), B(bP, {
			title: j(K)("media.image"),
			icon: j(zj)
		}, {
			actions: M(() => [H(ZI, {
				"model-value": t.value.enabled,
				label: j(K)("media.image"),
				"onUpdate:modelValue": m[0] ||= (e) => o("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: M(() => [t.value.enabled ? (R(), z(L, { key: 0 }, [
				H($, {
					label: j(K)("media.auto"),
					help: j(K)("media.image.auto.hint"),
					inline: ""
				}, {
					default: M(() => [H(ZI, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": m[1] ||= (e) => o("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H(sU, {
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
					H($, { label: j(K)("media.image.api") }, {
						default: M(() => [V("select", {
							class: "input",
							value: n.value.api,
							onChange: m[2] ||= (e) => p(e.target.value)
						}, [(R(!0), z(L, null, I(j(bc), (e) => (R(), z("option", {
							key: e,
							value: e
						}, k(i(e)), 9, gU))), 128))], 40, hU)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: j(K)("media.baseUrl") }, {
						default: M(() => [V("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: j(TS)[n.value.api].baseUrl,
							spellcheck: "false",
							onChange: m[3] ||= (e) => s("baseUrl", e.target.value.trim())
						}, null, 40, _U)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: j(K)("media.apiKey") }, {
						default: M(() => [V("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: m[4] ||= (e) => s("apiKey", e.target.value.trim())
						}, null, 40, vU)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: j(K)("media.model") }, {
						default: M(() => [V("input", {
							class: "input",
							list: `ap-image-models-${n.value.api}`,
							value: n.value.model,
							placeholder: j(TS)[n.value.api].model,
							spellcheck: "false",
							onChange: m[5] ||= (e) => s("model", e.target.value.trim())
						}, null, 40, yU), V("datalist", { id: `ap-image-models-${n.value.api}` }, [(R(!0), z(L, null, I(r[n.value.api], (e) => (R(), z("option", {
							key: e,
							value: e
						}, null, 8, xU))), 128))], 8, bU)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: j(K)("media.image.promptType") }, {
						default: M(() => [H(DL, {
							"model-value": n.value.promptType,
							options: j(a),
							"onUpdate:modelValue": m[6] ||= (e) => s("promptType", e)
						}, null, 8, ["model-value", "options"])]),
						_: 1
					}, 8, ["label"]),
					H($, {
						label: j(K)("media.image.style"),
						help: j(K)("media.image.style.hint")
					}, {
						default: M(() => [V("textarea", {
							class: "input",
							rows: "2",
							value: n.value.style,
							placeholder: j(K)(n.value.promptType === "tags" ? "media.image.style.tags" : "media.image.style.nl"),
							onChange: m[7] ||= (e) => s("style", e.target.value)
						}, null, 40, SU)]),
						_: 1
					}, 8, ["label", "help"]),
					n.value.api === "novelai" ? (R(), B($, {
						key: 0,
						label: j(K)("media.image.negative")
					}, {
						default: M(() => [V("textarea", {
							class: "input",
							rows: "2",
							value: n.value.negative ?? "",
							placeholder: j(K)("media.image.negative.placeholder"),
							onChange: m[8] ||= (e) => s("negative", e.target.value)
						}, null, 40, CU)]),
						_: 1
					}, 8, ["label"])) : U("", !0),
					H($, {
						label: j(K)("media.image.nsfwBlock"),
						help: j(K)("media.image.nsfwBlock.hint"),
						inline: ""
					}, {
						default: M(() => [H(ZI, {
							"model-value": n.value.nsfwBlock,
							"onUpdate:modelValue": m[9] ||= (e) => s("nsfwBlock", e)
						}, null, 8, ["model-value"])]),
						_: 1
					}, 8, ["label", "help"]),
					j(ES)(n.value.api) ? (R(), B($, {
						key: 1,
						label: j(K)("media.image.refs"),
						help: j(K)("media.image.refs.hint")
					}, {
						default: M(() => [V("div", wU, [(R(!0), z(L, null, I(_.value, (e) => (R(), z("div", {
							key: e.key ?? "",
							class: "col media-ref-group"
						}, [
							_.value.length > 1 ? (R(), z("div", TU, k(e.label), 1)) : U("", !0),
							(R(!0), z(L, null, I(e.refs, (e) => (R(), z("div", {
								key: e.blob,
								class: "media-ref"
							}, [
								H(UF, {
									"blob-key": e.blob,
									class: "media-ref-thumb",
									alt: e.description
								}, null, 8, ["blob-key", "alt"]),
								V("span", EU, k(e.id), 1),
								V("input", {
									class: "input grow",
									value: e.description,
									placeholder: j(K)("media.image.refs.description"),
									onChange: (t) => {
										e.description = t.target.value, j(kS)();
									}
								}, null, 40, DU),
								h.value.length > 1 ? (R(), B(cU, {
									key: 0,
									"model-value": e.card ?? "",
									options: g.value,
									"onUpdate:modelValue": (t) => S(e, t)
								}, null, 8, [
									"model-value",
									"options",
									"onUpdate:modelValue"
								])) : U("", !0),
								H(Q, {
									icon: j(CM),
									label: j(K)("common.delete"),
									small: "",
									danger: "",
									align: "end",
									onClick: (t) => C(e)
								}, null, 8, [
									"icon",
									"label",
									"onClick"
								])
							]))), 128)),
							V("button", {
								type: "button",
								class: "btn ghost add",
								onClick: (t) => b(e.key)
							}, [H(j(Rj)), wa(k(j(K)("media.image.refs.add")), 1)], 8, OU)
						]))), 128)), V("input", {
							ref_key: "fileInput",
							ref: v,
							type: "file",
							accept: "image/*",
							multiple: "",
							hidden: "",
							onChange: x
						}, null, 544)])]),
						_: 1
					}, 8, ["label", "help"])) : U("", !0),
					H(mU, {
						connection: n.value,
						onChanged: m[11] ||= (e) => j(kS)()
					}, {
						default: M(() => [n.value.api === "gemini" ? (R(), B($, {
							key: 0,
							label: j(K)("media.image.geminiEndpoint")
						}, {
							default: M(() => [V("select", {
								class: "input",
								value: n.value.endpoint ?? "interactions",
								onChange: m[10] ||= (e) => s("endpoint", e.target.value)
							}, [...m[12] ||= [V("option", { value: "interactions" }, "Interactions", -1), V("option", { value: "generateContent" }, "generateContent", -1)]], 40, kU)]),
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
function jU(e, t) {
	let n = HT(e)?.defaults;
	return {
		id: AS(),
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
function MU(e, t) {
	if (e.api === t) return;
	let n = HT(e.api)?.defaults, r = HT(t)?.defaults;
	(!e.baseUrl || e.baseUrl === n?.baseUrl) && (e.baseUrl = r?.baseUrl ?? ""), (!e.model || e.model === n?.model) && (e.model = r?.model ?? ""), e.api = t, e.narrator = null, e.bindings = e.bindings.map((e) => ({
		character: e.character,
		voice: null,
		...e.card ? { card: e.card } : {}
	}));
}
//#endregion
//#region src/ui/panel/media/SpeechSettings.vue?vue&type=script&setup=true&lang.ts
var NU = ["value"], PU = ["value"], FU = ["value", "placeholder"], IU = ["value"], LU = [
	"list",
	"value",
	"placeholder"
], RU = ["id"], zU = ["value"], BU = { class: "col" }, VU = {
	key: 0,
	class: "media-ref-group-title ellipsis"
}, HU = [
	"value",
	"placeholder",
	"onChange"
], UU = ["onClick"], WU = /* @__PURE__ */ F({
	__name: "SpeechSettings",
	setup(e) {
		let t = W(() => OS().speech), n = W(() => NS(t.value)), r = W(() => n.value ? UT(n.value) : void 0), i = (e) => K(`media.api.${e}`), a = (e, n) => {
			t.value[e] = n, kS();
		};
		function o(e, t) {
			let r = n.value;
			r && (r[e] = t, kS());
		}
		function s() {
			let e = jU("fish", K("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, kS();
		}
		function c(e) {
			let n = PS(e, K("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, kS();
		}
		function l(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), kS(), RE();
		}
		let u = (e) => {
			t.value.active = e, kS();
		}, d = (e, t) => {
			e.name = t, kS();
		}, f = (e) => {
			n.value && (MU(n.value, e), kS(), RE());
		}, p = W(() => (Y.chatRev, zC())), m = W(() => {
			let e = n.value;
			return e ? [{
				card: "",
				name: K("media.speech.global")
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
			}), kS();
		}
		function _(e, t) {
			Object.assign(e, t), kS();
		}
		function v(e, t) {
			t ? e.card = t : delete e.card, kS();
		}
		function y(e) {
			let t = n.value;
			t && (t.bindings = t.bindings.filter((t) => t !== e), kS(), RE());
		}
		return (e, p) => (R(), B(bP, {
			title: j(K)("media.speech"),
			icon: j(GA)
		}, {
			actions: M(() => [H(ZI, {
				"model-value": t.value.enabled,
				label: j(K)("media.speech"),
				"onUpdate:modelValue": p[0] ||= (e) => a("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: M(() => [t.value.enabled ? (R(), z(L, { key: 0 }, [
				H($, {
					label: j(K)("media.auto"),
					help: j(K)("media.speech.auto.hint"),
					inline: ""
				}, {
					default: M(() => [H(ZI, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": p[1] ||= (e) => a("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: j(K)("media.speech.narrator"),
					help: j(K)("media.speech.narrator.hint"),
					inline: ""
				}, {
					default: M(() => [H(ZI, {
						"model-value": t.value.narrator,
						"onUpdate:modelValue": p[2] ||= (e) => a("narrator", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H(sU, {
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
					H($, { label: j(K)("media.speech.api") }, {
						default: M(() => [V("select", {
							class: "input",
							value: n.value.api,
							onChange: p[3] ||= (e) => f(e.target.value)
						}, [(R(!0), z(L, null, I(j(Cc), (e) => (R(), z("option", {
							key: e,
							value: e
						}, k(i(e)), 9, PU))), 128))], 40, NU)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: j(K)("media.baseUrl") }, {
						default: M(() => [V("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: r.value?.defaults.baseUrl,
							spellcheck: "false",
							onChange: p[4] ||= (e) => o("baseUrl", e.target.value.trim())
						}, null, 40, FU)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: j(K)("media.apiKey") }, {
						default: M(() => [V("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: p[5] ||= (e) => o("apiKey", e.target.value.trim())
						}, null, 40, IU)]),
						_: 1
					}, 8, ["label"]),
					H($, {
						label: j(K)("media.model"),
						help: n.value.api === "openrouter" ? j(K)("media.speech.openrouterModel") : void 0
					}, {
						default: M(() => [V("input", {
							class: "input",
							list: `ap-speech-models-${n.value.api}`,
							value: n.value.model,
							placeholder: r.value?.defaults.model,
							spellcheck: "false",
							onChange: p[6] ||= (e) => o("model", e.target.value.trim())
						}, null, 40, LU), V("datalist", { id: `ap-speech-models-${n.value.api}` }, [(R(!0), z(L, null, I(r.value?.models ?? [], (e) => (R(), z("option", {
							key: e,
							value: e
						}, null, 8, zU))), 128))], 8, RU)]),
						_: 1
					}, 8, ["label", "help"]),
					t.value.narrator ? (R(), B($, {
						key: 0,
						label: j(K)("media.speech.narratorVoice")
					}, {
						default: M(() => [H($M, {
							connection: n.value,
							"model-value": n.value.narrator,
							label: j(K)("media.speech.narratorVoice"),
							placeholder: j(K)("media.speech.providerDefault"),
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
						label: j(K)("media.speech.bindings"),
						help: j(K)("media.speech.bindings.hint")
					}, {
						default: M(() => [V("div", BU, [(R(!0), z(L, null, I(m.value, (e) => (R(), z("div", {
							key: e.card,
							class: "col tight"
						}, [
							m.value.length > 1 ? (R(), z("div", VU, k(e.name), 1)) : U("", !0),
							(R(!0), z(L, null, I(e.bindings, (t, r) => (R(), z("div", {
								key: r,
								class: "speech-binding"
							}, [V("input", {
								class: "input",
								value: t.character,
								placeholder: j(K)("media.speech.character"),
								onChange: (e) => _(t, { character: e.target.value.trim() })
							}, null, 40, HU), H($M, {
								class: "grow",
								connection: n.value,
								"model-value": t.voice,
								label: t.character || j(K)("media.speech.character"),
								"onUpdate:modelValue": (e) => _(t, { voice: e })
							}, {
								default: M(() => [m.value.length > 1 ? (R(), B(cU, {
									key: 0,
									"model-value": e.card,
									options: h.value,
									"onUpdate:modelValue": (e) => v(t, e)
								}, null, 8, [
									"model-value",
									"options",
									"onUpdate:modelValue"
								])) : U("", !0), H(Q, {
									icon: j(CM),
									label: j(K)("common.delete"),
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
							}, [H(j(aM)), wa(k(j(K)("media.speech.addBinding")), 1)], 8, UU)
						]))), 128))])]),
						_: 1
					}, 8, ["label", "help"]),
					H(mU, {
						connection: n.value,
						onChanged: p[8] ||= (e) => j(kS)()
					}, null, 8, ["connection"])
				])) : U("", !0)
			], 64)) : U("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), GU = ["value"], KU = /* @__PURE__ */ F({
	__name: "MediaTab",
	setup(e) {
		let { preset: n } = SL(), r = W(() => OS().cors), i = [
			"auto",
			"on",
			"off"
		].map((e) => ({
			value: e,
			label: K(`media.cors.${e}`),
			hint: K(`media.cors.${e}.hint`)
		})), a = W(() => [{
			value: "host",
			label: t() ? "TauriTavern" : "SillyTavern",
			hint: K(t() ? "media.proxy.host.tt" : "media.proxy.host.st")
		}, {
			value: "custom",
			label: K("media.proxy.custom"),
			hint: K("media.proxy.custom.hint")
		}]);
		function o(e, t) {
			r.value[e] = t, kS();
		}
		return (e, t) => j(n) ? (R(), z(L, { key: 1 }, [
			H(bP, {
				title: j(K)("media.cors"),
				icon: j(Zj),
				collapsible: "",
				open: r.value.mode !== "auto" || r.value.proxy !== "host"
			}, {
				default: M(() => [H(DL, {
					"model-value": r.value.mode,
					options: j(i),
					"onUpdate:modelValue": t[0] ||= (e) => o("mode", e)
				}, null, 8, ["model-value", "options"]), r.value.mode === "off" ? U("", !0) : (R(), z(L, { key: 0 }, [H($, { label: j(K)("media.proxy") }, {
					default: M(() => [H(DL, {
						"model-value": r.value.proxy,
						options: a.value,
						"onUpdate:modelValue": t[1] ||= (e) => o("proxy", e)
					}, null, 8, ["model-value", "options"])]),
					_: 1
				}, 8, ["label"]), r.value.proxy === "custom" ? (R(), B($, {
					key: 0,
					label: j(K)("media.proxy.url")
				}, {
					default: M(() => [V("input", {
						class: "input mono",
						value: r.value.customUrl,
						placeholder: "https://proxy.example/?url={url}",
						spellcheck: "false",
						onChange: t[2] ||= (e) => o("customUrl", e.target.value.trim())
					}, null, 40, GU)]),
					_: 1
				}, 8, ["label"])) : U("", !0)], 64))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"open"
			]),
			j(Fw)(j(n)) ? (R(), B(AU, { key: 0 })) : U("", !0),
			j(Iw)(j(n)) ? (R(), B(WU, { key: 1 })) : U("", !0)
		], 64)) : (R(), B(wL, { key: 0 }));
	}
}), qU = ["aria-label"], JU = { class: "panel-head" }, YU = { class: "panel-logo" }, XU = { class: "grow" }, ZU = { class: "panel-title ellipsis" }, QU = { class: "panel-sub ellipsis" }, $U = [
	"title",
	"aria-selected",
	"onClick"
], eW = { class: "panel-body scroll" }, tW = /* @__PURE__ */ F({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: $j,
				view: bL
			},
			{
				id: "config",
				icon: hM,
				view: xR
			},
			{
				id: "modules",
				icon: qA,
				view: YB
			},
			{
				id: "writing",
				icon: nM,
				view: iV
			},
			{
				id: "memory",
				icon: JA,
				view: wV
			},
			{
				id: "storylines",
				icon: Mj,
				view: $H
			},
			{
				id: "media",
				icon: oj,
				view: KU
			},
			{
				id: "debug",
				icon: YA,
				view: IH
			}
		], n = W(() => t.filter((e) => (e.id !== "storylines" || dA.value) && (e.id !== "media" || Lw(KC.value)))), r = W(() => n.value.find((e) => e.id === Y.tab) ?? n.value[0]), i = W({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), a = W(() => {
			let e = KC.value;
			return e ? `v${e.version} · ${qC.value.config}` : K("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && Y.panelOpen && (Y.panelOpen = !1);
		};
		return Qr(() => document.addEventListener("keydown", o)), ei(() => {
			document.removeEventListener("keydown", o), jN(!1);
		}), P(() => Y.panelOpen, (e) => {
			e && jN(!0);
		}, { immediate: !0 }), (e, t) => (R(), B(po, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => j(jN)(!1)
		}, {
			default: M(() => [j(Y).panelOpen ? (R(), z("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": j(K)("app.name")
			}, [
				V("header", JU, [
					V("div", YU, [H(j(Vj))]),
					V("div", XU, [V("div", ZU, k(j(KC) ? j(rm)(j(KC)) : j(K)("app.name")), 1), V("div", QU, k(a.value), 1)]),
					H(ZI, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: j(K)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					H(Q, {
						icon: j(NM),
						label: j(K)("common.close"),
						align: "end",
						below: "",
						onClick: t[1] ||= (e) => j(Y).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				V("nav", {
					class: O(["tabs", { many: n.value.length > 6 }]),
					role: "tablist"
				}, [(R(!0), z(L, null, I(n.value, (e) => (R(), z("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: O(["tab", { on: e.id === j(Y).tab }]),
					title: j(K)(`tab.${e.id}`),
					"aria-selected": e.id === j(Y).tab,
					onClick: (t) => j(Y).tab = e.id
				}, [(R(), B(ri(e.icon))), V("span", null, k(j(K)(`tab.${e.id}`)), 1)], 10, $U))), 128))], 2),
				V("main", eW, [(R(), B(Kr, null, [(R(), B(ri(r.value.view), { key: r.value.id }))], 1024))])
			], 8, qU)) : U("", !0)]),
			_: 1
		}));
	}
}), nW = { class: "inline-drawer" }, rW = { class: "inline-drawer-toggle inline-drawer-header" }, iW = { class: "inline-drawer-content" }, aW = { class: "flex-container alignItemsCenter spaceBetween" }, oW = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, sW = { key: 0 }, cW = { class: "text_muted" }, lW = {
	key: 1,
	class: "text_muted"
}, uW = /* @__PURE__ */ F({
	__name: "SettingsDrawer",
	setup(e) {
		let t = W({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (R(), z("div", nW, [V("div", rW, [V("b", null, k(j(K)("app.name")), 1), n[3] ||= V("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), V("div", iW, [
			V("div", aW, [V("label", oW, [N(V("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[ds, t.value]]), V("span", null, k(j(K)("settings.enable")), 1)]), V("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => j(ZC)(),
				onKeydown: n[2] ||= Ss((e) => j(ZC)(), ["enter"])
			}, [n[4] ||= V("i", { class: "fa-solid fa-layer-group" }, null, -1), V("span", null, k(j(K)("panel.open")), 1)], 32)]),
			n[5] ||= V("hr", null, null, -1),
			V("h4", null, k(j(K)("settings.preset")), 1),
			j(KC) ? (R(), z("div", sW, [wa(k(j(rm)(j(KC))) + " ", 1), V("span", cW, "v" + k(j(KC).version) + " · " + k(j(qC).config), 1)])) : (R(), z("i", lW, k(j(K)("settings.inactive")), 1))
		])]));
	}
}), dW = {
	key: 0,
	class: "preset-banner"
}, fW = { class: "preset-banner-text" }, pW = /* @__PURE__ */ F({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => j(KC) ? (R(), z("div", dW, [
			H(j(Vj), { class: "preset-banner-icon" }),
			V("span", fW, k(j(K)("banner.usesAp")), 1),
			V("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => j(ZC)()
			}, k(j(K)("panel.open")), 1)
		])) : U("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function mW() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), Es(uW).mount(t);
}
function hW() {
	PO("ap-stages", YN, ["mesid"]), PO("ap-cards", zI, ["mesid"]), PO("ap-top-cards", zI, ["mesid", "position"]), PO("ap-dock", WI), PO("ap-storyline", JI, ["mesid"]), PO("ap-panel", tW), PO("ap-preset-banner", pW), MO(), GC();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, GC);
	NN(), mW(), PA(), uA(), uN(), CN();
}
//#endregion
//#region src/index.ts
var gW = {
	version: "1.13.0",
	buildId: "d7bfae0311cadfdc",
	nextGeneration: (e) => eg(e),
	listPresets: () => fm().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => Vh(),
	update: sS,
	togglePanel: (e) => {
		Y.panelOpen = e ?? !Y.panelOpen;
	},
	annotations: Ow,
	speech: Pw
};
globalThis.advancedPresetInterceptor = ab, window.AdvancedPreset = gW;
function _W(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function vW() {
	for (let { preset: e } of fm()) try {
		await Kh(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function yW() {
	let { eventSource: t, eventTypes: n } = e();
	q(), pS(), SD(), rO(), Dw(), Nw(), qE(), yw(), await i(), await um();
	let r = YD();
	for (let { preset: e } of fm()) {
		let t = Ah(e);
		t.length && O_("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => zy(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => mS(e)), wS(), ib(), t.on(n.MESSAGE_RECEIVED, (e, t) => Sw(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		dg.setPending(null), dg.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => dg.sweep());
	let a = _W(() => {
		let e = Vh(), t = e ? gm(e) : void 0;
		t && Qh(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, a), t.on(n.OAI_PRESET_CHANGED_AFTER, a), t.on(n.OAI_PRESET_CHANGED_AFTER, lO);
	let o = async () => {
		await Promise.race([gD(), new Promise((e) => setTimeout(e, 3e3))]), await vW();
		for (let e of r) w("info", K("presets.backToBuiltin", { version: e.version }), rm(e));
		(async () => {
			await JD();
			for (let { preset: e } of fm()) await cD(e);
			await cO(), await qD();
		})(), SS({ reload: !0 }), hO(), tS();
	};
	t.on(n.APP_READY, () => void o()), hW(), O_("init", {
		version: "1.13.0",
		build: "d7bfae0311cadfdc",
		enabled: q().enabled
	});
}
var bW = nS, xW = oA;
yW().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { bW as advancedPresetOnUpdate, xW as advancedPresetRegisterChatSurface };

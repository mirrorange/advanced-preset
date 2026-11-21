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
var C = {}, ne = [], re = () => {}, ie = () => !1, ae = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), oe = (e) => e.startsWith("onUpdate:"), se = Object.assign, ce = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, le = Object.prototype.hasOwnProperty, w = (e, t) => le.call(e, t), T = Array.isArray, ue = (e) => ve(e) === "[object Map]", de = (e) => ve(e) === "[object Set]", fe = (e) => ve(e) === "[object Date]", pe = (e) => ve(e) === "[object RegExp]", E = (e) => typeof e == "function", D = (e) => typeof e == "string", me = (e) => typeof e == "symbol", he = (e) => typeof e == "object" && !!e, ge = (e) => (he(e) || E(e)) && E(e.then) && E(e.catch), _e = Object.prototype.toString, ve = (e) => _e.call(e), ye = (e) => ve(e).slice(8, -1), be = (e) => ve(e) === "[object Object]", xe = (e) => D(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Se = /* @__PURE__ */ te(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), Ce = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, we = /-\w/g, Te = Ce((e) => e.replace(we, (e) => e.slice(1).toUpperCase())), Ee = /\B([A-Z])/g, De = Ce((e) => e.replace(Ee, "-$1").toLowerCase()), Oe = Ce((e) => e.charAt(0).toUpperCase() + e.slice(1)), ke = Ce((e) => e ? `on${Oe(e)}` : ""), Ae = (e, t) => !Object.is(e, t), je = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Me = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Ne = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Pe = (e) => {
	let t = D(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Fe, Ie = () => Fe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Le(e) {
	if (T(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = D(r) ? Ve(r) : Le(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (D(e) || he(e)) return e;
}
var Re = /;(?![^(]*\))/g, ze = /:([^]+)/, Be = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Ve(e) {
	let t = {};
	return e.replace(Be, (e) => e.startsWith("/*") ? "" : e).split(Re).forEach((e) => {
		if (e) {
			let n = e.split(ze);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function O(e) {
	let t = "";
	if (D(e)) t = e;
	else if (T(e)) for (let n = 0; n < e.length; n++) {
		let r = O(e[n]);
		r && (t += r + " ");
	}
	else if (he(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var He = /* @__PURE__ */ te("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Ue(e) {
	return !!e || e === "";
}
function We(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Je(e[i], t[i], n);
	return r;
}
function Ge(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Je(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Ke(e, t, n) {
	let r = ue(e), i = ue(t);
	if (r || i || (r = de(e), i = de(t), r || i)) return r && i ? Ge(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Je(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function qe(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Je(e, t, n) {
	if (e === t) return !0;
	let r = fe(e), i = fe(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = me(e), i = me(t), r || i ? e === t : (r = T(e), i = T(t), r || i ? r && i ? qe(e, t, n, We) : !1 : (r = he(e), i = he(t), r || i ? !r || !i ? !1 : qe(e, t, n, Ke) : String(e) === String(t))));
}
function Ye(e, t) {
	return e.findIndex((e) => Je(e, t));
}
var Xe = (e) => !!(e && e.__v_isRef === !0), k = (e) => D(e) ? e : e == null ? "" : T(e) || he(e) && (e.toString === _e || !E(e.toString)) ? Xe(e) ? k(e.value) : JSON.stringify(e, Ze, 2) : String(e), Ze = (e, t) => Xe(t) ? Ze(e, t.value) : ue(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Qe(t, r) + " =>"] = n, e), {}) } : de(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Qe(e)) } : me(t) ? Qe(t) : he(t) && !T(t) && !be(t) ? String(t) : t, Qe = (e, t = "") => me(e) ? `Symbol(${e.description ?? t})` : e, $e, et = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && $e && ($e.active ? (this.parent = $e, this.index = ($e.scopes || ($e.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = $e;
			try {
				return $e = this, e();
			} finally {
				$e = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = $e, $e = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if ($e === this) $e = this.prevScope;
			else {
				let e = $e;
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
function tt() {
	return $e;
}
var nt, rt = /* @__PURE__ */ new WeakSet(), it = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, $e && ($e.active ? $e.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, rt.has(this) && (rt.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ct(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, xt(this), dt(this);
		let e = nt, t = _t;
		nt = this, _t = !0;
		try {
			return this.fn();
		} finally {
			ft(this), nt = e, _t = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ht(e);
			this.deps = this.depsTail = void 0, xt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? rt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		pt(this) && this.run();
	}
	get dirty() {
		return pt(this);
	}
}, at = 0, ot, st;
function ct(e, t = !1) {
	e.flags |= 8, t ? (e.next = st, st = e) : (e.next = ot, ot = e);
}
function lt() {
	at++;
}
function ut() {
	if (--at > 0) return;
	if (st) {
		let e = st;
		for (st = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ot;) {
		let t = ot;
		for (ot = void 0; t;) {
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
function dt(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ft(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ht(r), gt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function pt(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (mt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function mt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === St) || (e.globalVersion = St, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !pt(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = nt, r = _t;
	nt = e, _t = !0;
	try {
		dt(e);
		let n = e.fn(e._value);
		(t.version === 0 || Ae(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		nt = n, _t = r, ft(e), e.flags &= -3;
	}
}
function ht(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ht(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function gt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var _t = !0, vt = [];
function yt() {
	vt.push(_t), _t = !1;
}
function bt() {
	let e = vt.pop();
	_t = e === void 0 || e;
}
function xt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = nt;
		nt = void 0;
		try {
			t();
		} finally {
			nt = e;
		}
	}
}
var St = 0, Ct = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, wt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!nt || !_t || nt === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== nt) t = this.activeLink = new Ct(nt, this), nt.deps ? (t.prevDep = nt.depsTail, nt.depsTail.nextDep = t, nt.depsTail = t) : nt.deps = nt.depsTail = t, Tt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = nt.depsTail, t.nextDep = void 0, nt.depsTail.nextDep = t, nt.depsTail = t, nt.deps === t && (nt.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, St++, this.notify(e);
	}
	notify(e) {
		lt();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ut();
		}
	}
};
function Tt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Tt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ Symbol(""), Ot = /* @__PURE__ */ Symbol(""), kt = /* @__PURE__ */ Symbol("");
function At(e, t, n) {
	if (_t && nt) {
		let t = Et.get(e);
		t || Et.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new wt()), r.map = t, r.key = n), r.track();
	}
}
function jt(e, t, n, r, i, a) {
	let o = Et.get(e);
	if (!o) {
		St++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (lt(), t === "clear") o.forEach(s);
	else {
		let i = T(e), a = i && xe(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === kt || !me(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(kt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Dt)), ue(e) && s(o.get(Ot)));
				break;
			case "delete":
				i || (s(o.get(Dt)), ue(e) && s(o.get(Ot)));
				break;
			case "set": ue(e) && s(o.get(Dt));
		}
	}
	ut();
}
function Mt(e) {
	let t = /* @__PURE__ */ xn(e);
	return t === e || (At(t, "iterate", kt), /* @__PURE__ */ yn(e)) ? t : /* @__PURE__ */ vn(e) ? /* @__PURE__ */ _n(e) ? t.map((e) => wn(Cn(e))) : t.map(wn) : t.map(Cn);
}
function Nt(e) {
	return At(e = /* @__PURE__ */ xn(e), "iterate", kt), e;
}
function Pt(e, t) {
	return /* @__PURE__ */ vn(e) ? wn(/* @__PURE__ */ _n(e) ? Cn(t) : t) : Cn(t);
}
var Ft = {
	__proto__: null,
	[Symbol.iterator]() {
		return It(this, Symbol.iterator, (e) => Pt(this, e));
	},
	concat(...e) {
		return Mt(this).concat(...e.map((e) => T(e) ? Mt(e) : e));
	},
	entries() {
		return It(this, "entries", (e) => (e[1] = Pt(this, e[1]), e));
	},
	every(e, t) {
		return zt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return zt(this, "filter", e, t, (e) => e.map((e) => Pt(this, e)), arguments);
	},
	find(e, t) {
		return zt(this, "find", e, t, (e) => Pt(this, e), arguments);
	},
	findIndex(e, t) {
		return zt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return zt(this, "findLast", e, t, (e) => Pt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return zt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return zt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Vt(this, "includes", e);
	},
	indexOf(...e) {
		return Vt(this, "indexOf", e);
	},
	join(e) {
		return Mt(this).join(e);
	},
	lastIndexOf(...e) {
		return Vt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return zt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Ht(this, "pop");
	},
	push(...e) {
		return Ht(this, "push", e);
	},
	reduce(e, ...t) {
		return Bt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Bt(this, "reduceRight", e, t);
	},
	shift() {
		return Ht(this, "shift");
	},
	some(e, t) {
		return zt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Ht(this, "splice", e);
	},
	toReversed() {
		return Mt(this).toReversed();
	},
	toSorted(e) {
		return Mt(this).toSorted(e);
	},
	toSpliced(...e) {
		return Mt(this).toSpliced(...e);
	},
	unshift(...e) {
		return Ht(this, "unshift", e);
	},
	values() {
		return It(this, "values", (e) => Pt(this, e));
	}
};
function It(e, t, n) {
	let r = Nt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ yn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Lt(a.next(), n), i !== Rt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Lt(a._next(), n);
	}
	return a;
}
function Lt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Rt = Array.prototype;
function zt(e, t, n, r, i, a) {
	let o = Nt(e), s = o !== e && !/* @__PURE__ */ yn(e), c = o[t];
	if (c !== Rt[t]) {
		let t = c.apply(e, a);
		return s ? Cn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Pt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Bt(e, t, n, r) {
	let i = Nt(e), a = i !== e && !/* @__PURE__ */ yn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Pt(e, t)), n.call(this, t, Pt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Pt(e, c) : c;
}
function Vt(e, t, n) {
	let r = /* @__PURE__ */ xn(e);
	At(r, "iterate", kt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ bn(n[0]) ? (n[0] = /* @__PURE__ */ xn(n[0]), r[t](...n)) : i;
}
function Ht(e, t, n = []) {
	yt(), lt();
	let r = (/* @__PURE__ */ xn(e))[t].apply(e, n);
	return ut(), bt(), r;
}
var Ut = /* @__PURE__ */ te("__proto__,__v_isRef,__isVue"), Wt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(me));
function Gt(e) {
	me(e) || (e = String(e));
	let t = /* @__PURE__ */ xn(this);
	return At(t, "has", e), t.hasOwnProperty(e);
}
var Kt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? dn : un : i ? ln : cn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = T(e);
		if (!r) {
			let e;
			if (a && (e = Ft[t])) return e;
			if (t === "hasOwnProperty") return Gt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Tn(e) ? e : n);
		if ((me(t) ? Wt.has(t) : Ut(t)) || (r || At(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Tn(o)) {
			let e = a && xe(t) ? o : o.value;
			return r && he(e) ? /* @__PURE__ */ hn(e) : e;
		}
		return he(o) ? r ? /* @__PURE__ */ hn(o) : /* @__PURE__ */ pn(o) : o;
	}
}, qt = class extends Kt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = T(e) && xe(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ vn(i);
			if (!/* @__PURE__ */ yn(n) && !/* @__PURE__ */ vn(n) && (i = /* @__PURE__ */ xn(i), n = /* @__PURE__ */ xn(n)), !a && /* @__PURE__ */ Tn(i) && !/* @__PURE__ */ Tn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : w(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Tn(e) ? e : r);
		return e === /* @__PURE__ */ xn(r) && s && (o ? Ae(n, i) && jt(e, "set", t, n, i) : jt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = w(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && jt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!me(t) || !Wt.has(t)) && At(e, "has", t), n;
	}
	ownKeys(e) {
		return At(e, "iterate", T(e) ? "length" : Dt), Reflect.ownKeys(e);
	}
}, Jt = class extends Kt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Yt = /* @__PURE__ */ new qt(), Xt = /* @__PURE__ */ new Jt(), Zt = /* @__PURE__ */ new qt(!0), Qt = (e) => e, $t = (e) => Reflect.getPrototypeOf(e);
function en(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ xn(i), o = ue(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Qt : t ? wn : Cn;
		return !t && At(a, "iterate", c ? Ot : Dt), se(Object.create(l), { next() {
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
function tn(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function nn(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ xn(r), a = /* @__PURE__ */ xn(n);
			e || (Ae(n, a) && At(i, "get", n), At(i, "get", a));
			let { has: o } = $t(i), s = t ? Qt : e ? wn : Cn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && At(/* @__PURE__ */ xn(t), "iterate", Dt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ xn(n), i = /* @__PURE__ */ xn(t);
			return e || (Ae(t, i) && At(r, "has", t), At(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ xn(a), s = t ? Qt : e ? wn : Cn;
			return !e && At(o, "iterate", Dt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return se(n, e ? {
		add: tn("add"),
		set: tn("set"),
		delete: tn("delete"),
		clear: tn("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ xn(this), r = $t(n), i = /* @__PURE__ */ xn(e), a = !t && !/* @__PURE__ */ yn(e) && !/* @__PURE__ */ vn(e) ? i : e;
			return r.has.call(n, a) || Ae(e, a) && r.has.call(n, e) || Ae(i, a) && r.has.call(n, i) || (n.add(a), jt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ yn(n) && !/* @__PURE__ */ vn(n) && (n = /* @__PURE__ */ xn(n));
			let r = /* @__PURE__ */ xn(this), { has: i, get: a } = $t(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ xn(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Ae(n, s) && jt(r, "set", e, n, s) : jt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ xn(this), { has: n, get: r } = $t(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ xn(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && jt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ xn(this), t = e.size !== 0, n = e.clear();
			return t && jt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = en(r, e, t);
	}), n;
}
function rn(e, t) {
	let n = nn(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(w(n, i) && i in r ? n : r, i, a);
}
var an = { get: /* @__PURE__ */ rn(!1, !1) }, on = { get: /* @__PURE__ */ rn(!1, !0) }, sn = { get: /* @__PURE__ */ rn(!0, !1) }, cn = /* @__PURE__ */ new WeakMap(), ln = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap(), dn = /* @__PURE__ */ new WeakMap();
function fn(e) {
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
function pn(e) {
	return /* @__PURE__ */ vn(e) ? e : gn(e, !1, Yt, an, cn);
}
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return gn(e, !1, Zt, on, ln);
}
// @__NO_SIDE_EFFECTS__
function hn(e) {
	return gn(e, !0, Xt, sn, un);
}
function gn(e, t, n, r, i) {
	if (!he(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = fn(ye(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function _n(e) {
	return /* @__PURE__ */ vn(e) ? /* @__PURE__ */ _n(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function yn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function bn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function xn(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ xn(t) : e;
}
function Sn(e) {
	return !w(e, "__v_skip") && Object.isExtensible(e) && Me(e, "__v_skip", !0), e;
}
var Cn = (e) => he(e) ? /* @__PURE__ */ pn(e) : e, wn = (e) => he(e) ? /* @__PURE__ */ hn(e) : e;
// @__NO_SIDE_EFFECTS__
function Tn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function A(e) {
	return En(e, !1);
}
function En(e, t) {
	return /* @__PURE__ */ Tn(e) ? e : new Dn(e, t);
}
var Dn = class {
	constructor(e, t) {
		this.dep = new wt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ xn(e), this._value = t ? e : Cn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ yn(e) || /* @__PURE__ */ vn(e);
		e = n ? e : /* @__PURE__ */ xn(e), Ae(e, t) && (this._rawValue = e, this._value = n ? e : Cn(e), this.dep.trigger());
	}
};
function j(e) {
	return /* @__PURE__ */ Tn(e) ? e.value : e;
}
var On = {
	get: (e, t, n) => t === "__v_raw" ? e : j(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Tn(i) && !/* @__PURE__ */ Tn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function kn(e) {
	return /* @__PURE__ */ _n(e) ? e : new Proxy(e, On);
}
var An = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new wt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function jn(e) {
	return new An(e);
}
var Mn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new wt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = St - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && nt !== this) return ct(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return mt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Nn(e, t, n = !1) {
	let r, i;
	return E(e) ? r = e : (r = e.get, i = e.set), new Mn(r, i, n);
}
var Pn = {}, Fn = /* @__PURE__ */ new WeakMap(), In = void 0;
function Ln(e, t = !1, n = In) {
	if (n) {
		let t = Fn.get(n);
		t || Fn.set(n, t = []), t.push(e);
	}
}
function Rn(e, t, n = C) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ yn(e) || i === !1 || i === 0 ? zn(e, 1) : zn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ Tn(e) ? (d = () => e.value, m = /* @__PURE__ */ yn(e)) : /* @__PURE__ */ _n(e) ? (d = () => l(e), m = !0) : T(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ _n(e) || /* @__PURE__ */ yn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ Tn(e)) return e.value;
		if (/* @__PURE__ */ _n(e)) return l(e);
		if (E(e)) return c ? c(e, 2) : e();
	})) : d = E(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			yt();
			try {
				f();
			} finally {
				bt();
			}
		}
		let t = In;
		In = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			In = t;
		}
	} : re, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => zn(e(), t);
	}
	let g = tt(), _ = () => {
		u.stop(), g && g.active && ce(g.effects, u);
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
	let v = h ? Array(e.length).fill(Pn) : Pn, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => Ae(e, v[t])) : Ae(n, v))) {
					let e = In;
					yt();
					try {
						f && f(), In = u;
						let e = [
							n,
							v === Pn ? void 0 : h && v[0] === Pn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						In = e, bt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new it(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => Ln(e, !1, u), f = u.onStop = () => {
		let e = Fn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Fn.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function zn(e, t = Infinity, n) {
	if (t <= 0 || !he(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Tn(e)) zn(e.value, t, n);
	else if (T(e)) for (let r = 0; r < e.length; r++) zn(e[r], t, n);
	else if (de(e) || ue(e)) e.forEach((e) => {
		zn(e, t, n);
	});
	else if (be(e)) {
		for (let r in e) zn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && zn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Bn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Hn(e, t, n);
	}
}
function Vn(e, t, n, r) {
	if (E(e)) {
		let i = Bn(e, t, n, r);
		return i && ge(i) && i.catch((e) => {
			Hn(e, t, n);
		}), i;
	}
	if (T(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Vn(e[a], t, n, r));
		return i;
	}
}
function Hn(e, t, n, r = !0) {
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
			yt(), Bn(a, null, 10, [
				e,
				i,
				o
			]), bt();
			return;
		}
	}
	Un(e, n, i, r, o);
}
function Un(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Wn = [], Gn = -1, Kn = [], qn = null, Jn = 0, Yn = /* @__PURE__ */ Promise.resolve(), Xn = null;
function Zn(e) {
	let t = Xn || Yn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Qn(e) {
	let t = Gn + 1, n = Wn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Wn[r], a = or(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function $n(e) {
	if (!(e.flags & 1)) {
		let t = or(e), n = Wn[Wn.length - 1];
		!n || !(e.flags & 2) && t >= or(n) ? Wn.push(e) : Wn.splice(Qn(t), 0, e), e.flags |= 1, er();
	}
}
function er() {
	Xn ||= Yn.then(sr);
}
function tr(e) {
	if (!T(e)) qn && e.id === -1 ? qn.splice(Jn + 1, 0, e) : e.flags & 1 || (Kn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Kn.push(e[t]);
	er();
}
function nr(e, t, n, r = Gn + 1) {
	for (; r < Wn.length; r++) {
		let n = Wn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Wn.splice(r, 1), r = e ? r - 1 : Gn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function rr(e, t, n = 0) {
	if (Kn.length) {
		let e = Kn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Kn.length; i++) {
				let a = Kn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Kn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => or(e) - or(t));
		if (Kn.length = r, qn) {
			for (let e = 0; e < i.length; e++) qn.push(i[e]);
			return;
		}
		for (qn = i, Jn = 0; Jn < qn.length; Jn++) {
			let e = qn[Jn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		qn = null, Jn = 0;
	}
}
var ir = !1;
function ar(e, t) {
	if (ir) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Kn);
	e(), ir = !0;
	try {
		nr(void 0, t), rr(void 0, n, t);
	} finally {
		ir = !1;
	}
}
var or = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function sr(e) {
	try {
		for (Gn = 0; Gn < Wn.length; Gn++) {
			let e = Wn[Gn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Bn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Gn < Wn.length; Gn++) {
			let e = Wn[Gn];
			e && (e.flags &= -2);
		}
		Gn = -1, Wn.length = 0, rr(e), Xn = null, (Wn.length || Kn.length) && sr(e);
	}
}
var cr = null, lr = null;
function ur(e) {
	let t = cr;
	return cr = e, lr = e && e.type.__scopeId || null, t;
}
function M(e, t = cr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && fa(-1);
		let i = ur(t), a = ca.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ca.length; e > a; e--) ua();
			ur(i), r._d && fa(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function N(e, t) {
	if (cr === null) return e;
	let n = Wa(cr), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = C] = t[e];
		i && (E(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && zn(a), r.push({
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
		c && (yt(), Vn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), bt());
	}
}
function fr(e, t, n = !1) {
	let r = ja();
	if (r || hi) {
		let i = hi ? hi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && E(t) ? t.call(r && r.proxy) : t;
	}
}
var pr = /* @__PURE__ */ Symbol.for("v-scx"), mr = () => fr(pr);
function hr(e, t) {
	return vr(e, null, t);
}
function gr(e, t) {
	return vr(e, null, { flush: "sync" });
}
function _r(e, t, n) {
	return vr(e, t, n);
}
function vr(e, t, n = C) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = se({}, n), c = t && r || !t && a !== "post", l;
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
	s.call = (e, t, n) => Vn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Ki(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : $n(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Rn(e, t, s);
	return La && (l ? l.push(f) : c && f()), f;
}
var yr = /* @__PURE__ */ Symbol("_vte"), br = (e) => e.__isTeleport, xr = /* @__PURE__ */ Symbol("_leaveCb"), Sr = /* @__PURE__ */ Symbol("_enterCb");
function Cr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Yr(() => {
		e.isMounted = !0;
	}), Zr(() => {
		e.isUnmounting = !0;
	}), e;
}
var wr = [Function, Array], Tr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: wr,
	onEnter: wr,
	onAfterEnter: wr,
	onEnterCancelled: wr,
	onBeforeLeave: wr,
	onLeave: wr,
	onAfterLeave: wr,
	onLeaveCancelled: wr,
	onBeforeAppear: wr,
	onAppear: wr,
	onAfterAppear: wr,
	onAppearCancelled: wr
}, Er = {
	name: "BaseTransition",
	props: Tr,
	setup(e, { slots: t }) {
		let n = ja(), r = Cr();
		return () => {
			let i = t.default && Pr(t.default(), !0), a = i && i.length ? Dr(i) : n.subTree ? U() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ xn(e), { mode: s } = o;
			if (r.isLeaving) return jr(a);
			let c = Mr(a);
			if (!c) return jr(a);
			let l = Ar(c, o, r, n, (e) => l = e);
			c.type !== oa && Nr(c, l);
			let u = n.subTree && Mr(n.subTree);
			if (u && u.type !== oa && !ha(u, c) && Fr(n.subTree)) {
				let e = Ar(u, o, r, n);
				if (Nr(u, e), s === "out-in" && c.type !== oa) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, jr(a);
				s === "in-out" && c.type !== oa ? e.delayLeave = (e, t, n) => {
					let i = kr(r, u);
					i[String(u.key)] = u, e[xr] = () => {
						t(), e[xr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Dr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== oa) {
			t = n;
			break;
		}
	}
	return t;
}
var Or = Er;
function kr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function Ar(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = kr(n, e), S = (e, t) => {
		e && Vn(e, r, 9, t);
	}, ee = (e, t) => {
		let n = t[1];
		S(e, t), T(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, te = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[xr] && t[xr](!0);
			let i = x[b];
			if (i && ha(e, i)) {
				let e = i.el[xr];
				if (!e) {
					let t = Fr(i);
					e = t && t.el[xr];
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
			t[Sr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), te.delayedLeave && te.delayedLeave(), t[Sr] = void 0);
			};
			let c = t[Sr].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[Sr] && t[Sr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[xr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[xr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[xr].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = Ar(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return te;
}
function jr(e) {
	if (Hr(e)) return e = ba(e), e.children = null, e;
}
function Mr(e) {
	if (!Hr(e)) return br(e.type) && e.children ? Dr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && E(n.default)) return n.default();
	}
}
function Nr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Nr(br(n.type) && Mr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === I && T(e.children)) {
		let n = Si(e.children, !1);
		n && Nr(n, t);
	}
}
function Pr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === I ? (o.patchFlag & 128 && i++, r = r.concat(Pr(o.children, t, s))) : (t || o.type !== oa) && r.push(s == null ? o : ba(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Fr(e) {
	if (e.component) return Fr(e.component.subTree);
	if (e.type === I) {
		let t = T(e.children) && Si(e.children, !1);
		return t ? Fr(t) : void 0;
	}
	if (e.type !== oa) return e;
}
// @__NO_SIDE_EFFECTS__
function P(e, t) {
	return E(e) ? /* @__PURE__ */ se({ name: e.name }, t, { setup: e }) : e;
}
function Ir(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Lr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Rr = /* @__PURE__ */ new WeakMap();
function zr(e, t, n, r, i = !1) {
	if (T(e)) {
		e.forEach((e, a) => zr(e, t && (T(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Vr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && zr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Wa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === C ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ xn(d), p = d === C ? ie : (e) => !Lr(u, e) && w(f, e), m = (e, t) => !(t && Lr(u, t));
	if (l != null && l !== c) {
		if (Br(t), D(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ Tn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (E(c)) Bn(c, s, 12, [o, u]);
	else {
		let t = D(c), r = /* @__PURE__ */ Tn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) T(n) && ce(n, a);
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
					s(), Rr.delete(e);
				};
				t.id = -1, Rr.set(e, t), Ki(t, n);
			} else Br(e), s();
		}
	}
}
function Br(e) {
	let t = Rr.get(e);
	t && (t.flags |= 8, Rr.delete(e));
}
Ie().requestIdleCallback, Ie().cancelIdleCallback;
var Vr = (e) => !!e.type.__asyncLoader, Hr = (e) => e.type.__isKeepAlive, Ur = {
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
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Ki(() => {
				a.isDeactivated = !1, a.a && je(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && Ta(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			ta(t.m), ta(t.a), l(e, f, null, 1, s), Ki(() => {
				t.da && je(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && Ta(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Gr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ga(Vr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !ha(t, o)) ? p(t) : o && (Gr(o), t && Gr(t)), i.delete(e), a.delete(e);
		}
		_r(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Wr(e, t)), t && m((e) => !Wr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (ra(n.subTree.type) ? Ki(() => {
				let e = Kr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Kr(n.subTree)));
		};
		return Yr(_), Xr(_), Zr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Kr(t);
				if (e.type === i.type && e.key === i.key) {
					Gr(i);
					let e = i.component.da;
					e && Ki(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!ma(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Kr(r);
			if (s.type === oa) return o = null, s;
			let c = s.type, l = Ga(Vr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Wr(u, l)) || d && l && Wr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = ba(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Nr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, ra(r.type) ? r : s;
		};
	}
};
function Wr(e, t) {
	return T(e) ? e.some((e) => Wr(e, t)) : D(e) ? e.split(",").includes(t) : pe(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Gr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Kr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function qr(e, t, n = Aa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			yt();
			let i = Pa(n), a = Vn(t, n, e, r);
			return i(), bt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Jr = (e) => (t, n = Aa) => {
	(!La || e === "sp") && qr(e, (...e) => t(...e), n);
}, Yr = Jr("m"), Xr = Jr("u"), Zr = Jr("bum"), Qr = "components", $r = /* @__PURE__ */ Symbol.for("v-ndc");
function ei(e) {
	return D(e) ? ti(Qr, e, !1) || e : e || $r;
}
function ti(e, t, n = !0, r = !1) {
	let i = cr || Aa;
	if (i) {
		let n = i.type;
		if (e === Qr) {
			let e = Ga(n, !1);
			if (e && (e === t || e === Te(t) || e === Oe(Te(t)))) return n;
		}
		let a = ni(i[e] || n[e], t) || ni(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function ni(e, t) {
	return e && (e[t] || e[Te(t)] || e[Oe(Te(t))]);
}
function F(e, t, n, r) {
	let i, a = n && n[r], o = T(e);
	if (o || D(e)) {
		let n = o && /* @__PURE__ */ _n(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ yn(e), s = /* @__PURE__ */ vn(e), e = Nt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? wn(Cn(e[n])) : Cn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (he(e)) {
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
function ri(e, t) {
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
function ii(e, t, n, r, i, a) {
	if (n ??= {}, cr.ce || cr.parent && Vr(cr.parent) && cr.parent.ce) {
		let e = a != null && n.key == null ? se({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), L(), z(I, null, [V("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = ca.length;
	L();
	let c;
	try {
		let i = o && ai(o(n)), s = n.key || a || i && i.key;
		c = z(I, { key: (s && !me(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = ca.length; e > s; e--) ua();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ai(e) {
	return e.some((e) => !ma(e) || !(e.type === oa || e.type === I && !ai(e.children))) ? e : null;
}
var oi = (e) => e ? Ia(e) ? Wa(e) : oi(e.parent) : null, si = /* @__PURE__ */ se(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => oi(e.parent),
	$root: (e) => oi(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		$n(e.update);
	},
	$nextTick: (e) => e.n ||= Zn.bind(e.proxy),
	$watch: (e) => re
}), ci = (e, t) => e !== C && !e.__isScriptSetup && w(e, t), li = {
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
			else if (ci(r, t)) return o[t] = 1, r[t];
			else if (w(a, t)) return o[t] = 3, a[t];
			else if (n !== C && w(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = si[t], u, d;
		if (l) return t === "$attrs" && At(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== C && w(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, w(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ci(i, t) ? (i[t] = n, !0) : w(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ci(t, s) || w(a, s) || w(r, s) || w(si, s) || w(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? w(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ui(e) {
	return T(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function di(e, t) {
	return !e || !t ? e || t : T(e) && T(t) ? e.concat(t) : se({}, ui(e), ui(t));
}
function fi() {
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
var pi = 0;
function mi(e, t) {
	return function(n, r = null) {
		E(n) || (n = se({}, n)), r != null && !he(r) && (r = null);
		let i = fi(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: pi++,
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
					let u = c._ceVNode || V(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Wa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Vn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = hi;
				hi = c;
				try {
					return e();
				} finally {
					hi = t;
				}
			}
		};
		return c;
	};
}
var hi = null;
function gi(e, t, n = C) {
	let r = ja(), i = Te(t), a = De(t), o = _i(e, i), s = jn((o, s) => {
		let c, l = C, u;
		return gr(() => {
			let t = e[i];
			Ae(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!Ae(o, c) && !(l !== C && Ae(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), Ae(e, l) && (Ae(e, o) && !Ae(o, u) || f && l !== C && !Ae(o, c)) && s(), l = e, u = o;
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
var _i = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Te(t)}Modifiers`] || e[`${De(t)}Modifiers`];
function vi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || C, i = n, a = t.startsWith("update:"), o = a && _i(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => D(e) ? e.trim() : e)), o.number && (i = i.map(Ne)));
	let s, c = r[s = ke(t)] || r[s = ke(Te(t))];
	!c && a && (c = r[s = ke(De(t))]), c && Vn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Vn(l, e, 6, i);
	}
}
function yi(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (T(a) ? a.forEach((e) => o[e] = null) : se(o, a), he(e) && r.set(e, o), o) : (he(e) && r.set(e, null), null);
}
function bi(e, t) {
	return !e || !ae(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), w(e, t[0].toLowerCase() + t.slice(1)) || w(e, De(t)) || w(e, t));
}
function xi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = ur(e), _, v;
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
			}) : e(d, null)), v = t.props ? s : Ci(s);
		}
	} catch (t) {
		ca.length = 0, Hn(t, e, 1), _ = V(oa);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(oe) && (v = wi(v, a)), y = ba(y, v, !1, !0));
	}
	return n.dirs && (y = ba(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Nr(br(y.type) && Mr(y) || y, n.transition), _ = y, ur(g), _;
}
function Si(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ma(r)) {
			if (r.type !== oa || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Ci = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || ae(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, wi = (e, t) => {
	let n = {};
	for (let r in e) (!oe(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Ti(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Ei(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Di(o, r, n) && !bi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Ei(r, o, l) : !!o;
	return !1;
}
function Ei(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!w(e, a) || Di(t, e, a) && !bi(n, a)) return !0;
	}
	return !1;
}
function Di(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && he(r) && he(i) ? !Je(r, i) : r !== i;
}
function Oi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ki = {}, Ai = () => Object.create(ki), ji = (e) => Object.getPrototypeOf(e) === ki;
function Mi(e, t, n, r = !1) {
	let i = {}, a = Ai();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Pi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ mn(i) : e.type.props ? i : a, e.attrs = a;
}
function Ni(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ xn(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (bi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (w(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = Te(o);
						i[t] = Fi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Pi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !w(t, a) && ((r = De(a)) === a || !w(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Fi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !w(t, e)) && (delete a[e], l = !0);
	}
	l && jt(e.attrs, "set", "");
}
function Pi(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (Se(c)) continue;
		let l = t[c], u;
		i && w(i, u = Te(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : bi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ xn(n), r = s || C;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Fi(i, t, s, r[s], e, !w(r, s));
		}
	}
	return o;
}
function Fi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = w(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && E(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Pa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === De(n)) && (r = !0));
	}
	return r;
}
function Ii(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return he(e) && r.set(e, ne), ne;
	if (T(a)) for (let e = 0; e < a.length; e++) {
		let t = Te(a[e]);
		Li(t) && (o[t] = C);
	}
	else if (a) for (let e in a) {
		let t = Te(e);
		if (Li(t)) {
			let n = a[e], r = o[t] = T(n) || E(n) ? { type: n } : se({}, n), i = r.type, c = !1, l = !0;
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
	return he(e) && r.set(e, c), c;
}
function Li(e) {
	return e[0] !== "$" && !Se(e);
}
var Ri = (e) => e === "_" || e === "_ctx" || e === "$stable", zi = (e) => T(e) ? e.map(xa) : [xa(e)], Bi = (e, t, n) => {
	if (t._n) return t;
	let r = M((...e) => zi(t(...e)), n);
	return r._c = !1, r;
}, Vi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ri(n)) continue;
		let i = e[n];
		if (E(i)) t[n] = Bi(n, i, r);
		else if (i != null) {
			let e = zi(i);
			t[n] = () => e;
		}
	}
}, Hi = (e, t) => {
	let n = zi(t);
	e.slots.default = () => n;
}, Ui = (e, t, n) => {
	for (let r in t) (n || !Ri(r)) && (e[r] = t[r]);
}, Wi = (e, t, n) => {
	let r = e.slots = Ai();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ui(r, t, n), n && Me(r, "_", e, !0)) : Vi(t, r);
	} else t && Hi(e, t);
}, Gi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = C;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ui(i, t, n) : (a = !t.$stable, Vi(t, i)), o = t;
	} else t && (Hi(e, t), o = { default: 1 });
	if (a) for (let e in i) !Ri(e) && o[e] == null && delete i[e];
}, Ki = ia;
function qi(e) {
	return Ji(e);
}
function Ji(e, t) {
	let n = Ie();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = re, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ha(e, t) && (r = ve(e), D(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === ne && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case aa:
				g(e, t, n, r);
				break;
			case oa:
				_(e, t, n, r);
				break;
			case sa:
				e ?? v(t, n, r, o);
				break;
			case I:
				se(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? ce(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? zr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && zr(e.ref, null, a, e, !0);
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
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && te(e.children, f, null, i, s, Yi(e, c), l, d), _ && dr(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !Se(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Ta(p, i, e);
		}
		_ && dr(e, null, i, "beforeMount");
		let v = Zi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Ki(() => {
			try {
				p && Ta(p, i, e), v && g.enter(f), _ && dr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ra(n.type) && (n.ssContent === t || n.ssFallback === t)) {
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
		if (n && Xi(n, !1), (h = m.onVnodeBeforeUpdate) && Ta(h, n, t, e), f && dr(t, e, n, "beforeUpdate"), n && Xi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ae(e.dynamicChildren, d, c, n, r, Yi(t, i), o) : s || de(e, t, c, null, n, r, Yi(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Ki(() => {
			h && Ta(h, n, t, e), f && dr(t, e, n, "updated");
		}, r);
	}, ae = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || na(c), f = u && (c.type === I || !ha(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, oe = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== C) for (let o in t) !Se(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (Se(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, se = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), te(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ae(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Qi(e, t, !0)) : de(e, t, n, f, a, o, c, l, u);
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : le(t, n, r, i, a, o, c) : w(e, t, c);
	}, le = (e, t, n, r, i, a, o) => {
		let s = e.component = ka(e, r, i);
		if (Hr(e) && (s.ctx.renderer = be), Ra(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, T, o, a), !e.el) {
				let r = s.subTree = V(oa);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else T(s, e, t, n, i, a, o);
	}, w = (e, t, n) => {
		let r = t.component = e.component;
		if (Ti(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ue(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, T = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ea(e);
					if (n) {
						t && (t.el = c.el, ue(e, t, o)), n.asyncDep.then(() => {
							Ki(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Xi(e, !1), t ? (t.el = c.el, ue(e, t, o)) : t = c, n && je(n), (f = t.props && t.props.onVnodeBeforeUpdate) && Ta(f, s, t, c), Xi(e, !0);
				let p = xi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ve(m), e, i, a), t.el = p.el, u === null && Oi(e, p.el), r && Ki(r, i), (f = t.props && t.props.onVnodeUpdated) && Ki(() => Ta(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Vr(t);
				if (Xi(e, !1), l && je(l), !m && (o = c && c.onVnodeBeforeMount) && Ta(o, d, t), Xi(e, !0), s && Ce) {
					let t = () => {
						e.subTree = xi(e), Ce(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = xi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Ki(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Ki(() => Ta(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Vr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Ki(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new it(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => $n(u), Xi(e, !0), l();
	}, ue = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ni(e, t.props, r, n), Gi(e, t.children, n), yt(), nr(e), bt();
	}, de = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				pe(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				fe(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && _e(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? pe(l, f, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && te(f, n, r, i, a, o, s, c));
	}, fe = (e, t, n, r, i, a, o, s, c) => {
		e ||= ne, t ||= ne;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? Sa(t[f]) : xa(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? _e(e, i, a, !0, !1, d) : te(t, n, r, i, a, o, s, c, d);
	}, pe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? Sa(t[l]) : xa(t[l]);
			if (ha(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? Sa(t[f]) : xa(t[f]);
			if (ha(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? Sa(t[l]) : xa(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) D(e[l], i, a, !0), l++;
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
					D(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && ha(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? D(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let ee = b ? $i(S) : ne;
			for (_ = ee.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || na(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== ee[_] ? E(d, n, p, 2) : _--);
			}
		}
	}, E = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) E(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === I) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) E(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === sa) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[xr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Ki(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[xr];
					s._isLeaving && s[xr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, D = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (yt(), zr(s, null, n, e, !0), bt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Vr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ta(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && dr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== I || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === I && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Ki(() => {
			_ && Ta(_, t, e), h && dr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === I;
		if (o && !a) {
			he(n, r);
			return;
		}
		if (t === sa) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Fr(e) : e, c = () => {
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
		ta(c), ta(l), r && je(r), i.stop(), a ? (a.flags |= 8, D(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, D(o, e, t, n)), s && Ki(s, t), Ki(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) D(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[yr];
		return n ? f(n) : t;
	}, ye = (e, t, n) => {
		ar(() => {
			e == null ? t._vnode && D(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oa());
	}, be = {
		p: h,
		um: D,
		m: E,
		r: me,
		mt: le,
		mc: te,
		pc: de,
		pbc: ae,
		n: ve,
		o: e
	}, xe, Ce;
	return t && ([xe, Ce] = t(be)), {
		render: ye,
		hydrate: xe,
		createApp: mi(ye, xe)
	};
}
function Yi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Xi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Zi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Qi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (T(r) && T(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Sa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Qi(t, a)), a.type === aa && (a.patchFlag === -1 && (a = i[e] = Sa(a)), a.el = t.el), a.type === oa && !a.el && (a.el = t.el);
	}
}
function $i(e) {
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
function ea(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ea(t);
}
function ta(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function na(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? na(t.subTree) : null;
}
var ra = (e) => e.__isSuspense;
function ia(e, t) {
	t && t.pendingBranch ? T(e) ? t.effects.push(...e) : t.effects.push(e) : tr(e);
}
var I = /* @__PURE__ */ Symbol.for("v-fgt"), aa = /* @__PURE__ */ Symbol.for("v-txt"), oa = /* @__PURE__ */ Symbol.for("v-cmt"), sa = /* @__PURE__ */ Symbol.for("v-stc"), ca = [], la = null;
function L(e = !1) {
	ca.push(la = e ? null : []);
}
function ua() {
	ca.pop(), la = ca[ca.length - 1] || null;
}
var da = 1;
function fa(e, t = !1) {
	da += e, e < 0 && la && t && (la.hasOnce = !0);
}
function pa(e) {
	return e.dynamicChildren = da > 0 ? la || ne : null, ua(), da > 0 && la && la.push(e), e;
}
function R(e, t, n, r, i, a) {
	return pa(B(e, t, n, r, i, a, !0));
}
function z(e, t, n, r, i) {
	return pa(V(e, t, n, r, i, !0));
}
function ma(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ha(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ga = ({ key: e }) => e ?? null, _a = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : D(e) || /* @__PURE__ */ Tn(e) || E(e) ? {
	i: cr,
	r: e,
	k: t,
	f: !!n
} : e);
function B(e, t = null, n = null, r = 0, i = null, a = e === I ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ga(t),
		ref: t && _a(t),
		scopeId: lr,
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
		ctx: cr
	};
	return s ? (Ca(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= D(n) ? 8 : 16), da > 0 && !o && la && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && la.push(c), c;
}
var V = va;
function va(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === $r) && (e = oa), ma(e)) {
		let r = ba(e, t, !0);
		return n && Ca(r, n), da > 0 && !a && la && (r.shapeFlag & 6 ? la[la.indexOf(e)] = r : la.push(r)), r.patchFlag = -2, r;
	}
	if (Ka(e) && (e = e.__vccOpts), t) {
		t = ya(t);
		let { class: e, style: n } = t;
		e && !D(e) && (t.class = O(e)), he(n) && (/* @__PURE__ */ bn(n) && !T(n) && (n = se({}, n)), t.style = Le(n));
	}
	let o = D(e) ? 1 : ra(e) ? 128 : br(e) ? 64 : he(e) ? 4 : E(e) ? 2 : 0;
	return B(e, t, n, r, i, o, a, !0);
}
function ya(e) {
	return e ? /* @__PURE__ */ bn(e) || ji(e) ? se({}, e) : e : null;
}
function ba(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wa(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ga(l),
		ref: t && t.ref ? n && a ? T(a) ? a.concat(_a(t)) : [a, _a(t)] : _a(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== I ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ba(e.ssContent),
		ssFallback: e.ssFallback && ba(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Nr(u, c.clone(u)), u;
}
function H(e = " ", t = 0) {
	return V(aa, null, e, t);
}
function U(e = "", t = !1) {
	return t ? (L(), z(oa, null, e)) : V(oa, null, e);
}
function xa(e) {
	return e == null || typeof e == "boolean" ? V(oa) : T(e) ? V(I, null, e.slice()) : ma(e) ? Sa(e) : V(aa, null, String(e));
}
function Sa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ba(e);
}
function Ca(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (T(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ca(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ji(t) ? t._ctx = cr : r === 3 && cr && (cr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (E(t)) {
		if (r & 65) {
			Ca(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: cr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [H(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wa(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = O([t.class, r.class]));
		else if (e === "style") t.style = Le([t.style, r.style]);
		else if (ae(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(T(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !oe(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ta(e, t, n, r = null) {
	Vn(e, t, 7, [n, r]);
}
var Ea = fi(), Da = 0;
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
		scope: new et(!0),
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
		propsOptions: Ii(r, i),
		emitsOptions: yi(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = vi.bind(null, a), e.ce && e.ce(a), a;
}
var Aa = null, ja = () => Aa || cr, Ma, Na;
{
	let e = Ie(), t = (t, n) => {
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
	Mi(e, r, a, t), Wi(e, i, n || t);
	let o = a ? za(e, t) : void 0;
	return t && Na(!1), o;
}
function za(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, li);
	let { setup: r } = n;
	if (r) {
		yt();
		let n = e.setupContext = r.length > 1 ? Ua(e) : null, i = Pa(e), a = Bn(r, e, 0, [e.props, n]), o = ge(a);
		if (bt(), i(), (o || e.sp) && !Vr(e) && Ir(e), o) {
			if (a.then(Fa, Fa), t) return a.then((n) => {
				Na(!0);
				try {
					Ba(e, n, t);
				} finally {
					Na(!1);
				}
			}).catch((t) => {
				Hn(t, e, 0);
			});
			e.asyncDep = a;
		} else Ba(e, a, t);
	} else Va(e, t);
}
function Ba(e, t, n) {
	E(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : he(t) && (e.setupState = kn(t)), Va(e, n);
}
function Va(e, t, n) {
	let r = e.type;
	e.render ||= r.render || re;
}
var Ha = { get(e, t) {
	return At(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(kn(Sn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in si) return si[n](e);
		},
		has(e, t) {
			return t in e || t in si;
		}
	}) : e.proxy;
}
function Ga(e, t = !0) {
	return E(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ka(e) {
	return E(e) && "__vccOpts" in e;
}
var W = (e, t) => /* @__PURE__ */ Nn(e, t, La);
function qa(e, t, n) {
	try {
		fa(-1);
		let r = arguments.length;
		return r === 2 ? he(t) && !T(t) ? ma(t) ? V(e, null, [t]) : V(e, t) : V(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ma(n) && (n = [n]), V(e, t, n));
	} finally {
		fa(1);
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
}, so = /* @__PURE__ */ se({}, Tr, oo), co = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = so, e))((e, { slots: t }) => qa(Or, fo(e), t)), lo = (e, t = []) => {
	T(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, uo = (e) => e ? T(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
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
	return se(t, {
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
	if (he(e)) return [mo(e.enter), mo(e.leave)];
	{
		let t = mo(e);
		return [t, t];
	}
}
function mo(e) {
	return Pe(e);
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
	let r = e.style, i = D(n), a = !1;
	if (n && !i) {
		if (t) {
			if (D(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? jo(r, t, "");
			}
			else for (let e in t) n[e] ?? jo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? jo(r, i, "") : Fo(e, i, !D(t) && t ? t[i] : void 0, o) || jo(r, i, o);
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
	if (T(n)) n.forEach((n) => jo(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ao.test(n) ? e.setProperty(t, n.replace(Ao, ""), "important") : e.setProperty(t, n);
	else {
		let r = Po(e, t);
		Ao.test(n) ? e.setProperty(De(r), n.replace(Ao, ""), "important") : e[r] = n;
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
	let r = Te(t);
	if (r !== "filter" && r in e) return No[t] = r;
	r = Oe(r);
	for (let n = 0; n < Mo.length; n++) {
		let i = Mo[n] + r;
		if (i in e) return No[t] = i;
	}
	return t;
}
function Fo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && D(r) && n === r;
}
var Io = "http://www.w3.org/1999/xlink";
function Lo(e, t, n, r, i, a = He(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Io, t.slice(6, t.length)) : e.setAttributeNS(Io, t, n) : n == null || a && !Ue(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : me(n) ? String(n) : n);
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
		r === "boolean" ? n = Ue(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : De(e.slice(2)), t];
}
var Ko = 0, qo = /* @__PURE__ */ Promise.resolve(), Jo = () => Ko ||= (qo.then(() => Ko = 0), Date.now());
function Yo(e, t) {
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
				e && Vn(e, t, 5, a);
			}
		} else Vn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Jo(), n;
}
var Xo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Zo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? wo(e, r, o) : t === "style" ? ko(e, n, r) : ae(t) ? oe(t) || Ho(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Qo(e, t, r, o)) ? (Ro(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Lo(e, t, r, o, a, t !== "value")) : e._isVueCE && ($o(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !D(r))) ? Ro(e, Te(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Lo(e, t, r, o));
};
function Qo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Xo(t) && E(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Xo(t) && D(n) ? !1 : t in e;
}
function $o(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = Te(t);
	return Array.isArray(n) ? n.some((e) => Te(e) === r) : Object.keys(n).some((e) => Te(e) === r);
}
var es = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return T(t) ? (e) => je(t, e) : t;
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
	return t && (e = e.trim()), n && (e = Ne(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Ne(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ss = {
	deep: !0,
	created(e, t, n) {
		e[rs] = es(n), zo(e, "change", () => {
			let t = e._modelValue, n = fs(e), r = e.checked, i = e[rs];
			if (T(t)) {
				let e = Ye(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (de(t)) {
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
	if (T(t)) i = Ye(t, r.props.value) > -1;
	else if (de(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Je(t, ps(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var ls = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, zo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Ne(fs(e)) : fs(e)), r = e.multiple, i = r ? de(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? T(i) ? t.slice() : t : i];
			try {
				e[rs](i);
			} finally {
				Zn(() => {
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
	if (!n || T(e)) return Je(e, t);
	if (de(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ds(e, t) {
	let n = e.multiple, r = T(t);
	if (!n || r || de(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = fs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Ye(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Je(fs(a), t)) {
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
		let r = De(n.key);
		if (t.some((e) => e === r || _s[e] === r)) return e(n);
	}));
}, ys = /* @__PURE__ */ se({ patchProp: Zo }, no), bs;
function xs() {
	return bs ||= qi(ys);
}
var Ss = ((...e) => {
	let t = xs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ws(e);
		if (!r) return;
		let i = t._component;
		!E(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Cs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Cs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ws(e) {
	return D(e) ? document.querySelector(e) : e;
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
	return Es = /* @__PURE__ */ pn(n), Es;
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
	"novelai"
], mc = [
	"fish",
	"elevenlabs",
	"minimax",
	"gemini",
	"openai",
	"deepseek"
], hc = {
	on: !1,
	auto: !1,
	api: "",
	style: !1,
	sfw: !1,
	refs: !1
}, gc = {
	on: !1,
	auto: !1,
	api: "",
	narrator: !1,
	characters: !1
}, _c = (e) => (e ?? []).map((e) => `- ${e.id}: ${e.description}`.trimEnd()).join("\n"), vc = [
	"1:1",
	"3:4",
	"4:3",
	"9:16",
	"16:9"
], yc = [
	"prompt",
	"refs",
	"ratio",
	"caption"
], bc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function xc(e) {
	let t = Array.isArray(e) ? e.map(bc) : typeof e == "string" ? e.split(/[,，、\n]/) : [];
	return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function Sc(e) {
	let t = bc(e).trim().replace(/[：xX×/]/g, ":").replace(/\s+/g, "");
	return vc.includes(t) ? t : void 0;
}
function Cc(e) {
	let t = bc(e.prompt ?? e.description ?? e.text).trim();
	if (!t) return;
	let n = { prompt: t }, r = xc(e.refs ?? e.references);
	r.length && (n.refs = r);
	let i = Sc(e.ratio ?? e.aspect_ratio ?? e.aspectRatio);
	i && (n.ratio = i);
	let a = bc(e.caption ?? e.title).trim();
	return a && (n.caption = a), n;
}
function wc(e, t) {
	if (typeof e == "string") {
		let t = e.trim();
		if (t.startsWith("[") || t.startsWith("{")) try {
			e = JSON.parse(t);
		} catch {}
		typeof e == "string" && (e = t ? [{ prompt: t }] : []);
	}
	e && typeof e == "object" && !Array.isArray(e) && Array.isArray(e.images) && (e = e.images);
	let n = (Array.isArray(e) ? e : e && typeof e == "object" ? [e] : []).map((e) => Cc(e && typeof e == "object" ? e : { prompt: e })).filter((e) => !!e), r = t && t > 0 ? n.slice(0, t) : n;
	return r.length ? { images: r } : void 0;
}
var Tc = "speech", Ec = "character", Dc = (e) => e.text ?? e.quote, Oc = /<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>|\[[^\[\]\n]{1,40}\]/g;
function kc(e, t = Oc) {
	if (typeof t == "function") return t(e);
	let n = t.global ? t : new RegExp(t.source, `${t.flags}g`);
	n.lastIndex = 0;
	let r = e.replace(n, "");
	if (r === e) return e;
	let i = r.replace(/([ \t])[ \t]+/g, "$1");
	return /^\s/.test(e) || (i = i.replace(/^\s+/, "")), /\s$/.test(e) || (i = i.replace(/\s+$/, "")), i;
}
function Ac(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function jc(e) {
	let t = e.lastIndexOf("<"), n = e.lastIndexOf("["), r = e.length;
	return t >= 0 && !e.includes(">", t) && (r = Math.min(r, t)), n >= 0 && !e.includes("]", n) && e.length - n <= 41 && (r = Math.min(r, n)), e.slice(0, r);
}
function Mc(e, t = {}) {
	let n = t.tag || "speech", r = t.final ?? !0, i = t.cleaner ?? Oc, a = [], o = RegExp(`<${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s[^<>]*)?>`, "g"), s = `</${n}>`, c = `<${n}`, l = [], u = [], d = [], f = "", p = 0, m = (t, n) => {
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
				t -= Ac(e.slice(p), [c, s]);
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
				let e = kc(jc(t.slice(0, t.length - Ac(t, [s]))), i);
				f += e;
				break;
			}
			a.push(`speech: unterminated <${n}> dropped`), p = _;
			continue;
		}
		let b = e.slice(_, v);
		y && y.index < v && (a.push(`speech: nested <${n}> dropped`), b = b.replace(new RegExp(o.source, "g"), ""));
		let x = kc(b, i), S = f.length;
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
function Nc(e, t) {
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
var Pc = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function Fc(e, t, n = Tc) {
	let r = Nc(e, t).spans.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), i = "", a = 0;
	for (let t of r) t.start < a || (i += `${e.slice(a, t.start)}<${n} ${Ec}="${Pc(t.character)}">${Dc(t)}</${n}>`, a = t.end);
	return i + e.slice(a);
}
function Ic(e, t, n, r) {
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
function Lc(e, t, n = {}) {
	let r = Mc(e, n);
	if (!t?.length) return {
		text: r.text,
		spans: r.spans,
		anchors: t,
		warnings: r.warnings
	};
	let i = (e) => Mc(e, n).text;
	return {
		text: r.text,
		spans: r.spans,
		anchors: Ic(r.text, t, r, [i, (e) => kc(i(e), n.cleaner)]),
		warnings: r.warnings
	};
}
//#endregion
//#region packages/protocol/src/structures.ts
var Rc = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], zc = {
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
}, Bc = ["name", "previous_main"], Vc = {
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
}, Hc = {
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
	status: Rc,
	storyline: Bc,
	custom: [],
	annotations: [],
	image: yc,
	speech: []
};
function Uc(e, t = (e) => e) {
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
			properties: Object.fromEntries(Rc.map((e) => [e, i(e)])),
			required: [...Rc],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? Bc).filter((e) => Bc.includes(e));
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
			let t = yc.filter((t) => !e.requested || e.requested.includes(t)), n = {
				prompt: { type: "string" },
				refs: {
					type: "array",
					items: { type: "string" }
				},
				ratio: {
					type: "string",
					enum: [...vc]
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
function Wc(e) {
	return e === "memory" || e === "recap";
}
function Gc(e) {
	let t = {};
	for (let n of Rc) t[n] = Jc(zc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Kc(e) {
	let t = {};
	for (let n of Bc) t[n] = Jc(Vc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function qc(e) {
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
var Jc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Yc(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations":
		case "speech": return;
		case "image": return wc(t, n?.count ?? 1);
		case "reply":
		case "impersonate": return Jc(t).trim() || void 0;
		case "recap": return t === null ? null : Jc(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Jc(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Jc(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Jc(e.time),
				location: Jc(e.location),
				event: Jc(e.event),
				summary: Jc(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Gc((e) => t[e]);
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
			let e = Kc((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Jc(e.label ?? e.title).trim(),
			content: Jc(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Jc(t)]));
			}
			return Jc(t).trim() || void 0;
	}
}
function Xc(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations":
		case "speech": return;
		case "image": return wc(t.filter((e) => !e.open).map((e) => /<[A-Za-z_]/.test(e.inner) ? {
			prompt: Xs(e.inner, "prompt"),
			refs: Xs(e.inner, "refs"),
			ratio: Xs(e.inner, "ratio"),
			caption: Xs(e.inner, "caption")
		} : Ks(e.inner).trim()), e.count ?? 1);
		case "reply":
		case "impersonate": return Yc(e.kind, Ks(n.inner));
		case "recap": return Yc("recap", Ks(n.inner));
		case "memory": return Yc("memory", t.filter((e) => !e.open).map((e) => ({
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
		case "status": return Gc((e) => Xs(n.inner, e));
		case "storyline": {
			let e = Kc((e) => Xs(n.inner, e));
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
			return Yc("custom", Ks(n.inner), e);
	}
}
function Zc(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (js(a)) continue;
		let t = Js(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Xc(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Ys(e, i),
		values: n,
		open: r
	};
}
function Qc(e) {
	return Ks(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var $c = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function el(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function tl(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function nl(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function rl(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return $c(e, { n: String(t).padStart(i, "0") }) + r;
}
function il(e, t, n, r, i) {
	let a = n.filter((e) => !js(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: el(e, t)
		},
		rank: 0,
		index: n
	})), s = nl(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = tl(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? rl(u, t + 1, d, n) : n;
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
			return u && n && g(e).length ? rl(u, n.position, d, t) : t;
		}
	};
}
function al(e, t) {
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
var ol = {
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
}, sl = (e) => e;
function cl(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function ll(e, t) {
	return e.stages.filter((e) => Vs(e.when, t));
}
function ul(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function dl(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function fl(e, t, n = ol) {
	return cl(t.field?.name ?? n.turn.field, dl(e, t));
}
function pl(e, t, n = ol) {
	return cl(t.tool?.name ?? n.stage.name, dl(e, t));
}
function ml(e, t = ol) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var hl = (e, t) => t ? {
	...e,
	description: t
} : e;
function gl(e = ol, t = sl, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return hl({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: hl({ type: "string" }, i(r.old)),
				new_string: hl({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function _l(e, t, n = ol, r = sl) {
	return e.kind === "patch" ? gl(n, r, t) : hl({ type: "string" }, t);
}
function vl(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function yl(e, t, n, r, i = sl) {
	let a = r.filter((e) => !js(e)), o = (e, t) => {
		if (e) return i(t ? cl(e, dl(n, t)) : e).trim() || void 0;
	}, s = il(t, n, a, e, (t) => fl(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => pl(n, t, e), d = (t) => s.stageParam(t, ml(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = Uc(al(n, r), i), Wc(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = _l(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = ml(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = _l(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), vl(u(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => vl(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: hl({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: hl(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function bl(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function xl(e) {
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
function Sl(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = xl(e);
		return t ? [t] : [];
	});
}
function Cl(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function wl(e) {
	let t = Sl(e);
	return t.length ? Cl(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function Tl(e) {
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
function El(e, t, n = !0) {
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
function Dl(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Ol(e) {
	return e.map((e) => ({
		old_string: Xs(e, "old_string") ?? "",
		new_string: Xs(e, "new_string") ?? ""
	}));
}
function kl(e, t) {
	let n = Tl(t.stages), r = Qs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Gs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Zc(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Js(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Ol(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Ks(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Ys(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = ul(t.stages), d = u >= 0 ? t.stages[u] : void 0;
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), El(t.stages, n, t.final), Dl(t.stages, n, t.final), n;
}
function Al(e, t) {
	let n = Tl(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => fl(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = jl(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (js(e)) continue;
		let r = c(e), i = Yc(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = ul(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), El(t.stages, n, t.final), Dl(t.stages, n, t.final), n;
}
function jl(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Ml(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Nl(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Ml(e, n);
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
function Pl(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Nl(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Fl(e, t, n = !0) {
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
var Il = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Ll = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Rl = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function zl(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Bl[e]);
}
var Bl = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Vl(e) {
	return e.split(Ll).filter((e) => e !== "");
}
var Hl = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Ul(e) {
	let t = Vl(Hl(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Rl.has(n)) throw new Il(`Could not find matching close tag for "${e}".`, a);
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
var Wl = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, Gl = (e, t) => {
	throw new Il(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Kl = /* @__PURE__ */ new Map(), ql = 500;
function Jl(e) {
	let t = Kl.get(e);
	if (t) return t;
	let n = Ul(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Il(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, zl, Wl, Gl);
	return Kl.size >= ql && Kl.clear(), Kl.set(e, i), i;
}
function Yl(e, t) {
	return Jl(e)(t);
}
function Xl(e) {
	try {
		return Jl(e), null;
	} catch (e) {
		return e instanceof Il ? e : new Il(String(e));
	}
}
function Zl(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) Zl(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var Ql = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, $l = /^\s*(```|~~~)/;
function eu(e) {
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
var tu = /<!--[ \t]*#/g, nu = /<!--|-->/g;
function ru(e, t, n) {
	nu.lastIndex = t;
	for (let t = nu.exec(e); t; t = nu.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function iu(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(Ql)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(Ql, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...eu(o),
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
			let t = ru(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? au(e, t) : t;
		} else if ($l.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		tu.lastIndex = u;
		for (let t = tu.exec(e); t; t = tu.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = ru(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? au(e, r) : r, tu.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function au(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var ou = [
	"system",
	"user",
	"assistant"
], su = ["dialogue", "imperative"];
function cu(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Hs(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = Xl(e.text);
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
				ou.includes(n) || t(`@as expects one of ${ou.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: ou.includes(n) ? n : void 0,
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
				if (!n || !su.includes(n)) {
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
function lu(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = iu(e, [], 1, r), a = cu(i.tokens, r);
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
function uu(e, t, n = (e) => e, r) {
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
var du = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function fu(e) {
	let t = e.entries.flatMap((e) => du(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => du(e));
		t.push(...du(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...du(lu(n.text, n.role).content));
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
function pu(e) {
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
function mu(e, t) {
	let n = pu(e), r = pu(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function hu(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = pu(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = mu(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var gu = (e) => !!e && typeof e == "object" && !Array.isArray(e), _u = {
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
function vu(e) {
	let t = e.sendThoughtSignature;
	return t === !0 ? "vertex" : typeof t == "string" && ks.includes(t) ? t : "off";
}
function yu(e, t) {
	let n = e.thoughtSignature;
	if (t !== "off" && n) return typeof n == "string" ? t === "vertex" ? n : void 0 : n[t] || void 0;
}
var bu = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function xu(e, ...t) {
	let n = q(e);
	for (let e of t) n = Su(n, e);
	return n;
}
function Su(e, t) {
	if (t === void 0) return e;
	if (!gu(e) || !gu(t)) return q(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = Su(e[r], i);
	return n;
}
function Cu(e, t) {
	if (gu(e) && gu(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Cu(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : q(e);
}
function wu(e, t, n = "", r = [], i = Tu) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? gu(e[a]) && gu(t[a]) && (wu(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var Tu = /* @__PURE__ */ new Set(["sampling"]);
function Eu(e, t, n) {
	let r = q(e);
	for (let e of t) if (hu(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && gu(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Du(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
function Ou(e, t, n) {
	return xu(e.configurationDefaults, Du(e, t)?.diff, n);
}
//#endregion
//#region packages/protocol/src/params.ts
function ku(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function Au(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function ju(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? ku(n) : Array.isArray(e.default) ? ku(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function Mu(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Nu(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, ju(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Pu(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Fu(e, t, n) {
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
function Iu(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Pu(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Fu(r[t.var], t, e));
	}
	return r;
}
var Lu = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Ru(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Lu.test(e);
}
function zu(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Ru(e) ? e : JSON.stringify(e);
}
var Bu = (e) => !e.includes("\n") && Ru(e) ? e : JSON.stringify(e);
function Vu(e) {
	return e.map((e) => `- ${zu(e, "  ")}`).join("\n");
}
function Hu(e) {
	return [...e].map(([e, t]) => `${Bu(e)}: ${zu(t, "  ")}`).join("\n");
}
function Uu(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Vu(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Hu(e) : t === "keys" ? Vu([...e.keys()]) : t === "values" ? Vu([...e.values()]) : e.get(t) ?? "";
}
function Wu(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var Gu = [
	"all",
	"if",
	"off"
], Ku = {
	enabled: !0,
	freezeVariables: "all"
}, qu = (e) => Gu.includes(e?.freezeVariables) ? e.freezeVariables : Ku.freezeVariables, Ju = (e, t) => e === "all" ? !t.main : e === "if" && t.if, Yu = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1,
	frozen: !1
}, Xu = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u, Zu = (e) => /^[^\s#!?@][^\s#]*$/u.test(e) && !/^if\?$/iu.test(e) && [...e].length <= 64;
function Qu(e) {
	let t = Xu.exec(e);
	if (!t) return null;
	let n = t[2], r = /^if\?$/iu.test(n), i = n === "" ? "recent" : n === "?" || r ? "new" : "name";
	if (i === "name" && !Zu(n)) return null;
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
function $u(e) {
	return Qu(e)?.text ?? e;
}
function ed(e, t, n = !1) {
	let r = $u(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function td(e, t, n) {
	return n ? `${e.slice(0, t.at)}#${t.switchMain ? "!" : t.hide ? "@" : ""}${n}` : t.text;
}
function nd(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?@\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return Zu(n) ? n : "";
}
function rd(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function id(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var ad = (e) => /^if/i.test(e);
function od(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function sd(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function cd(e, t) {
	return !!e.groups[t]?.allowNone;
}
function ld(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || cd(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Vs(e.when, n)) : i;
}
function ud(e, t) {
	let n = new Set(ld(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function dd(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = id(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => {
		switch (e.kind) {
			case "storyline": return i.length ? [{
				...e,
				requested: i
			}] : [];
			case "image": return n?.image?.on ? [{
				...e,
				requested: yc.filter((e) => e !== "refs" || n.image.refs)
			}] : [];
			case "speech": return n?.speech?.on ? [e] : [];
			default: return [e];
		}
	});
}
function fd(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function pd(e, t, n, r) {
	return t && e.tools ? il(t, n, r, e.tools, (t) => fl(n, t, e.tools)) : void 0;
}
function md(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? pd(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = ju(n, o.params[e]);
		if (Mu(r)) {
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
			return Uu(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return fd(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${fd(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : bl(t, (e) => fd(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			case "storyline": return i === "main" ? c.storyline?.main ?? "" : c.storyline?.name ?? s.storyline?.name ?? "";
			case "image": return i === "refs" && s.image?.on ? _c(c.image?.refs) : "";
			case "speech": return s.speech?.on ? i === "format" ? c.speech?.format ?? "" : i === "characters" ? (c.speech?.characters ?? []).join(", ") : "" : "";
			default: return;
		}
	};
	return g;
}
function hd(e, t, n, r, i) {
	return Zl({
		...q(e),
		vars: q(Wu(t)),
		sampling: q(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function gd(e, t, n) {
	return (r) => {
		try {
			return Yl(r.text, e());
		} catch (e) {
			let i = e instanceof Il ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function _d(e, t) {
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
function vd(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? pd(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? pl(n, t, e.tools) : c?.stageField(t) ?? fl(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", fd(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function yd(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = sd(i), s = a ? ll(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = sd(i), l = ld(n, r, c), u = dd(n, l, i), d = Iu(n.vars, l), f = md({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Ws(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= hd(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Vs(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...uu(e.content, c, p, gd(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = vd(n, a, s, i.style, i.transport, r, u);
		for (let n of uu(t, c, p, gd(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = _d(e, v.get(e.id) ?? []));
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
function bd(e, t, n = {}) {
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
		modules: ud(e, t),
		params: Nu(e, t),
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
		storyline: { ...Yu },
		image: { ...hc },
		speech: { ...gc },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var xd = /* @__PURE__ */ new Set([
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
]), Sd = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Cd = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, wd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Td(e, t = {}) {
	let n = (e) => Td(e, t);
	if (!wd(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && wd(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Sd.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(wd), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Ed({
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
		return Ed({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && xd.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			wd(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Cd[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = wd(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Ed({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Ed(i, a);
}
function Ed(e, t) {
	return t && (e.nullable = !0), e;
}
function Dd(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!wd(n)) return e;
		let r = wd(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Td(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/tavern-helper.ts
var Od = "tavern_helper";
function kd(e) {
	return e.flatMap((e) => e.type === "folder" ? [e.id, ...e.scripts.map((e) => e.id)] : [e.id]);
}
//#endregion
//#region packages/protocol/src/preset-file.ts
var Ad = "1.10.0", jd = "advanced_preset_file", Md = [
	"https://github.com/mirrorange/advanced-preset",
	"https://gitlab.com/mirrorange/advanced-preset",
	"https://codeberg.org/mirrorange/advanced-preset"
], Nd = (e) => typeof e == "string" && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(e.trim()), Pd = "ap_install_notice", Fd = "⟦ap:install-notice⟧", Id = "6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3", Ld = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Rd(e) {
	let t = Ld(e) && Ld(e.extensions) ? e.extensions[jd] : void 0;
	return Ld(t) && Ld(t.artifact) ? {
		format: t.format,
		artifact: t.artifact
	} : void 0;
}
function zd(e) {
	return Rd(e)?.artifact ?? e;
}
function Bd(e) {
	let t = e.minAdvancedPreset;
	return t && mu(t, "1.10.0") > 0 ? t : Ad;
}
var Vd = (e) => typeof e == "string" && e.includes("⟦ap:region:");
function Hd(e) {
	return `${Fd}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${e.name}" ${e.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${Md.map((e) => `   - ${e}`).join("\n")}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}
function Ud(e) {
	return {
		type: "script",
		enabled: !0,
		name: "Advanced Preset Installer",
		id: Id,
		content: Gd(e.name, Bd(e)),
		info: `This preset ("${e.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${Md.join("\n")}\nIt does nothing once Advanced Preset ${Bd(e)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${Bd(e)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
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
function Wd(e, t = {}) {
	let n = e.carrier.prompts.map((e) => ({ ...e })), r = new Set(n.filter((e) => Vd(e.content)).map((e) => e.identifier));
	n.push({
		identifier: Pd,
		name: "Advanced Preset · install notice",
		role: "system",
		content: Hd(e),
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
		identifier: Pd,
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
			...t.installer === !1 ? {} : { [Od]: {
				scripts: [Ud(e)],
				variables: {}
			} },
			[jd]: a
		}
	};
}
function Gd(e, t) {
	let n = (e) => JSON.stringify(e).replace(/</g, "\\u003c");
	return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${t} or newer is running.
const PRESET = ${n(e)};
const REQUIRED = ${n(t)};
const MIRRORS = ${n(Md)};
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
var Kd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function qd(e) {
	let t = e.configurationDefaults?.connection;
	return !Kd(t) || Object.keys(_u).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				..._u,
				...t
			}
		}
	};
}
function Jd(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!Kd(t) || "userInput" in t) && (!Kd(n) || "userInput" in n)) return e;
	let r = Kd(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: Kd(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: Kd(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function Yd(e) {
	let t = e.configurationDefaults;
	if (!Kd(t)) return e;
	let n = t.cache;
	return Kd(n) && Object.keys(bu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...bu,
				...Kd(n) ? n : {}
			}
		}
	};
}
function Xd(e) {
	let t = e.configurationDefaults;
	if (!Kd(t)) return e;
	let n = t.meta;
	return Kd(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...Kd(n) ? n : {}
			}
		}
	};
}
function Zd(e) {
	let t = e.configurationDefaults;
	if (!Kd(e.storylines) || !Kd(t)) return e;
	let n = t.storylines;
	return Kd(n) && Object.keys(Ku).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...Ku,
				...Kd(n) ? n : {}
			}
		}
	};
}
function Qd(e) {
	let t = Zd(Xd(Yd(Jd(qd(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function $d(e) {
	let t = zd(e);
	return !Kd(t) || typeof t.id != "string" || !Array.isArray(t.entries) ? null : t.formatVersion === 3 ? Qd(t) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var ef = (e) => typeof e == "string" || e.enabled !== !1, tf = (e) => typeof e == "string" ? e : e.text;
function nf(e, t) {
	t ? delete e.enabled : e.enabled = !1;
}
function rf(e, t) {
	return t ? e : {
		text: e,
		enabled: !1
	};
}
var af = "user-", of = "advanced-preset.user-modules", sf = (e) => `${af}${e}`;
function cf() {
	return {
		match: "all",
		rules: []
	};
}
var lf = ["on", "off"];
function uf(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? lf.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function df(e) {
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
function ff(e, t) {
	let n = df(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var pf = (e) => ({
	t: "lit",
	v: e
});
function mf(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(pf)
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
			r: pf(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function hf(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(uf).map((e) => {
		if (e.kind === "keyword") return pf(ff(e, t));
		if (e.kind === "var") return mf(e);
		try {
			return Ls(e.source);
		} catch {
			return pf(!1);
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
function gf(e) {
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
function _f(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function vf(e, t) {
	return t.entries.filter((t) => !_f(e, t.point));
}
function yf(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function bf(e, t) {
	return (t.vars ?? []).filter((t) => yf(e, t.var)?.type !== t.type);
}
function xf(e, t) {
	return [.../* @__PURE__ */ new Set([...vf(e, t).map((e) => e.point), ...bf(e, t).map((e) => e.var)])];
}
function Sf(e) {
	if (!ef(e)) return null;
	switch (e.type) {
		case "string": return e.text.trim() ? {
			var: e.var,
			type: "string",
			text: e.text
		} : null;
		case "list": {
			let t = e.items.filter(ef).map(tf).filter((e) => e.trim());
			return t.length ? {
				var: e.var,
				type: "list",
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => ef(e) && e.key.trim()).map((e) => ({
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
function Cf(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function wf(e, t, n) {
	let r = t.filter((e) => e.enabled).map((e) => ({
		...e,
		entries: e.entries.filter(ef),
		vars: (e.vars ?? []).filter(ef)
	})).filter((e) => e.entries.length || e.vars.length);
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = sf(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: hf(t.trigger, n),
			structures: [],
			vars: t.vars.filter((t) => yf(e, t.var)?.type === t.type).map(Sf).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = _f(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Cf(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: lu(n.text, n.role).content
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
function Tf(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => du(lu(e.text, e.role).content)));
}
function Ef(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Df(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Of(e, t, n) {
	let r = t.filter((e) => hu(n, e.from));
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
				path: Ef(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Df(t.source, e)
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
var kf = (e) => !!e && typeof e == "object" && !Array.isArray(e), Af = (e, t = "") => typeof e == "string" ? e : t, jf = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Mf = [
	"system",
	"user",
	"assistant"
], Nf = [
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
function Pf(e) {
	if (!kf(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Af(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Nf.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(jf) : jf(e.value) && (t.value = e.value), t;
	}
	return null;
}
var Ff = (e) => e.enabled === !1 ? { enabled: !1 } : {};
function If(e) {
	return typeof e == "string" ? [e] : kf(e) && typeof e.text == "string" ? [e.enabled === !1 ? {
		text: e.text,
		enabled: !1
	} : e.text] : [];
}
function Lf(e) {
	if (!kf(e) || typeof e.var != "string") return [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Af(e.text),
		...Ff(e)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: Array.isArray(e.items) ? e.items.flatMap(If) : [],
		...Ff(e)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(kf).map((e) => ({
			key: Af(e.key),
			value: typeof e.value == "string" ? e.value : null,
			...Ff(e)
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t,
			...Ff(e)
		}];
	}
	return [];
}
function Rf(e) {
	if (!kf(e) || !Array.isArray(e.entries)) return null;
	let t = kf(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!kf(e)) return [];
		let n = {
			id: Af(e.id) || `e${t + 1}`,
			point: Af(e.point),
			text: Af(e.text)
		};
		return Mf.includes(e.role) && (n.role = e.role), e.enabled === !1 && (n.enabled = !1), [n];
	});
	return {
		id: Af(e.id),
		name: Af(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Lf) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Pf).filter((e) => !!e) : []
		}
	};
}
function zf(e, t) {
	return {
		format: of,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function Bf(e) {
	if (kf(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Rf).filter((e) => !!e);
		return {
			preset: kf(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Af(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Rf(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function Vf(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function Hf(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function Uf(e, t, n) {
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
function Wf(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...q(e)
		})),
		vars: q(e.vars ?? []),
		trigger: e.trigger ? q(e.trigger) : cf()
	};
}
function Gf(e) {
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
		vars: q(e.vars ?? []),
		trigger: q(e.trigger)
	};
}
function Kf(e) {
	if (Array.isArray(e)) return e.map(Kf);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = Kf(e[n]));
		return t;
	}
	return e;
}
function qf(e) {
	return JSON.stringify(Kf({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text,
			...e.enabled === !1 ? { enabled: !1 } : {}
		})),
		vars: (e.vars ?? []).flatMap(Lf),
		trigger: e.trigger ?? cf()
	}));
}
function Jf(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, qf(e.locales[t])]);
	return JSON.stringify([
		qf(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function Yf(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var Xf = "[{{time}} · {{location}}] {{event}}: {{summary}}", Zf = (e) => e === "synopsis" ? Xf : "{{value}}", Qf = "{{content}}";
function $f(e) {
	let t = e.indexOf(Qf);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(Qf, "");
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
function ep(e) {
	let t = e.history;
	if (t === void 0 || js(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: $f(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? Zf(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var tp = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, np = (e) => e.kind === "speech" && typeof e.history == "number" ? e.history : 0, rp = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function ip(e) {
	let t = e?.stages ?? [], n = rp(t);
	return n >= 0 ? el(e, t[n]) : 0;
}
function ap(e, t, n) {
	let r = e?.stages ?? [], i = (t) => el(e, t), a = rp(r), o = ip(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = tl(e, t);
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
var op = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function sp(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => op(e).trim() !== "");
}
function cp(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return lp(Xf, e, t, !1);
		case "status": return qc(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : op(t);
		case "image": {
			let e = t?.images;
			return Array.isArray(e) ? e.map((e) => `- ${e?.caption ? `${e.caption}: ` : ""}${e?.prompt ?? ""}`).join("\n") : op(t);
		}
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${op(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function lp(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Hc[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? cp(t, n) : i && (a.has(o) || t === "custom" && o in i) ? op(i[o]) : a.has(o) ? "" : e);
}
var up = (e, t) => lp(e, "synopsis", t, !1);
function dp(e, t, n) {
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
var fp = [
	"executeOnStartup",
	"executeOnUser",
	"executeOnAi",
	"executeOnChatChange",
	"executeOnGroupMemberDraft",
	"executeOnNewChat",
	"executeBeforeGeneration"
], pp = [
	"label",
	"title",
	"message"
];
function mp(e, t, n) {
	let r = (e) => Ws(e, (e) => e[0] === "name" && e.length === 2 ? t(e[1]) : void 0), i = e.qrList.map(({ id: e, ...t }, i) => {
		let a = n?.qrList?.[e], o = {
			...t,
			contextList: t.contextList.map((e) => ({ ...e })),
			id: i + 1
		};
		for (let e of pp) {
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
var hp = (e) => fp.some((t) => e[t]) || !!e.automationId;
function gp(e) {
	return (e.quickReplySets ?? []).flatMap((e) => e.qrList.filter(hp).map((t) => `${e.name} · ${t.label || t.id}: ${t.message}`));
}
//#endregion
//#region src/store/presets.ts
var _p = /* @__PURE__ */ pn(/* @__PURE__ */ new Map()), vp = /* @__PURE__ */ pn(/* @__PURE__ */ new Map());
async function yp() {
	try {
		let e = `${d()}dist/presets/`, t = await (await S(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = $d(await (await S(e + n, { cache: "no-cache" })).json());
			t && _p.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var bp = (e) => $d(e);
function xp() {
	return [.../* @__PURE__ */ new Set([
		..._p.keys(),
		...Object.keys(G().installed),
		...vp.keys()
	])].map((e) => Sp(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Sp(e) {
	let t = vp.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = wp(e), r = _p.get(e);
	if (n && (!r || mu(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Cp = /* @__PURE__ */ new WeakMap();
function wp(e) {
	let t = G().installed[e];
	if (t) return Cp.has(t) || Cp.set(t, $d(t)), Cp.get(t) ?? void 0;
}
var Tp = (e) => Sp(e)?.preset;
function Ep(e) {
	G().installed[e.id] = e, K();
}
function Dp(e) {
	delete G().installed[e], K();
}
function Op(e, t) {
	e ? vp.set(e.id, e) : t ? vp.delete(t) : vp.clear();
}
var kp = (e) => _p.has(e), Ap = (e) => _p.get(e), jp = {
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
	"debug.images.failed": "Nothing was deleted: {error}"
}, Mp = {
	en: jp,
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
		"debug.images.failed": "未删除任何图像：{error}"
	}
};
function Np() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function J(e, t = {}) {
	return ((Mp[Np()] ?? Mp[Np().split("-")[0]])?.[e] ?? jp[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function Pp(e) {
	return e.locales?.[Np()] ?? e.locales?.[Np().split("-")[0]];
}
function Fp(e, t, n, r, i) {
	let a = Pp(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Ip(e) {
	let t = Pp(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function Lp(e) {
	let t = Pp(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Rp(e, t, n) {
	return Uf(t, Np(), Pp(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/core/storylines.ts
var zp = "advanced_preset_storyline", Bp = "advanced_preset_storyline_switched", Vp = "?new", Hp = (e) => e.startsWith("?"), Up = (e) => {
	let t = e && !e.is_user ? e.extra?.[zp] : void 0;
	return typeof t == "string" ? t : void 0;
};
function Wp(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = Qu(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : Up(e[o + 1]) ?? "?" : "";
		} else {
			let e = Up(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !Hp(s) && (i = s);
	}), n;
}
var Gp = (e, t) => e === "" || e === t.main ? "" : e;
function Kp(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? ad(e);
}
function qp(e, t) {
	return e === "" ? !1 : t.hidden?.[e] ?? Kp(e, t);
}
var Jp = (e, t) => e === "" ? t.main ?? "" : Hp(e) ? "" : e;
function Yp(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !qp(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: Jp(e, n),
		main: e === "",
		if: Kp(e, n),
		hidden: qp(e, n)
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
var Xp = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function Zp(e, t, n, r = !1, i = Xp, a = "off") {
	let o = {
		main: e === "",
		if: Kp(e, t)
	};
	return {
		name: i.naming ? "" : Jp(e, t),
		...o,
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching,
		frozen: Ju(a, o)
	};
}
function Qp(e, t, n) {
	let r = Wp(e, n).map((e) => Gp(e, n)), i = (e, i = n) => ({
		keys: r,
		meta: i,
		current: e,
		input: t,
		...Xp
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? Qu(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !Hp(r[n]) && (e = r[n]);
		if (c = td(a.mes, o, e), l = !e, s(e), !e) return {
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
		if (o.form === "new") return s(Vp), o.ifLine ? {
			...i(Vp, {
				...n,
				if: {
					...n.if ?? {},
					[Vp]: !0
				}
			}),
			naming: !0,
			ifLine: !0,
			...e
		} : {
			...i(Vp),
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
	if (o.form === "name" && Gp(o.name, n) === "") return s(""), {
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
var $p = (e) => e.is_user ? $u(e.mes) : e.mes, em = 983296, tm = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, nm = (e) => `⟦${String.fromCodePoint(em + Math.min(e, 255))}⟧`;
function rm(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(tm, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function im(e, t, n, r) {
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
function am(e, t, n, r, i = "off") {
	let { meta: a, current: o } = n, s = Wp(e, a).map((e) => Gp(e, a)), c = Yp(e.map((e, i) => {
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
		let n = e[t], r = $p(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), d = {
		current: o,
		naming: l,
		input: n.input,
		view: Yp(n.keys, o, a).order,
		vars: Zp(o, a, c.isNew, c.grouped, l, i),
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
var om = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function sm(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = rm(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = rm(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var cm = "advanced_preset";
function lm(e) {
	let t = e?.extra?.[cm];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function um(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: q(n)
		}
	};
}
function dm(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[cm] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[cm] = q(n));
}
function fm(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[zp], !n.extra.advanced_preset) ? !1 : (delete n.extra[cm], !0);
}
//#endregion
//#region src/store/eventlog.ts
function pm() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var mm = (e) => `legacy-${e}`;
function hm(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = mm(n), t = !0);
	}), t;
}
function gm(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? mm(e.index) : void 0);
}
var _m = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), vm = "advanced_preset";
function ym() {
	return e().chatMetadata?.[vm]?.seedEvents ?? [];
}
function bm(t = Infinity, n) {
	let r = ym().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of lm(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function xm(e = Infinity, t) {
	let n = {};
	for (let { event: r } of bm(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function Sm(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of bm(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function Cm(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = lm(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[vm] && (e.extra[vm].events = q(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[vm] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function wm(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function Tm(e, t, n, r, i, a = pm()) {
	let o = e.globalMemory;
	hm(o.log);
	let s = wm(e)[n] ?? null;
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
var Em = (e) => e.globalMemory.cursor > 0, Dm = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Om(e) {
	Em(e) && (e.globalMemory.cursor--, K());
}
function km(e) {
	Dm(e) && (e.globalMemory.cursor++, K());
}
function Am(e, t) {
	let n = e.globalMemory.log[_m(e, t)];
	n && (n.prev === null ? Tm(e, "delete", n.key, void 0, "undo") : Tm(e, "replace", n.key, n.prev, "undo"));
}
function jm(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = pm();
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
function Mm(e, t) {
	for (let n of t) _m(e, n.id) < 0 && Tm(e, n.op, n.key, n.content, "model", n.id);
}
function Nm(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[_m(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function Pm(e) {
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
	}, K()), hm(n.globalMemory.log) && K(), n;
}
function Fm(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Du(e, n.id)?.diff;
}
function Im(e, t = Pm(e).active.ref) {
	return xu(e.configurationDefaults, Fm(e, Pm(e), t));
}
function Lm(e) {
	let t = Pm(e);
	return xu(Im(e, t.active.ref), t.active.diff);
}
function Rm(e, t) {
	let n = Pm(e);
	n.active.diff = Cu(t, Im(e, n.active.ref)) ?? {}, K();
}
function zm(e, t) {
	let n = Lm(e);
	return t(n), Rm(e, n), n;
}
function Bm(e, t) {
	let n = Pm(e);
	n.active = {
		ref: t,
		diff: {}
	}, K();
}
var Vm = (e) => Object.keys(Pm(e).active.diff ?? {}).length > 0;
function Hm(e) {
	Pm(e).active.diff = {}, K();
}
function Um(e, t) {
	let n = Pm(e), r = Lm(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Cu(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, K(), i;
}
function Wm(e, t) {
	let n = Pm(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Cu(Lm(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), K());
}
function Gm(e, t, n) {
	let r = Pm(e).saved.find((e) => e.id === t);
	r && (r.name = n, K());
}
function Km(e, t) {
	let n = Pm(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), K();
}
function qm(e) {
	let t = Pm(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = mu(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Eu(t, e.migrations, n) : q(t);
		i.push(...wu(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !Au(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Of(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && xf(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, K(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && x("warning", J("um.lostAfterUpdate", { names: s.join(", ") }), Ip(e)), i;
}
//#endregion
//#region src/store/tavern-helper.ts
var Jm = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Ym(e, t, n = []) {
	let r = Jm(t) ? t : {}, i = (e) => e.id !== Id, a = (Array.isArray(r.scripts) ? r.scripts : []).filter(Jm).filter(i).map((e) => Array.isArray(e.scripts) ? {
		...e,
		scripts: e.scripts.filter((e) => !Jm(e) || i(e))
	} : e), o = q(e ?? []), s = kd(o), c = /* @__PURE__ */ new Set([...s, ...n]), l = (e) => typeof e.id != "string" || !c.has(e.id), u = /* @__PURE__ */ new Map();
	for (let e of a) {
		typeof e.id == "string" && u.set(e.id, e);
		for (let t of Array.isArray(e.scripts) ? e.scripts.filter(Jm) : []) typeof t.id == "string" && u.set(t.id, t);
	}
	let d = (e) => {
		let t = u.get(e.id);
		t && t.type === e.type && (typeof t.enabled == "boolean" && (e.enabled = t.enabled), e.data && Jm(t.data) && (e.data = {
			...e.data,
			...q(t.data)
		}));
	};
	for (let e of o) {
		if (d(e), e.type !== "folder") continue;
		for (let t of e.scripts) d(t);
		let t = u.get(e.id), n = Jm(t) && Array.isArray(t.scripts) ? t.scripts.filter(Jm).filter(l) : [];
		e.scripts.push(...q(n));
	}
	let f = [...o, ...q(a.filter(l))], p = Jm(r.variables) ? q(r.variables) : {}, m = Object.keys(r).some((e) => e !== "scripts" && e !== "variables");
	return !f.length && !Object.keys(p).length && !m ? { owned: s } : {
		data: {
			...q(r),
			scripts: f,
			variables: p
		},
		owned: s
	};
}
function Xm(e, t) {
	let n = (e) => JSON.stringify(Jm(e) && Array.isArray(e.scripts) ? e.scripts.map((e) => Jm(e) ? {
		...e,
		data: void 0,
		scripts: Array.isArray(e.scripts) ? e.scripts.map((e) => Jm(e) ? {
			...e,
			data: void 0
		} : e) : void 0
	} : e) : []);
	return n(e) !== n(t);
}
function Zm(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of Jm(e) && Array.isArray(e.scripts) ? e.scripts.filter(Jm) : []) {
		n.set(String(t.id), t.content ?? null);
		for (let e of Array.isArray(t.scripts) ? t.scripts.filter(Jm) : []) n.set(String(e.id), e.content ?? null);
	}
	let r = JSON.stringify(t.map((e) => n.get(e) ?? null)), i = 2166136261;
	for (let e = 0; e < r.length; e++) i = Math.imul(i ^ r.charCodeAt(e), 16777619) >>> 0;
	return i.toString(16);
}
//#endregion
//#region src/store/carrier.ts
var Qm = "advanced_preset";
function $m(e) {
	let t = e?.extensions?.[Qm];
	if (!t?.tavernHelperPrevious || !t.tavernHelperScripts) return !1;
	let n = Zm(e.extensions[Od], t.tavernHelperScripts);
	return n === t.tavernHelperPrevious && n !== t.tavernHelperCode;
}
var eh = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, th = (e) => eh[e] ?? e, nh = () => e().getPresetManager("openai"), rh = (e) => `AP · ${e.name}`;
function ih() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function ah(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function oh(e, t, n) {
	let r = e.carrier.prompt_order.map((e) => ({ ...e })), i = n?.extensions?.[Qm], a = Ym(e.tavernHelperScripts, n?.extensions?.[Od], i?.presetId === e.id ? i.tavernHelperScripts : void 0), o = {
		presetId: e.id,
		version: e.version,
		hash: e.hash
	};
	if (a.owned.length) {
		let t = Zm(a.data, a.owned), n = i?.presetId === e.id ? i : void 0, r = n?.tavernHelperCode !== void 0 && n.tavernHelperCode !== t ? n.tavernHelperCode : n?.tavernHelperPrevious;
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
			[Qm]: o,
			...e.regexScripts?.length ? { regex_scripts: q(e.regexScripts) } : {},
			...a.data ? { [Od]: a.data } : {}
		}
	};
}
function sh(e) {
	let t = nh();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function ch(e, t, n) {
	let r = nh();
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
async function lh(e, t = {}) {
	let n = nh(), r = Pm(e), i = sh(e.id), a = i ?? rh(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Qm], c = !o || t.force || s?.hash !== e.hash || $m(o), l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && ah(o) !== r.carrierHash && x("info", J("carrier.reset", { name: a }));
		let n = oh(e, Lm(e), o);
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = ah(n), K(), await ch(a, n, !!t.select || l);
		let i = n.extensions[Od];
		l && Xm(o?.extensions?.tavern_helper, i) && dh(a);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
var uh = !1;
function dh(e) {
	"TavernHelper" in globalThis && !uh && (uh = !0, y(`<p>${v(J("carrier.tavernHelper.reload", { name: e }))}</p>`, J("carrier.tavernHelper.reloadNow"), J("common.later")).then((e) => {
		uh = !1, e && location.reload();
	}));
}
async function fh(e) {
	await lh(e, { select: !0 });
}
async function ph(e) {
	let t = sh(e.id);
	if (!t) return;
	let n = nh(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Lm(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...q(i)
	}, o = n.getSelectedPresetName() === t;
	mh = !0;
	try {
		await ch(t, a, o);
	} finally {
		mh = !1;
	}
}
var mh = !1;
function hh(t) {
	if (mh || ih() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Lm(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[th(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = q(r));
	}
	return Object.keys(i).length ? (zm(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var gh = null, _h = (e) => {
	gh = e;
}, vh = () => {
	let e = gh;
	return gh = null, e;
}, yh = (e) => e.meta?.enabled !== !1;
function bh(t, n) {
	if (!yh(n)) return "";
	let r = Ws(t.meta.trigger, (e) => e[0] === "name" ? fd(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function xh(e, t, n, r, i, a = [], o = !0) {
	let s = Fl(n, bh(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = sd(c);
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
	].includes(r) && !s.pure ? "story" : "task", f = o ? vh() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Sh(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Ch = 0, wh = () => `ap-${Date.now().toString(36)}-${(++Ch).toString(36)}`, Th = /* @__PURE__ */ new Map(), Eh = null, Dh = null, Oh = {
	setPending(e) {
		Eh = e;
	},
	takePending() {
		let e = Eh;
		return Eh = null, e;
	},
	peekPending: () => Eh,
	arm(e) {
		Dh = e, Th.set(e.id, e);
	},
	takeArmed() {
		let e = Dh;
		return Dh = null, e;
	},
	get: (e) => Th.get(e),
	release(e) {
		Th.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of Th) t - r.createdAt > e && Th.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function kh(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.speech ? "v" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function Ah(e, t) {
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
var jh = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, Mh = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), Nh = (e, t) => up(e, t), Ph = (e, t) => t ? jh(e)?.structures?.[t] : void 0, Fh = (e, t) => jh(e)?.structures?.[t];
function Ih(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = jh(e);
		if (a && Mh.has(a.turn)) {
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
		let n = Fl(e.item.mes, t.trigger, t.wrap);
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
				} else Ph(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && jh(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of a(t.speech?.depth ?? 0)) e.fresh.body === "full" && e.index !== t.continuing && jh(e.item)?.speech?.length && (e.fresh.speech = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && sp(Fh(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function Lh(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : Ph(r, n.synopsisId);
			return e ? Nh(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? jh(r)?.annotations : void 0, a = t.speech ? jh(r)?.speech : void 0;
			return a?.length && (e = Fc(e, a, n.speech?.tag)), i?.length && (e = fc(e, i)), t.echo?.length && n.echoes && (e = Rh(e, r, t.echo, n.echoes)), e;
		}
	}
}
function Rh(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = Fh(t, e.id);
		sp(a) && e.pieces.forEach((t, n) => i.push({
			text: lp(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? dp(e, r.contentKey, i) : e;
}
function zh(e, t) {
	let n = [];
	for (let r of Ih(e, t)) {
		let e = Lh(r, r.fresh, t);
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
function Bh(e, t) {
	return zh(e, t).map((e) => e.item);
}
function Vh(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? tp(n) : 0;
	if (r) return ld(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function Hh(e, t, n) {
	let r = Object.values(e.structures).find((e) => e.kind === "speech"), i = r ? np(r) : 0;
	if (i && e.speech && n?.speech?.on) return ld(e, t).some((e) => e.structures.includes(r.id)) ? {
		depth: i,
		tag: r.tag
	} : void 0;
}
function Uh(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function Wh(e, t, n, r) {
	let i = new Set(ld(e, t).flatMap((e) => e.structures)), a = n ? sd(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = ep(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? Vs(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...ap(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: ip(r)
	} : void 0;
}
var Gh = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function Kh(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function qh(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = Kh(e), r = Kh(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function Jh(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Gh(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Gh(l.text);
			if (c === u || c.includes(u) || qh(c, u) >= n) {
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
var Yh = 50;
function Xh(e) {
	let t = Pm(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var Zh = () => Math.random().toString(36).slice(2, 8);
function Qh(e) {
	let t = new Set(e), n = Zh();
	for (; t.has(n);) n = Zh();
	return n;
}
function $h(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: Qh(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function eg(e, t) {
	let n = Xh(e), r = {
		id: Qh(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: cf()
	};
	return e.insertionPoints.length && r.entries.push($h(e, r)), n.push(r), K(), n[n.length - 1];
}
function tg(e, t) {
	let n = Xh(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(Wf(t, Qh(n.map((e) => e.id)), { name: i })), K(), n[n.length - 1];
}
function ng(e, t, n) {
	let r = Xh(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...q(r[i]),
		id: Qh(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), K(), r[i + 1];
}
function rg(e, t) {
	let n = Pm(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), K();
}
function ig(e, t, n) {
	let r = Xh(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), K();
}
function ag(e, t) {
	return zf(q(Xh(e).filter((e) => !t || t.includes(e.id))), e);
}
function og(e, t) {
	let n = Bf(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && mu(n.preset.version, e.version) < 0 && (r = Of(r, e.migrations, n.preset.version));
	let i = Xh(e), a = r.map((e) => {
		let t = {
			...e,
			id: Qh(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return K(), {
		added: a,
		missing: a.filter((t) => xf(e, t).length).length
	};
}
function sg(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < Yh; t--) {
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
var cg = /* @__PURE__ */ pn({
	log: [],
	requests: []
}), lg = 50;
function ug(e, t) {
	cg.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), cg.log.length > lg && (cg.log.length = lg);
}
function dg(e) {
	return cg.requests.unshift(e), cg.requests.length > lg && (cg.requests.length = lg), cg.requests[0];
}
//#endregion
//#region src/core/cache.ts
function fg(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function pg(e, t) {
	return e.send_date ? fg(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var mg = 57344, hg = /⟦([\uE000-\uF8FF])⟧/g, gg = (e) => `⟦${String.fromCharCode(mg + e)}⟧`;
function _g(e) {
	let t = [];
	return {
		text: e.replace(hg, (e, n) => (t.push(n.charCodeAt(0) - mg), "")),
		marks: t
	};
}
function vg(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of Ih(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : Ah(n?.[e], t.synopsisId), l = c ?? s.fresh, u = Lh(s, s.fresh, t), d = c ? Lh(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = kh(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: kh(l),
			freshMode: kh(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function yg(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function bg(e, t, n, r, i, a = {}) {
	let o = yg(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && fg(i) === n[r]) r++;
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
		r !== null && f.push(fg(r));
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
function xg(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var Sg = "advanced-preset.cache.v1", Cg = 864e5, wg = 30, Tg = null;
function Eg() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function Dg() {
	if (Tg) return Tg;
	try {
		let e = Eg()?.getItem(Sg), t = e ? JSON.parse(e) : {};
		Tg = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		Tg = {};
	}
	return Tg;
}
function Og(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= Cg).sort((e, t) => t[1].at - e[1].at).slice(0, wg);
	Tg = Object.fromEntries(n);
	try {
		Eg()?.setItem(Sg, JSON.stringify(Tg));
	} catch {}
}
function kg() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var Ag = (e, t) => t ? `${e}\u0001${t}` : e;
function jg(e) {
	return Dg()[e];
}
function Mg(e, t) {
	Og({
		...Dg(),
		[e]: t
	}, t.at);
}
function Ng(e, t) {
	let n = Dg()[e];
	n && Mg(e, {
		...n,
		at: t
	});
}
function Pg(e, t) {
	let n = Dg(), r = (t) => Ag(e, t);
	if (!t.some(([e, t]) => r(e) in n || r(t) in n)) return;
	let i = { ...n };
	for (let [e, n] of t) delete i[r(e)], delete i[r(n)];
	for (let [e, a] of t) n[r(e)] && (i[r(a)] = n[r(e)]);
	Og(i, Date.now());
}
//#endregion
//#region src/core/input-shaping.ts
var Fg = "⟦󰀀⟧", Ig = "⟦󰀁⟧", Lg = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function Rg(e) {
	let t = e.match(Lg)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + Fg + t;
}
var zg = (e) => e.replaceAll(Fg, "");
function Bg(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = zg(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = zg(e.text));
}
function Vg(e, t, n, r) {
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
			let n = t.lastIndexOf(Fg);
			if (n < 0) continue;
			let a = zg(t.slice(0, n)).replace(Lg, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: zg(t.slice(n + 4))
			};
		}
	}
	return null;
}
var Hg = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function Ug(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? Yf(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && Hg(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (Hg(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var Wg = "stream_function_call_arguments";
function Gg(e, t, n) {
	if (e === "off" || t !== "gemini") return !1;
	if (e === "on") return !0;
	let r = String(n.chat_completion_source ?? "");
	return r === "vertexai" || r === "custom" || r === "makersuite" && !!String(n.reverse_proxy ?? "").trim();
}
function Kg(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function qg(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Wg] = !0, t() && Jg(e));
}
function Jg(e) {
	let t = Yg(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Kg(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Yg(e) {
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
var Xg = "google-gemini-v1", Zg = /* @__PURE__ */ new WeakSet(), Qg = /* @__PURE__ */ new WeakSet();
function $g(e) {
	return Zg.add(e), e;
}
function e_(e, t) {
	if (t !== "gemini" && !(t === "openai" && e.config.connection.openAiSignatures)) return;
	let n = e.config.connection.syntheticTurn, r = n ? e.preset.syntheticTurns.find((e) => e.id === n) : void 0;
	return r ? yu(r, vu(e.config.connection)) : void 0;
}
function t_(e) {
	return Qg.add(e), e;
}
function n_(e, t) {
	return !e.signatureFallback && (e.transport === "tool-single" || e.transport === "tool-multi") && !!e_(e, t);
}
function r_(e) {
	let { message: t = "", body: n = "" } = e ?? {};
	return /thought[\s_-]?signature/i.test(`${t}\n${n}`);
}
function i_(e, t, n = {}) {
	return t !== "gemini" && !(t === "openai" && n.openAi) ? e : e.map((e) => e.role !== "assistant" || !Array.isArray(e.tool_calls) || !e.tool_calls.length ? e : t === "gemini" ? o_(e, !!n.fallback) : Zg.has(e) ? s_(e, !!n.fallback, n.source === "openrouter") : e);
}
var a_ = (e, t) => t && Qg.has(e) || typeof e.signature != "string" || !e.signature ? void 0 : e.signature;
function o_(e, t) {
	let n = e.tool_calls;
	return n.every((e) => a_(e, t)) ? e : {
		...e,
		tool_calls: n.map((e) => ({
			...e,
			signature: a_(e, t) ?? "skip_thought_signature_validator"
		}))
	};
}
function s_(e, t, n) {
	let r = Array.isArray(e.reasoning_details) ? [...e.reasoning_details] : [], i = e.tool_calls.map((e) => {
		let i = a_(e, t), { signature: a, ...o } = e;
		return i ? (r.push({
			type: "reasoning.encrypted",
			data: i,
			id: e.id,
			format: Xg,
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
function c_(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of yl(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function l_(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function u_(e) {
	return yl(e.preset.tools, e.workflow, e.stages, e.structures, l_(e));
}
function d_(e) {
	let t = e.preset.tools.envelope.when;
	return !t || !e.assembly || Vs(t, e.assembly.resolve);
}
function f_(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${fd(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function p_(e, t, n) {
	let r = cl(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return l_(e)(r);
}
function m_(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = e_(r, i), l = {
		id: s,
		type: "function",
		function: {
			name: o.tool.name,
			arguments: "{}"
		},
		...c ? { signature: c } : {}
	};
	c && t_(l);
	let u = l_(r), d = u(o.tool.description);
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
			$g({
				role: "assistant",
				content: "",
				tool_calls: [l]
			}),
			{
				role: "tool",
				tool_call_id: s,
				content: p_(r, o.response[t], { first: n })
			}
		]
	};
}
function h_(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t);
	let r = String(n.chat_completion_source ?? "");
	return Array.isArray(n.messages) && (n.messages = i_(n.messages, e.family, {
		fallback: e.ctx.signatureFallback,
		source: r,
		openAi: e.ctx.config.connection.openAiSignatures
	})), e.family === "gemini" && g_(n, e.ctx.preset.tools.jsonStringHint), Gg(e.ctx.config.connection.streamToolArguments, e.family, n) && qg(n), n;
}
function g_(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Dd(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Td(e.json_schema.value, n)
	});
}
function __(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var v_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", y_ = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(Fg, ""), b_ = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(hg.source).test(e);
function x_(e) {
	for (let t of e) if (typeof t.content == "string") b_(t.content) && (t.content = _g(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && b_(e.text) && (e.text = _g(e.text).text);
}
function S_(e) {
	if (typeof e.content == "string") {
		if (!b_(e.content)) return null;
		let { text: t, marks: n } = _g(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => xg(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !b_(e.text)) return;
		let i = _g(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = xg(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function C_(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = u_(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return fg(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function w_(e) {
	return fg(e.map((e) => `${e.role}\u0000${v_(e.content)}`).join(""));
}
function T_(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return x_(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = S_(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = y_(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = y_(i.content);
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
			sticky: y_(f),
			fresh: y_(p),
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
		tools: C_(e),
		prompt: w_(t.slice(0, n))
	}, p = bg(l, jg(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function E_(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? Ng(n.chat, t) : Mg(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var D_ = "advanced_preset", O_ = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function k_() {
	let t = e().chatMetadata?.[D_]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function A_(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[D_] ??= {};
	r.storylines = t;
}
function j_(t = e().chat, n = k_()) {
	return Wp(t, n).map((e) => Gp(e, n));
}
function M_(t = e().chat, n = k_()) {
	let r = new Set(j_(t, n).filter((e) => e !== "" && !Hp(e)));
	n.main && r.add(n.main);
	for (let e of [...Object.keys(n.if ?? {}), ...Object.keys(n.hidden ?? {})]) r.add(e);
	return r;
}
function N_(t, n = e().chat, r = k_()) {
	let i = j_(n, r);
	return Yp(i, t ?? i.at(-1) ?? "", r).order;
}
function P_(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function F_(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[zp] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[zp] = n);
}
async function I_(t, n) {
	if (!t) return;
	let r = k_();
	A_({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function L_(t) {
	let n = k_();
	return !Zu(t) || j_(e().chat, n).includes(t) ? !1 : (A_({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
async function R_(t, n) {
	if (!t) return await L_(n) ? "renamed" : Zu(n) ? "taken" : "invalid";
	if (!Zu(n)) return "invalid";
	if (n === t) return "unchanged";
	let r = k_();
	if (n === r.main || j_(e().chat, r).includes(n)) return "taken";
	let i = e().chat, a = [];
	i.forEach((e, r) => {
		if (e.is_user) {
			let i = Qu(e.mes);
			if (i?.form !== "name" || i.name !== t) return;
			e.mes = td(e.mes, i, n), a.push(r);
		} else e.swipe_info?.forEach((e) => {
			e?.extra?.advanced_preset_storyline === t && (e.extra[zp] = n);
		}), e.extra?.advanced_preset_storyline === t && (e.extra[zp] = n);
	});
	let o = Kp(t, r), s = qp(t, r), c = { ...r.if ?? {} }, l = { ...r.hidden ?? {} };
	delete c[t], delete l[t], o === ad(n) ? delete c[n] : c[n] = o, s === o ? delete l[n] : l[n] = s;
	let u = {
		...r,
		if: c,
		hidden: l
	};
	Object.keys(c).length || delete u.if, Object.keys(l).length || delete u.hidden, A_(u), Pg(kg(), [[t, n]]);
	for (let t of a) e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "renamed";
}
async function z_(t, n) {
	if (!t) return;
	let r = k_();
	A_({
		...r,
		hidden: {
			...r.hidden ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
function B_(e, t) {
	if (!e) return;
	let n = k_(), r = { ...n };
	t.ifLine !== void 0 && (t.ifLine || ad(e)) && (r.if = {
		...n.if ?? {},
		[e]: t.ifLine
	}), t.hide && (r.hidden = {
		...n.hidden ?? {},
		[e]: !0
	}), A_(r);
}
function V_(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[Bp] = !0);
}
async function H_(t, n) {
	let r = k_();
	if (!Zu(t)) return "invalid";
	if (Gp(t, r) === "") return "unchanged";
	let i = e().chat, a = Wp(i, r).map((e) => Gp(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!Zu(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = ed(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? Gp(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[zp] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[zp] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && Kp(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t];
	let l = { ...r.hidden ?? {} };
	o && delete l[o], delete l[t], A_({
		...r,
		main: t,
		if: c,
		...Object.keys(l).length || r.hidden ? { hidden: l } : {}
	}), Pg(kg(), o ? [["", o], [t, ""]] : [[t, ""]]);
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/media-vars.ts
var U_ = {
	image: () => ({
		vars: { ...hc },
		refs: []
	}),
	speech: () => ({
		vars: { ...gc },
		format: "",
		characters: []
	})
}, W_ = {};
function G_(e) {
	W_ = {
		...W_,
		...e
	};
}
function K_() {
	return {
		image: W_.image ?? U_.image,
		speech: W_.speech ?? U_.speech
	};
}
var q_ = (e, t, n) => {
	try {
		return e();
	} catch (e) {
		return console.error(`[AP] ${n} runtime failed`, e), t();
	}
};
function J_(e) {
	if (!e.image) return U_.image();
	let t = q_(() => K_().image(), U_.image, "image");
	if (!t.vars.on) return {
		vars: { ...hc },
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
function Y_(e) {
	if (!e.speech) return U_.speech();
	let t = q_(() => K_().speech(), U_.speech, "speech");
	if (!t.vars.on) return {
		vars: { ...gc },
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
var X_ = /⟦ap:region:([\w.-]+)⟧/g, Z_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function Q_(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(X_)) {
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
function $_(t, n, r) {
	if (!yh(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = fd(t, n, t.user), s = fd(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = lm(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? Qc(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function ev(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = lm(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : qc(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var tv = (e) => e?.view;
function nv(t, n) {
	let { preset: r, config: i } = t, a = tv(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = ev(r, s), l = xm(Infinity, a), u = wm(Pm(r)), d = Sm(Infinity, a), f = $_(r, i, s), p = O_(r, i) ? k_().main ?? "" : "", m = t.transport, h = t.origin === "story", g = J_(h ? r : {}), _ = Y_(h ? r : {});
	return {
		vars: bd(r, i, {
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
				...Yu,
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
			inputText: t.inputShaped ? Ig : "",
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
function rv(t, n, r) {
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
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = Jh(c.map(({ m: e }) => ({
		role: e.role,
		text: Z_(e.content)
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
			mes: Z_(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (O_(i, a)) {
		let e = am(p, m, Qp(l, -1, k_()), -1, qu(a.storylines));
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = nv(t, Sh(i, a, t.origin)).vars, v = {
		trigger: bh(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...Uh(i),
		echoes: Wh(i, a, _, Sh(i, a, "story")),
		recap: Sm(Infinity, tv(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: Vh(i, a),
		speech: Hh(i, a, _),
		...g ? { background: (e) => om(g, h[e]) } : {}
	}, y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = Ag(kg(), g?.current), n = vg(p, v, jg(e)?.modes, (e) => pg(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			y.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + gg(e.entry));
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
	} else for (let e of Bh(p, v)) y.set(e.__h, e.mes), b.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = b.get(e);
		e >= 0 && y.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (y.set(e, Rg(y.get(e))), t.input = { texts: n });
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
function iv(t, n) {
	let r = n ? null : Oh.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Lm(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = xh(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: wh(),
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
		keywords: sg(a, n ? o : -1)
	};
}
var av = Symbol("ap-region");
function ov(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function sv(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? Vg(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (Bg(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(Ig) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		Ug(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(Ig, () => c) : e;
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
function cv(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return im(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = od(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, av, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && Z_(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function lv(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => Z_(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${fd(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = Z_(t.content);
		if (t[av] || t.role === "system") return n;
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
var uv = /* @__PURE__ */ new Set();
function dv(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !uv.has(n) && (uv.add(n), x("warning", J("warn.template", { error: n }), J("app.name")));
}
function fv(e) {
	let t = (e) => (typeof e.content == "string" ? e.content : JSON.stringify(e.content ?? "")).includes(Fd);
	for (let n = e.length - 1; n >= 0; n--) t(e[n]) && e.splice(n, 1);
}
async function pv(t) {
	let { chat: n, dryRun: r } = t;
	if (fv(n), !G().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		x_(n), Bg(n), sm(n), r || (Oh.setPending(null), Oh.takeArmed());
		return;
	}
	let i = ih(), a = i ? Tp(i) : void 0;
	if (!a) {
		let e = Q_(n).filter((e) => !e.__anchor);
		x_(e), Bg(e), sm(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = iv(a, r), s = Q_(n), c = sm(s);
	!o.interceptorRan && !r && rv(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : Sh(a, o.config, o.origin), d = a.inputShaping, f = ov(a, s), p = d && o.input ? Vg(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = nv(o, u), g = wf(a, Xh(a), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = yd({
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, u);
	_.warnings.length && dv(_.warnings, o.warnings), o.workflow = u, o.assembly = _, o.stages = _.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : _.structures;
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
			text: Uu(t)
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
			return Object.defineProperty(t, av, { value: !0 }), t;
		}).filter((e) => Z_(e.content).trim());
		S.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: Z_(e.content).length,
				content: Z_(e.content)
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
	}, C.grouped && b >= 0 && (te = cv(o, C, y, b, te))), S.cache = T_(o, y, b, te), S.input = sv(o, y, b, te, S);
	let ne = o.transport === "prefill" && !l && b >= 0 ? lv(o, y, b) : y;
	n.splice(0, n.length, ...ne.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), ug("assembly", S), !r && !l && u && Oh.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var mv = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, hv = (e) => typeof e == "object" && !!e && !Array.isArray(e), gv = (e, t) => O_(e, t) ? qu(t?.storylines) : "off";
function _v() {
	let e = ih(), t = e ? Tp(e) : void 0;
	return t ? gv(t, Lm(t)) : "off";
}
function vv(e, t) {
	if (typeof e != "string" || !e) return -1;
	for (let n = t.length - 1; n >= 0; n--) if (t[n].mes === e) return n;
	if (e.length >= 40) {
		for (let n = t.length - 1; n >= 0; n--) if (t[n].mes.includes(e)) return n;
	}
	return -1;
}
var yv = (e) => !!(Tv?.open && e >= Tv.from);
function bv(t, n = e().chat) {
	let r = vv(t, n);
	return r < 0 ? null : yv(r) ? Tv.line : j_(n)[r];
}
function xv(t, n, r = e().chat) {
	if (n === "off") return !1;
	let i = vv(t, r);
	if (i < 0 || yv(i)) return !!(Tv?.open && Tv.frozen);
	let a = j_(r)[i];
	return Ju(n, {
		main: a === "",
		if: Kp(a, k_())
	});
}
var Sv = /* @__PURE__ */ new WeakSet();
function Cv(e, t, n) {
	hv(e) && Array.isArray(t) && xv(n, _v()) && (t.length && ug("variables", {
		frozen: "mvu",
		storyline: bv(n) ?? Tv?.line,
		commands: t.length
	}), t.splice(0, t.length), Sv.add(e));
}
function wv(e, t) {
	hv(e) && Sv.has(e) && (Sv.delete(e), hv(t) && "stat_data" in t && (e.stat_data = q(t.stat_data)), e.delta_data = {});
}
var Tv = null;
function Ev(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return hv(n) ? n : void 0;
}
var Dv = /* @__PURE__ */ new Set(["display_data", "delta_data"]), Ov = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !Dv.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function kv(t) {
	Tv = null, t.line !== void 0 && (Tv = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		frozen: t.frozen,
		from: Math.max(0, t.from),
		chatVars: t.frozen ? q(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function Av() {
	let t = Tv;
	if (!t?.frozen) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return Tv = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = q(t.chatVars), r = !0);
	let o = n.chat, s = j_(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = Ev(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = Ev(o[t]);
		Ov(n, r) || (t.variables[t.swipe_id ?? 0] = r ? q(r) : {}, i = !0);
	}
	return (r || i) && ug("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var jv = () => {
	Tv = null;
};
function Mv() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(mv.commandParsed, (e, t, n) => Cv(e, t, n)), r(mv.updateEnded, (e, t) => wv(e, t));
	let i = (e) => () => {
		Tv && (e && (Tv.open = !1), setTimeout(() => void Av().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || jv();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, jv);
}
//#endregion
//#region src/core/interceptor.ts
async function Nv(t, n, r, i) {
	if (Oh.setPending(null), !G().enabled) return;
	let a = ih(), o = a ? Tp(a) : void 0;
	if (!o) return;
	let s = Lm(o), c = i || "normal";
	c === "swipe" && fm(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (O_(o, s)) {
		let e = k_(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = Qp(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || P_(n, i.rewrite), i.noRecent && x("info", J("storylines.noRecent"), J("app.name")));
		let a = am(t, r ? t.map((e, t) => t) : f, i, u, qu(s.storylines));
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", g = t.slice(-6).map((e) => e.mes), _ = sg(t, u), { meta: v, flags: y, origin: b } = xh(o, s, h, c, !0, g), S = s.connection.transport, { vars: ee } = nv({
		preset: o,
		config: s,
		transport: S,
		origin: b,
		stType: c,
		meta: v,
		flags: y,
		storylines: p
	}, Sh(o, s, b)), te = {
		trigger: bh(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Uh(o),
		echoes: Wh(o, s, ee, Sh(o, s, "story")),
		recap: Sm(Infinity, tv(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: Vh(o, s),
		speech: Hh(o, s, ee),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => om(p, m[e]) } : {}
	}, C = (e, t) => p?.grouped && m[e] !== void 0 ? nm(m[e]) + t : t, ne, re, ie = -1, ae = [];
	if (s.cache?.enabled) {
		let e = Ag(kg(), p?.current), n = vg(t, te, jg(e)?.modes, (e) => pg(t[e], f[e] ?? e));
		if (re = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: C(n, t === void 0 ? e.mes : e.mes + gg(t))
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
		let e = zh(t, te);
		re = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: C(t, e.mes)
		} : e), ie = u >= 0 ? e.findIndex((e) => e.index === u) : -1, ie >= 0 && (ae = [e[ie].item.mes]);
	}
	let oe;
	o.inputShaping && ie >= 0 && ae.some((e) => e.trim()) && (re[ie] = {
		...re[ie],
		mes: Rg(re[ie].mes)
	}, oe = { texts: ae }), t.splice(0, t.length, ...re);
	let se = {
		id: wh(),
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
	kv({
		line: p?.current,
		frozen: !!p?.vars.frozen,
		from: se.inputIndex >= 0 ? se.inputIndex : d.length - 1
	}), Oh.setPending(se);
}
//#endregion
//#region src/core/transports/text.ts
function Pv(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = f_(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => kl(e, {
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
			content: cl(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), h_({
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
			let n = __(t, e.caller);
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
var Fv = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Iv = 32, Lv = 10, Rv = 9, zv = 13, Bv = 160, Vv = 6158, Hv = 8192, Uv = 8203, Wv = 8239, Gv = 8287, Kv = 12288, qv = 65279;
function Jv(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Yv(e) {
	return e >= "0" && e <= "9";
}
function Xv(e) {
	return e >= " ";
}
function Zv(e) {
	return ",:[]/{}()\n+".includes(e);
}
function Qv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function $v(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var ey = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, ty = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function ny(e) {
	return ",[]/{}\n+".includes(e);
}
function ry(e) {
	return ly(e) || iy.test(e);
}
var iy = /^[[{\w-]$/;
function ay(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function oy(e, t) {
	let n = e.charCodeAt(t);
	return n === Iv || n === Lv || n === Rv || n === zv;
}
function sy(e, t) {
	let n = e.charCodeAt(t);
	return n === Iv || n === Rv || n === zv;
}
function cy(e, t) {
	let n = e.charCodeAt(t);
	return n === Bv || n === Vv || n >= Hv && n <= Uv || n === Wv || n === Gv || n === Kv || n === qv;
}
function ly(e) {
	return uy(e) || fy(e);
}
function uy(e) {
	return e === "\"" || e === "“" || e === "”";
}
function dy(e) {
	return e === "\"";
}
function fy(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function py(e) {
	return e === "'";
}
function my(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function hy(e, t) {
	let n = e.length;
	if (!oy(e, n - 1)) return e + t;
	for (; oy(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function gy(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function _y(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var vy = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function yy(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = vy[n];
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
function by(e) {
	return e !== null && e.char === "\"";
}
function xy(e) {
	return e !== null && e.char === "'";
}
function Sy(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function Cy(e, t) {
	switch (t) {
		case ")": return Sy(e, "(") > Sy(e, ")");
		case "]": return Sy(e, "[") > Sy(e, "]");
		case "}": return Sy(e, "{") > Sy(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var wy = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Ty = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Ey(e) {
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
	for (r && a(), ry(e[t]) && _y(n) ? (r || (n = hy(n, ",")), g()) : r && (n = my(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? oy : sy, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (cy(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Dy(e, t);) t++;
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
			if (Qv(e[t])) for (; t < e.length && $v(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = hy(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = my(n, ",")) : oe();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (ry(e[t]) || c ? n = hy(n, ":") : se()), i() || (s || c ? n += "null" : se()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = hy(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = hy(n, ",")), p(), !i()) {
					r || (n = my(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = hy(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = hy(n, ",")), t = i();
		t || (n = my(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, ly(e[t]) || ie());
		let s = e[t] === "&" ? yy(e.slice(t, t + 12)) : null, c = by(s) || xy(s);
		if (ly(e[t]) || c) {
			let l = dy(e[t]) ? dy : py(e[t]) ? py : fy(e[t]) ? fy : uy, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = te(t - 1);
					return !r && Zv(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = hy(p, "\""), n += p, !0);
				}
				if (t === i) return p = hy(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? yy(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Zv(e[t]) && !Cy(p, e[t]) || ly(e[t]) && !C(t) || Yv(e[t])) return v(), !0;
					e[t] === "\\" && ie();
					let s = te(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Zv(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && ny(e[t])) {
					if (e[t - 1] === ":" && ey.test(e.substring(u + 1, t + 2))) for (; t < e.length && ty.test(e[t]);) p += e[t], t++;
					return p = hy(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : ay(e) ? p += wy[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Ty[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Jv(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ce();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : ay(n) ? (p += wy[n], t++) : (Xv(n) || re(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = my(n, "\"", !0);
			let e = n.length;
			n = _() ? gy(n, e, 1) : hy(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Yv(e[t]) && ne() && (i += "0")), e[t] === "0" && Yv(e[t + 1]) && (a = !0); Yv(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Yv(e[t]) || (i += "0"); Yv(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Yv(e[t]) || (i += "0"); Yv(e[t]);) i += e[t], t++;
			return ne() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !$v(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (Qv(e[t])) {
			for (; t < e.length && $v(e[t]);) t++;
			let n = t;
			for (; oy(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !ny(e[t]) && !ly(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && ey.test(e.substring(a, t + 2))) for (; t < e.length && ty.test(e[t]);) t++;
		if (t > a) {
			for (; oy(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && oy(e, n);) n--;
		return n;
	}
	function C(t) {
		let n = t + 1;
		for (; n < e.length && oy(e, n);) n++;
		return n >= e.length || Zv(e[n]);
	}
	function ne() {
		return t >= e.length || Zv(e[t]) || oy(e, t);
	}
	function re(e) {
		throw new Fv(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ie() {
		throw new Fv(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function ae() {
		throw new Fv("Unexpected end of json string", e.length);
	}
	function oe() {
		throw new Fv("Object key expected", t);
	}
	function se() {
		throw new Fv("Colon expected", t);
	}
	function ce() {
		throw new Fv(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Dy(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Oy(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function ky(e, t) {
	let n = Oy(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Ey(n));
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
function Ay(e, t, n, r, i = !0) {
	let a = Tl(e.stages), o = e.stages.find((e) => e.kind === "text"), s = i ? n?.[t.envelopeKeys.thinking] : void 0;
	o && typeof s == "string" && (a.stages[o.id] = {
		text: s,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && a.stages[t.id].status !== "done" && (a.stages[t.id].status = t.optional ? "pending" : "missing");
	return a.current = r ? null : o?.id ?? null, a;
}
function jy(e) {
	let { ctx: t, caller: n } = e, r = u_(t), i = r.schema(), a = d_(t), o = n.schema ? a ? r.envelope(n.schema.value) : n.schema.value : i.value, s = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, c = null, l = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", u = (e, i) => {
		let o = ky(l(e), i);
		return c = o.value, n.schema ? Ay(t, r, o.value, i, a) : Al(o.value, {
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
		body: () => h_(e, { json_schema: d }),
		progress: (e, t) => (s = e, u(e, t)),
		complete: () => ({ done: !0 }),
		result: () => u(s, !0),
		rawText: () => s.text,
		callerResult: () => a ? c?.[r.envelopeKeys.result] : c ?? void 0
	};
}
//#endregion
//#region src/core/transports/tools.ts
var My = (e, t) => $g({
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
function Ny(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Py(e) {
	let { ctx: t, caller: n } = e, r = u_(t), i = d_(t), a = r.submitTool(n.schema ? i ? r.envelope(n.schema.value) : n.schema.value : void 0), o = a.function.name, s = m_(e, "single", o), c = [
		...s ? [s.tool] : [],
		a,
		...n.tools
	], l = [...e.messages, ...s?.messages ?? []], u = t.config.connection.forceTool && !n.tools.length, d = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, f = null, p = (e, a) => {
		let s = ky((e.toolCalls.find((e) => e.name === o) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", a);
		return f = s.value, n.schema ? Ay(t, r, s.value, a, i) : Al(s.value, {
			stages: t.stages,
			structures: t.structures,
			final: a,
			openKey: s.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => h_(e, {
			messages: l,
			tools: c,
			tool_choice: u ? {
				type: "function",
				function: { name: o }
			} : "auto"
		}),
		progress: (e, t) => (d = e, p(e, t)),
		complete: (e) => {
			let t = __(e, n);
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
function Fy(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = u_(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = m_(e, o ? "parallel" : "multi", l), d = [
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
		let i = ky(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? Ay(t, s, e, a) : Al(e, {
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
			return h_({
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
			let i = Ny(e.toolCalls.filter((e) => e.name), r), o = __(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(My(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = p_(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: p_(t, a.tools.results.nudge, {
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
function Iy(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Pv(e);
		case "structured": return jy(e);
		case "tool-single": return Py(e);
		case "tool-multi": return Fy(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Ly(e, t) {
	let n = t ? f({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? g(n) : m(n);
}
var Ry = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function zy(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, Ry({
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
			})), a = () => n === null ? "" : (n = null, Ry({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + Ry({
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
				text: (e) => e ? o("text") + Ry({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + Ry({
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
					for (let i of e) t++, r = !0, n += Ry({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + Ry({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + Ry({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => Ry({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + Ry({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + Ry({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Ry({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Ry({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Ry({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: Vy(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Ry({ error: { message: e } }),
			end: (e) => e ? Ry({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? Ry({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Ry({
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
			error: (e) => Ry({ error: { message: e } }),
			end: (e) => Ry({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? Ry({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Ry({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Ry({ choices: [{
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
					...By(e)
				}
			}] }) : "",
			error: (e) => Ry({ error: { message: e } }),
			end: (e) => (e ? Ry({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + Ry("[DONE]")
		};
	}
}
function By(e) {
	let t = e.filter((e) => e.signature).map((e, t) => ({
		type: "reasoning.encrypted",
		data: e.signature,
		id: e.id,
		format: "google-gemini-v1",
		index: t
	}));
	return t.length ? { reasoning_details: t } : {};
}
function Vy(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Hy(e, t) {
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
				...By(t.toolCalls)
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
			input: Vy(e.arguments)
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
					args: Vy(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Uy(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function Wy(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Gy(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Ky = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = Wy(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Gy(t);
			if (r) {
				let t = this.open.has(e) ? qy(this.value, n) : void 0;
				Jy(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function qy(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Jy(e, t, n) {
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
var Yy = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Xy(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Yy(t) ? t : void 0;
}
function Zy(e, t) {
	if (!Yy(t)) return Yy(e) ? e : void 0;
	if (!Yy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Yy(r) && Yy(n[e]) ? Zy(n[e], r) : r);
	return n;
}
function Qy(e, t) {
	if (!Yy(t)) return Yy(e) ? e : void 0;
	if (!Yy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Yy(r) && Yy(t) ? n[e] = Qy(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var $y = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function eb(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var tb = class {
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
				let i = nb(n);
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
				args: new Ky()
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
			let i = typeof e.signature == "string" && e.signature ? e.signature : nb(e);
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
function nb(e) {
	let t = e?.extra_content?.google?.thought_signature ?? e?.function?.extra_content?.google?.thought_signature;
	return typeof t == "string" && t ? t : void 0;
}
function rb(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function ib(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* ab(e, t) {
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
async function* ob(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = eb(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new $y(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new tb();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = eb(t);
		if (n) throw new $y(n);
		i.text = rb(t), i.reasoning = ib(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Xy(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of ab(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = eb(e);
		if (r) throw new $y(r);
		i.text += p(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Xy(e);
		c && (i.usage = Zy(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var sb = /* @__PURE__ */ pn({ current: null });
function cb(e, t) {
	return sb.current = {
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
	}, sb.current;
}
function lb(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
function ub(t, n) {
	t.mesId = n, t.swipeId = e().chat[n]?.swipe_id ?? 0;
}
function db(t, n = e().chat[t]) {
	let r = sb.current;
	return !r || r.mesId !== t || r.swipeId !== null && (n?.swipe_id ?? 0) !== r.swipeId ? null : r;
}
//#endregion
//#region src/core/orchestrator.ts
function fb(e) {
	let t = e.structures.find((e) => e.kind === "speech");
	if (t) return e.speechCleaner ??= Y_(e.preset).cleaner ?? null, {
		tag: t.tag,
		...e.speechCleaner ? { cleaner: e.speechCleaner } : {}
	};
}
var pb = "/api/backends/chat-completions/generate", mb = { pending: null }, hb = (e) => e?.name === "AbortError";
function gb(e) {
	if (e.transport !== "tool-single" && e.transport !== "tool-multi") return null;
	let t = c(e.config.connection.assumeToolSupport);
	if (!t) return null;
	switch (t.reason) {
		case "postProcessing": return J("error.toolsUnsupported.postProcessing", { value: t.label });
		case "model": return J("error.toolsUnsupported.model", { target: t.model ? `${t.source} / ${t.model}` : t.source });
		default: return J(`error.toolsUnsupported.${t.reason}`);
	}
}
async function _b(e, t, n) {
	let r = Ly(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = gb(e);
	if (a) return x("error", a, "Advanced Preset"), Uy(a, 400);
	let o = e.origin === "task" ? c_(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = cb(e, i);
	if (!i) {
		let i;
		try {
			i = await bb(e, t, s, c, n ?? void 0, () => void 0);
		} catch (e) {
			return yb(c, e);
		}
		if (n?.aborted) throw mb.pending?.ctx === e && (mb.pending = null), n.reason;
		return new Response(JSON.stringify(Hy(r, i)), { headers: { "Content-Type": "application/json" } });
	}
	let l = zy(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await bb(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			hb(e) || (await p(l.error(vb(e))), yb(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var vb = (e) => e instanceof Error ? e.message : String(e);
function yb(e, t) {
	return e.status = hb(t) ? "aborted" : "error", e.error = vb(t), t instanceof $y ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Uy(vb(t));
}
async function bb(t, n, r, i, a, o) {
	let s = Ly(String(n.chat_completion_source ?? ""), n), c = Iy({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: s
	}), l = ul(t.stages), u = l >= 0 ? t.stages[l].id : null, d = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !d && u !== null, m = t.structures.some((e) => e.kind === "annotations"), h = fb(t), g = m ? (e) => sc(e, { final: !1 }).text : (e) => e, _ = h ? (e) => Mc(g(e), {
		...h,
		final: !1
	}).text : g, v = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, y = Date.now(), b = "", ee, te = 0, C = !1, ne, re;
	for (let n = 0; n < v; n++) {
		i.step = n;
		let r = c.body(n), l = dg({
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
			let n = await S(pb, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), s = 0;
			for await (let e of ob(n, f(r), !!r.stream, a)) {
				d = e;
				let t = Date.now();
				if (t - s < 50) continue;
				s = t;
				let n = c.progress(e, !1);
				if (lb(i, n, b + e.reasoning), p && u) {
					let e = n.stages[u]?.text ?? "";
					e && o(_(e.slice(0, e.length - Zs(e))).trimEnd());
				}
			}
			E_(t), l.response = d.text || JSON.stringify(d.toolCalls), l.durationMs = Date.now() - l.at, l.usage = d.usage;
		} catch (e) {
			if (l.error = vb(e), hb(e) || a?.aborted) {
				(d.text || d.reasoning || d.toolCalls.length) && E_(t), ee = Qy(ee, d.usage), C = !0, re = c.progress(d, !1);
				break;
			}
			if (!d.text && !d.toolCalls.length && r_(e) && n_(t, s)) {
				t.signatureFallback = !0, t.warnings.push("thought signature rejected: retried without the built-in signature"), x("warning", J("error.signatureFallback"), J("app.name")), n--;
				continue;
			}
			throw e;
		}
		b += d.reasoning, ee = Qy(ee, d.usage), c.progress(d, !0);
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
	lb(i, ie, b);
	let ae = xb(t, ie, c.rawText(), c.callerResult?.(), b, {
		usage: ee,
		requests: te,
		durationMs: Date.now() - y,
		interrupted: C
	});
	return ae.toolCalls = ne, ae.usage = ee, ne && (ae.content = ""), i.status = C ? "aborted" : "done", ae;
}
function xb(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Pl(u, h);
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
	let v, y, b = fb(t);
	if (b) {
		if (u) {
			let e = Lc(u, g, b);
			l.push(...e.warnings), u = e.text, v = e.spans, g = e.anchors;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Lc(d, _?.draft, b);
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
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? ie = i === void 0 ? u || Qs(r).trim() : JSON.stringify(i) : u || (re = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", ie = ee ? Qc(ee) : "", !ie && te && typeof n.structures[te.id] == "string" && (ie = "…"), !ie && C && n.structures[C.id] && (ie = "…"))), !ie && !o.interrupted) throw Error(J("error.emptyTurn"));
	let ae = [], oe = [], se = t.interceptorRan && t.stType !== "quiet";
	if (se && ne && Array.isArray(n.structures[ne.id])) {
		let e = jm(n.structures[ne.id]);
		ae.push(...e.events), oe = e.global;
	}
	if (se && C && typeof n.structures[C.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ae.push({
			type: "recap.set",
			text: n.structures[C.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let ce = t.stages.map((e) => {
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
	}), le = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: re,
		stages: ce,
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
	}, w = {
		content: ie,
		reasoning: a,
		sidecar: le,
		...oe.length ? { global: oe } : {}
	};
	return se ? mb.pending = {
		ctx: t,
		outcome: w,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: le
	}), sb.current?.genId === t.id && (sb.current.structures = n.structures), w;
}
//#endregion
//#region src/app/updater.ts
var Sb = "advancedPreset.reloadedFor";
async function Cb() {
	try {
		let e = await S(`${d()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function wb(e) {
	sessionStorage.setItem(Sb, e), x("info", J("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Tb() {
	let e = await Cb();
	e && e !== "73579b709846aa0a" && sessionStorage.getItem(Sb) !== e && wb(e);
}
async function Eb() {
	await Tb();
}
var Db = "/api/extensions/switch", Ob = (e) => e.replace(/^third-party/, "").replace(/^\/+|\/+$/g, "");
function kb(e, t, n) {
	if (!n.ok || typeof t.body != "string") return;
	let r;
	try {
		if (new URL(e, location.href).pathname !== Db) return;
		r = JSON.parse(t.body).extensionName;
	} catch {
		return;
	}
	typeof r == "string" && Ob(r) === Ob(u()) && Tb();
}
async function Ab() {
	let e = u().replace(/^third-party\//, ""), t = await Pb(e, !1);
	if (t.status === 404 && (t = await Pb(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Cb();
	return r && r !== "73579b709846aa0a" ? (wb(r), {
		upToDate: !1,
		reloading: !0
	}) : {
		upToDate: !!n.isUpToDate,
		reloading: !1
	};
}
async function jb() {
	let e = await Ab();
	return e.reloading || !e.upToDate ? "updated" : "current";
}
var Mb = "advancedPreset.selfUpdateFor";
async function Nb(e, t) {
	let n = `1.12.0>${e}`;
	if (sessionStorage.getItem(Mb) === n) return !1;
	sessionStorage.setItem(Mb, n), x("info", J("update.forPreset", {
		name: t,
		version: e
	}));
	try {
		return (await Ab()).reloading;
	} catch (e) {
		return console.warn("[AP] self-update failed", e), !1;
	}
}
var Pb = (t, n) => S("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Fb = "__ap_gen_id";
function Ib(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function Lb() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	ee(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(Ib(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[Fb], r = typeof t == "string" ? Oh.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[Fb], r.claimed = !0;
				try {
					return n.signal?.throwIfAborted(), await _b(r, e, n.signal);
				} finally {
					Oh.release(t);
				}
			}
			e && (delete e[Fb], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		let r = await e.call(globalThis, t, n);
		return n?.method === "POST" && kb(Ib(t), n, r), r;
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Rb(e) {
	let t = Oh.takeArmed();
	t && (e[Fb] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function zb(e) {
	let t = await H_(e);
	if (t === "invalid") return x("warning", J("storylines.invalidName"), J("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && x("warning", J("storylines.nameTaken", { name: n }), J("app.name")), t === "invalid" && x("warning", J("storylines.invalidName"), J("app.name"));
		let r = await b(`<h3>${v(J("storylines.switchTitle", { name: e }))}</h3><p>${v(J("storylines.askOldMain"))}</p>`, n, J("storylines.switch"), J("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = Zu(n) ? await H_(e, n) : "invalid";
	}
	return t === "switched" && x("success", J("storylines.switched", { name: e }), J("app.name")), !0;
}
async function Bb(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) {
		F_(t, n.current), i.hide && (B_(n.current, { hide: !0 }), await e().saveMetadata());
		return;
	}
	let a = r && typeof r == "object" ? r : {}, o = M_(), s = (e, t) => {
		let n = rd(nd(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(k_().main ?? "");
		let e = s(a.name, J("storylines.fallback.side"));
		return e !== k_().main && !await L_(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), F_(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, J(i.ifLine ? "storylines.fallback.if" : "storylines.fallback.side"));
		B_(n, {
			ifLine: !!i.ifLine,
			hide: i.hide
		}), F_(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, J("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, J("storylines.fallback.main")) : void 0), u = await H_(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), x("warning", J("storylines.switchFailed", { name: c }), J("app.name")), F_(t, c);
	i.naming && n.input >= 0 && V_(n.input), F_(t, ""), u === "switched" && x("success", J("storylines.switched", { name: c }), J("app.name"));
}
function Vb(e, t) {
	if (!G().enabled) return e;
	let n = ih(), r = n ? Tp(n) : void 0;
	if (!r || !O_(r, Lm(r)) || Qu(e)) return e;
	let i = j_(), a = i[t ?? i.length - 1];
	return !a || Hp(a) ? e : ed(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var Hb = "\0";
function Ub(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = gm(e);
		r && t.add(`${n.presetId}${Hb}${r}`);
	}
}
function Wb(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && Ub(r.extra?.[cm], t), r.swipe_info?.forEach((e, t) => {
			t !== i && Ub(e?.extra?.[cm], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var Gb = null;
function Kb(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = Wb(n.chat ?? []), o = new Set(a);
	if (Gb && !t.reload && Gb.chatId === r) for (let e of Gb.active) i.has(e) || o.add(e);
	Gb = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(Hb), i = s.get(n);
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
		n?.globalMemory && (hm(n.globalMemory.log) && (l = !0), Nm(n, t.off, !1) && (l = !0), Nm(n, t.on, !0) && (l = !0));
	}
	return l && K(), l;
}
function qb(e) {
	fm(e), Kb();
}
function Jb() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => qb(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => Kb());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => Kb({ reload: !0 }));
}
//#endregion
//#region src/media/net.ts
var Yb = class extends Error {
	issue;
	constructor(e, t = `CORS proxy: ${e}`) {
		super(t), this.issue = e, this.name = "ProxyError";
	}
}, Xb = class extends Error {
	status;
	body;
	constructor(e, t, n = "") {
		super(t), this.status = e, this.body = n, this.name = "MediaHttpError";
	}
}, Zb = /* @__PURE__ */ new Set(), Qb = (e) => {
	try {
		return new URL(e).origin;
	} catch {
		return e;
	}
};
function $b(e, t) {
	if (t.proxy === "custom") {
		let n = t.customUrl.trim();
		if (!n) throw new Yb("noCustomUrl");
		return n.includes("{url}") ? n.replace("{url}", encodeURIComponent(e)) : n + e;
	}
	return `/proxy/${encodeURIComponent(e)}`;
}
function ex(e = _S().cors) {
	return { multipart: e.proxy === "custom" || t() };
}
var tx = (e) => e == null || typeof e == "string";
async function nx(n, r, i) {
	let a = $b(n, i);
	if (i.proxy === "custom") return S(a, r);
	let o = t();
	if (!ex(i).multipart && !tx(r.body)) throw new Yb("body");
	let s = new Headers(r.headers), c = e().getRequestHeaders?.()["X-CSRF-Token"];
	c && !s.has("X-CSRF-Token") && s.set("X-CSRF-Token", c);
	let l = await S(a, {
		...r,
		headers: s
	});
	if (l.status === 404) {
		let e = l.headers.get("content-type") ?? "", t = e.includes("json") ? "" : await l.clone().text().catch(() => "");
		if (/CORS proxy is disabled/i.test(t)) throw new Yb("disabled");
		if (o && (e.includes("html") || !t)) throw new Yb("unsupported");
	}
	return l;
}
var rx = (e) => e instanceof DOMException && e.name === "AbortError";
async function ix(e, t = {}, n = _S().cors) {
	if (n.mode === "on") return nx(e, t, n);
	if (n.mode === "off") return S(e, t);
	let r = Qb(e);
	if (Zb.has(r)) return nx(e, t, n);
	try {
		return await S(e, t);
	} catch (i) {
		if (rx(i) || !(i instanceof TypeError)) throw i;
		Zb.add(r);
		try {
			return await nx(e, t, n);
		} catch (e) {
			throw e instanceof Yb && Zb.delete(r), e;
		}
	}
}
function ax(e, t) {
	let n = "";
	try {
		let e = JSON.parse(t), r = e?.error ?? e;
		n = typeof r == "string" ? r : String(r?.message ?? e?.message ?? e?.detail?.message ?? e?.detail ?? "");
	} catch {
		n = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
	}
	return n ? `HTTP ${e}: ${n}` : `HTTP ${e}`;
}
async function ox(e) {
	if (e.ok) return e;
	let t = await e.text().catch(() => "");
	throw new Xb(e.status, ax(e.status, t), t);
}
//#endregion
//#region src/media/request.ts
var sx = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function cx(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r === null ? delete n[e] : n[e] = sx(r) && sx(n[e]) ? cx(n[e], r) : r;
	return n;
}
var lx = class extends Error {
	constructor(e) {
		super(e), this.name = "BodyOverrideError";
	}
};
function ux(e) {
	let t = e.body.trim();
	if (!t) return {};
	let n;
	try {
		n = JSON.parse(t);
	} catch (e) {
		throw new lx(e instanceof Error ? e.message : String(e));
	}
	if (!sx(n)) throw new lx("Not a JSON object");
	return n;
}
function dx(e) {
	try {
		return ux({ body: e }), "";
	} catch (e) {
		return e instanceof Error ? e.message : String(e);
	}
}
function fx(e, t) {
	let n = new Headers(e);
	for (let [e, r] of Object.entries(t.headers ?? {})) e.trim() && (r === "" ? n.delete(e) : n.set(e, r));
	return n;
}
var px = (e, t) => `${e.replace(/\/+$/, "")}/${t.replace(/^\/+/, "")}`, mx = "advanced-preset-media", hx = "blobs", gx = null;
function _x() {
	return gx || (gx = new Promise((e, t) => {
		let n = indexedDB.open(mx, 1);
		n.onupgradeneeded = () => {
			n.result.objectStoreNames.contains(hx) || n.result.createObjectStore(hx);
		}, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
	}), gx.catch(() => {
		gx = null;
	}), gx);
}
function vx(e, t) {
	return _x().then((n) => new Promise((r, i) => {
		let a = n.transaction(hx, e), o = t(a.objectStore(hx));
		a.oncomplete = () => r(o ? o.result : void 0), a.onerror = () => i(a.error), a.onabort = () => i(a.error);
	}));
}
async function yx(e, t = {}) {
	let n = t.key ?? `${t.prefix ?? ""}${yS()}`;
	return await vx("readwrite", (t) => t.put({
		blob: e,
		at: Date.now()
	}, n)), n;
}
async function bx(e) {
	return (await vx("readonly", (t) => t.get(e)))?.blob;
}
async function xx(e) {
	return !!await vx("readonly", (t) => t.count(e));
}
async function Sx(e) {
	Dx(e), await vx("readwrite", (t) => t.delete(e));
}
async function Cx(e = "") {
	let t = e ? IDBKeyRange.bound(e, `${e}\uffff`) : void 0;
	return (await vx("readonly", (e) => e.getAllKeys(t)) ?? []).map(String);
}
async function wx(e, t, n = 0) {
	let r = Date.now() - n, i = 0;
	for (let a of await Cx(e)) if (!t.has(a)) {
		if (n) {
			let e = await vx("readonly", (e) => e.get(a));
			if (e && e.at > r) continue;
		}
		await Sx(a), i++;
	}
	return i;
}
var Tx = /* @__PURE__ */ new Map();
async function Ex(e) {
	let t = Tx.get(e);
	if (t) return t;
	let n = await bx(e);
	if (!n) return;
	let r = URL.createObjectURL(n);
	return Tx.set(e, r), r;
}
function Dx(e) {
	let t = Tx.get(e);
	t && (URL.revokeObjectURL(t), Tx.delete(e));
}
async function Ox(e) {
	let t = new Uint8Array(await e.arrayBuffer()), n = "";
	for (let e = 0; e < t.length; e += 32768) n += String.fromCharCode(...t.subarray(e, e + 32768));
	return btoa(n);
}
function kx(e, t) {
	let n = atob(e), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return new Blob([r], { type: t });
}
//#endregion
//#region src/media/speech/util.ts
var Ax = class extends Error {
	status;
	constructor(e, t) {
		super(e), this.status = t, this.name = "SpeechError";
	}
}, jx = (e, t) => e.baseUrl.trim() || t, Mx = (e, t) => cx(t, ux(e));
function Nx(e, t) {
	let n = {}, r = (e, t) => {
		for (let t of Object.keys(n)) t.toLowerCase() === e.toLowerCase() && delete n[t];
		t !== "" && (n[e] = t);
	};
	for (let [e, n] of Object.entries(t)) r(e, n);
	for (let [t, n] of Object.entries(e.headers ?? {})) t.trim() && r(t.trim(), n);
	return n;
}
async function* Px(e, t) {
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
function Fx(e, t) {
	if (!e.body) throw new Ax("Empty response.");
	return ab(e.body, t);
}
function Ix(e) {
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
function Lx(e) {
	let t = e.length >> 1, n = new Uint8Array(t);
	for (let r = 0; r < t; r++) n[r] = parseInt(e.substr(r * 2, 2), 16);
	return n;
}
async function* Rx(e) {
	let t = /* @__PURE__ */ new Uint8Array(), n = !1;
	for await (let r of e) {
		if (n) {
			yield r;
			continue;
		}
		let e = new Uint8Array(t.length + r.length);
		if (e.set(t), e.set(r, t.length), t = e, t.length < 12) continue;
		let i = String.fromCharCode(...t.subarray(0, 4)) + String.fromCharCode(...t.subarray(8, 12)) === "RIFFWAVE" ? zx(t) : 0;
		i < 0 || (n = !0, t.length > i && (yield t.subarray(i)));
	}
	!n && t.length && (yield t);
}
function zx(e) {
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
var Bx = {
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
		if (r?.kind === "clone") throw new Ax("DeepSeek does not support voice cloning.");
		let a = Mx(t, {
			text: n,
			voice_id: r?.id ?? this.voices[0].id,
			format: "pcm"
		});
		return {
			sampleRate: 24e3,
			chunks: Rx(Px(await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "tools/tts"), {
				method: "POST",
				headers: Nx(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(a),
				signal: i
			})), i))
		};
	}
}, Vx = 24e3, Hx = [
	["JBFqnCBsd6RMkjVDRZzb", "George"],
	["21m00Tcm4TlvDq8ikWAM", "Rachel"],
	["EXAVITQu4vr4xnSDxMaL", "Sarah"],
	["pNInz6obpgDQGcFmaJgB", "Adam"],
	["nPczCjzI2devNBz1zQrb", "Brian"],
	["pFZP5JQG7iQjIQuC4Bku", "Lily"],
	["IKne3meq5aSn9XLyUdCD", "Charlie"],
	["XB0fDUnXU5powFXDhCwa", "Charlotte"]
], Ux = (e) => ({ "xi-api-key": e }), Wx = {
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
	voices: Hx.map(([e, t]) => ({
		id: e,
		name: t
	})),
	format: "Inside a speech tag you may add ElevenLabs audio tags in square brackets right before the words they affect: emotions such as [excited] [sad] [angry] [nervous] [sarcastic] [curious], delivery such as [whispers] [shouts] [softly], and sounds such as [laughs] [sighs] [gasps] [crying] [clears throat]; use [pause] or an ellipsis for a pause. Example: <speech character=\"Mia\">[whispers] Don't move. [pause] Something is out there.</speech>",
	tags: /\[[^[\]\n]{1,60}\]/g,
	clone: { text: "none" },
	async search(e, t, n, r) {
		let i = jx(t, this.defaults.baseUrl), a = Nx(t, Ux(t.apiKey)), o = n.trim(), s = new URL(px(i, "v2/voices"));
		s.searchParams.set("page_size", "30"), o && s.searchParams.set("search", o);
		let c = new URL(px(i, "v1/shared-voices"));
		c.searchParams.set("page_size", "30"), o && c.searchParams.set("search", o);
		let l = async (t) => (await (await ox(await e.fetch(t.toString(), {
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
		let i = px(jx(t, this.defaults.baseUrl), `v1/voices/add/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.id)}`), a = await e.fetch(i, {
			method: "POST",
			headers: Nx(t, {
				...Ux(t.apiKey),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ new_name: n.name }),
			signal: r
		});
		return a.status === 400 || a.status === 409 ? n.id : (await (await ox(a)).json()).voice_id || n.id;
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new Ax("Reference audio is missing.");
		let a = new FormData();
		a.append("name", `AP ${n.audio.slice(-8)}`), a.append("files", i, "reference");
		let o = (await (await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "v1/voices/add"), {
			method: "POST",
			headers: Nx(t, Ux(t.apiKey)),
			body: a,
			signal: r
		}))).json()).voice_id;
		if (!o) throw new Ax("No voice id returned.");
		return o;
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = r?.kind === "voice" ? r.id : r?.id;
		if (r?.kind === "clone" && !a) throw new Ax("The cloned voice has not been created.");
		let o = new URL(px(jx(t, this.defaults.baseUrl), `v1/text-to-speech/${encodeURIComponent(a || Hx[0][0])}/stream`));
		o.searchParams.set("output_format", `pcm_${Vx}`);
		let s = Mx(t, {
			text: n,
			model_id: t.model || this.defaults.model
		});
		return {
			sampleRate: Vx,
			chunks: Px(await ox(await e.fetch(o.toString(), {
				method: "POST",
				headers: Nx(t, {
					...Ux(t.apiKey),
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
function Gx(e) {
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
var Kx = 24e3, qx = {
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
		let i = new URL(px(jx(t, this.defaults.baseUrl), "model"));
		return i.searchParams.set("page_size", "20"), n.trim() && i.searchParams.set("title", n.trim()), ((await (await ox(await e.fetch(i.toString(), {
			headers: Nx(t, t.apiKey ? { Authorization: `Bearer ${t.apiKey}` } : {}),
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
			sample_rate: Kx,
			latency: "balanced"
		};
		r?.kind === "voice" && (a.reference_id = r.id);
		let o = Mx(t, a), s = {
			Authorization: `Bearer ${t.apiKey}`,
			model: t.model || this.defaults.model
		}, c;
		if (r?.kind === "clone") {
			let t = await e.blob(r.audio);
			if (!t) throw new Ax("Reference audio is missing.");
			let n = {
				audio: new Uint8Array(await t.arrayBuffer()),
				text: r.text ?? ""
			};
			c = Gx({
				...o,
				references: [n]
			}), s["Content-Type"] = "application/msgpack";
		} else c = JSON.stringify(o), s["Content-Type"] = "application/json";
		let l = await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "v1/tts"), {
			method: "POST",
			headers: Nx(t, s),
			body: c,
			signal: i
		}));
		return {
			sampleRate: Number(o.sample_rate) || Kx,
			chunks: Px(l, i)
		};
	}
}, Jx = [
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
], Yx = /* @__PURE__ */ "argh.breath.heavy breath.exhales.cackle.cheer.chuckle.chuckles.cough.cry.gasp.giggle.groan.growl.grunt.grr.hiss.laugh.laughter.moan.pant.pff.phew.scream.shout.shriek.sigh.sighs.sneeze.snicker.snort.sob.throat-clearing.tsk.whimper.whispers.whispering.yawn.short pause.long pause".split("."), Xx = (e) => Nx(e, {
	"Content-Type": "application/json",
	"x-goog-api-key": e.apiKey
});
function Zx(e) {
	if (!e) return Jx[0][0];
	if (e.kind === "voice" || e.id) return e.id;
	throw new Ax("The replicated voice has not been created yet.");
}
var Qx = {
	api: "gemini",
	defaults: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-3.8-flash-tts"
	},
	models: ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"],
	voices: Jx.map(([e, t]) => ({
		id: e,
		name: e,
		description: t
	})),
	format: "Inside a speech tag you may add vocal sounds and pauses in angle brackets exactly where they happen: <sigh> <laugh> <chuckle> <giggle> <gasp> <cough> <breath> <sob> <yawn> <whispering> <short pause> <long pause>. Use these English tags in any language. Example: Wait... <short pause> did you hear that? <gasp>",
	tags: RegExp(`<(?:${Yx.join("|")})>`, "gi"),
	clone: {
		text: "none",
		consent: !0
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = Mx(t, {
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
			generation_config: { speech_config: [{ voice: Zx(r) }] },
			stream: !0
		}), o = await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "interactions"), {
			method: "POST",
			headers: Xx(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.response_format?.sample_rate) || 24e3,
			chunks: Rx($x(o, i))
		};
	},
	async createClone(e, t, n, r) {
		let [i, a] = await Promise.all([e.blob(n.audio), n.consent ? e.blob(n.consent) : void 0]);
		if (!i) throw new Ax("Reference audio not found.");
		if (!a) throw new Ax("Gemini voice replication needs a consent recording.");
		let o = async (e) => ({
			mime_type: e.type.split(";")[0].trim() || "audio/wav",
			data: await Ox(e)
		}), s = await (await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "voices"), {
			method: "POST",
			headers: Xx(t),
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
		if (!c) throw new Ax("Gemini did not return a voice id.");
		return c;
	},
	async search(e, t, n, r) {
		let i = new URL(px(jx(t, this.defaults.baseUrl), "voices"));
		return n.trim() && i.searchParams.set("search", n.trim()), i.searchParams.set("page_size", "100"), ((await (await ox(await e.fetch(i.toString(), {
			method: "GET",
			headers: Nx(t, { "x-goog-api-key": t.apiKey }),
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
async function* $x(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = ((await e.json()).steps ?? []).flatMap((e) => e.content ?? []).filter((e) => e.type === "audio" && e.data);
		if (!t.length) throw new Ax("Gemini returned no audio.");
		yield Ix(t[t.length - 1].data);
		return;
	}
	let n = !1;
	for await (let r of Fx(e, t)) {
		if (r === "[DONE]") break;
		let e = JSON.parse(r);
		if (e.event_type === "error" || e.error) throw new Ax(`Gemini: ${e.error?.message ?? "stream error"}`);
		e.event_type === "step.delta" && e.delta?.type === "audio" && e.delta.data && (n = !0, yield Ix(e.delta.data));
	}
	if (!n) throw new Ax("Gemini returned no audio.");
}
//#endregion
//#region src/media/speech/providers/minimax.ts
var eS = [
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
], tS = [
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
function nS(e) {
	let t = e?.base_resp?.status_code;
	if (t) throw new Ax(`MiniMax ${t}: ${e.base_resp?.status_msg || "error"}`);
	return e;
}
var rS = (e, t = !0) => Nx(e, {
	...t ? { "Content-Type": "application/json" } : {},
	Authorization: `Bearer ${e.apiKey}`
});
function iS(e) {
	if (!e) return tS[0].id;
	if (e.kind === "voice" || e.id) return e.id;
	throw new Ax("The cloned voice has not been created yet.");
}
function aS() {
	return `AP${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
var oS = {
	"audio/mpeg": "mp3",
	"audio/mp3": "mp3",
	"audio/mp4": "m4a",
	"audio/x-m4a": "m4a",
	"audio/m4a": "m4a",
	"audio/wav": "wav",
	"audio/x-wav": "wav",
	"audio/wave": "wav"
}, sS = {
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
	voices: tS,
	format: `Inside a speech tag you may add MiniMax voice tags: a pause as <#seconds#> between words (e.g. <#0.5#>), and interjections in parentheses: ${eS.map((e) => `(${e})`).join(" ")}. Example: (sighs) Fine.<#0.4#> Let's go.`,
	tags: RegExp(`<#\\d+(?:\\.\\d+)?#>|\\((?:${eS.join("|")})\\)`, "g"),
	clone: { text: "none" },
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = Mx(t, {
			model: t.model || this.defaults.model,
			text: n,
			stream: !0,
			stream_options: { exclude_aggregated_audio: !0 },
			language_boost: "auto",
			voice_setting: { voice_id: iS(r) },
			audio_setting: {
				format: "pcm",
				sample_rate: 24e3,
				channel: 1
			}
		}), o = await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "t2a_v2"), {
			method: "POST",
			headers: rS(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.audio_setting?.sample_rate) || 24e3,
			chunks: cS(o, i)
		};
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new Ax("Reference audio not found.");
		let a = jx(t, this.defaults.baseUrl), o = new FormData();
		o.append("purpose", "voice_clone"), o.append("file", i, `reference.${oS[i.type.split(";")[0].trim()] ?? "wav"}`);
		let s = await (await ox(await e.fetch(px(a, "files/upload"), {
			method: "POST",
			headers: rS(t, !1),
			body: o,
			signal: r
		}))).text();
		nS(JSON.parse(s));
		let c = /"file_id"\s*:\s*"?(\d+)/.exec(s)?.[1];
		if (!c) throw new Ax("MiniMax did not return a file id.");
		let l = aS(), u = JSON.stringify({
			file_id: 0,
			voice_id: l
		}).replace("\"file_id\":0", `"file_id":${c}`);
		return nS(await (await ox(await e.fetch(px(a, "voice_clone"), {
			method: "POST",
			headers: rS(t),
			body: u,
			signal: r
		}))).json()), l;
	},
	async search(e, t, n, r) {
		let i = nS(await (await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "get_voice"), {
			method: "POST",
			headers: rS(t),
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
async function* cS(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = nS(await e.json());
		t.data?.audio && (yield Lx(t.data.audio));
		return;
	}
	let n = !1;
	for await (let r of Fx(e, t)) {
		let e = nS(JSON.parse(r)), t = e.data?.audio;
		t && (e.data?.status === 2 && n || (n = !0, yield Lx(t)));
	}
}
//#endregion
//#region src/media/speech/providers/openai.ts
var lS = [
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
], uS = {
	fish: qx,
	elevenlabs: Wx,
	minimax: sS,
	gemini: Qx,
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
		voices: lS.map((e) => ({
			id: e,
			name: e[0].toUpperCase() + e.slice(1)
		})),
		format: "",
		tags: null,
		async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
			let a = r?.kind === "voice" ? r.id : lS[0], o = Mx(t, {
				model: t.model || this.defaults.model,
				input: n,
				voice: a.startsWith("voice_") ? { id: a } : a,
				response_format: "pcm"
			});
			return {
				sampleRate: 24e3,
				chunks: Px(await ox(await e.fetch(px(jx(t, this.defaults.baseUrl), "audio/speech"), {
					method: "POST",
					headers: Nx(t, {
						"Content-Type": "application/json",
						Authorization: `Bearer ${t.apiKey}`
					}),
					body: JSON.stringify(o),
					signal: i
				})), i)
			};
		}
	},
	deepseek: Bx
};
function dS(e) {
	return uS[e];
}
var fS = (e) => e && uS[e]?.format || "", pS = (e) => e && uS[e]?.tags || null, mS = {
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
}, hS = (e) => e === "openai" || e === "gemini", gS = () => ({
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
function _S() {
	let e = G(), t = gS();
	(!e.media || typeof e.media != "object") && (e.media = t);
	let n = e.media;
	for (let e of Object.keys(t)) {
		let r = n[e];
		n[e] = r && typeof r == "object" ? {
			...t[e],
			...r
		} : t[e];
	}
	return n;
}
var vS = K, yS = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
function bS(e, t) {
	let n = mS[e];
	return {
		id: yS(),
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
function xS(e, t) {
	if (e.api === t) return;
	let n = mS[e.api], r = mS[t];
	(!e.baseUrl || e.baseUrl === n.baseUrl) && (e.baseUrl = r.baseUrl), (!e.model || e.model === n.model) && (e.model = r.model), e.nsfwBlock === n.nsfwBlock && (e.nsfwBlock = r.nsfwBlock), e.api = t;
}
function SS(e, t) {
	let n = dS(e)?.defaults;
	return {
		id: yS(),
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
function CS(e, t) {
	if (e.api === t) return;
	let n = dS(e.api)?.defaults, r = dS(t)?.defaults;
	(!e.baseUrl || e.baseUrl === n?.baseUrl) && (e.baseUrl = r?.baseUrl ?? ""), (!e.model || e.model === n?.model) && (e.model = r?.model ?? ""), e.api = t, e.voice = null, e.narrator = null, e.bindings = [];
}
function wS(e) {
	return e.connections.find((t) => t.id === e.active) ?? e.connections[0];
}
function TS(e, t) {
	return {
		...JSON.parse(JSON.stringify(e)),
		id: yS(),
		name: t
	};
}
//#endregion
//#region src/media/image/zip.ts
var ES = (e, t) => e.getUint16(t, !0), DS = (e, t) => e.getUint32(t, !0);
async function OS(e) {
	let t = new Blob([e]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
async function kS(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = -1;
	for (let r = e.length - 22; r >= Math.max(0, e.length - 22 - 65535); r--) if (DS(t, r) === 101010256) {
		n = r;
		break;
	}
	if (n < 0) throw Error("Not a ZIP archive");
	let r = ES(t, n + 10), i = DS(t, n + 16), a = [], o = new TextDecoder();
	for (let n = 0; n < r; n++) {
		if (DS(t, i) !== 33639248) throw Error("Broken ZIP directory");
		let n = ES(t, i + 10), r = DS(t, i + 20), s = ES(t, i + 28), c = ES(t, i + 30), l = ES(t, i + 32), u = DS(t, i + 42), d = o.decode(e.subarray(i + 46, i + 46 + s));
		if (i += 46 + s + c + l, d.endsWith("/")) continue;
		let f = u + 30 + ES(t, u + 26) + ES(t, u + 28), p = e.subarray(f, f + r);
		if (n === 0) a.push({
			name: d,
			data: p
		});
		else if (n === 8) a.push({
			name: d,
			data: await OS(p)
		});
		else throw Error(`Unsupported ZIP compression ${n}`);
	}
	return a;
}
function AS(e) {
	if (e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71) return "image/png";
	if (e[0] === 255 && e[1] === 216 && e[2] === 255) return "image/jpeg";
	if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 87 && e[9] === 69 && e[10] === 66 && e[11] === 80) return "image/webp";
	if (e[0] === 71 && e[1] === 73 && e[2] === 70) return "image/gif";
	let t = new TextDecoder().decode(e.subarray(0, 256)).trimStart();
	if (t.startsWith("<svg") || t.startsWith("<?xml") && t.includes("<svg")) return "image/svg+xml";
}
//#endregion
//#region src/media/image/providers.ts
function jS(e, t) {
	let n = t.trim(), r = e.style.trim();
	return r ? e.api === "novelai" ? `${n.replace(/[,\s]+$/, "")}, ${r.replace(/^[,\s]+/, "")}` : `${n}\n\n${r}` : n;
}
var MS = {
	"1:1": "1024x1024",
	"3:4": "1024x1536",
	"9:16": "1024x1536",
	"4:3": "1536x1024",
	"16:9": "1536x1024"
}, NS = {
	"1:1": [1024, 1024],
	"3:4": [832, 1216],
	"9:16": [832, 1216],
	"4:3": [1216, 832],
	"16:9": [1216, 832]
}, PS = async (e) => `data:${e.type || "image/png"};base64,${await Ox(e)}`, FS = (e) => e.baseUrl.trim() || mS[e.api].baseUrl, IS = (e) => e.model.trim() || mS[e.api].model, LS = (e, t) => ({
	method: "POST",
	headers: e,
	body: JSON.stringify(t)
});
async function RS(e, t) {
	let n = jS(e, t.prompt), r = {
		model: IS(e),
		prompt: n,
		n: 1,
		size: t.ratio ? MS[t.ratio] : "auto"
	};
	t.refs.length && (r.images = await Promise.all(t.refs.map(async (e) => ({ image_url: await PS(e.blob) }))));
	let i = fx({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e);
	return {
		url: px(FS(e), t.refs.length ? "images/edits" : "images/generations"),
		init: LS(i, cx(r, ux(e)))
	};
}
var zS = (e) => e.description ? `Reference image ${e.id}: ${e.description}` : `Reference image ${e.id}`;
async function BS(e, t) {
	let n = jS(e, t.prompt), r = await Promise.all(t.refs.map(async (e) => ({
		ref: e,
		mime: e.blob.type || "image/png",
		data: await Ox(e.blob)
	}))), i = e.apiKey ? { "x-goog-api-key": e.apiKey } : {};
	if (e.endpoint === "generateContent") {
		let a = [];
		for (let e of r) a.push({ text: zS(e.ref) }, { inline_data: {
			mime_type: e.mime,
			data: e.data
		} });
		a.push({ text: n });
		let o = { responseModalities: ["IMAGE"] };
		t.ratio && (o.imageConfig = { aspectRatio: t.ratio });
		let s = fx({
			"Content-Type": "application/json",
			...i
		}, e), c = cx({
			contents: [{
				role: "user",
				parts: a
			}],
			generationConfig: o
		}, ux(e));
		return {
			url: px(FS(e), `models/${encodeURIComponent(IS(e))}:generateContent`),
			init: LS(s, c)
		};
	}
	let a = [];
	for (let e of r) a.push({
		type: "text",
		text: zS(e.ref)
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
	let s = fx({
		"Content-Type": "application/json",
		"Api-Revision": "2026-05-20",
		...i
	}, e), c = cx({
		model: IS(e),
		input: a,
		response_format: o
	}, ux(e));
	return {
		url: px(FS(e), "interactions"),
		init: LS(s, c)
	};
}
function VS(e, t) {
	let n = jS(e, t.prompt), r = (e.negative ?? "").trim(), [i, a] = NS[t.ratio ?? "3:4"], o = {
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
	}, s = fx({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e), c = cx({
		input: n,
		model: IS(e),
		action: "generate",
		parameters: o
	}, ux(e));
	return {
		url: px(FS(e), "ai/generate-image"),
		init: LS(s, c)
	};
}
async function HS(e, t) {
	switch (e.api) {
		case "openai": return RS(e, t);
		case "gemini": return BS(e, t);
		case "novelai": return VS(e, {
			...t,
			refs: []
		});
	}
}
function US(e) {
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
function WS(e) {
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
var GS = (e, t = "image/png") => new Blob([e], { type: AS(e) ?? t });
async function KS(e, t, n) {
	if (e.api === "novelai") {
		let e = new Uint8Array(await t.arrayBuffer());
		return AS(e) ? [GS(e)] : (await kS(e)).filter((e) => AS(e.data)).map((e) => GS(e.data));
	}
	let r = await t.json();
	if (e.api === "gemini") {
		let e = US(r).map((e) => kx(e.data, e.mime));
		if (!e.length) throw Error(WS(r) || "No image in the response");
		return e;
	}
	let i = r?.data ?? [], a = [];
	for (let e of i) if (e.b64_json) {
		let t = kx(e.b64_json, "image/png");
		a.push(GS(new Uint8Array(await t.arrayBuffer())));
	} else e.url && a.push(await (await ox(await ix(e.url, { signal: n }))).blob());
	if (!a.length) throw Error("No image in the response");
	return a;
}
async function qS(e, t, n) {
	let { url: r, init: i } = await HS(e, t);
	return KS(e, await ox(await ix(r, {
		...i,
		signal: n
	})), n);
}
//#endregion
//#region src/ui/state.ts
var Y = /* @__PURE__ */ pn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), JS = () => {
	Y.chatRev++;
}, YS = () => {
	Y.presetId = ih();
}, XS = W(() => Y.presetId ? Tp(Y.presetId) : void 0), ZS = W(() => {
	let e = XS.value;
	if (!e) return { config: "" };
	let t = Pm(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Fp(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function QS(t) {
	return Y.chatRev, e().chat[t];
}
function $S(e) {
	return lm(QS(e));
}
function eC(e) {
	Y.storylineFocus = e, tC("storylines");
}
function tC(e) {
	e && (Y.tab = e), Y.panelOpen = !0;
}
//#endregion
//#region src/app/images.ts
var nC = /* @__PURE__ */ pn(/* @__PURE__ */ new Map()), rC = (e, t, n) => `${e}:${t}:${n}`;
function iC() {
	let e = _S().image;
	return e.enabled ? wS(e) : void 0;
}
function aC() {
	let e = _S().image, t = iC();
	if (!t) return {
		vars: { ...hc },
		refs: []
	};
	let n = hS(t.api) ? t.refs.map((e) => ({
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
var oC = (e) => e?.image ? Object.values(e.structures).filter((e) => e.kind === "image") : [], sC = (e, t) => wc(e?.structures?.[t])?.images ?? [], cC = (e, t, n) => e?.images?.[t]?.[n]?.prompt ?? sC(e, t)[n]?.prompt ?? "";
function lC(t, n) {
	let r = e().chat, i = (e) => {
		let n = r[e];
		if (!n || n.is_user) return null;
		if (lm(n)?.genId === t) return {
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
async function uC(t, n, r) {
	let i = lC(t, n);
	if (!i) return !1;
	let a = e().chat[i.mesId];
	if (i.swipe === null) {
		let e = lm(a), t = structuredClone(e.images ?? {});
		r(t), dm(i.mesId, {
			...e,
			images: t
		});
	} else {
		let e = a.swipe_info[i.swipe].extra[cm], t = structuredClone(e.images ?? {});
		r(t), e.images = t;
	}
	return JS(), await e().saveChat(), !0;
}
var dC = (e, t, n) => {
	let r = e[t] ??= [];
	for (let e = r.length; e <= n; e++) r[e] = { keys: [] };
	return r[n];
};
async function fC(e, t) {
	if (!hS(e.api) || !t?.length) return [];
	let n = [];
	for (let r of t) {
		let t = e.refs.find((e) => e.id === r), i = t && await bx(t.blob);
		t && i && n.push({
			id: t.id,
			description: t.description,
			blob: i
		});
	}
	return n;
}
var pC = class extends Error {
	constructor() {
		super("No image connection"), this.name = "NoImageConnection";
	}
};
async function mC(t, n, r) {
	let i = lm(e().chat[t]);
	if (!i) return;
	let a = rC(i.genId, n, r);
	if (nC.get(a)?.status === "running") return;
	let o = new AbortController();
	nC.set(a, {
		status: "running",
		abort: o
	});
	try {
		let e = iC();
		if (!e) throw new pC();
		let s = sC(i, n)[r], c = cC(i, n, r);
		if (!s || !c.trim()) return;
		let l = await qS(e, {
			prompt: c,
			ratio: s.ratio,
			refs: await fC(e, s.refs)
		}, o.signal), u = [];
		for (let e of l) u.push(await yx(e, { prefix: "img:" }));
		if (!await uC(i.genId, t, (e) => {
			let t = dC(e, n, r);
			t.keys.push(...u), t.shown = t.keys.length - 1;
		})) for (let e of u) Sx(e);
		nC.delete(a);
	} catch (e) {
		o.signal.aborted ? nC.delete(a) : (nC.set(a, {
			status: "error",
			error: e
		}), console.warn("[AP] image generation failed", e));
	} finally {
		nC.get(a)?.status === "running" && nC.delete(a);
	}
}
function hC(e, t, n) {
	let r = nC.get(rC(e, t, n));
	r?.status === "running" ? r.abort.abort() : nC.delete(rC(e, t, n));
}
async function gC(t, n, r, i) {
	let a = lm(e().chat[t]);
	if (!a) return;
	let o = sC(a, n)[r]?.prompt ?? "";
	await uC(a.genId, t, (e) => {
		let t = dC(e, n, r);
		!i.trim() || i === o ? delete t.prompt : t.prompt = i;
	});
}
async function _C(t, n, r, i) {
	let a = lm(e().chat[t]);
	a && await uC(a.genId, t, (e) => {
		dC(e, n, r).shown = i;
	});
}
async function vC(t, n, r, i) {
	let a = lm(e().chat[t]);
	a && (await uC(a.genId, t, (e) => {
		let t = dC(e, n, r), a = t.keys.indexOf(i);
		a < 0 || (t.keys.splice(a, 1), t.shown !== void 0 && t.shown >= a && (t.shown = Math.max(0, t.shown - 1)));
	}), await Sx(i));
}
async function yC(t) {
	let n = _S().image;
	if (!n.enabled || !n.auto || !iC()) return;
	let r = lm(e().chat[t]);
	if (r && r.origin === "story") for (let e of oC(Tp(r.presetId))) {
		let n = sC(r, e.id);
		for (let i = 0; i < n.length; i++) {
			if (r.images?.[e.id]?.[i]?.keys.length) continue;
			let n = lC(r.genId, t);
			if (!n || n.swipe !== null) return;
			await mC(n.mesId, e.id, i);
		}
	}
}
function bC() {
	G_({ image: aC });
}
//#endregion
//#region src/app/receive.ts
var xC = 6e5, SC = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function CC(t, n) {
	let r = mb.pending;
	if (!r || Date.now() - r.at > xC || SC.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	mb.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), dm(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await Bb(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && Mm(Pm(r.ctx.preset), a.global), Kb(), sb.current?.genId === r.ctx.id && ub(sb.current, t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t), yC(t);
}
//#endregion
//#region src/app/annotations.ts
var wC = /* @__PURE__ */ new Set();
function TC(e) {
	for (let t of wC) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function EC(t) {
	let n = e().chat[t], r = lm(n)?.annotations;
	return !n || !r?.length ? [] : dc(n.mes, r).annotations;
}
function DC(t) {
	let n = e().chat[t], r = lm(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = dc(n.mes, r.annotations);
	return i.changed ? (dm(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function OC() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (DC(n) && e().saveChat(), TC(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => TC(Number(e)));
}
var kC = {
	get: (e) => EC(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return wC.add(t), () => wC.delete(t);
	}
}, AC = /* @__PURE__ */ new Set();
function jC(e) {
	for (let t of AC) try {
		t(e);
	} catch (e) {
		console.error("[AP] speech listener failed", e);
	}
}
function MC(t) {
	let n = e().chat[t], r = lm(n)?.speech;
	return !n || !r?.length ? [] : Nc(n.mes, r).spans;
}
function NC(t) {
	let n = e().chat[t], r = lm(n);
	if (!n || !r?.speech?.length) return !1;
	let i = Nc(n.mes, r.speech);
	return i.changed ? (dm(t, {
		...r,
		speech: i.spans
	}), !0) : !1;
}
function PC() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (NC(n) && e().saveChat(), jC(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => jC(Number(e)));
}
var FC = {
	get: (e) => MC(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return AC.add(t), () => AC.delete(t);
	}
}, IC = (e) => !!e?.image, LC = (e) => !!e?.speech, RC = (e) => IC(e) || LC(e);
//#endregion
//#region src/ui/media/errors.ts
function zC(e) {
	return e instanceof Yb ? J(`media.error.proxy.${e.issue}`) : e instanceof Xb ? e.message : e instanceof Error && e.name === "NoImageConnection" ? J("media.error.noConnection") : e instanceof TypeError ? J("media.error.network") : e instanceof lx ? J("media.error.body", { error: e.message }) : e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/media/speech/clip.ts
var BC = class e {
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
}, VC = null;
function HC() {
	return (!VC || VC.state === "closed") && (VC = new AudioContext()), VC;
}
var UC = class {
	carry = null;
	push(e) {
		let t = this.carry === null ? 0 : 1, n = e.length + t >> 1, r = new Float32Array(n), i = 0, a = 0;
		for (this.carry !== null && e.length && (r[a++] = WC(this.carry | e[0] << 8), i = 1, this.carry = null); i + 1 < e.length; i += 2) r[a++] = WC(e[i] | e[i + 1] << 8);
		return i < e.length && (this.carry = e[i]), a === n ? r : r.subarray(0, a);
	}
}, WC = (e) => (e & 32768 ? e - 65536 : e) / 32768, GC = .15, KC = 1.2, qC = class {
	clip;
	sources = /* @__PURE__ */ new Set();
	stopped = !1;
	scheduled = 0;
	constructor(e) {
		this.clip = e;
	}
	async run() {
		let e = HC();
		e.state === "suspended" && await e.resume().catch(() => void 0);
		let t = this.clip.sampleRate, n = new UC(), r = [], i = 0, a = 0, o = GC, s = !1, c = null, l = () => {
			if (!i || this.stopped) return;
			let n = e.createBuffer(1, i, t), l = n.getChannelData(0), u = 0;
			for (let e of r) l.set(e, u), u += e.length;
			r = [], i = 0;
			let d = e.createBufferSource();
			d.buffer = n, d.connect(e.destination), s && a < e.currentTime && (o = Math.min(o * 2, KC)), s = !0, a = Math.max(a, e.currentTime + .05), d.start(a), a += n.duration, this.scheduled += n.duration, this.sources.add(d), d.onended = () => this.sources.delete(d), c = d;
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
async function JC() {
	VC?.state === "running" && await VC.suspend();
}
async function YC() {
	VC?.state === "suspended" && await VC.resume();
}
//#endregion
//#region src/media/speech/segments.ts
function XC(e) {
	let t = e.replace(/<[^>]*>/g, " ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_~`#>|]+/g, "").replace(/\s+/g, " ").trim();
	return /[\p{L}\p{N}]/u.test(t) ? t : "";
}
function ZC(e, t, n) {
	let r = t.filter((e) => !e.orphan && e.end > e.start).sort((e, t) => e.start - t.start), i = [], a = 0, o = (t, r) => {
		if (!n || r <= t) return;
		let a = t;
		for (let n of e.slice(t, r).split(/(\n\s*\n)/)) {
			let e = XC(n);
			e && i.push({
				id: `n${a}`,
				kind: "narration",
				character: "",
				text: e,
				start: a,
				end: a + n.length
			}), a += n.length;
		}
	};
	for (let e of r) {
		if (e.start < a) continue;
		o(a, e.start);
		let t = (e.text ?? e.quote).trim();
		t && i.push({
			id: e.id,
			kind: "speech",
			character: e.character,
			text: t,
			start: e.start,
			end: e.end
		}), a = e.end;
	}
	return o(a, e.length), i;
}
var QC = (e) => e.normalize("NFKC").trim().toLowerCase();
function $C(e, t) {
	if (t.kind === "narration") return e.narrator ?? e.voice;
	let n = QC(t.character);
	return e.bindings.find((e) => QC(e.character) === n)?.voice ?? e.voice;
}
function ew(e) {
	return e ? e.kind === "voice" ? `v:${e.id}` : `c:${e.audio}:${e.text ?? ""}` : "-";
}
function tw(e) {
	let t = 14695981039346656037n, n = new TextEncoder().encode(e);
	for (let e of n) t = BigInt.asUintN(64, (t ^ BigInt(e)) * 1099511628211n);
	return t.toString(16).padStart(16, "0");
}
function nw(e, t, n) {
	return `tts:${tw(JSON.stringify([
		e.api,
		e.baseUrl.trim(),
		e.model,
		e.body.trim(),
		ew(t),
		n
	]))}`;
}
//#endregion
//#region src/media/speech/wav.ts
function rw(e, t) {
	let n = e.length & -2, r = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(44)), i = (e, t) => {
		for (let n = 0; n < t.length; n++) r.setUint8(e + n, t.charCodeAt(n));
	};
	return i(0, "RIFF"), r.setUint32(4, 36 + n, !0), i(8, "WAVE"), i(12, "fmt "), r.setUint32(16, 16, !0), r.setUint16(20, 1, !0), r.setUint16(22, 1, !0), r.setUint32(24, t, !0), r.setUint32(28, t * 2, !0), r.setUint16(32, 2, !0), r.setUint16(34, 16, !0), i(36, "data"), r.setUint32(40, n, !0), new Blob([r.buffer, e.slice(0, n)], { type: "audio/wav" });
}
function iw(e) {
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
var aw = {
	fetch: (e, t) => ix(e, t),
	blob: bx
}, X = /* @__PURE__ */ pn({
	clips: {},
	playing: null,
	paused: !1,
	generating: {}
});
function ow() {
	let e = _S().speech;
	return e.enabled ? wS(e) : void 0;
}
function sw(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !ow()) return [];
	let r = lm(n);
	return !r || !LC(Tp(r.presetId)) ? [] : ZC(n.mes, MC(t), _S().speech.narrator);
}
var cw = /* @__PURE__ */ new Map();
async function lw(e, t, n) {
	if (t?.kind !== "clone" || t.id) return t;
	let r = dS(e.api);
	if (!r?.createClone) return t;
	let i = `${e.id}:${t.audio}:${t.consent ?? ""}`, a = cw.get(i);
	return a || (a = r.createClone(aw, e, t, n), cw.set(i, a), a.catch(() => cw.delete(i))), t.id = await a, vS(), t;
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
var pw = (e, t) => nw(e, $C(e, t), t.text), mw = (e, t) => hw(e, $C(e, t), t.text);
async function hw(e, t, n) {
	let r = nw(e, t, n), i = dw.get(r);
	if (i && i.state !== "error") return fw(r, i);
	let a = await bx(r).catch(() => void 0), o = a ? iw(await a.arrayBuffer()) : null;
	if (o) return X.clips[r] = "ready", fw(r, BC.of(o.pcm, o.sampleRate));
	let s = dS(e.api);
	if (!s) throw Error(`Unknown speech API ${e.api}`);
	return X.clips[r] = "loading", fw(r, new BC(async (r) => {
		let i = await lw(e, t, r);
		return s.synthesize(aw, {
			conn: e,
			text: n,
			voice: i,
			signal: r
		});
	}, (e) => {
		X.clips[r] = e.state, e.state === "ready" && yx(rw(e.pcm(), e.sampleRate), { key: r }).catch((e) => console.warn("[AP] speech cache write failed", e));
	}));
}
function gw(e) {
	let t = ow();
	return t ? X.clips[pw(t, e)] : void 0;
}
async function _w(e) {
	let t = ow();
	if (t) for (let n of e) {
		let e = pw(t, n);
		X.clips[e] || await xx(e).catch(() => !1) && (X.clips[e] ??= "ready");
	}
}
function vw(e) {
	e instanceof DOMException && e.name === "AbortError" || (console.error("[AP] speech synthesis failed", e), x("error", zC(e), J("media.speech")));
}
var yw = null;
function bw() {
	yw && (yw.cancelled = !0, yw.playback?.stop()), yw = null, X.playing = null, X.paused = !1, YC();
}
async function xw() {
	X.playing && (X.paused ? (await YC(), X.paused = !1) : (await JC(), X.paused = !0));
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
			X.playing = {
				mesId: e,
				segId: t[c].id,
				all: r
			}, a.playback = new qC(n), await a.playback.run();
		}
	} catch (e) {
		a.cancelled || vw(e);
	} finally {
		yw === a && (yw = null, X.playing = null, X.paused = !1);
	}
}
function Cw(e, t) {
	let n = X.playing;
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
		let r = await hw(e, t, J("media.speech.sample"));
		if (n.cancelled) return;
		n.playback = new qC(r), await n.playback.run();
	} catch (e) {
		n.cancelled || vw(e);
	} finally {
		yw === n && (yw = null);
	}
}
async function Ew() {
	let e = /* @__PURE__ */ new Set();
	for (let t of _S().speech.connections) for (let n of [
		t.voice,
		t.narrator,
		...t.bindings.map((e) => e.voice)
	]) n?.kind === "clone" && (e.add(n.audio), n.consent && e.add(n.consent));
	await wx("voice:", e).catch(() => void 0);
}
async function Dw(e) {
	let t = ow();
	if (!t || X.generating[e]) return;
	let n = sw(e);
	if (n.length) {
		X.generating[e] = !0;
		try {
			for (let e of n) {
				let n = await mw(t, e);
				if (await n.done, n.state === "error") throw n.error;
			}
		} catch (e) {
			vw(e);
		} finally {
			delete X.generating[e];
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
	return rw(i, r);
}
function kw() {
	let e = _S().speech, t = ow(), n = t?.api ?? "", r = pS(n);
	return {
		vars: {
			on: !!t,
			auto: e.auto,
			api: n,
			narrator: e.narrator,
			characters: !1
		},
		format: fS(n),
		characters: t?.bindings.filter((e) => e.voice).map((e) => e.character) ?? [],
		...r ? { cleaner: r } : {}
	};
}
var Aw = 30;
function jw() {
	G_({ speech: kw }), wx("tts:", /* @__PURE__ */ new Set(), Aw * 864e5).catch(() => void 0);
	let { eventSource: t, eventTypes: n } = e();
	t.on("advanced_preset_message_updated", (e) => {
		let t = Number(e);
		!Number.isNaN(t) && _S().speech.auto && Dw(t);
	});
	for (let e of [n.CHAT_CHANGED]) e && t.on(e, bw);
}
//#endregion
//#region src/store/bundled-modules.ts
function Mw(e, t, n, r) {
	return Rf({
		...q(Uf(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
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
	for (let o of Vf(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = Mw(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = Jf(o), u = qf(c), d = n?.[o.id];
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
		let f = qf(s);
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
	let r = Pm(e), i = Xh(e), a = { ...t.records };
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
	i.push(...t.add), r.bundledModules = a, K();
}
function Iw(e, t, n) {
	let r = Vf(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && Mw(e, i, n, t.enabled);
		if (i && a && qf(a) === qf(t)) {
			let { enabled: e, ...n } = q(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return Gf(t);
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
	let { root: n, checked: r } = Vw(J("um.bundled.conflictTitle"), J("um.bundled.conflictBody", { name: Ip(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: J(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await y(n, J("um.bundled.apply"), J("um.bundled.keepAll")) ? r() : [];
}
async function Uw(e, t) {
	let n = Pm(e), r = Nw(e, Xh(e), n.bundledModules, Np());
	if (Pw(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await Hw(e, a)), Fw(e, r, i), r.add.length && x("info", J("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), Ip(e));
}
var Ww = /* @__PURE__ */ new Map();
function Gw(e, t = {}) {
	let n = e.id, r = (Ww.get(n) ?? Promise.resolve()).then(() => Uw(Tp(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
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
	let t = Xh(e), n = Kw(J("presetFile.installer"), J("presetFile.installerHint"), !0), r, i = () => [];
	if (t.length) {
		let a = Vw(J("um.bundled.exportTitle", { name: Ip(e) }), J("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || J("um.untitled"),
			...e.enabled ? {} : { note: J("um.bundled.disabled") },
			checked: !0
		})));
		a.root.append(n.root), r = a.root, i = a.checked;
	} else {
		r = document.createElement("div"), r.style.textAlign = "start";
		let t = document.createElement("h3");
		t.textContent = J("um.bundled.exportTitle", { name: Ip(e) }), r.append(t, n.root);
	}
	if (!await y(r, J("um.bundled.export"), J("common.cancel"))) return !1;
	let a = i(), o = Iw(e, t.filter((e) => a.includes(e.id)), Np()), s = Ou(o, o.defaultConfiguration, void 0).sampling;
	return Lw(`${zw(e.id)}.apreset.json`, Wd(o, {
		installer: n.box.checked,
		sampling: s
	})), !0;
}
//#endregion
//#region src/app/dev-source.ts
var Jw = /* @__PURE__ */ pn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), Yw = 1500, Xw = null;
async function Zw() {
	let { url: e, enabled: t } = G().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await S(`${n}/`, { cache: "no-store" })).json();
		if (Jw.status = "online", Jw.error = e.ok === !1 ? "build failed" : "", Jw.at = Date.now(), !e.hash || e.hash === Jw.hash) return;
		let t = bp(await (await S(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Jw.presetId && Jw.presetId !== t.id && Op(null, Jw.presetId), Op(t), Jw.presetId = t.id, Jw.hash = t.hash, qm(t), await lh(t), Gw(t, { auto: !0 }), ug("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Jw.status = "error", Jw.error = e instanceof Error ? e.message : String(e);
	}
}
function Qw() {
	if (Xw && clearTimeout(Xw), Xw = null, !G().dev.enabled) return Jw.presetId && Op(null, Jw.presetId), Object.assign(Jw, {
		status: "off",
		presetId: "",
		hash: "",
		error: ""
	}), Promise.resolve();
	Jw.status === "off" && (Jw.status = "connecting");
	let e = async () => {
		await Zw(), G().dev.enabled && (Xw = setTimeout(e, Yw));
	};
	return e();
}
function $w() {
	let e = Promise.resolve();
	return _r(() => [G().dev.enabled, G().dev.url], () => {
		Jw.hash = "", e = Qw();
	}, { immediate: !0 }), e;
}
//#endregion
//#region src/app/impersonate.ts
var eT = "#option_impersonate, #mes_impersonate", tT = () => document.querySelector("#send_textarea");
function nT(e, t = !1, n) {
	let r = tT();
	r && (r.value = n === void 0 ? e : Vb(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function rT() {
	if (!G().enabled) return null;
	let t = ih(), n = t ? Tp(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Lm(n);
	if (!yh(r)) return null;
	let i = Ws(n.meta.impersonatePrompt, (e) => e[0] === "name" ? fd(n, r, e[1]) : void 0);
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
	nT(Vb(n ? `${t}\n${n}` : t), !0);
}
function aT() {
	window.addEventListener("click", iT, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function oT(e) {
	let t = wl(e);
	if (!t) return !1;
	let n = G().presets[e.id]?.customUi, r = Sp(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function sT(e) {
	let t = G().presets[e.id]?.customUi;
	return !!(t && t.hash === wl(e));
}
function cT(e, t) {
	Pm(e).customUi = {
		enabled: t,
		hash: wl(e)
	}, K();
}
//#endregion
//#region src/app/trust.ts
var lT = class extends Error {
	constructor() {
		super(J("trust.declined")), this.name = "TrustDeclined";
	}
}, uT = (e) => e instanceof lT, dT = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function fT(e, t, n, r) {
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
var pT = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function mT(e, t) {
	let n = fu(e);
	if (!n.length || t && dT(n, fu(t))) return;
	let r = Ip(e);
	if (!await y(fT(J("trust.presetTitle"), J("trust.preset", { name: r }), n.length, pT(n)), J("trust.install"), J("common.cancel"))) throw new lT();
}
async function hT(e, t) {
	let n = gp(e);
	if (!(!n.length || t && dT(n, gp(t))) && !await y([
		`<h3>${v(J("trust.qrTitle"))}</h3>`,
		`<p>${v(J("trust.qrBody", {
			name: Ip(e),
			n: n.length
		}))}</p>`,
		`<p>${v(J("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(pT(n))}</pre>`
	].join(""), J("trust.install"), J("common.cancel"))) throw new lT();
}
async function gT(e) {
	let t = Tf(e);
	if (t.length && !await y(fT(J("trust.modulesTitle"), J("trust.modules", { n: e.length }), t.length, pT(t)), J("trust.import"), J("common.cancel"))) throw new lT();
}
async function _T(e) {
	let t = Sl(e);
	if (!t.length) return !1;
	let n = t.map((t) => Fp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(J("common.listSeparator")), r = await y([
		`<h3>${v(J("trust.uiTitle"))}</h3>`,
		`<p>${v(J("trust.uiBody", {
			name: Ip(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${v(J("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(pT(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), J("trust.enableUi"), J("trust.notNow"));
	return cT(e, r), r;
}
async function vT(e) {
	Sl(e).length && !sT(e) && await _T(e);
}
//#endregion
//#region src/app/install.ts
var yT = class extends Error {
	constructor(e) {
		super(J("presets.apUpdating", { name: Ip(e) })), this.name = "ApUpdating";
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
	let n = bp(e);
	if (!n) throw Error(J("presets.invalid"));
	if (n.minAdvancedPreset && mu("1.12.0", n.minAdvancedPreset) < 0) throw await Nb(n.minAdvancedPreset, Ip(n)) ? (CT(n, t), new yT(n)) : Error(J("presets.tooNew", { version: n.minAdvancedPreset }));
	await mT(n, Tp(n.id)), await hT(n, Tp(n.id)), Ep(n), t && (G().sources[n.id] = t), G().declinedUpdates?.[n.id] && delete G().declinedUpdates[n.id], K();
	let r = Tp(n.id) ?? n;
	return qm(r), Sp(r.id)?.source === "installed" && await vT(r), await lh(r), await Gw(r), r;
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
	if (Sp(e)?.source !== "installed") return;
	let t = G().sources[e];
	if (t) return {
		url: t,
		remembered: !0
	};
	let n = Tp(e)?.updateUrl;
	return Nd(n) ? {
		url: n.trim(),
		remembered: !1
	} : void 0;
}
async function kT(e) {
	let t = OT(e);
	if (!t) throw Error(J("presets.noSource"));
	return ET(t.url, t.remembered);
}
async function AT() {
	for (let { preset: e } of xp()) {
		let t = OT(e.id);
		if (!t) continue;
		let n;
		try {
			n = bp(await TT(t.url));
		} catch (n) {
			console.warn("[AP] preset update check failed", e.id, t.url, n);
			continue;
		}
		if (!n || n.id !== e.id) console.warn("[AP] the update source does not hold this preset", e.id, t.url);
		else if (!(mu(n.version, e.version) <= 0 || G().declinedUpdates?.[n.id] === n.hash)) try {
			let e = await wT(n, t.remembered ? t.url : void 0);
			x("success", J("presets.autoUpdated", { version: e.version }), Ip(e));
		} catch (t) {
			if (bT(t)) return;
			uT(t) ? (G().declinedUpdates = {
				...G().declinedUpdates,
				[n.id]: n.hash
			}, K(), x("info", t.message, Ip(n))) : console.warn("[AP] preset update failed", e.id, t);
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
		x("success", J("presets.installed"), Ip(e));
	} catch (e) {
		if (bT(e)) return;
		uT(e) ? x("info", e.message, J("app.name")) : x("error", e instanceof Error ? e.message : String(e), J("app.name"));
	}
}
function MT() {
	let e = [];
	for (let [t, n] of Object.entries(G().installed)) {
		let r = Ap(t), i = bp(n);
		!r || !i || mu(r.version, i.version) <= 0 || (Dp(t), delete G().sources[t], G().declinedUpdates?.[t] && delete G().declinedUpdates[t], e.push(r));
	}
	return e;
}
async function NT(t) {
	if (Dp(t), delete G().sources[t], G().declinedUpdates?.[t] && delete G().declinedUpdates[t], K(), kp(t)) {
		let e = Tp(t);
		e && (qm(e), await lh(e), await Gw(e));
		return;
	}
	let n = sh(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/app/st-preset-io.ts
var PT = "openai_preset_import_file", FT = "export_oai_preset";
function IT(e) {
	let t = zd(e);
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
			await fh(e), YS(), x("success", J("presets.installed"), Ip(e)), tC("presets");
		} catch (e) {
			uT(e) || bT(e) ? x("info", e.message, J("app.name")) : x("error", e instanceof Error ? e.message : String(e), J("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		LT.add(t), e.dispatchEvent(t);
	}
}
function zT() {
	let e = ih(), t = e ? Tp(e) : void 0;
	return t ? (qw(t).catch((e) => x("error", e instanceof Error ? e.message : String(e), J("app.name"))), !0) : !1;
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
		let r = Rd(e.presets[n]);
		return r ? [{
			name: t,
			artifact: r.artifact
		}] : [];
	}) : [];
}
async function UT(e, t) {
	let n = $d(t);
	if (!n) {
		console.warn("[AP] preset file in an unsupported format", e);
		return;
	}
	if (n.minAdvancedPreset && mu("1.12.0", n.minAdvancedPreset) < 0) {
		await Nb(n.minAdvancedPreset, Ip(n)) || console.warn("[AP] preset file needs a newer Advanced Preset", e, n.minAdvancedPreset);
		return;
	}
	let r = G().declinedPresetFiles ?? {};
	if (r[e] === n.hash) return;
	let i = Tp(n.id);
	if (!i || i.hash !== n.hash && mu(n.version, i.version) >= 0) try {
		await wT(n);
	} catch (t) {
		uT(t) ? (G().declinedPresetFiles = {
			...r,
			[e]: n.hash
		}, K(), x("info", t.message, Ip(n))) : x("error", t instanceof Error ? t.message : String(t), e);
		return;
	}
	let a = Tp(n.id), o = VT();
	if (!a || !o) return;
	let s = await lh(a, { select: o.getSelectedPresetName() === e });
	if (s !== e && await o.deletePreset(e), r[e]) {
		let { [e]: t, ...n } = r;
		G().declinedPresetFiles = n, K();
	}
	YS(), x("success", J("presetFile.adopted", {
		file: e,
		carrier: s
	}), Ip(a));
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
	let t = Lm(e), n = (n) => e.actors[n] ? fd(e, t, n) : void 0, r = Pp(e)?.quickReplySets;
	return (e.quickReplySets ?? []).map((e) => ({
		decl: e,
		st: mp(e, n, r?.[e.id])
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
		for (let e of t.qrList) n.addQuickReply(q(e));
		n.updateColor?.(), n.rerender?.(), n.save();
	}
}
var XT = /* @__PURE__ */ new Set();
async function ZT(e, t, n) {
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
		let n = t.sets.filter(({ st: t }) => !e.getSetByName(t.name) || r[t.name] ? !0 : (XT.has(t.name) || (XT.add(t.name), x("warning", J("quickReplies.conflict", { name: t.name }), J("app.name"))), !1)), a = /* @__PURE__ */ new Set();
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
	o && K();
}
function QT() {
	let e = W(() => {
		let e = G().enabled ? XS.value : void 0, t = e ? qT(e) : [], n = xp().map((e) => e.preset);
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
	_r(() => e.value.key, () => {
		let n = _();
		if (!n) return;
		let { active: r, known: i } = e.value;
		t = t.then(() => ZT(n, r, i)).catch((e) => console.error("[AP] Quick Reply sync failed", e));
	}, { immediate: !0 });
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var $T = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", eE = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.switch.sm{width:1.8em;height:1.05em}.switch.sm .thumb{width:.75em;height:.75em;top:.15em;left:.15em}.switch.sm input:checked~.thumb{transform:translate(.75em)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", tE = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}.storyline-badge svg.lucide.storyline-hidden{color:var(--ap-muted)}", nE = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.tab span{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry>*,.um-entry-head>*{transition:opacity .15s}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>.switch{margin-right:6px}.um-entry.off .um-entry-head>:not(.switch),.um-entry.off>:not(.um-entry-head){opacity:.55}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text,.um-var-key,.um-var-value{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-text{field-sizing:content;min-height:5.5em;max-height:24em}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:auto 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row>.switch{margin:calc(.375em + 1px) 4px 0 0}.um-var-pair{padding:2px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:2px;display:flex}.um-var-pair-head{align-items:center;gap:2px;margin-right:-6px;display:flex}.um-var-key{text-overflow:ellipsis;flex:auto;min-width:0;font-weight:600}.um-var-row>*,.um-var-pair>*,.um-var-pair-head>*{transition:opacity .15s}.um-var-row.off>:not(.switch),.um-var-pair.off>:not(.um-var-pair-head),.um-var-pair.off .um-var-pair-head>:not(.switch){opacity:.55}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=420px){.tabs.many .tab span{display:none}.tabs.many .tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tabs.many .tab svg.lucide{width:1.35em;height:1.35em}}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:calc(2.51429em + 8px)}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storylines-head{gap:var(--ap-space-2);min-height:1.6em;padding:0 var(--ap-space-1) 0 var(--ap-space-3)}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-card.hidden .card-title{color:var(--ap-muted)}.storyline-dot{background:var(--ap-primary);border-radius:50%;flex:none;width:.5em;height:.5em}.storyline-flag{width:1.05em;height:1.05em;color:var(--ap-faint);flex:none}.storyline-toolbar{margin-bottom:var(--ap-space-1);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);align-self:flex-start;align-items:center;gap:2px;padding:2px;display:flex}.storyline-toolbar .icon-btn[aria-pressed=true]{background:var(--ap-tint)}.storyline-toolbar.solo{padding:0}.storyline-toolbar.solo .icon-btn.sm{width:calc(1.6em - 2px);height:calc(1.6em - 2px)}.storyline-toolbar-sep{background:var(--ap-border);align-self:stretch;width:1px;margin:3px 2px}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", rE = ".media-conn{gap:var(--ap-space-3)}.media-advanced{gap:var(--ap-space-3);flex-direction:column;display:flex}.media-advanced-toggle{color:var(--ap-muted);align-self:flex-start;gap:4px}.media-refs{gap:var(--ap-space-2)}.media-ref{align-items:center;gap:var(--ap-space-2);min-width:0;display:flex}.media-ref-thumb{object-fit:cover;border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);flex:none;width:2.6em;height:2.6em}.blob-placeholder{background:var(--ap-surface-2);display:inline-block}.image-card{gap:var(--ap-space-2);display:grid}.image-card.multi{grid-template-columns:repeat(auto-fill,minmax(min(100%,14em),1fr))}.image-figure{flex-direction:column;gap:4px;min-width:0;margin:0;display:flex}.image-frame{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);position:relative;overflow:hidden}.image-frame.empty{border:1px dashed var(--ap-border);background:0 0;max-height:22em}.image-open{cursor:zoom-in;background:0 0;border:0;width:100%;padding:0;display:block}.image-open img{object-fit:contain;width:100%;height:auto;max-height:70vh;display:block}.image-empty{justify-content:center;align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3);text-align:center;flex-direction:column;display:flex;position:absolute;inset:0}.image-empty>svg.lucide{width:1.6em;height:1.6em}.image-prompt{-webkit-line-clamp:6;white-space:pre-wrap;-webkit-box-orient:vertical;max-height:100%;margin:0;display:-webkit-box;overflow:hidden}.image-busy{justify-content:center;align-items:center;gap:var(--ap-space-2);color:var(--ap-text);background:color-mix(in srgb, var(--ap-panel-bg-solid) 70%, transparent);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:flex;position:absolute;inset:0}.image-pager{border-radius:var(--ap-radius-pill);color:#fff;background:#00000073;align-items:center;gap:2px;padding:0 4px;display:flex;position:absolute;bottom:6px;right:6px}.image-pager .icon-btn{color:inherit}.image-foot{align-items:center;gap:var(--ap-space-2);min-height:1.9em;display:flex}.image-error{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.image-tools{flex:none}.image-edit textarea{resize:vertical}.image-viewer{color:#fff;background:0 0;border:0;flex-direction:column;justify-content:center;align-items:center;width:100vw;max-width:100vw;height:100vh;max-height:100vh;margin:0;padding:0;display:flex}.image-viewer:not([open]){display:none}.image-viewer::backdrop{background:#000000d1}.image-viewer-img{object-fit:contain;-webkit-user-select:none;user-select:none;max-width:96vw;max-height:calc(100vh - 4.5em)}.image-viewer-bar{align-items:center;gap:var(--ap-space-2);width:min(96vw,60em);padding:var(--ap-space-2);display:flex}.image-viewer-bar .icon-btn{color:#fff}.image-viewer-caption{opacity:.85}.speech-card{align-items:center;gap:var(--ap-space-2);min-height:2em;padding:0 var(--ap-space-1,4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--ap-primary) 5%, transparent);display:flex}.speech-track{flex:auto;align-items:center;gap:2px;min-width:3em;height:1.4em;display:flex}.speech-seg{background:var(--ap-border);cursor:pointer;border:0;border-radius:2px;flex:1 1 0;min-width:3px;height:4px;padding:0;transition:height .12s,background .12s}.speech-seg.narration{opacity:.6}.speech-seg.ready{background:color-mix(in srgb, var(--ap-primary) 45%, transparent)}.speech-seg.loading{background:color-mix(in srgb, var(--ap-primary) 30%, transparent);animation:1.2s ease-in-out infinite ap-pulse}.speech-seg.error{background:var(--ap-danger)}.speech-seg.on{background:var(--ap-primary);opacity:1;height:8px}.speech-seg:hover{height:8px}.speech-who{flex:0 auto;max-width:8em}.speech-binding{align-items:flex-start;gap:var(--ap-space-2);min-width:0;display:flex}.speech-binding>.input:first-child{flex:0 9em;min-width:5em}.speech-voice{flex:auto;align-items:center;gap:4px;min-width:0;display:flex}.speech-voice>.input{flex:auto;min-width:0}.speech-results{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);flex-direction:column;max-height:14em;display:flex;overflow:auto}.speech-result{align-items:center;gap:var(--ap-space-2);padding:4px var(--ap-space-2);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;display:flex}.speech-result:hover{background:var(--ap-surface-2)}.speech-result .grow{min-width:0}", iE = /* @__PURE__ */ pn({ mode: "light" }), aE = new CSSStyleSheet();
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
	}), document.addEventListener("visibilitychange", t), hr(() => {
		let e = XS.value?.theme?.[iE.mode] ?? {}, t = G().ui, n = [];
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
			this.unregister = pE(this), this.app = Ss(t, i), this.app.mount(r);
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
		let a = this.drop(e, t, !!r?.located.length);
		if (r?.located.length) {
			let o = this.stateOf(t), s = (e) => `${o.serial}:${n}:${this.spec.id(e)}`, c = [];
			if (o.highlight) for (let e of r.located) {
				let t = NE(r, e);
				o.highlight.add(t), c.push({
					key: s(e.item),
					mesId: n,
					item: e.item,
					range: t
				});
			}
			else if (i) {
				let e = /* @__PURE__ */ new Map();
				FE(r, this.spec.name, (t, r) => {
					let i = e.get(r);
					i || (i = {
						key: s(r.item),
						mesId: n,
						item: r.item,
						wraps: []
					}, e.set(r, i), c.push(i)), i.wraps.push(t), o.byWrap.set(t, i);
				});
			}
			c.length && o.owners.set(e, c);
			for (let e of c) a.delete(e.key);
			if (this.marked) for (let e of c) this.emphasise(o, e, this.marked(e.mesId, e.item));
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
	return e && Pp(e)?.workflows?.[t]?.stages?.[n] || r;
}
function XE(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return gE(e?.actors[t]?.color, n);
}
function ZE(e) {
	return W(() => {
		let t = e(), n = $S(t), r = db(t, QS(t));
		if (r && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Tp(r.presetId);
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
		let i = Tp(n.presetId);
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
var QE = /* @__PURE__ */ pn({
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
	let n = Tp(lm(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = fd(n, Lm(n), n.narrator);
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
	let n = /* @__PURE__ */ A(!1), r = /* @__PURE__ */ A(null);
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
	return _r(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Zn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Zr(() => {
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
}, DD = ["innerHTML"], OD = /* @__PURE__ */ P({
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
			let r = e.getBoundingClientRect(), i = QE.rect, a = wD(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return _r(() => QE.open && QE.rev, async (e) => {
			if (!e) return;
			await Zn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Zr(() => {
			QE.open = !1;
		}), (e, n) => j(QE).open ? (L(), R("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Le({ "--actor": j(QE).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => j(sD) && j(sD)(...e),
			onMouseleave: n[1] ||= (...e) => j(cD) && j(cD)(...e)
		}, [j(QE).author ? (L(), R("div", ED, k(j(QE).author), 1)) : U("", !0), B("div", {
			class: "rich anno-text",
			innerHTML: j(QE).html
		}, null, 8, DD)], 36)) : U("", !0);
	}
}), kD = /* @__PURE__ */ new Set();
function AD(e) {
	return sw(e).length ? MC(e).filter((e) => !e.orphan) : [];
}
function jD(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var MD = () => G().ui.annotations?.show !== !1, ND = class {
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
		let t = this.mesId, n = e().chat[t], r = sb.current, i = r?.status === "running" && r.mesId === t, a = !(!n || n.is_user || i), o = a && MD() ? EC(t).filter((e) => !e.orphan) : [], s = a ? AD(t) : [], c = n?.mes ?? "", l = (e, n, r, i, a) => e.paint(this, r, t, n.length ? ME(i, c, n) : null, a);
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
	_E("ap-anno-bubble", OD), GD(), fD(() => WD), vD(document), hr(() => {
		let e = G().ui, t = XS.value?.theme?.[iE.mode]?.accent;
		gD(e.annotations?.color || e.accent || t || (iE.mode === "dark" ? "#c084fc" : "#9333ea")), xD.restyle();
	}), _r(() => {
		let e = _S().speech;
		return [
			e.enabled,
			e.active,
			e.narrator,
			e.connections.length
		];
	}, () => PD(void 0, 0)), _r(() => X.playing && `${X.playing.mesId}:${X.playing.segId}`, () => {
		let e = X.playing;
		xD.mark(e ? (t, n) => t === e.mesId && n.id === e.segId : null);
	}), FC.on("change", (e) => PD(e)), _r(MD, () => {
		iD(), PD(void 0, 0);
	}), _r(() => sb.current?.status, () => PD()), kC.on("change", (e) => PD(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		iD(), ID();
	});
	t.on("message_iframe_render_ended", () => FD()), addEventListener("resize", () => iD());
}
//#endregion
//#region src/ui/storylines.ts
var qD = W(() => {
	Y.chatRev;
	let e = XS.value;
	return !!(e && O_(e, Lm(e)));
}), JD = null;
function YD() {
	let t = e().chat ?? [];
	return (!JD || JD.rev !== Y.chatRev || JD.chat !== t || JD.len !== t.length) && (JD = {
		rev: Y.chatRev,
		chat: t,
		len: t.length,
		keys: j_(t)
	}), JD.keys;
}
var XD = () => {
	JD = null;
}, ZD = 60, QD = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > ZD ? `${t.slice(0, ZD)}…` : t;
};
function $D(t) {
	Y.chatRev;
	let n = e().chat ?? [], r = YD(), i = k_(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? lm(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: QD(s?.event || $p(o))
			});
		}), {
			key: e,
			name: Jp(e, i),
			main: e === "",
			if: Kp(e, i),
			hidden: qp(e, i),
			pending: Hp(e),
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
	let i = Qu(t.mes);
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
	let a = e().chat[n], o = lm(a), s = !!db(n, a);
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
	JS(), mO();
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
	r(), _r(() => qD.value, () => hO());
	let i;
	_r(() => sb.current && sb.current.status === "running" && sb.current.streaming && sb.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = sb.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (ub(t, n), clearInterval(i), hO());
		}, 100));
	}), _r(() => sb.current?.status, () => mO());
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
	_r(() => Y.presetId, (e) => {
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
	xO(), CO(), TO(), _r(() => Y.panelOpen, (e) => {
		e && bO();
	});
	let e = yO();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Y.panelOpen = !1);
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
}, PO = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = NO.width, color: s = NO.stroke, ...c }, { slots: l }) => qa("svg", {
	...NO,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": OO(n) || OO(r) || n === !0 || r === !0 ? Number(i || a || NO["stroke-width"]) * 24 / Number(o) : i || a || NO["stroke-width"],
	class: kO("lucide", c.class, ...e ? [`lucide-${AO(MO(e))}-icon`, `lucide-${AO(e)}`] : ["lucide-icon"]),
	...!l.default && !DO(c) && { "aria-hidden": "true" }
}, [...t.map((e) => qa(...e)), ...l.default ? [l.default()] : []]), Z = (e, t) => (n, { slots: r, attrs: i }) => qa(PO, {
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
}]]), CA = /* @__PURE__ */ P({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(null), { open: r, bubble: i } = TD(n, () => t);
		return (t, a) => (L(), R("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [ii(t.$slots, "default"), j(r) && e.text ? (L(), R("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : U("", !0)], 544));
	}
}), wA = [
	"disabled",
	"aria-label",
	"aria-pressed"
], Q = /* @__PURE__ */ P({
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
		return (t, n) => (L(), z(CA, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: M(() => [B("button", {
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
			}, [(L(), z(ei(e.icon)))], 10, wA)]),
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
}, AA = /* @__PURE__ */ P({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(null);
		_r(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Zn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (L(), R("div", {
			class: "stage-body",
			style: Le({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (L(), R("div", TA, [(L(!0), R(I, null, F(e.stage.patches, (e, t) => (L(), R("div", {
			key: t,
			class: O(["patch", { failed: r(e.status) }])
		}, [
			B("div", EA, k(e.old_string), 1),
			V(j(FO), { class: "patch-arrow" }),
			B("div", DA, k(e.new_string), 1),
			r(e.status) ? (L(), R("div", OA, [V(j(RO)), H(k(j(J)(`patch.${e.status}`)), 1)])) : U("", !0)
		], 2))), 128))])) : e.stage.text ? (L(), R("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, k(e.stage.text), 513)) : (L(), R("div", kA, k(j(J)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function jA(t) {
	let n = e().chat[t], r = lm(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), r.speechVersions && (a.speech = i ? r.speechVersions.patched : r.speechVersions.draft), dm(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), JS();
}
async function MA(t, n, r) {
	let i = e().chat[t], a = lm(i);
	return !i || !a ? !1 : (dm(t, um(a, n, r)), JS(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var NA = { class: "stage-bar" }, PA = ["onClick"], FA = { class: "ellipsis" }, IA = {
	key: 0,
	class: "chip stage-chip error"
}, LA = { class: "ellipsis" }, RA = { class: "badge warn" }, zA = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, BA = /* @__PURE__ */ P({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = ZE(() => t.mesid), r = /* @__PURE__ */ A(null), i = /* @__PURE__ */ A(!1), a = W(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = W(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = W(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = W(() => o.value.find((e) => e.id === s.value) ?? null);
		_r(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = G().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: Bk,
			content: hk,
			patch: Sk
		}, d = (e) => e.status === "streaming" ? Nk : e.status === "interrupted" ? XO : e.status === "missing" ? JO : u[e.kind], f = W(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = W(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = W(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${J(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(J("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => j(n) && (o.value.length || j(n).error) ? (L(), R("div", {
			key: 0,
			class: O(["stages", { live: j(n).running }])
		}, [B("div", NA, [
			(L(!0), R(I, null, F(o.value, (e) => (L(), R("button", {
				key: e.id,
				type: "button",
				class: O(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Le({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(L(), z(ei(d(e)), { class: O({ spin: e.status === "streaming" }) }, null, 8, ["class"])), B("span", FA, k(e.label), 1)], 14, PA))), 128)),
			j(n).error ? (L(), R("span", IA, [V(j(pA)), B("span", LA, k(j(n).error), 1)])) : U("", !0),
			r[1] ||= B("span", { class: "grow" }, null, -1),
			f.value.length ? (L(), z(CA, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: M(() => [B("span", RA, [V(j(pA)), H(k(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : U("", !0),
			p.value ? (L(), z(Q, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? j(mA) : j(Yk),
				label: p.value.patchesApplied ? j(J)("stages.revertDraft") : j(J)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => j(jA)(e.mesid)
			}, null, 8, ["icon", "label"])) : U("", !0),
			j(n).running ? U("", !0) : (L(), z(CA, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: M(() => [B("span", zA, [V(j(kk))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (L(), z(AA, {
			key: c.value.id,
			stage: c.value,
			follow: j(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : U("", !0)], 2)) : U("", !0);
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
var WA = { class: "reply-name xs" }, GA = ["innerHTML"], KA = /* @__PURE__ */ P({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = W(() => JE(t.text));
		return (t, r) => (L(), R("div", {
			class: "reply-card",
			style: Le({ "--actor": e.color })
		}, [B("div", WA, k(e.name), 1), B("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, GA)], 4));
	}
}), qA = { class: "card mini-card" }, JA = { class: "card-head" }, YA = { class: "card-title" }, XA = { class: "card-body pre" }, ZA = /* @__PURE__ */ P({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (L(), R("div", qA, [B("header", JA, [
			V(j(gA), { class: "section-icon" }),
			B("span", YA, k(j(J)("cards.impersonate")), 1),
			B("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => j(nT)(e.text, !1, e.mesid)
			}, [V(j(dA)), H(k(j(J)("cards.fillInput")), 1)])
		]), B("div", XA, k(e.text), 1)]));
	}
}), QA = ["aria-label"], $A = ["title", "onClick"], ej = { class: "option-label" }, tj = { class: "option-content small muted" }, nj = /* @__PURE__ */ P({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => nT(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
		return (t, r) => (L(), R("div", {
			class: "options-grid",
			role: "list",
			"aria-label": j(J)("cards.options")
		}, [(L(!0), R(I, null, F(e.options, (e, t) => (L(), R("button", {
			key: t,
			type: "button",
			role: "listitem",
			class: "option",
			title: j(J)("cards.optionHint"),
			onClick: (t) => n(e, t)
		}, [B("span", ej, k(e.label), 1), B("span", tj, k(e.content), 1)], 8, $A))), 128))], 8, QA));
	}
}), rj = {
	key: 0,
	class: "memory-ops"
}, ij = { class: "ellipsis" }, aj = ["aria-label", "onClick"], oj = /* @__PURE__ */ P({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = W(() => {
			let e = Pm(t.preset), n = e.globalMemory.log;
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
					let r = gm(t), i = r ? _m(e, r) : -1, a = n[i];
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
			e.id !== void 0 && Am(Pm(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (L(), R("div", rj, [(L(!0), R(I, null, F(n.value, (e, t) => (L(), z(CA, {
			key: t,
			text: e.op === "delete" ? j(J)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: M(() => [B("span", { class: O(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(L(), z(ei(e.scope === "global" ? j(Ck) : j(Fk)), { class: "faint" })),
				B("span", ij, k(e.key), 1),
				(L(), z(ei(e.op === "delete" ? j(fA) : j(Gk)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (L(), R("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": j(J)("common.undo"),
					onClick: (t) => r(e)
				}, [V(j(mA))], 8, aj)) : U("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : U("", !0);
	}
}), sj = ["aria-label"], cj = /* @__PURE__ */ P({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ A(null), { open: r, bubble: i } = TD(n, () => t);
		return (t, a) => e.text ? (L(), R("span", {
			key: 0,
			ref_key: "anchor",
			ref: n,
			class: "tip help",
			onMouseenter: a[2] ||= (e) => r.value = !0,
			onMouseleave: a[3] ||= (e) => r.value = !1
		}, [B("button", {
			type: "button",
			class: "icon-btn sm",
			"aria-label": e.text,
			onClick: a[0] ||= gs((e) => r.value = !j(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [V(j(YO))], 40, sj), j(r) ? (L(), R("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : U("", !0)], 544)) : U("", !0);
	}
}), lj = { class: "card-title" }, uj = {
	key: 0,
	class: "card-body"
}, dj = /* @__PURE__ */ P({
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
		return (n, r) => (L(), R("section", { class: O(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [B("header", {
			class: O(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (L(), z(ei(e.icon), {
				key: 0,
				class: "section-icon"
			})) : U("", !0),
			B("span", lj, k(e.title), 1),
			V(cj, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			B("span", {
				class: "row",
				onClick: r[0] ||= gs(() => {}, ["stop"])
			}, [ii(n.$slots, "actions")]),
			e.collapsible ? (L(), z(j(GO), {
				key: 1,
				class: O(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : U("", !0)
		], 2), !e.collapsible || t.value ? (L(), R("div", uj, [ii(n.$slots, "default")])) : U("", !0)], 2));
	}
}), fj = {
	key: 0,
	class: "badge neutral"
}, pj = { class: "pre small" }, mj = /* @__PURE__ */ P({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (L(), z(dj, {
			title: j(J)("cards.recap"),
			icon: j(eA),
			collapsible: "",
			open: !1
		}, {
			actions: M(() => [e.coversUpTo === void 0 ? U("", !0) : (L(), R("span", fj, "#0–" + k(e.coversUpTo), 1))]),
			default: M(() => [B("div", pj, k(e.text), 1)]),
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
}, jj = /* @__PURE__ */ P({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(!1), o = /* @__PURE__ */ pn({
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
			a.value = !0, await Zn(), f(), s.value?.focus();
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
		return (t, n) => a.value ? (L(), R("form", {
			key: 0,
			class: "synopsis-editor",
			onSubmit: gs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= gs(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= gs(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= gs(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= gs(() => {}, ["stop"])
		}, [
			B("div", hj, [B("label", gj, [V(j(QO), { class: "faint" }), N(B("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: j(J)("cards.synopsis.time"),
				"aria-label": j(J)("cards.synopsis.time")
			}, null, 8, _j), [[os, o.time]])]), B("label", vj, [V(j(Pk), { class: "faint" }), N(B("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: j(J)("cards.synopsis.location"),
				"aria-label": j(J)("cards.synopsis.location")
			}, null, 8, yj), [[os, o.location]])])]),
			N(B("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: j(J)("cards.synopsis.event"),
				"aria-label": j(J)("cards.synopsis.event")
			}, null, 8, bj), [[os, o.event]]),
			N(B("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: j(J)("cards.synopsis.summary"),
				"aria-label": j(J)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, xj), [[os, o.summary]]),
			B("div", Sj, [
				B("span", Cj, k(j(J)("cards.synopsis.keys")), 1),
				B("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, k(j(J)("common.cancel")), 1),
				B("button", wj, [V(j(WO)), H(k(j(J)("common.save")), 1)])
			])
		], 32)) : (L(), R("div", {
			key: 1,
			class: O(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [B("div", Tj, [B("div", Ej, [
			e.synopsis.time ? (L(), R("span", Dj, [V(j(QO), { class: "faint" }), H(k(e.synopsis.time), 1)])) : U("", !0),
			e.synopsis.location ? (L(), R("span", Oj, [V(j(Pk), { class: "faint" }), H(k(e.synopsis.location), 1)])) : U("", !0),
			B("span", kj, k(e.synopsis.event), 1)
		]), e.editable ? (L(), R("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= gs(() => {}, ["stop"])
		}, [V(Q, {
			icon: j(Gk),
			label: j(J)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : U("", !0)]), i.value && e.synopsis.summary ? (L(), R("div", Aj, k(e.synopsis.summary), 1)) : U("", !0)], 2));
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
}, Wj = /* @__PURE__ */ P({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ pn({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ A(), s = (e) => (n.status[e] ?? "").trim(), c = W(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, ek],
			[/雪|snow|sleet|blizzard/i, oA],
			[/雨|rain|drizzle|shower/i, tk],
			[/雾|霾|fog|mist|haze|smog/i, $O],
			[/风|wind|gale|breez/i, yA],
			[/阴|云|cloud|overcast/i, rk],
			[/夜|月|night|moon/i, Rk],
			[/晴|sun|clear|fair/i, uA]
		], u = W(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? nk), d = () => Object.fromEntries(Rc.map((e) => [e, a[e].trim()])), f = W(() => Rc.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of Rc) a[e] = n.status[e] ?? "";
			i.value = !0, await Zn(), o.value?.querySelector("input")?.focus();
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
		return (t, n) => i.value ? (L(), R("form", {
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
		}, [B("div", Mj, [(L(!0), R(I, null, F(j(Rc), (e) => (L(), R("label", {
			key: e,
			class: "synopsis-field"
		}, [(L(), z(ei(_[e]), { class: "faint" })), N(B("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: j(J)(`cards.status.${e}`),
			"aria-label": j(J)(`cards.status.${e}`)
		}, null, 8, Nj), [[os, a[e]]])]))), 128))]), B("div", Pj, [
			B("span", Fj, k(j(J)("cards.status.keys")), 1),
			B("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, k(j(J)("common.cancel")), 1),
			B("button", Ij, [V(j(WO)), H(k(j(J)("common.save")), 1)])
		])], 544)) : (L(), R("div", Lj, [B("div", Rj, [
			c.value ? (L(), R("span", zj, [V(j(UO), { class: "faint" }), H(k(c.value), 1)])) : U("", !0),
			s("time") ? (L(), R("span", Bj, [V(j(QO), { class: "faint" }), H(k(s("time")), 1)])) : U("", !0),
			s("location") ? (L(), R("span", Vj, [V(j(Pk), { class: "faint" }), B("span", Hj, k(s("location")), 1)])) : U("", !0),
			s("weather") ? (L(), R("span", Uj, [(L(), z(ei(u.value), { class: "faint" })), H(k(s("weather")), 1)])) : U("", !0)
		]), e.editable ? (L(), R("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= gs(() => {}, ["stop"])
		}, [V(Q, {
			icon: j(Gk),
			label: j(J)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : U("", !0)]));
	}
}), Gj = ["innerHTML"], Kj = {
	key: 1,
	class: "kv-list small"
}, qj = { class: "pre" }, Jj = /* @__PURE__ */ P({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = W(() => typeof t.value == "string" ? JE(t.value) : "");
		return (t, r) => (L(), z(dj, {
			title: e.title,
			icon: j(rA),
			collapsible: "",
			open: !1
		}, {
			default: M(() => [typeof e.value == "string" ? (L(), R("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, Gj)) : (L(), R("dl", Kj, [(L(!0), R(I, null, F(e.value, (e, t) => (L(), R(I, { key: t }, [B("dt", null, k(t), 1), B("dd", qj, k(e), 1)], 64))), 128))]))]),
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
			let n = Yl(e.code, $j(r));
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
}, iM = /* @__PURE__ */ P({
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
		return Yr(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await eM(t.component, r, t.context);
			});
		}), _r(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), _r(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await eM(e, r, t.context));
		})), Zr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (L(), R("div", tM, [B("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, nM), r.value ? (L(), R("div", rM, k(j(J)("cards.custom.error", { error: r.value })), 1)) : U("", !0)]));
	}
}), aM = { class: "speech-card" }, oM = ["aria-label"], sM = [
	"aria-label",
	"title",
	"onClick"
], cM = {
	key: 0,
	class: "speech-who xs muted ellipsis"
}, lM = /* @__PURE__ */ P({
	__name: "SpeechCard",
	props: {
		mesid: {},
		segments: {}
	},
	setup(e) {
		let t = e, n = W(() => X.playing?.mesId === t.mesid && X.playing.all ? X.playing : null), r = W(() => X.playing?.mesId === t.mesid ? X.playing.segId : null), i = W(() => t.segments.map((e) => gw(e))), a = W(() => i.value.every((e) => e === "ready")), o = W(() => !!X.generating[t.mesid]), s = W(() => t.segments.find((e) => e.id === r.value)), c = W(() => s.value ? s.value.character || J("media.speech.narration") : "");
		_r(() => t.segments.map((e) => e.id + e.text).join("\n"), () => {
			_w(t.segments);
		}, { immediate: !0 });
		function l() {
			n.value ? xw() : ww(t.mesid);
		}
		async function u() {
			let e = await Ow(t.mesid);
			e && Rw(e, `speech-${t.mesid}.wav`);
		}
		return (t, s) => (L(), R("div", aM, [
			V(Q, {
				icon: n.value && !j(X).paused ? j(Uk) : j(Kk),
				label: n.value && !j(X).paused ? j(J)("media.speech.pause") : j(J)("media.speech.play"),
				active: !!n.value,
				onClick: l
			}, null, 8, [
				"icon",
				"label",
				"active"
			]),
			B("div", {
				class: "speech-track",
				role: "group",
				"aria-label": j(J)("media.speech.lines")
			}, [(L(!0), R(I, null, F(e.segments, (t, n) => (L(), R("button", {
				key: t.id,
				type: "button",
				class: O(["speech-seg", [
					i.value[n],
					t.kind,
					{ on: t.id === r.value }
				]]),
				style: Le({ flexGrow: Math.max(4, Math.min(t.text.length, 160)) }),
				"aria-label": `${t.character || j(J)("media.speech.narration")}: ${t.text}`,
				title: `${t.character || j(J)("media.speech.narration")}: ${t.text}`,
				onClick: (n) => j(ww)(e.mesid, t.id)
			}, null, 14, sM))), 128))], 8, oM),
			c.value ? (L(), R("span", cM, k(c.value), 1)) : U("", !0),
			j(X).playing?.mesId === e.mesid ? (L(), z(Q, {
				key: 1,
				icon: j(lA),
				label: j(J)("media.speech.stop"),
				small: "",
				onClick: s[0] ||= (e) => j(bw)()
			}, null, 8, ["icon", "label"])) : a.value ? (L(), z(Q, {
				key: 3,
				icon: j(dk),
				label: j(J)("media.speech.download"),
				small: "",
				align: "end",
				onClick: u
			}, null, 8, ["icon", "label"])) : (L(), z(Q, {
				key: 2,
				icon: o.value ? j(Nk) : j(sA),
				class: O({ spin: o.value }),
				label: j(J)("media.speech.generateAll"),
				disabled: o.value,
				small: "",
				onClick: s[1] ||= (t) => j(Dw)(e.mesid)
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
}, fM = /* @__PURE__ */ P({
	__name: "BlobImage",
	props: {
		blobKey: {},
		alt: {}
	},
	emits: ["missing"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A();
		return _r(() => n.blobKey, async (e) => {
			i.value = void 0;
			let t = await Ex(e).catch(() => void 0);
			e === n.blobKey && (i.value = t, t || r("missing"));
		}, { immediate: !0 }), (t, n) => i.value ? (L(), R("img", {
			key: 0,
			src: i.value,
			alt: e.alt ?? "",
			draggable: "false"
		}, null, 8, uM)) : (L(), R("span", dM));
	}
}), pM = ["aria-label"], mM = { class: "image-viewer-bar" }, hM = { class: "small" }, gM = {
	key: 1,
	class: "small grow ellipsis image-viewer-caption"
}, _M = /* @__PURE__ */ P({
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
		Yr(() => i.value?.showModal());
		function s(e) {
			e.stopPropagation(), e.key === "ArrowLeft" ? o(-1) : e.key === "ArrowRight" && o(1);
		}
		let c = null, l = (e) => {
			let t = e.changedTouches[0]?.clientX;
			c !== null && t !== void 0 && Math.abs(t - c) > 40 && n.keys.length > 1 && o(t < c ? 1 : -1), c = null;
		};
		return (t, n) => (L(), R("dialog", {
			ref_key: "dialog",
			ref: i,
			class: "image-viewer",
			"aria-label": e.caption,
			onClose: n[3] ||= (e) => r("close"),
			onClick: n[4] ||= gs((e) => i.value?.close(), ["self"]),
			onKeydown: s,
			onTouchstartPassive: n[5] ||= (e) => /* @__PURE__ */ Tn(c) ? c.value = e.touches[0]?.clientX ?? null : c = e.touches[0]?.clientX ?? null,
			onTouchend: l
		}, [V(fM, {
			"blob-key": e.keys[a.value],
			alt: e.caption,
			class: "image-viewer-img"
		}, null, 8, ["blob-key", "alt"]), B("div", mM, [
			e.keys.length > 1 ? (L(), R(I, { key: 0 }, [
				V(Q, {
					icon: j(KO),
					label: j(J)("media.image.previous"),
					onClick: n[0] ||= (e) => o(-1)
				}, null, 8, ["icon", "label"]),
				B("span", hM, k(a.value + 1) + " / " + k(e.keys.length), 1),
				V(Q, {
					icon: j(qO),
					label: j(J)("media.image.next"),
					onClick: n[1] ||= (e) => o(1)
				}, null, 8, ["icon", "label"])
			], 64)) : U("", !0),
			e.caption ? (L(), R("span", gM, k(e.caption), 1)) : U("", !0),
			V(Q, {
				icon: j(xA),
				label: j(J)("common.close"),
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
	class: "image-prompt small muted"
}, SM = {
	key: 2,
	class: "image-busy",
	role: "status"
}, CM = { class: "small" }, wM = {
	key: 3,
	class: "image-pager"
}, TM = { class: "xs" }, EM = ["aria-label"], DM = { class: "row end tight" }, OM = {
	type: "submit",
	class: "btn sm-btn"
}, kM = {
	key: 1,
	class: "image-foot"
}, AM = ["title"], jM = {
	key: 1,
	class: "xs muted grow ellipsis"
}, MM = { class: "row tight image-tools" }, NM = /* @__PURE__ */ P({
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
		let t = e, n = W(() => t.record?.keys ?? []), r = W(() => Math.min(t.record?.shown ?? n.value.length - 1, n.value.length - 1)), i = W(() => n.value[r.value]), a = W(() => t.record?.prompt ?? t.prompt.prompt), o = W(() => nC.get(rC(t.genId, t.structure, t.index))), s = W(() => o.value?.status === "running"), c = W(() => o.value?.status === "error" ? zC(o.value.error) : ""), l = W(() => (t.prompt.ratio ?? "3:4").replace(":", " / ")), u = () => mC(t.mesid, t.structure, t.index), d = () => hC(t.genId, t.structure, t.index), f = (e) => {
			let i = n.value.length;
			i > 1 && _C(t.mesid, t.structure, t.index, (r.value + e + i) % i);
		}, p = () => {
			i.value && vC(t.mesid, t.structure, t.index, i.value);
		};
		async function m() {
			let e = i.value, n = e ? await bx(e) : void 0;
			if (!n) return;
			let a = (n.type.split("/")[1] ?? "png").replace("jpeg", "jpg").replace("svg+xml", "svg");
			Bw(`image-${t.mesid}-${t.index + 1}-${r.value + 1}.${a}`, n);
		}
		let h = /* @__PURE__ */ A(!1), g = /* @__PURE__ */ A(""), _ = /* @__PURE__ */ A();
		async function v() {
			g.value = a.value, h.value = !0, await Zn(), _.value?.focus();
		}
		async function y(e) {
			h.value = !1, g.value.trim() !== a.value.trim() && await gC(t.mesid, t.structure, t.index, g.value.trim()), e && u();
		}
		function b(e) {
			e.stopPropagation(), !e.isComposing && (e.key === "Escape" ? (e.preventDefault(), h.value = !1) : e.key === "Enter" && (e.ctrlKey || e.metaKey) && (e.preventDefault(), y(!0)));
		}
		let x = /* @__PURE__ */ A(!1);
		return (t, o) => (L(), R("figure", vM, [
			B("div", {
				class: O(["image-frame", { empty: !i.value }]),
				style: Le(i.value ? void 0 : { aspectRatio: l.value })
			}, [
				i.value ? (L(), R("button", {
					key: 0,
					type: "button",
					class: "image-open",
					"aria-label": j(J)("media.image.view"),
					onClick: o[0] ||= (e) => x.value = !0
				}, [V(fM, {
					"blob-key": i.value,
					alt: e.prompt.caption ?? a.value
				}, null, 8, ["blob-key", "alt"])], 8, yM)) : (L(), R("div", bM, [!s.value && !c.value ? (L(), z(j(Ek), {
					key: 0,
					class: "faint",
					"aria-hidden": "true"
				})) : U("", !0), h.value ? U("", !0) : (L(), R("p", xM, k(a.value), 1))])),
				s.value ? (L(), R("div", SM, [
					V(j(Nk), {
						class: "spin",
						"aria-hidden": "true"
					}),
					B("span", CM, k(j(J)("media.image.generating")), 1),
					V(Q, {
						icon: j(xA),
						label: j(J)("common.cancel"),
						small: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				])) : U("", !0),
				i.value && n.value.length > 1 && !s.value ? (L(), R("div", wM, [
					V(Q, {
						icon: j(KO),
						label: j(J)("media.image.previous"),
						small: "",
						onClick: o[1] ||= (e) => f(-1)
					}, null, 8, ["icon", "label"]),
					B("span", TM, k(r.value + 1) + " / " + k(n.value.length), 1),
					V(Q, {
						icon: j(qO),
						label: j(J)("media.image.next"),
						small: "",
						onClick: o[2] ||= (e) => f(1)
					}, null, 8, ["icon", "label"])
				])) : U("", !0)
			], 6),
			h.value ? (L(), R("form", {
				key: 0,
				class: "image-edit col",
				onSubmit: o[6] ||= gs((e) => y(!1), ["prevent"]),
				onKeydown: b,
				onClick: o[7] ||= gs(() => {}, ["stop"])
			}, [N(B("textarea", {
				ref_key: "input",
				ref: _,
				"onUpdate:modelValue": o[3] ||= (e) => g.value = e,
				class: "input small",
				rows: "4",
				"aria-label": j(J)("media.image.prompt")
			}, null, 8, EM), [[os, g.value]]), B("div", DM, [
				B("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: o[4] ||= (e) => h.value = !1
				}, k(j(J)("common.cancel")), 1),
				B("button", OM, k(j(J)("common.save")), 1),
				B("button", {
					type: "button",
					class: "btn primary sm-btn",
					onClick: o[5] ||= (e) => y(!0)
				}, [V(j(vA)), H(k(j(J)("media.image.generate")), 1)])
			])], 32)) : (L(), R("figcaption", kM, [c.value ? (L(), R("span", {
				key: 0,
				class: "xs text-danger grow image-error",
				title: c.value
			}, k(c.value), 9, AM)) : (L(), R("span", jM, k(e.prompt.caption ?? ""), 1)), B("div", MM, [
				!i.value && !s.value ? (L(), R("button", {
					key: 0,
					type: "button",
					class: "btn sm-btn",
					onClick: u
				}, [V(j(vA)), H(k(j(J)(c.value ? "media.image.retry" : "media.image.generate")), 1)])) : U("", !0),
				i.value && !s.value ? (L(), z(Q, {
					key: 1,
					icon: j(Xk),
					label: j(J)("media.image.regenerate"),
					small: "",
					onClick: u
				}, null, 8, ["icon", "label"])) : U("", !0),
				e.editable && !s.value ? (L(), z(Q, {
					key: 2,
					icon: j(Gk),
					label: j(J)("media.image.editPrompt"),
					small: "",
					onClick: v
				}, null, 8, ["icon", "label"])) : U("", !0),
				i.value ? (L(), z(Q, {
					key: 3,
					icon: j(dk),
					label: j(J)("media.image.download"),
					small: "",
					onClick: m
				}, null, 8, ["icon", "label"])) : U("", !0),
				i.value && e.editable && !s.value ? (L(), z(Q, {
					key: 4,
					icon: j(fA),
					label: j(J)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: p
				}, null, 8, ["icon", "label"])) : U("", !0)
			])])),
			x.value && i.value ? (L(), z(_M, {
				key: 2,
				keys: n.value,
				start: r.value,
				caption: e.prompt.caption ?? a.value,
				onClose: o[8] ||= (e) => x.value = !1
			}, null, 8, [
				"keys",
				"start",
				"caption"
			])) : U("", !0)
		]));
	}
}), PM = /* @__PURE__ */ P({
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
		return (t, n) => (L(), R("div", { class: O(["image-card", { multi: e.prompts.length > 1 }]) }, [(L(!0), R(I, null, F(e.prompts, (t, n) => (L(), z(NM, {
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
}), FM = /* @__PURE__ */ P({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = ZE(() => t.mesid), r = W(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && sb.current?.genId === e.genId ? sb.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = oT(r), u = !(!i || e.live), d = q(o);
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
						let t = i && !e.live && r.image ? wc(a)?.images : void 0;
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
						let i = Fp(r, "structures", n.id, "title", n.title || n.id), o = xl(n);
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
									name: Ip(r),
									version: r.version
								},
								lang: Np(),
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
				narrator: fd(r, Lm(r), r.narrator),
				color: XE(r, r.narrator),
				items: c
			};
		}), i = W(() => t.position === "top" && n.value && !n.value.live ? sw(t.mesid) : []);
		return (t, n) => r.value?.items.length || i.value.length ? (L(), R("div", {
			key: 0,
			class: O(["cards", `cards-${e.position}`])
		}, [i.value.length ? (L(), z(lM, {
			key: 0,
			mesid: e.mesid,
			segments: i.value
		}, null, 8, ["mesid", "segments"])) : U("", !0), (L(!0), R(I, null, F(r.value?.items ?? [], (t) => (L(), R(I, { key: t.id }, [r.value ? t.type === "reply" ? (L(), z(KA, {
			key: 1,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (L(), z(ZA, {
			key: 2,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (L(), z(nj, {
			key: 3,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (L(), z(jj, {
			key: 4,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => j(MA)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (L(), z(Wj, {
			key: 5,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => j(MA)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (L(), z(oj, {
			key: 6,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (L(), z(mj, {
			key: 7,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (L(), z(Jj, {
			key: 8,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (L(), z(iM, {
			key: 9,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : t.type === "image" ? (L(), z(PM, {
			key: 10,
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
		])) : U("", !0) : (L(), R(I, { key: 0 }, [], 64))], 64))), 128))], 2)) : U("", !0);
	}
}), IM = {
	key: 0,
	class: "dock stages live"
}, LM = { class: "stage-bar" }, RM = { class: "ellipsis" }, zM = {
	key: 0,
	class: "small muted"
}, BM = /* @__PURE__ */ P({
	__name: "Dock",
	setup(e) {
		let t = W(() => sb.current && !sb.current.streaming && sb.current.status === "running" ? sb.current : null), n = W(() => {
			let e = t.value;
			if (!e) return [];
			let n = Tp(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: YE(n, e.workflow, t.id, t.label),
				color: XE(n, t.actor)
			}));
		}), r = W(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (L(), R("div", IM, [B("div", LM, [
			V(j(Nk), { class: "spin faint" }),
			(L(!0), R(I, null, F(n.value, (e) => (L(), R("span", {
				key: e.id,
				class: O(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Le({ "--actor": e.color })
			}, [B("span", RM, k(e.label), 1)], 6))), 128)),
			n.value.length ? U("", !0) : (L(), R("span", zM, k(j(J)("stages.waiting")), 1))
		]), r.value ? (L(), z(AA, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : U("", !0)])) : U("", !0);
	}
}), VM = ["title"], HM = { class: "storyline-name" }, UM = {
	key: 0,
	class: "storyline-if"
}, WM = /* @__PURE__ */ P({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = W(() => {
			if (Y.chatRev, !qD.value) return null;
			let e = YD()[t.mesid];
			if (!e) return null;
			let n = k_();
			return {
				key: e,
				name: Jp(e, n) || J("storylines.unnamed"),
				if: Kp(e, n),
				hidden: qp(e, n)
			};
		});
		return (e, t) => n.value ? (L(), R("button", {
			key: 0,
			type: "button",
			class: O(["storyline-badge", { "if-line": n.value.if }]),
			title: j(J)("storylines.openTab"),
			onClick: t[0] ||= (e) => j(eC)(n.value.key)
		}, [
			V(j(xk), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			B("span", HM, k(n.value.name), 1),
			n.value.if ? (L(), R("span", UM, k(j(J)("storylines.ifLine")), 1)) : U("", !0),
			n.value.hidden ? (L(), z(j(pk), {
				key: 1,
				class: "lucide storyline-hidden",
				"aria-label": j(J)("storylines.hidden")
			}, null, 8, ["aria-label"])) : U("", !0)
		], 10, VM)) : U("", !0);
	}
}), GM = ["aria-label"], KM = ["disabled"], qM = /* @__PURE__ */ P({
	__name: "Switch",
	props: /*@__PURE__*/ di({
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
		let t = gi(e, "modelValue");
		return (n, r) => (L(), R("label", {
			class: O(["switch", { sm: e.small }]),
			"aria-label": e.label
		}, [
			N(B("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, KM), [[ss, t.value]]),
			r[1] ||= B("span", { class: "track" }, null, -1),
			r[2] ||= B("span", { class: "thumb" }, null, -1)
		], 10, GM));
	}
}), JM = { class: "field-label" }, YM = { class: "ellipsis" }, XM = {
	key: 0,
	class: "dot modified"
}, ZM = { class: "field-control" }, $ = /* @__PURE__ */ P({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (L(), R("div", { class: O(["field", { inline: e.inline }]) }, [B("div", JM, [
			B("span", YM, k(e.label), 1),
			e.modified ? (L(), R("span", XM)) : U("", !0),
			V(cj, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), B("div", ZM, [ii(t.$slots, "default")])], 2));
	}
}), QM = { class: "swatches" }, $M = ["title"], eN = ["title"], tN = { class: "swatches" }, nN = ["title"], rN = /* @__PURE__ */ P({
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
		return (e, t) => (L(), z(dj, {
			title: j(J)("appearance.title"),
			icon: j(Hk),
			collapsible: "",
			open: !1
		}, {
			default: M(() => [
				V($, {
					label: j(J)("appearance.colors"),
					help: j(J)("appearance.colors.hint"),
					inline: ""
				}, {
					default: M(() => [B("div", QM, [
						B("label", {
							class: "swatch",
							style: Le({ background: j(r) || "var(--ap-primary-500)" }),
							title: j(J)("appearance.primary")
						}, [N(B("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ Tn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							os,
							j(r),
							void 0,
							{ lazy: !0 }
						]])], 12, $M),
						B("label", {
							class: "swatch",
							style: Le({ background: j(i) || "var(--ap-accent-500)" }),
							title: j(J)("appearance.accent")
						}, [N(B("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ Tn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							os,
							j(i),
							void 0,
							{ lazy: !0 }
						]])], 12, eN),
						V(Q, {
							icon: j(Qk),
							label: j(J)("common.reset"),
							small: "",
							align: "end",
							disabled: !j(r) && !j(i),
							onClick: o
						}, null, 8, [
							"icon",
							"label",
							"disabled"
						])
					])]),
					_: 1
				}, 8, ["label", "help"]),
				V($, {
					label: j(J)("appearance.collapseStages"),
					inline: ""
				}, {
					default: M(() => [V(qM, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				V($, {
					label: j(J)("appearance.annotations"),
					help: j(J)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: M(() => [V(qM, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (L(), z($, {
					key: 0,
					label: j(J)("appearance.annotationColor"),
					inline: ""
				}, {
					default: M(() => [B("div", tN, [B("label", {
						class: "swatch",
						style: Le({ background: l.value || "var(--ap-accent)" }),
						title: j(J)("appearance.annotationColor")
					}, [N(B("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						os,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, nN), V(Q, {
						icon: j(Qk),
						label: j(J)("common.reset"),
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
}), iN = { class: "toolbar" }, aN = ["disabled"], oN = ["disabled"], sN = { class: "preset-list" }, cN = ["onClick", "onKeydown"], lN = { class: "preset-mark" }, uN = { class: "grow col preset-info" }, dN = { class: "row wrap preset-head" }, fN = { class: "preset-name" }, pN = { class: "badge neutral" }, mN = { class: "badge neutral icon-badge" }, hN = {
	key: 0,
	class: "xs muted"
}, gN = {
	key: 1,
	class: "small muted preset-desc"
}, _N = {
	key: 0,
	class: "empty"
}, vN = /* @__PURE__ */ P({
	__name: "PresetsTab",
	setup(e) {
		let t = W(() => xp()), n = (e) => fu(e.preset).length > 0, r = /* @__PURE__ */ A(null), i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(""), o = /* @__PURE__ */ A(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && x("success", n);
			} catch (e) {
				uT(e) || bT(e) ? x("info", e.message) : x("error", e instanceof Error ? e.message : String(e), J("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await fh(e.preset), YS();
		}), l = () => s("url", async () => {
			let e = await ET(a.value);
			return a.value = "", i.value = !1, e;
		}, J("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => DT(t), J("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => kT(e.preset.id), J("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => qw(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => NT(e.preset.id)), m = () => s("ext", async () => x("info", await jb() === "current" ? J("update.none") : J("update.reloading")));
		return (e, s) => (L(), R(I, null, [
			B("div", iN, [
				B("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [V(j(hA)), H(k(j(J)("presets.importFile")), 1)], 8, aN),
				B("button", {
					type: "button",
					class: O(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [V(j(Mk)), H(k(j(J)("presets.importUrl")), 1)], 2),
				s[4] ||= B("span", { class: "grow" }, null, -1),
				V(Q, {
					icon: r.value === "ext" ? j(Nk) : j(Xk),
					label: j(J)("presets.checkUpdates"),
					align: "end",
					disabled: r.value === "ext",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				B("input", {
					ref_key: "fileInput",
					ref: o,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: u
				}, null, 544)
			]),
			i.value ? (L(), R("form", {
				key: 0,
				class: "row",
				onSubmit: gs(l, ["prevent"])
			}, [N(B("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[os, a.value]]), B("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (L(), z(j(Nk), {
				key: 0,
				class: "spin"
			})) : (L(), z(j(dk), { key: 1 })), H(k(j(J)("common.install")), 1)], 8, oN)], 32)) : U("", !0),
			B("div", sN, [(L(!0), R(I, null, F(t.value, (e) => (L(), R("div", {
				key: e.preset.id,
				class: O(["preset-item", { on: j(XS)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: vs((t) => c(e), ["enter"])
			}, [
				B("span", lN, [r.value === `select:${e.preset.id}` ? (L(), z(j(Nk), {
					key: 0,
					class: "spin"
				})) : j(XS)?.id === e.preset.id ? (L(), z(j(WO), { key: 1 })) : U("", !0)]),
				B("div", uN, [
					B("div", dN, [
						B("span", fN, k(j(Ip)(e.preset)), 1),
						B("span", pN, "v" + k(e.preset.version), 1),
						e.source === "builtin" ? U("", !0) : (L(), R("span", {
							key: 0,
							class: O(["badge", { warn: e.source === "dev" }])
						}, k(j(J)(`presets.source.${e.source}`)), 3)),
						n(e) ? (L(), z(CA, {
							key: 1,
							text: j(J)("presets.templates.help")
						}, {
							default: M(() => [B("span", mN, [V(j(ik)), H(k(j(J)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : U("", !0)
					]),
					e.preset.author ? (L(), R("span", hN, k(e.preset.author), 1)) : U("", !0),
					j(Lp)(e.preset) ? (L(), R("span", gN, k(j(Lp)(e.preset)), 1)) : U("", !0)
				]),
				B("div", {
					class: "row preset-actions",
					onClick: s[3] ||= gs(() => {}, ["stop"])
				}, [
					V(Q, {
						icon: j(gk),
						label: j(J)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					j(OT)(e.preset.id) ? (L(), z(Q, {
						key: 0,
						icon: j(Xk),
						label: j(J)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : U("", !0),
					e.source === "installed" ? (L(), z(Q, {
						key: 1,
						icon: j(fA),
						label: j(J)("common.delete"),
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
			], 42, cN))), 128)), t.value.length ? U("", !0) : (L(), R("div", _N, k(j(J)("presets.none")), 1))]),
			V(rN)
		], 64));
	}
}), yN;
function bN() {
	let e = XS, t = W(() => e.value ? Lm(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (zm(r, t), n.sampling && (clearTimeout(yN), yN = setTimeout(() => void ph(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var xN = { class: "empty" }, SN = /* @__PURE__ */ P({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (L(), R("div", xN, [
			V(j(Vk)),
			B("span", null, k(j(J)("panel.noPreset")), 1),
			B("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => j(Y).tab = "presets"
			}, k(j(J)("panel.choosePreset")), 1)
		]));
	}
}), CN = [
	"aria-checked",
	"title",
	"onClick"
], wN = { class: "ellipsis" }, TN = /* @__PURE__ */ P({
	__name: "Segmented",
	props: /*@__PURE__*/ di({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = gi(e, "modelValue");
		return (n, r) => (L(), R("div", {
			class: O(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(L(!0), R(I, null, F(e.options, (e) => (L(), R("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: O({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (L(), z(ei(e.icon), { key: 0 })) : U("", !0), B("span", wN, k(e.label), 1)], 10, CN))), 128))], 2));
	}
}), EN = { class: "col" }, DN = { class: "row" }, ON = ["aria-label"], kN = ["label"], AN = ["value"], jN = ["label"], MN = ["value"], NN = ["placeholder"], PN = {
	key: 1,
	class: "xs muted row tight"
}, FN = { value: "" }, IN = ["value"], LN = ["value"], RN = ["value"], zN = ["value"], BN = [
	"value",
	"placeholder",
	"onChange"
], VN = [
	"value",
	"placeholder",
	"onChange"
], HN = ["value"], UN = ["value"], WN = ["value"], GN = ["value"], KN = ["value"], qN = {
	key: 0,
	class: "xs muted"
}, JN = { class: "custom-ui-list small" }, YN = { class: "grow ellipsis" }, XN = { class: "xs faint" }, ZN = { class: "slider" }, QN = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], $N = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], eP = { class: "field-grid" }, tP = ["value", "onChange"], nP = ["value"], rP = ["value"], iP = /* @__PURE__ */ P({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bN(), i = W(() => t.value ? Pm(t.value) : null), a = W({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				Bm(n, {
					kind: r,
					id: i.join(":")
				}), ph(n);
			}
		}), o = W(() => {
			let e = t.value;
			return e ? Sl(e).map((t) => ({
				id: t.id,
				title: Fp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = W({
			get: () => t.value ? oT(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = Sp(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? cT(n, e) : _T(n);
			}
		}), c = W(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== wl(t.value));
		}), l = W(() => t.value ? Vm(t.value) : !1), u = W(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ A(null), f = /* @__PURE__ */ A("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? Um(e, n) : u.value && Gm(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Hm(t.value), ph(t.value));
		}, g = () => {
			t.value && u.value && (Km(t.value, u.value), ph(t.value));
		}, _ = () => {
			t.value && u.value && Wm(t.value, u.value);
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
			label: Fp(t.value, "workflows", e.id, "name", e.name),
			hint: Fp(t.value, "workflows", e.id, "description", e.description ?? "")
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
			get: () => n.value ? vu(n.value.connection) : "off",
			set: (e) => r((t) => {
				t.connection.sendThoughtSignature = e !== "off" && e;
			})
		}), ae = C("openAiSignatures"), oe = C("streamToolArguments"), se = C("finalFallback"), ce = C("maxSteps"), le = C("assumeToolSupport"), w = W({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), T = W(() => Object.entries(t.value?.actors ?? {})), ue = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), de = W({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), fe = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), pe = W(() => Ms.map((e) => ({
			value: e,
			label: J(`writing.userInput.${e}`),
			hint: J(`writing.userInput.${e}.hint`)
		}))), E = W({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), D = W({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), me = W({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...Ku,
					...t.storylines,
					enabled: e
				};
			})
		}), he = W(() => Gu.map((e) => ({
			value: e,
			label: J(`storylines.freeze.${e}`),
			hint: J(`storylines.freeze.${e}.hint`)
		}))), ge = W({
			get: () => qu(n.value?.storylines),
			set: (e) => r((t) => {
				t.storylines = {
					...Ku,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), _e = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), ve = W({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), ye = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), be = [
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
		], xe = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], Se = ["stream_openai", "show_thoughts"], Ce = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], we = W(() => n.value?.sampling ?? {}), Te = (e) => e in we.value, Ee = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), De = (e) => Number(e.target.value);
		return (e, r) => !j(t) || !j(n) || !i.value ? (L(), z(SN, { key: 0 })) : (L(), R(I, { key: 1 }, [
			B("div", EN, [
				B("div", DN, [
					N(B("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": j(J)("config.configuration")
					}, [B("optgroup", { label: j(J)("config.recommended") }, [(L(!0), R(I, null, F(j(t).configurations, (e) => (L(), R("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, k(j(Fp)(j(t), "configurations", e.id, "name", e.name)), 9, AN))), 128))], 8, kN), i.value.saved.length ? (L(), R("optgroup", {
						key: 0,
						label: j(J)("config.saved")
					}, [(L(!0), R(I, null, F(i.value.saved, (e) => (L(), R("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, k(e.name), 9, MN))), 128))], 8, jN)) : U("", !0)], 8, ON), [[ls, a.value]]),
					u.value && l.value ? (L(), z(Q, {
						key: 0,
						icon: j($k),
						label: j(J)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : U("", !0),
					V(Q, {
						icon: j(qk),
						label: j(J)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (L(), z(Q, {
						key: 1,
						icon: j(Gk),
						label: j(J)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : U("", !0),
					u.value ? (L(), z(Q, {
						key: 2,
						icon: j(fA),
						label: j(J)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : U("", !0),
					V(Q, {
						icon: j(Qk),
						label: j(J)("config.reset"),
						align: "end",
						disabled: !l.value,
						onClick: h
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				d.value ? (L(), R("form", {
					key: 0,
					class: "row",
					onSubmit: gs(m, ["prevent"])
				}, [
					N(B("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: j(J)("config.name"),
						autofocus: ""
					}, null, 8, NN), [[os, f.value]]),
					V(Q, {
						icon: j(xA),
						label: j(J)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					V(Q, {
						icon: j(WO),
						label: j(J)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : U("", !0),
				l.value ? (L(), R("span", PN, [r[29] ||= B("span", { class: "dot modified" }, null, -1), H(k(j(J)("config.modified")), 1)])) : U("", !0)
			]),
			V(dj, {
				title: j(J)("config.connection"),
				icon: j(HO)
			}, {
				default: M(() => [
					V($, {
						label: j(J)("config.transport"),
						help: j(J)(`transport.${y.value}.hint`)
					}, {
						default: M(() => [V(TN, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (L(), R(I, { key: 0 }, [
						V($, {
							label: j(J)("config.forceTool"),
							help: j(J)("config.forceTool.hint"),
							inline: ""
						}, {
							default: M(() => [V(qM, {
								modelValue: j(ne),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ Tn(ne) ? ne.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						V($, {
							label: j(J)("config.parallelTools"),
							help: j(J)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: M(() => [V(qM, {
								modelValue: j(re),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ Tn(re) ? re.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						V($, {
							label: j(J)("config.syntheticTurn"),
							help: j(J)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: M(() => [N(B("select", {
								"onUpdate:modelValue": r[8] ||= (e) => w.value = e,
								class: "input"
							}, [B("option", FN, k(j(J)("common.none")), 1), (L(!0), R(I, null, F(j(t).syntheticTurns, (e) => (L(), R("option", {
								key: e.id,
								value: e.id
							}, k(e.label), 9, IN))), 128))], 512), [[ls, w.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						V($, {
							label: j(J)("config.thoughtSignature"),
							help: j(J)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: M(() => [N(B("select", {
								"onUpdate:modelValue": r[9] ||= (e) => ie.value = e,
								class: "input"
							}, [(L(!0), R(I, null, F(j(ks), (e) => (L(), R("option", {
								key: e,
								value: e
							}, k(j(J)(`config.thoughtSignature.${e}`)), 9, LN))), 128))], 512), [[ls, ie.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						V($, {
							label: j(J)("config.openAiSignatures"),
							help: j(J)("config.openAiSignatures.hint"),
							inline: ""
						}, {
							default: M(() => [V(qM, {
								modelValue: j(ae),
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ Tn(ae) ? ae.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						V($, {
							label: j(J)("config.streamToolArguments"),
							help: j(J)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: M(() => [N(B("select", {
								"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ Tn(oe) ? oe.value = e : null,
								class: "input"
							}, [(L(!0), R(I, null, F(j(Os), (e) => (L(), R("option", {
								key: e,
								value: e
							}, k(j(J)(`config.streamToolArguments.${e}`)), 9, RN))), 128))], 512), [[ls, j(oe)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (L(), z($, {
							key: 0,
							label: j(J)("config.maxSteps"),
							inline: ""
						}, {
							default: M(() => [B("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: j(ce),
								onChange: r[12] ||= (e) => ce.value = De(e)
							}, null, 40, zN)]),
							_: 1
						}, 8, ["label"])) : U("", !0),
						V($, {
							label: j(J)("config.assumeToolSupport"),
							help: j(J)("config.assumeToolSupport.hint"),
							inline: ""
						}, {
							default: M(() => [V(qM, {
								modelValue: j(le),
								"onUpdate:modelValue": r[13] ||= (e) => /* @__PURE__ */ Tn(le) ? le.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"])
					], 64)) : U("", !0),
					V($, {
						label: j(J)("config.finalFallback"),
						help: j(J)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: M(() => [V(qM, {
							modelValue: j(se),
							"onUpdate:modelValue": r[14] ||= (e) => /* @__PURE__ */ Tn(se) ? se.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			S.value.length > 1 ? (L(), z(dj, {
				key: 0,
				title: j(J)("config.workflow"),
				icon: j(bA),
				help: te.value
			}, {
				default: M(() => [V(TN, {
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
			V(dj, {
				title: j(J)("writing.actors"),
				icon: j(fk),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [(L(!0), R(I, null, F(T.value, ([e, t]) => (L(), R("div", {
					key: e,
					class: "field-grid"
				}, [V($, { label: j(J)("writing.actorName", { actor: e }) }, {
					default: M(() => [B("input", {
						class: "input",
						value: j(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => ue("names", e, t.target.value)
					}, null, 40, BN)]),
					_: 2
				}, 1032, ["label"]), V($, { label: j(J)("writing.actorPrefix") }, {
					default: M(() => [B("input", {
						class: "input",
						value: j(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => ue("prefixes", e, t.target.value)
					}, null, 40, VN)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			V(dj, {
				title: j(J)("writing.meta"),
				icon: j(Lk),
				help: j(J)("writing.meta.hint")
			}, {
				actions: M(() => [V(qM, {
					modelValue: D.value,
					"onUpdate:modelValue": r[16] ||= (e) => D.value = e,
					label: j(J)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [D.value ? (L(), z($, {
					key: 0,
					label: j(J)("writing.recentCount"),
					help: j(J)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: M(() => [B("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: j(n).meta.recentCount,
						onChange: r[17] ||= (e) => _e(e.target.value)
					}, null, 40, HN)]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			j(t).storylines ? (L(), z(dj, {
				key: 1,
				title: j(J)("storylines.enabled"),
				icon: j(xk),
				help: j(J)("storylines.config.hint")
			}, {
				actions: M(() => [V(qM, {
					modelValue: me.value,
					"onUpdate:modelValue": r[18] ||= (e) => me.value = e,
					label: j(J)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [me.value ? (L(), z($, {
					key: 0,
					label: j(J)("storylines.freezeVariables"),
					help: j(J)("storylines.freezeVariables.hint")
				}, {
					default: M(() => [V(TN, {
						modelValue: ge.value,
						"onUpdate:modelValue": r[19] ||= (e) => ge.value = e,
						options: he.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"])) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			V(dj, {
				title: j(J)("writing.tokenSaving"),
				icon: j(ok),
				help: j(J)("writing.tokenSaving.hint")
			}, {
				actions: M(() => [V(qM, {
					modelValue: de.value,
					"onUpdate:modelValue": r[20] ||= (e) => de.value = e,
					label: j(J)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [de.value ? (L(), R(I, { key: 0 }, [
					V($, {
						label: j(J)("writing.keepFullTurns"),
						help: j(J)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: M(() => [B("input", {
							class: "input",
							type: "number",
							min: "0",
							value: j(n).tokenSaving.keepFullTurns,
							onChange: r[21] ||= (e) => fe("keepFullTurns", e.target.value)
						}, null, 40, UN)]),
						_: 1
					}, 8, ["label", "help"]),
					V($, {
						label: j(J)("writing.userInput"),
						help: j(J)("writing.userInput.hint")
					}, {
						default: M(() => [V(TN, {
							modelValue: E.value,
							"onUpdate:modelValue": r[22] ||= (e) => E.value = e,
							options: pe.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					E.value === "truncate" ? (L(), z($, {
						key: 0,
						label: j(J)("writing.truncateUserAfter"),
						help: j(J)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: M(() => [B("input", {
							class: "input",
							type: "number",
							min: "0",
							value: j(n).tokenSaving.truncateUserAfter,
							onChange: r[23] ||= (e) => fe("truncateUserAfter", e.target.value)
						}, null, 40, WN)]),
						_: 1
					}, 8, ["label", "help"])) : U("", !0)
				], 64)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			V(dj, {
				title: j(J)("writing.cache"),
				icon: j(uk),
				help: j(J)("writing.cache.hint")
			}, {
				actions: M(() => [V(qM, {
					modelValue: ve.value,
					"onUpdate:modelValue": r[24] ||= (e) => ve.value = e,
					label: j(J)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [ve.value ? (L(), R(I, { key: 0 }, [V($, {
					label: j(J)("writing.cacheTtl"),
					help: j(J)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: M(() => [B("input", {
						class: "input",
						type: "number",
						min: "0",
						value: j(n).cache.ttlMinutes,
						onChange: r[25] ||= (e) => ye("ttlMinutes", e.target.value)
					}, null, 40, GN)]),
					_: 1
				}, 8, ["label", "help"]), V($, {
					label: j(J)("writing.cacheMaxDeferred"),
					help: j(J)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: M(() => [B("input", {
						class: "input",
						type: "number",
						min: "0",
						value: j(n).cache.maxDeferredTurns,
						onChange: r[26] ||= (e) => ye("maxDeferredTurns", e.target.value)
					}, null, 40, KN)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (L(), z(dj, {
				key: 2,
				title: j(J)("config.customUi"),
				icon: j(Jk),
				help: j(J)("config.customUi.hint")
			}, {
				actions: M(() => [V(qM, {
					modelValue: s.value,
					"onUpdate:modelValue": r[27] ||= (e) => s.value = e,
					label: j(J)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: M(() => [c.value && !s.value ? (L(), R("p", qN, k(j(J)("config.customUi.changed")), 1)) : U("", !0), B("ul", JN, [(L(!0), R(I, null, F(o.value, (e) => (L(), R("li", {
					key: e.id,
					class: "row tight"
				}, [B("span", YN, k(e.title), 1), B("span", XN, k(j(J)(`config.customUi.${e.mode}`)) + " · " + k(j(J)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			V(dj, {
				title: j(J)("config.sampling"),
				icon: j(bk),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [
					(L(), R(I, null, F(be, (e) => (L(), R(I, { key: e.key }, [Te(e.key) ? (L(), z($, {
						key: 0,
						label: j(J)(`sampling.${e.key}`)
					}, {
						default: M(() => [B("div", ZN, [B("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: we.value[e.key],
							onInput: (t) => Ee(e.key, De(t))
						}, null, 40, QN), B("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: we.value[e.key],
							onChange: (t) => Ee(e.key, De(t))
						}, null, 40, $N)])]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64)),
					B("div", eP, [(L(), R(I, null, F(xe, (e) => (L(), R(I, { key: e }, [Te(e) ? (L(), z($, {
						key: 0,
						label: j(J)(`sampling.${e}`)
					}, {
						default: M(() => [B("input", {
							class: "input",
							type: "number",
							value: we.value[e],
							onChange: (t) => Ee(e, De(t))
						}, null, 40, tP)]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64)), Te("reasoning_effort") ? (L(), z($, {
						key: 0,
						label: j(J)("sampling.reasoning_effort")
					}, {
						default: M(() => [B("select", {
							class: "input",
							value: we.value.reasoning_effort,
							onChange: r[28] ||= (e) => Ee("reasoning_effort", e.target.value)
						}, [(L(), R(I, null, F(Ce, (e) => B("option", {
							key: e,
							value: e
						}, k(j(J)(`effort.${e}`)), 9, rP)), 64))], 40, nP)]),
						_: 1
					}, 8, ["label"])) : U("", !0)]),
					(L(), R(I, null, F(Se, (e) => (L(), R(I, { key: e }, [Te(e) ? (L(), z($, {
						key: 0,
						label: j(J)(`sampling.${e}`),
						inline: ""
					}, {
						default: M(() => [V(qM, {
							"model-value": !!we.value[e],
							"onUpdate:modelValue": (t) => Ee(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : U("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), aP = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function oP(e) {
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
				label: Fp(e, "workflows", t.id, "name", t.name)
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
			options: t(aP, (e) => J(`um.genType.${e}`))
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
var sP = (e) => e.modules.filter((e) => e.toggle === "user");
function cP(e) {
	let t = oP(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return sP(e).length && r.push({
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
function lP(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function uP(e, t) {
	return t === "module" ? sP(e).map((t) => ({
		value: t.id,
		label: Fp(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Fp(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function dP(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: uP(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Fp(e, "params", t.id, "label", t.label) : r;
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
			label: fP(e, t.id, n.value, n.label)
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
	return oP(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var fP = (e, t, n, r) => Pp(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), pP = {
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
function mP(e, t) {
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
		let n = String(uP(e, t)[0]?.value ?? "");
		return hP(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return hP(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function hP(e, t, n) {
	let r = dP(e, n);
	return t.path && dP(e, t.path).kind === r.kind && pP[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function gP(e, t, n = "") {
	return e === "bool" ? J(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? J(`um.op.list.${t}`) : e === "enum" ? J(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var _P = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(J("um.or")) : t === void 0 ? "" : n(t);
};
function vP(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? J("um.kw.input") : J("um.kw.recentN", { n: t.depth ?? 3 })} ${J(`um.kw.${t.op}`)} ${t.words.join(J("um.or"))}`;
	let n = dP(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? J("um.boolDesc", {
		label: n.label,
		value: gP(n.kind, t.op, t.path)
	}) : `${n.label} ${gP(n.kind, t.op)} ${_P(n, t.value)}`;
}
function yP(e, t) {
	let n = t.rules.filter(uf);
	return n.length ? n.map((t) => vP(e, t)).join(t.match === "any" ? `\n${J("um.match.anyJoin")} ` : `\n${J("um.match.allJoin")} `) : J("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var bP = ["aria-label"], xP = { class: "um-picker-head" }, SP = { class: "small muted" }, CP = { class: "um-choice-text" }, wP = { class: "xs muted" }, TP = ["data-template", "onClick"], EP = { class: "um-choice-text" }, DP = {
	key: 0,
	class: "xs muted um-choice-desc"
}, OP = ["data-id"], kP = ["aria-label", "onPointerdown"], AP = ["onClick"], jP = { class: "um-row-name ellipsis" }, MP = { class: "um-row-meta xs muted ellipsis" }, NP = {
	key: 3,
	class: "faint small"
}, PP = /* @__PURE__ */ P({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => Xh(n.preset)), a = W(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Fp(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Fp(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.filter(ef).map((e) => e.point))].map(o).concat(e.vars.filter(ef).map((e) => s(e.var))).join(" · "), l = (e) => xf(n.preset, e), u = (e) => J("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(uf);
		function f(e, t) {
			e.enabled = t, K();
		}
		let p = W(() => Hf(n.preset).map((e) => ({
			tpl: e,
			body: Rp(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ A(!1), h = /* @__PURE__ */ A(null);
		function g() {
			m.value = !1;
			let e = eg(n.preset, J("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function _(e) {
			m.value = !1;
			let t = tg(n.preset, Rp(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function v() {
			if (!p.value.length) return g();
			m.value = !m.value, m.value && (await Zn(), h.value?.querySelector(".um-choice")?.focus());
		}
		let y = /* @__PURE__ */ A(null);
		async function b(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await gT(Bf(e).modules);
				let { added: t, missing: i } = og(n.preset, e);
				x(i ? "warning" : "success", i ? J("um.importedMissing", {
					n: t.length,
					missing: i
				}) : J("um.imported", { n: t.length }));
			} catch (e) {
				uT(e) ? x("info", e.message) : x("error", J("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => Lw(`${n.preset.id}.ap-modules.json`, ag(n.preset)), ee = /* @__PURE__ */ A(null), te = /* @__PURE__ */ A(null);
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
			i.value[r]?.id !== t && ig(n.preset, t, r);
		}
		let re = () => {
			te.value = null;
		};
		return (t, n) => (L(), z(dj, {
			title: j(J)("um.title"),
			help: j(J)("um.help")
		}, {
			actions: M(() => [
				a.value ? (L(), z(Q, {
					key: 0,
					icon: j(hA),
					label: j(J)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => y.value?.click()
				}, null, 8, ["icon", "label"])) : U("", !0),
				i.value.length ? (L(), z(Q, {
					key: 1,
					icon: j(dk),
					label: j(J)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : U("", !0),
				a.value && i.value.length ? (L(), z(Q, {
					key: 2,
					icon: j(qk),
					label: j(J)("um.new"),
					active: m.value,
					small: "",
					align: "end",
					onClick: v
				}, null, 8, [
					"icon",
					"label",
					"active"
				])) : U("", !0)
			]),
			default: M(() => [
				m.value ? (L(), R("div", {
					key: 0,
					ref_key: "pickerEl",
					ref: h,
					class: "um-picker",
					role: "group",
					"aria-label": j(J)("um.startFrom"),
					onKeydown: n[2] ||= vs(gs((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					B("div", xP, [B("span", SP, k(j(J)("um.startFrom")), 1), V(Q, {
						icon: j(xA),
						label: j(J)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					B("button", {
						type: "button",
						class: "um-choice",
						onClick: g
					}, [V(j(vk)), B("span", CP, [B("span", null, k(j(J)("um.blank")), 1), B("span", wP, k(j(J)("um.blank.desc")), 1)])]),
					(L(!0), R(I, null, F(p.value, (e) => (L(), R("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => _(e.tpl)
					}, [V(j(jk)), B("span", EP, [B("span", null, k(e.body.name), 1), e.body.description ? (L(), R("span", DP, k(e.body.description), 1)) : U("", !0)])], 8, TP))), 128))
				], 40, bP)) : U("", !0),
				i.value.length ? (L(), R("div", {
					key: 1,
					ref_key: "listEl",
					ref: ee,
					class: "um-list"
				}, [(L(!0), R(I, null, F(i.value, (t) => (L(), R("div", {
					key: t.id,
					class: O(["um-row", {
						off: !t.enabled,
						dragging: te.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (L(), R("span", {
						key: 0,
						class: "um-grip",
						"aria-label": j(J)("um.reorder"),
						onPointerdown: (e) => C(e, t.id),
						onPointermove: ne,
						onPointerup: re,
						onPointercancel: re
					}, [V(j(wk))], 40, kP)) : U("", !0),
					B("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [B("span", jP, k(t.name || j(J)("um.untitled")), 1), B("span", MP, k(c(t) || j(J)("um.noEntries")), 1)], 8, AP),
					l(t).length ? (L(), z(CA, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: M(() => [V(j(pA), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : U("", !0),
					d(t) ? (L(), z(CA, {
						key: 2,
						text: j(yP)(e.preset, t.trigger),
						align: "end"
					}, {
						default: M(() => [V(j(SA), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : U("", !0),
					V(qM, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, OP))), 128))], 512)) : a.value && !m.value ? (L(), R("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: v
				}, [V(j(qk)), H(k(j(J)("um.new")), 1)])) : a.value ? U("", !0) : (L(), R("div", NP, k(j(J)("um.noPoints")), 1)),
				B("input", {
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
}), FP = ["title"], IP = ["aria-label", "onClick"], LP = ["placeholder"], RP = /* @__PURE__ */ P({
	__name: "ChipsInput",
	props: /*@__PURE__*/ di({
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
		let t = gi(e, "modelValue"), n = e, r = /* @__PURE__ */ A(""), i = /* @__PURE__ */ A(null);
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
		return (n, l) => (L(), R("div", {
			class: "chips-input input",
			onClick: l[2] ||= (e) => i.value?.focus()
		}, [(L(!0), R(I, null, F(t.value, (t, n) => (L(), R("span", {
			key: t,
			class: O(["chip", { mono: e.mono }])
		}, [B("span", {
			class: "ellipsis",
			title: t
		}, k(t), 9, FP), B("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: gs((e) => c(n), ["stop"])
		}, [V(j(xA))], 8, IP)], 2))), 128)), N(B("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: O(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, LP), [[os, r.value]])]));
	}
}), zP = { class: "rule" }, BP = { class: "rule-head" }, VP = ["value", "aria-label"], HP = ["label"], UP = ["value"], WP = ["value"], GP = ["value"], KP = ["value"], qP = ["value"], JP = {
	key: 1,
	class: "grow"
}, YP = {
	key: 0,
	class: "rule-body"
}, XP = { class: "row wrap" }, ZP = {
	key: 0,
	class: "unit small muted"
}, QP = ["value"], $P = ["value"], eF = { value: "any" }, tF = { value: "none" }, nF = { class: "row kw-words" }, rF = {
	key: 1,
	class: "rule-body"
}, iF = ["value"], aF = {
	key: 2,
	class: "rule-body"
}, oF = ["value"], sF = ["value"], cF = { class: "row wrap option-chips" }, lF = ["aria-pressed", "onClick"], uF = {
	key: 2,
	class: "row"
}, dF = ["value"], fF = ["value"], pF = ["value"], mF = ["list", "value"], hF = ["value"], gF = {
	key: 3,
	class: "rule-error xs"
}, _F = /* @__PURE__ */ P({
	__name: "RuleRow",
	props: /*@__PURE__*/ di({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ di(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = gi(e, "modelValue"), r = W(() => cP(t.preset)), i = W(() => lP(n.value)), a = W(() => uP(t.preset, i.value)), o = W(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = W(() => n.value.kind === "var" ? dP(t.preset, n.value.path) : null), c = W(() => gf(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = mP(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = hP(t.preset, r, `${i}.${e}`);
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
		let g = W(() => s.value?.kind === "list" ? "list" : "bool"), _ = W(() => pP[g.value].map((e) => ({
			value: e,
			label: gP(g.value, e, n.value.path)
		}))), v = W(() => (s.value ? pP[s.value.kind] : []).map((e) => ({
			value: e,
			label: gP(s.value.kind, e)
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
		return (e, t) => (L(), R("div", zP, [
			B("div", BP, [
				B("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": j(J)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(L(!0), R(I, null, F(r.value, (e) => (L(), R("optgroup", {
					key: e.label,
					label: e.label
				}, [(L(!0), R(I, null, F(e.subjects, (e) => (L(), R("option", {
					key: e.id,
					value: e.id
				}, k(e.label), 9, UP))), 128))], 8, HP))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (L(), R("option", {
					key: 0,
					value: i.value
				}, k(n.value.path), 9, WP)) : U("", !0)], 40, VP),
				a.value.length ? (L(), R("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(L(!0), R(I, null, F(a.value, (e) => (L(), R("option", {
					key: String(e.value),
					value: e.value
				}, k(e.label), 9, KP))), 128)), a.value.some((e) => String(e.value) === o.value) ? U("", !0) : (L(), R("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, k(o.value), 9, qP))], 40, GP)) : (L(), R("span", JP)),
				V(Q, {
					icon: j(xA),
					label: j(J)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (L(), R("div", YP, [B("div", XP, [
				V(TN, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (L(), R("label", ZP, [B("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? j(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, QP), H(" " + k(j(J)("um.kw.messages")), 1)])) : U("", !0),
				B("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [B("option", eF, k(j(J)("um.kw.any")), 1), B("option", tF, k(j(J)("um.kw.none")), 1)], 40, $P)
			]), B("div", nF, [V(RP, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": j(J)("common.delete"),
				placeholder: n.value.regex ? j(J)("um.kw.regexPlaceholder") : j(J)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), V(Q, {
				icon: j(Zk),
				label: j(J)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (L(), R("div", rF, [B("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, iF)])) : s.value ? (L(), R("div", aF, [s.value.kind === "bool" || s.value.kind === "list" ? (L(), z(TN, {
				key: 0,
				"model-value": n.value.op,
				options: _.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (L(), R(I, { key: 1 }, [B("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(L(!0), R(I, null, F(v.value, (e) => (L(), R("option", {
				key: e.value,
				value: e.value
			}, k(e.label), 9, sF))), 128))], 40, oF), B("div", cF, [(L(!0), R(I, null, F(s.value.options, (e) => (L(), R("button", {
				key: String(e.value),
				type: "button",
				class: O(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, k(e.label), 11, lF))), 128))])], 64)) : (L(), R("div", uF, [B("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(L(!0), R(I, null, F(v.value, (e) => (L(), R("option", {
				key: e.value,
				value: e.value
			}, k(e.label), 9, fF))), 128))], 40, dF), s.value.kind === "number" ? (L(), R("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, pF)) : (L(), R(I, { key: 1 }, [B("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, mF), s.value.suggestions?.length ? (L(), R("datalist", {
				key: 0,
				id: l
			}, [(L(!0), R(I, null, F(s.value.suggestions, (e) => (L(), R("option", {
				key: e,
				value: e
			}, null, 8, hF))), 128))])) : U("", !0)], 64))]))])) : U("", !0),
			c.value ? (L(), R("div", gF, k(c.value), 1)) : U("", !0)
		]));
	}
}), vF = { class: "trigger" }, yF = {
	key: 1,
	class: "always faint small"
}, bF = {
	key: 0,
	class: "rule-join xs faint"
}, xF = { class: "btn ghost add picker" }, SF = ["aria-label"], CF = ["label"], wF = ["value"], TF = /* @__PURE__ */ P({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ di({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = gi(e, "modelValue"), r = W(() => cP(t.preset)), i = /* @__PURE__ */ A(null), a = W(() => [{
			value: "all",
			label: J("um.match.all")
		}, {
			value: "any",
			label: J("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(mP(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (L(), R("div", vF, [
			n.value.rules.length > 1 ? (L(), z(TN, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : U("", !0),
			n.value.rules.length ? U("", !0) : (L(), R("div", yF, k(j(J)("um.always")), 1)),
			(L(!0), R(I, null, F(n.value.rules, (t, r) => (L(), R(I, { key: r }, [r > 0 ? (L(), R("div", bF, k(n.value.match === "any" ? j(J)("um.match.anyJoin") : j(J)("um.match.allJoin")), 1)) : U("", !0), V(_F, {
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
			B("label", xF, [
				V(j(qk)),
				H(k(j(J)("um.addRule")) + " ", 1),
				B("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": j(J)("um.addRule"),
					onChange: l[1] ||= (e) => o(e.target.value)
				}, [l[2] ||= B("option", {
					value: "",
					disabled: "",
					selected: "",
					hidden: ""
				}, null, -1), (L(!0), R(I, null, F(r.value, (e) => (L(), R("optgroup", {
					key: e.label,
					label: e.label
				}, [(L(!0), R(I, null, F(e.subjects, (e) => (L(), R("option", {
					key: e.id,
					value: e.id
				}, k(e.label), 9, wF))), 128))], 8, CF))), 128))], 40, SF)
			])
		]));
	}
}), EF = { class: "um-entry-head" }, DF = { class: "um-var-label grow ellipsis" }, OF = {
	key: 0,
	class: "um-warn xs"
}, kF = ["placeholder"], AF = [
	"value",
	"placeholder",
	"onInput"
], jF = { class: "um-var-pair-head" }, MF = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], NF = [
	"value",
	"placeholder",
	"onInput"
], PF = ["id"], FF = ["value"], IF = /* @__PURE__ */ P({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => yf(n.preset, n.update.var)), a = W(() => i.value?.type !== n.update.type), o = W(() => i.value ? Fp(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = W(() => i.value && Fp(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = W(() => {
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
			n.update.type === "list" && (n.update.items[e] = rf(t, r));
		}
		function f() {
			let e = n.update;
			e.type === "list" ? e.items.push("") : e.type === "dict" && e.items.push({
				key: "",
				value: ""
			});
		}
		return (t, n) => (L(), R("div", { class: O(["um-entry", {
			lost: a.value,
			off: !j(ef)(e.update)
		}]) }, [
			B("div", EF, [
				V(qM, {
					"model-value": j(ef)(e.update),
					label: j(J)("panel.enabled"),
					"onUpdate:modelValue": n[0] ||= (t) => j(nf)(e.update, t)
				}, null, 8, ["model-value", "label"]),
				B("span", DF, k(o.value), 1),
				V(cj, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				V(Q, {
					icon: j(xA),
					label: j(J)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (L(), R("div", OF, [V(j(pA)), H(k(j(J)("um.bv.lost")), 1)])) : U("", !0),
			e.update.type === "string" ? N((L(), R("textarea", {
				key: 1,
				"onUpdate:modelValue": n[2] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: j(J)("um.bv.append")
			}, null, 8, kF)), [[os, e.update.text]]) : e.update.type === "list" ? (L(!0), R(I, { key: 2 }, F(e.update.items, (t, n) => (L(), R("div", {
				key: n,
				class: O(["um-var-row", { off: !j(ef)(t) }])
			}, [
				V(qM, {
					"model-value": j(ef)(t),
					label: j(J)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => d(n, j(tf)(t), e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				B("textarea", {
					value: j(tf)(t),
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: j(J)("um.bv.item"),
					onInput: (e) => d(n, e.target.value, j(ef)(t))
				}, null, 40, AF),
				V(Q, {
					icon: j(xA),
					label: j(J)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			], 2))), 128)) : (L(), R(I, { key: 3 }, [(L(!0), R(I, null, F(e.update.items, (t, n) => (L(), R("div", {
				key: n,
				class: O(["um-var-pair", { off: !j(ef)(t) }])
			}, [B("div", jF, [
				V(qM, {
					"model-value": j(ef)(t),
					label: j(J)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => j(nf)(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				N(B("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input bare um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: j(J)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, MF), [[os, t.key]]),
				V(Q, {
					icon: j(xA),
					label: j(J)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]), B("textarea", {
				value: t.value ?? "",
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: c.value.has(t.key.trim()) ? j(J)("um.bv.removes") : j(J)("um.bv.value"),
				onInput: (e) => t.value = e.target.value
			}, null, 40, NF)], 2))), 128)), B("datalist", { id: l.value }, [(L(!0), R(I, null, F(c.value, ([e]) => (L(), R("option", {
				key: e,
				value: e
			}, null, 8, FF))), 128))], 8, PF)], 64)),
			e.update.type === "string" ? U("", !0) : (L(), R("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: f
			}, [V(j(qk)), H(k(e.update.type === "dict" ? j(J)("um.bv.addKey") : j(J)("um.bv.addItem")), 1)]))
		], 2));
	}
}), LF = { class: "um-editor" }, RF = { class: "um-head" }, zF = ["placeholder", "aria-label"], BF = { class: "um-entry-head" }, VF = ["onUpdate:modelValue", "aria-label"], HF = ["value"], UF = ["value"], WF = [
	"value",
	"aria-label",
	"onChange"
], GF = ["value"], KF = {
	key: 0,
	class: "um-warn xs"
}, qF = ["onUpdate:modelValue", "placeholder"], JF = {
	key: 1,
	class: "rule-error xs pre"
}, YF = {
	key: 0,
	class: "btn ghost add picker"
}, XF = ["aria-label"], ZF = ["value"], QF = { class: "um-foot" }, $F = ["title"], eI = ["title"], tI = ["title"], nI = /* @__PURE__ */ P({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		_r(() => n.module, K, { deep: !0 });
		let i = /* @__PURE__ */ A(null);
		Yr(() => {
			n.module.entries.some((e) => e.text) || Zn(() => i.value?.select());
		});
		let a = W(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Fp(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Fp(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !_f(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => lu(e.text).errors, d = (e) => u(e).map((e) => e.line ? J("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = $h(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = W(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Fp(n.preset, "vars", e.id, "label", e.label ?? e.id)
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
			v.value ? (rg(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = ng(n.preset, n.module.id, (e) => J("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => Lw(`${n.preset.id}.${zw(n.module.name)}.ap-modules.json`, ag(n.preset, [n.module.id]));
		return (t, n) => (L(), R("div", LF, [
			B("header", RF, [
				V(Q, {
					icon: j(IO),
					label: j(J)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				N(B("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: j(J)("um.untitled"),
					"aria-label": j(J)("um.name")
				}, null, 8, zF), [[os, e.module.name]]),
				V(qM, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: j(J)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			V(dj, {
				title: j(J)("um.content"),
				help: j(J)("um.content.help")
			}, {
				default: M(() => [(L(!0), R(I, null, F(e.module.entries, (t, n) => (L(), R("div", {
					key: t.id,
					class: O(["um-entry", {
						lost: s(t),
						off: !j(ef)(t)
					}])
				}, [
					B("div", BF, [
						V(qM, {
							"model-value": j(ef)(t),
							label: j(J)("panel.enabled"),
							"onUpdate:modelValue": (e) => j(nf)(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						]),
						N(B("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": j(J)("um.point")
						}, [(L(!0), R(I, null, F(a.value, (e) => (L(), R("option", {
							key: e.id,
							value: e.id
						}, k(e.label), 9, HF))), 128)), s(t) ? (L(), R("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, k(j(J)("um.pointMissing", { id: t.point })), 9, UF)) : U("", !0)], 8, VF), [[ls, t.point]]),
						V(cj, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						B("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": j(J)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(L(), R(I, null, F(c, (e) => B("option", {
							key: e,
							value: e
						}, k(j(J)(`um.role.${e || "merge"}`)), 9, GF)), 64))], 40, WF),
						e.module.entries.length > 1 || e.module.vars.length ? (L(), z(Q, {
							key: 0,
							icon: j(xA),
							label: j(J)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : U("", !0)
					]),
					s(t) ? (L(), R("div", KF, [V(j(pA)), H(k(j(J)("um.pointLost")), 1)])) : U("", !0),
					N(B("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: j(J)("um.text.placeholder")
					}, null, 8, qF), [[os, t.text]]),
					u(t).length ? (L(), R("div", JF, k(d(t)), 1)) : U("", !0)
				], 2))), 128)), a.value.length ? (L(), R("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [V(j(qk)), H(k(j(J)("um.addEntry")), 1)])) : U("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (L(), z(dj, {
				key: 0,
				title: j(J)("um.bv"),
				help: j(J)("um.bv.help")
			}, {
				default: M(() => [(L(!0), R(I, null, F(e.module.vars, (t, n) => (L(), z(IF, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (L(), R("label", YF, [
					V(j(qk)),
					H(k(j(J)("um.bv.add")) + " ", 1),
					B("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": j(J)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= B("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (L(!0), R(I, null, F(h.value, (e) => (L(), R("option", {
						key: e.id,
						value: e.id
					}, k(e.label), 9, ZF))), 128))], 40, XF)
				])) : U("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : U("", !0),
			V(dj, {
				title: j(J)("um.trigger"),
				help: j(J)("um.trigger.help")
			}, {
				default: M(() => [V(TF, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			B("footer", QF, [
				B("button", {
					type: "button",
					class: "btn ghost",
					title: j(J)("um.export"),
					onClick: x
				}, [V(j(dk)), B("span", null, k(j(J)("um.export")), 1)], 8, $F),
				B("button", {
					type: "button",
					class: "btn ghost",
					title: j(J)("um.duplicate"),
					onClick: b
				}, [V(j(sk)), B("span", null, k(j(J)("um.duplicate")), 1)], 8, eI),
				n[6] ||= B("span", { class: "grow" }, null, -1),
				B("button", {
					type: "button",
					class: O(["btn ghost danger", { armed: v.value }]),
					title: j(J)("common.delete"),
					onClick: y
				}, [V(j(fA)), B("span", null, k(v.value ? j(J)("um.confirmDelete") : j(J)("common.delete")), 1)], 10, tI)
			])
		]));
	}
}), rI = {
	key: 0,
	class: "module-row"
}, iI = { class: "grow" }, aI = { class: "ellipsis" }, oI = ["aria-label"], sI = ["aria-checked", "onClick"], cI = { class: "grow" }, lI = { class: "grow" }, uI = { class: "ellipsis" }, dI = {
	key: 0,
	class: "empty"
}, fI = /* @__PURE__ */ P({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bN(), i = W(() => t.value && n.value ? ud(t.value, n.value) : {}), a = W(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = cd(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Fp(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Fp(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Fp(e, "groups", t, "label", r?.label ?? t) : J("modules.other"),
					help: t && Fp(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Fp(t.value, "modules", e.id, "name", e.name), s = (e) => Fp(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ A(null), g = /* @__PURE__ */ A(null), _ = W(() => t.value && h.value ? Xh(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Zn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Zn(() => y()?.scrollTo({ top: v }));
		}
		return _r(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !j(t) || !j(n) ? (L(), z(SN, { key: 0 })) : _.value ? (L(), R("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(L(), z(nI, {
			key: _.value.id,
			preset: j(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (L(), R("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			V(PP, {
				preset: j(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(L(!0), R(I, null, F(a.value, (e) => (L(), z(dj, {
				key: e.id,
				title: e.label,
				help: e.help
			}, ri({
				default: M(() => [(L(!0), R(I, null, F(e.sets, (t) => (L(), R(I, { key: t.key }, [t.label ? (L(), R("div", rI, [B("span", iI, [B("span", aI, k(t.label), 1), V(cj, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (L(), z(qM, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : U("", !0)])) : U("", !0), !t.optional || c(t) ? (L(), R("div", {
					key: 1,
					class: O(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(L(!0), R(I, null, F(t.modules, (e) => (L(), R("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: O(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= B("span", { class: "radio" }, null, -1),
					B("span", cI, k(o(e)), 1),
					V(cj, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, sI))), 128))], 10, oI)) : U("", !0)], 64))), 128)), (L(!0), R(I, null, F(e.toggles, (e) => (L(), R("div", {
					key: e.id,
					class: "module-row"
				}, [B("span", lI, [B("span", uI, k(o(e)), 1), V(cj, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), V(qM, {
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
				fn: M(() => [V(qM, {
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
			a.value.length ? U("", !0) : (L(), R("div", dI, k(j(J)("modules.none")), 1))
		], 512));
	}
}), pI = ["value", "onChange"], mI = ["value"], hI = {
	key: 2,
	class: "unit"
}, gI = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], _I = {
	key: 0,
	class: "small muted"
}, vI = [
	"list",
	"value",
	"placeholder",
	"onChange"
], yI = ["id"], bI = ["value"], xI = /* @__PURE__ */ P({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bN(), i = W(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Fp(e, "groups", t, "label", e.groups[t]?.label ?? t) : J("writing.params"),
				help: t && Fp(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Fp(t.value, "params", e.id, "label", e.label), o = (e) => Fp(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => Pp(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => ju(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !j(t) || !j(n) ? (L(), z(SN, { key: 0 })) : (L(!0), R(I, { key: 1 }, F(i.value, (e) => (L(), z(dj, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: j(aA)
		}, {
			default: M(() => [(L(!0), R(I, null, F(e.params, (e) => (L(), z($, {
				key: e.id,
				label: a(e),
				help: o(e)
			}, {
				default: M(() => [e.type === "select" ? (L(), R("select", {
					key: 0,
					class: "input",
					value: c(e),
					onChange: (t) => l(e, t.target.value)
				}, [(L(!0), R(I, null, F(e.options, (t) => (L(), R("option", {
					key: String(t.value),
					value: t.value
				}, k(s(e, t.value, t.label)), 9, mI))), 128))], 40, pI)) : e.type === "list" ? (L(), z(RP, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": j(J)("common.delete"),
					placeholder: j(J)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (L(), R("div", hI, [B("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, gI), e.unit ? (L(), R("span", _I, k(e.unit), 1)) : U("", !0)])) : (L(), R(I, { key: 3 }, [B("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, vI), e.options?.length ? (L(), R("datalist", {
					key: 0,
					id: f(e)
				}, [(L(!0), R(I, null, F(e.options, (t) => (L(), R("option", {
					key: String(t.value),
					value: t.value
				}, k(s(e, t.value, t.label)), 9, bI))), 128))], 8, yI)) : U("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), SI = { class: "kv" }, CI = {
	key: 0,
	class: "kv-row"
}, wI = { class: "kv-key ellipsis" }, TI = { class: "kv-value pre small" }, EI = {
	key: 0,
	class: "kv-actions"
}, DI = {
	key: 1,
	class: "kv-edit col"
}, OI = ["placeholder"], kI = ["placeholder"], AI = { class: "row end" }, jI = {
	key: 0,
	class: "kv-edit col"
}, MI = ["placeholder"], NI = ["placeholder"], PI = { class: "row end" }, FI = {
	key: 1,
	class: "faint small kv-empty"
}, II = /* @__PURE__ */ P({
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
		return (t, n) => (L(), R("div", SI, [
			(L(!0), R(I, null, F(e.entries, (t, l) => (L(), R(I, { key: l }, [i.value === l ? (L(), R("div", DI, [
				N(B("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? j(J)("memory.key")
				}, null, 8, OI), [[os, a.value]]),
				N(B("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? j(J)("memory.content")
				}, null, 8, kI), [[os, o.value]]),
				B("div", AI, [V(Q, {
					icon: j(xA),
					label: j(J)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), V(Q, {
					icon: j(WO),
					label: j(J)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (L(), R("div", CI, [
				B("div", wI, k(l), 1),
				B("div", TI, k(t), 1),
				e.readonly ? U("", !0) : (L(), R("div", EI, [V(Q, {
					icon: j(Gk),
					label: j(J)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), V(Q, {
					icon: j(fA),
					label: j(J)("common.delete"),
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
			i.value === "" ? (L(), R("div", jI, [
				N(B("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? j(J)("memory.key")
				}, null, 8, MI), [[os, a.value]]),
				N(B("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? j(J)("memory.content")
				}, null, 8, NI), [[os, o.value]]),
				B("div", PI, [V(Q, {
					icon: j(xA),
					label: j(J)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), V(Q, {
					icon: j(WO),
					label: j(J)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : U("", !0),
			!Object.keys(e.entries).length && i.value === null ? (L(), R("div", FI, k(j(J)("memory.empty")), 1)) : U("", !0),
			!e.readonly && i.value === null ? (L(), R("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [V(j(qk)), H(k(j(J)("common.add")), 1)])) : U("", !0)
		]));
	}
}), LI = {
	key: 1,
	class: "faint small"
}, RI = {
	key: 0,
	class: "badge neutral"
}, zI = ["placeholder"], BI = {
	key: 1,
	class: "faint small"
}, VI = /* @__PURE__ */ P({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = bN(), r = W(() => n.value ? Pm(n.value) : null), i = W(() => (Y.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => qD.value ? N_() : void 0, o = W(() => (Y.chatRev, i.value ? xm(Infinity, a()) : {})), s = W(() => r.value ? wm(r.value) : {}), c = W(() => (Y.chatRev, i.value ? Sm(Infinity, a()) : null));
		async function l(e, t) {
			await Cm({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), JS();
		}
		async function u(e) {
			await Cm({
				type: "memory.delete",
				key: e,
				source: "user"
			}), JS();
		}
		let d = (e, t) => r.value && Tm(r.value, "replace", e, t, "user"), f = (e) => r.value && Tm(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ A("");
		_r(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = W(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await Cm({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), JS();
		}
		return (e, t) => !j(n) || !r.value ? (L(), z(SN, { key: 0 })) : (L(), R(I, { key: 1 }, [
			V(dj, {
				title: j(J)("memory.chat"),
				icon: j(Fk),
				help: j(J)("memory.chat.hint")
			}, {
				default: M(() => [i.value ? (L(), z(II, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (L(), R("div", LI, k(j(J)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			V(dj, {
				title: j(J)("memory.global"),
				icon: j(Ck),
				help: j(J)("memory.global.hint")
			}, {
				actions: M(() => [V(Q, {
					icon: j(mA),
					label: j(J)("common.undo"),
					small: "",
					align: "end",
					disabled: !j(Em)(r.value),
					onClick: t[0] ||= (e) => j(Om)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), V(Q, {
					icon: j(Yk),
					label: j(J)("common.redo"),
					small: "",
					align: "end",
					disabled: !j(Dm)(r.value),
					onClick: t[1] ||= (e) => j(km)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: M(() => [V(II, {
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
			V(dj, {
				title: j(J)("memory.recap"),
				icon: j(eA),
				help: j(J)("memory.recap.hint")
			}, {
				actions: M(() => [c.value ? (L(), R("span", RI, "#0–" + k(c.value.coversUpTo), 1)) : U("", !0), i.value ? (L(), z(Q, {
					key: 1,
					icon: j(WO),
					label: j(J)("common.save"),
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
				default: M(() => [i.value ? N((L(), R("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: j(J)("memory.recap.empty")
				}, null, 8, zI)), [[os, p.value]]) : (L(), R("div", BI, k(j(J)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), HI = /img:[A-Za-z0-9-]+/g, UI = 6e5;
async function WI(t, n) {
	let r = await S(t, {
		method: "POST",
		headers: e().getRequestHeaders(),
		body: JSON.stringify(n)
	});
	if (!r.ok) throw Error(`${t}: HTTP ${r.status}`);
	return r.text();
}
var GI = (e, t) => {
	for (let n of e.matchAll(HI)) t.add(n[0]);
};
function KI(e, t) {
	let n = JSON.parse(e);
	if (!Array.isArray(n)) throw Error(`${t}: unreadable chat`);
	return e;
}
async function qI(t) {
	let n = /* @__PURE__ */ new Set();
	GI(JSON.stringify(e().chat ?? []), n);
	let r = [], i = JSON.parse(await WI("/api/characters/all", {}));
	for (let e of i) {
		if (!e.avatar) continue;
		let t = JSON.parse(await WI("/api/characters/chats", {
			avatar_url: e.avatar,
			simple: !0
		}));
		if (Array.isArray(t)) for (let i of t) {
			let t = String(i.file_name ?? "").replace(/\.jsonl$/, "");
			t && r.push(async () => GI(KI(await WI("/api/chats/get", {
				ch_name: e.name,
				file_name: t,
				avatar_url: e.avatar
			}), t), n));
		}
	}
	let a = JSON.parse(await WI("/api/groups/all", {}));
	for (let e of a) for (let t of e.chats ?? []) r.push(async () => GI(KI(await WI("/api/chats/group/get", { id: t }), t), n));
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
async function JI(e) {
	let t = await qI(e), n = (await Cx("img:")).length, r = await wx("img:", t, UI);
	return {
		removed: r,
		kept: n - r
	};
}
//#endregion
//#region src/ui/panel/tabs/DebugTab.vue?vue&type=script&setup=true&lang.ts
var YI = { class: "row tight xs muted" }, XI = { class: "row" }, ZI = {
	key: 0,
	class: "xs text-danger"
}, QI = { class: "row wrap xs muted" }, $I = { class: "badge neutral" }, eL = {
	key: 0,
	class: "badge neutral"
}, tL = { class: "badge neutral" }, nL = {
	key: 1,
	class: "badge warn"
}, rL = ["title"], iL = ["title"], aL = {
	key: 0,
	class: "row wrap xs muted"
}, oL = { class: "grow" }, sL = { key: 0 }, cL = ["onClick"], lL = { class: "grow mono" }, uL = { class: "xs muted" }, dL = { class: "row xs muted" }, fL = { class: "badge neutral" }, pL = { class: "pre mono scroll" }, mL = {
	key: 0,
	class: "xs faint region-msg"
}, hL = { key: 1 }, gL = ["onClick"], _L = { class: "grow mono" }, vL = { class: "xs muted" }, yL = {
	key: 0,
	class: "region-msg"
}, bL = { class: "pre mono scroll" }, xL = {
	key: 0,
	class: "xs faint"
}, SL = {
	key: 2,
	class: "xs text-warning"
}, CL = {
	key: 1,
	class: "faint small"
}, wL = ["onClick"], TL = { class: "mono grow ellipsis" }, EL = {
	key: 0,
	class: "badge warn"
}, DL = { class: "xs muted" }, OL = { class: "xs muted" }, kL = { class: "row xs muted" }, AL = { class: "grow" }, jL = { class: "mono scroll" }, ML = { class: "row xs muted" }, NL = { class: "grow" }, PL = { class: "mono scroll" }, FL = {
	key: 0,
	class: "faint small"
}, IL = { class: "row xs" }, LL = { class: "badge neutral" }, RL = { class: "muted" }, zL = { class: "mono scroll" }, BL = {
	key: 0,
	class: "faint small"
}, VL = { class: "row" }, HL = ["disabled"], UL = {
	key: 0,
	class: "xs muted"
}, WL = {
	key: 1,
	class: "xs muted"
}, GL = {
	key: 2,
	class: "xs text-danger"
}, KL = { class: "row xs" }, qL = { class: "badge neutral" }, JL = {
	key: 0,
	class: "badge neutral"
}, YL = { class: "grow muted" }, XL = { class: "small" }, ZL = {
	key: 0,
	class: "faint small"
}, QL = { class: "xs faint mono build" }, $L = /* @__PURE__ */ P({
	__name: "DebugTab",
	setup(t) {
		let n = W(() => cg.log.find((e) => e.kind === "assembly")?.data), r = W(() => cg.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ pn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ pn({});
		_r(n, async (t) => {
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
		}), g = W(() => cg.log.filter((e) => e.kind !== "assembly")), _ = W(() => {
			Y.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) {
				for (let n of EC(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.comment
				});
				for (let n of MC(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.character,
					speech: !0
				});
			}
			return t;
		}), b = W(() => !!(XS.value?.image || _S().image.connections.length)), x = /* @__PURE__ */ A({ running: !1 });
		async function S() {
			if (!x.value.running && await y(`<p>${v(J("debug.images.confirm"))}</p>`, J("common.delete"), J("common.cancel"))) {
				x.value = { running: !0 };
				try {
					let e = await JI((e) => {
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
		return (e, t) => (L(), R(I, null, [
			V(dj, {
				title: j(J)("debug.dev"),
				icon: j(nA),
				help: j(J)("debug.dev.hint")
			}, {
				actions: M(() => [B("span", YI, [B("span", { class: O(["dot status-dot", j(Jw).status]) }, null, 2), H(k(j(J)(`debug.dev.${j(Jw).status}`)), 1)])]),
				default: M(() => [V($, { label: j(J)("debug.dev.url") }, {
					default: M(() => [B("div", XI, [N(B("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						os,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), V(qM, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: j(J)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), j(Jw).error ? (L(), R("span", ZI, k(j(Jw).error), 1)) : U("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			V(dj, {
				title: j(J)("debug.assembly"),
				icon: j(yk),
				collapsible: ""
			}, {
				default: M(() => [n.value ? (L(), R(I, { key: 0 }, [
					B("div", QI, [
						B("span", $I, k(j(J)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (L(), R("span", eL, k(n.value.workflow), 1)) : U("", !0),
						B("span", tL, k(n.value.origin), 1),
						n.value.dryRun ? (L(), R("span", nL, "dry run")) : U("", !0),
						n.value.input ? (L(), R("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, k(j(J)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, rL)) : U("", !0),
						n.value.storyline ? (L(), R("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, k(n.value.storyline.main ? j(J)("storylines.main") : n.value.storyline.name) + k(n.value.storyline.if ? " · if" : "") + k(n.value.storyline.new ? " · new" : "") + k(n.value.storyline.frozen ? " · frozen" : ""), 9, iL)) : U("", !0),
						t[3] ||= B("span", { class: "grow" }, null, -1),
						H(k(u(n.value.at)), 1)
					]),
					r.value ? (L(), R("div", aL, [
						B("span", { class: O(["badge", r.value.reason ? "warn" : "neutral"]) }, k(r.value.reason ? j(J)(`debug.cache.flush.${r.value.reason}`) : j(J)("debug.cache.kept")), 3),
						B("span", oL, k(p(r.value)), 1),
						r.value === n.value.cache ? U("", !0) : (L(), R("span", sL, k(u(r.value.at)), 1))
					])) : U("", !0),
					B("div", null, [(L(!0), R(I, null, F(n.value.regions, (e) => (L(), R("div", {
						key: e.id,
						class: "region"
					}, [B("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						V(j(qO), { class: O(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						B("span", lL, k(e.id), 1),
						B("span", uL, k(e.messages.length) + " · " + k(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + k(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, cL), i.has(e.id) ? (L(), R(I, { key: 0 }, [(L(!0), R(I, null, F(e.messages, (e, t) => (L(), R("div", {
						key: t,
						class: "region-msg"
					}, [B("div", dL, [B("span", fL, k(e.role), 1), H(k(e.chars) + " ch", 1)]), B("div", pL, k(e.content), 1)]))), 128)), e.messages.length ? U("", !0) : (L(), R("div", mL, k(j(J)("debug.emptyRegion")), 1))], 64)) : U("", !0)]))), 128))]),
					n.value.vars?.length ? (L(), R("div", hL, [(L(!0), R(I, null, F(n.value.vars, (e) => (L(), R("div", {
						key: e.id,
						class: "region"
					}, [B("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						V(j(qO), { class: O(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						B("span", _L, k(e.id), 1),
						B("span", vL, k(e.text.length) + " ch", 1)
					], 8, gL), i.has(`var:${e.id}`) ? (L(), R("div", yL, [B("div", bL, k(e.text), 1), e.text ? U("", !0) : (L(), R("div", xL, k(j(J)("debug.emptyRegion")), 1))])) : U("", !0)]))), 128))])) : U("", !0),
					n.value.warnings.length ? (L(), R("div", SL, k(n.value.warnings.join(" · ")), 1)) : U("", !0)
				], 64)) : (L(), R("div", CL, k(j(J)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			V(dj, {
				title: j(J)("debug.requests"),
				icon: j(ak),
				collapsible: ""
			}, {
				default: M(() => [(L(!0), R(I, null, F(j(cg).requests, (e, t) => (L(), R("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [B("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					B("span", TL, k(e.genId) + " · #" + k(e.step), 1),
					e.error ? (L(), R("span", EL, k(j(J)("debug.error")), 1)) : U("", !0),
					B("span", DL, k(f(e.usage)), 1),
					B("span", OL, k(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, wL), s.value === t ? (L(), R(I, { key: 0 }, [
					B("div", kL, [B("span", AL, k(j(J)("debug.request")), 1), V(Q, {
						icon: j(ck),
						label: j(J)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					B("pre", jL, k(c(e.request)), 1),
					B("div", ML, [B("span", NL, k(j(J)("debug.response")), 1), V(Q, {
						icon: j(ck),
						label: j(J)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					B("pre", PL, k(e.error ?? c(e.response ?? "")), 1)
				], 64)) : U("", !0)]))), 128)), j(cg).requests.length ? U("", !0) : (L(), R("div", FL, k(j(J)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			V(dj, {
				title: j(J)("debug.log"),
				icon: j(eA),
				collapsible: "",
				open: !1
			}, {
				actions: M(() => [V(Q, {
					icon: j(fA),
					label: j(J)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => j(cg).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: M(() => [(L(!0), R(I, null, F(g.value, (e, n) => (L(), R("div", {
					key: n,
					class: "req"
				}, [B("div", IL, [
					B("span", LL, k(e.kind), 1),
					t[4] ||= B("span", { class: "grow" }, null, -1),
					B("span", RL, k(u(e.at)), 1)
				]), B("pre", zL, k(c(e.data)), 1)]))), 128)), g.value.length ? U("", !0) : (L(), R("div", BL, k(j(J)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			b.value ? (L(), z(dj, {
				key: 0,
				title: j(J)("debug.images"),
				icon: j(Tk),
				help: j(J)("debug.images.hint"),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [B("div", VL, [B("button", {
					type: "button",
					class: "btn",
					disabled: x.value.running,
					onClick: S
				}, [V(j(fA)), H(k(j(J)("debug.images.clean")), 1)], 8, HL), x.value.running ? (L(), R("span", UL, k(x.value.progress ? j(J)("debug.images.scanning", {
					done: x.value.progress.done,
					total: x.value.progress.total
				}) : "…"), 1)) : x.value.result ? (L(), R("span", WL, k(x.value.result), 1)) : x.value.error ? (L(), R("span", GL, k(x.value.error), 1)) : U("", !0)])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : U("", !0),
			V(dj, {
				title: j(J)("debug.annotations"),
				icon: j(Ik),
				help: j(J)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: M(() => [(L(!0), R(I, null, F(_.value, (e, t) => (L(), R("div", {
					key: t,
					class: "req"
				}, [B("div", KL, [
					B("span", qL, "#" + k(e.mesId), 1),
					e.speech ? (L(), R("span", JL, k(j(J)("debug.orphanSpeech")), 1)) : U("", !0),
					B("span", YL, "“" + k(e.quote) + "”", 1)
				]), B("div", XL, k(e.comment), 1)]))), 128)), _.value.length ? U("", !0) : (L(), R("div", ZL, k(j(J)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			B("div", QL, "Advanced Preset " + k(j("1.12.0")) + " · " + k(j("73579b709846aa0a")), 1)
		], 64));
	}
}), eR = {
	key: 1,
	class: "empty"
}, tR = { class: "row storylines-head" }, nR = { class: "xs muted grow" }, rR = ["aria-expanded", "onClick"], iR = { class: "card-title grow ellipsis" }, aR = ["title", "aria-label"], oR = {
	key: 1,
	class: "badge warn"
}, sR = { class: "xs faint" }, cR = {
	key: 0,
	class: "card-body col"
}, lR = ["aria-label"], uR = {
	key: 1,
	class: "faint small"
}, dR = {
	key: 2,
	class: "storyline-floors"
}, fR = ["title", "onClick"], pR = { class: "badge neutral mono" }, mR = { class: "xs muted" }, hR = { class: "grow ellipsis" }, gR = /* @__PURE__ */ P({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n } = bN(), r = W(() => (Y.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), i = W(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), a = W(() => r.value && n.value?.storylines ? $D(i.value) : []), o = /* @__PURE__ */ A(/* @__PURE__ */ new Set()), s = (e) => {
			let t = new Set(o.value);
			t.has(e) ? t.delete(e) : t.add(e), o.value = t;
		};
		_r(() => Y.storylineFocus, (e) => {
			e !== null && (o.value = /* @__PURE__ */ new Set([...o.value, e]), Y.storylineFocus = null);
		}, { immediate: !0 });
		let c = (e) => e.main ? e.name ? J("storylines.mainNamed", { name: e.name }) : J("storylines.main") : e.name || J("storylines.unnamed"), l = () => {
			JS(), hO();
		};
		async function u(e) {
			await I_(e.key, !e.if), l();
		}
		async function d(e) {
			await z_(e.key, !e.hidden), l();
		}
		async function f(e) {
			await zb(e.key) && l();
		}
		async function p(e) {
			let t = await b(`<h3>${v(e.main && !e.name ? J("storylines.nameMain") : J("storylines.renameTitle", { name: c(e) }))}</h3>${e.main ? `<p>${v(J("storylines.nameMain.hint"))}</p>` : ""}`, e.name, J("common.save"), J("common.cancel"));
			if (t === null) return;
			let n = t.trim();
			if (!Zu(n)) return x("warning", J("storylines.invalidName"), J("app.name"));
			let r = await R_(e.key, n);
			if (r === "taken") return x("warning", J("storylines.nameTaken", { name: n }), J("app.name"));
			if (r === "invalid") return x("warning", J("storylines.invalidName"), J("app.name"));
			r !== "unchanged" && (!e.main && o.value.has(e.key) && (o.value = new Set([...o.value].map((t) => t === e.key ? n : t))), l());
		}
		return (e, t) => j(n) ? r.value ? (L(), R(I, { key: 2 }, [B("div", tR, [B("span", nR, k(j(J)("storylines.count", { n: a.value.length })), 1), V(cj, {
			text: j(J)("storylines.help"),
			align: "end"
		}, null, 8, ["text"])]), (L(!0), R(I, null, F(a.value, (e) => (L(), R("section", {
			key: e.key,
			class: O(["card storyline-card", {
				current: e.current,
				hidden: e.hidden
			}])
		}, [B("header", {
			class: "card-head clickable",
			"aria-expanded": o.value.has(e.key),
			onClick: (t) => s(e.key)
		}, [
			(L(), z(ei(e.main ? j(lk) : e.if ? j(cA) : j(xk)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			B("span", iR, k(c(e)), 1),
			e.current ? (L(), R("span", {
				key: 0,
				class: "storyline-dot",
				title: j(J)("storylines.current"),
				"aria-label": j(J)("storylines.current")
			}, null, 8, aR)) : U("", !0),
			e.if ? (L(), R("span", oR, "if")) : U("", !0),
			e.hidden ? (L(), z(j(pk), {
				key: 2,
				class: "storyline-flag",
				"aria-label": j(J)("storylines.hidden")
			}, null, 8, ["aria-label"])) : U("", !0),
			B("span", sR, k(j(J)("storylines.floors", { n: e.floors.length })), 1),
			V(j(GO), {
				class: O(["chevron", { flipped: o.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, rR), o.value.has(e.key) ? (L(), R("div", cR, [e.pending ? U("", !0) : (L(), R("div", {
			key: 0,
			class: O(["storyline-toolbar", { solo: e.main }]),
			role: "toolbar",
			"aria-label": c(e)
		}, [
			e.main ? U("", !0) : (L(), R(I, { key: 0 }, [
				V(Q, {
					icon: j(cA),
					label: j(J)("storylines.ifLine.toggle"),
					pressed: e.if,
					small: "",
					onClick: (t) => u(e)
				}, null, 8, [
					"icon",
					"label",
					"pressed",
					"onClick"
				]),
				V(Q, {
					icon: e.hidden ? j(pk) : j(mk),
					label: j(J)("storylines.visible.toggle"),
					pressed: !e.hidden,
					small: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"pressed",
					"onClick"
				]),
				t[0] ||= B("span", {
					class: "storyline-toolbar-sep",
					"aria-hidden": "true"
				}, null, -1)
			], 64)),
			V(Q, {
				icon: j(Wk),
				label: e.main && !e.name ? j(J)("storylines.nameMain") : j(J)("common.rename"),
				small: "",
				onClick: (t) => p(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]),
			e.main ? U("", !0) : (L(), z(Q, {
				key: 1,
				icon: j(lk),
				label: j(J)("storylines.makeMain"),
				small: "",
				onClick: (t) => f(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]))
		], 10, lR)), e.floors.length ? (L(), R("ul", dR, [(L(!0), R(I, null, F(e.floors, (e) => (L(), R("li", {
			key: e.index,
			class: "row tight small clickable",
			title: j(J)("storylines.jump"),
			onClick: (t) => j(eO)(e.index)
		}, [
			B("span", pR, "#" + k(e.index), 1),
			B("span", mR, k(e.user ? j(J)("storylines.user") : j(J)("storylines.narrator")), 1),
			B("span", hR, k(e.title || "…"), 1)
		], 8, fR))), 128))])) : (L(), R("div", uR, k(j(J)("storylines.empty")), 1))])) : U("", !0)], 2))), 128))], 64)) : (L(), R("div", eR, [V(j(xk), { "aria-hidden": "true" }), B("span", null, k(j(J)("memory.noChat")), 1)])) : (L(), z(SN, { key: 0 }));
	}
});
//#endregion
//#region src/media/image/refs.ts
function _R(e) {
	let t = new Set(e.map((e) => e.id)), n = 1;
	for (; t.has(`ref${n}`);) n++;
	return `ref${n}`;
}
async function vR() {
	await wx("ref:", new Set(_S().image.connections.flatMap((e) => e.refs.map((e) => e.blob)))).catch((e) => console.warn("[AP] media gc failed", e));
}
//#endregion
//#region src/ui/panel/media/ConnectionBar.vue?vue&type=script&setup=true&lang.ts
var yR = {
	key: 0,
	class: "row tight"
}, bR = ["aria-label"], xR = {
	key: 1,
	class: "row tight"
}, SR = ["value", "aria-label"], CR = ["value"], wR = {
	key: 1,
	class: "grow faint small"
}, TR = /* @__PURE__ */ P({
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
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A("");
		function o() {
			n.active && (a.value = n.active.name, i.value = !0);
		}
		function s() {
			let e = a.value.trim();
			e && n.active && r("rename", n.active, e), i.value = !1;
		}
		return (t, n) => i.value ? (L(), R("div", yR, [
			N(B("input", {
				"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
				class: "input grow",
				"aria-label": j(J)("common.rename"),
				onKeydown: [vs(s, ["enter"]), n[1] ||= vs((e) => i.value = !1, ["esc"])]
			}, null, 40, bR), [[os, a.value]]),
			V(Q, {
				icon: j(xA),
				label: j(J)("common.cancel"),
				onClick: n[2] ||= (e) => i.value = !1
			}, null, 8, ["icon", "label"]),
			V(Q, {
				icon: j(WO),
				label: j(J)("common.save"),
				active: "",
				onClick: s
			}, null, 8, ["icon", "label"])
		])) : (L(), R("div", xR, [
			e.connections.length ? (L(), R("select", {
				key: 0,
				class: "input grow",
				value: e.active?.id,
				"aria-label": j(J)("media.connection"),
				onChange: n[3] ||= (e) => r("select", e.target.value)
			}, [(L(!0), R(I, null, F(e.connections, (t) => (L(), R("option", {
				key: t.id,
				value: t.id
			}, k(t.name) + " · " + k(e.apiLabel(t.api)), 9, CR))), 128))], 40, SR)) : (L(), R("span", wR, k(j(J)("media.noConnection")), 1)),
			V(Q, {
				icon: j(qk),
				label: j(J)("media.addConnection"),
				onClick: n[4] ||= (e) => r("add")
			}, null, 8, ["icon", "label"]),
			e.active ? (L(), R(I, { key: 2 }, [
				V(Q, {
					icon: j(ck),
					label: j(J)("common.copy"),
					onClick: n[5] ||= (t) => r("copy", e.active)
				}, null, 8, ["icon", "label"]),
				V(Q, {
					icon: j(Gk),
					label: j(J)("common.rename"),
					onClick: o
				}, null, 8, ["icon", "label"]),
				V(Q, {
					icon: j(fA),
					label: j(J)("common.delete"),
					danger: "",
					align: "end",
					onClick: n[6] ||= (t) => r("remove", e.active)
				}, null, 8, ["icon", "label"])
			], 64)) : U("", !0)
		]));
	}
}), ER = { class: "media-advanced" }, DR = ["aria-expanded"], OR = {
	key: 0,
	class: "col"
}, kR = ["placeholder"], AR = {
	key: 0,
	class: "xs text-danger"
}, jR = /* @__PURE__ */ P({
	__name: "AdvancedRequest",
	props: {
		connection: {},
		bodyPlaceholder: {}
	},
	emits: ["changed"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(n.connection.body);
		_r(() => n.connection.id, () => {
			a.value = n.connection.body;
		});
		let o = W(() => dx(a.value));
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
		return (t, n) => (L(), R("div", ER, [B("button", {
			type: "button",
			class: "btn ghost sm-btn media-advanced-toggle",
			"aria-expanded": i.value,
			onClick: n[0] ||= (e) => i.value = !i.value
		}, [B("span", null, k(j(J)("media.advanced")), 1), V(j(GO), { class: O(["chevron", { flipped: i.value }]) }, null, 8, ["class"])], 8, DR), i.value ? (L(), R("div", OR, [
			ii(t.$slots, "default"),
			V($, {
				label: j(J)("media.headers"),
				help: j(J)("media.headers.hint")
			}, {
				default: M(() => [V(II, {
					entries: e.connection.headers,
					"key-placeholder": j(J)("media.headers.name"),
					"value-placeholder": j(J)("media.headers.value"),
					onSet: s,
					onRemove: c
				}, null, 8, [
					"entries",
					"key-placeholder",
					"value-placeholder"
				])]),
				_: 1
			}, 8, ["label", "help"]),
			V($, {
				label: j(J)("media.body"),
				help: j(J)("media.body.hint")
			}, {
				default: M(() => [N(B("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
					class: "input mono",
					rows: "4",
					spellcheck: "false",
					placeholder: e.bodyPlaceholder ?? "{ }",
					onChange: l
				}, null, 40, kR), [[os, a.value]]), o.value ? (L(), R("span", AR, k(o.value), 1)) : U("", !0)]),
				_: 1
			}, 8, ["label", "help"])
		])) : U("", !0)]));
	}
}), MR = ["value", "placeholder"], NR = ["value"], PR = [
	"list",
	"value",
	"placeholder"
], FR = ["id"], IR = ["value"], LR = ["value", "placeholder"], RR = ["value", "placeholder"], zR = { class: "col media-refs" }, BR = { class: "badge neutral mono" }, VR = [
	"value",
	"placeholder",
	"onChange"
], HR = ["value"], UR = /* @__PURE__ */ P({
	__name: "ImageSettings",
	setup(e) {
		let t = W(() => _S().image), n = W(() => wS(t.value)), r = {
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
		}, i = (e) => J(`media.api.${e}`), a = pc.map((e) => ({
			value: e,
			label: i(e)
		})), o = (e, n) => {
			t.value[e] = n, vS();
		};
		function s(e, t) {
			let r = n.value;
			r && (r[e] = t, vS());
		}
		function c() {
			let e = bS("openai", J("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, vS();
		}
		function l(e) {
			let n = TS(e, J("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, vS();
		}
		function u(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), vS(), vR();
		}
		let d = (e) => {
			t.value.active = e, vS();
		}, f = (e, t) => {
			e.name = t, vS();
		}, p = (e) => {
			n.value && (xS(n.value, e), vS());
		}, m = /* @__PURE__ */ A(null);
		async function h(e) {
			let t = n.value, r = [...e.target.files ?? []];
			if (e.target.value = "", t) {
				for (let e of r) {
					if (!e.type.startsWith("image/")) continue;
					let n = await yx(e, { prefix: "ref:" });
					t.refs.push({
						id: _R(t.refs),
						description: e.name.replace(/\.[^.]+$/, ""),
						blob: n
					});
				}
				vS();
			}
		}
		function g(e) {
			let r = n.value;
			if (!r) return;
			let [i] = r.refs.splice(e, 1);
			vS(), i && !t.value.connections.some((e) => e.refs.some((e) => e.blob === i.blob)) && Sx(i.blob);
		}
		return (e, _) => (L(), z(dj, {
			title: j(J)("media.image"),
			icon: j(Ok)
		}, {
			actions: M(() => [V(qM, {
				"model-value": t.value.enabled,
				label: j(J)("media.image"),
				"onUpdate:modelValue": _[0] ||= (e) => o("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: M(() => [t.value.enabled ? (L(), R(I, { key: 0 }, [
				V($, {
					label: j(J)("media.auto"),
					help: j(J)("media.image.auto.hint"),
					inline: ""
				}, {
					default: M(() => [V(qM, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": _[1] ||= (e) => o("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				V(TR, {
					connections: t.value.connections,
					active: n.value,
					"api-label": i,
					onSelect: d,
					onAdd: c,
					onCopy: l,
					onRemove: u,
					onRename: f
				}, null, 8, ["connections", "active"]),
				n.value ? (L(), R("div", {
					key: n.value.id,
					class: "col media-conn"
				}, [
					V(TN, {
						"model-value": n.value.api,
						options: j(a),
						"onUpdate:modelValue": _[2] ||= (e) => p(e)
					}, null, 8, ["model-value", "options"]),
					V($, { label: j(J)("media.baseUrl") }, {
						default: M(() => [B("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: j(mS)[n.value.api].baseUrl,
							spellcheck: "false",
							onChange: _[3] ||= (e) => s("baseUrl", e.target.value.trim())
						}, null, 40, MR)]),
						_: 1
					}, 8, ["label"]),
					V($, { label: j(J)("media.apiKey") }, {
						default: M(() => [B("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: _[4] ||= (e) => s("apiKey", e.target.value.trim())
						}, null, 40, NR)]),
						_: 1
					}, 8, ["label"]),
					V($, { label: j(J)("media.model") }, {
						default: M(() => [B("input", {
							class: "input",
							list: `ap-image-models-${n.value.api}`,
							value: n.value.model,
							placeholder: j(mS)[n.value.api].model,
							spellcheck: "false",
							onChange: _[5] ||= (e) => s("model", e.target.value.trim())
						}, null, 40, PR), B("datalist", { id: `ap-image-models-${n.value.api}` }, [(L(!0), R(I, null, F(r[n.value.api], (e) => (L(), R("option", {
							key: e,
							value: e
						}, null, 8, IR))), 128))], 8, FR)]),
						_: 1
					}, 8, ["label"]),
					V($, {
						label: j(J)("media.image.style"),
						help: j(J)("media.image.style.hint")
					}, {
						default: M(() => [B("textarea", {
							class: "input",
							rows: "2",
							value: n.value.style,
							placeholder: j(J)(n.value.api === "novelai" ? "media.image.style.tags" : "media.image.style.nl"),
							onChange: _[6] ||= (e) => s("style", e.target.value)
						}, null, 40, LR)]),
						_: 1
					}, 8, ["label", "help"]),
					n.value.api === "novelai" ? (L(), z($, {
						key: 0,
						label: j(J)("media.image.negative")
					}, {
						default: M(() => [B("textarea", {
							class: "input",
							rows: "2",
							value: n.value.negative ?? "",
							placeholder: j(J)("media.image.negative.placeholder"),
							onChange: _[7] ||= (e) => s("negative", e.target.value)
						}, null, 40, RR)]),
						_: 1
					}, 8, ["label"])) : U("", !0),
					V($, {
						label: j(J)("media.image.nsfwBlock"),
						help: j(J)("media.image.nsfwBlock.hint"),
						inline: ""
					}, {
						default: M(() => [V(qM, {
							"model-value": n.value.nsfwBlock,
							"onUpdate:modelValue": _[8] ||= (e) => s("nsfwBlock", e)
						}, null, 8, ["model-value"])]),
						_: 1
					}, 8, ["label", "help"]),
					j(hS)(n.value.api) ? (L(), z($, {
						key: 1,
						label: j(J)("media.image.refs"),
						help: j(J)("media.image.refs.hint")
					}, {
						default: M(() => [B("div", zR, [
							(L(!0), R(I, null, F(n.value.refs, (e, t) => (L(), R("div", {
								key: e.blob,
								class: "media-ref"
							}, [
								V(fM, {
									"blob-key": e.blob,
									class: "media-ref-thumb",
									alt: e.description
								}, null, 8, ["blob-key", "alt"]),
								B("span", BR, k(e.id), 1),
								B("input", {
									class: "input grow",
									value: e.description,
									placeholder: j(J)("media.image.refs.description"),
									onChange: (t) => {
										e.description = t.target.value, j(vS)();
									}
								}, null, 40, VR),
								V(Q, {
									icon: j(fA),
									label: j(J)("common.delete"),
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
							B("button", {
								type: "button",
								class: "btn ghost add",
								onClick: _[9] ||= (e) => m.value?.click()
							}, [V(j(Dk)), H(k(j(J)("media.image.refs.add")), 1)]),
							B("input", {
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
					}, 8, ["label", "help"])) : U("", !0),
					V(jR, {
						connection: n.value,
						onChanged: _[11] ||= (e) => j(vS)()
					}, {
						default: M(() => [n.value.api === "gemini" ? (L(), z($, {
							key: 0,
							label: j(J)("media.image.geminiEndpoint")
						}, {
							default: M(() => [B("select", {
								class: "input",
								value: n.value.endpoint ?? "interactions",
								onChange: _[10] ||= (e) => s("endpoint", e.target.value)
							}, [..._[12] ||= [B("option", { value: "interactions" }, "Interactions", -1), B("option", { value: "generateContent" }, "generateContent", -1)]], 40, HR)]),
							_: 1
						}, 8, ["label"])) : U("", !0)]),
						_: 1
					}, 8, ["connection"])
				])) : U("", !0)
			], 64)) : U("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), WR = { class: "col tight" }, GR = { class: "speech-voice" }, KR = ["title"], qR = { class: "ellipsis" }, JR = [
	"list",
	"value",
	"placeholder",
	"aria-label"
], YR = ["id"], XR = ["value"], ZR = ["value", "placeholder"], QR = {
	key: 1,
	class: "speech-voice"
}, $R = {
	key: 1,
	class: "col tight"
}, ez = ["placeholder", "onKeydown"], tz = {
	key: 0,
	class: "xs text-danger"
}, nz = {
	key: 1,
	class: "row tight faint small"
}, rz = {
	key: 2,
	class: "speech-results"
}, iz = {
	key: 0,
	class: "faint small speech-result"
}, az = ["onClick"], oz = { class: "col grow" }, sz = { class: "ellipsis" }, cz = {
	key: 0,
	class: "xs faint ellipsis"
}, lz = /* @__PURE__ */ P({
	__name: "VoicePicker",
	props: {
		connection: {},
		modelValue: {},
		placeholder: {},
		label: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = W(() => dS(n.connection.api)), a = W(() => n.modelValue), o = W(() => `ap-voices-${n.connection.api}`), s = W(() => a.value?.kind === "voice" ? a.value.name || i.value?.voices.find((e) => e.id === a.value.id)?.name || a.value.id : "");
		function c(e) {
			let t = e.trim();
			if (!t) return r("update:modelValue", null);
			let n = i.value?.voices.find((e) => e.id === t || e.name.toLowerCase() === t.toLowerCase());
			(a.value?.kind !== "voice" || t !== s.value) && r("update:modelValue", {
				kind: "voice",
				id: n?.id ?? t
			});
		}
		let l = /* @__PURE__ */ A(!1), u = /* @__PURE__ */ A(""), d = /* @__PURE__ */ A(!1), f = /* @__PURE__ */ A(null), p = /* @__PURE__ */ A(""), m = null;
		async function h() {
			let e = i.value;
			if (e?.search) {
				m?.abort(), m = new AbortController(), d.value = !0, p.value = "";
				try {
					f.value = await e.search(aw, n.connection, u.value, m.signal);
				} catch (e) {
					e instanceof DOMException && e.name === "AbortError" || (p.value = zC(e));
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
					t = await a.adopt(aw, n.connection, e);
				} catch (e) {
					p.value = zC(e);
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
		let b = /* @__PURE__ */ A(null), x = /* @__PURE__ */ A(null);
		async function S(e, t) {
			let n = e.target, i = n.files?.[0];
			if (n.value = "", !i) return;
			let o = await yx(i, { prefix: "voice:" }), s = a.value?.kind === "clone" ? a.value : null;
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
		function te() {
			r("update:modelValue", null), Ew();
		}
		return (t, n) => (L(), R("div", WR, [
			B("div", GR, [
				a.value?.kind === "clone" ? (L(), R(I, { key: 0 }, [B("span", {
					class: "chip grow",
					title: a.value.audio
				}, [V(j(_k), { class: "faint" }), B("span", qR, k(a.value.name || j(J)("media.speech.clone")), 1)], 8, KR), V(Q, {
					icon: j(xA),
					label: j(J)("common.delete"),
					small: "",
					onClick: te
				}, null, 8, ["icon", "label"])], 64)) : (L(), R(I, { key: 1 }, [
					B("input", {
						class: "input",
						list: o.value,
						value: s.value,
						placeholder: e.placeholder ?? (i.value?.voices[0]?.name || j(J)("media.speech.voiceId")),
						"aria-label": e.label,
						spellcheck: "false",
						onChange: n[0] ||= (e) => c(e.target.value)
					}, null, 40, JR),
					B("datalist", { id: o.value }, [(L(!0), R(I, null, F(i.value?.voices ?? [], (e) => (L(), R("option", {
						key: e.id,
						value: e.id
					}, k(e.name), 9, XR))), 128))], 8, YR),
					i.value?.search ? (L(), z(Q, {
						key: 0,
						icon: j(tA),
						label: j(J)("media.speech.search"),
						small: "",
						pressed: l.value,
						onClick: g
					}, null, 8, [
						"icon",
						"label",
						"pressed"
					])) : U("", !0)
				], 64)),
				i.value?.clone && a.value?.kind !== "clone" ? (L(), z(Q, {
					key: 2,
					icon: j(LO),
					label: j(J)("media.speech.clone"),
					small: "",
					onClick: n[1] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : U("", !0),
				V(Q, {
					icon: j(_A),
					label: j(J)("media.speech.test"),
					small: "",
					align: "end",
					onClick: n[2] ||= (t) => j(Tw)(e.connection, e.modelValue)
				}, null, 8, ["icon", "label"]),
				B("input", {
					ref_key: "audioInput",
					ref: b,
					type: "file",
					accept: "audio/*",
					hidden: "",
					onChange: n[3] ||= (e) => S(e, "audio")
				}, null, 544)
			]),
			a.value?.kind === "clone" ? (L(), R(I, { key: 0 }, [i.value?.clone?.text === "none" ? U("", !0) : (L(), R("input", {
				key: 0,
				class: "input",
				value: a.value.text ?? "",
				placeholder: j(J)("media.speech.clone.text"),
				onChange: n[4] ||= (e) => ee(e.target.value)
			}, null, 40, ZR)), i.value?.clone?.consent ? (L(), R("div", QR, [B("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: n[5] ||= (e) => x.value?.click()
			}, [V(j(_k)), H(k(a.value.consent ? j(J)("media.speech.clone.consentSet") : j(J)("media.speech.clone.consent")), 1)]), B("input", {
				ref_key: "consentInput",
				ref: x,
				type: "file",
				accept: "audio/*",
				hidden: "",
				onChange: n[6] ||= (e) => S(e, "consent")
			}, null, 544)])) : U("", !0)], 64)) : U("", !0),
			l.value ? (L(), R("div", $R, [
				N(B("input", {
					"onUpdate:modelValue": n[7] ||= (e) => u.value = e,
					class: "input",
					placeholder: j(J)("media.speech.search.placeholder"),
					onKeydown: vs(gs(h, ["prevent"]), ["enter"])
				}, null, 40, ez), [[os, u.value]]),
				p.value ? (L(), R("span", tz, k(p.value), 1)) : U("", !0),
				d.value && !f.value ? (L(), R("div", nz, [V(j(Nk), { class: "spin" })])) : f.value ? (L(), R("div", rz, [f.value.length ? U("", !0) : (L(), R("span", iz, k(j(J)("media.speech.search.none")), 1)), (L(!0), R(I, null, F(f.value, (e) => (L(), R("div", {
					key: e.id,
					class: "speech-result"
				}, [B("button", {
					type: "button",
					class: "speech-result grow",
					onClick: (t) => _(e)
				}, [B("span", oz, [B("span", sz, k(e.name), 1), e.description ? (L(), R("span", cz, k(e.description), 1)) : U("", !0)])], 8, az), e.preview ? (L(), z(Q, {
					key: 0,
					icon: j(_A),
					label: j(J)("media.speech.test"),
					small: "",
					align: "end",
					onClick: (t) => y(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : U("", !0)]))), 128))])) : U("", !0)
			])) : U("", !0)
		]));
	}
}), uz = ["value"], dz = ["value"], fz = ["value", "placeholder"], pz = ["value"], mz = [
	"list",
	"value",
	"placeholder"
], hz = ["id"], gz = ["value"], _z = { class: "col" }, vz = [
	"value",
	"placeholder",
	"onChange"
], yz = /* @__PURE__ */ P({
	__name: "SpeechSettings",
	setup(e) {
		let t = W(() => _S().speech), n = W(() => wS(t.value)), r = W(() => n.value ? dS(n.value.api) : void 0), i = (e) => J(`media.api.${e}`), a = (e, n) => {
			t.value[e] = n, vS();
		};
		function o(e, t) {
			let r = n.value;
			r && (r[e] = t, vS());
		}
		function s() {
			let e = SS("fish", J("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, vS();
		}
		function c(e) {
			let n = TS(e, J("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, vS();
		}
		function l(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), vS(), Ew();
		}
		let u = (e) => {
			t.value.active = e, vS();
		}, d = (e, t) => {
			e.name = t, vS();
		}, f = (e) => {
			n.value && (CS(n.value, e), vS(), Ew());
		};
		function p() {
			n.value?.bindings.push({
				character: "",
				voice: null
			}), vS();
		}
		function m(e, t) {
			let r = n.value?.bindings[e];
			r && (Object.assign(r, t), vS());
		}
		function h(e) {
			n.value?.bindings.splice(e, 1), vS(), Ew();
		}
		return (e, g) => (L(), z(dj, {
			title: j(J)("media.speech"),
			icon: j(LO)
		}, {
			actions: M(() => [V(qM, {
				"model-value": t.value.enabled,
				label: j(J)("media.speech"),
				"onUpdate:modelValue": g[0] ||= (e) => a("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: M(() => [t.value.enabled ? (L(), R(I, { key: 0 }, [
				V($, {
					label: j(J)("media.auto"),
					help: j(J)("media.speech.auto.hint"),
					inline: ""
				}, {
					default: M(() => [V(qM, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": g[1] ||= (e) => a("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				V($, {
					label: j(J)("media.speech.narrator"),
					help: j(J)("media.speech.narrator.hint"),
					inline: ""
				}, {
					default: M(() => [V(qM, {
						"model-value": t.value.narrator,
						"onUpdate:modelValue": g[2] ||= (e) => a("narrator", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				V(TR, {
					connections: t.value.connections,
					active: n.value,
					"api-label": i,
					onSelect: u,
					onAdd: s,
					onCopy: c,
					onRemove: l,
					onRename: d
				}, null, 8, ["connections", "active"]),
				n.value ? (L(), R("div", {
					key: n.value.id,
					class: "col media-conn"
				}, [
					V($, { label: j(J)("media.speech.api") }, {
						default: M(() => [B("select", {
							class: "input",
							value: n.value.api,
							onChange: g[3] ||= (e) => f(e.target.value)
						}, [(L(!0), R(I, null, F(j(mc), (e) => (L(), R("option", {
							key: e,
							value: e
						}, k(i(e)), 9, dz))), 128))], 40, uz)]),
						_: 1
					}, 8, ["label"]),
					V($, { label: j(J)("media.baseUrl") }, {
						default: M(() => [B("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: r.value?.defaults.baseUrl,
							spellcheck: "false",
							onChange: g[4] ||= (e) => o("baseUrl", e.target.value.trim())
						}, null, 40, fz)]),
						_: 1
					}, 8, ["label"]),
					V($, { label: j(J)("media.apiKey") }, {
						default: M(() => [B("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: g[5] ||= (e) => o("apiKey", e.target.value.trim())
						}, null, 40, pz)]),
						_: 1
					}, 8, ["label"]),
					V($, { label: j(J)("media.model") }, {
						default: M(() => [B("input", {
							class: "input",
							list: `ap-speech-models-${n.value.api}`,
							value: n.value.model,
							placeholder: r.value?.defaults.model,
							spellcheck: "false",
							onChange: g[6] ||= (e) => o("model", e.target.value.trim())
						}, null, 40, mz), B("datalist", { id: `ap-speech-models-${n.value.api}` }, [(L(!0), R(I, null, F(r.value?.models ?? [], (e) => (L(), R("option", {
							key: e,
							value: e
						}, null, 8, gz))), 128))], 8, hz)]),
						_: 1
					}, 8, ["label"]),
					V($, {
						label: j(J)("media.speech.voice"),
						help: j(J)("media.speech.voice.hint")
					}, {
						default: M(() => [V(lz, {
							connection: n.value,
							"model-value": n.value.voice,
							label: j(J)("media.speech.voice"),
							"onUpdate:modelValue": g[7] ||= (e) => o("voice", e)
						}, null, 8, [
							"connection",
							"model-value",
							"label"
						])]),
						_: 1
					}, 8, ["label", "help"]),
					t.value.narrator ? (L(), z($, {
						key: 0,
						label: j(J)("media.speech.narratorVoice")
					}, {
						default: M(() => [V(lz, {
							connection: n.value,
							"model-value": n.value.narrator,
							label: j(J)("media.speech.narratorVoice"),
							placeholder: j(J)("media.speech.sameAsDefault"),
							"onUpdate:modelValue": g[8] ||= (e) => o("narrator", e)
						}, null, 8, [
							"connection",
							"model-value",
							"label",
							"placeholder"
						])]),
						_: 1
					}, 8, ["label"])) : U("", !0),
					V($, {
						label: j(J)("media.speech.bindings"),
						help: j(J)("media.speech.bindings.hint")
					}, {
						default: M(() => [B("div", _z, [(L(!0), R(I, null, F(n.value.bindings, (e, t) => (L(), R("div", {
							key: t,
							class: "speech-binding"
						}, [
							B("input", {
								class: "input",
								value: e.character,
								placeholder: j(J)("media.speech.character"),
								onChange: (e) => m(t, { character: e.target.value.trim() })
							}, null, 40, vz),
							V(lz, {
								class: "grow",
								connection: n.value,
								"model-value": e.voice,
								label: e.character || j(J)("media.speech.character"),
								"onUpdate:modelValue": (e) => m(t, { voice: e })
							}, null, 8, [
								"connection",
								"model-value",
								"label",
								"onUpdate:modelValue"
							]),
							V(Q, {
								icon: j(fA),
								label: j(J)("common.delete"),
								small: "",
								danger: "",
								align: "end",
								onClick: (e) => h(t)
							}, null, 8, [
								"icon",
								"label",
								"onClick"
							])
						]))), 128)), B("button", {
							type: "button",
							class: "btn ghost add",
							onClick: p
						}, [V(j(qk)), H(k(j(J)("media.speech.addBinding")), 1)])])]),
						_: 1
					}, 8, ["label", "help"]),
					V(jR, {
						connection: n.value,
						onChanged: g[9] ||= (e) => j(vS)()
					}, null, 8, ["connection"])
				])) : U("", !0)
			], 64)) : U("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), bz = ["value"], xz = /* @__PURE__ */ P({
	__name: "MediaTab",
	setup(e) {
		let { preset: n } = bN(), r = W(() => _S().cors), i = [
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
			r.value[e] = t, vS();
		}
		return (e, t) => j(n) ? (L(), R(I, { key: 1 }, [
			V(dj, {
				title: j(J)("media.cors"),
				icon: j(zk),
				collapsible: "",
				open: r.value.mode !== "auto" || r.value.proxy !== "host"
			}, {
				default: M(() => [V(TN, {
					"model-value": r.value.mode,
					options: j(i),
					"onUpdate:modelValue": t[0] ||= (e) => o("mode", e)
				}, null, 8, ["model-value", "options"]), r.value.mode === "off" ? U("", !0) : (L(), R(I, { key: 0 }, [V($, { label: j(J)("media.proxy") }, {
					default: M(() => [V(TN, {
						"model-value": r.value.proxy,
						options: a.value,
						"onUpdate:modelValue": t[1] ||= (e) => o("proxy", e)
					}, null, 8, ["model-value", "options"])]),
					_: 1
				}, 8, ["label"]), r.value.proxy === "custom" ? (L(), z($, {
					key: 0,
					label: j(J)("media.proxy.url")
				}, {
					default: M(() => [B("input", {
						class: "input mono",
						value: r.value.customUrl,
						placeholder: "https://proxy.example/?url={url}",
						spellcheck: "false",
						onChange: t[2] ||= (e) => o("customUrl", e.target.value.trim())
					}, null, 40, bz)]),
					_: 1
				}, 8, ["label"])) : U("", !0)], 64))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"open"
			]),
			j(IC)(j(n)) ? (L(), z(UR, { key: 0 })) : U("", !0),
			j(LC)(j(n)) ? (L(), z(yz, { key: 1 })) : U("", !0)
		], 64)) : (L(), z(SN, { key: 0 }));
	}
}), Sz = ["aria-label"], Cz = { class: "panel-head" }, wz = { class: "panel-logo" }, Tz = { class: "grow" }, Ez = { class: "panel-title ellipsis" }, Dz = { class: "panel-sub ellipsis" }, Oz = [
	"title",
	"aria-selected",
	"onClick"
], kz = { class: "panel-body scroll" }, Az = /* @__PURE__ */ P({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Vk,
				view: vN
			},
			{
				id: "config",
				icon: iA,
				view: iP
			},
			{
				id: "modules",
				icon: zO,
				view: fI
			},
			{
				id: "writing",
				icon: Wk,
				view: xI
			},
			{
				id: "memory",
				icon: BO,
				view: VI
			},
			{
				id: "storylines",
				icon: xk,
				view: gR
			},
			{
				id: "media",
				icon: ZO,
				view: xz
			},
			{
				id: "debug",
				icon: VO,
				view: $L
			}
		], n = W(() => t.filter((e) => (e.id !== "storylines" || qD.value) && (e.id !== "media" || RC(XS.value)))), r = W(() => n.value.find((e) => e.id === Y.tab) ?? n.value[0]), i = W({
			get: () => G().enabled,
			set: (e) => {
				G().enabled = e, K();
			}
		}), a = W(() => {
			let e = XS.value;
			return e ? `v${e.version} · ${ZS.value.config}` : J("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && Y.panelOpen && (Y.panelOpen = !1);
		};
		return Yr(() => document.addEventListener("keydown", o)), Zr(() => {
			document.removeEventListener("keydown", o), wO(!1);
		}), _r(() => Y.panelOpen, (e) => {
			e && wO(!0);
		}, { immediate: !0 }), (e, t) => (L(), z(co, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => j(wO)(!1)
		}, {
			default: M(() => [j(Y).panelOpen ? (L(), R("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": j(J)("app.name")
			}, [
				B("header", Cz, [
					B("div", wz, [V(j(Ak))]),
					B("div", Tz, [B("div", Ez, k(j(XS) ? j(Ip)(j(XS)) : j(J)("app.name")), 1), B("div", Dz, k(a.value), 1)]),
					V(qM, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: j(J)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					V(Q, {
						icon: j(xA),
						label: j(J)("common.close"),
						align: "end",
						below: "",
						onClick: t[1] ||= (e) => j(Y).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				B("nav", {
					class: O(["tabs", { many: n.value.length > 6 }]),
					role: "tablist"
				}, [(L(!0), R(I, null, F(n.value, (e) => (L(), R("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: O(["tab", { on: e.id === j(Y).tab }]),
					title: j(J)(`tab.${e.id}`),
					"aria-selected": e.id === j(Y).tab,
					onClick: (t) => j(Y).tab = e.id
				}, [(L(), z(ei(e.icon))), B("span", null, k(j(J)(`tab.${e.id}`)), 1)], 10, Oz))), 128))], 2),
				B("main", kz, [(L(), z(Ur, null, [(L(), z(ei(r.value.view), { key: r.value.id }))], 1024))])
			], 8, Sz)) : U("", !0)]),
			_: 1
		}));
	}
}), jz = { class: "inline-drawer" }, Mz = { class: "inline-drawer-toggle inline-drawer-header" }, Nz = { class: "inline-drawer-content" }, Pz = { class: "flex-container alignItemsCenter spaceBetween" }, Fz = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, Iz = { key: 0 }, Lz = { class: "text_muted" }, Rz = {
	key: 1,
	class: "text_muted"
}, zz = /* @__PURE__ */ P({
	__name: "SettingsDrawer",
	setup(e) {
		let t = W({
			get: () => G().enabled,
			set: (e) => {
				G().enabled = e, K();
			}
		});
		return (e, n) => (L(), R("div", jz, [B("div", Mz, [B("b", null, k(j(J)("app.name")), 1), n[3] ||= B("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), B("div", Nz, [
			B("div", Pz, [B("label", Fz, [N(B("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[ss, t.value]]), B("span", null, k(j(J)("settings.enable")), 1)]), B("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => j(tC)(),
				onKeydown: n[2] ||= vs((e) => j(tC)(), ["enter"])
			}, [n[4] ||= B("i", { class: "fa-solid fa-layer-group" }, null, -1), B("span", null, k(j(J)("panel.open")), 1)], 32)]),
			n[5] ||= B("hr", null, null, -1),
			B("h4", null, k(j(J)("settings.preset")), 1),
			j(XS) ? (L(), R("div", Iz, [H(k(j(Ip)(j(XS))) + " ", 1), B("span", Lz, "v" + k(j(XS).version) + " · " + k(j(ZS).config), 1)])) : (L(), R("i", Rz, k(j(J)("settings.inactive")), 1))
		])]));
	}
}), Bz = {
	key: 0,
	class: "preset-banner"
}, Vz = { class: "preset-banner-text" }, Hz = /* @__PURE__ */ P({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => j(XS) ? (L(), R("div", Bz, [
			V(j(Ak), { class: "preset-banner-icon" }),
			B("span", Vz, k(j(J)("banner.usesAp")), 1),
			B("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => j(tC)()
			}, k(j(J)("panel.open")), 1)
		])) : U("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function Uz() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), Ss(zz).mount(t);
}
function Wz() {
	_E("ap-stages", BA, ["mesid"]), _E("ap-cards", FM, ["mesid"]), _E("ap-top-cards", FM, ["mesid", "position"]), _E("ap-dock", BM), _E("ap-storyline", WM, ["mesid"]), _E("ap-panel", Az), _E("ap-preset-banner", Hz), hE(), YS();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, YS);
	EO(), Uz(), gO(), KD();
}
//#endregion
//#region src/index.ts
var Gz = {
	version: "1.12.0",
	buildId: "73579b709846aa0a",
	nextGeneration: (e) => _h(e),
	listPresets: () => xp().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => ih(),
	update: jb,
	togglePanel: (e) => {
		Y.panelOpen = e ?? !Y.panelOpen;
	},
	annotations: kC,
	speech: FC
};
globalThis.advancedPresetInterceptor = Nv, window.AdvancedPreset = Gz;
function Kz(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function qz() {
	for (let { preset: e } of xp()) try {
		await lh(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function Jz() {
	let { eventSource: t, eventTypes: n } = e();
	G(), Lb(), aT(), BT(), OC(), PC(), jw(), bC(), await i(), await yp();
	let r = MT();
	for (let { preset: e } of xp()) {
		let t = qm(e);
		t.length && ug("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => pv(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Rb(e)), Jb(), Mv(), t.on(n.MESSAGE_RECEIVED, (e, t) => CC(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Oh.setPending(null), Oh.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Oh.sweep());
	let a = Kz(() => {
		let e = ih(), t = e ? Tp(e) : void 0;
		t && hh(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, a), t.on(n.OAI_PRESET_CHANGED_AFTER, a), t.on(n.OAI_PRESET_CHANGED_AFTER, KT);
	let o = async () => {
		await Promise.race([$w(), new Promise((e) => setTimeout(e, 3e3))]), await qz();
		for (let e of r) x("info", J("presets.backToBuiltin", { version: e.version }), Ip(e));
		(async () => {
			await jT();
			for (let { preset: e } of xp()) await Gw(e);
			await GT(), await AT();
		})(), Kb({ reload: !0 }), QT(), Tb();
	};
	t.on(n.APP_READY, () => void o()), Wz(), ug("init", {
		version: "1.12.0",
		build: "73579b709846aa0a",
		enabled: G().enabled
	});
}
var Yz = Eb, Xz = HD;
Jz().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { Yz as advancedPresetOnUpdate, Xz as advancedPresetRegisterChatSurface };

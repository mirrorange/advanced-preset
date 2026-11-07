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
var p = () => globalThis.quickReplyApi ?? void 0, m = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
async function h(t, n, r) {
	let i = e();
	if (i.callGenericPopup && i.POPUP_TYPE && i.POPUP_RESULT) return await i.callGenericPopup(t, i.POPUP_TYPE.CONFIRM, "", {
		okButton: n,
		cancelButton: r,
		allowVerticalScrolling: !0
	}) === i.POPUP_RESULT.AFFIRMATIVE;
	let a = document.createElement("div");
	return typeof t == "string" ? a.innerHTML = t : a.append(t.cloneNode(!0)), window.confirm(a.innerText || a.textContent || "");
}
async function g(t, n, r, i) {
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
function _(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var v = (...e) => globalThis.fetch(...e), y = (e) => {
	v = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function b(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var x = {}, S = [], C = () => {}, ee = () => !1, w = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), te = (e) => e.startsWith("onUpdate:"), T = Object.assign, ne = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, re = Object.prototype.hasOwnProperty, E = (e, t) => re.call(e, t), D = Array.isArray, ie = (e) => fe(e) === "[object Map]", ae = (e) => fe(e) === "[object Set]", oe = (e) => fe(e) === "[object Date]", se = (e) => fe(e) === "[object RegExp]", O = (e) => typeof e == "function", ce = (e) => typeof e == "string", le = (e) => typeof e == "symbol", k = (e) => typeof e == "object" && !!e, ue = (e) => (k(e) || O(e)) && O(e.then) && O(e.catch), de = Object.prototype.toString, fe = (e) => de.call(e), pe = (e) => fe(e).slice(8, -1), me = (e) => fe(e) === "[object Object]", he = (e) => ce(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ge = /* @__PURE__ */ b(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), _e = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ve = /-\w/g, ye = _e((e) => e.replace(ve, (e) => e.slice(1).toUpperCase())), be = /\B([A-Z])/g, xe = _e((e) => e.replace(be, "-$1").toLowerCase()), Se = _e((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ce = _e((e) => e ? `on${Se(e)}` : ""), we = (e, t) => !Object.is(e, t), Te = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Ee = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, De = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Oe = (e) => {
	let t = ce(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ke, Ae = () => ke ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function je(e) {
	if (D(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = ce(r) ? Fe(r) : je(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (ce(e) || k(e)) return e;
}
var Me = /;(?![^(]*\))/g, Ne = /:([^]+)/, Pe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Fe(e) {
	let t = {};
	return e.replace(Pe, (e) => e.startsWith("/*") ? "" : e).split(Me).forEach((e) => {
		if (e) {
			let n = e.split(Ne);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (ce(e)) t = e;
	else if (D(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (k(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ie = /* @__PURE__ */ b("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Le(e) {
	return !!e || e === "";
}
function Re(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = He(e[i], t[i], n);
	return r;
}
function ze(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && He(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Be(e, t, n) {
	let r = ie(e), i = ie(t);
	if (r || i || (r = ae(e), i = ae(t), r || i)) return r && i ? ze(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !He(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Ve(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function He(e, t, n) {
	if (e === t) return !0;
	let r = oe(e), i = oe(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = le(e), i = le(t), r || i ? e === t : (r = D(e), i = D(t), r || i ? r && i ? Ve(e, t, n, Re) : !1 : (r = k(e), i = k(t), r || i ? !r || !i ? !1 : Ve(e, t, n, Be) : String(e) === String(t))));
}
function Ue(e, t) {
	return e.findIndex((e) => He(e, t));
}
var We = (e) => !!(e && e.__v_isRef === !0), j = (e) => ce(e) ? e : e == null ? "" : D(e) || k(e) && (e.toString === de || !O(e.toString)) ? We(e) ? j(e.value) : JSON.stringify(e, Ge, 2) : String(e), Ge = (e, t) => We(t) ? Ge(e, t.value) : ie(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ke(t, r) + " =>"] = n, e), {}) } : ae(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ke(e)) } : le(t) ? Ke(t) : k(t) && !D(t) && !me(t) ? String(t) : t, Ke = (e, t = "") => le(e) ? `Symbol(${e.description ?? t})` : e, qe, Je = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && qe && (qe.active ? (this.parent = qe, this.index = (qe.scopes || (qe.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = qe;
			try {
				return qe = this, e();
			} finally {
				qe = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = qe, qe = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (qe === this) qe = this.prevScope;
			else {
				let e = qe;
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
function Ye() {
	return qe;
}
var Xe, Ze = /* @__PURE__ */ new WeakSet(), Qe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, qe && (qe.active ? qe.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ze.has(this) && (Ze.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || nt(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, ht(this), at(this);
		let e = Xe, t = dt;
		Xe = this, dt = !0;
		try {
			return this.fn();
		} finally {
			ot(this), Xe = e, dt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) lt(e);
			this.deps = this.depsTail = void 0, ht(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ze.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		st(this) && this.run();
	}
	get dirty() {
		return st(this);
	}
}, $e = 0, et, tt;
function nt(e, t = !1) {
	e.flags |= 8, t ? (e.next = tt, tt = e) : (e.next = et, et = e);
}
function rt() {
	$e++;
}
function it() {
	if (--$e > 0) return;
	if (tt) {
		let e = tt;
		for (tt = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; et;) {
		let t = et;
		for (et = void 0; t;) {
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
function at(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ot(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), lt(r), ut(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function st(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ct(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ct(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === gt) || (e.globalVersion = gt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !st(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = Xe, r = dt;
	Xe = e, dt = !0;
	try {
		at(e);
		let n = e.fn(e._value);
		(t.version === 0 || we(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Xe = n, dt = r, ot(e), e.flags &= -3;
	}
}
function lt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) lt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ut(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var dt = !0, ft = [];
function pt() {
	ft.push(dt), dt = !1;
}
function mt() {
	let e = ft.pop();
	dt = e === void 0 || e;
}
function ht(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = Xe;
		Xe = void 0;
		try {
			t();
		} finally {
			Xe = e;
		}
	}
}
var gt = 0, _t = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, vt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!Xe || !dt || Xe === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Xe) t = this.activeLink = new _t(Xe, this), Xe.deps ? (t.prevDep = Xe.depsTail, Xe.depsTail.nextDep = t, Xe.depsTail = t) : Xe.deps = Xe.depsTail = t, yt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Xe.depsTail, t.nextDep = void 0, Xe.depsTail.nextDep = t, Xe.depsTail = t, Xe.deps === t && (Xe.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, gt++, this.notify(e);
	}
	notify(e) {
		rt();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			it();
		}
	}
};
function yt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) yt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var bt = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ Symbol(""), St = /* @__PURE__ */ Symbol(""), Ct = /* @__PURE__ */ Symbol("");
function wt(e, t, n) {
	if (dt && Xe) {
		let t = bt.get(e);
		t || bt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new vt()), r.map = t, r.key = n), r.track();
	}
}
function Tt(e, t, n, r, i, a) {
	let o = bt.get(e);
	if (!o) {
		gt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (rt(), t === "clear") o.forEach(s);
	else {
		let i = D(e), a = i && he(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ct || !le(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ct)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(xt)), ie(e) && s(o.get(St)));
				break;
			case "delete":
				i || (s(o.get(xt)), ie(e) && s(o.get(St)));
				break;
			case "set": ie(e) && s(o.get(xt));
		}
	}
	it();
}
function Et(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e || (wt(t, "iterate", Ct), /* @__PURE__ */ pn(e)) ? t : /* @__PURE__ */ fn(e) ? /* @__PURE__ */ dn(e) ? t.map((e) => _n(gn(e))) : t.map(_n) : t.map(gn);
}
function Dt(e) {
	return wt(e = /* @__PURE__ */ M(e), "iterate", Ct), e;
}
function Ot(e, t) {
	return /* @__PURE__ */ fn(e) ? _n(/* @__PURE__ */ dn(e) ? gn(t) : t) : gn(t);
}
var kt = {
	__proto__: null,
	[Symbol.iterator]() {
		return At(this, Symbol.iterator, (e) => Ot(this, e));
	},
	concat(...e) {
		return Et(this).concat(...e.map((e) => D(e) ? Et(e) : e));
	},
	entries() {
		return At(this, "entries", (e) => (e[1] = Ot(this, e[1]), e));
	},
	every(e, t) {
		return Nt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Nt(this, "filter", e, t, (e) => e.map((e) => Ot(this, e)), arguments);
	},
	find(e, t) {
		return Nt(this, "find", e, t, (e) => Ot(this, e), arguments);
	},
	findIndex(e, t) {
		return Nt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Nt(this, "findLast", e, t, (e) => Ot(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Nt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Nt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Ft(this, "includes", e);
	},
	indexOf(...e) {
		return Ft(this, "indexOf", e);
	},
	join(e) {
		return Et(this).join(e);
	},
	lastIndexOf(...e) {
		return Ft(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Nt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return It(this, "pop");
	},
	push(...e) {
		return It(this, "push", e);
	},
	reduce(e, ...t) {
		return Pt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Pt(this, "reduceRight", e, t);
	},
	shift() {
		return It(this, "shift");
	},
	some(e, t) {
		return Nt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return It(this, "splice", e);
	},
	toReversed() {
		return Et(this).toReversed();
	},
	toSorted(e) {
		return Et(this).toSorted(e);
	},
	toSpliced(...e) {
		return Et(this).toSpliced(...e);
	},
	unshift(...e) {
		return It(this, "unshift", e);
	},
	values() {
		return At(this, "values", (e) => Ot(this, e));
	}
};
function At(e, t, n) {
	let r = Dt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ pn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => jt(a.next(), n), i !== Mt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => jt(a._next(), n);
	}
	return a;
}
function jt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Mt = Array.prototype;
function Nt(e, t, n, r, i, a) {
	let o = Dt(e), s = o !== e && !/* @__PURE__ */ pn(e), c = o[t];
	if (c !== Mt[t]) {
		let t = c.apply(e, a);
		return s ? gn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Ot(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Pt(e, t, n, r) {
	let i = Dt(e), a = i !== e && !/* @__PURE__ */ pn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Ot(e, t)), n.call(this, t, Ot(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Ot(e, c) : c;
}
function Ft(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	wt(r, "iterate", Ct);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ mn(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function It(e, t, n = []) {
	pt(), rt();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return it(), mt(), r;
}
var Lt = /* @__PURE__ */ b("__proto__,__v_isRef,__isVue"), Rt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(le));
function zt(e) {
	le(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return wt(t, "has", e), t.hasOwnProperty(e);
}
var Bt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? an : rn : i ? nn : tn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = D(e);
		if (!r) {
			let e;
			if (a && (e = kt[t])) return e;
			if (t === "hasOwnProperty") return zt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ vn(e) ? e : n);
		if ((le(t) ? Rt.has(t) : Lt(t)) || (r || wt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ vn(o)) {
			let e = a && he(t) ? o : o.value;
			return r && k(e) ? /* @__PURE__ */ ln(e) : e;
		}
		return k(o) ? r ? /* @__PURE__ */ ln(o) : /* @__PURE__ */ sn(o) : o;
	}
}, Vt = class extends Bt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = D(e) && he(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ fn(i);
			if (!/* @__PURE__ */ pn(n) && !/* @__PURE__ */ fn(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ vn(i) && !/* @__PURE__ */ vn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : E(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ vn(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? we(n, i) && Tt(e, "set", t, n, i) : Tt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = E(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Tt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!le(t) || !Rt.has(t)) && wt(e, "has", t), n;
	}
	ownKeys(e) {
		return wt(e, "iterate", D(e) ? "length" : xt), Reflect.ownKeys(e);
	}
}, Ht = class extends Bt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ut = /* @__PURE__ */ new Vt(), Wt = /* @__PURE__ */ new Ht(), Gt = /* @__PURE__ */ new Vt(!0), Kt = (e) => e, qt = (e) => Reflect.getPrototypeOf(e);
function Jt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = ie(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Kt : t ? _n : gn;
		return !t && wt(a, "iterate", c ? St : xt), T(Object.create(l), { next() {
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
function Yt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Xt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (we(n, a) && wt(i, "get", n), wt(i, "get", a));
			let { has: o } = qt(i), s = t ? Kt : e ? _n : gn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && wt(/* @__PURE__ */ M(t), "iterate", xt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (we(t, i) && wt(r, "has", t), wt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? Kt : e ? _n : gn;
			return !e && wt(o, "iterate", xt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return T(n, e ? {
		add: Yt("add"),
		set: Yt("set"),
		delete: Yt("delete"),
		clear: Yt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = qt(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ pn(e) && !/* @__PURE__ */ fn(e) ? i : e;
			return r.has.call(n, a) || we(e, a) && r.has.call(n, e) || we(i, a) && r.has.call(n, i) || (n.add(a), Tt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ pn(n) && !/* @__PURE__ */ fn(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = qt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? we(n, s) && Tt(r, "set", e, n, s) : Tt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = qt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Tt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && Tt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Jt(r, e, t);
	}), n;
}
function Zt(e, t) {
	let n = Xt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(E(n, i) && i in r ? n : r, i, a);
}
var Qt = { get: /* @__PURE__ */ Zt(!1, !1) }, $t = { get: /* @__PURE__ */ Zt(!1, !0) }, en = { get: /* @__PURE__ */ Zt(!0, !1) }, tn = /* @__PURE__ */ new WeakMap(), nn = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new WeakMap(), an = /* @__PURE__ */ new WeakMap();
function on(e) {
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
function sn(e) {
	return /* @__PURE__ */ fn(e) ? e : un(e, !1, Ut, Qt, tn);
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
	return un(e, !1, Gt, $t, nn);
}
// @__NO_SIDE_EFFECTS__
function ln(e) {
	return un(e, !0, Wt, en, rn);
}
function un(e, t, n, r, i) {
	if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = on(pe(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	return /* @__PURE__ */ fn(e) ? /* @__PURE__ */ dn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function pn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function hn(e) {
	return !E(e, "__v_skip") && Object.isExtensible(e) && Ee(e, "__v_skip", !0), e;
}
var gn = (e) => k(e) ? /* @__PURE__ */ sn(e) : e, _n = (e) => k(e) ? /* @__PURE__ */ ln(e) : e;
// @__NO_SIDE_EFFECTS__
function vn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return yn(e, !1);
}
function yn(e, t) {
	return /* @__PURE__ */ vn(e) ? e : new bn(e, t);
}
var bn = class {
	constructor(e, t) {
		this.dep = new vt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : gn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ pn(e) || /* @__PURE__ */ fn(e);
		e = n ? e : /* @__PURE__ */ M(e), we(e, t) && (this._rawValue = e, this._value = n ? e : gn(e), this.dep.trigger());
	}
};
function P(e) {
	return /* @__PURE__ */ vn(e) ? e.value : e;
}
var xn = {
	get: (e, t, n) => t === "__v_raw" ? e : P(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ vn(i) && !/* @__PURE__ */ vn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Sn(e) {
	return /* @__PURE__ */ dn(e) ? e : new Proxy(e, xn);
}
var Cn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new vt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function wn(e) {
	return new Cn(e);
}
var Tn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new vt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = gt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Xe !== this) return nt(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ct(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function En(e, t, n = !1) {
	let r, i;
	return O(e) ? r = e : (r = e.get, i = e.set), new Tn(r, i, n);
}
var Dn = {}, On = /* @__PURE__ */ new WeakMap(), kn = void 0;
function An(e, t = !1, n = kn) {
	if (n) {
		let t = On.get(n);
		t || On.set(n, t = []), t.push(e);
	}
}
function jn(e, t, n = x) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ pn(e) || i === !1 || i === 0 ? Mn(e, 1) : Mn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ vn(e) ? (d = () => e.value, m = /* @__PURE__ */ pn(e)) : /* @__PURE__ */ dn(e) ? (d = () => l(e), m = !0) : D(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ dn(e) || /* @__PURE__ */ pn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ vn(e)) return e.value;
		if (/* @__PURE__ */ dn(e)) return l(e);
		if (O(e)) return c ? c(e, 2) : e();
	})) : d = O(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			pt();
			try {
				f();
			} finally {
				mt();
			}
		}
		let t = kn;
		kn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			kn = t;
		}
	} : C, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => Mn(e(), t);
	}
	let g = Ye(), _ = () => {
		u.stop(), g && g.active && ne(g.effects, u);
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
	let v = h ? Array(e.length).fill(Dn) : Dn, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => we(e, v[t])) : we(n, v))) {
					let e = kn;
					pt();
					try {
						f && f(), kn = u;
						let e = [
							n,
							v === Dn ? void 0 : h && v[0] === Dn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						kn = e, mt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new Qe(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => An(e, !1, u), f = u.onStop = () => {
		let e = On.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			On.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function Mn(e, t = Infinity, n) {
	if (t <= 0 || !k(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ vn(e)) Mn(e.value, t, n);
	else if (D(e)) for (let r = 0; r < e.length; r++) Mn(e[r], t, n);
	else if (ae(e) || ie(e)) e.forEach((e) => {
		Mn(e, t, n);
	});
	else if (me(e)) {
		for (let r in e) Mn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Mn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Nn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Fn(e, t, n);
	}
}
function Pn(e, t, n, r) {
	if (O(e)) {
		let i = Nn(e, t, n, r);
		return i && ue(i) && i.catch((e) => {
			Fn(e, t, n);
		}), i;
	}
	if (D(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Pn(e[a], t, n, r));
		return i;
	}
}
function Fn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || x;
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
			pt(), Nn(a, null, 10, [
				e,
				i,
				o
			]), mt();
			return;
		}
	}
	In(e, n, i, r, o);
}
function In(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Ln = [], Rn = -1, zn = [], Bn = null, Vn = 0, Hn = /* @__PURE__ */ Promise.resolve(), Un = null;
function Wn(e) {
	let t = Un || Hn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Gn(e) {
	let t = Rn + 1, n = Ln.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Ln[r], a = $n(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Kn(e) {
	if (!(e.flags & 1)) {
		let t = $n(e), n = Ln[Ln.length - 1];
		!n || !(e.flags & 2) && t >= $n(n) ? Ln.push(e) : Ln.splice(Gn(t), 0, e), e.flags |= 1, qn();
	}
}
function qn() {
	Un ||= Hn.then(er);
}
function Jn(e) {
	if (!D(e)) Bn && e.id === -1 ? Bn.splice(Vn + 1, 0, e) : e.flags & 1 || (zn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) zn.push(e[t]);
	qn();
}
function Yn(e, t, n, r = Rn + 1) {
	for (; r < Ln.length; r++) {
		let n = Ln[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Ln.splice(r, 1), r = e ? r - 1 : Rn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Xn(e, t, n = 0) {
	if (zn.length) {
		let e = zn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < zn.length; i++) {
				let a = zn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? zn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => $n(e) - $n(t));
		if (zn.length = r, Bn) {
			for (let e = 0; e < i.length; e++) Bn.push(i[e]);
			return;
		}
		for (Bn = i, Vn = 0; Vn < Bn.length; Vn++) {
			let e = Bn[Vn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Bn = null, Vn = 0;
	}
}
var Zn = !1;
function Qn(e, t) {
	if (Zn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(zn);
	e(), Zn = !0;
	try {
		Yn(void 0, t), Xn(void 0, n, t);
	} finally {
		Zn = !1;
	}
}
var $n = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function er(e) {
	try {
		for (Rn = 0; Rn < Ln.length; Rn++) {
			let e = Ln[Rn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Nn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Rn < Ln.length; Rn++) {
			let e = Ln[Rn];
			e && (e.flags &= -2);
		}
		Rn = -1, Ln.length = 0, Xn(e), Un = null, (Ln.length || zn.length) && er(e);
	}
}
var tr = null, nr = null;
function rr(e) {
	let t = tr;
	return tr = e, nr = e && e.type.__scopeId || null, t;
}
function F(e, t = tr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && oa(-1);
		let i = rr(t), a = na.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = na.length; e > a; e--) ia();
			rr(i), r._d && oa(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function ir(e, t) {
	if (tr === null) return e;
	let n = Ra(tr), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = x] = t[e];
		i && (O(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && Mn(a), r.push({
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
function ar(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (pt(), Pn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), mt());
	}
}
function or(e, t, n = !1) {
	let r = Ta();
	if (r || li) {
		let i = li ? li._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && O(t) ? t.call(r && r.proxy) : t;
	}
}
var sr = /* @__PURE__ */ Symbol.for("v-scx"), cr = () => or(sr);
function lr(e, t) {
	return fr(e, null, t);
}
function ur(e, t) {
	return fr(e, null, { flush: "sync" });
}
function dr(e, t, n) {
	return fr(e, t, n);
}
function fr(e, t, n = x) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = T({}, n), c = t && r || !t && a !== "post", l;
	if (ja) {
		if (a === "sync") {
			let e = cr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = C, e.resume = C, e.pause = C, e;
		}
	}
	let u = wa;
	s.call = (e, t, n) => Pn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Bi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Kn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = jn(e, t, s);
	return ja && (l ? l.push(f) : c && f()), f;
}
var pr = /* @__PURE__ */ Symbol("_vte"), mr = (e) => e.__isTeleport, hr = /* @__PURE__ */ Symbol("_leaveCb"), gr = /* @__PURE__ */ Symbol("_enterCb");
function _r() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Ur(() => {
		e.isMounted = !0;
	}), Gr(() => {
		e.isUnmounting = !0;
	}), e;
}
var vr = [Function, Array], yr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: vr,
	onEnter: vr,
	onAfterEnter: vr,
	onEnterCancelled: vr,
	onBeforeLeave: vr,
	onLeave: vr,
	onAfterLeave: vr,
	onLeaveCancelled: vr,
	onBeforeAppear: vr,
	onAppear: vr,
	onAfterAppear: vr,
	onAppearCancelled: vr
}, br = {
	name: "BaseTransition",
	props: yr,
	setup(e, { slots: t }) {
		let n = Ta(), r = _r();
		return () => {
			let i = t.default && Or(t.default(), !0), a = i && i.length ? xr(i) : n.subTree ? G() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ M(e), { mode: s } = o;
			if (r.isLeaving) return Tr(a);
			let c = Er(a);
			if (!c) return Tr(a);
			let l = wr(c, o, r, n, (e) => l = e);
			c.type !== ea && Dr(c, l);
			let u = n.subTree && Er(n.subTree);
			if (u && u.type !== ea && !la(u, c) && kr(n.subTree)) {
				let e = wr(u, o, r, n);
				if (Dr(u, e), s === "out-in" && c.type !== ea) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, Tr(a);
				s === "in-out" && c.type !== ea ? e.delayLeave = (e, t, n) => {
					let i = Cr(r, u);
					i[String(u.key)] = u, e[hr] = () => {
						t(), e[hr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function xr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ea) {
			t = n;
			break;
		}
	}
	return t;
}
var Sr = br;
function Cr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function wr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = Cr(n, e), S = (e, t) => {
		e && Pn(e, r, 9, t);
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
			t[hr] && t[hr](!0);
			let i = x[b];
			if (i && la(e, i)) {
				let e = i.el[hr];
				if (!e) {
					let t = kr(i);
					e = t && t.el[hr];
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
			t[gr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), ee.delayedLeave && ee.delayedLeave(), t[gr] = void 0);
			};
			let c = t[gr].bind(null, !1);
			r ? C(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[gr] && t[gr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[hr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[hr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[hr].bind(null, !1);
			x[i] = e, p ? C(p, [t, o]) : o();
		},
		clone(e) {
			let a = wr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return ee;
}
function Tr(e) {
	if (Ir(e)) return e = ma(e), e.children = null, e;
}
function Er(e) {
	if (!Ir(e)) return mr(e.type) && e.children ? xr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && O(n.default)) return n.default();
	}
}
function Dr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Dr(mr(n.type) && Er(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === R && D(e.children)) {
		let n = gi(e.children, !1);
		n && Dr(n, t);
	}
}
function Or(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(Or(o.children, t, s))) : (t || o.type !== ea) && r.push(s == null ? o : ma(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function kr(e) {
	if (e.component) return kr(e.component.subTree);
	if (e.type === R) {
		let t = D(e.children) && gi(e.children, !1);
		return t ? kr(t) : void 0;
	}
	if (e.type !== ea) return e;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return O(e) ? /* @__PURE__ */ T({ name: e.name }, t, { setup: e }) : e;
}
function Ar(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function jr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Mr = /* @__PURE__ */ new WeakMap();
function Nr(e, t, n, r, i = !1) {
	if (D(e)) {
		e.forEach((e, a) => Nr(e, t && (D(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Fr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Nr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ra(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === x ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ M(d), p = d === x ? ee : (e) => !jr(u, e) && E(f, e), m = (e, t) => !(t && jr(u, t));
	if (l != null && l !== c) {
		if (Pr(t), ce(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ vn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (O(c)) Nn(c, s, 12, [o, u]);
	else {
		let t = ce(c), r = /* @__PURE__ */ vn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) D(n) && ne(n, a);
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
					s(), Mr.delete(e);
				};
				t.id = -1, Mr.set(e, t), Bi(t, n);
			} else Pr(e), s();
		}
	}
}
function Pr(e) {
	let t = Mr.get(e);
	t && (t.flags |= 8, Mr.delete(e));
}
Ae().requestIdleCallback, Ae().cancelIdleCallback;
var Fr = (e) => !!e.type.__asyncLoader, Ir = (e) => e.type.__isKeepAlive, Lr = {
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
		let n = Ta(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Bi(() => {
				a.isDeactivated = !1, a.a && Te(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && ya(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Yi(t.m), Yi(t.a), l(e, f, null, 1, s), Bi(() => {
				t.da && Te(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && ya(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			zr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = za(Fr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !la(t, o)) ? p(t) : o && (zr(o), t && zr(t)), i.delete(e), a.delete(e);
		}
		dr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Rr(e, t)), t && m((e) => !Rr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Zi(n.subTree.type) ? Bi(() => {
				let e = Br(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Br(n.subTree)));
		};
		return Ur(_), Wr(_), Gr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Br(t);
				if (e.type === i.type && e.key === i.key) {
					zr(i);
					let e = i.component.da;
					e && Bi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!ca(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Br(r);
			if (s.type === ea) return o = null, s;
			let c = s.type, l = za(Fr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Rr(u, l)) || d && l && Rr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = ma(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Dr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Zi(r.type) ? r : s;
		};
	}
};
function Rr(e, t) {
	return D(e) ? e.some((e) => Rr(e, t)) : ce(e) ? e.split(",").includes(t) : se(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function zr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Br(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Vr(e, t, n = wa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			pt();
			let i = Oa(n), a = Pn(t, n, e, r);
			return i(), mt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Hr = (e) => (t, n = wa) => {
	(!ja || e === "sp") && Vr(e, (...e) => t(...e), n);
}, Ur = Hr("m"), Wr = Hr("u"), Gr = Hr("bum"), Kr = "components", qr = /* @__PURE__ */ Symbol.for("v-ndc");
function Jr(e) {
	return ce(e) ? Yr(Kr, e, !1) || e : e || qr;
}
function Yr(e, t, n = !0, r = !1) {
	let i = tr || wa;
	if (i) {
		let n = i.type;
		if (e === Kr) {
			let e = za(n, !1);
			if (e && (e === t || e === ye(t) || e === Se(ye(t)))) return n;
		}
		let a = Xr(i[e] || n[e], t) || Xr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Xr(e, t) {
	return e && (e[t] || e[ye(t)] || e[Se(ye(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = D(e);
	if (o || ce(e)) {
		let n = o && /* @__PURE__ */ dn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ pn(e), s = /* @__PURE__ */ fn(e), e = Dt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? _n(gn(e[n])) : gn(e[n]) : e[n], n, void 0, a && a[n]);
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
function Zr(e, t) {
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
function Qr(e, t, n, r, i, a) {
	if (n ??= {}, tr.ce || tr.parent && Fr(tr.parent) && tr.parent.ce) {
		let e = a != null && n.key == null ? T({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = na.length;
	z();
	let c;
	try {
		let i = o && $r(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !le(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = na.length; e > s; e--) ia();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function $r(e) {
	return e.some((e) => !ca(e) || !(e.type === ea || e.type === R && !$r(e.children))) ? e : null;
}
var ei = (e) => e ? Aa(e) ? Ra(e) : ei(e.parent) : null, ti = /* @__PURE__ */ T(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ei(e.parent),
	$root: (e) => ei(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Kn(e.update);
	},
	$nextTick: (e) => e.n ||= Wn.bind(e.proxy),
	$watch: (e) => C
}), ni = (e, t) => e !== x && !e.__isScriptSetup && E(e, t), ri = {
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
			else if (ni(r, t)) return o[t] = 1, r[t];
			else if (E(a, t)) return o[t] = 3, a[t];
			else if (n !== x && E(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = ti[t], u, d;
		if (l) return t === "$attrs" && wt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== x && E(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, E(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ni(i, t) ? (i[t] = n, !0) : E(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ni(t, s) || E(a, s) || E(r, s) || E(ti, s) || E(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? E(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ii(e) {
	return D(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ai(e, t) {
	return !e || !t ? e || t : D(e) && D(t) ? e.concat(t) : T({}, ii(e), ii(t));
}
function oi() {
	return {
		app: null,
		config: {
			isNativeTag: ee,
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
var si = 0;
function ci(e, t) {
	return function(n, r = null) {
		O(n) || (n = T({}, n)), r != null && !k(r) && (r = null);
		let i = oi(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: si++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ha,
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
					let u = c._ceVNode || U(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ra(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Pn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = li;
				li = c;
				try {
					return e();
				} finally {
					li = t;
				}
			}
		};
		return c;
	};
}
var li = null;
function ui(e, t, n = x) {
	let r = Ta(), i = ye(t), a = xe(t), o = di(e, i), s = wn((o, s) => {
		let c, l = x, u;
		return ur(() => {
			let t = e[i];
			we(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!we(o, c) && !(l !== x && we(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), we(e, l) && (we(e, o) && !we(o, u) || f && l !== x && !we(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || x : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var di = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ye(t)}Modifiers`] || e[`${xe(t)}Modifiers`];
function fi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || x, i = n, a = t.startsWith("update:"), o = a && di(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => ce(e) ? e.trim() : e)), o.number && (i = i.map(De)));
	let s, c = r[s = Ce(t)] || r[s = Ce(ye(t))];
	!c && a && (c = r[s = Ce(xe(t))]), c && Pn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Pn(l, e, 6, i);
	}
}
function pi(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (D(a) ? a.forEach((e) => o[e] = null) : T(o, a), k(e) && r.set(e, o), o) : (k(e) && r.set(e, null), null);
}
function mi(e, t) {
	return !e || !w(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), E(e, t[0].toLowerCase() + t.slice(1)) || E(e, xe(t)) || E(e, t));
}
function hi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = rr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = ha(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = ha(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : _i(s);
		}
	} catch (t) {
		na.length = 0, Fn(t, e, 1), _ = U(ea);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(te) && (v = vi(v, a)), y = ma(y, v, !1, !0));
	}
	return n.dirs && (y = ma(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Dr(mr(y.type) && Er(y) || y, n.transition), _ = y, rr(g), _;
}
function gi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ca(r)) {
			if (r.type !== ea || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var _i = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || w(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, vi = (e, t) => {
	let n = {};
	for (let r in e) (!te(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function yi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? bi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (xi(o, r, n) && !mi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || bi(r, o, l) : !!o;
	return !1;
}
function bi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!E(e, a) || xi(t, e, a) && !mi(n, a)) return !0;
	}
	return !1;
}
function xi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && k(r) && k(i) ? !He(r, i) : r !== i;
}
function Si({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Ci = {}, wi = () => Object.create(Ci), Ti = (e) => Object.getPrototypeOf(e) === Ci;
function Ei(e, t, n, r = !1) {
	let i = {}, a = wi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Oi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ cn(i) : e.type.props ? i : a, e.attrs = a;
}
function Di(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (mi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (E(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ye(o);
						i[t] = ki(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Oi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !E(t, a) && ((r = xe(a)) === a || !E(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ki(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !E(t, e)) && (delete a[e], l = !0);
	}
	l && Tt(e.attrs, "set", "");
}
function Oi(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (ge(c)) continue;
		let l = t[c], u;
		i && E(i, u = ye(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : mi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ M(n), r = s || x;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = ki(i, t, s, r[s], e, !E(r, s));
		}
	}
	return o;
}
function ki(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = E(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && O(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Oa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === xe(n)) && (r = !0));
	}
	return r;
}
function Ai(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return k(e) && r.set(e, S), S;
	if (D(a)) for (let e = 0; e < a.length; e++) {
		let t = ye(a[e]);
		ji(t) && (o[t] = x);
	}
	else if (a) for (let e in a) {
		let t = ye(e);
		if (ji(t)) {
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
	return k(e) && r.set(e, c), c;
}
function ji(e) {
	return e[0] !== "$" && !ge(e);
}
var Mi = (e) => e === "_" || e === "_ctx" || e === "$stable", Ni = (e) => D(e) ? e.map(ha) : [ha(e)], Pi = (e, t, n) => {
	if (t._n) return t;
	let r = F((...e) => Ni(t(...e)), n);
	return r._c = !1, r;
}, Fi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Mi(n)) continue;
		let i = e[n];
		if (O(i)) t[n] = Pi(n, i, r);
		else if (i != null) {
			let e = Ni(i);
			t[n] = () => e;
		}
	}
}, Ii = (e, t) => {
	let n = Ni(t);
	e.slots.default = () => n;
}, Li = (e, t, n) => {
	for (let r in t) (n || !Mi(r)) && (e[r] = t[r]);
}, Ri = (e, t, n) => {
	let r = e.slots = wi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Li(r, t, n), n && Ee(r, "_", e, !0)) : Fi(t, r);
	} else t && Ii(e, t);
}, zi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = x;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Li(i, t, n) : (a = !t.$stable, Fi(t, i)), o = t;
	} else t && (Ii(e, t), o = { default: 1 });
	if (a) for (let e in i) !Mi(e) && o[e] == null && delete i[e];
}, Bi = Qi;
function Vi(e) {
	return Hi(e);
}
function Hi(e, t) {
	let n = Ae();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = C, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !la(e, t) && (r = _e(e), de(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === S && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case $i:
				g(e, t, n, r);
				break;
			case ea:
				_(e, t, n, r);
				break;
			case ta:
				e ?? v(t, n, r, o);
				break;
			case R:
				D(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? ee(e, t, n, r, i, a, o, s, c) : d & 6 ? ie(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ye);
		}
		u != null && i ? Nr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Nr(e.ref, null, a, e, !0);
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
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && T(e.children, f, null, i, s, Ui(e, c), l, d), _ && ar(e, null, i, "created"), te(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !ge(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && ya(p, i, e);
		}
		_ && ar(e, null, i, "beforeMount");
		let v = Gi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Bi(() => {
			try {
				p && ya(p, i, e), v && g.enter(f), _ && ar(e, null, i, "mounted");
			} finally {}
		}, s);
	}, te = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Zi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ga(e[l]) : ha(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || x, m = t.props || x, h;
		if (n && Wi(n, !1), (h = m.onVnodeBeforeUpdate) && ya(h, n, t, e), f && ar(t, e, n, "beforeUpdate"), n && Wi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? re(e.dynamicChildren, d, c, n, r, Ui(t, i), o) : s || ce(e, t, c, null, n, r, Ui(t, i), o, !1), l > 0) {
			if (l & 16) E(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && E(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Bi(() => {
			h && ya(h, n, t, e), f && ar(t, e, n, "updated");
		}, r);
	}, re = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Xi(c), f = u && (c.type === R || !la(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, E = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== x) for (let o in t) !ge(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ge(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, D = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), T(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (re(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Ki(e, t, !0)) : ce(e, t, n, f, a, o, c, l, u);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : oe(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = Ca(e, r, i);
		if (Ir(e) && (s.ctx.renderer = ye), Ma(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = U(ea);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (yi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, O(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, se = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ji(e);
					if (n) {
						t && (t.el = c.el, O(e, t, o)), n.asyncDep.then(() => {
							Bi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Wi(e, !1), t ? (t.el = c.el, O(e, t, o)) : t = c, n && Te(n), (f = t.props && t.props.onVnodeBeforeUpdate) && ya(f, s, t, c), Wi(e, !0);
				let p = hi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), _e(m), e, i, a), t.el = p.el, u === null && Si(e, p.el), r && Bi(r, i), (f = t.props && t.props.onVnodeUpdated) && Bi(() => ya(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Fr(t);
				if (Wi(e, !1), l && Te(l), !m && (o = c && c.onVnodeBeforeMount) && ya(o, d, t), Wi(e, !0), s && xe) {
					let t = () => {
						e.subTree = hi(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = hi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Bi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Bi(() => ya(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Fr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Bi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Qe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Kn(u), Wi(e, !0), l();
	}, O = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Di(e, t.props, r, n), zi(e, t.children, n), pt(), Yn(e), mt();
	}, ce = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				k(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				le(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && he(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? k(l, f, n, r, i, a, o, s, c) : he(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && T(f, n, r, i, a, o, s, c));
	}, le = (e, t, n, r, i, a, o, s, c) => {
		e ||= S, t ||= S;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? ga(t[f]) : ha(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? he(e, i, a, !0, !1, d) : T(t, n, r, i, a, o, s, c, d);
	}, k = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? ga(t[l]) : ha(t[l]);
			if (la(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? ga(t[f]) : ha(t[f]);
			if (la(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? ga(t[l]) : ha(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) de(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? ga(t[l]) : ha(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, C = Array(y);
			for (l = 0; l < y; l++) C[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					de(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (C[_ - m] === 0 && la(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? de(r, i, a, !0) : (C[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let ee = b ? qi(C) : S;
			for (_ = ee.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Xi(f) : r;
				C[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== ee[_] ? ue(d, n, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ue(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ye);
		else if (c === R) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === ta) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[hr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Bi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[hr];
					s._isLeaving && s[hr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (pt(), Nr(s, null, n, e, !0), mt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Fr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ya(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && ar(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ye, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Bi(() => {
			_ && ya(_, t, e), h && ar(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === R;
		if (o && !a) {
			pe(n, r);
			return;
		}
		if (t === ta) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? kr(e) : e, c = () => {
			o ? d(n) && pe(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Yi(c), Yi(l), r && Te(r), i.stop(), a ? (a.flags |= 8, de(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, de(o, e, t, n)), s && Bi(s, t), Bi(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[pr];
		return n ? f(n) : t;
	}, ve = (e, t, n) => {
		Qn(() => {
			e == null ? t._vnode && de(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Sa());
	}, ye = {
		p: h,
		um: de,
		m: ue,
		r: fe,
		mt: ae,
		mc: T,
		pc: ce,
		pbc: re,
		n: _e,
		o: e
	}, be, xe;
	return t && ([be, xe] = t(ye)), {
		render: ve,
		hydrate: be,
		createApp: ci(ve, be)
	};
}
function Ui({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Wi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Gi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ki(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (D(r) && D(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ga(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ki(t, a)), a.type === $i && (a.patchFlag === -1 && (a = i[e] = ga(a)), a.el = t.el), a.type === ea && !a.el && (a.el = t.el);
	}
}
function qi(e) {
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
function Ji(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ji(t);
}
function Yi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Xi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Xi(t.subTree) : null;
}
var Zi = (e) => e.__isSuspense;
function Qi(e, t) {
	t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : Jn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), $i = /* @__PURE__ */ Symbol.for("v-txt"), ea = /* @__PURE__ */ Symbol.for("v-cmt"), ta = /* @__PURE__ */ Symbol.for("v-stc"), na = [], ra = null;
function z(e = !1) {
	na.push(ra = e ? null : []);
}
function ia() {
	na.pop(), ra = na[na.length - 1] || null;
}
var aa = 1;
function oa(e, t = !1) {
	aa += e, e < 0 && ra && t && (ra.hasOnce = !0);
}
function sa(e) {
	return e.dynamicChildren = aa > 0 ? ra || S : null, ia(), aa > 0 && ra && ra.push(e), e;
}
function B(e, t, n, r, i, a) {
	return sa(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return sa(U(e, t, n, r, i, !0));
}
function ca(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function la(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ua = ({ key: e }) => e ?? null, da = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : ce(e) || /* @__PURE__ */ vn(e) || O(e) ? {
	i: tr,
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
		key: t && ua(t),
		ref: t && da(t),
		scopeId: nr,
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
		ctx: tr
	};
	return s ? (_a(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= ce(n) ? 8 : 16), aa > 0 && !o && ra && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ra.push(c), c;
}
var U = fa;
function fa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === qr) && (e = ea), ca(e)) {
		let r = ma(e, t, !0);
		return n && _a(r, n), aa > 0 && !a && ra && (r.shapeFlag & 6 ? ra[ra.indexOf(e)] = r : ra.push(r)), r.patchFlag = -2, r;
	}
	if (Ba(e) && (e = e.__vccOpts), t) {
		t = pa(t);
		let { class: e, style: n } = t;
		e && !ce(e) && (t.class = A(e)), k(n) && (/* @__PURE__ */ mn(n) && !D(n) && (n = T({}, n)), t.style = je(n));
	}
	let o = ce(e) ? 1 : Zi(e) ? 128 : mr(e) ? 64 : k(e) ? 4 : O(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function pa(e) {
	return e ? /* @__PURE__ */ mn(e) || Ti(e) ? T({}, e) : e : null;
}
function ma(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? va(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ua(l),
		ref: t && t.ref ? n && a ? D(a) ? a.concat(da(t)) : [a, da(t)] : da(t) : a,
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
		ssContent: e.ssContent && ma(e.ssContent),
		ssFallback: e.ssFallback && ma(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Dr(u, c.clone(u)), u;
}
function W(e = " ", t = 0) {
	return U($i, null, e, t);
}
function G(e = "", t = !1) {
	return t ? (z(), V(ea, null, e)) : U(ea, null, e);
}
function ha(e) {
	return e == null || typeof e == "boolean" ? U(ea) : D(e) ? U(R, null, e.slice()) : ca(e) ? ga(e) : U($i, null, String(e));
}
function ga(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ma(e);
}
function _a(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (D(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), _a(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ti(t) ? t._ctx = tr : r === 3 && tr && (tr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (O(t)) {
		if (r & 65) {
			_a(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: tr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [W(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function va(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = je([t.style, r.style]);
		else if (w(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(D(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !te(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ya(e, t, n, r = null) {
	Pn(e, t, 7, [n, r]);
}
var ba = oi(), xa = 0;
function Sa() {
	return xa;
}
function Ca(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || ba, a = {
		uid: xa++,
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
		scope: new Je(!0),
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
		propsOptions: Ai(r, i),
		emitsOptions: pi(r, i),
		emit: null,
		emitted: null,
		propsDefaults: x,
		inheritAttrs: r.inheritAttrs,
		ctx: x,
		data: x,
		props: x,
		attrs: x,
		slots: x,
		refs: x,
		setupState: x,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = fi.bind(null, a), e.ce && e.ce(a), a;
}
var wa = null, Ta = () => wa || tr, Ea, Da;
{
	let e = Ae(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ea = t("__VUE_INSTANCE_SETTERS__", (e) => wa = e), Da = t("__VUE_SSR_SETTERS__", (e) => ja = e);
}
var Oa = (e) => {
	let t = wa;
	return Ea(e), e.scope.on(), () => {
		e.scope.off(), Ea(t);
	};
}, ka = () => {
	wa && wa.scope.off(), Ea(null);
};
function Aa(e) {
	return e.vnode.shapeFlag & 4;
}
var ja = !1;
function Ma(e, t = !1, n = !1) {
	t && Da(t);
	let { props: r, children: i } = e.vnode, a = Aa(e);
	Ei(e, r, a, t), Ri(e, i, n || t);
	let o = a ? Na(e, t) : void 0;
	return t && Da(!1), o;
}
function Na(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ri);
	let { setup: r } = n;
	if (r) {
		pt();
		let n = e.setupContext = r.length > 1 ? La(e) : null, i = Oa(e), a = Nn(r, e, 0, [e.props, n]), o = ue(a);
		if (mt(), i(), (o || e.sp) && !Fr(e) && Ar(e), o) {
			if (a.then(ka, ka), t) return a.then((n) => {
				Da(!0);
				try {
					Pa(e, n, t);
				} finally {
					Da(!1);
				}
			}).catch((t) => {
				Fn(t, e, 0);
			});
			e.asyncDep = a;
		} else Pa(e, a, t);
	} else Fa(e, t);
}
function Pa(e, t, n) {
	O(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = Sn(t)), Fa(e, n);
}
function Fa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || C;
}
var Ia = { get(e, t) {
	return wt(e, "get", ""), e[t];
} };
function La(e) {
	return {
		attrs: new Proxy(e.attrs, Ia),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ra(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Sn(hn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ti) return ti[n](e);
		},
		has(e, t) {
			return t in e || t in ti;
		}
	}) : e.proxy;
}
function za(e, t = !0) {
	return O(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ba(e) {
	return O(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ En(e, t, ja);
function Va(e, t, n) {
	try {
		oa(-1);
		let r = arguments.length;
		return r === 2 ? k(t) && !D(t) ? ca(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ca(n) && (n = [n]), U(e, t, n));
	} finally {
		oa(1);
	}
}
var Ha = "3.5.44", Ua = void 0, Wa = typeof window < "u" && window.trustedTypes;
if (Wa) try {
	Ua = /* @__PURE__ */ Wa.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ga = Ua ? (e) => Ua.createHTML(e) : (e) => e, Ka = "http://www.w3.org/2000/svg", qa = "http://www.w3.org/1998/Math/MathML", Ja = typeof document < "u" ? document : null, Ya = Ja && /* @__PURE__ */ Ja.createElement("template"), Xa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ja.createElementNS(Ka, e) : t === "mathml" ? Ja.createElementNS(qa, e) : n ? Ja.createElement(e, { is: n }) : Ja.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ja.createTextNode(e),
	createComment: (e) => Ja.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ja.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ya.innerHTML = Ga(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ya.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Za = "transition", Qa = "animation", $a = /* @__PURE__ */ Symbol("_vtc"), eo = {
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
}, to = /* @__PURE__ */ T({}, yr, eo), no = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = to, e))((e, { slots: t }) => Va(Sr, ao(e), t)), ro = (e, t = []) => {
	D(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, io = (e) => e ? D(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function ao(e) {
	let t = {};
	for (let n in e) n in eo || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = oo(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: C = v, onAppearCancelled: ee = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, lo(e, t ? u : s), lo(e, t ? l : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, lo(e, d), lo(e, p), lo(e, f), t && t();
	}, ne = (e) => (t, n) => {
		let i = e ? C : v, o = () => w(t, e, n);
		ro(i, [t, o]), uo(() => {
			lo(t, e ? c : a), co(t, e ? u : s), io(i) || po(t, r, h, o);
		});
	};
	return T(t, {
		onBeforeEnter(e) {
			ro(_, [e]), co(e, a), co(e, o);
		},
		onBeforeAppear(e) {
			ro(S, [e]), co(e, c), co(e, l);
		},
		onEnter: ne(!1),
		onAppear: ne(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			co(e, d), e._enterCancelled ? (co(e, f), _o(e)) : (_o(e), co(e, f)), uo(() => {
				e._isLeaving && (lo(e, d), co(e, p), io(b) || po(e, r, g, n));
			}), ro(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), ro(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), ro(ee, [e]);
		},
		onLeaveCancelled(e) {
			te(e), ro(x, [e]);
		}
	});
}
function oo(e) {
	if (e == null) return null;
	if (k(e)) return [so(e.enter), so(e.leave)];
	{
		let t = so(e);
		return [t, t];
	}
}
function so(e) {
	return Oe(e);
}
function co(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[$a] || (e[$a] = /* @__PURE__ */ new Set())).add(t);
}
function lo(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[$a];
	n && (n.delete(t), n.size || (e[$a] = void 0));
}
function uo(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var fo = 0;
function po(e, t, n, r) {
	let i = e._endId = ++fo, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = mo(e, t);
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
function mo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Za}Delay`), a = r(`${Za}Duration`), o = ho(i, a), s = r(`${Qa}Delay`), c = r(`${Qa}Duration`), l = ho(s, c), u = null, d = 0, f = 0;
	t === Za ? o > 0 && (u = Za, d = o, f = a.length) : t === Qa ? l > 0 && (u = Qa, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Za : Qa : null, f = u ? u === Za ? a.length : c.length : 0);
	let p = u === Za && /\b(?:transform|all)(?:,|$)/.test(r(`${Za}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function ho(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => go(t) + go(e[n])));
}
function go(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function _o(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function vo(e, t, n) {
	let r = e[$a];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var yo = /* @__PURE__ */ Symbol("_vod"), bo = /* @__PURE__ */ Symbol("_vsh"), xo = /* @__PURE__ */ Symbol(""), So = /(?:^|;)\s*display\s*:/;
function Co(e, t, n) {
	let r = e.style, i = ce(n), a = !1;
	if (n && !i) {
		if (t) {
			if (ce(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? To(r, t, "");
			}
			else for (let e in t) n[e] ?? To(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? To(r, i, "") : ko(e, i, !ce(t) && t ? t[i] : void 0, o) || To(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[xo];
			e && (n += ";" + e), r.cssText = n, a = So.test(n);
		}
	} else t && e.removeAttribute("style");
	yo in e && ((!i || t !== n) && (e[yo] = a ? r.display : ""), e[bo] && (r.display = "none"));
}
var wo = /\s*!important$/;
function To(e, t, n) {
	if (D(n)) n.forEach((n) => To(e, t, n));
	else if (n ??= "", t.startsWith("--")) wo.test(n) ? e.setProperty(t, n.replace(wo, ""), "important") : e.setProperty(t, n);
	else {
		let r = Oo(e, t);
		wo.test(n) ? e.setProperty(xe(r), n.replace(wo, ""), "important") : e[r] = n;
	}
}
var Eo = [
	"Webkit",
	"Moz",
	"ms"
], Do = {};
function Oo(e, t) {
	let n = Do[t];
	if (n) return n;
	let r = ye(t);
	if (r !== "filter" && r in e) return Do[t] = r;
	r = Se(r);
	for (let n = 0; n < Eo.length; n++) {
		let i = Eo[n] + r;
		if (i in e) return Do[t] = i;
	}
	return t;
}
function ko(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ce(r) && n === r;
}
var Ao = "http://www.w3.org/1999/xlink";
function jo(e, t, n, r, i, a = Ie(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ao, t.slice(6, t.length)) : e.setAttributeNS(Ao, t, n) : n == null || a && !Le(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : le(n) ? String(n) : n);
}
function Mo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ga(n) : n);
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
		r === "boolean" ? n = Le(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function No(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Po(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Fo = /* @__PURE__ */ Symbol("_vei");
function Io(e, t, n, r, i = null) {
	let a = e[Fo] || (e[Fo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = zo(t);
		r ? No(e, n, a[t] = Uo(r, i), s) : o && (Po(e, n, o, s), a[t] = void 0);
	}
}
var Lo = /(Once|Passive|Capture)$/, Ro = /^on:?(?:Once|Passive|Capture)$/;
function zo(e) {
	let t, n;
	for (; (n = e.match(Lo)) && !Ro.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : xe(e.slice(2)), t];
}
var Bo = 0, Vo = /* @__PURE__ */ Promise.resolve(), Ho = () => Bo ||= (Vo.then(() => Bo = 0), Date.now());
function Uo(e, t) {
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
				e && Pn(e, t, 5, a);
			}
		} else Pn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ho(), n;
}
var Wo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Go = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? vo(e, r, o) : t === "style" ? Co(e, n, r) : w(t) ? te(t) || Io(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Ko(e, t, r, o)) ? (Mo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && jo(e, t, r, o, a, t !== "value")) : e._isVueCE && (qo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !ce(r))) ? Mo(e, ye(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), jo(e, t, r, o));
};
function Ko(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Wo(t) && O(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Wo(t) && ce(n) ? !1 : t in e;
}
function qo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ye(t);
	return Array.isArray(n) ? n.some((e) => ye(e) === r) : Object.keys(n).some((e) => ye(e) === r);
}
var Jo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return D(t) ? (e) => Te(t, e) : t;
};
function Yo(e) {
	e.target.composing = !0;
}
function Xo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Zo = /* @__PURE__ */ Symbol("_assign"), Qo = /* @__PURE__ */ Symbol("_initialValue");
function $o(e, t, n) {
	return t && (e = e.trim()), n && (e = De(e)), e;
}
var es = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Qo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Qo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Zo] = Jo(i);
		let a = r || i.props && i.props.type === "number";
		No(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Zo]($o(e.value, n, a));
		}), (n || a) && No(e, "change", () => {
			e.value = $o(e.value, n, a);
		}), t || (No(e, "compositionstart", Yo), No(e, "compositionend", Xo), No(e, "change", Xo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Qo];
		delete e[Qo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Zo]($o(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Zo] = Jo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? De(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ts = {
	deep: !0,
	created(e, t, n) {
		e[Zo] = Jo(n), No(e, "change", () => {
			let t = e._modelValue, n = os(e), r = e.checked, i = e[Zo];
			if (D(t)) {
				let e = Ue(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ae(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(ss(e, r));
		});
	},
	mounted: ns,
	beforeUpdate(e, t, n) {
		e[Zo] = Jo(n), ns(e, t, n);
	}
};
function ns(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (D(t)) i = Ue(t, r.props.value) > -1;
	else if (ae(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = He(t, ss(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var rs = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, No(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? De(os(e)) : os(e)), r = e.multiple, i = r ? ae(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? D(i) ? t.slice() : t : i];
			try {
				e[Zo](i);
			} finally {
				Wn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Zo] = Jo(r);
	},
	mounted(e, { value: t }) {
		as(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Zo] = Jo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !is(t, n[1], n[0])) && as(e, t);
	}
};
function is(e, t, n) {
	if (!n || D(e)) return He(e, t);
	if (ae(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function as(e, t) {
	let n = e.multiple, r = D(t);
	if (!n || r || ae(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = os(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Ue(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (He(os(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function os(e) {
	return "_value" in e ? e._value : e.value;
}
function ss(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var cs = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ls = {
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
	exact: (e, t) => cs.some((n) => e[`${n}Key`] && !t.includes(n))
}, us = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ls[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ds = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, fs = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = xe(n.key);
		if (t.some((e) => e === r || ds[e] === r)) return e(n);
	}));
}, ps = /* @__PURE__ */ T({ patchProp: Go }, Xa), ms;
function hs() {
	return ms ||= Vi(ps);
}
var gs = ((...e) => {
	let t = hs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = vs(e);
		if (!r) return;
		let i = t._component;
		!O(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, _s(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function _s(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function vs(e) {
	return ce(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var ys = () => ({
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
}), bs = null;
function q() {
	if (bs) return bs;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = ys();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return bs = /* @__PURE__ */ sn(n), bs;
}
var J = () => e().saveSettingsDebounced(), xs = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], Ss = [
	"auto",
	"on",
	"off"
], Cs = [
	"off",
	"vertex",
	"aistudio"
], ws = ["annotations"], Ts = (e) => ws.includes(e.kind), Es = [
	"keep",
	"truncate",
	"remove"
], Ds = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Os = [
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
function ks(e) {
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
			if (i >= e.length) throw new Ds("Unterminated string", e, n);
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
		let i = Os.find((t) => e.startsWith(t, n));
		if (!i) throw new Ds(`Unexpected character '${r}'`, e, n);
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
var As = {
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
function js(e) {
	let t = ks(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Ds(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in As ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new Ds(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Ds("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = As[n];
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
	if (u.k !== "end") throw new Ds("Unexpected token", e, u.pos);
	return l;
}
function Ms(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function Ns(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function Ps(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => Ps(e, t));
		case "var": return t(e.path);
		case "not": return !Ns(Ps(e.e, t));
		case "bin": {
			if (e.op === "&&") return Ns(Ps(e.l, t)) && Ns(Ps(e.r, t));
			if (e.op === "||") return Ns(Ps(e.l, t)) || Ns(Ps(e.r, t));
			let n = Ps(e.l, t), r = Ps(e.r, t);
			switch (e.op) {
				case "==": return Ms(n, r);
				case "!=": return !Ms(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Ms(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function Fs(e, t) {
	return !e || Ns(Ps(e, t));
}
function Is(...e) {
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
var Ls = /\{\{ap::([^{}]*?)\}\}/g;
function Rs(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Ls, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Rs(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function zs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Bs(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function Vs(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Bs(n[3] ?? n[4] ?? "");
	return t;
}
function Hs(e, t) {
	let n = [], r = RegExp(`<${zs(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: Vs(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: Vs(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Us(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Ws(e, t) {
	let n = Hs(e, t)[0];
	return n ? Bs(n.inner).trim() : void 0;
}
function Gs(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Ks(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
var qs = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Js = {
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
}, Ys = ["name", "previous_main"], Xs = {
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
}, Zs = {
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
	status: qs,
	storyline: Ys,
	custom: [],
	annotations: []
};
function Qs(e, t = (e) => e) {
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
			properties: Object.fromEntries(qs.map((e) => [e, i(e)])),
			required: [...qs],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? Ys).filter((e) => Ys.includes(e));
			return a({
				type: "object",
				properties: Object.fromEntries(t.map((e) => [e, i(e)])),
				required: t,
				additionalProperties: !1
			});
		}
		case "annotations": return a({ type: "string" });
		case "custom": return e.shape === "kv" ? a({
			type: "object",
			additionalProperties: { type: "string" }
		}) : a({ type: "string" });
	}
}
function $s(e) {
	return e === "memory" || e === "recap";
}
function ec(e) {
	let t = {};
	for (let n of qs) t[n] = rc(Js[n].map(e).find((e) => e != null)).trim();
	return t;
}
function tc(e) {
	let t = {};
	for (let n of Ys) t[n] = rc(Xs[n].map(e).find((e) => e != null)).trim();
	return t;
}
function nc(e) {
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
var rc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function ic(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations": return;
		case "reply":
		case "impersonate": return rc(t).trim() || void 0;
		case "recap": return t === null ? null : rc(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = rc(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : rc(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: rc(e.time),
				location: rc(e.location),
				event: rc(e.event),
				summary: rc(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : ec((e) => t[e]);
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
			let e = tc((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: rc(e.label ?? e.title).trim(),
			content: rc(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, rc(t)]));
			}
			return rc(t).trim() || void 0;
	}
}
function ac(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations": return;
		case "reply":
		case "impersonate": return ic(e.kind, Bs(n.inner));
		case "recap": return ic("recap", Bs(n.inner));
		case "memory": return ic("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Ws(e.inner, "scope"),
			operation: Ws(e.inner, "operation"),
			key: Ws(e.inner, "key"),
			content: Ws(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Ws(n.inner, "time") ?? "",
			location: Ws(n.inner, "location") ?? "",
			event: Ws(n.inner, "event") ?? "",
			summary: Ws(n.inner, "summary") ?? ""
		};
		case "status": return ec((e) => Ws(n.inner, e));
		case "storyline": {
			let e = tc((e) => Ws(n.inner, e));
			return !e.name && !e.previous_main && !/<[A-Za-z_]/.test(n.inner) && (e.name = Bs(n.inner).trim()), e.name || e.previous_main ? e : void 0;
		}
		case "options": return Hs(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Bs(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Bs(t[2]).trim();
				return e;
			}
			return ic("custom", Bs(n.inner), e);
	}
}
function oc(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (Ts(a)) continue;
		let t = Hs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = ac(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Us(e, i),
		values: n,
		open: r
	};
}
function sc(e) {
	return Bs(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var cc = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function lc(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function uc(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function dc(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function fc(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return cc(e, { n: String(t).padStart(i, "0") }) + r;
}
function pc(e, t, n, r, i) {
	let a = n.filter((e) => !Ts(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: lc(e, t)
		},
		rank: 0,
		index: n
	})), s = dc(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = uc(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? fc(u, t + 1, d, n) : n;
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
			return u && n && g(e).length ? fc(u, n.position, d, t) : t;
		}
	};
}
function mc(e, t) {
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
var hc = {
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
}, gc = (e) => e;
function _c(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function vc(e, t) {
	return e.stages.filter((e) => Fs(e.when, t));
}
function yc(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function bc(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function xc(e, t, n = hc) {
	return _c(t.field?.name ?? n.turn.field, bc(e, t));
}
function Sc(e, t, n = hc) {
	return _c(t.tool?.name ?? n.stage.name, bc(e, t));
}
function Cc(e, t = hc) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var wc = (e, t) => t ? {
	...e,
	description: t
} : e;
function Tc(e = hc, t = gc, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return wc({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: wc({ type: "string" }, i(r.old)),
				new_string: wc({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function Ec(e, t, n = hc, r = gc) {
	return e.kind === "patch" ? Tc(n, r, t) : wc({ type: "string" }, t);
}
function Dc(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function Oc(e, t, n, r, i = gc) {
	let a = r.filter((e) => !Ts(e)), o = (e, t) => {
		if (e) return i(t ? _c(e, bc(n, t)) : e).trim() || void 0;
	}, s = pc(t, n, a, e, (t) => xc(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => Sc(n, t, e), d = (t) => s.stageParam(t, Cc(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = Qs(mc(n, r), i), $s(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = Ec(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = Cc(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = Ec(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), Dc(u(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => Dc(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: wc({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: wc(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function kc(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function Ac(e) {
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
function jc(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = Ac(e);
		return t ? [t] : [];
	});
}
function Mc(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Nc(e) {
	let t = jc(e);
	return t.length ? Mc(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function Pc(e) {
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
function Fc(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Gs(t.content)).trimEnd());
}
function Ic(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Lc(e) {
	return e.map((e) => ({
		old_string: Ws(e, "old_string") ?? "",
		new_string: Ws(e, "new_string") ?? ""
	}));
}
function Rc(e, t) {
	let n = Pc(t.stages), r = Ks(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${zs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = oc(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Hs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Lc(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Bs(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Us(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = yc(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: zs(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Fc(t.stages, n, t.final), Ic(t.stages, n, t.final), n;
}
function zc(e, t) {
	let n = Pc(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => xc(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Bc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (Ts(e)) continue;
		let r = c(e), i = ic(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = yc(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Fc(t.stages, n, t.final), Ic(t.stages, n, t.final), n;
}
function Bc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Vc(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Hc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Vc(e, n);
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
	let i = n.trim().split(/\s+/).map(zs), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function Uc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Hc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Wc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(zs(t), "gi"), a = [], o;
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
var Gc = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Kc = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, qc = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Jc(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Yc[e]);
}
var Yc = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Xc(e) {
	return e.split(Kc).filter((e) => e !== "");
}
var Zc = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Qc(e) {
	let t = Xc(Zc(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !qc.has(n)) throw new Gc(`Could not find matching close tag for "${e}".`, a);
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
var $c = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, el = (e, t) => {
	throw new Gc(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, tl = /* @__PURE__ */ new Map(), nl = 500;
function rl(e) {
	let t = tl.get(e);
	if (t) return t;
	let n = Qc(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Gc(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Jc, $c, el);
	return tl.size >= nl && tl.clear(), tl.set(e, i), i;
}
function il(e, t) {
	return rl(e)(t);
}
function al(e) {
	try {
		return rl(e), null;
	} catch (e) {
		return e instanceof Gc ? e : new Gc(String(e));
	}
}
function ol(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) ol(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var sl = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, cl = /^\s*(```|~~~)/;
function ll(e) {
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
var ul = /<!--[ \t]*#/g, dl = /<!--|-->/g;
function fl(e, t, n) {
	dl.lastIndex = t;
	for (let t = dl.exec(e); t; t = dl.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function pl(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(sl)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(sl, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...ll(o),
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
			let t = fl(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? ml(e, t) : t;
		} else if (cl.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		ul.lastIndex = u;
		for (let t = ul.exec(e); t; t = ul.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = fl(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? ml(e, r) : r, ul.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function ml(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var hl = [
	"system",
	"user",
	"assistant"
], gl = ["dialogue", "imperative"];
function _l(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Is(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = al(e.text);
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
				hl.includes(n) || t(`@as expects one of ${hl.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: hl.includes(n) ? n : void 0,
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
				if (!n || !gl.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: js(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = js(e.raw);
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
function vl(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = pl(e, [], 1, r), a = _l(i.tokens, r);
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
function yl(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => Fs(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var bl = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function xl(e) {
	let t = e.entries.flatMap((e) => bl(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => bl(e));
		t.push(...bl(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...bl(vl(n.text, n.role).content));
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
function Sl(e) {
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
function Cl(e, t) {
	let n = Sl(e), r = Sl(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function wl(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = Sl(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = Cl(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var Tl = (e) => !!e && typeof e == "object" && !Array.isArray(e), El = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	openAiSignatures: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
};
function Dl(e) {
	let t = e.sendThoughtSignature;
	return t === !0 ? "vertex" : typeof t == "string" && Cs.includes(t) ? t : "off";
}
function Ol(e, t) {
	let n = e.thoughtSignature;
	if (t !== "off" && n) return typeof n == "string" ? t === "vertex" ? n : void 0 : n[t] || void 0;
}
var kl = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function Al(e, ...t) {
	let n = Y(e);
	for (let e of t) n = jl(n, e);
	return n;
}
function jl(e, t) {
	if (t === void 0) return e;
	if (!Tl(e) || !Tl(t)) return Y(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = jl(e[r], i);
	return n;
}
function Ml(e, t) {
	if (Tl(e) && Tl(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Ml(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : Y(e);
}
function Nl(e, t, n = "", r = [], i = Pl) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? Tl(e[a]) && Tl(t[a]) && (Nl(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var Pl = /* @__PURE__ */ new Set(["sampling"]);
function Fl(e, t, n) {
	let r = Y(e);
	for (let e of t) if (wl(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && Tl(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Il(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
function Ll(e, t, n) {
	return Al(e.configurationDefaults, Il(e, t)?.diff, n);
}
//#endregion
//#region packages/protocol/src/params.ts
function Rl(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function zl(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function Bl(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? Rl(n) : Array.isArray(e.default) ? Rl(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function Vl(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Hl(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, Bl(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Ul(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Wl(e, t, n) {
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
function Gl(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Ul(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Wl(r[t.var], t, e));
	}
	return r;
}
var Kl = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function ql(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Kl.test(e);
}
function Jl(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return ql(e) ? e : JSON.stringify(e);
}
var Yl = (e) => !e.includes("\n") && ql(e) ? e : JSON.stringify(e);
function Xl(e) {
	return e.map((e) => `- ${Jl(e, "  ")}`).join("\n");
}
function Zl(e) {
	return [...e].map(([e, t]) => `${Yl(e)}: ${Jl(t, "  ")}`).join("\n");
}
function Ql(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Xl(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Zl(e) : t === "keys" ? Xl([...e.keys()]) : t === "values" ? Xl([...e.values()]) : e.get(t) ?? "";
}
function $l(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var eu = [
	"all",
	"if",
	"off"
], tu = {
	enabled: !0,
	freezeVariables: "all"
}, nu = (e) => eu.includes(e?.freezeVariables) ? e.freezeVariables : tu.freezeVariables, ru = (e, t) => e === "all" ? !t.main : e === "if" && t.if, iu = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1,
	frozen: !1
}, au = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u, ou = (e) => /^[^\s#!?@][^\s#]*$/u.test(e) && !/^if\?$/iu.test(e) && [...e].length <= 64;
function su(e) {
	let t = au.exec(e);
	if (!t) return null;
	let n = t[2], r = /^if\?$/iu.test(n), i = n === "" ? "recent" : n === "?" || r ? "new" : "name";
	if (i === "name" && !ou(n)) return null;
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
function cu(e) {
	return su(e)?.text ?? e;
}
function lu(e, t, n = !1) {
	let r = cu(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function uu(e, t, n) {
	return n ? `${e.slice(0, t.at)}#${t.switchMain ? "!" : t.hide ? "@" : ""}${n}` : t.text;
}
function du(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?@\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return ou(n) ? n : "";
}
function fu(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function pu(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var mu = (e) => /^if/i.test(e);
function hu(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function gu(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function _u(e, t) {
	return !!e.groups[t]?.allowNone;
}
function vu(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || _u(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Fs(e.when, n)) : i;
}
function yu(e, t) {
	let n = new Set(vu(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function bu(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = pu(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => e.kind === "storyline" ? i.length ? [{
		...e,
		requested: i
	}] : [] : [e]);
}
function xu(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Su(e, t, n, r) {
	return t && e.tools ? pc(t, n, r, e.tools, (t) => xc(n, t, e.tools)) : void 0;
}
function Cu(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? Su(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = Bl(n, o.params[e]);
		if (Vl(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Rs(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return Ql(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return xu(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${xu(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : kc(t, (e) => xu(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			case "storyline": return i === "main" ? c.storyline?.main ?? "" : c.storyline?.name ?? s.storyline?.name ?? "";
			default: return;
		}
	};
	return g;
}
function wu(e, t, n, r, i) {
	return ol({
		...Y(e),
		vars: Y($l(t)),
		sampling: Y(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function Tu(e, t, n) {
	return (r) => {
		try {
			return il(r.text, e());
		} catch (e) {
			let i = e instanceof Gc ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function Eu(e, t) {
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
function Du(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? Su(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? Sc(n, t, e.tools) : c?.stageField(t) ?? xc(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", xu(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function Ou(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = gu(i), s = a ? vc(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = gu(i), l = vu(n, r, c), u = bu(n, l, i), d = Gl(n.vars, l), f = Cu({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Rs(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= wu(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Fs(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...yl(e.content, c, p, Tu(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = Du(n, a, s, i.style, i.transport, r, u);
		for (let n of yl(t, c, p, Tu(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = Eu(e, v.get(e.id) ?? []));
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
function ku(e, t, n = {}) {
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
		modules: yu(e, t),
		params: Hl(e, t),
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
		storyline: { ...iu },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var Au = /* @__PURE__ */ new Set([
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
]), ju = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Mu = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Nu = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Pu(e, t = {}) {
	let n = (e) => Pu(e, t);
	if (!Nu(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Nu(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => ju.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Nu), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Fu({
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
		return Fu({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Au.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Nu(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Mu[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Nu(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Fu({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Fu(i, a);
}
function Fu(e, t) {
	return t && (e.nullable = !0), e;
}
function Iu(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Nu(n)) return e;
		let r = Nu(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Pu(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/tavern-helper.ts
var Lu = "tavern_helper";
function Ru(e) {
	return e.flatMap((e) => e.type === "folder" ? [e.id, ...e.scripts.map((e) => e.id)] : [e.id]);
}
//#endregion
//#region packages/protocol/src/preset-file.ts
var zu = "1.10.0", Bu = "advanced_preset_file", Vu = [
	"https://github.com/mirrorange/advanced-preset",
	"https://gitlab.com/mirrorange/advanced-preset",
	"https://codeberg.org/mirrorange/advanced-preset"
], Hu = (e) => typeof e == "string" && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(e.trim()), Uu = "ap_install_notice", Wu = "⟦ap:install-notice⟧", Gu = "6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3", Ku = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function qu(e) {
	let t = Ku(e) && Ku(e.extensions) ? e.extensions[Bu] : void 0;
	return Ku(t) && Ku(t.artifact) ? {
		format: t.format,
		artifact: t.artifact
	} : void 0;
}
function Ju(e) {
	return qu(e)?.artifact ?? e;
}
function Yu(e) {
	let t = e.minAdvancedPreset;
	return t && Cl(t, "1.10.0") > 0 ? t : zu;
}
var Xu = (e) => typeof e == "string" && e.includes("⟦ap:region:");
function Zu(e) {
	return `${Wu}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${e.name}" ${e.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${Vu.map((e) => `   - ${e}`).join("\n")}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}
function Qu(e) {
	return {
		type: "script",
		enabled: !0,
		name: "Advanced Preset Installer",
		id: Gu,
		content: ed(e.name, Yu(e)),
		info: `This preset ("${e.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${Vu.join("\n")}\nIt does nothing once Advanced Preset ${Yu(e)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${Yu(e)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
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
function $u(e, t = {}) {
	let n = e.carrier.prompts.map((e) => ({ ...e })), r = new Set(n.filter((e) => Xu(e.content)).map((e) => e.identifier));
	n.push({
		identifier: Uu,
		name: "Advanced Preset · install notice",
		role: "system",
		content: Zu(e),
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
		identifier: Uu,
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
			...t.installer === !1 ? {} : { [Lu]: {
				scripts: [Qu(e)],
				variables: {}
			} },
			[Bu]: a
		}
	};
}
function ed(e, t) {
	let n = (e) => JSON.stringify(e).replace(/</g, "\\u003c");
	return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${t} or newer is running.
const PRESET = ${n(e)};
const REQUIRED = ${n(t)};
const MIRRORS = ${n(Vu)};
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
var td = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function nd(e) {
	let t = e.configurationDefaults?.connection;
	return !td(t) || Object.keys(El).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...El,
				...t
			}
		}
	};
}
function rd(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!td(t) || "userInput" in t) && (!td(n) || "userInput" in n)) return e;
	let r = td(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: td(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: td(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function id(e) {
	let t = e.configurationDefaults;
	if (!td(t)) return e;
	let n = t.cache;
	return td(n) && Object.keys(kl).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...kl,
				...td(n) ? n : {}
			}
		}
	};
}
function ad(e) {
	let t = e.configurationDefaults;
	if (!td(t)) return e;
	let n = t.meta;
	return td(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...td(n) ? n : {}
			}
		}
	};
}
function od(e) {
	let t = e.configurationDefaults;
	if (!td(e.storylines) || !td(t)) return e;
	let n = t.storylines;
	return td(n) && Object.keys(tu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...tu,
				...td(n) ? n : {}
			}
		}
	};
}
function sd(e) {
	let t = od(ad(id(rd(nd(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function cd(e) {
	let t = Ju(e);
	return !td(t) || typeof t.id != "string" || !Array.isArray(t.entries) ? null : t.formatVersion === 3 ? sd(t) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var ld = (e) => typeof e == "string" || e.enabled !== !1, ud = (e) => typeof e == "string" ? e : e.text;
function dd(e, t) {
	t ? delete e.enabled : e.enabled = !1;
}
function fd(e, t) {
	return t ? e : {
		text: e,
		enabled: !1
	};
}
var pd = "user-", md = "advanced-preset.user-modules", hd = (e) => `${pd}${e}`;
function gd() {
	return {
		match: "all",
		rules: []
	};
}
var _d = ["on", "off"];
function vd(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? _d.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function yd(e) {
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
function bd(e, t) {
	let n = yd(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var xd = (e) => ({
	t: "lit",
	v: e
});
function Sd(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(xd)
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
			r: xd(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function Cd(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(vd).map((e) => {
		if (e.kind === "keyword") return xd(bd(e, t));
		if (e.kind === "var") return Sd(e);
		try {
			return js(e.source);
		} catch {
			return xd(!1);
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
function wd(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return js(e.source), null;
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
function Td(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function Ed(e, t) {
	return t.entries.filter((t) => !Td(e, t.point));
}
function Dd(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function Od(e, t) {
	return (t.vars ?? []).filter((t) => Dd(e, t.var)?.type !== t.type);
}
function kd(e, t) {
	return [.../* @__PURE__ */ new Set([...Ed(e, t).map((e) => e.point), ...Od(e, t).map((e) => e.var)])];
}
function Ad(e) {
	if (!ld(e)) return null;
	switch (e.type) {
		case "string": return e.text.trim() ? {
			var: e.var,
			type: "string",
			text: e.text
		} : null;
		case "list": {
			let t = e.items.filter(ld).map(ud).filter((e) => e.trim());
			return t.length ? {
				var: e.var,
				type: "list",
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => ld(e) && e.key.trim()).map((e) => ({
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
function jd(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Md(e, t, n) {
	let r = t.filter((e) => e.enabled).map((e) => ({
		...e,
		entries: e.entries.filter(ld),
		vars: (e.vars ?? []).filter(ld)
	})).filter((e) => e.entries.length || e.vars.length);
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = hd(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: Cd(t.trigger, n),
			structures: [],
			vars: t.vars.filter((t) => Dd(e, t.var)?.type === t.type).map(Ad).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = Td(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && jd(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: vl(n.text, n.role).content
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
function Nd(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => bl(vl(e.text, e.role).content)));
}
function Pd(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Fd(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Id(e, t, n) {
	let r = t.filter((e) => wl(n, e.from));
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
				path: Pd(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Fd(t.source, e)
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
var Ld = (e) => !!e && typeof e == "object" && !Array.isArray(e), Rd = (e, t = "") => typeof e == "string" ? e : t, zd = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Bd = [
	"system",
	"user",
	"assistant"
], Vd = [
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
function Hd(e) {
	if (!Ld(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Rd(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Vd.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(zd) : zd(e.value) && (t.value = e.value), t;
	}
	return null;
}
var Ud = (e) => e.enabled === !1 ? { enabled: !1 } : {};
function Wd(e) {
	return typeof e == "string" ? [e] : Ld(e) && typeof e.text == "string" ? [e.enabled === !1 ? {
		text: e.text,
		enabled: !1
	} : e.text] : [];
}
function Gd(e) {
	if (!Ld(e) || typeof e.var != "string") return [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Rd(e.text),
		...Ud(e)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: Array.isArray(e.items) ? e.items.flatMap(Wd) : [],
		...Ud(e)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Ld).map((e) => ({
			key: Rd(e.key),
			value: typeof e.value == "string" ? e.value : null,
			...Ud(e)
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t,
			...Ud(e)
		}];
	}
	return [];
}
function Kd(e) {
	if (!Ld(e) || !Array.isArray(e.entries)) return null;
	let t = Ld(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Ld(e)) return [];
		let n = {
			id: Rd(e.id) || `e${t + 1}`,
			point: Rd(e.point),
			text: Rd(e.text)
		};
		return Bd.includes(e.role) && (n.role = e.role), e.enabled === !1 && (n.enabled = !1), [n];
	});
	return {
		id: Rd(e.id),
		name: Rd(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Gd) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Hd).filter((e) => !!e) : []
		}
	};
}
function qd(e, t) {
	return {
		format: md,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function Jd(e) {
	if (Ld(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Kd).filter((e) => !!e);
		return {
			preset: Ld(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Rd(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Kd(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var Yd = "{==", Xd = "==}", Zd = "{>>", Qd = "<<}", $d = /\n[ \t]*\n/g;
function ef(e, t) {
	$d.lastIndex = t;
	let n = $d.exec(e);
	return n ? n.index : Infinity;
}
function tf(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function nf(e, t, n, r) {
	let i = ef(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function rf(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(Yd, o)) {
		let t = o + 3, s = nf(e, t, Xd, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - tf(n, [Xd]));
			break;
		}
		if (s < 0) {
			let n = Math.min(ef(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || Zd.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(Zd, l)) {
			let t = l + 3, s = nf(e, t, Qd, n);
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
	} else if (e.startsWith(Zd, o)) {
		let t = o + 3, i = nf(e, t, Qd, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += Zd, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (Yd.startsWith(t) || Zd.startsWith(t))) break scan;
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
function af(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function of(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function sf(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = af(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + of(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function cf(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = sf(e, t);
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
function lf(e, t) {
	let n = cf(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${Yd}${t.quote}${Xd}${Zd}${t.comment}${Qd}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function uf(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function df(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function ff(e, t, n) {
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
function pf(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...Y(e)
		})),
		vars: Y(e.vars ?? []),
		trigger: e.trigger ? Y(e.trigger) : gd()
	};
}
function mf(e) {
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
function hf(e) {
	if (Array.isArray(e)) return e.map(hf);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = hf(e[n]));
		return t;
	}
	return e;
}
function gf(e) {
	return JSON.stringify(hf({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text,
			...e.enabled === !1 ? { enabled: !1 } : {}
		})),
		vars: (e.vars ?? []).flatMap(Gd),
		trigger: e.trigger ?? gd()
	}));
}
function _f(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, gf(e.locales[t])]);
	return JSON.stringify([
		gf(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function vf(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var yf = "[{{time}} · {{location}}] {{event}}: {{summary}}", bf = (e) => e === "synopsis" ? yf : "{{value}}", xf = "{{content}}";
function Sf(e) {
	let t = e.indexOf(xf);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(xf, "");
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
function Cf(e) {
	let t = e.history;
	if (t === void 0 || Ts(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: Sf(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? bf(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var wf = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, Tf = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function Ef(e) {
	let t = e?.stages ?? [], n = Tf(t);
	return n >= 0 ? lc(e, t[n]) : 0;
}
function Df(e, t, n) {
	let r = e?.stages ?? [], i = (t) => lc(e, t), a = Tf(r), o = Ef(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = uc(e, t);
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
var Of = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function kf(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => Of(e).trim() !== "");
}
function Af(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return jf(yf, e, t, !1);
		case "status": return nc(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : Of(t);
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${Of(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function jf(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Zs[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? Af(t, n) : i && (a.has(o) || t === "custom" && o in i) ? Of(i[o]) : a.has(o) ? "" : e);
}
var Mf = (e, t) => jf(e, "synopsis", t, !1);
function Nf(e, t, n) {
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
var Pf = [
	"executeOnStartup",
	"executeOnUser",
	"executeOnAi",
	"executeOnChatChange",
	"executeOnGroupMemberDraft",
	"executeOnNewChat",
	"executeBeforeGeneration"
], Ff = [
	"label",
	"title",
	"message"
];
function If(e, t, n) {
	let r = (e) => Rs(e, (e) => e[0] === "name" && e.length === 2 ? t(e[1]) : void 0), i = e.qrList.map(({ id: e, ...t }, i) => {
		let a = n?.qrList?.[e], o = {
			...t,
			contextList: t.contextList.map((e) => ({ ...e })),
			id: i + 1
		};
		for (let e of Ff) {
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
var Lf = (e) => Pf.some((t) => e[t]) || !!e.automationId;
function Rf(e) {
	return (e.quickReplySets ?? []).flatMap((e) => e.qrList.filter(Lf).map((t) => `${e.name} · ${t.label || t.id}: ${t.message}`));
}
//#endregion
//#region src/store/presets.ts
var zf = /* @__PURE__ */ sn(/* @__PURE__ */ new Map()), Bf = /* @__PURE__ */ sn(/* @__PURE__ */ new Map());
async function Vf() {
	try {
		let e = `${s()}dist/presets/`, t = await (await v(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = cd(await (await v(e + n, { cache: "no-cache" })).json());
			t && zf.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var Hf = (e) => cd(e);
function Uf() {
	return [.../* @__PURE__ */ new Set([
		...zf.keys(),
		...Object.keys(q().installed),
		...Bf.keys()
	])].map((e) => Wf(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Wf(e) {
	let t = Bf.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = Kf(e), r = zf.get(e);
	if (n && (!r || Cl(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Gf = /* @__PURE__ */ new WeakMap();
function Kf(e) {
	let t = q().installed[e];
	if (t) return Gf.has(t) || Gf.set(t, cd(t)), Gf.get(t) ?? void 0;
}
var qf = (e) => Wf(e)?.preset;
function Jf(e) {
	q().installed[e.id] = e, J();
}
function Yf(e) {
	delete q().installed[e], J();
}
function Xf(e, t) {
	e ? Bf.set(e.id, e) : t ? Bf.delete(t) : Bf.clear();
}
var Zf = (e) => zf.has(e), Qf = (e) => zf.get(e), $f = {
	"app.name": "Advanced Preset",
	"carrier.reset": "The preset was updated; manual edits in “{name}” were reset.",
	"carrier.tavernHelper.reload": "Tavern Helper scripts of “{name}” were updated. Tavern Helper loads them after the page is reloaded; until then it keeps the previous scripts.",
	"carrier.tavernHelper.reloadNow": "Reload now",
	"quickReplies.conflict": "A Quick Reply set named “{name}” already exists and was not made by Advanced Preset, so the preset’s set of that name is not installed. Rename your set to use it.",
	"error.toolsUnsupported": "The current API source or settings do not support tool calling. Switch the transport or pick another recommended configuration.",
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
	"config.openAiSignatures": "OpenRouter / CLIProxyAPI signatures",
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
	"presetFile.installerHint": "The file can be imported as an ordinary SillyTavern preset. Without Advanced Preset, the installer (a Tavern Helper script) offers to install it; the preset's notice also asks the model to explain how.",
	"presetFile.adopted": "Set up from the imported preset “{file}”: now “{carrier}”."
}, ep = {
	en: $f,
	"zh-cn": {
		"app.name": "Advanced Preset",
		"carrier.reset": "预设已更新，「{name}」中的手动修改已被重置。",
		"carrier.tavernHelper.reload": "「{name}」的酒馆助手脚本已更新。刷新页面后酒馆助手才会载入新脚本，在此之前仍使用旧脚本。",
		"carrier.tavernHelper.reloadNow": "立即刷新",
		"quickReplies.conflict": "已存在名为「{name}」的快速回复集且不是由 Advanced Preset 创建的，因此未安装预设中的同名快速回复集。将你的快速回复集改名后即可使用。",
		"error.toolsUnsupported": "当前 API 源或设置不支持工具调用。请切换传输模式或选择其他推荐配置。",
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
		"config.openAiSignatures": "OpenRouter / CLIProxyAPI 签名",
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
		"presetFile.installerHint": "导出的文件可作为普通的酒馆预设导入。未安装 Advanced Preset 时，安装脚本（酒馆助手脚本）会提示安装插件；预设中的提示词也会让 AI 说明安装方法。",
		"presetFile.adopted": "已根据导入的预设「{file}」完成设置，现为「{carrier}」。"
	}
};
function tp() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function X(e, t = {}) {
	return ((ep[tp()] ?? ep[tp().split("-")[0]])?.[e] ?? $f[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function np(e) {
	return e.locales?.[tp()] ?? e.locales?.[tp().split("-")[0]];
}
function rp(e, t, n, r, i) {
	let a = np(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function ip(e) {
	let t = np(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function ap(e) {
	let t = np(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function op(e, t, n) {
	return ff(t, tp(), np(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/core/storylines.ts
var sp = "advanced_preset_storyline", cp = "advanced_preset_storyline_switched", lp = "?new", up = (e) => e.startsWith("?"), dp = (e) => {
	let t = e && !e.is_user ? e.extra?.[sp] : void 0;
	return typeof t == "string" ? t : void 0;
};
function fp(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = su(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : dp(e[o + 1]) ?? "?" : "";
		} else {
			let e = dp(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !up(s) && (i = s);
	}), n;
}
var pp = (e, t) => e === "" || e === t.main ? "" : e;
function mp(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? mu(e);
}
function hp(e, t) {
	return e === "" ? !1 : t.hidden?.[e] ?? mp(e, t);
}
var gp = (e, t) => e === "" ? t.main ?? "" : up(e) ? "" : e;
function _p(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !hp(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: gp(e, n),
		main: e === "",
		if: mp(e, n),
		hidden: hp(e, n)
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
var vp = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function yp(e, t, n, r = !1, i = vp, a = "off") {
	let o = {
		main: e === "",
		if: mp(e, t)
	};
	return {
		name: i.naming ? "" : gp(e, t),
		...o,
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching,
		frozen: ru(a, o)
	};
}
function bp(e, t, n) {
	let r = fp(e, n).map((e) => pp(e, n)), i = (e, i = n) => ({
		keys: r,
		meta: i,
		current: e,
		input: t,
		...vp
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? su(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !up(r[n]) && (e = r[n]);
		if (c = uu(a.mes, o, e), l = !e, s(e), !e) return {
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
		if (o.form === "new") return s(lp), o.ifLine ? {
			...i(lp, {
				...n,
				if: {
					...n.if ?? {},
					[lp]: !0
				}
			}),
			naming: !0,
			ifLine: !0,
			...e
		} : {
			...i(lp),
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
	if (o.form === "name" && pp(o.name, n) === "") return s(""), {
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
var xp = (e) => e.is_user ? cu(e.mes) : e.mes, Sp = 983296, Cp = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, wp = (e) => `⟦${String.fromCodePoint(Sp + Math.min(e, 255))}⟧`;
function Tp(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(Cp, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function Ep(e, t, n, r) {
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
function Dp(e, t, n, r, i = "off") {
	let { meta: a, current: o } = n, s = fp(e, a).map((e) => pp(e, a)), c = _p(e.map((e, i) => {
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
		let n = e[t], r = xp(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), d = {
		current: o,
		naming: l,
		input: n.input,
		view: _p(n.keys, o, a).order,
		vars: yp(o, a, c.isNew, c.grouped, l, i),
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
var Op = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function kp(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = Tp(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = Tp(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var Ap = "advanced_preset";
function jp(e) {
	let t = e?.extra?.[Ap];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function Mp(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: Y(n)
		}
	};
}
function Np(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Ap] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Ap] = Y(n));
}
function Pp(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[sp], !n.extra.advanced_preset) ? !1 : (delete n.extra[Ap], !0);
}
//#endregion
//#region src/store/eventlog.ts
function Fp() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var Ip = (e) => `legacy-${e}`;
function Lp(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = Ip(n), t = !0);
	}), t;
}
function Rp(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? Ip(e.index) : void 0);
}
var zp = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), Bp = "advanced_preset";
function Vp() {
	return e().chatMetadata?.[Bp]?.seedEvents ?? [];
}
function Hp(t = Infinity, n) {
	let r = Vp().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of jp(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function Up(e = Infinity, t) {
	let n = {};
	for (let { event: r } of Hp(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function Wp(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of Hp(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function Gp(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = jp(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[Bp] && (e.extra[Bp].events = Y(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[Bp] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function Kp(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function qp(e, t, n, r, i, a = Fp()) {
	let o = e.globalMemory;
	Lp(o.log);
	let s = Kp(e)[n] ?? null;
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
var Jp = (e) => e.globalMemory.cursor > 0, Yp = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Xp(e) {
	Jp(e) && (e.globalMemory.cursor--, J());
}
function Zp(e) {
	Yp(e) && (e.globalMemory.cursor++, J());
}
function Qp(e, t) {
	let n = e.globalMemory.log[zp(e, t)];
	n && (n.prev === null ? qp(e, "delete", n.key, void 0, "undo") : qp(e, "replace", n.key, n.prev, "undo"));
}
function $p(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = Fp();
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
function em(e, t) {
	for (let n of t) zp(e, n.id) < 0 && qp(e, n.op, n.key, n.content, "model", n.id);
}
function tm(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[zp(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function nm(e) {
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
	}, J()), Lp(n.globalMemory.log) && J(), n;
}
function rm(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Il(e, n.id)?.diff;
}
function im(e, t = nm(e).active.ref) {
	return Al(e.configurationDefaults, rm(e, nm(e), t));
}
function am(e) {
	let t = nm(e);
	return Al(im(e, t.active.ref), t.active.diff);
}
function om(e, t) {
	let n = nm(e);
	n.active.diff = Ml(t, im(e, n.active.ref)) ?? {}, J();
}
function sm(e, t) {
	let n = am(e);
	return t(n), om(e, n), n;
}
function cm(e, t) {
	let n = nm(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var lm = (e) => Object.keys(nm(e).active.diff ?? {}).length > 0;
function um(e) {
	nm(e).active.diff = {}, J();
}
function dm(e, t) {
	let n = nm(e), r = am(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Ml(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function fm(e, t) {
	let n = nm(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Ml(am(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function pm(e, t, n) {
	let r = nm(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function mm(e, t) {
	let n = nm(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function hm(e) {
	let t = nm(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = Cl(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Fl(t, e.migrations, n) : Y(t);
		i.push(...Nl(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !zl(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Id(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && kd(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, J(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && _("warning", X("um.lostAfterUpdate", { names: s.join(", ") }), ip(e)), i;
}
//#endregion
//#region src/store/tavern-helper.ts
var gm = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function _m(e, t, n = []) {
	let r = gm(t) ? t : {}, i = (e) => e.id !== Gu, a = (Array.isArray(r.scripts) ? r.scripts : []).filter(gm).filter(i).map((e) => Array.isArray(e.scripts) ? {
		...e,
		scripts: e.scripts.filter((e) => !gm(e) || i(e))
	} : e), o = Y(e ?? []), s = Ru(o), c = /* @__PURE__ */ new Set([...s, ...n]), l = (e) => typeof e.id != "string" || !c.has(e.id), u = /* @__PURE__ */ new Map();
	for (let e of a) {
		typeof e.id == "string" && u.set(e.id, e);
		for (let t of Array.isArray(e.scripts) ? e.scripts.filter(gm) : []) typeof t.id == "string" && u.set(t.id, t);
	}
	let d = (e) => {
		let t = u.get(e.id);
		t && t.type === e.type && (typeof t.enabled == "boolean" && (e.enabled = t.enabled), e.data && gm(t.data) && (e.data = {
			...e.data,
			...Y(t.data)
		}));
	};
	for (let e of o) {
		if (d(e), e.type !== "folder") continue;
		for (let t of e.scripts) d(t);
		let t = u.get(e.id), n = gm(t) && Array.isArray(t.scripts) ? t.scripts.filter(gm).filter(l) : [];
		e.scripts.push(...Y(n));
	}
	let f = [...o, ...Y(a.filter(l))], p = gm(r.variables) ? Y(r.variables) : {}, m = Object.keys(r).some((e) => e !== "scripts" && e !== "variables");
	return !f.length && !Object.keys(p).length && !m ? { owned: s } : {
		data: {
			...Y(r),
			scripts: f,
			variables: p
		},
		owned: s
	};
}
function vm(e, t) {
	let n = (e) => JSON.stringify(gm(e) && Array.isArray(e.scripts) ? e.scripts.map((e) => gm(e) ? {
		...e,
		data: void 0,
		scripts: Array.isArray(e.scripts) ? e.scripts.map((e) => gm(e) ? {
			...e,
			data: void 0
		} : e) : void 0
	} : e) : []);
	return n(e) !== n(t);
}
function ym(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of gm(e) && Array.isArray(e.scripts) ? e.scripts.filter(gm) : []) {
		n.set(String(t.id), t.content ?? null);
		for (let e of Array.isArray(t.scripts) ? t.scripts.filter(gm) : []) n.set(String(e.id), e.content ?? null);
	}
	let r = JSON.stringify(t.map((e) => n.get(e) ?? null)), i = 2166136261;
	for (let e = 0; e < r.length; e++) i = Math.imul(i ^ r.charCodeAt(e), 16777619) >>> 0;
	return i.toString(16);
}
//#endregion
//#region src/store/carrier.ts
var bm = "advanced_preset";
function xm(e) {
	let t = e?.extensions?.[bm];
	if (!t?.tavernHelperPrevious || !t.tavernHelperScripts) return !1;
	let n = ym(e.extensions[Lu], t.tavernHelperScripts);
	return n === t.tavernHelperPrevious && n !== t.tavernHelperCode;
}
var Sm = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Cm = (e) => Sm[e] ?? e, wm = () => e().getPresetManager("openai"), Tm = (e) => `AP · ${e.name}`;
function Em() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function Dm(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Om(e, t, n) {
	let r = e.carrier.prompt_order.map((e) => ({ ...e })), i = n?.extensions?.[bm], a = _m(e.tavernHelperScripts, n?.extensions?.[Lu], i?.presetId === e.id ? i.tavernHelperScripts : void 0), o = {
		presetId: e.id,
		version: e.version,
		hash: e.hash
	};
	if (a.owned.length) {
		let t = ym(a.data, a.owned), n = i?.presetId === e.id ? i : void 0, r = n?.tavernHelperCode !== void 0 && n.tavernHelperCode !== t ? n.tavernHelperCode : n?.tavernHelperPrevious;
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
			[bm]: o,
			...e.regexScripts?.length ? { regex_scripts: Y(e.regexScripts) } : {},
			...a.data ? { [Lu]: a.data } : {}
		}
	};
}
function km(e) {
	let t = wm();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Am(e, t, n) {
	let r = wm();
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
async function jm(e, t = {}) {
	let n = wm(), r = nm(e), i = km(e.id), a = i ?? Tm(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[bm], c = !o || t.force || s?.hash !== e.hash || xm(o), l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && Dm(o) !== r.carrierHash && _("info", X("carrier.reset", { name: a }));
		let n = Om(e, am(e), o);
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = Dm(n), J(), await Am(a, n, !!t.select || l);
		let i = n.extensions[Lu];
		l && vm(o?.extensions?.tavern_helper, i) && Nm(a);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
var Mm = !1;
function Nm(e) {
	"TavernHelper" in globalThis && !Mm && (Mm = !0, h(`<p>${m(X("carrier.tavernHelper.reload", { name: e }))}</p>`, X("carrier.tavernHelper.reloadNow"), X("common.later")).then((e) => {
		Mm = !1, e && location.reload();
	}));
}
async function Pm(e) {
	await jm(e, { select: !0 });
}
async function Fm(e) {
	let t = km(e.id);
	if (!t) return;
	let n = wm(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = am(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...Y(i)
	}, o = n.getSelectedPresetName() === t;
	Im = !0;
	try {
		await Am(t, a, o);
	} finally {
		Im = !1;
	}
}
var Im = !1;
function Lm(t) {
	if (Im || Em() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = am(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Cm(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = Y(r));
	}
	return Object.keys(i).length ? (sm(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var Rm = null, zm = (e) => {
	Rm = e;
}, Bm = () => {
	let e = Rm;
	return Rm = null, e;
}, Vm = (e) => e.meta?.enabled !== !1;
function Hm(t, n) {
	if (!Vm(n)) return "";
	let r = Rs(t.meta.trigger, (e) => e[0] === "name" ? xu(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Um(e, t, n, r, i, a = [], o = !0) {
	let s = Wc(n, Hm(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = gu(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && Fs(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && Fs(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && Fs(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? Bm() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Wm(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Gm = 0, Km = () => `ap-${Date.now().toString(36)}-${(++Gm).toString(36)}`, qm = /* @__PURE__ */ new Map(), Jm = null, Ym = null, Xm = {
	setPending(e) {
		Jm = e;
	},
	takePending() {
		let e = Jm;
		return Jm = null, e;
	},
	peekPending: () => Jm,
	arm(e) {
		Ym = e, qm.set(e.id, e);
	},
	takeArmed() {
		let e = Ym;
		return Ym = null, e;
	},
	get: (e) => qm.get(e),
	release(e) {
		qm.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of qm) t - r.createdAt > e && qm.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function Zm(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function Qm(e, t) {
	let n = e ? /^(?:(f)(y?)(a?)((?:\+[^+]+)*)|(s)|(x)|t(\d+))$/.exec(e) : null;
	if (n) {
		if (n[1]) {
			let e = [...n[2] && t ? [t] : [], ...n[4] ? n[4].slice(1).split("+") : []];
			return {
				body: "full",
				...n[3] ? { annotations: !0 } : {},
				...e.length ? { echo: e } : {}
			};
		}
		return n[5] ? { body: "synopsis" } : n[6] ? { body: "drop" } : {
			body: "truncate",
			max: Number(n[7])
		};
	}
}
var $m = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, eh = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), th = (e, t) => Mf(e, t), nh = (e, t) => t ? $m(e)?.structures?.[t] : void 0, rh = (e, t) => $m(e)?.structures?.[t];
function ih(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = $m(e);
		if (a && eh.has(a.turn)) {
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
		let n = Wc(e.item.mes, t.trigger, t.wrap);
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
				} else nh(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && $m(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && kf(rh(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function ah(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : nh(r, n.synopsisId);
			return e ? th(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? $m(r)?.annotations : void 0;
			return i?.length && (e = lf(e, i)), t.echo?.length && n.echoes && (e = oh(e, r, t.echo, n.echoes)), e;
		}
	}
}
function oh(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = rh(t, e.id);
		kf(a) && e.pieces.forEach((t, n) => i.push({
			text: jf(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? Nf(e, r.contentKey, i) : e;
}
function sh(e, t) {
	let n = [];
	for (let r of ih(e, t)) {
		let e = ah(r, r.fresh, t);
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
function ch(e, t) {
	return sh(e, t).map((e) => e.item);
}
function lh(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? wf(n) : 0;
	if (r) return vu(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function uh(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function dh(e, t, n, r) {
	let i = new Set(vu(e, t).flatMap((e) => e.structures)), a = n ? gu(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = Cf(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? Fs(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...Df(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: Ef(r)
	} : void 0;
}
var fh = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function ph(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function mh(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = ph(e), r = ph(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function hh(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = fh(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = fh(l.text);
			if (c === u || c.includes(u) || mh(c, u) >= n) {
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
var gh = 50;
function _h(e) {
	let t = nm(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var vh = () => Math.random().toString(36).slice(2, 8);
function yh(e) {
	let t = new Set(e), n = vh();
	for (; t.has(n);) n = vh();
	return n;
}
function bh(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: yh(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function xh(e, t) {
	let n = _h(e), r = {
		id: yh(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: gd()
	};
	return e.insertionPoints.length && r.entries.push(bh(e, r)), n.push(r), J(), n[n.length - 1];
}
function Sh(e, t) {
	let n = _h(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(pf(t, yh(n.map((e) => e.id)), { name: i })), J(), n[n.length - 1];
}
function Ch(e, t, n) {
	let r = _h(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...Y(r[i]),
		id: yh(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), J(), r[i + 1];
}
function wh(e, t) {
	let n = nm(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), J();
}
function Th(e, t, n) {
	let r = _h(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), J();
}
function Eh(e, t) {
	return qd(Y(_h(e).filter((e) => !t || t.includes(e.id))), e);
}
function Dh(e, t) {
	let n = Jd(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && Cl(n.preset.version, e.version) < 0 && (r = Id(r, e.migrations, n.preset.version));
	let i = _h(e), a = r.map((e) => {
		let t = {
			...e,
			id: yh(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return J(), {
		added: a,
		missing: a.filter((t) => kd(e, t).length).length
	};
}
function Oh(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < gh; t--) {
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
var kh = /* @__PURE__ */ sn({
	log: [],
	requests: []
}), Ah = 50;
function jh(e, t) {
	kh.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), kh.log.length > Ah && (kh.log.length = Ah);
}
function Mh(e) {
	return kh.requests.unshift(e), kh.requests.length > Ah && (kh.requests.length = Ah), kh.requests[0];
}
//#endregion
//#region src/core/cache.ts
function Nh(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Ph(e, t) {
	return e.send_date ? Nh(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var Fh = 57344, Ih = /⟦([\uE000-\uF8FF])⟧/g, Lh = (e) => `⟦${String.fromCharCode(Fh + e)}⟧`;
function Rh(e) {
	let t = [];
	return {
		text: e.replace(Ih, (e, n) => (t.push(n.charCodeAt(0) - Fh), "")),
		marks: t
	};
}
function zh(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of ih(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : Qm(n?.[e], t.synopsisId), l = c ?? s.fresh, u = ah(s, s.fresh, t), d = c ? ah(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = Zm(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: Zm(l),
			freshMode: Zm(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function Bh(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function Vh(e, t, n, r, i, a = {}) {
	let o = Bh(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && Nh(i) === n[r]) r++;
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
		r !== null && f.push(Nh(r));
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
function Hh(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var Uh = "advanced-preset.cache.v1", Wh = 864e5, Gh = 30, Kh = null;
function qh() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function Jh() {
	if (Kh) return Kh;
	try {
		let e = qh()?.getItem(Uh), t = e ? JSON.parse(e) : {};
		Kh = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		Kh = {};
	}
	return Kh;
}
function Yh(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= Wh).sort((e, t) => t[1].at - e[1].at).slice(0, Gh);
	Kh = Object.fromEntries(n);
	try {
		qh()?.setItem(Uh, JSON.stringify(Kh));
	} catch {}
}
function Xh() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var Zh = (e, t) => t ? `${e}\u0001${t}` : e;
function Qh(e) {
	return Jh()[e];
}
function $h(e, t) {
	Yh({
		...Jh(),
		[e]: t
	}, t.at);
}
function eg(e, t) {
	let n = Jh()[e];
	n && $h(e, {
		...n,
		at: t
	});
}
function tg(e, t) {
	let n = Jh(), r = (t) => Zh(e, t);
	if (!t.some(([e, t]) => r(e) in n || r(t) in n)) return;
	let i = { ...n };
	for (let [e, n] of t) delete i[r(e)], delete i[r(n)];
	for (let [e, a] of t) n[r(e)] && (i[r(a)] = n[r(e)]);
	Yh(i, Date.now());
}
//#endregion
//#region src/core/input-shaping.ts
var ng = "⟦󰀀⟧", rg = "⟦󰀁⟧", ig = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function ag(e) {
	let t = e.match(ig)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + ng + t;
}
var og = (e) => e.replaceAll(ng, "");
function sg(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = og(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = og(e.text));
}
function cg(e, t, n, r) {
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
			let n = t.lastIndexOf(ng);
			if (n < 0) continue;
			let a = og(t.slice(0, n)).replace(ig, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: og(t.slice(n + 4))
			};
		}
	}
	return null;
}
var lg = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function ug(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? vf(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && lg(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (lg(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var dg = "stream_function_call_arguments";
function fg(e, t, n) {
	if (e === "off" || t !== "gemini") return !1;
	if (e === "on") return !0;
	let r = String(n.chat_completion_source ?? "");
	return r === "vertexai" || r === "custom" || r === "makersuite" && !!String(n.reverse_proxy ?? "").trim();
}
function pg(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function mg(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[dg] = !0, t() && hg(e));
}
function hg(e) {
	let t = gg(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...pg(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function gg(e) {
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
var _g = "google-gemini-v1", vg = /* @__PURE__ */ new WeakSet(), yg = /* @__PURE__ */ new WeakSet();
function bg(e) {
	return vg.add(e), e;
}
function xg(e, t) {
	if (t !== "gemini" && !(t === "openai" && e.config.connection.openAiSignatures)) return;
	let n = e.config.connection.syntheticTurn, r = n ? e.preset.syntheticTurns.find((e) => e.id === n) : void 0;
	return r ? Ol(r, Dl(e.config.connection)) : void 0;
}
function Sg(e) {
	return yg.add(e), e;
}
function Cg(e, t) {
	return !e.signatureFallback && (e.transport === "tool-single" || e.transport === "tool-multi") && !!xg(e, t);
}
function wg(e) {
	let { message: t = "", body: n = "" } = e ?? {};
	return /thought[\s_-]?signature/i.test(`${t}\n${n}`);
}
function Tg(e, t, n = {}) {
	return t !== "gemini" && !(t === "openai" && n.openAi) ? e : e.map((e) => e.role !== "assistant" || !Array.isArray(e.tool_calls) || !e.tool_calls.length ? e : t === "gemini" ? Dg(e, !!n.fallback) : vg.has(e) ? Og(e, !!n.fallback, n.source === "openrouter") : e);
}
var Eg = (e, t) => t && yg.has(e) || typeof e.signature != "string" || !e.signature ? void 0 : e.signature;
function Dg(e, t) {
	let n = e.tool_calls;
	return n.every((e) => Eg(e, t)) ? e : {
		...e,
		tool_calls: n.map((e) => ({
			...e,
			signature: Eg(e, t) ?? "skip_thought_signature_validator"
		}))
	};
}
function Og(e, t, n) {
	let r = Array.isArray(e.reasoning_details) ? [...e.reasoning_details] : [], i = e.tool_calls.map((e) => {
		let i = Eg(e, t), { signature: a, ...o } = e;
		return i ? (r.push({
			type: "reasoning.encrypted",
			data: i,
			id: e.id,
			format: _g,
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
function kg(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of Oc(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Ag(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function jg(e) {
	return Oc(e.preset.tools, e.workflow, e.stages, e.structures, Ag(e));
}
function Mg(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${xu(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Ng(e, t, n) {
	let r = _c(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Ag(e)(r);
}
function Pg(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = xg(r, i), l = {
		id: s,
		type: "function",
		function: {
			name: o.tool.name,
			arguments: "{}"
		},
		...c ? { signature: c } : {}
	};
	c && Sg(l);
	let u = Ag(r), d = u(o.tool.description);
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
			bg({
				role: "assistant",
				content: "",
				tool_calls: [l]
			}),
			{
				role: "tool",
				tool_call_id: s,
				content: Ng(r, o.response[t], { first: n })
			}
		]
	};
}
function Fg(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t);
	let r = String(n.chat_completion_source ?? "");
	return Array.isArray(n.messages) && (n.messages = Tg(n.messages, e.family, {
		fallback: e.ctx.signatureFallback,
		source: r,
		openAi: e.ctx.config.connection.openAiSignatures
	})), e.family === "gemini" && Ig(n, e.ctx.preset.tools.jsonStringHint), fg(e.ctx.config.connection.streamToolArguments, e.family, n) && mg(n), n;
}
function Ig(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Iu(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Pu(e.json_schema.value, n)
	});
}
function Lg(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var Rg = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", zg = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(ng, ""), Bg = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(Ih.source).test(e);
function Vg(e) {
	for (let t of e) if (typeof t.content == "string") Bg(t.content) && (t.content = Rh(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && Bg(e.text) && (e.text = Rh(e.text).text);
}
function Hg(e) {
	if (typeof e.content == "string") {
		if (!Bg(e.content)) return null;
		let { text: t, marks: n } = Rh(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => Hh(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !Bg(e.text)) return;
		let i = Rh(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = Hh(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function Ug(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = jg(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return Nh(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function Wg(e) {
	return Nh(e.map((e) => `${e.role}\u0000${Rg(e.content)}`).join(""));
}
function Gg(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return Vg(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = Hg(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = zg(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = zg(i.content);
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
			sticky: zg(f),
			fresh: zg(p),
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
		tools: Ug(e),
		prompt: Wg(t.slice(0, n))
	}, p = Vh(l, Qh(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function Kg(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? eg(n.chat, t) : $h(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var qg = "advanced_preset", Jg = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function Yg() {
	let t = e().chatMetadata?.[qg]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function Xg(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[qg] ??= {};
	r.storylines = t;
}
function Zg(t = e().chat, n = Yg()) {
	return fp(t, n).map((e) => pp(e, n));
}
function Qg(t = e().chat, n = Yg()) {
	let r = new Set(Zg(t, n).filter((e) => e !== "" && !up(e)));
	n.main && r.add(n.main);
	for (let e of [...Object.keys(n.if ?? {}), ...Object.keys(n.hidden ?? {})]) r.add(e);
	return r;
}
function $g(t, n = e().chat, r = Yg()) {
	let i = Zg(n, r);
	return _p(i, t ?? i.at(-1) ?? "", r).order;
}
function e_(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function t_(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[sp] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[sp] = n);
}
async function n_(t, n) {
	if (!t) return;
	let r = Yg();
	Xg({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function r_(t) {
	let n = Yg();
	return !ou(t) || Zg(e().chat, n).includes(t) ? !1 : (Xg({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
async function i_(t, n) {
	if (!t) return await r_(n) ? "renamed" : ou(n) ? "taken" : "invalid";
	if (!ou(n)) return "invalid";
	if (n === t) return "unchanged";
	let r = Yg();
	if (n === r.main || Zg(e().chat, r).includes(n)) return "taken";
	let i = e().chat, a = [];
	i.forEach((e, r) => {
		if (e.is_user) {
			let i = su(e.mes);
			if (i?.form !== "name" || i.name !== t) return;
			e.mes = uu(e.mes, i, n), a.push(r);
		} else e.swipe_info?.forEach((e) => {
			e?.extra?.advanced_preset_storyline === t && (e.extra[sp] = n);
		}), e.extra?.advanced_preset_storyline === t && (e.extra[sp] = n);
	});
	let o = mp(t, r), s = hp(t, r), c = { ...r.if ?? {} }, l = { ...r.hidden ?? {} };
	delete c[t], delete l[t], o === mu(n) ? delete c[n] : c[n] = o, s === o ? delete l[n] : l[n] = s;
	let u = {
		...r,
		if: c,
		hidden: l
	};
	Object.keys(c).length || delete u.if, Object.keys(l).length || delete u.hidden, Xg(u), tg(Xh(), [[t, n]]);
	for (let t of a) e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "renamed";
}
async function a_(t, n) {
	if (!t) return;
	let r = Yg();
	Xg({
		...r,
		hidden: {
			...r.hidden ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
function o_(e, t) {
	if (!e) return;
	let n = Yg(), r = { ...n };
	t.ifLine !== void 0 && (t.ifLine || mu(e)) && (r.if = {
		...n.if ?? {},
		[e]: t.ifLine
	}), t.hide && (r.hidden = {
		...n.hidden ?? {},
		[e]: !0
	}), Xg(r);
}
function s_(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[cp] = !0);
}
async function c_(t, n) {
	let r = Yg();
	if (!ou(t)) return "invalid";
	if (pp(t, r) === "") return "unchanged";
	let i = e().chat, a = fp(i, r).map((e) => pp(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!ou(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = lu(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? pp(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[sp] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[sp] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && mp(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t];
	let l = { ...r.hidden ?? {} };
	o && delete l[o], delete l[t], Xg({
		...r,
		main: t,
		if: c,
		...Object.keys(l).length || r.hidden ? { hidden: l } : {}
	}), tg(Xh(), o ? [["", o], [t, ""]] : [[t, ""]]);
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/assembler.ts
var l_ = /⟦ap:region:([\w.-]+)⟧/g, u_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function d_(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(l_)) {
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
function f_(t, n, r) {
	if (!Vm(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = xu(t, n, t.user), s = xu(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = jp(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? sc(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function p_(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = jp(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : nc(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var m_ = (e) => e?.view;
function h_(t, n) {
	let { preset: r, config: i } = t, a = m_(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = p_(r, s), l = Up(Infinity, a), u = Kp(nm(r)), d = Wp(Infinity, a), f = f_(r, i, s), p = Jg(r, i) ? Yg().main ?? "" : "", m = t.transport;
	return {
		vars: ku(r, i, {
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
				...iu,
				name: p
			}
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
			inputText: t.inputShaped ? rg : "",
			storyline: {
				name: t.storylines?.vars.name ?? p,
				main: t.storylines?.mainName ?? p
			}
		}
	};
}
function g_(t, n, r) {
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
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = hh(c.map(({ m: e }) => ({
		role: e.role,
		text: u_(e.content)
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
			mes: u_(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (Jg(i, a)) {
		let e = Dp(p, m, bp(l, -1, Yg()), -1, nu(a.storylines));
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = {
		trigger: Hm(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...uh(i),
		echoes: dh(i, a, h_(t, Wm(i, a, t.origin)).vars, Wm(i, a, "story")),
		recap: Wp(Infinity, m_(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: lh(i, a),
		...g ? { background: (e) => Op(g, h[e]) } : {}
	}, v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = Zh(Xh(), g?.current), n = zh(p, _, Qh(e)?.modes, (e) => Ph(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			v.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + Lh(e.entry));
			let r = e.entry === void 0 ? void 0 : n.entries[e.entry];
			y.set(t, r ? [
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
	} else for (let e of ch(p, _)) v.set(e.__h, e.mes), y.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = y.get(e);
		e >= 0 && v.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (v.set(e, ag(v.get(e))), t.input = { texts: n });
	}
	let b = /* @__PURE__ */ new Set(), x = new Set(p.map((e) => e.__h));
	d.forEach((e, t) => {
		e >= 0 && !x.has(t) && b.add(c[t].i);
	}), p.forEach((e, t) => {
		let n = c[e.__h];
		v.has(e.__h) ? (n.m.content = v.get(e.__h), g?.grouped && h[t] !== void 0 && r.set(n.m, h[t])) : b.add(n.i);
	});
	for (let e of [...b].sort((e, t) => t - e)) n.splice(e, 1);
}
function __(t, n) {
	let r = n ? null : Xm.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = am(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = Um(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: Km(),
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
		keywords: Oh(a, n ? o : -1)
	};
}
var v_ = Symbol("ap-region");
function y_(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function b_(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? cg(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (sg(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(rg) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		ug(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(rg, () => c) : e;
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
function x_(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return Ep(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = hu(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, v_, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && u_(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function S_(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => u_(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${xu(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = u_(t.content);
		if (t[v_] || t.role === "system") return n;
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
var C_ = /* @__PURE__ */ new Set();
function w_(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !C_.has(n) && (C_.add(n), _("warning", X("warn.template", { error: n }), X("app.name")));
}
function T_(e) {
	let t = (e) => (typeof e.content == "string" ? e.content : JSON.stringify(e.content ?? "")).includes(Wu);
	for (let n = e.length - 1; n >= 0; n--) t(e[n]) && e.splice(n, 1);
}
async function E_(t) {
	let { chat: n, dryRun: r } = t;
	if (T_(n), !q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		Vg(n), sg(n), kp(n), r || (Xm.setPending(null), Xm.takeArmed());
		return;
	}
	let i = Em(), a = i ? qf(i) : void 0;
	if (!a) {
		let e = d_(n).filter((e) => !e.__anchor);
		Vg(e), sg(e), kp(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = __(a, r), s = d_(n), c = kp(s);
	!o.interceptorRan && !r && g_(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : Wm(a, o.config, o.origin), d = a.inputShaping, f = y_(a, s), p = d && o.input ? cg(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = h_(o, u), g = Md(a, _h(a), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = Ou({
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, u);
	_.warnings.length && w_(_.warnings, o.warnings), o.workflow = u, o.assembly = _, o.stages = _.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : _.structures;
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
			text: Ql(t)
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
			return Object.defineProperty(t, v_, { value: !0 }), t;
		}).filter((e) => u_(e.content).trim());
		S.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: u_(e.content).length,
				content: u_(e.content)
			}))
		}), y.push(...n), t === a.anchors.historyStart && (b = y.length);
	}
	let C = new Set(s.map((e) => e.__anchor).filter(Boolean));
	for (let [e, t] of Object.entries(_.regions)) !C.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	let ee = x < 0 ? y.length : x, w = o.storylines;
	w && (S.storyline = {
		...w.vars,
		groups: w.groups.map((e) => e.main ? `(main) ${e.name}` : `${e.if ? "(if) " : ""}${e.hidden ? "(hidden) " : ""}${e.name || "?"}`),
		hidden: w.hidden,
		grouped: w.grouped
	}, w.grouped && b >= 0 && (ee = x_(o, w, y, b, ee))), S.cache = Gg(o, y, b, ee), S.input = b_(o, y, b, ee, S);
	let te = o.transport === "prefill" && !l && b >= 0 ? S_(o, y, b) : y;
	n.splice(0, n.length, ...te.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), jh("assembly", S), !r && !l && u && Xm.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var D_ = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, O_ = (e) => typeof e == "object" && !!e && !Array.isArray(e), k_ = (e, t) => Jg(e, t) ? nu(t?.storylines) : "off";
function A_() {
	let e = Em(), t = e ? qf(e) : void 0;
	return t ? k_(t, am(t)) : "off";
}
function j_(e, t) {
	if (typeof e != "string" || !e) return -1;
	for (let n = t.length - 1; n >= 0; n--) if (t[n].mes === e) return n;
	if (e.length >= 40) {
		for (let n = t.length - 1; n >= 0; n--) if (t[n].mes.includes(e)) return n;
	}
	return -1;
}
var M_ = (e) => !!(R_?.open && e >= R_.from);
function N_(t, n = e().chat) {
	let r = j_(t, n);
	return r < 0 ? null : M_(r) ? R_.line : Zg(n)[r];
}
function P_(t, n, r = e().chat) {
	if (n === "off") return !1;
	let i = j_(t, r);
	if (i < 0 || M_(i)) return !!(R_?.open && R_.frozen);
	let a = Zg(r)[i];
	return ru(n, {
		main: a === "",
		if: mp(a, Yg())
	});
}
var F_ = /* @__PURE__ */ new WeakSet();
function I_(e, t, n) {
	O_(e) && Array.isArray(t) && P_(n, A_()) && (t.length && jh("variables", {
		frozen: "mvu",
		storyline: N_(n) ?? R_?.line,
		commands: t.length
	}), t.splice(0, t.length), F_.add(e));
}
function L_(e, t) {
	O_(e) && F_.has(e) && (F_.delete(e), O_(t) && "stat_data" in t && (e.stat_data = Y(t.stat_data)), e.delta_data = {});
}
var R_ = null;
function z_(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return O_(n) ? n : void 0;
}
var B_ = /* @__PURE__ */ new Set(["display_data", "delta_data"]), V_ = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !B_.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function H_(t) {
	R_ = null, t.line !== void 0 && (R_ = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		frozen: t.frozen,
		from: Math.max(0, t.from),
		chatVars: t.frozen ? Y(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function U_() {
	let t = R_;
	if (!t?.frozen) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return R_ = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = Y(t.chatVars), r = !0);
	let o = n.chat, s = Zg(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = z_(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = z_(o[t]);
		V_(n, r) || (t.variables[t.swipe_id ?? 0] = r ? Y(r) : {}, i = !0);
	}
	return (r || i) && jh("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var W_ = () => {
	R_ = null;
};
function G_() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(D_.commandParsed, (e, t, n) => I_(e, t, n)), r(D_.updateEnded, (e, t) => L_(e, t));
	let i = (e) => () => {
		R_ && (e && (R_.open = !1), setTimeout(() => void U_().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || W_();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, W_);
}
//#endregion
//#region src/core/interceptor.ts
async function K_(t, n, r, i) {
	if (Xm.setPending(null), !q().enabled) return;
	let a = Em(), o = a ? qf(a) : void 0;
	if (!o) return;
	let s = am(o), c = i || "normal";
	c === "swipe" && Pp(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (Jg(o, s)) {
		let e = Yg(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = bp(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || e_(n, i.rewrite), i.noRecent && _("info", X("storylines.noRecent"), X("app.name")));
		let a = Dp(t, r ? t.map((e, t) => t) : f, i, u, nu(s.storylines));
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", g = t.slice(-6).map((e) => e.mes), v = Oh(t, u), { meta: y, flags: b, origin: x } = Um(o, s, h, c, !0, g), S = s.connection.transport, { vars: C } = h_({
		preset: o,
		config: s,
		transport: S,
		origin: x,
		stType: c,
		meta: y,
		flags: b,
		storylines: p
	}, Wm(o, s, x)), ee = {
		trigger: Hm(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...uh(o),
		echoes: dh(o, s, C, Wm(o, s, "story")),
		recap: Wp(Infinity, m_(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: lh(o, s),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => Op(p, m[e]) } : {}
	}, w = (e, t) => p?.grouped && m[e] !== void 0 ? wp(m[e]) + t : t, te, T, ne = -1, re = [];
	if (s.cache?.enabled) {
		let e = Zh(Xh(), p?.current), n = zh(t, ee, Qh(e)?.modes, (e) => Ph(t[e], f[e] ?? e));
		if (T = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: w(n, t === void 0 ? e.mes : e.mes + Lh(t))
		})), ne = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, ne >= 0) {
			let e = n.out[ne], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			re = t ? [
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
		let e = sh(t, ee);
		T = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: w(t, e.mes)
		} : e), ne = u >= 0 ? e.findIndex((e) => e.index === u) : -1, ne >= 0 && (re = [e[ne].item.mes]);
	}
	let E;
	o.inputShaping && ne >= 0 && re.some((e) => e.trim()) && (T[ne] = {
		...T[ne],
		mes: ag(T[ne].mes)
	}, E = { texts: re }), t.splice(0, t.length, ...T);
	let D = {
		id: Km(),
		preset: o,
		config: s,
		origin: x,
		stType: c,
		interceptorRan: !0,
		dryRun: !1,
		meta: y,
		flags: b,
		transport: S,
		stages: [],
		structures: [],
		inputIndex: u >= 0 ? f[u] ?? d.length - 1 : -1,
		continueFrom: c === "continue" ? t[l]?.mes : void 0,
		keywords: v,
		sticky: te,
		input: E,
		storylines: p,
		createdAt: Date.now(),
		warnings: []
	};
	H_({
		line: p?.current,
		frozen: !!p?.vars.frozen,
		from: D.inputIndex >= 0 ? D.inputIndex : d.length - 1
	}), Xm.setPending(D);
}
//#endregion
//#region src/core/transports/text.ts
function q_(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Mg(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => Rc(e, {
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
			content: _c(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Fg({
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
			let n = Lg(t, e.caller);
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
var J_ = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Y_ = 32, X_ = 10, Z_ = 9, Q_ = 13, $_ = 160, ev = 6158, tv = 8192, nv = 8203, rv = 8239, iv = 8287, av = 12288, ov = 65279;
function sv(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function cv(e) {
	return e >= "0" && e <= "9";
}
function lv(e) {
	return e >= " ";
}
function uv(e) {
	return ",:[]/{}()\n+".includes(e);
}
function dv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function fv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var pv = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, mv = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function hv(e) {
	return ",[]/{}\n+".includes(e);
}
function gv(e) {
	return Sv(e) || _v.test(e);
}
var _v = /^[[{\w-]$/;
function vv(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function yv(e, t) {
	let n = e.charCodeAt(t);
	return n === Y_ || n === X_ || n === Z_ || n === Q_;
}
function bv(e, t) {
	let n = e.charCodeAt(t);
	return n === Y_ || n === Z_ || n === Q_;
}
function xv(e, t) {
	let n = e.charCodeAt(t);
	return n === $_ || n === ev || n >= tv && n <= nv || n === rv || n === iv || n === av || n === ov;
}
function Sv(e) {
	return Cv(e) || Tv(e);
}
function Cv(e) {
	return e === "\"" || e === "“" || e === "”";
}
function wv(e) {
	return e === "\"";
}
function Tv(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function Ev(e) {
	return e === "'";
}
function Dv(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function Ov(e, t) {
	let n = e.length;
	if (!yv(e, n - 1)) return e + t;
	for (; yv(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function kv(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function Av(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var jv = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function Mv(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = jv[n];
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
function Nv(e) {
	return e !== null && e.char === "\"";
}
function Pv(e) {
	return e !== null && e.char === "'";
}
function Fv(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function Iv(e, t) {
	switch (t) {
		case ")": return Fv(e, "(") > Fv(e, ")");
		case "]": return Fv(e, "[") > Fv(e, "]");
		case "}": return Fv(e, "{") > Fv(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Lv = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Rv = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function zv(e) {
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
	for (r && a(), gv(e[t]) && Av(n) ? (r || (n = Ov(n, ",")), g()) : r && (n = Dv(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? yv : bv, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (xv(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Bv(e, t);) t++;
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
			if (dv(e[t])) for (; t < e.length && fv(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = Ov(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = Dv(n, ",")) : E();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (gv(e[t]) || c ? n = Ov(n, ":") : D()), i() || (s || c ? n += "null" : D()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = Ov(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = Ov(n, ",")), p(), !i()) {
					r || (n = Dv(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = Ov(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = Ov(n, ",")), t = i();
		t || (n = Dv(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, Sv(e[t]) || ne());
		let s = e[t] === "&" ? Mv(e.slice(t, t + 12)) : null, c = Nv(s) || Pv(s);
		if (Sv(e[t]) || c) {
			let l = wv(e[t]) ? wv : Ev(e[t]) ? Ev : Tv(e[t]) ? Tv : Cv, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = ee(t - 1);
					return !r && uv(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = Ov(p, "\""), n += p, !0);
				}
				if (t === i) return p = Ov(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? Mv(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || uv(e[t]) && !Iv(p, e[t]) || Sv(e[t]) && !w(t) || cv(e[t])) return v(), !0;
					e[t] === "\\" && ne();
					let s = ee(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (uv(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && hv(e[t])) {
					if (e[t - 1] === ":" && pv.test(e.substring(u + 1, t + 2))) for (; t < e.length && mv.test(e[t]);) p += e[t], t++;
					return p = Ov(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : vv(e) ? p += Lv[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Rv[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && sv(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ie();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : vv(n) ? (p += Lv[n], t++) : (lv(n) || T(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = Dv(n, "\"", !0);
			let e = n.length;
			n = _() ? kv(n, e, 1) : Ov(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !cv(e[t]) && te() && (i += "0")), e[t] === "0" && cv(e[t + 1]) && (a = !0); cv(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, cv(e[t]) || (i += "0"); cv(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), cv(e[t]) || (i += "0"); cv(e[t]);) i += e[t], t++;
			return te() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !fv(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (dv(e[t])) {
			for (; t < e.length && fv(e[t]);) t++;
			let n = t;
			for (; yv(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !hv(e[t]) && !Sv(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && pv.test(e.substring(a, t + 2))) for (; t < e.length && mv.test(e[t]);) t++;
		if (t > a) {
			for (; yv(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && yv(e, n);) n--;
		return n;
	}
	function w(t) {
		let n = t + 1;
		for (; n < e.length && yv(e, n);) n++;
		return n >= e.length || uv(e[n]);
	}
	function te() {
		return t >= e.length || uv(e[t]) || yv(e, t);
	}
	function T(e) {
		throw new J_(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ne() {
		throw new J_(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function re() {
		throw new J_("Unexpected end of json string", e.length);
	}
	function E() {
		throw new J_("Object key expected", t);
	}
	function D() {
		throw new J_("Colon expected", t);
	}
	function ie() {
		throw new J_(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Bv(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Vv(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Hv(e, t) {
	let n = Vv(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(zv(n));
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
function Uv(e, t, n, r) {
	let i = Pc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function Wv(e) {
	let { ctx: t, caller: n } = e, r = jg(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = Hv(c(e), i);
		return s = a.value, n.schema ? Uv(t, r, a.value, i) : zc(a.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: a.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
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
		body: () => Fg(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Gv = (e, t) => bg({
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
function Kv(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function qv(e) {
	let { ctx: t, caller: n } = e, r = jg(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = Pg(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = Hv((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? Uv(t, r, o.value, i) : zc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => Fg(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = Lg(e, n);
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
function Jv(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = jg(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = Pg(e, o ? "parallel" : "multi", l), d = [
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
		let i = Hv(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? Uv(t, s, e, a) : zc(e, {
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
			return Fg({
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
			let i = Kv(e.toolCalls.filter((e) => e.name), r), o = Lg(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(Gv(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = Ng(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: Ng(t, a.tools.results.nudge, {
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
function Yv(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return q_(e);
		case "structured": return Wv(e);
		case "tool-single": return qv(e);
		case "tool-multi": return Jv(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Xv(e, t) {
	let n = t ? c({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? f(n) : u(n);
}
var Zv = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Qv(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, Zv({
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
			})), a = () => n === null ? "" : (n = null, Zv({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + Zv({
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
				text: (e) => e ? o("text") + Zv({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + Zv({
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
					for (let i of e) t++, r = !0, n += Zv({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + Zv({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + Zv({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => Zv({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + Zv({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + Zv({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Zv({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Zv({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Zv({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: ey(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Zv({ error: { message: e } }),
			end: (e) => e ? Zv({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? Zv({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Zv({
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
			error: (e) => Zv({ error: { message: e } }),
			end: (e) => Zv({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? Zv({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Zv({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Zv({ choices: [{
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
					...$v(e)
				}
			}] }) : "",
			error: (e) => Zv({ error: { message: e } }),
			end: (e) => (e ? Zv({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + Zv("[DONE]")
		};
	}
}
function $v(e) {
	let t = e.filter((e) => e.signature).map((e, t) => ({
		type: "reasoning.encrypted",
		data: e.signature,
		id: e.id,
		format: "google-gemini-v1",
		index: t
	}));
	return t.length ? { reasoning_details: t } : {};
}
function ey(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function ty(e, t) {
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
				...$v(t.toolCalls)
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
			input: ey(e.arguments)
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
					args: ey(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function ny(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function ry(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function iy(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var ay = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = ry(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = iy(t);
			if (r) {
				let t = this.open.has(e) ? oy(this.value, n) : void 0;
				sy(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function oy(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function sy(e, t, n) {
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
var cy = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function ly(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return cy(t) ? t : void 0;
}
function uy(e, t) {
	if (!cy(t)) return cy(e) ? e : void 0;
	if (!cy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = cy(r) && cy(n[e]) ? uy(n[e], r) : r);
	return n;
}
function dy(e, t) {
	if (!cy(t)) return cy(e) ? e : void 0;
	if (!cy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : cy(r) && cy(t) ? n[e] = dy(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var fy = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function py(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var my = class {
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
				let i = hy(n);
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
				args: new ay()
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
			let i = typeof e.signature == "string" && e.signature ? e.signature : hy(e);
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
function hy(e) {
	let t = e?.extra_content?.google?.thought_signature ?? e?.function?.extra_content?.google?.thought_signature;
	return typeof t == "string" && t ? t : void 0;
}
function gy(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function _y(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* vy(e, t) {
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
async function* yy(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = py(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new fy(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new my();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = py(t);
		if (n) throw new fy(n);
		i.text = gy(t), i.reasoning = _y(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = ly(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of vy(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = py(e);
		if (r) throw new fy(r);
		i.text += l(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = ly(e);
		c && (i.usage = uy(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var by = /* @__PURE__ */ sn({ current: null });
function xy(e, t) {
	return by.current = {
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
	}, by.current;
}
function Sy(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var Cy = "/api/backends/chat-completions/generate", wy = { pending: null }, Ty = (e) => e?.name === "AbortError";
function Ey(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? X("error.toolsUnsupported") : null;
}
async function Dy(e, t, n) {
	let r = Xv(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = Ey(e);
	if (a) return _("error", a, "Advanced Preset"), ny(a, 400);
	let o = e.origin === "task" ? kg(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = xy(e, i);
	if (!i) try {
		let i = await Ay(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(ty(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return ky(c, e);
	}
	let l = Qv(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await Ay(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			Ty(e) || (await p(l.error(Oy(e))), ky(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var Oy = (e) => e instanceof Error ? e.message : String(e);
function ky(e, t) {
	return e.status = Ty(t) ? "aborted" : "error", e.error = Oy(t), t instanceof fy ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : ny(Oy(t));
}
async function Ay(t, n, r, i, a, o) {
	let s = Xv(String(n.chat_completion_source ?? ""), n), l = Yv({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: s
	}), u = yc(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, m = t.structures.some((e) => e.kind === "annotations") ? (e) => rf(e, { final: !1 }).text : (e) => e, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, g = Date.now(), y = "", b, x = 0, S = !1, C, ee;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), u = Mh({
			genId: t.id,
			step: n,
			at: Date.now(),
			request: r
		});
		x++;
		let f = {
			text: "",
			reasoning: "",
			toolCalls: []
		};
		try {
			let n = await v(Cy, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), s = 0;
			for await (let e of yy(n, c(r), !!r.stream, a)) {
				f = e;
				let t = Date.now();
				if (t - s < 50) continue;
				s = t;
				let n = l.progress(e, !1);
				if (Sy(i, n, y + e.reasoning), p && d) {
					let e = n.stages[d]?.text ?? "";
					e && o(m(e.slice(0, e.length - Gs(e))).trimEnd());
				}
			}
			Kg(t), u.response = f.text || JSON.stringify(f.toolCalls), u.durationMs = Date.now() - u.at, u.usage = f.usage;
		} catch (e) {
			if (u.error = Oy(e), Ty(e) || a?.aborted) {
				(f.text || f.reasoning || f.toolCalls.length) && Kg(t), b = dy(b, f.usage), S = !0, ee = l.progress(f, !1);
				break;
			}
			if (!f.text && !f.toolCalls.length && wg(e) && Cg(t, s)) {
				t.signatureFallback = !0, t.warnings.push("thought signature rejected: retried without the built-in signature"), _("warning", X("error.signatureFallback"), X("app.name")), n--;
				continue;
			}
			throw e;
		}
		y += f.reasoning, b = dy(b, f.usage), l.progress(f, !0);
		let h = l.complete(f, n);
		if (h.callerToolCalls) {
			C = h.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (h.done) break;
	}
	let w = ee ?? l.result();
	if (S) for (let e of Object.values(w.stages)) e.status === "streaming" && (e.status = "interrupted");
	Sy(i, w, y);
	let te = jy(t, w, l.rawText(), l.callerResult?.(), y, {
		usage: b,
		requests: x,
		durationMs: Date.now() - g,
		interrupted: S
	});
	return te.toolCalls = C, te.usage = b, C && (te.content = ""), i.status = S ? "aborted" : "done", te;
}
function jy(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Uc(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Ks(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = rf(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = rf(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), S = v("recap"), C = v("memory"), ee = t.meta.mixed ? "meta-mixed" : "story", w = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? w = i === void 0 ? u || Ks(r).trim() : JSON.stringify(i) : u || (ee = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", w = b ? sc(b) : "", !w && x && typeof n.structures[x.id] == "string" && (w = "…"), !w && S && n.structures[S.id] && (w = "…"))), !w && !o.interrupted) throw Error(X("error.emptyTurn"));
	let te = [], T = [], ne = t.interceptorRan && t.stType !== "quiet";
	if (ne && C && Array.isArray(n.structures[C.id])) {
		let e = $p(n.structures[C.id]);
		te.push(...e.events), T = e.global;
	}
	if (ne && S && typeof n.structures[S.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		te.push({
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
	}), E = {
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
		events: te,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, D = {
		content: w,
		reasoning: a,
		sidecar: E,
		...T.length ? { global: T } : {}
	};
	return ne ? wy.pending = {
		ctx: t,
		outcome: D,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: E
	}), by.current?.genId === t.id && (by.current.structures = n.structures), D;
}
//#endregion
//#region src/app/updater.ts
var My = "advancedPreset.reloadedFor";
async function Ny() {
	try {
		let e = await v(`${s()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Py(e) {
	sessionStorage.setItem(My, e), _("info", X("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Fy() {
	let e = await Ny();
	e && e !== "e754142e1905d832" && sessionStorage.getItem(My) !== e && Py(e);
}
async function Iy() {
	await Fy();
}
var Ly = "/api/extensions/switch", Ry = (e) => e.replace(/^third-party/, "").replace(/^\/+|\/+$/g, "");
function zy(e, t, n) {
	if (!n.ok || typeof t.body != "string") return;
	let r;
	try {
		if (new URL(e, location.href).pathname !== Ly) return;
		r = JSON.parse(t.body).extensionName;
	} catch {
		return;
	}
	typeof r == "string" && Ry(r) === Ry(o()) && Fy();
}
async function By() {
	let e = o().replace(/^third-party\//, ""), t = await Wy(e, !1);
	if (t.status === 404 && (t = await Wy(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Ny();
	return r && r !== "e754142e1905d832" ? (Py(r), {
		upToDate: !1,
		reloading: !0
	}) : {
		upToDate: !!n.isUpToDate,
		reloading: !1
	};
}
async function Vy() {
	let e = await By();
	return e.reloading || !e.upToDate ? "updated" : "current";
}
var Hy = "advancedPreset.selfUpdateFor";
async function Uy(e, t) {
	let n = `1.11.0>${e}`;
	if (sessionStorage.getItem(Hy) === n) return !1;
	sessionStorage.setItem(Hy, n), _("info", X("update.forPreset", {
		name: t,
		version: e
	}));
	try {
		return (await By()).reloading;
	} catch (e) {
		return console.warn("[AP] self-update failed", e), !1;
	}
}
var Wy = (t, n) => v("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Gy = "__ap_gen_id";
function Ky(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function qy() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	y(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(Ky(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[Gy], r = typeof t == "string" ? Xm.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[Gy], r.claimed = !0;
				try {
					return await Dy(r, e, n.signal);
				} finally {
					Xm.release(t);
				}
			}
			e && (delete e[Gy], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		let r = await e.call(globalThis, t, n);
		return n?.method === "POST" && zy(Ky(t), n, r), r;
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Jy(e) {
	let t = Xm.takeArmed();
	t && (e[Gy] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function Yy(e) {
	let t = await c_(e);
	if (t === "invalid") return _("warning", X("storylines.invalidName"), X("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && _("warning", X("storylines.nameTaken", { name: n }), X("app.name")), t === "invalid" && _("warning", X("storylines.invalidName"), X("app.name"));
		let r = await g(`<h3>${m(X("storylines.switchTitle", { name: e }))}</h3><p>${m(X("storylines.askOldMain"))}</p>`, n, X("storylines.switch"), X("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = ou(n) ? await c_(e, n) : "invalid";
	}
	return t === "switched" && _("success", X("storylines.switched", { name: e }), X("app.name")), !0;
}
async function Xy(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) {
		t_(t, n.current), i.hide && (o_(n.current, { hide: !0 }), await e().saveMetadata());
		return;
	}
	let a = r && typeof r == "object" ? r : {}, o = Qg(), s = (e, t) => {
		let n = fu(du(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(Yg().main ?? "");
		let e = s(a.name, X("storylines.fallback.side"));
		return e !== Yg().main && !await r_(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), t_(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, X(i.ifLine ? "storylines.fallback.if" : "storylines.fallback.side"));
		o_(n, {
			ifLine: !!i.ifLine,
			hide: i.hide
		}), t_(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, X("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, X("storylines.fallback.main")) : void 0), u = await c_(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), _("warning", X("storylines.switchFailed", { name: c }), X("app.name")), t_(t, c);
	i.naming && n.input >= 0 && s_(n.input), t_(t, ""), u === "switched" && _("success", X("storylines.switched", { name: c }), X("app.name"));
}
function Zy(e, t) {
	if (!q().enabled) return e;
	let n = Em(), r = n ? qf(n) : void 0;
	if (!r || !Jg(r, am(r)) || su(e)) return e;
	let i = Zg(), a = i[t ?? i.length - 1];
	return !a || up(a) ? e : lu(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var Qy = "\0";
function $y(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = Rp(e);
		r && t.add(`${n.presetId}${Qy}${r}`);
	}
}
function eb(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && $y(r.extra?.[Ap], t), r.swipe_info?.forEach((e, t) => {
			t !== i && $y(e?.extra?.[Ap], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var tb = null;
function nb(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = eb(n.chat ?? []), o = new Set(a);
	if (tb && !t.reload && tb.chatId === r) for (let e of tb.active) i.has(e) || o.add(e);
	tb = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(Qy), i = s.get(n);
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
		n?.globalMemory && (Lp(n.globalMemory.log) && (l = !0), tm(n, t.off, !1) && (l = !0), tm(n, t.on, !0) && (l = !0));
	}
	return l && J(), l;
}
function rb(e) {
	Pp(e), nb();
}
function ib() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => rb(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => nb());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => nb({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var ab = 6e5, ob = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function sb(t, n) {
	let r = wy.pending;
	if (!r || Date.now() - r.at > ab || ob.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	wy.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), Np(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await Xy(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && em(nm(r.ctx.preset), a.global), nb(), by.current?.genId === r.ctx.id && (by.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var cb = /* @__PURE__ */ new Set();
function lb(e) {
	for (let t of cb) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function ub(t) {
	let n = e().chat[t], r = jp(n)?.annotations;
	return !n || !r?.length ? [] : cf(n.mes, r).annotations;
}
function db(t) {
	let n = e().chat[t], r = jp(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = cf(n.mes, r.annotations);
	return i.changed ? (Np(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function fb() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (db(n) && e().saveChat(), lb(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => lb(Number(e)));
}
var pb = {
	get: (e) => ub(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return cb.add(t), () => cb.delete(t);
	}
};
//#endregion
//#region src/store/bundled-modules.ts
function mb(e, t, n, r) {
	return Kd({
		...Y(ff(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function hb(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of uf(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = mb(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = _f(o), u = gf(c), d = n?.[o.id];
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
		let f = gf(s);
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
function gb(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function _b(e, t, n = []) {
	let r = nm(e), i = _h(e), a = { ...t.records };
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
function vb(e, t, n) {
	let r = uf(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && mb(e, i, n, t.enabled);
		if (i && a && gf(a) === gf(t)) {
			let { enabled: e, ...n } = Y(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return mf(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function yb(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var bb = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
//#endregion
//#region src/app/bundled-modules.ts
function xb(e, t, n) {
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
async function Sb(e, t) {
	let { root: n, checked: r } = xb(X("um.bundled.conflictTitle"), X("um.bundled.conflictBody", { name: ip(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: X(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await h(n, X("um.bundled.apply"), X("um.bundled.keepAll")) ? r() : [];
}
async function Cb(e, t) {
	let n = nm(e), r = hb(e, _h(e), n.bundledModules, tp());
	if (gb(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await Sb(e, a)), _b(e, r, i), r.add.length && _("info", X("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), ip(e));
}
var wb = /* @__PURE__ */ new Map();
function Tb(e, t = {}) {
	let n = e.id, r = (wb.get(n) ?? Promise.resolve()).then(() => Cb(qf(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return wb.set(n, r), r;
}
function Eb(e, t, n) {
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
async function Db(e) {
	let t = _h(e), n = Eb(X("presetFile.installer"), X("presetFile.installerHint"), !0), r, i = () => [];
	if (t.length) {
		let a = xb(X("um.bundled.exportTitle", { name: ip(e) }), X("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || X("um.untitled"),
			...e.enabled ? {} : { note: X("um.bundled.disabled") },
			checked: !0
		})));
		a.root.append(n.root), r = a.root, i = a.checked;
	} else {
		r = document.createElement("div"), r.style.textAlign = "start";
		let t = document.createElement("h3");
		t.textContent = X("um.bundled.exportTitle", { name: ip(e) }), r.append(t, n.root);
	}
	if (!await h(r, X("um.bundled.export"), X("common.cancel"))) return !1;
	let a = i(), o = vb(e, t.filter((e) => a.includes(e.id)), tp()), s = Ll(o, o.defaultConfiguration, void 0).sampling;
	return yb(`${bb(e.id)}.apreset.json`, $u(o, {
		installer: n.box.checked,
		sampling: s
	})), !0;
}
//#endregion
//#region src/app/dev-source.ts
var Ob = /* @__PURE__ */ sn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), kb = 1500, Ab = null;
async function jb() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await v(`${n}/`, { cache: "no-store" })).json();
		if (Ob.status = "online", Ob.error = e.ok === !1 ? "build failed" : "", Ob.at = Date.now(), !e.hash || e.hash === Ob.hash) return;
		let t = Hf(await (await v(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Ob.presetId && Ob.presetId !== t.id && Xf(null, Ob.presetId), Xf(t), Ob.presetId = t.id, Ob.hash = t.hash, hm(t), await jm(t), Tb(t, { auto: !0 }), jh("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Ob.status = "error", Ob.error = e instanceof Error ? e.message : String(e);
	}
}
function Mb() {
	if (Ab && clearTimeout(Ab), Ab = null, !q().dev.enabled) return Ob.presetId && Xf(null, Ob.presetId), Object.assign(Ob, {
		status: "off",
		presetId: "",
		hash: "",
		error: ""
	}), Promise.resolve();
	Ob.status === "off" && (Ob.status = "connecting");
	let e = async () => {
		await jb(), q().dev.enabled && (Ab = setTimeout(e, kb));
	};
	return e();
}
function Nb() {
	let e = Promise.resolve();
	return dr(() => [q().dev.enabled, q().dev.url], () => {
		Ob.hash = "", e = Mb();
	}, { immediate: !0 }), e;
}
//#endregion
//#region src/app/impersonate.ts
var Pb = "#option_impersonate, #mes_impersonate", Fb = () => document.querySelector("#send_textarea");
function Ib(e, t = !1, n) {
	let r = Fb();
	r && (r.value = n === void 0 ? e : Zy(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function Lb() {
	if (!q().enabled) return null;
	let t = Em(), n = t ? qf(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = am(n);
	if (!Vm(r)) return null;
	let i = Rs(n.meta.impersonatePrompt, (e) => e[0] === "name" ? xu(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function Rb(e) {
	if (!e.target?.closest?.(Pb)) return;
	let t = Lb();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = Fb()?.value.trim();
	Ib(Zy(n ? `${t}\n${n}` : t), !0);
}
function zb() {
	window.addEventListener("click", Rb, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function Bb(e) {
	let t = Nc(e);
	if (!t) return !1;
	let n = q().presets[e.id]?.customUi, r = Wf(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function Vb(e) {
	let t = q().presets[e.id]?.customUi;
	return !!(t && t.hash === Nc(e));
}
function Hb(e, t) {
	nm(e).customUi = {
		enabled: t,
		hash: Nc(e)
	}, J();
}
//#endregion
//#region src/app/trust.ts
var Ub = class extends Error {
	constructor() {
		super(X("trust.declined")), this.name = "TrustDeclined";
	}
}, Wb = (e) => e instanceof Ub, Gb = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function Kb(e, t, n, r) {
	return [
		`<h3>${m(e)}</h3>`,
		`<p>${m(X("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${m(X("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${m(r)}</pre>`
	].join("");
}
var qb = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function Jb(e, t) {
	let n = xl(e);
	if (!n.length || t && Gb(n, xl(t))) return;
	let r = ip(e);
	if (!await h(Kb(X("trust.presetTitle"), X("trust.preset", { name: r }), n.length, qb(n)), X("trust.install"), X("common.cancel"))) throw new Ub();
}
async function Yb(e, t) {
	let n = Rf(e);
	if (!(!n.length || t && Gb(n, Rf(t))) && !await h([
		`<h3>${m(X("trust.qrTitle"))}</h3>`,
		`<p>${m(X("trust.qrBody", {
			name: ip(e),
			n: n.length
		}))}</p>`,
		`<p>${m(X("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${m(qb(n))}</pre>`
	].join(""), X("trust.install"), X("common.cancel"))) throw new Ub();
}
async function Xb(e) {
	let t = Nd(e);
	if (t.length && !await h(Kb(X("trust.modulesTitle"), X("trust.modules", { n: e.length }), t.length, qb(t)), X("trust.import"), X("common.cancel"))) throw new Ub();
}
async function Zb(e) {
	let t = jc(e);
	if (!t.length) return !1;
	let n = t.map((t) => rp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(X("common.listSeparator")), r = await h([
		`<h3>${m(X("trust.uiTitle"))}</h3>`,
		`<p>${m(X("trust.uiBody", {
			name: ip(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${m(X("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${m(qb(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), X("trust.enableUi"), X("trust.notNow"));
	return Hb(e, r), r;
}
async function Qb(e) {
	jc(e).length && !Vb(e) && await Zb(e);
}
//#endregion
//#region src/app/install.ts
var $b = class extends Error {
	constructor(e) {
		super(X("presets.apUpdating", { name: ip(e) })), this.name = "ApUpdating";
	}
}, ex = (e) => e instanceof $b;
function tx(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
var nx = "advancedPreset.pendingInstall";
function rx(e, t) {
	try {
		sessionStorage.setItem(nx, JSON.stringify({
			artifact: e,
			...t ? { source: t } : {}
		}));
	} catch (e) {
		console.warn("[AP] could not keep the preset for after the update", e);
	}
}
async function ix(e, t) {
	let n = Hf(e);
	if (!n) throw Error(X("presets.invalid"));
	if (n.minAdvancedPreset && Cl("1.11.0", n.minAdvancedPreset) < 0) throw await Uy(n.minAdvancedPreset, ip(n)) ? (rx(n, t), new $b(n)) : Error(X("presets.tooNew", { version: n.minAdvancedPreset }));
	await Jb(n, qf(n.id)), await Yb(n, qf(n.id)), Jf(n), t && (q().sources[n.id] = t), q().declinedUpdates?.[n.id] && delete q().declinedUpdates[n.id], J();
	let r = qf(n.id) ?? n;
	return hm(r), Wf(r.id)?.source === "installed" && await Qb(r), await jm(r), await Tb(r), r;
}
async function ax(e) {
	let t = await v(tx(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return t.json();
}
async function ox(e, t = !0) {
	return ix(await ax(e), t ? e.trim() : void 0);
}
async function sx(e) {
	return ix(JSON.parse(await e.text()));
}
function cx(e) {
	if (Wf(e)?.source !== "installed") return;
	let t = q().sources[e];
	if (t) return {
		url: t,
		remembered: !0
	};
	let n = qf(e)?.updateUrl;
	return Hu(n) ? {
		url: n.trim(),
		remembered: !1
	} : void 0;
}
async function lx(e) {
	let t = cx(e);
	if (!t) throw Error(X("presets.noSource"));
	return ox(t.url, t.remembered);
}
async function ux() {
	for (let { preset: e } of Uf()) {
		let t = cx(e.id);
		if (!t) continue;
		let n;
		try {
			n = Hf(await ax(t.url));
		} catch (n) {
			console.warn("[AP] preset update check failed", e.id, t.url, n);
			continue;
		}
		if (!n || n.id !== e.id) console.warn("[AP] the update source does not hold this preset", e.id, t.url);
		else if (!(Cl(n.version, e.version) <= 0 || q().declinedUpdates?.[n.id] === n.hash)) try {
			let e = await ix(n, t.remembered ? t.url : void 0);
			_("success", X("presets.autoUpdated", { version: e.version }), ip(e));
		} catch (t) {
			if (ex(t)) return;
			Wb(t) ? (q().declinedUpdates = {
				...q().declinedUpdates,
				[n.id]: n.hash
			}, J(), _("info", t.message, ip(n))) : console.warn("[AP] preset update failed", e.id, t);
		}
	}
}
async function dx() {
	let e = sessionStorage.getItem(nx);
	if (!e) return;
	sessionStorage.removeItem(nx);
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	try {
		let e = await ix(t.artifact, t.source);
		_("success", X("presets.installed"), ip(e));
	} catch (e) {
		if (ex(e)) return;
		Wb(e) ? _("info", e.message, X("app.name")) : _("error", e instanceof Error ? e.message : String(e), X("app.name"));
	}
}
function fx() {
	let e = [];
	for (let [t, n] of Object.entries(q().installed)) {
		let r = Qf(t), i = Hf(n);
		!r || !i || Cl(r.version, i.version) <= 0 || (Yf(t), delete q().sources[t], q().declinedUpdates?.[t] && delete q().declinedUpdates[t], e.push(r));
	}
	return e;
}
async function px(t) {
	if (Yf(t), delete q().sources[t], q().declinedUpdates?.[t] && delete q().declinedUpdates[t], J(), Zf(t)) {
		let e = qf(t);
		e && (hm(e), await jm(e), await Tb(e));
		return;
	}
	let n = km(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/state.ts
var Z = /* @__PURE__ */ sn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), mx = () => {
	Z.chatRev++;
}, hx = () => {
	Z.presetId = Em();
}, gx = K(() => Z.presetId ? qf(Z.presetId) : void 0), _x = K(() => {
	let e = gx.value;
	if (!e) return { config: "" };
	let t = nm(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : rp(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function vx(t) {
	return Z.chatRev, e().chat[t];
}
function yx(e) {
	return jp(vx(e));
}
function bx(e) {
	Z.storylineFocus = e, xx("storylines");
}
function xx(e) {
	e && (Z.tab = e), Z.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var Sx = "openai_preset_import_file", Cx = "export_oai_preset";
function wx(e) {
	let t = Ju(e);
	return typeof t == "object" && !!t && typeof t.id == "string" && Array.isArray(t.entries);
}
var Tx = /* @__PURE__ */ new WeakSet();
async function Ex(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (wx(n)) {
		e.value = "";
		try {
			let e = await ix(n);
			await Pm(e), hx(), _("success", X("presets.installed"), ip(e)), xx("presets");
		} catch (e) {
			Wb(e) || ex(e) ? _("info", e.message, X("app.name")) : _("error", e instanceof Error ? e.message : String(e), X("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		Tx.add(t), e.dispatchEvent(t);
	}
}
function Dx() {
	let e = Em(), t = e ? qf(e) : void 0;
	return t ? (Db(t).catch((e) => _("error", e instanceof Error ? e.message : String(e), X("app.name"))), !0) : !1;
}
function Ox() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== Sx || Tx.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), Ex(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${Cx}`) && Dx() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/app/preset-files.ts
var kx = () => e().getPresetManager("openai");
function Ax() {
	let e = kx()?.getPresetList();
	return e ? Object.entries(e.preset_names).flatMap(([t, n]) => {
		let r = qu(e.presets[n]);
		return r ? [{
			name: t,
			artifact: r.artifact
		}] : [];
	}) : [];
}
async function jx(e, t) {
	let n = cd(t);
	if (!n) {
		console.warn("[AP] preset file in an unsupported format", e);
		return;
	}
	if (n.minAdvancedPreset && Cl("1.11.0", n.minAdvancedPreset) < 0) {
		await Uy(n.minAdvancedPreset, ip(n)) || console.warn("[AP] preset file needs a newer Advanced Preset", e, n.minAdvancedPreset);
		return;
	}
	let r = q().declinedPresetFiles ?? {};
	if (r[e] === n.hash) return;
	let i = qf(n.id);
	if (!i || i.hash !== n.hash && Cl(n.version, i.version) >= 0) try {
		await ix(n);
	} catch (t) {
		Wb(t) ? (q().declinedPresetFiles = {
			...r,
			[e]: n.hash
		}, J(), _("info", t.message, ip(n))) : _("error", t instanceof Error ? t.message : String(t), e);
		return;
	}
	let a = qf(n.id), o = kx();
	if (!a || !o) return;
	let s = await jm(a, { select: o.getSelectedPresetName() === e });
	if (s !== e && await o.deletePreset(e), r[e]) {
		let { [e]: t, ...n } = r;
		q().declinedPresetFiles = n, J();
	}
	hx(), _("success", X("presetFile.adopted", {
		file: e,
		carrier: s
	}), ip(a));
}
var Mx = Promise.resolve();
function Nx(e) {
	return Mx = Mx.then(async () => {
		for (let { name: t, artifact: n } of Ax()) if (e === void 0 || t === e) try {
			await jx(t, n);
		} catch (e) {
			console.error("[AP] preset file adoption failed", t, e);
		}
	}), Mx;
}
function Px() {
	let e = kx()?.getSelectedPresetName();
	e && Ax().some((t) => t.name === e) && Nx(e);
}
//#endregion
//#region src/app/quick-replies.ts
function Fx(e) {
	let t = am(e), n = (n) => e.actors[n] ? xu(e, t, n) : void 0, r = np(e)?.quickReplySets;
	return (e.quickReplySets ?? []).map((e) => ({
		decl: e,
		st: If(e, n, r?.[e.id])
	}));
}
function Ix(e) {
	let t = JSON.stringify(e), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Lx(e, t) {
	let n = e.getSetByName(t.name);
	if (n) {
		n.disableSend = t.disableSend, n.placeBeforeInput = t.placeBeforeInput, n.injectInput = t.injectInput, n.color = t.color, n.onlyBorderColor = t.onlyBorderColor;
		for (let e of n.qrList) e.unrender?.(), e.unrenderSettings?.();
		n.qrList.splice(0);
		for (let e of t.qrList) n.addQuickReply(Y(e));
		n.updateColor?.(), n.rerender?.(), n.save();
	}
}
var Rx = /* @__PURE__ */ new Set();
async function zx(e, t, n) {
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
		let n = t.sets.filter(({ st: t }) => !e.getSetByName(t.name) || r[t.name] ? !0 : (Rx.has(t.name) || (Rx.add(t.name), _("warning", X("quickReplies.conflict", { name: t.name }), X("app.name"))), !1)), a = /* @__PURE__ */ new Set();
		for (let { st: t } of n) e.getSetByName(t.name) || (await e.createSet(t.name, {
			disableSend: t.disableSend,
			placeBeforeInput: t.placeBeforeInput,
			injectInput: t.injectInput
		}), a.add(t.name));
		for (let { st: i } of n) {
			let n = Ix(i);
			(a.has(i.name) || r[i.name]?.hash !== n) && (Lx(e, i), r[i.name] = {
				presetId: t.presetId,
				hash: n
			}, o = !0);
		}
		for (let { decl: t, st: r } of n) t.global && !i(r.name) && e.addGlobalSet(r.name, t.visible);
	}
	o && J();
}
function Bx() {
	let e = K(() => {
		let e = q().enabled ? gx.value : void 0, t = e ? Fx(e) : [], n = Uf().map((e) => e.preset);
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
	dr(() => e.value.key, () => {
		let n = p();
		if (!n) return;
		let { active: r, known: i } = e.value;
		t = t.then(() => zx(n, r, i)).catch((e) => console.error("[AP] Quick Reply sync failed", e));
	}, { immediate: !0 });
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var Vx = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", Hx = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.switch.sm{width:1.8em;height:1.05em}.switch.sm .thumb{width:.75em;height:.75em;top:.15em;left:.15em}.switch.sm input:checked~.thumb{transform:translate(.75em)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", Ux = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}.storyline-badge svg.lucide.storyline-hidden{color:var(--ap-muted)}", Wx = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.tab span{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry>*,.um-entry-head>*{transition:opacity .15s}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>.switch{margin-right:6px}.um-entry.off .um-entry-head>:not(.switch),.um-entry.off>:not(.um-entry-head){opacity:.55}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text,.um-var-key,.um-var-value{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-text{field-sizing:content;min-height:5.5em;max-height:24em}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:auto 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row>.switch{margin:calc(.375em + 1px) 4px 0 0}.um-var-pair{padding:2px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:2px;display:flex}.um-var-pair-head{align-items:center;gap:2px;margin-right:-6px;display:flex}.um-var-key{text-overflow:ellipsis;flex:auto;min-width:0;font-weight:600}.um-var-row>*,.um-var-pair>*,.um-var-pair-head>*{transition:opacity .15s}.um-var-row.off>:not(.switch),.um-var-pair.off>:not(.um-var-pair-head),.um-var-pair.off .um-var-pair-head>:not(.switch){opacity:.55}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=420px){.tabs.many .tab span{display:none}.tabs.many .tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tabs.many .tab svg.lucide{width:1.35em;height:1.35em}}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:calc(2.51429em + 8px)}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storylines-head{gap:var(--ap-space-2);min-height:1.6em;padding:0 var(--ap-space-1) 0 var(--ap-space-3)}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-card.hidden .card-title{color:var(--ap-muted)}.storyline-dot{background:var(--ap-primary);border-radius:50%;flex:none;width:.5em;height:.5em}.storyline-flag{width:1.05em;height:1.05em;color:var(--ap-faint);flex:none}.storyline-toolbar{margin-bottom:var(--ap-space-1);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);align-self:flex-start;align-items:center;gap:2px;padding:2px;display:flex}.storyline-toolbar .icon-btn[aria-pressed=true]{background:var(--ap-tint)}.storyline-toolbar.solo{padding:0}.storyline-toolbar.solo .icon-btn.sm{width:calc(1.6em - 2px);height:calc(1.6em - 2px)}.storyline-toolbar-sep{background:var(--ap-border);align-self:stretch;width:1px;margin:3px 2px}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", Gx = /* @__PURE__ */ sn({ mode: "light" }), Kx = new CSSStyleSheet();
Kx.replaceSync([
	Vx,
	Hx,
	Ux,
	Wx
].join("\n"));
var qx = new CSSStyleSheet(), Jx = [Kx, qx], Yx = [
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
function Xx(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of Yx) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function Zx(e) {
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
function Qx() {
	let e = Zx(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var $x = /* @__PURE__ */ new Set();
function eS(e) {
	return $x.add(e), e.dataset.apTheme = Gx.mode, () => $x.delete(e);
}
function tS() {
	let e = Qx();
	if (e !== Gx.mode) {
		Gx.mode = e;
		for (let t of $x) t.dataset.apTheme = e;
	}
}
function nS() {
	Gx.mode = Qx();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(tS);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), lr(() => {
		let e = gx.value?.theme?.[Gx.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(Xx(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(Xx("primary", t.primary)), t.accent && n.push(Xx("accent", t.accent)), qx.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function rS(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function iS(e, t, n = []) {
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
			e.adoptedStyleSheets = Jx, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = eS(this), this.app = gs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var aS = 6, oS = 8;
function sS(e, t, n, r = "center", i = !1) {
	let a = e.top - aS - t.height >= oS, o = e.bottom + aS + t.height <= n.height - oS, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - aS - t.height : e.bottom + aS;
	c = Math.max(oS, Math.min(c, n.height - oS - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(oS, Math.min(l, n.width - oS - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function cS(e, t) {
	let n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = sS(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return dr(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Wn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Gr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var lS = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), uS = /* @__PURE__ */ new Set([
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
]), dS = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function fS(e) {
	return dS(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function pS(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${fS(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${fS(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${fS(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function mS(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = mS(e, t);
			n && i.appendChild(n);
		}
	};
	if (!lS.has(r) && !uS.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = mS(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function hS(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return pS(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", pS(e.textContent));
			continue;
		}
		let t = mS(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function gS(e, t, n, r) {
	return e && np(e)?.workflows?.[t]?.stages?.[n] || r;
}
function _S(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return rS(e?.actors[t]?.color, n);
}
function vS(e) {
	return K(() => {
		let t = e(), n = yx(t), r = by.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = qf(r.presetId);
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
					label: gS(e, r.workflow, t.id, t.label),
					color: _S(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = qf(n.presetId);
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
				label: gS(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: _S(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var yS = /* @__PURE__ */ sn({
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
}), bS, xS, SS = null;
function CS(t) {
	let n = qf(jp(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = xu(n, am(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: _S(n, n.narrator)
	};
}
function wS(e, t) {
	clearTimeout(bS), clearTimeout(xS), xS = void 0, SS = null, yS.key !== e.key && Object.assign(yS, CS(e.mesId), { html: hS(e.ann.comment) }), Object.assign(yS, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), yS.rev++;
}
function TS() {
	clearTimeout(bS), clearTimeout(xS), xS = void 0, SS = null, yS.open && (yS.open = !1, yS.pinned = !1, yS.key = null);
}
function ES(e) {
	if (!yS.pinned) {
		if (e) {
			if (yS.open && yS.key === e.key) {
				clearTimeout(xS), xS = void 0;
				return;
			}
			if (SS === e.key) return;
			clearTimeout(bS), SS = e.key, bS = setTimeout(() => wS(e, !1), 150);
		} else clearTimeout(bS), SS = null, kS();
	}
}
function DS(e) {
	e && !(yS.open && yS.key === e.key) ? wS(e, !0) : TS();
}
function OS() {
	clearTimeout(xS), xS = void 0;
}
function kS() {
	!yS.open || yS.pinned || xS || (xS = setTimeout(TS, 200));
}
function AS(e) {
	yS.key && e.has(yS.key) && TS(), SS && e.has(SS) && (clearTimeout(bS), SS = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var jS = {
	key: 0,
	class: "anno-author"
}, MS = ["innerHTML"], NS = /* @__PURE__ */ I({
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
			let r = e.getBoundingClientRect(), i = yS.rect, a = sS(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return dr(() => yS.open && yS.rev, async (e) => {
			if (!e) return;
			await Wn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Gr(() => {
			yS.open = !1;
		}), (e, n) => P(yS).open ? (z(), B("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: je({ "--actor": P(yS).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => P(OS) && P(OS)(...e),
			onMouseleave: n[1] ||= (...e) => P(kS) && P(kS)(...e)
		}, [P(yS).author ? (z(), B("div", jS, j(P(yS).author), 1)) : G("", !0), H("div", {
			class: "rich anno-text",
			innerHTML: P(yS).html
		}, null, 8, MS)], 36)) : G("", !0);
	}
}), PS = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, FS = /\s/, IS = /[“”„‟〝〞＂「」]/, LS = /[‘’‚‛『』＇]/;
function RS(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!PS.test(i)) {
			if (FS.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else IS.test(i) ? i = "\"" : LS.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var zS = (e) => RS(e).text;
function BS(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function VS(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function HS(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function US(e, t, n, r = RS(e)) {
	let i = zS(n.quote).trim();
	if (!i) return null;
	let a = BS(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = zS(n.prefix), s = zS(n.suffix), c = 0, l = a.map((t) => {
			let n = VS(e, r.text.slice(Math.max(0, t - e.length), t)) + HS(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = BS(zS(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function WS(e, t, n = !1) {
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
var GS = /* @__PURE__ */ new Set([
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
function KS(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (GS.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = KS(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function qS(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? GS.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && KS(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function JS(e, t, n) {
	let r = qS(e), i = r.map((e) => e.data), a = i.join(""), o = RS(a), s = [];
	for (let e of n) {
		let n = US(a, t, e, o);
		n && s.push({
			ann: e,
			start: WS(i, n[0]),
			end: WS(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function YS(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var XS = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function ZS(e, t) {
	let n = [...e.located].sort((e, t) => XS(e.start, t.start) ? 1 : XS(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && XS(r, i.end))) {
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
function QS(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var $S = "ap-anno", eC = "ap-anno-style", tC = /* @__PURE__ */ new Map(), nC = 0, rC = "#a855f7", iC = () => null;
function aC(e) {
	iC = e;
}
function oC() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${rC}; }
::highlight(${$S}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function sC(e) {
	let t = e.getElementById(eC);
	t || (t = e.createElement("style"), t.id = eC, (e.head ?? e.documentElement).append(t)), t.textContent !== oC() && (t.textContent = oC());
}
function cC(e) {
	if (e !== rC) {
		rC = e;
		for (let e of hC()) sC(e.doc);
	}
}
function lC(e, t) {
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
var uC = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function dC(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => uC(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: lC(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (uC(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: lC(n, e.doc)
			};
		}
	}
	return null;
}
function fC(e) {
	let t = iC();
	return !!(t && e.composedPath().includes(t));
}
function pC(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !fC(r) && ES(dC(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (fC(t)) return;
		let n = dC(e, t);
		i === "mouse" ? n || TS() : DS(n);
	}, c = (e) => {
		fC(e) || TS();
	}, l = () => ES(null);
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
function mC(e) {
	let t = tC.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get($S) ?? new i(), r.set($S, a)), sC(e), t = {
		doc: e,
		serial: ++nC,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = pC(t), tC.set(e, t), t;
}
function hC() {
	for (let [e, t] of tC) e.defaultView || (t.detach(), tC.delete(e));
	return [...tC.values()];
}
function gC(e) {
	mC(e);
}
function _C(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function vC(e, t, n, r, i) {
	let a = yC(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = mC(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = YS(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			ZS(r, (t, r) => {
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
	a.size && AS(a);
}
function yC(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [tC.get(t)].filter((e) => !!e) : hC()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && QS(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), tC.delete(i.doc));
		}
	}
	return r;
}
function bC(e, t) {
	let n = yC(e, t);
	n.size && AS(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var xC = /* @__PURE__ */ new Set();
function SC(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var CC = () => q().ui.annotations?.show !== !1, wC = class {
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
		}), xC.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && bC(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && bC(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			bC(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = by.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && CC() ? ub(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		vC(this, document, t, a.length ? JS(this.el, o, a) : null, !_C(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (vC(this, n, t, a.length && !SC(n) ? JS(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), bC(this), xC.delete(this);
		}
	}
};
function TC(e, t) {
	for (let n of xC) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function EC() {
	for (let e of xC) e.hasFrames && e.schedule(0);
}
function DC() {
	for (let e of xC) e.el.isConnected || e.dispose();
}
var OC = /* @__PURE__ */ new WeakMap();
function kC(e) {
	let t = OC.get(e);
	(!t || t.disposed) && OC.set(e, new wC(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var AC = () => window.__TAURITAVERN__?.api?.chatSurface, jC = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return AC()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), MC = !1;
function NC() {
	let t = AC();
	!MC && t && jC() && (t.protocolVersion === 1 ? (MC = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new wC(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function PC(e, t) {
	t && !jC() && kC(e);
}
var FC = null;
function IC() {
	return (!FC || !FC.isConnected) && (FC = document.createElement("ap-anno-bubble"), document.body.append(FC)), FC;
}
function LC() {
	iS("ap-anno-bubble", NS), IC(), aC(() => FC), gC(document), lr(() => {
		let e = q().ui, t = gx.value?.theme?.[Gx.mode]?.accent;
		cC(e.annotations?.color || e.accent || t || (Gx.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), dr(CC, () => {
		TS(), TC(void 0, 0);
	}), dr(() => by.current?.status, () => TC()), pb.on("change", (e) => TC(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		TS(), DC();
	});
	t.on("message_iframe_render_ended", () => EC()), addEventListener("resize", () => TS());
}
//#endregion
//#region src/ui/storylines.ts
var RC = K(() => {
	Z.chatRev;
	let e = gx.value;
	return !!(e && Jg(e, am(e)));
}), zC = null;
function BC() {
	let t = e().chat ?? [];
	return (!zC || zC.rev !== Z.chatRev || zC.chat !== t || zC.len !== t.length) && (zC = {
		rev: Z.chatRev,
		chat: t,
		len: t.length,
		keys: Zg(t)
	}), zC.keys;
}
var VC = () => {
	zC = null;
}, HC = 60, UC = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > HC ? `${t.slice(0, HC)}…` : t;
};
function WC(t) {
	Z.chatRev;
	let n = e().chat ?? [], r = BC(), i = Yg(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? jp(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: UC(s?.event || xp(o))
			});
		}), {
			key: e,
			name: gp(e, i),
			main: e === "",
			if: mp(e, i),
			hidden: hp(e, i),
			pending: up(e),
			current: e === o,
			floors: a
		};
	}).filter((e) => e.main || e.floors.length);
}
async function GC(t) {
	let n = e(), r = document.querySelector(`#chat > .mes[mesid="${t}"]`);
	r ? r.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}) : n.executeSlashCommandsWithOptions && await n.executeSlashCommandsWithOptions(`/chat-jump ${t}`, { handleExecutionErrors: !0 });
}
//#endregion
//#region src/ui/storyline-tag.ts
var KC = "data-ap-storyline-tag", qC = "ap-storyline-tag-hidden";
function JC(e, t, n) {
	let r = e.querySelectorAll(`[${KC}]`);
	if (r.length) {
		for (let e of r) e.classList.toggle(qC, n);
		return;
	}
	if (!n || !t?.is_user) return;
	let i = su(t.mes);
	if (!i) return;
	let a = t.mes.slice(i.at).trim(), o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = null;
	for (; o.nextNode();) o.currentNode.textContent?.trim() && (s = o.currentNode);
	if (!s) return;
	let c = s.parentElement, l = s.textContent ?? "", u = a.slice(1);
	if (c && c !== e && /^H[1-6]$/.test(c.tagName) && c.textContent?.trim() === u) {
		c.setAttribute(KC, ""), c.classList.add(qC);
		return;
	}
	let d = l.trimEnd();
	if (!d.endsWith(a)) return;
	let f = d.length - a.length, p = s.splitText(f), m = document.createElement("span");
	m.setAttribute(KC, ""), m.className = qC, p.replaceWith(m), m.append(p);
}
//#endregion
//#region src/ui/mounts.ts
var YC = "ap-hidden", XC = [
	"meta-pure",
	"impersonate",
	"summary"
];
function ZC(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function QC(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = jp(a), s = by.current?.mesId === n;
	a && !a.is_user && PC(i, !!(o?.annotations?.length || s));
	let c = RC.value;
	JC(i, a, c);
	let l = !(!a || a.is_user || !o && !s), u = r.querySelector(":scope > ap-stages"), d = r.querySelector(":scope > ap-top-cards"), f = r.querySelector(":scope > ap-cards");
	l ? ((!d || d.nextElementSibling !== i) && (d?.remove(), d = ZC("ap-top-cards", n), d.setAttribute("position", "top"), i.before(d)), (!u || u.nextElementSibling !== d) && (u?.remove(), u = ZC("ap-stages", n), d.before(u)), (!f || f.previousElementSibling !== i) && (f?.remove(), f = ZC("ap-cards", n), i.after(f)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), f.getAttribute("mesid") !== String(n) && f.setAttribute("mesid", String(n)), i.classList.toggle(YC, !!(!s && o && XC.includes(o.turn))), $C(r, i, n, c)) : (u?.remove(), d?.remove(), f?.remove(), i.classList.remove(YC), $C(r, i, n, c));
}
function $C(e, t, n, r) {
	let i = e.querySelector(":scope > ap-storyline");
	if (!r || !BC()[n]) {
		i?.remove();
		return;
	}
	let a = e.querySelector(":scope > ap-stages") ?? e.querySelector(":scope > ap-top-cards") ?? t;
	i ||= ZC("ap-storyline", n), i.nextElementSibling !== a && a.before(i), i.getAttribute("mesid") !== String(n) && i.setAttribute("mesid", String(n));
}
function ew(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) QC(t);
}
function tw() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var nw = 0, rw = /* @__PURE__ */ new Set(), iw = !1;
function aw(e) {
	e ? rw.add(e) : iw = !0, !nw && (nw = requestAnimationFrame(() => {
		if (nw = 0, VC(), iw) ew();
		else for (let e of rw) e.isConnected && QC(e);
		rw.clear(), iw = !1, tw(), DC();
	}));
}
function ow() {
	mx(), aw();
}
function sw() {
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
	]) e && t.on(e, ow);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && aw(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && aw(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), aw();
	};
	r(), dr(() => RC.value, () => ow());
	let i;
	dr(() => by.current && by.current.status === "running" && by.current.streaming && by.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = by.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), ow());
		}, 100));
	}), dr(() => by.current?.status, () => aw());
}
//#endregion
//#region src/ui/entry.ts
var cw = "left-nav-panel", lw = "ap-preset-banner";
function uw() {
	return document.getElementById(cw);
}
function dw() {
	let e = uw();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function fw() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== lw && e.after(document.createElement(lw));
}
var pw = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function mw() {
	dr(() => Z.presetId, (e) => {
		for (let t of document.querySelectorAll(pw.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function hw(e) {
	let t = uw();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function gw() {
	let e = uw();
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
function _w() {
	fw(), mw(), gw(), dr(() => Z.panelOpen, (e) => {
		e && dw();
	});
	let e = uw();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Z.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var vw = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, yw = (e) => e === "", bw = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), xw = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Sw = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Cw = (e) => {
	let t = Sw(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, ww = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, Tw = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = ww.width, color: s = ww.stroke, ...c }, { slots: l }) => Va("svg", {
	...ww,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": yw(n) || yw(r) || n === !0 || r === !0 ? Number(i || a || ww["stroke-width"]) * 24 / Number(o) : i || a || ww["stroke-width"],
	class: bw("lucide", c.class, ...e ? [`lucide-${xw(Cw(e))}-icon`, `lucide-${xw(e)}`] : ["lucide-icon"]),
	...!l.default && !vw(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Va(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Va(Tw, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), Ew = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), Dw = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), Ow = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), kw = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), Aw = Q("brain", [
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
]), jw = Q("bug", [
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
]), Mw = Q("cable", [
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
]), Nw = Q("calendar-days", [
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
]), Pw = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Fw = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), Iw = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), Lw = Q("circle-dashed", [
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
]), Rw = Q("circle-question-mark", [
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
]), zw = Q("circle-slash", [["circle", {
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
}]]), Bw = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), Vw = Q("cloud-fog", [
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
]), Hw = Q("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), Uw = Q("cloud-rain", [
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
]), Ww = Q("cloud-sun", [
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
]), Gw = Q("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), Kw = Q("code-xml", [
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
]), qw = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), Jw = Q("coins", [
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
]), Yw = Q("copy-plus", [
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
]), Xw = Q("copy", [["rect", {
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
}]]), Zw = Q("crown", [["path", {
	d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
	key: "1vdc57"
}], ["path", {
	d: "M5 21h14",
	key: "11awu3"
}]]), Qw = Q("database-zap", [
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
]), $w = Q("download", [
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
]), eT = Q("drama", [
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
]), tT = Q("eye-off", [
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
]), nT = Q("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), rT = Q("feather", [
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
]), iT = Q("file-down", [
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
]), aT = Q("file-plus", [
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
]), oT = Q("file-stack", [
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
]), sT = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), cT = Q("git-branch", [
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
]), lT = Q("git-compare-arrows", [
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
]), uT = Q("globe", [
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
]), dT = Q("grip-vertical", [
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
]), fT = Q("info", [
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
]), pT = Q("layers", [
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
]), mT = Q("layout-template", [
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
]), hT = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), gT = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), _T = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), vT = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), yT = Q("message-square-dashed", [
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
]), bT = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), xT = Q("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), ST = Q("notebook-pen", [
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
]), CT = Q("package", [
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
]), wT = Q("palette", [
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
]), TT = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), ET = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), DT = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), OT = Q("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), kT = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), AT = Q("refresh-cw", [
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
]), jT = Q("regex", [
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
]), MT = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), NT = Q("save", [
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
]), PT = Q("scroll-text", [
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
]), FT = Q("server", [
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
]), IT = Q("shapes", [
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
]), LT = Q("sliders-horizontal", [
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
]), RT = Q("sliders-vertical", [
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
]), zT = Q("snowflake", [
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
]), BT = Q("split", [
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
]), VT = Q("sun", [
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
]), HT = Q("text-cursor-input", [
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
]), UT = Q("trash-2", [
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
]), WT = Q("triangle-alert", [
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
]), GT = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), KT = Q("upload", [
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
]), qT = Q("user-pen", [
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
]), JT = Q("wind", [
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
]), YT = Q("workflow", [
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
]), XT = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), ZT = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), QT = /* @__PURE__ */ I({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = cS(n, () => t);
		return (t, a) => (z(), B("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Qr(t.$slots, "default"), P(r) && e.text ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544));
	}
}), $T = [
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
		return (t, n) => (z(), V(QT, {
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
			}, [(z(), V(Jr(e.icon)))], 10, $T)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), eE = {
	key: 0,
	class: "patches"
}, tE = { class: "patch-old pre" }, nE = { class: "patch-new pre" }, rE = {
	key: 0,
	class: "patch-status xs"
}, iE = {
	key: 2,
	class: "faint small stage-empty"
}, aE = /* @__PURE__ */ I({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null);
		dr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Wn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (z(), B("div", {
			class: "stage-body",
			style: je({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (z(), B("div", eE, [(z(!0), B(R, null, L(e.stage.patches, (e, t) => (z(), B("div", {
			key: t,
			class: A(["patch", { failed: r(e.status) }])
		}, [
			H("div", tE, j(e.old_string), 1),
			U(P(Ew), { class: "patch-arrow" }),
			H("div", nE, j(e.new_string), 1),
			r(e.status) ? (z(), B("div", rE, [U(P(Ow)), W(j(P(X)(`patch.${e.status}`)), 1)])) : G("", !0)
		], 2))), 128))])) : e.stage.text ? (z(), B("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, j(e.stage.text), 513)) : (z(), B("div", iE, j(P(X)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function oE(t) {
	let n = e().chat[t], r = jp(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), Np(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), mx();
}
async function sE(t, n, r) {
	let i = e().chat[t], a = jp(i);
	return !i || !a ? !1 : (Np(t, Mp(a, n, r)), mx(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var cE = { class: "stage-bar" }, lE = ["onClick"], uE = { class: "ellipsis" }, dE = {
	key: 0,
	class: "chip stage-chip error"
}, fE = { class: "ellipsis" }, pE = { class: "badge warn" }, mE = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, hE = /* @__PURE__ */ I({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = vS(() => t.mesid), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = K(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = K(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = K(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = K(() => o.value.find((e) => e.id === s.value) ?? null);
		dr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: ST,
			content: rT,
			patch: lT
		}, d = (e) => e.status === "streaming" ? gT : e.status === "interrupted" ? zw : e.status === "missing" ? Lw : u[e.kind], f = K(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = K(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = K(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${X(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(X("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => P(n) && (o.value.length || P(n).error) ? (z(), B("div", {
			key: 0,
			class: A(["stages", { live: P(n).running }])
		}, [H("div", cE, [
			(z(!0), B(R, null, L(o.value, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				class: A(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: je({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(z(), V(Jr(d(e)), { class: A({ spin: e.status === "streaming" }) }, null, 8, ["class"])), H("span", uE, j(e.label), 1)], 14, lE))), 128)),
			P(n).error ? (z(), B("span", dE, [U(P(WT)), H("span", fE, j(P(n).error), 1)])) : G("", !0),
			r[1] ||= H("span", { class: "grow" }, null, -1),
			f.value.length ? (z(), V(QT, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: F(() => [H("span", pE, [U(P(WT)), W(j(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : G("", !0),
			p.value ? (z(), V($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? P(GT) : P(kT),
				label: p.value.patchesApplied ? P(X)("stages.revertDraft") : P(X)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => P(oE)(e.mesid)
			}, null, 8, ["icon", "label"])) : G("", !0),
			P(n).running ? G("", !0) : (z(), V(QT, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: F(() => [H("span", mE, [U(P(fT))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (z(), V(aE, {
			key: c.value.id,
			stage: c.value,
			follow: P(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : G("", !0)], 2)) : G("", !0);
	}
}), gE = {
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
	annotations: null
};
function _E(e) {
	let t = gE[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function vE(e, t) {
	return e.flatMap((e, n) => {
		let r = _E(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var yE = { class: "reply-name xs" }, bE = ["innerHTML"], xE = /* @__PURE__ */ I({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = K(() => hS(t.text));
		return (t, r) => (z(), B("div", {
			class: "reply-card",
			style: je({ "--actor": e.color })
		}, [H("div", yE, j(e.name), 1), H("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, bE)], 4));
	}
}), SE = { class: "card mini-card" }, CE = { class: "card-head" }, wE = { class: "card-title" }, TE = { class: "card-body pre" }, EE = /* @__PURE__ */ I({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (z(), B("div", SE, [H("header", CE, [
			U(P(qT), { class: "section-icon" }),
			H("span", wE, j(P(X)("cards.impersonate")), 1),
			H("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => P(Ib)(e.text, !1, e.mesid)
			}, [U(P(HT)), W(j(P(X)("cards.fillInput")), 1)])
		]), H("div", TE, j(e.text), 1)]));
	}
}), DE = ["aria-label"], OE = ["title", "onClick"], kE = { class: "option-label" }, AE = { class: "option-content small muted" }, jE = /* @__PURE__ */ I({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => Ib(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
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
		}, [H("span", kE, j(e.label), 1), H("span", AE, j(e.content), 1)], 8, OE))), 128))], 8, DE));
	}
}), ME = {
	key: 0,
	class: "memory-ops"
}, NE = { class: "ellipsis" }, PE = ["aria-label", "onClick"], FE = /* @__PURE__ */ I({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = K(() => {
			let e = nm(t.preset), n = e.globalMemory.log;
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
					let r = Rp(t), i = r ? zp(e, r) : -1, a = n[i];
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
			e.id !== void 0 && Qp(nm(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (z(), B("div", ME, [(z(!0), B(R, null, L(n.value, (e, t) => (z(), V(QT, {
			key: t,
			text: e.op === "delete" ? P(X)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: F(() => [H("span", { class: A(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(z(), V(Jr(e.scope === "global" ? P(uT) : P(vT)), { class: "faint" })),
				H("span", NE, j(e.key), 1),
				(z(), V(Jr(e.op === "delete" ? P(UT) : P(ET)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": P(X)("common.undo"),
					onClick: (t) => r(e)
				}, [U(P(GT))], 8, PE)) : G("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : G("", !0);
	}
}), IE = ["aria-label"], LE = /* @__PURE__ */ I({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = cS(n, () => t);
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
			onClick: a[0] ||= us((e) => r.value = !P(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [U(P(Rw))], 40, IE), P(r) ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544)) : G("", !0);
	}
}), RE = { class: "card-title" }, zE = {
	key: 0,
	class: "card-body"
}, BE = /* @__PURE__ */ I({
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
			e.icon ? (z(), V(Jr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : G("", !0),
			H("span", RE, j(e.title), 1),
			U(LE, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			H("span", {
				class: "row",
				onClick: r[0] ||= us(() => {}, ["stop"])
			}, [Qr(n.$slots, "actions")]),
			e.collapsible ? (z(), V(P(Fw), {
				key: 1,
				class: A(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : G("", !0)
		], 2), !e.collapsible || t.value ? (z(), B("div", zE, [Qr(n.$slots, "default")])) : G("", !0)], 2));
	}
}), VE = {
	key: 0,
	class: "badge neutral"
}, HE = { class: "pre small" }, UE = /* @__PURE__ */ I({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (z(), V(BE, {
			title: P(X)("cards.recap"),
			icon: P(PT),
			collapsible: "",
			open: !1
		}, {
			actions: F(() => [e.coversUpTo === void 0 ? G("", !0) : (z(), B("span", VE, "#0–" + j(e.coversUpTo), 1))]),
			default: F(() => [H("div", HE, j(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), WE = { class: "synopsis-fields" }, GE = { class: "synopsis-field" }, KE = ["placeholder", "aria-label"], qE = { class: "synopsis-field" }, JE = ["placeholder", "aria-label"], YE = ["placeholder", "aria-label"], XE = ["placeholder", "aria-label"], ZE = { class: "synopsis-actions" }, QE = { class: "xs faint grow synopsis-keys" }, $E = {
	type: "submit",
	class: "btn primary sm-btn"
}, eD = { class: "synopsis-head" }, tD = { class: "synopsis-line small" }, nD = {
	key: 0,
	class: "row tight"
}, rD = {
	key: 1,
	class: "row tight"
}, iD = { class: "synopsis-event ellipsis" }, aD = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, oD = /* @__PURE__ */ I({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ sn({
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
			a.value = !0, await Wn(), f(), s.value?.focus();
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
			onSubmit: us(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= us(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= us(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= us(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= us(() => {}, ["stop"])
		}, [
			H("div", WE, [H("label", GE, [U(P(Bw), { class: "faint" }), ir(H("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.time"),
				"aria-label": P(X)("cards.synopsis.time")
			}, null, 8, KE), [[es, o.time]])]), H("label", qE, [U(P(_T), { class: "faint" }), ir(H("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.location"),
				"aria-label": P(X)("cards.synopsis.location")
			}, null, 8, JE), [[es, o.location]])])]),
			ir(H("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: P(X)("cards.synopsis.event"),
				"aria-label": P(X)("cards.synopsis.event")
			}, null, 8, YE), [[es, o.event]]),
			ir(H("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: P(X)("cards.synopsis.summary"),
				"aria-label": P(X)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, XE), [[es, o.summary]]),
			H("div", ZE, [
				H("span", QE, j(P(X)("cards.synopsis.keys")), 1),
				H("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, j(P(X)("common.cancel")), 1),
				H("button", $E, [U(P(Pw)), W(j(P(X)("common.save")), 1)])
			])
		], 32)) : (z(), B("div", {
			key: 1,
			class: A(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [H("div", eD, [H("div", tD, [
			e.synopsis.time ? (z(), B("span", nD, [U(P(Bw), { class: "faint" }), W(j(e.synopsis.time), 1)])) : G("", !0),
			e.synopsis.location ? (z(), B("span", rD, [U(P(_T), { class: "faint" }), W(j(e.synopsis.location), 1)])) : G("", !0),
			H("span", iD, j(e.synopsis.event), 1)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= us(() => {}, ["stop"])
		}, [U($, {
			icon: P(ET),
			label: P(X)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]), i.value && e.synopsis.summary ? (z(), B("div", aD, j(e.synopsis.summary), 1)) : G("", !0)], 2));
	}
}), sD = { class: "status-fields" }, cD = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], lD = { class: "synopsis-actions" }, uD = { class: "xs faint grow synopsis-keys" }, dD = {
	type: "submit",
	class: "btn primary sm-btn"
}, fD = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, pD = { class: "status-line" }, mD = {
	key: 0,
	class: "row tight"
}, hD = {
	key: 1,
	class: "row tight"
}, gD = {
	key: 2,
	class: "row tight status-location"
}, _D = { class: "ellipsis" }, vD = {
	key: 3,
	class: "row tight"
}, yD = /* @__PURE__ */ I({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ sn({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ N(), s = (e) => (n.status[e] ?? "").trim(), c = K(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, Hw],
			[/雪|snow|sleet|blizzard/i, zT],
			[/雨|rain|drizzle|shower/i, Uw],
			[/雾|霾|fog|mist|haze|smog/i, Vw],
			[/风|wind|gale|breez/i, JT],
			[/阴|云|cloud|overcast/i, Gw],
			[/夜|月|night|moon/i, xT],
			[/晴|sun|clear|fair/i, VT]
		], u = K(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? Ww), d = () => Object.fromEntries(qs.map((e) => [e, a[e].trim()])), f = K(() => qs.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of qs) a[e] = n.status[e] ?? "";
			i.value = !0, await Wn(), o.value?.querySelector("input")?.focus();
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
			date: Nw,
			weekday: Nw,
			time: Bw,
			location: _T,
			weather: Ww
		};
		return (t, n) => i.value ? (z(), B("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: us(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= us(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= us(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= us(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= us(() => {}, ["stop"])
		}, [H("div", sD, [(z(!0), B(R, null, L(P(qs), (e) => (z(), B("label", {
			key: e,
			class: "synopsis-field"
		}, [(z(), V(Jr(_[e]), { class: "faint" })), ir(H("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: P(X)(`cards.status.${e}`),
			"aria-label": P(X)(`cards.status.${e}`)
		}, null, 8, cD), [[es, a[e]]])]))), 128))]), H("div", lD, [
			H("span", uD, j(P(X)("cards.status.keys")), 1),
			H("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, j(P(X)("common.cancel")), 1),
			H("button", dD, [U(P(Pw)), W(j(P(X)("common.save")), 1)])
		])], 544)) : (z(), B("div", fD, [H("div", pD, [
			c.value ? (z(), B("span", mD, [U(P(Nw), { class: "faint" }), W(j(c.value), 1)])) : G("", !0),
			s("time") ? (z(), B("span", hD, [U(P(Bw), { class: "faint" }), W(j(s("time")), 1)])) : G("", !0),
			s("location") ? (z(), B("span", gD, [U(P(_T), { class: "faint" }), H("span", _D, j(s("location")), 1)])) : G("", !0),
			s("weather") ? (z(), B("span", vD, [(z(), V(Jr(u.value), { class: "faint" })), W(j(s("weather")), 1)])) : G("", !0)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= us(() => {}, ["stop"])
		}, [U($, {
			icon: P(ET),
			label: P(X)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]));
	}
}), bD = ["innerHTML"], xD = {
	key: 1,
	class: "kv-list small"
}, SD = { class: "pre" }, CD = /* @__PURE__ */ I({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = K(() => typeof t.value == "string" ? hS(t.value) : "");
		return (t, r) => (z(), V(BE, {
			title: e.title,
			icon: P(IT),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [typeof e.value == "string" ? (z(), B("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, bD)) : (z(), B("dl", xD, [(z(!0), B(R, null, L(e.value, (e, t) => (z(), B(R, { key: t }, [H("dt", null, j(t), 1), H("dd", SD, j(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), wD = /* @__PURE__ */ new Map();
function TD(e) {
	let t = wD.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => wD.delete(e)), wD.set(e, t);
	}
	return t;
}
function ED(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function DD(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var OD = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function kD(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = il(e.code, OD(r));
			t.replaceChildren(...[DD(e.style)].filter((e) => !!e));
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
	let i = ED(await TD(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[DD(e.style)].filter((e) => !!e)), a = await i(t, r);
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
var AD = { class: "structure-component" }, jD = ["data-structure"], MD = {
	key: 0,
	class: "xs"
}, ND = /* @__PURE__ */ I({
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
		return Ur(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await kD(t.component, r, t.context);
			});
		}), dr(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), dr(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await kD(e, r, t.context));
		})), Gr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (z(), B("div", AD, [H("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, jD), r.value ? (z(), B("div", MD, j(P(X)("cards.custom.error", { error: r.value })), 1)) : G("", !0)]));
	}
}), PD = /* @__PURE__ */ I({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = vS(() => t.mesid), r = K(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && by.current?.genId === e.genId ? by.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = Bb(r), u = !(!i || e.live), d = Y(o);
			for (let { decl: n } of vE(s, t.position)) {
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
						let i = rp(r, "structures", n.id, "title", n.title || n.id), o = Ac(n);
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
									name: ip(r),
									version: r.version
								},
								lang: tp(),
								setValue: async (e) => u ? sE(f, s, e) : !1,
								fillInput: (e, t) => Ib(String(e ?? ""), !!t, f)
							}
						});
						break;
					}
				}
			}
			return {
				preset: r,
				editable: u,
				narrator: xu(r, am(r), r.narrator),
				color: _S(r, r.narrator),
				items: c
			};
		});
		return (t, n) => r.value?.items.length ? (z(), B("div", {
			key: 0,
			class: A(["cards", `cards-${e.position}`])
		}, [(z(!0), B(R, null, L(r.value.items, (t) => (z(), B(R, { key: t.id }, [t.type === "reply" ? (z(), V(xE, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (z(), V(EE, {
			key: 1,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (z(), V(jE, {
			key: 2,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (z(), V(oD, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => P(sE)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (z(), V(yD, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => P(sE)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (z(), V(FE, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (z(), V(UE, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (z(), V(CD, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (z(), V(ND, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : G("", !0)], 64))), 128))], 2)) : G("", !0);
	}
}), FD = {
	key: 0,
	class: "dock stages live"
}, ID = { class: "stage-bar" }, LD = { class: "ellipsis" }, RD = {
	key: 0,
	class: "small muted"
}, zD = /* @__PURE__ */ I({
	__name: "Dock",
	setup(e) {
		let t = K(() => by.current && !by.current.streaming && by.current.status === "running" ? by.current : null), n = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = qf(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: gS(n, e.workflow, t.id, t.label),
				color: _S(n, t.actor)
			}));
		}), r = K(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (z(), B("div", FD, [H("div", ID, [
			U(P(gT), { class: "spin faint" }),
			(z(!0), B(R, null, L(n.value, (e) => (z(), B("span", {
				key: e.id,
				class: A(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: je({ "--actor": e.color })
			}, [H("span", LD, j(e.label), 1)], 6))), 128)),
			n.value.length ? G("", !0) : (z(), B("span", RD, j(P(X)("stages.waiting")), 1))
		]), r.value ? (z(), V(aE, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : G("", !0)])) : G("", !0);
	}
}), BD = ["title"], VD = { class: "storyline-name" }, HD = {
	key: 0,
	class: "storyline-if"
}, UD = /* @__PURE__ */ I({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = K(() => {
			if (Z.chatRev, !RC.value) return null;
			let e = BC()[t.mesid];
			if (!e) return null;
			let n = Yg();
			return {
				key: e,
				name: gp(e, n) || X("storylines.unnamed"),
				if: mp(e, n),
				hidden: hp(e, n)
			};
		});
		return (e, t) => n.value ? (z(), B("button", {
			key: 0,
			type: "button",
			class: A(["storyline-badge", { "if-line": n.value.if }]),
			title: P(X)("storylines.openTab"),
			onClick: t[0] ||= (e) => P(bx)(n.value.key)
		}, [
			U(P(cT), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			H("span", VD, j(n.value.name), 1),
			n.value.if ? (z(), B("span", HD, j(P(X)("storylines.ifLine")), 1)) : G("", !0),
			n.value.hidden ? (z(), V(P(tT), {
				key: 1,
				class: "lucide storyline-hidden",
				"aria-label": P(X)("storylines.hidden")
			}, null, 8, ["aria-label"])) : G("", !0)
		], 10, BD)) : G("", !0);
	}
}), WD = ["aria-label"], GD = ["disabled"], KD = /* @__PURE__ */ I({
	__name: "Switch",
	props: /*@__PURE__*/ ai({
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
		let t = ui(e, "modelValue");
		return (n, r) => (z(), B("label", {
			class: A(["switch", { sm: e.small }]),
			"aria-label": e.label
		}, [
			ir(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, GD), [[ts, t.value]]),
			r[1] ||= H("span", { class: "track" }, null, -1),
			r[2] ||= H("span", { class: "thumb" }, null, -1)
		], 10, WD));
	}
}), qD = { class: "field-label" }, JD = { class: "ellipsis" }, YD = {
	key: 0,
	class: "dot modified"
}, XD = { class: "field-control" }, ZD = /* @__PURE__ */ I({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (z(), B("div", { class: A(["field", { inline: e.inline }]) }, [H("div", qD, [
			H("span", JD, j(e.label), 1),
			e.modified ? (z(), B("span", YD)) : G("", !0),
			U(LE, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), H("div", XD, [Qr(t.$slots, "default")])], 2));
	}
}), QD = { class: "swatches" }, $D = ["title"], eO = ["title"], tO = { class: "swatches" }, nO = ["title"], rO = /* @__PURE__ */ I({
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
		return (e, t) => (z(), V(BE, {
			title: P(X)("appearance.title"),
			icon: P(wT),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [
				U(ZD, {
					label: P(X)("appearance.colors"),
					help: P(X)("appearance.colors.hint"),
					inline: ""
				}, {
					default: F(() => [H("div", QD, [
						H("label", {
							class: "swatch",
							style: je({ background: P(r) || "var(--ap-primary-500)" }),
							title: P(X)("appearance.primary")
						}, [ir(H("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ vn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							es,
							P(r),
							void 0,
							{ lazy: !0 }
						]])], 12, $D),
						H("label", {
							class: "swatch",
							style: je({ background: P(i) || "var(--ap-accent-500)" }),
							title: P(X)("appearance.accent")
						}, [ir(H("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ vn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							es,
							P(i),
							void 0,
							{ lazy: !0 }
						]])], 12, eO),
						U($, {
							icon: P(MT),
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
				U(ZD, {
					label: P(X)("appearance.collapseStages"),
					inline: ""
				}, {
					default: F(() => [U(KD, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				U(ZD, {
					label: P(X)("appearance.annotations"),
					help: P(X)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: F(() => [U(KD, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (z(), V(ZD, {
					key: 0,
					label: P(X)("appearance.annotationColor"),
					inline: ""
				}, {
					default: F(() => [H("div", tO, [H("label", {
						class: "swatch",
						style: je({ background: l.value || "var(--ap-accent)" }),
						title: P(X)("appearance.annotationColor")
					}, [ir(H("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						es,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, nO), U($, {
						icon: P(MT),
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
}), iO = { class: "toolbar" }, aO = ["disabled"], oO = ["disabled"], sO = { class: "preset-list" }, cO = ["onClick", "onKeydown"], lO = { class: "preset-mark" }, uO = { class: "grow col preset-info" }, dO = { class: "row wrap preset-head" }, fO = { class: "preset-name" }, pO = { class: "badge neutral" }, mO = { class: "badge neutral icon-badge" }, hO = {
	key: 0,
	class: "xs muted"
}, gO = {
	key: 1,
	class: "small muted preset-desc"
}, _O = {
	key: 0,
	class: "empty"
}, vO = /* @__PURE__ */ I({
	__name: "PresetsTab",
	setup(e) {
		let t = K(() => Uf()), n = (e) => xl(e.preset).length > 0, r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && _("success", n);
			} catch (e) {
				Wb(e) || ex(e) ? _("info", e.message) : _("error", e instanceof Error ? e.message : String(e), X("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await Pm(e.preset), hx();
		}), l = () => s("url", async () => {
			let e = await ox(a.value);
			return a.value = "", i.value = !1, e;
		}, X("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => sx(t), X("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => lx(e.preset.id), X("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => Db(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => px(e.preset.id)), m = () => s("ext", async () => _("info", await Vy() === "current" ? X("update.none") : X("update.reloading")));
		return (e, s) => (z(), B(R, null, [
			H("div", iO, [
				H("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [U(P(KT)), W(j(P(X)("presets.importFile")), 1)], 8, aO),
				H("button", {
					type: "button",
					class: A(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [U(P(hT)), W(j(P(X)("presets.importUrl")), 1)], 2),
				s[4] ||= H("span", { class: "grow" }, null, -1),
				U($, {
					icon: r.value === "ext" ? P(gT) : P(AT),
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
				onSubmit: us(l, ["prevent"])
			}, [ir(H("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[es, a.value]]), H("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (z(), V(P(gT), {
				key: 0,
				class: "spin"
			})) : (z(), V(P($w), { key: 1 })), W(j(P(X)("common.install")), 1)], 8, oO)], 32)) : G("", !0),
			H("div", sO, [(z(!0), B(R, null, L(t.value, (e) => (z(), B("div", {
				key: e.preset.id,
				class: A(["preset-item", { on: P(gx)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: fs((t) => c(e), ["enter"])
			}, [
				H("span", lO, [r.value === `select:${e.preset.id}` ? (z(), V(P(gT), {
					key: 0,
					class: "spin"
				})) : P(gx)?.id === e.preset.id ? (z(), V(P(Pw), { key: 1 })) : G("", !0)]),
				H("div", uO, [
					H("div", dO, [
						H("span", fO, j(P(ip)(e.preset)), 1),
						H("span", pO, "v" + j(e.preset.version), 1),
						e.source === "builtin" ? G("", !0) : (z(), B("span", {
							key: 0,
							class: A(["badge", { warn: e.source === "dev" }])
						}, j(P(X)(`presets.source.${e.source}`)), 3)),
						n(e) ? (z(), V(QT, {
							key: 1,
							text: P(X)("presets.templates.help")
						}, {
							default: F(() => [H("span", mO, [U(P(Kw)), W(j(P(X)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : G("", !0)
					]),
					e.preset.author ? (z(), B("span", hO, j(e.preset.author), 1)) : G("", !0),
					P(ap)(e.preset) ? (z(), B("span", gO, j(P(ap)(e.preset)), 1)) : G("", !0)
				]),
				H("div", {
					class: "row preset-actions",
					onClick: s[3] ||= us(() => {}, ["stop"])
				}, [
					U($, {
						icon: P(iT),
						label: P(X)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					P(cx)(e.preset.id) ? (z(), V($, {
						key: 0,
						icon: P(AT),
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
						icon: P(UT),
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
			], 42, cO))), 128)), t.value.length ? G("", !0) : (z(), B("div", _O, j(P(X)("presets.none")), 1))]),
			U(rO)
		], 64));
	}
}), yO;
function bO() {
	let e = gx, t = K(() => e.value ? am(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (sm(r, t), n.sampling && (clearTimeout(yO), yO = setTimeout(() => void Fm(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var xO = { class: "empty" }, SO = /* @__PURE__ */ I({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (z(), B("div", xO, [
			U(P(CT)),
			H("span", null, j(P(X)("panel.noPreset")), 1),
			H("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => P(Z).tab = "presets"
			}, j(P(X)("panel.choosePreset")), 1)
		]));
	}
}), CO = [
	"aria-checked",
	"title",
	"onClick"
], wO = { class: "ellipsis" }, TO = /* @__PURE__ */ I({
	__name: "Segmented",
	props: /*@__PURE__*/ ai({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ui(e, "modelValue");
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
		}, [e.icon ? (z(), V(Jr(e.icon), { key: 0 })) : G("", !0), H("span", wO, j(e.label), 1)], 10, CO))), 128))], 2));
	}
}), EO = { class: "col" }, DO = { class: "row" }, OO = ["aria-label"], kO = ["label"], AO = ["value"], jO = ["label"], MO = ["value"], NO = ["placeholder"], PO = {
	key: 1,
	class: "xs muted row tight"
}, FO = { value: "" }, IO = ["value"], LO = ["value"], RO = ["value"], zO = ["value"], BO = [
	"value",
	"placeholder",
	"onChange"
], VO = [
	"value",
	"placeholder",
	"onChange"
], HO = ["value"], UO = ["value"], WO = ["value"], GO = ["value"], KO = ["value"], qO = {
	key: 0,
	class: "xs muted"
}, JO = { class: "custom-ui-list small" }, YO = { class: "grow ellipsis" }, XO = { class: "xs faint" }, ZO = { class: "slider" }, QO = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], $O = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], ek = { class: "field-grid" }, tk = ["value", "onChange"], nk = ["value"], rk = ["value"], ik = /* @__PURE__ */ I({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bO(), i = K(() => t.value ? nm(t.value) : null), a = K({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				cm(n, {
					kind: r,
					id: i.join(":")
				}), Fm(n);
			}
		}), o = K(() => {
			let e = t.value;
			return e ? jc(e).map((t) => ({
				id: t.id,
				title: rp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = K({
			get: () => t.value ? Bb(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = Wf(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? Hb(n, e) : Zb(n);
			}
		}), c = K(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== Nc(t.value));
		}), l = K(() => t.value ? lm(t.value) : !1), u = K(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? dm(e, n) : u.value && pm(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (um(t.value), Fm(t.value));
		}, g = () => {
			t.value && u.value && (mm(t.value, u.value), Fm(t.value));
		}, _ = () => {
			t.value && u.value && fm(t.value, u.value);
		}, v = K(() => xs.map((e) => ({
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
			label: rp(t.value, "workflows", e.id, "name", e.name),
			hint: rp(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), C = K({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), ee = K(() => S.value.find((e) => e.value === C.value)?.hint);
		function w(e) {
			return K({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let te = w("forceTool"), T = w("parallelTools"), ne = K({
			get: () => n.value ? Dl(n.value.connection) : "off",
			set: (e) => r((t) => {
				t.connection.sendThoughtSignature = e !== "off" && e;
			})
		}), re = w("openAiSignatures"), E = w("streamToolArguments"), D = w("finalFallback"), ie = w("maxSteps"), ae = K({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), oe = K(() => Object.entries(t.value?.actors ?? {})), se = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), O = K({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), ce = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), le = K(() => Es.map((e) => ({
			value: e,
			label: X(`writing.userInput.${e}`),
			hint: X(`writing.userInput.${e}.hint`)
		}))), k = K({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), ue = K({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), de = K({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...tu,
					...t.storylines,
					enabled: e
				};
			})
		}), fe = K(() => eu.map((e) => ({
			value: e,
			label: X(`storylines.freeze.${e}`),
			hint: X(`storylines.freeze.${e}.hint`)
		}))), pe = K({
			get: () => nu(n.value?.storylines),
			set: (e) => r((t) => {
				t.storylines = {
					...tu,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), me = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), he = K({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), ge = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), _e = [
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
		], ve = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], ye = ["stream_openai", "show_thoughts"], be = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], xe = K(() => n.value?.sampling ?? {}), Se = (e) => e in xe.value, Ce = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), we = (e) => Number(e.target.value);
		return (e, r) => !P(t) || !P(n) || !i.value ? (z(), V(SO, { key: 0 })) : (z(), B(R, { key: 1 }, [
			H("div", EO, [
				H("div", DO, [
					ir(H("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": P(X)("config.configuration")
					}, [H("optgroup", { label: P(X)("config.recommended") }, [(z(!0), B(R, null, L(P(t).configurations, (e) => (z(), B("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, j(P(rp)(P(t), "configurations", e.id, "name", e.name)), 9, AO))), 128))], 8, kO), i.value.saved.length ? (z(), B("optgroup", {
						key: 0,
						label: P(X)("config.saved")
					}, [(z(!0), B(R, null, L(i.value.saved, (e) => (z(), B("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, j(e.name), 9, MO))), 128))], 8, jO)) : G("", !0)], 8, OO), [[rs, a.value]]),
					u.value && l.value ? (z(), V($, {
						key: 0,
						icon: P(NT),
						label: P(X)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : G("", !0),
					U($, {
						icon: P(DT),
						label: P(X)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (z(), V($, {
						key: 1,
						icon: P(ET),
						label: P(X)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : G("", !0),
					u.value ? (z(), V($, {
						key: 2,
						icon: P(UT),
						label: P(X)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : G("", !0),
					U($, {
						icon: P(MT),
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
					onSubmit: us(m, ["prevent"])
				}, [
					ir(H("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: P(X)("config.name"),
						autofocus: ""
					}, null, 8, NO), [[es, f.value]]),
					U($, {
						icon: P(XT),
						label: P(X)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					U($, {
						icon: P(Pw),
						label: P(X)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : G("", !0),
				l.value ? (z(), B("span", PO, [r[28] ||= H("span", { class: "dot modified" }, null, -1), W(j(P(X)("config.modified")), 1)])) : G("", !0)
			]),
			U(BE, {
				title: P(X)("config.connection"),
				icon: P(Mw)
			}, {
				default: F(() => [
					U(ZD, {
						label: P(X)("config.transport"),
						help: P(X)(`transport.${y.value}.hint`)
					}, {
						default: F(() => [U(TO, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (z(), B(R, { key: 0 }, [
						U(ZD, {
							label: P(X)("config.forceTool"),
							help: P(X)("config.forceTool.hint"),
							inline: ""
						}, {
							default: F(() => [U(KD, {
								modelValue: P(te),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ vn(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(ZD, {
							label: P(X)("config.parallelTools"),
							help: P(X)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: F(() => [U(KD, {
								modelValue: P(T),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ vn(T) ? T.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(ZD, {
							label: P(X)("config.syntheticTurn"),
							help: P(X)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: F(() => [ir(H("select", {
								"onUpdate:modelValue": r[8] ||= (e) => ae.value = e,
								class: "input"
							}, [H("option", FO, j(P(X)("common.none")), 1), (z(!0), B(R, null, L(P(t).syntheticTurns, (e) => (z(), B("option", {
								key: e.id,
								value: e.id
							}, j(e.label), 9, IO))), 128))], 512), [[rs, ae.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(ZD, {
							label: P(X)("config.thoughtSignature"),
							help: P(X)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: F(() => [ir(H("select", {
								"onUpdate:modelValue": r[9] ||= (e) => ne.value = e,
								class: "input"
							}, [(z(!0), B(R, null, L(P(Cs), (e) => (z(), B("option", {
								key: e,
								value: e
							}, j(P(X)(`config.thoughtSignature.${e}`)), 9, LO))), 128))], 512), [[rs, ne.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(ZD, {
							label: P(X)("config.openAiSignatures"),
							help: P(X)("config.openAiSignatures.hint"),
							inline: ""
						}, {
							default: F(() => [U(KD, {
								modelValue: P(re),
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ vn(re) ? re.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(ZD, {
							label: P(X)("config.streamToolArguments"),
							help: P(X)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: F(() => [ir(H("select", {
								"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ vn(E) ? E.value = e : null,
								class: "input"
							}, [(z(!0), B(R, null, L(P(Ss), (e) => (z(), B("option", {
								key: e,
								value: e
							}, j(P(X)(`config.streamToolArguments.${e}`)), 9, RO))), 128))], 512), [[rs, P(E)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (z(), V(ZD, {
							key: 0,
							label: P(X)("config.maxSteps"),
							inline: ""
						}, {
							default: F(() => [H("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: P(ie),
								onChange: r[12] ||= (e) => ie.value = we(e)
							}, null, 40, zO)]),
							_: 1
						}, 8, ["label"])) : G("", !0)
					], 64)) : G("", !0),
					U(ZD, {
						label: P(X)("config.finalFallback"),
						help: P(X)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: F(() => [U(KD, {
							modelValue: P(D),
							"onUpdate:modelValue": r[13] ||= (e) => /* @__PURE__ */ vn(D) ? D.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			S.value.length > 1 ? (z(), V(BE, {
				key: 0,
				title: P(X)("config.workflow"),
				icon: P(YT),
				help: ee.value
			}, {
				default: F(() => [U(TO, {
					modelValue: C.value,
					"onUpdate:modelValue": r[14] ||= (e) => C.value = e,
					options: S.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(BE, {
				title: P(X)("writing.actors"),
				icon: P(eT),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(oe.value, ([e, t]) => (z(), B("div", {
					key: e,
					class: "field-grid"
				}, [U(ZD, { label: P(X)("writing.actorName", { actor: e }) }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => se("names", e, t.target.value)
					}, null, 40, BO)]),
					_: 2
				}, 1032, ["label"]), U(ZD, { label: P(X)("writing.actorPrefix") }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => se("prefixes", e, t.target.value)
					}, null, 40, VO)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(BE, {
				title: P(X)("writing.meta"),
				icon: P(bT),
				help: P(X)("writing.meta.hint")
			}, {
				actions: F(() => [U(KD, {
					modelValue: ue.value,
					"onUpdate:modelValue": r[15] ||= (e) => ue.value = e,
					label: P(X)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [ue.value ? (z(), V(ZD, {
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
						onChange: r[16] ||= (e) => me(e.target.value)
					}, null, 40, HO)]),
					_: 1
				}, 8, ["label", "help"])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			P(t).storylines ? (z(), V(BE, {
				key: 1,
				title: P(X)("storylines.enabled"),
				icon: P(cT),
				help: P(X)("storylines.config.hint")
			}, {
				actions: F(() => [U(KD, {
					modelValue: de.value,
					"onUpdate:modelValue": r[17] ||= (e) => de.value = e,
					label: P(X)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [de.value ? (z(), V(ZD, {
					key: 0,
					label: P(X)("storylines.freezeVariables"),
					help: P(X)("storylines.freezeVariables.hint")
				}, {
					default: F(() => [U(TO, {
						modelValue: pe.value,
						"onUpdate:modelValue": r[18] ||= (e) => pe.value = e,
						options: fe.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(BE, {
				title: P(X)("writing.tokenSaving"),
				icon: P(Jw),
				help: P(X)("writing.tokenSaving.hint")
			}, {
				actions: F(() => [U(KD, {
					modelValue: O.value,
					"onUpdate:modelValue": r[19] ||= (e) => O.value = e,
					label: P(X)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [O.value ? (z(), B(R, { key: 0 }, [
					U(ZD, {
						label: P(X)("writing.keepFullTurns"),
						help: P(X)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.keepFullTurns,
							onChange: r[20] ||= (e) => ce("keepFullTurns", e.target.value)
						}, null, 40, UO)]),
						_: 1
					}, 8, ["label", "help"]),
					U(ZD, {
						label: P(X)("writing.userInput"),
						help: P(X)("writing.userInput.hint")
					}, {
						default: F(() => [U(TO, {
							modelValue: k.value,
							"onUpdate:modelValue": r[21] ||= (e) => k.value = e,
							options: le.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					k.value === "truncate" ? (z(), V(ZD, {
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
							onChange: r[22] ||= (e) => ce("truncateUserAfter", e.target.value)
						}, null, 40, WO)]),
						_: 1
					}, 8, ["label", "help"])) : G("", !0)
				], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(BE, {
				title: P(X)("writing.cache"),
				icon: P(Qw),
				help: P(X)("writing.cache.hint")
			}, {
				actions: F(() => [U(KD, {
					modelValue: he.value,
					"onUpdate:modelValue": r[23] ||= (e) => he.value = e,
					label: P(X)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [he.value ? (z(), B(R, { key: 0 }, [U(ZD, {
					label: P(X)("writing.cacheTtl"),
					help: P(X)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.ttlMinutes,
						onChange: r[24] ||= (e) => ge("ttlMinutes", e.target.value)
					}, null, 40, GO)]),
					_: 1
				}, 8, ["label", "help"]), U(ZD, {
					label: P(X)("writing.cacheMaxDeferred"),
					help: P(X)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.maxDeferredTurns,
						onChange: r[25] ||= (e) => ge("maxDeferredTurns", e.target.value)
					}, null, 40, KO)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (z(), V(BE, {
				key: 2,
				title: P(X)("config.customUi"),
				icon: P(OT),
				help: P(X)("config.customUi.hint")
			}, {
				actions: F(() => [U(KD, {
					modelValue: s.value,
					"onUpdate:modelValue": r[26] ||= (e) => s.value = e,
					label: P(X)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [c.value && !s.value ? (z(), B("p", qO, j(P(X)("config.customUi.changed")), 1)) : G("", !0), H("ul", JO, [(z(!0), B(R, null, L(o.value, (e) => (z(), B("li", {
					key: e.id,
					class: "row tight"
				}, [H("span", YO, j(e.title), 1), H("span", XO, j(P(X)(`config.customUi.${e.mode}`)) + " · " + j(P(X)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(BE, {
				title: P(X)("config.sampling"),
				icon: P(sT),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [
					(z(), B(R, null, L(_e, (e) => (z(), B(R, { key: e.key }, [Se(e.key) ? (z(), V(ZD, {
						key: 0,
						label: P(X)(`sampling.${e.key}`)
					}, {
						default: F(() => [H("div", ZO, [H("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: xe.value[e.key],
							onInput: (t) => Ce(e.key, we(t))
						}, null, 40, QO), H("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: xe.value[e.key],
							onChange: (t) => Ce(e.key, we(t))
						}, null, 40, $O)])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)),
					H("div", ek, [(z(), B(R, null, L(ve, (e) => (z(), B(R, { key: e }, [Se(e) ? (z(), V(ZD, {
						key: 0,
						label: P(X)(`sampling.${e}`)
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							value: xe.value[e],
							onChange: (t) => Ce(e, we(t))
						}, null, 40, tk)]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)), Se("reasoning_effort") ? (z(), V(ZD, {
						key: 0,
						label: P(X)("sampling.reasoning_effort")
					}, {
						default: F(() => [H("select", {
							class: "input",
							value: xe.value.reasoning_effort,
							onChange: r[27] ||= (e) => Ce("reasoning_effort", e.target.value)
						}, [(z(), B(R, null, L(be, (e) => H("option", {
							key: e,
							value: e
						}, j(P(X)(`effort.${e}`)), 9, rk)), 64))], 40, nk)]),
						_: 1
					}, 8, ["label"])) : G("", !0)]),
					(z(), B(R, null, L(ye, (e) => (z(), B(R, { key: e }, [Se(e) ? (z(), V(ZD, {
						key: 0,
						label: P(X)(`sampling.${e}`),
						inline: ""
					}, {
						default: F(() => [U(KD, {
							"model-value": !!xe.value[e],
							"onUpdate:modelValue": (t) => Ce(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), ak = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function ok(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: X("config.transport"),
			options: t([...xs], (e) => X(`transport.${e}`))
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
				label: rp(e, "workflows", t.id, "name", t.name)
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
			options: t(ak, (e) => X(`um.genType.${e}`))
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
		} } : {}
	};
}
var sk = (e) => e.modules.filter((e) => e.toggle === "user");
function ck(e) {
	let t = ok(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return sk(e).length && r.push({
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
				"input.shaped"
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
function lk(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function uk(e, t) {
	return t === "module" ? sk(e).map((t) => ({
		value: t.id,
		label: rp(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: rp(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function dk(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: uk(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? rp(e, "params", t.id, "label", t.label) : r;
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
			label: fk(e, t.id, n.value, n.label)
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
	return ok(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var fk = (e, t, n, r) => np(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), pk = {
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
function mk(e, t) {
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
		let n = String(uk(e, t)[0]?.value ?? "");
		return hk(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return hk(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function hk(e, t, n) {
	let r = dk(e, n);
	return t.path && dk(e, t.path).kind === r.kind && pk[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function gk(e, t, n = "") {
	return e === "bool" ? X(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? X(`um.op.list.${t}`) : e === "enum" ? X(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var _k = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(X("um.or")) : t === void 0 ? "" : n(t);
};
function vk(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? X("um.kw.input") : X("um.kw.recentN", { n: t.depth ?? 3 })} ${X(`um.kw.${t.op}`)} ${t.words.join(X("um.or"))}`;
	let n = dk(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? X("um.boolDesc", {
		label: n.label,
		value: gk(n.kind, t.op, t.path)
	}) : `${n.label} ${gk(n.kind, t.op)} ${_k(n, t.value)}`;
}
function yk(e, t) {
	let n = t.rules.filter(vd);
	return n.length ? n.map((t) => vk(e, t)).join(t.match === "any" ? `\n${X("um.match.anyJoin")} ` : `\n${X("um.match.allJoin")} `) : X("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var bk = ["aria-label"], xk = { class: "um-picker-head" }, Sk = { class: "small muted" }, Ck = { class: "um-choice-text" }, wk = { class: "xs muted" }, Tk = ["data-template", "onClick"], Ek = { class: "um-choice-text" }, Dk = {
	key: 0,
	class: "xs muted um-choice-desc"
}, Ok = ["data-id"], kk = ["aria-label", "onPointerdown"], Ak = ["onClick"], jk = { class: "um-row-name ellipsis" }, Mk = { class: "um-row-meta xs muted ellipsis" }, Nk = {
	key: 3,
	class: "faint small"
}, Pk = /* @__PURE__ */ I({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => _h(n.preset)), a = K(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? rp(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? rp(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.filter(ld).map((e) => e.point))].map(o).concat(e.vars.filter(ld).map((e) => s(e.var))).join(" · "), l = (e) => kd(n.preset, e), u = (e) => X("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(vd);
		function f(e, t) {
			e.enabled = t, J();
		}
		let p = K(() => df(n.preset).map((e) => ({
			tpl: e,
			body: op(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ N(!1), h = /* @__PURE__ */ N(null);
		function g() {
			m.value = !1;
			let e = xh(n.preset, X("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function v(e) {
			m.value = !1;
			let t = Sh(n.preset, op(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function y() {
			if (!p.value.length) return g();
			m.value = !m.value, m.value && (await Wn(), h.value?.querySelector(".um-choice")?.focus());
		}
		let b = /* @__PURE__ */ N(null);
		async function x(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await Xb(Jd(e).modules);
				let { added: t, missing: i } = Dh(n.preset, e);
				_(i ? "warning" : "success", i ? X("um.importedMissing", {
					n: t.length,
					missing: i
				}) : X("um.imported", { n: t.length }));
			} catch (e) {
				Wb(e) ? _("info", e.message) : _("error", X("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => yb(`${n.preset.id}.ap-modules.json`, Eh(n.preset)), C = /* @__PURE__ */ N(null), ee = /* @__PURE__ */ N(null);
		function w(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), ee.value = t;
		}
		function te(e) {
			let t = ee.value;
			if (!t || !C.value) return;
			let r = [...C.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && Th(n.preset, t, r);
		}
		let T = () => {
			ee.value = null;
		};
		return (t, n) => (z(), V(BE, {
			title: P(X)("um.title"),
			help: P(X)("um.help")
		}, {
			actions: F(() => [
				a.value ? (z(), V($, {
					key: 0,
					icon: P(KT),
					label: P(X)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : G("", !0),
				i.value.length ? (z(), V($, {
					key: 1,
					icon: P($w),
					label: P(X)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : G("", !0),
				a.value && i.value.length ? (z(), V($, {
					key: 2,
					icon: P(DT),
					label: P(X)("um.new"),
					active: m.value,
					small: "",
					align: "end",
					onClick: y
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
					onKeydown: n[2] ||= fs(us((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					H("div", xk, [H("span", Sk, j(P(X)("um.startFrom")), 1), U($, {
						icon: P(XT),
						label: P(X)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					H("button", {
						type: "button",
						class: "um-choice",
						onClick: g
					}, [U(P(aT)), H("span", Ck, [H("span", null, j(P(X)("um.blank")), 1), H("span", wk, j(P(X)("um.blank.desc")), 1)])]),
					(z(!0), B(R, null, L(p.value, (e) => (z(), B("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => v(e.tpl)
					}, [U(P(mT)), H("span", Ek, [H("span", null, j(e.body.name), 1), e.body.description ? (z(), B("span", Dk, j(e.body.description), 1)) : G("", !0)])], 8, Tk))), 128))
				], 40, bk)) : G("", !0),
				i.value.length ? (z(), B("div", {
					key: 1,
					ref_key: "listEl",
					ref: C,
					class: "um-list"
				}, [(z(!0), B(R, null, L(i.value, (t) => (z(), B("div", {
					key: t.id,
					class: A(["um-row", {
						off: !t.enabled,
						dragging: ee.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (z(), B("span", {
						key: 0,
						class: "um-grip",
						"aria-label": P(X)("um.reorder"),
						onPointerdown: (e) => w(e, t.id),
						onPointermove: te,
						onPointerup: T,
						onPointercancel: T
					}, [U(P(dT))], 40, kk)) : G("", !0),
					H("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [H("span", jk, j(t.name || P(X)("um.untitled")), 1), H("span", Mk, j(c(t) || P(X)("um.noEntries")), 1)], 8, Ak),
					l(t).length ? (z(), V(QT, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: F(() => [U(P(WT), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : G("", !0),
					d(t) ? (z(), V(QT, {
						key: 2,
						text: P(yk)(e.preset, t.trigger),
						align: "end"
					}, {
						default: F(() => [U(P(ZT), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : G("", !0),
					U(KD, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, Ok))), 128))], 512)) : a.value && !m.value ? (z(), B("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: y
				}, [U(P(DT)), W(j(P(X)("um.new")), 1)])) : a.value ? G("", !0) : (z(), B("div", Nk, j(P(X)("um.noPoints")), 1)),
				H("input", {
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
}), Fk = ["title"], Ik = ["aria-label", "onClick"], Lk = ["placeholder"], Rk = /* @__PURE__ */ I({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ai({
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
		let t = ui(e, "modelValue"), n = e, r = /* @__PURE__ */ N(""), i = /* @__PURE__ */ N(null);
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
		}, j(t), 9, Fk), H("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: us((e) => c(n), ["stop"])
		}, [U(P(XT))], 8, Ik)], 2))), 128)), ir(H("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: A(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, Lk), [[es, r.value]])]));
	}
}), zk = { class: "rule" }, Bk = { class: "rule-head" }, Vk = ["value", "aria-label"], Hk = ["label"], Uk = ["value"], Wk = ["value"], Gk = ["value"], Kk = ["value"], qk = ["value"], Jk = {
	key: 1,
	class: "grow"
}, Yk = {
	key: 0,
	class: "rule-body"
}, Xk = { class: "row wrap" }, Zk = {
	key: 0,
	class: "unit small muted"
}, Qk = ["value"], $k = ["value"], eA = { value: "any" }, tA = { value: "none" }, nA = { class: "row kw-words" }, rA = {
	key: 1,
	class: "rule-body"
}, iA = ["value"], aA = {
	key: 2,
	class: "rule-body"
}, oA = ["value"], sA = ["value"], cA = { class: "row wrap option-chips" }, lA = ["aria-pressed", "onClick"], uA = {
	key: 2,
	class: "row"
}, dA = ["value"], fA = ["value"], pA = ["value"], mA = ["list", "value"], hA = ["value"], gA = {
	key: 3,
	class: "rule-error xs"
}, _A = /* @__PURE__ */ I({
	__name: "RuleRow",
	props: /*@__PURE__*/ ai({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ai(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = ui(e, "modelValue"), r = K(() => ck(t.preset)), i = K(() => lk(n.value)), a = K(() => uk(t.preset, i.value)), o = K(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = K(() => n.value.kind === "var" ? dk(t.preset, n.value.path) : null), c = K(() => wd(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = mk(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = hk(t.preset, r, `${i}.${e}`);
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
		let g = K(() => s.value?.kind === "list" ? "list" : "bool"), _ = K(() => pk[g.value].map((e) => ({
			value: e,
			label: gk(g.value, e, n.value.path)
		}))), v = K(() => (s.value ? pk[s.value.kind] : []).map((e) => ({
			value: e,
			label: gk(s.value.kind, e)
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
		return (e, t) => (z(), B("div", zk, [
			H("div", Bk, [
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
				}, j(e.label), 9, Uk))), 128))], 8, Hk))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (z(), B("option", {
					key: 0,
					value: i.value
				}, j(n.value.path), 9, Wk)) : G("", !0)], 40, Vk),
				a.value.length ? (z(), B("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
					key: String(e.value),
					value: e.value
				}, j(e.label), 9, Kk))), 128)), a.value.some((e) => String(e.value) === o.value) ? G("", !0) : (z(), B("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, j(o.value), 9, qk))], 40, Gk)) : (z(), B("span", Jk)),
				U($, {
					icon: P(XT),
					label: P(X)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (z(), B("div", Yk, [H("div", Xk, [
				U(TO, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (z(), B("label", Zk, [H("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? P(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, Qk), W(" " + j(P(X)("um.kw.messages")), 1)])) : G("", !0),
				H("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [H("option", eA, j(P(X)("um.kw.any")), 1), H("option", tA, j(P(X)("um.kw.none")), 1)], 40, $k)
			]), H("div", nA, [U(Rk, {
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
				icon: P(jT),
				label: P(X)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (z(), B("div", rA, [H("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, iA)])) : s.value ? (z(), B("div", aA, [s.value.kind === "bool" || s.value.kind === "list" ? (z(), V(TO, {
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
			}, j(e.label), 9, sA))), 128))], 40, oA), H("div", cA, [(z(!0), B(R, null, L(s.value.options, (e) => (z(), B("button", {
				key: String(e.value),
				type: "button",
				class: A(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, j(e.label), 11, lA))), 128))])], 64)) : (z(), B("div", uA, [H("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(v.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, fA))), 128))], 40, dA), s.value.kind === "number" ? (z(), B("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, pA)) : (z(), B(R, { key: 1 }, [H("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, mA), s.value.suggestions?.length ? (z(), B("datalist", {
				key: 0,
				id: l
			}, [(z(!0), B(R, null, L(s.value.suggestions, (e) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, hA))), 128))])) : G("", !0)], 64))]))])) : G("", !0),
			c.value ? (z(), B("div", gA, j(c.value), 1)) : G("", !0)
		]));
	}
}), vA = { class: "trigger" }, yA = {
	key: 1,
	class: "always faint small"
}, bA = {
	key: 0,
	class: "rule-join xs faint"
}, xA = { class: "btn ghost add picker" }, SA = ["aria-label"], CA = ["label"], wA = ["value"], TA = /* @__PURE__ */ I({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ai({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = ui(e, "modelValue"), r = K(() => ck(t.preset)), i = /* @__PURE__ */ N(null), a = K(() => [{
			value: "all",
			label: X("um.match.all")
		}, {
			value: "any",
			label: X("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(mk(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (z(), B("div", vA, [
			n.value.rules.length > 1 ? (z(), V(TO, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : G("", !0),
			n.value.rules.length ? G("", !0) : (z(), B("div", yA, j(P(X)("um.always")), 1)),
			(z(!0), B(R, null, L(n.value.rules, (t, r) => (z(), B(R, { key: r }, [r > 0 ? (z(), B("div", bA, j(n.value.match === "any" ? P(X)("um.match.anyJoin") : P(X)("um.match.allJoin")), 1)) : G("", !0), U(_A, {
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
			H("label", xA, [
				U(P(DT)),
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
				}, j(e.label), 9, wA))), 128))], 8, CA))), 128))], 40, SA)
			])
		]));
	}
}), EA = { class: "um-entry-head" }, DA = { class: "um-var-label grow ellipsis" }, OA = {
	key: 0,
	class: "um-warn xs"
}, kA = ["placeholder"], AA = [
	"value",
	"placeholder",
	"onInput"
], jA = { class: "um-var-pair-head" }, MA = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], NA = [
	"value",
	"placeholder",
	"onInput"
], PA = ["id"], FA = ["value"], IA = /* @__PURE__ */ I({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => Dd(n.preset, n.update.var)), a = K(() => i.value?.type !== n.update.type), o = K(() => i.value ? rp(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = K(() => i.value && rp(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = K(() => {
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
			n.update.type === "list" && (n.update.items[e] = fd(t, r));
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
			off: !P(ld)(e.update)
		}]) }, [
			H("div", EA, [
				U(KD, {
					"model-value": P(ld)(e.update),
					label: P(X)("panel.enabled"),
					"onUpdate:modelValue": n[0] ||= (t) => P(dd)(e.update, t)
				}, null, 8, ["model-value", "label"]),
				H("span", DA, j(o.value), 1),
				U(LE, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				U($, {
					icon: P(XT),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (z(), B("div", OA, [U(P(WT)), W(j(P(X)("um.bv.lost")), 1)])) : G("", !0),
			e.update.type === "string" ? ir((z(), B("textarea", {
				key: 1,
				"onUpdate:modelValue": n[2] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: P(X)("um.bv.append")
			}, null, 8, kA)), [[es, e.update.text]]) : e.update.type === "list" ? (z(!0), B(R, { key: 2 }, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: A(["um-var-row", { off: !P(ld)(t) }])
			}, [
				U(KD, {
					"model-value": P(ld)(t),
					label: P(X)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => d(n, P(ud)(t), e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				H("textarea", {
					value: P(ud)(t),
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: P(X)("um.bv.item"),
					onInput: (e) => d(n, e.target.value, P(ld)(t))
				}, null, 40, AA),
				U($, {
					icon: P(XT),
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
				class: A(["um-var-pair", { off: !P(ld)(t) }])
			}, [H("div", jA, [
				U(KD, {
					"model-value": P(ld)(t),
					label: P(X)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => P(dd)(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				ir(H("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input bare um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: P(X)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, MA), [[es, t.key]]),
				U($, {
					icon: P(XT),
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
			}, null, 40, NA)], 2))), 128)), H("datalist", { id: l.value }, [(z(!0), B(R, null, L(c.value, ([e]) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, FA))), 128))], 8, PA)], 64)),
			e.update.type === "string" ? G("", !0) : (z(), B("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: f
			}, [U(P(DT)), W(j(e.update.type === "dict" ? P(X)("um.bv.addKey") : P(X)("um.bv.addItem")), 1)]))
		], 2));
	}
}), LA = { class: "um-editor" }, RA = { class: "um-head" }, zA = ["placeholder", "aria-label"], BA = { class: "um-entry-head" }, VA = ["onUpdate:modelValue", "aria-label"], HA = ["value"], UA = ["value"], WA = [
	"value",
	"aria-label",
	"onChange"
], GA = ["value"], KA = {
	key: 0,
	class: "um-warn xs"
}, qA = ["onUpdate:modelValue", "placeholder"], JA = {
	key: 1,
	class: "rule-error xs pre"
}, YA = {
	key: 0,
	class: "btn ghost add picker"
}, XA = ["aria-label"], ZA = ["value"], QA = { class: "um-foot" }, $A = ["title"], ej = ["title"], tj = ["title"], nj = /* @__PURE__ */ I({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		dr(() => n.module, J, { deep: !0 });
		let i = /* @__PURE__ */ N(null);
		Ur(() => {
			n.module.entries.some((e) => e.text) || Wn(() => i.value?.select());
		});
		let a = K(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: rp(n.preset, "insertionPoints", e.id, "label", e.label),
			description: rp(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !Td(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => vl(e.text).errors, d = (e) => u(e).map((e) => e.line ? X("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = bh(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = K(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: rp(n.preset, "vars", e.id, "label", e.label ?? e.id)
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
			v.value ? (wh(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = Ch(n.preset, n.module.id, (e) => X("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => yb(`${n.preset.id}.${bb(n.module.name)}.ap-modules.json`, Eh(n.preset, [n.module.id]));
		return (t, n) => (z(), B("div", LA, [
			H("header", RA, [
				U($, {
					icon: P(Dw),
					label: P(X)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				ir(H("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: P(X)("um.untitled"),
					"aria-label": P(X)("um.name")
				}, null, 8, zA), [[es, e.module.name]]),
				U(KD, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: P(X)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			U(BE, {
				title: P(X)("um.content"),
				help: P(X)("um.content.help")
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.module.entries, (t, n) => (z(), B("div", {
					key: t.id,
					class: A(["um-entry", {
						lost: s(t),
						off: !P(ld)(t)
					}])
				}, [
					H("div", BA, [
						U(KD, {
							"model-value": P(ld)(t),
							label: P(X)("panel.enabled"),
							"onUpdate:modelValue": (e) => P(dd)(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						]),
						ir(H("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": P(X)("um.point")
						}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
							key: e.id,
							value: e.id
						}, j(e.label), 9, HA))), 128)), s(t) ? (z(), B("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, j(P(X)("um.pointMissing", { id: t.point })), 9, UA)) : G("", !0)], 8, VA), [[rs, t.point]]),
						U(LE, {
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
						}, j(P(X)(`um.role.${e || "merge"}`)), 9, GA)), 64))], 40, WA),
						e.module.entries.length > 1 || e.module.vars.length ? (z(), V($, {
							key: 0,
							icon: P(XT),
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
					s(t) ? (z(), B("div", KA, [U(P(WT)), W(j(P(X)("um.pointLost")), 1)])) : G("", !0),
					ir(H("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: P(X)("um.text.placeholder")
					}, null, 8, qA), [[es, t.text]]),
					u(t).length ? (z(), B("div", JA, j(d(t)), 1)) : G("", !0)
				], 2))), 128)), a.value.length ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [U(P(DT)), W(j(P(X)("um.addEntry")), 1)])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (z(), V(BE, {
				key: 0,
				title: P(X)("um.bv"),
				help: P(X)("um.bv.help")
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.module.vars, (t, n) => (z(), V(IA, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (z(), B("label", YA, [
					U(P(DT)),
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
					}, j(e.label), 9, ZA))), 128))], 40, XA)
				])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : G("", !0),
			U(BE, {
				title: P(X)("um.trigger"),
				help: P(X)("um.trigger.help")
			}, {
				default: F(() => [U(TA, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			H("footer", QA, [
				H("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.export"),
					onClick: x
				}, [U(P($w)), H("span", null, j(P(X)("um.export")), 1)], 8, $A),
				H("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.duplicate"),
					onClick: b
				}, [U(P(Yw)), H("span", null, j(P(X)("um.duplicate")), 1)], 8, ej),
				n[6] ||= H("span", { class: "grow" }, null, -1),
				H("button", {
					type: "button",
					class: A(["btn ghost danger", { armed: v.value }]),
					title: P(X)("common.delete"),
					onClick: y
				}, [U(P(UT)), H("span", null, j(v.value ? P(X)("um.confirmDelete") : P(X)("common.delete")), 1)], 10, tj)
			])
		]));
	}
}), rj = {
	key: 0,
	class: "module-row"
}, ij = { class: "grow" }, aj = { class: "ellipsis" }, oj = ["aria-label"], sj = ["aria-checked", "onClick"], cj = { class: "grow" }, lj = { class: "grow" }, uj = { class: "ellipsis" }, dj = {
	key: 0,
	class: "empty"
}, fj = /* @__PURE__ */ I({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bO(), i = K(() => t.value && n.value ? yu(t.value, n.value) : {}), a = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = _u(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : rp(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : rp(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? rp(e, "groups", t, "label", r?.label ?? t) : X("modules.other"),
					help: t && rp(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => rp(t.value, "modules", e.id, "name", e.name), s = (e) => rp(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(null), _ = K(() => t.value && h.value ? _h(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Wn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Wn(() => y()?.scrollTo({ top: v }));
		}
		return dr(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !P(t) || !P(n) ? (z(), V(SO, { key: 0 })) : _.value ? (z(), B("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(z(), V(nj, {
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
			U(Pk, {
				preset: P(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(z(!0), B(R, null, L(a.value, (e) => (z(), V(BE, {
				key: e.id,
				title: e.label,
				help: e.help
			}, Zr({
				default: F(() => [(z(!0), B(R, null, L(e.sets, (t) => (z(), B(R, { key: t.key }, [t.label ? (z(), B("div", rj, [H("span", ij, [H("span", aj, j(t.label), 1), U(LE, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (z(), V(KD, {
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
					H("span", cj, j(o(e)), 1),
					U(LE, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, sj))), 128))], 10, oj)) : G("", !0)], 64))), 128)), (z(!0), B(R, null, L(e.toggles, (e) => (z(), B("div", {
					key: e.id,
					class: "module-row"
				}, [H("span", lj, [H("span", uj, j(o(e)), 1), U(LE, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), U(KD, {
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
				fn: F(() => [U(KD, {
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
			a.value.length ? G("", !0) : (z(), B("div", dj, j(P(X)("modules.none")), 1))
		], 512));
	}
}), pj = ["value", "onChange"], mj = ["value"], hj = {
	key: 2,
	class: "unit"
}, gj = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], _j = {
	key: 0,
	class: "small muted"
}, vj = [
	"list",
	"value",
	"placeholder",
	"onChange"
], yj = ["id"], bj = ["value"], xj = /* @__PURE__ */ I({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bO(), i = K(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? rp(e, "groups", t, "label", e.groups[t]?.label ?? t) : X("writing.params"),
				help: t && rp(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => rp(t.value, "params", e.id, "label", e.label), o = (e) => rp(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => np(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => Bl(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !P(t) || !P(n) ? (z(), V(SO, { key: 0 })) : (z(!0), B(R, { key: 1 }, L(i.value, (e) => (z(), V(BE, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: P(RT)
		}, {
			default: F(() => [(z(!0), B(R, null, L(e.params, (e) => (z(), V(ZD, {
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
				}, j(s(e, t.value, t.label)), 9, mj))), 128))], 40, pj)) : e.type === "list" ? (z(), V(Rk, {
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
				])) : e.type === "number" ? (z(), B("div", hj, [H("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, gj), e.unit ? (z(), B("span", _j, j(e.unit), 1)) : G("", !0)])) : (z(), B(R, { key: 3 }, [H("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, vj), e.options?.length ? (z(), B("datalist", {
					key: 0,
					id: f(e)
				}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
					key: String(t.value),
					value: t.value
				}, j(s(e, t.value, t.label)), 9, bj))), 128))], 8, yj)) : G("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), Sj = { class: "kv" }, Cj = {
	key: 0,
	class: "kv-row"
}, wj = { class: "kv-key ellipsis" }, Tj = { class: "kv-value pre small" }, Ej = {
	key: 0,
	class: "kv-actions"
}, Dj = {
	key: 1,
	class: "kv-edit col"
}, Oj = ["placeholder"], kj = ["placeholder"], Aj = { class: "row end" }, jj = {
	key: 0,
	class: "kv-edit col"
}, Mj = ["placeholder"], Nj = ["placeholder"], Pj = { class: "row end" }, Fj = {
	key: 1,
	class: "faint small kv-empty"
}, Ij = /* @__PURE__ */ I({
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
		return (t, n) => (z(), B("div", Sj, [
			(z(!0), B(R, null, L(e.entries, (t, l) => (z(), B(R, { key: l }, [i.value === l ? (z(), B("div", Dj, [
				ir(H("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, Oj), [[es, a.value]]),
				ir(H("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, kj), [[es, o.value]]),
				H("div", Aj, [U($, {
					icon: P(XT),
					label: P(X)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(Pw),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (z(), B("div", Cj, [
				H("div", wj, j(l), 1),
				H("div", Tj, j(t), 1),
				e.readonly ? G("", !0) : (z(), B("div", Ej, [U($, {
					icon: P(ET),
					label: P(X)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), U($, {
					icon: P(UT),
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
			i.value === "" ? (z(), B("div", jj, [
				ir(H("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, Mj), [[es, a.value]]),
				ir(H("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, Nj), [[es, o.value]]),
				H("div", Pj, [U($, {
					icon: P(XT),
					label: P(X)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(Pw),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : G("", !0),
			!Object.keys(e.entries).length && i.value === null ? (z(), B("div", Fj, j(P(X)("memory.empty")), 1)) : G("", !0),
			!e.readonly && i.value === null ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [U(P(DT)), W(j(P(X)("common.add")), 1)])) : G("", !0)
		]));
	}
}), Lj = {
	key: 1,
	class: "faint small"
}, Rj = {
	key: 0,
	class: "badge neutral"
}, zj = ["placeholder"], Bj = {
	key: 1,
	class: "faint small"
}, Vj = /* @__PURE__ */ I({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = bO(), r = K(() => n.value ? nm(n.value) : null), i = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => RC.value ? $g() : void 0, o = K(() => (Z.chatRev, i.value ? Up(Infinity, a()) : {})), s = K(() => r.value ? Kp(r.value) : {}), c = K(() => (Z.chatRev, i.value ? Wp(Infinity, a()) : null));
		async function l(e, t) {
			await Gp({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), mx();
		}
		async function u(e) {
			await Gp({
				type: "memory.delete",
				key: e,
				source: "user"
			}), mx();
		}
		let d = (e, t) => r.value && qp(r.value, "replace", e, t, "user"), f = (e) => r.value && qp(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ N("");
		dr(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = K(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await Gp({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), mx();
		}
		return (e, t) => !P(n) || !r.value ? (z(), V(SO, { key: 0 })) : (z(), B(R, { key: 1 }, [
			U(BE, {
				title: P(X)("memory.chat"),
				icon: P(vT),
				help: P(X)("memory.chat.hint")
			}, {
				default: F(() => [i.value ? (z(), V(Ij, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (z(), B("div", Lj, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(BE, {
				title: P(X)("memory.global"),
				icon: P(uT),
				help: P(X)("memory.global.hint")
			}, {
				actions: F(() => [U($, {
					icon: P(GT),
					label: P(X)("common.undo"),
					small: "",
					align: "end",
					disabled: !P(Jp)(r.value),
					onClick: t[0] ||= (e) => P(Xp)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), U($, {
					icon: P(kT),
					label: P(X)("common.redo"),
					small: "",
					align: "end",
					disabled: !P(Yp)(r.value),
					onClick: t[1] ||= (e) => P(Zp)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: F(() => [U(Ij, {
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
			U(BE, {
				title: P(X)("memory.recap"),
				icon: P(PT),
				help: P(X)("memory.recap.hint")
			}, {
				actions: F(() => [c.value ? (z(), B("span", Rj, "#0–" + j(c.value.coversUpTo), 1)) : G("", !0), i.value ? (z(), V($, {
					key: 1,
					icon: P(Pw),
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
				default: F(() => [i.value ? ir((z(), B("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: P(X)("memory.recap.empty")
				}, null, 8, zj)), [[es, p.value]]) : (z(), B("div", Bj, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), Hj = { class: "row tight xs muted" }, Uj = { class: "row" }, Wj = {
	key: 0,
	class: "xs text-danger"
}, Gj = { class: "row wrap xs muted" }, Kj = { class: "badge neutral" }, qj = {
	key: 0,
	class: "badge neutral"
}, Jj = { class: "badge neutral" }, Yj = {
	key: 1,
	class: "badge warn"
}, Xj = ["title"], Zj = ["title"], Qj = {
	key: 0,
	class: "row wrap xs muted"
}, $j = { class: "grow" }, eM = { key: 0 }, tM = ["onClick"], nM = { class: "grow mono" }, rM = { class: "xs muted" }, iM = { class: "row xs muted" }, aM = { class: "badge neutral" }, oM = { class: "pre mono scroll" }, sM = {
	key: 0,
	class: "xs faint region-msg"
}, cM = { key: 1 }, lM = ["onClick"], uM = { class: "grow mono" }, dM = { class: "xs muted" }, fM = {
	key: 0,
	class: "region-msg"
}, pM = { class: "pre mono scroll" }, mM = {
	key: 0,
	class: "xs faint"
}, hM = {
	key: 2,
	class: "xs text-warning"
}, gM = {
	key: 1,
	class: "faint small"
}, _M = ["onClick"], vM = { class: "mono grow ellipsis" }, yM = {
	key: 0,
	class: "badge warn"
}, bM = { class: "xs muted" }, xM = { class: "xs muted" }, SM = { class: "row xs muted" }, CM = { class: "grow" }, wM = { class: "mono scroll" }, TM = { class: "row xs muted" }, EM = { class: "grow" }, DM = { class: "mono scroll" }, OM = {
	key: 0,
	class: "faint small"
}, kM = { class: "row xs" }, AM = { class: "badge neutral" }, jM = { class: "muted" }, MM = { class: "mono scroll" }, NM = {
	key: 0,
	class: "faint small"
}, PM = { class: "row xs" }, FM = { class: "badge neutral" }, IM = { class: "grow muted" }, LM = { class: "small" }, RM = {
	key: 0,
	class: "faint small"
}, zM = { class: "xs faint mono build" }, BM = /* @__PURE__ */ I({
	__name: "DebugTab",
	setup(t) {
		let n = K(() => kh.log.find((e) => e.kind === "assembly")?.data), r = K(() => kh.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ sn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ sn({});
		dr(n, async (t) => {
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
		}), g = K(() => kh.log.filter((e) => e.kind !== "assembly")), _ = K(() => {
			Z.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of ub(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (z(), B(R, null, [
			U(BE, {
				title: P(X)("debug.dev"),
				icon: P(FT),
				help: P(X)("debug.dev.hint")
			}, {
				actions: F(() => [H("span", Hj, [H("span", { class: A(["dot status-dot", P(Ob).status]) }, null, 2), W(j(P(X)(`debug.dev.${P(Ob).status}`)), 1)])]),
				default: F(() => [U(ZD, { label: P(X)("debug.dev.url") }, {
					default: F(() => [H("div", Uj, [ir(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						es,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), U(KD, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: P(X)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), P(Ob).error ? (z(), B("span", Wj, j(P(Ob).error), 1)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(BE, {
				title: P(X)("debug.assembly"),
				icon: P(oT),
				collapsible: ""
			}, {
				default: F(() => [n.value ? (z(), B(R, { key: 0 }, [
					H("div", Gj, [
						H("span", Kj, j(P(X)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (z(), B("span", qj, j(n.value.workflow), 1)) : G("", !0),
						H("span", Jj, j(n.value.origin), 1),
						n.value.dryRun ? (z(), B("span", Yj, "dry run")) : G("", !0),
						n.value.input ? (z(), B("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, j(P(X)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, Xj)) : G("", !0),
						n.value.storyline ? (z(), B("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, j(n.value.storyline.main ? P(X)("storylines.main") : n.value.storyline.name) + j(n.value.storyline.if ? " · if" : "") + j(n.value.storyline.new ? " · new" : "") + j(n.value.storyline.frozen ? " · frozen" : ""), 9, Zj)) : G("", !0),
						t[3] ||= H("span", { class: "grow" }, null, -1),
						W(j(u(n.value.at)), 1)
					]),
					r.value ? (z(), B("div", Qj, [
						H("span", { class: A(["badge", r.value.reason ? "warn" : "neutral"]) }, j(r.value.reason ? P(X)(`debug.cache.flush.${r.value.reason}`) : P(X)("debug.cache.kept")), 3),
						H("span", $j, j(p(r.value)), 1),
						r.value === n.value.cache ? G("", !0) : (z(), B("span", eM, j(u(r.value.at)), 1))
					])) : G("", !0),
					H("div", null, [(z(!0), B(R, null, L(n.value.regions, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						U(P(Iw), { class: A(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						H("span", nM, j(e.id), 1),
						H("span", rM, j(e.messages.length) + " · " + j(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + j(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, tM), i.has(e.id) ? (z(), B(R, { key: 0 }, [(z(!0), B(R, null, L(e.messages, (e, t) => (z(), B("div", {
						key: t,
						class: "region-msg"
					}, [H("div", iM, [H("span", aM, j(e.role), 1), W(j(e.chars) + " ch", 1)]), H("div", oM, j(e.content), 1)]))), 128)), e.messages.length ? G("", !0) : (z(), B("div", sM, j(P(X)("debug.emptyRegion")), 1))], 64)) : G("", !0)]))), 128))]),
					n.value.vars?.length ? (z(), B("div", cM, [(z(!0), B(R, null, L(n.value.vars, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						U(P(Iw), { class: A(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						H("span", uM, j(e.id), 1),
						H("span", dM, j(e.text.length) + " ch", 1)
					], 8, lM), i.has(`var:${e.id}`) ? (z(), B("div", fM, [H("div", pM, j(e.text), 1), e.text ? G("", !0) : (z(), B("div", mM, j(P(X)("debug.emptyRegion")), 1))])) : G("", !0)]))), 128))])) : G("", !0),
					n.value.warnings.length ? (z(), B("div", hM, j(n.value.warnings.join(" · ")), 1)) : G("", !0)
				], 64)) : (z(), B("div", gM, j(P(X)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(BE, {
				title: P(X)("debug.requests"),
				icon: P(qw),
				collapsible: ""
			}, {
				default: F(() => [(z(!0), B(R, null, L(P(kh).requests, (e, t) => (z(), B("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [H("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					H("span", vM, j(e.genId) + " · #" + j(e.step), 1),
					e.error ? (z(), B("span", yM, j(P(X)("debug.error")), 1)) : G("", !0),
					H("span", bM, j(f(e.usage)), 1),
					H("span", xM, j(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, _M), s.value === t ? (z(), B(R, { key: 0 }, [
					H("div", SM, [H("span", CM, j(P(X)("debug.request")), 1), U($, {
						icon: P(Xw),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", wM, j(c(e.request)), 1),
					H("div", TM, [H("span", EM, j(P(X)("debug.response")), 1), U($, {
						icon: P(Xw),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", DM, j(e.error ?? c(e.response ?? "")), 1)
				], 64)) : G("", !0)]))), 128)), P(kh).requests.length ? G("", !0) : (z(), B("div", OM, j(P(X)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(BE, {
				title: P(X)("debug.log"),
				icon: P(PT),
				collapsible: "",
				open: !1
			}, {
				actions: F(() => [U($, {
					icon: P(UT),
					label: P(X)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => P(kh).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: F(() => [(z(!0), B(R, null, L(g.value, (e, n) => (z(), B("div", {
					key: n,
					class: "req"
				}, [H("div", kM, [
					H("span", AM, j(e.kind), 1),
					t[4] ||= H("span", { class: "grow" }, null, -1),
					H("span", jM, j(u(e.at)), 1)
				]), H("pre", MM, j(c(e.data)), 1)]))), 128)), g.value.length ? G("", !0) : (z(), B("div", NM, j(P(X)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(BE, {
				title: P(X)("debug.annotations"),
				icon: P(yT),
				help: P(X)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(_.value, (e, t) => (z(), B("div", {
					key: t,
					class: "req"
				}, [H("div", PM, [H("span", FM, "#" + j(e.mesId), 1), H("span", IM, "“" + j(e.quote) + "”", 1)]), H("div", LM, j(e.comment), 1)]))), 128)), _.value.length ? G("", !0) : (z(), B("div", RM, j(P(X)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H("div", zM, "Advanced Preset " + j(P("1.11.0")) + " · " + j(P("e754142e1905d832")), 1)
		], 64));
	}
}), VM = {
	key: 1,
	class: "empty"
}, HM = { class: "row storylines-head" }, UM = { class: "xs muted grow" }, WM = ["aria-expanded", "onClick"], GM = { class: "card-title grow ellipsis" }, KM = ["title", "aria-label"], qM = {
	key: 1,
	class: "badge warn"
}, JM = { class: "xs faint" }, YM = {
	key: 0,
	class: "card-body col"
}, XM = ["aria-label"], ZM = {
	key: 1,
	class: "faint small"
}, QM = {
	key: 2,
	class: "storyline-floors"
}, $M = ["title", "onClick"], eN = { class: "badge neutral mono" }, tN = { class: "xs muted" }, nN = { class: "grow ellipsis" }, rN = /* @__PURE__ */ I({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n } = bO(), r = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), i = K(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), a = K(() => r.value && n.value?.storylines ? WC(i.value) : []), o = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), s = (e) => {
			let t = new Set(o.value);
			t.has(e) ? t.delete(e) : t.add(e), o.value = t;
		};
		dr(() => Z.storylineFocus, (e) => {
			e !== null && (o.value = /* @__PURE__ */ new Set([...o.value, e]), Z.storylineFocus = null);
		}, { immediate: !0 });
		let c = (e) => e.main ? e.name ? X("storylines.mainNamed", { name: e.name }) : X("storylines.main") : e.name || X("storylines.unnamed"), l = () => {
			mx(), ow();
		};
		async function u(e) {
			await n_(e.key, !e.if), l();
		}
		async function d(e) {
			await a_(e.key, !e.hidden), l();
		}
		async function f(e) {
			await Yy(e.key) && l();
		}
		async function p(e) {
			let t = await g(`<h3>${m(e.main && !e.name ? X("storylines.nameMain") : X("storylines.renameTitle", { name: c(e) }))}</h3>${e.main ? `<p>${m(X("storylines.nameMain.hint"))}</p>` : ""}`, e.name, X("common.save"), X("common.cancel"));
			if (t === null) return;
			let n = t.trim();
			if (!ou(n)) return _("warning", X("storylines.invalidName"), X("app.name"));
			let r = await i_(e.key, n);
			if (r === "taken") return _("warning", X("storylines.nameTaken", { name: n }), X("app.name"));
			if (r === "invalid") return _("warning", X("storylines.invalidName"), X("app.name"));
			r !== "unchanged" && (!e.main && o.value.has(e.key) && (o.value = new Set([...o.value].map((t) => t === e.key ? n : t))), l());
		}
		return (e, t) => P(n) ? r.value ? (z(), B(R, { key: 2 }, [H("div", HM, [H("span", UM, j(P(X)("storylines.count", { n: a.value.length })), 1), U(LE, {
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
			(z(), V(Jr(e.main ? P(Zw) : e.if ? P(BT) : P(cT)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			H("span", GM, j(c(e)), 1),
			e.current ? (z(), B("span", {
				key: 0,
				class: "storyline-dot",
				title: P(X)("storylines.current"),
				"aria-label": P(X)("storylines.current")
			}, null, 8, KM)) : G("", !0),
			e.if ? (z(), B("span", qM, "if")) : G("", !0),
			e.hidden ? (z(), V(P(tT), {
				key: 2,
				class: "storyline-flag",
				"aria-label": P(X)("storylines.hidden")
			}, null, 8, ["aria-label"])) : G("", !0),
			H("span", JM, j(P(X)("storylines.floors", { n: e.floors.length })), 1),
			U(P(Fw), {
				class: A(["chevron", { flipped: o.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, WM), o.value.has(e.key) ? (z(), B("div", YM, [e.pending ? G("", !0) : (z(), B("div", {
			key: 0,
			class: A(["storyline-toolbar", { solo: e.main }]),
			role: "toolbar",
			"aria-label": c(e)
		}, [
			e.main ? G("", !0) : (z(), B(R, { key: 0 }, [
				U($, {
					icon: P(BT),
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
					icon: e.hidden ? P(tT) : P(nT),
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
				icon: P(TT),
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
				icon: P(Zw),
				label: P(X)("storylines.makeMain"),
				small: "",
				onClick: (t) => f(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]))
		], 10, XM)), e.floors.length ? (z(), B("ul", QM, [(z(!0), B(R, null, L(e.floors, (e) => (z(), B("li", {
			key: e.index,
			class: "row tight small clickable",
			title: P(X)("storylines.jump"),
			onClick: (t) => P(GC)(e.index)
		}, [
			H("span", eN, "#" + j(e.index), 1),
			H("span", tN, j(e.user ? P(X)("storylines.user") : P(X)("storylines.narrator")), 1),
			H("span", nN, j(e.title || "…"), 1)
		], 8, $M))), 128))])) : (z(), B("div", ZM, j(P(X)("storylines.empty")), 1))])) : G("", !0)], 2))), 128))], 64)) : (z(), B("div", VM, [U(P(cT), { "aria-hidden": "true" }), H("span", null, j(P(X)("memory.noChat")), 1)])) : (z(), V(SO, { key: 0 }));
	}
}), iN = ["aria-label"], aN = { class: "panel-head" }, oN = { class: "panel-logo" }, sN = { class: "grow" }, cN = { class: "panel-title ellipsis" }, lN = { class: "panel-sub ellipsis" }, uN = [
	"title",
	"aria-selected",
	"onClick"
], dN = { class: "panel-body scroll" }, fN = /* @__PURE__ */ I({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: CT,
				view: vO
			},
			{
				id: "config",
				icon: LT,
				view: ik
			},
			{
				id: "modules",
				icon: kw,
				view: fj
			},
			{
				id: "writing",
				icon: TT,
				view: xj
			},
			{
				id: "memory",
				icon: Aw,
				view: Vj
			},
			{
				id: "storylines",
				icon: cT,
				view: rN
			},
			{
				id: "debug",
				icon: jw,
				view: BM
			}
		], n = K(() => t.filter((e) => e.id !== "storylines" || RC.value)), r = K(() => n.value.find((e) => e.id === Z.tab) ?? n.value[0]), i = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), a = K(() => {
			let e = gx.value;
			return e ? `v${e.version} · ${_x.value.config}` : X("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && Z.panelOpen && (Z.panelOpen = !1);
		};
		return Ur(() => document.addEventListener("keydown", o)), Gr(() => {
			document.removeEventListener("keydown", o), hw(!1);
		}), dr(() => Z.panelOpen, (e) => {
			e && hw(!0);
		}, { immediate: !0 }), (e, t) => (z(), V(no, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => P(hw)(!1)
		}, {
			default: F(() => [P(Z).panelOpen ? (z(), B("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": P(X)("app.name")
			}, [
				H("header", aN, [
					H("div", oN, [U(P(pT))]),
					H("div", sN, [H("div", cN, j(P(gx) ? P(ip)(P(gx)) : P(X)("app.name")), 1), H("div", lN, j(a.value), 1)]),
					U(KD, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: P(X)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					U($, {
						icon: P(XT),
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
				}, [(z(), V(Jr(e.icon))), H("span", null, j(P(X)(`tab.${e.id}`)), 1)], 10, uN))), 128))], 2),
				H("main", dN, [(z(), V(Lr, null, [(z(), V(Jr(r.value.view), { key: r.value.id }))], 1024))])
			], 8, iN)) : G("", !0)]),
			_: 1
		}));
	}
}), pN = { class: "inline-drawer" }, mN = { class: "inline-drawer-toggle inline-drawer-header" }, hN = { class: "inline-drawer-content" }, gN = { class: "flex-container alignItemsCenter spaceBetween" }, _N = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, vN = { key: 0 }, yN = { class: "text_muted" }, bN = {
	key: 1,
	class: "text_muted"
}, xN = /* @__PURE__ */ I({
	__name: "SettingsDrawer",
	setup(e) {
		let t = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (z(), B("div", pN, [H("div", mN, [H("b", null, j(P(X)("app.name")), 1), n[3] ||= H("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), H("div", hN, [
			H("div", gN, [H("label", _N, [ir(H("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[ts, t.value]]), H("span", null, j(P(X)("settings.enable")), 1)]), H("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => P(xx)(),
				onKeydown: n[2] ||= fs((e) => P(xx)(), ["enter"])
			}, [n[4] ||= H("i", { class: "fa-solid fa-layer-group" }, null, -1), H("span", null, j(P(X)("panel.open")), 1)], 32)]),
			n[5] ||= H("hr", null, null, -1),
			H("h4", null, j(P(X)("settings.preset")), 1),
			P(gx) ? (z(), B("div", vN, [W(j(P(ip)(P(gx))) + " ", 1), H("span", yN, "v" + j(P(gx).version) + " · " + j(P(_x).config), 1)])) : (z(), B("i", bN, j(P(X)("settings.inactive")), 1))
		])]));
	}
}), SN = {
	key: 0,
	class: "preset-banner"
}, CN = { class: "preset-banner-text" }, wN = /* @__PURE__ */ I({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => P(gx) ? (z(), B("div", SN, [
			U(P(pT), { class: "preset-banner-icon" }),
			H("span", CN, j(P(X)("banner.usesAp")), 1),
			H("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => P(xx)()
			}, j(P(X)("panel.open")), 1)
		])) : G("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function TN() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), gs(xN).mount(t);
}
function EN() {
	iS("ap-stages", hE, ["mesid"]), iS("ap-cards", PD, ["mesid"]), iS("ap-top-cards", PD, ["mesid", "position"]), iS("ap-dock", zD), iS("ap-storyline", UD, ["mesid"]), iS("ap-panel", fN), iS("ap-preset-banner", wN), nS(), hx();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, hx);
	_w(), TN(), sw(), LC();
}
//#endregion
//#region src/index.ts
var DN = {
	version: "1.11.0",
	buildId: "e754142e1905d832",
	nextGeneration: (e) => zm(e),
	listPresets: () => Uf().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => Em(),
	update: Vy,
	togglePanel: (e) => {
		Z.panelOpen = e ?? !Z.panelOpen;
	},
	annotations: pb
};
globalThis.advancedPresetInterceptor = K_, window.AdvancedPreset = DN;
function ON(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function kN() {
	for (let { preset: e } of Uf()) try {
		await jm(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function AN() {
	let { eventSource: t, eventTypes: n } = e();
	q(), qy(), zb(), Ox(), fb(), await i(), await Vf();
	let r = fx();
	for (let { preset: e } of Uf()) {
		let t = hm(e);
		t.length && jh("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => E_(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Jy(e)), ib(), G_(), t.on(n.MESSAGE_RECEIVED, (e, t) => sb(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Xm.setPending(null), Xm.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Xm.sweep());
	let a = ON(() => {
		let e = Em(), t = e ? qf(e) : void 0;
		t && Lm(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, a), t.on(n.OAI_PRESET_CHANGED_AFTER, a), t.on(n.OAI_PRESET_CHANGED_AFTER, Px);
	let o = async () => {
		await Promise.race([Nb(), new Promise((e) => setTimeout(e, 3e3))]), await kN();
		for (let e of r) _("info", X("presets.backToBuiltin", { version: e.version }), ip(e));
		(async () => {
			await dx();
			for (let { preset: e } of Uf()) await Tb(e);
			await Nx(), await ux();
		})(), nb({ reload: !0 }), Bx(), Fy();
	};
	t.on(n.APP_READY, () => void o()), EN(), jh("init", {
		version: "1.11.0",
		build: "e754142e1905d832",
		enabled: q().enabled
	});
}
var jN = Iy, MN = NC;
AN().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { jN as advancedPresetOnUpdate, MN as advancedPresetRegisterChatSurface };

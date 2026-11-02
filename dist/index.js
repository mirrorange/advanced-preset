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
var y = {}, b = [], x = () => {}, ee = () => !1, S = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), C = (e) => e.startsWith("onUpdate:"), w = Object.assign, te = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ne = Object.prototype.hasOwnProperty, T = (e, t) => ne.call(e, t), E = Array.isArray, re = (e) => ue(e) === "[object Map]", ie = (e) => ue(e) === "[object Set]", ae = (e) => ue(e) === "[object Date]", oe = (e) => ue(e) === "[object RegExp]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", se = (e) => typeof e == "symbol", k = (e) => typeof e == "object" && !!e, ce = (e) => (k(e) || D(e)) && D(e.then) && D(e.catch), le = Object.prototype.toString, ue = (e) => le.call(e), de = (e) => ue(e).slice(8, -1), fe = (e) => ue(e) === "[object Object]", pe = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, me = /* @__PURE__ */ v(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), he = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ge = /-\w/g, _e = he((e) => e.replace(ge, (e) => e.slice(1).toUpperCase())), ve = /\B([A-Z])/g, ye = he((e) => e.replace(ve, "-$1").toLowerCase()), be = he((e) => e.charAt(0).toUpperCase() + e.slice(1)), xe = he((e) => e ? `on${be(e)}` : ""), Se = (e, t) => !Object.is(e, t), Ce = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, we = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Te = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Ee = (e) => {
	let t = O(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, De, Oe = () => De ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ke(e) {
	if (E(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = O(r) ? Ne(r) : ke(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (O(e) || k(e)) return e;
}
var Ae = /;(?![^(]*\))/g, je = /:([^]+)/, Me = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Ne(e) {
	let t = {};
	return e.replace(Me, (e) => e.startsWith("/*") ? "" : e).split(Ae).forEach((e) => {
		if (e) {
			let n = e.split(je);
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
var Pe = /* @__PURE__ */ v("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Fe(e) {
	return !!e || e === "";
}
function Ie(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Be(e[i], t[i], n);
	return r;
}
function Le(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Be(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Re(e, t, n) {
	let r = re(e), i = re(t);
	if (r || i || (r = ie(e), i = ie(t), r || i)) return r && i ? Le(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Be(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ze(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Be(e, t, n) {
	if (e === t) return !0;
	let r = ae(e), i = ae(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = se(e), i = se(t), r || i ? e === t : (r = E(e), i = E(t), r || i ? r && i ? ze(e, t, n, Ie) : !1 : (r = k(e), i = k(t), r || i ? !r || !i ? !1 : ze(e, t, n, Re) : String(e) === String(t))));
}
function Ve(e, t) {
	return e.findIndex((e) => Be(e, t));
}
var He = (e) => !!(e && e.__v_isRef === !0), j = (e) => O(e) ? e : e == null ? "" : E(e) || k(e) && (e.toString === le || !D(e.toString)) ? He(e) ? j(e.value) : JSON.stringify(e, Ue, 2) : String(e), Ue = (e, t) => He(t) ? Ue(e, t.value) : re(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[We(t, r) + " =>"] = n, e), {}) } : ie(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => We(e)) } : se(t) ? We(t) : k(t) && !E(t) && !fe(t) ? String(t) : t, We = (e, t = "") => se(e) ? `Symbol(${e.description ?? t})` : e, Ge, Ke = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ge && (Ge.active ? (this.parent = Ge, this.index = (Ge.scopes || (Ge.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ge;
			try {
				return Ge = this, e();
			} finally {
				Ge = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ge, Ge = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ge === this) Ge = this.prevScope;
			else {
				let e = Ge;
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
function qe() {
	return Ge;
}
var Je, Ye = /* @__PURE__ */ new WeakSet(), Xe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ge && (Ge.active ? Ge.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ye.has(this) && (Ye.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || et(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, pt(this), rt(this);
		let e = Je, t = lt;
		Je = this, lt = !0;
		try {
			return this.fn();
		} finally {
			it(this), Je = e, lt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) st(e);
			this.deps = this.depsTail = void 0, pt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ye.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		at(this) && this.run();
	}
	get dirty() {
		return at(this);
	}
}, Ze = 0, Qe, $e;
function et(e, t = !1) {
	e.flags |= 8, t ? (e.next = $e, $e = e) : (e.next = Qe, Qe = e);
}
function tt() {
	Ze++;
}
function nt() {
	if (--Ze > 0) return;
	if ($e) {
		let e = $e;
		for ($e = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Qe;) {
		let t = Qe;
		for (Qe = void 0; t;) {
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
function rt(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function it(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), st(r), ct(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function at(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ot(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ot(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === mt) || (e.globalVersion = mt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !at(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = Je, r = lt;
	Je = e, lt = !0;
	try {
		rt(e);
		let n = e.fn(e._value);
		(t.version === 0 || Se(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Je = n, lt = r, it(e), e.flags &= -3;
	}
}
function st(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) st(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ct(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var lt = !0, ut = [];
function dt() {
	ut.push(lt), lt = !1;
}
function ft() {
	let e = ut.pop();
	lt = e === void 0 || e;
}
function pt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = Je;
		Je = void 0;
		try {
			t();
		} finally {
			Je = e;
		}
	}
}
var mt = 0, ht = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, gt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!Je || !lt || Je === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Je) t = this.activeLink = new ht(Je, this), Je.deps ? (t.prevDep = Je.depsTail, Je.depsTail.nextDep = t, Je.depsTail = t) : Je.deps = Je.depsTail = t, _t(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Je.depsTail, t.nextDep = void 0, Je.depsTail.nextDep = t, Je.depsTail = t, Je.deps === t && (Je.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, mt++, this.notify(e);
	}
	notify(e) {
		tt();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			nt();
		}
	}
};
function _t(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) _t(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var vt = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ Symbol(""), bt = /* @__PURE__ */ Symbol(""), xt = /* @__PURE__ */ Symbol("");
function St(e, t, n) {
	if (lt && Je) {
		let t = vt.get(e);
		t || vt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new gt()), r.map = t, r.key = n), r.track();
	}
}
function Ct(e, t, n, r, i, a) {
	let o = vt.get(e);
	if (!o) {
		mt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (tt(), t === "clear") o.forEach(s);
	else {
		let i = E(e), a = i && pe(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === xt || !se(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(xt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(yt)), re(e) && s(o.get(bt)));
				break;
			case "delete":
				i || (s(o.get(yt)), re(e) && s(o.get(bt)));
				break;
			case "set": re(e) && s(o.get(yt));
		}
	}
	nt();
}
function wt(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e || (St(t, "iterate", xt), /* @__PURE__ */ dn(e)) ? t : /* @__PURE__ */ un(e) ? /* @__PURE__ */ ln(e) ? t.map((e) => hn(mn(e))) : t.map(hn) : t.map(mn);
}
function Tt(e) {
	return St(e = /* @__PURE__ */ M(e), "iterate", xt), e;
}
function Et(e, t) {
	return /* @__PURE__ */ un(e) ? hn(/* @__PURE__ */ ln(e) ? mn(t) : t) : mn(t);
}
var Dt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ot(this, Symbol.iterator, (e) => Et(this, e));
	},
	concat(...e) {
		return wt(this).concat(...e.map((e) => E(e) ? wt(e) : e));
	},
	entries() {
		return Ot(this, "entries", (e) => (e[1] = Et(this, e[1]), e));
	},
	every(e, t) {
		return jt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return jt(this, "filter", e, t, (e) => e.map((e) => Et(this, e)), arguments);
	},
	find(e, t) {
		return jt(this, "find", e, t, (e) => Et(this, e), arguments);
	},
	findIndex(e, t) {
		return jt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return jt(this, "findLast", e, t, (e) => Et(this, e), arguments);
	},
	findLastIndex(e, t) {
		return jt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return jt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Nt(this, "includes", e);
	},
	indexOf(...e) {
		return Nt(this, "indexOf", e);
	},
	join(e) {
		return wt(this).join(e);
	},
	lastIndexOf(...e) {
		return Nt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return jt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Pt(this, "pop");
	},
	push(...e) {
		return Pt(this, "push", e);
	},
	reduce(e, ...t) {
		return Mt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Mt(this, "reduceRight", e, t);
	},
	shift() {
		return Pt(this, "shift");
	},
	some(e, t) {
		return jt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Pt(this, "splice", e);
	},
	toReversed() {
		return wt(this).toReversed();
	},
	toSorted(e) {
		return wt(this).toSorted(e);
	},
	toSpliced(...e) {
		return wt(this).toSpliced(...e);
	},
	unshift(...e) {
		return Pt(this, "unshift", e);
	},
	values() {
		return Ot(this, "values", (e) => Et(this, e));
	}
};
function Ot(e, t, n) {
	let r = Tt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ dn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => kt(a.next(), n), i !== At[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => kt(a._next(), n);
	}
	return a;
}
function kt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var At = Array.prototype;
function jt(e, t, n, r, i, a) {
	let o = Tt(e), s = o !== e && !/* @__PURE__ */ dn(e), c = o[t];
	if (c !== At[t]) {
		let t = c.apply(e, a);
		return s ? mn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Et(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Mt(e, t, n, r) {
	let i = Tt(e), a = i !== e && !/* @__PURE__ */ dn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Et(e, t)), n.call(this, t, Et(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Et(e, c) : c;
}
function Nt(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	St(r, "iterate", xt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ fn(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function Pt(e, t, n = []) {
	dt(), tt();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return nt(), ft(), r;
}
var Ft = /* @__PURE__ */ v("__proto__,__v_isRef,__isVue"), It = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(se));
function Lt(e) {
	se(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return St(t, "has", e), t.hasOwnProperty(e);
}
var Rt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? nn : tn : i ? en : $t).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = E(e);
		if (!r) {
			let e;
			if (a && (e = Dt[t])) return e;
			if (t === "hasOwnProperty") return Lt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ gn(e) ? e : n);
		if ((se(t) ? It.has(t) : Ft(t)) || (r || St(e, "get", t), i)) return o;
		if (/* @__PURE__ */ gn(o)) {
			let e = a && pe(t) ? o : o.value;
			return r && k(e) ? /* @__PURE__ */ sn(e) : e;
		}
		return k(o) ? r ? /* @__PURE__ */ sn(o) : /* @__PURE__ */ an(o) : o;
	}
}, zt = class extends Rt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = E(e) && pe(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ un(i);
			if (!/* @__PURE__ */ dn(n) && !/* @__PURE__ */ un(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ gn(i) && !/* @__PURE__ */ gn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : T(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ gn(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? Se(n, i) && Ct(e, "set", t, n, i) : Ct(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = T(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ct(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!se(t) || !It.has(t)) && St(e, "has", t), n;
	}
	ownKeys(e) {
		return St(e, "iterate", E(e) ? "length" : yt), Reflect.ownKeys(e);
	}
}, Bt = class extends Rt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Vt = /* @__PURE__ */ new zt(), Ht = /* @__PURE__ */ new Bt(), Ut = /* @__PURE__ */ new zt(!0), Wt = (e) => e, Gt = (e) => Reflect.getPrototypeOf(e);
function Kt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = re(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Wt : t ? hn : mn;
		return !t && St(a, "iterate", c ? bt : yt), w(Object.create(l), { next() {
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
function qt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Jt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (Se(n, a) && St(i, "get", n), St(i, "get", a));
			let { has: o } = Gt(i), s = t ? Wt : e ? hn : mn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && St(/* @__PURE__ */ M(t), "iterate", yt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (Se(t, i) && St(r, "has", t), St(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? Wt : e ? hn : mn;
			return !e && St(o, "iterate", yt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return w(n, e ? {
		add: qt("add"),
		set: qt("set"),
		delete: qt("delete"),
		clear: qt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = Gt(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ dn(e) && !/* @__PURE__ */ un(e) ? i : e;
			return r.has.call(n, a) || Se(e, a) && r.has.call(n, e) || Se(i, a) && r.has.call(n, i) || (n.add(a), Ct(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ dn(n) && !/* @__PURE__ */ un(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = Gt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Se(n, s) && Ct(r, "set", e, n, s) : Ct(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = Gt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ct(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && Ct(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Kt(r, e, t);
	}), n;
}
function Yt(e, t) {
	let n = Jt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(T(n, i) && i in r ? n : r, i, a);
}
var Xt = { get: /* @__PURE__ */ Yt(!1, !1) }, Zt = { get: /* @__PURE__ */ Yt(!1, !0) }, Qt = { get: /* @__PURE__ */ Yt(!0, !1) }, $t = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new WeakMap(), tn = /* @__PURE__ */ new WeakMap(), nn = /* @__PURE__ */ new WeakMap();
function rn(e) {
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
function an(e) {
	return /* @__PURE__ */ un(e) ? e : cn(e, !1, Vt, Xt, $t);
}
// @__NO_SIDE_EFFECTS__
function on(e) {
	return cn(e, !1, Ut, Zt, en);
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
	return cn(e, !0, Ht, Qt, tn);
}
function cn(e, t, n, r, i) {
	if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = rn(de(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function ln(e) {
	return /* @__PURE__ */ un(e) ? /* @__PURE__ */ ln(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function un(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function pn(e) {
	return !T(e, "__v_skip") && Object.isExtensible(e) && we(e, "__v_skip", !0), e;
}
var mn = (e) => k(e) ? /* @__PURE__ */ an(e) : e, hn = (e) => k(e) ? /* @__PURE__ */ sn(e) : e;
// @__NO_SIDE_EFFECTS__
function gn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return _n(e, !1);
}
function _n(e, t) {
	return /* @__PURE__ */ gn(e) ? e : new vn(e, t);
}
var vn = class {
	constructor(e, t) {
		this.dep = new gt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : mn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ dn(e) || /* @__PURE__ */ un(e);
		e = n ? e : /* @__PURE__ */ M(e), Se(e, t) && (this._rawValue = e, this._value = n ? e : mn(e), this.dep.trigger());
	}
};
function P(e) {
	return /* @__PURE__ */ gn(e) ? e.value : e;
}
var yn = {
	get: (e, t, n) => t === "__v_raw" ? e : P(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ gn(i) && !/* @__PURE__ */ gn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function bn(e) {
	return /* @__PURE__ */ ln(e) ? e : new Proxy(e, yn);
}
var xn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new gt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function Sn(e) {
	return new xn(e);
}
var Cn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new gt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = mt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Je !== this) return et(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ot(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function wn(e, t, n = !1) {
	let r, i;
	return D(e) ? r = e : (r = e.get, i = e.set), new Cn(r, i, n);
}
var Tn = {}, En = /* @__PURE__ */ new WeakMap(), Dn = void 0;
function On(e, t = !1, n = Dn) {
	if (n) {
		let t = En.get(n);
		t || En.set(n, t = []), t.push(e);
	}
}
function kn(e, t, n = y) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ dn(e) || i === !1 || i === 0 ? An(e, 1) : An(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ gn(e) ? (d = () => e.value, m = /* @__PURE__ */ dn(e)) : /* @__PURE__ */ ln(e) ? (d = () => l(e), m = !0) : E(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ ln(e) || /* @__PURE__ */ dn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ gn(e)) return e.value;
		if (/* @__PURE__ */ ln(e)) return l(e);
		if (D(e)) return c ? c(e, 2) : e();
	})) : d = D(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			dt();
			try {
				f();
			} finally {
				ft();
			}
		}
		let t = Dn;
		Dn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Dn = t;
		}
	} : x, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => An(e(), t);
	}
	let g = qe(), _ = () => {
		u.stop(), g && g.active && te(g.effects, u);
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
	let v = h ? Array(e.length).fill(Tn) : Tn, b = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => Se(e, v[t])) : Se(n, v))) {
					let e = Dn;
					dt();
					try {
						f && f(), Dn = u;
						let e = [
							n,
							v === Tn ? void 0 : h && v[0] === Tn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Dn = e, ft();
					}
				}
			} else u.run();
		}
	};
	return s && s(b), u = new Xe(d), u.scheduler = o ? () => o(b, !1) : b, p = (e) => On(e, !1, u), f = u.onStop = () => {
		let e = En.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			En.delete(u);
		}
	}, t ? r ? b(!0) : v = u.run() : o ? o(b.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function An(e, t = Infinity, n) {
	if (t <= 0 || !k(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ gn(e)) An(e.value, t, n);
	else if (E(e)) for (let r = 0; r < e.length; r++) An(e[r], t, n);
	else if (ie(e) || re(e)) e.forEach((e) => {
		An(e, t, n);
	});
	else if (fe(e)) {
		for (let r in e) An(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && An(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function jn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Nn(e, t, n);
	}
}
function Mn(e, t, n, r) {
	if (D(e)) {
		let i = jn(e, t, n, r);
		return i && ce(i) && i.catch((e) => {
			Nn(e, t, n);
		}), i;
	}
	if (E(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Mn(e[a], t, n, r));
		return i;
	}
}
function Nn(e, t, n, r = !0) {
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
			dt(), jn(a, null, 10, [
				e,
				i,
				o
			]), ft();
			return;
		}
	}
	Pn(e, n, i, r, o);
}
function Pn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Fn = [], In = -1, Ln = [], Rn = null, zn = 0, Bn = /* @__PURE__ */ Promise.resolve(), Vn = null;
function Hn(e) {
	let t = Vn || Bn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Un(e) {
	let t = In + 1, n = Fn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Fn[r], a = Zn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Wn(e) {
	if (!(e.flags & 1)) {
		let t = Zn(e), n = Fn[Fn.length - 1];
		!n || !(e.flags & 2) && t >= Zn(n) ? Fn.push(e) : Fn.splice(Un(t), 0, e), e.flags |= 1, Gn();
	}
}
function Gn() {
	Vn ||= Bn.then(Qn);
}
function Kn(e) {
	if (!E(e)) Rn && e.id === -1 ? Rn.splice(zn + 1, 0, e) : e.flags & 1 || (Ln.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Ln.push(e[t]);
	Gn();
}
function qn(e, t, n, r = In + 1) {
	for (; r < Fn.length; r++) {
		let n = Fn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Fn.splice(r, 1), r = e ? r - 1 : In, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Jn(e, t, n = 0) {
	if (Ln.length) {
		let e = Ln, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Ln.length; i++) {
				let a = Ln[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Ln[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Zn(e) - Zn(t));
		if (Ln.length = r, Rn) {
			for (let e = 0; e < i.length; e++) Rn.push(i[e]);
			return;
		}
		for (Rn = i, zn = 0; zn < Rn.length; zn++) {
			let e = Rn[zn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Rn = null, zn = 0;
	}
}
var Yn = !1;
function Xn(e, t) {
	if (Yn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Ln);
	e(), Yn = !0;
	try {
		qn(void 0, t), Jn(void 0, n, t);
	} finally {
		Yn = !1;
	}
}
var Zn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Qn(e) {
	try {
		for (In = 0; In < Fn.length; In++) {
			let e = Fn[In];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), jn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; In < Fn.length; In++) {
			let e = Fn[In];
			e && (e.flags &= -2);
		}
		In = -1, Fn.length = 0, Jn(e), Vn = null, (Fn.length || Ln.length) && Qn(e);
	}
}
var $n = null, er = null;
function tr(e) {
	let t = $n;
	return $n = e, er = e && e.type.__scopeId || null, t;
}
function F(e, t = $n, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ra(-1);
		let i = tr(t), a = $i.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = $i.length; e > a; e--) ta();
			tr(i), r._d && ra(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function I(e, t) {
	if ($n === null) return e;
	let n = Fa($n), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = y] = t[e];
		i && (D(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && An(a), r.push({
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
function nr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (dt(), Mn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), ft());
	}
}
function rr(e, t, n = !1) {
	let r = Sa();
	if (r || oi) {
		let i = oi ? oi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
var ir = /* @__PURE__ */ Symbol.for("v-scx"), ar = () => rr(ir);
function or(e, t) {
	return lr(e, null, t);
}
function sr(e, t) {
	return lr(e, null, { flush: "sync" });
}
function cr(e, t, n) {
	return lr(e, t, n);
}
function lr(e, t, n = y) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = w({}, n), c = t && r || !t && a !== "post", l;
	if (Oa) {
		if (a === "sync") {
			let e = ar();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = x, e.resume = x, e.pause = x, e;
		}
	}
	let u = xa;
	s.call = (e, t, n) => Mn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Li(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Wn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = kn(e, t, s);
	return Oa && (l ? l.push(f) : c && f()), f;
}
var ur = /* @__PURE__ */ Symbol("_vte"), dr = (e) => e.__isTeleport, fr = /* @__PURE__ */ Symbol("_leaveCb"), pr = /* @__PURE__ */ Symbol("_enterCb");
function mr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Br(() => {
		e.isMounted = !0;
	}), Hr(() => {
		e.isUnmounting = !0;
	}), e;
}
var hr = [Function, Array], gr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: hr,
	onEnter: hr,
	onAfterEnter: hr,
	onEnterCancelled: hr,
	onBeforeLeave: hr,
	onLeave: hr,
	onAfterLeave: hr,
	onLeaveCancelled: hr,
	onBeforeAppear: hr,
	onAppear: hr,
	onAfterAppear: hr,
	onAppearCancelled: hr
}, _r = {
	name: "BaseTransition",
	props: gr,
	setup(e, { slots: t }) {
		let n = Sa(), r = mr();
		return () => {
			let i = t.default && Tr(t.default(), !0), a = i && i.length ? vr(i) : n.subTree ? K() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ M(e), { mode: s } = o;
			if (r.isLeaving) return Sr(a);
			let c = Cr(a);
			if (!c) return Sr(a);
			let l = xr(c, o, r, n, (e) => l = e);
			c.type !== Zi && wr(c, l);
			let u = n.subTree && Cr(n.subTree);
			if (u && u.type !== Zi && !oa(u, c) && Er(n.subTree)) {
				let e = xr(u, o, r, n);
				if (wr(u, e), s === "out-in" && c.type !== Zi) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, Sr(a);
				s === "in-out" && c.type !== Zi ? e.delayLeave = (e, t, n) => {
					let i = br(r, u);
					i[String(u.key)] = u, e[fr] = () => {
						t(), e[fr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function vr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Zi) {
			t = n;
			break;
		}
	}
	return t;
}
var yr = _r;
function br(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function xr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = br(n, e), ee = (e, t) => {
		e && Mn(e, r, 9, t);
	}, S = (e, t) => {
		let n = t[1];
		ee(e, t), E(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, C = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[fr] && t[fr](!0);
			let i = x[b];
			if (i && oa(e, i)) {
				let e = i.el[fr];
				if (!e) {
					let t = Er(i);
					e = t && t.el[fr];
				}
				e && e();
			}
			ee(r, [t]);
		},
		enter(t) {
			if (x[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) {
				if (a) r = _ || l, i = v || u, o = y || d;
				else return;
			}
			let s = !1;
			t[pr] = (e) => {
				s || (s = !0, ee(e ? o : i, [t]), C.delayedLeave && C.delayedLeave(), t[pr] = void 0);
			};
			let c = t[pr].bind(null, !1);
			r ? S(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[pr] && t[pr](!0), n.isUnmounting) return r();
			ee(f, [t]);
			let a = !1;
			t[fr] = (n) => {
				a || (a = !0, r(), ee(n ? h : m, [t]), t[fr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[fr].bind(null, !1);
			x[i] = e, p ? S(p, [t, o]) : o();
		},
		clone(e) {
			let a = xr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return C;
}
function Sr(e) {
	if (Nr(e)) return e = da(e), e.children = null, e;
}
function Cr(e) {
	if (!Nr(e)) return dr(e.type) && e.children ? vr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && D(n.default)) return n.default();
	}
}
function wr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		wr(dr(n.type) && Cr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === z && E(e.children)) {
		let n = pi(e.children, !1);
		n && wr(n, t);
	}
}
function Tr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === z ? (o.patchFlag & 128 && i++, r = r.concat(Tr(o.children, t, s))) : (t || o.type !== Zi) && r.push(s == null ? o : da(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Er(e) {
	if (e.component) return Er(e.component.subTree);
	if (e.type === z) {
		let t = E(e.children) && pi(e.children, !1);
		return t ? Er(t) : void 0;
	}
	if (e.type !== Zi) return e;
}
// @__NO_SIDE_EFFECTS__
function L(e, t) {
	return D(e) ? /* @__PURE__ */ w({ name: e.name }, t, { setup: e }) : e;
}
function Dr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Or(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var kr = /* @__PURE__ */ new WeakMap();
function Ar(e, t, n, r, i = !1) {
	if (E(e)) {
		e.forEach((e, a) => Ar(e, t && (E(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Mr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Ar(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Fa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === y ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ M(d), p = d === y ? ee : (e) => !Or(u, e) && T(f, e), m = (e, t) => !(t && Or(u, t));
	if (l != null && l !== c) {
		if (jr(t), O(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ gn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (D(c)) jn(c, s, 12, [o, u]);
	else {
		let t = O(c), r = /* @__PURE__ */ gn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) E(n) && te(n, a);
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
					s(), kr.delete(e);
				};
				t.id = -1, kr.set(e, t), Li(t, n);
			} else jr(e), s();
		}
	}
}
function jr(e) {
	let t = kr.get(e);
	t && (t.flags |= 8, kr.delete(e));
}
Oe().requestIdleCallback, Oe().cancelIdleCallback;
var Mr = (e) => !!e.type.__asyncLoader, Nr = (e) => e.type.__isKeepAlive, Pr = {
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
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Li(() => {
				a.isDeactivated = !1, a.a && Ce(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && ga(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Ki(t.m), Ki(t.a), l(e, f, null, 1, s), Li(() => {
				t.da && Ce(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && ga(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Ir(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ia(Mr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !oa(t, o)) ? p(t) : o && (Ir(o), t && Ir(t)), i.delete(e), a.delete(e);
		}
		cr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Fr(e, t)), t && m((e) => !Fr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Ji(n.subTree.type) ? Li(() => {
				let e = Lr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Lr(n.subTree)));
		};
		return Br(_), Vr(_), Hr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Lr(t);
				if (e.type === i.type && e.key === i.key) {
					Ir(i);
					let e = i.component.da;
					e && Li(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!aa(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Lr(r);
			if (s.type === Zi) return o = null, s;
			let c = s.type, l = Ia(Mr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Fr(u, l)) || d && l && Fr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = da(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && wr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Ji(r.type) ? r : s;
		};
	}
};
function Fr(e, t) {
	return E(e) ? e.some((e) => Fr(e, t)) : O(e) ? e.split(",").includes(t) : oe(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Ir(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Lr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Rr(e, t, n = xa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			dt();
			let i = Ta(n), a = Mn(t, n, e, r);
			return i(), ft(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var zr = (e) => (t, n = xa) => {
	(!Oa || e === "sp") && Rr(e, (...e) => t(...e), n);
}, Br = zr("m"), Vr = zr("u"), Hr = zr("bum"), Ur = "components", Wr = /* @__PURE__ */ Symbol.for("v-ndc");
function Gr(e) {
	return O(e) ? Kr(Ur, e, !1) || e : e || Wr;
}
function Kr(e, t, n = !0, r = !1) {
	let i = $n || xa;
	if (i) {
		let n = i.type;
		if (e === Ur) {
			let e = Ia(n, !1);
			if (e && (e === t || e === _e(t) || e === be(_e(t)))) return n;
		}
		let a = qr(i[e] || n[e], t) || qr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function qr(e, t) {
	return e && (e[t] || e[_e(t)] || e[be(_e(t))]);
}
function R(e, t, n, r) {
	let i, a = n && n[r], o = E(e);
	if (o || O(e)) {
		let n = o && /* @__PURE__ */ ln(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ dn(e), s = /* @__PURE__ */ un(e), e = Tt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? hn(mn(e[n])) : mn(e[n]) : e[n], n, void 0, a && a[n]);
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
function Jr(e, t) {
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
function Yr(e, t, n, r, i, a) {
	if (n ??= {}, $n.ce || $n.parent && Mr($n.parent) && $n.parent.ce) {
		let e = a != null && n.key == null ? w({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), B(), H(z, null, [W("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = $i.length;
	B();
	let c;
	try {
		let i = o && Xr(o(n)), s = n.key || a || i && i.key;
		c = H(z, { key: (s && !se(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = $i.length; e > s; e--) ta();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Xr(e) {
	return e.some((e) => !aa(e) || !(e.type === Zi || e.type === z && !Xr(e.children))) ? e : null;
}
var Zr = (e) => e ? Da(e) ? Fa(e) : Zr(e.parent) : null, Qr = /* @__PURE__ */ w(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Zr(e.parent),
	$root: (e) => Zr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Wn(e.update);
	},
	$nextTick: (e) => e.n ||= Hn.bind(e.proxy),
	$watch: (e) => x
}), $r = (e, t) => e !== y && !e.__isScriptSetup && T(e, t), ei = {
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
			else if ($r(r, t)) return o[t] = 1, r[t];
			else if (T(a, t)) return o[t] = 3, a[t];
			else if (n !== y && T(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = Qr[t], u, d;
		if (l) return t === "$attrs" && St(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== y && T(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, T(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return $r(i, t) ? (i[t] = n, !0) : T(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || $r(t, s) || T(a, s) || T(r, s) || T(Qr, s) || T(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? T(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ti(e) {
	return E(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ni(e, t) {
	return !e || !t ? e || t : E(e) && E(t) ? e.concat(t) : w({}, ti(e), ti(t));
}
function ri() {
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
var ii = 0;
function ai(e, t) {
	return function(n, r = null) {
		D(n) || (n = w({}, n)), r != null && !k(r) && (r = null);
		let i = ri(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ii++,
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Fa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Mn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = oi;
				oi = c;
				try {
					return e();
				} finally {
					oi = t;
				}
			}
		};
		return c;
	};
}
var oi = null;
function si(e, t, n = y) {
	let r = Sa(), i = _e(t), a = ye(t), o = ci(e, i), s = Sn((o, s) => {
		let c, l = y, u;
		return sr(() => {
			let t = e[i];
			Se(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!Se(o, c) && !(l !== y && Se(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), Se(e, l) && (Se(e, o) && !Se(o, u) || f && l !== y && !Se(o, c)) && s(), l = e, u = o;
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
var ci = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${_e(t)}Modifiers`] || e[`${ye(t)}Modifiers`];
function li(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || y, i = n, a = t.startsWith("update:"), o = a && ci(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => O(e) ? e.trim() : e)), o.number && (i = i.map(Te)));
	let s, c = r[s = xe(t)] || r[s = xe(_e(t))];
	!c && a && (c = r[s = xe(ye(t))]), c && Mn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Mn(l, e, 6, i);
	}
}
function ui(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (E(a) ? a.forEach((e) => o[e] = null) : w(o, a), k(e) && r.set(e, o), o) : (k(e) && r.set(e, null), null);
}
function di(e, t) {
	return !e || !S(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), T(e, t[0].toLowerCase() + t.slice(1)) || T(e, ye(t)) || T(e, t));
}
function fi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = tr(e), _, v;
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
			}) : e(d, null)), v = t.props ? s : mi(s);
		}
	} catch (t) {
		$i.length = 0, Nn(t, e, 1), _ = W(Zi);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(C) && (v = hi(v, a)), y = da(y, v, !1, !0));
	}
	return n.dirs && (y = da(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && wr(dr(y.type) && Cr(y) || y, n.transition), _ = y, tr(g), _;
}
function pi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (aa(r)) {
			if (r.type !== Zi || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var mi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || S(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, hi = (e, t) => {
	let n = {};
	for (let r in e) (!C(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function gi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? _i(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (vi(o, r, n) && !di(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || _i(r, o, l) : !!o;
	return !1;
}
function _i(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!T(e, a) || vi(t, e, a) && !di(n, a)) return !0;
	}
	return !1;
}
function vi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && k(r) && k(i) ? !Be(r, i) : r !== i;
}
function yi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var bi = {}, xi = () => Object.create(bi), Si = (e) => Object.getPrototypeOf(e) === bi;
function Ci(e, t, n, r = !1) {
	let i = {}, a = xi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ti(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ on(i) : e.type.props ? i : a, e.attrs = a;
}
function wi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (di(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (T(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = _e(o);
						i[t] = Ei(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ti(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !T(t, a) && ((r = ye(a)) === a || !T(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Ei(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !T(t, e)) && (delete a[e], l = !0);
	}
	l && Ct(e.attrs, "set", "");
}
function Ti(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (me(c)) continue;
		let l = t[c], u;
		i && T(i, u = _e(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : di(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ M(n), r = s || y;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Ei(i, t, s, r[s], e, !T(r, s));
		}
	}
	return o;
}
function Ei(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = T(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && D(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ta(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ye(n)) && (r = !0));
	}
	return r;
}
function Di(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return k(e) && r.set(e, b), b;
	if (E(a)) for (let e = 0; e < a.length; e++) {
		let t = _e(a[e]);
		Oi(t) && (o[t] = y);
	}
	else if (a) for (let e in a) {
		let t = _e(e);
		if (Oi(t)) {
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
	return k(e) && r.set(e, c), c;
}
function Oi(e) {
	return e[0] !== "$" && !me(e);
}
var ki = (e) => e === "_" || e === "_ctx" || e === "$stable", Ai = (e) => E(e) ? e.map(fa) : [fa(e)], ji = (e, t, n) => {
	if (t._n) return t;
	let r = F((...e) => Ai(t(...e)), n);
	return r._c = !1, r;
}, Mi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ki(n)) continue;
		let i = e[n];
		if (D(i)) t[n] = ji(n, i, r);
		else if (i != null) {
			let e = Ai(i);
			t[n] = () => e;
		}
	}
}, Ni = (e, t) => {
	let n = Ai(t);
	e.slots.default = () => n;
}, Pi = (e, t, n) => {
	for (let r in t) (n || !ki(r)) && (e[r] = t[r]);
}, Fi = (e, t, n) => {
	let r = e.slots = xi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Pi(r, t, n), n && we(r, "_", e, !0)) : Mi(t, r);
	} else t && Ni(e, t);
}, Ii = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = y;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Pi(i, t, n) : (a = !t.$stable, Mi(t, i)), o = t;
	} else t && (Ni(e, t), o = { default: 1 });
	if (a) for (let e in i) !ki(e) && o[e] == null && delete i[e];
}, Li = Yi;
function Ri(e) {
	return zi(e);
}
function zi(e, t) {
	let n = Oe();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = x, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !oa(e, t) && (r = _e(e), de(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === b && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Xi:
				g(e, t, n, r);
				break;
			case Zi:
				_(e, t, n, r);
				break;
			case Qi:
				e ?? v(t, n, r, o);
				break;
			case z:
				ie(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? C(e, t, n, r, i, a, o, s, c) : d & 6 ? ae(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ye);
		}
		u != null && i ? Ar(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Ar(e.ref, null, a, e, !0);
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
	}, ee = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, S = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, C = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) w(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), T(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, w = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && ne(e.children, f, null, i, s, Bi(e, c), l, d), _ && nr(e, null, i, "created"), te(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !me(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && ga(p, i, e);
		}
		_ && nr(e, null, i, "beforeMount");
		let v = Hi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Li(() => {
			try {
				p && ga(p, i, e), v && g.enter(f), _ && nr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, te = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Ji(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, ne = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? pa(e[l]) : fa(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, T = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || y, m = t.props || y, h;
		if (n && Vi(n, !1), (h = m.onVnodeBeforeUpdate) && ga(h, n, t, e), f && nr(t, e, n, "beforeUpdate"), n && Vi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? E(e.dynamicChildren, d, c, n, r, Bi(t, i), o) : s || k(e, t, c, null, n, r, Bi(t, i), o, !1), l > 0) {
			if (l & 16) re(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && re(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Li(() => {
			h && ga(h, n, t, e), f && nr(t, e, n, "updated");
		}, r);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || qi(c), f = u && (c.type === z || !oa(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, re = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== y) for (let o in t) !me(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (me(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ie = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), ne(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Ui(e, t, !0)) : k(e, t, n, f, a, o, c, l, u);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : D(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = ba(e, r, i);
		if (Nr(e) && (s.ctx.renderer = ye), ka(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, O, o, a), !e.el) {
				let r = s.subTree = W(Zi);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else O(s, e, t, n, i, a, o);
	}, D = (e, t, n) => {
		let r = t.component = e.component;
		if (gi(e, t, n)) {
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
					let n = Gi(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							Li(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Vi(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && Ce(n), (f = t.props && t.props.onVnodeBeforeUpdate) && ga(f, s, t, c), Vi(e, !0);
				let p = fi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), _e(m), e, i, a), t.el = p.el, u === null && yi(e, p.el), r && Li(r, i), (f = t.props && t.props.onVnodeUpdated) && Li(() => ga(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Mr(t);
				if (Vi(e, !1), l && Ce(l), !m && (o = c && c.onVnodeBeforeMount) && ga(o, d, t), Vi(e, !0), s && xe) {
					let t = () => {
						e.subTree = fi(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = fi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Li(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Li(() => ga(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Mr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Li(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Xe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Wn(u), Vi(e, !0), l();
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, wi(e, t.props, r, n), Ii(e, t.children, n), dt(), qn(e), ft();
	}, k = (e, t, n, r, i, a, o, s, c = !1) => {
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
		m & 8 ? (d & 16 && ge(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? le(l, f, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && ne(f, n, r, i, a, o, s, c));
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		e ||= b, t ||= b;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? pa(t[f]) : fa(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? ge(e, i, a, !0, !1, d) : ne(t, n, r, i, a, o, s, c, d);
	}, le = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? pa(t[l]) : fa(t[l]);
			if (oa(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? pa(t[f]) : fa(t[f]);
			if (oa(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? pa(t[l]) : fa(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) de(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? pa(t[l]) : fa(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, x = !1, ee = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					de(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && oa(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? de(r, i, a, !0) : (S[u - m] = l + 1, u >= ee ? ee = u : x = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = x ? Wi(S) : b;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || qi(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== C[_] ? ue(d, n, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ue(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ye);
		else if (c === z) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === Qi) ee(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[fr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Li(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[fr];
					s._isLeaving && s[fr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (dt(), Ar(s, null, n, e, !0), ft()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Mr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ga(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && nr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ye, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && ge(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Li(() => {
			_ && ga(_, t, e), h && nr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === z;
		if (o && !a) {
			pe(n, r);
			return;
		}
		if (t === Qi) {
			S(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Er(e) : e, c = () => {
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
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ki(c), Ki(l), r && Ce(r), i.stop(), a ? (a.flags |= 8, de(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, de(o, e, t, n)), s && Li(s, t), Li(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[ur];
		return n ? f(n) : t;
	}, ve = (e, t, n) => {
		Xn(() => {
			e == null ? t._vnode && de(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : ya());
	}, ye = {
		p: h,
		um: de,
		m: ue,
		r: fe,
		mt: oe,
		mc: ne,
		pc: k,
		pbc: E,
		n: _e,
		o: e
	}, be, xe;
	return t && ([be, xe] = t(ye)), {
		render: ve,
		hydrate: be,
		createApp: ai(ve, be)
	};
}
function Bi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Vi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Hi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ui(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (E(r) && E(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = pa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ui(t, a)), a.type === Xi && (a.patchFlag === -1 && (a = i[e] = pa(a)), a.el = t.el), a.type === Zi && !a.el && (a.el = t.el);
	}
}
function Wi(e) {
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
function Gi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Gi(t);
}
function Ki(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function qi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? qi(t.subTree) : null;
}
var Ji = (e) => e.__isSuspense;
function Yi(e, t) {
	t && t.pendingBranch ? E(e) ? t.effects.push(...e) : t.effects.push(e) : Kn(e);
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Xi = /* @__PURE__ */ Symbol.for("v-txt"), Zi = /* @__PURE__ */ Symbol.for("v-cmt"), Qi = /* @__PURE__ */ Symbol.for("v-stc"), $i = [], ea = null;
function B(e = !1) {
	$i.push(ea = e ? null : []);
}
function ta() {
	$i.pop(), ea = $i[$i.length - 1] || null;
}
var na = 1;
function ra(e, t = !1) {
	na += e, e < 0 && ea && t && (ea.hasOnce = !0);
}
function ia(e) {
	return e.dynamicChildren = na > 0 ? ea || b : null, ta(), na > 0 && ea && ea.push(e), e;
}
function V(e, t, n, r, i, a) {
	return ia(U(e, t, n, r, i, a, !0));
}
function H(e, t, n, r, i) {
	return ia(W(e, t, n, r, i, !0));
}
function aa(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function oa(e, t) {
	return e.type === t.type && e.key === t.key;
}
var sa = ({ key: e }) => e ?? null, ca = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : O(e) || /* @__PURE__ */ gn(e) || D(e) ? {
	i: $n,
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
		key: t && sa(t),
		ref: t && ca(t),
		scopeId: er,
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
		ctx: $n
	};
	return s ? (ma(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), na > 0 && !o && ea && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ea.push(c), c;
}
var W = la;
function la(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Wr) && (e = Zi), aa(e)) {
		let r = da(e, t, !0);
		return n && ma(r, n), na > 0 && !a && ea && (r.shapeFlag & 6 ? ea[ea.indexOf(e)] = r : ea.push(r)), r.patchFlag = -2, r;
	}
	if (La(e) && (e = e.__vccOpts), t) {
		t = ua(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = A(e)), k(n) && (/* @__PURE__ */ fn(n) && !E(n) && (n = w({}, n)), t.style = ke(n));
	}
	let o = O(e) ? 1 : Ji(e) ? 128 : dr(e) ? 64 : k(e) ? 4 : D(e) ? 2 : 0;
	return U(e, t, n, r, i, o, a, !0);
}
function ua(e) {
	return e ? /* @__PURE__ */ fn(e) || Si(e) ? w({}, e) : e : null;
}
function da(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ha(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && sa(l),
		ref: t && t.ref ? n && a ? E(a) ? a.concat(ca(t)) : [a, ca(t)] : ca(t) : a,
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
		ssContent: e.ssContent && da(e.ssContent),
		ssFallback: e.ssFallback && da(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && wr(u, c.clone(u)), u;
}
function G(e = " ", t = 0) {
	return W(Xi, null, e, t);
}
function K(e = "", t = !1) {
	return t ? (B(), H(Zi, null, e)) : W(Zi, null, e);
}
function fa(e) {
	return e == null || typeof e == "boolean" ? W(Zi) : E(e) ? W(z, null, e.slice()) : aa(e) ? pa(e) : W(Xi, null, String(e));
}
function pa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : da(e);
}
function ma(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (E(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ma(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Si(t) ? t._ctx = $n : r === 3 && $n && ($n.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (D(t)) {
		if (r & 65) {
			ma(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: $n
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [G(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ha(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = ke([t.style, r.style]);
		else if (S(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(E(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !C(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ga(e, t, n, r = null) {
	Mn(e, t, 7, [n, r]);
}
var _a = ri(), va = 0;
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
		scope: new Ke(!0),
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
		propsOptions: Di(r, i),
		emitsOptions: ui(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = li.bind(null, a), e.ce && e.ce(a), a;
}
var xa = null, Sa = () => xa || $n, Ca, wa;
{
	let e = Oe(), t = (t, n) => {
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
	Ci(e, r, a, t), Fi(e, i, n || t);
	let o = a ? Aa(e, t) : void 0;
	return t && wa(!1), o;
}
function Aa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ei);
	let { setup: r } = n;
	if (r) {
		dt();
		let n = e.setupContext = r.length > 1 ? Pa(e) : null, i = Ta(e), a = jn(r, e, 0, [e.props, n]), o = ce(a);
		if (ft(), i(), (o || e.sp) && !Mr(e) && Dr(e), o) {
			if (a.then(Ea, Ea), t) return a.then((n) => {
				wa(!0);
				try {
					ja(e, n, t);
				} finally {
					wa(!1);
				}
			}).catch((t) => {
				Nn(t, e, 0);
			});
			e.asyncDep = a;
		} else ja(e, a, t);
	} else Ma(e, t);
}
function ja(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = bn(t)), Ma(e, n);
}
function Ma(e, t, n) {
	let r = e.type;
	e.render ||= r.render || x;
}
var Na = { get(e, t) {
	return St(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(bn(pn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Qr) return Qr[n](e);
		},
		has(e, t) {
			return t in e || t in Qr;
		}
	}) : e.proxy;
}
function Ia(e, t = !0) {
	return D(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function La(e) {
	return D(e) && "__vccOpts" in e;
}
var q = (e, t) => /* @__PURE__ */ wn(e, t, Oa);
function Ra(e, t, n) {
	try {
		ra(-1);
		let r = arguments.length;
		return r === 2 ? k(t) && !E(t) ? aa(t) ? W(e, null, [t]) : W(e, t) : W(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && aa(n) && (n = [n]), W(e, t, n));
	} finally {
		ra(1);
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
}, Qa = /* @__PURE__ */ w({}, gr, Za), $a = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Qa, e))((e, { slots: t }) => Ra(yr, no(e), t)), eo = (e, t = []) => {
	E(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, to = (e) => e ? E(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function no(e) {
	let t = {};
	for (let n in e) n in Za || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = ro(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: ee = _, onAppear: S = v, onAppearCancelled: C = y } = t, te = (e, t, n, r) => {
		e._enterCancelled = r, oo(e, t ? u : s), oo(e, t ? l : o), n && n();
	}, ne = (e, t) => {
		e._isLeaving = !1, oo(e, d), oo(e, p), oo(e, f), t && t();
	}, T = (e) => (t, n) => {
		let i = e ? S : v, o = () => te(t, e, n);
		eo(i, [t, o]), so(() => {
			oo(t, e ? c : a), ao(t, e ? u : s), to(i) || lo(t, r, h, o);
		});
	};
	return w(t, {
		onBeforeEnter(e) {
			eo(_, [e]), ao(e, a), ao(e, o);
		},
		onBeforeAppear(e) {
			eo(ee, [e]), ao(e, c), ao(e, l);
		},
		onEnter: T(!1),
		onAppear: T(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => ne(e, t);
			ao(e, d), e._enterCancelled ? (ao(e, f), mo(e)) : (mo(e), ao(e, f)), so(() => {
				e._isLeaving && (oo(e, d), ao(e, p), to(b) || lo(e, r, g, n));
			}), eo(b, [e, n]);
		},
		onEnterCancelled(e) {
			te(e, !1, void 0, !0), eo(y, [e]);
		},
		onAppearCancelled(e) {
			te(e, !0, void 0, !0), eo(C, [e]);
		},
		onLeaveCancelled(e) {
			ne(e), eo(x, [e]);
		}
	});
}
function ro(e) {
	if (e == null) return null;
	if (k(e)) return [io(e.enter), io(e.leave)];
	{
		let t = io(e);
		return [t, t];
	}
}
function io(e) {
	return Ee(e);
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
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) {
			if (O(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? So(r, t, "");
			}
			else for (let e in t) n[e] ?? So(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? So(r, i, "") : Eo(e, i, !O(t) && t ? t[i] : void 0, o) || So(r, i, o);
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
	if (E(n)) n.forEach((n) => So(e, t, n));
	else if (n ??= "", t.startsWith("--")) xo.test(n) ? e.setProperty(t, n.replace(xo, ""), "important") : e.setProperty(t, n);
	else {
		let r = To(e, t);
		xo.test(n) ? e.setProperty(ye(r), n.replace(xo, ""), "important") : e[r] = n;
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
	let r = _e(t);
	if (r !== "filter" && r in e) return wo[t] = r;
	r = be(r);
	for (let n = 0; n < Co.length; n++) {
		let i = Co[n] + r;
		if (i in e) return wo[t] = i;
	}
	return t;
}
function Eo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var Do = "http://www.w3.org/1999/xlink";
function Oo(e, t, n, r, i, a = Pe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Do, t.slice(6, t.length)) : e.setAttributeNS(Do, t, n) : n == null || a && !Fe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : se(n) ? String(n) : n);
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
		r === "boolean" ? n = Fe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : ye(e.slice(2)), t];
}
var Lo = 0, Ro = /* @__PURE__ */ Promise.resolve(), zo = () => Lo ||= (Ro.then(() => Lo = 0), Date.now());
function Bo(e, t) {
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
				e && Mn(e, t, 5, a);
			}
		} else Mn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = zo(), n;
}
var Vo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ho = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ho(e, r, o) : t === "style" ? bo(e, n, r) : S(t) ? C(t) || No(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Uo(e, t, r, o)) ? (ko(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Oo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Wo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? ko(e, _e(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Oo(e, t, r, o));
};
function Uo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Vo(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Vo(t) && O(n) ? !1 : t in e;
}
function Wo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = _e(t);
	return Array.isArray(n) ? n.some((e) => _e(e) === r) : Object.keys(n).some((e) => _e(e) === r);
}
var Go = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return E(t) ? (e) => Ce(t, e) : t;
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
	return t && (e = e.trim()), n && (e = Te(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Te(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Qo = {
	deep: !0,
	created(e, t, n) {
		e[Jo] = Go(n), Ao(e, "change", () => {
			let t = e._modelValue, n = rs(e), r = e.checked, i = e[Jo];
			if (E(t)) {
				let e = Ve(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ie(t)) {
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
	if (E(t)) i = Ve(t, r.props.value) > -1;
	else if (ie(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Be(t, is(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var es = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ao(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Te(rs(e)) : rs(e)), r = e.multiple, i = r ? ie(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? E(i) ? t.slice() : t : i];
			try {
				e[Jo](i);
			} finally {
				Hn(() => {
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
	if (!n || E(e)) return Be(e, t);
	if (ie(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ns(e, t) {
	let n = e.multiple, r = E(t);
	if (!n || r || ie(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = rs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Ve(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Be(rs(a), t)) {
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
		let r = ye(n.key);
		if (t.some((e) => e === r || cs[e] === r)) return e(n);
	}));
}, us = /* @__PURE__ */ w({ patchProp: Ho }, qa), ds;
function fs() {
	return ds ||= Ri(us);
}
var ps = ((...e) => {
	let t = fs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = hs(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ms(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ms(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function hs(e) {
	return O(e) ? document.querySelector(e) : e;
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
	return _s = /* @__PURE__ */ an(n), _s;
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
var Us = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Ws = {
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
}, Gs = {
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
	status: Us,
	custom: [],
	annotations: []
};
function Ks(e, t = (e) => e) {
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
			properties: Object.fromEntries(Us.map((e) => [e, i(e)])),
			required: [...Us],
			additionalProperties: !1
		});
		case "annotations": return a({ type: "string" });
		case "custom": return e.shape === "kv" ? a({
			type: "object",
			additionalProperties: { type: "string" }
		}) : a({ type: "string" });
	}
}
function qs(e) {
	return e === "memory" || e === "recap";
}
function Js(e) {
	let t = {};
	for (let n of Us) t[n] = Xs(Ws[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Ys(e) {
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
var Xs = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Zs(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Xs(t).trim() || void 0;
		case "recap": return t === null ? null : Xs(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Xs(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Xs(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Xs(e.time),
				location: Xs(e.location),
				event: Xs(e.event),
				summary: Xs(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Js((e) => t[e]);
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Xs(e.label ?? e.title).trim(),
			content: Xs(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Xs(t)]));
			}
			return Xs(t).trim() || void 0;
	}
}
function Qs(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Zs(e.kind, Is(n.inner));
		case "recap": return Zs("recap", Is(n.inner));
		case "memory": return Zs("memory", t.filter((e) => !e.open).map((e) => ({
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
		case "status": return Js((e) => Bs(n.inner, e));
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
			return Zs("custom", Is(n.inner), e);
	}
}
function $s(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (xs(a)) continue;
		let t = Rs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Qs(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: zs(e, i),
		values: n,
		open: r
	};
}
function ec(e) {
	return Is(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var tc = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function nc(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function rc(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function ic(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function ac(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return tc(e, { n: String(t).padStart(i, "0") }) + r;
}
function oc(e, t, n, r, i) {
	let a = n.filter((e) => !xs(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: nc(e, t)
		},
		rank: 0,
		index: n
	})), s = ic(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = rc(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? ac(u, t + 1, d, n) : n;
		return {
			...e,
			position: t + 1,
			name: r
		};
	}), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
	for (let e of f) e.type === "stage" ? p.set(e.stage, e) : m.set(e.structure, e);
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
		n && h.set(e.structure, n);
	});
	let g = (e) => f.flatMap((t) => t.type === "structure" && h.get(t.structure) === e ? [t.structure] : []);
	return {
		items: f,
		prefixed: !!u,
		stageField: (e) => p.get(e)?.name ?? i(e),
		structureField: (e) => m.get(e)?.name ?? e.field,
		hostOf: (e) => h.get(e),
		carriedBy: g,
		stageParam: (e, t) => {
			let n = p.get(e);
			return u && n && g(e).length ? ac(u, n.position, d, t) : t;
		}
	};
}
function sc(e, t) {
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
var cc = {
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
}, lc = (e) => e;
function uc(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function dc(e, t) {
	return e.stages.filter((e) => js(e.when, t));
}
function fc(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function pc(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function mc(e, t, n = cc) {
	return uc(t.field?.name ?? n.turn.field, pc(e, t));
}
function hc(e, t, n = cc) {
	return uc(t.tool?.name ?? n.stage.name, pc(e, t));
}
function gc(e, t = cc) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var _c = (e, t) => t ? {
	...e,
	description: t
} : e;
function vc(e = cc, t = lc, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return _c({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: _c({ type: "string" }, i(r.old)),
				new_string: _c({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function yc(e, t, n = cc, r = lc) {
	return e.kind === "patch" ? vc(n, r, t) : _c({ type: "string" }, t);
}
function bc(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function xc(e, t, n, r, i = lc) {
	let a = r.filter((e) => !xs(e)), o = (e, t) => {
		if (e) return i(t ? uc(e, pc(n, t)) : e).trim() || void 0;
	}, s = oc(t, n, a, e, (t) => mc(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => hc(n, t, e), d = (t) => s.stageParam(t, gc(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = Ks(sc(n, r), i), qs(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = yc(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = gc(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = yc(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), bc(u(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => bc(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: _c({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: _c(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function Sc(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function Cc(e) {
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
function wc(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = Cc(e);
		return t ? [t] : [];
	});
}
function Tc(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Ec(e) {
	let t = wc(e);
	return t.length ? Tc(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function Dc(e) {
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
function Oc(e, t, n = !0) {
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
function kc(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Ac(e) {
	return e.map((e) => ({
		old_string: Bs(e, "old_string") ?? "",
		new_string: Bs(e, "new_string") ?? ""
	}));
}
function jc(e, t) {
	let n = Dc(t.stages), r = Hs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Fs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = $s(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Rs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Ac(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Is(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = zs(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = fc(t.stages), d = u >= 0 ? t.stages[u] : void 0;
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Oc(t.stages, n, t.final), kc(t.stages, n, t.final), n;
}
function Mc(e, t) {
	let n = Dc(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => mc(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Nc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (xs(e)) continue;
		let r = c(e), i = Zs(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = fc(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Oc(t.stages, n, t.final), kc(t.stages, n, t.final), n;
}
function Nc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Pc(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Fc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Pc(e, n);
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
function Ic(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Fc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Lc(e, t, n = !0) {
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
var Rc = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, zc = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Bc = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Vc(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Hc[e]);
}
var Hc = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Uc(e) {
	return e.split(zc).filter((e) => e !== "");
}
var Wc = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Gc(e) {
	let t = Uc(Wc(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Bc.has(n)) throw new Rc(`Could not find matching close tag for "${e}".`, a);
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
var Kc = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, qc = (e, t) => {
	throw new Rc(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Jc = /* @__PURE__ */ new Map(), Yc = 500;
function Xc(e) {
	let t = Jc.get(e);
	if (t) return t;
	let n = Gc(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Rc(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Vc, Kc, qc);
	return Jc.size >= Yc && Jc.clear(), Jc.set(e, i), i;
}
function Zc(e, t) {
	return Xc(e)(t);
}
function Qc(e) {
	try {
		return Xc(e), null;
	} catch (e) {
		return e instanceof Rc ? e : new Rc(String(e));
	}
}
function $c(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) $c(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var el = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, tl = /^\s*(```|~~~)/;
function nl(e) {
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
var rl = /<!--[ \t]*#/g, il = /<!--|-->/g;
function al(e, t, n) {
	il.lastIndex = t;
	for (let t = il.exec(e); t; t = il.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function ol(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(el)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(el, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...nl(o),
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
			let t = al(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? sl(e, t) : t;
		} else if (tl.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		rl.lastIndex = u;
		for (let t = rl.exec(e); t; t = rl.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = al(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? sl(e, r) : r, rl.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function sl(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var cl = [
	"system",
	"user",
	"assistant"
], ll = ["dialogue", "imperative"];
function ul(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Ms(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = Qc(e.text);
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
				cl.includes(n) || t(`@as expects one of ${cl.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: cl.includes(n) ? n : void 0,
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
				if (!n || !ll.includes(n)) {
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
function dl(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = ol(e, [], 1, r), a = ul(i.tokens, r);
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
function fl(e, t, n = (e) => e, r) {
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
var pl = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function ml(e) {
	let t = e.entries.flatMap((e) => pl(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => pl(e));
		t.push(...pl(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...pl(dl(n.text, n.role).content));
	return t;
}
//#endregion
//#region packages/protocol/src/clone.ts
function hl(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => hl(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = hl(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function gl(e) {
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
function _l(e, t) {
	let n = gl(e), r = gl(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function vl(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = gl(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = _l(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var yl = (e) => !!e && typeof e == "object" && !Array.isArray(e), bl = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
}, xl = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function Sl(e, ...t) {
	let n = hl(e);
	for (let e of t) n = Cl(n, e);
	return n;
}
function Cl(e, t) {
	if (t === void 0) return e;
	if (!yl(e) || !yl(t)) return hl(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = Cl(e[r], i);
	return n;
}
function wl(e, t) {
	if (yl(e) && yl(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = wl(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : hl(e);
}
function Tl(e, t, n = "", r = [], i = El) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? yl(e[a]) && yl(t[a]) && (Tl(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var El = /* @__PURE__ */ new Set(["sampling"]);
function Dl(e, t, n) {
	let r = hl(e);
	for (let e of t) if (vl(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && yl(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Ol(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/params.ts
function kl(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function Al(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function jl(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? kl(n) : Array.isArray(e.default) ? kl(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function Ml(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Nl(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, jl(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Pl(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Fl(e, t, n) {
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
function Il(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Pl(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Fl(r[t.var], t, e));
	}
	return r;
}
var Ll = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Rl(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Ll.test(e);
}
function zl(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Rl(e) ? e : JSON.stringify(e);
}
var Bl = (e) => !e.includes("\n") && Rl(e) ? e : JSON.stringify(e);
function Vl(e) {
	return e.map((e) => `- ${zl(e, "  ")}`).join("\n");
}
function Hl(e) {
	return [...e].map(([e, t]) => `${Bl(e)}: ${zl(t, "  ")}`).join("\n");
}
function Ul(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Vl(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Hl(e) : t === "keys" ? Vl([...e.keys()]) : t === "values" ? Vl([...e.values()]) : e.get(t) ?? "";
}
function Wl(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/assemble.ts
function Gl(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Kl(e, t) {
	return !!e.groups[t]?.allowNone;
}
function ql(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || Kl(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => js(e.when, n)) : i;
}
function Jl(e, t) {
	let n = new Set(ql(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Yl(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Xl(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Zl(e, t, n, r) {
	return t && e.tools ? oc(t, n, r, e.tools, (t) => mc(n, t, e.tools)) : void 0;
}
function Ql(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? Zl(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = jl(n, o.params[e]);
		if (Ml(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Ps(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return Ul(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return Xl(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${Xl(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : Sc(t, (e) => Xl(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			default: return;
		}
	};
	return g;
}
function $l(e, t, n, r, i) {
	return $c({
		...hl(e),
		vars: hl(Wl(t)),
		sampling: hl(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function eu(e, t, n) {
	return (r) => {
		try {
			return Zc(r.text, e());
		} catch (e) {
			let i = e instanceof Rc ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function tu(e, t) {
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
function nu(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? Zl(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? hc(n, t, e.tools) : c?.stageField(t) ?? mc(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Xl(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function ru(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = Gl(i), s = a ? dc(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = Gl(i), l = ql(n, r, c), u = Yl(n, l), d = Il(n.vars, l), f = Ql({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Ps(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= $l(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !js(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...fl(e.content, c, p, eu(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = nu(n, a, s, i.style, i.transport, r, u);
		for (let n of fl(t, c, p, eu(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = tu(e, v.get(e.id) ?? []));
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
function iu(e, t, n = {}) {
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
		modules: Jl(e, t),
		params: Nl(e, t),
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
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var au = /* @__PURE__ */ new Set([
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
]), ou = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), su = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, cu = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function lu(e, t = {}) {
	let n = (e) => lu(e, t);
	if (!cu(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && cu(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => ou.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(cu), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return uu({
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
		return uu({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && au.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			cu(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && su[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = cu(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return uu({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), uu(i, a);
}
function uu(e, t) {
	return t && (e.nullable = !0), e;
}
function du(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!cu(n)) return e;
		let r = cu(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: lu(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var fu = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function pu(e) {
	let t = e.configurationDefaults?.connection;
	return !fu(t) || Object.keys(bl).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...bl,
				...t
			}
		}
	};
}
function mu(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!fu(t) || "userInput" in t) && (!fu(n) || "userInput" in n)) return e;
	let r = fu(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: fu(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: fu(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function hu(e) {
	let t = e.configurationDefaults;
	if (!fu(t)) return e;
	let n = t.cache;
	return fu(n) && Object.keys(xl).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...xl,
				...fu(n) ? n : {}
			}
		}
	};
}
function gu(e) {
	let t = e.configurationDefaults;
	if (!fu(t)) return e;
	let n = t.meta;
	return fu(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...fu(n) ? n : {}
			}
		}
	};
}
function _u(e) {
	let t = gu(hu(mu(pu(e)))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function vu(e) {
	return !fu(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 3 ? _u(e) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var yu = "user-", bu = "advanced-preset.user-modules", xu = (e) => `${yu}${e}`;
function Su() {
	return {
		match: "all",
		rules: []
	};
}
var Cu = ["on", "off"];
function wu(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? Cu.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function Tu(e) {
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
function Eu(e, t) {
	let n = Tu(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var Du = (e) => ({
	t: "lit",
	v: e
});
function Ou(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(Du)
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
			r: Du(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function ku(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(wu).map((e) => {
		if (e.kind === "keyword") return Du(Eu(e, t));
		if (e.kind === "var") return Ou(e);
		try {
			return Ds(e.source);
		} catch {
			return Du(!1);
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
function Au(e) {
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
function ju(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function Mu(e, t) {
	return t.entries.filter((t) => !ju(e, t.point));
}
function Nu(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function Pu(e, t) {
	return (t.vars ?? []).filter((t) => Nu(e, t.var)?.type !== t.type);
}
function Fu(e, t) {
	return [.../* @__PURE__ */ new Set([...Mu(e, t).map((e) => e.point), ...Pu(e, t).map((e) => e.var)])];
}
function Iu(e) {
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
function Lu(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Ru(e, t, n) {
	let r = t.filter((e) => e.enabled && (e.entries.length || e.vars?.length));
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = xu(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: ku(t.trigger, n),
			structures: [],
			vars: (t.vars ?? []).filter((t) => Nu(e, t.var)?.type === t.type).map(Iu).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = ju(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Lu(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: dl(n.text, n.role).content
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
function zu(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => pl(dl(e.text, e.role).content)));
}
function Bu(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Vu(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Hu(e, t, n) {
	let r = t.filter((e) => vl(n, e.from));
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
				path: Bu(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Vu(t.source, e)
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
var Uu = (e) => !!e && typeof e == "object" && !Array.isArray(e), Wu = (e, t = "") => typeof e == "string" ? e : t, Gu = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Ku = [
	"system",
	"user",
	"assistant"
], qu = [
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
function Ju(e) {
	if (!Uu(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Wu(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && qu.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Gu) : Gu(e.value) && (t.value = e.value), t;
	}
	return null;
}
function Yu(e) {
	if (!Uu(e) || typeof e.var != "string") return [];
	let t = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Wu(e.text)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: t(e.items)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Uu).map((e) => ({
			key: Wu(e.key),
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
function Xu(e) {
	if (!Uu(e) || !Array.isArray(e.entries)) return null;
	let t = Uu(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Uu(e)) return [];
		let n = {
			id: Wu(e.id) || `e${t + 1}`,
			point: Wu(e.point),
			text: Wu(e.text)
		};
		return Ku.includes(e.role) && (n.role = e.role), [n];
	});
	return {
		id: Wu(e.id),
		name: Wu(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Yu) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Ju).filter((e) => !!e) : []
		}
	};
}
function Zu(e, t) {
	return {
		format: bu,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function Qu(e) {
	if (Uu(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Xu).filter((e) => !!e);
		return {
			preset: Uu(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Wu(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Xu(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var $u = "{==", ed = "==}", td = "{>>", nd = "<<}", rd = /\n[ \t]*\n/g;
function id(e, t) {
	rd.lastIndex = t;
	let n = rd.exec(e);
	return n ? n.index : Infinity;
}
function ad(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function od(e, t, n, r) {
	let i = id(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function sd(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith($u, o)) {
		let t = o + 3, s = od(e, t, ed, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - ad(n, [ed]));
			break;
		}
		if (s < 0) {
			let n = Math.min(id(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || td.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(td, l)) {
			let t = l + 3, s = od(e, t, nd, n);
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
	} else if (e.startsWith(td, o)) {
		let t = o + 3, i = od(e, t, nd, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += td, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && ($u.startsWith(t) || td.startsWith(t))) break scan;
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
function cd(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function ld(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function ud(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = cd(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + ld(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function dd(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = ud(e, t);
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
function fd(e, t) {
	let n = dd(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${$u}${t.quote}${ed}${td}${t.comment}${nd}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function pd(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function md(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function hd(e, t, n) {
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
function gd(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...hl(e)
		})),
		vars: hl(e.vars ?? []),
		trigger: e.trigger ? hl(e.trigger) : Su()
	};
}
function _d(e) {
	return {
		id: e.id,
		name: e.name,
		...e.enabled ? {} : { enabled: !1 },
		entries: e.entries.map(({ point: e, role: t, text: n }) => ({
			point: e,
			...t ? { role: t } : {},
			text: n
		})),
		vars: hl(e.vars ?? []),
		trigger: hl(e.trigger)
	};
}
function vd(e) {
	if (Array.isArray(e)) return e.map(vd);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = vd(e[n]));
		return t;
	}
	return e;
}
function yd(e) {
	return JSON.stringify(vd({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text
		})),
		vars: e.vars ?? [],
		trigger: e.trigger ?? Su()
	}));
}
function bd(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, yd(e.locales[t])]);
	return JSON.stringify([
		yd(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function xd(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var Sd = "[{{time}} · {{location}}] {{event}}: {{summary}}", Cd = (e) => e === "synopsis" ? Sd : "{{value}}", wd = "{{content}}";
function Td(e) {
	let t = e.indexOf(wd);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(wd, "");
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
function Ed(e) {
	let t = e.history;
	if (t === void 0 || xs(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: Td(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? Cd(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var Dd = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, Od = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function kd(e) {
	let t = e?.stages ?? [], n = Od(t);
	return n >= 0 ? nc(e, t[n]) : 0;
}
function Ad(e, t, n) {
	let r = e?.stages ?? [], i = (t) => nc(e, t), a = Od(r), o = kd(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = rc(e, t);
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
var jd = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Md(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => jd(e).trim() !== "");
}
function Nd(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return Pd(Sd, e, t, !1);
		case "status": return Ys(t);
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : jd(t);
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${jd(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function Pd(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Gs[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? Nd(t, n) : i && (a.has(o) || t === "custom" && o in i) ? jd(i[o]) : a.has(o) ? "" : e);
}
var Fd = (e, t) => Pd(e, "synopsis", t, !1);
function Id(e, t, n) {
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
//#region src/store/presets.ts
var Ld = /* @__PURE__ */ an(/* @__PURE__ */ new Map()), Rd = /* @__PURE__ */ an(/* @__PURE__ */ new Map());
async function zd() {
	try {
		let e = `${s()}dist/presets/`, t = await (await g(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = vu(await (await g(e + n, { cache: "no-cache" })).json());
			t && Ld.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var Bd = (e) => vu(e);
function Vd() {
	return [.../* @__PURE__ */ new Set([
		...Ld.keys(),
		...Object.keys(J().installed),
		...Rd.keys()
	])].map((e) => Hd(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Hd(e) {
	let t = Rd.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = Wd(e), r = Ld.get(e);
	if (n && (!r || _l(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Ud = /* @__PURE__ */ new WeakMap();
function Wd(e) {
	let t = J().installed[e];
	if (t) return Ud.has(t) || Ud.set(t, vu(t)), Ud.get(t) ?? void 0;
}
var Gd = (e) => Hd(e)?.preset;
function Kd(e) {
	J().installed[e.id] = e, Y();
}
function qd(e) {
	delete J().installed[e], Y();
}
function Jd(e, t) {
	e ? Rd.set(e.id, e) : t ? Rd.delete(t) : Rd.clear();
}
var Yd = (e) => Ld.has(e), Xd = {
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
	"cards.custom.error": "Component error: {error}"
}, Zd = {
	en: Xd,
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
		"cards.custom.error": "组件出错：{error}"
	}
};
function Qd() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function X(e, t = {}) {
	return ((Zd[Qd()] ?? Zd[Qd().split("-")[0]])?.[e] ?? Xd[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function $d(e) {
	return e.locales?.[Qd()] ?? e.locales?.[Qd().split("-")[0]];
}
function Z(e, t, n, r, i) {
	let a = $d(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function ef(e) {
	let t = $d(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function tf(e) {
	let t = $d(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function nf(e, t, n) {
	return hd(t, Qd(), $d(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/store/sidecar.ts
var rf = "advanced_preset";
function af(e) {
	let t = e?.extra?.[rf];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function of(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: hl(n)
		}
	};
}
function sf(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[rf] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[rf] = hl(n));
}
function cf(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra?.advanced_preset) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] ? !1 : (delete n.extra[rf], !0);
}
//#endregion
//#region src/store/eventlog.ts
function lf() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var uf = (e) => `legacy-${e}`;
function df(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = uf(n), t = !0);
	}), t;
}
function ff(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? uf(e.index) : void 0);
}
var pf = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), mf = "advanced_preset";
function hf() {
	return e().chatMetadata?.[mf]?.seedEvents ?? [];
}
function gf(t = Infinity) {
	let n = hf().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of af(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function _f(e = Infinity) {
	let t = {};
	for (let { event: n } of gf(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function vf(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of gf(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function yf(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = af(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[mf] && (e.extra[mf].events = hl(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[mf] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function bf(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function xf(e, t, n, r, i, a = lf()) {
	let o = e.globalMemory;
	df(o.log);
	let s = bf(e)[n] ?? null;
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
var Sf = (e) => e.globalMemory.cursor > 0, Cf = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function wf(e) {
	Sf(e) && (e.globalMemory.cursor--, Y());
}
function Tf(e) {
	Cf(e) && (e.globalMemory.cursor++, Y());
}
function Ef(e, t) {
	let n = e.globalMemory.log[pf(e, t)];
	n && (n.prev === null ? xf(e, "delete", n.key, void 0, "undo") : xf(e, "replace", n.key, n.prev, "undo"));
}
function Df(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = lf();
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
function Of(e, t) {
	for (let n of t) pf(e, n.id) < 0 && xf(e, n.op, n.key, n.content, "model", n.id);
}
function kf(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[pf(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function Af(e) {
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
	}, Y()), df(n.globalMemory.log) && Y(), n;
}
function jf(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Ol(e, n.id)?.diff;
}
function Mf(e, t = Af(e).active.ref) {
	return Sl(e.configurationDefaults, jf(e, Af(e), t));
}
function Nf(e) {
	let t = Af(e);
	return Sl(Mf(e, t.active.ref), t.active.diff);
}
function Pf(e, t) {
	let n = Af(e);
	n.active.diff = wl(t, Mf(e, n.active.ref)) ?? {}, Y();
}
function Ff(e, t) {
	let n = Nf(e);
	return t(n), Pf(e, n), n;
}
function If(e, t) {
	let n = Af(e);
	n.active = {
		ref: t,
		diff: {}
	}, Y();
}
var Lf = (e) => Object.keys(Af(e).active.diff ?? {}).length > 0;
function Rf(e) {
	Af(e).active.diff = {}, Y();
}
function zf(e, t) {
	let n = Af(e), r = Nf(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: wl(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, Y(), i;
}
function Bf(e, t) {
	let n = Af(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = wl(Nf(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), Y());
}
function Vf(e, t, n) {
	let r = Af(e).saved.find((e) => e.id === t);
	r && (r.name = n, Y());
}
function Hf(e, t) {
	let n = Af(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), Y();
}
function Uf(e) {
	let t = Af(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = _l(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Dl(t, e.migrations, n) : hl(t);
		i.push(...Tl(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !Al(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Hu(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && Fu(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, Y(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && h("warning", X("um.lostAfterUpdate", { names: s.join(", ") }), ef(e)), i;
}
//#endregion
//#region src/store/carrier.ts
var Wf = "advanced_preset", Gf = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Kf = (e) => Gf[e] ?? e, qf = () => e().getPresetManager("openai"), Jf = (e) => `AP · ${e.name}`;
function Yf() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function Xf(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Zf(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...hl(t.sampling),
		prompts: hl(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: hl(n)
		})),
		extensions: { [Wf]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function Qf(e) {
	let t = qf();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function $f(e, t, n) {
	let r = qf();
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
async function ep(e, t = {}) {
	let n = qf(), r = Af(e), i = Qf(e.id), a = i ?? Jf(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Wf], c = !o || t.force || s?.hash !== e.hash, l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && Xf(o) !== r.carrierHash && h("info", X("carrier.reset", { name: a }));
		let n = Zf(e, Nf(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = Xf(n), Y(), await $f(a, n, !!t.select || l);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function tp(e) {
	await ep(e, { select: !0 });
}
async function np(e) {
	let t = Qf(e.id);
	if (!t) return;
	let n = qf(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Nf(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...hl(i)
	}, o = n.getSelectedPresetName() === t;
	rp = !0;
	try {
		await $f(t, a, o);
	} finally {
		rp = !1;
	}
}
var rp = !1;
function ip(t) {
	if (rp || Yf() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Nf(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Kf(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = hl(r));
	}
	return Object.keys(i).length ? (Ff(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var ap = null, op = (e) => {
	ap = e;
}, sp = () => {
	let e = ap;
	return ap = null, e;
}, cp = (e) => e.meta?.enabled !== !1;
function lp(t, n) {
	if (!cp(n)) return "";
	let r = Ps(t.meta.trigger, (e) => e[0] === "name" ? Xl(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function up(e, t, n, r, i, a = [], o = !0) {
	let s = Lc(n, lp(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = Gl(c);
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
	].includes(r) && !s.pure ? "story" : "task", f = o ? sp() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function dp(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var fp = 0, pp = () => `ap-${Date.now().toString(36)}-${(++fp).toString(36)}`, mp = /* @__PURE__ */ new Map(), hp = null, gp = null, _p = {
	setPending(e) {
		hp = e;
	},
	takePending() {
		let e = hp;
		return hp = null, e;
	},
	peekPending: () => hp,
	arm(e) {
		gp = e, mp.set(e.id, e);
	},
	takeArmed() {
		let e = gp;
		return gp = null, e;
	},
	get: (e) => mp.get(e),
	release(e) {
		mp.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of mp) t - r.createdAt > e && mp.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function vp(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function yp(e, t) {
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
var bp = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, xp = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), Sp = (e, t) => Fd(e, t), Cp = (e, t) => t ? bp(e)?.structures?.[t] : void 0, wp = (e, t) => bp(e)?.structures?.[t];
function Tp(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = bp(e);
		if (a && xp.has(a.turn)) {
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
		let n = Lc(e.item.mes, t.trigger, t.wrap);
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
				} else Cp(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && bp(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && Md(wp(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function Ep(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : Cp(r, n.synopsisId);
			return e ? Sp(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? bp(r)?.annotations : void 0;
			return i?.length && (e = fd(e, i)), t.echo?.length && n.echoes && (e = Dp(e, r, t.echo, n.echoes)), e;
		}
	}
}
function Dp(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = wp(t, e.id);
		Md(a) && e.pieces.forEach((t, n) => i.push({
			text: Pd(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? Id(e, r.contentKey, i) : e;
}
function Op(e, t) {
	let n = [];
	for (let r of Tp(e, t)) {
		let e = Ep(r, r.fresh, t);
		e !== null && n.push(e === r.item.mes ? r.item : {
			...r.item,
			mes: e
		});
	}
	return n;
}
function kp(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? Dd(n) : 0;
	if (r) return ql(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function Ap(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function jp(e, t, n, r) {
	let i = new Set(ql(e, t).flatMap((e) => e.structures)), a = n ? Gl(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = Ed(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? js(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...Ad(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: kd(r)
	} : void 0;
}
var Mp = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function Np(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function Pp(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = Np(e), r = Np(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function Fp(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Mp(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Mp(l.text);
			if (c === u || c.includes(u) || Pp(c, u) >= n) {
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
var Ip = 50;
function Lp(e) {
	let t = Af(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var Rp = () => Math.random().toString(36).slice(2, 8);
function zp(e) {
	let t = new Set(e), n = Rp();
	for (; t.has(n);) n = Rp();
	return n;
}
function Bp(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: zp(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function Vp(e, t) {
	let n = Lp(e), r = {
		id: zp(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: Su()
	};
	return e.insertionPoints.length && r.entries.push(Bp(e, r)), n.push(r), Y(), n[n.length - 1];
}
function Hp(e, t) {
	let n = Lp(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(gd(t, zp(n.map((e) => e.id)), { name: i })), Y(), n[n.length - 1];
}
function Up(e, t, n) {
	let r = Lp(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...hl(r[i]),
		id: zp(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), Y(), r[i + 1];
}
function Wp(e, t) {
	let n = Af(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), Y();
}
function Gp(e, t, n) {
	let r = Lp(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), Y();
}
function Kp(e, t) {
	return Zu(hl(Lp(e).filter((e) => !t || t.includes(e.id))), e);
}
function qp(e, t) {
	let n = Qu(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && _l(n.preset.version, e.version) < 0 && (r = Hu(r, e.migrations, n.preset.version));
	let i = Lp(e), a = r.map((e) => {
		let t = {
			...e,
			id: zp(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return Y(), {
		added: a,
		missing: a.filter((t) => Fu(e, t).length).length
	};
}
function Jp(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < Ip; t--) {
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
var Yp = /* @__PURE__ */ an({
	log: [],
	requests: []
}), Xp = 50;
function Zp(e, t) {
	Yp.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Yp.log.length > Xp && (Yp.log.length = Xp);
}
function Qp(e) {
	return Yp.requests.unshift(e), Yp.requests.length > Xp && (Yp.requests.length = Xp), Yp.requests[0];
}
//#endregion
//#region src/core/cache.ts
function $p(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function em(e, t) {
	return e.send_date ? $p(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var tm = 57344, nm = /⟦([\uE000-\uF8FF])⟧/g, rm = (e) => `⟦${String.fromCharCode(tm + e)}⟧`;
function im(e) {
	let t = [];
	return {
		text: e.replace(nm, (e, n) => (t.push(n.charCodeAt(0) - tm), "")),
		marks: t
	};
}
function am(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of Tp(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : yp(n?.[e], t.synopsisId), l = c ?? s.fresh, u = Ep(s, s.fresh, t), d = c ? Ep(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = vp(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: vp(l),
			freshMode: vp(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function om(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function sm(e, t, n, r, i, a = {}) {
	let o = om(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && $p(i) === n[r]) r++;
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
		r !== null && f.push($p(r));
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
function cm(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var lm = "advanced-preset.cache.v1", um = 864e5, dm = 30, fm = null;
function pm() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function mm() {
	if (fm) return fm;
	try {
		let e = pm()?.getItem(lm), t = e ? JSON.parse(e) : {};
		fm = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		fm = {};
	}
	return fm;
}
function hm(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= um).sort((e, t) => t[1].at - e[1].at).slice(0, dm);
	fm = Object.fromEntries(n);
	try {
		pm()?.setItem(lm, JSON.stringify(fm));
	} catch {}
}
function gm() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
function _m(e) {
	return mm()[e];
}
function vm(e, t) {
	hm({
		...mm(),
		[e]: t
	}, t.at);
}
function ym(e, t) {
	let n = mm()[e];
	n && vm(e, {
		...n,
		at: t
	});
}
//#endregion
//#region src/core/input-shaping.ts
var bm = "⟦󰀀⟧", xm = "⟦󰀁⟧", Sm = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function Cm(e) {
	let t = e.match(Sm)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + bm + t;
}
var wm = (e) => e.replaceAll(bm, "");
function Tm(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = wm(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = wm(e.text));
}
function Em(e, t, n, r) {
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
			let n = t.lastIndexOf(bm);
			if (n < 0) continue;
			let a = wm(t.slice(0, n)).replace(Sm, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: wm(t.slice(n + 4))
			};
		}
	}
	return null;
}
var Dm = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function Om(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? xd(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && Dm(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (Dm(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var km = "stream_function_call_arguments";
function Am(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function jm(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function Mm(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[km] = !0, t() && Nm(e));
}
function Nm(e) {
	let t = Pm(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...jm(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Pm(e) {
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
function Fm(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of xc(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Im(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function Lm(e) {
	return xc(e.preset.tools, e.workflow, e.stages, e.structures, Im(e));
}
function Rm(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Xl(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function zm(e, t, n) {
	let r = uc(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Im(e)(r);
}
function Bm(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = Im(r), u = l(o.tool.description);
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
				content: zm(r, o.response[t], { first: n })
			}
		]
	};
}
function Vm(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && Hm(n, e.ctx.preset.tools.jsonStringHint), Am(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && Mm(n), n;
}
function Hm(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = du(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: lu(e.json_schema.value, n)
	});
}
function Um(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var Wm = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", Gm = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(bm, ""), Km = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(nm.source).test(e);
function qm(e) {
	for (let t of e) if (typeof t.content == "string") Km(t.content) && (t.content = im(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && Km(e.text) && (e.text = im(e.text).text);
}
function Jm(e) {
	if (typeof e.content == "string") {
		if (!Km(e.content)) return null;
		let { text: t, marks: n } = im(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => cm(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !Km(e.text)) return;
		let i = im(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = cm(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function Ym(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = Lm(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return $p(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function Xm(e) {
	return $p(e.map((e) => `${e.role}\u0000${Wm(e.content)}`).join(""));
}
function Zm(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return qm(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = Jm(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = Gm(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = Gm(i.content);
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
			sticky: Gm(f),
			fresh: Gm(p),
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
		tools: Ym(e),
		prompt: Xm(t.slice(0, n))
	}, p = sm(l, _m(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function Qm(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? ym(n.chat, t) : vm(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/core/assembler.ts
var $m = /⟦ap:region:([\w.-]+)⟧/g, eh = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function th(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll($m)) {
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
function nh(t, n) {
	if (!cp(n)) return "";
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Xl(t, n, t.user), s = Xl(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = af(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? ec(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function rh(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = af(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			if (r != null && r !== "") {
				if (t.kind === "status") {
					let e = typeof r == "string" ? r : Ys(r);
					e && (n[t.id] = e);
				} else n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
function ih(t, n) {
	let { preset: r, config: i } = t, a = rh(r), o = _f(), s = bf(Af(r)), c = vf(), l = nh(r, i), u = t.transport;
	return {
		vars: iu(r, i, {
			transport: u,
			style: r.styles[u],
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
				recent: !!l
			},
			flags: {
				...Object.fromEntries(r.regex.map((e) => [e.id, !1])),
				...t.flags
			},
			chat: { group: !!e().groupId },
			memory: {
				hasChat: Object.keys(o).length > 0,
				hasGlobal: Object.keys(s).length > 0
			},
			recap: { present: !!c },
			input: { shaped: !!t.inputShaped },
			last: Object.fromEntries(Object.values(r.structures).filter((e) => e.kind === "custom" || e.kind === "status").map((e) => [e.id, e.id in a]))
		}),
		data: {
			metaText: t.meta.segments.join("\n\n"),
			memory: {
				chat: o,
				global: s
			},
			recap: c?.text ?? "",
			recentMeta: l,
			customLast: a,
			inputText: t.inputShaped ? xm : ""
		}
	};
}
function ah(t, n) {
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
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = Fp(s.map(({ m: e }) => ({
		role: e.role,
		text: eh(e.content)
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
			mes: eh(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = {
		trigger: lp(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		...Ap(r),
		echoes: jp(r, i, ih(t, dp(r, i, t.origin)).vars, dp(r, i, "story")),
		recap: vf(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1,
		annotations: kp(r, i)
	}, m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
	if (i.cache?.enabled) {
		let e = gm(), n = am(d, p, _m(e)?.modes, (e) => em(d[e], f[e] ?? e));
		for (let e of n.out) {
			let t = d[e.index].__h;
			m.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + rm(e.entry));
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
	} else for (let e of Op(d, p)) m.set(e.__h, e.mes), h.set(e.__h, [e.mes]);
	if (r.inputShaping && c.length && c[c.length - 1].m.is_user) {
		let e = l.indexOf(c.length - 1), n = h.get(e);
		e >= 0 && m.has(e) && n?.some((e) => e.trim()) && !s.slice(e + 1).some(({ m: e }) => e.role === "user") && (m.set(e, Cm(m.get(e))), t.input = { texts: n });
	}
	let g = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : g.add(t.i);
	});
	for (let e of [...g].sort((e, t) => t - e)) n.splice(e, 1);
}
function oh(t, n) {
	let r = n ? null : _p.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Nf(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = up(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: pp(),
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
		keywords: Jp(a, n ? o : -1)
	};
}
var sh = Symbol("ap-region");
function ch(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function lh(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? Em(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (Tm(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(xm) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		Om(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(xm, () => c) : e;
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
function uh(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => eh(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Xl(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = eh(t.content);
		if (t[sh] || t.role === "system") return n;
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
var dh = /* @__PURE__ */ new Set();
function fh(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !dh.has(n) && (dh.add(n), h("warning", X("warn.template", { error: n }), X("app.name")));
}
async function ph(t) {
	let { chat: n, dryRun: r } = t;
	if (!J().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		qm(n), Tm(n), r || (_p.setPending(null), _p.takeArmed());
		return;
	}
	let i = Yf(), a = i ? Gd(i) : void 0;
	if (!a) {
		let e = th(n).filter((e) => !e.__anchor);
		qm(e), Tm(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = oh(a, r), s = th(n);
	!o.interceptorRan && !r && ah(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : dp(a, o.config, o.origin), u = a.inputShaping, d = ch(a, s), f = u && o.input ? Em(s, d.from, d.to, o.input.texts) : null;
	u && o.input && !f && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!f;
	let { vars: p, data: m } = ih(o, l), h = Ru(a, Lp(a), o.keywords);
	for (let e of h.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let g = ru({
		preset: h.preset,
		config: o.config,
		vars: p,
		data: m
	}, l);
	g.warnings.length && fh(g.warnings, o.warnings), o.workflow = l, o.assembly = g, o.stages = g.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : g.structures;
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
			text: Ul(t)
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
			return Object.defineProperty(t, sh, { value: !0 }), t;
		}).filter((e) => eh(e.content).trim());
		x.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: eh(e.content).length,
				content: eh(e.content)
			}))
		}), v.push(...n), t === a.anchors.historyStart && (y = v.length);
	}
	let ee = new Set(s.map((e) => e.__anchor).filter(Boolean));
	for (let [e, t] of Object.entries(g.regions)) !ee.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	x.cache = Zm(o, v, y, b < 0 ? v.length : b), x.input = lh(o, v, y, b < 0 ? v.length : b, x);
	let S = o.transport === "prefill" && !c && y >= 0 ? uh(o, v, y) : v;
	n.splice(0, n.length, ...S.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), Zp("assembly", x), !r && !c && l && _p.arm(o);
}
//#endregion
//#region src/core/interceptor.ts
async function mh(t, n, r, i) {
	if (_p.setPending(null), !J().enabled) return;
	let a = Yf(), o = a ? Gd(a) : void 0;
	if (!o) return;
	let s = Nf(o), c = i || "normal";
	c === "swipe" && cf(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = u >= 0 ? t[u].mes : "", f = t.slice(-6).map((e) => e.mes), p = Jp(t, u), { meta: m, flags: h, origin: g } = up(o, s, d, c, !0, f), _ = e().chat, v = t.map((e) => _.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), y = s.connection.transport, { vars: b } = ih({
		preset: o,
		config: s,
		transport: y,
		origin: g,
		stType: c,
		meta: m,
		flags: h
	}, dp(o, s, g)), x = {
		trigger: lp(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Ap(o),
		echoes: jp(o, s, b, dp(o, s, "story")),
		recap: vf(),
		realIndex: (e) => v[e] ?? -1,
		currentInput: u,
		annotations: kp(o, s),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0
	}, ee, S, C = -1, w = [];
	if (s.cache?.enabled) {
		let e = gm(), n = am(t, x, _m(e)?.modes, (e) => em(t[e], v[e] ?? e));
		if (S = n.out.map(({ item: e, entry: t }) => t === void 0 ? e : {
			...e,
			mes: e.mes + rm(t)
		}), C = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, C >= 0) {
			let e = n.out[C], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			w = t ? [
				t.given,
				t.sticky,
				t.fresh
			].filter((e) => typeof e == "string") : [e.item.mes];
		}
		ee = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else {
		S = Op(t, x);
		let e = u >= 0 ? t[u] : void 0;
		C = e ? S.findLastIndex((t) => t === e || t.is_user && t.send_date === e.send_date && t.name === e.name) : -1, C >= 0 && (w = [S[C].mes]);
	}
	let te;
	o.inputShaping && C >= 0 && w.some((e) => e.trim()) && (S[C] = {
		...S[C],
		mes: Cm(S[C].mes)
	}, te = { texts: w }), t.splice(0, t.length, ...S);
	let ne = {
		id: pp(),
		preset: o,
		config: s,
		origin: g,
		stType: c,
		interceptorRan: !0,
		dryRun: !1,
		meta: m,
		flags: h,
		transport: y,
		stages: [],
		structures: [],
		inputIndex: u >= 0 ? v[u] ?? _.length - 1 : -1,
		continueFrom: c === "continue" ? t[l]?.mes : void 0,
		keywords: p,
		sticky: ee,
		input: te,
		createdAt: Date.now(),
		warnings: []
	};
	_p.setPending(ne);
}
//#endregion
//#region src/core/transports/text.ts
function hh(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Rm(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => jc(e, {
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
			content: uc(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Vm({
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
			let n = Um(t, e.caller);
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
var gh = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, _h = 32, vh = 10, yh = 9, bh = 13, xh = 160, Sh = 6158, Ch = 8192, wh = 8203, Th = 8239, Eh = 8287, Dh = 12288, Oh = 65279;
function kh(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Ah(e) {
	return e >= "0" && e <= "9";
}
function jh(e) {
	return e >= " ";
}
function Mh(e) {
	return ",:[]/{}()\n+".includes(e);
}
function Nh(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Ph(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Fh = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Ih = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function Lh(e) {
	return ",[]/{}\n+".includes(e);
}
function Rh(e) {
	return Wh(e) || zh.test(e);
}
var zh = /^[[{\w-]$/;
function Bh(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function Vh(e, t) {
	let n = e.charCodeAt(t);
	return n === _h || n === vh || n === yh || n === bh;
}
function Hh(e, t) {
	let n = e.charCodeAt(t);
	return n === _h || n === yh || n === bh;
}
function Uh(e, t) {
	let n = e.charCodeAt(t);
	return n === xh || n === Sh || n >= Ch && n <= wh || n === Th || n === Eh || n === Dh || n === Oh;
}
function Wh(e) {
	return Gh(e) || qh(e);
}
function Gh(e) {
	return e === "\"" || e === "“" || e === "”";
}
function Kh(e) {
	return e === "\"";
}
function qh(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function Jh(e) {
	return e === "'";
}
function Yh(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function Xh(e, t) {
	let n = e.length;
	if (!Vh(e, n - 1)) return e + t;
	for (; Vh(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function Zh(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function Qh(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var $h = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function eg(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = $h[n];
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
function tg(e) {
	return e !== null && e.char === "\"";
}
function ng(e) {
	return e !== null && e.char === "'";
}
function rg(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function ig(e, t) {
	switch (t) {
		case ")": return rg(e, "(") > rg(e, ")");
		case "]": return rg(e, "[") > rg(e, "]");
		case "}": return rg(e, "{") > rg(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var ag = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, og = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function sg(e) {
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
	for (r && a(), Rh(e[t]) && Qh(n) ? (r || (n = Xh(n, ",")), g()) : r && (n = Yh(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	T();
	function i() {
		a();
		let e = m() || h() || _() || y() || b() || ee(!1) || S();
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
		let i = r ? Vh : Hh, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (Uh(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !cg(e, t);) t++;
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
			if (Nh(e[t])) for (; t < e.length && Ph(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = Xh(n, ",")), a()), p(), !(_() || ee(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = Yh(n, ",")) : re();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (Rh(e[t]) || c ? n = Xh(n, ":") : ie()), i() || (s || c ? n += "null" : ie()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = Xh(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = Xh(n, ",")), p(), !i()) {
					r || (n = Yh(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = Xh(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = Xh(n, ",")), t = i();
		t || (n = Yh(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, Wh(e[t]) || T());
		let s = e[t] === "&" ? eg(e.slice(t, t + 12)) : null, c = tg(s) || ng(s);
		if (Wh(e[t]) || c) {
			let l = Kh(e[t]) ? Kh : Jh(e[t]) ? Jh : qh(e[t]) ? qh : Gh, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = C(t - 1);
					return !r && Mh(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = Xh(p, "\""), n += p, !0);
				}
				if (t === i) return p = Xh(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? eg(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Mh(e[t]) && !ig(p, e[t]) || Wh(e[t]) && !w(t) || Ah(e[t])) return v(), !0;
					e[t] === "\\" && T();
					let s = C(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Mh(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && Lh(e[t])) {
					if (e[t - 1] === ":" && Fh.test(e.substring(u + 1, t + 2))) for (; t < e.length && Ih.test(e[t]);) p += e[t], t++;
					return p = Xh(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : Bh(e) ? p += ag[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (og[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && kh(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ae();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : Bh(n) ? (p += ag[n], t++) : (jh(n) || ne(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = Yh(n, "\"", !0);
			let e = n.length;
			n = _() ? Zh(n, e, 1) : Xh(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Ah(e[t]) && te() && (i += "0")), e[t] === "0" && Ah(e[t + 1]) && (a = !0); Ah(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Ah(e[t]) || (i += "0"); Ah(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Ah(e[t]) || (i += "0"); Ah(e[t]);) i += e[t], t++;
			return te() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Ph(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function ee(r) {
		let a = t;
		if (Nh(e[t])) {
			for (; t < e.length && Ph(e[t]);) t++;
			let n = t;
			for (; Vh(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !Lh(e[t]) && !Wh(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Fh.test(e.substring(a, t + 2))) for (; t < e.length && Ih.test(e[t]);) t++;
		if (t > a) {
			for (; Vh(e, t - 1) && t > 0;) t--;
			let r = e.slice(a, t);
			return n += r === "undefined" ? "null" : JSON.stringify(r), e[t] === "\"" && t++, !0;
		}
	}
	function S() {
		if (e[t] === "/") {
			let r = t;
			for (t++; t < e.length && (e[t] !== "/" || e[t - 1] === "\\");) t++;
			return t++, n += JSON.stringify(e.substring(r, t)), !0;
		}
	}
	function C(t) {
		let n = t;
		for (; n > 0 && Vh(e, n);) n--;
		return n;
	}
	function w(t) {
		let n = t + 1;
		for (; n < e.length && Vh(e, n);) n++;
		return n >= e.length || Mh(e[n]);
	}
	function te() {
		return t >= e.length || Mh(e[t]) || Vh(e, t);
	}
	function ne(e) {
		throw new gh(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function T() {
		throw new gh(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function E() {
		throw new gh("Unexpected end of json string", e.length);
	}
	function re() {
		throw new gh("Object key expected", t);
	}
	function ie() {
		throw new gh("Colon expected", t);
	}
	function ae() {
		throw new gh(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function cg(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function lg(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function ug(e, t) {
	let n = lg(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(sg(n));
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
function dg(e, t, n, r) {
	let i = Dc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function fg(e) {
	let { ctx: t, caller: n } = e, r = Lm(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = ug(c(e), i);
		return s = a.value, n.schema ? dg(t, r, a.value, i) : Mc(a.value, {
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
		body: () => Vm(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var pg = (e, t) => ({
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
function mg(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function hg(e) {
	let { ctx: t, caller: n } = e, r = Lm(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = Bm(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = ug((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? dg(t, r, o.value, i) : Mc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => Vm(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = Um(e, n);
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
function gg(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Lm(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = Bm(e, o ? "parallel" : "multi", l), d = [
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
		let i = ug(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? dg(t, s, e, a) : Mc(e, {
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
			return Vm({
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
			let i = mg(e.toolCalls.filter((e) => e.name), r), o = Um(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(pg(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = zm(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: zm(t, a.tools.results.nudge, {
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
function _g(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return hh(e);
		case "structured": return fg(e);
		case "tool-single": return hg(e);
		case "tool-multi": return gg(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function vg(e, t) {
	let n = t ? c({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? f(n) : u(n);
}
var yg = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function bg(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, yg({
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
			})), a = () => n === null ? "" : (n = null, yg({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + yg({
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
				text: (e) => e ? o("text") + yg({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + yg({
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
					for (let i of e) t++, r = !0, n += yg({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + yg({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + yg({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => yg({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + yg({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + yg({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? yg({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? yg({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? yg({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: xg(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => yg({ error: { message: e } }),
			end: (e) => e ? yg({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? yg({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => yg({
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
			error: (e) => yg({ error: { message: e } }),
			end: (e) => yg({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? yg({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? yg({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? yg({ choices: [{
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
			error: (e) => yg({ error: { message: e } }),
			end: (e) => (e ? yg({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + yg("[DONE]")
		};
	}
}
function xg(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Sg(e, t) {
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
			input: xg(e.arguments)
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
					args: xg(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Cg(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function wg(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Tg(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Eg = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = wg(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Tg(t);
			if (r) {
				let t = this.open.has(e) ? Dg(this.value, n) : void 0;
				Og(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Dg(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Og(e, t, n) {
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
var kg = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Ag(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return kg(t) ? t : void 0;
}
function jg(e, t) {
	if (!kg(t)) return kg(e) ? e : void 0;
	if (!kg(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = kg(r) && kg(n[e]) ? jg(n[e], r) : r);
	return n;
}
function Mg(e, t) {
	if (!kg(t)) return kg(e) ? e : void 0;
	if (!kg(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : kg(r) && kg(t) ? n[e] = Mg(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var Ng = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Pg(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Fg = class {
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
				args: new Eg()
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
function Ig(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function Lg(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* Rg(e, t) {
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
async function* zg(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Pg(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Ng(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Fg();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Pg(t);
		if (n) throw new Ng(n);
		i.text = Ig(t), i.reasoning = Lg(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Ag(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of Rg(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Pg(e);
		if (r) throw new Ng(r);
		i.text += l(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Ag(e);
		c && (i.usage = jg(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var Bg = /* @__PURE__ */ an({ current: null });
function Vg(e, t) {
	return Bg.current = {
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
	}, Bg.current;
}
function Hg(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var Ug = "/api/backends/chat-completions/generate", Wg = { pending: null }, Gg = (e) => e?.name === "AbortError";
function Kg(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? X("error.toolsUnsupported") : null;
}
async function qg(e, t, n) {
	let r = vg(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = Kg(e);
	if (a) return h("error", a, "Advanced Preset"), Cg(a, 400);
	let o = e.origin === "task" ? Fm(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = Vg(e, i);
	if (!i) try {
		let i = await Xg(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(Sg(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return Yg(c, e);
	}
	let l = bg(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await Xg(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			Gg(e) || (await p(l.error(Jg(e))), Yg(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var Jg = (e) => e instanceof Error ? e.message : String(e);
function Yg(e, t) {
	return e.status = Gg(t) ? "aborted" : "error", e.error = Jg(t), t instanceof Ng ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Cg(Jg(t));
}
async function Xg(t, n, r, i, a, o) {
	let s = String(n.chat_completion_source ?? ""), l = _g({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: vg(s, n)
	}), u = fc(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, m = t.structures.some((e) => e.kind === "annotations") ? (e) => sd(e, { final: !1 }).text : (e) => e, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, _ = Date.now(), v = "", y, b = 0, x = !1, ee, S;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), s = Qp({
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
			let n = await g(Ug, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), f = 0;
			for await (let e of zg(n, c(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - f < 50) continue;
				f = t;
				let n = l.progress(e, !1);
				if (Hg(i, n, v + e.reasoning), p && d) {
					let e = n.stages[d]?.text ?? "";
					e && o(m(e.slice(0, e.length - Vs(e))).trimEnd());
				}
			}
			Qm(t), s.response = u.text || JSON.stringify(u.toolCalls), s.durationMs = Date.now() - s.at, s.usage = u.usage;
		} catch (e) {
			if (s.error = Jg(e), Gg(e) || a?.aborted) {
				(u.text || u.reasoning || u.toolCalls.length) && Qm(t), y = Mg(y, u.usage), x = !0, S = l.progress(u, !1);
				break;
			}
			throw e;
		}
		v += u.reasoning, y = Mg(y, u.usage), l.progress(u, !0);
		let f = l.complete(u, n);
		if (f.callerToolCalls) {
			ee = f.callerToolCalls.map((e) => ({
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
	if (x) for (let e of Object.values(C.stages)) e.status === "streaming" && (e.status = "interrupted");
	Hg(i, C, v);
	let w = Zg(t, C, l.rawText(), l.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - _,
		interrupted: x
	});
	return w.toolCalls = ee, w.usage = y, ee && (w.content = ""), i.status = x ? "aborted" : "done", w;
}
function Zg(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Ic(u, h);
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
			let t = sd(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = sd(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), ee = v("recap"), S = v("memory"), C = t.meta.mixed ? "meta-mixed" : "story", w = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? w = i === void 0 ? u || Hs(r).trim() : JSON.stringify(i) : u || (C = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", w = b ? ec(b) : "", !w && x && typeof n.structures[x.id] == "string" && (w = "…"), !w && ee && n.structures[ee.id] && (w = "…"))), !w && !o.interrupted) throw Error(X("error.emptyTurn"));
	let te = [], ne = [], T = t.interceptorRan && t.stType !== "quiet";
	if (T && S && Array.isArray(n.structures[S.id])) {
		let e = Df(n.structures[S.id]);
		te.push(...e.events), ne = e.global;
	}
	if (T && ee && typeof n.structures[ee.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		te.push({
			type: "recap.set",
			text: n.structures[ee.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let E = t.stages.map((e) => {
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
	}), re = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: C,
		stages: E,
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
	}, ie = {
		content: w,
		reasoning: a,
		sidecar: re,
		...ne.length ? { global: ne } : {}
	};
	return T ? Wg.pending = {
		ctx: t,
		outcome: ie,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: re
	}), Bg.current?.genId === t.id && (Bg.current.structures = n.structures), ie;
}
//#endregion
//#region src/core/fetch-gate.ts
var Qg = "__ap_gen_id";
function $g(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function e_() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	_(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL($g(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[Qg], r = typeof t == "string" ? _p.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[Qg], r.claimed = !0;
				try {
					return await qg(r, e, n.signal);
				} finally {
					_p.release(t);
				}
			}
			e && (delete e[Qg], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function t_(e) {
	let t = _p.takeArmed();
	t && (e[Qg] = t.id);
}
//#endregion
//#region src/app/memory-sync.ts
var n_ = "\0";
function r_(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = ff(e);
		r && t.add(`${n.presetId}${n_}${r}`);
	}
}
function i_(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && r_(r.extra?.[rf], t), r.swipe_info?.forEach((e, t) => {
			t !== i && r_(e?.extra?.[rf], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var a_ = null;
function o_(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = i_(n.chat ?? []), o = new Set(a);
	if (a_ && !t.reload && a_.chatId === r) for (let e of a_.active) i.has(e) || o.add(e);
	a_ = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(n_), i = s.get(n);
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
		n?.globalMemory && (df(n.globalMemory.log) && (l = !0), kf(n, t.off, !1) && (l = !0), kf(n, t.on, !0) && (l = !0));
	}
	return l && Y(), l;
}
function s_(e) {
	cf(e), o_();
}
function c_() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => s_(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => o_());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => o_({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var l_ = 6e5, u_ = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function d_(t, n) {
	let r = Wg.pending;
	if (!r || Date.now() - r.at > l_ || u_.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	Wg.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), sf(t, a.sidecar), a.global?.length && Of(Af(r.ctx.preset), a.global), o_(), Bg.current?.genId === r.ctx.id && (Bg.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var f_ = /* @__PURE__ */ new Set();
function p_(e) {
	for (let t of f_) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function m_(t) {
	let n = e().chat[t], r = af(n)?.annotations;
	return !n || !r?.length ? [] : dd(n.mes, r).annotations;
}
function h_(t) {
	let n = e().chat[t], r = af(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = dd(n.mes, r.annotations);
	return i.changed ? (sf(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function g_() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (h_(n) && e().saveChat(), p_(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => p_(Number(e)));
}
var __ = {
	get: (e) => m_(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return f_.add(t), () => f_.delete(t);
	}
}, v_ = "advancedPreset.reloadedFor";
async function y_() {
	try {
		let e = await g(`${s()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function b_(e) {
	sessionStorage.setItem(v_, e), h("info", X("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function x_() {
	let e = await y_();
	e && e !== "2deead37254c61fa" && sessionStorage.getItem(v_) !== e && b_(e);
}
async function S_() {
	await x_();
}
async function C_() {
	let e = o().replace(/^third-party\//, ""), t = await w_(e, !1);
	if (t.status === 404 && (t = await w_(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await y_();
	return r && r !== "2deead37254c61fa" ? (b_(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var w_ = (t, n) => g("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
});
//#endregion
//#region src/store/bundled-modules.ts
function T_(e, t, n, r) {
	return Xu({
		...hl(hd(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function E_(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of pd(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = T_(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = bd(o), u = yd(c), d = n?.[o.id];
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
		let f = yd(s);
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
function D_(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function O_(e, t, n = []) {
	let r = Af(e), i = Lp(e), a = { ...t.records };
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
function k_(e, t, n) {
	let r = pd(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && T_(e, i, n, t.enabled);
		if (i && a && yd(a) === yd(t)) {
			let { enabled: e, ...n } = hl(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return _d(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function A_(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var j_ = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
//#endregion
//#region src/app/bundled-modules.ts
function M_(e, t, n) {
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
async function N_(e, t) {
	let { root: n, checked: r } = M_(X("um.bundled.conflictTitle"), X("um.bundled.conflictBody", { name: ef(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: X(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await m(n, X("um.bundled.apply"), X("um.bundled.keepAll")) ? r() : [];
}
async function P_(e, t) {
	let n = Af(e), r = E_(e, Lp(e), n.bundledModules, Qd());
	if (D_(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await N_(e, a)), O_(e, r, i), r.add.length && h("info", X("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), ef(e));
}
var F_ = /* @__PURE__ */ new Map();
function I_(e, t = {}) {
	let n = e.id, r = (F_.get(n) ?? Promise.resolve()).then(() => P_(Gd(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return F_.set(n, r), r;
}
async function L_(e) {
	let t = Lp(e), n = [];
	if (t.length) {
		let { root: r, checked: i } = M_(X("um.bundled.exportTitle", { name: ef(e) }), X("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || X("um.untitled"),
			...e.enabled ? {} : { note: X("um.bundled.disabled") },
			checked: !0
		})));
		if (!await m(r, X("um.bundled.export"), X("common.cancel"))) return !1;
		let a = i();
		n = t.filter((e) => a.includes(e.id));
	}
	return A_(`${j_(e.id)}.apreset.json`, k_(e, n, Qd())), !0;
}
//#endregion
//#region src/app/dev-source.ts
var R_ = /* @__PURE__ */ an({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), z_ = 1500, B_ = null;
async function V_() {
	let { url: e, enabled: t } = J().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await g(`${n}/`, { cache: "no-store" })).json();
		if (R_.status = "online", R_.error = e.ok === !1 ? "build failed" : "", R_.at = Date.now(), !e.hash || e.hash === R_.hash) return;
		let t = Bd(await (await g(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		R_.presetId && R_.presetId !== t.id && Jd(null, R_.presetId), Jd(t), R_.presetId = t.id, R_.hash = t.hash, Uf(t), await ep(t), I_(t, { auto: !0 }), Zp("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		R_.status = "error", R_.error = e instanceof Error ? e.message : String(e);
	}
}
function H_() {
	if (B_ && clearTimeout(B_), B_ = null, !J().dev.enabled) {
		R_.presetId && Jd(null, R_.presetId), Object.assign(R_, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	R_.status === "off" && (R_.status = "connecting");
	let e = async () => {
		await V_(), J().dev.enabled && (B_ = setTimeout(e, z_));
	};
	e();
}
function U_() {
	cr(() => [J().dev.enabled, J().dev.url], () => {
		R_.hash = "", H_();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var W_ = "#option_impersonate, #mes_impersonate", G_ = () => document.querySelector("#send_textarea");
function K_(e, t = !1) {
	let n = G_();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function q_() {
	if (!J().enabled) return null;
	let t = Yf(), n = t ? Gd(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Nf(n);
	if (!cp(r)) return null;
	let i = Ps(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Xl(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function J_(e) {
	if (!e.target?.closest?.(W_)) return;
	let t = q_();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = G_()?.value.trim();
	K_(n ? `${t}\n${n}` : t, !0);
}
function Y_() {
	window.addEventListener("click", J_, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function X_(e) {
	let t = Ec(e);
	if (!t) return !1;
	let n = J().presets[e.id]?.customUi, r = Hd(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function Z_(e) {
	let t = J().presets[e.id]?.customUi;
	return !!(t && t.hash === Ec(e));
}
function Q_(e, t) {
	Af(e).customUi = {
		enabled: t,
		hash: Ec(e)
	}, Y();
}
//#endregion
//#region src/app/trust.ts
var $_ = class extends Error {
	constructor() {
		super(X("trust.declined")), this.name = "TrustDeclined";
	}
}, ev = (e) => e instanceof $_, tv = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function nv(e, t, n, r) {
	return [
		`<h3>${p(e)}</h3>`,
		`<p>${p(X("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${p(X("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${p(r)}</pre>`
	].join("");
}
var rv = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function iv(e, t) {
	let n = ml(e);
	if (!n.length || t && tv(n, ml(t))) return;
	let r = ef(e);
	if (!await m(nv(X("trust.presetTitle"), X("trust.preset", { name: r }), n.length, rv(n)), X("trust.install"), X("common.cancel"))) throw new $_();
}
async function av(e) {
	let t = zu(e);
	if (t.length && !await m(nv(X("trust.modulesTitle"), X("trust.modules", { n: e.length }), t.length, rv(t)), X("trust.import"), X("common.cancel"))) throw new $_();
}
async function ov(e) {
	let t = wc(e);
	if (!t.length) return !1;
	let n = t.map((t) => Z(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(X("common.listSeparator")), r = await m([
		`<h3>${p(X("trust.uiTitle"))}</h3>`,
		`<p>${p(X("trust.uiBody", {
			name: ef(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${p(X("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${p(rv(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), X("trust.enableUi"), X("trust.notNow"));
	return Q_(e, r), r;
}
async function sv(e) {
	wc(e).length && !Z_(e) && await ov(e);
}
//#endregion
//#region src/app/install.ts
function cv(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function lv(e, t) {
	let n = Bd(e);
	if (!n) throw Error(X("presets.invalid"));
	if (n.minAdvancedPreset && _l("1.10.0", n.minAdvancedPreset) < 0) throw Error(X("presets.tooNew", { version: n.minAdvancedPreset }));
	await iv(n, Gd(n.id)), Kd(n), t && (J().sources[n.id] = t), Y();
	let r = Gd(n.id) ?? n;
	return Uf(r), Hd(r.id)?.source === "installed" && await sv(r), await ep(r), await I_(r), r;
}
async function uv(e) {
	let t = await g(cv(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return lv(await t.json(), e.trim());
}
async function dv(e) {
	return lv(JSON.parse(await e.text()));
}
async function fv(t) {
	if (qd(t), delete J().sources[t], Y(), Yd(t)) {
		let e = Gd(t);
		e && (Uf(e), await ep(e), await I_(e));
		return;
	}
	let n = Qf(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/state.ts
var pv = /* @__PURE__ */ an({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), mv = () => {
	pv.chatRev++;
}, hv = () => {
	pv.presetId = Yf();
}, gv = q(() => pv.presetId ? Gd(pv.presetId) : void 0), _v = q(() => {
	let e = gv.value;
	if (!e) return { config: "" };
	let t = Af(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Z(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function vv(t) {
	return pv.chatRev, e().chat[t];
}
function yv(e) {
	return af(vv(e));
}
function bv(e) {
	e && (pv.tab = e), pv.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var xv = "openai_preset_import_file", Sv = "export_oai_preset";
function Cv(e) {
	return typeof e == "object" && !!e && typeof e.id == "string" && Array.isArray(e.entries);
}
var wv = /* @__PURE__ */ new WeakSet();
async function Tv(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (Cv(n)) {
		e.value = "";
		try {
			let e = await lv(n);
			await tp(e), hv(), h("success", X("presets.installed"), ef(e)), bv("presets");
		} catch (e) {
			ev(e) ? h("info", e.message, X("app.name")) : h("error", e instanceof Error ? e.message : String(e), X("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		wv.add(t), e.dispatchEvent(t);
	}
}
function Ev() {
	let e = Yf(), t = e ? Gd(e) : void 0;
	return t ? (L_(t).catch((e) => h("error", e instanceof Error ? e.message : String(e), X("app.name"))), !0) : !1;
}
function Dv() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== xv || wv.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), Tv(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${Sv}`) && Ev() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var Ov = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", kv = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", Av = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:center;gap:2px var(--ap-space-3);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-wrap:wrap;display:flex}.status-bar>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-edit{margin:-2px -6px -2px auto}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}", jv = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>svg.lucide{width:1em;height:1em}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text{field-sizing:content;min-height:5.5em;max-height:24em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:minmax(5em,36%) 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row.list{grid-template-columns:1fr auto}.um-var-key{text-overflow:ellipsis;min-width:0;font-weight:600}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:1.15em}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}", Mv = /* @__PURE__ */ an({ mode: "light" }), Nv = new CSSStyleSheet();
Nv.replaceSync([
	Ov,
	kv,
	Av,
	jv
].join("\n"));
var Pv = new CSSStyleSheet(), Fv = [Nv, Pv], Iv = [
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
function Lv(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of Iv) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function Rv(e) {
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
function zv() {
	let e = Rv(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var Bv = /* @__PURE__ */ new Set();
function Vv(e) {
	return Bv.add(e), e.dataset.apTheme = Mv.mode, () => Bv.delete(e);
}
function Hv() {
	let e = zv();
	if (e !== Mv.mode) {
		Mv.mode = e;
		for (let t of Bv) t.dataset.apTheme = e;
	}
}
function Uv() {
	Mv.mode = zv();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(Hv);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), or(() => {
		let e = gv.value?.theme?.[Mv.mode] ?? {}, t = J().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(Lv(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(Lv("primary", t.primary)), t.accent && n.push(Lv("accent", t.accent)), Pv.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function Wv(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function Gv(e, t, n = []) {
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
			e.adoptedStyleSheets = Fv, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = Vv(this), this.app = ps(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var Kv = 6, qv = 8;
function Jv(e, t, n, r = "center", i = !1) {
	let a = e.top - Kv - t.height >= qv, o = e.bottom + Kv + t.height <= n.height - qv, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - Kv - t.height : e.bottom + Kv;
	c = Math.max(qv, Math.min(c, n.height - qv - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(qv, Math.min(l, n.width - qv - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function Yv(e, t) {
	let n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = Jv(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return cr(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Hn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Hr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var Xv = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), Zv = /* @__PURE__ */ new Set([
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
]), Qv = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function $v(e) {
	return Qv(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function ey(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${$v(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${$v(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${$v(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function ty(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = ty(e, t);
			n && i.appendChild(n);
		}
	};
	if (!Xv.has(r) && !Zv.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = ty(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function ny(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return ey(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", ey(e.textContent));
			continue;
		}
		let t = ty(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function ry(e, t, n, r) {
	return e && $d(e)?.workflows?.[t]?.stages?.[n] || r;
}
function iy(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return Wv(e?.actors[t]?.color, n);
}
function ay(e) {
	return q(() => {
		let t = e(), n = yv(t), r = Bg.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Gd(r.presetId);
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
					label: ry(e, r.workflow, t.id, t.label),
					color: iy(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = Gd(n.presetId);
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
				label: ry(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: iy(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var oy = /* @__PURE__ */ an({
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
}), sy, cy, ly = null;
function uy(t) {
	let n = Gd(af(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = Xl(n, Nf(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: iy(n, n.narrator)
	};
}
function dy(e, t) {
	clearTimeout(sy), clearTimeout(cy), cy = void 0, ly = null, oy.key !== e.key && Object.assign(oy, uy(e.mesId), { html: ny(e.ann.comment) }), Object.assign(oy, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), oy.rev++;
}
function fy() {
	clearTimeout(sy), clearTimeout(cy), cy = void 0, ly = null, oy.open && (oy.open = !1, oy.pinned = !1, oy.key = null);
}
function py(e) {
	if (!oy.pinned) {
		if (e) {
			if (oy.open && oy.key === e.key) {
				clearTimeout(cy), cy = void 0;
				return;
			}
			if (ly === e.key) return;
			clearTimeout(sy), ly = e.key, sy = setTimeout(() => dy(e, !1), 150);
		} else clearTimeout(sy), ly = null, gy();
	}
}
function my(e) {
	e && !(oy.open && oy.key === e.key) ? dy(e, !0) : fy();
}
function hy() {
	clearTimeout(cy), cy = void 0;
}
function gy() {
	!oy.open || oy.pinned || cy || (cy = setTimeout(fy, 200));
}
function _y(e) {
	oy.key && e.has(oy.key) && fy(), ly && e.has(ly) && (clearTimeout(sy), ly = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var vy = {
	key: 0,
	class: "anno-author"
}, yy = ["innerHTML"], by = /* @__PURE__ */ L({
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
			let r = e.getBoundingClientRect(), i = oy.rect, a = Jv(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return cr(() => oy.open && oy.rev, async (e) => {
			if (!e) return;
			await Hn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Hr(() => {
			oy.open = !1;
		}), (e, n) => P(oy).open ? (B(), V("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: ke({ "--actor": P(oy).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => P(hy) && P(hy)(...e),
			onMouseleave: n[1] ||= (...e) => P(gy) && P(gy)(...e)
		}, [P(oy).author ? (B(), V("div", vy, j(P(oy).author), 1)) : K("", !0), U("div", {
			class: "rich anno-text",
			innerHTML: P(oy).html
		}, null, 8, yy)], 36)) : K("", !0);
	}
}), xy = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, Sy = /\s/, Cy = /[“”„‟〝〞＂「」]/, wy = /[‘’‚‛『』＇]/;
function Ty(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!xy.test(i)) {
			if (Sy.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else Cy.test(i) ? i = "\"" : wy.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var Ey = (e) => Ty(e).text;
function Dy(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function Oy(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function ky(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function Ay(e, t, n, r = Ty(e)) {
	let i = Ey(n.quote).trim();
	if (!i) return null;
	let a = Dy(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = Ey(n.prefix), s = Ey(n.suffix), c = 0, l = a.map((t) => {
			let n = Oy(e, r.text.slice(Math.max(0, t - e.length), t)) + ky(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = Dy(Ey(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function jy(e, t, n = !1) {
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
var My = /* @__PURE__ */ new Set([
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
function Ny(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (My.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = Ny(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function Py(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? My.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && Ny(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function Fy(e, t, n) {
	let r = Py(e), i = r.map((e) => e.data), a = i.join(""), o = Ty(a), s = [];
	for (let e of n) {
		let n = Ay(a, t, e, o);
		n && s.push({
			ann: e,
			start: jy(i, n[0]),
			end: jy(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function Iy(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var Ly = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function Ry(e, t) {
	let n = [...e.located].sort((e, t) => Ly(e.start, t.start) ? 1 : Ly(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && Ly(r, i.end))) {
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
function zy(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var By = "ap-anno", Vy = "ap-anno-style", Hy = /* @__PURE__ */ new Map(), Uy = 0, Wy = "#a855f7", Gy = () => null;
function Ky(e) {
	Gy = e;
}
function qy() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${Wy}; }
::highlight(${By}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function Jy(e) {
	let t = e.getElementById(Vy);
	t || (t = e.createElement("style"), t.id = Vy, (e.head ?? e.documentElement).append(t)), t.textContent !== qy() && (t.textContent = qy());
}
function Yy(e) {
	if (e !== Wy) {
		Wy = e;
		for (let e of nb()) Jy(e.doc);
	}
}
function Xy(e, t) {
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
var Zy = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function Qy(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => Zy(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: Xy(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (Zy(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: Xy(n, e.doc)
			};
		}
	}
	return null;
}
function $y(e) {
	let t = Gy();
	return !!(t && e.composedPath().includes(t));
}
function eb(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !$y(r) && py(Qy(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if ($y(t)) return;
		let n = Qy(e, t);
		i === "mouse" ? n || fy() : my(n);
	}, c = (e) => {
		$y(e) || fy();
	}, l = () => py(null);
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
function tb(e) {
	let t = Hy.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(By) ?? new i(), r.set(By, a)), Jy(e), t = {
		doc: e,
		serial: ++Uy,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = eb(t), Hy.set(e, t), t;
}
function nb() {
	for (let [e, t] of Hy) e.defaultView || (t.detach(), Hy.delete(e));
	return [...Hy.values()];
}
function rb(e) {
	tb(e);
}
function ib(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function ab(e, t, n, r, i) {
	let a = ob(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = tb(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = Iy(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			Ry(r, (t, r) => {
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
	a.size && _y(a);
}
function ob(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [Hy.get(t)].filter((e) => !!e) : nb()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && zy(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), Hy.delete(i.doc));
		}
	}
	return r;
}
function sb(e, t) {
	let n = ob(e, t);
	n.size && _y(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var cb = /* @__PURE__ */ new Set();
function lb(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var ub = () => J().ui.annotations?.show !== !1, db = class {
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
		}), cb.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && sb(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && sb(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			sb(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = Bg.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && ub() ? m_(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		ab(this, document, t, a.length ? Fy(this.el, o, a) : null, !ib(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (ab(this, n, t, a.length && !lb(n) ? Fy(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), sb(this), cb.delete(this);
		}
	}
};
function fb(e, t) {
	for (let n of cb) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function pb() {
	for (let e of cb) e.hasFrames && e.schedule(0);
}
function mb() {
	for (let e of cb) e.el.isConnected || e.dispose();
}
var hb = /* @__PURE__ */ new WeakMap();
function gb(e) {
	let t = hb.get(e);
	(!t || t.disposed) && hb.set(e, new db(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var _b = () => window.__TAURITAVERN__?.api?.chatSurface, vb = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return _b()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), yb = !1;
function bb() {
	let t = _b();
	!yb && t && vb() && (t.protocolVersion === 1 ? (yb = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new db(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function xb(e, t) {
	t && !vb() && gb(e);
}
var Sb = null;
function Cb() {
	return (!Sb || !Sb.isConnected) && (Sb = document.createElement("ap-anno-bubble"), document.body.append(Sb)), Sb;
}
function wb() {
	Gv("ap-anno-bubble", by), Cb(), Ky(() => Sb), rb(document), or(() => {
		let e = J().ui, t = gv.value?.theme?.[Mv.mode]?.accent;
		Yy(e.annotations?.color || e.accent || t || (Mv.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), cr(ub, () => {
		fy(), fb(void 0, 0);
	}), cr(() => Bg.current?.status, () => fb()), __.on("change", (e) => fb(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		fy(), mb();
	});
	t.on("message_iframe_render_ended", () => pb()), addEventListener("resize", () => fy());
}
//#endregion
//#region src/ui/mounts.ts
var Tb = "ap-hidden", Eb = [
	"meta-pure",
	"impersonate",
	"summary"
];
function Db(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function Ob(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = af(a), s = Bg.current?.mesId === n;
	a && !a.is_user && xb(i, !!(o?.annotations?.length || s));
	let c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-top-cards"), d = r.querySelector(":scope > ap-cards");
	c ? ((!u || u.nextElementSibling !== i) && (u?.remove(), u = Db("ap-top-cards", n), u.setAttribute("position", "top"), i.before(u)), (!l || l.nextElementSibling !== u) && (l?.remove(), l = Db("ap-stages", n), u.before(l)), (!d || d.previousElementSibling !== i) && (d?.remove(), d = Db("ap-cards", n), i.after(d)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), i.classList.toggle(Tb, !!(!s && o && Eb.includes(o.turn)))) : (l?.remove(), u?.remove(), d?.remove(), i.classList.remove(Tb));
}
function kb(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) Ob(t);
}
function Ab() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var jb = 0, Mb = /* @__PURE__ */ new Set(), Nb = !1;
function Pb(e) {
	e ? Mb.add(e) : Nb = !0, !jb && (jb = requestAnimationFrame(() => {
		if (jb = 0, Nb) kb();
		else for (let e of Mb) e.isConnected && Ob(e);
		Mb.clear(), Nb = !1, Ab(), mb();
	}));
}
function Fb() {
	mv(), Pb();
}
function Ib() {
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
	]) e && t.on(e, Fb);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Pb(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Pb(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Pb();
	};
	r();
	let i;
	cr(() => Bg.current && Bg.current.status === "running" && Bg.current.streaming && Bg.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = Bg.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), Fb());
		}, 100));
	}), cr(() => Bg.current?.status, () => Pb());
}
//#endregion
//#region src/ui/entry.ts
var Lb = "left-nav-panel", Rb = "ap-preset-banner";
function zb() {
	return document.getElementById(Lb);
}
function Bb() {
	let e = zb();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function Vb() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== Rb && e.after(document.createElement(Rb));
}
var Hb = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function Ub() {
	cr(() => pv.presetId, (e) => {
		for (let t of document.querySelectorAll(Hb.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function Wb(e) {
	let t = zb();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function Gb() {
	let e = zb();
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
function Kb() {
	Vb(), Ub(), Gb(), cr(() => pv.panelOpen, (e) => {
		e && Bb();
	});
	let e = zb();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (pv.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var qb = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Jb = (e) => e === "", Yb = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Xb = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Zb = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Qb = (e) => {
	let t = Zb(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, $b = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, ex = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = $b.width, color: s = $b.stroke, ...c }, { slots: l }) => Ra("svg", {
	...$b,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Jb(n) || Jb(r) || n === !0 || r === !0 ? Number(i || a || $b["stroke-width"]) * 24 / Number(o) : i || a || $b["stroke-width"],
	class: Yb("lucide", c.class, ...e ? [`lucide-${Xb(Qb(e))}-icon`, `lucide-${Xb(e)}`] : ["lucide-icon"]),
	...!l.default && !qb(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Ra(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Ra(ex, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), tx = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), nx = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), rx = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), ix = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), ax = Q("braces", [["path", {
	d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
	key: "ezmyqa"
}], ["path", {
	d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
	key: "e1hn23"
}]]), ox = Q("brain", [
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
]), sx = Q("bug", [
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
]), cx = Q("cable", [
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
]), lx = Q("calendar-days", [
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
]), ux = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), dx = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), fx = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), px = Q("circle-dashed", [
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
]), mx = Q("circle-question-mark", [
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
]), hx = Q("circle-slash", [["circle", {
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
}]]), gx = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), _x = Q("cloud-fog", [
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
]), vx = Q("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), yx = Q("cloud-rain", [
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
]), bx = Q("cloud-sun", [
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
]), xx = Q("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), Sx = Q("code-xml", [
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
]), Cx = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), wx = Q("coins", [
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
]), Tx = Q("copy-plus", [
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
]), Ex = Q("copy", [["rect", {
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
}]]), Dx = Q("database-zap", [
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
]), Ox = Q("download", [
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
]), kx = Q("drama", [
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
]), Ax = Q("feather", [
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
]), jx = Q("file-down", [
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
]), Mx = Q("file-plus", [
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
]), Nx = Q("file-stack", [
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
]), Px = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), Fx = Q("git-compare-arrows", [
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
]), Ix = Q("globe", [
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
]), Lx = Q("grip-vertical", [
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
]), Rx = Q("info", [
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
]), zx = Q("layers", [
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
]), Bx = Q("layout-template", [
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
]), Vx = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), Hx = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Ux = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), Wx = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Gx = Q("message-square-dashed", [
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
]), Kx = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), qx = Q("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), Jx = Q("notebook-pen", [
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
]), Yx = Q("package", [
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
]), Xx = Q("palette", [
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
]), Zx = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), Qx = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), $x = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), eS = Q("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), tS = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), nS = Q("refresh-cw", [
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
]), rS = Q("regex", [
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
]), iS = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), aS = Q("save", [
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
]), oS = Q("scroll-text", [
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
]), sS = Q("server", [
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
]), cS = Q("shapes", [
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
]), lS = Q("sliders-horizontal", [
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
]), uS = Q("sliders-vertical", [
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
]), dS = Q("snowflake", [
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
]), fS = Q("sun", [
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
]), pS = Q("text-cursor-input", [
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
]), mS = Q("trash-2", [
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
]), hS = Q("triangle-alert", [
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
]), gS = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), _S = Q("upload", [
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
]), vS = Q("user-pen", [
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
]), yS = Q("wind", [
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
]), bS = Q("workflow", [
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
]), xS = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), SS = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), CS = /* @__PURE__ */ L({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = Yv(n, () => t);
		return (t, a) => (B(), V("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Yr(t.$slots, "default"), P(r) && e.text ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : K("", !0)], 544));
	}
}), wS = ["disabled", "aria-label"], $ = /* @__PURE__ */ L({
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
		return (t, n) => (B(), H(CS, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: F(() => [U("button", {
				type: "button",
				class: A(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(B(), H(Gr(e.icon)))], 10, wS)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), TS = {
	key: 0,
	class: "patches"
}, ES = { class: "patch-old pre" }, DS = { class: "patch-new pre" }, OS = {
	key: 0,
	class: "patch-status xs"
}, kS = {
	key: 2,
	class: "faint small stage-empty"
}, AS = /* @__PURE__ */ L({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null);
		cr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Hn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (B(), V("div", {
			class: "stage-body",
			style: ke({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (B(), V("div", TS, [(B(!0), V(z, null, R(e.stage.patches, (e, t) => (B(), V("div", {
			key: t,
			class: A(["patch", { failed: r(e.status) }])
		}, [
			U("div", ES, j(e.old_string), 1),
			W(P(tx), { class: "patch-arrow" }),
			U("div", DS, j(e.new_string), 1),
			r(e.status) ? (B(), V("div", OS, [W(P(rx)), G(j(P(X)(`patch.${e.status}`)), 1)])) : K("", !0)
		], 2))), 128))])) : e.stage.text ? (B(), V("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, j(e.stage.text), 513)) : (B(), V("div", kS, j(P(X)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function jS(t) {
	let n = e().chat[t], r = af(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), sf(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), mv();
}
async function MS(t, n, r) {
	let i = e().chat[t], a = af(i);
	return !i || !a ? !1 : (sf(t, of(a, n, r)), mv(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var NS = { class: "stage-bar" }, PS = ["onClick"], FS = { class: "ellipsis" }, IS = {
	key: 0,
	class: "chip stage-chip error"
}, LS = { class: "ellipsis" }, RS = { class: "badge warn" }, zS = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, BS = /* @__PURE__ */ L({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = ay(() => t.mesid), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = q(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = q(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = q(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = q(() => o.value.find((e) => e.id === s.value) ?? null);
		cr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = J().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: Jx,
			content: Ax,
			patch: Fx
		}, d = (e) => e.status === "streaming" ? Hx : e.status === "interrupted" ? hx : e.status === "missing" ? px : u[e.kind], f = q(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = q(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = q(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${X(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(X("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => P(n) && (o.value.length || P(n).error) ? (B(), V("div", {
			key: 0,
			class: A(["stages", { live: P(n).running }])
		}, [U("div", NS, [
			(B(!0), V(z, null, R(o.value, (e) => (B(), V("button", {
				key: e.id,
				type: "button",
				class: A(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: ke({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(B(), H(Gr(d(e)), { class: A({ spin: e.status === "streaming" }) }, null, 8, ["class"])), U("span", FS, j(e.label), 1)], 14, PS))), 128)),
			P(n).error ? (B(), V("span", IS, [W(P(hS)), U("span", LS, j(P(n).error), 1)])) : K("", !0),
			r[1] ||= U("span", { class: "grow" }, null, -1),
			f.value.length ? (B(), H(CS, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: F(() => [U("span", RS, [W(P(hS)), G(j(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : K("", !0),
			p.value ? (B(), H($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? P(gS) : P(tS),
				label: p.value.patchesApplied ? P(X)("stages.revertDraft") : P(X)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => P(jS)(e.mesid)
			}, null, 8, ["icon", "label"])) : K("", !0),
			P(n).running ? K("", !0) : (B(), H(CS, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: F(() => [U("span", zS, [W(P(Rx))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (B(), H(AS, {
			key: c.value.id,
			stage: c.value,
			follow: P(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : K("", !0)], 2)) : K("", !0);
	}
}), VS = {
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
	annotations: null
};
function HS(e) {
	let t = VS[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function US(e, t) {
	return e.flatMap((e, n) => {
		let r = HS(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var WS = { class: "reply-name xs" }, GS = ["innerHTML"], KS = /* @__PURE__ */ L({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = q(() => ny(t.text));
		return (t, r) => (B(), V("div", {
			class: "reply-card",
			style: ke({ "--actor": e.color })
		}, [U("div", WS, j(e.name), 1), U("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, GS)], 4));
	}
}), qS = { class: "card mini-card" }, JS = { class: "card-head" }, YS = { class: "card-title" }, XS = { class: "card-body pre" }, ZS = /* @__PURE__ */ L({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (B(), V("div", qS, [U("header", JS, [
			W(P(vS), { class: "section-icon" }),
			U("span", YS, j(P(X)("cards.impersonate")), 1),
			U("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => P(K_)(e.text)
			}, [W(P(pS)), G(j(P(X)("cards.fillInput")), 1)])
		]), U("div", XS, j(e.text), 1)]));
	}
}), QS = ["aria-label"], $S = ["title", "onClick"], eC = { class: "option-label" }, tC = { class: "option-content small muted" }, nC = /* @__PURE__ */ L({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => K_(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (B(), V("div", {
			class: "options-grid",
			role: "list",
			"aria-label": P(X)("cards.options")
		}, [(B(!0), V(z, null, R(e.options, (e, n) => (B(), V("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: P(X)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [U("span", eC, j(e.label), 1), U("span", tC, j(e.content), 1)], 8, $S))), 128))], 8, QS));
	}
}), rC = {
	key: 0,
	class: "memory-ops"
}, iC = { class: "ellipsis" }, aC = ["aria-label", "onClick"], oC = /* @__PURE__ */ L({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = q(() => {
			let e = Af(t.preset), n = e.globalMemory.log;
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
					let r = ff(t), i = r ? pf(e, r) : -1, a = n[i];
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
			e.id !== void 0 && Ef(Af(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (B(), V("div", rC, [(B(!0), V(z, null, R(n.value, (e, t) => (B(), H(CS, {
			key: t,
			text: e.op === "delete" ? P(X)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: F(() => [U("span", { class: A(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(B(), H(Gr(e.scope === "global" ? P(Ix) : P(Wx)), { class: "faint" })),
				U("span", iC, j(e.key), 1),
				(B(), H(Gr(e.op === "delete" ? P(mS) : P(Qx)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (B(), V("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": P(X)("common.undo"),
					onClick: (t) => r(e)
				}, [W(P(gS))], 8, aC)) : K("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : K("", !0);
	}
}), sC = ["aria-label"], cC = /* @__PURE__ */ L({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = Yv(n, () => t);
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
			onClick: a[0] ||= ss((e) => r.value = !P(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [W(P(mx))], 40, sC), P(r) ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : K("", !0)], 544)) : K("", !0);
	}
}), lC = { class: "card-title" }, uC = {
	key: 0,
	class: "card-body"
}, dC = /* @__PURE__ */ L({
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
		return (n, r) => (B(), V("section", { class: A(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [U("header", {
			class: A(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (B(), H(Gr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : K("", !0),
			U("span", lC, j(e.title), 1),
			W(cC, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			U("span", {
				class: "row",
				onClick: r[0] ||= ss(() => {}, ["stop"])
			}, [Yr(n.$slots, "actions")]),
			e.collapsible ? (B(), H(P(dx), {
				key: 1,
				class: A(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : K("", !0)
		], 2), !e.collapsible || t.value ? (B(), V("div", uC, [Yr(n.$slots, "default")])) : K("", !0)], 2));
	}
}), fC = {
	key: 0,
	class: "badge neutral"
}, pC = { class: "pre small" }, mC = /* @__PURE__ */ L({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (B(), H(dC, {
			title: P(X)("cards.recap"),
			icon: P(oS),
			collapsible: "",
			open: !1
		}, {
			actions: F(() => [e.coversUpTo === void 0 ? K("", !0) : (B(), V("span", fC, "#0–" + j(e.coversUpTo), 1))]),
			default: F(() => [U("div", pC, j(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), hC = { class: "synopsis-fields" }, gC = { class: "synopsis-field" }, _C = ["placeholder", "aria-label"], vC = { class: "synopsis-field" }, yC = ["placeholder", "aria-label"], bC = ["placeholder", "aria-label"], xC = ["placeholder", "aria-label"], SC = { class: "synopsis-actions" }, CC = { class: "xs faint grow synopsis-keys" }, wC = {
	type: "submit",
	class: "btn primary sm-btn"
}, TC = { class: "synopsis-head" }, EC = { class: "synopsis-line small" }, DC = {
	key: 0,
	class: "row tight"
}, OC = {
	key: 1,
	class: "row tight"
}, kC = { class: "synopsis-event ellipsis" }, AC = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, jC = /* @__PURE__ */ L({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ an({
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
		}), d = q(() => l.some((e) => u()[e] !== (n.synopsis[e] ?? "")));
		function f() {
			let e = c.value;
			e && (e.style.height = "auto", e.style.height = `${e.scrollHeight + 2}px`);
		}
		async function p() {
			for (let e of l) o[e] = n.synopsis[e] ?? "";
			a.value = !0, await Hn(), f(), s.value?.focus();
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
			onSubmit: ss(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= ss(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= ss(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= ss(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= ss(() => {}, ["stop"])
		}, [
			U("div", hC, [U("label", gC, [W(P(gx), { class: "faint" }), I(U("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.time"),
				"aria-label": P(X)("cards.synopsis.time")
			}, null, 8, _C), [[Zo, o.time]])]), U("label", vC, [W(P(Ux), { class: "faint" }), I(U("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.location"),
				"aria-label": P(X)("cards.synopsis.location")
			}, null, 8, yC), [[Zo, o.location]])])]),
			I(U("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: P(X)("cards.synopsis.event"),
				"aria-label": P(X)("cards.synopsis.event")
			}, null, 8, bC), [[Zo, o.event]]),
			I(U("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: P(X)("cards.synopsis.summary"),
				"aria-label": P(X)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, xC), [[Zo, o.summary]]),
			U("div", SC, [
				U("span", CC, j(P(X)("cards.synopsis.keys")), 1),
				U("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, j(P(X)("common.cancel")), 1),
				U("button", wC, [W(P(ux)), G(j(P(X)("common.save")), 1)])
			])
		], 32)) : (B(), V("div", {
			key: 1,
			class: A(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [U("div", TC, [U("div", EC, [
			e.synopsis.time ? (B(), V("span", DC, [W(P(gx), { class: "faint" }), G(j(e.synopsis.time), 1)])) : K("", !0),
			e.synopsis.location ? (B(), V("span", OC, [W(P(Ux), { class: "faint" }), G(j(e.synopsis.location), 1)])) : K("", !0),
			U("span", kC, j(e.synopsis.event), 1)
		]), e.editable ? (B(), V("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= ss(() => {}, ["stop"])
		}, [W($, {
			icon: P(Qx),
			label: P(X)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : K("", !0)]), i.value && e.synopsis.summary ? (B(), V("div", AC, j(e.synopsis.summary), 1)) : K("", !0)], 2));
	}
}), MC = { class: "status-fields" }, NC = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], PC = { class: "synopsis-actions" }, FC = { class: "xs faint grow synopsis-keys" }, IC = {
	type: "submit",
	class: "btn primary sm-btn"
}, LC = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, RC = {
	key: 0,
	class: "row tight"
}, zC = {
	key: 1,
	class: "row tight"
}, BC = {
	key: 2,
	class: "row tight status-location"
}, VC = { class: "ellipsis" }, HC = {
	key: 3,
	class: "row tight"
}, UC = /* @__PURE__ */ L({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ an({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ N(), s = (e) => (n.status[e] ?? "").trim(), c = q(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, vx],
			[/雪|snow|sleet|blizzard/i, dS],
			[/雨|rain|drizzle|shower/i, yx],
			[/雾|霾|fog|mist|haze|smog/i, _x],
			[/风|wind|gale|breez/i, yS],
			[/阴|云|cloud|overcast/i, xx],
			[/夜|月|night|moon/i, qx],
			[/晴|sun|clear|fair/i, fS]
		], u = q(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? bx), d = () => Object.fromEntries(Us.map((e) => [e, a[e].trim()])), f = q(() => Us.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of Us) a[e] = n.status[e] ?? "";
			i.value = !0, await Hn(), o.value?.querySelector("input")?.focus();
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
			date: lx,
			weekday: lx,
			time: gx,
			location: Ux,
			weather: bx
		};
		return (t, n) => i.value ? (B(), V("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: ss(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= ss(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= ss(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= ss(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= ss(() => {}, ["stop"])
		}, [U("div", MC, [(B(!0), V(z, null, R(P(Us), (e) => (B(), V("label", {
			key: e,
			class: "synopsis-field"
		}, [(B(), H(Gr(_[e]), { class: "faint" })), I(U("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: P(X)(`cards.status.${e}`),
			"aria-label": P(X)(`cards.status.${e}`)
		}, null, 8, NC), [[Zo, a[e]]])]))), 128))]), U("div", PC, [
			U("span", FC, j(P(X)("cards.status.keys")), 1),
			U("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, j(P(X)("common.cancel")), 1),
			U("button", IC, [W(P(ux)), G(j(P(X)("common.save")), 1)])
		])], 544)) : (B(), V("div", LC, [
			c.value ? (B(), V("span", RC, [W(P(lx), { class: "faint" }), G(j(c.value), 1)])) : K("", !0),
			s("time") ? (B(), V("span", zC, [W(P(gx), { class: "faint" }), G(j(s("time")), 1)])) : K("", !0),
			s("location") ? (B(), V("span", BC, [W(P(Ux), { class: "faint" }), U("span", VC, j(s("location")), 1)])) : K("", !0),
			s("weather") ? (B(), V("span", HC, [(B(), H(Gr(u.value), { class: "faint" })), G(j(s("weather")), 1)])) : K("", !0),
			e.editable ? (B(), V("span", {
				key: 4,
				class: "synopsis-edit status-edit",
				onClick: n[4] ||= ss(() => {}, ["stop"])
			}, [W($, {
				icon: P(Qx),
				label: P(X)("cards.status.edit"),
				small: "",
				align: "end",
				onClick: p
			}, null, 8, ["icon", "label"])])) : K("", !0)
		]));
	}
}), WC = ["innerHTML"], GC = {
	key: 1,
	class: "kv-list small"
}, KC = { class: "pre" }, qC = /* @__PURE__ */ L({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = q(() => typeof t.value == "string" ? ny(t.value) : "");
		return (t, r) => (B(), H(dC, {
			title: e.title,
			icon: P(cS),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [typeof e.value == "string" ? (B(), V("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, WC)) : (B(), V("dl", GC, [(B(!0), V(z, null, R(e.value, (e, t) => (B(), V(z, { key: t }, [U("dt", null, j(t), 1), U("dd", KC, j(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), JC = /* @__PURE__ */ new Map();
function YC(e) {
	let t = JC.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => JC.delete(e)), JC.set(e, t);
	}
	return t;
}
function XC(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function ZC(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var QC = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function $C(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = Zc(e.code, QC(r));
			t.replaceChildren(...[ZC(e.style)].filter((e) => !!e));
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
	let i = XC(await YC(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[ZC(e.style)].filter((e) => !!e)), a = await i(t, r);
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
var ew = { class: "structure-component" }, tw = ["data-structure"], nw = {
	key: 0,
	class: "xs"
}, rw = /* @__PURE__ */ L({
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
		return Br(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await $C(t.component, r, t.context);
			});
		}), cr(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), cr(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await $C(e, r, t.context));
		})), Hr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (B(), V("div", ew, [U("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, tw), r.value ? (B(), V("div", nw, j(P(X)("cards.custom.error", { error: r.value })), 1)) : K("", !0)]));
	}
}), iw = /* @__PURE__ */ L({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = ay(() => t.mesid), r = q(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && Bg.current?.genId === e.genId ? Bg.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = X_(r), u = !(!i || e.live), d = hl(o);
			for (let { decl: n } of US(s, t.position)) {
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
						let i = Z(r, "structures", n.id, "title", n.title || n.id), o = Cc(n);
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
									name: ef(r),
									version: r.version
								},
								lang: Qd(),
								setValue: async (e) => u ? MS(f, s, e) : !1,
								fillInput: (e, t) => K_(String(e ?? ""), !!t)
							}
						});
						break;
					}
				}
			}
			return {
				preset: r,
				editable: u,
				narrator: Xl(r, Nf(r), r.narrator),
				color: iy(r, r.narrator),
				items: c
			};
		});
		return (t, n) => r.value?.items.length ? (B(), V("div", {
			key: 0,
			class: A(["cards", `cards-${e.position}`])
		}, [(B(!0), V(z, null, R(r.value.items, (t) => (B(), V(z, { key: t.id }, [t.type === "reply" ? (B(), H(KS, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (B(), H(ZS, {
			key: 1,
			text: t.text
		}, null, 8, ["text"])) : t.type === "options" ? (B(), H(nC, {
			key: 2,
			options: t.options
		}, null, 8, ["options"])) : t.type === "synopsis" ? (B(), H(jC, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => P(MS)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (B(), H(UC, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => P(MS)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (B(), H(oC, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (B(), H(mC, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (B(), H(qC, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (B(), H(rw, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : K("", !0)], 64))), 128))], 2)) : K("", !0);
	}
}), aw = {
	key: 0,
	class: "dock stages live"
}, ow = { class: "stage-bar" }, sw = { class: "ellipsis" }, cw = {
	key: 0,
	class: "small muted"
}, lw = /* @__PURE__ */ L({
	__name: "Dock",
	setup(e) {
		let t = q(() => Bg.current && !Bg.current.streaming && Bg.current.status === "running" ? Bg.current : null), n = q(() => {
			let e = t.value;
			if (!e) return [];
			let n = Gd(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: ry(n, e.workflow, t.id, t.label),
				color: iy(n, t.actor)
			}));
		}), r = q(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (B(), V("div", aw, [U("div", ow, [
			W(P(Hx), { class: "spin faint" }),
			(B(!0), V(z, null, R(n.value, (e) => (B(), V("span", {
				key: e.id,
				class: A(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: ke({ "--actor": e.color })
			}, [U("span", sw, j(e.label), 1)], 6))), 128)),
			n.value.length ? K("", !0) : (B(), V("span", cw, j(P(X)("stages.waiting")), 1))
		]), r.value ? (B(), H(AS, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : K("", !0)])) : K("", !0);
	}
}), uw = ["aria-label"], dw = ["disabled"], fw = /* @__PURE__ */ L({
	__name: "Switch",
	props: /*@__PURE__*/ ni({
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
		let t = si(e, "modelValue");
		return (n, r) => (B(), V("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			I(U("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, dw), [[Qo, t.value]]),
			r[1] ||= U("span", { class: "track" }, null, -1),
			r[2] ||= U("span", { class: "thumb" }, null, -1)
		], 8, uw));
	}
}), pw = { class: "field-label" }, mw = { class: "ellipsis" }, hw = {
	key: 0,
	class: "dot modified"
}, gw = { class: "field-control" }, _w = /* @__PURE__ */ L({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (B(), V("div", { class: A(["field", { inline: e.inline }]) }, [U("div", pw, [
			U("span", mw, j(e.label), 1),
			e.modified ? (B(), V("span", hw)) : K("", !0),
			W(cC, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), U("div", gw, [Yr(t.$slots, "default")])], 2));
	}
}), vw = { class: "swatches" }, yw = ["title"], bw = ["title"], xw = { class: "swatches" }, Sw = ["title"], Cw = /* @__PURE__ */ L({
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
		return (e, t) => (B(), H(dC, {
			title: P(X)("appearance.title"),
			icon: P(Xx),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [
				W(_w, {
					label: P(X)("appearance.colors"),
					help: P(X)("appearance.colors.hint"),
					inline: ""
				}, {
					default: F(() => [U("div", vw, [
						U("label", {
							class: "swatch",
							style: ke({ background: P(r) || "var(--ap-primary-500)" }),
							title: P(X)("appearance.primary")
						}, [I(U("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ gn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							Zo,
							P(r),
							void 0,
							{ lazy: !0 }
						]])], 12, yw),
						U("label", {
							class: "swatch",
							style: ke({ background: P(i) || "var(--ap-accent-500)" }),
							title: P(X)("appearance.accent")
						}, [I(U("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ gn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							Zo,
							P(i),
							void 0,
							{ lazy: !0 }
						]])], 12, bw),
						W($, {
							icon: P(iS),
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
				W(_w, {
					label: P(X)("appearance.collapseStages"),
					inline: ""
				}, {
					default: F(() => [W(fw, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				W(_w, {
					label: P(X)("appearance.annotations"),
					help: P(X)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: F(() => [W(fw, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (B(), H(_w, {
					key: 0,
					label: P(X)("appearance.annotationColor"),
					inline: ""
				}, {
					default: F(() => [U("div", xw, [U("label", {
						class: "swatch",
						style: ke({ background: l.value || "var(--ap-accent)" }),
						title: P(X)("appearance.annotationColor")
					}, [I(U("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						Zo,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, Sw), W($, {
						icon: P(iS),
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
				}, 8, ["label"])) : K("", !0)
			]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), ww = { class: "toolbar" }, Tw = ["disabled"], Ew = ["disabled"], Dw = { class: "preset-list" }, Ow = ["onClick", "onKeydown"], kw = { class: "preset-mark" }, Aw = { class: "grow col preset-info" }, jw = { class: "row wrap preset-head" }, Mw = { class: "preset-name" }, Nw = { class: "badge neutral" }, Pw = { class: "badge neutral icon-badge" }, Fw = {
	key: 0,
	class: "xs muted"
}, Iw = {
	key: 1,
	class: "small muted preset-desc"
}, Lw = {
	key: 0,
	class: "empty"
}, Rw = /* @__PURE__ */ L({
	__name: "PresetsTab",
	setup(e) {
		let t = q(() => Vd()), n = (e) => ml(e.preset).length > 0, r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && h("success", n);
			} catch (e) {
				ev(e) ? h("info", e.message) : h("error", e instanceof Error ? e.message : String(e), X("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await tp(e.preset), hv();
		}), l = () => s("url", async () => {
			let e = await uv(a.value);
			return a.value = "", i.value = !1, e;
		}, X("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => dv(t), X("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => uv(J().sources[e.preset.id]), X("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => L_(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => fv(e.preset.id)), m = () => s("ext", async () => h("info", await C_() === "current" ? X("update.none") : X("update.reloading")));
		return (e, s) => (B(), V(z, null, [
			U("div", ww, [
				U("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [W(P(_S)), G(j(P(X)("presets.importFile")), 1)], 8, Tw),
				U("button", {
					type: "button",
					class: A(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [W(P(Vx)), G(j(P(X)("presets.importUrl")), 1)], 2),
				s[4] ||= U("span", { class: "grow" }, null, -1),
				W($, {
					icon: r.value === "ext" ? P(Hx) : P(nS),
					label: P(X)("presets.checkUpdates"),
					align: "end",
					disabled: r.value === "ext",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				U("input", {
					ref_key: "fileInput",
					ref: o,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: u
				}, null, 544)
			]),
			i.value ? (B(), V("form", {
				key: 0,
				class: "row",
				onSubmit: ss(l, ["prevent"])
			}, [I(U("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[Zo, a.value]]), U("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (B(), H(P(Hx), {
				key: 0,
				class: "spin"
			})) : (B(), H(P(Ox), { key: 1 })), G(j(P(X)("common.install")), 1)], 8, Ew)], 32)) : K("", !0),
			U("div", Dw, [(B(!0), V(z, null, R(t.value, (e) => (B(), V("div", {
				key: e.preset.id,
				class: A(["preset-item", { on: P(gv)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: ls((t) => c(e), ["enter"])
			}, [
				U("span", kw, [r.value === `select:${e.preset.id}` ? (B(), H(P(Hx), {
					key: 0,
					class: "spin"
				})) : P(gv)?.id === e.preset.id ? (B(), H(P(ux), { key: 1 })) : K("", !0)]),
				U("div", Aw, [
					U("div", jw, [
						U("span", Mw, j(P(ef)(e.preset)), 1),
						U("span", Nw, "v" + j(e.preset.version), 1),
						e.source === "builtin" ? K("", !0) : (B(), V("span", {
							key: 0,
							class: A(["badge", { warn: e.source === "dev" }])
						}, j(P(X)(`presets.source.${e.source}`)), 3)),
						n(e) ? (B(), H(CS, {
							key: 1,
							text: P(X)("presets.templates.help")
						}, {
							default: F(() => [U("span", Pw, [W(P(Sx)), G(j(P(X)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : K("", !0)
					]),
					e.preset.author ? (B(), V("span", Fw, j(e.preset.author), 1)) : K("", !0),
					P(tf)(e.preset) ? (B(), V("span", Iw, j(P(tf)(e.preset)), 1)) : K("", !0)
				]),
				U("div", {
					class: "row preset-actions",
					onClick: s[3] ||= ss(() => {}, ["stop"])
				}, [
					W($, {
						icon: P(jx),
						label: P(X)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					e.source === "installed" && P(J)().sources[e.preset.id] ? (B(), H($, {
						key: 0,
						icon: P(nS),
						label: P(X)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : K("", !0),
					e.source === "installed" ? (B(), H($, {
						key: 1,
						icon: P(mS),
						label: P(X)("common.delete"),
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
			], 42, Ow))), 128)), t.value.length ? K("", !0) : (B(), V("div", Lw, j(P(X)("presets.none")), 1))]),
			W(Cw)
		], 64));
	}
}), zw;
function Bw() {
	let e = gv, t = q(() => e.value ? Nf(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (Ff(r, t), n.sampling && (clearTimeout(zw), zw = setTimeout(() => void np(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var Vw = { class: "empty" }, Hw = /* @__PURE__ */ L({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (B(), V("div", Vw, [
			W(P(Yx)),
			U("span", null, j(P(X)("panel.noPreset")), 1),
			U("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => P(pv).tab = "presets"
			}, j(P(X)("panel.choosePreset")), 1)
		]));
	}
}), Uw = [
	"aria-checked",
	"title",
	"onClick"
], Ww = { class: "ellipsis" }, Gw = /* @__PURE__ */ L({
	__name: "Segmented",
	props: /*@__PURE__*/ ni({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = si(e, "modelValue");
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
		}, [e.icon ? (B(), H(Gr(e.icon), { key: 0 })) : K("", !0), U("span", Ww, j(e.label), 1)], 10, Uw))), 128))], 2));
	}
}), Kw = { class: "col" }, qw = { class: "row" }, Jw = ["aria-label"], Yw = ["label"], Xw = ["value"], Zw = ["label"], Qw = ["value"], $w = ["placeholder"], eT = {
	key: 1,
	class: "xs muted row tight"
}, tT = { value: "" }, nT = ["value"], rT = ["value"], iT = ["value"], aT = [
	"value",
	"placeholder",
	"onChange"
], oT = [
	"value",
	"placeholder",
	"onChange"
], sT = ["value"], cT = ["value"], lT = ["value"], uT = ["value"], dT = ["value"], fT = {
	key: 0,
	class: "xs muted"
}, pT = { class: "custom-ui-list small" }, mT = { class: "grow ellipsis" }, hT = { class: "xs faint" }, gT = { class: "slider" }, _T = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], vT = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], yT = { class: "field-grid" }, bT = ["value", "onChange"], xT = ["value"], ST = ["value"], CT = /* @__PURE__ */ L({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Bw(), i = q(() => t.value ? Af(t.value) : null), a = q({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				If(n, {
					kind: r,
					id: i.join(":")
				}), np(n);
			}
		}), o = q(() => {
			let e = t.value;
			return e ? wc(e).map((t) => ({
				id: t.id,
				title: Z(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = q({
			get: () => t.value ? X_(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = Hd(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? Q_(n, e) : ov(n);
			}
		}), c = q(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== Ec(t.value));
		}), l = q(() => t.value ? Lf(t.value) : !1), u = q(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? zf(e, n) : u.value && Vf(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Rf(t.value), np(t.value));
		}, g = () => {
			t.value && u.value && (Hf(t.value, u.value), np(t.value));
		}, _ = () => {
			t.value && u.value && Bf(t.value, u.value);
		}, v = q(() => vs.map((e) => ({
			value: e,
			label: X(`transport.${e}`),
			hint: X(`transport.${e}.hint`)
		}))), y = q({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), b = q(() => y.value === "tool-single" || y.value === "tool-multi"), x = q(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), ee = q(() => x.value.map((e) => ({
			value: e.id,
			label: Z(t.value, "workflows", e.id, "name", e.name),
			hint: Z(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), S = q({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), C = q(() => ee.value.find((e) => e.value === S.value)?.hint);
		function w(e) {
			return q({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let te = w("forceTool"), ne = w("parallelTools"), T = w("sendThoughtSignature"), E = w("streamToolArguments"), re = w("finalFallback"), ie = w("maxSteps"), ae = q({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), oe = q(() => Object.entries(t.value?.actors ?? {})), D = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), O = q({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), se = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), k = q(() => Ss.map((e) => ({
			value: e,
			label: X(`writing.userInput.${e}`),
			hint: X(`writing.userInput.${e}.hint`)
		}))), ce = q({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), le = q({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), ue = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), de = q({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), fe = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), pe = [
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
		], me = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], he = ["stream_openai", "show_thoughts"], ge = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], _e = q(() => n.value?.sampling ?? {}), ve = (e) => e in _e.value, ye = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), be = (e) => Number(e.target.value);
		return (e, r) => !P(t) || !P(n) || !i.value ? (B(), H(Hw, { key: 0 })) : (B(), V(z, { key: 1 }, [
			U("div", Kw, [
				U("div", qw, [
					I(U("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": P(X)("config.configuration")
					}, [U("optgroup", { label: P(X)("config.recommended") }, [(B(!0), V(z, null, R(P(t).configurations, (e) => (B(), V("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, j(P(Z)(P(t), "configurations", e.id, "name", e.name)), 9, Xw))), 128))], 8, Yw), i.value.saved.length ? (B(), V("optgroup", {
						key: 0,
						label: P(X)("config.saved")
					}, [(B(!0), V(z, null, R(i.value.saved, (e) => (B(), V("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, j(e.name), 9, Qw))), 128))], 8, Zw)) : K("", !0)], 8, Jw), [[es, a.value]]),
					u.value && l.value ? (B(), H($, {
						key: 0,
						icon: P(aS),
						label: P(X)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : K("", !0),
					W($, {
						icon: P($x),
						label: P(X)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (B(), H($, {
						key: 1,
						icon: P(Qx),
						label: P(X)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : K("", !0),
					u.value ? (B(), H($, {
						key: 2,
						icon: P(mS),
						label: P(X)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : K("", !0),
					W($, {
						icon: P(iS),
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
				d.value ? (B(), V("form", {
					key: 0,
					class: "row",
					onSubmit: ss(m, ["prevent"])
				}, [
					I(U("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: P(X)("config.name"),
						autofocus: ""
					}, null, 8, $w), [[Zo, f.value]]),
					W($, {
						icon: P(xS),
						label: P(X)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					W($, {
						icon: P(ux),
						label: P(X)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : K("", !0),
				l.value ? (B(), V("span", eT, [r[25] ||= U("span", { class: "dot modified" }, null, -1), G(j(P(X)("config.modified")), 1)])) : K("", !0)
			]),
			W(dC, {
				title: P(X)("config.connection"),
				icon: P(cx)
			}, {
				default: F(() => [
					W(_w, {
						label: P(X)("config.transport"),
						help: P(X)(`transport.${y.value}.hint`)
					}, {
						default: F(() => [W(Gw, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (B(), V(z, { key: 0 }, [
						W(_w, {
							label: P(X)("config.forceTool"),
							help: P(X)("config.forceTool.hint"),
							inline: ""
						}, {
							default: F(() => [W(fw, {
								modelValue: P(te),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ gn(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(_w, {
							label: P(X)("config.parallelTools"),
							help: P(X)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: F(() => [W(fw, {
								modelValue: P(ne),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ gn(ne) ? ne.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(_w, {
							label: P(X)("config.syntheticTurn"),
							help: P(X)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: F(() => [I(U("select", {
								"onUpdate:modelValue": r[8] ||= (e) => ae.value = e,
								class: "input"
							}, [U("option", tT, j(P(X)("common.none")), 1), (B(!0), V(z, null, R(P(t).syntheticTurns, (e) => (B(), V("option", {
								key: e.id,
								value: e.id
							}, j(e.label), 9, nT))), 128))], 512), [[es, ae.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						W(_w, {
							label: P(X)("config.thoughtSignature"),
							help: P(X)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: F(() => [W(fw, {
								modelValue: P(T),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ gn(T) ? T.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(_w, {
							label: P(X)("config.streamToolArguments"),
							help: P(X)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: F(() => [I(U("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ gn(E) ? E.value = e : null,
								class: "input"
							}, [(B(!0), V(z, null, R(P(ys), (e) => (B(), V("option", {
								key: e,
								value: e
							}, j(P(X)(`config.streamToolArguments.${e}`)), 9, rT))), 128))], 512), [[es, P(E)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (B(), H(_w, {
							key: 0,
							label: P(X)("config.maxSteps"),
							inline: ""
						}, {
							default: F(() => [U("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: P(ie),
								onChange: r[11] ||= (e) => ie.value = be(e)
							}, null, 40, iT)]),
							_: 1
						}, 8, ["label"])) : K("", !0)
					], 64)) : K("", !0),
					W(_w, {
						label: P(X)("config.finalFallback"),
						help: P(X)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: F(() => [W(fw, {
							modelValue: P(re),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ gn(re) ? re.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			ee.value.length > 1 ? (B(), H(dC, {
				key: 0,
				title: P(X)("config.workflow"),
				icon: P(bS),
				help: C.value
			}, {
				default: F(() => [W(Gw, {
					modelValue: S.value,
					"onUpdate:modelValue": r[13] ||= (e) => S.value = e,
					options: ee.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : K("", !0),
			W(dC, {
				title: P(X)("writing.actors"),
				icon: P(kx),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(B(!0), V(z, null, R(oe.value, ([e, t]) => (B(), V("div", {
					key: e,
					class: "field-grid"
				}, [W(_w, { label: P(X)("writing.actorName", { actor: e }) }, {
					default: F(() => [U("input", {
						class: "input",
						value: P(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => D("names", e, t.target.value)
					}, null, 40, aT)]),
					_: 2
				}, 1032, ["label"]), W(_w, { label: P(X)("writing.actorPrefix") }, {
					default: F(() => [U("input", {
						class: "input",
						value: P(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => D("prefixes", e, t.target.value)
					}, null, 40, oT)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(dC, {
				title: P(X)("writing.meta"),
				icon: P(Kx),
				help: P(X)("writing.meta.hint")
			}, {
				actions: F(() => [W(fw, {
					modelValue: le.value,
					"onUpdate:modelValue": r[14] ||= (e) => le.value = e,
					label: P(X)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [le.value ? (B(), H(_w, {
					key: 0,
					label: P(X)("writing.recentCount"),
					help: P(X)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: F(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: P(n).meta.recentCount,
						onChange: r[15] ||= (e) => ue(e.target.value)
					}, null, 40, sT)]),
					_: 1
				}, 8, ["label", "help"])) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(dC, {
				title: P(X)("writing.tokenSaving"),
				icon: P(wx),
				help: P(X)("writing.tokenSaving.hint")
			}, {
				actions: F(() => [W(fw, {
					modelValue: O.value,
					"onUpdate:modelValue": r[16] ||= (e) => O.value = e,
					label: P(X)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [O.value ? (B(), V(z, { key: 0 }, [
					W(_w, {
						label: P(X)("writing.keepFullTurns"),
						help: P(X)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: F(() => [U("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.keepFullTurns,
							onChange: r[17] ||= (e) => se("keepFullTurns", e.target.value)
						}, null, 40, cT)]),
						_: 1
					}, 8, ["label", "help"]),
					W(_w, {
						label: P(X)("writing.userInput"),
						help: P(X)("writing.userInput.hint")
					}, {
						default: F(() => [W(Gw, {
							modelValue: ce.value,
							"onUpdate:modelValue": r[18] ||= (e) => ce.value = e,
							options: k.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					ce.value === "truncate" ? (B(), H(_w, {
						key: 0,
						label: P(X)("writing.truncateUserAfter"),
						help: P(X)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: F(() => [U("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.truncateUserAfter,
							onChange: r[19] ||= (e) => se("truncateUserAfter", e.target.value)
						}, null, 40, lT)]),
						_: 1
					}, 8, ["label", "help"])) : K("", !0)
				], 64)) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(dC, {
				title: P(X)("writing.cache"),
				icon: P(Dx),
				help: P(X)("writing.cache.hint")
			}, {
				actions: F(() => [W(fw, {
					modelValue: de.value,
					"onUpdate:modelValue": r[20] ||= (e) => de.value = e,
					label: P(X)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [de.value ? (B(), V(z, { key: 0 }, [W(_w, {
					label: P(X)("writing.cacheTtl"),
					help: P(X)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: F(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.ttlMinutes,
						onChange: r[21] ||= (e) => fe("ttlMinutes", e.target.value)
					}, null, 40, uT)]),
					_: 1
				}, 8, ["label", "help"]), W(_w, {
					label: P(X)("writing.cacheMaxDeferred"),
					help: P(X)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: F(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.maxDeferredTurns,
						onChange: r[22] ||= (e) => fe("maxDeferredTurns", e.target.value)
					}, null, 40, dT)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (B(), H(dC, {
				key: 1,
				title: P(X)("config.customUi"),
				icon: P(eS),
				help: P(X)("config.customUi.hint")
			}, {
				actions: F(() => [W(fw, {
					modelValue: s.value,
					"onUpdate:modelValue": r[23] ||= (e) => s.value = e,
					label: P(X)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [c.value && !s.value ? (B(), V("p", fT, j(P(X)("config.customUi.changed")), 1)) : K("", !0), U("ul", pT, [(B(!0), V(z, null, R(o.value, (e) => (B(), V("li", {
					key: e.id,
					class: "row tight"
				}, [U("span", mT, j(e.title), 1), U("span", hT, j(P(X)(`config.customUi.${e.mode}`)) + " · " + j(P(X)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : K("", !0),
			W(dC, {
				title: P(X)("config.sampling"),
				icon: P(Px),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [
					(B(), V(z, null, R(pe, (e) => (B(), V(z, { key: e.key }, [ve(e.key) ? (B(), H(_w, {
						key: 0,
						label: P(X)(`sampling.${e.key}`)
					}, {
						default: F(() => [U("div", gT, [U("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: _e.value[e.key],
							onInput: (t) => ye(e.key, be(t))
						}, null, 40, _T), U("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: _e.value[e.key],
							onChange: (t) => ye(e.key, be(t))
						}, null, 40, vT)])]),
						_: 2
					}, 1032, ["label"])) : K("", !0)], 64))), 64)),
					U("div", yT, [(B(), V(z, null, R(me, (e) => (B(), V(z, { key: e }, [ve(e) ? (B(), H(_w, {
						key: 0,
						label: P(X)(`sampling.${e}`)
					}, {
						default: F(() => [U("input", {
							class: "input",
							type: "number",
							value: _e.value[e],
							onChange: (t) => ye(e, be(t))
						}, null, 40, bT)]),
						_: 2
					}, 1032, ["label"])) : K("", !0)], 64))), 64)), ve("reasoning_effort") ? (B(), H(_w, {
						key: 0,
						label: P(X)("sampling.reasoning_effort")
					}, {
						default: F(() => [U("select", {
							class: "input",
							value: _e.value.reasoning_effort,
							onChange: r[24] ||= (e) => ye("reasoning_effort", e.target.value)
						}, [(B(), V(z, null, R(ge, (e) => U("option", {
							key: e,
							value: e
						}, j(P(X)(`effort.${e}`)), 9, ST)), 64))], 40, xT)]),
						_: 1
					}, 8, ["label"])) : K("", !0)]),
					(B(), V(z, null, R(he, (e) => (B(), V(z, { key: e }, [ve(e) ? (B(), H(_w, {
						key: 0,
						label: P(X)(`sampling.${e}`),
						inline: ""
					}, {
						default: F(() => [W(fw, {
							"model-value": !!_e.value[e],
							"onUpdate:modelValue": (t) => ye(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : K("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), wT = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function TT(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: X("config.transport"),
			options: t([...vs], (e) => X(`transport.${e}`))
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
				label: Z(e, "workflows", t.id, "name", t.name)
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
			options: t(wT, (e) => X(`um.genType.${e}`))
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
var ET = (e) => e.modules.filter((e) => e.toggle === "user");
function DT(e) {
	let t = TT(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return ET(e).length && r.push({
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
function OT(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function kT(e, t) {
	return t === "module" ? ET(e).map((t) => ({
		value: t.id,
		label: Z(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Z(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function AT(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: kT(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Z(e, "params", t.id, "label", t.label) : r;
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
			label: jT(e, t.id, n.value, n.label)
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
	return TT(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var jT = (e, t, n, r) => $d(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), MT = {
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
function NT(e, t) {
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
		let n = String(kT(e, t)[0]?.value ?? "");
		return PT(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return PT(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function PT(e, t, n) {
	let r = AT(e, n);
	return t.path && AT(e, t.path).kind === r.kind && MT[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function FT(e, t, n = "") {
	return e === "bool" ? X(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? X(`um.op.list.${t}`) : e === "enum" ? X(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var IT = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(X("um.or")) : t === void 0 ? "" : n(t);
};
function LT(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? X("um.kw.input") : X("um.kw.recentN", { n: t.depth ?? 3 })} ${X(`um.kw.${t.op}`)} ${t.words.join(X("um.or"))}`;
	let n = AT(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? X("um.boolDesc", {
		label: n.label,
		value: FT(n.kind, t.op, t.path)
	}) : `${n.label} ${FT(n.kind, t.op)} ${IT(n, t.value)}`;
}
function RT(e, t) {
	let n = t.rules.filter(wu);
	return n.length ? n.map((t) => LT(e, t)).join(t.match === "any" ? `\n${X("um.match.anyJoin")} ` : `\n${X("um.match.allJoin")} `) : X("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var zT = ["aria-label"], BT = { class: "um-picker-head" }, VT = { class: "small muted" }, HT = { class: "um-choice-text" }, UT = { class: "xs muted" }, WT = ["data-template", "onClick"], GT = { class: "um-choice-text" }, KT = {
	key: 0,
	class: "xs muted um-choice-desc"
}, qT = ["data-id"], JT = ["aria-label", "onPointerdown"], YT = ["onClick"], XT = { class: "um-row-name ellipsis" }, ZT = { class: "um-row-meta xs muted ellipsis" }, QT = {
	key: 3,
	class: "faint small"
}, $T = /* @__PURE__ */ L({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => Lp(n.preset)), a = q(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Z(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Z(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.map((e) => e.point))].map(o).concat(e.vars.map((e) => s(e.var))).join(" · "), l = (e) => Fu(n.preset, e), u = (e) => X("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(wu);
		function f(e, t) {
			e.enabled = t, Y();
		}
		let p = q(() => md(n.preset).map((e) => ({
			tpl: e,
			body: nf(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ N(!1), g = /* @__PURE__ */ N(null);
		function _() {
			m.value = !1;
			let e = Vp(n.preset, X("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function v(e) {
			m.value = !1;
			let t = Hp(n.preset, nf(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function y() {
			if (!p.value.length) return _();
			m.value = !m.value, m.value && (await Hn(), g.value?.querySelector(".um-choice")?.focus());
		}
		let b = /* @__PURE__ */ N(null);
		async function x(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await av(Qu(e).modules);
				let { added: t, missing: i } = qp(n.preset, e);
				h(i ? "warning" : "success", i ? X("um.importedMissing", {
					n: t.length,
					missing: i
				}) : X("um.imported", { n: t.length }));
			} catch (e) {
				ev(e) ? h("info", e.message) : h("error", X("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let ee = () => A_(`${n.preset.id}.ap-modules.json`, Kp(n.preset)), S = /* @__PURE__ */ N(null), C = /* @__PURE__ */ N(null);
		function w(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), C.value = t;
		}
		function te(e) {
			let t = C.value;
			if (!t || !S.value) return;
			let r = [...S.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && Gp(n.preset, t, r);
		}
		let ne = () => {
			C.value = null;
		};
		return (t, n) => (B(), H(dC, {
			title: P(X)("um.title"),
			help: P(X)("um.help")
		}, {
			actions: F(() => [
				a.value ? (B(), H($, {
					key: 0,
					icon: P(_S),
					label: P(X)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : K("", !0),
				i.value.length ? (B(), H($, {
					key: 1,
					icon: P(Ox),
					label: P(X)("um.exportAll"),
					small: "",
					align: "end",
					onClick: ee
				}, null, 8, ["icon", "label"])) : K("", !0),
				a.value && i.value.length ? (B(), H($, {
					key: 2,
					icon: P($x),
					label: P(X)("um.new"),
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
			default: F(() => [
				m.value ? (B(), V("div", {
					key: 0,
					ref_key: "pickerEl",
					ref: g,
					class: "um-picker",
					role: "group",
					"aria-label": P(X)("um.startFrom"),
					onKeydown: n[2] ||= ls(ss((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					U("div", BT, [U("span", VT, j(P(X)("um.startFrom")), 1), W($, {
						icon: P(xS),
						label: P(X)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					U("button", {
						type: "button",
						class: "um-choice",
						onClick: _
					}, [W(P(Mx)), U("span", HT, [U("span", null, j(P(X)("um.blank")), 1), U("span", UT, j(P(X)("um.blank.desc")), 1)])]),
					(B(!0), V(z, null, R(p.value, (e) => (B(), V("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => v(e.tpl)
					}, [W(P(Bx)), U("span", GT, [U("span", null, j(e.body.name), 1), e.body.description ? (B(), V("span", KT, j(e.body.description), 1)) : K("", !0)])], 8, WT))), 128))
				], 40, zT)) : K("", !0),
				i.value.length ? (B(), V("div", {
					key: 1,
					ref_key: "listEl",
					ref: S,
					class: "um-list"
				}, [(B(!0), V(z, null, R(i.value, (t) => (B(), V("div", {
					key: t.id,
					class: A(["um-row", {
						off: !t.enabled,
						dragging: C.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (B(), V("span", {
						key: 0,
						class: "um-grip",
						"aria-label": P(X)("um.reorder"),
						onPointerdown: (e) => w(e, t.id),
						onPointermove: te,
						onPointerup: ne,
						onPointercancel: ne
					}, [W(P(Lx))], 40, JT)) : K("", !0),
					U("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [U("span", XT, j(t.name || P(X)("um.untitled")), 1), U("span", ZT, j(c(t) || P(X)("um.noEntries")), 1)], 8, YT),
					l(t).length ? (B(), H(CS, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: F(() => [W(P(hS), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : K("", !0),
					d(t) ? (B(), H(CS, {
						key: 2,
						text: P(RT)(e.preset, t.trigger),
						align: "end"
					}, {
						default: F(() => [W(P(SS), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : K("", !0),
					W(fw, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, qT))), 128))], 512)) : a.value && !m.value ? (B(), V("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: y
				}, [W(P($x)), G(j(P(X)("um.new")), 1)])) : a.value ? K("", !0) : (B(), V("div", QT, j(P(X)("um.noPoints")), 1)),
				U("input", {
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
}), eE = ["title"], tE = ["aria-label", "onClick"], nE = ["placeholder"], rE = /* @__PURE__ */ L({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ni({
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
		let t = si(e, "modelValue"), n = e, r = /* @__PURE__ */ N(""), i = /* @__PURE__ */ N(null);
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
			class: A(["chip", { mono: e.mono }])
		}, [U("span", {
			class: "ellipsis",
			title: t
		}, j(t), 9, eE), U("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: ss((e) => c(n), ["stop"])
		}, [W(P(xS))], 8, tE)], 2))), 128)), I(U("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: A(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, nE), [[Zo, r.value]])]));
	}
}), iE = { class: "rule" }, aE = { class: "rule-head" }, oE = ["value", "aria-label"], sE = ["label"], cE = ["value"], lE = ["value"], uE = ["value"], dE = ["value"], fE = ["value"], pE = {
	key: 1,
	class: "grow"
}, mE = {
	key: 0,
	class: "rule-body"
}, hE = { class: "row wrap" }, gE = {
	key: 0,
	class: "unit small muted"
}, _E = ["value"], vE = ["value"], yE = { value: "any" }, bE = { value: "none" }, xE = { class: "row kw-words" }, SE = {
	key: 1,
	class: "rule-body"
}, CE = ["value"], wE = {
	key: 2,
	class: "rule-body"
}, TE = ["value"], EE = ["value"], DE = { class: "row wrap option-chips" }, OE = ["aria-pressed", "onClick"], kE = {
	key: 2,
	class: "row"
}, AE = ["value"], jE = ["value"], ME = ["value"], NE = ["list", "value"], PE = ["value"], FE = {
	key: 3,
	class: "rule-error xs"
}, IE = /* @__PURE__ */ L({
	__name: "RuleRow",
	props: /*@__PURE__*/ ni({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ni(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = si(e, "modelValue"), r = q(() => DT(t.preset)), i = q(() => OT(n.value)), a = q(() => kT(t.preset, i.value)), o = q(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = q(() => n.value.kind === "var" ? AT(t.preset, n.value.path) : null), c = q(() => Au(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = NT(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = PT(t.preset, r, `${i}.${e}`);
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
		let g = q(() => s.value?.kind === "list" ? "list" : "bool"), _ = q(() => MT[g.value].map((e) => ({
			value: e,
			label: FT(g.value, e, n.value.path)
		}))), v = q(() => (s.value ? MT[s.value.kind] : []).map((e) => ({
			value: e,
			label: FT(s.value.kind, e)
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
			label: X("um.kw.input")
		}, {
			value: "recent",
			label: X("um.kw.recent")
		}]);
		return (e, t) => (B(), V("div", iE, [
			U("div", aE, [
				U("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": P(X)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(B(!0), V(z, null, R(r.value, (e) => (B(), V("optgroup", {
					key: e.label,
					label: e.label
				}, [(B(!0), V(z, null, R(e.subjects, (e) => (B(), V("option", {
					key: e.id,
					value: e.id
				}, j(e.label), 9, cE))), 128))], 8, sE))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (B(), V("option", {
					key: 0,
					value: i.value
				}, j(n.value.path), 9, lE)) : K("", !0)], 40, oE),
				a.value.length ? (B(), V("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(B(!0), V(z, null, R(a.value, (e) => (B(), V("option", {
					key: String(e.value),
					value: e.value
				}, j(e.label), 9, dE))), 128)), a.value.some((e) => String(e.value) === o.value) ? K("", !0) : (B(), V("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, j(o.value), 9, fE))], 40, uE)) : (B(), V("span", pE)),
				W($, {
					icon: P(xS),
					label: P(X)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (B(), V("div", mE, [U("div", hE, [
				W(Gw, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (B(), V("label", gE, [U("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? P(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, _E), G(" " + j(P(X)("um.kw.messages")), 1)])) : K("", !0),
				U("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [U("option", yE, j(P(X)("um.kw.any")), 1), U("option", bE, j(P(X)("um.kw.none")), 1)], 40, vE)
			]), U("div", xE, [W(rE, {
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
			]), W($, {
				icon: P(rS),
				label: P(X)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (B(), V("div", SE, [U("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, CE)])) : s.value ? (B(), V("div", wE, [s.value.kind === "bool" || s.value.kind === "list" ? (B(), H(Gw, {
				key: 0,
				"model-value": n.value.op,
				options: _.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (B(), V(z, { key: 1 }, [U("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(B(!0), V(z, null, R(v.value, (e) => (B(), V("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, EE))), 128))], 40, TE), U("div", DE, [(B(!0), V(z, null, R(s.value.options, (e) => (B(), V("button", {
				key: String(e.value),
				type: "button",
				class: A(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, j(e.label), 11, OE))), 128))])], 64)) : (B(), V("div", kE, [U("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(B(!0), V(z, null, R(v.value, (e) => (B(), V("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, jE))), 128))], 40, AE), s.value.kind === "number" ? (B(), V("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, ME)) : (B(), V(z, { key: 1 }, [U("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, NE), s.value.suggestions?.length ? (B(), V("datalist", {
				key: 0,
				id: l
			}, [(B(!0), V(z, null, R(s.value.suggestions, (e) => (B(), V("option", {
				key: e,
				value: e
			}, null, 8, PE))), 128))])) : K("", !0)], 64))]))])) : K("", !0),
			c.value ? (B(), V("div", FE, j(c.value), 1)) : K("", !0)
		]));
	}
}), LE = { class: "trigger" }, RE = {
	key: 1,
	class: "always faint small"
}, zE = {
	key: 0,
	class: "rule-join xs faint"
}, BE = { class: "btn ghost add picker" }, VE = ["aria-label"], HE = ["label"], UE = ["value"], WE = /* @__PURE__ */ L({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ni({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = si(e, "modelValue"), r = q(() => DT(t.preset)), i = /* @__PURE__ */ N(null), a = q(() => [{
			value: "all",
			label: X("um.match.all")
		}, {
			value: "any",
			label: X("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(NT(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (B(), V("div", LE, [
			n.value.rules.length > 1 ? (B(), H(Gw, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : K("", !0),
			n.value.rules.length ? K("", !0) : (B(), V("div", RE, j(P(X)("um.always")), 1)),
			(B(!0), V(z, null, R(n.value.rules, (t, r) => (B(), V(z, { key: r }, [r > 0 ? (B(), V("div", zE, j(n.value.match === "any" ? P(X)("um.match.anyJoin") : P(X)("um.match.allJoin")), 1)) : K("", !0), W(IE, {
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
			U("label", BE, [
				W(P($x)),
				G(j(P(X)("um.addRule")) + " ", 1),
				U("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": P(X)("um.addRule"),
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
				}, j(e.label), 9, UE))), 128))], 8, HE))), 128))], 40, VE)
			])
		]));
	}
}), GE = { class: "um-entry-head" }, KE = { class: "um-var-label grow ellipsis" }, qE = {
	key: 0,
	class: "um-warn xs"
}, JE = ["placeholder"], YE = ["onUpdate:modelValue", "placeholder"], XE = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], ZE = [
	"value",
	"placeholder",
	"onInput"
], QE = ["id"], $E = ["value"], eD = /* @__PURE__ */ L({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => Nu(n.preset, n.update.var)), a = q(() => i.value?.type !== n.update.type), o = q(() => i.value ? Z(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = q(() => i.value && Z(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = q(() => {
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
		return (t, n) => (B(), V("div", { class: A(["um-entry", { lost: a.value }]) }, [
			U("div", GE, [
				W(P(ax), { class: "faint" }),
				U("span", KE, j(o.value), 1),
				W(cC, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				W($, {
					icon: P(xS),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (B(), V("div", qE, [W(P(hS)), G(j(P(X)("um.bv.lost")), 1)])) : K("", !0),
			e.update.type === "string" ? I((B(), V("textarea", {
				key: 1,
				"onUpdate:modelValue": n[1] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: P(X)("um.bv.append")
			}, null, 8, JE)), [[Zo, e.update.text]]) : e.update.type === "list" ? (B(!0), V(z, { key: 2 }, R(e.update.items, (t, n) => (B(), V("div", {
				key: n,
				class: "um-var-row list"
			}, [I(U("textarea", {
				"onUpdate:modelValue": (t) => e.update.items[n] = t,
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: P(X)("um.bv.item")
			}, null, 8, YE), [[Zo, e.update.items[n]]]), W($, {
				icon: P(xS),
				label: P(X)("um.removeEntry"),
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
					placeholder: P(X)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, XE), [[Zo, t.key]]),
				U("textarea", {
					value: t.value ?? "",
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: c.value.has(t.key.trim()) ? P(X)("um.bv.removes") : P(X)("um.bv.value"),
					onInput: (e) => t.value = e.target.value
				}, null, 40, ZE),
				W($, {
					icon: P(xS),
					label: P(X)("um.removeEntry"),
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
			}, null, 8, $E))), 128))], 8, QE)], 64)),
			e.update.type === "string" ? K("", !0) : (B(), V("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: d
			}, [W(P($x)), G(j(e.update.type === "dict" ? P(X)("um.bv.addKey") : P(X)("um.bv.addItem")), 1)]))
		], 2));
	}
}), tD = { class: "um-editor" }, nD = { class: "um-head" }, rD = ["placeholder", "aria-label"], iD = { class: "um-entry-head" }, aD = ["onUpdate:modelValue", "aria-label"], oD = ["value"], sD = ["value"], cD = [
	"value",
	"aria-label",
	"onChange"
], lD = ["value"], uD = {
	key: 0,
	class: "um-warn xs"
}, dD = ["onUpdate:modelValue", "placeholder"], fD = {
	key: 1,
	class: "rule-error xs pre"
}, pD = {
	key: 0,
	class: "btn ghost add picker"
}, mD = ["aria-label"], hD = ["value"], gD = { class: "um-foot" }, _D = ["title"], vD = ["title"], yD = ["title"], bD = /* @__PURE__ */ L({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		cr(() => n.module, Y, { deep: !0 });
		let i = /* @__PURE__ */ N(null);
		Br(() => {
			n.module.entries.some((e) => e.text) || Hn(() => i.value?.select());
		});
		let a = q(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Z(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Z(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !ju(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => dl(e.text).errors, d = (e) => u(e).map((e) => e.line ? X("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = Bp(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = q(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Z(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = q(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ N(null);
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
			v.value ? (Wp(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = Up(n.preset, n.module.id, (e) => X("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => A_(`${n.preset.id}.${j_(n.module.name)}.ap-modules.json`, Kp(n.preset, [n.module.id]));
		return (t, n) => (B(), V("div", tD, [
			U("header", nD, [
				W($, {
					icon: P(nx),
					label: P(X)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				I(U("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: P(X)("um.untitled"),
					"aria-label": P(X)("um.name")
				}, null, 8, rD), [[Zo, e.module.name]]),
				W(fw, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: P(X)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			W(dC, {
				title: P(X)("um.content"),
				help: P(X)("um.content.help")
			}, {
				default: F(() => [(B(!0), V(z, null, R(e.module.entries, (t, n) => (B(), V("div", {
					key: t.id,
					class: A(["um-entry", { lost: s(t) }])
				}, [
					U("div", iD, [
						W(P(Ux), { class: "faint" }),
						I(U("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": P(X)("um.point")
						}, [(B(!0), V(z, null, R(a.value, (e) => (B(), V("option", {
							key: e.id,
							value: e.id
						}, j(e.label), 9, oD))), 128)), s(t) ? (B(), V("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, j(P(X)("um.pointMissing", { id: t.point })), 9, sD)) : K("", !0)], 8, aD), [[es, t.point]]),
						W(cC, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						U("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": P(X)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(B(), V(z, null, R(c, (e) => U("option", {
							key: e,
							value: e
						}, j(P(X)(`um.role.${e || "merge"}`)), 9, lD)), 64))], 40, cD),
						e.module.entries.length > 1 || e.module.vars.length ? (B(), H($, {
							key: 0,
							icon: P(xS),
							label: P(X)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : K("", !0)
					]),
					s(t) ? (B(), V("div", uD, [W(P(hS)), G(j(P(X)("um.pointLost")), 1)])) : K("", !0),
					I(U("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: P(X)("um.text.placeholder")
					}, null, 8, dD), [[Zo, t.text]]),
					u(t).length ? (B(), V("div", fD, j(d(t)), 1)) : K("", !0)
				], 2))), 128)), a.value.length ? (B(), V("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [W(P($x)), G(j(P(X)("um.addEntry")), 1)])) : K("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (B(), H(dC, {
				key: 0,
				title: P(X)("um.bv"),
				help: P(X)("um.bv.help")
			}, {
				default: F(() => [(B(!0), V(z, null, R(e.module.vars, (t, n) => (B(), H(eD, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (B(), V("label", pD, [
					W(P($x)),
					G(j(P(X)("um.bv.add")) + " ", 1),
					U("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": P(X)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= U("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (B(!0), V(z, null, R(h.value, (e) => (B(), V("option", {
						key: e.id,
						value: e.id
					}, j(e.label), 9, hD))), 128))], 40, mD)
				])) : K("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : K("", !0),
			W(dC, {
				title: P(X)("um.trigger"),
				help: P(X)("um.trigger.help")
			}, {
				default: F(() => [W(WE, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			U("footer", gD, [
				U("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.export"),
					onClick: x
				}, [W(P(Ox)), U("span", null, j(P(X)("um.export")), 1)], 8, _D),
				U("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.duplicate"),
					onClick: b
				}, [W(P(Tx)), U("span", null, j(P(X)("um.duplicate")), 1)], 8, vD),
				n[6] ||= U("span", { class: "grow" }, null, -1),
				U("button", {
					type: "button",
					class: A(["btn ghost danger", { armed: v.value }]),
					title: P(X)("common.delete"),
					onClick: y
				}, [W(P(mS)), U("span", null, j(v.value ? P(X)("um.confirmDelete") : P(X)("common.delete")), 1)], 10, yD)
			])
		]));
	}
}), xD = {
	key: 0,
	class: "module-row"
}, SD = { class: "grow" }, CD = { class: "ellipsis" }, wD = ["aria-label"], TD = ["aria-checked", "onClick"], ED = { class: "grow" }, DD = { class: "grow" }, OD = { class: "ellipsis" }, kD = {
	key: 0,
	class: "empty"
}, AD = /* @__PURE__ */ L({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Bw(), i = q(() => t.value && n.value ? Jl(t.value, n.value) : {}), a = q(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = Kl(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Z(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Z(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Z(e, "groups", t, "label", r?.label ?? t) : X("modules.other"),
					help: t && Z(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Z(t.value, "modules", e.id, "name", e.name), s = (e) => Z(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(null), _ = q(() => t.value && h.value ? Lp(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Hn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Hn(() => y()?.scrollTo({ top: v }));
		}
		return cr(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !P(t) || !P(n) ? (B(), H(Hw, { key: 0 })) : _.value ? (B(), V("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(B(), H(bD, {
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
			W($T, {
				preset: P(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(B(!0), V(z, null, R(a.value, (e) => (B(), H(dC, {
				key: e.id,
				title: e.label,
				help: e.help
			}, Jr({
				default: F(() => [(B(!0), V(z, null, R(e.sets, (t) => (B(), V(z, { key: t.key }, [t.label ? (B(), V("div", xD, [U("span", SD, [U("span", CD, j(t.label), 1), W(cC, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (B(), H(fw, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : K("", !0)])) : K("", !0), !t.optional || c(t) ? (B(), V("div", {
					key: 1,
					class: A(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(B(!0), V(z, null, R(t.modules, (e) => (B(), V("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: A(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= U("span", { class: "radio" }, null, -1),
					U("span", ED, j(o(e)), 1),
					W(cC, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, TD))), 128))], 10, wD)) : K("", !0)], 64))), 128)), (B(!0), V(z, null, R(e.toggles, (e) => (B(), V("div", {
					key: e.id,
					class: "module-row"
				}, [U("span", DD, [U("span", OD, j(o(e)), 1), W(cC, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), W(fw, {
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
				fn: F(() => [W(fw, {
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
			a.value.length ? K("", !0) : (B(), V("div", kD, j(P(X)("modules.none")), 1))
		], 512));
	}
}), jD = ["value", "onChange"], MD = ["value"], ND = {
	key: 2,
	class: "unit"
}, PD = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], FD = {
	key: 0,
	class: "small muted"
}, ID = [
	"list",
	"value",
	"placeholder",
	"onChange"
], LD = ["id"], RD = ["value"], zD = /* @__PURE__ */ L({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Bw(), i = q(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Z(e, "groups", t, "label", e.groups[t]?.label ?? t) : X("writing.params"),
				help: t && Z(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Z(t.value, "params", e.id, "label", e.label), o = (e) => Z(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => $d(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => jl(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !P(t) || !P(n) ? (B(), H(Hw, { key: 0 })) : (B(!0), V(z, { key: 1 }, R(i.value, (e) => (B(), H(dC, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: P(uS)
		}, {
			default: F(() => [(B(!0), V(z, null, R(e.params, (e) => (B(), H(_w, {
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
				}, j(s(e, t.value, t.label)), 9, MD))), 128))], 40, jD)) : e.type === "list" ? (B(), H(rE, {
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
				])) : e.type === "number" ? (B(), V("div", ND, [U("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, PD), e.unit ? (B(), V("span", FD, j(e.unit), 1)) : K("", !0)])) : (B(), V(z, { key: 3 }, [U("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, ID), e.options?.length ? (B(), V("datalist", {
					key: 0,
					id: f(e)
				}, [(B(!0), V(z, null, R(e.options, (t) => (B(), V("option", {
					key: String(t.value),
					value: t.value
				}, j(s(e, t.value, t.label)), 9, RD))), 128))], 8, LD)) : K("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), BD = { class: "kv" }, VD = {
	key: 0,
	class: "kv-row"
}, HD = { class: "kv-key ellipsis" }, UD = { class: "kv-value pre small" }, WD = {
	key: 0,
	class: "kv-actions"
}, GD = {
	key: 1,
	class: "kv-edit col"
}, KD = ["placeholder"], qD = ["placeholder"], JD = { class: "row end" }, YD = {
	key: 0,
	class: "kv-edit col"
}, XD = ["placeholder"], ZD = ["placeholder"], QD = { class: "row end" }, $D = {
	key: 1,
	class: "faint small kv-empty"
}, eO = /* @__PURE__ */ L({
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
		return (t, n) => (B(), V("div", BD, [
			(B(!0), V(z, null, R(e.entries, (t, l) => (B(), V(z, { key: l }, [i.value === l ? (B(), V("div", GD, [
				I(U("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, KD), [[Zo, a.value]]),
				I(U("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, qD), [[Zo, o.value]]),
				U("div", JD, [W($, {
					icon: P(xS),
					label: P(X)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: P(ux),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (B(), V("div", VD, [
				U("div", HD, j(l), 1),
				U("div", UD, j(t), 1),
				e.readonly ? K("", !0) : (B(), V("div", WD, [W($, {
					icon: P(Qx),
					label: P(X)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), W($, {
					icon: P(mS),
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
			i.value === "" ? (B(), V("div", YD, [
				I(U("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, XD), [[Zo, a.value]]),
				I(U("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, ZD), [[Zo, o.value]]),
				U("div", QD, [W($, {
					icon: P(xS),
					label: P(X)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: P(ux),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : K("", !0),
			!Object.keys(e.entries).length && i.value === null ? (B(), V("div", $D, j(P(X)("memory.empty")), 1)) : K("", !0),
			!e.readonly && i.value === null ? (B(), V("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [W(P($x)), G(j(P(X)("common.add")), 1)])) : K("", !0)
		]));
	}
}), tO = {
	key: 1,
	class: "faint small"
}, nO = {
	key: 0,
	class: "badge neutral"
}, rO = ["placeholder"], iO = {
	key: 1,
	class: "faint small"
}, aO = /* @__PURE__ */ L({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = Bw(), r = q(() => n.value ? Af(n.value) : null), i = q(() => (pv.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = q(() => (pv.chatRev, i.value ? _f() : {})), o = q(() => r.value ? bf(r.value) : {}), s = q(() => (pv.chatRev, i.value ? vf() : null));
		async function c(e, t) {
			await yf({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), mv();
		}
		async function l(e) {
			await yf({
				type: "memory.delete",
				key: e,
				source: "user"
			}), mv();
		}
		let u = (e, t) => r.value && xf(r.value, "replace", e, t, "user"), d = (e) => r.value && xf(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ N("");
		cr(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = q(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await yf({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), mv();
		}
		return (e, t) => !P(n) || !r.value ? (B(), H(Hw, { key: 0 })) : (B(), V(z, { key: 1 }, [
			W(dC, {
				title: P(X)("memory.chat"),
				icon: P(Wx),
				help: P(X)("memory.chat.hint")
			}, {
				default: F(() => [i.value ? (B(), H(eO, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (B(), V("div", tO, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(dC, {
				title: P(X)("memory.global"),
				icon: P(Ix),
				help: P(X)("memory.global.hint")
			}, {
				actions: F(() => [W($, {
					icon: P(gS),
					label: P(X)("common.undo"),
					small: "",
					align: "end",
					disabled: !P(Sf)(r.value),
					onClick: t[0] ||= (e) => P(wf)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), W($, {
					icon: P(tS),
					label: P(X)("common.redo"),
					small: "",
					align: "end",
					disabled: !P(Cf)(r.value),
					onClick: t[1] ||= (e) => P(Tf)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: F(() => [W(eO, {
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
			W(dC, {
				title: P(X)("memory.recap"),
				icon: P(oS),
				help: P(X)("memory.recap.hint")
			}, {
				actions: F(() => [s.value ? (B(), V("span", nO, "#0–" + j(s.value.coversUpTo), 1)) : K("", !0), i.value ? (B(), H($, {
					key: 1,
					icon: P(ux),
					label: P(X)("common.save"),
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
				default: F(() => [i.value ? I((B(), V("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: P(X)("memory.recap.empty")
				}, null, 8, rO)), [[Zo, f.value]]) : (B(), V("div", iO, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), oO = { class: "row tight xs muted" }, sO = { class: "row" }, cO = {
	key: 0,
	class: "xs text-danger"
}, lO = { class: "row wrap xs muted" }, uO = { class: "badge neutral" }, dO = {
	key: 0,
	class: "badge neutral"
}, fO = { class: "badge neutral" }, pO = {
	key: 1,
	class: "badge warn"
}, mO = ["title"], hO = {
	key: 0,
	class: "row wrap xs muted"
}, gO = { class: "grow" }, _O = { key: 0 }, vO = ["onClick"], yO = { class: "grow mono" }, bO = { class: "xs muted" }, xO = { class: "row xs muted" }, SO = { class: "badge neutral" }, CO = { class: "pre mono scroll" }, wO = {
	key: 0,
	class: "xs faint region-msg"
}, TO = { key: 1 }, EO = ["onClick"], DO = { class: "grow mono" }, OO = { class: "xs muted" }, kO = {
	key: 0,
	class: "region-msg"
}, AO = { class: "pre mono scroll" }, jO = {
	key: 0,
	class: "xs faint"
}, MO = {
	key: 2,
	class: "xs text-warning"
}, NO = {
	key: 1,
	class: "faint small"
}, PO = ["onClick"], FO = { class: "mono grow ellipsis" }, IO = {
	key: 0,
	class: "badge warn"
}, LO = { class: "xs muted" }, RO = { class: "xs muted" }, zO = { class: "row xs muted" }, BO = { class: "grow" }, VO = { class: "mono scroll" }, HO = { class: "row xs muted" }, UO = { class: "grow" }, WO = { class: "mono scroll" }, GO = {
	key: 0,
	class: "faint small"
}, KO = { class: "row xs" }, qO = { class: "badge neutral" }, JO = { class: "muted" }, YO = { class: "mono scroll" }, XO = {
	key: 0,
	class: "faint small"
}, ZO = { class: "row xs" }, QO = { class: "badge neutral" }, $O = { class: "grow muted" }, ek = { class: "small" }, tk = {
	key: 0,
	class: "faint small"
}, nk = { class: "xs faint mono build" }, rk = /* @__PURE__ */ L({
	__name: "DebugTab",
	setup(t) {
		let n = q(() => Yp.log.find((e) => e.kind === "assembly")?.data), r = q(() => Yp.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ an(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ an({});
		cr(n, async (t) => {
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
		}), g = q(() => Yp.log.filter((e) => e.kind !== "assembly")), _ = q(() => {
			pv.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of m_(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (B(), V(z, null, [
			W(dC, {
				title: P(X)("debug.dev"),
				icon: P(sS),
				help: P(X)("debug.dev.hint")
			}, {
				actions: F(() => [U("span", oO, [U("span", { class: A(["dot status-dot", P(R_).status]) }, null, 2), G(j(P(X)(`debug.dev.${P(R_).status}`)), 1)])]),
				default: F(() => [W(_w, { label: P(X)("debug.dev.url") }, {
					default: F(() => [U("div", sO, [I(U("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						Zo,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), W(fw, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: P(X)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), P(R_).error ? (B(), V("span", cO, j(P(R_).error), 1)) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(dC, {
				title: P(X)("debug.assembly"),
				icon: P(Nx),
				collapsible: ""
			}, {
				default: F(() => [n.value ? (B(), V(z, { key: 0 }, [
					U("div", lO, [
						U("span", uO, j(P(X)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (B(), V("span", dO, j(n.value.workflow), 1)) : K("", !0),
						U("span", fO, j(n.value.origin), 1),
						n.value.dryRun ? (B(), V("span", pO, "dry run")) : K("", !0),
						n.value.input ? (B(), V("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, j(P(X)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, mO)) : K("", !0),
						t[3] ||= U("span", { class: "grow" }, null, -1),
						G(j(u(n.value.at)), 1)
					]),
					r.value ? (B(), V("div", hO, [
						U("span", { class: A(["badge", r.value.reason ? "warn" : "neutral"]) }, j(r.value.reason ? P(X)(`debug.cache.flush.${r.value.reason}`) : P(X)("debug.cache.kept")), 3),
						U("span", gO, j(p(r.value)), 1),
						r.value === n.value.cache ? K("", !0) : (B(), V("span", _O, j(u(r.value.at)), 1))
					])) : K("", !0),
					U("div", null, [(B(!0), V(z, null, R(n.value.regions, (e) => (B(), V("div", {
						key: e.id,
						class: "region"
					}, [U("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						W(P(fx), { class: A(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						U("span", yO, j(e.id), 1),
						U("span", bO, j(e.messages.length) + " · " + j(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + j(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, vO), i.has(e.id) ? (B(), V(z, { key: 0 }, [(B(!0), V(z, null, R(e.messages, (e, t) => (B(), V("div", {
						key: t,
						class: "region-msg"
					}, [U("div", xO, [U("span", SO, j(e.role), 1), G(j(e.chars) + " ch", 1)]), U("div", CO, j(e.content), 1)]))), 128)), e.messages.length ? K("", !0) : (B(), V("div", wO, j(P(X)("debug.emptyRegion")), 1))], 64)) : K("", !0)]))), 128))]),
					n.value.vars?.length ? (B(), V("div", TO, [(B(!0), V(z, null, R(n.value.vars, (e) => (B(), V("div", {
						key: e.id,
						class: "region"
					}, [U("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						W(P(fx), { class: A(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						U("span", DO, j(e.id), 1),
						U("span", OO, j(e.text.length) + " ch", 1)
					], 8, EO), i.has(`var:${e.id}`) ? (B(), V("div", kO, [U("div", AO, j(e.text), 1), e.text ? K("", !0) : (B(), V("div", jO, j(P(X)("debug.emptyRegion")), 1))])) : K("", !0)]))), 128))])) : K("", !0),
					n.value.warnings.length ? (B(), V("div", MO, j(n.value.warnings.join(" · ")), 1)) : K("", !0)
				], 64)) : (B(), V("div", NO, j(P(X)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(dC, {
				title: P(X)("debug.requests"),
				icon: P(Cx),
				collapsible: ""
			}, {
				default: F(() => [(B(!0), V(z, null, R(P(Yp).requests, (e, t) => (B(), V("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [U("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					U("span", FO, j(e.genId) + " · #" + j(e.step), 1),
					e.error ? (B(), V("span", IO, j(P(X)("debug.error")), 1)) : K("", !0),
					U("span", LO, j(f(e.usage)), 1),
					U("span", RO, j(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, PO), s.value === t ? (B(), V(z, { key: 0 }, [
					U("div", zO, [U("span", BO, j(P(X)("debug.request")), 1), W($, {
						icon: P(Ex),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", VO, j(c(e.request)), 1),
					U("div", HO, [U("span", UO, j(P(X)("debug.response")), 1), W($, {
						icon: P(Ex),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", WO, j(e.error ?? c(e.response ?? "")), 1)
				], 64)) : K("", !0)]))), 128)), P(Yp).requests.length ? K("", !0) : (B(), V("div", GO, j(P(X)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(dC, {
				title: P(X)("debug.log"),
				icon: P(oS),
				collapsible: "",
				open: !1
			}, {
				actions: F(() => [W($, {
					icon: P(mS),
					label: P(X)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => P(Yp).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: F(() => [(B(!0), V(z, null, R(g.value, (e, n) => (B(), V("div", {
					key: n,
					class: "req"
				}, [U("div", KO, [
					U("span", qO, j(e.kind), 1),
					t[4] ||= U("span", { class: "grow" }, null, -1),
					U("span", JO, j(u(e.at)), 1)
				]), U("pre", YO, j(c(e.data)), 1)]))), 128)), g.value.length ? K("", !0) : (B(), V("div", XO, j(P(X)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(dC, {
				title: P(X)("debug.annotations"),
				icon: P(Gx),
				help: P(X)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(B(!0), V(z, null, R(_.value, (e, t) => (B(), V("div", {
					key: t,
					class: "req"
				}, [U("div", ZO, [U("span", QO, "#" + j(e.mesId), 1), U("span", $O, "“" + j(e.quote) + "”", 1)]), U("div", ek, j(e.comment), 1)]))), 128)), _.value.length ? K("", !0) : (B(), V("div", tk, j(P(X)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U("div", nk, "Advanced Preset " + j(P("1.10.0")) + " · " + j(P("2deead37254c61fa")), 1)
		], 64));
	}
}), ik = ["aria-label"], ak = { class: "panel-head" }, ok = { class: "panel-logo" }, sk = { class: "grow" }, ck = { class: "panel-title ellipsis" }, lk = { class: "panel-sub ellipsis" }, uk = {
	class: "tabs",
	role: "tablist"
}, dk = [
	"title",
	"aria-selected",
	"onClick"
], fk = { class: "panel-body scroll" }, pk = /* @__PURE__ */ L({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Yx,
				view: Rw
			},
			{
				id: "config",
				icon: lS,
				view: CT
			},
			{
				id: "modules",
				icon: ix,
				view: AD
			},
			{
				id: "writing",
				icon: Zx,
				view: zD
			},
			{
				id: "memory",
				icon: ox,
				view: aO
			},
			{
				id: "debug",
				icon: sx,
				view: rk
			}
		], n = q(() => t.find((e) => e.id === pv.tab) ?? t[0]), r = q({
			get: () => J().enabled,
			set: (e) => {
				J().enabled = e, Y();
			}
		}), i = q(() => {
			let e = gv.value;
			return e ? `v${e.version} · ${_v.value.config}` : X("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && pv.panelOpen && (pv.panelOpen = !1);
		};
		return Br(() => document.addEventListener("keydown", a)), Hr(() => {
			document.removeEventListener("keydown", a), Wb(!1);
		}), cr(() => pv.panelOpen, (e) => {
			e && Wb(!0);
		}, { immediate: !0 }), (e, a) => (B(), H($a, {
			name: "panel",
			onAfterLeave: a[2] ||= (e) => P(Wb)(!1)
		}, {
			default: F(() => [P(pv).panelOpen ? (B(), V("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": P(X)("app.name")
			}, [
				U("header", ak, [
					U("div", ok, [W(P(zx))]),
					U("div", sk, [U("div", ck, j(P(gv) ? P(ef)(P(gv)) : P(X)("app.name")), 1), U("div", lk, j(i.value), 1)]),
					W(fw, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: P(X)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					W($, {
						icon: P(xS),
						label: P(X)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => P(pv).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				U("nav", uk, [(B(), V(z, null, R(t, (e) => U("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: A(["tab", { on: e.id === P(pv).tab }]),
					title: P(X)(`tab.${e.id}`),
					"aria-selected": e.id === P(pv).tab,
					onClick: (t) => P(pv).tab = e.id
				}, [(B(), H(Gr(e.icon))), U("span", null, j(P(X)(`tab.${e.id}`)), 1)], 10, dk)), 64))]),
				U("main", fk, [(B(), H(Pr, null, [(B(), H(Gr(n.value.view), { key: n.value.id }))], 1024))])
			], 8, ik)) : K("", !0)]),
			_: 1
		}));
	}
}), mk = { class: "inline-drawer" }, hk = { class: "inline-drawer-toggle inline-drawer-header" }, gk = { class: "inline-drawer-content" }, _k = { class: "flex-container alignItemsCenter spaceBetween" }, vk = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, yk = { key: 0 }, bk = { class: "text_muted" }, xk = {
	key: 1,
	class: "text_muted"
}, Sk = /* @__PURE__ */ L({
	__name: "SettingsDrawer",
	setup(e) {
		let t = q({
			get: () => J().enabled,
			set: (e) => {
				J().enabled = e, Y();
			}
		});
		return (e, n) => (B(), V("div", mk, [U("div", hk, [U("b", null, j(P(X)("app.name")), 1), n[3] ||= U("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), U("div", gk, [
			U("div", _k, [U("label", vk, [I(U("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Qo, t.value]]), U("span", null, j(P(X)("settings.enable")), 1)]), U("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => P(bv)(),
				onKeydown: n[2] ||= ls((e) => P(bv)(), ["enter"])
			}, [n[4] ||= U("i", { class: "fa-solid fa-layer-group" }, null, -1), U("span", null, j(P(X)("panel.open")), 1)], 32)]),
			n[5] ||= U("hr", null, null, -1),
			U("h4", null, j(P(X)("settings.preset")), 1),
			P(gv) ? (B(), V("div", yk, [G(j(P(ef)(P(gv))) + " ", 1), U("span", bk, "v" + j(P(gv).version) + " · " + j(P(_v).config), 1)])) : (B(), V("i", xk, j(P(X)("settings.inactive")), 1))
		])]));
	}
}), Ck = {
	key: 0,
	class: "preset-banner"
}, wk = { class: "preset-banner-text" }, Tk = /* @__PURE__ */ L({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => P(gv) ? (B(), V("div", Ck, [
			W(P(zx), { class: "preset-banner-icon" }),
			U("span", wk, j(P(X)("banner.usesAp")), 1),
			U("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => P(bv)()
			}, j(P(X)("panel.open")), 1)
		])) : K("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function Ek() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), ps(Sk).mount(t);
}
function Dk() {
	Gv("ap-stages", BS, ["mesid"]), Gv("ap-cards", iw, ["mesid"]), Gv("ap-top-cards", iw, ["mesid", "position"]), Gv("ap-dock", lw), Gv("ap-panel", pk), Gv("ap-preset-banner", Tk), Uv(), hv();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, hv);
	Kb(), Ek(), Ib(), wb();
}
//#endregion
//#region src/index.ts
var Ok = {
	version: "1.10.0",
	buildId: "2deead37254c61fa",
	nextGeneration: (e) => op(e),
	listPresets: () => Vd().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => Yf(),
	update: C_,
	togglePanel: (e) => {
		pv.panelOpen = e ?? !pv.panelOpen;
	},
	annotations: __
};
globalThis.advancedPresetInterceptor = mh, window.AdvancedPreset = Ok;
function kk(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function Ak() {
	for (let { preset: e } of Vd()) try {
		await ep(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function jk() {
	let { eventSource: t, eventTypes: n } = e();
	J(), e_(), Y_(), Dv(), g_(), await i(), await zd();
	for (let { preset: e } of Vd()) {
		let t = Uf(e);
		t.length && Zp("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => ph(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => t_(e)), c_(), t.on(n.MESSAGE_RECEIVED, (e, t) => d_(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		_p.setPending(null), _p.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => _p.sweep());
	let r = kk(() => {
		let e = Yf(), t = e ? Gd(e) : void 0;
		t && ip(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await Ak(), (async () => {
			for (let { preset: e } of Vd()) await I_(e);
		})(), o_({ reload: !0 }), U_(), x_();
	};
	t.on(n.APP_READY, () => void a()), Dk(), Zp("init", {
		version: "1.10.0",
		build: "2deead37254c61fa",
		enabled: J().enabled
	});
}
var Mk = S_, Nk = bb;
jk().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { Mk as advancedPresetOnUpdate, Nk as advancedPresetRegisterChatSurface };

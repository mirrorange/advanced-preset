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
async function h(t, n, r, i) {
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
function g(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var _ = (...e) => globalThis.fetch(...e), v = (e) => {
	_ = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function y(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var b = {}, x = [], S = () => {}, ee = () => !1, C = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), w = (e) => e.startsWith("onUpdate:"), T = Object.assign, te = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ne = Object.prototype.hasOwnProperty, E = (e, t) => ne.call(e, t), D = Array.isArray, re = (e) => de(e) === "[object Map]", ie = (e) => de(e) === "[object Set]", ae = (e) => de(e) === "[object Date]", oe = (e) => de(e) === "[object RegExp]", O = (e) => typeof e == "function", se = (e) => typeof e == "string", ce = (e) => typeof e == "symbol", k = (e) => typeof e == "object" && !!e, le = (e) => (k(e) || O(e)) && O(e.then) && O(e.catch), ue = Object.prototype.toString, de = (e) => ue.call(e), fe = (e) => de(e).slice(8, -1), pe = (e) => de(e) === "[object Object]", me = (e) => se(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, he = /* @__PURE__ */ y(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ge = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, _e = /-\w/g, ve = ge((e) => e.replace(_e, (e) => e.slice(1).toUpperCase())), ye = /\B([A-Z])/g, be = ge((e) => e.replace(ye, "-$1").toLowerCase()), xe = ge((e) => e.charAt(0).toUpperCase() + e.slice(1)), Se = ge((e) => e ? `on${xe(e)}` : ""), Ce = (e, t) => !Object.is(e, t), we = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Te = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Ee = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, De = (e) => {
	let t = se(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Oe, ke = () => Oe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ae(e) {
	if (D(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = se(r) ? Pe(r) : Ae(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (se(e) || k(e)) return e;
}
var je = /;(?![^(]*\))/g, Me = /:([^]+)/, Ne = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Pe(e) {
	let t = {};
	return e.replace(Ne, (e) => e.startsWith("/*") ? "" : e).split(je).forEach((e) => {
		if (e) {
			let n = e.split(Me);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (se(e)) t = e;
	else if (D(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (k(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Fe = /* @__PURE__ */ y("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Ie(e) {
	return !!e || e === "";
}
function Le(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ve(e[i], t[i], n);
	return r;
}
function Re(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ve(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ze(e, t, n) {
	let r = re(e), i = re(t);
	if (r || i || (r = ie(e), i = ie(t), r || i)) return r && i ? Re(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ve(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Be(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ve(e, t, n) {
	if (e === t) return !0;
	let r = ae(e), i = ae(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = ce(e), i = ce(t), r || i ? e === t : (r = D(e), i = D(t), r || i ? r && i ? Be(e, t, n, Le) : !1 : (r = k(e), i = k(t), r || i ? !r || !i ? !1 : Be(e, t, n, ze) : String(e) === String(t))));
}
function He(e, t) {
	return e.findIndex((e) => Ve(e, t));
}
var Ue = (e) => !!(e && e.__v_isRef === !0), j = (e) => se(e) ? e : e == null ? "" : D(e) || k(e) && (e.toString === ue || !O(e.toString)) ? Ue(e) ? j(e.value) : JSON.stringify(e, We, 2) : String(e), We = (e, t) => Ue(t) ? We(e, t.value) : re(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ge(t, r) + " =>"] = n, e), {}) } : ie(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ge(e)) } : ce(t) ? Ge(t) : k(t) && !D(t) && !pe(t) ? String(t) : t, Ge = (e, t = "") => ce(e) ? `Symbol(${e.description ?? t})` : e, Ke, qe = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ke && (Ke.active ? (this.parent = Ke, this.index = (Ke.scopes || (Ke.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ke;
			try {
				return Ke = this, e();
			} finally {
				Ke = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ke, Ke = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ke === this) Ke = this.prevScope;
			else {
				let e = Ke;
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
function Je() {
	return Ke;
}
var Ye, Xe = /* @__PURE__ */ new WeakSet(), Ze = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ke && (Ke.active ? Ke.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Xe.has(this) && (Xe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || tt(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, mt(this), it(this);
		let e = Ye, t = ut;
		Ye = this, ut = !0;
		try {
			return this.fn();
		} finally {
			at(this), Ye = e, ut = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ct(e);
			this.deps = this.depsTail = void 0, mt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Xe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ot(this) && this.run();
	}
	get dirty() {
		return ot(this);
	}
}, Qe = 0, $e, et;
function tt(e, t = !1) {
	e.flags |= 8, t ? (e.next = et, et = e) : (e.next = $e, $e = e);
}
function nt() {
	Qe++;
}
function rt() {
	if (--Qe > 0) return;
	if (et) {
		let e = et;
		for (et = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; $e;) {
		let t = $e;
		for ($e = void 0; t;) {
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
function it(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function at(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ct(r), lt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ot(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (st(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function st(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ht) || (e.globalVersion = ht, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ot(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = Ye, r = ut;
	Ye = e, ut = !0;
	try {
		it(e);
		let n = e.fn(e._value);
		(t.version === 0 || Ce(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Ye = n, ut = r, at(e), e.flags &= -3;
	}
}
function ct(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ct(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function lt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ut = !0, dt = [];
function ft() {
	dt.push(ut), ut = !1;
}
function pt() {
	let e = dt.pop();
	ut = e === void 0 || e;
}
function mt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = Ye;
		Ye = void 0;
		try {
			t();
		} finally {
			Ye = e;
		}
	}
}
var ht = 0, gt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, _t = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!Ye || !ut || Ye === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Ye) t = this.activeLink = new gt(Ye, this), Ye.deps ? (t.prevDep = Ye.depsTail, Ye.depsTail.nextDep = t, Ye.depsTail = t) : Ye.deps = Ye.depsTail = t, vt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Ye.depsTail, t.nextDep = void 0, Ye.depsTail.nextDep = t, Ye.depsTail = t, Ye.deps === t && (Ye.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, ht++, this.notify(e);
	}
	notify(e) {
		nt();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			rt();
		}
	}
};
function vt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) vt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var yt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ Symbol(""), xt = /* @__PURE__ */ Symbol(""), St = /* @__PURE__ */ Symbol("");
function Ct(e, t, n) {
	if (ut && Ye) {
		let t = yt.get(e);
		t || yt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new _t()), r.map = t, r.key = n), r.track();
	}
}
function wt(e, t, n, r, i, a) {
	let o = yt.get(e);
	if (!o) {
		ht++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (nt(), t === "clear") o.forEach(s);
	else {
		let i = D(e), a = i && me(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === St || !ce(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(St)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(bt)), re(e) && s(o.get(xt)));
				break;
			case "delete":
				i || (s(o.get(bt)), re(e) && s(o.get(xt)));
				break;
			case "set": re(e) && s(o.get(bt));
		}
	}
	rt();
}
function Tt(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e || (Ct(t, "iterate", St), /* @__PURE__ */ fn(e)) ? t : /* @__PURE__ */ dn(e) ? /* @__PURE__ */ un(e) ? t.map((e) => gn(hn(e))) : t.map(gn) : t.map(hn);
}
function Et(e) {
	return Ct(e = /* @__PURE__ */ M(e), "iterate", St), e;
}
function Dt(e, t) {
	return /* @__PURE__ */ dn(e) ? gn(/* @__PURE__ */ un(e) ? hn(t) : t) : hn(t);
}
var Ot = {
	__proto__: null,
	[Symbol.iterator]() {
		return kt(this, Symbol.iterator, (e) => Dt(this, e));
	},
	concat(...e) {
		return Tt(this).concat(...e.map((e) => D(e) ? Tt(e) : e));
	},
	entries() {
		return kt(this, "entries", (e) => (e[1] = Dt(this, e[1]), e));
	},
	every(e, t) {
		return Mt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Mt(this, "filter", e, t, (e) => e.map((e) => Dt(this, e)), arguments);
	},
	find(e, t) {
		return Mt(this, "find", e, t, (e) => Dt(this, e), arguments);
	},
	findIndex(e, t) {
		return Mt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Mt(this, "findLast", e, t, (e) => Dt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Mt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Mt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Pt(this, "includes", e);
	},
	indexOf(...e) {
		return Pt(this, "indexOf", e);
	},
	join(e) {
		return Tt(this).join(e);
	},
	lastIndexOf(...e) {
		return Pt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Mt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Ft(this, "pop");
	},
	push(...e) {
		return Ft(this, "push", e);
	},
	reduce(e, ...t) {
		return Nt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Nt(this, "reduceRight", e, t);
	},
	shift() {
		return Ft(this, "shift");
	},
	some(e, t) {
		return Mt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Ft(this, "splice", e);
	},
	toReversed() {
		return Tt(this).toReversed();
	},
	toSorted(e) {
		return Tt(this).toSorted(e);
	},
	toSpliced(...e) {
		return Tt(this).toSpliced(...e);
	},
	unshift(...e) {
		return Ft(this, "unshift", e);
	},
	values() {
		return kt(this, "values", (e) => Dt(this, e));
	}
};
function kt(e, t, n) {
	let r = Et(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ fn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => At(a.next(), n), i !== jt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => At(a._next(), n);
	}
	return a;
}
function At(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var jt = Array.prototype;
function Mt(e, t, n, r, i, a) {
	let o = Et(e), s = o !== e && !/* @__PURE__ */ fn(e), c = o[t];
	if (c !== jt[t]) {
		let t = c.apply(e, a);
		return s ? hn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Dt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Nt(e, t, n, r) {
	let i = Et(e), a = i !== e && !/* @__PURE__ */ fn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Dt(e, t)), n.call(this, t, Dt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Dt(e, c) : c;
}
function Pt(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	Ct(r, "iterate", St);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ pn(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function Ft(e, t, n = []) {
	ft(), nt();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return rt(), pt(), r;
}
var It = /* @__PURE__ */ y("__proto__,__v_isRef,__isVue"), Lt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ce));
function Rt(e) {
	ce(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return Ct(t, "has", e), t.hasOwnProperty(e);
}
var zt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? rn : nn : i ? tn : en).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = D(e);
		if (!r) {
			let e;
			if (a && (e = Ot[t])) return e;
			if (t === "hasOwnProperty") return Rt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ _n(e) ? e : n);
		if ((ce(t) ? Lt.has(t) : It(t)) || (r || Ct(e, "get", t), i)) return o;
		if (/* @__PURE__ */ _n(o)) {
			let e = a && me(t) ? o : o.value;
			return r && k(e) ? /* @__PURE__ */ cn(e) : e;
		}
		return k(o) ? r ? /* @__PURE__ */ cn(o) : /* @__PURE__ */ on(o) : o;
	}
}, Bt = class extends zt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = D(e) && me(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ dn(i);
			if (!/* @__PURE__ */ fn(n) && !/* @__PURE__ */ dn(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ _n(i) && !/* @__PURE__ */ _n(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : E(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ _n(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? Ce(n, i) && wt(e, "set", t, n, i) : wt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = E(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && wt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!ce(t) || !Lt.has(t)) && Ct(e, "has", t), n;
	}
	ownKeys(e) {
		return Ct(e, "iterate", D(e) ? "length" : bt), Reflect.ownKeys(e);
	}
}, Vt = class extends zt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ht = /* @__PURE__ */ new Bt(), Ut = /* @__PURE__ */ new Vt(), Wt = /* @__PURE__ */ new Bt(!0), Gt = (e) => e, Kt = (e) => Reflect.getPrototypeOf(e);
function qt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = re(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Gt : t ? gn : hn;
		return !t && Ct(a, "iterate", c ? xt : bt), T(Object.create(l), { next() {
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
function Jt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Yt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (Ce(n, a) && Ct(i, "get", n), Ct(i, "get", a));
			let { has: o } = Kt(i), s = t ? Gt : e ? gn : hn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Ct(/* @__PURE__ */ M(t), "iterate", bt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (Ce(t, i) && Ct(r, "has", t), Ct(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? Gt : e ? gn : hn;
			return !e && Ct(o, "iterate", bt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return T(n, e ? {
		add: Jt("add"),
		set: Jt("set"),
		delete: Jt("delete"),
		clear: Jt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = Kt(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ fn(e) && !/* @__PURE__ */ dn(e) ? i : e;
			return r.has.call(n, a) || Ce(e, a) && r.has.call(n, e) || Ce(i, a) && r.has.call(n, i) || (n.add(a), wt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ fn(n) && !/* @__PURE__ */ dn(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = Kt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Ce(n, s) && wt(r, "set", e, n, s) : wt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = Kt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && wt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && wt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = qt(r, e, t);
	}), n;
}
function Xt(e, t) {
	let n = Yt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(E(n, i) && i in r ? n : r, i, a);
}
var Zt = { get: /* @__PURE__ */ Xt(!1, !1) }, Qt = { get: /* @__PURE__ */ Xt(!1, !0) }, $t = { get: /* @__PURE__ */ Xt(!0, !1) }, en = /* @__PURE__ */ new WeakMap(), tn = /* @__PURE__ */ new WeakMap(), nn = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new WeakMap();
function an(e) {
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
function on(e) {
	return /* @__PURE__ */ dn(e) ? e : ln(e, !1, Ht, Zt, en);
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
	return ln(e, !1, Wt, Qt, tn);
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
	return ln(e, !0, Ut, $t, nn);
}
function ln(e, t, n, r, i) {
	if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = an(fe(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function un(e) {
	return /* @__PURE__ */ dn(e) ? /* @__PURE__ */ un(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function pn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function mn(e) {
	return !E(e, "__v_skip") && Object.isExtensible(e) && Te(e, "__v_skip", !0), e;
}
var hn = (e) => k(e) ? /* @__PURE__ */ on(e) : e, gn = (e) => k(e) ? /* @__PURE__ */ cn(e) : e;
// @__NO_SIDE_EFFECTS__
function _n(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return vn(e, !1);
}
function vn(e, t) {
	return /* @__PURE__ */ _n(e) ? e : new yn(e, t);
}
var yn = class {
	constructor(e, t) {
		this.dep = new _t(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : hn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ fn(e) || /* @__PURE__ */ dn(e);
		e = n ? e : /* @__PURE__ */ M(e), Ce(e, t) && (this._rawValue = e, this._value = n ? e : hn(e), this.dep.trigger());
	}
};
function P(e) {
	return /* @__PURE__ */ _n(e) ? e.value : e;
}
var bn = {
	get: (e, t, n) => t === "__v_raw" ? e : P(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ _n(i) && !/* @__PURE__ */ _n(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function xn(e) {
	return /* @__PURE__ */ un(e) ? e : new Proxy(e, bn);
}
var Sn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new _t(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function Cn(e) {
	return new Sn(e);
}
var wn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new _t(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ht - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Ye !== this) return tt(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return st(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Tn(e, t, n = !1) {
	let r, i;
	return O(e) ? r = e : (r = e.get, i = e.set), new wn(r, i, n);
}
var En = {}, Dn = /* @__PURE__ */ new WeakMap(), On = void 0;
function kn(e, t = !1, n = On) {
	if (n) {
		let t = Dn.get(n);
		t || Dn.set(n, t = []), t.push(e);
	}
}
function An(e, t, n = b) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ fn(e) || i === !1 || i === 0 ? jn(e, 1) : jn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ _n(e) ? (d = () => e.value, m = /* @__PURE__ */ fn(e)) : /* @__PURE__ */ un(e) ? (d = () => l(e), m = !0) : D(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ un(e) || /* @__PURE__ */ fn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ _n(e)) return e.value;
		if (/* @__PURE__ */ un(e)) return l(e);
		if (O(e)) return c ? c(e, 2) : e();
	})) : d = O(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			ft();
			try {
				f();
			} finally {
				pt();
			}
		}
		let t = On;
		On = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			On = t;
		}
	} : S, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => jn(e(), t);
	}
	let g = Je(), _ = () => {
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
	let v = h ? Array(e.length).fill(En) : En, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => Ce(e, v[t])) : Ce(n, v))) {
					let e = On;
					ft();
					try {
						f && f(), On = u;
						let e = [
							n,
							v === En ? void 0 : h && v[0] === En ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						On = e, pt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new Ze(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => kn(e, !1, u), f = u.onStop = () => {
		let e = Dn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Dn.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function jn(e, t = Infinity, n) {
	if (t <= 0 || !k(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ _n(e)) jn(e.value, t, n);
	else if (D(e)) for (let r = 0; r < e.length; r++) jn(e[r], t, n);
	else if (ie(e) || re(e)) e.forEach((e) => {
		jn(e, t, n);
	});
	else if (pe(e)) {
		for (let r in e) jn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && jn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Mn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Pn(e, t, n);
	}
}
function Nn(e, t, n, r) {
	if (O(e)) {
		let i = Mn(e, t, n, r);
		return i && le(i) && i.catch((e) => {
			Pn(e, t, n);
		}), i;
	}
	if (D(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Nn(e[a], t, n, r));
		return i;
	}
}
function Pn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || b;
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
			ft(), Mn(a, null, 10, [
				e,
				i,
				o
			]), pt();
			return;
		}
	}
	Fn(e, n, i, r, o);
}
function Fn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var In = [], Ln = -1, Rn = [], zn = null, Bn = 0, Vn = /* @__PURE__ */ Promise.resolve(), Hn = null;
function Un(e) {
	let t = Hn || Vn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Wn(e) {
	let t = Ln + 1, n = In.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = In[r], a = Qn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Gn(e) {
	if (!(e.flags & 1)) {
		let t = Qn(e), n = In[In.length - 1];
		!n || !(e.flags & 2) && t >= Qn(n) ? In.push(e) : In.splice(Wn(t), 0, e), e.flags |= 1, Kn();
	}
}
function Kn() {
	Hn ||= Vn.then($n);
}
function qn(e) {
	if (!D(e)) zn && e.id === -1 ? zn.splice(Bn + 1, 0, e) : e.flags & 1 || (Rn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Rn.push(e[t]);
	Kn();
}
function Jn(e, t, n, r = Ln + 1) {
	for (; r < In.length; r++) {
		let n = In[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			In.splice(r, 1), r = e ? r - 1 : Ln, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Yn(e, t, n = 0) {
	if (Rn.length) {
		let e = Rn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Rn.length; i++) {
				let a = Rn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Rn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Qn(e) - Qn(t));
		if (Rn.length = r, zn) {
			for (let e = 0; e < i.length; e++) zn.push(i[e]);
			return;
		}
		for (zn = i, Bn = 0; Bn < zn.length; Bn++) {
			let e = zn[Bn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		zn = null, Bn = 0;
	}
}
var Xn = !1;
function Zn(e, t) {
	if (Xn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Rn);
	e(), Xn = !0;
	try {
		Jn(void 0, t), Yn(void 0, n, t);
	} finally {
		Xn = !1;
	}
}
var Qn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function $n(e) {
	try {
		for (Ln = 0; Ln < In.length; Ln++) {
			let e = In[Ln];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Mn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Ln < In.length; Ln++) {
			let e = In[Ln];
			e && (e.flags &= -2);
		}
		Ln = -1, In.length = 0, Yn(e), Hn = null, (In.length || Rn.length) && $n(e);
	}
}
var er = null, tr = null;
function nr(e) {
	let t = er;
	return er = e, tr = e && e.type.__scopeId || null, t;
}
function F(e, t = er, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && aa(-1);
		let i = nr(t), a = ta.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ta.length; e > a; e--) ra();
			nr(i), r._d && aa(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function rr(e, t) {
	if (er === null) return e;
	let n = La(er), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = b] = t[e];
		i && (O(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && jn(a), r.push({
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
function ir(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (ft(), Nn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), pt());
	}
}
function ar(e, t, n = !1) {
	let r = wa();
	if (r || ci) {
		let i = ci ? ci._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && O(t) ? t.call(r && r.proxy) : t;
	}
}
var or = /* @__PURE__ */ Symbol.for("v-scx"), sr = () => ar(or);
function cr(e, t) {
	return dr(e, null, t);
}
function lr(e, t) {
	return dr(e, null, { flush: "sync" });
}
function ur(e, t, n) {
	return dr(e, t, n);
}
function dr(e, t, n = b) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = T({}, n), c = t && r || !t && a !== "post", l;
	if (Aa) {
		if (a === "sync") {
			let e = sr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = S, e.resume = S, e.pause = S, e;
		}
	}
	let u = Ca;
	s.call = (e, t, n) => Nn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, zi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Gn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = An(e, t, s);
	return Aa && (l ? l.push(f) : c && f()), f;
}
var fr = /* @__PURE__ */ Symbol("_vte"), pr = (e) => e.__isTeleport, mr = /* @__PURE__ */ Symbol("_leaveCb"), hr = /* @__PURE__ */ Symbol("_enterCb");
function gr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Hr(() => {
		e.isMounted = !0;
	}), Wr(() => {
		e.isUnmounting = !0;
	}), e;
}
var _r = [Function, Array], vr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: _r,
	onEnter: _r,
	onAfterEnter: _r,
	onEnterCancelled: _r,
	onBeforeLeave: _r,
	onLeave: _r,
	onAfterLeave: _r,
	onLeaveCancelled: _r,
	onBeforeAppear: _r,
	onAppear: _r,
	onAfterAppear: _r,
	onAppearCancelled: _r
}, yr = {
	name: "BaseTransition",
	props: vr,
	setup(e, { slots: t }) {
		let n = wa(), r = gr();
		return () => {
			let i = t.default && Dr(t.default(), !0), a = i && i.length ? br(i) : n.subTree ? G() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ M(e), { mode: s } = o;
			if (r.isLeaving) return wr(a);
			let c = Tr(a);
			if (!c) return wr(a);
			let l = Cr(c, o, r, n, (e) => l = e);
			c.type !== $i && Er(c, l);
			let u = n.subTree && Tr(n.subTree);
			if (u && u.type !== $i && !ca(u, c) && Or(n.subTree)) {
				let e = Cr(u, o, r, n);
				if (Er(u, e), s === "out-in" && c.type !== $i) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, wr(a);
				s === "in-out" && c.type !== $i ? e.delayLeave = (e, t, n) => {
					let i = Sr(r, u);
					i[String(u.key)] = u, e[mr] = () => {
						t(), e[mr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function br(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== $i) {
			t = n;
			break;
		}
	}
	return t;
}
var xr = yr;
function Sr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function Cr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = Sr(n, e), S = (e, t) => {
		e && Nn(e, r, 9, t);
	}, ee = (e, t) => {
		let n = t[1];
		S(e, t), D(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, C = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[mr] && t[mr](!0);
			let i = x[b];
			if (i && ca(e, i)) {
				let e = i.el[mr];
				if (!e) {
					let t = Or(i);
					e = t && t.el[mr];
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
			t[hr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), C.delayedLeave && C.delayedLeave(), t[hr] = void 0);
			};
			let c = t[hr].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[hr] && t[hr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[mr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[mr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[mr].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = Cr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return C;
}
function wr(e) {
	if (Fr(e)) return e = pa(e), e.children = null, e;
}
function Tr(e) {
	if (!Fr(e)) return pr(e.type) && e.children ? br(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && O(n.default)) return n.default();
	}
}
function Er(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Er(pr(n.type) && Tr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === R && D(e.children)) {
		let n = hi(e.children, !1);
		n && Er(n, t);
	}
}
function Dr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(Dr(o.children, t, s))) : (t || o.type !== $i) && r.push(s == null ? o : pa(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Or(e) {
	if (e.component) return Or(e.component.subTree);
	if (e.type === R) {
		let t = D(e.children) && hi(e.children, !1);
		return t ? Or(t) : void 0;
	}
	if (e.type !== $i) return e;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return O(e) ? /* @__PURE__ */ T({ name: e.name }, t, { setup: e }) : e;
}
function kr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Ar(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var jr = /* @__PURE__ */ new WeakMap();
function Mr(e, t, n, r, i = !1) {
	if (D(e)) {
		e.forEach((e, a) => Mr(e, t && (D(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Pr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Mr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? La(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === b ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ M(d), p = d === b ? ee : (e) => !Ar(u, e) && E(f, e), m = (e, t) => !(t && Ar(u, t));
	if (l != null && l !== c) {
		if (Nr(t), se(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ _n(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (O(c)) Mn(c, s, 12, [o, u]);
	else {
		let t = se(c), r = /* @__PURE__ */ _n(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) D(n) && te(n, a);
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
					s(), jr.delete(e);
				};
				t.id = -1, jr.set(e, t), zi(t, n);
			} else Nr(e), s();
		}
	}
}
function Nr(e) {
	let t = jr.get(e);
	t && (t.flags |= 8, jr.delete(e));
}
ke().requestIdleCallback, ke().cancelIdleCallback;
var Pr = (e) => !!e.type.__asyncLoader, Fr = (e) => e.type.__isKeepAlive, Ir = {
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
		let n = wa(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), zi(() => {
				a.isDeactivated = !1, a.a && we(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && va(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Ji(t.m), Ji(t.a), l(e, f, null, 1, s), zi(() => {
				t.da && we(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && va(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Rr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ra(Pr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !ca(t, o)) ? p(t) : o && (Rr(o), t && Rr(t)), i.delete(e), a.delete(e);
		}
		ur(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Lr(e, t)), t && m((e) => !Lr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Xi(n.subTree.type) ? zi(() => {
				let e = zr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, zr(n.subTree)));
		};
		return Hr(_), Ur(_), Wr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = zr(t);
				if (e.type === i.type && e.key === i.key) {
					Rr(i);
					let e = i.component.da;
					e && zi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!sa(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = zr(r);
			if (s.type === $i) return o = null, s;
			let c = s.type, l = Ra(Pr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Lr(u, l)) || d && l && Lr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = pa(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Er(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Xi(r.type) ? r : s;
		};
	}
};
function Lr(e, t) {
	return D(e) ? e.some((e) => Lr(e, t)) : se(e) ? e.split(",").includes(t) : oe(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Rr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function zr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Br(e, t, n = Ca, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ft();
			let i = Da(n), a = Nn(t, n, e, r);
			return i(), pt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Vr = (e) => (t, n = Ca) => {
	(!Aa || e === "sp") && Br(e, (...e) => t(...e), n);
}, Hr = Vr("m"), Ur = Vr("u"), Wr = Vr("bum"), Gr = "components", Kr = /* @__PURE__ */ Symbol.for("v-ndc");
function qr(e) {
	return se(e) ? Jr(Gr, e, !1) || e : e || Kr;
}
function Jr(e, t, n = !0, r = !1) {
	let i = er || Ca;
	if (i) {
		let n = i.type;
		if (e === Gr) {
			let e = Ra(n, !1);
			if (e && (e === t || e === ve(t) || e === xe(ve(t)))) return n;
		}
		let a = Yr(i[e] || n[e], t) || Yr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Yr(e, t) {
	return e && (e[t] || e[ve(t)] || e[xe(ve(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = D(e);
	if (o || se(e)) {
		let n = o && /* @__PURE__ */ un(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ fn(e), s = /* @__PURE__ */ dn(e), e = Et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? gn(hn(e[n])) : hn(e[n]) : e[n], n, void 0, a && a[n]);
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
function Xr(e, t) {
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
function Zr(e, t, n, r, i, a) {
	if (n ??= {}, er.ce || er.parent && Pr(er.parent) && er.parent.ce) {
		let e = a != null && n.key == null ? T({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = ta.length;
	z();
	let c;
	try {
		let i = o && Qr(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !ce(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = ta.length; e > s; e--) ra();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Qr(e) {
	return e.some((e) => !sa(e) || !(e.type === $i || e.type === R && !Qr(e.children))) ? e : null;
}
var $r = (e) => e ? ka(e) ? La(e) : $r(e.parent) : null, ei = /* @__PURE__ */ T(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => $r(e.parent),
	$root: (e) => $r(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Gn(e.update);
	},
	$nextTick: (e) => e.n ||= Un.bind(e.proxy),
	$watch: (e) => S
}), ti = (e, t) => e !== b && !e.__isScriptSetup && E(e, t), ni = {
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
			else if (ti(r, t)) return o[t] = 1, r[t];
			else if (E(a, t)) return o[t] = 3, a[t];
			else if (n !== b && E(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = ei[t], u, d;
		if (l) return t === "$attrs" && Ct(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== b && E(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, E(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ti(i, t) ? (i[t] = n, !0) : E(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ti(t, s) || E(a, s) || E(r, s) || E(ei, s) || E(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? E(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ri(e) {
	return D(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ii(e, t) {
	return !e || !t ? e || t : D(e) && D(t) ? e.concat(t) : T({}, ri(e), ri(t));
}
function ai() {
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
var oi = 0;
function si(e, t) {
	return function(n, r = null) {
		O(n) || (n = T({}, n)), r != null && !k(r) && (r = null);
		let i = ai(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: oi++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Va,
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, La(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Nn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ci;
				ci = c;
				try {
					return e();
				} finally {
					ci = t;
				}
			}
		};
		return c;
	};
}
var ci = null;
function li(e, t, n = b) {
	let r = wa(), i = ve(t), a = be(t), o = ui(e, i), s = Cn((o, s) => {
		let c, l = b, u;
		return lr(() => {
			let t = e[i];
			Ce(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!Ce(o, c) && !(l !== b && Ce(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), Ce(e, l) && (Ce(e, o) && !Ce(o, u) || f && l !== b && !Ce(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || b : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var ui = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ve(t)}Modifiers`] || e[`${be(t)}Modifiers`];
function di(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || b, i = n, a = t.startsWith("update:"), o = a && ui(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => se(e) ? e.trim() : e)), o.number && (i = i.map(Ee)));
	let s, c = r[s = Se(t)] || r[s = Se(ve(t))];
	!c && a && (c = r[s = Se(be(t))]), c && Nn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Nn(l, e, 6, i);
	}
}
function fi(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (D(a) ? a.forEach((e) => o[e] = null) : T(o, a), k(e) && r.set(e, o), o) : (k(e) && r.set(e, null), null);
}
function pi(e, t) {
	return !e || !C(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), E(e, t[0].toLowerCase() + t.slice(1)) || E(e, be(t)) || E(e, t));
}
function mi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = nr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = ma(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = ma(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : gi(s);
		}
	} catch (t) {
		ta.length = 0, Pn(t, e, 1), _ = U($i);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(w) && (v = _i(v, a)), y = pa(y, v, !1, !0));
	}
	return n.dirs && (y = pa(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Er(pr(y.type) && Tr(y) || y, n.transition), _ = y, nr(g), _;
}
function hi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (sa(r)) {
			if (r.type !== $i || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var gi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || C(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, _i = (e, t) => {
	let n = {};
	for (let r in e) (!w(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function vi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? yi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (bi(o, r, n) && !pi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || yi(r, o, l) : !!o;
	return !1;
}
function yi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!E(e, a) || bi(t, e, a) && !pi(n, a)) return !0;
	}
	return !1;
}
function bi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && k(r) && k(i) ? !Ve(r, i) : r !== i;
}
function xi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Si = {}, Ci = () => Object.create(Si), wi = (e) => Object.getPrototypeOf(e) === Si;
function Ti(e, t, n, r = !1) {
	let i = {}, a = Ci();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Di(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ sn(i) : e.type.props ? i : a, e.attrs = a;
}
function Ei(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (pi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (E(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ve(o);
						i[t] = Oi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Di(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !E(t, a) && ((r = be(a)) === a || !E(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Oi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !E(t, e)) && (delete a[e], l = !0);
	}
	l && wt(e.attrs, "set", "");
}
function Di(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (he(c)) continue;
		let l = t[c], u;
		i && E(i, u = ve(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : pi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ M(n), r = s || b;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Oi(i, t, s, r[s], e, !E(r, s));
		}
	}
	return o;
}
function Oi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = E(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && O(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Da(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === be(n)) && (r = !0));
	}
	return r;
}
function ki(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return k(e) && r.set(e, x), x;
	if (D(a)) for (let e = 0; e < a.length; e++) {
		let t = ve(a[e]);
		Ai(t) && (o[t] = b);
	}
	else if (a) for (let e in a) {
		let t = ve(e);
		if (Ai(t)) {
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
function Ai(e) {
	return e[0] !== "$" && !he(e);
}
var ji = (e) => e === "_" || e === "_ctx" || e === "$stable", Mi = (e) => D(e) ? e.map(ma) : [ma(e)], Ni = (e, t, n) => {
	if (t._n) return t;
	let r = F((...e) => Mi(t(...e)), n);
	return r._c = !1, r;
}, Pi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ji(n)) continue;
		let i = e[n];
		if (O(i)) t[n] = Ni(n, i, r);
		else if (i != null) {
			let e = Mi(i);
			t[n] = () => e;
		}
	}
}, Fi = (e, t) => {
	let n = Mi(t);
	e.slots.default = () => n;
}, Ii = (e, t, n) => {
	for (let r in t) (n || !ji(r)) && (e[r] = t[r]);
}, Li = (e, t, n) => {
	let r = e.slots = Ci();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ii(r, t, n), n && Te(r, "_", e, !0)) : Pi(t, r);
	} else t && Fi(e, t);
}, Ri = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = b;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ii(i, t, n) : (a = !t.$stable, Pi(t, i)), o = t;
	} else t && (Fi(e, t), o = { default: 1 });
	if (a) for (let e in i) !ji(e) && o[e] == null && delete i[e];
}, zi = Zi;
function Bi(e) {
	return Vi(e);
}
function Vi(e, t) {
	let n = ke();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = S, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ca(e, t) && (r = _e(e), de(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === x && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Qi:
				g(e, t, n, r);
				break;
			case $i:
				_(e, t, n, r);
				break;
			case ea:
				e ?? v(t, n, r, o);
				break;
			case R:
				re(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? C(e, t, n, r, i, a, o, s, c) : d & 6 ? ie(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ye);
		}
		u != null && i ? Mr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Mr(e.ref, null, a, e, !0);
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
	}, ee = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, C = (e, t, n, r, i, a, o, s, c) => {
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
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && te(e.children, f, null, i, s, Hi(e, c), l, d), _ && ir(e, null, i, "created"), T(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !he(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && va(p, i, e);
		}
		_ && ir(e, null, i, "beforeMount");
		let v = Wi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && zi(() => {
			try {
				p && va(p, i, e), v && g.enter(f), _ && ir(e, null, i, "mounted");
			} finally {}
		}, s);
	}, T = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Xi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				T(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ha(e[l]) : ma(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || b, m = t.props || b, h;
		if (n && Ui(n, !1), (h = m.onVnodeBeforeUpdate) && va(h, n, t, e), f && ir(t, e, n, "beforeUpdate"), n && Ui(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? E(e.dynamicChildren, d, c, n, r, Hi(t, i), o) : s || ce(e, t, c, null, n, r, Hi(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && zi(() => {
			h && va(h, n, t, e), f && ir(t, e, n, "updated");
		}, r);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Yi(c), f = u && (c.type === R || !ca(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, D = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== b) for (let o in t) !he(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (he(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, re = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), te(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Gi(e, t, !0)) : ce(e, t, n, f, a, o, c, l, u);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : oe(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = Sa(e, r, i);
		if (Fr(e) && (s.ctx.renderer = ye), ja(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, O, o, a), !e.el) {
				let r = s.subTree = U($i);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else O(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (vi(e, t, n)) {
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
					let n = qi(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							zi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Ui(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && we(n), (f = t.props && t.props.onVnodeBeforeUpdate) && va(f, s, t, c), Ui(e, !0);
				let p = mi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), _e(m), e, i, a), t.el = p.el, u === null && xi(e, p.el), r && zi(r, i), (f = t.props && t.props.onVnodeUpdated) && zi(() => va(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Pr(t);
				if (Ui(e, !1), l && we(l), !m && (o = c && c.onVnodeBeforeMount) && va(o, d, t), Ui(e, !0), s && xe) {
					let t = () => {
						e.subTree = mi(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = mi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && zi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					zi(() => va(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Pr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && zi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ze(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Gn(u), Ui(e, !0), l();
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ei(e, t.props, r, n), Ri(e, t.children, n), ft(), Jn(e), pt();
	}, ce = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				le(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				k(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && ge(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? le(l, f, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && te(f, n, r, i, a, o, s, c));
	}, k = (e, t, n, r, i, a, o, s, c) => {
		e ||= x, t ||= x;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? ha(t[f]) : ma(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? ge(e, i, a, !0, !1, d) : te(t, n, r, i, a, o, s, c, d);
	}, le = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? ha(t[l]) : ma(t[l]);
			if (ca(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? ha(t[f]) : ma(t[f]);
			if (ca(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? ha(t[l]) : ma(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) de(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? ha(t[l]) : ma(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, S = 0, ee = Array(y);
			for (l = 0; l < y; l++) ee[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					de(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (ee[_ - m] === 0 && ca(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? de(r, i, a, !0) : (ee[u - m] = l + 1, u >= S ? S = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = b ? Ki(ee) : x;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Yi(f) : r;
				ee[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== C[_] ? ue(d, n, p, 2) : _--);
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
		} else if (c === ea) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[mr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), zi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[mr];
					s._isLeaving && s[mr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (ft(), Mr(s, null, n, e, !0), pt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Pr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && va(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && ir(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ye, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && ge(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && zi(() => {
			_ && va(_, t, e), h && ir(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === R;
		if (o && !a) {
			pe(n, r);
			return;
		}
		if (t === ea) {
			ee(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Or(e) : e, c = () => {
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
		Ji(c), Ji(l), r && we(r), i.stop(), a ? (a.flags |= 8, de(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, de(o, e, t, n)), s && zi(s, t), zi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[fr];
		return n ? f(n) : t;
	}, ve = (e, t, n) => {
		Zn(() => {
			e == null ? t._vnode && de(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : xa());
	}, ye = {
		p: h,
		um: de,
		m: ue,
		r: fe,
		mt: ae,
		mc: te,
		pc: ce,
		pbc: E,
		n: _e,
		o: e
	}, be, xe;
	return t && ([be, xe] = t(ye)), {
		render: ve,
		hydrate: be,
		createApp: si(ve, be)
	};
}
function Hi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ui({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Wi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Gi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (D(r) && D(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ha(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Gi(t, a)), a.type === Qi && (a.patchFlag === -1 && (a = i[e] = ha(a)), a.el = t.el), a.type === $i && !a.el && (a.el = t.el);
	}
}
function Ki(e) {
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
function qi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : qi(t);
}
function Ji(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Yi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Yi(t.subTree) : null;
}
var Xi = (e) => e.__isSuspense;
function Zi(e, t) {
	t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : qn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), Qi = /* @__PURE__ */ Symbol.for("v-txt"), $i = /* @__PURE__ */ Symbol.for("v-cmt"), ea = /* @__PURE__ */ Symbol.for("v-stc"), ta = [], na = null;
function z(e = !1) {
	ta.push(na = e ? null : []);
}
function ra() {
	ta.pop(), na = ta[ta.length - 1] || null;
}
var ia = 1;
function aa(e, t = !1) {
	ia += e, e < 0 && na && t && (na.hasOnce = !0);
}
function oa(e) {
	return e.dynamicChildren = ia > 0 ? na || x : null, ra(), ia > 0 && na && na.push(e), e;
}
function B(e, t, n, r, i, a) {
	return oa(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return oa(U(e, t, n, r, i, !0));
}
function sa(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ca(e, t) {
	return e.type === t.type && e.key === t.key;
}
var la = ({ key: e }) => e ?? null, ua = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : se(e) || /* @__PURE__ */ _n(e) || O(e) ? {
	i: er,
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
		key: t && la(t),
		ref: t && ua(t),
		scopeId: tr,
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
		ctx: er
	};
	return s ? (ga(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= se(n) ? 8 : 16), ia > 0 && !o && na && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && na.push(c), c;
}
var U = da;
function da(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Kr) && (e = $i), sa(e)) {
		let r = pa(e, t, !0);
		return n && ga(r, n), ia > 0 && !a && na && (r.shapeFlag & 6 ? na[na.indexOf(e)] = r : na.push(r)), r.patchFlag = -2, r;
	}
	if (za(e) && (e = e.__vccOpts), t) {
		t = fa(t);
		let { class: e, style: n } = t;
		e && !se(e) && (t.class = A(e)), k(n) && (/* @__PURE__ */ pn(n) && !D(n) && (n = T({}, n)), t.style = Ae(n));
	}
	let o = se(e) ? 1 : Xi(e) ? 128 : pr(e) ? 64 : k(e) ? 4 : O(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function fa(e) {
	return e ? /* @__PURE__ */ pn(e) || wi(e) ? T({}, e) : e : null;
}
function pa(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? _a(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && la(l),
		ref: t && t.ref ? n && a ? D(a) ? a.concat(ua(t)) : [a, ua(t)] : ua(t) : a,
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
		ssContent: e.ssContent && pa(e.ssContent),
		ssFallback: e.ssFallback && pa(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Er(u, c.clone(u)), u;
}
function W(e = " ", t = 0) {
	return U(Qi, null, e, t);
}
function G(e = "", t = !1) {
	return t ? (z(), V($i, null, e)) : U($i, null, e);
}
function ma(e) {
	return e == null || typeof e == "boolean" ? U($i) : D(e) ? U(R, null, e.slice()) : sa(e) ? ha(e) : U(Qi, null, String(e));
}
function ha(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : pa(e);
}
function ga(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (D(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ga(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !wi(t) ? t._ctx = er : r === 3 && er && (er.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (O(t)) {
		if (r & 65) {
			ga(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: er
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [W(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function _a(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = Ae([t.style, r.style]);
		else if (C(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(D(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !w(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function va(e, t, n, r = null) {
	Nn(e, t, 7, [n, r]);
}
var ya = ai(), ba = 0;
function xa() {
	return ba;
}
function Sa(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || ya, a = {
		uid: ba++,
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
		scope: new qe(!0),
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
		propsOptions: ki(r, i),
		emitsOptions: fi(r, i),
		emit: null,
		emitted: null,
		propsDefaults: b,
		inheritAttrs: r.inheritAttrs,
		ctx: b,
		data: b,
		props: b,
		attrs: b,
		slots: b,
		refs: b,
		setupState: b,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = di.bind(null, a), e.ce && e.ce(a), a;
}
var Ca = null, wa = () => Ca || er, Ta, Ea;
{
	let e = ke(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ta = t("__VUE_INSTANCE_SETTERS__", (e) => Ca = e), Ea = t("__VUE_SSR_SETTERS__", (e) => Aa = e);
}
var Da = (e) => {
	let t = Ca;
	return Ta(e), e.scope.on(), () => {
		e.scope.off(), Ta(t);
	};
}, Oa = () => {
	Ca && Ca.scope.off(), Ta(null);
};
function ka(e) {
	return e.vnode.shapeFlag & 4;
}
var Aa = !1;
function ja(e, t = !1, n = !1) {
	t && Ea(t);
	let { props: r, children: i } = e.vnode, a = ka(e);
	Ti(e, r, a, t), Li(e, i, n || t);
	let o = a ? Ma(e, t) : void 0;
	return t && Ea(!1), o;
}
function Ma(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ni);
	let { setup: r } = n;
	if (r) {
		ft();
		let n = e.setupContext = r.length > 1 ? Ia(e) : null, i = Da(e), a = Mn(r, e, 0, [e.props, n]), o = le(a);
		if (pt(), i(), (o || e.sp) && !Pr(e) && kr(e), o) {
			if (a.then(Oa, Oa), t) return a.then((n) => {
				Ea(!0);
				try {
					Na(e, n, t);
				} finally {
					Ea(!1);
				}
			}).catch((t) => {
				Pn(t, e, 0);
			});
			e.asyncDep = a;
		} else Na(e, a, t);
	} else Pa(e, t);
}
function Na(e, t, n) {
	O(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = xn(t)), Pa(e, n);
}
function Pa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || S;
}
var Fa = { get(e, t) {
	return Ct(e, "get", ""), e[t];
} };
function Ia(e) {
	return {
		attrs: new Proxy(e.attrs, Fa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function La(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(xn(mn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ei) return ei[n](e);
		},
		has(e, t) {
			return t in e || t in ei;
		}
	}) : e.proxy;
}
function Ra(e, t = !0) {
	return O(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function za(e) {
	return O(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ Tn(e, t, Aa);
function Ba(e, t, n) {
	try {
		aa(-1);
		let r = arguments.length;
		return r === 2 ? k(t) && !D(t) ? sa(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && sa(n) && (n = [n]), U(e, t, n));
	} finally {
		aa(1);
	}
}
var Va = "3.5.44", Ha = void 0, Ua = typeof window < "u" && window.trustedTypes;
if (Ua) try {
	Ha = /* @__PURE__ */ Ua.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Wa = Ha ? (e) => Ha.createHTML(e) : (e) => e, Ga = "http://www.w3.org/2000/svg", Ka = "http://www.w3.org/1998/Math/MathML", qa = typeof document < "u" ? document : null, Ja = qa && /* @__PURE__ */ qa.createElement("template"), Ya = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? qa.createElementNS(Ga, e) : t === "mathml" ? qa.createElementNS(Ka, e) : n ? qa.createElement(e, { is: n }) : qa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => qa.createTextNode(e),
	createComment: (e) => qa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => qa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ja.innerHTML = Wa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ja.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Xa = "transition", Za = "animation", Qa = /* @__PURE__ */ Symbol("_vtc"), $a = {
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
}, eo = /* @__PURE__ */ T({}, vr, $a), to = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = eo, e))((e, { slots: t }) => Ba(xr, io(e), t)), no = (e, t = []) => {
	D(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, ro = (e) => e ? D(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function io(e) {
	let t = {};
	for (let n in e) n in $a || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = ao(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: C = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, co(e, t ? u : s), co(e, t ? l : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, co(e, d), co(e, p), co(e, f), t && t();
	}, ne = (e) => (t, n) => {
		let i = e ? ee : v, o = () => w(t, e, n);
		no(i, [t, o]), lo(() => {
			co(t, e ? c : a), so(t, e ? u : s), ro(i) || fo(t, r, h, o);
		});
	};
	return T(t, {
		onBeforeEnter(e) {
			no(_, [e]), so(e, a), so(e, o);
		},
		onBeforeAppear(e) {
			no(S, [e]), so(e, c), so(e, l);
		},
		onEnter: ne(!1),
		onAppear: ne(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			so(e, d), e._enterCancelled ? (so(e, f), go(e)) : (go(e), so(e, f)), lo(() => {
				e._isLeaving && (co(e, d), so(e, p), ro(b) || fo(e, r, g, n));
			}), no(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), no(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), no(C, [e]);
		},
		onLeaveCancelled(e) {
			te(e), no(x, [e]);
		}
	});
}
function ao(e) {
	if (e == null) return null;
	if (k(e)) return [oo(e.enter), oo(e.leave)];
	{
		let t = oo(e);
		return [t, t];
	}
}
function oo(e) {
	return De(e);
}
function so(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Qa] || (e[Qa] = /* @__PURE__ */ new Set())).add(t);
}
function co(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Qa];
	n && (n.delete(t), n.size || (e[Qa] = void 0));
}
function lo(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var uo = 0;
function fo(e, t, n, r) {
	let i = e._endId = ++uo, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = po(e, t);
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
function po(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Xa}Delay`), a = r(`${Xa}Duration`), o = mo(i, a), s = r(`${Za}Delay`), c = r(`${Za}Duration`), l = mo(s, c), u = null, d = 0, f = 0;
	t === Xa ? o > 0 && (u = Xa, d = o, f = a.length) : t === Za ? l > 0 && (u = Za, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Xa : Za : null, f = u ? u === Xa ? a.length : c.length : 0);
	let p = u === Xa && /\b(?:transform|all)(?:,|$)/.test(r(`${Xa}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function mo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => ho(t) + ho(e[n])));
}
function ho(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function go(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function _o(e, t, n) {
	let r = e[Qa];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var vo = /* @__PURE__ */ Symbol("_vod"), yo = /* @__PURE__ */ Symbol("_vsh"), bo = /* @__PURE__ */ Symbol(""), xo = /(?:^|;)\s*display\s*:/;
function So(e, t, n) {
	let r = e.style, i = se(n), a = !1;
	if (n && !i) {
		if (t) {
			if (se(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? wo(r, t, "");
			}
			else for (let e in t) n[e] ?? wo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? wo(r, i, "") : Oo(e, i, !se(t) && t ? t[i] : void 0, o) || wo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[bo];
			e && (n += ";" + e), r.cssText = n, a = xo.test(n);
		}
	} else t && e.removeAttribute("style");
	vo in e && ((!i || t !== n) && (e[vo] = a ? r.display : ""), e[yo] && (r.display = "none"));
}
var Co = /\s*!important$/;
function wo(e, t, n) {
	if (D(n)) n.forEach((n) => wo(e, t, n));
	else if (n ??= "", t.startsWith("--")) Co.test(n) ? e.setProperty(t, n.replace(Co, ""), "important") : e.setProperty(t, n);
	else {
		let r = Do(e, t);
		Co.test(n) ? e.setProperty(be(r), n.replace(Co, ""), "important") : e[r] = n;
	}
}
var To = [
	"Webkit",
	"Moz",
	"ms"
], Eo = {};
function Do(e, t) {
	let n = Eo[t];
	if (n) return n;
	let r = ve(t);
	if (r !== "filter" && r in e) return Eo[t] = r;
	r = xe(r);
	for (let n = 0; n < To.length; n++) {
		let i = To[n] + r;
		if (i in e) return Eo[t] = i;
	}
	return t;
}
function Oo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && se(r) && n === r;
}
var ko = "http://www.w3.org/1999/xlink";
function Ao(e, t, n, r, i, a = Fe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ko, t.slice(6, t.length)) : e.setAttributeNS(ko, t, n) : n == null || a && !Ie(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : ce(n) ? String(n) : n);
}
function jo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Wa(n) : n);
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
		r === "boolean" ? n = Ie(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Mo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function No(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Po = /* @__PURE__ */ Symbol("_vei");
function Fo(e, t, n, r, i = null) {
	let a = e[Po] || (e[Po] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ro(t);
		r ? Mo(e, n, a[t] = Ho(r, i), s) : o && (No(e, n, o, s), a[t] = void 0);
	}
}
var Io = /(Once|Passive|Capture)$/, Lo = /^on:?(?:Once|Passive|Capture)$/;
function Ro(e) {
	let t, n;
	for (; (n = e.match(Io)) && !Lo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : be(e.slice(2)), t];
}
var zo = 0, Bo = /* @__PURE__ */ Promise.resolve(), Vo = () => zo ||= (Bo.then(() => zo = 0), Date.now());
function Ho(e, t) {
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
				e && Nn(e, t, 5, a);
			}
		} else Nn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Vo(), n;
}
var Uo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Wo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? _o(e, r, o) : t === "style" ? So(e, n, r) : C(t) ? w(t) || Fo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Go(e, t, r, o)) ? (jo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ao(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ko(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !se(r))) ? jo(e, ve(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ao(e, t, r, o));
};
function Go(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Uo(t) && O(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Uo(t) && se(n) ? !1 : t in e;
}
function Ko(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ve(t);
	return Array.isArray(n) ? n.some((e) => ve(e) === r) : Object.keys(n).some((e) => ve(e) === r);
}
var qo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return D(t) ? (e) => we(t, e) : t;
};
function Jo(e) {
	e.target.composing = !0;
}
function Yo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Xo = /* @__PURE__ */ Symbol("_assign"), Zo = /* @__PURE__ */ Symbol("_initialValue");
function Qo(e, t, n) {
	return t && (e = e.trim()), n && (e = Ee(e)), e;
}
var $o = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Zo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Zo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Xo] = qo(i);
		let a = r || i.props && i.props.type === "number";
		Mo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Xo](Qo(e.value, n, a));
		}), (n || a) && Mo(e, "change", () => {
			e.value = Qo(e.value, n, a);
		}), t || (Mo(e, "compositionstart", Jo), Mo(e, "compositionend", Yo), Mo(e, "change", Yo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Zo];
		delete e[Zo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Xo](Qo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Xo] = qo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Ee(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, es = {
	deep: !0,
	created(e, t, n) {
		e[Xo] = qo(n), Mo(e, "change", () => {
			let t = e._modelValue, n = as(e), r = e.checked, i = e[Xo];
			if (D(t)) {
				let e = He(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ie(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(os(e, r));
		});
	},
	mounted: ts,
	beforeUpdate(e, t, n) {
		e[Xo] = qo(n), ts(e, t, n);
	}
};
function ts(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (D(t)) i = He(t, r.props.value) > -1;
	else if (ie(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ve(t, os(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var ns = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Mo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Ee(as(e)) : as(e)), r = e.multiple, i = r ? ie(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? D(i) ? t.slice() : t : i];
			try {
				e[Xo](i);
			} finally {
				Un(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Xo] = qo(r);
	},
	mounted(e, { value: t }) {
		is(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Xo] = qo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !rs(t, n[1], n[0])) && is(e, t);
	}
};
function rs(e, t, n) {
	if (!n || D(e)) return Ve(e, t);
	if (ie(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function is(e, t) {
	let n = e.multiple, r = D(t);
	if (!n || r || ie(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = as(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : He(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Ve(as(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function as(e) {
	return "_value" in e ? e._value : e.value;
}
function os(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ss = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], cs = {
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
	exact: (e, t) => ss.some((n) => e[`${n}Key`] && !t.includes(n))
}, ls = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = cs[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, us = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, ds = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = be(n.key);
		if (t.some((e) => e === r || us[e] === r)) return e(n);
	}));
}, fs = /* @__PURE__ */ T({ patchProp: Wo }, Ya), ps;
function ms() {
	return ps ||= Bi(fs);
}
var hs = ((...e) => {
	let t = ms().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = _s(e);
		if (!r) return;
		let i = t._component;
		!O(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, gs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function gs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function _s(e) {
	return se(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var vs = () => ({
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
}), ys = null;
function q() {
	if (ys) return ys;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = vs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return ys = /* @__PURE__ */ on(n), ys;
}
var J = () => e().saveSettingsDebounced(), bs = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], xs = [
	"auto",
	"on",
	"off"
], Ss = ["annotations"], Cs = (e) => Ss.includes(e.kind), ws = [
	"keep",
	"truncate",
	"remove"
], Ts = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Es = [
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
function Ds(e) {
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
			if (i >= e.length) throw new Ts("Unterminated string", e, n);
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
		let i = Es.find((t) => e.startsWith(t, n));
		if (!i) throw new Ts(`Unexpected character '${r}'`, e, n);
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
var Os = {
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
function ks(e) {
	let t = Ds(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Ts(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Os ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new Ts(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Ts("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Os[n];
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
	if (u.k !== "end") throw new Ts("Unexpected token", e, u.pos);
	return l;
}
function As(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function js(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function Ms(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => Ms(e, t));
		case "var": return t(e.path);
		case "not": return !js(Ms(e.e, t));
		case "bin": {
			if (e.op === "&&") return js(Ms(e.l, t)) && js(Ms(e.r, t));
			if (e.op === "||") return js(Ms(e.l, t)) || js(Ms(e.r, t));
			let n = Ms(e.l, t), r = Ms(e.r, t);
			switch (e.op) {
				case "==": return As(n, r);
				case "!=": return !As(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => As(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function Ns(e, t) {
	return !e || js(Ms(e, t));
}
function Ps(...e) {
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
var Fs = /\{\{ap::([^{}]*?)\}\}/g;
function Is(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Fs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Is(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Ls(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Rs(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function zs(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Rs(n[3] ?? n[4] ?? "");
	return t;
}
function Bs(e, t) {
	let n = [], r = RegExp(`<${Ls(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: zs(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: zs(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Vs(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Hs(e, t) {
	let n = Bs(e, t)[0];
	return n ? Rs(n.inner).trim() : void 0;
}
function Us(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Ws(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
var Gs = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Ks = {
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
}, qs = ["name", "previous_main"], Js = {
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
}, Ys = {
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
	status: Gs,
	storyline: qs,
	custom: [],
	annotations: []
};
function Xs(e, t = (e) => e) {
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
			properties: Object.fromEntries(Gs.map((e) => [e, i(e)])),
			required: [...Gs],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? qs).filter((e) => qs.includes(e));
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
function Zs(e) {
	return e === "memory" || e === "recap";
}
function Qs(e) {
	let t = {};
	for (let n of Gs) t[n] = tc(Ks[n].map(e).find((e) => e != null)).trim();
	return t;
}
function $s(e) {
	let t = {};
	for (let n of qs) t[n] = tc(Js[n].map(e).find((e) => e != null)).trim();
	return t;
}
function ec(e) {
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
var tc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function nc(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations": return;
		case "reply":
		case "impersonate": return tc(t).trim() || void 0;
		case "recap": return t === null ? null : tc(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = tc(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : tc(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: tc(e.time),
				location: tc(e.location),
				event: tc(e.event),
				summary: tc(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Qs((e) => t[e]);
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
			let e = $s((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: tc(e.label ?? e.title).trim(),
			content: tc(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, tc(t)]));
			}
			return tc(t).trim() || void 0;
	}
}
function rc(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations": return;
		case "reply":
		case "impersonate": return nc(e.kind, Rs(n.inner));
		case "recap": return nc("recap", Rs(n.inner));
		case "memory": return nc("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Hs(e.inner, "scope"),
			operation: Hs(e.inner, "operation"),
			key: Hs(e.inner, "key"),
			content: Hs(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Hs(n.inner, "time") ?? "",
			location: Hs(n.inner, "location") ?? "",
			event: Hs(n.inner, "event") ?? "",
			summary: Hs(n.inner, "summary") ?? ""
		};
		case "status": return Qs((e) => Hs(n.inner, e));
		case "storyline": {
			let e = $s((e) => Hs(n.inner, e));
			return !e.name && !e.previous_main && !/<[A-Za-z_]/.test(n.inner) && (e.name = Rs(n.inner).trim()), e.name || e.previous_main ? e : void 0;
		}
		case "options": return Bs(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Rs(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Rs(t[2]).trim();
				return e;
			}
			return nc("custom", Rs(n.inner), e);
	}
}
function ic(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (Cs(a)) continue;
		let t = Bs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = rc(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Vs(e, i),
		values: n,
		open: r
	};
}
function ac(e) {
	return Rs(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var oc = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function sc(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function cc(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function lc(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function uc(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return oc(e, { n: String(t).padStart(i, "0") }) + r;
}
function dc(e, t, n, r, i) {
	let a = n.filter((e) => !Cs(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: sc(e, t)
		},
		rank: 0,
		index: n
	})), s = lc(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = cc(e, t), i, a = 1;
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
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? uc(u, t + 1, d, n) : n;
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
			return u && n && g(e).length ? uc(u, n.position, d, t) : t;
		}
	};
}
function fc(e, t) {
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
var pc = {
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
}, mc = (e) => e;
function hc(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function gc(e, t) {
	return e.stages.filter((e) => Ns(e.when, t));
}
function _c(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function vc(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function yc(e, t, n = pc) {
	return hc(t.field?.name ?? n.turn.field, vc(e, t));
}
function bc(e, t, n = pc) {
	return hc(t.tool?.name ?? n.stage.name, vc(e, t));
}
function xc(e, t = pc) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var Sc = (e, t) => t ? {
	...e,
	description: t
} : e;
function Cc(e = pc, t = mc, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return Sc({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: Sc({ type: "string" }, i(r.old)),
				new_string: Sc({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function wc(e, t, n = pc, r = mc) {
	return e.kind === "patch" ? Cc(n, r, t) : Sc({ type: "string" }, t);
}
function Tc(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function Ec(e, t, n, r, i = mc) {
	let a = r.filter((e) => !Cs(e)), o = (e, t) => {
		if (e) return i(t ? hc(e, vc(n, t)) : e).trim() || void 0;
	}, s = dc(t, n, a, e, (t) => yc(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => bc(n, t, e), d = (t) => s.stageParam(t, xc(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = Xs(fc(n, r), i), Zs(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = wc(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = xc(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = wc(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), Tc(u(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => Tc(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: Sc({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: Sc(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function Dc(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function Oc(e) {
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
function kc(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = Oc(e);
		return t ? [t] : [];
	});
}
function Ac(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function jc(e) {
	let t = kc(e);
	return t.length ? Ac(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function Mc(e) {
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
function Nc(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Us(t.content)).trimEnd());
}
function Pc(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Fc(e) {
	return e.map((e) => ({
		old_string: Hs(e, "old_string") ?? "",
		new_string: Hs(e, "new_string") ?? ""
	}));
}
function Ic(e, t) {
	let n = Mc(t.stages), r = Ws(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Ls(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = ic(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Bs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Fc(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Rs(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Vs(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = _c(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Ls(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Nc(t.stages, n, t.final), Pc(t.stages, n, t.final), n;
}
function Lc(e, t) {
	let n = Mc(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => yc(t.stages, e)), a = (e, t) => {
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
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Rc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (Cs(e)) continue;
		let r = c(e), i = nc(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = _c(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Nc(t.stages, n, t.final), Pc(t.stages, n, t.final), n;
}
function Rc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function zc(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Bc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = zc(e, n);
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
	let i = n.trim().split(/\s+/).map(Ls), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function Vc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Bc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Hc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Ls(t), "gi"), a = [], o;
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
var Uc = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Wc = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Gc = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Kc(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => qc[e]);
}
var qc = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Jc(e) {
	return e.split(Wc).filter((e) => e !== "");
}
var Yc = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Xc(e) {
	let t = Jc(Yc(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Gc.has(n)) throw new Uc(`Could not find matching close tag for "${e}".`, a);
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
var Zc = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, Qc = (e, t) => {
	throw new Uc(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, $c = /* @__PURE__ */ new Map(), el = 500;
function tl(e) {
	let t = $c.get(e);
	if (t) return t;
	let n = Xc(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Uc(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Kc, Zc, Qc);
	return $c.size >= el && $c.clear(), $c.set(e, i), i;
}
function nl(e, t) {
	return tl(e)(t);
}
function rl(e) {
	try {
		return tl(e), null;
	} catch (e) {
		return e instanceof Uc ? e : new Uc(String(e));
	}
}
function il(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) il(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var al = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, ol = /^\s*(```|~~~)/;
function sl(e) {
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
var cl = /<!--[ \t]*#/g, ll = /<!--|-->/g;
function ul(e, t, n) {
	ll.lastIndex = t;
	for (let t = ll.exec(e); t; t = ll.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function dl(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(al)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(al, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...sl(o),
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
			let t = ul(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? fl(e, t) : t;
		} else if (ol.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		cl.lastIndex = u;
		for (let t = cl.exec(e); t; t = cl.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = ul(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? fl(e, r) : r, cl.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function fl(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var pl = [
	"system",
	"user",
	"assistant"
], ml = ["dialogue", "imperative"];
function hl(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Ps(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = rl(e.text);
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
				pl.includes(n) || t(`@as expects one of ${pl.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: pl.includes(n) ? n : void 0,
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
				if (!n || !ml.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: ks(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = ks(e.raw);
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
function gl(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = dl(e, [], 1, r), a = hl(i.tokens, r);
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
function _l(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => Ns(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var vl = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function yl(e) {
	let t = e.entries.flatMap((e) => vl(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => vl(e));
		t.push(...vl(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...vl(gl(n.text, n.role).content));
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
function bl(e) {
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
function xl(e, t) {
	let n = bl(e), r = bl(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function Sl(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = bl(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = xl(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var Cl = (e) => !!e && typeof e == "object" && !Array.isArray(e), wl = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
}, Tl = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function El(e, ...t) {
	let n = Y(e);
	for (let e of t) n = Dl(n, e);
	return n;
}
function Dl(e, t) {
	if (t === void 0) return e;
	if (!Cl(e) || !Cl(t)) return Y(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = Dl(e[r], i);
	return n;
}
function Ol(e, t) {
	if (Cl(e) && Cl(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Ol(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : Y(e);
}
function kl(e, t, n = "", r = [], i = Al) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? Cl(e[a]) && Cl(t[a]) && (kl(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var Al = /* @__PURE__ */ new Set(["sampling"]);
function jl(e, t, n) {
	let r = Y(e);
	for (let e of t) if (Sl(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && Cl(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Ml(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/params.ts
function Nl(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function Pl(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function Fl(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? Nl(n) : Array.isArray(e.default) ? Nl(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function Il(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Ll(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, Fl(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Rl(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function zl(e, t, n) {
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
function Bl(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Rl(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = zl(r[t.var], t, e));
	}
	return r;
}
var Vl = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Hl(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Vl.test(e);
}
function Ul(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Hl(e) ? e : JSON.stringify(e);
}
var Wl = (e) => !e.includes("\n") && Hl(e) ? e : JSON.stringify(e);
function Gl(e) {
	return e.map((e) => `- ${Ul(e, "  ")}`).join("\n");
}
function Kl(e) {
	return [...e].map(([e, t]) => `${Wl(e)}: ${Ul(t, "  ")}`).join("\n");
}
function ql(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Gl(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Kl(e) : t === "keys" ? Gl([...e.keys()]) : t === "values" ? Gl([...e.values()]) : e.get(t) ?? "";
}
function Jl(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var Yl = {
	enabled: !0,
	freezeVariables: !0
}, Xl = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1
}, Zl = /(?<![A-Za-z0-9_#&/=])#(!?)([^\s#]*)\s*$/u, Ql = (e) => /^[^\s#!?][^\s#]*$/u.test(e) && [...e].length <= 64;
function $l(e) {
	let t = Zl.exec(e);
	if (!t) return null;
	let n = t[2], r = n === "" ? "recent" : n === "?" ? "new" : "name";
	if (r === "name" && !Ql(n)) return null;
	let i = t.index;
	return {
		form: r,
		name: r === "name" ? n : "",
		switchMain: t[1] === "!",
		at: i,
		text: e.slice(0, i).trimEnd()
	};
}
function eu(e) {
	return $l(e)?.text ?? e;
}
function tu(e, t, n = !1) {
	let r = eu(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function nu(e, t, n, r = t.switchMain) {
	return n ? `${e.slice(0, t.at)}#${r ? "!" : ""}${n}` : t.text;
}
function ru(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return Ql(n) ? n : "";
}
function iu(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function au(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var ou = (e) => /^if/i.test(e);
function su(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function cu(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function lu(e, t) {
	return !!e.groups[t]?.allowNone;
}
function uu(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || lu(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Ns(e.when, n)) : i;
}
function du(e, t) {
	let n = new Set(uu(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function fu(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = au(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => e.kind === "storyline" ? i.length ? [{
		...e,
		requested: i
	}] : [] : [e]);
}
function pu(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function mu(e, t, n, r) {
	return t && e.tools ? dc(t, n, r, e.tools, (t) => yc(n, t, e.tools)) : void 0;
}
function hu(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? mu(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = Fl(n, o.params[e]);
		if (Il(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Is(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return ql(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return pu(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${pu(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : Dc(t, (e) => pu(a, o, e));
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
function gu(e, t, n, r, i) {
	return il({
		...Y(e),
		vars: Y(Jl(t)),
		sampling: Y(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function _u(e, t, n) {
	return (r) => {
		try {
			return nl(r.text, e());
		} catch (e) {
			let i = e instanceof Uc ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function vu(e, t) {
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
function yu(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? mu(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? bc(n, t, e.tools) : c?.stageField(t) ?? yc(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", pu(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function bu(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = cu(i), s = a ? gc(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = cu(i), l = uu(n, r, c), u = fu(n, l, i), d = Bl(n.vars, l), f = hu({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Is(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= gu(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Ns(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(..._l(e.content, c, p, _u(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = yu(n, a, s, i.style, i.transport, r, u);
		for (let n of _l(t, c, p, _u(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = vu(e, v.get(e.id) ?? []));
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
function xu(e, t, n = {}) {
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
		modules: du(e, t),
		params: Ll(e, t),
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
		storyline: { ...Xl },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var Su = /* @__PURE__ */ new Set([
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
]), Cu = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), wu = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Tu = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Eu(e, t = {}) {
	let n = (e) => Eu(e, t);
	if (!Tu(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Tu(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Cu.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Tu), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Du({
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
		return Du({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Su.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Tu(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && wu[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Tu(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Du({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Du(i, a);
}
function Du(e, t) {
	return t && (e.nullable = !0), e;
}
function Ou(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Tu(n)) return e;
		let r = Tu(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Eu(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var ku = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Au(e) {
	let t = e.configurationDefaults?.connection;
	return !ku(t) || Object.keys(wl).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...wl,
				...t
			}
		}
	};
}
function ju(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!ku(t) || "userInput" in t) && (!ku(n) || "userInput" in n)) return e;
	let r = ku(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: ku(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: ku(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function Mu(e) {
	let t = e.configurationDefaults;
	if (!ku(t)) return e;
	let n = t.cache;
	return ku(n) && Object.keys(Tl).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...Tl,
				...ku(n) ? n : {}
			}
		}
	};
}
function Nu(e) {
	let t = e.configurationDefaults;
	if (!ku(t)) return e;
	let n = t.meta;
	return ku(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...ku(n) ? n : {}
			}
		}
	};
}
function Pu(e) {
	let t = e.configurationDefaults;
	if (!ku(e.storylines) || !ku(t)) return e;
	let n = t.storylines;
	return ku(n) && Object.keys(Yl).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...Yl,
				...ku(n) ? n : {}
			}
		}
	};
}
function Fu(e) {
	let t = Pu(Nu(Mu(ju(Au(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function Iu(e) {
	return !ku(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 3 ? Fu(e) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var Lu = "user-", Ru = "advanced-preset.user-modules", zu = (e) => `${Lu}${e}`;
function Bu() {
	return {
		match: "all",
		rules: []
	};
}
var Vu = ["on", "off"];
function Hu(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? Vu.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function Uu(e) {
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
function Wu(e, t) {
	let n = Uu(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var Gu = (e) => ({
	t: "lit",
	v: e
});
function Ku(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(Gu)
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
			r: Gu(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function qu(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(Hu).map((e) => {
		if (e.kind === "keyword") return Gu(Wu(e, t));
		if (e.kind === "var") return Ku(e);
		try {
			return ks(e.source);
		} catch {
			return Gu(!1);
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
function Ju(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return ks(e.source), null;
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
function Yu(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function Xu(e, t) {
	return t.entries.filter((t) => !Yu(e, t.point));
}
function Zu(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function Qu(e, t) {
	return (t.vars ?? []).filter((t) => Zu(e, t.var)?.type !== t.type);
}
function $u(e, t) {
	return [.../* @__PURE__ */ new Set([...Xu(e, t).map((e) => e.point), ...Qu(e, t).map((e) => e.var)])];
}
function ed(e) {
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
function td(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function nd(e, t, n) {
	let r = t.filter((e) => e.enabled && (e.entries.length || e.vars?.length));
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = zu(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: qu(t.trigger, n),
			structures: [],
			vars: (t.vars ?? []).filter((t) => Zu(e, t.var)?.type === t.type).map(ed).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = Yu(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && td(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: gl(n.text, n.role).content
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
function rd(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => vl(gl(e.text, e.role).content)));
}
function id(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function ad(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function od(e, t, n) {
	let r = t.filter((e) => Sl(n, e.from));
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
				path: id(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: ad(t.source, e)
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
var sd = (e) => !!e && typeof e == "object" && !Array.isArray(e), cd = (e, t = "") => typeof e == "string" ? e : t, ld = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), ud = [
	"system",
	"user",
	"assistant"
], dd = [
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
function fd(e) {
	if (!sd(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: cd(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && dd.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(ld) : ld(e.value) && (t.value = e.value), t;
	}
	return null;
}
function pd(e) {
	if (!sd(e) || typeof e.var != "string") return [];
	let t = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: cd(e.text)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: t(e.items)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(sd).map((e) => ({
			key: cd(e.key),
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
function md(e) {
	if (!sd(e) || !Array.isArray(e.entries)) return null;
	let t = sd(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!sd(e)) return [];
		let n = {
			id: cd(e.id) || `e${t + 1}`,
			point: cd(e.point),
			text: cd(e.text)
		};
		return ud.includes(e.role) && (n.role = e.role), [n];
	});
	return {
		id: cd(e.id),
		name: cd(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(pd) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(fd).filter((e) => !!e) : []
		}
	};
}
function hd(e, t) {
	return {
		format: Ru,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function gd(e) {
	if (sd(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(md).filter((e) => !!e);
		return {
			preset: sd(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: cd(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = md(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var _d = "{==", vd = "==}", yd = "{>>", bd = "<<}", xd = /\n[ \t]*\n/g;
function Sd(e, t) {
	xd.lastIndex = t;
	let n = xd.exec(e);
	return n ? n.index : Infinity;
}
function Cd(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function wd(e, t, n, r) {
	let i = Sd(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function Td(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(_d, o)) {
		let t = o + 3, s = wd(e, t, vd, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - Cd(n, [vd]));
			break;
		}
		if (s < 0) {
			let n = Math.min(Sd(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || yd.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(yd, l)) {
			let t = l + 3, s = wd(e, t, bd, n);
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
	} else if (e.startsWith(yd, o)) {
		let t = o + 3, i = wd(e, t, bd, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += yd, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (_d.startsWith(t) || yd.startsWith(t))) break scan;
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
function Ed(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function Dd(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function Od(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = Ed(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + Dd(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function kd(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = Od(e, t);
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
function Ad(e, t) {
	let n = kd(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${_d}${t.quote}${vd}${yd}${t.comment}${bd}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function jd(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function Md(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function Nd(e, t, n) {
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
function Pd(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...Y(e)
		})),
		vars: Y(e.vars ?? []),
		trigger: e.trigger ? Y(e.trigger) : Bu()
	};
}
function Fd(e) {
	return {
		id: e.id,
		name: e.name,
		...e.enabled ? {} : { enabled: !1 },
		entries: e.entries.map(({ point: e, role: t, text: n }) => ({
			point: e,
			...t ? { role: t } : {},
			text: n
		})),
		vars: Y(e.vars ?? []),
		trigger: Y(e.trigger)
	};
}
function Id(e) {
	if (Array.isArray(e)) return e.map(Id);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = Id(e[n]));
		return t;
	}
	return e;
}
function Ld(e) {
	return JSON.stringify(Id({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text
		})),
		vars: e.vars ?? [],
		trigger: e.trigger ?? Bu()
	}));
}
function Rd(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, Ld(e.locales[t])]);
	return JSON.stringify([
		Ld(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function zd(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var Bd = "[{{time}} · {{location}}] {{event}}: {{summary}}", Vd = (e) => e === "synopsis" ? Bd : "{{value}}", Hd = "{{content}}";
function Ud(e) {
	let t = e.indexOf(Hd);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(Hd, "");
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
function Wd(e) {
	let t = e.history;
	if (t === void 0 || Cs(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: Ud(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? Vd(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var Gd = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, Kd = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function qd(e) {
	let t = e?.stages ?? [], n = Kd(t);
	return n >= 0 ? sc(e, t[n]) : 0;
}
function Jd(e, t, n) {
	let r = e?.stages ?? [], i = (t) => sc(e, t), a = Kd(r), o = qd(e);
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
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = cc(e, t);
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
var Yd = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Xd(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => Yd(e).trim() !== "");
}
function Zd(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return Qd(Bd, e, t, !1);
		case "status": return ec(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : Yd(t);
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${Yd(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function Qd(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Ys[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? Zd(t, n) : i && (a.has(o) || t === "custom" && o in i) ? Yd(i[o]) : a.has(o) ? "" : e);
}
var $d = (e, t) => Qd(e, "synopsis", t, !1);
function ef(e, t, n) {
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
var tf = /* @__PURE__ */ on(/* @__PURE__ */ new Map()), nf = /* @__PURE__ */ on(/* @__PURE__ */ new Map());
async function rf() {
	try {
		let e = `${s()}dist/presets/`, t = await (await _(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = Iu(await (await _(e + n, { cache: "no-cache" })).json());
			t && tf.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var af = (e) => Iu(e);
function of() {
	return [.../* @__PURE__ */ new Set([
		...tf.keys(),
		...Object.keys(q().installed),
		...nf.keys()
	])].map((e) => sf(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function sf(e) {
	let t = nf.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = lf(e), r = tf.get(e);
	if (n && (!r || xl(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var cf = /* @__PURE__ */ new WeakMap();
function lf(e) {
	let t = q().installed[e];
	if (t) return cf.has(t) || cf.set(t, Iu(t)), cf.get(t) ?? void 0;
}
var uf = (e) => sf(e)?.preset;
function df(e) {
	q().installed[e.id] = e, J();
}
function ff(e) {
	delete q().installed[e], J();
}
function pf(e, t) {
	e ? nf.set(e.id, e) : t ? nf.delete(t) : nf.clear();
}
var mf = (e) => tf.has(e), hf = {
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
	"cards.custom.error": "Component error: {error}",
	"storylines.hint": "End your input with #name to write a side story. AP arranges the chat history by storyline: other side stories first, then the main storyline, the current side story last, with the preset's separator before each storyline.",
	"storylines.enabled": "Storylines",
	"storylines.config.hint": "When off, #tags are sent as plain text and the history keeps its order.",
	"storylines.freezeVariables": "Freeze variables on side storylines",
	"storylines.freezeVariables.hint": "Turns on storylines other than the main one do not run MVU update commands; Tavern Helper chat variables and the variables of the turn's messages are restored to the state the turn started from, so side stories never change the main storyline's state.",
	"storylines.unsupported": "The current preset does not declare storylines.",
	"storylines.off": "Storylines are switched off in the configuration.",
	"storylines.usage.side": "#name: this input belongs to the side story “name” (no tag: the main storyline). No space is needed before #, except after a Latin letter or digit.",
	"storylines.usage.recent": "#: continue the most recent other storyline (#! makes it the main storyline).",
	"storylines.usage.new": "#?: start a new side story the AI names; #!?: start a new main storyline (the AI also names the old main storyline if it has no name).",
	"storylines.usage.if": "#ifName: an if-line, only it sees its own messages.",
	"storylines.usage.main": "#!name: make “name” the main storyline once the reply arrives; the old main storyline becomes a side story (the AI names it if it has no name).",
	"storylines.main": "Main storyline",
	"storylines.mainNamed": "Main · {name}",
	"storylines.current": "Current",
	"storylines.ifLine": "if-line",
	"storylines.ifLine.toggle": "If-line (hidden from the other storylines)",
	"storylines.floors": "{n} messages",
	"storylines.empty": "No messages yet.",
	"storylines.jump": "Jump to this message",
	"storylines.user": "Input",
	"storylines.narrator": "Reply",
	"storylines.makeMain": "Make main",
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
	"storylines.fallback.main": "Previous-main",
	"storylines.switchFailed": "Could not make “{name}” the main storyline; the reply stays on that storyline.",
	"storylines.unnamed": "Unnamed"
}, gf = {
	en: hf,
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
		"cards.custom.error": "组件出错：{error}",
		"storylines.hint": "在输入末尾加上 #名称 来写支线故事。AP 会按故事线整理聊天历史：其他支线在前，主线居中，当前支线在最后；不同故事线之间插入预设定义的分隔消息。",
		"storylines.enabled": "故事线",
		"storylines.config.hint": "关闭后 #标签 按普通文字发送，历史按原顺序发送。",
		"storylines.freezeVariables": "支线轮次不更新变量",
		"storylines.freezeVariables.hint": "在主线以外的故事线上生成时，MVU 不执行变量更新命令；酒馆助手的聊天变量与本轮消息变量恢复为本轮开始时的状态，支线的状态不会带回主线。",
		"storylines.unsupported": "当前预设没有声明故事线功能。",
		"storylines.off": "故事线已在配置中关闭。",
		"storylines.usage.side": "#名称：这条输入属于支线「名称」（不加标签即为主线）。# 前可以不加空格（紧跟英文字母或数字时除外）。",
		"storylines.usage.recent": "#：继续最近的一条其他故事线（#! 则把它设为主线）。",
		"storylines.usage.new": "#?：开始一条由 AI 命名的新支线；#!?：开始一条新主线（原主线没有名称时也由 AI 命名）。",
		"storylines.usage.if": "#if名称：if 线，只有它自己能看到自己的记录。",
		"storylines.usage.main": "#!名称：收到回复后把「名称」设为主线，原主线成为一条支线（原主线没有名称时由 AI 命名）。",
		"storylines.main": "主线",
		"storylines.mainNamed": "主线 · {name}",
		"storylines.current": "当前",
		"storylines.ifLine": "if 线",
		"storylines.ifLine.toggle": "作为 if 线（其他故事线看不到）",
		"storylines.floors": "{n} 层",
		"storylines.empty": "还没有消息。",
		"storylines.jump": "跳转到这条消息",
		"storylines.user": "输入",
		"storylines.narrator": "回复",
		"storylines.makeMain": "设为主线",
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
		"storylines.fallback.main": "原主线",
		"storylines.switchFailed": "未能将「{name}」设为主线，这条回复保留在该故事线上。",
		"storylines.unnamed": "未命名"
	}
};
function _f() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function X(e, t = {}) {
	return ((gf[_f()] ?? gf[_f().split("-")[0]])?.[e] ?? hf[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function vf(e) {
	return e.locales?.[_f()] ?? e.locales?.[_f().split("-")[0]];
}
function yf(e, t, n, r, i) {
	let a = vf(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function bf(e) {
	let t = vf(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function xf(e) {
	let t = vf(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Sf(e, t, n) {
	return Nd(t, _f(), vf(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/core/storylines.ts
var Cf = "advanced_preset_storyline", wf = "advanced_preset_storyline_switched", Tf = "?new", Ef = (e) => e.startsWith("?"), Df = (e) => {
	let t = e && !e.is_user ? e.extra?.[Cf] : void 0;
	return typeof t == "string" ? t : void 0;
};
function Of(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = $l(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : Df(e[o + 1]) ?? "?" : "";
		} else {
			let e = Df(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !Ef(s) && (i = s);
	}), n;
}
var kf = (e, t) => e === "" || e === t.main ? "" : e;
function Af(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? ou(e);
}
var jf = (e, t) => e === "" ? t.main ?? "" : Ef(e) ? "" : e;
function Mf(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !Af(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: jf(e, n),
		main: e === "",
		if: Af(e, n)
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
var Nf = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function Pf(e, t, n, r = !1, i = Nf) {
	return {
		name: i.naming ? "" : jf(e, t),
		main: e === "",
		if: Af(e, t),
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching
	};
}
function Ff(e, t, n) {
	let r = Of(e, n).map((e) => kf(e, n)), i = (e) => ({
		keys: r,
		meta: n,
		current: e,
		input: t,
		...Nf
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? $l(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !Ef(r[n]) && (e = r[n]);
		if (c = nu(a.mes, o, e), l = !e, s(e), !e) return {
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
	if (!o.switchMain) return o.form === "new" ? (s(Tf), {
		...i(Tf),
		naming: !0
	}) : {
		...i(r[t]),
		...u
	};
	if (o.form === "name" && kf(o.name, n) === "") return s(""), {
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
	return delete h[d], {
		keys: r,
		meta: {
			...d ? { main: d } : {},
			if: h
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
var If = (e) => e.is_user ? eu(e.mes) : e.mes, Lf = 983296, Rf = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, zf = (e) => `⟦${String.fromCodePoint(Lf + Math.min(e, 255))}⟧`;
function Bf(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(Rf, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function Vf(e, t, n, r) {
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
function Hf(e, t, n, r) {
	let { meta: i, current: a } = n, o = Of(e, i).map((e) => kf(e, i)), s = Mf(e.map((e, i) => {
		let s = t[i] ?? -1;
		return s >= 0 && s < n.keys.length ? n.keys[s] : i === r ? a : o[i];
	}), a, i, r), c = {
		naming: n.naming,
		namingMain: n.namingMain,
		switching: n.switching,
		...n.target ? { target: n.target } : {},
		...n.oldName ? { oldName: n.oldName } : {},
		...n.renameMain ? { renameMain: !0 } : {}
	}, l = s.order.map((t) => {
		let n = e[t], r = If(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), u = {
		current: a,
		naming: c,
		input: n.input,
		view: Mf(n.keys, a, i).order,
		vars: Pf(a, i, s.isNew, s.grouped, c),
		mainName: i.main ?? "",
		groups: s.groups,
		currentGroup: s.groups.findIndex((e) => e.key === a),
		mainGroup: s.groups.findIndex((e) => e.main),
		grouped: s.grouped,
		hidden: s.hidden
	};
	return {
		items: l,
		realIndex: s.order.map((e) => t[e] ?? -1),
		groups: s.groupOf,
		currentInput: r >= 0 ? s.order.indexOf(r) : -1,
		turn: u
	};
}
var Uf = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function Wf(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = Bf(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = Bf(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var Gf = "advanced_preset";
function Kf(e) {
	let t = e?.extra?.[Gf];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function qf(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: Y(n)
		}
	};
}
function Jf(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Gf] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Gf] = Y(n));
}
function Yf(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[Cf], !n.extra.advanced_preset) ? !1 : (delete n.extra[Gf], !0);
}
//#endregion
//#region src/store/eventlog.ts
function Xf() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var Zf = (e) => `legacy-${e}`;
function Qf(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = Zf(n), t = !0);
	}), t;
}
function $f(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? Zf(e.index) : void 0);
}
var ep = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), tp = "advanced_preset";
function np() {
	return e().chatMetadata?.[tp]?.seedEvents ?? [];
}
function rp(t = Infinity, n) {
	let r = np().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of Kf(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function ip(e = Infinity, t) {
	let n = {};
	for (let { event: r } of rp(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function ap(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of rp(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function op(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = Kf(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[tp] && (e.extra[tp].events = Y(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[tp] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function sp(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function cp(e, t, n, r, i, a = Xf()) {
	let o = e.globalMemory;
	Qf(o.log);
	let s = sp(e)[n] ?? null;
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
var lp = (e) => e.globalMemory.cursor > 0, up = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function dp(e) {
	lp(e) && (e.globalMemory.cursor--, J());
}
function fp(e) {
	up(e) && (e.globalMemory.cursor++, J());
}
function pp(e, t) {
	let n = e.globalMemory.log[ep(e, t)];
	n && (n.prev === null ? cp(e, "delete", n.key, void 0, "undo") : cp(e, "replace", n.key, n.prev, "undo"));
}
function mp(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = Xf();
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
function hp(e, t) {
	for (let n of t) ep(e, n.id) < 0 && cp(e, n.op, n.key, n.content, "model", n.id);
}
function gp(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[ep(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function _p(e) {
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
	}, J()), Qf(n.globalMemory.log) && J(), n;
}
function vp(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Ml(e, n.id)?.diff;
}
function yp(e, t = _p(e).active.ref) {
	return El(e.configurationDefaults, vp(e, _p(e), t));
}
function bp(e) {
	let t = _p(e);
	return El(yp(e, t.active.ref), t.active.diff);
}
function xp(e, t) {
	let n = _p(e);
	n.active.diff = Ol(t, yp(e, n.active.ref)) ?? {}, J();
}
function Sp(e, t) {
	let n = bp(e);
	return t(n), xp(e, n), n;
}
function Cp(e, t) {
	let n = _p(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var wp = (e) => Object.keys(_p(e).active.diff ?? {}).length > 0;
function Tp(e) {
	_p(e).active.diff = {}, J();
}
function Ep(e, t) {
	let n = _p(e), r = bp(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Ol(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function Dp(e, t) {
	let n = _p(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Ol(bp(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function Op(e, t, n) {
	let r = _p(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function kp(e, t) {
	let n = _p(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function Ap(e) {
	let t = _p(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = xl(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? jl(t, e.migrations, n) : Y(t);
		i.push(...kl(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !Pl(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = od(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && $u(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, J(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && g("warning", X("um.lostAfterUpdate", { names: s.join(", ") }), bf(e)), i;
}
//#endregion
//#region src/store/carrier.ts
var jp = "advanced_preset", Mp = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Np = (e) => Mp[e] ?? e, Pp = () => e().getPresetManager("openai"), Fp = (e) => `AP · ${e.name}`;
function Ip() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function Lp(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Rp(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...Y(t.sampling),
		prompts: Y(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: Y(n)
		})),
		extensions: { [jp]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function zp(e) {
	let t = Pp();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Bp(e, t, n) {
	let r = Pp();
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
async function Vp(e, t = {}) {
	let n = Pp(), r = _p(e), i = zp(e.id), a = i ?? Fp(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[jp], c = !o || t.force || s?.hash !== e.hash, l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && Lp(o) !== r.carrierHash && g("info", X("carrier.reset", { name: a }));
		let n = Rp(e, bp(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = Lp(n), J(), await Bp(a, n, !!t.select || l);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function Hp(e) {
	await Vp(e, { select: !0 });
}
async function Up(e) {
	let t = zp(e.id);
	if (!t) return;
	let n = Pp(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = bp(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...Y(i)
	}, o = n.getSelectedPresetName() === t;
	Wp = !0;
	try {
		await Bp(t, a, o);
	} finally {
		Wp = !1;
	}
}
var Wp = !1;
function Gp(t) {
	if (Wp || Ip() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = bp(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Np(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = Y(r));
	}
	return Object.keys(i).length ? (Sp(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var Kp = null, qp = (e) => {
	Kp = e;
}, Jp = () => {
	let e = Kp;
	return Kp = null, e;
}, Yp = (e) => e.meta?.enabled !== !1;
function Xp(t, n) {
	if (!Yp(n)) return "";
	let r = Is(t.meta.trigger, (e) => e[0] === "name" ? pu(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Zp(e, t, n, r, i, a = [], o = !0) {
	let s = Hc(n, Xp(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = cu(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && Ns(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && Ns(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && Ns(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? Jp() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Qp(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var $p = 0, em = () => `ap-${Date.now().toString(36)}-${(++$p).toString(36)}`, tm = /* @__PURE__ */ new Map(), nm = null, rm = null, im = {
	setPending(e) {
		nm = e;
	},
	takePending() {
		let e = nm;
		return nm = null, e;
	},
	peekPending: () => nm,
	arm(e) {
		rm = e, tm.set(e.id, e);
	},
	takeArmed() {
		let e = rm;
		return rm = null, e;
	},
	get: (e) => tm.get(e),
	release(e) {
		tm.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of tm) t - r.createdAt > e && tm.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function am(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function om(e, t) {
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
var sm = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, cm = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), lm = (e, t) => $d(e, t), um = (e, t) => t ? sm(e)?.structures?.[t] : void 0, dm = (e, t) => sm(e)?.structures?.[t];
function fm(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = sm(e);
		if (a && cm.has(a.turn)) {
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
		let n = Hc(e.item.mes, t.trigger, t.wrap);
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
				} else um(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && sm(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && Xd(dm(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function pm(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : um(r, n.synopsisId);
			return e ? lm(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? sm(r)?.annotations : void 0;
			return i?.length && (e = Ad(e, i)), t.echo?.length && n.echoes && (e = mm(e, r, t.echo, n.echoes)), e;
		}
	}
}
function mm(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = dm(t, e.id);
		Xd(a) && e.pieces.forEach((t, n) => i.push({
			text: Qd(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? ef(e, r.contentKey, i) : e;
}
function hm(e, t) {
	let n = [];
	for (let r of fm(e, t)) {
		let e = pm(r, r.fresh, t);
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
function gm(e, t) {
	return hm(e, t).map((e) => e.item);
}
function _m(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? Gd(n) : 0;
	if (r) return uu(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function vm(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function ym(e, t, n, r) {
	let i = new Set(uu(e, t).flatMap((e) => e.structures)), a = n ? cu(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = Wd(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? Ns(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...Jd(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: qd(r)
	} : void 0;
}
var bm = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function xm(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function Sm(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = xm(e), r = xm(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function Cm(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = bm(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = bm(l.text);
			if (c === u || c.includes(u) || Sm(c, u) >= n) {
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
var wm = 50;
function Tm(e) {
	let t = _p(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var Em = () => Math.random().toString(36).slice(2, 8);
function Dm(e) {
	let t = new Set(e), n = Em();
	for (; t.has(n);) n = Em();
	return n;
}
function Om(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: Dm(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function km(e, t) {
	let n = Tm(e), r = {
		id: Dm(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: Bu()
	};
	return e.insertionPoints.length && r.entries.push(Om(e, r)), n.push(r), J(), n[n.length - 1];
}
function Am(e, t) {
	let n = Tm(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(Pd(t, Dm(n.map((e) => e.id)), { name: i })), J(), n[n.length - 1];
}
function jm(e, t, n) {
	let r = Tm(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...Y(r[i]),
		id: Dm(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), J(), r[i + 1];
}
function Mm(e, t) {
	let n = _p(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), J();
}
function Nm(e, t, n) {
	let r = Tm(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), J();
}
function Pm(e, t) {
	return hd(Y(Tm(e).filter((e) => !t || t.includes(e.id))), e);
}
function Fm(e, t) {
	let n = gd(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && xl(n.preset.version, e.version) < 0 && (r = od(r, e.migrations, n.preset.version));
	let i = Tm(e), a = r.map((e) => {
		let t = {
			...e,
			id: Dm(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return J(), {
		added: a,
		missing: a.filter((t) => $u(e, t).length).length
	};
}
function Im(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < wm; t--) {
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
var Lm = /* @__PURE__ */ on({
	log: [],
	requests: []
}), Rm = 50;
function zm(e, t) {
	Lm.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Lm.log.length > Rm && (Lm.log.length = Rm);
}
function Bm(e) {
	return Lm.requests.unshift(e), Lm.requests.length > Rm && (Lm.requests.length = Rm), Lm.requests[0];
}
//#endregion
//#region src/core/cache.ts
function Vm(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Hm(e, t) {
	return e.send_date ? Vm(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var Um = 57344, Wm = /⟦([\uE000-\uF8FF])⟧/g, Gm = (e) => `⟦${String.fromCharCode(Um + e)}⟧`;
function Km(e) {
	let t = [];
	return {
		text: e.replace(Wm, (e, n) => (t.push(n.charCodeAt(0) - Um), "")),
		marks: t
	};
}
function qm(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of fm(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : om(n?.[e], t.synopsisId), l = c ?? s.fresh, u = pm(s, s.fresh, t), d = c ? pm(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = am(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: am(l),
			freshMode: am(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function Jm(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function Ym(e, t, n, r, i, a = {}) {
	let o = Jm(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && Vm(i) === n[r]) r++;
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
		r !== null && f.push(Vm(r));
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
function Xm(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var Zm = "advanced-preset.cache.v1", Qm = 864e5, $m = 30, eh = null;
function th() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function nh() {
	if (eh) return eh;
	try {
		let e = th()?.getItem(Zm), t = e ? JSON.parse(e) : {};
		eh = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		eh = {};
	}
	return eh;
}
function rh(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= Qm).sort((e, t) => t[1].at - e[1].at).slice(0, $m);
	eh = Object.fromEntries(n);
	try {
		th()?.setItem(Zm, JSON.stringify(eh));
	} catch {}
}
function ih() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var ah = (e, t) => t ? `${e}\u0001${t}` : e;
function oh(e) {
	return nh()[e];
}
function sh(e, t) {
	rh({
		...nh(),
		[e]: t
	}, t.at);
}
function ch(e, t) {
	let n = nh()[e];
	n && sh(e, {
		...n,
		at: t
	});
}
//#endregion
//#region src/core/input-shaping.ts
var lh = "⟦󰀀⟧", uh = "⟦󰀁⟧", dh = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function fh(e) {
	let t = e.match(dh)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + lh + t;
}
var ph = (e) => e.replaceAll(lh, "");
function mh(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = ph(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = ph(e.text));
}
function hh(e, t, n, r) {
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
			let n = t.lastIndexOf(lh);
			if (n < 0) continue;
			let a = ph(t.slice(0, n)).replace(dh, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: ph(t.slice(n + 4))
			};
		}
	}
	return null;
}
var gh = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function _h(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? zd(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && gh(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (gh(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var vh = "stream_function_call_arguments";
function yh(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function bh(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function xh(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[vh] = !0, t() && Sh(e));
}
function Sh(e) {
	let t = Ch(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...bh(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Ch(e) {
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
function wh(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of Ec(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Th(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function Eh(e) {
	return Ec(e.preset.tools, e.workflow, e.stages, e.structures, Th(e));
}
function Dh(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${pu(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Oh(e, t, n) {
	let r = hc(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Th(e)(r);
}
function kh(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = Th(r), u = l(o.tool.description);
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
				content: Oh(r, o.response[t], { first: n })
			}
		]
	};
}
function Ah(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && jh(n, e.ctx.preset.tools.jsonStringHint), yh(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && xh(n), n;
}
function jh(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Ou(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Eu(e.json_schema.value, n)
	});
}
function Mh(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var Nh = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", Ph = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(lh, ""), Fh = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(Wm.source).test(e);
function Ih(e) {
	for (let t of e) if (typeof t.content == "string") Fh(t.content) && (t.content = Km(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && Fh(e.text) && (e.text = Km(e.text).text);
}
function Lh(e) {
	if (typeof e.content == "string") {
		if (!Fh(e.content)) return null;
		let { text: t, marks: n } = Km(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => Xm(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !Fh(e.text)) return;
		let i = Km(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = Xm(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function Rh(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = Eh(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return Vm(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function zh(e) {
	return Vm(e.map((e) => `${e.role}\u0000${Nh(e.content)}`).join(""));
}
function Bh(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return Ih(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = Lh(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = Ph(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = Ph(i.content);
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
			sticky: Ph(f),
			fresh: Ph(p),
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
		tools: Rh(e),
		prompt: zh(t.slice(0, n))
	}, p = Ym(l, oh(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function Vh(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? ch(n.chat, t) : sh(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var Hh = "advanced_preset", Uh = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function Wh() {
	let t = e().chatMetadata?.[Hh]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function Gh(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[Hh] ??= {};
	r.storylines = t;
}
function Kh(t = e().chat, n = Wh()) {
	return Of(t, n).map((e) => kf(e, n));
}
function qh(t = e().chat, n = Wh()) {
	let r = new Set(Kh(t, n).filter((e) => e !== "" && !Ef(e)));
	n.main && r.add(n.main);
	for (let e of Object.keys(n.if ?? {})) r.add(e);
	return r;
}
function Jh(t, n = e().chat, r = Wh()) {
	let i = Kh(n, r);
	return Mf(i, t ?? i.at(-1) ?? "", r).order;
}
function Yh(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function Xh(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[Cf] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[Cf] = n);
}
async function Zh(t, n) {
	if (!t) return;
	let r = Wh();
	Gh({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function Qh(t) {
	let n = Wh();
	return !Ql(t) || Kh(e().chat, n).includes(t) ? !1 : (Gh({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
function $h(e) {
	if (!ou(e)) return;
	let t = Wh();
	Gh({
		...t,
		if: {
			...t.if ?? {},
			[e]: !1
		}
	});
}
function eg(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[wf] = !0);
}
async function tg(t, n) {
	let r = Wh();
	if (!Ql(t)) return "invalid";
	if (kf(t, r) === "") return "unchanged";
	let i = e().chat, a = Of(i, r).map((e) => kf(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!Ql(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = tu(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? kf(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Cf] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Cf] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && Af(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t], Gh({
		...r,
		main: t,
		if: c
	});
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/assembler.ts
var ng = /⟦ap:region:([\w.-]+)⟧/g, rg = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function ig(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(ng)) {
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
function ag(t, n, r) {
	if (!Yp(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = pu(t, n, t.user), s = pu(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Kf(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? ac(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function og(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = Kf(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : ec(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var sg = (e) => e?.view;
function cg(t, n) {
	let { preset: r, config: i } = t, a = sg(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = og(r, s), l = ip(Infinity, a), u = sp(_p(r)), d = ap(Infinity, a), f = ag(r, i, s), p = Uh(r, i) ? Wh().main ?? "" : "", m = t.transport;
	return {
		vars: xu(r, i, {
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
				...Xl,
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
			inputText: t.inputShaped ? uh : "",
			storyline: {
				name: t.storylines?.vars.name ?? p,
				main: t.storylines?.mainName ?? p
			}
		}
	};
}
function lg(t, n, r) {
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
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = Cm(c.map(({ m: e }) => ({
		role: e.role,
		text: rg(e.content)
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
			mes: rg(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (Uh(i, a)) {
		let e = Hf(p, m, Ff(l, -1, Wh()), -1);
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = {
		trigger: Xp(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...vm(i),
		echoes: ym(i, a, cg(t, Qp(i, a, t.origin)).vars, Qp(i, a, "story")),
		recap: ap(Infinity, sg(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: _m(i, a),
		...g ? { background: (e) => Uf(g, h[e]) } : {}
	}, v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = ah(ih(), g?.current), n = qm(p, _, oh(e)?.modes, (e) => Hm(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			v.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + Gm(e.entry));
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
	} else for (let e of gm(p, _)) v.set(e.__h, e.mes), y.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = y.get(e);
		e >= 0 && v.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (v.set(e, fh(v.get(e))), t.input = { texts: n });
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
function ug(t, n) {
	let r = n ? null : im.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = bp(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = Zp(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: em(),
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
		keywords: Im(a, n ? o : -1)
	};
}
var dg = Symbol("ap-region");
function fg(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function pg(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? hh(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (mh(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(uh) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		_h(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(uh, () => c) : e;
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
function mg(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return Vf(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = su(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, dg, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && rg(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function hg(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => rg(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${pu(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = rg(t.content);
		if (t[dg] || t.role === "system") return n;
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
var gg = /* @__PURE__ */ new Set();
function _g(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !gg.has(n) && (gg.add(n), g("warning", X("warn.template", { error: n }), X("app.name")));
}
async function vg(t) {
	let { chat: n, dryRun: r } = t;
	if (!q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		Ih(n), mh(n), Wf(n), r || (im.setPending(null), im.takeArmed());
		return;
	}
	let i = Ip(), a = i ? uf(i) : void 0;
	if (!a) {
		let e = ig(n).filter((e) => !e.__anchor);
		Ih(e), mh(e), Wf(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = ug(a, r), s = ig(n), c = Wf(s);
	!o.interceptorRan && !r && lg(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : Qp(a, o.config, o.origin), d = a.inputShaping, f = fg(a, s), p = d && o.input ? hh(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = cg(o, u), g = nd(a, Tm(a), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = bu({
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, u);
	_.warnings.length && _g(_.warnings, o.warnings), o.workflow = u, o.assembly = _, o.stages = _.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : _.structures;
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
			text: ql(t)
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
			return Object.defineProperty(t, dg, { value: !0 }), t;
		}).filter((e) => rg(e.content).trim());
		S.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: rg(e.content).length,
				content: rg(e.content)
			}))
		}), y.push(...n), t === a.anchors.historyStart && (b = y.length);
	}
	let ee = new Set(s.map((e) => e.__anchor).filter(Boolean));
	for (let [e, t] of Object.entries(_.regions)) !ee.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	let C = x < 0 ? y.length : x, w = o.storylines;
	w && (S.storyline = {
		...w.vars,
		groups: w.groups.map((e) => e.main ? `(main) ${e.name}` : e.if ? `(if) ${e.name}` : e.name || "?"),
		hidden: w.hidden,
		grouped: w.grouped
	}, w.grouped && b >= 0 && (C = mg(o, w, y, b, C))), S.cache = Bh(o, y, b, C), S.input = pg(o, y, b, C, S);
	let T = o.transport === "prefill" && !l && b >= 0 ? hg(o, y, b) : y;
	n.splice(0, n.length, ...T.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), zm("assembly", S), !r && !l && u && im.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var yg = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, bg = (e) => typeof e == "object" && !!e && !Array.isArray(e), xg = (e, t) => Uh(e, t) && t?.storylines?.freezeVariables !== !1;
function Sg() {
	let e = Ip(), t = e ? uf(e) : void 0;
	return !!(t && xg(t, bp(t)));
}
function Cg(t, n = e().chat) {
	if (typeof t != "string" || !t) return null;
	let r = Kh(n), i = (e) => Dg?.open && e >= Dg.from ? Dg.line : r[e];
	for (let e = n.length - 1; e >= 0; e--) if (n[e].mes === t) return i(e);
	if (t.length >= 40) {
		for (let e = n.length - 1; e >= 0; e--) if (n[e].mes.includes(t)) return i(e);
	}
	return null;
}
var wg = /* @__PURE__ */ new WeakSet();
function Tg(e, t, n) {
	if (!bg(e) || !Array.isArray(t) || !Sg()) return;
	let r = Cg(n) ?? (Dg?.open ? Dg.line : null);
	r && (t.length && zm("variables", {
		frozen: "mvu",
		storyline: r,
		commands: t.length
	}), t.splice(0, t.length), wg.add(e));
}
function Eg(e, t) {
	bg(e) && wg.has(e) && (wg.delete(e), bg(t) && "stat_data" in t && (e.stat_data = Y(t.stat_data)), e.delta_data = {});
}
var Dg = null;
function Og(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return bg(n) ? n : void 0;
}
var kg = /* @__PURE__ */ new Set(["display_data", "delta_data"]), Ag = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !kg.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function jg(t) {
	Dg = null, t.line !== void 0 && xg(t.preset, t.config) && (Dg = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		from: Math.max(0, t.from),
		chatVars: t.line ? Y(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function Mg() {
	let t = Dg;
	if (!t?.line) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return Dg = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = Y(t.chatVars), r = !0);
	let o = n.chat, s = Kh(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = Og(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = Og(o[t]);
		Ag(n, r) || (t.variables[t.swipe_id ?? 0] = r ? Y(r) : {}, i = !0);
	}
	return (r || i) && zm("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var Ng = () => {
	Dg = null;
};
function Pg() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(yg.commandParsed, (e, t, n) => Tg(e, t, n)), r(yg.updateEnded, (e, t) => Eg(e, t));
	let i = (e) => () => {
		Dg && (e && (Dg.open = !1), setTimeout(() => void Mg().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || Ng();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, Ng);
}
//#endregion
//#region src/core/interceptor.ts
async function Fg(t, n, r, i) {
	if (im.setPending(null), !q().enabled) return;
	let a = Ip(), o = a ? uf(a) : void 0;
	if (!o) return;
	let s = bp(o), c = i || "normal";
	c === "swipe" && Yf(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (Uh(o, s)) {
		let e = Wh(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = Ff(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || Yh(n, i.rewrite), i.noRecent && g("info", X("storylines.noRecent"), X("app.name")));
		let a = Hf(t, r ? t.map((e, t) => t) : f, i, u);
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", _ = t.slice(-6).map((e) => e.mes), v = Im(t, u), { meta: y, flags: b, origin: x } = Zp(o, s, h, c, !0, _), S = s.connection.transport, { vars: ee } = cg({
		preset: o,
		config: s,
		transport: S,
		origin: x,
		stType: c,
		meta: y,
		flags: b,
		storylines: p
	}, Qp(o, s, x)), C = {
		trigger: Xp(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...vm(o),
		echoes: ym(o, s, ee, Qp(o, s, "story")),
		recap: ap(Infinity, sg(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: _m(o, s),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => Uf(p, m[e]) } : {}
	}, w = (e, t) => p?.grouped && m[e] !== void 0 ? zf(m[e]) + t : t, T, te, ne = -1, E = [];
	if (s.cache?.enabled) {
		let e = ah(ih(), p?.current), n = qm(t, C, oh(e)?.modes, (e) => Hm(t[e], f[e] ?? e));
		if (te = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: w(n, t === void 0 ? e.mes : e.mes + Gm(t))
		})), ne = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, ne >= 0) {
			let e = n.out[ne], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			E = t ? [
				t.given,
				t.sticky,
				t.fresh
			].filter((e) => typeof e == "string") : [e.item.mes];
		}
		T = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else {
		let e = hm(t, C);
		te = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: w(t, e.mes)
		} : e), ne = u >= 0 ? e.findIndex((e) => e.index === u) : -1, ne >= 0 && (E = [e[ne].item.mes]);
	}
	let D;
	o.inputShaping && ne >= 0 && E.some((e) => e.trim()) && (te[ne] = {
		...te[ne],
		mes: fh(te[ne].mes)
	}, D = { texts: E }), t.splice(0, t.length, ...te);
	let re = {
		id: em(),
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
		sticky: T,
		input: D,
		storylines: p,
		createdAt: Date.now(),
		warnings: []
	};
	jg({
		preset: o,
		config: s,
		line: p?.current,
		from: re.inputIndex >= 0 ? re.inputIndex : d.length - 1
	}), im.setPending(re);
}
//#endregion
//#region src/core/transports/text.ts
function Ig(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Dh(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => Ic(e, {
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
			content: hc(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Ah({
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
			let n = Mh(t, e.caller);
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
var Lg = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Rg = 32, zg = 10, Bg = 9, Vg = 13, Hg = 160, Ug = 6158, Wg = 8192, Gg = 8203, Kg = 8239, qg = 8287, Jg = 12288, Yg = 65279;
function Xg(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Zg(e) {
	return e >= "0" && e <= "9";
}
function Qg(e) {
	return e >= " ";
}
function $g(e) {
	return ",:[]/{}()\n+".includes(e);
}
function e_(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function t_(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var n_ = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, r_ = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function i_(e) {
	return ",[]/{}\n+".includes(e);
}
function a_(e) {
	return d_(e) || o_.test(e);
}
var o_ = /^[[{\w-]$/;
function s_(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function c_(e, t) {
	let n = e.charCodeAt(t);
	return n === Rg || n === zg || n === Bg || n === Vg;
}
function l_(e, t) {
	let n = e.charCodeAt(t);
	return n === Rg || n === Bg || n === Vg;
}
function u_(e, t) {
	let n = e.charCodeAt(t);
	return n === Hg || n === Ug || n >= Wg && n <= Gg || n === Kg || n === qg || n === Jg || n === Yg;
}
function d_(e) {
	return f_(e) || m_(e);
}
function f_(e) {
	return e === "\"" || e === "“" || e === "”";
}
function p_(e) {
	return e === "\"";
}
function m_(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function h_(e) {
	return e === "'";
}
function g_(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function __(e, t) {
	let n = e.length;
	if (!c_(e, n - 1)) return e + t;
	for (; c_(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function v_(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function y_(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var b_ = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function x_(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = b_[n];
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
function S_(e) {
	return e !== null && e.char === "\"";
}
function C_(e) {
	return e !== null && e.char === "'";
}
function w_(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function T_(e, t) {
	switch (t) {
		case ")": return w_(e, "(") > w_(e, ")");
		case "]": return w_(e, "[") > w_(e, "]");
		case "}": return w_(e, "{") > w_(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var E_ = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, D_ = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function O_(e) {
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
	for (r && a(), a_(e[t]) && y_(n) ? (r || (n = __(n, ",")), g()) : r && (n = g_(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	ne();
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
		let i = r ? c_ : l_, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (u_(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !k_(e, t);) t++;
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
			if (e_(e[t])) for (; t < e.length && t_(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = __(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = g_(n, ",")) : D();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (a_(e[t]) || c ? n = __(n, ":") : re()), i() || (s || c ? n += "null" : re()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = __(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = __(n, ",")), p(), !i()) {
					r || (n = g_(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = __(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = __(n, ",")), t = i();
		t || (n = g_(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, d_(e[t]) || ne());
		let s = e[t] === "&" ? x_(e.slice(t, t + 12)) : null, c = S_(s) || C_(s);
		if (d_(e[t]) || c) {
			let l = p_(e[t]) ? p_ : h_(e[t]) ? h_ : m_(e[t]) ? m_ : f_, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = C(t - 1);
					return !r && $g(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = __(p, "\""), n += p, !0);
				}
				if (t === i) return p = __(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? x_(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || $g(e[t]) && !T_(p, e[t]) || d_(e[t]) && !w(t) || Zg(e[t])) return v(), !0;
					e[t] === "\\" && ne();
					let s = C(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if ($g(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && i_(e[t])) {
					if (e[t - 1] === ":" && n_.test(e.substring(u + 1, t + 2))) for (; t < e.length && r_.test(e[t]);) p += e[t], t++;
					return p = __(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : s_(e) ? p += E_[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (D_[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Xg(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ie();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : s_(n) ? (p += E_[n], t++) : (Qg(n) || te(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = g_(n, "\"", !0);
			let e = n.length;
			n = _() ? v_(n, e, 1) : __(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Zg(e[t]) && T() && (i += "0")), e[t] === "0" && Zg(e[t + 1]) && (a = !0); Zg(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Zg(e[t]) || (i += "0"); Zg(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Zg(e[t]) || (i += "0"); Zg(e[t]);) i += e[t], t++;
			return T() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !t_(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (e_(e[t])) {
			for (; t < e.length && t_(e[t]);) t++;
			let n = t;
			for (; c_(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !i_(e[t]) && !d_(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && n_.test(e.substring(a, t + 2))) for (; t < e.length && r_.test(e[t]);) t++;
		if (t > a) {
			for (; c_(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && c_(e, n);) n--;
		return n;
	}
	function w(t) {
		let n = t + 1;
		for (; n < e.length && c_(e, n);) n++;
		return n >= e.length || $g(e[n]);
	}
	function T() {
		return t >= e.length || $g(e[t]) || c_(e, t);
	}
	function te(e) {
		throw new Lg(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ne() {
		throw new Lg(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function E() {
		throw new Lg("Unexpected end of json string", e.length);
	}
	function D() {
		throw new Lg("Object key expected", t);
	}
	function re() {
		throw new Lg("Colon expected", t);
	}
	function ie() {
		throw new Lg(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function k_(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function A_(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function j_(e, t) {
	let n = A_(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(O_(n));
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
function M_(e, t, n, r) {
	let i = Mc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function N_(e) {
	let { ctx: t, caller: n } = e, r = Eh(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = j_(c(e), i);
		return s = a.value, n.schema ? M_(t, r, a.value, i) : Lc(a.value, {
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
		body: () => Ah(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var P_ = (e, t) => ({
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
function F_(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function I_(e) {
	let { ctx: t, caller: n } = e, r = Eh(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = kh(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = j_((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? M_(t, r, o.value, i) : Lc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => Ah(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = Mh(e, n);
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
function L_(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Eh(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = kh(e, o ? "parallel" : "multi", l), d = [
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
		let i = j_(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? M_(t, s, e, a) : Lc(e, {
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
			return Ah({
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
			let i = F_(e.toolCalls.filter((e) => e.name), r), o = Mh(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(P_(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = Oh(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: Oh(t, a.tools.results.nudge, {
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
function R_(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Ig(e);
		case "structured": return N_(e);
		case "tool-single": return I_(e);
		case "tool-multi": return L_(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function z_(e, t) {
	let n = t ? c({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? f(n) : u(n);
}
var B_ = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function V_(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, B_({
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
			})), a = () => n === null ? "" : (n = null, B_({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + B_({
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
				text: (e) => e ? o("text") + B_({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + B_({
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
					for (let i of e) t++, r = !0, n += B_({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + B_({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + B_({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => B_({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + B_({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + B_({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? B_({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? B_({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? B_({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: H_(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => B_({ error: { message: e } }),
			end: (e) => e ? B_({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? B_({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => B_({
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
			error: (e) => B_({ error: { message: e } }),
			end: (e) => B_({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? B_({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? B_({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? B_({ choices: [{
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
			error: (e) => B_({ error: { message: e } }),
			end: (e) => (e ? B_({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + B_("[DONE]")
		};
	}
}
function H_(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function U_(e, t) {
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
			input: H_(e.arguments)
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
					args: H_(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function W_(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function G_(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function K_(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var q_ = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = G_(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = K_(t);
			if (r) {
				let t = this.open.has(e) ? J_(this.value, n) : void 0;
				Y_(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function J_(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Y_(e, t, n) {
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
var X_ = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Z_(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return X_(t) ? t : void 0;
}
function Q_(e, t) {
	if (!X_(t)) return X_(e) ? e : void 0;
	if (!X_(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = X_(r) && X_(n[e]) ? Q_(n[e], r) : r);
	return n;
}
function $_(e, t) {
	if (!X_(t)) return X_(e) ? e : void 0;
	if (!X_(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : X_(r) && X_(t) ? n[e] = $_(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var ev = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function tv(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var nv = class {
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
				args: new q_()
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
function rv(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function iv(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* av(e, t) {
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
async function* ov(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = tv(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new ev(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new nv();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = tv(t);
		if (n) throw new ev(n);
		i.text = rv(t), i.reasoning = iv(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Z_(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of av(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = tv(e);
		if (r) throw new ev(r);
		i.text += l(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Z_(e);
		c && (i.usage = Q_(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var sv = /* @__PURE__ */ on({ current: null });
function cv(e, t) {
	return sv.current = {
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
	}, sv.current;
}
function lv(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var uv = "/api/backends/chat-completions/generate", dv = { pending: null }, fv = (e) => e?.name === "AbortError";
function pv(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? X("error.toolsUnsupported") : null;
}
async function mv(e, t, n) {
	let r = z_(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = pv(e);
	if (a) return g("error", a, "Advanced Preset"), W_(a, 400);
	let o = e.origin === "task" ? wh(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = cv(e, i);
	if (!i) try {
		let i = await _v(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(U_(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return gv(c, e);
	}
	let l = V_(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await _v(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			fv(e) || (await p(l.error(hv(e))), gv(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var hv = (e) => e instanceof Error ? e.message : String(e);
function gv(e, t) {
	return e.status = fv(t) ? "aborted" : "error", e.error = hv(t), t instanceof ev ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : W_(hv(t));
}
async function _v(t, n, r, i, a, o) {
	let s = String(n.chat_completion_source ?? ""), l = R_({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: z_(s, n)
	}), u = _c(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, m = t.structures.some((e) => e.kind === "annotations") ? (e) => Td(e, { final: !1 }).text : (e) => e, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, g = Date.now(), v = "", y, b = 0, x = !1, S, ee;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), s = Bm({
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
			let n = await _(uv, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), f = 0;
			for await (let e of ov(n, c(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - f < 50) continue;
				f = t;
				let n = l.progress(e, !1);
				if (lv(i, n, v + e.reasoning), p && d) {
					let e = n.stages[d]?.text ?? "";
					e && o(m(e.slice(0, e.length - Us(e))).trimEnd());
				}
			}
			Vh(t), s.response = u.text || JSON.stringify(u.toolCalls), s.durationMs = Date.now() - s.at, s.usage = u.usage;
		} catch (e) {
			if (s.error = hv(e), fv(e) || a?.aborted) {
				(u.text || u.reasoning || u.toolCalls.length) && Vh(t), y = $_(y, u.usage), x = !0, ee = l.progress(u, !1);
				break;
			}
			throw e;
		}
		v += u.reasoning, y = $_(y, u.usage), l.progress(u, !0);
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
	let C = ee ?? l.result();
	if (x) for (let e of Object.values(C.stages)) e.status === "streaming" && (e.status = "interrupted");
	lv(i, C, v);
	let w = vv(t, C, l.rawText(), l.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - g,
		interrupted: x
	});
	return w.toolCalls = S, w.usage = y, S && (w.content = ""), i.status = x ? "aborted" : "done", w;
}
function vv(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Vc(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Ws(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = Td(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Td(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), S = v("recap"), ee = v("memory"), C = t.meta.mixed ? "meta-mixed" : "story", w = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? w = i === void 0 ? u || Ws(r).trim() : JSON.stringify(i) : u || (C = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", w = b ? ac(b) : "", !w && x && typeof n.structures[x.id] == "string" && (w = "…"), !w && S && n.structures[S.id] && (w = "…"))), !w && !o.interrupted) throw Error(X("error.emptyTurn"));
	let T = [], te = [], ne = t.interceptorRan && t.stType !== "quiet";
	if (ne && ee && Array.isArray(n.structures[ee.id])) {
		let e = mp(n.structures[ee.id]);
		T.push(...e.events), te = e.global;
	}
	if (ne && S && typeof n.structures[S.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		T.push({
			type: "recap.set",
			text: n.structures[S.id],
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
	}), D = {
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
		events: T,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, re = {
		content: w,
		reasoning: a,
		sidecar: D,
		...te.length ? { global: te } : {}
	};
	return ne ? dv.pending = {
		ctx: t,
		outcome: re,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: D
	}), sv.current?.genId === t.id && (sv.current.structures = n.structures), re;
}
//#endregion
//#region src/core/fetch-gate.ts
var yv = "__ap_gen_id";
function bv(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function xv() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	v(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(bv(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[yv], r = typeof t == "string" ? im.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[yv], r.claimed = !0;
				try {
					return await mv(r, e, n.signal);
				} finally {
					im.release(t);
				}
			}
			e && (delete e[yv], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Sv(e) {
	let t = im.takeArmed();
	t && (e[yv] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function Cv(e) {
	let t = await tg(e);
	if (t === "invalid") return g("warning", X("storylines.invalidName"), X("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && g("warning", X("storylines.nameTaken", { name: n }), X("app.name")), t === "invalid" && g("warning", X("storylines.invalidName"), X("app.name"));
		let r = await h(`<h3>${p(X("storylines.switchTitle", { name: e }))}</h3><p>${p(X("storylines.askOldMain"))}</p>`, n, X("storylines.switch"), X("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = Ql(n) ? await tg(e, n) : "invalid";
	}
	return t === "switched" && g("success", X("storylines.switched", { name: e }), X("app.name")), !0;
}
async function wv(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) return Xh(t, n.current);
	let a = r && typeof r == "object" ? r : {}, o = qh(), s = (e, t) => {
		let n = iu(ru(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(Wh().main ?? "");
		let e = s(a.name, X("storylines.fallback.side"));
		return e !== Wh().main && !await Qh(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), Xh(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, X("storylines.fallback.side"));
		$h(n), Xh(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, X("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, X("storylines.fallback.main")) : void 0), u = await tg(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), g("warning", X("storylines.switchFailed", { name: c }), X("app.name")), Xh(t, c);
	i.naming && n.input >= 0 && eg(n.input), Xh(t, ""), u === "switched" && g("success", X("storylines.switched", { name: c }), X("app.name"));
}
function Tv(e, t) {
	if (!q().enabled) return e;
	let n = Ip(), r = n ? uf(n) : void 0;
	if (!r || !Uh(r, bp(r)) || $l(e)) return e;
	let i = Kh(), a = i[t ?? i.length - 1];
	return !a || Ef(a) ? e : tu(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var Ev = "\0";
function Dv(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = $f(e);
		r && t.add(`${n.presetId}${Ev}${r}`);
	}
}
function Ov(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && Dv(r.extra?.[Gf], t), r.swipe_info?.forEach((e, t) => {
			t !== i && Dv(e?.extra?.[Gf], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var kv = null;
function Av(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = Ov(n.chat ?? []), o = new Set(a);
	if (kv && !t.reload && kv.chatId === r) for (let e of kv.active) i.has(e) || o.add(e);
	kv = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(Ev), i = s.get(n);
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
		n?.globalMemory && (Qf(n.globalMemory.log) && (l = !0), gp(n, t.off, !1) && (l = !0), gp(n, t.on, !0) && (l = !0));
	}
	return l && J(), l;
}
function jv(e) {
	Yf(e), Av();
}
function Mv() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => jv(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => Av());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => Av({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var Nv = 6e5, Pv = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Fv(t, n) {
	let r = dv.pending;
	if (!r || Date.now() - r.at > Nv || Pv.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	dv.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), Jf(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await wv(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && hp(_p(r.ctx.preset), a.global), Av(), sv.current?.genId === r.ctx.id && (sv.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var Iv = /* @__PURE__ */ new Set();
function Lv(e) {
	for (let t of Iv) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function Rv(t) {
	let n = e().chat[t], r = Kf(n)?.annotations;
	return !n || !r?.length ? [] : kd(n.mes, r).annotations;
}
function zv(t) {
	let n = e().chat[t], r = Kf(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = kd(n.mes, r.annotations);
	return i.changed ? (Jf(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function Bv() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (zv(n) && e().saveChat(), Lv(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => Lv(Number(e)));
}
var Vv = {
	get: (e) => Rv(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return Iv.add(t), () => Iv.delete(t);
	}
}, Hv = "advancedPreset.reloadedFor";
async function Uv() {
	try {
		let e = await _(`${s()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Wv(e) {
	sessionStorage.setItem(Hv, e), g("info", X("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Gv() {
	let e = await Uv();
	e && e !== "975d70c798c1ace6" && sessionStorage.getItem(Hv) !== e && Wv(e);
}
async function Kv() {
	await Gv();
}
async function qv() {
	let e = o().replace(/^third-party\//, ""), t = await Jv(e, !1);
	if (t.status === 404 && (t = await Jv(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Uv();
	return r && r !== "975d70c798c1ace6" ? (Wv(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var Jv = (t, n) => _("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
});
//#endregion
//#region src/store/bundled-modules.ts
function Yv(e, t, n, r) {
	return md({
		...Y(Nd(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function Xv(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of jd(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = Yv(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = Rd(o), u = Ld(c), d = n?.[o.id];
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
		let f = Ld(s);
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
function Zv(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function Qv(e, t, n = []) {
	let r = _p(e), i = Tm(e), a = { ...t.records };
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
function $v(e, t, n) {
	let r = jd(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && Yv(e, i, n, t.enabled);
		if (i && a && Ld(a) === Ld(t)) {
			let { enabled: e, ...n } = Y(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return Fd(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function ey(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var ty = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
//#endregion
//#region src/app/bundled-modules.ts
function ny(e, t, n) {
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
async function ry(e, t) {
	let { root: n, checked: r } = ny(X("um.bundled.conflictTitle"), X("um.bundled.conflictBody", { name: bf(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: X(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await m(n, X("um.bundled.apply"), X("um.bundled.keepAll")) ? r() : [];
}
async function iy(e, t) {
	let n = _p(e), r = Xv(e, Tm(e), n.bundledModules, _f());
	if (Zv(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await ry(e, a)), Qv(e, r, i), r.add.length && g("info", X("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), bf(e));
}
var ay = /* @__PURE__ */ new Map();
function oy(e, t = {}) {
	let n = e.id, r = (ay.get(n) ?? Promise.resolve()).then(() => iy(uf(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return ay.set(n, r), r;
}
async function sy(e) {
	let t = Tm(e), n = [];
	if (t.length) {
		let { root: r, checked: i } = ny(X("um.bundled.exportTitle", { name: bf(e) }), X("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || X("um.untitled"),
			...e.enabled ? {} : { note: X("um.bundled.disabled") },
			checked: !0
		})));
		if (!await m(r, X("um.bundled.export"), X("common.cancel"))) return !1;
		let a = i();
		n = t.filter((e) => a.includes(e.id));
	}
	return ey(`${ty(e.id)}.apreset.json`, $v(e, n, _f())), !0;
}
//#endregion
//#region src/app/dev-source.ts
var cy = /* @__PURE__ */ on({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), ly = 1500, uy = null;
async function dy() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await _(`${n}/`, { cache: "no-store" })).json();
		if (cy.status = "online", cy.error = e.ok === !1 ? "build failed" : "", cy.at = Date.now(), !e.hash || e.hash === cy.hash) return;
		let t = af(await (await _(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		cy.presetId && cy.presetId !== t.id && pf(null, cy.presetId), pf(t), cy.presetId = t.id, cy.hash = t.hash, Ap(t), await Vp(t), oy(t, { auto: !0 }), zm("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		cy.status = "error", cy.error = e instanceof Error ? e.message : String(e);
	}
}
function fy() {
	if (uy && clearTimeout(uy), uy = null, !q().dev.enabled) {
		cy.presetId && pf(null, cy.presetId), Object.assign(cy, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	cy.status === "off" && (cy.status = "connecting");
	let e = async () => {
		await dy(), q().dev.enabled && (uy = setTimeout(e, ly));
	};
	e();
}
function py() {
	ur(() => [q().dev.enabled, q().dev.url], () => {
		cy.hash = "", fy();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var my = "#option_impersonate, #mes_impersonate", hy = () => document.querySelector("#send_textarea");
function gy(e, t = !1, n) {
	let r = hy();
	r && (r.value = n === void 0 ? e : Tv(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function _y() {
	if (!q().enabled) return null;
	let t = Ip(), n = t ? uf(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = bp(n);
	if (!Yp(r)) return null;
	let i = Is(n.meta.impersonatePrompt, (e) => e[0] === "name" ? pu(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function vy(e) {
	if (!e.target?.closest?.(my)) return;
	let t = _y();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = hy()?.value.trim();
	gy(Tv(n ? `${t}\n${n}` : t), !0);
}
function yy() {
	window.addEventListener("click", vy, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function by(e) {
	let t = jc(e);
	if (!t) return !1;
	let n = q().presets[e.id]?.customUi, r = sf(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function xy(e) {
	let t = q().presets[e.id]?.customUi;
	return !!(t && t.hash === jc(e));
}
function Sy(e, t) {
	_p(e).customUi = {
		enabled: t,
		hash: jc(e)
	}, J();
}
//#endregion
//#region src/app/trust.ts
var Cy = class extends Error {
	constructor() {
		super(X("trust.declined")), this.name = "TrustDeclined";
	}
}, wy = (e) => e instanceof Cy, Ty = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function Ey(e, t, n, r) {
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
var Dy = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function Oy(e, t) {
	let n = yl(e);
	if (!n.length || t && Ty(n, yl(t))) return;
	let r = bf(e);
	if (!await m(Ey(X("trust.presetTitle"), X("trust.preset", { name: r }), n.length, Dy(n)), X("trust.install"), X("common.cancel"))) throw new Cy();
}
async function ky(e) {
	let t = rd(e);
	if (t.length && !await m(Ey(X("trust.modulesTitle"), X("trust.modules", { n: e.length }), t.length, Dy(t)), X("trust.import"), X("common.cancel"))) throw new Cy();
}
async function Ay(e) {
	let t = kc(e);
	if (!t.length) return !1;
	let n = t.map((t) => yf(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(X("common.listSeparator")), r = await m([
		`<h3>${p(X("trust.uiTitle"))}</h3>`,
		`<p>${p(X("trust.uiBody", {
			name: bf(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${p(X("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${p(Dy(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), X("trust.enableUi"), X("trust.notNow"));
	return Sy(e, r), r;
}
async function jy(e) {
	kc(e).length && !xy(e) && await Ay(e);
}
//#endregion
//#region src/app/install.ts
function My(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function Ny(e, t) {
	let n = af(e);
	if (!n) throw Error(X("presets.invalid"));
	if (n.minAdvancedPreset && xl("1.10.0", n.minAdvancedPreset) < 0) throw Error(X("presets.tooNew", { version: n.minAdvancedPreset }));
	await Oy(n, uf(n.id)), df(n), t && (q().sources[n.id] = t), J();
	let r = uf(n.id) ?? n;
	return Ap(r), sf(r.id)?.source === "installed" && await jy(r), await Vp(r), await oy(r), r;
}
async function Py(e) {
	let t = await _(My(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return Ny(await t.json(), e.trim());
}
async function Fy(e) {
	return Ny(JSON.parse(await e.text()));
}
async function Iy(t) {
	if (ff(t), delete q().sources[t], J(), mf(t)) {
		let e = uf(t);
		e && (Ap(e), await Vp(e), await oy(e));
		return;
	}
	let n = zp(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/state.ts
var Z = /* @__PURE__ */ on({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), Ly = () => {
	Z.chatRev++;
}, Ry = () => {
	Z.presetId = Ip();
}, zy = K(() => Z.presetId ? uf(Z.presetId) : void 0), By = K(() => {
	let e = zy.value;
	if (!e) return { config: "" };
	let t = _p(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : yf(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function Vy(t) {
	return Z.chatRev, e().chat[t];
}
function Hy(e) {
	return Kf(Vy(e));
}
function Uy(e) {
	Z.storylineFocus = e, Wy("storylines");
}
function Wy(e) {
	e && (Z.tab = e), Z.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var Gy = "openai_preset_import_file", Ky = "export_oai_preset";
function qy(e) {
	return typeof e == "object" && !!e && typeof e.id == "string" && Array.isArray(e.entries);
}
var Jy = /* @__PURE__ */ new WeakSet();
async function Yy(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (qy(n)) {
		e.value = "";
		try {
			let e = await Ny(n);
			await Hp(e), Ry(), g("success", X("presets.installed"), bf(e)), Wy("presets");
		} catch (e) {
			wy(e) ? g("info", e.message, X("app.name")) : g("error", e instanceof Error ? e.message : String(e), X("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		Jy.add(t), e.dispatchEvent(t);
	}
}
function Xy() {
	let e = Ip(), t = e ? uf(e) : void 0;
	return t ? (sy(t).catch((e) => g("error", e instanceof Error ? e.message : String(e), X("app.name"))), !0) : !1;
}
function Zy() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== Gy || Jy.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), Yy(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${Ky}`) && Xy() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var Qy = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", $y = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", eb = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}", tb = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>svg.lucide{width:1em;height:1em}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text{field-sizing:content;min-height:5.5em;max-height:24em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:minmax(5em,36%) 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row.list{grid-template-columns:1fr auto}.um-var-key{text-overflow:ellipsis;min-width:0;font-weight:600}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:1.15em}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storyline-usage{gap:2px}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-actions{gap:var(--ap-space-2)}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", nb = /* @__PURE__ */ on({ mode: "light" }), rb = new CSSStyleSheet();
rb.replaceSync([
	Qy,
	$y,
	eb,
	tb
].join("\n"));
var ib = new CSSStyleSheet(), ab = [rb, ib], ob = [
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
function sb(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of ob) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function cb(e) {
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
function lb() {
	let e = cb(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var ub = /* @__PURE__ */ new Set();
function db(e) {
	return ub.add(e), e.dataset.apTheme = nb.mode, () => ub.delete(e);
}
function fb() {
	let e = lb();
	if (e !== nb.mode) {
		nb.mode = e;
		for (let t of ub) t.dataset.apTheme = e;
	}
}
function pb() {
	nb.mode = lb();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(fb);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), cr(() => {
		let e = zy.value?.theme?.[nb.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(sb(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(sb("primary", t.primary)), t.accent && n.push(sb("accent", t.accent)), ib.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function mb(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function hb(e, t, n = []) {
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
			e.adoptedStyleSheets = ab, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = db(this), this.app = hs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var gb = 6, _b = 8;
function vb(e, t, n, r = "center", i = !1) {
	let a = e.top - gb - t.height >= _b, o = e.bottom + gb + t.height <= n.height - _b, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - gb - t.height : e.bottom + gb;
	c = Math.max(_b, Math.min(c, n.height - _b - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(_b, Math.min(l, n.width - _b - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function yb(e, t) {
	let n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = vb(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return ur(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Un();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Wr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var bb = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), xb = /* @__PURE__ */ new Set([
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
]), Sb = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function Cb(e) {
	return Sb(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function wb(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${Cb(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${Cb(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${Cb(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function Tb(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = Tb(e, t);
			n && i.appendChild(n);
		}
	};
	if (!bb.has(r) && !xb.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = Tb(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function Eb(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return wb(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", wb(e.textContent));
			continue;
		}
		let t = Tb(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function Db(e, t, n, r) {
	return e && vf(e)?.workflows?.[t]?.stages?.[n] || r;
}
function Ob(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return mb(e?.actors[t]?.color, n);
}
function kb(e) {
	return K(() => {
		let t = e(), n = Hy(t), r = sv.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = uf(r.presetId);
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
					label: Db(e, r.workflow, t.id, t.label),
					color: Ob(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = uf(n.presetId);
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
				label: Db(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: Ob(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var Ab = /* @__PURE__ */ on({
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
}), jb, Mb, Nb = null;
function Pb(t) {
	let n = uf(Kf(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = pu(n, bp(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: Ob(n, n.narrator)
	};
}
function Fb(e, t) {
	clearTimeout(jb), clearTimeout(Mb), Mb = void 0, Nb = null, Ab.key !== e.key && Object.assign(Ab, Pb(e.mesId), { html: Eb(e.ann.comment) }), Object.assign(Ab, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), Ab.rev++;
}
function Ib() {
	clearTimeout(jb), clearTimeout(Mb), Mb = void 0, Nb = null, Ab.open && (Ab.open = !1, Ab.pinned = !1, Ab.key = null);
}
function Lb(e) {
	if (!Ab.pinned) {
		if (e) {
			if (Ab.open && Ab.key === e.key) {
				clearTimeout(Mb), Mb = void 0;
				return;
			}
			if (Nb === e.key) return;
			clearTimeout(jb), Nb = e.key, jb = setTimeout(() => Fb(e, !1), 150);
		} else clearTimeout(jb), Nb = null, Bb();
	}
}
function Rb(e) {
	e && !(Ab.open && Ab.key === e.key) ? Fb(e, !0) : Ib();
}
function zb() {
	clearTimeout(Mb), Mb = void 0;
}
function Bb() {
	!Ab.open || Ab.pinned || Mb || (Mb = setTimeout(Ib, 200));
}
function Vb(e) {
	Ab.key && e.has(Ab.key) && Ib(), Nb && e.has(Nb) && (clearTimeout(jb), Nb = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var Hb = {
	key: 0,
	class: "anno-author"
}, Ub = ["innerHTML"], Wb = /* @__PURE__ */ I({
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
			let r = e.getBoundingClientRect(), i = Ab.rect, a = vb(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return ur(() => Ab.open && Ab.rev, async (e) => {
			if (!e) return;
			await Un();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Wr(() => {
			Ab.open = !1;
		}), (e, n) => P(Ab).open ? (z(), B("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Ae({ "--actor": P(Ab).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => P(zb) && P(zb)(...e),
			onMouseleave: n[1] ||= (...e) => P(Bb) && P(Bb)(...e)
		}, [P(Ab).author ? (z(), B("div", Hb, j(P(Ab).author), 1)) : G("", !0), H("div", {
			class: "rich anno-text",
			innerHTML: P(Ab).html
		}, null, 8, Ub)], 36)) : G("", !0);
	}
}), Gb = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, Kb = /\s/, qb = /[“”„‟〝〞＂「」]/, Jb = /[‘’‚‛『』＇]/;
function Yb(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!Gb.test(i)) {
			if (Kb.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else qb.test(i) ? i = "\"" : Jb.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var Xb = (e) => Yb(e).text;
function Zb(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function Qb(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function $b(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function ex(e, t, n, r = Yb(e)) {
	let i = Xb(n.quote).trim();
	if (!i) return null;
	let a = Zb(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = Xb(n.prefix), s = Xb(n.suffix), c = 0, l = a.map((t) => {
			let n = Qb(e, r.text.slice(Math.max(0, t - e.length), t)) + $b(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = Zb(Xb(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function tx(e, t, n = !1) {
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
var nx = /* @__PURE__ */ new Set([
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
function rx(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (nx.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = rx(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function ix(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? nx.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && rx(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function ax(e, t, n) {
	let r = ix(e), i = r.map((e) => e.data), a = i.join(""), o = Yb(a), s = [];
	for (let e of n) {
		let n = ex(a, t, e, o);
		n && s.push({
			ann: e,
			start: tx(i, n[0]),
			end: tx(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function ox(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var sx = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function cx(e, t) {
	let n = [...e.located].sort((e, t) => sx(e.start, t.start) ? 1 : sx(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && sx(r, i.end))) {
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
function lx(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var ux = "ap-anno", dx = "ap-anno-style", fx = /* @__PURE__ */ new Map(), px = 0, mx = "#a855f7", hx = () => null;
function gx(e) {
	hx = e;
}
function _x() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${mx}; }
::highlight(${ux}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function vx(e) {
	let t = e.getElementById(dx);
	t || (t = e.createElement("style"), t.id = dx, (e.head ?? e.documentElement).append(t)), t.textContent !== _x() && (t.textContent = _x());
}
function yx(e) {
	if (e !== mx) {
		mx = e;
		for (let e of Ex()) vx(e.doc);
	}
}
function bx(e, t) {
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
var xx = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function Sx(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => xx(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: bx(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (xx(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: bx(n, e.doc)
			};
		}
	}
	return null;
}
function Cx(e) {
	let t = hx();
	return !!(t && e.composedPath().includes(t));
}
function wx(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !Cx(r) && Lb(Sx(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (Cx(t)) return;
		let n = Sx(e, t);
		i === "mouse" ? n || Ib() : Rb(n);
	}, c = (e) => {
		Cx(e) || Ib();
	}, l = () => Lb(null);
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
function Tx(e) {
	let t = fx.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(ux) ?? new i(), r.set(ux, a)), vx(e), t = {
		doc: e,
		serial: ++px,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = wx(t), fx.set(e, t), t;
}
function Ex() {
	for (let [e, t] of fx) e.defaultView || (t.detach(), fx.delete(e));
	return [...fx.values()];
}
function Dx(e) {
	Tx(e);
}
function Ox(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function kx(e, t, n, r, i) {
	let a = Ax(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = Tx(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = ox(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			cx(r, (t, r) => {
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
	a.size && Vb(a);
}
function Ax(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [fx.get(t)].filter((e) => !!e) : Ex()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && lx(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), fx.delete(i.doc));
		}
	}
	return r;
}
function jx(e, t) {
	let n = Ax(e, t);
	n.size && Vb(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var Mx = /* @__PURE__ */ new Set();
function Nx(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var Px = () => q().ui.annotations?.show !== !1, Fx = class {
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
		}), Mx.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && jx(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && jx(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			jx(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = sv.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && Px() ? Rv(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		kx(this, document, t, a.length ? ax(this.el, o, a) : null, !Ox(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (kx(this, n, t, a.length && !Nx(n) ? ax(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), jx(this), Mx.delete(this);
		}
	}
};
function Ix(e, t) {
	for (let n of Mx) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function Lx() {
	for (let e of Mx) e.hasFrames && e.schedule(0);
}
function Rx() {
	for (let e of Mx) e.el.isConnected || e.dispose();
}
var zx = /* @__PURE__ */ new WeakMap();
function Bx(e) {
	let t = zx.get(e);
	(!t || t.disposed) && zx.set(e, new Fx(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var Vx = () => window.__TAURITAVERN__?.api?.chatSurface, Hx = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return Vx()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), Ux = !1;
function Wx() {
	let t = Vx();
	!Ux && t && Hx() && (t.protocolVersion === 1 ? (Ux = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new Fx(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function Gx(e, t) {
	t && !Hx() && Bx(e);
}
var Kx = null;
function qx() {
	return (!Kx || !Kx.isConnected) && (Kx = document.createElement("ap-anno-bubble"), document.body.append(Kx)), Kx;
}
function Jx() {
	hb("ap-anno-bubble", Wb), qx(), gx(() => Kx), Dx(document), cr(() => {
		let e = q().ui, t = zy.value?.theme?.[nb.mode]?.accent;
		yx(e.annotations?.color || e.accent || t || (nb.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), ur(Px, () => {
		Ib(), Ix(void 0, 0);
	}), ur(() => sv.current?.status, () => Ix()), Vv.on("change", (e) => Ix(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		Ib(), Rx();
	});
	t.on("message_iframe_render_ended", () => Lx()), addEventListener("resize", () => Ib());
}
//#endregion
//#region src/ui/storylines.ts
var Yx = K(() => {
	Z.chatRev;
	let e = zy.value;
	return !!(e && Uh(e, bp(e)));
}), Xx = null;
function Zx() {
	let t = e().chat ?? [];
	return (!Xx || Xx.rev !== Z.chatRev || Xx.chat !== t || Xx.len !== t.length) && (Xx = {
		rev: Z.chatRev,
		chat: t,
		len: t.length,
		keys: Kh(t)
	}), Xx.keys;
}
var Qx = () => {
	Xx = null;
}, $x = 60, eS = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > $x ? `${t.slice(0, $x)}…` : t;
};
function tS(t) {
	Z.chatRev;
	let n = e().chat ?? [], r = Zx(), i = Wh(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? Kf(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: eS(s?.event || If(o))
			});
		}), {
			key: e,
			name: jf(e, i),
			main: e === "",
			if: Af(e, i),
			pending: Ef(e),
			current: e === o,
			floors: a
		};
	}).filter((e) => e.main || e.floors.length);
}
async function nS(t) {
	let n = e(), r = document.querySelector(`#chat > .mes[mesid="${t}"]`);
	r ? r.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}) : n.executeSlashCommandsWithOptions && await n.executeSlashCommandsWithOptions(`/chat-jump ${t}`, { handleExecutionErrors: !0 });
}
//#endregion
//#region src/ui/storyline-tag.ts
var rS = "data-ap-storyline-tag", iS = "ap-storyline-tag-hidden";
function aS(e, t, n) {
	let r = e.querySelectorAll(`[${rS}]`);
	if (r.length) {
		for (let e of r) e.classList.toggle(iS, n);
		return;
	}
	if (!n || !t?.is_user) return;
	let i = $l(t.mes);
	if (!i) return;
	let a = t.mes.slice(i.at).trim(), o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = null;
	for (; o.nextNode();) o.currentNode.textContent?.trim() && (s = o.currentNode);
	if (!s) return;
	let c = s.parentElement, l = s.textContent ?? "", u = a.slice(1);
	if (c && c !== e && /^H[1-6]$/.test(c.tagName) && c.textContent?.trim() === u) {
		c.setAttribute(rS, ""), c.classList.add(iS);
		return;
	}
	let d = l.trimEnd();
	if (!d.endsWith(a)) return;
	let f = d.length - a.length, p = s.splitText(f), m = document.createElement("span");
	m.setAttribute(rS, ""), m.className = iS, p.replaceWith(m), m.append(p);
}
//#endregion
//#region src/ui/mounts.ts
var oS = "ap-hidden", sS = [
	"meta-pure",
	"impersonate",
	"summary"
];
function cS(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function lS(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Kf(a), s = sv.current?.mesId === n;
	a && !a.is_user && Gx(i, !!(o?.annotations?.length || s));
	let c = Yx.value;
	aS(i, a, c);
	let l = !(!a || a.is_user || !o && !s), u = r.querySelector(":scope > ap-stages"), d = r.querySelector(":scope > ap-top-cards"), f = r.querySelector(":scope > ap-cards");
	l ? ((!d || d.nextElementSibling !== i) && (d?.remove(), d = cS("ap-top-cards", n), d.setAttribute("position", "top"), i.before(d)), (!u || u.nextElementSibling !== d) && (u?.remove(), u = cS("ap-stages", n), d.before(u)), (!f || f.previousElementSibling !== i) && (f?.remove(), f = cS("ap-cards", n), i.after(f)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), f.getAttribute("mesid") !== String(n) && f.setAttribute("mesid", String(n)), i.classList.toggle(oS, !!(!s && o && sS.includes(o.turn))), uS(r, i, n, c)) : (u?.remove(), d?.remove(), f?.remove(), i.classList.remove(oS), uS(r, i, n, c));
}
function uS(e, t, n, r) {
	let i = e.querySelector(":scope > ap-storyline");
	if (!r || !Zx()[n]) {
		i?.remove();
		return;
	}
	let a = e.querySelector(":scope > ap-stages") ?? e.querySelector(":scope > ap-top-cards") ?? t;
	i ||= cS("ap-storyline", n), i.nextElementSibling !== a && a.before(i), i.getAttribute("mesid") !== String(n) && i.setAttribute("mesid", String(n));
}
function dS(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) lS(t);
}
function fS() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var pS = 0, mS = /* @__PURE__ */ new Set(), hS = !1;
function gS(e) {
	e ? mS.add(e) : hS = !0, !pS && (pS = requestAnimationFrame(() => {
		if (pS = 0, Qx(), hS) dS();
		else for (let e of mS) e.isConnected && lS(e);
		mS.clear(), hS = !1, fS(), Rx();
	}));
}
function _S() {
	Ly(), gS();
}
function vS() {
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
	]) e && t.on(e, _S);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && gS(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && gS(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), gS();
	};
	r();
	let i;
	ur(() => sv.current && sv.current.status === "running" && sv.current.streaming && sv.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = sv.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), _S());
		}, 100));
	}), ur(() => sv.current?.status, () => gS());
}
//#endregion
//#region src/ui/entry.ts
var yS = "left-nav-panel", bS = "ap-preset-banner";
function xS() {
	return document.getElementById(yS);
}
function SS() {
	let e = xS();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function CS() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== bS && e.after(document.createElement(bS));
}
var wS = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function TS() {
	ur(() => Z.presetId, (e) => {
		for (let t of document.querySelectorAll(wS.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function ES(e) {
	let t = xS();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function DS() {
	let e = xS();
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
function OS() {
	CS(), TS(), DS(), ur(() => Z.panelOpen, (e) => {
		e && SS();
	});
	let e = xS();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Z.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var kS = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, AS = (e) => e === "", jS = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), MS = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), NS = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), PS = (e) => {
	let t = NS(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, FS = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, IS = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = FS.width, color: s = FS.stroke, ...c }, { slots: l }) => Ba("svg", {
	...FS,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": AS(n) || AS(r) || n === !0 || r === !0 ? Number(i || a || FS["stroke-width"]) * 24 / Number(o) : i || a || FS["stroke-width"],
	class: jS("lucide", c.class, ...e ? [`lucide-${MS(PS(e))}-icon`, `lucide-${MS(e)}`] : ["lucide-icon"]),
	...!l.default && !kS(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Ba(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Ba(IS, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), LS = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), RS = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), zS = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), BS = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), VS = Q("braces", [["path", {
	d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
	key: "ezmyqa"
}], ["path", {
	d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
	key: "e1hn23"
}]]), HS = Q("brain", [
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
]), US = Q("bug", [
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
]), WS = Q("cable", [
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
]), GS = Q("calendar-days", [
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
]), KS = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), qS = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), JS = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), YS = Q("circle-dashed", [
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
]), XS = Q("circle-question-mark", [
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
]), ZS = Q("circle-slash", [["circle", {
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
}]]), QS = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), $S = Q("cloud-fog", [
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
]), eC = Q("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), tC = Q("cloud-rain", [
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
]), nC = Q("cloud-sun", [
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
]), rC = Q("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), iC = Q("code-xml", [
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
]), aC = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), oC = Q("coins", [
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
]), sC = Q("copy-plus", [
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
]), cC = Q("copy", [["rect", {
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
}]]), lC = Q("crown", [["path", {
	d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
	key: "1vdc57"
}], ["path", {
	d: "M5 21h14",
	key: "11awu3"
}]]), uC = Q("database-zap", [
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
]), dC = Q("download", [
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
]), fC = Q("drama", [
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
]), pC = Q("feather", [
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
]), mC = Q("file-down", [
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
]), hC = Q("file-plus", [
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
]), gC = Q("file-stack", [
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
]), _C = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), vC = Q("git-branch", [
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
]), yC = Q("git-compare-arrows", [
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
]), bC = Q("globe", [
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
]), xC = Q("grip-vertical", [
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
]), SC = Q("info", [
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
]), CC = Q("layers", [
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
]), wC = Q("layout-template", [
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
]), TC = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), EC = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), DC = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), OC = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), kC = Q("message-square-dashed", [
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
]), AC = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), jC = Q("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), MC = Q("notebook-pen", [
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
]), NC = Q("package", [
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
]), PC = Q("palette", [
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
]), FC = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), IC = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), LC = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), RC = Q("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), zC = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), BC = Q("refresh-cw", [
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
]), VC = Q("regex", [
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
]), HC = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), UC = Q("save", [
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
]), WC = Q("scroll-text", [
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
]), GC = Q("server", [
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
]), KC = Q("shapes", [
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
]), qC = Q("sliders-horizontal", [
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
]), JC = Q("sliders-vertical", [
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
]), YC = Q("snowflake", [
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
]), XC = Q("sun", [
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
]), ZC = Q("text-cursor-input", [
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
]), QC = Q("trash-2", [
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
]), $C = Q("triangle-alert", [
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
]), ew = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), tw = Q("upload", [
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
]), nw = Q("user-pen", [
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
]), rw = Q("wind", [
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
]), iw = Q("workflow", [
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
]), aw = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), ow = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), sw = /* @__PURE__ */ I({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = yb(n, () => t);
		return (t, a) => (z(), B("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Zr(t.$slots, "default"), P(r) && e.text ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544));
	}
}), cw = ["disabled", "aria-label"], $ = /* @__PURE__ */ I({
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
		return (t, n) => (z(), V(sw, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: F(() => [H("button", {
				type: "button",
				class: A(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(z(), V(qr(e.icon)))], 10, cw)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), lw = {
	key: 0,
	class: "patches"
}, uw = { class: "patch-old pre" }, dw = { class: "patch-new pre" }, fw = {
	key: 0,
	class: "patch-status xs"
}, pw = {
	key: 2,
	class: "faint small stage-empty"
}, mw = /* @__PURE__ */ I({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null);
		ur(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Un();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (z(), B("div", {
			class: "stage-body",
			style: Ae({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (z(), B("div", lw, [(z(!0), B(R, null, L(e.stage.patches, (e, t) => (z(), B("div", {
			key: t,
			class: A(["patch", { failed: r(e.status) }])
		}, [
			H("div", uw, j(e.old_string), 1),
			U(P(LS), { class: "patch-arrow" }),
			H("div", dw, j(e.new_string), 1),
			r(e.status) ? (z(), B("div", fw, [U(P(zS)), W(j(P(X)(`patch.${e.status}`)), 1)])) : G("", !0)
		], 2))), 128))])) : e.stage.text ? (z(), B("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, j(e.stage.text), 513)) : (z(), B("div", pw, j(P(X)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function hw(t) {
	let n = e().chat[t], r = Kf(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), Jf(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), Ly();
}
async function gw(t, n, r) {
	let i = e().chat[t], a = Kf(i);
	return !i || !a ? !1 : (Jf(t, qf(a, n, r)), Ly(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var _w = { class: "stage-bar" }, vw = ["onClick"], yw = { class: "ellipsis" }, bw = {
	key: 0,
	class: "chip stage-chip error"
}, xw = { class: "ellipsis" }, Sw = { class: "badge warn" }, Cw = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, ww = /* @__PURE__ */ I({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = kb(() => t.mesid), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = K(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = K(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = K(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = K(() => o.value.find((e) => e.id === s.value) ?? null);
		ur(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: MC,
			content: pC,
			patch: yC
		}, d = (e) => e.status === "streaming" ? EC : e.status === "interrupted" ? ZS : e.status === "missing" ? YS : u[e.kind], f = K(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = K(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = K(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${X(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(X("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => P(n) && (o.value.length || P(n).error) ? (z(), B("div", {
			key: 0,
			class: A(["stages", { live: P(n).running }])
		}, [H("div", _w, [
			(z(!0), B(R, null, L(o.value, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				class: A(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ae({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(z(), V(qr(d(e)), { class: A({ spin: e.status === "streaming" }) }, null, 8, ["class"])), H("span", yw, j(e.label), 1)], 14, vw))), 128)),
			P(n).error ? (z(), B("span", bw, [U(P($C)), H("span", xw, j(P(n).error), 1)])) : G("", !0),
			r[1] ||= H("span", { class: "grow" }, null, -1),
			f.value.length ? (z(), V(sw, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: F(() => [H("span", Sw, [U(P($C)), W(j(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : G("", !0),
			p.value ? (z(), V($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? P(ew) : P(zC),
				label: p.value.patchesApplied ? P(X)("stages.revertDraft") : P(X)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => P(hw)(e.mesid)
			}, null, 8, ["icon", "label"])) : G("", !0),
			P(n).running ? G("", !0) : (z(), V(sw, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: F(() => [H("span", Cw, [U(P(SC))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (z(), V(mw, {
			key: c.value.id,
			stage: c.value,
			follow: P(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : G("", !0)], 2)) : G("", !0);
	}
}), Tw = {
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
function Ew(e) {
	let t = Tw[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function Dw(e, t) {
	return e.flatMap((e, n) => {
		let r = Ew(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var Ow = { class: "reply-name xs" }, kw = ["innerHTML"], Aw = /* @__PURE__ */ I({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = K(() => Eb(t.text));
		return (t, r) => (z(), B("div", {
			class: "reply-card",
			style: Ae({ "--actor": e.color })
		}, [H("div", Ow, j(e.name), 1), H("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, kw)], 4));
	}
}), jw = { class: "card mini-card" }, Mw = { class: "card-head" }, Nw = { class: "card-title" }, Pw = { class: "card-body pre" }, Fw = /* @__PURE__ */ I({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (z(), B("div", jw, [H("header", Mw, [
			U(P(nw), { class: "section-icon" }),
			H("span", Nw, j(P(X)("cards.impersonate")), 1),
			H("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => P(gy)(e.text, !1, e.mesid)
			}, [U(P(ZC)), W(j(P(X)("cards.fillInput")), 1)])
		]), H("div", Pw, j(e.text), 1)]));
	}
}), Iw = ["aria-label"], Lw = ["title", "onClick"], Rw = { class: "option-label" }, zw = { class: "option-content small muted" }, Bw = /* @__PURE__ */ I({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => gy(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
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
		}, [H("span", Rw, j(e.label), 1), H("span", zw, j(e.content), 1)], 8, Lw))), 128))], 8, Iw));
	}
}), Vw = {
	key: 0,
	class: "memory-ops"
}, Hw = { class: "ellipsis" }, Uw = ["aria-label", "onClick"], Ww = /* @__PURE__ */ I({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = K(() => {
			let e = _p(t.preset), n = e.globalMemory.log;
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
					let r = $f(t), i = r ? ep(e, r) : -1, a = n[i];
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
			e.id !== void 0 && pp(_p(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (z(), B("div", Vw, [(z(!0), B(R, null, L(n.value, (e, t) => (z(), V(sw, {
			key: t,
			text: e.op === "delete" ? P(X)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: F(() => [H("span", { class: A(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(z(), V(qr(e.scope === "global" ? P(bC) : P(OC)), { class: "faint" })),
				H("span", Hw, j(e.key), 1),
				(z(), V(qr(e.op === "delete" ? P(QC) : P(IC)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": P(X)("common.undo"),
					onClick: (t) => r(e)
				}, [U(P(ew))], 8, Uw)) : G("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : G("", !0);
	}
}), Gw = ["aria-label"], Kw = /* @__PURE__ */ I({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = yb(n, () => t);
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
			onClick: a[0] ||= ls((e) => r.value = !P(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [U(P(XS))], 40, Gw), P(r) ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544)) : G("", !0);
	}
}), qw = { class: "card-title" }, Jw = {
	key: 0,
	class: "card-body"
}, Yw = /* @__PURE__ */ I({
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
			e.icon ? (z(), V(qr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : G("", !0),
			H("span", qw, j(e.title), 1),
			U(Kw, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			H("span", {
				class: "row",
				onClick: r[0] ||= ls(() => {}, ["stop"])
			}, [Zr(n.$slots, "actions")]),
			e.collapsible ? (z(), V(P(qS), {
				key: 1,
				class: A(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : G("", !0)
		], 2), !e.collapsible || t.value ? (z(), B("div", Jw, [Zr(n.$slots, "default")])) : G("", !0)], 2));
	}
}), Xw = {
	key: 0,
	class: "badge neutral"
}, Zw = { class: "pre small" }, Qw = /* @__PURE__ */ I({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (z(), V(Yw, {
			title: P(X)("cards.recap"),
			icon: P(WC),
			collapsible: "",
			open: !1
		}, {
			actions: F(() => [e.coversUpTo === void 0 ? G("", !0) : (z(), B("span", Xw, "#0–" + j(e.coversUpTo), 1))]),
			default: F(() => [H("div", Zw, j(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), $w = { class: "synopsis-fields" }, eT = { class: "synopsis-field" }, tT = ["placeholder", "aria-label"], nT = { class: "synopsis-field" }, rT = ["placeholder", "aria-label"], iT = ["placeholder", "aria-label"], aT = ["placeholder", "aria-label"], oT = { class: "synopsis-actions" }, sT = { class: "xs faint grow synopsis-keys" }, cT = {
	type: "submit",
	class: "btn primary sm-btn"
}, lT = { class: "synopsis-head" }, uT = { class: "synopsis-line small" }, dT = {
	key: 0,
	class: "row tight"
}, fT = {
	key: 1,
	class: "row tight"
}, pT = { class: "synopsis-event ellipsis" }, mT = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, hT = /* @__PURE__ */ I({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ on({
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
			a.value = !0, await Un(), f(), s.value?.focus();
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
			onSubmit: ls(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= ls(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= ls(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= ls(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= ls(() => {}, ["stop"])
		}, [
			H("div", $w, [H("label", eT, [U(P(QS), { class: "faint" }), rr(H("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.time"),
				"aria-label": P(X)("cards.synopsis.time")
			}, null, 8, tT), [[$o, o.time]])]), H("label", nT, [U(P(DC), { class: "faint" }), rr(H("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: P(X)("cards.synopsis.location"),
				"aria-label": P(X)("cards.synopsis.location")
			}, null, 8, rT), [[$o, o.location]])])]),
			rr(H("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: P(X)("cards.synopsis.event"),
				"aria-label": P(X)("cards.synopsis.event")
			}, null, 8, iT), [[$o, o.event]]),
			rr(H("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: P(X)("cards.synopsis.summary"),
				"aria-label": P(X)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, aT), [[$o, o.summary]]),
			H("div", oT, [
				H("span", sT, j(P(X)("cards.synopsis.keys")), 1),
				H("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, j(P(X)("common.cancel")), 1),
				H("button", cT, [U(P(KS)), W(j(P(X)("common.save")), 1)])
			])
		], 32)) : (z(), B("div", {
			key: 1,
			class: A(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [H("div", lT, [H("div", uT, [
			e.synopsis.time ? (z(), B("span", dT, [U(P(QS), { class: "faint" }), W(j(e.synopsis.time), 1)])) : G("", !0),
			e.synopsis.location ? (z(), B("span", fT, [U(P(DC), { class: "faint" }), W(j(e.synopsis.location), 1)])) : G("", !0),
			H("span", pT, j(e.synopsis.event), 1)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= ls(() => {}, ["stop"])
		}, [U($, {
			icon: P(IC),
			label: P(X)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]), i.value && e.synopsis.summary ? (z(), B("div", mT, j(e.synopsis.summary), 1)) : G("", !0)], 2));
	}
}), gT = { class: "status-fields" }, _T = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], vT = { class: "synopsis-actions" }, yT = { class: "xs faint grow synopsis-keys" }, bT = {
	type: "submit",
	class: "btn primary sm-btn"
}, xT = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, ST = { class: "status-line" }, CT = {
	key: 0,
	class: "row tight"
}, wT = {
	key: 1,
	class: "row tight"
}, TT = {
	key: 2,
	class: "row tight status-location"
}, ET = { class: "ellipsis" }, DT = {
	key: 3,
	class: "row tight"
}, OT = /* @__PURE__ */ I({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ on({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ N(), s = (e) => (n.status[e] ?? "").trim(), c = K(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, eC],
			[/雪|snow|sleet|blizzard/i, YC],
			[/雨|rain|drizzle|shower/i, tC],
			[/雾|霾|fog|mist|haze|smog/i, $S],
			[/风|wind|gale|breez/i, rw],
			[/阴|云|cloud|overcast/i, rC],
			[/夜|月|night|moon/i, jC],
			[/晴|sun|clear|fair/i, XC]
		], u = K(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? nC), d = () => Object.fromEntries(Gs.map((e) => [e, a[e].trim()])), f = K(() => Gs.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of Gs) a[e] = n.status[e] ?? "";
			i.value = !0, await Un(), o.value?.querySelector("input")?.focus();
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
			date: GS,
			weekday: GS,
			time: QS,
			location: DC,
			weather: nC
		};
		return (t, n) => i.value ? (z(), B("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: ls(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= ls(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= ls(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= ls(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= ls(() => {}, ["stop"])
		}, [H("div", gT, [(z(!0), B(R, null, L(P(Gs), (e) => (z(), B("label", {
			key: e,
			class: "synopsis-field"
		}, [(z(), V(qr(_[e]), { class: "faint" })), rr(H("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: P(X)(`cards.status.${e}`),
			"aria-label": P(X)(`cards.status.${e}`)
		}, null, 8, _T), [[$o, a[e]]])]))), 128))]), H("div", vT, [
			H("span", yT, j(P(X)("cards.status.keys")), 1),
			H("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, j(P(X)("common.cancel")), 1),
			H("button", bT, [U(P(KS)), W(j(P(X)("common.save")), 1)])
		])], 544)) : (z(), B("div", xT, [H("div", ST, [
			c.value ? (z(), B("span", CT, [U(P(GS), { class: "faint" }), W(j(c.value), 1)])) : G("", !0),
			s("time") ? (z(), B("span", wT, [U(P(QS), { class: "faint" }), W(j(s("time")), 1)])) : G("", !0),
			s("location") ? (z(), B("span", TT, [U(P(DC), { class: "faint" }), H("span", ET, j(s("location")), 1)])) : G("", !0),
			s("weather") ? (z(), B("span", DT, [(z(), V(qr(u.value), { class: "faint" })), W(j(s("weather")), 1)])) : G("", !0)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= ls(() => {}, ["stop"])
		}, [U($, {
			icon: P(IC),
			label: P(X)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]));
	}
}), kT = ["innerHTML"], AT = {
	key: 1,
	class: "kv-list small"
}, jT = { class: "pre" }, MT = /* @__PURE__ */ I({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = K(() => typeof t.value == "string" ? Eb(t.value) : "");
		return (t, r) => (z(), V(Yw, {
			title: e.title,
			icon: P(KC),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [typeof e.value == "string" ? (z(), B("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, kT)) : (z(), B("dl", AT, [(z(!0), B(R, null, L(e.value, (e, t) => (z(), B(R, { key: t }, [H("dt", null, j(t), 1), H("dd", jT, j(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), NT = /* @__PURE__ */ new Map();
function PT(e) {
	let t = NT.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => NT.delete(e)), NT.set(e, t);
	}
	return t;
}
function FT(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function IT(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var LT = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function RT(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = nl(e.code, LT(r));
			t.replaceChildren(...[IT(e.style)].filter((e) => !!e));
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
	let i = FT(await PT(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[IT(e.style)].filter((e) => !!e)), a = await i(t, r);
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
var zT = { class: "structure-component" }, BT = ["data-structure"], VT = {
	key: 0,
	class: "xs"
}, HT = /* @__PURE__ */ I({
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
		return Hr(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await RT(t.component, r, t.context);
			});
		}), ur(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), ur(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await RT(e, r, t.context));
		})), Wr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (z(), B("div", zT, [H("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, BT), r.value ? (z(), B("div", VT, j(P(X)("cards.custom.error", { error: r.value })), 1)) : G("", !0)]));
	}
}), UT = /* @__PURE__ */ I({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = kb(() => t.mesid), r = K(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && sv.current?.genId === e.genId ? sv.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
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
			let c = [], l = by(r), u = !(!i || e.live), d = Y(o);
			for (let { decl: n } of Dw(s, t.position)) {
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
						let i = yf(r, "structures", n.id, "title", n.title || n.id), o = Oc(n);
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
									name: bf(r),
									version: r.version
								},
								lang: _f(),
								setValue: async (e) => u ? gw(f, s, e) : !1,
								fillInput: (e, t) => gy(String(e ?? ""), !!t, f)
							}
						});
						break;
					}
				}
			}
			return {
				preset: r,
				editable: u,
				narrator: pu(r, bp(r), r.narrator),
				color: Ob(r, r.narrator),
				items: c
			};
		});
		return (t, n) => r.value?.items.length ? (z(), B("div", {
			key: 0,
			class: A(["cards", `cards-${e.position}`])
		}, [(z(!0), B(R, null, L(r.value.items, (t) => (z(), B(R, { key: t.id }, [t.type === "reply" ? (z(), V(Aw, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (z(), V(Fw, {
			key: 1,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (z(), V(Bw, {
			key: 2,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (z(), V(hT, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => P(gw)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (z(), V(OT, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => P(gw)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (z(), V(Ww, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (z(), V(Qw, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (z(), V(MT, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (z(), V(HT, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : G("", !0)], 64))), 128))], 2)) : G("", !0);
	}
}), WT = {
	key: 0,
	class: "dock stages live"
}, GT = { class: "stage-bar" }, KT = { class: "ellipsis" }, qT = {
	key: 0,
	class: "small muted"
}, JT = /* @__PURE__ */ I({
	__name: "Dock",
	setup(e) {
		let t = K(() => sv.current && !sv.current.streaming && sv.current.status === "running" ? sv.current : null), n = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = uf(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: Db(n, e.workflow, t.id, t.label),
				color: Ob(n, t.actor)
			}));
		}), r = K(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (z(), B("div", WT, [H("div", GT, [
			U(P(EC), { class: "spin faint" }),
			(z(!0), B(R, null, L(n.value, (e) => (z(), B("span", {
				key: e.id,
				class: A(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ae({ "--actor": e.color })
			}, [H("span", KT, j(e.label), 1)], 6))), 128)),
			n.value.length ? G("", !0) : (z(), B("span", qT, j(P(X)("stages.waiting")), 1))
		]), r.value ? (z(), V(mw, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : G("", !0)])) : G("", !0);
	}
}), YT = ["title"], XT = { class: "storyline-name" }, ZT = {
	key: 0,
	class: "storyline-if"
}, QT = /* @__PURE__ */ I({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = K(() => {
			if (Z.chatRev, !Yx.value) return null;
			let e = Zx()[t.mesid];
			if (!e) return null;
			let n = Wh();
			return {
				key: e,
				name: jf(e, n) || X("storylines.unnamed"),
				if: Af(e, n)
			};
		});
		return (e, t) => n.value ? (z(), B("button", {
			key: 0,
			type: "button",
			class: A(["storyline-badge", { "if-line": n.value.if }]),
			title: P(X)("storylines.openTab"),
			onClick: t[0] ||= (e) => P(Uy)(n.value.key)
		}, [
			U(P(vC), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			H("span", XT, j(n.value.name), 1),
			n.value.if ? (z(), B("span", ZT, j(P(X)("storylines.ifLine")), 1)) : G("", !0)
		], 10, YT)) : G("", !0);
	}
}), $T = ["aria-label"], eE = ["disabled"], tE = /* @__PURE__ */ I({
	__name: "Switch",
	props: /*@__PURE__*/ ii({
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
		let t = li(e, "modelValue");
		return (n, r) => (z(), B("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			rr(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, eE), [[es, t.value]]),
			r[1] ||= H("span", { class: "track" }, null, -1),
			r[2] ||= H("span", { class: "thumb" }, null, -1)
		], 8, $T));
	}
}), nE = { class: "field-label" }, rE = { class: "ellipsis" }, iE = {
	key: 0,
	class: "dot modified"
}, aE = { class: "field-control" }, oE = /* @__PURE__ */ I({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (z(), B("div", { class: A(["field", { inline: e.inline }]) }, [H("div", nE, [
			H("span", rE, j(e.label), 1),
			e.modified ? (z(), B("span", iE)) : G("", !0),
			U(Kw, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), H("div", aE, [Zr(t.$slots, "default")])], 2));
	}
}), sE = { class: "swatches" }, cE = ["title"], lE = ["title"], uE = { class: "swatches" }, dE = ["title"], fE = /* @__PURE__ */ I({
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
		return (e, t) => (z(), V(Yw, {
			title: P(X)("appearance.title"),
			icon: P(PC),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [
				U(oE, {
					label: P(X)("appearance.colors"),
					help: P(X)("appearance.colors.hint"),
					inline: ""
				}, {
					default: F(() => [H("div", sE, [
						H("label", {
							class: "swatch",
							style: Ae({ background: P(r) || "var(--ap-primary-500)" }),
							title: P(X)("appearance.primary")
						}, [rr(H("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ _n(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							$o,
							P(r),
							void 0,
							{ lazy: !0 }
						]])], 12, cE),
						H("label", {
							class: "swatch",
							style: Ae({ background: P(i) || "var(--ap-accent-500)" }),
							title: P(X)("appearance.accent")
						}, [rr(H("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ _n(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							$o,
							P(i),
							void 0,
							{ lazy: !0 }
						]])], 12, lE),
						U($, {
							icon: P(HC),
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
				U(oE, {
					label: P(X)("appearance.collapseStages"),
					inline: ""
				}, {
					default: F(() => [U(tE, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				U(oE, {
					label: P(X)("appearance.annotations"),
					help: P(X)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: F(() => [U(tE, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (z(), V(oE, {
					key: 0,
					label: P(X)("appearance.annotationColor"),
					inline: ""
				}, {
					default: F(() => [H("div", uE, [H("label", {
						class: "swatch",
						style: Ae({ background: l.value || "var(--ap-accent)" }),
						title: P(X)("appearance.annotationColor")
					}, [rr(H("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						$o,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, dE), U($, {
						icon: P(HC),
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
}), pE = { class: "toolbar" }, mE = ["disabled"], hE = ["disabled"], gE = { class: "preset-list" }, _E = ["onClick", "onKeydown"], vE = { class: "preset-mark" }, yE = { class: "grow col preset-info" }, bE = { class: "row wrap preset-head" }, xE = { class: "preset-name" }, SE = { class: "badge neutral" }, CE = { class: "badge neutral icon-badge" }, wE = {
	key: 0,
	class: "xs muted"
}, TE = {
	key: 1,
	class: "small muted preset-desc"
}, EE = {
	key: 0,
	class: "empty"
}, DE = /* @__PURE__ */ I({
	__name: "PresetsTab",
	setup(e) {
		let t = K(() => of()), n = (e) => yl(e.preset).length > 0, r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && g("success", n);
			} catch (e) {
				wy(e) ? g("info", e.message) : g("error", e instanceof Error ? e.message : String(e), X("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await Hp(e.preset), Ry();
		}), l = () => s("url", async () => {
			let e = await Py(a.value);
			return a.value = "", i.value = !1, e;
		}, X("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => Fy(t), X("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => Py(q().sources[e.preset.id]), X("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => sy(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => Iy(e.preset.id)), m = () => s("ext", async () => g("info", await qv() === "current" ? X("update.none") : X("update.reloading")));
		return (e, s) => (z(), B(R, null, [
			H("div", pE, [
				H("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [U(P(tw)), W(j(P(X)("presets.importFile")), 1)], 8, mE),
				H("button", {
					type: "button",
					class: A(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [U(P(TC)), W(j(P(X)("presets.importUrl")), 1)], 2),
				s[4] ||= H("span", { class: "grow" }, null, -1),
				U($, {
					icon: r.value === "ext" ? P(EC) : P(BC),
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
				onSubmit: ls(l, ["prevent"])
			}, [rr(H("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[$o, a.value]]), H("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (z(), V(P(EC), {
				key: 0,
				class: "spin"
			})) : (z(), V(P(dC), { key: 1 })), W(j(P(X)("common.install")), 1)], 8, hE)], 32)) : G("", !0),
			H("div", gE, [(z(!0), B(R, null, L(t.value, (e) => (z(), B("div", {
				key: e.preset.id,
				class: A(["preset-item", { on: P(zy)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: ds((t) => c(e), ["enter"])
			}, [
				H("span", vE, [r.value === `select:${e.preset.id}` ? (z(), V(P(EC), {
					key: 0,
					class: "spin"
				})) : P(zy)?.id === e.preset.id ? (z(), V(P(KS), { key: 1 })) : G("", !0)]),
				H("div", yE, [
					H("div", bE, [
						H("span", xE, j(P(bf)(e.preset)), 1),
						H("span", SE, "v" + j(e.preset.version), 1),
						e.source === "builtin" ? G("", !0) : (z(), B("span", {
							key: 0,
							class: A(["badge", { warn: e.source === "dev" }])
						}, j(P(X)(`presets.source.${e.source}`)), 3)),
						n(e) ? (z(), V(sw, {
							key: 1,
							text: P(X)("presets.templates.help")
						}, {
							default: F(() => [H("span", CE, [U(P(iC)), W(j(P(X)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : G("", !0)
					]),
					e.preset.author ? (z(), B("span", wE, j(e.preset.author), 1)) : G("", !0),
					P(xf)(e.preset) ? (z(), B("span", TE, j(P(xf)(e.preset)), 1)) : G("", !0)
				]),
				H("div", {
					class: "row preset-actions",
					onClick: s[3] ||= ls(() => {}, ["stop"])
				}, [
					U($, {
						icon: P(mC),
						label: P(X)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					e.source === "installed" && P(q)().sources[e.preset.id] ? (z(), V($, {
						key: 0,
						icon: P(BC),
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
						icon: P(QC),
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
			], 42, _E))), 128)), t.value.length ? G("", !0) : (z(), B("div", EE, j(P(X)("presets.none")), 1))]),
			U(fE)
		], 64));
	}
}), OE;
function kE() {
	let e = zy, t = K(() => e.value ? bp(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (Sp(r, t), n.sampling && (clearTimeout(OE), OE = setTimeout(() => void Up(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var AE = { class: "empty" }, jE = /* @__PURE__ */ I({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (z(), B("div", AE, [
			U(P(NC)),
			H("span", null, j(P(X)("panel.noPreset")), 1),
			H("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => P(Z).tab = "presets"
			}, j(P(X)("panel.choosePreset")), 1)
		]));
	}
}), ME = [
	"aria-checked",
	"title",
	"onClick"
], NE = { class: "ellipsis" }, PE = /* @__PURE__ */ I({
	__name: "Segmented",
	props: /*@__PURE__*/ ii({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = li(e, "modelValue");
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
		}, [e.icon ? (z(), V(qr(e.icon), { key: 0 })) : G("", !0), H("span", NE, j(e.label), 1)], 10, ME))), 128))], 2));
	}
}), FE = { class: "col" }, IE = { class: "row" }, LE = ["aria-label"], RE = ["label"], zE = ["value"], BE = ["label"], VE = ["value"], HE = ["placeholder"], UE = {
	key: 1,
	class: "xs muted row tight"
}, WE = { value: "" }, GE = ["value"], KE = ["value"], qE = ["value"], JE = [
	"value",
	"placeholder",
	"onChange"
], YE = [
	"value",
	"placeholder",
	"onChange"
], XE = ["value"], ZE = ["value"], QE = ["value"], $E = ["value"], eD = ["value"], tD = {
	key: 0,
	class: "xs muted"
}, nD = { class: "custom-ui-list small" }, rD = { class: "grow ellipsis" }, iD = { class: "xs faint" }, aD = { class: "slider" }, oD = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], sD = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], cD = { class: "field-grid" }, lD = ["value", "onChange"], uD = ["value"], dD = ["value"], fD = /* @__PURE__ */ I({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = kE(), i = K(() => t.value ? _p(t.value) : null), a = K({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				Cp(n, {
					kind: r,
					id: i.join(":")
				}), Up(n);
			}
		}), o = K(() => {
			let e = t.value;
			return e ? kc(e).map((t) => ({
				id: t.id,
				title: yf(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = K({
			get: () => t.value ? by(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = sf(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? Sy(n, e) : Ay(n);
			}
		}), c = K(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== jc(t.value));
		}), l = K(() => t.value ? wp(t.value) : !1), u = K(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? Ep(e, n) : u.value && Op(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Tp(t.value), Up(t.value));
		}, g = () => {
			t.value && u.value && (kp(t.value, u.value), Up(t.value));
		}, _ = () => {
			t.value && u.value && Dp(t.value, u.value);
		}, v = K(() => bs.map((e) => ({
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
			label: yf(t.value, "workflows", e.id, "name", e.name),
			hint: yf(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), ee = K({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), C = K(() => S.value.find((e) => e.value === ee.value)?.hint);
		function w(e) {
			return K({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let T = w("forceTool"), te = w("parallelTools"), ne = w("sendThoughtSignature"), E = w("streamToolArguments"), D = w("finalFallback"), re = w("maxSteps"), ie = K({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), ae = K(() => Object.entries(t.value?.actors ?? {})), oe = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), O = K({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), se = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), ce = K(() => ws.map((e) => ({
			value: e,
			label: X(`writing.userInput.${e}`),
			hint: X(`writing.userInput.${e}.hint`)
		}))), k = K({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), le = K({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), ue = K({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...Yl,
					...t.storylines,
					enabled: e
				};
			})
		}), de = K({
			get: () => n.value?.storylines?.freezeVariables !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...Yl,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), fe = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), pe = K({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), me = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), he = [
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
		], ge = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], _e = ["stream_openai", "show_thoughts"], ve = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], ye = K(() => n.value?.sampling ?? {}), be = (e) => e in ye.value, xe = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), Se = (e) => Number(e.target.value);
		return (e, r) => !P(t) || !P(n) || !i.value ? (z(), V(jE, { key: 0 })) : (z(), B(R, { key: 1 }, [
			H("div", FE, [
				H("div", IE, [
					rr(H("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": P(X)("config.configuration")
					}, [H("optgroup", { label: P(X)("config.recommended") }, [(z(!0), B(R, null, L(P(t).configurations, (e) => (z(), B("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, j(P(yf)(P(t), "configurations", e.id, "name", e.name)), 9, zE))), 128))], 8, RE), i.value.saved.length ? (z(), B("optgroup", {
						key: 0,
						label: P(X)("config.saved")
					}, [(z(!0), B(R, null, L(i.value.saved, (e) => (z(), B("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, j(e.name), 9, VE))), 128))], 8, BE)) : G("", !0)], 8, LE), [[ns, a.value]]),
					u.value && l.value ? (z(), V($, {
						key: 0,
						icon: P(UC),
						label: P(X)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : G("", !0),
					U($, {
						icon: P(LC),
						label: P(X)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (z(), V($, {
						key: 1,
						icon: P(IC),
						label: P(X)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : G("", !0),
					u.value ? (z(), V($, {
						key: 2,
						icon: P(QC),
						label: P(X)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : G("", !0),
					U($, {
						icon: P(HC),
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
					onSubmit: ls(m, ["prevent"])
				}, [
					rr(H("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: P(X)("config.name"),
						autofocus: ""
					}, null, 8, HE), [[$o, f.value]]),
					U($, {
						icon: P(aw),
						label: P(X)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					U($, {
						icon: P(KS),
						label: P(X)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : G("", !0),
				l.value ? (z(), B("span", UE, [r[28] ||= H("span", { class: "dot modified" }, null, -1), W(j(P(X)("config.modified")), 1)])) : G("", !0)
			]),
			U(Yw, {
				title: P(X)("config.connection"),
				icon: P(WS)
			}, {
				default: F(() => [
					U(oE, {
						label: P(X)("config.transport"),
						help: P(X)(`transport.${y.value}.hint`)
					}, {
						default: F(() => [U(PE, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (z(), B(R, { key: 0 }, [
						U(oE, {
							label: P(X)("config.forceTool"),
							help: P(X)("config.forceTool.hint"),
							inline: ""
						}, {
							default: F(() => [U(tE, {
								modelValue: P(T),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ _n(T) ? T.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(oE, {
							label: P(X)("config.parallelTools"),
							help: P(X)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: F(() => [U(tE, {
								modelValue: P(te),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ _n(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(oE, {
							label: P(X)("config.syntheticTurn"),
							help: P(X)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: F(() => [rr(H("select", {
								"onUpdate:modelValue": r[8] ||= (e) => ie.value = e,
								class: "input"
							}, [H("option", WE, j(P(X)("common.none")), 1), (z(!0), B(R, null, L(P(t).syntheticTurns, (e) => (z(), B("option", {
								key: e.id,
								value: e.id
							}, j(e.label), 9, GE))), 128))], 512), [[ns, ie.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(oE, {
							label: P(X)("config.thoughtSignature"),
							help: P(X)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: F(() => [U(tE, {
								modelValue: P(ne),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ _n(ne) ? ne.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(oE, {
							label: P(X)("config.streamToolArguments"),
							help: P(X)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: F(() => [rr(H("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ _n(E) ? E.value = e : null,
								class: "input"
							}, [(z(!0), B(R, null, L(P(xs), (e) => (z(), B("option", {
								key: e,
								value: e
							}, j(P(X)(`config.streamToolArguments.${e}`)), 9, KE))), 128))], 512), [[ns, P(E)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (z(), V(oE, {
							key: 0,
							label: P(X)("config.maxSteps"),
							inline: ""
						}, {
							default: F(() => [H("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: P(re),
								onChange: r[11] ||= (e) => re.value = Se(e)
							}, null, 40, qE)]),
							_: 1
						}, 8, ["label"])) : G("", !0)
					], 64)) : G("", !0),
					U(oE, {
						label: P(X)("config.finalFallback"),
						help: P(X)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: F(() => [U(tE, {
							modelValue: P(D),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ _n(D) ? D.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			S.value.length > 1 ? (z(), V(Yw, {
				key: 0,
				title: P(X)("config.workflow"),
				icon: P(iw),
				help: C.value
			}, {
				default: F(() => [U(PE, {
					modelValue: ee.value,
					"onUpdate:modelValue": r[13] ||= (e) => ee.value = e,
					options: S.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(Yw, {
				title: P(X)("writing.actors"),
				icon: P(fC),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(ae.value, ([e, t]) => (z(), B("div", {
					key: e,
					class: "field-grid"
				}, [U(oE, { label: P(X)("writing.actorName", { actor: e }) }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => oe("names", e, t.target.value)
					}, null, 40, JE)]),
					_: 2
				}, 1032, ["label"]), U(oE, { label: P(X)("writing.actorPrefix") }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => oe("prefixes", e, t.target.value)
					}, null, 40, YE)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Yw, {
				title: P(X)("writing.meta"),
				icon: P(AC),
				help: P(X)("writing.meta.hint")
			}, {
				actions: F(() => [U(tE, {
					modelValue: le.value,
					"onUpdate:modelValue": r[14] ||= (e) => le.value = e,
					label: P(X)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [le.value ? (z(), V(oE, {
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
						onChange: r[15] ||= (e) => fe(e.target.value)
					}, null, 40, XE)]),
					_: 1
				}, 8, ["label", "help"])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			P(t).storylines ? (z(), V(Yw, {
				key: 1,
				title: P(X)("storylines.enabled"),
				icon: P(vC),
				help: P(X)("storylines.config.hint")
			}, {
				actions: F(() => [U(tE, {
					modelValue: ue.value,
					"onUpdate:modelValue": r[16] ||= (e) => ue.value = e,
					label: P(X)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [ue.value ? (z(), B(R, { key: 0 }, [U(oE, {
					label: P(X)("storylines.freezeVariables"),
					help: P(X)("storylines.freezeVariables.hint"),
					inline: ""
				}, {
					default: F(() => [U(tE, {
						modelValue: de.value,
						"onUpdate:modelValue": r[17] ||= (e) => de.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]), H("button", {
					type: "button",
					class: "btn ghost",
					onClick: r[18] ||= (e) => P(Wy)("storylines")
				}, j(P(X)("storylines.openTab")), 1)], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(Yw, {
				title: P(X)("writing.tokenSaving"),
				icon: P(oC),
				help: P(X)("writing.tokenSaving.hint")
			}, {
				actions: F(() => [U(tE, {
					modelValue: O.value,
					"onUpdate:modelValue": r[19] ||= (e) => O.value = e,
					label: P(X)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [O.value ? (z(), B(R, { key: 0 }, [
					U(oE, {
						label: P(X)("writing.keepFullTurns"),
						help: P(X)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.keepFullTurns,
							onChange: r[20] ||= (e) => se("keepFullTurns", e.target.value)
						}, null, 40, ZE)]),
						_: 1
					}, 8, ["label", "help"]),
					U(oE, {
						label: P(X)("writing.userInput"),
						help: P(X)("writing.userInput.hint")
					}, {
						default: F(() => [U(PE, {
							modelValue: k.value,
							"onUpdate:modelValue": r[21] ||= (e) => k.value = e,
							options: ce.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					k.value === "truncate" ? (z(), V(oE, {
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
							onChange: r[22] ||= (e) => se("truncateUserAfter", e.target.value)
						}, null, 40, QE)]),
						_: 1
					}, 8, ["label", "help"])) : G("", !0)
				], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Yw, {
				title: P(X)("writing.cache"),
				icon: P(uC),
				help: P(X)("writing.cache.hint")
			}, {
				actions: F(() => [U(tE, {
					modelValue: pe.value,
					"onUpdate:modelValue": r[23] ||= (e) => pe.value = e,
					label: P(X)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [pe.value ? (z(), B(R, { key: 0 }, [U(oE, {
					label: P(X)("writing.cacheTtl"),
					help: P(X)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.ttlMinutes,
						onChange: r[24] ||= (e) => me("ttlMinutes", e.target.value)
					}, null, 40, $E)]),
					_: 1
				}, 8, ["label", "help"]), U(oE, {
					label: P(X)("writing.cacheMaxDeferred"),
					help: P(X)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.maxDeferredTurns,
						onChange: r[25] ||= (e) => me("maxDeferredTurns", e.target.value)
					}, null, 40, eD)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (z(), V(Yw, {
				key: 2,
				title: P(X)("config.customUi"),
				icon: P(RC),
				help: P(X)("config.customUi.hint")
			}, {
				actions: F(() => [U(tE, {
					modelValue: s.value,
					"onUpdate:modelValue": r[26] ||= (e) => s.value = e,
					label: P(X)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [c.value && !s.value ? (z(), B("p", tD, j(P(X)("config.customUi.changed")), 1)) : G("", !0), H("ul", nD, [(z(!0), B(R, null, L(o.value, (e) => (z(), B("li", {
					key: e.id,
					class: "row tight"
				}, [H("span", rD, j(e.title), 1), H("span", iD, j(P(X)(`config.customUi.${e.mode}`)) + " · " + j(P(X)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			U(Yw, {
				title: P(X)("config.sampling"),
				icon: P(_C),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [
					(z(), B(R, null, L(he, (e) => (z(), B(R, { key: e.key }, [be(e.key) ? (z(), V(oE, {
						key: 0,
						label: P(X)(`sampling.${e.key}`)
					}, {
						default: F(() => [H("div", aD, [H("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: ye.value[e.key],
							onInput: (t) => xe(e.key, Se(t))
						}, null, 40, oD), H("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: ye.value[e.key],
							onChange: (t) => xe(e.key, Se(t))
						}, null, 40, sD)])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)),
					H("div", cD, [(z(), B(R, null, L(ge, (e) => (z(), B(R, { key: e }, [be(e) ? (z(), V(oE, {
						key: 0,
						label: P(X)(`sampling.${e}`)
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							value: ye.value[e],
							onChange: (t) => xe(e, Se(t))
						}, null, 40, lD)]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)), be("reasoning_effort") ? (z(), V(oE, {
						key: 0,
						label: P(X)("sampling.reasoning_effort")
					}, {
						default: F(() => [H("select", {
							class: "input",
							value: ye.value.reasoning_effort,
							onChange: r[27] ||= (e) => xe("reasoning_effort", e.target.value)
						}, [(z(), B(R, null, L(ve, (e) => H("option", {
							key: e,
							value: e
						}, j(P(X)(`effort.${e}`)), 9, dD)), 64))], 40, uD)]),
						_: 1
					}, 8, ["label"])) : G("", !0)]),
					(z(), B(R, null, L(_e, (e) => (z(), B(R, { key: e }, [be(e) ? (z(), V(oE, {
						key: 0,
						label: P(X)(`sampling.${e}`),
						inline: ""
					}, {
						default: F(() => [U(tE, {
							"model-value": !!ye.value[e],
							"onUpdate:modelValue": (t) => xe(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), pD = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function mD(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: X("config.transport"),
			options: t([...bs], (e) => X(`transport.${e}`))
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
				label: yf(e, "workflows", t.id, "name", t.name)
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
			options: t(pD, (e) => X(`um.genType.${e}`))
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
var hD = (e) => e.modules.filter((e) => e.toggle === "user");
function gD(e) {
	let t = mD(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return hD(e).length && r.push({
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
function _D(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function vD(e, t) {
	return t === "module" ? hD(e).map((t) => ({
		value: t.id,
		label: yf(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: yf(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function yD(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: vD(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? yf(e, "params", t.id, "label", t.label) : r;
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
			label: bD(e, t.id, n.value, n.label)
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
	return mD(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var bD = (e, t, n, r) => vf(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), xD = {
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
function SD(e, t) {
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
		let n = String(vD(e, t)[0]?.value ?? "");
		return CD(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return CD(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function CD(e, t, n) {
	let r = yD(e, n);
	return t.path && yD(e, t.path).kind === r.kind && xD[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function wD(e, t, n = "") {
	return e === "bool" ? X(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? X(`um.op.list.${t}`) : e === "enum" ? X(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var TD = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(X("um.or")) : t === void 0 ? "" : n(t);
};
function ED(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? X("um.kw.input") : X("um.kw.recentN", { n: t.depth ?? 3 })} ${X(`um.kw.${t.op}`)} ${t.words.join(X("um.or"))}`;
	let n = yD(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? X("um.boolDesc", {
		label: n.label,
		value: wD(n.kind, t.op, t.path)
	}) : `${n.label} ${wD(n.kind, t.op)} ${TD(n, t.value)}`;
}
function DD(e, t) {
	let n = t.rules.filter(Hu);
	return n.length ? n.map((t) => ED(e, t)).join(t.match === "any" ? `\n${X("um.match.anyJoin")} ` : `\n${X("um.match.allJoin")} `) : X("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var OD = ["aria-label"], kD = { class: "um-picker-head" }, AD = { class: "small muted" }, jD = { class: "um-choice-text" }, MD = { class: "xs muted" }, ND = ["data-template", "onClick"], PD = { class: "um-choice-text" }, FD = {
	key: 0,
	class: "xs muted um-choice-desc"
}, ID = ["data-id"], LD = ["aria-label", "onPointerdown"], RD = ["onClick"], zD = { class: "um-row-name ellipsis" }, BD = { class: "um-row-meta xs muted ellipsis" }, VD = {
	key: 3,
	class: "faint small"
}, HD = /* @__PURE__ */ I({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => Tm(n.preset)), a = K(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? yf(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? yf(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.map((e) => e.point))].map(o).concat(e.vars.map((e) => s(e.var))).join(" · "), l = (e) => $u(n.preset, e), u = (e) => X("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(Hu);
		function f(e, t) {
			e.enabled = t, J();
		}
		let p = K(() => Md(n.preset).map((e) => ({
			tpl: e,
			body: Sf(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ N(!1), h = /* @__PURE__ */ N(null);
		function _() {
			m.value = !1;
			let e = km(n.preset, X("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function v(e) {
			m.value = !1;
			let t = Am(n.preset, Sf(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function y() {
			if (!p.value.length) return _();
			m.value = !m.value, m.value && (await Un(), h.value?.querySelector(".um-choice")?.focus());
		}
		let b = /* @__PURE__ */ N(null);
		async function x(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await ky(gd(e).modules);
				let { added: t, missing: i } = Fm(n.preset, e);
				g(i ? "warning" : "success", i ? X("um.importedMissing", {
					n: t.length,
					missing: i
				}) : X("um.imported", { n: t.length }));
			} catch (e) {
				wy(e) ? g("info", e.message) : g("error", X("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => ey(`${n.preset.id}.ap-modules.json`, Pm(n.preset)), ee = /* @__PURE__ */ N(null), C = /* @__PURE__ */ N(null);
		function w(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), C.value = t;
		}
		function T(e) {
			let t = C.value;
			if (!t || !ee.value) return;
			let r = [...ee.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && Nm(n.preset, t, r);
		}
		let te = () => {
			C.value = null;
		};
		return (t, n) => (z(), V(Yw, {
			title: P(X)("um.title"),
			help: P(X)("um.help")
		}, {
			actions: F(() => [
				a.value ? (z(), V($, {
					key: 0,
					icon: P(tw),
					label: P(X)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : G("", !0),
				i.value.length ? (z(), V($, {
					key: 1,
					icon: P(dC),
					label: P(X)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : G("", !0),
				a.value && i.value.length ? (z(), V($, {
					key: 2,
					icon: P(LC),
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
					onKeydown: n[2] ||= ds(ls((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					H("div", kD, [H("span", AD, j(P(X)("um.startFrom")), 1), U($, {
						icon: P(aw),
						label: P(X)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					H("button", {
						type: "button",
						class: "um-choice",
						onClick: _
					}, [U(P(hC)), H("span", jD, [H("span", null, j(P(X)("um.blank")), 1), H("span", MD, j(P(X)("um.blank.desc")), 1)])]),
					(z(!0), B(R, null, L(p.value, (e) => (z(), B("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => v(e.tpl)
					}, [U(P(wC)), H("span", PD, [H("span", null, j(e.body.name), 1), e.body.description ? (z(), B("span", FD, j(e.body.description), 1)) : G("", !0)])], 8, ND))), 128))
				], 40, OD)) : G("", !0),
				i.value.length ? (z(), B("div", {
					key: 1,
					ref_key: "listEl",
					ref: ee,
					class: "um-list"
				}, [(z(!0), B(R, null, L(i.value, (t) => (z(), B("div", {
					key: t.id,
					class: A(["um-row", {
						off: !t.enabled,
						dragging: C.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (z(), B("span", {
						key: 0,
						class: "um-grip",
						"aria-label": P(X)("um.reorder"),
						onPointerdown: (e) => w(e, t.id),
						onPointermove: T,
						onPointerup: te,
						onPointercancel: te
					}, [U(P(xC))], 40, LD)) : G("", !0),
					H("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [H("span", zD, j(t.name || P(X)("um.untitled")), 1), H("span", BD, j(c(t) || P(X)("um.noEntries")), 1)], 8, RD),
					l(t).length ? (z(), V(sw, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: F(() => [U(P($C), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : G("", !0),
					d(t) ? (z(), V(sw, {
						key: 2,
						text: P(DD)(e.preset, t.trigger),
						align: "end"
					}, {
						default: F(() => [U(P(ow), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : G("", !0),
					U(tE, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, ID))), 128))], 512)) : a.value && !m.value ? (z(), B("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: y
				}, [U(P(LC)), W(j(P(X)("um.new")), 1)])) : a.value ? G("", !0) : (z(), B("div", VD, j(P(X)("um.noPoints")), 1)),
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
}), UD = ["title"], WD = ["aria-label", "onClick"], GD = ["placeholder"], KD = /* @__PURE__ */ I({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ii({
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
		let t = li(e, "modelValue"), n = e, r = /* @__PURE__ */ N(""), i = /* @__PURE__ */ N(null);
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
		}, j(t), 9, UD), H("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: ls((e) => c(n), ["stop"])
		}, [U(P(aw))], 8, WD)], 2))), 128)), rr(H("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: A(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, GD), [[$o, r.value]])]));
	}
}), qD = { class: "rule" }, JD = { class: "rule-head" }, YD = ["value", "aria-label"], XD = ["label"], ZD = ["value"], QD = ["value"], $D = ["value"], eO = ["value"], tO = ["value"], nO = {
	key: 1,
	class: "grow"
}, rO = {
	key: 0,
	class: "rule-body"
}, iO = { class: "row wrap" }, aO = {
	key: 0,
	class: "unit small muted"
}, oO = ["value"], sO = ["value"], cO = { value: "any" }, lO = { value: "none" }, uO = { class: "row kw-words" }, dO = {
	key: 1,
	class: "rule-body"
}, fO = ["value"], pO = {
	key: 2,
	class: "rule-body"
}, mO = ["value"], hO = ["value"], gO = { class: "row wrap option-chips" }, _O = ["aria-pressed", "onClick"], vO = {
	key: 2,
	class: "row"
}, yO = ["value"], bO = ["value"], xO = ["value"], SO = ["list", "value"], CO = ["value"], wO = {
	key: 3,
	class: "rule-error xs"
}, TO = /* @__PURE__ */ I({
	__name: "RuleRow",
	props: /*@__PURE__*/ ii({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ii(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = li(e, "modelValue"), r = K(() => gD(t.preset)), i = K(() => _D(n.value)), a = K(() => vD(t.preset, i.value)), o = K(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = K(() => n.value.kind === "var" ? yD(t.preset, n.value.path) : null), c = K(() => Ju(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = SD(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = CD(t.preset, r, `${i}.${e}`);
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
		let g = K(() => s.value?.kind === "list" ? "list" : "bool"), _ = K(() => xD[g.value].map((e) => ({
			value: e,
			label: wD(g.value, e, n.value.path)
		}))), v = K(() => (s.value ? xD[s.value.kind] : []).map((e) => ({
			value: e,
			label: wD(s.value.kind, e)
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
		return (e, t) => (z(), B("div", qD, [
			H("div", JD, [
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
				}, j(e.label), 9, ZD))), 128))], 8, XD))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (z(), B("option", {
					key: 0,
					value: i.value
				}, j(n.value.path), 9, QD)) : G("", !0)], 40, YD),
				a.value.length ? (z(), B("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
					key: String(e.value),
					value: e.value
				}, j(e.label), 9, eO))), 128)), a.value.some((e) => String(e.value) === o.value) ? G("", !0) : (z(), B("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, j(o.value), 9, tO))], 40, $D)) : (z(), B("span", nO)),
				U($, {
					icon: P(aw),
					label: P(X)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (z(), B("div", rO, [H("div", iO, [
				U(PE, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (z(), B("label", aO, [H("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? P(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, oO), W(" " + j(P(X)("um.kw.messages")), 1)])) : G("", !0),
				H("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [H("option", cO, j(P(X)("um.kw.any")), 1), H("option", lO, j(P(X)("um.kw.none")), 1)], 40, sO)
			]), H("div", uO, [U(KD, {
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
				icon: P(VC),
				label: P(X)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (z(), B("div", dO, [H("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, fO)])) : s.value ? (z(), B("div", pO, [s.value.kind === "bool" || s.value.kind === "list" ? (z(), V(PE, {
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
			}, j(e.label), 9, hO))), 128))], 40, mO), H("div", gO, [(z(!0), B(R, null, L(s.value.options, (e) => (z(), B("button", {
				key: String(e.value),
				type: "button",
				class: A(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, j(e.label), 11, _O))), 128))])], 64)) : (z(), B("div", vO, [H("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(v.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, bO))), 128))], 40, yO), s.value.kind === "number" ? (z(), B("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, xO)) : (z(), B(R, { key: 1 }, [H("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, SO), s.value.suggestions?.length ? (z(), B("datalist", {
				key: 0,
				id: l
			}, [(z(!0), B(R, null, L(s.value.suggestions, (e) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, CO))), 128))])) : G("", !0)], 64))]))])) : G("", !0),
			c.value ? (z(), B("div", wO, j(c.value), 1)) : G("", !0)
		]));
	}
}), EO = { class: "trigger" }, DO = {
	key: 1,
	class: "always faint small"
}, OO = {
	key: 0,
	class: "rule-join xs faint"
}, kO = { class: "btn ghost add picker" }, AO = ["aria-label"], jO = ["label"], MO = ["value"], NO = /* @__PURE__ */ I({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ii({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = li(e, "modelValue"), r = K(() => gD(t.preset)), i = /* @__PURE__ */ N(null), a = K(() => [{
			value: "all",
			label: X("um.match.all")
		}, {
			value: "any",
			label: X("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(SD(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (z(), B("div", EO, [
			n.value.rules.length > 1 ? (z(), V(PE, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : G("", !0),
			n.value.rules.length ? G("", !0) : (z(), B("div", DO, j(P(X)("um.always")), 1)),
			(z(!0), B(R, null, L(n.value.rules, (t, r) => (z(), B(R, { key: r }, [r > 0 ? (z(), B("div", OO, j(n.value.match === "any" ? P(X)("um.match.anyJoin") : P(X)("um.match.allJoin")), 1)) : G("", !0), U(TO, {
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
			H("label", kO, [
				U(P(LC)),
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
				}, j(e.label), 9, MO))), 128))], 8, jO))), 128))], 40, AO)
			])
		]));
	}
}), PO = { class: "um-entry-head" }, FO = { class: "um-var-label grow ellipsis" }, IO = {
	key: 0,
	class: "um-warn xs"
}, LO = ["placeholder"], RO = ["onUpdate:modelValue", "placeholder"], zO = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], BO = [
	"value",
	"placeholder",
	"onInput"
], VO = ["id"], HO = ["value"], UO = /* @__PURE__ */ I({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => Zu(n.preset, n.update.var)), a = K(() => i.value?.type !== n.update.type), o = K(() => i.value ? yf(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = K(() => i.value && yf(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = K(() => {
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
		return (t, n) => (z(), B("div", { class: A(["um-entry", { lost: a.value }]) }, [
			H("div", PO, [
				U(P(VS), { class: "faint" }),
				H("span", FO, j(o.value), 1),
				U(Kw, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				U($, {
					icon: P(aw),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (z(), B("div", IO, [U(P($C)), W(j(P(X)("um.bv.lost")), 1)])) : G("", !0),
			e.update.type === "string" ? rr((z(), B("textarea", {
				key: 1,
				"onUpdate:modelValue": n[1] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: P(X)("um.bv.append")
			}, null, 8, LO)), [[$o, e.update.text]]) : e.update.type === "list" ? (z(!0), B(R, { key: 2 }, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: "um-var-row list"
			}, [rr(H("textarea", {
				"onUpdate:modelValue": (t) => e.update.items[n] = t,
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: P(X)("um.bv.item")
			}, null, 8, RO), [[$o, e.update.items[n]]]), U($, {
				icon: P(aw),
				label: P(X)("um.removeEntry"),
				small: "",
				align: "end",
				onClick: (t) => e.update.items.splice(n, 1)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			])]))), 128)) : (z(), B(R, { key: 3 }, [(z(!0), B(R, null, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: "um-var-row"
			}, [
				rr(H("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: P(X)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, zO), [[$o, t.key]]),
				H("textarea", {
					value: t.value ?? "",
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: c.value.has(t.key.trim()) ? P(X)("um.bv.removes") : P(X)("um.bv.value"),
					onInput: (e) => t.value = e.target.value
				}, null, 40, BO),
				U($, {
					icon: P(aw),
					label: P(X)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]))), 128)), H("datalist", { id: l.value }, [(z(!0), B(R, null, L(c.value, ([e]) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, HO))), 128))], 8, VO)], 64)),
			e.update.type === "string" ? G("", !0) : (z(), B("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: d
			}, [U(P(LC)), W(j(e.update.type === "dict" ? P(X)("um.bv.addKey") : P(X)("um.bv.addItem")), 1)]))
		], 2));
	}
}), WO = { class: "um-editor" }, GO = { class: "um-head" }, KO = ["placeholder", "aria-label"], qO = { class: "um-entry-head" }, JO = ["onUpdate:modelValue", "aria-label"], YO = ["value"], XO = ["value"], ZO = [
	"value",
	"aria-label",
	"onChange"
], QO = ["value"], $O = {
	key: 0,
	class: "um-warn xs"
}, ek = ["onUpdate:modelValue", "placeholder"], tk = {
	key: 1,
	class: "rule-error xs pre"
}, nk = {
	key: 0,
	class: "btn ghost add picker"
}, rk = ["aria-label"], ik = ["value"], ak = { class: "um-foot" }, ok = ["title"], sk = ["title"], ck = ["title"], lk = /* @__PURE__ */ I({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		ur(() => n.module, J, { deep: !0 });
		let i = /* @__PURE__ */ N(null);
		Hr(() => {
			n.module.entries.some((e) => e.text) || Un(() => i.value?.select());
		});
		let a = K(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: yf(n.preset, "insertionPoints", e.id, "label", e.label),
			description: yf(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !Yu(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => gl(e.text).errors, d = (e) => u(e).map((e) => e.line ? X("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = Om(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = K(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: yf(n.preset, "vars", e.id, "label", e.label ?? e.id)
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
			v.value ? (Mm(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = jm(n.preset, n.module.id, (e) => X("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => ey(`${n.preset.id}.${ty(n.module.name)}.ap-modules.json`, Pm(n.preset, [n.module.id]));
		return (t, n) => (z(), B("div", WO, [
			H("header", GO, [
				U($, {
					icon: P(RS),
					label: P(X)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				rr(H("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: P(X)("um.untitled"),
					"aria-label": P(X)("um.name")
				}, null, 8, KO), [[$o, e.module.name]]),
				U(tE, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: P(X)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			U(Yw, {
				title: P(X)("um.content"),
				help: P(X)("um.content.help")
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.module.entries, (t, n) => (z(), B("div", {
					key: t.id,
					class: A(["um-entry", { lost: s(t) }])
				}, [
					H("div", qO, [
						U(P(DC), { class: "faint" }),
						rr(H("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": P(X)("um.point")
						}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
							key: e.id,
							value: e.id
						}, j(e.label), 9, YO))), 128)), s(t) ? (z(), B("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, j(P(X)("um.pointMissing", { id: t.point })), 9, XO)) : G("", !0)], 8, JO), [[ns, t.point]]),
						U(Kw, {
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
						}, j(P(X)(`um.role.${e || "merge"}`)), 9, QO)), 64))], 40, ZO),
						e.module.entries.length > 1 || e.module.vars.length ? (z(), V($, {
							key: 0,
							icon: P(aw),
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
					s(t) ? (z(), B("div", $O, [U(P($C)), W(j(P(X)("um.pointLost")), 1)])) : G("", !0),
					rr(H("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: P(X)("um.text.placeholder")
					}, null, 8, ek), [[$o, t.text]]),
					u(t).length ? (z(), B("div", tk, j(d(t)), 1)) : G("", !0)
				], 2))), 128)), a.value.length ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [U(P(LC)), W(j(P(X)("um.addEntry")), 1)])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (z(), V(Yw, {
				key: 0,
				title: P(X)("um.bv"),
				help: P(X)("um.bv.help")
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.module.vars, (t, n) => (z(), V(UO, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (z(), B("label", nk, [
					U(P(LC)),
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
					}, j(e.label), 9, ik))), 128))], 40, rk)
				])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : G("", !0),
			U(Yw, {
				title: P(X)("um.trigger"),
				help: P(X)("um.trigger.help")
			}, {
				default: F(() => [U(NO, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			H("footer", ak, [
				H("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.export"),
					onClick: x
				}, [U(P(dC)), H("span", null, j(P(X)("um.export")), 1)], 8, ok),
				H("button", {
					type: "button",
					class: "btn ghost",
					title: P(X)("um.duplicate"),
					onClick: b
				}, [U(P(sC)), H("span", null, j(P(X)("um.duplicate")), 1)], 8, sk),
				n[6] ||= H("span", { class: "grow" }, null, -1),
				H("button", {
					type: "button",
					class: A(["btn ghost danger", { armed: v.value }]),
					title: P(X)("common.delete"),
					onClick: y
				}, [U(P(QC)), H("span", null, j(v.value ? P(X)("um.confirmDelete") : P(X)("common.delete")), 1)], 10, ck)
			])
		]));
	}
}), uk = {
	key: 0,
	class: "module-row"
}, dk = { class: "grow" }, fk = { class: "ellipsis" }, pk = ["aria-label"], mk = ["aria-checked", "onClick"], hk = { class: "grow" }, gk = { class: "grow" }, _k = { class: "ellipsis" }, vk = {
	key: 0,
	class: "empty"
}, yk = /* @__PURE__ */ I({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = kE(), i = K(() => t.value && n.value ? du(t.value, n.value) : {}), a = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = lu(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : yf(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : yf(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? yf(e, "groups", t, "label", r?.label ?? t) : X("modules.other"),
					help: t && yf(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => yf(t.value, "modules", e.id, "name", e.name), s = (e) => yf(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(null), _ = K(() => t.value && h.value ? Tm(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Un(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Un(() => y()?.scrollTo({ top: v }));
		}
		return ur(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !P(t) || !P(n) ? (z(), V(jE, { key: 0 })) : _.value ? (z(), B("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(z(), V(lk, {
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
			U(HD, {
				preset: P(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(z(!0), B(R, null, L(a.value, (e) => (z(), V(Yw, {
				key: e.id,
				title: e.label,
				help: e.help
			}, Xr({
				default: F(() => [(z(!0), B(R, null, L(e.sets, (t) => (z(), B(R, { key: t.key }, [t.label ? (z(), B("div", uk, [H("span", dk, [H("span", fk, j(t.label), 1), U(Kw, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (z(), V(tE, {
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
					H("span", hk, j(o(e)), 1),
					U(Kw, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, mk))), 128))], 10, pk)) : G("", !0)], 64))), 128)), (z(!0), B(R, null, L(e.toggles, (e) => (z(), B("div", {
					key: e.id,
					class: "module-row"
				}, [H("span", gk, [H("span", _k, j(o(e)), 1), U(Kw, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), U(tE, {
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
				fn: F(() => [U(tE, {
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
			a.value.length ? G("", !0) : (z(), B("div", vk, j(P(X)("modules.none")), 1))
		], 512));
	}
}), bk = ["value", "onChange"], xk = ["value"], Sk = {
	key: 2,
	class: "unit"
}, Ck = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], wk = {
	key: 0,
	class: "small muted"
}, Tk = [
	"list",
	"value",
	"placeholder",
	"onChange"
], Ek = ["id"], Dk = ["value"], Ok = /* @__PURE__ */ I({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = kE(), i = K(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? yf(e, "groups", t, "label", e.groups[t]?.label ?? t) : X("writing.params"),
				help: t && yf(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => yf(t.value, "params", e.id, "label", e.label), o = (e) => yf(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => vf(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => Fl(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !P(t) || !P(n) ? (z(), V(jE, { key: 0 })) : (z(!0), B(R, { key: 1 }, L(i.value, (e) => (z(), V(Yw, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: P(JC)
		}, {
			default: F(() => [(z(!0), B(R, null, L(e.params, (e) => (z(), V(oE, {
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
				}, j(s(e, t.value, t.label)), 9, xk))), 128))], 40, bk)) : e.type === "list" ? (z(), V(KD, {
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
				])) : e.type === "number" ? (z(), B("div", Sk, [H("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, Ck), e.unit ? (z(), B("span", wk, j(e.unit), 1)) : G("", !0)])) : (z(), B(R, { key: 3 }, [H("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, Tk), e.options?.length ? (z(), B("datalist", {
					key: 0,
					id: f(e)
				}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
					key: String(t.value),
					value: t.value
				}, j(s(e, t.value, t.label)), 9, Dk))), 128))], 8, Ek)) : G("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), kk = { class: "kv" }, Ak = {
	key: 0,
	class: "kv-row"
}, jk = { class: "kv-key ellipsis" }, Mk = { class: "kv-value pre small" }, Nk = {
	key: 0,
	class: "kv-actions"
}, Pk = {
	key: 1,
	class: "kv-edit col"
}, Fk = ["placeholder"], Ik = ["placeholder"], Lk = { class: "row end" }, Rk = {
	key: 0,
	class: "kv-edit col"
}, zk = ["placeholder"], Bk = ["placeholder"], Vk = { class: "row end" }, Hk = {
	key: 1,
	class: "faint small kv-empty"
}, Uk = /* @__PURE__ */ I({
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
		return (t, n) => (z(), B("div", kk, [
			(z(!0), B(R, null, L(e.entries, (t, l) => (z(), B(R, { key: l }, [i.value === l ? (z(), B("div", Pk, [
				rr(H("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, Fk), [[$o, a.value]]),
				rr(H("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, Ik), [[$o, o.value]]),
				H("div", Lk, [U($, {
					icon: P(aw),
					label: P(X)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(KS),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (z(), B("div", Ak, [
				H("div", jk, j(l), 1),
				H("div", Mk, j(t), 1),
				e.readonly ? G("", !0) : (z(), B("div", Nk, [U($, {
					icon: P(IC),
					label: P(X)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), U($, {
					icon: P(QC),
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
			i.value === "" ? (z(), B("div", Rk, [
				rr(H("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(X)("memory.key")
				}, null, 8, zk), [[$o, a.value]]),
				rr(H("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(X)("memory.content")
				}, null, 8, Bk), [[$o, o.value]]),
				H("div", Vk, [U($, {
					icon: P(aw),
					label: P(X)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(KS),
					label: P(X)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : G("", !0),
			!Object.keys(e.entries).length && i.value === null ? (z(), B("div", Hk, j(P(X)("memory.empty")), 1)) : G("", !0),
			!e.readonly && i.value === null ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [U(P(LC)), W(j(P(X)("common.add")), 1)])) : G("", !0)
		]));
	}
}), Wk = {
	key: 1,
	class: "faint small"
}, Gk = {
	key: 0,
	class: "badge neutral"
}, Kk = ["placeholder"], qk = {
	key: 1,
	class: "faint small"
}, Jk = /* @__PURE__ */ I({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = kE(), r = K(() => n.value ? _p(n.value) : null), i = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => Yx.value ? Jh() : void 0, o = K(() => (Z.chatRev, i.value ? ip(Infinity, a()) : {})), s = K(() => r.value ? sp(r.value) : {}), c = K(() => (Z.chatRev, i.value ? ap(Infinity, a()) : null));
		async function l(e, t) {
			await op({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), Ly();
		}
		async function u(e) {
			await op({
				type: "memory.delete",
				key: e,
				source: "user"
			}), Ly();
		}
		let d = (e, t) => r.value && cp(r.value, "replace", e, t, "user"), f = (e) => r.value && cp(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ N("");
		ur(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = K(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await op({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), Ly();
		}
		return (e, t) => !P(n) || !r.value ? (z(), V(jE, { key: 0 })) : (z(), B(R, { key: 1 }, [
			U(Yw, {
				title: P(X)("memory.chat"),
				icon: P(OC),
				help: P(X)("memory.chat.hint")
			}, {
				default: F(() => [i.value ? (z(), V(Uk, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (z(), B("div", Wk, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Yw, {
				title: P(X)("memory.global"),
				icon: P(bC),
				help: P(X)("memory.global.hint")
			}, {
				actions: F(() => [U($, {
					icon: P(ew),
					label: P(X)("common.undo"),
					small: "",
					align: "end",
					disabled: !P(lp)(r.value),
					onClick: t[0] ||= (e) => P(dp)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), U($, {
					icon: P(zC),
					label: P(X)("common.redo"),
					small: "",
					align: "end",
					disabled: !P(up)(r.value),
					onClick: t[1] ||= (e) => P(fp)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: F(() => [U(Uk, {
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
			U(Yw, {
				title: P(X)("memory.recap"),
				icon: P(WC),
				help: P(X)("memory.recap.hint")
			}, {
				actions: F(() => [c.value ? (z(), B("span", Gk, "#0–" + j(c.value.coversUpTo), 1)) : G("", !0), i.value ? (z(), V($, {
					key: 1,
					icon: P(KS),
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
				default: F(() => [i.value ? rr((z(), B("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: P(X)("memory.recap.empty")
				}, null, 8, Kk)), [[$o, p.value]]) : (z(), B("div", qk, j(P(X)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), Yk = { class: "row tight xs muted" }, Xk = { class: "row" }, Zk = {
	key: 0,
	class: "xs text-danger"
}, Qk = { class: "row wrap xs muted" }, $k = { class: "badge neutral" }, eA = {
	key: 0,
	class: "badge neutral"
}, tA = { class: "badge neutral" }, nA = {
	key: 1,
	class: "badge warn"
}, rA = ["title"], iA = ["title"], aA = {
	key: 0,
	class: "row wrap xs muted"
}, oA = { class: "grow" }, sA = { key: 0 }, cA = ["onClick"], lA = { class: "grow mono" }, uA = { class: "xs muted" }, dA = { class: "row xs muted" }, fA = { class: "badge neutral" }, pA = { class: "pre mono scroll" }, mA = {
	key: 0,
	class: "xs faint region-msg"
}, hA = { key: 1 }, gA = ["onClick"], _A = { class: "grow mono" }, vA = { class: "xs muted" }, yA = {
	key: 0,
	class: "region-msg"
}, bA = { class: "pre mono scroll" }, xA = {
	key: 0,
	class: "xs faint"
}, SA = {
	key: 2,
	class: "xs text-warning"
}, CA = {
	key: 1,
	class: "faint small"
}, wA = ["onClick"], TA = { class: "mono grow ellipsis" }, EA = {
	key: 0,
	class: "badge warn"
}, DA = { class: "xs muted" }, OA = { class: "xs muted" }, kA = { class: "row xs muted" }, AA = { class: "grow" }, jA = { class: "mono scroll" }, MA = { class: "row xs muted" }, NA = { class: "grow" }, PA = { class: "mono scroll" }, FA = {
	key: 0,
	class: "faint small"
}, IA = { class: "row xs" }, LA = { class: "badge neutral" }, RA = { class: "muted" }, zA = { class: "mono scroll" }, BA = {
	key: 0,
	class: "faint small"
}, VA = { class: "row xs" }, HA = { class: "badge neutral" }, UA = { class: "grow muted" }, WA = { class: "small" }, GA = {
	key: 0,
	class: "faint small"
}, KA = { class: "xs faint mono build" }, qA = /* @__PURE__ */ I({
	__name: "DebugTab",
	setup(t) {
		let n = K(() => Lm.log.find((e) => e.kind === "assembly")?.data), r = K(() => Lm.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ on(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ on({});
		ur(n, async (t) => {
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
		}), g = K(() => Lm.log.filter((e) => e.kind !== "assembly")), _ = K(() => {
			Z.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of Rv(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (z(), B(R, null, [
			U(Yw, {
				title: P(X)("debug.dev"),
				icon: P(GC),
				help: P(X)("debug.dev.hint")
			}, {
				actions: F(() => [H("span", Yk, [H("span", { class: A(["dot status-dot", P(cy).status]) }, null, 2), W(j(P(X)(`debug.dev.${P(cy).status}`)), 1)])]),
				default: F(() => [U(oE, { label: P(X)("debug.dev.url") }, {
					default: F(() => [H("div", Xk, [rr(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						$o,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), U(tE, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: P(X)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), P(cy).error ? (z(), B("span", Zk, j(P(cy).error), 1)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Yw, {
				title: P(X)("debug.assembly"),
				icon: P(gC),
				collapsible: ""
			}, {
				default: F(() => [n.value ? (z(), B(R, { key: 0 }, [
					H("div", Qk, [
						H("span", $k, j(P(X)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (z(), B("span", eA, j(n.value.workflow), 1)) : G("", !0),
						H("span", tA, j(n.value.origin), 1),
						n.value.dryRun ? (z(), B("span", nA, "dry run")) : G("", !0),
						n.value.input ? (z(), B("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, j(P(X)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, rA)) : G("", !0),
						n.value.storyline ? (z(), B("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, j(n.value.storyline.main ? P(X)("storylines.main") : n.value.storyline.name) + j(n.value.storyline.if ? " · if" : "") + j(n.value.storyline.new ? " · new" : ""), 9, iA)) : G("", !0),
						t[3] ||= H("span", { class: "grow" }, null, -1),
						W(j(u(n.value.at)), 1)
					]),
					r.value ? (z(), B("div", aA, [
						H("span", { class: A(["badge", r.value.reason ? "warn" : "neutral"]) }, j(r.value.reason ? P(X)(`debug.cache.flush.${r.value.reason}`) : P(X)("debug.cache.kept")), 3),
						H("span", oA, j(p(r.value)), 1),
						r.value === n.value.cache ? G("", !0) : (z(), B("span", sA, j(u(r.value.at)), 1))
					])) : G("", !0),
					H("div", null, [(z(!0), B(R, null, L(n.value.regions, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						U(P(JS), { class: A(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						H("span", lA, j(e.id), 1),
						H("span", uA, j(e.messages.length) + " · " + j(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + j(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, cA), i.has(e.id) ? (z(), B(R, { key: 0 }, [(z(!0), B(R, null, L(e.messages, (e, t) => (z(), B("div", {
						key: t,
						class: "region-msg"
					}, [H("div", dA, [H("span", fA, j(e.role), 1), W(j(e.chars) + " ch", 1)]), H("div", pA, j(e.content), 1)]))), 128)), e.messages.length ? G("", !0) : (z(), B("div", mA, j(P(X)("debug.emptyRegion")), 1))], 64)) : G("", !0)]))), 128))]),
					n.value.vars?.length ? (z(), B("div", hA, [(z(!0), B(R, null, L(n.value.vars, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						U(P(JS), { class: A(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						H("span", _A, j(e.id), 1),
						H("span", vA, j(e.text.length) + " ch", 1)
					], 8, gA), i.has(`var:${e.id}`) ? (z(), B("div", yA, [H("div", bA, j(e.text), 1), e.text ? G("", !0) : (z(), B("div", xA, j(P(X)("debug.emptyRegion")), 1))])) : G("", !0)]))), 128))])) : G("", !0),
					n.value.warnings.length ? (z(), B("div", SA, j(n.value.warnings.join(" · ")), 1)) : G("", !0)
				], 64)) : (z(), B("div", CA, j(P(X)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Yw, {
				title: P(X)("debug.requests"),
				icon: P(aC),
				collapsible: ""
			}, {
				default: F(() => [(z(!0), B(R, null, L(P(Lm).requests, (e, t) => (z(), B("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [H("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					H("span", TA, j(e.genId) + " · #" + j(e.step), 1),
					e.error ? (z(), B("span", EA, j(P(X)("debug.error")), 1)) : G("", !0),
					H("span", DA, j(f(e.usage)), 1),
					H("span", OA, j(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, wA), s.value === t ? (z(), B(R, { key: 0 }, [
					H("div", kA, [H("span", AA, j(P(X)("debug.request")), 1), U($, {
						icon: P(cC),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", jA, j(c(e.request)), 1),
					H("div", MA, [H("span", NA, j(P(X)("debug.response")), 1), U($, {
						icon: P(cC),
						label: P(X)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", PA, j(e.error ?? c(e.response ?? "")), 1)
				], 64)) : G("", !0)]))), 128)), P(Lm).requests.length ? G("", !0) : (z(), B("div", FA, j(P(X)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Yw, {
				title: P(X)("debug.log"),
				icon: P(WC),
				collapsible: "",
				open: !1
			}, {
				actions: F(() => [U($, {
					icon: P(QC),
					label: P(X)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => P(Lm).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: F(() => [(z(!0), B(R, null, L(g.value, (e, n) => (z(), B("div", {
					key: n,
					class: "req"
				}, [H("div", IA, [
					H("span", LA, j(e.kind), 1),
					t[4] ||= H("span", { class: "grow" }, null, -1),
					H("span", RA, j(u(e.at)), 1)
				]), H("pre", zA, j(c(e.data)), 1)]))), 128)), g.value.length ? G("", !0) : (z(), B("div", BA, j(P(X)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Yw, {
				title: P(X)("debug.annotations"),
				icon: P(kC),
				help: P(X)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(_.value, (e, t) => (z(), B("div", {
					key: t,
					class: "req"
				}, [H("div", VA, [H("span", HA, "#" + j(e.mesId), 1), H("span", UA, "“" + j(e.quote) + "”", 1)]), H("div", WA, j(e.comment), 1)]))), 128)), _.value.length ? G("", !0) : (z(), B("div", GA, j(P(X)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H("div", KA, "Advanced Preset " + j(P("1.10.0")) + " · " + j(P("975d70c798c1ace6")), 1)
		], 64));
	}
}), JA = {
	key: 0,
	class: "faint small"
}, YA = {
	key: 1,
	class: "faint small"
}, XA = {
	key: 2,
	class: "faint small"
}, ZA = {
	key: 3,
	class: "col storyline-usage xs muted"
}, QA = ["onClick"], $A = { class: "card-title grow ellipsis" }, ej = {
	key: 0,
	class: "badge"
}, tj = {
	key: 1,
	class: "badge warn"
}, nj = { class: "badge neutral" }, rj = {
	key: 0,
	class: "card-body col"
}, ij = { class: "row wrap storyline-actions" }, aj = { class: "row tight small" }, oj = ["onClick"], sj = {
	key: 0,
	class: "faint small"
}, cj = {
	key: 1,
	class: "storyline-floors"
}, lj = ["title", "onClick"], uj = { class: "badge neutral mono" }, dj = { class: "xs muted" }, fj = { class: "grow ellipsis" }, pj = /* @__PURE__ */ I({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n, config: r, update: i } = kE(), a = K(() => !!n.value?.storylines), o = K({
			get: () => r.value?.storylines?.enabled !== !1,
			set: (e) => i((t) => {
				t.storylines = {
					...Yl,
					...t.storylines,
					enabled: e
				};
			})
		}), s = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), c = K(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), l = K(() => s.value && a.value ? tS(c.value) : []), u = K(() => (Z.chatRev, Wh().main ?? "")), d = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), f = (e) => {
			let t = new Set(d.value);
			t.has(e) ? t.delete(e) : t.add(e), d.value = t;
		};
		ur(() => Z.storylineFocus, (e) => {
			e !== null && (d.value = /* @__PURE__ */ new Set([...d.value, e]), Z.storylineFocus = null);
		}, { immediate: !0 });
		let m = () => {
			Ly(), _S();
		};
		async function _(e, t) {
			await Zh(e, t), m();
		}
		async function v(e) {
			await Cv(e) && m();
		}
		async function y() {
			let e = await h(`<h3>${p(X("storylines.nameMain"))}</h3><p>${p(X("storylines.nameMain.hint"))}</p>`, u.value, X("common.save"), X("common.cancel"));
			if (e === null) return;
			let t = e.trim();
			if (!Ql(t)) return g("warning", X("storylines.invalidName"), X("app.name"));
			if (!await Qh(t)) return g("warning", X("storylines.nameTaken", { name: t }), X("app.name"));
			m();
		}
		return (e, t) => !P(n) || !P(r) ? (z(), V(jE, { key: 0 })) : (z(), B(R, { key: 1 }, [U(Yw, {
			title: P(X)("tab.storylines"),
			icon: P(vC),
			help: P(X)("storylines.hint")
		}, Xr({
			default: F(() => [a.value ? o.value ? s.value ? (z(), B("div", ZA, [
				H("span", null, j(P(X)("storylines.usage.side")), 1),
				H("span", null, j(P(X)("storylines.usage.recent")), 1),
				H("span", null, j(P(X)("storylines.usage.new")), 1),
				H("span", null, j(P(X)("storylines.usage.if")), 1),
				H("span", null, j(P(X)("storylines.usage.main")), 1)
			])) : (z(), B("div", XA, j(P(X)("memory.noChat")), 1)) : (z(), B("div", YA, j(P(X)("storylines.off")), 1)) : (z(), B("div", JA, j(P(X)("storylines.unsupported")), 1))]),
			_: 2
		}, [a.value ? {
			name: "actions",
			fn: F(() => [U(tE, {
				modelValue: o.value,
				"onUpdate:modelValue": t[0] ||= (e) => o.value = e,
				label: P(X)("storylines.enabled")
			}, null, 8, ["modelValue", "label"])]),
			key: "0"
		} : void 0]), 1032, [
			"title",
			"icon",
			"help"
		]), a.value && o.value && s.value ? (z(!0), B(R, { key: 0 }, L(l.value, (e) => (z(), B("section", {
			key: e.key,
			class: A(["card storyline-card", { current: e.current }])
		}, [H("header", {
			class: "card-head clickable",
			onClick: (t) => f(e.key)
		}, [
			(z(), V(qr(e.main ? P(lC) : P(vC)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			H("span", $A, j(e.main ? e.name ? P(X)("storylines.mainNamed", { name: e.name }) : P(X)("storylines.main") : e.name || P(X)("storylines.unnamed")), 1),
			e.current ? (z(), B("span", ej, j(P(X)("storylines.current")), 1)) : G("", !0),
			e.if ? (z(), B("span", tj, j(P(X)("storylines.ifLine")), 1)) : G("", !0),
			H("span", nj, j(P(X)("storylines.floors", { n: e.floors.length })), 1),
			U(P(qS), {
				class: A(["chevron", { flipped: d.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, QA), d.value.has(e.key) ? (z(), B("div", rj, [H("div", ij, [e.main ? (z(), B("button", {
			key: 0,
			type: "button",
			class: "btn ghost",
			onClick: y
		}, [U(P(FC), { "aria-hidden": "true" }), W(j(e.name ? P(X)("common.rename") : P(X)("storylines.nameMain")), 1)])) : e.pending ? G("", !0) : (z(), B(R, { key: 1 }, [
			H("label", aj, [U(tE, {
				"model-value": e.if,
				label: P(X)("storylines.ifLine"),
				"onUpdate:modelValue": (t) => _(e.key, t)
			}, null, 8, [
				"model-value",
				"label",
				"onUpdate:modelValue"
			]), W(j(P(X)("storylines.ifLine.toggle")), 1)]),
			t[1] ||= H("span", { class: "grow" }, null, -1),
			H("button", {
				type: "button",
				class: "btn ghost",
				onClick: (t) => v(e.key)
			}, [U(P(lC), { "aria-hidden": "true" }), W(j(P(X)("storylines.makeMain")), 1)], 8, oj)
		], 64))]), e.floors.length ? (z(), B("ul", cj, [(z(!0), B(R, null, L(e.floors, (e) => (z(), B("li", {
			key: e.index,
			class: "row tight small clickable",
			title: P(X)("storylines.jump"),
			onClick: (t) => P(nS)(e.index)
		}, [
			H("span", uj, "#" + j(e.index), 1),
			H("span", dj, j(e.user ? P(X)("storylines.user") : P(X)("storylines.narrator")), 1),
			H("span", fj, j(e.title || "…"), 1)
		], 8, lj))), 128))])) : (z(), B("div", sj, j(P(X)("storylines.empty")), 1))])) : G("", !0)], 2))), 128)) : G("", !0)], 64));
	}
}), mj = ["aria-label"], hj = { class: "panel-head" }, gj = { class: "panel-logo" }, _j = { class: "grow" }, vj = { class: "panel-title ellipsis" }, yj = { class: "panel-sub ellipsis" }, bj = {
	class: "tabs",
	role: "tablist"
}, xj = [
	"title",
	"aria-selected",
	"onClick"
], Sj = { class: "panel-body scroll" }, Cj = /* @__PURE__ */ I({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: NC,
				view: DE
			},
			{
				id: "config",
				icon: qC,
				view: fD
			},
			{
				id: "modules",
				icon: BS,
				view: yk
			},
			{
				id: "writing",
				icon: FC,
				view: Ok
			},
			{
				id: "memory",
				icon: HS,
				view: Jk
			},
			{
				id: "storylines",
				icon: vC,
				view: pj
			},
			{
				id: "debug",
				icon: US,
				view: qA
			}
		], n = K(() => t.filter((e) => e.id !== "storylines" || !!zy.value?.storylines)), r = K(() => n.value.find((e) => e.id === Z.tab) ?? n.value[0]), i = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), a = K(() => {
			let e = zy.value;
			return e ? `v${e.version} · ${By.value.config}` : X("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && Z.panelOpen && (Z.panelOpen = !1);
		};
		return Hr(() => document.addEventListener("keydown", o)), Wr(() => {
			document.removeEventListener("keydown", o), ES(!1);
		}), ur(() => Z.panelOpen, (e) => {
			e && ES(!0);
		}, { immediate: !0 }), (e, t) => (z(), V(to, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => P(ES)(!1)
		}, {
			default: F(() => [P(Z).panelOpen ? (z(), B("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": P(X)("app.name")
			}, [
				H("header", hj, [
					H("div", gj, [U(P(CC))]),
					H("div", _j, [H("div", vj, j(P(zy) ? P(bf)(P(zy)) : P(X)("app.name")), 1), H("div", yj, j(a.value), 1)]),
					U(tE, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: P(X)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					U($, {
						icon: P(aw),
						label: P(X)("common.close"),
						align: "end",
						below: "",
						onClick: t[1] ||= (e) => P(Z).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				H("nav", bj, [(z(!0), B(R, null, L(n.value, (e) => (z(), B("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: A(["tab", { on: e.id === P(Z).tab }]),
					title: P(X)(`tab.${e.id}`),
					"aria-selected": e.id === P(Z).tab,
					onClick: (t) => P(Z).tab = e.id
				}, [(z(), V(qr(e.icon))), H("span", null, j(P(X)(`tab.${e.id}`)), 1)], 10, xj))), 128))]),
				H("main", Sj, [(z(), V(Ir, null, [(z(), V(qr(r.value.view), { key: r.value.id }))], 1024))])
			], 8, mj)) : G("", !0)]),
			_: 1
		}));
	}
}), wj = { class: "inline-drawer" }, Tj = { class: "inline-drawer-toggle inline-drawer-header" }, Ej = { class: "inline-drawer-content" }, Dj = { class: "flex-container alignItemsCenter spaceBetween" }, Oj = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, kj = { key: 0 }, Aj = { class: "text_muted" }, jj = {
	key: 1,
	class: "text_muted"
}, Mj = /* @__PURE__ */ I({
	__name: "SettingsDrawer",
	setup(e) {
		let t = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (z(), B("div", wj, [H("div", Tj, [H("b", null, j(P(X)("app.name")), 1), n[3] ||= H("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), H("div", Ej, [
			H("div", Dj, [H("label", Oj, [rr(H("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[es, t.value]]), H("span", null, j(P(X)("settings.enable")), 1)]), H("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => P(Wy)(),
				onKeydown: n[2] ||= ds((e) => P(Wy)(), ["enter"])
			}, [n[4] ||= H("i", { class: "fa-solid fa-layer-group" }, null, -1), H("span", null, j(P(X)("panel.open")), 1)], 32)]),
			n[5] ||= H("hr", null, null, -1),
			H("h4", null, j(P(X)("settings.preset")), 1),
			P(zy) ? (z(), B("div", kj, [W(j(P(bf)(P(zy))) + " ", 1), H("span", Aj, "v" + j(P(zy).version) + " · " + j(P(By).config), 1)])) : (z(), B("i", jj, j(P(X)("settings.inactive")), 1))
		])]));
	}
}), Nj = {
	key: 0,
	class: "preset-banner"
}, Pj = { class: "preset-banner-text" }, Fj = /* @__PURE__ */ I({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => P(zy) ? (z(), B("div", Nj, [
			U(P(CC), { class: "preset-banner-icon" }),
			H("span", Pj, j(P(X)("banner.usesAp")), 1),
			H("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => P(Wy)()
			}, j(P(X)("panel.open")), 1)
		])) : G("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function Ij() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), hs(Mj).mount(t);
}
function Lj() {
	hb("ap-stages", ww, ["mesid"]), hb("ap-cards", UT, ["mesid"]), hb("ap-top-cards", UT, ["mesid", "position"]), hb("ap-dock", JT), hb("ap-storyline", QT, ["mesid"]), hb("ap-panel", Cj), hb("ap-preset-banner", Fj), pb(), Ry();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, Ry);
	OS(), Ij(), vS(), Jx();
}
//#endregion
//#region src/index.ts
var Rj = {
	version: "1.10.0",
	buildId: "975d70c798c1ace6",
	nextGeneration: (e) => qp(e),
	listPresets: () => of().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => Ip(),
	update: qv,
	togglePanel: (e) => {
		Z.panelOpen = e ?? !Z.panelOpen;
	},
	annotations: Vv
};
globalThis.advancedPresetInterceptor = Fg, window.AdvancedPreset = Rj;
function zj(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function Bj() {
	for (let { preset: e } of of()) try {
		await Vp(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function Vj() {
	let { eventSource: t, eventTypes: n } = e();
	q(), xv(), yy(), Zy(), Bv(), await i(), await rf();
	for (let { preset: e } of of()) {
		let t = Ap(e);
		t.length && zm("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => vg(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Sv(e)), Mv(), Pg(), t.on(n.MESSAGE_RECEIVED, (e, t) => Fv(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		im.setPending(null), im.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => im.sweep());
	let r = zj(() => {
		let e = Ip(), t = e ? uf(e) : void 0;
		t && Gp(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await Bj(), (async () => {
			for (let { preset: e } of of()) await oy(e);
		})(), Av({ reload: !0 }), py(), Gv();
	};
	t.on(n.APP_READY, () => void a()), Lj(), zm("init", {
		version: "1.10.0",
		build: "975d70c798c1ace6",
		enabled: q().enabled
	});
}
var Hj = Kv, Uj = Wx;
Vj().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { Hj as advancedPresetOnUpdate, Uj as advancedPresetRegisterChatSurface };

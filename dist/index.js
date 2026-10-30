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
var y = {}, b = [], x = () => {}, S = () => !1, ee = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), te = (e) => e.startsWith("onUpdate:"), C = Object.assign, ne = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, re = Object.prototype.hasOwnProperty, w = (e, t) => re.call(e, t), T = Array.isArray, ie = (e) => de(e) === "[object Map]", ae = (e) => de(e) === "[object Set]", oe = (e) => de(e) === "[object Date]", se = (e) => de(e) === "[object RegExp]", E = (e) => typeof e == "function", D = (e) => typeof e == "string", ce = (e) => typeof e == "symbol", O = (e) => typeof e == "object" && !!e, le = (e) => (O(e) || E(e)) && E(e.then) && E(e.catch), ue = Object.prototype.toString, de = (e) => ue.call(e), fe = (e) => de(e).slice(8, -1), pe = (e) => de(e) === "[object Object]", me = (e) => D(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, he = /* @__PURE__ */ v(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ge = (e) => {
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
	let t = D(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Oe, ke = () => Oe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ae(e) {
	if (T(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = D(r) ? Pe(r) : Ae(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (D(e) || O(e)) return e;
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
var Fe = /* @__PURE__ */ v("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
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
	let r = ie(e), i = ie(t);
	if (r || i || (r = ae(e), i = ae(t), r || i)) return r && i ? Re(e, t, n) : !1;
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
	let r = oe(e), i = oe(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = ce(e), i = ce(t), r || i ? e === t : (r = T(e), i = T(t), r || i ? r && i ? Be(e, t, n, Le) : !1 : (r = O(e), i = O(t), r || i ? !r || !i ? !1 : Be(e, t, n, ze) : String(e) === String(t))));
}
function He(e, t) {
	return e.findIndex((e) => Ve(e, t));
}
var Ue = (e) => !!(e && e.__v_isRef === !0), A = (e) => D(e) ? e : e == null ? "" : T(e) || O(e) && (e.toString === ue || !E(e.toString)) ? Ue(e) ? A(e.value) : JSON.stringify(e, We, 2) : String(e), We = (e, t) => Ue(t) ? We(e, t.value) : ie(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ge(t, r) + " =>"] = n, e), {}) } : ae(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ge(e)) } : ce(t) ? Ge(t) : O(t) && !T(t) && !pe(t) ? String(t) : t, Ge = (e, t = "") => ce(e) ? `Symbol(${e.description ?? t})` : e, Ke, qe = class {
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
		let i = T(e), a = i && me(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === St || !ce(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(St)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(bt)), ie(e) && s(o.get(xt)));
				break;
			case "delete":
				i || (s(o.get(bt)), ie(e) && s(o.get(xt)));
				break;
			case "set": ie(e) && s(o.get(bt));
		}
	}
	rt();
}
function Tt(e) {
	let t = /* @__PURE__ */ j(e);
	return t === e || (Ct(t, "iterate", St), /* @__PURE__ */ fn(e)) ? t : /* @__PURE__ */ dn(e) ? /* @__PURE__ */ un(e) ? t.map((e) => gn(hn(e))) : t.map(gn) : t.map(hn);
}
function Et(e) {
	return Ct(e = /* @__PURE__ */ j(e), "iterate", St), e;
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
		return Tt(this).concat(...e.map((e) => T(e) ? Tt(e) : e));
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
	let r = /* @__PURE__ */ j(e);
	Ct(r, "iterate", St);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ pn(n[0]) ? (n[0] = /* @__PURE__ */ j(n[0]), r[t](...n)) : i;
}
function Ft(e, t, n = []) {
	ft(), nt();
	let r = (/* @__PURE__ */ j(e))[t].apply(e, n);
	return rt(), pt(), r;
}
var It = /* @__PURE__ */ v("__proto__,__v_isRef,__isVue"), Lt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ce));
function Rt(e) {
	ce(e) || (e = String(e));
	let t = /* @__PURE__ */ j(this);
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
		let a = T(e);
		if (!r) {
			let e;
			if (a && (e = Ot[t])) return e;
			if (t === "hasOwnProperty") return Rt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ _n(e) ? e : n);
		if ((ce(t) ? Lt.has(t) : It(t)) || (r || Ct(e, "get", t), i)) return o;
		if (/* @__PURE__ */ _n(o)) {
			let e = a && me(t) ? o : o.value;
			return r && O(e) ? /* @__PURE__ */ cn(e) : e;
		}
		return O(o) ? r ? /* @__PURE__ */ cn(o) : /* @__PURE__ */ on(o) : o;
	}
}, Bt = class extends zt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = T(e) && me(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ dn(i);
			if (!/* @__PURE__ */ fn(n) && !/* @__PURE__ */ dn(n) && (i = /* @__PURE__ */ j(i), n = /* @__PURE__ */ j(n)), !a && /* @__PURE__ */ _n(i) && !/* @__PURE__ */ _n(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : w(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ _n(e) ? e : r);
		return e === /* @__PURE__ */ j(r) && s && (o ? Ce(n, i) && wt(e, "set", t, n, i) : wt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = w(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && wt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!ce(t) || !Lt.has(t)) && Ct(e, "has", t), n;
	}
	ownKeys(e) {
		return Ct(e, "iterate", T(e) ? "length" : bt), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ j(i), o = ie(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Gt : t ? gn : hn;
		return !t && Ct(a, "iterate", c ? xt : bt), C(Object.create(l), { next() {
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
			let r = this.__v_raw, i = /* @__PURE__ */ j(r), a = /* @__PURE__ */ j(n);
			e || (Ce(n, a) && Ct(i, "get", n), Ct(i, "get", a));
			let { has: o } = Kt(i), s = t ? Gt : e ? gn : hn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Ct(/* @__PURE__ */ j(t), "iterate", bt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ j(n), i = /* @__PURE__ */ j(t);
			return e || (Ce(t, i) && Ct(r, "has", t), Ct(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ j(a), s = t ? Gt : e ? gn : hn;
			return !e && Ct(o, "iterate", bt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return C(n, e ? {
		add: Jt("add"),
		set: Jt("set"),
		delete: Jt("delete"),
		clear: Jt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ j(this), r = Kt(n), i = /* @__PURE__ */ j(e), a = !t && !/* @__PURE__ */ fn(e) && !/* @__PURE__ */ dn(e) ? i : e;
			return r.has.call(n, a) || Ce(e, a) && r.has.call(n, e) || Ce(i, a) && r.has.call(n, i) || (n.add(a), wt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ fn(n) && !/* @__PURE__ */ dn(n) && (n = /* @__PURE__ */ j(n));
			let r = /* @__PURE__ */ j(this), { has: i, get: a } = Kt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ j(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Ce(n, s) && wt(r, "set", e, n, s) : wt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ j(this), { has: n, get: r } = Kt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ j(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && wt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ j(this), t = e.size !== 0, n = e.clear();
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
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(w(n, i) && i in r ? n : r, i, a);
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
	if (!O(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
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
function j(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ j(t) : e;
}
function mn(e) {
	return !w(e, "__v_skip") && Object.isExtensible(e) && Te(e, "__v_skip", !0), e;
}
var hn = (e) => O(e) ? /* @__PURE__ */ on(e) : e, gn = (e) => O(e) ? /* @__PURE__ */ cn(e) : e;
// @__NO_SIDE_EFFECTS__
function _n(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	return vn(e, !1);
}
function vn(e, t) {
	return /* @__PURE__ */ _n(e) ? e : new yn(e, t);
}
var yn = class {
	constructor(e, t) {
		this.dep = new _t(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ j(e), this._value = t ? e : hn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ fn(e) || /* @__PURE__ */ dn(e);
		e = n ? e : /* @__PURE__ */ j(e), Ce(e, t) && (this._rawValue = e, this._value = n ? e : hn(e), this.dep.trigger());
	}
};
function N(e) {
	return /* @__PURE__ */ _n(e) ? e.value : e;
}
var bn = {
	get: (e, t, n) => t === "__v_raw" ? e : N(Reflect.get(e, t, n)),
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
	return E(e) ? r = e : (r = e.get, i = e.set), new wn(r, i, n);
}
var En = {}, Dn = /* @__PURE__ */ new WeakMap(), On = void 0;
function kn(e, t = !1, n = On) {
	if (n) {
		let t = Dn.get(n);
		t || Dn.set(n, t = []), t.push(e);
	}
}
function An(e, t, n = y) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ fn(e) || i === !1 || i === 0 ? jn(e, 1) : jn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ _n(e) ? (d = () => e.value, m = /* @__PURE__ */ fn(e)) : /* @__PURE__ */ un(e) ? (d = () => l(e), m = !0) : T(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ un(e) || /* @__PURE__ */ fn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ _n(e)) return e.value;
		if (/* @__PURE__ */ un(e)) return l(e);
		if (E(e)) return c ? c(e, 2) : e();
	})) : d = E(e) ? t ? c ? () => c(e, 2) : e : () => {
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
	} : x, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => jn(e(), t);
	}
	let g = Je(), _ = () => {
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
	let v = h ? Array(e.length).fill(En) : En, b = (e) => {
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
	return s && s(b), u = new Ze(d), u.scheduler = o ? () => o(b, !1) : b, p = (e) => kn(e, !1, u), f = u.onStop = () => {
		let e = Dn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Dn.delete(u);
		}
	}, t ? r ? b(!0) : v = u.run() : o ? o(b.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function jn(e, t = Infinity, n) {
	if (t <= 0 || !O(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ _n(e)) jn(e.value, t, n);
	else if (T(e)) for (let r = 0; r < e.length; r++) jn(e[r], t, n);
	else if (ae(e) || ie(e)) e.forEach((e) => {
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
	if (E(e)) {
		let i = Mn(e, t, n, r);
		return i && le(i) && i.catch((e) => {
			Pn(e, t, n);
		}), i;
	}
	if (T(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Nn(e[a], t, n, r));
		return i;
	}
}
function Pn(e, t, n, r = !0) {
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
	if (!T(e)) zn && e.id === -1 ? zn.splice(Bn + 1, 0, e) : e.flags & 1 || (Rn.push(e), e.flags |= 1);
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
function P(e, t = er, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ia(-1);
		let i = nr(t), a = ea.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ea.length; e > a; e--) na();
			nr(i), r._d && ia(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function F(e, t) {
	if (er === null) return e;
	let n = La(er), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = y] = t[e];
		i && (E(i) && (i = {
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
function rr(e, t, n, r) {
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
function ir(e, t, n = !1) {
	let r = wa();
	if (r || si) {
		let i = si ? si._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && E(t) ? t.call(r && r.proxy) : t;
	}
}
var ar = /* @__PURE__ */ Symbol.for("v-scx"), or = () => ir(ar);
function sr(e, t) {
	return ur(e, null, t);
}
function cr(e, t) {
	return ur(e, null, { flush: "sync" });
}
function lr(e, t, n) {
	return ur(e, t, n);
}
function ur(e, t, n = y) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = C({}, n), c = t && r || !t && a !== "post", l;
	if (Aa) {
		if (a === "sync") {
			let e = or();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = x, e.resume = x, e.pause = x, e;
		}
	}
	let u = Ca;
	s.call = (e, t, n) => Nn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Ri(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Gn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = An(e, t, s);
	return Aa && (l ? l.push(f) : c && f()), f;
}
var dr = /* @__PURE__ */ Symbol("_vte"), fr = (e) => e.__isTeleport, pr = /* @__PURE__ */ Symbol("_leaveCb"), mr = /* @__PURE__ */ Symbol("_enterCb");
function hr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Vr(() => {
		e.isMounted = !0;
	}), Ur(() => {
		e.isUnmounting = !0;
	}), e;
}
var gr = [Function, Array], _r = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: gr,
	onEnter: gr,
	onAfterEnter: gr,
	onEnterCancelled: gr,
	onBeforeLeave: gr,
	onLeave: gr,
	onAfterLeave: gr,
	onLeaveCancelled: gr,
	onBeforeAppear: gr,
	onAppear: gr,
	onAfterAppear: gr,
	onAppearCancelled: gr
}, vr = {
	name: "BaseTransition",
	props: _r,
	setup(e, { slots: t }) {
		let n = wa(), r = hr();
		return () => {
			let i = t.default && Er(t.default(), !0), a = i && i.length ? yr(i) : n.subTree ? W() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ j(e), { mode: s } = o;
			if (r.isLeaving) return Cr(a);
			let c = wr(a);
			if (!c) return Cr(a);
			let l = Sr(c, o, r, n, (e) => l = e);
			c.type !== Qi && Tr(c, l);
			let u = n.subTree && wr(n.subTree);
			if (u && u.type !== Qi && !sa(u, c) && Dr(n.subTree)) {
				let e = Sr(u, o, r, n);
				if (Tr(u, e), s === "out-in" && c.type !== Qi) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, Cr(a);
				s === "in-out" && c.type !== Qi ? e.delayLeave = (e, t, n) => {
					let i = xr(r, u);
					i[String(u.key)] = u, e[pr] = () => {
						t(), e[pr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function yr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Qi) {
			t = n;
			break;
		}
	}
	return t;
}
var br = vr;
function xr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function Sr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = xr(n, e), S = (e, t) => {
		e && Nn(e, r, 9, t);
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
			t[pr] && t[pr](!0);
			let i = x[b];
			if (i && sa(e, i)) {
				let e = i.el[pr];
				if (!e) {
					let t = Dr(i);
					e = t && t.el[pr];
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
			t[mr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), te.delayedLeave && te.delayedLeave(), t[mr] = void 0);
			};
			let c = t[mr].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[mr] && t[mr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[pr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[pr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[pr].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = Sr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return te;
}
function Cr(e) {
	if (Pr(e)) return e = fa(e), e.children = null, e;
}
function wr(e) {
	if (!Pr(e)) return fr(e.type) && e.children ? yr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && E(n.default)) return n.default();
	}
}
function Tr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Tr(fr(n.type) && wr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === R && T(e.children)) {
		let n = mi(e.children, !1);
		n && Tr(n, t);
	}
}
function Er(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(Er(o.children, t, s))) : (t || o.type !== Qi) && r.push(s == null ? o : fa(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Dr(e) {
	if (e.component) return Dr(e.component.subTree);
	if (e.type === R) {
		let t = T(e.children) && mi(e.children, !1);
		return t ? Dr(t) : void 0;
	}
	if (e.type !== Qi) return e;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return E(e) ? /* @__PURE__ */ C({ name: e.name }, t, { setup: e }) : e;
}
function Or(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function kr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Ar = /* @__PURE__ */ new WeakMap();
function jr(e, t, n, r, i = !1) {
	if (T(e)) {
		e.forEach((e, a) => jr(e, t && (T(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Nr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && jr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? La(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === y ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ j(d), p = d === y ? S : (e) => !kr(u, e) && w(f, e), m = (e, t) => !(t && kr(u, t));
	if (l != null && l !== c) {
		if (Mr(t), D(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ _n(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (E(c)) Mn(c, s, 12, [o, u]);
	else {
		let t = D(c), r = /* @__PURE__ */ _n(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) T(n) && ne(n, a);
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
					s(), Ar.delete(e);
				};
				t.id = -1, Ar.set(e, t), Ri(t, n);
			} else Mr(e), s();
		}
	}
}
function Mr(e) {
	let t = Ar.get(e);
	t && (t.flags |= 8, Ar.delete(e));
}
ke().requestIdleCallback, ke().cancelIdleCallback;
var Nr = (e) => !!e.type.__asyncLoader, Pr = (e) => e.type.__isKeepAlive, Fr = {
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
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Ri(() => {
				a.isDeactivated = !1, a.a && we(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && va(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			qi(t.m), qi(t.a), l(e, f, null, 1, s), Ri(() => {
				t.da && we(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && va(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Lr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ra(Nr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !sa(t, o)) ? p(t) : o && (Lr(o), t && Lr(t)), i.delete(e), a.delete(e);
		}
		lr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Ir(e, t)), t && m((e) => !Ir(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Yi(n.subTree.type) ? Ri(() => {
				let e = Rr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Rr(n.subTree)));
		};
		return Vr(_), Hr(_), Ur(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Rr(t);
				if (e.type === i.type && e.key === i.key) {
					Lr(i);
					let e = i.component.da;
					e && Ri(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!oa(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Rr(r);
			if (s.type === Qi) return o = null, s;
			let c = s.type, l = Ra(Nr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Ir(u, l)) || d && l && Ir(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = fa(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Tr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Yi(r.type) ? r : s;
		};
	}
};
function Ir(e, t) {
	return T(e) ? e.some((e) => Ir(e, t)) : D(e) ? e.split(",").includes(t) : se(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Lr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Rr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function zr(e, t, n = Ca, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ft();
			let i = Da(n), a = Nn(t, n, e, r);
			return i(), pt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Br = (e) => (t, n = Ca) => {
	(!Aa || e === "sp") && zr(e, (...e) => t(...e), n);
}, Vr = Br("m"), Hr = Br("u"), Ur = Br("bum"), Wr = "components", Gr = /* @__PURE__ */ Symbol.for("v-ndc");
function Kr(e) {
	return D(e) ? qr(Wr, e, !1) || e : e || Gr;
}
function qr(e, t, n = !0, r = !1) {
	let i = er || Ca;
	if (i) {
		let n = i.type;
		if (e === Wr) {
			let e = Ra(n, !1);
			if (e && (e === t || e === ve(t) || e === xe(ve(t)))) return n;
		}
		let a = Jr(i[e] || n[e], t) || Jr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Jr(e, t) {
	return e && (e[t] || e[ve(t)] || e[xe(ve(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = T(e);
	if (o || D(e)) {
		let n = o && /* @__PURE__ */ un(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ fn(e), s = /* @__PURE__ */ dn(e), e = Et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? gn(hn(e[n])) : hn(e[n]) : e[n], n, void 0, a && a[n]);
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
function Yr(e, t) {
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
function Xr(e, t, n, r, i, a) {
	if (n ??= {}, er.ce || er.parent && Nr(er.parent) && er.parent.ce) {
		let e = a != null && n.key == null ? C({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = ea.length;
	z();
	let c;
	try {
		let i = o && Zr(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !ce(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = ea.length; e > s; e--) na();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Zr(e) {
	return e.some((e) => !oa(e) || !(e.type === Qi || e.type === R && !Zr(e.children))) ? e : null;
}
var Qr = (e) => e ? ka(e) ? La(e) : Qr(e.parent) : null, $r = /* @__PURE__ */ C(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Qr(e.parent),
	$root: (e) => Qr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Gn(e.update);
	},
	$nextTick: (e) => e.n ||= Un.bind(e.proxy),
	$watch: (e) => x
}), ei = (e, t) => e !== y && !e.__isScriptSetup && w(e, t), ti = {
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
			else if (ei(r, t)) return o[t] = 1, r[t];
			else if (w(a, t)) return o[t] = 3, a[t];
			else if (n !== y && w(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = $r[t], u, d;
		if (l) return t === "$attrs" && Ct(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== y && w(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, w(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ei(i, t) ? (i[t] = n, !0) : w(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ei(t, s) || w(a, s) || w(r, s) || w($r, s) || w(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? w(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ni(e) {
	return T(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ri(e, t) {
	return !e || !t ? e || t : T(e) && T(t) ? e.concat(t) : C({}, ni(e), ni(t));
}
function ii() {
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
var ai = 0;
function oi(e, t) {
	return function(n, r = null) {
		E(n) || (n = C({}, n)), r != null && !O(r) && (r = null);
		let i = ii(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ai++,
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
				let t = si;
				si = c;
				try {
					return e();
				} finally {
					si = t;
				}
			}
		};
		return c;
	};
}
var si = null;
function ci(e, t, n = y) {
	let r = wa(), i = ve(t), a = be(t), o = li(e, i), s = Cn((o, s) => {
		let c, l = y, u;
		return cr(() => {
			let t = e[i];
			Ce(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!Ce(o, c) && !(l !== y && Ce(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), Ce(e, l) && (Ce(e, o) && !Ce(o, u) || f && l !== y && !Ce(o, c)) && s(), l = e, u = o;
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
var li = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ve(t)}Modifiers`] || e[`${be(t)}Modifiers`];
function ui(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || y, i = n, a = t.startsWith("update:"), o = a && li(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => D(e) ? e.trim() : e)), o.number && (i = i.map(Ee)));
	let s, c = r[s = Se(t)] || r[s = Se(ve(t))];
	!c && a && (c = r[s = Se(be(t))]), c && Nn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Nn(l, e, 6, i);
	}
}
function di(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (T(a) ? a.forEach((e) => o[e] = null) : C(o, a), O(e) && r.set(e, o), o) : (O(e) && r.set(e, null), null);
}
function fi(e, t) {
	return !e || !ee(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), w(e, t[0].toLowerCase() + t.slice(1)) || w(e, be(t)) || w(e, t));
}
function pi(e) {
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
			}) : e(d, null)), v = t.props ? s : hi(s);
		}
	} catch (t) {
		ea.length = 0, Pn(t, e, 1), _ = U(Qi);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(te) && (v = gi(v, a)), y = fa(y, v, !1, !0));
	}
	return n.dirs && (y = fa(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Tr(fr(y.type) && wr(y) || y, n.transition), _ = y, nr(g), _;
}
function mi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (oa(r)) {
			if (r.type !== Qi || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var hi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || ee(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, gi = (e, t) => {
	let n = {};
	for (let r in e) (!te(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function _i(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? vi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (yi(o, r, n) && !fi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || vi(r, o, l) : !!o;
	return !1;
}
function vi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!w(e, a) || yi(t, e, a) && !fi(n, a)) return !0;
	}
	return !1;
}
function yi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && O(r) && O(i) ? !Ve(r, i) : r !== i;
}
function bi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var xi = {}, Si = () => Object.create(xi), Ci = (e) => Object.getPrototypeOf(e) === xi;
function wi(e, t, n, r = !1) {
	let i = {}, a = Si();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ei(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ sn(i) : e.type.props ? i : a, e.attrs = a;
}
function Ti(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ j(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (fi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (w(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ve(o);
						i[t] = Di(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ei(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !w(t, a) && ((r = be(a)) === a || !w(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Di(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !w(t, e)) && (delete a[e], l = !0);
	}
	l && wt(e.attrs, "set", "");
}
function Ei(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (he(c)) continue;
		let l = t[c], u;
		i && w(i, u = ve(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : fi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ j(n), r = s || y;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Di(i, t, s, r[s], e, !w(r, s));
		}
	}
	return o;
}
function Di(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = w(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && E(e)) {
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
function Oi(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return O(e) && r.set(e, b), b;
	if (T(a)) for (let e = 0; e < a.length; e++) {
		let t = ve(a[e]);
		ki(t) && (o[t] = y);
	}
	else if (a) for (let e in a) {
		let t = ve(e);
		if (ki(t)) {
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
function ki(e) {
	return e[0] !== "$" && !he(e);
}
var Ai = (e) => e === "_" || e === "_ctx" || e === "$stable", ji = (e) => T(e) ? e.map(ma) : [ma(e)], Mi = (e, t, n) => {
	if (t._n) return t;
	let r = P((...e) => ji(t(...e)), n);
	return r._c = !1, r;
}, Ni = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ai(n)) continue;
		let i = e[n];
		if (E(i)) t[n] = Mi(n, i, r);
		else if (i != null) {
			let e = ji(i);
			t[n] = () => e;
		}
	}
}, Pi = (e, t) => {
	let n = ji(t);
	e.slots.default = () => n;
}, Fi = (e, t, n) => {
	for (let r in t) (n || !Ai(r)) && (e[r] = t[r]);
}, Ii = (e, t, n) => {
	let r = e.slots = Si();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Fi(r, t, n), n && Te(r, "_", e, !0)) : Ni(t, r);
	} else t && Pi(e, t);
}, Li = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = y;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Fi(i, t, n) : (a = !t.$stable, Ni(t, i)), o = t;
	} else t && (Pi(e, t), o = { default: 1 });
	if (a) for (let e in i) !Ai(e) && o[e] == null && delete i[e];
}, Ri = Xi;
function zi(e) {
	return Bi(e);
}
function Bi(e, t) {
	let n = ke();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = x, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !sa(e, t) && (r = ve(e), fe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === b && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Zi:
				g(e, t, n, r);
				break;
			case Qi:
				_(e, t, n, r);
				break;
			case $i:
				e ?? v(t, n, r, o);
				break;
			case R:
				ae(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? te(e, t, n, r, i, a, o, s, c) : d & 6 ? oe(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? jr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && jr(e.ref, null, a, e, !0);
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
	}, ee = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) C(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), w(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, C = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && re(e.children, f, null, i, s, Vi(e, c), l, d), _ && rr(e, null, i, "created"), ne(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !he(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && va(p, i, e);
		}
		_ && rr(e, null, i, "beforeMount");
		let v = Ui(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Ri(() => {
			try {
				p && va(p, i, e), v && g.enter(f), _ && rr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ne = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Yi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, re = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ha(e[l]) : ma(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, w = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || y, m = t.props || y, h;
		if (n && Hi(n, !1), (h = m.onVnodeBeforeUpdate) && va(h, n, t, e), f && rr(t, e, n, "beforeUpdate"), n && Hi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? T(e.dynamicChildren, d, c, n, r, Vi(t, i), o) : s || O(e, t, c, null, n, r, Vi(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Ri(() => {
			h && va(h, n, t, e), f && rr(t, e, n, "updated");
		}, r);
	}, T = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Ji(c), f = u && (c.type === R || !sa(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ie = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== y) for (let o in t) !he(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (he(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ae = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), re(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (T(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Wi(e, t, !0)) : O(e, t, n, f, a, o, c, l, u);
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : se(t, n, r, i, a, o, c) : E(e, t, c);
	}, se = (e, t, n, r, i, a, o) => {
		let s = e.component = Sa(e, r, i);
		if (Pr(e) && (s.ctx.renderer = be), ja(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, D, o, a), !e.el) {
				let r = s.subTree = U(Qi);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else D(s, e, t, n, i, a, o);
	}, E = (e, t, n) => {
		let r = t.component = e.component;
		if (_i(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ce(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, D = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ki(e);
					if (n) {
						t && (t.el = c.el, ce(e, t, o)), n.asyncDep.then(() => {
							Ri(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Hi(e, !1), t ? (t.el = c.el, ce(e, t, o)) : t = c, n && we(n), (f = t.props && t.props.onVnodeBeforeUpdate) && va(f, s, t, c), Hi(e, !0);
				let p = pi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ve(m), e, i, a), t.el = p.el, u === null && bi(e, p.el), r && Ri(r, i), (f = t.props && t.props.onVnodeUpdated) && Ri(() => va(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Nr(t);
				if (Hi(e, !1), l && we(l), !m && (o = c && c.onVnodeBeforeMount) && va(o, d, t), Hi(e, !0), s && Se) {
					let t = () => {
						e.subTree = pi(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = pi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Ri(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Ri(() => va(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Nr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Ri(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ze(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Gn(u), Hi(e, !0), l();
	}, ce = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ti(e, t.props, r, n), Li(e, t.children, n), ft(), Jn(e), pt();
	}, O = (e, t, n, r, i, a, o, s, c = !1) => {
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
		m & 8 ? (d & 16 && _e(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ue(l, f, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && re(f, n, r, i, a, o, s, c));
	}, le = (e, t, n, r, i, a, o, s, c) => {
		e ||= b, t ||= b;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? ha(t[f]) : ma(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? _e(e, i, a, !0, !1, d) : re(t, n, r, i, a, o, s, c, d);
	}, ue = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? ha(t[l]) : ma(t[l]);
			if (sa(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? ha(t[f]) : ma(t[f]);
			if (sa(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? ha(t[l]) : ma(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) fe(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? ha(t[l]) : ma(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, x = !1, S = 0, ee = Array(y);
			for (l = 0; l < y; l++) ee[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					fe(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (ee[_ - m] === 0 && sa(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? fe(r, i, a, !0) : (ee[u - m] = l + 1, u >= S ? S = u : x = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let te = x ? Gi(ee) : b;
			for (_ = te.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Ji(f) : r;
				ee[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== te[_] ? de(d, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === R) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === $i) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[pr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Ri(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[pr];
					s._isLeaving && s[pr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, fe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (ft(), jr(s, null, n, e, !0), pt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Nr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && va(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && rr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && _e(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Ri(() => {
			_ && va(_, t, e), h && rr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === R;
		if (o && !a) {
			me(n, r);
			return;
		}
		if (t === $i) {
			ee(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Dr(e) : e, c = () => {
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
	}, ge = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		qi(c), qi(l), r && we(r), i.stop(), a ? (a.flags |= 8, fe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, fe(o, e, t, n)), s && Ri(s, t), Ri(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) fe(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[dr];
		return n ? f(n) : t;
	}, ye = (e, t, n) => {
		Zn(() => {
			e == null ? t._vnode && fe(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : xa());
	}, be = {
		p: h,
		um: fe,
		m: de,
		r: pe,
		mt: se,
		mc: re,
		pc: O,
		pbc: T,
		n: ve,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(be)), {
		render: ye,
		hydrate: xe,
		createApp: oi(ye, xe)
	};
}
function Vi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Hi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ui(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Wi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (T(r) && T(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ha(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Wi(t, a)), a.type === Zi && (a.patchFlag === -1 && (a = i[e] = ha(a)), a.el = t.el), a.type === Qi && !a.el && (a.el = t.el);
	}
}
function Gi(e) {
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
function Ki(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ki(t);
}
function qi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ji(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ji(t.subTree) : null;
}
var Yi = (e) => e.__isSuspense;
function Xi(e, t) {
	t && t.pendingBranch ? T(e) ? t.effects.push(...e) : t.effects.push(e) : qn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), Zi = /* @__PURE__ */ Symbol.for("v-txt"), Qi = /* @__PURE__ */ Symbol.for("v-cmt"), $i = /* @__PURE__ */ Symbol.for("v-stc"), ea = [], ta = null;
function z(e = !1) {
	ea.push(ta = e ? null : []);
}
function na() {
	ea.pop(), ta = ea[ea.length - 1] || null;
}
var ra = 1;
function ia(e, t = !1) {
	ra += e, e < 0 && ta && t && (ta.hasOnce = !0);
}
function aa(e) {
	return e.dynamicChildren = ra > 0 ? ta || b : null, na(), ra > 0 && ta && ta.push(e), e;
}
function B(e, t, n, r, i, a) {
	return aa(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return aa(U(e, t, n, r, i, !0));
}
function oa(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function sa(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ca = ({ key: e }) => e ?? null, la = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : D(e) || /* @__PURE__ */ _n(e) || E(e) ? {
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
		key: t && ca(t),
		ref: t && la(t),
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
	return s ? (ga(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= D(n) ? 8 : 16), ra > 0 && !o && ta && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ta.push(c), c;
}
var U = ua;
function ua(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Gr) && (e = Qi), oa(e)) {
		let r = fa(e, t, !0);
		return n && ga(r, n), ra > 0 && !a && ta && (r.shapeFlag & 6 ? ta[ta.indexOf(e)] = r : ta.push(r)), r.patchFlag = -2, r;
	}
	if (za(e) && (e = e.__vccOpts), t) {
		t = da(t);
		let { class: e, style: n } = t;
		e && !D(e) && (t.class = k(e)), O(n) && (/* @__PURE__ */ pn(n) && !T(n) && (n = C({}, n)), t.style = Ae(n));
	}
	let o = D(e) ? 1 : Yi(e) ? 128 : fr(e) ? 64 : O(e) ? 4 : E(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function da(e) {
	return e ? /* @__PURE__ */ pn(e) || Ci(e) ? C({}, e) : e : null;
}
function fa(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? _a(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ca(l),
		ref: t && t.ref ? n && a ? T(a) ? a.concat(la(t)) : [a, la(t)] : la(t) : a,
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
		ssContent: e.ssContent && fa(e.ssContent),
		ssFallback: e.ssFallback && fa(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Tr(u, c.clone(u)), u;
}
function pa(e = " ", t = 0) {
	return U(Zi, null, e, t);
}
function W(e = "", t = !1) {
	return t ? (z(), V(Qi, null, e)) : U(Qi, null, e);
}
function ma(e) {
	return e == null || typeof e == "boolean" ? U(Qi) : T(e) ? U(R, null, e.slice()) : oa(e) ? ha(e) : U(Zi, null, String(e));
}
function ha(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : fa(e);
}
function ga(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (T(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ga(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ci(t) ? t._ctx = er : r === 3 && er && (er.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (E(t)) {
		if (r & 65) {
			ga(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: er
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [pa(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function _a(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = Ae([t.style, r.style]);
		else if (ee(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(T(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !te(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function va(e, t, n, r = null) {
	Nn(e, t, 7, [n, r]);
}
var ya = ii(), ba = 0;
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
		propsOptions: Oi(r, i),
		emitsOptions: di(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ui.bind(null, a), e.ce && e.ce(a), a;
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
	wi(e, r, a, t), Ii(e, i, n || t);
	let o = a ? Ma(e, t) : void 0;
	return t && Ea(!1), o;
}
function Ma(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ti);
	let { setup: r } = n;
	if (r) {
		ft();
		let n = e.setupContext = r.length > 1 ? Ia(e) : null, i = Da(e), a = Mn(r, e, 0, [e.props, n]), o = le(a);
		if (pt(), i(), (o || e.sp) && !Nr(e) && Or(e), o) {
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
	E(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : O(t) && (e.setupState = xn(t)), Pa(e, n);
}
function Pa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || x;
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
			if (n in $r) return $r[n](e);
		},
		has(e, t) {
			return t in e || t in $r;
		}
	}) : e.proxy;
}
function Ra(e, t = !0) {
	return E(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function za(e) {
	return E(e) && "__vccOpts" in e;
}
var G = (e, t) => /* @__PURE__ */ Tn(e, t, Aa);
function Ba(e, t, n) {
	try {
		ia(-1);
		let r = arguments.length;
		return r === 2 ? O(t) && !T(t) ? oa(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && oa(n) && (n = [n]), U(e, t, n));
	} finally {
		ia(1);
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
}, eo = /* @__PURE__ */ C({}, _r, $a), to = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = eo, e))((e, { slots: t }) => Ba(br, io(e), t)), no = (e, t = []) => {
	T(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, ro = (e) => e ? T(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function io(e) {
	let t = {};
	for (let n in e) n in $a || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = ao(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: te = y } = t, ne = (e, t, n, r) => {
		e._enterCancelled = r, co(e, t ? u : s), co(e, t ? l : o), n && n();
	}, re = (e, t) => {
		e._isLeaving = !1, co(e, d), co(e, p), co(e, f), t && t();
	}, w = (e) => (t, n) => {
		let i = e ? ee : v, o = () => ne(t, e, n);
		no(i, [t, o]), lo(() => {
			co(t, e ? c : a), so(t, e ? u : s), ro(i) || fo(t, r, h, o);
		});
	};
	return C(t, {
		onBeforeEnter(e) {
			no(_, [e]), so(e, a), so(e, o);
		},
		onBeforeAppear(e) {
			no(S, [e]), so(e, c), so(e, l);
		},
		onEnter: w(!1),
		onAppear: w(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => re(e, t);
			so(e, d), e._enterCancelled ? (so(e, f), go(e)) : (go(e), so(e, f)), lo(() => {
				e._isLeaving && (co(e, d), so(e, p), ro(b) || fo(e, r, g, n));
			}), no(b, [e, n]);
		},
		onEnterCancelled(e) {
			ne(e, !1, void 0, !0), no(y, [e]);
		},
		onAppearCancelled(e) {
			ne(e, !0, void 0, !0), no(te, [e]);
		},
		onLeaveCancelled(e) {
			re(e), no(x, [e]);
		}
	});
}
function ao(e) {
	if (e == null) return null;
	if (O(e)) return [oo(e.enter), oo(e.leave)];
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
	let r = e.style, i = D(n), a = !1;
	if (n && !i) {
		if (t) {
			if (D(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? wo(r, t, "");
			}
			else for (let e in t) n[e] ?? wo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? wo(r, i, "") : Oo(e, i, !D(t) && t ? t[i] : void 0, o) || wo(r, i, o);
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
	if (T(n)) n.forEach((n) => wo(e, t, n));
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
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && D(r) && n === r;
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
		if (T(r)) {
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
	t === "class" ? _o(e, r, o) : t === "style" ? So(e, n, r) : ee(t) ? te(t) || Fo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Go(e, t, r, o)) ? (jo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ao(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ko(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !D(r))) ? jo(e, ve(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ao(e, t, r, o));
};
function Go(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Uo(t) && E(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Uo(t) && D(n) ? !1 : t in e;
}
function Ko(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ve(t);
	return Array.isArray(n) ? n.some((e) => ve(e) === r) : Object.keys(n).some((e) => ve(e) === r);
}
var qo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return T(t) ? (e) => we(t, e) : t;
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
			if (T(t)) {
				let e = He(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ae(t)) {
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
	if (T(t)) i = He(t, r.props.value) > -1;
	else if (ae(t)) i = t.has(r.props.value);
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
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Ee(as(e)) : as(e)), r = e.multiple, i = r ? ae(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? T(i) ? t.slice() : t : i];
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
	if (!n || T(e)) return Ve(e, t);
	if (ae(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function is(e, t) {
	let n = e.multiple, r = T(t);
	if (!n || r || ae(t)) {
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
}, fs = /* @__PURE__ */ C({ patchProp: Wo }, Ya), ps;
function ms() {
	return ps ||= zi(fs);
}
var hs = ((...e) => {
	let t = ms().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = _s(e);
		if (!r) return;
		let i = t._component;
		!E(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, gs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function gs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function _s(e) {
	return D(e) ? document.querySelector(e) : e;
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
function K() {
	if (ys) return ys;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = vs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return ys = /* @__PURE__ */ on(n), ys;
}
var q = () => e().saveSettingsDebounced(), bs = [
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
function Gs(e, t = (e) => e) {
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
function Ks(e) {
	return e === "memory" || e === "recap";
}
var qs = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Js(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations": return;
		case "reply":
		case "impersonate": return qs(t).trim() || void 0;
		case "recap": return t === null ? null : qs(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = qs(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : qs(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: qs(e.time),
				location: qs(e.location),
				event: qs(e.event),
				summary: qs(e.summary)
			};
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: qs(e.label ?? e.title).trim(),
			content: qs(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, qs(t)]));
			}
			return qs(t).trim() || void 0;
	}
}
function Ys(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Js(e.kind, Rs(n.inner));
		case "recap": return Js("recap", Rs(n.inner));
		case "memory": return Js("memory", t.filter((e) => !e.open).map((e) => ({
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
			return Js("custom", Rs(n.inner), e);
	}
}
function Xs(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (Cs(a)) continue;
		let t = Bs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Ys(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Vs(e, i),
		values: n,
		open: r
	};
}
function Zs(e) {
	return Rs(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
//#region packages/protocol/src/workflow.ts
var Qs = {
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
}, $s = (e) => e;
function ec(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function tc(e, t) {
	return e.stages.filter((e) => Ns(e.when, t));
}
function nc(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function rc(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	let n = nc(t);
	return n >= 0 ? n : t.length - 1;
}
function ic(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function ac(e, t, n = Qs) {
	return ec(t.field?.name ?? n.turn.field, ic(e, t));
}
function oc(e, t, n = Qs) {
	return ec(t.tool?.name ?? n.stage.name, ic(e, t));
}
function sc(e, t = Qs) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var cc = (e, t) => t ? {
	...e,
	description: t
} : e;
function lc(e = Qs, t = $s, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return cc({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: cc({ type: "string" }, i(r.old)),
				new_string: cc({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function uc(e, t, n = Qs, r = $s) {
	return e.kind === "patch" ? lc(n, r, t) : cc({ type: "string" }, t);
}
function dc(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function fc(e, t, n, r, i = $s) {
	let a = r.filter((e) => !Cs(e)), o = (e, t) => {
		if (e) return i(t ? ec(e, ic(n, t)) : e).trim() || void 0;
	}, s = rc(t, n), c = (t) => ac(n, t, e), l = (t) => oc(n, t, e), u = (t) => sc(t, e).name, d = (e, t) => {
		for (let n of a) e[n.field] = Gs(n, i), Ks(n.kind) || t.push(n.field);
	}, f = () => {
		let t = {}, r = [];
		return n.forEach((n, a) => {
			let l = c(n);
			t[l] = uc(n, o(n.field?.description ?? e.turn.fieldDescription, n), e, i), n.optional || r.push(l), a === s && d(t, r);
		}), s < 0 && d(t, r), {
			type: "object",
			properties: t,
			required: r,
			additionalProperties: !1
		};
	}, p = () => n.map((t, n) => {
		let r = {}, a = [], c = sc(t, e);
		return r[c.name] = uc(t, o(c.description, t), e, i), a.push(c.name), n === s && d(r, a), dc(l(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => dc(e.submit.name, o(e.submit.description), t ?? f()),
		stageTools: p,
		envelope: (t) => ({
			type: "object",
			properties: {
				[m.thinking]: cc({ type: "string" }, o(e.envelope.thinking.description)),
				[m.result]: cc(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [m.thinking, m.result],
			additionalProperties: !1
		}),
		envelopeKeys: m,
		toolNames: () => [e.submit.name, ...n.map(l)]
	};
}
function pc(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/turn.ts
function mc(e) {
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
function hc(e, t, n = !0) {
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
function gc(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function _c(e) {
	return e.map((e) => ({
		old_string: Hs(e, "old_string") ?? "",
		new_string: Hs(e, "new_string") ?? ""
	}));
}
function vc(e, t) {
	let n = mc(t.stages), r = Ws(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Ls(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Xs(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Bs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = _c(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Rs(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Vs(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = nc(t.stages), d = u >= 0 ? t.stages[u] : void 0;
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), hc(t.stages, n, t.final), gc(t.stages, n, t.final), n;
}
function yc(e, t) {
	let n = mc(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => ac(t.stages, e)), a = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, o = null;
	for (let e of t.stages) {
		let t = a(i(e), e);
		t !== void 0 && (o = e.id, e.kind === "patch" ? n.stages[e.id].patches = bc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (Cs(e)) continue;
		let r = a(e.field), i = Js(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey === e.field && n.openStructures.push(e.id);
	}
	let s = nc(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : o)), s >= 0 && n.stages[t.stages[s].id].text !== void 0 && (n.contentStarted = !0), hc(t.stages, n, t.final), gc(t.stages, n, t.final), n;
}
function bc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function xc(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Sc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = xc(e, n);
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
function Cc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Sc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function wc(e, t, n = !0) {
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
var Tc = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Ec = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Dc = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Oc(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => kc[e]);
}
var kc = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Ac(e) {
	return e.split(Ec).filter((e) => e !== "");
}
var jc = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Mc(e) {
	let t = Ac(jc(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Dc.has(n)) throw new Tc(`Could not find matching close tag for "${e}".`, a);
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
var Nc = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, Pc = (e, t) => {
	throw new Tc(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Fc = /* @__PURE__ */ new Map(), Ic = 500;
function Lc(e) {
	let t = Fc.get(e);
	if (t) return t;
	let n = Mc(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Tc(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Oc, Nc, Pc);
	return Fc.size >= Ic && Fc.clear(), Fc.set(e, i), i;
}
function Rc(e, t) {
	return Lc(e)(t);
}
function zc(e) {
	try {
		return Lc(e), null;
	} catch (e) {
		return e instanceof Tc ? e : new Tc(String(e));
	}
}
function Bc(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) Bc(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var Vc = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, Hc = /^\s*(```|~~~)/;
function Uc(e) {
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
var Wc = /<!--[ \t]*#/g, Gc = /<!--|-->/g;
function Kc(e, t, n) {
	Gc.lastIndex = t;
	for (let t = Gc.exec(e); t; t = Gc.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function qc(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(Vc)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(Vc, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...Uc(o),
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
			let t = Kc(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? Jc(e, t) : t;
		} else if (Hc.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		Wc.lastIndex = u;
		for (let t = Wc.exec(e); t; t = Wc.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = Kc(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? Jc(e, r) : r, Wc.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function Jc(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var Yc = [
	"system",
	"user",
	"assistant"
], Xc = ["dialogue", "imperative"];
function Zc(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Ps(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = zc(e.text);
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
				Yc.includes(n) || t(`@as expects one of ${Yc.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: Yc.includes(n) ? n : void 0,
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
				if (!n || !Xc.includes(n)) {
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
function Qc(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = qc(e, [], 1, r), a = Zc(i.tokens, r);
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
function $c(e, t, n = (e) => e, r) {
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
var el = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function tl(e) {
	let t = e.entries.flatMap((e) => el(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => el(e));
		t.push(...el(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...el(Qc(n.text, n.role).content));
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
function nl(e) {
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
function rl(e, t) {
	let n = nl(e), r = nl(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function il(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = nl(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = rl(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var al = (e) => !!e && typeof e == "object" && !Array.isArray(e), ol = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
}, sl = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function cl(e, ...t) {
	let n = J(e);
	for (let e of t) n = ll(n, e);
	return n;
}
function ll(e, t) {
	if (t === void 0) return e;
	if (!al(e) || !al(t)) return J(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = ll(e[r], i);
	return n;
}
function ul(e, t) {
	if (al(e) && al(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = ul(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : J(e);
}
function dl(e, t, n = "", r = [], i = fl) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? al(e[a]) && al(t[a]) && (dl(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var fl = /* @__PURE__ */ new Set(["sampling"]);
function pl(e, t, n) {
	let r = J(e);
	for (let e of t) if (il(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && al(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function ml(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/params.ts
function hl(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function gl(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function _l(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? hl(n) : Array.isArray(e.default) ? hl(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function vl(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function yl(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, _l(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function bl(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function xl(e, t, n) {
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
function Sl(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, bl(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = xl(r[t.var], t, e));
	}
	return r;
}
var Cl = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function wl(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Cl.test(e);
}
function Tl(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return wl(e) ? e : JSON.stringify(e);
}
var El = (e) => !e.includes("\n") && wl(e) ? e : JSON.stringify(e);
function Dl(e) {
	return e.map((e) => `- ${Tl(e, "  ")}`).join("\n");
}
function Ol(e) {
	return [...e].map(([e, t]) => `${El(e)}: ${Tl(t, "  ")}`).join("\n");
}
function kl(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Dl(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Ol(e) : t === "keys" ? Dl([...e.keys()]) : t === "values" ? Dl([...e.values()]) : e.get(t) ?? "";
}
function Al(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/assemble.ts
function jl(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Ml(e, t) {
	return !!e.groups[t]?.allowNone;
}
function Nl(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || Ml(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Ns(e.when, n)) : i;
}
function Pl(e, t) {
	let n = new Set(Nl(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Fl(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Il(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Ll(e, t, n, r) {
	let { preset: i, config: a, vars: o, data: s = {} } = e, c = (e, t = 0) => {
		let n = i.params.find((t) => t.id === e);
		if (!n) return "";
		let r = _l(n, a.params[e]);
		if (vl(r)) {
			if (n.fallback && t < 4) {
				let e = c(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, l = 0, u = (e) => l > 4 ? e : Is(e, p), d = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		l++;
		try {
			return kl(typeof n == "string" ? u(n) : Array.isArray(n) ? n.map(u) : new Map([...n].map(([e, t]) => [e, u(t)])), t);
		} finally {
			l--;
		}
	}, f = o.style, p = (e) => {
		let [r, o, l] = e;
		switch (r) {
			case "name": return Il(i, a, o);
			case "prefix": return a.identity.prefixes[o] || i.actors[o]?.prefix || `${Il(i, a, o)}: `;
			case "param": return c(o);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[o];
				return e ? l === "last" ? s.customLast?.[o] ?? "" : f === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return o === "hint" ? n?.hint ?? "" : pc(t, (e) => Il(i, a, e));
			case "input": return s.metaText ?? "";
			case "memory": return JSON.stringify((o === "global" ? s.memory?.global : s.memory?.chat) ?? {}, null, 2);
			case "recap": return s.recap ?? "";
			case "recent_meta": return s.recentMeta ?? "";
			case "var": return d(o, l);
			default: return;
		}
	};
	return p;
}
function Rl(e, t, n, r, i) {
	return Bc({
		...J(e),
		vars: J(Al(t)),
		sampling: J(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function zl(e, t, n) {
	return (r) => {
		try {
			return Rc(r.text, e());
		} catch (e) {
			let i = e instanceof Tc ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function Bl(e, t) {
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
function Vl(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? oc(n, t, e.tools) : ac(n, t, e.tools), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Il(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function Hl(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = jl(i), s = a ? tc(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = jl(i), l = Nl(n, r, c), u = Fl(n, l), d = Sl(n.vars, l), f = Ll({
		...e,
		vars: i
	}, s, a, d), p = (e) => Is(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= Rl(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Ns(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...$c(e.content, c, p, zl(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = Vl(n, a, s, i.style, i.transport, r);
		for (let n of $c(t, c, p, zl(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = Bl(e, v.get(e.id) ?? []));
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
function Ul(e, t, n = {}) {
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
		modules: Pl(e, t),
		params: yl(e, t),
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
var Wl = /* @__PURE__ */ new Set([
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
]), Gl = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Kl = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, ql = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Jl(e, t = {}) {
	let n = (e) => Jl(e, t);
	if (!ql(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && ql(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Gl.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(ql), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Yl({
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
		return Yl({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Wl.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			ql(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Kl[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = ql(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Yl({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Yl(i, a);
}
function Yl(e, t) {
	return t && (e.nullable = !0), e;
}
function Xl(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!ql(n)) return e;
		let r = ql(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Jl(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var Zl = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Ql(e) {
	let t = e.configurationDefaults?.connection;
	return !Zl(t) || Object.keys(ol).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...ol,
				...t
			}
		}
	};
}
function $l(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!Zl(t) || "userInput" in t) && (!Zl(n) || "userInput" in n)) return e;
	let r = Zl(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: Zl(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: Zl(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function eu(e) {
	let t = e.configurationDefaults;
	if (!Zl(t)) return e;
	let n = t.cache;
	return Zl(n) && Object.keys(sl).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...sl,
				...Zl(n) ? n : {}
			}
		}
	};
}
function tu(e) {
	let t = e.configurationDefaults;
	if (!Zl(t)) return e;
	let n = t.meta;
	return Zl(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...Zl(n) ? n : {}
			}
		}
	};
}
function nu(e) {
	let t = tu(eu($l(Ql(e)))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function ru(e) {
	return !Zl(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 3 ? nu(e) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var iu = "user-", au = "advanced-preset.user-modules", ou = (e) => `${iu}${e}`;
function su() {
	return {
		match: "all",
		rules: []
	};
}
var cu = ["on", "off"];
function lu(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? cu.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function uu(e) {
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
function du(e, t) {
	let n = uu(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var fu = (e) => ({
	t: "lit",
	v: e
});
function pu(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(fu)
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
			r: fu(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function mu(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(lu).map((e) => {
		if (e.kind === "keyword") return fu(du(e, t));
		if (e.kind === "var") return pu(e);
		try {
			return ks(e.source);
		} catch {
			return fu(!1);
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
function hu(e) {
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
function gu(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function _u(e, t) {
	return t.entries.filter((t) => !gu(e, t.point));
}
function vu(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function yu(e, t) {
	return (t.vars ?? []).filter((t) => vu(e, t.var)?.type !== t.type);
}
function bu(e, t) {
	return [.../* @__PURE__ */ new Set([..._u(e, t).map((e) => e.point), ...yu(e, t).map((e) => e.var)])];
}
function xu(e) {
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
function Su(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Cu(e, t, n) {
	let r = t.filter((e) => e.enabled && (e.entries.length || e.vars?.length));
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = ou(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: mu(t.trigger, n),
			structures: [],
			vars: (t.vars ?? []).filter((t) => vu(e, t.var)?.type === t.type).map(xu).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = gu(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Su(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: Qc(n.text, n.role).content
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
function wu(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => el(Qc(e.text, e.role).content)));
}
function Tu(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Eu(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Du(e, t, n) {
	let r = t.filter((e) => il(n, e.from));
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
				path: Tu(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Eu(t.source, e)
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
var Ou = (e) => !!e && typeof e == "object" && !Array.isArray(e), ku = (e, t = "") => typeof e == "string" ? e : t, Au = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), ju = [
	"system",
	"user",
	"assistant"
], Mu = [
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
function Nu(e) {
	if (!Ou(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: ku(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Mu.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Au) : Au(e.value) && (t.value = e.value), t;
	}
	return null;
}
function Pu(e) {
	if (!Ou(e) || typeof e.var != "string") return [];
	let t = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: ku(e.text)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: t(e.items)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Ou).map((e) => ({
			key: ku(e.key),
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
function Fu(e) {
	if (!Ou(e) || !Array.isArray(e.entries)) return null;
	let t = Ou(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Ou(e)) return [];
		let n = {
			id: ku(e.id) || `e${t + 1}`,
			point: ku(e.point),
			text: ku(e.text)
		};
		return ju.includes(e.role) && (n.role = e.role), [n];
	});
	return {
		id: ku(e.id),
		name: ku(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Pu) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Nu).filter((e) => !!e) : []
		}
	};
}
function Iu(e, t) {
	return {
		format: au,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function Lu(e) {
	if (Ou(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Fu).filter((e) => !!e);
		return {
			preset: Ou(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: ku(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Fu(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var Ru = "{==", zu = "==}", Bu = "{>>", Vu = "<<}", Hu = /\n[ \t]*\n/g;
function Uu(e, t) {
	Hu.lastIndex = t;
	let n = Hu.exec(e);
	return n ? n.index : Infinity;
}
function Wu(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function Gu(e, t, n, r) {
	let i = Uu(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function Ku(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(Ru, o)) {
		let t = o + 3, s = Gu(e, t, zu, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - Wu(n, [zu]));
			break;
		}
		if (s < 0) {
			let n = Math.min(Uu(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || Bu.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(Bu, l)) {
			let t = l + 3, s = Gu(e, t, Vu, n);
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
	} else if (e.startsWith(Bu, o)) {
		let t = o + 3, i = Gu(e, t, Vu, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += Bu, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (Ru.startsWith(t) || Bu.startsWith(t))) break scan;
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
function qu(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function Ju(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function Yu(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = qu(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + Ju(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function Xu(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = Yu(e, t);
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
function Zu(e, t) {
	let n = Xu(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${Ru}${t.quote}${zu}${Bu}${t.comment}${Vu}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function Qu(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function $u(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function ed(e, t, n) {
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
function td(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...J(e)
		})),
		vars: J(e.vars ?? []),
		trigger: e.trigger ? J(e.trigger) : su()
	};
}
function nd(e) {
	return {
		id: e.id,
		name: e.name,
		...e.enabled ? {} : { enabled: !1 },
		entries: e.entries.map(({ point: e, role: t, text: n }) => ({
			point: e,
			...t ? { role: t } : {},
			text: n
		})),
		vars: J(e.vars ?? []),
		trigger: J(e.trigger)
	};
}
function rd(e) {
	if (Array.isArray(e)) return e.map(rd);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = rd(e[n]));
		return t;
	}
	return e;
}
function id(e) {
	return JSON.stringify(rd({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text
		})),
		vars: e.vars ?? [],
		trigger: e.trigger ?? su()
	}));
}
function ad(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, id(e.locales[t])]);
	return JSON.stringify([
		id(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region src/store/presets.ts
var od = /* @__PURE__ */ on(/* @__PURE__ */ new Map()), sd = /* @__PURE__ */ on(/* @__PURE__ */ new Map());
async function cd() {
	try {
		let e = `${s()}dist/presets/`, t = await (await g(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = ru(await (await g(e + n, { cache: "no-cache" })).json());
			t && od.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var ld = (e) => ru(e);
function ud() {
	return [.../* @__PURE__ */ new Set([
		...od.keys(),
		...Object.keys(K().installed),
		...sd.keys()
	])].map((e) => dd(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function dd(e) {
	let t = sd.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = pd(e), r = od.get(e);
	if (n && (!r || rl(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var fd = /* @__PURE__ */ new WeakMap();
function pd(e) {
	let t = K().installed[e];
	if (t) return fd.has(t) || fd.set(t, ru(t)), fd.get(t) ?? void 0;
}
var md = (e) => dd(e)?.preset;
function hd(e) {
	K().installed[e.id] = e, q();
}
function gd(e) {
	delete K().installed[e], q();
}
function _d(e, t) {
	e ? sd.set(e.id, e) : t ? sd.delete(t) : sd.clear();
}
var vd = (e) => od.has(e), yd = {
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
}, bd = {
	en: yd,
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
function xd() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Y(e, t = {}) {
	return ((bd[xd()] ?? bd[xd().split("-")[0]])?.[e] ?? yd[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function Sd(e) {
	return e.locales?.[xd()] ?? e.locales?.[xd().split("-")[0]];
}
function X(e, t, n, r, i) {
	let a = Sd(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Cd(e) {
	let t = Sd(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function wd(e) {
	let t = Sd(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Td(e, t, n) {
	return ed(t, xd(), Sd(e)?.[n]?.[t.id]);
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
			[t]: J(n)
		}
	};
}
function kd(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Ed] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Ed] = J(n));
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
		e?.extra?.[Id] && (e.extra[Id].events = J(a.events)), await n.saveChat();
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
	}), o.cursor = o.log.length, q(), o.cursor - 1;
}
var Wd = (e) => e.globalMemory.cursor > 0, Gd = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Kd(e) {
	Wd(e) && (e.globalMemory.cursor--, q());
}
function qd(e) {
	Gd(e) && (e.globalMemory.cursor++, q());
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
	}, q()), Nd(n.globalMemory.log) && q(), n;
}
function $d(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : ml(e, n.id)?.diff;
}
function ef(e, t = Qd(e).active.ref) {
	return cl(e.configurationDefaults, $d(e, Qd(e), t));
}
function tf(e) {
	let t = Qd(e);
	return cl(ef(e, t.active.ref), t.active.diff);
}
function nf(e, t) {
	let n = Qd(e);
	n.active.diff = ul(t, ef(e, n.active.ref)) ?? {}, q();
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
	}, q();
}
var of = (e) => Object.keys(Qd(e).active.diff ?? {}).length > 0;
function sf(e) {
	Qd(e).active.diff = {}, q();
}
function cf(e, t) {
	let n = Qd(e), r = tf(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: ul(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, q(), i;
}
function lf(e, t) {
	let n = Qd(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = ul(tf(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), q());
}
function uf(e, t, n) {
	let r = Qd(e).saved.find((e) => e.id === t);
	r && (r.name = n, q());
}
function df(e, t) {
	let n = Qd(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), q();
}
function ff(e) {
	let t = Qd(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = rl(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? pl(t, e.migrations, n) : J(t);
		i.push(...dl(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !gl(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Du(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && bu(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, q(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && h("warning", Y("um.lostAfterUpdate", { names: s.join(", ") }), Cd(e)), i;
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
		...J(t.sampling),
		prompts: J(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: J(n)
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
	let n = gf(), r = Qd(e), i = xf(e.id), a = i ?? _f(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[pf];
	if (!o || t.force || s?.hash !== e.hash) {
		o && r.carrierHash && yf(o) !== r.carrierHash && h("info", Y("carrier.reset", { name: a }));
		let n = bf(e, tf(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = yf(n), q(), await Sf(a, n, !!t.select);
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
		...J(i)
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
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = J(r));
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
	let r = Is(t.meta.trigger, (e) => e[0] === "name" ? Il(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Nf(e, t, n, r, i, a = [], o = !0) {
	let s = wc(n, Mf(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = jl(c);
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
		let n = wc(e.item.mes, t.trigger, t.wrap);
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
			i?.length && (e = Zu(e, i));
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
	if (n?.history) return Nl(e, t).some((e) => e.structures.includes(n.id)) ? { depth: n.history } : void 0;
}
function Zf(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "synopsis"), r = {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: n?.id,
		synopsisHistoryTemplate: n?.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}"
	};
	return n?.history && Nl(e, t).some((e) => e.structures.includes(n.id)) && (r.synopsisHistory = {
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
		trigger: su()
	};
	return e.insertionPoints.length && r.entries.push(op(e, r)), n.push(r), q(), n[n.length - 1];
}
function cp(e, t) {
	let n = rp(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(td(t, ap(n.map((e) => e.id)), { name: i })), q(), n[n.length - 1];
}
function lp(e, t, n) {
	let r = rp(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...J(r[i]),
		id: ap(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), q(), r[i + 1];
}
function up(e, t) {
	let n = Qd(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), q();
}
function dp(e, t, n) {
	let r = rp(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), q();
}
function fp(e, t) {
	return Iu(J(rp(e).filter((e) => !t || t.includes(e.id))), e);
}
function pp(e, t) {
	let n = Lu(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && rl(n.preset.version, e.version) < 0 && (r = Du(r, e.migrations, n.preset.version));
	let i = rp(e), a = r.map((e) => {
		let t = {
			...e,
			id: ap(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return q(), {
		added: a,
		missing: a.filter((t) => bu(e, t).length).length
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
//#region src/core/interceptor.ts
async function Ip(t, n, r, i) {
	if (Bf.setPending(null), !K().enabled) return;
	let a = vf(), o = a ? md(a) : void 0;
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
	}, b;
	if (s.cache?.enabled) {
		let e = Sp(), n = Mp(t, y, Cp(e)?.modes, (e) => Dp(t[e], v[e] ?? e));
		t.splice(0, t.length, ...n.out.map(({ item: e, entry: t }) => t === void 0 ? e : {
			...e,
			mes: e.mes + Ap(t)
		})), b = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else t.splice(0, t.length, ...Yf(t, y));
	let x = {
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
		createdAt: Date.now(),
		warnings: []
	};
	Bf.setPending(x);
}
//#endregion
//#region src/core/debug.ts
var Lp = /* @__PURE__ */ on({
	log: [],
	requests: []
}), Rp = 50;
function zp(e, t) {
	Lp.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Lp.log.length > Rp && (Lp.log.length = Rp);
}
function Bp(e) {
	return Lp.requests.unshift(e), Lp.requests.length > Rp && (Lp.requests.length = Rp), Lp.requests[0];
}
//#endregion
//#region src/core/transports/tool-args.ts
var Vp = "stream_function_call_arguments";
function Hp(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function Up(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function Wp(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Vp] = !0, t() && Gp(e));
}
function Gp(e) {
	let t = Kp(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Up(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Kp(e) {
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
function qp(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of fc(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Jp(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function Yp(e) {
	return fc(e.preset.tools, e.workflow, e.stages, e.structures, Jp(e));
}
function Xp(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Il(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Zp(e, t, n) {
	let r = ec(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Jp(e)(r);
}
function Qp(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = Jp(r), u = l(o.tool.description);
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
				content: Zp(r, o.response[t], { first: n })
			}
		]
	};
}
function $p(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && em(n, e.ctx.preset.tools.jsonStringHint), Hp(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && Wp(n), n;
}
function em(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Xl(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Jl(e.json_schema.value, n)
	});
}
function tm(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var nm = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", rm = (e) => e === null ? null : typeof e == "string" ? e : JSON.stringify(e), im = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(kp.source).test(e);
function am(e) {
	for (let t of e) if (typeof t.content == "string") im(t.content) && (t.content = jp(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && im(e.text) && (e.text = jp(e.text).text);
}
function om(e) {
	if (typeof e.content == "string") {
		if (!im(e.content)) return null;
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
		if (!e || typeof e != "object" || !im(e.text)) return;
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
function sm(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = Yp(e);
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
function cm(e) {
	return Ep(e.map((e) => `${e.role}\u0000${nm(e.content)}`).join(""));
}
function lm(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return am(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = om(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = rm(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = rm(i.content);
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
			sticky: rm(f),
			fresh: rm(p),
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
		tools: sm(e),
		prompt: cm(t.slice(0, n))
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
function um(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? Tp(n.chat, t) : wp(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/core/assembler.ts
var dm = /⟦ap:region:([\w.-]+)⟧/g, fm = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function pm(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(dm)) {
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
function mm(t, n) {
	if (!jf(n)) return "";
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Il(t, n, t.user), s = Il(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Dd(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? Zs(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function hm(t) {
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
function gm(t, n) {
	let { preset: r, config: i } = t, a = zd(), o = Hd(Qd(r)), s = Bd(), c = mm(r, i), l = t.transport;
	return {
		vars: Ul(r, i, {
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
			customLast: hm(r)
		}
	};
}
function _m(t, n) {
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
		text: fm(e.content)
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
			mes: fm(s[t].m.content),
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
	}, m = /* @__PURE__ */ new Map();
	if (i.cache?.enabled) {
		let e = Sp(), n = Mp(d, p, Cp(e)?.modes, (e) => Dp(d[e], f[e] ?? e));
		for (let e of n.out) m.set(d[e.index].__h, e.entry === void 0 ? e.item.mes : e.item.mes + Ap(e.entry));
		t.sticky = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else for (let e of Yf(d, p)) m.set(e.__h, e.mes);
	let h = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : h.add(t.i);
	});
	for (let e of [...h].sort((e, t) => t - e)) n.splice(e, 1);
}
function vm(t, n) {
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
var ym = Symbol("ap-region");
function bm(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => fm(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Il(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = fm(t.content);
		if (t[ym] || t.role === "system") return n;
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
var xm = /* @__PURE__ */ new Set();
function Sm(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !xm.has(n) && (xm.add(n), h("warning", Y("warn.template", { error: n }), Y("app.name")));
}
async function Cm(t) {
	let { chat: n, dryRun: r } = t;
	if (!K().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		am(n), r || (Bf.setPending(null), Bf.takeArmed());
		return;
	}
	let i = vf(), a = i ? md(i) : void 0;
	if (!a) {
		let e = pm(n).filter((e) => !e.__anchor);
		am(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = vm(a, r), s = pm(n);
	!o.interceptorRan && !r && _m(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : Pf(a, o.config, o.origin), { vars: u, data: d } = gm(o, l), f = Cu(a, rp(a), o.keywords);
	for (let e of f.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let p = Hl({
		preset: f.preset,
		config: o.config,
		vars: u,
		data: d
	}, l);
	p.warnings.length && Sm(p.warnings, o.warnings), o.workflow = l, o.assembly = p, o.stages = p.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : p.structures;
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
			text: kl(t)
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
			return Object.defineProperty(t, ym, { value: !0 }), t;
		}).filter((e) => fm(e.content).trim());
		v.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: fm(e.content).length,
				content: fm(e.content)
			}))
		}), h.push(...n), t === a.anchors.historyStart && (g = h.length);
	}
	v.cache = lm(o, h, g, _ < 0 ? h.length : _);
	let y = o.transport === "prefill" && !c && g >= 0 ? bm(o, h, g) : h;
	n.splice(0, n.length, ...y.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), zp("assembly", v), !r && !c && l && Bf.arm(o);
}
//#endregion
//#region src/core/transports/text.ts
function wm(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Xp(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => vc(e, {
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
			content: ec(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), $p({
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
			let n = tm(t, e.caller);
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
var Tm = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Em = 32, Dm = 10, Om = 9, km = 13, Am = 160, jm = 6158, Mm = 8192, Nm = 8203, Pm = 8239, Fm = 8287, Im = 12288, Lm = 65279;
function Rm(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function zm(e) {
	return e >= "0" && e <= "9";
}
function Bm(e) {
	return e >= " ";
}
function Vm(e) {
	return ",:[]/{}()\n+".includes(e);
}
function Hm(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Um(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Wm = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Gm = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function Km(e) {
	return ",[]/{}\n+".includes(e);
}
function qm(e) {
	return $m(e) || Jm.test(e);
}
var Jm = /^[[{\w-]$/;
function Ym(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function Xm(e, t) {
	let n = e.charCodeAt(t);
	return n === Em || n === Dm || n === Om || n === km;
}
function Zm(e, t) {
	let n = e.charCodeAt(t);
	return n === Em || n === Om || n === km;
}
function Qm(e, t) {
	let n = e.charCodeAt(t);
	return n === Am || n === jm || n >= Mm && n <= Nm || n === Pm || n === Fm || n === Im || n === Lm;
}
function $m(e) {
	return eh(e) || nh(e);
}
function eh(e) {
	return e === "\"" || e === "“" || e === "”";
}
function th(e) {
	return e === "\"";
}
function nh(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function rh(e) {
	return e === "'";
}
function ih(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function ah(e, t) {
	let n = e.length;
	if (!Xm(e, n - 1)) return e + t;
	for (; Xm(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function oh(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function sh(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var ch = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function lh(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = ch[n];
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
function uh(e) {
	return e !== null && e.char === "\"";
}
function dh(e) {
	return e !== null && e.char === "'";
}
function fh(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function ph(e, t) {
	switch (t) {
		case ")": return fh(e, "(") > fh(e, ")");
		case "]": return fh(e, "[") > fh(e, "]");
		case "}": return fh(e, "{") > fh(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var mh = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, hh = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function gh(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || T(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), qm(e[t]) && sh(n) ? (r || (n = ah(n, ",")), g()) : r && (n = ih(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? Xm : Zm, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (Qm(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !_h(e, t);) t++;
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
			if (Hm(e[t])) for (; t < e.length && Um(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = ah(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = ih(n, ",")) : ie();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (qm(e[t]) || c ? n = ah(n, ":") : ae()), i() || (s || c ? n += "null" : ae()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = ah(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = ah(n, ",")), p(), !i()) {
					r || (n = ih(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = ah(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = ah(n, ",")), t = i();
		t || (n = ih(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, $m(e[t]) || w());
		let s = e[t] === "&" ? lh(e.slice(t, t + 12)) : null, c = uh(s) || dh(s);
		if ($m(e[t]) || c) {
			let l = th(e[t]) ? th : rh(e[t]) ? rh : nh(e[t]) ? nh : eh, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = te(t - 1);
					return !r && Vm(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = ah(p, "\""), n += p, !0);
				}
				if (t === i) return p = ah(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? lh(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Vm(e[t]) && !ph(p, e[t]) || $m(e[t]) && !C(t) || zm(e[t])) return v(), !0;
					e[t] === "\\" && w();
					let s = te(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Vm(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && Km(e[t])) {
					if (e[t - 1] === ":" && Wm.test(e.substring(u + 1, t + 2))) for (; t < e.length && Gm.test(e[t]);) p += e[t], t++;
					return p = ah(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : Ym(e) ? p += mh[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (hh[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Rm(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : oe();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : Ym(n) ? (p += mh[n], t++) : (Bm(n) || re(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = ih(n, "\"", !0);
			let e = n.length;
			n = _() ? oh(n, e, 1) : ah(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !zm(e[t]) && ne() && (i += "0")), e[t] === "0" && zm(e[t + 1]) && (a = !0); zm(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, zm(e[t]) || (i += "0"); zm(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), zm(e[t]) || (i += "0"); zm(e[t]);) i += e[t], t++;
			return ne() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Um(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (Hm(e[t])) {
			for (; t < e.length && Um(e[t]);) t++;
			let n = t;
			for (; Xm(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !Km(e[t]) && !$m(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Wm.test(e.substring(a, t + 2))) for (; t < e.length && Gm.test(e[t]);) t++;
		if (t > a) {
			for (; Xm(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && Xm(e, n);) n--;
		return n;
	}
	function C(t) {
		let n = t + 1;
		for (; n < e.length && Xm(e, n);) n++;
		return n >= e.length || Vm(e[n]);
	}
	function ne() {
		return t >= e.length || Vm(e[t]) || Xm(e, t);
	}
	function re(e) {
		throw new Tm(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function w() {
		throw new Tm(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function T() {
		throw new Tm("Unexpected end of json string", e.length);
	}
	function ie() {
		throw new Tm("Object key expected", t);
	}
	function ae() {
		throw new Tm("Colon expected", t);
	}
	function oe() {
		throw new Tm(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function _h(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function vh(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function yh(e, t) {
	let n = vh(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(gh(n));
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
function bh(e, t, n, r) {
	let i = mc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function xh(e) {
	let { ctx: t, caller: n } = e, r = Yp(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = yh(c(e), i);
		return s = a.value, n.schema ? bh(t, r, a.value, i) : yc(a.value, {
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
		body: () => $p(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Sh = (e, t) => ({
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
function Ch(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function wh(e) {
	let { ctx: t, caller: n } = e, r = Yp(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = Qp(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = yh((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? bh(t, r, o.value, i) : yc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf
		});
	};
	return {
		body: () => $p(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = tm(e, n);
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
function Th(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Yp(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = Qp(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...c,
		...n.tools
	], f = [...e.messages, ...u?.messages ?? []], p = rc(t.workflow, r), m = new Map(r.map((e) => [s.toolOf(e), e])), h = {}, g = [], _ = !1, v = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, y = () => r.find((e) => !e.optional && h[s.fieldOf(e)] === void 0), b = () => {
		let e = y();
		return e ? s.toolOf(e) : "";
	}, x = (e, t, n) => {
		let a = m.get(t.name);
		if (!a) return;
		let o = yh(t.arguments, n).value ?? {}, c = s.fieldOf(a), l = o[s.paramOf(a)];
		if (l !== void 0 && (e[c] = l), r.indexOf(a) === p) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return c;
	}, S = (e, a, o) => n.schema ? bh(t, s, e, a) : yc(e, {
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
			return $p({
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
			let i = Ch(e.toolCalls.filter((e) => e.name), r), o = tm(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && g.push(e.text.trim());
			let s = i.filter((e) => m.has(e.name));
			if (s.length) {
				f.push(Sh(e, i));
				for (let e of i) {
					x(h, e, !0);
					let n = m.has(e.name), r = b(), i = Zp(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: Zp(t, a.tools.results.nudge, {
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
function Eh(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return wm(e);
		case "structured": return xh(e);
		case "tool-single": return wh(e);
		case "tool-multi": return Th(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Dh(e, t) {
	let n = t ? c({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? f(n) : u(n);
}
var Z = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Oh(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, Z({
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
			})), a = () => n === null ? "" : (n = null, Z({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + Z({
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
				text: (e) => e ? o("text") + Z({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + Z({
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
					for (let i of e) t++, r = !0, n += Z({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + Z({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + Z({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => Z({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + Z({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + Z({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Z({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Z({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Z({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: kh(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Z({ error: { message: e } }),
			end: (e) => e ? Z({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? Z({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Z({
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
			error: (e) => Z({ error: { message: e } }),
			end: (e) => Z({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? Z({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Z({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Z({ choices: [{
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
			error: (e) => Z({ error: { message: e } }),
			end: (e) => (e ? Z({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + Z("[DONE]")
		};
	}
}
function kh(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Ah(e, t) {
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
			input: kh(e.arguments)
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
					args: kh(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function jh(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function Mh(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Nh(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Ph = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = Mh(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Nh(t);
			if (r) {
				let t = this.open.has(e) ? Fh(this.value, n) : void 0;
				Ih(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Fh(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Ih(e, t, n) {
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
var Lh = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Rh(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Lh(t) ? t : void 0;
}
function zh(e, t) {
	if (!Lh(t)) return Lh(e) ? e : void 0;
	if (!Lh(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Lh(r) && Lh(n[e]) ? zh(n[e], r) : r);
	return n;
}
function Bh(e, t) {
	if (!Lh(t)) return Lh(e) ? e : void 0;
	if (!Lh(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Lh(r) && Lh(t) ? n[e] = Bh(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var Vh = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Hh(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Uh = class {
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
				args: new Ph()
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
function Wh(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function Gh(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* Kh(e, t) {
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
async function* qh(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Hh(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Vh(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Uh();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Hh(t);
		if (n) throw new Vh(n);
		i.text = Wh(t), i.reasoning = Gh(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Rh(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of Kh(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Hh(e);
		if (r) throw new Vh(r);
		i.text += l(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Rh(e);
		c && (i.usage = zh(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var Jh = /* @__PURE__ */ on({ current: null });
function Yh(e, t) {
	return Jh.current = {
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
	}, Jh.current;
}
function Xh(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var Zh = "/api/backends/chat-completions/generate", Qh = { pending: null }, $h = (e) => e?.name === "AbortError";
function eg(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? Y("error.toolsUnsupported") : null;
}
async function tg(e, t, n) {
	let r = Dh(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = eg(e);
	if (a) return h("error", a, "Advanced Preset"), jh(a, 400);
	let o = e.origin === "task" ? qp(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = Yh(e, i);
	if (!i) try {
		let i = await ig(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(Ah(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return rg(c, e);
	}
	let l = Oh(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await ig(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			$h(e) || (await p(l.error(ng(e))), rg(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var ng = (e) => e instanceof Error ? e.message : String(e);
function rg(e, t) {
	return e.status = $h(t) ? "aborted" : "error", e.error = ng(t), t instanceof Vh ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : jh(ng(t));
}
async function ig(t, n, r, i, a, o) {
	let s = String(n.chat_completion_source ?? ""), l = Eh({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: Dh(s, n)
	}), u = nc(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, m = t.structures.some((e) => e.kind === "annotations") ? (e) => Ku(e, { final: !1 }).text : (e) => e, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, _ = Date.now(), v = "", y, b = 0, x = !1, S, ee;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), s = Bp({
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
			let n = await g(Zh, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), f = 0;
			for await (let e of qh(n, c(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - f < 50) continue;
				f = t;
				let n = l.progress(e, !1);
				if (Xh(i, n, v + e.reasoning), p && d) {
					let e = n.stages[d]?.text ?? "";
					e && o(m(e.slice(0, e.length - Us(e))).trimEnd());
				}
			}
			um(t), s.response = u.text || JSON.stringify(u.toolCalls), s.durationMs = Date.now() - s.at, s.usage = u.usage;
		} catch (e) {
			if (s.error = ng(e), $h(e) || a?.aborted) {
				(u.text || u.reasoning || u.toolCalls.length) && um(t), y = Bh(y, u.usage), x = !0, ee = l.progress(u, !1);
				break;
			}
			throw e;
		}
		v += u.reasoning, y = Bh(y, u.usage), l.progress(u, !0);
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
	let te = ee ?? l.result();
	if (x) for (let e of Object.values(te.stages)) e.status === "streaming" && (e.status = "interrupted");
	Xh(i, te, v);
	let C = ag(t, te, l.rawText(), l.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - _,
		interrupted: x
	});
	return C.toolCalls = S, C.usage = y, S && (C.content = ""), i.status = x ? "aborted" : "done", C;
}
function ag(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Cc(u, h);
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
			let t = Ku(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Ku(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), S = v("recap"), ee = v("memory"), te = t.meta.mixed ? "meta-mixed" : "story", C = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? C = i === void 0 ? u || Ws(r).trim() : JSON.stringify(i) : u || (te = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", C = b ? Zs(b) : "", !C && x && typeof n.structures[x.id] == "string" && (C = "…"), !C && S && n.structures[S.id] && (C = "…"))), !C && !o.interrupted) throw Error(Y("error.emptyTurn"));
	let ne = [], re = [], w = t.interceptorRan && t.stType !== "quiet";
	if (w && ee && Array.isArray(n.structures[ee.id])) {
		let e = Yd(n.structures[ee.id]);
		ne.push(...e.events), re = e.global;
	}
	if (w && S && typeof n.structures[S.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ne.push({
			type: "recap.set",
			text: n.structures[S.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let T = t.stages.map((e) => {
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
		turn: te,
		stages: T,
		...d === void 0 ? {} : {
			draft: d,
			patched: f
		},
		...g?.length ? { annotations: g } : {},
		..._ && (_.draft.length || _.patched.length) ? { annotationVersions: _ } : {},
		patchesApplied: d !== void 0,
		structures: n.structures,
		events: ne,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, ae = {
		content: C,
		reasoning: a,
		sidecar: ie,
		...re.length ? { global: re } : {}
	};
	return w ? Qh.pending = {
		ctx: t,
		outcome: ae,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ie
	}), Jh.current?.genId === t.id && (Jh.current.structures = n.structures), ae;
}
//#endregion
//#region src/core/fetch-gate.ts
var og = "__ap_gen_id";
function sg(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function cg() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	_(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(sg(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[og], r = typeof t == "string" ? Bf.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[og], r.claimed = !0;
				try {
					return await tg(r, e, n.signal);
				} finally {
					Bf.release(t);
				}
			}
			e && (delete e[og], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function lg(e) {
	let t = Bf.takeArmed();
	t && (e[og] = t.id);
}
//#endregion
//#region src/app/memory-sync.ts
var ug = "\0";
function dg(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = Pd(e);
		r && t.add(`${n.presetId}${ug}${r}`);
	}
}
function fg(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && dg(r.extra?.[Ed], t), r.swipe_info?.forEach((e, t) => {
			t !== i && dg(e?.extra?.[Ed], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var pg = null;
function mg(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = fg(n.chat ?? []), o = new Set(a);
	if (pg && !t.reload && pg.chatId === r) for (let e of pg.active) i.has(e) || o.add(e);
	pg = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(ug), i = s.get(n);
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
		n?.globalMemory && (Nd(n.globalMemory.log) && (l = !0), Zd(n, t.off, !1) && (l = !0), Zd(n, t.on, !0) && (l = !0));
	}
	return l && q(), l;
}
function hg(e) {
	Ad(e), mg();
}
function gg() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => hg(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => mg());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => mg({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var _g = 6e5, vg = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function yg(t, n) {
	let r = Qh.pending;
	if (!r || Date.now() - r.at > _g || vg.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	Qh.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), kd(t, a.sidecar), a.global?.length && Xd(Qd(r.ctx.preset), a.global), mg(), Jh.current?.genId === r.ctx.id && (Jh.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var bg = /* @__PURE__ */ new Set();
function xg(e) {
	for (let t of bg) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function Sg(t) {
	let n = e().chat[t], r = Dd(n)?.annotations;
	return !n || !r?.length ? [] : Xu(n.mes, r).annotations;
}
function Cg(t) {
	let n = e().chat[t], r = Dd(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = Xu(n.mes, r.annotations);
	return i.changed ? (kd(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function wg() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (Cg(n) && e().saveChat(), xg(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => xg(Number(e)));
}
var Tg = {
	get: (e) => Sg(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return bg.add(t), () => bg.delete(t);
	}
}, Eg = "advancedPreset.reloadedFor";
async function Dg() {
	try {
		let e = await g(`${s()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Og(e) {
	sessionStorage.setItem(Eg, e), h("info", Y("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function kg() {
	let e = await Dg();
	e && e !== "112c3d13a9c49484" && sessionStorage.getItem(Eg) !== e && Og(e);
}
async function Ag() {
	await kg();
}
async function jg() {
	let e = o().replace(/^third-party\//, ""), t = await Mg(e, !1);
	if (t.status === 404 && (t = await Mg(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Dg();
	return r && r !== "112c3d13a9c49484" ? (Og(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var Mg = (t, n) => g("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
});
//#endregion
//#region src/store/bundled-modules.ts
function Ng(e, t, n, r) {
	return Fu({
		...J(ed(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function Pg(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of Qu(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = Ng(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = ad(o), u = id(c), d = n?.[o.id];
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
		let f = id(s);
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
function Fg(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function Ig(e, t, n = []) {
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
	i.push(...t.add), r.bundledModules = a, q();
}
function Lg(e, t, n) {
	let r = Qu(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && Ng(e, i, n, t.enabled);
		if (i && a && id(a) === id(t)) {
			let { enabled: e, ...n } = J(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return nd(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function Rg(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var zg = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
//#endregion
//#region src/app/bundled-modules.ts
function Bg(e, t, n) {
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
async function Vg(e, t) {
	let { root: n, checked: r } = Bg(Y("um.bundled.conflictTitle"), Y("um.bundled.conflictBody", { name: Cd(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: Y(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await m(n, Y("um.bundled.apply"), Y("um.bundled.keepAll")) ? r() : [];
}
async function Hg(e, t) {
	let n = Qd(e), r = Pg(e, rp(e), n.bundledModules, xd());
	if (Fg(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await Vg(e, a)), Ig(e, r, i), r.add.length && h("info", Y("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), Cd(e));
}
var Ug = /* @__PURE__ */ new Map();
function Wg(e, t = {}) {
	let n = e.id, r = (Ug.get(n) ?? Promise.resolve()).then(() => Hg(md(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return Ug.set(n, r), r;
}
async function Gg(e) {
	let t = rp(e), n = [];
	if (t.length) {
		let { root: r, checked: i } = Bg(Y("um.bundled.exportTitle", { name: Cd(e) }), Y("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || Y("um.untitled"),
			...e.enabled ? {} : { note: Y("um.bundled.disabled") },
			checked: !0
		})));
		if (!await m(r, Y("um.bundled.export"), Y("common.cancel"))) return !1;
		let a = i();
		n = t.filter((e) => a.includes(e.id));
	}
	return Rg(`${zg(e.id)}.apreset.json`, Lg(e, n, xd())), !0;
}
//#endregion
//#region src/app/dev-source.ts
var Kg = /* @__PURE__ */ on({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), qg = 1500, Jg = null;
async function Yg() {
	let { url: e, enabled: t } = K().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await g(`${n}/`, { cache: "no-store" })).json();
		if (Kg.status = "online", Kg.error = e.ok === !1 ? "build failed" : "", Kg.at = Date.now(), !e.hash || e.hash === Kg.hash) return;
		let t = ld(await (await g(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Kg.presetId && Kg.presetId !== t.id && _d(null, Kg.presetId), _d(t), Kg.presetId = t.id, Kg.hash = t.hash, ff(t), await Cf(t), Wg(t, { auto: !0 }), zp("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Kg.status = "error", Kg.error = e instanceof Error ? e.message : String(e);
	}
}
function Xg() {
	if (Jg && clearTimeout(Jg), Jg = null, !K().dev.enabled) {
		Kg.presetId && _d(null, Kg.presetId), Object.assign(Kg, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	Kg.status === "off" && (Kg.status = "connecting");
	let e = async () => {
		await Yg(), K().dev.enabled && (Jg = setTimeout(e, qg));
	};
	e();
}
function Zg() {
	lr(() => [K().dev.enabled, K().dev.url], () => {
		Kg.hash = "", Xg();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var Qg = "#option_impersonate, #mes_impersonate", $g = () => document.querySelector("#send_textarea");
function e_(e, t = !1) {
	let n = $g();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function t_() {
	if (!K().enabled) return null;
	let t = vf(), n = t ? md(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = tf(n);
	if (!jf(r)) return null;
	let i = Is(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Il(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function n_(e) {
	if (!e.target?.closest?.(Qg)) return;
	let t = t_();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = $g()?.value.trim();
	e_(n ? `${t}\n${n}` : t, !0);
}
function r_() {
	window.addEventListener("click", n_, !0);
}
//#endregion
//#region src/app/trust.ts
var i_ = class extends Error {
	constructor() {
		super(Y("trust.declined")), this.name = "TrustDeclined";
	}
}, a_ = (e) => e instanceof i_, o_ = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function s_(e, t, n, r) {
	return [
		`<h3>${p(e)}</h3>`,
		`<p>${p(Y("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${p(Y("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${p(r)}</pre>`
	].join("");
}
var c_ = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function l_(e, t) {
	let n = tl(e);
	if (!n.length || t && o_(n, tl(t))) return;
	let r = Cd(e);
	if (!await m(s_(Y("trust.presetTitle"), Y("trust.preset", { name: r }), n.length, c_(n)), Y("trust.install"), Y("common.cancel"))) throw new i_();
}
async function u_(e) {
	let t = wu(e);
	if (t.length && !await m(s_(Y("trust.modulesTitle"), Y("trust.modules", { n: e.length }), t.length, c_(t)), Y("trust.import"), Y("common.cancel"))) throw new i_();
}
//#endregion
//#region src/app/install.ts
function d_(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function f_(e, t) {
	let n = ld(e);
	if (!n) throw Error(Y("presets.invalid"));
	if (n.minAdvancedPreset && rl("1.9.0", n.minAdvancedPreset) < 0) throw Error(Y("presets.tooNew", { version: n.minAdvancedPreset }));
	await l_(n, md(n.id)), hd(n), t && (K().sources[n.id] = t), q();
	let r = md(n.id) ?? n;
	return ff(r), await Cf(r), await Wg(r), r;
}
async function p_(e) {
	let t = await g(d_(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return f_(await t.json(), e.trim());
}
async function m_(e) {
	return f_(JSON.parse(await e.text()));
}
async function h_(t) {
	if (gd(t), delete K().sources[t], q(), vd(t)) {
		let e = md(t);
		e && (ff(e), await Cf(e), await Wg(e));
		return;
	}
	let n = xf(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/state.ts
var g_ = /* @__PURE__ */ on({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), __ = () => {
	g_.chatRev++;
}, v_ = () => {
	g_.presetId = vf();
}, y_ = G(() => g_.presetId ? md(g_.presetId) : void 0), b_ = G(() => {
	let e = y_.value;
	if (!e) return { config: "" };
	let t = Qd(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : X(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function x_(t) {
	return g_.chatRev, e().chat[t];
}
function S_(e) {
	return Dd(x_(e));
}
function C_(e) {
	e && (g_.tab = e), g_.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var w_ = "openai_preset_import_file", T_ = "export_oai_preset";
function E_(e) {
	return typeof e == "object" && !!e && typeof e.id == "string" && Array.isArray(e.entries);
}
var D_ = /* @__PURE__ */ new WeakSet();
async function O_(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (E_(n)) {
		e.value = "";
		try {
			let e = await f_(n);
			await wf(e), v_(), h("success", Y("presets.installed"), Cd(e)), C_("presets");
		} catch (e) {
			a_(e) ? h("info", e.message, Y("app.name")) : h("error", e instanceof Error ? e.message : String(e), Y("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		D_.add(t), e.dispatchEvent(t);
	}
}
function k_() {
	let e = vf(), t = e ? md(e) : void 0;
	return t ? (Gg(t).catch((e) => h("error", e instanceof Error ? e.message : String(e), Y("app.name"))), !0) : !1;
}
function A_() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== w_ || D_.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), O_(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${T_}`) && k_() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var j_ = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", M_ = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", N_ = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}", P_ = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>svg.lucide{width:1em;height:1em}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text{field-sizing:content;min-height:5.5em;max-height:24em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:minmax(5em,36%) 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row.list{grid-template-columns:1fr auto}.um-var-key{text-overflow:ellipsis;min-width:0;font-weight:600}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:1.15em}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}", F_ = /* @__PURE__ */ on({ mode: "light" }), I_ = new CSSStyleSheet();
I_.replaceSync([
	j_,
	M_,
	N_,
	P_
].join("\n"));
var L_ = new CSSStyleSheet(), R_ = [I_, L_], z_ = [
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
function B_(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of z_) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function V_(e) {
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
function H_() {
	let e = V_(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var U_ = /* @__PURE__ */ new Set();
function W_(e) {
	return U_.add(e), e.dataset.apTheme = F_.mode, () => U_.delete(e);
}
function G_() {
	let e = H_();
	if (e !== F_.mode) {
		F_.mode = e;
		for (let t of U_) t.dataset.apTheme = e;
	}
}
function K_() {
	F_.mode = H_();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(G_);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), sr(() => {
		let e = y_.value?.theme?.[F_.mode] ?? {}, t = K().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(B_(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(B_("primary", t.primary)), t.accent && n.push(B_("accent", t.accent)), L_.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function q_(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function J_(e, t, n = []) {
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
			e.adoptedStyleSheets = R_, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = W_(this), this.app = hs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var Y_ = 6, X_ = 8;
function Z_(e, t, n, r = "center", i = !1) {
	let a = e.top - Y_ - t.height >= X_, o = e.bottom + Y_ + t.height <= n.height - X_, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - Y_ - t.height : e.bottom + Y_;
	c = Math.max(X_, Math.min(c, n.height - X_ - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(X_, Math.min(l, n.width - X_ - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function Q_(e, t) {
	let n = /* @__PURE__ */ M(!1), r = /* @__PURE__ */ M(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = Z_(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return lr(n, async (e) => {
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
	}), Ur(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var $_ = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), ev = /* @__PURE__ */ new Set([
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
]), tv = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function nv(e) {
	return tv(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function rv(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${nv(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${nv(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${nv(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function iv(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = iv(e, t);
			n && i.appendChild(n);
		}
	};
	if (!$_.has(r) && !ev.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = iv(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function av(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return rv(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", rv(e.textContent));
			continue;
		}
		let t = iv(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function ov(e, t, n, r) {
	return e && Sd(e)?.workflows?.[t]?.stages?.[n] || r;
}
function sv(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return q_(e?.actors[t]?.color, n);
}
function cv(e) {
	return G(() => {
		let t = e(), n = S_(t), r = Jh.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = md(r.presetId);
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
					label: ov(e, r.workflow, t.id, t.label),
					color: sv(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = md(n.presetId);
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
				label: ov(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: sv(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var lv = /* @__PURE__ */ on({
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
}), uv, dv, fv = null;
function pv(t) {
	let n = md(Dd(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = Il(n, tf(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: sv(n, n.narrator)
	};
}
function mv(e, t) {
	clearTimeout(uv), clearTimeout(dv), dv = void 0, fv = null, lv.key !== e.key && Object.assign(lv, pv(e.mesId), { html: av(e.ann.comment) }), Object.assign(lv, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), lv.rev++;
}
function hv() {
	clearTimeout(uv), clearTimeout(dv), dv = void 0, fv = null, lv.open && (lv.open = !1, lv.pinned = !1, lv.key = null);
}
function gv(e) {
	if (!lv.pinned) {
		if (e) {
			if (lv.open && lv.key === e.key) {
				clearTimeout(dv), dv = void 0;
				return;
			}
			if (fv === e.key) return;
			clearTimeout(uv), fv = e.key, uv = setTimeout(() => mv(e, !1), 150);
		} else clearTimeout(uv), fv = null, yv();
	}
}
function _v(e) {
	e && !(lv.open && lv.key === e.key) ? mv(e, !0) : hv();
}
function vv() {
	clearTimeout(dv), dv = void 0;
}
function yv() {
	!lv.open || lv.pinned || dv || (dv = setTimeout(hv, 200));
}
function bv(e) {
	lv.key && e.has(lv.key) && hv(), fv && e.has(fv) && (clearTimeout(uv), fv = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var xv = {
	key: 0,
	class: "anno-author"
}, Sv = ["innerHTML"], Cv = /* @__PURE__ */ I({
	__name: "AnnoBubble",
	setup(e) {
		let t = /* @__PURE__ */ M(null);
		function n() {
			let e = t.value;
			if (!e) return;
			let n = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			e.style.maxWidth = `${Math.min(320, n.width - 16)}px`, e.style.left = "0px", e.style.top = "0px";
			let r = e.getBoundingClientRect(), i = lv.rect, a = Z_(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return lr(() => lv.open && lv.rev, async (e) => {
			if (!e) return;
			await Un();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Ur(() => {
			lv.open = !1;
		}), (e, n) => N(lv).open ? (z(), B("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Ae({ "--actor": N(lv).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => N(vv) && N(vv)(...e),
			onMouseleave: n[1] ||= (...e) => N(yv) && N(yv)(...e)
		}, [N(lv).author ? (z(), B("div", xv, A(N(lv).author), 1)) : W("", !0), H("div", {
			class: "rich anno-text",
			innerHTML: N(lv).html
		}, null, 8, Sv)], 36)) : W("", !0);
	}
}), wv = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, Tv = /\s/, Ev = /[“”„‟〝〞＂「」]/, Dv = /[‘’‚‛『』＇]/;
function Ov(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!wv.test(i)) {
			if (Tv.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else Ev.test(i) ? i = "\"" : Dv.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var kv = (e) => Ov(e).text;
function Av(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function jv(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function Mv(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function Nv(e, t, n, r = Ov(e)) {
	let i = kv(n.quote).trim();
	if (!i) return null;
	let a = Av(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = kv(n.prefix), s = kv(n.suffix), c = 0, l = a.map((t) => {
			let n = jv(e, r.text.slice(Math.max(0, t - e.length), t)) + Mv(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = Av(kv(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function Pv(e, t, n = !1) {
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
var Fv = /* @__PURE__ */ new Set([
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
function Iv(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (Fv.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = Iv(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function Lv(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? Fv.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && Iv(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function Rv(e, t, n) {
	let r = Lv(e), i = r.map((e) => e.data), a = i.join(""), o = Ov(a), s = [];
	for (let e of n) {
		let n = Nv(a, t, e, o);
		n && s.push({
			ann: e,
			start: Pv(i, n[0]),
			end: Pv(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function zv(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var Bv = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function Vv(e, t) {
	let n = [...e.located].sort((e, t) => Bv(e.start, t.start) ? 1 : Bv(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && Bv(r, i.end))) {
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
function Hv(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var Uv = "ap-anno", Wv = "ap-anno-style", Gv = /* @__PURE__ */ new Map(), Kv = 0, qv = "#a855f7", Jv = () => null;
function Yv(e) {
	Jv = e;
}
function Xv() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${qv}; }
::highlight(${Uv}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function Zv(e) {
	let t = e.getElementById(Wv);
	t || (t = e.createElement("style"), t.id = Wv, (e.head ?? e.documentElement).append(t)), t.textContent !== Xv() && (t.textContent = Xv());
}
function Qv(e) {
	if (e !== qv) {
		qv = e;
		for (let e of ay()) Zv(e.doc);
	}
}
function $v(e, t) {
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
var ey = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function ty(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => ey(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: $v(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (ey(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: $v(n, e.doc)
			};
		}
	}
	return null;
}
function ny(e) {
	let t = Jv();
	return !!(t && e.composedPath().includes(t));
}
function ry(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !ny(r) && gv(ty(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (ny(t)) return;
		let n = ty(e, t);
		i === "mouse" ? n || hv() : _v(n);
	}, c = (e) => {
		ny(e) || hv();
	}, l = () => gv(null);
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
function iy(e) {
	let t = Gv.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(Uv) ?? new i(), r.set(Uv, a)), Zv(e), t = {
		doc: e,
		serial: ++Kv,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = ry(t), Gv.set(e, t), t;
}
function ay() {
	for (let [e, t] of Gv) e.defaultView || (t.detach(), Gv.delete(e));
	return [...Gv.values()];
}
function oy(e) {
	iy(e);
}
function sy(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function cy(e, t, n, r, i) {
	let a = ly(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = iy(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = zv(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			Vv(r, (t, r) => {
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
	a.size && bv(a);
}
function ly(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [Gv.get(t)].filter((e) => !!e) : ay()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && Hv(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), Gv.delete(i.doc));
		}
	}
	return r;
}
function uy(e, t) {
	let n = ly(e, t);
	n.size && bv(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var dy = /* @__PURE__ */ new Set();
function fy(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var py = () => K().ui.annotations?.show !== !1, my = class {
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
		}), dy.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && uy(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && uy(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			uy(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = Jh.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && py() ? Sg(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		cy(this, document, t, a.length ? Rv(this.el, o, a) : null, !sy(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (cy(this, n, t, a.length && !fy(n) ? Rv(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), uy(this), dy.delete(this);
		}
	}
};
function hy(e, t) {
	for (let n of dy) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function gy() {
	for (let e of dy) e.hasFrames && e.schedule(0);
}
function _y() {
	for (let e of dy) e.el.isConnected || e.dispose();
}
var vy = /* @__PURE__ */ new WeakMap();
function yy(e) {
	let t = vy.get(e);
	(!t || t.disposed) && vy.set(e, new my(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var by = () => window.__TAURITAVERN__?.api?.chatSurface, xy = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return by()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), Sy = !1;
function Cy() {
	let t = by();
	!Sy && t && xy() && (t.protocolVersion === 1 ? (Sy = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new my(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function wy(e, t) {
	t && !xy() && yy(e);
}
var Ty = null;
function Ey() {
	return (!Ty || !Ty.isConnected) && (Ty = document.createElement("ap-anno-bubble"), document.body.append(Ty)), Ty;
}
function Dy() {
	J_("ap-anno-bubble", Cv), Ey(), Yv(() => Ty), oy(document), sr(() => {
		let e = K().ui, t = y_.value?.theme?.[F_.mode]?.accent;
		Qv(e.annotations?.color || e.accent || t || (F_.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), lr(py, () => {
		hv(), hy(void 0, 0);
	}), lr(() => Jh.current?.status, () => hy()), Tg.on("change", (e) => hy(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		hv(), _y();
	});
	t.on("message_iframe_render_ended", () => gy()), addEventListener("resize", () => hv());
}
//#endregion
//#region src/ui/mounts.ts
var Oy = "ap-hidden", ky = [
	"meta-pure",
	"impersonate",
	"summary"
];
function Ay(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function jy(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Dd(a), s = Jh.current?.mesId === n;
	a && !a.is_user && wy(i, !!(o?.annotations?.length || s));
	let c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = Ay("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = Ay("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(Oy, !!(!s && o && ky.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(Oy));
}
function My(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) jy(t);
}
function Ny() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var Py = 0, Fy = /* @__PURE__ */ new Set(), Iy = !1;
function Ly(e) {
	e ? Fy.add(e) : Iy = !0, !Py && (Py = requestAnimationFrame(() => {
		if (Py = 0, Iy) My();
		else for (let e of Fy) e.isConnected && jy(e);
		Fy.clear(), Iy = !1, Ny(), _y();
	}));
}
function Ry() {
	__(), Ly();
}
function zy() {
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
	]) e && t.on(e, Ry);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Ly(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Ly(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Ly();
	};
	r();
	let i;
	lr(() => Jh.current && Jh.current.status === "running" && Jh.current.streaming && Jh.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = Jh.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), Ry());
		}, 100));
	}), lr(() => Jh.current?.status, () => Ly());
}
//#endregion
//#region src/ui/entry.ts
var By = "left-nav-panel", Vy = "ap-preset-banner";
function Hy() {
	return document.getElementById(By);
}
function Uy() {
	let e = Hy();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function Wy() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== Vy && e.after(document.createElement(Vy));
}
var Gy = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function Ky() {
	lr(() => g_.presetId, (e) => {
		for (let t of document.querySelectorAll(Gy.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function qy(e) {
	let t = Hy();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function Jy() {
	let e = Hy();
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
function Yy() {
	Wy(), Ky(), Jy(), lr(() => g_.panelOpen, (e) => {
		e && Uy();
	});
	let e = Hy();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (g_.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var Xy = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Zy = (e) => e === "", Qy = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), $y = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), eb = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), tb = (e) => {
	let t = eb(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, nb = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, rb = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = nb.width, color: s = nb.stroke, ...c }, { slots: l }) => Ba("svg", {
	...nb,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Zy(n) || Zy(r) || n === !0 || r === !0 ? Number(i || a || nb["stroke-width"]) * 24 / Number(o) : i || a || nb["stroke-width"],
	class: Qy("lucide", c.class, ...e ? [`lucide-${$y(tb(e))}-icon`, `lucide-${$y(e)}`] : ["lucide-icon"]),
	...!l.default && !Xy(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Ba(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Ba(rb, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), ib = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), ab = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), ob = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), sb = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), cb = Q("braces", [["path", {
	d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
	key: "ezmyqa"
}], ["path", {
	d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
	key: "e1hn23"
}]]), lb = Q("brain", [
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
]), ub = Q("bug", [
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
]), db = Q("cable", [
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
]), fb = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), pb = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), mb = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), hb = Q("circle-dashed", [
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
]), gb = Q("circle-question-mark", [
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
]), _b = Q("circle-slash", [["circle", {
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
}]]), vb = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), yb = Q("code-xml", [
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
]), bb = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), xb = Q("coins", [
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
]), Sb = Q("copy-plus", [
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
]), Cb = Q("copy", [["rect", {
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
}]]), wb = Q("database-zap", [
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
]), Tb = Q("download", [
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
]), Eb = Q("drama", [
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
]), Db = Q("feather", [
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
]), Ob = Q("file-down", [
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
]), kb = Q("file-plus", [
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
]), Ab = Q("file-stack", [
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
]), jb = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), Mb = Q("git-compare-arrows", [
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
]), Nb = Q("globe", [
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
]), Pb = Q("grip-vertical", [
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
]), Fb = Q("info", [
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
]), Ib = Q("layers", [
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
]), Lb = Q("layout-template", [
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
]), Rb = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), zb = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Bb = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), Vb = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Hb = Q("message-square-dashed", [
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
]), Ub = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), Wb = Q("notebook-pen", [
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
]), Gb = Q("package", [
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
]), Kb = Q("palette", [
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
]), qb = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), Jb = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), Yb = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Xb = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), Zb = Q("refresh-cw", [
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
]), Qb = Q("regex", [
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
]), $b = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), ex = Q("save", [
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
]), tx = Q("scroll-text", [
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
]), nx = Q("server", [
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
]), rx = Q("shapes", [
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
]), ix = Q("sliders-horizontal", [
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
]), ax = Q("sliders-vertical", [
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
]), ox = Q("text-cursor-input", [
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
]), sx = Q("trash-2", [
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
]), cx = Q("triangle-alert", [
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
]), lx = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), ux = Q("upload", [
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
]), dx = Q("user-pen", [
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
]), fx = Q("workflow", [
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
]), px = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), mx = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), hx = /* @__PURE__ */ I({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ M(null), { open: r, bubble: i } = Q_(n, () => t);
		return (t, a) => (z(), B("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Xr(t.$slots, "default"), N(r) && e.text ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : W("", !0)], 544));
	}
}), gx = ["disabled", "aria-label"], $ = /* @__PURE__ */ I({
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
		return (t, n) => (z(), V(hx, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: P(() => [H("button", {
				type: "button",
				class: k(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(z(), V(Kr(e.icon)))], 10, gx)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), _x = {
	key: 0,
	class: "patches"
}, vx = { class: "patch-old pre" }, yx = { class: "patch-new pre" }, bx = {
	key: 0,
	class: "patch-status xs"
}, xx = {
	key: 2,
	class: "faint small stage-empty"
}, Sx = /* @__PURE__ */ I({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ M(null);
		lr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Un();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (z(), B("div", {
			class: "stage-body",
			style: Ae({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (z(), B("div", _x, [(z(!0), B(R, null, L(e.stage.patches, (e, t) => (z(), B("div", {
			key: t,
			class: k(["patch", { failed: r(e.status) }])
		}, [
			H("div", vx, A(e.old_string), 1),
			U(N(ib), { class: "patch-arrow" }),
			H("div", yx, A(e.new_string), 1),
			r(e.status) ? (z(), B("div", bx, [U(N(ob)), pa(A(N(Y)(`patch.${e.status}`)), 1)])) : W("", !0)
		], 2))), 128))])) : e.stage.text ? (z(), B("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, A(e.stage.text), 513)) : (z(), B("div", xx, A(N(Y)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function Cx(t) {
	let n = e().chat[t], r = Dd(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), kd(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), __();
}
async function wx(t, n, r) {
	let i = e().chat[t], a = Dd(i);
	return !i || !a ? !1 : (kd(t, Od(a, n, r)), __(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var Tx = { class: "stage-bar" }, Ex = ["onClick"], Dx = { class: "ellipsis" }, Ox = {
	key: 0,
	class: "chip stage-chip error"
}, kx = { class: "ellipsis" }, Ax = { class: "badge warn" }, jx = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, Mx = /* @__PURE__ */ I({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = cv(() => t.mesid), r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ M(!1), a = G(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = G(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = G(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = G(() => o.value.find((e) => e.id === s.value) ?? null);
		lr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = K().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: Wb,
			content: Db,
			patch: Mb
		}, d = (e) => e.status === "streaming" ? zb : e.status === "interrupted" ? _b : e.status === "missing" ? hb : u[e.kind], f = G(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = G(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = G(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Y(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Y("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => N(n) && (o.value.length || N(n).error) ? (z(), B("div", {
			key: 0,
			class: k(["stages", { live: N(n).running }])
		}, [H("div", Tx, [
			(z(!0), B(R, null, L(o.value, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				class: k(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ae({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(z(), V(Kr(d(e)), { class: k({ spin: e.status === "streaming" }) }, null, 8, ["class"])), H("span", Dx, A(e.label), 1)], 14, Ex))), 128)),
			N(n).error ? (z(), B("span", Ox, [U(N(cx)), H("span", kx, A(N(n).error), 1)])) : W("", !0),
			r[1] ||= H("span", { class: "grow" }, null, -1),
			f.value.length ? (z(), V(hx, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: P(() => [H("span", Ax, [U(N(cx)), pa(A(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : W("", !0),
			p.value ? (z(), V($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? N(lx) : N(Xb),
				label: p.value.patchesApplied ? N(Y)("stages.revertDraft") : N(Y)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => N(Cx)(e.mesid)
			}, null, 8, ["icon", "label"])) : W("", !0),
			N(n).running ? W("", !0) : (z(), V(hx, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: P(() => [H("span", jx, [U(N(Fb))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (z(), V(Sx, {
			key: c.value.id,
			stage: c.value,
			follow: N(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : W("", !0)], 2)) : W("", !0);
	}
}), Nx = { class: "reply-name xs" }, Px = ["innerHTML"], Fx = /* @__PURE__ */ I({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = G(() => av(t.text));
		return (t, r) => (z(), B("div", {
			class: "reply-card",
			style: Ae({ "--actor": e.color })
		}, [H("div", Nx, A(e.name), 1), H("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, Px)], 4));
	}
}), Ix = { class: "card mini-card" }, Lx = { class: "card-head" }, Rx = { class: "card-title" }, zx = { class: "card-body pre" }, Bx = /* @__PURE__ */ I({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (z(), B("div", Ix, [H("header", Lx, [
			U(N(dx), { class: "section-icon" }),
			H("span", Rx, A(N(Y)("cards.impersonate")), 1),
			H("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => N(e_)(e.text)
			}, [U(N(ox)), pa(A(N(Y)("cards.fillInput")), 1)])
		]), H("div", zx, A(e.text), 1)]));
	}
}), Vx = ["aria-label"], Hx = ["title", "onClick"], Ux = { class: "option-label" }, Wx = { class: "option-content small muted" }, Gx = /* @__PURE__ */ I({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => e_(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (z(), B("div", {
			class: "options-grid",
			role: "list",
			"aria-label": N(Y)("cards.options")
		}, [(z(!0), B(R, null, L(e.options, (e, n) => (z(), B("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: N(Y)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [H("span", Ux, A(e.label), 1), H("span", Wx, A(e.content), 1)], 8, Hx))), 128))], 8, Vx));
	}
}), Kx = {
	key: 0,
	class: "memory-ops"
}, qx = { class: "ellipsis" }, Jx = ["aria-label", "onClick"], Yx = /* @__PURE__ */ I({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = G(() => {
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
		return (e, t) => n.value.length ? (z(), B("div", Kx, [(z(!0), B(R, null, L(n.value, (e, t) => (z(), V(hx, {
			key: t,
			text: e.op === "delete" ? N(Y)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: P(() => [H("span", { class: k(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(z(), V(Kr(e.scope === "global" ? N(Nb) : N(Vb)), { class: "faint" })),
				H("span", qx, A(e.key), 1),
				(z(), V(Kr(e.op === "delete" ? N(sx) : N(Jb)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": N(Y)("common.undo"),
					onClick: (t) => r(e)
				}, [U(N(lx))], 8, Jx)) : W("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : W("", !0);
	}
}), Xx = ["aria-label"], Zx = /* @__PURE__ */ I({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ M(null), { open: r, bubble: i } = Q_(n, () => t);
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
			onClick: a[0] ||= ls((e) => r.value = !N(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [U(N(gb))], 40, Xx), N(r) ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : W("", !0)], 544)) : W("", !0);
	}
}), Qx = { class: "card-title" }, $x = {
	key: 0,
	class: "card-body"
}, eS = /* @__PURE__ */ I({
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
		let t = /* @__PURE__ */ M(e.open ?? !0);
		return (n, r) => (z(), B("section", { class: k(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [H("header", {
			class: k(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (z(), V(Kr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : W("", !0),
			H("span", Qx, A(e.title), 1),
			U(Zx, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			H("span", {
				class: "row",
				onClick: r[0] ||= ls(() => {}, ["stop"])
			}, [Xr(n.$slots, "actions")]),
			e.collapsible ? (z(), V(N(pb), {
				key: 1,
				class: k(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : W("", !0)
		], 2), !e.collapsible || t.value ? (z(), B("div", $x, [Xr(n.$slots, "default")])) : W("", !0)], 2));
	}
}), tS = {
	key: 0,
	class: "badge neutral"
}, nS = { class: "pre small" }, rS = /* @__PURE__ */ I({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (z(), V(eS, {
			title: N(Y)("cards.recap"),
			icon: N(tx),
			collapsible: "",
			open: !1
		}, {
			actions: P(() => [e.coversUpTo === void 0 ? W("", !0) : (z(), B("span", tS, "#0–" + A(e.coversUpTo), 1))]),
			default: P(() => [H("div", nS, A(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), iS = { class: "synopsis-fields" }, aS = { class: "synopsis-field" }, oS = ["placeholder", "aria-label"], sS = { class: "synopsis-field" }, cS = ["placeholder", "aria-label"], lS = ["placeholder", "aria-label"], uS = ["placeholder", "aria-label"], dS = { class: "synopsis-actions" }, fS = { class: "xs faint grow synopsis-keys" }, pS = {
	type: "submit",
	class: "btn primary sm-btn"
}, mS = { class: "synopsis-head" }, hS = { class: "synopsis-line small" }, gS = {
	key: 0,
	class: "row tight"
}, _S = {
	key: 1,
	class: "row tight"
}, vS = { class: "synopsis-event ellipsis" }, yS = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, bS = /* @__PURE__ */ I({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ M(!1), a = /* @__PURE__ */ M(!1), o = /* @__PURE__ */ on({
			time: "",
			location: "",
			event: "",
			summary: ""
		}), s = /* @__PURE__ */ M(), c = /* @__PURE__ */ M(), l = [
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
			H("div", iS, [H("label", aS, [U(N(vb), { class: "faint" }), F(H("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: N(Y)("cards.synopsis.time"),
				"aria-label": N(Y)("cards.synopsis.time")
			}, null, 8, oS), [[$o, o.time]])]), H("label", sS, [U(N(Bb), { class: "faint" }), F(H("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: N(Y)("cards.synopsis.location"),
				"aria-label": N(Y)("cards.synopsis.location")
			}, null, 8, cS), [[$o, o.location]])])]),
			F(H("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: N(Y)("cards.synopsis.event"),
				"aria-label": N(Y)("cards.synopsis.event")
			}, null, 8, lS), [[$o, o.event]]),
			F(H("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: N(Y)("cards.synopsis.summary"),
				"aria-label": N(Y)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, uS), [[$o, o.summary]]),
			H("div", dS, [
				H("span", fS, A(N(Y)("cards.synopsis.keys")), 1),
				H("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, A(N(Y)("common.cancel")), 1),
				H("button", pS, [U(N(fb)), pa(A(N(Y)("common.save")), 1)])
			])
		], 32)) : (z(), B("div", {
			key: 1,
			class: k(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [H("div", mS, [H("div", hS, [
			e.synopsis.time ? (z(), B("span", gS, [U(N(vb), { class: "faint" }), pa(A(e.synopsis.time), 1)])) : W("", !0),
			e.synopsis.location ? (z(), B("span", _S, [U(N(Bb), { class: "faint" }), pa(A(e.synopsis.location), 1)])) : W("", !0),
			H("span", vS, A(e.synopsis.event), 1)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= ls(() => {}, ["stop"])
		}, [U($, {
			icon: N(Jb),
			label: N(Y)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : W("", !0)]), i.value && e.synopsis.summary ? (z(), B("div", yS, A(e.synopsis.summary), 1)) : W("", !0)], 2));
	}
}), xS = ["innerHTML"], SS = {
	key: 1,
	class: "kv-list small"
}, CS = { class: "pre" }, wS = /* @__PURE__ */ I({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = G(() => typeof t.value == "string" ? av(t.value) : "");
		return (t, r) => (z(), V(eS, {
			title: e.title,
			icon: N(rx),
			collapsible: "",
			open: !1
		}, {
			default: P(() => [typeof e.value == "string" ? (z(), B("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, xS)) : (z(), B("dl", SS, [(z(!0), B(R, null, L(e.value, (e, t) => (z(), B(R, { key: t }, [H("dt", null, A(t), 1), H("dd", CS, A(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), TS = {
	key: 0,
	class: "cards"
}, ES = /* @__PURE__ */ I({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = cv(() => t.mesid), r = G(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = i.find((e) => e.kind === "synopsis")?.id, s = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: Il(r, tf(r), r.narrator),
				color: sv(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: s?.type === "recap.set" ? s : null,
				synopsisId: o,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: X(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (t, n) => r.value ? (z(), B("div", TS, [
			r.value.reply ? (z(), V(Fx, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : W("", !0),
			r.value.impersonate ? (z(), V(Bx, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : W("", !0),
			r.value.options.length ? (z(), V(Gx, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : W("", !0),
			r.value.synopsis ? (z(), V(bS, {
				key: 3,
				synopsis: r.value.synopsis,
				editable: "",
				onSave: n[0] ||= (t) => r.value?.synopsisId && N(wx)(e.mesid, r.value.synopsisId, t)
			}, null, 8, ["synopsis"])) : W("", !0),
			r.value.memory.length ? (z(), V(Yx, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : W("", !0),
			r.value.recap ? (z(), V(rS, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : W("", !0),
			(z(!0), B(R, null, L(r.value.custom, (e) => (z(), V(wS, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : W("", !0);
	}
}), DS = {
	key: 0,
	class: "dock stages live"
}, OS = { class: "stage-bar" }, kS = { class: "ellipsis" }, AS = {
	key: 0,
	class: "small muted"
}, jS = /* @__PURE__ */ I({
	__name: "Dock",
	setup(e) {
		let t = G(() => Jh.current && !Jh.current.streaming && Jh.current.status === "running" ? Jh.current : null), n = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = md(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: ov(n, e.workflow, t.id, t.label),
				color: sv(n, t.actor)
			}));
		}), r = G(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (z(), B("div", DS, [H("div", OS, [
			U(N(zb), { class: "spin faint" }),
			(z(!0), B(R, null, L(n.value, (e) => (z(), B("span", {
				key: e.id,
				class: k(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ae({ "--actor": e.color })
			}, [H("span", kS, A(e.label), 1)], 6))), 128)),
			n.value.length ? W("", !0) : (z(), B("span", AS, A(N(Y)("stages.waiting")), 1))
		]), r.value ? (z(), V(Sx, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : W("", !0)])) : W("", !0);
	}
}), MS = ["aria-label"], NS = ["disabled"], PS = /* @__PURE__ */ I({
	__name: "Switch",
	props: /*@__PURE__*/ ri({
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
		let t = ci(e, "modelValue");
		return (n, r) => (z(), B("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			F(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, NS), [[es, t.value]]),
			r[1] ||= H("span", { class: "track" }, null, -1),
			r[2] ||= H("span", { class: "thumb" }, null, -1)
		], 8, MS));
	}
}), FS = { class: "field-label" }, IS = { class: "ellipsis" }, LS = {
	key: 0,
	class: "dot modified"
}, RS = { class: "field-control" }, zS = /* @__PURE__ */ I({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (z(), B("div", { class: k(["field", { inline: e.inline }]) }, [H("div", FS, [
			H("span", IS, A(e.label), 1),
			e.modified ? (z(), B("span", LS)) : W("", !0),
			U(Zx, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), H("div", RS, [Xr(t.$slots, "default")])], 2));
	}
}), BS = { class: "swatches" }, VS = ["title"], HS = ["title"], US = { class: "swatches" }, WS = ["title"], GS = /* @__PURE__ */ I({
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
		return (e, t) => (z(), V(eS, {
			title: N(Y)("appearance.title"),
			icon: N(Kb),
			collapsible: "",
			open: !1
		}, {
			default: P(() => [
				U(zS, {
					label: N(Y)("appearance.colors"),
					help: N(Y)("appearance.colors.hint"),
					inline: ""
				}, {
					default: P(() => [H("div", BS, [
						H("label", {
							class: "swatch",
							style: Ae({ background: N(r) || "var(--ap-primary-500)" }),
							title: N(Y)("appearance.primary")
						}, [F(H("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ _n(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							$o,
							N(r),
							void 0,
							{ lazy: !0 }
						]])], 12, VS),
						H("label", {
							class: "swatch",
							style: Ae({ background: N(i) || "var(--ap-accent-500)" }),
							title: N(Y)("appearance.accent")
						}, [F(H("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ _n(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							$o,
							N(i),
							void 0,
							{ lazy: !0 }
						]])], 12, HS),
						U($, {
							icon: N($b),
							label: N(Y)("common.reset"),
							small: "",
							align: "end",
							disabled: !N(r) && !N(i),
							onClick: o
						}, null, 8, [
							"icon",
							"label",
							"disabled"
						])
					])]),
					_: 1
				}, 8, ["label", "help"]),
				U(zS, {
					label: N(Y)("appearance.collapseStages"),
					inline: ""
				}, {
					default: P(() => [U(PS, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				U(zS, {
					label: N(Y)("appearance.annotations"),
					help: N(Y)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: P(() => [U(PS, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (z(), V(zS, {
					key: 0,
					label: N(Y)("appearance.annotationColor"),
					inline: ""
				}, {
					default: P(() => [H("div", US, [H("label", {
						class: "swatch",
						style: Ae({ background: l.value || "var(--ap-accent)" }),
						title: N(Y)("appearance.annotationColor")
					}, [F(H("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						$o,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, WS), U($, {
						icon: N($b),
						label: N(Y)("common.reset"),
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
}), KS = { class: "toolbar" }, qS = ["disabled"], JS = ["disabled"], YS = { class: "preset-list" }, XS = ["onClick", "onKeydown"], ZS = { class: "preset-mark" }, QS = { class: "grow col preset-info" }, $S = { class: "row wrap preset-head" }, eC = { class: "preset-name" }, tC = { class: "badge neutral" }, nC = { class: "badge neutral icon-badge" }, rC = {
	key: 0,
	class: "xs muted"
}, iC = {
	key: 1,
	class: "small muted preset-desc"
}, aC = {
	key: 0,
	class: "empty"
}, oC = /* @__PURE__ */ I({
	__name: "PresetsTab",
	setup(e) {
		let t = G(() => ud()), n = (e) => tl(e.preset).length > 0, r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ M(!1), a = /* @__PURE__ */ M(""), o = /* @__PURE__ */ M(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && h("success", n);
			} catch (e) {
				a_(e) ? h("info", e.message) : h("error", e instanceof Error ? e.message : String(e), Y("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await wf(e.preset), v_();
		}), l = () => s("url", async () => {
			let e = await p_(a.value);
			return a.value = "", i.value = !1, e;
		}, Y("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => m_(t), Y("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => p_(K().sources[e.preset.id]), Y("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => Gg(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => h_(e.preset.id)), m = () => s("ext", async () => h("info", await jg() === "current" ? Y("update.none") : Y("update.reloading")));
		return (e, s) => (z(), B(R, null, [
			H("div", KS, [
				H("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [U(N(ux)), pa(A(N(Y)("presets.importFile")), 1)], 8, qS),
				H("button", {
					type: "button",
					class: k(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [U(N(Rb)), pa(A(N(Y)("presets.importUrl")), 1)], 2),
				s[4] ||= H("span", { class: "grow" }, null, -1),
				U($, {
					icon: r.value === "ext" ? N(zb) : N(Zb),
					label: N(Y)("presets.checkUpdates"),
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
			}, [F(H("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[$o, a.value]]), H("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (z(), V(N(zb), {
				key: 0,
				class: "spin"
			})) : (z(), V(N(Tb), { key: 1 })), pa(A(N(Y)("common.install")), 1)], 8, JS)], 32)) : W("", !0),
			H("div", YS, [(z(!0), B(R, null, L(t.value, (e) => (z(), B("div", {
				key: e.preset.id,
				class: k(["preset-item", { on: N(y_)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: ds((t) => c(e), ["enter"])
			}, [
				H("span", ZS, [r.value === `select:${e.preset.id}` ? (z(), V(N(zb), {
					key: 0,
					class: "spin"
				})) : N(y_)?.id === e.preset.id ? (z(), V(N(fb), { key: 1 })) : W("", !0)]),
				H("div", QS, [
					H("div", $S, [
						H("span", eC, A(N(Cd)(e.preset)), 1),
						H("span", tC, "v" + A(e.preset.version), 1),
						e.source === "builtin" ? W("", !0) : (z(), B("span", {
							key: 0,
							class: k(["badge", { warn: e.source === "dev" }])
						}, A(N(Y)(`presets.source.${e.source}`)), 3)),
						n(e) ? (z(), V(hx, {
							key: 1,
							text: N(Y)("presets.templates.help")
						}, {
							default: P(() => [H("span", nC, [U(N(yb)), pa(A(N(Y)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : W("", !0)
					]),
					e.preset.author ? (z(), B("span", rC, A(e.preset.author), 1)) : W("", !0),
					N(wd)(e.preset) ? (z(), B("span", iC, A(N(wd)(e.preset)), 1)) : W("", !0)
				]),
				H("div", {
					class: "row preset-actions",
					onClick: s[3] ||= ls(() => {}, ["stop"])
				}, [
					U($, {
						icon: N(Ob),
						label: N(Y)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					e.source === "installed" && N(K)().sources[e.preset.id] ? (z(), V($, {
						key: 0,
						icon: N(Zb),
						label: N(Y)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : W("", !0),
					e.source === "installed" ? (z(), V($, {
						key: 1,
						icon: N(sx),
						label: N(Y)("common.delete"),
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
			], 42, XS))), 128)), t.value.length ? W("", !0) : (z(), B("div", aC, A(N(Y)("presets.none")), 1))]),
			U(GS)
		], 64));
	}
}), sC;
function cC() {
	let e = y_, t = G(() => e.value ? tf(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (rf(r, t), n.sampling && (clearTimeout(sC), sC = setTimeout(() => void Tf(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var lC = { class: "empty" }, uC = /* @__PURE__ */ I({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (z(), B("div", lC, [
			U(N(Gb)),
			H("span", null, A(N(Y)("panel.noPreset")), 1),
			H("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => N(g_).tab = "presets"
			}, A(N(Y)("panel.choosePreset")), 1)
		]));
	}
}), dC = [
	"aria-checked",
	"title",
	"onClick"
], fC = { class: "ellipsis" }, pC = /* @__PURE__ */ I({
	__name: "Segmented",
	props: /*@__PURE__*/ ri({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ci(e, "modelValue");
		return (n, r) => (z(), B("div", {
			class: k(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(z(!0), B(R, null, L(e.options, (e) => (z(), B("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: k({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (z(), V(Kr(e.icon), { key: 0 })) : W("", !0), H("span", fC, A(e.label), 1)], 10, dC))), 128))], 2));
	}
}), mC = { class: "col" }, hC = { class: "row" }, gC = ["aria-label"], _C = ["label"], vC = ["value"], yC = ["label"], bC = ["value"], xC = ["placeholder"], SC = {
	key: 1,
	class: "xs muted row tight"
}, CC = { value: "" }, wC = ["value"], TC = ["value"], EC = ["value"], DC = [
	"value",
	"placeholder",
	"onChange"
], OC = [
	"value",
	"placeholder",
	"onChange"
], kC = ["value"], AC = ["value"], jC = ["value"], MC = ["value"], NC = ["value"], PC = { class: "slider" }, FC = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], IC = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], LC = { class: "field-grid" }, RC = ["value", "onChange"], zC = ["value"], BC = ["value"], VC = /* @__PURE__ */ I({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = cC(), i = G(() => t.value ? Qd(t.value) : null), a = G({
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
		}), o = G(() => t.value ? of(t.value) : !1), s = G(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ M(null), l = /* @__PURE__ */ M("");
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
		}, h = G(() => bs.map((e) => ({
			value: e,
			label: Y(`transport.${e}`),
			hint: Y(`transport.${e}.hint`)
		}))), g = G({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), _ = G(() => g.value === "tool-single" || g.value === "tool-multi"), v = G(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), y = G(() => v.value.map((e) => ({
			value: e.id,
			label: X(t.value, "workflows", e.id, "name", e.name),
			hint: X(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), b = G({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), x = G(() => y.value.find((e) => e.value === b.value)?.hint);
		function S(e) {
			return G({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let ee = S("forceTool"), te = S("parallelTools"), C = S("sendThoughtSignature"), ne = S("streamToolArguments"), re = S("finalFallback"), w = S("maxSteps"), T = G({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), ie = G(() => Object.entries(t.value?.actors ?? {})), ae = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), oe = G({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), se = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), E = G(() => ws.map((e) => ({
			value: e,
			label: Y(`writing.userInput.${e}`),
			hint: Y(`writing.userInput.${e}.hint`)
		}))), D = G({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), ce = G({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), O = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), le = G({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), ue = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), de = [
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
		], fe = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], pe = ["stream_openai", "show_thoughts"], me = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], he = G(() => n.value?.sampling ?? {}), ge = (e) => e in he.value, _e = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), ve = (e) => Number(e.target.value);
		return (e, r) => !N(t) || !N(n) || !i.value ? (z(), V(uC, { key: 0 })) : (z(), B(R, { key: 1 }, [
			H("div", mC, [
				H("div", hC, [
					F(H("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": N(Y)("config.configuration")
					}, [H("optgroup", { label: N(Y)("config.recommended") }, [(z(!0), B(R, null, L(N(t).configurations, (e) => (z(), B("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, A(N(X)(N(t), "configurations", e.id, "name", e.name)), 9, vC))), 128))], 8, _C), i.value.saved.length ? (z(), B("optgroup", {
						key: 0,
						label: N(Y)("config.saved")
					}, [(z(!0), B(R, null, L(i.value.saved, (e) => (z(), B("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, A(e.name), 9, bC))), 128))], 8, yC)) : W("", !0)], 8, gC), [[ns, a.value]]),
					s.value && o.value ? (z(), V($, {
						key: 0,
						icon: N(ex),
						label: N(Y)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : W("", !0),
					U($, {
						icon: N(Yb),
						label: N(Y)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (z(), V($, {
						key: 1,
						icon: N(Jb),
						label: N(Y)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : W("", !0),
					s.value ? (z(), V($, {
						key: 2,
						icon: N(sx),
						label: N(Y)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : W("", !0),
					U($, {
						icon: N($b),
						label: N(Y)("config.reset"),
						align: "end",
						disabled: !o.value,
						onClick: f
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				c.value ? (z(), B("form", {
					key: 0,
					class: "row",
					onSubmit: ls(d, ["prevent"])
				}, [
					F(H("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: N(Y)("config.name"),
						autofocus: ""
					}, null, 8, xC), [[$o, l.value]]),
					U($, {
						icon: N(px),
						label: N(Y)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					U($, {
						icon: N(fb),
						label: N(Y)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : W("", !0),
				o.value ? (z(), B("span", SC, [r[24] ||= H("span", { class: "dot modified" }, null, -1), pa(A(N(Y)("config.modified")), 1)])) : W("", !0)
			]),
			U(eS, {
				title: N(Y)("config.connection"),
				icon: N(db)
			}, {
				default: P(() => [
					U(zS, {
						label: N(Y)("config.transport"),
						help: N(Y)(`transport.${g.value}.hint`)
					}, {
						default: P(() => [U(pC, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (z(), B(R, { key: 0 }, [
						U(zS, {
							label: N(Y)("config.forceTool"),
							help: N(Y)("config.forceTool.hint"),
							inline: ""
						}, {
							default: P(() => [U(PS, {
								modelValue: N(ee),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ _n(ee) ? ee.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(zS, {
							label: N(Y)("config.parallelTools"),
							help: N(Y)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: P(() => [U(PS, {
								modelValue: N(te),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ _n(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(zS, {
							label: N(Y)("config.syntheticTurn"),
							help: N(Y)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: P(() => [F(H("select", {
								"onUpdate:modelValue": r[8] ||= (e) => T.value = e,
								class: "input"
							}, [H("option", CC, A(N(Y)("common.none")), 1), (z(!0), B(R, null, L(N(t).syntheticTurns, (e) => (z(), B("option", {
								key: e.id,
								value: e.id
							}, A(e.label), 9, wC))), 128))], 512), [[ns, T.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(zS, {
							label: N(Y)("config.thoughtSignature"),
							help: N(Y)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: P(() => [U(PS, {
								modelValue: N(C),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ _n(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(zS, {
							label: N(Y)("config.streamToolArguments"),
							help: N(Y)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: P(() => [F(H("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ _n(ne) ? ne.value = e : null,
								class: "input"
							}, [(z(!0), B(R, null, L(N(xs), (e) => (z(), B("option", {
								key: e,
								value: e
							}, A(N(Y)(`config.streamToolArguments.${e}`)), 9, TC))), 128))], 512), [[ns, N(ne)]])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (z(), V(zS, {
							key: 0,
							label: N(Y)("config.maxSteps"),
							inline: ""
						}, {
							default: P(() => [H("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: N(w),
								onChange: r[11] ||= (e) => w.value = ve(e)
							}, null, 40, EC)]),
							_: 1
						}, 8, ["label"])) : W("", !0)
					], 64)) : W("", !0),
					U(zS, {
						label: N(Y)("config.finalFallback"),
						help: N(Y)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: P(() => [U(PS, {
							modelValue: N(re),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ _n(re) ? re.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (z(), V(eS, {
				key: 0,
				title: N(Y)("config.workflow"),
				icon: N(fx),
				help: x.value
			}, {
				default: P(() => [U(pC, {
					modelValue: b.value,
					"onUpdate:modelValue": r[13] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			U(eS, {
				title: N(Y)("writing.actors"),
				icon: N(Eb),
				collapsible: "",
				open: !1
			}, {
				default: P(() => [(z(!0), B(R, null, L(ie.value, ([e, t]) => (z(), B("div", {
					key: e,
					class: "field-grid"
				}, [U(zS, { label: N(Y)("writing.actorName", { actor: e }) }, {
					default: P(() => [H("input", {
						class: "input",
						value: N(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => ae("names", e, t.target.value)
					}, null, 40, DC)]),
					_: 2
				}, 1032, ["label"]), U(zS, { label: N(Y)("writing.actorPrefix") }, {
					default: P(() => [H("input", {
						class: "input",
						value: N(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => ae("prefixes", e, t.target.value)
					}, null, 40, OC)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(eS, {
				title: N(Y)("writing.meta"),
				icon: N(Ub),
				help: N(Y)("writing.meta.hint")
			}, {
				actions: P(() => [U(PS, {
					modelValue: ce.value,
					"onUpdate:modelValue": r[14] ||= (e) => ce.value = e,
					label: N(Y)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: P(() => [ce.value ? (z(), V(zS, {
					key: 0,
					label: N(Y)("writing.recentCount"),
					help: N(Y)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: P(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: N(n).meta.recentCount,
						onChange: r[15] ||= (e) => O(e.target.value)
					}, null, 40, kC)]),
					_: 1
				}, 8, ["label", "help"])) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(eS, {
				title: N(Y)("writing.tokenSaving"),
				icon: N(xb),
				help: N(Y)("writing.tokenSaving.hint")
			}, {
				actions: P(() => [U(PS, {
					modelValue: oe.value,
					"onUpdate:modelValue": r[16] ||= (e) => oe.value = e,
					label: N(Y)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: P(() => [oe.value ? (z(), B(R, { key: 0 }, [
					U(zS, {
						label: N(Y)("writing.keepFullTurns"),
						help: N(Y)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: P(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: N(n).tokenSaving.keepFullTurns,
							onChange: r[17] ||= (e) => se("keepFullTurns", e.target.value)
						}, null, 40, AC)]),
						_: 1
					}, 8, ["label", "help"]),
					U(zS, {
						label: N(Y)("writing.userInput"),
						help: N(Y)("writing.userInput.hint")
					}, {
						default: P(() => [U(pC, {
							modelValue: D.value,
							"onUpdate:modelValue": r[18] ||= (e) => D.value = e,
							options: E.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					D.value === "truncate" ? (z(), V(zS, {
						key: 0,
						label: N(Y)("writing.truncateUserAfter"),
						help: N(Y)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: P(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: N(n).tokenSaving.truncateUserAfter,
							onChange: r[19] ||= (e) => se("truncateUserAfter", e.target.value)
						}, null, 40, jC)]),
						_: 1
					}, 8, ["label", "help"])) : W("", !0)
				], 64)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(eS, {
				title: N(Y)("writing.cache"),
				icon: N(wb),
				help: N(Y)("writing.cache.hint")
			}, {
				actions: P(() => [U(PS, {
					modelValue: le.value,
					"onUpdate:modelValue": r[20] ||= (e) => le.value = e,
					label: N(Y)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: P(() => [le.value ? (z(), B(R, { key: 0 }, [U(zS, {
					label: N(Y)("writing.cacheTtl"),
					help: N(Y)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: P(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: N(n).cache.ttlMinutes,
						onChange: r[21] ||= (e) => ue("ttlMinutes", e.target.value)
					}, null, 40, MC)]),
					_: 1
				}, 8, ["label", "help"]), U(zS, {
					label: N(Y)("writing.cacheMaxDeferred"),
					help: N(Y)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: P(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: N(n).cache.maxDeferredTurns,
						onChange: r[22] ||= (e) => ue("maxDeferredTurns", e.target.value)
					}, null, 40, NC)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(eS, {
				title: N(Y)("config.sampling"),
				icon: N(jb),
				collapsible: "",
				open: !1
			}, {
				default: P(() => [
					(z(), B(R, null, L(de, (e) => (z(), B(R, { key: e.key }, [ge(e.key) ? (z(), V(zS, {
						key: 0,
						label: N(Y)(`sampling.${e.key}`)
					}, {
						default: P(() => [H("div", PC, [H("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: he.value[e.key],
							onInput: (t) => _e(e.key, ve(t))
						}, null, 40, FC), H("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: he.value[e.key],
							onChange: (t) => _e(e.key, ve(t))
						}, null, 40, IC)])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)),
					H("div", LC, [(z(), B(R, null, L(fe, (e) => (z(), B(R, { key: e }, [ge(e) ? (z(), V(zS, {
						key: 0,
						label: N(Y)(`sampling.${e}`)
					}, {
						default: P(() => [H("input", {
							class: "input",
							type: "number",
							value: he.value[e],
							onChange: (t) => _e(e, ve(t))
						}, null, 40, RC)]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)), ge("reasoning_effort") ? (z(), V(zS, {
						key: 0,
						label: N(Y)("sampling.reasoning_effort")
					}, {
						default: P(() => [H("select", {
							class: "input",
							value: he.value.reasoning_effort,
							onChange: r[23] ||= (e) => _e("reasoning_effort", e.target.value)
						}, [(z(), B(R, null, L(me, (e) => H("option", {
							key: e,
							value: e
						}, A(N(Y)(`effort.${e}`)), 9, BC)), 64))], 40, zC)]),
						_: 1
					}, 8, ["label"])) : W("", !0)]),
					(z(), B(R, null, L(pe, (e) => (z(), B(R, { key: e }, [ge(e) ? (z(), V(zS, {
						key: 0,
						label: N(Y)(`sampling.${e}`),
						inline: ""
					}, {
						default: P(() => [U(PS, {
							"model-value": !!he.value[e],
							"onUpdate:modelValue": (t) => _e(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), HC = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function UC(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: Y("config.transport"),
			options: t([...bs], (e) => Y(`transport.${e}`))
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
				label: X(e, "workflows", t.id, "name", t.name)
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
			options: t(HC, (e) => Y(`um.genType.${e}`))
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
var WC = (e) => e.modules.filter((e) => e.toggle === "user");
function GC(e) {
	let t = UC(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return WC(e).length && r.push({
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
function KC(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function qC(e, t) {
	return t === "module" ? WC(e).map((t) => ({
		value: t.id,
		label: X(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: X(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function JC(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: qC(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? X(e, "params", t.id, "label", t.label) : r;
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
			label: YC(e, t.id, n.value, n.label)
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
	return UC(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var YC = (e, t, n, r) => Sd(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), XC = {
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
function ZC(e, t) {
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
		let n = String(qC(e, t)[0]?.value ?? "");
		return QC(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return QC(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function QC(e, t, n) {
	let r = JC(e, n);
	return t.path && JC(e, t.path).kind === r.kind && XC[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function $C(e, t, n = "") {
	return e === "bool" ? Y(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? Y(`um.op.list.${t}`) : e === "enum" ? Y(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var ew = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(Y("um.or")) : t === void 0 ? "" : n(t);
};
function tw(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? Y("um.kw.input") : Y("um.kw.recentN", { n: t.depth ?? 3 })} ${Y(`um.kw.${t.op}`)} ${t.words.join(Y("um.or"))}`;
	let n = JC(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? Y("um.boolDesc", {
		label: n.label,
		value: $C(n.kind, t.op, t.path)
	}) : `${n.label} ${$C(n.kind, t.op)} ${ew(n, t.value)}`;
}
function nw(e, t) {
	let n = t.rules.filter(lu);
	return n.length ? n.map((t) => tw(e, t)).join(t.match === "any" ? `\n${Y("um.match.anyJoin")} ` : `\n${Y("um.match.allJoin")} `) : Y("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var rw = ["aria-label"], iw = { class: "um-picker-head" }, aw = { class: "small muted" }, ow = { class: "um-choice-text" }, sw = { class: "xs muted" }, cw = ["data-template", "onClick"], lw = { class: "um-choice-text" }, uw = {
	key: 0,
	class: "xs muted um-choice-desc"
}, dw = ["data-id"], fw = ["aria-label", "onPointerdown"], pw = ["onClick"], mw = { class: "um-row-name ellipsis" }, hw = { class: "um-row-meta xs muted ellipsis" }, gw = {
	key: 3,
	class: "faint small"
}, _w = /* @__PURE__ */ I({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => rp(n.preset)), a = G(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? X(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? X(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.map((e) => e.point))].map(o).concat(e.vars.map((e) => s(e.var))).join(" · "), l = (e) => bu(n.preset, e), u = (e) => Y("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(lu);
		function f(e, t) {
			e.enabled = t, q();
		}
		let p = G(() => $u(n.preset).map((e) => ({
			tpl: e,
			body: Td(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ M(!1), g = /* @__PURE__ */ M(null);
		function _() {
			m.value = !1;
			let e = sp(n.preset, Y("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function v(e) {
			m.value = !1;
			let t = cp(n.preset, Td(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function y() {
			if (!p.value.length) return _();
			m.value = !m.value, m.value && (await Un(), g.value?.querySelector(".um-choice")?.focus());
		}
		let b = /* @__PURE__ */ M(null);
		async function x(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await u_(Lu(e).modules);
				let { added: t, missing: i } = pp(n.preset, e);
				h(i ? "warning" : "success", i ? Y("um.importedMissing", {
					n: t.length,
					missing: i
				}) : Y("um.imported", { n: t.length }));
			} catch (e) {
				a_(e) ? h("info", e.message) : h("error", Y("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => Rg(`${n.preset.id}.ap-modules.json`, fp(n.preset)), ee = /* @__PURE__ */ M(null), te = /* @__PURE__ */ M(null);
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
			i.value[r]?.id !== t && dp(n.preset, t, r);
		}
		let re = () => {
			te.value = null;
		};
		return (t, n) => (z(), V(eS, {
			title: N(Y)("um.title"),
			help: N(Y)("um.help")
		}, {
			actions: P(() => [
				a.value ? (z(), V($, {
					key: 0,
					icon: N(ux),
					label: N(Y)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : W("", !0),
				i.value.length ? (z(), V($, {
					key: 1,
					icon: N(Tb),
					label: N(Y)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : W("", !0),
				a.value && i.value.length ? (z(), V($, {
					key: 2,
					icon: N(Yb),
					label: N(Y)("um.new"),
					active: m.value,
					small: "",
					align: "end",
					onClick: y
				}, null, 8, [
					"icon",
					"label",
					"active"
				])) : W("", !0)
			]),
			default: P(() => [
				m.value ? (z(), B("div", {
					key: 0,
					ref_key: "pickerEl",
					ref: g,
					class: "um-picker",
					role: "group",
					"aria-label": N(Y)("um.startFrom"),
					onKeydown: n[2] ||= ds(ls((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					H("div", iw, [H("span", aw, A(N(Y)("um.startFrom")), 1), U($, {
						icon: N(px),
						label: N(Y)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					H("button", {
						type: "button",
						class: "um-choice",
						onClick: _
					}, [U(N(kb)), H("span", ow, [H("span", null, A(N(Y)("um.blank")), 1), H("span", sw, A(N(Y)("um.blank.desc")), 1)])]),
					(z(!0), B(R, null, L(p.value, (e) => (z(), B("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => v(e.tpl)
					}, [U(N(Lb)), H("span", lw, [H("span", null, A(e.body.name), 1), e.body.description ? (z(), B("span", uw, A(e.body.description), 1)) : W("", !0)])], 8, cw))), 128))
				], 40, rw)) : W("", !0),
				i.value.length ? (z(), B("div", {
					key: 1,
					ref_key: "listEl",
					ref: ee,
					class: "um-list"
				}, [(z(!0), B(R, null, L(i.value, (t) => (z(), B("div", {
					key: t.id,
					class: k(["um-row", {
						off: !t.enabled,
						dragging: te.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (z(), B("span", {
						key: 0,
						class: "um-grip",
						"aria-label": N(Y)("um.reorder"),
						onPointerdown: (e) => C(e, t.id),
						onPointermove: ne,
						onPointerup: re,
						onPointercancel: re
					}, [U(N(Pb))], 40, fw)) : W("", !0),
					H("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [H("span", mw, A(t.name || N(Y)("um.untitled")), 1), H("span", hw, A(c(t) || N(Y)("um.noEntries")), 1)], 8, pw),
					l(t).length ? (z(), V(hx, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: P(() => [U(N(cx), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : W("", !0),
					d(t) ? (z(), V(hx, {
						key: 2,
						text: N(nw)(e.preset, t.trigger),
						align: "end"
					}, {
						default: P(() => [U(N(mx), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : W("", !0),
					U(PS, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, dw))), 128))], 512)) : a.value && !m.value ? (z(), B("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: y
				}, [U(N(Yb)), pa(A(N(Y)("um.new")), 1)])) : a.value ? W("", !0) : (z(), B("div", gw, A(N(Y)("um.noPoints")), 1)),
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
}), vw = ["title"], yw = ["aria-label", "onClick"], bw = ["placeholder"], xw = /* @__PURE__ */ I({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ri({
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
		let t = ci(e, "modelValue"), n = e, r = /* @__PURE__ */ M(""), i = /* @__PURE__ */ M(null);
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
			class: k(["chip", { mono: e.mono }])
		}, [H("span", {
			class: "ellipsis",
			title: t
		}, A(t), 9, vw), H("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: ls((e) => c(n), ["stop"])
		}, [U(N(px))], 8, yw)], 2))), 128)), F(H("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: k(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, bw), [[$o, r.value]])]));
	}
}), Sw = { class: "rule" }, Cw = { class: "rule-head" }, ww = ["value", "aria-label"], Tw = ["label"], Ew = ["value"], Dw = ["value"], Ow = ["value"], kw = ["value"], Aw = ["value"], jw = {
	key: 1,
	class: "grow"
}, Mw = {
	key: 0,
	class: "rule-body"
}, Nw = { class: "row wrap" }, Pw = {
	key: 0,
	class: "unit small muted"
}, Fw = ["value"], Iw = ["value"], Lw = { value: "any" }, Rw = { value: "none" }, zw = { class: "row kw-words" }, Bw = {
	key: 1,
	class: "rule-body"
}, Vw = ["value"], Hw = {
	key: 2,
	class: "rule-body"
}, Uw = ["value"], Ww = ["value"], Gw = { class: "row wrap option-chips" }, Kw = ["aria-pressed", "onClick"], qw = {
	key: 2,
	class: "row"
}, Jw = ["value"], Yw = ["value"], Xw = ["value"], Zw = ["list", "value"], Qw = ["value"], $w = {
	key: 3,
	class: "rule-error xs"
}, eT = /* @__PURE__ */ I({
	__name: "RuleRow",
	props: /*@__PURE__*/ ri({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ri(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = ci(e, "modelValue"), r = G(() => GC(t.preset)), i = G(() => KC(n.value)), a = G(() => qC(t.preset, i.value)), o = G(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = G(() => n.value.kind === "var" ? JC(t.preset, n.value.path) : null), c = G(() => hu(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = ZC(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = QC(t.preset, r, `${i}.${e}`);
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
		let g = G(() => s.value?.kind === "list" ? "list" : "bool"), _ = G(() => XC[g.value].map((e) => ({
			value: e,
			label: $C(g.value, e, n.value.path)
		}))), v = G(() => (s.value ? XC[s.value.kind] : []).map((e) => ({
			value: e,
			label: $C(s.value.kind, e)
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
		return (e, t) => (z(), B("div", Sw, [
			H("div", Cw, [
				H("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": N(Y)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(z(!0), B(R, null, L(r.value, (e) => (z(), B("optgroup", {
					key: e.label,
					label: e.label
				}, [(z(!0), B(R, null, L(e.subjects, (e) => (z(), B("option", {
					key: e.id,
					value: e.id
				}, A(e.label), 9, Ew))), 128))], 8, Tw))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (z(), B("option", {
					key: 0,
					value: i.value
				}, A(n.value.path), 9, Dw)) : W("", !0)], 40, ww),
				a.value.length ? (z(), B("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
					key: String(e.value),
					value: e.value
				}, A(e.label), 9, kw))), 128)), a.value.some((e) => String(e.value) === o.value) ? W("", !0) : (z(), B("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, A(o.value), 9, Aw))], 40, Ow)) : (z(), B("span", jw)),
				U($, {
					icon: N(px),
					label: N(Y)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (z(), B("div", Mw, [H("div", Nw, [
				U(pC, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (z(), B("label", Pw, [H("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? N(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, Fw), pa(" " + A(N(Y)("um.kw.messages")), 1)])) : W("", !0),
				H("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [H("option", Lw, A(N(Y)("um.kw.any")), 1), H("option", Rw, A(N(Y)("um.kw.none")), 1)], 40, Iw)
			]), H("div", zw, [U(xw, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": N(Y)("common.delete"),
				placeholder: n.value.regex ? N(Y)("um.kw.regexPlaceholder") : N(Y)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), U($, {
				icon: N(Qb),
				label: N(Y)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (z(), B("div", Bw, [H("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, Vw)])) : s.value ? (z(), B("div", Hw, [s.value.kind === "bool" || s.value.kind === "list" ? (z(), V(pC, {
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
			}, A(e.label), 9, Ww))), 128))], 40, Uw), H("div", Gw, [(z(!0), B(R, null, L(s.value.options, (e) => (z(), B("button", {
				key: String(e.value),
				type: "button",
				class: k(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, A(e.label), 11, Kw))), 128))])], 64)) : (z(), B("div", qw, [H("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(v.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, A(e.label), 9, Yw))), 128))], 40, Jw), s.value.kind === "number" ? (z(), B("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, Xw)) : (z(), B(R, { key: 1 }, [H("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, Zw), s.value.suggestions?.length ? (z(), B("datalist", {
				key: 0,
				id: l
			}, [(z(!0), B(R, null, L(s.value.suggestions, (e) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, Qw))), 128))])) : W("", !0)], 64))]))])) : W("", !0),
			c.value ? (z(), B("div", $w, A(c.value), 1)) : W("", !0)
		]));
	}
}), tT = { class: "trigger" }, nT = {
	key: 1,
	class: "always faint small"
}, rT = {
	key: 0,
	class: "rule-join xs faint"
}, iT = { class: "btn ghost add picker" }, aT = ["aria-label"], oT = ["label"], sT = ["value"], cT = /* @__PURE__ */ I({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ri({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = ci(e, "modelValue"), r = G(() => GC(t.preset)), i = /* @__PURE__ */ M(null), a = G(() => [{
			value: "all",
			label: Y("um.match.all")
		}, {
			value: "any",
			label: Y("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(ZC(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (z(), B("div", tT, [
			n.value.rules.length > 1 ? (z(), V(pC, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : W("", !0),
			n.value.rules.length ? W("", !0) : (z(), B("div", nT, A(N(Y)("um.always")), 1)),
			(z(!0), B(R, null, L(n.value.rules, (t, r) => (z(), B(R, { key: r }, [r > 0 ? (z(), B("div", rT, A(n.value.match === "any" ? N(Y)("um.match.anyJoin") : N(Y)("um.match.allJoin")), 1)) : W("", !0), U(eT, {
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
			H("label", iT, [
				U(N(Yb)),
				pa(A(N(Y)("um.addRule")) + " ", 1),
				H("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": N(Y)("um.addRule"),
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
				}, A(e.label), 9, sT))), 128))], 8, oT))), 128))], 40, aT)
			])
		]));
	}
}), lT = { class: "um-entry-head" }, uT = { class: "um-var-label grow ellipsis" }, dT = {
	key: 0,
	class: "um-warn xs"
}, fT = ["placeholder"], pT = ["onUpdate:modelValue", "placeholder"], mT = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], hT = [
	"value",
	"placeholder",
	"onInput"
], gT = ["id"], _T = ["value"], vT = /* @__PURE__ */ I({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => vu(n.preset, n.update.var)), a = G(() => i.value?.type !== n.update.type), o = G(() => i.value ? X(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = G(() => i.value && X(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = G(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = G(() => `ap-bv-${n.update.var}`);
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
		return (t, n) => (z(), B("div", { class: k(["um-entry", { lost: a.value }]) }, [
			H("div", lT, [
				U(N(cb), { class: "faint" }),
				H("span", uT, A(o.value), 1),
				U(Zx, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				U($, {
					icon: N(px),
					label: N(Y)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (z(), B("div", dT, [U(N(cx)), pa(A(N(Y)("um.bv.lost")), 1)])) : W("", !0),
			e.update.type === "string" ? F((z(), B("textarea", {
				key: 1,
				"onUpdate:modelValue": n[1] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: N(Y)("um.bv.append")
			}, null, 8, fT)), [[$o, e.update.text]]) : e.update.type === "list" ? (z(!0), B(R, { key: 2 }, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: "um-var-row list"
			}, [F(H("textarea", {
				"onUpdate:modelValue": (t) => e.update.items[n] = t,
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: N(Y)("um.bv.item")
			}, null, 8, pT), [[$o, e.update.items[n]]]), U($, {
				icon: N(px),
				label: N(Y)("um.removeEntry"),
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
				F(H("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: N(Y)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, mT), [[$o, t.key]]),
				H("textarea", {
					value: t.value ?? "",
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: c.value.has(t.key.trim()) ? N(Y)("um.bv.removes") : N(Y)("um.bv.value"),
					onInput: (e) => t.value = e.target.value
				}, null, 40, hT),
				U($, {
					icon: N(px),
					label: N(Y)("um.removeEntry"),
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
			}, null, 8, _T))), 128))], 8, gT)], 64)),
			e.update.type === "string" ? W("", !0) : (z(), B("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: d
			}, [U(N(Yb)), pa(A(e.update.type === "dict" ? N(Y)("um.bv.addKey") : N(Y)("um.bv.addItem")), 1)]))
		], 2));
	}
}), yT = { class: "um-editor" }, bT = { class: "um-head" }, xT = ["placeholder", "aria-label"], ST = { class: "um-entry-head" }, CT = ["onUpdate:modelValue", "aria-label"], wT = ["value"], TT = ["value"], ET = [
	"value",
	"aria-label",
	"onChange"
], DT = ["value"], OT = {
	key: 0,
	class: "um-warn xs"
}, kT = ["onUpdate:modelValue", "placeholder"], AT = {
	key: 1,
	class: "rule-error xs pre"
}, jT = {
	key: 0,
	class: "btn ghost add picker"
}, MT = ["aria-label"], NT = ["value"], PT = { class: "um-foot" }, FT = ["title"], IT = ["title"], LT = ["title"], RT = /* @__PURE__ */ I({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		lr(() => n.module, q, { deep: !0 });
		let i = /* @__PURE__ */ M(null);
		Vr(() => {
			n.module.entries.some((e) => e.text) || Un(() => i.value?.select());
		});
		let a = G(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: X(n.preset, "insertionPoints", e.id, "label", e.label),
			description: X(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !gu(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => Qc(e.text).errors, d = (e) => u(e).map((e) => e.line ? Y("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = op(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = G(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: X(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = G(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ M(null);
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
		let v = /* @__PURE__ */ M(!1);
		function y() {
			v.value ? (up(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = lp(n.preset, n.module.id, (e) => Y("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => Rg(`${n.preset.id}.${zg(n.module.name)}.ap-modules.json`, fp(n.preset, [n.module.id]));
		return (t, n) => (z(), B("div", yT, [
			H("header", bT, [
				U($, {
					icon: N(ab),
					label: N(Y)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				F(H("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: N(Y)("um.untitled"),
					"aria-label": N(Y)("um.name")
				}, null, 8, xT), [[$o, e.module.name]]),
				U(PS, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: N(Y)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			U(eS, {
				title: N(Y)("um.content"),
				help: N(Y)("um.content.help")
			}, {
				default: P(() => [(z(!0), B(R, null, L(e.module.entries, (t, n) => (z(), B("div", {
					key: t.id,
					class: k(["um-entry", { lost: s(t) }])
				}, [
					H("div", ST, [
						U(N(Bb), { class: "faint" }),
						F(H("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": N(Y)("um.point")
						}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
							key: e.id,
							value: e.id
						}, A(e.label), 9, wT))), 128)), s(t) ? (z(), B("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, A(N(Y)("um.pointMissing", { id: t.point })), 9, TT)) : W("", !0)], 8, CT), [[ns, t.point]]),
						U(Zx, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						H("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": N(Y)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(z(), B(R, null, L(c, (e) => H("option", {
							key: e,
							value: e
						}, A(N(Y)(`um.role.${e || "merge"}`)), 9, DT)), 64))], 40, ET),
						e.module.entries.length > 1 || e.module.vars.length ? (z(), V($, {
							key: 0,
							icon: N(px),
							label: N(Y)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : W("", !0)
					]),
					s(t) ? (z(), B("div", OT, [U(N(cx)), pa(A(N(Y)("um.pointLost")), 1)])) : W("", !0),
					F(H("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: N(Y)("um.text.placeholder")
					}, null, 8, kT), [[$o, t.text]]),
					u(t).length ? (z(), B("div", AT, A(d(t)), 1)) : W("", !0)
				], 2))), 128)), a.value.length ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [U(N(Yb)), pa(A(N(Y)("um.addEntry")), 1)])) : W("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (z(), V(eS, {
				key: 0,
				title: N(Y)("um.bv"),
				help: N(Y)("um.bv.help")
			}, {
				default: P(() => [(z(!0), B(R, null, L(e.module.vars, (t, n) => (z(), V(vT, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (z(), B("label", jT, [
					U(N(Yb)),
					pa(A(N(Y)("um.bv.add")) + " ", 1),
					H("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": N(Y)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= H("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (z(!0), B(R, null, L(h.value, (e) => (z(), B("option", {
						key: e.id,
						value: e.id
					}, A(e.label), 9, NT))), 128))], 40, MT)
				])) : W("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : W("", !0),
			U(eS, {
				title: N(Y)("um.trigger"),
				help: N(Y)("um.trigger.help")
			}, {
				default: P(() => [U(cT, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			H("footer", PT, [
				H("button", {
					type: "button",
					class: "btn ghost",
					title: N(Y)("um.export"),
					onClick: x
				}, [U(N(Tb)), H("span", null, A(N(Y)("um.export")), 1)], 8, FT),
				H("button", {
					type: "button",
					class: "btn ghost",
					title: N(Y)("um.duplicate"),
					onClick: b
				}, [U(N(Sb)), H("span", null, A(N(Y)("um.duplicate")), 1)], 8, IT),
				n[6] ||= H("span", { class: "grow" }, null, -1),
				H("button", {
					type: "button",
					class: k(["btn ghost danger", { armed: v.value }]),
					title: N(Y)("common.delete"),
					onClick: y
				}, [U(N(sx)), H("span", null, A(v.value ? N(Y)("um.confirmDelete") : N(Y)("common.delete")), 1)], 10, LT)
			])
		]));
	}
}), zT = {
	key: 0,
	class: "module-row"
}, BT = { class: "grow" }, VT = { class: "ellipsis" }, HT = ["aria-label"], UT = ["aria-checked", "onClick"], WT = { class: "grow" }, GT = { class: "grow" }, KT = { class: "ellipsis" }, qT = {
	key: 0,
	class: "empty"
}, JT = /* @__PURE__ */ I({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = cC(), i = G(() => t.value && n.value ? Pl(t.value, n.value) : {}), a = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = Ml(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : X(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : X(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? X(e, "groups", t, "label", r?.label ?? t) : Y("modules.other"),
					help: t && X(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => X(t.value, "modules", e.id, "name", e.name), s = (e) => X(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ M(null), g = /* @__PURE__ */ M(null), _ = G(() => t.value && h.value ? rp(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Un(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Un(() => y()?.scrollTo({ top: v }));
		}
		return lr(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !N(t) || !N(n) ? (z(), V(uC, { key: 0 })) : _.value ? (z(), B("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(z(), V(RT, {
			key: _.value.id,
			preset: N(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (z(), B("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			U(_w, {
				preset: N(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(z(!0), B(R, null, L(a.value, (e) => (z(), V(eS, {
				key: e.id,
				title: e.label,
				help: e.help
			}, Yr({
				default: P(() => [(z(!0), B(R, null, L(e.sets, (t) => (z(), B(R, { key: t.key }, [t.label ? (z(), B("div", zT, [H("span", BT, [H("span", VT, A(t.label), 1), U(Zx, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (z(), V(PS, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : W("", !0)])) : W("", !0), !t.optional || c(t) ? (z(), B("div", {
					key: 1,
					class: k(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(z(!0), B(R, null, L(t.modules, (e) => (z(), B("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: k(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= H("span", { class: "radio" }, null, -1),
					H("span", WT, A(o(e)), 1),
					U(Zx, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, UT))), 128))], 10, HT)) : W("", !0)], 64))), 128)), (z(!0), B(R, null, L(e.toggles, (e) => (z(), B("div", {
					key: e.id,
					class: "module-row"
				}, [H("span", GT, [H("span", KT, A(o(e)), 1), U(Zx, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), U(PS, {
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
				fn: P(() => [U(PS, {
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
			a.value.length ? W("", !0) : (z(), B("div", qT, A(N(Y)("modules.none")), 1))
		], 512));
	}
}), YT = ["value", "onChange"], XT = ["value"], ZT = {
	key: 2,
	class: "unit"
}, QT = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], $T = {
	key: 0,
	class: "small muted"
}, eE = [
	"list",
	"value",
	"placeholder",
	"onChange"
], tE = ["id"], nE = ["value"], rE = /* @__PURE__ */ I({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = cC(), i = G(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? X(e, "groups", t, "label", e.groups[t]?.label ?? t) : Y("writing.params"),
				help: t && X(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => X(t.value, "params", e.id, "label", e.label), o = (e) => X(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => Sd(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => _l(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !N(t) || !N(n) ? (z(), V(uC, { key: 0 })) : (z(!0), B(R, { key: 1 }, L(i.value, (e) => (z(), V(eS, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: N(ax)
		}, {
			default: P(() => [(z(!0), B(R, null, L(e.params, (e) => (z(), V(zS, {
				key: e.id,
				label: a(e),
				help: o(e)
			}, {
				default: P(() => [e.type === "select" ? (z(), B("select", {
					key: 0,
					class: "input",
					value: c(e),
					onChange: (t) => l(e, t.target.value)
				}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
					key: String(t.value),
					value: t.value
				}, A(s(e, t.value, t.label)), 9, XT))), 128))], 40, YT)) : e.type === "list" ? (z(), V(xw, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": N(Y)("common.delete"),
					placeholder: N(Y)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (z(), B("div", ZT, [H("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, QT), e.unit ? (z(), B("span", $T, A(e.unit), 1)) : W("", !0)])) : (z(), B(R, { key: 3 }, [H("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, eE), e.options?.length ? (z(), B("datalist", {
					key: 0,
					id: f(e)
				}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
					key: String(t.value),
					value: t.value
				}, A(s(e, t.value, t.label)), 9, nE))), 128))], 8, tE)) : W("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), iE = { class: "kv" }, aE = {
	key: 0,
	class: "kv-row"
}, oE = { class: "kv-key ellipsis" }, sE = { class: "kv-value pre small" }, cE = {
	key: 0,
	class: "kv-actions"
}, lE = {
	key: 1,
	class: "kv-edit col"
}, uE = ["placeholder"], dE = ["placeholder"], fE = { class: "row end" }, pE = {
	key: 0,
	class: "kv-edit col"
}, mE = ["placeholder"], hE = ["placeholder"], gE = { class: "row end" }, _E = {
	key: 1,
	class: "faint small kv-empty"
}, vE = /* @__PURE__ */ I({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean }
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ M(null), a = /* @__PURE__ */ M(""), o = /* @__PURE__ */ M("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (z(), B("div", iE, [
			(z(!0), B(R, null, L(e.entries, (t, l) => (z(), B(R, { key: l }, [i.value === l ? (z(), B("div", lE, [
				F(H("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: N(Y)("memory.key")
				}, null, 8, uE), [[$o, a.value]]),
				F(H("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: N(Y)("memory.content")
				}, null, 8, dE), [[$o, o.value]]),
				H("div", fE, [U($, {
					icon: N(px),
					label: N(Y)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: N(fb),
					label: N(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (z(), B("div", aE, [
				H("div", oE, A(l), 1),
				H("div", sE, A(t), 1),
				e.readonly ? W("", !0) : (z(), B("div", cE, [U($, {
					icon: N(Jb),
					label: N(Y)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), U($, {
					icon: N(sx),
					label: N(Y)("common.delete"),
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
			i.value === "" ? (z(), B("div", pE, [
				F(H("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: N(Y)("memory.key")
				}, null, 8, mE), [[$o, a.value]]),
				F(H("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: N(Y)("memory.content")
				}, null, 8, hE), [[$o, o.value]]),
				H("div", gE, [U($, {
					icon: N(px),
					label: N(Y)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: N(fb),
					label: N(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : W("", !0),
			!Object.keys(e.entries).length && i.value === null ? (z(), B("div", _E, A(N(Y)("memory.empty")), 1)) : W("", !0),
			!e.readonly && i.value === null ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [U(N(Yb)), pa(A(N(Y)("common.add")), 1)])) : W("", !0)
		]));
	}
}), yE = {
	key: 1,
	class: "faint small"
}, bE = {
	key: 0,
	class: "badge neutral"
}, xE = ["placeholder"], SE = {
	key: 1,
	class: "faint small"
}, CE = /* @__PURE__ */ I({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = cC(), r = G(() => n.value ? Qd(n.value) : null), i = G(() => (g_.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = G(() => (g_.chatRev, i.value ? zd() : {})), o = G(() => r.value ? Hd(r.value) : {}), s = G(() => (g_.chatRev, i.value ? Bd() : null));
		async function c(e, t) {
			await Vd({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), __();
		}
		async function l(e) {
			await Vd({
				type: "memory.delete",
				key: e,
				source: "user"
			}), __();
		}
		let u = (e, t) => r.value && Ud(r.value, "replace", e, t, "user"), d = (e) => r.value && Ud(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ M("");
		lr(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = G(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await Vd({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), __();
		}
		return (e, t) => !N(n) || !r.value ? (z(), V(uC, { key: 0 })) : (z(), B(R, { key: 1 }, [
			U(eS, {
				title: N(Y)("memory.chat"),
				icon: N(Vb),
				help: N(Y)("memory.chat.hint")
			}, {
				default: P(() => [i.value ? (z(), V(vE, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (z(), B("div", yE, A(N(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(eS, {
				title: N(Y)("memory.global"),
				icon: N(Nb),
				help: N(Y)("memory.global.hint")
			}, {
				actions: P(() => [U($, {
					icon: N(lx),
					label: N(Y)("common.undo"),
					small: "",
					align: "end",
					disabled: !N(Wd)(r.value),
					onClick: t[0] ||= (e) => N(Kd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), U($, {
					icon: N(Xb),
					label: N(Y)("common.redo"),
					small: "",
					align: "end",
					disabled: !N(Gd)(r.value),
					onClick: t[1] ||= (e) => N(qd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: P(() => [U(vE, {
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
			U(eS, {
				title: N(Y)("memory.recap"),
				icon: N(tx),
				help: N(Y)("memory.recap.hint")
			}, {
				actions: P(() => [s.value ? (z(), B("span", bE, "#0–" + A(s.value.coversUpTo), 1)) : W("", !0), i.value ? (z(), V($, {
					key: 1,
					icon: N(fb),
					label: N(Y)("common.save"),
					small: "",
					align: "end",
					disabled: !p.value,
					active: "",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : W("", !0)]),
				default: P(() => [i.value ? F((z(), B("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: N(Y)("memory.recap.empty")
				}, null, 8, xE)), [[$o, f.value]]) : (z(), B("div", SE, A(N(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), wE = { class: "row tight xs muted" }, TE = { class: "row" }, EE = {
	key: 0,
	class: "xs text-danger"
}, DE = { class: "row wrap xs muted" }, OE = { class: "badge neutral" }, kE = {
	key: 0,
	class: "badge neutral"
}, AE = { class: "badge neutral" }, jE = {
	key: 1,
	class: "badge warn"
}, ME = {
	key: 0,
	class: "row wrap xs muted"
}, NE = { class: "grow" }, PE = { key: 0 }, FE = ["onClick"], IE = { class: "grow mono" }, LE = { class: "xs muted" }, RE = { class: "row xs muted" }, zE = { class: "badge neutral" }, BE = { class: "pre mono scroll" }, VE = {
	key: 0,
	class: "xs faint region-msg"
}, HE = { key: 1 }, UE = ["onClick"], WE = { class: "grow mono" }, GE = { class: "xs muted" }, KE = {
	key: 0,
	class: "region-msg"
}, qE = { class: "pre mono scroll" }, JE = {
	key: 0,
	class: "xs faint"
}, YE = {
	key: 2,
	class: "xs text-warning"
}, XE = {
	key: 1,
	class: "faint small"
}, ZE = ["onClick"], QE = { class: "mono grow ellipsis" }, $E = {
	key: 0,
	class: "badge warn"
}, eD = { class: "xs muted" }, tD = { class: "xs muted" }, nD = { class: "row xs muted" }, rD = { class: "grow" }, iD = { class: "mono scroll" }, aD = { class: "row xs muted" }, oD = { class: "grow" }, sD = { class: "mono scroll" }, cD = {
	key: 0,
	class: "faint small"
}, lD = { class: "row xs" }, uD = { class: "badge neutral" }, dD = { class: "muted" }, fD = { class: "mono scroll" }, pD = {
	key: 0,
	class: "faint small"
}, mD = { class: "row xs" }, hD = { class: "badge neutral" }, gD = { class: "grow muted" }, _D = { class: "small" }, vD = {
	key: 0,
	class: "faint small"
}, yD = { class: "xs faint mono build" }, bD = /* @__PURE__ */ I({
	__name: "DebugTab",
	setup(t) {
		let n = G(() => Lp.log.find((e) => e.kind === "assembly")?.data), r = G(() => Lp.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ on(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ on({});
		lr(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (o[i] === void 0 && r) try {
					o[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let s = /* @__PURE__ */ M(null), c = (e) => typeof e == "string" ? l(e) : JSON.stringify(e, null, 2);
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
		}), g = G(() => Lp.log.filter((e) => e.kind !== "assembly")), _ = G(() => {
			g_.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of Sg(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (z(), B(R, null, [
			U(eS, {
				title: N(Y)("debug.dev"),
				icon: N(nx),
				help: N(Y)("debug.dev.hint")
			}, {
				actions: P(() => [H("span", wE, [H("span", { class: k(["dot status-dot", N(Kg).status]) }, null, 2), pa(A(N(Y)(`debug.dev.${N(Kg).status}`)), 1)])]),
				default: P(() => [U(zS, { label: N(Y)("debug.dev.url") }, {
					default: P(() => [H("div", TE, [F(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						$o,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), U(PS, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: N(Y)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), N(Kg).error ? (z(), B("span", EE, A(N(Kg).error), 1)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(eS, {
				title: N(Y)("debug.assembly"),
				icon: N(Ab),
				collapsible: ""
			}, {
				default: P(() => [n.value ? (z(), B(R, { key: 0 }, [
					H("div", DE, [
						H("span", OE, A(N(Y)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (z(), B("span", kE, A(n.value.workflow), 1)) : W("", !0),
						H("span", AE, A(n.value.origin), 1),
						n.value.dryRun ? (z(), B("span", jE, "dry run")) : W("", !0),
						t[3] ||= H("span", { class: "grow" }, null, -1),
						pa(A(u(n.value.at)), 1)
					]),
					r.value ? (z(), B("div", ME, [
						H("span", { class: k(["badge", r.value.reason ? "warn" : "neutral"]) }, A(r.value.reason ? N(Y)(`debug.cache.flush.${r.value.reason}`) : N(Y)("debug.cache.kept")), 3),
						H("span", NE, A(p(r.value)), 1),
						r.value === n.value.cache ? W("", !0) : (z(), B("span", PE, A(u(r.value.at)), 1))
					])) : W("", !0),
					H("div", null, [(z(!0), B(R, null, L(n.value.regions, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						U(N(mb), { class: k(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						H("span", IE, A(e.id), 1),
						H("span", LE, A(e.messages.length) + " · " + A(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + A(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, FE), i.has(e.id) ? (z(), B(R, { key: 0 }, [(z(!0), B(R, null, L(e.messages, (e, t) => (z(), B("div", {
						key: t,
						class: "region-msg"
					}, [H("div", RE, [H("span", zE, A(e.role), 1), pa(A(e.chars) + " ch", 1)]), H("div", BE, A(e.content), 1)]))), 128)), e.messages.length ? W("", !0) : (z(), B("div", VE, A(N(Y)("debug.emptyRegion")), 1))], 64)) : W("", !0)]))), 128))]),
					n.value.vars?.length ? (z(), B("div", HE, [(z(!0), B(R, null, L(n.value.vars, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						U(N(mb), { class: k(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						H("span", WE, A(e.id), 1),
						H("span", GE, A(e.text.length) + " ch", 1)
					], 8, UE), i.has(`var:${e.id}`) ? (z(), B("div", KE, [H("div", qE, A(e.text), 1), e.text ? W("", !0) : (z(), B("div", JE, A(N(Y)("debug.emptyRegion")), 1))])) : W("", !0)]))), 128))])) : W("", !0),
					n.value.warnings.length ? (z(), B("div", YE, A(n.value.warnings.join(" · ")), 1)) : W("", !0)
				], 64)) : (z(), B("div", XE, A(N(Y)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(eS, {
				title: N(Y)("debug.requests"),
				icon: N(bb),
				collapsible: ""
			}, {
				default: P(() => [(z(!0), B(R, null, L(N(Lp).requests, (e, t) => (z(), B("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [H("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					H("span", QE, A(e.genId) + " · #" + A(e.step), 1),
					e.error ? (z(), B("span", $E, A(N(Y)("debug.error")), 1)) : W("", !0),
					H("span", eD, A(f(e.usage)), 1),
					H("span", tD, A(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, ZE), s.value === t ? (z(), B(R, { key: 0 }, [
					H("div", nD, [H("span", rD, A(N(Y)("debug.request")), 1), U($, {
						icon: N(Cb),
						label: N(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", iD, A(c(e.request)), 1),
					H("div", aD, [H("span", oD, A(N(Y)("debug.response")), 1), U($, {
						icon: N(Cb),
						label: N(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", sD, A(e.error ?? c(e.response ?? "")), 1)
				], 64)) : W("", !0)]))), 128)), N(Lp).requests.length ? W("", !0) : (z(), B("div", cD, A(N(Y)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(eS, {
				title: N(Y)("debug.log"),
				icon: N(tx),
				collapsible: "",
				open: !1
			}, {
				actions: P(() => [U($, {
					icon: N(sx),
					label: N(Y)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => N(Lp).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: P(() => [(z(!0), B(R, null, L(g.value, (e, n) => (z(), B("div", {
					key: n,
					class: "req"
				}, [H("div", lD, [
					H("span", uD, A(e.kind), 1),
					t[4] ||= H("span", { class: "grow" }, null, -1),
					H("span", dD, A(u(e.at)), 1)
				]), H("pre", fD, A(c(e.data)), 1)]))), 128)), g.value.length ? W("", !0) : (z(), B("div", pD, A(N(Y)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(eS, {
				title: N(Y)("debug.annotations"),
				icon: N(Hb),
				help: N(Y)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: P(() => [(z(!0), B(R, null, L(_.value, (e, t) => (z(), B("div", {
					key: t,
					class: "req"
				}, [H("div", mD, [H("span", hD, "#" + A(e.mesId), 1), H("span", gD, "“" + A(e.quote) + "”", 1)]), H("div", _D, A(e.comment), 1)]))), 128)), _.value.length ? W("", !0) : (z(), B("div", vD, A(N(Y)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H("div", yD, "Advanced Preset " + A(N("1.9.0")) + " · " + A(N("112c3d13a9c49484")), 1)
		], 64));
	}
}), xD = ["aria-label"], SD = { class: "panel-head" }, CD = { class: "panel-logo" }, wD = { class: "grow" }, TD = { class: "panel-title ellipsis" }, ED = { class: "panel-sub ellipsis" }, DD = {
	class: "tabs",
	role: "tablist"
}, OD = [
	"title",
	"aria-selected",
	"onClick"
], kD = { class: "panel-body scroll" }, AD = /* @__PURE__ */ I({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Gb,
				view: oC
			},
			{
				id: "config",
				icon: ix,
				view: VC
			},
			{
				id: "modules",
				icon: sb,
				view: JT
			},
			{
				id: "writing",
				icon: qb,
				view: rE
			},
			{
				id: "memory",
				icon: lb,
				view: CE
			},
			{
				id: "debug",
				icon: ub,
				view: bD
			}
		], n = G(() => t.find((e) => e.id === g_.tab) ?? t[0]), r = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		}), i = G(() => {
			let e = y_.value;
			return e ? `v${e.version} · ${b_.value.config}` : Y("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && g_.panelOpen && (g_.panelOpen = !1);
		};
		return Vr(() => document.addEventListener("keydown", a)), Ur(() => {
			document.removeEventListener("keydown", a), qy(!1);
		}), lr(() => g_.panelOpen, (e) => {
			e && qy(!0);
		}, { immediate: !0 }), (e, a) => (z(), V(to, {
			name: "panel",
			onAfterLeave: a[2] ||= (e) => N(qy)(!1)
		}, {
			default: P(() => [N(g_).panelOpen ? (z(), B("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": N(Y)("app.name")
			}, [
				H("header", SD, [
					H("div", CD, [U(N(Ib))]),
					H("div", wD, [H("div", TD, A(N(y_) ? N(Cd)(N(y_)) : N(Y)("app.name")), 1), H("div", ED, A(i.value), 1)]),
					U(PS, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: N(Y)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					U($, {
						icon: N(px),
						label: N(Y)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => N(g_).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				H("nav", DD, [(z(), B(R, null, L(t, (e) => H("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: k(["tab", { on: e.id === N(g_).tab }]),
					title: N(Y)(`tab.${e.id}`),
					"aria-selected": e.id === N(g_).tab,
					onClick: (t) => N(g_).tab = e.id
				}, [(z(), V(Kr(e.icon))), H("span", null, A(N(Y)(`tab.${e.id}`)), 1)], 10, OD)), 64))]),
				H("main", kD, [(z(), V(Fr, null, [(z(), V(Kr(n.value.view), { key: n.value.id }))], 1024))])
			], 8, xD)) : W("", !0)]),
			_: 1
		}));
	}
}), jD = { class: "inline-drawer" }, MD = { class: "inline-drawer-toggle inline-drawer-header" }, ND = { class: "inline-drawer-content" }, PD = { class: "flex-container alignItemsCenter spaceBetween" }, FD = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, ID = { key: 0 }, LD = { class: "text_muted" }, RD = {
	key: 1,
	class: "text_muted"
}, zD = /* @__PURE__ */ I({
	__name: "SettingsDrawer",
	setup(e) {
		let t = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		});
		return (e, n) => (z(), B("div", jD, [H("div", MD, [H("b", null, A(N(Y)("app.name")), 1), n[3] ||= H("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), H("div", ND, [
			H("div", PD, [H("label", FD, [F(H("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[es, t.value]]), H("span", null, A(N(Y)("settings.enable")), 1)]), H("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => N(C_)(),
				onKeydown: n[2] ||= ds((e) => N(C_)(), ["enter"])
			}, [n[4] ||= H("i", { class: "fa-solid fa-layer-group" }, null, -1), H("span", null, A(N(Y)("panel.open")), 1)], 32)]),
			n[5] ||= H("hr", null, null, -1),
			H("h4", null, A(N(Y)("settings.preset")), 1),
			N(y_) ? (z(), B("div", ID, [pa(A(N(Cd)(N(y_))) + " ", 1), H("span", LD, "v" + A(N(y_).version) + " · " + A(N(b_).config), 1)])) : (z(), B("i", RD, A(N(Y)("settings.inactive")), 1))
		])]));
	}
}), BD = {
	key: 0,
	class: "preset-banner"
}, VD = { class: "preset-banner-text" }, HD = /* @__PURE__ */ I({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => N(y_) ? (z(), B("div", BD, [
			U(N(Ib), { class: "preset-banner-icon" }),
			H("span", VD, A(N(Y)("banner.usesAp")), 1),
			H("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => N(C_)()
			}, A(N(Y)("panel.open")), 1)
		])) : W("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function UD() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), hs(zD).mount(t);
}
function WD() {
	J_("ap-stages", Mx, ["mesid"]), J_("ap-cards", ES, ["mesid"]), J_("ap-dock", jS), J_("ap-panel", AD), J_("ap-preset-banner", HD), K_(), v_();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, v_);
	Yy(), UD(), zy(), Dy();
}
//#endregion
//#region src/index.ts
var GD = {
	version: "1.9.0",
	buildId: "112c3d13a9c49484",
	nextGeneration: (e) => kf(e),
	listPresets: () => ud().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => vf(),
	update: jg,
	togglePanel: (e) => {
		g_.panelOpen = e ?? !g_.panelOpen;
	},
	annotations: Tg
};
globalThis.advancedPresetInterceptor = Ip, window.AdvancedPreset = GD;
function KD(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function qD() {
	for (let { preset: e } of ud()) try {
		await Cf(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function JD() {
	let { eventSource: t, eventTypes: n } = e();
	K(), cg(), r_(), A_(), wg(), await i(), await cd();
	for (let { preset: e } of ud()) {
		let t = ff(e);
		t.length && zp("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => Cm(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => lg(e)), gg(), t.on(n.MESSAGE_RECEIVED, (e, t) => yg(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Bf.setPending(null), Bf.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Bf.sweep());
	let r = KD(() => {
		let e = vf(), t = e ? md(e) : void 0;
		t && Df(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await qD(), (async () => {
			for (let { preset: e } of ud()) await Wg(e);
		})(), mg({ reload: !0 }), Zg(), kg();
	};
	t.on(n.APP_READY, () => void a()), WD(), zp("init", {
		version: "1.9.0",
		build: "112c3d13a9c49484",
		enabled: K().enabled
	});
}
var YD = Ag, XD = Cy;
JD().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { YD as advancedPresetOnUpdate, XD as advancedPresetRegisterChatSurface };

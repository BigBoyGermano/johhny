(() => {
	var e, t, i, n, r = {
			5: (e, t, i) => {
				var n, r, o;
				! function (i, a) {
					if (i) {
						var s = {}
							, d = i.TraceKit
							, c = [].slice
							, l = "?"
							, A = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
						s.noConflict = function () {
							return i.TraceKit = d, s
						}, s.wrap = function (e) {
							return function () {
								try {
									return e.apply(this, arguments)
								}
								catch (e) {
									throw s.report(e), e
								}
							}
						}, s.report = function () {
							var e, t, n, r, o = []
								, a = null
								, d = null;
							
							function c(e, t, i) {
								var n = null;
								if (!t || s.collectWindowErrors) {
									for (var r in o)
										if (u(o, r)) try {
											o[r](e, t, i)
										}
									catch (e) {
										n = e
									}
									if (n) throw n
								}
							}
							
							function l(t, i, n, r, o) {
								if (d) s.computeStackTrace.augmentStackTraceWithInitialElement(d, i, n, t), h();
								else if (o) c(s.computeStackTrace(o), !0, o);
								else {
									var a, l = {
											url: i
											, line: n
											, column: r
										}
										, u = t;
									if ("[object String]" === {}.toString.call(t)) {
										var p = t.match(A);
										p && (a = p[1], u = p[2])
									}
									l.func = s.computeStackTrace.guessFunctionName(l.url, l.line), l.context = s.computeStackTrace.gatherContext(l.url, l.line), c({
										name: a
										, message: u
										, mode: "onerror"
										, stack: [l]
									}, !0, null)
								}
								return !!e && e.apply(this, arguments)
							}
							
							function p(e) {
								c(s.computeStackTrace(e.reason), !0, e.reason)
							}
							
							function h() {
								var e = d
									, t = a;
								d = null, a = null, c(e, !1, t)
							}
							
							function m(e) {
								if (d) {
									if (a === e) return;
									h()
								}
								var t = s.computeStackTrace(e);
								throw d = t, a = e, setTimeout((function () {
									a === e && h()
								}), t.incomplete ? 2e3 : 0), e
							}
							return m.subscribe = function (a) {
								! function () {
									if (!0 === t) return;
									e = i.onerror, i.onerror = l, t = !0
								}()
								, function () {
									if (!0 === r) return;
									n = i.onunhandledrejection, i.onunhandledrejection = p, r = !0
								}(), o.push(a)
							}, m.unsubscribe = function (a) {
								for (var s = o.length - 1; s >= 0; --s) o[s] === a && o.splice(s, 1);
								0 === o.length && (t && (i.onerror = e, t = !1), r && (i.onunhandledrejection = n, r = !1))
							}, m
						}(), s.computeStackTrace = function () {
							var e = !1
								, t = {};
							
							function n(e) {
								if ("string" != typeof e) return [];
								if (!u(t, e)) {
									var n = ""
										, r = "";
									try {
										r = i.document.domain
									}
									catch (e) {}
									var o = /(.*)\:\/\/([^:\/]+)([:\d]*)\/{0,1}([\s\S]*)/.exec(e);
									o && o[2] === r && (n = function (e) {
										if (!s.remoteFetching) return "";
										try {
											var t = function () {
												try {
													return new i.XMLHttpRequest
												}
												catch (e) {
													return new i.ActiveXObject("Microsoft.XMLHTTP")
												}
											}();
											return t.open("GET", e, !1), t.send(""), t.responseText
										}
										catch (e) {
											return ""
										}
									}(e)), t[e] = n ? n.split("\n") : []
								}
								return t[e]
							}
							
							function r(e, t) {
								var i, r = /function ([^(]*)\(([^)]*)\)/
									, o = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/
									, a = ""
									, s = n(e);
								if (!s.length) return l;
								for (var d = 0; d < 10; ++d)
									if (!p(a = s[t - d] + a)) {
										if (i = o.exec(a)) return i[1];
										if (i = r.exec(a)) return i[1]
									} return l
							}
							
							function o(e, t) {
								var i = n(e);
								if (!i.length) return null;
								var r = []
									, o = Math.floor(s.linesOfContext / 2)
									, a = o + s.linesOfContext % 2
									, d = Math.max(0, t - o - 1)
									, c = Math.min(i.length, t + a - 1);
								t -= 1;
								for (var l = d; l < c; ++l) p(i[l]) || r.push(i[l]);
								return r.length > 0 ? r : null
							}
							
							function a(e) {
								return e.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
							}
							
							function d(e) {
								return a(e)
									.replace("<", "(?:<|&lt;)")
									.replace(">", "(?:>|&gt;)")
									.replace("&", "(?:&|&amp;)")
									.replace('"', '(?:"|&quot;)')
									.replace(/\s+/g, "\\s+")
							}
							
							function c(e, t) {
								for (var i, r, o = 0, a = t.length; o < a; ++o)
									if ((i = n(t[o]))
										.length && (i = i.join("\n"), r = e.exec(i))) return {
										url: t[o]
										, line: i.substring(0, r.index)
											.split("\n")
											.length
										, column: r.index - i.lastIndexOf("\n", r.index) - 1
									};
								return null
							}
							
							function A(e, t, i) {
								var r, o = n(t)
									, s = new RegExp("\\b" + a(e) + "\\b");
								return i -= 1, o && o.length > i && (r = s.exec(o[i])) ? r.index : null
							}
							
							function h(e) {
								if (!p(i && i.document)) {
									for (var t, n, r, o, s = [i.location.href], l = i.document.getElementsByTagName("script"), A = "" + e, u = 0; u < l.length; ++u) {
										var h = l[u];
										h.src && s.push(h.src)
									}
									if (r = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(A)) {
										var m = r[1] ? "\\s+" + r[1] : ""
											, g = r[2].split(",")
											.join("\\s*,\\s*");
										t = a(r[3])
											.replace(/;$/, ";?"), n = new RegExp("function" + m + "\\s*\\(\\s*" + g + "\\s*\\)\\s*{\\s*" + t + "\\s*}")
									}
									else n = new RegExp(a(A)
										.replace(/\s+/g, "\\s+"));
									if (o = c(n, s)) return o;
									if (r = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(A)) {
										var v = r[1];
										if (t = d(r[2]), o = c(n = new RegExp("on" + v + "=[\\'\"]\\s*" + t + "\\s*[\\'\"]", "i"), s[0])) return o;
										if (o = c(n = new RegExp(t), s)) return o
									}
									return null
								}
							}
							
							function m(e) {
								if (!e.stack) return null;
								for (var t, i, n, a = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, s = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i, d = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, u = /\((\S*)(?::(\d+))(?::(\d+))\)/, h = e.stack.split("\n"), m = [], g = /^(.*) is undefined$/.exec(e.message), v = 0, f = h.length; v < f; ++v) {
									if (i = a.exec(h[v])) {
										var b = i[2] && 0 === i[2].indexOf("native");
										i[2] && 0 === i[2].indexOf("eval") && (t = u.exec(i[2])) && (i[2] = t[1], i[3] = t[2], i[4] = t[3]), n = {
											url: b ? null : i[2]
											, func: i[1] || l
											, args: b ? [i[2]] : []
											, line: i[3] ? +i[3] : null
											, column: i[4] ? +i[4] : null
										}
									}
									else if (i = d.exec(h[v])) n = {
										url: i[2]
										, func: i[1] || l
										, args: []
										, line: +i[3]
										, column: i[4] ? +i[4] : null
									};
									else {
										if (!(i = s.exec(h[v]))) continue;
										i[3] && i[3].indexOf(" > eval") > -1 && (t = c.exec(i[3])) ? (i[3] = t[1], i[4] = t[2], i[5] = null) : 0 !== v || i[5] || p(e.columnNumber) || (m[0].column = e.columnNumber + 1), n = {
											url: i[3]
											, func: i[1] || l
											, args: i[2] ? i[2].split(",") : []
											, line: i[4] ? +i[4] : null
											, column: i[5] ? +i[5] : null
										}
									}!n.func && n.line && (n.func = r(n.url, n.line)), n.context = n.line ? o(n.url, n.line) : null, m.push(n)
								}
								return m.length ? (m[0] && m[0].line && !m[0].column && g && (m[0].column = A(g[1], m[0].url, m[0].line)), {
									mode: "stack"
									, name: e.name
									, message: e.message
									, stack: m
								}) : null
							}
							
							function g(e, t, i, n) {
								var a = {
									url: t
									, line: i
								};
								if (a.url && a.line) {
									e.incomplete = !1, a.func || (a.func = r(a.url, a.line)), a.context || (a.context = o(a.url, a.line));
									var s = / '([^']+)' /.exec(n);
									if (s && (a.column = A(s[1], a.url, a.line)), e.stack.length > 0 && e.stack[0].url === a.url) {
										if (e.stack[0].line === a.line) return !1;
										if (!e.stack[0].line && e.stack[0].func === a.func) return e.stack[0].line = a.line, e.stack[0].context = a.context, !1
									}
									return e.stack.unshift(a), e.partial = !0, !0
								}
								return e.incomplete = !0, !1
							}
							
							function v(e, t) {
								for (var i, n, o, a = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, d = [], c = {}, u = !1, p = v.caller; p && !u; p = p.caller)
									if (p !== f && p !== s.report) {
										if (n = {
												url: null
												, func: l
												, args: []
												, line: null
												, column: null
											}, p.name ? n.func = p.name : (i = a.exec(p.toString())) && (n.func = i[1]), void 0 === n.func) try {
											n.func = i.input.substring(0, i.input.indexOf("{"))
										}
										catch (e) {}
										if (o = h(p)) {
											n.url = o.url, n.line = o.line, n.func === l && (n.func = r(n.url, n.line));
											var m = / '([^']+)' /.exec(e.message || e.description);
											m && (n.column = A(m[1], o.url, o.line))
										}
										c["" + p] ? u = !0 : c["" + p] = !0, d.push(n)
									} t && d.splice(0, t);
								var b = {
									mode: "callers"
									, name: e.name
									, message: e.message
									, stack: d
								};
								return g(b, e.sourceURL || e.fileName, e.line || e.lineNumber, e.message || e.description), b
							}
							
							function f(t, a) {
								var s = null;
								a = null == a ? 0 : +a;
								try {
									if (s = function (e) {
											var t = e.stacktrace;
											if (t) {
												for (var i, n = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i, a = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i, s = t.split("\n"), d = [], c = 0; c < s.length; c += 2) {
													var l = null;
													if ((i = n.exec(s[c])) ? l = {
															url: i[2]
															, line: +i[1]
															, column: null
															, func: i[3]
															, args: []
														} : (i = a.exec(s[c])) && (l = {
															url: i[6]
															, line: +i[1]
															, column: +i[2]
															, func: i[3] || i[4]
															, args: i[5] ? i[5].split(",") : []
														}), l) {
														if (!l.func && l.line && (l.func = r(l.url, l.line)), l.line) try {
															l.context = o(l.url, l.line)
														}
														catch (e) {}
														l.context || (l.context = [s[c + 1]]), d.push(l)
													}
												}
												return d.length ? {
													mode: "stacktrace"
													, name: e.name
													, message: e.message
													, stack: d
												} : null
											}
										}(t), s) return s
								}
								catch (t) {
									e
								}
								try {
									if (s = m(t)) return s
								}
								catch (t) {
									e
								}
								try {
									if (s = function (e) {
											var t = e.message.split("\n");
											if (t.length < 4) return null;
											var a, s = /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i
												, l = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i
												, A = /^\s*Line (\d+) of function script\s*$/i
												, p = []
												, h = i && i.document && i.document.getElementsByTagName("script")
												, m = [];
											for (var g in h) u(h, g) && !h[g].src && m.push(h[g]);
											for (var v = 2; v < t.length; v += 2) {
												var f = null;
												if (a = s.exec(t[v])) f = {
													url: a[2]
													, func: a[3]
													, args: []
													, line: +a[1]
													, column: null
												};
												else if (a = l.exec(t[v])) {
													f = {
														url: a[3]
														, func: a[4]
														, args: []
														, line: +a[1]
														, column: null
													};
													var b = +a[1]
														, k = m[a[2] - 1];
													if (k) {
														var y = n(f.url);
														if (y) {
															var w = (y = y.join("\n"))
																.indexOf(k.innerText);
															w >= 0 && (f.line = b + y.substring(0, w)
																.split("\n")
																.length)
														}
													}
												}
												else if (a = A.exec(t[v])) {
													var Z = i.location.href.replace(/#.*$/, "")
														, I = c(new RegExp(d(t[v + 1])), [Z]);
													f = {
														url: Z
														, func: ""
														, args: []
														, line: I ? I.line : a[1]
														, column: null
													}
												}
												if (f) {
													f.func || (f.func = r(f.url, f.line));
													var S = o(f.url, f.line)
														, E = S ? S[Math.floor(S.length / 2)] : null;
													S && E.replace(/^\s*/, "") === t[v + 1].replace(/^\s*/, "") ? f.context = S : f.context = [t[v + 1]], p.push(f)
												}
											}
											return p.length ? {
												mode: "multiline"
												, name: e.name
												, message: t[0]
												, stack: p
											} : null
										}(t), s) return s
								}
								catch (t) {
									e
								}
								try {
									if (s = v(t, a + 1)) return s
								}
								catch (t) {
									e
								}
								return {
									name: t.name
									, message: t.message
									, mode: "failed"
								}
							}
							return f.augmentStackTraceWithInitialElement = g, f.computeStackTraceFromStackProp = m, f.guessFunctionName = r, f.gatherContext = o, f.ofCaller = function (e) {
								e = 1 + (null == e ? 0 : +e);
								try {
									throw new Error
								}
								catch (t) {
									return f(t, e + 1)
								}
							}, f.getSource = n, f
						}(), s.extendToAsynchronousCallbacks = function () {
							var e = function (e) {
								var t = i[e];
								i[e] = function () {
									var e = c.call(arguments)
										, i = e[0];
									return "function" == typeof i && (e[0] = s.wrap(i)), t.apply ? t.apply(this, e) : t(e[0], e[1])
								}
							};
							e("setTimeout"), e("setInterval")
						}, s.remoteFetching || (s.remoteFetching = !0), s.collectWindowErrors || (s.collectWindowErrors = !0), (!s.linesOfContext || s.linesOfContext < 1) && (s.linesOfContext = 11), r = [], void 0 === (o = "function" == typeof (n = s) ? n.apply(t, r) : n) || (e.exports = o)
					}
					
					function u(e, t) {
						return Object.prototype.hasOwnProperty.call(e, t)
					}
					
					function p(e) {
						return void 0 === e
					}
				}("undefined" != typeof window ? window : i.g)
			}
			, 583: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => n
				});
				const n = {
					ready: "pokiAppReady"
					, adblocked: "pokiAppAdblocked"
					, ads: {
						completed: "pokiAdsCompleted"
						, error: "pokiAdsError"
						, impression: "pokiAdsImpression"
						, durationChange: "pokiAdsDurationChange"
						, limit: "pokiAdsLimit"
						, ready: "pokiAdsReady"
						, requested: "pokiAdsRequested"
						, prebidRequested: "pokiAdsPrebidRequested"
						, skipped: "pokiAdsSkipped"
						, started: "pokiAdsStarted"
						, stopped: "pokiAdsStopped"
						, busy: "pokiAdsBusy"
						, position: {
							preroll: "PP"
							, midroll: "PM"
							, rewarded: "PR"
							, display: "DP"
						}
						, video: {
							clicked: "pokiVideoAdsClicked"
							, firstQuartile: "pokiVideoAdsFirstQuartile"
							, midPoint: "pokiVideoAdsMidPoint"
							, thirdQuartile: "pokiVideoAdsThirdQuartile"
							, error: "pokiVideoAdsError"
							, loaderError: "pokiVideoAdsLoaderError"
							, paused: "pokiVideoAdsPauseTriggered"
							, resumed: "pokiVideoAdsResumedTriggered"
							, progress: "pokiVideoAdsProgress"
							, buffering: "pokiVideoAdsBuffering"
							, startHouseAdFlow: "pokiVideoAdsStartHouseAdFlow"
						}
						, display: {
							error: "pokiDisplayAdsError"
						}
					}
					, info: {
						messages: {
							timeLimit: "The ad-request was not processed, because of a time constraint"
							, prerollLimit: "The ad-request was cancelled, because we're not allowed to show a preroll"
							, disabled: "The ad-request was cancelled, because we've disabled this format for this specific configuration"
						}
					}
					, message: {
						event: "pokiMessageEvent"
						, sdkDetails: "pokiMessageSdkDetails"
						, setPokiURLParams: "pokiMessageSetPokiURLParams"
						, sendGameScreenshot: "pokiMessageSendScreenshot"
						, sendGameRawScreenshot: "pokiMessageSendRawScreenshot"
						, sendUploadScreenshot: "pokiMessageSendUploadScreenshot"
						, sendCommand: "pokiMessageSendCommand"
					}
					, tracking: {
						custom: "pokiTrackingCustom"
						, debugTrueInProduction: "pokiMessageDebugTrueProduction"
						, screen: {
							gameplayStart: "pokiTrackingScreenGameplayStart"
							, gameplayStop: "pokiTrackingScreenGameplayStop"
							, gameLoadingFinished: "pokiTrackingScreenGameLoadingFinished"
							, commercialBreak: "pokiTrackingScreenCommercialBreak"
							, rewardedBreak: "pokiTrackingScreenRewardedBreak"
							, firstRound: "pokiTrackingScreenFirstRound"
							, roundStart: "pokiTrackingScreenRoundStart"
							, roundEnd: "pokiTrackingScreenRoundEnd"
							, displayAd: "pokiTrackingScreenDisplayAdRequest"
							, destroyAd: "pokiTrackingScreenDisplayAdDestroy"
							, playerActive: "pokiTrackingScreenPlayerActive"
						}
						, playtest: {
							showModal: "pokiTrackingPlaytestShowModal"
							, accepted: "pokiTrackingPlaytestAccepted"
							, rejected: "pokiTrackingPlaytestRejected"
							, noCanvas: "pokiTrackingPlaytestNoCanvas"
							, starting: "pokiTrackingPlaytestStarting"
							, connected: "pokiTrackingPlaytestConnected"
						}
						, sdk: {
							status: {
								initialized: "pokiTrackingSdkStatusInitialized"
								, failed: "pokiTrackingSdkStatusFailed"
							}
						}
						, ads: {
							status: {
								busy: "pokiTrackingAdsStatusBusy"
								, completed: "pokiTrackingAdsStatusCompleted"
								, error: "pokiTrackingAdsStatusError"
								, impression: "pokiTrackingAdsStatusImpression"
								, limit: "pokiTrackingAdsStatusLimit"
								, ready: "pokiTrackingAdsStatusReady"
								, requested: "pokiTrackingAdsStatusRequested"
								, prebidRequested: "pokiTrackingAdsStatusPrebidRequested"
								, skipped: "pokiTrackingAdsStatusSkipped"
								, started: "pokiTrackingAdsStatusStarted"
								, buffering: "pokiTrackingAdsStatusBuffering"
							}
							, video: {
								clicked: "pokiTrackingAdsVideoClicked"
								, error: "pokiTrackingAdsVideoError"
								, loaderError: "pokiTrackingAdsVideoLoaderError"
								, progress: "pokiTrackingAdsVideoProgress"
								, paused: "pokiTrackingAdsVideoPaused"
								, resumed: "pokiTrackingAdsVideoResumed"
							}
							, display: {
								requested: "pokiTrackingScreenDisplayAdRequested"
								, impression: "pokiTrackingScreenDisplayAdImpression"
							}
							, rewardedWeb: {
								request: "pokiTrackingRewardedWebRequest"
								, ready: "pokiTrackingRewardedWebReady"
								, impression: "pokiTrackingRewardedWebImpression"
								, closedGranted: "pokiTrackingRewardedWebClosedGranted"
								, closedDeclined: "pokiTrackingRewardedWebclosedDeclined"
								, empty: "pokiTrackingRewardedWebEmpty"
							}
						}
					}
				}
			}
			, 968: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => Zt
				});
				var n = i(5)
					, r = i.n(n)
					, o = i(583)
					, a = i(453)
					, s = i(888)
					, d = i(298)
					, c = window.location.hostname;
				
				function l(e) {
					var t = new RegExp(e + "=([^;]+)(?:;|$)")
						.exec(document.cookie);
					return t ? t[1] : ""
				}
				
				function A(e, t) {
					document.cookie = e + "=" + t + "; path=/; samesite=none; secure; max-age=15552000; domain=" + c
				}
				c.endsWith("poki-gdn.com") && (c = "poki-gdn.com");
				var u = function (e, t, i, n) {
						return new(i || (i = Promise))((function (r, o) {
							function a(e) {
								try {
									d(n.next(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function s(e) {
								try {
									d(n.throw(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function d(e) {
								var t;
								e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function (e) {
										e(t)
									})))
									.then(a, s)
							}
							d((n = n.apply(e, t || []))
								.next())
						}))
					}
					, p = function (e, t) {
						var i, n, r, o, a = {
							label: 0
							, sent: function () {
								if (1 & r[0]) throw r[1];
								return r[1]
							}
							, trys: []
							, ops: []
						};
						return o = {
							next: s(0)
							, throw: s(1)
							, return: s(2)
						}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
							return this
						}), o;
						
						function s(o) {
							return function (s) {
								return function (o) {
									if (i) throw new TypeError("Generator is already executing.");
									for (; a;) try {
										if (i = 1, n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, o[1]))
											.done) return r;
										switch (n = 0, r && (o = [2 & o[0], r.value]), o[0]) {
										case 0:
										case 1:
											r = o;
											break;
										case 4:
											return a.label++, {
												value: o[1]
												, done: !1
											};
										case 5:
											a.label++, n = o[1], o = [0];
											continue;
										case 7:
											o = a.ops.pop(), a.trys.pop();
											continue;
										default:
											if (!(r = a.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
												a = 0;
												continue
											}
											if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
												a.label = o[1];
												break
											}
											if (6 === o[0] && a.label < r[1]) {
												a.label = r[1], r = o;
												break
											}
											if (r && a.label < r[2]) {
												a.label = r[2], a.ops.push(o);
												break
											}
											r[2] && a.ops.pop(), a.trys.pop();
											continue
										}
										o = t.call(e, a)
									}
									catch (e) {
										o = [6, e], n = 0
									}
									finally {
										i = r = 0
									}
									if (5 & o[0]) throw o[1];
									return {
										value: o[0] ? o[1] : void 0
										, done: !0
									}
								}([o, s])
							}
						}
					}
					, h = function (e, t, i) {
						if (i || 2 === arguments.length)
							for (var n, r = 0, o = t.length; r < o; r++) !n && r in t || (n || (n = Array.prototype.slice.call(t, 0, r)), n[r] = t[r]);
						return e.concat(n || Array.prototype.slice.call(t))
					}
					, m = "poki_gcuid"
					, g = l(m);
				const v = function () {
					function e() {}
					return e.collectAndLog = function () {
						return u(this, void 0, void 0, (function () {
							var e, t, i, n, r;
							return p(this, (function (o) {
								switch (o.label) {
								case 0:
									return o.trys.push([0, 5, , 6]), [4, window.cookieStore.getAll()];
								case 1:
									return e = o.sent(), window.indexedDB.databases ? [4, window.indexedDB.databases()] : [3, 3];
								case 2:
									return i = o.sent(), [3, 4];
								case 3:
									i = [], o.label = 4;
								case 4:
									return t = i, n = h(h(h([], e.map((function (e) {
												return {
													name: e.name
													, expire_seconds: Math.round((e.expires - Date.now()) / 1e3)
													, type: "cookie"
													, domain: e.domain
												}
											})), !0), Object.keys(window.localStorage)
											.map((function (e) {
												return {
													name: e
													, expire_seconds: 15552e3
													, type: "localStorage"
												}
											})), !0), t.map((function (e) {
											return {
												name: e.name
												, expire_seconds: 0
												, type: "idb"
											}
										})), !0), r = {
											cookies: n
											, p4d_game_id: s.Z.gameID
											, user_id: g
										}, window.fetch("https://t.poki.io/game-cookies", {
											method: "post"
											, body: JSON.stringify(r)
										})
										.catch(), [3, 6];
								case 5:
									return o.sent(), [3, 6];
								case 6:
									return [2]
								}
							}))
						}))
					}, e.trackSavegames = function () {
						window.cookieStore && window.cookieStore.getAll && s.Z.gameID && (Math.random() > .01 || navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") <= -1 || (g || (g = Math.random()
							.toString(36)
							.substr(2, 9), A(m, g)), e.collectAndLog(), setInterval(e.collectAndLog, 12e4)))
					}, e
				}();
				
				function f() {
					if (document.body && document.body.appendChild) {
						var e = document.createElement("iframe");
						e.style.display = "none", document.body.appendChild(e), e.contentWindow && (window.pokiKeysChanged = new Map, e.contentWindow.document.open(), e.contentWindow.document.write("<script>\nconst lsKey = 'poki_lsexpire';\nconst lifetime = 1000*60*60*24*30*6;\n\nwindow.addEventListener('storage', function(event) {\n\ttry {\n\t\tconst key = event.key;\n\n\t\t// key is null when localStorage.clear() is called.\n\t\tif (key === null) {\n\t\t\tlocalStorage.removeItem(lsKey);\n\t\t\treturn;\n\t\t}\n\n\t\tif (key === lsKey) return;\n\n\t\tconst updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\n\t\t// newValue is null when localStorage.removeItem() is called.\n\t\tif (event.newValue === null) {\n\t\t\tdelete updates[key];\n\n\t\t\t// window.parent is the game itself. This code is executed in\n\t\t\t// an iframe without src which makes it the same context as it's parent\n\t\t\t// which makes it save to access the parent's properties.\n\t\t\twindow.parent.pokiKeysChanged.set(key, 'remove');\n\t\t} else {\n\t\t\tupdates[key] = Date.now();\n\t\t\twindow.parent.pokiKeysChanged.set(key, 'set');\n\t\t}\n\t\tlocalStorage.setItem(lsKey, JSON.stringify(updates));\n\t} catch (e) {}\n});\n\nfunction expire() {\n\tconst updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\tconst expireBefore = Date.now() - lifetime;\n\tvar removed = false;\n\n\tObject.keys(updates).map(function(key) {\n\t\tif (updates[key] < expireBefore) {\n\t\t\tlocalStorage.removeItem(key);\n\t\t\tdelete updates[key];\n\t\t\tremoved = true;\n\t\t}\n\t});\n\n\tif (removed) {\n\t\tlocalStorage.setItem(lsKey, JSON.stringify(updates));\n\t}\n}\n\ntry {\n\texpire();\n} catch (e) {}\n<\/script>"), e.contentWindow.document.close())
					}
					else document.addEventListener("DOMContentLoaded", f)
				}
				var b = function () {
						s.Z.gdprApplies && (a.Z.setRequireConsent(!0), function () {
							if (!window.__tcfapi) {
								var e = window.top
									, t = {};
								window.__tcfapi = function (i, n, r, o) {
									var a = "" + Math.random()
										, s = {
											__tcfapiCall: {
												command: i
												, parameter: o
												, version: n
												, callId: a
											}
										};
									t[a] = r, e.postMessage(s, "*")
								}, window.addEventListener("message", (function (e) {
									var i = {};
									try {
										i = "string" == typeof e.data ? JSON.parse(e.data) : e.data
									}
									catch (e) {}
									var n = i.__tcfapiReturn;
									n && "function" == typeof t[n.callId] && (t[n.callId](n.returnValue, n.success), t[n.callId] = null)
								}), !1)
							}
						}()), s.Z.ccpaApplies && function () {
							if (!window.__uspapi) {
								var e = window.top
									, t = {};
								window.__uspapi = function (i, n, r) {
									var o = "" + Math.random()
										, a = {
											__uspapiCall: {
												command: i
												, version: n
												, callId: o
											}
										};
									t[o] = r, e.postMessage(a, "*")
								}, window.addEventListener("message", (function (e) {
									var i = e && e.data && e.data.__uspapiReturn;
									i && i.callId && "function" == typeof t[i.callId] && (t[i.callId](i.returnValue, i.success), t[i.callId] = null)
								}), !1)
							}
						}(), E()
					}
					, k = !1
					, y = !1
					, w = function () {
						window.__tcfapi && window.__tcfapi("ping", 2, (function () {
							console.debug("GDPR - __tcfapi callback received"), k = !0, clearInterval(Z)
						}))
					}
					, Z = setInterval(w, 2e3)
					, I = function () {
						window.__uspapi && window.__uspapi("uspPing", 1, (function () {
							console.debug("USPrivacy - __uspapi callback received"), y = !0, clearInterval(S)
						}))
					}
					, S = setInterval(I, 2e3)
					, E = function () {
						s.Z.gdprApplies && (clearInterval(S), w(), setTimeout((function () {
							k || console.error("GDPR - No __tcfapi callback after 2s, verify implementation!")
						}), 2e3)), s.Z.ccpaApplies && (clearInterval(Z), I(), setTimeout((function () {
							y || console.error("USPrivacy - No __uspapi callback after 2s, verify implementation!")
						}), 2e3)), (!s.Z.gdprApplies && !s.Z.ccpaApplies || d.Z.debug) && (clearInterval(Z), clearInterval(S))
					}
					, x = function () {
						return s.Z.gdprApplies && !k && !d.Z.debug
					}
					, C = function () {
						return s.Z.ccpaApplies && !y && !d.Z.debug
					}
					, _ = i(699)
					, T = i(893);
				var P = "MacIntel" === window.navigator.platform && void 0 !== window.navigator.standalone && navigator.maxTouchPoints > 1
					, B = i(573)
					, D = i(992);
				const j = function () {
					for (var e = Math.floor(Date.now() / 1e3), t = "", i = 0; i < 4; i++) t = String.fromCharCode(255 & e) + t, e >>= 8;
					if (window.crypto && crypto.getRandomValues && Uint32Array) {
						var n = new Uint32Array(12);
						crypto.getRandomValues(n);
						for (i = 0; i < 12; i++) t += String.fromCharCode(255 & n[i])
					}
					else
						for (i = 0; i < 12; i++) t += String.fromCharCode(Math.floor(256 * Math.random()));
					return btoa(t)
						.replace(/\+/g, "-")
						.replace(/\//g, "_")
						.replace(/=/g, "")
				};
				const z = function (e) {
					return e instanceof Array ? e : [e]
				};
				const M = {
					adTagUrl: "//pubads.g.doubleclick.net/gampad/ads?sz=640x360|640x480&iu=/1053551/Pub-Poki-Generic&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}"
					, adTiming: {
						preroll: !1
						, timeBetweenAds: 12e4
						, timePerTry: 7e3
						, startAdsAfter: 12e4
					}
					, waterfallRetries: 2
				};
				var O = i(58);
				const R = function () {
					function e(e) {
						void 0 === e && (e = {}), this.setTimings(e), this.timingIdx = {
							timePerTry: 0
						}, this.timers = {
							timePerTry: void 0
							, timeBetweenAds: void 0
							, startAdsAfter: void 0
						}, O.Z.addEventListener(o.Z.ads.requested, this.startTimeBetweenAdsTimer.bind(this)), O.Z.addEventListener(o.Z.ads.completed, this.startTimeBetweenAdsTimer.bind(this)), O.Z.addEventListener(o.Z.ads.stopped, this.startTimeBetweenAdsTimer.bind(this))
					}
					return e.prototype.setTimings = function (e) {
						var t = M.adTiming
							, i = e.preroll
							, n = void 0 === i ? t.preroll : i
							, r = e.timePerTry
							, o = void 0 === r ? t.timePerTry : r
							, a = e.timeBetweenAds
							, s = void 0 === a ? t.timeBetweenAds : a
							, d = e.startAdsAfter
							, c = void 0 === d ? t.startAdsAfter : d;
						this.timings = {
							preroll: !1 !== n
							, timePerTry: z(o)
							, timeBetweenAds: s
							, startAdsAfter: c
						}
					}, e.prototype.startTimeBetweenAdsTimer = function () {
						this.startTimer("timeBetweenAds")
					}, e.prototype.startStartAdsAfterTimer = function () {
						this.startTimer("startAdsAfter")
					}, e.prototype.requestPossible = function () {
						return !this.timers.timeBetweenAds && !this.timers.startAdsAfter
					}, e.prototype.startWaterfallTimer = function (e) {
						this.startTimer("timePerTry", e)
					}, e.prototype.stopWaterfallTimer = function () {
						this.stopTimer("timePerTry")
					}, e.prototype.nextWaterfallTimer = function () {
						this.nextTiming("timePerTry")
					}, e.prototype.resetWaterfallTimerIdx = function () {
						this.resetTimingIdx("timePerTry")
					}, e.prototype.stopTimer = function (e) {
						this.timers[e] && (clearTimeout(this.timers[e]), this.timers[e] = void 0)
					}, e.prototype.startTimer = function (e, t) {
						var i = this;
						void 0 === t && (t = function () {}), this.getTiming(e) <= 0 ? t() : (this.timers[e] && clearTimeout(this.timers[e]), this.timers[e] = window.setTimeout((function () {
							i.stopTimer(e), t()
						}), this.getTiming(e)))
					}, e.prototype.getTiming = function (e) {
						var t = this.timings[e];
						return t instanceof Array ? t[this.timingIdx[e]] : t
					}, e.prototype.nextTiming = function (e) {
						if (void 0 === this.timingIdx[e]) throw new Error("AdTimings Error: " + e + " does not have multiple timers");
						this.timingIdx[e] = (this.timingIdx[e] + 1) % this.timings[e].length
					}, e.prototype.resetTimingIdx = function (e) {
						if (void 0 === this.timingIdx[e]) throw new Error("AdTimings Error: " + e + " does not have multiple timers");
						this.timingIdx[e] = 0
					}, e.prototype.prerollPossible = function () {
						return this.timings.preroll
					}, e
				}();
				var L = i(906)
					, G = i(902);
				const N = function () {
						var e = window.location.href.split("?")
							, t = encodeURIComponent(e[0]);
						return (0, L.Z)("poki_url") || t
					}
					, U = function () {
						return "undefined" != typeof navigator && /MSIE \\d|Trident.*rv:/i.test(navigator.userAgent)
					};
				var q = {
					1: "eNjDw1AVTr"
					, 3: "AfRKClvdYk"
					, 5: "UprdYKe74r"
					, 6: "tBCJC9E6Y4"
					, 7: "AfRKClvdYk"
					, 8: "tJ44vpLpuM"
					, 10: "rKV8rMwiwk"
					, 11: "SvK8BH5qS5"
					, 12: "SpfIMxnWTS"
					, 13: "ysxIcmt3tW"
					, 14: "gLmtGS4aUq"
					, 15: "RU6ebIFLw9"
					, 16: "r9G4tVMYw7"
					, 17: "SgcDa5B8s1"
					, 18: "AfRKClvdYk"
					, 19: "DNZX8XdJXV"
					, 20: "39o4YUyZTX"
					, 21: "5sb2HFpz5a"
					, 22: "pgXzCJZipE"
					, 23: "Oani8EAGI9"
					, 24: "IzCeh7d7vW"
					, 30: "9ALgxEyGXU"
					, 31: "lBzSdVGY8F"
					, 37: "mis9Mt4np4"
					, 38: "AfRKClvdYk"
					, 43: "AfRKClvdYk"
					, 46: "AfRKClvdYk"
					, 47: "21OybbiIdc"
					, 48: "AfRKClvdYk"
					, 49: "CMVoMvvEmu"
					, 50: "IoQrhRb3wU"
					, 52: "AfRKClvdYk"
					, 53: "AfRKClvdYk"
				};
				var V = ["AU", "CA", "IE", "NZ", "US", "GB"]
					, Q = ["AT", "BE", "DK", "FI", "FR", "DE", "JA", "NO", "NL", "SA", "ES", "SE", "CH", "AE", "IT"]
					, F = ["BR", "CL", "CZ", "HU", "PL", "PT", "RU", "SK", "TH"]
					, H = ["AR", "BG", "CO", "EC", "GR", "IN", "MX", "PE", "PH", "RO", "TR", "UY"];
				
				function W() {
					var e = s.Z.country;
					return "US" === e ? 1.5 : V.includes(e) ? .5 : Q.includes(e) ? .15 : F.includes(e) ? .08 : H.includes(e) ? .03 : .02
				}
				
				function X() {
					var e = new URL("https://api.poki.com/ads/houseads/video/vast")
						, t = (0, L.Z)("site_id");
					return e.searchParams.append("game_id", s.Z.gameID), e.searchParams.append("site", t), e.href
				}
				var K = {
						v_k0treo: 2.5
						, v_qr1wxs: 7.5
						, v_9diccg: 19
						, v_13q0xkw: .25
						, v_dn33ls: 1
						, v_z07u2o: 1.5
						, v_1400iyo: 2.25
						, v_9w8kxs: 3
						, v_ufej9c: 3.5
						, v_10960ao: 4.25
						, v_1ksbym8: 4.75
						, v_1ag9340: 5.25
						, v_1tbhh4w: 5.75
						, v_jjcgzk: 6.5
						, v_brnu9s: 7
						, v_1wscef4: 7.75
						, v_q22xhc: 8.5
						, v_f8irk0: 9
						, v_1rik45c: 9.75
						, v_lxhyww: 10.5
						, v_a9z0u8: 11
						, v_1yhiww0: 11.75
						, v_10mwg74: 12.25
						, v_1ji4u80: 12.75
						, v_wm2c5c: 13.5
						, v_2na6tc: 14
						, v_1myzri8: 14.75
						, v_3pzm68: 6
						, v_16kerr4: 6.25
						, v_1mdrmkg: 6.75
						, v_1ga0k5c: 7.25
						, v_5iwz5s: 8
						, v_12tk934: 8.25
						, v_1hsybr4: 8.75
						, v_1cj61hc: 9.25
						, v_y3r5kw: 9.5
						, v_94ow0: 10
						, v_15woqgw: 10.25
						, v_1orx4hs: 10.75
						, v_1d4e6f4: 11.25
						, v_t57ev4: 11.5
						, v_783hmo: 12
						, v_m7hkao: 12.5
						, v_hmo9hc: 13
						, v_19djnr4: 13.25
						, v_1twpm2o: 13.75
						, v_17zlou8: 14.25
						, v_ign1mo: 14.5
						, v_ccvz7k: 15
						, v_1f7b4sg: 15.25
						, v_snq4g0: 15.5
						, v_5wnf28: 16
						, v_137aozk: 16.25
						, v_1j0njsw: 16.75
						, v_1b8yx34: 17.25
						, v_yhhlhc: 17.5
						, v_25swe8: 18
						, v_15081z4: 18.25
						, v_1pje0ao: 18.75
						, v_1eptudc: 19.25
						, v_1xl28e8: 19.75
						, v_gfliio: 21
						, v_3y3sao: 22
						, v_ixhuyo: 22.5
						, v_ro52io: 23.5
						, v_qa73ls: 24.5
						, v_emo5j4: 25
						, v_yq5fk: 26
						, v_aobxts: 27
						, v_6shmgw: 28
						, v_natgqo: 28.5
						, v_x0f94w: 29.5
						, v_d2hfr4: 31
						, v_dch14w: 33
						, v_1jyadc: 34
						, v_8p5tz4: 36
						, v_fwv9xc: 37
						, v_c60r9c: 39
						, v_58awow: 40
						, v_bbcow: 42
						, v_a0x534: 43
						, v_hdmdq8: 45
						, v_2e8b28: 46
						, v_5nljb4: 48
						, v_1wr0n4: 50
						, v_pam1og: .5
						, v_1ipf08w: .75
						, v_1axqdj4: 1.25
						, v_1qr38cg: 1.75
						, v_15ldds: 2
						, v_1q248w0: 2.75
						, v_1eelatc: 3.25
						, v_1x9tou8: 3.75
						, v_8iam0w: 4
						, v_nhooow: 4.5
						, v_fq01z4: 5
						, v_w0u77k: 5.5
						, v_1vi5a0w: 15.75
						, v_orvt34: 16.5
						, v_dybn5s: 17
						, v_1q8czr4: 17.75
						, v_l11af4: 18.5
						, v_uqn2tc: 19.5
						, v_7zkdfk: 20
						, v_o7a58g: 20.5
						, v_vezl6o: 21.5
						, v_b5t88w: 23
						, v_4x2d4w: 24
						, v_xhwjk0: 25.5
						, v_lhw3r4: 26.5
						, v_tjkbuo: 27.5
						, v_h72ebk: 29
						, v_31n3sw: 30
						, v_64rl6o: 32
						, v_9lmigw: 35
						, v_3fdjpc: 38
						, v_fapfcw: 41
						, v_7o0lc0: 44
						, v_clbdvk: 47
						, v_ee8qv4: 49
					}
					, J = {
						"11s3rwg": 2.49
						, "1uhxr0g": 2.87
						, qr1wxs: 7.5
						, "15xxon4": .01
						, o6no5c: .02
						, fb0nwg: .04
						, "1etkow0": .05
						, x2aoe8: .06
						, "1wkupds": .07
						, "11i46io": .09
						, jqu60w: .1
						, "1j9e70g": .11
						, "1adr6rk": .13
						, smh69s: .14
						, "1s5179c": .15
						, "8naeps": .16
						, qekf7k: .18
						, "1px4g74": .19
						, hixeyo: .2
						, za7fgg: .22
						, "1ysrgg0": .23
						, lyqx34: .26
						, "16hwveo": 1.13
						, "1fdjvnk": 1.17
						, "2jjcao": 1.2
						, "1jtdds0": 1.23
						, t6gd1c: 1.26
						, "65e29s": 1.28
						, "1nf83r4": 1.31
						, wsb30g: 1.34
						, jgukn4: 1.38
						, al7ke8: 1.4
						, "1a3rlds": 1.41
						, "8datc0": 1.44
						, "1pn4utc": 1.47
						, z07u2o: 1.5
						, "13g1c74": 1.53
						, ct4bgg: 1.56
						, ukeby8: 1.58
						, mspp8g: 1.62
						, "1dfmpz4": 1.65
						, lm6m8: 1.68
						, icw740: 1.7
						, "18zt7uo": 1.73
						, "79cfsw": 1.76
						, "1oj6ha8": 1.79
						, "1xethj4": 1.83
						, "12c2yo0": 1.85
						, bp5xxc: 1.88
						, "1syzzeo": 1.91
						, ncow00: 1.94
						, "1dzlwqo": 1.97
						, "15ldds": 2
						, "10o5edc": 2.009999
						, a18dmo: 2.04
						, "1rb2f40": 2.069999
						, pkln28: 2.1
						, "1g7insw": 2.13
						, "12w25fk": 2.17
						, c954ow: 2.2
						, "1brp5og": 2.21
						, "1400iyo": 2.25
						, v4dips: 2.3
						, hsx0cg: 2.34
						, "18fu134": 2.37
						, "167xa0w": 2.41
						, "1f3ka9s": 2.45
						, "1d5n4lc": 1.01
						, "1uwx534": 1.03
						, bml8g: 1.04
						, i2wlq8: 1.06
						, "979lhc": 1.08
						, "18ptmgw": 1.09
						, "1qh3myo": 1.11
						, "6zcuf4": 1.12
						, oqmuww: 1.14
						, fuzuo0: 1.16
						, xm9v5s: 1.18
						, "1x4tw5c": 1.19
						, "1223da8": 1.21
						, katcsg: 1.22
						, bf6cjk: 1.24
						, "1axqdj4": 1.25
						, "1sp0e0w": 1.27
						, "15ny39c": 1.29
						, nwo2rk: 1.3
						, f112io: 1.32
						, "1ejl3i8": 1.33
						, "1pkk5c": 1.36
						, "1184l4w": 1.37
						, "1izelmo": 1.39
						, schkw0: 1.42
						, "1rv1lvk": 1.43
						, "17vuubk": 1.45
						, q4ktts: 1.46
						, h8xtkw: 1.48
						, "1yirv28": 1.51
						, "3xhb7k": 1.52
						, lorbpc: 1.54
						, "1l7bcow": 1.55
						, "1cbocg0": 1.57
						, "1u2ycxs": 1.59
						, "51foqo": 1.6
						, "14jzpq8": 1.61
						, "1mb9q80": 1.63
						, dx2ozk: 1.64
						, vocphc: 1.66
						, "1v6wqgw": 1.67
						, "10467ls": 1.69
						, "1hvg83k": 1.71
						, "9h96v4": 1.72
						, r8j7cw: 1.74
						, "1qr38cg": 1.75
						, "16rwgsg": 1.77
						, p0mgao: 1.78
						, g4zg1s: 1.8
						, "1fnjh1c": 1.81
						, xw9gjk: 1.82
						, "2tixog": 1.84
						, kksy68: 1.86
						, "1k3cz5s": 1.87
						, "1b7pyww": 1.89
						, tgfyf4: 1.9
						, "5levi8": 1.92
						, "153ywhs": 1.93
						, "1mv8wzk": 1.95
						, eh1vr4: 1.96
						, w8bw8w: 1.98
						, iwvdvk: 2.02
						, "1iffev4": 2.029999
						, "19jsem8": 2.049999
						, rsie4g: 2.06
						, "7tbmkg": 2.08
						, "17bvnk0": 2.089999
						, "1p35o1s": 2.11
						, goymtc: 2.12
						, "1xysoao": 2.15
						, "3di4g0": 2.16
						, l4s4xs: 2.18
						, "1knc5xc": 2.19
						, u0f56o: 2.22
						, "1tiz668": 2.23
						, "4hghz4": 2.24
						, m8qigw: 2.26
						, dd3i80: 2.28
						, "1cvnj7k": 2.29
						, "1umxjpc": 2.31
						, "1mzuo": 2.32
						, zk70u8: 2.33
						, "1hbh1c0": 2.35
						, "8xa03k": 2.36
						, qok0lc: 2.38
						, "1q741kw": 2.39
						, "6pd91c": 2.4
						, ogn9j4: 2.42
						, "1wuuark": 2.47
						, k0treo: 2.5
						, "1jjdse8": 2.51
						, swgrnk: 2.54
						, "162xhc0": 2.57
						, fg0glc: 2.6
						, l11af4: 18.5
						, "9diccg": 19
						, "7zkdfk": 20
						, gfliio: 21
						, b5t88w: 23
						, "4x2d4w": 24
						, emo5j4: 25
						, aobxts: 27
						, "6shmgw": 28
						, "31n3sw": 30
						, "64rl6o": 32
						, dch14w: 33
						, "9lmigw": 35
						, "1yv9csg": 5.35
						, o42yo: 6.8
						, q22xhc: 8.5
						, d2hfr4: 31
						, "1np7p4w": .03
						, "1zk5j4": .08
						, av75s0: .12
						, "185ufpc": .17
						, "1h1hfy8": .21
						, "47gwlc": .24
						, d33wu8: .28
						, uudxc0: .3
						, "14tzb40": .33
						, e72adc: .36
						, "1vgwbuo": .39
						, "10e5szk": .41
						, "1i5fthc": .43
						, "1r12tq8": .47
						, pam1og: .5
						, gez1fk: .52
						, "1xot2ww": .55
						, kusjk0: .58
						, bz5jb4: .6
						, tqfjsw: .62
						, "5vegw0": .64
						, "1n58idc": .67
						, wibhmo: .7
						, "1fkyrk": .72
						, "1ipf08w": .75
						, s2hzi8: .78
						, pul8g0: .82
						, "1ghi96o": .85
						, "3nhpts": .88
						, lerqbk: .9
						, uaeqkg: .94
						, "14a04cg": .97
						, dn33ls: 1
						, ved43k: 1.02
						, zu6m80: 1.05
						, "1hlgmps": 1.07
						, qyjlz4: 1.1
						, "1lhay2o": .27
						, "1clnxts": .29
						, "1ucxybk": .31
						, "5bfa4g": .32
						, n2pam8: .34
						, "1ml9bls": .35
						, "1dpmbcw": .37
						, vycav4: .38
						, vls00: .4
						, imvshs: .42
						, "9r8s8w": .44
						, "199st8g": .45
						, "7jc16o": .48
						, "171w268": .49
						, "1ot62o0": .51
						, "1fxj2f4": .53
						, y691xc: .54
						, "33ij28": .56
						, "12m2k1s": .57
						, "1kdckjk": .59
						, "1t8zksg": .63
						, "15dyhvk": .65
						, nmohds: .66
						, er1h4w: .68
						, "1e9li4g": .69
						, "1w0vim8": .71
						, "10y4zr4": .73
						, j6uz9c: .74
						, ab7z0g: .76
						, "19ts000": .77
						, "1rl20hs": .79
						, "83b7y8": .8
						, "17lv8xs": .81
						, "1pd59fk": .83
						, gyy874: .84
						, yq88ow: .86
						, "1y8s9og": .87
						, "1361qtc": .89
						, "1kxbrb4": .91
						, "1c1or28": .93
						, "1tsyrk0": .95
						, "4rg3cw": .96
						, miq3uo: .98
						, "1m1a4u8": .99
						, "11x3klc": 5.05
						, "1nrplhc": 5.15
						, "1ag9340": 5.25
						, qh2bk0: 5.3
						, "14wh7gg": 5.45
						, w0u77k: 5.5
						, "7ltxj4": 5.6
						, kxafwg: 5.7
						, "1tbhh4w": 5.75
						, "110mw3k": 5.85
						, "1pfn5s0": 5.95
						, "3pzm68": 6
						, ml8074: 6.1
						, "1uzf1fk": 6.15
						, "16kerr4": 6.25
						, "1jvva4g": 6.35
						, "67vym8": 6.4
						, jjcgzk: 6.5
						, hbfpxc: 6.6
						, "13ij8jk": 6.65
						, "1mdrmkg": 6.75
						, p34cn4: 6.9
						, "1xhbdvk": 6.95
						, "1ihxb7k": 7.15
						, "1ga0k5c": 7.25
						, dflekg: 7.4
						, "1o1p6v4": 7.55
						, "2c1n9c": 7.6
						, "1wscef4": 7.75
						, zhp4hs: 7.9
						, "5iwz5s": 8
						, f8irk0: 9
						, y3r5kw: 9.5
						, lxhyww: 10.5
						, a9z0u8: 11
						, "783hmo": 12
						, m7hkao: 12.5
						, wm2c5c: 13.5
						, "2na6tc": 14
						, ign1mo: 14.5
						, snq4g0: 15.5
						, "5wnf28": 16
						, dybn5s: 17
						, yhhlhc: 17.5
						, testbid: 0
						, "1nz7aio": 2.43
						, xca9s0: 2.46
						, b56r5s: 2.52
						, obngu8: 2.58
						, "24jy80": 2.64
						, "1jedzpc": 2.67
						, "18au8e8": 2.73
						, hnx7nk: 2.76
						, "13v0q9s": 2.81
						, "10lkow": 2.96
						, "156gsu8": 7.05
						, "1tlh2io": 7.35
						, "1aq8ohs": 7.65
						, "1losn40": 7.95
						, "1sf0sn4": 2.55
						, "1eykhkw": 2.61
						, srgyyo: 2.7
						, "1yxr94w": 2.79
						, d83pj4: 2.84
						, n7p3b4: 2.9
						, "1dum41s": 2.93
						, "1iafm68": 2.99
						, "7vtiww": 7.2
						, b2outc: 7.8
						, "13q0xkw": .25
						, riisqo: .46
						, "1bhpkao": .61
						, cj4q2o: .92
						, "1o96vwg": 1.15
						, "1wav400": 1.35
						, "1grhukg": 1.49
						, "1vqvx8g": 1.99
						, yg8nb4: 2.14
						, "1lrajgg": 2.27
						, fl09a8: 2.44
						, "1h6h8n4": 2.77
						, "1m69xj4": 3.55
						, rdj01s: 4.3
						, "29jqww": 2.48
						, "1anqs5c": 2.53
						, "6kdgcg": 2.56
						, "1nu7hts": 2.59
						, "1wpui2o": 2.63
						, jvtyps: 2.66
						, "1sa0zy8": 2.71
						, "1q248w0": 2.75
						, "4cgpa8": 2.8
						, "1cqnqio": 2.85
						, "5gf2tc": 2.88
						, ec2328: 2.92
						, "1vlw4jk": 2.95
						, "9w8kxs": 3
						, "176vuv4": 3.05
						, "1kicd8g": 3.15
						, jbury8: 3.3
						, h3y0w0: 3.4
						, gmdxc: 3.6
						, ovmnls: 3.7
						, "15sxvy8": 3.85
						, "1j4eebk": 3.95
						, "1gwhn9c": 4.05
						, e22hog: 4.2
						, "1oo69z4": 4.35
						, nhooow: 4.5
						, "17gvg8w": 4.65
						, "1ksbym8": 4.75
						, hxwt1c: 4.9
						, t1gkcg: 5.1
						, "2221vk": 5.2
						, d5lt6o: 5.4
						, "1i7xpts": 5.55
						, "1g00yrk": 5.65
						, etjdhc: 5.8
						, s4zvuo: 5.9
						, "1c46neo": 6.05
						, "99rhts": 6.2
						, xorri8: 6.3
						, "1em2zuo": 6.45
						, "1rxji80": 6.55
						, umw8ao: 6.7
						, "192b474": 6.85
						, brnu9s: 7
						, x7ah34: 2.62
						, "11n3z7k": 2.65
						, b06ygw: 2.68
						, "1aiqzgg": 2.69
						, "8sa7eo": 2.72
						, qjk7wg: 2.74
						, zf785c: 2.78
						, m3qps0: 2.82
						, "1lmaqrk": 2.83
						, uzdq0w: 2.86
						, "14yz3sw": 2.89
						, "1mq94ao": 2.91
						, w3c3k0: 2.94
						, "10j5log": 2.97
						, irvl6o: 2.98
						, yb8um8: 3.1
						, "60e9kw": 3.2
						, "1eelatc": 3.25
						, "1rq1t6o": 3.35
						, "13b1ji8": 3.45
						, ufej9c: 3.5
						, "18utf5s": 3.65
						, "1x9tou8": 3.75
						, bk658g: 3.8
						, wxavpc: 3.9
						, "8iam0w": 4
						, ltr4e8: 4.099999
						, "1u7y5mo": 4.15
						, "10960ao": 4.25
						, "2yiqdc": 4.4
						, "1bcprls": 4.45
						, "1vvvpxc": 4.55
						, a686bk: 4.6
						, yl8g00: 4.7
						, "4mgao0": 4.8
						, "1d0nbwg": 4.85
						, "1qc3u9s": 4.95
						, fq01z4: 5
						, watslc: 7.1
						, l7a1a8: 7.3
						, zmox6o: 7.45
						, oe5d6o: 7.7
						, "18dc4qo": 7.85
						, "94ow0": 10
						, t57ev4: 11.5
						, hmo9hc: 13
						, ccvz7k: 15
						, orvt34: 16.5
						, "25swe8": 18
						, uqn2tc: 19.5
						, "3y3sao": 22
						, yq5fk: 26
						, h72ebk: 29
						, "1jyadc": 34
						, testBid: 50
					}
					, Y = {
						hgfim8: "Amazon - DistrictM"
						, qc2iv4: "Amazon - Magnite"
						, "183cjcw": "Amazon - AppNexus"
						, "8ksidc": "Amazon - OpenX"
						, "1s2jaww": "Amazon - PubMatic"
						, "1pumjuo": "Amazon - EMX"
						, "12jknpc": "Amazon - Conversant UAM"
						, "1kauo74": "Amazon - Amobee DSP"
						, "15bglj4": "Amazon - PubMatic UAM APAC"
						, "5swkjk": "Amazon - PubMatic UAM EU"
						, "1d32f4": "Amazon - Simpli.fi"
						, ksan7k: "Amazon - Index Exchange"
						, urw0zk: "Amazon - Smaato"
						, "1dn4f0g": "Amazon - AdGeneration"
						, vvueio: "Amazon - DMX"
						, "1veefi8": "Amazon - Yieldmo"
						, "1i2xx4w": "Amazon - Yahoo Japan"
						, rg0we8: "Amazon - UnrulyX_SSP_APS"
						, y3r5kw: "Amazon - Verizon Media Group"
						, "1xmb6kg": "Amazon - GumGum UAM"
						, "1t6hog0": "Amazon - Acuity"
						, "1n2qm0w": "Amazon - Sharethrough"
						, j4d2ww: "Amazon - EMX UAM"
						, "1imx3wg": "Amazon - LoopMe_UAM"
						, z7pj40: "Amazon - Pulsepoint"
						, p845c0: "Amazon - SmartRTB+"
					};
				var $ = {
						skyscraper: {
							1: "eexq7SUa6daeQrPF6q1CaKZ0"
							, 10: "SSZzGHt3d4BrOdVUug1ypxji"
							, 11: "OXc0ZJDJIcRgGcIta8mTUQSZ"
							, 12: "ulACVGPjP002tSfhDGRApuub"
							, 13: "c7FldnCsd9Mtcr7PgBFGKWEQ"
							, 14: "KJouWQMjZwvE8fxw4mAvGopZ"
							, 15: "ilNkOqBMO6EGbQwrZtCMHzeJ"
							, 16: "Kg24ec1AyTvzJ6I3Cji8lqzx"
							, 17: "iqvpcyepSMCVCsJfKu4JQGwr"
							, 18: "es9ztDrPZDW883VHbK2gUfkQ"
							, 19: "pvXQE41GXKGsW5Li0OSQavwT"
							, 20: "MCy638sYvzVbsrvcPau6lABN"
							, 21: "NkJeV6CuMlt41iJWcgnmMSDN"
							, 22: "fjKznUvVWlp6TBxuSsEkQF8H"
							, 23: "5tJM2ZFmNf7gii6KVS6msGc4"
							, 24: "xZUYMFw1zGuRzFd6DRl88Pwk"
							, 3: "xNmhWWy88VtzOGfderrtgDBb"
							, 30: "KO0gUA5iJIsleK9a941H0pW1"
							, 31: "wo0KU1WR11jNFxoy121ciQj8"
							, 37: "areVtONg11YNRQin7R2sveKy"
							, 47: "uzLaOEe8yqB9eWZuxdnwyawr"
							, 49: "ZYaqiQw00NSTBGJ4HacifENM"
							, 5: "qe5Tc3N2MO3daALoTdIaTmSA"
							, 50: "NZv1ui2F1tlQ6PQQi7umnFht"
							, 6: "xbx8OLCAgjm0igkmFIBw8n6E"
							, 8: "4vYDfNOQagnuwg9REGNWGv83"
						}
						, rectangle: {
							1: "Ka3KvQx9svu71CJoRtZlwFY9"
							, 10: "9o5dMBQZX9bi2OsvTpc5j0pO"
							, 11: "gwL6nB1Twy25gpWQyEP2cVMJ"
							, 12: "yYUjIY5L6w2ukD5FxCIVydgG"
							, 13: "PoqRXAEYHKTdqNY22lIFTXRp"
							, 14: "eAudypoJLJEtFZz3zzvKYoAu"
							, 15: "4b416MUjJEdZm5nDKwvn2ELO"
							, 16: "H6jadzxgw0uRVRHHadZ19Zvp"
							, 17: "5zG8Ioh6paBscdCgUQTQE0eu"
							, 18: "OgMX0PlDPabF3BHOgxDbeH2n"
							, 19: "uzK7eCjSVYDp4KvJEg6mC59r"
							, 20: "yapIY909O3cgcD8QDAEehtkb"
							, 21: "8KT1bEUCcvASfq0LXWN2nVe0"
							, 22: "3LKyDpL1Xt7YactKFGxFpJO7"
							, 23: "GMaOiZl6YeMzYckusbO4Cdh1"
							, 24: "5iZnMqviynz6ndlaikqhMy73"
							, 3: "lcpgaTLqkd6gRi8AVtVr0gLe"
							, 30: "xWGhFW6bvMf9LuGYqQOhoD2h"
							, 31: "GqMz69ka237zrG4H8bpMuYTy"
							, 37: "lYrk2xnelCQrhwmO43AtjErF"
							, 47: "PDA12fEHtYIVr6A12fZ86JQH"
							, 49: "RYn9wxADCbBgKeo8Lyxx1ZHE"
							, 5: "N3wOmgPMiK6RaGNYjeqOzuHU"
							, 50: "KwEXqYIZG8fOlJyePKTBiJFs"
							, 6: "fJMv7XtKbfsRbzkO42fkS3Dr"
							, 8: "915o8cwxF5rzfQsA1Op6hhQV"
						}
						, leaderboard: {
							16: "ZPwouCq7eD5kRnZjX5ct8ZIT"
							, 1: "sysnuL1RKPIEL98w2l6lPc1w"
							, 31: "FgHUFCWMZCCJaHKMF0LyIgSI"
							, 23: "eyGVQGQkrHwJRcLoBzepUHW2"
							, 14: "PeRnr3pCNPpCgJAOF3yuQCGg"
							, 37: "5DXFSCYcaAxAXBuZVpTHAx59"
							, 30: "MpHDUxZ178U65yD3l878z5m1"
							, 47: "oYQGytr0CbDDQqIooggCsNTO"
							, 18: "na3uJK58s0vgb7NyaPR6R5P8"
							, 50: "m3hskIBrmloAWHD7i27q2ZPN"
							, 3: "PIsUL8EJvXXA1thcFkCPWdhi"
							, 19: "cluKVL1thRZlb3bsK7oVadOZ"
							, 20: "8PPLwmi2mra9HNTdhftQOcC4"
							, 8: "cCQE4L5S1j9BmKeywuonM6hM"
							, 11: "uvkuS4QYv01YvuGoJvqa9xnz"
							, 12: "GyG0XHcaahKmsXbcjDlgtjCQ"
							, 17: "0ut5aHlZRj5dNfTKo9bM8nXj"
							, 10: "TzMO5iGdP4vt7BIOAQ2e3kpU"
							, 49: "f1vArQjoEfX9QdjK2TvBjnDv"
							, 22: "92kdBH3AxvPr1pqZ1h1TYkjN"
							, 13: "Y6Tl87JTAn9T1B8rq523UDeH"
							, 15: "B3HlKKIdq8mGyoMGkjT4m9RD"
							, 24: "nfS0DrtZtJ6eZVNqsWqyVVFS"
							, 5: "gr33qXeArxdqi0Sk4i50TmE3"
							, 6: "ACn0XyU2KP2l94N0HMf1vhlu"
							, 21: "o2PQGGTxXO92in2mASt624tn"
						}
						, mobile_leaderboard: {
							16: "5X98AYdO2OAIb2m6ThLjCGR5"
							, 1: "nVDrFwfkiRg5Tb426duBnat4"
							, 31: "H8tpygATsgJwk7qJzh612B0I"
							, 23: "07iMij2dOIgPHzM7JFv5fYBN"
							, 14: "XCQLWETuRkKmiN9jCOu01NOp"
							, 37: "419OVNbGzLJn7wlh5jAiUFLA"
							, 30: "ErE9N4WozhjbawA6HFN2hC0V"
							, 47: "4aBsJtSPEivB07hrlV6nTgj7"
							, 18: "waksL4h4X7gn2TU88OgeZHHl"
							, 50: "Wi3BRMWcCUdKZO7leMhtCfdp"
							, 3: "KQ3P2qVndkjlesGkzM5Rknma"
							, 19: "OCsZIZrTXKyprJ8AKiI7e0Jl"
							, 20: "h2aMA8KeZ3tHtfRgwT2xCHUJ"
							, 8: "igvEPDF1ft8FBFQ2aVhCS0BG"
							, 11: "I1ZnJzEjRg75BZikcGMWxMTF"
							, 12: "ZrnW76G2qvB5pZx8VvOanqQQ"
							, 17: "B4f8YQfcg3WWl5k9pAnqVCfm"
							, 10: "cfNKknbTZxcxhNZCV2fWr4Ne"
							, 49: "ziBY1mSHWj9UTGcq9Tbzo5J4"
							, 22: "ImlLSALVeaqvi7y2e6qdBDkw"
							, 13: "NUx9OmJMlzbkv39hUX5FOnXv"
							, 15: "RxDq1opgeO5VXEQRPtdESHaX"
							, 24: "aswJxUjNpHyiEunaOUBGbajK"
							, 5: "1M1EIJhXdwEoJ8utYTDjj0DD"
							, 6: "gExvCBm9TEaw4jV6kRzEuDxq"
							, 21: "wNOOjIhadhe2s1jgq3LppWm0"
						}
						, billboard: {
							16: "dr2IuY7Yb8POz9tbezoJUFey"
							, 1: "WhhFn8GL9nBEK2z9psbtD1SV"
							, 31: "JNfSIPKKAkfNgzkg3hrGlGEV"
							, 23: "xvsrS9J4xrRGjlus3pKkIatI"
							, 14: "4BL4a74RRMoiRu9D8jKAfdij"
							, 37: "f8B8j7tjb1YA6lAcnHSRBlfI"
							, 30: "vW1ODUqFt2jDk5laYsVh9PIF"
							, 47: "R7GldiHZEWYFwdJq936YnbZW"
							, 18: "83noJ3tAhRyFWDlS1iXKuRGa"
							, 50: "WNu1woAb2OHf3KncItSAnYnm"
							, 3: "Ydwhf5DPoJBinldgPdkD9okm"
							, 19: "3X7dNFFm484Xx6aD6nBF0k43"
							, 20: "qzLmNwSljh25A7s9HXQYVYtr"
							, 8: "tXWpZaKO291ytd8kfiy3NWlz"
							, 11: "0ePnxLUMZ8tKBxImFp2i1J4g"
							, 12: "Y1HuzbhxRv1UmUhd8dUtONQI"
							, 17: "lqSabVDWqYWy8jpJH57BK1vS"
							, 10: "zVEWUpJuNfEipDrTPGwniMP3"
							, 49: "B2srINo0hBkijyowlq4FQk7c"
							, 22: "Ljcylng1YDm5yAqEpiomGazZ"
							, 13: "hYTGyFgCiCUVtNOx56TkKexo"
							, 15: "5xkx65Y9eEhPen8gqIuOFQRZ"
							, 24: "ZH3Odxmz8QF49ZoZ16mPs08T"
							, 5: "Ax2noHPv7iRdW6DM26NxmtFT"
							, 6: "mZEu6Z0wDTq4UAHQoyUosm5y"
							, 21: "7bAgpwCip0dSf6bJXgBO6nY1"
						}
					}
					, ee = [];
				
				function te(e, t) {
					var i, n, r;
					return (null === (n = null === (i = null == t ? void 0 : t.meta) || void 0 === i ? void 0 : i.advertiserDomains) || void 0 === n ? void 0 : n.length) > 0 && (null === (r = null == t ? void 0 : t.meta) || void 0 === r ? void 0 : r.advertiserDomains.find((function (e) {
						return function (e) {
							return ee.includes(e) || ee.includes("www." + e) || e.includes("game")
						}(e)
					}))) ? (console.warn("Blocked ad: ", t), 0) : e
				}
				var ie = function () {
						var e;
						return (null === (e = Object.keys(window.pbjs)) || void 0 === e ? void 0 : e.length) > 1
					}
					, ne = function () {
						return ne = Object.assign || function (e) {
							for (var t, i = 1, n = arguments.length; i < n; i++)
								for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
							return e
						}, ne.apply(this, arguments)
					}
					, re = function (e, t, i) {
						if (i || 2 === arguments.length)
							for (var n, r = 0, o = t.length; r < o; r++) !n && r in t || (n || (n = Array.prototype.slice.call(t, 0, r)), n[r] = t[r]);
						return e.concat(n || Array.prototype.slice.call(t))
					}
					, oe = "rewarded"
					, ae = "video"
					, se = {
						"728x90": "/21682198607/" + s.Z.device + "_ingame_728x90/" + s.Z.siteID + "_" + s.Z.device + "_ingame_728x90"
						, "300x250": "/21682198607/" + s.Z.device + "_ingame_300x250/" + s.Z.siteID + "_" + s.Z.device + "_ingame_300x250"
						, "970x250": "/21682198607/" + s.Z.device + "_ingame_970x250/" + s.Z.siteID + "_" + s.Z.device + "_ingame_970x250"
						, "160x600": "/21682198607/" + s.Z.device + "_ingame_160x600/" + s.Z.siteID + "_" + s.Z.device + "_ingame_160x600"
						, "320x50": "/21682198607/" + s.Z.device + "_ingame_320x50/" + s.Z.siteID + "_" + s.Z.device + "_ingame_320x50"
						, "728x90_external": "/21682198607/external_" + s.Z.device + "_display_ingame/external_" + s.Z.device + "_ingame_728x90"
						, "300x250_external": "/21682198607/external_" + s.Z.device + "_display_ingame/external_" + s.Z.device + "_ingame_300x250"
						, "970x250_external": "/21682198607/external_" + s.Z.device + "_display_ingame/external_" + s.Z.device + "_ingame_970x250"
						, "160x600_external": "/21682198607/external_" + s.Z.device + "_display_ingame/external_" + s.Z.device + "_ingame_160x600"
						, "320x50_external": "/21682198607/external_" + s.Z.device + "_display_ingame/external_" + s.Z.device + "_ingame_320x50"
					}
					, de = !1
					, ce = function (e, t) {
						if (ie()) {
							de = !0;
							var i = ["US", "CA", "AU"]
								, n = function (e) {
									var t = U() || (0, T.Z)() || (0, B.Z)() ? ["video/mp4", "application/javascript"] : ["video/mp4", "video/webm", "video/ogg", "application/javascript"]
										, i = ne(ne({
											mimes: t
											, minduration: 0
											, maxduration: 15
											, protocols: [2, 3, 5, 6, 7, 8, 11, 12, 13, 14]
											, w: 640
											, h: 480
											, placement: 1
											, linearity: 1
										}, e ? {} : {
											skip: 1
											, skipafter: 5
										}), {
											boxingallowed: 1
											, pos: 1
											, api: [2, 7, 8]
										})
										, n = "";
									e && "desktop" === s.Z.device ? n = "4725015@640x360" : e && "desktop" !== s.Z.device ? n = "4725013@640x360" : e || "desktop" !== s.Z.device ? e || "desktop" === s.Z.device || (n = "4725011@640x360") : n = "4725008@640x360";
									var r;
									return {
										bids: [{
											bidder: "appnexus"
											, params: {
												placementId: e ? 13184309 : 13184250
												, supplyType: "web"
											}
										}, {
											bidder: "openx"
											, params: {
												delDomain: "poki-d.openx.net"
												, unit: "540105196"
											}
										}, {
											bidder: "spotx"
											, params: {
												channel_id: "265590"
												, ad_unit: "instream"
												, secure: !0
												, hide_skin: !0
											}
										}, {
											bidder: "ix"
											, params: {
												siteId: "436284"
												, video: {}
											}
										}, {
											bidder: "richaudience"
											, params: {
												pid: (r = s.Z.siteID, q[r] || "MP_gIE1VDieUi")
												, supplyType: "site"
											}
										}, {
											bidder: "onetag"
											, params: {
												pubId: "6da09f566a9dc06"
											}
										}, {
											bidder: "rubicon"
											, params: {
												accountId: "18608"
												, siteId: "266914"
												, zoneId: "1322034"
												, position: "atf"
												, video: {
													size_id: 204
												}
											}
										}, {
											bidder: "pubmatic"
											, params: {
												publisherId: "156838"
												, adSlot: n
											}
										}, {
											bidder: "sharethrough"
											, params: {
												pkey: "vRjLnZDA86biUVrjIKVGxq3x"
											}
										}, {
											bidder: "triplelift"
											, params: {
												inventoryCode: "Poki_Instream_Prebid"
												, video: ne({}, i)
											}
										}]
										, mediaTypes: {
											video: ne({
												context: "instream"
												, playerSize: [640, 480]
											}, i)
										}
									}
								}
								, r = n(!0)
								, o = n(!1)
								, a = [{
									code: ae
									, mediaTypes: o.mediaTypes
									, bids: re([], o.bids, !0)
								}, {
									code: oe
									, mediaTypes: r.mediaTypes
									, bids: re([], r.bids, !0)
								}, {
									code: se["728x90"]
									, mediaTypes: {
										banner: {
											sizes: [[728, 90]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "12940427"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "539859872"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "268177"
											, size: [728, 90]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "1374895@728x90"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "204596"
											, zoneId: "1008080"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "1V6a2fgLvX"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.leaderboard[s.Z.siteID] || $.leaderboard[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_728x90_Prebid"
										}
									}], !1)
								}, {
									code: se["300x250"]
									, mediaTypes: {
										banner: {
											sizes: [[300, 250]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "12935252"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "539859873"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "268178"
											, size: [300, 250]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "1374896@300x250"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "204596"
											, zoneId: "1008080"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "pKqNt5LyvF"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.skyscraper[s.Z.siteID] || $.skyscraper[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_300x250_Prebid"
										}
									}], !1)
								}, {
									code: se["970x250"]
									, mediaTypes: {
										banner: {
											sizes: [[970, 250]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20595278"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543540497"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "597527"
											, size: [970, 250]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3344351@970x250"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "yYyae7vnIh"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.rectangle[s.Z.siteID] || $.rectangle[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_970x250_Prebid"
										}
									}], !1)
								}, {
									code: se["160x600"]
									, mediaTypes: {
										banner: {
											sizes: [[160, 600]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "12940425"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "539859871"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "268175"
											, size: [160, 600]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "1374893@160x600"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "204596"
											, zoneId: "1008080"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "rAEnPimPzC"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.billboard[s.Z.siteID] || $.billboard[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_160x600_Prebid"
										}
									}], !1)
								}, {
									code: se["320x50"]
									, mediaTypes: {
										banner: {
											sizes: [[320, 50]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20595224"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543540495"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "597529"
											, size: [320, 50]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3344350@320x50"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "204596"
											, zoneId: "1008080"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "1DP5EtcOip"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.skyscraper[s.Z.siteID] || $.skyscraper[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_320x50_Prebid"
										}
									}], !1)
								}, {
									code: se["728x90_external"]
									, mediaTypes: {
										banner: {
											sizes: [[728, 90]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20973406"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543885656"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "268177"
											, placementId: "625562"
											, size: [728, 90]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3457872"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "362566"
											, zoneId: "1962680-2"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "MP_gIE1VDieUi"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.billboard[s.Z.siteID] || $.billboard[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_728x90_Prebid"
										}
									}], !1)
								}, {
									code: se["300x250_external"]
									, mediaTypes: {
										banner: {
											sizes: [[300, 250]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20973408"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543885657"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "625564"
											, size: [300, 250]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3457874"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "362566"
											, zoneId: "1962680-15"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "MP_gIE1VDieUi"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.mobile_leaderboard[s.Z.siteID] || $.mobile_leaderboard[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_300x250_Prebid"
										}
									}], !1)
								}, {
									code: se["970x250_external"]
									, mediaTypes: {
										banner: {
											sizes: [[970, 250]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20973415"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543885650"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "625560"
											, size: [970, 250]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3457879"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "362566"
											, zoneId: "1962680-57"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "MP_gIE1VDieUi"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.leaderboard[s.Z.siteID] || $.leaderboard[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_970x250_Prebid"
										}
									}], !1)
								}, {
									code: se["160x600_external"]
									, mediaTypes: {
										banner: {
											sizes: [[160, 600]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20973407"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543885653"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "625563"
											, size: [160, 600]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3457877"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "362566"
											, zoneId: "1962680-9"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "MP_gIE1VDieUi"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.rectangle[s.Z.siteID] || $.rectangle[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_160x600_Prebid"
										}
									}], !1)
								}, {
									code: se["320x50_external"]
									, mediaTypes: {
										banner: {
											sizes: [[320, 50]]
										}
									}
									, bids: re(re([{
										bidder: "appnexus"
										, params: {
											placementId: "20973413"
										}
									}, {
										bidder: "openx"
										, params: {
											unit: "543885649"
											, delDomain: "poki-d.openx.net"
										}
									}, {
										bidder: "ix"
										, params: {
											siteId: "625559"
											, size: [320, 50]
										}
									}, {
										bidder: "pubmatic"
										, params: {
											publisherId: "156838"
											, adSlot: "3457875"
										}
									}, {
										bidder: "rubicon"
										, params: {
											accountId: "18608"
											, siteId: "362566"
											, zoneId: "1962680-43"
										}
									}, {
										bidder: "onetag"
										, params: {
											pubId: "6da09f566a9dc06"
										}
									}, {
										bidder: "richaudience"
										, params: {
											pid: "MP_gIE1VDieUi"
											, supplyType: "site"
										}
									}], i.includes(s.Z.country) ? [{
										bidder: "33across"
										, params: {
											siteId: "aRJKVCig8r7ikZaKj0P0Le"
											, productId: "siab"
										}
									}] : [], !0), [{
										bidder: "sharethrough"
										, params: {
											pkey: $.mobile_leaderboard[s.Z.siteID] || $.mobile_leaderboard[3]
										}
									}, {
										bidder: "triplelift"
										, params: {
											inventoryCode: "Poki_320x50_Prebid"
										}
									}], !1)
								}]
								, d = ne(ne({
									debug: !1
									, enableSendAllBids: !0
									, usePrebidCache: !0
									, bidderTimeout: 1500
									, priceGranularity: {
										buckets: [{
											precision: 2
											, min: .01
											, max: 3
											, increment: .01
										}, {
											precision: 2
											, min: 3
											, max: 8
											, increment: .05
										}, {
											precision: 2
											, min: 8
											, max: 20
											, increment: .5
										}, {
											precision: 2
											, min: 20
											, max: 45
											, increment: 1
										}]
									}
									, currency: {
										adServerCurrency: "EUR"
										, defaultRates: {
											EUR: {
												EUR: 1
												, GBP: .84
												, USD: 1.02
											}
											, GBP: {
												EUR: 1.2
												, GBP: 1
												, USD: 1.22
											}
											, USD: {
												EUR: .98
												, GBP: .82
												, USD: 1
											}
										}
									}
									, cache: {
										url: "https://prebid.adnxs.com/pbc/v1/cache"
									}
									, targetingControls: {
										allowTargetingKeys: ["BIDDER", "AD_ID", "PRICE_BUCKET", "SIZE", "DEAL", "SOURCE", "FORMAT", "UUID", "CACHE_ID", "CACHE_HOST", "ADOMAIN"]
										, allowSendAllBidsTargetingKeys: ["BIDDER", "AD_ID", "PRICE_BUCKET", "SIZE", "DEAL", "SOURCE", "FORMAT", "UUID", "CACHE_ID", "CACHE_HOST", "ADOMAIN"]
									}
									, ortb2: {
										site: {
											name: "Poki"
											, page: N()
										}
										, device: ne({}, window.innerWidth && window.innerHeight ? {
											w: window.innerWidth
											, h: window.innerHeight
										} : {})
									}
									, userSync: {
										filterSettings: {
											all: {
												bidders: "*"
												, filter: "include"
											}
										}
										, syncsPerBidder: 1e3
										, syncDelay: 100
										, userIds: [{
											name: "pubCommonId"
											, storage: {
												type: "cookie"
												, name: "poki_pubcid"
												, expires: 180
											}
										}]
									}
								}, s.Z.gdprApplies ? {
									consentManagement: {
										gdpr: {
											cmpApi: "iab"
											, timeout: 8e3
											, defaultGdprScope: !0
										}
									}
								} : {}), s.Z.ccpaApplies ? {
									consentManagement: {
										usp: {
											cmpApi: "iab"
											, timeout: 8e3
										}
									}
								} : {});
							window.pbjs.que.push((function () {
								var i, n, r = ne(ne({
									floors: {
										data: {
											currency: "EUR"
											, schema: {
												fields: ["mediaType"]
											}
											, values: {
												banner: (n = s.Z.country, V.includes(n) ? .13 : Q.includes(n) ? .07 : F.includes(n) ? .04 : .02)
												, video: W()
											}
										}
									}
								}, d), e.config);
								0 === (null === (i = Object.keys(r.floors)) || void 0 === i ? void 0 : i.length) && (console.log("disabled floor module"), null == r || delete r.floors), window.pbjs.addAdUnits(function (e, t) {
									var i, n, r = s.Z.country
										, o = null == t ? void 0 : t[r];
									if (!o) return e;
									for (var a = 0; a <= e.length; a++)
										for (var d = e[a], c = o[(null === (i = null == d ? void 0 : d.mediaTypes) || void 0 === i ? void 0 : i.video) ? "video" : "display"] || {}, l = (null === (n = null == d ? void 0 : d.bids) || void 0 === n ? void 0 : n.length) - 1; l >= 0; l--) {
											var A = d.bids[l]
												, u = Math.random();
											c[A.bidder] && u > c[A.bidder] && e[a].bids.splice(l, 1)
										}
									return e
								}(e.adUnits || a, t)), window.pbjs.setConfig(r);
								var o = function (e, t) {
									return 640 !== t.width && (e *= .95), te(e, t)
								};
								window.pbjs.bidderSettings = {
									standard: {
										storageAllowed: !0
									}
									, appnexus: {
										bidCpmAdjustment: te
									}
									, openx: {
										bidCpmAdjustment: te
									}
									, spotx: {
										bidCpmAdjustment: te
									}
									, ix: {
										bidCpmAdjustment: o
									}
									, richaudience: {
										bidCpmAdjustment: o
									}
									, onetag: {
										bidCpmAdjustment: te
									}
									, rubicon: {
										bidCpmAdjustment: te
									}
									, pubmatic: {
										bidCpmAdjustment: o
									}
									, "33across": {
										bidCpmAdjustment: te
									}
									, sharethrough: {
										bidCpmAdjustment: o
									}
									, triplelift: {
										bidCpmAdjustment: te
									}
								}
							}))
						}
					}
					, le = !1
					, Ae = function (e, t) {
						if (window.apstag) try {
							var i = function (i) {
								d.Z.debug && console.log("Boot A9 with APS CCPA Privacy mode:", s.Z.ccpaApplies ? "on" : "off", i);
								var n = e.settings || ne(ne({
									pubID: "e32f1423-28bc-43ed-8ab0-5ae6b4449cf8"
									, adServer: "googletag"
									, videoAdServer: "GAM"
								}, s.Z.gdprApplies ? {
									gdpr: {
										cmpTimeout: 1e4
									}
								} : {}), s.Z.ccpaApplies ? {
									params: {
										aps_privacy: i || "1--"
									}
								} : {});
								window.apstag.init(n, (function () {
									var i;
									le = ! function (e) {
										var t, i, n = s.Z.country
											, r = null === (i = null === (t = null == e ? void 0 : e[n]) || void 0 === t ? void 0 : t.video) || void 0 === i ? void 0 : i.amazon;
										return !!r && Math.random() > r
									}(t), null === (i = e.callback) || void 0 === i || i.call(e)
								}))
							};
							if (s.Z.ccpaApplies) return void window.__uspapi("uspPing", 1, (function () {
								window.__uspapi("getUSPData", 1, (function (e, t) {
									var n;
									if (t) {
										var r = (null === (n = null == e ? void 0 : e.uspString) || void 0 === n ? void 0 : n.charAt(2)) || "N";
										"-" === r && (r = "N"), i("1Y" + r)
									}
									else i("1YN")
								}))
							}));
							i("1--")
						}
						catch (e) {
							window.apstag = void 0
						}
					};
				
				function ue(e, t, i, n, r, a, d) {
					var c = a ? "nope" : t;
					if (window.pbjs && window.pbjs.que && window.pbjs.getConfig) {
						var l, A = N()
							, u = n ? oe : ae
							, p = 0
							, h = function () {
								var n, r, h, m;
								if (!(--p > 0)) try {
									O.Z.dispatchEvent(o.Z.ads.prebidRequested);
									var g = window.pbjs.adUnits.filter((function (e) {
										return e.code === u
									}))[0];
									if ("undefined" === g) return console.error("Video-ad-unit not found, did you give it the adunit.code='video' value?"), void e.requestAd(c);
									var v = window.pbjs.adServers.dfp.buildVideoUrl({
											adUnit: g
											, params: {
												iu: (0, L.Z)("iu", t)
												, sz: "640x360|640x480"
												, output: "vast"
												, cust_params: i
												, description_url: A
												, url: A
											}
										})
										, f = window.pbjs.getHighestCpmBids(u)
										, b = void 0;
									if (f.length > 0 && (b = f[0]), window.pbjs.markWinningBidAsUsed({
											adUnitCode: u
										}), l && (v = v.replace("cust_params=", "cust_params=" + l + "%26")), b && (null === (r = null === (n = null == b ? void 0 : b.meta) || void 0 === n ? void 0 : n.advertiserDomains) || void 0 === r ? void 0 : r.length) > 0 && O.Z.setVideoDataAnnotations({
											adDomain: b.meta.advertiserDomains.join(",")
										}), a) {
										if (l) {
											var k = function (e) {
												var t = decodeURIComponent(e)
													, i = (0, L.Z)("amznbid", t);
												if (!i) return null;
												var n = K[i];
												return n ? {
													bid: n
													, vast: "https://aax.amazon-adsystem.com/e/dtb/vast?b=" + (0, L.Z)("amzniid", t) + "&rnd=" + Math.round(1e10 * Math.random()) + "&pp=" + i
												} : null
											}(l);
											k && (!b || !b.videoCacheKey || b.cpm < k.bid) && (b = {
												cpm: k.bid
												, vast: k.vast
												, bidder: "amazon"
												, videoCacheKey: "amazon"
											})
										}
										if (1 !== d && (!b || !b.videoCacheKey || b.cpm < W())) {
											var y = 5;
											"ninja.io" !== (null === (h = null === window || void 0 === window ? void 0 : window.location) || void 0 === h ? void 0 : h.hostname) && "makeitmeme.com" !== (null === (m = null === window || void 0 === window ? void 0 : window.location) || void 0 === m ? void 0 : m.hostname) || (y = function () {
												var e = s.Z.country;
												return "US" === e ? 6.1 : V.includes(e) ? .5 : Q.includes(e) ? .15 : F.includes(e) ? .08 : H.includes(e) ? .03 : .02
											}()), b = {
												cpm: y
												, vast: X()
												, bidder: "poki"
												, videoCacheKey: "poki"
											}
										}
										if (!b || !b.videoCacheKey) return void O.Z.dispatchEvent(1 === d ? o.Z.ads.video.error : o.Z.ads.completed, {
											rewardAllowed: !1
										});
										switch (b.bidder) {
										case "onetag":
											v = "https://onetag-sys.com/invocation/?key=" + b.videoCacheKey;
											break;
										case "rubicon":
											v = "https://prebid-server.rubiconproject.com/cache?uuid=" + b.videoCacheKey;
											break;
										case "spotx":
											v = "https://search.spotxchange.com/ad/vast.html?key=" + b.videoCacheKey;
											break;
										case "amazon":
										case "poki":
											v = b.vast;
											break;
										default:
											v = "https://prebid.adnxs.com/pbc/v1/cache?uuid=" + b.videoCacheKey
										}(0, G.Z)({
											event: "video-ready"
											, bidder: null == b ? void 0 : b.bidder
											, bid: null == b ? void 0 : b.cpm
										}), O.Z.setVideoDataAnnotations({
											p4d_game_id: s.Z.gameID
											, p4d_version_id: s.Z.versionID
											, bidder: null == b ? void 0 : b.bidder
											, bid: null == b ? void 0 : b.cpm
										})
									}
									O.Z.setVideoDataAnnotations({
										pokiAdServer: a
										, adTagUrl: v
									}), b ? O.Z.setVideoDataAnnotations({
										prebidBidder: null == b ? void 0 : b.bidder
										, prebidBid: null == b ? void 0 : b.cpm
									}) : O.Z.setVideoDataAnnotations({
										prebidBidder: void 0
										, prebidBid: void 0
									}), e.requestAd(v)
								}
								catch (t) {
									e.requestAd(c)
								}
							};
						if (le && p++, de && p++, le) try {
							window.apstag.fetchBids({
								slots: [{
									slotID: n ? "Rewarded" : "Midroll"
									, mediaType: "video"
								}]
								, timeout: 1500
							}, (function (e) {
								e.length > 0 && (l = e[0].encodedQsParams), h()
							}))
						}
						catch (e) {
							h()
						}
						a && (0, G.Z)({
							event: "video-request"
						}), de && window.pbjs.que.push((function () {
							window.pbjs.requestBids({
								adUnitCodes: [u]
								, bidsBackHandler: function () {
									h()
								}
							})
						}))
					}
					else e.requestAd(c)
				}
				
				function pe() {
					var e, t = (null === (e = null === window || void 0 === window ? void 0 : window.location) || void 0 === e ? void 0 : e.hostname) || "";
					return "yes" === (0, L.Z)("poki-ad-server") ? (console.log("DEBUG: Only running Poki-ad-server"), !0) : "localhost" !== t && "game-cdn.poki.com" !== t && !t.endsWith(".poki-gdn.com") && ("ninja.io" === t ? Math.random() <= .5 : "venge.io" === t && Math.random() <= .05)
				}
				var he, me = !1
					, ge = s.Z.testVideos
					, ve = s.Z.device
					, fe = ge ? "/6062/sanghan_rweb_ad_unit" : "/21682198607/" + ve + "_ingame_rewarded_google/" + s.Z.siteID + "_" + ve + "_ingame_rewarded_google"
					, be = function (e) {
						"desktop" !== ve ? window.googletag.cmd.push((function () {
							a.Z.track(o.Z.tracking.ads.rewardedWeb.request)
								, function (e) {
									googletag.defineOutOfPageSlot && (he && googletag.destroySlots([he]), he = googletag.defineOutOfPageSlot(fe, googletag.enums.OutOfPageFormat.REWARDED)
										.addService(googletag.pubads()), googletag.enableServices(), Object.keys(e)
										.forEach((function (t) {
											var i, n = e[t];
											"" !== n && (null === (i = null == he ? void 0 : he.setTargeting) || void 0 === i || i.call(he, t, n))
										})))
								}(e), he ? window.googletag.cmd.push((function () {
									window.googletag.display(he)
								})) : O.Z.dispatchEvent(o.Z.ads.video.startHouseAdFlow)
						})) : O.Z.dispatchEvent(o.Z.ads.video.startHouseAdFlow)
					}
					, ke = function () {
						function e(e, t) {
							var i = this;
							void 0 === t && (t = {}), this.retries = 0, this.running = !1, this.ima = e, this.siteID = s.Z.siteID || 3, this.country = s.Z.country || "ZZ", this.usePokiAdserver = pe(), this.totalRetries = t.totalRetries || M.waterfallRetries || 1, this.timing = t.timing || new R(M.adTiming), O.Z.addEventListener(o.Z.ads.video.error, this.moveThroughWaterfall.bind(this)), O.Z.addEventListener(o.Z.ads.video.loaderError, this.moveThroughWaterfall.bind(this)), O.Z.addEventListener(o.Z.ads.ready, this.timing.stopWaterfallTimer.bind(this.timing)), O.Z.addEventListener(o.Z.ads.started, this.stopWaterfall.bind(this)), O.Z.addEventListener(o.Z.ads.video.startHouseAdFlow, (function () {
								i.startHouseAdFlow()
							}))
						}
						return e.prototype.moveThroughWaterfall = function () {
							if (this.runningBackfill) return this.runningBackfill = !1, void O.Z.dispatchEvent(o.Z.ads.error, {
								message: "Backfilling failed"
								, rewardAllowed: !1
							});
							if (!1 !== this.running) {
								var e = this.totalRetries;
								if (this.timing.stopWaterfallTimer(), this.retries < e) return this.timing.nextWaterfallTimer(), void this.requestAd();
								this.running = !1, this.timing.resetWaterfallTimerIdx(), this.rewarded ? be(this.criteria) : O.Z.dispatchEvent(o.Z.ads.error, {
									message: "No ads"
								})
							}
						}, e.prototype.cutOffWaterfall = function () {
							this.ima.tearDown(), this.moveThroughWaterfall()
						}, e.prototype.buildAdUnitPaths = function (e) {
							var t = s.Z.device
								, i = "midroll";
							if ((0, L.Z)("noFill")) return ["junk", "junk"];
							if (d.Z.debug) {
								var n = "/21682198607/debug-video/";
								return e === o.Z.ads.position.rewarded ? [n + "debug-video-rewarded"] : e === o.Z.ads.position.preroll ? [n + "debug-video-preroll"] : [n + "debug-video-midroll"]
							}
							e === o.Z.ads.position.rewarded && (i = "rewarded");
							var r = "/21682198607/";
							return s.Z.isPokiIframe ? ["" + r + t + "_ingame_" + i + "_1/" + this.siteID + "_" + t + "_ingame_" + i + "_1", "" + r + t + "_ingame_" + i + "_2/" + this.siteID + "_" + t + "_ingame_" + i + "_2"] : [r + "external_" + t + "_video_1/external_" + t + "_ingame_" + i + "_1", r + "external_" + t + "_video_2/external_" + t + "_ingame_" + i + "_2"]
						}, e.prototype.startHouseAdFlow = function () {
							var e = X();
							O.Z.setVideoDataAnnotations({
								pokiAdServer: !0
								, adTagUrl: e
								, bidder: "poki"
								, bid: 0
							}), (0, G.Z)({
								event: "video-request"
							}), this.ima.requestAd(e), this.runningBackfill = !0
						}, e.prototype.start = function (e, t) {
							void 0 === e && (e = {}), this.running = !0, this.retries = 0, this.criteria = e, this.timing.resetWaterfallTimerIdx(), this.rewarded = t === o.Z.ads.position.rewarded, this.adUnitPaths = this.buildAdUnitPaths(t), this.requestAd()
						}, e.prototype.requestAd = function () {
							this.timing.startWaterfallTimer(this.cutOffWaterfall.bind(this)), this.retries++, this.criteria.waterfall = this.retries, this.runningBackfill = !1;
							var e = (this.retries - 1) % this.adUnitPaths.length
								, t = this.adUnitPaths[e]
								, i = "https://securepubads.g.doubleclick.net/gampad/ads?sz=640x360|640x480&iu=" + t + "&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast4&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}"
								, n = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) > 970;
							this.criteria.billboards_fit = n ? "yes" : "no";
							var r, a, d = function (e) {
								var t = N();
								return (e = (e = e.split("{url}")
											.join(t))
										.split("{descriptionUrl}")
										.join(t))
									.split("{timestamp}")
									.join((new Date)
										.getTime()
										.toString())
							}(i) + (r = this.criteria, a = "", Object.keys(r)
								.forEach((function (e) {
									if (Object.prototype.hasOwnProperty.call(r, e)) {
										var t = r[e];
										Array.isArray(t) && (t = t.join()), a += e + "=" + t + "&"
									}
								})), "&cust_params=" + (a = encodeURIComponent(a)) + "&");
							s.Z.childDirected && (d += "&tfcd=1"), s.Z.nonPersonalized && (d += "&npa=1"), O.Z.setVideoDataAnnotations({
								adUnitPath: t
								, adTagUrl: d
								, waterfall: this.retries
								, size: "640x360v"
							}), O.Z.dispatchEvent(o.Z.ads.requested), this.usePokiAdserver ? (console.debug("adRequest started with Prebid Video enabled (" + this.retries + "/" + this.totalRetries + ")"), ue(this.ima, d, this.criteria, this.rewarded, this.country, !0, this.retries)) : 1 === this.retries ? (console.debug("adRequest started with Prebid Video enabled (" + this.retries + "/" + this.totalRetries + ")"), ue(this.ima, d, this.criteria, this.rewarded, this.country, !1, this.retries)) : (console.debug("adRequest started in plain mode (" + this.retries + "/" + this.totalRetries + ")"), this.ima.requestAd(d))
						}, e.prototype.isRunning = function () {
							return this.running
						}, e.prototype.stopWaterfall = function () {
							this.running = !1, this.timing.stopWaterfallTimer(), this.timing.resetWaterfallTimerIdx()
						}, e
					}();
				const ye = ke;
				var we = "pokiSdkContainer"
					, Ze = "pokiSdkFixed"
					, Ie = "pokiSdkOverlay"
					, Se = "pokiSdkHidden"
					, Ee = "pokiSdkInsideContainer"
					, xe = "pokiSdkPauseButton"
					, Ce = "pokiSdkPauseButtonBG"
					, _e = "pokiSdkStartAdButton"
					, Te = "pokiSdkProgressBar"
					, Pe = "pokiSdkProgressContainer"
					, Be = "pokiSdkSpinnerContainer"
					, De = "pokiSdkVideoContainer"
					, je = "pokiSdkVisible"
					, ze = "pokiSDKAdContainer"
					, Me = function (e, t, i) {
						if (i || 2 === arguments.length)
							for (var n, r = 0, o = t.length; r < o; r++) !n && r in t || (n || (n = Array.prototype.slice.call(t, 0, r)), n[r] = t[r]);
						return e.concat(n || Array.prototype.slice.call(t))
					}
					, Oe = function () {
						function e(e) {
							var t = this;
							if (this.hideElement = function (e) {
									e.classList.add(Se), e.classList.remove(je)
								}, this.showElement = function (e) {
									e.classList.add(je), e.classList.remove(Se)
								}, this.progressFaker = new Le((function (e) {
									return t.updateProgressBar(e)
								})), this.progressFaker.queueFakeProgress(10, 1e3, o.Z.ads.prebidRequested), this.progressFaker.queueFakeProgress(20, 2e3, o.Z.ads.started), this.createElements(e.wrapper), "undefined" != typeof window && document) {
								var i = document.createElement("style");
								i.innerHTML = "\n.pokiSdkContainer {\n\toverflow: hidden;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 1000;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}\n\n.pokiSdkContainer.pokiSdkFixed {\n\tposition: fixed;\n}\n\n.pokiSdkContainer.pokiSdkVisible {\n\tdisplay: block;\n}\n\n.pokiSdkContainer.pokiSdkHidden,\n.pokiSdkSpinnerContainer.pokiSdkHidden {\n\tdisplay: none;\n}\n\n.pokiSdkContainer.pokiSdkHidden,\n.pokiSdkSpinnerContainer {\n\tpointer-events: none;\n}\n\n.pokiSdkSpinnerContainer {\n\tz-index: 10;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground: url('https://a.poki.com/images/thumb_anim_2x.gif') 50% 50% no-repeat;\n\tuser-select: none;\n}\n\n.pokiSdkInsideContainer {\n\tbackground: #000;\n\tposition: relative;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\n\topacity: 0;\n\t-webkit-transition: opacity 0.5s ease-in-out;\n\t-moz-transition: opacity 0.5s ease-in-out;\n\t-ms-transition: opacity 0.5s ease-in-out;\n\t-o-transition: opacity 0.5s ease-in-out;\n\ttransition: opacity 0.5s ease-in-out;\n}\n\n.pokiSdkContainer.pokiSdkVisible .pokiSdkInsideContainer {\n\topacity: 1;\n}\n\n.pokiSDKAdContainer, .pokiSdkVideoContainer {\n\tposition: absolute;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.pokiSdkStartAdButton {\n\tposition: absolute;\n\tz-index: 9999;\n\ttop: 0;\n\n\tpadding-top: 10%;\n\twidth: 100%;\n\theight: 100%;\n\ttext-align: center;\n\tcolor: #FFF;\n\n\tfont: 700 15pt 'Arial', sans-serif;\n\tfont-weight: bold;\n\tletter-spacing: 1px;\n\ttransition: 0.1s ease-in-out;\n\tline-height: 1em;\n}\n\n.pokiSdkPauseButton {\n\tcursor:pointer;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    z-index: 1;\n}\n\n.pokiSdkPauseButton:before {\n\tcontent: '';\n\tposition: absolute;\n\twidth: 100px;\n\theight: 100px;\n\tdisplay: block;\n\tborder: 2px solid #fff;\n\tborder-radius: 50%;\n\tuser-select: none;\n\tbackground-color: rgba(0, 0, 0, 0.6);\n\ttransition: background-color 0.5s ease;\n\tanimation: 1s linear infinite pokiPulse;\n}\n\n.pokiSdkPauseButton:after {\n\tcontent: '';\n\tposition: absolute;\n\tdisplay: block;\n\tbox-sizing: border-box;\n\tborder-color: transparent transparent transparent #fff;\n\tborder-style: solid;\n\tborder-width: 26px 0 26px 40px;\n\tpointer-events: none;\n\tanimation: 1s linear infinite pokiPulse;\n\tleft: 6px;\n}\n.pokiSdkPauseButtonBG {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    content: '';\n    background: rgba(0, 43, 80, 0.5);\n    width: 100%;\n    height: 100%;\n}\n\n.pokiSdkPauseButtonBG:hover{\n\tbackground: rgba(0, 43, 80, 0.7);\n}\n\n@keyframes pokiPulse {\n\t0% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n\t70% {\n\t\ttransform: translate(-50%, -50%) scale(1.1);\n\t}\n\t100% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n}\n\n.pokiSdkProgressContainer {\n\tbackground: #B8C7DD;\n\twidth: 100%;\n\theight: 5px;\n\tposition: absolute;\n\tbottom: 0;\n\tz-index: 9999;\n}\n\n.pokiSdkProgressBar {\n\tposition:relative;\n\tbottom:0px;\n\tbackground: #FFDC00;\n\theight: 100%;\n\twidth: 0%;\n\ttransition: width 0.5s;\n\ttransition-timing-function: linear;\n}\n\n.pokiSdkProgressBar.pokiSdkVisible, .pokiSdkPauseButton.pokiSdkVisible, .pokiSdkStartAdButton.pokiSdkVisible {\n\tdisplay: block;\n\tpointer-events: auto;\n}\n\n.pokiSdkProgressBar.pokiSdkHidden, .pokiSdkPauseButton.pokiSdkHidden, .pokiSdkStartAdButton.pokiSdkHidden {\n\tdisplay: none;\n\tpointer-events: none;\n}\n", document.head.appendChild(i)
							}
						}
						return e.prototype.updateProgressBar = function (e) {
							this.progressBar.style.width = e + "%"
						}, e.prototype.setupEvents = function (e) {
							this.monetization = e
						}, e.prototype.hide = function () {
							this.hideElement(this.containerDiv), this.hideElement(this.progressContainer), this.hidePauseButton(), this.hideElement(this.startAdButton), this.containerDiv.classList.remove(Ie), this.progressBar.style.width = "0%", this.progressFaker.reset()
						}, e.prototype.hideSpinner = function () {
							this.hideElement(this.spinnerContainer)
						}, e.prototype.show = function () {
							this.containerDiv.classList.add(Ie), this.showElement(this.containerDiv), this.showElement(this.spinnerContainer), this.showElement(this.progressContainer), this.progressFaker.start()
						}, e.prototype.getVideoBounds = function () {
							return this.adContainer.getBoundingClientRect()
						}, e.prototype.getAdContainer = function () {
							return this.adContainer
						}, e.prototype.getVideoContainer = function () {
							return this.videoContainer
						}, e.prototype.showPauseButton = function () {
							this.showElement(this.pauseButton), this.monetization && this.pauseButton.addEventListener("click", this.monetization.resumeAd.bind(this.monetization))
						}, e.prototype.hidePauseButton = function () {
							this.hideElement(this.pauseButton), this.monetization && this.pauseButton.removeEventListener("click", this.monetization.resumeAd.bind(this.monetization))
						}, e.prototype.showStartAdButton = function () {
							this.showElement(this.startAdButton), this.monetization && this.startAdButton.addEventListener("click", this.monetization.startAdClicked.bind(this.monetization))
						}, e.prototype.hideStartAdButton = function () {
							this.hideElement(this.startAdButton), this.monetization && this.startAdButton.removeEventListener("click", this.monetization.startAdClicked.bind(this.monetization))
						}, e.prototype.createElements = function (e) {
							var t = this;
							this.containerDiv = document.createElement("div"), this.insideContainer = document.createElement("div"), this.pauseButton = document.createElement("div"), this.pauseButtonBG = document.createElement("div"), this.startAdButton = document.createElement("div"), this.progressBar = document.createElement("div"), this.progressContainer = document.createElement("div"), this.spinnerContainer = document.createElement("div"), this.adContainer = document.createElement("div"), this.videoContainer = document.createElement("video"), this.adContainer.id = "pokiSDKAdContainer", this.videoContainer.id = "pokiSDKVideoContainer", this.containerDiv.className = we, this.insideContainer.className = Ee, this.pauseButton.className = xe, this.pauseButtonBG.className = Ce, this.pauseButton.appendChild(this.pauseButtonBG), this.startAdButton.className = _e, this.startAdButton.innerHTML = "Tap anywhere to play ad", this.progressBar.className = Te, this.progressContainer.className = Pe, this.spinnerContainer.className = Be, this.adContainer.className = ze, this.videoContainer.className = De, this.hide(), this.videoContainer.setAttribute("playsinline", "playsinline"), this.videoContainer.setAttribute("muted", "muted"), this.containerDiv.appendChild(this.insideContainer), this.containerDiv.appendChild(this.spinnerContainer), this.insideContainer.appendChild(this.progressContainer), this.insideContainer.appendChild(this.videoContainer), this.insideContainer.appendChild(this.adContainer), this.containerDiv.appendChild(this.pauseButton), this.containerDiv.appendChild(this.startAdButton), this.progressContainer.appendChild(this.progressBar);
							var i = e || null
								, n = function () {
									if (i || (i = document.body), i)
										if (i.appendChild(t.containerDiv), i === document.body) t.containerDiv.classList.add(Ze);
										else {
											var e = window.getComputedStyle(i)
												.position;
											e && -1 !== ["absolute", "fixed", "relative"].indexOf(e) || (i.style.position = "relative")
										}
									else window.requestAnimationFrame(n)
								};
							!i || i instanceof HTMLElement || (i = null, console.error("POKI-SDK: wrapper is not a HTMLElement, falling back to document.body")), n()
						}, e
					}();
				const Re = Oe;
				var Le = function () {
						function e(e) {
							var t = this;
							this.storedQueue = [], this.progressCallback = e, this.reset(), O.Z.addEventListener(o.Z.ads.video.progress, (function (e) {
								var i = 100 - t.currentProgress
									, n = e.currentTime / e.duration * i;
								n < i && t.progressCallback(t.currentProgress + n)
							})), this.initializeNoProgressFix()
						}
						return e.prototype.queueFakeProgress = function (e, t, i) {
							var n = this;
							this.storedQueue.push({
								progressToFake: e
								, duration: t
								, stopEvent: i
							}), O.Z.addEventListener(i, (function () {
								n.eventWatcher[i] = !0, n.currentProgress = n.startProgress + e, n.startProgress = n.currentProgress, n.progressCallback(n.currentProgress), n.activeQueue.shift(), n.activeQueue.length > 0 ? n.continue() : n.pause()
							}))
						}, e.prototype.fakeProgress = function (e, t, i) {
							this.activeQueue.push({
								progressToFake: e
								, duration: t
								, stopEvent: i
							}), this.fakeProgressEvents = !0, this.continue()
						}, e.prototype.start = function () {
							this.activeQueue.length > 0 || (this.activeQueue = Me([], this.storedQueue, !0), this.active = !0, this.continue())
						}, e.prototype.continue = function () {
							if (this.activeQueue.length > 0 && !this.tickInterval) {
								this.startTime = Date.now();
								this.tickInterval = window.setInterval(this.tick.bind(this), 50), this.active = !0
							}
						}, e.prototype.pause = function () {
							this.clearInterval()
						}, e.prototype.tick = function () {
							var e = this.activeQueue[0]
								, t = Date.now() - this.startTime
								, i = Math.min(t / e.duration, 1);
							this.currentProgress = this.startProgress + e.progressToFake * i, this.fakeProgressEvents && O.Z.dispatchEvent(o.Z.ads.video.progress, {
								duration: e.duration / 1e3
								, currentTime: t / 1e3
							}), this.progressCallback(this.currentProgress), (this.eventWatcher[e.stopEvent] || 1 === i) && this.pause()
						}, e.prototype.clearInterval = function () {
							this.tickInterval && (clearInterval(this.tickInterval), this.tickInterval = 0)
						}, e.prototype.initializeNoProgressFix = function () {
							var e = this;
							O.Z.addEventListener(o.Z.ads.started, (function (t) {
								e.progressWatcherTimeout = window.setTimeout((function () {
									if (e.active) {
										var i = 100 - e.currentProgress
											, n = 1e3 * t.duration - 1e3;
										e.fakeProgress(i, n, o.Z.ads.completed)
									}
								}), 1e3)
							})), O.Z.addEventListener(o.Z.ads.video.progress, (function () {
								e.progressWatcherTimeout && (clearTimeout(e.progressWatcherTimeout), e.progressWatcherTimeout = 0)
							}))
						}, e.prototype.reset = function () {
							this.eventWatcher = {}, this.startProgress = 0, this.startTime = 0, this.currentProgress = 0, this.activeQueue = [], this.active = !1, this.fakeProgressEvents = !1, this.clearInterval()
						}, e
					}()
					, Ge = i(662)
					, Ne = function (e, t, i, n) {
						return new(i || (i = Promise))((function (r, o) {
							function a(e) {
								try {
									d(n.next(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function s(e) {
								try {
									d(n.throw(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function d(e) {
								var t;
								e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function (e) {
										e(t)
									})))
									.then(a, s)
							}
							d((n = n.apply(e, t || []))
								.next())
						}))
					}
					, Ue = function (e, t) {
						var i, n, r, o, a = {
							label: 0
							, sent: function () {
								if (1 & r[0]) throw r[1];
								return r[1]
							}
							, trys: []
							, ops: []
						};
						return o = {
							next: s(0)
							, throw: s(1)
							, return: s(2)
						}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
							return this
						}), o;
						
						function s(o) {
							return function (s) {
								return function (o) {
									if (i) throw new TypeError("Generator is already executing.");
									for (; a;) try {
										if (i = 1, n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, o[1]))
											.done) return r;
										switch (n = 0, r && (o = [2 & o[0], r.value]), o[0]) {
										case 0:
										case 1:
											r = o;
											break;
										case 4:
											return a.label++, {
												value: o[1]
												, done: !1
											};
										case 5:
											a.label++, n = o[1], o = [0];
											continue;
										case 7:
											o = a.ops.pop(), a.trys.pop();
											continue;
										default:
											if (!(r = a.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
												a = 0;
												continue
											}
											if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
												a.label = o[1];
												break
											}
											if (6 === o[0] && a.label < r[1]) {
												a.label = r[1], r = o;
												break
											}
											if (r && a.label < r[2]) {
												a.label = r[2], a.ops.push(o);
												break
											}
											r[2] && a.ops.pop(), a.trys.pop();
											continue
										}
										o = t.call(e, a)
									}
									catch (e) {
										o = [6, e], n = 0
									}
									finally {
										i = r = 0
									}
									if (5 & o[0]) throw o[1];
									return {
										value: o[0] ? o[1] : void 0
										, done: !0
									}
								}([o, s])
							}
						}
					};
				const qe = function () {
					function e(e) {
						var t = this;
						this.bannerTimeout = null, this.allowedToPlayAd = !1, this.runningAd = !1, this.completeOnce = !1, this.videoStarted = !1, this.currentWidth = 640, this.currentHeight = 480, this.currentRequestIsMuted = !1, this.volume = 1, this.canWeAutoPlayWithSound = function () {
							return Ne(t, void 0, void 0, (function () {
								return Ue(this, (function (e) {
									switch (e.label) {
									case 0:
										if (!this.blankVideo) return [2, !1];
										e.label = 1;
									case 1:
										return e.trys.push([1, 3, , 4]), [4, this.blankVideo.play()];
									case 2:
										return e.sent(), [2, !0];
									case 3:
										return e.sent(), [2, !1];
									case 4:
										return [2]
									}
								}))
							}))
						}, this.videoElement = document.getElementById("pokiSDKVideoContainer"), this.adsManager = null, this.volume = e, this.initAdDisplayContainer(), this.initBlankVideo(), this.initAdsLoader()
					}
					return e.prototype.initAdDisplayContainer = function () {
						this.adDisplayContainer || window.google && (this.adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById("pokiSDKAdContainer"), this.videoElement))
					}, e.prototype.initBlankVideo = function () {
						this.blankVideo = document.createElement("video"), this.blankVideo.setAttribute("playsinline", "playsinline");
						var e = document.createElement("source");
						e.src = "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw", this.blankVideo.appendChild(e)
					}, e.prototype.initAdsLoader = function () {
						var e = this;
						this.adsLoader || window.google && (this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer), this.adsLoader.getSettings()
							.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE), this.adsLoader.getSettings()
							.setDisableCustomPlaybackForIOS10Plus(!0), this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded, !1, this), this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdLoaderError, !1, this), this.videoElement.addEventListener("onended", (function () {
								return e.adsLoader.contentComplete()
							})))
					}, e.prototype.requestAd = function (e) {
						return Ne(this, void 0, void 0, (function () {
							var t;
							return Ue(this, (function (i) {
								switch (i.label) {
								case 0:
									return this.runningAd ? [2] : (this.runningAd = !0, this.completeOnce = !0, this.videoStarted = !1, this.adDisplayContainer.initialize(), this.videoElement.src = "", (t = new google.ima.AdsRequest)
										.adTagUrl = e, t.linearAdSlotWidth = this.currentWidth, t.linearAdSlotHeight = this.currentHeight, t.nonLinearAdSlotWidth = this.currentWidth, t.nonLinearAdSlotHeight = this.currentHeight, t.forceNonLinearFullSlot = !0, [4, this.canWeAutoPlayWithSound()]);
								case 1:
									return i.sent() ? (t.setAdWillPlayMuted(!1), this.currentRequestIsMuted = !1) : (t.setAdWillPlayMuted(!0), this.currentRequestIsMuted = !0), this.allowedToPlayAd = !0, this.adsLoader.requestAds(t), [2]
								}
							}))
						}))
					}, e.prototype.resize = function (e, t, i) {
						void 0 === i && (i = google.ima.ViewMode.NORMAL), this.currentWidth = e, this.currentHeight = t, this.adsManager && this.adsManager.resize(e, t, i)
					}, e.prototype.onAdsManagerLoaded = function (e) {
						var t = new google.ima.AdsRenderingSettings;
						t.enablePreloading = !0, t.restoreCustomPlaybackStateOnAdBreakComplete = !0, t.mimeTypes = U() || (0, T.Z)() || (0, B.Z)() ? ["video/mp4"] : ["video/mp4", "video/webm", "video/ogg"], t.loadVideoTimeout = 8e3, this.adsManager = e.getAdsManager(this.videoElement, t), this.adsManager.setVolume(Math.max(0, Math.min(1, this.volume))), this.currentRequestIsMuted && this.adsManager.setVolume(0), this.allowedToPlayAd ? (this.attachAdEvents(), O.Z.dispatchEvent(o.Z.ads.ready)) : this.tearDown()
					}, e.prototype.setVolume = function (e) {
						this.volume = e, this.adsManager && this.adsManager.setVolume(Math.max(0, Math.min(1, this.volume)))
					}, e.prototype.startPlayback = function () {
						try {
							this.adsManager.init(this.currentWidth, this.currentHeight, google.ima.ViewMode.NORMAL), this.adsManager.start()
						}
						catch (e) {
							this.videoElement.play()
						}
					}, e.prototype.startIOSPlayback = function () {
						this.adsManager.start()
					}, e.prototype.stopPlayback = function () {
						O.Z.dispatchEvent(o.Z.ads.stopped), this.tearDown()
					}, e.prototype.resumeAd = function () {
						O.Z.dispatchEvent(o.Z.ads.video.resumed), this.adsManager && this.adsManager.resume()
					}, e.prototype.tearDown = function () {
						this.adsManager && (this.adsManager.stop(), this.adsManager.destroy(), this.adsManager = null), null !== this.bannerTimeout && (clearTimeout(this.bannerTimeout), this.bannerTimeout = null), this.adsLoader && (this.adsLoader.contentComplete(), this.adsLoader.destroy(), this.adsLoader = null, this.initAdsLoader()), this.completeOnce = !1, this.runningAd = !1
					}, e.prototype.attachAdEvents = function () {
						var e = this
							, t = google.ima.AdEvent.Type;
						this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, !1, this), [t.AD_PROGRESS, t.ALL_ADS_COMPLETED, t.CLICK, t.COMPLETE, t.IMPRESSION, t.PAUSED, t.SKIPPED, t.STARTED, t.USER_CLOSE, t.AD_BUFFERING].forEach((function (t) {
							e.adsManager.addEventListener(t, e.onAdEvent, !1, e)
						}))
					}, e.prototype.onAdEvent = function (e) {
						var t = this
							, i = e.getAd();
						switch (e.type) {
						case google.ima.AdEvent.Type.AD_PROGRESS:
							O.Z.dispatchEvent(o.Z.ads.video.progress, e.getAdData());
							break;
						case google.ima.AdEvent.Type.STARTED:
							e.remainingTime = this.adsManager.getRemainingTime(), e.remainingTime <= 0 && (e.remainingTime = 15), this.videoStarted = !0, i.isLinear() || (this.bannerTimeout = window.setTimeout((function () {
								t.completeOnce && (t.completeOnce = !1, O.Z.dispatchEvent(o.Z.ads.completed, {
									rewardAllowed: t.videoStarted && e.rewardAllowed
								})), t.tearDown()
							}), 1e3 * (e.remainingTime + 1))), O.Z.setVideoDataAnnotations({
								creativeId: i.getCreativeId()
							}), O.Z.dispatchEvent(o.Z.ads.started, {
								duration: i.getDuration()
							});
							break;
						case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
						case google.ima.AdEvent.Type.COMPLETE:
							this.completeOnce && (this.completeOnce = !1, O.Z.dispatchEvent(o.Z.ads.completed, {
								rewardAllowed: this.videoStarted
							})), this.tearDown();
							break;
						case google.ima.AdEvent.Type.USER_CLOSE:
							this.completeOnce && (this.completeOnce = !1, O.Z.dispatchEvent(o.Z.ads.completed, {
								rewardAllowed: !1
							})), this.tearDown();
							break;
						case google.ima.AdEvent.Type.PAUSED:
							this.adsManager.pause(), O.Z.dispatchEvent(o.Z.ads.video.paused);
							break;
						case google.ima.AdEvent.Type.AD_BUFFERING:
							O.Z.dispatchEvent(o.Z.ads.video.buffering);
							break;
						case google.ima.AdEvent.Type.CLICK:
							O.Z.dispatchEvent(o.Z.ads.video.clicked);
							break;
						case google.ima.AdEvent.Type.SKIPPED:
							O.Z.dispatchEvent(o.Z.ads.skipped), this.completeOnce && (this.completeOnce = !1, O.Z.dispatchEvent(o.Z.ads.completed, {
								rewardAllowed: this.videoStarted
							})), document.activeElement && document.activeElement.blur();
							break;
						case google.ima.AdEvent.Type.IMPRESSION:
							O.Z.dispatchEvent(o.Z.ads.impression, {
								creativeId: i.getCreativeId()
							})
						}
					}, e.prototype.onAdLoaderError = function (e) {
						this.tearDown();
						var t = null == e ? void 0 : e.getError()
							, i = (null == t ? void 0 : t.toString()) || "Unknown"
							, n = (null == t ? void 0 : t.getErrorCode()) || 0;
						O.Z.dispatchEvent(o.Z.ads.video.loaderError, {
							message: i
							, errorCode: n
						})
					}, e.prototype.onAdError = function (e) {
						this.tearDown();
						var t = null == e ? void 0 : e.getError()
							, i = (null == t ? void 0 : t.toString()) || "Unknown"
							, n = (null == t ? void 0 : t.getErrorCode()) || 0;
						O.Z.dispatchEvent(o.Z.ads.video.error, {
							message: i
							, errorCode: n
						})
					}, e.prototype.muteAd = function () {
						void 0 !== this.adsManager && null != this.adsManager && this.adsManager.setVolume(0)
					}, e.prototype.isAdRunning = function () {
						return this.runningAd
					}, e
				}();
				var Ve = function (e, t, i, n) {
						return new(i || (i = Promise))((function (r, o) {
							function a(e) {
								try {
									d(n.next(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function s(e) {
								try {
									d(n.throw(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function d(e) {
								var t;
								e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function (e) {
										e(t)
									})))
									.then(a, s)
							}
							d((n = n.apply(e, t || []))
								.next())
						}))
					}
					, Qe = function (e, t) {
						var i, n, r, o, a = {
							label: 0
							, sent: function () {
								if (1 & r[0]) throw r[1];
								return r[1]
							}
							, trys: []
							, ops: []
						};
						return o = {
							next: s(0)
							, throw: s(1)
							, return: s(2)
						}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
							return this
						}), o;
						
						function s(o) {
							return function (s) {
								return function (o) {
									if (i) throw new TypeError("Generator is already executing.");
									for (; a;) try {
										if (i = 1, n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, o[1]))
											.done) return r;
										switch (n = 0, r && (o = [2 & o[0], r.value]), o[0]) {
										case 0:
										case 1:
											r = o;
											break;
										case 4:
											return a.label++, {
												value: o[1]
												, done: !1
											};
										case 5:
											a.label++, n = o[1], o = [0];
											continue;
										case 7:
											o = a.ops.pop(), a.trys.pop();
											continue;
										default:
											if (!(r = a.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
												a = 0;
												continue
											}
											if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
												a.label = o[1];
												break
											}
											if (6 === o[0] && a.label < r[1]) {
												a.label = r[1], r = o;
												break
											}
											if (r && a.label < r[2]) {
												a.label = r[2], a.ops.push(o);
												break
											}
											r[2] && a.ops.pop(), a.trys.pop();
											continue
										}
										o = t.call(e, a)
									}
									catch (e) {
										o = [6, e], n = 0
									}
									finally {
										i = r = 0
									}
									if (5 & o[0]) throw o[1];
									return {
										value: o[0] ? o[1] : void 0
										, done: !0
									}
								}([o, s])
							}
						}
					};
				const Fe = function () {
					var e = window.location.pathname;
					"/" !== e[0] && (e = "/" + e);
					var t = encodeURIComponent(window.location.protocol + "//" + window.location.host + e + window.location.search)
						, i = encodeURIComponent(document.referrer);
					return fetch("https://devs-api.poki.com/gameinfo/@sdk?href=" + t + "&referrer=" + i, {
							method: "GET"
							, headers: {
								"Content-Type": "text/plain"
							}
						})
						.then((function (e) {
							return Ve(void 0, void 0, void 0, (function () {
								var t;
								return Qe(this, (function (i) {
									switch (i.label) {
									case 0:
										return e.status >= 200 && e.status < 400 ? [4, e.json()] : [3, 2];
									case 1:
										return (t = i.sent())
											.game_id ? [2, {
												gameID: t.game_id
												, gameTitle: t.game_name
												, playtestLobbyID: t.playtest_lobby_id
												, cachedContentGameID: t.cached_content_game_id
												, specialConditions: t.ad_settings.special_conditions
												, adTiming: {
													preroll: t.ad_settings.preroll
													, timePerTry: t.ad_settings.time_per_try
													, timeBetweenAds: t.ad_settings.time_between_ads
													, startAdsAfter: t.ad_settings.start_ads_after
												}
											}] : [2, void 0];
									case 2:
										throw e
									}
								}))
							}))
						}))
						.catch((function (e) {
							return function (e) {
								return Ve(this, void 0, void 0, (function () {
									var t, i, n, r, o, a, s, d, c, l, A, u;
									return Qe(this, (function (p) {
										switch (p.label) {
										case 0:
											console.error(e), p.label = 1;
										case 1:
											return p.trys.push([1, 4, , 5]), "/" !== (t = window.location.pathname)[0] && (t = "/" + t), r = (n = JSON)
												.stringify, l = {
													c: "sdk-p4d-error"
													, ve: 7
												}, A = {
													k: "error"
												}, a = (o = JSON)
												.stringify, u = {
													status: e.status
												}, (s = e.json) ? [4, e.json()] : [3, 3];
										case 2:
											s = p.sent(), p.label = 3;
										case 3:
											if (i = r.apply(n, [(l.d = [(A.v = a.apply(o, [(u.json = s, u.body = JSON.stringify({
													href: window.location.protocol + "//" + window.location.host + t + window.location.search
												}), u.name = e.name, u.message = e.message, u)]), A)], l)]), d = "https://t.poki.io/l", navigator.sendBeacon) navigator.sendBeacon(d, i);
											else try {
												(c = new XMLHttpRequest)
												.open("POST", d, !0), c.send(i)
											}
											catch (e) {}
											return [3, 5];
										case 4:
											return p.sent(), [3, 5];
										case 5:
											return [2]
										}
									}))
								}))
							}(e)
						}))
				};
				var He = function (e, t, i, n) {
						return new(i || (i = Promise))((function (r, o) {
							function a(e) {
								try {
									d(n.next(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function s(e) {
								try {
									d(n.throw(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function d(e) {
								var t;
								e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function (e) {
										e(t)
									})))
									.then(a, s)
							}
							d((n = n.apply(e, t || []))
								.next())
						}))
					}
					, We = function (e, t) {
						var i, n, r, o, a = {
							label: 0
							, sent: function () {
								if (1 & r[0]) throw r[1];
								return r[1]
							}
							, trys: []
							, ops: []
						};
						return o = {
							next: s(0)
							, throw: s(1)
							, return: s(2)
						}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
							return this
						}), o;
						
						function s(o) {
							return function (s) {
								return function (o) {
									if (i) throw new TypeError("Generator is already executing.");
									for (; a;) try {
										if (i = 1, n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, o[1]))
											.done) return r;
										switch (n = 0, r && (o = [2 & o[0], r.value]), o[0]) {
										case 0:
										case 1:
											r = o;
											break;
										case 4:
											return a.label++, {
												value: o[1]
												, done: !1
											};
										case 5:
											a.label++, n = o[1], o = [0];
											continue;
										case 7:
											o = a.ops.pop(), a.trys.pop();
											continue;
										default:
											if (!(r = a.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
												a = 0;
												continue
											}
											if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
												a.label = o[1];
												break
											}
											if (6 === o[0] && a.label < r[1]) {
												a.label = r[1], r = o;
												break
											}
											if (r && a.label < r[2]) {
												a.label = r[2], a.ops.push(o);
												break
											}
											r[2] && a.ops.pop(), a.trys.pop();
											continue
										}
										o = t.call(e, a)
									}
									catch (e) {
										o = [6, e], n = 0
									}
									finally {
										i = r = 0
									}
									if (5 & o[0]) throw o[1];
									return {
										value: o[0] ? o[1] : void 0
										, done: !0
									}
								}([o, s])
							}
						}
					};
				
				function Xe() {
					return He(this, void 0, void 0, (function () {
						var e, t, i, n;
						return We(this, (function (r) {
							switch (r.label) {
							case 0:
								return r.trys.push([0, 3, , 4]), [4, fetch("https://geo.poki.io/", {
									method: "GET"
									, headers: {
										"Content-Type": "text/plain"
									}
								})];
							case 1:
								return [4, r.sent()
									.json()];
							case 2:
								return e = r.sent(), t = e.ISO, i = e.ccpaApplies, [2, {
									ISO: t
									, ccpaApplies: i
								}];
							case 3:
								return n = r.sent(), console.error(n), [2, {
									ISO: Ge.D
									, ccpaApplies: !1
								}];
							case 4:
								return [2]
							}
						}))
					}))
				}
				var Ke = function (e, t, i, n) {
						return new(i || (i = Promise))((function (r, o) {
							function a(e) {
								try {
									d(n.next(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function s(e) {
								try {
									d(n.throw(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function d(e) {
								var t;
								e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function (e) {
										e(t)
									})))
									.then(a, s)
							}
							d((n = n.apply(e, t || []))
								.next())
						}))
					}
					, Je = function (e, t) {
						var i, n, r, o, a = {
							label: 0
							, sent: function () {
								if (1 & r[0]) throw r[1];
								return r[1]
							}
							, trys: []
							, ops: []
						};
						return o = {
							next: s(0)
							, throw: s(1)
							, return: s(2)
						}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
							return this
						}), o;
						
						function s(o) {
							return function (s) {
								return function (o) {
									if (i) throw new TypeError("Generator is already executing.");
									for (; a;) try {
										if (i = 1, n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, o[1]))
											.done) return r;
										switch (n = 0, r && (o = [2 & o[0], r.value]), o[0]) {
										case 0:
										case 1:
											r = o;
											break;
										case 4:
											return a.label++, {
												value: o[1]
												, done: !1
											};
										case 5:
											a.label++, n = o[1], o = [0];
											continue;
										case 7:
											o = a.ops.pop(), a.trys.pop();
											continue;
										default:
											if (!(r = a.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
												a = 0;
												continue
											}
											if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
												a.label = o[1];
												break
											}
											if (6 === o[0] && a.label < r[1]) {
												a.label = r[1], r = o;
												break
											}
											if (r && a.label < r[2]) {
												a.label = r[2], a.ops.push(o);
												break
											}
											r[2] && a.ops.pop(), a.trys.pop();
											continue
										}
										o = t.call(e, a)
									}
									catch (e) {
										o = [6, e], n = 0
									}
									finally {
										i = r = 0
									}
									if (5 & o[0]) throw o[1];
									return {
										value: o[0] ? o[1] : void 0
										, done: !0
									}
								}([o, s])
							}
						}
					};
				
				function Ye() {
					var e, t;
					return Ke(this, void 0, void 0, (function () {
						var i, n, r, o, a;
						return Je(this, (function (s) {
							switch (s.label) {
							case 0:
								if ("test" === (null === (t = null === (e = null === window || void 0 === window ? void 0 : window.process) || void 0 === e ? void 0 : e.env) || void 0 === t ? void 0 : t.NODE_ENV)) return [2, {
									blocklist: []
									, countryExclusion: []
									, bidderLimitation: {}
								}];
								s.label = 1;
							case 1:
								return s.trys.push([1, 4, , 5]), [4, fetch("https://api.poki.com/ads/settings", {
									method: "GET"
									, headers: {
										"Content-Type": "application/json"
									}
								})];
							case 2:
								return [4, s.sent()
									.json()];
							case 3:
								return i = s.sent(), n = i.blocklist, r = i.country_exclusion, o = i.bidder_limitation, [2, {
									blocklist: (null == n ? void 0 : n.split(/[\r\n]+/)) || []
									, countryExclusion: (r.split(",") || [])
										.map((function (e) {
											return e.toUpperCase()
										}))
									, bidderLimitation: JSON.parse(o || "{}")
								}];
							case 4:
								return a = s.sent(), console.error(a), [2, {
									blocklist: []
									, countryExclusion: []
									, bidderLimitation: {}
								}];
							case 5:
								return [2]
							}
						}))
					}))
				}
				var $e = function () {
					return $e = Object.assign || function (e) {
						for (var t, i = 1, n = arguments.length; i < n; i++)
							for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
						return e
					}, $e.apply(this, arguments)
				};
				var et = function () {
					function e() {
						this.slotMap = new Map, this.enforceChildSafety = function () {
							window.googletag.cmd.push((function () {
								window.googletag.pubads()
									.setPrivacySettings({
										underAgeOfConsent: !0
										, childDirectedTreatment: !0
										, restrictDataProcessing: !0
									})
							}))
						}, this.enforceNonPersonalized = function () {
							window.googletag.cmd.push((function () {
								window.googletag.pubads()
									.setPrivacySettings({
										nonPersonalizedAds: !0
									})
							}))
						}, this.requestAd = function (e) {
							var t, i;
							a.Z.track(o.Z.tracking.ads.display.requested, {
								size: e.size
								, opportunityId: e.opportunityId
								, adUnitPath: e.adUnitPath
								, duringGameplay: null === (t = e.duringGameplay) || void 0 === t ? void 0 : t.call(e)
								, refresh: e.refreshNumber > 0
								, refreshNumber: e.refreshNumber
								, refreshType: (null === (i = e.criteria) || void 0 === i ? void 0 : i.refreshType) || ""
								, platformAd: e.platformAd
							});
							var n = 0
								, r = ie()
								, s = function () {
									if (!(--n > 0)) {
										if (window.apstag) try {
											window.apstag.setDisplayBids()
										}
										catch (e) {}
										if (r) try {
											window.pbjs.setTargetingForGPTAsync([e.adUnitPath]), e.pbjsTargetting = window.pbjs.getAdserverTargetingForAdUnitCode([e.adUnitPath])
										}
										catch (e) {}
										e.refreshNumber > 0 ? window.googletag.pubads()
											.refresh([e.gptSlot]) : window.googletag.display(e.id)
									}
								};
							if (window.apstag && n++, r && n++, window.apstag) try {
								window.apstag.fetchBids({
									slots: [{
										slotName: e.adUnitPath
										, slotID: e.id
										, sizes: [[e.width, e.height]]
									}]
									, timeout: 1500
								}, (function () {
									s()
								}))
							}
							catch (e) {
								s()
							}
							if (r) try {
								window.pbjs.requestBids({
									adUnitCodes: [e.adUnitPath]
									, bidsBackHandler: function () {
										s()
									}
								})
							}
							catch (e) {
								s()
							}
							window.apstag || r || s()
						}, this.requestHouseAd = function (e, t) {
							var i = $e($e({}, t), {
								dfpIsBackfill: void 0
								, dfpLineItemId: void 0
								, dfpCampaignId: void 0
								, size: e.width + "x" + e.height
								, bidder: "poki"
								, bid: 0
							});
							(0, G.Z)($e($e({}, i), {
								event: "request"
							})), fetch("https://api.poki.com/ads/houseads/display/" + e.width + "x" + e.height + "?game_id=" + s.Z.gameID + "&site=" + s.Z.siteID)
								.then((function (e) {
									return e.json()
								}))
								.then((function (n) {
									e.innerAdContainer.innerHTML = '<a href="' + n.click_through_url + '" target="_blank"><img src="' + n.asset + '" alt="house ad" /></a>', t.houseAdId = n.id, a.Z.track(o.Z.tracking.ads.display.impression, t), (0, G.Z)($e($e({}, i), {
										event: "impression"
									})), setTimeout((function () {
										(0, G.Z)($e($e({}, i), {
											event: "viewable"
										}))
									}), 1e3)
								}))
						}
					}
					return e.prototype.callOnCanDestroy = function (e) {
						var t = this.slotMap.get(e);
						t && !t.onCanDestroyCalled && t.onCanDestroy && (t.onCanDestroyCalled = !0, t.onCanDestroy())
					}, e.prototype.setupSlotRenderEndedListener = function () {
						var e = this;
						window.googletag.cmd.push((function () {
							window.googletag.pubads()
								.addEventListener("slotRenderEnded", (function (t) {
									var i, n, r, s, d, c = t.slot.getSlotElementId()
										, l = e.slotMap.get(c);
									if (l && l.gptSlot) {
										var A = t.slot || {}
											, u = (null === (i = A.getResponseInformation) || void 0 === i ? void 0 : i.call(A)) || {}
											, p = u.isBackfill
											, h = u.lineItemId
											, m = u.campaignId
											, g = function (e) {
												if (!e || "function" != typeof e.indexOf) return null;
												if (-1 !== e.indexOf("amazon-adsystem.com/aax2/apstag")) return null;
												var t = new RegExp('(?:(?:pbjs\\.renderAd\\(document,|adId:*|hb_adid":\\[)|(?:pbadid=)|(?:adId=))[\'"](.*?)["\']', "gi")
													, i = e.replace(/ /g, "")
													, n = t.exec(i);
												return n && n[1] || null
											}(null === (r = (n = A)
												.getHtml) || void 0 === r ? void 0 : r.call(n))
											, v = !!g
											, f = l.pbjsTargetting || {}
											, b = f.hb_bidder
											, k = f.hb_adomain
											, y = function (e) {
												var t, i = {
													cpm: 0
												};
												if (void 0 === window.pbjs || !ie()) return i;
												var n = window.pbjs.getAllWinningBids() || [];
												return ((null === (t = window.pbjs.getBidResponsesForAdUnitCode(e)) || void 0 === t ? void 0 : t.bids) || [])
													.forEach((function (e) {
														!n.find((function (t) {
															return t.adId === e.adId
														})) && e.cpm > i.cpm && (i = e)
													})), i
											}(l.adUnitPath)
											, w = t.isEmpty
											, Z = parseFloat(f.hb_pb);
										isNaN(Z) && (Z = void 0);
										var I = {
											size: l.size
											, opportunityId: l.opportunityId
											, refresh: l.refreshNumber > 0
											, refreshNumber: l.refreshNumber
											, refreshType: (null === (s = l.criteria) || void 0 === s ? void 0 : s.refreshType) || ""
											, duringGameplay: null === (d = l.duringGameplay) || void 0 === d ? void 0 : d.call(l)
											, adUnitPath: l.adUnitPath
											, prebidBid: Z
											, prebidBidder: b
											, prebidWon: v
											, prebidSecondBid: y.cpm > 0 ? y.cpm : void 0
											, prebidSecondBidder: y.bidder
											, dfpIsBackfill: p
											, dfpLineItemId: h
											, dfpCampaignId: m
											, isEmpty: w
											, adDomain: k
											, platformAd: l.platformAd
										};
										l.onDisplayRendered && l.onDisplayRendered(w), w && e.callOnCanDestroy(l.id), w && l.backfillHouseads ? e.requestHouseAd(l, I) : a.Z.track(o.Z.tracking.ads.display.impression, I)
									}
								})), window.googletag.pubads()
								.addEventListener("impressionViewable", (function (t) {
									var i, n, r, s, d = t.slot.getSlotElementId();
									((null === (n = null === (i = null == t ? void 0 : t.slot) || void 0 === i ? void 0 : i.getAdUnitPath()) || void 0 === n ? void 0 : n.includes("ingame_rewarded_google")) || (null === (s = null === (r = null == t ? void 0 : t.slot) || void 0 === r ? void 0 : r.getAdUnitPath()) || void 0 === s ? void 0 : s.includes("sanghan_rweb_ad_unit"))) && a.Z.track(o.Z.tracking.ads.rewardedWeb.impression), setTimeout((function () {
										e.callOnCanDestroy(d)
									}), 1e3 * Math.random())
								}))
						}))
					}, e.prototype.validateDisplaySettings = function (e) {
						return (0, T.Z)() || (0, B.Z)() ? ["320x50"].includes(e) : ["970x250", "300x250", "728x90", "160x600", "320x50"].includes(e)
					}, e.prototype.getDisplaySlotConfig = function (e, t, i) {
						var n = s.Z.device
							, r = t.split("x")
							.map((function (e) {
								return parseInt(e, 10)
							}))
							, o = this.getDisplaySlotID(e);
						if (o) {
							var a = this.slotMap.get(o);
							if (a && a.width === r[0] && a.height === r[1]) return a.refreshNumber++, a;
							this.clearAd(e)
						}
						var c = "/21682198607/debug-display/debug-display-" + t;
						d.Z.debug || (c = s.Z.isPokiIframe ? "/21682198607/" + n + "_ingame_" + t + "/" + s.Z.siteID + "_" + n + "_ingame_" + t : i || "/21682198607/external_" + n + "_display_ingame/external_" + n + "_ingame_" + t);
						var l = "poki-" + j()
							, A = document.createElement("div");
						return A.id = l, A.className = "poki-ad-slot", A.style.width = r[0] + "px", A.style.height = r[1] + "px", A.style.overflow = "hidden", A.style.position = "relative", A.setAttribute("data-poki-ad-size", t), {
							id: l
							, adUnitPath: c
							, size: t
							, width: r[0]
							, height: r[1]
							, refreshNumber: 0
							, onCanDestroyCalled: !1
							, backfillHouseads: !1
							, innerAdContainer: A
							, criteria: {}
							, platformAd: !1
						}
					}, e.prototype.renderAd = function (e) {
						var t, i = this
							, n = e.container
							, r = e.size
							, o = e.opportunityId
							, a = e.criteria
							, s = void 0 === a ? {} : a
							, d = e.adUnitPath
							, c = void 0 === d ? "" : d
							, l = e.duringGameplay
							, A = void 0 === l ? function () {
								return !1
							} : l
							, u = e.onCanDestroy
							, p = void 0 === u ? function () {} : u
							, h = e.onDisplayRendered
							, m = void 0 === h ? function () {} : h
							, g = e.backfillHouseads
							, v = void 0 !== g && g
							, f = e.platformAd
							, b = void 0 !== f && f
							, k = this.getDisplaySlotConfig(n, r, c);
						k.backfillHouseads = v, k.criteria = s, k.platformAd = b, this.slotMap.set(k.id, k), k.opportunityId = o, k.duringGameplay = A, k.onDisplayRendered = m, k.onCanDestroy = p;
						var y = null;
						k.refreshNumber > 0 && (y = k.innerAdContainer), y || (n.appendChild(k.innerAdContainer), n.setAttribute("data-poki-ad-id", k.id)), k.intersectionObserver = new window.IntersectionObserver((function (e) {
							var t;
							e[0].isIntersecting && (null === (t = k.intersectionObserver) || void 0 === t || t.disconnect(), setTimeout((function () {
								i.callOnCanDestroy(k.id)
							}), 6e3), window.googletag.cmd.push((function () {
								var e = i.slotMap.get(k.id);
								e && e.opportunityId === o && (i.setupGPT(k, s), i.requestAd(k))
							})))
						}), {
							threshold: .5
						}), null === (t = k.intersectionObserver) || void 0 === t || t.disconnect(), k.intersectionObserver.observe(k.innerAdContainer)
					}, e.prototype.setupGPT = function (e, t) {
						var i;
						e.gptSlot || (160 === e.width && 600 === e.height ? e.gptSlot = window.googletag.defineSlot(e.adUnitPath, [[e.width, e.height], "fluid"], e.id)
								.addService(window.googletag.pubads()) : e.gptSlot = window.googletag.defineSlot(e.adUnitPath, [e.width, e.height], e.id)
								.addService(window.googletag.pubads())), window.googletag.enableServices(), null === (i = e.gptSlot) || void 0 === i || i.clearTargeting(), Object.keys(t)
							.forEach((function (i) {
								var n, r = t[i];
								"" !== r && (null === (n = e.gptSlot) || void 0 === n || n.setTargeting(i, r))
							}))
					}, e.prototype.clearAd = function (e) {
						var t, i = this.getDisplaySlotID(e);
						if (i) {
							var n = this.slotMap.get(i) || null;
							if (n) {
								for (n.onCanDestroy && !n.onCanDestroyCalled && console.warn("destroyAd called without waiting for onCanDestroy"), a.Z.track(o.Z.tracking.screen.destroyAd, {
										opportunityId: n.opportunityId
										, okToDestroy: n.onCanDestroyCalled
										, platformAd: n.platformAd
									}), null === (t = n.intersectionObserver) || void 0 === t || t.disconnect(), n.gptSlot && googletag.destroySlots([n.gptSlot]); e.lastChild;) e.removeChild(e.lastChild);
								e.removeAttribute("data-poki-ad-id"), this.slotMap.delete(n.id)
							}
						}
						else console.error("destroyAd called on a container without ad")
					}, e.prototype.getDisplaySlotID = function (e) {
						if (!e) return null;
						var t = e.getAttribute("data-poki-ad-id");
						return t || null
					}, e
				}();
				const tt = et;
				var it, nt = (it = function (e, t) {
						return it = Object.setPrototypeOf || {
							__proto__: []
						}
						instanceof Array && function (e, t) {
							e.__proto__ = t
						} || function (e, t) {
							for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
						}, it(e, t)
					}, function (e, t) {
						if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
						
						function i() {
							this.constructor = e
						}
						it(e, t), e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i)
					})
					, rt = function (e) {
						function t() {
							var t = null !== e && e.apply(this, arguments) || this;
							return t.waitUntilReady = function (e) {
								window.pbjs.que.push((function () {
									e()
								}))
							}, t.requestAd = function (e) {
								(0, G.Z)({
									event: "request"
									, size: e.size
									, opportunityId: e.opportunityId
									, adUnitPath: e.adUnitPath
								});
								var i = 1
									, n = function () {
										--i > 0 || t.allBidsBack(e.id)
									};
								if (window.apstag) {
									i++;
									try {
										window.apstag.fetchBids({
											slots: [{
												slotName: e.adUnitPath
												, slotID: e.id
												, sizes: [[e.width, e.height]]
											}]
											, timeout: 1500
										}, (function (t) {
											t && t.length > 0 && (e.amznTargetting = t[0]), n()
										}))
									}
									catch (e) {
										n()
									}
								}
								window.pbjs.requestBids({
									adUnitCodes: [e.adUnitPath]
									, bidsBackHandler: function () {
										e.pbjsTargetting = window.pbjs.getAdserverTargetingForAdUnitCode([e.adUnitPath]), n()
									}
								})
							}, t.setupGPT = function (e, t) {}, t.setupSlotRenderEndedListener = function () {}, t
						}
						return nt(t, e), t.prototype.allBidsBack = function (e) {
							var t, i, n, r, s = this
								, d = this.slotMap.get(e);
							if (d) {
								var c = document.createElement("iframe");
								c.setAttribute("frameborder", "0"), c.setAttribute("scrolling", "no"), c.setAttribute("marginheight", "0"), c.setAttribute("marginwidth", "0"), c.setAttribute("topmargin", "0"), c.setAttribute("leftmargin", "0"), c.setAttribute("allowtransparency", "true"), c.setAttribute("width", "" + d.width), c.setAttribute("height", "" + d.height);
								var l = document.getElementById(d.id);
								if (l) {
									l.appendChild(c);
									var A = null === (t = null == c ? void 0 : c.contentWindow) || void 0 === t ? void 0 : t.document;
									if (!A) return console.error("Display error - iframe injection for ad failed", e), void this.clearAd(l.parentNode);
									var u = !0
										, p = d.pbjsTargetting.hb_bidder
										, h = parseFloat(d.pbjsTargetting.hb_pb);
									isNaN(h) && (h = 0);
									var m, g, v = (m = null === (i = null == d ? void 0 : d.amznTargetting) || void 0 === i ? void 0 : i.amznbid, J[m] || 0);
									v > h ? (g = null === (n = null == d ? void 0 : d.amznTargetting) || void 0 === n ? void 0 : n.amnzp, p = Y[g] || "Amazon", h = v, u = !1, this.renderAMZNAd(d.id, l, A)) : this.renderPrebidAd(d.id, l, A);
									var f = !p;
									a.Z.track(o.Z.tracking.ads.display.impression, {
										size: d.size
										, opportunityId: d.opportunityId
										, duringGameplay: null === (r = d.duringGameplay) || void 0 === r ? void 0 : r.call(d)
										, adUnitPath: d.adUnitPath
										, prebidBid: h
										, prebidBidder: p
										, preBidWon: u
										, dfpIsBackfill: !1
										, dfpLineItemId: void 0
										, dfpCampaignId: void 0
										, adDomain: d.pbjsTargetting.hb_adomain
										, isEmpty: f
									}), (0, G.Z)({
										event: "impression"
										, size: d.size
										, opportunityId: d.opportunityId
										, adUnitPath: d.adUnitPath
										, bidder: p
										, bid: h
									}), d.onDisplayRendered && d.onDisplayRendered(f), f ? this.callOnCanDestroy(d.id) : (d.intersectionObserver = new IntersectionObserver((function (e) {
										e.forEach((function (e) {
											e.isIntersecting ? d.intersectingTimer || (d.intersectingTimer = setTimeout((function () {
												var t;
												null === (t = d.intersectionObserver) || void 0 === t || t.unobserve(e.target), (0, G.Z)({
													event: "viewable"
													, size: d.size
													, opportunityId: d.opportunityId
													, adUnitPath: d.adUnitPath
													, bidder: p
													, bid: h
												}), s.callOnCanDestroy(d.id)
											}), 1e3)) : d.intersectingTimer && (clearTimeout(d.intersectingTimer), d.intersectingTimer = void 0)
										}))
									}), {
										threshold: .5
									}), d.intersectionObserver.observe(l))
								}
								else console.error("Display error - container not found", e)
							}
						}, t.prototype.renderPrebidAd = function (e, t, i) {
							var n = this.slotMap.get(e);
							if (n) return n.pbjsTargetting.hb_adid ? void window.pbjs.renderAd(i, n.pbjsTargetting.hb_adid) : (console.error("Display info - prebid nothing to render", e, n.pbjsTargetting), void this.clearAd(t.parentNode))
						}, t.prototype.renderAMZNAd = function (e, t, i) {
							var n, r, o = this.slotMap.get(e);
							if (o) return (null === (n = null == o ? void 0 : o.amznTargetting) || void 0 === n ? void 0 : n.amzniid) ? void window.apstag.renderImp(i, null === (r = null == o ? void 0 : o.amznTargetting) || void 0 === r ? void 0 : r.amzniid) : (console.error("Display info - amazon nothing to render", e, o.pbjsTargetting), void this.clearAd(t.parentNode))
						}, t
					}(tt);
				const ot = rt;
				var at = function () {
						return at = Object.assign || function (e) {
							for (var t, i = 1, n = arguments.length; i < n; i++)
								for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
							return e
						}, at.apply(this, arguments)
					}
					, st = function (e, t, i) {
						if (i || 2 === arguments.length)
							for (var n, r = 0, o = t.length; r < o; r++) !n && r in t || (n || (n = Array.prototype.slice.call(t, 0, r)), n[r] = t[r]);
						return e.concat(n || Array.prototype.slice.call(t))
					}
					, dt = function () {
						function e() {
							var e = this;
							this.autoStartOnReady = !1, this.criteria = {}, this.handlers = {}, this.initializingPromise = null, this.isInitialized = !1, this.sdkBooted = !1, this.startAdEnabled = !1, this.startStartAdsAfterTimerOnInit = !1, this.initOptions = {}, this.adSettings = {
								blocklist: []
								, countryExclusion: []
								, bidderLimitation: {}
							}, this.adReady = !1, this.sdkImaError = !1, this.displayOnly = !1, this.sdkNotBootedButCalled = function () {
								console.error("The Poki SDK has not yet been initialized")
							}, this.genericCriteria = function () {
								var t = {};
								return t.tag = s.Z.tag, t.tag_site = s.Z.tag + "|" + s.Z.siteID, t.site_id = encodeURIComponent(s.Z.siteID), t.categories = encodeURIComponent(s.Z.categories), s.Z.experiment && (t.experiment = encodeURIComponent(s.Z.experiment)), s.Z.specialCondition && e.specialConditions && e.specialConditions.includes(s.Z.specialCondition) ? "landing" === s.Z.specialCondition ? t.p4d_game_id_cond = s.Z.gameID + "|l" : "crosspromo" === s.Z.specialCondition ? t.p4d_game_id_cond = s.Z.gameID + "|cp" : t.p4d_game_id = s.Z.gameID : t.p4d_game_id = s.Z.gameID, t
							}, this.display = pe() ? new ot : new tt
						}
						return e.prototype.init = function (e) {
							if (void 0 === e && (e = {}), "undefined" != typeof window) {
								var t = e.onReady
									, i = void 0 === t ? null : t
									, n = e.onAdblocked
									, r = void 0 === n ? null : n;
								return this.initOptions = e, i && this.registerHandler("onReady", i), r && this.registerHandler("onAdblocked", r), this.isInitialized ? console.error("Poki SDK has already been initialized") : (this.initializingPromise || (this.initializingPromise = this.loadMonetizationCore()), this.initializingPromise)
							}
						}, e.prototype.loadMonetizationCore = function () {
							var e = this
								, t = this.initOptions
								, n = t.prebid
								, r = void 0 === n ? {} : n
								, c = t.a9
								, l = void 0 === c ? {} : c
								, A = t.volume
								, u = void 0 === A ? 1 : A
								, p = t.waterfallRetries
								, h = t.wrapper
								, m = t.debug
								, g = void 0 === m ? void 0 : m
								, k = t.logging
								, y = void 0 === k ? void 0 : k
								, w = t.displayOnly
								, Z = void 0 !== w && w
								, I = t.nonPersonalized
								, S = void 0 !== I && I;
							this.displayOnly = Z, window.googletag = window.googletag || {
								cmd: []
							}, window.pbjs = window.pbjs || {
								que: []
							}, d.Z.init(g, y), this.setupDefaultEvents(), a.Z.setupDefaultEvents(), s.Z.isPokiIframe && (f(), setTimeout(v.trackSavegames, 1e4)), window.addEventListener("resize", this.resize.bind(this), !1);
							var E = at({}, M)
								, x = Fe;
							d.Z.debug && (x = function () {
								return Promise.resolve()
							});
							var C = s.Z.ccpaApplies
								, D = void 0 !== this.initOptions.isCCPA ? this.initOptions.isCCPA : "" !== C ? "1" === C : void 0
								, j = Xe
								, z = (this.initOptions.country || s.Z.country)
								.toUpperCase();
							z && void 0 !== D && (j = function () {
								return Promise.resolve({
									ISO: z
									, ccpaApplies: D
								})
							});
							var R = [x(), j()]
								, L = st(st([], R, !0), [Ye()], !1);
							return L.push((0, _.Z)("https://securepubads.g.doubleclick.net/tag/js/gpt.js")), Z || L.push((0, _.Z)("https://imasdk.googleapis.com/js/sdkloader/ima3.js")), s.Z.childDirected || S ? (s.Z.childDirected && this.display.enforceChildSafety(), (0, s.w)("nonPersonalized", "true"), this.display.enforceNonPersonalized()) : L.push((0, _.Z)("https://a.poki.com/prebid/prebid7.22.0.js"), (0, _.Z)("https://c.amazon-adsystem.com/aax2/apstag.js")), this.display.setupSlotRenderEndedListener(), Promise.allSettled = Promise.allSettled || function (e) {
									return Promise.all(e.map((function (e) {
										return e.then((function (e) {
												return {
													status: "fulfilled"
													, value: e
												}
											}))
											.catch((function (e) {
												return {
													status: "rejected"
													, reason: e
												}
											}))
									})))
								}, Promise.allSettled(L)
								.then((function (t) {
									var n, c, A;
									try {
										var m = t[0]
											, g = t[1]
											, v = t[2]
											, f = t[3]
											, k = t[4];
										if ("fulfilled" === m.status) {
											var y = m.value;
											if (y) {
												s.Z.gameID || (0, s.w)("gameID", y.gameID), y.cachedContentGameID && (0, s.w)("contentGameID", y.cachedContentGameID), E.adTiming = y.adTiming, e.specialConditions = y.specialConditions;
												var w = function (e) {
													var t, i = s.Z.playtest;
													if (i) return i;
													if (i = null == e ? void 0 : e.playtestLobbyID) {
														var n = "4g" === (null === (t = navigator.connection) || void 0 === t ? void 0 : t.effectiveType) && !(0, T.Z)() && !(0, B.Z)() && s.Z.isPokiIframe && !P;
														return a.Z.track(o.Z.tracking.playtest.showModal, {
															show: n
														}), n ? i : null
													}
												}(y);
												w && i.e(725)
													.then(i.bind(i, 725))
													.then((function (e) {
														(0, e.initPlaytest)(y, w)
													}))
											}
										}
										var S = {
											ISO: "ZZ"
											, ccpaApplies: !1
										};
										if ("fulfilled" === g.status && (S = g.value), (0, s.w)("country", (z || (null == S ? void 0 : S.ISO) || "ZZ")
												.toUpperCase()), (0, s.w)("gdprApplies", (0, Ge.M)(s.Z.country)), (0, s.w)("ccpaApplies", void 0 === D ? (null == S ? void 0 : S.ccpaApplies) || !1 : D), b(), "fulfilled" === v.status) {
											var x = v.value;
											x && (e.adSettings = x)
										}
										if (A = e.adSettings.blocklist, ee = A || [], "rejected" === f.status) return void O.Z.dispatchEvent(o.Z.adblocked);
										if (ce(r, e.adSettings.bidderLimitation), Ae(l, e.adSettings.bidderLimitation), "desktop" !== ve && window.googletag.cmd.push((function () {
												googletag.pubads()
													.addEventListener("rewardedSlotReady", (function (e) {
														a.Z.track(o.Z.tracking.ads.rewardedWeb.ready), e.makeRewardedVisible()
													})), googletag.pubads()
													.addEventListener("rewardedSlotGranted", (function () {
														me = !0
													})), googletag.pubads()
													.addEventListener("rewardedSlotClosed", (function () {
														me ? a.Z.track(o.Z.tracking.ads.rewardedWeb.closedGranted) : a.Z.track(o.Z.tracking.ads.rewardedWeb.closedDeclined), O.Z.dispatchEvent(o.Z.ads.completed, {
															rewardAllowed: me
														})
													})), googletag.pubads()
													.addEventListener("slotRenderEnded", (function (e) {
														var t;
														fe === (null === (t = null == e ? void 0 : e.slot) || void 0 === t ? void 0 : t.getAdUnitPath()) && e.isEmpty && (a.Z.track(o.Z.tracking.ads.rewardedWeb.empty), O.Z.dispatchEvent(o.Z.ads.video.startHouseAdFlow))
													}))
											})), !Z && "rejected" === k.status) return void O.Z.dispatchEvent(o.Z.adblocked);
										d.Z.debug && (E.adTiming.startAdsAfter = 0);
										var C = s.Z.forceAd;
										C && (E.adTiming = {
											preroll: !0
											, timeBetweenAds: 12e4
											, timePerTry: 7e3
											, startAdsAfter: 0
										}, E.customCriteria = at(at({}, E.customCriteria), {
											force_ad: C
										})), e.enableSettings(E), e.playerSkin = new Re({
											wrapper: h
										}), e.ima = new qe(u), e.playerSkin.setupEvents(e), e.startStartAdsAfterTimerOnInit && e.adTimings.startStartAdsAfterTimer(), e.waterfall = new ye(e.ima, {
											timing: e.adTimings
											, totalRetries: p
										}), e.isInitialized = !0, O.Z.dispatchEvent(o.Z.ready)
									}
									catch (e) {
										O.Z.dispatchEvent(o.Z.adblocked)
									}
								}))
								.catch((function () {
									O.Z.dispatchEvent(o.Z.adblocked)
								}))
						}, e.prototype.requestAd = function (e) {
							void 0 === e && (e = {});
							var t = e.autoStart
								, i = void 0 === t || t
								, n = e.onFinish
								, r = void 0 === n ? null : n
								, d = e.onStart
								, c = void 0 === d ? null : d
								, l = e.position
								, A = void 0 === l ? null : l
								, u = {
									opportunityId: j()
									, position: A
								};
							if (a.Z.track(A === o.Z.ads.position.rewarded ? o.Z.tracking.screen.rewardedBreak : o.Z.tracking.screen.commercialBreak, at(at({}, e.rewardedKVs), u)), this.autoStartOnReady = !1 !== i, r && this.registerHandler("onFinish", r), c && this.registerHandler("onStart", c), this.displayOnly) O.Z.dispatchEvent(o.Z.ads.error, at(at({}, u), {
								message: "Video disabled"
							}));
							else if (this.ima && !this.sdkImaError) {
								if (!this.sdkBooted) return O.Z.dispatchEvent(o.Z.ads.error, at(at({}, u), {
									message: "Requesting ad on unbooted SDK"
								})), void this.sdkNotBootedButCalled();
								if (!(0, T.Z)() && !(0, B.Z)() || A === o.Z.ads.position.rewarded)
									if (null !== A && (0, D.Z)(A, o.Z.ads.position))
										if (x()) O.Z.dispatchEvent(o.Z.ads.error, at(at({}, u), {
											messaage: "No TCFv2 CMP detected, please contact developersupport@poki.com for more information"
										}));
										else if (C()) O.Z.dispatchEvent(o.Z.ads.error, at(at({}, u), {
									messaage: "No USP detected, please contact developersupport@poki.com for more information"
								}));
								else if (this.ima.isAdRunning() || this.waterfall.isRunning()) O.Z.dispatchEvent(o.Z.ads.busy, u);
								else if (this.adReady) O.Z.dispatchEvent(o.Z.ads.ready, u);
								else if (A !== o.Z.ads.position.preroll || this.adTimings.prerollPossible())
									if (A === o.Z.ads.position.rewarded || this.adTimings.requestPossible())
										if (A !== o.Z.ads.position.rewarded && this.adSettings.countryExclusion.includes(s.Z.country)) O.Z.dispatchEvent(o.Z.ads.limit, at(at({}, u), {
											reason: o.Z.info.messages.disabled
										}));
										else {
											O.Z.clearVideoDataAnnotations(), O.Z.setVideoDataAnnotations(u);
											var p = at(at(at({}, this.genericCriteria()), this.criteria), {
												position: A
												, ab: Math.round(Math.random())
													.toString()
											});
											this.playerSkin.show(), this.resize(), this.waterfall.start(p, A)
										}
								else O.Z.dispatchEvent(o.Z.ads.limit, at(at({}, u), {
									reason: o.Z.info.messages.timeLimit
								}));
								else O.Z.dispatchEvent(o.Z.ads.limit, at(at({}, u), {
									reason: o.Z.info.messages.prerollLimit
								}));
								else console.error("POKI-SDK: Invalid position");
								else O.Z.dispatchEvent(o.Z.ads.error, at(at({}, u), {
									message: "Interstitials are disabled on mobile"
								}))
							}
							else O.Z.dispatchEvent(o.Z.ads.error, at(at({}, u), {
								message: "Bot, IMA or Adblocker error"
							}))
						}, e.prototype.displayAd = function (e) {
							var t = e.container
								, i = e.size;
							if (x()) O.Z.dispatchEvent(o.Z.ads.error, {
								message: "No TCFv2 CMP detected, please contact developersupport@poki.com for more information"
							});
							else if (C()) O.Z.dispatchEvent(o.Z.ads.error, {
								message: "No USP detected, please contact developersupport@poki.com for more information"
							});
							else if (i) {
								if (!this.sdkBooted) return O.Z.dispatchEvent(o.Z.ads.error, {
									message: "Requesting ad on unbooted SDK"
								}), void this.sdkNotBootedButCalled();
								if (t)
									if (void 0 !== window.googletag)
										if (this.adSettings.countryExclusion.includes(s.Z.country)) O.Z.dispatchEvent(o.Z.ads.limit, {
											reason: o.Z.info.messages.disabled
										});
										else {
											if (!this.display.validateDisplaySettings(i)) return O.Z.dispatchEvent(o.Z.ads.error, {
												reason: "Display size " + i + " is not supported on this device"
											});
											e.criteria = at(at(at({}, this.genericCriteria()), this.criteria), e.criteria || {}), this.display.renderAd(e)
										}
								else O.Z.dispatchEvent(o.Z.ads.error, {
									message: "Adblocker has been detected"
								});
								else O.Z.dispatchEvent(o.Z.ads.error, {
									message: "Provided container does not exist"
								})
							}
							else O.Z.dispatchEvent(o.Z.ads.error, {
								message: "No ad size given, usage: displayAd(<container>, <size>)"
							})
						}, e.prototype.destroyAd = function (e) {
							if (!this.sdkBooted) return console.error("Attempting destroyAd on unbooted SDK"), void this.sdkNotBootedButCalled();
							void 0 !== window.googletag ? this.adSettings.countryExclusion.includes(s.Z.country) || (e = e || document.body, this.display.clearAd(e)) : console.error("Adblocker has been detected")
						}, e.prototype.startStartAdsAfterTimer = function () {
							this.sdkBooted && !this.sdkImaError ? this.adTimings.startStartAdsAfterTimer() : this.startStartAdsAfterTimerOnInit = !0
						}, e.prototype.muteAd = function () {
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							this.sdkImaError || this.displayOnly || this.ima.muteAd()
						}, e.prototype.isAdBlocked = function () {
							return this.sdkImaError
						}, e.prototype.setVolume = function (e) {
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							this.sdkImaError || this.displayOnly || this.ima.setVolume(e)
						}, e.prototype.forcePreroll = function () {
							var e = this.adTimings.prerollPossible;
							this.adTimings.prerollPossible = function () {
								return !0
							}, this.requestAd({
								position: o.Z.ads.position.preroll
							}), this.adTimings.prerollPossible = e
						}, e.prototype.resumeAd = function () {
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							this.sdkImaError || this.displayOnly || (this.playerSkin.hidePauseButton(), this.ima.resumeAd())
						}, e.prototype.startAdClicked = function () {
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							this.sdkImaError || this.displayOnly || "undefined" != typeof navigator && /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) && this.startAdEnabled && (this.startAdEnabled = !1, this.playerSkin.hideStartAdButton(), this.ima.startIOSPlayback())
						}, e.prototype.enableSettings = function (e) {
							this.criteria = at({}, e.customCriteria), this.adTimings = new R(e.adTiming)
						}, e.prototype.resize = function () {
							var e = this;
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							if (!this.sdkImaError && !this.displayOnly) {
								var t = this.playerSkin.getVideoBounds();
								0 !== t.width && 0 !== t.height ? this.ima.resize(t.width, t.height) : setTimeout((function () {
									e.resize()
								}), 100)
							}
						}, e.prototype.startAd = function () {
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							this.sdkImaError || this.displayOnly || (this.adReady ? (this.resize(), this.ima.startPlayback()) : O.Z.dispatchEvent(o.Z.ads.error, {
								message: "No ads ready to start"
							}))
						}, e.prototype.stopAd = function () {
							if (!this.sdkBooted) return this.sdkNotBootedButCalled();
							this.sdkImaError || this.displayOnly || (this.waterfall.stopWaterfall(), this.ima.stopPlayback(), this.playerSkin.hide())
						}, e.prototype.registerHandler = function (e, t) {
							this.handlers[e] = t
						}, e.prototype.callHandler = function (e) {
							for (var t = [], i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
							"function" == typeof this.handlers[e] && this.handlers[e](t)
						}, e.prototype.setupDefaultEvents = function () {
							var e = this;
							O.Z.addEventListener(o.Z.ready, (function () {
								e.sdkBooted = !0, e.callHandler("onReady")
							})), O.Z.addEventListener(o.Z.adblocked, (function () {
								e.sdkBooted = !0, e.sdkImaError = !0, e.callHandler("onAdblocked")
							})), O.Z.addEventListener(o.Z.ads.ready, (function () {
								e.adReady = !0, e.autoStartOnReady && e.startAd()
							})), O.Z.addEventListener(o.Z.ads.started, (function () {
								e.playerSkin.hideSpinner(), e.callHandler("onStart", {
									type: o.Z.ads.limit
								})
							})), O.Z.addEventListener(o.Z.ads.video.paused, (function () {
								e.playerSkin.showPauseButton()
							})), O.Z.addEventListener(o.Z.ads.limit, (function () {
								e.callHandler("onFinish", {
									type: o.Z.ads.limit
									, rewardAllowed: !1
								})
							})), O.Z.addEventListener(o.Z.ads.stopped, (function () {
								e.callHandler("onFinish", {
									type: o.Z.ads.stopped
									, rewardAllowed: !1
								})
							})), O.Z.addEventListener(o.Z.ads.error, (function (t) {
								e.callHandler("onFinish", {
									type: o.Z.ads.error
									, rewardAllowed: !!t.rewardAllowed
								})
							})), O.Z.addEventListener(o.Z.ads.busy, (function () {
								e.callHandler("onFinish", {
									type: o.Z.ads.busy
									, rewardAllowed: !1
								})
							})), O.Z.addEventListener(o.Z.ads.completed, (function (t) {
								e.callHandler("onFinish", {
									type: o.Z.ads.completed
									, rewardAllowed: !!t.rewardAllowed
								})
							})), [o.Z.ads.limit, o.Z.ads.stopped, o.Z.ads.error, o.Z.ads.completed].forEach((function (t) {
								O.Z.addEventListener(t, (function () {
									e.playerSkin && e.playerSkin.hide(), e.adReady = !1
								}))
							}))
						}, e
					}();
				const ct = dt;
				var lt = i(84);
				
				function At(e) {
					switch (Object.prototype.toString.call(e)) {
					case "[object Error]":
					case "[object Exception]":
					case "[object DOMException]":
						return !0;
					default:
						return e instanceof Error
					}
				}
				var ut = "poki_erruid"
					, pt = Date.now()
					, ht = l(ut);
				
				function mt() {
					return ht || (ht = Math.random()
						.toString(36)
						.substr(2, 9), A(ut, ht)), ht
				}
				
				function gt(e) {
					if ("CN" !== s.Z.country)
						if (s.Z.gameID) {
							if (!(Date.now() < pt)) try {
								var t = JSON.stringify({
										gid: s.Z.gameID
										, vid: s.Z.versionID
										, ve: 7
										, n: e.name
										, m: e.message
										, s: JSON.stringify(e.stack)
										, ui: mt()
									})
									, i = "https://t.poki.io/ge";
								if (navigator.sendBeacon) navigator.sendBeacon(i, t);
								else {
									var n = new XMLHttpRequest;
									n.open("POST", i, !0), n.send(t)
								}
								pt = Date.now() + 100
							}
							catch (e) {
								console.error(e)
							}
						}
					else console.log(e)
				}
				"undefined" != typeof window && (r()
					.remoteFetching = !1, r()
					.report.subscribe((function (e) {
						if ("Script error." === e.message && window.pokiLastCatch) {
							var t = window.pokiLastCatch;
							window.pokiLastCatch = null;
							try {
								r()
									.report(t)
							}
							catch (e) {}
						}
						else gt(e)
					})), window.addEventListener("unhandledrejection", (function (e) {
						if (At(e.reason)) try {
							r()
								.report(e.reason)
						}
						catch (e) {}
						else gt({
							name: "unhandledrejection"
							, message: JSON.stringify(e.reason)
						})
					})));
				
				function vt(e) {
					return Math.round(100 * e) / 100
				}
				var ft = function () {
						function e() {
							var e = this;
							this.seconds = [], this.frameCounter = 0, Math.random() > .01 || window.requestAnimationFrame && -1 !== window.requestAnimationFrame.toString()
								.indexOf("[native code]") && (this.nextSecond = performance.now() + 1e3, window.requestAnimationFrame((function () {
									e.frame()
								})))
						}
						return e.prototype.frame = function () {
							for (var e = this, t = performance.now(); t >= this.nextSecond;) this.seconds.unshift(this.frameCounter), this.seconds.length > 10 && this.seconds.pop(), this.frameCounter = 0, this.nextSecond += 1e3;
							this.frameCounter++, window.requestAnimationFrame((function () {
								e.frame()
							}))
						}, e.prototype.stats = function () {
							var e = this;
							if (0 !== this.seconds.length) return Math.min.apply(Math, this.seconds) + "|" + Math.max.apply(Math, this.seconds) + "|" + vt(this.seconds.reduce((function (e, t) {
								return e + t
							}), 0) / this.seconds.length) + "|" + vt(this.seconds.slice(1)
								.map((function (t, i) {
									return Math.abs(t - e.seconds[i])
								}))
								.reduce((function (e, t) {
									return e + t
								}), 0) / (this.seconds.length - 1))
						}, e
					}()
					, bt = function () {
						return bt = Object.assign || function (e) {
							for (var t, i = 1, n = arguments.length; i < n; i++)
								for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
							return e
						}, bt.apply(this, arguments)
					}
					, kt = function (e, t, i, n) {
						return new(i || (i = Promise))((function (r, o) {
							function a(e) {
								try {
									d(n.next(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function s(e) {
								try {
									d(n.throw(e))
								}
								catch (e) {
									o(e)
								}
							}
							
							function d(e) {
								var t;
								e.done ? r(e.value) : (t = e.value, t instanceof i ? t : new i((function (e) {
										e(t)
									})))
									.then(a, s)
							}
							d((n = n.apply(e, t || []))
								.next())
						}))
					}
					, yt = function (e, t) {
						var i, n, r, o, a = {
							label: 0
							, sent: function () {
								if (1 & r[0]) throw r[1];
								return r[1]
							}
							, trys: []
							, ops: []
						};
						return o = {
							next: s(0)
							, throw: s(1)
							, return: s(2)
						}, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
							return this
						}), o;
						
						function s(o) {
							return function (s) {
								return function (o) {
									if (i) throw new TypeError("Generator is already executing.");
									for (; a;) try {
										if (i = 1, n && (r = 2 & o[0] ? n.return : o[0] ? n.throw || ((r = n.return) && r.call(n), 0) : n.next) && !(r = r.call(n, o[1]))
											.done) return r;
										switch (n = 0, r && (o = [2 & o[0], r.value]), o[0]) {
										case 0:
										case 1:
											r = o;
											break;
										case 4:
											return a.label++, {
												value: o[1]
												, done: !1
											};
										case 5:
											a.label++, n = o[1], o = [0];
											continue;
										case 7:
											o = a.ops.pop(), a.trys.pop();
											continue;
										default:
											if (!(r = a.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
												a = 0;
												continue
											}
											if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
												a.label = o[1];
												break
											}
											if (6 === o[0] && a.label < r[1]) {
												a.label = r[1], r = o;
												break
											}
											if (r && a.label < r[2]) {
												a.label = r[2], a.ops.push(o);
												break
											}
											r[2] && a.ops.pop(), a.trys.pop();
											continue
										}
										o = t.call(e, a)
									}
									catch (e) {
										o = [6, e], n = 0
									}
									finally {
										i = r = 0
									}
									if (5 & o[0]) throw o[1];
									return {
										value: o[0] ? o[1] : void 0
										, done: !0
									}
								}([o, s])
							}
						}
					}
					, wt = function () {
						function e() {
							var t = this;
							this.gameStarted = !1, this.duringGameplay = !1, this.fpsStats = new ft, this.asyncScreenshotLoader = function () {
								window.addEventListener("message", (function (e) {
									return kt(t, void 0, void 0, (function () {
										var t;
										return yt(this, (function (n) {
											switch (n.label) {
											case 0:
												return "pokiGenerateScreenshot" !== e.data.type ? [3, 2] : [4, i.e(206)
													.then(i.bind(i, 206))];
											case 1:
												return (0, n.sent()
													.takeAndUploadScreenshotWithFrameData)(e.data), [3, 7];
											case 2:
												return "pokiGenerateRawScreenshot" !== e.data.type ? [3, 4] : [4, i.e(206)
													.then(i.bind(i, 206))];
											case 3:
												return (0, n.sent()
													.takeRawScreenshot)(), [3, 7];
											case 4:
												return "pokiUploadScreenshot" !== e.data.type ? [3, 7] : [4, i.e(206)
													.then(i.bind(i, 206))];
											case 5:
												return [4, (0, n.sent()
													.uploadScreenshot)(e.data)];
											case 6:
												t = n.sent(), lt.Z.sendMessage(o.Z.message.sendUploadScreenshot, {
													data: {
														screenshot: t
													}
												}), n.label = 7;
											case 7:
												return [2]
											}
										}))
									}))
								}), !1)
							}, this.initWithVideoHB = function () {
								return t.init()
							}, this.setDebug = function (e) {
								void 0 === e && (e = !0);
								var t = window.location.hostname;
								t.endsWith("poki-gdn.com") || "qa-files.poki.com" === t ? e && a.Z.track(o.Z.tracking.debugTrueInProduction) : (d.Z.debug = e, d.Z.log = null != e ? e : d.Z.log)
							}, this.setLogging = function (e) {
								d.Z.log = e
							}, this.gameLoadingFinished = function () {
								var e, t, i, n, r;
								try {
									i = performance.getEntriesByType("resource")
										.map((function (e) {
											return e.transferSize
										}))
										.reduce((function (e, t) {
											return e + t
										})), i += performance.getEntriesByType("navigation")[0].transferSize
								}
								catch (e) {}
								a.Z.track(o.Z.tracking.screen.gameLoadingFinished, {
									transferSize: i
									, trackers: (n = window, r = [], "function" != typeof n.ga && "function" != typeof n.gtag || r.push("ga"), n.mixpanel && "function" == typeof n.mixpanel.track && r.push("mixpanel"), "function" == typeof n.GameAnalytics && r.push("gameanalytics"), (n.kongregateAPI || n.kongregate) && r.push("kongregate"), n.FlurryAgent && r.push("flurry"), n.Countly && r.push("countly"), n.amplitude && r.push("amplitude"), r)
										.join(",")
									, error_user_id: mt()
									, now: Math.round(null === (t = null === (e = window.performance) || void 0 === e ? void 0 : e.now) || void 0 === t ? void 0 : t.call(e)) || void 0
								})
							}, this.gameplayStart = function (e) {
								t.duringGameplay = !0, t.gameStarted || (t.gameStarted = !0, a.Z.track(o.Z.tracking.screen.firstRound), t.monetization.startStartAdsAfterTimer()), a.Z.track(o.Z.tracking.screen.gameplayStart, bt(bt({}, e), {
									fps: t.fpsStats.stats()
								})), clearTimeout(t.playerActiveTimeout), t.playerActiveTimeout = setTimeout((function () {
									window.addEventListener("pointermove", t.playerIsActiveEvent), document.addEventListener("keydown", t.playerIsActiveEvent)
								}), 6e5)
							}, this.gameplayStop = function (e) {
								t.duringGameplay = !1, a.Z.track(o.Z.tracking.screen.gameplayStop, bt(bt({}, e), {
									fps: t.fpsStats.stats()
								})), clearTimeout(t.playerActiveTimeout), window.removeEventListener("pointermove", t.playerIsActiveEvent), document.removeEventListener("keydown", t.playerIsActiveEvent)
							}, this.roundStart = function (e) {
								void 0 === e && (e = ""), e = String(e), a.Z.track(o.Z.tracking.screen.roundStart, {
									identifier: e
								})
							}, this.roundEnd = function (e) {
								void 0 === e && (e = ""), e = String(e), a.Z.track(o.Z.tracking.screen.roundEnd, {
									identifier: e
								})
							}, this.customEvent = function (e, i, n) {
								void 0 === n && (n = {}), e && i ? (e = String(e), i = String(i), n = bt({}, n), a.Z.track(o.Z.tracking.custom, {
									eventNoun: e
									, eventVerb: i
									, eventData: n
								})) : t.error("customEvent", "customEvent needs at least a noun and a verb")
							}, this.commercialBreak = function (e) {
								return new Promise((function (i) {
									var n = t.gameStarted ? o.Z.ads.position.midroll : o.Z.ads.position.preroll;
									t.monetization.requestAd({
										position: n
										, onFinish: i
										, onStart: e
									})
								}))
							}, this.rewardedBreak = function (e, i, n, r) {
								return new Promise((function (a) {
									var s, d = {};
									"function" == typeof e ? (s = e, void 0 !== i && (d.category = i), void 0 !== n && (d.details = n), void 0 !== r && (d.placement = r)) : (void 0 !== e && (d.category = e), void 0 !== i && (d.details = i), void 0 !== n && (d.placement = n));
									var c = o.Z.ads.position.rewarded;
									t.monetization.requestAd({
										position: c
										, onFinish: function (e) {
											e.length > 0 ? a(!!e[0].rewardAllowed) : a(!1)
										}
										, onStart: s
										, rewardedKVs: d
									})
								}))
							}, this.displayAd = function (e, i, n, r) {
								var s = j();
								a.Z.track(o.Z.tracking.screen.displayAd, {
									size: i
									, opportunityId: s
									, duringGameplay: t.duringGameplay
								});
								var d = {
									container: e
									, opportunityId: s
									, size: i
									, duringGameplay: function () {
										return t.duringGameplay
									}
									, onCanDestroy: n
									, onDisplayRendered: r
								};
								t.monetization.displayAd(d)
							}, this.isAdBlocked = function () {
								return t.monetization.isAdBlocked()
							}, this.muteAd = function () {
								t.monetization.muteAd()
							}, this.logError = function (e) {
								t.captureError(e)
							}, this.setPlaytestCanvas = function (t) {
								e.playtestCanvas = t
							}, this.getIsoLanguage = function () {
								return (0, L.Z)("iso_lang")
							}, this.shareableURL = function (e) {
								return void 0 === e && (e = {}), new Promise((function (t, i) {
									var n = new URLSearchParams
										, r = Object.keys(e);
									if (s.Z.isPokiIframe) {
										var a = (0, L.Z)("poki_url");
										r.forEach((function (t) {
											void 0 !== e[t] && null !== e[t] && n.set("gd" + t, e[t])
										})), t(a + "?" + n.toString()), lt.Z.sendMessage(o.Z.message.setPokiURLParams, {
											params: e
										})
									}
									else window.self === window.top ? (r.forEach((function (t) {
										void 0 !== e[t] && null !== e[t] && n.set("" + t, e[t])
									})), t("" + window.location.origin + window.location.pathname + "?" + n.toString())) : i(new Error("shareableURL only works on Poki or a top level frame"))
								}))
							}, this.getURLParam = function (e) {
								return (0, L.Z)("gd" + e) || (0, L.Z)(e)
							}, this.captureError = function (e) {
								try {
									At(e) ? n.report(e) : n.report(new Error(e))
								}
								catch (e) {}
							}, this.getLanguage = function () {
								return navigator.language.toLowerCase()
									.split("-")[0]
							}, this.generateScreenshot = function (e) {
								return kt(t, void 0, void 0, (function () {
									return yt(this, (function (t) {
										switch (t.label) {
										case 0:
											return [4, i.e(206)
												.then(i.bind(i, 206))];
										case 1:
											return [2, (0, t.sent()
												.takeAndUploadScreenshot)(e)]
										}
									}))
								}))
							}, this.enableEventTracking = function (e) {
								window.top === window && a.Z.setupObserverWithCMP(e || 0)
							}, this.error = function (e, t) {
								console.error("PokiSDK." + e + ": " + t)
							}, this.playerIsActiveEvent = function () {
								window.removeEventListener("pointermove", t.playerIsActiveEvent), document.removeEventListener("keydown", t.playerIsActiveEvent), a.Z.track(o.Z.tracking.screen.playerActive), t.playerActiveTimeout = setTimeout((function () {
									window.addEventListener("pointermove", t.playerIsActiveEvent), document.addEventListener("keydown", t.playerIsActiveEvent)
								}), 6e5)
							}, this.setDebugTouchOverlayController = function () {}, this.gameInteractive = function () {}, this.gameLoadingProgress = function () {}, this.gameLoadingStart = function () {}, this.getLeaderboard = function () {
								return Promise.resolve([])
							}, this.happyTime = function () {}, this.sendHighscore = function () {}, this.setPlayerAge = function () {}, this.__pokiInternal__playgroundPlatformAd = function (e, i, n, r) {
								var s = j();
								a.Z.track(o.Z.tracking.screen.displayAd, {
									size: n
									, opportunityId: s
									, platformAd: !0
								});
								var d = {
									container: e
									, opportunityId: s
									, size: n
									, adUnitPath: i
									, criteria: r
									, backfillHouseads: !0
									, platformAd: !0
									, duringGameplay: function () {
										return !1
									}
								};
								t.monetization.displayAd(d)
							}, this.__pokiInternal__setRuntimeInformation = function (e) {
								void 0 === e && (e = {}), Object.keys(e)
									.forEach((function (t) {
										(0, s.w)(t, e[t])
									}))
							}, this.monetization = new ct, this.SDK = this.monetization
						}
						return e.prototype.init = function (e) {
							var t = this;
							return void 0 === e && (e = {}), e.startupParams && this.__pokiInternal__setRuntimeInformation(e.startupParams), new Promise((function (i, n) {
								t.monetization.init(bt({
									onReady: function () {
										t.monetization.setVolume(.6), (0, L.Z)("preroll") && t.monetization.forcePreroll(), i()
									}
									, onAdblocked: n
								}, e)), t.asyncScreenshotLoader(), lt.Z.sendMessage(o.Z.message.sdkDetails, {
									version: "2.332.1"
								})
							}))
						}, e.prototype.destroyAd = function (e) {
							this.monetization.destroyAd(e)
						}, e.prototype.setVolume = function (e) {
							this.monetization.setVolume(e)
						}, e
					}();
				const Zt = wt
			}
			, 84: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => a
				});
				var n = i(583)
					, r = i(992)
					, o = i(888);
				const a = function () {
					function e() {}
					return e.sendMessage = function (e, t) {
						var i = window.parent;
						if (!(0, r.Z)(e, n.Z.message)) {
							var a = Object.keys(n.Z.message)
								.map((function (e) {
									return "poki.message." + e
								}));
							throw new TypeError("Argument 'type' must be one of " + a.join(", "))
						}
						var s = t || {};
						o.Z.gameID && o.Z.versionID && (s.pokifordevs = {
							game_id: o.Z.gameID
							, game_version_id: o.Z.versionID
						}), i.postMessage({
							type: e
							, content: s
						}, "*")
					}, e
				}()
			}
			, 58: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => o
				});
				var n = i(298)
					, r = function () {
						return r = Object.assign || function (e) {
							for (var t, i = 1, n = arguments.length; i < n; i++)
								for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
							return e
						}, r.apply(this, arguments)
					};
				const o = function () {
					function e() {}
					return e.clearEventListeners = function () {
						this.listeners = {}
					}, e.removeEventListener = function (e, t) {
						if (Object.prototype.hasOwnProperty.call(this.listeners, e)) {
							var i = this.listeners[e].indexOf(t); - 1 !== i && this.listeners[e].splice(i, 1)
						}
					}, e.addEventListener = function (e, t, i) {
						var n = this;
						if (void 0 === i && (i = !1), i = !!i, Object.prototype.hasOwnProperty.call(this.listeners, e) || (this.listeners[e] = []), i) {
							var r = function (i) {
								n.removeEventListener.bind(n)(e, r), t(i)
							};
							this.listeners[e].push(r)
						}
						else this.listeners[e].push(t)
					}, e.dispatchEvent = function (e, t) {
						var i, o;
						void 0 === t && (t = {}), n.Z.debug && "test" !== (null === (o = null === (i = null === window || void 0 === window ? void 0 : window.process) || void 0 === i ? void 0 : i.env) || void 0 === o ? void 0 : o.NODE_ENV) && console.info(e, t);
						for (var a = Object.keys(this.listeners), s = 0; s < a.length; s++) {
							var d = a[s];
							if (e === d)
								for (var c = this.listeners[d], l = 0; l < c.length; l++) c[l](r(r({}, this.dataAnnotations), t))
						}
					}, e.setVideoDataAnnotations = function (e) {
						this.dataAnnotations = r(r({}, this.dataAnnotations), e)
					}, e.getVideoDataAnnotations = function () {
						return this.dataAnnotations
					}, e.clearVideoDataAnnotations = function () {
						this.dataAnnotations = {}
					}, e.listeners = {}, e.dataAnnotations = {}, e
				}()
			}
			, 453: (e, t, i) => {
				"use strict";
				
				function n(e) {
					var t = new RegExp("".concat(e, "=([^;]+)(?:;|$)"))
						.exec(document.cookie);
					return t ? t[1] : ""
				}
				
				function r(e, t, i) {
					document.cookie = "".concat(e, "=")
						.concat(t, "; path=/; samesite=lax; max-age=")
						.concat(Math.min(i || 15552e3, 15552e3))
				}
				
				function o() {
					for (var e = Math.floor(Date.now() / 1e3), t = "", i = 0; i < 4; i++) t = String.fromCharCode(255 & e) + t, e >>= 8;
					if (window.crypto && crypto.getRandomValues && Uint32Array) {
						var n = new Uint32Array(12);
						crypto.getRandomValues(n);
						for (var r = 0; r < 12; r++) t += String.fromCharCode(255 & n[r])
					}
					else
						for (var o = 0; o < 12; o++) t += String.fromCharCode(Math.floor(256 * Math.random()));
					return btoa(t)
						.replace(/\+/g, "-")
						.replace(/\//g, "_")
						.replace(/=/g, "")
				}
				i.d(t, {
					Z: () => S
				});
				
				function a(e, t) {
					var i;
					console.error(e), i = e.name && e.message ? "".concat(e.name, ": ")
						.concat(e.message) : JSON.stringify(e)
						, function (e, t) {
							if (!navigator.sendBeacon || !navigator.sendBeacon(e, t)) try {
								var i = "XMLHttpRequest" in window ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
								i.open("POST", e, !0), i.setRequestHeader("Content-Type", "text/plain"), i.send(t)
							}
							catch (e) {}
						}("https://t.poki.io/l", JSON.stringify({
							c: "observer-error"
							, ve: 7
							, d: [{
								k: "where"
								, v: t
							}, {
								k: "error"
								, v: i
							}]
						}))
				}
				window._pokiUserGlobalName = window._pokiUserGlobalName || "user";
				var s = "poki_session";
				
				function d(e) {
					return !(!e || !(e && e.page && e.landing_page && e.previous_page) || !e.tab_id || !e.expire || Date.now() > e.expire || e.expire > Date.now() + 18e5)
				}
				
				function c() {
					var e = null;
					d(window[window._pokiSessionGlobalName]) && (e = window[window._pokiSessionGlobalName]);
					try {
						var t = JSON.parse(sessionStorage.getItem(s));
						d(t) && (!e || t.depth > e.depth) && (e = t)
					}
					catch (e) {
						a(e, "getTabSession")
					}
					return e
				}
				
				function l() {
					var e = c();
					return e ? e.tab_id : o()
				}
				
				function A() {
					var e = 0
						, t = c();
					t && (e = t.depth);
					try {
						var i = JSON.parse(n(s) || null);
						d(i) && (e = Math.max(e, i.depth))
					}
					catch (e) {
						a(e, "getSessionDepth")
					}
					return e
				}
				window._pokiSessionGlobalName = window._pokiSessionGlobalName || "session";
				var u = i(583)
					, p = i(84)
					, h = i(298)
					, m = function (e) {
						var t = new Array;
						return Object.keys(e)
							.forEach((function (i) {
								"object" == typeof e[i] ? t = t.concat(m(e[i])) : t.push(e[i])
							})), t
					};
				const g = m;
				var v = i(902)
					, f = i(699)
					, b = i(888)
					, k = i(58)
					, y = function () {
						return y = Object.assign || function (e) {
							for (var t, i = 1, n = arguments.length; i < n; i++)
								for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
							return e
						}, y.apply(this, arguments)
					}
					, w = g(u.Z.tracking)
					, Z = window
					, I = function () {
						function e() {}
						return e.track = function (t, i) {
							var n, r;
							if (void 0 === i && (i = {}), -1 === w.indexOf(t)) throw new TypeError("Invalid 'event', must be one of " + w.join(", "));
							if ("object" != typeof i) throw new TypeError("Invalid data, must be an object");
							var o = k.Z.getVideoDataAnnotations();
							if (null == o ? void 0 : o.pokiAdServer) switch (t) {
							case u.Z.tracking.ads.status.impression:
								(0, v.Z)(y(y({}, i), {
									event: "video-impression"
									, creativeId: null == i ? void 0 : i.creativeId
								}));
								break;
							case u.Z.tracking.ads.video.error:
								(0, v.Z)(y(y({}, i), {
									event: "video-error"
									, errorCode: null == i ? void 0 : i.errorCode
								}));
								break;
							case u.Z.tracking.ads.video.loaderError:
								(0, v.Z)(y(y({}, i), {
									event: "video-adsloader-error"
									, errorCode: null == i ? void 0 : i.errorCode
								}));
								break;
							case u.Z.tracking.ads.status.completed:
								(0, v.Z)(y(y({}, i), {
									event: "video-complete"
								}))
							}
							if (t.includes("pokiTrackingRewardedWeb") && (i = o), h.Z.log) {
								if ("test" === (null === (r = null === (n = null === window || void 0 === window ? void 0 : window.process) || void 0 === n ? void 0 : n.env) || void 0 === r ? void 0 : r.NODE_ENV)) return;
								Object.keys(i)
									.length ? console.info("%cPOKI_TRACKER:%c Tracked event '" + t + "' with data:", "font-weight: bold", "", i) : console.info("%cPOKI_TRACKER:%c Tracked event '" + t + "'", "font-weight: bold", "")
							}
							e.playtestMessageCallback({
								event: t
								, data: i
							}), e.logToObserver ? e.pushEvent("sdk", "message", {
								content: {
									event: t
									, data: i
									, pokifordevs: {
										game_id: b.Z.gameID
										, game_version_id: void 0
									}
								}
								, type: u.Z.message.event
								, origin: "game"
							}) : p.Z.sendMessage(u.Z.message.event, {
								event: t
								, data: i
							})
						}, e.setMessageCallback = function (t) {
							e.playtestMessageCallback = t
						}, e.setupDefaultEvents = function () {
							var t, i = ((t = {})[u.Z.ready] = u.Z.tracking.sdk.status.initialized, t[u.Z.adblocked] = u.Z.tracking.sdk.status.failed, t[u.Z.ads.busy] = u.Z.tracking.ads.status.busy, t[u.Z.ads.completed] = u.Z.tracking.ads.status.completed, t[u.Z.ads.error] = u.Z.tracking.ads.status.error, t[u.Z.ads.impression] = u.Z.tracking.ads.status.impression, t[u.Z.ads.limit] = u.Z.tracking.ads.status.limit, t[u.Z.ads.ready] = u.Z.tracking.ads.status.ready, t[u.Z.ads.requested] = u.Z.tracking.ads.status.requested, t[u.Z.ads.prebidRequested] = u.Z.tracking.ads.status.prebidRequested, t[u.Z.ads.skipped] = u.Z.tracking.ads.status.skipped, t[u.Z.ads.started] = u.Z.tracking.ads.status.started, t[u.Z.ads.video.clicked] = u.Z.tracking.ads.video.clicked, t[u.Z.ads.video.error] = u.Z.tracking.ads.video.error, t[u.Z.ads.video.loaderError] = u.Z.tracking.ads.video.loaderError, t[u.Z.ads.video.buffering] = u.Z.tracking.ads.status.buffering, t[u.Z.ads.video.progress] = u.Z.tracking.ads.video.progress, t[u.Z.ads.video.paused] = u.Z.tracking.ads.video.paused, t[u.Z.ads.video.resumed] = u.Z.tracking.ads.video.resumed, t[u.Z.tracking.screen.gameplayStart] = u.Z.tracking.screen.gameplayStart, t[u.Z.tracking.screen.gameplayStop] = u.Z.tracking.screen.gameplayStop, t[u.Z.tracking.screen.commercialBreak] = u.Z.tracking.screen.commercialBreak, t[u.Z.tracking.screen.rewardedBreak] = u.Z.tracking.screen.rewardedBreak, t);
							Object.keys(i)
								.forEach((function (t) {
									k.Z.addEventListener(t, (function (n) {
										e.track(i[t], n)
									}))
								}))
						}, e.pushEvent = function (e, t, i) {
							Z.pokiGTM.push({
								event: e + "-" + t
								, eventNoun: e
								, eventVerb: t
								, eventData: i || {}
							})
						}, e.setRequireConsent = function (t) {
							e.cmpRequired = t, e.setupObserverIfCMP()
						}, e.setupObserverWithCMP = function (t) {
							e.cmpIndex = t, e.setupObserverIfCMP()
						}, e.setupObserverIfCMP = function () {
							if (void 0 !== e.cmpRequired && void 0 !== e.cmpIndex)
								if (e.cmpRequired) {
									if (!window.__tcfapi) return void console.error("POKI-SDK: enableEventTracking: a CMP is required but no CMP is present.");
									window.__tcfapi("addEventListener", 2, (function (t, i) {
										!i || "tcloaded" !== t.eventStatus && "useractioncomplete" !== t.eventStatus || (window.__tcfapi("getNonIABVendorConsents", 2, (function (t) {
											t && t.nonIabVendorConsents && t.nonIabVendorConsents[e.cmpIndex || 0] && e.setupObserver()
										})), window.__tcfapi("removeEventListener", 2, (function () {}), t.listenerId))
									}))
								}
							else e.setupObserver()
						}, e.setupObserver = function () {
							Z._pokiSessionGlobalName = "pokiSession", Z._pokiUserGlobalName = "pokiUser", Z._pokiContextGlobalName = "pokiContext", Z._pokiTrackerGlobalName = "pokiTracker"
								, function (e, t, i) {
									var u = c();
									d(u) ? (u.previous_page.path = u.page.path, u.previous_page.type = u.page.type, u.previous_page.id = u.page.id, u.previous_page.start = u.page.start, u.page.path = e, u.page.type = t, u.page.id = i, u.page.start = Date.now(), u.depth = A() + 1, u.expire = Date.now() + 18e5) : u = function (e, t, i) {
										try {
											var c = JSON.parse(n(s) || null);
											if (d(c)) return c.previous_page.path = c.page.path, c.previous_page.type = c.page.type, c.previous_page.id = c.page.id, c.previous_page.start = c.page.start, c.page.path = e, c.page.type = t, c.page.id = i, c.page.start = Date.now(), c.depth = A() + 1, c.expire = Date.now() + 18e5, c.previous_tab_id = c.tab_id, c.tab_id = l(), r(s, JSON.stringify(c)), c
										}
										catch (e) {
											a(e, "newSession")
										}
										return {
											id: o()
											, expire: Date.now() + 18e5
											, tab_id: l()
											, depth: 1
											, count: (u = n("ses_cnt"), (u && parseInt(u, 10) || 0) + 1)
											, page: {
												path: e
												, type: t
												, id: i
												, start: Date.now()
											}
											, previous_page: {}
											, landing_page: {
												path: e
												, type: t
												, id: i
												, start: Date.now()
											}
										};
										var u
									}(e, t, i), r("ses_cnt", u.count), u.count > 1 && function () {
										r("uid_new", "0");
										try {
											sessionStorage.setItem("uid_new", "0")
										}
										catch (e) {}
										window[window._pokiUserGlobalName] && (window[window._pokiUserGlobalName].is_new = !1)
									}();
									var p = JSON.stringify(u);
									try {
										sessionStorage.setItem(s, p)
									}
									catch (e) {
										a(e, "updateSession")
									}
									window[window._pokiSessionGlobalName] = u, r(s, p)
								}(window.location.pathname, "external", b.Z.contentGameID)
								, function () {
									var e, t, i = null === (e = window[window._pokiUserGlobalName]) || void 0 === e ? void 0 : e.id
										, a = (null === (t = window[window._pokiUserGlobalName]) || void 0 === t ? void 0 : t.is_new) || !1;
									if (!i) try {
										i = sessionStorage.getItem("uid"), a = "1" === sessionStorage.getItem("uid_new")
									}
									catch (e) {}
									i || (i = n("uid"), a = "1" === n("uid_new")), i || (i = o(), a = !0), r("uid", i), r("uid_new", a ? "1" : "0");
									try {
										sessionStorage.setItem("uid", i), sessionStorage.setItem("uid_new", a ? "1" : "0")
									}
									catch (e) {}
									window[window._pokiUserGlobalName] = {
										id: i
										, is_new: a
									}
								}(), Z[Z._pokiContextGlobalName] = {
									tag: null
									, site: {
										id: null
										, domain: window.location.hostname
										, prefix: ""
									}
									, page: {
										id: b.Z.contentGameID
										, type: "external"
										, path: window.location.pathname
									}
									, user: Z[Z._pokiUserGlobalName]
									, session: Z[Z._pokiSessionGlobalName]
								}, Z.pokiGTM = Z.pokiGTM || [], (0, f.Z)("https://a.poki.com/observer/t2.js"), e.logToObserver = !0
						}, e.logToObserver = !1, e.cmpRequired = void 0, e.cmpIndex = void 0, e.playtestMessageCallback = function () {}, e
					}();
				const S = I
			}
			, 662: (e, t, i) => {
				"use strict";
				i.d(t, {
					D: () => r
					, M: () => o
				});
				var n = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "GB", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO"]
					, r = "ZZ";
				
				function o(e) {
					return n.includes(e)
				}
			}
			, 298: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => r
				});
				var n = i(888);
				const r = function () {
					function e() {}
					return e.debug = !1, e.log = !1, e.init = function (t, i) {
						var r, o, a = window.location.hostname;
						void 0 === t && ("test" === (null === (o = null === (r = null === window || void 0 === window ? void 0 : window.process) || void 0 === r ? void 0 : r.env) || void 0 === o ? void 0 : o.NODE_ENV) ? (t = !1, void 0 === i && (i = !1)) : "localhost" === a || "127.0.0.1" === a || "[::1]" === a ? (t = !0, void 0 === i && (i = !1)) : (t = !1, void 0 === i && (i = !1))), a.endsWith(".poki-gdn.com") ? (t = !1, i = !1) : "qa-files.poki.com" !== a && "inspector-uploads.poki-user-content.com" !== a || (t = !0, i = !0), n.Z.debugMode && (t = !0), n.Z.logMode && (i = !0), void 0 === i && (i = t), e.debug = t, e.log = i
					}, e
				}()
			}
			, 906: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => n
				});
				const n = function (e, t) {
					var i;
					if ("undefined" == typeof window && !t) return "";
					e = e.replace(/[\[]/, "\\[")
						.replace(/[\]]/, "\\]");
					var n = new RegExp("(?:[\\?&]|^)" + e + "=([^&#]*)")
						.exec(t || (null === (i = null === window || void 0 === window ? void 0 : window.location) || void 0 === i ? void 0 : i.search) || "");
					return null === n ? "" : decodeURIComponent(n[1].replace(/\+/g, " "))
				}
			}
			, 893: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => n
				});
				const n = function () {
					return "undefined" != typeof navigator && /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\smini|avantgo|mobilesafari|docomo)/i.test(navigator.userAgent)
				}
			}
			, 573: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => n
				});
				const n = function () {
					return "undefined" != typeof navigator && /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i.test(navigator.userAgent)
				}
			}
			, 699: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => n
				});
				const n = function (e) {
					return new Promise((function (t, i) {
						var n = document.createElement("script");
						n.type = "text/javascript", n.async = !0, n.src = e;
						var r = function () {
							n.readyState && "loaded" !== n.readyState && "complete" !== n.readyState || (t(), n.onload = null, n.onreadystatechange = null)
						};
						n.onload = r, n.onreadystatechange = r, n.onerror = i, document.head.appendChild(n)
					}))
				}
			}
			, 902: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => s
				});
				var n = i(298)
					, r = i(888)
					, o = i(58)
					, a = function () {
						return a = Object.assign || function (e) {
							for (var t, i = 1, n = arguments.length; i < n; i++)
								for (var r in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
							return e
						}, a.apply(this, arguments)
					};
				const s = function (e) {
					var t;
					if ("undefined" != typeof window && "undefined" != typeof fetch) {
						var i = o.Z.getVideoDataAnnotations()
							, s = e.size;
						(null === (t = e.event) || void 0 === t ? void 0 : t.startsWith("video-")) && (s = "640x360v");
						var d = a(a({}, e), {
							size: s
							, opportunity_id: e.opportunityId || i.opportunityId
							, ad_unit_path: e.adUnitPath || i.adUnitPath
							, p4d_game_id: r.Z.gameID
							, p4d_version_id: r.Z.versionID
							, bidder: e.bidder || i.bidder
							, bid: e.bid || i.bid || 0
							, error_code: e.errorCode
							, creative_id: e.creativeId || i.creativeId
							, experiment: r.Z.experiment
						});
						n.Z.debug ? console.log("PokiAdServer Tracking: ", d) : fetch("https://t.poki.io/adserver", {
							method: "POST"
							, mode: "no-cors"
							, body: JSON.stringify(d)
						})
					}
				}
			}
			, 888: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => l
					, w: () => c
				});
				var n = i(662)
					, r = i(906)
					, o = i(893)
					, a = i(573);
				var s = (0, r.Z)("url_referrer") || ""
					, d = {
						bot: "1" === (0, r.Z)("bot")
						, categories: (0, r.Z)("categories") || ""
						, device: (0, o.Z)() ? "mobile" : (0, a.Z)() ? "tablet" : "desktop"
						, experiment: (0, r.Z)("experiment") || ""
						, forceAd: (0, r.Z)("force_ad") || !1
						, isPokiIframe: (parseInt((0, r.Z)("site_id"), 10) || 0) > 0
						, siteID: parseInt((0, r.Z)("site_id"), 10) || 0
						, tag: (0, r.Z)("tag") || ""
						, versionID: (0, r.Z)("game_version_id")
						, debugMode: "true" === (0, r.Z)("pokiDebug")
						, logMode: "" !== (0, r.Z)("pokiLogging")
						, playtest: (0, r.Z)("playtest")
						, testVideos: "true" === (0, r.Z)("testVideos")
						, referrer: s
						, ccpaApplies: (0, r.Z)("ccpaApplies")
						, childDirected: ["kiloo.com"].some((function (e) {
							return s.includes(e)
						}))
						, country: ((0, r.Z)("country") || "")
							.toUpperCase()
						, gameID: (0, r.Z)("game_id")
						, gdprApplies: (0, n.M)(((0, r.Z)("country") || "")
							.toUpperCase())
						, nonPersonalized: !1
						, contentGameID: void 0
						, specialCondition: (0, r.Z)("special_condition")
					}
					, c = function (e, t) {
						d[e] = t
					};
				const l = d
			}
			, 992: (e, t, i) => {
				"use strict";
				i.d(t, {
					Z: () => n
				});
				const n = function (e, t) {
					var i = !1;
					return Object.keys(t)
						.forEach((function (n) {
							t[n] === e && (i = !0)
						})), i
				}
			}
		}
		, o = {};
	
	function a(e) {
		if (o[e]) return o[e].exports;
		var t = o[e] = {
			exports: {}
		};
		return r[e].call(t.exports, t, t.exports, a), t.exports
	}
	a.m = r, a.n = e => {
		var t = e && e.__esModule ? () => e.default : () => e;
		return a.d(t, {
			a: t
		}), t
	}, t = Object.getPrototypeOf ? e => Object.getPrototypeOf(e) : e => e.__proto__, a.t = function (i, n) {
		if (1 & n && (i = this(i)), 8 & n) return i;
		if ("object" == typeof i && i) {
			if (4 & n && i.__esModule) return i;
			if (16 & n && "function" == typeof i.then) return i
		}
		var r = Object.create(null);
		a.r(r);
		var o = {};
		e = e || [null, t({}), t([]), t(t)];
		for (var s = 2 & n && i;
			"object" == typeof s && !~e.indexOf(s); s = t(s)) Object.getOwnPropertyNames(s)
			.forEach((e => o[e] = () => i[e]));
		return o.default = () => i, a.d(r, o), r
	}, a.d = (e, t) => {
		for (var i in t) a.o(t, i) && !a.o(e, i) && Object.defineProperty(e, i, {
			enumerable: !0
			, get: t[i]
		})
	}, a.f = {}, a.e = e => Promise.all(Object.keys(a.f)
		.reduce(((t, i) => (a.f[i](e, t), t)), [])), a.u = e => e + "-v2.332.1.js", a.g = function () {
		if ("object" == typeof globalThis) return globalThis;
		try {
			return this || new Function("return this")()
		}
		catch (e) {
			if ("object" == typeof window) return window
		}
	}(), a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), i = {}, n = "@poki/poki-sdk:", a.l = (e, t, r, o) => {
		if (i[e]) i[e].push(t);
		else {
			var s, d;
			if (void 0 !== r)
				for (var c = document.getElementsByTagName("script"), l = 0; l < c.length; l++) {
					var A = c[l];
					if (A.getAttribute("src") == e || A.getAttribute("data-webpack") == n + r) {
						s = A;
						break
					}
				}
			s || (d = !0, (s = document.createElement("script"))
				.charset = "utf-8", s.timeout = 120, a.nc && s.setAttribute("nonce", a.nc), s.setAttribute("data-webpack", n + r), s.src = e), i[e] = [t];
			var u = (t, n) => {
					s.onerror = s.onload = null, clearTimeout(p);
					var r = i[e];
					if (delete i[e], s.parentNode && s.parentNode.removeChild(s), r && r.forEach((e => e(n))), t) return t(n)
				}
				, p = setTimeout(u.bind(null, void 0, {
					type: "timeout"
					, target: s
				}), 12e4);
			s.onerror = u.bind(null, s.onerror), s.onload = u.bind(null, s.onload), d && document.head.appendChild(s)
		}
	}, a.r = e => {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}, (() => {
		var e;
		a.g.importScripts && (e = a.g.location + "");
		var t = a.g.document;
		if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
			var i = t.getElementsByTagName("script");
			i.length && (e = i[i.length - 1].src)
		}
		if (!e) throw new Error("Automatic publicPath is not supported in this browser");
		e = e.replace(/#.*$/, "")
			.replace(/\?.*$/, "")
			.replace(/\/[^\/]+$/, "/"), a.p = e
	})(), (() => {
		var e = {
			702: 0
		};
		a.f.j = (t, i) => {
			var n = a.o(e, t) ? e[t] : void 0;
			if (0 !== n)
				if (n) i.push(n[2]);
				else {
					var r = new Promise(((i, r) => {
						n = e[t] = [i, r]
					}));
					i.push(n[2] = r);
					var o = a.p + a.u(t)
						, s = new Error;
					a.l(o, (i => {
						if (a.o(e, t) && (0 !== (n = e[t]) && (e[t] = void 0), n)) {
							var r = i && ("load" === i.type ? "missing" : i.type)
								, o = i && i.target && i.target.src;
							s.message = "Loading chunk " + t + " failed.\n(" + r + ": " + o + ")", s.name = "ChunkLoadError", s.type = r, s.request = o, n[1](s)
						}
					}), "chunk-" + t, t)
				}
		};
		var t = (t, i) => {
				for (var n, r, [o, s, d] = i, c = 0, l = []; c < o.length; c++) r = o[c], a.o(e, r) && e[r] && l.push(e[r][0]), e[r] = 0;
				for (n in s) a.o(s, n) && (a.m[n] = s[n]);
				for (d && d(a), t && t(i); l.length;) l.shift()()
			}
			, i = self.webpackChunk_poki_poki_sdk = self.webpackChunk_poki_poki_sdk || [];
		i.forEach(t.bind(null, 0)), i.push = t.bind(null, i.push.bind(i))
	})(), (() => {
		"use strict";
		var e = new(a(968)
			.Z);
		for (var t in e) window.PokiSDK[t] = e[t]
	})()
})();

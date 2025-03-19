(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.3"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.3"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.3"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.3"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}(()=>{s(913);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[t.prefix,e,t.suffix].filter((e=>e&&e.length>0)).join("-"),n=e=>e||a(t.precache);function r(e,t){const s=t();return e.waitUntil(s),s}function i(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:a}=t;if(!a)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),r=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:r.href}}s(977);class c{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class o{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let h;function l(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class u{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const d=new Set;function f(e){return"string"==typeof e?new Request(e):e}s(873);class p{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let a=f(t);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=f(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(t,s){const a=f(t);await(0,new Promise((e=>setTimeout(e,0))));const n=await this.getCacheKey(a,"write");if(!s)throw new e("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(s);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),p=u?await async function(e,t,s,a){const n=l(t.url,s);if(t.url===n)return e.match(t,a);const r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const t of i)if(n===l(t.url,s))return e.match(t,a)}(h,n.clone(),["__WB_REVISION__"],o):null;try{await h.put(n,u?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:p,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=f(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class g{constructor(e={}){this.cacheName=e.cacheName||a(t.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new p(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(t,s,a){let n;await t.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,t),!n||"error"===n.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(n=await r({error:e,event:a,request:s}),n)break;if(!n)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))n=await e({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}class y extends g{constructor(e={}){e.cacheName=n(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(y.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=n.integrity,r=t.integrity,i=!r||r===e;a=await s.fetch(new Request(t,{integrity:"no-cors"!==t.mode?r||e:void 0})),e&&i&&"no-cors"!==t.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await s.cachePut(t,a.clone()))}return a}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(t);if(!await s.cachePut(t,a.clone()))throw new e("bad-precaching-response",{url:t.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==y.copyRedirectedCacheableResponsesPlugin&&(a===y.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(y.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}y.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},y.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let a=null;if(t.url&&(a=new URL(t.url).origin),a!==self.location.origin)throw new e("cross-origin-copy-response",{origin:a});const n=t.clone(),r={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=s?s(r):r,c=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?n.body:await n.blob();return new Response(c,i)}(t):t};class w{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new y({cacheName:n(e),plugins:[...t,new o({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const a of t){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:t,url:n}=i(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:t});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==a.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(t,a.integrity)}if(this._urlsToCacheKeys.set(n,t),this._urlsToCacheModes.set(n,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return r(e,(async()=>{const t=new c;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return r(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let m;const _=()=>(m||(m=new w),m);s(80);const R=e=>e&&"object"==typeof e?e:{handle:e};class v{constructor(e,t,s="GET"){this.handler=R(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=R(e)}}class C extends v{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class b{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(n)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,R(e))}setCatchHandler(e){this._catchHandler=R(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let q;class U extends v{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(n);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var L;L=[{'revision':'55b02627afe255589ab95fcc99286301','url':'assets/assets_pack.json'},{'revision':'c9b9efbabe3162587c0c000c30070543','url':'assets/bgs/basic_window_bg.png'},{'revision':'63c2dfd3c6d2b7a06b7279e294a985b3','url':'assets/bgs/darkner.png'},{'revision':'13931d245c7ed90db651f6560f7c8f9a','url':'assets/bgs/map_bg.png'},{'revision':'69b6fe2c5a430745848ef4032e51855f','url':'assets/bgs/page_bg.png'},{'revision':'b43a616cc3e04dbc2f4e22715870f70e','url':'assets/black.png'},{'revision':'304972ac39536f0ec9d2276bbc5543a4','url':'assets/data/map_items.json'},{'revision':'3930580dafcfaf18241ba5e304a2a331','url':'assets/flags.json'},{'revision':'ad50e7e0ff0b179a1092610b2ceb051e','url':'assets/fonts/RubikMarkerHatch-Regular.ttf'},{'revision':'acb3d7ff562086089c380cc341a27a40','url':'assets/fonts/fontLoader.css'},{'revision':'fcab0673fc57091eccef438ec8567a3e','url':'assets/game_menu.json'},{'revision':'a1716ad936867e7e8c7766bc4f8bdd16','url':'assets/game_menu.png'},{'revision':'08897b3e80ac479520a034266b9ab2b8','url':'assets/game_play/after_explo.png'},{'revision':'d1c84795d0f6ed1d632b00983f219717','url':'assets/game_play/atom_mig.png'},{'revision':'1a33c08ae06b7da07f1c6db1bc76ebad','url':'assets/game_play/bomb.png'},{'revision':'f84bce34390b86e8d5b098a884627424','url':'assets/game_play/bomber.png'},{'revision':'e66abc2cb34468e8752d7b5fe2c88558','url':'assets/game_play/cell_false.png'},{'revision':'24a1d39831dbc836ce1fab2e6712e59d','url':'assets/game_play/cell_true.png'},{'revision':'b77e05d4f939f00bdc8c656919149a99','url':'assets/game_play/explo_1.png'},{'revision':'af93353dba0d5cd9655bc1ffaa3ebfdb','url':'assets/game_play/explo_2.png'},{'revision':'485ee749a7fdee4a36481ad0fad34931','url':'assets/game_play/explo_3.png'},{'revision':'18e9afff5e6b41c64143229a8ff102b6','url':'assets/game_play/explo_4.png'},{'revision':'d3891de4a6d54a176ddbead585548ae6','url':'assets/game_play/explo_5.png'},{'revision':'e14699fb7388d0459bf89ac510a59cc7','url':'assets/game_play/explo_6.png'},{'revision':'0b2f1bb2b80c99f61839bf396caf29b6','url':'assets/game_play/explo_7.png'},{'revision':'c01f934c28d9815ab4b62b85f9e08233','url':'assets/game_play/field_frame.png'},{'revision':'7da110315612e21147dcbd7b81a2195c','url':'assets/game_play/fighter.png'},{'revision':'e4f439903d0e6af63e4e158a41952af1','url':'assets/game_play/main_mig.png'},{'revision':'06190eeff41e2adc5d4a4aa7a13d44d9','url':'assets/game_play/mine.png'},{'revision':'5b8577f382ed970c9f8de0589c414591','url':'assets/game_play/point_cell.png'},{'revision':'5c28d6778ab509d1fa87143f3c417d8d','url':'assets/game_play/projectile.png'},{'revision':'75b08fb27394fe2675078d17b706c7d0','url':'assets/game_play/radar_mig.png'},{'revision':'d59e13baebdd1b0efed836d43edc5206','url':'assets/game_play/ship_1.png'},{'revision':'e8cd8d3c4eafd4af5a5b78f8192f4753','url':'assets/game_play/ship_1_death.png'},{'revision':'6898daa74afe8e904576324547e96047','url':'assets/game_play/ship_1_green.png'},{'revision':'274e6b3b534e214da4c7a55805702235','url':'assets/game_play/ship_1_red.png'},{'revision':'1e5fdecb175dfe8be8bb79ba7231c1bc','url':'assets/game_play/ship_2.png'},{'revision':'e913a256a034f3ab3023d042452fd647','url':'assets/game_play/ship_2_death.png'},{'revision':'329f4e85f943da0bf0643583702c2125','url':'assets/game_play/ship_2_green.png'},{'revision':'750877f8d0b27622871924d3a2a4aca7','url':'assets/game_play/ship_2_red.png'},{'revision':'e4cf136f0da374b20a3f25eff05a8c4b','url':'assets/game_play/ship_3.png'},{'revision':'b465d4d0571239fc04ed57d7277883bc','url':'assets/game_play/ship_3_death.png'},{'revision':'9683357ea8674f6d41fca713246ade13','url':'assets/game_play/ship_3_green.png'},{'revision':'ba4d9e59e9c3ecc1f4dea91db245c947','url':'assets/game_play/ship_3_red.png'},{'revision':'a70596a299d9eeaa98dd844de8a0fde2','url':'assets/game_play/ship_4.png'},{'revision':'75d9e828b23efe2cedbadc4983001955','url':'assets/game_play/ship_4_death.png'},{'revision':'d2cb4354832b1827cae715199467a88b','url':'assets/game_play/ship_4_green.png'},{'revision':'70ac33227725cc5d98f29dc81e96ad94','url':'assets/game_play/ship_4_red.png'},{'revision':'f9d53240825ef920b32400b31f82c381','url':'assets/game_play/splash_1.png'},{'revision':'2ac8debbafa1516753ad72e55f590861','url':'assets/game_play/splash_2.png'},{'revision':'8074096dd8754328d12fbfba08c20164','url':'assets/game_play/splash_3.png'},{'revision':'854096aa295be3ee5de32a15d00d65c2','url':'assets/game_play/splash_4.png'},{'revision':'dbff7df6eb747e04b3f3f7ac6f5cb5b2','url':'assets/game_play/splash_5.png'},{'revision':'a469a012164fd7fe2ff8d5580a7e728e','url':'assets/game_play/splash_6.png'},{'revision':'a34fcd921a5978ca0a2f98877395bc9a','url':'assets/game_play/submarine.png'},{'revision':'ba74d1ab9cb84e30a0b570d14cf03348','url':'assets/game_play/torpedo.png'},{'revision':'f466ec9b23e57e748b57ca6af1e73cdd','url':'assets/game_play/under_explo.png'},{'revision':'aae0650148b83aeaadd8a4e14d65235a','url':'assets/game_play_atlas.json'},{'revision':'3ae491a7563ef60eeb4a94c6bef85560','url':'assets/game_play_atlas.png'},{'revision':'b887c333d5ec8274b78d0851e7b3337b','url':'assets/img/phaser-logo.png'},{'revision':'e08adca0fa4a8ff8e01a00c32ffbb6b8','url':'assets/lang/en_US.json'},{'revision':'632065e4ef0733b60ec4f64ab929123a','url':'assets/map_items/broke_house.png'},{'revision':'d400233605af72a1f43e40728810bbf6','url':'assets/map_items/live_house.png'},{'revision':'ca493fff959088c1d876771f002fd101','url':'assets/new_atlas.json'},{'revision':'226947b59a7bba96ae66f721940e7169','url':'assets/new_atlas.png'},{'revision':'e0f12d4e6511ac46ac75f2fd49fb6277','url':'assets/preload/loader_bar.png'},{'revision':'71456eaf7df9d2afbd8c5c50a9ea751e','url':'assets/preload/loader_bg.png'},{'revision':'12c274838377ab8acd177764be67e759','url':'assets/preload/loading_bg.png'},{'revision':'311de32a9dc920ac9167e309d95d8cd7','url':'assets/shop.json'},{'revision':'9dcdd17ffa9edf220f3b342f466f6dc9','url':'assets/shop.png'},{'revision':'971b92092164614a30fe27c9260346bc','url':'assets/skill_anim_atlas.json'},{'revision':'24984e1f10add7c5dade1f08c3000ea6','url':'assets/skill_anim_atlas.png'},{'revision':'0369c9ab1474f8c6a7de809fef5d3b0f','url':'assets/style.css'},{'revision':'3f460b8341a8b585e44a2097a134029a','url':'assets/ui/arrow.png'},{'revision':'01d13bb6aec54dcc30f34df751676bc5','url':'assets/ui/arsenal_slider.png'},{'revision':'df8e6bf421cd2883959ea898bfc8a4dd','url':'assets/ui/ava_frame.png'},{'revision':'e7db34e19c8f41a3e2c9cc6b6046bc1e','url':'assets/ui/bot_mode.png'},{'revision':'e6c778f2a9465e41b3a406d231db8a00','url':'assets/ui/close_button.png'},{'revision':'d0d9dabed2a196f02c736dccf4c4cb5c','url':'assets/ui/coin.png'},{'revision':'5139832c4831408ed6003a644f9faa22','url':'assets/ui/default_character.png'},{'revision':'462052ec67fe5f161fdce70432c37469','url':'assets/ui/default_frame.png'},{'revision':'1829b3aadddd4c2ae4c1ae03532d5c49','url':'assets/ui/dot_button.png'},{'revision':'c01f934c28d9815ab4b62b85f9e08233','url':'assets/ui/field_frame.png'},{'revision':'88eab30401cc02ff95fa52ebfbccb98f','url':'assets/ui/game_play_button.png'},{'revision':'c1ef8250cf8736b5dd89c8249f1e8738','url':'assets/ui/gem.png'},{'revision':'563fb0c0ab10308a4990914b51bfa24d','url':'assets/ui/home_button.png'},{'revision':'5f790371fc5ea8fb268a4ad62ea1b05b','url':'assets/ui/medal.png'},{'revision':'d354d7ae40518946b2cacfad87727458','url':'assets/ui/mode_button.png'},{'revision':'229a4bee84081cd0da3608781932fce4','url':'assets/ui/money_bg.png'},{'revision':'3e9a037e9db29ce1e7bf057fcb7d63e6','url':'assets/ui/next_play_button.png'},{'revision':'8525841a1fae7bd52a8e0d8c09bc9b42','url':'assets/ui/oil_can.png'},{'revision':'2328bbda3871256f30e318f3564a1151','url':'assets/ui/oil_prog_back.png'},{'revision':'8ebcb006ef607da82eb12a42246d6eba','url':'assets/ui/oil_prog_front.png'},{'revision':'c5733b30dfc5267201fa3f970f60787e','url':'assets/ui/page_turing.png'},{'revision':'0936a3df64e20a74675606f830fed147','url':'assets/ui/plank.png'},{'revision':'d0eb30031fa187cd25a5277a003c942c','url':'assets/ui/play_button.png'},{'revision':'776db48e4450ebba2bca4138fa747e97','url':'assets/ui/plus.png'},{'revision':'dbd1518766be6c8c857091b3a972ebd9','url':'assets/ui/profile_bg.png'},{'revision':'8953bf92fc623660d0d8edcff577f3d0','url':'assets/ui/profile_frame.png'},{'revision':'283366c7ce8bf823d146ad430b0c6710','url':'assets/ui/random_button.png'},{'revision':'e82a22727a47c83f86a725ec5dc0b9d9','url':'assets/ui/restart_button.png'},{'revision':'1bca27ebf837e2b02ffe5f6bd30af559','url':'assets/ui/rotate_button.png'},{'revision':'c44e019f3a5bd324c783fdfb05be0286','url':'assets/ui/scroll_b.png'},{'revision':'1279e9dff2ba3336d0a09e8a6e9ae498','url':'assets/ui/settings_button.png'},{'revision':'fc904a3c794ac1b362a68305b0d39a50','url':'assets/ui/simple_button.png'},{'revision':'362e9871bfad020f708d17ace5cd1330','url':'assets/ui/skill_airdef.png'},{'revision':'8b81cb526f0114e56863e5d745b47330','url':'assets/ui/skill_atom.png'},{'revision':'7aef44b031aef4a291ed7f1585779950','url':'assets/ui/skill_bomber.png'},{'revision':'bea73e178e5a30e05d953741c2cc3af4','url':'assets/ui/skill_fighter.png'},{'revision':'4880792ad472dc351d0e44bbd3774da5','url':'assets/ui/skill_item.png'},{'revision':'0a13b3920622ffab39b83ce95e88c100','url':'assets/ui/skill_mine.png'},{'revision':'a423e279cb185e9a6edab134948da781','url':'assets/ui/skill_radar.png'},{'revision':'0b70a36d892d471ec1fcffdf44873ee3','url':'assets/ui/skill_submarine.png'},{'revision':'b8a7b37537d3e7f9fed5bd9e598fc8ae','url':'assets/ui/skill_torpedo.png'},{'revision':'0046e6d8211eca804095ef5d069fba6c','url':'assets/ui/sroll_b.png'},{'revision':'f7536aeac2c7ed034f0bb1757415f3eb','url':'assets/ui/temp_task_reward.png'},{'revision':'c72d0e8866717d442332b2e21c16e418','url':'assets/ui/turn_arrow.png'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'8b7be65c5b7acaf70fba1ee1361ee47f','url':'index.html'},{'revision':null,'url':'main.14c564fb259ea5e06a6e.bundle.js'},{'revision':'bce522c56cb3f14ea2e70f00ad566f9d','url':'main.14c564fb259ea5e06a6e.bundle.js.LICENSE.txt'},{'revision':'ff0d08eca92dee1c2fc3a94297f58aeb','url':'manifest.json'},{'revision':null,'url':'vendors.18fb25fd60366e7efcb9.bundle.js'},{'revision':'51b0491cf3b8bf3fc5e6fe80e55474b5','url':'vendors.18fb25fd60366e7efcb9.bundle.js.LICENSE.txt'}],_().precache(L),function(t){const s=_();!function(t,s,a){let n;if("string"==typeof t){const e=new URL(t,location.href);n=new v((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)n=new C(t,s,a);else if("function"==typeof t)n=new v(t,s,a);else{if(!(t instanceof v))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=t}(q||(q=new b,q.addFetchListener(),q.addCacheListener()),q).registerRoute(n)}(new U(s,t))}(undefined)})()})();
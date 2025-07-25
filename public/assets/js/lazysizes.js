/*! lazysizes - v5.3.2 */

!function(e){
    var t=function(u,D,f)
        {
            "use strict";
            
            var k,H;
            
            if(function(){
                var e;
                
                var t={
                    lazyClass:"lazyload",
                    loadedClass:"lazyloaded",
                    loadingClass:"lazyloading",
                    preloadClass:"lazypreload",
                    errorClass:"lazyerror",
                    autosizesClass:"lazyautosizes",
                    fastLoadedClass:"ls-is-cached",
                    iframeLoadMode:0,
                    srcAttr:"data-src",
                    srcsetAttr:"data-srcset",
                    sizesAttr:"data-sizes",
                    minSize:40,
                    customMedia:{},
                    init:true,
                    expFactor:1.5,
                    hFac:.8,
                    loadMode:2,
                    loadHidden:true,
                    ricTimeout:0,
                    throttleDelay:125
                };
                
                H=u.lazySizesConfig||u.lazysizesConfig||{};
                
                for(e in t){
                    if(!(e in H)){
                        H[e]=t[e]
                    }
                }
            }(),
            !D||!D.getElementsByClassName){
                return{
                    init:function(){},
                    cfg:H,
                    noSupport:true
                }
            }
            var O=D.documentElement,
            i=u.HTMLPictureElement,
            P="addEventListener",
            $="getAttribute",
            q=u[P].bind(u),
            I=u.setTimeout,
            U=u.requestAnimationFrame||I,o=u.requestIdleCallback,
            j=/^picture$/i,
            r=[
                "load",
                "error",
                "lazyincluded",
                "_lazyloaded"
            ],
            a={},
            G=Array.prototype.forEach,
            J=function(e,t){
                if(!a[t]){
                    a[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")
                }
                return a[t].test(e[$]("class")||"") && a[t]
            },
            K=function(e,t){
                if(!J(e,t)){
                    e.setAttribute("class",(e[$]("class")||"").trim()+" "+t)
                }
            },
            Q=function(e,t){
                var a;
                if(a=J(e,t)){
                    e.setAttribute("class",(e[$]("class")||"").replace(a," "))
                }
            },
            V=function(t,a,e){
                var i=e?P:"removeEventListener";
                
                if(e){ V(t,a) }
                r.forEach(function(e){t[i](e,a)})},
                X=function(e,t,a,i,r){
                    var n=D.createEvent("Event");
                    
                    if(!a){a={}}
                    a.instance=k;
                    
                    n.initEvent(t,!i,!r);
                    
                    n.detail=a;
                    e.dispatchEvent(n);
                    
                    return n
                },
                Y=function(e,t){
                    var a;
                    
                    if(!i&&(a=u.picturefill||H.pf)){
                        if(t&&t.src&&!e[$]("srcset")){
                            e.setAttribute("srcset",t.src)
                        }
                        a({reevaluate:true,elements:[e]})
                    }else if(t&&t.src){e.src=t.src}
                },
                Z=function(e,t){
                    return(getComputedStyle(e,null)||{})[t]
                },
                s=function(e,t,a){
                    a=a||e.offsetWidth;
                    
                    while(a<H.minSize&&t&&!e._lazysizesWidth){
                        a=t.offsetWidth;
                        
                        t=t.parentNode
                    }
                    return a
                },
                ee=function(){
                    var a,i;
                    
                    var t=[];
                    
                    var r=[];
                    
                    var n=t;
                    
                    var s=function(){
                        var e=n;
                        
                        n=t.length?r:t;
                        
                        a=true;
                        
                        i=false;
                        
                        while(e.length){
                            e.shift()()
                        }
                        a=false
                    };
                    
                    var e=function(e,t){
                        if(a&&!t){
                            e.apply(this,arguments)
                        }else{
                            n.push(e);
                            if(!i){
                                i=true;
                                (D.hidden?I:U)(s)
                            }
                        }
                    };
                    
                    e._lsFlush=s;
                    
                    return e
                }(),
                te=function(a,e){
                    return e?function(){ee(a)}:function(){
                        var e=this;
                        
                        var t=arguments;
                        
                        ee(function(){
                            a.apply(e,t)
                        })
                    }
                },
                ae=function(e){
                    var a;
                    
                    var i=0;
                    
                    var r=H.throttleDelay;
                    
                    var n=H.ricTimeout;
                    
                    var t=function(){
                        a=false;
                        
                        i=f.now();
                        
                        e()
                    };
                    
                    var s=o&&n>49?function(){
                        o(t,{timeout:n});
                        
                        if(n!==H.ricTimeout){
                            n=H.ricTimeout
                        }
                    }:te(function(){I(t)},true);
                    
                    return function(e){
                        var t;
                        
                        if(e=e===true){n=33}
                        if(a){return}
                        a=true;
                        
                        t=r-(f.now()-i);
                        
                        if(t<0){t=0}
                        if(e||t<9){s()}else{I(s,t)}
                    }
                },
                ie=function(e){
                    var t,a;
                    
                    var i=99;
                    
                    var r=function(){t=null;
                        e()};
                    
                    var n=function(){
                        var e=f.now()-a;
                        
                        if(e<i){
                            I(n,i-e)
                        }else{
                            (o||r)(r)
                        }
                    };
                    
                    return function(){
                        a=f.now();
                        
                        if(!t){t=I(n,i)
                        }
                    }
                },
                e=function(){var v,m,c,h,e;
                    var y,z,g,p,C,b,A;
                    var n=/^img$/i;
                var d=/^iframe$/i;
                var E="onscroll"in u&&!/(gle|ing)bot/.test(navigator.userAgent);
                var _=0;
                var w=0;
                var M=0;
                var N=-1;
                var L=function(e){M--;
                    if(!e||M<0||!e.target){M=0}};
                var x=function(e){if(A==null){A=Z(D.body,"visibility")=="hidden"}return A||!(Z(e.parentNode,"visibility")=="hidden"&&Z(e,"visibility")=="hidden")};
                var W=function(e,t){var a;
                    var i=e;
                    var r=x(e);
                    g-=t;
                    b+=t;
                    p-=t;
                    C+=t;
                    while(r&&(i=i.offsetParent)&&i!=D.body&&i!=O){r=(Z(i,"opacity")||1)>0;
                if(r&&Z(i,"overflow")!="visible"){a=i.getBoundingClientRect();
                    r=C>a.left&&p<a.right&&b>a.top-1&&g<a.bottom+1}}return r};
                var t=function(){var e,t,a,i,r,n,s,o,l,u,f,c;
                    var d=k.elements;
                    if((h=H.loadMode)&&M<8&&(e=d.length)){t=0;
                    N++;
                    for(;
                    t<e;
                    t++){if(!d[t]||d[t]._lazyRace){continue}if(!E||k.prematureUnveil&&k.prematureUnveil(d[t])){R(d[t]);
                    continue}if(!(o=d[t][$]("data-expand"))||!(n=o*1)){n=w}if(!u){u=!H.expand||H.expand<1?O.clientHeight>500&&O.clientWidth>500?500:370:H.expand;
                    k._defEx=u;
                    f=u*H.expFactor;
                    c=H.hFac;
                    A=null;
                    if(w<f&&M<1&&N>2&&h>2&&!D.hidden){w=f;
                    N=0}else if(h>1&&N>1&&M<6){w=u}else{w=_}}if(l!==n){y=innerWidth+n*c;
                    z=innerHeight+n;
                    s=n*-1;
                    l=n}a=d[t].getBoundingClientRect();
                if((b=a.bottom)>=s&&(g=a.top)<=z&&(C=a.right)>=s*c&&(p=a.left)<=y&&(b||C||p||g)&&(H.loadHidden||x(d[t]))&&(m&&M<3&&!o&&(h<3||N<4)||W(d[t],n))){R(d[t]);
                    r=true;
                    if(M>9){break}}else if(!r&&m&&!i&&M<4&&N<4&&h>2&&(v[0]||H.preloadAfterLoad)&&(v[0]||!o&&(b||C||p||g||d[t][$](H.sizesAttr)!="auto"))){i=v[0]||d[t]}}if(i&&!r){R(i)}}};
                var a=ae(t);
                var S=function(e){var t=e.target;
                    if(t._lazyCache){delete t._lazyCache;
                    return}L(e);
                K(t,H.loadedClass);
                Q(t,H.loadingClass);
                V(t,B);
                X(t,"lazyloaded")};
                var i=te(S);
                var B=function(e){i({target:e.target})};
                var T=function(e,t){var a=e.getAttribute("data-load-mode")||H.iframeLoadMode;
                if(a==0){e.contentWindow.location.replace(t)}else if(a==1){e.src=t}};
                var F=function(e){var t;
                    var a=e[$](H.srcsetAttr);
                    if(t=H.customMedia[e[$]("data-media")||e[$]("media")]){e.setAttribute("media",t)}if(a){e.setAttribute("srcset",a)}};
                var s=te(function(t,e,a,i,r){var n,s,o,l,u,f;
                    if(!(u=X(t,"lazybeforeunveil",e)).defaultPrevented){if(i){if(a){K(t,H.autosizesClass)}else{t.setAttribute("sizes",i)}}s=t[$](H.srcsetAttr);
                n=t[$](H.srcAttr);
                if(r){o=t.parentNode;
                    l=o&&j.test(o.nodeName||"")}f=e.firesLoad||"src"in t&&(s||n||l);
                u={target:t};
                K(t,H.loadingClass);
                if(f){clearTimeout(c);
                    c=I(L,2500);
                    V(t,B,true)}if(l){G.call(o.getElementsByTagName("source"),F)}if(s){t.setAttribute("srcset",s)}else if(n&&!l){if(d.test(t.nodeName)){T(t,n)}else{t.src=n}}if(r&&(s||l)){Y(t,{src:n})}}if(t._lazyRace){delete t._lazyRace}Q(t,H.lazyClass);
                ee(function(){var e=t.complete&&t.naturalWidth>1;
                    if(!f||e){if(e){K(t,H.fastLoadedClass)}S(u);
                t._lazyCache=true;
                I(function(){if("_lazyCache"in t){delete t._lazyCache}},9)}if(t.loading=="lazy"){M--}},true)});
                var R=function(e){if(e._lazyRace){return}var t;
                var a=n.test(e.nodeName);
                var i=a&&(e[$](H.sizesAttr)||e[$]("sizes"));
                var r=i=="auto";
                if((r||!m)&&a&&(e[$]("src")||e.srcset)&&!e.complete&&!J(e,H.errorClass)&&J(e,H.lazyClass)){return}t=X(e,"lazyunveilread").detail;
                if(r){re.updateElem(e,true,e.offsetWidth)}e._lazyRace=true;
                M++;
                s(e,t,r,i,a)};
                var r=ie(function(){H.loadMode=3;
                    a()});
                var o=function(){if(H.loadMode==3){H.loadMode=2}r()};
                var l=function(){if(m){return}if(f.now()-e<999){I(l,999);
                    return}m=true;
                H.loadMode=3;
                a();
                q("scroll",o,true)};
                return{_:function(){e=f.now();
                    k.elements=D.getElementsByClassName(H.lazyClass);
                    v=D.getElementsByClassName(H.lazyClass+" "+H.preloadClass);
                q("scroll",a,true);
                q("resize",a,true);
                q("pageshow",function(e){if(e.persisted){var t=D.querySelectorAll("."+H.loadingClass);
                if(t.length&&t.forEach){U(function(){t.forEach(function(e){if(e.complete){R(e)}})})}}});
                if(u.MutationObserver){new MutationObserver(a).observe(O,{childList:true,subtree:true,attributes:true})}else{O[P]("DOMNodeInserted",a,true);
                O[P]("DOMAttrModified",a,true);
                setInterval(a,999)}q("hashchange",a,true);
                ["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){D[P](e,a,true)});
                if(/d$|^c/.test(D.readyState)){l()}else{q("load",l);
                D[P]("DOMContentLoaded",a);
                I(l,2e4)}if(k.elements.length){t();
                    ee._lsFlush()}else{a()}},checkElems:a,unveil:R,_aLSL:o}}(),re=function(){var a;
                    var n=te(function(e,t,a,i){var r,n,s;
                    e._lazysizesWidth=i;
                    i+="px";
                e.setAttribute("sizes",i);
                if(j.test(t.nodeName||"")){r=t.getElementsByTagName("source");
                for(n=0,s=r.length;
                    n<s;
                    n++){r[n].setAttribute("sizes",i)}}if(!a.detail.dataAttr){Y(e,a.detail)}});
                var i=function(e,t,a){var i;
                    var r=e.parentNode;
                    if(r){a=s(e,r,a);
                    i=X(e,"lazybeforesizes",{width:a,dataAttr:!!t});
                if(!i.defaultPrevented){a=i.detail.width;
                    if(a&&a!==e._lazysizesWidth){n(e,r,i,a)}}}};
                var e=function(){var e;
                    var t=a.length;
                    if(t){e=0;
                    for(;
                    e<t;
                    e++){i(a[e])}}};
                var t=ie(e);
                return{_:function(){a=D.getElementsByClassName(H.autosizesClass);
                    q("resize",t)},checkElems:t,updateElem:i}}(),t=function(){if(!t.i&&D.getElementsByClassName){t.i=true;
                    re._();
                    e._()}};
                return I(function(){H.init&&t()}),k={cfg:H,autoSizer:re,loader:e,init:t,uP:Y,aC:K,rC:Q,hC:J,fire:X,gW:s,rAF:ee}}(e,e.document,Date);
                e.lazySizes=t,"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:{});
                
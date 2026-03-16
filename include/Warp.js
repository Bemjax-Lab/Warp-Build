function Warp(engineOptions) {

var buildDate = "2026-03-16 11:32:14";

var warp = this;

var _fontsCss = "@font-face{font-family:remixicon;font-style:normal;font-weight:400;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.woff2) format(\"woff2\")}@font-face{font-family:Oswald;font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:Montserrat;font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:Montserrat;font-style:normal;font-weight:800;src:url(https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_c5H3gnD_g.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\n";
var _skinCss = ":host{--font1: Montserrat, sans-serif;--font2: Oswald, sans-serif}:host{--xs: 25px;--sm: 35px;--md: 50px;--lg: 70px;--xl: 100px}:host{--winBorderRadius: 2px}\n";
var _warpCss = "*,:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}canvas{image-rendering:-moz-crisp-edges;image-rendering:-webkit-crisp-edges;image-rendering:crisp-edges;image-rendering:pixelated}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}table{width:100%;margin:0;padding:0}td{margin:0;padding-top:10px;padding-bottom:10px}tbody{width:100%;max-height:200px;overflow-y:scroll}tr{width:100%}tr th{font-weight:700;text-align:center;padding-top:10px;padding-bottom:10px}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.icon,a,body,button,div,input,select,textarea{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}textarea{resize:none}a{color:var(--linkColor);fill:var(--linkColor);cursor:pointer;text-decoration:none}a,a:active,a:focus,a:hover,a:visited{text-decoration:none;fill:var(--linkColor)}.button,button{font-weight:400;transition:background .2s;margin-bottom:0;text-align:center;white-space:nowrap;vertical-align:middle;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid transparent;user-select:none;overflow:hidden;height:var(--md);border-radius:calc(var(--md) / 2)}.button.active.focus,.button.active:focus,.button.focus,.button:active.focus,.button:active:focus,.button:focus,button:active:focus,button:focus{outline:0 auto -webkit-focus-ring-color}.button.focus,.button:focus,.button:hover,button:focus,button:hover{text-decoration:none}.button.active,.button:active,button:active,button.active,button.a{background-image:none;outline:0;box-shadow:inset 0 3px 5px #00000020}.button.disabled,.button[disabled],button.disabled,fieldset[disabled] .button{cursor:not-allowed;opacity:.65;box-shadow:none}a.button.disabled,fieldset[disabled] a.button{pointer-events:none}button:hover{opacity:1}button:focus{opacity:1;border-color:var(--secondaryBg)}button:active{background-size:100%;transition:background 0s;opacity:1}.button-xs,button.xs{font-size:.8em;height:var(--xs);border-radius:calc(var(--xs) / 2);padding:0 13px}.button-sm,button.sm{font-size:.9em;height:var(--sm);border-radius:calc(var(--sm) / 2)}.button-lg,button.lg{font-size:1.2em;height:var(--lg);border-radius:calc(var(--lg) / 2)}.button-xl,button.xl{font-size:1.4em;height:var(--xl);border-radius:calc(var(--xl) / 2)}.button-xs.round,button.xs.round{width:var(--xs);padding:0}.button-sm.round,button.sm.round{width:var(--sm);padding:0}.button.round,button.round{width:var(--md);padding:0}.button-lg.round,button.lg.round{width:var(--lg);padding:0}.button-xl.round,button.xl.round{width:var(--xl);padding:0}button.round.xs{height:var(--xs);width:var(--xs);border-radius:50%}button.round.sm{height:var(--sm);width:var(--sm);border-radius:50%}button.round,button.round.md{height:var(--md);width:var(--md);border-radius:50%;padding:0}button.xl.round{background-color:var(--textBg);color:var(--linkColor);width:var(--xl);height:var(--xl);border-color:transparent;border-radius:50%;padding:0}button.xl.round>.icon{width:50px;height:50px;fill:var(--linkColor)}.button .icon,button .icon{fill:currentColor;stroke:currentColor;width:21px;height:21px;pointer-events:none}.button-sm .icon,button.sm .icon{width:17px;height:17px}.button-xs .icon,button.xs .icon{width:13px;height:13px}.button-lg .icon,button.lg .icon{height:31px;width:31px}.button-xl .icon,button.xl .icon{height:50px;width:50px}.button .icon:hover,button .icon:hover,.button use:hover,button use:hover,.button use:active,button use:active{fill:none}.button-block{display:block;width:100%}.button-block+.button-block{margin-top:5px}.button svg,button svg{stroke:none;stroke-opacity:0;background-color:transparent}.button-default,.button-default svg,button.default,button.default svg{color:var(--defaultColor);fill:var(--defaultColor)}.button-primary,.button-primary svg,button.primary,button.primary svg{color:var(--primaryColor);fill:var(--primaryColor)}.button-secondary,.button-secondary svg,button.secondary,button.secondary svg{color:var(--secondaryColor);fill:var(--secondaryColor)}.button-warning,.button-warning svg,button.warning,button.warning svg{color:var(--warningColor);fill:var(--warningColor)}.button-danger,.button-danger svg,button.danger,button.danger svg{color:var(--dangerColor);fill:var(--dangerColor)}.button-success,.button-success svg,button.success,button.success svg{color:var(--successColor);fill:var(--successColor)}.button-link,button.link{color:var(--linkColor);fill:var(--linkColor);letter-spacing:0;font-weight:400;background:none;border:1px solid transparent}.button-link svg,button.link svg,.button-link:hover,button.link:hover,.button-link:active,.button-link:focus,.button-link:visited{text-decoration:none;color:var(--linkColor);fill:var(--linkColor)}a.button.link:hover{text-decoration:underline;color:var(--linkColor);fill:var(--linkColor)}.button-default,button{background-color:var(--defaultBg);border:1px solid var(--defaultDark)}.button-default:hover,button:hover{border:1px solid var(--defaultBg)}.button-default:active,button:active{border:1px solid var(--defaultDark)}.button-primary,button.primary{background-color:var(--primaryBg);border:1px solid var(--primaryDark)}.button-primary:hover,button.primary:hover{border:1px solid var(--primaryBg)}.button-primary:active,button.primary:active{border:1px solid var(--primaryDark)}.button-secondary,button.secondary{background-color:var(--secondaryBg);border:1px solid var(--secondaryDark)}.button-secondary:hover,button.secondary:hover{border:1px solid var(--secondaryBg)}.button-secondary:active,button.secondary:active{border:1px solid var(--secondaryDark)}.button-warning,button.warning{background-color:var(--warningBg);border:1px solid var(--warningDark)}.button-warning:hover,button.warning:hover{border:1px solid var(--warningBg)}.button-warning:active,button.warning:active{border:1px solid var(--warningDark)}.button-danger,button.danger{background-color:var(--dangerBg);border:1px solid var(--dangerDark)}.button-danger:hover,button.danger:hover{border:1px solid var(--dangerBg)}.button-danger:active,button.danger:active{border:1px solid var(--dangerDark)}.button-success,button.success{background-color:var(--successBg);border:1px solid var(--successDark)}.button-success:hover,button.success:hover{border:1px solid var(--successBg)}.button-success:active,button.success:active{border:1px solid var(--successDark)}.button-default.inverted,button.inverted.default{color:var(--defaultBg);fill:var(--defaultBg);background-color:var(--defaultColor);border:1px solid var(--defaultColor)}.button-primary.inverted,button.inverted.primary,button.inverted.primary>svg{color:var(--primaryBg);fill:var(--primaryBg);background-color:var(--primaryColor);border:1px solid var(--primaryColor)}.button-secondary.inverted,button.inverted.secondary{color:var(--secondaryBg);fill:var(--secondaryBg);background-color:var(--secondaryColor);border:1px solid var(--secondaryColor)}.button-warning.inverted,button.inverted.warning{color:var(--warningBg);fill:var(--warningBg);background-color:var(--warningColor);border:1px solid var(--warningColor)}.button-danger.inverted,button.inverted.danger{color:var(--dangerBg);fill:var(--dangerBg);background-color:var(--dangerColor);border:1px solid var(--dangerColor)}.button-success.inverted,button.inverted.success{color:var(--successBg);fill:var(--successBg);background-color:var(--successColor);border:1px solid var(--successColor)}.button-link.inverted,button.inverted.link{color:var(--linkBg);fill:var(--linkBg);background-color:var(--linkColor);border:1px solid var(--linkColor)}iframe{background:0 0;padding:0;margin:0;border:none;font-size:13px;background-color:var(--textBg);color:var(--textColor)}*::-webkit-scrollbar{width:5px;background:#01010100;opacity:.6;overflow:visible;margin-left:-10}*::-webkit-scrollbar-track{background:#01010100}*::-webkit-scrollbar-thumb{background:var(--defaultBg);opacity:.6;border-radius:2px;margin-left:-15px}@-moz-document url-prefix(){*{scrollbar-color:var(--defaultBg) rgba(1,1,1,0);scrollbar-width:thin}}.gui,.gui>.man,.scripts{margin:0;padding:0;position:fixed;left:0;top:0;width:0;height:0}.gui{z-index:2;font-family:var(--font1);font-size:13px!important;color:var(--textColor)}.gui>.man.active{z-index:10}.gui>canvas.man{pointer-events:none;display:block}.backdrop{position:fixed;left:0;top:0;width:100%;height:100%;background-image:linear-gradient(45deg,#0006 25%,#0000004d 25% 50%,#0006 50% 75%,#0000004d 75% 100%);background-size:30.57px 30px;cursor:pointer}.disabled{opacity:.4!important;pointer-events:none!important;overflow:hidden!important}.fr{float:right!important}.fl{float:left!important}.fi{float:initial}.raised{box-shadow:0 2.8px 2.2px #00000009,0 6.7px 5.3px #0000000c,0 12.5px 10px #0000000f,0 22.3px 17.9px #00000012,0 41.8px 33.4px #00000016,0 100px 80px #0000001f}.raised-sm{box-shadow:0 2.8px 2.2px #00000008,0 6.7px 5.3px #0000000d,-2px -1px 18px 1px #0000000f,0 11px 20px #00000012,0 14px 20px 3px #00000017,14px 9px 9px #0000001f}.inset-xs{box-shadow:0 0 4px 2px #999 inset}.image{background-size:cover;background-repeat:no-repeat;background-position:center center}.fixed{position:fixed!important}.clear,.clear:hover,.clear:active,.clear svg{background:none!important;border:none!important}.centered{margin-left:auto;margin-right:auto;display:inline-block}.hidden{display:none!important}.inline{display:inline;overflow:hidden}.block{display:block}.inline-block{display:inline-block;overflow:hidden}.round{border-radius:50%}.rounded-xs,.rxs{border-radius:3px!important}.rounded-sm,.rsm{border-radius:6px!important}.rounded-md,.rmd{border-radius:9px!important}.rounded-lg,.rlg{border-radius:12px!important}.rounded-xl,.rxl{border-radius:18px!important}.r2{display:grid;grid-template-columns:repeat(2,1fr)}.r3{display:grid;grid-template-columns:repeat(3,1fr)}.r4{display:grid;grid-template-columns:repeat(4,1fr)}.r5{display:grid;grid-template-columns:repeat(5,1fr)}.r6{display:grid;grid-template-columns:repeat(6,1fr)}.r7{display:grid;grid-template-columns:repeat(7,1fr)}.r8{display:grid;grid-template-columns:repeat(8,1fr)}.r9{display:grid;grid-template-columns:repeat(9,1fr)}.r10{display:grid;grid-template-columns:repeat(10,1fr)}.c2{grid-column:span 2}.c3{grid-column:span 3}.c4{grid-column:span 4}.c5{grid-column:span 5}.c6{grid-column:span 6}.c7{grid-column:span 7}.c8{grid-column:span 8}.c9{grid-column:span 9}.c10{grid-column:span 10}.mla{margin-left:auto}.mra{margin-right:auto}.mxs{margin:var(--xs)}.msm{margin:var(--sm)}.mmd{margin:var(--md)}.mlg{margin:var(--lg)}.mxl{margin:var(--xl)}.mtxs{margin-top:var(--xs)}.mtsm{margin-top:var(--sm)}.mtmd{margin-top:var(--md)}.mtlg{margin-top:var(--lg)}.mtxl{margin-top:var(--xl)}.mbxs{margin-bottom:var(--xs)}.mbsm{margin-bottom:var(--sm)}.mbmd{margin-bottom:var(--md)}.mblg{margin-bottom:var(--lg)}.mbxl{margin-bottom:var(--xl)}.m0{margin:0!important}.m5{margin:5px!important}.m10{margin:10px!important}.m15{margin:15px!important}.m20{margin:20px!important}.mt0{margin-top:0!important}.mt5{margin-top:5px!important}.mt10{margin-top:10px!important}.mt15{margin-top:15px!important}.mt20{margin-top:20px!important}.mb0{margin-bottom:0!important}.mb5{margin-bottom:5px!important}.mb10{margin-bottom:10px!important}.mb15{margin-bottom:15px!important}.mb20{margin-bottom:20px!important}.ml0{margin-left:0!important}.ml5{margin-left:5px!important}.ml10{margin-left:10px!important}.ml15{margin-left:15px!important}.ml20{margin-left:20px!important}.mr0{margin-right:0!important}.mr5{margin-right:5px!important}.mr10{margin-right:10px!important}.mr15{margin-right:15px!important}.mr20{margin-right:20px!important}.m-5{margin:-5px!important}.m-10{margin:-10px!important}.m-15{margin:-15px!important}.m-20{margin:-20px!important}.mt-5{margin-top:-5px!important}.mt-10{margin-top:-10px!important}.mt-15{margin-top:-15px!important}.mt-20{margin-top:-20px!important}.mb-5{margin-bottom:-5px!important}.mb-10{margin-bottom:-10px!important}.mb-15{margin-bottom:-15px!important}.mb-20{margin-bottom:-20px!important}.ml-5{margin-left:-5px!important}.ml-10{margin-left:-10px!important}.ml-15{margin-left:-15px!important}.ml-20{margin-left:-20px!important}.mr-5{margin-right:-5px!important}.mr-10{margin-right:-10px!important}.mr-15{margin-right:-15px!important}.mr-20{margin-right:-20px!important}.p0{padding:0!important}.p5{padding:5px!important}.p10{padding:10px!important}.p15{padding:15px!important}.p20{padding:20px!important}.pl0{padding-left:0!important}.pl5{padding-left:5px!important}.pl10{padding-left:10px!important}.pl15{padding-left:15px!important}.pl20{padding-left:20px!important}.pr0{padding-right:0!important}.pr5{padding-right:5px!important}.pr10{padding-right:10px!important}.pr15{padding-right:15px!important}.pr20{padding-right:20px!important}.pt0{padding-top:0!important}.pt5{padding-top:5px!important}.pt10{padding-top:10px!important}.pt15{padding-top:15px!important}.pt20{padding-top:20px!important}.pb0{padding-bottom:0!important}.pb5{padding-bottom:5px!important}.pb10{padding-bottom:10px!important}.pb15{padding-bottom:15px!important}.pb20{padding-bottom:20px!important}.op0{opacity:0}.op1{opacity:.1}.op2{opacity:.2}.op3{opacity:.3}.op4{opacity:.4}.op5{opacity:.5}.op6{opacity:.6}.op7{opacity:.7}.op8{opacity:.8}.op9{opacity:.9}.hxs{height:var(--xs)}.hsm{height:var(--sm)}.hmd{height:var(--md)}.hlg{height:var(--lg)}.hxl{height:var(--xl)}.wxs{width:var(--xs)}.wsm{width:var(--sm)}.wmd{width:var(--md)}.wlg{width:var(--lg)}.wxl{width:var(--xl)}.default,.s0{background-color:var(--defaultBg);fill:var(--defaultBg);color:var(--defaultColor)}.primary,.s1{background-color:var(--primaryBg);fill:var(--primaryBg);color:var(--primaryColor)}.secondary,.s2{background-color:var(--secondaryBg);fill:var(--secondaryBg);color:var(--secondaryColor)}.success,.s3{background-color:var(--successBg);fill:var(--successBg);color:var(--successColor)}.warning,.s4{background-color:var(--warningBg);fill:var(--warningBg);color:var(--warningColor)}.danger,.s5{background-color:var(--dangerBg);fill:var(--dangerBg);color:var(--dangerColor)}.link,.s6{background-color:var(--linkBg);fill:var(--linkBg);color:var(--linkColor)}.text-default,.t0{color:var(--defaultBg);fill:var(--defaultBg)}.text-primary,.t1{color:var(--primaryBg);fill:var(--primaryBg)}.text-secondary,.t2{color:var(--secondaryBg);fill:var(--secondaryBg)}.text-success,.t3{color:var(--successBg);fill:var(--successBg)}.text-warning,.t4{color:var(--warningBg);fill:var(--warningBg)}.text-danger,.t5{color:var(--dangerBg);fill:var(--dangerBg)}.text-link,.t6{color:var(--linkBg);fill:var(--linkBg)}.text-default svg{fill:var(--defaultBg)}.text-primary svg{fill:var(--primaryBg)}.text-secondary svg{fill:var(--secondaryBg)}.text-success svg{fill:var(--successBg)}.text-warning svg{fill:var(--warningBg)}.text-danger svg{fill:var(--dangerBg)}.text-link svg{fill:var(--linkBg)}.xs select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs input[type=text]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs input[type=password]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs input[type=email]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs input[type=search]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs input[type=date]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs input[type=number]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xs textarea:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){font-size:.8em;min-height:var(--xs);height:var(--xs);padding-left:5px;border-radius:2px}.xs button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){font-size:.8em;height:var(--xs);border-radius:calc(var(--xs) / 2);padding:0 13px}.xs button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl) .icon{width:13px;height:13px}.xs button.round:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){width:var(--xs);height:var(--xs);border-radius:50%;padding:0}.xs select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl)>option{min-height:var(--xs);height:var(--xs)}.sm select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm input[type=text]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm input[type=password]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm input[type=email]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm input[type=search]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm input[type=date]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm input[type=number]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.sm textarea:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){min-height:var(--sm);height:var(--sm);padding-left:5px;border-radius:2px;font-size:.9em}.sm button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){font-size:.9em;height:var(--sm);border-radius:calc(var(--sm) / 2)}.sm button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl) .icon{width:17px;height:17px}.sm button.round:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){width:var(--sm);height:var(--sm);border-radius:50%;padding:0}.sm select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl)>option{min-height:var(--sm);height:var(--sm)}.lg select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg input[type=text]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg input[type=password]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg input[type=email]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg input[type=search]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg input[type=date]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg input[type=number]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.lg textarea:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){min-height:var(--lg);height:var(--lg);font-size:1.2em}.lg button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){font-size:1.2em;height:var(--lg);border-radius:calc(var(--lg) / 2)}.lg button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl) .icon{height:31px;width:31px}.lg button.round:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){width:var(--lg);height:var(--lg);border-radius:50%;padding:0}.lg select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl)>option{min-height:var(--lg);height:var(--lg)}.xl select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl input[type=text]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl input[type=password]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl input[type=email]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl input[type=search]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl input[type=date]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl input[type=number]:not(.xs):not(.sm):not(.md):not(.lg):not(.xl),.xl textarea:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){min-height:var(--xl);height:var(--xl);font-size:1.4em}.xl button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){font-size:1.4em;height:var(--xl);border-radius:calc(var(--xl) / 2)}.xl button:not(.xs):not(.sm):not(.md):not(.lg):not(.xl) .icon{height:50px;width:50px}.xl button.round:not(.xs):not(.sm):not(.md):not(.lg):not(.xl){width:var(--xl);height:var(--xl);border-radius:50%;padding:0}.xl select:not(.xs):not(.sm):not(.md):not(.lg):not(.xl)>option{min-height:var(--xl);height:var(--xl)}.icon:before{font-family:remixicon;font-style:normal;font-weight:400;-webkit-font-smoothing:antialiased;display:inline-block}.icon-home:before{content:\"\\ee2b\"}.icon-search:before{content:\"\\f0d1\"}.icon-gear:before{content:\"\\f0e6\"}.icon-gears:before{content:\"\\f0e8\"}.icon-cog:before{content:\"\\f0e6\"}.icon-sliders:before{content:\"\\ec9d\"}.icon-user:before{content:\"\\f2de\"}.icon-users:before{content:\"\\f2e2\"}.icon-star:before{content:\"\\f18b\"}.icon-heart:before{content:\"\\ee0f\"}.icon-bell:before{content:\"\\ef9a\"}.icon-clock:before{content:\"\\f201\"}.icon-calendar:before{content:\"\\eb27\"}.icon-tag:before{content:\"\\f025\"}.icon-tags:before{content:\"\\f025\"}.icon-bookmark:before{content:\"\\eae5\"}.icon-thumbtack:before{content:\"\\f039\"}.icon-link:before{content:\"\\eeb2\"}.icon-unlink:before{content:\"\\eeb1\"}.icon-globe:before{content:\"\\edcf\"}.icon-filter:before{content:\"\\ed27\"}.icon-sort:before{content:\"\\f15f\"}.icon-bolt:before{content:\"\\ed3d\"}.icon-magic:before{content:\"\\eeea\"}.icon-key:before{content:\"\\ee71\"}.icon-shield:before{content:\"\\f108\"}.icon-info:before{content:\"\\ee59\"}.icon-warn:before{content:\"\\eca1\"}.icon-check:before{content:\"\\eb7b\"}.icon-check-circle:before{content:\"\\eb81\"}.icon-close:before{content:\"\\eb99\"}.icon-circle-xmark:before{content:\"\\eb97\"}.icon-ban:before{content:\"\\ed95\"}.icon-question:before{content:\"\\f045\"}.icon-exclamation:before{content:\"\\ea21\"}.icon-spinner:before{content:\"\\eeca\"}.icon-circle-notch:before{content:\"\\eeca\"}.icon-eye:before{content:\"\\ecb5\"}.icon-eye-off:before{content:\"\\ecb7\"}.icon-lock:before{content:\"\\eece\"}.icon-unlock:before{content:\"\\eed2\"}.icon-plus:before{content:\"\\ea13\"}.icon-minus:before{content:\"\\f1af\"}.icon-edit:before{content:\"\\ec86\"}.icon-pen:before{content:\"\\efe0\"}.icon-save:before{content:\"\\f0b3\"}.icon-trash:before{content:\"\\ec2a\"}.icon-trash-can:before{content:\"\\ec29\"}.icon-copy:before{content:\"\\ecd5\"}.icon-paste:before{content:\"\\eb91\"}.icon-cut:before{content:\"\\f0bf\"}.icon-clone:before{content:\"\\ecd5\"}.icon-download:before{content:\"\\ec5a\"}.icon-upload:before{content:\"\\f212\"}.icon-refresh:before{content:\"\\f064\"}.icon-sync:before{content:\"\\f064\"}.icon-undo:before{content:\"\\ea58\"}.icon-redo:before{content:\"\\ea5a\"}.icon-print:before{content:\"\\f029\"}.icon-share:before{content:\"\\f0fe\"}.icon-external:before{content:\"\\ecaf\"}.icon-file:before{content:\"\\eceb\"}.icon-file-lines:before{content:\"\\ed0f\"}.icon-file-code:before{content:\"\\ecd1\"}.icon-file-image:before{content:\"\\ee4b\"}.icon-file-pdf:before{content:\"\\ecfd\"}.icon-file-audio:before{content:\"\\ecf7\"}.icon-file-video:before{content:\"\\ed21\"}.icon-file-archive:before{content:\"\\ed1f\"}.icon-file-csv:before{content:\"\\eccd\"}.icon-file-excel:before{content:\"\\ecdf\"}.icon-file-export:before{content:\"\\ecaf\"}.icon-file-import:before{content:\"\\ec5a\"}.icon-file-pen:before{content:\"\\ecdb\"}.icon-file-circle-plus:before{content:\"\\ecc9\"}.icon-folder:before{content:\"\\ed6a\"}.icon-folder-open:before{content:\"\\ed70\"}.icon-folder-plus:before{content:\"\\ed5a\"}.icon-folder-minus:before{content:\"\\ed74\"}.icon-folder-tree:before{content:\"\\ef90\"}.icon-hard-drive:before{content:\"\\edf9\"}.icon-server:before{content:\"\\f0e0\"}.icon-database:before{content:\"\\ec18\"}.icon-cloud:before{content:\"\\eb9d\"}.icon-cloud-upload:before{content:\"\\ec56\"}.icon-cloud-download:before{content:\"\\ec58\"}.icon-floppy:before{content:\"\\f0af\"}.icon-box:before{content:\"\\ee4f\"}.icon-box-archive:before{content:\"\\ea48\"}.icon-boxes:before{content:\"\\ea44\"}.icon-warehouse:before{content:\"\\f1a9\"}.icon-cabinet:before{content:\"\\ea46\"}.icon-drawer:before{content:\"\\ea46\"}.icon-sd-card:before{content:\"\\f0c9\"}.icon-window:before{content:\"\\f1fa\"}.icon-window-maximize:before{content:\"\\ed9c\"}.icon-window-minimize:before{content:\"\\ed9a\"}.icon-window-restore:before{content:\"\\eff4\"}.icon-layer-group:before{content:\"\\f181\"}.icon-object-group:before{content:\"\\ee90\"}.icon-object-ungroup:before{content:\"\\eddf\"}.icon-table-cells:before{content:\"\\f1de\"}.icon-table-columns:before{content:\"\\ee94\"}.icon-table-list:before{content:\"\\eebe\"}.icon-columns:before{content:\"\\ee94\"}.icon-grip-vertical:before{content:\"\\ec62\"}.icon-grip-lines:before{content:\"\\ec60\"}.icon-up-down-left-right:before{content:\"\\ec62\"}.icon-maximize:before{content:\"\\ed9c\"}.icon-minimize:before{content:\"\\ed9a\"}.icon-crop:before{content:\"\\ec02\"}.icon-expand:before{content:\"\\ed9c\"}.icon-compress:before{content:\"\\ed9a\"}.icon-bars:before{content:\"\\ef3e\"}.icon-grip:before{content:\"\\ec60\"}.icon-ellipsis:before{content:\"\\ef79\"}.icon-ellipsis-v:before{content:\"\\ef77\"}.icon-palette:before{content:\"\\efc5\"}.icon-paintbrush:before{content:\"\\eb01\"}.icon-image:before{content:\"\\ee4b\"}.icon-icons:before{content:\"\\ea44\"}.icon-puzzle:before{content:\"\\f247\"}.icon-sidebar:before{content:\"\\f128\"}.icon-panel-left:before{content:\"\\f128\"}.icon-arrow-up:before{content:\"\\ea76\"}.icon-arrow-down:before{content:\"\\ea4c\"}.icon-arrow-left:before{content:\"\\ea60\"}.icon-arrow-right:before{content:\"\\ea6c\"}.icon-chevron-up:before{content:\"\\ea78\"}.icon-chevron-down:before{content:\"\\ea4e\"}.icon-chevron-left:before{content:\"\\ea64\"}.icon-chevron-right:before{content:\"\\ea6e\"}.icon-angles-left:before{content:\"\\ea64\"}.icon-angles-right:before{content:\"\\ea6e\"}.icon-caret-up:before{content:\"\\ea56\"}.icon-caret-down:before{content:\"\\ea50\"}.icon-caret-left:before{content:\"\\ea52\"}.icon-caret-right:before{content:\"\\ea54\"}.icon-play:before{content:\"\\f00b\"}.icon-pause:before{content:\"\\efd8\"}.icon-stop:before{content:\"\\f1a1\"}.icon-forward:before{content:\"\\f144\"}.icon-backward:before{content:\"\\f140\"}.icon-volume:before{content:\"\\f20c\"}.icon-volume-off:before{content:\"\\f210\"}.icon-music:before{content:\"\\ef85\"}.icon-camera:before{content:\"\\eb31\"}.icon-video:before{content:\"\\f205\"}.icon-code:before{content:\"\\eba9\"}.icon-terminal:before{content:\"\\f1f6\"}.icon-bug:before{content:\"\\eb07\"}.icon-wrench:before{content:\"\\f0e8\"}.icon-hammer:before{content:\"\\edef\"}.icon-plug:before{content:\"\\f017\"}.icon-power-off:before{content:\"\\f126\"}.icon-trash-restore:before{content:\"\\ec2a\"}.icon-circle:before{content:\"\\f250\"}.icon-square:before{content:\"\\f24e\"}.icon-list:before{content:\"\\eebe\"}.icon-list-check:before{content:\"\\eeba\"}.icon-indent:before{content:\"\\ee55\"}.icon-outdent:before{content:\"\\ee54\"}.icon-sitemap:before{content:\"\\efb8\"}.icon-diagram:before{content:\"\\efb8\"}.icon-chart-bar:before{content:\"\\ea9e\"}.icon-chart-line:before{content:\"\\eeab\"}.icon-chart-pie:before{content:\"\\effa\"}input{user-select:text}textarea{min-height:150px;padding-top:10px}select,select.md,input[type=text],input[type=password],input[type=email],input[type=search],input[type=date],input[type=number],textarea{width:100%;border:1px solid var(--defaultDark);min-height:var(--md);height:var(--md);padding-left:15px;border-radius:5px;outline:none;background-color:var(--itemBg);color:var(--itemColor);font-size:1em}select.sm,input[type=text].sm,input[type=password].sm,input[type=email].sm,input[type=search].sm,input[type=date].sm,input[type=number].sm{min-height:var(--sm);height:var(--sm);padding-left:5px;border-radius:2px;font-size:.9em}select.xs,input[type=text].xs,input[type=password].xs,input[type=email].xs,input[type=search].xs,input[type=date].xs,input[type=number].xs{font-size:.8em;min-height:var(--xs);height:var(--xs);padding-left:5px;border-radius:2px}select.md>option,select>option,option.md{min-height:var(--md);height:var(--md)}select.xs>option,option.xs{min-height:var(--xs);height:var(--xs)}select.sm>option,option.sm{min-height:var(--sm);height:var(--sm)}select.lg>option,option.lg{min-height:var(--lg);height:var(--lg)}select.xl>option,option.xl{min-height:var(--xl);height:var(--xl)}select{background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20448%22%20enable-background%3D%22new%200%200%20256%20448%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E.arrow%7Bfill%3Adarkgrey%3B%7D%3C%2Fstyle%3E%3Cpath%20class%3D%22arrow%22%20d%3D%22M255.9%20168c0-4.2-1.6-7.9-4.8-11.2-3.2-3.2-6.9-4.8-11.2-4.8H16c-4.2%200-7.9%201.6-11.2%204.8S0%20163.8%200%20168c0%204.4%201.6%208.2%204.8%2011.4l112%20112c3.1%203.1%206.8%204.6%2011.2%204.6%204.4%200%208.2-1.5%2011.4-4.6l112-112c3-3.2%204.5-7%204.5-11.4z%22%2F%3E%3C%2Fsvg%3E);background-position:right 10px center;background-repeat:no-repeat;background-size:auto 50%;padding-left:15px;padding-right:30px;outline:none;-moz-appearance:none;-webkit-appearance:none;appearance:none}input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active,textarea:-webkit-autofill,textarea:-webkit-autofill:hover,textarea:-webkit-autofill:focus,textarea:-webkit-autofill:active,select:-webkit-autofill,select:-webkit-autofill:hover,select:-webkit-autofill:focus,select:-webkit-autofill:active{color:var(--itemColor);-webkit-box-shadow:0 0 0 50px var(--itemBg) inset!important;outline:none;border:1px solid var(--defaultDark)!important}input::placeholder,textarea::placeholder{color:var(--defaultDark)}input[type=radio]{cursor:pointer}.radio label{display:block;padding-top:2px;padding-bottom:2px;cursor:pointer}.check{margin-top:5px;cursor:pointer}input[type=range]{-webkit-appearance:none;margin-top:5px!important;width:100%;background:none}input[type=range]:focus{outline:none}input[type=range]::-webkit-slider-runnable-track{width:100%;height:8.4px;cursor:pointer;background:#000000b3;border:1px solid rgba(0,0,0,0)}input[type=range]::-webkit-slider-thumb{box-shadow:0 0 1px #000,0 0 3px #0d0d0d;height:25px;width:12px;border-radius:3px 3px 6px 6px;background:var(--primaryBg);cursor:pointer;-webkit-appearance:none;margin-top:-10px}input[type=range]::-moz-range-track{width:100%;height:8.4px;cursor:pointer;background:#000000b3;border:1px solid rgba(0,0,0,0)}input[type=range]::-moz-range-thumb{box-shadow:0 0 1px #000,0 0 3px #0d0d0d;height:25px;width:12px;border-radius:3px 3px 6px 6px;background:var(--primaryBg);cursor:pointer;margin-top:-10px}.text *,.text,.t,.t *{background-color:#fff;color:#000;text-align:left;word-break:break-word}.text a{background-color:var(--linkBg);color:var(--linkColor)}p{line-height:1.8em}.tcap{text-transform:capitalize}.tcf:first-letter{text-transform:capitalize}strong,.tb{font-weight:700}.tn{font-weight:400}.tu{text-decoration:underline}.ti{font-style:italic}small,.tsm{font-size:.8em}.txs{font-size:.7em}.tlg{font-size:1.2em}.txl{font-size:1.6em}.tc{text-align:center}.tj{text-align:justify}.tl{text-align:left}.tr{text-align:right}.tu{text-transform:uppercase}.win{background-color:var(--winBodyBg);color:var(--textColor);position:absolute;margin:0;overflow:hidden;border-radius:var(--winBorderRadius)}.win>.head{height:var(--sm);display:flex;align-items:center;background-color:var(--winHeadBg);color:var(--winHeadColor);fill:var(--winHeadColor);border:none;touch-action:none;cursor:grab;user-select:none}.win>.head>.left{display:flex;align-items:center;flex-shrink:0}.win>.head>.center{flex:1;display:flex;align-items:center;overflow:hidden;margin:0 20px}.win>.head>.center>*{margin-right:5px}.win>.head>.right{display:flex;align-items:center;flex-shrink:0}.win>.head>.left>.caption{font-family:var(--font2);font-size:10pt;letter-spacing:.6pt;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:75px}.win>.head span,.win>.head img{user-select:none;touch-action:none;pointer-events:none}.win.active{z-index:10}.win.active>.head{background-color:var(--winHeadActiveBg);color:var(--winHeadActiveColor);fill:var(--winHeadActiveColor)}.win>.head>.right>*{margin-right:5px}.win>.head>.left>*{margin-left:5px}.win>.body{width:100%;overflow-y:scroll;background:var(--winBodyBg);color:var(--winBodyColor)}.win>.menu{z-index:1000;background-image:linear-gradient(45deg,#0006 25%,#0000004d 25% 50%,#0006 50% 75%,#0000004d 75% 100%);position:fixed;top:30px;left:0;width:100%;background-color:#0000001a;cursor:pointer;background-size:30.57px 30px}.win>.close{position:absolute;bottom:10px;right:10px;padding:0;opacity:.3;background:var(--primaryColor);color:var(--primaryLight);width:var(--md);height:var(--md);cursor:pointer;font-weight:700;font-size:18px;border-radius:50%}.win>.close:hover{opacity:1}\n";

/* fflate */
/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/fflate@0.8.2/umd/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(f){typeof module!='undefined'&&typeof exports=='object'?module.exports=f():typeof define!='undefined'&&define.amd?define(f):(typeof self!='undefined'?self:this).fflate=f()}(function(){var _e={};"use strict";var t=(typeof module!='undefined'&&typeof exports=='object'?function(_f){"use strict";var e,t=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{e=require("worker_threads").Worker}catch(e){}exports.default=e?function(r,n,o,a,s){var u=!1,i=new e(r+t,{eval:!0}).on("error",(function(e){return s(e,null)})).on("message",(function(e){return s(null,e)})).on("exit",(function(e){e&&!u&&s(Error("exited with code "+e),null)}));return i.postMessage(o,a),i.terminate=function(){return u=!0,e.prototype.terminate.call(i)},i}:function(e,t,r,n,o){setImmediate((function(){return o(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)}));var a=function(){};return{terminate:a,postMessage:a}};return _f}:function(_f){"use strict";var e={};_f.default=function(r,t,s,a,n){var o=new Worker(e[t]||(e[t]=URL.createObjectURL(new Blob([r+';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'],{type:"text/javascript"}))));return o.onmessage=function(e){var r=e.data,t=r.$e$;if(t){var s=Error(t[0]);s.code=t[1],s.stack=t[2],n(s,null)}else n(null,r)},o.postMessage(s,a),o};return _f})({}),n=Uint8Array,r=Uint16Array,e=Int32Array,i=new n([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),o=new n([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new n([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,n){for(var i=new r(31),o=0;o<31;++o)i[o]=n+=1<<t[o-1];var s=new e(i[30]);for(o=1;o<30;++o)for(var a=i[o];a<i[o+1];++a)s[a]=a-i[o]<<5|o;return{b:i,r:s}},u=a(i,2),h=u.b,f=u.r;h[28]=258,f[258]=28;for(var l=a(o,0),c=l.b,p=l.r,v=new r(32768),d=0;d<32768;++d){var g=(43690&d)>>1|(21845&d)<<1;v[d]=((65280&(g=(61680&(g=(52428&g)>>2|(13107&g)<<2))>>4|(3855&g)<<4))>>8|(255&g)<<8)>>1}var y=function(t,n,e){for(var i=t.length,o=0,s=new r(n);o<i;++o)t[o]&&++s[t[o]-1];var a,u=new r(n);for(o=1;o<n;++o)u[o]=u[o-1]+s[o-1]<<1;if(e){a=new r(1<<n);var h=15-n;for(o=0;o<i;++o)if(t[o])for(var f=o<<4|t[o],l=n-t[o],c=u[t[o]-1]++<<l,p=c|(1<<l)-1;c<=p;++c)a[v[c]>>h]=f}else for(a=new r(i),o=0;o<i;++o)t[o]&&(a[o]=v[u[t[o]-1]++]>>15-t[o]);return a},m=new n(288);for(d=0;d<144;++d)m[d]=8;for(d=144;d<256;++d)m[d]=9;for(d=256;d<280;++d)m[d]=7;for(d=280;d<288;++d)m[d]=8;var b=new n(32);for(d=0;d<32;++d)b[d]=5;var w=y(m,9,0),x=y(m,9,1),z=y(b,5,0),k=y(b,5,1),M=function(t){for(var n=t[0],r=1;r<t.length;++r)t[r]>n&&(n=t[r]);return n},S=function(t,n,r){var e=n/8|0;return(t[e]|t[e+1]<<8)>>(7&n)&r},A=function(t,n){var r=n/8|0;return(t[r]|t[r+1]<<8|t[r+2]<<16)>>(7&n)},T=function(t){return(t+7)/8|0},D=function(t,r,e){return(null==r||r<0)&&(r=0),(null==e||e>t.length)&&(e=t.length),new n(t.subarray(r,e))};_e.FlateErrorCode={UnexpectedEOF:0,InvalidBlockType:1,InvalidLengthLiteral:2,InvalidDistance:3,StreamFinished:4,NoStreamHandler:5,InvalidHeader:6,NoCallback:7,InvalidUTF8:8,ExtraFieldTooLong:9,InvalidDate:10,FilenameTooLong:11,StreamFinishing:12,InvalidZipData:13,UnknownCompressionMethod:14};var C=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],I=function(t,n,r){var e=Error(n||C[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,I),!r)throw e;return e},U=function(t,r,e,a){var u=t.length,f=a?a.length:0;if(!u||r.f&&!r.l)return e||new n(0);var l=!e,p=l||2!=r.i,v=r.i;l&&(e=new n(3*u));var d=function(t){var r=e.length;if(t>r){var i=new n(Math.max(2*r,t));i.set(e),e=i}},g=r.f||0,m=r.p||0,b=r.b||0,w=r.l,z=r.d,C=r.m,U=r.n,F=8*u;do{if(!w){g=S(t,m,1);var E=S(t,m+1,3);if(m+=3,!E){var Z=t[(J=T(m)+4)-4]|t[J-3]<<8,q=J+Z;if(q>u){v&&I(0);break}p&&d(b+Z),e.set(t.subarray(J,q),b),r.b=b+=Z,r.p=m=8*q,r.f=g;continue}if(1==E)w=x,z=k,C=9,U=5;else if(2==E){var O=S(t,m,31)+257,G=S(t,m+10,15)+4,L=O+S(t,m+5,31)+1;m+=14;for(var H=new n(L),j=new n(19),N=0;N<G;++N)j[s[N]]=S(t,m+3*N,7);m+=3*G;var P=M(j),B=(1<<P)-1,Y=y(j,P,1);for(N=0;N<L;){var J,K=Y[S(t,m,B)];if(m+=15&K,(J=K>>4)<16)H[N++]=J;else{var Q=0,R=0;for(16==J?(R=3+S(t,m,3),m+=2,Q=H[N-1]):17==J?(R=3+S(t,m,7),m+=3):18==J&&(R=11+S(t,m,127),m+=7);R--;)H[N++]=Q}}var V=H.subarray(0,O),W=H.subarray(O);C=M(V),U=M(W),w=y(V,C,1),z=y(W,U,1)}else I(1);if(m>F){v&&I(0);break}}p&&d(b+131072);for(var X=(1<<C)-1,$=(1<<U)-1,_=m;;_=m){var tt=(Q=w[A(t,m)&X])>>4;if((m+=15&Q)>F){v&&I(0);break}if(Q||I(2),tt<256)e[b++]=tt;else{if(256==tt){_=m,w=null;break}var nt=tt-254;tt>264&&(nt=S(t,m,(1<<(it=i[N=tt-257]))-1)+h[N],m+=it);var rt=z[A(t,m)&$],et=rt>>4;if(rt||I(3),m+=15&rt,W=c[et],et>3){var it=o[et];W+=A(t,m)&(1<<it)-1,m+=it}if(m>F){v&&I(0);break}p&&d(b+131072);var ot=b+nt;if(b<W){var st=f-W,at=Math.min(W,ot);for(st+b<0&&I(3);b<at;++b)e[b]=a[st+b]}for(;b<ot;++b)e[b]=e[b-W]}}r.l=w,r.p=_,r.b=b,r.f=g,w&&(g=1,r.m=C,r.d=z,r.n=U)}while(!g);return b!=e.length&&l?D(e,0,b):e.subarray(0,b)},F=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>8},E=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>8,t[e+2]|=r>>16},Z=function(t,e){for(var i=[],o=0;o<t.length;++o)t[o]&&i.push({s:o,f:t[o]});var s=i.length,a=i.slice();if(!s)return{t:N,l:0};if(1==s){var u=new n(i[0].s+1);return u[i[0].s]=1,{t:u,l:1}}i.sort((function(t,n){return t.f-n.f})),i.push({s:-1,f:25001});var h=i[0],f=i[1],l=0,c=1,p=2;for(i[0]={s:-1,f:h.f+f.f,l:h,r:f};c!=s-1;)h=i[i[l].f<i[p].f?l++:p++],f=i[l!=c&&i[l].f<i[p].f?l++:p++],i[c++]={s:-1,f:h.f+f.f,l:h,r:f};var v=a[0].s;for(o=1;o<s;++o)a[o].s>v&&(v=a[o].s);var d=new r(v+1),g=q(i[c-1],d,0);if(g>e){o=0;var y=0,m=g-e,b=1<<m;for(a.sort((function(t,n){return d[n.s]-d[t.s]||t.f-n.f}));o<s;++o){var w=a[o].s;if(!(d[w]>e))break;y+=b-(1<<g-d[w]),d[w]=e}for(y>>=m;y>0;){var x=a[o].s;d[x]<e?y-=1<<e-d[x]++-1:++o}for(;o>=0&&y;--o){var z=a[o].s;d[z]==e&&(--d[z],++y)}g=e}return{t:new n(d),l:g}},q=function(t,n,r){return-1==t.s?Math.max(q(t.l,n,r+1),q(t.r,n,r+1)):n[t.s]=r},O=function(t){for(var n=t.length;n&&!t[--n];);for(var e=new r(++n),i=0,o=t[0],s=1,a=function(t){e[i++]=t},u=1;u<=n;++u)if(t[u]==o&&u!=n)++s;else{if(!o&&s>2){for(;s>138;s-=138)a(32754);s>2&&(a(s>10?s-11<<5|28690:s-3<<5|12305),s=0)}else if(s>3){for(a(o),--s;s>6;s-=6)a(8304);s>2&&(a(s-3<<5|8208),s=0)}for(;s--;)a(o);s=1,o=t[u]}return{c:e.subarray(0,i),n:n}},G=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},L=function(t,n,r){var e=r.length,i=T(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var o=0;o<e;++o)t[i+o+4]=r[o];return 8*(i+4+e)},H=function(t,n,e,a,u,h,f,l,c,p,v){F(n,v++,e),++u[256];for(var d=Z(u,15),g=d.t,x=d.l,k=Z(h,15),M=k.t,S=k.l,A=O(g),T=A.c,D=A.n,C=O(M),I=C.c,U=C.n,q=new r(19),H=0;H<T.length;++H)++q[31&T[H]];for(H=0;H<I.length;++H)++q[31&I[H]];for(var j=Z(q,7),N=j.t,P=j.l,B=19;B>4&&!N[s[B-1]];--B);var Y,J,K,Q,R=p+5<<3,V=G(u,m)+G(h,b)+f,W=G(u,g)+G(h,M)+f+14+3*B+G(q,N)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&R<=V&&R<=W)return L(n,v,t.subarray(c,c+p));if(F(n,v,1+(W<V)),v+=2,W<V){Y=y(g,x,0),J=g,K=y(M,S,0),Q=M;var X=y(N,P,0);for(F(n,v,D-257),F(n,v+5,U-1),F(n,v+10,B-4),v+=14,H=0;H<B;++H)F(n,v+3*H,N[s[H]]);v+=3*B;for(var $=[T,I],_=0;_<2;++_){var tt=$[_];for(H=0;H<tt.length;++H)F(n,v,X[rt=31&tt[H]]),v+=N[rt],rt>15&&(F(n,v,tt[H]>>5&127),v+=tt[H]>>12)}}else Y=w,J=m,K=z,Q=b;for(H=0;H<l;++H){var nt=a[H];if(nt>255){var rt;E(n,v,Y[257+(rt=nt>>18&31)]),v+=J[rt+257],rt>7&&(F(n,v,nt>>23&31),v+=i[rt]);var et=31&nt;E(n,v,K[et]),v+=Q[et],et>3&&(E(n,v,nt>>5&8191),v+=o[et])}else E(n,v,Y[nt]),v+=J[nt]}return E(n,v,Y[256]),v+J[256]},j=new e([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),N=new n(0),P=function(t,s,a,u,h,l){var c=l.z||t.length,v=new n(u+c+5*(1+Math.ceil(c/7e3))+h),d=v.subarray(u,v.length-h),g=l.l,y=7&(l.r||0);if(s){y&&(d[0]=l.r>>3);for(var m=j[s-1],b=m>>13,w=8191&m,x=(1<<a)-1,z=l.p||new r(32768),k=l.h||new r(x+1),M=Math.ceil(a/3),S=2*M,A=function(n){return(t[n]^t[n+1]<<M^t[n+2]<<S)&x},C=new e(25e3),I=new r(288),U=new r(32),F=0,E=0,Z=l.i||0,q=0,O=l.w||0,G=0;Z+2<c;++Z){var N=A(Z),P=32767&Z,B=k[N];if(z[P]=B,k[N]=P,O<=Z){var Y=c-Z;if((F>7e3||q>24576)&&(Y>423||!g)){y=H(t,d,0,C,I,U,E,q,G,Z-G,y),q=F=E=0,G=Z;for(var J=0;J<286;++J)I[J]=0;for(J=0;J<30;++J)U[J]=0}var K=2,Q=0,R=w,V=P-B&32767;if(Y>2&&N==A(Z-V))for(var W=Math.min(b,Y)-1,X=Math.min(32767,Z),$=Math.min(258,Y);V<=X&&--R&&P!=B;){if(t[Z+K]==t[Z+K-V]){for(var _=0;_<$&&t[Z+_]==t[Z+_-V];++_);if(_>K){if(K=_,Q=V,_>W)break;var tt=Math.min(V,_-2),nt=0;for(J=0;J<tt;++J){var rt=Z-V+J&32767,et=rt-z[rt]&32767;et>nt&&(nt=et,B=rt)}}}V+=(P=B)-(B=z[P])&32767}if(Q){C[q++]=268435456|f[K]<<18|p[Q];var it=31&f[K],ot=31&p[Q];E+=i[it]+o[ot],++I[257+it],++U[ot],O=Z+K,++F}else C[q++]=t[Z],++I[t[Z]]}}for(Z=Math.max(Z,O);Z<c;++Z)C[q++]=t[Z],++I[t[Z]];y=H(t,d,g,C,I,U,E,q,G,Z-G,y),g||(l.r=7&y|d[y/8|0]<<3,y-=7,l.h=k,l.p=z,l.i=Z,l.w=O)}else{for(Z=l.w||0;Z<c+g;Z+=65535){var st=Z+65535;st>=c&&(d[y/8|0]=g,st=c),y=L(d,y+1,t.subarray(Z,st))}l.i=c}return D(v,0,u+T(y)+h)},B=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),Y=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=B[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}},J=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,o=0|r.length,s=0;s!=o;){for(var a=Math.min(s+2655,o);s<a;++s)i+=e+=r[s];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},K=function(t,r,e,i,o){if(!o&&(o={l:1},r.dictionary)){var s=r.dictionary.subarray(-32768),a=new n(s.length+t.length);a.set(s),a.set(t,s.length),t=a,o.w=s.length}return P(t,null==r.level?6:r.level,null==r.mem?o.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(t.length)))):20:12+r.mem,e,i,o)},Q=function(t,n){var r={};for(var e in t)r[e]=t[e];for(var e in n)r[e]=n[e];return r},R=function(t,n,r){for(var e=t(),i=""+t,o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),s=0;s<e.length;++s){var a=e[s],u=o[s];if("function"==typeof a){n+=";"+u+"=";var h=""+a;if(a.prototype)if(-1!=h.indexOf("[native code]")){var f=h.indexOf(" ",8)+1;n+=h.slice(f,h.indexOf("(",f))}else for(var l in n+=h,a.prototype)n+=";"+u+".prototype."+l+"="+a.prototype[l];else n+=h}else r[u]=a}return n},V=[],W=function(t){var n=[];for(var r in t)t[r].buffer&&n.push((t[r]=new t[r].constructor(t[r])).buffer);return n},X=function(n,r,e,i){if(!V[e]){for(var o="",s={},a=n.length-1,u=0;u<a;++u)o=R(n[u],o,s);V[e]={c:R(n[a],o,s),e:s}}var h=Q({},V[e].e);return(0,t.default)(V[e].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+r+"}",e,h,W(h),i)},$=function(){return[n,r,e,i,o,s,h,c,x,k,v,C,y,M,S,A,T,D,I,U,Tt,it,ot]},_=function(){return[n,r,e,i,o,s,f,p,w,m,z,b,v,j,N,y,F,E,Z,q,O,G,L,H,T,D,P,K,kt,it]},tt=function(){return[pt,gt,ct,Y,B]},nt=function(){return[vt,dt]},rt=function(){return[yt,ct,J]},et=function(){return[mt]},it=function(t){return postMessage(t,[t.buffer])},ot=function(t){return t&&{out:t.size&&new n(t.size),dictionary:t.dictionary}},st=function(t,n,r,e,i,o){var s=X(r,e,i,(function(t,n){s.terminate(),o(t,n)}));return s.postMessage([t,n],n.consume?[t.buffer]:[]),function(){s.terminate()}},at=function(t){return t.ondata=function(t,n){return postMessage([t,n],[t.buffer])},function(n){n.data.length?(t.push(n.data[0],n.data[1]),postMessage([n.data[0].length])):t.flush()}},ut=function(t,n,r,e,i,o,s){var a,u=X(t,e,i,(function(t,r){t?(u.terminate(),n.ondata.call(n,t)):Array.isArray(r)?1==r.length?(n.queuedSize-=r[0],n.ondrain&&n.ondrain(r[0])):(r[1]&&u.terminate(),n.ondata.call(n,t,r[0],r[1])):s(r)}));u.postMessage(r),n.queuedSize=0,n.push=function(t,r){n.ondata||I(5),a&&n.ondata(I(4,0,1),null,!!r),n.queuedSize+=t.length,u.postMessage([t,a=r],[t.buffer])},n.terminate=function(){u.terminate()},o&&(n.flush=function(){u.postMessage([])})},ht=function(t,n){return t[n]|t[n+1]<<8},ft=function(t,n){return(t[n]|t[n+1]<<8|t[n+2]<<16|t[n+3]<<24)>>>0},lt=function(t,n){return ft(t,n)+4294967296*ft(t,n+4)},ct=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},pt=function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&ct(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}},vt=function(t){31==t[0]&&139==t[1]&&8==t[2]||I(6,"invalid gzip data");var n=t[3],r=10;4&n&&(r+=2+(t[10]|t[11]<<8));for(var e=(n>>3&1)+(n>>4&1);e>0;e-=!t[r++]);return r+(2&n)},dt=function(t){var n=t.length;return(t[n-4]|t[n-3]<<8|t[n-2]<<16|t[n-1]<<24)>>>0},gt=function(t){return 10+(t.filename?t.filename.length+1:0)},yt=function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=J();i.p(n.dictionary),ct(t,2,i.d())}},mt=function(t,n){return(8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31)&&I(6,"invalid zlib data"),(t[1]>>5&1)==+!n&&I(6,"invalid zlib data: "+(32&t[1]?"need":"unexpected")+" dictionary"),2+(t[1]>>3&4)};function bt(t,n){return"function"==typeof t&&(n=t,t={}),this.ondata=n,t}var wt=function(){function t(t,r){if("function"==typeof t&&(r=t,t={}),this.ondata=r,this.o=t||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new n(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return t.prototype.p=function(t,n){this.ondata(K(t,this.o,0,0,this.s),n)},t.prototype.push=function(t,r){this.ondata||I(5),this.s.l&&I(4);var e=t.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new n(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var o=this.b.length-this.s.z;this.b.set(t.subarray(0,o),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(t.subarray(o),32768),this.s.z=t.length-o+32768,this.s.i=32766,this.s.w=32768}else this.b.set(t,this.s.z),this.s.z+=t.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},t.prototype.flush=function(){this.ondata||I(5),this.s.l&&I(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},t}();_e.Deflate=wt;var xt=function(){return function(t,n){ut([_,function(){return[at,wt]}],this,bt.call(this,t,n),(function(t){var n=new wt(t.data);onmessage=at(n)}),6,1)}}();function zt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[_],(function(t){return it(kt(t.data[0],t.data[1]))}),0,r)}function kt(t,n){return K(t,n||{},0,0)}_e.AsyncDeflate=xt,_e.deflate=zt,_e.deflateSync=kt;var Mt=function(){function t(t,r){"function"==typeof t&&(r=t,t={}),this.ondata=r;var e=t&&t.dictionary&&t.dictionary.subarray(-32768);this.s={i:0,b:e?e.length:0},this.o=new n(32768),this.p=new n(0),e&&this.o.set(e)}return t.prototype.e=function(t){if(this.ondata||I(5),this.d&&I(4),this.p.length){if(t.length){var r=new n(this.p.length+t.length);r.set(this.p),r.set(t,this.p.length),this.p=r}}else this.p=t},t.prototype.c=function(t){this.s.i=+(this.d=t||!1);var n=this.s.b,r=U(this.p,this.s,this.o);this.ondata(D(r,n,this.s.b),this.d),this.o=D(r,this.s.b-32768),this.s.b=this.o.length,this.p=D(this.p,this.s.p/8|0),this.s.p&=7},t.prototype.push=function(t,n){this.e(t),this.c(n)},t}();_e.Inflate=Mt;var St=function(){return function(t,n){ut([$,function(){return[at,Mt]}],this,bt.call(this,t,n),(function(t){var n=new Mt(t.data);onmessage=at(n)}),7,0)}}();function At(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[$],(function(t){return it(Tt(t.data[0],ot(t.data[1])))}),1,r)}function Tt(t,n){return U(t,{i:2},n&&n.out,n&&n.dictionary)}_e.AsyncInflate=St,_e.inflate=At,_e.inflateSync=Tt;var Dt=function(){function t(t,n){this.c=Y(),this.l=0,this.v=1,wt.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),this.l+=t.length,wt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=K(t,this.o,this.v&&gt(this.o),n&&8,this.s);this.v&&(pt(r,this.o),this.v=0),n&&(ct(r,r.length-8,this.c.d()),ct(r,r.length-4,this.l)),this.ondata(r,n)},t.prototype.flush=function(){wt.prototype.flush.call(this)},t}();_e.Gzip=Dt,_e.Compress=Dt;var Ct=function(){return function(t,n){ut([_,tt,function(){return[at,wt,Dt]}],this,bt.call(this,t,n),(function(t){var n=new Dt(t.data);onmessage=at(n)}),8,1)}}();function It(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[_,tt,function(){return[Ut]}],(function(t){return it(Ut(t.data[0],t.data[1]))}),2,r)}function Ut(t,n){n||(n={});var r=Y(),e=t.length;r.p(t);var i=K(t,n,gt(n),8),o=i.length;return pt(i,n),ct(i,o-8,r.d()),ct(i,o-4,e),i}_e.AsyncGzip=Ct,_e.AsyncCompress=Ct,_e.gzip=It,_e.compress=It,_e.gzipSync=Ut,_e.compressSync=Ut;var Ft=function(){function t(t,n){this.v=1,this.r=0,Mt.call(this,t,n)}return t.prototype.push=function(t,r){if(Mt.prototype.e.call(this,t),this.r+=t.length,this.v){var e=this.p.subarray(this.v-1),i=e.length>3?vt(e):4;if(i>e.length){if(!r)return}else this.v>1&&this.onmember&&this.onmember(this.r-e.length);this.p=e.subarray(i),this.v=0}Mt.prototype.c.call(this,r),!this.s.f||this.s.l||r||(this.v=T(this.s.p)+9,this.s={i:0},this.o=new n(0),this.push(new n(0),r))},t}();_e.Gunzip=Ft;var Et=function(){return function(t,n){var r=this;ut([$,nt,function(){return[at,Mt,Ft]}],this,bt.call(this,t,n),(function(t){var n=new Ft(t.data);n.onmember=function(t){return postMessage(t)},onmessage=at(n)}),9,0,(function(t){return r.onmember&&r.onmember(t)}))}}();function Zt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[$,nt,function(){return[qt]}],(function(t){return it(qt(t.data[0],t.data[1]))}),3,r)}function qt(t,r){var e=vt(t);return e+8>t.length&&I(6,"invalid gzip data"),U(t.subarray(e,-8),{i:2},r&&r.out||new n(dt(t)),r&&r.dictionary)}_e.AsyncGunzip=Et,_e.gunzip=Zt,_e.gunzipSync=qt;var Ot=function(){function t(t,n){this.c=J(),this.v=1,wt.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),wt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=K(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(yt(r,this.o),this.v=0),n&&ct(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){wt.prototype.flush.call(this)},t}();_e.Zlib=Ot;var Gt=function(){return function(t,n){ut([_,rt,function(){return[at,wt,Ot]}],this,bt.call(this,t,n),(function(t){var n=new Ot(t.data);onmessage=at(n)}),10,1)}}();function Lt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[_,rt,function(){return[Ht]}],(function(t){return it(Ht(t.data[0],t.data[1]))}),4,r)}function Ht(t,n){n||(n={});var r=J();r.p(t);var e=K(t,n,n.dictionary?6:2,4);return yt(e,n),ct(e,e.length-4,r.d()),e}_e.AsyncZlib=Gt,_e.zlib=Lt,_e.zlibSync=Ht;var jt=function(){function t(t,n){Mt.call(this,t,n),this.v=t&&t.dictionary?2:1}return t.prototype.push=function(t,n){if(Mt.prototype.e.call(this,t),this.v){if(this.p.length<6&&!n)return;this.p=this.p.subarray(mt(this.p,this.v-1)),this.v=0}n&&(this.p.length<4&&I(6,"invalid zlib data"),this.p=this.p.subarray(0,-4)),Mt.prototype.c.call(this,n)},t}();_e.Unzlib=jt;var Nt=function(){return function(t,n){ut([$,et,function(){return[at,Mt,jt]}],this,bt.call(this,t,n),(function(t){var n=new jt(t.data);onmessage=at(n)}),11,0)}}();function Pt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[$,et,function(){return[Bt]}],(function(t){return it(Bt(t.data[0],ot(t.data[1])))}),5,r)}function Bt(t,n){return U(t.subarray(mt(t,n&&n.dictionary),-4),{i:2},n&&n.out,n&&n.dictionary)}_e.AsyncUnzlib=Nt,_e.unzlib=Pt,_e.unzlibSync=Bt;var Yt=function(){function t(t,n){this.o=bt.call(this,t,n)||{},this.G=Ft,this.I=Mt,this.Z=jt}return t.prototype.i=function(){var t=this;this.s.ondata=function(n,r){t.ondata(n,r)}},t.prototype.push=function(t,r){if(this.ondata||I(5),this.s)this.s.push(t,r);else{if(this.p&&this.p.length){var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length)}else this.p=t;this.p.length>2&&(this.s=31==this.p[0]&&139==this.p[1]&&8==this.p[2]?new this.G(this.o):8!=(15&this.p[0])||this.p[0]>>4>7||(this.p[0]<<8|this.p[1])%31?new this.I(this.o):new this.Z(this.o),this.i(),this.s.push(this.p,r),this.p=null)}},t}();_e.Decompress=Yt;var Jt=function(){function t(t,n){Yt.call(this,t,n),this.queuedSize=0,this.G=Et,this.I=St,this.Z=Nt}return t.prototype.i=function(){var t=this;this.s.ondata=function(n,r,e){t.ondata(n,r,e)},this.s.ondrain=function(n){t.queuedSize-=n,t.ondrain&&t.ondrain(n)}},t.prototype.push=function(t,n){this.queuedSize+=t.length,Yt.prototype.push.call(this,t,n)},t}();function Kt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),31==t[0]&&139==t[1]&&8==t[2]?Zt(t,n,r):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?At(t,n,r):Pt(t,n,r)}function Qt(t,n){return 31==t[0]&&139==t[1]&&8==t[2]?qt(t,n):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?Tt(t,n):Bt(t,n)}_e.AsyncDecompress=Jt,_e.decompress=Kt,_e.decompressSync=Qt;var Rt=function(t,r,e,i){for(var o in t){var s=t[o],a=r+o,u=i;Array.isArray(s)&&(u=Q(i,s[1]),s=s[0]),s instanceof n?e[a]=[s,u]:(e[a+="/"]=[new n(0),u],Rt(s,a,e,i))}},Vt="undefined"!=typeof TextEncoder&&new TextEncoder,Wt="undefined"!=typeof TextDecoder&&new TextDecoder,Xt=0;try{Wt.decode(N,{stream:!0}),Xt=1}catch(t){}var $t=function(t){for(var n="",r=0;;){var e=t[r++],i=(e>127)+(e>223)+(e>239);if(r+i>t.length)return{s:n,r:D(t,r-1)};i?3==i?(e=((15&e)<<18|(63&t[r++])<<12|(63&t[r++])<<6|63&t[r++])-65536,n+=String.fromCharCode(55296|e>>10,56320|1023&e)):n+=String.fromCharCode(1&i?(31&e)<<6|63&t[r++]:(15&e)<<12|(63&t[r++])<<6|63&t[r++]):n+=String.fromCharCode(e)}},_t=function(){function t(t){this.ondata=t,Xt?this.t=new TextDecoder:this.p=N}return t.prototype.push=function(t,r){if(this.ondata||I(5),r=!!r,this.t)return this.ondata(this.t.decode(t,{stream:!0}),r),void(r&&(this.t.decode().length&&I(8),this.t=null));this.p||I(4);var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length);var i=$t(e),o=i.s,s=i.r;r?(s.length&&I(8),this.p=null):this.p=s,this.ondata(o,r)},t}();_e.DecodeUTF8=_t;var tn=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||I(5),this.d&&I(4),this.ondata(nn(t),this.d=n||!1)},t}();function nn(t,r){if(r){for(var e=new n(t.length),i=0;i<t.length;++i)e[i]=t.charCodeAt(i);return e}if(Vt)return Vt.encode(t);var o=t.length,s=new n(t.length+(t.length>>1)),a=0,u=function(t){s[a++]=t};for(i=0;i<o;++i){if(a+5>s.length){var h=new n(a+8+(o-i<<1));h.set(s),s=h}var f=t.charCodeAt(i);f<128||r?u(f):f<2048?(u(192|f>>6),u(128|63&f)):f>55295&&f<57344?(u(240|(f=65536+(1047552&f)|1023&t.charCodeAt(++i))>>18),u(128|f>>12&63),u(128|f>>6&63),u(128|63&f)):(u(224|f>>12),u(128|f>>6&63),u(128|63&f))}return D(s,0,a)}function rn(t,n){if(n){for(var r="",e=0;e<t.length;e+=16384)r+=String.fromCharCode.apply(null,t.subarray(e,e+16384));return r}if(Wt)return Wt.decode(t);var i=$t(t),o=i.s;return(r=i.r).length&&I(8),o}_e.EncodeUTF8=tn,_e.strToU8=nn,_e.strFromU8=rn;var en=function(t){return 1==t?3:t<6?2:9==t?1:0},on=function(t,n){return n+30+ht(t,n+26)+ht(t,n+28)},sn=function(t,n,r){var e=ht(t,n+28),i=rn(t.subarray(n+46,n+46+e),!(2048&ht(t,n+8))),o=n+46+e,s=ft(t,n+20),a=r&&4294967295==s?an(t,o):[s,ft(t,n+24),ft(t,n+42)],u=a[0],h=a[1],f=a[2];return[ht(t,n+10),u,h,i,o+ht(t,n+30)+ht(t,n+32),f]},an=function(t,n){for(;1!=ht(t,n);n+=4+ht(t,n+2));return[lt(t,n+12),lt(t,n+4),lt(t,n+20)]},un=function(t){var n=0;if(t)for(var r in t){var e=t[r].length;e>65535&&I(9),n+=e+4}return n},hn=function(t,n,r,e,i,o,s,a){var u=e.length,h=r.extra,f=a&&a.length,l=un(h);ct(t,n,null!=s?33639248:67324752),n+=4,null!=s&&(t[n++]=20,t[n++]=r.os),t[n]=20,n+=2,t[n++]=r.flag<<1|(o<0&&8),t[n++]=i&&8,t[n++]=255&r.compression,t[n++]=r.compression>>8;var c=new Date(null==r.mtime?Date.now():r.mtime),p=c.getFullYear()-1980;if((p<0||p>119)&&I(10),ct(t,n,p<<25|c.getMonth()+1<<21|c.getDate()<<16|c.getHours()<<11|c.getMinutes()<<5|c.getSeconds()>>1),n+=4,-1!=o&&(ct(t,n,r.crc),ct(t,n+4,o<0?-o-2:o),ct(t,n+8,r.size)),ct(t,n+12,u),ct(t,n+14,l),n+=16,null!=s&&(ct(t,n,f),ct(t,n+6,r.attrs),ct(t,n+10,s),n+=14),t.set(e,n),n+=u,l)for(var v in h){var d=h[v],g=d.length;ct(t,n,+v),ct(t,n+2,g),t.set(d,n+4),n+=4+g}return f&&(t.set(a,n),n+=f),n},fn=function(t,n,r,e,i){ct(t,n,101010256),ct(t,n+8,r),ct(t,n+10,r),ct(t,n+12,e),ct(t,n+16,i)},ln=function(){function t(t){this.filename=t,this.c=Y(),this.size=0,this.compression=0}return t.prototype.process=function(t,n){this.ondata(null,t,n)},t.prototype.push=function(t,n){this.ondata||I(5),this.c.p(t),this.size+=t.length,n&&(this.crc=this.c.d()),this.process(t,n||!1)},t}();_e.ZipPassThrough=ln;var cn=function(){function t(t,n){var r=this;n||(n={}),ln.call(this,t),this.d=new wt(n,(function(t,n){r.ondata(null,t,n)})),this.compression=8,this.flag=en(n.level)}return t.prototype.process=function(t,n){try{this.d.push(t,n)}catch(t){this.ondata(t,null,n)}},t.prototype.push=function(t,n){ln.prototype.push.call(this,t,n)},t}();_e.ZipDeflate=cn;var pn=function(){function t(t,n){var r=this;n||(n={}),ln.call(this,t),this.d=new xt(n,(function(t,n,e){r.ondata(t,n,e)})),this.compression=8,this.flag=en(n.level),this.terminate=this.d.terminate}return t.prototype.process=function(t,n){this.d.push(t,n)},t.prototype.push=function(t,n){ln.prototype.push.call(this,t,n)},t}();_e.AsyncZipDeflate=pn;var vn=function(){function t(t){this.ondata=t,this.u=[],this.d=1}return t.prototype.add=function(t){var r=this;if(this.ondata||I(5),2&this.d)this.ondata(I(4+8*(1&this.d),0,1),null,!1);else{var e=nn(t.filename),i=e.length,o=t.comment,s=o&&nn(o),a=i!=t.filename.length||s&&o.length!=s.length,u=i+un(t.extra)+30;i>65535&&this.ondata(I(11,0,1),null,!1);var h=new n(u);hn(h,0,t,e,a,-1);var f=[h],l=function(){for(var t=0,n=f;t<n.length;t++)r.ondata(null,n[t],!1);f=[]},c=this.d;this.d=0;var p=this.u.length,v=Q(t,{f:e,u:a,o:s,t:function(){t.terminate&&t.terminate()},r:function(){if(l(),c){var t=r.u[p+1];t?t.r():r.d=1}c=1}}),d=0;t.ondata=function(e,i,o){if(e)r.ondata(e,i,o),r.terminate();else if(d+=i.length,f.push(i),o){var s=new n(16);ct(s,0,134695760),ct(s,4,t.crc),ct(s,8,d),ct(s,12,t.size),f.push(s),v.c=d,v.b=u+d+16,v.crc=t.crc,v.size=t.size,c&&v.r(),c=1}else c&&l()},this.u.push(v)}},t.prototype.end=function(){var t=this;2&this.d?this.ondata(I(4+8*(1&this.d),0,1),null,!0):(this.d?this.e():this.u.push({r:function(){1&t.d&&(t.u.splice(-1,1),t.e())},t:function(){}}),this.d=3)},t.prototype.e=function(){for(var t=0,r=0,e=0,i=0,o=this.u;i<o.length;i++)e+=46+(h=o[i]).f.length+un(h.extra)+(h.o?h.o.length:0);for(var s=new n(e+22),a=0,u=this.u;a<u.length;a++){var h;hn(s,t,h=u[a],h.f,h.u,-h.c-2,r,h.o),t+=46+h.f.length+un(h.extra)+(h.o?h.o.length:0),r+=h.b}fn(s,t,this.u.length,e,r),this.ondata(null,s,!0),this.d=2},t.prototype.terminate=function(){for(var t=0,n=this.u;t<n.length;t++)n[t].t();this.d=2},t}();function dn(t,r,e){e||(e=r,r={}),"function"!=typeof e&&I(7);var i={};Rt(t,"",i,r);var o=Object.keys(i),s=o.length,a=0,u=0,h=s,f=Array(s),l=[],c=function(){for(var t=0;t<l.length;++t)l[t]()},p=function(t,n){xn((function(){e(t,n)}))};xn((function(){p=e}));var v=function(){var t=new n(u+22),r=a,e=u-a;u=0;for(var i=0;i<h;++i){var o=f[i];try{var s=o.c.length;hn(t,u,o,o.f,o.u,s);var l=30+o.f.length+un(o.extra),c=u+l;t.set(o.c,c),hn(t,a,o,o.f,o.u,s,u,o.m),a+=16+l+(o.m?o.m.length:0),u=c+s}catch(t){return p(t,null)}}fn(t,a,f.length,e,r),p(null,t)};s||v();for(var d=function(t){var n=o[t],r=i[n],e=r[0],h=r[1],d=Y(),g=e.length;d.p(e);var y=nn(n),m=y.length,b=h.comment,w=b&&nn(b),x=w&&w.length,z=un(h.extra),k=0==h.level?0:8,M=function(r,e){if(r)c(),p(r,null);else{var i=e.length;f[t]=Q(h,{size:g,crc:d.d(),c:e,f:y,m:w,u:m!=n.length||w&&b.length!=x,compression:k}),a+=30+m+z+i,u+=76+2*(m+z)+(x||0)+i,--s||v()}};if(m>65535&&M(I(11,0,1),null),k)if(g<16e4)try{M(null,kt(e,h))}catch(t){M(t,null)}else l.push(zt(e,h,M));else M(null,e)},g=0;g<h;++g)d(g);return c}function gn(t,r){r||(r={});var e={},i=[];Rt(t,"",e,r);var o=0,s=0;for(var a in e){var u=e[a],h=u[0],f=u[1],l=0==f.level?0:8,c=(M=nn(a)).length,p=f.comment,v=p&&nn(p),d=v&&v.length,g=un(f.extra);c>65535&&I(11);var y=l?kt(h,f):h,m=y.length,b=Y();b.p(h),i.push(Q(f,{size:h.length,crc:b.d(),c:y,f:M,m:v,u:c!=a.length||v&&p.length!=d,o:o,compression:l})),o+=30+c+g+m,s+=76+2*(c+g)+(d||0)+m}for(var w=new n(s+22),x=o,z=s-o,k=0;k<i.length;++k){var M;hn(w,(M=i[k]).o,M,M.f,M.u,M.c.length);var S=30+M.f.length+un(M.extra);w.set(M.c,M.o+S),hn(w,o,M,M.f,M.u,M.c.length,M.o,M.m),o+=16+S+(M.m?M.m.length:0)}return fn(w,o,i.length,z,x),w}_e.Zip=vn,_e.zip=dn,_e.zipSync=gn;var yn=function(){function t(){}return t.prototype.push=function(t,n){this.ondata(null,t,n)},t.compression=0,t}();_e.UnzipPassThrough=yn;var mn=function(){function t(){var t=this;this.i=new Mt((function(n,r){t.ondata(null,n,r)}))}return t.prototype.push=function(t,n){try{this.i.push(t,n)}catch(t){this.ondata(t,null,n)}},t.compression=8,t}();_e.UnzipInflate=mn;var bn=function(){function t(t,n){var r=this;n<32e4?this.i=new Mt((function(t,n){r.ondata(null,t,n)})):(this.i=new St((function(t,n,e){r.ondata(t,n,e)})),this.terminate=this.i.terminate)}return t.prototype.push=function(t,n){this.i.terminate&&(t=D(t,0)),this.i.push(t,n)},t.compression=8,t}();_e.AsyncUnzipInflate=bn;var wn=function(){function t(t){this.onfile=t,this.k=[],this.o={0:yn},this.p=N}return t.prototype.push=function(t,r){var e=this;if(this.onfile||I(5),this.p||I(4),this.c>0){var i=Math.min(this.c,t.length),o=t.subarray(0,i);if(this.c-=i,this.d?this.d.push(o,!this.c):this.k[0].push(o),(t=t.subarray(i)).length)return this.push(t,r)}else{var s=0,a=0,u=void 0,h=void 0;this.p.length?t.length?((h=new n(this.p.length+t.length)).set(this.p),h.set(t,this.p.length)):h=this.p:h=t;for(var f=h.length,l=this.c,c=l&&this.d,p=function(){var t,n=ft(h,a);if(67324752==n){s=1,u=a,v.d=null,v.c=0;var r=ht(h,a+6),i=ht(h,a+8),o=2048&r,c=8&r,p=ht(h,a+26),d=ht(h,a+28);if(f>a+30+p+d){var g=[];v.k.unshift(g),s=2;var y,m=ft(h,a+18),b=ft(h,a+22),w=rn(h.subarray(a+30,a+=30+p),!o);4294967295==m?(t=c?[-2]:an(h,a),m=t[0],b=t[1]):c&&(m=-1),a+=d,v.c=m;var x={name:w,compression:i,start:function(){if(x.ondata||I(5),m){var t=e.o[i];t||x.ondata(I(14,"unknown compression type "+i,1),null,!1),(y=m<0?new t(w):new t(w,m,b)).ondata=function(t,n,r){x.ondata(t,n,r)};for(var n=0,r=g;n<r.length;n++)y.push(r[n],!1);e.k[0]==g&&e.c?e.d=y:y.push(N,!0)}else x.ondata(null,N,!0)},terminate:function(){y&&y.terminate&&y.terminate()}};m>=0&&(x.size=m,x.originalSize=b),v.onfile(x)}return"break"}if(l){if(134695760==n)return u=a+=12+(-2==l&&8),s=3,v.c=0,"break";if(33639248==n)return u=a-=4,s=3,v.c=0,"break"}},v=this;a<f-4&&"break"!==p();++a);if(this.p=N,l<0){var d=h.subarray(0,s?u-12-(-2==l&&8)-(134695760==ft(h,u-16)&&4):a);c?c.push(d,!!s):this.k[+(2==s)].push(d)}if(2&s)return this.push(h.subarray(a),r);this.p=h.subarray(a)}r&&(this.c&&I(13),this.p=null)},t.prototype.register=function(t){this.o[t.compression]=t},t}();_e.Unzip=wn;var xn="function"==typeof queueMicrotask?queueMicrotask:"function"==typeof setTimeout?setTimeout:function(t){t()};function zn(t,r,e){e||(e=r,r={}),"function"!=typeof e&&I(7);var i=[],o=function(){for(var t=0;t<i.length;++t)i[t]()},s={},a=function(t,n){xn((function(){e(t,n)}))};xn((function(){a=e}));for(var u=t.length-22;101010256!=ft(t,u);--u)if(!u||t.length-u>65558)return a(I(13,0,1),null),o;var h=ht(t,u+8);if(h){var f=h,l=ft(t,u+16),c=4294967295==l||65535==f;if(c){var p=ft(t,u-12);(c=101075792==ft(t,p))&&(f=h=ft(t,p+32),l=ft(t,p+48))}for(var v=r&&r.filter,d=function(r){var e=sn(t,l,c),u=e[0],f=e[1],p=e[2],d=e[3],g=e[4],y=on(t,e[5]);l=g;var m=function(t,n){t?(o(),a(t,null)):(n&&(s[d]=n),--h||a(null,s))};if(!v||v({name:d,size:f,originalSize:p,compression:u}))if(u)if(8==u){var b=t.subarray(y,y+f);if(p<524288||f>.8*p)try{m(null,Tt(b,{out:new n(p)}))}catch(t){m(t,null)}else i.push(At(b,{size:p},m))}else m(I(14,"unknown compression type "+u,1),null);else m(null,D(t,y,y+f));else m(null,null)},g=0;g<f;++g)d()}else a(null,{});return o}function kn(t,r){for(var e={},i=t.length-22;101010256!=ft(t,i);--i)(!i||t.length-i>65558)&&I(13);var o=ht(t,i+8);if(!o)return{};var s=ft(t,i+16),a=4294967295==s||65535==o;if(a){var u=ft(t,i-12);(a=101075792==ft(t,u))&&(o=ft(t,u+32),s=ft(t,u+48))}for(var h=r&&r.filter,f=0;f<o;++f){var l=sn(t,s,a),c=l[0],p=l[1],v=l[2],d=l[3],g=l[4],y=on(t,l[5]);s=g,h&&!h({name:d,size:p,originalSize:v,compression:c})||(c?8==c?e[d]=Tt(t.subarray(y,y+p),{out:new n(v)}):I(14,"unknown compression type "+c):e[d]=D(t,y,y+p))}return e}_e.unzip=zn,_e.unzipSync=kn;return _e});

/* helpers.js */
/*
    lists — central registry for events and cached instances.
    Declared here in helpers.js because it runs first in the concatenation order,
    before Store, Layout, or any constructor that needs to read/write it.
*/
var lists = {
    registeredEvents: [],
    eventHandlers: {},
    keyEventHandlers: {},
    loadedLayoutNames: [],
    routedThroughLayouts: { "FileType": "fileTypes", "Search": "searches", "Brand": "brands" },
    driveTypes: {},
    instances: {
        stores: {},
        layouts: {},
        fileTypes: {},
        searches: {},
        apps: {},
        brands: {},
        drives: {}
    }
};

// ── user-facing globals (kept accessible in sandbox) ─────────────────

// universal iterator, compatible with forEach. works on objects and arrays
function each(ob, fun) {
    if (ob === null || typeof ob !== "object") throw new Error("not an object for .each()");
    if (Array.isArray(ob)) {
        for (let i = 0; i < ob.length; i++) {
            fun(ob[i], i);
        }
    } else {
        for (let k of Object.keys(ob)) {
            fun(ob[k], k);
        }
    }
    return ob;
}

function toJson(jsObj) {
    var replacer = function (_key, value) {
        if (typeof value === 'function') {
            return '@function:' + value.toString();
        }
        return value;
    };
    // JSON.stringify may not invoke the replacer for a top-level function value
    return JSON.stringify(replacer('', jsObj), replacer, 4);
}

function fromJson(jsonString) {
    return JSON.parse(jsonString, function (key, value) {
        if (typeof value === 'string') {
            if (value.startsWith('/Function(') && value.endsWith(')/')) {
                value = value.substring(10, value.length - 2);
                return eval('(' + value + ')');
            }
            if (value.startsWith('@function:')) {
                value = value.substring(10, value.length);
                return eval('(' + value + ')');
            }
            if (value.startsWith('@import:')) { }
        }
        return value;
    });
}

// random between
function rand(min, max) {
    if (!min) min = 1;
    if (!max) max = 10000000;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// ── easing functions ── t is 0..1, returns 0..1
var ease = {
    linear: function (t) { return t; },
    inQuad: function (t) { return t * t; },
    outQuad: function (t) { return t * (2 - t); },
    inOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    inCubic: function (t) { return t * t * t; },
    outCubic: function (t) { var t1 = t - 1; return t1 * t1 * t1 + 1; },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    inExpo: function (t) { return t === 0 ? 0 : Math.pow(2, 10 * (t - 1)); },
    outExpo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    inOutExpo: function (t) { if (t === 0 || t === 1) return t; return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2; },
    inBack: function (t) { var s = 1.70158; return t * t * ((s + 1) * t - s); },
    outBack: function (t) { var s = 1.70158; var t1 = t - 1; return t1 * t1 * ((s + 1) * t1 + s) + 1; },
    inOutBack: function (t) { var s = 1.70158 * 1.525; if (t < 0.5) { return (2 * t) * (2 * t) * ((s + 1) * 2 * t - s) / 2; } var t1 = 2 * t - 2; return (t1 * t1 * ((s + 1) * t1 + s) + 2) / 2; },
    outElastic: function (t) { if (t === 0 || t === 1) return t; return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1; },
    inElastic: function (t) { if (t === 0 || t === 1) return t; return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.075) * (2 * Math.PI) / 0.3); },
    outBounce: function (t) { if (t < 1 / 2.75) return 7.5625 * t * t; if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; } if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; } t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375; },
    inBounce: function (t) { return 1 - ease.outBounce(1 - t); }
};

// ── internal helpers (hideable in sandbox) ───────────────────────────

var helpers = {

    invalidateCollection: function (layoutName, collection) {
        var prefix = layoutName + ".";
        for (var k in lists.instances[collection]) {
            if (k.indexOf(prefix) === 0) delete lists.instances[collection][k];
        }
    },

    // registers event names as valid. warp.on() will throw if an unregistered name is used.
    registerEvents: function (names) {
        names.forEach(function (name) {
            if (lists.registeredEvents.includes(name)) throw new Error("registerEvents: event '" + name + "' is already registered");
            lists.registeredEvents.push(name);
        });
    },

    /*
        Sets up the "warp way" async interface for a constructor.
        After this call the constructor is reachable four ways (e.g. for FileType):
            new FileType({...})         — direct, inside engine scope
            new warp.FileType({...})    — direct, outside engine scope
            await warp.fileType({...})  — async create/retrieve, outside
            await fileType({...})       — async create/retrieve, inside

        Layout is auto-detected (uses "layouts" store).
        Layout-owned types (listed in lists.routedThroughLayouts) have no separate store —
        their data lives in layoutJSON, persisted via the "layouts" store.
          - CREATE: requires a layout key, routes to layout[method](data).
          - RETRIEVE: targeted lookup per layout in lists.loadedLayoutNames, last match wins.

        Store uses lists.instances.stores for dedup.
    */
    setupAsyncInterfaces: function (Constructor) {
        var storeName = (Constructor.name === "Layout") ? "layouts" : null;
        warp[Constructor.name] = Constructor;

        var methodName = Constructor.name.toLowerCase();
        if (methodName === "filetype") methodName = "fileType";

        warp[methodName] = async function (nameOrJSON) {

            // RETRIEVE — string key
            if (typeof nameOrJSON === "string") {
                if (Constructor.name === "Store") return lists.instances.stores[nameOrJSON];

                // Layout — check cache, then store
                if (storeName) {
                    if (lists.instances.layouts[nameOrJSON]) return lists.instances.layouts[nameOrJSON];
                    var s = lists.instances.stores[storeName];
                    if (!s) return undefined;
                    var data = await s.get(nameOrJSON);
                    if (!data) return undefined;
                    var instance = new Constructor(data);
                    if (instance._ready) await instance._ready;
                    lists.instances.layouts[nameOrJSON] = instance;
                    return instance;
                }

                // Layout-owned types — check cache, then store
                if (Constructor.name in lists.routedThroughLayouts) {
                    var prop = lists.routedThroughLayouts[Constructor.name];
                    var layoutStore = lists.instances.stores["layouts"];
                    if (!layoutStore) return undefined;
                    var dotIdx = nameOrJSON.indexOf(".");
                    if (dotIdx !== -1) {
                        var cacheKey = nameOrJSON.substring(0, dotIdx) + "." + nameOrJSON.substring(dotIdx + 1);
                        if (lists.instances[prop][cacheKey]) return lists.instances[prop][cacheKey];
                        var data = await layoutStore.get(nameOrJSON.substring(0, dotIdx) + "." + prop + "." + nameOrJSON.substring(dotIdx + 1));
                        if (data === undefined) return undefined;
                        var instance = new Constructor(data);
                        lists.instances[prop][cacheKey] = instance;
                        return instance;
                    }
                    var result;
                    for (var i = 0; i < lists.loadedLayoutNames.length; i++) {
                        var cacheKey = lists.loadedLayoutNames[i] + "." + nameOrJSON;
                        if (lists.instances[prop][cacheKey]) { result = lists.instances[prop][cacheKey]; continue; }
                        var val = await layoutStore.get(lists.loadedLayoutNames[i] + "." + prop + "." + nameOrJSON);
                        if (val !== undefined) {
                            result = new Constructor(val);
                            lists.instances[prop][cacheKey] = result;
                        }
                    }
                    return result;
                }

                return undefined;
            }

            // CREATE with layout key — route to that layout's own method
            // e.g. warp.fileType({ name:"json", mime:"...", layout: "myLayout" })
            //      → await warp.layout("myLayout").fileType({ name:"json", mime:"..." })
            if (nameOrJSON && nameOrJSON.layout !== undefined) {
                var layoutRef = nameOrJSON.layout;
                var layout = typeof layoutRef === "string" ? await warp.layout(layoutRef) : layoutRef;
                if (!layout) throw new Error("warp." + methodName + ": layout '" + layoutRef + "' not found");
                var data = Object.assign({}, nameOrJSON);
                delete data.layout;
                return layout[methodName](data);
            }

            // Layout-owned types must go through a layout
            if (Constructor.name in lists.routedThroughLayouts) {
                throw new Error("warp." + methodName + "() requires a 'layout' property when passing an object");
            }

            // Direct CREATE — Layout, Sandbox, Store
            var instance = new Constructor(nameOrJSON);
            if (instance._ready) await instance._ready;
            if (storeName) lists.instances.layouts[nameOrJSON.name || instance.json().name] = instance;
            return instance;
        };

        return warp[methodName];
    },

    getFileTypeForFile: function (file) {
        var name = file.name || "";
        var dot = name.lastIndexOf(".");
        if (dot === -1 || dot === name.length - 1) return warp.fileType("unknown");
        return warp.fileType(name.substring(dot + 1));
    },

    /*
        called on begining construction of new instance, finds apropriate JSON for this constructor based on Name + JSON,
        changes options provided by user, to instance of NameJSON options, adds serialization automaticaly to
        Constructor if it finds variable with name ConstructorNameJSON
    */
    setupOptionsAndInstance: function (providedObject, defaultOptions) {
        //did we recieve for options an instance of a constructor with name or just a generic Object?
        var instance = defaultOptions.constructor.name !== "Object";
        /* if we did lets try to find does Name+JSON variable exist in warp's scope to
           use as default options for creation, and also for output serialization
         */
        if (instance) {
            instance = defaultOptions;
            var optionsJSON = instance.constructor.name + "JSON";
            defaultOptions = eval(optionsJSON);
            if (defaultOptions === undefined) {
                throw new Error("'" + optionsJSON + "' is not defined for constructor : '" + instance.constructor.name + "'");
            }
            helpers.fakeConstructor(optionsJSON, defaultOptions);
        }
        var options = fromJson(toJson(defaultOptions));
        if (providedObject !== undefined) {
            Object.keys(providedObject).forEach(function (key) {
                if (!(key in options)) {
                    throw new Error("Option key '" + key + "' is not a part of " + defaultOptions.constructor.name);
                }
                options[key] = providedObject[key];
            });
        }
        if (instance) {
            //also fake constructor on returning options and on serialization;
            helpers.fakeConstructor(instance.constructor.name + "JSON", options);
            // expose options properties directly on the instance via getters/setters
            // so ft.name, ft.commit etc. work alongside ft.json().name
            for (var _k in options) {
                (function (key) {
                    Object.defineProperty(instance, key, {
                        get: function () { return options[key]; },
                        set: function (v) { options[key] = v; },
                        enumerable: true,
                        configurable: true
                    });
                })(_k);
            }
        }
        return options;
    },

    // Helper function to fake constructor of an object.
    // NOTE: this changes obj.constructor away from Object. Any code that checks
    // value.constructor === Object to identify plain objects (e.g. encodeForStore in Store.js)
    // will not recognise the result as a plain object. encodeForStore uses typeof instead to handle this.
    fakeConstructor: function (name, obj) {
        // Create a real function with the correct name
        var FakeConstructor = (new Function("return function " + name + "(){}"))();
        // Assign prototype
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(obj, FakeConstructor.prototype);
        } else {
            obj.__proto__ = FakeConstructor.prototype;
        }
        // Set constructor (non-enumerable, correct behavior)
        Object.defineProperty(obj, "constructor", {
            value: FakeConstructor,
            writable: true,
            configurable: true,
            enumerable: false
        });
        return obj;
    },

    // returns an empty string for false, undefined, null, "0", "false" ...useful for outputing to gui
    empty: function (s) {
        if (s == '0' || s == 'false') return '';
        if (!Boolean(s)) return '';
        return s;
    },

    // extends object with another, into a new one, even if first is null/undefined
    extend: function (ob, ob2, evenIfFalse) {
        if (!ob && evenIfFalse) ob = {};
        if (!ob2 && evenIfFalse) ob2 = {};
        if (ob === null || typeof ob !== "object") ob = {};
        if (ob2 === null || typeof ob2 !== "object") ob2 = {};
        var out = {};
        for (var k in ob) {
            if (ob.hasOwnProperty(k)) {
                out[k] = ob[k];
            }
        }
        for (var j in ob2) {
            if (ob2.hasOwnProperty(j)) {
                out[j] = ob2[j];
            }
        }
        return out;
    },

    // makes a safe name from any string (input) - removes spaces, camelCases, capitalises first letter
    safeName: function (n) {
        if (!n) throw new Error('safe name cant be nothing');
        if (typeof n !== "string") throw new Error('safe name must be a string');
        n = n.trim();
        if (!n) throw new Error('safe name cant be empty string');
        var parts = n.split(/[^a-zA-Z0-9]+/).filter(Boolean);
        if (parts.length === 0) throw new Error('invalid name format');
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            if (!p) continue;
            if (!/^[a-zA-Z]/.test(p)) throw new Error('camel case failed');
            parts[i] = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        }
        return parts.join('');
    },

    // Object to string for logging and editing
    objToStr: function (obj) {
        let ret = '{';
        for (let k in obj) {
            let v = obj[k];
            if (typeof v === 'function') {
                v = v.toString();
            } else if (v instanceof Array) {
                v = toJson(v, null, 4);
            } else if (typeof v === 'object') {
                v = helpers.objToStr(v);
            } else {
                v = `"${v}"`;
            }
            ret += `\n  ${k}: ${v},`;
        }
        ret += '\n}';
        return ret;
    },

    // setting an object property with dot notation.
    dottApi: function (root, path, value) {
        if (typeof path !== "string") throw new Error("path must be string");
        const tokens = [];
        path.replace(/\[(.*?)\]|[^.\[\]]+/g, (m, inner) => {
            if (inner !== undefined) {
                if (/^\d+$/.test(inner)) {
                    tokens.push({ key: Number(inner), isIndex: true });
                } else {
                    tokens.push({ key: inner.replace(/^["']|["']$/g, ""), isIndex: false });
                }
            } else {
                tokens.push({ key: m, isIndex: false });
            }
        });
        let curr = root;
        // SETTER
        if (arguments.length === 3) {
            for (let i = 0; i < tokens.length - 1; i++) {
                const t = tokens[i];
                const next = tokens[i + 1];
                if (curr[t.key] === undefined) {
                    curr[t.key] = next.isIndex ? [] : {};
                }
                curr = curr[t.key];
                if (curr === null || typeof curr !== "object") throw new Error(`'${t.key}' is not an object`);
            }
            const last = tokens[tokens.length - 1];
            curr[last.key] = value;
            return value;
        }
        // GETTER
        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];
            if (curr == null || !(t.key in curr)) {
                if (i === 0) throw new Error(`'${t.key}' does not exist`);
                if (i < tokens.length - 1) throw new Error(`'${t.key}' does not exist`);
                return undefined;
            }
            curr = curr[t.key];
        }
        return curr;
    },

    // setting/getting an object property with path string notation.
    slashApi: function (root, path, value) {
        if (typeof path !== "string") throw new Error("path must be a string");
        const parts = path.split("/").filter(Boolean);
        let curr = root;
        // SETTER
        if (arguments.length === 3) {
            for (let i = 0; i < parts.length - 1; i++) {
                const p = parts[i];
                if (curr[p] === undefined) {
                    curr[p] = {};
                } else if (typeof curr[p] !== "object" || curr[p] === null) {
                    throw new Error(`'${p}' is not an object`);
                }
                curr = curr[p];
            }
            const last = parts[parts.length - 1];
            curr[last] = value;
            return value;
        }
        // GETTER
        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            if (!(p in curr)) {
                if (i === 0) throw new Error(`'${p}' does not exist`);
                if (i < parts.length - 1) throw new Error(`'${p}' does not exist`);
                return undefined;
            }
            curr = curr[p];
        }
        return curr;
    },

    // escapes special html characters in names
    escapeHTML: function (text) {
        return text.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
    },

    // format bytes as human readable text
    formatBytes: function (bytes) {
        let decimals = 2;
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },

    // converts array of functions to UMD compatible string that can be imported to a worker
    exportFunctions: function (fns) {
        function renderExportFooter(names) {
            return (
                `/* export footer */
if (typeof window !== "undefined" && window) {
${names.map(n => `    window.${n} = ${n};`).join("\n")}
}

export { ${names.join(", ")} };`
            );
        }

        const names = fns.map(fn => fn.name);
        const bodies = fns.map(fn => fn.toString()).join("\n\n");

        return bodies + "\n\n" + renderExportFooter(names);
    }

};

// two way helper functions
this.do = this.to = {
    'loadJS': function (url) {
        return new Promise((resolve, reject) => {
            var container = warp.gui.el;
            var existing = container.querySelector('script[src="' + url + '"]');
            if (existing) { resolve(true); return; }
            var scrEl = document.createElement('script');
            scrEl.src = url;
            scrEl.async = true;
            scrEl.addEventListener('load', function () { resolve(true); });
            scrEl.addEventListener('error', function (e) { reject(e); });
            container.appendChild(scrEl);
        });
    },
    'tween': function (obj, opts) {
        // ── stagger: array of elements ──
        if (Array.isArray(obj)) {
            var stagger = (opts.stagger !== undefined ? opts.stagger : 0);
            var tweenFn = warp.to.tween;
            var subs = [];
            var timers = [];
            var cancelled = false;

            var promise = new Promise(function (resolve) {
                var done = 0;
                var total = obj.length;
                if (total === 0) return resolve([]);

                for (var si = 0; si < total; si++) {
                    (function (idx) {
                        var tid = setTimeout(function () {
                            if (cancelled) return;
                            var itemOpts = {};
                            for (var k in opts) if (opts.hasOwnProperty(k) && k !== 'stagger') itemOpts[k] = opts[k];
                            var sub = tweenFn(obj[idx], itemOpts);
                            subs.push(sub);
                            sub.then(function () { if (++done >= total) resolve(obj); });
                        }, idx * stagger);
                        timers.push(tid);
                    })(si);
                }
            });
            promise.cancel = function () {
                cancelled = true;
                timers.forEach(function (tid) { clearTimeout(tid); });
                subs.forEach(function (s) { if (s.cancel) s.cancel(); });
                timers = subs = [];
            };
            return promise;
        }

        // ── single element tween ──
        var duration = (opts.duration !== undefined ? opts.duration : 0.3) * 1000;
        var easeFn = typeof opts.ease === 'function' ? opts.ease : (ease[opts.ease] || ease.outQuad);
        var onUpdate = opts.onUpdate || null;
        var onComplete = opts.onComplete || null;

        var isEl = obj instanceof Element;

        var skip = { duration: 1, ease: 1, onUpdate: 1, onComplete: 1, stagger: 1 };
        var props = [];
        for (var k in opts) {
            if (skip[k] || !opts.hasOwnProperty(k)) continue;
            var fromVal;
            if (isEl) {
                if (k === 'x' || k === 'y') {
                    var stored = obj.dataset['_tw' + k];
                    if (stored !== undefined) {
                        fromVal = parseFloat(stored);
                    } else {
                        var m = new DOMMatrix(getComputedStyle(obj).transform);
                        fromVal = k === 'x' ? m.e : m.f;
                    }
                }
                else if (k === 'opacity') fromVal = parseFloat(obj.style.opacity === '' ? 1 : obj.style.opacity);
                else fromVal = parseFloat(obj.style[k]) || 0;
            } else {
                fromVal = obj[k];
            }
            props.push({ key: k, from: fromVal, to: opts[k] });
        }

        var hasXY = false;
        if (isEl) {
            for (var i = 0; i < props.length; i++) {
                if (props[i].key === 'x' || props[i].key === 'y') { hasXY = true; break; }
            }
        }

        var start = null;
        var id;
        var _resolve;
        var promise = new Promise(function (resolve) { _resolve = resolve; });
        promise.cancel = function () {
            cancelAnimationFrame(id);
            // clean dataset residue
            if (isEl && hasXY) { delete obj.dataset._twx; delete obj.dataset._twy; }
            _resolve(false);
        };

        function step(ts) {
            if (start === null) start = ts;
            var elapsed = ts - start;
            var t = duration <= 0 ? 1 : Math.min(elapsed / duration, 1);
            var e = easeFn(t);

            var tx, ty;
            if (isEl && hasXY) {
                var m = new DOMMatrix(getComputedStyle(obj).transform);
                tx = obj.dataset._twx !== undefined ? parseFloat(obj.dataset._twx) : m.e;
                ty = obj.dataset._twy !== undefined ? parseFloat(obj.dataset._twy) : m.f;
            }

            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                var v = p.from + (p.to - p.from) * e;

                if (isEl) {
                    if (p.key === 'x') { tx = v; obj.dataset._twx = v; }
                    else if (p.key === 'y') { ty = v; obj.dataset._twy = v; }
                    else if (p.key === 'opacity') obj.style.opacity = v;
                    else obj.style[p.key] = v;
                } else {
                    obj[p.key] = v;
                }
            }

            if (isEl && hasXY) obj.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';

            if (onUpdate) onUpdate(obj, t);

            if (t < 1) {
                id = requestAnimationFrame(step);
            } else {
                // clean dataset residue
                if (isEl && hasXY) { delete obj.dataset._twx; delete obj.dataset._twy; }
                if (onComplete) onComplete(obj);
                onUpdate = onComplete = easeFn = null;
                _resolve(obj);
            }
        }

        id = requestAnimationFrame(step);
        return promise;
    },
    'json': toJson,
    'zip': async function (files) {
        // files: { "path/name.txt": Uint8Array | Blob | warp.File, ... }
        // path strings with slashes become folders inside the zip
        var entries = {};
        await Promise.all(Object.keys(files).map(async function (path) {
            var val = files[path];
            if (val instanceof Uint8Array) {
                entries[path] = val;
            } else if (val && typeof val.arrayBuffer === "function") {
                var buf = await val.arrayBuffer();
                entries[path] = new Uint8Array(buf);
            } else {
                entries[path] = val;
            }
        }));
        return new Promise(function (resolve, reject) {
            fflate.zip(entries, function (err, data) {
                if (err) return reject(err);
                resolve(new Blob([data], { type: "application/zip" }));
            });
        });
    }
}
this.un = this.from = {
    'loadJS': function (url) {
        return new Promise((resolve) => {
            Array.from(document.querySelectorAll('script[src="' + url + '"]')).forEach(function (s) {
                s.parentNode.removeChild(s);
                warp.log(url + ' removed', 0, 'un.loadJS');
            });
            resolve(true);
        });
    },
    'tween': function (obj, opts) {
        // swap: snap obj to opts values, then tween back to original
        var skip = { duration: 1, ease: 1, onUpdate: 1, onComplete: 1, stagger: 1 };
        var tweenOpts = { duration: opts.duration, ease: opts.ease, onUpdate: opts.onUpdate, onComplete: opts.onComplete };
        var isEl = obj instanceof Element;
        for (var k in opts) {
            if (skip[k] || !opts.hasOwnProperty(k)) continue;
            var curVal;
            if (isEl) {
                if (k === 'x' || k === 'y') {
                    var stored = obj.dataset['_tw' + k];
                    if (stored !== undefined) {
                        curVal = parseFloat(stored);
                    } else {
                        var m = new DOMMatrix(getComputedStyle(obj).transform);
                        curVal = k === 'x' ? m.e : m.f;
                    }
                }
                else if (k === 'opacity') curVal = parseFloat(obj.style.opacity === '' ? 1 : obj.style.opacity);
                else curVal = parseFloat(obj.style[k]) || 0;
            } else {
                curVal = obj[k];
            }
            tweenOpts[k] = curVal;  // target is the current value
            if (isEl) {
                if (k === 'x' || k === 'y') obj.dataset['_tw' + k] = opts[k];
                else if (k === 'opacity') obj.style.opacity = opts[k];
                else obj.style[k] = opts[k];
            } else {
                obj[k] = opts[k];   // snap to the "from" value
            }
        }
        return warp.to.tween(obj, tweenOpts);
    },
    'json': fromJson,
    'zip': async function (file) {
        // accept native Blob/File or warp.File
        // if warp.File: use .data if it's a Blob, else the file is not loaded — return null
        var blob = (file instanceof warp.File) ? file.data : file;
        if (!(blob instanceof Blob)) return null;
        var buffer = await blob.arrayBuffer();
        return new Promise(function (resolve, reject) {
            fflate.unzip(new Uint8Array(buffer), function (err, files) {
                if (err) return reject(err);
                each(files, function (uint8, path) {

                    files[path] = new warp.File([uint8], path, { mime: "application/octet-stream" });

                })
                resolve(files); // { "path/file.txt": Uint8Array, ... }
            });
        });
    }
}


/* Dom.js */
function Dom() {
    //take the reference because later its not going to accesible (window and document should be accesible inside warp)
    var doc = document;
    // list of common events
    var events = [
        "click", "dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave",
        "mousemove", "mouseover", "mouseout", "keydown", "keyup", "keypress",
        "change", "input", "submit", "focus", "blur", "contextmenu"
    ];

    this.node = function (nameOrObj, attrsAndEvents) {
        var el, attrs;

        if (typeof nameOrObj === "object" && nameOrObj !== null) {
            // single object mode
            if (!nameOrObj.node) {
                throw new Error("Missing 'node' property specifying the tag name");
            }
            el = doc.createElement(nameOrObj.node);
            attrs = nameOrObj;
        } else {
            // normal two-parameter mode
            el = doc.createElement(nameOrObj);
            attrs = attrsAndEvents || {};
        }

        
        for (var key in attrs) {
            if (!attrs.hasOwnProperty(key)) continue;
            if (key === "node" || key === "children") continue; // skip node and children

            var value = attrs[key];

            if (key === "text") {
                el.textContent = value;
            } else if (key === "html") {
                el.innerHTML = value;
            } else if (events.indexOf(key) !== -1) {
                el.addEventListener(key, value);
            } else {
                el.setAttribute(key, value);
            }
        }

        // recursively create children if present
        if (attrs.children && Object.prototype.toString.call(attrs.children) === "[object Array]") {
            for (var i = 0; i < attrs.children.length; i++) {
                var childOpts = attrs.children[i];
                var childEl = this.node(childOpts); // recursive call
                el.appendChild(childEl);
            }
        }

        return el;
    };

    this.on = function (el, event, fn) {
        if (typeof el === "string") el = warp.gui.el.querySelector(el);
        el.addEventListener(event, fn);
    };

    this.off = function (el, event, fn) {
        if (typeof el === "string") el = warp.gui.el.querySelector(el);
        el.removeEventListener(event, fn);
    };
}



/* Gui.js */
function Gui() {

    var gui = this;

    gui.managers = {};

    var draggables = [];
    var activeDrag = false;
    var activeWin = null;

    
    // ── notifications ───────────────────────────────────────────────
    var toasts = [];
    var errors = [];
    var alerts = [];

    // shared: bottom-stacked notification win (toast, error)
    var bottomNotifyWin = function (list, text, anchorX, bodyStyle, time) {
        var manager = gui.managers["toastsAndErrors"];
        if (!manager) return null;

        // deduplicate: if last win has the same text, bump its count
        var last = list.length ? list[list.length - 1] : null;
        if (last && last._notifyText === text) {
            last._notifyCount = (last._notifyCount || 1) + 1;
            var badge = last.body.querySelector('.count');
            if (badge) { badge.textContent = last._notifyCount; badge.classList.remove('hidden'); }
            return last;
        }

        // new win always at bottom; re-anchor previous last to sit above the new one
        var anchor = { from: { x: anchorX, y: 'max' }, to: { x: anchorX, y: 'max' } };

            
        var win = manager.win({
            headless: true,
            classes: 'rlg tlg op9',
            width: 280,
            height: "auto",
            minWidth: 280,
            minHeight: 100,
            maxHeight: 120,
            draggable: false,
            scalable: false,
            close: false,
            minimize: false,
            maximize: false,
            scrollable: true,
            activateOnShow: false,
            destroyOnHide: true,
            anchor: anchor,
            y: 10,
            state: 1
        });

        win.el.classList.remove('raised');
        win.el.classList.add('raised-xs');
        win.body.classList.add('p20');
        if (bodyStyle) win.body.style.cssText += bodyStyle;

        win.body.innerHTML = `
        <div class="count hidden wxs hxs txs round primary tb fr mt-15 mr-15 tc pt5 mb10"></div>
        <div class="tsm">${text}</div>
        ` ;

        win._notifyText = text;
        win._notifyCount = 1;

        // re-anchor previous last to sit above this new win
        if (last) {
            last.anchor(new Anchor({ from: { x: anchorX, y: 'max' }, to: { parent: win.name, x: anchorX, y: 'min' } }));
            last.y(10);
        }
        list.push(win);

        // auto-destroy
        if (time === undefined) time = 3000;
        if (time > 0) setTimeout(async function () {
            var r = win.rect();
            await warp.to.tween(win.el, { duration: .7, x: r.left + (anchorX === 'mid' ? -175 : 175), opacity: 0, ease: ease.inBack });
            var idx = list.indexOf(win);
            if (idx !== -1) {
                list.splice(idx, 1);
                // relink: the win above (idx-1) was anchored to this win
                if (idx > 0) {
                    var above = list[idx - 1];
                    var below = idx < list.length ? list[idx] : null;
                    above.anchor(new Anchor(below
                        ? { from: { x: anchorX, y: 'max' }, to: { parent: below.name, x: anchorX, y: 'min' } }
                        : { from: { x: anchorX, y: 'max' }, to: { x: anchorX, y: 'max' } }
                    ));
                    above.y(10);
                }
            }
            manager.kill(win);
        }, time);

        return win;
    };

    // shared: centered dialog win (alert, confirm, input)
    var centeredNotifyWin = function (list, text, bodyStyle) {
        var manager = gui.managers["toastsAndErrors"];
        if (!manager) return null;

        // deduplicate
        var last = list.length ? list[list.length - 1] : null;
        if (last && last._notifyText === text) {
            last._notifyCount = (last._notifyCount || 1) + 1;
            var badge = last.body.querySelector('.count');
            if (badge) { badge.textContent = last._notifyCount; badge.classList.remove('hidden'); }
            return last;
        }

        var win = manager.win({
            headless: true,
            classes: 'rxl tlg op9',
            width: 400,
            height: 200,
            minWidth: 400,
            minHeight: 200,
            draggable: false,
            scalable: false,
            close: false,
            minimize: false,
            maximize: false,
            scrollable: false,
            activateOnShow: false,
            destroyOnHide: true,
            backdrop: true,
            backdropCloses: true,
            anchor: { from: { x: 'mid', y: 'mid' }, to: { x: 'mid', y: 'mid' } },
            y: -200,
            state: 1
        });

        win.el.classList.remove('raised');
        win.el.classList.add('raised-xs');
        win.body.classList.add('p20');
        if (bodyStyle) win.body.style.cssText += bodyStyle;

        win.body.style.display = 'flex';
        win.body.style.flexDirection = 'column';
        win.body.innerHTML = `
        <div class="count hidden wxs hxs txs round primary tb fr mt-15 mr-15 tc pt5"></div>
        <div class="content m20" style="flex:1;overflow-y:auto">${text}</div>
        <div class="buttons tc p10" style="flex:0 0 auto"><button class="primary xs notify-ok">OK</button></div>
        `;

        win._notifyText = text;
        win._notifyCount = 1;
        list.push(win);

        // helper to dismiss and clean up
        win._dismiss = function () {
            var idx = list.indexOf(win);
            if (idx !== -1) list.splice(idx, 1);
            manager.kill(win);
        };

        win.body.querySelector('.notify-ok').addEventListener('click', function () { win._dismiss(); });

        // esc to cancel
        var escHandler = function (e) { if (e.key === 'Escape') { win._dismiss(); } };
        document.addEventListener('keydown', escHandler);

        // clean list when dismissed via backdrop or any hide path
        win.on('hide', function () {
            document.removeEventListener('keydown', escHandler);
            var idx = list.indexOf(win);
            if (idx !== -1) list.splice(idx, 1);
        });

        return win;
    };

    gui.toast = function (text, time) {
        return bottomNotifyWin(toasts, text, 'mid', 'background-color:rgb(15,15,15); color :white', time);
    };

    gui.error = function (text) {
        var win = bottomNotifyWin(errors, text, 'max', 'background-color:var(--dangerBg);color:var(--dangerColor);');
        if (win) win.x(10);
        return win;
    };

    gui.alert = function (text) {
        return centeredNotifyWin(alerts, text, 'background-color:rgb(15,15,15); color:white;');
    };

    var confirms = [];

    gui.confirm = function (text) {
        return new Promise(function (resolve) {
            var win = centeredNotifyWin(confirms, text, 'background-color:rgb(15,15,15); color:white;');
            if (!win) return resolve(false);
            if (win._notifyCount > 1) return;

            var buttons = win.body.querySelector('.buttons');
            buttons.innerHTML = '<button class="xs notify-ok">OK</button> <button class="primary xs notify-cancel">Cancel</button>';

            buttons.querySelector('.notify-ok').addEventListener('click', function () { win._dismiss(); resolve(true); });
            buttons.querySelector('.notify-cancel').addEventListener('click', function () { win._dismiss(); resolve(false); });
            win.on('hide', function () { resolve(false); });
        });
    };

    var inputs = [];

    gui.input = function (stringOrText, text) {
        var original = text ? stringOrText : '';
        var message = text || stringOrText;
        return new Promise(function (resolve) {
            var win = centeredNotifyWin(inputs, message, 'background-color:rgb(15,15,15); color:white;');
            if (!win) return resolve(false);
            if (win._notifyCount > 1) return;

            win.height(230);

            var content = win.body.querySelector('.content');
            content.style.overflow = 'visible';
            content.innerHTML = message + '<textarea class="notify-input mt10" style="width:100%;box-sizing:border-box;resize:vertical;min-height:40px;">' + original.replace(/</g, '&lt;') + '</textarea>';

            var buttons = win.body.querySelector('.buttons');
            buttons.innerHTML = '<button class="xs notify-ok">OK</button> <button class="primary xs notify-cancel">Cancel</button>';

            var input = content.querySelector('.notify-input');
            input.focus();
            input.select();

            var submit = function () {
                var val = input.value;
                win._dismiss();
                resolve(val !== original ? val : false);
            };

            input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });

            buttons.querySelector('.notify-ok').addEventListener('click', submit);
            buttons.querySelector('.notify-cancel').addEventListener('click', function () { win._dismiss(); resolve(false); });
            win.on('hide', function () { resolve(false); });
        });
    };

    gui.activate = function (win) {
        // toastsAndErrors wins must never steal focus
        if (win && win.manager === gui.managers["toastsAndErrors"]) return;
        if (activeWin === win) return;
        if (activeWin) {
            activeWin.el.classList.remove('active');
            activeWin.manager.el.classList.remove('active');
        }
        activeWin = win;
        if (activeWin) {
            activeWin.el.classList.add('active');
            activeWin.manager.el.classList.add('active');
            // keep toastsAndErrors always on top
            var te = gui.managers["toastsAndErrors"];
            if (te && te.el.parentNode) te.el.parentNode.appendChild(te.el);
        }
    };

    gui.draggable = function (el, opts) {
        if (opts === undefined) opts = {};
        var d = {
            el: el,
            trigger: opts.trigger || null,
            before: opts.before || null,
            onDrag: opts.onDrag || null,
            onEnd: opts.onEnd || null
        };
        draggables.push(d);
        d.destroy = function () {
            var idx = draggables.indexOf(d);
            if (idx !== -1) draggables.splice(idx, 1);
        };
        return d;
    };

    // returns a manager by name, or creates one from an options object
    gui.manager = async function (nameOrOptions) {
        if (typeof nameOrOptions === "string") {
            return gui.managers[nameOrOptions] || null;
        }

        var m = new Manager(Object.assign({}, nameOrOptions));

        gui.el.appendChild(m.el);
        gui.managers[m.name] = m;
        return m;
    };

    // destroys a manager and all its windows, removes it from the list
    gui.kill = function (manager) {
        if (activeWin && activeWin.manager === manager) gui.activate(null);
        each(manager.windows, function (win) { manager.kill(win); });
        if (manager.el && manager.el.parentNode) manager.el.parentNode.removeChild(manager.el);
        delete gui.managers[manager.name];
    };

    // ── skins ─────────────────────────────────────────────────────
    var skins = {
        dark: {
            "--defaultColor": "#e0e0e0",
            "--defaultBg": "#3a3a3a",
            "--defaultLight": "#555555",
            "--defaultDark": "#2a2a2a",
            "--primaryColor": "#0a0a0a",
            "--primaryBg": "#ffa000",
            "--primaryLight": "#faa014",
            "--primaryDark": "#b97a13",
            "--secondaryColor": "#121213",
            "--secondaryBg": "#00f3e6",
            "--secondaryLight": "#1effff",
            "--secondaryDark": "#00d5c8",
            "--successColor": "#fffffa",
            "--successBg": "#449110",
            "--successLight": "#62af2a",
            "--successDark": "#267300",
            "--warningColor": "#0e0e0e",
            "--warningBg": "#f59700",
            "--warningLight": "#ffbf1e",
            "--warningDark": "#e18300",
            "--dangerColor": "#ffffff",
            "--dangerBg": "#c20000",
            "--dangerLight": "#e01e1e",
            "--dangerDark": "#a40024",
            "--linkColor": "#60c8ff",
            "--linkBg": "#2a2a2a",
            "--linkLight": "#3a3a3a",
            "--linkDark": "#1a1a1a",
            "--textBg": "#1e1e1e",
            "--textColor": "#d8d8d8",
            "--itemBg": "#141414",
            "--itemColor": "#d0d0d0",
            "--winHeadBg": "#1e1e1e",
            "--winHeadColor": "#aaaaaa",
            "--winHeadActiveBg": "#0f0f0f",
            "--winHeadActiveColor": "#ffffff",
            "--winBodyBg": "#232323",
            "--winBodyColor": "#cccccc",
            "--winBodyActiveBg": "#1e1e1e",
            "--winBodyActiveColor": "#e0e0e0"
        },
        light: {
            "--defaultColor": "#040e1a",
            "--defaultBg": "#e3e3e3",
            "--defaultLight": "#ffffff",
            "--defaultDark": "#c5c5c5",
            "--primaryColor": "#0a0a0a",
            "--primaryBg": "#ffa000",
            "--primaryLight": "#faa014",
            "--primaryDark": "#b97a13",
            "--secondaryColor": "#121213",
            "--secondaryBg": "#00f3e6",
            "--secondaryLight": "#1effff",
            "--secondaryDark": "#00d5c8",
            "--successColor": "#fffffa",
            "--successBg": "#449110",
            "--successLight": "#62af2a",
            "--successDark": "#267300",
            "--warningColor": "#0e0e0e",
            "--warningBg": "#f59700",
            "--warningLight": "#ffbf1e",
            "--warningDark": "#e18300",
            "--dangerColor": "#ffffff",
            "--dangerBg": "#c20000",
            "--dangerLight": "#e01e1e",
            "--dangerDark": "#a40024",
            "--linkColor": "#3ca0d2",
            "--linkBg": "#ffffff",
            "--linkLight": "#ffffff",
            "--linkDark": "#e1e1e1",
            "--textBg": "#f0f0f0",
            "--textColor": "#1c1b1b",
            "--itemBg": "#f0f0f0",
            "--itemColor": "#1c1b1b",
            "--winHeadBg": "#b9b9b9",
            "--winHeadColor": "#1c1b1b",
            "--winHeadActiveBg": "#000000",
            "--winHeadActiveColor": "#ffffff",
            "--winBodyBg": "#d3d3d3",
            "--winBodyColor": "#1c1b1b",
            "--winBodyActiveBg": "#f0f0f0",
            "--winBodyActiveColor": "#1c1b1b"
        },
        teal: {
            "--defaultColor": "#c8e6e0",
            "--defaultBg": "#000000",
            "--defaultLight": "#264e4a",
            "--defaultDark": "#122c2a",
            "--primaryColor": "#f5f5f5",
            "--primaryBg": "#005c4d",
            "--primaryLight": "#40e8cc",
            "--primaryDark": "#1fba9e",
            "--secondaryColor": "#0a1a18",
            "--secondaryBg": "#f0a030",
            "--secondaryLight": "#ffb84d",
            "--secondaryDark": "#d08a20",
            "--successColor": "#e8fff4",
            "--successBg": "#1e8c5a",
            "--successLight": "#28a870",
            "--successDark": "#147040",
            "--warningColor": "#0e1210",
            "--warningBg": "#e8a020",
            "--warningLight": "#f5b840",
            "--warningDark": "#c88810",
            "--dangerColor": "#ffffff",
            "--dangerBg": "#b83040",
            "--dangerLight": "#d04050",
            "--dangerDark": "#901828",
            "--linkColor": "#50d8c0",
            "--linkBg": "#122c2a",
            "--linkLight": "#1a3a38",
            "--linkDark": "#0a201e",
            "--textBg": "#0e2220",
            "--textColor": "#f1f3f3",
            "--itemBg": "#040606",
            "--itemColor": "#c1b31a",
            "--winHeadBg": "#000000",
            "--winHeadColor": "#80aaa2",
            "--winHeadActiveBg": "#000000",
            "--winHeadActiveColor": "#e0f5f0",
            "--winBodyBg": "#11354b",
            "--winBodyColor": "#b8d4cc",
            "--winBodyActiveBg": "#000000",
            "--winBodyActiveColor": "#d8f0e8"
        }
    };

    var skinStyleEl = null;
    var currentSkin = null;

    gui.skins = skins;

    gui.skin = function (nameOrData) {
        var data = typeof nameOrData === "string" ? skins[nameOrData] : nameOrData;
        if (!data) return currentSkin;
        var css = ":host {\n";
        for (var k in data) css += "    " + k + ": " + data[k] + ";\n";
        css += "}";
        if (!skinStyleEl) {
            skinStyleEl = dom.node({ node: "style" });
            gui.shadow.insertBefore(skinStyleEl, gui.shadow.firstChild);
        }
        skinStyleEl.textContent = css;
        currentSkin = typeof nameOrData === "string" ? nameOrData : "custom";
        return currentSkin;
    };

    gui.platform = (function () {
        var ua = navigator.userAgent;
        if (/iPad|Android(?!.*Mobile)/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua))) return 'tablet';
        if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
        return 'desktop';
    })();

    var pointer = {
        x: 0, y: 0,
        lastX: 0, lastY: 0,
        b0: false, b1: false, b2: false,
        dragged: false
    };

    gui.pointer = function (prop) {
        return prop ? pointer[prop] : pointer;
    };
 
    var init = function () {

        //the root element of all engine things, visible in DOM, hosts shadow element that hosts .gui element
        gui.host = dom.node({
            node: "div", class: "warp", style: `
                                margin: 0;
                                padding: 0;
                                position: fixed;
                                left: 0;
                                top: 0;
                                font-family: var(--font1);
                                font-size: 13px!important;
                                background-color:none;
                                color: var(--textColor);
                                z-index:1000;
                                width:100%;
                                -webkit-font-smoothing : antialiased;
                                -moz-osx-font-smoothing : grayscale;
                                cursor : url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAANESURBVHgBADQDy/wA/////7Ozs7GAgIAE////AP///wD///8A////AP///wD///8A////AAIAAAAAtLS0Tjw8PLaBgYEJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAAD/WFhY/8XFxcaAgIAQ////AP///wD///8A////AP///wAA/////wAAAP8AAAD/SUlJ/87Ozs+CgoIY////AP///wD///8A////AAD/////AAAA/wAAAP8AAAD/Ozs7/9fX19eFhYUk////AP///wD///8AAP////8AAAD/AAAA/wAAAP8AAAD/MDAw/97e3t6Hh4cw////AP///wAA/////wAAAP8AAAD/AAAA/wAAAP8AAAD/JiYm/+Pj4+eJiYk+////AAH/////AQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBwcAL6+vu6wsLA5AP////8AAAD/AAAA/wAAAP8AAAD/AAAA/xQUFP97e3v/6Ojo+dra2hECAAAAAAAAAAAAAAAAAAAAACgoKACZmZkA2dnZ7DExMX2dnZ0dDg4O9AH/////AQEBAERERABxcXEAJycn18TExIfg4OCtbW1tCL+/vzbZ2dnQAf/////T09MA9/f3uczMzIrr6+u/XFxcIsTExCPg4ODEf39/9gAAAAAAubm5moyMjCn///8AycnJNZWVlT2AgIAB////AP///wD///8A////AAD///8Aubm5QYyMjCn///8A////AP///wD///8A////AP///wD///8AAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA//8D5SINzAur5gAAAABJRU5ErkJggg==),auto;

            ` });
        document.body.appendChild(gui.host);

        gui.shadow = gui.host.attachShadow({ mode: "open" });


        /*  CSS is embedded as JS strings at build time:
            _fontsCss  — @font-face rules, injected into document.head (shadow DOM can't register fonts)
            _skinCss   — :host vars (fonts, sizes, border-radius), injected into shadow
            _warpCss   — component CSS (buttons, grids, icons, etc), injected into shadow
            Colour variables are applied via gui.skin() as a separate <style>.
        */
        document.head.appendChild(dom.node({ node: "style", text: _fontsCss }));
        gui.shadow.append(dom.node({ node: "style", text: _skinCss }));
        gui.shadow.append(dom.node({ node: "style", text: _warpCss }));

        gui.skin("dark");

        gui.el = dom.node({ node: "div", class: "gui" });
        gui.shadow.appendChild(gui.el);

        // ── default managers ──────────────────────────────────────────────
        var toastsManager = new Manager({ name: "toastsAndErrors" });
        toastsManager.el.style.cssText = 'z-index:999999; position:relative;';
        gui.el.appendChild(toastsManager.el);
        gui.managers["toastsAndErrors"] = toastsManager;


        // ── resize detection ──────────────────────────────────────────────
        var MARGIN = 6;
        var CURSORS = {
            n: 'n-resize', s: 's-resize',
            e: 'e-resize', w: 'w-resize',
            ne: 'ne-resize', nw: 'nw-resize',
            se: 'se-resize', sw: 'sw-resize'
        };

        var _hoverEdge = null;
        var resizeHelper = dom.node({ node: 'div', style: 'position:absolute; background:rgba(255, 90, 13,0)' });

        var _resizeStart = null; // { rect, totalDx, totalDy }

        gui.draggable(resizeHelper, {
            before: function () {
                if (!_hoverEdge) return;
                var r = _hoverEdge.win.manager.getScreenRect(_hoverEdge.win);
                var wo = _hoverEdge.win.options();
                _resizeStart = { left: r.left, top: r.top, width: r.width, height: r.height, totalDx: 0, totalDy: 0, ratio: wo.keepRatio ? r.width / r.height : 0 };
            },
            onDrag: function (dx, dy) {
                if (!_hoverEdge || !_resizeStart) return;
                var w = _hoverEdge.win;
                var edge = _hoverEdge.edge;

                _resizeStart.totalDx += dx;
                _resizeStart.totalDy += dy;

                var left = _resizeStart.left;
                var top = _resizeStart.top;
                var width = _resizeStart.width;
                var height = _resizeStart.height;

                if (edge.includes('e')) width += _resizeStart.totalDx;
                if (edge.includes('s')) height += _resizeStart.totalDy;
                if (edge.includes('w')) { left += _resizeStart.totalDx; width -= _resizeStart.totalDx; }
                if (edge.includes('n')) { top += _resizeStart.totalDy; height -= _resizeStart.totalDy; }

                // keep aspect ratio
                var ratio = _resizeStart.ratio;
                if (ratio) {
                    var isCorner = edge.length === 2;
                    if (isCorner) {
                        // pick dominant axis: whichever delta is larger drives
                        var adx = Math.abs(_resizeStart.totalDx);
                        var ady = Math.abs(_resizeStart.totalDy);
                        if (adx / ratio >= ady) {
                            // width drives
                            var newH = Math.round(width / ratio);
                            if (edge.includes('n')) top += height - newH;
                            height = newH;
                        } else {
                            // height drives
                            var newW = Math.round(height * ratio);
                            if (edge.includes('w')) left += width - newW;
                            width = newW;
                        }
                    } else if (edge === 'e' || edge === 'w') {
                        var newH = Math.round(width / ratio);
                        top += (height - newH) / 2;
                        height = newH;
                    } else {
                        var newW = Math.round(height * ratio);
                        left += (width - newW) / 2;
                        width = newW;
                    }
                }

                var wo = w.options();
                var minW = wo.minWidth  !== false ? wo.minWidth  : 0;
                var minH = wo.minHeight !== false ? wo.minHeight : 0;
                var maxW = wo.maxWidth  !== false ? wo.maxWidth  : Infinity;
                var maxH = wo.maxHeight !== false ? wo.maxHeight : Infinity;

                // clamp — ratio wins: if either axis hits a limit, constrain both
                var clampedW = Math.min(maxW, Math.max(minW, width));
                var clampedH = Math.min(maxH, Math.max(minH, height));
                if (ratio && (clampedW !== width || clampedH !== height)) {
                    // re-derive from whichever axis was clamped
                    if (clampedW !== width) {
                        clampedH = Math.round(clampedW / ratio);
                    } else {
                        clampedW = Math.round(clampedH * ratio);
                    }
                    // re-clamp in case the derived axis also exceeds
                    clampedW = Math.min(maxW, Math.max(minW, clampedW));
                    clampedH = Math.min(maxH, Math.max(minH, clampedH));
                }
                if (edge.includes('w')) left += width - clampedW;
                if (edge.includes('n')) top  += height - clampedH;
                if (ratio && (edge === 'e' || edge === 'w')) top += (height - clampedH) / 2;
                if (ratio && (edge === 'n' || edge === 's')) left += (width - clampedW) / 2;
                width  = clampedW;
                height = clampedH;

                w.manager.setScreenRect(w, left, top, width, height);

                // reposition the helper to match the dragged edge
                var sr = w.manager.getScreenRect(w);
                var rh = resizeHelper.style;
                if (edge === 'n' || edge === 's') {
                    rh.left = sr.left + 'px';
                    rh.width = sr.width + 'px';
                    rh.top = (edge === 'n' ? sr.top - MARGIN : sr.top + sr.height - MARGIN) + 'px';
                } else if (edge === 'e' || edge === 'w') {
                    rh.top = sr.top + 'px';
                    rh.height = sr.height + 'px';
                    rh.left = (edge === 'w' ? sr.left - MARGIN : sr.left + sr.width - MARGIN) + 'px';
                } else {
                    rh.left = (edge.includes('w') ? sr.left - MARGIN : sr.left + sr.width - MARGIN) + 'px';
                    rh.top = (edge.includes('n') ? sr.top - MARGIN : sr.top + sr.height - MARGIN) + 'px';
                }
            },
            onEnd: function () { _resizeStart = null; }
        });

        function detectResizeZone() {
            if (!activeWin) {
                _hoverEdge = null;
                if (resizeHelper.parentNode) resizeHelper.parentNode.removeChild(resizeHelper);
                return;
            }

            var wo = activeWin.options();
            if (wo.state === 0 || wo.state === 2 || !wo.scalable) {
                _hoverEdge = null;
                if (resizeHelper.parentNode) resizeHelper.parentNode.removeChild(resizeHelper);
                return;
            }

            var px = pointer.x;
            var py = pointer.y;
            var r = activeWin.el.getBoundingClientRect();

            var nearLeft   = px >= r.left - MARGIN   && px <= r.left + MARGIN;
            var nearRight  = px >= r.right - MARGIN   && px <= r.right + MARGIN;
            var nearTop    = py >= r.top - MARGIN     && py <= r.top + MARGIN;
            var nearBottom = py >= r.bottom - MARGIN  && py <= r.bottom + MARGIN;
            var inXRange   = px >= r.left - MARGIN    && px <= r.right + MARGIN;
            var inYRange   = py >= r.top - MARGIN     && py <= r.bottom + MARGIN;

            var edge = '';
            if (nearTop && inXRange)    edge += 'n';
            if (nearBottom && inXRange) edge += 's';
            if (nearLeft && inYRange)   edge += 'w';
            if (nearRight && inYRange)  edge += 'e';

            if (edge) {
                _hoverEdge = { win: activeWin, edge: edge, rect: r };
                var rh = resizeHelper.style;

                if (edge === 'n' || edge === 's') {
                    rh.left = r.left + 'px';
                    rh.width = r.width + 'px';
                    rh.top = (edge === 'n' ? r.top - MARGIN : r.bottom - MARGIN) + 'px';
                    rh.height = (MARGIN * 2) + 'px';
                } else if (edge === 'e' || edge === 'w') {
                    rh.top = r.top + 'px';
                    rh.height = r.height + 'px';
                    rh.left = (edge === 'w' ? r.left - MARGIN : r.right - MARGIN) + 'px';
                    rh.width = (MARGIN * 2) + 'px';
                } else {
                    var cx = edge.includes('w') ? r.left - MARGIN : r.right - MARGIN;
                    var cy = edge.includes('n') ? r.top - MARGIN : r.bottom - MARGIN;
                    rh.left = cx + 'px';
                    rh.top = cy + 'px';
                    rh.width = (MARGIN * 2) + 'px';
                    rh.height = (MARGIN * 2) + 'px';
                }

                rh.cursor = CURSORS[edge] || 'default';
                rh.zIndex = '10';
                activeWin.manager.el.insertBefore(resizeHelper, activeWin.el);
            } else {
                _hoverEdge = null;
                if (resizeHelper.parentNode) resizeHelper.parentNode.removeChild(resizeHelper);
            }
        }

        // continuous RAF loop
        function raf() {
            if (!pointer.dragged) detectResizeZone();
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // ── drag guard ────────────────────────────────────────────────────
        // full-screen invisible div that captures pointer events during drag,
        // preventing iframes and embeds from stealing mousemove/mouseup
        var dragGuard = {
            el: dom.node({ node: 'div', style: 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:999999;pointer-events:none;' }),
            show: function () { dragGuard.el.style.pointerEvents = 'all'; gui.el.appendChild(dragGuard.el); },
            hide: function () { dragGuard.el.style.pointerEvents = 'none'; if (dragGuard.el.parentNode) dragGuard.el.parentNode.removeChild(dragGuard.el); }
        };

        // ── window / pointer events ───────────────────────────────────────
        window.addEventListener("resize", function () {
            each(gui.managers, function (m) { m.onResize(); });
        }, true);

        // drag start — check shadow DOM path against registered draggables
        gui.shadow.addEventListener("mousedown", function (e) {
            if (e.button !== 0) return;
            var path = e.composedPath();
            for (var i = 0; i < draggables.length; i++) {
                var d = draggables[i];
                if (path.indexOf(d.trigger || d.el) !== -1) {
                    pointer.dragged = d;
                    activeDrag = d;
                    gui.el.style.userSelect = 'none';
                    if (d.before) d.before(e);
                    break;
                }
            }
        });

        document.body.addEventListener("mousedown", function (e) {
            pointer["b" + e.button] = true;
        });

        document.body.addEventListener("mousemove", function (e) {
            var dx = e.clientX - pointer.x;
            var dy = e.clientY - pointer.y;
            pointer.lastX = pointer.x;
            pointer.lastY = pointer.y;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (pointer.dragged && pointer.dragged.onDrag) {
                dragGuard.show();
                pointer.dragged.onDrag(dx, dy, pointer);
            }
        });

        document.body.addEventListener("mouseup", function (e) {
            pointer["b" + e.button] = false;
            if (pointer.dragged) {
                if (pointer.dragged.onEnd) pointer.dragged.onEnd(pointer);
                warp.trigger("pointer.dragEnd", { pointer: pointer, event: e });
                pointer.dragged = false;
                activeDrag = false;
                gui.el.style.userSelect = '';
                dragGuard.hide();
            }
        });

        document.documentElement.addEventListener("mouseenter", function (e) {
            if (activeDrag && (e.buttons & 1) === 0) {
                if (activeDrag.onEnd) activeDrag.onEnd(pointer);
                warp.trigger("pointer.dragEnd", { pointer: pointer, event: e });
                pointer.dragged = false;
                activeDrag = false;
                gui.el.style.userSelect = '';
                dragGuard.hide();
            }
        });

        document.body.addEventListener("dblclick", function (_e) {
            // warp.trigger("gui.dblclick", { event: _e });
        });

        // ── electron overlay: pass mouse events through transparent areas ─
        if (typeof window !== "undefined" && window.electronAPI && window.electronAPI.ignoreMouseEvents) {
            var _mouseIgnored = false;

            function isOverWin(el) {
                while (el) {
                    if (el.classList && el.classList.contains('win')) return true;
                    el = el.parentElement;
                }
                return false;
            }

            gui.shadow.addEventListener('mouseover', function () {
                if (_mouseIgnored) {
                    _mouseIgnored = false;
                    window.electronAPI.ignoreMouseEvents(false);
                }
            });

            gui.shadow.addEventListener('mouseout', function (e) {
                if (!isOverWin(e.relatedTarget) && !pointer.dragged) {
                    _mouseIgnored = true;
                    window.electronAPI.ignoreMouseEvents(true);
                }
            });
        }
    }

    init();
    return gui;
}


/* Manager.js */
var ManagerJSON = {
    name: false,
    defaultWin: {} //WinJSON
};

function Manager(options) {

    options = helpers.setupOptionsAndInstance(options, this);
    var manager = this;
    manager.el = warp.dom.node({ node: "div", class: "man" });
    manager.name = options.name;
    manager.defaultWin = options.defaultWin || {};
    manager.windows = {};

    var _queue = new Set();
    var _pending = false;

    manager.addWinToRenderQueue = function (name) {
        _queue.add(name);
        if (!_pending) {
            _pending = true;
            requestAnimationFrame(function () {
                _pending = false;
                manager._render();
            });
        }
    };

    // ── shared anchor helpers ─────────────────────────────────────────

    function resolveEdge(point, rect, axis) {
        if (axis === 'x') {
            if (point === 'min') return rect.left;
            if (point === 'max') return rect.right;
            if (point === 'mid') return rect.left + rect.width / 2;
            return rect.left + point;
        }
        if (point === 'min') return rect.top;
        if (point === 'max') return rect.bottom;
        if (point === 'mid') return rect.top + rect.height / 2;
        return rect.top + point;
    }

    function resolveFromOffset(point, size) {
        if (point === 'min') return 0;
        if (point === 'max') return size;
        if (point === 'mid') return size / 2;
        return point;
    }

    function getParentRect(anchor) {
        if (!anchor.to || !anchor.to.parent) {
            return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
        }
        var parentWin = manager.windows[anchor.to.parent];
        return parentWin ? parentWin.rect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
    }

    // forward-solve: win options -> screen coords
    function forwardAnchor(win) {
        var o = win.options();
        var anchor = o.anchor || { from: { x: 'mid', y: 'min' }, to: { parent: null, x: 'mid', y: 'min' } };
        var pr = getParentRect(anchor);
        var toX = resolveEdge(anchor.to.x, pr, 'x');
        var toY = resolveEdge(anchor.to.y, pr, 'y');
        var w = o.width || 0;
        var h = o.height || 0;
        var fromOffsetX = resolveFromOffset(anchor.from.x, w);
        var fromOffsetY = resolveFromOffset(anchor.from.y, h === 'auto' ? win.el.offsetHeight : h);
        var xSign = anchor.from.x === 'max' ? -1 : 1;
        var ySign = anchor.from.y === 'max' ? -1 : 1;
        return {
            left: toX - fromOffsetX + xSign * (o.x || 0),
            top:  toY - fromOffsetY + ySign * (o.y || 0),
            width: w,
            height: h
        };
    }

    // back-solve: screen coords -> win x/y (and optionally width/height)
    function backsolveAnchor(win, left, top, width, height) {
        var o = win.options();
        var anchor = o.anchor || { from: { x: 'mid', y: 'min' }, to: { parent: null, x: 'mid', y: 'min' } };
        var pr = getParentRect(anchor);
        var toX = resolveEdge(anchor.to.x, pr, 'x');
        var toY = resolveEdge(anchor.to.y, pr, 'y');
        var w = width !== undefined ? width : (o.width || 0);
        var h = height !== undefined ? height : (o.height || 0);
        var fromOffsetX = resolveFromOffset(anchor.from.x, w);
        var fromOffsetY = resolveFromOffset(anchor.from.y, h === 'auto' ? win.el.offsetHeight : h);
        var xSign = anchor.from.x === 'max' ? -1 : 1;
        var ySign = anchor.from.y === 'max' ? -1 : 1;
        o.x = (left - toX + fromOffsetX) / xSign;
        o.y = (top - toY + fromOffsetY) / ySign;
        if (width !== undefined) o.width = width;
        if (height !== undefined) o.height = height;
    }

    // ── render ────────────────────────────────────────────────────────

    manager._render = function () {
        var names = Array.from(_queue);
        _queue.clear();

        var toRender = [];
        var visited = new Set();
        function expand(name) {
            if (visited.has(name)) return;
            visited.add(name);
            toRender.push(name);
            var w = manager.windows[name];
            if (w) {
                var children = w.options('children');
                if (children) children.forEach(expand);
            }
        }
        names.forEach(expand);

        toRender.forEach(function (name) {
            var win = manager.windows[name];
            if (!win) return;

            var o = win.options();
            var w, h, left, top;

            if (o.state === 3 || o.state === 4) {
                left = 0;
                top  = 0;
                w = window.innerWidth;
                h = window.innerHeight;
            } else {
                var r = forwardAnchor(win);
                left = r.left;
                top  = r.top;
                w    = r.width;
                h    = r.height;
            }

            win.el.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';

            if (o.state === 2) {
                win.el.style.width  = '180px';
                var headH = win.head ? win.head.offsetHeight : 0;
                win.el.style.height = headH + 'px';
            } else {
                win.el.style.width  = w + 'px';
                win.el.style.height = h === 'auto' ? 'auto' : h + 'px';
                var headH    = win.head ? win.head.offsetHeight : 0;
                var bodyH    = h === 'auto' ? 'auto' : (h - headH) + 'px';
                win.body.style.width  = w + 'px';
                win.body.style.height = bodyH;
                win._notifyResize(w, h === 'auto' ? win.el.offsetHeight : h);
            }
        });
    };

    // ── win factory ───────────────────────────────────────────────────

    manager.win = function (nameOrOptions) {
        if (typeof nameOrOptions === 'string') {
            return manager.windows[nameOrOptions] || null;
        }
        if (!nameOrOptions.name) nameOrOptions.name = 'win-' + rand();
        if (manager.windows[nameOrOptions.name]) {
            throw new Error("Manager: window '" + nameOrOptions.name + "' already exists");
        }
        var w = new Win(Object.assign({}, manager.defaultWin, nameOrOptions, { manager: manager }));

        var anchor = w.options('anchor');
        var parentName = anchor && anchor.to && anchor.to.parent;
        if (parentName && manager.windows[parentName]) {
            manager.windows[parentName].options('children').push(w.name);
        }

        manager.windows[w.name] = w;
        manager.el.appendChild(w.el);
        return w;
    };

    // ── position / rect ───────────────────────────────────────────────

    manager._setPosition = function (win, left, top) {
        backsolveAnchor(win, left, top);
    };

    manager.setScreenRect = function (win, left, top, width, height) {
        width  = win._clampSize('width',  width);
        height = win._clampSize('height', height);
        backsolveAnchor(win, left, top, width, height);
        manager.addWinToRenderQueue(win.name);
    };

    manager.getScreenRect = function (win) {
        if (!manager.windows[win.name]) return null;
        return forwardAnchor(win);
    };

    // ── kill / resize ─────────────────────────────────────────────────

    manager.kill = function (win) {
        if (!manager.windows[win.name]) return;
        if (win.el.classList.contains('active')) warp.gui.activate(null);
        if (win._destroy) win._destroy();
        _queue.delete(win.name);
        delete manager.windows[win.name];
        if (win.el && win.el.parentNode) win.el.parentNode.removeChild(win.el);
    };

    manager.onResize = function () {
        Object.keys(manager.windows).forEach(function (name) {
            manager.addWinToRenderQueue(name);
        });
    };

    manager.json = function () {
        var out = {};
        for (var k in ManagerJSON) out[k] = options[k];
        out.windows = {};
        for (var name in manager.windows) {
            out.windows[name] = manager.windows[name].json();
        }
        helpers.fakeConstructor("ManagerJSON", out);
        return out;
    };

    manager.serialize = manager.toString = function () {
        return toJson(manager.json());
    };

}


/* Win.js */

/*
//extended window options, not yet implemented
{

      
        'keepCentered': false,
        'startCentered': true,
        'showCentered': false,
   
        //do animate out and in?
        'out': true,
        'in': true,
        'usePrefs': false, //does it use preferences Store

        'useGuard': false,//guard is an element that covers the content of the window during dragging or scaling to prevent unwanted interactions with the content(iframes)

    }

*/

//"parent" in anchor is the elemnt we are anchoring to, meaning everything else is relative to it
// from: reference point on this window (x/y: 'mid'|'min'|'max'|px)
// to:   reference point on the parent element (parent: 'gui'|Win instance, x/y same)
function Anchor(opts) {
    if (opts === undefined) opts = {};
    var defaults = {
        from: { x: 'mid', y: 'min' },
        to: { parent: null, x: 'mid', y: 'min' }
    };
    this.from = Object.assign({}, defaults.from, opts.from);
    this.to = Object.assign({}, defaults.to, opts.to);
}


var WinJSON = {
    'name': false,
    'manager': false,
    'anchor': null,
    'width': 320, // "auto", "fill" , false, Number - iphone 3 size, keep this ratio for mobile phones
    'height': 480,
    'x':0,
    'y':0,
    'caption': '',
    'image': '',
    'headless': false,
    'draggable': true,
    'scrollable': true,
    'scalable': true,
    'keepRatio': false,
    'minWidth': false,
    'minHeight': false,
    'maxWidth': false,
    'maxHeight': false,
    'close': true,
    'bottomClose': true,
    'minimize': true,
    'maximize': true,
    'classes': '',
    'backdrop': false,
    'backdropCloses': true,
    'backdropOpacity': 0.7,
    'destroyOnHide': false,
    'activateOnShow': true,
    'state' : 0, //0:hidden, 1:restored/normal, 2:minimized 3:maximized 4:fullscreen(will work properly only if gui is in fullscreen),
    'children': []
}
function Win(userOpts) {

    const win = this;

    // ── state (closure-scoped, accessed via win.options()) ─────────────
    if (userOpts === undefined) userOpts = {};
    var opts = Object.assign({}, WinJSON, userOpts);
    if (opts.anchor) opts.anchor = new Anchor(opts.anchor);
    if (!('minWidth'  in userOpts)) opts.minWidth  = opts.width;
    if (!('minHeight' in userOpts)) opts.minHeight = opts.height;
    opts.caption  = opts.caption || opts.name || '';
    opts.children = [];

    // mobile: force headless fullscreen
    if (warp.gui.platform === 'mobile') {
        opts.headless = true;
        opts.state = opts.state || 4;
    }

    // clamp initial dimensions to min/max
    opts.width  = clampSize('width',  opts.width);
    opts.height = clampSize('height', opts.height);

    this.options = function (key) { return key !== undefined ? opts[key] : opts; };

    var _backdrop = null;

    // ── private event store ───────────────────────────────────────────────
    var eventHandlers = {};

    function trigger(event, data) {
        var e = { type: event, win: win, data: data, cancelled: false, preventDefault: function () { this.cancelled = true; }, cancel: function () { this.cancelled = true; } };
        var handlers = eventHandlers[event];
        if (handlers) handlers.forEach(function (fn) { fn(e); });
        return e;
    }

    this.on = function (event, fn) {
        if (!eventHandlers[event]) eventHandlers[event] = [];
        eventHandlers[event].push(fn);
    };

    this.off = function (event, fn) {
        if (!eventHandlers[event]) return;
        eventHandlers[event] = eventHandlers[event].filter(function (f) { return f !== fn; });
    };

    // called by Manager._render() after it applies dimensions to the DOM
    this._notifyResize = function (w, h) { trigger('resize', { width: w, height: h }); };

    this._clampSize = clampSize;

    // ── state helpers ─────────────────────────────────────────────────────

    function clampSize(prop, val) {
        if (val === 'auto') return val;
        if (prop === 'width') {
            if (opts.minWidth  !== false) val = Math.max(val, opts.minWidth);
            if (opts.maxWidth  !== false) val = Math.min(val, opts.maxWidth);
        } else if (prop === 'height') {
            if (opts.minHeight !== false) val = Math.max(val, opts.minHeight);
            if (opts.maxHeight !== false) val = Math.min(val, opts.maxHeight);
        }
        return val;
    }

    function change(prop, val) {
        opts[prop] = val;
        win.manager.addWinToRenderQueue(win.name);
    }

    // ── public API ────────────────────────────────────────────────────────

    this.rect   = function ()  { return this.el.getBoundingClientRect(); };

    this.width  = function (v) { if (v !== undefined) { change('width',  clampSize('width', v));  return; } return opts.width;  };
    this.height = function (v) { if (v !== undefined) { change('height', clampSize('height', v == 'auto' ? 'auto' : parseInt(v))); return; } return opts.height; };
    this.x      = function (v) { if (v !== undefined) { change('x',      parseInt(v));  return; } return opts.x;      };
    this.y      = function (v) { if (v !== undefined) { change('y',      parseInt(v));  return; } return opts.y;      };
    this.anchor = function (v) { if (v !== undefined) { change('anchor', v);            return; } return opts.anchor; };

    this.caption = function (v) {
        if (v !== undefined) { win.el.querySelector('.caption').textContent = v; opts.caption = v; return; }
        return opts.caption;
    };

    this.image = function (v) {
        if (v !== undefined) { win.el.querySelector('.head img').src = v; opts.image = v; return; }
        return opts.image;
    };

    //0:hidden, 1:restored/normal, 2:minimized, 3:maximized, 4:fullscreen
    function applyState(v) {
        if (v === 2 && !opts.minimize) return;
        if ((v === 3 || v === 4) && !opts.maximize) return;
        var prev = opts.state;

        // save restore rect before maximizing
        if ((v === 3 || v === 4) && prev !== 3 && prev !== 4) {
            opts._restoreRect = { x: opts.x, y: opts.y, width: opts.width, height: opts.height };
        }

        // restore saved dimensions when leaving maximized
        if (v === 1 && opts._restoreRect && (prev === 3 || prev === 4)) {
            opts.x = opts._restoreRect.x;
            opts.y = opts._restoreRect.y;
            opts.width = opts._restoreRect.width;
            opts.height = opts._restoreRect.height;
            delete opts._restoreRect;
        }

        // backdrop
        if (_backdrop) {
            if (v === 0) {
                if (_backdrop.parentNode) _backdrop.parentNode.removeChild(_backdrop);
            } else if (prev === 0 || prev === -1) {
                if (win.el.parentNode) {
                    win.el.parentNode.insertBefore(_backdrop, win.el);
                } else {
                    Promise.resolve().then(function () {
                        if (_backdrop && win.el.parentNode && !_backdrop.parentNode) {
                            win.el.parentNode.insertBefore(_backdrop, win.el);
                        }
                    });
                }
            }
        }

        // visibility + activation
        if (v === 0) {
            win.el.classList.add('hidden');
            warp.gui.activate(null);
        } else if (v === 2) {
            win.el.classList.remove('hidden');
            win.body.classList.add('hidden');
            win.el.querySelector(':scope > .close').classList.add('hidden');
            win.head.querySelector('.center').classList.add('hidden');
            win.head.querySelector('.caption').style.maxWidth = '75px';
            win.el.style.height = win.head.offsetHeight + 'px';
            win.el.style.width = '180px';
            if (opts.activateOnShow) warp.gui.activate(win);
        } else {
            win.el.classList.remove('hidden');
            win.body.classList.remove('hidden');
            if (opts.bottomClose) win.el.querySelector(':scope > .close').classList.remove('hidden');
            win.head.querySelector('.center').classList.remove('hidden');
            win.head.querySelector('.caption').style.maxWidth = '';
            win.el.style.height = '';
            win.el.style.width = '';
            if (opts.activateOnShow) warp.gui.activate(win);
        }

        opts.state = v;
        win.manager.addWinToRenderQueue(win.name);

        // toggle head buttons (respect close/minimize/maximize options)
        var btnMin = win.head.querySelector('.minimize');
        var btnMax = win.head.querySelector('.maximize');
        var btnRes = win.head.querySelector('.restore');
        if (v === 2) {
            if (btnMin) btnMin.classList.add('hidden');
            if (btnMax) btnMax.classList.add('hidden');
            if (btnRes) btnRes.classList.remove('hidden');
        } else if (v === 3 || v === 4) {
            if (btnMin && opts.minimize) btnMin.classList.remove('hidden');
            if (btnMax) btnMax.classList.add('hidden');
            if (btnRes) btnRes.classList.remove('hidden');
        } else {
            if (btnMin) btnMin.classList.toggle('hidden', !opts.minimize);
            if (btnMax) btnMax.classList.toggle('hidden', !opts.maximize);
            if (btnRes) btnRes.classList.add('hidden');
        }

        // events
        if (v === 2) trigger('minimize');
        if (v === 3 || v === 4) trigger('maximize');
        if (v === 1 && (prev === 2 || prev === 3 || prev === 4)) trigger('restore');
    }

    this.state = function (v) {
        if (v !== undefined) return applyState(v);
        return opts.state;
    };

    this.show = function () {
        var e = trigger('beforeshow');
        if (e.cancelled) return;
        var btn = win.el.querySelector(':scope > .close');
        if (btn) { btn.style.transform = ''; btn.style.opacity = ''; }
        applyState(1);
        trigger('show');
    };

    this.hide = function () {
        var e = trigger('beforehide');
        if (e.cancelled) return;
        applyState(0);
        trigger('hide');
        if (opts.destroyOnHide) win.manager.kill(win);
    };

    // ── init ──────────────────────────────────────────────────────────────

    function init() {

        if (!opts.name)    throw new Error("Win: 'name' is required");
        if (!opts.manager) throw new Error("Win: 'manager' is required");

        this.el = warp.dom.node('div', { class: 'win raised' });

        this.el.innerHTML = `
        <div class="head">
            <div class="left">
                <img class="round hxs wxs" src=""/>
                <span class="caption pl5">CAPTION</span>
            </div>
            <div class="center"></div>
            <div class="right">
                <button class="hxs minimize default tlg rxs inverted clear"><span class="icon icon-window-minimize"></span></button>
                <button class="hxs maximize default tlg rxs inverted clear"><span class="icon icon-window-maximize"></span></button>
                <button class="hxs restore hidden default tlg rxs inverted clear"><span class="icon icon-window-restore"></span></button>
                <button class="hxs close default tlg rxs inverted clear"><span class="icon icon-close"></span></button>
            </div>
        </div>
        <div class="body"></div>
        <button class="close raised "><span class="icon icon-close txl"></span></button>
        `;
        this.head = this.el.querySelector('.head');
        this.body = this.el.querySelector('.body');
        this.name    = opts.name;
        this.manager = opts.manager;

        if (opts.classes) opts.classes.split(' ').forEach(function (c) { if (c) win.el.classList.add(c); });
        if (opts.headless) this.head.classList.add('hidden');
        var imgEl = this.head.querySelector('img');
        if (opts.image) { imgEl.src = opts.image; } else { imgEl.classList.add('hidden'); }

        var captionEl = this.el.querySelector('.caption');
        if (captionEl) captionEl.textContent = opts.caption;

        this.el.querySelector(':scope > .close').addEventListener('click', async function () {
            await warp.to.tween(win.el.querySelector(':scope > .close'), { duration : .2, y: 102, ease:ease.inBack, opacity:0});
            
           win.hide();
          
        });
        this.head.querySelector('.close').addEventListener('click', function () { win.hide(); });
        this.head.querySelector('.minimize').addEventListener('click', function () { win.state(2); });
        this.head.querySelector('.maximize').addEventListener('click', function () { win.state(3); });
        this.head.querySelector('.restore').addEventListener('click', function () { win.state(1); });

        if (!opts.close) this.head.querySelector('.close').classList.add('hidden');
        if (!opts.bottomClose) this.el.querySelector(':scope > .close').classList.add('hidden');
        if (!opts.minimize) this.head.querySelector('.minimize').classList.add('hidden');
        if (!opts.maximize) this.head.querySelector('.maximize').classList.add('hidden');

        this.head.addEventListener('dblclick', function () {
            if (opts.state === 2 && opts.minimize) win.state(1);
            else if (opts.state === 1 && opts.maximize) win.state(3);
        });

        this.el.addEventListener('mousedown', function (e) {
            if (!win.el.classList.contains('active')) {
                e.preventDefault();
                warp.gui.activate(win);
            }
        });

        if (opts.backdrop) {
            _backdrop = warp.dom.node('div', {
                class: 'backdrop',
                style: 'opacity:' + opts.backdropOpacity,
                click: function () { if (opts.backdropCloses) win.hide(); }
            });
        }

    
        var _drag = null;
        if (opts.draggable) {
            _drag = warp.gui.draggable(this.el, {
                trigger: this.head,
                before: function (e) {
                    if (opts.state === 3 || opts.state === 4) {
                        var ratio = e.clientX / window.innerWidth;
                        applyState(1);
                        var newLeft = e.clientX - (opts.width * ratio);
                        var newTop = e.clientY - (win.head.offsetHeight / 2);
                        win.manager._setPosition(win, newLeft, newTop);
                        win.manager.addWinToRenderQueue(win.name);
                    }
                    trigger('dragstart');
                },
                onDrag: function (dx, dy) {
                    var r       = win.el.getBoundingClientRect();
                    var newLeft = Math.round(r.left + dx);
                    var newTop  = Math.round(r.top  + dy);

                    var e = trigger('drag', { x: newLeft, y: newTop });
                    if (e.cancelled) return;

                    win.el.style.transform = 'translate(' + newLeft + 'px,' + newTop + 'px)';
                    win.manager._setPosition(win, newLeft, newTop);

                    if (opts.children.length) {
                        opts.children.forEach(function (childName) {
                            win.manager.addWinToRenderQueue(childName);
                        });
                    }
                },
                onEnd: function () {
                    trigger('dragend');
                }
            });
        }
 
        this._destroy = function () {
            if (_drag) { _drag.destroy(); _drag = null; }
            if (_backdrop && _backdrop.parentNode) _backdrop.parentNode.removeChild(_backdrop);
            _backdrop = null;
            eventHandlers = {};
            // remove from parent's children list
            var anchor = opts.anchor;
            var parentName = anchor && anchor.to && anchor.to.parent;
            if (parentName && win.manager.windows[parentName]) {
                var siblings = win.manager.windows[parentName].options('children');
                var idx = siblings.indexOf(win.name);
                if (idx !== -1) siblings.splice(idx, 1);
            }
        };

        if (!opts.scrollable) this.body.style.overflow = 'hidden';
        else this.body.style.overflowY = 'auto';

        // wire option callbacks to win.on()
        var optionEvents = {
            'onBeforeHide':  'beforehide',
            'onHide':        'hide',
            'onBeforeShow':  'beforeshow',
            'onShow':        'show',
            'onDragStart':   'dragstart',
            'onDrag':        'drag',
            'onDragEnd':     'dragend',
            'onResize':      'resize',
            'onMinimize':    'minimize',
            'onMaximize':    'maximize',
            'onRestore':     'restore'
        };
        Object.keys(optionEvents).forEach(function (key) {
            if (userOpts[key]) win.on(optionEvents[key], userOpts[key]);
        });

        // apply initial state — reset to 0 first so applyState sees the transition
        var initialState = opts.state;
        opts.state = -1;
        applyState(initialState);
    }

    win.json = function () {
        var out = {};
        for (var k in WinJSON) out[k] = opts[k];
        out.manager = opts.manager ? opts.manager.name : false;
        helpers.fakeConstructor("WinJSON", out);
        return out;
    };

    win.serialize = win.toString = function () {
        return toJson(win.json());
    };

    init.call(this);

}


/* File.js */

var FileJSON = {
    drive : false, //false | serialized drive
    mime : false,  //false | MIME type string e.g. "image/png"
    modified : false,
    data : false,  //false | string dataURL | Blob ...when serialized by toJSON() the output is dataURL
    size : false,
    name : false,
    path : false
}


//we should be able to contruct(create) a file:
//-from a native file or blob,
//-or same args as native files are made [parts, name] + options,
//-or we can make it with a drive.file(path)
//-or we can use a serialized warp File (FileJSON format)
//-or we can use a serialized warp File (FileJSON format) but data is already a Blob , so it was already deserialised but its in an object state
function File(parts, name, options) {
    // FileJSON construction — plain object with a name, no .blob() method
    if (parts && typeof parts === "object" && !Array.isArray(parts) && !(parts instanceof Blob) && typeof parts.blob !== "function" && parts.name !== undefined) {
        var json = parts;
        name = json.name;
        if (json.data instanceof Blob) {
            parts = [json.data];
        } else if (typeof json.data === "string" && json.data.indexOf("data:") === 0) {
            // dataURL → Blob
            var comma = json.data.indexOf(",");
            var meta = json.data.slice(0, comma);
            var mimeMatch = meta.match(/:(.*?);/);
            var mimeType = mimeMatch ? mimeMatch[1] : "";
            var bstr = atob(json.data.slice(comma + 1));
            var n = bstr.length;
            var u8 = new Uint8Array(n);
            while (n--) u8[n] = bstr.charCodeAt(n);
            parts = [new Blob([u8], { type: mimeType })];
        } else {
            parts = [];
        }
        options = {
            path: json.path,
            mime: json.mime,
            size: json.size !== false ? json.size : undefined,
            modified: json.modified,
            drive: json.drive,
            data: json.data instanceof Blob ? json.data : (parts.length ? parts[0] : false)
        };
    }

    // native File (inherits from Blob) — wrap it
    if (parts instanceof Blob && parts.name !== undefined) {
        name = parts.name;
        options = { drive: false, mime: parts.type, modified: parts.lastModified, path: name };
        parts = [parts];
    }
    options = options || {};

    var _parts = parts ? [].concat(parts) : [];
    var _bytes = null; // cached Uint8Array, built lazily
    var self = this;

    // warp extensions
    this.drive = 'drive' in options ? options.drive : false;
    this.mime = options.mime || false;
    this.modified = options.modified !== undefined ? options.modified : false;
    this.data = options.data !== undefined ? options.data : false;

    // name <-> path sync
    var _name = name || "";
    var _path = options.path != null ? options.path : _name;

    Object.defineProperties(this, {
        name: {
            get: function () { return _name; },
            set: function (n) {
                if (!n || typeof n !== "string") throw new Error("File name cannot be '" + n + "'");
                _name = n;
                _path = _path.replace(/[^/\\]*$/, n);
            },
            enumerable: true
        },
        path: {
            get: function () { return _path; },
            set: function (p) {
                if (typeof p !== "string") return;
                if (/[\/\\]$/.test(p)) throw new Error("File path cannot end with a directory separator");
                _path = p;
                var m = /[^/\\]+$/.exec(p);
                if (m) _name = m[0];
            },
            enumerable: true
        }
    });

    // compute size synchronously from parts; options.size overrides for stub files
    var _size = 0;
    _parts.forEach(function (part) {
        if (typeof part === "string") {
            _size += new TextEncoder().encode(part).byteLength;
        } else if (part instanceof ArrayBuffer) {
            _size += part.byteLength;
        } else if (ArrayBuffer.isView(part)) {
            _size += part.byteLength;
        } else if (part && typeof part.size === "number") {
            _size += part.size; // Blob or similar
        }
    });
    if (options.size !== undefined) _size = options.size;
    this.size = _size;

    // flatten all parts into a single Uint8Array
    function getBytes() {
        if (_bytes) return Promise.resolve(_bytes);
        var promises = _parts.map(function (part) {
            if (typeof part === "string") {
                return Promise.resolve(new TextEncoder().encode(part));
            } else if (part instanceof ArrayBuffer) {
                return Promise.resolve(new Uint8Array(part));
            } else if (ArrayBuffer.isView(part)) {
                return Promise.resolve(new Uint8Array(part.buffer, part.byteOffset, part.byteLength));
            } else if (part && typeof part.arrayBuffer === "function") {
                return part.arrayBuffer().then(function (ab) { return new Uint8Array(ab); });
            }
            return Promise.resolve(new Uint8Array(0));
        });

        return Promise.all(promises).then(function (arrays) {
            var total = 0;
            arrays.forEach(function (a) { total += a.length; });
            var out = new Uint8Array(total);
            var off = 0;
            arrays.forEach(function (a) { out.set(a, off); off += a.length; });
            _bytes = out;
            return _bytes;
        });
    }

    this.arrayBuffer = function () {
        return getBytes().then(function (b) {
            return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
        });
    };

    this.text = function () {
        return getBytes().then(function (b) {
            return new TextDecoder().decode(b);
        });
    };

    this.blob = function () {
        return getBytes().then(function (b) {
            return new Blob([b], { type: self.mime || "" });
        });
    };

    // escape hatch for browser APIs that require a native File
    this.toNativeFile = function () {
        return new window.File(_parts, self.name, {
            type: self.mime || "",
            lastModified: self.modified instanceof Date ? self.modified.getTime() : Date.now()
        });
    };

    // sync metadata snapshot — no data, safe to call anywhere
    this.json = function () {
        var out = {};
        for (var k in FileJSON) out[k] = self[k] !== undefined ? self[k] : FileJSON[k];
        out.data = false; // json() never includes data — use serialize() for full snapshot
        helpers.fakeConstructor("FileJSON", out);
        return out;
    };

    // full serialization — async, returns FileJSON with data as dataURL
    this.serialize = this.toString = async function () {
        var meta = self.json();
        if (_parts.length === 0) return toJson(meta);
        var blob = await self.blob();
        return new Promise(function (resolve) {
            var reader = new FileReader();
            reader.onloadend = function () {
                meta.data = reader.result;
                resolve(toJson(meta));
            };
            reader.readAsDataURL(blob);
        });
    };

    this.destroy = function () { };
}

//we dont use async interfaces and instance lists for File automaticaly
warp.File = File;

// async interface for File — mirrors the pattern of warp.store() / warp.sandbox()
// retrieval : await warp.file("path/to/file.txt")  → returns open File or undefined
// open+return: await warp.file(fileInstance)        → opens the file and returns it
// from JSON : await warp.file(fileJSON)             → constructs from FileJSON, opens, returns
warp.file = async function (partsOrPath, name, options) {
    // retrieval by path string
    if (typeof partsOrPath === "string" && name === undefined && options === undefined) {
        var files = await warp.store("files");
        var all = await files.get();
        if (!all) return undefined;
        var storeKey = null, entry = null, keys = Object.keys(all);
        for (var i = 0; i < keys.length; i++) {
            if (all[keys[i]].path === partsOrPath) { storeKey = keys[i]; entry = all[storeKey]; break; }
        }
        if (!entry) return undefined;
        var blobs = await warp.store({ name: "blobs" });
        var blob = await blobs.get(fileKey(storeKey));
        return new warp.File(blob ? [blob] : [], entry.name, {
            path: entry.path, mime: entry.mime, size: entry.size, modified: entry.modified, data: blob || false
        });
    }
    // construction from FileJSON plain object (no .blob method, has .name)
    if (partsOrPath && typeof partsOrPath === "object" && !Array.isArray(partsOrPath) && !(partsOrPath instanceof Blob) && typeof partsOrPath.blob !== "function" && partsOrPath.name !== undefined && name === undefined) {
        var file = new warp.File(partsOrPath);
        await warp.open(file);
        return file;
    }
    var file = new warp.File(partsOrPath, name, options);
    await warp.open(file);
    return file;
};

warp.files = async function () {
    var files = await warp.store("files");
    var all = await files.get();
    if (!all) return {};
    var out = {};
    Object.keys(all).forEach(function (storeKey) {
        var entry = all[storeKey];
        var colon = storeKey.indexOf(":");
        var did = storeKey.slice(0, colon);
        if (!out[did]) out[did] = {};
        out[did][entry.path] = new warp.File([], entry.name, {
            path: entry.path, mime: entry.mime, size: entry.size, modified: entry.modified, data: false
        });
    });
    return out;
};

// wraps any string in bracket notation so dottApi treats it as a single literal key
function fileKey(s) {
    return "['" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "']";
}

// returns the drive namespace string for a file:
// "console" if no drive, otherwise "driveName-driveType"
function driveId(file) {
    return file.drive ? file.drive.name + "-" + file.drive.type : "console";
}

// flat store key combining drive namespace and file path: "console:readme.txt"
function fileStoreKey(file) {
    return fileKey(driveId(file) + ":" + file.path);
}

//opens a file in warp — accepts warp.File or native File (Blob with .name); bare Blobs are rejected
warp.open = async function (file) {
    if (file instanceof Blob) {
        if (file.name === undefined) throw new Error("warp.open() requires a warp.File or native File, not a bare Blob");
        file = new warp.File(file);
    }
    if (warp.trigger("beforeFileOpen", file).cancelled) return;
    var blob = await file.blob();
    var files = await warp.store("files");
    var blobs = await warp.store({ name: "blobs" });
    var fkey = fileStoreKey(file);
    await files.set(fkey, { name: file.name, path: file.path, mime: file.mime, size: file.size, modified: file.modified, data: true });
    await blobs.set(fkey, blob);
    warp.trigger("fileOpen", file);
};

//removes from list of files
warp.close = async function (file) {
    if (warp.trigger("beforeFileClose", file).cancelled) return;
    var files = await warp.store("files");
    var blobs = await warp.store({ name: "blobs" });
    var fkey = fileStoreKey(file);
    await files.delete(fkey);
    await blobs.delete(fkey);
    warp.trigger("fileClose", file);
};

// writes file content back to file.drive and syncs the blobs Store
warp.save = async function (file) {
    if (!file.drive) return;
    var blob = await file.blob();
    await file.drive.write(file.path, blob);
    var blobs = await warp.store({ name: "blobs" });
    await blobs.set(fileStoreKey(file), blob);
};

//uses fileTypes commit function to "execute" content
warp.commit = async function (file) {
    var ft = await helpers.getFileTypeForFile(file);
    if (!ft) throw new Error("No FileType found for '" + file.name + "'");
    if (typeof ft.commit !== "function") throw new Error("FileType '" + (ft.name || "unknown") + "' does not have a commit function");
    return ft.commit(file);
};




/* Store.js */
var StoreJSON = {
    name: false,
    type: "object",   // "object" or "array" — root data structure type
    debug: false,
    client: false,
    clients: false,   // false = open to all; array = whitelist of allowed client ids
    onWorkerChange: false,   // optional worker-side callback: function(key, value, client) — runs inside the SharedWorker on every mutation
    beforeWorkerEnd: false,  // optional worker-side callback: function(data) — runs when last tab disconnects, last chance to persist
    // frontend events — bound via store.on(event, handler)
    onReady: false,      // worker created a fresh store
    onConnect: false,    // connected to an already-existing store
    onCreate: false,     // function(key, value, client) — a key is set for the first time
    onUpdate: false,     // function(key, value, client) — an existing key's value changed
    onDelete: false,     // function(key, value, client) — a key was deleted
    onChange: false,      // function(key, value, client) — any mutation (create, update, delete)
    onError: false,      // function(errorMessage) — ACL rejection or creation failure
    // key-scoped events — bound via store.on(event, key, handler)
    onKeyCreate: false,  // function(value, client) — a specific key is set for the first time
    onKeyUpdate: false,  // function(value, client) — a specific key's value changed
    onKeyDelete: false,  // function(value, client) — a specific key was deleted
    onKeyChange: false   // function(value, client) — any mutation on a specific key
};

function Store(options) {

    options = helpers.setupOptionsAndInstance(options, this);
    var store = this;
    store.worker = null;
    var workerURL = engineOptions.storeWorker;
    options.name = options.name || "store" + rand();
    options.client = options.client || warp.id;

    // if already connected locally, return that instance instead of creating a duplicate
    if (lists.instances.stores[options.name]) {
        return lists.instances.stores[options.name];
    }
    lists.instances.stores[options.name] = store;

    // private state
    var port, msgId = 0;
    var wait = new Map(); // id -> { resolve, reject }
    var ready = false;
    var createError = null;
    var queue = [];        // fns queued before worker confirms creation
    var queueRejects = []; // parallel: reject fns for each queued promise
    var listeners = {};
    var STORE_EVENTS = ["ready", "connect", "error", "create", "update", "delete", "change", "keyCreate", "keyUpdate", "keyDelete", "keyChange"];
    var KEY_EVENTS = new Set(["keyCreate", "keyUpdate", "keyDelete", "keyChange"]);
    var keyListeners = {}; // { event: { key: [handlers] } }

    function encodeForStore(value) {
        if (value === null || value === undefined) return value;
        if (typeof value === 'function') return '@function:' + value.toString();
        if (Array.isArray(value)) return value.map(encodeForStore);
        // handle plain objects AND faked-constructor objects from setupOptionsAndInstance
        // (e.g. SearchJSON, FileTypeJSON — their constructor.name ends with "JSON").
        // Blob, Date, ArrayBuffer, TypedArray, Map, Set etc. have other constructors and pass through untouched.
        if (value.constructor === Object || (value.constructor && value.constructor.name && value.constructor.name.endsWith('JSON'))) {
            var out = {};
            for (var k in value) if (Object.prototype.hasOwnProperty.call(value, k)) out[k] = encodeForStore(value[k]);
            return out;
        }
        return value; // Blob, Date, ArrayBuffer, TypedArray, Map, Set, etc. — pass through untouched
    }

    function decodeFromStore(value) {
        if (value === null || value === undefined) return value;
        if (typeof value === 'string' && value.startsWith('@function:')) {
            return eval('(' + value.substring(10) + ')');
        }
        if (Array.isArray(value)) return value.map(decodeFromStore);
        if (value.constructor === Object) {
            var out = {};
            for (var k in value) if (Object.prototype.hasOwnProperty.call(value, k)) out[k] = decodeFromStore(value[k]);
            return out;
        }
        return value;
    }

    store.on = function (event, keyOrFn, fn) {
        if (!STORE_EVENTS.includes(event)) throw new Error("Store: unknown event '" + event + "'. Valid events: " + STORE_EVENTS.join(", "));
        if (KEY_EVENTS.has(event)) {
            if (!keyListeners[event]) keyListeners[event] = {};
            if (!keyListeners[event][keyOrFn]) keyListeners[event][keyOrFn] = [];
            keyListeners[event][keyOrFn].push(fn);
        } else {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(keyOrFn);
        }
        return store;
    };

    store.off = function (event, keyOrFn, fn) {
        if (KEY_EVENTS.has(event)) {
            if (!keyListeners[event] || !keyListeners[event][keyOrFn]) return store;
            keyListeners[event][keyOrFn] = keyListeners[event][keyOrFn].filter(function (f) { return f !== fn; });
        } else {
            if (!listeners[event]) return store;
            listeners[event] = listeners[event].filter(function (f) { return f !== keyOrFn; });
        }
        return store;
    };

    function emit(event) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (listeners[event]) listeners[event].forEach(function (fn) { fn.apply(null, args); });
    }

    function emitKey(event, key, value, client) {
        if (!keyListeners[event] || !keyListeners[event][key]) return;
        keyListeners[event][key].forEach(function (fn) { fn.call(null, value, client); });
    }

    function initWorker() {
        if (port) return;
        store.worker = new SharedWorker(workerURL);
        port = store.worker.port;
        port.start();
        port.onmessage = function (e) {
            var msg = e.data;

            if (msg.event) {
                if (msg.event === "log") {
                   if(options.debug) log("[Store]", ...msg.data);
                    return;
                }
                var val = decodeFromStore(msg.data.value);
                if (msg.event === "changed") {
                    emit("update", msg.data.key, val, msg.data.client);
                    emit("change", msg.data.key, val, msg.data.client);
                    emitKey("keyUpdate", msg.data.key, val, msg.data.client);
                    emitKey("keyChange", msg.data.key, val, msg.data.client);
                } else if (msg.event === "created") {
                    emit("create", msg.data.key, val, msg.data.client);
                    emit("change", msg.data.key, val, msg.data.client);
                    emitKey("keyCreate", msg.data.key, val, msg.data.client);
                    emitKey("keyChange", msg.data.key, val, msg.data.client);
                } else if (msg.event === "deleted") {
                    emit("delete", msg.data.key, val, msg.data.client);
                    emit("change", msg.data.key, val, msg.data.client);
                    emitKey("keyDelete", msg.data.key, val, msg.data.client);
                    emitKey("keyChange", msg.data.key, val, msg.data.client);
                }
                return;
            }

            var entry = wait.get(msg.id);
            if (!entry) {
                console.error("Store: missing resolver for message id", msg.id, msg);
                return;
            }
            wait.delete(msg.id);

            if (msg.error !== undefined) {
                entry.reject(msg.error);
            } else {
                entry.resolve(msg.data);
            }
        };
    }

    function post(method, args) {
        if (createError) return Promise.reject(createError);
        if (!port) initWorker();
        return new Promise(function (resolve, reject) {
            var id = ++msgId;
            wait.set(id, { resolve, reject });
            port.postMessage({ id, method, args, client: options.client });
        });
    }

    function enqueue(fn) {
        return new Promise(function (resolve, reject) {
            queue.push(function () { fn().then(resolve).catch(reject); });
            queueRejects.push(reject);
        });
    }

    // auto-initialize the store in the worker on construction
    var onWorkerChangeSrc = typeof options.onWorkerChange === "function" ? toJson(options.onWorkerChange) : null;
    var beforeWorkerEndSrc = typeof options.beforeWorkerEnd === "function" ? toJson(options.beforeWorkerEnd) : null;
    post("create", [options.name, options.type || "object", options.clients, onWorkerChangeSrc, beforeWorkerEndSrc]).then(function (result) {
        ready = true;
        if (result.created) emit("ready");
        else emit("connect");
        queue.forEach(function (fn) { fn(); });
        queue.length = 0;
        queueRejects.length = 0;
    }).catch(function (err) {
        createError = err;
        queueRejects.forEach(function (rej) { rej(err); });
        queue.length = 0;
        queueRejects.length = 0;
        emit("error", err);
    });

    store.set = function (key, value) {
        if (arguments.length < 2) throw new Error("Store.set requires a key and value. Use store.setRoot(data) to replace root.");
        value = encodeForStore(value);
        if (!ready) return enqueue(function () { return post("set", [options.name, key, value]); });
        return post("set", [options.name, key, value]);
    };

    store.setRoot = function (data) {
        data = encodeForStore(data);
        if (!ready) return enqueue(function () { return post("setRoot", [options.name, data]); });
        return post("setRoot", [options.name, data]);
    };

    // key is optional — omit to return the whole store as a plain object
    store.get = function (key) {
        var p = !ready ? enqueue(function () { return post("get", [options.name, key]); }) : post("get", [options.name, key]);
        return p.then(decodeFromStore);
    };

    // removes a key from an object, or splices an element from an array root by numeric index
    store.delete = function (key) {
        if (!ready) return enqueue(function () { return post("delete", [options.name, key]); });
        return post("delete", [options.name, key]);
    };

    // appends value to array (push) or object (key = keys.length) at path
    store.append = function (key, value) {
        if (arguments.length === 1) { value = key; key = null; }
        value = encodeForStore(value);
        if (!ready) return enqueue(function () { return post("append", [options.name, key, value]); });
        return post("append", [options.name, key, value]);
    };

    // prepends value to array (unshift) or object (key = keys.length, placed first) at path
    store.prepend = function (key, value) {
        if (arguments.length === 1) { value = key; key = null; }
        value = encodeForStore(value);
        if (!ready) return enqueue(function () { return post("prepend", [options.name, key, value]); });
        return post("prepend", [options.name, key, value]);
    };

    // finds the index/key of value inside the array or object at key
    store.indexOf = function (key, value) {
        if (arguments.length === 1) { value = key; key = null; }
        if (!ready) return enqueue(function () { return post("indexOf", [options.name, key, value]); });
        return post("indexOf", [options.name, key, value]);
    };

    // returns JSON string of the value at key (or the whole store if no key)
    store.dump = async function (key) {
        var val = await store.get(key);
        return toJson(val);
    };

    store.destroy = function () {
        window.removeEventListener("beforeunload", onUnload);
        delete lists.instances.stores[options.name];
        if (port) {
            port.postMessage({ method: "disconnect", args: [options.name], client: options.client });
            port.close();
            port = null;
        }
    };

    store.json = function () {
        var out = {};
        for (var k in StoreJSON) out[k] = options[k];
        helpers.fakeConstructor("StoreJSON", out);
        return out;
    };

    store.serialize = store.toString = function () {
        return toJson(store.json());
    };

    function onUnload() { store.destroy(); }
    window.addEventListener("beforeunload", onUnload);

}


/* Sandbox.js */
var SandboxJSON = {
    name: false,
    code: false,
    exposed: [],       
    hidden: [],
    beforeInit: function () { },
    onError: function (err) { console.error(err); },
    onConsole: function (...a) { console.log("[Sandbox]", ...a) }
};
function Sandbox(options) {

    options = helpers.setupOptionsAndInstance(options, this);
    options.name = options.name || "sandbox" + rand();

    // Persistent context (environment memory)
    // Object.create(null) avoids prototype chain pollution:
    // with(context) + "var constructor = undefined" would otherwise write to context via HasProperty
    var context = Object.create(null);

    // Populate exposed objects into context
    for (const obj of options.exposed) {
        if (obj && typeof obj === 'object') {
            const name = obj.__name || obj.name || undefined;
            if (name) context[name] = obj;
        }
    }

    // List of common globals to blacklist
    var blockedGlobals = [
        "warp", "window", "document", "self", "globalThis",
        "frames", "parent", "top",
        "XMLHttpRequest", "fetch",
        "Promise", "Date", "Math", "Function", // Block Function constructor
        "setTimeout", "setInterval", "requestAnimationFrame"
    ];

    // Block any function creation via constructor.constructor escape
    blockedGlobals.push("constructor");

    // Build code initializer that undefines globals
    const hideCode = blockedGlobals
        .map(v => `var ${v} = undefined;`)
        .join("\n");

    // This is the safe sandboxing step that now prevents escapes via constructor
    this.eval = function (code) {
        try {
            const exec = new Function(
                "context",
                `
                return (function(){
                    with (context) {
                        ${hideCode}
                        return (function(){
                            ${code}
                        }).call(context);
                    }
                })();
                `
            );
            const result = exec(context);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    };

    this.get = function (varName) {
        return this.eval("return " + varName);
    };

    this.destroy = function () {
        context = null;
        this.eval = function () { throw new Error("Sandbox has been destroyed."); };
    };

    var sb = this;

    sb.json = function () {
        var out = {};
        for (var k in SandboxJSON) out[k] = options[k];
        helpers.fakeConstructor("SandboxJSON", out);
        return out;
    };

    sb.serialize = sb.toString = function () {
        return toJson(sb.json());
    };
}

//alias, we can use both, as Sandbox or as Context
var Context = Sandbox;
var ContextJSON = SandboxJSON;
warp.Context = Sandbox;
warp.context = function(opts){  
   return warp.sandbox(opts);
}


/* Drive.js */
// lists.instances.drives — "type:key" → instance
// Guarantees that Drive("object", { name: "foo" }) called twice returns the same JS object.

// =========================================================================
// driveHelpers — shared utilities used by all drive types
// =========================================================================
var driveHelpers = {

    requirePath: function (path) {
        if (typeof path !== "string" || !path) throw new Error("Drive: path must be a non-empty string, got " + (path === undefined ? "undefined" : JSON.stringify(path)));
    },

    toBlob: function (data) {
        if (data instanceof Blob) return data;
        if (typeof data === "string") return new Blob([data], { type: "text/plain" });
        if (data instanceof ArrayBuffer ||
            ArrayBuffer.isView(data)) return new Blob([data], { type: "application/octet-stream" });
        return new Blob([String(data)], { type: "text/plain" });
    },

    readAs: async function (val, format) {
        if (val === undefined || val === null) {
            if (format === "blob") return new Blob([]);
            if (format === "arraybuffer") return new ArrayBuffer(0);
            return undefined;
        }
        var blob = val instanceof Blob ? val : driveHelpers.toBlob(val);
        if (format === "blob") return blob;
        if (format === "arraybuffer") return blob.arrayBuffer();
        return blob.text();
    },

    scanTransform: function (node, depth) {
        if (node instanceof Blob) return node.size;
        if (typeof node === "number") return node;
        if (typeof node === "string") return new TextEncoder().encode(node).byteLength;
        if (node instanceof ArrayBuffer) return node.byteLength;
        if (ArrayBuffer.isView(node)) return node.byteLength;
        if (node && typeof node === "object") {
            if (depth === 0) return true;
            var next = depth !== undefined ? depth - 1 : undefined;
            var out = {};
            Object.keys(node).forEach(function (k) { out[k] = driveHelpers.scanTransform(node[k], next); });
            return out;
        }
        return 0;
    },

    clone: function (val) {
        if (val === null || val === undefined) return val;
        if (val instanceof Blob) return val;
        if (val instanceof ArrayBuffer) return val.slice();
        if (ArrayBuffer.isView(val)) return new Uint8Array(val.buffer.slice(val.byteOffset, val.byteOffset + val.byteLength));
        if (typeof val === "object") {
            var out = {};
            Object.keys(val).forEach(function (k) { out[k] = driveHelpers.clone(val[k]); });
            return out;
        }
        return val;
    },

    deletePath: function (obj, path) {
        driveHelpers.requirePath(path);
        var parts = path.split("/").filter(Boolean);
        var last = parts.pop();
        var parent = parts.length ? helpers.slashApi(obj, parts.join("/")) : obj;
        if (parent && typeof parent === "object") delete parent[last];
    },

    cacheKey: function (prefix, path) {
        return "['" + prefix + ":" + (path || "") + "']";
    },

    bracketToSlash: function (key) {
        if (!key) return "";
        return key.replace(/^\['|'\]$/g, "").replace(/'\]\['/g, "/");
    },

    // Convert a slash path to Store bracket notation so dottApi treats each
    // segment as a literal key. Dots and other special chars in file names
    // won't be misinterpreted as path separators.
    // "docs/readme.txt" → "['docs']['readme.txt']"
    storeKey: function (path) {
        driveHelpers.requirePath(path);
        return path.split("/").filter(Boolean)
            .map(function (s) { return "['" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "']"; })
            .join("");
    }
};

// =========================================================================
// ObjectDrive — in-memory scope + Store sync for cross-tab sharing
//
// Every drive has a local scope object (fast reads) backed by a Store
// (cross-tab sync via SharedWorker). Writes update both. On connect,
// if the Store already has data (from another tab), it wins over the seed.
// =========================================================================
function ObjectDrive(type, name, options) {
    this.type = type;
    this.name = name;
    options = options || {};

    var drive = this;
    var scope = options.scope ? driveHelpers.clone(options.scope) : {};
    var storeName = "Drive-scope-" + name;
    var _store = null;
    var _synced = false;

    var getStore = async function () {
        if (_synced) return _store;
        if (!_store) _store = await warp.store({ name: storeName });
        if (!_synced) {
            _synced = true;
            var existing = await _store.get();
            if (existing && typeof existing === "object" && Object.keys(existing).length) {
                // Store has data from another tab — adopt it
                Object.keys(scope).forEach(function (k) { delete scope[k]; });
                Object.assign(scope, existing);
            } else if (Object.keys(scope).length) {
                // No Store data — push our seed
                await _store.setRoot(driveHelpers.clone(scope));
            }
            _store.on("create", onRemoteChange);
            _store.on("update", onRemoteChange);
            _store.on("delete", onRemoteDelete);
        }
        return _store;
    };

    function onRemoteChange(key, value) {
        if (!key) return;
        var path = driveHelpers.bracketToSlash(key);
        if (!path) return;
        try { helpers.slashApi(scope, path, value); } catch (_) {}
    }

    function onRemoteDelete(key) {
        if (!key) return;
        var path = driveHelpers.bracketToSlash(key);
        if (!path) return;
        try { driveHelpers.deletePath(scope, path); } catch (_) {}
    }

    drive.scope = function () { return scope; };
    drive._getStore = getStore;

    drive.scan = async function (path, depth) {
        await getStore();
        if (!path || path === "/") return driveHelpers.scanTransform(scope, depth);
        try {
            return driveHelpers.scanTransform(helpers.slashApi(scope, path), depth);
        } catch (_) {
            return {};
        }
    };

    drive.read = async function (path, readAs) {
        await getStore();
        return driveHelpers.readAs(helpers.slashApi(scope, path), readAs);
    };

    drive.write = async function (path, data) {
        helpers.slashApi(scope, path, data);
        var s = await getStore();
        await s.set(driveHelpers.storeKey(path), data);
        return true;
    };

    drive.create = async function (path) {
        driveHelpers.requirePath(path);
        try { if (helpers.slashApi(scope, path) !== undefined) return true; } catch (_) {}
        var last = path.split("/").filter(Boolean).pop();
        var val = last.includes(".") ? "" : {};
        helpers.slashApi(scope, path, val);
        var s = await getStore();
        await s.set(driveHelpers.storeKey(path), val);
        return true;
    };

    drive.delete = async function (path) {
        driveHelpers.deletePath(scope, path);
        var s = await getStore();
        await s.delete(driveHelpers.storeKey(path));
        return true;
    };

    drive.rename = async function (path, to) {
        var data = helpers.slashApi(scope, path);
        driveHelpers.deletePath(scope, path);
        helpers.slashApi(scope, to, data);
        var s = await getStore();
        await s.delete(driveHelpers.storeKey(path));
        await s.set(driveHelpers.storeKey(to), data);
        return true;
    };

    drive.copy = async function (path, to) {
        var data = driveHelpers.clone(helpers.slashApi(scope, path));
        helpers.slashApi(scope, to, data);
        var s = await getStore();
        await s.set(driveHelpers.storeKey(to), data);
        return true;
    };

    drive.json = function () {
        return { type: type, options: { name: name, scope: driveHelpers.clone(scope) } };
    };

    drive.serialize = drive.toString = function () {
        return warp.to.json(drive.json());
    };
}

ObjectDrive.prototype.auth = async function () { return true; };
ObjectDrive.prototype.move = function (path, to) { return this.rename(path, to); };
ObjectDrive.prototype.file = async function (path) {
    var blob = await this.read(path, "blob");
    var name = path.split("/").filter(Boolean).pop();
    return new warp.File([blob], name, { path: path, type: blob.type, drive: this, data: blob });
};

// =========================================================================
// StoreDrive — Store-only, no local scope object.
//
// All operations go directly through the Store. No in-memory cache.
// Cross-tab sync is inherent — the Store IS the shared state.
// =========================================================================
function StoreDrive(options) {
    this.type = "store";
    this.name = options.name;

    var drive = this;
    var storeName = "Drive-scope-" + options.name;
    var _store = null;

    var getStore = async function () {
        if (!_store) _store = await warp.store({ name: storeName });
        return _store;
    };

    var safeGet = async function (key) {
        var s = await getStore();
        try { return await s.get(key); } catch (_) { return undefined; }
    };

    drive.scope = async function () {
        var s = await getStore();
        return await s.get() || {};
    };

    drive.scan = async function (path, depth) {
        var s = await getStore();
        var node = (!path || path === "/")
            ? await s.get()
            : await safeGet(driveHelpers.storeKey(path));
        return driveHelpers.scanTransform(node || {}, depth);
    };

    drive.read = async function (path, readAs) {
        return driveHelpers.readAs(await safeGet(driveHelpers.storeKey(path)), readAs);
    };

    drive.write = async function (path, data) {
        var s = await getStore();
        await s.set(driveHelpers.storeKey(path), data);
        return true;
    };

    drive.create = async function (path) {
        driveHelpers.requirePath(path);
        var existing = await safeGet(driveHelpers.storeKey(path));
        if (existing !== undefined) return true;
        var s = await getStore();
        var last = path.split("/").filter(Boolean).pop();
        await s.set(driveHelpers.storeKey(path), last.includes(".") ? "" : {});
        return true;
    };

    drive.delete = async function (path) {
        var s = await getStore();
        await s.delete(driveHelpers.storeKey(path));
        return true;
    };

    drive.rename = async function (path, to) {
        var s = await getStore();
        var data = await safeGet(driveHelpers.storeKey(path));
        await s.delete(driveHelpers.storeKey(path));
        await s.set(driveHelpers.storeKey(to), data);
        return true;
    };

    drive.copy = async function (path, to) {
        var s = await getStore();
        var data = await safeGet(driveHelpers.storeKey(path));
        await s.set(driveHelpers.storeKey(to), driveHelpers.clone(data));
        return true;
    };

    drive.json = function () {
        return { type: "store", options: { name: options.name } };
    };

    drive.serialize = drive.toString = function () {
        return warp.to.json(drive.json());
    };
}
StoreDrive.prototype = Object.create(ObjectDrive.prototype);
StoreDrive.prototype.constructor = StoreDrive;

// =========================================================================
// HttpDrive — compatible with Drive.php  (FormData POST + Bearer token)
//
// Extends ObjectDrive: the scope acts as a shared cache across tabs.
// Server scan results (sizes) go into scope. read() fetches actual data
// from the server when the scope only has a size (number).
// Mutations hit the server first, then update scope.
// =========================================================================
var HttpDriveJSON = {
    name: false,
    url: false,
    debug: false
};

function HttpDrive(options) {
    ObjectDrive.call(this, "http", options.name, options);

    var drive = this;
    var scope = drive.scope();
    var getStore = drive._getStore;
    var token = null;
    var url = options.url;

    // Live arrays for upload/download progress tracking.
    var uploads = [];
    var downloads = [];
    drive.uploads = uploads;
    drive.downloads = downloads;

    var post = function (method, args, responseType) {
        if (!responseType) responseType = "text";
        var fd = new FormData();
        fd.append("method", method);
        fd.append("token", token || "");
        if (method === "auth") {
            fd.append("username", args[0]);
            fd.append("password", args[1]);
        } else if (method === "write") {
            fd.append("path", args[0]);
            fd.append("blob", driveHelpers.toBlob(args[1]));
        } else if (method === "rename" || method === "move" ||
            method === "copy" || method === "unzip") {
            fd.append("path", args[0]);
            fd.append("pathTo", args[1]);
        } else if (args && args[0] !== undefined) {
            fd.append("path", args[0]);
        }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = responseType;
            xhr.progress = { loaded: 0, total: 0, percent: 0 };

            if (method === "read") {
                downloads.push(xhr);
                xhr.addEventListener("progress", function (evt) {
                    if (!evt.lengthComputable) return;
                    xhr.progress = { loaded: evt.loaded, total: evt.total, percent: Math.round(evt.loaded / evt.total * 100) };
                });
            } else if (method === "write") {
                uploads.push(xhr);
                xhr.upload.addEventListener("progress", function (evt) {
                    if (!evt.lengthComputable) return;
                    xhr.progress = { loaded: evt.loaded, total: evt.total, percent: Math.round(evt.loaded / evt.total * 100) };
                });
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                var idx;
                idx = downloads.indexOf(xhr); if (idx !== -1) downloads.splice(idx, 1);
                idx = uploads.indexOf(xhr); if (idx !== -1) uploads.splice(idx, 1);
                if (xhr.status !== 200) {
                    var body = xhr.responseType === "arraybuffer"
                        ? new TextDecoder().decode(xhr.response)
                        : xhr.responseText;
                    return reject(new Error("Drive." + method + " " + xhr.status + ": " + body));
                }
                resolve(xhr);
            };
            xhr.open("POST", url);
            if (token) xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.send(fd);
        });
    };

    var json = function (xhr) { return JSON.parse(xhr.responseText); };

    // Invalidate a path in the scope (delete the entry + parent becomes stale).
    var invalidate = async function (path) {
        try { driveHelpers.deletePath(scope, path); } catch (_) {}
        var s = await getStore();
        try { await s.delete(driveHelpers.storeKey(path)); } catch (_) {}
    };

    drive.auth = async function (user, pass) {
        var x = await post("auth", [user, pass], "text");
        token = json(x);
        return token;
    };

    // Scope-first: if we have cached data, return it. Otherwise hit server
    // and store the result in scope for cross-tab sharing.
    drive.scan = async function (path, depth) {
        await getStore();
        var node;
        try {
            node = (!path || path === "/") ? scope : helpers.slashApi(scope, path);
        } catch (_) { node = undefined; }

        // If scope has an object at this path, serve from cache
        if (node !== undefined && typeof node === "object" && Object.keys(node).length) {
            return driveHelpers.scanTransform(node, depth);
        }

        // Fetch from server
        var x = await post("scan", [path || ""], "text");
        var result = json(x);

        // Merge into scope
        if (!path || path === "/") {
            Object.keys(result).forEach(function (k) {
                if (!(k in scope)) scope[k] = result[k];
            });
        } else {
            helpers.slashApi(scope, path, result);
        }

        // Sync to Store
        var s = await getStore();
        if (!path || path === "/") {
            await s.setRoot(driveHelpers.clone(scope));
        } else {
            await s.set(driveHelpers.storeKey(path), result);
        }

        return driveHelpers.scanTransform(result, depth);
    };

    // If scope has actual data (not a number/size from scan), return it.
    // Otherwise fetch from server and cache in scope.
    drive.read = async function (path, readAs) {
        await getStore();
        var val;
        try { val = helpers.slashApi(scope, path); } catch (_) { val = undefined; }

        // Numbers in scope are sizes from scan — not actual data
        if (val !== undefined && val !== null && typeof val !== "number") {
            return driveHelpers.readAs(val, readAs);
        }

        // Fetch from server
        var x = await post("read", [path], "blob");
        var blob = x.response;
        helpers.slashApi(scope, path, blob);
        var s = await getStore();
        await s.set(driveHelpers.storeKey(path), blob);
        return driveHelpers.readAs(blob, readAs);
    };

    drive.write = async function (path, data) {
        await invalidate(path);
        var result = json(await post("write", [path, data], "text"));
        // Cache the written data in scope as a blob
        var blob = driveHelpers.toBlob(data);
        helpers.slashApi(scope, path, blob);
        var s = await getStore();
        await s.set(driveHelpers.storeKey(path), blob);
        return result;
    };

    drive.create = async function (path) { await invalidate(path); return json(await post("create", [path], "text")); };
    drive.delete = async function (path) { await invalidate(path); return json(await post("delete", [path], "text")); };
    drive.rename = async function (path, to) { await Promise.all([invalidate(path), invalidate(to)]); return json(await post("rename", [path, to], "text")); };
    drive.move = async function (path, to) { await Promise.all([invalidate(path), invalidate(to)]); return json(await post("move", [path, to], "text")); };
    drive.copy = async function (path, to) { await invalidate(to); return json(await post("copy", [path, to], "text")); };
    drive.info = async function (path) { return json(await post("info", [path], "text")); };
    drive.unzip = async function (path, to) { await invalidate(to); return json(await post("unzip", [path, to], "text")); };

    drive.json = function () {
        return { type: "http", options: { name: options.name, url: url } };
    };

    drive.serialize = drive.toString = function () {
        return warp.to.json(drive.json());
    };
}
HttpDrive.prototype = Object.create(ObjectDrive.prototype);
HttpDrive.prototype.constructor = HttpDrive;

// =========================================================================
// Drive — factory + instance registry
//
//   new warp.Drive("object", { scope: {} })               ← two-arg
//   new warp.Drive({ type: "object", name: "x", … })      ← flat one-arg
//   new warp.Drive({ type: "object", options: { … } })    ← serialised (toJSON) form
//
// "object" and "store" both create an ObjectDrive (same behavior —
// in-memory scope backed by a Store for cross-tab sync).
// "http" creates an HttpDrive (server communication + scope cache).
// =========================================================================
var DriveJSON = {
    type: "object"   // "object" | "store" | "http"
};

function Drive(typeOrOptions, options) {
    if (typeof typeOrOptions === "string") {
        options = Object.assign({}, options || {});
        options.type = typeOrOptions;
    } else if (typeOrOptions && typeOrOptions.options) {
        options = Object.assign({}, typeOrOptions.options);
        options.type = typeOrOptions.type;
    } else {
        options = Object.assign({}, typeOrOptions || {});
    }

    if (!options.name) options.name = "drive-" + rand();

    var type = (options.type || "object").toLowerCase();

    var registryKey = type + ":" + options.name;

    var existing = lists.instances.drives[registryKey];
    if (existing) return existing;

    var DriveConstructor = lists.driveTypes[type];
    if (!DriveConstructor) throw new Error("Drive: unknown type '" + type + "'");
    var instance = type === "object"
        ? new DriveConstructor(type, options.name, options)
        : new DriveConstructor(options);

    lists.instances.drives[registryKey] = instance;
    return instance;
}

lists.driveTypes["object"] = ObjectDrive;

lists.driveTypes["store"] = StoreDrive;

lists.driveTypes["http"] = HttpDrive;


// =========================================================================
// warp.Drive  — the synchronous factory
// warp.drive  — async wrapper: creates via factory OR retrieves by name
// =========================================================================
warp.Drive = Drive;

warp.drive = async function (nameOrOptions) {
    if (typeof nameOrOptions === "string") {
        for (var key in lists.instances.drives) {
            if (lists.instances.drives[key].name === nameOrOptions) return lists.instances.drives[key];
        }
        return undefined;
    }
    return new Drive(nameOrOptions);
};


/* Layout.js */
var LayoutJSON = {
    name: false,
    image : false,//1024x1024 so we can scale it for publishing as we want?
    version: 1,
    icon: "cabinet",
    desc : false,
    deps: [],
    apps: {},
    brands: {},
    defaultWin : false, //false | WinJSON - passed to layouts manager as defaultWin
    fileTypes: {},
    searches : {},
    onBeforeLoad :false, //boolean or function
    onLoad :false, //boolean or function
    onBeforeDestroy :false //boolean or function
};

helpers.registerEvents([
    "beforeLayoutLoad",
    "layoutLoad",
    "beforeLayoutUnload",
    "layoutUnload",
    "layoutChanged"
]);

function Layout(layoutJSON) {

    layoutJSON = helpers.setupOptionsAndInstance(layoutJSON, this);

    const layout = this;

    layoutJSON.name = layoutJSON.name || "layout" + rand();

    if (lists.instances.layouts[layoutJSON.name]) {
        throw new Error("Layout '" + layoutJSON.name + "' already exists. Use await \'warp.layout('" + layoutJSON.name + "')\' to retrieve it.");
    }

    // ── instance event system (mirrors Win.on/off pattern) ───────────
    var _eventHandlers = {};

    layout.on = function (event, fn) {
        if (!_eventHandlers[event]) _eventHandlers[event] = [];
        _eventHandlers[event].push(fn);
    };

    layout.off = function (event, fn) {
        if (!_eventHandlers[event]) return;
        _eventHandlers[event] = _eventHandlers[event].filter(function (f) { return f !== fn; });
    };

    layout._trigger = function (event, data) {
        var e = { type: event, layout: layout, data: data, cancelled: false, cancel: function () { this.cancelled = true; } };
        var handlers = _eventHandlers[event];
        if (handlers) handlers.forEach(function (fn) { fn(e); });
        return e;
    };

    layout._ready = warp.store("layouts").then(async function (s) {
        warp.trigger("beforeLayoutLoad", layout);
        if(!await s.get(layoutJSON.name)) {
            await s.set(layoutJSON.name, layoutJSON);
            lists.loadedLayoutNames.push(layoutJSON.name);
        }
        var m = await warp.gui.manager({ name: "layout-" + layoutJSON.name, defaultWin : layoutJSON.defaultWin });
        m.el.classList.add("layout-" + layoutJSON.name);
        lists.instances.layouts[layoutJSON.name] = layout;
        warp.trigger("layoutLoad", layout);
        // TODO: serialize to localStorage on layoutLoad so next cold start skips fetch
        // localStorage.setItem("warp.layout." + layoutJSON.name, layout.serialize());
    });

    // TODO: also serialize to localStorage on layoutChanged (apps added/removed, brands changed, etc.)
    // so the cached version stays current between page reloads

    // collection type → instance event name
    var _collectionEvents = { apps: "appChanged", brands: "brandChanged", fileTypes: "fileTypeChanged", searches: "searchChanged" };

    // debounced layoutChanged — collapses rapid mutations (e.g. warp.load adding many apps) into one event
    var _changedTimer = 0;
    function changed(collection, action, name) {
        if (collection && _collectionEvents[collection]) {
            layout._trigger(_collectionEvents[collection], { action: action, name: name });
        }
        layout._trigger("changed", { collection: collection, action: action, name: name });
        clearTimeout(_changedTimer);
        _changedTimer = setTimeout(function () { warp.trigger("layoutChanged", layout, layoutJSON.name); }, 0);
    }

    layout.app = async function (nameOrObj) {
        if (nameOrObj === undefined) return layoutJSON.apps;
        if (typeof nameOrObj === "object") { nameOrObj.layout = layoutJSON.name; layoutJSON.apps[nameOrObj.name] = nameOrObj; changed("apps", "add", nameOrObj.name); return nameOrObj; }
        return layoutJSON.apps[nameOrObj];
    };

    layout.brand = async function (nameOrObj) {
        if (nameOrObj === undefined) {
            var out = {};
            for (var k in layoutJSON.brands) {
                var ck = layoutJSON.name + "." + k;
                out[k] = lists.instances.brands[ck] || (lists.instances.brands[ck] = new Brand(layoutJSON.brands[k]));
            }
            return out;
        }
        if (typeof nameOrObj === "object") {
            nameOrObj.layout = layoutJSON.name;
            layoutJSON.brands[nameOrObj.name] = nameOrObj;
            var br = new Brand(nameOrObj);
            lists.instances.brands[layoutJSON.name + "." + nameOrObj.name] = br;
            var s = await warp.store("layouts");
            if (s) await s.set(layoutJSON.name + ".brands." + nameOrObj.name, nameOrObj);
            changed("brands", "add", nameOrObj.name); return br;
        }
        if (layoutJSON.brands[nameOrObj]) {
            var ck = layoutJSON.name + "." + nameOrObj;
            return lists.instances.brands[ck] || (lists.instances.brands[ck] = new Brand(layoutJSON.brands[nameOrObj]));
        }
        return undefined;
    };

    layout.fileType = async function (nameOrObj) {
        if (nameOrObj === undefined) {
            var out = {};
            for (var k in layoutJSON.fileTypes) {
                var ck = layoutJSON.name + "." + k;
                out[k] = lists.instances.fileTypes[ck] || (lists.instances.fileTypes[ck] = new FileType(layoutJSON.fileTypes[k]));
            }
            return out;
        }
        if (typeof nameOrObj === "object") {
            nameOrObj.layout = layoutJSON.name;
            layoutJSON.fileTypes[nameOrObj.name] = nameOrObj;
            var ft = new FileType(nameOrObj);
            lists.instances.fileTypes[layoutJSON.name + "." + nameOrObj.name] = ft;
            var s = await warp.store("layouts");
            if (s) await s.set(layoutJSON.name + ".fileTypes." + nameOrObj.name, nameOrObj);
            changed("fileTypes", "add", nameOrObj.name); return ft;
        }
        if (layoutJSON.fileTypes[nameOrObj]) {
            var ck = layoutJSON.name + "." + nameOrObj;
            return lists.instances.fileTypes[ck] || (lists.instances.fileTypes[ck] = new FileType(layoutJSON.fileTypes[nameOrObj]));
        }
        return undefined;
    };

    layout.search = async function (nameOrObj) {
        if (nameOrObj === undefined) {
            var out = {};
            for (var k in layoutJSON.searches) {
                var ck = layoutJSON.name + "." + k;
                out[k] = lists.instances.searches[ck] || (lists.instances.searches[ck] = new Search(layoutJSON.searches[k]));
            }
            return out;
        }
        if (typeof nameOrObj === "object") {
            nameOrObj.layout = layoutJSON.name;
            layoutJSON.searches[nameOrObj.name] = nameOrObj;
            var sr = new Search(nameOrObj);
            lists.instances.searches[layoutJSON.name + "." + nameOrObj.name] = sr;
            var s = await warp.store("layouts");
            if (s) await s.set(layoutJSON.name + ".searches." + nameOrObj.name, nameOrObj);
            changed("searches", "add", nameOrObj.name); return sr;
        }
        if (layoutJSON.searches[nameOrObj]) {
            var ck = layoutJSON.name + "." + nameOrObj;
            return lists.instances.searches[ck] || (lists.instances.searches[ck] = new Search(layoutJSON.searches[nameOrObj]));
        }
        return undefined;
    };

    layout.remove = async function (type, name) {
        if (!layoutJSON[type]) throw new Error("Layout: unknown type '" + type + "'");
        delete layoutJSON[type][name];
        delete lists.instances[type][layoutJSON.name + "." + name];
        var s = await warp.store("layouts");
        await s.delete(layoutJSON.name + "." + type + "." + name);
        changed(type, "remove", name);
    };

    layout.destroy = async function () {
        warp.trigger("beforeLayoutUnload", layout);
        if (typeof layoutJSON.onBeforeDestroy === "function") await layoutJSON.onBeforeDestroy(layout);
        var idx = lists.loadedLayoutNames.indexOf(layoutJSON.name);
        if (idx !== -1) lists.loadedLayoutNames.splice(idx, 1);
        delete lists.instances.layouts[layoutJSON.name];
        var m = await warp.gui.manager("layout-" + layoutJSON.name);
        if (m) warp.gui.kill(m);
        var s = await warp.store("layouts");
        await s.delete(layoutJSON.name);
        warp.trigger("layoutUnload", layout);
    };

    layout.json = function () {
        var out = {};
        for (var k in LayoutJSON) out[k] = layoutJSON[k];
        helpers.fakeConstructor("LayoutJSON", out);
        return out;
    };

    layout.serialize = layout.toString = function () {
        return toJson(layout.json());
    };

}

//loads a layout from several cases/overlaods
//does not intentionaly use warp.open to not to bloat
warp.load = async function(arg){
    if (Array.isArray(arg)) return Promise.all(arg.map(function(a){ return warp.load(a); }));

    var layoutJSON;
    var layoutName = null;

    if (arg === undefined) {
        // no argument – open file dialog and let user pick a .layout file
        arg = await new Promise(function(resolve) {
            var input = warp.dom.node("input", { type: "file", accept: ".layout", change: function() {
                resolve(input.files[0] || null);
            }});
            input.click();
        });
        if (!arg) return null;
    }

    if (typeof arg === "string") {
        // string(path) – derive name from the URL/path, then fetch as blob
        var slash = arg.lastIndexOf("/");
        var filename = slash !== -1 ? arg.slice(slash + 1) : arg;
        layoutName = filename.replace(/\.layout$/i, "");

        // 1. check if already instantiated in this tab
        if (lists.instances.layouts[layoutName]) return lists.instances.layouts[layoutName];

        // 2. check shared store (another tab may have loaded it)
        var s = await warp.store("layouts");
        var stored = await s.get(layoutName);
        if (stored) {
            var layout = await warp.layout(stored);
            if (stored.onLoad) stored.onLoad(layout);
            return layout;
        }

        // 3. TODO: check localStorage for cached serialized layout
        // var cached = localStorage.getItem("warp.layout." + layoutName);
        // if (cached) { ... fromJson(cached) ... skip fetch ... }

        // 4. not in store or cache — fetch from URL
        var res = await fetch(arg);
        arg = await res.blob();
    }

    if (arg instanceof warp.File) {
        // warp.file – grab the name before extracting the blob
        if (!layoutName && arg.name) layoutName = arg.name.replace(/\.layout$/i, "");
        arg = arg.data instanceof Blob ? arg.data : await arg.blob();
    }

    if (arg instanceof Blob || arg instanceof File) {
        // native file/blob – decompress and extract LayoutJSON from the zip
        if (!layoutName) layoutName = arg.name ? arg.name.replace(/\.layout$/i, "") : "layout";

        var entries = await warp.un.zip(arg);
        if (!entries) throw new Error("warp.load: not a valid .layout archive");

        var manifestKey = layoutName + ".manifest.js";

        if (entries[manifestKey]) {
            try { layoutJSON = new Function("return (" + await entries[manifestKey].text() + ")")(); }
            catch(e) { throw new Error("warp.load: failed to parse " + manifestKey); }
        } else {
            throw new Error("warp.load: " + manifestKey + " not found in archive");
        }

        layoutJSON.name = layoutJSON.name || layoutName;

        // parse lifecycle event files into functions
        var eventFiles = ["onBeforeLoad", "onLoad", "onBeforeDestroy"];
        for (var i = 0; i < eventFiles.length; i++) {
            var evName = eventFiles[i];
            if (entries[evName + ".js"]) {
                try {
                    var src = await entries[evName + ".js"].text();
                    layoutJSON[evName] = new Function("return (" + src + ")")();
                } catch(e) { /* skip malformed event file */ }
            }
        }

        // parse apps/ directory — each subfolder is an app
        var appDirs = {};
        var appPrefix = "apps/";
        Object.keys(entries).forEach(function(p) {
            if (p.indexOf(appPrefix) !== 0) return;
            var rest = p.slice(appPrefix.length);
            var slash = rest.indexOf("/");
            if (slash > 0) appDirs[rest.slice(0, slash)] = true;
        });

        for (var appName in appDirs) {
            var appManifestKey = appPrefix + appName + "/" + layoutName + "." + appName + ".manifest.js";
            var appObj = { name: appName, layout: layoutName, brands: false, folder: {}, win: false, css: false };

            if (entries[appManifestKey]) {
                try {
                    var parsed = new Function("return (" + await entries[appManifestKey].text() + ")")();
                    if (parsed) for (var k in parsed) { if (k !== "name" && k !== "layout") appObj[k] = parsed[k]; }
                } catch(e) { /* use default appObj */ }
            }

            // force name and layout from the directory structure, not from the json
            appObj.name = appName;
            appObj.layout = layoutName;

            // collect all files from this app's folder into folder object
            var folderPrefix = appPrefix + appName + "/";
            var folderKeys = Object.keys(entries);
            for (var fi = 0; fi < folderKeys.length; fi++) {
                var p = folderKeys[fi];
                if (p.indexOf(folderPrefix) !== 0 || p === folderPrefix) continue;
                if (p.endsWith("/")) continue;
                var relativePath = p.slice(folderPrefix.length);
                var filePrefix = layoutName + ".";
                if (relativePath.indexOf(filePrefix) === 0) relativePath = relativePath.slice(filePrefix.length);
                appObj.folder[relativePath] = entries[p].data instanceof Blob ? entries[p].data : await entries[p].blob();
            }

            layoutJSON.apps[appName] = appObj;
        }

        //TODO: convert entries in brands/, fileTypes/, searches/ folders similarly

    } else if (typeof arg === "object" && arg !== null) {
        // plain object – use directly as layoutJSON
        layoutJSON = arg;
    } else {
        throw new Error("warp.load: unsupported argument type");
    }
    var layout = await warp.layout(layoutJSON);
    if(layoutJSON.onLoad)layoutJSON.onLoad(layout)
    return layout;
}

/* FileType.js */
//we have to seriosly conscider scope of warp.open and warp.save functions
//if they only put file son open list and save uses drive to write...then fileType should have overrides or events open() and save()
//we should try without them


var FileTypeJSON = {
    name: false,
    layout: false,
    // file extension / type identifier e.g. "js", "json", "png"
    mime: false,
    // ace editor mode for this type, false means not editable in editor(a binary file)
    mode: false,
    color: false,
    // lifecycle hooks — override these to handle each file operation
    //open:   function (file) {},
    edit:   function (file) {},
    commit: function (file) {}
    //save:   function (file) {}
};

function FileType(options) {

    options = helpers.setupOptionsAndInstance(options, this);

    if (!options.name) throw new Error("FileType requires a name (the file extension, e.g. 'json')");

if (!options.mime) throw new Error("FileType requires a mime type");



    var ft = this;

    ft.json = function () {
        var out = {};
        for (var k in FileTypeJSON) out[k] = options[k];
        helpers.fakeConstructor("FileTypeJSON", out);
        return out;
    };

    ft.serialize = ft.toString = function () {
        return toJson(ft.json());
    };

}





/* Search.js */
var SearchJSON = {
    name: false,
    layout: false,
    desc: '',
    placeholder: '',
    icon: false,
    color: false,
    // static HTML rendered above the results list (header / hint text)
    html: '',
    // called with (el, search) after the search panel is created — wire panel-level events here
    events: function (el, search) {},
    // called with (queryString) → returns raw data array (or Promise)
    query: function (text) { return []; },
    // called with (data, el, query) → builds and returns a single result element
    item: function (data, el, query) { return el; }
};

function Search(options) {

    if (!options || !options.name) throw new Error("Search requires a name");
    if (!options.query) throw new Error("Search requires a query function");
    if (!options.html) throw new Error("Search requires html");

    options = helpers.setupOptionsAndInstance(options, this);

    var sr = this;

    sr.json = function () {
        var out = {};
        for (var k in SearchJSON) out[k] = options[k];
        helpers.fakeConstructor("SearchJSON", out);
        return out;
    };

    sr.serialize = sr.toString = function () {
        return toJson(sr.json());
    };

}


/* Brand.js */
var BrandJSON = {
    "family": "Object",
    "name": false,
    "short": false,
    "description":false,
    "colors": {
        "body": {
            "bg": "rgb(208,208,208)",
            "color": "black"
        },
        "label": {
            "bg": "rgb(229,145,0)",
            "color": "rgb(208,208,208)"
        }
    },
    "test": false, //has to be function (subject) {}
    "layout": false
};

function Brand(options) {

    if (!options || !options.name) throw new Error("Brand requires a name");
    if (!options.short) throw new Error("Brand requires a short name");
    if (!options.test) throw new Error("Brand requires a test function");
    if (!options.layout) throw new Error("Brand requires a layout");
    if (typeof options.test !== "function") throw new Error("Brand test must be a function");
    if (options.test.length > 1) throw new Error("Brand test function must accept at most 1 argument (subject)");

    options = helpers.setupOptionsAndInstance(options, this);

    var brand = this;

    brand.json = function () {
        var out = {};
        for (var k in BrandJSON) out[k] = options[k];
        helpers.fakeConstructor("BrandJSON", out);
        return out;
    };

    brand.serialize = brand.toString = function () {
        return toJson(brand.json());
    };

}


/* App.js */
helpers.registerEvents([
    "beforeAppLoad",
    "appLoad",
    "beforeAppUnload",
    "appUnload"
]);

AppJSON = {
    name: false,
    layout: false,
    deps: false,
    desc: false,
    brands: false,
    folder: {},
    win: false //false means Managers default win | WinJSON
}


warp.app = async function (arg) {

    // string — retrieve existing or look up in loaded layouts
    if (typeof arg === "string") {
        var layoutKey, appKey;

        if (arg.indexOf(".") !== -1) {
            // explicit "Layout.App" form
            var parts = arg.split(".");
            layoutKey = parts[0];
            appKey = parts[1];
        } else {
            appKey = arg;
        }

        // check cache first
        if (layoutKey) {
            var cacheKey = layoutKey + "." + appKey;
            if (lists.instances.apps[cacheKey]) return lists.instances.apps[cacheKey];
        } else {
            // scan cache for any layout-qualified match
            for (var ck in lists.instances.apps) {
                if (ck === appKey || ck.split(".").pop() === appKey) return lists.instances.apps[ck];
            }
        }

        // look up appJSON from loaded layouts
        if (layoutKey) {
            var layout = lists.instances.layouts[layoutKey];
            if (layout) {
                var appData = await layout.app(appKey);
                if (appData) return warp.app(appData);
            }
        } else {
            // scan all loaded layouts for this app name
            for (var ln in lists.instances.layouts) {
                var appData = await lists.instances.layouts[ln].app(appKey);
                if (appData) return warp.app(appData);
            }
        }

        return undefined;
    }

    var appJSON = arg;
    var name = appJSON.name;

    // check cache before creating
    var cacheKey = appJSON.layout ? appJSON.layout + "." + name : name;
    if (lists.instances.apps[cacheKey]) return lists.instances.apps[cacheKey];

    // defaults for win
    if (!appJSON.win) appJSON.win = { name: "app-" + name, state: 0 };
    if (!appJSON.win.name) appJSON.win.name = "app-" + name;
    if (!appJSON.win.caption) appJSON.win.caption = name;


    warp.trigger("beforeAppLoad", appJSON);

    var app = {
        body: warp.dom.node("div", { class: "app-" + name }),
        win: await warp.gui.managers["layout-" + appJSON.layout].win(appJSON.win)
    };


    var dom = {
        node: warp.dom.node,
        query: function (sel) {
            return app.el.querySelector(sel);
        }, queryAll: function (sel) {
            return app.el.querySelectorAll(sel);
        },
        on: function (elOrSelector, event, listener) {
            var el = typeof elOrSelector === "string" ? app.el.querySelector(elOrSelector) : elOrSelector;
            el.addEventListener(event, listener);
        },
        off: function (elOrSelector, event, listener) {
            var el = typeof elOrSelector === "string" ? app.el.querySelector(elOrSelector) : elOrSelector;
            el.removeEventListener(event, listener);
        }
    }
    


    app.show = function () { app.win.show() }
    app.hide = function () { app.win.hide() }

    app.el = app.body;
    app.win.body.append(app.body);

    // inject HTML from folder
    if (appJSON.folder[name + ".html"]) {
        app.el.innerHTML = await appJSON.folder[name + ".html"].text();
    }

    // inject scoped CSS from folder
    if (appJSON.folder[name + ".css"]) {
        var css = await appJSON.folder[name + ".css"].text();
        var style = warp.dom.node("style");
        style.textContent = ".app-" + name + " {\n" + css + "\n}";
        app.el.prepend(style);
    }
    // wrap app code in a named IIFE so the returned object has the right constructor name
    // app code runs with `app` as a private closure variable
    if (!appJSON.folder[name + ".js"]) throw new Error("App '" + (appJSON.layout ? appJSON.layout + "." : "") + name + "': missing " + name + ".js in folder");
    var code = await appJSON.folder[name + ".js"].text();
    var appApi = eval("new (function " + name + "(){\n" +`

         var window = undefined



        `+ code + "\n})()");
    appApi.show = app.show;
    appApi.hide = app.hide;

    // cache with layout-qualified key
    var cacheKey = appJSON.layout ? appJSON.layout + "." + name : name;
    lists.instances.apps[cacheKey] = appApi;

    warp.trigger("appLoad", appApi);

    appApi.destroy = function () {
        warp.trigger("beforeAppUnload", appApi);
        app.win.manager.kill(app.win);
        delete lists.instances.apps[cacheKey];
        warp.trigger("appUnload", appApi);
    };

    return appApi;
}


/* instance.js */
var defaultEngineOptions = {
    tests: false,
    debug: false,
    contain: true,
    load: false,
    storeWorker: "Store.worker.js"
}

// extend recived options with defaults
engineOptions = helpers.setupOptionsAndInstance(engineOptions, defaultEngineOptions);

//these will hold instances of Dom and Gui respectively, they are created below in init().
//they are also attached to the global scope as warp.dom and warp.gui
//this way we can use athem as shorthand through out the engine's scope
var dom, gui;


//wrapper for console.log
function log(...a) { console.log("[Warp]", ...a); };

/**
 * events handling — lists is declared in helpers.js (runs first)
*/

warp.on = function (type, keyOrListener, listener) {
    if (type.includes(',')) {
        type.split(',').forEach(function (t) { warp.on(t.trim(), keyOrListener, listener); });
        return;
    }
    if (!lists.registeredEvents.includes(type)) throw new Error("warp.on: unknown event '" + type + "'. Register it with helpers.registerEvents(['" + type + "'])");
    if (typeof keyOrListener === "function") {
        if (!lists.eventHandlers[type]) lists.eventHandlers[type] = [];
        lists.eventHandlers[type].push(keyOrListener);
    } else {
        if (!lists.keyEventHandlers[type]) lists.keyEventHandlers[type] = {};
        if (!lists.keyEventHandlers[type][keyOrListener]) lists.keyEventHandlers[type][keyOrListener] = [];
        lists.keyEventHandlers[type][keyOrListener].push(listener);
    }
};

warp.off = function (type, keyOrListener, listener) {
    if (typeof keyOrListener === "function") {
        if (!lists.eventHandlers[type]) return;
        lists.eventHandlers[type] = lists.eventHandlers[type].filter(function (fn) { return fn !== keyOrListener; });
    } else {
        if (!lists.keyEventHandlers[type] || !lists.keyEventHandlers[type][keyOrListener]) return;
        lists.keyEventHandlers[type][keyOrListener] = lists.keyEventHandlers[type][keyOrListener].filter(function (fn) { return fn !== listener; });
    }
};

warp.trigger = function (type, data, key) {
    var e = { type: type, data: data, cancelled: false, preventDefault: function () { this.cancelled = true; }, cancel: function () { this.cancelled = true; } };
    var handlers = lists.eventHandlers[type];
    if (handlers) handlers.forEach(function (fn) { fn(e); });
    if (key && lists.keyEventHandlers[type] && lists.keyEventHandlers[type][key]) {
        lists.keyEventHandlers[type][key].forEach(function (fn) { fn(e); });
    }
    return e;
};


warp.prefs = async function (category, name, value) {
    var store = lists.instances.stores["preferences"];
    if (arguments.length === 1) return store.get(category);
    if (arguments.length === 2) return store.get(category + "." + name);
    return store.set(category + "." + name, value);
};


async function init() {


    //this is the id of this engine instance, its going to be used as default client id for Store
    warp.id = "warp-" + rand(10000000, 999999999);

    // Wire async interfaces for all core constructors.
    // Layout is store-backed ("layouts" store — single source of truth for all layout-owned types).
    // FileType, Search, Brand and App are layout-owned — creation routes through layouts, retrieval scans them.
    // Sandbox, Store stay purely in-memory.
    // Drive is excluded — it has its own manual async interface in Drive.js.
    helpers.setupAsyncInterfaces(Sandbox);
    helpers.setupAsyncInterfaces(Store);
    helpers.setupAsyncInterfaces(Layout);
    //constructors that can be stored in a Layout
    helpers.setupAsyncInterfaces(FileType);
    helpers.setupAsyncInterfaces(Search);
    helpers.setupAsyncInterfaces(Brand);

    // create engine-level stores — "layouts" is the single source of truth for all layout-owned
    // types (fileTypes, searches, apps, brands). "files" and "blobs" back the file lifecycle.
    //wa.store asyn interface works a little buit different then others, if store with name exists it will be returned
    for (var name of ["files", "blobs", "layouts"]) {
        await warp.store({ name: name });
    }

    // populate layout name index — used by helpers.setupAsyncInterfaces for targeted store lookups
    var layoutStore = lists.instances.stores["layouts"];

    var allLayoutData = await layoutStore.get();
    if (allLayoutData) {
        for (var k in allLayoutData) lists.loadedLayoutNames.push(k);
    }

    // cross-tab layout sync — when another tab creates, changes, or deletes layouts,
    // this tab instantiates/destroys Layout objects and fires proper lifecycle events.
    // Uses create/update/delete (NOT change) to avoid conflicts — store emits "change"
    // alongside every other event, so a "change" handler would re-add deleted items.

    var _collectionMethod = { fileTypes: "fileType", searches: "search", brands: "brand", apps: "app" };
    var _collectionEvents = { apps: "appChanged", brands: "brandChanged", fileTypes: "fileTypeChanged", searches: "searchChanged" };

    layoutStore.on("create", async function (key, value, client) {
        if (client === warp.id) return;
        var parts = key.split(".");
        var layoutName = parts[0];
        var collection = parts[1];
        var itemName = parts[2];
        if (!collection) {
            // new top-level layout
            if (lists.instances.layouts[layoutName]) return;
            if (!lists.loadedLayoutNames.includes(layoutName)) lists.loadedLayoutNames.push(layoutName);
            await warp.layout(value);
            return;
        }
        // new sub-item (brand, fileType, search, app added in another tab)
        var layout = lists.instances.layouts[layoutName];
        if (layout && itemName) {
            var items = await layout[_collectionMethod[collection]]();
            if (items) items[itemName] = value;
            delete lists.instances[collection][layoutName + "." + itemName];
            if (_collectionEvents[collection]) layout._trigger(_collectionEvents[collection], { action: "add", name: itemName });
            layout._trigger("changed", { collection: collection, action: "add", name: itemName });
            warp.trigger("layoutChanged", layout, layoutName);
        }
    });

    layoutStore.on("update", async function (key, value, client) {
        if (client === warp.id) return;
        var parts = key.split(".");
        var layoutName = parts[0];
        var collection = parts[1];
        var itemName = parts[2];
        var layout = lists.instances.layouts[layoutName];
        if (!collection) {
            // top-level layout data replaced
            if (!layout) return;
            delete lists.instances.layouts[layoutName];
            ["fileTypes", "searches", "apps", "brands"].forEach(function (prop) {
                helpers.invalidateCollection(layoutName, prop);
            });
            warp.trigger("layoutChanged", { name: layoutName }, layoutName);
            return;
        }
        // sub-item updated
        if (layout && itemName) {
            var items = await layout[_collectionMethod[collection]]();
            if (items) items[itemName] = value;
            delete lists.instances[collection][layoutName + "." + itemName];
            if (_collectionEvents[collection]) layout._trigger(_collectionEvents[collection], { action: "update", name: itemName });
            layout._trigger("changed", { collection: collection, action: "update", name: itemName });
            warp.trigger("layoutChanged", layout, layoutName);
        } else if (!itemName) {
            helpers.invalidateCollection(layoutName, collection);
        }
    });

    layoutStore.on("delete", async function (key, value, client) {
        if (client === warp.id) return;
        var parts = key.split(".");
        var layoutName = parts[0];
        var collection = parts[1];
        var itemName = parts[2];
        var layout = lists.instances.layouts[layoutName];
        if (!collection) {
            // top-level layout deleted — destroy local instance
            if (layout) {
                warp.trigger("beforeLayoutUnload", layout);
                var m = warp.gui.managers["layout-" + layoutName];
                if (m) warp.gui.kill(m);
                var idx = lists.loadedLayoutNames.indexOf(layoutName);
                if (idx !== -1) lists.loadedLayoutNames.splice(idx, 1);
                delete lists.instances.layouts[layoutName];
                ["fileTypes", "searches", "apps", "brands"].forEach(function (prop) {
                    helpers.invalidateCollection(layoutName, prop);
                });
                warp.trigger("layoutUnload", layout);
            }
            return;
        }
        // sub-item deleted — destroy live instance, remove from local layoutJSON and fire events
        if (layout && itemName) {
            var inst = lists.instances[collection][layoutName + "." + itemName];
            if (inst && typeof inst.destroy === "function") inst.destroy();
            var items = await layout[_collectionMethod[collection]]();
            if (items) delete items[itemName];
            delete lists.instances[collection][layoutName + "." + itemName];
            if (_collectionEvents[collection]) layout._trigger(_collectionEvents[collection], { action: "remove", name: itemName });
            layout._trigger("changed", { collection: collection, action: "remove", name: itemName });
            warp.trigger("layoutChanged", layout, layoutName);
        } else if (!itemName) {
            helpers.invalidateCollection(layoutName, collection);
        }
    });

    // preferences store — persisted to OPFS
    var storedPrefs = null;
    var prefsStoreExists = await warp.store("preferences");

    if (!prefsStoreExists) try {
        var opfsRoot = await navigator.storage.getDirectory();
        var prefHandle = await opfsRoot.getFileHandle("preferences.json");
        var prefFile = await prefHandle.getFile();
        storedPrefs = fromJson(await prefFile.text());
    } catch (_e) { }

    var prefsStore = await warp.store({
        name: "preferences",
        beforeWorkerEnd: async function (data) {
            var root = await navigator.storage.getDirectory();
            var fh = await root.getFileHandle("preferences.json", { create: true });
            var w = await fh.createWritable();
            await w.write(JSON.stringify(data));
            await w.close();
        }
    });

    if (storedPrefs && !prefsStoreExists) await prefsStore.setRoot(storedPrefs);

//we definetly need 'change' here
    helpers.registerEvents([
        "beforeFileOpen",
        "fileOpen",
        "beforeFileClose",
        "fileClose"
    ]);

    

    if (engineOptions.load) await warp.load(engineOptions.load);

    // hydrate layouts already in the store (loaded by other tabs) that options.load didn't cover
    if (allLayoutData) {
        for (var k in allLayoutData) {
            if (!lists.instances.layouts[k]) await warp.layout(allLayoutData[k]);
        }
    }

    //if mocha internal tests are passed run them
    if (engineOptions.tests) {
        eval(engineOptions.tests)
        mocha.run();
    }

    return this

}

//we create an instance of dom , helps with dom operations and is used by Gui
//we created vars before init();
warp.dom = new Dom();
dom = warp.dom;
//we create an instance of gui and attach it to the global scope, this is the main interface 
// for interacting with the engine's GUI system, it holds layers and layers contain Windows
warp.gui = new Gui();
gui = warp.gui;

init()

if (engineOptions.contain) { return undefined; } else return this;


 }

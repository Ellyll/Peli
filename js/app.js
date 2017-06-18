var Peli;
(function (Peli) {
    class App {
        cychwyn() {
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext("2d");
            const lliniadydd = new Peli.Lliniadydd(context);
            // Gosod y canvas i'r maint mwyaf bosib
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            const xCanol = (canvas.width / 2) - 1;
            const yCanol = (canvas.height / 2) - 1;
            const cynhyrchuSiap = (niferOchrau, radiws, xc, yc) => {
                const pwyntiau = [];
                const cam = Math.PI * 2 / niferOchrau;
                const ongli = Math.PI / 2;
                for (let ongl = 0; ongl < Math.PI * 2; ongl += cam) {
                    const x = radiws * Math.cos(ongl + ongli);
                    const y = radiws * Math.sin(ongl + ongli);
                    pwyntiau.push(new Peli.Fector2D(xc + x, yc + y));
                }
                return new Peli.Siap(pwyntiau);
            };
            const uchafswmR = Math.round(0.9 * (Math.min(canvas.height, canvas.width) - 20) / 2);
            const camR = uchafswmR / 13;
            const nolRadiws = (n) => {
                return 20 + ((n - 2) * camR);
            };
            const niferOchrauCychwyn = 3;
            const niferOchrauGorffen = 15;
            const siapiau = [];
            for (let n = niferOchrauCychwyn; n <= niferOchrauGorffen; n++) {
                const radiws = nolRadiws(n);
                const siap = cynhyrchuSiap(n, radiws, xCanol, yCanol);
                siapiau.push(siap);
            }
            const colyn = Math.ceil(siapiau.length / 2) - 1;
            const cyflymderau = siapiau.map((siap, i) => {
                const a = siap.perimedr / 5;
                const j = i <= colyn ? i : siapiau.length - 1 - i;
                return a + (j * a * 0.5);
            });
            const peliCychwynol = siapiau.map(s => {
                // Hanner ffordd ar hyd y llinell gyntaf
                const x = (s.pwyntiau[0].x + s.pwyntiau[1].x) / 2;
                const y = (s.pwyntiau[0].y + s.pwyntiau[1].y) / 2;
                const rhifPwyntNesaf = 1;
                return new Peli.Pel(x, y, rhifPwyntNesaf);
            });
            const symudPel = (pel, siap, cyflymder, eiliadau) => {
                //const cyflymder = 400;
                const cyfanswmPellterIDeithio = cyflymder * eiliadau;
                let pellterIDeithio = cyfanswmPellterIDeithio;
                let lleoliad = pel;
                let rhifPwyntNesaf = pel.rhifPwyntNesaf;
                while (pellterIDeithio > 0) {
                    const pwyntNesaf = siap.pwyntiau[rhifPwyntNesaf];
                    const pellterIPwyntNesaf = lleoliad.pellterI(siap.pwyntiau[rhifPwyntNesaf]);
                    const pellterYma = Math.min(pellterIDeithio, pellterIPwyntNesaf);
                    const cyfeiriad = pwyntNesaf.tynnu(lleoliad).uned();
                    lleoliad = lleoliad.ychwanegu(cyfeiriad.lluosi(pellterYma));
                    if (pellterIDeithio >= pellterIPwyntNesaf) {
                        rhifPwyntNesaf = (rhifPwyntNesaf === siap.pwyntiau.length - 1) ? 0 : rhifPwyntNesaf + 1;
                    }
                    pellterIDeithio -= pellterYma;
                }
                return new Peli.Pel(lleoliad.x, lleoliad.y, rhifPwyntNesaf);
            };
            const diweddaru = (amserDiwethaf, amser, peli) => {
                const dt = amser - amserDiwethaf;
                peli = peli.map((pel, idx) => symudPel(pel, siapiau[idx], cyflymderau[idx], dt / 1000));
                lliniadydd.lluniadu(siapiau, peli);
                window.requestAnimationFrame((rwan) => { diweddaru(amser, rwan, peli); });
            };
            diweddaru(performance.now(), performance.now(), peliCychwynol);
        }
    }
    Peli.App = App;
})(Peli || (Peli = {}));
var Peli;
(function (Peli) {
    class Fector2D {
        constructor(x, y) {
            this._data = [x, y];
        }
        get 0() { return this._data[0]; }
        get 1() { return this._data[1]; }
        get x() { return this._data[0]; }
        get y() { return this._data[1]; }
        get length() { return 2; }
        toString() {
            return `(${Math.round(this.x * 100) / 100},${Math.round(this.y * 100) / 100})`;
        }
        // Dot product
        dot(fector) {
            return this.x * fector.x + this.y * fector.y;
        }
        lluosi(n) {
            return new Fector2D(this.x * n, this.y * n);
        }
        rhannu(n) {
            return new Fector2D(this.x / n, this.y / n);
        }
        ychwanegu(fector) {
            return new Fector2D(this.x + fector.x, this.y + fector.y);
        }
        tynnu(fector) {
            return new Fector2D(this.x - fector.x, this.y - fector.y);
        }
        maint() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        maintSgwar() {
            return this.x * this.x + this.y * this.y;
        }
        pellterI(fector) {
            const a = fector.tynnu(this);
            return a.maint();
        }
        pellterSgwarI(fector) {
            const a = fector.tynnu(this);
            return a.maintSgwar();
        }
        uned() {
            return this.rhannu(this.maint());
        }
        map(func) {
            return new Fector2D(func(this.x), func(this.y));
        }
        ynHafal(fector) {
            return this.x === fector.x && this.y === fector.y;
        }
    }
    Peli.Fector2D = Fector2D;
})(Peli || (Peli = {}));
var Peli;
(function (Peli) {
    class Lliniadydd {
        constructor(context) {
            this._context = context;
        }
        lluniadu(siapiau, peli) {
            const ctx = this._context;
            // const nifer1 = Math.floor(siapiau.length/2);
            // const lliwiau1 = this.creuRhestrLliwiau(Lliw.oRGB(255,0,0), Lliw.oRGB(0,255,0), nifer1);
            // const nifer2 = siapiau.length-nifer1;
            // const lliwiau2 = this.creuRhestrLliwiau(Lliw.oRGB(0,255,0), Lliw.oRGB(0,0,255), nifer2);
            // const lliwiau = lliwiau1.concat(lliwiau2);
            const lliwiau = this.creuRhestrEnfys(siapiau.length);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            siapiau.forEach((siap, i) => {
                ctx.strokeStyle = lliwiau[i].felRGBA(); //"#F00";
                ctx.beginPath();
                ctx.moveTo(siap.pwyntiau[0].x, siap.pwyntiau[0].y);
                for (let i = 1; i < siap.pwyntiau.length; i++) {
                    ctx.lineTo(siap.pwyntiau[i].x, siap.pwyntiau[i].y);
                }
                ctx.lineTo(siap.pwyntiau[0].x, siap.pwyntiau[0].y);
                ctx.stroke();
                // ctx.fillStyle = "#F00";
                // ctx.beginPath();
                // ctx.arc(siap.pwyntiau[0].x, siap.pwyntiau[0].y, 5, 0, Math.PI*2, false);
                // ctx.fill();
                // ctx.fillStyle = "#00F";
                // ctx.beginPath();
                // ctx.arc(siap.pwyntiau[1].x, siap.pwyntiau[1].y, 5, 0, Math.PI*2, false);
                // ctx.fill();
            });
            peli.forEach(pel => {
                ctx.fillStyle = "#000";
                ctx.beginPath();
                ctx.arc(pel.x, pel.y, 5, 0, Math.PI * 2, false);
                ctx.fill();
            });
        }
        creuRhestrLliwiau(cychwyn, gorffen, nifer) {
            const lliwiau = [];
            for (let i = 0; i < nifer; i++) {
                const r = cychwyn.r + Math.round((gorffen.r - cychwyn.r) * i / nifer);
                const g = cychwyn.g + Math.round((gorffen.g - cychwyn.g) * i / nifer);
                const b = cychwyn.b + Math.round((gorffen.b - cychwyn.b) * i / nifer);
                lliwiau.push(Peli.Lliw.oRGB(r, g, b));
            }
            return lliwiau;
        }
        creuRhestrEnfys(nifer) {
            // o https://stackoverflow.com/a/25510241
            const nolLliw = (numOfSteps, step) => {
                let r = 0.0;
                let g = 0.0;
                let b = 0.0;
                let h = step / numOfSteps;
                let i = Math.floor(h * 6);
                let f = h * 6.0 - i;
                let q = 1 - f;
                switch (i % 6) {
                    case 0:
                        r = 1;
                        g = f;
                        b = 0;
                        break;
                    case 1:
                        r = q;
                        g = 1;
                        b = 0;
                        break;
                    case 2:
                        r = 0;
                        g = 1;
                        b = f;
                        break;
                    case 3:
                        r = 0;
                        g = q;
                        b = 1;
                        break;
                    case 4:
                        r = f;
                        g = 0;
                        b = 1;
                        break;
                    case 5:
                        r = 1;
                        g = 0;
                        b = q;
                        break;
                }
                return Peli.Lliw.oRGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
            };
            const lliwiau = [];
            for (let cam = 0; cam < nifer; cam++) {
                lliwiau.push(nolLliw(nifer, cam));
            }
            return lliwiau;
        }
    }
    Peli.Lliniadydd = Lliniadydd;
})(Peli || (Peli = {}));
var Peli;
(function (Peli) {
    class Lliw {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            if (!Lliw.ynDilys(r))
                throw Error(`Cydran r annilys: ${r}`);
            if (!Lliw.ynDilys(g))
                throw Error(`Cydran g annilys: ${g}`);
            if (!Lliw.ynDilys(b))
                throw Error(`Cydran b annilys: ${b}`);
            if (!Lliw.ynDilys(a))
                throw Error(`Cydran a annilys: ${a}`);
        }
        static ynDilys(cydran) {
            return cydran >= 0 && cydran <= 255;
        }
        static oRGBA(r, g, b, a) {
            return new Lliw(r, g, b, a);
        }
        static oRGB(r, g, b) {
            return new Lliw(r, g, b, 255);
        }
        static oHex(hex) {
            const str = hex.startsWith("#") ? hex.substr(1) : hex;
            const hyd = str.length;
            // RGB, RGBA, RRGGBB, RRGGBBAA
            let step;
            switch (hyd) {
                case 3:
                case 4:
                    step = 1;
                    break;
                case 6:
                case 8:
                    step = 2;
                    break;
                default:
                    throw Error(`Fformat lliw anhywir: ${hex}`);
            }
            const c = []; // cydrannau
            for (let i = 0; i < hyd; i += step) {
                c.push(parseInt(str.substr(i, step), 16));
            }
            if (c.length < 4)
                c.push(255);
            return new Lliw(c[0], c[1], c[2], c[3]);
        }
        felRGBA() {
            return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        }
    }
    Peli.Lliw = Lliw;
})(Peli || (Peli = {}));
var Peli;
(function (Peli) {
    class Pel extends Peli.Fector2D {
        constructor(x, y, rhifPwyntNesaf) {
            super(x, y);
            this.rhifPwyntNesaf = rhifPwyntNesaf;
        }
    }
    Peli.Pel = Pel;
})(Peli || (Peli = {}));
var Peli;
(function (Peli) {
    class Siap {
        constructor(pwyntiau) {
            this.pwyntiau = pwyntiau;
        }
        get niferOchrau() {
            return this.pwyntiau.length;
        }
        get perimedr() {
            let pm = 0;
            for (let i = 0; i < this.pwyntiau.length - 1; i++) {
                pm += this.pwyntiau[i].pellterI(this.pwyntiau[i + 1]);
            }
            pm += this.pwyntiau[this.pwyntiau.length - 1].pellterI(this.pwyntiau[0]);
            return pm;
        }
    }
    Peli.Siap = Siap;
})(Peli || (Peli = {}));
//# sourceMappingURL=app.js.map
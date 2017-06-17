namespace Peli {
    export class App {
        cychwyn() {
            const canvas = <HTMLCanvasElement>document.getElementById("canvas");
            const context = canvas.getContext("2d");
            const lliniadydd = new Lliniadydd(context);            

            // Gosod y canvas i'r maint mwyaf bosib
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;

            const xCanol = (canvas.width/2)-1;
            const yCanol = (canvas.height/2)-1;

            const cynhyrchuSiap = (niferOchrau, radiws, xc, yc) : Siap => {
                const pwyntiau : Fector2D[] = [];
                const cam = Math.PI*2/niferOchrau;
                const ongli = Math.PI/2;
                for (let ongl=0 ; ongl < Math.PI*2 ; ongl += cam) {
                    const x = radiws * Math.cos(ongl+ongli);
                    const y = radiws * Math.sin(ongl+ongli);
                    pwyntiau.push(new Fector2D(xc+x, yc+y));
                }
                return new Siap(pwyntiau);
            }

            const uchafswmR = Math.round(0.9*(Math.min(canvas.height, canvas.width)-20)/2);
            const camR = uchafswmR/13;
            const nolRadiws = (n : number) : number => {
                return 20+((n-2)*camR);
            };

            const siapiau : Siap[] = [];
            for (let n=3 ; n<=15 ; n++) {
                //const radiws = 20 + (n*15);
                const radiws = nolRadiws(n);
                const siap = cynhyrchuSiap(n, radiws, xCanol, yCanol);
                siapiau.push(siap);
            }

            const peliCychwynol : Pel[] = siapiau.map(s => {
                // Hanner ffordd ar hyd y llinell gyntaf
                const x = (s.pwyntiau[0].x + s.pwyntiau[1].x) / 2;
                const y = (s.pwyntiau[0].y + s.pwyntiau[1].y) / 2;
                const rhifPwyntNesaf = 1;
                return new Pel(x, y, rhifPwyntNesaf);
            });

            const symudPel = (pel : Pel, siap : Siap, eiliadau : number) : Pel => {
                const cyflymder = 50;
                const cyfanswmPellterIDeithio = cyflymder * eiliadau;
                let pellterIDeithio = cyfanswmPellterIDeithio;
                let lleoliad : Fector2D = pel;
                let rhifPwyntNesaf = pel.rhifPwyntNesaf;
                while(pellterIDeithio > 0) {
                    const pwyntNesaf = siap.pwyntiau[rhifPwyntNesaf];
                    const pellterIPwyntNesaf = lleoliad.pellterI(siap.pwyntiau[rhifPwyntNesaf]);
                    const pellterYma = Math.min(pellterIDeithio, pellterIPwyntNesaf);
                    const cyfeiriad = pwyntNesaf.tynnu(lleoliad).uned();
                    lleoliad = lleoliad.ychwanegu(cyfeiriad.lluosi(pellterYma));

                    if (pellterIDeithio >= pellterIPwyntNesaf) {
                        rhifPwyntNesaf = (rhifPwyntNesaf === siap.pwyntiau.length-1) ? 0 : rhifPwyntNesaf+1;
                    }
                    pellterIDeithio -= pellterYma;
                }
                return new Pel(lleoliad.x, lleoliad.y, rhifPwyntNesaf);
            };

            const diweddaru = (amserDiwethaf : number, amser : number, peli : Pel[]) : void => {
                const dt = amser - amserDiwethaf;
                peli = peli.map( (pel, idx) => symudPel(pel, siapiau[idx], dt/1000));
                lliniadydd.lluniadu(siapiau, peli);
                window.requestAnimationFrame((rwan) => { diweddaru(amser, rwan, peli); });
            };

            diweddaru(performance.now(), performance.now(), peliCychwynol);
        }
    }
}
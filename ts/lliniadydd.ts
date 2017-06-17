namespace Peli {
    export class Lliniadydd {
        private _context : CanvasRenderingContext2D;

        constructor(context: CanvasRenderingContext2D) {
            this._context = context;
        }

        lluniadu(siapiau : Siap[], peli : Pel[]) : void {
            const ctx = this._context;

            // const nifer1 = Math.floor(siapiau.length/2);
            // const lliwiau1 = this.creuRhestrLliwiau(Lliw.oRGB(255,0,0), Lliw.oRGB(0,255,0), nifer1);
            // const nifer2 = siapiau.length-nifer1;
            // const lliwiau2 = this.creuRhestrLliwiau(Lliw.oRGB(0,255,0), Lliw.oRGB(0,0,255), nifer2);
            // const lliwiau = lliwiau1.concat(lliwiau2);
            const lliwiau = this.creuRhestrEnfys(siapiau.length);


            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
           
            siapiau.forEach( (siap, i) => {
                ctx.strokeStyle = lliwiau[i].felRGBA(); //"#F00";
                ctx.beginPath();
                ctx.moveTo(siap.pwyntiau[0].x, siap.pwyntiau[0].y);
                for (let i=1 ; i<siap.pwyntiau.length ; i++) {
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
                ctx.arc(pel.x, pel.y, 5, 0, Math.PI*2, false);
                ctx.fill();
            });
        }

        private creuRhestrLliwiau(cychwyn : Lliw, gorffen : Lliw, nifer : number) : Lliw[] {
            const lliwiau : Lliw[] = [];
            for (let i=0 ; i<nifer ; i++) {
                const r = cychwyn.r + Math.round((gorffen.r-cychwyn.r)*i/nifer);
                const g = cychwyn.g + Math.round((gorffen.g-cychwyn.g)*i/nifer);
                const b = cychwyn.b + Math.round((gorffen.b-cychwyn.b)*i/nifer);
                lliwiau.push(Lliw.oRGB(r,g,b));
            }
            return lliwiau;
        }

        private creuRhestrEnfys(nifer : number) : Lliw[] {
            // o https://stackoverflow.com/a/25510241
            const nolLliw = (numOfSteps : number, step : number) : Lliw => {
                let r = 0.0;
                let g = 0.0;
                let b = 0.0;
                let h = step / numOfSteps;
                let i = Math.floor(h * 6);
                let f = h * 6.0 - i;
                let q = 1 - f;

                switch (i % 6)
                {
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
                return Lliw.oRGB(Math.round(r*255), Math.round(g*255), Math.round(b*255));
            };

            const lliwiau : Lliw[] = [];
            for (let cam=0 ; cam<nifer ; cam++) {
                lliwiau.push(nolLliw(nifer, cam));
            }
            return lliwiau;
        }
    }
}
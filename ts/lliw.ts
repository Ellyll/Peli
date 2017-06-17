namespace Peli {
    export class Lliw {

        private constructor(readonly r: number, readonly g: number, readonly b: number, readonly a: number) {
            if (!Lliw.ynDilys(r)) throw Error(`Cydran r annilys: ${r}`);
            if (!Lliw.ynDilys(g)) throw Error(`Cydran g annilys: ${g}`);
            if (!Lliw.ynDilys(b)) throw Error(`Cydran b annilys: ${b}`);
            if (!Lliw.ynDilys(a)) throw Error(`Cydran a annilys: ${a}`);
        }

        private static ynDilys(cydran: number) : boolean {
            return cydran >= 0 && cydran <=255;
        }

        static oRGBA(r: number, g: number, b: number, a: number) : Lliw {            
            return new Lliw(r, g, b, a);
        }

        static oRGB(r: number, g: number, b: number) : Lliw {            
            return new Lliw(r, g, b, 255);
        }

        static oHex(hex: string) : Lliw {
            const str = hex.startsWith("#") ? hex.substr(1) : hex;
            const hyd = str.length;

            // RGB, RGBA, RRGGBB, RRGGBBAA
            let step : number;
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

            const c : number[] = []; // cydrannau
            for (let i=0; i<hyd ; i += step) {
                c.push(parseInt(str.substr(i,step), 16));
            }
            if (c.length < 4) c.push(255);

            return new Lliw(c[0], c[1], c[2], c[3]);
        }

        felRGBA() : string {
            return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        }
    }
}
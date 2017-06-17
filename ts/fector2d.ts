namespace Peli {
    export class Fector2D {
        private _data : number[];

        constructor(x : number, y : number) {
            this._data = [ x, y ];
        }

        get 0() : number { return this._data[0]; }
        get 1() : number { return this._data[1]; }
        get x() : number { return this._data[0]; }
        get y() : number { return this._data[1]; }
        get length() : number { return 2; }

        toString() : string {
            return `(${Math.round(this.x*100)/100},${Math.round(this.y*100)/100})`;
        }

        // Dot product
        dot(fector : Fector2D) : number {
            return this.x*fector.x + this.y*fector.y;
        }

        lluosi(n : number) : Fector2D {
            return new Fector2D(this.x*n, this.y*n);
        }

        rhannu(n : number) : Fector2D {
            return new Fector2D(this.x/n, this.y/n);
        }

        ychwanegu(fector : Fector2D) : Fector2D {
            return new Fector2D(this.x+fector.x, this.y+fector.y);
        }

        tynnu(fector : Fector2D) : Fector2D {
            return new Fector2D(this.x-fector.x, this.y-fector.y);
        }

        maint() : number {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }

        maintSgwar() : number {
            return this.x*this.x + this.y*this.y;
        }

        pellterI(fector : Fector2D) {
            const a = fector.tynnu(this);
            return a.maint();
        }

        pellterSgwarI(fector : Fector2D) {
            const a = fector.tynnu(this);
            return a.maintSgwar();
        }

        uned() : Fector2D {
            return this.rhannu(this.maint());
        }

        map(func : (n : number) => number) : Fector2D {
            return new Fector2D(func(this.x), func(this.y));
        }

        ynHafal(fector : Fector2D) : boolean {
            return this.x === fector.x && this.y === fector.y;
        }

    }
}
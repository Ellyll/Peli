namespace Peli {
    export class Siap {
        constructor(readonly pwyntiau : Fector2D[]) {

        }

        get niferOchrau() : number {
            return this.pwyntiau.length;
        }

        get perimedr() : number {
            let pm = 0;
            for (let i=0 ; i<this.pwyntiau.length-1 ; i++) {
                pm += this.pwyntiau[i].pellterI(this.pwyntiau[i+1]);
            }
            pm += this.pwyntiau[this.pwyntiau.length-1].pellterI(this.pwyntiau[0]);
            return pm;
        }
    }
}
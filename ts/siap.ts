namespace Peli {
    export class Siap {
        constructor(readonly pwyntiau : Fector2D[]) {

        }

        get niferOchrau() : number {
            return this.pwyntiau.length;
        }
    }
}
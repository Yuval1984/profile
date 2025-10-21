import { from, Observable, of, Subject } from "rxjs";

export class SubjectData<T> {
    private readonly _data$: Subject<T>;

    constructor() {
        this._data$ = new Subject<T>();
    }

    next(value: T) {
        this._data$.next(value);
    }

    asObservable(): Observable<T> {
        return this._data$.asObservable();
    }
}

const keywords = ['hi', 'there', 'i', 'am', 'yuval'];
const data = new SubjectData();
for (const word of keywords) {
    data.next(from(word).subscribe(nextWord => {
        const word = of(nextWord);
        console.log(word);
    }));
}
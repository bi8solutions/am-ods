import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';

export interface Avenger {
  slug: string,
  name: string,
  surname: string,
  email: string
}

let avengers = [
  {
    slug: 'Spiderman',
    name: 'Peter',
    surname: 'Parker',
    email: 'peter.parker@avengers.com'
  },
  {
    slug: 'Ironman',
    name: 'Tony',
    surname: 'Stark',
    email: 'tony.stark@avengers.com'
  },
  {
    slug: 'Hulk',
    name: 'Bruce',
    surname: 'Banner',
    email: 'bruce.banner@avengers.com'
  },
  {
    slug: 'Captain America',
    name: 'Steve',
    surname: 'Rogers',
    email: 'steve.rogers@avengers.com'
  },
  {
    slug: 'Batman',
    name: 'Bruce',
    surname: 'Wayne',
    email: 'bruce.wayne@avengers.com'
  },
  {
    slug: 'Superman',
    name: 'Clark',
    surname: 'Kent',
    email: 'clar.kent@avengers.com'
  }
];

@Injectable({providedIn: 'root'})
export class AppService {
  constructor() {
  }

  filterAvengers(filter: Avenger): Observable<any> {
    return of(avengers);
  }

  findAllAvengers(): Observable<any> {
    return of(avengers);
  }
}
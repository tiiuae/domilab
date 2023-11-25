import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public activePage?: string;

  constructor() { }

  public setActivePage(slug: string) {
    this.activePage = slug
  }

  public getActivePage() {
    return this.activePage
  }

  public isActive(slug: string) {
    return this.activePage == slug
  }
}

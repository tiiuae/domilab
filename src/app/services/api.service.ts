import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public listNetworks() {
    return this.http.get("/assets/data/networks.json");
  }

  public listCentralities() {
    return this.http.get("/assets/data/centralities.json");
  }

  public getNetwork(network: string) {
    return this.http.get(`/assets/data/${network}/network.json`);
  }

  public getCentrality(network: string, centrality: string) {
    return this.http.get(`/assets/data/${network}/centralities/${centrality}.json`);
  }
}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.page.html',
  styleUrls: ['./comparison.page.scss']
})
export class ComparisonPage implements OnInit, AfterViewInit {

  @ViewChild('graphOne') graph_one: any;
  @ViewChild('graphTwo') graph_two: any;
  network: any = {nodes: [], links: []}
  centrality: any;

  selectedNetwork: any = "dolphin"
  selectedCentrality: any = "pagerank"

  constructor(
    private api: ApiService,
    private menu: MenuService) {

  }

  ngOnInit(): void {
    this.menu.setActivePage('comparison')
  }

  ngAfterViewInit(): void {
    this.loadNetwork()
  }

  async loadNetwork() {
    this.network = null
    this.centrality = null
    this.network = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    this.centrality = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentrality))
  }

}

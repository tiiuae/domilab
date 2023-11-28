import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
// import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { firstValueFrom } from 'rxjs';
import { NetworkComponent } from 'src/app/components/network/network.component';
import { ApiService } from 'src/app/services/api.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-network-attacks',
  templateUrl: './network-attacks.page.html',
  styleUrls: ['./network-attacks.page.scss']
})
export class NetworkAttacksPage implements OnInit, AfterViewInit {

  @ViewChild('graph') graph: any;
  network: any = {nodes: [], links: []}
  centrality: any;

  centralities: any[] = []
  networks: any[] = []
  orderOfRemoval: any[] = []

  selectedNetwork: any = "dolphin"
  selectedCentrality: any = "pagerank"
  selectedSigma: any = null;

  attackInterval: any = null;
  attackIntervalDelay: number = 250; // in milliseconds
  currentLargestComponent: number = 1
  currentIteration: number = 0
  showSigmaSlider: boolean = false
  playing: boolean = false
  resetEnabled: boolean = true

  constructor(
    private api: ApiService,
    private menu: MenuService) {

  }

  ngOnInit(): void {
    this.menu.setActivePage('network-attacks')
    this._loadNetworksList()
    this._loadCentralitiesList()
  }

  ngAfterViewInit(): void {
    this.loadNetwork()
  }

  async loadNetwork() {
    this.network = null
    this.centrality = null
    this.network = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    this.centrality = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentrality))

    // in the case of domirank
    if (this.hasSigmaParameter(this.centrality)) {
      this.currentIteration = 0
      this.showSigmaSlider = true
      if (!this.selectedSigma)
        this.selectedSigma = this.centrality['optimal_sigma'] * 100
      this.currentLargestComponent = this.centrality['centrality'][this.selectedSigma-1]['largest_component'][this.currentIteration]
      this.orderOfRemoval = this.centrality['centrality'][this.selectedSigma-1]['nodes']
      this.centrality = this.centrality['centrality'][this.selectedSigma-1]
    } else {
      this.currentIteration = 0
      this.showSigmaSlider = false
      this.currentLargestComponent = this.centrality['largest_component'][this.currentIteration]
      this.orderOfRemoval = this.centrality['nodes']
    }
  }


  // onclick event handler
  public play(): void {
    this.playing = true
    this.attackInterval = setInterval(() => {
      this.step();
    }, this.attackIntervalDelay);
  }

  // onclick event handler
  public pause(): void {
    clearInterval(this.attackInterval)
    this.attackInterval = null
    this.playing = false
  }

  // onclick event handler
  public step(): void {
    if (this.currentIteration >= this.centrality['largest_component'].length)
    {
      this.pause()
      return
    }

    var removeNodeId = this.orderOfRemoval[this.currentIteration]
    this.graph.removeNode(removeNodeId)

    this.currentIteration++
    this.currentLargestComponent = this.centrality['largest_component'][this.currentIteration] ? this.centrality['largest_component'][this.currentIteration] : 0
  }

  // onclick event handler
  public reset() {
    this.resetEnabled = false;
    this.pause();
    this.loadNetwork();
    this.resetEnabled = true;
    this.graph.resetGraph();
  }

  // onupdate event handler
  public updateSpeed(event: any): void {
    var wasPlayingInitially = this.playing
    if (this.playing)
      this.pause()
    this.attackIntervalDelay = event.target.value;
    if (wasPlayingInitially)
      this.play();
  }

  // onupdate event handler
  public updateSigma(event: any): void {
    this.selectedSigma = event.target.value;
    this.pause()
    this.loadNetwork()
    this.graph.resetGraph();

    console.log("updateSigma", this.selectedSigma);
  }

  // onclick event handler
  public selectNetwork(e: any) {
    this.selectedNetwork = e.target.value.length ? e.target.value : null
    // this.selectedCentrality = null
    this.pause()
    this.loadNetwork()
    this.graph.resetGraph();
  }

  // onclick event handler
  public selectCentrality(e: any) {
    this.selectedCentrality = e.target.value.length ? e.target.value : null
    this.pause()
    this.loadNetwork()
    this.graph.resetGraph();
  }

  public hasSigmaParameter(centrality: any) {
    return Object.hasOwn(centrality, 'has_sigma')
  }



  // PRIVATE METHODS

  private _loadNetworksList() {
    this.api.listNetworks()
      .subscribe((response: any) => {
        this.networks = response['data'];
      })
  }

  private _loadCentralitiesList() {
    this.api.listCentralities()
      .subscribe((response: any) => {
        this.centralities = response['data'];
      })
  }

}

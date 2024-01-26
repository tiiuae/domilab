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

  centralities: any[] = []
  networks: any[] = []

  @ViewChild('graphOne') graphOne: any;
  @ViewChild('graphTwo') graphTwo: any;

  networkOne: any = {nodes: [], links: []}
  centralityOne: any;
  networkTwo: any = {nodes: [], links: []}
  centralityTwo: any;

  selectedNetwork: any = "dolphin"
  selectedCentralityOne: any = "pagerank"
  selectedCentralityTwo: any = "betweenness"

  currentGraphOneLCC: number = 1
  currentGraphTwoLCC: number = 1

  attackInterval: any = null;
  attackIntervalDelay: number = 250; // in milliseconds
  currentIteration: number = 0
  playing: boolean = false
  resetEnabled: boolean = true

  constructor(
    private api: ApiService,
    private menu: MenuService) {

  }

  ngOnInit(): void {
    this.menu.setActivePage('comparison')
    this._loadNetworksList()
    this._loadCentralitiesList()
  }

  ngAfterViewInit(): void {
    this.loadBothNetworks()
  }

  async loadBothNetworks() {
    this.networkOne = null
    this.networkTwo = null
    this.centralityOne = null
    this.centralityTwo = null
    this.networkOne = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    this.networkTwo = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    this.centralityOne = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentralityOne))
    this.centralityTwo = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentralityTwo))
  }


  // onclick event handler
  public play(): void {
    this.playing = true
    this.attackInterval = setInterval(() => {
      this.step();
    }, this.attackIntervalDelay);
  }

  // onclick event handler
  public step(): void {
    let removeNodeId = null
    removeNodeId = this.centralityOne['nodes'][this.currentIteration]
    this.graphOne.removeNode(removeNodeId)

    removeNodeId = this.centralityTwo['nodes'][this.currentIteration]
    this.graphTwo.removeNode(removeNodeId)

    this.currentIteration++
    this.currentGraphOneLCC = this.centralityOne['largest_component'][this.currentIteration] ? this.centralityOne['largest_component'][this.currentIteration] : 0
    this.currentGraphTwoLCC = this.centralityTwo['largest_component'][this.currentIteration] ? this.centralityTwo['largest_component'][this.currentIteration] : 0
  }

  // onclick event handler
  public reset() {
    this.resetEnabled = false;
    this.pause();
    this.loadBothNetworks();
    this.resetEnabled = true;
    this.graphOne.resetGraph();
    this.graphTwo.resetGraph();
  }

  // onclick event handler
  public pause(): void {
    clearInterval(this.attackInterval)
    this.attackInterval = null
    this.playing = false
  }

  // onclick event handler
  public selectNetwork(e: any) {
    this.selectedNetwork = e.target.value.length ? e.target.value : null
    // this.selectedSigma = null
    // // this.selectedCentrality = null
    // this.pause()
    this.loadBothNetworks()
    this.graphOne.resetGraph();
    this.graphTwo.resetGraph();
  }

  // onclick event handler
  public selectCentralityOne(e: any) {
    this.selectedCentralityOne = e.target.value.length ? e.target.value : null
    // this.selectedSigma = null
    // this.pause()
    this.loadBothNetworks()
    this.graphOne.resetGraph();
  }

  // onclick event handler
  public selectCentralityTwo(e: any) {
    this.selectedCentralityTwo = e.target.value.length ? e.target.value : null
    // this.selectedSigma = null
    // this.pause()
    this.loadBothNetworks()
    this.graphTwo.resetGraph();
  }

  public hasSigmaParameter(centrality: any) {
    return Object.hasOwn(centrality, 'has_sigma')
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

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

  selectedNetwork: any = "lattice"
  selectedCentralityOne: any = "pagerank"
  showSigmaSliderOne: boolean = false
  selectedSigmaOne: any = null;
  selectedCentralityTwo: any = "betweenness"
  showSigmaSliderTwo: boolean = false
  selectedSigmaTwo: any = null;

  currentGraphOneLCC: number = 1
  orderOfRemovalGraphOne: any[] = []
  currentGraphTwoLCC: number = 1
  orderOfRemovalGraphTwo: any[] = []

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
    // this.loadBothNetworks()
    this.loadNetworkOne();
    this.loadNetworkTwo();
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
    if (this.currentIteration >= this.centralityOne['largest_component'].length)
    {
      this.pause()
      return
    }
    if (this.currentIteration >= this.centralityTwo['largest_component'].length)
    {
      this.pause()
      return
    }
    let removeNodeId = null
    removeNodeId = this.orderOfRemovalGraphOne[this.currentIteration]
    this.graphOne.removeNode(removeNodeId)

    removeNodeId = this.orderOfRemovalGraphTwo[this.currentIteration]
    this.graphTwo.removeNode(removeNodeId)

    this.currentIteration++
    this.currentGraphOneLCC = this.centralityOne['largest_component'][this.currentIteration] ? this.centralityOne['largest_component'][this.currentIteration] : 0
    this.currentGraphTwoLCC = this.centralityTwo['largest_component'][this.currentIteration] ? this.centralityTwo['largest_component'][this.currentIteration] : 0
  }

  // onclick event handler
  public reset() {
    this.resetEnabled = false;
    this.pause();
    // this.loadBothNetworks();
    this.loadNetworkOne();
    this.loadNetworkTwo();
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
    this.selectedSigmaOne = null
    this.selectedSigmaTwo = null
    this.pause()
    // this.loadBothNetworks()
    this.loadNetworkOne();
    this.loadNetworkTwo();
    this.graphOne.resetGraph()
    this.graphTwo.resetGraph()
  }

  // onclick event handler
  public selectCentralityOne(e: any) {
    this.selectedCentralityOne = e.target.value.length ? e.target.value : null
    this.selectedSigmaOne = null
    this.pause()
    // this.loadBothNetworks()
    this.loadNetworkOne();
    this.graphOne.resetGraph();
  }

  // onclick event handler+
  public selectCentralityTwo(e: any) {
    this.selectedCentralityTwo = e.target.value.length ? e.target.value : null
    this.selectedSigmaTwo = null
    this.pause()
    // this.loadBothNetworks()
    this.loadNetworkTwo();
    this.graphTwo.resetGraph();
  }

  // onupdate event handler
  public updateSigmaOne(event: any): void {
    this.selectedSigmaOne = event.target.value;
    this.pause()
    this.loadNetworkOne()
    // this.graphOne.resetGraph();

    console.log("updateSigmaOne", this.selectedSigmaOne);
  }

  // onupdate event handler
  public updateSigmaTwo(event: any): void {
    this.selectedSigmaTwo = event.target.value;
    this.pause()
    this.loadNetworkTwo()
    // this.graphTwo.resetGraph();

    console.log("updateSigmaTwo", this.selectedSigmaTwo);
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

  private async loadNetworkOne() {
    this.networkOne = null
    this.centralityOne = null
    this.networkOne = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    var centralityOne: any = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentralityOne))

    // in the case of domirank
    if (this.hasSigmaParameter(centralityOne)) {
      this.showSigmaSliderOne = true
      if (!this.selectedSigmaOne)
        this.selectedSigmaOne = Math.ceil(centralityOne['optimal_sigma'] * 100)
      this.currentGraphOneLCC = centralityOne['centrality'][this.selectedSigmaOne-1]['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphOne = centralityOne['centrality'][this.selectedSigmaOne-1]['nodes']
      this.centralityOne = centralityOne['centrality'][this.selectedSigmaOne-1]
    } else {
      this.showSigmaSliderOne = false
      this.currentGraphOneLCC = centralityOne['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphOne = centralityOne['nodes']
      this.centralityOne = centralityOne
    }

    if (this.currentIteration > 0) {
      this.currentIteration = 0
      this.graphTwo.resetGraph()
    }
  }

  private async loadNetworkTwo() {
    this.networkTwo = null
    this.centralityTwo = null

    this.currentIteration = 0
    this.networkTwo = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    var centralityTwo: any = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentralityTwo))

    // in the case of domirank
    if (this.hasSigmaParameter(centralityTwo)) {
      this.showSigmaSliderTwo = true
      if (!this.selectedSigmaTwo)
        this.selectedSigmaTwo = Math.ceil(centralityTwo['optimal_sigma'] * 100)
      this.currentGraphTwoLCC = centralityTwo['centrality'][this.selectedSigmaTwo-1]['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphTwo = centralityTwo['centrality'][this.selectedSigmaTwo-1]['nodes']
      this.centralityTwo = centralityTwo['centrality'][this.selectedSigmaTwo-1]
    } else {
      this.showSigmaSliderTwo = false
      this.currentGraphTwoLCC = centralityTwo['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphTwo = centralityTwo['nodes']
      this.centralityTwo = centralityTwo
    }

    if (this.currentIteration > 0) {
      this.currentIteration = 0
      this.graphOne.resetGraph()
    }
  }

  private async loadBothNetworks() {
    this.networkOne = null
    this.networkTwo = null
    this.centralityOne = null
    this.centralityTwo = null

    this.currentIteration = 0
    this.networkOne = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    var centralityOne: any = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentralityOne))
    this.networkTwo = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    var centralityTwo: any = await firstValueFrom(this.api.getCentrality(this.selectedNetwork, this.selectedCentralityTwo))

    // in the case of domirank
    if (this.hasSigmaParameter(centralityOne)) {
      this.showSigmaSliderOne = true
      if (!this.selectedSigmaOne)
        this.selectedSigmaOne = Math.ceil(centralityOne['optimal_sigma'] * 100)
      this.currentGraphOneLCC = centralityOne['centrality'][this.selectedSigmaOne-1]['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphOne = centralityOne['centrality'][this.selectedSigmaOne-1]['nodes']
      this.centralityOne = centralityOne['centrality'][this.selectedSigmaOne-1]
    } else {
      this.showSigmaSliderOne = false
      this.currentGraphOneLCC = centralityOne['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphOne = centralityOne['nodes']
      this.centralityOne = centralityOne
    }

    // in the case of domirank
    if (this.hasSigmaParameter(centralityTwo)) {
      this.showSigmaSliderTwo = true
      if (!this.selectedSigmaTwo)
        this.selectedSigmaTwo = Math.ceil(centralityTwo['optimal_sigma'] * 100)
      this.currentGraphTwoLCC = centralityTwo['centrality'][this.selectedSigmaTwo-1]['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphTwo = centralityTwo['centrality'][this.selectedSigmaTwo-1]['nodes']
      this.centralityTwo = centralityTwo['centrality'][this.selectedSigmaTwo-1]
    } else {
      this.showSigmaSliderTwo = false
      this.currentGraphTwoLCC = centralityTwo['largest_component'][this.currentIteration]
      this.orderOfRemovalGraphTwo = centralityTwo['nodes']
      this.centralityTwo = centralityTwo
    }
  }

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

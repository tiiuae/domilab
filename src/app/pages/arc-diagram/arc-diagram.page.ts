import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MenuService } from 'src/app/services/menu.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-arc',
  templateUrl: './arc-diagram.page.html',
  styleUrls: ['./arc-diagram.page.scss']
})
export class ArcDiagramPage implements OnInit, AfterViewInit {
  
  network: any = {nodes: [], links: []}
  options: any = {}
  @ViewChild('arc') arc: any;

  selectedNetwork: any = "dolphins"
  selectedCentrality: any = "domirank"
  selectedSigma: number = 50

  constructor(
    private api: ApiService, 
    private toast: ToastService,
    private menu: MenuService) { 

  }

  ngOnInit(): void {
    this.menu.setActivePage('arc-diagram')
  }

  ngAfterViewInit(): void {
    this.loadNetwork()
  }

  async loadNetwork() {
    var network: any = await firstValueFrom(this.api.getNetwork(this.selectedNetwork))
    this.network = network
    console.log(network);
  }
}

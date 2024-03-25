import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements AfterViewInit {

  @ViewChild('networkContainer') network_container?: ElementRef<any>;
  @Input('network') network: any;
  @Input('centrality') centrality: any;

  private d3_graph: any
  private initial_data: any;
  private height: any;
  private width: any;


  constructor() { }

  ngAfterViewInit() {
    this.height = this.network_container?.nativeElement.offsetHeight;
    this.width = this.network_container?.nativeElement.offsetWidth;
    console.log(this.centrality);

    // add the centrality as the value of each node
    this.network.nodes = this.network.nodes.map((e: any) => {
      e['value'] = this.centrality['values'][e.id]
      return e
    });

    this.initial_data = this.deepCopy(this.network); // deep copy (you can just rebuild onChange)
    this.d3_graph = this.build(this.network);
    this.network_container?.nativeElement.append(this.d3_graph);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // console.log(this.network, this.centrality);
  //   if (this.network && this.centrality) {
  //     this.d3_graph = this.build(this.network, this.centrality);
  //     this.network_container?.nativeElement.append(this.d3_graph);
  //   }
  // }

  public removeNode(nodeId: number) {
    this.network.nodes = this.network.nodes.filter((n: any) => {
      return parseInt(n.id) != nodeId
    })
    this.network.links = this.network.links.filter((l: any) => {
      return parseInt(l.source) != nodeId && parseInt(l.target) != nodeId
    })

    this.d3_graph.update(this.network)
    return this.network
  }

  public resetGraph() {
    this.network_container!.nativeElement.innerHTML = "";
    this.height = this.network_container?.nativeElement.offsetHeight;
    this.width = this.network_container?.nativeElement.offsetWidth;

    this.network = JSON.parse(JSON.stringify(this.initial_data));
    this.d3_graph = this.build(this.network);
    this.network_container?.nativeElement.append(this.d3_graph);
  }

  private build(network: any) {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    // copy nodes and links
    const links = this.deepCopy(network['links'])
    const nodes = this.deepCopy(network['nodes'])

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    var svg = d3.create("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

    var link = svg.append("g")
      .attr("stroke", "#777")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", 1);

    var node = svg.append("g")
      .attr("stroke", "#00C18C")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", (d: any) => `rgba(0, 161, 140, ${d['value']})`);
      // .attr("fill", (d: any) => color(d.group));

    node.append("title")
      .text((d: any) => d.id);

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

      node
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y);
    });

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    const drag: any = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    node.call(drag);

    return Object.assign(svg.node()!, {
      update(network: any) {

        // Make a shallow copy to protect against mutation, while
        // recycling old nodes to preserve position and velocity.
        const old = new Map(node.data().map((d: any) => [d.id, d]));
        var links = network['links'].map((d: any) => Object.assign({}, d));
        var nodes = network['nodes'].map((d: any) => Object.assign(old.get(d.id) || {}, d));

        simulation.nodes(nodes);
        simulation.force<d3.ForceLink<any, any>>("link")!.links(links);
        simulation.alpha(1).restart();

        node = node
          .data(nodes, (d: any) => d.id)
          .join((enter: any) => enter.append("circle"))
          .attr("r", 5)
          .attr("fill", (d: any) => `rgba(0, 161, 140, ${d['value']})`);

        link = link
          .data(links, (d: any) => `${d.source.id}\t${d.target.id}`)
          .join("line")
          .attr("stroke-width", 1);
      }
    });
  }

  private deepCopy(json_obj: any) {
    return JSON.parse(JSON.stringify(json_obj))
  }

}

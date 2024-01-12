import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-network',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements AfterViewInit, OnChanges {

  @Input('network') network: any;
  @Input('centrality') centrality: any;
  @Input('data')
  data: {
    nodes: any[],
    links: any[],
  } | any;

  private d3_graph: any
  private initial_data: any;
  private height: any;
  private width: any;


  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.height = this.elementRef.nativeElement.offsetHeight;
    this.width = this.elementRef.nativeElement.offsetWidth;
    // this.d3_graph = this.build(this.data.nodes, this.data.links);
    this.initial_data = JSON.parse(JSON.stringify(this.data)); // deep copy (you can just rebuild onChange)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.network && this.centrality)
      this.d3_graph = this.build(this.network, this.centrality);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.data = changes['data'].currentValue;
  //   // if (data['nodes'].length == this.data['nodes'].length)
  //   //   return
  //   // d3.select("svg").selectChildren().remove();
  //   // this.build(data['nodes'], data['links']);
  // }

  public build(network: any, centrality: any) {

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // copy nodes and links,
    // and add centrality values to the nodes
    const links = network['links'].map((e: any) => ({...e}));
    const nodes = network['nodes'].map((e: any) => {
      e['value'] = centrality['values'][e.id]
      return e
    });

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    var svg = d3.select("#network")
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
      update({nodes, links}: any) {

        // Make a shallow copy to protect against mutation, while
        // recycling old nodes to preserve position and velocity.
        const old = new Map(node.data().map((d: any) => [d.id, d]));
        nodes = nodes.map((d: any) => Object.assign(old.get(d.id) || {}, d));
        links = links.map((d: any) => Object.assign({}, d));

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

  // public build(nodes: any, links: any) {

  //   const color = d3.scaleOrdinal(d3.schemeCategory10);
  //   // copy nodes and links
  //   const links_copy = links.map((e: any) => ({...e}));
  //   const nodes_copy = nodes.map((e: any) => ({...e}));

  //   const simulation = d3.forceSimulation(nodes_copy)
  //     .force("link", d3.forceLink(links_copy).id((d: any) => d.id))
  //     .force("charge", d3.forceManyBody())
  //     .force("x", d3.forceX())
  //     .force("y", d3.forceY());

  //   var svg = d3.select("svg")
  //     .attr("width", this.width)
  //     .attr("height", this.height)
  //     .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
  //     .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

  //   var link = svg.append("g")
  //     .attr("stroke", "#777")
  //     .attr("stroke-opacity", 0.6)
  //   .selectAll("line")
  //   .data(links_copy)
  //   .join("line")
  //     .attr("stroke-width", 1);

  //   var node = svg.append("g")
  //     .attr("stroke", "#00C18C")
  //     .attr("stroke-width", 1.5)
  //   .selectAll("circle")
  //   .data(nodes_copy)
  //   .join("circle")
  //     .attr("r", 5)
  //     .attr("fill", (d: any) => `rgba(0, 161, 140, ${d['value']})`);
  //     // .attr("fill", (d: any) => color(d.group));

  //   node.append("title")
  //     .text((d: any) => d.id);

  //   // Set the position attributes of links and nodes each time the simulation ticks.
  //   simulation.on("tick", () => {
  //     link
  //         .attr("x1", (d: any) => d.source.x)
  //         .attr("y1", (d: any) => d.source.y)
  //         .attr("x2", (d: any) => d.target.x)
  //         .attr("y2", (d: any) => d.target.y);

  //     node
  //         .attr("cx", (d: any) => d.x)
  //         .attr("cy", (d: any) => d.y);
  //   });

  //   // Reheat the simulation when drag starts, and fix the subject position.
  //   function dragstarted(event: any) {
  //     if (!event.active) simulation.alphaTarget(0.3).restart();
  //     event.subject.fx = event.subject.x;
  //     event.subject.fy = event.subject.y;
  //   }

  //   // Update the subject (dragged node) position during drag.
  //   function dragged(event: any) {
  //     event.subject.fx = event.x;
  //     event.subject.fy = event.y;
  //   }

  //   // Restore the target alpha so the simulation cools after dragging ends.
  //   // Unfix the subject position now that it’s no longer being dragged.
  //   function dragended(event: any) {
  //     if (!event.active) simulation.alphaTarget(0);
  //     event.subject.fx = null;
  //     event.subject.fy = null;
  //   }

  //   const drag: any = d3.drag()
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended)
  //   node.call(drag);

  //   return Object.assign(svg.node()!, {
  //     update({nodes, links}: any) {

  //       // Make a shallow copy to protect against mutation, while
  //       // recycling old nodes to preserve position and velocity.
  //       const old = new Map(node.data().map((d: any) => [d.id, d]));
  //       nodes = nodes.map((d: any) => Object.assign(old.get(d.id) || {}, d));
  //       links = links.map((d: any) => Object.assign({}, d));

  //       simulation.nodes(nodes);
  //       simulation.force<d3.ForceLink<any, any>>("link")!.links(links);
  //       simulation.alpha(1).restart();

  //       node = node
  //         .data(nodes, (d: any) => d.id)
  //         .join((enter: any) => enter.append("circle"))
  //         .attr("r", 5)
  //         .attr("fill", (d: any) => `rgba(0, 161, 140, ${d['value']})`);

  //       link = link
  //         .data(links, (d: any) => `${d.source.id}\t${d.target.id}`)
  //         .join("line")
  //         .attr("stroke-width", 1);
  //     }
  //   });
  // }

  public removeNode(nodeId: number) {
    this.data.nodes = this.data.nodes.filter((n: any) => {
      return parseInt(n.id) != nodeId
    })
    this.data.links = this.data.links.filter((l: any) => {
      return parseInt(l.source) != nodeId && parseInt(l.target) != nodeId
    })

    this.d3_graph.update((this.data))
    return this.data
  }

  public resetGraph() {
    this.height = this.elementRef.nativeElement.offsetHeight;
    this.width = this.elementRef.nativeElement.offsetWidth;

    d3.select("svg").selectChildren().remove();
    this.data = JSON.parse(JSON.stringify(this.initial_data));
    this.d3_graph = this.build(this.data.nodes, this.data.links);
  }


  // PRIVATE METHODS

  private _getNodeElements() {

  }

  private _getLinkElements() {

  }

}

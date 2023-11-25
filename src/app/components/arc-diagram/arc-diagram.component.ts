import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-arc-diagram',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './arc-diagram.component.html',
  styleUrls: ['./arc-diagram.component.scss']
})
export class ArcDiagramComponent implements AfterViewInit {
  
  @Input('data') 
  data: {
    nodes: any[],
    links: any[],
  } | any;

  @Input('options') 
  options: any;

  private d3_graph: any
  private height: any;
  private width: any;

  
  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.height = this.elementRef.nativeElement.offsetHeight;   
    // this.height = 800;   
    this.width = this.elementRef.nativeElement.offsetWidth;
    this.d3_graph = this.build(this.data.nodes, this.data.links)
    // this.d3_graph.update("")
    console.log(this.data);
    
  }

  ngOnChanges(changes: SimpleChanges) {

  }


  public build(nodes: any, links: any) {

    // Specify the chart’s dimensions.
    const step = 16;
    const marginTop = 0;
    const marginRight = 100;
    const marginBottom = 320;
    const marginLeft = 100;
    const width = (nodes.length - 1) * step + marginLeft + marginRight;
    const x: any = d3.scalePoint(this.orders(nodes, links), [marginLeft, this.width - marginRight]);
  
    // A color scale for the nodes and links.
    const color: any = d3.scaleOrdinal()
      .domain(nodes.map((d: any) => d.group).sort(d3.ascending))
      .range(d3.schemeCategory10)
      .unknown("#aaa");
  
    // A function of a link, that checks that source and target have the same group and returns
    // the group; otherwise null. Used to color the links.
    const groups = new Map(nodes.map((d: any) => [d.id, d.group]));
    function samegroup({ source, target }: any) {
      return groups.get(source) === groups.get(target) ? groups.get(source) : null;
    }

    // Create the SVG container.
    const svg: any = d3.select("svg")
        .attr("width", width)
        .attr("height", this.height)
        // .attr("viewBox", [0, 0, this.width, this.height])
        .attr("viewBox", [0, 0, this.width, this.height])
        .attr("style", "width: 100%; height: 100%; height: intrinsic;");
    

    // The current position, indexed by id. Will be interpolated.
    // const Y: any = new Map(nodes.map(({id}: any) => [id, y(id)]));
    const X: any = new Map(nodes.map(({id}: any) => [id, x(id)]));
  
    // Add an arc for each link.
    function arc(d: any) {
      const x1: any = X.get(d.source);
      const x2: any = X.get(d.target);
      const r = Math.abs(x2 - x1) / 2;
      return `M${x1},${marginBottom}A${r},${r} 0,0,${x1 < x2 ? 1 : 0} ${x2},${marginBottom}`;
    }
    const path = svg.insert("g", "*")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(links)
      .join("path")
        .attr("stroke", (d: any) => color(samegroup(d)))
        .attr("d", arc);

    // Add a text label and a dot for each node.
    const label: any = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(nodes)
      .join("g")
        .attr("transform", (d: any) => `translate(${X.get(d.id)},${marginBottom})`)
        .call((g: any) => g.append("text")
            .attr("x", -6)
            .attr("dy", "0.35em")
            .attr("fill", (d: any) => d3.lab(color(d.group)).darker(2))
            .text((d: any) => d.id))
        .call((g: any) => g.append("circle")
            .attr("r", 3)
            .attr("fill", (d: any) => color(d.group)));

    // Add invisible rects that update the class of the elements on mouseover.
    label.append("rect")
        .attr("fill", "none")
        .attr("width", step)
        .attr("height", marginBottom + 40)
        .attr("x", -step / 2)
        .attr("y", -marginBottom)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("pointerenter", (event: any, d: any) => {
          svg.classed("hover", true);
          label.classed("primary", (n: any) => n === d);
          label.classed("secondary", (n: any) => links.some(({source, target}: any) => (
            n.id === source && d.id == target || n.id === target && d.id === source
          )));
          path.classed("primary", (l: any) => l.source === d.id || l.target === d.id).filter(".primary").raise();
        })
        .on("pointerout", () => {
          svg.classed("hover", false);
          label.classed("primary", false);
          label.classed("secondary", false);
          path.classed("primary", false).order();
        });

      // Add styles for the hover interaction.
      svg.append("style").text(`
        .hover text { fill: #aaa; }
        .hover g.primary text { font-weight: bold; fill: #333; }
        .hover g.secondary text { fill: #333; }
        .hover path { stroke: #ccc; }
        .hover path.primary { stroke: #333; }
      `);

    // A function that updates the positions of the labels and recomputes the arcs
    // when passed a new order.
    function update(order: any) {
      x.domain(order);

      label
          .sort((a: any, b: any) => d3.ascending(X.get(a.id), X.get(b.id)))
          .transition()
          .duration(750)
          .delay((d: any, i: any) => i * 20) // Make the movement start from the top.
          .attrTween("transform", (d: any) => {
            const i = d3.interpolateNumber(X.get(d.id), x(d.id));
            return (t: any) => {
              const x = i(t);
              X.set(d.id, x);
              return `translate(${x},${marginBottom})`;
            }
          });

      path.transition()
          .duration(750 + nodes.length * 20) // Cover the maximum delay of the label transition.
          .attrTween("d", (d: any) => () => arc(d));
    }

    return Object.assign(svg.node(), {update});
    
  }

  orders(nodes: any, links: any) {
    const degree = d3.rollup(
      links.flatMap(({ source, target, value }: any) => [
        { node: source, value },
        { node: target, value }
      ]),
      (v: any) => d3.sum(v, ({ value }: any) => value),
      ({ node }: any) => node
    );
    return d3.sort(nodes, ({id}: any) => degree.get(id), ({id}) => id).map(({id}) => id).reverse()
  }

}

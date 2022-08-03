import * as d3 from 'd3';
import { get as lodashGet } from 'lodash-es';

import { Node, Link } from '@graph/models/graph';

export interface ForceGraphRequiredParams {
  nodes: Node[];
  links: Link[];
}

export interface ForceGraphOptionalParams {
  nodeId?: (d: Node) => string;
  nodeGroup?: (d: Node) => string | number;
  nodeGroups?: string[];
  nodeTitle?: (d: Node, i: number) => string;
  nodeFill?: string;
  nodeStroke?: string;
  nodeStrokeWidth?: number;
  nodeStrokeOpacity?: number;
  nodeRadius?: number;
  nodeStrength?: number;
  linkSource?: (l: Link) => string | Node | number;
  linkTarget?: (l: Link) => string | Node | number;
  linkStroke?: string;
  linkStrokeOpacity?: number;
  linkStrokeWidth?: number | ((l: Link) => number);
  linkStrokeLinecap?: string;
  linkStrength?: number;
  colors?: readonly string[];
  width?: number;
  height?: number;
  invalidation?: Promise<void>;
}

function intern(value: any) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

const ticked = (
  link: d3.Selection<d3.BaseType | SVGLineElement, Link, SVGGElement, Node>,
  node: d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGGElement, Node>,
) => () => {
  link
    .attr("x1", d => lodashGet(d, ['source', 'x'], ''))
    .attr("y1", d => lodashGet(d, ['source', 'y'], ''))
    .attr("x2", d => lodashGet(d, ['target', 'x'], ''))
    .attr("y2", d => lodashGet(d, ['target', 'y'], ''));

  node
    .attr("cx", d => lodashGet(d, 'x', ''))
    .attr("cy", d => lodashGet(d, 'y', ''));
}

function drag(simulation: d3.Simulation<Node, Link>): d3.DragBehavior<SVGCircleElement, Node, Node | d3.SubjectPosition> {
  function dragStarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragEnded(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag<SVGCircleElement, Node>()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);
}

// https://observablehq.com/@d3/force-directed-graph
export function ForceGraph({
  nodes, // an iterable of node objects (typically [{id}, …])
  links // an iterable of link objects (typically [{source, target}, …])
}: ForceGraphRequiredParams, {
  nodeId = (d: Node) => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle, // given d in nodes, a title string
  nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
  nodeStroke = "#fff", // node stroke color
  nodeStrokeWidth = 1.5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius = 5, // node radius, in pixels
  nodeStrength,
  linkSource = ({source}) => source, // given d in links, returns a node identifier string
  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  linkStroke = "#999", // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = "round", // link stroke linecap
  linkStrength,
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  invalidation // when this promise resolves, stop the simulation
}: ForceGraphOptionalParams = {}) {
  // Compute values.
  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W: number[] | null = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  const L: string[] | null = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
  links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color: d3.ScaleOrdinal<string, string, string> | null = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups || [], colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody<Node>();
  const forceLink = d3.forceLink<Node, Link>(links).id((d: Node, i) => d.id);
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
  if (linkStrength !== undefined) forceLink.strength(linkStrength);

  const svg: d3.Selection<SVGSVGElement, any, null, any> = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const simulation: d3.Simulation<Node, Link> = d3.forceSimulation(nodes);

  const link: d3.Selection<d3.BaseType | SVGLineElement, Link, SVGGElement, Node> = svg.append("g")
    .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
    .attr("stroke-opacity", linkStrokeOpacity)
    .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
    .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");

  const node: d3.Selection<d3.BaseType | SVGCircleElement, Node, SVGGElement, Node> = svg.append("g")
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-width", nodeStrokeWidth)
    .selectAll("circle")
    .data<Node>(nodes)
    .join<SVGCircleElement>("circle")
    .attr("r", nodeRadius)
    /**
     * TS2345: Argument of type 'DragBehavior<SVGCircleElement, Node, Node | SubjectPosition>' is not assignable to parameter
     * of type '(selection: Selection<BaseType | SVGCircleElement, Node, SVGGElement, any>, ...args: any[]) => void'.
     * ...
     * Type 'BaseType | SVGCircleElement' is not assignable to type 'SVGCircleElement'
     **/
    // @ts-ignore
    .call(drag(simulation));

  simulation
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center",  d3.forceCenter())
    .on("tick", ticked(link, node));

  if (W) link.attr("stroke-width", ({index: i}) => i ? W[i] : '');
  if (L) link.attr("stroke", ({index: i}) => i ? L[i] : '');
  if (G) node.attr("fill", ({index: i}) => color && i ? color(G[i]) : '');
  if (T) node.append("title").text(({index: i}) => i ? T[i] : '');
  if (invalidation) invalidation.then(() => simulation.stop());

  return Object.assign(svg.node() || ({} as SVGSVGElement), {scales: {color}});
}

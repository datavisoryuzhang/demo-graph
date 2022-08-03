import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export interface Node extends SimulationNodeDatum {
  id: string;
  group?: string | number;
}

export interface Link extends SimulationLinkDatum<Node> {
  value?: number;
}

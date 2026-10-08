import { Status } from '../types/status';

export type NodeEventType = 'task' | 'result';
export type LinkType = 'parent' | 'dependency' | 'output' | 'payload';


export interface ArmoniKGraphNode {
  id: string;
  status: Status;
  type: NodeEventType;
  /** Where the layout placed it, undefined until it did. */
  x?: number;
  y?: number;
}

export interface GraphLink<N extends ArmoniKGraphNode> {
  source: string | N;
  target: string | N;
  type: LinkType;
}

export type GraphData<N extends ArmoniKGraphNode, L extends GraphLink<N>> = {
  nodes: N[],
  links: L[]
};

export type GraphUpdate = GraphData<ArmoniKGraphNode, GraphLink<ArmoniKGraphNode>> & {
  /** 'status' when only statuses changed: nothing needs to be placed again. */
  kind: 'structure' | 'status';
};

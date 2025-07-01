import { LinkObject, NodeObject } from 'force-graph';
import { Status } from '../types/status';

export type NodeEventType = 'task' | 'session' | 'result';
export type LinkType = 'parent' | 'dependency' | 'output';


export interface ArmoniKGraphNode extends NodeObject {
  id: string;
  status: Status;
  type: NodeEventType;
}

export interface GraphLink<N extends ArmoniKGraphNode> extends LinkObject<N> {
  type: LinkType;
}

export type GraphData<N extends ArmoniKGraphNode, L extends GraphLink<N>> = {
  nodes: N[],
  links: L[]
};
import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { GraphSelectedNodeComponent } from './graph-selected-node.component';

describe('GraphSelectedNodeComponent', () => {
  let component: GraphSelectedNodeComponent<ArmoniKGraphNode>;

  const inputNode: ArmoniKGraphNode = {
    id: 'abc',
    type: 'task',
    status: TaskStatus.TASK_STATUS_CREATING
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        GraphSelectedNodeComponent,
      ],
    }).inject(GraphSelectedNodeComponent);
    component.node = inputNode;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the input value', () => {
      expect(component.node).toBe(inputNode);
    });
  });
});
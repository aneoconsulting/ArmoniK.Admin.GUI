import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { IconsService } from '@services/icons.service';
import { InspectNodeComponent } from './inspect-node.component';
import { NodeStatusService } from './services/node-status.service';

describe('InspectNodeComponent', () => {
  let component: InspectNodeComponent<ArmoniKGraphNode>;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const mockClipboard = {
    copy: jest.fn(),
  };

  const mockNodeStatusService = {
    getNodeStatusData: jest.fn(),
  };

  const node = {
    id: 'id'
  } as ArmoniKGraphNode;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectNodeComponent,
        { provide: IconsService, useValue: mockIconsService },
        { provide: Clipboard, useValue: mockClipboard },
        { provide: NodeStatusService, useValue: mockNodeStatusService },
      ],
    }).inject(InspectNodeComponent);
    component.ngOnInit();
    component.node = node;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should subscribe to copySubject', () => {
      expect(component['copySubject'].observed).toBeTruthy();
    });

    it('should set "copy" as the default copy icon', () => {
      expect(component.copyIcon()).toEqual('copy');
    });
  });

  it('should get icon', () => {
    const icon = 'icon';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });

  describe('copy', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      component.copy();
    });
    it('should copy the node id', () => {
      expect(mockClipboard.copy).toHaveBeenCalledWith(node.id);
    });

    it('should update the copy icon to "success"', () => {
      expect(component.copyIcon()).toEqual('success');
    });

    it('should update the copy icon back to "copy" after 2 seconds', () => {
      jest.advanceTimersByTime(2000);
      expect(component.copyIcon()).toEqual('copy');
    });
  });

  it('should emit on close', () => {
    const spy = jest.spyOn(component.closePanel, 'emit');
    component.onClose();
    expect(spy).toHaveBeenCalled();
  });

  describe('On destroy', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should unsubscribe', () => {
      expect(component['subscriptions'].closed).toBeTruthy();
    });
  });
});
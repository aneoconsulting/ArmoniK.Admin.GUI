import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ErrorStatus,
  Pagination,
  PendingStatus,
  TaskStatus,
} from '@armonik.admin.gui/armonik-typing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../../../../../../core';
import {
  TaskStatusFilterComponent,
  AutoRefreshActivatorComponent,
  TimerIntervalSelectorComponent,
} from '../../../../../../../shared';
import { TasksListComponent } from './tasks-list.component';

describe('TasksListComponent', () => {
  const taskId = 'task-id';
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TasksListComponent,
        TaskStatusFilterComponent,
        AutoRefreshActivatorComponent,
        TimerIntervalSelectorComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ClarityModule,
        UiModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input', () => {
    it('should have "isAutoRefreshEnabled" set to null', () => {
      expect(component.isAutoRefreshEnabled).toBeNull();
    });

    it('should have "autoRefreshTimer" set to null', () => {
      expect(component.autoRefreshTimer).toBeNull();
    });

    it('should have "tasks" set to null', () => {
      expect(component.tasks).toBeNull();
    });

    it('should have "loading" set to true', () => {
      expect(component.loading).toBeTruthy();
    });

    it('should have "selection" set to empty array', () => {
      expect(component.selection).toEqual([]);
    });

    it('should have "cancelButtonState" set to "DEFAULT"', () => {
      expect(component.cancelButtonState).toEqual(ClrLoadingState.DEFAULT);
    });

    it('should have "isSeqUp" set to false', () => {
      expect(component.isSeqUp).toBeFalsy();
    });
  });

  describe('onClickSeqLink', () => {
    it('should emit event when click on seq link', () => {
      const clickSeqLink = { emit: jasmine.createSpy('emit') };
      const event = new Event('click');

      component.clickSeqLink = clickSeqLink as unknown as EventEmitter<string>;
      component.onClickSeqLink(event, taskId);
      expect(clickSeqLink.emit).toHaveBeenCalledWith(taskId);
    });
  });

  describe('auto refresh', () => {
    it('should emit event when auto refresh change', () => {
      const autoRefreshChange = { emit: jasmine.createSpy('emit') };

      component.autoRefreshChange =
        autoRefreshChange as unknown as EventEmitter<void>;
      component.onAutoRefreshChange();
      expect(autoRefreshChange.emit).toHaveBeenCalled();
    });

    it('should emit event when auto refresh timer change', () => {
      const autoRefreshTimerChange = { emit: jasmine.createSpy('emit') };

      component.autoRefreshTimerChange =
        autoRefreshTimerChange as unknown as EventEmitter<number>;
      component.onAutoRefreshTimerChange(1);
      expect(autoRefreshTimerChange.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('tasks', () => {
    it('should get total tasks count', () => {
      component.tasks = {
        meta: {
          total: 10,
        },
      } as Pagination<Task>;
      expect(component.totalTasks).toEqual(10);
    });

    it('should return 0 when tasks is null', () => {
      component.tasks = null;
      expect(component.totalTasks).toEqual(0);
    });

    it('should return task id when track by', () => {
      const task = { _id: taskId } as Task;
      expect(component.trackByTask(0, task)).toEqual(taskId);
    });

    describe('status', () => {
      ErrorStatus.forEach((status) => {
        it(`should return "true" when status is an error ${status}`, () => {
          const task = { status } as Task;
          expect(component.isError(task)).toBeTruthy();
        });
      });

      PendingStatus.forEach((status) => {
        it(`should return "true" when status is in pending ${status}`, () => {
          const task = { status } as Task;
          expect(component.isPending(task)).toBeTruthy();
        });
      });

      it('should return "false" when status is not an error or pending', () => {
        const task = { status: TaskStatus.CANCELLED } as Task;
        expect(component.isError(task)).toBeFalsy();
        expect(component.isPending(task)).toBeFalsy();
      });

      it('should return "true" when status is completed', () => {
        const task = { status: TaskStatus.COMPLETED } as Task;
        expect(component.isCompleted(task)).toBeTruthy();
      });

      it('should return "false" when status is not completed', () => {
        const task = { status: TaskStatus.CANCELLED } as Task;
        expect(component.isCompleted(task)).toBeFalsy();
      });

      it('should return "true" when status is cancelling', () => {
        const task = { status: TaskStatus.CANCELLING } as Task;
        expect(component.isCancelling(task)).toBeTruthy();
      });

      it('should return "false" when status is not cancelling', () => {
        const task = { status: TaskStatus.CANCELLED } as Task;
        expect(component.isCancelling(task)).toBeFalsy();
      });

      it('should return "true" when status is cancelled', () => {
        const task = { status: TaskStatus.CANCELLED } as Task;
        expect(component.isCancelled(task)).toBeTruthy();
      });

      it('should return "false" when status is not cancelled', () => {
        const task = { status: TaskStatus.COMPLETED } as Task;
        expect(component.isCancelled(task)).toBeFalsy();
      });

      it('should return "true" when status is processing', () => {
        const task = { status: TaskStatus.PROCESSING } as Task;
        expect(component.isProcessing(task)).toBeTruthy();
      });

      it('should return "false" when status is not processing', () => {
        const task = { status: TaskStatus.COMPLETED } as Task;
        expect(component.isProcessing(task)).toBeFalsy();
      });
    });
  });

  describe('ui', () => {
    it('should emit an event when click on cancel button', () => {
      const cancel = { emit: jasmine.createSpy('emit') };
      component.cancelTasksChange = cancel as unknown as EventEmitter<Task[]>;

      const cancelButton =
        fixture.nativeElement.querySelector('.cancel-button');
      cancelButton.click();

      expect(cancel.emit).toHaveBeenCalled();
    });

    it('should emit an event when click on refresh button', () => {
      const refresh = { emit: jasmine.createSpy('emit') };
      component.manualRefresh = refresh as unknown as EventEmitter<void>;

      const refreshButton =
        fixture.nativeElement.querySelector('.refresh-button');
      refreshButton.click();

      expect(refresh.emit).toHaveBeenCalled();
    });

    describe('Seq link', () => {
      it('should emit an event on click', () => {
        // Seq must be up to enable this feature
        component.isSeqUp = true;
        component.tasks = {
          data: [{ _id: taskId, status: TaskStatus.ERROR }],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        const seq = { emit: jasmine.createSpy('emit') };
        component.clickSeqLink = seq as unknown as EventEmitter<string>;

        const seqLink = fixture.nativeElement.querySelector('.seq-link');
        seqLink.click();

        expect(seq.emit).toHaveBeenCalledWith(taskId);
      });

      it('should be shown when task is in error', () => {
        // Seq must be up to enable this feature
        component.isSeqUp = true;
        component.tasks = {
          data: [{ _id: taskId, status: TaskStatus.ERROR }],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        const seqLink = fixture.nativeElement.querySelector('.seq-link');

        expect(seqLink).toBeTruthy();
      });

      it('should be hide when there is no task error', () => {
        // Seq must be up to enable this feature
        component.isSeqUp = true;
        component.tasks = {
          data: [{ _id: taskId, status: TaskStatus.COMPLETED }],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        const seqLink = fixture.nativeElement.querySelector('.seq-link');
        expect(seqLink).toBeFalsy();
      });
    });

    describe('modal', () => {
      it('should have a disabled detail button when task is not in error', () => {
        component.tasks = {
          data: [{ _id: taskId, status: TaskStatus.COMPLETED }],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        const detailButton = fixture.nativeElement.querySelector('.btn-detail');
        expect(detailButton.disabled).toBeTruthy();
      });

      it('should have a enabled detail button when task is in error', () => {
        component.tasks = {
          data: [{ _id: taskId, status: TaskStatus.ERROR }],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        const detailButton = fixture.nativeElement.querySelector('.btn-detail');
        expect(detailButton.disabled).toBeFalsy();
      });

      it('should open modal when click on detail button', () => {
        const task = { _id: taskId, status: TaskStatus.ERROR } as Task;
        component.tasks = {
          data: [task],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        spyOn(component, 'openModal');

        const detailButton = fixture.nativeElement.querySelector('.btn-detail');
        detailButton.click();

        expect(component.openModal).toHaveBeenCalledWith(task);
      });

      it('should have error of clicked task in modal body', () => {
        const error = 'error';
        const task = {
          _id: taskId,
          status: TaskStatus.ERROR,
          output: { error },
        } as Task;
        component.tasks = {
          data: [task],
          meta: { total: 1 },
        } as Pagination<Task>;
        fixture.detectChanges();

        fixture.nativeElement.querySelector('.btn-detail').click();

        fixture.detectChanges();

        const modalBody = fixture.nativeElement.querySelector('.modal-body');
        expect(modalBody.innerText).toContain(error);
      });
    });
  });
});

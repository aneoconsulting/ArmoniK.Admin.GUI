import { HttpParams } from '@angular/common/http';
import { of, Subscription, throwError } from 'rxjs';
import { Task } from '../../models';
import { ApiService } from './api.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const taskId = '1#4';
  const taskId_2 = '2#4';

  let service: TasksService;
  let http: jasmine.SpyObj<ApiService>;
  let subscription: Subscription;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get', 'put']);
    service = new TasksService(http);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPaginated', () => {
    it('should get all tasks', (done) => {
      http.get.and.returnValue(of({}));

      subscription = service.getAllPaginated(new HttpParams()).subscribe({
        next: () => {
          expect(http.get).toHaveBeenCalledWith('/api/tasks', new HttpParams());
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should get all tasks error', (done) => {
      const error = { status: 404 };

      http.get.and.returnValue(throwError(() => error));

      subscription = service.getAllPaginated(new HttpParams()).subscribe({
        next: () => {
          done.fail('should not be called');
        },
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });

  describe('getOne', () => {
    it('should get one task', (done) => {
      http.get.and.returnValue(of({}));

      subscription = service.getOne(taskId).subscribe({
        next: () => {
          expect(http.get).toHaveBeenCalledWith(
            '/api/tasks/' + encodeURIComponent(taskId)
          );
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should get one task error', (done) => {
      const error = { status: 404 };

      http.get.and.returnValue(throwError(() => error));

      subscription = service.getOne(taskId).subscribe({
        next: () => {
          done.fail('should not be called');
        },
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });

  describe('cancelMany', () => {
    it('should cancel many tasks', (done) => {
      http.put.and.returnValue(of({}));

      const tasks = [{ id: taskId }, { id: taskId_2 }] as Task[];
      const tasksId = tasks.map((task) => task.id);
      subscription = service.cancelMany(tasks).subscribe({
        next: () => {
          expect(http.put).toHaveBeenCalledWith('/api/tasks/cancel-many', {
            tasksId,
          });
          done();
        },
        error: () => {
          done.fail('should not be called');
        },
      });
    });

    it('should cancel task error', (done) => {
      const error = { status: 404 };

      http.put.and.returnValue(throwError(() => error));

      subscription = service.cancelMany([]).subscribe({
        next: () => {
          done.fail('should not be called');
        },
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });
});

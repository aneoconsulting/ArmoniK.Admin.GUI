import { HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Task } from '../../models';
import { ApiService } from './api.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let http: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    http = jasmine.createSpyObj('ApiService', ['get', 'put']);
    service = new TasksService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks', (done) => {
    http.get.and.returnValue(of({}));

    service.getAllPaginated(new HttpParams()).subscribe({
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

    service.getAllPaginated(new HttpParams()).subscribe({
      next: () => {
        done.fail('should not be called');
      },
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should get one task', (done) => {
    http.get.and.returnValue(of({}));

    const taskId = '1#4';
    service.getOne(taskId).subscribe({
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

    service.getOne('1').subscribe({
      next: () => {
        done.fail('should not be called');
      },
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should cancel many tasks', (done) => {
    http.put.and.returnValue(of({}));

    const tasks = [{ _id: '1' }, { _id: '2' }] as Task[];
    const tasksId = tasks.map((task) => task._id);
    service.cancelMany(tasks).subscribe({
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

    service.cancelMany([]).subscribe({
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

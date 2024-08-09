import { TaskRaw } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { InspectionListGridComponent } from './inspection-list-grid.component';

describe('InspectionListGridComponent', () => {
  const component = new InspectionListGridComponent<TaskRaw>();

  const data: TaskRaw = {
    id: 'taskId',
    dataDependencies: ['1', '2', '3'],
    expectedOutputIds: ['4', '5', '6']
  } as TaskRaw;

  const arrays: Field<TaskRaw>[] = [
    {
      key: 'dataDependencies'
    },
    {
      key: 'expectedOutputIds'
    }
  ];

  beforeEach(() => {
    component.data = data;
    component.arrays = arrays;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set data', () => {
      expect(component.data).toEqual(data);
    });

    it('should set arrays', () => {
      expect(component.arrays).toEqual(arrays);
    });
  });

  describe('get Array', () => {
    it('should return the correct array', () => {
      expect(component.getArray(arrays[0].key)).toEqual(data.dataDependencies);
    });
  });
});
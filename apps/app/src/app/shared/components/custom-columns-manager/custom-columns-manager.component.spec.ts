import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { first } from 'rxjs';
import { CustomColumnsManagerComponent } from './custom-columns-manager.component';

describe('CustomColumnsManagerComponent', () => {
  let component: CustomColumnsManagerComponent;
  let fixture: ComponentFixture<CustomColumnsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomColumnsManagerComponent],
      imports: [TranslateModule.forRoot(), ClarityModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomColumnsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal to add a column', () => {
    component.isModalAddColumnOpened$.pipe(first()).subscribe((isOpen) => {
      expect(isOpen).toBeTruthy();
    });

    component.openModalAddColumn();
  });

  it('should close modal to add a column', () => {
    component.isModalAddColumnOpened$.pipe(first()).subscribe((isOpen) => {
      expect(isOpen).toBeFalsy();
    });

    component.closeModalAddColumn();
  });

  it('should open modal to manage columns', () => {
    component.isModalManageColumnsOpened$.pipe(first()).subscribe((isOpen) => {
      expect(isOpen).toBeTruthy();
    });

    component.openModalManageColumns();
  });

  it('should close modal to manage columns', () => {
    component.isModalManageColumnsOpened$.pipe(first()).subscribe((isOpen) => {
      expect(isOpen).toBeFalsy();
    });

    component.closeModalManageColumns();
  });

  it('should reset new column name when modal close', () => {
    component.newColumnName = 'test';

    component.closeModalAddColumn();

    expect(component.newColumnName).toBe('');
  });

  it('should add a column and emit value', () => {
    component.addColumnChange.pipe(first()).subscribe((columnName) => {
      expect(columnName).toBe('test');
    });

    component.newColumnName = 'test';
    component.addColumn();
  });

  it('should remove a column and emit value', () => {
    component.removeColumnChange.pipe(first()).subscribe((columnName) => {
      expect(columnName).toBe('test');
    });

    component.removeColumn('test');
  });
});

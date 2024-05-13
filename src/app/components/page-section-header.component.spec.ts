import { PageSectionHeaderComponent } from './page-section-header.component';

describe('PageSectionHeaderComponent', () => {
  const component = new PageSectionHeaderComponent();
  const icon = 'session';
  component.icon = icon;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an icon property', () => {
    expect(component.icon).toEqual(icon);
  });
});

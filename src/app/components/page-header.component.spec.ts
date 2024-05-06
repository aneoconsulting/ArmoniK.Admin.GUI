import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  const component = new PageHeaderComponent();
  const sharableURL = 'https://example.com/';
  component.sharableURL = sharableURL;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a sharableURL property', () => {
    expect(component.sharableURL).toEqual(sharableURL);
  });
});
import { Environment, EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  const service = new EnvironmentService();

  const environment: Environment = {
    color: 'red',
    description: 'description',
    name: 'test',
    version: '1.0.0-test'
  };

  it('should have an undefined environment configuration', () => {
    expect(service.getEnvironment()).toBeUndefined();
  });

  it('should set the environment configuration', () => {
    service.setEnvironment(environment);
    expect(service.getEnvironment()).toEqual(environment);
  });
});
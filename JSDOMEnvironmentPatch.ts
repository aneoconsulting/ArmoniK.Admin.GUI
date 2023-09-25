import JSDOMEnvironment from 'jest-environment-jsdom';

export default class JSDOMEnvironmentPatch extends JSDOMEnvironment {
  constructor(
    ...args: ConstructorParameters<typeof JSDOMEnvironment>
  ) {
    super(...args);

    this.global.structuredClone = structuredClone;
  }
}

import { startApplication } from './app';

describe('Should export application', () => {

  beforeEach(()=> {
  });

  test('should define function', ()=> {
    expect(startApplication).toBeDefined();
  });
});

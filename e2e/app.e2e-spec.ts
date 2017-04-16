import { MeangularTodosPage } from './app.po';

describe('meangular-todos App', () => {
  let page: MeangularTodosPage;

  beforeEach(() => {
    page = new MeangularTodosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

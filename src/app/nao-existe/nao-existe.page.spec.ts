import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NaoExistePage } from './nao-existe.page';

describe('NaoExistePage', () => {
  let component: NaoExistePage;
  let fixture: ComponentFixture<NaoExistePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NaoExistePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

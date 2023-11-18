import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { ChipsTestComponent } from './components/chips-test/chips-test.component';

const routes: Routes = [
  {
    path: '',
    component: TestComponent,
  },
  {
    path: 'chips',
    component: ChipsTestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/chips-test/chips-test.component').then(
        (m) => m.ChipsTestComponent,
      ),
  },
]

import { NgModule } from '@angular/core';

import { ChipComponent } from './components/chip/chip.component';
import { ChipsGroupComponent } from './components/chips-group/chips-group.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ChipComponent, ChipsGroupComponent],
  imports: [CommonModule],
  exports: [ChipComponent, ChipsGroupComponent],
})
export class UiModule {}

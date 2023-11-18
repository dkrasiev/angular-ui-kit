import {
  AfterViewInit,
  Input,
  Component,
  ContentChildren,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { asValueAccessor } from '../../tokens/as-value-accessor';
import { ChipComponent } from '../chip/chip.component';
import { EMPTY_FUNCTION } from '../../models/empty-function';

@Component({
  selector: 'app-chips-group',
  templateUrl: './chips-group.component.html',
  styleUrls: ['./chips-group.component.scss'],
  providers: [asValueAccessor(ChipsGroupComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsGroupComponent<T>
  implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input()
  set value(value: T | undefined) {
    this.value$.next(value);

    this.onChange(this.value);
    this.syncChips();
  }

  get value(): T | undefined {
    return this.value$.value;
  }

  @Input()
  uncheckable = false;

  @ContentChildren(ChipComponent, { descendants: true })
  private chips: ChipComponent<T>[] = [];

  value$ = new BehaviorSubject<T | undefined>(undefined);

  private onChange: (value: T | undefined) => void = EMPTY_FUNCTION;
  private onTouched: () => void = EMPTY_FUNCTION;

  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.chips.forEach((chip) => {
      chip.change.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (this.uncheckable && this.value === chip.value) {
          this.value = undefined;
          return;
        }

        this.value = chip.value;
      });

      chip.blur.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.onTouched();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- ControlValueAccessor ---
  writeValue(value: T): void {
    this.value = value;
  }
  registerOnChange(onChange: (value: T | undefined) => void): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
  // --- ControlValueAccessor ---

  private syncChips(): void {
    this.chips.forEach((chip) => {
      chip.checked = chip.value === this.value;
    });
  }
}

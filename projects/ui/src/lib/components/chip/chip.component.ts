import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { EMPTY_FUNCTION } from '../../models/empty-function';
import { asValueAccessor } from '../../tokens/as-value-accessor';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  providers: [asValueAccessor(ChipComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent<T> implements ControlValueAccessor {
  @Input()
  set value(value: T | undefined) {
    this.value$.next(value);
  }

  get value(): T | undefined {
    return this.value$.value;
  }

  @Input()
  set checked(checked: boolean) {
    this.checked$.next(checked);
  }

  get checked(): boolean {
    return this.checked$.value;
  }

  @Output()
  change = new EventEmitter<boolean>();

  @Output()
  blur = new EventEmitter<void>();

  value$ = new BehaviorSubject<T | undefined>(undefined);
  checked$ = new BehaviorSubject<boolean>(false);

  private onChange: (value: boolean) => void = EMPTY_FUNCTION;
  private onTouched: () => void = EMPTY_FUNCTION;

  onClick(): void {
    this.checked = !this.checked;

    this.onChange(this.checked);
    this.change.emit(this.checked);
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  // --- ControlValueAccessor ---
  writeValue(value: boolean): void {
    this.checked = value;
  }
  registerOnChange(onChange: (value: boolean) => void): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
  // --- ControlValueAccessor ---
}

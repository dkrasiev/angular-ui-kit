import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor } from '@angular/forms'
import { BehaviorSubject, Subject, combineLatest, debounceTime } from 'rxjs'

import { EMPTY_FUNCTION } from '../../models/empty-function'
import { asValueAccessor } from '../../tokens/as-value-accessor'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [AsyncPipe],
  providers: [asValueAccessor(ChipComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .chip {
        display: block;

        color: var(--default-color);
        background: var(--default-bg);

        padding: 0.5rem 1rem;

        height: 24px;

        line-height: 24px;
        width: fit-content;

        border: 1px solid var(--secondary-color);
        border-radius: 0.5rem;

        cursor: pointer;

        &_disabled {
          color: var(--disabled-color);
          background: var(--disabled-bg);
          cursor: not-allowed;
        }

        &_checked {
          color: var(--active-color);
          background: var(--active-bg);
        }
      }
    `,
  ],
  template: `
    <label
      class="chip"
      [class.chip_checked]="checked$ | async"
      [class.chip_disabled]="disabled$ | async"
      (click)="click.emit()"
      (blur)="blur.emit()"
    >
      <input
        type="radio"
        [style.display]="'none'"
        [checked]="checked$ | async"
        [disabled]="disabled$ | async"
        (click)="$event.stopPropagation()"
      />
      <ng-content />
    </label>
  `,
})
export class ChipComponent<T> implements ControlValueAccessor {
  // inputs
  @Input() set value(value: T | null) {
    this.value$.next(value)
  }
  get value() {
    return this.value$.value
  }
  @Input() set checked(checked: boolean) {
    this.checked$.next(checked)
  }
  get checked() {
    return this.checked$.value
  }
  @Input() set disabled(disabled: boolean) {
    this.disabled$.next(disabled)
  }
  get disabled() {
    return this.disabled$.value
  }

  // outputs
  @Output() change = new EventEmitter<boolean>()
  @Output() blur = new EventEmitter<void>()
  @Output() click = new EventEmitter<void>()

  // state
  value$ = new BehaviorSubject<T | null>(null)
  checked$ = new BehaviorSubject<boolean>(false)
  disabled$ = new BehaviorSubject<boolean>(false)

  // for value accessor
  private onChange: (value: boolean) => void = EMPTY_FUNCTION
  private onTouched: () => void = EMPTY_FUNCTION

  constructor(private cd: ChangeDetectorRef) {
    this.click.pipe(takeUntilDestroyed()).subscribe(() => {
      const nextValue = !this.checked$.value
      this.checked$.next(nextValue)

      this.change.emit(nextValue)
      this.onChange(nextValue)
    })

    this.blur.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onTouched()
    })
  }

  // --- ControlValueAccessor ---
  writeValue(value: boolean): void {
    this.checked = value
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled
  }
  registerOnChange(onChange: (value: boolean) => void): void {
    this.onChange = onChange
  }
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched
  }
  // --- ControlValueAccessor ---
}

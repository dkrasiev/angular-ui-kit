import {
  AfterViewInit,
  Input,
  Component,
  ContentChildren,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Injector,
  runInInjectionContext,
} from '@angular/core'
import { ControlValueAccessor } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'

import { asValueAccessor } from '../../tokens/as-value-accessor'
import { ChipComponent } from '../chip/chip.component'
import { EMPTY_FUNCTION } from '../../models/empty-function'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-chips-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [asValueAccessor(ChipsGroupComponent)],
  template: ` <ng-content />`,
})
export class ChipsGroupComponent<T>
  implements ControlValueAccessor, AfterViewInit {
  @Input() set value(value: T | null) {
    this.value$.next(value)
  }
  get value() {
    return this.value$.value
  }
  @Input() set disabled(disabled: boolean) {
    this.disabled$.next(disabled)
  }
  get disabled() {
    return this.disabled$.value
  }
  @Input() uncheckable = false

  @ContentChildren(ChipComponent, { descendants: true })
  private chips: ChipComponent<T>[] = []

  @Output() change = new EventEmitter<T | null>()
  @Output() blur = new EventEmitter<void>()

  // state
  value$ = new BehaviorSubject<T | null>(null)
  disabled$ = new BehaviorSubject<boolean>(false)

  private onChange: (value: T | null) => void = EMPTY_FUNCTION
  private onTouched: () => void = EMPTY_FUNCTION

  constructor(private injector: Injector) {
    // sync state with child chips
    this.value$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.syncChecked(value)
    })
    this.disabled$.pipe(takeUntilDestroyed()).subscribe((isDisabled) => {
      this.syncDisabled(isDisabled)
    })

    // sync with ValueAccessor
    this.change.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value)
    })
    this.blur.pipe(takeUntilDestroyed()).subscribe(() => {
      this.onTouched()
    })
  }

  ngAfterViewInit(): void {
    runInInjectionContext(this.injector, () => {
      this.chips.forEach((c) => {
        c.change.pipe(takeUntilDestroyed()).subscribe(() => {
          let value = c.value

          if (this.uncheckable && this.value === c.value) {
            value = null
          }

          this.value$.next(value)
          this.change.emit(value)
        })

        c.blur.pipe(takeUntilDestroyed()).subscribe(() => {
          this.blur.emit()
        })
      })
    })
  }

  // --- ControlValueAccessor ---
  writeValue(value: T): void {
    this.value = value
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled
  }
  registerOnChange(onChange: (value: T | null) => void): void {
    this.onChange = onChange
  }
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched
  }
  // --- ControlValueAccessor ---

  private syncChecked(value: T | null): void {
    this.chips.forEach((c) => {
      c.checked = c.value === value
    })
  }
  private syncDisabled(disabled: boolean): void {
    this.chips.forEach((c) => {
      c.disabled = disabled
    })
  }
}

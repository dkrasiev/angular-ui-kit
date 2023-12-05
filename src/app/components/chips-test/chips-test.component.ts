import { JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { ChipComponent, ChipsGroupComponent } from 'ui'

@Component({
  selector: 'app-chips-test',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, ChipComponent, ChipsGroupComponent],
  template: `
    <div class="row" [formGroup]="form">
      <app-chip formControlName="uncheckable"> uncheckable </app-chip>

      <app-chips-group
        formControlName="value"
        [uncheckable]="form.get('uncheckable')?.value ?? false"
      >
        @for (item of data; track item.key) {
        <app-chip [value]="item.key">
          {{ item.key }}
        </app-chip>
        }
      </app-chips-group>

      <div>
        <div>
          {{ form.value | json }}
        </div>
      </div>

      <div>
        <app-chip [value]="123" [checked]="true">some chip</app-chip>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsTestComponent {
  form = this.fb.group({
    uncheckable: this.fb.control(false),
    value: this.fb.control(null),
  })

  data = new Array(10).fill(null).map((_, i) => ({ key: `Item ${i}` }))

  constructor(private fb: FormBuilder) { }
}

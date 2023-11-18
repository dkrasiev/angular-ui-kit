import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-chips-test',
  templateUrl: './chips-test.component.html',
  styleUrls: ['./chips-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsTestComponent {
  form = this.fb.group({
    uncheckable: this.fb.control(false),
    value: this.fb.control(null),
  });

  data = new Array(10).fill(null).map((_, i) => ({ key: `Item ${i}` }));

  constructor(private fb: FormBuilder) {
    // let k: number = 0;
    // interval(100).subscribe(() => {
    //   if (k === this.data.length) {
    //     k = 0;
    //   }
    //
    //   const data = this.data.at(k++);
    //
    //   if (data) {
    //     this.chipsGroupControl.setValue(data.key);
    //   }
    // });
  }
}

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

interface Item {
  key: string;
  items?: Item[];
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  form = this.fb.group({
    main: this.fb.control(null),
    secondary: this.fb.control(null),
  });

  data = [
    {
      key: 'key1',
      count: 123,
      items: this.generateArray(5).map((item) => ({
        ...item,
        items: this.generateArray(5),
      })),
    },
    {
      key: 'key2',
      count: 321,
      items: this.generateArray(5),
    },
    {
      key: 'key3',
      count: 12,
      items: this.generateArray(5),
    },
    {
      key: 'key4',
      count: 23,
      items: this.generateArray(5),
    },
  ] as const;

  constructor(private fb: FormBuilder) {
    this.form.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  onSubmit(_e?: SubmitEvent) {
    console.log(this.form.value);
  }

  private generateArray(k: number): Item[] {
    return new Array(k).fill(null).map((_, i) => ({ key: `Item ${i}` }));
  }
}

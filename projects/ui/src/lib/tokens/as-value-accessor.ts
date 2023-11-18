import { Provider, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export function asValueAccessor(
  useExisting: Type<ControlValueAccessor>,
): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting,
    multi: true,
  };
}

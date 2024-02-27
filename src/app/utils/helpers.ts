import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export function arrayToMap<T>(array: T[], keyProp: string): Record<string, T> {
  return array.reduce((map: Record<string, T>, item: any) => {
    map[item[keyProp]] = item;
    return map;
  }, {});
}

export function pick<T, K extends keyof T>(obj: T, props: K[]): Partial<T> {
  const result: Partial<T> = {};

  for (const prop of props) {
    if (obj[prop]) {
      result[prop] = obj[prop];
    }
  }

  return result;
}

/**
 * An util to delay function execution to reduce calls
 * @param func A function to delay
 * @param context A context where a func is called
 * @param timeout A delay value of function execution
 */
export function debounce(func: any, context: any, timeout = 500) {
  let timer: any;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, timeout);
  };
}

/**
 * Get the first synchronous value from observable or null
 */
export function snapshot<T>(observable: Observable<T>): Nullable<T> {
  let result: Nullable<T> = null;

  const sub = observable.pipe(take(1)).subscribe((value) => {
    result = value;
  });
  sub.unsubscribe();

  return result;
}

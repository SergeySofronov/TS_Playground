/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Тренировка Infer
function foo(arg1: number, arg2: string) {
  return typeof arg1 === 'number' ? arg1++ : arg2 + '1';
}

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ReturnFoo = ReturnType<typeof foo>;    // number|string
type MyReturnFoo = MyReturnType<typeof foo>;  //number|string

type MyParameters<T> = T extends (...arg: infer R) => any ? R : never;
type Param = Parameters<typeof foo>[1];     //string
type MyParam = MyParameters<typeof foo>[1]; //string


// Задача 1: Условные типы и infer
// Условие: Создайте тип ExtractReturnType, который извлекает тип возвращаемого значения из функций в объекте,
// игнорируя методы, которые не являются функциями.
// Пример использования
const obj = {
  getName: () => "John",
  getAge: () => 25,
  metadata: "some data"
};

// type Result = ExtractReturnType<typeof obj>;
// Должно быть: { getName: string; getAge: number; metadata: never }

type ExtractReturnType<T extends object> = {
  [K in keyof T]: T[K] extends () => infer R ? R : never;
}

type Result = ExtractReturnType<typeof obj>;


// Задача 2: Рекурсивные типы
// Условие: Создайте тип DeepReadonly, который делает все свойства объекта (включая вложенные) доступными
// только для чтения.

// Пример использования
interface User {
  name: string;
  details: {
      age: number;
      address: {
          city: string;
          street: string;
      };
  };
  update: () => void;
}

// type ReadonlyUser = DeepReadonly<User>;
// user.name = "Mike"; // ✗ Ошибка
// user.details.age = 26; // ✗ Ошибка
// user.details.address.city = "Boston"; // ✗ Ошибка
// user.update(); // ✓ Можно вызывать методы

type DeepReadonly<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [K in keyof T]: T[K] extends object ? T[K] extends (...args: any[]) => any ? T[K] : DeepReadonly<T[K]> : T[K];
}

type ReadonlyUser = DeepReadonly<User>;
const user: ReadonlyUser = {
  name: 'John',
  update() { },
  details: {
      age: 123,
      address: {
          city: 'Kansas',
          street: 'street'
      }
  }
}
// user.name = 'Vitya'; //есть ошибка!
// user.details={};     // ошибка!
// user.details.address = '';   // ошибка!
// user.update = function () { }; // ошибка!
user.update();








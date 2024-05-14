const todos = [
  'Победи свои страхи, или они победят тебя.',
  'Рекам нужны истоки.',
  'Не бойся неведомого.',
  'Тебя ждет приятный сюрприз.',
  'Будь проще везде, где только можно.',
];

export function getTodo() {
  return todos[Math.floor(Math.random() * todos.length)];
}

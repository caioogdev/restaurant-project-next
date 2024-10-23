export const times = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2).toString().padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return {
    value: `${hours}:${minutes}`,
    label: `${hours}:${minutes}`,
  };
});

export const people = [
  ...Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} pessoas`,
  })),
  { value: 'festa', label: 'Festa' },
];
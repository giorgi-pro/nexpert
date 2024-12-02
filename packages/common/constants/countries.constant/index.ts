export type Country = {
  name: string;
  id: number;
  flag: string;
};

const countries: Country[] = [
  { name: "Albania", id: 1, flag: "🇦🇱" },
  { name: "Andorra", id: 2, flag: "🇦🇩" },
  { name: "Austria", id: 3, flag: "🇦🇹" },
  { name: "Belarus", id: 4, flag: "🇧🇾" },
  { name: "Belgium", id: 5, flag: "🇧🇪" },
  { name: "Bosnia and Herzegovina", id: 6, flag: "🇧🇦" },
  { name: "Bulgaria", id: 7, flag: "🇧🇬" },
  { name: "Canada", id: 8, flag: "🇨🇦" },
  { name: "Croatia", id: 9, flag: "🇭🇷" },
  { name: "Czech Republic", id: 10, flag: "🇨🇿" },
  { name: "Denmark", id: 11, flag: "🇩🇰" },
  { name: "Estonia", id: 12, flag: "🇪🇪" },
  { name: "Finland", id: 13, flag: "🇫🇮" },
  { name: "France", id: 14, flag: "🇫🇷" },
  { name: "Georgia", id: 15, flag: "🇬🇪" },
  { name: "Germany", id: 16, flag: "🇩🇪" },
  { name: "Greece", id: 17, flag: "🇬🇷" },
  { name: "Hungary", id: 18, flag: "🇭🇺" },
  { name: "Iceland", id: 19, flag: "🇮🇸" },
  { name: "Ireland", id: 20, flag: "🇮🇪" },
  { name: "Italy", id: 21, flag: "🇮🇹" },
  { name: "Latvia", id: 22, flag: "🇱🇻" },
  { name: "Liechtenstein", id: 23, flag: "🇱🇮" },
  { name: "Lithuania", id: 24, flag: "🇱🇹" },
  { name: "Luxembourg", id: 25, flag: "🇱🇺" },
  { name: "Malta", id: 26, flag: "🇲🇹" },
  { name: "Mexico", id: 27, flag: "🇲🇽" },
  { name: "Moldova", id: 28, flag: "🇲🇩" },
  { name: "Monaco", id: 29, flag: "🇲🇨" },
  { name: "Montenegro", id: 30, flag: "🇲🇪" },
  { name: "Netherlands", id: 31, flag: "🇳🇱" },
  { name: "North Macedonia", id: 32, flag: "🇲🇰" },
  { name: "Norway", id: 33, flag: "🇳🇴" },
  { name: "Poland", id: 34, flag: "🇵🇱" },
  { name: "Portugal", id: 35, flag: "🇵🇹" },
  { name: "Romania", id: 36, flag: "🇷🇴" },
  { name: "Russia", id: 37, flag: "🇷🇺" },
  { name: "San Marino", id: 38, flag: "🇸🇲" },
  { name: "Serbia", id: 39, flag: "🇷🇸" },
  { name: "Slovakia", id: 40, flag: "🇸🇰" },
  { name: "Slovenia", id: 41, flag: "🇸🇮" },
  { name: "Spain", id: 42, flag: "🇪🇸" },
  { name: "Sweden", id: 43, flag: "🇸🇪" },
  { name: "Switzerland", id: 44, flag: "🇨🇭" },
  { name: "Ukraine", id: 45, flag: "🇺🇦" },
  { name: "United Kingdom", id: 46, flag: "🇬🇧" },
  { name: "United States", id: 47, flag: "🇺🇸" },
];

const countriesConstant = {
  array: countries,
  object: countries.reduce(
    (acc, country) => {
      acc[country.id] = country;
      return acc;
    },
    {} as Record<number, Country>,
  ),
};

export default countriesConstant;

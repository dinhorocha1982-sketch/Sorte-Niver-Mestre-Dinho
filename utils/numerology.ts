import { Palpite, CruzDoDia, AnimalData } from '../types';

export const animais: AnimalData[] = [
  { id: 1, nome: "Avestruz", dezenas: [1, 2, 3, 4] },
  { id: 2, nome: "Águia", dezenas: [5, 6, 7, 8] },
  { id: 3, nome: "Burro", dezenas: [9, 10, 11, 12] },
  { id: 4, nome: "Borboleta", dezenas: [13, 14, 15, 16] },
  { id: 5, nome: "Cachorro", dezenas: [17, 18, 19, 20] },
  { id: 6, nome: "Cabra", dezenas: [21, 22, 23, 24] },
  { id: 7, nome: "Carneiro", dezenas: [25, 26, 27, 28] },
  { id: 8, nome: "Camelo", dezenas: [29, 30, 31, 32] },
  { id: 9, nome: "Cobra", dezenas: [33, 34, 35, 36] },
  { id: 10, nome: "Coelho", dezenas: [37, 38, 39, 40] },
  { id: 11, nome: "Cavalo", dezenas: [41, 42, 43, 44] },
  { id: 12, nome: "Elefante", dezenas: [45, 46, 47, 48] },
  { id: 13, nome: "Galo", dezenas: [49, 50, 51, 52] },
  { id: 14, nome: "Gato", dezenas: [53, 54, 55, 56] },
  { id: 15, nome: "Jacaré", dezenas: [57, 58, 59, 60] },
  { id: 16, nome: "Leão", dezenas: [61, 62, 63, 64] },
  { id: 17, nome: "Macaco", dezenas: [65, 66, 67, 68] },
  { id: 18, nome: "Porco", dezenas: [69, 70, 71, 72] },
  { id: 19, nome: "Pavão", dezenas: [73, 74, 75, 76] },
  { id: 20, nome: "Peru", dezenas: [77, 78, 79, 80] },
  { id: 21, nome: "Touro", dezenas: [81, 82, 83, 84] },
  { id: 22, nome: "Tigre", dezenas: [85, 86, 87, 88] },
  { id: 23, nome: "Urso", dezenas: [89, 90, 91, 92] },
  { id: 24, nome: "Veado", dezenas: [93, 94, 95, 96] },
  { id: 25, nome: "Vaca", dezenas: [97, 98, 99, 0] },
];

// Seeded Random Number Generator
const createRandomGenerator = (seed: number) => {
  return () => {
    // Simple LCG (Linear Congruential Generator)
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

export const gerarPalpite = (birthDate: Date, useDailySeed: boolean = true): Palpite => {
  let seed: number;

  if (useDailySeed) {
    const today = new Date();
    // Create a string key based on birth date and current date
    const birthStr = `${birthDate.getDate()}/${birthDate.getMonth()}/${birthDate.getFullYear()}`;
    const todayStr = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`;
    const seedString = `${birthStr}-${todayStr}`;

    // Simple hash function to generate integer seed from string
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      const char = seedString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    seed = Math.abs(hash);
  } else {
    // Use completely random seed
    seed = Math.floor(Math.random() * 1000000000);
  }

  const random = createRandomGenerator(seed);

  // Determine Animal (0-24)
  const animalIndex = Math.floor(random() * 25);
  const animal = animais[animalIndex];

  // Generate 5 Milhares
  const milhares: number[] = [];
  for (let i = 0; i < 5; i++) {
    // We need 4 digits. The last two must match the animal's tens.
    const digit1 = Math.floor(random() * 10);
    const digit2 = Math.floor(random() * 10);
    
    // Pick one of the 4 valid tens (dezenas) for this animal
    const tenIndex = Math.floor(random() * 4);
    const selectedTen = animal.dezenas[tenIndex];
    
    // Format tens (handle 0 as '00')
    const tenString = selectedTen === 0 ? "00" : String(selectedTen).padStart(2, '0');
    const milharString = `${digit1}${digit2}${tenString}`;
    milhares.push(parseInt(milharString));
  }

  return {
    bicho: animal.nome,
    grupo: animal.id,
    dezenas: animal.dezenas,
    milhares: milhares
  };
};

export const gerarCruzDoDia = (): CruzDoDia => {
  const today = new Date();
  const day = today.getDate();
  
  // Traditional Cruz do Dia logic:
  // Calculate sum of Day + 3, then +3, +3, +3.
  // Take the LAST DIGIT of each result.
  
  const n1 = (day + 3) % 10;
  const n2 = (day + 6) % 10;
  const n3 = (day + 9) % 10;
  const n4 = (day + 12) % 10;
  
  // Create 5 Strong Thousands using permutations of the cross numbers
  // This ensures they are static for the day (since day is static)
  
  // 1. Clockwise starting top
  const m1 = parseInt(`${n1}${n2}${n3}${n4}`);
  // 2. Clockwise starting right
  const m2 = parseInt(`${n2}${n3}${n4}${n1}`);
  // 3. Clockwise starting bottom
  const m3 = parseInt(`${n3}${n4}${n1}${n2}`);
  // 4. Clockwise starting left
  const m4 = parseInt(`${n4}${n1}${n2}${n3}`);
  // 5. Cross (Top, Bottom, Left, Right)
  const m5 = parseInt(`${n1}${n3}${n4}${n2}`);

  return {
    cabeca: day,
    bracos: [n1, n2, n3, n4],
    milhares: [m1, m2, m3, m4, m5]
  };
};
export const WORDS: Record<string, string[]> = {
  Animals: [
    "Lion", "Elephant", "Monkey", "Giraffe", "Penguin",
    "Kangaroo", "Dolphin", "Octopus", "Butterfly", "Peacock",
    "Fox", "Bear", "Rabbit", "Snake", "Owl",
  ],
  Objects: [
    "Chair", "Table", "Lamp", "Book", "Computer",
    "Bicycle", "Car", "Guitar", "Clock", "Key",
    "Telephone", "Scissors", "Umbrella", "Backpack", "Camera",
  ],
  Actions: [
    "Running", "Jumping", "Swimming", "Dancing", "Singing",
    "Eating", "Sleeping", "Reading", "Writing", "Painting",
    "Crying", "Laughing", "Climbing", "Driving", "Cooking",
  ],
  Movies: [
    "Titanic", "Star Wars", "Jurassic Park", "The Matrix", "Harry Potter",
    "The Lion King", "Forrest Gump", "Pulp Fiction", "Avatar", "Inception",
    "Frozen", "Jaws", "E.T.", "Toy Story", "Spider-Man",
  ],
  Places: [
    "Beach", "Mountain", "City", "Forest", "Desert",
    "School", "Library", "Hospital", "Restaurant", "Airport",
    "Paris", "New York", "Egypt", "Japan", "Brazil",
  ],
  Food: [
    "Pizza", "Burger", "Sushi", "Pasta", "Salad",
    "Ice Cream", "Chocolate", "Apple", "Banana", "Coffee",
    "Taco", "Pancake", "Steak", "Bread", "Cheese",
  ],
};

export const CATEGORIES = Object.keys(WORDS);

export function getNewWord(usedWords: string[] = [], categories: string[] = CATEGORIES): { word: string; category: string } | null {
  const availableCategories = categories.filter(category => 
    WORDS[category]?.some(word => !usedWords.includes(word))
  );

  if (availableCategories.length === 0) {
    return null; // All words in selected categories have been used
  }

  let attempts = 0;
  while (attempts < 100) { // Avoid infinite loop
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const wordsInCategory = WORDS[randomCategory];
    if (wordsInCategory) {
      const randomWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
      if (!usedWords.includes(randomWord)) {
        return { word: randomWord, category: randomCategory };
      }
    }
    attempts++;
  }
  
  // Fallback if random selection fails repeatedly
  for (const category of availableCategories) {
    for (const word of WORDS[category]) {
      if (!usedWords.includes(word)) {
        return { word, category };
      }
    }
  }

  return null; // Should be unreachable if availableCategories is not empty
}

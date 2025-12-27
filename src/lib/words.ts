export type Difficulty = 'Beginner' | 'Advanced';

export type WordStructure = {
    [mainCategory: string]: {
        [subCategory: string]: {
            [difficulty in Difficulty]: string[];
        };
    };
};

export const WORDS: WordStructure = {
    "General": {
        "Animals": {
            "Beginner": ["Dog", "Cat", "Fish", "Bird", "Lion", "Elephant", "Monkey", "Giraffe", "Penguin", "Kangaroo"],
            "Advanced": ["Platypus", "Aardvark", "Axolotl", "Capybara", "Narwhal", "Pangolin", "Quokka", "Okapi", "Fossa", "Tarsier"]
        },
        "Objects": {
            "Beginner": ["Chair", "Table", "Lamp", "Book", "Computer", "Bicycle", "Car", "Guitar", "Clock", "Key"],
            "Advanced": ["Sextant", "Abacus", "Astrolabe", "Telescope", "Microscope", "Stethoscope", "Typewriter", "Gramophone", "Pocket Watch", "Kaleidoscope"]
        },
        "Actions": {
            "Beginner": ["Running", "Jumping", "Swimming", "Dancing", "Singing", "Eating", "Sleeping", "Reading", "Writing", "Painting"],
            "Advanced": ["Juggling", "Summersault", "Kneading", "Whittling", "Origami", "Calligraphy", "Beatboxing", "Yodeling", "Auctioneering", "Voguing"]
        },
        "Places": {
            "Beginner": ["Beach", "Mountain", "City", "Forest", "Desert", "School", "Library", "Hospital", "Restaurant", "Airport"],
            "Advanced": ["Machu Picchu", "Angkor Wat", "Petra", "The Colosseum", "Stonehenge", "The Acropolis", "The Louvre", "Sistine Chapel", "Eiffel Tower", "Statue of Liberty"]
        },
        "Food": {
            "Beginner": ["Pizza", "Burger", "Sushi", "Pasta", "Salad", "Ice Cream", "Chocolate", "Apple", "Banana", "Coffee"],
            "Advanced": ["Paella", "Pho", "Ramen", "Kimchi", "Croissant", "Macaron", "Tiramisu", "Baklava", "Ceviche", "Escargot"]
        }
    },
    "Science": {
        "Biology": {
            "Beginner": ["Cell", "DNA", "Leaf", "Flower", "Brain", "Heart", "Lungs", "Photosynthesis", "Evolution", "Fossil"],
            "Advanced": ["Mitochondria", "Meiosis", "Symbiosis", "Homeostasis", "Phenotype", "Genotype", "Krebs Cycle", "Osmosis", "Endoplasmic Reticulum", "Golgi Apparatus"]
        },
        "Chemistry": {
            "Beginner": ["Atom", "Molecule", "Water", "Acid", "Base", "Salt", "Gas", "Liquid", "Solid", "Reaction"],
            "Advanced": ["Titration", "Covalent Bond", "Ionic Bond", "Catalyst", "Polymerization", "Esterification", "Oxidation", "Reduction", "Quantum Tunneling", "Avogadro's Number"]
        },
        "Physics": {
            "Beginner": ["Gravity", "Magnet", "Light", "Sound", "Force", "Energy", "Friction", "Lever", "Pulley", "Reflection"],
            "Advanced": ["Quantum Entanglement", "General Relativity", "String Theory", "Schrödinger's Cat", "Black Hole", "Doppler Effect", "Superconductivity", "Boson", "Fermion", "Heisenberg's Uncertainty Principle"]
        }
    },
    "Movies by Generation": {
        "1980s": {
            "Beginner": ["E.T.", "Back to the Future", "The Goonies", "Ghostbusters", "The Breakfast Club", "Ferris Bueller's Day Off", "Indiana Jones", "Top Gun", "Blade Runner", "Die Hard"],
            "Advanced": ["Amadeus", "Raging Bull", "Fanny and Alexander", "Blue Velvet", "RoboCop", "Akira", "Cinema Paradiso", "Grave of the Fireflies", "A Fish Called Wanda", "Platoon"]
        },
        "1990s": {
            "Beginner": ["Jurassic Park", "Titanic", "Pulp Fiction", "Forrest Gump", "The Matrix", "Toy Story", "Home Alone", "Men in Black", "The Lion King", "Braveheart"],
            "Advanced": ["Schindler's List", "Goodfellas", "Fargo", "The Big Lebowski", "Reservoir Dogs", "Trainspotting", "Princess Mononoke", "The Usual Suspects", "Silence of the Lambs", "Heat"]
        },
        "2000s": {
            "Beginner": ["Harry Potter", "Lord of the Rings", "Shrek", "Pirates of the Caribbean", "Finding Nemo", "Avatar", "Inception", "The Dark Knight", "Spider-Man", "Iron Man"],
            "Advanced": ["No Country for Old Men", "There Will Be Blood", "Spirited Away", "The Departed", "Eternal Sunshine of the Spotless Mind", "Pan's Labyrinth", "City of God", "Oldboy", "Children of Men", "Mulholland Drive"]
        },
        "2010s": {
            "Beginner": ["The Avengers", "Frozen", "Joker", "Black Panther", "Inside Out", "Mad Max: Fury Road", "La La Land", "Get Out", "A Star Is Born", "The Hunger Games"],
            "Advanced": ["Parasite", "Moonlight", "The Social Network", "Whiplash", "Her", "The Grand Budapest Hotel", "Roma", "A Separation", "The Tree of Life", "Arrival"]
        }
    }
};

export const CATEGORIES = Object.keys(WORDS);

export type SelectedCategories = {
    [mainCategory: string]: {
        difficulty: Difficulty;
        subcategories: string[];
    };
};

export function getNewWord(usedWords: string[], selection: SelectedCategories): { word: string, category: string } | null {
    const availableWords: { word: string, category: string }[] = [];

    for (const mainCategory in selection) {
        if (WORDS[mainCategory]) {
            const { difficulty, subcategories } = selection[mainCategory];
            for (const sub of subcategories) {
                if (WORDS[mainCategory][sub] && WORDS[mainCategory][sub][difficulty]) {
                    const words = WORDS[mainCategory][sub][difficulty];
                    for (const word of words) {
                        if (!usedWords.includes(word)) {
                            availableWords.push({ word, category: sub });
                        }
                    }
                }
            }
        }
    }

    if (availableWords.length === 0) {
        return null; // All available words have been used
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
}

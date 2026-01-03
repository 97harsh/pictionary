export type Difficulty = 'Beginner' | 'Advanced';

export interface TabooWord {
    word: string;
    tabooWords: string[];
}

export type TabooWordStructure = {
    [mainCategory: string]: {
        [subCategory: string]: {
            [difficulty in Difficulty]: TabooWord[];
        };
    };
};

export const TABOO_WORDS: TabooWordStructure = {
    "General": {
        "Animals": {
            "Beginner": [
                { word: "Dog", tabooWords: ["Bark", "Pet", "Puppy"] },
                { word: "Cat", tabooWords: ["Meow", "Kitten"] },
                { word: "Fish", tabooWords: ["Water", "Swim"] },
                { word: "Bird", tabooWords: ["Fly", "Wings", "Feather"] },
                { word: "Lion", tabooWords: ["King", "Jungle"] },
                { word: "Elephant", tabooWords: ["Trunk", "Big", "Gray"] },
                { word: "Monkey", tabooWords: ["Banana", "Tree"] },
                { word: "Giraffe", tabooWords: ["Neck", "Tall", "Spots"] },
                { word: "Penguin", tabooWords: ["Ice", "Black", "White"] },
                { word: "Kangaroo", tabooWords: ["Jump", "Pouch"] }
            ],
            "Advanced": [
                { word: "Platypus", tabooWords: ["Duck", "Beaver", "Bill", "Egg", "Mammal", "Australia", "Venomous"] },
                { word: "Aardvark", tabooWords: ["Ant", "Eater", "Snout", "Africa", "Nocturnal"] },
                { word: "Axolotl", tabooWords: ["Salamander", "Mexico", "Pink", "Gills", "Regenerate", "Water"] },
                { word: "Capybara", tabooWords: ["Rodent", "Large", "South America", "Water", "Guinea Pig"] },
                { word: "Narwhal", tabooWords: ["Whale", "Unicorn", "Tusk", "Horn", "Arctic", "Ocean"] },
                { word: "Pangolin", tabooWords: ["Scale", "Armor", "Anteater", "Roll", "Endangered"] },
                { word: "Quokka", tabooWords: ["Happy", "Smile", "Australia", "Marsupial", "Cute"] },
                { word: "Okapi", tabooWords: ["Zebra", "Giraffe", "Stripe", "Congo", "Forest"] },
                { word: "Fossa", tabooWords: ["Cat", "Madagascar", "Predator", "Mongoose", "Lemur"] },
                { word: "Tarsier", tabooWords: ["Eyes", "Big", "Primate", "Small", "Nocturnal", "Philippines"] }
            ]
        },
        "Objects": {
            "Beginner": [
                { word: "Chair", tabooWords: ["Sit", "Furniture"] },
                { word: "Table", tabooWords: ["Eat", "Furniture", "Flat"] },
                { word: "Lamp", tabooWords: ["Light", "Bulb"] },
                { word: "Book", tabooWords: ["Read", "Page", "Story"] },
                { word: "Computer", tabooWords: ["Type", "Screen"] },
                { word: "Bicycle", tabooWords: ["Ride", "Wheel", "Pedal"] },
                { word: "Car", tabooWords: ["Drive", "Vehicle"] },
                { word: "Guitar", tabooWords: ["String", "Music", "Play"] },
                { word: "Clock", tabooWords: ["Time", "Tick"] },
                { word: "Key", tabooWords: ["Lock", "Door", "Open"] }
            ],
            "Advanced": [
                { word: "Sextant", tabooWords: ["Navigation", "Ship", "Angle", "Star", "Measure", "Ocean"] },
                { word: "Abacus", tabooWords: ["Calculate", "Bead", "Math", "Ancient", "Count"] },
                { word: "Astrolabe", tabooWords: ["Astronomy", "Navigation", "Medieval", "Star", "Instrument", "Ancient"] },
                { word: "Telescope", tabooWords: ["Star", "Space", "Look", "Sky", "Lens", "Magnify"] },
                { word: "Microscope", tabooWords: ["Small", "Tiny", "Cell", "Magnify", "Lens", "Science"] },
                { word: "Stethoscope", tabooWords: ["Doctor", "Heart", "Listen", "Medical", "Sound"] },
                { word: "Typewriter", tabooWords: ["Type", "Key", "Letter", "Old", "Keyboard", "Paper"] },
                { word: "Gramophone", tabooWords: ["Record", "Music", "Old", "Play", "Vinyl", "Horn"] },
                { word: "Pocket Watch", tabooWords: ["Time", "Clock", "Chain", "Old", "Small"] },
                { word: "Kaleidoscope", tabooWords: ["Color", "Pattern", "Mirror", "Tube", "Turn", "Beautiful"] }
            ]
        },
        "Actions": {
            "Beginner": [
                { word: "Running", tabooWords: ["Fast", "Jog"] },
                { word: "Jumping", tabooWords: ["Hop", "Leap", "Up"] },
                { word: "Swimming", tabooWords: ["Water", "Pool"] },
                { word: "Dancing", tabooWords: ["Music", "Move"] },
                { word: "Singing", tabooWords: ["Song", "Voice", "Music"] },
                { word: "Eating", tabooWords: ["Food", "Mouth"] },
                { word: "Sleeping", tabooWords: ["Bed", "Night", "Rest"] },
                { word: "Reading", tabooWords: ["Book", "Word"] },
                { word: "Writing", tabooWords: ["Pen", "Paper", "Word"] },
                { word: "Painting", tabooWords: ["Brush", "Color", "Art"] }
            ],
            "Advanced": [
                { word: "Juggling", tabooWords: ["Ball", "Toss", "Catch", "Air", "Circus"] },
                { word: "Somersault", tabooWords: ["Flip", "Roll", "Tumble", "Gymnastics", "Upside Down"] },
                { word: "Kneading", tabooWords: ["Dough", "Bread", "Press", "Massage", "Mix"] },
                { word: "Whittling", tabooWords: ["Wood", "Carve", "Knife", "Whittle", "Cut"] },
                { word: "Origami", tabooWords: ["Paper", "Fold", "Japan", "Crane", "Art"] },
                { word: "Calligraphy", tabooWords: ["Write", "Pen", "Beautiful", "Art", "Letter", "Fancy"] },
                { word: "Beatboxing", tabooWords: ["Mouth", "Sound", "Music", "Rhythm", "Drum"] },
                { word: "Yodeling", tabooWords: ["Sing", "Mountain", "Swiss", "Voice", "High", "Low"] },
                { word: "Auctioneering", tabooWords: ["Sell", "Bid", "Fast", "Talk", "Auction", "Going"] },
                { word: "Voguing", tabooWords: ["Dance", "Pose", "Fashion", "Model", "Strike"] }
            ]
        },
        "Places": {
            "Beginner": [
                { word: "Beach", tabooWords: ["Sand", "Ocean"] },
                { word: "Mountain", tabooWords: ["High", "Climb", "Peak"] },
                { word: "City", tabooWords: ["Building", "Town"] },
                { word: "Forest", tabooWords: ["Tree", "Wood"] },
                { word: "Desert", tabooWords: ["Sand", "Hot", "Dry"] },
                { word: "School", tabooWords: ["Learn", "Teacher"] },
                { word: "Library", tabooWords: ["Book", "Quiet", "Read"] },
                { word: "Hospital", tabooWords: ["Doctor", "Sick"] },
                { word: "Restaurant", tabooWords: ["Eat", "Food"] },
                { word: "Airport", tabooWords: ["Plane", "Fly"] }
            ],
            "Advanced": [
                { word: "Machu Picchu", tabooWords: ["Peru", "Inca", "Mountain", "Ruins", "Ancient", "South America"] },
                { word: "Angkor Wat", tabooWords: ["Cambodia", "Temple", "Ancient", "Ruins", "Buddhist", "Southeast Asia"] },
                { word: "Petra", tabooWords: ["Jordan", "Rock", "Carved", "Ancient", "Treasury", "Middle East"] },
                { word: "The Colosseum", tabooWords: ["Rome", "Gladiator", "Arena", "Italy", "Ancient", "Fight"] },
                { word: "Stonehenge", tabooWords: ["England", "Stone", "Circle", "Ancient", "Mystery", "Druids"] },
                { word: "The Acropolis", tabooWords: ["Greece", "Athens", "Parthenon", "Ancient", "Temple"] },
                { word: "The Louvre", tabooWords: ["Paris", "Museum", "Mona Lisa", "France", "Art"] },
                { word: "Sistine Chapel", tabooWords: ["Vatican", "Michelangelo", "Ceiling", "Rome", "Painting", "Church"] },
                { word: "Eiffel Tower", tabooWords: ["Paris", "France", "Metal", "Tall", "Landmark"] },
                { word: "Statue of Liberty", tabooWords: ["New York", "Torch", "Freedom", "Green", "France", "America"] }
            ]
        },
        "Food": {
            "Beginner": [
                { word: "Pizza", tabooWords: ["Cheese", "Italy"] },
                { word: "Burger", tabooWords: ["Bun", "Beef", "Patty"] },
                { word: "Sushi", tabooWords: ["Rice", "Fish", "Japan"] },
                { word: "Pasta", tabooWords: ["Noodle", "Italy"] },
                { word: "Salad", tabooWords: ["Lettuce", "Green"] },
                { word: "Ice Cream", tabooWords: ["Cold", "Sweet", "Scoop"] },
                { word: "Chocolate", tabooWords: ["Sweet", "Brown"] },
                { word: "Apple", tabooWords: ["Red", "Fruit"] },
                { word: "Banana", tabooWords: ["Yellow", "Peel", "Fruit"] },
                { word: "Coffee", tabooWords: ["Drink", "Caffeine", "Hot"] }
            ],
            "Advanced": [
                { word: "Paella", tabooWords: ["Spain", "Rice", "Seafood", "Saffron", "Valencia"] },
                { word: "Pho", tabooWords: ["Vietnam", "Soup", "Noodle", "Broth", "Beef"] },
                { word: "Ramen", tabooWords: ["Japan", "Noodle", "Soup", "Broth", "Bowl"] },
                { word: "Kimchi", tabooWords: ["Korea", "Cabbage", "Spicy", "Ferment", "Side Dish"] },
                { word: "Croissant", tabooWords: ["France", "Pastry", "Butter", "Flaky", "Breakfast"] },
                { word: "Macaron", tabooWords: ["France", "Sweet", "Cookie", "Almond", "Colorful", "Sandwich"] },
                { word: "Tiramisu", tabooWords: ["Italy", "Coffee", "Dessert", "Mascarpone", "Ladyfinger"] },
                { word: "Baklava", tabooWords: ["Sweet", "Pastry", "Honey", "Nut", "Layer", "Middle East"] },
                { word: "Ceviche", tabooWords: ["Peru", "Fish", "Lime", "Raw", "Marinated", "Latin America"] },
                { word: "Escargot", tabooWords: ["France", "Snail", "Garlic", "Butter", "Fancy"] }
            ]
        }
    },
    "Science": {
        "Biology": {
            "Beginner": [
                { word: "Cell", tabooWords: ["Small", "Organism"] },
                { word: "DNA", tabooWords: ["Gene", "Genetic"] },
                { word: "Leaf", tabooWords: ["Green", "Plant", "Tree"] },
                { word: "Flower", tabooWords: ["Bloom", "Petal"] },
                { word: "Brain", tabooWords: ["Think", "Head"] },
                { word: "Heart", tabooWords: ["Beat", "Pump", "Blood"] },
                { word: "Lungs", tabooWords: ["Breathe", "Air"] },
                { word: "Photosynthesis", tabooWords: ["Plant", "Sun", "Light"] },
                { word: "Evolution", tabooWords: ["Darwin", "Change"] },
                { word: "Fossil", tabooWords: ["Old", "Bone", "Dinosaur"] }
            ],
            "Advanced": [
                { word: "Mitochondria", tabooWords: ["Cell", "Energy", "Powerhouse", "ATP", "Organelle"] },
                { word: "Meiosis", tabooWords: ["Cell", "Division", "Sex", "Chromosome", "Reproduction", "Half"] },
                { word: "Symbiosis", tabooWords: ["Relationship", "Organism", "Together", "Mutual", "Live"] },
                { word: "Homeostasis", tabooWords: ["Balance", "Equilibrium", "Stable", "Regulate", "Body"] },
                { word: "Phenotype", tabooWords: ["Trait", "Physical", "Gene", "Expression", "Observable"] },
                { word: "Genotype", tabooWords: ["Gene", "DNA", "Genetic", "Code", "Inherited"] },
                { word: "Krebs Cycle", tabooWords: ["Energy", "Cellular", "Respiration", "ATP", "Citric", "Acid"] },
                { word: "Osmosis", tabooWords: ["Water", "Membrane", "Concentration", "Movement", "Diffusion"] },
                { word: "Endoplasmic Reticulum", tabooWords: ["Cell", "Organelle", "Protein", "Rough", "Smooth", "ER"] },
                { word: "Golgi Apparatus", tabooWords: ["Cell", "Organelle", "Package", "Protein", "Vesicle"] }
            ]
        },
        "Chemistry": {
            "Beginner": [
                { word: "Atom", tabooWords: ["Small", "Particle"] },
                { word: "Molecule", tabooWords: ["Atom", "Bond"] },
                { word: "Water", tabooWords: ["Drink", "H2O", "Liquid"] },
                { word: "Acid", tabooWords: ["Sour", "pH"] },
                { word: "Base", tabooWords: ["Alkali", "pH"] },
                { word: "Salt", tabooWords: ["Sodium", "Salty"] },
                { word: "Gas", tabooWords: ["Air", "State"] },
                { word: "Liquid", tabooWords: ["Water", "Pour", "State"] },
                { word: "Solid", tabooWords: ["Hard", "State"] },
                { word: "Reaction", tabooWords: ["Change", "Chemical"] }
            ],
            "Advanced": [
                { word: "Titration", tabooWords: ["Acid", "Base", "Measure", "Burette", "Neutralization", "Solution"] },
                { word: "Covalent Bond", tabooWords: ["Share", "Electron", "Atom", "Chemical", "Strong"] },
                { word: "Ionic Bond", tabooWords: ["Electron", "Transfer", "Charge", "Atom", "Salt"] },
                { word: "Catalyst", tabooWords: ["Speed", "Reaction", "Chemical", "Enzyme", "Accelerate"] },
                { word: "Polymerization", tabooWords: ["Polymer", "Monomer", "Plastic", "Chain", "Reaction"] },
                { word: "Esterification", tabooWords: ["Ester", "Alcohol", "Acid", "Reaction", "Formation"] },
                { word: "Oxidation", tabooWords: ["Oxygen", "Lose", "Electron", "Rust", "Reaction", "Redox"] },
                { word: "Reduction", tabooWords: ["Gain", "Electron", "Redox", "Reaction", "Oxidation"] },
                { word: "Quantum Tunneling", tabooWords: ["Particle", "Barrier", "Physics", "Quantum", "Pass", "Through"] },
                { word: "Avogadro's Number", tabooWords: ["Mole", "Constant", "6.02", "Particles", "Chemistry"] }
            ]
        },
        "Physics": {
            "Beginner": [
                { word: "Gravity", tabooWords: ["Fall", "Down", "Pull"] },
                { word: "Magnet", tabooWords: ["Attract", "Metal"] },
                { word: "Light", tabooWords: ["Bright", "See"] },
                { word: "Sound", tabooWords: ["Hear", "Noise", "Loud"] },
                { word: "Force", tabooWords: ["Push", "Pull"] },
                { word: "Energy", tabooWords: ["Power", "Work"] },
                { word: "Friction", tabooWords: ["Rub", "Slow"] },
                { word: "Lever", tabooWords: ["Lift", "Machine"] },
                { word: "Pulley", tabooWords: ["Rope", "Wheel", "Lift"] },
                { word: "Reflection", tabooWords: ["Mirror", "Bounce"] }
            ],
            "Advanced": [
                { word: "Quantum Entanglement", tabooWords: ["Particle", "Connected", "Spooky", "Einstein", "Distance", "Quantum"] },
                { word: "General Relativity", tabooWords: ["Einstein", "Gravity", "Space", "Time", "Curved", "Theory"] },
                { word: "String Theory", tabooWords: ["Particle", "Vibration", "Dimension", "Physics", "Quantum", "Unified"] },
                { word: "Schrödinger's Cat", tabooWords: ["Quantum", "Dead", "Alive", "Paradox", "Box", "Experiment"] },
                { word: "Black Hole", tabooWords: ["Space", "Gravity", "Light", "Escape", "Singularity", "Event Horizon"] },
                { word: "Doppler Effect", tabooWords: ["Sound", "Frequency", "Moving", "Wave", "Shift", "Ambulance"] },
                { word: "Superconductivity", tabooWords: ["Resistance", "Zero", "Cold", "Electricity", "Current"] },
                { word: "Boson", tabooWords: ["Particle", "Force", "Higgs", "Quantum", "Physics"] },
                { word: "Fermion", tabooWords: ["Particle", "Matter", "Electron", "Proton", "Neutron", "Quantum"] },
                { word: "Heisenberg's Uncertainty Principle", tabooWords: ["Quantum", "Position", "Momentum", "Measure", "Uncertain", "Physics"] }
            ]
        }
    },
    "Movies by Generation": {
        "1980s": {
            "Beginner": [
                { word: "E.T.", tabooWords: ["Alien", "Phone", "Home"] },
                { word: "Back to the Future", tabooWords: ["Time", "DeLorean"] },
                { word: "The Goonies", tabooWords: ["Kids", "Treasure"] },
                { word: "Ghostbusters", tabooWords: ["Ghost", "Slime"] },
                { word: "The Breakfast Club", tabooWords: ["School", "Detention"] },
                { word: "Ferris Bueller's Day Off", tabooWords: ["School", "Skip"] },
                { word: "Indiana Jones", tabooWords: ["Whip", "Adventure", "Hat"] },
                { word: "Top Gun", tabooWords: ["Pilot", "Jet"] },
                { word: "Blade Runner", tabooWords: ["Future", "Replicant"] },
                { word: "Die Hard", tabooWords: ["Bruce Willis", "Christmas", "Building"] }
            ],
            "Advanced": [
                { word: "Amadeus", tabooWords: ["Mozart", "Classical", "Composer", "Salieri", "Music"] },
                { word: "Raging Bull", tabooWords: ["Boxing", "De Niro", "Fighter", "Jake LaMotta", "Scorsese"] },
                { word: "Fanny and Alexander", tabooWords: ["Bergman", "Swedish", "Family", "Children", "Christmas"] },
                { word: "Blue Velvet", tabooWords: ["Lynch", "Mystery", "Dennis Hopper", "Dark", "Ear"] },
                { word: "RoboCop", tabooWords: ["Cyborg", "Police", "Detroit", "Future", "Officer"] },
                { word: "Akira", tabooWords: ["Anime", "Motorcycle", "Tokyo", "Psychic", "Tetsuo"] },
                { word: "Cinema Paradiso", tabooWords: ["Italian", "Film", "Projectionist", "Sicily", "Love"] },
                { word: "Grave of the Fireflies", tabooWords: ["Anime", "War", "Japan", "Siblings", "Sad", "Studio Ghibli"] },
                { word: "A Fish Called Wanda", tabooWords: ["Comedy", "Heist", "British", "John Cleese", "Diamond"] },
                { word: "Platoon", tabooWords: ["Vietnam", "War", "Oliver Stone", "Soldiers", "Jungle"] }
            ]
        },
        "1990s": {
            "Beginner": [
                { word: "Jurassic Park", tabooWords: ["Dinosaur", "Island"] },
                { word: "Titanic", tabooWords: ["Ship", "Sink", "Leo"] },
                { word: "Pulp Fiction", tabooWords: ["Tarantino", "Crime"] },
                { word: "Forrest Gump", tabooWords: ["Run", "Shrimp", "Chocolate"] },
                { word: "The Matrix", tabooWords: ["Neo", "Red", "Pill"] },
                { word: "Toy Story", tabooWords: ["Woody", "Buzz"] },
                { word: "Home Alone", tabooWords: ["Kid", "Burglars"] },
                { word: "Men in Black", tabooWords: ["Alien", "Suit"] },
                { word: "The Lion King", tabooWords: ["Simba", "Mufasa"] },
                { word: "Braveheart", tabooWords: ["Scotland", "Freedom"] }
            ],
            "Advanced": [
                { word: "Schindler's List", tabooWords: ["Holocaust", "Spielberg", "Oscar", "Jews", "Nazi", "Factory"] },
                { word: "Goodfellas", tabooWords: ["Mafia", "Scorsese", "Gangster", "De Niro", "Pesci"] },
                { word: "Fargo", tabooWords: ["Coen", "Minnesota", "Kidnapping", "Pregnant", "Snow"] },
                { word: "The Big Lebowski", tabooWords: ["Dude", "Bowling", "Coen", "Rug", "Jeff Bridges"] },
                { word: "Reservoir Dogs", tabooWords: ["Tarantino", "Heist", "Color", "Suit", "Ear"] },
                { word: "Trainspotting", tabooWords: ["Scottish", "Drugs", "Heroin", "Edinburgh", "Ewan McGregor"] },
                { word: "Princess Mononoke", tabooWords: ["Ghibli", "Miyazaki", "Forest", "Spirits", "Anime", "Japan"] },
                { word: "The Usual Suspects", tabooWords: ["Keyser Söze", "Mystery", "Lineup", "Crime", "Twist"] },
                { word: "Silence of the Lambs", tabooWords: ["Hannibal", "FBI", "Clarice", "Serial Killer", "Lecter"] },
                { word: "Heat", tabooWords: ["Pacino", "De Niro", "Heist", "Bank", "Crime", "Shootout"] }
            ]
        },
        "2000s": {
            "Beginner": [
                { word: "Harry Potter", tabooWords: ["Wizard", "Magic", "Hogwarts"] },
                { word: "Lord of the Rings", tabooWords: ["Frodo", "Ring", "Hobbit"] },
                { word: "Shrek", tabooWords: ["Ogre", "Donkey"] },
                { word: "Pirates of the Caribbean", tabooWords: ["Jack Sparrow", "Ship"] },
                { word: "Finding Nemo", tabooWords: ["Fish", "Ocean", "Clown"] },
                { word: "Avatar", tabooWords: ["Blue", "Alien", "Pandora"] },
                { word: "Inception", tabooWords: ["Dream", "DiCaprio"] },
                { word: "The Dark Knight", tabooWords: ["Batman", "Joker"] },
                { word: "Spider-Man", tabooWords: ["Web", "Peter Parker"] },
                { word: "Iron Man", tabooWords: ["Tony Stark", "Suit"] }
            ],
            "Advanced": [
                { word: "No Country for Old Men", tabooWords: ["Coen", "Texas", "Anton", "Money", "Sheriff"] },
                { word: "There Will Be Blood", tabooWords: ["Oil", "Daniel", "Plainview", "Milkshake", "Anderson"] },
                { word: "Spirited Away", tabooWords: ["Ghibli", "Miyazaki", "Spirit", "Bathhouse", "Chihiro", "Anime"] },
                { word: "The Departed", tabooWords: ["Scorsese", "Boston", "Police", "Mob", "Undercover", "Rat"] },
                { word: "Eternal Sunshine of the Spotless Mind", tabooWords: ["Memory", "Erase", "Carrey", "Gondry", "Love"] },
                { word: "Pan's Labyrinth", tabooWords: ["Del Toro", "Spain", "Girl", "Fantasy", "War", "Faun"] },
                { word: "City of God", tabooWords: ["Brazil", "Favela", "Gang", "Rio", "Crime"] },
                { word: "Oldboy", tabooWords: ["Korean", "Revenge", "Hammer", "Mystery", "Imprisoned"] },
                { word: "Children of Men", tabooWords: ["Future", "Pregnant", "Dystopia", "Hope", "Cuarón"] },
                { word: "Mulholland Drive", tabooWords: ["Lynch", "Mystery", "Hollywood", "Dream", "Naomi Watts"] }
            ]
        },
        "2010s": {
            "Beginner": [
                { word: "The Avengers", tabooWords: ["Marvel", "Superhero"] },
                { word: "Frozen", tabooWords: ["Elsa", "Ice", "Let It Go"] },
                { word: "Joker", tabooWords: ["Clown", "Joaquin"] },
                { word: "Black Panther", tabooWords: ["Wakanda", "Marvel"] },
                { word: "Inside Out", tabooWords: ["Emotion", "Pixar"] },
                { word: "Mad Max: Fury Road", tabooWords: ["Desert", "Car"] },
                { word: "La La Land", tabooWords: ["Musical", "Jazz"] },
                { word: "Get Out", tabooWords: ["Jordan Peele", "Horror"] },
                { word: "A Star Is Born", tabooWords: ["Sing", "Lady Gaga"] },
                { word: "The Hunger Games", tabooWords: ["Katniss", "Arena"] }
            ],
            "Advanced": [
                { word: "Parasite", tabooWords: ["Korea", "Bong", "Rich", "Poor", "Basement", "Family"] },
                { word: "Moonlight", tabooWords: ["Miami", "Coming-of-age", "Three", "Chapter", "Barry Jenkins"] },
                { word: "The Social Network", tabooWords: ["Facebook", "Zuckerberg", "Harvard", "Fincher", "Tech"] },
                { word: "Whiplash", tabooWords: ["Drum", "Jazz", "Teacher", "Student", "Tempo"] },
                { word: "Her", tabooWords: ["AI", "Love", "Operating System", "Jonze", "Voice"] },
                { word: "The Grand Budapest Hotel", tabooWords: ["Anderson", "Pink", "Concierge", "Hotel", "Painting"] },
                { word: "Roma", tabooWords: ["Mexico", "Maid", "Cuarón", "Black and White", "1970s"] },
                { word: "A Separation", tabooWords: ["Iran", "Divorce", "Marriage", "Tehran", "Family"] },
                { word: "The Tree of Life", tabooWords: ["Malick", "Philosophy", "Childhood", "Memory", "Nature"] },
                { word: "Arrival", tabooWords: ["Alien", "Language", "Time", "Linguist", "Amy Adams"] }
            ]
        }
    }
};

export const TABOO_CATEGORIES = Object.keys(TABOO_WORDS);

export type SelectedCategories = {
    [mainCategory: string]: {
        difficulty: Difficulty;
        subcategories: string[];
    };
};

export function getNewTabooWord(
    usedWords: string[],
    selection: SelectedCategories
): { word: string; tabooWords: string[]; category: string; subCategory: string } | null {
    const availableWords: { word: string; tabooWords: string[]; category: string; subCategory: string }[] = [];

    for (const mainCategory in selection) {
        if (TABOO_WORDS[mainCategory]) {
            const { difficulty, subcategories } = selection[mainCategory];
            for (const sub of subcategories) {
                if (TABOO_WORDS[mainCategory][sub] && TABOO_WORDS[mainCategory][sub][difficulty]) {
                    const tabooWordArray = TABOO_WORDS[mainCategory][sub][difficulty];
                    for (const tabooWord of tabooWordArray) {
                        if (!usedWords.includes(tabooWord.word)) {
                            availableWords.push({
                                word: tabooWord.word,
                                tabooWords: tabooWord.tabooWords,
                                category: mainCategory,
                                subCategory: sub
                            });
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

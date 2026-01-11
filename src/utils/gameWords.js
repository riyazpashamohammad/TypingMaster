export const GAME_WORDS = {
    easy: [
        "cat", "dog", "ant", "bat", "bee", "cow", "elk", "fly", "fox", "hen",
        "ice", "jar", "kit", "leo", "man", "nut", "owl", "pig", "rat", "sun",
        "top", "urn", "van", "web", "yak", "zip"
    ],
    medium: [
        "apple", "bread", "chair", "dance", "eagle", "fruit", "grape", "house",
        "igloo", "jelly", "koala", "lemon", "mouse", "nurse", "ocean", "piano",
        "queen", "radio", "snake", "tiger", "umbra", "virus", "whale", "zebra",
        "board", "click", "drive", "enter", "flash", "green", "happy", "image"
    ],
    hard: [
        "airport", "battery", "chicken", "diamond", "elephant", "feather", "giraffe",
        "hospital", "internet", "journey", "kitchen", "library", "mountain", "network",
        "octopus", "penguin", "quarter", "rainbow", "science", "teacher", "umbrella",
        "volcano", "window", "xylyl", "yellow", "zeppelin", "absolute", "building",
        "calendar", "database", "electric", "festival", "gradient"
    ],
    expert: [
        "adventure", "basketball", "chocolate", "dictionary", "everything", "friendship",
        "government", "helicopter", "importance", "journalist", "knowledge", "literature",
        "management", "navigation", "opportunity", "philosophy", "questioning", "restaurant",
        "strawberry", "television", "university", "vocabulary", "wonderland", "xylophone"
    ]
};

export const getRandomWord = (difficulty = 'easy') => {
    const words = GAME_WORDS[difficulty];
    return words[Math.floor(Math.random() * words.length)];
};

export const getRandomWordByLevel = (level) => {
    if (level <= 2) return getRandomWord('easy');
    if (level <= 5) return getRandomWord('medium');
    if (level <= 8) return getRandomWord('hard');
    return getRandomWord('expert');
};

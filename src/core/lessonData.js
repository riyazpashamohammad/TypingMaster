import drills from './drills.json';

const getContent = (lessonId, sectionId) => {
    return drills[lessonId]?.[sectionId] || "Content not found";
};

export const LESSONS = [
    {
        id: 1,
        title: "1. The Home Row",
        description: "Learn the basics of tactile typing and the home row keys: A, S, D, F, J, K, L, ;",
        sections: [
            { id: "1.1", title: "Touch typing basics", type: "info", content: getContent(1, "1.1"), duration: "3 min" },
            { id: "1.2", title: "New keys: Home row", type: "new_keys", keys: ["a", "s", "d", "f", "j", "k", "l", ";"], content: getContent(1, "1.2"), duration: "3-5 min" },
            { id: "1.3", title: "Drill: Home Row", type: "drill", content: getContent(1, "1.3"), duration: "3-5 min" },
            { id: "1.4", title: "Word Drill", type: "drill", content: getContent(1, "1.4"), duration: "3-5 min" },
            { id: "1.5", title: "Paragraph Drill", type: "drill", content: getContent(1, "1.5"), duration: "5 min" }
        ]
    },
    {
        id: 2,
        title: "2. Keys E and I",
        description: "Expand your reach to the top row with E and I.",
        sections: [
            { id: "2.1", title: "New keys: E and I", type: "new_keys", keys: ["e", "i"], content: getContent(2, "2.1"), duration: "3 - 5 min" },
            { id: "2.2", title: "Optimal duration", type: "info", content: getContent(2, "2.2"), duration: "3 min" },
            { id: "2.3", title: "Word drill", type: "drill", content: getContent(2, "2.3"), duration: "3 - 5 min" },
            { id: "2.4", title: "Sentence drill", type: "drill", content: getContent(2, "2.4"), duration: "3 - 5 min" },
            { id: "2.5", title: "Tip: Typing Meter", type: "info", content: getContent(2, "2.5"), duration: "1 min" },
            { id: "2.6", title: "Paragraph drill", type: "drill", content: getContent(2, "2.6"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 3,
        title: "3. Keys R and U",
        description: "Learn R and U to complete your index finger reach.",
        sections: [
            { id: "3.1", title: "New keys: R and U", type: "new_keys", keys: ["r", "u"], content: getContent(3, "3.1"), duration: "3 - 5 min" },
            { id: "3.2", title: "Word drill", type: "drill", content: getContent(3, "3.2"), duration: "3 - 5 min" },
            { id: "3.3", title: "Ergonomics", type: "info", content: getContent(3, "3.3"), duration: "3 min" },
            { id: "3.4", title: "Sentence drill", type: "drill", content: getContent(3, "3.4"), duration: "3 - 5 min" },
            { id: "3.5", title: "Paragraph drill", type: "drill", content: getContent(3, "3.5"), duration: "3 - 5 min" },
            { id: "3.6", title: "Tip: Typing games", type: "info", content: getContent(3, "3.6"), duration: "1 min" },
            { id: "3.7", title: "Text drill", type: "drill", content: getContent(3, "3.7"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 4,
        title: "4. Keys T and O",
        description: "Master T and O.",
        sections: [
            { id: "4.1", title: "New keys: T and O", type: "new_keys", keys: ["t", "o"], content: getContent(4, "4.1"), duration: "3 - 5 min" },
            { id: "4.2", title: "Word drill", type: "drill", content: getContent(4, "4.2"), duration: "3 - 5 min" },
            { id: "4.3", title: "Sentence drill", type: "drill", content: getContent(4, "4.3"), duration: "3 - 5 min" },
            { id: "4.4", title: "Tip: Progress reports", type: "info", content: getContent(4, "4.4"), duration: "1 min" },
            { id: "4.5", title: "Paragraph drill", type: "drill", content: getContent(4, "4.5"), duration: "3 - 5 min" },
            { id: "4.6", title: "Text drill", type: "drill", content: getContent(4, "4.6"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 5,
        title: "5. Capital Letters and Period",
        description: "Learn how to shift for capitals and use the period.",
        sections: [
            { id: "5.1", title: "New keys: Shift", type: "new_keys", keys: ["ShiftLeft", "ShiftRight"], content: getContent(5, "5.1"), duration: "3 - 5 min" },
            { id: "5.2", title: "Word drill", type: "drill", content: getContent(5, "5.2"), duration: "3 - 5 min" },
            { id: "5.3", title: "New key: Period", type: "new_keys", keys: ["."], content: getContent(5, "5.3"), duration: "1 - 3 min" },
            { id: "5.4", title: "Sentence drill", type: "drill", content: getContent(5, "5.4"), duration: "3 - 5 min" },
            { id: "5.5", title: "Tip: Typing rhythm", type: "info", content: getContent(5, "5.5"), duration: "1 min" },
            { id: "5.6", title: "Paragraph drill", type: "drill", content: getContent(5, "5.6"), duration: "3 - 5 min" },
            { id: "5.7", title: "Text drill", type: "drill", content: getContent(5, "5.7"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 6,
        title: "6. Keys C and Comma",
        description: "Reach down for C and Comma.",
        sections: [
            { id: "6.1", title: "New keys: C ,", type: "new_keys", keys: ["c", ","], content: getContent(6, "6.1"), duration: "3 - 5 min" },
            { id: "6.2", title: "Word drill", type: "drill", content: getContent(6, "6.2"), duration: "3 - 5 min" },
            { id: "6.3", title: "Sentence drill", type: "drill", content: getContent(6, "6.3"), duration: "3 - 5 min" },
            { id: "6.4", title: "Paragraph drill", type: "drill", content: getContent(6, "6.4"), duration: "3 - 5 min" },
            { id: "6.5", title: "Tip: Check your posture", type: "info", content: getContent(6, "6.5"), duration: "1 min" },
            { id: "6.6", title: "Text drill", type: "drill", content: getContent(6, "6.6"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 7,
        title: "7. Keys G, H and Apostrophe",
        description: "Control the center with G and H.",
        sections: [
            { id: "7.1", title: "New keys: G H", type: "new_keys", keys: ["g", "h"], content: getContent(7, "7.1"), duration: "3 - 5 min" },
            { id: "7.2", title: "New keys: ' \"", type: "new_keys", keys: ["'"], content: getContent(7, "7.2"), duration: "1 - 3 min" },
            { id: "7.3", title: "Word drill", type: "drill", content: getContent(7, "7.3"), duration: "3 - 5 min" },
            { id: "7.4", title: "Sentence drill", type: "drill", content: getContent(7, "7.4"), duration: "3 - 5 min" },
            { id: "7.5", title: "Tip: Take breaks", type: "info", content: getContent(7, "7.5"), duration: "1 min" },
            { id: "7.6", title: "Paragraph drill", type: "drill", content: getContent(7, "7.6"), duration: "3 - 5 min" },
            { id: "7.7", title: "Text drill", type: "drill", content: getContent(7, "7.7"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 8,
        title: "8. Keys V, N and Question Mark",
        description: "Bottom row expansion with V, N, and ?",
        sections: [
            { id: "8.1", title: "New keys: V N", type: "new_keys", keys: ["v", "n"], content: getContent(8, "8.1"), duration: "3 - 5 min" },
            { id: "8.2", title: "New key: ?", type: "new_keys", keys: ["?"], content: getContent(8, "8.2"), duration: "1 - 3 min" },
            { id: "8.3", title: "Word drill", type: "drill", content: getContent(8, "8.3"), duration: "3 - 5 min" },
            { id: "8.4", title: "Sentence drill", type: "drill", content: getContent(8, "8.4"), duration: "3 - 5 min" },
            { id: "8.5", title: "Paragraph drill", type: "drill", content: getContent(8, "8.5"), duration: "3 - 5 min" },
            { id: "8.6", title: "Text drill", type: "drill", content: getContent(8, "8.6"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 9,
        title: "9. Keys W and M",
        description: "W and M keys.",
        sections: [
            { id: "9.1", title: "New keys: W M", type: "new_keys", keys: ["w", "m"], content: getContent(9, "9.1"), duration: "3 - 5 min" },
            { id: "9.2", title: "Word drill", type: "drill", content: getContent(9, "9.2"), duration: "3 - 5 min" },
            { id: "9.3", title: "Sentence drill", type: "drill", content: getContent(9, "9.3"), duration: "3 - 5 min" },
            { id: "9.4", title: "Paragraph drill", type: "drill", content: getContent(9, "9.4"), duration: "3 - 5 min" },
            { id: "9.5", title: "Text drill", type: "drill", content: getContent(9, "9.5"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 10,
        title: "10. Keys Q and P",
        description: "Top corners Q and P.",
        sections: [
            { id: "10.1", title: "New keys: Q P", type: "new_keys", keys: ["q", "p"], content: getContent(10, "10.1"), duration: "3 - 5 min" },
            { id: "10.2", title: "Word drill", type: "drill", content: getContent(10, "10.2"), duration: "3 - 5 min" },
            { id: "10.3", title: "Sentence drill", type: "drill", content: getContent(10, "10.3"), duration: "3 - 5 min" },
            { id: "10.4", title: "Paragraph drill", type: "drill", content: getContent(10, "10.4"), duration: "3 - 5 min" },
            { id: "10.5", title: "Text drill", type: "drill", content: getContent(10, "10.5"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 11,
        title: "11. Keys B and Y",
        description: "Reaching far with B and Y.",
        sections: [
            { id: "11.1", title: "New keys: B Y", type: "new_keys", keys: ["b", "y"], content: getContent(11, "11.1"), duration: "3 - 5 min" },
            { id: "11.2", title: "Word drill", type: "drill", content: getContent(11, "11.2"), duration: "3 - 5 min" },
            { id: "11.3", title: "Sentence drill", type: "drill", content: getContent(11, "11.3"), duration: "3 - 5 min" },
            { id: "11.4", title: "Paragraph drill", type: "drill", content: getContent(11, "11.4"), duration: "3 - 5 min" },
            { id: "11.5", title: "Text drill", type: "drill", content: getContent(11, "11.5"), duration: "3 - 5 min" }
        ]
    },
    {
        id: 12,
        title: "12. Keys Z and X",
        description: "The final keys Z and X.",
        sections: [
            { id: "12.1", title: "New keys: Z X", type: "new_keys", keys: ["z", "x"], content: getContent(12, "12.1"), duration: "3 - 5 min" },
            { id: "12.2", title: "Word drill", type: "drill", content: getContent(12, "12.2"), duration: "3 - 5 min" },
            { id: "12.3", title: "Sentence drill", type: "drill", content: getContent(12, "12.3"), duration: "3 - 5 min" },
            { id: "12.4", title: "Paragraph drill", type: "drill", content: getContent(12, "12.4"), duration: "3 - 5 min" },
            { id: "12.5", title: "Tip: Typing tests", type: "info", content: getContent(12, "12.5"), duration: "2 min" },
            { id: "12.6", title: "Text drill", type: "drill", content: getContent(12, "12.6"), duration: "3 - 5 min" },
            { id: "12.7", title: "Completed - what next?", type: "info", content: getContent(12, "12.7"), duration: "2 min" }
        ]
    }
];

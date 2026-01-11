export const LESSONS = [
    {
        id: 1,
        title: "1. The Home Row",
        description: "Learn the basics of tactile typing and the home row keys: A, S, D, F, J, K, L, ;",
        sections: [

            {
                id: "1.1", title: "Touch typing basics", type: "info", content: [
                    "Welcome to the Touch Typing Course!\n\nTouch typing is a technique for typing quicker and more accurately by using all ten fingers without looking at the keys.",
                    "The core idea is to learn the location of keys by muscle memory.\n\nThis means your fingers will know where to go without your eyes guiding them. This saves time and reduces neck strain.",
                    "To begin, place your fingers on the 'Home Row' (A S D F and J K L ;).\n\nYour index fingers should rest on F and J, which usually have small bumps to help you find them by touch."
                ], duration: "3 min"
            },
            { id: "1.2", title: "New keys: Home row", type: "new_keys", keys: ["a", "s", "d", "f", "j", "k", "l", ";"], content: "Place your fingers on the HOME ROW.\n\nLEFT HAND:\nLittle finger on A\nRing finger on S\nMiddle finger on D\nIndex finger on F\n\nRIGHT HAND:\nIndex finger on J\nMiddle finger on K\nRing finger on L\nLittle finger on ;", duration: "3-5 min" },
            { id: "1.3", title: "Drill: Home Row", type: "drill", content: "aaa sss ddd fff jjj kkk lll ;;;\nasdf jkl; asdf jkl;\na; sl dk fj a; sl dk fj\naa ss dd ff jj kk ll ;;", duration: "3-5 min" },
            { id: "1.4", title: "Word Drill", type: "drill", content: "ask dad lad fall flask lass\nsad all add as dad as\nsad alas sad ada dad as sad", duration: "3-5 min" },
            { id: "1.5", title: "Paragraph Drill", type: "drill", content: "ask dad for a lad;\nflask fall;\na sad lass;\na lad asks a dad;\ndad falls;\na lass falls;\nall fall;\nask a sad lad;\ndad asks a lass;", duration: "5 min" }
        ]
    },
    {
        id: 2,
        title: "2. Keys E and I",
        description: "Expand your reach to the top row with E and I.",
        sections: [
            { id: "2.1", title: "New keys: E and I", type: "new_keys", keys: ["e", "i"], content: "Reach for the top row.\n\nKey E: Use your LEFT MIDDLE finger. Reach up from D.\nKey I: Use your RIGHT MIDDLE finger. Reach up from K.\n\nKeep your other fingers on the home row while reaching.", duration: "3 - 5 min" },
            {
                id: "2.2", title: "Optimal duration", type: "info", content: [
                    "How long should you practice?\n\nFor best results, practice in short bursts of 15-30 minutes daily.",
                    "Consistency is more important than duration. Practicing for 2 hours once a week is less effective than 20 minutes every day.",
                    "Your brain needs sleep to consolidate muscle memory. So, daily practice with good rest is the secret formula for speed."
                ], duration: "3 min"
            },
            { id: "2.3", title: "Word drill", type: "drill", content: "ed ik ede iki see sea fee\nif is as idea keel lea led\nlike lie did kid die side slide\nlife file fill fell feel feed seed deed", duration: "3 - 5 min" },
            { id: "2.4", title: "Sentence drill", type: "drill", content: "he is ill;\nshe is like;\ni like it;\nif he falls;\nsee a sea;\na life is a deed;\nfeel a seed;\nfill a file;\ndad is ill;\na kid is a lad;\nhe fed a lad;\nshe did a deed;", duration: "3 - 5 min" },
            {
                id: "2.5", title: "Tip: Typing Meter", type: "info", content: [
                    "What is the Typing Meter?\n\nThe Typing Meter is a widget that tracks your typing in real-world applications.",
                    "It analyzes your typing while you write emails, reports, or chat.\n\nIt then identifies your 'Problem Keys' and suggests custom training lessons to fix them."
                ], duration: "1 min"
            },
            { id: "2.6", title: "Paragraph drill", type: "drill", content: "he feels ill if he fails;\nshe likes a sea side;\nlife is like a slide;\na kid fills a file;\nif a lad falls he feels sad;\ndad did a deed;\nsee if she is ill;\ni feel like a seed;\nhe led a life;", duration: "3 - 5 min" }
        ]
    },
    {
        id: 3,
        title: "3. Keys R and U",
        description: "Learn R and U to complete your index finger reach.",
        sections: [
            { id: "3.1", title: "New keys: R and U", type: "new_keys", keys: ["r", "u"], content: "Use your INDEX fingers for R and U.\n\nKey R: Reach up and left with your LEFT INDEX finger from F.\nKey U: Reach up and left with your RIGHT INDEX finger from J.", duration: "3 - 5 min" },
            { id: "3.2", title: "Word drill", type: "drill", content: "frf juj rur fur\nfar red sue rue sure user\nreal rule full dull\nlark dark earl lurk", duration: "3 - 5 min" },
            {
                id: "3.3", title: "Ergonomics", type: "info", content: [
                    "Ergonomics is key to preventing injury.\n\n1. Sit straight with your back supported.\n2. Keep your feet flat on the floor.",
                    "3. Your screen should be at eye level so you don't bend your neck.\n4. Your elbows should be at a 90-degree angle.",
                    "Most importantly: float your wrists above the keyboard. Do not rest them on the desk while typing, as this compresses the nerves."
                ], duration: "3 min"
            },
            { id: "3.4", title: "Sentence drill", type: "drill", content: "a fur rug;\nuse a rule;\nsure is real;\na full jar;\na dark lark;\nshe has a user;\na real earl;\nhear us rule;\nuse a full jar;", duration: "3 - 5 min" },
            { id: "3.5", title: "Paragraph drill", type: "drill", content: "she has a red rug;\nhe uses a full jar;\nsure he is a user;\na real rule is dull;\nhear a lark;\nan earl has a fur;\nuse a sure rule;\nrun far if dark;", duration: "3 - 5 min" },
            {
                id: "3.6", title: "Tip: Typing games", type: "info", content: [
                    "Learning should be fun!\n\nTyping games are a great way to improve your speed and reaction time without feeling like 'work'.",
                    "Try out the 'Bubbles' game to practice letter recognition, or 'WordTris' to practice typing common words under time pressure."
                ], duration: "1 min"
            },
            { id: "3.7", title: "Text drill", type: "drill", content: "rural ruler allure usual radar judas fuji sufi surfer lurker ruad", duration: "3 - 5 min" }
        ]
    },
    {
        id: 4,
        title: "4. Keys T and O",
        description: "Master T and O.",
        sections: [
            { id: "4.1", title: "New keys: T and O", type: "new_keys", keys: ["t", "o"], content: "Extend your index and ring fingers for T and O.\n\nKey T: Reach up and right with your LEFT INDEX finger from F.\nKey O: Reach up and left with your RIGHT RING finger from L.", duration: "3 - 5 min" },
            { id: "4.2", title: "Word drill", type: "drill", content: "ftf lol tot\ntoo lot rot tool root fort\njust told took lost sort toss\nhost most ghost toast roast coast\nboast float boat coat goat", duration: "3 - 5 min" },
            { id: "4.3", title: "Sentence drill", type: "drill", content: "too hot to trot;\na lot of rot;\nlost a tool;\njust a root;\nold fort is lost;\ntoss a toast;\nroast a goat;\nfloat a boat;\ncoat is hot;\nghost is lost;\nmost host a toast;", duration: "3 - 5 min" },
            {
                id: "4.4", title: "Tip: Progress reports", type: "info", content: [
                    "Track your progress!\n\nAfter each lesson, check the Statistics Dashboard. It gives you a detailed breakdown of your Net Speed (WPM) and Accuracy.",
                    "Look for the 'Difficulty Index'. This tells you exactly which keys you are struggling with.\n\nIf you see a red key, it means you need more practice on that specific letter."
                ], duration: "1 min"
            },
            { id: "4.5", title: "Paragraph drill", type: "drill", content: "the old fort lost a root;\ntoo hot for a coat;\njust a lost ghost;\nroast a lot of toast;\na goat on a boat;\nfloat to the coast;\nmost lost a tool;\ntoss the rot out;\nthe host had a roast;", duration: "3 - 5 min" },
            { id: "4.6", title: "Text drill", type: "drill", content: "tattoo total tooth torso\ntorts toolroot tootsie tootler\ntooter tortue tortil tosh\ntoft told tole toll tolt\ntomb tome ton tone tong", duration: "3 - 5 min" }
        ]
    },
    {
        id: 5,
        title: "5. Capital Letters and Period",
        description: "Learn how to shift for capitals and use the period.",
        sections: [
            { id: "5.1", title: "New keys: Shift", type: "new_keys", keys: ["ShiftLeft", "ShiftRight"], content: "Use the Shift key to type capital letters.\n\nUse the PINKY finger on the OPPOSITE hand of the letter you are typing.\nExample: To type 'A', hold RIGHT SHIFT with right pinky, strike 'A' with left pinky.", duration: "3 - 5 min" },
            { id: "5.2", title: "Word drill", type: "drill", content: "Dad Sad Lad Jack\nJoe Joel Jake Jeff\nJolt Joss Jade Jar\nJed Jet Jig Jost Judo Just", duration: "3 - 5 min" },
            { id: "5.3", title: "New key: Period", type: "new_keys", keys: ["."], content: "Key Period (.): Use your RIGHT RING finger. Reach down from L.\n\nRemember to tap lightly and return to the home row immediately.", duration: "1 - 3 min" },
            { id: "5.4", title: "Sentence drill", type: "drill", content: "Jack acts. Dad is sad.\nA lad falls. Joe is lost.\nJeff has a jet. Jade is red.\nA jar is full. Just do it.\nSee the sea. Feel the air.", duration: "3 - 5 min" },
            {
                id: "5.5", title: "Tip: Typing rhythm", type: "info", content: [
                    "Rhythm is the secret to speed.\n\nTry to type with an even rhythm, like a steady drumbeat or a metronome.",
                    "It is better to slow down and type steadily than to sprint through easy words and get stuck on hard ones.\n\nA steady pace reduces errors, and fewer errors ultimately means faster typing.",
                    "Don't worry about speed for now. Focus on the rhythm."
                ], duration: "1 min"
            },
            { id: "5.6", title: "Paragraph drill", type: "drill", content: "Jack falls. Dad is sad.\nA lad acts. Joe has a jet.\nJeff is lost. Jade has a jar.\nA rut is full. Just a test.\nSee a red sea. Feel a hot air.", duration: "3 - 5 min" },
            { id: "5.7", title: "Text drill", type: "drill", content: "Alaska. Dallas. Florida. Kansas.\nSeattle. Dakota. Detroit. Jordan.\nIsrael. Russia. Sudan. Korea.\nOsaka. Tokio. Jakarta. Lhassa.", duration: "3 - 5 min" }
        ]
    },
    {
        id: 6,
        title: "6. Keys C and Comma",
        description: "Reach down for C and Comma.",
        sections: [
            { id: "6.1", title: "New keys: C ,", type: "new_keys", keys: ["c", ","], content: "Reach down to the bottom row.\n\nKey C: Use your LEFT MIDDLE finger. Reach down from D.\nKey Comma (,): Use your RIGHT MIDDLE finger. Reach down from K.", duration: "3 - 5 min" },
            { id: "6.2", title: "Word drill", type: "drill", content: "call, cell, cast, cost, case,\ncar, cat, cut, cute, code,\ncool, cold, cook, cock, clock,\nclick, class, clash, crash, crush", duration: "3 - 5 min" },
            { id: "6.3", title: "Sentence drill", type: "drill", content: "call a cab, I can see, sir,\na cool cat, cut a cord, cook a crab,\ncatch a cold, click a clock,\ncrash a car, crush a can, class is cool", duration: "3 - 5 min" },
            { id: "6.4", title: "Paragraph drill", type: "drill", content: "A cool cat can call a cab.\nSir, I can cook a crab.\nCatch a cold if ice is cold.\nClick a clock to see time.\nCrash a car if fast.\nCrush a can for cash.\nClass is a cool case.", duration: "3 - 5 min" },
            {
                id: "6.5", title: "Tip: Check your posture", type: "info", content: [
                    "Check your posture again!\n\nIt makes a big difference. As you get tired, it's easy to slouch.",
                    "1. Keep back straight.\n2. Relax shoulders.\n3. Elbows at 90 degrees.",
                    "If you feel tension in your shoulders, take a deep breath and let them drop. Relaxed muscles move faster."
                ], duration: "1 min"
            },
            { id: "6.6", title: "Text drill", type: "drill", content: "cacao, cactus, cadet, caesar,\ncafe, cage, cake, calf, calif,\ncalla, caller, calm, calorie,\ncamel, camera, camp, canal,\ncanary, cancel, cancer, candid,\ncandle, candy, cane, canine,\ncanoe, canon", duration: "3 - 5 min" }
        ]
    },
    {
        id: 7,
        title: "7. Keys G, H and Apostrophe",
        description: "Control the center with G and H.",
        sections: [
            { id: "7.1", title: "New keys: G H", type: "new_keys", keys: ["g", "h"], content: "Learning the center keys.\n\nKey G: Reach right with your LEFT INDEX finger from F.\nKey H: Reach left with your RIGHT INDEX finger from J.", duration: "3 - 5 min" },
            { id: "7.2", title: "New keys: ' \"", type: "new_keys", keys: ["'"], content: "Key Apostrophe ('): Use your RIGHT PINKY. Reach right from Semicolon (;).", duration: "1 - 3 min" },
            { id: "7.3", title: "Word drill", type: "drill", content: "gas has hat had hog hug\nhigh sigh thigh fight light\nright might sight night tight\ndash hash gash lash sash", duration: "3 - 5 min" },
            { id: "7.4", title: "Sentence drill", type: "drill", content: "he has a hat;\nshe had a gas;\na high sigh;\nfight the light;\nthe right sight;\nmight is right;\nhold the light tight;", duration: "3 - 5 min" },
            {
                id: "7.5", title: "Tip: Take breaks", type: "info", content: [
                    "Don't forget to take breaks!\n\nTyping for long periods can cause Repetitive Strain Injury (RSI).",
                    "We recommend the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
                    "Also, stand up and stretch every hour to keep good blood flow."
                ], duration: "1 min"
            },
            { id: "7.6", title: "Paragraph drill", type: "drill", content: "he had a hat on his head;\nshe has a high gas bill;\nthe light is too bright;\nhold the sash tight;\na fight for the right sight;\nhigh lights are bright;", duration: "3 - 5 min" },
            { id: "7.7", title: "Text drill", type: "drill", content: "although, though, thought, through,\nhighlight, headlight, flashlight,\nslaughter, laughter, daughter,\nfrighten, lighten, tighten, brighten", duration: "3 - 5 min" }
        ]
    },
    {
        id: 8,
        title: "8. Keys V, N and Question Mark",
        description: "Bottom row expansion with V, N, and ?",
        sections: [
            { id: "8.1", title: "New keys: V N", type: "new_keys", keys: ["v", "n"], content: "More bottom row keys.\n\nKey V: Reach down and right with LEFT INDEX finger.\nKey N: Reach down and left with RIGHT INDEX finger.", duration: "3 - 5 min" },
            { id: "8.2", title: "New key: ?", type: "new_keys", keys: ["?"], content: "Key Question Mark (?): Use RIGHT PINKY + LEFT SHIFT. Reach down and right from Semicolon.", duration: "1 - 3 min" },
            { id: "8.3", title: "Word drill", type: "drill", content: "van vat vet vest vine vote void\noven even seven never river over\ncover lover mover hover\nnone nine noon noun name", duration: "3 - 5 min" },
            { id: "8.4", title: "Sentence drill", type: "drill", content: "can i have a van?\nis it a vet?\ndo not vote on it?\nhave you seen a vine?\na vest is on the vat?\nis seven ever even?\ncover the oven now?", duration: "3 - 5 min" },
            { id: "8.5", title: "Paragraph drill", type: "drill", content: "can i have a vest?\nno, not ever.\nis the oven on?\nseven vines cover the river.\nhave you seen a vote?\nnever hover over a van.\nis it noon?", duration: "3 - 5 min" },
            { id: "8.6", title: "Text drill", type: "drill", content: "invent, invest, invite, invoice,\nnative, nature, naval, navel,\nnerve, never, niece, night,\nnoise, none, noon, north,\nnovel, novice, nurse", duration: "3 - 5 min" }
        ]
    },
    {
        id: 9,
        title: "9. Keys W and M",
        description: "W and M keys.",
        sections: [
            { id: "9.1", title: "New keys: W M", type: "new_keys", keys: ["w", "m"], content: "Key W: Use your LEFT RING finger. Reach up from S.\nKey M: Use your RIGHT INDEX finger. Reach down from J.", duration: "3 - 5 min" },
            { id: "9.2", title: "Word drill", type: "drill", content: "way was wet win wit who why\nhow cow now vow wow maw mew\nmow mud mug mum sum hum gum\nswim warm worm swarm farm form", duration: "3 - 5 min" },
            { id: "9.3", title: "Sentence drill", type: "drill", content: "who won the war;\nhow is the cow now;\nwe will win wit;\nmow the wet mud;\nswim in the warm sea;\na worm in the swarm;\nform a firm farm;", duration: "3 - 5 min" },
            { id: "9.4", title: "Paragraph drill", type: "drill", content: "we want to win the war;\nhow warm is the water;\nswim with the swarm;\nmow the mud on the farm;\nwho will vow to win;\na worm was in the mug;\nwarm milk for mum;", duration: "3 - 5 min" },
            { id: "9.5", title: "Text drill", type: "drill", content: "woman, women, won, wonder, wood,\nwool, word, work, world, worm,\nworry, worse, worship, worst,\nworth, would, wound, wrap, wreck,\nwrist, write, wrong", duration: "3 - 5 min" }
        ]
    },
    {
        id: 10,
        title: "10. Keys Q and P",
        description: "Top corners Q and P.",
        sections: [
            { id: "10.1", title: "New keys: Q P", type: "new_keys", keys: ["q", "p"], content: "Reaching the corners.\n\nKey Q: Use your LEFT PINKY. Reach up from A.\nKey P: Use your RIGHT PINKY. Reach up from Semicolon (;).", duration: "3 - 5 min" },
            { id: "10.2", title: "Word drill", type: "drill", content: "quit queen quick quiet quite quote\npay pat pet pen pit pot pan\npin pun pup pop pap pipe pope\npoint paint plant plane plate place", duration: "3 - 5 min" },
            { id: "10.3", title: "Sentence drill", type: "drill", content: "quit the quick game;\npay the queen a pen;\nquiet peace in the place;\nplant a pine on the plane;\nquote the pope quite well;\npoint to the plate;\npaint the pot pink;", duration: "3 - 5 min" },
            { id: "10.4", title: "Paragraph drill", type: "drill", content: "please pay the queen;\na quick quiet quote;\nplant a pink pine;\npoint to the paint;\nthe pope has a plane;\nput the pen in the pot;\nquite a place to quit;", duration: "3 - 5 min" },
            { id: "10.5", title: "Text drill", type: "drill", content: "packet, page, pail, pain, paint,\npair, palace, pale, palm, pan,\npanel, panic, papa, paper, parade,\nparcel, pardon, parent, park,\nparlor, part, party, pass", duration: "3 - 5 min" }
        ]
    },
    {
        id: 11,
        title: "11. Keys B and Y",
        description: "Reaching far with B and Y.",
        sections: [
            { id: "11.1", title: "New keys: B Y", type: "new_keys", keys: ["b", "y"], content: "Key B: Reach down and right with LEFT INDEX finger.\nKey Y: Reach up and left with RIGHT INDEX finger.", duration: "3 - 5 min" },
            { id: "11.2", title: "Word drill", type: "drill", content: "bad bag bat bed beg bet\nbid big bit bog box boy\nbuy by bye yes yet you\nany boy buy by bye my\nyear yard yell yellow yes", duration: "3 - 5 min" },
            { id: "11.3", title: "Sentence drill", type: "drill", content: "buy a bag for the boy;\nyes you can bet on it;\na big yellow box;\nby the year in the yard;\nsay yes to the boy;\nbye bye baby boy;\na bit of a big bag;", duration: "3 - 5 min" },
            { id: "11.4", title: "Paragraph drill", type: "drill", content: "the boy has a big bag;\nyes, buy the yellow box;\nyou can bet on the year;\nsay bye to the bad boy;\nin the yard by the bay;\nyet you say yes;", duration: "3 - 5 min" },
            { id: "11.5", title: "Text drill", type: "drill", content: "baby, back, bad, bag, bake,\nbalance, ball, band, bang, bank,\nbar, barber, bare, bark, barn,\nbarrel, base, basin, basket,\nbath, battle, bay, beach, beak", duration: "3 - 5 min" }
        ]
    },
    {
        id: 12,
        title: "12. Keys Z and X",
        description: "The final keys Z and X.",
        sections: [

            { id: "12.1", title: "New keys: Z X", type: "new_keys", keys: ["z", "x"], content: "Key Z: Use your LEFT PINKY. Reach down from A.\nKey X: Use your LEFT RING finger. Reach down from S.", duration: "3 - 5 min" },
            { id: "12.2", title: "Word drill", type: "drill", content: "aza sxs aza sxs\nzap zag zip zoo ax ex ox\nsix fix mix fox box wax\nlax tax sex text next\nzero zone size seize breeze", duration: "3 - 5 min" },
            { id: "12.3", title: "Sentence drill", type: "drill", content: "fix the box at six;\nthe fox is in the zoo;\na size zero zone;\nseize the ax now;\nrelax next to the box;\nmix the wax for the car;", duration: "3 - 5 min" },
            { id: "12.4", title: "Paragraph drill", type: "drill", content: "the fox was in a box;\nfix the lock at six;\nthe zoo has a big size;\nseize the day next year;\nrelax in the zone;\na breeze in the trees;", duration: "3 - 5 min" },
            {
                id: "12.5", title: "Tip: Typing tests", type: "info", content: [
                    "Testing your skills.\n\nRegular typing tests help measure your progress. However, don't just focus on speed.",
                    "Accuracy is the foundation of speed. If you type fast but make many errors, you will spend more time correcting them than typing.",
                    "Aim for 98% accuracy or higher. Speed will naturally follow."
                ], duration: "2 min"
            },
            { id: "12.6", title: "Text drill", type: "drill", content: "exact, exam, example, excel,\nexcellent, except, excess, excite,\nexcuse, execute, exercise, exert,\nexist, exit, expand, expect,\nexpense, expert, expire, explain", duration: "3 - 5 min" },
            {
                id: "12.7", title: "Completed - what next?", type: "info", content: [
                    "Congratulations! You have completed the basic course.",
                    "You have learned all the alphabet keys and basic punctuation.\n\nSo, what is next?",
                    "1. Continue practicing to build speed.\n2. Learn the number row.\n3. Master the special symbols.\n4. Try the advanced speed building courses."
                ], duration: "2 min"
            }
        ]
    }
];

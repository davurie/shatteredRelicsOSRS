const taskFlow = {
    rows: [],
    currentIndex: 0,
    completedTasksCount: 0,
    completedPointsCount: 0,

    get currentTask() {
        const task = this.rows[this.currentIndex];
        return task && task.type === 'TASK' ? task : {};
    },

    get currentInstructions() {
        let instructions = '';
        let index = this.currentIndex;
        while (index > 0 && this.rows[index - 1].type === 'INSTRUCTION') {
            instructions = `<p>${this.rows[index - 1].text}</p>` + instructions;
            index--;
        }
        return instructions;
    },

    get currentSubsection() {
        let index = this.currentIndex;
        while (index >= 0) {
            if (this.rows[index].type === 'SECTION') {
                return this.rows[index].name;
            }
            index--;
        }
        return '';
    },

    get completedTasks() {
        return this.completedTasksCount;
    },

    get completedPoints() {
        return this.completedPointsCount;
    },

    markAsDone() {
        if (this.currentIndex < this.rows.length) {
            const task = this.currentTask;
            if (task.type === 'TASK') {
                task.completed = true;
                this.completedTasksCount++;
                this.completedPointsCount += task.points || 0;
            }
            this.currentIndex++;
            while (this.currentIndex < this.rows.length && this.rows[this.currentIndex].type !== 'TASK') {
                this.currentIndex++;
            }
            this.saveProgress();
            this.updateUI();
        }
    },

    undo() {

        if (this.currentIndex === 1) return;

        if (this.currentIndex > 0) {
            // Step back to the previous task
            this.currentIndex--;
            while (this.currentIndex >= 0 && this.rows[this.currentIndex].type !== 'TASK') {
                this.currentIndex--;
            }

            const task = this.rows[this.currentIndex];
            if (task && task.type === 'TASK' && task.completed) {
                task.completed = false;
                this.completedTasksCount--;
                this.completedPointsCount -= task.points || 0;
            }

            this.saveProgress();
            this.updateUI();
        }
    },

    updateUI() {
        document.getElementById('completed-tasks').textContent = this.completedTasks;
        document.getElementById('total-points').textContent = this.completedPoints;
        document.getElementById('current-subsection').textContent = this.currentSubsection;

        const instructionsElement = document.getElementById('current-instructions');
        instructionsElement.innerHTML = this.currentInstructions;

        const taskElement = document.getElementById('current-task');
        const noteElement = document.getElementById('current-task-note');
        const markDoneButton = document.getElementById('mark-done-btn');
        const undoButton = document.getElementById('undo-btn');

        const currentTask = this.currentTask;

        if (currentTask.text) {
            taskElement.textContent = currentTask.text;
            noteElement.style.display = currentTask.note ? 'block' : 'none';
            noteElement.textContent = currentTask.note || '';
            markDoneButton.style.display = 'inline-block';
            undoButton.style.display = this.currentIndex > 0 ? 'inline-block' : 'none';
        } else {
            taskElement.textContent = 'No more tasks!';
            noteElement.style.display = 'none';
            markDoneButton.style.display = 'none';
            undoButton.style.display = this.completedTasks > 0 ? 'inline-block' : 'none';
        }

        updateTaskMarker(currentTask);
    },

    saveProgress() {
        const progress = {
            currentIndex: this.currentIndex,
            completedTasks: this.completedTasksCount,
            completedPoints: this.completedPointsCount
        };
        localStorage.setItem('taskFlowProgress', JSON.stringify(progress));
    },

    loadProgress() {
        const savedProgress = localStorage.getItem('taskFlowProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.currentIndex = progress.currentIndex || 0;
            this.completedTasksCount = progress.completedTasks || 0;
            this.completedPointsCount = progress.completedPoints || 0;
        }
    },

    init(data) {
        this.rows = data.map((row, index) => ({
            ...row,
            completed: false,
            id: index
        }));

        this.loadProgress();

        if (this.currentIndex >= this.rows.length || this.rows[this.currentIndex].type !== 'TASK') {
            this.currentIndex = this.rows.findIndex(row => row.type === 'TASK');
            if (this.currentIndex === -1) {
                this.currentIndex = 0;
            }
        }
        this.updateUI();
    }
};

const sampleData = [
    { type: "SECTION", name: "Lumbridge 1", coords: { x: 6555, y: 2210 } },
    { type: "TASK", text: "Finish the Leagues Tutorial", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "TASK", text: "Open the Leagues Menu", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "INSTRUCTION", text: "Use Prayer" },
    { type: "INSTRUCTION", text: "Settings: Disable level up notifications, F Keys, Hide Roofs" },
    { type: "INSTRUCTION", text: "Equip: Arrows, Dramen Staff Drop Sword, Dagger, Body Runes, Bow, Net" },
    { type: "TASK", text: "Pickpocket a man", note: "Till level 5", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "TASK", text: "Ask Hans age", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "INSTRUCTION", text: "Claim Runes from Tutor", coords: { x: 6543.75, y: 2270.50 } },
    { type: "INSTRUCTION", text: "Buy 2 Beers", coords: { x: 6580.00, y: 2271.50 } },
    { type: "TASK", text: "Pray at Altar", points: 10, coords: { x: 6621.00, y: 2175.50 } },
    { type: "TASK", text: "Dance in the Graveyard", points: 10, coords: { x: 6619.50, y: 2142.00 } },
    { type: "TASK", text: "Enter Death's Domain", points: 10, coords: { x: 6601.50, y: 2128.50 } },
    { type: "INSTRUCTION", text: "Use Count Check tele to Stronghold of Security", coords: { x: 6606.50, y: 2148.50 } },
    { type: "TASK", text: "Get 10k + Fancy Boots", points: 30, coords: { x: 6129.00, y: 2813.00 } },
    { type: "INSTRUCTION", text: "Climb out of security stronghold" },
    { type: "TASK", text: "Buy Steel Full Helm", note: "Equip when you can", points: 10, coords: { x: 6111.00, y: 2839.50 } },
    { type: "TASK", text: "Kill 1 Barbarian", points: 10, coords: { x: 6151.50, y: 2813.00 } },
    { type: "TASK", text: "Drink Beer in Long Hall", points: 10, coords: { x: 6123.50, y: 2876.00 } },
    { type: "INSTRUCTION", text: "Get a task from Vannaka (Edgeville Dungeon)" },
    { type: "TASK", text: "Buy and check enchanted gem", points: 10, coords: { x: 6178.00, y: 2960.00 } },
    { type: "TASK", text: "Buy a spiny helmet", note: "Equip it when you can, and keep it on for now", points: 10, coords: { x: 6178.00, y: 2960.00 } },
    { type: "TASK", text: "Mine Copper Ore + Tin ore on the way to Hill Giant (edgeville dungeon entrance)", note: "Skip if not available", points: 10, coords: { x: 6178.00, y: 2960.00 } },
    { type: "TASK", text: "Kill 1 Hill Giant", note: "Once 9 Magic, defensive cast", coords: { x: 6178.00, y: 2960.00 } },
    { type: "INSTRUCTION", text: "Tele to Karamja (region interface)" },
    { type: "INSTRUCTION", text: "If possible kill snake, or pick pinapple. Otherwise skip." },
    { type: "SECTION", name: "Karamja 1" },
    { type: "TASK", text: "Buy a knife from the charter ship", points: 10, coords: { x: 5169.75, y: 2248.50 } },
    { type: "INSTRUCTION", text: "Cart to Shilo Village", coords: { x: 5230.00, y: 2194.50 } },
    { type: "INSTRUCTION", text: "Buy hammer" },
    { type: "INSTRUCTION", text: "Buy Rope" },
    { type: "TASK", text: "Buy a torch and light it", points: 10, coords: { x: 5362.00, y: 1427.00 } },
    { type: "INSTRUCTION", text: "Buy fishing bait, feathers" },
    { type: "TASK", text: "Pay to sleep in Paramaya Inn (north side of shilo, buy 1 paramaya ticket, then use it to sleep)", points: 30, coords: { x: 5477.00, y: 1540.50 } },
    { type: "TASK", text: "Home tele", points: 10, coords: { x: 6554.75, y: 2208.75 } },
    { type: "SECTION", name: "Lumbridge 2" },
    { type: "INSTRUCTION", text: "Buy steel axe" },
    { type: "TASK", text: "Ask Bob for quest", note: "Dont drop bronze yet", points: 10, coords: { x: 6586.50, y: 2160.50 } },
    { type: "TASK", text: "Smelt Bronze Bar", note: "Skip if you didn't get ores", points: 10, coords: { x: 6568.25, y: 2301.50 } },
    { type: "TASK", text: "Milk Cow", points: 10, coords: { x: 6646.00, y: 2376.50 } },
    { type: "INSTRUCTION", text: "Get an egg from chicken coup" },
    { type: "TASK", text: "Kill Chicken with Fists", note: "Pick up raw chicken", points: 10, coords: { x: 6588.25, y: 2435.75 } },
    { type: "TASK", text: "Bury its bones", points: 10, coords: { x: 6588.25, y: 2435.75 } },
    { type: "TASK", text: "Find needle in haystack", note: "Totally skippable - takes about a min if unlucky", points: 30, coords: { x: 6311.75, y: 2459.50 } },
    { type: "TASK", text: "Pick 3 onions at farm house on the way to wheat field, eat one of the onions", points: 10, coords: { x: 6459.25, y: 2352.50 } },
    { type: "TASK", text: "Get wheat / Cry in wheat field", points: 10, coords: { x: 6368.00, y: 2444.75 } },
    { type: "TASK", text: "Make Flour", points: 10, coords: { x: 6384.75, y: 2472.25 } },
    { type: "SECTION", name: "Daynor 1" },
    { type: "TASK", text: "1 Agility Lap", points: 10, coords: { x: 6200.57, y: 2389.50 } },
    { type: "TASK", text: "Insult Aggie", points: 10, coords: { x: 6146.82, y: 2330.00 } },
    { type: "INSTRUCTION", text: "Start vampyre slayer (Morgan)." },
    { type: "INSTRUCTION", text: "Go upstairs, get garlic from the cupboard." },
    { type: "TASK", text: "Use Helmet on Hat Stand In Morgan's house", note: "Pick the hat up", points: 10, coords: { x: 6185.32, y: 2357.50 } },
    { type: "TASK", text: "Burn 1 Chicken", points: 10, coords: { x: 6159.57, y: 2234.25 } },
    { type: "TASK", text: "Fish 8 shrimp", points: 10, coords: { x: 6142.07, y: 2237.50 } },
    { type: "TASK", text: "Fish 25 Sardines", points: 30, coords: { x: 6142.07, y: 2237.50 } },
    { type: "INSTRUCTION", text: "Fish 9 Herring" },
    { type: "TASK", text: "Catch 1 Anchovy once 15 Fishing", points: 10, coords: { x: 6142.07, y: 2237.50 } },
    { type: "TASK", text: "Chop 20 logs", points: 10, coords: { x: 6204.07, y: 2241.50 } },
    { type: "TASK", text: "Chop Log with Steel Axe", points: 10, coords: { x: 6204.07, y: 2241.50 } },
    { type: "TASK", text: "Burn 13 logs", points: 10, coords: { x: 6204.07, y: 2241.50 } },
    { type: "INSTRUCTION", text: "Once 15 WC/FM chop an oak tree" },
    { type: "TASK", text: "Burn 1 Oak Log", points: 10, coords: { x: 6195.82, y: 2281.25 } },
    { type: "TASK", text: "Fletch Arrow Shafts", points: 10 },
    { type: "INSTRUCTION", text: "Buy 4 barley seeds" },
    { type: "INSTRUCTION", text: "Bank" },
    { type: "INSTRUCTION", text: "Buy Chronicle + 5 charges" },
    { type: "INSTRUCTION", text: "Chronicle tele" },
    { type: "SECTION", name: "Varrock 1" },
    { type: "TASK", text: "Buy a rake from bush patch and rake weeds", note: "If possible: Kill Mugger", points: 10, coords: { x: 6436.32, y: 2622.25 } },
    { type: "TASK", text: "Pick a cabbage (first house on the right, south entrance)", note: "Behind first house on the east in the south entrance", points: 10, coords: { x: 6572.25, y: 2711.50 } },
    { type: "TASK", text: "Buy an Iron dagger and equip it", points: 10, coords: { x: 6506.75, y: 2748.75 } },
    { type: "INSTRUCTION", text: "Talk to Dr. Harlow in Varrock Bar and continue vampire slayer" },
    { type: "INSTRUCTION", text: "If Desert: Start Demon Slayer, Buy Bucket, fill with water" },
    { type: "TASK", text: "Buy Air Staff and Equip", points: 10, coords: { x: 6496.75, y: 2863.00 } },
    { type: "TASK", text: "Pet Stray Dog", note: "If he isn't in your path or in sight, skip", points: 10, coords: { x: 6537.00, y: 2832.75 } },
    { type: "INSTRUCTION", text: "Buy 200 Mind runes + 100 of each Elemental", coords: { x: 6646.75, y: 2760.00 } },
    { type: "TASK", text: "Travel to Essence Mine with Varrock", points: 10, coords: { x: 6645.25, y: 2757.50 } },
    { type: "TASK", text: "Mine 1 essence", points: 10, coords: { x: 6645.25, y: 2757.50 } },
    { type: "TASK", text: "Upset the Tramp", points: 10, coords: { x: 6607.00, y: 2722.25 } },
    { type: "TASK", text: "Steal tea", points: 10, coords: { x: 6701.50, y: 2791.00 } },
    { type: "TASK", text: "Kill a Guard", points: 10, coords: { x: 6686.25, y: 2837.00 } },
    { type: "INSTRUCTION", text: "Rake the Tree patch (all of the weeds)" },
    { type: "INSTRUCTION", text: "If Desert: Talk to Syr Prising, Talk to Captain Rovin (NW tower, up 2 floors). Use water on key in drain (Right outside kitchen)" },
    { type: "TASK", text: "Get Haircut", note: "Building North of Museum", points: 10, coords: { x: 6657.25, y: 2939.25 } },
    { type: "TASK", text: "Buy POH", points: 10, coords: { x: 6608.50, y: 2979.25 } },
    { type: "TASK", text: "Give tea to Elsie upstairs in Varrock Church", points: 10, coords: { x: 6664.25, y: 3012.25 } },
    { type: "TASK", text: "Enter Varrock sewer and Kill a Rat", points: 10, coords: { x: 6599.75, y: 2926.50 } },
    { type: "TASK", text: "Slash web in varrock sewer", points: 10, coords: { x: 6599.75, y: 2926.50 } },
    { type: "TASK", text: "Kick a spider", points: 10, coords: { x: 6599.75, y: 2926.50 } },
    { type: "TASK", text: "Kill moss giant (Fire Spells)", note: "If busy kill in brimhaven instead", points: 10, coords: { x: 6599.75, y: 2926.50 } },
    { type: "INSTRUCTION", text: "Chronicle Tele" },
    { type: "INSTRUCTION", text: "Run south to the hops patch" },
    { type: "INSTRUCTION", text: "Buy 4 compost" },
    { type: "TASK", text: "Plant and protect the Barley", points: 10, coords: { x: 6562.00, y: 2491.50 } },
    { type: "INSTRUCTION", text: "Use compost on the patch" },
    { type: "INSTRUCTION", text: "Home tele" },
    { type: "INSTRUCTION", text: "Claim 2nd Relic" },
    { type: "SECTION", name: "Lumbridge 3" },
    { type: "INSTRUCTION", text: "Start and Finish cook's assistant", coords: { x: 6517.00, y: 2194.50 } },
    { type: "TASK", text: "Cook food on Range", points: 30, coords: { x: 6522.50, y: 2196.50 } },
    { type: "TASK", text: "Cook a Shrimp", points: 10, coords: { x: 6522.50, y: 2196.50 } },
    { type: "TASK", text: "Cook 10 Sardines", note: "Might be auto completed with harpoon relic", points: 30, coords: { x: 6522.50, y: 2196.50 } },
    { type: "TASK", text: "Cook 5 Food without Burning", note: "Might be auto completed with harpoon relic", points: 10, coords: { x: 6522.50, y: 2196.50 } },
    { type: "INSTRUCTION", text: "Claim Dragonfire Shield from Duke" },
    { type: "TASK", text: "Use Northern Staircase in Lumbridge Castle", points: 10, coords: { x: 6506.00, y: 2237.00 } },
    { type: "TASK", text: "Kill a frog in swamp", points: 10, coords: { x: 6548.00, y: 2096.50 } },
    { type: "TASK", text: "Enter Zanaris", points: 10, coords: { x: 6497.50, y: 2057.00 } },
    { type: "TASK", text: "Use fairy ring CKR", points: 10, coords: { x: 6497.50, y: 2057.00 } },
    { type: "TASK", text: "Fish karambwanji", points: 10, coords: { x: 5308.00, y: 1595.50 } },
    { type: "INSTRUCTION", text: "Tele to Karamja (region interface)" },
    { type: "INSTRUCTION", text: "If possible kill snake, or pick pineapple. If you have completed, skip." },
    { type: "SECTION", name: "Karamja 2" },
    { type: "TASK", text: "Enter POH", points: 10, coords: { x: 5154.50, y: 2087.00 } },
    { type: "TASK", text: "Build a Room in POH", points: 30, coords: { x: 5154.50, y: 2087.00 } },
    { type: "TASK", text: "Enter Brimhaven Dungeon", points: 30, coords: { x: 5119.00, y: 2013.00 } },
    { type: "TASK", text: "Kill a Greater Demon in Brimhaven Dungeon (Water Spells)", points: 30, coords: { x: 5119.00, y: 2013.00 } },
    { type: "TASK", text: "Scatter Ashes", points: 10, coords: { x: 5119.00, y: 2013.00 } },
    { type: "INSTRUCTION", text: "TP to Karamja" },
    { type: "TASK", text: "Kill an Imp (near Volcano) with an earth spell", points: 10, coords: { x: 5372.00, y: 2080.50 } },
    { type: "TASK", text: "Kill a lesser demon (Water Spells)", points: 30, coords: { x: 5454.50, y: 2057.00 } },
    { type: "TASK", text: "Kill a tzhaar (lvl 133s, Water Spells)", points: 30, coords: { x: 5454.50, y: 2057.00 } },
    { type: "TASK", text: "Pick 11 bananas, eat one", points: 10, coords: { x: 5637.50, y: 2028.50 } },
    { type: "TASK", text: "Talk to Luthus, add 10 bananas to the crate", points: 10, coords: { x: 5709.50, y: 2014.50 } },
    { type: "SECTION", name: "Extras" },
    { type: "TASK", text: "Reach any Level 2", points: 10 },
    { type: "TASK", text: "Reach any Level 5", points: 10 },
    { type: "TASK", text: "Reach any Level 10", points: 10 },
    { type: "TASK", text: "Total Level 100", points: 10 },
    { type: "TASK", text: "10 Combat", points: 10 },
    { type: "TASK", text: "Open 28 coin pouches at once", points: 30 },
    { type: "TASK", text: "Open 800gp in coin pouches", points: 30 },
    { type: "TASK", text: "H.A.M. member", note: "15 thiev", points: 30, coords: { x: 6382.50, y: 2309.50 } },
    { type: "TASK", text: "Pickpocket a bullseye lantern from a cave goblin", note: "36 thiev, Buy Dorg Crossbow + Bolts", points: 30, coords: { x: 6515.00, y: 2194.00 } },
    { type: "TASK", text: "Pickpocket master farmer", note: "38 thiev", points: 30, coords: { x: 6124.00, y: 2321.00 } },
    { type: "TASK", text: "Pickpocket guard", note: "40 thiev", points: 30, coords: { x: 6526.50, y: 2946.25 } },
    { type: "INSTRUCTION", text: "TP to lumbridge" },
    { type: "TASK", text: "Kill a Duck with a fire spell", points: 10, coords: { x: 6624.00, y: 2228.50 } },
    { type: "TASK", text: "Kill a Ram", points: 10, coords: { x: 6498.50, y: 2346.50 } },
    { type: "TASK", text: "Kill a Cow in 1 hit", points: 10, coords: { x: 6663.50, y: 2349.50 } },
    { type: "INSTRUCTION", text: "Chronicle Tele" },
    { type: "TASK", text: "Kill a Dark Wizard", points: 10, coords: { x: 6576.50, y: 2666.00 } },
    { type: "TASK", text: "Kill a mugger", note: "Next to champions guild/aubry's rune shop", points: 10, coords: { x: 6643.00, y: 2740.50 } },
    { type: "TASK", text: "Kill a goblin holding a spear", note: "West of cook's guild", points: 10, coords: { x: 6253.50, y: 2863.50 } },
    { type: "TASK", text: "Kill a gorak until you get a gem drop", note: "Fairy ring: DIR, can be safespotted", points: 30, coords: { x: 6269.50, y: 3037.50 } },
    { type: "INSTRUCTION", text: "Misthalin Mystery (Keep Ruby)" },
    { type: "INSTRUCTION", text: "Cut Sapphires to 27 crafting - keep 1" },
    { type: "INSTRUCTION", text: "Cut Emeralds to 34 crafting - keep 1" },
    { type: "TASK", text: "Complete history quiz - 25 hunter/slayer", points: 10, coords: { x: 6670.00, y: 2907.00 } },
    { type: "INSTRUCTION", text: "Get Tier 3 Relic" },
    { type: "TASK", text: "Complete Rag'n Bone Man", points: 10, coords: { x: 6973.75, y: 3060.50 } }
];

taskFlow.init(sampleData);

document.getElementById('mark-done-btn').addEventListener('click', () => taskFlow.markAsDone());
document.getElementById('undo-btn').addEventListener('click', () => taskFlow.undo());

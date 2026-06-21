import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const git = simpleGit();
const path = "./data.json";

const START_DATE = moment("2014-01-01");
const END_DATE = moment("2026-06-21");
const TARGET_COMMITS = 800;

let commitsMade = 0;

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomWeekdayDate = () => {
    while (true) {
        const timestamp = randomInt(START_DATE.valueOf(), END_DATE.valueOf());
        const date = moment(timestamp);
        if (date.day() !== 0 && date.day() !== 6) return date;
    }
};

const getCommitsForDay = () => {
    const r = Math.random();
    if (r < 0.45) return 0;
    if (r < 0.80) return randomInt(1, 2);
    if (r < 0.95) return randomInt(3, 5);
    return randomInt(6, 10);
};

const commit = (date) => {
    return jsonfile
        .writeFile(path, { date: date.format() })
        .then(() =>
            git.add([path]).commit(date.format(), {
                "--date": date.format(),
            })
        );
};

const makeCommits = async () => {
    while (commitsMade < TARGET_COMMITS) {
        const date = randomWeekdayDate();
        const commitsToday = getCommitsForDay();

        for (let i = 0; i < commitsToday && commitsMade < TARGET_COMMITS; i++) {
            await commit(date);
            commitsMade++;
        }

        console.log("Total:", commitsMade);
    }

    await git.push();
};

makeCommits();
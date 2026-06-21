import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const START_DATE = moment("2014-01-01");
const END_DATE = moment("2016-06-21");

const TARGET_COMMITS = 800;

let commitsMade = 0;

// pick only weekday date
const randomWeekdayDate = () => {
    while (true) {
        const start = START_DATE.valueOf();
        const end = END_DATE.valueOf();

        const timestamp = random.int(start, end);
        const date = moment(timestamp);

        const day = date.day(); // 0 Sun, 6 Sat

        if (day !== 0 && day !== 6) return date;
    }
};

// realistic commits per day
const getCommitsForDay = () => {
    const r = Math.random();

    if (r < 0.45) return 0;       // no commit day
    if (r < 0.80) return random.int(1, 2);
    if (r < 0.95) return random.int(3, 5);
    return random.int(6, 10);
};

const commit = (date, done) => {
    jsonfile.writeFile(path, { date: date.format() }, () => {
        simpleGit()
            .add([path])
            .commit(date.format(), { "--date": date.format() }, done);
    });
};

const makeCommits = () => {
    if (commitsMade >= TARGET_COMMITS) {
        return simpleGit().push();
    }

    const date = randomWeekdayDate();
    const commitsToday = getCommitsForDay();

    for (let i = 0; i < commitsToday; i++) {
        if (commitsMade >= TARGET_COMMITS) break;

        commit(date, () => { });
        commitsMade++;
    }

    console.log(`Total: ${commitsMade}`);

    // small delay to avoid Git overload
    setTimeout(makeCommits, 10);
};

makeCommits();
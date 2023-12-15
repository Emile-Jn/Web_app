const word = document.getElementById("word")
const input = document.getElementById("input")
const feedback = document.getElementById("feedback")
const result = document.getElementById("result")
const Deutsch = document.getElementById("Deutsch")
const slovensky = document.getElementById("slovensky")
const again = document.getElementById("again")
const change_list = document.getElementById("change_list")
const change_lan = document.getElementById("change_lan")
const end_buttons = document.getElementById("end_buttons")
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const tableBody = document.getElementById('logTableBody');
const tableContainer = document.getElementById('logTableContainer');

// Declare variables
let vortoj = []
let word_list = []
let current_word_index = 0;
let score = 0;
let score_max = 20;
let numlist = 0;
let message_1 = ["Attention aux espaces!", "Careful with spaces!"]
let message_2 = ["Attention aux majuscules!", "Case sensitive!"]
let message_3 = ["Attention aux espaces et aux majuscules!", "Careful with spaces and case sensitivity!"]
let message_4 = ["Essaye encore", "Try again"]
let message_5 = ["choisir une langue à apprendre", "choose a language to learn"]
let message_6 = ["Choisir une liste", "Choose a list"]
let message_7 = ["ce doit être un nombre entier!", "it must be an integer!"]
let message_8 = [`Le nombre de liste maximum est ${numlist}! Entrer un nombre entre 1 et ${numlist}.`,
    `The maximum list number is ${numlist}! Enter a number between 1 and ${numlist}.`]
let message_9 = ["recommencer", "start again"]
let message_10 = ["changer de liste", "change list"]
let message_11 = ["changer de langue", "change language"]
let message_12 = ["choisir", "choose"]
let message_13 = ["genre incorrect", "incorrect gender"]
let langue = 0  // 0 : français, 1 : english
let rep = 3  // repeat word after rep words
let lan = "Deutsch"  // Deutsch or Slovensky
let listNumber = 0  // list number
let determinants = ["der", "die", "das"]
let Interface = "start"
let prog = 0; // Start with a progress of 0
let canProgress = true; // indicates whether progress should be counted when the word is correct


// Function to load the JSON data from a local file
function loadJSONFile(file, callback) {
    console.log("loadJSONFile (line 44)") // TODO: remove
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", file, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        } else if (xhr.readyState === 4) {
            callback(null);
        }
    };
    xhr.send(null);
}

function fetchQuestions() {
    console.log("fetchQuestions (line 59)") // TODO: remove
    // Load the questions from the local JSON file
    loadJSONFile("vortoj.json", function (data) {
        if (data) {
            vortoj = JSON.parse(data);
            // displayQuestion();
        } else {
            // If no data is found, show a message to the user to add questions manually
            questionElem.textContent = "Please add questions manually in the JSON format.";
        }
    });
}

// This function changes the interface to ask the user to choose which language to learn
function d_or_s() {
    console.log("d_or_s (line 74)") // TODO: remove
    Interface = "d_or_s"
    input.style.display = "none"
    Deutsch.style.display = "inline"
    slovensky.style.display = "inline"
    word.style.display = "block"
    word.textContent = message_5[langue]

    Deutsch.addEventListener("click", () => {
        Deutsch.style.display = "none"
        slovensky.style.display = "none"
        lan = 'Deutsch'
        askForList()
    });

    slovensky.addEventListener("click", () => {
        Deutsch.style.display = "none"
        slovensky.style.display = "none"
        lan = 'slovensky'
        askForList()
    });

    end_buttons.style.display = "none"
    progressBar.style.display = "none"
    tableContainer.style.display = "none" // Hide the table of logs
}


// This function changes the interface to ask the user for a list number
function askForList() {
    console.log("askForList (line 134)") // TODO: remove
    Interface = "askForList"
    word.style.display = "block"
    word.textContent = message_6[langue]
    input.style.display = "block"
    input.addEventListener("keydown", listHandler);

    showLogs() // Show a list of logs
}


// This function checks if the input is a valid number and then
// calls setList() to define the list and quiz() to start the quiz
function listHandler(e) {
    console.log("listHandler (line 145)") // TODO: remove
    if (e.key === "Enter") {
        numlist = vortoj[0][lan]["lists"].length
        console.log(`the length of the 'lists' object is ${numlist}`)
        while (true) { // while the input is not an existing list number
            listNumber = parseInt(input.value); // the number entered is treated as the number of the desired list
            if (listNumber <= numlist && listNumber > 0) {
                break; // exit loop if valid input
            }
            feedback.style.color = "red";
            feedback.textContent = message_8[langue];
            input.value = "";
            return;
        }
        input.value = "" // clear text in text box
        feedback.textContent = ""; // clear feedback
        input.removeEventListener("keydown", listHandler);
        setList(listNumber);
        // word.textContent = "enter"
        quiz();
    }
}


function shuffleArray(array) {
    console.log("shuffleArray (line 171)") // TODO: remove
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// this function defines the list and score_max
function setList(num) {
    console.log("setList (line 179)") // TODO: remove
    let originalList = vortoj[0][lan]["lists"][num-1];
    word_list = JSON.parse(JSON.stringify(originalList)); // Deep copy the list
    shuffleArray(word_list)
    score_max = word_list.length
    for (let i = 0; i < score_max; i++) {
        word_list[i] = [word_list[i][0], word_list[i][1], false]
    }
}

// This function changes the interface to start the quiz
function quiz() {
    console.log("Quiz time (line 192)") // TODO: remove
    Interface = "quiz"
    word.style.display = "block"
    input.style.display = "block"
    progressBar.style.display = "block" // show the progress bar
    updateProgressBar()
    word.textContent = word_list[current_word_index][0]
    input.addEventListener("keydown", enterHandler)
    tableContainer.style.display = "none" // Hide the table of logs
}

function enterHandler(e) {
    console.log("enterHandler (line 201)") // TODO: remove
    if (e.key === "Enter") {
        checkAnswer()
    }
}

function checkAnswer() {
    console.log("checkAnswer (line 208)") // TODO: remove
    const inp = input.value
    const answer = word_list[current_word_index][1]
    const shown = word_list[current_word_index][2]
    input.value = "" // clear text in text box
    if (inp === answer) { // User input is correct
        if (!shown) { // if the word has not been shown yet
            score++
        }
        current_word_index++
        if (canProgress) {
            prog++;
            updateProgressBar();
        } else {
            canProgress = true; // next word correct will count as progress
        }
        if (current_word_index >= word_list.length) { // end of list
            showResult()
        } else { // next word
            word.textContent = word_list[current_word_index][0]
            feedback.textContent = "correct!"
            feedback.style.color = "green"
            setTimeout(function () {
                feedback.textContent = "";
            }, 1000 ); // appears for one second
        }
    } else if (inp === "?") {
        input.disabled = true; // disable text box
        setTimeout(function () {
            input.disabled = false;
        }, 4000); // re-enable it after 4 seconds
        word_list[current_word_index][2] = true // answer has been shown
        word_list.splice(current_word_index + rep, 0, word_list[current_word_index]) // add word later in list
        console.log(word_list) // show word list in console for debugging
        feedback.textContent = word_list[current_word_index][1] // show answer
        feedback.style.color = "blue" // in blue
        canProgress = false; // will not count progress when word is correct, because it will reappear later
        setTimeout(function () {
            feedback.textContent = "";
        }, 4000 ); // appears for four seconds
    } else {
        // User input is incorrect
        const split_1 = inp.split(' ')
        const split_2 = answer.split(' ')
        feedback.style.color = "red"
        setTimeout(function () {
            feedback.textContent = "";
        }, 1000 ); // appears for one second
        if ((split_1.length === split_2.length) &&
            (determinants.includes(split_1[0])) &&
            (determinants.includes(split_2[0])) &&
            (split_1[0] !== split_2[0])) {
            feedback.textContent = message_13[langue]  // determinant!
        }
        else if (inp.split(' ').join('') === answer.split(' ').join('')) { //everything is correct except spaces
            feedback.textContent = message_1[langue]  // espaces!
        }
        else if (inp.toLowerCase() === answer.toLowerCase()) { //everything is correct except the case (capital letters)
            feedback.textContent = message_2[langue]  // majuscules!
        }
        else if (inp.split(' ').join('').toLowerCase() === answer.split(' ').join('').toLowerCase()) {
            feedback.textContent = message_3[langue]  // espaces & majuscules!
        }
        else {
            feedback.textContent = message_4[langue]  // encore!
        }
    }
}

function updateProgressBar() {
    // Convert the progress from a scale of 0-20 to 0-100%
    let percentage = (prog / score_max) * 100;
    progress.style.width = percentage + "%";
}

function showResult() {

    saveLog(listNumber, score, score_max); // record activity in local storage

    Interface = "end"
    word.style.display = "none"
    input.removeEventListener("keydown", enterHandler)
    input.style.display = "none"
    result.style.display = "block"
    result.textContent = `Score: ${score}/${score_max}`
    end_buttons.style.display = "block"

    again.textContent = message_9[langue] // show again button
    again.addEventListener("click", startAgain)

    change_list.textContent = message_10[langue] // show change list button
    change_list.addEventListener("click", changeList)

    change_lan.textContent = message_11[langue] // show change language button
    change_lan.addEventListener("click", changeLan)

    progressBar.style.display = "none" // hide the progress bar
    prog = 0; // restart the progress from 0

    showLogs() // Show previously completed lists

    current_word_index = 0
    score = 0
    word_list = []
}

function startAgain() {
    console.log("Starting again (line 304)") // TODO: remove
    collapseMenu()
    setList(listNumber)
    quiz()
}

function changeList() {
    console.log("changeList (line 311)") // TODO: remove
    collapseMenu()
    askForList()
}

function changeLan() {
    console.log("changeLan (line 317)") // TODO: remove
    collapseMenu()
    d_or_s()
}

function collapseMenu() {
    console.log("collapseMenu (line 323)") // TODO: remove
    result.style.display = "none"
    end_buttons.style.display = "none"
    tableContainer.style.display = "none"
}

document.getElementById('languageSwitch').addEventListener('click', () => {
    console.log("getElementById (line 335)") // TODO: remove
    langue = langue === 0 ? 1 : 0;
    updateLanguage();
});

function updateLanguage() { // TODO: FR first so that it's displayed properly
    console.log("updateLanguage (line 341)") // TODO: remove
    languageSwitch.classList.toggle('fr', langue === 0);
    languageSwitch.classList.toggle('en', langue === 1);
    if (Interface === "d_or_s") {
        word.textContent = message_5[langue]
    } else if (Interface === "askForList") {
        word.textContent = message_6[langue]
    } else if (Interface === "end") {
        again.textContent = message_9[langue]
        change_list.textContent = message_10[langue]
        change_lan.textContent = message_11[langue]
    }
}

function saveLog(listNumber, score, scoreMax) {
    // Create a new log entry
    const newLog = { date: new Date(), listNumber: listNumber, score: score , scoreMax: scoreMax};

    // Retrieve the existing logs (if any)
    const existingLogs = JSON.parse(localStorage.getItem(lan)) || [];

    existingLogs.push(newLog); // Add the new log to the array

    localStorage.setItem(lan, JSON.stringify(existingLogs)); // Save the updated array back to Local Storage
}

function showLogs() {
    // Retrieve and return the logs
    const logs = JSON.parse(localStorage.getItem(lan)) || [];
    tableContainer.style.display = logs.length ? 'block' : 'none'; // Hide the table if there are no logs
    tableBody.innerHTML = ''; // Clear existing entries

    logs.reverse().forEach(log => {
        const row = tableBody.insertRow();
        const dateCell = row.insertCell(0);
        const listCell = row.insertCell(1);
        const scoreCell = row.insertCell(2);

        dateCell.textContent = new Date(log.date).toLocaleString();
        listCell.textContent = log.listNumber;
        scoreCell.textContent = log.score + '/' + log.scoreMax;
    });
}

// Initialise the quiz:
fetchQuestions()
d_or_s()
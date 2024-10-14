const readline = require('readline');

// Define the questions and answers for the quiz
const questions = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "Who wrote 'Hamlet'?", answer: "Shakespeare" },
    { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
    { question: "What is the boiling point of water in degrees Celsius?", answer: "100" },
];

// Quiz configuration
const totalQuizTime = 30; // Total time for the quiz in seconds
const timePerQuestion = 30; // Time allowed per question in seconds
let currentQuestionIndex = 0; // Track the current question index
let score = 0; // Track the user's correct answers
let failed = 0; // Track the user's incorrect or unattempted answers
let remainingQuizTime = totalQuizTime; // Track total remaining time
let questionTimer; // Timer for each question

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to display the remaining total time for the quiz
function showRemainingQuizTime() {
    remainingQuizTime--;
    console.clear(); // Clear the console to simulate dynamic countdown
    console.log(`Total quiz time left: ${remainingQuizTime}s`);

    if (remainingQuizTime <= 0) {
        endQuiz(); // End the quiz when the total time runs out
    }
}

// Function to move to the next question or end quiz
function nextQuestion() {
    if (currentQuestionIndex < questions.length && remainingQuizTime > 0) {
        askQuestion();
    } else {
        endQuiz();
    }
}

// Function to ask a question with a timer
function askQuestion() {
    if (remainingQuizTime <= 0) {
        endQuiz();
        return;
    }

    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];
    let questionTime = timePerQuestion; // Initialize question time
    console.clear(); // Clear the console for fresh display
    console.log(`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`);
    console.log(`Time left for this question: ${questionTime}s`);

    // Start the question timer (30 seconds per question)
    questionTimer = setInterval(() => {
        questionTime--;
        console.clear(); // Clear the console to simulate dynamic countdown
        console.log(`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`);
        console.log(`Time left for this question: ${questionTime}s`);
        
        // If time for the question runs out, mark it as failed and move to the next question
        if (questionTime <= 0) {
            clearInterval(questionTimer);
            console.log("Time's up for this question!\n");
            failed++; // Increment failed count if time runs out
            currentQuestionIndex++;
            nextQuestion();
        }
    }, 1000);

    // Prompt user asynchronously
    rl.question("Your answer: ", (userAnswer) => {
        clearInterval(questionTimer); // Stop the timer when the user answers

        // Check if the answer is correct
        if (userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
            score++;
            console.log("Correct!\n");
        } else {
            failed++;
            console.log(`Wrong! The correct answer was: ${currentQuestion.answer}\n`);
        }

        // Move to the next question
        currentQuestionIndex++;
        nextQuestion();
    });
}

// Function to end the quiz and display the final score
function endQuiz() {
    clearInterval(mainTimer); // Clear the main quiz timer
    rl.close(); // Close the readline interface
    console.log(`\nQuiz finished! Your final score is: ${score}/${questions.length}`);
    console.log(`Correct answers: ${score}`);
    console.log(`Failed answers: ${failed}`);

    // Check if the user passed or failed
    const passingScore = Math.ceil(questions.length / 2);
    if (score >= passingScore) {
        console.log("Congratulations! You passed the quiz.");
    } else {
        console.log("You failed the quiz. Better luck next time!");
    }
}

// Main timer for the total quiz duration (30 seconds for the entire quiz)
const mainTimer = setInterval(showRemainingQuizTime, 1000);

// Start the quiz
console.log("Welcome to the quiz! You have a total of 30 seconds to answer all questions.");
nextQuestion();

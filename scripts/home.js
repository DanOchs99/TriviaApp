let numberOfQuestions = document.getElementById("numberOfQuestions")
let categoryMenu = document.getElementById("categoryMenu")
let difficultyLevel = document.getElementById("difficulty")
let questionType = document.getElementById("questionType")
let goButton = document.getElementById("getem")
let sessionToken = ""
let modeButtons = document.getElementsByName("game-mode");

goButton.addEventListener("click", () => {
    let amount = ""
    if(numberOfQuestions.value != "") {
        amount = `amount=${numberOfQuestions.value}`
    }
    let category = ""
    if(categoryMenu.value != "") {
        category = `&category=${categoryMenu.value}`
    }
    let difficulty = ""
    if(difficultyLevel.value != "") {
        difficulty = `&difficulty=${difficultyLevel.value}`
    }
    let type = ""
    if(questionType.value != "") {
        type = `&type=${questionType.value}`
    }
    let token = ""
    if(sessionToken != "") {
        token = `&token=${sessionToken}`
    }
    let triviaURL = `https://opentdb.com/api.php?${amount}${category}${difficulty}${type}${token}`
    getTrivia(triviaURL)
})

async function getTrivia(url) {
    let rawResponse = await fetch(url)
    let response = await rawResponse.json()
    
    let gamemode = '';
    if(response.response_code == 0) {
        for(let i = 0; i < modeButtons.length; i++) {
            if (modeButtons[0].checked) {
                gamemode = 'S';
            }
            else if (modeButtons[1].checked) {
                gamemode = 'M';
            }
            else if (modeButtons[2].checked) {
                gamemode = 'B';
            }
        }
        start(response, gamemode)
    } else if(response.response_code == 1) {
        alert("Too many questions requested, ask for less.")
    } else if(response.response_code == 2) {
        alert("Invalid Parameter, try again.")
    } else if(response.response_code == 3) {
        alert("Token not found. Getting token.")
        getToken()
    } else if(response.response_code == 4) {
        alert("Too many questions requested, ask for less. Reseting session token.")
        resetToken()
    } else {
        alert("Something spooky happened.")
    }
}

async function getToken() {
    let tokenURL = "https://opentdb.com/api_token.php?command=request"
    let rawSessionToken = await fetch(tokenURL)
    let sessionTokenJSON = await rawSessionToken.json()
    sessionToken = sessionTokenJSON.token
}

async function resetToken() {
    let resetURL = `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
    await fetch(resetURL)
}

async function getCategories() {
    let catURL = "https://opentdb.com/api_category.php"
    let rawResponse = await fetch(catURL)
    let response = await rawResponse.json()
    displayCats(response)
}

function displayCats(categories) {
    let triviaCategories = []
    triviaCategories.push(`<option value="">Select Category</option>`)
    categories.trivia_categories.forEach((cat) => {
        triviaCategories.push(`<option value="${cat.id}">${cat.name}</option>`)
    })
    categoryMenu.innerHTML = triviaCategories.join(" ")
}

getCategories()

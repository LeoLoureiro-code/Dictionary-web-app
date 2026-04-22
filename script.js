const THEMES = {
    THEME1: "theme1",
    THEME2: "theme2",
}

const TYPOGRAPHY = {
    SERIF: "serif",
    SANSSERIF: "sans-serif",
    MONO: "mono",
}

const wordInformation = {
    word: "",
    phonetics: "",
    audio: "",
    source: "",
    meanings: [
        {
            partOfSpeech: "",
            definitions: [
                {
                    definition: "",
                    example: ""
                }
            ]
        }
    ]
};

const State = {
    theme: THEMES.THEME1,
    typography: TYPOGRAPHY.SERIF,
    word: "",
    loading: false,
    error: false,
    wordInformation: {},
}

const body = document.querySelector('body');
const slider = document.querySelector('#slider');
const typoParagraph = document.querySelector('.options_paragraph');
const audio = document.querySelector("#audio");
const playBtn = document.querySelector('.cover');
const form = document.querySelector('form');
const input = document.querySelector("#form_input");

//Helper functions

function GetWordInformation(data){
    const [entry] = data;

     const {
        word,
        phonetic,
        phonetics,
        sourceUrls
    } = entry;

    const audioObject = phonetics.find(item => item.audio !== "");

    const wordInformation = {
        word: word,
        phonetics: phonetic,
        audio: audioObject ? audioObject.audio : "",
        source: sourceUrls[0] || ""
    };

        const meanings = entry.meanings.map(meaning => {
        const { partOfSpeech, definitions } = meaning;

        const formattedDefinitions = definitions.map(definition => {
            const { definition: def, example } = definition;
            return {
                definition: def,
                example: example || ""
            };
        });

        return {
            partOfSpeech,
            definitions: formattedDefinitions
        };
    });

    wordInformation.meanings = meanings;    

    return wordInformation;
}


async function fetchWord(word) {
    if (word !== "") {
        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            );

            const data = await response.json();
            const wordInformation = GetWordInformation(data);
            State.wordInformation = wordInformation;
            console.log(State.wordInformation);

        } catch (error) {
            console.error("Error:", error);
        }
    }

}



//Render functions

function RenderTheme() {
    State.theme = `theme${slider.value}`
    body.classList = 'none';
    body.className = State.theme;
    body.classList.add(State.theme);
}

function RenderTypography() {
    body.classList.add(State.typography);
}

function RenderWordInformation() {
    const { word, phonetics, audio, source, meanings } = State.wordInformation;

}

function Render() {
    RenderTheme();
    RenderTypography(); 
    if(State.wordInformation.word){
        RenderWordInformation();
    }
}


//Event listeners 

slider.addEventListener("input", function () {
    Render();
});

playBtn.addEventListener("click", () => {
    console.log(audio);
    audio.paused ? audio.play() : audio.pause();
});

document.querySelectorAll('.typo_option_name').forEach(option => {
    option.addEventListener("click", function () {
        State.typography = this.dataset.font;
        typoParagraph.textContent = this.dataset.font;
        Render();
    })
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const word = input.value.trim();

    if (!word) return;

    await fetchWord(word);
});
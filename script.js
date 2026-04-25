const THEMES = {
    THEME1: "theme1",
    THEME2: "theme2",
}

const TYPOGRAPHY = {
    SERIF: "serif",
    SANSSERIF: "sans-serif",
    MONO: "mono",
}

const WORDINFORMATION = {
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
        State.loading = true;
        State.error = false;
        Render();
        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            );

            const data = await response.json();
            const wordInformation = GetWordInformation(data);
            State.wordInformation = wordInformation;
            console.log(State.wordInformation);

        } catch (error) {
            State.error = true;
            console.log(error);
        }
        State.loading = false
        Render();
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
    const { word, phonetics, audio, source } = State.wordInformation;

    const informationSection = document.querySelector('.word_information_section');

    const informationDiv = document.createElement('div');
    informationDiv.className = "word_information_div";

    const wordName = document.createElement('h1');
    wordName.className = "word";
    wordName.textContent = word;

    const pronunciationParagraph = document.createElement('p');
    pronunciationParagraph.className = 'pronunciation_paragraph';
    pronunciationParagraph.textContent = phonetics;

    informationDiv.appendChild(wordName);
    informationDiv.appendChild(pronunciationParagraph);

    const audioCard = document.createElement('div');

    const audioImage = document.createElement('img');
    audioImage.src = "assets/images/icon-play.svg";
    audioImage.className = "cover";

    const audioElement = document.createElement('audio');
    audioElement.src = audio;
    audioElement.load();

    audioCard.appendChild(audioImage);
    audioCard.appendChild(audioElement);

    informationSection.appendChild(informationDiv);
    informationSection.appendChild(audioCard);
    


    //Add audio card


    // document.querySelector('.word').textContent = word;
    // document.querySelector('.pronunciation_paragraph').textContent = phonetics;

    
    
    

    const sourceText = document.querySelector('.source_text');
    sourceText.textContent = source;

    const sourceLink = document.querySelector('.source_anchor');
    sourceLink.href = source;

    const meaningsContainer = document.querySelector('.meanings_container');
    meaningsContainer.innerHTML = '';
    State.wordInformation.meanings.forEach(meaning => {

        const meaningDiv = document.createElement('div');
        meaningDiv.className = 'meaning';

        const partOfSpeech = document.createElement('h2');
        partOfSpeech.textContent = meaning.partOfSpeech;
        meaningDiv.appendChild(partOfSpeech);

        meaning.definitions.forEach(definition => {
            const definitionDiv = document.createElement('div');
            definitionDiv.className = 'definition';

            const definitionText = document.createElement('p');
            definitionText.textContent = definition.definition;
            definitionDiv.appendChild(definitionText);
            
            if (definition.example) {
                const exampleText = document.createElement('p');
                exampleText.className = 'example';
                exampleText.textContent = `Example: ${definition.example}`;
                definitionDiv.appendChild(exampleText);
            }
            meaningDiv.appendChild(definitionDiv);
        });
        meaningsContainer.appendChild(meaningDiv);
    });
}

function RenderError(){

}

function RenderLoading(){

}

function Render() {
    RenderTheme();
    RenderTypography();
    if(State.loading){
        RenderLoading();
        return;
    } 
    if(State.error){
        RenderError();
        return;
    }
    if (State.wordInformation && State.wordInformation.word){
        RenderWordInformation();
    }
}


//Event listeners 

slider.addEventListener("input", function () {
    Render();
});

// playBtn.addEventListener("click", () => {
//     console.log(audio);
//     audio.paused ? audio.play() : audio.pause();
// });

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
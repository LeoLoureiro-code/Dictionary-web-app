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
    const footer = document.querySelector('footer');

    informationSection.innerHTML = "";
    footer.innerHTML = "";

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

    audioImage.addEventListener("click", () => {
        audioElement.play();
    });

    audioCard.appendChild(audioImage);
    audioCard.appendChild(audioElement);

    informationSection.appendChild(informationDiv);
    informationSection.appendChild(audioCard); 

    const sourceParagraph = document.createElement('p');
    sourceParagraph.className = "source_paragraph";

    const sourceSpan = document.createElement('span');
    sourceSpan.className = "source_text";
    sourceSpan.textContent = source;
    sourceSpan.href = source;

    const sourceAnchor = document.createElement('a');
    sourceAnchor.className = "source_anchor";
    sourceAnchor.href = source;

    const sourceAnchorImg = document.createElement('img');
    sourceAnchorImg.className = "source_window_img";
    sourceAnchorImg.alt = "new wondow icon";
    sourceAnchorImg.src = "assets/images/icon-new-window.svg";

    sourceAnchor.appendChild(sourceAnchorImg);


    sourceParagraph.appendChild(sourceSpan);
    sourceParagraph.appendChild(sourceAnchor);
    footer.appendChild(sourceParagraph);

    const meaningsContainer = document.querySelector('.meanings_container');
    meaningsContainer.innerHTML = '';
    State.wordInformation.meanings.forEach(meaning => {

        const meaningUl = document.createElement('ul');
        meaningUl.className = 'part_of_speech_meaning_list';

        const partOfSpeech = document.createElement('h2');
        partOfSpeech.textContent = meaning.partOfSpeech;
        partOfSpeech.className = 'part_of_speech';

        const horizontalLine = document.createElement('hr');
        horizontalLine.classList = "horizontal_line";

        meaningUl.appendChild(partOfSpeech);
        meaningUl.appendChild(horizontalLine);


        //needs synonyms and antonyms

        meaning.definitions.forEach(definition => {
            const definitionLi = document.createElement('li');
            definitionLi.className = 'part_of_speech_meaning_item';

            const definitionText = document.createElement('p');
            definitionText.textContent = definition.definition;
            definitionText.classList = "part_of_speech_meaning_paragraph";
            definitionLi.appendChild(definitionText);
            
            if (definition.example) {
                const exampleText = document.createElement('p');
                exampleText.className = 'example';
                exampleText.textContent = `Example: ${definition.example}`;
                definitionLi.appendChild(exampleText);
            }

            if(definition.synonyms && definition.synonyms > 0){
                const synonymsParagraph = document.createElement('p');
                synonymsParagraph.className = "synonyms_paragraph";
                synonymsParagraph.textContent = "Synonyms:";

                synonyms.forEach(synonym =>{
                    const synonymSpan = document.createElement('span');
                    synonymSpan.textContent = synonym;
                    synonymsParagraph.appendChild(synonymSpan);
                })
            }

            if(definition.antonyms && definition.antonyms.length > 0){
                const antonymsParagraph = document.createElement('p');
                antonymsParagraph.className = "antonyms_paragraph";
                antonymsParagraph.textContent = "Antonyms:";

                antonyms.forEach(antonym =>{
                    const antonymSpan = document.createElement('span');
                    antonymSpan.textContent = antonym;
                    antonymsParagraph.appendChild(antonymSpan);
                })
            }
            meaningUl.appendChild(definitionLi);
        });
        meaningsContainer.appendChild(meaningUl);
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
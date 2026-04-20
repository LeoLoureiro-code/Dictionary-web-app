const THEMES = {
    THEME1: "theme1",
    THEME2: "theme2",
}

const TYPOGRAPHY = {
    SERIF: "serif",
    SANSSERIF: "sans-serif",
    MONO: "mono",
}

const State = {
    theme: THEMES.THEME1,
    typography: TYPOGRAPHY.SERIF,
    word: "",
    loading: false,
    data: {},
}

const body = document.querySelector('body');
const slider = document.querySelector('#slider');
const typoParagraph = document.querySelector('.options_paragraph');
const audio = document.querySelector("#audio");
const playBtn = document.querySelector('#playBtn');
const form = document.querySelector('form');
const input = document.querySelector("#form_input");

//Helper functions


async function fetchWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}



//Render functions

function RenderTheme(){
    State.theme = `theme${slider.value}`
    body.classList = 'none';
    body.className =  State.theme;
    body.classList.add(State.theme);
}

function RenderTypography(){
    body.classList.add(State.typography);
}

function Render(){
    RenderTheme();
    RenderTypography();
}


//Event listeners 

slider.addEventListener("input", function() {
    Render();
});

// playBtn.addEventListener("click", () => {
//   audio.paused ? audio.play() : audio.pause();
// });

document.querySelectorAll('.typo_option_name').forEach(option =>{
    option.addEventListener("click", function(){
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
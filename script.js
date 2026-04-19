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
}

const body = document.querySelector('body');
const slider = document.querySelector('#slider');
const typoParagraph = document.querySelector('.options_paragraph');



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

slider.addEventListener("input", function() {
    Render();
});

document.querySelectorAll('.typo_option_name').forEach(option =>{
    option.addEventListener("click", function(){
        State.typography = this.dataset.font;
        typoParagraph.textContent = this.dataset.font;
        Render();
    })
})
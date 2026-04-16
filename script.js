const THEMES = {
    THEME1: "theme1",
    THEME2: "theme2",
}

const State = {
    theme: THEMES.THEME1,
}

const body = document.querySelector('body');
const slider = document.querySelector('#slider');


function RenderTheme(){
     State.theme = `theme${slider.value}`
    body.classList = 'none';
    body.className =  State.theme;
}

function Render(){
    RenderTheme();
}


slider.addEventListener("input", function() {
    Render();
})
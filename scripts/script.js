/*---------------------------------*/
/*        COMMON FUNCTIONS         */
/*---------------------------------*/
const sel = s => document.querySelector(s);
const selAll = s => document.querySelectorAll(s);
const create = e => document.createElement(e);
const globalEventListener = (type, selector, callback) => {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e);
    });
}



/*---------------------------------*/
/*            FUNCTIONS            */
/*---------------------------------*/

const buildTable = () => {
    const table = sel('.table');

    table.classList.remove('begginer', 'easy', 'medium', 'advanced', 'custom');
    table.classList.add(game.level);
    table.innerHTML = '';

    if (game.level === 'custom') {
        table.style.gridTemplateRows = `repeat(${levels.custom.rows}, 1fr)`
        table.style.gridTemplateColumns = `repeat(${levels.custom.columns}, 1fr)`
    }
    else {
        table.style.gridTemplateRows = null;
        table.style.gridTemplateColumns = null;

    }

    const level = levels[game.level];

    for (let i = 1; i <= level.rows; i++) {
        for (let j = 1; j <= level.columns; j++) {
            let cell = create('input');
            cell.maxLength = 1;
            cell.dataset.x = j;
            cell.dataset.y = i;
            table.appendChild(cell);
        }
    }
}

const slideDown = () => {
    window.scrollBy({
        top: window.innerHeight,
        behavior: "smooth"
    });
}

const slideUp = () => {
    window.scrollBy({
        top: -window.innerHeight,
        behavior: "smooth"
    });
}

const arrowWalk = (e) => {
    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    let cell = null

    if (e.key === 'ArrowUp') {
        cell = sel(`.table input[data-x="${x}"][data-y="${+y - 1}"]`);

        if (!cell)
            cell = sel(`.table input[data-x="${x}"][data-y="${levels[game.level].rows}"]`);
    }


    if (e.key === 'ArrowDown') {
        cell = sel(`.table input[data-x="${x}"][data-y="${+y + 1}"]`);
        if (!cell)
            cell = sel(`.table input[data-x="${x}"][data-y="1"]`);
    }

    if (e.key === 'ArrowLeft') {
        cell = sel(`.table input[data-x="${+x - 1}"][data-y="${y}"]`);
        if (!cell)
            cell = sel(`.table input[data-x="${levels[game.level].columns}"][data-y="${y}"]`);
    }

    if (e.key === 'ArrowRight') {
        cell = sel(`.table input[data-x="${+x + 1}"][data-y="${y}"]`);
        if (!cell)
            cell = sel(`.table input[data-x="1"][data-y="${y}"]`);
    }

    if (cell) { cell.focus(); }
}

const addWord = word => {
    if (game.words.includes(word)) {
        showErrorModal('Essa palavra já foi adicionada.');
        return;
    }

    const deleteBtn = create('button');
    deleteBtn.classList.add('deleteWord');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    const li = create('li');
    li.textContent = word;
    li.appendChild(deleteBtn);

    sel('.wordsList').appendChild(li);
}

const validateWord = word => {
    gameModes[game.type].validate(word);
}


/*-----------------------------------*/
/*          EVENT LISTENERS          */
/*-----------------------------------*/
globalEventListener('click', '.back', slideUp);
globalEventListener('click', '.next', slideDown);
globalEventListener('keydown', '.table input', arrowWalk);


globalEventListener('click', '.type .btn-group button', e => {
    sel('.type .btn-group .active').classList.remove('active');
    e.target.classList.add('active');
});

globalEventListener('click', '.level .buttons button', e => {
    sel('.level .buttons .active').classList.remove('active');
    e.target.classList.add('active');
});

sel('.type .next').addEventListener('click', e => {
    game.type = sel('.type .btn-group .active').value;
});

sel('.level .next').addEventListener('click', e => {
    let activeBtn = sel('.level .buttons .active')
    game.level = activeBtn.value;

    if (game.level === 'custom') {
        levels.custom.rows = activeBtn.querySelector('#rows').value;
        levels.custom.columns = activeBtn.querySelector('#columns').value;

        if (!(levels.custom.rows > 2 && levels.custom.columns > 2)) {
            showErrorModal('Use valores válidos para Colunas e Linhas.')
            return;
        }
    }

    buildTable();
});

sel('form.addWords input').addEventListener('change', e => {
    if (e.target.value.length >= 2)
        sel('form.addWords button').disabled = false;
    else
        sel('form.addWords button').disabled = true;
});

sel('form.addWords').addEventListener('submit', e => {
    e.preventDefault();

    const word = sel('form.addWords input').value.toUpperCase();
    sel('form.addWords input').value = '';

    addWord(word);
    sel('form.addWords button').disabled = true;

})

globalEventListener('click', '.listing ul li button.deleteWord i', e => {
    e.target.closest('li').remove();
});

globalEventListener('click', '.listing ul li button.deleteWord', e => {
    e.target.closest('li').remove();
});



/*--------------------------------*/
/*           VARIABLES            */
/*--------------------------------*/

let game = {
    type: '',
    level: '',
    words: [],
    letters: []
}

const levels = {
    beginner: { rows: 8, columns: 5 },
    easy: { rows: 11, columns: 7 },
    medium: { rows: 15, columns: 9 },
    advanced: { rows: 16, columns: 10 },
    custom: { rows: 0, columns: 0 }
};

const gameModes = {
    normal: {
        name: 'Normal',
        description: 'O modo clássico de caça palavras, onde o jogador tem que encontrar as palavras listadas.'
    },

    related: {
        name: 'Relacionadas',
        description: 'Nesse modo, o jogador deve buscar por palavras relacionadas às listadas. Por exemplo, se for uma relação de "antônimo", tendo listada a palavra "claro", o jogador deve procurar por "escuro".'
    },

    text: {
        name: 'Texto',
        description: 'Nesse modo as palavras a serem encontradas estão destacadas em negrito em um texto.'
    },

    normalTranslation: {
        name: 'Tradução (normal)',
        description: 'Nesse modo, o jogador deve encontrar as palavras listadas normalmente. A diferença é que este modo permite ao jogador clicar numa palavra da lista para ver sua tradução, sua pronúncia e uma imagem.'
    },

    relatedTranslation: {
        name: 'Tradução (relacionadas)',
        description: 'Nesse modo, o jogador deve buscar pela tradução das palavras listadas. Além disso, este modo permite o jogador clicar numa palavra da lista para ver sua tradução, sua pronúncia e uma imagem.'
    }
}



/*---------------------------------*/
/*              MAIN               */
/*---------------------------------*/
(() => {})();
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

const showError = (msg) => {
    sel('form.addWords').style.borderColor = 'red';

    const error = sel('.error');
    error.classList.add('visible');
    error.textContent = msg;
}

const hideError = () => {
    sel('form.addWords').style.borderColor = '#ccc';
    sel('.error').classList.remove('visible');
}

const wordToLiNormal = word => {
    const deleteBtn = create('button');
    deleteBtn.classList.add('deleteWord');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    const li = create('li');
    li.textContent = word;
    li.appendChild(deleteBtn);

    sel('.wordsList').appendChild(li);
}

const wordToLiRelated = (word, relatedWord) => {

    const deleteBtn = create('button');
    deleteBtn.classList.add('deleteWord');
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    const li = create('li');
    li.innerHTML = `<div class="wordContainer">
                        <span class="word">${word}</span>
                        <span class="relatedWord">${relatedWord}</span>
                    </div>`;
    li.appendChild(deleteBtn);

    sel('.wordsList').appendChild(li);
}

const addWordNormal = () => {
    const word = sel('form.addWords input').value.toUpperCase();

    if (!word) return;

    if (game.words.includes(word)) {
        showError('Palavra já adicionada.');
        return;
    }

    if (sel('.listing p.error').classList.contains('visible'))
        hideError();

    game.words.push(word);

    sel('form.addWords input').value = '';

    wordToLiNormal(word);
    sel('form.addWords button').disabled = true;
};

const addWordRelated = () => {
    const word = sel('form.addWords input').value.toUpperCase();
    const relatedWord = sel('form.addWords #relatedWord').value.toUpperCase();

    if (!word || !relatedWord) return;
    if (game.words.find(w => w.word === word)) {
        showError('Palavra já adicionada.');
        return;
    }
    if (game.words.find(w => w.relatedWord === relatedWord)) {
        showError('Palavra relacionada já adicionada.');
        return;
    }

    if (sel('.listing p.error').classList.contains('visible'))
        hideError();

    game.words.push({ word, relatedWord });
    sel('form.addWords input').value = '';
    sel('form.addWords #relatedWord').value = '';

    wordToLiRelated(word, relatedWord);
    sel('form.addWords button').disabled = true;
};

const addWordText = () => {
    const word = sel('form.addWords input').value.toUpperCase();
    const text = sel('form.addWords textarea').value;

    if (!word) return;
    if (!text) {
        showError('Por favor, adicione um texto.');
        return;
    }

    if (game.words.includes(word)) {
        showError('Palavra já adicionada.');
        return;
    }

    if(!text.split(' ').map(w => w.toLowerCase()'').includes(word.toLowerCase())) {
        showError('Palavra não encontrada no texto.');
        return;
    }

    if (sel('.listing p.error').classList.contains('visible'))
        hideError();

    game.words.push(word);

    sel('form.addWords input').value = '';

    wordToLiNormal(word);
    sel('form.addWords button').disabled = true;
};


/*--------------------------------*/
/*           VARIABLES            */
/*--------------------------------*/

let game = {
    level: {},
    words: [],
    letters: [],
    gameMode: null
}

const levels = {
    beginner:   { name: 'beginner', rows: 8,    columns: 5  },
    easy:       { name: 'easy',     rows: 11,   columns: 7  },
    medium:     { name: 'medium',   rows: 15,   columns: 9  },
    advanced:   { name: 'advanced', rows: 16,   columns: 10 },
    custom:     { name: 'custom',   rows: 0,    columns: 0  }
};

const gameModes = {
    normal: {
        className: 'normal',
        name: 'Normal',
        description: 'O modo clássico de caça palavras, onde o jogador tem que encontrar as palavras listadas.',
        addWord: addWordNormal,
        formHTML: `<input type="text" placeholder="Add a word">
                   <button type="submit" disabled>Add</button>`
    },

    related: {
        className: 'related',
        name: 'Relacionadas',
        description: 'Nesse modo, o jogador deve buscar por palavras relacionadas às listadas. Por exemplo, se for uma relação de "antônimo", tendo listada a palavra "claro", o jogador deve procurar por "escuro".',
        addWord: addWordRelated,
        formHTML: `<input type="text" placeholder="Word" id="word">
                   <input type="text" placeholder="Related word" id="relatedWord">
                   <button type="submit" disabled>Add</button>`
    },

    text: {
        className: 'text',
        name: 'Texto',
        description: 'Nesse modo as palavras a serem encontradas estão destacadas em negrito em um texto.',
        addWord: addWordText,
        formHTML: `<textarea placeholder="Add a text"></textarea>
                   <input type="text" placeholder="Add a word">
                   <button type="submit" disabled>Add</button>`
    },

    normalTranslation: {
        className: 'normalTranslation',
        name: 'Tradução (normal)',
        description: 'Nesse modo, o jogador deve encontrar as palavras listadas normalmente. A diferença é que este modo permite ao jogador clicar numa palavra da lista para ver sua tradução, sua pronúncia e uma imagem.'
    },

    relatedTranslation: {
        className: 'relatedTranslation',
        name: 'Tradução (relacionadas)',
        description: 'Nesse modo, o jogador deve buscar pela tradução das palavras listadas. Além disso, este modo permite o jogador clicar numa palavra da lista para ver sua tradução, sua pronúncia e uma imagem que a represente.'
    }
}



/*---------------------------------*/
/*            FUNCTIONS            */
/*---------------------------------*/

const buildTable = () => {
    const table = sel('.table');

    table.classList.remove('begginer', 'easy', 'medium', 'advanced', 'custom');
    table.classList.add(game.level.name);
    table.innerHTML = '';

    if (game.level.name === 'custom') {
        table.style.gridTemplateRows = `repeat(${levels.custom.rows}, 1fr)`
        table.style.gridTemplateColumns = `repeat(${levels.custom.columns}, 1fr)`
    }
    else {
        table.style.gridTemplateRows = null;
        table.style.gridTemplateColumns = null;
    }

    for (let i = 1; i <= game.level.rows; i++) {
        for (let j = 1; j <= game.level.columns; j++) {
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
    game.gameMode = gameModes[sel('.type .btn-group .active').value];

    let form = sel('.addWords');
    form.classList.remove('normal', 'related');
    form.classList.add(game.gameMode.className.toLowerCase());
    form.innerHTML = '';
    form.innerHTML = game.gameMode.formHTML;

    sel('form.addWords input').addEventListener('change', (e) => {
        e.preventDefault();
        sel('form.addWords button').disabled = !e.target.value.trim();
    });
});

sel('.level .next').addEventListener('click', e => {
    let activeBtn = sel('.level .buttons .active')
    game.level = levels[activeBtn.value];

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

sel('form.addWords').addEventListener('submit', (e) => {
    e.preventDefault();
    game.gameMode.addWord();
});





globalEventListener('click', '.listing ul li button.deleteWord i', e => {
    e.target.closest('li').remove();
});

globalEventListener('click', '.listing ul li button.deleteWord', e => {
    e.target.closest('li').remove();
});



/*---------------------------------*/
/*              MAIN               */
/*---------------------------------*/
(() => { })();
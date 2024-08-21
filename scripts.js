document.addEventListener('DOMContentLoaded', () => {
    let allChords = ['c', 'cmaj7', 'd', 'dm', 'd7', 'em', 'e', 'f', 'g', 'a', 'am', 'a7', 'asus2', 'hm', 'h7'];
    let currentChord = '';
    let lastChord = '';
    let repeatCount = 0;

    function getRandomChord(chords) {
        let randomChord;
        do {
            randomChord = chords[Math.floor(Math.random() * chords.length)];
        } while (randomChord === lastChord && repeatCount >= 2);
        
        repeatCount = (randomChord === lastChord) ? repeatCount + 1 : 0;
        lastChord = randomChord;
        return randomChord;
    }

    function getUniqueRandomChords(excludeChord, chords) {
        const remainingChords = chords.filter(chord => chord !== excludeChord);
        const selectedChords = [];
        while (selectedChords.length < 2) {
            const randomChord = remainingChords[Math.floor(Math.random() * remainingChords.length)];
            if (!selectedChords.includes(randomChord)) {
                selectedChords.push(randomChord);
            }
        }
        return selectedChords;
    }

    function getSelectedChords() {
        return Array.from(document.querySelectorAll('.chord-selection input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    }

    function playChord(chord) {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = `audio/${chord}.mp3`;
        audioPlayer.play();
    }

    function playRandomChord() {
        const selectedChords = getSelectedChords();
        if (selectedChords.length < 3) {
            alert('Bitte wählen Sie mindestens drei Akkorde aus.');
            return;
        }
        let newChord;
        do {
            newChord = getRandomChord(selectedChords);
        } while (newChord === currentChord && repeatCount >= 2);

        currentChord = newChord;
        playChord(currentChord);
        displayChords(selectedChords);
        document.getElementById('result').textContent = '';
        resetBorders();
    }

    function repeatChord() {
        if (currentChord) {
            playChord(currentChord);
        }
    }

    function displayChords(chords) {
        const correctPosition = Math.floor(Math.random() * 3);
        const positions = [0, 1, 2];
        positions.splice(correctPosition, 1);

        const correctChordElement = document.getElementById(`chord${correctPosition + 1}`);
        correctChordElement.querySelector('img').src = `image/${currentChord}.png`;
        correctChordElement.querySelector('img').setAttribute('data-chord', currentChord);

        const uniqueChords = getUniqueRandomChords(currentChord, chords);
        if (chords.length === 2) {
            uniqueChords.push(currentChord);
        }

        document.getElementById(`chord${positions[0] + 1}`).querySelector('img').src = `image/${uniqueChords[0]}.png`;
        document.getElementById(`chord${positions[0] + 1}`).querySelector('img').setAttribute('data-chord', uniqueChords[0]);

        document.getElementById(`chord${positions[1] + 1}`).querySelector('img').src = `image/${uniqueChords[1]}.png`;
        document.getElementById(`chord${positions[1] + 1}`).querySelector('img').setAttribute('data-chord', uniqueChords[1]);
    }

    function checkChord(event) {
        const selectedChord = event.target.getAttribute('data-chord');
        const result = document.getElementById('result');
        const chords = document.querySelectorAll('.chord');
        chords.forEach(chord => {
            chord.style.borderColor = 'transparent';
        });
        if (selectedChord === currentChord) {
            result.textContent = 'Richtig!';
            result.style.color = 'green';
            event.target.parentElement.style.borderColor = 'green';
        } else {
            result.textContent = 'Falsch!';
            result.style.color = 'red';
            event.target.parentElement.style.borderColor = 'red';
        }
    }

    function resetBorders() {
        const chords = document.querySelectorAll('.chord');
        chords.forEach(chord => {
            chord.style.borderColor = 'transparent';
            chord.addEventListener('mouseover', () => {
                chord.style.borderColor = 'brown';
            });
            chord.addEventListener('mouseout', () => {
                chord.style.borderColor = 'transparent';
            });
        });
    }

    function enforceMinCheckboxSelection() {
        const checkboxes = document.querySelectorAll('.chord-selection input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedCheckboxes = document.querySelectorAll('.chord-selection input[type="checkbox"]:checked');
                if (selectedCheckboxes.length < 3) {
                    checkbox.checked = true;
                    alert('Bitte wählen Sie mindestens drei Akkorde aus.');
                }
            });
        });
    }

    function loadChordsFromJson(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    allChords = jsonData.chords;
                    updateChordSelection();
                } catch (error) {
                    alert('Fehler beim Laden der JSON-Datei: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    }

    function updateChordSelection() {
        const chordSelectionDiv = document.querySelector('.chord-selection');
        chordSelectionDiv.innerHTML = '';
        allChords.forEach(chord => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = chord;
            checkbox.checked = true;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(chord));
            chordSelectionDiv.appendChild(label);
        });
        enforceMinCheckboxSelection();
    }

    document.getElementById('jsonFileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('fileNameText').textContent = file.name;
        }
        loadChordsFromJson(event);
    });
    document.getElementById('playButton').addEventListener('click', playRandomChord);
    document.getElementById('repeatButton').addEventListener('click', repeatChord);
    document.querySelectorAll('.chord img').forEach(img => img.addEventListener('click', checkChord));
    enforceMinCheckboxSelection();
    resetBorders();

    document.addEventListener('keydown', function(event) {
        const playText = document.getElementById('playText');
        const repeatText = document.getElementById('repeatText');
        const chord1Text = document.getElementById('chord1Text');
        const chord2Text = document.getElementById('chord2Text');
        const chord3Text = document.getElementById('chord3Text');
        
        playText.classList.remove('underline');
        repeatText.classList.remove('underline');
        chord1Text.classList.remove('underline');
        chord2Text.classList.remove('underline');
        chord3Text.classList.remove('underline');

        switch (event.key) {
            case 'a':
                playRandomChord();
                playText.classList.add('underline');
                break;
            case 'w':
                repeatChord();
                repeatText.classList.add('underline');
                break;
            case '1':
                document.getElementById('chord1').querySelector('img').click();
                chord1Text.classList.add('underline');
                break;
            case '2':
                document.getElementById('chord2').querySelector('img').click();
                chord2Text.classList.add('underline');
                break;
            case '3':
                document.getElementById('chord3').querySelector('img').click();
                chord3Text.classList.add('underline');
                break;
        }
    });
});

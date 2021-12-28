
// dropdown
class Dropdown {
    constructor(selector, options) {
        this.$el = document.querySelector(selector);
        this.items = options.items;
        this.$el.querySelector('.dropdown-label').innerHTML = `${this.items[0].label}<i class="fas fa-caret-down"></i>`;
        this.$el.querySelector('.dropdown-label').id = `${this.items[0].id}`;
        this.$el.querySelector('.dropdown-label').value = `${this.items[0].value}`;
        this.$el.addEventListener('click', event => {
            // console.log(event.target)
            if (event.target.classList.contains('dropdown-label')) {
                if (this.$el.classList.contains('open')) {
                    this.close();
                } else {
                    this.open();
                }
            } else if (event.target.tagName.toLowerCase() === 'li') {
                this.select(event.target.dataset.id);
            }
        });
        const itemsHTML = this.items.map(i => {
            return `<li class="dropdown-menu__item" data-id='${i.id}'>${i.label}</li>`
        }).join('');
        this.$el.querySelector('.dropdown-menu').insertAdjacentHTML('afterbegin', itemsHTML);
    };
    select(id) {
        const item = this.items.find(i => i.id === id);
        this.$el.querySelector('.dropdown-label').id = item.id;
        this.$el.querySelector('.dropdown-label').value = item.value;
        this.$el.querySelector('.dropdown-label').innerHTML = `${item.label}<i class="fas fa-caret-down"></i>`;
        
        // console.log(item)
        this.close();
    };
    clickThrough(e) {
        console.log(e)
    }
    open() {
        this.$el.classList.add('open');
    };
    close() {
        this.$el.classList.remove('open');
    };
}
const dropdown = new Dropdown('#kickDropdown', {
    items: [
        {label: 'Classic Kick', value: 'classicKick', id: "./sound/kick-classis.wav"},
        {label: '808 Kick', value: '808Kick', id: "./sound/kick-808.wav"},
        {label: 'Kick Heavy', value: 'kickHeavy', id: "./sound/kick-heavy.wav"},
        {label: 'Kick Softy', value: 'kickSofty', id: "./sound/kick-softy.wav"}
    ]
});
const dropdown2 = new Dropdown('#snareDropdown', {
    items: [
        {label: 'Classic Snare', value: 'classicSnare', id: "./sound/snare-acoustic01.wav"},
        {label: 'Snare 808', value: 'snare808', id: "./sound/snare-808.wav"},
        {label: 'Snare Vinyl02', value: 'snareVinyl02', id: "./sound/snare-vinyl02.wav"}
    ]
});
const dropdown3 = new Dropdown('#hiHatDropdown', {
    items: [
        {label: 'Hihat acoustic', value: 'hihatAcoustic', id: "./sound/hihat-acoustic01.wav"},
        {label: 'Hihat 808', value: 'hihat808', id: "./sound/hihat-808.wav"},
    ]
});

// Drumkit 
class Drumkit {
    constructor() {
        this.pads = document.querySelectorAll('.pad');
        this.playBtn = document.querySelector('.play');
        this.kickAudio = document.querySelector('.kick-sound');
        this.snareAudio = document.querySelector('.snare-sound');
        this.hihatAudio = document.querySelector('.hihat-sound');
        this.index = 0;
        this.bpm = 150;
        this.isPlaying = null; 
        this.muteBtns = document.querySelectorAll('.mute');
        this.tempoSlider = document.querySelector('.tempo-slider');
        this.selects = document.querySelectorAll('.dropdown');
        this.selected = document.querySelectorAll('.dropdown-label');
    }
    
    activePad() {
        this.classList.toggle('active');
    }
    start() {
        const interval = (60/this.bpm) * 1000;
        if (!this.isPlaying) {
            this.isPlaying = setInterval(() => {
                this.repeat();
            }, interval);
            
        } else {
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        }   
    }
    updateBtn() {
        if (!this.isPlaying) {
            this.playBtn.innerText = 'Stop';
            this.playBtn.classList.add('active');
        } else {
            this.playBtn.innerText = 'Play';
            this.playBtn.classList.remove('active');
        }
    }
    repeat() {
        let step = this.index % 8;
        const activeBars = document.querySelectorAll(`.b${step}`);

        activeBars.forEach(bar => {
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
            if (bar.classList.contains('active')) {
                if (bar.classList.contains('kick-pad')) {
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if (bar.classList.contains('snare-pad')) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if (bar.classList.contains('hihat-pad')) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        })
        this.index++;
    }
    changeSound(e) {
        const selectionName = e.target.parentNode.parentNode.id;
        const selectionValue = e.target.dataset.id;
        switch(selectionName) {
            case "kickDropdown":
                this.kickAudio.src = selectionValue;
                break;
            case "snareDropdown":
                this.snareAudio.src = selectionValue;
                break;
            case "hiHatDropdown":
                this.hihatAudio.src = selectionValue;
                break;      
        }
    }
    mute(e) {
        const muteIndex = e.target.getAttribute('data-track');
        e.target.classList.toggle('clicked');
        if(e.target.classList.contains('clicked')) {
            switch(muteIndex) {
                case '0':
                    this.kickAudio.volume = 0;
                    break;
                case '1':
                    this.snareAudio.volume = 0;
                    break;
                case '2':
                    this.hihatAudio.volume = 0;
                    break;
            }
        } else {
            switch(muteIndex) {
                case '0':
                    this.kickAudio.volume = 1;
                    break;
                case '1':
                    this.snareAudio.volume = 1;
                    break;
                case '2':
                    this.hihatAudio.volume = 1;
                    break;
            }
        }
    }
    changeTempo(e) {
        const tempoTxt = document.querySelector('.tempo-num');
        tempoTxt.innerText = e.target.value;
    }
    updateTempo(e) {
        this.bpm = e.target.value;
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if(playBtn.classList.contains('active')) {
            this.start();
        }
    }
} 

const drumKit = new Drumkit();

drumKit.pads.forEach(pad => {
    pad.addEventListener('click', drumKit.activePad);
    pad.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

drumKit.playBtn.addEventListener('click', function() {
    drumKit.updateBtn();
    drumKit.start();
})
drumKit.selects.forEach(select => {
    select.addEventListener('click', function(e) {
        if(!select.classList.contains('open')) {
            drumKit.changeSound(e)
        }
    })
}) 
drumKit.muteBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        drumKit.mute(e);
    })
})
drumKit.tempoSlider.addEventListener('input', function(e) {
    drumKit.changeTempo(e);
})
drumKit.tempoSlider.addEventListener('change', function(e) {
    drumKit.updateTempo(e);
})
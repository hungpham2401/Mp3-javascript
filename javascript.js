
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading  = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn  = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const repeat = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0, //lấy ra chỉ mục đầu tiên của mảng
    isPlaying : false ,
    isRanDom : false ,
    isRepeat : false ,
    settings : {
        
    },
    songs: [
        {
            name: 'Name song 1',
            singer: 'Son tung',
            path: './music/24.mp3',
            image: './img/sontung.jpg',
        },
        {
            name: 'Name song 2',
            singer: 'Son tung',
            path: './music/1.mp3',
            image: './img/sontung.jpg',

        },

        {
            name: 'Name song 3',
            singer: 'Son tung',
            path: './music/2.mp3',
            image: './img/sontung.jpg',

        },

        {
            name: 'Name song 4',
            singer: 'Son tung',
            path: './music/3.mp3',
            image: './img/sontung.jpg',

        },

        {
            name: 'Name song 5',
            singer: 'Son tung',
            path: './music/4.mp3',
            image: './img/sontung.jpg',

        }

    ],
    render: function () {
        const htmls = this.songs.map((song , index ) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>  
            </div>
            
            `
        })
        $('.playlist').innerHTML = htmls.join('')

    },
    defineProperties : function(){
        Object.defineProperty(this, 'currentSong' , {
            get : function (){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function(){
        const _this = this ;
        //xu ly cd quay  / dung 
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration : 10000 ,
            iterations : Infinity ,
        })
        cdThumbAnimate.pause()


        //xy ly phong to thu nho cd
        const cdWidth = cd.offsetWidth ;
        document.onscroll = function(){
            const scrollTop = window.scrollY ||  document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop ;
            

            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px'  : 0 ;
            cd.style.opacity = newCdWidth / cdWidth
        }

        //xu ly khi play play
        playBtn.onclick = function (){
            if (_this.isPlaying ){
               audio.pause()
            }
            else {
                audio.play();
            }
        
        }
        //khi play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play()

        }
        // khi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()

        }
        
        //khi tien do thay doi 
        audio.ontimeupdate = function (){
            if(audio.duration) {
                const progressPercent =Math.floor(audio.currentTime / audio.duration  * 100) 
                progress.value = progressPercent
            
            }
        }

        //xu ly khi tua 
        progress.onchange = function (e) {
            const  seekTime  = Math.floor(audio.duration / 100 * e.target.value) 
            audio.currentTime = seekTime
        }


        /// khi next song 
        nextBtn.onclick = function (){
            if(_this.isRanDom){
                _this.playRandomMusic();
            }else {

                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
       prevBtn.onclick = function () {
        if(_this.isRanDom){
            _this.playRandomMusic();
        }else {
            _this.prevSong()
        }
        audio.play();
        _this.render()

       }

       // xu ly random bat tat
       randomBtn.onclick = function () {
            _this.isRanDom = !_this.isRanDom
            randomBtn.classList.toggle('active' , _this.isRanDom)
       }

       //xu repeatBtn  click
       repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active' , _this.isRepeat)
       }

       //xu ly next song khi audio ended
       audio.onended = function () {
            if(_this.isRepeat){
                audio.play()
            }else {
               nextBtn.click()
            }
        
       }

       // click vao element song de chay 
       playlist.onclick  = function (e) {
           const songNode = e.target.closest('.song:not(.active)') ;
            if( songNode|| e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')){

                }
            }
       }

       
    },
    scrollToActiveSong:function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'center' 
                }
            )
                
            

            
        },200)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name ;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path ;
    },
    //next songs 
   
    nextSong: function(){
        this.currentIndex++ ;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0 ;
        }
        this.loadCurrentSong()
    },

    // tua nguoc lai bai hat 
    prevSong: function(){
        this.currentIndex-- ;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }else {
            
        }
        this.loadCurrentSong();
    },

    // random list music 
    playRandomMusic: function(){
        let newIndex 
        do {
           newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex ;
        this.loadCurrentSong();
    },

    start: function () {
        this.defineProperties();
        this.handleEvent()
        this.loadCurrentSong();
        this.render()
       
    },
}

app.start()

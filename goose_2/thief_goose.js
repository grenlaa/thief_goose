

class thief_goose_ {

    constructor(id, version, posX, posY) {

        //главный блок гуся
        this.main_div

        this.id = id

        // анимации:
        // 1 только бег
        // 2 бег и ожидание
        // 3 добавление звука
        this.version = version


        // действие гуся:
        // 1 бег
        // 2 ожидание
        this.status = 1;

        // смена блоков для анимации
        this.change = true;

        // список анимация (список setInterval)
        this.animation = new Array();

        // переменная для подсчета времени до включения ожидания
        this.stop = 0;

        // шаги гуся
        this.id_step = 0


        this.last_clientX = posX
        this.last_clientY = posY

        // звук гуся
        this.audio_goose_honk = null

        this.create_html();
        this.add_event_mousedown();
        this.animation_wait();
    }


    create_html() {
        console.log("create_goose")

        //добавление блока гуся на страницу
        this.main_div = document.createElement('div');
        this.main_div.id = "thief_goose_" + this.id
        this.main_div.classList.add("thief_goose_tr");
        this.main_div.dataset.version = this.version;
        this.main_div.style.cssText = "top:" + this.last_clientY + "px ; left: " + this.last_clientX + "px;";
        document.body.appendChild(this.main_div);


        if (this.version > 0) {
            let itg1_run = chrome.runtime.getURL('goose1_run.png')
            let itg2_run = chrome.runtime.getURL('goose2_run.png')
            this.main_div.innerHTML = "<div class=\"thief_goose\" id=\"thief_goose_" + this.id + "_1_run\" style=\" background-image: url(" + itg1_run + "); display:none; \" data-status=\"stop\"></div>"
            this.main_div.innerHTML += "<div class=\"thief_goose\" id=\"thief_goose_" + this.id + "_2_run\" style=\" background-image: url(" + itg2_run + "); display:none;  \" data-status=\"stop\"></div>";
        }
        if (this.version > 1) {
            let itg1_stop = chrome.runtime.getURL('goose1_stop.png')
            let itg2_stop = chrome.runtime.getURL('goose2_stop.png')
            this.main_div.innerHTML += "<div class=\"thief_goose\" id=\"thief_goose_" + this.id + "_1_stop\" style=\" background-image: url(" + itg1_stop + "); display:none;  \" data-status=\"stop\"></div>";
            this.main_div.innerHTML += "<div class=\"thief_goose\" id=\"thief_goose_" + this.id + "_2_stop\" style=\" background-image: url(" + itg2_stop + "); display:none;  \" data-status=\"stop\"></div>";
            this.status = 2;
        }
        if (this.version > 2) {
            this.audio_goose_honk = new Audio(chrome.runtime.getURL('goose-honk.wav'));
            this.audio_goose_honk.loop = false;
        }

        //сохранение html элементов в свойства объекта
        if (this.version > 0) {
            this.thief_goose1_run = document.getElementById("thief_goose_" + this.id + "_1_run")
            this.thief_goose2_run = document.getElementById("thief_goose_" + this.id + "_2_run")
        }
        if (this.version > 1) {
            this.thief_goose1_stop = document.getElementById("thief_goose_" + this.id + "_1_stop")
            this.thief_goose2_stop = document.getElementById("thief_goose_" + this.id + "_2_stop")
        }

        this.main_div = document.getElementById("thief_goose_" + this.id)

    }

    // остановка всех анимация объекта
    stop_animation() {
        for (let i = 0; i < this.animation.length; i++) {
            clearInterval(this.animation[i])
        }
        this.animation = new Array();
    }

    //Добавление шагов
    add_step() {

        // получение позиции основного блока
        let step_x = this.main_div.offsetLeft + (Math.random() * 10 - 5)
        let step_y = this.main_div.offsetTop + 20 + (Math.random() * 10 - 5)

        setTimeout(() => {

            // добавление элемента на страницу
            let _div = document.createElement('div');
            _div.classList.add("thief_goose_step");
            _div.style.cssText = "top:" + step_y + "px ; left: " + step_x + "px;";
            document.body.appendChild(_div);
            this.id_step++;

            // удаление элемента
            setTimeout(() => {
                _div.remove()
            }, 5000);

        }, 100)
    }


    //Анимация бега
    animation_run() {

        console.log("started animation_run")

        this.stop_animation();

        //установка первого кадра
        if (this.version > 0) {
            this.thief_goose1_run.style.display = "block"
            this.thief_goose2_run.style.display = "none"
        }
        if (this.version > 1) {
            this.thief_goose1_stop.style.display = "none"
            this.thief_goose2_stop.style.display = "none"
        }

        //смена кадров
        let id = setInterval(() => {

            if (this.change) {
                this.thief_goose1_run.style.display = "none"
                this.thief_goose2_run.style.display = "block"
            } else {
                this.thief_goose1_run.style.display = "block"
                this.thief_goose2_run.style.display = "none"
            }
            this.add_step();
            this.change = !this.change;

        }, 200, this);

        this.animation.push(id)
    }



    //Анимация ожидание
    animation_wait() {

        console.log("started animation_stop")

        this.stop_animation();

        //установка первого кадра
        this.thief_goose1_stop.style.display = "block";
        this.thief_goose2_stop.style.display = "none";
        this.thief_goose1_run.style.display = "none";
        this.thief_goose2_run.style.display = "none";

        //смена кадров
        let id = setInterval(() => {

            if (this.change) {
                this.thief_goose1_stop.style.display = "none";
                this.thief_goose2_stop.style.display = "block";
                if (this.version > 2) {
                    this.audio_goose_honk.play();
                }
            } else {
                this.thief_goose1_stop.style.display = "block";
                this.thief_goose2_stop.style.display = "none";
            }

            this.change = !this.change;
        }, 2000, this);

        this.animation.push(id)
    }


    // обработка события mousedown
    thief_gose_mousedown(event) {

        if (this.version > 2) {
            this.audio_goose_honk.play();
        }

        this.stop = 0;

        if (this.status != 1) {

            this.status = 1;
            this.animation_run();

            // добавление события mousemove на страницу
            this.bound_move_thief_goose = this.move_thief_goose.bind(this);
            document.addEventListener("mousemove", this.bound_move_thief_goose);

            //остановка всплытия событий
            event.stopPropagation();


            // проверка на остановку
            let id = setInterval(() => {

                // увеличение счетчика ожидания на 1
                this.stop += 1


                if (this.stop > 30) {
                    console.log("delete mousemove ")

                    this.status = 2;
                    document.removeEventListener("mousemove", this.bound_move_thief_goose)

                    this.animation_wait()

                    clearInterval(id)
                    return;
                }

            }, 50, this);

            this.animation.push(id)
        }
    }

    // обработка события mousemove
    move_thief_goose(event) {

        console.log("mouse X/Y: ", event.clientX, event.clientY)

        //модуль разницы между последней координатой мыши и новой по X
        if (Math.abs(this.last_clientX - event.clientX) > 20) {

            if (this.last_clientX > event.clientX) {
                this.main_div.style.transform = "scaleX(-1)";
            } else {
                this.main_div.style.transform = "scaleX(1)";
            }

            //передвижение объекта на позицию мыши по X
            this.main_div.style.left = event.clientX + 'px';

            this.last_clientX = event.clientX;

            //обновление счетчика ожидания
            this.stop = 0;
        }

        //модуль разницы между последней координатой мыши и новой по Y
        if (Math.abs(this.last_clientY - event.clientY) > 20) {
            //передвижение объекта на позицию мыши по Y
            this.main_div.style.top = event.clientY + 'px';

            this.last_clientY = event.clientY;

            //обновление счетчика ожидания
            this.stop = 0;
        }
    }

    add_event_mousedown() {
        this.main_div.addEventListener("mousedown", this.thief_gose_mousedown.bind(this))
    }
 
 
}
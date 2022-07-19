
export default class MoveHeader {
    constructor(block) {
        this.block = block;

        this.toggleShadow = this.toggleShadow.bind(this);
        this.init();
    }

    init() {
        this.addPaddingHeader();
        this.addListener();
    }

    addPaddingHeader() {
        document.body.style.paddingTop = this.block.clientHeight + "px";
    }

    addListener() {
        window.addEventListener("scroll", this.toggleShadow);
    }


    toggleShadow() {
        if(scrollY > 1 && !this.block.classList.contains('header__shadow')) {
            this.block.classList.add('header__shadow');
        } else if(scrollY < 1 && this.block.classList.contains('header__shadow')){
            this.block.classList.remove('header__shadow');
        }
    }
}
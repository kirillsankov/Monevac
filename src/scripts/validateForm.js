import JustValidate from 'just-validate';
import "@enp/inputmask/lib/inputmask";

const SELECTORS = {
    tel: ".form__tel",
}


export default class ValidateForm {
    constructor(block) {
        this.block = block;
        this.telBlock = block.querySelector(SELECTORS.tel);
        this.init();
    }

    init() {
        this.addTelMask();
        this.JustValidate();
    }
    addTelMask() {
        const inputMasks = new Inputmask('+7(999)-999-99-99', {showMaskOnHover: false});
        inputMasks.mask(this.telBlock);
    }

    JustValidate() {
        const validate = new JustValidate(this.block, {
            errorFieldCssClass: 'form__input-error',
            errorLabelCssClass: 'form__error',
            testingMode: true,
        });
        validate.addField("#name", [
            {
                rule: "required",
                errorMessage: 'Является обязательным полем',
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Поле не должна быть короче 2 символов',
            },
            {
                rule: 'maxLength',
                value: 30,
                errorMessage: 'Поле не должна быть длиннее 30 символов',

            },
        ]).addField('#phone', [
            {
                rule: "required",
                errorMessage: 'Является обязательным полем',
            },
            {
                validator: () => {
                    const phone = this.telBlock.inputmask.unmaskedvalue();
                    return Boolean(phone.length === 10 && Number(phone));
                },
                errorMessage: 'Данные введены не корректно'
            }
        ]).addField("#message", [
            {
                rule: "required",
                errorMessage: 'Является обязательным полем',
            },
            {
                rule: 'minLength',
                value: 20,
                errorMessage: 'Сообщение не должна быть короче 20 символов',
            },
            {
                rule: 'maxLength',
                value: 300,
                errorMessage: 'Сообщение не должна быть длиннее 300 символов',

            },
        ]).addField("#checkbox", [
            {
                rule: "required",
                errorMessage: "Согласитесь с политикой обработки персональных данных",
            }
        ]).onSuccess(() => {
            this.submitForm();
            alert("Форма отправлена");
            this.block.reset();
        });
    }

    submitForm() {
       fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: new FormData(this.block),
        })
            .then(response => response.json())
            .then(json => console.log(json));
    }
}
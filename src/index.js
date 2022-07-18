import './styles/index.scss';
import Maps from './scripts/maps';
import ValidateForm from './scripts/validateForm';



document.addEventListener('DOMContentLoaded', () => {
    [...document.querySelectorAll('#map')].forEach((elem) => new Maps(elem));
    [...document.querySelectorAll('.form')].forEach((elem) => new ValidateForm(elem));
})

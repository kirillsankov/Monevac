import './styles/index.scss';
import Maps from './scripts/maps';
import ValidateForm from './scripts/validateForm';
import MoveHeader from './scripts/moveHeader';



document.addEventListener('DOMContentLoaded', () => {
    [...document.querySelectorAll('#map')].forEach((elem) => new Maps(elem));
    [...document.querySelectorAll('.form')].forEach((elem) => new ValidateForm(elem));
    [...document.querySelectorAll('.header')].forEach((elem) => new MoveHeader(elem));
})

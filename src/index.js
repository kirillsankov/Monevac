import './styles/index.scss';
import Maps from './scripts/maps';



document.addEventListener('DOMContentLoaded', (e) => {
    [...document.querySelectorAll('#map')].forEach((elem) => new Maps(elem));
})

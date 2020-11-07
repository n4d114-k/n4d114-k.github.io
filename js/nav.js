const TRIGGERS = document.querySelectorAll('.animated-dropdown > li');
const BACKGROUND = document.querySelector('.dropdownBackground');
const NAV = document.querySelector('.top');


function handleEnter() {

  this.classList.add('trigger-enter');

  setTimeout(() => this.classList
      .contains('trigger-enter') && this.classList.add('trigger-enter-active'), 150);
  BACKGROUND.classList.add('open');

  const dropdown = this.querySelector('.dropdown');
  const dropdownCoords = dropdown.getBoundingClientRect();
  const navCoords = NAV.getBoundingClientRect();

  const coords = {
    height: dropdownCoords.height,
    width: dropdownCoords.width,
    top: dropdownCoords.top - navCoords.top,
    left: dropdownCoords.left - navCoords.left
  };

  BACKGROUND.style.setProperty('width', `${coords.width}px`);
  BACKGROUND.style.setProperty('height', `${coords.height}px`);
  BACKGROUND.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px)`);

}


function handleLeave() {

  this.classList.remove('trigger-enter', 'trigger-enter-active');

  BACKGROUND.classList.remove('open');

}


TRIGGERS.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
TRIGGERS.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));

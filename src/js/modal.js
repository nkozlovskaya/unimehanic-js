const modal = () => {
  function bindModal(triggerSelector, modalSelector, closeSelector) {
    const trigger = document.querySelector(triggerSelector);
    const modal = document.querySelector(modalSelector);
    const close = document.querySelector(closeSelector);

    trigger.addEventListener("click", (e) => {
      if (e.target) {
        e.preventDefault();
        modal.style.display = "block";
      }
    });

    close.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  //   function showModalByTime(selector, time) {
  //     setTimeout(function () {
  //       document.querySelector(selector).style.display = "block";
  //       //   document.body.style.overflow = "hidden";
  //     }, time);
  //   }

  bindModal(".popup-btn", ".overlay", ".modal__form-cansel");

  //   showModalByTime(".overlay", 3000);
};

export default modal;

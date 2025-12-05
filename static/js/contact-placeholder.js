document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherToggle = other.querySelector('.faq-toggle');
        if (otherToggle) otherToggle.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('active');
        if (toggle) toggle.textContent = '-';
      }
    });
  });

  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    if (btnText && btnLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
    }
    setTimeout(() => {
      alert('送信機能は現在調整中です。SNS または BOOTH からご連絡ください。');
      if (btnText && btnLoading) {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
    }, 400);
  });
});

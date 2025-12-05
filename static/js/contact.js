// Cloudflare Pages contact form handler for the static site
document.addEventListener('DOMContentLoaded', () => {
    initializeFAQ();

    const form = document.getElementById('contactForm');
    if (!form) {
        return;
    }

    const endpoint = form.dataset.endpoint || form.action || '/api/contact';
    const messageBox = form.querySelector('[data-form-message]');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    const MIN_NAME_LENGTH = 2;
    const MIN_MESSAGE_LENGTH = 10;

    const setFormMessage = (variant, text) => {
        if (!messageBox) {
            return;
        }
        messageBox.classList.remove('info', 'success', 'error');
        messageBox.classList.add(variant);
        messageBox.textContent = text;
        messageBox.style.display = 'block';
    };

    const setLoadingState = (isLoading) => {
        if (!submitBtn || !btnText || !btnLoading) {
            return;
        }
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoading.style.display = isLoading ? 'inline' : 'none';
    };

    const resetTurnstile = () => {
        if (typeof window === 'undefined' || !window.turnstile) {
            return;
        }
        try {
            window.turnstile.reset();
        } catch (err) {
            console.warn('Failed to reset Turnstile', err);
        }
    };

    const serializeForm = () => {
        const formData = new FormData(form);
        const entries = Object.fromEntries(formData.entries());
        const agreementInput = form.querySelector('input[name="contact_agreement"]');

        return {
            agreementAccepted: Boolean(agreementInput?.checked),
            payload: {
                name: (entries.contact_name || '').trim(),
                email: (entries.contact_email || '').trim(),
                phone: (entries.contact_phone || '').trim(),
                subject: entries.contact_subject || '',
                budget: entries.contact_budget || '',
                deadline: (entries.contact_deadline || '').trim(),
                message: (entries.contact_message || '').trim(),
                turnstileToken: entries['cf-turnstile-response'] || ''
            }
        };
    };

    const validateClientPayload = (payload) => {
        if (!payload.name || payload.name.length < MIN_NAME_LENGTH) {
            return 'お名前は2文字以上で入力してください。';
        }
        if (!payload.subject) {
            return '件名を選択してください。';
        }
        if (!payload.message || payload.message.length < MIN_MESSAGE_LENGTH) {
            return 'メッセージは10文字以上で入力してください。';
        }
        if (!payload.turnstileToken) {
            return 'セキュリティ検証が完了していません。数秒後に再度お試しください。';
        }
        return null;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const { agreementAccepted, payload } = serializeForm();
        if (!agreementAccepted) {
            setFormMessage('error', '利用規約への同意が必要です。');
            return;
        }

        const clientError = validateClientPayload(payload);
        if (clientError) {
            setFormMessage('error', clientError);
            return;
        }

        setLoadingState(true);
        setFormMessage('info', '送信処理を開始しました…');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                const remoteMessage = result.error || '送信に失敗しました。時間をおいて再度お試しください。';
                throw new Error(remoteMessage);
            }

            setFormMessage('success', '送信が完了しました。確認後にご連絡いたします。');
            form.reset();
            resetTurnstile();
        } catch (error) {
            const fallback = '送信中にエラーが発生しました。時間をおいて再度お試しください。';
            setFormMessage('error', error.message || fallback);
        } finally {
            setLoadingState(false);
        }
    });
});

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) {
        return;
    }

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        if (!question) {
            return;
        }

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            faqItems.forEach((other) => {
                other.classList.remove('active');
                const otherToggle = other.querySelector('.faq-toggle');
                if (otherToggle) {
                    otherToggle.textContent = '+';
                }
            });

            if (!isOpen) {
                item.classList.add('active');
                const toggle = item.querySelector('.faq-toggle');
                if (toggle) {
                    toggle.textContent = '-';
                }
            }
        });
    });
}

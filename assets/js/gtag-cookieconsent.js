const consentModal = document.querySelector('#consent_modal');
const checkConsent = () => {
    const consentCookie = getCookie('cookie_consent');
    switch (consentCookie) {
        case 'granted':
            return true;
        case 'denied':
            return false;
        default:
            showModal();
            return false
    }
}

const showModal = () => {
    if (consentModal.classList.contains("consent_hidden")) {
        consentModal.classList.remove("consent_hidden");
    }

    const acceptAllButton = document.getElementById('accept-all');
    acceptAllButton.addEventListener('click', () => {
        // Set consent cookie to 'granted' and send consent update to Analytics
        setCookie('cookie_consent', 'granted', 90);
        gtag('consent', 'update', { 'analytics_storage': 'granted'});
        closeModal();
    });

    const acceptNecessaryButton = document.getElementById('accept-necessary');
    acceptNecessaryButton.addEventListener('click', () => {
        // Remove all cookies starting with '_ga' and set consent cookie to 'denied'
        removeCookiesStartingWith('_ga');
        gtag('consent', 'update', { 'analytics_storage': 'denied'});
        setCookie('cookie_consent', 'denied', 90);
        closeModal();
    });
}

const closeModal = () => {
    consentModal.classList.add("consent_hidden");
    consentModal.replaceWith(consentModal.cloneNode(true)); //remove event listeners
}

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        return null;
    }
}

const setCookie = (name, value, expires) => {
    let date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    const expiry_date = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expiry_date + ';path=/';
}

const  removeCookiesStartingWith = (prefix) => {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(prefix) === 0) {
            document.cookie = cookie.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=.' +window.location.host+ ';';
        }
    }
}

checkConsent();
let userData = {
    name: '',
    email: '',
    gender: '',
    permission: '',
    date: ''
};

const init = () => {
    const formElement = document.getElementById('form');
    if (!formElement) {
        return;
    }
    formElement.addEventListener('submit', submit);
    const prepareDates = () => {
        const dateSelect = document.getElementById('dateSelect');
        if (!dateSelect) {
            return;
        }
        fetch('./dates.json')
            .then(response => response.json())
            .then(response => {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                let selectData = '<option value="">Please Select</option>';
    
                response.result.forEach(date => {
                    const from = new Date(date.start);
                    const to = new Date(date.end);
                    const newString = `${days[from.getDay()]} ${from.getDate()} ${months[from.getMonth()]} ${from.getHours()}:${from.getMinutes().toString().padStart(2, '0')} - ${to.getHours()}:${to.getMinutes().toString().padStart(2, '0')}`;
                    selectData += `<option value="${newString}">${newString}</option>`;
                });
                dateSelect.innerHTML = selectData;
            });
    }
    prepareDates();
}
init();

function submit(e) {
    e.preventDefault();
    errors.removeErrors();
    
    const formData = new FormData(e.target);
    for (const [key, val] of formData.entries()) {
        userData[key] = val;
    }
    validate();
    
    if (errors.hasErrors) {
        console.log(errors.errors);
        return;
    }
    
    const message = document.getElementsByClassName('contact-page--message')[0];    
    const div = document.createElement('div', {class:"message"});
    message.appendChild(div);
    
    const title = document.createElement('h4');
    const titleText = document.createTextNode(`Thank you for your interest, ${userData.gender === 'male' ? 'Mr.' : 'Mrs.'} ${userData.name}!`);
    title.appendChild(titleText);
    
    let address = document.createElement('h4');
    const addressText = document.createTextNode(`A confirmation letter has been sent at ${userData.email}.`);
    if (permission) {        
        address.appendChild(addressText);        
    }
        
    const appointment = document.createElement('h4');
    const appointmentText = document.createTextNode(`We are happy to meet you on ${userData.date}!`);
    appointment.appendChild(appointmentText); 
    
    div.appendChild(title);
    if (address) {
        div.appendChild(address);        
    }
    div.appendChild(appointment);
    e.target.style.display="none";
    
    message.style.display="grid";    
    console.log(userData);
}

function validate() {
    validators = {
        name: () => {
            if (!userData.name) {
                errors.setError('name', 'Please provide a name');
                return;
            }
            
            const regex = /[A-Z][a-z]+ [A-Z][a-z]+/g;
            if (!regex.test(userData.name)) {
                errors.setError('name', 'Please provide a valid name');
                return;
            }
        },
        email: () => {
            if (!userData.email) {
                errors.setError('email', 'Please provide an email address');
                return;
            }

            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!regex.test(userData.email)) {
                errors.setError('email', 'Please provide a valid email address');
                return;
            }
        },
        date: () => {
            if (!userData.date) {
                errors.setError('date', 'Please select a date');
                return;
            }
        }
    };
    Object.keys(validators).forEach(key => {
        validators[key]();
    });
}

const errors = {
    hasErrors: false,
    errors: {},
    setError: (type, message) => {
        errors.errors[type] = message;
        const el = document.getElementById(`error_${type}`);
        if (!el) {
            return;
        }
        el.textContent = message;
        errors.hasErrors = true;
    },
    removeErrors: () => {
        Object.keys(errors.errors).forEach(key => {
            if (errors[key]) {
                const el = document.getElementById(`error_${key}`);
                if (!el) {
                    return;
                }
                el.innerText = '';
            }
        });
        errors.errors = {};
        errors.hasErrors = false;
    }
}

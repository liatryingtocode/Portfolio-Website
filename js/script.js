const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
let messageForm;
let currentTimeElement;

document.addEventListener('DOMContentLoaded', function() {
    messageForm = document.getElementById('messageForm');
    currentTimeElement = document.getElementById('currentTime');

    setUserName();

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    setupNavigation();

    setupFormValidation();
});

// Set user name 
function setUserName() {
    const userName = document.getElementById('userName');
    userName.textContent = 'User';
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta',
        timeZoneName: 'short'
    };
    currentTimeElement.textContent = now.toLocaleDateString('id-ID', options);
}

// Setup navigation
function setupNavigation() {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const birthdateInput = document.getElementById('birthdate');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const messageInput = document.getElementById('messageText');

    nameInput.addEventListener('blur', () => validateField('name'));
    emailInput.addEventListener('blur', () => validateField('email'));
    birthdateInput.addEventListener('blur', () => validateField('birthdate'));
    messageInput.addEventListener('blur', () => validateField('message'));
    
    genderInputs.forEach(input => {
        input.addEventListener('change', () => validateField('gender'));
    });

    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        if (validateForm()) {
            console.log('Form is valid, displaying data...');
            displayFormData();
            showSuccessMessage();
        } else {
            console.log('Form validation failed');
        }
    });
}

function validateField(fieldName) {
    let field;
    if (fieldName === 'message') {
        field = document.getElementById('messageText');
    } else if (fieldName === 'gender') {
        field = document.querySelector('input[name="gender"]:checked');
    } else {
        field = document.getElementById(fieldName);
    }
    
    const errorElement = document.getElementById(`${fieldName}Error`);
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'name':
            if (!field.value.trim()) {
                errorMessage = 'Nama harus diisi';
                isValid = false;
            } else if (field.value.trim().length < 2) {
                errorMessage = 'Nama minimal 2 karakter';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(field.value.trim())) {
                errorMessage = 'Nama hanya boleh berisi huruf dan spasi';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                errorMessage = 'Email harus diisi';
                isValid = false;
            } else if (!emailRegex.test(field.value.trim())) {
                errorMessage = 'Format email tidak valid';
                isValid = false;
            }
            break;
            
        case 'birthdate':
            if (!field.value) {
                errorMessage = 'Tanggal lahir harus diisi';
                isValid = false;
            } else {
                const birthDate = new Date(field.value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                
                if (birthDate > today) {
                    errorMessage = 'Tanggal lahir tidak boleh di masa depan';
                    isValid = false;
                } else if (age < 10) {
                    errorMessage = 'Umur minimal 10 tahun';
                    isValid = false;
                } else if (age > 100) {
                    errorMessage = 'Umur maksimal 100 tahun';
                    isValid = false;
                }
            }
            break;
            
        case 'gender':
            const selectedGender = document.querySelector('input[name="gender"]:checked');
            if (!selectedGender) {
                errorMessage = 'Jenis kelamin harus dipilih';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!field.value.trim()) {
                errorMessage = 'Pesan harus diisi';
                isValid = false;
            } else if (field.value.trim().length < 10) {
                errorMessage = 'Pesan minimal 10 karakter';
                isValid = false;
            }
            break;
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = errorMessage ? 'block' : 'none';
    }
    
    return isValid;
}

function validateForm() {
    const fields = ['name', 'email', 'birthdate', 'gender', 'message'];
    let isFormValid = true;
    
    fields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Display form 
function displayFormData() {
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        birthdate: document.getElementById('birthdate').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        message: document.getElementById('messageText').value.trim()
    };
    
    console.log('Form data:', formData); 
    
    document.getElementById('displayName').textContent = formData.name;
    document.getElementById('displayEmail').textContent = formData.email;
    document.getElementById('displayBirthdate').textContent = formatDate(formData.birthdate);
    document.getElementById('displayGender').textContent = formData.gender;
    document.getElementById('displayMessage').textContent = formData.message;

    document.getElementById('userName').textContent = formData.name;
    
    console.log('Data displayed successfully');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    };
    return date.toLocaleDateString('id-ID', options);
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    successMessage.textContent = 'Pesan berhasil dikirim!';
    
    if (!document.getElementById('successAnimation')) {
        const style = document.createElement('style');
        style.id = 'successAnimation';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 3000);
}

function clearForm() {

    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '';
            const errorElement = document.getElementById(`${this.name}Error`);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
});

function formatPhoneNumber(value) {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length >= 10) {
        return phoneNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phoneNumber;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #93c5fd, #c4b5fd);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(20px)';
        }
    });
});

function showLoadingAnimation() {
    const submitButton = document.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Mengirim...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1000);
}
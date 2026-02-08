// Matrix Rain Effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for(let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975)
            drops[i] = 0;

        drops[i]++;
    }
}

setInterval(draw, 30);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Modal Logic
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('access-modal');
    const followBtn = document.getElementById('followBtn');
    const channelUrl = 'https://whatsapp.com/channel/0029VbCbFU89Gv7VdJLDay0o';

    if (modal && followBtn) {
        // Ensure modal is visible on load (it is by default in CSS, but good to be explicit if needed)
        // modal.style.display = 'flex'; 
        
        followBtn.addEventListener('click', function() {
            window.open(channelUrl, '_blank');
            modal.style.display = 'none'; // Unlock after clicking
        });
    }
});

document.getElementById('searchBtn').addEventListener('click', fetchData);
document.getElementById('phoneNumber').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchData();
    }
});

function fetchData() {
    const numberInput = document.getElementById('phoneNumber').value.trim();
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    if (!numberInput) {
        alert('PLEASE ENTER A NUMBER');
        return;
    }

    // Show loading, hide result
    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';

    // Use corsproxy.io which is often more reliable for this type of request
    const targetUrl = `https://amscript.xyz/PublicApi/Siminfo.php?number=${numberInput}`;
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('NETWORK RESPONSE WAS NOT OK');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            displayData(data);
        })
        .catch(error => {
            console.error('Error:', error);
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = `<p style="color: red;">ERROR: CONNECTION FAILED OR BLOCKED BY CORS.<br>SYSTEM MESSAGE: ${error.message}</p>`;
        });
}

function displayData(data) {
    const resultDiv = document.getElementById('result');
    
    // Check for explicit success: false
    if (data.success === false) {
        resultDiv.innerHTML = `<p style="color: red;">${data.message || 'NO RECORD FOUND'}</p>`;
        return;
    }

    // If data contains a "data" property which is an array (common pattern), use that
    let records = [];
    if (Array.isArray(data)) {
        records = data;
    } else if (data.data && Array.isArray(data.data)) {
        records = data.data;
    } else {
        // If it's a single object (and not just a wrapper with success:true)
        records = [data];
    }

    if (records.length === 0) {
        resultDiv.innerHTML = '<p>NO RECORD FOUND IN DATABASE.</p>';
        return;
    }

    let htmlContent = '<h3>SEARCH RESULTS:</h3>';

    records.forEach((record, index) => {
        htmlContent += `<div class="record-block" style="margin-bottom: 20px; border: 1px solid #0f0; padding: 10px;">
            <h4>RECORD #${index + 1}</h4>`;
        
        for (const [key, value] of Object.entries(record)) {
            // Filter out internal status keys if necessary, or just show everything
            htmlContent += `
                <div class="data-row">
                    <span class="label">${key.toUpperCase()}:</span>
                    <span class="value">${value}</span>
                </div>
            `;
        }
        htmlContent += '</div>';
    });

    resultDiv.innerHTML = htmlContent;
}
const https = require('https');
const fs = require('fs');

const apiKey = 'AIzaSyC_oMgDNR5OXxCtitsFFpUYH8vdeEBo3pk';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            let output = 'Available Models:\n';
            if (json.models) {
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        output += `- ${m.name}\n`;
                    }
                });
            } else {
                output += 'No models found or error: ' + JSON.stringify(json);
            }
            fs.writeFileSync('models_list.txt', output);
            console.log('Models written to models_list.txt');
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (e) => {
    console.error('Error:', e);
});

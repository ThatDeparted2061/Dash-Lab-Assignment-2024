const { exec } = require('child_process');
const fs = require('fs');

// Function to read input.txt file
function readPromptsFromFile() {
    return fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean);
}

// Function to split prompts between clients
function splitPrompts(prompts) {
    const mid = Math.ceil(prompts.length / 2);
    return {
        client1Prompts: prompts.slice(0, mid),
        client2Prompts: prompts.slice(mid)
    };
}

// Function to save prompts to files for each client
function savePromptsToFile(clientPrompts, clientID) {
    const fileName = `prompts_${clientID}.txt`;
    fs.writeFileSync(fileName, clientPrompts.join('\n'), 'utf-8');
    return fileName;
}

// Main function
function main() {
    const prompts = readPromptsFromFile();
    const { client1Prompts, client2Prompts } = splitPrompts(prompts);

    const client1File = savePromptsToFile(client1Prompts, 'client1');
    const client2File = savePromptsToFile(client2Prompts, 'client2');

    // Execute client scripts with their respective prompt files
    exec(`node client.js ${client1File} client1`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing client1.js: ${error.message}`);
            return;
        }
        console.log(stdout);
    });

    exec(`node client.js ${client2File} client2`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing client2.js: ${error.message}`);
            return;
        }
        console.log(stdout);
    });
}

main();

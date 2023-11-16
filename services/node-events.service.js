import { EventEmitter } from 'events';
import fs from 'fs';

const nodeEventEmitter = new EventEmitter();

nodeEventEmitter.on('delete-file-from-server', async function (filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        console.log(`Node event error ${error.stack}`);
    }
});

export { nodeEventEmitter };

import { opendir } from 'fs/promises';

const interval = 5000; // wait 5 seconds between scans

const FileWatcher = async () => {
    const scanDir = async () => {
        console.log('Checking for new files.');

        try {
            const dir = await opendir('./');
    
            for await (const dirent of dir) {
                console.log('New file found.', dirent.name);
            }
        } catch (err) {
            console.error('Error while checking for new files.', err);
        }

        console.log(`Done checking. Waiting for ${interval} milliseconds.`);
        setTimeout(scanDir, interval);
    }

    scanDir();
};

// export default FileWatcher;
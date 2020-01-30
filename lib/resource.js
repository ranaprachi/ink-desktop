import * as md5 from 'md5-file/promise';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { ParserManager } from './parser';
import * as path from 'path';

export async function manageResource(projDir) {
    let resDir = path.join(projDir, 'resources/');
    if (!existsSync(resDir)) {
        mkdirSync(resDir);
    }
    let parser = await ParserManager.getInstance(projDir);
    let sourceList = parser.getResources();
    let modified = []
    for (let originalResource of sourceList) {
        originalResource = path.join('/', originalResource);
        if (!existsSync(originalResource)) {
            // TODO: Throw Error? Handle on originalResource not available locally.
            continue;
        }
        let localResource = path.join(resDir, path.parse(originalResource).base);
        if (localResource == originalResource) continue;
        if (!existsSync(localResource)) {
           copyFileSync(originalResource, localResource);
           modified.push(localResource);
        } else {
            let hashOriginal = await md5(originalResource);
            let hashLocal = await md5(localResource);
            if (hashLocal != hashOriginal) {
                copyFileSync(originalResource, localResource);
                modified.push(localResource);
            }
        }
    }
    parser.changeResource(resDir);
    return modified;
}          
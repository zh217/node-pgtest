import chokidar, {FSWatcher} from 'chokidar';
import EventEmitter from 'events';

export class FileWatcher extends EventEmitter {
    watcher: FSWatcher;

    private changedFiles: Set<string> = new Set();

    constructor(readonly baseDir: string, readonly pattern: RegExp) {
        super();
        this.watcher = chokidar.watch(baseDir);
        this.watcher.on('add', this.onWatcherEvent.bind(this))
        this.watcher.on('change', this.onWatcherEvent.bind(this))
        this.watcher.on('unlink', this.onWatcherEvent.bind(this))
    }

    private onWatcherEvent(path: string) {
        if (this.pattern.test(path)) {
            this.changedFiles.add(path);
            this.emit('changed');
        }
    }

    flush() {
        const ret = new Set(this.changedFiles);
        this.changedFiles.clear();
        return ret;
    }

}
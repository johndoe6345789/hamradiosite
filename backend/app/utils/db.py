import json
import threading
from pathlib import Path


class JsonDatabase:
    """Thread-safe JSON file database with file locking."""

    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._locks = {}
        self._lock_lock = threading.Lock()

    def _get_lock(self, collection):
        with self._lock_lock:
            if collection not in self._locks:
                self._locks[collection] = threading.Lock()
            return self._locks[collection]

    def _get_path(self, collection):
        return self.data_dir / f"{collection}.json"

    def read(self, collection):
        """Read all records from a collection."""
        path = self._get_path(collection)
        lock = self._get_lock(collection)
        with lock:
            if not path.exists():
                return []
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)

    def write(self, collection, data):
        """Write all records to a collection (full replace)."""
        path = self._get_path(collection)
        lock = self._get_lock(collection)
        # Write to temp file then rename for atomicity
        tmp_path = path.with_suffix('.tmp')
        with lock:
            with open(tmp_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            tmp_path.replace(path)

    def find(self, collection, predicate):
        """Find records matching a predicate function."""
        records = self.read(collection)
        return [r for r in records if predicate(r)]

    def find_one(self, collection, predicate):
        """Find first record matching a predicate."""
        records = self.read(collection)
        for r in records:
            if predicate(r):
                return r
        return None

    def insert(self, collection, record):
        """Insert a single record. Returns the record."""
        lock = self._get_lock(collection)
        with lock:
            path = self._get_path(collection)
            if path.exists():
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            else:
                data = []
            data.append(record)
            tmp_path = path.with_suffix('.tmp')
            with open(tmp_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            tmp_path.replace(path)
        return record

    def update(self, collection, predicate, updates):
        """Update records matching predicate with the updates dict."""
        lock = self._get_lock(collection)
        with lock:
            path = self._get_path(collection)
            if not path.exists():
                return 0
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            count = 0
            for record in data:
                if predicate(record):
                    record.update(updates)
                    count += 1
            if count > 0:
                tmp_path = path.with_suffix('.tmp')
                with open(tmp_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                tmp_path.replace(path)
        return count

    def delete(self, collection, predicate):
        """Delete records matching predicate. Returns count deleted."""
        lock = self._get_lock(collection)
        with lock:
            path = self._get_path(collection)
            if not path.exists():
                return 0
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            original_len = len(data)
            data = [r for r in data if not predicate(r)]
            deleted = original_len - len(data)
            if deleted > 0:
                tmp_path = path.with_suffix('.tmp')
                with open(tmp_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                tmp_path.replace(path)
        return deleted

    def clear(self, collection):
        """Clear all records from a collection."""
        path = self._get_path(collection)
        lock = self._get_lock(collection)
        with lock:
            if path.exists():
                path.unlink()

    def clear_all(self):
        """Clear all collections."""
        for path in self.data_dir.glob('*.json'):
            path.unlink()


# Global database instance, initialized in create_app
db = None


def init_db(app):
    """Initialize the database with the app's data directory."""
    global db
    db = JsonDatabase(app.config['DATA_DIR'])
    return db


def get_db():
    """Get the database instance."""
    return db

import tempfile
from app.utils.db import JsonDatabase


def test_read_empty():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        assert db.read("nonexistent") == []


def test_insert_and_read():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.insert("test", {"id": "1", "name": "Alice"})
        db.insert("test", {"id": "2", "name": "Bob"})
        records = db.read("test")
        assert len(records) == 2
        assert records[0]["name"] == "Alice"


def test_write_and_read():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("test", [{"id": "1"}, {"id": "2"}])
        assert len(db.read("test")) == 2


def test_find():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("test", [
            {"id": "1", "type": "a"},
            {"id": "2", "type": "b"},
            {"id": "3", "type": "a"},
        ])
        results = db.find("test", lambda r: r["type"] == "a")
        assert len(results) == 2


def test_find_one():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("test", [
            {"id": "1", "name": "Alice"},
            {"id": "2", "name": "Bob"},
        ])
        result = db.find_one("test", lambda r: r["name"] == "Bob")
        assert result["id"] == "2"
        assert db.find_one("test", lambda r: r["name"] == "Eve") is None


def test_update():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("test", [
            {"id": "1", "status": "active"},
            {"id": "2", "status": "active"},
        ])
        count = db.update("test", lambda r: r["id"] == "1", {"status": "inactive"})
        assert count == 1
        r = db.find_one("test", lambda r: r["id"] == "1")
        assert r["status"] == "inactive"


def test_update_nonexistent():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        count = db.update("test", lambda r: r["id"] == "1", {"status": "x"})
        assert count == 0


def test_delete():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("test", [{"id": "1"}, {"id": "2"}, {"id": "3"}])
        count = db.delete("test", lambda r: r["id"] == "2")
        assert count == 1
        assert len(db.read("test")) == 2


def test_delete_nonexistent():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        count = db.delete("test", lambda r: r["id"] == "99")
        assert count == 0


def test_clear():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("test", [{"id": "1"}])
        db.clear("test")
        assert db.read("test") == []


def test_clear_nonexistent():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.clear("nonexistent")  # Should not raise


def test_clear_all():
    with tempfile.TemporaryDirectory() as tmpdir:
        db = JsonDatabase(tmpdir)
        db.write("a", [{"id": "1"}])
        db.write("b", [{"id": "2"}])
        db.clear_all()
        assert db.read("a") == []
        assert db.read("b") == []

from app import app
from database import db
from models import Dataset

import pytest

@pytest.mark.usefixtures("flask_init")
class TestModels:
    def test_dataset(self):
        with app.app_context():
            instance = Dataset(name='test dataset!')
            db.session.add(instance)
            db.session.commit()
            assert hasattr(instance, 'id')
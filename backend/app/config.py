import os
from datetime import timedelta


class BaseConfig:
    JWT_SECRET_KEY = os.environ.get(
        'JWT_SECRET_KEY', 'dev-secret-key-change-in-production'
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    DATA_DIR = os.environ.get(
        'DATA_DIR',
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    )


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class TestingConfig(BaseConfig):
    TESTING = True
    JWT_SECRET_KEY = 'test-secret-key'


class ProductionConfig(BaseConfig):
    pass


config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
}

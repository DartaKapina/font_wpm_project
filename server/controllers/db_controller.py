from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker
from models.typing_result import Base, TypingResult
from models.text_settings import TextSettings
import os
from datetime import datetime, timedelta


class DatabaseController:
    def __init__(self):
        # Create the data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)

        # Use SQLite database in the data directory
        database_url = 'sqlite:///data/typing_test.db?check_same_thread=False'
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def get_random_text(self):
        return "Hello, world!"

    def get_random_text_settings(self):
        return TextSettings.generate_random_settings()

    def save_result(self, typing_result: TypingResult):
        self.session.add(typing_result)
        self.session.commit()
        return typing_result.to_dict()

    def get_leaderboard(self, time_range: str = 'all', limit: int = 10):
        query = self.session.query(TypingResult)

        if time_range == 'day':
            cutoff = datetime.utcnow() - timedelta(days=1)
            query = query.filter(TypingResult.timestamp >= cutoff)
        elif time_range == 'week':
            cutoff = datetime.utcnow() - timedelta(weeks=1)
            query = query.filter(TypingResult.timestamp >= cutoff)
        elif time_range == 'month':
            cutoff = datetime.utcnow() - timedelta(days=30)
            query = query.filter(TypingResult.timestamp >= cutoff)

        results = query.order_by(desc(TypingResult.wpm)).limit(limit).all()
        return [result.to_dict() for result in results]

    def get_session_stats(self, id: int):
        result = self.session.query(TypingResult).filter(
            TypingResult.id == id
        ).first()
        if not result:
            return None

        return {
            'user_id': result.user_id,
            'wpm': result.wpm,
            'accuracy': result.accuracy,
            'text_length': result.text_length,
            'time_limit': result.time_limit,
            'key_data': result.key_data
        }

    def get_result(self, result_id: int):
        result = self.session.query(TypingResult).get(result_id)

        if result is None:
            return None
        return result.to_dict()

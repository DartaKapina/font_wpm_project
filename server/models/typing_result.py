from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class TypingResult(Base):
    __tablename__ = 'typing_results'

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    time_limit = Column(Integer, nullable=False)
    wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    text_length = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    key_data = Column(JSON, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'time_limit': self.time_limit,
            'wpm': self.wpm,
            'accuracy': self.accuracy,
            'text_length': self.text_length,
            'timestamp': self.timestamp.isoformat(),
            'key_data': self.key_data
        }

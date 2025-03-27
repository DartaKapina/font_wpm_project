from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class TextEntry(Base):
    __tablename__ = 'text_entries'

    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    source = Column(String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'source': self.source
        }

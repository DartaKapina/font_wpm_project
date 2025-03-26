from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
import random
import json
import os

Base = declarative_base()


class TextSettings(Base):
    __tablename__ = 'text_settings'

    id = Column(Integer, primary_key=True)
    font_family = Column(String, nullable=False)
    font_size = Column(String, nullable=False)
    font_weight = Column(String, nullable=False)
    font_style = Column(String, nullable=False)
    text_opacity = Column(Float, nullable=False)
    line_height = Column(Float, nullable=False)
    color = Column(String, nullable=False)
    background_color = Column(String, nullable=False)
    letter_spacing = Column(Float, nullable=False)
    word_spacing = Column(Float, nullable=False)
    text_align = Column(String, nullable=False)

    @staticmethod
    def load_settings_config():
        config_path = os.path.join(os.path.dirname(
            __file__), '../config/text_settings.json')
        with open(config_path, 'r') as f:
            return json.load(f)

    @staticmethod
    def generate_random_value(param_config):
        if param_config['type'] == 'choice':
            return random.choice(param_config['values'])
        elif param_config['type'] == 'range':
            value = random.uniform(param_config['min'], param_config['max'])
            return round(value, param_config['decimals'])
        return None

    @staticmethod
    def generate_random_settings():
        config = TextSettings.load_settings_config()
        settings = {}

        for param_name, param_config in config.items():
            settings[param_name] = TextSettings.generate_random_value(
                param_config)

        return settings

    def to_dict(self):
        return {
            "id": self.id,
            "fontFamily": self.font_family,
            "fontSize": self.font_size,
            "fontWeight": self.font_weight,
            "fontStyle": self.font_style,
            "textOpacity": self.text_opacity,
            "lineHeight": self.line_height,
            "color": self.color,
            "backgroundColor": self.background_color,
            "letterSpacing": self.letter_spacing,
            "wordSpacing": self.word_spacing,
            "textAlign": self.text_align
        }

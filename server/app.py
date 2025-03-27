from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.db_controller import DatabaseController
from dotenv import load_dotenv
from models.typing_result import TypingResult
load_dotenv()

app = Flask(__name__)
CORS(app)

db = DatabaseController()


@app.route('/api/start-test', methods=['GET'])
def start_test():
    text = db.get_random_text()
    print(text)
    text_settings = db.get_random_text_settings()
    return jsonify({'text': text, 'textSettings': text_settings}), 200


@app.route('/api/typing-result', methods=['POST'])
def save_typing_result():
    data = request.json
    required_fields = ['user_id', 'wpm',
                       'accuracy', 'text_length',
                       'key_data', 'time_taken']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        typing_result = TypingResult(
            user_id=data['user_id'],
            wpm=float(data['wpm']),
            accuracy=float(data['accuracy']),
            text_length=int(data['text_length']),
            key_data=data['key_data'],
            time_taken=int(data['time_taken'])
        )
        result = db.save_result(typing_result)
        return jsonify({'id': result['id']}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/typing-result/<int:result_id>', methods=['GET'])
def get_typing_result(result_id):
    try:
        result = db.get_result(result_id)
        if result is None:
            return jsonify({'error': 'Result not found'}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    time_range = request.args.get('timeRange', 'all')
    limit = request.args.get('limit', 10, type=int)

    if time_range not in ['all', 'day', 'week', 'month']:
        return jsonify({'error': 'Invalid time range'}), 400

    try:
        results = db.get_leaderboard(time_range, limit)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/session-stats/<id>', methods=['GET'])
def get_session_stats(id):
    try:
        stats = db.get_session_stats(id)
        if stats is None:
            return jsonify({'error': 'Session not found'}), 404
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run()

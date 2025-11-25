from flask import jsonify

def handler(request):
    return jsonify({
        'status': 'API is running',
        'message': 'FarmLive Disease Detection API',
        'endpoints': {
            'health': '/api/health',
            'predict': '/api/predict (POST with image)'
        }
    })

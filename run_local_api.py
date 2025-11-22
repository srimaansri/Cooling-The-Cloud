"""
Local development server for API testing
Runs the Vercel API function locally on port 5000
"""
import sys
sys.path.insert(0, 'api')

from api.index import app

if __name__ == '__main__':
    print("Starting local API server on http://localhost:5001")
    print("API endpoints available:")
    print("  - GET  /api/health")
    print("  - POST /api/optimize")
    print("  - GET  /api/stats")
    print("  - GET  /api/history")
    print("  - GET  /api/period-summary")
    print("  - GET  /api/monthly-breakdown")
    print("  - GET  /api/daily-trends")
    print("  - GET  /api/real-time-data")
    print("\nPress Ctrl+C to stop\n")

    app.run(host='0.0.0.0', port=5001, debug=True)

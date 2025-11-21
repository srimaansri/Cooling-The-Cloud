"""
Flask API Server for Cooling The Cloud
Provides REST API endpoints for React frontend
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from model.optimizer_linear import LinearDataCenterOptimizer
from model.data_interface import DataInterface
from data.supabase_interface import SupabaseInterface
from data.api.store_to_postgres import connect_db

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize interfaces
data_interface = DataInterface(use_supabase=True)
supabase = SupabaseInterface()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'supabase_connected': supabase.test_connection()
    })


@app.route('/api/optimize', methods=['POST'])
def run_optimization():
    """Run optimization with specified parameters."""
    try:
        data = request.json
        date_str = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        use_real_data = data.get('use_real_data', True)
        capacity_mw = data.get('capacity_mw', 2000)  # Default 2000MW for Arizona

        print(f"📊 Running optimization with capacity: {capacity_mw}MW, date: {date_str}")

        # Parse date
        if isinstance(date_str, str):
            target_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            target_date = datetime.now()

        # Initialize optimizer with custom capacity
        print(f"🔧 Initializing optimizer with {capacity_mw}MW capacity...")
        optimizer = LinearDataCenterOptimizer(
            use_supabase=use_real_data,
            capacity_mw=capacity_mw
        )

        if use_real_data:
            # Use real data from Supabase
            print("📡 Fetching real data from Supabase...")
            results = optimizer.optimize_with_supabase(date=target_date, solver_name='highs')
        else:
            # Use demo data
            print("📊 Using demo data...")
            opt_data = data_interface.prepare_optimization_data(
                date=target_date,
                use_supabase=False
            )
            temperatures, prices, _ = data_interface.export_to_model_format(opt_data)
            model = optimizer.build_model(temperatures, prices)
            results = optimizer.solve(solver_name='highs')

        if results:
            # Add metadata
            results['optimization_date'] = date_str
            results['data_source'] = 'supabase' if use_real_data else 'demo'

            print("✅ Optimization successful!")
            return jsonify({
                'success': True,
                'results': {
                    'summary': results['summary'],
                    'savings': results['savings'],
                    'environmental': results['environmental'],
                    'hourly_data': results['hourly_data'],
                    'metadata': {
                        'date': date_str,
                        'source': results['data_source'],
                        'run_id': results.get('run_id'),
                        'capacity_mw': capacity_mw
                    }
                }
            })
        else:
            print("❌ Optimization returned no results")
            return jsonify({
                'success': False,
                'error': 'Optimization failed - no results returned'
            }), 500

    except Exception as e:
        import traceback
        print(f"❌ Error in optimization: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e),
            'details': traceback.format_exc()
        }), 500


@app.route('/api/history', methods=['GET'])
def get_history():
    """Get optimization history."""
    try:
        limit = request.args.get('limit', 10, type=int)
        history_df = supabase.get_optimization_history(limit=limit)

        if not history_df.empty:
            history = history_df.to_dict('records')
            # Convert timestamps to strings
            for record in history:
                if 'run_timestamp' in record:
                    record['run_timestamp'] = str(record['run_timestamp'])

            return jsonify({
                'success': True,
                'history': history
            })
        else:
            return jsonify({
                'success': True,
                'history': []
            })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/period-summary', methods=['GET'])
def get_period_summary():
    """Get period summary statistics."""
    try:
        days = request.args.get('days', 30, type=int)
        summary = supabase.get_period_summary(days)

        return jsonify({
            'success': True,
            'summary': summary
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/monthly-breakdown', methods=['GET'])
def get_monthly_breakdown():
    """Get monthly breakdown."""
    try:
        months = request.args.get('months', 6, type=int)
        breakdown_df = supabase.get_monthly_breakdown(months)

        if not breakdown_df.empty:
            breakdown = breakdown_df.to_dict('records')
            # Convert timestamps to strings
            for record in breakdown:
                if 'month' in record:
                    record['month'] = str(record['month'])

            return jsonify({
                'success': True,
                'breakdown': breakdown
            })
        else:
            return jsonify({
                'success': True,
                'breakdown': []
            })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/daily-trends', methods=['GET'])
def get_daily_trends():
    """Get daily trends data."""
    try:
        days = request.args.get('days', 30, type=int)
        trends = supabase.get_daily_trends(days)

        # Convert dates to strings
        if 'dates' in trends:
            trends['dates'] = [str(d) for d in trends['dates']]

        return jsonify({
            'success': True,
            'trends': trends
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/real-time-data', methods=['GET'])
def get_real_time_data():
    """Get current temperature and price data."""
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        target_date = datetime.strptime(date_str, '%Y-%m-%d')

        # Get weather and price data
        temperatures = supabase.fetch_weather_data(target_date, hours=24)
        prices = supabase.get_electricity_prices(target_date, hours=24)
        water_prices = supabase.get_water_prices(target_date)

        return jsonify({
            'success': True,
            'data': {
                'temperatures': temperatures,
                'electricity_prices': prices,
                'water_prices': water_prices,
                'metadata': {
                    'date': date_str,
                    'max_temp': max(temperatures),
                    'min_temp': min(temperatures),
                    'avg_price': sum(prices) / len(prices),
                    'peak_price': max(prices),
                    'off_peak_price': min(prices)
                }
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall system statistics."""
    try:
        # Get various statistics
        last_30_days = supabase.get_period_summary(30)
        last_year = supabase.get_period_summary(365)

        # Get database stats
        conn = connect_db()
        cur = conn.cursor()

        # Count total records
        cur.execute("SELECT COUNT(*) FROM eia_interchange WHERE fromba IN ('AZPS', 'SRP', 'TEPC') OR toba IN ('AZPS', 'SRP', 'TEPC')")
        total_records = cur.fetchone()[0]

        # Count optimization runs
        cur.execute("SELECT COUNT(*) FROM optimization_summary")
        total_runs = cur.fetchone()[0]

        cur.close()
        conn.close()

        return jsonify({
            'success': True,
            'stats': {
                'total_records': total_records,
                'total_optimization_runs': total_runs,
                'last_30_days_savings': last_30_days.get('total_savings', 0),
                'last_year_savings': last_year.get('total_savings', 0),
                'avg_daily_savings': last_30_days.get('avg_daily_savings', 0),
                'avg_savings_percent': last_30_days.get('avg_savings_percent', 0)
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 Starting Cooling The Cloud API Server...")
    print("📡 API running at http://localhost:5000")
    print("🔗 Connect React app to this API")
    app.run(debug=True, port=5000)
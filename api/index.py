"""
Vercel Serverless Function for API
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
from datetime import datetime, timedelta
import random

# Try to import model modules (may fail on Vercel)
try:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from model.optimizer_linear import LinearDataCenterOptimizer
    from model.data_interface import DataInterface
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'API running on Vercel'
    })

@app.route('/api/optimize', methods=['POST', 'OPTIONS'])
def run_optimization():
    """Run optimization with demo data."""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # If model available, run real optimization
        if MODEL_AVAILABLE:
            optimizer = LinearDataCenterOptimizer(use_supabase=False, capacity_mw=2000)
            data_interface = DataInterface(use_supabase=False)
            opt_data = data_interface.prepare_optimization_data(use_supabase=False)
            temperatures, prices, _ = data_interface.export_to_model_format(opt_data)
            model = optimizer.build_model(temperatures, prices)
            results = optimizer.solve(solver_name='highs')

            if results:
                return jsonify({
                    'success': True,
                    'results': {
                        'summary': results['summary'],
                        'savings': results['savings'],
                        'environmental': results['environmental'],
                        'hourly_data': results['hourly_data'],
                        'metadata': {
                            'source': 'demo',
                            'capacity_mw': 2000
                        }
                    }
                })

        # Fallback: return pre-computed demo results
        demo_hourly = []
        for h in range(24):
            temp = 75 + 25 * (0.5 + 0.5 * (1 if 10 <= h <= 18 else 0))
            price = 0.03 if h < 6 else (0.15 if 15 <= h <= 20 else 0.05)
            demo_hourly.append({
                'hour': h,
                'temperature_f': round(temp, 1),
                'electricity_price': price,
                'load_mw': round(1500 + random.uniform(-100, 100), 1),
                'cooling_mode': 'water' if temp > 90 else 'electric',
                'cost': round(price * 1500, 2)
            })

        return jsonify({
            'success': True,
            'results': {
                'summary': {
                    'total_cost': 125000.50,
                    'electricity_cost': 115000.00,
                    'water_cost': 10000.50,
                    'peak_demand_mw': 1800
                },
                'savings': {
                    'daily_savings': 15000.00,
                    'annual_savings': 5475000.00,
                    'percentage_saved': 12.6
                },
                'environmental': {
                    'water_used_gallons': 50000,
                    'water_saved_gallons': 150000,
                    'peak_reduction_mw': 200,
                    'carbon_avoided_tons': 45.5
                },
                'hourly_data': demo_hourly,
                'metadata': {
                    'source': 'demo_fallback',
                    'capacity_mw': 2000
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
    """Get system statistics with demo data."""
    try:
        return jsonify({
            'success': True,
            'stats': {
                'total_capacity_mw': 2000,
                'active_servers': 8450,
                'total_servers': 10000,
                'current_load_mw': 1650,
                'efficiency_rating': 95.2,
                'uptime_percentage': 99.98,
                'avg_temperature_f': 92.5,
                'water_usage_gallons': 125000,
                'current_cooling_mode': 'hybrid',
                'peak_demand_today_mw': 1850,
                'off_peak_utilization': 72.3,
                'last_updated': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get optimization history with demo data."""
    try:
        limit = int(request.args.get('limit', 10))

        history = []
        base_date = datetime.now()

        for i in range(limit):
            run_date = base_date - timedelta(days=i)
            history.append({
                'id': f'opt_{i+1}',
                'timestamp': run_date.isoformat(),
                'date': run_date.strftime('%Y-%m-%d'),
                'total_cost': round(185000 - random.uniform(5000, 15000), 2),
                'electricity_cost': round(145000 - random.uniform(3000, 10000), 2),
                'water_cost': round(40000 - random.uniform(2000, 5000), 2),
                'total_savings': round(12000 + random.uniform(1000, 5000), 2),
                'water_usage_gallons': round(120000 + random.uniform(-10000, 10000), 2),
                'peak_load_shifted_mw': round(15 + random.uniform(-3, 5), 2),
                'optimization_time_sec': round(random.uniform(2.5, 8.5), 2),
                'solver': 'highs',
                'status': 'optimal'
            })

        return jsonify({
            'success': True,
            'history': history,
            'total_count': limit
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/period-summary', methods=['GET'])
def get_period_summary():
    """Get period summary with demo data."""
    try:
        days = int(request.args.get('days', 30))

        summary = {
            'period_days': days,
            'start_date': (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d'),
            'end_date': datetime.now().strftime('%Y-%m-%d'),
            'total_cost': round(5500000 - random.uniform(100000, 300000), 2),
            'total_savings': round(380000 + random.uniform(50000, 100000), 2),
            'avg_daily_cost': round(183000 - random.uniform(5000, 10000), 2),
            'total_water_usage_gallons': round(3600000 + random.uniform(-200000, 200000), 2),
            'total_electricity_kwh': round(72000000 + random.uniform(-2000000, 2000000), 2),
            'peak_demand_reduction_mw': round(18 + random.uniform(-2, 4), 2),
            'avg_efficiency_percent': round(94.5 + random.uniform(-1, 2), 2),
            'optimization_runs': days,
            'successful_runs': days - random.randint(0, 2)
        }

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
    """Get monthly breakdown with demo data."""
    try:
        months = int(request.args.get('months', 6))

        breakdown = []
        base_date = datetime.now()

        for i in range(months):
            month_date = base_date - timedelta(days=30*i)
            breakdown.append({
                'month': month_date.strftime('%Y-%m'),
                'month_name': month_date.strftime('%B %Y'),
                'total_cost': round(5500000 - random.uniform(200000, 500000), 2),
                'electricity_cost': round(4300000 - random.uniform(150000, 350000), 2),
                'water_cost': round(1200000 - random.uniform(50000, 150000), 2),
                'total_savings': round(420000 + random.uniform(50000, 100000), 2),
                'water_usage_gallons': round(3600000 + random.uniform(-300000, 300000), 2),
                'electricity_kwh': round(86000000 + random.uniform(-5000000, 5000000), 2),
                'avg_temperature_f': round(85 + random.uniform(-10, 20), 1),
                'peak_load_shifted_mw': round(16 + random.uniform(-3, 6), 2),
                'optimization_runs': 30 - random.randint(0, 2)
            })

        return jsonify({
            'success': True,
            'breakdown': breakdown,
            'total_months': months
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/daily-trends', methods=['GET'])
def get_daily_trends():
    """Get daily trends with demo data."""
    try:
        days = int(request.args.get('days', 30))

        trends = []
        base_date = datetime.now()

        for i in range(days):
            day_date = base_date - timedelta(days=days-i-1)
            trends.append({
                'date': day_date.strftime('%Y-%m-%d'),
                'day_name': day_date.strftime('%A'),
                'total_cost': round(183000 - random.uniform(5000, 15000), 2),
                'electricity_cost': round(143000 - random.uniform(4000, 12000), 2),
                'water_cost': round(40000 - random.uniform(1000, 3000), 2),
                'savings': round(13000 + random.uniform(1000, 5000), 2),
                'water_usage_gallons': round(120000 + random.uniform(-10000, 15000), 2),
                'peak_load_mw': round(1850 + random.uniform(-100, 200), 2),
                'off_peak_load_mw': round(1200 + random.uniform(-50, 100), 2),
                'avg_temperature_f': round(90 + random.uniform(-10, 15), 1),
                'efficiency_percent': round(94.5 + random.uniform(-2, 3), 2)
            })

        return jsonify({
            'success': True,
            'trends': trends,
            'total_days': days
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/real-time-data', methods=['GET'])
def get_real_time_data():
    """Get real-time monitoring data with demo data."""
    try:
        # Get current hour data
        current_hour = datetime.now().hour

        # Generate hourly data for today
        hourly_data = []
        for hour in range(24):
            # Simulate temperature pattern (cooler at night, hotter in afternoon)
            temp_base = 75 if hour < 6 or hour > 20 else 95
            temp_variation = 15 * abs((hour - 14) / 10) if 6 <= hour <= 20 else 0
            temperature = round(temp_base + temp_variation + random.uniform(-3, 3), 1)

            # Simulate load pattern (higher during day)
            load_factor = 0.9 if 8 <= hour <= 18 else 0.6
            load = round(1500 * load_factor + random.uniform(-50, 100), 2)

            # Electricity price (peak 3-8 PM)
            if 15 <= hour <= 20:
                price = 0.15
            elif 22 <= hour or hour <= 6:
                price = 0.03
            else:
                price = 0.05

            hourly_data.append({
                'hour': hour,
                'timestamp': datetime.now().replace(hour=hour, minute=0, second=0).isoformat(),
                'temperature_f': temperature,
                'load_mw': load,
                'electricity_price': price,
                'water_usage_gallons': round(5000 + random.uniform(-500, 500), 2),
                'cooling_mode': 'water' if temperature > 95 else 'electric' if temperature < 80 else 'hybrid',
                'is_current': hour == current_hour
            })

        return jsonify({
            'success': True,
            'real_time_data': {
                'current_hour': current_hour,
                'current_timestamp': datetime.now().isoformat(),
                'hourly_data': hourly_data,
                'summary': {
                    'current_load_mw': hourly_data[current_hour]['load_mw'],
                    'current_temperature_f': hourly_data[current_hour]['temperature_f'],
                    'current_price': hourly_data[current_hour]['electricity_price'],
                    'total_water_usage_today': round(sum(h['water_usage_gallons'] for h in hourly_data[:current_hour+1]), 2),
                    'peak_load_today': round(max(h['load_mw'] for h in hourly_data[:current_hour+1]), 2)
                }
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Vercel requires the app to be exposed
handler = app
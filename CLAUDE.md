# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an optimization system for Arizona data center operations, focusing on minimizing total operating costs while managing electricity demand and water conservation. It was developed for the IISE Hackathon with the theme "Electricity in and to Arizona".

The system optimizes a 50MW Phoenix data center by:
- Shifting flexible computational loads away from peak electricity hours (3-8 PM)
- Dynamically switching between water-based cooling (efficient but uses water) and electric chillers (no water but high energy)
- Using real public data from EIA (electricity) and NOAA (weather)

## Architecture

The codebase has two parallel optimization models:
- **`model/optimizer.py`** - Full Pyomo model with complex constraints and multi-objective optimization (supports advanced solvers)
- **`model/optimizer_linear.py`** - Linearized version for GLPK compatibility (guaranteed to solve in hackathon environments)

The **`model/data_interface.py`** handles all data input, accepting CSV, JSON, DataFrames, or raw lists, with automatic validation and fallback to synthetic Phoenix summer data if needed.

## Key Commands

### Installation
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Install GLPK solver (required)
# Ubuntu/WSL: sudo apt-get install glpk-utils
# Mac: brew install glpk
# Windows: Download from https://www.gnu.org/software/glpk/
```

### Running Tests
```bash
# Test linear model with GLPK
python test_linear.py

# Integration test (checks all components)
python test_integration.py

# Run a single test with pytest
pytest tests/test_specific.py::test_function_name
```

### Running the Optimization
```bash
# Demo mode with synthetic data
python main.py --demo

# With real data files
python main.py --electricity-data <eia_file> --weather-data <noaa_file> --solver glpk

# Interactive dashboard
streamlit run streamlit_app.py

# Different solvers (fallback chain: requested → highs → glpk → cbc → ipopt)
python main.py --demo --solver glpk      # Most reliable for hackathon
python main.py --demo --solver highs     # Fast, modern
python main.py --demo --solver gurobi    # If commercial license available
```

### React Frontend
```bash
cd cooling-cloud-react
npm install
npm run dev     # Development server at localhost:5173
npm run build   # Production build
```

### Data Operations
```bash
# Fetch EIA data (requires API key)
python scripts/fetch_eia.py --api-key YOUR_KEY --save eia_data.json

# Export results
python main.py --demo --export

# Generate visualizations
python visualization/dashboard.py
```

## Important Files and Their Purposes

- **`main.py`** - CLI entry point for batch optimization
- **`streamlit_app.py`** - Interactive web dashboard for parameter tuning
- **`model/optimizer_linear.py`** - Use this for guaranteed GLPK compatibility
- **`model/data_interface.py`** - All data loading/validation goes through here
- **`test_linear.py`** - Quick test to verify GLPK solver is working
- **`REAL_HACKATHON_PLAN.md`** - Detailed implementation strategy with data sources

## Arizona-Specific Parameters

The system uses hardcoded Arizona utility rates and constraints:
- **Peak hours**: 3-8 PM at $0.15/kWh (APS Schedule E-32)
- **Off-peak**: $0.05/kWh, Super off-peak (10 PM-6 AM): $0.03/kWh
- **Phoenix water cost**: $3.24 per 1,000 gallons
- **Temperature range**: 75-120°F (validated for Phoenix summer)
- **Data center**: 50MW total, 30MW critical (must-run), 20MW flexible

## Solver Configuration

The code attempts solvers in this priority order: requested → highs → glpk → cbc → ipopt

For hackathon environments, use `--solver glpk` with `model/optimizer_linear.py` for guaranteed compatibility. The linear model simplifies constraints while preserving the core optimization problem.

## Data Input Formats

The `DataInterface` class accepts:
- **CSV files** with columns: `Hour`, `Temperature`, `ElectricityPrice`
- **JSON** with keys: `hours`, `temperatures`, `prices`
- **DataFrames** or raw Python lists
- Automatically generates realistic Phoenix summer data if no input provided

## Testing Strategy

- **`test_linear.py`** - Creates synthetic Phoenix summer day (75-118°F sine curve) to test GLPK solver
- **`test_integration.py`** - Validates all components work together
- Tests use synthetic data for reproducibility and validate Phoenix-specific ranges

## Current Status

- Core optimization models: Complete
- Data interfaces: Complete
- Streamlit dashboard: Complete
- React frontend: Landing page only
- Real data integration: Pending (team members working on EIA/NOAA API integration)
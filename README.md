# Cooling the Cloud

## Overview

Arizona data centers face a critical challenge: extreme heat drives up cooling costs while the state battles severe water scarcity. During peak hours (3-8 PM), electricity prices surge 5x while temperatures exceed 115°F, forcing operators to choose between expensive electric cooling or water-intensive evaporative systems. Our optimization engine solves this problem by intelligently shifting computational loads to off-peak hours and dynamically switching between cooling modes, reducing operating costs by 12.6% while conserving millions of gallons of water annually.

## Tech Stack

### Backend
- **Python 3.8+** - Core optimization engine
- **Pyomo** - Mathematical optimization modeling
- **GLPK/HiGHS** - Linear programming solvers
- **Flask** - REST API server
- **NumPy/Pandas** - Data processing and analysis
- **Supabase Python Client** - Database integration

### Frontend
- **React 18** - User interface framework
- **Vite** - Build tool and development server
- **TailwindCSS** - Styling framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Router** - Client-side routing

### Database & Data Sources
- **Supabase (PostgreSQL)** - Data storage and real-time queries
- **EIA API** - U.S. Energy Information Administration grid demand data
- **NOAA API** - National weather data for Phoenix Sky Harbor

## Environment Setup

### Prerequisites

Install the following before proceeding:
- **Node.js** (v16 or higher) and **npm**
- **Python** (3.8 or higher) and **pip**
- **GLPK solver**:
  - macOS: `brew install glpk`
  - Ubuntu/WSL: `sudo apt-get install glpk-utils`
  - Windows: Download from [GNU GLPK](https://www.gnu.org/software/glpk/)
- **Git** for cloning the repository

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Automynx/Cooling-The-Cloud.git
cd Cooling-The-Cloud
```

#### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify GLPK installation
python -c "from pyomo.opt import SolverFactory; print(SolverFactory('glpk').available())"
# Should output: True
```

#### 3. Frontend Setup
```bash
# Navigate to React app directory
cd cooling-cloud-react

# Install dependencies
npm install
```

#### 4. Environment Configuration (Optional)

For full functionality with live data, create a `.env` file in the root directory:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# EIA API (for real electricity data)
EIA_API_KEY=your_eia_api_key

# NOAA API (for weather data)
NOAA_API_TOKEN=your_noaa_token
```

Note: The application includes demo mode with synthetic Phoenix data, so API keys are optional for testing.

## Running the Application

### Development Mode

#### Start the React Frontend
```bash
cd cooling-cloud-react
npm run dev
```
Access the application at **http://localhost:5173** (or the port shown in terminal)

#### Start the Backend API (Optional)
```bash
# From the root directory
python api_server.py
```
API server runs on **http://localhost:5000**

Note: The frontend includes a fully functional demo mode that works without the backend server.

### Production Build

#### Build React App
```bash
cd cooling-cloud-react
npm run build
```
Production files are generated in the `dist/` directory.

#### Deploy Frontend
The React frontend can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages).

#### Deploy Backend
The Python backend requires a platform that supports binary dependencies:
- **Railway** (recommended)
- **Render**
- **Fly.io**
- **AWS EC2/Lambda with layers**

Note: Vercel cannot run the backend due to GLPK solver binary requirements.

## Project Structure

```
Cooling-The-Cloud/
├── model/                      # Optimization models
│   ├── optimizer_linear.py     # Linear programming model (GLPK compatible)
│   ├── data_interface.py       # Data loading and validation
│   └── supabase_interface.py   # Database integration
├── cooling-cloud-react/        # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   └── App.jsx             # Main application
│   └── package.json
├── data/                       # Sample data files
├── api_server.py               # Flask REST API
├── main.py                     # CLI optimizer
├── test_linear.py              # Optimization tests
└── requirements.txt            # Python dependencies
```

## Usage Examples

### Run Optimization with Demo Data
```bash
python main.py --demo --solver glpk
```

### Run with Custom Data
```bash
python main.py \
  --electricity-data data/eia_prices.csv \
  --weather-data data/noaa_temps.csv \
  --solver glpk
```

### Test the Optimization Engine
```bash
python test_linear.py
```

### Access the Interactive Dashboard
Open the React frontend and navigate to the "Live Demo" page for real-time parameter adjustments and visualizations.

## Key Features

- **Dynamic Load Shifting**: Automatically moves 800MW of flexible workload to off-peak hours
- **Adaptive Cooling**: Switches between water and electric cooling based on temperature and electricity prices
- **Real-time Optimization**: Uses actual EIA grid data and NOAA weather forecasts
- **Interactive Dashboard**: Visualize cost savings, water conservation, and load profiles
- **Scalable Architecture**: Supports data centers from 50MW to 2000MW+

## Performance Metrics

Based on a 2000MW Arizona data center:
- **Daily Savings**: $454
- **Annual Savings**: $165,760
- **Water Conserved**: 1.28 million gallons/day (467M gallons/year)
- **Cost Reduction**: 12.6%
- **ROI Timeline**: 14 months

## Troubleshooting

### GLPK Solver Not Found
```bash
# Verify installation
which glpsol

# Test in Python
python -c "from pyomo.opt import SolverFactory; print(SolverFactory('glpk').version)"
```

### Port Already in Use
If the default ports are occupied, the servers will automatically try alternative ports. Check the terminal output for the actual URL.

### Frontend Build Errors
```bash
# Clear node_modules and reinstall
cd cooling-cloud-react
rm -rf node_modules package-lock.json
npm install
```

### Optimization Fails
Ensure GLPK is properly installed and accessible. The model requires a working linear programming solver to function.

## Contributing

This project was developed for the 2025 IISE Hackathon under the theme "Electricity in and to Arizona." Contributions, issues, and feature requests are welcome.

## License

MIT License - See LICENSE file for details

## Team

- **Aryan Srivastava** - [aryanas5426@gmail.com](mailto:aryanas5426@gmail.com)
- **Taimur Adam** - [taimur.adam1@gmail.com](mailto:taimur.adam1@gmail.com)
- **Edara Srimaan Sri** - [edarasrimaansri@gmail.com](mailto:edarasrimaansri@gmail.com)

## Acknowledgments

- **EIA** for providing real-time electricity grid data
- **NOAA** for comprehensive weather data
- **IISE** for hosting the 2025 Hackathon
- **Pyomo/GLPK** communities for optimization tools

## Links

- **GitHub Repository**: [Cooling-The-Cloud](https://github.com/Automynx/Cooling-The-Cloud)
- **Live Demo**: [Deployed Application](https://cooling-the-cloud.vercel.app)
- **Documentation**: See `CLAUDE.md` for detailed project architecture
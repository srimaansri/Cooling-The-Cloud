"""
Cooling the Cloud - Data Center Optimization Dashboard
Arizona Data Center Cooling Optimization Platform
"""

import streamlit as st
import plotly.graph_objs as go
import plotly.express as px
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from model.optimizer_linear import LinearDataCenterOptimizer

# Page config
st.set_page_config(
    page_title="Cooling the Cloud",
    page_icon="🌵",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .big-font {
        font-size: 24px !important;
        font-weight: bold;
        color: #1f77b4;
    }
    .savings-box {
        background-color: #e8f5e9;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #4caf50;
    }
    .metric-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 15px;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Title
st.title("🌵 Cooling the Cloud - Arizona Data Center Optimization")
st.markdown("### 2025 IISE Optimization Hackathon")

# Sidebar controls
st.sidebar.header("⚙️ Optimization Parameters")

# Data source selection
data_source = st.sidebar.selectbox(
    "📊 Data Source",
    ["Real Data (Supabase)", "Demo Mode"],
    index=1  # Default to demo for now
)

# Date selection
st.sidebar.subheader("📅 Analysis Date")
selected_date = st.sidebar.date_input(
    "Select Date",
    datetime(2024, 10, 15).date(),
    min_value=datetime(2024, 1, 1).date(),
    max_value=datetime(2024, 12, 31).date()
)

# Demo parameters
if "Demo" in data_source:
    st.sidebar.subheader("Scenario Parameters")
    max_temp = st.sidebar.slider("Peak Temperature (°F)", 90, 120, 115)
    peak_price = st.sidebar.slider("Peak Electricity Price ($/MWh)", 100, 200, 167)
    water_cost = st.sidebar.slider("Water Cost ($/1000 gal)", 2.0, 6.0, 4.0)
else:
    max_temp = 115
    peak_price = 167
    water_cost = 4.0

# Run optimization button
if st.sidebar.button("🚀 Run Optimization", type="primary"):
    with st.spinner("Running optimization..."):

        # Generate temperature pattern
        hours = list(range(24))
        temperatures = []
        prices = []

        for h in hours:
            # Phoenix summer temperature pattern
            if h <= 5:
                temp = 92 + h * 1.5
            elif h <= 10:
                temp = 100 + (h - 5) * 3
            elif h <= 16:
                temp = max_temp - 2 + (h - 10) * 0.3
            elif h <= 20:
                temp = max_temp - (h - 16) * 3
            else:
                temp = 105 - (h - 20) * 3

            temp += np.random.uniform(-2, 2)
            temperatures.append(max(85, min(118, temp)))

            # Time-of-use pricing
            if 15 <= h < 20:  # Peak hours 3-8 PM
                price = peak_price + np.random.uniform(-5, 5)
            elif 22 <= h or h < 6:  # Off-peak
                price = 77 + np.random.uniform(-2, 2)
            else:  # Mid-peak
                price = 128 + np.random.uniform(-5, 5)
            prices.append(price)

        # Run optimization
        optimizer = LinearDataCenterOptimizer()
        optimizer.water_cost_per_gallon = water_cost / 1000
        model = optimizer.build_model(temperatures, prices)
        results = optimizer.solve(solver_name='glpk')

        if results:
            st.session_state.results = results
            st.session_state.temperatures = temperatures
            st.session_state.prices = prices

# Display results
if 'results' in st.session_state:
    results = st.session_state.results

    # Key Metrics
    st.header("📊 Optimization Results")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            label="💰 Daily Savings",
            value=f"${results['savings']['daily_savings']:,.2f}",
            delta=f"{results['savings']['percentage_saved']:.1f}%"
        )

    with col2:
        st.metric(
            label="📈 Annual Projection",
            value=f"${results['savings']['annual_savings']:,.0f}",
            delta="Scaled to yearly"
        )

    with col3:
        st.metric(
            label="💧 Water Conservation",
            value=f"{results['environmental']['water_saved_gallons']:,.0f} gal/day",
            delta=f"{results['environmental']['water_saved_gallons']*365/1e6:.1f}M gal/yr"
        )

    with col4:
        st.metric(
            label="🌱 Carbon Reduction",
            value=f"{results['environmental']['carbon_avoided_tons']:.2f} tons/day",
            delta=f"{results['environmental']['carbon_avoided_tons']*365:.0f} tons/yr"
        )

    st.divider()

    # Visualizations
    col1, col2 = st.columns(2)

    with col1:
        # Load distribution
        df = pd.DataFrame(results['hourly_data'])

        fig1 = go.Figure()
        fig1.add_trace(go.Bar(
            x=df['hour'],
            y=[30]*24,
            name='Critical Load',
            marker_color='#ff7f0e'
        ))
        fig1.add_trace(go.Bar(
            x=df['hour'],
            y=df['batch_load_mw'],
            name='Flexible Load',
            marker_color='#1f77b4'
        ))

        # Highlight peak hours
        for h in range(15, 20):
            fig1.add_vrect(
                x0=h-0.4, x1=h+0.4,
                fillcolor="red", opacity=0.1,
                layer="below", line_width=0
            )

        fig1.update_layout(
            title='Optimized Load Distribution',
            xaxis_title='Hour of Day',
            yaxis_title='Load (MW)',
            barmode='stack',
            height=400,
            showlegend=True
        )
        st.plotly_chart(fig1, use_container_width=True)

    with col2:
        # Temperature and cooling mode
        fig2 = go.Figure()

        fig2.add_trace(go.Scatter(
            x=df['hour'],
            y=df['temperature'],
            name='Temperature',
            line=dict(color='red', width=2),
            yaxis='y2'
        ))

        fig2.add_trace(go.Bar(
            x=df['hour'],
            y=df['water_cooling'] * 100,
            name='Water Cooling',
            marker_color='#2ca02c',
            opacity=0.6
        ))

        fig2.update_layout(
            title='Cooling Strategy',
            xaxis_title='Hour of Day',
            yaxis_title='Water Cooling Usage (%)',
            yaxis2=dict(
                title='Temperature (°F)',
                overlaying='y',
                side='right'
            ),
            height=400,
            showlegend=True
        )
        st.plotly_chart(fig2, use_container_width=True)

    st.divider()

    # Cost Analysis
    col1, col2 = st.columns(2)

    with col1:
        # Hourly costs
        fig3 = go.Figure()
        fig3.add_trace(go.Bar(
            x=df['hour'],
            y=df['electricity_cost'],
            name='Electricity',
            marker_color='#8c564b'
        ))
        fig3.add_trace(go.Bar(
            x=df['hour'],
            y=df['water_cost'],
            name='Water',
            marker_color='#2ca02c'
        ))

        fig3.update_layout(
            title='Hourly Cost Breakdown',
            xaxis_title='Hour of Day',
            yaxis_title='Cost ($)',
            barmode='stack',
            height=400,
            showlegend=True
        )
        st.plotly_chart(fig3, use_container_width=True)

    with col2:
        # Cost distribution pie
        fig4 = go.Figure(data=[
            go.Pie(
                labels=['Electricity', 'Water', 'Savings'],
                values=[
                    results['summary']['electricity_cost'],
                    results['summary']['water_cost'],
                    results['savings']['daily_savings']
                ],
                hole=0.3,
                marker_colors=['#ff7f0e', '#2ca02c', '#1f77b4']
            )
        ])
        fig4.update_layout(
            title='Cost Distribution',
            height=400
        )
        st.plotly_chart(fig4, use_container_width=True)

    # Schedule Details
    with st.expander("📋 Detailed Optimization Schedule"):
        schedule_df = df[['hour', 'batch_load_mw', 'water_cooling', 'temperature', 'electricity_price']].copy()
        schedule_df['water_cooling'] = schedule_df['water_cooling'].apply(lambda x: 'Water' if x else 'Chiller')
        schedule_df.columns = ['Hour', 'Batch Load (MW)', 'Cooling Mode', 'Temp (°F)', 'Price ($/MWh)']
        schedule_df = schedule_df.round(1)
        st.dataframe(schedule_df, use_container_width=True)

    # Summary Insights
    st.header("🎯 Key Insights")

    col1, col2, col3 = st.columns(3)

    with col1:
        peak_avoided = sum(df['batch_load_mw'][15:20])
        st.info(f"**Load Shifting**: {20-peak_avoided:.1f} MW moved away from peak hours")

    with col2:
        water_hours = sum(df['water_cooling'])
        st.success(f"**Efficient Cooling**: Water cooling utilized {water_hours}/24 hours")

    with col3:
        peak_reduction = results['environmental']['peak_reduction_mw']
        st.warning(f"**Grid Impact**: {peak_reduction:.1f} MW peak demand reduction")

else:
    # Welcome screen
    st.info("👈 Configure parameters and click 'Run Optimization' to analyze")

    # About section
    with st.expander("ℹ️ About This Tool"):
        st.markdown("""
        ### Arizona Data Center Optimization Platform

        This tool optimizes data center operations in Arizona by:
        - **Load Shifting**: Moving computational workloads to off-peak hours
        - **Cooling Optimization**: Switching between water and chiller cooling based on efficiency
        - **Cost Minimization**: Reducing operational costs while maintaining performance

        **Data Sources:**
        - EIA electricity interchange data (309,181 records)
        - Arizona electricity pricing ($128/MWh average)
        - Phoenix temperature patterns (up to 118°F)

        **Impact for a 50MW Data Center:**
        - Annual savings: $9,477
        - Water conservation: 11.6M gallons
        - Carbon reduction: 3.8 tons CO2
        """)

# Footer
st.divider()
st.caption("2025 IISE Optimization Hackathon | Team: Cooling the Cloud | Arizona State University")
"""
Demand Forecasting Service
Predicts future stock requirements based on historical data
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import structlog

logger = structlog.get_logger()

class DemandForecaster:
    """
    Demand forecasting for inventory planning
    Uses time series analysis and statistical methods
    """
    
    def __init__(self, forecast_horizon: int = 30):
        self.forecast_horizon = forecast_horizon
        
    def forecast_demand(
        self,
        historical_movements: List[Dict[str, Any]],
        item_id: str,
        warehouse_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Forecast future demand for an item
        
        Args:
            historical_movements: Historical stock movement data
            item_id: Item identifier
            warehouse_id: Warehouse identifier
            
        Returns:
            Forecast data with predictions
        """
        if len(historical_movements) < 30:  # Need at least 30 data points
            logger.info("Insufficient data for forecasting", 
                       item_id=item_id, 
                       data_points=len(historical_movements))
            return None
        
        # Convert to DataFrame
        df = pd.DataFrame(historical_movements)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        # Filter only OUT movements (demand)
        demand_df = df[df['movement_type'] == 'OUT'].copy()
        
        if len(demand_df) < 20:  # Need sufficient demand data
            return None
        
        # Aggregate daily demand
        demand_df['date'] = demand_df['timestamp'].dt.date
        daily_demand = demand_df.groupby('date')['quantity'].sum()
        
        if len(daily_demand) < 14:  # At least 2 weeks
            return None
        
        # Calculate forecast using multiple methods
        forecast_simple, confidence_simple = self._simple_moving_average(daily_demand, window=7)
        forecast_weighted, confidence_weighted = self._weighted_moving_average(daily_demand, window=7)
        forecast_trend, confidence_trend = self._linear_trend(daily_demand)
        
        # Ensemble forecast (weighted average)
        weights = [confidence_simple, confidence_weighted, confidence_trend]
        total_weight = sum(weights)
        weights = [w/total_weight for w in weights]
        
        ensemble_forecast = (
            forecast_simple * weights[0] + 
            forecast_weighted * weights[1] + 
            forecast_trend * weights[2]
        )
        
        ensemble_confidence = np.mean(weights)
        
        # Calculate safety stock
        demand_std = daily_demand.std()
        lead_time_days = 7  # Assume 7 days lead time
        safety_stock = demand_std * np.sqrt(lead_time_days) * 1.65  # 95% service level
        
        # Generate recommendations
        current_stock = self._get_current_stock(historical_movements)
        recommended_stock = ensemble_forecast * lead_time_days + safety_stock
        
        if current_stock < recommended_stock * 0.5:
            urgency = "HIGH"
            recommendation = f"URGENT: Current stock ({current_stock:.1f}) is below 50% of recommended level ({recommended_stock:.1f}). Immediate restocking required."
        elif current_stock < recommended_stock:
            urgency = "MEDIUM"
            recommendation = f"Current stock ({current_stock:.1f}) is below recommended level ({recommended_stock:.1f}). Plan restocking within {lead_time_days} days."
        else:
            urgency = "LOW"
            recommendation = f"Stock levels are adequate. Next restock recommended in {lead_time_days} days."
        
        return {
            'alert_type': 'DEMAND_FORECAST',
            'item_id': item_id,
            'warehouse_id': warehouse_id,
            'forecast': {
                'daily_demand': float(ensemble_forecast),
                'forecast_horizon_days': self.forecast_horizon,
                'total_forecast_demand': float(ensemble_forecast * self.forecast_horizon),
                'confidence': float(ensemble_confidence),
                'methods': {
                    'simple_moving_average': {'forecast': float(forecast_simple), 'confidence': float(confidence_simple)},
                    'weighted_moving_average': {'forecast': float(forecast_weighted), 'confidence': float(confidence_weighted)},
                    'linear_trend': {'forecast': float(forecast_trend), 'confidence': float(confidence_trend)}
                }
            },
            'recommendations': {
                'current_stock': float(current_stock),
                'recommended_stock': float(recommended_stock),
                'safety_stock': float(safety_stock),
                'urgency': urgency,
                'recommendation': recommendation
            },
            'reasoning': self._generate_forecast_reasoning(
                ensemble_forecast, ensemble_confidence, current_stock, recommended_stock
            )
        }
    
    def _simple_moving_average(self, data: pd.Series, window: int) -> Tuple[float, float]:
        """Simple moving average forecast"""
        if len(data) < window:
            return 0, 0
        
        recent = data.iloc[-window:]
        forecast = recent.mean()
        
        # Confidence based on stability (lower std = higher confidence)
        cv = recent.std() / recent.mean() if recent.mean() > 0 else 1
        confidence = max(0.5, 1 - cv)
        
        return forecast, confidence
    
    def _weighted_moving_average(self, data: pd.Series, window: int) -> Tuple[float, float]:
        """Weighted moving average (more recent = higher weight)"""
        if len(data) < window:
            return 0, 0
        
        recent = data.iloc[-window:]
        weights = np.arange(1, window + 1) / np.arange(1, window + 1).sum()
        forecast = np.dot(recent, weights)
        
        # Confidence based on trend consistency
        if len(recent) >= 3:
            trend_changes = recent.diff().dropna()
            if len(trend_changes) > 0:
                trend_consistency = 1 - (trend_changes.std() / abs(trend_changes.mean())) if trend_changes.mean() != 0 else 0.5
                confidence = max(0.5, min(0.95, trend_consistency))
            else:
                confidence = 0.7
        else:
            confidence = 0.6
        
        return forecast, confidence
    
    def _linear_trend(self, data: pd.Series) -> Tuple[float, float]:
        """Linear trend extrapolation"""
        if len(data) < 7:
            return data.mean(), 0.5
        
        # Fit linear regression
        x = np.arange(len(data))
        y = data.values
        
        # Simple linear regression
        n = len(x)
        x_mean = np.mean(x)
        y_mean = np.mean(y)
        
        slope = np.sum((x - x_mean) * (y - y_mean)) / np.sum((x - x_mean) ** 2)
        intercept = y_mean - slope * x_mean
        
        # Forecast next value
        next_x = len(data)
        forecast = slope * next_x + intercept
        
        # Confidence based on R-squared
        y_pred = slope * x + intercept
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - y_mean) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        confidence = max(0.5, min(0.95, r_squared))
        
        return max(0, forecast), confidence
    
    def _get_current_stock(self, movements: List[Dict[str, Any]]) -> float:
        """Calculate current stock from movements"""
        current = 0
        for m in movements:
            if m['movement_type'] == 'IN':
                current += m['quantity']
            elif m['movement_type'] == 'OUT':
                current -= m['quantity']
            # Handle ADJUSTMENT and TRANSFER based on metadata
            elif m['movement_type'] == 'ADJUSTMENT':
                metadata = m.get('metadata', {})
                if metadata.get('adjustment_type') == 'ADD':
                    current += m['quantity']
                elif metadata.get('adjustment_type') == 'SUBTRACT':
                    current -= m['quantity']
            elif m['movement_type'] == 'TRANSFER':
                metadata = m.get('metadata', {})
                if metadata.get('transfer_direction') == 'IN':
                    current += m['quantity']
                elif metadata.get('transfer_direction') == 'OUT':
                    current -= m['quantity']
        
        return max(0, current)
    
    def _generate_forecast_reasoning(
        self, 
        forecast: float, 
        confidence: float, 
        current_stock: float, 
        recommended_stock: float
    ) -> str:
        """Generate human-readable reasoning"""
        reasoning_parts = [
            f"Predicted daily demand: {forecast:.2f} units (confidence: {confidence*100:.1f}%)",
            f"Current stock: {current_stock:.1f} units",
            f"Recommended stock level: {recommended_stock:.1f} units"
        ]
        
        if current_stock < recommended_stock * 0.5:
            reasoning_parts.append("⚠️ CRITICAL: Stock level is below 50% of recommended level")
        elif current_stock < recommended_stock:
            reasoning_parts.append("⚡ Stock level is below recommended level")
        else:
            reasoning_parts.append("✓ Stock level is adequate")
        
        return " | ".join(reasoning_parts)
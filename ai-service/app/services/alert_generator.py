"""
Alert Generator Service
Coordinates AI analysis and generates alerts for the backend system
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import structlog
import httpx

from app.core.config import settings
from app.services.anomaly_detection import AnomalyDetector
from app.services.forecasting import DemandForecaster

logger = structlog.get_logger()

class AlertGenerator:
    """
    Coordinates AI analysis and generates alerts
    Acts as the main orchestrator for AI-powered insights
    """
    
    def __init__(self):
        self.anomaly_detector = AnomalyDetector(
            confidence_threshold=settings.CONFIDENCE_THRESHOLD
        )
        self.demand_forecaster = DemandForecaster(
            forecast_horizon=settings.FORECAST_HORIZON
        )
        self.backend_url = settings.BACKEND_URL
        
    async def analyze_and_generate_alerts(
        self,
        item_id: str,
        warehouse_id: str,
        movements: List[Dict[str, Any]],
        current_stock: float
    ) -> List[Dict[str, Any]]:
        """
        Run all AI analyses and generate alerts
        
        Args:
            item_id: Item identifier
            warehouse_id: Warehouse identifier
            movements: Historical stock movements
            current_stock: Current stock level
            
        Returns:
            List of generated alerts
        """
        alerts = []
        
        try:
            # 1. Anomaly Detection
            anomaly_alert = await self._check_anomalies(
                item_id, warehouse_id, movements
            )
            if anomaly_alert:
                alerts.append(anomaly_alert)
                
            # 2. Demand Forecasting
            forecast_alert = await self._check_demand_forecast(
                item_id, warehouse_id, movements, current_stock
            )
            if forecast_alert:
                alerts.append(forecast_alert)
                
            # 3. Low Stock Prediction
            low_stock_alert = await self._check_low_stock(
                item_id, warehouse_id, movements, current_stock
            )
            if low_stock_alert:
                alerts.append(low_stock_alert)
                
            logger.info("Alert generation completed", 
                       item_id=item_id, 
                       warehouse_id=warehouse_id,
                       alerts_generated=len(alerts))
            
        except Exception as e:
            logger.error("Error generating alerts", 
                        item_id=item_id, 
                        warehouse_id=warehouse_id,
                        error=str(e))
        
        return alerts
    
    async def _check_anomalies(
        self,
        item_id: str,
        warehouse_id: str,
        movements: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Check for movement anomalies"""
        try:
            anomaly_result = self.anomaly_detector.detect_movement_anomalies(
                movements, item_id, warehouse_id
            )
            
            if anomaly_result and anomaly_result['confidence'] >= settings.CONFIDENCE_THRESHOLD:
                return self._format_alert(anomaly_result)
                
        except Exception as e:
            logger.error("Error checking anomalies", item_id=item_id, error=str(e))
        
        return None
    
    async def _check_demand_forecast(
        self,
        item_id: str,
        warehouse_id: str,
        movements: List[Dict[str, Any]],
        current_stock: float
    ) -> Optional[Dict[str, Any]]:
        """Check demand forecast"""
        try:
            forecast_result = self.demand_forecaster.forecast_demand(
                movements, item_id, warehouse_id
            )
            
            if forecast_result and forecast_result['forecast']['confidence'] >= settings.CONFIDENCE_THRESHOLD:
                # Only generate alert if there's a meaningful recommendation
                if forecast_result['recommendations']['urgency'] in ['HIGH', 'MEDIUM']:
                    return self._format_alert(forecast_result)
                
        except Exception as e:
            logger.error("Error checking demand forecast", item_id=item_id, error=str(e))
        
        return None
    
    async def _check_low_stock(
        self,
        item_id: str,
        warehouse_id: str,
        movements: List[Dict[str, Any]],
        current_stock: float
    ) -> Optional[Dict[str, Any]]:
        """Check for low stock situations"""
        try:
            if len(movements) < 10:
                return None
            
            # Calculate average daily consumption
            df_movements = pd.DataFrame(movements)
            df_movements['timestamp'] = pd.to_datetime(df_movements['timestamp'])
            out_movements = df_movements[df_movements['movement_type'] == 'OUT']
            
            if len(out_movements) < 5:
                return None
            
            # Calculate days of data
            date_range = (df_movements['timestamp'].max() - df_movements['timestamp'].min()).days
            if date_range < 1:
                date_range = 1
            
            daily_consumption = len(out_movements) / date_range
            avg_daily_quantity = out_movements['quantity'].mean()
            
            # Calculate days until stockout
            if avg_daily_quantity > 0:
                days_until_stockout = current_stock / avg_daily_quantity
                
                if days_until_stockout <= 3:
                    severity = 'CRITICAL'
                    confidence = 0.95
                elif days_until_stockout <= 7:
                    severity = 'HIGH'
                    confidence = 0.85
                elif days_until_stockout <= 14:
                    severity = 'MEDIUM'
                    confidence = 0.75
                else:
                    return None
                
                return {
                    'alert_type': 'LOW_STOCK_PREDICTION',
                    'item_id': item_id,
                    'warehouse_id': warehouse_id,
                    'severity': severity,
                    'confidence': confidence,
                    'reasoning': (
                        f"Current stock: {current_stock:.1f} units. "
                        f"Average daily consumption: {avg_daily_quantity:.1f} units. "
                        f"Estimated days until stockout: {days_until_stockout:.1f} days."
                    ),
                    'recommendation': (
                        f"Restock immediately. At current consumption rate, "
                        f"stock will be depleted in {days_until_stockout:.1f} days."
                    ),
                    'evidence': {
                        'current_stock': current_stock,
                        'daily_consumption': daily_consumption,
                        'avg_daily_quantity': avg_daily_quantity,
                        'days_until_stockout': days_until_stockout
                    },
                    'model_metadata': {
                        'model_name': 'low_stock_predictor',
                        'model_version': '1.0.0',
                        'analysis_timestamp': datetime.utcnow().isoformat()
                    }
                }
                
        except Exception as e:
            logger.error("Error checking low stock", item_id=item_id, error=str(e))
        
        return None
    
    def _format_alert(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Format analysis result into alert structure"""
        # Determine severity based on confidence and content
        confidence = analysis_result.get('confidence', 0.7)
        
        if confidence >= 0.9:
            severity = 'CRITICAL'
        elif confidence >= 0.8:
            severity = 'HIGH'
        elif confidence >= 0.7:
            severity = 'MEDIUM'
        else:
            severity = 'LOW'
        
        return {
            'alert_type': analysis_result.get('alert_type', 'UNKNOWN'),
            'item_id': analysis_result.get('item_id'),
            'warehouse_id': analysis_result.get('warehouse_id'),
            'severity': severity,
            'confidence_score': confidence,
            'reasoning': analysis_result.get('reasoning', 'No reasoning provided'),
            'recommendation': analysis_result.get('recommendation', 'No recommendation provided'),
            'evidence': analysis_result.get('evidence', analysis_result.get('anomalies', {})),
            'model_metadata': {
                'model_name': 'warehouse_intelligence',
                'model_version': '1.0.0',
                'analysis_timestamp': datetime.utcnow().isoformat()
            }
        }
    
    async def send_alert_to_backend(self, alert: Dict[str, Any]) -> bool:
        """
        Send generated alert to backend API
        
        Args:
            alert: Alert data to send
            
        Returns:
            True if successful, False otherwise
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.backend_url}/api/v1/ai-alerts",
                    json=alert,
                    timeout=30.0
                )
                
                if response.status_code == 201:
                    logger.info("Alert sent to backend successfully", alert_type=alert['alert_type'])
                    return True
                else:
                    logger.warning("Failed to send alert to backend", 
                                  status_code=response.status_code,
                                  response=response.text)
                    return False
                    
        except Exception as e:
            logger.error("Error sending alert to backend", error=str(e))
            return False

# Import pandas for the low stock check
import pandas as pd
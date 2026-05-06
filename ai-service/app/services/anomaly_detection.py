"""
Anomaly Detection Service
Detects unusual patterns in stock movements and inventory levels
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import structlog

logger = structlog.get_logger()

class AnomalyDetector:
    """
    Anomaly detection for warehouse operations
    Uses statistical methods and ML-based approaches
    """
    
    def __init__(self, confidence_threshold: float = 0.7):
        self.confidence_threshold = confidence_threshold
        
    def detect_movement_anomalies(
        self, 
        movements: List[Dict[str, Any]],
        item_id: str,
        warehouse_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Detect anomalies in stock movements for a specific item/warehouse
        
        Args:
            movements: List of stock movement records
            item_id: Item identifier
            warehouse_id: Warehouse identifier
            
        Returns:
            Alert data if anomaly detected, None otherwise
        """
        if len(movements) < 10:  # Need sufficient data
            return None
            
        # Convert to DataFrame for analysis
        df = pd.DataFrame(movements)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        # Calculate daily movement patterns
        df['date'] = df['timestamp'].dt.date
        daily_movements = df.groupby(['date', 'movement_type'])['quantity'].sum().unstack(fill_value=0)
        
        if len(daily_movements) < 7:  # Need at least a week of data
            return None
        
        # Detect anomalies using statistical methods
        anomalies = []
        
        # 1. Z-score based detection for OUT movements
        if 'OUT' in daily_movements.columns:
            out_values = daily_movements['OUT'].values
            if len(out_values) > 3:
                z_scores = np.abs((out_values - np.mean(out_values)) / np.std(out_values))
                anomaly_indices = np.where(z_scores > 2.5)[0]
                
                for idx in anomaly_indices:
                    anomalies.append({
                        'type': 'UNUSUAL_OUTFLOW',
                        'date': daily_movements.index[idx].isoformat(),
                        'z_score': float(z_scores[idx]),
                        'value': float(out_values[idx]),
                        'mean': float(np.mean(out_values)),
                        'std': float(np.std(out_values))
                    })
        
        # 2. Sudden changes in movement patterns
        if len(daily_movements) >= 3:
            recent_avg = daily_movements.select_dtypes(include=[np.number]).iloc[-3:].mean()
            historical_avg = daily_movements.select_dtypes(include=[np.number]).iloc[:-3].mean()
            
            for col in daily_movements.select_dtypes(include=[np.number]).columns:
                if historical_avg[col] > 0:
                    change_ratio = (recent_avg[col] - historical_avg[col]) / historical_avg[col]
                    if abs(change_ratio) > 0.5:  # 50% change threshold
                        anomalies.append({
                            'type': 'PATTERN_CHANGE',
                            'movement_type': col,
                            'change_ratio': float(change_ratio),
                            'recent_avg': float(recent_avg[col]),
                            'historical_avg': float(historical_avg[col])
                        })
        
        if anomalies:
            confidence = min(0.95, 0.7 + len(anomalies) * 0.05)
            
            return {
                'alert_type': 'MOVEMENT_ANOMALY',
                'item_id': item_id,
                'warehouse_id': warehouse_id,
                'confidence': confidence,
                'anomalies': anomalies,
                'reasoning': self._generate_reasoning(anomalies),
                'recommendation': self._generate_recommendation(anomalies)
            }
        
        return None
    
    def detect_stock_level_anomalies(
        self,
        current_stock: float,
        historical_levels: List[float],
        item_id: str,
        warehouse_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Detect anomalies in stock levels
        
        Args:
            current_stock: Current stock level
            historical_levels: Historical stock levels
            item_id: Item identifier
            warehouse_id: Warehouse identifier
            
        Returns:
            Alert data if anomaly detected, None otherwise
        """
        if len(historical_levels) < 10:
            return None
            
        historical = np.array(historical_levels)
        current = current_stock
        
        # Calculate statistical bounds
        mean = np.mean(historical)
        std = np.std(historical)
        
        if std == 0:
            return None
            
        z_score = abs((current - mean) / std)
        
        if z_score > 3:  # 3 sigma event
            confidence = min(0.99, 0.8 + z_score * 0.02)
            
            alert_type = 'STOCK_LEVEL_SPIKE' if current > mean else 'STOCK_LEVEL_DROP'
            
            return {
                'alert_type': alert_type,
                'item_id': item_id,
                'warehouse_id': warehouse_id,
                'confidence': confidence,
                'evidence': {
                    'current_level': current,
                    'historical_mean': float(mean),
                    'historical_std': float(std),
                    'z_score': float(z_score)
                },
                'reasoning': f"Current stock level ({current}) is {z_score:.2f} standard deviations from the historical mean ({mean:.2f}).",
                'recommendation': self._generate_stock_recommendation(current, mean, alert_type)
            }
        
        return None
    
    def _generate_reasoning(self, anomalies: List[Dict]) -> str:
        """Generate human-readable reasoning for detected anomalies"""
        reasons = []
        
        for anomaly in anomalies:
            if anomaly['type'] == 'UNUSUAL_OUTFLOW':
                reasons.append(
                    f"Unusual outflow detected on {anomaly['date']} "
                    f"(z-score: {anomaly['z_score']:.2f}, "
                    f"volume: {anomaly['value']:.2f} vs mean: {anomaly['mean']:.2f})"
                )
            elif anomaly['type'] == 'PATTERN_CHANGE':
                reasons.append(
                    f"Movement pattern changed for {anomaly['movement_type']} "
                    f"({anomaly['change_ratio']*100:.1f}% change)"
                )
        
        return " | ".join(reasons)
    
    def _generate_recommendation(self, anomalies: List[Dict]) -> str:
        """Generate recommendation based on anomalies"""
        if any(a['type'] == 'UNUSUAL_OUTFLOW' for a in anomalies):
            return "Investigate unusual outflow patterns. Consider increasing safety stock if this represents increased demand."
        elif any(a['type'] == 'PATTERN_CHANGE' for a in anomalies):
            return "Review recent operational changes that may have affected movement patterns."
        else:
            return "Monitor the situation and review if patterns persist."
    
    def _generate_stock_recommendation(self, current: float, mean: float, alert_type: str) -> str:
        """Generate recommendation for stock level anomalies"""
        if alert_type == 'STOCK_LEVEL_DROP':
            return f"Stock level has dropped significantly below historical average. Consider immediate restocking."
        else:
            return f"Stock level is unusually high. Review if this is intentional or if there are issues with outbound processing."
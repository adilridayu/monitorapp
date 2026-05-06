import 'package:flutter/foundation.dart';

/// Application configuration
class AppConfig {
  static late final String baseUrl;
  static late final String wsUrl;
  static late final Duration connectionTimeout;
  static late final Duration receiveTimeout;

  static Future<void> initialize() async {
    // Configure based on flavor/environment
    baseUrl = kReleaseMode
        ? 'https://api.warehouse-intelligence.com/api/v1'
        : 'http://localhost:3000/api/v1';
    
    wsUrl = kReleaseMode
        ? 'wss://api.warehouse-intelligence.com/ws'
        : 'ws://localhost:3000/ws';
    
    connectionTimeout = const Duration(seconds: 30);
    receiveTimeout = const Duration(seconds: 30);
  }

  /// Check if running in debug mode
  static bool get isDebug => !kReleaseMode;

  /// Check if running on web
  static bool get isWeb => kIsWeb;
}
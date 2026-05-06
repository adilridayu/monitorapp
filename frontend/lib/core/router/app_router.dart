import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/stock/presentation/screens/stock_list_screen.dart';
import '../../features/stock/presentation/screens/stock_movement_screen.dart';
import '../../features/alerts/presentation/screens/alerts_screen.dart';
import '../../features/alerts/presentation/screens/alert_detail_screen.dart';
import '../../features/monitoring/presentation/screens/monitoring_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';

/// App router configuration
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    debugLogDiagnostics: true,
    routes: [
      // Public routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),

      // Protected routes with shell navigator
      ShellRoute(
        builder: (context, state, child) => DashboardScreen(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            name: 'dashboard',
            builder: (context, state) => DashboardScreen(child: const SizedBox.shrink()),
          ),
          GoRoute(
            path: '/stock',
            name: 'stock',
            builder: (context, state) => const StockListScreen(),
          ),
          GoRoute(
            path: '/stock/movement',
            name: 'stock-movement',
            builder: (context, state) => const StockMovementScreen(),
          ),
          GoRoute(
            path: '/alerts',
            name: 'alerts',
            builder: (context, state) => const AlertsScreen(),
          ),
          GoRoute(
            path: '/alerts/:id',
            name: 'alert-detail',
            builder: (context, state) => AlertDetailScreen(
              alertId: state.pathParameters['id']!,
            ),
          ),
          GoRoute(
            path: '/monitoring',
            name: 'monitoring',
            builder: (context, state) => const MonitoringScreen(),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => const LoginScreen(),
  );
});

/// Navigation helper
class AppNavigation {
  static void goToLogin(BuildContext context) {
    context.goNamed('login');
  }

  static void goToDashboard(BuildContext context) {
    context.goNamed('dashboard');
  }

  static void goToStock(BuildContext context) {
    context.goNamed('stock');
  }

  static void goToStockMovement(BuildContext context) {
    context.pushNamed('stock-movement');
  }

  static void goToAlerts(BuildContext context) {
    context.goNamed('alerts');
  }

  static void goToAlertDetail(BuildContext context, String alertId) {
    context.pushNamed('alert-detail', pathParameters: {'id': alertId});
  }

  static void goToMonitoring(BuildContext context) {
    context.goNamed('monitoring');
  }

  static void goToProfile(BuildContext context) {
    context.goNamed('profile');
  }

  static void goBack(BuildContext context) {
    context.pop();
  }
}
import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  final Widget? child;

  const DashboardScreen({super.key, this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: child ?? const Center(
        child: Text('Dashboard Screen'),
      ),
    );
  }
}
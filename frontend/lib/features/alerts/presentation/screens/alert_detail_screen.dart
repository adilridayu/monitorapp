import 'package:flutter/material.dart';

class AlertDetailScreen extends StatelessWidget {
  final String alertId;

  const AlertDetailScreen({super.key, required this.alertId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Alert Detail: $alertId'),
      ),
      body: Center(
        child: Text('Alert Detail Screen for $alertId'),
      ),
    );
  }
}
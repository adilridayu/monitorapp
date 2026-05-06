import 'package:flutter/material.dart';

class StockMovementScreen extends StatelessWidget {
  const StockMovementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock Movement'),
      ),
      body: const Center(
        child: Text('Stock Movement Screen'),
      ),
    );
  }
}
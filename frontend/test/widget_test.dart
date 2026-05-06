// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:warehouse_intelligence/main.dart';
import 'package:warehouse_intelligence/features/auth/presentation/screens/login_screen.dart';

void main() {
  testWidgets('Login screen displays correctly', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    // Verify that the app title is displayed
    expect(find.text('Warehouse Intelligence'), findsOneWidget);
    expect(find.text('Sign in to continue'), findsOneWidget);
    
    // Verify that the warehouse icon is displayed
    expect(find.byIcon(Icons.warehouse), findsOneWidget);
    
    // Verify that form fields are present
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    
    // Verify that the sign in button is present
    expect(find.text('Sign In'), findsOneWidget);
    
    // Verify version info
    expect(find.text('Version 1.0.0'), findsOneWidget);
  });

  testWidgets('Login form validation', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    // Tap the sign in button without entering data
    await tester.tap(find.text('Sign In'));
    await tester.pump();

    // Verify validation messages appear
    expect(find.text('Please enter your email'), findsOneWidget);
    
    // Enter invalid email
    await tester.enterText(find.byType(TextFormField).at(0), 'invalid-email');
    await tester.tap(find.text('Sign In'));
    await tester.pump();
    
    // Verify invalid email validation
    expect(find.text('Please enter a valid email'), findsOneWidget);
    
    // Enter valid email but short password
    await tester.enterText(find.byType(TextFormField).at(0), 'test@example.com');
    await tester.enterText(find.byType(TextFormField).at(1), '123');
    await tester.tap(find.text('Sign In'));
    await tester.pump();
    
    // Verify password validation
    expect(find.text('Password must be at least 6 characters'), findsOneWidget);
  });

  testWidgets('Password visibility toggle works', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    // Initially the visibility icon should be visible (eye outlined)
    expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
    
    // Tap the visibility toggle
    await tester.tap(find.byIcon(Icons.visibility_outlined));
    await tester.pump();
    
    // Now the visibility off icon should be shown
    expect(find.byIcon(Icons.visibility_off_outlined), findsOneWidget);
    
    // Tap again to hide
    await tester.tap(find.byIcon(Icons.visibility_off_outlined));
    await tester.pump();
    
    // Eye icon should be back
    expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
  });
}